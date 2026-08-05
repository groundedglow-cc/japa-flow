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
const outputPath = join(root, "data", "ocr", `lesson${lessonNo}-text-audio-alignment.json`);
const cacheDir = join(root, "data", "ocr", "audio-cache", `lesson${lessonNo}`);
const sourceData = readJson(inputPath);
const speechKey = process.env.AZURE_SPEECH_KEY;
const speechRegion = normalizeRegion(process.env.AZURE_SPEECH_REGION);
const autoApprove = args.autoApprove === true || args["auto-approve"] === true;

if (!speechKey || !speechRegion) throw new Error("Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION.");

const tracks = [
  { id: "lesson_basic", filename: "lesson_basic.mp3", items: basicItems(sourceData) },
  { id: "lesson_apps", filename: "lesson_apps.mp3", items: applicationItems(sourceData) }
].filter((track) => track.items.length);

  const output = {
  schemaVersion: 1,
  lessonId: `lesson${lessonNo}`,
  generatedAt: new Date().toISOString(),
  method: "azure-speech-sdk-global-monotonic-alignment",
  reviewStatus: autoApprove ? "approved" : "pending",
  tracks: []
};

for (const track of tracks) {
  const audioPath = await cachedAudioPath(track.filename);
  const transcription = await transcribe(audioPath, speechKey, speechRegion);
  const phrases = normalizePhrases(transcription.phrases || []);
  const assignments = alignItems(track.items, phraseUnits(phrases));
  output.tracks.push({
    id: track.id,
    sourceUrl: textbookAudioUrl(lessonNo, track.filename),
    localAudioPath: relativeToRoot(audioPath),
    sourceAudioSha256: sha256(audioPath),
    transcription: {
    provider: "azure-speech-sdk-continuous-recognition",
      locale: "ja-JP",
      text: (transcription.combinedPhrases || []).map((phrase) => phrase.text || "").join(" ").trim(),
      phrases
    },
    items: assignments.map((assignment) => ({
      ...assignment.item,
      candidate: assignment.candidate,
      review: {
        status: autoApprove ? "approved" : "pending",
        start: assignment.candidate.start,
        end: assignment.candidate.end,
        note: autoApprove ? "Automatically approved by the bulk alignment workflow." : "",
        reviewedAt: autoApprove ? new Date().toISOString() : null
      }
    }))
  });
}

writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ lessonId: output.lessonId, outputPath: relativeToRoot(outputPath), tracks: output.tracks.map((track) => ({ id: track.id, items: track.items.length, phrases: track.transcription.phrases.length })) }, null, 2)}\n`);

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
  return {
    id: item.id,
    trackId,
    speaker: item.speaker || "",
    text: item.text || "",
    kana: item.kana || "",
    translationZh: item.translationZh || ""
  };
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
      else resolve({ phrases, combinedPhrases: [{ text: phrases.map((phrase) => phrase.text).join(" ") }] });
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
        words: (best.Words || []).map((word) => ({ text: word.Word || word.word || "", offset: word.Offset ?? word.offset ?? 0, duration: word.Duration ?? word.duration ?? 0 }))
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

function toWav(audioPath) {
  const dir = mkdtempSync(join(tmpdir(), "japaflow-text-align-"));
  const wavPath = join(dir, "audio.wav");
  const result = spawnSync(ffmpeg, ["-y", "-i", audioPath, "-ac", "1", "-ar", "16000", "-acodec", "pcm_s16le", wavPath], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${result.stderr}`);
  return wavPath;
}

function normalizePhrases(phrases) {
  return phrases.map((phrase, index) => ({
    index,
    text: String(phrase.text || ""),
    start: millis(phrase.offset),
    end: millis(Number(phrase.offset || 0) + Number(phrase.duration || 0)),
    confidence: Number(phrase.confidence || 0),
    words: (phrase.words || []).map((word) => ({ text: String(word.text || ""), start: millis(word.offset), end: millis(Number(word.offset || 0) + Number(word.duration || 0)) }))
  })).filter((phrase) => phrase.end > phrase.start);
}

function phraseUnits(phrases) {
  return phrases.flatMap((phrase) => {
    if (!phrase.words.length) return [phrase];
    return phrase.words.map((word, index) => ({
      index: phrase.index,
      wordIndex: index,
      text: word.text,
      start: word.start,
      end: word.end,
      confidence: phrase.confidence
    }));
  });
}

