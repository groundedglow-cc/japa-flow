import { createServer, request as httpRequest } from "node:http";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, extname, join, normalize } from "node:path";
import vm from "node:vm";
import ffmpeg from "ffmpeg-static";

// Lightweight .env loader (Node 14 compatible). Populates process.env from ./.env if present.
(() => {
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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
})();

import { isOSSEnabled, getOSSConfig, ossUrl, uploadToOSS } from "./scripts/oss-utils.mjs";

const root = process.cwd();
const port = Number(process.env.PORT || 5173);
const japaflowApiPort = Number(process.env.JAPAFLOW_API_PORT || 8081);
const lessonId = 27;
const defaultVoiceId = "Japanese_IntellectualSenior";
const sampleText = "子供の時、大きな地震がありました。";
const generationDelayMs = Number(process.env.MINIMAX_DELAY_MS || 200);
const quotaApiBaseUrl = String(process.env.JAPAFLOW_QUOTA_API_URL || `http://127.0.0.1:${japaflowApiPort}`).replace(/\/+$/, "");

async function reserveAiQuota(authHeader, capability) {
  if (!authHeader) {
    const error = new Error("请先登录后再使用 AI 功能。");
    error.status = 401;
    error.payload = { code: "AUTH_REQUIRED", message: error.message };
    throw error;
  }
  const response = await fetch(`${quotaApiBaseUrl}/api/japaflow/ai-quota/reserve`, {
    method: "POST",
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({ capability })
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.message || "今日 AI 调用次数已用完。");
    error.status = response.status;
    error.payload = body;
    throw error;
  }
  return body;
}

async function completeAiQuota(authHeader, requestId, success) {
  if (!authHeader || !requestId) return;
  try {
    await fetch(`${quotaApiBaseUrl}/api/japaflow/ai-quota/complete/${encodeURIComponent(requestId)}?success=${success ? "true" : "false"}`, {
      method: "POST",
      headers: { Authorization: authHeader }
    });
  } catch (error) {
    console.error("AI quota completion failed:", error.message || error);
  }
}

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
const lessonCatalogMetadata = {
  1: "李さんは中国人です",
  2: "これは本です",
  3: "ここはデパートです",
  4: "部屋に机といすがあります",
  5: "森さんは7時に起きます",
  6: "吉田さんは来月中国へ行きます",
  7: "李さんは毎日コーヒーを飲みます",
  8: "李さんは日本語で手紙を書きます",
  9: "四川料理は辛いです",
  10: "京都の紅葉は有名です",
  11: "小野さんは歌が好きです",
  12: "李さんは森さんより若いです",
  13: "机の上に本が3冊あります",
  14: "昨日デパートへ行きました",
  15: "小野さんは今新聞を読んでいます",
  16: "ホテルの部屋は広くて明るいです",
  17: "わたしは新しい洋服が欲しいです",
  18: "携帯電話はとても小さくなりました",
  19: "部屋の鍵を忘れないでください",
  20: "スミスさんはピアノを弾くことができます",
  21: "わたしはすき焼きを食べたことがあります",
  22: "森さんは毎晩テレビを見る",
  23: "休みの日、散歩したり買い物に行ったりします",
  24: "李さんはもうすぐ来ると思います",
  25: "これは明日会議で使う資料です",
  26: "自転車に2人で乗るのは危ないです",
  27: "子供の時、大きな地震がありました",
  28: "馬さんはわたしに地図をくれました",
  29: "電気を消せ",
  30: "もう11時だから寝よう",
  31: "このボタンを押すと，電源が入ります",
  32: "今度の日曜日に遊園地へ行くつもりです",
  33: "電車が急に止まりました",
  34: "壁にカレンダーが掛けてあります",
  35: "明日雨が降ったら，マラソン大会は中止です",
  36: "遅くなって，すみません",
  37: "優勝すれば，オリンピックに出場することができます",
  38: "戴さんは英語が話せます",
  39: "眼鏡をかけて本を読みます",
  40: "これから友達と食事に行くところです",
  41: "李さんは部長にほめられました",
  42: "テレビをつけたまま，出かけてしまいました",
  43: "陳さんは，息子をアメリカに留学させます",
  44: "玄関のところにだれかいるようです",
  45: "少子化が進んで，日本の人口はだんだん減っていくでしょう",
  46: "これは柔らかくて，まるで本物の毛皮のようです",
  47: "周先生は明日日本へ行かれます",
  48: "お荷物は私がお持ちします"
};

const lessonCatalog = Array.from({ length: 48 }, (_, index) => {
  const id = index + 1;
  const runtimeReady = id === 27;
  return {
    id,
    title: `第${id}课`,
    subtitle: lessonCatalogMetadata[id] || "待初始化",
    status: runtimeReady ? "ready" : "pending",
    description: runtimeReady
      ? "围绕第 27 课完成单词、语法、课文朗读、标准练习和结果复盘。"
      : "课程内容尚未采集，后续可继续按同一结构初始化。",
    runtimeReady
  };
});

const ALLOWED_ORIGINS = ["http://localhost:3000", "https://groundedglow.cc"];

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
}

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

function initCodexCommonRulesPath() {
  return join(root, "data", "lesson-init", "codex-parse-common.md");
}

function initCodexTaskTemplatePath() {
  return join(root, "data", "lesson-init", "codex-course-parse-task-template.md");
}

function imageBucketDir(lessonId, bucket) {
  if (!initBuckets.includes(bucket)) throw new Error("Invalid image bucket.");
  return join(root, "course-assets", `lesson${lessonId}`, bucket);
}

function byLessonDir(lessonId) {
  return join(root, "course-assets", "by-lesson", `lesson${lessonId}`);
}

function isInitImageFile(name) {
  return [".png", ".jpg", ".jpeg", ".webp"].includes(extname(name).toLowerCase());
}

function naturalFileCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
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

function lessonCounts(lessonData) {
  return {
    vocabulary: lessonData?.vocabulary?.length || 0,
    grammar: lessonData?.grammar?.length || 0,
    sentences: lessonData?.sentences?.length || 0,
    exercises: lessonData?.exercises?.length || 0
  };
}

function lessonSubtitleForCatalog(lessonData, fallback) {
  const subtitle = String(lessonData?.subtitle || "").trim();
  if (subtitle && subtitle !== "待确认" && subtitle !== "待初始化") return subtitle;
  return lessonData?.sentences?.[0]?.text || fallback;
}

function lessonContentSignature(lessonData) {
  if (!lessonData) return "";
  return JSON.stringify({
    vocabulary: lessonData.vocabulary || [],
    sentences: lessonData.sentences || [],
    grammar: lessonData.grammar || [],
    exercises: lessonData.exercises || []
  });
}

function lessonInitComplete(lessonData, initState, lessonIdValue) {
  if (!lessonData) return false;
  if (initState.parseConfirmed && initState.audioConfirmed) return true;
  const voiceId = initState.voiceId || defaultVoiceId;
  const jobs = lessonDraftAudioJobs(lessonData);
  return Boolean(jobs.length) && jobs.every((job) => existsSync(audioPathForLesson(lessonIdValue, voiceId, job.type, job.id)));
}

async function initializedLessonCatalog() {
  const records = await Promise.all(lessonCatalog.map(async (item) => ({
    item,
    lessonData: item.runtimeReady ? null : await readJsonFile(initLessonPath(item.id), null),
    initState: item.runtimeReady ? {} : await readJsonFile(initStatePath(item.id), {})
  })));
  const signatureOwners = new Map();
  records.forEach(({ item, lessonData, initState }) => {
    if (item.runtimeReady || !lessonInitComplete(lessonData, initState, item.id)) return;
    const signature = lessonContentSignature(lessonData);
    if (!signatureOwners.has(signature)) signatureOwners.set(signature, []);
    signatureOwners.get(signature).push(item.id);
  });

  return records.map(({ item, lessonData, initState }) => {
    if (item.runtimeReady) return item;
    const initialized = lessonInitComplete(lessonData, initState, item.id);
    if (!initialized) return item;
    const duplicateLessonIds = signatureOwners.get(lessonContentSignature(lessonData)) || [];
    const duplicateOf = Number(duplicateLessonIds[0]) === Number(item.id) ? null : duplicateLessonIds[0];
    if (duplicateOf) {
      return {
        ...item,
        subtitle: lessonSubtitleForCatalog(lessonData, item.subtitle),
        status: "invalid",
        statusLabel: "数据待校验",
        description: `课程数据与第${duplicateOf}课完全重复，统计数量暂不作为真实课程数据展示。请重新核对原始截图并生成本课 JSON。`,
        runtimeReady: false,
        voiceId: initState.voiceId || defaultVoiceId,
        initializedAt: initState.completedAt || initState.parseConfirmedAt || "",
        validationIssues: [`core-data-duplicates-lesson-${duplicateOf}`]
      };
    }
    const counts = lessonCounts(lessonData);
    return {
      ...item,
      subtitle: lessonSubtitleForCatalog(lessonData, item.subtitle),
      status: "initialized",
      statusLabel: "已初始化",
      description: `课程数据和音频已完成：${counts.vocabulary} 个单词，${counts.grammar} 个语法，${counts.sentences} 句课文，${counts.exercises} 道练习。`,
      runtimeReady: false,
      voiceId: initState.voiceId || defaultVoiceId,
      initializedAt: initState.completedAt || initState.parseConfirmedAt || "",
      counts
    };
  });
}

async function syncStudentCatalog() {
  const lessons = await initializedLessonCatalog();
  await writeJsonFile(join(root, "data", "catalog.json"), { lessons, generatedAt: new Date().toISOString() });
  return lessons;
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
  const match = appJs.match(/(?:const|let) lesson = ([\s\S]*?\n};)/);
  if (!match) throw new Error("Could not find lesson object in app.js");
  return vm.runInNewContext(`(${match[1].replace(/;$/, "")})`);
}

