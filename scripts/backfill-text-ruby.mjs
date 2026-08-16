import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));
const lessons = lessonNumbers(args);
const dryRun = args.dryRun === true || args["dry-run"] === true;

if (!lessons.length) throw new Error("Usage: node scripts/backfill-text-ruby.mjs --lessons 3,4,5,6,26");

for (const lessonNo of lessons) {
  const sourcePath = join(root, "data", "ocr", `lesson${lessonNo}-text.json`);
  const sourceData = readJson(sourcePath);
  const targets = japaneseItems(sourceData).filter(needsAnnotation);
  if (!targets.length) {
    console.log(`lesson${lessonNo}: no kana/ruby gaps`);
    continue;
  }
  if (dryRun) {
    console.log(`lesson${lessonNo}: ${targets.length} kana/ruby item(s) would be filled`);
    continue;
  }
  const patches = await requestPatches(lessonNo, sourcePath, targets);
  applyPatches(sourceData, targets, patches);
  writeFileSync(sourcePath, `${JSON.stringify(sourceData, null, 2)}\n`);
  console.log(`lesson${lessonNo}: filled ${patches.length} kana/ruby item(s)`);
}

function lessonNumbers(options) {
  const explicit = String(options.lessons || "").split(",").map((value) => value.trim()).filter(Boolean).map(Number).filter((lesson) => Number.isInteger(lesson) && lesson > 0);
  if (explicit.length) return [...new Set(explicit)];
  if (options.lesson) return [positiveInteger(options.lesson, "lesson")];
  if (options.from || options.to) {
    const from = positiveInteger(options.from || options.to, "from");
    const to = positiveInteger(options.to || options.from, "to");
    if (to < from) throw new Error("--to must be greater than or equal to --from.");
    return Array.from({ length: to - from + 1 }, (_, index) => from + index);
  }
  return [];
}

function japaneseItems(data) {
  return [
    ...(data.basicText?.basicSentences || []),
    ...(data.basicText?.dialogues || []).flatMap((dialogue) => dialogue.lines || []),
    ...(data.applicationText?.blocks || []).flatMap((block) => block.type === "dialogue" ? block.lines || [] : [block])
  ].filter((item) => /[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(String(item.text || "")));
}

function needsAnnotation(item) {
  if (!String(item.kana || "").trim()) return true;
  if (!Array.isArray(item.segments) || item.segments.map((segment) => segment?.text || "").join("") !== item.text) return true;
  return item.segments.some((segment) => /\p{Script=Han}/u.test(String(segment?.text || "")) && !String(segment?.ruby || "").trim());
}

async function requestPatches(lessonNo, sourcePath, targets) {
  const dir = await mkdtemp(join(tmpdir(), `japaflow-ruby-l${lessonNo}-`));
  const taskPath = join(dir, "task.md");
  const patchPath = join(dir, "patches.json");
  const payload = targets.map((item) => ({ id: item.id, text: item.text, kana: item.kana || "" }));
  const prompt = `You are filling missing Japanese reading annotations for JapaFlow lesson ${lessonNo}.\n\nThe original data file is ${sourcePath}. Do not modify it. Do not inspect images. Work only from the JSON items below.\n\nWrite exactly one JSON file to ${patchPath}, using this schema:\n{ "patches": [{ "id": "...", "kana": "full-sentence reading", "segments": [{ "text": "exact source substring", "ruby": "reading only when text contains kanji" }] }] }\n\nRequirements:\n- Return one patch for every input id and no other ids.\n- Preserve text exactly: concatenating segments[].text must equal the supplied text character-for-character.\n- kana must be non-empty and cover the full sentence reading.\n- Every segment containing kanji must have a non-empty ruby. Split segments as needed.\n- Kana-only, katakana-only, numbers, punctuation, and spaces may be segments without ruby.\n- Use normal Japanese readings based on the supplied text and kana. Do not change text, translations, IDs, or order.\n- Output valid JSON only to the requested file.\n\nItems:\n${JSON.stringify(payload, null, 2)}\n`;
  await writeFile(taskPath, prompt, "utf8");
  await runCodex(taskPath);
  if (!existsSync(patchPath)) throw new Error(`lesson${lessonNo}: model did not write a patch file.`);
  const patchData = JSON.parse(await readFile(patchPath, "utf8"));
  return validatePatches(targets, patchData?.patches);
}

function runCodex(taskPath) {
  return new Promise((resolve, reject) => {
    const child = spawn("codex", ["exec", "-C", root, "-s", "workspace-write", "-"], { cwd: root, stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(stderr || stdout || `codex exited with code ${code}`)));
    child.stdin.end(`Read ${taskPath} and write the requested patch JSON file.`);
  });
}

function validatePatches(targets, patches) {
  if (!Array.isArray(patches)) throw new Error("Patch file must contain a patches array.");
  const targetById = new Map(targets.map((item) => [item.id, item]));
  if (patches.length !== targets.length) throw new Error(`Expected ${targets.length} patches, received ${patches.length}.`);
  const seen = new Set();
  for (const patch of patches) {
    const item = targetById.get(patch?.id);
    if (!item || seen.has(patch.id)) throw new Error(`Unexpected or duplicate patch id: ${patch?.id || "missing"}.`);
    seen.add(patch.id);
    if (!String(patch.kana || "").trim()) throw new Error(`${patch.id}: missing kana.`);
    if (!Array.isArray(patch.segments) || !patch.segments.length) throw new Error(`${patch.id}: missing segments.`);
    if (patch.segments.map((segment) => segment?.text || "").join("") !== item.text) throw new Error(`${patch.id}: segments do not reconstruct text.`);
    for (const segment of patch.segments) {
      if (/\p{Script=Han}/u.test(String(segment?.text || "")) && !String(segment?.ruby || "").trim()) throw new Error(`${patch.id}: kanji segment missing ruby.`);
    }
  }
  return patches;
}

function applyPatches(data, targets, patches) {
  const patchesById = new Map(patches.map((patch) => [patch.id, patch]));
  for (const item of targets) {
    const patch = patchesById.get(item.id);
    item.kana = patch.kana;
    item.segments = patch.segments;
  }
}

function readJson(filePath) {
  if (!existsSync(filePath)) throw new Error(`Missing text OCR file: ${filePath}`);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (!argv[index].startsWith("--")) continue;
    const key = argv[index].slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) result[key] = true;
    else { result[key] = next; index += 1; }
  }
  return result;
}

function positiveInteger(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) throw new Error(`Invalid ${label}: ${value}`);
  return number;
}
