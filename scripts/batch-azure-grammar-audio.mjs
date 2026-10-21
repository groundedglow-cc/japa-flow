import { readFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';

const arg = (key, fallback = '') => process.argv.find(x => x.startsWith(`--${key}=`))?.slice(key.length + 3) || fallback;
const input = arg('lessons');
if (!input || !/^\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*$/.test(input)) throw Error('Usage: node scripts/batch-azure-grammar-audio.mjs --lessons=1-4,24,27 [--workers=3] [--dry-run]');
const lessons = [...new Set(input.split(',').flatMap(part => {
  const [start, end = start] = part.split('-').map(Number);
  if (start < 1 || end > 48 || end < start) throw Error('Lesson range must be 1–48.');
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}))];
const workers = Number(arg('workers', '3'));
if (!Number.isInteger(workers) || workers < 1 || workers > 6) throw Error('workers must be 1–6');
const voice = arg('voice', 'ja-JP-KeitaNeural');
if (!/^ja-JP-[A-Za-z]+Neural$/.test(voice)) throw Error('Invalid voice');
const folder = `azure-${voice.replace(/^ja-JP-/, '').replace(/Neural$/, '').toLowerCase()}`;
const jobs = lessons.map(n => {
  const source = `data/ocr/lesson${n}-grammar-examples.json`;
  const data = JSON.parse(readFileSync(source, 'utf8'));
  if (data.reviewStatus !== 'approved' || data.lessonId !== `lesson${n}`) throw Error(`Lesson ${n}: not image-reviewed and approved`);
  const values = Object.values(data.pages || {}).flatMap(p => (p.groups || []).flatMap(g => (g.examples || []).flatMap(e => e.sentences || [])));
  if (!values.length || values.some(s => typeof s !== 'string' || !s.trim() || s.includes('[object Object]'))) throw Error(`Lesson ${n}: invalid sentence data`);
  const texts = [...new Set(values.map(s => s.replace(/\[[^\[\]]+\]/g, '')))];
  const missing = texts.filter(text => !existsSync(`audio/grammar/lesson${n}/${folder}/${createHash('sha256').update(JSON.stringify({ text, provider: 'azure-speech', voice, locale: 'ja-JP', outputFormat: 'audio-24khz-160kbitrate-mono-mp3' })).digest('hex')}.mp3`));
  console.log(`Lesson ${n}: ${values.length} displayed, ${texts.length} unique, ${missing.length} uncached, ${missing.reduce((sum, s) => sum + s.length, 0)} uncached characters`);
  return { n, source, digest: createHash('sha256').update(readFileSync(source)).digest('hex'), texts };
});
if (process.argv.includes('--dry-run')) process.exit(0);
const children = new Set();
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { for (const child of children) child.kill(signal); process.exit(130); });
const failures = [];
let cursor = 0;
async function worker() {
  while (cursor < jobs.length) {
    const job = jobs[cursor++];
    let done = false;
    for (let attempt = 1; attempt <= 3 && !done; attempt++) {
      if (createHash('sha256').update(readFileSync(job.source)).digest('hex') !== job.digest) throw Error(`Lesson ${job.n}: source changed during generation`);
      const code = await new Promise(resolve => {
        const child = spawn(process.execPath, ['scripts/generate-azure-grammar-audio.mjs', `--lesson=${job.n}`, `--voice=${voice}`], { stdio: 'inherit' });
        children.add(child);
        child.on('error', () => resolve(1));
        child.on('close', code => { children.delete(child); resolve(code); });
      });
      done = code === 0;
      if (!done && attempt < 3) { console.log(`Lesson ${job.n}: retry ${attempt + 1}/3; retaining cached audio`); await new Promise(r => setTimeout(r, 2000 * attempt)); }
    }
    if (!done) { failures.push(job.n); continue; }
    const manifest = JSON.parse(readFileSync(`data/ocr/lesson${job.n}-grammar-audio.json`, 'utf8'));
    if (manifest.voice !== voice || job.texts.some(text => !manifest.sentences[text] || !existsSync(manifest.sentences[text].replace(/^\//, '')))) throw Error(`Lesson ${job.n}: incomplete audio manifest`);
    console.log(`VERIFIED lesson ${job.n}: ${job.texts.length}/${job.texts.length} audio files`);
  }
}
await Promise.all(Array.from({ length: Math.min(workers, jobs.length) }, worker));
if (failures.length) { console.error(`Failed lessons: ${failures.join(',')}. Re-run the same command to resume.`); process.exitCode = 1; }
