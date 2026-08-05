import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const lessons = process.argv.slice(2).map(Number);
if (!lessons.length || lessons.some((lesson) => !Number.isInteger(lesson) || lesson < 1 || lesson > 48)) {
  throw new Error("Usage: node scripts/auto-align-ocr-vocabulary-audio.mjs <lessonNo> [...lessonNo]");
}

const root = process.cwd();
const results = [];
for (const lesson of lessons) {
  const inputPath = join(root, "data", "ocr", `lesson${lesson}-vocabulary.json`);
  if (!existsSync(inputPath)) throw new Error(`Missing vocabulary OCR data: ${inputPath}`);
  results.push(await run(join(root, "scripts", "align-ocr-vocabulary-audio.mjs"), ["--lesson", String(lesson), "--auto-approve"]));
}

process.stdout.write(`${JSON.stringify({ lessons: results }, null, 2)}\n`);

function run(script, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], { cwd: root, env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        const message = (stderr || stdout).match(/Error:\s*([^\r\n]+)/)?.[1] || (stderr || stdout).trim() || `Script exited with code ${code}.`;
        reject(new Error(message));
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject(new Error(`Script returned invalid JSON: ${error.message}`));
      }
    });
  });
}
