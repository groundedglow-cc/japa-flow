import type { AnswerSource, Choice, ImageAsset, InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";
import { lesson4ImageCrops } from "./lesson4-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson4/page${pageNo}.webp`;
const audioUrl = (section: "practice_1" | "practice_2", order: number) => {
  const exerciseNo = section === "practice_1" ? 1 : 2;
  return `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit1/lesson4/Exe${exerciseNo}_${order}.mp3`;
};
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const crop = (id: string) => lesson4ImageCrops.assets.find((asset) => asset.id === id);

const sourceAsset = (pageNo: number, label: string): ImageAsset => ({
  id: `l4-page${pageNo}-practice-source`,
  kind: "source_crop",
  imagePath: page(pageNo),
  label
});

const p58 = sourceAsset(58, "练习 I 第 1-3 题原页");
const p59 = sourceAsset(59, "练习 I 第 4-6 题原页");
const p60 = sourceAsset(60, "练习 II 原页");
const p1a3Object = crop("l4-p1-a3-object-picture-practice");
const p1a3Person = crop("l4-p1-a3-person-picture-practice");
const p1a5Room = crop("l4-p1-a5-room-picture-practice");
const p1a6Picture = crop("l4-p1-a6-picture-practice");
const p2a1Scene = crop("l4-p2-a1-scene-picture-practice");
const p2a3Map = crop("l4-p2-a3-map-picture-practice");

const sentenceSlot = (placeholder = "输入 1 个完整句子"): InputSlot[] => [
  { id: "answer", expectedUnit: "sentence", width: "long", placeholder }
];
const phraseSlot = (placeholder = "输入词语或短语"): InputSlot[] => [
  { id: "answer", expectedUnit: "phrase", width: "medium", placeholder }
];
const dialogueSlot = (placeholder = "输入完整回答", rows = 3): InputSlot[] => [
  { id: "answer", expectedUnit: "dialogue", width: "long", placeholder, multiline: true, rows }
];

const answer = (value: string | undefined, note?: string) => value ? { slotValues: { answer: value }, note } : note ? { note } : undefined;

const item = (
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
    acceptableAlternatives?: string[];
  } = {}
): PracticeItem => ({
  id,
  number,
  instruction: options.instruction || "填写答案。",
  answerSource: options.answerSource || "example_transform",
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  inputSlots: options.inputSlots || sentenceSlot(),
  answer: value
    ? { slotValues: { answer: value }, acceptableAlternatives: options.acceptableAlternatives, note: options.note }
    : answer(value, options.note),
  relatedAssets: options.relatedAssets,
  renderHint: options.renderHint || "inline"
});

const dialogueItem = (
  id: string,
  number: string,
  prompt: string,
  value: string | undefined,
  options: { answerSource?: AnswerSource; relatedAssets?: string[]; rows?: number; note?: string } = {}
) => item(id, number, prompt, value, {
  instruction: "仿照例句，填写完整回答。",
  answerSource: options.answerSource || "example_transform",
  inputSlots: dialogueSlot("输入完整回答", options.rows || 3),
  relatedAssets: options.relatedAssets,
  renderHint: "dialogue",
  note: options.note
});

const choiceItem = (
  id: string,
  number: string,
  prompt: string,
  choices: string[],
  correct: string,
  options: { answerSource?: AnswerSource; instruction?: string; relatedAssets?: string[] } = {}
): PracticeItem => {
  const mapped: Choice[] = choices.map((label, index) => ({ id: `${id}-c${index + 1}`, label }));
  const selected = mapped.find((choice) => choice.label === correct);
  return {
    id,
    number,
    instruction: options.instruction || "从选项中选择正确答案。",
    answerSource: options.answerSource || "prompt",
    prompt: [text(prompt)],
    choices: mapped,
    answer: { choiceIds: selected ? [selected.id] : [] },
    relatedAssets: options.relatedAssets,
    renderHint: "inline"
  };
};

