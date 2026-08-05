import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import ffmpeg from "ffmpeg-static";
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";

loadEnv();

const args = parseArgs(process.argv.slice(2));
const lessonNo = positiveInteger(args.lesson || args.lessonId || "", "lesson");
const autoApprove = args.autoApprove === true || args["auto-approve"] === true;
const root = process.cwd();
const inputPath = join(root, "data", "ocr", `lesson${lessonNo}-vocabulary.json`);
const outputPath = join(root, "data", "ocr", `lesson${lessonNo}-vocabulary-audio-verified.json`);
const cacheDir = join(root, "data", "ocr", "audio-cache", `lesson${lessonNo}`);
const sourceData = readJson(inputPath);
const speechKey = process.env.AZURE_SPEECH_KEY;
const speechRegion = normalizeRegion(process.env.AZURE_SPEECH_REGION);

if (!speechKey || !speechRegion) throw new Error("Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION.");

const track = vocabularyItems(sourceData);

if (!track.length) {
  throw new Error(`No vocabulary items found in ${inputPath}.`);
}

const output = {
  schemaVersion: 1,
  lessonId: `lesson${lessonNo}`,
  generatedAt: new Date().toISOString(),
  method: "azure-speech-word-alignment",
  reviewStatus: autoApprove ? "approved" : "pending",
  tracks: []
};

const audioPath = await cachedAudioPath(`lesson${lessonNo}`, "lesson_words.mp3");
const transcription = await transcribe(audioPath, speechKey, speechRegion);
const words = normalizeWords(transcription.phrases || []);
const assignments = alignItems(track, words);
const reviewAt = new Date().toISOString();

const segments = assignments.map((assignment, index) => ({
  id: assignment.item.id,
  trackId: "lesson_words",
  sourceUrl: textbookAudioUrl(lessonNo, "lesson_words.mp3"),
  localAudioPath: relativeToRoot(audioPath),
  itemIndex: index + 1,
  text: assignment.item.kana || assignment.item.writing || assignment.item.rawText || "",
  label: assignment.item.writing || assignment.item.kana || assignment.item.id || "",
  start: round(Math.max(0, assignment.start - 0.04)),
  end: round(assignment.end + 0.06),
  duration: round(Math.max(0, assignment.end - assignment.start + 0.1)),
  speechUnitCount: assignment.words.length,
  wordCount: assignment.words.length,
  matchScore: round(assignment.score),
  asrText: assignment.words.map((word) => word.text).join(" "),
  wordIndexes: assignment.words.map((word) => word.index),
  method: "azure-speech-word-alignment",
  confidence: scoreToConfidence(assignment.score),
  review: {
    status: autoApprove ? "approved" : "pending",
    reviewedAt: autoApprove ? reviewAt : null,
    note: autoApprove ? "Automatically approved by the vocabulary ASR alignment workflow." : "",
    matchScore: round(assignment.score),
    asrText: assignment.words.map((word) => word.text).join(" ")
  }
}));

segments.forEach((segment, index) => {
  track[index].audioSegment = segment;
});

const warnings = [];
const lowConfidence = segments.filter((segment) => segment.matchScore < 0.65);
if (lowConfidence.length) {
  warnings.push(`${lowConfidence.length} item(s) aligned with low ASR similarity.`);
}
if (words.length !== segments.length) {
  warnings.push(`Detected ${words.length} word token(s) for ${segments.length} vocabulary item(s).`);
}

output.tracks.push({
  trackId: "lesson_words",
  sourceUrl: textbookAudioUrl(lessonNo, "lesson_words.mp3"),
  localAudioPath: relativeToRoot(audioPath),
  outputPath: relativeToRoot(outputPath),
  sourceAudioSha256: sha256(audioPath),
  duration: round(words.at(-1)?.end || 0),
  expectedItems: track.length,
  detectedWordCount: words.length,
  alignedItems: segments.length,
  warnings,
  transcription: {
    provider: "azure-speech-sdk-continuous-recognition",
    locale: "ja-JP",
    text: transcription.combinedText,
    phrases: transcription.phrases,
    words
  },
  segments
});

const verified = { ...sourceData, vocabulary: sourceData.vocabulary.map((word, index) => ({ ...word, audioSegment: segments[index] })) };
verified.audioAlignment = output;
writeJson(outputPath, verified);

process.stdout.write(`${JSON.stringify({
  lessonId: output.lessonId,
  outputPath: relativeToRoot(outputPath),
  track: output.tracks[0]
}, null, 2)}\n`);