function voicePath(voiceId, type, id) {
  return join(root, "audio", `lesson${lessonId}`, "voices", voiceId, `${type}s`, `${id}.mp3`);
}

function voiceUrl(voiceId, type, id) {
  const relative = `audio/lesson${lessonId}/voices/${voiceId}/${type}s/${id}.mp3`;
  if (isOSSEnabled()) return ossUrl(relative);
  return `/${relative}`;
}

function legacyPath(type, id) {
  return join(root, "audio", `lesson${lessonId}`, `${type}s`, `${id}.mp3`);
}

function legacyUrl(type, id) {
  const relative = `audio/lesson${lessonId}/${type}s/${id}.mp3`;
  if (isOSSEnabled()) return ossUrl(relative);
  return `/${relative}`;
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

function wordAudioText(word) {
  return word?.kana || word?.jp || "";
}

function lessonAudioJobs(lesson) {
  return [
    ...lesson.vocabulary.map((word) => ({ id: word.id, type: "word", label: word.jp, text: wordAudioText(word), kana: word.kana, cn: word.cn })),
    ...lesson.sentences.map((sentence) => ({ id: sentence.id, type: "sentence", label: sentence.text, text: sentence.text, cn: sentence.translation })),
    ...lesson.grammar.flatMap((grammar) => (grammar.extraExamples || [])
      .map((example, index) => ({ example, index }))
      .filter(({ example }) => !isIncorrectLessonExample(example))
      .map(({ example, index }) => ({
        id: `${grammar.id}-extra-${index + 1}`,
        type: "sentence",
        label: lessonTextLabel(example),
        text: lessonTextValue(example),
        cn: example.translation
      })))
  ];
}

function audioPathForLesson(lessonIdValue, voiceId, type, id) {
  return join(root, "audio", `lesson${lessonIdValue}`, "voices", voiceId, `${type}s`, `${id}.mp3`);
}

function audioUrlForLesson(lessonIdValue, voiceId, type, id) {
  const relative = `audio/lesson${lessonIdValue}/voices/${voiceId}/${type}s/${id}.mp3`;
  if (isOSSEnabled()) return ossUrl(relative);
  return `/${relative}`;
}

function addUniqueJob(jobs, seen, job) {
  const key = `${job.type}:${job.id}:${job.text}`;
  if (!job.text || seen.has(key)) return;
  seen.add(key);
  jobs.push(job);
}

function lessonTextValue(value) {
  const text = typeof value === "string" ? value : value?.text || value?.jp || "";
  return String(text || "").trim().replace(/^[×xX✕]\s*/, "");
}

function lessonTextLabel(value) {
  return lessonTextValue(value) || value?.label || "";
}

function isIncorrectLessonExample(value) {
  const text = typeof value === "string" ? value : value?.text || value?.jp || "";
  return Boolean(value?.isIncorrect || value?.incorrect || value?.correct === false || /^[×xX✕]/.test(String(text || "").trim()));
}

function lessonDraftAudioJobs(lesson) {
  const jobs = [];
  const seen = new Set();
  (lesson.vocabulary || []).forEach((word) => {
    addUniqueJob(jobs, seen, { id: word.id, type: "word", label: word.jp, text: wordAudioText(word), source: "vocabulary" });
  });
  (lesson.sentences || []).forEach((sentence) => {
    addUniqueJob(jobs, seen, { id: sentence.id, type: "sentence", label: sentence.text, text: sentence.text, source: "text" });
  });
  (lesson.grammar || []).forEach((grammar) => {
    (grammar.extraExamples || []).forEach((example, index) => {
      if (isIncorrectLessonExample(example)) return;
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
  const inferredImages = await byLessonImages(lessonIdValue);
  for (const bucket of initBuckets) {
    if (inferredImages.length >= 10) {
      result[bucket] = (inferredLessonImageIndexes[bucket] || [])
        .map((index) => inferredImages[index])
        .filter(Boolean)
        .map((image) => ({
          ...image,
          bucket,
          source: "by-lesson"
        }));
      continue;
    }
    const dir = imageBucketDir(lessonIdValue, bucket);
    let entries = [];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      entries = [];
    }
    result[bucket] = entries
      .filter((entry) => entry.isFile() && isInitImageFile(entry.name))
      .map((entry) => ({
        name: entry.name,
        url: `/course-assets/lesson${lessonIdValue}/${bucket}/${entry.name}`,
        bucket,
        source: "bucket"
      }))
      .sort((a, b) => naturalFileCompare(a.name, b.name));
  }
  return result;
}

async function byLessonImages(lessonIdValue) {
  let entries = [];
  try {
    entries = await readdir(byLessonDir(lessonIdValue), { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((entry) => entry.isFile() && isInitImageFile(entry.name))
    .map((entry) => ({
      name: entry.name,
      url: `/course-assets/by-lesson/lesson${lessonIdValue}/${entry.name}`,
      index: 0
    }))
    .sort((a, b) => naturalFileCompare(a.name, b.name))
    .map((image, index) => ({ ...image, index: index + 1 }));
}

function initImageAbsolutePath(image) {
  return join(root, image.url.replace(/^\//, ""));
}

function uniqueInitImagePaths(manifest) {
  return [...new Set(initBuckets.flatMap((bucket) => (manifest[bucket] || []).map(initImageAbsolutePath)))];
}

function codexBucketList(lessonIdValue, manifest) {
  return initBuckets.map((bucket) => {
    const images = manifest[bucket] || [];
    if (images.length) {
      const paths = images.map((image) => {
        const indexLabel = image.index ? `#${image.index} ` : "";
        return `\`${initImageAbsolutePath(image)}\`${indexLabel ? ` (${indexLabel}${image.name})` : ""}`;
      }).join(", ");
      return `- \`${bucket}\`: ${paths}`;
    }
    return `- \`${bucket}\`: no inferred image found; fallback directory \`${imageBucketDir(lessonIdValue, bucket)}\``;
  }).join("\n");
}

function validateLessonDraft(draft, expectedLessonId) {
  if (!draft || typeof draft !== "object") throw new Error("Draft must be an object.");
  draft.id = safeLessonId(draft.id || expectedLessonId);
  if (draft.id !== expectedLessonId) throw new Error(`Draft lesson id ${draft.id} does not match lesson ${expectedLessonId}.`);
  draft.title = draft.title || `第${expectedLessonId}课`;
  for (const key of ["vocabulary", "sentences", "grammar", "exercises"]) {
    if (!Array.isArray(draft[key])) throw new Error(`Draft missing ${key} array.`);
  }
  if (!Array.isArray(draft.textStructure)) draft.textStructure = [];
  draft.subtitle = draft.subtitle || draft.sentences?.[0]?.text || "待确认";
  backfillExerciseKana(draft);
  return draft;
}

const exerciseKanaSupplementEntries = [
  ["地図", "ちず"],
  ["切符", "きっぷ"],
  ["買い方", "かいかた"],
  ["紹介", "しょうかい"],
  ["薬", "くすり"],
  ["友達", "ともだち"],
  ["お土産", "おみやげ"],
  ["有名", "ゆうめい"],
  ["野菜", "やさい"],
  ["新鮮", "しんせん"],
  ["旅行", "りょこう"],
  ["仕事", "しごと"],
  ["大使館", "たいしかん"],
  ["電話番号", "でんわばんごう"],
  ["番号", "ばんごう"],
  ["住所", "じゅうしょ"],
  ["発音", "はつおん"],
  ["直", "なお"],
  ["調べ", "しらべ"],
  ["交換", "こうかん"],
  ["動", "うご"],
  ["部品", "ぶひん"],
  ["自転車", "じてんしゃ"],
  ["英語", "えいご"],
  ["フランス語", "フランスご"],
  ["韓国語", "かんこくご"],
  ["上手", "じょうず"],
  ["時間", "じかん"],
  ["朝", "あさ"],
  ["会社", "かいしゃ"],
  ["横浜", "よこはま"],
  ["誕生日", "たんじょうび"],
  ["大丈夫", "だいじょうぶ"],
  ["案内", "あんない"],
  ["訳", "やく"],
  ["引っ越し", "ひっこし"],
  ["手伝", "てつだ"],
  ["貸", "か"],
  ["見せ", "みせ"],
  ["持", "も"],
  ["来", "き"],
  ["でき", "でき"],
  ["分か", "わか"],
  ["教え", "おしえ"],
  ["届", "とど"],
  ["送", "おく"],
  ["書", "か"],
  ["読", "よ"],
  ["会", "あ"],
  ["行", "い"],
  ["買", "か"],
  ["使", "つか"],
  ["作", "つく"],
  ["帰", "かえ"],
  ["部長", "ぶちょう"],
  ["荷物", "にもつ"],
  ["手紙", "てがみ"],
  ["中国語", "ちゅうごくご"],
  ["日本語", "にほんご"],
  ["東京", "とうきょう"],
  ["本", "ほん"],
  ["王さん", "おうさん"],
  ["小野さん", "おのさん"],
  ["中田先生", "なかだせんせい"],
  ["娘さん", "むすめさん"],
  ["空港", "くうこう"],
  ["鉛筆", "えんぴつ"],
  ["辞書", "じしょ"],
  ["枚", "まい"],
  ["天ぷら", "てんぷら"],
  ["作り方", "つくりかた"],
  ["車", "くるま"],
  ["店", "みせ"],
  ["料理", "りょうり"],
  ["お茶", "おちゃ"],
  ["森さん", "もりさん"],
  ["林さん", "はやしさん"]
];

function backfillExerciseKana(draft) {
  const dictionary = buildExerciseKanaDictionary(draft);
  for (const exercise of draft.exercises || []) {
    if (exercise.question && !exercise.questionKana) {
      const kana = deriveExerciseKana(exercise.question, dictionary);
      if (kana) exercise.questionKana = kana;
    }
    if (exercise.example && !exercise.exampleKana) {
      const kana = deriveExerciseKana(exercise.example, dictionary);
      if (kana) exercise.exampleKana = kana;
    }
    if (exercise.answer && !exercise.answerKana) {
      const kana = deriveExerciseKana(exercise.answer, dictionary);
      if (kana) exercise.answerKana = kana;
    }
    if (Array.isArray(exercise.referenceAnswers)) {
      const kanaList = Array.isArray(exercise.referenceAnswerKana) ? [...exercise.referenceAnswerKana] : [];
      let changed = false;
      for (let index = 0; index < exercise.referenceAnswers.length; index += 1) {
        if (kanaList[index]) continue;
        const kana = deriveExerciseKana(exercise.referenceAnswers[index], dictionary);
        if (kana) {
          kanaList[index] = kana;
          changed = true;
        }
      }
      if (changed || (!exercise.referenceAnswerKana && kanaList.some(Boolean))) {
        exercise.referenceAnswerKana = kanaList;
      }
    }
  }
}

function buildExerciseKanaDictionary(draft) {
  const map = new Map();
  const add = (surface, reading) => {
    const text = String(surface || "").trim();
    const kana = String(reading || "").trim();
    if (!text || !kana) return;
    const current = map.get(text);
    if (!current || current.length < kana.length) map.set(text, kana);
  };

  for (const [surface, reading] of exerciseKanaSupplementEntries) add(surface, reading);
  for (const word of draft.vocabulary || []) add(word.jp, word.kana);
  for (const sentence of draft.sentences || []) {
    add(sentence.text, sentence.kana);
    for (const [surface, reading] of extractRubyPairs(sentence.text, sentence.kana)) add(surface, reading);
  }
  for (const exercise of draft.exercises || []) {
    if (exercise.question && exercise.questionKana) add(exercise.question, exercise.questionKana);
    if (exercise.example && exercise.exampleKana) add(exercise.example, exercise.exampleKana);
    if (exercise.answer && exercise.answerKana) add(exercise.answer, exercise.answerKana);
    for (let index = 0; index < (exercise.referenceAnswers || []).length; index += 1) {
      const reading = Array.isArray(exercise.referenceAnswerKana) ? exercise.referenceAnswerKana[index] : "";
      if (reading) add(exercise.referenceAnswers[index], reading);
    }
  }
  return [...map.entries()].sort((a, b) => b[0].length - a[0].length);
}

function deriveExerciseKana(text, entries) {
  const source = String(text || "");
  if (!source) return "";
  let result = "";
  for (let index = 0; index < source.length;) {
    const char = source[index];
    if (/\s/.test(char) || isExercisePunctuation(char)) {
      result += char;
      index += 1;
      continue;
    }
    let matched = null;
    for (const [surface, reading] of entries) {
      if (source.startsWith(surface, index)) {
        matched = [surface, reading];
        break;
      }
    }
    if (matched) {
      result += matched[1];
      index += matched[0].length;
      continue;
    }
    if (/[\u3040-\u30ffA-Za-z0-9０-９]/u.test(char)) {
      result += char;
      index += 1;
      continue;
    }
    if (/[\u3400-\u9fff]/u.test(char)) return "";
    result += char;
    index += 1;
  }
  return result;
}

function isExercisePunctuation(char) {
  return /[。、，．,.！？!?「」『』（）()［］\[\]【】・:：;；／\/—\-]/u.test(char || "");
}

function extractRubyPairs(text, reading) {
  const result = [];
  const surface = String(text || "");
  const kana = String(reading || "");
  if (!surface || !kana) return result;
  const patterns = [
    ["地図", "ちず"],
    ["仕事", "しごと"],
    ["大使館", "たいしかん"]
  ];
  for (const [needle, ruby] of patterns) {
    if (surface.includes(needle) && kana.includes(ruby)) result.push([needle, ruby]);
  }
  return result;
}

async function codexParseTask(lessonIdValue) {
  const manifest = await initImageManifest(lessonIdValue);
  const imagePaths = uniqueInitImagePaths(manifest);
  if (!imagePaths.length) throw new Error("No uploaded images found for this lesson.");
  const taskPath = initCodexTaskPath(lessonIdValue);
  const draftPath = initDraftPath(lessonIdValue);
  await mkdir(dirname(taskPath), { recursive: true });
  await mkdir(dirname(draftPath), { recursive: true });
  const imageArgs = imagePaths.map((filePath) => `--image ${JSON.stringify(filePath)}`).join(" ");
  const promptText = `Read ${taskPath} and write the requested JSON draft.`;
  const command = `printf '%s' ${JSON.stringify(promptText)} | codex exec -C ${JSON.stringify(root)} -s workspace-write ${imageArgs} -`;
  const commonRulesPath = initCodexCommonRulesPath();
  const usesInferredImages = initBuckets.some((bucket) => (manifest[bucket] || []).some((image) => image.source === "by-lesson"));
  const lessonAssetRoot = usesInferredImages ? byLessonDir(lessonIdValue) : join(root, "course-assets", `lesson${lessonIdValue}`);
  const template = await readFile(initCodexTaskTemplatePath(), "utf8");
  const prompt = template
    .replaceAll("{{LESSON_ID}}", String(lessonIdValue))
    .replaceAll("{{COMMON_RULES_PATH}}", commonRulesPath)
    .replaceAll("{{DRAFT_PATH}}", draftPath)
    .replaceAll("{{LESSON_ASSET_ROOT}}", lessonAssetRoot)
    .replaceAll("{{BUCKET_LIST}}", codexBucketList(lessonIdValue, manifest));
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
  const buffer = await synthesizeWithRetry(job.text, voiceId);
  await writeFile(filePath, buffer);
  if (isOSSEnabled()) {
    const ossKey = `audio/lesson${lessonIdValue}/voices/${voiceId}/${job.type}s/${job.id}.mp3`;
    try { await uploadToOSS(ossKey, buffer); }
    catch (e) { console.error(`OSS upload failed: ${ossKey}`, e.message); }
  }
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
      voice_setting: { voice_id: voiceId, speed: 0.9, vol: 1, pitch: 0, emotion: "neutral" },
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
  const buffer = await synthesizeWithRetry(text, voiceId);
  await writeFile(filePath, buffer);
  if (isOSSEnabled()) {
    const ossKey = `audio/lesson${lessonId}/voices/${voiceId}/${type}s/${id}.mp3`;
    try { await uploadToOSS(ossKey, buffer); }
    catch (e) { console.error(`OSS upload failed: ${ossKey}`, e.message); }
  }
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

function runProcess(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.once("error", reject);
    child.once("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
    });
  });
}

function inspectSpeechAudio(buffer) {
  const summary = { bytes: buffer.length, container: "unknown" };
  if (buffer.length < 12 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") return summary;
  summary.container = "wav";
  let offset = 12;
  let dataOffset = 0;
  let dataLength = 0;
  while (offset + 8 <= buffer.length) {
    const chunkId = buffer.toString("ascii", offset, offset + 4);
    const chunkLength = buffer.readUInt32LE(offset + 4);
    const chunkOffset = offset + 8;
    if (chunkId === "fmt " && chunkLength >= 16 && chunkOffset + 16 <= buffer.length) {
      summary.audioFormat = buffer.readUInt16LE(chunkOffset);
      summary.channels = buffer.readUInt16LE(chunkOffset + 2);
      summary.sampleRate = buffer.readUInt32LE(chunkOffset + 4);
      summary.bitsPerSample = buffer.readUInt16LE(chunkOffset + 14);
    }
    if (chunkId === "data") {
      dataOffset = chunkOffset;
      dataLength = Math.min(chunkLength, buffer.length - chunkOffset);
      break;
    }
    offset = chunkOffset + chunkLength + (chunkLength % 2);
  }
  if (!dataLength) return summary;
  summary.dataBytes = dataLength;
  const bytesPerFrame = Number(summary.channels || 0) * Number(summary.bitsPerSample || 0) / 8;
  if (bytesPerFrame && summary.sampleRate) summary.durationSeconds = Number((dataLength / bytesPerFrame / summary.sampleRate).toFixed(3));
  if (summary.audioFormat === 1 && summary.bitsPerSample === 16) {
    let peak = 0;
    let sumSquares = 0;
    let samples = 0;
    for (let index = dataOffset; index + 1 < dataOffset + dataLength; index += 2) {
      const sample = buffer.readInt16LE(index) / 32768;
      peak = Math.max(peak, Math.abs(sample));
      sumSquares += sample * sample;
      samples += 1;
    }
    summary.peak = Number(peak.toFixed(4));
    summary.rms = Number(Math.sqrt(sumSquares / Math.max(samples, 1)).toFixed(4));
  }
  return summary;
}

async function normalizeSpeechAudio(audioBuffer) {
  if (!ffmpeg) throw new Error("Speech audio conversion is unavailable: ffmpeg-static is not installed.");
  const tempDir = await mkdtemp(join(tmpdir(), "japaflow-speech-"));
  const inputPath = join(tempDir, "input.wav");
  const outputPath = join(tempDir, "normalized.wav");
  try {
    await writeFile(inputPath, audioBuffer);
    await runProcess(ffmpeg, [
      "-y", "-i", inputPath,
      "-vn", "-map", "0:a:0",
      "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le",
      "-f", "wav", outputPath
    ]);
    return await readFile(outputPath);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function transcribeSpeech({ audioBuffer, language = "ja-JP" }) {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = normalizeAzureRegion(process.env.AZURE_SPEECH_REGION);
  if (!key || !region) throw new Error("Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION.");
  const endpoint = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${encodeURIComponent(language)}&format=detailed`;
  // Browser AudioContext implementations can ignore the requested sample rate.
  // Match the batch alignment pipeline by sending Azure a canonical PCM WAV.
  console.info("[speech/transcribe] input audio", inspectSpeechAudio(audioBuffer));
  const normalizedAudio = await normalizeSpeechAudio(audioBuffer);
  console.info("[speech/transcribe] normalized audio", inspectSpeechAudio(normalizedAudio));
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
      "Accept": "application/json"
    },
    body: normalizedAudio
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Azure Speech HTTP ${response.status} (region=${region}): ${text}`);
  const raw = JSON.parse(text);
  console.info("[speech/transcribe] Azure response", {
    recognitionStatus: raw.RecognitionStatus || "",
    displayTextLength: String(raw.DisplayText || "").length,
    nBestCount: Array.isArray(raw.NBest) ? raw.NBest.length : 0,
    duration: raw.Duration || 0
  });
  const best = raw.NBest?.[0] || {};
  return {
    recognizedText: raw.DisplayText || best.Display || best.Lexical || "",
    raw
  };
}

async function evaluatePronunciation({ referenceText, audioBuffer, authHeader }) {
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
  const quota = await reserveAiQuota(authHeader, "azure_pronunciation");
  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        "Accept": "application/json",
        "Pronunciation-Assessment": assessment
      },
      body: audioBuffer
    });
  } catch (error) {
    await completeAiQuota(authHeader, quota.requestId, false);
    throw error;
  }
  const text = await response.text();
  await completeAiQuota(authHeader, quota.requestId, response.ok);
  if (!response.ok) throw new Error(`Azure Speech HTTP ${response.status} (region=${region}): ${text}`);
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

function extractJsonObject(text) {
  const value = String(text || "").trim();
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "string") return extractJsonObject(parsed);
    return parsed;
  } catch {}
  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try {
      const parsed = JSON.parse(fenced[1].trim());
      if (typeof parsed === "string") return extractJsonObject(parsed);
      return parsed;
    } catch {}
  }
  const start = value.indexOf("{");
  const end = value.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      const parsed = JSON.parse(value.slice(start, end + 1));
      if (typeof parsed === "string") return extractJsonObject(parsed);
      return parsed;
    } catch {}
  }
  return {};
}

function decodeJsonishString(value) {
  const raw = String(value || "");
  if (!raw) return "";
  for (const candidate of [raw, raw.replace(/\r/g, "\\r").replace(/\n/g, "\\n")]) {
    try {
      return JSON.parse(`"${candidate}"`);
    } catch {}
  }
  return raw
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\"/g, "\"")
    .replace(/\\\\/g, "\\")
    .trim();
}

