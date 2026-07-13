import type { AnswerSource, ImageAsset, InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";
import { lesson1ImageCrops } from "./lesson1-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson1/page${pageNo}.webp`;

const page28Asset: ImageAsset = {
  id: "l1-page28-practice-source",
  kind: "source_crop",
  imagePath: page(28),
  label: "练习 I 第 1-4 题原页"
};

const page29Asset: ImageAsset = {
  id: "l1-page29-practice-source",
  kind: "source_crop",
  imagePath: page(29),
  label: "练习 I 第 5-7 题原页"
};

const page30Asset: ImageAsset = {
  id: "l1-page30-practice-source",
  kind: "source_crop",
  imagePath: page(30),
  label: "练习 II 原页"
};

const practice4PictureAssets = lesson1ImageCrops.assets.filter((asset) => asset.id === "l1-p1-a4-picture-practice");

const practice4Cards = [
  { number: "1", name: "小野", nationality: "日本人", role: "JC企画の社員" },
  { number: "2", name: "デュポン", nationality: "フランス人", role: "東京大学の教授" },
  { number: "3", name: "キム", nationality: "韓国人", role: "研修生" },
  { number: "4", name: "スミス", nationality: "アメリカ人", role: "北京旅行社の社員" }
];

const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({
  type: "text",
  text: value,
  ...options
});

const replacementText = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });

const sentenceSlot = (placeholder = "输入完整句子") => [
  {
    id: "answer",
    expectedUnit: "sentence" as const,
    width: "long" as const,
    placeholder
  }
];

const dialogueSlot = (placeholder = "按例句格式输入完整对话") => [
  {
    id: "answer",
    expectedUnit: "dialogue" as const,
    width: "long" as const,
    placeholder,
    multiline: true,
    rows: 4
  }
];

const answerItem = (
  id: string,
  number: string,
  promptText: string,
  answer: string,
  relatedAssets: string[] = [],
  exampleGroupId = "",
  options: {
    instruction?: string;
    answerSource?: AnswerSource;
    inputSlots?: InputSlot[];
    promptParts?: PromptPart[];
    renderHint?: PracticeItem["renderHint"];
  } = {}
): PracticeItem => ({
  id,
  number,
  exampleGroupId: exampleGroupId || undefined,
  instruction: options.instruction || "填写 1 个完整句子。",
  answerSource: options.answerSource || "example_transform",
  prompt: options.promptParts || [text(promptText)],
  inputSlots: options.inputSlots || sentenceSlot(),
  answer: { slotValues: { answer } },
  relatedAssets,
  renderHint: options.renderHint || "inline"
});

const wordItem = (
  id: string,
  number: string,
  promptText: string,
  answer: string,
  relatedAssets: string[] = []
): PracticeItem => ({
  id,
  number,
  instruction: "填写 1 个词语。",
  answerSource: "prompt",
  prompt: [text(promptText)],
  inputSlots: [
    {
      id: "answer",
      expectedUnit: "word",
      width: "medium",
      placeholder: "输入词语"
    }
  ],
  answer: { slotValues: { answer } },
  relatedAssets,
  renderHint: "inline"
});

const audioSentenceItem = (id: string, number: string, answer = ""): PracticeItem => ({
  id,
  number,
  instruction: "听录音，填写你听到的 1 个完整句子。录音补充后，正确答案应填写为该录音的转写文本。",
  answerSource: "audio",
  prompt: [text("听录音并写出完整句子。")],
  inputSlots: sentenceSlot("输入听到的完整句子"),
  answer: answer ? { slotValues: { answer } } : undefined,
  relatedAssets: [page28Asset.id],
  renderHint: "inline"
});

const practice1Activity2Answers = [
  "李さんは中国人です。",
  "キムさんは韓国人です。",
  "森さんは課長ではありません。",
  "わたしは田中ではありません。",
  "スミスさんはフランス人ではありません。"
];

const practice1Activity5Answers = [
  "はい、そうです。",
  "いいえ、違います。",
  "はい、そうです。",
  "いいえ、違います。",
  "はい、そうです。"
];

