#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const practiceDir = path.join(rootDir, "practice");
const imageDir = path.join(rootDir, "data", "book1_exercise_images");
const write = process.argv.includes("--write");
const pruneUnmatched = process.argv.includes("--prune-unmatched");
const restoreFromCatalog = process.argv.includes("--restore-from-catalog");
const lessonArg = process.argv.find((arg) => arg.startsWith("--lesson="));
const requestedLessons = lessonArg ? new Set(lessonArg.slice("--lesson=".length).split(",").map((value) => Number(value))) : null;

if (!fs.existsSync(imageDir)) throw new Error(`图片目录不存在：${imageDir}`);

const imageIndex = new Map();
const catalogAssetCache = new Map();
for (const fileName of fs.readdirSync(imageDir).filter((name) => name.endsWith(".png")).sort()) {
  const matched = fileName.match(/^book1_lesson(\d+)_(\d+)_(\d+)(?:_([A-Za-z]+|\d+))?\.png$/);
  if (!matched) continue;
  const [, lesson, part, order, variant] = matched;
  const key = `${lesson}:${part}:${order}`;
  const entry = imageIndex.get(key) || { base: null, variants: [] };
  if (variant) entry.variants.push({ fileName, variant });
  else entry.base = fileName;
  imageIndex.set(key, entry);
}
for (const entry of imageIndex.values()) entry.variants.sort((left, right) => left.variant.localeCompare(right.variant, undefined, { numeric: true }));

function skipString(source, start) {
  const quote = source[start];
  let index = start + 1;
  while (index < source.length) {
    if (source[index] === "\\") index += 2;
    else if (source[index] === quote) return index + 1;
    else index += 1;
  }
  return source.length;
}

function balancedEnd(source, start, open = "{", close = "}") {
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    if (["'", '"', "`"].includes(source[index])) {
      index = skipString(source, index) - 1;
      continue;
    }
    if (source[index] === open) depth += 1;
    if (source[index] === close) {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
  }
  throw new Error(`未闭合的 ${open}`);
}

function topLevelProperty(source, objectStart, objectEnd, propertyName) {
  let curly = 0;
  let square = 0;
  let paren = 0;
  for (let index = objectStart + 1; index < objectEnd - 1; index += 1) {
    const char = source[index];
    if (["'", '"', "`"].includes(char)) {
      index = skipString(source, index) - 1;
      continue;
    }
    if (char === "{") curly += 1;
    else if (char === "}") curly -= 1;
    else if (char === "[") square += 1;
    else if (char === "]") square -= 1;
    else if (char === "(") paren += 1;
    else if (char === ")") paren -= 1;
    if (curly || square || paren || !source.startsWith(propertyName, index)) continue;
    const before = source[index - 1];
    const after = source[index + propertyName.length];
    if ((before && /[A-Za-z0-9_$]/.test(before)) || (after && /[A-Za-z0-9_$]/.test(after))) continue;
    let cursor = index + propertyName.length;
    while (/\s/.test(source[cursor])) cursor += 1;
    if (source[cursor] !== ":") continue;
    cursor += 1;
    while (/\s/.test(source[cursor])) cursor += 1;
    const valueStart = cursor;
    curly = 0;
    square = 0;
    paren = 0;
    for (; cursor < objectEnd - 1; cursor += 1) {
      const valueChar = source[cursor];
      if (["'", '"', "`"].includes(valueChar)) {
        cursor = skipString(source, cursor) - 1;
        continue;
      }
      if (valueChar === "{") curly += 1;
      else if (valueChar === "}") curly -= 1;
      else if (valueChar === "[") square += 1;
      else if (valueChar === "]") square -= 1;
      else if (valueChar === "(") paren += 1;
      else if (valueChar === ")") paren -= 1;
      else if (valueChar === "," && !curly && !square && !paren) {
        return { start: index, valueStart, end: cursor };
      }
    }
    return { start: index, valueStart, end: cursor };
  }
  return null;
}

function activityObjects(source) {
  const activitiesStart = source.indexOf("const activities:");
  if (activitiesStart < 0) return [];
  const assignmentStart = source.indexOf("=", activitiesStart);
  const arrayStart = source.indexOf("[", assignmentStart);
  const arrayEnd = balancedEnd(source, arrayStart, "[", "]");
  const objects = [];
  for (let cursor = arrayStart + 1; cursor < arrayEnd - 1; cursor += 1) {
    if (["'", '"', "`"].includes(source[cursor])) {
      cursor = skipString(source, cursor) - 1;
      continue;
    }
    if (source[cursor] !== "{") continue;
    const end = balancedEnd(source, cursor);
    objects.push({ start: cursor, end });
    cursor = end - 1;
  }
  return objects;
}

