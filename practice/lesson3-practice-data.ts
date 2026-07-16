import type { AnswerSource, Choice, InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";
import { lesson3ImageCrops } from "./lesson3-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson3/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit1/lesson3/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const crop = (id: string) => lesson3ImageCrops.assets.find((asset) => asset.id === id);

const p1a1Place = crop("l3-p1-a1-place-picture-practice");
const p1a1Building = crop("l3-p1-a1-building-picture-practice");
const p1a6Price = crop("l3-p1-a6-price-picture-practice");
const p2a3Stamp = crop("l3-p2-a3-stamp-picture-practice");

const sentenceSlot = (placeholder = "输入 1 个完整句子"): InputSlot[] => [
  { id: "answer", expectedUnit: "sentence", width: "long", placeholder }
];
const phraseSlot = (placeholder = "输入词语或短语"): InputSlot[] => [
  { id: "answer", expectedUnit: "phrase", width: "medium", placeholder }
];
const dialogueSlot = (placeholder = "输入完整会话", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "dialogue", width: "long", placeholder, multiline: true, rows }
];

const answer = (value: string | undefined, note?: string) => value ? { slotValues: { answer: value }, note } : note ? { note } : undefined;

const makeItem = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  value: string | undefined,
  options: {
    instruction?: string;
    promptKana?: string;
    answerSource?: AnswerSource;
    inputSlots?: InputSlot[];
    relatedAssets?: string[];
    renderHint?: PracticeItem["renderHint"];
    responseScope?: PracticeItem["responseScope"];
    responseScopeHint?: string;
    note?: string;
  } = {}
): PracticeItem => ({
  id,
  number,
  instruction: options.instruction ?? "",
  answerSource: options.answerSource || "example_transform",
  responseScope: options.responseScope,
  responseScopeHint: options.responseScopeHint,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  inputSlots: options.inputSlots || sentenceSlot(),
  answer: answer(value, options.note),
  relatedAssets: options.relatedAssets,
  renderHint: options.renderHint || "inline"
});

const choiceItem = (
  id: string,
  number: string,
  prompt: string,
  choices: string[],
  correct: string,
  options: { answerSource?: AnswerSource; relatedAssets?: string[]; instruction?: string } = {}
): PracticeItem => {
  const mapped: Choice[] = choices.map((label, index) => ({ id: `${id}-c${index + 1}`, label }));
  const selected = mapped.find((choice) => choice.label === correct);
  return {
    id,
    number,
    instruction: options.instruction || "",
    answerSource: options.answerSource || "prompt",
    responseScope: "choice_only",
    prompt: [text(prompt)],
    choices: mapped,
    answer: { choiceIds: selected ? [selected.id] : [] },
    relatedAssets: options.relatedAssets,
    renderHint: "inline"
  };
};

const dialogueItem = (
  id: string,
  number: string,
  prompt: string,
  value: string | undefined,
  options: { answerSource?: AnswerSource; relatedAssets?: string[]; rows?: number; note?: string; promptKana?: string } = {}
) => makeItem(id, number, prompt, value, {
  instruction: "",
  promptKana: options.promptKana,
  answerSource: options.answerSource || "example_transform",
  responseScope: "dialogue_only",
  inputSlots: dialogueSlot("输入完整会话", options.rows || 4),
  relatedAssets: options.relatedAssets,
  renderHint: "dialogue",
  note: options.note
});