const practice2Activity3Items = [
  {
    question: "あなたは李さんですか。",
    modelAnswers: ["はい、李です。", "いいえ、李ではありません。"],
    acceptableAlternatives: ["はい、そうです。", "いいえ、違います。", "いいえ、ちがいます。"]
  },
  {
    question: "あなたは日本人ですか。",
    modelAnswers: ["はい、日本人です。", "いいえ、日本人ではありません。"],
    acceptableAlternatives: ["はい、そうです。", "いいえ、違います。", "いいえ、ちがいます。"]
  },
  {
    question: "あなたは学生ですか。",
    modelAnswers: ["はい、学生です。", "いいえ、学生ではありません。"],
    acceptableAlternatives: ["はい、そうです。", "いいえ、違います。", "いいえ、ちがいます。"]
  },
  {
    question: "あなたはJC企画の社員ですか。",
    modelAnswers: ["はい、JC企画の社員です。", "いいえ、JC企画の社員ではありません。"],
    acceptableAlternatives: ["はい、そうです。", "いいえ、違います。", "いいえ、ちがいます。"]
  }
];

const dialogueItem = (
  id: string,
  number: string,
  promptText: string,
  answer: string,
  relatedAssets: string[] = [],
  instruction = "参考例句，替换提示词，填写完整对话。"
): PracticeItem => answerItem(id, number, promptText, answer, relatedAssets, "", {
  instruction,
  inputSlots: dialogueSlot(),
  renderHint: "dialogue"
});

const substitutionSentenceItem = (
  id: string,
  number: string,
  subject: string,
  identity: string,
  answer: string,
  exampleGroupId: string
): PracticeItem => answerItem(id, number, `${subject}／${identity}`, answer, [page28Asset.id], exampleGroupId, {
  instruction: "根据两个下划线替换词，填写 1 个完整句子。",
  promptParts: [
    replacementText(subject, "subject"),
    text("／"),
    replacementText(identity, "identity")
  ]
});