function alignItems(items, phrases) {
  const maxGroupSize = 64;
  const skipCost = 0.015;
  const dp = Array.from({ length: items.length + 1 }, () => Array(phrases.length + 1).fill(Infinity));
  const back = Array.from({ length: items.length + 1 }, () => Array(phrases.length + 1).fill(null));
  dp[0][0] = 0;
  for (let phraseIndex = 1; phraseIndex <= phrases.length; phraseIndex += 1) {
    dp[0][phraseIndex] = dp[0][phraseIndex - 1] + skipCost;
    back[0][phraseIndex] = { kind: "skip" };
  }
  for (let itemIndex = 1; itemIndex <= items.length; itemIndex += 1) {
    for (let phraseIndex = 0; phraseIndex <= phrases.length; phraseIndex += 1) {
      if (!Number.isFinite(dp[itemIndex - 1][phraseIndex])) continue;
      for (let size = 1; size <= maxGroupSize && phraseIndex + size <= phrases.length; size += 1) {
        const nextIndex = phraseIndex + size;
        const score = matchScore(items[itemIndex - 1], phrases.slice(phraseIndex, nextIndex));
        const cost = dp[itemIndex - 1][phraseIndex] + (1 - score) + (size - 1) * 0.002;
        if (cost < dp[itemIndex][nextIndex]) {
          dp[itemIndex][nextIndex] = cost;
          back[itemIndex][nextIndex] = { kind: "match", from: phraseIndex, score };
        }
      }
    }
    for (let phraseIndex = 1; phraseIndex <= phrases.length; phraseIndex += 1) {
      const cost = dp[itemIndex][phraseIndex - 1] + skipCost;
      if (cost < dp[itemIndex][phraseIndex]) {
        dp[itemIndex][phraseIndex] = cost;
        back[itemIndex][phraseIndex] = { kind: "skip" };
      }
    }
  }
  let phraseIndex = dp[items.length].reduce((best, value, index) => value < dp[items.length][best] ? index : best, 0);
  const result = Array(items.length);
  for (let itemIndex = items.length; itemIndex > 0;) {
    const step = back[itemIndex][phraseIndex];
    if (step?.kind === "match") {
      const group = phrases.slice(step.from, phraseIndex);
      result[itemIndex - 1] = {
        item: items[itemIndex - 1],
        candidate: candidateFor(group, step.score)
      };
      phraseIndex = step.from;
      itemIndex -= 1;
      continue;
    }
    if (phraseIndex === 0) throw new Error("Could not build a monotonic transcript alignment.");
    phraseIndex -= 1;
  }
  return result;
}

function candidateFor(phrases, score) {
  const first = phrases[0];
  const last = phrases[phrases.length - 1];
  return {
    start: round(Math.max(0, first.start - 0.06)),
    end: round(last.end + 0.08),
    asrText: phrases.map((phrase) => phrase.text).join(" "),
    phraseIndexes: [...new Set(phrases.map((phrase) => phrase.index))],
    matchScore: round(score),
    confidence: round(phrases.reduce((sum, phrase) => sum + phrase.confidence, 0) / phrases.length),
    status: "needs-review"
  };
}

function matchScore(item, phrases) {
  const actual = normalizeText(phrases.map((phrase) => phrase.text).join(""));
  const references = [item.text, item.kana].map(normalizeText).filter(Boolean);
  return Math.max(...references.map((reference) => similarity(reference, actual)), 0);
}

function normalizeText(value) {
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
      current[column] = Math.min(current[column - 1] + 1, previous[column] + 1, previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1));
    }
    previous = current;
  }
  return previous[right.length];
}

function millis(value) {
  return round(Number(value || 0) / 10_000_000);
}

function textbookAudioUrl(lesson, filename) {
  return `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit${Math.ceil(lesson / 4)}/lesson${lesson}/${filename}`;
}

async function cachedAudioPath(filename) {
  const audioPath = join(cacheDir, filename);
  if (existsSync(audioPath)) return audioPath;
  const sourceUrl = textbookAudioUrl(lessonNo, filename);
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`Audio download failed for ${sourceUrl}: HTTP ${response.status}`);
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(audioPath, Buffer.from(await response.arrayBuffer()));
  return audioPath;
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function relativeToRoot(filePath) {
  return filePath.slice(root.length + 1).replaceAll("\\", "/");
}

function readJson(filePath) {
  if (!existsSync(filePath)) throw new Error(`Missing input JSON: ${filePath}`);
  return JSON.parse(readFileSync(filePath, "utf8"));
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

function round(value) {
  return Math.round(Number(value) * 1000) / 1000;
}
