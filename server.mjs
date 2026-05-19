import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, normalize } from "node:path";
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
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav"
};

const initBuckets = ["text", "grammar", "vocabulary", "exercises"];
const lessonCatalog = [
  {
    id: 27,
    title: "第27课",
    subtitle: "子供の時、大きな地震がありました",
    status: "ready",
    description: "围绕第 27 课完成单词、语法、课文朗读、标准练习和结果复盘。",
    runtimeReady: true
  },
  {
    id: 28,
    title: "第28课",
    subtitle: "待初始化",
    status: "pending",
    description: "课程内容尚未采集，后续可继续按同一结构初始化。",
    runtimeReady: false
  },
  {
    id: 29,
    title: "第29课",
    subtitle: "待初始化",
    status: "pending",
    description: "课程内容尚未采集，后续可继续按同一结构初始化。",
    runtimeReady: false
  }
];

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

function safeLessonId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0 || id > 999) throw new Error("Invalid lessonId.");
  return id;
}

function initStatePath(lessonId) {
  return join(root, "data", "lesson-init", `lesson${lessonId}-state.json`);
}

function initDraftPath(lessonId) {
  return join(root, "data", "lesson-drafts", `lesson${lessonId}.json`);
}

function initLessonPath(lessonId) {
  return join(root, "data", "lessons", `lesson${lessonId}.json`);
}

function initCodexTaskPath(lessonId) {
  return join(root, "data", "lesson-init", `lesson${lessonId}-codex-task.md`);
}

function imageBucketDir(lessonId, bucket) {
  if (!initBuckets.includes(bucket)) throw new Error("Invalid image bucket.");
  return join(root, "course-assets", `lesson${lessonId}`, bucket);
}

async function readJsonFile(filePath, fallback = null) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filePath, value) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function initializedLessonCatalog() {
  return Promise.all(lessonCatalog.map(async (item) => {
    if (item.runtimeReady) return item;
    const lessonData = await readJsonFile(initLessonPath(item.id), null);
    const initState = await readJsonFile(initStatePath(item.id), {});
    const initialized = Boolean(lessonData && initState.parseConfirmed && initState.audioConfirmed);
    if (!initialized) return item;
    return {
      ...item,
      subtitle: lessonData.subtitle || item.subtitle,
      status: "initialized",
      statusLabel: "已初始化",
      description: `课程数据和音频已完成：${lessonData.vocabulary?.length || 0} 个单词，${lessonData.grammar?.length || 0} 个语法，${lessonData.sentences?.length || 0} 句课文，${lessonData.exercises?.length || 0} 道练习。`,
      runtimeReady: false,
      initializedAt: initState.completedAt || initState.parseConfirmedAt || "",
      counts: {
        vocabulary: lessonData.vocabulary?.length || 0,
        grammar: lessonData.grammar?.length || 0,
        sentences: lessonData.sentences?.length || 0,
        exercises: lessonData.exercises?.length || 0
      }
    };
  }));
}

function firstFile(value) {
  return Array.isArray(value) ? value[0] : value;
}

function fileList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
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
    const contentType = header.match(/content-type:\s*([^\r\n]+)/i)?.[1] || "application/octet-stream";
    if (name && filename) {
      const file = { filename, contentType, buffer: value };
      if (files[name]) files[name] = [...fileList(files[name]), file];
      else files[name] = file;
    }
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