const practice1Activity1: PracticeActivity = {
  id: "l1-p1-a1",
  section: "practice_1",
  order: 1,
  title: "替换画线部分",
  instruction: "仿照例句替换画线部分进行练习。",
  interaction: "pattern_substitution",
  answerUnit: "sentence",
  layout: [],
  itemGroups: [
    {
      id: "l1-p1-a1-example-1",
      title: "例句 1：肯定句",
      instruction: "使用「A は B です」替换画线部分。",
      example: {
        id: "l1-p1-a1-ex1",
        label: "例 1",
        before: "わたし／日本人",
        beforeParts: [
          replacementText("わたし", "subject"),
          text("／"),
          replacementText("日本人", "identity", { kana: "にほんじん" })
        ],
        substitutionSlots: [
          { key: "subject", label: "主语", expectedUnit: "phrase" },
          { key: "identity", label: "身份/国籍", expectedUnit: "phrase" }
        ],
        after: [
          replacementText("わたし", "subject"),
          text("は "),
          replacementText("日本人", "identity", { kana: "にほんじん" }),
          text("です。")
        ]
      },
      items: [
        substitutionSentenceItem("l1-p1-a1-q1", "1", "李さん", "中国人", "李さんは中国人です。", "l1-p1-a1-example-1"),
        substitutionSentenceItem("l1-p1-a1-q2", "2", "キムさん", "韓国人", "キムさんは韓国人です。", "l1-p1-a1-example-1"),
        substitutionSentenceItem("l1-p1-a1-q3", "3", "森さん", "会社員", "森さんは会社員です。", "l1-p1-a1-example-1"),
        substitutionSentenceItem("l1-p1-a1-q4", "4", "林さん", "学生", "林さんは学生です。", "l1-p1-a1-example-1"),
        substitutionSentenceItem("l1-p1-a1-q5", "5", "スミスさん", "アメリカ人", "スミスさんはアメリカ人です。", "l1-p1-a1-example-1")
      ]
    },
    {
      id: "l1-p1-a1-example-2",
      title: "例句 2：否定句",
      instruction: "使用「A は B では ありません」替换画线部分。",
      example: {
        id: "l1-p1-a1-ex2",
        label: "例 2",
        before: "李さん／日本人",
        beforeParts: [
          replacementText("李さん", "subject"),
          text("／"),
          replacementText("日本人", "identity", { kana: "にほんじん" })
        ],
        substitutionSlots: [
          { key: "subject", label: "主语", expectedUnit: "phrase" },
          { key: "identity", label: "身份/国籍", expectedUnit: "phrase" }
        ],
        after: [
          replacementText("李さん", "subject"),
          text("は "),
          replacementText("日本人", "identity", { kana: "にほんじん" }),
          text("では ありません。")
        ]
      },
      items: [
        substitutionSentenceItem("l1-p1-a1-q6", "6", "小野さん", "中国人", "小野さんは中国人ではありません。", "l1-p1-a1-example-2"),
        substitutionSentenceItem("l1-p1-a1-q7", "7", "森さん", "課長", "森さんは課長ではありません。", "l1-p1-a1-example-2"),
        substitutionSentenceItem("l1-p1-a1-q8", "8", "わたし", "田中", "わたしは田中ではありません。", "l1-p1-a1-example-2"),
        substitutionSentenceItem("l1-p1-a1-q9", "9", "李さん", "留学生", "李さんは留学生ではありません。", "l1-p1-a1-example-2"),
        substitutionSentenceItem("l1-p1-a1-q10", "10", "スミスさん", "フランス人", "スミスさんはフランス人ではありません。", "l1-p1-a1-example-2")
      ]
    }
  ],
  items: [
    substitutionSentenceItem("l1-p1-a1-q1", "1", "李さん", "中国人", "李さんは中国人です。", "l1-p1-a1-example-1"),
    substitutionSentenceItem("l1-p1-a1-q2", "2", "キムさん", "韓国人", "キムさんは韓国人です。", "l1-p1-a1-example-1"),
    substitutionSentenceItem("l1-p1-a1-q3", "3", "森さん", "会社員", "森さんは会社員です。", "l1-p1-a1-example-1"),
    substitutionSentenceItem("l1-p1-a1-q4", "4", "林さん", "学生", "林さんは学生です。", "l1-p1-a1-example-1"),
    substitutionSentenceItem("l1-p1-a1-q5", "5", "スミスさん", "アメリカ人", "スミスさんはアメリカ人です。", "l1-p1-a1-example-1"),
    substitutionSentenceItem("l1-p1-a1-q6", "6", "小野さん", "中国人", "小野さんは中国人ではありません。", "l1-p1-a1-example-2"),
    substitutionSentenceItem("l1-p1-a1-q7", "7", "森さん", "課長", "森さんは課長ではありません。", "l1-p1-a1-example-2"),
    substitutionSentenceItem("l1-p1-a1-q8", "8", "わたし", "田中", "わたしは田中ではありません。", "l1-p1-a1-example-2"),
    substitutionSentenceItem("l1-p1-a1-q9", "9", "李さん", "留学生", "李さんは留学生ではありません。", "l1-p1-a1-example-2"),
    substitutionSentenceItem("l1-p1-a1-q10", "10", "スミスさん", "フランス人", "スミスさんはフランス人ではありません。", "l1-p1-a1-example-2")
  ]
};

const practice1Activity2: PracticeActivity = {
  id: "l1-p1-a2",
  section: "practice_1",
  order: 2,
  title: "听录音重复",
  instruction: "听录音，写出听到的完整句子；提交后与录音转写答案对比。",
  interaction: "listening_answer",
  answerUnit: "sentence",
  requiresAudio: true,
  audio: {
    source: "textbook_exercise",
    transcript: {
      source: "asr",
      text: "わたしは李です。李さんは中国人です。キムさんは韓国人です。森さんは課長ではありません。わたしは田中ではありません。スミスさんはフランス人ではありません。",
      segments: [
        { text: "わたしは李です。" },
        { itemNumber: "1", text: "李さんは中国人です。" },
        { itemNumber: "2", text: "キムさんは韓国人です。" },
        { itemNumber: "3", text: "森さんは課長ではありません。" },
        { itemNumber: "4", text: "わたしは田中ではありません。" },
        { itemNumber: "5", text: "スミスさんはフランス人ではありません。" }
      ],
      confidenceNote: "Azure ASR returned repeated readings and small noise tokens; segments were normalized by removing duplicates and matching the activity example plus five item slots."
    }
  },
  layout: [
    {
      type: "example",
      content: {
        before: "例",
        after: [text("わたしは　李です。")]
      }
    }
  ],
  items: practice1Activity2Answers.map((answer, index) => audioSentenceItem(`l1-p1-a2-q${index + 1}`, String(index + 1), answer))
};

