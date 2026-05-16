import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import vm from "node:vm";

const root = process.cwd();
const port = Number(process.env.PORT || 5173);
const lessonId = 27;
const defaultVoiceId = "Japanese_IntellectualSenior";
const sampleText = "子供の時、大きな地震がありました。";
const generationDelayMs = Number(process.env.MINIMAX_DELAY_MS || 200);

const voices = [
  { no: 81, id: "Japanese_IntellectualSenior", name: "Intellectual Senior" },
  { no: 82, id: "Japanese_DecisivePrincess", name: "Decisive Princess" },
  { no: 83, id: "Japanese_LoyalKnight", name: "Loyal Knight" },
  { no: 84, id: "Japanese_DominantMan", name: "Dominant Man" },
  { no: 85, id: "Japanese_SeriousCommander", name: "Serious Commander" },
  { no: 86, id: "Japanese_ColdQueen", name: "Cold Queen" },
  { no: 87, id: "Japanese_DependableWoman", name: "Dependable Woman" },
  { no: 88, id: "Japanese_GentleButler", name: "Gentle Butler" },
  { no: 89, id: "Japanese_KindLady", name: "Kind Lady" },
  { no: 90, id: "Japanese_CalmLady", name: "Calm Lady" },
  { no: 91, id: "Japanese_OptimisticYouth", name: "Optimistic Youth" },
  { no: 92, id: "Japanese_GenerousIzakayaOwner", name: "Generous Izakaya Owner" },
  { no: 93, id: "Japanese_SportyStudent", name: "Sporty Student" },
  { no: 94, id: "Japanese_InnocentBoy", name: "Innocent Boy" }
];

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav"
};

function headers(type) {
  return {
    "Content-Type": type,
    "Cache-Control": "no-store"
  };
}

function safePath(pathname) {
  const clean = normalize(decodeURIComponent(pathname))
    .replace(/^(\.\.([/\\]|$))+/, "")
    .replace(/^[/\\]+/, "");
  return join(root, clean === "" ? "index.html" : clean);
}

function sendJson(res, status, body) {
  res.writeHead(status, headers(types[".json"]));
  res.end(JSON.stringify(body));
}

function normalizeAzureRegion(region) {
  return String(region || "").trim().toLowerCase().replace(/\s+/g, "");
}

function safeFileSegment(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "recording";
}

async function savePronunciationDebugAudio({ lessonId, wordId, audioBuffer }) {
  const fileName = `lesson${lessonId}-${safeFileSegment(wordId)}-latest.wav`;
  const relativePath = join("debug-recordings", fileName);
  const filePath = join(root, relativePath);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, audioBuffer);
  return {
    debugAudioUrl: `/${relativePath.replaceAll("\\", "/")}?v=${Date.now()}`,
    debugAudioPath: filePath
  };
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
}

async function readBuffer(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function readMultipart(req) {
  const contentType = req.headers["content-type"] || "";
  const boundary = contentType.match(/boundary=(.+)$/)?.[1];
  if (!boundary) throw new Error("Missing multipart boundary.");
  const body = await readBuffer(req);
  const delimiter = Buffer.from(`--${boundary}`);
  const fields = {};
  const files = {};
  let cursor = 0;
  while (cursor < body.length) {
    const start = body.indexOf(delimiter, cursor);
    if (start < 0) break;
    const headerStart = start + delimiter.length + 2;
    if (body.slice(start + delimiter.length, start + delimiter.length + 2).toString() === "--") break;
    const headerEnd = body.indexOf(Buffer.from("\r\n\r\n"), headerStart);
    if (headerEnd < 0) break;
    const next = body.indexOf(delimiter, headerEnd + 4);
    if (next < 0) break;
    const header = body.slice(headerStart, headerEnd).toString("utf8");
    const value = body.slice(headerEnd + 4, next - 2);
    const name = header.match(/name="([^"]+)"/)?.[1];
    const filename = header.match(/filename="([^"]+)"/)?.[1];
    if (name && filename) files[name] = { filename, buffer: value };
    if (name && !filename) fields[name] = value.toString("utf8");
    cursor = next;
  }
  return { fields, files };
}

async function loadLesson() {
  const appJs = await readFile(join(root, "app.js"), "utf8");
  const match = appJs.match(/const lesson = ([\s\S]*?\n};)/);
  if (!match) throw new Error("Could not find lesson object in app.js");
  return vm.runInNewContext(`(${match[1].replace(/;$/, "")})`);
}

function voicePath(voiceId, type, id) {
  return join(root, "audio", `lesson${lessonId}`, "voices", voiceId, `${type}s`, `${id}.mp3`);
}

function voiceUrl(voiceId, type, id) {
  return `/audio/lesson${lessonId}/voices/${voiceId}/${type}s/${id}.mp3`;
}

