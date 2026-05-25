import { writeFile } from "node:fs/promises";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const targetPaths = [
  "data/lesson-drafts/lesson28.json",
  "data/lessons/lesson28.json"
];

const staticEntries = extractStaticExerciseEntries(path.join(root, "app.js"));
const manualSupplementEntries = [
  ["地図", "ちず"],
  ["切符", "きっぷ"],
  ["買い方", "かいかた"],
  ["教え", "おしえ"],
  ["紹介", "しょうかい"],
  ["薬", "くすり"],
  ["友達", "ともだち"],
  ["お土産", "おみやげ"],
  ["有名", "ゆうめい"],
  ["野菜", "やさい"],
  ["新鮮", "しんせん"],
  ["旅行", "りょこう"],
  ["仕事", "しごと"],
  ["届け", "とどけ"],
  ["大使館", "たいしかん"],
  ["電話番号", "でんわばんごう"],
  ["番号", "ばんごう"],
  ["住所", "じゅうしょ"],
  ["発音", "はつおん"],
  ["直", "なお"],
  ["調べ", "しらべ"],
  ["交換", "こうかん"],
  ["動", "うご"],
  ["部品", "ぶひん"],
  ["自転車", "じてんしゃ"],
  ["英語", "えいご"],
  ["フランス語", "フランスご"],
  ["韓国語", "かんこくご"],
  ["上手", "じょうず"],
  ["時間", "じかん"],
  ["朝", "あさ"],
  ["会社", "かいしゃ"],
  ["横浜", "よこはま"],
  ["誕生日", "たんじょうび"],
  ["大丈夫", "だいじょうぶ"],
  ["遅", "おそ"],
  ["案内", "あんない"],
  ["訳", "やく"],
  ["引っ越し", "ひっこし"],
  ["手伝", "てつだ"],
  ["貸", "か"],
  ["見せ", "みせ"],
  ["持", "も"],
  ["来", "き"],
  ["でき", "でき"],
  ["分か", "わか"],
  ["教え", "おしえ"],
  ["届", "とど"],
  ["送", "おく"],
  ["書", "か"],
  ["読", "よ"],
  ["会", "あ"],
  ["行", "い"],
  ["買", "か"],
  ["使", "つか"],
  ["作", "つく"],
  ["持", "も"],
  ["帰", "かえ"],
  ["部長", "ぶちょう"],
  ["孫さん", "まごさん"],
  ["荷物", "にもつ"],
  ["手紙", "てがみ"],
  ["中国語", "ちゅうごくご"],
  ["日本語", "にほんご"],
  ["東京", "とうきょう"],
  ["本", "ほん"],
  ["王さん", "おうさん"],
  ["小野さん", "おのさん"],
  ["中田先生", "なかだせんせい"],
  ["娘さん", "むすめさん"],
  ["空港", "くうこう"],
  ["鉛筆", "えんぴつ"],
  ["辞書", "じしょ"],
  ["枚", "まい"],
  ["天ぷら", "てんぷら"],
  ["作り方", "つくりかた"],
  ["車", "くるま"],
  ["店", "みせ"],
  ["料理", "りょうり"],
  ["お茶", "おちゃ"],
  ["森さん", "もりさん"],
  ["林さん", "はやしさん"],
  ["仕事 / 遅くまで手伝います", "しごと / おそくまで てつだいます"],
  ["コンピュータの部品 / 交換します / うまく動きません", "コンピュータの ぶひん / こうかんします / うまく うごきません"],
  ["中田先生の住所 / 調べます / 分かりませんでした", "なかだせんせいの じゅうしょ / しらべます / わかりませんでした"],
  ["鉛筆を貸します / 辞書も貸します", "えんぴつを かします / じしょも かします"],
  ["これを5枚コピーします / 部長に届けます", "これを 5まい コピーします / ぶちょうに とどけます"],
  ["わたしは小野さんに東京を案内して（くれました・もらいました）。", "わたしは おのさんに とうきょうを あんないして（くれました・もらいました）。"],
  ["明日の朝、横浜へ行かなければなりません。（　）、すみませんが、会社へ行くのが少し遅れます。", "あしたの あさ、よこはまへ いかなければなりません。（　）、すみませんが、かいしゃへ いくのが すこし おくれます。"],
  ["（　）、明日は9月1日、ぼくの誕生日だ。", "（　）、あしたは 9がつ1にち、ぼくの たんじょうびだ。"],
  ["李さんは傘を貸してあげました。", "りさんは かさを かして あげました。"],
  ["長島さんは駅まで送ってもらいました。", "ながしまさんは えきまで おくって もらいました。"]
];
const lessons = targetPaths
  .filter((file) => existsSync(path.join(root, file)))
  .map((file) => ({ file, lesson: JSON.parse(readFileSync(path.join(root, file), "utf8")) }));