function extractJsonishStringField(value, fieldName) {
  const text = String(value || "").trim();
  if (!text) return "";
  const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const quotedPattern = new RegExp(`"${escapedName}"\\s*:\\s*"([\\s\\S]*?)"\\s*(?:,\\s*"[^"]+"\\s*:|\\s*})`);
  const quoted = text.match(quotedPattern);
  if (quoted) return decodeJsonishString(quoted[1]);
  return "";
}

function extractFormattedPracticeText(value) {
  if (value && typeof value === "object" && typeof value.formattedText === "string") {
    return extractFormattedPracticeText(value.formattedText) || compactPracticeText(value.formattedText, 3000);
  }
  const text = String(value || "").trim();
  if (!text) return "";
  const parsed = extractJsonObject(text);
  if (parsed && typeof parsed.formattedText === "string") {
    return extractFormattedPracticeText(parsed.formattedText) || compactPracticeText(parsed.formattedText, 3000);
  }
  const looseFormattedText = extractJsonishStringField(text, "formattedText");
  if (looseFormattedText) return compactPracticeText(looseFormattedText, 3000);
  return "";
}

function extractNotesText(value) {
  if (value && typeof value === "object" && typeof value.notes === "string") {
    return compactPracticeText(value.notes, 600);
  }
  const parsed = extractJsonObject(value);
  if (parsed && typeof parsed.notes === "string") return compactPracticeText(parsed.notes, 600);
  return compactPracticeText(extractJsonishStringField(value, "notes"), 600);
}