function legacyPath(type, id) {
  return join(root, "audio", `lesson${lessonId}`, `${type}s`, `${id}.mp3`);
}

function legacyUrl(type, id) {
  return `/audio/lesson${lessonId}/${type}s/${id}.mp3`;
}

function audioStatus(voiceId, type, id) {
  if (existsSync(voicePath(voiceId, type, id))) {
    return { exists: true, url: voiceUrl(voiceId, type, id), source: "voice" };
  }
  if (voiceId === defaultVoiceId && existsSync(legacyPath(type, id))) {
    return { exists: true, url: legacyUrl(type, id), source: "legacy" };
  }
  return { exists: false, url: voiceUrl(voiceId, type, id), source: "" };
}

function lessonAudioJobs(lesson) {
  return [
    ...lesson.vocabulary.map((word) => ({ id: word.id, type: "word", label: word.jp, text: word.jp, kana: word.kana, cn: word.cn })),
    ...lesson.sentences.map((sentence) => ({ id: sentence.id, type: "sentence", label: sentence.text, text: sentence.text, cn: sentence.translation })),
    ...lesson.grammar.flatMap((grammar) => (grammar.extraExamples || []).map((example, index) => ({
      id: `${grammar.id}-extra-${index + 1}`,
      type: "sentence",
      label: example.text,
      text: example.text,
      cn: example.translation
    })))
  ];
}

async function synthesize(text, voiceId) {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) throw new Error("Missing MINIMAX_API_KEY. Please start the dev server with this environment variable.");
  const response = await fetch(process.env.MINIMAX_TTS_URL || "https://api.minimaxi.com/v1/t2a_v2", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.MINIMAX_TTS_MODEL || "speech-2.8-hd",
      text,
      stream: false,
      language_boost: "Japanese",
      voice_setting: { voice_id: voiceId, speed: 0.9, vol: 1, pitch: -1, emotion: "neutral" },
      audio_setting: { sample_rate: 32000, bitrate: 128000, format: "mp3", channel: 1 },
      subtitle_enable: false
    })
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`MiniMax HTTP ${response.status}: ${body}`);
  const json = JSON.parse(body);
  if (json.base_resp?.status_code !== 0 || !json.data?.audio) throw new Error(`MiniMax error: ${body}`);
  return Buffer.from(json.data.audio, "hex");
}

async function synthesizeWithRetry(text, voiceId) {
  let lastError;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      return await synthesize(text, voiceId);
    } catch (error) {
      lastError = error;
      const message = String(error.message || error);
      if (!message.includes("1002") && !message.toLowerCase().includes("rate limit")) throw error;
      await wait(attempt * 20000);
    }
  }
  throw lastError;
}

async function generateAudio(voiceId, type, id, text) {
  const status = audioStatus(voiceId, type, id);
  if (status.exists) return { ...status, generated: false };
  const filePath = voicePath(voiceId, type, id);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, await synthesizeWithRetry(text, voiceId));
  return { exists: true, url: voiceUrl(voiceId, type, id), source: "voice", generated: true };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pronunciationReasons(scores) {
  const reasons = [];
  if (scores.accuracyScore < 75) reasons.push("发音不标准");
  if (scores.fluencyScore < 70) reasons.push("流畅度不足");
  if (scores.completenessScore < 80) reasons.push("发音不完整");
  return reasons;
}

async function evaluatePronunciation({ referenceText, audioBuffer }) {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = normalizeAzureRegion(process.env.AZURE_SPEECH_REGION);
  if (!key || !region) throw new Error("Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION.");
  const assessment = Buffer.from(JSON.stringify({
    ReferenceText: referenceText,
    GradingSystem: "HundredMark",
    Granularity: "Phoneme",
    Dimension: "Comprehensive",
    EnableMiscue: true
  })).toString("base64");
  const endpoint = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=ja-JP`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
      "Accept": "application/json",
      "Pronunciation-Assessment": assessment
    },
    body: audioBuffer
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Azure Speech HTTP ${response.status}: ${text}`);
  const raw = JSON.parse(text);
  const best = raw.NBest?.[0] || {};
  const pa = best.PronunciationAssessment || best;
  const scores = {
    pronunciationScore: Math.round(pa.PronScore ?? 0),
    accuracyScore: Math.round(pa.AccuracyScore ?? 0),
    fluencyScore: Math.round(pa.FluencyScore ?? 0),
    completenessScore: Math.round(pa.CompletenessScore ?? 0)
  };
  const reasons = pronunciationReasons(scores);
  return {
    passed: scores.pronunciationScore >= 75 && scores.accuracyScore >= 75 && scores.fluencyScore >= 70 && scores.completenessScore >= 80,
    ...scores,
    recognizedText: raw.DisplayText || "",
    reasons,
    raw
  };
}

