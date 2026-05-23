import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, normalize } from "node:path";
import vm from "node:vm";

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

const initBuckets = ["text", "grammar", "vocabulary", "word", "exercises"];
const inferredLessonImageIndexes = {
  text: [0, 4, 5],
  grammar: [1, 2],
  vocabulary: [3, 4],
  word: [9],
  exercises: [6, 7, 8]
};
const lessonCatalogMetadata = {
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

async function initializedLessonCatalog() {
  const records = await Promise.all(lessonCatalog.map(async (item) => ({
    item,
    lessonData: item.runtimeReady ? null : await readJsonFile(initLessonPath(item.id), null),
    initState: item.runtimeReady ? {} : await readJsonFile(initStatePath(item.id), {})
  })));
  const signatureOwners = new Map();
  records.forEach(({ item, lessonData, initState }) => {
    if (item.runtimeReady || !lessonData || !initState.parseConfirmed || !initState.audioConfirmed) return;
    const signature = lessonContentSignature(lessonData);
    if (!signatureOwners.has(signature)) signatureOwners.set(signature, []);
    signatureOwners.get(signature).push(item.id);
  });

  return records.map(({ item, lessonData, initState }) => {
    if (item.runtimeReady) return item;
    const initialized = Boolean(lessonData && initState.parseConfirmed && initState.audioConfirmed);
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
  return `/audio/lesson${lessonIdValue}/voices/${voiceId}/${type}s/${id}.mp3`;
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
    // ============ STUDENT RUNTIME APIs ============
    // 学员端运行时依赖的接口。Phase 3 起 lesson-catalog 改为静态 JSON。
    if (url.pathname === "/api/lesson-catalog") {
      sendJson(res, 200, { lessons: await initializedLessonCatalog() });
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
          items.push(await generateInitAudioJob(requestedLessonId, targetVoiceId, job));
        } catch (error) {
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
    // ============ STUDENT RUNTIME APIs (continued) ============
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