function audioStatusForLesson(lessonIdValue, voiceId, type, id) {
  if (existsSync(audioPathForLesson(lessonIdValue, voiceId, type, id))) {
    return { exists: true, url: audioUrlForLesson(lessonIdValue, voiceId, type, id), source: "voice" };
  }
  if (lessonIdValue === lessonId && voiceId === defaultVoiceId && existsSync(legacyPath(type, id))) {
    return { exists: true, url: legacyUrl(type, id), source: "legacy" };
  }
  return { exists: false, url: audioUrlForLesson(lessonIdValue, voiceId, type, id), source: "" };
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

function audioPathForLesson(lessonIdValue, voiceId, type, id) {
  return join(root, "audio", `lesson${lessonIdValue}`, "voices", voiceId, `${type}s`, `${id}.mp3`);
}

function audioUrlForLesson(lessonIdValue, voiceId, type, id) {
  return `/audio/lesson${lessonIdValue}/voices/${voiceId}/${type}s/${id}.mp3`;
}

function addUniqueJob(jobs, seen, job) {
  const key = `${job.type}:${job.id}:${job.text}`;
  if (!job.text || seen.has(key)) return;
  seen.add(key);
  jobs.push(job);
}

function lessonTextValue(value) {
  if (typeof value === "string") return value;
  return value?.text || value?.jp || "";
}

function lessonTextLabel(value) {
  return lessonTextValue(value) || value?.label || "";
}

function lessonDraftAudioJobs(lesson) {
  const jobs = [];
  const seen = new Set();
  (lesson.vocabulary || []).forEach((word) => {
    addUniqueJob(jobs, seen, { id: word.id, type: "word", label: word.jp, text: word.jp, source: "vocabulary" });
  });
  (lesson.sentences || []).forEach((sentence) => {
    addUniqueJob(jobs, seen, { id: sentence.id, type: "sentence", label: sentence.text, text: sentence.text, source: "text" });
  });
  (lesson.grammar || []).forEach((grammar) => {
    (grammar.extraExamples || []).forEach((example, index) => {
      const text = lessonTextValue(example);
      addUniqueJob(jobs, seen, {
        id: `${grammar.id}-extra-${index + 1}`,
        type: "sentence",
        label: lessonTextLabel(example),
        text,
        source: "grammar"
      });
    });
  });
  (lesson.exercises || []).forEach((exercise) => {
    [
      ["answer", exercise.answer],
      ...((exercise.referenceAnswers || []).map((value, index) => [`reference-${index + 1}`, value]))
    ].forEach(([part, text]) => {
      addUniqueJob(jobs, seen, {
        id: `${exercise.id}-${part}`,
        type: "exercise",
        label: `${exercise.groupTitle || "练习"} · ${exercise.question || exercise.id}`,
        text,
        source: "exercise"
      });
    });
  });
  return jobs;
}

async function initImageManifest(lessonIdValue) {
  const result = {};
  for (const bucket of initBuckets) {
    const dir = imageBucketDir(lessonIdValue, bucket);
    let entries = [];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      entries = [];
    }
    result[bucket] = entries
      .filter((entry) => entry.isFile())
      .map((entry) => ({
        name: entry.name,
        url: `/course-assets/lesson${lessonIdValue}/${bucket}/${entry.name}`
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  return result;
}

function validateLessonDraft(draft, expectedLessonId) {
  if (!draft || typeof draft !== "object") throw new Error("Draft must be an object.");
  draft.id = safeLessonId(draft.id || expectedLessonId);
  if (draft.id !== expectedLessonId) throw new Error(`Draft lesson id ${draft.id} does not match lesson ${expectedLessonId}.`);
  draft.title = draft.title || `第${expectedLessonId}课`;
  draft.subtitle = draft.subtitle || "待确认";
  for (const key of ["vocabulary", "sentences", "grammar", "exercises"]) {
    if (!Array.isArray(draft[key])) throw new Error(`Draft missing ${key} array.`);
  }
  if (!Array.isArray(draft.textStructure)) draft.textStructure = [];
  return draft;
}

async function codexParseTask(lessonIdValue) {
  const manifest = await initImageManifest(lessonIdValue);
  const imagePaths = [];
  for (const bucket of initBuckets) {
    for (const image of manifest[bucket]) {
      imagePaths.push(join(root, image.url.replace(/^\//, "")));
    }
  }
  if (!imagePaths.length) throw new Error("No uploaded images found for this lesson.");
  const taskPath = initCodexTaskPath(lessonIdValue);
  const draftPath = initDraftPath(lessonIdValue);
  await mkdir(dirname(taskPath), { recursive: true });
  await mkdir(dirname(draftPath), { recursive: true });
  const imageArgs = imagePaths.map((filePath) => `--image ${JSON.stringify(filePath)}`).join(" ");
  const command = `codex exec -C ${JSON.stringify(root)} -s workspace-write -a never ${imageArgs} "Read ${taskPath} and write the requested JSON draft."`;
  const prompt = [
    `# Codex Course Parse Task - Lesson ${lessonIdValue}`,
    "",
    "You are extracting a Japanese textbook lesson from the attached images into strict JapaFlow lesson JSON.",
    "",
    "## Output",
    "",
    `Write the final JSON to: \`${draftPath}\``,
    "",
    "Do not edit `app.js` for this task. Do not overwrite existing lesson 27 data.",
    "",
    "## Required JSON Shape",
    "",
    "Follow the existing lesson 27 structure as closely as possible:",
    "",
    "- `id`",
    "- `title`",
    "- `subtitle`",
    "- `vocabulary[]`: `{ id, jp, kana, cn }`",
    "- `sentences[]`: `{ id, order, speaker?, text, kana, translation, words, grammar }`",
    "- `textStructure[]`: preserve textbook text sections and group sentence ids in order",
    "- `grammar[]`: `{ id, pattern, meaning, structure, usage, examples, extraExamples }`",
    "- `exercises[]`: `{ id, groupId, groupTitle, category, instruction, example?, type, question, choices?, answer, referenceAnswers, relatedGrammar, relatedSentences, explanation }`",
    "",
    "## Extraction Rules",
    "",
    "- Completeness is more important than brevity.",
    "- Do not omit any exercise question.",
    "- Do not merge separate exercise items into one item.",
    "- Preserve examples and model answers if visible.",
    "- Preserve grammar explanation text, sentence patterns, example sentences, and extra examples.",
    "- Preserve listening exercises even if answers are not visible; set `audioRequired: true` and `hasAnswer: false` when appropriate.",
    "- Use empty strings or empty arrays when source images do not show a value.",
    "- Use stable ids: `w1`, `s1`, `g1`, `ex-i-1-1` style where possible.",
    "- Keep Japanese punctuation and kana exactly where visible.",
    "- For uncertain OCR, keep the visible text and add a concise note in `explanation` only when needed.",
    "",
    "## Image Manifest",
    "",
    ...initBuckets.flatMap((bucket) => [
      `### ${bucket}`,
      ...((manifest[bucket] || []).map((image) => `- ${join(root, image.url.replace(/^\//, ""))}`)),
      ""
    ]),
    "## Validation Before Writing",
    "",
    "- Confirm every uploaded exercise image has corresponding `exercises[]` items.",
    "- Confirm every uploaded grammar image has corresponding `grammar[]` entries or `extraExamples[]`.",
    "- Confirm every uploaded vocabulary image has corresponding `vocabulary[]` entries.",
    "- Confirm every text/dialogue line is represented in `sentences[]` and `textStructure[]`.",
    "",
    "Write only the JSON file. In your final message, report counts for vocabulary, sentences, grammar, and exercises."
  ].join("\n");
  await writeFile(taskPath, prompt);
  return {
    taskPath,
    taskUrl: `/data/lesson-init/lesson${lessonIdValue}-codex-task.md`,
    draftPath,
    command,
    imagePaths,
    manifest
  };
}

function initAudioStatus(lesson, voiceId) {
  return lessonDraftAudioJobs(lesson).map((job) => {
    const filePath = audioPathForLesson(lesson.id, voiceId, job.type, job.id);
    const exists = existsSync(filePath);
    return {
      ...job,
      exists,
      url: audioUrlForLesson(lesson.id, voiceId, job.type, job.id),
      source: exists ? "voice" : ""
    };
  });
}

async function generateInitAudioJob(lessonIdValue, voiceId, job) {
  const filePath = audioPathForLesson(lessonIdValue, voiceId, job.type, job.id);
  if (existsSync(filePath)) return { ...job, exists: true, generated: false, url: audioUrlForLesson(lessonIdValue, voiceId, job.type, job.id) };
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, await synthesizeWithRetry(job.text, voiceId));
  return { ...job, exists: true, generated: true, url: audioUrlForLesson(lessonIdValue, voiceId, job.type, job.id) };
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
    if (url.pathname === "/api/lesson-catalog") {
      sendJson(res, 200, { lessons: await initializedLessonCatalog() });
      return true;
    }
    if (url.pathname === "/api/init/status") {
      const requestedLessonId = safeLessonId(url.searchParams.get("lessonId"));
      const voiceId = url.searchParams.get("voiceId") || defaultVoiceId;
      const state = await readJsonFile(initStatePath(requestedLessonId), {});
      const draft = await readJsonFile(initDraftPath(requestedLessonId), null);
      const lessonData = await readJsonFile(initLessonPath(requestedLessonId), null);
      const lessonForAudio = lessonData || draft;
      const audioItems = lessonForAudio ? initAudioStatus(lessonForAudio, voiceId) : [];
      const taskPath = initCodexTaskPath(requestedLessonId);
      sendJson(res, 200, {
        lessonId: requestedLessonId,
        voiceId,
        buckets: initBuckets,
        images: await initImageManifest(requestedLessonId),
        state,
        codexTask: existsSync(taskPath) ? {
          taskPath,
          taskUrl: `/data/lesson-init/lesson${requestedLessonId}-codex-task.md`,
          draftPath: initDraftPath(requestedLessonId)
        } : null,
        draft,
        lessonSaved: Boolean(lessonData),
        audio: {
          items: audioItems,
          generated: audioItems.filter((item) => item.exists).length,
          missing: audioItems.filter((item) => !item.exists).length,
          total: audioItems.length
        }
      });
      return true;
    }
    if (url.pathname === "/api/init/upload" && req.method === "POST") {
      const { fields, files } = await readMultipart(req);
      const requestedLessonId = safeLessonId(fields.lessonId);
      const bucket = fields.bucket || "";
      const uploads = fileList(files.images);
      if (!uploads.length) throw new Error("Missing uploaded images.");
      const dir = imageBucketDir(requestedLessonId, bucket);
      await mkdir(dir, { recursive: true });
      const saved = [];
      for (const [index, file] of uploads.entries()) {
        const rawExt = extname(file.filename).toLowerCase();
        const ext = [".png", ".jpg", ".jpeg", ".webp"].includes(rawExt) ? rawExt : ".png";
        const name = `${Date.now()}-${index + 1}-${safeFileSegment(basename(file.filename, rawExt))}${ext}`;
        const filePath = join(dir, name);
        await writeFile(filePath, file.buffer);
        saved.push({ name, url: `/course-assets/lesson${requestedLessonId}/${bucket}/${name}` });
      }
      const state = { ...(await readJsonFile(initStatePath(requestedLessonId), {})), parseConfirmed: false, audioConfirmed: false, updatedAt: new Date().toISOString() };
      await writeJsonFile(initStatePath(requestedLessonId), state);
      sendJson(res, 200, { lessonId: requestedLessonId, bucket, files: saved, images: await initImageManifest(requestedLessonId), state });
      return true;
    }
    if (url.pathname === "/api/init/parse" && req.method === "POST") {
      const { lessonId: bodyLessonId } = await readJson(req);
      const requestedLessonId = safeLessonId(bodyLessonId);
      const task = await codexParseTask(requestedLessonId);
      const state = {
        ...(await readJsonFile(initStatePath(requestedLessonId), {})),
        codexTaskCreatedAt: new Date().toISOString(),
        codexTaskPath: task.taskPath,
        codexCommand: task.command,
        draftPath: task.draftPath,
        parseConfirmed: false,
        audioConfirmed: false
      };
      await writeJsonFile(initStatePath(requestedLessonId), state);
      sendJson(res, 200, { lessonId: requestedLessonId, task, state, draft: await readJsonFile(initDraftPath(requestedLessonId), null) });
      return true;
    }
    if (url.pathname === "/api/init/import-json" && req.method === "POST") {
      const { lessonId: bodyLessonId, draft } = await readJson(req);
      const requestedLessonId = safeLessonId(bodyLessonId);
      const validDraft = validateLessonDraft(draft, requestedLessonId);
      await writeJsonFile(initDraftPath(requestedLessonId), validDraft);
      const state = {
        ...(await readJsonFile(initStatePath(requestedLessonId), {})),
        draftPath: initDraftPath(requestedLessonId),
        jsonImportedAt: new Date().toISOString(),
        parseConfirmed: false,
        audioConfirmed: false
      };
      await writeJsonFile(initStatePath(requestedLessonId), state);
      sendJson(res, 200, { lessonId: requestedLessonId, draft: validDraft, state, audio: initAudioStatus(validDraft, defaultVoiceId) });
      return true;
    }
    if (url.pathname === "/api/init/confirm-parse" && req.method === "POST") {
      const { lessonId: bodyLessonId, draft } = await readJson(req);
      const requestedLessonId = safeLessonId(bodyLessonId);
      const validDraft = validateLessonDraft(draft || await readJsonFile(initDraftPath(requestedLessonId), null), requestedLessonId);
      await writeJsonFile(initDraftPath(requestedLessonId), validDraft);
      await writeJsonFile(initLessonPath(requestedLessonId), validDraft);
      const state = {
        ...(await readJsonFile(initStatePath(requestedLessonId), {})),
        parseConfirmed: true,
        parseConfirmedAt: new Date().toISOString(),
        audioConfirmed: false
      };
      await writeJsonFile(initStatePath(requestedLessonId), state);
      sendJson(res, 200, { lessonId: requestedLessonId, draft: validDraft, state, audio: initAudioStatus(validDraft, defaultVoiceId) });
      return true;
    }
    if (url.pathname === "/api/init/audio/generate" && req.method === "POST") {
      const { lessonId: bodyLessonId, voiceId = defaultVoiceId, id = "", scope = "all", limit = 0 } = await readJson(req);
      const requestedLessonId = safeLessonId(bodyLessonId);
      const lessonData = await readJsonFile(initLessonPath(requestedLessonId), null);
      if (!lessonData) throw new Error("Please confirm parsed course data before generating audio.");
      const jobs = lessonDraftAudioJobs(lessonData);
      const missingJobs = jobs.filter((job) => !existsSync(audioPathForLesson(requestedLessonId, voiceId, job.type, job.id)));
      const batchLimit = Math.max(0, Math.min(Number(limit) || 0, 20));
      const targets = scope === "one" && id
        ? jobs.filter((job) => `${job.type}:${job.id}` === id || job.id === id)
        : (batchLimit ? missingJobs.slice(0, batchLimit) : missingJobs);
      const items = [];
      for (const [index, job] of targets.entries()) {
        try {
          items.push(await generateInitAudioJob(requestedLessonId, voiceId, job));
        } catch (error) {
          items.push({ ...job, exists: false, generated: false, error: String(error.message || error), url: audioUrlForLesson(requestedLessonId, voiceId, job.type, job.id) });
        }
        if (index < targets.length - 1) await wait(generationDelayMs);
      }
      const status = initAudioStatus(lessonData, voiceId);
      const generated = items.filter((item) => item.generated).length;
      const failed = items.filter((item) => item.error).length;
      sendJson(res, 200, {
        lessonId: requestedLessonId,
        voiceId,
        generated,
        failed,
        skipped: targets.length - generated - failed,
        attempted: targets.length,
        remainingBefore: missingJobs.length,
        items,
        status,
        audio: {
          items: status,
          generated: status.filter((item) => item.exists).length,
          missing: status.filter((item) => !item.exists).length,
          total: status.length
        }
      });
      return true;
    }
    if (url.pathname === "/api/init/confirm-audio" && req.method === "POST") {
      const { lessonId: bodyLessonId, voiceId = defaultVoiceId } = await readJson(req);
      const requestedLessonId = safeLessonId(bodyLessonId);
      const lessonData = await readJsonFile(initLessonPath(requestedLessonId), null);
      if (!lessonData) throw new Error("Please confirm parsed course data before confirming audio.");
      const audioItems = initAudioStatus(lessonData, voiceId);
      const missing = audioItems.filter((item) => !item.exists);
      if (missing.length) throw new Error(`Audio is not complete. Missing ${missing.length} item(s).`);
      const state = {
        ...(await readJsonFile(initStatePath(requestedLessonId), {})),
        parseConfirmed: true,
        audioConfirmed: true,
        completedAt: new Date().toISOString(),
        voiceId
      };
      await writeJsonFile(initStatePath(requestedLessonId), state);
      sendJson(res, 200, { lessonId: requestedLessonId, voiceId, state, audio: { items: audioItems, generated: audioItems.length, missing: 0, total: audioItems.length } });
      return true;
    }
    if (url.pathname === "/api/audio/voices") {
      sendJson(res, 200, { voices, defaultVoiceId, sampleText });
      return true;
    }
    if (url.pathname === "/api/audio/status") {
      const voiceId = url.searchParams.get("voiceId") || defaultVoiceId;
      const requestedLessonId = safeLessonId(url.searchParams.get("lessonId") || lessonId);
      const lessonData = requestedLessonId === lessonId
        ? await loadLesson()
        : await readJsonFile(initLessonPath(requestedLessonId), null);
      if (!lessonData) throw new Error(`Lesson ${requestedLessonId} is not available.`);
      const jobs = requestedLessonId === lessonId ? lessonAudioJobs(lessonData) : lessonDraftAudioJobs(lessonData);
      const items = jobs.map((job) => ({ ...job, ...audioStatusForLesson(requestedLessonId, voiceId, job.type, job.id) }));
      sendJson(res, 200, { lessonId: requestedLessonId, voiceId, items });
      return true;
    }
    if (url.pathname === "/api/audio/generate" && req.method === "POST") {
      const { lessonId: bodyLessonId = lessonId, voiceId = defaultVoiceId, type, id, scope = "one" } = await readJson(req);
      const requestedLessonId = safeLessonId(bodyLessonId);
      const lessonData = requestedLessonId === lessonId
        ? await loadLesson()
        : await readJsonFile(initLessonPath(requestedLessonId), null);
      if (!lessonData) throw new Error(`Lesson ${requestedLessonId} is not available.`);
      const jobs = requestedLessonId === lessonId ? lessonAudioJobs(lessonData) : lessonDraftAudioJobs(lessonData);
      const targets = scope === "all"
        ? jobs.filter((job) => !audioStatusForLesson(requestedLessonId, voiceId, job.type, job.id).exists)
        : jobs.filter((job) => job.type === type && job.id === id);
      if (!targets.length) {
        sendJson(res, 200, { lessonId: requestedLessonId, voiceId, generated: 0, skipped: scope === "all" ? jobs.length : 1, items: [] });
        return true;
      }
      const items = [];
      for (const [index, job] of targets.entries()) {
        try {
          items.push(requestedLessonId === lessonId
            ? { id: job.id, type: job.type, ...(await generateAudio(voiceId, job.type, job.id, job.text)) }
            : await generateInitAudioJob(requestedLessonId, voiceId, job));
        } catch (error) {
          items.push({
            id: job.id,
            type: job.type,
            exists: false,
            generated: false,
            error: String(error.message || error),
            url: audioUrlForLesson(requestedLessonId, voiceId, job.type, job.id),
            source: ""
          });
        }
        if (scope === "all" && index < targets.length - 1) await wait(generationDelayMs);
      }
      const generated = items.filter((item) => item.generated).length;
      const failed = items.filter((item) => item.error).length;
      sendJson(res, 200, { lessonId: requestedLessonId, voiceId, generated, failed, skipped: targets.length - generated - failed, items });
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
      const audioFile = firstFile(files.audio);
      if (!audioFile?.buffer?.length) throw new Error("Missing audio file.");
      const debugAudio = await savePronunciationDebugAudio({ lessonId, wordId: fields.wordId || "unknown", audioBuffer: audioFile.buffer });
      const result = await evaluatePronunciation({ referenceText, audioBuffer: audioFile.buffer });
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
  if (url.pathname.startsWith("/api/")) {
    if (await handleApi(req, res, url)) return;
    sendJson(res, 404, { error: `Unknown API route or method: ${req.method} ${url.pathname}` });
    return;
  }
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
