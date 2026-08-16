import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import ffmpeg from "ffmpeg-static";
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";

loadEnv();

const args = parseArgs(process.argv.slice(2));
const lessonNo = positiveInteger(args.lesson || args.lessonId || "", "lesson");
const root = process.cwd();
const inputPath = join(root, "data", "ocr", `lesson${lessonNo}-text.json`);
const outputPath = join(root, "data", "ocr", `lesson${lessonNo}-text-audio-verified.json`);
const cacheDir = join(root, "data", "ocr", "audio-cache", `lesson${lessonNo}`);
const sourceData = readJson(inputPath);
const autoApprove = args.autoApprove === true || args["auto-approve"] === true;
const reuseExistingAsr = args.reuseExistingAsr === true || args["reuse-existing-asr"] === true;
const speechKey = process.env.AZURE_SPEECH_KEY;
const speechRegion = normalizeRegion(process.env.AZURE_SPEECH_REGION);
const existingData = reuseExistingAsr && existsSync(outputPath) ? readJson(outputPath) : null;
const vadNoiseThreshold = "-35dB";
const vadMinimumSilence = 0.18;
const vadFallbackNoiseThreshold = "-28dB";
const vadFallbackMinimumSilence = 0.08;
const touchingBoundaryMinimumSilence = 0.1;
const azureStartPadding = 0.25;
const localVadStartPadding = 0.06;
const endPadding = 0.12;

if (!reuseExistingAsr && (!speechKey || !speechRegion)) throw new Error("Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION.");
if (reuseExistingAsr && !existingData) throw new Error(`Cannot reuse ASR: missing ${relativeToRoot(outputPath)}.`);

const tracks = [
  { id: "lesson_basic", filename: "lesson_basic.mp3", items: basicItems(sourceData) },
  { id: "lesson_apps", filename: "lesson_apps.mp3", items: applicationItems(sourceData) }
].filter((track) => track.items.length);

const generatedAt = new Date().toISOString();
const output = {
  schemaVersion: 2,
  lessonId: `lesson${lessonNo}`,
  generatedAt,
  method: "azure-speech-sentence-alignment-with-boundary-padding",
  reviewStatus: "pending",
  tracks: []
};

for (const track of tracks) {
  const sourceUrl = textbookAudioUrl(lessonNo, track.filename);
  const existingTrack = existingData?.audioAlignment?.tracks?.find((candidate) => candidate.id === track.id);
  const audioPath = reuseExistingAsr ? cachedAudioPathIfPresent(track.filename) : await cachedAudioPath(track.filename);
  const speechRegions = audioPath ? detectSpeechRegions(audioPath) : [];
  const boundarySpeechRegions = audioPath ? speechRegionsForThreshold(audioPath, vadFallbackNoiseThreshold, vadFallbackMinimumSilence) : [];
  const assignments = reuseExistingAsr
    ? reuseAssignments(track, existingData)
    : alignItems(track.items, phraseUnits(normalizePhrases((await transcribe(audioPath, speechKey, speechRegion, track.items)).phrases || [])));
  const segments = assignments.map((assignment, index) => sentenceSegmentFor(assignment, assignments, index, sourceUrl, generatedAt, speechRegions, boundarySpeechRegions));
  const pendingCount = segments.filter((segment) => segment.review.status !== "approved").length;
  for (const segment of segments) {
    const sourceItem = findTextItem(sourceData, segment.id);
    if (sourceItem) sourceItem.audioSegment = segment;
  }
  output.tracks.push({
    id: track.id,
    sourceUrl,
    sourceAudioSha256: existingTrack?.sourceAudioSha256 || sha256(audioPath),
    expectedItems: track.items.length,
    alignedItems: segments.length,
    detectedUnitCount: existingTrack?.detectedUnitCount || assignments.reduce((sum, assignment) => sum + assignment.matchedRange.phraseIndexes.length, 0),
    warnings: [
      ...(pendingCount ? [`${pendingCount} item(s) require manual verification.`] : []),
      ...(reuseExistingAsr ? ["Reused prior Azure timings; no Azure request was made."] : [])
    ]
  });
}

