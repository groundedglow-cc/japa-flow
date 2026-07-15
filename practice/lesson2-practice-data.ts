import type { Choice, InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, ResponseScope, RichText } from "./lesson-practice-types";
import { lesson2ImageCrops } from "./lesson2-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson2/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit1/lesson2/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const crop = (id: string) => lesson2ImageCrops.assets.find((asset) => asset.id === id)!;

const sentenceSlot = (placeholder = "输入 1 个完整句子"): InputSlot[] => [
  { id: "answer", expectedUnit: "sentence", width: "long", placeholder }
];
const wordSlot = (placeholder = "输入词语"): InputSlot[] => [
  { id: "answer", expectedUnit: "word", width: "short", placeholder }
];
const dialogueSlot = (placeholder = "输入完整会话", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "dialogue", width: "long", placeholder, multiline: true, rows }
];

const answerItem = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  answer: string,
  options: {
    promptKana?: string;
    answerSource?: "prompt" | "audio" | "example_transform" | "personal";
    inputSlots?: InputSlot[];
    renderHint?: PracticeItem["renderHint"];
    responseScope?: ResponseScope;
    responseScopeHint?: string;
    relatedAssets?: string[];
    note?: string;
  } = {}
): PracticeItem => ({
  id,
  number,
  instruction: "",
  answerSource: options.answerSource || "example_transform",
  responseScope: options.responseScope,
  responseScopeHint: options.responseScopeHint,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  inputSlots: options.inputSlots || (options.renderHint === "dialogue" ? dialogueSlot() : sentenceSlot()),
  answer: { slotValues: { answer }, note: options.note },
  relatedAssets: options.relatedAssets,
  renderHint: options.renderHint || "inline"
});

const choiceItem = (
  id: string,
  number: string,
  prompt: string,
  choices: string[],
  correct: string,
  promptKana: string
): PracticeItem => {
  const mapped: Choice[] = choices.map((label, index) => ({ id: `${id}-c${index + 1}`, label }));
  const selected = mapped.find((choice) => choice.label === correct);
  return {
    id,
    number,
    instruction: "",
    answerSource: "audio",
    responseScope: "choice_only",
    prompt: [text(prompt)],
    promptKana,
    choices: mapped,
    answer: { choiceIds: selected ? [selected.id] : [] },
    renderHint: "inline"
  };
};

const dialogueItem = (
  id: string,
  number: string,
  prompt: string,
  answer: string,
  promptKana: string,
  options: {
    answerSource?: "prompt" | "audio" | "example_transform";
    relatedAssets?: string[];
    note?: string;
    rows?: number;
  } = {}
) => answerItem(id, number, prompt, answer, {
  promptKana,
  answerSource: options.answerSource || "example_transform",
  inputSlots: dialogueSlot("输入完整会话", options.rows || 4),
  renderHint: "dialogue",
  responseScope: "dialogue_only",
  relatedAssets: options.relatedAssets,
  note: options.note
});

const p1a1Picture = crop("l2-p1-a1-picture-practice");
const p1a4Picture = crop("l2-p1-a4-picture-practice");
const p2a4Picture = crop("l2-p2-a4-picture-practice");

const p1a1Items = [
  ["1", "かばん", "これは かばんです。", "かばん"],
  ["2", "いす", "これは いすです。", "いす"],
  ["3", "机", "これは 机です。", "つくえ"],
  ["4", "新聞", "これは 新聞です。", "しんぶん"],
  ["5", "鉛筆", "これは 鉛筆です。", "えんぴつ"],
  ["6", "雑誌", "これは 雑誌です。", "ざっし"],
  ["7", "辞書", "これは 辞書です。", "じしょ"],
  ["8", "電話", "これは 電話です。", "でんわ"],
  ["9", "カメラ", "これは カメラです。", "カメラ"]
] as const;

const p1a2Items = [
  ["1", "李さん", "それは 李さんの パソコンでは ありません。", "りさん"],
  ["2", "スミスさん", "それは スミスさんの パソコンでは ありません。", "スミスさん"],
  ["3", "わたし", "それは わたしの パソコンでは ありません。", "わたし"],
  ["4", "会社", "それは 会社の パソコンでは ありません。", "かいしゃ"]
] as const;

