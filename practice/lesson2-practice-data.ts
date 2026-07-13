import type { AnswerSource, Choice, ImageAsset, InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";
import { lesson2ImageCrops } from "./lesson2-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson2/page${pageNo}.webp`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, key: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey: key });

const sourceAsset = (pageNo: number, label: string): ImageAsset => ({
  id: `l2-page${pageNo}-practice-source`,
  kind: "source_crop",
  imagePath: page(pageNo),
  label
});

const p38 = sourceAsset(38, "练习 I 第 1-3 题原页");
const p39 = sourceAsset(39, "练习 I 第 4-6 题原页");
const p40 = sourceAsset(40, "练习 II 原页");
const crop = (id: string) => lesson2ImageCrops.assets.find((asset) => asset.id === id);
const practice1Picture = crop("l2-p1-a1-picture-practice");
const practice4Picture = crop("l2-p1-a4-picture-practice");
const practice2Picture = crop("l2-p2-a4-picture-practice");

const sentenceSlot = (placeholder = "输入 1 个完整句子"): InputSlot[] => [
  { id: "answer", expectedUnit: "sentence", width: "long", placeholder }
];

const phraseSlot = (placeholder = "输入词语或短语"): InputSlot[] => [
  { id: "answer", expectedUnit: "phrase", width: "medium", placeholder }
];

const dialogueSlot = (placeholder = "按例句格式输入完整对话", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "dialogue", width: "long", placeholder, multiline: true, rows }
];

const item = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  answer: string | undefined,
  options: {
    instruction?: string;
    answerSource?: AnswerSource;
    inputSlots?: InputSlot[];
    relatedAssets?: string[];
    renderHint?: PracticeItem["renderHint"];
    evaluationMode?: PracticeItem["evaluationMode"];
    modelAnswers?: string[];
    acceptableAlternatives?: string[];
    choices?: Choice[];
    choiceIds?: string[];
    note?: string;
  } = {}
): PracticeItem => ({
  id,
  number,
  instruction: options.instruction || "填写答案。",
  answerSource: options.answerSource || "example_transform",
  evaluationMode: options.evaluationMode,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  inputSlots: options.inputSlots || sentenceSlot(),
  choices: options.choices,
  answer: answer
    ? { slotValues: { answer }, note: options.note }
    : options.modelAnswers || options.acceptableAlternatives || options.choiceIds
      ? {
          modelAnswers: options.modelAnswers,
          acceptableAlternatives: options.acceptableAlternatives,
          choiceIds: options.choiceIds,
          note: options.note
        }
      : options.note
        ? { note: options.note }
        : undefined,
  relatedAssets: options.relatedAssets,
  renderHint: options.renderHint || "inline"
});

const choiceItem = (
  id: string,
  number: string,
  promptText: string,
  choices: string[],
  answerLabel: string,
  options: { answerSource?: AnswerSource; relatedAssets?: string[]; note?: string } = {}
): PracticeItem => {
  const mapped = choices.map((label, index) => ({ id: `${id}-c${index + 1}`, label }));
  const answerChoice = mapped.find((choice) => choice.label === answerLabel);
  return {
    id,
    number,
    instruction: "从选项中选择正确答案。",
    answerSource: options.answerSource || "prompt",
    prompt: [text(promptText)],
    choices: mapped,
    answer: { choiceIds: answerChoice ? [answerChoice.id] : [], note: options.note },
    relatedAssets: options.relatedAssets,
    renderHint: "inline"
  };
};

const dialogueItem = (
  id: string,
  number: string,
  promptText: string,
  answer: string | undefined,
  options: { answerSource?: AnswerSource; relatedAssets?: string[]; note?: string; rows?: number } = {}
): PracticeItem => item(id, number, promptText, answer, {
  instruction: "仿照例句，填写完整会话。",
  answerSource: options.answerSource || "example_transform",
  inputSlots: dialogueSlot("输入完整会话", options.rows || 4),
  relatedAssets: options.relatedAssets,
  renderHint: "dialogue",
  note: options.note
});

const p1a1Words = [
  ["1", "かばん", "これは かばんです。"],
  ["2", "いす", "これは いすです。"],
  ["3", "机", "これは 机です。"],
  ["4", "新聞", "これは 新聞です。"],
  ["5", "鉛筆", "これは 鉛筆です。"],
  ["6", "雑誌", "これは 雑誌です。"],
  ["7", "辞書", "これは 辞書です。"],
  ["8", "電話", "これは 電話です。"],
  ["9", "カメラ", "これは カメラです。"]
];

