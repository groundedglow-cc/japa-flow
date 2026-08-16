import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson11/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit3/lesson11/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
const sentenceSlot = (placeholder = "输入完整回答"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const multilineSentenceSlot = (placeholder = "输入完整回答", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "sentence", width: "long", multiline: true, rows, placeholder }
];
const dialogueSlot = (placeholder = "输入完整对话", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows, placeholder }
];
const shortSlots = (slotIds: string[]): InputSlot[] => slotIds.map((slotId) => ({ id: slotId, expectedUnit: "phrase", width: "medium", placeholder: "输入词语" }));

const answerItem = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  answer: string,
  options: {
    promptKana?: string;
    answerSource?: PracticeItem["answerSource"];
    responseScope?: PracticeItem["responseScope"];
    responseScopeHint?: string;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
    acceptableAlternatives?: string[];
    evaluationMode?: PracticeItem["evaluationMode"];
  } = {}
): PracticeItem => ({
  id,
  number,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "example_transform",
  responseScope: options.responseScope,
  responseScopeHint: options.responseScopeHint,
  evaluationMode: options.evaluationMode,
  inputSlots: options.multiline
    ? multilineSentenceSlot(options.placeholder || "输入完整回答", options.rows || 3)
    : sentenceSlot(options.placeholder || "输入完整回答"),
  answer: { slotValues: { answer }, acceptableAlternatives: options.acceptableAlternatives }
});

const dialogueItem = (
  id: string,
  number: string,
  prompt: string,
  answer: string,
  promptKana?: string,
  rows = 4
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "example_transform",
  responseScope: "dialogue_only",
  inputSlots: dialogueSlot("输入完整对话", rows),
  answer: { slotValues: { answer } }
});

const blankItem = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  answers: Record<string, string>,
  options: {
    promptKana?: string;
    answerSource?: PracticeItem["answerSource"];
    responseScope?: PracticeItem["responseScope"];
    responseScopeHint?: string;
  } = {}
): PracticeItem => ({
  id,
  number,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "prompt",
  responseScope: options.responseScope || "phrase_only",
  responseScopeHint: options.responseScopeHint,
  inputSlots: shortSlots(Object.keys(answers)),
  answer: { slotValues: answers }
});

const slotItem = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  slots: InputSlot[],
  answers: Record<string, string>,
  options: {
    promptKana?: string;
    answerSource?: PracticeItem["answerSource"];
    responseScope?: PracticeItem["responseScope"];
    responseScopeHint?: string;
  } = {}
): PracticeItem => ({
  id,
  number,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "prompt",
  responseScope: options.responseScope || "custom",
  responseScopeHint: options.responseScopeHint,
  inputSlots: slots,
  answer: { slotValues: answers }
});

const trueFalseItem = (
  id: string,
  number: string,
  prompt: string,
  value: boolean,
  promptKana?: string
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "audio",
  responseScope: "boolean_only",
  choices: [
    { id: "true", label: "○" },
    { id: "false", label: "×" }
  ],
  answer: { boolean: value, choiceIds: [value ? "true" : "false"] }
});

const matchingItem = (
  id: string,
  number: string,
  prompt: string,
  answerChoiceId: string,
  promptKana?: string
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "prompt",
  responseScope: "choice_only",
  choices: [
    { id: "a", label: "a とても 便利です。" },
    { id: "b", label: "b 毎晩 飲みます。" },
    { id: "c", label: "c プレゼントを あげます。" },
    { id: "d", label: "d 李さんに 教えました。" },
    { id: "e", label: "e 12時まで 寝ます。" },
    { id: "f", label: "f カラオケが 嫌いです。" }
  ],
  answer: { choiceIds: [answerChoiceId] }
});