const trueFalseItem = (id: string, number: string, prompt: string, value: boolean, relatedAssets: string[]): PracticeItem => ({
  id,
  number,
  instruction: "与图一致选 ○，不一致选 ×。",
  answerSource: "prompt",
  prompt: [text(prompt)],
  choices: [
    { id: `${id}-true`, label: "○" },
    { id: `${id}-false`, label: "×" }
  ],
  answer: { boolean: value, choiceIds: [`${id}-${value ? "true" : "false"}`] },
  relatedAssets,
  renderHint: "inline"
});

const p1a1Group1 = [
  ["1", "机", "部屋に 机が あります。"],
  ["2", "時計", "部屋に 時計が あります。"],
  ["3", "本棚", "部屋に 本棚が あります。"],
  ["4", "パソコン", "部屋に パソコンが あります。"],
  ["5", "ベッド", "部屋に ベッドが あります。"]
];
const p1a1Group2 = [
  ["6", "犬", "あそこに 犬が います。"],
  ["7", "男の人", "あそこに 男の人が います。"],
  ["8", "女の人", "あそこに 女の人が います。"],
  ["9", "子供", "あそこに 子供が います。"],
  ["10", "李さん", "あそこに 李さんが います。"]
];
const p1a2Group1 = [
  ["1", "車の 前", "車の 前に 何が ありますか。"],
  ["2", "いすの 上", "いすの 上に 何が ありますか。"],
  ["3", "箱の 中", "箱の 中に 何が ありますか。"],
  ["4", "木の 下", "木の 下に 何が ありますか。"]
];
const p1a2Group2 = [
  ["5", "会議室", "会議室に だれが いますか。"],
  ["6", "林さんの 後ろ", "林さんの 後ろに だれが いますか。"],
  ["7", "李さんの 隣", "李さんの 隣に だれが いますか。"],
  ["8", "車の 中", "車の 中に だれが いますか。"]
];
const p1a3ObjectItems = [
  ["1", "テレビの 上に 何が ありますか。", "カメラが あります。"],
  ["2", "いすの 下に 何が ありますか。", "サッカーボールが あります。"],
  ["3", "本棚の 上に 何が ありますか。", "時計が あります。"],
  ["4", "箱の 中に 何が ありますか。", "何も ありません。"]
];
const p1a3PersonItems = [
  ["5", "会議室に だれが いますか。", "森さんが います。"],
  ["6", "パソコンの 前に だれが いますか。", "小野さんが います。"],
  ["7", "庭に だれが いますか。", "スミスさんが います。"],
  ["8", "車の 後ろに だれが いますか。", "だれも いません。"]
];
const p1a4Items = [
  ["1", "生徒は 教室に いますか。（はい）", "はい、います。"],
  ["2", "林さんの 家は どこですか。（横浜）", "横浜です。"],
  ["3", "JC企画は どこに ありますか。（銀行の 隣）", "銀行の 隣に あります。"],
  ["4", "森さんは 部屋に いますか。（いいえ）", "いいえ、いません。"]
];
const p1a5Items = [
  ["1", "听录音问题并回答。", "はい、あります。"],
  ["2", "听录音问题并回答。", "いいえ、ありません。"],
  ["3", "听录音问题并回答。", "いいえ、いません。"],
  ["4", "听录音问题并回答。", "机の 下です。"],
  ["5", "听录音问题并回答。", "いすの 下です。"]
];
const p1a6Items = [
  ["1", "听录音问题并回答。", "小野さんが います。"],
  ["2", "听录音问题并回答。", "かばんの 中に あります。"],
  ["3", "听录音问题并回答。", "新聞が あります。"],
  ["4", "听录音问题并回答。", "何も ありません。"],
  ["5", "听录音问题并回答。", "だれも いません。"]
];
const p2a1Items = [
  ["1", "車の 中に 犬が います。", true],
  ["2", "いすの 上に 猫が います。", false],
  ["3", "木の 下に いすが あります。", true],
  ["4", "木の 下に だれも いません。", true],
  ["5", "男の 人は 車の 後ろに います。", false]
] as const;
const p2a2Items = [
  ["1", "箱の 中に（　　）が ありますか。", ["だれ", "何"], "何"],
  ["2", "田中さんの 後ろに だれも（　　）。", ["います", "いません"], "いません"],
  ["3", "いすの 下に（　　）ありません。", ["どこも", "何も"], "何も"],
  ["4", "机の 上に 辞書が あります。雑誌（　　）あります。", ["は", "も"], "も"],
  ["5", "ベッドの 上に（　　）が あります。", ["子供", "雑誌"], "雑誌"]
] as const;
const p2a3Items = [
  ["1", "听录音问题并回答。", "郵便局が あります。"],
  ["2", "听录音问题并回答。", "カメラ売り場が あります。"],
  ["3", "听录音问题并回答。", "デパートの 1階に あります。"],
  ["4", "听录音问题并回答。", "はい、あります。"],
  ["5", "听录音问题并回答。", "4階です。"]
];

