import { build } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const lessonArgument = process.argv.find((argument) => argument.startsWith("--lesson="))?.slice("--lesson=".length)
  || process.argv[process.argv.indexOf("--lesson") + 1];

if (!/^\d+$/.test(lessonArgument || "")) {
  throw new Error("Usage: node scripts/generate-lesson-vocabulary-occurrences.mjs --lesson <number>");
}

const lessonNumber = Number(lessonArgument);
const lessonId = `lesson${lessonNumber}`;
const ocrDir = join(root, "data", "ocr");
const vocabularyPath = join(ocrDir, `${lessonId}-vocabulary-audio-verified.json`);
const textPath = join(ocrDir, `${lessonId}-text-audio-verified.json`);
const outputPath = join(ocrDir, `${lessonId}-vocabulary-occurrences.json`);
const practicePath = join(root, "practice", `${lessonId}-practice-data.ts`);

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const normalize = (value) => String(value || "").normalize("NFKC").replace(/\s+/g, "");

function splitAlternatives(value) {
  return String(value || "").split(/[／/]/).map((item) => item.trim()).filter(Boolean);
}

function verbForms(word) {
  const writing = word.writing || word.kana;
  const kana = word.kana || word.writing;
  const sourceForms = [[writing, kana]];
  const forms = new Set();
  const add = (value) => {
    const normalized = normalize(value);
    if (normalized.length >= 2) forms.add(normalized);
  };

  for (const [surface, reading] of sourceForms) {
    if (!surface || !reading) continue;
    add(surface);
    if (word.partOfSpeech === "动3" && reading.endsWith("します")) {
      const stem = surface.slice(0, surface.length - "します".length);
      ["する", "し", "して", "した", "しない", "します", "すれば", "しよう"].forEach((ending) => add(`${stem}${ending}`));
      continue;
    }
    if (word.partOfSpeech === "动2" && reading.endsWith("ます")) {
      const stem = surface.slice(0, surface.length - "ます".length);
      // Do not include the bare stem: for words such as ためます it would
      // incorrectly match the grammar pattern 〜ために.
      ["る", "て", "た", "ない", "ます", "ました", "ません", "ませんでした", "ましょう", "れば", "よう"].forEach((ending) => add(`${stem}${ending}`));
      continue;
    }
    if (word.partOfSpeech === "动1" && reading.endsWith("ます")) {
      const ending = reading.at(-3);
      const stem = surface.slice(0, surface.length - "ます".length - 1);
      const conjugations = {
        "き": ["か", "き", "く", "け", "こ", "いて", "いた", "きました", "きません", "きませんでした", "きましょう"],
        "ぎ": ["が", "ぎ", "ぐ", "げ", "ご", "いで", "いだ", "ぎました", "ぎません", "ぎませんでした", "ぎましょう"],
        "し": ["さ", "し", "す", "せ", "そ", "して", "した", "しました", "しません", "しませんでした", "しましょう"],
        "ち": ["た", "ち", "つ", "て", "と", "って", "った", "ちました", "ちません", "ちませんでした", "ちましょう"],
        "に": ["な", "に", "ぬ", "ね", "の", "んで", "んだ", "にました", "にません", "にませんでした", "にましょう"],
        "び": ["ば", "び", "ぶ", "べ", "ぼ", "んで", "んだ", "びました", "びません", "びませんでした", "びましょう"],
        "み": ["ま", "み", "む", "め", "も", "んで", "んだ", "みました", "みません", "みませんでした", "みましょう"],
        "り": ["ら", "り", "る", "れ", "ろ", "って", "った", "りました", "りません", "りませんでした", "りましょう"]
      };
      (conjugations[ending] || []).forEach((suffix) => add(`${stem}${suffix}`));
    }
  }
  return forms;
}

function createMatchers(vocabulary) {
  return vocabulary.flatMap((word, arrayIndex) => {
    const forms = new Set();
    for (const value of [word.writing, word.kana]) {
      for (const alternative of splitAlternatives(value)) forms.add(normalize(alternative));
    }
    for (const form of verbForms(word)) forms.add(form);
    return [...forms]
      .filter((form) => form.length >= 2)
      .map((form) => ({ form, index: arrayIndex + 1 }));
  }).sort((left, right) => right.form.length - left.form.length);
}

function vocabularyIndexes(texts, matchers) {
  const occurrences = [];
  for (const sourceText of texts) {
    const text = normalize(sourceText);
    let cursor = 0;
    while (cursor < text.length) {
      const matcher = matchers.find((candidate) => text.startsWith(candidate.form, cursor));
      if (matcher) {
        occurrences.push(matcher.index);
        cursor += matcher.form.length;
      } else {
        cursor += 1;
      }
    }
  }
  return [...new Set(occurrences)];
}

function textContent(value, result = []) {
  if (typeof value === "string") result.push(value);
  else if (Array.isArray(value)) value.forEach((item) => textContent(item, result));
  else if (isObject(value)) {
    if (typeof value.text === "string") result.push(value.text);
    if (typeof value.before === "string") result.push(value.before);
    if (Array.isArray(value.after)) textContent(value.after, result);
    if (Array.isArray(value.beforeParts)) textContent(value.beforeParts, result);
    if (Array.isArray(value.pairedRows)) textContent(value.pairedRows, result);
    if (Array.isArray(value.words)) textContent(value.words, result);
    if (Array.isArray(value.lines)) textContent(value.lines, result);
  }
  return result;
}

function practiceText(activity) {
  const result = [activity.title, activity.instruction];
  for (const layout of activity.layout || []) textContent(layout, result);
  for (const group of activity.itemGroups || []) {
    result.push(group.title, group.instruction);
    textContent(group.example, result);
    for (const item of group.items || []) textContent(item.prompt, result);
  }
  for (const item of activity.items || []) textContent(item.prompt, result);
  for (const item of activity.items || []) {
    for (const choice of item.choices || []) result.push(choice.label);
  }
  for (const choice of activity.choices || []) result.push(choice.label);
  return result;
}

async function loadPractice() {
  try {
    const bundle = await build({
      entryPoints: [practicePath],
      bundle: true,
      format: "esm",
      platform: "node",
      target: ["node20"],
      write: false,
      logLevel: "silent"
    });
    const code = bundle.outputFiles[0]?.text;
    if (!code) throw new Error("Practice data bundle was not generated.");
    const module = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
    return module[`lesson${lessonNumber}Practice`];
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

const [vocabularyData, textData, practice] = await Promise.all([
  readFile(vocabularyPath, "utf8").then(JSON.parse),
  readFile(textPath, "utf8").then(JSON.parse),
  loadPractice()
]);
const matchers = createMatchers(vocabularyData.vocabulary || []);
const basicTexts = [
  ...(textData.basicText?.basicSentences || []).map((item) => item.text),
  ...(textData.basicText?.dialogues || []).flatMap((dialogue) => (dialogue.lines || []).map((line) => line.text))
];
const applicationTexts = (textData.applicationText?.blocks || []).flatMap((block) => [
  block.text,
  ...(block.lines || []).map((line) => line.text)
]);
const practiceOccurrences = Object.fromEntries((practice?.activities || []).map((activity) => [
  activity.id,
  vocabularyIndexes(practiceText(activity), matchers)
]));

const output = {
  schemaVersion: 1,
  lessonId,
  vocabularyIndexBase: 1,
  text: {
    basic: vocabularyIndexes(basicTexts, matchers),
    application: vocabularyIndexes(applicationTexts, matchers)
  },
  practice: practiceOccurrences
};

await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`✓ ${outputPath.replace(`${root}/`, "")}`);
console.log(JSON.stringify(output));