const p1a1PlaceItems = [
  ["1", "カメラ売り場", "カメラうりば", "ここは カメラ売り場です。"],
  ["2", "靴売り場", "くつうりば", "ここは 靴売り場です。"],
  ["3", "受付", "うけつけ", "ここは 受付です。"],
  ["4", "傘売り場", "かさうりば", "ここは 傘売り場です。"],
  ["5", "かばん売り場", "かばんうりば", "ここは かばん売り場です。"]
];
const p1a1BuildingItems = [
  ["6", "コンビニ／1階", "コンビニ／いっかい", "コンビニは あの ビルの 1階です。"],
  ["7", "本屋／8階", "ほんや／はちかい", "本屋は あの ビルの 8階です。"],
  ["8", "レストラン／9階", "レストラン／きゅうかい", "レストランは あの ビルの 9階です。"],
  ["9", "事務所／3階", "じむしょ／さんかい", "事務所は あの ビルの 3階です。"]
];
const p1a2Items = [
  ["1", "図書館", "としょかん", "甲：図書館は どこですか。\n乙：あそこです。"],
  ["2", "食堂", "しょくどう", "甲：食堂は どこですか。\n乙：あそこです。"],
  ["3", "受付", "うけつけ", "甲：受付は どこですか。\n乙：あそこです。"],
  ["4", "事務所", "じむしょ", "甲：事務所は どこですか。\n乙：あそこです。"]
];
const p1a3Items = [
  ["1", "小野さんは JC企画の 社員です。（李さん）", "おのさんは ジェーシーきかくの しゃいんです。（りさん）", "李さんも JC企画の 社員です。"],
  ["2", "ここは わたしの レストランです。（そこ）", "ここは わたしの レストランです。（そこ）", "そこも わたしの レストランです。"],
  ["3", "この ビルは 病院です。（あの ビル）", "この ビルは びょういんです。（あの ビル）", "あの ビルも 病院です。"],
  ["4", "時計売り場は デパートの 7階です。（食堂）", "とけいうりばは デパートの ななかいです。（しょくどう）", "食堂も デパートの 7階です。"]
];
const p1a4Group1 = [
  ["1", "会社員／学生", "かいしゃいん／がくせい", "甲：あの 人は 会社員ですか、学生ですか。\n乙：会社員です。"],
  ["2", "フランス人／アメリカ人", "フランスじん／アメリカじん", "甲：あの 人は フランス人ですか、アメリカ人ですか。\n乙：フランス人です。"]
];
const p1a4Group2 = [
  ["3", "デパート／ホテル", "デパート／ホテル", "甲：あそこは デパートですか、ホテルですか。\n乙：デパートです。"],
  ["4", "本屋／コンビニ", "ほんや／コンビニ", "甲：あそこは 本屋ですか、コンビニですか。\n乙：本屋です。"]
];
const p1a5Items = [
  ["1", "受付／かばん売り場", "甲：すみません。受付は どこですか。\n乙：受付ですか。受付は あちらです。\n甲：かばん売り場は？\n乙：かばん売り場は 5階です。", "うけつけ／かばんうりば"],
  ["2", "エスカレーター／バーゲン会場", "甲：すみません。エスカレーターは どこですか。\n乙：エスカレーターですか。エスカレーターは あちらです。\n甲：バーゲン会場は？\n乙：バーゲン会場は 5階です。", "エスカレーター／バーゲンかいじょう"],
  ["3", "電話／カメラ売り場", "甲：すみません。電話は どこですか。\n乙：電話ですか。電話は あちらです。\n甲：カメラ売り場は？\n乙：カメラ売り場は 5階です。", "でんわ／カメラうりば"]
];
const p1a6Items = [
  ["1", "傘／2,500円", "かさ／にせんごひゃくえん", "甲：これは いくらですか。\n乙：それは 2,500円です。\n甲：あれは？\n乙：どれですか。\n甲：あの 傘です。\n乙：あれも 2,500円です。"],
  ["2", "靴／16,000円", "くつ／いちまんろくせんえん", "甲：これは いくらですか。\n乙：それは 16,000円です。\n甲：あれは？\n乙：どれですか。\n甲：あの 靴です。\n乙：あれも 16,000円です。"],
  ["3", "パソコン／114,000円", "パソコン／じゅういちまんよんせんえん", "甲：これは いくらですか。\n乙：それは 114,000円です。\n甲：あれは？\n乙：どれですか。\n甲：あの パソコンです。\n乙：あれも 114,000円です。"],
  ["4", "コート／39,800円", "コート／さんまんきゅうせんはっぴゃくえん", "甲：これは いくらですか。\n乙：それは 39,800円です。\n甲：あれは？\n乙：どれですか。\n甲：あの コートです。\n乙：あれも 39,800円です。"],
  ["5", "車／2,340,000円", "くるま／にひゃくさんじゅうよんまんえん", "甲：これは いくらですか。\n乙：それは 2,340,000円です。\n甲：あれは？\n乙：どれですか。\n甲：あの 車です。\n乙：あれも 2,340,000円です。"]
];
const p1a7Numbers = ["490", "111", "610", "20,300", "1,400", "9,030", "380", "15,700"];
const p2a1Items = [
  ["1", "あれは（　　）ですか。——病院です。", "あれは（　　）ですか。——びょういんです。", "何"],
  ["2", "受付は（　　）ですか。——あそこです。", "うけつけは（　　）ですか。——あそこです。", "どこ"],
  ["3", "森さんの 本は（　　）ですか。——これです。", "もりさんの ほんは（　　）ですか。——これです。", "どれ"],
  ["4", "その 辞書は（　　）のですか。——わたしのです。", "その じしょは（　　）のですか。——わたしのです。", "だれ"],
  ["5", "ジョンソンさんは（　　）人ですか。——あの 人です。", "ジョンソンさんは（　　）ひとですか。——あの ひとです。", "どの"]
];
const p2a2Items = [
  ["1", "ここは 郵便局です（　　）、銀行ですか。", "ここは ゆうびんきょくです（　　）、ぎんこうですか。", "か"],
  ["2", "ここは ホテルです。そこ（　　）ホテルです。", "ここは ホテルです。そこ（　　）ホテルです。", "も"],
  ["3", "この カメラ（　　）いくらですか。", "この カメラ（　　）いくらですか。", "は"],
  ["4", "レストランは デパート（　　）8階です。", "レストランは デパート（　　）はちかいです。", "の"],
  ["5", "日中商事（　　）こちらですか。", "にっちゅうしょうじ（　　）こちらですか。", "は"]
];
const p2a3ChoiceItems = [
  ["1", "听录音，选择对应的邮票编号。", "③", "270円です。どれですか。"],
  ["2", "听录音，选择对应的邮票编号。", "⑤", "100円です。どれですか。"],
  ["3", "听录音，选择对应的邮票编号。", "⑥", "420円です。どれですか。"],
  ["4", "听录音，选择对应的邮票编号。", "②", "110円です。どれですか。"],
  ["5", "听录音，选择对应的邮票编号。", "④", "350円です。どれですか。"]
];
const p2a3SumItems = [
  ["6", "①＋⑤", "190円です。"],
  ["7", "①＋③", "360円です。"],
  ["8", "④＋⑤", "450円です。"],
  ["9", "②＋⑥", "530円です。"],
  ["10", "③＋④", "620円です。"]
];