function normalizeFormattedPracticeText(value) {
  const formattedText = extractFormattedPracticeText(value);
  if (formattedText) return formattedText;
  return compactPracticeText(value, 3000);
}

function normalizeDialogueSpeakerText(value) {
  return compactPracticeText(value, 3000)
    .split("\n")
    .map((line) => line.replace(/^((?:乙[12１２]?)|[甲丙丁ABCD])[:：\s]*/, "$1："))
    .join("\n");
}

function normalizeJapanesePracticeSentence(value) {
  let text = String(value || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!/[。？！]$/.test(text)) text += "。";
  return text;
}

function sanitizeDialogueLabels(labels) {
  return (Array.isArray(labels) ? labels : [])
    .map((label) => String(label || "").trim().replace(/[：:]/g, ""))
    .filter((label) => /^((?:乙[12１２]?)|[甲丙丁ABCD])$/.test(label))
    .slice(0, 12);
}

function sanitizeDialogueSentenceCounts(counts, expectedLength) {
  const values = (Array.isArray(counts) ? counts : [])
    .map((count) => Number(count))
    .filter((count) => Number.isInteger(count) && count > 0)
    .slice(0, expectedLength);
  return values.length === expectedLength ? values : [];
}

function dialogueLabelsFromExamples(examples) {
  const text = String(examples || "");
  const labels = Array.from(text.matchAll(/(?:^|\n|\s)((?:乙[12１２]?)|[甲丙丁ABCD])\s*[:：]/g), (match) => match[1]);
  if (labels.length) return labels;
  if (/乙[1１].*乙[2２]/s.test(text)) return ["甲", "乙1", "乙2"];
  if (/甲.*乙/s.test(text)) return ["甲", "乙"];
  return ["甲", "乙"];
}

function dialogueLabelsFromFormat({ formatHints, examples }) {
  const hintedLabels = sanitizeDialogueLabels(formatHints?.speakerLabels);
  return hintedLabels.length ? hintedLabels : dialogueLabelsFromExamples(examples);
}

function splitDialogueUtterances(inputText) {
  const normalized = compactPracticeText(inputText, 2000)
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*((?:乙[12１２]?)|[甲丙丁ABCD])\s*[:：]?\s*/g, "\n$1：")
    .replace(/([。？！?])\s+/g, "$1\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
  if (!normalized) return [];
  const speakerLines = normalized.split("\n").filter(Boolean);
  if (speakerLines.some((line) => /^((?:乙[12１２]?)|[甲丙丁ABCD])[:：]/.test(line))) {
    return speakerLines.map((line) => normalizeDialogueSpeakerText(line)).filter(Boolean);
  }
  return speakerLines
    .flatMap((line) => line.split(/(?<=[。？！?])\s*/))
    .map((line) => normalizeJapanesePracticeSentence(line))
    .filter((line) => line && line !== "。");
}

function splitPracticeSentences(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return [];
  const sentences = text.match(/[^。？！?!]+[。？！?!]?/g) || [text];
  return sentences.map((sentence) => sentence.trim()).filter(Boolean);
}

function dialogueContentUnits(value) {
  const normalized = compactPracticeText(value, 3000)
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*((?:乙[12１２]?)|[甲丙丁ABCD])\s*[:：]\s*/g, "\n$1：")
    .replace(/\n{2,}/g, "\n")
    .trim();
  if (!normalized) return [];
  return normalized
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      const body = line.replace(/^((?:乙[12１２]?)|[甲丙丁ABCD])[:：]\s*/, "");
      return splitPracticeSentences(body);
    })
    .filter(Boolean);
}

function groupDialogueUnitsByFormat(units, labels, sentenceCounts) {
  if (!labels.length || !units.length) return [];
  if (labels.length === 2 && units.length > 2) {
    const lastQuestionIndex = units.slice(0, -1).findLastIndex((unit) => /[？?]\s*$/.test(unit));
    if (lastQuestionIndex >= 0 && !/[？?]\s*$/.test(units[units.length - 1])) {
      return [
        { label: labels[0], body: units.slice(0, lastQuestionIndex + 1).join("") },
        { label: labels[1], body: units.slice(lastQuestionIndex + 1).join("") }
      ].filter(({ body }) => body);
    }
  }

  if (!sentenceCounts.length) {
    return labels.map((label, index) => {
      if (index === labels.length - 1) return { label, body: units.slice(index).join("") };
      return { label, body: units[index] || "" };
    });
  }

  let cursor = 0;
  return labels.map((label, index) => {
    const count = sentenceCounts[index] || 1;
    const take = index === labels.length - 1
      ? units.length - cursor
      : Math.min(count, units.length - cursor);
    const body = units.slice(cursor, cursor + take).join("");
    cursor += take;
    return { label, body };
  });
}

function enforceDialogueTurnFormat(value, { examples = "", formatHints = {} } = {}) {
  const labels = dialogueLabelsFromFormat({ formatHints, examples });
  if (!labels.length) return normalizeDialogueSpeakerText(value);
  const sentenceCounts = sanitizeDialogueSentenceCounts(formatHints?.speakerSentenceCounts, labels.length);

  const units = dialogueContentUnits(value);
  if (!units.length) return normalizeDialogueSpeakerText(value);

  return groupDialogueUnitsByFormat(units, labels, sentenceCounts)
    .map(({ label, body }) => body ? `${label}：${body}` : "")
    .filter(Boolean)
    .join("\n");
}