const dictionary = buildDictionary(lessons, [...staticEntries, ...manualSupplementEntries]);
let writtenFiles = 0;
let filledFields = 0;

for (const { file, lesson } of lessons) {
  const before = JSON.stringify(lesson);
  const stats = backfillLesson(lesson, dictionary);
  const after = JSON.stringify(lesson);
  if (after !== before) {
    await writeFile(path.join(root, file), JSON.stringify(lesson, null, 2) + "\n");
    writtenFiles += 1;
  }
  filledFields += stats.filled;
  console.log(`${file}: filled ${stats.filled}, skipped ${stats.skipped}`);
}

console.log(`Wrote ${writtenFiles} files; filled ${filledFields} exercise kana fields.`);

function backfillLesson(lesson, dictionary) {
  let filled = 0;
  let skipped = 0;
  for (const exercise of lesson.exercises || []) {
    if (exercise.question && !exercise.questionKana) {
      const kana = deriveKana(exercise.question, dictionary);
      if (kana) {
        exercise.questionKana = kana;
        filled += 1;
      } else {
        skipped += 1;
      }
    }
    if (exercise.example && !exercise.exampleKana) {
      const kana = deriveKana(exercise.example, dictionary);
      if (kana) {
        exercise.exampleKana = kana;
        filled += 1;
      }
    }
    if (exercise.answer && !exercise.answerKana) {
      const kana = deriveKana(exercise.answer, dictionary);
      if (kana) {
        exercise.answerKana = kana;
        filled += 1;
      } else {
        skipped += 1;
      }
    }
    if (Array.isArray(exercise.referenceAnswers)) {
      const kanaList = [];
      let changed = false;
      for (let index = 0; index < exercise.referenceAnswers.length; index += 1) {
        const reference = exercise.referenceAnswers[index];
        const existing = Array.isArray(exercise.referenceAnswerKana) ? exercise.referenceAnswerKana[index] : "";
        if (existing) {
          kanaList.push(existing);
          continue;
        }
        const kana = deriveKana(reference, dictionary);
        kanaList.push(kana || "");
        if (kana) {
          changed = true;
          filled += 1;
        } else {
          skipped += 1;
        }
      }
      if (changed || (!exercise.referenceAnswerKana && kanaList.some(Boolean))) {
        exercise.referenceAnswerKana = kanaList;
      }
    }
  }
  return { filled, skipped };
}

function buildDictionary(lessons, staticEntries) {
  const map = new Map();
  const add = (surface, reading) => {
    const text = String(surface || "").trim();
    const kana = String(reading || "").trim();
    if (!text || !kana) return;
    const current = map.get(text);
    if (!current || current.length < kana.length) map.set(text, kana);
  };

  for (const [surface, reading] of staticEntries) add(surface, reading);

  for (const { lesson } of lessons) {
    for (const word of lesson.vocabulary || []) add(word.jp, word.kana);
    for (const sentence of lesson.sentences || []) {
      add(sentence.text, sentence.kana);
      for (const [surface, reading] of extractRubyPairs(sentence.text, sentence.kana)) add(surface, reading);
    }
    for (const exercise of lesson.exercises || []) {
      if (exercise.question && exercise.questionKana) add(exercise.question, exercise.questionKana);
      if (exercise.example && exercise.exampleKana) add(exercise.example, exercise.exampleKana);
      if (exercise.answer && exercise.answerKana) add(exercise.answer, exercise.answerKana);
      for (let index = 0; index < (exercise.referenceAnswers || []).length; index += 1) {
        const reading = Array.isArray(exercise.referenceAnswerKana) ? exercise.referenceAnswerKana[index] : "";
        if (reading) add(exercise.referenceAnswers[index], reading);
      }
    }
  }

  return [...map.entries()].sort((a, b) => b[0].length - a[0].length);
}