output.reviewStatus = output.tracks.some((track) => track.warnings.some((warning) => warning.includes("require manual"))) ? "pending" : "approved";
sourceData.audioAlignment = output;
writeFileSync(outputPath, `${JSON.stringify(sourceData, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ lessonId: output.lessonId, outputPath: relativeToRoot(outputPath), reviewStatus: output.reviewStatus, tracks: output.tracks.map((track) => ({ id: track.id, items: track.alignedItems, detectedUnits: track.detectedUnitCount, warnings: track.warnings })) }, null, 2)}\n`);

function basicItems(data) {
  return [
    ...(data.basicText?.basicSentences || []).map((item) => itemFor("lesson_basic", item)),
    ...(data.basicText?.dialogues || []).flatMap((dialogue) => (dialogue.lines || []).map((item) => itemFor("lesson_basic", item)))
  ];
}

function applicationItems(data) {
  return (data.applicationText?.blocks || [])
    .filter((block) => block.type === "dialogue")
    .flatMap((block) => (block.lines || []).map((item) => itemFor("lesson_apps", item)));
}

function itemFor(trackId, item) {
  return { id: item.id, trackId, speaker: item.speaker || "", text: item.text || "", kana: item.kana || "", translationZh: item.translationZh || "" };
}

function findTextItem(data, id) {
  for (const item of data.basicText?.basicSentences || []) if (item.id === id) return item;
  for (const dialogue of data.basicText?.dialogues || []) for (const item of dialogue.lines || []) if (item.id === id) return item;
  for (const block of data.applicationText?.blocks || []) for (const item of block.lines || []) if (item.id === id) return item;
  return null;
}

async function transcribe(audioPath, key, region, items) {
  const wavPath = toWav(audioPath);
  const config = speechsdk.SpeechConfig.fromSubscription(key, region);
  config.speechRecognitionLanguage = "ja-JP";
  config.outputFormat = speechsdk.OutputFormat.Detailed;
  config.requestWordLevelTimestamps();
  const audio = speechsdk.AudioConfig.fromWavFileInput(readFileSync(wavPath), basename(wavPath));
  const recognizer = new speechsdk.SpeechRecognizer(config, audio);
  const phraseList = speechsdk.PhraseListGrammar.fromRecognizer(recognizer);
  for (const item of items) for (const phrase of [item.text, item.kana]) if (phrase) phraseList.addPhrase(phrase);
  const phrases = [];

  return new Promise((resolve, reject) => {
    let finished = false;
    const finish = (error) => {
      if (finished) return;
      finished = true;
      recognizer.close();
      if (error) reject(error);
      else resolve({ phrases });
    };
    recognizer.recognized = (_sender, event) => {
      if (event.result.reason !== speechsdk.ResultReason.RecognizedSpeech) return;
      const raw = event.result.properties.getProperty(speechsdk.PropertyId.SpeechServiceResponse_JsonResult);
      const detailed = raw ? JSON.parse(raw) : {};
      const best = detailed.NBest?.[0] || {};
      phrases.push({ text: event.result.text || best.Display || best.Lexical || "", offset: event.result.offset, duration: event.result.duration, confidence: best.Confidence ?? 0, words: (best.Words || []).map((word) => ({ text: word.Word || word.word || "", offset: word.Offset ?? word.offset ?? 0, duration: word.Duration ?? word.duration ?? 0 })) });
    };
    recognizer.canceled = (_sender, event) => event.reason === speechsdk.CancellationReason.EndOfStream ? finish() : finish(new Error(`Azure continuous recognition canceled: ${event.errorDetails || event.reason}`));
    recognizer.sessionStopped = () => finish();
    recognizer.startContinuousRecognitionAsync(undefined, (error) => finish(new Error(error)));
  });
}

function reuseAssignments(track, data) {
  return track.items.map((item) => {
    const segment = findTextItem(data, item.id)?.audioSegment;
    if (!segment) throw new Error(`Cannot reuse ASR: missing previous segment for ${item.id}.`);
    const raw = segment.rawAzureTiming || { start: Math.max(0, Number(segment.start || 0) + 0.06), end: Math.max(0, Number(segment.end || 0) - 0.08) };
    if (!(raw.end > raw.start)) throw new Error(`Cannot reuse ASR: invalid previous timing for ${item.id}.`);
    return { item, matchedRange: { rawStart: round(raw.start), rawEnd: round(raw.end), asrText: segment.asrText || "", phraseIndexes: segment.phraseIndexes || [], matchScore: Number(segment.matchScore || 0), confidence: Number(segment.asrConfidence || 0) } };
  });
}

