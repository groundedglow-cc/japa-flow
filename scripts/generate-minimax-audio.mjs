import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import vm from "node:vm";

const apiKey = process.env.MINIMAX_API_KEY;
const lessonId = Number(process.env.LESSON_ID || 27);
const voiceId = process.env.MINIMAX_VOICE_ID || "Japanese_IntellectualSenior";
const model = process.env.MINIMAX_TTS_MODEL || "speech-2.8-hd";
const baseUrl = process.env.MINIMAX_TTS_URL || "https://api.minimaxi.com/v1/t2a_v2";
const limit = Number(process.env.MINIMAX_LIMIT || 0);
const delayMs = Number(process.env.MINIMAX_DELAY_MS || 1800);
const only = process.env.MINIMAX_ONLY || "";
const force = process.argv.includes("--force");

if (!apiKey) {
  console.error("Missing MINIMAX_API_KEY.");
  process.exit(1);
}

const lesson = await loadLesson();
if (lesson.id !== lessonId) {
  console.error(`Expected lesson ${lessonId}, but app.js contains lesson ${lesson.id}.`);
  process.exit(1);
}

let jobs = [
  ...lesson.vocabulary.map((word) => ({
    id: word.id,
    text: word.kana || word.jp,
    type: "word",
    path: join("audio", `lesson${lesson.id}`, "words", `${word.id}.mp3`)
  })),
  ...lesson.sentences.map((sentence) => ({
    id: sentence.id,
    text: sentence.text,
    type: "sentence",
    path: join("audio", `lesson${lesson.id}`, "sentences", `${sentence.id}.mp3`)
  })),
  ...lesson.grammar.flatMap((grammar) => (grammar.extraExamples || []).map((example, index) => ({
    id: `${grammar.id}-extra-${index + 1}`,
    text: example.text,
    type: "sentence",
    path: join("audio", `lesson${lesson.id}`, "sentences", `${grammar.id}-extra-${index + 1}.mp3`)
  })))
];

if (only) {
  const [type, id] = only.split(":");
  jobs = jobs.filter((job) => job.type === type && job.id === id);
  if (jobs.length === 0) {
    console.error(`No audio job matched MINIMAX_ONLY=${only}`);
    process.exit(1);
  }
}

let generated = 0;
let skipped = 0;

for (const job of limit > 0 ? jobs.slice(0, limit) : jobs) {
  if (!force && existsSync(job.path)) {
    skipped += 1;
    console.log(`skip ${job.type}:${job.id} ${job.path}`);
    continue;
  }

  await mkdir(dirname(job.path), { recursive: true });
  const audio = await synthesizeWithRetry(job.text);
  await writeFile(job.path, audio);
  generated += 1;
  console.log(`ok ${job.type}:${job.id} ${job.path}`);
  await wait(delayMs);
}

console.log(`done generated=${generated} skipped=${skipped} total=${jobs.length}`);

async function loadLesson() {
  const appJs = await readFile("app.js", "utf8");
  const match = appJs.match(/const lesson = ([\s\S]*?\n};)/);
  if (!match) throw new Error("Could not find lesson object in app.js");
  return vm.runInNewContext(`(${match[1].replace(/;$/, "")})`);
}

async function synthesize(text) {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      text,
      stream: false,
      language_boost: "Japanese",
      voice_setting: {
        voice_id: voiceId,
        speed: 0.9,
        vol: 1,
        pitch: -1,
        emotion: "neutral"
      },
      audio_setting: {
        sample_rate: 32000,
        bitrate: 128000,
        format: "mp3",
        channel: 1
      },
      subtitle_enable: false
    })
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`MiniMax HTTP ${response.status}: ${body}`);
  }

  const json = JSON.parse(body);
  if (json.base_resp?.status_code !== 0 || !json.data?.audio) {
    throw new Error(`MiniMax error: ${body}`);
  }

  return Buffer.from(json.data.audio, "hex");
}

async function synthesizeWithRetry(text) {
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      return await synthesize(text);
    } catch (error) {
      lastError = error;
      const message = String(error.message || error);
      if (!message.includes("rate limit") && !message.includes("1002")) throw error;
      const backoff = attempt * 12000;
      console.log(`rate limited, retry ${attempt}/5 after ${backoff}ms`);
      await wait(backoff);
    }
  }
  throw lastError;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