const activities: PracticeActivity[] = [
  {
    id: "l11-p1-a1",
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
        id: "l11-p1-a1-g1",
        example: {
          id: "l11-p1-a1-ex1",
          label: "[例1]",
          before: "歌",
          beforeKana: "うた",
          after: [text("吉田さんは "), repl("歌", "object", { kana: "うた" }), text("が 好きです。")],
          afterKana: "よしださんは うたが すきです。"
        },
        items: [
          answerItem("l11-p1-a1-q1", "1", "映画", "吉田さんは 映画が 好きです。", { promptKana: "えいが" }),
          answerItem("l11-p1-a1-q2", "2", "ゴルフ", "吉田さんは ゴルフが 好きです。", { promptKana: "ゴルフ" }),
          answerItem("l11-p1-a1-q3", "3", "旅行", "吉田さんは 旅行が 好きです。", { promptKana: "りょこう" }),
          answerItem("l11-p1-a1-q4", "4", "クラシック", "吉田さんは クラシックが 好きです。", { promptKana: "クラシック" })
        ]
      },
      {
        id: "l11-p1-a1-g2",
        example: {
          id: "l11-p1-a1-ex2",
          label: "[例2]",
          before: "料理",
          beforeKana: "りょうり",
          after: [text("李さんは "), repl("料理", "object", { kana: "りょうり" }), text("が 上手です。")],
          afterKana: "りさんは りょうりが じょうずです。"
        },
        items: [
          answerItem("l11-p1-a1-q5", "5", "絵", "李さんは 絵が 上手です。", { promptKana: "え" }),
          answerItem("l11-p1-a1-q6", "6", "ピアノ", "李さんは ピアノが 上手です。", { promptKana: "ピアノ" }),
          answerItem("l11-p1-a1-q7", "7", "日本語", "李さんは 日本語が 上手です。", { promptKana: "にほんご" }),
          answerItem("l11-p1-a1-q8", "8", "テニス", "李さんは テニスが 上手です。", { promptKana: "テニス" })
        ]
      },
      {
        id: "l11-p1-a1-g3",
        example: {
          id: "l11-p1-a1-ex3",
          label: "[例3]",
          before: "絵",
          beforeKana: "え",
          after: [text("わたしは "), repl("絵", "object", { kana: "え" }), text("が 下手です。")],
          afterKana: "わたしは えが へたです。"
        },
        items: [
          answerItem("l11-p1-a1-q9", "9", "歌", "わたしは 歌が 下手です。", { promptKana: "うた" }),
          answerItem("l11-p1-a1-q10", "10", "料理", "わたしは 料理が 下手です。", { promptKana: "りょうり" }),
          answerItem("l11-p1-a1-q11", "11", "運転", "わたしは 運転が 下手です。", { promptKana: "うんてん" }),
          answerItem("l11-p1-a1-q12", "12", "英語", "わたしは 英語が 下手です。", { promptKana: "えいご" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l11-p1-a2",
    section: "practice_1",
    order: 2,
    title: "看图，仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [
      { id: "l11-p1-a2-ability-preference-picture-prompts", kind: "exercise_image", imagePath: exerciseImage("book1_lesson11_1_2.png") }
    ],
    displayAssets: ["l11-p1-a2-ability-preference-picture-prompts"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "小野さん／歌／上手",
          beforeKana: "おのさん／うた／じょうず",
          after: [text("小野さんは "), repl("歌", "object", { kana: "うた" }), text("が "), repl("上手", "predicate", { kana: "じょうず" }), text("です。")],
          afterKana: "おのさんは うたが じょうずです。"
        }
      }
    ],
    items: [
      answerItem("l11-p1-a2-q1", "1", "森さん／ビール／好き", "森さんは ビールが 好きです。", { promptKana: "もりさん／ビール／すき" }),
      answerItem("l11-p1-a2-q2", "2", "スミスさん／魚／嫌い", "スミスさんは 魚が 嫌いです。", { promptKana: "スミスさん／さかな／きらい" }),
      answerItem("l11-p1-a2-q3", "3", "李さん／絵／上手", "李さんは 絵が 上手です。", { promptKana: "りさん／え／じょうず" }),
      answerItem("l11-p1-a2-q4", "4", "わたし／料理／下手", "わたしは 料理が 下手です。", { promptKana: "わたし／りょうり／へた" })
    ]
  },
  {
    id: "l11-p1-a3",
    section: "practice_1",
    order: 3,
    title: "听录音，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 3),
      label: "第11课 练习I-3",
      transcript: {
        text: "張さんは 水泳が 好きですか。はい。はい、好きです。いいえ。いいえ、好きでは ありません。森さんは 野球が 好きですか。はい。はい、好きです。王さんは カラオケが 好きですか。いいえ。いいえ、好きでは ありません。キムさんは お酒が 嫌いですか。はい。はい、嫌いです。あの 人は 歌が 上手ですか。いいえ。いいえ、上手では ありません。小野さんは 料理が 上手ですか。はい、とても。はい、とても 上手です。",
        source: "manual",
        confidenceNote: "Azure STT 识别后，尾部按分段转写补齐。",
        segments: [
          { itemNumber: "例1", text: "張さんは 水泳が 好きですか。はい。はい、好きです。" },
          { itemNumber: "例2", text: "張さんは 水泳が 好きですか。いいえ。いいえ、好きでは ありません。" },
          { itemNumber: "1", text: "森さんは 野球が 好きですか。はい。はい、好きです。" },
          { itemNumber: "2", text: "王さんは カラオケが 好きですか。いいえ。いいえ、好きでは ありません。" },
          { itemNumber: "3", text: "キムさんは お酒が 嫌いですか。はい。はい、嫌いです。" },
          { itemNumber: "4", text: "あの 人は 歌が 上手ですか。いいえ。いいえ、上手では ありません。" },
          { itemNumber: "5", text: "小野さんは 料理が 上手ですか。はい、とても。はい、とても 上手です。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "張さんは 水泳が 好きですか。",
          beforeKana: "ちょうさんは すいえいが すきですか。",
          after: [text("はい、好きです。／いいえ、好きでは ありません。")],
          afterKana: "はい、すきです。／いいえ、すきでは ありません。"
        }
      }
    ],
    items: [
      answerItem("l11-p1-a3-q1", "1", "はい", "はい、好きです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "はい"
      }),
      answerItem("l11-p1-a3-q2", "2", "いいえ", "いいえ、好きでは ありません。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "いいえ"
      }),
      answerItem("l11-p1-a3-q3", "3", "はい", "はい、嫌いです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "はい"
      }),
      answerItem("l11-p1-a3-q4", "4", "いいえ", "いいえ、上手では ありません。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "いいえ"
      }),
      answerItem("l11-p1-a3-q5", "5", "はい／とても", "はい、とても 上手です。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "はい／とても"
      })
    ]
  },
  {
    id: "l11-p1-a4",
    section: "practice_1",
    order: 4,
    title: "仿照例句，用（　　）中的词语回答提问。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "田中さんは どんな 食べ物が 好きですか。（魚や 野菜）",
          beforeKana: "たなかさんは どんな たべものが すきですか。（さかなや やさい）",
          after: [text("魚や 野菜が 好きです。")],
          afterKana: "さかなや やさいが すきです。"
        }
      }
    ],
    items: [
      answerItem("l11-p1-a4-q1", "1", "李さんは どんな 歌が 好きですか。（楽しい 歌）", "楽しい 歌が 好きです。", {
        promptKana: "りさんは どんな うたが すきですか。（たのしい うた）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l11-p1-a4-q2", "2", "張さんは どんな スポーツが できますか。（テニスや 水泳など）", "テニスや 水泳などが できます。", {
        promptKana: "ちょうさんは どんな スポーツが できますか。（テニスや すいえいなど）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l11-p1-a4-q3", "3", "小野さんは どんな 花が 好きですか。（ヒマワリ）", "ヒマワリが 好きです。", {
        promptKana: "おのさんは どんな はなが すきですか。（ヒマワリ）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l11-p1-a4-q4", "4", "吉田さんは どんな 料理が できますか。（料理は 全然）", "料理は 全然 できません。", {
        promptKana: "よしださんは どんな りょうりが できますか。（りょうりは ぜんぜん）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      })
    ]
  },
  {
    id: "l11-p1-a5",
    section: "practice_1",
    order: 5,
    title: "看图，仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    assets: [
      { id: "l11-p1-a5-category-preference-picture-prompts", kind: "exercise_image", imagePath: exerciseImage("book1_lesson11_1_5.png") }
    ],
    displayAssets: ["l11-p1-a5-category-preference-picture-prompts"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "飲み物／ビール",
          beforeKana: "のみもの／ビール",
          after: [text("森さんは どんな 飲み物が 好きですか。——ビールが 好きです。")],
          afterKana: "もりさんは どんな のみものが すきですか。——ビールが すきです。"
        }
      }
    ],
    items: [
      answerItem("l11-p1-a5-q1", "1", "スポーツ／サッカー", "森さんは どんな スポーツが 好きですか。\nサッカーが 好きです。", {
        promptKana: "スポーツ／サッカー",
        responseScope: "question_and_answer",
        multiline: true,
        rows: 3,
        placeholder: "输入完整问答"
      }),
      answerItem("l11-p1-a5-q2", "2", "食べ物／肉や チーズ", "森さんは どんな 食べ物が 好きですか。\n肉や チーズが 好きです。", {
        promptKana: "たべもの／にくや チーズ",
        responseScope: "question_and_answer",
        multiline: true,
        rows: 3,
        placeholder: "输入完整问答"
      }),
      answerItem("l11-p1-a5-q3", "3", "音楽／ロック", "森さんは どんな 音楽が 好きですか。\nロックが 好きです。", {
        promptKana: "おんがく／ロック",
        responseScope: "question_and_answer",
        multiline: true,
        rows: 3,
        placeholder: "输入完整问答"
      }),
      answerItem("l11-p1-a5-q4", "4", "花／バラ", "森さんは どんな 花が 好きですか。\nバラが 好きです。", {
        promptKana: "はな／バラ",
        responseScope: "question_and_answer",
        multiline: true,
        rows: 3,
        placeholder: "输入完整问答"
      })
    ]
  },
  {
    id: "l11-p1-a6",
    section: "practice_1",
    order: 6,
    title: "仿照例句替换画线部分回答提问。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "田中さん、よく スポーツを しますか。（いいえ／あまり）",
          beforeKana: "たなかさん、よく スポーツを しますか。（いいえ／あまり）",
          after: [text("いいえ、あまり しません。")],
          afterKana: "いいえ、あまり しません。"
        }
      }
    ],
    items: [
      answerItem("l11-p1-a6-q1", "1", "よく 散歩しますか。（はい／よく）", "はい、よく 散歩します。", {
        promptKana: "よく さんぽしますか。（はい／よく）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l11-p1-a6-q2", "2", "カラオケに 行きますか。（はい／時々）", "はい、時々 行きます。", {
        promptKana: "カラオケに いきますか。（はい／ときどき）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l11-p1-a6-q3", "3", "スペイン語が 分かりますか。（いいえ／全然）", "いいえ、全然 分かりません。", {
        promptKana: "スペインごが わかりますか。（いいえ／ぜんぜん）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l11-p1-a6-q4", "4", "よく 魚を 食べますか。（はい／たまに）", "はい、たまに 魚を 食べます。", {
        promptKana: "よく さかなを たべますか。（はい／たまに）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        evaluationMode: "acceptable_answers",
        acceptableAlternatives: ["はい、たまに 食べます。"]
      })
    ]
  },
  {
    id: "l11-p1-a7",
    section: "practice_1",
    order: 7,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: "按例句写出完整句子或问答。",
    layout: [],
    itemGroups: [
      {
        id: "l11-p1-a7-g1",
        example: {
          id: "l11-p1-a7-ex1",
          label: "[例1]",
          before: "お酒を 飲みません。／お酒が 嫌いです。",
          beforeKana: "おさけを のみません。／おさけが きらいです。",
          after: [text("お酒を 飲みませんね。どうしてですか。——お酒が 嫌いですから。")],
          afterKana: "おさけを のみませんね。どうしてですか。——おさけが きらいですから。"
        },
        items: [
          answerItem("l11-p1-a7-q1", "1", "テレビを 見ません。／今 忙しいです。", "テレビを 見ませんね。どうしてですか。\n今 忙しいですから。", {
            promptKana: "テレビを みません。／いま いそがしいです。",
            responseScope: "question_and_answer",
            multiline: true,
            rows: 3,
            placeholder: "输入完整问答"
          }),
          answerItem("l11-p1-a7-q2", "2", "外国へ 旅行に 行きません。／飛行機が 怖いです。", "外国へ 旅行に 行きませんね。どうしてですか。\n飛行機が 怖いですから。", {
            promptKana: "がいこくへ りょこうに いきません。／ひこうきが こわいです。",
            responseScope: "question_and_answer",
            multiline: true,
            rows: 3,
            placeholder: "输入完整问答"
          }),
          answerItem("l11-p1-a7-q3", "3", "もう 寝ます。／とても 疲れました。", "もう 寝ますね。どうしてですか。\nとても 疲れましたから。", {
            promptKana: "もう ねます。／とても つかれました。",
            responseScope: "question_and_answer",
            multiline: true,
            rows: 3,
            placeholder: "输入完整问答"
          }),
          answerItem("l11-p1-a7-q4", "4", "横浜へ 行きます。／横浜で 会議が あります。", "横浜へ 行きますね。どうしてですか。\n横浜で 会議が ありますから。", {
            promptKana: "よこはまへ いきます。／よこはまで かいぎが あります。",
            responseScope: "question_and_answer",
            multiline: true,
            rows: 3,
            placeholder: "输入完整问答"
          })
        ]
      },
      {
        id: "l11-p1-a7-g2",
        example: {
          id: "l11-p1-a7-ex2",
          label: "[例2]",
          before: "明日 試験が あります。／今晩 勉強します。",
          beforeKana: "あした しけんが あります。／こんばん べんきょうします。",
          after: [text("明日 試験が ありますから、今晩 勉強します。")],
          afterKana: "あした しけんが ありますから、こんばん べんきょうします。"
        },
        items: [
          answerItem("l11-p1-a7-q5", "5", "今日は 土曜日です。／銀行は 休みです。", "今日は 土曜日ですから、銀行は 休みです。", { promptKana: "きょうは どようびです。／ぎんこうは やすみです。" }),
          answerItem("l11-p1-a7-q6", "6", "張さんは 本が 好きです。／よく 図書館へ 行きます。", "張さんは 本が 好きですから、よく 図書館へ 行きます。", { promptKana: "ちょうさんは ほんが すきです。／よく としょかんへ いきます。" }),
          answerItem("l11-p1-a7-q7", "7", "わたしは 肉が 嫌いです。／全然 食べません。", "わたしは 肉が 嫌いですから、全然 食べません。", { promptKana: "わたしは にくが きらいです。／ぜんぜん たべません。" }),
          answerItem("l11-p1-a7-q8", "8", "脚が 痛いです。／タクシーで 帰ります。", "脚が 痛いですから、タクシーで 帰ります。", { promptKana: "あしが いたいです。／タクシーで かえります。" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l11-p2-a1",
    section: "practice_2",
    order: 1,
    title: "听录音，与录音内容一致的在（　　）中画○，不一致的画×。",
    instruction: "",
    interaction: "true_false",
    answerUnit: "boolean",
    responseScope: "boolean_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 1),
      label: "第11课 练习II-1",
      transcript: {
        text: "昨日の 天気は どうでしたか。よかったですよ。あそこに 犬が いますね。ええ、あれは わたしの 犬です。スープは おいしいですか。いいえ、おいしく ないです。熱く ないですから。森さんは どんな 音楽が 好きですか。そうですね。クラシックは あまり 好きじゃ ありません。ロックや ポップスなどが 好きです。小野さん、毎日 何を 読みますか。新聞を 読みます。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按图片题校正。",
        segments: [
          { itemNumber: "例", text: "昨日の 天気は どうでしたか。よかったですよ。" },
          { itemNumber: "1", text: "あそこに 犬が いますね。ええ、あれは わたしの 犬です。" },
          { itemNumber: "2", text: "スープは おいしいですか。いいえ、おいしく ないです。熱く ないですから。" },
          { itemNumber: "3", text: "森さんは どんな 音楽が 好きですか。クラシックは あまり 好きじゃ ありません。ロックや ポップスなどが 好きです。" },
          { itemNumber: "4", text: "小野さん、毎日 何を 読みますか。新聞を 読みます。" }
        ]
      }
    },
    assets: [
      { id: "l11-p2-a1-listening-true-false-pictures", kind: "exercise_image", imagePath: exerciseImage("book1_lesson11_2_1.png") }
    ],
    displayAssets: ["l11-p2-a1-listening-true-false-pictures"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "昨日の 天気は どうでしたか。",
          beforeKana: "きのうの てんきは どうでしたか。",
          after: [text("○")]
        }
      }
    ],
    items: [
      trueFalseItem("l11-p2-a1-q1", "1", "图 1", true),
      trueFalseItem("l11-p2-a1-q2", "2", "图 2", false),
      trueFalseItem("l11-p2-a1-q3", "3", "图 3", false),
      trueFalseItem("l11-p2-a1-q4", "4", "图 4", true)
    ]
  },
  {
    id: "l11-p2-a2",
    section: "practice_2",
    order: 2,
    title: "完成句子。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("この 部屋は 静かですか。——いいえ、"), blank("example"), text("。")],
          beforeKana: "この へやは しずかですか。——いいえ、しずかでは ありません。",
          after: [text("静かでは ありません")],
          afterKana: "しずかでは ありません"
        }
      }
    ],
    items: [
      blankItem("l11-p2-a2-q1", "1", [text("キムさんは 魚が 好きですか。——いいえ、あまり "), blank("answer"), text("。")], { answer: "好きでは ありません" }, { promptKana: "キムさんは さかなが すきですか。——いいえ、あまり ______。" }),
      blankItem("l11-p2-a2-q2", "2", [text("吉田さんは 中国語が 分かりますか。——いいえ、全然 "), blank("answer"), text("。")], { answer: "分かりません" }, { promptKana: "よしださんは ちゅうごくごが わかりますか。——いいえ、ぜんぜん ______。" }),
      blankItem("l11-p2-a2-q3", "3", [text("田中さんは よく 韓国へ 行きますか。——はい、よく "), blank("answer"), text("。")], { answer: "行きます" }, { promptKana: "たなかさんは よく かんこくへ いきますか。——はい、よく ______。" }),
      blankItem("l11-p2-a2-q4", "4", [text("李さんは 日本の 料理を 作りますか。——はい、時々 "), blank("answer"), text("。")], { answer: "作ります" }, { promptKana: "りさんは にほんの りょうりを つくりますか。——はい、ときどき ______。" }),
      slotItem("l11-p2-a2-q5", "5", [text("小野さんは よく ゴルフを しますか。——いいえ、あまり "), blank("first"), text("。でも、たまに "), blank("second"), text("。")], [
        { id: "first", expectedUnit: "phrase", width: "medium", placeholder: "前半" },
        { id: "second", expectedUnit: "phrase", width: "medium", placeholder: "后半" }
      ], { first: "しません", second: "します" }, { promptKana: "おのさんは よく ゴルフを しますか。——いいえ、あまり ______。でも、たまに ______。", responseScope: "phrase_only" })
    ]
  },
  {
    id: "l11-p2-a3",
    section: "practice_2",
    order: 3,
    title: "连接左右两个句子组句。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "森さんは お酒が 好きですから、",
          beforeKana: "もりさんは おさけが すきですから、",
          after: [text("b 毎晩 飲みます。")],
          afterKana: "b まいばん のみます。"
        }
      }
    ],
    items: [
      matchingItem("l11-p2-a3-q1", "1", "わたしは 歌が 下手ですから、", "f", "わたしは うたが へたですから、"),
      matchingItem("l11-p2-a3-q2", "2", "明日は 日曜日ですから、", "e", "あしたは にちようびですから、"),
      matchingItem("l11-p2-a3-q3", "3", "明日は 李さんの 誕生日ですから、", "c", "あしたは りさんの たんじょうびですから、"),
      matchingItem("l11-p2-a3-q4", "4", "わたしの 家は 駅から 5分ですから、", "a", "わたしの いえは えきから ごふんですから、"),
      matchingItem("l11-p2-a3-q5", "5", "小野さんは 料理が 上手ですから、", "d", "おのさんは りょうりが じょうずですから、")
    ]
  },
  {
    id: "l11-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l11-p2-a4-q1", "1", "小野女士喜欢唱歌。", "小野さんは 歌が 好きです。", { answerSource: "prompt" }),
      answerItem("l11-p2-a4-q2", "2", "史密斯先生懂韩语。", "スミスさんは 韓国語が 分かります。", { answerSource: "prompt" }),
      answerItem("l11-p2-a4-q3", "3", "吉田先生会做菜吗？——不，一点儿都不会。", "吉田さんは 料理が できますか。\nいいえ、全然 できません。", {
        answerSource: "prompt",
        responseScope: "question_and_answer",
        multiline: true,
        rows: 3,
        placeholder: "输入完整问答"
      })
    ]
  }
];

export const lesson11Practice: LessonPractice = {
  lessonId: "lesson11",
  title: "第11課 小野さんは 歌が 好きです",
  sourcePages: [
    { pageNo: 140, imagePath: page(140) },
    { pageNo: 141, imagePath: page(141) },
    { pageNo: 142, imagePath: page(142) }
  ],
  activities
};
