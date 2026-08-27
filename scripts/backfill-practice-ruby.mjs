import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const args = parseArgs(process.argv.slice(2));
const lessonNo = positiveInteger(args.lesson || args.lessonId || "", "lesson");
const root = process.cwd();
const practicePath = join(root, "practice", `lesson${lessonNo}-practice-data.ts`);

if (!existsSync(practicePath)) throw new Error(`Missing practice data: ${practicePath}`);

const prompt = `Update only ${practicePath} to complete Japanese Ruby input data for lesson ${lessonNo}.

Every user-visible Japanese string that contains kanji must have a full kana reading in the existing data model:
- text("...", { kana: "..." }) for example/layout text
- promptKana for answerItem/dialogueItem prompts
- beforeKana and afterKana for ExampleBlock strings
- RichText kana for text inside PromptPart arrays

The kana must reproduce the full displayed string, preserve punctuation/newlines, and use correct Japanese readings. Do not attach kana to kana-only text. Do not change question text, answers, IDs, layout, or behavior. A kana value must be a full-string reading, not only the kanji reading; the renderer will place Ruby only over kanji. Check all activities, item groups, examples, dialogue layouts, word banks, and prompts. Then run npm run build:practice. Do not edit any other source file.`;

await runCodex(prompt);

function runCodex(instruction) {
  return new Promise((resolve, reject) => {
    const child = spawn("codex", ["exec", "-C", root, "-s", "workspace-write", "-"], { cwd: root, stdio: ["pipe", "inherit", "inherit"] });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`codex exited with ${code}`)));
    child.stdin.end(instruction);
  });
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
