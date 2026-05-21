// Build the static App bundle into app-dist/ — used as Capacitor webDir.
// Includes only what the student runtime needs (no admin tooling, no init assets).
//
// Run: npm run build:app

import { cp, mkdir, readFile, rm, writeFile, access } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "app-dist");

const studentFiles = ["index.html", "app.js", "styles.css"];
const studentDataIncludes = ["catalog.json", "lessons"];   // skip lesson-init, lesson-drafts (admin only)
const audioDir = "audio";

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function copyStudentData() {
  const src = join(root, "data");
  const dst = join(out, "data");
  await mkdir(dst, { recursive: true });
  for (const name of studentDataIncludes) {
    const from = join(src, name);
    if (!existsSync(from)) continue;
    await cp(from, join(dst, name), { recursive: true });
  }
}

async function patchIndexHtml() {
  const src = await readFile(join(root, "index.html"), "utf8");
  // 在 app.js 之前注入 JAPAFLOW_CONFIG 加载脚本（Azure 密钥）。
  // 注入两段：local（实际密钥，gitignored）+ example（fallback，避免 404）。
  const inject = `    <script src="/japaflow-config.local.js"></script>\n    <script src="/japaflow-config.example.js"></script>\n`;
  const patched = src.replace(/(\s+)<script type="module" src="\/app\.js[^"]*"><\/script>/, `\n${inject}$1<script type="module" src="/app.js"></script>`);
  await writeFile(join(out, "index.html"), patched);
}

async function copyConfigStubs() {
  const examplePath = join(root, "japaflow-config.example.js");
  const localPath = join(root, "japaflow-config.local.js");
  if (existsSync(examplePath)) await cp(examplePath, join(out, "japaflow-config.example.js"));
  if (existsSync(localPath)) {
    await cp(localPath, join(out, "japaflow-config.local.js"));
    console.log("✓ Injected real Azure key from japaflow-config.local.js");
  } else {
    // 占位文件，避免 404；实际密钥未配时 App 内发音评测会报"App 缺少 Azure 配置"。
    await writeFile(join(out, "japaflow-config.local.js"), "// placeholder — create japaflow-config.local.js at repo root with real key.\n");
    console.log("⚠ japaflow-config.local.js not found at repo root — App build has no Azure key.");
  }
}

async function main() {
  if (existsSync(out)) await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  for (const name of studentFiles) {
    if (name === "index.html") continue; // patched separately
    const from = join(root, name);
    if (!existsSync(from)) throw new Error(`Missing ${from}`);
    await cp(from, join(out, name));
  }

  await patchIndexHtml();
  await copyStudentData();

  const audioFrom = join(root, audioDir);
  if (existsSync(audioFrom)) await cp(audioFrom, join(out, audioDir), { recursive: true });

  await copyConfigStubs();

  console.log(`✓ Built app-dist at ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
