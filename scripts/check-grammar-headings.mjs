import fs from "node:fs";

const numberOf = (title) => {
  const match = String(title || "").match(/^\s*(\d+)\s*[.．、)]/);
  return match ? Number(match[1]) : null;
};

let errors = 0;
let emptyGroups = 0;
for (let lesson = 1; lesson <= 48; lesson += 1) {
  const path = `data/ocr/lesson${lesson}-grammar-examples.json`;
  if (!fs.existsSync(path)) {
    console.error(`lesson${lesson}: missing ${path}`);
    errors += 1;
    continue;
  }
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  const pages = Object.entries(data.pages || {}).filter(([, page]) => page.groups?.length);
  const allGroups = pages.flatMap(([, page]) => page.groups || []);
  for (const group of allGroups) {
    if (!String(group.title || "").trim()) {
      console.error(`lesson${lesson}: group ${group.id || "(no id)"} has no title`);
      errors += 1;
    }
    const sentenceCount = (group.examples || []).reduce((count, example) => count + (example.sentences || []).length, 0);
    if (sentenceCount === 0) emptyGroups += 1;
  }
  const grammarPages = pages.slice(0, 2);
  const expressionPages = pages.slice(2);
  const grammarGroups = grammarPages.flatMap(([, page]) => page.groups);
  const expressionGroups = expressionPages.flatMap(([, page]) => page.groups);
  const grammarNumbers = grammarGroups.map((g) => numberOf(g.title)).filter(Number.isFinite);
  const expressionNumbers = expressionGroups.map((g) => numberOf(g.title)).filter(Number.isFinite);
  const maxGrammar = grammarNumbers.length ? Math.max(...grammarNumbers) : "?";
  const maxExpression = expressionNumbers.length ? Math.max(...expressionNumbers) : "?";
  console.log(`lesson${lesson}: grammar=${grammarGroups.length} (1-${maxGrammar}), expression=${expressionGroups.length} (1-${maxExpression}), empty=${allGroups.filter((g) => (g.examples || []).every((e) => !(e.sentences || []).length)).length}`);
}
console.log(`empty groups: ${emptyGroups}`);
if (errors) process.exitCode = 1;
