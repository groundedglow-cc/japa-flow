// Export /api/lesson-catalog as a static JSON file so the student runtime
// can work without the Node backend (web local-dev still uses the API; the
// packaged App reads the static file).
//
// Run: node scripts/export-catalog.mjs

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

// Keep this list in sync with server.mjs `lessonCatalog`.
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

async function readJsonFile(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function initLessonPath(id) {
  return join(root, "data", "lessons", `lesson${id}.json`);
}
function initStatePath(id) {
  return join(root, "data", "lesson-init", `lesson${id}-state.json`);
}

function lessonSubtitleForCatalog(lessonData, fallback) {
  const subtitle = String(lessonData?.subtitle || "").trim();
  if (subtitle && subtitle !== "待确认" && subtitle !== "待初始化") return subtitle;
  return lessonData?.sentences?.[0]?.text || fallback;
}

function wordAudioText(word) {
  return word?.kana || word?.jp || "";
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

function isIncorrectLessonExample(value) {
  const text = typeof value === "string" ? value : value?.text || value?.jp || "";
  return Boolean(value?.isIncorrect || value?.incorrect || value?.correct === false || /^[×xX✕]/.test(String(text || "").trim()));
}

function lessonDraftAudioJobs(lesson) {
  const jobs = [];
  const seen = new Set();
  (lesson.vocabulary || []).forEach((word) => {
    addUniqueJob(jobs, seen, { id: word.id, type: "word", text: wordAudioText(word) });
  });
  (lesson.sentences || []).forEach((sentence) => {
    addUniqueJob(jobs, seen, { id: sentence.id, type: "sentence", text: sentence.text });
  });
  (lesson.grammar || []).forEach((grammar) => {
    (grammar.extraExamples || []).forEach((example, index) => {
      if (isIncorrectLessonExample(example)) return;
      addUniqueJob(jobs, seen, {
        id: `${grammar.id}-extra-${index + 1}`,
        type: "sentence",
        text: lessonTextValue(example)
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
        text
      });
    });
  });
  return jobs;
}

function audioPathForLesson(lessonId, voiceId, type, id) {
  return join(root, "audio", `lesson${lessonId}`, "voices", voiceId, `${type}s`, `${id}.mp3`);
}

function lessonInitComplete(lessonData, initState, lessonId) {
  if (!lessonData) return false;
  if (initState.parseConfirmed && initState.audioConfirmed) return true;
  const voiceId = initState.voiceId || "Japanese_IntellectualSenior";
  const jobs = lessonDraftAudioJobs(lessonData);
  return Boolean(jobs.length) && jobs.every((job) => existsSync(audioPathForLesson(lessonId, voiceId, job.type, job.id)));
}

async function buildCatalog() {
  return Promise.all(lessonCatalog.map(async (item) => {
    if (item.runtimeReady) return item;
    const lessonData = await readJsonFile(initLessonPath(item.id), null);
    const initState = await readJsonFile(initStatePath(item.id), {});
    const initialized = lessonInitComplete(lessonData, initState, item.id);
    if (!initialized) return item;
    return {
      ...item,
      subtitle: lessonSubtitleForCatalog(lessonData, item.subtitle),
      status: "initialized",
      statusLabel: "已初始化",
      description: `课程数据和音频已完成：${lessonData.vocabulary?.length || 0} 个单词，${lessonData.grammar?.length || 0} 个语法，${lessonData.sentences?.length || 0} 句课文，${lessonData.exercises?.length || 0} 道练习。`,
      runtimeReady: false,
      voiceId: initState.voiceId || "Japanese_IntellectualSenior",
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

async function main() {
  const lessons = await buildCatalog();
  const out = join(root, "data", "catalog.json");
  await writeFile(out, JSON.stringify({ lessons, generatedAt: new Date().toISOString() }, null, 2));
  console.log(`Wrote ${out} (${lessons.length} lessons)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