function deriveKana(text, entries) {
  const source = String(text || "");
  if (!source) return "";
  let result = "";
  for (let index = 0; index < source.length;) {
    const char = source[index];
    if (isWhitespace(char) || isPunctuation(char)) {
      result += char;
      index += 1;
      continue;
    }

    let matched = null;
    for (const [surface, reading] of entries) {
      if (source.startsWith(surface, index)) {
        matched = [surface, reading];
        break;
      }
    }

    if (matched) {
      result += matched[1];
      index += matched[0].length;
      continue;
    }

    if (isKana(char) || isAscii(char) || isNumeric(char)) {
      result += char;
      index += 1;
      continue;
    }

    if (isKanji(char)) return "";
    result += char;
    index += 1;
  }
  return result;
}

function extractStaticExerciseEntries(appPath) {
  const source = readFileSync(appPath, "utf8");
  const startMarker = "const exerciseRubyEntries = [";
  const endMarker = "].sort((a, b) => b[0].length - a[0].length);";
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < 0) return [];
  const body = source.slice(start + startMarker.length, end);
  const entries = [];
  const pattern = /\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g;
  for (const match of body.matchAll(pattern)) entries.push([match[1], match[2]]);
  return entries;
}

function extractRubyPairs(text, reading) {
  const pairs = [];
  const html = alignRubyFromKana(String(text || ""), String(reading || ""));
  const pattern = /<ruby>(.*?)<rt>(.*?)<\/rt><\/ruby>/g;
  let match;
  while ((match = pattern.exec(html))) {
    const surface = stripTags(match[1]);
    const kana = stripTags(match[2]);
    if (surface && kana) pairs.push([surface, kana]);
  }
  return pairs;
}

function alignRubyFromKana(text, reading) {
  const memo = new Map();

  function finish(key, tail, build) {
    const result = tail ? build(tail) : null;
    memo.set(key, result);
    return result;
  }

  function walk(textIndex, readingIndex) {
    readingIndex = skipSpaces(reading, readingIndex);
    const key = `${textIndex}:${readingIndex}`;
    if (memo.has(key)) return memo.get(key);
    if (textIndex >= text.length) {
      const done = skipSpaces(reading, readingIndex) >= reading.length ? { html: "", readingIndex } : null;
      memo.set(key, done);
      return done;
    }

    const char = text[textIndex];
    if (isWhitespace(char)) {
      return finish(key, walk(textIndex + 1, readingIndex), (tail) => ({
        html: escapeHtml(char) + tail.html,
        readingIndex: tail.readingIndex
      }));
    }

    if (isPunctuation(char)) {
      const nextReadingIndex = isPunctuation(reading[readingIndex]) ? readingIndex + 1 : readingIndex;
      return finish(key, walk(textIndex + 1, nextReadingIndex), (tail) => ({
        html: escapeHtml(char) + tail.html,
        readingIndex: tail.readingIndex
      }));
    }

    if (!isKanji(char)) {
      const end = nextPlainRunEnd(text, textIndex);
      const plain = text.slice(textIndex, end);
      const taken = takeReadingChars(reading, readingIndex, plain.length);
      if (!taken || normalizeKana(plain) !== normalizeKana(taken.text)) {
        memo.set(key, null);
        return null;
      }
      return finish(key, walk(end, taken.end), (tail) => ({
        html: escapeHtml(plain) + tail.html,
        readingIndex: tail.readingIndex
      }));
    }

    const segmentEnds = possibleKanjiSegmentEnds(text, textIndex);
    for (const end of segmentEnds) {
      const surface = text.slice(textIndex, end);
      const suffix = kanjiSuffix(surface);
      const minLength = Math.max(1, suffix.length + 1);
      const candidates = readingCandidates(reading, readingIndex, minLength);
      for (const candidate of candidates) {
        if (suffix && !normalizeKana(candidate.text).endsWith(normalizeKana(suffix))) continue;
        const tail = walk(end, candidate.end);
        if (tail) {
          const rt = suffix && normalizeKana(candidate.text).endsWith(normalizeKana(suffix))
            ? candidate.text.slice(0, candidate.text.length - suffix.length)
            : candidate.text;
          const done = { html: `<ruby>${escapeHtml(surface.slice(0, surface.length - suffix.length))}<rt>${escapeHtml(rt)}</rt></ruby>${escapeHtml(suffix)}${tail.html}`, readingIndex: tail.readingIndex };
          memo.set(key, done);
          return done;
        }
      }
    }

    memo.set(key, null);
    return null;
  }

  const out = walk(0, 0);
  return out?.html || "";
}