const activities: PracticeActivity[] = [
  {
    id: "l3-p1-a1",
    section: "practice_1",
    order: 1,
    title: "看图，仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [...(p1a1Place ? [p1a1Place] : []), ...(p1a1Building ? [p1a1Building] : [])],
    layout: [],
    itemGroups: [
      {
        id: "l3-p1-a1-g1",
        displayAssets: ["l3-p1-a1-place-picture-practice"],
        example: {
          id: "l3-p1-a1-ex1",
          label: "[例1]",
          beforeParts: [repl("食堂", "place", { kana: "しょくどう" })],
          beforeKana: "しょくどう",
          after: [text("ここは "), repl("食堂", "place", { kana: "しょくどう" }), text("です。")],
          afterKana: "ここは しょくどうです。"
        },
        items: p1a1PlaceItems.map(([number, prompt, promptKana, value]) => makeItem(`l3-p1-a1-q${number}`, number, prompt, value, {
          instruction: "",
          promptKana,
          responseScope: "sentence_only",
          relatedAssets: ["l3-p1-a1-place-picture-practice"]
        }))
      },
      {
        id: "l3-p1-a1-g2",
        displayAssets: ["l3-p1-a1-building-picture-practice"],
        example: {
          id: "l3-p1-a1-ex2",
          label: "[例2]",
          beforeParts: [repl("銀行", "place", { kana: "ぎんこう" }), text("／"), repl("1階", "floor", { kana: "いっかい" })],
          beforeKana: "ぎんこう／いっかい",
          after: [repl("銀行", "place", { kana: "ぎんこう" }), text("は あの ビルの "), repl("1階", "floor", { kana: "いっかい" }), text("です。")],
          afterKana: "ぎんこうは あの ビルの いっかいです。"
        },
        items: p1a1BuildingItems.map(([number, prompt, promptKana, value]) => makeItem(`l3-p1-a1-q${number}`, number, prompt, value, {
          instruction: "",
          promptKana,
          responseScope: "sentence_only",
          relatedAssets: ["l3-p1-a1-building-picture-practice"]
        }))
      }
    ],
    items: []
  },
  {
    id: "l3-p1-a2",
    section: "practice_1",
    order: 2,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    layout: [{
      type: "dialogue",
      lines: [
        { speaker: "甲", parts: [repl("トイレ", "place"), text("は どこですか。")], kana: "トイレは どこですか。" },
        { speaker: "乙", parts: [text("あそこです。")], kana: "あそこです。" }
      ]
    }],
    items: p1a2Items.map(([number, prompt, promptKana, value]) => dialogueItem(`l3-p1-a2-q${number}`, number, prompt, value, { promptKana }))
  },
  {
    id: "l3-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句用（　　）中的词语练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [{
      type: "example",
      content: {
        label: "[例]",
        beforeParts: [text("李さんは ", { kana: "りさんは" }), repl("中国人", "predicate", { kana: "ちゅうごくじん" }), text("です。（"), repl("張さん", "subject", { kana: "ちょうさん" }), text("）")],
        beforeKana: "りさんは ちゅうごくじんです。（ちょうさん）",
        after: [repl("張さん", "subject", { kana: "ちょうさん" }), text("も "), repl("中国人", "predicate", { kana: "ちゅうごくじん" }), text("です。")],
        afterKana: "ちょうさんも ちゅうごくじんです。"
      }
    }],
    items: p1a3Items.map(([number, prompt, promptKana, value]) => makeItem(`l3-p1-a3-q${number}`, number, prompt, value, {
      instruction: "",
      promptKana,
      responseScope: "sentence_only"
    }))
  },
  {
    id: "l3-p1-a4",
    section: "practice_1",
    order: 4,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    layout: [],
    itemGroups: [
      {
        id: "l3-p1-a4-g1",
        example: {
          id: "l3-p1-a4-ex1",
          label: "[例1]",
          beforeParts: [repl("中国人", "choiceA", { kana: "ちゅうごくじん" }), text("／"), repl("韓国人", "choiceB", { kana: "かんこくじん" })],
          beforeKana: "ちゅうごくじん／かんこくじん",
          after: [text("甲：あの 人は 中国人ですか、韓国人ですか。\n乙：中国人です。")],
          afterKana: "こう：あの ひとは ちゅうごくじんですか、かんこくじんですか。\nおつ：ちゅうごくじんです。"
        },
        items: p1a4Group1.map(([number, prompt, promptKana, value]) => dialogueItem(`l3-p1-a4-q${number}`, number, prompt, value, { promptKana }))
      },
      {
        id: "l3-p1-a4-g2",
        example: {
          id: "l3-p1-a4-ex2",
          label: "[例2]",
          beforeParts: [repl("郵便局", "choiceA", { kana: "ゆうびんきょく" }), text("／"), repl("銀行", "choiceB", { kana: "ぎんこう" })],
          beforeKana: "ゆうびんきょく／ぎんこう",
          after: [text("甲：あそこは 郵便局ですか、銀行ですか。\n乙：郵便局です。")],
          afterKana: "こう：あそこは ゆうびんきょくですか、ぎんこうですか。\nおつ：ゆうびんきょくです。"
        },
        items: p1a4Group2.map(([number, prompt, promptKana, value]) => dialogueItem(`l3-p1-a4-q${number}`, number, prompt, value, { promptKana }))
      }
    ],
    items: []
  },
  {
    id: "l3-p1-a5",
    section: "practice_1",
    order: 5,
    title: "听录音，仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 5),
      label: "练习 I · 5 教材录音",
      transcript: {
        text: "トイレ。食堂。すみません。トイレはどこですか。トイレですか。トイレはあちらです。食堂は。食堂は5階です。受付。かばん売り場。すみません。受付はどこですか。受付ですか。受付はあちらです。かばん売り場は。かばん売り場は5階です。エスカレーター。バーゲン会場。すみません。エスカレーターはどこですか。エスカレーターですか。エスカレーターはあちらです。バーゲン会場は。バーゲン会場は5階です。電話。カメラ売り場。すみません。電話はどこですか。電話ですか。電話はあちらです。カメラ売り場。",
        source: "asr",
        confidenceNote: "Azure ASR 末尾漏识别第 3 小题的追问回答；音频模式与前两小题一致，答案按录音模式和例句补全。",
        segments: [
          { itemNumber: "例", speaker: "甲/乙", text: "すみません。トイレはどこですか。トイレですか。トイレはあちらです。食堂は。食堂は5階です。" },
          { itemNumber: "1", speaker: "甲/乙", text: "すみません。受付はどこですか。受付ですか。受付はあちらです。かばん売り場は。かばん売り場は5階です。" },
          { itemNumber: "2", speaker: "甲/乙", text: "すみません。エスカレーターはどこですか。エスカレーターですか。エスカレーターはあちらです。バーゲン会場は。バーゲン会場は5階です。" },
          { itemNumber: "3", speaker: "甲/乙", text: "すみません。電話はどこですか。電話ですか。電話はあちらです。カメラ売り場は。カメラ売り場は5階です。" }
        ]
      }
    },
    layout: [{
      type: "dialogue",
      lines: [
        { speaker: "甲", parts: [text("すみません。"), repl("トイレ", "placeA"), text("は どこですか。")], kana: "すみません。トイレは どこですか。" },
        { speaker: "乙", parts: [repl("トイレ", "placeA"), text("ですか。"), repl("トイレ", "placeA"), text("は あちらです。")], kana: "トイレですか。トイレは あちらです。" },
        { speaker: "甲", parts: [repl("食堂", "placeB", { kana: "しょくどう" }), text("は？")], kana: "しょくどうは？" },
        { speaker: "乙", parts: [repl("食堂", "placeB", { kana: "しょくどう" }), text("は 5階です。")], kana: "しょくどうは ごかいです。" }
      ]
    }],
    items: p1a5Items.map(([number, prompt, value, promptKana]) => dialogueItem(`l3-p1-a5-q${number}`, number, prompt, value, {
      answerSource: "audio",
      promptKana,
      rows: 5,
      note: number === "3" ? "ASR 末尾漏字；答案按录音题固定模式和例句补全。" : undefined
    }))
  },
  {
    id: "l3-p1-a6",
    section: "practice_1",
    order: 6,
    title: "看图，仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    assets: [...(p1a6Price ? [p1a6Price] : [])],
    displayAssets: ["l3-p1-a6-price-picture-practice"],
    layout: [{
      type: "dialogue",
      lines: [
        { speaker: "甲", parts: [text("これは いくらですか。")], kana: "これは いくらですか。" },
        { speaker: "乙", parts: [text("それは "), repl("8,900円", "price", { kana: "はっせんきゅうひゃくえん" }), text("です。")], kana: "それは はっせんきゅうひゃくえんです。" },
        { speaker: "甲", parts: [text("あれは？")], kana: "あれは？" },
        { speaker: "乙", parts: [text("どれですか。")], kana: "どれですか。" },
        { speaker: "甲", parts: [text("あの "), repl("かばん", "object"), text("です。")], kana: "あの かばんです。" },
        { speaker: "乙", parts: [text("あれも "), repl("8,900円", "price", { kana: "はっせんきゅうひゃくえん" }), text("です。")], kana: "あれも はっせんきゅうひゃくえんです。" }
      ]
    }],
    items: p1a6Items.map(([number, prompt, promptKana, value]) => dialogueItem(`l3-p1-a6-q${number}`, number, prompt, value, {
      promptKana,
      relatedAssets: ["l3-p1-a6-price-picture-practice"],
      rows: 6
    }))
  },
  {
    id: "l3-p1-a7",
    section: "practice_1",
    order: 7,
    title: "听录音，反复练习。",
    instruction: "",
    interaction: "listening_repeat",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 7),
      label: "练习 I · 7 教材录音",
      transcript: {
        text: "490。111。610。20,300。1,400。9,030。380。15,700。",
        source: "asr",
        confidenceNote: "Azure ASR 重复读数，已按教材编号清理为 8 个数字。",
        segments: p1a7Numbers.map((value, index) => ({ itemNumber: String(index + 1), text: value }))
      }
    },
    layout: [],
    items: p1a7Numbers.map((value, index) => makeItem(`l3-p1-a7-q${index + 1}`, String(index + 1), "听录音，写出数字。", value, {
      answerSource: "audio",
      responseScope: "phrase_only",
      inputSlots: [{ id: "answer", expectedUnit: "number", width: "medium", placeholder: "输入数字" }]
    }))
  },
  {
    id: "l3-p2-a1",
    section: "practice_2",
    order: 1,
    title: "从□□□中选择适当的词语填入（　　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [
      { type: "example", content: { label: "[例]", beforeParts: [text("（　ここ　）は 銀行ですか。", { kana: "（　ここ　）は ぎんこうですか。" })], beforeKana: "（　ここ　）は ぎんこうですか。", after: [text("はい、そうです。")], afterKana: "はい、そうです。" } },
      { type: "word_bank", words: ["何", "どれ", "だれ", "どの", "どこ", "そこ"].map((word) => text(word, word === "何" ? { kana: "なん" } : {})) }
    ],
    items: p2a1Items.map(([number, prompt, promptKana, value]) => makeItem(`l3-p2-a1-q${number}`, number, prompt, value, {
      promptKana,
      answerSource: "prompt",
      responseScope: "word_only",
      inputSlots: phraseSlot("输入词框中的词")
    }))
  },
  {
    id: "l3-p2-a2",
    section: "practice_2",
    order: 2,
    title: "在（　　）中填入一个平假名。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [{
      type: "example",
      content: { label: "[例]", beforeParts: [text("ここ（　は　）デパートです。")], beforeKana: "ここ（　は　）デパートです。", after: [text("ここ は デパートです。")], afterKana: "ここ は デパートです。" }
    }],
    items: p2a2Items.map(([number, prompt, promptKana, value]) => makeItem(`l3-p2-a2-q${number}`, number, prompt, value, {
      promptKana,
      answerSource: "prompt",
      responseScope: "word_only",
      inputSlots: phraseSlot("输入 1 个假名")
    }))
  },
  {
    id: "l3-p2-a3",
    section: "practice_2",
    order: 3,
    title: "边看图边听录音，回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "choice",
    responseScope: "custom",
    responseScopeHint: "第 1-5 题选择邮票编号；第 6-10 题填写合计金额。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "练习 II · 3 教材录音",
      transcript: {
        text: "90円です。どれですか。270円です。どれですか。100円です。どれですか。420円です。どれですか。110円です。どれですか。350円です。どれですか。いくらですか。200円です。",
        source: "asr",
        confidenceNote: "Azure ASR 含序号噪声，已根据图片价格和教材例题切分。",
        segments: [
          { itemNumber: "例1", text: "90円です。どれですか。" },
          ...p2a3ChoiceItems.map(([number, , , audioText]) => ({ itemNumber: number, text: audioText })),
          { itemNumber: "例2", text: "いくらですか。200円です。" },
          ...p2a3SumItems.map(([number, prompt, value]) => ({ itemNumber: number, text: `${prompt}。${value}` }))
        ]
      }
    },
    assets: [...(p2a3Stamp ? [p2a3Stamp] : [])],
    displayAssets: ["l3-p2-a3-stamp-picture-practice"],
    layout: [],
    itemGroups: [
      {
        id: "l3-p2-a3-g1",
        example: { label: "[例1]", beforeParts: [text("90円です。どれですか。", { kana: "きゅうじゅうえんです。どれですか。" })], beforeKana: "きゅうじゅうえんです。どれですか。", after: [text("①")] },
        items: p2a3ChoiceItems.map(([number, prompt, correct]) => choiceItem(`l3-p2-a3-q${number}`, number, prompt, ["①", "②", "③", "④", "⑤", "⑥"], correct, {
          answerSource: "audio",
          relatedAssets: ["l3-p2-a3-stamp-picture-practice"]
        }))
      },
      {
        id: "l3-p2-a3-g2",
        example: { label: "[例2]", beforeParts: [text("いくらですか。①＋②")], beforeKana: "いくらですか。①＋②", after: [text("200円です。", { kana: "にひゃくえんです。" })], afterKana: "にひゃくえんです。" },
        items: p2a3SumItems.map(([number, prompt, value]) => makeItem(`l3-p2-a3-q${number}`, number, prompt, value, {
          answerSource: "audio",
          responseScope: "phrase_only",
          relatedAssets: ["l3-p2-a3-stamp-picture-practice"],
          inputSlots: phraseSlot("输入金额")
        }))
      }
    ],
    items: []
  },
  {
    id: "l3-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      makeItem("l3-p2-a4-q1", "1", "厕所在哪儿？", "トイレは どこですか。", { answerSource: "prompt" }),
      makeItem("l3-p2-a4-q2", "2", "这里是邮局还是银行？", "ここは 郵便局ですか、銀行ですか。", { answerSource: "prompt" }),
      makeItem("l3-p2-a4-q3", "3", "这个多少钱？", "これは いくらですか。", { answerSource: "prompt" })
    ]
  }
];

export const lesson3Practice: LessonPractice = {
  lessonId: "lesson3",
  title: "第3课 ここは デパートです",
  sourcePages: [
    { pageNo: 48, imagePath: page(48) },
    { pageNo: 49, imagePath: page(49) },
    { pageNo: 50, imagePath: page(50) }
  ],
  activities
};
