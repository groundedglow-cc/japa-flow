import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson9/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit3/lesson9/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
const sentenceSlot = (placeholder = "输入完整回答"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const dialogueSlot = (placeholder = "输入完整对话", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows, placeholder }
];
const shortSlots = (slotIds: string[]): InputSlot[] => slotIds.map((slotId) => ({ id: slotId, expectedUnit: "word", width: "short", placeholder: "输入词语" }));

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
    ? [{ id: "answer", expectedUnit: "sentence", width: "long", multiline: true, rows: 3, placeholder: options.placeholder || "输入完整回答" }]
    : sentenceSlot(options.placeholder || "输入完整回答"),
  answer: { slotValues: { answer }, acceptableAlternatives: options.acceptableAlternatives }
});

const dialogueItem = (
  id: string,
  number: string,
  prompt: string,
  answer: string,
  promptKana?: string
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "example_transform",
  responseScope: "dialogue_only",
  inputSlots: dialogueSlot(),
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
  responseScope: options.responseScope || "word_only",
  responseScopeHint: options.responseScopeHint,
  inputSlots: shortSlots(Object.keys(answers)),
  answer: { slotValues: answers }
});

const slotItem = (
  id: string,
  number: string,
  prompt: PromptPart[] | string,
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
  promptKana: string
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "prompt",
  responseScope: "boolean_only",
  choices: [
    { id: "true", label: "○" },
    { id: "false", label: "×" }
  ],
  answer: { boolean: value, choiceIds: [value ? "true" : "false"] }
});

const p1a1FillItem = (number: string, answer: string): PracticeItem => blankItem(
  `l9-p1-a1-q${number}`,
  number,
  `图 ${number}`,
  { answer },
  {
    answerSource: "audio",
    responseScope: "word_only",
    responseScopeHint: "边看图边听录音，只填写括号里的形容词。"
  }
);