const practice1Activity3: PracticeActivity = {
  id: "l1-p1-a3",
  section: "practice_1",
  order: 3,
  title: "替换会话",
  instruction: "仿照例句替换画线部分练习会话。",
  interaction: "dialogue_practice",
  answerUnit: "dialogue",
  layout: [
    {
      type: "dialogue",
      lines: [
        { speaker: "甲", parts: [text("李さんですか。")] },
        { speaker: "乙1", parts: [text("はい、李です。")] },
        { speaker: "乙2", parts: [text("いいえ、李では　ありません。")] }
      ]
    }
  ],
  items: [
    dialogueItem("l1-p1-a3-q1", "1", "替换词：森。填写甲、乙1、乙2三行完整会话。", "甲：森さんですか。\n乙1：はい、森です。\n乙2：いいえ、森ではありません。", [page28Asset.id]),
    dialogueItem("l1-p1-a3-q2", "2", "替换词：小野。填写甲、乙1、乙2三行完整会话。", "甲：小野さんですか。\n乙1：はい、小野です。\n乙2：いいえ、小野ではありません。", [page28Asset.id]),
    dialogueItem("l1-p1-a3-q3", "3", "替换词：デュポン。填写甲、乙1、乙2三行完整会话。", "甲：デュポンさんですか。\n乙1：はい、デュポンです。\n乙2：いいえ、デュポンではありません。", [page28Asset.id]),
    dialogueItem("l1-p1-a3-q4", "4", "替换词：ジョンソン。填写甲、乙1、乙2三行完整会话。", "甲：ジョンソンさんですか。\n乙1：はい、ジョンソンです。\n乙2：いいえ、ジョンソンではありません。", [page28Asset.id])
  ]
};

const practice1Activity4: PracticeActivity = {
  id: "l1-p1-a4",
  section: "practice_1",
  order: 4,
  title: "看图会话",
  instruction: "看图，仿照例句替换画线部分练习会话。",
  interaction: "dialogue_practice",
  answerUnit: "dialogue",
  assets: practice4PictureAssets,
  displayAssets: ["l1-p1-a4-picture-practice"],
  layout: [
    {
      type: "dialogue",
      lines: [
        { speaker: "甲", parts: [text("李さんは 中国人ですか。")] },
        { speaker: "乙", parts: [text("はい、中国人です。")] },
        { speaker: "甲", parts: [text("李さんは 学生ですか。")] },
        { speaker: "乙", parts: [text("いいえ、学生では　ありません。会社員です。")] }
      ]
    }
  ],
  items: practice4Cards.map((card) => ({
    id: `l1-p1-a4-q${card.number}`,
    number: card.number,
    instruction: "看人物卡，仿照例句填写多句完整问答。",
    answerSource: "example_transform" as const,
    prompt: [text(`人物卡 ${card.number}。填写完整问答。`)],
    inputSlots: dialogueSlot("输入多句完整问答"),
    answer: {
      slotValues: {
        answer: [
          `甲：${card.name}さんは${card.nationality}ですか。`,
          `乙：はい、${card.nationality}です。`,
          `甲：${card.name}さんは学生ですか。`,
          `乙：いいえ、学生ではありません。${card.role}です。`
        ].join("\n")
      }
    },
    relatedAssets: [page28Asset.id],
    renderHint: "dialogue"
  }))
};