function sentenceSegmentFor(assignment, assignments, index, sourceUrl, reviewedAt, speechRegions, boundarySpeechRegions) {
  const previous = assignments[index - 1]?.matchedRange;
  const next = assignments[index + 1]?.matchedRange;
  const currentBoundary = sentenceStartBoundary(assignment, previous, speechRegions, boundarySpeechRegions);
  const nextBoundary = next ? sentenceStartBoundary(assignments[index + 1], assignment.matchedRange, speechRegions, boundarySpeechRegions) : null;
  const { range, narrowed, refinedStart, effectiveStart } = currentBoundary;
  const startPadding = narrowed.usedVad || refinedStart.usedVad ? localVadStartPadding : azureStartPadding;
  let start = Math.max(0, effectiveStart - startPadding, previous ? previous.rawEnd + 0.02 : 0);
  const refinedEnd = refineTrailingAsrBoundary(narrowed.end, nextBoundary?.effectiveStart, boundarySpeechRegions);
  let end = Math.min(refinedEnd.end + endPadding, nextBoundary ? nextBoundary.effectiveStart - 0.02 : Infinity);
  const issues = [];
  const reviewIssues = [];
  if (narrowed.usedVad) issues.push("ASR range was narrowed to the final local speech region; verify this sentence.");
  if (refinedStart.usedVad) issues.push("ASR boundary overlapped the previous sentence and was moved to the next local speech region; verify this sentence.");
  if (refinedEnd.usedVad) issues.push("ASR boundary ended before the final local speech region; verify this sentence.");
  if (end <= start) {
    start = Math.max(0, range.rawStart - 0.06);
    end = Math.max(start + 0.12, range.rawEnd + 0.08);
    issues.push("Neighbouring ASR ranges leave no safe padding.");
    reviewIssues.push("Neighbouring ASR ranges leave no safe padding.");
  }
  const duration = round(end - start);
  if (range.matchScore < 0.65) { issues.push("Low ASR text similarity."); reviewIssues.push("Low ASR text similarity."); }
  else if (range.matchScore < 0.82) { issues.push("Moderate ASR text similarity."); reviewIssues.push("Moderate ASR text similarity."); }
  if (duration < 0.35) { issues.push("Very short sentence audio range."); reviewIssues.push("Very short sentence audio range."); }
  const approved = autoApprove && !reviewIssues.length && range.matchScore >= 0.82;
  return {
    id: assignment.item.id,
    trackId: assignment.item.trackId,
    sourceUrl,
    itemIndex: index + 1,
    speaker: assignment.item.speaker,
    text: assignment.item.text,
    start: round(start),
    end: round(end),
    duration,
    rawAzureTiming: { start: range.rawStart, end: range.rawEnd, duration: round(range.rawEnd - range.rawStart) },
    timingSource: narrowed.usedVad ? "azure-speech-range-with-local-vad-trim" : refinedStart.usedVad || refinedEnd.usedVad ? "azure-speech-boundary-with-local-vad-refinement" : "azure-speech-word-timestamp-with-boundary-padding",
    speechActivity: narrowed.speechActivity || refinedStart.speechActivity || refinedEnd.speechActivity,
    speechUnitCount: range.phraseIndexes.length,
    matchScore: range.matchScore,
    asrConfidence: range.confidence,
    asrText: range.asrText,
    phraseIndexes: range.phraseIndexes,
    method: "azure-speech-sentence-alignment-with-boundary-padding",
    confidence: approved ? "high" : scoreToConfidence(range.matchScore),
    alignmentIssues: issues,
    review: { status: approved ? "approved" : "pending", reviewedAt: approved ? reviewedAt : null, note: approved ? "Automatically approved after phrase-guided ASR alignment and boundary padding." : issues.join(" "), matchScore: range.matchScore, asrText: range.asrText }
  };
}

