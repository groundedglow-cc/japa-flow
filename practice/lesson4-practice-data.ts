import type { AnswerSource, Choice, InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson4/page${pageNo}.webp`;
const audioUrl = (section: "practice_1" | "practice_2", order: number) => {
  const exerciseNo = section === "practice_1" ? 1 : 2;
  return `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit1/lesson4/Exe${exerciseNo}_${order}.mp3`;
};
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });


const sentenceSlot = (placeholder = "输入 1 个完整句子"): InputSlot[] => [
  { id: "answer", expectedUnit: "sentence", width: "long", placeholder }
];
const answerSlot = (placeholder = "只输入回答部分"): InputSlot[] => [
  { id: "answer", expectedUnit: "sentence", width: "long", placeholder }
];

const answer = (value: string, note?: string, acceptableAlternatives?: string[]) => ({
  slotValues: { answer: value },
  acceptableAlternatives,
  note
});

const item = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  value: string,
  options: {
    promptKana?: string;
    instruction?: string;
    answerSource?: AnswerSource;
    inputSlots?: InputSlot[];
    relatedAssets?: string[];
    renderHint?: PracticeItem["renderHint"];
    responseScope?: PracticeItem["responseScope"];
    responseScopeHint?: string;
    note?: string;
    acceptableAlternatives?: string[];
  } = {}
): PracticeItem => ({
  id,
  number,
  instruction: options.instruction || "",
  answerSource: options.answerSource || "example_transform",
  responseScope: options.responseScope,
  responseScopeHint: options.responseScopeHint,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  inputSlots: options.inputSlots || sentenceSlot(),
  answer: answer(value, options.note, options.acceptableAlternatives),
  relatedAssets: options.relatedAssets,
  renderHint: options.renderHint || "inline"
});

const choiceItem = (
  id: string,
  number: string,
  prompt: string,
  choices: string[],
  correct: string
): PracticeItem => {
  const mapped: Choice[] = choices.map((label, index) => ({ id: `${id}-c${index + 1}`, label }));
  const selected = mapped.find((choice) => choice.label === correct);
  return {
    id,
    number,
    instruction: "",
    answerSource: "prompt",
    responseScope: "choice_only",
    prompt: [text(prompt)],
    choices: mapped,
    answer: { choiceIds: selected ? [selected.id] : [] },
    renderHint: "inline"
  };
};

const trueFalseItem = (id: string, number: string, prompt: string, value: boolean, promptKana: string): PracticeItem => ({
  id,
  number,
  instruction: "",
  answerSource: "prompt",
  responseScope: "boolean_only",
  prompt: [text(prompt)],
  promptKana,
  choices: [
    { id: `${id}-true`, label: "○" },
    { id: `${id}-false`, label: "×" }
  ],
  answer: { boolean: value, choiceIds: [`${id}-${value ? "true" : "false"}`] },
  relatedAssets: ["l4-p2-a1-scene-picture-practice"],
  renderHint: "inline"
});

const p1a1Group1 = [
  ["1", "机", "つくえ", "部屋に 机が あります。"],
  ["2", "時計", "とけい", "部屋に 時計が あります。"],
  ["3", "本棚", "ほんだな", "部屋に 本棚が あります。"],
  ["4", "パソコン", "パソコン", "部屋に パソコンが あります。"],
  ["5", "ベッド", "ベッド", "部屋に ベッドが あります。"]
];
const p1a1Group2 = [
  ["6", "犬", "いぬ", "あそこに 犬が います。"],
  ["7", "男の 人", "おとこの ひと", "あそこに 男の 人が います。"],
  ["8", "女の 人", "おんなの ひと", "あそこに 女の 人が います。"],
  ["9", "子供", "こども", "あそこに 子供が います。"],
  ["10", "李さん", "りさん", "あそこに 李さんが います。"]
];
const p1a2Group1 = [
  ["1", "車の 前", "くるまの まえ", "車の 前に 何が ありますか。"],
  ["2", "いすの 上", "いすの うえ", "いすの 上に 何が ありますか。"],
  ["3", "箱の 中", "はこの なか", "箱の 中に 何が ありますか。"],
  ["4", "木の 下", "きの した", "木の 下に 何が ありますか。"]
];
const p1a2Group2 = [
  ["5", "会議室", "かいぎしつ", "会議室に だれが いますか。"],
  ["6", "林さんの 後ろ", "はやしさんの うしろ", "林さんの 後ろに だれが いますか。"],
  ["7", "李さんの 隣", "りさんの となり", "李さんの 隣に だれが いますか。"],
  ["8", "車の 中", "くるまの なか", "車の 中に だれが いますか。"]
];
const p1a3ObjectItems = [
  ["1", "テレビの 上に 何が ありますか。", "テレビの うえに なにが ありますか。", "カメラが あります。"],
  ["2", "いすの 下に 何が ありますか。", "いすの したに なにが ありますか。", "サッカーボールが あります。"],
  ["3", "本棚の 上に 何が ありますか。", "ほんだなの うえに なにが ありますか。", "時計が あります。"],
  ["4", "箱の 中に 何が ありますか。", "はこの なかに なにが ありますか。", "何も ありません。"]
];
const p1a3PersonItems = [
  ["5", "会議室に だれが いますか。", "かいぎしつに だれが いますか。", "森さんが います。"],
  ["6", "パソコンの 前に だれが いますか。", "パソコンの まえに だれが いますか。", "小野さんが います。"],
  ["7", "庭に だれが いますか。", "にわに だれが いますか。", "スミスさんが います。"],
  ["8", "車の 後ろに だれが いますか。", "くるまの うしろに だれが いますか。", "だれも いません。"]
];
const p1a4Items = [
  ["1", "生徒は 教室に いますか。（はい）", "せいとは きょうしつに いますか。（はい）", "はい、います。"],
  ["2", "林さんの 家は どこですか。（横浜）", "はやしさんの いえは どこですか。（よこはま）", "横浜です。"],
  ["3", "JC企画は どこに ありますか。（銀行の 隣）", "ジェーシーきかくは どこに ありますか。（ぎんこうの となり）", "銀行の 隣に あります。"],
  ["4", "森さんは 部屋に いますか。（いいえ）", "もりさんは へやに いますか。（いいえ）", "いいえ、いません。"]
];
const p1a5Items = [
  ["1", "部屋に いすが ありますか。", "へやに いすが ありますか。", "はい、あります。"],
  ["2", "部屋に 電話が ありますか。", "へやに でんわが ありますか。", "いいえ、ありません。"],
  ["3", "いすの 下に 猫が いますか。", "いすの したに ねこが いますか。", "いいえ、いません。"],
  ["4", "かばんは 机の 下ですか、いすの 下ですか。", "かばんは つくえの したですか、いすの したですか。", "机の 下です。"],
  ["5", "サッカーボールは いすの 上ですか、いすの 下ですか。", "サッカーボールは いすの うえですか、いすの したですか。", "いすの 下です。"]
];
const p1a6Items = [
  ["1", "あそこに だれが いますか。", "あそこに だれが いますか。", "小野さんが います。"],
  ["2", "本は どこに ありますか。", "ほんは どこに ありますか。", "かばんの 中に あります。"],
  ["3", "机の 上に 何が ありますか。", "つくえの うえに なにが ありますか。", "新聞が あります。"],
  ["4", "箱の 中に 何が ありますか。", "はこの なかに なにが ありますか。", "何も ありません。"],
  ["5", "図書室に だれが いますか。", "としょしつに だれが いますか。", "だれも いません。"]
];
const p2a1Items = [
  ["1", "車の 中に 犬が います。", "くるまの なかに いぬが います。", true],
  ["2", "いすの 上に 猫が います。", "いすの うえに ねこが います。", false],
  ["3", "木の 下に いすが あります。", "きの したに いすが あります。", true],
  ["4", "木の 下に だれも いません。", "きの したに だれも いません。", true],
  ["5", "男の 人は 車の 後ろに います。", "おとこの ひとは くるまの うしろに います。", false]
] as const;
const p2a2Items = [
  ["1", "箱の 中に（　　）が ありますか。", ["だれ", "何"], "何"],
  ["2", "田中さんの 後ろに だれも（　　）。", ["います", "いません"], "いません"],
  ["3", "いすの 下に（　　）ありません。", ["どこも", "何も"], "何も"],
  ["4", "机の 上に 辞書が あります。雑誌（　　）あります。", ["は", "も"], "も"],
  ["5", "ベッドの 上に（　　）が あります。", ["子供", "雑誌"], "雑誌"]
] as const;
const p2a3Items = [
  ["1", "デパートの 隣に 何が ありますか。", "デパートの となりに なにが ありますか。", "郵便局が あります。"],
  ["2", "デパートの 3階に 何が ありますか。", "デパートの さんかいに なにが ありますか。", "カメラ売り場が あります。"],
  ["3", "受付は どこに ありますか。", "うけつけは どこに ありますか。", "デパートの 1階に あります。"],
  ["4", "食堂は 5階に ありますか。", "しょくどうは ごかいに ありますか。", "はい、あります。"],
  ["5", "バーゲン会場は 3階ですか、4階ですか。", "バーゲンかいじょうは さんかいですか、よんかいですか。", "4階です。"]
];

const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";

const activities: PracticeActivity[] = [
  {
    id: "l4-p1-a1",
    section: "practice_1",
    order: 1,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    itemGroups: [
      {
        id: "l4-p1-a1-g1",
        example: {
          id: "l4-p1-a1-ex1",
          label: "[例1]",
          beforeParts: [repl("いす", "object", { kana: "いす" })],
          beforeKana: "いす",
          after: [text("部屋に ", { kana: "へやに" }), repl("いす", "object", { kana: "いす" }), text("が あります。")],
          afterKana: "へやに いすが あります。"
        },
        items: p1a1Group1.map(([number, prompt, promptKana, value]) => item(`l4-p1-a1-q${number}`, number, prompt, value, {
          promptKana,
          inputSlots: sentenceSlot("输入完整句子")
        }))
      },
      {
        id: "l4-p1-a1-g2",
        example: {
          id: "l4-p1-a1-ex2",
          label: "[例2]",
          beforeParts: [repl("猫", "personOrAnimal", { kana: "ねこ" })],
          beforeKana: "ねこ",
          after: [text("あそこに "), repl("猫", "personOrAnimal", { kana: "ねこ" }), text("が います。")],
          afterKana: "あそこに ねこが います。"
        },
        items: p1a1Group2.map(([number, prompt, promptKana, value]) => item(`l4-p1-a1-q${number}`, number, prompt, value, {
          promptKana,
          inputSlots: sentenceSlot("输入完整句子")
        }))
      }
    ],
    items: []
  },
  {
    id: "l4-p1-a2",
    section: "practice_1",
    order: 2,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    itemGroups: [
      {
        id: "l4-p1-a2-g1",
        example: {
          id: "l4-p1-a2-ex1",
          label: "[例1]",
          beforeParts: [repl("机の 上", "place", { kana: "つくえの うえ" })],
          beforeKana: "つくえの うえ",
          after: [repl("机の 上", "place", { kana: "つくえの うえ" }), text("に 何が ありますか。", { kana: "に なにが ありますか。" })],
          afterKana: "つくえの うえに なにが ありますか。"
        },
        items: p1a2Group1.map(([number, prompt, promptKana, value]) => item(`l4-p1-a2-q${number}`, number, prompt, value, {
          promptKana,
          inputSlots: sentenceSlot("输入完整问句")
        }))
      },
      {
        id: "l4-p1-a2-g2",
        example: {
          id: "l4-p1-a2-ex2",
          label: "[例2]",
          beforeParts: [repl("あそこ", "place")],
          beforeKana: "あそこ",
          after: [repl("あそこ", "place"), text("に だれが いますか。")],
          afterKana: "あそこに だれが いますか。"
        },
        items: p1a2Group2.map(([number, prompt, promptKana, value]) => item(`l4-p1-a2-q${number}`, number, prompt, value, {
          promptKana,
          inputSlots: sentenceSlot("输入完整问句")
        }))
      }
    ],
    items: []
  },
  {
    id: "l4-p1-a3",
    section: "practice_1",
    order: 3,
    title: "看图，仿照例句回答提问。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    assets: [
      { id: "l4-p1-a3-object-picture-practice", kind: "exercise_image", imagePath: exerciseImage("book1_lesson4_1_3_1.png") },
      { id: "l4-p1-a3-person-picture-practice", kind: "exercise_image", imagePath: exerciseImage("book1_lesson4_1_3_2.png") }
    ],
    layout: [],
    itemGroups: [
      {
        id: "l4-p1-a3-g1",
        displayAssets: ["l4-p1-a3-object-picture-practice"],
        example: {
          id: "l4-p1-a3-ex1",
          label: "[例1]",
          beforeParts: [text("いすの 上に 何が ありますか。", { kana: "いすの うえに なにが ありますか。" })],
          beforeKana: "いすの うえに なにが ありますか。",
          after: [text("本が あります。", { kana: "ほんが あります。" })],
          afterKana: "ほんが あります。"
        },
        items: p1a3ObjectItems.map(([number, prompt, promptKana, value]) => item(`l4-p1-a3-q${number}`, number, prompt, value, {
          promptKana,
          answerSource: "prompt",
          inputSlots: answerSlot(),
          relatedAssets: ["l4-p1-a3-object-picture-practice"]
        }))
      },
      {
        id: "l4-p1-a3-g2",
        displayAssets: ["l4-p1-a3-person-picture-practice"],
        example: {
          id: "l4-p1-a3-ex2",
          label: "[例2]",
          beforeParts: [text("図書室に だれが いますか。", { kana: "としょしつに だれが いますか。" })],
          beforeKana: "としょしつに だれが いますか。",
          after: [text("李さんが います。", { kana: "りさんが います。" })],
          afterKana: "りさんが います。"
        },
        items: p1a3PersonItems.map(([number, prompt, promptKana, value]) => item(`l4-p1-a3-q${number}`, number, prompt, value, {
          promptKana,
          answerSource: "prompt",
          inputSlots: answerSlot(),
          relatedAssets: ["l4-p1-a3-person-picture-practice"]
        }))
      }
    ],
    items: []
  },
  {
    id: "l4-p1-a4",
    section: "practice_1",
    order: 4,
    title: "仿照例句，用（　　）中的词语回答提问。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    layout: [{
      type: "example",
      content: {
        id: "l4-p1-a4-ex",
        label: "[例]",
        beforeParts: [text("森さんは どこに いますか。（", { kana: "もりさんは どこに いますか。（" }), repl("食堂", "place", { kana: "しょくどう" }), text("）")],
        beforeKana: "もりさんは どこに いますか。（しょくどう）",
        after: [repl("食堂", "place", { kana: "しょくどう" }), text("に います。")],
        afterKana: "しょくどうに います。"
      }
    }],
    items: p1a4Items.map(([number, prompt, promptKana, value]) => item(`l4-p1-a4-q${number}`, number, prompt, value, {
      promptKana,
      answerSource: "prompt",
      inputSlots: answerSlot(),
      acceptableAlternatives: number === "2" ? ["横浜に あります。"] : undefined
    }))
  },
  {
    id: "l4-p1-a5",
    section: "practice_1",
    order: 5,
    title: "边看图边听录音，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audioUrl("practice_1", 5),
      label: "练习 I · 5 教材录音",
      transcript: {
        text: "机の上に時計がありますか。はい、あります。部屋にいすがありますか。はい、あります。部屋に電話がありますか。いいえ、ありません。いすの下に猫がいますか。いいえ、いません。かばんは机の下ですか、いすの下ですか。机の下です。サッカーボールはいすの上ですか、いすの下ですか。いすの下です。",
        source: "asr",
        confidenceNote: "ASR 将序号误识别为 D/いい/ああ/三/おお；已按教材 [例]、1-5 的固定问答顺序清理切分。",
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
    assets: [
      { id: "l4-p1-a5-room-picture-practice", kind: "exercise_image", imagePath: exerciseImage("book1_lesson4_1_5.png") }
    ],
    displayAssets: ["l4-p1-a5-room-picture-practice"],
    layout: [{
      type: "example",
      content: {
        id: "l4-p1-a5-ex",
        label: "[例]",
        beforeParts: [text("机の 上に 時計が ありますか。", { kana: "つくえの うえに とけいが ありますか。" })],
        beforeKana: "つくえの うえに とけいが ありますか。",
        after: [text("はい、あります。")],
        afterKana: "はい、あります。"
      }
    }],
    items: p1a5Items.map(([number, , , value]) => item(`l4-p1-a5-q${number}`, number, "听录音并回答。", value, {
      answerSource: "audio",
      inputSlots: answerSlot(),
      relatedAssets: ["l4-p1-a5-room-picture-practice"]
    }))
  },
  {
    id: "l4-p1-a6",
    section: "practice_1",
    order: 6,
    title: "边看图边听录音，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audioUrl("practice_1", 6),
      label: "练习 I · 6 教材录音",
      transcript: {
        text: "森さんはどこにいますか。病院の前にいます。あそこにだれがいますか。小野さんがいます。本はどこにありますか。かばんの中にあります。机の上に何がありますか。新聞があります。箱の中に何がありますか。何もありません。図書室にだれがいますか。だれもいません。",
        source: "asr",
        confidenceNote: "ASR 将序号误识别为 D/いい/ああ/三/おお，并把「箱」误作「数箱」；已结合图片标签和题型清理。",
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
    assets: [
      { id: "l4-p1-a6-picture-practice", kind: "exercise_image", imagePath: exerciseImage("book1_lesson4_1_6.png") }
    ],
    displayAssets: ["l4-p1-a6-picture-practice"],
    layout: [{
      type: "example",
      content: {
        id: "l4-p1-a6-ex",
        label: "[例]",
        beforeParts: [text("森さんは どこに いますか。", { kana: "もりさんは どこに いますか。" })],
        beforeKana: "もりさんは どこに いますか。",
        after: [text("病院の 前に います。", { kana: "びょういんの まえに います。" })],
        afterKana: "びょういんの まえに います。"
      }
    }],
    items: p1a6Items.map(([number, , , value]) => item(`l4-p1-a6-q${number}`, number, "听录音并回答。", value, {
      answerSource: "audio",
      inputSlots: answerSlot(),
      relatedAssets: ["l4-p1-a6-picture-practice"]
    }))
  },
  {
    id: "l4-p2-a1",
    section: "practice_2",
    order: 1,
    title: "看图，与图内容一致的在（　　）中画○，不一致的画×。",
    instruction: "",
    interaction: "true_false",
    answerUnit: "boolean",
    responseScope: "boolean_only",
    assets: [
      { id: "l4-p2-a1-scene-picture-practice", kind: "exercise_image", imagePath: exerciseImage("book1_lesson4_2_1.png") }
    ],
    displayAssets: ["l4-p2-a1-scene-picture-practice"],
    layout: [{
      type: "example",
      content: {
        id: "l4-p2-a1-ex",
        label: "[例]",
        beforeParts: [text("あそこに ビルが あります。", { kana: "あそこに ビルが あります。" })],
        beforeKana: "あそこに ビルが あります。",
        after: [text("○")]
      }
    }],
    items: p2a1Items.map(([number, prompt, promptKana, value]) => trueFalseItem(`l4-p2-a1-q${number}`, number, prompt, value, promptKana))
  },
  {
    id: "l4-p2-a2",
    section: "practice_2",
    order: 2,
    title: "在正确答案上画○。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    layout: [{
      type: "example",
      content: {
        id: "l4-p2-a2-ex",
        label: "[例]",
        beforeParts: [text("机の 上に 新聞が（あります・います）。", { kana: "つくえの うえに しんぶんが あります います。" })],
        beforeKana: "つくえの うえに しんぶんが あります います。",
        after: [text("あります")]
      }
    }],
    items: p2a2Items.map(([number, prompt, choices, correct]) => choiceItem(`l4-p2-a2-q${number}`, number, prompt, [...choices], correct))
  },
  {
    id: "l4-p2-a3",
    section: "practice_2",
    order: 3,
    title: "边看图边听录音，回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audioUrl("practice_2", 3),
      label: "练习 II · 3 教材录音",
      transcript: {
        text: "駅の前に何がありますか。デパートがあります。デパートの隣に何がありますか。デパートの3階に何がありますか。受付はどこにありますか。食堂は5階にありますか。バーゲン会場は3階ですか、4階ですか。",
        source: "asr",
        confidenceNote: "ASR 将序号误识别为 D/いい/R/三/数/おお；第 1-5 小题录音只读问题，答案按地图和楼层图确定。",
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
    assets: [
      { id: "l4-p2-a3-map-picture-practice", kind: "exercise_image", imagePath: exerciseImage("book1_lesson4_2_3.png") }
    ],
    displayAssets: ["l4-p2-a3-map-picture-practice"],
    layout: [{
      type: "example",
      content: {
        id: "l4-p2-a3-ex",
        label: "[例]",
        beforeParts: [text("駅の 前に 何が ありますか。", { kana: "えきの まえに なにが ありますか。" })],
        beforeKana: "えきの まえに なにが ありますか。",
        after: [text("デパートが あります。", { kana: "デパートが あります。" })],
        afterKana: "デパートが あります。"
      }
    }],
    items: p2a3Items.map(([number, , , value]) => item(`l4-p2-a3-q${number}`, number, "听录音并回答。", value, {
      answerSource: "audio",
      inputSlots: answerSlot(),
      relatedAssets: ["l4-p2-a3-map-picture-practice"]
    }))
  },
  {
    id: "l4-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
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