const activities: PracticeActivity[] = [
  {
    id: "l9-p1-a1",
    section: "practice_1",
    order: 1,
    title: "边看图边听录音，仿照例句在（　　）中填入词语。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: "边看图边听录音，只填写括号里的形容词。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 1),
      label: "第9课 练习I-1",
      transcript: {
        text: "この 靴は 新しいです。新しい。この 靴は 古いです。古い。この カメラは 高いです。高い。この カメラは 安いです。安い。この 問題は 難しいです。難しい。この 問題は 易しいです。易しい。この かばんは 大きいです。大きい。この かばんは 小さいです。小さい。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按教材图片和词汇校正。",
        segments: [
          { itemNumber: "例", text: "この 靴は 新しいです。新しい。" },
          { itemNumber: "1", text: "この 靴は 古いです。古い。" },
          { itemNumber: "2", text: "この カメラは 高いです。高い。" },
          { itemNumber: "3", text: "この カメラは 安いです。安い。" },
          { itemNumber: "4", text: "この 問題は 難しいです。難しい。" },
          { itemNumber: "5", text: "この 問題は 易しいです。易しい。" },
          { itemNumber: "6", text: "この かばんは 大きいです。大きい。" },
          { itemNumber: "7", text: "この かばんは 小さいです。小さい。" }
        ]
      }
    },
    assets: [
      { id: "l9-p1-a1-picture-prompts", kind: "exercise_image", imagePath: exerciseImage("book1_lesson9_1_1.png") }
    ],
    displayAssets: ["l9-p1-a1-picture-prompts"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("（"), blank("example"), text("）")],
          beforeKana: "（あたらしい）",
          after: [text("新しい")],
          afterKana: "あたらしい"
        }
      }
    ],
    items: [
      p1a1FillItem("1", "古い"),
      p1a1FillItem("2", "高い"),
      p1a1FillItem("3", "安い"),
      p1a1FillItem("4", "難しい"),
      p1a1FillItem("5", "易しい"),
      p1a1FillItem("6", "大きい"),
      p1a1FillItem("7", "小さい")
    ]
  },
  {
    id: "l9-p1-a2",
    section: "practice_1",
    order: 2,
    title: "仿照例句进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    itemGroups: [
      {
        id: "l9-p1-a2-g1",
        example: {
          id: "l9-p1-a2-ex1",
          label: "[例1]",
          before: "この かばんは 大きいです。",
          beforeKana: "この かばんは おおきいです。",
          after: [text("この かばんは "), repl("大きく ない", "adjective", { kana: "おおきく ない" }), text("です。")],
          afterKana: "この かばんは おおきく ないです。"
        },
        items: [
          answerItem("l9-p1-a2-q1", "1", "この お茶は 熱いです。", "この お茶は 熱く ないです。", { promptKana: "この おちゃは あついです。" }),
          answerItem("l9-p1-a2-q2", "2", "パーティーは 楽しいです。", "パーティーは 楽しく ないです。", { promptKana: "パーティーは たのしいです。" }),
          answerItem("l9-p1-a2-q3", "3", "この 料理は 辛いです。", "この 料理は 辛く ないです。", { promptKana: "この りょうりは からいです。" }),
          answerItem("l9-p1-a2-q4", "4", "日本の 食べ物は おいしいです。", "日本の 食べ物は おいしく ないです。", { promptKana: "にほんの たべものは おいしいです。" }),
          answerItem("l9-p1-a2-q5", "5", "明日は 忙しいです。", "明日は 忙しく ないです。", { promptKana: "あしたは いそがしいです。" }),
          answerItem("l9-p1-a2-q6", "6", "この 辞書は いいです。", "この 辞書は よく ないです。", {
            promptKana: "この じしょは いいです。",
            evaluationMode: "acceptable_answers",
            acceptableAlternatives: ["この 辞書は 良く ないです。"]
          })
        ]
      },
      {
        id: "l9-p1-a2-g2",
        example: {
          id: "l9-p1-a2-ex2",
          label: "[例2]",
          before: "公園は 広かったです。",
          beforeKana: "こうえんは ひろかったです。",
          after: [text("公園は "), repl("広く なかった", "adjective", { kana: "ひろく なかった" }), text("です。")],
          afterKana: "こうえんは ひろく なかったです。"
        },
        items: [
          answerItem("l9-p1-a2-q7", "7", "駅は 遠かったです。", "駅は 遠く なかったです。", { promptKana: "えきは とおかったです。" }),
          answerItem("l9-p1-a2-q8", "8", "その 学校は 近かったです。", "その 学校は 近く なかったです。", { promptKana: "その がっこうは ちかかったです。" }),
          answerItem("l9-p1-a2-q9", "9", "天気は 悪かったです。", "天気は 悪く なかったです。", { promptKana: "てんきは わるかったです。" }),
          answerItem("l9-p1-a2-q10", "10", "先週は 忙しかったです。", "先週は 忙しく なかったです。", { promptKana: "せんしゅうは いそがしかったです。" }),
          answerItem("l9-p1-a2-q11", "11", "図書室は 狭かったです。", "図書室は 狭く なかったです。", { promptKana: "としょしつは せまかったです。" }),
          answerItem("l9-p1-a2-q12", "12", "昨日の 試験は よかったです。", "昨日の 試験は よく なかったです。", { promptKana: "きのうの しけんは よかったです。" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l9-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句回答提问。",
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
          before: "その 靴は 新しいですか。（はい）",
          beforeKana: "その くつは あたらしいですか。（はい）",
          after: [text("はい、新しいです。")],
          afterKana: "はい、あたらしいです。"
        }
      },
      {
        type: "example",
        content: {
          label: "",
          before: "昨日は 暑かったですか。（いいえ）",
          beforeKana: "きのうは あつかったですか。（いいえ）",
          after: [text("いいえ、暑く なかったです。")],
          afterKana: "いいえ、あつく なかったです。"
        }
      }
    ],
    items: [
      answerItem("l9-p1-a3-q1", "1", "この 本は おもしろいですか。（はい）", "はい、おもしろいです。", {
        promptKana: "この ほんは おもしろいですか。（はい）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l9-p1-a3-q2", "2", "昨日は 寒かったですか。（いいえ）", "いいえ、寒く なかったです。", {
        promptKana: "きのうは さむかったですか。（いいえ）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l9-p1-a3-q3", "3", "部屋は 狭いですか。（いいえ）", "いいえ、狭く ないです。", {
        promptKana: "へやは せまいですか。（いいえ）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l9-p1-a3-q4", "4", "この リンゴは 甘いですか。（いいえ）", "いいえ、甘く ないです。", {
        promptKana: "この リンゴは あまいですか。（いいえ）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l9-p1-a3-q5", "5", "旅行は 楽しかったですか。（はい）", "はい、楽しかったです。", {
        promptKana: "りょこうは たのしかったですか。（はい）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l9-p1-a3-q6", "6", "その 水は おいしいですか。（はい）", "はい、おいしいです。", {
        promptKana: "その みずは おいしいですか。（はい）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      })
    ]
  },
  {
    id: "l9-p1-a4",
    section: "practice_1",
    order: 4,
    title: "看图，仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [
      { id: "l9-p1-a4-adjective-picture-prompts", kind: "exercise_image", imagePath: exerciseImage("book1_lesson9_1_4.png") }
    ],
    displayAssets: ["l9-p1-a4-adjective-picture-prompts"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "新しい／靴",
          beforeKana: "あたらしい／くつ",
          after: [text("これは "), repl("新しい", "adjective", { kana: "あたらしい" }), text(" "), repl("靴", "noun", { kana: "くつ" }), text("です。")],
          afterKana: "これは あたらしい くつです。"
        }
      }
    ],
    items: [
      answerItem("l9-p1-a4-q1", "1", "大きい／リンゴ", "これは 大きい リンゴです。", { promptKana: "おおきい／リンゴ" }),
      answerItem("l9-p1-a4-q2", "2", "安い／時計", "これは 安い 時計です。", { promptKana: "やすい／とけい" }),
      answerItem("l9-p1-a4-q3", "3", "新しい／自転車", "これは 新しい 自転車です。", { promptKana: "あたらしい／じてんしゃ" }),
      answerItem("l9-p1-a4-q4", "4", "冷たい／ジュース", "これは 冷たい ジュースです。", { promptKana: "つめたい／ジュース" }),
      answerItem("l9-p1-a4-q5", "5", "低い／ビル", "これは 低い ビルです。", { promptKana: "ひくい／ビル" }),
      answerItem("l9-p1-a4-q6", "6", "高い／カメラ", "これは 高い カメラです。", { promptKana: "たかい／カメラ" }),
      answerItem("l9-p1-a4-q7", "7", "高い／山", "これは 高い 山です。", { promptKana: "たかい／やま" })
    ]
  },
  {
    id: "l9-p1-a5",
    section: "practice_1",
    order: 5,
    title: "仿照例句进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "毎日 お茶を 飲みます。（熱い）",
          beforeKana: "まいにち おちゃを のみます。（あつい）",
          after: [text("毎日 "), repl("熱い", "adjective", { kana: "あつい" }), text(" お茶を 飲みます。")],
          afterKana: "まいにち あつい おちゃを のみます。"
        }
      }
    ],
    items: [
      answerItem("l9-p1-a5-q1", "1", "昨日 かばんを 買いました。（安い）", "昨日 安い かばんを 買いました。", { promptKana: "きのう かばんを かいました。（やすい）" }),
      answerItem("l9-p1-a5-q2", "2", "毎日 ニュースを 聞きました。（いい）", "毎日 いい ニュースを 聞きました。", { promptKana: "まいにち ニュースを ききました。（いい）" }),
      answerItem("l9-p1-a5-q3", "3", "先週 ケーキを 買いました。（おいしい）", "先週 おいしい ケーキを 買いました。", { promptKana: "せんしゅう ケーキを かいました。（おいしい）" }),
      answerItem("l9-p1-a5-q4", "4", "李さんに 花を あげました。（かわいい）", "李さんに かわいい 花を あげました。", { promptKana: "りさんに はなを あげました。（かわいい）" })
    ]
  },
  {
    id: "l9-p1-a6",
    section: "practice_1",
    order: 6,
    title: "听录音，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 6),
      label: "第9课 练习I-6",
      transcript: {
        text: "それは 高い 時計ですか。はい、とても。はい、とても 高い 時計です。昨日は 暑かったですか。いいえ。いいえ、あまり 暑く なかったです。天安門は 大きい 建物ですか。はい、とても。はい、とても 大きい 建物です。その かばんは 高かったですか。いいえ、あまり。いいえ、あまり 高く ありませんでした。それは 冷たい 水ですか。はい、とても。はい、とても 冷たい 水です。天気は よかったですか。いいえ、あまり。いいえ、あまり よく なかったです。",
        source: "manual",
        confidenceNote: "Azure STT 分段识别后按题面校正。",
        segments: [
          { itemNumber: "例1", text: "それは 高い 時計ですか。はい、とても。はい、とても 高い 時計です。" },
          { itemNumber: "例2", text: "昨日は 暑かったですか。いいえ。いいえ、あまり 暑く なかったです。" },
          { itemNumber: "1", text: "天安門は 大きい 建物ですか。はい、とても。はい、とても 大きい 建物です。" },
          { itemNumber: "2", text: "その かばんは 高かったですか。いいえ、あまり。いいえ、あまり 高く ありませんでした。" },
          { itemNumber: "3", text: "それは 冷たい 水ですか。はい、とても。はい、とても 冷たい 水です。" },
          { itemNumber: "4", text: "天気は よかったですか。いいえ、あまり。いいえ、あまり よく なかったです。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "それは 高い 時計ですか。（はい／とても）",
          beforeKana: "それは たかい とけいですか。（はい／とても）",
          after: [text("はい、とても 高い 時計です。")],
          afterKana: "はい、とても たかい とけいです。"
        }
      },
      {
        type: "example",
        content: {
          label: "",
          before: "昨日は 暑かったですか。（いいえ／あまり）",
          beforeKana: "きのうは あつかったですか。（いいえ／あまり）",
          after: [text("いいえ、あまり 暑く なかったです。")],
          afterKana: "いいえ、あまり あつく なかったです。"
        }
      }
    ],
    items: [
      answerItem("l9-p1-a6-q1", "1", "はい／とても", "はい、とても 大きい 建物です。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "はい／とても"
      }),
      answerItem("l9-p1-a6-q2", "2", "いいえ／あまり", "いいえ、あまり 高く ありませんでした。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "いいえ／あまり",
        evaluationMode: "acceptable_answers",
        acceptableAlternatives: ["いいえ、あまり 高く なかったです。"]
      }),
      answerItem("l9-p1-a6-q3", "3", "はい／とても", "はい、とても 冷たい 水です。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "はい／とても"
      }),
      answerItem("l9-p1-a6-q4", "4", "いいえ／あまり", "いいえ、あまり よく なかったです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "いいえ／あまり"
      })
    ]
  },
  {
    id: "l9-p1-a7",
    section: "practice_1",
    order: 7,
    title: "仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "北京ダック／食べます／おいしい",
          beforeKana: "ペキンダック／たべます／おいしい",
          after: [text("甲：北京ダックは 食べましたか。 乙：はい、食べました。とても おいしかったです。")],
          afterKana: "こう：ペキンダックは たべましたか。 おつ：はい、たべました。とても おいしかったです。"
        }
      }
    ],
    items: [
      dialogueItem("l9-p1-a7-q1", "1", "すき焼き／食べます／おいしい", "甲：すき焼きは 食べましたか。\n乙：はい、食べました。とても おいしかったです。", "すきやき／たべます／おいしい"),
      dialogueItem("l9-p1-a7-q2", "2", "歌舞伎／見ます／おもしろい", "甲：歌舞伎は 見ましたか。\n乙：はい、見ました。とても おもしろかったです。", "かぶき／みます／おもしろい")
    ]
  },
  {
    id: "l9-p2-a1",
    section: "practice_2",
    order: 1,
    title: "在（　　）中填入反义词。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("大きい ↔ （"), blank("example"), text("）")],
          beforeKana: "おおきい ↔ （ちいさい）",
          after: [text("小さい")],
          afterKana: "ちいさい"
        }
      }
    ],
    items: [
      blankItem("l9-p2-a1-q1", "1", [text("熱い ↔ （"), blank("answer"), text("）")], { answer: "冷たい" }, { promptKana: "あつい ↔ （  ）" }),
      blankItem("l9-p2-a1-q2", "2", [text("新しい ↔ （"), blank("answer"), text("）")], { answer: "古い" }, { promptKana: "あたらしい ↔ （  ）" }),
      blankItem("l9-p2-a1-q3", "3", [text("暑い ↔ （"), blank("answer"), text("）")], { answer: "寒い" }, { promptKana: "あつい ↔ （  ）" }),
      blankItem("l9-p2-a1-q4", "4", [text("悪い ↔ （"), blank("answer"), text("）")], { answer: "いい" }, { promptKana: "わるい ↔ （  ）" }),
      blankItem("l9-p2-a1-q5", "5", [text("難しい ↔ （"), blank("answer"), text("）")], { answer: "易しい" }, { promptKana: "むずかしい ↔ （  ）" }),
      blankItem("l9-p2-a1-q6", "6", [text("低い ↔ （"), blank("answer"), text("）")], { answer: "高い" }, { promptKana: "ひくい ↔ （  ）" }),
      blankItem("l9-p2-a1-q7", "7", [text("広い ↔ （"), blank("answer"), text("）")], { answer: "狭い" }, { promptKana: "ひろい ↔ （  ）" }),
      blankItem("l9-p2-a1-q8", "8", [text("近い ↔ （"), blank("answer"), text("）")], { answer: "遠い" }, { promptKana: "ちかい ↔ （  ）" }),
      blankItem("l9-p2-a1-q9", "9", [text("安い ↔ （"), blank("answer"), text("）")], { answer: "高い" }, { promptKana: "やすい ↔ （  ）" })
    ]
  },
  {
    id: "l9-p2-a2",
    section: "practice_2",
    order: 2,
    title: "在（　　）中填入适当的词语。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "custom",
    responseScopeHint: "填写括号里的形容词或形容词变化形式。",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("あなたの 車は 新しいですか。——いいえ，（"), blank("negative"), text("）です。（"), blank("opposite"), text("）です。")],
          beforeKana: "あなたの くるまは あたらしいですか。——いいえ、（あたらしく ない）です。（ふるい）です。",
          after: [text("新しく ない／古い")],
          afterKana: "あたらしく ない／ふるい"
        }
      }
    ],
    items: [
      slotItem("l9-p2-a2-q1", "1", [text("日本語は 難しいですか。——いいえ，（"), blank("negative"), text("）です。（"), blank("opposite"), text("）です。")], [
        { id: "negative", expectedUnit: "phrase", width: "medium", placeholder: "否定形" },
        { id: "opposite", expectedUnit: "word", width: "medium", placeholder: "反义词" }
      ], { negative: "難しく ない", opposite: "易しい" }, { promptKana: "にほんごは むずかしいですか。——いいえ、（  ）です。（  ）です。" }),
      slotItem("l9-p2-a2-q2", "2", [text("会社は 駅から（"), blank("question"), text("）ですか。——いいえ、近く ないです。（"), blank("opposite"), text("）です。")], [
        { id: "question", expectedUnit: "word", width: "medium", placeholder: "形容词" },
        { id: "opposite", expectedUnit: "word", width: "medium", placeholder: "反义词" }
      ], { question: "近い", opposite: "遠い" }, { promptKana: "かいしゃは えきから（  ）ですか。——いいえ、ちかく ないです。（  ）です。" }),
      slotItem("l9-p2-a2-q3", "3", [text("駅の 前の 公園は（"), blank("question"), text("）ですか。——いいえ，（"), blank("negative"), text("）です。狭いです。")], [
        { id: "question", expectedUnit: "word", width: "medium", placeholder: "形容词" },
        { id: "negative", expectedUnit: "phrase", width: "medium", placeholder: "否定形" }
      ], { question: "広い", negative: "広く ない" }, { promptKana: "えきの まえの こうえんは（  ）ですか。——いいえ、（  ）です。せまいです。" }),
      slotItem("l9-p2-a2-q4", "4", [text("あなたの うちは（"), blank("question"), text("）ですか。——いいえ、大きく ないです。（"), blank("opposite"), text("）です。")], [
        { id: "question", expectedUnit: "word", width: "medium", placeholder: "形容词" },
        { id: "opposite", expectedUnit: "word", width: "medium", placeholder: "反义词" }
      ], { question: "大きい", opposite: "小さい" }, { promptKana: "あなたの うちは（  ）ですか。——いいえ、おおきく ないです。（  ）です。" }),
      slotItem("l9-p2-a2-q5", "5", [text("その 時計は 高かったですか。——いいえ，（"), blank("negative"), text("）です。（"), blank("opposite"), text("）です。")], [
        { id: "negative", expectedUnit: "phrase", width: "medium", placeholder: "否定形" },
        { id: "opposite", expectedUnit: "word", width: "medium", placeholder: "反义词" }
      ], { negative: "高く なかった", opposite: "安かった" }, { promptKana: "その とけいは たかかったですか。——いいえ、（  ）です。（  ）です。" })
    ]
  },
  {
    id: "l9-p2-a3",
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
      url: audio(2, 3),
      label: "第9课 练习II-3",
      transcript: {
        text: "試験は 易しかったですか。いいえ。いいえ、易しく なかったです。北京は 今 寒いですか。はい。はい、寒いです。日本の 食べ物は 安いですか。いいえ。いいえ、安く ないです。パーティーは 楽しかったですか。はい。はい、楽しかったです。昨日、天気は よかったですか。いいえ。いいえ、よく なかったです。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按教材图片和回答选项校正。",
        segments: [
          { itemNumber: "例", text: "試験は 易しかったですか。いいえ。いいえ、易しく なかったです。" },
          { itemNumber: "1", text: "北京は 今 寒いですか。はい。はい、寒いです。" },
          { itemNumber: "2", text: "日本の 食べ物は 安いですか。いいえ。いいえ、安く ないです。" },
          { itemNumber: "3", text: "パーティーは 楽しかったですか。はい。はい、楽しかったです。" },
          { itemNumber: "4", text: "昨日、天気は よかったですか。いいえ。いいえ、よく なかったです。" }
        ]
      }
    },
    assets: [
      { id: "l9-p2-a3-listening-picture-prompts", kind: "exercise_image", imagePath: exerciseImage("book1_lesson9_2_3.png") }
    ],
    displayAssets: ["l9-p2-a3-listening-picture-prompts"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "試験は 易しかったですか。（いいえ）",
          beforeKana: "しけんは やさしかったですか。（いいえ）",
          after: [text("いいえ、易しく なかったです。")],
          afterKana: "いいえ、やさしく なかったです。"
        }
      }
    ],
    items: [
      answerItem("l9-p2-a3-q1", "1", "はい", "はい、寒いです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "はい"
      }),
      answerItem("l9-p2-a3-q2", "2", "いいえ", "いいえ、安く ないです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "いいえ"
      }),
      answerItem("l9-p2-a3-q3", "3", "はい", "はい、楽しかったです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "はい"
      }),
      answerItem("l9-p2-a3-q4", "4", "いいえ", "いいえ、よく なかったです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "いいえ"
      })
    ]
  },
  {
    id: "l9-p2-a4",
    section: "practice_2",
    order: 4,
    title: "在正确句子的（　　）中画○，错误的画×。",
    instruction: "",
    interaction: "true_false",
    answerUnit: "boolean",
    responseScope: "boolean_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "この 本は とても おもしろいです。",
          beforeKana: "この ほんは とても おもしろいです。",
          after: [text("○")]
        }
      }
    ],
    items: [
      trueFalseItem("l9-p2-a4-q1", "1", "これは わたしの 新しいの 辞書です。", false, "これは わたしの あたらしいの じしょです。"),
      trueFalseItem("l9-p2-a4-q2", "2", "この 料理は あまり 辛いです。", false, "この りょうりは あまり からいです。"),
      trueFalseItem("l9-p2-a4-q3", "3", "冷たい 水は おいしいです。", true, "つめたい みずは おいしいです。"),
      trueFalseItem("l9-p2-a4-q4", "4", "昨日は よく 天気です。", false, "きのうは よく てんきです。")
    ]
  },
  {
    id: "l9-p2-a5",
    section: "practice_2",
    order: 5,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l9-p2-a5-q1", "1", "四川菜很辣。", "四川料理は とても 辛いです。", {
        answerSource: "prompt",
        evaluationMode: "acceptable_answers",
        acceptableAlternatives: ["四川料理は 辛いです。"]
      }),
      answerItem("l9-p2-a5-q2", "2", "天安门是非常雄伟的建筑。", "天安門は とても 大きい 建物です。", { answerSource: "prompt" }),
      answerItem("l9-p2-a5-q3", "3", "这个汤不太热。", "この スープは あまり 熱く ないです。", { answerSource: "prompt" })
    ]
  }
];

export const lesson9Practice: LessonPractice = {
  lessonId: "lesson9",
  title: "第9課 四川料理は 辛いです",
  sourcePages: [
    { pageNo: 120, imagePath: page(120) },
    { pageNo: 121, imagePath: page(121) },
    { pageNo: 122, imagePath: page(122) }
  ],
  activities
};