function displayAssetIds(activitySource) {
  return [...activitySource.matchAll(/\bdisplayAssets\s*:\s*\[([\s\S]*?)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/["']([^"']+)["']/g)].map((id) => id[1]));
}

function candidatesFor(lesson, part, order, assetCount) {
  const entry = imageIndex.get(`${lesson}:${part}:${order}`);
  if (entry) return entry.base ? [entry.base, ...entry.variants.map((variant) => variant.fileName)] : entry.variants.map((variant) => variant.fileName);
  const alphaVariantGroups = [...imageIndex.entries()]
    .filter(([key, candidate]) => key.startsWith(`${lesson}:${part}:`) && !candidate.base && candidate.variants.length === assetCount)
    .filter(([, candidate]) => candidate.variants.every((variant) => /^[A-Za-z]+$/.test(variant.variant)));
  return alphaVariantGroups.length === 1 ? alphaVariantGroups[0][1].variants.map((variant) => variant.fileName) : [];
}

function catalogAssetIds(lesson, part, order) {
  if (!catalogAssetCache.has(lesson)) {
    const catalogPath = path.join(practiceDir, `lesson${lesson}-image-crops.ts`);
    const source = fs.existsSync(catalogPath) ? fs.readFileSync(catalogPath, "utf8") : "";
    catalogAssetCache.set(lesson, [...source.matchAll(/\bid:\s*["']([^"']+)["']/g)].map((match) => match[1]));
  }
  const prefix = `l${lesson}-p${part}-a${order}-`;
  return catalogAssetCache.get(lesson).filter((id) => id.startsWith(prefix));
}

function imageAssets(assetIds, files) {
  const mappedFiles = files.length === 1 ? assetIds.map(() => files[0]) : files;
  return `[\n${assetIds.map((id, index) => `      { id: "${id}", kind: "exercise_image", imagePath: exerciseImage("${mappedFiles[index]}") }`).join(",\n")}\n    ]`;
}

function removeImageReferences(activitySource) {
  let next = activitySource;
  const assets = topLevelProperty(next, 0, next.length, "assets");
  if (assets) next = `${next.slice(0, assets.start)}assets: []${next.slice(assets.end)}`;
  next = next.replace(/^\s*displayAssets\s*:\s*\[[^\]]*\],\s*\n/gm, "");
  next = next.replace(/^\s*relatedAssets\s*:\s*\[[^\]]*\],\s*\n/gm, "");
  return next;
}