const p1a2 = [
  ["1", "李さん", "それは 李さんの パソコンでは ありません。"],
  ["2", "スミスさん", "それは スミスさんの パソコンでは ありません。"],
  ["3", "わたし", "それは わたしの パソコンでは ありません。"],
  ["4", "会社", "それは 会社の パソコンでは ありません。"]
];

const p1a3Examples = [
  {
    id: "l2-p1-a3-g1",
    title: "例 1：近称肯定",
    example: {
      id: "l2-p1-a3-ex1",
      label: "例 1",
      beforeParts: [repl("テレビ", "object")],
      after: [text("甲：それは "), repl("テレビ", "object"), text("ですか。\n乙：はい、これは "), repl("テレビ", "object"), text("です。")]
    },
    items: [
      ["1", "鉛筆", "甲：それは 鉛筆ですか。\n乙：はい、これは 鉛筆です。"],
      ["2", "ノート", "甲：それは ノートですか。\n乙：はい、これは ノートです。"],
      ["3", "新聞", "甲：それは 新聞ですか。\n乙：はい、これは 新聞です。"],
      ["4", "小野さんの 傘", "甲：それは 小野さんの 傘ですか。\n乙：はい、これは 小野さんの 傘です。"]
    ]
  },
  {
    id: "l2-p1-a3-g2",
    title: "例 2：远近对比否定",
    example: {
      id: "l2-p1-a3-ex2",
      label: "例 2",
      beforeParts: [repl("雑誌", "nearObject"), text("／"), repl("辞書", "farObject")],
      after: [text("甲：あれは "), repl("雑誌", "nearObject"), text("ですか。\n乙：いいえ、あれは "), repl("雑誌", "nearObject"), text("では ありません。"), repl("辞書", "farObject"), text("です。")]
    },
    items: [
      ["5", "机／いす", "甲：あれは 机ですか。\n乙：いいえ、あれは 机では ありません。いすです。"],
      ["6", "テレビ／パソコン", "甲：あれは テレビですか。\n乙：いいえ、あれは テレビでは ありません。パソコンです。"],
      ["7", "森さんの 車／社長の 車", "甲：あれは 森さんの 車ですか。\n乙：いいえ、あれは 森さんの 車では ありません。社長の 車です。"]
    ]
  },
  {
    id: "l2-p1-a3-g3",
    title: "例 3：询问物品",
    example: {
      id: "l2-p1-a3-ex3",
      label: "例 3",
      beforeParts: [repl("シルクの ハンカチ", "object")],
      after: [text("甲：それは 何ですか。\n乙：これは "), repl("シルクの ハンカチ", "object"), text("です。")]
    },
    items: [
      ["8", "中国語の 辞書", "甲：それは 何ですか。\n乙：これは 中国語の 辞書です。"],
      ["9", "雑誌", "甲：それは 何ですか。\n乙：これは 雑誌です。"],
      ["10", "カメラ", "甲：それは 何ですか。\n乙：これは カメラです。"],
      ["11", "家族の 写真", "甲：それは 何ですか。\n乙：これは 家族の 写真です。"]
    ]
  }
];

const p1a4 = [
  ["1", "かばん", "甲：それは 何ですか。\n乙：これは かばんです。"],
  ["2", "靴", "甲：それは 何ですか。\n乙：これは 靴です。"],
  ["3", "傘", "甲：それは 何ですか。\n乙：これは 傘です。"],
  ["4", "雑誌", "甲：あれは 何ですか。\n乙：あれは 雑誌です。"],
  ["5", "ラジオ", "甲：あれは 何ですか。\n乙：あれは ラジオです。"],
  ["6", "時計", "甲：あれは 何ですか。\n乙：あれは 時計です。"]
];

const p1a6Transcript = [
  { itemNumber: "1", speaker: "甲/乙", text: "これはあなたの傘ですか。いいえ、私のではありません。このかばんは。ああ、それは私のです。" },
  { itemNumber: "2", speaker: "甲/乙", text: "これはあなたの本ですか。いいえ、私のではありません。この辞書は。あ、それは私のです。" },
  { itemNumber: "3", speaker: "甲/乙", text: "これはあなたの鍵ですか。いいえ、私のでは..." }
];

