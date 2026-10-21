import { existsSync, readFileSync } from "node:fs";
import { mkdir, rename, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";

// Read the local environment without printing credentials.
if (existsSync(".env")) {
  for (const raw of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = raw.trim().match(/^([A-Z_][A-Z_0-9]*)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
}

const arg = (name, fallback = "") => process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3) || fallback;
const lesson = Number(arg("lesson"));
const limit = Number(arg("limit", "0"));
const voice = arg("voice", process.env.AZURE_TTS_VOICE_ID || "ja-JP-KeitaNeural");
const region = String(process.env.AZURE_SPEECH_REGION || "").trim().toLowerCase().replace(/\s+/g, "");
const key = process.env.AZURE_SPEECH_KEY;
if (!Number.isInteger(lesson) || lesson < 1 || lesson > 48 || !Number.isInteger(limit) || limit < 0) throw Error("Usage: node scripts/generate-azure-grammar-audio.mjs --lesson=39 [--voice=ja-JP-KeitaNeural] [--limit=1]");
if (!key || !region) throw Error("Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION in .env");
if (!/^ja-JP-[A-Za-z]+Neural$/.test(voice)) throw Error(`Unsupported Japanese Azure voice format: ${voice}`);

const sourcePath = `data/ocr/lesson${lesson}-grammar-examples.json`;
const manifestPath = `data/ocr/lesson${lesson}-grammar-audio.json`;
const data = JSON.parse(readFileSync(sourcePath, "utf8"));
if (data.reviewStatus !== "approved") throw Error("Image-reviewed, approved grammar data is required before generating audio.");
const rawSentences = Object.values(data.pages || {}).flatMap(page => (page.groups || []).flatMap(group => (group.examples || []).flatMap(example => example.sentences || [])));
for (const sentence of rawSentences) {
  if (typeof sentence !== "string" || !sentence.trim() || sentence.includes("[object Object]")) {
    throw Error("Invalid sentence: expected a non-empty Japanese string, not an object. No Azure request was sent.");
  }
}
const texts = [...new Set(rawSentences.map(sentence => sentence.replace(/\[[^\[\]]+\]/g, "")))];
if (!texts.length) throw Error("No sentences found. No Azure request was sent.");
const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
const voiceFolder = `azure-${voice.replace(/^ja-JP-/, "").replace(/Neural$/, "").toLowerCase()}`;
const folder = `audio/grammar/lesson${lesson}/${voiceFolder}`;
const manifest = { schemaVersion: 1, lessonId: `lesson${lesson}`, provider: "azure-speech", model: "Neural", voice, locale: "ja-JP", outputFormat: "audio-24khz-160kbitrate-mono-mp3", sentences: {} };
const xmlEscape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]);
await mkdir(folder, { recursive: true });

let generated = 0;
for (const text of texts) {
  const hash = createHash("sha256").update(JSON.stringify({ text, provider: manifest.provider, voice, locale: manifest.locale, outputFormat: manifest.outputFormat })).digest("hex");
  const path = join(folder, `${hash}.mp3`);
  if (!existsSync(path)) {
    if (limit && generated >= limit) continue;
    const ssml = `<speak version="1.0" xml:lang="ja-JP"><voice name="${voice}">${xmlEscape(text)}</voice></speak>`;
    let response;
    try {
      response = await fetch(endpoint, { method: "POST", signal: AbortSignal.timeout(60000), headers: { "Ocp-Apim-Subscription-Key": key, "Content-Type": "application/ssml+xml", "X-Microsoft-OutputFormat": manifest.outputFormat, "User-Agent": "japa-flow-azure-grammar-audio" }, body: ssml });
    } catch { throw Error("Azure Speech network request failed or timed out; credential was not printed."); }
    const contentType = String(response.headers.get("content-type") || "").toLowerCase();
    const buffer = Buffer.from(await response.arrayBuffer());
    if (!response.ok) throw Error(`Azure Speech rejected request: HTTP ${response.status}. Check key, region, voice and quota.`);
    const hasMp3Header = buffer.subarray(0, 3).toString() === "ID3" || (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0);
    const looksLikeError = /json|html|text\//.test(contentType) || buffer.subarray(0, 120).toString("utf8").trimStart().startsWith("<");
    if (buffer.length < 1000 || looksLikeError || !hasMp3Header) throw Error(`Azure Speech returned an invalid MP3 response (bytes=${buffer.length}, content-type=${contentType}).`);
    await writeFile(`${path}.tmp`, buffer);
    await rename(`${path}.tmp`, path);
    generated += 1;
    console.log(`Generated ${generated}: ${text}`);
  }
  manifest.sentences[text] = `/${path}`;
}
// Publish only a complete manifest. Cached MP3s retain progress after interruption.
if (Object.keys(manifest.sentences).length === texts.length) {
  await writeFile(`${manifestPath}.tmp`, `${JSON.stringify(manifest, null, 2)}\n`);
  await rename(`${manifestPath}.tmp`, manifestPath);
}
console.log(`Ready: ${Object.keys(manifest.sentences).length}/${texts.length} sentences; ${generated} new Azure audio files; voice=${voice}`);