function localFormatPracticeAnswer({ inputText, examples = "", answerUnit = "", formatHints = {} }) {
  const cleanInput = compactPracticeText(inputText, 2000);
  if (!cleanInput) return "";
  if (answerUnit !== "dialogue") return cleanInput;
  const utterances = splitDialogueUtterances(cleanInput);
  if (!utterances.length) return cleanInput;
  let formattedText;
  if (utterances.some((line) => /^((?:乙[12１２]?)|[甲丙丁ABCD])[:：]/.test(line))) {
    formattedText = normalizeDialogueSpeakerText(utterances.join("\n"));
    return enforceDialogueTurnFormat(formattedText, { examples, formatHints });
  }
  const labels = dialogueLabelsFromFormat({ formatHints, examples });
  formattedText = utterances
    .map((line, index) => `${labels[index] || labels[Math.min(index, labels.length - 1)]}：${normalizeJapanesePracticeSentence(line)}`)
    .join("\n");
  return enforceDialogueTurnFormat(formattedText, { examples, formatHints });
}

function compactPracticeText(value, limit = 3000) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, limit);
}

function practiceAnswerFingerprint(value) {
  return String(value || "")
    .replace(/((?:乙[12１２]?)|[甲丙丁ABCD])[:：]/g, "")
    .replace(/[\s。．、，,.？！?!：:；;「」『』（）()\[\]【】{}｛｝"“”'‘’／/\\|・…—_-]/g, "")
    .toLowerCase();
}

function hasSamePracticeAnswerContent(inputText, formattedText) {
  const inputFingerprint = practiceAnswerFingerprint(inputText);
  const formattedFingerprint = practiceAnswerFingerprint(formattedText);
  return Boolean(inputFingerprint) && inputFingerprint === formattedFingerprint;
}

async function askNotebookAi({ question, lessonId, pageNo, authHeader }) {
  const key = process.env.DEEPSEEK_API_KEY;
  const baseUrl = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/+$/, "");
  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
  const cleanQuestion = compactPracticeText(question, 1200);
  if (!cleanQuestion) throw new Error("请输入问题。");
  if (!key) throw new Error("未配置 DeepSeek 服务。");
  const quota = await reserveAiQuota(authHeader, "deepseek_format");
  let response;
  const messages = [
    {
      role: "system",
      content: [
        "你是面向中文母语者的日语学习助手。",
        "用户可以自由提问：日语句子、单词、语法、翻译、用法或学习建议；直接回答问题，不依赖课程编号或题目编号。",
        "若用户只输入日语句子，默认简洁说明它的中文意思、读法或关键语法，而不是留空。",
        "回答必须非常简洁：最多 3 条短句；不要寒暄，不要 Markdown 标题；信息不足时说明需要什么信息。"
      ].join("\n")
    },
    { role: "user", content: cleanQuestion }
  ];
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 320,
        messages,
        thinking: { type: "disabled" },
        stream: false
      })
    });
  } catch (error) {
    await completeAiQuota(authHeader, quota.requestId, false);
    throw error;
  }
  let body = await response.json().catch(() => ({}));
  let answer = compactPracticeText(body.choices?.[0]?.message?.content || "", 1000);
  if (response.ok && !answer) {
    try {
      response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model, temperature: 0.2, max_tokens: 320, messages: [...messages, { role: "user", content: "请直接给出简洁的学习回答，不要留空。" }], thinking: { type: "disabled" }, stream: false })
      });
      body = await response.json().catch(() => ({}));
      answer = compactPracticeText(body.choices?.[0]?.message?.content || "", 1000);
    } catch (error) {
      await completeAiQuota(authHeader, quota.requestId, false);
      throw error;
    }
  }
  await completeAiQuota(authHeader, quota.requestId, response.ok);
  if (!response.ok) throw new Error(body?.error?.message || `模型服务请求失败（${response.status}）。`);
  if (!answer) {
    console.warn("[grammar/notebook-ai] empty model response", {
      model,
      responseId: body?.id || "",
      finishReason: body?.choices?.[0]?.finish_reason || "",
      contentLength: String(body?.choices?.[0]?.message?.content || "").length,
      questionLength: cleanQuestion.length
    });
    throw new Error("模型未返回内容，请稍后重试。");
  }
  return { answer, model };
}

async function formatPracticeAnswer({ inputText, examples = "", formatHints = {}, answerUnit = "", authHeader }) {
  const key = process.env.DEEPSEEK_API_KEY;
  const baseUrl = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/+$/, "");
  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
  const cleanInput = compactPracticeText(inputText, 2000);
  if (!cleanInput) throw new Error("Missing inputText.");
  const speakerLabels = dialogueLabelsFromFormat({ formatHints, examples });
  const speakerSentenceCounts = sanitizeDialogueSentenceCounts(formatHints?.speakerSentenceCounts, speakerLabels.length);

  const fallbackResult = (notes = "格式化服务未返回可用结果，已保留原始转写。") => ({
    formattedText: localFormatPracticeAnswer({ inputText: cleanInput, examples, answerUnit, formatHints }) || cleanInput,
    notes,
    model,
    provider: "local_fallback"
  });

  if (!key) return fallbackResult("未配置模型服务，已仅按本地规则整理格式。");

  const quota = await reserveAiQuota(authHeader, "deepseek_format");
  let response;
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: [
            "你是日语练习的用户答案格式化器。",
            "你的任务只是在用户原始输入上整理格式；禁止生成答案、补全答案、纠正词汇、替换词语、改写句意或使用外部知识。",
            "你不会收到题目词汇或例句内容；只会收到抽象格式标签。不要猜测教材答案。",
            "允许的操作只有：插入换行、添加或规范说话人标签、统一全角冒号、整理空格、补最基本的句末标点。",
            "禁止把用户没有说出的词、姓名、职业、国籍、机构名加入 formattedText。",
            "禁止把用户说错或 ASR 识别错的词改成你认为正确的词。",
            "说话人标签顺序表示例句的真实对话轮次，重复标签不能去重。例如「甲 / 乙 / 甲」必须输出 3 行，而不是甲乙轮流拆成更多行。",
            "最终输出行数必须与说话人标签顺序的数量完全一致。说话人标签顺序只有「甲 / 乙」时，只能输出 2 行，禁止因为停顿或短句新增第 3 行。",
            "如果提供了每轮句子数，必须按这个句子数组合用户输入；用户停顿造成的短句不能新增 speaker 轮次。",
            "每一行必须是一轮自然、连贯、可朗读的话；不要机械地按问号、句号或 ASR 停顿切分 speaker。",
            "日语选择疑问句可以包含多个问句片段，例如「Aですか？Bですか？」整体属于同一个提问 speaker；后面的「Aです。」才是回答 speaker。",
            "如果只有「甲 / 乙」两轮，且输入形如「问题片段？问题片段？回答。」或「Aですか？Bですか？Aです。」，应输出为「甲：问题片段？问题片段？」「乙：回答。」。",
            "最终输出的每一行 speaker 后都必须使用全角冒号，例如「甲：」「乙：」，即使例句原文没有冒号也必须补上。",
            "formattedText 去掉说话人、空格和标点后，必须与用户原始输入去掉空格和标点后的内容完全一致。",
            "只返回一个 JSON object，不要 markdown，不要二次 JSON 编码。格式固定为 {\"formattedText\":\"甲：...\\n乙：...\",\"notes\":\"...\"}。"
          ].join("\n")
        },
        {
          role: "user",
          content: [
            `答案类型：${compactPracticeText(answerUnit, 60) || "未提供"}`,
            `说话人标签顺序：${speakerLabels.join(" / ")}`,
            `每轮句子数：${speakerSentenceCounts.length ? speakerSentenceCounts.join(" / ") : "未提供"}`,
            "",
            "只整理下面这段用户输入，不要参考或生成其它内容：",
            cleanInput
          ].join("\n")
        }
      ],
      temperature: 0,
      max_tokens: 220,
      thinking: { type: "disabled" },
      response_format: { type: "json_object" },
      stream: false
      })
    });
  } catch (error) {
    await completeAiQuota(authHeader, quota.requestId, false);
    throw error;
  }
  const bodyText = await response.text();
  await completeAiQuota(authHeader, quota.requestId, response.ok);
  if (!response.ok) return fallbackResult(`格式化服务 HTTP ${response.status}，已保留原始转写。`);
  let raw;
  try {
    raw = JSON.parse(bodyText);
  } catch {
    return fallbackResult("格式化服务返回非 JSON，已保留原始转写。");
  }
  const content = raw.choices?.[0]?.message?.content || "";
  const parsed = extractJsonObject(content);
  const extractedText = extractFormattedPracticeText(parsed) || extractFormattedPracticeText(content);
  const plainDialogueText = answerUnit === "dialogue" && /^((?:乙[12１２]?)|[甲丙丁ABCD])[:：]/m.test(content)
    ? compactPracticeText(content, 3000)
    : "";
  const normalizedText = extractedText || plainDialogueText;
  const formattedText = answerUnit === "dialogue"
    ? enforceDialogueTurnFormat(normalizedText, { examples, formatHints })
    : normalizedText;
  if (!formattedText) return fallbackResult();
  if (!hasSamePracticeAnswerContent(cleanInput, formattedText)) {
    return fallbackResult("模型返回内容改变了用户输入，已改用本地格式整理。");
  }
  return {
    formattedText,
    notes: extractNotesText(parsed) || extractNotesText(content),
    model,
    provider: "deepseek"
  };
}

function practiceAnswerAlternativesPath() {
  return join(root, "data", "practice-answer-alternatives.json");
}

function normalizedPracticeLessonId(value) {
  const match = String(value || "").match(/\d+/);
  return match ? `lesson${Number(match[0])}` : String(value || "lesson").trim();
}

function normalizePracticeReviewText(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/\u3000/g, " ")
    .replace(/[A-Za-z]+/g, (textValue) => textValue.toUpperCase())
    .replace(/て\s*は\s*ありません/g, "ではありません")
    .replace(/て\s*は\s*ないです/g, "ではありません")
    .replace(/じゃありません/g, "ではありません")
    .replace(/じゃないです/g, "ではありません")
    .replace(/\s+/g, "")
    .replace(/\p{P}/gu, "")
    .replace(/^ー+/, "")
    .trim();
}