function vocabularyItems(data) {
  return (data.vocabulary || []).map((word, index) => ({
    id: word.id || `lesson${lessonNo}-word-${index + 1}`,
    index,
    kana: word.kana || "",
    writing: word.writing || "",
    rawText: word.rawText || "",
    label: word.writing || word.kana || word.id || ""
  }));
}

function alignItems(items, words) {
  const maxGroupSize = 8;
  const skipCost = 0.02;
  const dp = Array.from({ length: items.length + 1 }, () => Array(words.length + 1).fill(Infinity));
  const back = Array.from({ length: items.length + 1 }, () => Array(words.length + 1).fill(null));
  dp[0][0] = 0;

  for (let j = 1; j <= words.length; j += 1) {
    dp[0][j] = dp[0][j - 1] + skipCost;
    back[0][j] = { kind: "skip-word" };
  }

  for (let i = 1; i <= items.length; i += 1) {
    for (let j = 0; j <= words.length; j += 1) {
      if (!Number.isFinite(dp[i - 1][j])) continue;
      for (let size = 1; size <= maxGroupSize && j + size <= words.length; size += 1) {
        const group = words.slice(j, j + size);
        const score = itemScore(items[i - 1], group);
        const cost = dp[i - 1][j] + (1 - score) + (size - 1) * 0.03;
        if (cost < dp[i][j + size]) {
          dp[i][j + size] = cost;
          back[i][j + size] = { kind: "match", from: j, score };
        }
      }
    }

    for (let j = 1; j <= words.length; j += 1) {
      const cost = dp[i][j - 1] + skipCost;
      if (cost < dp[i][j]) {
        dp[i][j] = cost;
        back[i][j] = { kind: "skip-word" };
      }
    }
  }

  let j = dp[items.length].reduce((best, value, index) => value < dp[items.length][best] ? index : best, 0);
  const result = [];
  for (let i = items.length; i > 0;) {
    const step = back[i][j];
    if (step?.kind === "match") {
      const group = words.slice(step.from, j);
      result.unshift({
        item: items[i - 1],
        words: group,
        start: group[0].start,
        end: group[group.length - 1].end,
        score: step.score
      });
      j = step.from;
      i -= 1;
      continue;
    }
    if (j === 0) throw new Error("Could not build a monotonic vocabulary alignment.");
    j -= 1;
  }
  return result;
}

function itemScore(item, words) {
  const actual = normalizeWordText(words.map((word) => word.text).join(""));
  const refs = referenceStrings(item);
  const scores = refs.map((ref) => similarity(ref, actual)).filter(Number.isFinite);
  return scores.length ? Math.max(...scores) : 0;
}

function referenceStrings(item) {
  const refs = [];
  for (const value of [item.kana, item.writing]) {
    const normalized = normalizeWordText(value);
    if (normalized) refs.push(normalized);
  }
  if (!refs.length && item.rawText) {
    refs.push(normalizeWordText(item.rawText.replace(/\[[^\]]*\]/g, "")));
  }
  return [...new Set(refs)];
}

function normalizeWords(phrases) {
  let globalIndex = 0;
  return phrases.flatMap((phrase, phraseIndex) => {
    const words = (phrase.words || []).map((word, wordIndex) => {
      const offset = Number(word.start ?? word.offset ?? 0);
      const duration = Number(word.duration ?? word.Duration ?? 0);
      return {
        index: globalIndex += 1,
        text: String(word.text || "").trim(),
        start: millis(offset),
        end: millis(offset + duration),
        confidence: Number(word.confidence || phrase.confidence || 0),
        phraseIndex,
        wordIndex
      };
    }).filter((word) => word.end > word.start && word.text);
    if (words.length) return words;
    const fallbackText = String(phrase.text || "").trim();
    if (!fallbackText) return [];
    const offset = Number(phrase.offset ?? 0);
    const duration = Number(phrase.duration ?? 0);
    return [{
      index: globalIndex += 1,
      text: fallbackText,
      start: millis(offset),
      end: millis(offset + duration),
      confidence: Number(phrase.confidence || 0),
      phraseIndex,
      wordIndex: 0
    }];
  }).filter((word) => word.end > word.start);
}