function removeUnusedCropBindings(source) {
  let next = source;
  for (const match of [...next.matchAll(/^const\s+([A-Za-z_$][\w$]*)\s*=\s*crop\([^\n]+\);\n/gm)]) {
    const name = match[1];
    const occurrences = [...next.matchAll(new RegExp(`\\b${name}\\b`, "g"))].length;
    if (occurrences === 1) next = next.replace(match[0], "");
  }
  const cropCalls = [...next.matchAll(/\bcrop\s*\(/g)].length;
  if (cropCalls === 0) {
    next = next.replace(/^import\s+\{\s*lesson\d+ImageCrops\s*\}\s+from\s+["']\.\/lesson\d+-image-crops["'];\n/m, "");
    next = next.replace(/^const crop\s*=\s*\(id: string\)\s*=>[^\n]+\n/m, "");
  }
  for (const match of [...next.matchAll(/^const\s+([A-Za-z_$][\w$]*)\s*=\s*asset\([^\n]+\);\n/gm)]) {
    const name = match[1];
    const occurrences = [...next.matchAll(new RegExp(`\\b${name}\\b`, "g"))].length;
    if (occurrences === 1) next = next.replace(match[0], "");
  }
  if (!/\basset\s*\(/.test(next)) {
    next = next.replace(/^const asset\s*=\s*\(id: string\)\s*=>\s*\{[\s\S]*?^\};\n/m, "");
    if (!/lesson\d+ImageCrops/.test(next)) {
      next = next.replace(/^import\s+\{\s*lesson\d+ImageCrops\s*\}\s+from\s+["']\.\/lesson\d+-image-crops["'];\n/m, "");
    }
  }
  return next;
}

function addImageHelper(source) {
  if (source.includes("const exerciseImage =")) return source;
  const importEnd = source.indexOf("\n", source.lastIndexOf("import ")) + 1;
  return `${source.slice(0, importEnd)}\nconst exerciseImage = (fileName: string) => \`../data/book1_exercise_images/\${fileName}\`;\n${source.slice(importEnd)}`;
}

const dataFiles = fs.readdirSync(practiceDir)
  .map((name) => ({ name, match: name.match(/^lesson(\d+)-practice-data\.ts$/) }))
  .filter((entry) => entry.match && (!requestedLessons || requestedLessons.has(Number(entry.match[1]))))
  .sort((left, right) => Number(left.match[1]) - Number(right.match[1]));

let changedFiles = 0;
let migratedActivities = 0;
let prunedActivities = 0;
const skipped = [];
for (const { name, match } of dataFiles) {
  const lesson = Number(match[1]);
  const filePath = path.join(practiceDir, name);
  const original = fs.readFileSync(filePath, "utf8");
  const replacements = [];
  for (const activity of activityObjects(original)) {
    const body = original.slice(activity.start, activity.end);
    const idMatch = body.match(/^\{\s*id:\s*["']l(\d+)-p(\d+)-a(\d+)["']/);
    if (!idMatch) continue;
    const [, idLesson, part, order] = idMatch;
    let assetIds = [...new Set(displayAssetIds(body))];
    const restoring = !assetIds.length && restoreFromCatalog;
    if (restoring) assetIds = catalogAssetIds(idLesson, part, order);
    if (!assetIds.length) continue;
    const candidates = candidatesFor(idLesson, part, order, assetIds.length);
    if (!candidates.length) {
      if (pruneUnmatched) {
        const cleaned = removeImageReferences(body);
        if (cleaned !== body) {
          replacements.push({ start: activity.start, end: activity.end, text: cleaned });
          prunedActivities += 1;
        }
        continue;
      }
      skipped.push(`${name}: l${idLesson}-p${part}-a${order}（未找到新题图）`);
      continue;
    }
    if (candidates.length !== 1 && candidates.length !== assetIds.length) {
      skipped.push(`${name}: l${idLesson}-p${part}-a${order}（${assetIds.length} 个资源、${candidates.length} 张候选图，需人工确认）`);
      continue;
    }
    const assets = imageAssets(assetIds, candidates);
    const existingAssets = topLevelProperty(original, activity.start, activity.end, "assets");
    if (existingAssets) {
      const display = restoring ? `,\n    displayAssets: ${JSON.stringify(assetIds)},` : "";
      const text = `assets: ${assets}${display}`;
      if (original.slice(existingAssets.start, existingAssets.end) === text) continue;
      const end = restoring && original[existingAssets.end] === "," ? existingAssets.end + 1 : existingAssets.end;
      replacements.push({ start: existingAssets.start, end, text });
    }
    else {
      const layout = topLevelProperty(original, activity.start, activity.end, "layout");
      if (!layout) {
        skipped.push(`${name}: l${idLesson}-p${part}-a${order}（无法定位 layout，未改写）`);
        continue;
      }
      replacements.push({ start: layout.start, end: layout.start, text: `assets: ${assets},${restoring ? `\n    displayAssets: ${JSON.stringify(assetIds)},` : ""}\n    ` });
    }
    migratedActivities += 1;
  }
  if (!replacements.length) {
    const cleaned = removeUnusedCropBindings(original);
    if (cleaned !== original) {
      changedFiles += 1;
      if (write) fs.writeFileSync(filePath, cleaned);
    }
    continue;
  }
  let next = original;
  for (const replacement of replacements.sort((left, right) => right.start - left.start)) {
    next = `${next.slice(0, replacement.start)}${replacement.text}${next.slice(replacement.end)}`;
  }
  next = removeUnusedCropBindings(next);
  next = addImageHelper(next);
  if (next !== original) {
    changedFiles += 1;
    if (write) fs.writeFileSync(filePath, next);
  }
}

console.log(`${write ? "已迁移" : "预演"}：${migratedActivities} 个 activity，移除 ${prunedActivities} 个无新图 activity 的旧图片引用，${changedFiles} 个数据文件。`);
if (skipped.length) {
  console.log(`\n未自动迁移（${skipped.length} 项）：`);
  console.log(skipped.join("\n"));
  process.exitCode = 2;
}
if (!write) console.log(`\n这是预演；确认输出后运行 npm run migrate:exercise-images -- --write${pruneUnmatched ? " --prune-unmatched" : ""} 写入。\n`);
