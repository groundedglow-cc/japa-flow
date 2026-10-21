import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { copyFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const options = parseArgs(process.argv.slice(2));
const lessons = lessonNumbers(options);
const force = options.force === true;
if (!lessons.length) throw new Error("Usage: node scripts/initialize-vocabulary-context.mjs --lesson 25, or --from 25 --to 28");

for (const lessonNo of lessons) {
  const practiceOutput = join(root, "data", "ocr", `lesson${lessonNo}-vocabulary-occurrences.json`);
  const nativeOutput = join(root, "data", "ocr", `lesson${lessonNo}-grammar-vocabulary-native-ocr-occurrences.json`);
  const canonicalOutput = join(root, "data", "ocr", `lesson${lessonNo}-grammar-vocabulary-occurrences.json`);
  const needsPractice = force || !hasPracticeIndex(practiceOutput);
  const needsGrammar = force || !hasApprovedGrammarIndex(canonicalOutput);

  if (!needsPractice && !needsGrammar) {
    console.log(`lesson${lessonNo}: practice and grammar vocabulary context already initialized; skipped`);
    continue;
  }

  if (needsPractice) {
    await run(process.execPath, ["scripts/generate-lesson-vocabulary-occurrences.mjs", "--lesson", String(lessonNo)]);
    console.log(`lesson${lessonNo}: practice vocabulary context initialized`);
  }

  if (!needsGrammar) continue;
  const grammarImageDir = join(root, "course-assets", "by-lesson", `lesson${lessonNo}`);
  if (!existsSync(grammarImageDir)) throw new Error(`lesson${lessonNo}: grammar page images are missing.`);

  // Native OCR is the established source for lessons with native scan files.
  // It reuses the scan when present and only performs OCR for a new lesson.
  await run(process.execPath, ["scripts/generate-grammar-vocabulary-native-ocr.mjs", "--lesson", String(lessonNo), "--approve"]);
  await copyFile(nativeOutput, canonicalOutput);
  console.log(`lesson${lessonNo}: grammar vocabulary context initialized`);
}

await run(process.execPath, ["scripts/report-vocabulary-initialization.mjs"]);

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`${command} ${args.join(" ")} exited with ${code}`)));
  });
}

function parseArgs(argv) {
  const output = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (!argv[index].startsWith("--")) continue;
    const [key, inline] = argv[index].slice(2).split("=", 2);
    if (inline !== undefined) output[key] = inline;
    else if (argv[index + 1] && !argv[index + 1].startsWith("--")) output[key] = argv[++index];
    else output[key] = true;
  }
  return output;
}

function lessonNumbers(options) {
  if (options.lesson) return String(options.lesson).split(",").map((value) => positiveInteger(value.trim(), "lesson"));
  if (!options.from && !options.to) return [];
  const from = positiveInteger(options.from || options.to, "from");
  const to = positiveInteger(options.to || options.from, "to");
  if (to < from) throw new Error("--to must be greater than or equal to --from.");
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

function positiveInteger(value, name) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > 48) throw new Error(`Invalid --${name}: ${value}`);
  return number;
}

function hasPracticeIndex(filePath) {
  const data = readJsonIfExists(filePath);
  return Boolean(data?.lessonId && data?.practice && typeof data.practice === "object");
}

function hasApprovedGrammarIndex(filePath) {
  const data = readJsonIfExists(filePath);
  return data?.reviewStatus === "approved" && data?.pages && typeof data.pages === "object";
}

function readJsonIfExists(filePath) {
  if (!existsSync(filePath)) return null;
  try { return JSON.parse(readFileSync(filePath, "utf8")); }
  catch { return null; }
}