const activities: PracticeActivity[] = [
  {
    id: "l4-p1-a1",
    section: "practice_1",
    order: 1,
    title: "替换存在句",
    instruction: "仿照例句替换画线部分进行练习。",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    assets: [p58],
    layout: [],
    itemGroups: [
      {
        id: "l4-p1-a1-g1",
        title: "例 1：无生命物体",
        instruction: "使用「部屋に A が あります」。",
        example: {
          id: "l4-p1-a1-ex1",
          label: "例 1",
          beforeParts: [repl("いす", "object")],
          after: [text("部屋に "), repl("いす", "object"), text("が あります。")]
        },
        items: p1a1Group1.map(([number, prompt, value]) => item(`l4-p1-a1-q${number}`, number, prompt, value))
      },
      {
        id: "l4-p1-a1-g2",
        title: "例 2：有生命的人或动物",
        instruction: "使用「あそこに A が います」。",
        example: {
          id: "l4-p1-a1-ex2",
          label: "例 2",
          beforeParts: [repl("猫", "personOrAnimal")],
          after: [text("あそこに "), repl("猫", "personOrAnimal"), text("が います。")]
        },
        items: p1a1Group2.map(([number, prompt, value]) => item(`l4-p1-a1-q${number}`, number, prompt, value))
      }
    ],
    items: []
  },
  {
    id: "l4-p1-a2",
    section: "practice_1",
    order: 2,
    title: "替换位置问句",
    instruction: "仿照例句替换画线部分进行练习。",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    assets: [p58],
    layout: [],
    itemGroups: [
      {
        id: "l4-p1-a2-g1",
        title: "例 1：询问物品",
        instruction: "使用「A に 何が ありますか」。",
        example: {
          id: "l4-p1-a2-ex1",
          label: "例 1",
          beforeParts: [repl("机の 上", "place")],
          after: [repl("机の 上", "place"), text("に 何が ありますか。")]
        },
        items: p1a2Group1.map(([number, prompt, value]) => item(`l4-p1-a2-q${number}`, number, prompt, value))
      },
      {
        id: "l4-p1-a2-g2",
        title: "例 2：询问人物",
        instruction: "使用「A に だれが いますか」。",
        example: {
          id: "l4-p1-a2-ex2",
          label: "例 2",
          beforeParts: [repl("あそこ", "place")],
          after: [repl("あそこ", "place"), text("に だれが いますか。")]
        },
        items: p1a2Group2.map(([number, prompt, value]) => item(`l4-p1-a2-q${number}`, number, prompt, value))
      }
    ],
    items: []
  },
  {
    id: "l4-p1-a3",
    section: "practice_1",
    order: 3,
    title: "看图回答位置问题",
    instruction: "看图，仿照例句回答提问。",
    interaction: "dialogue_practice",
    answerUnit: "sentence",
    assets: [p58, ...(p1a3Object ? [p1a3Object] : []), ...(p1a3Person ? [p1a3Person] : [])],
    displayAssets: ["l4-p1-a3-object-picture-practice", "l4-p1-a3-person-picture-practice"],
    layout: [],
    itemGroups: [
      {
        id: "l4-p1-a3-g1",
        title: "例 1：回答有什么",
        instruction: "根据图中的物品回答。",
        example: {
          id: "l4-p1-a3-ex1",
          label: "例 1",
          beforeParts: [text("いすの 上に 何が ありますか。")],
          after: [repl("本", "object"), text("が あります。")]
        },
        items: p1a3ObjectItems.map(([number, prompt, value]) => item(`l4-p1-a3-q${number}`, number, prompt, value, {
          instruction: "根据图片，填写回答句。",
          relatedAssets: ["l4-p1-a3-object-picture-practice"],
          inputSlots: sentenceSlot("输入回答句")
        }))
      },
      {
        id: "l4-p1-a3-g2",
        title: "例 2：回答有谁",
        instruction: "根据图中的人物回答。",
        example: {
          id: "l4-p1-a3-ex2",
          label: "例 2",
          beforeParts: [text("図書室に だれが いますか。")],
          after: [repl("李さん", "person"), text("が います。")]
        },
        items: p1a3PersonItems.map(([number, prompt, value]) => item(`l4-p1-a3-q${number}`, number, prompt, value, {
          instruction: "根据图片，填写回答句。",
          relatedAssets: ["l4-p1-a3-person-picture-practice"],
          inputSlots: sentenceSlot("输入回答句")
        }))
      }
    ],
    items: []
  },
  {
    id: "l4-p1-a4",
    section: "practice_1",
    order: 4,
    title: "用括号词回答",
    instruction: "仿照例句，用括号中的词语回答提问。",
    interaction: "dialogue_practice",
    answerUnit: "sentence",
    assets: [p59],
    layout: [{
      type: "example",
      content: {
        id: "l4-p1-a4-ex",
        label: "例",
        beforeParts: [text("森さんは どこに いますか。（"), repl("食堂", "place"), text("）")],
        after: [repl("食堂", "place"), text("に います。")]
      }
    }],
    items: p1a4Items.map(([number, prompt, value]) => item(`l4-p1-a4-q${number}`, number, prompt, value, {
      instruction: "使用括号中的词语填写回答句。",
      answerSource: "prompt",
      inputSlots: sentenceSlot("输入回答句"),
      acceptableAlternatives: number === "2" ? ["横浜に あります。"] : undefined
    }))
  },
  {
    id: "l4-p1-a5",
    section: "practice_1",
    order: 5,
    title: "看图听录音回答",
    instruction: "边看图边听录音，仿照例句回答提问。",
    interaction: "listening_answer",
    answerUnit: "sentence",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audioUrl("practice_1", 5),
      label: "练习 I · 5 教材录音",
      transcript: {
        text: "机の上に時計がありますか。はい、あります。部屋にいすがありますか。はい、あります。部屋に電話がありますか。いいえ、ありません。いすの下に猫がいますか。いいえ、いません。かばんは机の下ですか、いすの下ですか。机の下です。サッカーボールはいすの上ですか、いすの下ですか。いすの下です。",
        source: "asr",
        confidenceNote: "Azure ASR 将序号误识别为 D/いい/ああ/三/おお；已按教材 例、1-5 的固定问答顺序清理切分。",
        segments: [
          { itemNumber: "例", speaker: "甲/乙", text: "机の上に時計がありますか。はい、あります。" },
          { itemNumber: "1", speaker: "甲/乙", text: "部屋にいすがありますか。はい、あります。" },
          { itemNumber: "2", speaker: "甲/乙", text: "部屋に電話がありますか。いいえ、ありません。" },
          { itemNumber: "3", speaker: "甲/乙", text: "いすの下に猫がいますか。いいえ、いません。" },
          { itemNumber: "4", speaker: "甲/乙", text: "かばんは机の下ですか、いすの下ですか。机の下です。" },
          { itemNumber: "5", speaker: "甲/乙", text: "サッカーボールはいすの上ですか、いすの下ですか。いすの下です。" }
        ]
      }
    },
    assets: [p59, ...(p1a5Room ? [p1a5Room] : [])],
    displayAssets: ["l4-p1-a5-room-picture-practice"],
    layout: [{
      type: "example",
      content: {
        id: "l4-p1-a5-ex",
        label: "例",
        beforeParts: [text("机の 上に 時計が ありますか。")],
        after: [text("はい、あります。")]
      }
    }],
    items: p1a5Items.map(([number, prompt, value]) => item(`l4-p1-a5-q${number}`, number, prompt, value, {
      instruction: "听录音问题，结合图片填写回答句。",
      answerSource: "audio",
      relatedAssets: ["l4-p1-a5-room-picture-practice"],
      inputSlots: sentenceSlot("输入回答句")
    }))
  },
  {
    id: "l4-p1-a6",
    section: "practice_1",
    order: 6,
    title: "看图听录音回答",
    instruction: "边看图边听录音，仿照例句回答提问。",
    interaction: "listening_answer",
    answerUnit: "sentence",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audioUrl("practice_1", 6),
      label: "练习 I · 6 教材录音",
      transcript: {
        text: "森さんはどこにいますか。病院の前にいます。あそこにだれがいますか。小野さんがいます。本はどこにありますか。かばんの中にあります。机の上に何がありますか。新聞があります。箱の中に何がありますか。何もありません。図書室にだれがいますか。だれもいません。",
        source: "asr",
        confidenceNote: "Azure ASR 将序号误识别为 D/いい/R/三/数/おお，并把「箱」误作「数箱」；已结合图片标签和题型清理。",
        segments: [
          { itemNumber: "例", speaker: "甲/乙", text: "森さんはどこにいますか。病院の前にいます。" },
          { itemNumber: "1", speaker: "甲/乙", text: "あそこにだれがいますか。小野さんがいます。" },
          { itemNumber: "2", speaker: "甲/乙", text: "本はどこにありますか。かばんの中にあります。" },
          { itemNumber: "3", speaker: "甲/乙", text: "机の上に何がありますか。新聞があります。" },
          { itemNumber: "4", speaker: "甲/乙", text: "箱の中に何がありますか。何もありません。" },
          { itemNumber: "5", speaker: "甲/乙", text: "図書室にだれがいますか。だれもいません。" }
        ]
      }
    },
    assets: [p59, ...(p1a6Picture ? [p1a6Picture] : [])],
    displayAssets: ["l4-p1-a6-picture-practice"],
    layout: [{
      type: "example",
      content: {
        id: "l4-p1-a6-ex",
        label: "例",
        beforeParts: [text("森さんは どこに いますか。")],
        after: [text("病院の 前に います。")]
      }
    }],
    items: p1a6Items.map(([number, prompt, value]) => item(`l4-p1-a6-q${number}`, number, prompt, value, {
      instruction: "听录音问题，结合图片填写回答句。",
      answerSource: "audio",
      relatedAssets: ["l4-p1-a6-picture-practice"],
      inputSlots: sentenceSlot("输入回答句")
    }))
  },
  {
    id: "l4-p2-a1",
    section: "practice_2",
    order: 1,
    title: "看图判断正误",
    instruction: "看图，与图内容一致的在括号中画 ○，不一致的画 ×。",
    interaction: "true_false",
    answerUnit: "boolean",
    assets: [p60, ...(p2a1Scene ? [p2a1Scene] : [])],
    displayAssets: ["l4-p2-a1-scene-picture-practice"],
    layout: [{
      type: "example",
      content: {
        id: "l4-p2-a1-ex",
        label: "例",
        beforeParts: [text("あそこに ビルが あります。")],
        after: [text("○")]
      }
    }],
    items: p2a1Items.map(([number, prompt, value]) => trueFalseItem(`l4-p2-a1-q${number}`, number, prompt, value, ["l4-p2-a1-scene-picture-practice"]))
  },
  {
    id: "l4-p2-a2",
    section: "practice_2",
    order: 2,
    title: "选择正确答案",
    instruction: "在正确答案上画 ○。",
    interaction: "single_choice",
    answerUnit: "choice",
    assets: [p60],
    layout: [{
      type: "example",
      content: {
        id: "l4-p2-a2-ex",
        label: "例",
        beforeParts: [text("机の 上に 新聞が（あります・います）。")],
        after: [text("あります")]
      }
    }],
    items: p2a2Items.map(([number, prompt, choices, correct]) => choiceItem(`l4-p2-a2-q${number}`, number, prompt, [...choices], correct))
  },
  {
    id: "l4-p2-a3",
    section: "practice_2",
    order: 3,
    title: "看图听录音回答",
    instruction: "边看图边听录音，回答提问。",
    interaction: "listening_answer",
    answerUnit: "sentence",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audioUrl("practice_2", 3),
      label: "练习 II · 3 教材录音",
      transcript: {
        text: "駅の前に何がありますか。デパートがあります。デパートの隣に何がありますか。デパートの3階に何がありますか。受付はどこにありますか。食堂は5階にありますか。バーゲン会場は3階ですか、4階ですか。",
        source: "asr",
        confidenceNote: "Azure ASR 漏掉第 1 小题回答，其他小题只读问题；答案按录音问题与地图/楼层图共同确定。",
        segments: [
          { itemNumber: "例", speaker: "甲/乙", text: "駅の前に何がありますか。デパートがあります。" },
          { itemNumber: "1", speaker: "甲", text: "デパートの隣に何がありますか。" },
          { itemNumber: "2", speaker: "甲", text: "デパートの3階に何がありますか。" },
          { itemNumber: "3", speaker: "甲", text: "受付はどこにありますか。" },
          { itemNumber: "4", speaker: "甲", text: "食堂は5階にありますか。" },
          { itemNumber: "5", speaker: "甲", text: "バーゲン会場は3階ですか、4階ですか。" }
        ]
      }
    },
    assets: [p60, ...(p2a3Map ? [p2a3Map] : [])],
    displayAssets: ["l4-p2-a3-map-picture-practice"],
    layout: [{
      type: "example",
      content: {
        id: "l4-p2-a3-ex",
        label: "例",
        beforeParts: [text("駅の 前に 何が ありますか。")],
        after: [text("デパートが あります。")]
      }
    }],
    items: p2a3Items.map(([number, prompt, value]) => item(`l4-p2-a3-q${number}`, number, prompt, value, {
      instruction: "听录音问题，结合地图填写回答句。",
      answerSource: "audio",
      relatedAssets: ["l4-p2-a3-map-picture-practice"],
      inputSlots: sentenceSlot("输入回答句")
    }))
  },
  {
    id: "l4-p2-a4",
    section: "practice_2",
    order: 4,
    title: "中译日",
    instruction: "将下面的句子译成日语。",
    interaction: "translation",
    answerUnit: "sentence",
    assets: [p60],
    layout: [],
    items: [
      item("l4-p2-a4-q1", "1", "桌子上面有（一只）猫。", "机の 上に 猫が います。", { answerSource: "prompt" }),
      item("l4-p2-a4-q2", "2", "小野女士的家在哪儿？", "小野さんの 家は どこですか。", { answerSource: "prompt" }),
      item("l4-p2-a4-q3", "3", "房间里没有人。", "部屋に だれも いません。", { answerSource: "prompt" })
    ]
  }
];

export const lesson4Practice: LessonPractice = {
  lessonId: "lesson4",
  title: "第4课 部屋に 机と いすが あります",
  sourcePages: [
    { pageNo: 58, imagePath: page(58) },
    { pageNo: 59, imagePath: page(59) },
    { pageNo: 60, imagePath: page(60) }
  ],
  activities
};