const p1a3Groups = [
  {
    id: "l2-p1-a3-g1",
    example: {
      label: "[例1]",
      before: "テレビ",
      beforeKana: "テレビ",
      after: [text("甲：それは "), repl("テレビ", "object"), text("ですか。 乙：はい、これは "), repl("テレビ", "object"), text("です。")],
      afterKana: "こう：それは テレビですか。 おつ：はい、これは テレビです。"
    },
    items: [
      ["1", "鉛筆", "甲：それは 鉛筆ですか。\n乙：はい、これは 鉛筆です。", "えんぴつ"],
      ["2", "ノート", "甲：それは ノートですか。\n乙：はい、これは ノートです。", "ノート"],
      ["3", "新聞", "甲：それは 新聞ですか。\n乙：はい、これは 新聞です。", "しんぶん"],
      ["4", "小野さんの 傘", "甲：それは 小野さんの 傘ですか。\n乙：はい、これは 小野さんの 傘です。", "おのさんの かさ"]
    ]
  },
  {
    id: "l2-p1-a3-g2",
    example: {
      label: "[例2]",
      before: "雑誌／辞書",
      beforeKana: "ざっし／じしょ",
      after: [text("甲：あれは "), repl("雑誌", "wrongObject", { kana: "ざっし" }), text("ですか。 乙：いいえ、あれは "), repl("雑誌", "wrongObject", { kana: "ざっし" }), text("では ありません。"), repl("辞書", "object", { kana: "じしょ" }), text("です。")],
      afterKana: "こう：あれは ざっしですか。 おつ：いいえ、あれは ざっしでは ありません。じしょです。"
    },
    items: [
      ["5", "机／いす", "甲：あれは 机ですか。\n乙：いいえ、あれは 机では ありません。いすです。", "つくえ／いす"],
      ["6", "テレビ／パソコン", "甲：あれは テレビですか。\n乙：いいえ、あれは テレビでは ありません。パソコンです。", "テレビ／パソコン"],
      ["7", "森さんの 車／社長の 車", "甲：あれは 森さんの 車ですか。\n乙：いいえ、あれは 森さんの 車では ありません。社長の 車です。", "もりさんの くるま／しゃちょうの くるま"]
    ]
  },
  {
    id: "l2-p1-a3-g3",
    example: {
      label: "[例3]",
      before: "シルクの ハンカチ",
      beforeKana: "シルクの ハンカチ",
      after: [text("甲：それは 何ですか。 乙：これは "), repl("シルクの ハンカチ", "object"), text("です。")],
      afterKana: "こう：それは なんですか。 おつ：これは シルクの ハンカチです。"
    },
    items: [
      ["8", "中国語の 辞書", "甲：それは 何ですか。\n乙：これは 中国語の 辞書です。", "ちゅうごくごの じしょ"],
      ["9", "雑誌", "甲：それは 何ですか。\n乙：これは 雑誌です。", "ざっし"],
      ["10", "カメラ", "甲：それは 何ですか。\n乙：これは カメラです。", "カメラ"],
      ["11", "家族の 写真", "甲：それは 何ですか。\n乙：これは 家族の 写真です。", "かぞくの しゃしん"]
    ]
  }
] as const;

const p1a4Items = [
  ["1", "かばん", "甲：それは 何ですか。\n乙：これは かばんです。", "かばん"],
  ["2", "靴", "甲：それは 何ですか。\n乙：これは 靴です。", "くつ"],
  ["3", "傘", "甲：それは 何ですか。\n乙：これは 傘です。", "かさ"],
  ["4", "雑誌", "甲：あれは 何ですか。\n乙：あれは 雑誌です。", "ざっし"],
  ["5", "ラジオ", "甲：あれは 何ですか。\n乙：あれは ラジオです。", "ラジオ"],
  ["6", "時計", "甲：あれは 何ですか。\n乙：あれは 時計です。", "とけい"]
] as const;

