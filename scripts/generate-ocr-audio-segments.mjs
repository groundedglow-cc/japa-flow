import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative } from "node:path";
import ffmpeg from "ffmpeg-static";

const root = process.cwd();
const baseAudioUrl = "https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio";
const defaultProfiles = [
  { noiseDb: -34, minSilence: 0.18 },
  { noiseDb: -32, minSilence: 0.16 },
  { noiseDb: -36, minSilence: 0.2 },
  { noiseDb: -25, minSilence: 0.12 },
  { noiseDb: -30, minSilence: 0.14 },
  { noiseDb: -38, minSilence: 0.22 },
  { noiseDb: -28, minSilence: 0.12 },
  { noiseDb: -40, minSilence: 0.24 },
  { noiseDb: -44, minSilence: 0.28 }
];

const args = parseArgs(process.argv.slice(2));
const lessonNo = numberArg(args.lesson || args.lessonId || "1", "lesson");
const target = String(args.target || "all");
const outDir = join(root, String(args.outDir || "data/ocr"));
const cacheDir = join(outDir, "audio-cache", `lesson${lessonNo}`);
const padSeconds = numericArg(args.pad, 0.035);
const force = Boolean(args.force);

if (!["all", "vocabulary", "text"].includes(target)) {
  throw new Error("--target must be all, vocabulary, or text.");
}

const startedAt = new Date().toISOString();
const result = {
  lessonId: lessonNo,
  target,
  generatedAt: startedAt,
  outputs: {},
  summaries: []
};

if (target === "all" || target === "vocabulary") {
  const vocabularyData = await enrichVocabulary();
  result.vocabularyData = vocabularyData;
}

if (target === "all" || target === "text") {
  const textData = await enrichText();
  result.textData = textData;
}

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

async function enrichVocabulary() {
  const inputPath = join(outDir, `lesson${lessonNo}-vocabulary.json`);
  const outputPath = join(outDir, `lesson${lessonNo}-vocabulary-audio.json`);
  const data = readJson(inputPath);
  const items = (data.vocabulary || []).map((word, index) => ({
    id: word.id || `lesson${lessonNo}-word-${index + 1}`,
    text: word.kana || word.writing || word.rawText || "",
    label: word.writing || word.kana || word.id || "",
    index,
    unitCount: vocabularyUnitCount(word),
    apply(segment) {
      word.audioSegment = segment;
    }
  }));
  const summary = await alignTrack({
    trackId: "lesson_words",
    sourceUrl: args.wordsUrl || textbookAudioUrl(lessonNo, "lesson_words.mp3"),
    groups: itemGroups(items),
    outputPath
  });
  data.audioAlignment = {
    ...(data.audioAlignment || {}),
    generatedAt: startedAt,
    method: "ffmpeg-silencedetect-order",
    tracks: {
      ...(data.audioAlignment?.tracks || {}),
      lesson_words: summary.track
    }
  };
  writeJson(outputPath, data);
  result.outputs.vocabulary = relative(root, outputPath);
  result.summaries.push(summary.publicSummary);
  return data;
}

async function enrichText() {
  const inputPath = join(outDir, `lesson${lessonNo}-text.json`);
  const outputPath = join(outDir, `lesson${lessonNo}-text-audio.json`);
  const data = readJson(inputPath);
  const basicGroups = collectBasicTextGroups(data);
  const appGroups = collectApplicationTextGroups(data);
  const tracks = {};

  if (basicGroups.some((group) => group.kind === "item")) {
    const summary = await alignTrack({
      trackId: "lesson_basic",
      sourceUrl: args.basicUrl || textbookAudioUrl(lessonNo, "lesson_basic.mp3"),
      groups: basicGroups,
      outputPath
    });
    tracks.lesson_basic = summary.track;
    result.summaries.push(summary.publicSummary);
  }

  if (appGroups.some((group) => group.kind === "item")) {
    const summary = await alignTrack({
      trackId: "lesson_apps",
      sourceUrl: args.appsUrl || textbookAudioUrl(lessonNo, "lesson_apps.mp3"),
      groups: appGroups,
      outputPath
    });
    tracks.lesson_apps = summary.track;
    result.summaries.push(summary.publicSummary);
  }

  data.audioAlignment = {
    ...(data.audioAlignment || {}),
    generatedAt: startedAt,
    method: "ffmpeg-silencedetect-order",
    tracks: {
      ...(data.audioAlignment?.tracks || {}),
      ...tracks
    }
  };
  writeJson(outputPath, data);
  result.outputs.text = relative(root, outputPath);
  return data;
}