const practice1Activity5: PracticeActivity = {
  id: "l1-p1-a5",
  section: "practice_1",
  order: 5,
  title: "听录音回答",
  instruction: "边看第 4 题的图边听录音，仿照例句回答提问。",
  interaction: "listening_answer",
  answerUnit: "sentence",
  requiresAudio: true,
  audio: {
    source: "textbook_exercise",
    transcript: {
      source: "asr",
      text: "李さんは中国人ですか。はい、そうです。李さんは学生ですか。いいえ、違います。小野さんは日本人ですか。はい、そうです。小野さんは学生ですか。いいえ、違います。デュポンさんは東京大学の教授ですか。はい、そうです。キムさんは中国人ですか。いいえ、違います。スミスさんはアメリカ人ですか。はい、そうです。",
      segments: [
        { text: "李さんは中国人ですか。はい、そうです。" },
        { text: "李さんは学生ですか。いいえ、違います。" },
        { itemNumber: "1", text: "小野さんは日本人ですか。はい、そうです。" },
        { itemNumber: "2", text: "小野さんは学生ですか。いいえ、違います。" },
        { itemNumber: "3", text: "デュポンさんは東京大学の教授ですか。はい、そうです。" },
        { itemNumber: "4", text: "キムさんは中国人ですか。いいえ、違います。" },
        { itemNumber: "5", text: "スミスさんはアメリカ人ですか。はい、そうです。" }
      ],
      confidenceNote: "Azure ASR noise tokens were removed. Answers were inferred from the transcribed questions plus the practice I · 4 person cards."
    }
  },
  layout: [
    { type: "image_grid", assets: [page28Asset], columns: 1 },
    {
      type: "example",
      content: {
        before: "李さんは 中国人ですか。",
        after: [text("はい、そうです。")]
      }
    },
    {
      type: "example",
      content: {
        before: "李さんは 学生ですか。",
        after: [text("いいえ、ちがいます。")]
      }
    }
  ],
  items: practice1Activity5Answers.map((answer, index) => ({
    id: `l1-p1-a5-q${index + 1}`,
    number: String(index + 1),
    instruction: "听录音中的问题，填写 1 个完整回答句。",
    answerSource: "audio" as const,
    prompt: [text("听录音问题并写出回答。")],
    inputSlots: sentenceSlot("输入 1 个完整回答句"),
    answer: { slotValues: { answer } },
    relatedAssets: [page29Asset.id],
    renderHint: "inline"
  }))
};

const practice1Activity6: PracticeActivity = {
  id: "l1-p1-a6",
  section: "practice_1",
  order: 6,
  title: "身份确认会话",
  instruction: "仿照例句替换画线部分练习会话。",
  interaction: "dialogue_practice",
  answerUnit: "dialogue",
  layout: [
    {
      type: "dialogue",
      lines: [
        { speaker: "甲", parts: [text("李さんは JC企画の 社員ですか。")] },
        { speaker: "乙", parts: [text("はい、そうです。")] }
      ]
    },
    {
      type: "dialogue",
      lines: [
        { speaker: "甲", parts: [text("森さんは 学生ですか。")] },
        { speaker: "乙", parts: [text("いいえ、ちがいます。")] }
      ]
    }
  ],
  items: [
    dialogueItem("l1-p1-a6-q1", "1", "キム／JC企画の研修生。填写甲、乙两行完整会话。", "甲：キムさんはJC企画の研修生ですか。\n乙：はい、そうです。", [page29Asset.id]),
    dialogueItem("l1-p1-a6-q2", "2", "ジョンソン／東京大学の学生。填写甲、乙两行完整会话。", "甲：ジョンソンさんは東京大学の学生ですか。\n乙：はい、そうです。", [page29Asset.id]),
    dialogueItem("l1-p1-a6-q3", "3", "デュポン／東京大学の教授。填写甲、乙两行完整会话。", "甲：デュポンさんは東京大学の教授ですか。\n乙：はい、そうです。", [page29Asset.id]),
    dialogueItem("l1-p1-a6-q4", "4", "中村／JC企画の社長。填写甲、乙两行完整会话。", "甲：中村さんはJC企画の社長ですか。\n乙：はい、そうです。", [page29Asset.id]),
    dialogueItem("l1-p1-a6-q5", "5", "ジョンソン／フランス人。填写甲、乙两行完整会话。", "甲：ジョンソンさんはフランス人ですか。\n乙：いいえ、ちがいます。", [page29Asset.id]),
    dialogueItem("l1-p1-a6-q6", "6", "張／北京大学の学生。填写甲、乙两行完整会话。", "甲：張さんは北京大学の学生ですか。\n乙：はい、そうです。", [page29Asset.id]),
    dialogueItem("l1-p1-a6-q7", "7", "森／JC企画の課長。填写甲、乙两行完整会话。", "甲：森さんはJC企画の課長ですか。\n乙：はい、そうです。", [page29Asset.id]),
    dialogueItem("l1-p1-a6-q8", "8", "吉田／日中商事の社長。填写甲、乙两行完整会话。", "甲：吉田さんは日中商事の社長ですか。\n乙：はい、そうです。", [page29Asset.id])
  ]
};

