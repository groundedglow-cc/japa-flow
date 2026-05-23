// Compare two lesson initialization JSON files and report content diffs.
//
// Default:
//   node scripts/diff-lesson-init.mjs --base 29 --target 30
//
// The comparison ignores top-level `id` and `title` because those are lesson-specific.

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));
const baseId = Number(args.base || 29);
const targetId = Number(args.target || 30);

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

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function lessonPath(id) {
  return join(root, "data", "lessons", `lesson${id}.json`);
}

function draftPath(id) {
  return join(root, "data", "lesson-drafts", `lesson${id}.json`);
}

async function loadLesson(id) {
  const paths = [lessonPath(id), draftPath(id)];
  for (const path of paths) {
    if (!existsSync(path)) continue;
    return { path, lesson: await readJson(path) };
  }
  throw new Error(`Lesson ${id} JSON not found. Checked: ${paths.join(", ")}`);
}

function normalizeLesson(lesson) {
  return {
    subtitle: lesson.subtitle || "",
    vocabulary: lesson.vocabulary || [],
    sentences: lesson.sentences || [],
    textStructure: lesson.textStructure || [],
    grammar: lesson.grammar || [],
    exercises: lesson.exercises || []
  };
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function diffValues(base, target, path = "") {
  if (base === target) return [];
  if (Array.isArray(base) && Array.isArray(target)) return diffArrays(base, target, path);
  if (isObject(base) && isObject(target)) return diffObjects(base, target, path);
  return [{
    path: path || "(root)",
    base,
    target
  }];
}

function diffObjects(base, target, path) {
  const diffs = [];
  const keys = new Set([...Object.keys(base || {}), ...Object.keys(target || {})]);
  for (const key of [...keys].sort()) {
    diffs.push(...diffValues(base?.[key], target?.[key], path ? `${path}.${key}` : key));
  }
  return diffs;
}

function diffArrays(base, target, path) {
  const diffs = [];
  const max = Math.max(base.length, target.length);
  for (let index = 0; index < max; index += 1) {
    if (index >= base.length) {
      diffs.push({ path: `${path}[${index}]`, base: undefined, target: target[index] });
      continue;
    }
    if (index >= target.length) {
      diffs.push({ path: `${path}[${index}]`, base: base[index], target: undefined });
      continue;
    }
    diffs.push(...diffValues(base[index], target[index], `${path}[${index}]`));
  }
  return diffs;
}

function formatValue(value) {
  if (value === undefined) return "⟂ undefined";
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function sectionDiffs(diffs) {
  const buckets = {
    subtitle: [],
    vocabulary: [],
    sentences: [],
    textStructure: [],
    grammar: [],
    exercises: [],
    other: []
  };
  for (const diff of diffs) {
    const key = diff.path.split(/[.[\]]/).filter(Boolean)[0] || "other";
    if (buckets[key]) buckets[key].push(diff);
    else buckets.other.push(diff);
  }
  return buckets;
}

function printSummary(baseMeta, targetMeta, diffs) {
  console.log(`Base:   ${baseMeta.path}`);
  console.log(`Target: ${targetMeta.path}`);
  console.log(`Base counts:   vocab=${baseMeta.lesson.vocabulary?.length || 0}, sentences=${baseMeta.lesson.sentences?.length || 0}, grammar=${baseMeta.lesson.grammar?.length || 0}, exercises=${baseMeta.lesson.exercises?.length || 0}`);
  console.log(`Target counts: vocab=${targetMeta.lesson.vocabulary?.length || 0}, sentences=${targetMeta.lesson.sentences?.length || 0}, grammar=${targetMeta.lesson.grammar?.length || 0}, exercises=${targetMeta.lesson.exercises?.length || 0}`);
  console.log("");
  if (!diffs.length) {
    console.log("PASS: normalized lesson content matches.");
    return;
  }
  console.log(`FAIL: ${diffs.length} content diff(s) found.`);
  console.log("");
  const buckets = sectionDiffs(diffs);
  for (const [section, items] of Object.entries(buckets)) {
    if (!items.length) continue;
    console.log(`[${section}] ${items.length}`);
    for (const item of items.slice(0, 40)) {
      console.log(`- ${item.path}`);
      console.log(`  base:   ${formatValue(item.base)}`);
      console.log(`  target: ${formatValue(item.target)}`);
    }
    if (items.length > 40) {
      console.log(`  ... ${items.length - 40} more`);
    }
    console.log("");
  }
}

async function main() {
  const baseMeta = await loadLesson(baseId);
  const targetMeta = await loadLesson(targetId);
  const base = normalizeLesson(baseMeta.lesson);
  const target = normalizeLesson(targetMeta.lesson);
  const diffs = diffValues(base, target);
  printSummary(baseMeta, targetMeta, diffs);
  if (diffs.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(String(error?.stack || error));
  process.exitCode = 1;
});