function sentenceStartBoundary(assignment, previous, speechRegions, boundarySpeechRegions) {
  const range = assignment.matchedRange;
  const narrowed = narrowExcessiveAsrRange(range, assignment.item.text, speechRegions);
  const refinedStart = refineTouchingAsrBoundary(range, previous, assignment.item.text, speechRegions, boundarySpeechRegions);
  return { range, narrowed, refinedStart, effectiveStart: Math.max(narrowed.start, refinedStart.start) };
}

function narrowExcessiveAsrRange(range, text, speechRegions) {
  const expectedDuration = estimatedSpeechDuration(text);
  const rawDuration = range.rawEnd - range.rawStart;
  if (!speechRegions.length || rawDuration <= Math.max(6, expectedDuration * 2.2)) {
    return { start: range.rawStart, end: range.rawEnd, usedVad: false, speechActivity: null };
  }
  const overlapping = speechRegions
    .map((region) => ({ start: Math.max(range.rawStart, region.start), end: Math.min(range.rawEnd, region.end) }))
    .filter((region) => region.end > region.start);
  const candidate = overlapping.at(-1);
  const candidateDuration = candidate ? candidate.end - candidate.start : 0;
  if (!candidate || candidate.start <= range.rawStart + 0.4 || candidateDuration < expectedDuration * 0.55 || candidateDuration > expectedDuration * 2.3) {
    return { start: range.rawStart, end: range.rawEnd, usedVad: false, speechActivity: null };
  }
  return {
    start: round(candidate.start),
    end: range.rawEnd,
    usedVad: true,
    speechActivity: { start: round(candidate.start), end: round(candidate.end), duration: round(candidateDuration), expectedDuration }
  };
}

function refineTouchingAsrBoundary(range, previous, text, speechRegions, fallbackSpeechRegions = []) {
  if (!previous || range.rawStart > previous.rawEnd + 0.04) {
    return { start: range.rawStart, usedVad: false, speechActivity: null };
  }
  return findTouchingBoundaryCandidate(range, text, speechRegions)
    || findTouchingBoundaryCandidate(range, text, fallbackSpeechRegions)
    || { start: range.rawStart, usedVad: false, speechActivity: null };
}

function findTouchingBoundaryCandidate(range, text, speechRegions) {
  if (!speechRegions.length) return null;
  const expectedDuration = estimatedSpeechDuration(text);
  const candidateIndex = speechRegions.findIndex((region) => region.start > range.rawStart + 0.08 && region.start < range.rawEnd);
  if (candidateIndex < 1) return null;
  const candidate = speechRegions[candidateIndex];
  const prior = speechRegions[candidateIndex - 1];
  const silenceDuration = candidate.start - prior.end;
  const remainingDuration = range.rawEnd - candidate.start;
  if (silenceDuration < touchingBoundaryMinimumSilence || candidate.start - range.rawStart > 1.4 || remainingDuration < expectedDuration * 0.55) {
    return null;
  }
  return {
    start: round(candidate.start),
    usedVad: true,
    speechActivity: { start: round(candidate.start), end: round(Math.min(candidate.end, range.rawEnd)), duration: round(remainingDuration), expectedDuration, precedingSilence: round(silenceDuration) }
  };
}

function refineTrailingAsrBoundary(rawEnd, nextStart, speechRegions) {
  if (!speechRegions.length) return { end: rawEnd, usedVad: false, speechActivity: null };
  const region = speechRegions.find((candidate) => candidate.start <= rawEnd + 0.04 && candidate.end > rawEnd + 0.06);
  if (!region) return { end: rawEnd, usedVad: false, speechActivity: null };
  const maximumEnd = Number.isFinite(nextStart) ? nextStart - 0.02 : Infinity;
  const end = Math.min(region.end, maximumEnd);
  if (end <= rawEnd + 0.06) return { end: rawEnd, usedVad: false, speechActivity: null };
  return {
    end: round(end),
    usedVad: true,
    speechActivity: { start: round(region.start), end: round(end), duration: round(end - region.start) }
  };
}

function estimatedSpeechDuration(text) {
  return round(Math.max(0.9, normalizeText(text).length * 0.16 + 0.45));
}

function detectSpeechRegions(audioPath) { return speechRegionsForThreshold(audioPath, vadNoiseThreshold, vadMinimumSilence); }

