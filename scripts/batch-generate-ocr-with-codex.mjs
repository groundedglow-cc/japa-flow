import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));
const from = numberArg(args.from || 1, "from");
const to = numberArg(args.to || 48, "to");
const force = Boolean(args.force);
const verbose = Boolean(args.verbose);
const onlyMissing = !force;
const concurrency = Math.max(1, numberArg(args.concurrency || 1, "concurrency"));
const outDir = join(root, "data", "ocr");
const taskDir = join(root, "data", "ocr-tasks");

await mkdir(outDir, { recursive: true });
await mkdir(taskDir, { recursive: true });

const vocabularyPrompt = await readFile(join(root, "docs", "vocabulary-ocr-extraction-prompt.md"), "utf8");
const textPrompt = await readFile(join(root, "docs", "text-ocr-extraction-prompt.md"), "utf8");
const tasks = [];

for (let lessonNo = from; lessonNo <= to; lessonNo += 1) {
  const vocabularyPath = join(outDir, `lesson${lessonNo}-vocabulary.json`);
  const textPath = join(outDir, `lesson${lessonNo}-text.json`);
  if (onlyMissing && existsSync(vocabularyPath) && existsSync(textPath)) continue;
  const images = await lessonKeyImages(lessonNo);
  if (!images.length) {
    console.warn(`lesson${lessonNo}: no images found, skipped`);
    continue;
  }
  const taskPath = join(taskDir, `lesson${lessonNo}-ocr-task.md`);
  await writeFile(taskPath, buildTaskPrompt({ lessonNo, images, vocabularyPrompt, textPrompt, vocabularyPath, textPath }), "utf8");
  tasks.push({ lessonNo, taskPath, images, textPath });
}

console.log(`OCR tasks: ${tasks.length}`);
await runQueue(tasks, concurrency, runCodexTask);

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

function numberArg(value, name) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) throw new Error(`Invalid --${name}: ${value}`);
  return number;
}

async function lessonKeyImages(lessonNo) {
  const dir = join(root, "course-assets", "by-lesson", `lesson${lessonNo}`);
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const images = entries
    .filter((entry) => entry.isFile() && /\.(webp|png|jpe?g)$/i.test(entry.name))
    .map((entry) => join(dir, entry.name))
    .sort(naturalCompare);
  return [images[0], images[5], images.at(-1)].filter(Boolean);
}

function naturalCompare(a, b) {
  return basename(a).localeCompare(basename(b), undefined, { numeric: true, sensitivity: "base" });
}

function buildTaskPrompt({ lessonNo, images, vocabularyPrompt, textPrompt, vocabularyPath, textPath }) {
  return `# 批量 OCR 任务：lesson${lessonNo}

你需要读取随命令传入的教材图片，按照下面两份规则生成两份 JSON 文件。

## 输出文件

1. 单词 JSON：\`${vocabularyPath}\`
2. 课文 JSON：\`${textPath}\`

必须直接写入上述两个文件。不要写 Markdown 代码块，不要把 JSON 输出到终端作为唯一结果。

## 当前课次

lesson${lessonNo}

## 已传入的关键图片

${images.map((image, index) => `- #${index + 1}: \`${image}\``).join("\n")}

通常 #1 是基本课文，#2 是应用课文，#3 是词汇表。若页面内容和这个推断不一致，以图片内容为准。

## 单词提取规则

${vocabularyPrompt}

## 课文提取规则

${textPrompt}

## 额外约束

- 只生成 \`lesson${lessonNo}\` 的数据。
- 两个 JSON 都必须是合法 JSON。
- 每个日语句子都必须输出非空 \`kana\` 和 \`segments\`；每个含汉字的 segment 都必须有非空 \`ruby\`。无法从图片确认时可依据句子补全读音，并在 \`warnings\` 中记录需要复核的句子 ID，但不得省略字段。
- 完成后只用一句话报告两个文件是否已写入和数量统计。
`;
}

async function runQueue(items, limit, worker) {
  let next = 0;
  const failures = [];
  const workers = Array.from({ length: limit }, async () => {
    while (next < items.length) {
      const item = items[next++];
      try {
        await worker(item);
      } catch (error) {
        failures.push({ item, error });
        console.error(`lesson${item.lessonNo}: failed: ${error.message || error}`);
      }
    }
  });
  await Promise.all(workers);
  if (failures.length) {
    process.exitCode = 1;
    console.error(`Failures: ${failures.map((failure) => `lesson${failure.item.lessonNo}`).join(", ")}`);
  }
}

async function runCodexTask(task) {
  console.log(`lesson${task.lessonNo}: starting`);
  await new Promise((resolve, reject) => {
    const child = spawn("codex", [
      "exec",
      "-C",
      root,
      "-s",
      "workspace-write",
      ...task.images.flatMap((image) => ["--image", image]),
      "-"
    ], {
      cwd: root,
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
      if (verbose) process.stdout.write(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
      if (verbose) process.stderr.write(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        try {
          validateTextAnnotations(task.textPath);
          console.log(`lesson${task.lessonNo}: done`);
          resolve();
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error(stderr || stdout || `codex exited with code ${code}`));
      }
    });
    child.stdin.end(`Read ${task.taskPath} and write the requested JSON files.`);
  });
}

function validateTextAnnotations(filePath) {
  if (!existsSync(filePath)) throw new Error(`Text OCR output was not written: ${filePath}`);
  const data = JSON.parse(readFileSync(filePath, "utf8"));
  const items = [
    ...(data.basicText?.basicSentences || []),
    ...(data.basicText?.dialogues || []).flatMap((dialogue) => dialogue.lines || []),
    ...(data.applicationText?.blocks || []).flatMap((block) => block.type === "dialogue" ? block.lines || [] : [block])
  ].filter((item) => containsKanaOrJapaneseText(item.text));
  const failures = [];
  for (const item of items) {
    const id = item.id || "unknown";
    if (!String(item.kana || "").trim()) failures.push(`${id}: missing kana`);
    if (!Array.isArray(item.segments) || !item.segments.length) {
      failures.push(`${id}: missing segments`);
      continue;
    }
    if (item.segments.map((segment) => segment?.text || "").join("") !== item.text) failures.push(`${id}: segments do not reconstruct text`);
    for (const segment of item.segments) {
      if (/\p{Script=Han}/u.test(String(segment?.text || "")) && !String(segment?.ruby || "").trim()) failures.push(`${id}: kanji segment missing ruby`);
    }
  }
  if (failures.length) throw new Error(`Text kana/ruby validation failed: ${failures.slice(0, 12).join("; ")}${failures.length > 12 ? `; and ${failures.length - 12} more` : ""}`);
}

function containsKanaOrJapaneseText(value) {
  return /[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(String(value || ""));
}
