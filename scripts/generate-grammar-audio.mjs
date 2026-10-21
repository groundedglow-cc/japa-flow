import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile, rename } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";

// Reuse the project's private .env without exposing credentials in output.
if (existsSync(".env")) {
  for (const raw of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = raw.trim().match(/^([A-Z_][A-Z_0-9]*)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
}
const lesson = Number(process.argv.find((arg) => arg.startsWith("--lesson="))?.split("=")[1]);
const limit = Number(process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] || 0);
if (!Number.isInteger(lesson) || lesson < 1 || lesson > 48 || !Number.isInteger(limit) || limit < 0) throw Error("Usage: node scripts/generate-grammar-audio.mjs --lesson=39 [--limit=1]");
const apiKey = process.env.MINIMAX_API_KEY;
if (!apiKey) throw Error("Missing MINIMAX_API_KEY in .env");
const endpoint = new URL(process.env.MINIMAX_TTS_URL || "https://api.minimaxi.com/v1/t2a_v2");
if (endpoint.protocol !== "https:" || !["api.minimaxi.com", "api.minimax.io"].includes(endpoint.hostname)) throw Error("Expected an official MiniMax HTTPS endpoint");
const model = process.env.MINIMAX_TTS_MODEL || "speech-2.8-hd";
const voice = process.env.MINIMAX_VOICE_ID || "Japanese_IntellectualSenior";
const speed = 0.9;
const data = JSON.parse(readFileSync(`data/ocr/lesson${lesson}-grammar-examples.json`, "utf8"));
const texts = [...new Set(Object.values(data.pages).flatMap((page) => page.groups.flatMap((group) => group.examples.flatMap((example) => example.sentences.map((sentence) => sentence.replace(/\[[^\[\]]+\]/g, ""))))))];
const manifestPath = `data/ocr/lesson${lesson}-grammar-audio.json`;
const manifest = { schemaVersion: 1, lessonId: `lesson${lesson}`, provider: "minimax", model, voice, speed, sentences: {} };
const folder = `audio/grammar/lesson${lesson}`;
await mkdir(folder, { recursive: true });
let generated = 0;
for (const text of texts) {
  const hash = createHash("sha256").update(JSON.stringify({ text, model, voice, speed })).digest("hex");
  const path = join(folder, `${hash}.mp3`);
  if (!existsSync(path)) {
    if (limit && generated >= limit) continue;
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST", signal: AbortSignal.timeout(60000),
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, text, stream: false, output_format: "hex", language_boost: "Japanese", voice_setting: { voice_id: voice, speed, vol: 1, pitch: 0 }, audio_setting: { sample_rate: 32000, bitrate: 128000, format: "mp3", channel: 1 } })
      });
    } catch { throw Error("MiniMax network request failed or timed out; no credential printed."); }
    const body = await response.json().catch(() => ({}));
    const code = body.base_resp?.status_code;
    if (!response.ok || code !== 0) throw Error(`MiniMax rejected request: HTTP ${response.status}, status_code=${code ?? "unknown"}. Check API key, balance and model access.`);
    const hex = body.data?.audio;
    if (typeof hex !== "string" || !/^(?:[0-9a-f]{2})+$/i.test(hex)) throw Error("MiniMax returned invalid audio");
    await writeFile(`${path}.tmp`, Buffer.from(hex, "hex"));
    await rename(`${path}.tmp`, path);
    generated++;
    console.log(`Generated ${generated}: ${text}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  manifest.sentences[text] = `/${path}`;
  await writeFile(`${manifestPath}.tmp`, `${JSON.stringify(manifest, null, 2)}\n`);
  await rename(`${manifestPath}.tmp`, manifestPath);
}
console.log(`Ready: ${Object.keys(manifest.sentences).length}/${texts.length} sentences; ${generated} new audio files.`);
