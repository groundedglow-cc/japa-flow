export function normalize(value) {
  return String(value || "").normalize("NFKC").replace(/\s+/g, "");
}

export function splitAlternatives(value) {
  return String(value || "").split(/[／/]/).map((item) => item.trim()).filter(Boolean);
}

export function verbForms(word) {
  const writing = word.writing || word.kana || "";
  const reading = word.kana || writing;
  const forms = new Set([writing, reading]);
  if (word.partOfSpeech === "动3" && reading.endsWith("します")) {
    const stem = writing.slice(0, writing.length - "します".length);
    ["する", "し", "して", "した", "しない", "します", "すれば", "しよう"].forEach((ending) => forms.add(`${stem}${ending}`));
  } else if (word.partOfSpeech === "动2" && reading.endsWith("ます")) {
    const stem = writing.slice(0, writing.length - "ます".length);
    ["る", "て", "た", "ない", "なく", "なくて", "なかった", "なくても", "ます", "ました", "ません", "ませんでした", "ましょう", "れば", "よう"].forEach((ending) => forms.add(`${stem}${ending}`));
  } else if (word.partOfSpeech === "动1" && reading.endsWith("ます")) {
    const kanaEnding = reading.at(-3);
    const stem = writing.slice(0, writing.length - "ます".length - 1);
    const endings = {
      "き": ["か", "き", "く", "け", "こ", "いて", "いた", "きました", "きません", "きませんでした", "きましょう"],
      "ぎ": ["が", "ぎ", "ぐ", "げ", "ご", "いで", "いだ", "ぎました", "ぎません", "ぎませんでした", "ぎましょう"],
      "し": ["さ", "し", "す", "せ", "そ", "して", "した", "しました", "しません", "しませんでした", "しましょう"],
      "ち": ["た", "ち", "つ", "て", "と", "って", "った", "ちました", "ちません", "ちませんでした", "ちましょう"],
      "に": ["な", "に", "ぬ", "ね", "の", "んで", "んだ", "にました", "にません", "にませんでした", "にましょう"],
      "び": ["ば", "び", "ぶ", "べ", "ぼ", "んで", "んだ", "びました", "びません", "びませんでした", "びましょう"],
      "み": ["ま", "み", "む", "め", "も", "んで", "んだ", "みました", "みません", "みませんでした", "みましょう"],
      "り": ["ら", "り", "る", "れ", "ろ", "って", "った", "りました", "りません", "りませんでした", "りましょう"]
    };
    (endings[kanaEnding] || []).forEach((ending) => forms.add(`${stem}${ending}`));
  }
  return forms;
}

export function createVocabularyMatchers(vocabulary) {
  return vocabulary.flatMap((word, arrayIndex) => {
    const forms = new Set();
    const oneKanjiWord = /^[\p{Script=Han}]$/u.test(normalize(word.writing));
    for (const value of [word.writing, word.kana]) splitAlternatives(value).forEach((item) => add(forms, item));
    verbForms(word).forEach((item) => add(forms, item));
    return [...forms]
      .filter((form) => form.length >= 2 || (oneKanjiWord && form === normalize(word.writing)))
      .map((form) => ({ form, index: arrayIndex + 1 }));
  }).sort((left, right) => right.form.length - left.form.length);
}

export function vocabularyIndexes(texts, matchers) {
  const output = [];
  for (const sourceText of texts) {
    const source = normalize(sourceText);
    for (let cursor = 0; cursor < source.length;) {
      const match = matchers.find((candidate) => source.startsWith(candidate.form, cursor));
      if (match) {
        output.push(match.index);
        cursor += match.form.length;
      } else {
        cursor += 1;
      }
    }
  }
  return [...new Set(output)];
}

function add(set, value) {
  const normalized = normalize(value);
  if (normalized) set.add(normalized);
}
