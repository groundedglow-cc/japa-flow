import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdtemp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createVocabularyMatchers, vocabularyIndexes } from "./lib/vocabulary-occurrence-matching.mjs";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));
const firstPages = [22, 32, 42, 52, 68, 78, 88, 98, 114, 124, 134, 144, 160, 170, 180, 190, 206, 216, 226, 236, 252, 262, 272, 282, 4, 14, 24, 34, 50, 60, 70, 80, 96, 106, 116, 126, 142, 152, 162, 172, 188, 198, 208, 218, 234, 244, 254, 264];
const lessons = lessonNumbers(args);
const approve = args.approve === true;
const scanOnly = args["scan-only"] === true;
const force = args.force === true;

if (!lessons.length) throw new Error("Usage: node scripts/generate-grammar-vocabulary-native-ocr.mjs --lesson 33 [--approve] [--force], or --from 33 --to 35");

const helper = await buildVisionOcrHelper();
for (const lessonNo of lessons) await processLesson(lessonNo, helper);

async function processLesson(lessonNo, helperPath) {
  const scanPath = pathFor(lessonNo, "grammar-vocabulary-native-ocr-scan.json");
  const occurrencePath = pathFor(lessonNo, "grammar-vocabulary-native-ocr-occurrences.json");
  const pages = grammarPages(lessonNo);
  if (!pages.length) throw new Error(`lesson${lessonNo}: grammar page images are missing.`);
  let scan;
  if (!force && existsSync(scanPath)) {
    scan = readJson(scanPath);
    console.log(`lesson${lessonNo}: reuse native OCR scan`);
  } else {
    scan = { schemaVersion: 1, lessonId: `lesson${lessonNo}`, reviewStatus: "pending", scanSource: "macos-vision-ocr", pages: {} };
    for (const page of pages) {
      const rawText = await recognizeText(helperPath, page.path);
      const sourceText = rawText.map(cleanOcrLine).filter(shouldKeepSourceLine);
      scan.pages[String(page.pageNo)] = { sourceText, rawText, warnings: [] };
      console.log(`lesson${lessonNo} page${page.pageNo}: ${sourceText.length}/${rawText.length} OCR lines kept`);
    }
    await writeJson(scanPath, scan);
  }
  if (scanOnly) return;
  const vocabulary = readVocabulary(lessonNo);
  const matchers = createVocabularyMatchers(vocabulary);
  const outputPages = Object.fromEntries(Object.entries(scan.pages || {}).map(([pageNo, page]) => [
    pageNo,
    {
      sourceText: Array.isArray(page.sourceText) ? page.sourceText : [],
      wordIds: vocabularyIndexes(page.sourceText || [], matchers),
      warnings: Array.isArray(page.warnings) ? page.warnings : []
    }
  ]));
  const occurrences = {
    schemaVersion: 1,
    lessonId: scan.lessonId,
    vocabularyIndexBase: 1,
    reviewStatus: approve ? "approved" : "pending",
    generatedAt: new Date().toISOString(),
    scanSource: "macos-vision-ocr",
    pages: outputPages
  };
  await writeJson(occurrencePath, occurrences);
  const total = Object.values(outputPages).reduce((sum, page) => sum + page.wordIds.length, 0);
  console.log(`lesson${lessonNo}: ${occurrences.reviewStatus}, ${total} native OCR page-word matches`);
}

