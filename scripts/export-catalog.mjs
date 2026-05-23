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
  },
  {
    id: 30,
    title: "第30课",
    subtitle: "待初始化",
    status: "pending",
    description: "课程内容尚未采集，后续可继续按同一结构初始化。",
    runtimeReady: false
  }
];

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

async function buildCatalog() {
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
