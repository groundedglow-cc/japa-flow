import { existsSync, readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const ocrDir = join(root, "data", "ocr");
const outputPath = join(ocrDir, "vocabulary-initialization-status.json");
const lessons = Array.from({ length: 48 }, (_, index) => index + 1).map(inspectLesson);
const initialized = lessons.filter((lesson) => lesson.status === "initialized").map((lesson) => lesson.lessonNo);
const partial = lessons.filter((lesson) => lesson.status === "partial").map((lesson) => lesson.lessonNo);
const unavailable = lessons.filter((lesson) => lesson.status === "unavailable").map((lesson) => lesson.lessonNo);

const report = {
  schemaVersion: 1,
  purpose: "Tracks vocabulary context shown on lesson practice and grammar pages.",
  criteria: {
    initialized: "Verified vocabulary, practice data, practice occurrence index, and an approved grammar occurrence index are all present.",
    partial: "At least one prerequisite exists, but the lesson cannot yet show vocabulary context on both pages.",
    unavailable: "No vocabulary-context prerequisites were found."
  },
  refreshCommand: "npm run report:vocabulary-initialization",
  initializeCommand: "node scripts/initialize-vocabulary-context.mjs --lesson <number>",
  generatedAt: new Date().toISOString(),
  summary: { initialized, partial, unavailable },
  lessons
};

await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`✓ ${relative(outputPath)}`);
console.log(`initialized: ${formatRanges(initialized) || "none"}`);
console.log(`partial: ${formatRanges(partial) || "none"}`);
console.log(`unavailable: ${formatRanges(unavailable) || "none"}`);

function inspectLesson(lessonNo) {
  const vocabulary = join(ocrDir, `lesson${lessonNo}-vocabulary-audio-verified.json`);
  const practiceData = join(root, "practice", `lesson${lessonNo}-practice-data.ts`);
  const practiceOccurrences = join(ocrDir, `lesson${lessonNo}-vocabulary-occurrences.json`);
  const grammarOccurrences = join(ocrDir, `lesson${lessonNo}-grammar-vocabulary-occurrences.json`);
  const grammar = readJsonIfExists(grammarOccurrences);
  const assets = {
    vocabulary: existsSync(vocabulary),
    practiceData: existsSync(practiceData),
    practiceOccurrences: existsSync(practiceOccurrences),
    grammarOccurrences: existsSync(grammarOccurrences),
    grammarReviewStatus: grammar?.reviewStatus || null
  };
  const isInitialized = assets.vocabulary && assets.practiceData && assets.practiceOccurrences && assets.grammarReviewStatus === "approved";
  const hasAnyAsset = Object.values(assets).some(Boolean);
  return {
    lessonNo,
    status: isInitialized ? "initialized" : hasAnyAsset ? "partial" : "unavailable",
    assets,
    nextStep: isInitialized
      ? "Ready for practice and grammar vocabulary context."
      : hasAnyAsset
        ? "Run the vocabulary-context initializer after the missing source data is available."
        : "Prepare verified vocabulary, practice data, and grammar page images before initialization."
  };
}

function readJsonIfExists(filePath) {
  if (!existsSync(filePath)) return null;
  try { return JSON.parse(readFileSync(filePath, "utf8")); }
  catch { return null; }
}

function relative(filePath) {
  return filePath.startsWith(`${root}/`) ? filePath.slice(root.length + 1) : filePath;
}

function formatRanges(numbers) {
  return numbers.reduce((ranges, number) => {
    const last = ranges.at(-1);
    if (last && number === last.to + 1) last.to = number;
    else ranges.push({ from: number, to: number });
    return ranges;
  }, []).map(({ from, to }) => from === to ? String(from) : `${from}-${to}`).join(", ");
}