async function readPracticeAnswerAlternatives() {
  return await readJsonFile(practiceAnswerAlternativesPath(), {});
}

async function writePracticeAnswerAlternatives(cache) {
  await writeJsonFile(practiceAnswerAlternativesPath(), cache || {});
}

function practiceAnswerAlternativesForLesson(cache, lessonIdValue) {
  const lessonIdKey = normalizedPracticeLessonId(lessonIdValue);
  const lessonCache = cache?.[lessonIdKey] || {};
  return Object.fromEntries(
    Object.entries(lessonCache).map(([itemId, slots]) => [
      itemId,
      Object.fromEntries(
        Object.entries(slots || {}).map(([slotId, entries]) => [
          slotId,
          (Array.isArray(entries) ? entries : [])
            .map((entry) => typeof entry === "string" ? entry : entry?.answer)
            .filter(Boolean)
        ])
      )
    ])
  );
}

function cachedPracticeAnswerAlternative(cache, { lessonIdValue, itemId, slotId, userAnswer }) {
  const lessonIdKey = normalizedPracticeLessonId(lessonIdValue);
  const normalized = normalizePracticeReviewText(userAnswer);
  if (!normalized) return null;
  const entries = cache?.[lessonIdKey]?.[itemId]?.[slotId] || [];
  return entries.find((entry) => normalizePracticeReviewText(typeof entry === "string" ? entry : entry?.answer) === normalized) || null;
}

async function addPracticeAnswerAlternative(cache, payload, review) {
  const lessonIdKey = normalizedPracticeLessonId(payload.lessonId);
  const itemId = safeFileSegment(payload.itemId || "item");
  const slotId = safeFileSegment(payload.slotId || "answer");
  const answer = compactPracticeText(review.normalizedAnswer || payload.userAnswer, 1000);
  const normalizedAnswer = normalizePracticeReviewText(answer);
  if (!answer || !normalizedAnswer) return cache;

  const lessonCache = cache[lessonIdKey] || {};
  const itemCache = lessonCache[itemId] || {};
  const entries = Array.isArray(itemCache[slotId]) ? itemCache[slotId] : [];
  if (entries.some((entry) => normalizePracticeReviewText(typeof entry === "string" ? entry : entry?.answer) === normalizedAnswer)) return cache;

  return {
    ...cache,
    [lessonIdKey]: {
      ...lessonCache,
      [itemId]: {
        ...itemCache,
        [slotId]: [
          ...entries,
          {
            answer,
            normalizedAnswer,
            expectedAnswers: Array.isArray(payload.expectedAnswers) ? payload.expectedAnswers.slice(0, 8) : [],
            reason: compactPracticeText(review.reason || "", 500),
            provider: review.provider || "deepseek",
            model: review.model || "",
            modelNormalizedAnswer: compactPracticeText(review.modelNormalizedAnswer || "", 1000),
            addedAt: new Date().toISOString()
          }
        ]
      }
    }
  };
}

async function reviewPracticeAnswer(payload) {
  const userAnswer = compactPracticeText(payload.userAnswer, 1000);
  const expectedAnswers = Array.isArray(payload.expectedAnswers)
    ? payload.expectedAnswers.map((value) => compactPracticeText(value, 1000)).filter(Boolean)
    : [];
  if (!userAnswer || !expectedAnswers.length) {
    return { accepted: false, reason: "缺少用户答案或参考答案。", provider: "local_fallback" };
  }

  let cache = await readPracticeAnswerAlternatives();
  const cached = cachedPracticeAnswerAlternative(cache, {
    lessonIdValue: payload.lessonId,
    itemId: payload.itemId,
    slotId: payload.slotId || "answer",
    userAnswer
  });
  if (cached) {
    return {
      accepted: true,
      normalizedAnswer: typeof cached === "string" ? cached : cached.answer,
      reason: typeof cached === "string" ? "已命中已采纳备选答案。" : cached.reason || "已命中已采纳备选答案。",
      provider: "cache",
      cacheHit: true
    };
  }

  const key = process.env.DEEPSEEK_API_KEY;
  const baseUrl = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/+$/, "");
  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
  if (!key) return { accepted: false, reason: "未配置模型服务。", provider: "local_fallback" };

  const quota = await reserveAiQuota(payload.authHeader, "deepseek_review");
  let response;
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: [
            "你是标准日本语练习的答案复核器。",
            "任务：判断用户的日语答案是否可以作为该题的正确答案被采纳。",
            "可以采纳：意思与题目要求一致、语法功能一致，只是写法、汉字/假名、礼貌程度或自然表达不同。",
            "可以采纳：语音识别造成的明显句尾截断或轻微口误，只要结合参考答案能够唯一还原，且不改变句义、语法功能和回答范围。例如「働きませんでし」可视作「働きませんでした」。",
            "不能采纳：时态、肯否、主客体、助词、数量、专有名词、题目要求的语法变换或回答范围不一致。",
            "如果提供了开放题规则，参考答案仅为示例句型；应按规则判断，不得要求用户复述示例中的个人事实或完整句。",
            "如果提供了开放题规则，用户答案必须是语法完整的书面回答；不得因漏掉「です」等句尾成分而采纳不完整答案。",
            "不要把参考答案当作唯一表达，但必须严格遵守题目、例句和回答范围。",
            "normalizedAnswer 只能是用户答案的轻微清洗版本，不能替换成参考答案。",
            "只返回 JSON object：{\"accepted\":true|false,\"normalizedAnswer\":\"...\",\"reason\":\"...\"}。"
          ].join("\n")
        },
        {
          role: "user",
          content: [
            `课程：${compactPracticeText(payload.lessonId, 40)}`,
            `活动：${compactPracticeText(payload.activityTitle || payload.activityId, 120)}`,
            `活动说明：${compactPracticeText(payload.activityInstruction, 400)}`,
            `题号：${compactPracticeText(payload.itemNumber, 30)}`,
            `题目：${compactPracticeText(payload.promptText, 600)}`,
            `题目假名：${compactPracticeText(payload.promptKana, 600)}`,
            `回答单位：${compactPracticeText(payload.answerUnit, 80)}`,
            `回答范围：${compactPracticeText(payload.responseScope, 80)} ${compactPracticeText(payload.responseScopeHint, 200)}`,
            `开放题规则：${compactPracticeText(JSON.stringify(payload.openResponseRule || {}), 500)}`,
            `例句：${compactPracticeText(payload.examples, 1200)}`,
            "",
            "参考答案：",
            expectedAnswers.map((answer, index) => `${index + 1}. ${answer}`).join("\n"),
            "",
            "用户答案：",
            userAnswer
          ].join("\n")
        }
      ],
      temperature: 0,
      max_tokens: 260,
      thinking: { type: "disabled" },
      response_format: { type: "json_object" },
      stream: false
    })
    });
  } catch (error) {
    await completeAiQuota(payload.authHeader, quota.requestId, false);
    throw error;
  }
  const bodyText = await response.text();
  await completeAiQuota(payload.authHeader, quota.requestId, response.ok);
  if (!response.ok) {
    return { accepted: false, reason: `模型服务 HTTP ${response.status}。`, provider: "deepseek", model };
  }

  let raw;
  try {
    raw = JSON.parse(bodyText);
  } catch {
    return { accepted: false, reason: "模型服务返回非 JSON。", provider: "deepseek", model };
  }
  const content = raw.choices?.[0]?.message?.content || "";
  const parsed = extractJsonObject(content) || {};
  const accepted = parsed.accepted === true || String(parsed.accepted || "").toLowerCase() === "true";
  const result = {
    accepted,
    normalizedAnswer: accepted ? userAnswer : "",
    modelNormalizedAnswer: accepted ? compactPracticeText(parsed.normalizedAnswer || "", 1000) : "",
    reason: compactPracticeText(parsed.reason || "", 500),
    provider: "deepseek",
    model
  };

  if (accepted && payload.cacheAcceptedAnswer !== false) {
    cache = await addPracticeAnswerAlternative(cache, payload, result);
    await writePracticeAnswerAlternatives(cache);
  }

  return result;
}

function normalizeOcrSampleType(value) {
  const type = String(value || "").trim();
  if (!["vocabulary", "text"].includes(type)) throw new Error("Invalid OCR sample type.");
  return type;
}

async function listOcrSampleLessons(type) {
  const sampleType = normalizeOcrSampleType(type);
  const dir = join(root, "data", "ocr");
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const lessons = new Map();
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const match = entry.name.match(/^lesson(\d+)-(vocabulary|text)(-audio-verified)?\.json$/);
    if (!match || match[2] !== sampleType) continue;
    const lessonNo = Number(match[1]);
    const current = lessons.get(lessonNo) || { lessonNo };
    if (match[3] === "-audio-verified") current.verifiedAudioFile = entry.name;
    else current.baseFile = entry.name;
    lessons.set(lessonNo, current);
  }

  const result = [];
  for (const lesson of [...lessons.values()].sort((a, b) => a.lessonNo - b.lessonNo)) {
    const fileName = lesson.verifiedAudioFile || lesson.audioFile || lesson.baseFile;
    if (!fileName) continue;
    const filePath = join(dir, fileName);
    const data = await readJsonFile(filePath, null);
    if (!data) continue;
    result.push({
      lessonNo: lesson.lessonNo,
      lessonId: `lesson${lesson.lessonNo}`,
      label: `第${lesson.lessonNo}课`,
      type: sampleType,
      url: `/data/ocr/${fileName}`,
      path: `data/ocr/${fileName}`,
      hasAudio: Boolean(lesson.verifiedAudioFile),
      counts: ocrSampleCounts(sampleType, data)
    });
  }
  return result;
}

