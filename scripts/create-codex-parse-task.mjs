// Create a Codex parse task from the shared lesson-init template.
//
// Usage:
//   node scripts/create-codex-parse-task.mjs --lesson 28
//   node scripts/create-codex-parse-task.mjs

import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";

const root = process.cwd();
const initBuckets = ["text", "grammar", "vocabulary", "word", "exercises"];
const inferredLessonImageIndexes = {
  text: [0, 4, 5],
  grammar: [1, 2],
  vocabulary: [3, 4],
  word: [9],
  exercises: [6, 7, 8]
};
const args = parseArgs(process.argv.slice(2));

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const [key, inlineValue] = item.slice(2).split("=", 2);
    if (inlineValue !== undefined) {
      result[key] = inlineValue;
      continue;
    }
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      result[key] = next;
      index += 1;
    } else {
      result[key] = "true";
    }
  }
  return result;
}

function safeLessonId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0 || id > 999) throw new Error("Invalid lesson id.");
  return id;
}

function isInitImageFile(name) {
  return [".png", ".jpg", ".jpeg", ".webp"].includes(extname(name).toLowerCase());
}

function initStatePath(lessonId) {
  return join(root, "data", "lesson-init", `lesson${lessonId}-state.json`);
}

function initDraftPath(lessonId) {
  return join(root, "data", "lesson-drafts", `lesson${lessonId}.json`);
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
  return join(root, "course-assets", `lesson${lessonId}`, bucket);
}

function byLessonDir(lessonId) {
  return join(root, "course-assets", "by-lesson", `lesson${lessonId}`);
}

function naturalFileCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

async function readJsonFile(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJsonFile(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function promptLessonId() {
  if (args.lesson) return safeLessonId(args.lesson);
  const rl = createInterface({ input, output });
  try {
    const answer = await rl.question("要生成第多少课的数据？");
    return safeLessonId(answer.trim());
  } finally {
    rl.close();
  }
}

async function initImageManifest(lessonId) {
  const result = {};
  const inferredImages = await byLessonImages(lessonId);
  for (const bucket of initBuckets) {
    if (inferredImages.length >= 10) {
      result[bucket] = (inferredLessonImageIndexes[bucket] || [])
        .map((index) => inferredImages[index])
        .filter(Boolean);
      continue;
    }
    const dir = imageBucketDir(lessonId, bucket);
    let entries = [];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      entries = [];
    }
    result[bucket] = entries
      .filter((entry) => entry.isFile() && isInitImageFile(entry.name))
      .map((entry) => join(dir, entry.name))
      .sort((a, b) => naturalFileCompare(a, b));
  }
  return result;
}

async function byLessonImages(lessonId) {
  let entries = [];
  try {
    entries = await readdir(byLessonDir(lessonId), { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((entry) => entry.isFile() && isInitImageFile(entry.name))
    .map((entry) => join(byLessonDir(lessonId), entry.name))
    .sort((a, b) => naturalFileCompare(a, b));
}

function uniqueInitImagePaths(manifest) {
  return [...new Set(initBuckets.flatMap((bucket) => manifest[bucket] || []))];
}

function codexBucketList(lessonId, manifest) {
  return initBuckets.map((bucket) => {
    const images = manifest[bucket] || [];
    if (images.length) return `- \`${bucket}\`: ${images.map((filePath) => `\`${filePath}\``).join(", ")}`;
    return `- \`${bucket}\`: no inferred image found; fallback directory \`${imageBucketDir(lessonId, bucket)}\``;
  }).join("\n");
}

async function createCodexParseTask(lessonId) {
  const manifest = await initImageManifest(lessonId);
  const imagePaths = uniqueInitImagePaths(manifest);
  if (!imagePaths.length) throw new Error(`No images found under course-assets/by-lesson/lesson${lessonId} or course-assets/lesson${lessonId}.`);

  const taskPath = initCodexTaskPath(lessonId);
  const draftPath = initDraftPath(lessonId);
  const commonRulesPath = initCodexCommonRulesPath();
  const usesInferredImages = imagePaths.some((filePath) => filePath.includes("/course-assets/by-lesson/") || filePath.includes("\\course-assets\\by-lesson\\"));
  const lessonAssetRoot = usesInferredImages ? byLessonDir(lessonId) : join(root, "course-assets", `lesson${lessonId}`);
  const template = await readFile(initCodexTaskTemplatePath(), "utf8");
  const prompt = template
    .replaceAll("{{LESSON_ID}}", String(lessonId))
    .replaceAll("{{COMMON_RULES_PATH}}", commonRulesPath)
    .replaceAll("{{DRAFT_PATH}}", draftPath)
    .replaceAll("{{LESSON_ASSET_ROOT}}", lessonAssetRoot)
    .replaceAll("{{BUCKET_LIST}}", codexBucketList(lessonId, manifest));

  await mkdir(dirname(taskPath), { recursive: true });
  await mkdir(dirname(draftPath), { recursive: true });
  await writeFile(taskPath, prompt);

  const imageArgs = imagePaths.map((filePath) => `--image ${JSON.stringify(filePath)}`).join(" ");
  const promptText = `Read ${taskPath} and write the requested JSON draft.`;
  const command = `printf '%s' ${JSON.stringify(promptText)} | codex exec -C ${JSON.stringify(root)} -s workspace-write ${imageArgs} -`;
  const state = {
    ...(await readJsonFile(initStatePath(lessonId), {})),
    codexTaskCreatedAt: new Date().toISOString(),
    codexTaskPath: taskPath,
    codexCommand: command,
    draftPath,
    parseConfirmed: false,
    audioConfirmed: false
  };
  await writeJsonFile(initStatePath(lessonId), state);
  return { lessonId, taskPath, draftPath, command, imageCount: imagePaths.length };
}

try {
  const lessonId = await promptLessonId();
  const task = await createCodexParseTask(lessonId);
  console.log(`Created ${task.taskPath}`);
  console.log(`Expected output: ${task.draftPath}`);
  console.log(`Images: ${task.imageCount}`);
  console.log(task.command);
} catch (error) {
  console.error(error.message || error);
  process.exitCode = 1;
}