function speechRegionsForThreshold(audioPath, noiseThreshold, minimumSilence) {
  const result = spawnSync(ffmpeg, ["-hide_banner", "-i", audioPath, "-af", `silencedetect=noise=${noiseThreshold}:d=${minimumSilence}`, "-f", "null", "-"], { encoding: "utf8" });
  if (result.status !== 0) return [];
  const events = [...String(result.stderr || "").matchAll(/silence_(start|end):\s*([0-9.]+)/g)].map((match) => ({ kind: match[1], time: Number(match[2]) }));
  const regions = [];
  let cursor = 0;
  for (const event of events) {
    if (event.kind === "start") {
      if (event.time > cursor) regions.push({ start: cursor, end: event.time });
    } else {
      cursor = event.time;
    }
  }
  regions.push({ start: cursor, end: Infinity });
  return regions;
}

function toWav(audioPath) {
  const dir = mkdtempSync(join(tmpdir(), "japaflow-text-align-"));
  const wavPath = join(dir, "audio.wav");
  const result = spawnSync(ffmpeg, ["-y", "-i", audioPath, "-ac", "1", "-ar", "16000", "-acodec", "pcm_s16le", wavPath], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${result.stderr}`);
  return wavPath;
}

function normalizePhrases(phrases) {
  return phrases.map((phrase, index) => ({ index, text: String(phrase.text || ""), start: millis(phrase.offset), end: millis(Number(phrase.offset || 0) + Number(phrase.duration || 0)), confidence: Number(phrase.confidence || 0), words: (phrase.words || []).map((word) => ({ text: String(word.text || ""), start: millis(word.offset), end: millis(Number(word.offset || 0) + Number(word.duration || 0)) })) })).filter((phrase) => phrase.end > phrase.start);
}

function phraseUnits(phrases) {
  return phrases.flatMap((phrase) => !phrase.words.length ? [phrase] : phrase.words.map((word, index) => ({ index: phrase.index, wordIndex: index, text: word.text, start: word.start, end: word.end, confidence: phrase.confidence })));
}

function alignItems(items, phrases) {
  const maxGroupSize = 64;
  const skipCost = 0.015;
  const dp = Array.from({ length: items.length + 1 }, () => Array(phrases.length + 1).fill(Infinity));
  const back = Array.from({ length: items.length + 1 }, () => Array(phrases.length + 1).fill(null));
  dp[0][0] = 0;
  for (let phraseIndex = 1; phraseIndex <= phrases.length; phraseIndex += 1) { dp[0][phraseIndex] = dp[0][phraseIndex - 1] + skipCost; back[0][phraseIndex] = { kind: "skip" }; }
  for (let itemIndex = 1; itemIndex <= items.length; itemIndex += 1) {
    for (let phraseIndex = 0; phraseIndex <= phrases.length; phraseIndex += 1) {
      if (!Number.isFinite(dp[itemIndex - 1][phraseIndex])) continue;
      for (let size = 1; size <= maxGroupSize && phraseIndex + size <= phrases.length; size += 1) {
        const nextIndex = phraseIndex + size;
        const score = matchScore(items[itemIndex - 1], phrases.slice(phraseIndex, nextIndex));
        const cost = dp[itemIndex - 1][phraseIndex] + (1 - score) + (size - 1) * 0.002;
        if (cost < dp[itemIndex][nextIndex]) { dp[itemIndex][nextIndex] = cost; back[itemIndex][nextIndex] = { kind: "match", from: phraseIndex, score }; }
      }
    }
    for (let phraseIndex = 1; phraseIndex <= phrases.length; phraseIndex += 1) {
      const cost = dp[itemIndex][phraseIndex - 1] + skipCost;
      if (cost < dp[itemIndex][phraseIndex]) { dp[itemIndex][phraseIndex] = cost; back[itemIndex][phraseIndex] = { kind: "skip" }; }
    }
  }
  let phraseIndex = dp[items.length].reduce((best, value, index) => value < dp[items.length][best] ? index : best, 0);
  const result = Array(items.length);
  for (let itemIndex = items.length; itemIndex > 0;) {
    const step = back[itemIndex][phraseIndex];
    if (step?.kind === "match") { const group = phrases.slice(step.from, phraseIndex); result[itemIndex - 1] = { item: items[itemIndex - 1], matchedRange: matchedRangeFor(group, step.score) }; phraseIndex = step.from; itemIndex -= 1; continue; }
    if (phraseIndex === 0) throw new Error("Could not build a monotonic transcript alignment.");
    phraseIndex -= 1;
  }
  return result;
}

function matchedRangeFor(phrases, score) {
  const first = phrases[0];
  const last = phrases[phrases.length - 1];
  return { rawStart: round(first.start), rawEnd: round(last.end), asrText: phrases.map((phrase) => phrase.text).join(" "), phraseIndexes: [...new Set(phrases.map((phrase) => phrase.index))], matchScore: round(score), confidence: round(phrases.reduce((sum, phrase) => sum + phrase.confidence, 0) / phrases.length) };
}

function scoreToConfidence(score) { if (score >= 0.82) return "high"; if (score >= 0.65) return "medium"; return "needs-review"; }
function matchScore(item, phrases) { const actual = normalizeText(phrases.map((phrase) => phrase.text).join("")); const references = [item.text, item.kana].map(normalizeText).filter(Boolean); return Math.max(...references.map((reference) => similarity(reference, actual)), 0); }
function normalizeText(value) { return String(value || "").normalize("NFKC").replace(/[\s\p{P}\p{S}]/gu, "").toLowerCase(); }
function similarity(left, right) { if (!left || !right) return 0; const distance = levenshtein(left, right); return Math.max(0, 1 - distance / Math.max(left.length, right.length)); }
function levenshtein(left, right) { let previous = Array.from({ length: right.length + 1 }, (_, index) => index); for (let row = 1; row <= left.length; row += 1) { const current = [row]; for (let column = 1; column <= right.length; column += 1) current[column] = Math.min(current[column - 1] + 1, previous[column] + 1, previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1)); previous = current; } return previous[right.length]; }
function millis(value) { return round(Number(value || 0) / 10_000_000); }
function textbookAudioUrl(lesson, filename) { return `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit${Math.ceil(lesson / 4)}/lesson${lesson}/${filename}`; }
async function cachedAudioPath(filename) { const audioPath = join(cacheDir, filename); if (existsSync(audioPath)) return audioPath; const response = await fetch(textbookAudioUrl(lessonNo, filename)); if (!response.ok) throw new Error(`Audio download failed for ${filename}: HTTP ${response.status}`); mkdirSync(cacheDir, { recursive: true }); writeFileSync(audioPath, Buffer.from(await response.arrayBuffer())); return audioPath; }
function cachedAudioPathIfPresent(filename) { const audioPath = join(cacheDir, filename); return existsSync(audioPath) ? audioPath : null; }
function sha256(filePath) { return createHash("sha256").update(readFileSync(filePath)).digest("hex"); }
function relativeToRoot(filePath) { return filePath.slice(root.length + 1).replaceAll("\\", "/"); }
function readJson(filePath) { if (!existsSync(filePath)) throw new Error(`Missing input JSON: ${filePath}`); return JSON.parse(readFileSync(filePath, "utf8")); }
function loadEnv() { const filePath = join(process.cwd(), ".env"); if (!existsSync(filePath)) return; for (const raw of readFileSync(filePath, "utf8").split(/\r?\n/)) { const line = raw.trim(); const index = line.indexOf("="); if (!line || line.startsWith("#") || index <= 0) continue; const key = line.slice(0, index).trim(); if (process.env[key] !== undefined) continue; process.env[key] = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, ""); } }
function parseArgs(argv) { const result = {}; for (let index = 0; index < argv.length; index += 1) { if (!argv[index].startsWith("--")) continue; const key = argv[index].slice(2); const next = argv[index + 1]; if (!next || next.startsWith("--")) result[key] = true; else { result[key] = next; index += 1; } } return result; }
function positiveInteger(value, label) { const number = Number(value); if (!Number.isInteger(number) || number < 1) throw new Error(`Invalid ${label}: ${value}`); return number; }
function normalizeRegion(value) { return String(value || "").trim().toLowerCase().replace(/\s+/g, ""); }
function round(value) { return Math.round(Number(value) * 1000) / 1000; }
