import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createVocabularyMatchers, vocabularyIndexes } from "./lib/vocabulary-occurrence-matching.mjs";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));
const firstPages = [22, 32, 42, 52, 68, 78, 88, 98, 114, 124, 134, 144, 160, 170, 180, 190, 206, 216, 226, 236, 252, 262, 272, 282, 4, 14, 24, 34, 50, 60, 70, 80, 96, 106, 116, 126, 142, 152, 162, 172, 188, 198, 208, 218, 234, 244, 254, 264];
const lessons = lessonNumbers(args);
const force = args.force === true;
const approve = args.approve === true;
const scanOnly = args["scan-only"] === true;
const concurrency = Math.max(1, Number(args.concurrency || 1));

if (!lessons.length) throw new Error("Usage: node scripts/generate-grammar-vocabulary-occurrences.mjs --lesson 36 [--approve] [--force], or --from 1 --to 48");

const jobs = lessons.map((lessonNo) => () => processLesson(lessonNo));
await runQueue(jobs, concurrency);

async function processLesson(lessonNo) {
  const scanPath = pathFor(lessonNo, "grammar-vocabulary-scan.json");
  const occurrencePath = pathFor(lessonNo, "grammar-vocabulary-occurrences.json");
  let scan;
  if (!force && existsSync(scanPath)) {
    scan = readJson(scanPath);
    console.log(`lesson${lessonNo}: reuse scan`);
  } else {
    const pages = grammarPages(lessonNo);
    if (!pages.length) throw new Error(`lesson${lessonNo}: grammar page images are missing.`);
    scan = await scanWithCodex(lessonNo, pages, scanPath);
    validateScan(scan, lessonNo, pages);
  }
  if (scanOnly) return;
  const vocabulary = readVocabulary(lessonNo);
  const occurrences = buildOccurrences(scan, vocabulary, approve ? "approved" : "pending");
  await writeJson(occurrencePath, occurrences);
  console.log(`lesson${lessonNo}: ${occurrences.reviewStatus}, ${Object.values(occurrences.pages).reduce((total, page) => total + page.wordIds.length, 0)} page-word matches`);
}

function grammarPages(lessonNo) {
  const firstPage = firstPages[lessonNo - 1];
  if (!firstPage) return [];
  return Array.from({ length: 4 }, (_, offset) => firstPage + offset + 1)
    .map((pageNo) => ({ pageNo, path: join(root, "course-assets", "by-lesson", `lesson${lessonNo}`, `page${pageNo}.webp`) }))
    .filter((page) => existsSync(page.path));
}

async function scanWithCodex(lessonNo, pages, scanPath) {
  await mkdir(join(root, "data", "ocr"), { recursive: true });
  const taskDir = join(root, "data", "ocr-tasks");
  await mkdir(taskDir, { recursive: true });
  const taskPath = join(taskDir, `lesson${lessonNo}-grammar-vocabulary-task.md`);
  const prompt = `Read the ${pages.length} attached Japanese textbook grammar-page images for JapaFlow lesson ${lessonNo}. Write exactly one JSON file to ${scanPath}.\n\nSchema:\n{ "schemaVersion": 1, "lessonId": "lesson${lessonNo}", "reviewStatus": "pending", "pages": { "PAGE_NO": { "sourceText": ["Japanese learning text"], "warnings": [] } } }\n\nRules:\n- Include every visible Japanese grammar heading, pattern, example sentence, dialogue line, and Japanese vocabulary/example label that a learner may study.\n- Exclude Chinese explanatory prose, page headers/footers, page numbers, and decorative text.\n- Keep page keys for every supplied image, even when no Japanese text is found.\n- Preserve Japanese text exactly enough for vocabulary matching; split sourceText into short logical lines.\n- Do not create wordIds and do not read any vocabulary JSON. Matching is performed later by a deterministic program.\n- Do not modify any file except the requested JSON. Output valid JSON only.`;
  await writeFile(taskPath, prompt, "utf8");
  await new Promise((resolve, reject) => {
    const child = spawn("codex", ["exec", "-C", root, "-s", "workspace-write", ...pages.flatMap((page) => ["--image", page.path]), "-"], { cwd: root, stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(stderr || stdout || `codex exited with ${code}`)));
    child.stdin.end(`Read ${taskPath} and write the requested JSON file.`);
  });
  if (!existsSync(scanPath)) throw new Error(`lesson${lessonNo}: OCR model did not write ${scanPath}.`);
  return readJson(scanPath);
}

