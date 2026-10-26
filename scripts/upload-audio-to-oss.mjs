// One-shot script: upload all MP3 files under audio/ to Alibaba Cloud OSS.
//
// Usage:
//   node scripts/upload-audio-to-oss.mjs           # upload all
//   node scripts/upload-audio-to-oss.mjs --dry-run # list files without uploading
//   node scripts/upload-audio-to-oss.mjs --dir audio/grammar --dry-run
//   node scripts/upload-audio-to-oss.mjs --dir audio/grammar
//
// Requires OSS_ENABLED=true and valid OSS_* env vars in .env.

import { existsSync, readFileSync } from "node:fs";
import { readFile, readdir, realpath, stat } from "node:fs/promises";
import { relative, resolve, join, isAbsolute, sep } from "node:path";
import { parseArgs } from "node:util";
import { isOSSEnabled, getOSSClient, ossFileExists, uploadToOSS } from "./oss-utils.mjs";

// Load .env (same pattern as server.mjs)
(() => {
  const envPath = join(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    if (process.env[key] !== undefined) continue;
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
})();

const { values } = parseArgs({ options: {
  "dry-run": { type: "boolean", default: false },
  dir: { type: "string", default: "audio" }
} });
const dryRun = values["dry-run"];
const concurrency = 5;
const audioDir = resolve(values.dir);

if (!dryRun && !isOSSEnabled()) {
  console.error("OSS_ENABLED is not true. Set OSS_ENABLED=true in .env to proceed.");
  process.exit(1);
}

async function* collectMp3Files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* collectMp3Files(full);
    } else if (entry.isFile() && entry.name.endsWith(".mp3")) {
      yield full;
    }
  }
}

async function main() {
  const audioRoot = await realpath(resolve("audio"));
  const selected = await realpath(audioDir);
  const withinAudio = relative(audioRoot, selected);
  if (withinAudio === ".." || withinAudio.startsWith(`..${sep}`) || isAbsolute(withinAudio)) {
    throw new Error("--dir must be audio/ or a directory inside audio/.");
  }
  if (!(await stat(audioDir)).isDirectory()) throw new Error("--dir must be a directory.");
  console.log(`${dryRun ? "[DRY RUN] " : ""}Gathering MP3 files from ${audioDir}...`);
  const files = [];
  for await (const f of collectMp3Files(audioDir)) {
    files.push(f);
  }
  console.log(`Found ${files.length} MP3 files.`);

  if (dryRun) {
    console.log("\nFiles in selected scope (OSS existence is not checked in dry run):");
    for (const f of files) {
      const ossKey = relative(resolve("."), f);
      console.log(`  ${f}  ->  ${ossKey}`);
    }
    console.log(`\nTotal: ${files.length} files (dry run, no upload).`);
    return;
  }

  // Verify OSS client can be created
  let client;
  try {
    client = await getOSSClient();
    if (!client) throw new Error("OSS client is null");
  } catch (e) {
    console.error("Failed to create OSS client:", e.message);
    process.exit(1);
  }

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  const queue = [...files];

  async function worker() {
    while (queue.length > 0) {
      const filePath = queue.shift();
      if (!filePath) break;
      const ossKey = relative(resolve("."), filePath);

      try {
        const alreadyExists = await ossFileExists(ossKey);
        if (alreadyExists) {
          skipped++;
          console.log(`skip [${uploaded + skipped + errors}/${files.length}] ${ossKey}`);
          continue;
        }
      } catch (e) {
        // If head fails for a non-404 reason, continue to upload anyway
      }

      try {
        const buffer = await readFile(filePath);
        await uploadToOSS(ossKey, buffer);
        uploaded++;
        console.log(`ok   [${uploaded + skipped + errors}/${files.length}] ${ossKey}`);
      } catch (e) {
        errors++;
        console.error(`FAIL [${uploaded + skipped + errors}/${files.length}] ${ossKey}: ${e.message}`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  console.log(`\nDone: uploaded=${uploaded} skipped=${skipped} errors=${errors} total=${files.length}`);
  if (errors) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
