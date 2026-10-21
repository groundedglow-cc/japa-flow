import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
await mkdir('shared/notes/dist', { recursive: true });
const result = await build({ entryPoints:['shared/notes/mountInlineNotes.jsx'], bundle:true, format:'esm', platform:'browser', target:['es2020'], jsx:'automatic', write:false, minify:true });
const js = result.outputFiles[0].contents;
const css = `${await readFile('shared/notes/inline-ai-notes.css','utf8')}\n${await readFile('shared/notes/inline-notes-host.css','utf8')}`;
const version = createHash('sha256').update(js).update(css).digest('hex').slice(0,12);
await writeFile('shared/notes/dist/inline-notes.js', js);
await writeFile('shared/notes/dist/inline-notes.css', css);
for (const path of ['tools/grammar-image-preview.html','tools/text-import-preview.html']) {
  let html = await readFile(path,'utf8');
  html = html.replace(/\/shared\/notes\/dist\/inline-notes\.(js|css)(?:\?v=[a-f0-9]+)?/g, (_,ext) => `/shared/notes/dist/inline-notes.${ext}?v=${version}`);
  await writeFile(path,html);
}
console.log(`Inline notes built: ${version}`);