function buildOccurrences(scan, vocabulary, reviewStatus) {
  const matchers = createVocabularyMatchers(vocabulary);
  const pages = {};
  for (const [pageNo, page] of Object.entries(scan.pages || {})) {
    pages[pageNo] = {
      sourceText: Array.isArray(page.sourceText) ? page.sourceText : [],
      wordIds: vocabularyIndexes(page.sourceText || [], matchers),
      warnings: Array.isArray(page.warnings) ? page.warnings : []
    };
  }
  return { schemaVersion: 1, lessonId: scan.lessonId, vocabularyIndexBase: 1, reviewStatus, generatedAt: new Date().toISOString(), scanSource: "codex-vision-ocr", pages };
}

function validateScan(scan, lessonNo, pages) {
  if (scan?.lessonId !== `lesson${lessonNo}` || !scan?.pages || typeof scan.pages !== "object") throw new Error(`lesson${lessonNo}: invalid OCR scan schema.`);
  for (const page of pages) {
    const value = scan.pages[String(page.pageNo)];
    if (!value || !Array.isArray(value.sourceText) || value.sourceText.some((text) => typeof text !== "string")) throw new Error(`lesson${lessonNo}: page ${page.pageNo} has invalid sourceText.`);
  }
}

function readVocabulary(lessonNo) {
  const verified = pathFor(lessonNo, "vocabulary-audio-verified.json");
  const fallback = pathFor(lessonNo, "vocabulary.json");
  const data = readJson(existsSync(verified) ? verified : fallback);
  if (!Array.isArray(data.vocabulary)) throw new Error(`lesson${lessonNo}: vocabulary list is unavailable.`);
  return data.vocabulary;
}

function parseArgs(argv) { const output = {}; for (let i = 0; i < argv.length; i += 1) { if (!argv[i].startsWith("--")) continue; const [key, inline] = argv[i].slice(2).split("=", 2); if (inline !== undefined) output[key] = inline; else if (argv[i + 1] && !argv[i + 1].startsWith("--")) output[key] = argv[++i]; else output[key] = true; } return output; }
function lessonNumbers(options) { if (options.lesson) return [positiveInteger(options.lesson, "lesson")]; if (!options.from && !options.to) return []; const from = positiveInteger(options.from || options.to, "from"); const to = positiveInteger(options.to || options.from, "to"); if (to < from) throw new Error("--to must be greater than or equal to --from."); return Array.from({ length: to - from + 1 }, (_, index) => from + index); }
function positiveInteger(value, name) { const number = Number(value); if (!Number.isInteger(number) || number < 1 || number > 48) throw new Error(`Invalid --${name}: ${value}`); return number; }
function pathFor(lessonNo, suffix) { return join(root, "data", "ocr", `lesson${lessonNo}-${suffix}`); }
function readJson(filePath) { return JSON.parse(readFileSync(filePath, "utf8")); }
function writeJson(filePath, value) { return writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`); }
async function runQueue(jobs, limit) { let cursor = 0; const failures = []; await Promise.all(Array.from({ length: limit }, async () => { while (cursor < jobs.length) { const job = jobs[cursor++]; try { await job(); } catch (error) { failures.push(error); console.error(error.message); } } })); if (failures.length) process.exitCode = 1; }
