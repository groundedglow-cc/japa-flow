import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import ffmpeg from "ffmpeg-static";

const baseUrl = "https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio";

loadEnv();

function usage() {
  console.error("Usage: node scripts/transcribe-textbook-audio.mjs lessonN practice_1|practice_2 order [--start seconds] [--duration seconds] [--out file]");
  console.error("   or: node scripts/transcribe-textbook-audio.mjs --url https://.../Exe1_2.mp3 [--start seconds] [--duration seconds] [--out file]");
  process.exit(2);
}

const args = process.argv.slice(2);
let outPath = "";
let startSeconds = null;
let durationSeconds = null;
const outIndex = args.indexOf("--out");
if (outIndex >= 0) {
  outPath = args[outIndex + 1] || "";
  args.splice(outIndex, 2);
}
const startIndex = args.indexOf("--start");
if (startIndex >= 0) {
  startSeconds = Number(args[startIndex + 1]);
  if (!Number.isFinite(startSeconds) || startSeconds < 0) usage();
  args.splice(startIndex, 2);
}
const durationIndex = args.indexOf("--duration");
if (durationIndex >= 0) {
  durationSeconds = Number(args[durationIndex + 1]);
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) usage();
  args.splice(durationIndex, 2);
}

let audioUrl = "";
let meta = {};
if (args[0] === "--url") {
  audioUrl = args[1] || "";
  meta = { sourceUrl: audioUrl };
} else if (args.length >= 3) {
  const [lessonId, section, orderValue] = args;
  const lessonNo = lessonNumber(lessonId);
  const exerciseNo = section === "practice_1" ? 1 : section === "practice_2" ? 2 : 0;
  const order = Number(orderValue);
  if (!lessonNo || !exerciseNo || !Number.isInteger(order)) usage();
  const unitNo = Math.ceil(lessonNo / 4);
  audioUrl = `${baseUrl}/book1-unit${unitNo}/lesson${lessonNo}/Exe${exerciseNo}_${order}.mp3`;
  meta = { lessonId, section, order, sourceUrl: audioUrl };
} else {
  usage();
}

if (!audioUrl) usage();

const key = process.env.AZURE_SPEECH_KEY;
const region = normalizeAzureRegion(process.env.AZURE_SPEECH_REGION);
if (!key || !region) {
  throw new Error("Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION.");
}

const workDir = mkdtempSync(join(tmpdir(), "japaflow-audio-"));
const mp3Path = join(workDir, basename(new URL(audioUrl).pathname) || "audio.mp3");
const wavPath = join(workDir, "audio.wav");

const mp3Response = await fetch(audioUrl);
if (!mp3Response.ok) {
  throw new Error(`Audio download failed: HTTP ${mp3Response.status}`);
}
writeFileSync(mp3Path, Buffer.from(await mp3Response.arrayBuffer()));

const converted = spawnSync(ffmpeg, [
  "-y",
  ...(startSeconds === null ? [] : ["-ss", String(startSeconds)]),
  "-i", mp3Path,
  ...(durationSeconds === null ? [] : ["-t", String(durationSeconds)]),
  "-ac", "1",
  "-ar", "16000",
  "-acodec", "pcm_s16le",
  wavPath
], { encoding: "utf8" });
if (converted.status !== 0) {
  throw new Error(`ffmpeg failed: ${converted.stderr}`);
}

const transcript = await transcribeWav(readFileSync(wavPath), key, region);
const output = { ...meta, transcript };
const json = `${JSON.stringify(output, null, 2)}\n`;
if (outPath) writeFileSync(outPath, json);
else process.stdout.write(json);

function loadEnv() {
  const envPath = join(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    if (process.env[key] !== undefined) continue;
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function lessonNumber(lessonId) {
  const match = String(lessonId).match(/lesson(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function normalizeAzureRegion(region) {
  return String(region || "").trim().toLowerCase().replace(/\s+/g, "");
}

async function transcribeWav(audioBuffer, key, region) {
  const endpoint = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=ja-JP&format=detailed`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
      "Accept": "application/json"
    },
    body: audioBuffer
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Azure Speech HTTP ${response.status}: ${text}`);
  }
  const raw = JSON.parse(text);
  const best = raw.NBest?.[0] || {};
  return {
    text: raw.DisplayText || best.Display || best.Lexical || "",
    source: "asr",
    confidence: best.Confidence ?? null,
    raw
  };
}