function nextPlainRunEnd(text, index) {
  let end = index;
  while (end < text.length && !isKanji(text[end]) && !isPunctuation(text[end]) && !isWhitespace(text[end])) end += 1;
  return end;
}

function possibleKanjiSegmentEnds(text, index) {
  const ends = [];
  for (let end = index + 1; end <= text.length; end += 1) {
    const previous = text[end - 1];
    if (isPunctuation(previous) || isWhitespace(previous)) break;
    if (hasKanji(text.slice(index, end))) ends.push(end);
    const next = text[end];
    if (!next || isPunctuation(next) || isWhitespace(next)) break;
  }
  return ends.sort((a, b) => b - a);
}

function kanjiSuffix(surface) {
  let last = -1;
  for (let index = 0; index < surface.length; index += 1) if (isKanji(surface[index])) last = index;
  return last >= 0 ? surface.slice(last + 1) : "";
}

function readingCandidates(reading, index, minVisibleLength) {
  const candidates = [];
  let end = skipSpaces(reading, index);
  let visible = "";
  const start = end;
  while (end < reading.length) {
    const char = reading[end];
    if (isPunctuation(char)) break;
    if (!isWhitespace(char)) visible += char;
    end += 1;
    if (visible.length >= minVisibleLength) candidates.push({ raw: reading.slice(start, end), text: visible, end });
  }
  return candidates;
}

function takeReadingChars(reading, index, visibleLength) {
  let end = skipSpaces(reading, index);
  let text = "";
  while (end < reading.length && text.length < visibleLength) {
    if (!isWhitespace(reading[end])) text += reading[end];
    end += 1;
  }
  return text.length === visibleLength ? { text, end } : null;
}

function skipSpaces(text, index) {
  let next = index;
  while (next < text.length && isWhitespace(text[next])) next += 1;
  return next;
}

function hasKanji(value) {
  return /[\u3400-\u9fff]/u.test(String(value || ""));
}

function isKanji(char) {
  return /[\u3400-\u9fff]/u.test(char || "");
}

function isKana(char) {
  return /[\u3040-\u30ff]/u.test(char || "");
}

function isWhitespace(char) {
  return /\s/.test(char || "");
}

function isAscii(char) {
  return /[A-Za-z0-9]/.test(char || "");
}

function isNumeric(char) {
  return /[0-9０-９]/.test(char || "");
}

function isPunctuation(char) {
  return /[。、，．,.！？!?「」『』（）()［］\[\]【】・:：;；／\/—\-]/u.test(char || "");
}

function normalizeKana(value) {
  return String(value || "").replace(/\s+/g, "").replace(/[\u30a1-\u30f6]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stripTags(value) {
  return String(value || "").replace(/<[^>]*>/g, "");
}
