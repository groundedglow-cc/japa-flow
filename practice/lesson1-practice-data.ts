import type { Choice, InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, ResponseScope, RichText } from "./lesson-practice-types";
import { lesson1ImageCrops } from "./lesson1-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson1/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit1/lesson1/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });
const crop = (id: string) => lesson1ImageCrops.assets.find((asset) => asset.id === id)!;
const orderPrompt = (entries: Array<[string, string?]>): PromptPart[] =>
  entries.flatMap(([value, kana], index) => [
    text(value, kana ? { kana } : {}),
    ...(index < entries.length - 1 ? [text("／")] : [])
  ]);

const sentenceSlot = (placeholder = "输入 1 个完整句子"): InputSlot[] => [
  { id: "answer", expectedUnit: "sentence", width: "long", placeholder }
];
const dialogueSlot = (placeholder = "输入完整对话", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "dialogue", width: "long", placeholder, multiline: true, rows }
];
const shortSlot = (id: string, placeholder = "输入词语"): InputSlot => ({ id, expectedUnit: "word", width: "short", placeholder });
const line = (value: string, kana?: string): RichText => (kana ? text(value, { kana }) : text(value));

const answerItem = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  answer: string,
  options: {
    promptKana?: string;
    placeholder?: string;
    answerSource?: "prompt" | "audio" | "example_transform" | "personal";
    acceptableAlternatives?: string[];
    modelAnswers?: string[];
    evaluationMode?: "exact" | "acceptable_answers";
    note?: string;
    renderHint?: PracticeItem["renderHint"];
    responseScope?: ResponseScope;
    responseScopeHint?: string;
    relatedAssets?: string[];
  } = {}
): PracticeItem => ({
  id,
  number,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "example_transform",
  evaluationMode: options.evaluationMode,
  responseScope: options.responseScope,
  responseScopeHint: options.responseScopeHint,
  inputSlots: options.renderHint === "dialogue" ? dialogueSlot(options.placeholder || "输入完整对话") : sentenceSlot(options.placeholder || "输入 1 个完整句子"),
  answer: {
    slotValues: { answer },
    acceptableAlternatives: options.acceptableAlternatives,
    modelAnswers: options.modelAnswers,
    note: options.note
  },
  renderHint: options.renderHint || "inline",
  relatedAssets: options.relatedAssets
});

const choiceItem = (
  id: string,
  number: string,
  prompt: string,
  choices: string[],
  correct: string,
  promptKana?: string,
  choiceIds?: string[]
): PracticeItem => {
  const mapped: Choice[] = choices.map((label, index) => ({ id: choiceIds?.[index] || `${id}-c${index + 1}`, label }));
  const selected = mapped.find((choice) => choice.label === correct);
  return {
    id,
    number,
    prompt: [text(prompt)],
    promptKana,
    instruction: "",
    answerSource: "prompt",
    responseScope: "choice_only",
    choices: mapped,
    answer: { choiceIds: selected ? [selected.id] : [] },
    renderHint: "inline"
  };
};

const blankItem = (
  id: string,
  number: string,
  prompt: PromptPart[],
  answers: Record<string, string>,
  promptKana?: string
): PracticeItem => ({
  id,
  number,
  prompt,
  promptKana,
  instruction: "",
  answerSource: "prompt",
  responseScope: "word_only",
  inputSlots: Object.keys(answers).map((slotId) => shortSlot(slotId)),
  answer: { slotValues: answers },
  renderHint: "inline"
});

const cardAsset = crop("l1-p1-a4-person-cards");