const activities: PracticeActivity[] = [
  {
    id: "l2-p1-a1",
    section: "practice_1",
    order: 1,
    title: "看图，仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [p1a1Picture],
    displayAssets: ["l2-p1-a1-picture-practice"],
    layout: [{
      type: "example",
      content: {
        label: "[例]",
        before: "テレビ",
        beforeKana: "テレビ",
        after: [text("これは "), repl("テレビ", "object"), text("です。")],
        afterKana: "これは テレビです。"
      }
    }],
    items: p1a1Items.map(([number, prompt, answer, promptKana]) => answerItem(`l2-p1-a1-q${number}`, number, prompt, answer, {
      promptKana,
      responseScope: "sentence_only",
      relatedAssets: ["l2-p1-a1-picture-practice"]
    }))
  },
  {
    id: "l2-p1-a2",
    section: "practice_1",
    order: 2,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [{
      type: "example",
      content: {
        label: "[例]",
        before: "森さん",
        beforeKana: "もりさん",
        after: [text("それは "), repl("森さん", "owner", { kana: "もりさん" }), text("の パソコンでは ありません。")],
        afterKana: "それは もりさんの パソコンでは ありません。"
      }
    }],
    items: p1a2Items.map(([number, prompt, answer, promptKana]) => answerItem(`l2-p1-a2-q${number}`, number, prompt, answer, {
      promptKana,
      responseScope: "sentence_only"
    }))
  },
  {
    id: "l2-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    layout: [],
    itemGroups: p1a3Groups.map((group) => ({
      id: group.id,
      example: group.example,
      items: group.items.map(([number, prompt, answer, promptKana]) =>
        dialogueItem(`l2-p1-a3-q${number}`, number, prompt, answer, promptKana)
      )
    })),
    items: []
  },
  {
    id: "l2-p1-a4",
    section: "practice_1",
    order: 4,
    title: "看图，仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    assets: [p1a4Picture],
    displayAssets: ["l2-p1-a4-picture-practice"],
    layout: [],
    itemGroups: [
      {
        id: "l2-p1-a4-g1",
        example: {
          label: "[例1]",
          before: "カメラ",
          beforeKana: "カメラ",
          after: [text("甲：それは 何ですか。 乙：これは "), repl("カメラ", "object"), text("です。")],
          afterKana: "こう：それは なんですか。 おつ：これは カメラです。"
        },
        items: p1a4Items.slice(0, 3).map(([number, prompt, answer, promptKana]) =>
          dialogueItem(`l2-p1-a4-q${number}`, number, prompt, answer, promptKana, { relatedAssets: ["l2-p1-a4-picture-practice"] })
        )
      },
      {
        id: "l2-p1-a4-g2",
        example: {
          label: "[例2]",
          before: "新聞",
          beforeKana: "しんぶん",
          after: [text("甲：あれは 何ですか。 乙：あれは "), repl("新聞", "object", { kana: "しんぶん" }), text("です。")],
          afterKana: "こう：あれは なんですか。 おつ：あれは しんぶんです。"
        },
        items: p1a4Items.slice(3).map(([number, prompt, answer, promptKana]) =>
          dialogueItem(`l2-p1-a4-q${number}`, number, prompt, answer, promptKana, { relatedAssets: ["l2-p1-a4-picture-practice"] })
        )
      }
    ],
    items: []
  },
  {
    id: "l2-p1-a5",
    section: "practice_1",
    order: 5,
    title: "仿照例句在录音所说的内容上画○，并反复练习。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 5),
      transcript: {
        text: "これは テレビです。これは 机の 鍵です。これは わたしの 傘では ありません。あれは だれの かばんですか。その 手帳は スミスさんのでは ありません。",
        source: "asr",
        confidenceNote: "ASR 混入 T / ああ / 三 / 数 等噪声标记，已按教材例句和 4 个小题规范化切分。",
        segments: [
          { itemNumber: "例", text: "これは テレビです。" },
          { itemNumber: "1", text: "これは 机の 鍵です。" },
          { itemNumber: "2", text: "これは わたしの 傘では ありません。" },
          { itemNumber: "3", text: "あれは だれの かばんですか。" },
          { itemNumber: "4", text: "その 手帳は スミスさんのでは ありません。" }
        ]
      }
    },
    layout: [{
      type: "example",
      content: {
        label: "[例]",
        before: "これは { テレビ・カメラ } です。",
        beforeKana: "これは { テレビ・カメラ } です。",
        after: [text("これは "), repl("テレビ", "object"), text("です。")],
        afterKana: "これは テレビです。"
      }
    }],
    items: [
      choiceItem("l2-p1-a5-q1", "1", "これは { 車・机 } の かぎです。", ["車", "机"], "机", "これは { くるま・つくえ } の かぎです。"),
      choiceItem("l2-p1-a5-q2", "2", "これは { 森さん・わたし } の 傘では ありません。", ["森さん", "わたし"], "わたし", "これは { もりさん・わたし } の かさでは ありません。"),
      choiceItem("l2-p1-a5-q3", "3", "あれは { だれ・何 } の かばんですか。", ["だれ", "何"], "だれ", "あれは { だれ・なん } の かばんですか。"),
      choiceItem("l2-p1-a5-q4", "4", "その 手帳は スミスさんの { です・では ありません }。", ["です", "では ありません"], "では ありません", "その てちょうは スミスさんの { です・では ありません }。")
    ]
  },
  {
    id: "l2-p1-a6",
    section: "practice_1",
    order: 6,
    title: "听录音，仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 6),
      transcript: {
        text: "傘。かばん。これは あなたの 傘ですか。いいえ、わたしのでは ありません。この かばんは？あっ、それは わたしのです。本。辞書。これは あなたの 本ですか。いいえ、わたしのでは ありません。この 辞書は？あっ、それは わたしのです。ラジオ。カメラ。これは あなたの ラジオですか。いいえ、わたしのでは ありません。この カメラは？あっ、それは わたしのです。かぎ。新聞。これは あなたの かぎですか。いいえ、わたしのでは ありません。この 新聞は？あっ、それは わたしのです。",
        source: "asr",
        confidenceNote: "ASR 把 本/辞書/カメラ/かぎ 等识别为噪声或错字，并在第 3 小题尾部截断；答案按教材给出的替换词、录音模式和例句补全。",
        segments: [
          { itemNumber: "例", text: "傘。かばん。これは あなたの 傘ですか。いいえ、わたしのでは ありません。この かばんは？あっ、それは わたしのです。" },
          { itemNumber: "1", text: "本。辞書。これは あなたの 本ですか。いいえ、わたしのでは ありません。この 辞書は？あっ、それは わたしのです。" },
          { itemNumber: "2", text: "ラジオ。カメラ。これは あなたの ラジオですか。いいえ、わたしのでは ありません。この カメラは？あっ、それは わたしのです。" },
          { itemNumber: "3", text: "かぎ。新聞。これは あなたの かぎですか。いいえ、わたしのでは ありません。この 新聞は？あっ、それは わたしのです。" }
        ]
      }
    },
    layout: [{
      type: "example",
      content: {
        label: "[例]",
        before: "傘／かばん",
        beforeKana: "かさ／かばん",
        after: [text("甲：これは あなたの "), repl("傘", "first", { kana: "かさ" }), text("ですか。 乙：いいえ、わたしのでは ありません。 甲：この "), repl("かばん", "second"), text("は？ 乙：あっ、それは わたしのです。")],
        afterKana: "こう：これは あなたの かさですか。 おつ：いいえ、わたしのでは ありません。 こう：この かばんは？ おつ：あっ、それは わたしのです。"
      }
    }],
    items: [
      dialogueItem("l2-p1-a6-q1", "1", "本／辞書", "甲：これは あなたの 本ですか。\n乙：いいえ、わたしのでは ありません。\n甲：この 辞書は？\n乙：あっ、それは わたしのです。", "ほん／じしょ", { answerSource: "audio", rows: 5 }),
      dialogueItem("l2-p1-a6-q2", "2", "ラジオ／カメラ", "甲：これは あなたの ラジオですか。\n乙：いいえ、わたしのでは ありません。\n甲：この カメラは？\n乙：あっ、それは わたしのです。", "ラジオ／カメラ", { answerSource: "audio", rows: 5 }),
      dialogueItem("l2-p1-a6-q3", "3", "かぎ／新聞", "甲：これは あなたの かぎですか。\n乙：いいえ、わたしのでは ありません。\n甲：この 新聞は？\n乙：あっ、それは わたしのです。", "かぎ／しんぶん", {
        answerSource: "audio",
        rows: 5,
        note: "ASR 尾部漏字，答案按教材替换词、录音模式和例句补全。"
      })
    ]
  },
  {
    id: "l2-p2-a1",
    section: "practice_2",
    order: 1,
    title: "在（　）中填入适当的词语。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [{
      type: "example",
      content: {
        label: "[例]",
        before: "それは（　何　）ですか。——これは パソコンです。",
        beforeKana: "それは（　なん　）ですか。——これは パソコンです。",
        after: [text("何", { kana: "なん" })]
      }
    }],
    items: [
      answerItem("l2-p2-a1-q1", "1", "あれは（　　）の かばんですか。——森さんの かばんです。", "だれ", { promptKana: "あれは（　　）の かばんですか。——もりさんの かばんです。", inputSlots: wordSlot(), responseScope: "word_only" }),
      answerItem("l2-p2-a1-q2", "2", "李さんの 傘は（　　）ですか。——あれです。", "どれ", { promptKana: "りさんの かさは（　　）ですか。——あれです。", inputSlots: wordSlot(), responseScope: "word_only" }),
      answerItem("l2-p2-a1-q3", "3", "この 本は（　　）のですか。——わたしのです。", "だれ", { promptKana: "この ほんは（　　）のですか。——わたしのです。", inputSlots: wordSlot(), responseScope: "word_only" }),
      answerItem("l2-p2-a1-q4", "4", "（　　）かばんですか。——あの かばんです。", "どの", { promptKana: "（　　）かばんですか。——あの かばんです。", inputSlots: wordSlot(), responseScope: "word_only" })
    ]
  },
  {
    id: "l2-p2-a2",
    section: "practice_2",
    order: 2,
    title: "在（　）中填入一个平假名。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [{
      type: "example",
      content: {
        label: "[例]",
        before: "これ（　は　）本です。",
        beforeKana: "これ（　は　）ほんです。",
        after: [text("は")]
      }
    }],
    items: [
      answerItem("l2-p2-a2-q1", "1", "その ノートは だれ（　　）ですか。", "の", { promptKana: "その ノートは だれ（　　）ですか。", inputSlots: wordSlot("输入 1 个平假名"), responseScope: "word_only" }),
      answerItem("l2-p2-a2-q2", "2", "田中さんの 車（　　）どれですか。", "は", { promptKana: "たなかさんの くるま（　　）どれですか。", inputSlots: wordSlot("输入 1 个平假名"), responseScope: "word_only" }),
      answerItem("l2-p2-a2-q3", "3", "吉田さん（　　）43 歳です。", "は", { promptKana: "よしださん（　　）よんじゅうさんさいです。", inputSlots: wordSlot("输入 1 个平假名"), responseScope: "word_only" }),
      answerItem("l2-p2-a2-q4", "4", "これは 中国語の 辞書で（　　）ありません。", "は", { promptKana: "これは ちゅうごくごの じしょで（　　）ありません。", inputSlots: wordSlot("输入 1 个平假名"), responseScope: "word_only" })
    ]
  },
  {
    id: "l2-p2-a3",
    section: "practice_2",
    order: 3,
    title: "参照答句，写出疑问句。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [{
      type: "example",
      content: {
        label: "[例]",
        before: "（　それは 何ですか。　）——これは 本です。",
        beforeKana: "（　それは なんですか。　）——これは ほんです。",
        after: [text("それは 何ですか。", { kana: "それは なんですか。" })]
      }
    }],
    items: [
      answerItem("l2-p2-a3-q1", "1", "（　　）——それは 李さんの 辞書です。", "それは だれの 辞書ですか。", { promptKana: "（　　）——それは りさんの じしょです。", responseScope: "sentence_only" }),
      answerItem("l2-p2-a3-q2", "2", "（　　）——その ノートは 田中さんのです。", "その ノートは だれのですか。", { promptKana: "（　　）——その ノートは たなかさんのです。", responseScope: "sentence_only" }),
      answerItem("l2-p2-a3-q3", "3", "（　　）——いいえ、これは 雑誌では ありません。", "これは 雑誌ですか。", { promptKana: "（　　）——いいえ、これは ざっしでは ありません。", responseScope: "sentence_only" }),
      answerItem("l2-p2-a3-q4", "4", "（　　）——はい、あれは 林さんの 車です。", "あれは 林さんの 車ですか。", { promptKana: "（　　）——はい、あれは はやしさんの くるまです。", responseScope: "sentence_only" })
    ]
  },
  {
    id: "l2-p2-a4",
    section: "practice_2",
    order: 4,
    title: "边看图边听录音，回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: "只填写对录音提问的回答部分。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 4),
      transcript: {
        text: "これは 雑誌ですか。いいえ、雑誌では ありません。辞書です。それは テレビですか。それは ノートですか。これは 田中さんの 傘ですか。これは あなたの カメラですか。",
        source: "asr",
        confidenceNote: "ASR 混入 D / いい / R / 三 等序号噪声；提问按教材例句和 4 个小题规范化切分。",
        segments: [
          { itemNumber: "例", text: "これは 雑誌ですか。いいえ、雑誌では ありません。辞書です。" },
          { itemNumber: "1", text: "それは テレビですか。" },
          { itemNumber: "2", text: "それは ノートですか。" },
          { itemNumber: "3", text: "これは 田中さんの 傘ですか。" },
          { itemNumber: "4", text: "これは あなたの カメラですか。" }
        ]
      }
    },
    assets: [p2a4Picture],
    displayAssets: ["l2-p2-a4-picture-practice"],
    layout: [{
      type: "example",
      content: {
        label: "[例]",
        before: "これは 雑誌ですか。",
        beforeKana: "これは ざっしですか。",
        after: [text("いいえ、雑誌では ありません。辞書です。", { kana: "いいえ、ざっしでは ありません。じしょです。" })]
      }
    }],
    items: [
      answerItem("l2-p2-a4-q1", "1", "听录音问题并根据图回答。", "いいえ、テレビでは ありません。ラジオです。", { answerSource: "audio", responseScope: "answer_only", relatedAssets: ["l2-p2-a4-picture-practice"] }),
      answerItem("l2-p2-a4-q2", "2", "听录音问题并根据图回答。", "いいえ、ノートでは ありません。本です。", { answerSource: "audio", responseScope: "answer_only", relatedAssets: ["l2-p2-a4-picture-practice"] }),
      answerItem("l2-p2-a4-q3", "3", "听录音问题并根据图回答。", "いいえ、田中さんの 傘では ありません。小野さんの 傘です。", { answerSource: "audio", responseScope: "answer_only", relatedAssets: ["l2-p2-a4-picture-practice"] }),
      answerItem("l2-p2-a4-q4", "4", "听录音问题并根据图回答。", "いいえ、わたしのでは ありません。長島さんの カメラです。", { answerSource: "audio", responseScope: "answer_only", relatedAssets: ["l2-p2-a4-picture-practice"] })
    ]
  },
  {
    id: "l2-p2-a5",
    section: "practice_2",
    order: 5,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l2-p2-a5-q1", "1", "那是谁的伞？", "あれは だれの 傘ですか。", { answerSource: "prompt", responseScope: "sentence_only" }),
      answerItem("l2-p2-a5-q2", "2", "这是日语书。", "これは 日本語の 本です。", { answerSource: "prompt", responseScope: "sentence_only" }),
      answerItem("l2-p2-a5-q3", "3", "森先生的包是哪个？", "森さんの かばんは どれですか。", { answerSource: "prompt", responseScope: "sentence_only" })
    ]
  }
];

export const lesson2Practice: LessonPractice = {
  lessonId: "lesson2",
  title: "第2课 これは 本です",
  sourcePages: [
    { pageNo: 38, imagePath: page(38) },
    { pageNo: 39, imagePath: page(39) },
    { pageNo: 40, imagePath: page(40) }
  ],
  activities
};