async function alignTrack({ trackId, sourceUrl, groups, outputPath }) {
  const audioPath = await cachedAudioPath(trackId, sourceUrl);
  const expectedUnits = groups.reduce((sum, group) => sum + group.unitCount, 0);
  const itemGroupsOnly = groups.filter((group) => group.kind === "item");
  const skippedUnits = groups.reduce((sum, group) => sum + (group.kind === "skip" ? group.unitCount : 0), 0);
  const detection = detectBestIntervals(audioPath, expectedUnits);
  const fitted = fitIntervalsToCount(detection.intervals, expectedUnits, trackId);
  const warnings = [];

  if (detection.rawIntervalCount !== expectedUnits) {
    warnings.push(`${trackId}: detected ${detection.rawIntervalCount} speech interval(s), mapped to ${expectedUnits} speech unit(s).`);
  }
  if (fitted.adjustment !== "none") warnings.push(`${trackId}: interval adjustment = ${fitted.adjustment}.`);

  const segments = [];
  let cursor = 0;
  for (const group of groups) {
    const intervalGroup = fitted.intervals.slice(cursor, cursor + group.unitCount);
    cursor += group.unitCount;
    if (group.kind !== "item") continue;
    const item = group.item;
    const interval = mergeIntervalGroup(intervalGroup);
    const padded = padInterval(interval, detection.duration, padSeconds);
    segments.push({
      id: item.id,
      trackId,
      sourceUrl,
      localAudioPath: relative(root, audioPath),
      itemIndex: segments.length + 1,
      text: item.text,
      label: item.label,
      start: roundTime(padded.start),
      end: roundTime(padded.end),
      duration: roundTime(Math.max(0, padded.end - padded.start)),
      speechUnitCount: group.unitCount,
      method: "ffmpeg-silencedetect-order",
      confidence: detection.rawIntervalCount === expectedUnits ? "high" : "needs-review"
    });
  }

  segments.forEach((segment, index) => itemGroupsOnly[index]?.item?.apply(segment));

  const track = {
    trackId,
    sourceUrl,
    localAudioPath: relative(root, audioPath),
    outputPath: relative(root, outputPath),
    duration: roundTime(detection.duration),
    expectedItems: itemGroupsOnly.length,
    expectedSpeechUnits: expectedUnits,
    skippedSpeechUnits: skippedUnits,
    detectedSpeechIntervals: detection.rawIntervalCount,
    mappedSegments: segments.length,
    selectedProfile: detection.profile,
    warnings,
    segments
  };

  return {
    track,
    publicSummary: {
      trackId,
      sourceUrl,
      duration: track.duration,
      expectedItems: itemGroupsOnly.length,
      expectedSpeechUnits: expectedUnits,
      skippedSpeechUnits: skippedUnits,
      detectedSpeechIntervals: detection.rawIntervalCount,
      mappedSegments: segments.length,
      selectedProfile: detection.profile,
      warnings
    }
  };
}