const practice1Activity7: PracticeActivity = {
  id: "l1-p1-a7",
  section: "practice_1",
  order: 7,
  title: "听录音介绍人物",
  instruction: "听录音，仿照例句替换画线部分进行练习。",
  interaction: "listening_answer",
  answerUnit: "dialogue",
  requiresAudio: true,
  audio: { source: "textbook_exercise" },
  layout: [
    {
      type: "dialogue",
      lines: [
        { speaker: "甲", parts: [text("李さんですか。")] },
        { speaker: "乙", parts: [text("はい、李です。どうぞ よろしく。")] },
        { speaker: "甲", parts: [text("こんにちは、森健太郎です。よろしく お願いします。")] }
      ]
    }
  ],
  items: [
    dialogueItem("l1-p1-a7-q1", "1", "張／小野緑。填写三行完整会话。", "甲：張さんですか。\n乙：はい、張です。どうぞよろしく。\n甲：こんにちは、小野緑です。よろしくお願いします。", [page29Asset.id]),
    dialogueItem("l1-p1-a7-q2", "2", "スミス／李秀麗。填写三行完整会话。", "甲：スミスさんですか。\n乙：はい、スミスです。どうぞよろしく。\n甲：こんにちは、李秀麗です。よろしくお願いします。", [page29Asset.id])
  ]
};

