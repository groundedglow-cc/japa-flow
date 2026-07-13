import type { AnswerSource, Choice, ImageAsset, InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";
import { lesson3ImageCrops } from "./lesson3-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson3/page${pageNo}.webp`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const crop = (id: string) => lesson3ImageCrops.assets.find((asset) => asset.id === id);

const sourceAsset = (pageNo: number, label: string): ImageAsset => ({
  id: `l3-page${pageNo}-practice-source`,
  kind: "source_crop",
  imagePath: page(pageNo),
  label
});

const p48 = sourceAsset(48, "练习 I 第 1-3 题原页");
const p49 = sourceAsset(49, "练习 I 第 4-7 题原页");
const p50 = sourceAsset(50, "练习 II 原页");
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
    answerSource?: AnswerSource;
    inputSlots?: InputSlot[];
    relatedAssets?: string[];
    renderHint?: PracticeItem["renderHint"];
    note?: string;
  } = {}
): PracticeItem => ({
  id,
  number,
  instruction: options.instruction || "填写答案。",
  answerSource: options.answerSource || "example_transform",
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
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
    instruction: options.instruction || "选择正确答案。",
    answerSource: options.answerSource || "prompt",
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
  options: { answerSource?: AnswerSource; relatedAssets?: string[]; rows?: number; note?: string } = {}
) => makeItem(id, number, prompt, value, {
  instruction: "仿照例句，填写完整会话。",
  answerSource: options.answerSource || "example_transform",
  inputSlots: dialogueSlot("输入完整会话", options.rows || 4),
  relatedAssets: options.relatedAssets,
  renderHint: "dialogue",
  note: options.note
});

const p1a1PlaceItems = [
  ["1", "カメラ売り場", "ここは カメラ売り場です。"],
  ["2", "靴売り場", "ここは 靴売り場です。"],
  ["3", "受付", "ここは 受付です。"],
  ["4", "傘売り場", "ここは 傘売り場です。"],
  ["5", "かばん売り場", "ここは かばん売り場です。"]
];
const p1a1BuildingItems = [
  ["6", "コンビニ／1階", "コンビニは あの ビルの 1階です。"],
  ["7", "本屋／8階", "本屋は あの ビルの 8階です。"],
  ["8", "レストラン／9階", "レストランは あの ビルの 9階です。"],
  ["9", "事務所／3階", "事務所は あの ビルの 3階です。"]
];
const p1a2Items = [
  ["1", "図書館", "甲：図書館は どこですか。\n乙：あそこです。"],
  ["2", "食堂", "甲：食堂は どこですか。\n乙：あそこです。"],
  ["3", "受付", "甲：受付は どこですか。\n乙：あそこです。"],
  ["4", "事務所", "甲：事務所は どこですか。\n乙：あそこです。"]
];
const p1a3Items = [
  ["1", "小野さんは JC企画の 社員です。（李さん）", "李さんも JC企画の 社員です。"],
  ["2", "ここは わたしの レストランです。（そこ）", "そこも わたしの レストランです。"],
  ["3", "この ビルは 病院です。（あの ビル）", "あの ビルも 病院です。"],
  ["4", "時計売り場は デパートの 7階です。（食堂）", "食堂も デパートの 7階です。"]
];
const p1a4Group1 = [
  ["1", "会社員／学生", "甲：あの 人は 会社員ですか、学生ですか。\n乙：会社員です。"],
  ["2", "フランス人／アメリカ人", "甲：あの 人は フランス人ですか、アメリカ人ですか。\n乙：フランス人です。"]
];
const p1a4Group2 = [
  ["3", "デパート／ホテル", "甲：あそこは デパートですか、ホテルですか。\n乙：デパートです。"],
  ["4", "本屋／コンビニ", "甲：あそこは 本屋ですか、コンビニですか。\n乙：本屋です。"]
];
const p1a5Items = [
  ["1", "受付／かばん売り場", "甲：すみません。受付は どこですか。\n乙：受付ですか。受付は あちらです。\n甲：かばん売り場は？\n乙：かばん売り場は 5階です。"],
  ["2", "エスカレーター／バーゲン会場", "甲：すみません。エスカレーターは どこですか。\n乙：エスカレーターですか。エスカレーターは あちらです。\n甲：バーゲン会場は？\n乙：バーゲン会場は 5階です。"],
  ["3", "電話／カメラ売り場", "甲：すみません。電話は どこですか。\n乙：電話ですか。電話は あちらです。\n甲：カメラ売り場は？\n乙：カメラ売り場は 5階です。"]
];
const p1a6Items = [
  ["1", "傘／2,500円", "甲：これは いくらですか。\n乙：それは 2,500円です。\n甲：あれは？\n乙：どれですか。\n甲：あの 傘です。\n乙：あれも 2,500円です。"],
  ["2", "靴／16,000円", "甲：これは いくらですか。\n乙：それは 16,000円です。\n甲：あれは？\n乙：どれですか。\n甲：あの 靴です。\n乙：あれも 16,000円です。"],
  ["3", "パソコン／114,000円", "甲：これは いくらですか。\n乙：それは 114,000円です。\n甲：あれは？\n乙：どれですか。\n甲：あの パソコンです。\n乙：あれも 114,000円です。"],
  ["4", "コート／39,800円", "甲：これは いくらですか。\n乙：それは 39,800円です。\n甲：あれは？\n乙：どれですか。\n甲：あの コートです。\n乙：あれも 39,800円です。"],
  ["5", "車／2,340,000円", "甲：これは いくらですか。\n乙：それは 2,340,000円です。\n甲：あれは？\n乙：どれですか。\n甲：あの 車です。\n乙：あれも 2,340,000円です。"]
];
const p1a7Numbers = ["490", "111", "610", "20,300", "1,400", "9,030", "380", "15,700"];
const p2a1Items = [
  ["1", "あれは（　　）ですか。——病院です。", "何"],
  ["2", "受付は（　　）ですか。——あそこです。", "どこ"],
  ["3", "森さんの 本は（　　）ですか。——これです。", "どれ"],
  ["4", "その 辞書は（　　）のですか。——わたしのです。", "だれ"],
  ["5", "ジョンソンさんは（　　）人ですか。——あの 人です。", "どの"]
];
const p2a2Items = [
  ["1", "ここは 郵便局です（　　）、銀行ですか。", "か"],
  ["2", "ここは ホテルです。そこ（　　）ホテルです。", "も"],
  ["3", "この カメラ（　　）いくらですか。", "は"],
  ["4", "レストランは デパート（　　）8階です。", "の"],
  ["5", "日中商事（　　）こちらですか。", "は"]
];
const p2a3ChoiceItems = [
  ["1", "270円です。どれですか。", "③"],
  ["2", "100円です。どれですか。", "⑤"],
  ["3", "420円です。どれですか。", "⑥"],
  ["4", "110円です。どれですか。", "②"],
  ["5", "350円です。どれですか。", "④"]
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
    title: "看图替换场所和楼层",
    instruction: "看图，仿照例句替换画线部分进行练习。",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    assets: [p48, ...(p1a1Place ? [p1a1Place] : []), ...(p1a1Building ? [p1a1Building] : [])],
    displayAssets: ["l3-p1-a1-place-picture-practice", "l3-p1-a1-building-picture-practice"],
    layout: [],
    itemGroups: [
      {
        id: "l3-p1-a1-g1",
        title: "例 1：这里是……",
        instruction: "看场所图，使用「ここは A です」。",
        example: {
          id: "l3-p1-a1-ex1",
          label: "例 1",
          beforeParts: [repl("食堂", "place")],
          after: [text("ここは "), repl("食堂", "place"), text("です。")]
        },
        items: p1a1PlaceItems.map(([number, prompt, value]) => makeItem(`l3-p1-a1-q${number}`, number, prompt, value, {
          instruction: "根据图片场所，填写 1 个完整句子。",
          relatedAssets: ["l3-p1-a1-place-picture-practice"]
        }))
      },
      {
        id: "l3-p1-a1-g2",
        title: "例 2：楼层位置",
        instruction: "看楼层图，使用「A は あの ビルの N階です」。",
        example: {
          id: "l3-p1-a1-ex2",
          label: "例 2",
          beforeParts: [repl("銀行", "place"), text("／"), repl("1階", "floor")],
          after: [repl("銀行", "place"), text("は あの ビルの "), repl("1階", "floor"), text("です。")]
        },
        items: p1a1BuildingItems.map(([number, prompt, value]) => makeItem(`l3-p1-a1-q${number}`, number, prompt, value, {
          instruction: "根据楼层图，填写 1 个完整句子。",
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
    title: "询问地点",
    instruction: "仿照例句替换画线部分进行练习。",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    assets: [p48],
    layout: [{
      type: "dialogue",
      lines: [
        { speaker: "甲", parts: [repl("トイレ", "place"), text("は どこですか。")] },
        { speaker: "乙", parts: [text("あそこです。")] }
      ]
    }],
    items: p1a2Items.map(([number, prompt, value]) => dialogueItem(`l3-p1-a2-q${number}`, number, prompt, value, { relatedAssets: [p48.id] }))
  },
  {
    id: "l3-p1-a3",
    section: "practice_1",
    order: 3,
    title: "用「も」改写",
    instruction: "仿照例句用括号中的词语练习。",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    assets: [p48],
    layout: [{
      type: "example",
      content: {
        label: "例",
        beforeParts: [text("李さんは "), repl("中国人", "predicate"), text("です。（"), repl("張さん", "subject"), text("）")],
        after: [repl("張さん", "subject"), text("も "), repl("中国人", "predicate"), text("です。")]
      }
    }],
    items: p1a3Items.map(([number, prompt, value]) => makeItem(`l3-p1-a3-q${number}`, number, prompt, value))
  },
  {
    id: "l3-p1-a4",
    section: "practice_1",
    order: 4,
    title: "二选一问答",
    instruction: "仿照例句替换画线部分练习。",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    assets: [p49],
    layout: [],
    itemGroups: [
      {
        id: "l3-p1-a4-g1",
        title: "例 1：询问身份",
        instruction: "使用「A ですか、B ですか」询问身份。",
        example: {
          id: "l3-p1-a4-ex1",
          label: "例 1",
          beforeParts: [repl("中国人", "choiceA"), text("／"), repl("韓国人", "choiceB")],
          after: [text("甲：あの 人は "), repl("中国人", "choiceA"), text("ですか、"), repl("韓国人", "choiceB"), text("ですか。\n乙："), repl("中国人", "choiceA"), text("です。")]
        },
        items: p1a4Group1.map(([number, prompt, value]) => dialogueItem(`l3-p1-a4-q${number}`, number, prompt, value))
      },
      {
        id: "l3-p1-a4-g2",
        title: "例 2：询问场所",
        instruction: "使用「あそこは A ですか、B ですか」。",
        example: {
          id: "l3-p1-a4-ex2",
          label: "例 2",
          beforeParts: [repl("郵便局", "choiceA"), text("／"), repl("銀行", "choiceB")],
          after: [text("甲：あそこは "), repl("郵便局", "choiceA"), text("ですか、"), repl("銀行", "choiceB"), text("ですか。\n乙："), repl("郵便局", "choiceA"), text("です。")]
        },
        items: p1a4Group2.map(([number, prompt, value]) => dialogueItem(`l3-p1-a4-q${number}`, number, prompt, value))
      }
    ],
    items: []
  },
  {
    id: "l3-p1-a5",
    section: "practice_1",
    order: 5,
    title: "听录音练习会话",
    instruction: "听录音，仿照例句替换画线部分练习会话。",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
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
    assets: [p49],
    layout: [{
      type: "dialogue",
      lines: [
        { speaker: "甲", parts: [text("すみません。"), repl("トイレ", "placeA"), text("は どこですか。")] },
        { speaker: "乙", parts: [repl("トイレ", "placeA"), text("ですか。"), repl("トイレ", "placeA"), text("は あちらです。")] },
        { speaker: "甲", parts: [repl("食堂", "placeB"), text("は？")] },
        { speaker: "乙", parts: [repl("食堂", "placeB"), text("は 5階です。")] }
      ]
    }],
    items: p1a5Items.map(([number, prompt, value]) => dialogueItem(`l3-p1-a5-q${number}`, number, prompt, value, {
      answerSource: "audio",
      rows: 5,
      note: number === "3" ? "ASR 末尾漏字；答案按录音题固定模式和例句补全。" : undefined
    }))
  },
  {
    id: "l3-p1-a6",
    section: "practice_1",
    order: 6,
    title: "看图询问价格",
    instruction: "看图，仿照例句替换画线部分练习会话。",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    assets: [p49, ...(p1a6Price ? [p1a6Price] : [])],
    displayAssets: ["l3-p1-a6-price-picture-practice"],
    layout: [{
      type: "dialogue",
      lines: [
        { speaker: "甲", parts: [text("これは いくらですか。")] },
        { speaker: "乙", parts: [text("それは "), repl("8,900円", "price"), text("です。")] },
        { speaker: "甲", parts: [text("あれは？")] },
        { speaker: "乙", parts: [text("どれですか。")] },
        { speaker: "甲", parts: [text("あの "), repl("かばん", "object"), text("です。")] },
        { speaker: "乙", parts: [text("あれも "), repl("8,900円", "price"), text("です。")] }
      ]
    }],
    items: p1a6Items.map(([number, prompt, value]) => dialogueItem(`l3-p1-a6-q${number}`, number, prompt, value, {
      relatedAssets: ["l3-p1-a6-price-picture-practice"],
      rows: 6
    }))
  },
  {
    id: "l3-p1-a7",
    section: "practice_1",
    order: 7,
    title: "听录音重复数字",
    instruction: "听录音，反复练习。",
    interaction: "listening_repeat",
    answerUnit: "phrase",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      transcript: {
        text: "490。111。610。20,300。1,400。9,030。380。15,700。",
        source: "asr",
        confidenceNote: "Azure ASR 重复读数，已按教材编号清理为 8 个数字。",
        segments: p1a7Numbers.map((value, index) => ({ itemNumber: String(index + 1), text: value }))
      }
    },
    assets: [p49],
    layout: [],
    items: p1a7Numbers.map((value, index) => makeItem(`l3-p1-a7-q${index + 1}`, String(index + 1), "听录音，写出数字。", value, {
      instruction: "填写听到的数字。",
      answerSource: "audio",
      inputSlots: [{ id: "answer", expectedUnit: "number", width: "medium", placeholder: "输入数字" }]
    }))
  },
  {
    id: "l3-p2-a1",
    section: "practice_2",
    order: 1,
    title: "选择适当词语填空",
    instruction: "从词框中选择适当的词语填入括号中。",
    interaction: "fill_blank",
    answerUnit: "word",
    assets: [p50],
    layout: [
      { type: "example", content: { label: "例", beforeParts: [text("（　ここ　）は 銀行ですか。")], after: [text("はい、そうです。")] } },
      { type: "word_bank", words: ["何", "どれ", "だれ", "どの", "どこ", "そこ"].map((word) => text(word)) }
    ],
    items: p2a1Items.map(([number, prompt, value]) => makeItem(`l3-p2-a1-q${number}`, number, prompt, value, {
      instruction: "从词框中选择 1 个词语。",
      answerSource: "prompt",
      inputSlots: phraseSlot("输入词框中的词")
    }))
  },
  {
    id: "l3-p2-a2",
    section: "practice_2",
    order: 2,
    title: "填入平假名",
    instruction: "在括号中填入一个平假名。",
    interaction: "fill_blank",
    answerUnit: "word",
    assets: [p50],
    layout: [{
      type: "example",
      content: { label: "例", beforeParts: [text("ここ（　は　）デパートです。")], after: [text("ここ は デパートです。")] }
    }],
    items: p2a2Items.map(([number, prompt, value]) => makeItem(`l3-p2-a2-q${number}`, number, prompt, value, {
      instruction: "填写 1 个平假名。",
      answerSource: "prompt",
      inputSlots: phraseSlot("输入 1 个假名")
    }))
  },
  {
    id: "l3-p2-a3",
    section: "practice_2",
    order: 3,
    title: "看图听录音回答",
    instruction: "边看图边听录音，回答提问。",
    interaction: "listening_answer",
    answerUnit: "choice",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      transcript: {
        text: "90円です。どれですか。270円です。どれですか。100円です。どれですか。420円です。どれですか。110円です。どれですか。350円です。どれですか。いくらですか。200円です。",
        source: "asr",
        confidenceNote: "Azure ASR 含序号噪声，已根据图片价格和教材例题切分。",
        segments: [
          { itemNumber: "例1", text: "90円です。どれですか。" },
          ...p2a3ChoiceItems.map(([number, prompt]) => ({ itemNumber: number, text: prompt })),
          { itemNumber: "例2", text: "いくらですか。200円です。" },
          ...p2a3SumItems.map(([number, prompt, value]) => ({ itemNumber: number, text: `${prompt}。${value}` }))
        ]
      }
    },
    assets: [p50, ...(p2a3Stamp ? [p2a3Stamp] : [])],
    displayAssets: ["l3-p2-a3-stamp-picture-practice"],
    layout: [
      {
        type: "example",
        content: { label: "例 1", beforeParts: [text("90円です。どれですか。")], after: [text("①")] }
      },
      {
        type: "example",
        content: { label: "例 2", beforeParts: [text("いくらですか。①＋②")], after: [text("200円です。")] }
      }
    ],
    itemGroups: [
      {
        id: "l3-p2-a3-g1",
        title: "例 1：听价格选邮票",
        instruction: "听录音价格，选择对应的邮票编号。",
        example: { label: "例 1", beforeParts: [text("90円です。どれですか。")], after: [text("①")] },
        items: p2a3ChoiceItems.map(([number, prompt, correct]) => choiceItem(`l3-p2-a3-q${number}`, number, prompt, ["①", "②", "③", "④", "⑤", "⑥"], correct, {
          answerSource: "audio",
          relatedAssets: ["l3-p2-a3-stamp-picture-practice"]
        }))
      },
      {
        id: "l3-p2-a3-g2",
        title: "例 2：听组合算价格",
        instruction: "根据图片中的价格计算合计金额。",
        example: { label: "例 2", beforeParts: [text("いくらですか。①＋②")], after: [text("200円です。")] },
        items: p2a3SumItems.map(([number, prompt, value]) => makeItem(`l3-p2-a3-q${number}`, number, prompt, value, {
          instruction: "填写合计金额。",
          answerSource: "audio",
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
    title: "中译日",
    instruction: "将下面的句子译成日语。",
    interaction: "translation",
    answerUnit: "sentence",
    assets: [p50],
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