function ocrSampleCounts(type, data) {
  if (type === "vocabulary") {
    const words = data?.vocabulary || [];
    return {
      vocabulary: words.length,
      audioSegments: words.filter((word) => word.audioSegment).length
    };
  }
  const basicSentences = data?.basicText?.basicSentences || [];
  const basicDialogueLines = (data?.basicText?.dialogues || []).reduce((sum, dialogue) => sum + (dialogue.lines || []).length, 0);
  const applicationDialogueLines = (data?.applicationText?.blocks || []).reduce((sum, block) => sum + (block.lines || []).length, 0);
  const audioSegments = [
    ...basicSentences,
    ...(data?.basicText?.dialogues || []).flatMap((dialogue) => dialogue.lines || []),
    ...(data?.applicationText?.blocks || []).flatMap((block) => block.lines || [])
  ].filter((item) => item.audioSegment).length;
  return {
    basicSentences: basicSentences.length,
    basicDialogueLines,
    applicationDialogueLines,
    audioSegments
  };
}

async function runOcrAudioAlignment({ lessonId: requestedLessonId, target = "all" }) {
  const tasks = [];
  if (target === "all" || target === "vocabulary") {
    tasks.push(runNodeScript(join(root, "scripts", "align-ocr-vocabulary-audio.mjs"), ["--lesson", String(requestedLessonId), "--auto-approve"], "OCR vocabulary audio alignment", 300000));
  }
  if (target === "all" || target === "text") {
    tasks.push(runNodeScript(join(root, "scripts", "align-ocr-text-audio.mjs"), ["--lesson", String(requestedLessonId), "--auto-approve"], "OCR text audio alignment", 300000));
  }
  const outputs = await Promise.all(tasks);
  return { lessonId: `lesson${requestedLessonId}`, target, outputs };
}

function runNodeScript(scriptPath, scriptArgs, label, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...scriptArgs], { cwd: root, env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`${label} timed out.`));
    }, timeoutMs);
    child.stdout.on("data", (chunk) => { stdout += chunk.toString("utf8"); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString("utf8"); });
    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        const details = stderr || stdout || "";
        const message = details.match(/Error:\s*([^\r\n]+)/)?.[1] || details.trim() || `${label} exited with code ${code}.`;
        reject(new Error(message));
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject(new Error(`${label} returned invalid JSON: ${error.message}`));
      }
    });
  });
}

function ocrTextDataPaths(lessonId) {
  return [
    join(root, "data", "ocr", `lesson${lessonId}-text-audio-verified.json`)
  ];
}

function ocrVocabularyDataPaths(lessonId) {
  return [
    join(root, "data", "ocr", `lesson${lessonId}-vocabulary-audio-verified.json`)
  ];
}

function findOcrTextItem(data, itemId) {
  const basicText = data?.basicText || {};
  for (const item of basicText.basicSentences || []) {
    if (item?.id === itemId) return item;
  }
  for (const dialogue of basicText.dialogues || []) {
    for (const item of dialogue.lines || []) {
      if (item?.id === itemId) return item;
    }
  }
  for (const block of data?.applicationText?.blocks || []) {
    for (const item of block.lines || []) {
      if (item?.id === itemId) return item;
    }
  }
  return null;
}

function findOcrVocabularyItem(data, itemId) {
  return (data?.vocabulary || []).find((item) => item?.id === itemId) || null;
}

function updateOcrAudioAlignmentSegment(data, itemId, updatedSegment) {
  for (const track of data?.audioAlignment?.tracks || []) {
    const segment = (track.segments || []).find((item) => item?.id === itemId);
    if (!segment) continue;
    Object.assign(segment, updatedSegment);
  }
}

async function updateOcrTextAudioSegment({ lessonId, itemId, start, end }) {
  const normalizedStart = Math.round(Number(start) * 1000) / 1000;
  const normalizedEnd = Math.round(Number(end) * 1000) / 1000;
  if (!itemId) throw new Error("Missing text item id.");
  if (!Number.isFinite(normalizedStart) || !Number.isFinite(normalizedEnd) || normalizedStart < 0 || normalizedEnd <= normalizedStart) {
    throw new Error("Invalid audio segment range.");
  }

  const paths = ocrTextDataPaths(lessonId);
  const sourceData = await readJsonFile(paths[0], null);
  const sourceItem = findOcrTextItem(sourceData, itemId);
  const sourceSegment = sourceItem?.audioSegment;
  if (!sourceSegment?.sourceUrl) {
    throw new Error(`No editable audio segment exists for ${itemId}.`);
  }

  const updatedSegment = {
    ...sourceSegment,
    start: normalizedStart,
    end: normalizedEnd,
    duration: Math.round((normalizedEnd - normalizedStart) * 1000) / 1000,
    method: "manual-admin-adjustment",
    confidence: "approved",
    reviewedAt: new Date().toISOString(),
    review: {
      ...(sourceSegment.review || {}),
      status: "approved",
      reviewedAt: new Date().toISOString(),
      note: "Manually verified and adjusted in the text audio preview."
    }
  };

  const updatedFiles = [];
  for (const filePath of paths) {
    const data = await readJsonFile(filePath, null);
    if (!data) continue;
    const item = findOcrTextItem(data, itemId);
    if (!item) continue;
    item.audioSegment = { ...updatedSegment };
    updateOcrAudioAlignmentSegment(data, itemId, updatedSegment);
    data.updatedAt = new Date().toISOString();
    await writeJsonFile(filePath, data);
    updatedFiles.push(filePath.replace(`${root}/`, ""));
  }

  if (!updatedFiles.length) throw new Error(`No OCR text data file contains ${itemId}.`);
  return { lessonId, itemId, audioSegment: updatedSegment, updatedFiles };
}

async function updateOcrVocabularyAudioSegment({ lessonId, itemId, start, end }) {
  const normalizedStart = Math.round(Number(start) * 1000) / 1000;
  const normalizedEnd = Math.round(Number(end) * 1000) / 1000;
  if (!itemId) throw new Error("Missing vocabulary item id.");
  if (!Number.isFinite(normalizedStart) || !Number.isFinite(normalizedEnd) || normalizedStart < 0 || normalizedEnd <= normalizedStart) {
    throw new Error("Invalid audio segment range.");
  }

  const paths = ocrVocabularyDataPaths(lessonId);
  const sourceData = await readJsonFile(paths[0], null);
  const sourceItem = findOcrVocabularyItem(sourceData, itemId);
  const sourceSegment = sourceItem?.audioSegment;
  if (!sourceSegment?.sourceUrl) {
    throw new Error(`No editable audio segment exists for ${itemId}.`);
  }

  const updatedSegment = {
    ...sourceSegment,
    start: normalizedStart,
    end: normalizedEnd,
    duration: Math.round((normalizedEnd - normalizedStart) * 1000) / 1000,
    method: "manual-admin-adjustment",
    confidence: "approved",
    reviewedAt: new Date().toISOString()
  };

  const updatedFiles = [];
  for (const filePath of paths) {
    const data = await readJsonFile(filePath, null);
    if (!data) continue;
    const item = findOcrVocabularyItem(data, itemId);
    if (!item) continue;
    item.audioSegment = { ...updatedSegment };
    updateOcrAudioAlignmentSegment(data, itemId, updatedSegment);
    data.updatedAt = new Date().toISOString();
    await writeJsonFile(filePath, data);
    updatedFiles.push(filePath.replace(`${root}/`, ""));
  }

  if (!updatedFiles.length) throw new Error(`No OCR vocabulary data file contains ${itemId}.`);
  return { lessonId, itemId, audioSegment: updatedSegment, updatedFiles };
}