async function buildVisionOcrHelper() {
  const dir = await mkdtemp(join(tmpdir(), "japaflow-vision-ocr-"));
  const sourcePath = join(dir, "vision_ocr.m");
  const binaryPath = join(dir, "vision_ocr");
  await writeFile(sourcePath, visionOcrSource(), "utf8");
  const result = spawnSync("clang", ["-fobjc-arc", "-framework", "Foundation", "-framework", "AppKit", "-framework", "Vision", sourcePath, "-o", binaryPath], { cwd: root, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || "Failed to compile Vision OCR helper.");
  return binaryPath;
}

async function recognizeText(helperPath, imagePath) {
  const tempPng = `${imagePath.replace(/[^\w.-]/g, "_")}.png`;
  const convert = spawnSync("sips", ["-s", "format", "png", imagePath, "--out", join(tmpdir(), tempPng)], { cwd: root, encoding: "utf8" });
  if (convert.status !== 0) throw new Error(convert.stderr || convert.stdout || `Failed to convert ${imagePath}`);
  const pngPath = join(tmpdir(), tempPng);
  const output = await run(helperPath, [pngPath]);
  return output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function cleanOcrLine(value) {
  return String(value || "")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/^[▶>・\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function shouldKeepSourceLine(value) {
  const line = String(value || "").trim();
  if (!line) return false;
  if (/[ぁ-んァ-ヶー]/.test(line)) return true;
  if (/^[\p{Script=Han}々〆〤・ー]{1,8}$/u.test(line)) return true;
  return false;
}

function grammarPages(lessonNo) {
  const firstPage = firstPages[lessonNo - 1];
  if (!firstPage) return [];
  return Array.from({ length: 4 }, (_, offset) => firstPage + offset + 1)
    .map((pageNo) => ({ pageNo, path: join(root, "course-assets", "by-lesson", `lesson${lessonNo}`, `page${pageNo}.webp`) }))
    .filter((page) => existsSync(page.path));
}

function readVocabulary(lessonNo) {
  const verified = pathFor(lessonNo, "vocabulary-audio-verified.json");
  const fallback = pathFor(lessonNo, "vocabulary.json");
  const data = readJson(existsSync(verified) ? verified : fallback);
  if (!Array.isArray(data.vocabulary)) throw new Error(`lesson${lessonNo}: vocabulary list is unavailable.`);
  return data.vocabulary;
}

function run(command, commandArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve(stdout) : reject(new Error(stderr || stdout || `${command} exited with ${code}`)));
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
  if (options.lesson) return [positiveInteger(options.lesson, "lesson")];
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

function pathFor(lessonNo, suffix) {
  return join(root, "data", "ocr", `lesson${lessonNo}-${suffix}`);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  return writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function visionOcrSource() {
  return String.raw`#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>
#import <Vision/Vision.h>

int main(int argc, const char * argv[]) {
  @autoreleasepool {
    if (argc < 2) { fprintf(stderr, "usage: vision_ocr image\n"); return 2; }
    NSString *path = [NSString stringWithUTF8String:argv[1]];
    NSImage *image = [[NSImage alloc] initWithContentsOfFile:path];
    if (!image) { fprintf(stderr, "image load failed\n"); return 1; }
    NSData *tiff = [image TIFFRepresentation];
    NSBitmapImageRep *rep = [NSBitmapImageRep imageRepWithData:tiff];
    CGImageRef cgImage = [rep CGImage];
    if (!cgImage) { fprintf(stderr, "cg image failed\n"); return 1; }
    VNRecognizeTextRequest *request = [[VNRecognizeTextRequest alloc] initWithCompletionHandler:nil];
    request.recognitionLevel = VNRequestTextRecognitionLevelAccurate;
    request.recognitionLanguages = @[@"ja-JP", @"zh-Hans", @"en-US"];
    request.usesLanguageCorrection = YES;
    VNImageRequestHandler *handler = [[VNImageRequestHandler alloc] initWithCGImage:cgImage options:@{}];
    NSError *error = nil;
    if (![handler performRequests:@[request] error:&error]) {
      fprintf(stderr, "%s\n", [[error localizedDescription] UTF8String]);
      return 1;
    }
    for (VNRecognizedTextObservation *obs in request.results) {
      VNRecognizedText *text = [[obs topCandidates:1] firstObject];
      if (text.string.length) printf("%s\n", [text.string UTF8String]);
    }
  }
  return 0;
}
`;
}