function collectBasicTextGroups(data) {
  const groups = [];
  (data.basicText?.basicSentences || []).forEach((sentence, index) => {
    groups.push(skipGroup(`basic-sentence-label-${index + 1}`));
    groups.push(groupForTextItem(textItem(sentence, `basic-sentence-${index + 1}`, index, basicSentenceUnitCount(sentence))));
  });
  (data.basicText?.dialogues || []).forEach((dialogue, dialogueIndex) => {
    groups.push(skipGroup(`basic-dialogue-label-${dialogue.label || dialogueIndex + 1}`));
    (dialogue.lines || []).forEach((line, lineIndex) => {
      groups.push(groupForTextItem(textItem(line, `basic-dialogue-${dialogueIndex + 1}-line-${lineIndex + 1}`, groups.length, dialogueLineUnitCount(line))));
    });
  });
  return groups;
}

function collectApplicationTextGroups(data) {
  const groups = [];
  const preambleUnits = applicationPreambleUnitCount();
  if (preambleUnits > 0) groups.push(skipGroup("application-title-and-preamble", preambleUnits));
  (data.applicationText?.blocks || []).forEach((block, blockIndex) => {
    if (block.type !== "dialogue") return;
    (block.lines || []).forEach((line, lineIndex) => {
      groups.push(groupForTextItem(textItem(line, `app-block-${blockIndex + 1}-line-${lineIndex + 1}`, groups.length, dialogueLineUnitCount(line))));
    });
  });
  return groups;
}

function textItem(line, fallbackId, index, unitCount) {
  return {
    id: line.id || fallbackId,
    text: line.text || line.kana || line.rawText || "",
    label: line.speaker ? `${line.speaker}: ${line.text || ""}` : line.text || line.id || "",
    index,
    unitCount,
    apply(segment) {
      line.audioSegment = segment;
    }
  };
}

function itemGroups(items) {
  return items.map(groupForTextItem);
}

function groupForTextItem(item) {
  return {
    kind: "item",
    item,
    unitCount: Math.max(1, Number(item.unitCount) || 1)
  };
}

function skipGroup(id, unitCount = 1) {
  return {
    kind: "skip",
    id,
    unitCount: Math.max(1, Number(unitCount) || 1)
  };
}

function mergeIntervalGroup(intervals) {
  const values = intervals.filter(Boolean);
  if (!values.length) return { start: 0, end: 0 };
  return {
    start: values[0].start,
    end: values[values.length - 1].end
  };
}

function vocabularyUnitCount(word) {
  const counts = [word?.kana, word?.writing, word?.rawText]
    .filter(Boolean)
    .map((value) => String(value).split(/[／/]/).map((part) => part.trim()).filter(Boolean).length);
  return Math.max(1, Math.min(4, Math.max(...counts)));
}

function basicSentenceUnitCount(sentence) {
  const text = normalizeJapaneseText(sentence?.text || sentence?.kana || "");
  if (!text) return 1;
  return 2;
}

function dialogueLineUnitCount(line) {
  const text = normalizeJapaneseText(line?.text || line?.kana || "");
  if (!text) return 1;
  if (text === "はい、そうです。") return 1;
  const clauses = text
    .split(/(?<=[。？！?])/u)
    .map((part) => part.trim())
    .filter(Boolean);
  const count = clauses.reduce((sum, clause) => sum + clauseUnitCount(clause), 0);
  return Math.max(1, count);
}

function clauseUnitCount(clause) {
  let value = stripTerminalPunctuation(clause);
  if (!value) return 0;
  let count = 0;
  for (const lead of ["はい", "いいえ", "あっ"]) {
    if (value === lead) return count + 1;
    if (value.startsWith(`${lead}、`) || value.startsWith(`${lead},`)) {
      count += 1;
      value = value.slice(lead.length + 1).trim();
      break;
    }
  }
  return count + commaPartsUnitCount(value);
}

function commaPartsUnitCount(value) {
  return value
    .split(/[、,]/u)
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((sum, part) => sum + phraseUnitCount(part), 0);
}