async function handleApi(req, res, url) {
  try {
    // ============ STUDENT RUNTIME APIs ============
    // 学员端运行时依赖的接口。Phase 3 起 lesson-catalog 改为静态 JSON。
    if (url.pathname === "/api/lesson-catalog") {
      sendJson(res, 200, { lessons: await initializedLessonCatalog() });
      return true;
    }

    // ============ LOCAL OCR TOOLING APIs ============
    // Used by tools/* import preview pages. This intentionally writes only under data/ocr.
    if (url.pathname === "/api/ocr/sample-lessons" && req.method === "GET") {
      sendJson(res, 200, { lessons: await listOcrSampleLessons(url.searchParams.get("type")) });
      return true;
    }
    if (url.pathname === "/api/ocr/audio-align" && req.method === "POST") {
      const body = await readJson(req);
      const requestedLessonId = safeLessonId(body.lessonId || 1);
      const target = String(body.target || "all");
      if (!["all", "vocabulary", "text"].includes(target)) throw new Error("Invalid OCR audio target.");
      const result = await runOcrAudioAlignment({
        lessonId: requestedLessonId,
        target,
        force: Boolean(body.force)
      });
      sendJson(res, 200, result);
      return true;
    }
    if (url.pathname === "/api/ocr/text-audio-segment" && req.method === "PUT") {
      const body = await readJson(req);
      const requestedLessonId = safeLessonId(body.lessonId || 1);
      const result = await updateOcrTextAudioSegment({
        lessonId: requestedLessonId,
        itemId: String(body.itemId || ""),
        start: body.start,
        end: body.end
      });
      sendJson(res, 200, result);
      return true;
    }
    if (url.pathname === "/api/ocr/vocabulary-audio-segment" && req.method === "PUT") {
      const body = await readJson(req);
      const requestedLessonId = safeLessonId(body.lessonId || 1);
      const result = await updateOcrVocabularyAudioSegment({
        lessonId: requestedLessonId,
        itemId: String(body.itemId || ""),
        start: body.start,
        end: body.end
      });
      sendJson(res, 200, result);
      return true;
    }

    // ============ ADMIN INITIALIZATION APIs ============
    // 课程初始化与音频生成相关接口，仅管理端使用。Phase 5 起从学员端剥离。
    if (url.pathname === "/api/init/status") {
      const requestedLessonId = safeLessonId(url.searchParams.get("lessonId"));
      const state = await readJsonFile(initStatePath(requestedLessonId), {});
      const voiceId = state.voiceId || url.searchParams.get("voiceId") || defaultVoiceId;
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
      const initState = await readJsonFile(initStatePath(requestedLessonId), {});
      const targetVoiceId = initState.voiceId || voiceId || defaultVoiceId;
      if (initState.voiceId !== targetVoiceId) {
        await writeJsonFile(initStatePath(requestedLessonId), { ...initState, voiceId: targetVoiceId, updatedAt: new Date().toISOString() });
      }
      const lessonData = await readJsonFile(initLessonPath(requestedLessonId), null);
      if (!lessonData) throw new Error("Please confirm parsed course data before generating audio.");
      const jobs = lessonDraftAudioJobs(lessonData);
      const missingJobs = jobs.filter((job) => !existsSync(audioPathForLesson(requestedLessonId, targetVoiceId, job.type, job.id)));
      const batchLimit = Math.max(0, Math.min(Number(limit) || 0, 20));
      const targets = scope === "one" && id
        ? jobs.filter((job) => `${job.type}:${job.id}` === id || job.id === id)
        : (batchLimit ? missingJobs.slice(0, batchLimit) : missingJobs);
      const items = [];
      for (const [index, job] of targets.entries()) {
        try {
          const quota = await reserveAiQuota(req.headers.authorization, "minimax_tts");
          try {
            items.push(await generateInitAudioJob(requestedLessonId, targetVoiceId, job));
            await completeAiQuota(req.headers.authorization, quota.requestId, true);
          } catch (error) {
            await completeAiQuota(req.headers.authorization, quota.requestId, false);
            throw error;
          }
        } catch (error) {
          if (error.status === 401 || error.status === 429) throw error;
          items.push({ ...job, exists: false, generated: false, error: String(error.message || error), url: audioUrlForLesson(requestedLessonId, targetVoiceId, job.type, job.id) });
        }
        if (index < targets.length - 1) await wait(generationDelayMs);
      }
      const status = initAudioStatus(lessonData, targetVoiceId);
      const generated = items.filter((item) => item.generated).length;
      const failed = items.filter((item) => item.error).length;
      sendJson(res, 200, {
        lessonId: requestedLessonId,
        voiceId: targetVoiceId,
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
      const initState = await readJsonFile(initStatePath(requestedLessonId), {});
      const targetVoiceId = initState.voiceId || voiceId || defaultVoiceId;
      const lessonData = await readJsonFile(initLessonPath(requestedLessonId), null);
      if (!lessonData) throw new Error("Please confirm parsed course data before confirming audio.");
      const audioItems = initAudioStatus(lessonData, targetVoiceId);
      const missing = audioItems.filter((item) => !item.exists);
      if (missing.length) throw new Error(`Audio is not complete. Missing ${missing.length} item(s).`);
      const state = {
        ...initState,
        parseConfirmed: true,
        audioConfirmed: true,
        completedAt: new Date().toISOString(),
        voiceId: targetVoiceId
      };
      await writeJsonFile(initLessonPath(requestedLessonId), { ...lessonData, audioVoiceId: targetVoiceId });
      await writeJsonFile(initStatePath(requestedLessonId), state);
      const catalog = await syncStudentCatalog();
      sendJson(res, 200, {
        lessonId: requestedLessonId,
        voiceId: targetVoiceId,
        state,
        audio: { items: audioItems, generated: audioItems.length, missing: 0, total: audioItems.length },
        catalog
      });
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
          const quota = await reserveAiQuota(req.headers.authorization, "minimax_tts");
          try {
            items.push(requestedLessonId === lessonId
              ? { id: job.id, type: job.type, ...(await generateAudio(voiceId, job.type, job.id, job.text)) }
              : await generateInitAudioJob(requestedLessonId, voiceId, job));
            await completeAiQuota(req.headers.authorization, quota.requestId, true);
          } catch (error) {
            await completeAiQuota(req.headers.authorization, quota.requestId, false);
            throw error;
          }
        } catch (error) {
          if (error.status === 401 || error.status === 429) throw error;
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
      const existing = audioStatus(voiceId, "sentence", "sample");
      let result;
      if (existing.exists) result = { ...existing, generated: false };
      else {
        const quota = await reserveAiQuota(req.headers.authorization, "minimax_tts");
        try { result = await generateAudio(voiceId, "sentence", "sample", sampleText); await completeAiQuota(req.headers.authorization, quota.requestId, true); }
        catch (error) { await completeAiQuota(req.headers.authorization, quota.requestId, false); throw error; }
      }
      sendJson(res, 200, { voiceId, text: sampleText, ...result });
      return true;
    }
    // ============ STUDENT RUNTIME APIs (continued) ============
    if (url.pathname === "/api/frontend-config" && req.method === "GET") {
      sendJson(res, 200, {
        ossEnabled: isOSSEnabled(),
        ossBaseUrl: isOSSEnabled() ? getOSSConfig().baseUrl : ""
      });
      return true;
    }
    if (url.pathname === "/api/pronunciation/evaluate" && req.method === "POST") {
      const { fields, files } = await readMultipart(req);
      const referenceText = fields.referenceText || "";
      if (!referenceText) throw new Error("Missing referenceText.");
      const audioFile = firstFile(files.audio);
      if (!audioFile?.buffer?.length) throw new Error("Missing audio file.");
      const debugAudio = await savePronunciationDebugAudio({ lessonId, wordId: fields.wordId || "unknown", audioBuffer: audioFile.buffer });
      const result = await evaluatePronunciation({ referenceText, audioBuffer: audioFile.buffer, authHeader: req.headers.authorization });
      sendJson(res, 200, { wordId: fields.wordId || "", referenceText, ...debugAudio, ...result });
      return true;
    }
    if (url.pathname === "/api/speech/transcribe" && req.method === "POST") {
      const { fields, files } = await readMultipart(req);
      const audioFile = firstFile(files.audio);
      if (!audioFile?.buffer?.length) throw new Error("Missing audio file.");
      const language = fields.language || "ja-JP";
      console.info("[speech/transcribe] upload", {
        filename: audioFile.filename || "",
        contentType: audioFile.contentType || "",
        bytes: audioFile.buffer.length,
        language,
        declaredSampleRate: fields.sampleRate || ""
      });
      const quota = await reserveAiQuota(req.headers.authorization, "azure_transcribe");
      let result;
      try { result = await transcribeSpeech({ audioBuffer: audioFile.buffer, language }); await completeAiQuota(req.headers.authorization, quota.requestId, true); }
      catch (error) { await completeAiQuota(req.headers.authorization, quota.requestId, false); throw error; }
      sendJson(res, 200, { recognizedText: result.recognizedText, recognitionStatus: result.raw?.RecognitionStatus || "" });
      return true;
    }
    if (url.pathname === "/api/practice/format-answer" && req.method === "POST") {
      const body = await readJson(req);
      const result = await formatPracticeAnswer({ ...body, authHeader: req.headers.authorization });
      sendJson(res, 200, result);
      return true;
    }
    if (url.pathname === "/api/grammar/notebook-ai" && req.method === "POST") {
      const body = await readJson(req);
      const result = await askNotebookAi({ ...body, authHeader: req.headers.authorization });
      sendJson(res, 200, result);
      return true;
    }
    if (url.pathname === "/api/practice/answer-alternatives" && req.method === "GET") {
      const lessonIdValue = url.searchParams.get("lessonId") || "";
      const cache = await readPracticeAnswerAlternatives();
      sendJson(res, 200, { alternatives: practiceAnswerAlternativesForLesson(cache, lessonIdValue) });
      return true;
    }
    if (url.pathname === "/api/practice/review-answer" && req.method === "POST") {
      const body = await readJson(req);
      const result = await reviewPracticeAnswer({ ...body, authHeader: req.headers.authorization });
      sendJson(res, 200, result);
      return true;
    }
  } catch (error) {
    sendJson(res, Number(error.status || 500), error.payload || { error: String(error.message || error) });
    return true;
  }
  return false;
}

function proxyToJavaApi(clientReq, clientRes, url) {
  const proxyPath = url.pathname + (url.search || "");
  const proxyReq = httpRequest(
    {
      hostname: "127.0.0.1",
      port: japaflowApiPort,
      path: proxyPath,
      method: clientReq.method,
      headers: { ...clientReq.headers, host: `127.0.0.1:${japaflowApiPort}` }
    },
    (proxyRes) => {
      clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(clientRes);
    }
  );
  proxyReq.on("error", (err) => {
    console.warn(`[Proxy] ${clientReq.method} ${proxyPath} → Java API error:`, err.message);
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    }
    clientRes.end(JSON.stringify({ code: 502, message: "Java API 不可用，请确认后端已启动在端口 " + japaflowApiPort }));
  });
  clientReq.pipe(proxyReq);
}

createServer(async (req, res) => {
  setCorsHeaders(req, res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/japaflow/")) {
    proxyToJavaApi(req, res, url);
    return;
  }
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
    const requestedType = types[extname(filePath)];
    if (requestedType || url.pathname.startsWith("/debug-recordings/") || url.pathname.startsWith("/audio/")) {
      sendJson(res, 404, { error: `Static asset not found: ${url.pathname}` });
      return;
    }
    const body = await readFile(join(root, "index.html"));
    res.writeHead(200, headers(types[".html"]));
    res.end(body);
  }
}).listen(port, () => {
  console.log(`JapaFlow running at http://localhost:${port}`);
});
