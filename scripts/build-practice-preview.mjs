import { build } from "esbuild";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const practiceDir = join(root, "practice");
const distDir = join(practiceDir, "dist");
const hash = (content) => createHash("sha256").update(content).digest("hex").slice(0, 12);

async function removePreviousHashedAssets() {
  const files = await readdir(distDir);
  await Promise.all(files
    .filter((file) => /^(practice-preview-react(?:\.[a-f0-9]+)?\.js|lesson1-practice-preview\.[a-f0-9]+\.css)$/.test(file))
    .map((file) => rm(join(distDir, file))));
}

async function updatePreviewHtml(cssFile, bundleFile) {
  const files = await readdir(practiceDir);
  const previewFiles = files.filter((file) => /^lesson\d+-practice-preview\.html$/.test(file));
  await Promise.all(previewFiles.map(async (file) => {
    const path = join(practiceDir, file);
    const html = await readFile(path, "utf8");
    const updated = html
      .replace(/href="\.\/(?:dist\/)?lesson1-practice-preview(?:\.[a-f0-9]+)?\.css"/g, `href="./dist/${cssFile}"`)
      .replace(/src="\.\/dist\/practice-preview-react(?:\.[a-f0-9]+)?\.js"/g, `src="./dist/${bundleFile}"`);
    if (updated !== html) await writeFile(path, updated);
  }));
}

await mkdir(distDir, { recursive: true });
const bundle = await build({
  entryPoints: ["practice/react/entry.jsx"],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2020"],
  outfile: join(distDir, "practice-preview-react.js"),
  write: false,
  jsx: "automatic",
  sourcemap: false,
  logLevel: "silent"
});

const bundleOutput = bundle.outputFiles.find((file) => file.path.endsWith("practice-preview-react.js"));
if (!bundleOutput) throw new Error("Practice preview bundle was not generated.");

const cssContent = await readFile(join(practiceDir, "lesson1-practice-preview.css"));
const bundleFile = `practice-preview-react.${hash(bundleOutput.contents)}.js`;
const cssFile = `lesson1-practice-preview.${hash(cssContent)}.css`;

await removePreviousHashedAssets();
await Promise.all([
  writeFile(join(distDir, bundleFile), bundleOutput.contents),
  writeFile(join(distDir, cssFile), cssContent),
  updatePreviewHtml(cssFile, bundleFile)
]);

console.log(`✓ Practice assets: ${cssFile}, ${bundleFile}`);