function phraseUnitCount(value) {
  const compact = normalizeJapaneseText(value).replace(/\s+/g, "");
  if (!compact) return 0;
  if (/李秀麗さんですか/u.test(compact)) return 3;
  if (/JC企画の社員ですか/u.test(compact)) return 2;
  if (/わたしは吉田じゃありません/u.test(compact)) return 2;
  return 1;
}

function applicationPreambleUnitCount() {
  if (args.appsPreambleUnits !== undefined) return numericArg(args.appsPreambleUnits, 0);
  return lessonNo === 1 ? 10 : 0;
}

function normalizeJapaneseText(value) {
  return String(value || "")
    .replace(/\u3000/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTerminalPunctuation(value) {
  return normalizeJapaneseText(value).replace(/[。？！?]+$/u, "").trim();
}

function detectBestIntervals(audioPath, expectedCount) {
  const profiles = profileCandidates();
  const runs = profiles.map((profile) => {
    const detected = detectSpeechIntervals(audioPath, profile);
    const score = detectionScore(detected.intervals.length, expectedCount);
    return { ...detected, profile, score, rawIntervalCount: detected.intervals.length };
  });
  runs.sort((a, b) => a.score - b.score || Math.abs(a.rawIntervalCount - expectedCount) - Math.abs(b.rawIntervalCount - expectedCount));
  return runs[0];
}

function profileCandidates() {
  if (args.noiseDb || args.minSilence) {
    return [{
      noiseDb: numericArg(args.noiseDb, -34),
      minSilence: numericArg(args.minSilence, 0.18)
    }];
  }
  return defaultProfiles;
}

function detectionScore(count, expected) {
  if (count === expected) return 0;
  if (count > expected) return count - expected + 0.25;
  return (expected - count) * 2 + 0.5;
}

function detectSpeechIntervals(audioPath, profile) {
  const proc = spawnSync(ffmpeg, [
    "-hide_banner",
    "-i", audioPath,
    "-af", `silencedetect=noise=${profile.noiseDb}dB:d=${profile.minSilence}`,
    "-f", "null",
    "-"
  ], { encoding: "utf8" });

  const stderr = proc.stderr || "";
  if (proc.status !== 0) throw new Error(`ffmpeg silencedetect failed for ${audioPath}: ${stderr}`);

  const duration = parseDuration(stderr);
  if (!duration) throw new Error(`Could not parse audio duration for ${audioPath}.`);

  const events = parseSilenceEvents(stderr);
  const intervals = [];
  let cursor = 0;
  for (const event of events) {
    if (event.start > cursor) intervals.push({ start: cursor, end: event.start });
    cursor = Math.max(cursor, event.end);
  }
  if (duration > cursor) intervals.push({ start: cursor, end: duration });

  return {
    duration,
    intervals: intervals
      .map((interval) => trimTinyEdges(interval, duration))
      .filter((interval) => interval.end - interval.start >= 0.08)
  };
}

function parseSilenceEvents(stderr) {
  const starts = [];
  const events = [];
  for (const line of stderr.split(/\r?\n/)) {
    const startMatch = line.match(/silence_start:\s*([0-9.]+)/);
    if (startMatch) {
      starts.push(Number(startMatch[1]));
      continue;
    }
    const endMatch = line.match(/silence_end:\s*([0-9.]+)/);
    if (endMatch && starts.length) {
      const start = starts.shift();
      const end = Number(endMatch[1]);
      if (Number.isFinite(start) && Number.isFinite(end) && end > start) events.push({ start, end });
    }
  }
  return events;
}

function parseDuration(stderr) {
  const match = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}

function trimTinyEdges(interval, duration) {
  return {
    start: Math.max(0, Math.min(duration, interval.start)),
    end: Math.max(0, Math.min(duration, interval.end))
  };
}

function fitIntervalsToCount(intervals, expectedCount, trackId = "") {
  if (!expectedCount) return { intervals: [], adjustment: "none" };
  const isVocabularyTrack = trackId === "lesson_words";
  let fitted = isVocabularyTrack
    ? applyManualVocabularyIntervalFixes(intervals.map((interval) => ({ ...interval })), expectedCount)
    : intervals.map((interval) => ({ ...interval }));
  let adjustment = "none";

  while (fitted.length > expectedCount) {
    if (isVocabularyTrack) {
      adjustment = adjustment === "none" ? "trimmed-tail" : `${adjustment}+trimmed-tail`;
      fitted = fitted.slice(0, expectedCount);
      break;
    } else {
      adjustment = "merged";
      const index = smallestGapIndex(fitted);
      fitted[index] = {
        start: fitted[index].start,
        end: fitted[index + 1].end
      };
      fitted.splice(index + 1, 1);
    }
  }

  while (fitted.length < expectedCount) {
    adjustment = adjustment === "none" ? "split" : `${adjustment}+split`;
    const index = longestIntervalIndex(fitted);
    const interval = fitted[index];
    const mid = interval.start + (interval.end - interval.start) / 2;
    fitted.splice(index, 1, { start: interval.start, end: mid }, { start: mid, end: interval.end });
  }

  return { intervals: fitted, adjustment };
}

function applyManualVocabularyIntervalFixes(intervals, expectedCount) {
  if (target !== "all" && target !== "vocabulary") return intervals;
  const mergeAt = {
    21: [8]
  }[lessonNo] || [];
  if (!mergeAt.length) return intervals;
  const result = intervals.map((interval) => ({ ...interval }));
  [...mergeAt].sort((a, b) => b - a).forEach((oneBasedIndex) => {
    const index = oneBasedIndex - 1;
    if (!result[index] || !result[index + 1]) return;
    result[index] = {
      start: result[index].start,
      end: result[index + 1].end
    };
    result.splice(index + 1, 1);
  });
  if (result.length < expectedCount) return intervals;
  return result;
}

function smallestGapIndex(intervals) {
  let bestIndex = 0;
  let bestGap = Infinity;
  for (let index = 0; index < intervals.length - 1; index += 1) {
    const gap = intervals[index + 1].start - intervals[index].end;
    if (gap < bestGap) {
      bestGap = gap;
      bestIndex = index;
    }
  }
  return bestIndex;
}

function longestIntervalIndex(intervals) {
  let bestIndex = 0;
  let bestDuration = -Infinity;
  intervals.forEach((interval, index) => {
    const duration = interval.end - interval.start;
    if (duration > bestDuration) {
      bestDuration = duration;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function padInterval(interval, duration, pad) {
  return {
    start: Math.max(0, interval.start - pad),
    end: Math.min(duration, interval.end + pad)
  };
}

async function cachedAudioPath(trackId, sourceUrl) {
  await mkdir(cacheDir, { recursive: true });
  const ext = basename(new URL(sourceUrl).pathname).split(".").pop() || "mp3";
  const audioPath = join(cacheDir, `${trackId}.${ext}`);
  if (!force && existsSync(audioPath)) return audioPath;
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`Audio download failed for ${sourceUrl}: HTTP ${response.status}`);
  await writeFile(audioPath, Buffer.from(await response.arrayBuffer()));
  return audioPath;
}

function textbookAudioUrl(lesson, fileName) {
  const unitNo = Math.ceil(lesson / 4);
  return `${baseAudioUrl}/book1-unit${unitNo}/lesson${lesson}/${fileName}`;
}

function readJson(filePath) {
  if (!existsSync(filePath)) throw new Error(`Missing input JSON: ${filePath}`);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  mkdirSyncForFile(filePath);
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function mkdirSyncForFile(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

function numberArg(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) throw new Error(`Invalid ${label}: ${value}`);
  return number;
}

function numericArg(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`Invalid numeric arg: ${value}`);
  return number;
}

function roundTime(value) {
  return Math.round(value * 1000) / 1000;
}