const practice2Activities: PracticeActivity[] = [
  {
    id: "l1-p2-a1",
    section: "practice_2",
    order: 1,
    title: "填入适当词语",
    instruction: "在括号中填入适当的词语。",
    interaction: "fill_blank",
    answerUnit: "word",
    layout: [
      {
        type: "example",
        content: {
          before: "あなたは（日本人）ですか。",
          after: [text("はい、日本人です。")]
        }
      }
    ],
    items: [
      wordItem("l1-p2-a1-q1", "1", "李さんは（　）ですか。——はい、会社員です。", "会社員", [page30Asset.id]),
      wordItem("l1-p2-a1-q2", "2", "あなたは（　）ですか。——いいえ、小野ではありません。", "小野", [page30Asset.id]),
      wordItem("l1-p2-a1-q3", "3", "森さんは（　）の社員ですか。——はい、JC企画の社員です。", "JC企画", [page30Asset.id]),
      wordItem("l1-p2-a1-q4", "4", "キムさんは学生ですか。——（　）、学生ではありません。", "いいえ", [page30Asset.id]),
      wordItem("l1-p2-a1-q5", "5", "スミスさんはアメリカ人ですか。——はい、（　）です。", "アメリカ人", [page30Asset.id])
    ]
  },
  {
    id: "l1-p2-a2",
    section: "practice_2",
    order: 2,
    title: "选择正确答案",
    instruction: "在正确答案上画圈。",
    interaction: "single_choice",
    answerUnit: "choice",
    layout: [
      {
        type: "example",
        content: {
          before: "李さんは中国人ですか。",
          after: [text("はい"), text(" / いいえ")]
        }
      }
    ],
    items: [
      {
        id: "l1-p2-a2-q1",
        number: "1",
        prompt: [text("キムさんは中国人ですか。——（はい・いいえ）、中国人ではありません。")],
        instruction: "选择 1 个正确选项。",
        answerSource: "prompt",
        choices: [
          { id: "yes", label: "はい" },
          { id: "no", label: "いいえ" }
        ],
        answer: { choiceIds: ["no"] },
        relatedAssets: [page30Asset.id],
        renderHint: "inline"
      },
      {
        id: "l1-p2-a2-q2",
        number: "2",
        prompt: [text("あなたは研修生ですか。——いいえ、研修生（です・では ありません）。")],
        instruction: "选择 1 个正确选项。",
        answerSource: "prompt",
        choices: [
          { id: "desu", label: "です" },
          { id: "dewa", label: "では ありません" }
        ],
        answer: { choiceIds: ["dewa"] },
        relatedAssets: [page30Asset.id],
        renderHint: "inline"
      },
      {
        id: "l1-p2-a2-q3",
        number: "3",
        prompt: [text("あなたは小野さんですか。——はい、（小野・小野さん）です。")],
        instruction: "选择 1 个正确选项。",
        answerSource: "prompt",
        choices: [
          { id: "ono", label: "小野" },
          { id: "onosan", label: "小野さん" }
        ],
        answer: { choiceIds: ["ono"] },
        relatedAssets: [page30Asset.id],
        renderHint: "inline"
      },
      {
        id: "l1-p2-a2-q4",
        number: "4",
        prompt: [text("張さんは（会社員・学生）ですか。——いいえ、会社員では ありません。学生です。")],
        instruction: "选择 1 个正确选项。",
        answerSource: "prompt",
        choices: [
          { id: "employee", label: "会社員" },
          { id: "student", label: "学生" }
        ],
        answer: { choiceIds: ["employee"] },
        relatedAssets: [page30Asset.id],
        renderHint: "inline"
      },
      {
        id: "l1-p2-a2-q5",
        number: "5",
        prompt: [text("デュポンさんはアメリカ人ですか。——（はい・いいえ）、ちがいます。")],
        instruction: "选择 1 个正确选项。",
        answerSource: "prompt",
        choices: [
          { id: "yes", label: "はい" },
          { id: "no", label: "いいえ" }
        ],
        answer: { choiceIds: ["no"] },
        relatedAssets: [page30Asset.id],
        renderHint: "inline"
      }
    ]
  },
  {
    id: "l1-p2-a3",
    section: "practice_2",
    order: 3,
    title: "根据实际情况回答",
    instruction: "听录音，根据自己的实际情况回答提问。",
    interaction: "listening_answer",
    answerUnit: "sentence",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      transcript: {
        source: "asr",
        text: "あなたは中国人ですか。はい、中国人です。いいえ、中国人ではありません。あなたは李さんですか。あなたは日本人ですか。あなたは学生ですか。あなたはJC企画の社員ですか。",
        segments: [
          { text: "あなたは中国人ですか。はい、中国人です。いいえ、中国人ではありません。" },
          { itemNumber: "1", text: "あなたは李さんですか。" },
          { itemNumber: "2", text: "あなたは日本人ですか。" },
          { itemNumber: "3", text: "あなたは学生ですか。" },
          { itemNumber: "4", text: "あなたはJC企画の社員ですか。" }
        ],
        confidenceNote: "Azure ASR returned leading/noise tokens such as D/R/三/数; questions were normalized by removing those markers and matching the four item slots."
      }
    },
    layout: [
      {
        type: "example",
        content: {
          before: "あなたは中国人ですか。",
          after: [text("はい、中国人です。／いいえ、中国人では ありません。")]
        }
      }
    ],
    items: practice2Activity3Items.map((item, index) => ({
      id: `l1-p2-a3-q${index + 1}`,
      number: String(index + 1),
      instruction: "听录音问题，根据自己的情况填写 1 个完整回答句。是否类问题允许肯定和否定两类回答。",
      answerSource: "personal" as const,
      evaluationMode: "acceptable_answers" as const,
      prompt: [text("听录音问题并按实际情况回答。")],
      inputSlots: sentenceSlot("输入 1 个完整回答句"),
      answer: {
        modelAnswers: item.modelAnswers,
        acceptableAlternatives: item.acceptableAlternatives,
        note: `录音问题：${item.question} 是否类个人回答，肯定和否定两类回答都可接受。`
      },
      relatedAssets: [page30Asset.id],
      renderHint: "inline"
    }))
  },
  {
    id: "l1-p2-a4",
    section: "practice_2",
    order: 4,
    title: "词语造句",
    instruction: "用括号中的词语造句。",
    interaction: "sentence_ordering",
    answerUnit: "sentence",
    layout: [
      {
        type: "example",
        content: {
          before: "森さん／です／は／日本人",
          after: [text("森さんは 日本人です。")]
        }
      }
    ],
    items: [
      answerItem("l1-p2-a4-q1", "1", "小野さん／課長／ありません／では／は", "小野さんは課長ではありません。", [page30Asset.id], "", { instruction: "重排给出的词，填写 1 个完整句子。" }),
      answerItem("l1-p2-a4-q2", "2", "デュポンさん／東京大学／教授／の／は／です", "デュポンさんは東京大学の教授です。", [page30Asset.id], "", { instruction: "重排给出的词，填写 1 个完整句子。" }),
      answerItem("l1-p2-a4-q3", "3", "森さん／JC企画／課長／ありません／は／では／の", "森さんはJC企画の課長ではありません。", [page30Asset.id], "", { instruction: "重排给出的词，填写 1 个完整句子。" }),
      answerItem("l1-p2-a4-q4", "4", "スミスさん／JC企画／の／は／か／社員／です", "スミスさんはJC企画の社員ですか。", [page30Asset.id], "", { instruction: "重排给出的词，填写 1 个完整疑问句。" })
    ]
  },
  {
    id: "l1-p2-a5",
    section: "practice_2",
    order: 5,
    title: "中译日",
    instruction: "将下面的句子译成日语。",
    interaction: "translation",
    answerUnit: "sentence",
    layout: [],
    items: [
      answerItem("l1-p2-a5-q1", "1", "小李是中国人。", "李さんは中国人です。", [page30Asset.id], "", { instruction: "翻译成 1 个完整日语句子。", answerSource: "prompt" }),
      answerItem("l1-p2-a5-q2", "2", "森先生不是学生。", "森さんは学生ではありません。", [page30Asset.id], "", { instruction: "翻译成 1 个完整日语句子。", answerSource: "prompt" }),
      answerItem("l1-p2-a5-q3", "3", "小李是 JC 策划公司的职员。", "李さんはJC企画の社員です。", [page30Asset.id], "", { instruction: "翻译成 1 个完整日语句子。", answerSource: "prompt" })
    ]
  }
];