const activities: PracticeActivity[] = [
  {
    id: "l2-p1-a1",
    section: "practice_1",
    order: 1,
    title: "看图替换物品名",
    instruction: "看图，仿照例句替换画线部分进行练习。",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    assets: [p38, ...(practice1Picture ? [practice1Picture] : [])],
    displayAssets: ["l2-p1-a1-picture-practice"],
    layout: [{
      type: "example",
      content: {
        label: "例",
        beforeParts: [repl("テレビ", "object")],
        after: [text("これは "), repl("テレビ", "object"), text("です。")]
      }
    }],
    items: p1a1Words.map(([number, word, answer]) => item(`l2-p1-a1-q${number}`, number, word, answer, {
      instruction: "根据图片词语，填写 1 个完整句子。",
      relatedAssets: ["l2-p1-a1-picture-practice"]
    }))
  },
  {
    id: "l2-p1-a2",
    section: "practice_1",
    order: 2,
    title: "所有格否定句",
    instruction: "仿照例句替换画线部分进行练习。",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    assets: [p38],
    layout: [{
      type: "example",
      content: {
        label: "例",
        beforeParts: [repl("森さん", "owner")],
        after: [text("それは "), repl("森さん", "owner"), text("の パソコンでは ありません。")]
      }
    }],
    items: p1a2.map(([number, owner, answer]) => item(`l2-p1-a2-q${number}`, number, owner, answer, {
      instruction: "替换所有者，填写 1 个完整否定句。"
    }))
  },
  {
    id: "l2-p1-a3",
    section: "practice_1",
    order: 3,
    title: "替换会话",
    instruction: "仿照例句替换画线部分练习会话。",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    assets: [p38],
    layout: [],
    itemGroups: p1a3Examples.map((group) => ({
      id: group.id,
      title: group.title,
      instruction: "参考例句，替换提示词，填写完整会话。",
      example: group.example,
      items: group.items.map(([number, prompt, answer]) => dialogueItem(`l2-p1-a3-q${number}`, number, prompt, answer, { relatedAssets: [p38.id] }))
    })),
    items: []
  },
  {
    id: "l2-p1-a4",
    section: "practice_1",
    order: 4,
    title: "看图会话",
    instruction: "看图，仿照例句替换画线部分练习会话。",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    assets: [p39, ...(practice4Picture ? [practice4Picture] : [])],
    displayAssets: ["l2-p1-a4-picture-practice"],
    layout: [
      {
        type: "dialogue",
        lines: [
          { speaker: "甲", parts: [text("それは 何ですか。")] },
          { speaker: "乙", parts: [text("これは カメラです。")] }
        ]
      },
      {
        type: "dialogue",
        lines: [
          { speaker: "甲", parts: [text("あれは 何ですか。")] },
          { speaker: "乙", parts: [text("あれは 新聞です。")] }
        ]
      }
    ],
    items: p1a4.map(([number, prompt, answer]) => dialogueItem(`l2-p1-a4-q${number}`, number, prompt, answer, {
      relatedAssets: ["l2-p1-a4-picture-practice"]
    }))
  },
  {
    id: "l2-p1-a5",
    section: "practice_1",
    order: 5,
    title: "听录音选择词语",
    instruction: "仿照例句在录音所说的内容上画圈，并反复练习。",
    interaction: "single_choice",
    answerUnit: "choice",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      transcript: {
        text: "これはテレビです。これは机の鍵です。これは私の傘ではありません。あれは誰のかばんですか。その手帳はスミスさんのではありません。",
        source: "asr",
        confidenceNote: "Azure ASR 原文含序号噪声，已按教材小题人工切分清理。",
        segments: [
          { itemNumber: "例", text: "これはテレビです。" },
          { itemNumber: "1", text: "これは机の鍵です。" },
          { itemNumber: "2", text: "これは私の傘ではありません。" },
          { itemNumber: "3", text: "あれは誰のかばんですか。" },
          { itemNumber: "4", text: "その手帳はスミスさんのではありません。" }
        ]
      }
    },
    assets: [p39],
    layout: [{
      type: "example",
      content: {
        label: "例",
        beforeParts: [text("これは { テレビ・カメラ } です。")],
        after: [text("これは テレビ です。")]
      }
    }],
    items: [
      choiceItem("l2-p1-a5-q1", "1", "これは { 車・机 } の かぎです。", ["車", "机"], "机", { answerSource: "audio" }),
      choiceItem("l2-p1-a5-q2", "2", "これは { 森さん・わたし } の 傘では ありません。", ["森さん", "わたし"], "わたし", { answerSource: "audio" }),
      choiceItem("l2-p1-a5-q3", "3", "あれは { だれ・何 } の かばんですか。", ["だれ", "何"], "だれ", { answerSource: "audio" }),
      choiceItem("l2-p1-a5-q4", "4", "その 手帳は スミスさんの { です・では ありません }。", ["です", "では ありません"], "では ありません", { answerSource: "audio" })
    ]
  },
  {
    id: "l2-p1-a6",
    section: "practice_1",
    order: 6,
    title: "听录音替换会话",
    instruction: "听录音，仿照例句替换画线部分练习会话。",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      transcript: {
        text: "傘。かばん。これはあなたの傘ですか。いいえ、私のではありません。このかばんは。ああ、それは私のです。本。辞書。これはあなたの本ですか。いいえ、私のではありません。この辞書は。あ、それは私のです。ラジオ。カメラ。これはあなたのラジオですか。いいえ、私のではありません。このカメラは。あ、それは私のです。鍵。新聞。これはあなたの鍵ですか。いいえ、私のでは...",
        source: "asr",
        confidenceNote: "Azure ASR 第 3 小题尾部截断，答案需人工复核后补全。",
        segments: p1a6Transcript
      }
    },
    assets: [p39],
    layout: [{
      type: "dialogue",
      lines: [
        { speaker: "甲", parts: [text("これは あなたの 傘ですか。")] },
        { speaker: "乙", parts: [text("いいえ、わたしのでは ありません。")] },
        { speaker: "甲", parts: [text("この かばんは？")] },
        { speaker: "乙", parts: [text("あっ、それは わたしのです。")] }
      ]
    }],
    items: [
      dialogueItem("l2-p1-a6-q1", "1", "本／辞書", "甲：これは あなたの 本ですか。\n乙：いいえ、わたしのでは ありません。\n甲：この 辞書は？\n乙：あっ、それは わたしのです。", { answerSource: "audio", relatedAssets: [p39.id], rows: 5 }),
      dialogueItem("l2-p1-a6-q2", "2", "ラジオ／カメラ", "甲：これは あなたの ラジオですか。\n乙：いいえ、わたしのでは ありません。\n甲：この カメラは？\n乙：あっ、それは わたしのです。", { answerSource: "audio", relatedAssets: [p39.id], rows: 5 }),
      dialogueItem("l2-p1-a6-q3", "3", "かぎ／新聞", undefined, {
        answerSource: "audio",
        relatedAssets: [p39.id],
        rows: 5,
        note: "ASR 只可靠识别到「これはあなたの鍵ですか。いいえ、私のでは...」，尾部缺失，需人工听写补全。"
      })
    ]
  },
  {
    id: "l2-p2-a1",
    section: "practice_2",
    order: 1,
    title: "填入适当词语",
    instruction: "在括号中填入适当的词语。",
    interaction: "fill_blank",
    answerUnit: "word",
    assets: [p40],
    layout: [{
      type: "example",
      content: { label: "例", beforeParts: [text("それは（　何　）ですか。")], after: [text("これは パソコンです。")] }
    }],
    items: [
      item("l2-p2-a1-q1", "1", "あれは（　　）の かばんですか。——森さんの かばんです。", "だれ", { instruction: "填写 1 个疑问词。", inputSlots: phraseSlot("输入疑问词") }),
      item("l2-p2-a1-q2", "2", "李さんの 傘は（　　）ですか。——あれです。", "どれ", { instruction: "填写 1 个指示疑问词。", inputSlots: phraseSlot("输入疑问词") }),
      item("l2-p2-a1-q3", "3", "この 本は（　　）のですか。——わたしのです。", "だれ", { instruction: "填写 1 个疑问词。", inputSlots: phraseSlot("输入疑问词") }),
      item("l2-p2-a1-q4", "4", "（　　）かばんですか。——あの かばんです。", "どの", { instruction: "填写 1 个连体疑问词。", inputSlots: phraseSlot("输入疑问词") })
    ]
  },
  {
    id: "l2-p2-a2",
    section: "practice_2",
    order: 2,
    title: "填入平假名",
    instruction: "在括号中填入一个平假名。",
    interaction: "fill_blank",
    answerUnit: "word",
    assets: [p40],
    layout: [{
      type: "example",
      content: { label: "例", beforeParts: [text("これ（　は　）本です。")], after: [text("これ は 本です。")] }
    }],
    items: [
      item("l2-p2-a2-q1", "1", "その ノートは だれ（　　）ですか。", "の", { instruction: "填写 1 个平假名。", inputSlots: phraseSlot("输入 1 个假名") }),
      item("l2-p2-a2-q2", "2", "田中さんの 車（　　）どれですか。", "は", { instruction: "填写 1 个平假名。", inputSlots: phraseSlot("输入 1 个假名") }),
      item("l2-p2-a2-q3", "3", "吉田さん（　　）43 歳です。", "は", { instruction: "填写 1 个平假名。", inputSlots: phraseSlot("输入 1 个假名") }),
      item("l2-p2-a2-q4", "4", "これは 中国語の 辞書で（　　）ありません。", "は", { instruction: "填写 1 个平假名。", inputSlots: phraseSlot("输入 1 个假名") })
    ]
  },
  {
    id: "l2-p2-a3",
    section: "practice_2",
    order: 3,
    title: "写出疑问句",
    instruction: "参照答句，写出疑问句。",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    assets: [p40],
    layout: [{
      type: "example",
      content: {
        label: "例",
        beforeParts: [text("（　それは 何ですか。　）——これは 本です。")],
        after: [text("それは 何ですか。")]
      }
    }],
    items: [
      item("l2-p2-a3-q1", "1", "（　　）——それは 李さんの 辞書です。", "それは だれの 辞書ですか。"),
      item("l2-p2-a3-q2", "2", "（　　）——その ノートは 田中さんのです。", "その ノートは だれのですか。"),
      item("l2-p2-a3-q3", "3", "（　　）——いいえ、これは 雑誌では ありません。", "これは 雑誌ですか。"),
      item("l2-p2-a3-q4", "4", "（　　）——はい、あれは 林さんの 車です。", "あれは 林さんの 車ですか。")
    ]
  },
  {
    id: "l2-p2-a4",
    section: "practice_2",
    order: 4,
    title: "看图听录音回答",
    instruction: "边看图边听录音，回答提问。",
    interaction: "listening_answer",
    answerUnit: "sentence",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      transcript: {
        text: "これは雑誌ですか。いいえ、雑誌ではありません。辞書です。それはテレビですか。それはノートですか。これは田中さんの傘ですか。これはあなたのカメラですか。",
        source: "asr",
        confidenceNote: "Azure ASR 原文含序号噪声；答案由录音问题与图片信息共同推断。",
        segments: [
          { itemNumber: "例", text: "これは雑誌ですか。" },
          { itemNumber: "1", text: "それはテレビですか。" },
          { itemNumber: "2", text: "それはノートですか。" },
          { itemNumber: "3", text: "これは田中さんの傘ですか。" },
          { itemNumber: "4", text: "これはあなたのカメラですか。" }
        ]
      }
    },
    assets: [p40, ...(practice2Picture ? [practice2Picture] : [])],
    displayAssets: ["l2-p2-a4-picture-practice"],
    layout: [{
      type: "example",
      content: {
        label: "例",
        beforeParts: [text("これは 雑誌ですか。")],
        after: [text("いいえ、雑誌では ありません。辞書です。")]
      }
    }],
    items: [
      item("l2-p2-a4-q1", "1", "听录音问题并根据图回答。", "いいえ、テレビでは ありません。ラジオです。", { answerSource: "audio", relatedAssets: ["l2-p2-a4-picture-practice"] }),
      item("l2-p2-a4-q2", "2", "听录音问题并根据图回答。", "いいえ、ノートでは ありません。本です。", { answerSource: "audio", relatedAssets: ["l2-p2-a4-picture-practice"] }),
      item("l2-p2-a4-q3", "3", "听录音问题并根据图回答。", "いいえ、田中さんの 傘では ありません。小野さんの 傘です。", { answerSource: "audio", relatedAssets: ["l2-p2-a4-picture-practice"] }),
      item("l2-p2-a4-q4", "4", "听录音问题并根据图回答。", "いいえ、わたしのでは ありません。長島さんの カメラです。", { answerSource: "audio", relatedAssets: ["l2-p2-a4-picture-practice"] })
    ]
  },
  {
    id: "l2-p2-a5",
    section: "practice_2",
    order: 5,
    title: "中译日",
    instruction: "将下面的句子译成日语。",
    interaction: "translation",
    answerUnit: "sentence",
    assets: [p40],
    layout: [],
    items: [
      item("l2-p2-a5-q1", "1", "那是谁的伞？", "あれは だれの 傘ですか。", { answerSource: "prompt" }),
      item("l2-p2-a5-q2", "2", "这是日语书。", "これは 日本語の 本です。", { answerSource: "prompt" }),
      item("l2-p2-a5-q3", "3", "森先生的包是哪个？", "森さんの かばんは どれですか。", { answerSource: "prompt" })
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