const practice1Activities: PracticeActivity[] = [
  {
    id: "l1-p1-a1",
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
        id: "l1-p1-a1-g1",
        example: {
          label: "[例1]",
          before: "わたし／日本人",
          beforeKana: "わたし／にほんじん",
          after: [text("わたしは "), repl("日本人", "identity", { kana: "にほんじん" }), text("です。")],
          afterKana: "わたしは にほんじんです。"
        },
        items: [
          answerItem("l1-p1-a1-q1", "1", "李さん／中国人", "李さんは 中国人です。", { promptKana: "りさん／ちゅうごくじん" }),
          answerItem("l1-p1-a1-q2", "2", "キムさん／韓国人", "キムさんは 韓国人です。", { promptKana: "キムさん／かんこくじん" }),
          answerItem("l1-p1-a1-q3", "3", "森さん／会社員", "森さんは 会社員です。", { promptKana: "もりさん／かいしゃいん" }),
          answerItem("l1-p1-a1-q4", "4", "林さん／学生", "林さんは 学生です。", { promptKana: "はやしさん／がくせい" }),
          answerItem("l1-p1-a1-q5", "5", "スミスさん／アメリカ人", "スミスさんは アメリカ人です。", { promptKana: "スミスさん／アメリカじん" })
        ]
      },
      {
        id: "l1-p1-a1-g2",
        example: {
          label: "[例2]",
          before: "李さん／日本人",
          beforeKana: "りさん／にほんじん",
          after: [text("李さんは "), repl("日本人", "identity", { kana: "にほんじん" }), text("では ありません。")],
          afterKana: "りさんは にほんじんでは ありません。"
        },
        items: [
          answerItem("l1-p1-a1-q6", "6", "小野さん／中国人", "小野さんは 中国人では ありません。", { promptKana: "おのさん／ちゅうごくじん" }),
          answerItem("l1-p1-a1-q7", "7", "森さん／課長", "森さんは 課長では ありません。", { promptKana: "もりさん／かちょう" }),
          answerItem("l1-p1-a1-q8", "8", "わたし／田中", "わたしは 田中では ありません。", { promptKana: "わたし／たなか" }),
          answerItem("l1-p1-a1-q9", "9", "李さん／留学生", "李さんは 留学生では ありません。", { promptKana: "りさん／りゅうがくせい" }),
          answerItem("l1-p1-a1-q10", "10", "スミスさん／フランス人", "スミスさんは フランス人では ありません。", { promptKana: "スミスさん／フランスじん" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l1-p1-a2",
    section: "practice_1",
    order: 2,
    title: "听录音，仿照例句反复练习。",
    instruction: "",
    interaction: "listening_repeat",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 2),
      transcript: {
        text: "わたしは 李です。李さんは 中国人です。キムさんは 韓国人です。森さんは 課長では ありません。わたしは 田中では ありません。スミスさんは フランス人では ありません。",
        source: "manual",
        confidenceNote: "ASR 混入了 D / 三 / おお 等噪声标记，并重复识别了部分句子；这里按例句和 5 个小题做了规范化。",
        segments: [
          { text: "わたしは 李です。" },
          { itemNumber: "1", text: "李さんは 中国人です。" },
          { itemNumber: "2", text: "キムさんは 韓国人です。" },
          { itemNumber: "3", text: "森さんは 課長では ありません。" },
          { itemNumber: "4", text: "わたしは 田中では ありません。" },
          { itemNumber: "5", text: "スミスさんは フランス人では ありません。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          after: [text("わたしは 李です。")],
          afterKana: "わたしは りです。"
        }
      }
    ],
    items: [
      answerItem("l1-p1-a2-q1", "1", "听录音并写出句子。", "李さんは 中国人です。", { answerSource: "audio" }),
      answerItem("l1-p1-a2-q2", "2", "听录音并写出句子。", "キムさんは 韓国人です。", { answerSource: "audio" }),
      answerItem("l1-p1-a2-q3", "3", "听录音并写出句子。", "森さんは 課長では ありません。", { answerSource: "audio" }),
      answerItem("l1-p1-a2-q4", "4", "听录音并写出句子。", "わたしは 田中では ありません。", { answerSource: "audio" }),
      answerItem("l1-p1-a2-q5", "5", "听录音并写出句子。", "スミスさんは フランス人では ありません。", { answerSource: "audio" })
    ]
  },
  {
    id: "l1-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    layout: [],
    itemGroups: [
      {
        id: "l1-p1-a3-g1",
        example: {
          label: "[例1]",
          before: "李",
          beforeKana: "り",
          after: [text("甲：李さんですか。 乙1：はい、李です。 乙2：いいえ、李では ありません。")],
          afterKana: "こう：りさんですか。 おついち：はい、りです。 おつに：いいえ、りでは ありません。"
        },
        items: [
          answerItem("l1-p1-a3-q1", "1", "森", "甲：森さんですか。\n乙1：はい、森です。\n乙2：いいえ、森では ありません。", {
            promptKana: "もり",
            renderHint: "dialogue"
          }),
          answerItem("l1-p1-a3-q2", "2", "小野", "甲：小野さんですか。\n乙1：はい、小野です。\n乙2：いいえ、小野では ありません。", {
            promptKana: "おの",
            renderHint: "dialogue"
          }),
          answerItem("l1-p1-a3-q3", "3", "デュポン", "甲：デュポンさんですか。\n乙1：はい、デュポンです。\n乙2：いいえ、デュポンでは ありません。", {
            promptKana: "デュポン",
            renderHint: "dialogue"
          }),
          answerItem("l1-p1-a3-q4", "4", "ジョンソン", "甲：ジョンソンさんですか。\n乙1：はい、ジョンソンです。\n乙2：いいえ、ジョンソンでは ありません。", {
            promptKana: "ジョンソン",
            renderHint: "dialogue"
          })
        ]
      },
      {
        id: "l1-p1-a3-g2",
        example: {
          label: "[例2]",
          before: "会社員",
          beforeKana: "かいしゃいん",
          after: [text("甲：王さんは 会社員ですか。 乙1：はい、会社員です。 乙2：いいえ、会社員では ありません。")],
          afterKana: "こう：おうさんは かいしゃいんですか。 おついち：はい、かいしゃいんです。 おつに：いいえ、かいしゃいんでは ありません。"
        },
        items: [
          answerItem("l1-p1-a3-q5", "5", "中国人", "甲：王さんは 中国人ですか。\n乙1：はい、中国人です。\n乙2：いいえ、中国人では ありません。", {
            promptKana: "ちゅうごくじん",
            renderHint: "dialogue"
          }),
          answerItem("l1-p1-a3-q6", "6", "韓国人", "甲：王さんは 韓国人ですか。\n乙1：はい、韓国人です。\n乙2：いいえ、韓国人では ありません。", {
            promptKana: "かんこくじん",
            renderHint: "dialogue"
          }),
          answerItem("l1-p1-a3-q7", "7", "留学生", "甲：王さんは 留学生ですか。\n乙1：はい、留学生です。\n乙2：いいえ、留学生では ありません。", {
            promptKana: "りゅうがくせい",
            renderHint: "dialogue"
          }),
          answerItem("l1-p1-a3-q8", "8", "JC企画の 社員", "甲：王さんは JC企画の 社員ですか。\n乙1：はい、JC企画の 社員です。\n乙2：いいえ、JC企画の 社員では ありません。", {
            promptKana: "ジェーシーきかくの しゃいん",
            renderHint: "dialogue"
          })
        ]
      }
    ],
    items: []
  },
  {
    id: "l1-p1-a4",
    section: "practice_1",
    order: 4,
    title: "看图，仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    assets: [cardAsset],
    displayAssets: ["l1-p1-a4-person-cards"],
    layout: [
      {
        type: "passage",
        lines: [
          line("[例] 李さん：中国人 / 会社員", "[れい] りさん：ちゅうごくじん / かいしゃいん"),
          line("（1）小野さん：日本人 / JC企画の 社員", "（1）おのさん：にほんじん / ジェーシーきかくの しゃいん"),
          line("（2）デュポンさん：フランス人 / 東京大学の 教授", "（2）デュポンさん：フランスじん / とうきょうだいがくの きょうじゅ"),
          line("（3）キムさん：韓国人 / 研修生", "（3）キムさん：かんこくじん / けんしゅうせい"),
          line("（4）スミスさん：アメリカ人 / 北京旅行社の 社員", "（4）スミスさん：アメリカじん / ペキンりょこうしゃの しゃいん")
        ]
      },
      {
        type: "example",
        content: {
          label: "[例]",
          before: "李さん：中国人 / 会社員",
          beforeKana: "りさん：ちゅうごくじん / かいしゃいん",
          after: [text("甲：李さんは 中国人ですか。 乙：はい、中国人です。 甲：李さんは 学生ですか。 乙：いいえ、学生では ありません。会社員です。")],
          afterKana: "こう：りさんは ちゅうごくじんですか。 おつ：はい、ちゅうごくじんです。 こう：りさんは がくせいですか。 おつ：いいえ、がくせいでは ありません。かいしゃいんです。"
        }
      }
    ],
    items: [
      answerItem("l1-p1-a4-q1", "1", "（1）小野さん / 日本人 / JC企画の 社員", "甲：小野さんは 日本人ですか。\n乙：はい、日本人です。\n甲：小野さんは 学生ですか。\n乙：いいえ、学生では ありません。JC企画の 社員です。", {
        renderHint: "dialogue",
        promptKana: "（1）おのさん / にほんじん / ジェーシーきかくの しゃいん",
        relatedAssets: [cardAsset.id]
      }),
      answerItem("l1-p1-a4-q2", "2", "（2）デュポンさん / フランス人 / 東京大学の 教授", "甲：デュポンさんは フランス人ですか。\n乙：はい、フランス人です。\n甲：デュポンさんは 学生ですか。\n乙：いいえ、学生では ありません。東京大学の 教授です。", {
        renderHint: "dialogue",
        promptKana: "（2）デュポンさん / フランスじん / とうきょうだいがくの きょうじゅ",
        relatedAssets: [cardAsset.id]
      }),
      answerItem("l1-p1-a4-q3", "3", "（3）キムさん / 韓国人 / 研修生", "甲：キムさんは 韓国人ですか。\n乙：はい、韓国人です。\n甲：キムさんは 学生ですか。\n乙：いいえ、学生では ありません。研修生です。", {
        renderHint: "dialogue",
        promptKana: "（3）キムさん / かんこくじん / けんしゅうせい",
        relatedAssets: [cardAsset.id]
      }),
      answerItem("l1-p1-a4-q4", "4", "（4）スミスさん / アメリカ人 / 北京旅行社の 社員", "甲：スミスさんは アメリカ人ですか。\n乙：はい、アメリカ人です。\n甲：スミスさんは 学生ですか。\n乙：いいえ、学生では ありません。北京旅行社の 社員です。", {
        renderHint: "dialogue",
        promptKana: "（4）スミスさん / アメリカじん / ペキンりょこうしゃの しゃいん",
        relatedAssets: [cardAsset.id]
      })
    ]
  },
  {
    id: "l1-p1-a5",
    section: "practice_1",
    order: 5,
    title: "边看第４题的图边听录音，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: "请只填写回答部分，不要抄写提问句。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 5),
      transcript: {
        text: "李さんは 中国人ですか。はい、そうです。李さんは 学生ですか。いいえ、ちがいます。小野さんは 日本人ですか。はい、そうです。小野さんは 学生ですか。いいえ、ちがいます。デュポンさんは 東京大学の 教授ですか。はい、そうです。キムさんは 中国人ですか。いいえ、ちがいます。スミスさんは アメリカ人ですか。はい、そうです。",
        source: "manual",
        confidenceNote: "ASR 中混入了 D / いい / 三 / 数 / おお 等噪声标记，这里按例句与第 4 题人物图做了归一化。",
        segments: [
          { text: "李さんは 中国人ですか。はい、そうです。李さんは 学生ですか。いいえ、ちがいます。" },
          { itemNumber: "1", text: "小野さんは 日本人ですか。はい、そうです。" },
          { itemNumber: "2", text: "小野さんは 学生ですか。いいえ、ちがいます。" },
          { itemNumber: "3", text: "デュポンさんは 東京大学の 教授ですか。はい、そうです。" },
          { itemNumber: "4", text: "キムさんは 中国人ですか。いいえ、ちがいます。" },
          { itemNumber: "5", text: "スミスさんは アメリカ人ですか。はい、そうです。" }
        ]
      }
    },
    assets: [cardAsset],
    displayAssets: ["l1-p1-a4-person-cards"],
    layout: [
      {
        type: "passage",
        lines: [
          line("（1）小野さん：日本人 / JC企画の 社員", "（1）おのさん：にほんじん / ジェーシーきかくの しゃいん"),
          line("（2）デュポンさん：フランス人 / 東京大学の 教授", "（2）デュポンさん：フランスじん / とうきょうだいがくの きょうじゅ"),
          line("（3）キムさん：韓国人 / 研修生", "（3）キムさん：かんこくじん / けんしゅうせい"),
          line("（4）スミスさん：アメリカ人 / 北京旅行社の 社員", "（4）スミスさん：アメリカじん / ペキンりょこうしゃの しゃいん")
        ]
      },
      {
        type: "passage",
        title: "[例]",
        lines: [
          line("李さんは 中国人ですか。 はい、そうです。", "りさんは ちゅうごくじんですか。 はい、そうです。"),
          line("李さんは 学生ですか。 いいえ、ちがいます。", "りさんは がくせいですか。 いいえ、ちがいます。")
        ]
      }
    ],
    items: [
      answerItem("l1-p1-a5-q1", "1", "听录音并回答。", "はい、そうです。", { answerSource: "audio" }),
      answerItem("l1-p1-a5-q2", "2", "听录音并回答。", "いいえ、ちがいます。", { answerSource: "audio" }),
      answerItem("l1-p1-a5-q3", "3", "听录音并回答。", "はい、そうです。", { answerSource: "audio" }),
      answerItem("l1-p1-a5-q4", "4", "听录音并回答。", "いいえ、ちがいます。", { answerSource: "audio" }),
      answerItem("l1-p1-a5-q5", "5", "听录音并回答。", "はい、そうです。", { answerSource: "audio" })
    ]
  },
  {
    id: "l1-p1-a6",
    section: "practice_1",
    order: 6,
    title: "仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    layout: [],
    itemGroups: [
      {
        id: "l1-p1-a6-g1",
        example: {
          label: "[例1]",
          before: "李／JC企画の 社員",
          beforeKana: "り／ジェーシーきかくの しゃいん",
          after: [text("甲：李さんは JC企画の 社員ですか。 乙：はい、そうです。")],
          afterKana: "こう：りさんは ジェーシーきかくの しゃいんですか。 おつ：はい、そうです。"
        },
        items: [
          answerItem("l1-p1-a6-q1", "1", "キム／JC企画の 研修生", "甲：キムさんは JC企画の 研修生ですか。\n乙：はい、そうです。", {
            promptKana: "キム／ジェーシーきかくの けんしゅうせい",
            renderHint: "dialogue"
          }),
          answerItem("l1-p1-a6-q2", "2", "ジョンソン／東京大学の 学生", "甲：ジョンソンさんは 東京大学の 学生ですか。\n乙：はい、そうです。", {
            promptKana: "ジョンソン／とうきょうだいがくの がくせい",
            renderHint: "dialogue"
          }),
          answerItem("l1-p1-a6-q3", "3", "デュポン／東京大学の 教授", "甲：デュポンさんは 東京大学の 教授ですか。\n乙：はい、そうです。", {
            promptKana: "デュポン／とうきょうだいがくの きょうじゅ",
            renderHint: "dialogue"
          }),
          answerItem("l1-p1-a6-q4", "4", "中村／JC企画の 社長", "甲：中村さんは JC企画の 社長ですか。\n乙：はい、そうです。", {
            promptKana: "なかむら／ジェーシーきかくの しゃちょう",
            renderHint: "dialogue"
          })
        ]
      },
      {
        id: "l1-p1-a6-g2",
        example: {
          label: "[例2]",
          before: "森／学生",
          beforeKana: "もり／がくせい",
          after: [text("甲：森さんは 学生ですか。 乙：いいえ、ちがいます。")],
          afterKana: "こう：もりさんは がくせいですか。 おつ：いいえ、ちがいます。"
        },
        items: [
          answerItem("l1-p1-a6-q5", "5", "ジョンソン／フランス人", "甲：ジョンソンさんは フランス人ですか。\n乙：いいえ、ちがいます。", {
            promptKana: "ジョンソン／フランスじん",
            renderHint: "dialogue"
          }),
          answerItem("l1-p1-a6-q6", "6", "張／北京大学の 学生", "甲：張さんは 北京大学の 学生ですか。\n乙：いいえ、ちがいます。", {
            promptKana: "ちょう／ペキンだいがくの がくせい",
            renderHint: "dialogue"
          }),
          answerItem("l1-p1-a6-q7", "7", "森／JC企画の 課長", "甲：森さんは JC企画の 課長ですか。\n乙：いいえ、ちがいます。", {
            promptKana: "もり／ジェーシーきかくの かちょう",
            renderHint: "dialogue"
          }),
          answerItem("l1-p1-a6-q8", "8", "吉田／日中商事の 社長", "甲：吉田さんは 日中商事の 社長ですか。\n乙：いいえ、ちがいます。", {
            promptKana: "よしだ／にっちゅうしょうじの しゃちょう",
            renderHint: "dialogue"
          })
        ]
      }
    ],
    items: []
  },
  {
    id: "l1-p1-a7",
    section: "practice_1",
    order: 7,
    title: "听录音，仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 7),
      transcript: {
        text: "李／森健太郎。甲：李さんですか。乙：はい、李です。どうぞ よろしく。甲：こんにちは、森健太郎です。よろしく お願いします。張／小野緑。甲：張さんですか。乙：はい、張です。どうぞ よろしく。甲：こんにちは、小野緑です。よろしく お願いします。スミス／李秀麗。甲：スミスさんですか。乙：はい、スミスです。どうぞ よろしく。甲：こんにちは、李秀麗です。よろしく お願いします。",
        source: "manual",
        confidenceNote: "ASR 对中文姓名和固有名词识别较差，这里按提示词组与标准自我介绍句式做了人工归一化。",
        segments: [
          { text: "甲：李さんですか。乙：はい、李です。どうぞ よろしく。甲：こんにちは、森健太郎です。よろしく お願いします。" },
          { itemNumber: "1", text: "甲：張さんですか。乙：はい、張です。どうぞ よろしく。甲：こんにちは、小野緑です。よろしく お願いします。" },
          { itemNumber: "2", text: "甲：スミスさんですか。乙：はい、スミスです。どうぞ よろしく。甲：こんにちは、李秀麗です。よろしく お願いします。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "李／森健太郎",
          beforeKana: "り／もりけんたろう",
          after: [text("甲：李さんですか。 乙：はい、李です。どうぞ よろしく。 甲：こんにちは、森健太郎です。よろしく お願いします。")],
          afterKana: "こう：りさんですか。 おつ：はい、りです。どうぞ よろしく。 こう：こんにちは、もりけんたろうです。よろしく おねがいします。"
        }
      }
    ],
    items: [
      answerItem("l1-p1-a7-q1", "1", "張／小野緑", "甲：張さんですか。\n乙：はい、張です。どうぞ よろしく。\n甲：こんにちは、小野緑です。よろしく お願いします。", {
        answerSource: "audio",
        promptKana: "ちょう／おのみどり",
        renderHint: "dialogue",
        placeholder: "输入完整对话"
      }),
      answerItem("l1-p1-a7-q2", "2", "スミス／李秀麗", "甲：スミスさんですか。\n乙：はい、スミスです。どうぞ よろしく。\n甲：こんにちは、李秀麗です。よろしく お願いします。", {
        answerSource: "audio",
        promptKana: "スミス／りしゅうれい",
        renderHint: "dialogue",
        placeholder: "输入完整对话"
      })
    ]
  }
];