export const lesson1Practice: LessonPractice = {
  lessonId: "lesson1",
  title: "第1课 李さんは 中国人です",
  sourcePages: [
    { pageNo: 28, imagePath: page(28) },
    { pageNo: 29, imagePath: page(29) },
    { pageNo: 30, imagePath: page(30) },
    { pageNo: 31, imagePath: page(31) }
  ],
  vocabulary: [
    { kana: "ちゅうごくじん", kanjiOrTerm: "中国人", pos: "名", chinese: "中国人" },
    { kana: "にほんじん", kanjiOrTerm: "日本人", pos: "名", chinese: "日本人" },
    { kana: "かんこくじん", kanjiOrTerm: "韓国人", pos: "名", chinese: "韩国人" },
    { kana: "アメリカじん", kanjiOrTerm: "アメリカ人", pos: "名", chinese: "美国人" },
    { kana: "フランスじん", kanjiOrTerm: "フランス人", pos: "名", chinese: "法国人" },
    { kana: "がくせい", kanjiOrTerm: "学生", pos: "名", chinese: "学生" },
    { kana: "せんせい", kanjiOrTerm: "先生", pos: "名", chinese: "老师" },
    { kana: "りゅうがくせい", kanjiOrTerm: "留学生", pos: "名", chinese: "留学生" },
    { kana: "きょうじゅ", kanjiOrTerm: "教授", pos: "名", chinese: "教授" },
    { kana: "しゃいん", kanjiOrTerm: "社員", pos: "名", chinese: "职员" },
    { kana: "かいしゃいん", kanjiOrTerm: "会社員", pos: "名", chinese: "公司职员" },
    { kana: "けんしゅうせい", kanjiOrTerm: "研修生", pos: "名", chinese: "进修生" },
    { kana: "かちょう", kanjiOrTerm: "課長", pos: "名", chinese: "科长" },
    { kana: "しゃちょう", kanjiOrTerm: "社長", pos: "名", chinese: "总经理，社长" }
  ],
  activities: [
    practice1Activity1,
    practice1Activity2,
    practice1Activity3,
    practice1Activity4,
    practice1Activity5,
    practice1Activity6,
    practice1Activity7,
    ...practice2Activities
  ]
};