async function transcribe(audioPath, key, region) {
  const wavPath = toWav(audioPath);
  const config = speechsdk.SpeechConfig.fromSubscription(key, region);
  config.speechRecognitionLanguage = "ja-JP";
  config.outputFormat = speechsdk.OutputFormat.Detailed;
  config.requestWordLevelTimestamps();
  const audio = speechsdk.AudioConfig.fromWavFileInput(readFileSync(wavPath), basename(wavPath));
  const recognizer = new speechsdk.SpeechRecognizer(config, audio);
  const phrases = [];

  return new Promise((resolve, reject) => {
    let finished = false;
    const finish = (error) => {
      if (finished) return;
      finished = true;
      recognizer.close();
      if (error) reject(error);
      else resolve({
        phrases,
        combinedText: phrases.map((phrase) => phrase.text).join(" ").trim()
      });
    };

    recognizer.recognized = (_sender, event) => {
      if (event.result.reason !== speechsdk.ResultReason.RecognizedSpeech) return;
      const raw = event.result.properties.getProperty(speechsdk.PropertyId.SpeechServiceResponse_JsonResult);
      const detailed = raw ? JSON.parse(raw) : {};
      const best = detailed.NBest?.[0] || {};
      phrases.push({
        text: event.result.text || best.Display || best.Lexical || "",
        offset: event.result.offset,
        duration: event.result.duration,
        confidence: best.Confidence ?? 0,
        words: (best.Words || []).map((word) => ({
          text: word.Word || word.word || "",
          start: word.Offset ?? word.offset ?? 0,
          duration: word.Duration ?? word.duration ?? 0,
          confidence: word.Confidence ?? word.confidence ?? best.Confidence ?? 0
        }))
      });
    };
    recognizer.canceled = (_sender, event) => {
      if (event.reason === speechsdk.CancellationReason.EndOfStream) finish();
      else finish(new Error(`Azure continuous recognition canceled: ${event.errorDetails || event.reason}`));
    };
    recognizer.sessionStopped = () => finish();
    recognizer.startContinuousRecognitionAsync(undefined, (error) => finish(new Error(error)));
  });
}

function scoreToConfidence(score) {
  if (score >= 0.82) return "high";
  if (score >= 0.68) return "medium";
  return "needs-review";
}

function toWav(audioPath) {
  const dir = mkdtempSync(join(tmpdir(), "japaflow-vocab-align-"));
  const wavPath = join(dir, "audio.wav");
  const result = spawnSync(ffmpeg, ["-y", "-i", audioPath, "-ac", "1", "-ar", "16000", "-acodec", "pcm_s16le", wavPath], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${result.stderr}`);
  return wavPath;
}

function cachedAudioPath(lessonKey, filename) {
  const audioPath = join(cacheDir, filename);
  if (existsSync(audioPath)) return Promise.resolve(audioPath);
  return fetch(textbookAudioUrl(lessonNo, filename)).then(async (response) => {
    if (!response.ok) throw new Error(`Audio download failed for ${filename}: HTTP ${response.status}`);
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(audioPath, Buffer.from(await response.arrayBuffer()));
    return audioPath;
  });
}

function textbookAudioUrl(lesson, filename) {
  return `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit${Math.ceil(lesson / 4)}/lesson${lesson}/${filename}`;
}

function normalizeWordText(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\s\p{P}\p{S}]/gu, "")
    .toLowerCase();
}

function similarity(left, right) {
  if (!left || !right) return 0;
  const distance = levenshtein(left, right);
  return Math.max(0, 1 - distance / Math.max(left.length, right.length));
}

function levenshtein(left, right) {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1)
      );
    }
    previous = current;
  }
  return previous[right.length];
}

function relativeToRoot(filePath) {
  return filePath.slice(root.length + 1).replaceAll("\\", "/");
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function readJson(filePath) {
  if (!existsSync(filePath)) throw new Error(`Missing input JSON: ${filePath}`);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (!argv[index].startsWith("--")) continue;
    const key = argv[index].slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) result[key] = true;
    else {
      result[key] = next;
      index += 1;
    }
  }
  return result;
}

function positiveInteger(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) throw new Error(`Invalid ${label}: ${value}`);
  return number;
}

function normalizeRegion(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
}

function loadEnv() {
  const filePath = join(process.cwd(), ".env");
  if (!existsSync(filePath)) return;
  for (const raw of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    const index = line.indexOf("=");
    if (!line || line.startsWith("#") || index <= 0) continue;
    const key = line.slice(0, index).trim();
    if (process.env[key] !== undefined) continue;
    process.env[key] = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
  }
}

function round(value) {
  return Math.round(Number(value) * 1000) / 1000;
}

function millis(value) {
  return round(Number(value || 0) / 10_000_000);
}
