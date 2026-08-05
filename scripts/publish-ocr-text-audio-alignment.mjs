import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import ffmpeg from "ffmpeg-static";

const lessonNo = Number(process.argv[2]);
if (!Number.isInteger(lessonNo) || lessonNo < 1) throw new Error("Usage: node scripts/publish-ocr-text-audio-alignment.mjs <lessonNo>");

const root = process.cwd();
const alignmentPath = join(root, "data", "ocr", `lesson${lessonNo}-text-audio-alignment.json`);
const textPath = join(root, "data", "ocr", `lesson${lessonNo}-text.json`);
const outputPath = join(root, "data", "ocr", `lesson${lessonNo}-text-audio-verified.json`);
const clipsDir = join(root, "data", "ocr", "audio-clips", `lesson${lessonNo}`);
const alignment = readJson(alignmentPath);
const text = readJson(textPath);
const approved = alignment.tracks.flatMap((track) => track.items.map((item) => ({ track, item }))).filter(({ item }) => item.review?.status === "approved");
if (!approved.length) throw new Error("No approved segments. Review and approve at least one sentence before publishing.");

for (const { track, item } of approved) {
  const start = Number(item.review.start);
  const end = Number(item.review.end);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) throw new Error(`Invalid approved range for ${item.id}`);
  const audioPath = join(root, track.localAudioPath);
  const outputFile = `${item.id}.mp3`;
  const outputFilePath = join(clipsDir, outputFile);
  mkdirSync(clipsDir, { recursive: true });
  const result = spawnSync(ffmpeg, ["-y", "-i", audioPath, "-ss", String(start), "-to", String(end), "-map", "0:a:0", "-c:a", "libmp3lame", "-b:a", "128k", outputFilePath], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`ffmpeg failed for ${item.id}: ${result.stderr}`);
  const target = findTextItem(text, item.id);
  if (!target) throw new Error(`Could not find ${item.id} in lesson text.`);
  target.audioSegment = {
    id: item.id,
    trackId: track.id,
    sourceUrl: `/data/ocr/audio-clips/lesson${lessonNo}/${outputFile}`,
    start: 0,
    end: round(end - start),
    duration: round(end - start),
    method: "approved-asr-alignment",
    confidence: "approved",
    reviewedAt: item.review.reviewedAt || new Date().toISOString(),
    sourceAudioSha256: track.sourceAudioSha256
  };
}

text.audioAlignment = {
  schemaVersion: 1,
  method: "approved-asr-alignment",
  sourceAlignment: `data/ocr/lesson${lessonNo}-text-audio-alignment.json`,
  publishedAt: new Date().toISOString(),
  approvedSegments: approved.length
};
writeFileSync(outputPath, `${JSON.stringify(text, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ lessonId: `lesson${lessonNo}`, outputPath: outputPath.slice(root.length + 1), approvedSegments: approved.length }, null, 2)}\n`);

function findTextItem(data, id) {
  for (const item of data.basicText?.basicSentences || []) if (item.id === id) return item;
  for (const dialogue of data.basicText?.dialogues || []) for (const item of dialogue.lines || []) if (item.id === id) return item;
  for (const block of data.applicationText?.blocks || []) for (const item of block.lines || []) if (item.id === id) return item;
  return null;
}

function readJson(filePath) {
  if (!existsSync(filePath)) throw new Error(`Missing file: ${filePath}`);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}