const practice2Activities: PracticeActivity[] = [
  {
    id: "l1-p2-a1",
    section: "practice_2",
    order: 1,
    title: "在（　　　）中填入适当的词语。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "あなたは（ 日本人 ）ですか。",
          beforeKana: "あなたは（ にほんじん ）ですか。",
          after: [text("はい、日本人です。")],
          afterKana: "はい、にほんじんです。"
        }
      }
    ],
    items: [
      blankItem("l1-p2-a1-q1", "1", [text("李さんは（"), blank("answer"), text("）ですか。 はい、会社員です。")], { answer: "会社員" }, "りさんは（  ）ですか。 はい、かいしゃいんです。"),
      blankItem("l1-p2-a1-q2", "2", [text("あなたは（"), blank("answer"), text("）ですか。 いいえ、小野では ありません。")], { answer: "小野さん" }, "あなたは（  ）ですか。 いいえ、おのでは ありません。"),
      blankItem("l1-p2-a1-q3", "3", [text("森さんは（"), blank("answer"), text("）の 社員ですか。 はい、JC企画の 社員です。")], { answer: "JC企画" }, "もりさんは（  ）の しゃいんですか。 はい、ジェーシーきかくの しゃいんです。"),
      blankItem("l1-p2-a1-q4", "4", [text("キムさんは 学生ですか。 （"), blank("answer"), text("）、学生では ありません。")], { answer: "いいえ" }, "キムさんは がくせいですか。 （  ）、がくせいでは ありません。"),
      blankItem("l1-p2-a1-q5", "5", [text("スミスさんは アメリカ人ですか。 はい、（"), blank("answer"), text("）です。")], { answer: "アメリカ人" }, "スミスさんは アメリカじんですか。 はい、（  ）です。")
    ]
  },
  {
    id: "l1-p2-a2",
    section: "practice_2",
    order: 2,
    title: "在正确答案上画○。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "李さんは 中国人ですか。",
          beforeKana: "りさんは ちゅうごくじんですか。",
          after: [text("（はい・いいえ）→ はい、そうです。")],
          afterKana: "（はい・いいえ）→ はい、そうです。"
        }
      }
    ],
    items: [
      choiceItem("l1-p2-a2-q1", "1", "キムさんは 中国人ですか。 （はい・いいえ）。 中国人では ありません。", ["はい", "いいえ"], "いいえ", "キムさんは ちゅうごくじんですか。 （はい・いいえ）。 ちゅうごくじんでは ありません。", ["yes", "no"]),
      choiceItem("l1-p2-a2-q2", "2", "あなたは 研修生ですか。 いいえ、研修生（です・では ありません）。", ["です", "では ありません"], "では ありません", "あなたは けんしゅうせいですか。 いいえ、けんしゅうせい（です・では ありません）。", ["desu", "dewa"]),
      choiceItem("l1-p2-a2-q3", "3", "あなたは 小野さんですか。 はい、（小野・小野さん）です。", ["小野", "小野さん"], "小野", "あなたは おのさんですか。 はい、（おの・おのさん）です。", ["ono", "onosan"]),
      choiceItem("l1-p2-a2-q4", "4", "張さんは（会社員・学生）ですか。 いいえ、会社員では ありません。学生です。", ["会社員", "学生"], "会社員", "ちょうさんは（かいしゃいん・がくせい）ですか。 いいえ、かいしゃいんでは ありません。 がくせいです。", ["employee", "student"]),
      choiceItem("l1-p2-a2-q5", "5", "デュポンさんは アメリカ人ですか。 （はい・いいえ）。 ちがいます。", ["はい", "いいえ"], "いいえ", "デュポンさんは アメリカじんですか。 （はい・いいえ）。 ちがいます。", ["yes", "no"])
    ]
  },
  {
    id: "l1-p2-a3",
    section: "practice_2",
    order: 3,
    title: "听录音，根据自己的实际情况回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: "请只填写你的回答，不要抄写提问句。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      transcript: {
        text: "あなたは 中国人ですか。 はい、中国人です。 いいえ、中国人では ありません。 あなたは 李さんですか。 あなたは 日本人ですか。 あなたは 学生ですか。 あなたは JC企画の 社員ですか。",
        source: "manual",
        confidenceNote: "ASR 返回了 D / R / 三 / 数 等噪声标记；这里按题目顺序规范化为 4 个提问。",
        segments: [
          { text: "あなたは 中国人ですか。 はい、中国人です。 いいえ、中国人では ありません。" },
          { itemNumber: "1", text: "あなたは 李さんですか。" },
          { itemNumber: "2", text: "あなたは 日本人ですか。" },
          { itemNumber: "3", text: "あなたは 学生ですか。" },
          { itemNumber: "4", text: "あなたは JC企画の 社員ですか。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "あなたは 中国人ですか。",
          beforeKana: "あなたは ちゅうごくじんですか。",
          after: [text("はい、中国人です。／いいえ、中国人では ありません。")],
          afterKana: "はい、ちゅうごくじんです。／いいえ、ちゅうごくじんでは ありません。"
        }
      }
    ],
    items: [
      answerItem("l1-p2-a3-q1", "1", "听录音问题并按实际情况回答。", "はい、李です。", {
        answerSource: "personal",
        evaluationMode: "acceptable_answers",
        modelAnswers: ["はい、李です。", "いいえ、李では ありません。"],
        acceptableAlternatives: ["はい、そうです。", "いいえ、ちがいます。", "いいえ、違います。"],
        note: "录音问题：あなたは 李さんですか。是否类个人回答，肯定和否定两类回答都可接受。"
      }),
      answerItem("l1-p2-a3-q2", "2", "听录音问题并按实际情况回答。", "はい、日本人です。", {
        answerSource: "personal",
        evaluationMode: "acceptable_answers",
        modelAnswers: ["はい、日本人です。", "いいえ、日本人では ありません。"],
        acceptableAlternatives: ["はい、そうです。", "いいえ、ちがいます。", "いいえ、違います。"],
        note: "录音问题：あなたは 日本人ですか。是否类个人回答，肯定和否定两类回答都可接受。"
      }),
      answerItem("l1-p2-a3-q3", "3", "听录音问题并按实际情况回答。", "はい、学生です。", {
        answerSource: "personal",
        evaluationMode: "acceptable_answers",
        modelAnswers: ["はい、学生です。", "いいえ、学生では ありません。"],
        acceptableAlternatives: ["はい、そうです。", "いいえ、ちがいます。", "いいえ、違います。"],
        note: "录音问题：あなたは 学生ですか。是否类个人回答，肯定和否定两类回答都可接受。"
      }),
      answerItem("l1-p2-a3-q4", "4", "听录音问题并按实际情况回答。", "はい、JC企画の 社員です。", {
        answerSource: "personal",
        evaluationMode: "acceptable_answers",
        modelAnswers: ["はい、JC企画の 社員です。", "いいえ、JC企画の 社員では ありません。"],
        acceptableAlternatives: ["はい、そうです。", "いいえ、ちがいます。", "いいえ、違います。"],
        note: "录音问题：あなたは JC企画の 社員ですか。是否类个人回答，肯定和否定两类回答都可接受。"
      })
    ]
  },
  {
    id: "l1-p2-a4",
    section: "practice_2",
    order: 4,
    title: "用{　　　}中的词语造句。",
    instruction: "",
    interaction: "sentence_ordering",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "森さん／です／は／日本人。",
          beforeKana: "もりさん／です／は／にほんじん。",
          after: [text("森さんは 日本人です。")],
          afterKana: "もりさんは にほんじんです。"
        }
      }
    ],
    items: [
      answerItem("l1-p2-a4-q1", "1", orderPrompt([["小野さん", "おのさん"], ["課長", "かちょう"], ["ありません"], ["では"], ["は。"]]), "小野さんは 課長では ありません。"),
      answerItem("l1-p2-a4-q2", "2", orderPrompt([["デュポンさん"], ["東京大学", "とうきょうだいがく"], ["教授", "きょうじゅ"], ["の"], ["は"], ["です。"]]), "デュポンさんは 東京大学の 教授です。"),
      answerItem("l1-p2-a4-q3", "3", orderPrompt([["森さん", "もりさん"], ["JC企画", "ジェーシーきかく"], ["課長", "かちょう"], ["ありません"], ["は"], ["では"], ["の。"]]), "森さんは JC企画の 課長では ありません。"),
      answerItem("l1-p2-a4-q4", "4", [
        ...orderPrompt([["スミスさん"], ["JC企画", "ジェーシーきかく"], ["の"], ["は"], ["か"], ["社員", "しゃいん"], ["です。"]]),
        text(" いいえ，／"),
        ...orderPrompt([["では"], ["の"], ["JC企画", "ジェーシーきかく"], ["ありません"], ["社員。", "しゃいん。"]])
      ], "スミスさんは JC企画の 社員ですか。\nいいえ、JC企画の 社員では ありません。", {
        renderHint: "dialogue",
        placeholder: "输入两行完整句子",
        responseScope: "dialogue_only",
        responseScopeHint: "请分两行作答：第一行写提问句，第二行写回答句。"
      })
    ]
  },
  {
    id: "l1-p2-a5",
    section: "practice_2",
    order: 5,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l1-p2-a5-q1", "1", "小李是中国人。", "李さんは 中国人です。"),
      answerItem("l1-p2-a5-q2", "2", "森先生不是学生。", "森先生は 学生では ありません。", {
        acceptableAlternatives: [
          "森先生は 学生じゃありません。",
          "森さんは 学生では ありません。",
          "森さんは 学生じゃありません。"
        ],
        evaluationMode: "acceptable_answers"
      }),
      answerItem("l1-p2-a5-q3", "3", "小李是 JC 策划公司的职员。", "李さんは JC企画の 社員です。")
    ]
  }
];

export const lesson1Practice: LessonPractice = {
  lessonId: "lesson1",
  title: "第1課 李さんは 中国人です",
  sourcePages: [
    { pageNo: 28, imagePath: page(28) },
    { pageNo: 29, imagePath: page(29) },
    { pageNo: 30, imagePath: page(30) }
  ],
  activities: [...practice1Activities, ...practice2Activities]
};