async function handleApi(req, res, url) {
  try {
    if (url.pathname === "/api/audio/voices") {
      sendJson(res, 200, { voices, defaultVoiceId, sampleText });
      return true;
    }
    if (url.pathname === "/api/audio/status") {
      const voiceId = url.searchParams.get("voiceId") || defaultVoiceId;
      const lesson = await loadLesson();
      const items = lessonAudioJobs(lesson).map((job) => ({ ...job, ...audioStatus(voiceId, job.type, job.id) }));
      sendJson(res, 200, { voiceId, items });
      return true;
    }
    if (url.pathname === "/api/audio/generate" && req.method === "POST") {
      const { voiceId = defaultVoiceId, type, id, scope = "one" } = await readJson(req);
      const lesson = await loadLesson();
      const jobs = lessonAudioJobs(lesson);
      const targets = scope === "all" ? jobs.filter((job) => !audioStatus(voiceId, job.type, job.id).exists) : jobs.filter((job) => job.type === type && job.id === id);
      if (!targets.length) {
        sendJson(res, 200, { voiceId, generated: 0, skipped: scope === "all" ? jobs.length : 1, items: [] });
        return true;
      }
      const items = [];
      for (const [index, job] of targets.entries()) {
        try {
          items.push({ id: job.id, type: job.type, ...(await generateAudio(voiceId, job.type, job.id, job.text)) });
        } catch (error) {
          items.push({
            id: job.id,
            type: job.type,
            exists: false,
            generated: false,
            error: String(error.message || error),
            url: voiceUrl(voiceId, job.type, job.id),
            source: ""
          });
        }
        if (scope === "all" && index < targets.length - 1) await wait(generationDelayMs);
      }
      const generated = items.filter((item) => item.generated).length;
      const failed = items.filter((item) => item.error).length;
      sendJson(res, 200, { voiceId, generated, failed, skipped: targets.length - generated - failed, items });
      return true;
    }
    if (url.pathname === "/api/audio/sample" && req.method === "POST") {
      const { voiceId = defaultVoiceId } = await readJson(req);
      const result = await generateAudio(voiceId, "sentence", "sample", sampleText);
      sendJson(res, 200, { voiceId, text: sampleText, ...result });
      return true;
    }
    if (url.pathname === "/api/pronunciation/evaluate" && req.method === "POST") {
      const { fields, files } = await readMultipart(req);
      const referenceText = fields.referenceText || "";
      if (!referenceText) throw new Error("Missing referenceText.");
      if (!files.audio?.buffer?.length) throw new Error("Missing audio file.");
      const debugAudio = await savePronunciationDebugAudio({ lessonId, wordId: fields.wordId || "unknown", audioBuffer: files.audio.buffer });
      const result = await evaluatePronunciation({ referenceText, audioBuffer: files.audio.buffer });
      sendJson(res, 200, { wordId: fields.wordId || "", referenceText, ...debugAudio, ...result });
      return true;
    }
  } catch (error) {
    sendJson(res, 500, { error: String(error.message || error) });
    return true;
  }
  return false;
}

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/") && await handleApi(req, res, url)) return;
  let filePath = safePath(url.pathname);

  try {
    const body = await readFile(filePath);
    const type = types[extname(filePath)] || "application/octet-stream";
    const range = req.headers.range;
    if (range && ["audio/wav", "audio/mpeg"].includes(type)) {
      const match = range.match(/bytes=(\d*)-(\d*)/);
      if (match) {
        const suffixLength = match[1] === "" ? Number(match[2]) : 0;
        const start = suffixLength ? Math.max(0, body.length - suffixLength) : Number(match[1]);
        const end = match[2] && !suffixLength ? Math.min(body.length - 1, Number(match[2])) : body.length - 1;
        if (Number.isFinite(start) && Number.isFinite(end) && start <= end) {
          const chunk = body.subarray(start, end + 1);
          res.writeHead(206, {
            ...headers(type),
            "Accept-Ranges": "bytes",
            "Content-Range": `bytes ${start}-${end}/${body.length}`,
            "Content-Length": chunk.length
          });
          res.end(req.method === "HEAD" ? undefined : chunk);
          return;
        }
      }
    }
    res.writeHead(200, {
      ...headers(type),
      "Accept-Ranges": ["audio/wav", "audio/mpeg"].includes(type) ? "bytes" : "none",
      "Content-Length": body.length
    });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    const body = await readFile(join(root, "index.html"));
    res.writeHead(200, headers(types[".html"]));
    res.end(body);
  }
}).listen(port, () => {
  console.log(`JapaFlow running at http://localhost:${port}`);
});
