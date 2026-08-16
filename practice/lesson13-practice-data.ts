import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson13/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit4/lesson13/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
const completionHint = "只补全题目中空格处需要填写的部分。";
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
  answer: { slotValues: { answer } },
  renderHint: "dialogue"
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

const personalSentenceItem = (id: string, number: string, prompt: string, modelAnswers: string[], promptKana?: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "personal",
  evaluationMode: "manual_review",
  responseScope: "free_response",
  inputSlots: sentenceSlot("按自己的实际情况造句"),
  answer: {
    modelAnswers,
    note: "本题按实际情况作答，示例答案只用于展示句型。"
  }
});

const activities: PracticeActivity[] = [
  {
    id: "l13-p1-a1",
    section: "practice_1",
    order: 1,
    title: "看图，仿照例句数数。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    assets: [
      { id: "l13-p1-a1-fruit-count-pictures", kind: "exercise_image", imagePath: exerciseImage("book1_lesson13_1_1.png") }
    ],
    displayAssets: ["l13-p1-a1-fruit-count-pictures"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "リンゴ",
          beforeKana: "リンゴ",
          after: [text("ひとつ")],
          afterKana: "ひとつ"
        }
      }
    ],
    items: [
      blankItem("l13-p1-a1-q1", "1", "（1）", { answer: "ふたつ" }, { responseScope: "word_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a1-q2", "2", "（2）", { answer: "みっつ" }, { responseScope: "word_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a1-q3", "3", "（3）", { answer: "いつつ" }, { responseScope: "word_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a1-q4", "4", "（4）", { answer: "いつつ" }, { responseScope: "word_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a1-q5", "5", "（5）", { answer: "むっつ" }, { responseScope: "word_only", responseScopeHint: completionHint })
    ]
  },
  {
    id: "l13-p1-a2",
    section: "practice_1",
    order: 2,
    title: "看图，用“～枚”“～台”等数数。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: completionHint,
    assets: [
      { id: "l13-p1-a2-counter-pictures", kind: "exercise_image", imagePath: exerciseImage("book1_lesson13_1_2.png") }
    ],
    displayAssets: ["l13-p1-a2-counter-pictures"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "切手",
          beforeKana: "きって",
          after: [text("2枚")],
          afterKana: "にまい"
        }
      }
    ],
    items: [
      blankItem("l13-p1-a2-q1", "1", "（1）", { answer: "3台" }, { responseScope: "phrase_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a2-q2", "2", "（2）", { answer: "1本" }, { responseScope: "phrase_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a2-q3", "3", "（3）", { answer: "2冊" }, { responseScope: "phrase_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a2-q4", "4", "（4）", { answer: "5枚" }, { responseScope: "phrase_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a2-q5", "5", "（5）", { answer: "2人" }, { responseScope: "phrase_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a2-q6", "6", "（6）", { answer: "1人" }, { responseScope: "phrase_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a2-q7", "7", "（7）", { answer: "3人" }, { responseScope: "phrase_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a2-q8", "8", "（8）", { answer: "4通" }, { responseScope: "phrase_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a2-q9", "9", "（9）", { answer: "2台" }, { responseScope: "phrase_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a2-q10", "10", "（10）", { answer: "3本" }, { responseScope: "phrase_only", responseScopeHint: completionHint }),
      blankItem("l13-p1-a2-q11", "11", "（11）", { answer: "4冊" }, { responseScope: "phrase_only", responseScopeHint: completionHint })
    ]
  },
  {
    id: "l13-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    itemGroups: [
      {
        id: "l13-p1-a3-g1",
        example: {
          id: "l13-p1-a3-ex1",
          label: "[例1]",
          before: "机の 上／リンゴ／3つ",
          beforeKana: "つくえの うえ／リンゴ／みっつ",
          after: [repl("机の 上", "place", { kana: "つくえの うえ" }), text("に "), repl("リンゴ", "object", { kana: "リンゴ" }), text("が "), repl("3つ", "count", { kana: "みっつ" }), text(" あります。")],
          afterKana: "つくえの うえに リンゴが みっつ あります。"
        },
        items: [
          answerItem("l13-p1-a3-q1", "1", "かばんの 中／紙／10枚", "かばんの 中に 紙が 10枚 あります。", { promptKana: "かばんの なか／かみ／じゅうまい" }),
          answerItem("l13-p1-a3-q2", "2", "ベッドの 下／アルバム／4冊", "ベッドの 下に アルバムが 4冊 あります。", { promptKana: "ベッドの した／アルバム／よんさつ" }),
          answerItem("l13-p1-a3-q3", "3", "机の 上／パソコン／2台", "机の 上に パソコンが 2台 あります。", { promptKana: "つくえの うえ／パソコン／にだい" }),
          answerItem("l13-p1-a3-q4", "4", "箱の 中／ワイン／1本", "箱の 中に ワインが 1本 あります。", { promptKana: "はこの なか／ワイン／いっぽん" })
        ]
      },
      {
        id: "l13-p1-a3-g2",
        example: {
          id: "l13-p1-a3-ex2",
          label: "[例2]",
          before: "7時間／働きます",
          beforeKana: "しちじかん／はたらきます",
          after: [text("田中さんは 毎日 "), repl("7時間", "duration", { kana: "しちじかん" }), text(" "), repl("働きます", "action", { kana: "はたらきます" }), text("。")],
          afterKana: "たなかさんは まいにち しちじかん はたらきます。"
        },
        items: [
          answerItem("l13-p1-a3-q5", "5", "30分／ジョギングします", "田中さんは 毎日 30分 ジョギングします。", { promptKana: "さんじゅっぷん／ジョギングします" }),
          answerItem("l13-p1-a3-q6", "6", "8時間／寝ます", "田中さんは 毎日 8時間 寝ます。", { promptKana: "はちじかん／ねます" }),
          answerItem("l13-p1-a3-q7", "7", "40分／泳ぎます", "田中さんは 毎日 40分 泳ぎます。", { promptKana: "よんじゅっぷん／およぎます" }),
          answerItem("l13-p1-a3-q8", "8", "4時間／テレビを 見ます", "田中さんは 毎日 4時間 テレビを 見ます。", { promptKana: "よじかん／テレビを みます" }),
          answerItem("l13-p1-a3-q9", "9", "1時間／ラジオで 日本語を 勉強します", "田中さんは 毎日 1時間 ラジオで 日本語を 勉強します。", { promptKana: "いちじかん／ラジオで にほんごを べんきょうします" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l13-p1-a4",
    section: "practice_1",
    order: 4,
    title: "仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    layout: [],
    itemGroups: [
      {
        id: "l13-p1-a4-g1",
        example: {
          id: "l13-p1-a4-ex1",
          label: "[例1]",
          before: "3つ／500円",
          beforeKana: "みっつ／ごひゃくえん",
          after: [text("甲：それは いくらですか。\n乙：これは 3つで 500円です。")],
          afterKana: "甲：それは いくらですか。\n乙：これは みっつで ごひゃくえんです。"
        },
        items: [
          dialogueItem("l13-p1-a4-q1", "1", "2つ／300円", "甲：それは いくらですか。\n乙：これは 2つで 300円です。", "ふたつ／さんびゃくえん", 3),
          dialogueItem("l13-p1-a4-q2", "2", "3本／100円", "甲：それは いくらですか。\n乙：これは 3本で 100円です。", "さんぼん／ひゃくえん", 3),
          dialogueItem("l13-p1-a4-q3", "3", "5枚／400円", "甲：それは いくらですか。\n乙：これは 5枚で 400円です。", "ごまい／よんひゃくえん", 3)
        ]
      },
      {
        id: "l13-p1-a4-g2",
        example: {
          id: "l13-p1-a4-ex2",
          label: "[例2]",
          before: "電車で／1時間",
          beforeKana: "でんしゃで／いちじかん",
          after: [text("甲：会社まで どのぐらい かかりますか。\n乙：電車で 1時間ぐらい かかります。")],
          afterKana: "甲：かいしゃまで どのぐらい かかりますか。\n乙：でんしゃで いちじかんぐらい かかります。"
        },
        items: [
          dialogueItem("l13-p1-a4-q4", "4", "自転車で／15分", "甲：会社まで どのぐらい かかりますか。\n乙：自転車で 15分ぐらい かかります。", "じてんしゃで／じゅうごふん", 3),
          dialogueItem("l13-p1-a4-q5", "5", "地下鉄で／30分", "甲：会社まで どのぐらい かかりますか。\n乙：地下鉄で 30分ぐらい かかります。", "ちかてつで／さんじゅっぷん", 3),
          dialogueItem("l13-p1-a4-q6", "6", "歩いて／10分", "甲：会社まで どのぐらい かかりますか。\n乙：歩いて 10分ぐらい かかります。", "あるいて／じゅっぷん", 3),
          dialogueItem("l13-p1-a4-q7", "7", "バスと 地下鉄で／1時間", "甲：会社まで どのぐらい かかりますか。\n乙：バスと 地下鉄で 1時間ぐらい かかります。", "バスと ちかてつで／いちじかん", 3),
          dialogueItem("l13-p1-a4-q8", "8", "バスと 電車で／1時間半", "甲：会社まで どのぐらい かかりますか。\n乙：バスと 電車で 1時間半ぐらい かかります。", "バスと でんしゃで／いちじかんはん", 3)
        ]
      },
      {
        id: "l13-p1-a4-g3",
        example: {
          id: "l13-p1-a4-ex3",
          label: "[例3]",
          before: "映画を 見ます／1か月／2回",
          beforeKana: "えいがを みます／いっかげつ／にかい",
          after: [text("甲：よく 映画を 見ますか。\n乙：ええ、1か月に 2回ぐらい 見ます。")],
          afterKana: "甲：よく えいがを みますか。\n乙：ええ、いっかげつに にかいぐらい みます。"
        },
        items: [
          dialogueItem("l13-p1-a4-q9", "9", "友達に 電話します／1週間／4回", "甲：よく 友達に 電話しますか。\n乙：ええ、1週間に 4回ぐらい 電話します。", "ともだちに でんわします／いっしゅうかん／よんかい", 3),
          dialogueItem("l13-p1-a4-q10", "10", "日本料理を 食べます／月／3回", "甲：よく 日本料理を 食べますか。\n乙：ええ、月に 3回ぐらい 食べます。", "にほんりょうりを たべます／つき／さんかい", 3),
          dialogueItem("l13-p1-a4-q11", "11", "ボーリングを します／週／1回", "甲：よく ボーリングを しますか。\n乙：ええ、週に 1回ぐらい します。", "ボーリングを します／しゅう／いっかい", 3),
          dialogueItem("l13-p1-a4-q12", "12", "漫画を 読みます／1日／3時間", "甲：よく 漫画を 読みますか。\n乙：ええ、1日に 3時間ぐらい 読みます。", "まんがを よみます／いちにち／さんじかん", 3)
        ]
      }
    ],
    items: []
  },
  {
    id: "l13-p1-a5",
    section: "practice_1",
    order: 5,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "そばを 食べます",
          beforeKana: "そばを たべます",
          after: [text("そばを "), repl("食べに", "purpose", { kana: "たべに" }), text(" 行きます。")],
          afterKana: "そばを たべに いきます。"
        }
      }
    ],
    items: [
      answerItem("l13-p1-a5-q1", "1", "映画を 見ます", "映画を 見に 行きます。", { promptKana: "えいがを みます" }),
      answerItem("l13-p1-a5-q2", "2", "写真を 撮ります", "写真を 撮りに 行きます。", { promptKana: "しゃしんを とります" }),
      answerItem("l13-p1-a5-q3", "3", "手紙を 出します", "手紙を 出しに 行きます。", { promptKana: "てがみを だします" }),
      answerItem("l13-p1-a5-q4", "4", "ビールを 飲みます", "ビールを 飲みに 行きます。", { promptKana: "ビールを のみます" }),
      answerItem("l13-p1-a5-q5", "5", "新聞を 買います", "新聞を 買いに 行きます。", { promptKana: "しんぶんを かいます" }),
      answerItem("l13-p1-a5-q6", "6", "髪を 切ります", "髪を 切りに 行きます。", { promptKana: "かみを きります" })
    ]
  },
  {
    id: "l13-p1-a6",
    section: "practice_1",
    order: 6,
    title: "听录音，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: "根据题目给出的“はい/いいえ”，只补全后面的回答部分。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 6),
      label: "第13课 练习I-6",
      transcript: {
        text: "よく 映画を 見ますか。はい。はい、よく 見ます。いいえ。いいえ、あまり 見ません。よく 漫画を 読みますか。はい。はい、よく 読みます。よく プールへ 行きますか。いいえ。いいえ、あまり 行きません。毎日 新聞を 読みますか。はい。はい、読みます。毎日 日本語を 勉強しますか。いいえ。いいえ、勉強しません。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按教材题面人工整理题号和标点。",
        segments: [
          { itemNumber: "例1", text: "よく 映画を 見ますか。はい。はい、よく 見ます。" },
          { itemNumber: "例2", text: "よく 映画を 見ますか。いいえ。いいえ、あまり 見ません。" },
          { itemNumber: "1", text: "よく 漫画を 読みますか。はい。はい、よく 読みます。" },
          { itemNumber: "2", text: "よく プールへ 行きますか。いいえ。いいえ、あまり 行きません。" },
          { itemNumber: "3", text: "毎日 新聞を 読みますか。はい。はい、読みます。" },
          { itemNumber: "4", text: "毎日 日本語を 勉強しますか。いいえ。いいえ、勉強しません。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "よく 映画を 見ますか。",
          beforeKana: "よく えいがを みますか。",
          after: [text("はい、よく 見ます。／いいえ、あまり 見ません。")],
          afterKana: "はい、よく みます。／いいえ、あまり みません。"
        }
      }
    ],
    items: [
      blankItem("l13-p1-a6-q1", "1", [text("はい、"), blank("answer"), text("。")], { answer: "よく 読みます" }, { answerSource: "audio", responseScope: "phrase_only" }),
      blankItem("l13-p1-a6-q2", "2", [text("いいえ、"), blank("answer"), text("。")], { answer: "あまり 行きません" }, { answerSource: "audio", responseScope: "phrase_only" }),
      blankItem("l13-p1-a6-q3", "3", [text("はい、"), blank("answer"), text("。")], { answer: "読みます" }, { answerSource: "audio", responseScope: "phrase_only" }),
      blankItem("l13-p1-a6-q4", "4", [text("いいえ、"), blank("answer"), text("。")], { answer: "勉強しません" }, { answerSource: "audio", responseScope: "phrase_only" })
    ]
  },
  {
    id: "l13-p1-a7",
    section: "practice_1",
    order: 7,
    title: "听录音，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 7),
      label: "第13课 练习I-7",
      transcript: {
        text: "1年、365日。1年は 何日ですか。365日です。1年、12か月。1年は 何か月ですか。12か月です。1週間、7日。1週間は 何日ですか。7日です。1日、24時間。1日は 何時間ですか。24時間です。1時間、60分。1時間は 何分ですか。60分です。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按教材题面人工校正数字和单位。",
        segments: [
          { itemNumber: "例", text: "1年、365日。1年は 何日ですか。365日です。" },
          { itemNumber: "1", text: "1年、12か月。1年は 何か月ですか。12か月です。" },
          { itemNumber: "2", text: "1週間、7日。1週間は 何日ですか。7日です。" },
          { itemNumber: "3", text: "1日、24時間。1日は 何時間ですか。24時間です。" },
          { itemNumber: "4", text: "1時間、60分。1時間は 何分ですか。60分です。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "1年／365日",
          beforeKana: "いちねん／さんびゃくろくじゅうごにち",
          after: [text("1年は 何日ですか。——365日です。")],
          afterKana: "いちねんは なんにちですか。——さんびゃくろくじゅうごにちです。"
        }
      }
    ],
    items: [
      answerItem("l13-p1-a7-q1", "1", "1年／12か月", "12か月です。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "いちねん／じゅうにかげつ" }),
      answerItem("l13-p1-a7-q2", "2", "1週間／7日", "7日です。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "いっしゅうかん／なのか" }),
      answerItem("l13-p1-a7-q3", "3", "1日／24時間", "24時間です。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "いちにち／にじゅうよじかん" }),
      answerItem("l13-p1-a7-q4", "4", "1時間／60分", "60分です。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "いちじかん／ろくじゅっぷん" })
    ]
  },
  {
    id: "l13-p2-a1",
    section: "practice_2",
    order: 1,
    title: "从□中选择适当的词语填入（　　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [
      {
        type: "word_bank",
        words: [text("人", { kana: "にん" }), text("冊", { kana: "さつ" }), text("枚", { kana: "まい" }), text("時間", { kana: "じかん" }), text("週間", { kana: "しゅうかん" })]
      },
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("コンサートに 300（"), blank("example"), text("）来ました。")],
          beforeKana: "コンサートに さんびゃく（______）きました。",
          after: [text("人")],
          afterKana: "にん"
        }
      }
    ],
    items: [
      blankItem("l13-p2-a1-q1", "1", [text("日曜日に 本を 2（"), blank("answer"), text("）読みました。")], { answer: "冊" }, { promptKana: "にちようびに ほんを に（______）よみました。", responseScope: "word_only" }),
      blankItem("l13-p2-a1-q2", "2", [text("李さんは 毎日 8（"), blank("answer"), text("）寝ます。")], { answer: "時間" }, { promptKana: "りさんは まいにち はち（______）ねます。", responseScope: "word_only" }),
      blankItem("l13-p2-a1-q3", "3", [text("月曜日から 金曜日まで 毎日 飲みに 行きます。1（"), blank("answer"), text("）に 5回 飲みに 行きます。")], { answer: "週間" }, { promptKana: "げつようびから きんようびまで まいにち のみに いきます。いち（______）に ごかい のみに いきます。", responseScope: "word_only" }),
      blankItem("l13-p2-a1-q4", "4", [text("80円の 切手を 買いました。4（"), blank("answer"), text("）で 320円でした。")], { answer: "枚" }, { promptKana: "はちじゅうえんの きってを かいました。よん（______）で さんびゃくにじゅうえんでした。", responseScope: "word_only" })
    ]
  },
  {
    id: "l13-p2-a2",
    section: "practice_2",
    order: 2,
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
          before: "{李さん／働きます／7時間／は／毎日}",
          beforeKana: "{りさん／はたらきます／しちじかん／は／まいにち}",
          after: [text("李さんは 毎日 7時間 働きます。")],
          afterKana: "りさんは まいにち しちじかん はたらきます。"
        }
      }
    ],
    items: [
      answerItem("l13-p2-a2-q1", "1", "{焼き鳥／いくら／で／は／か／3本／です}。", "焼き鳥は 3本で いくらですか。", { answerSource: "prompt", promptKana: "{やきとり／いくら／で／は／か／さんぼん／です}。" }),
      answerItem("l13-p2-a2-q2", "2", "{日本／富士山／写真／へ／の／を／来ました／撮りに}。", "日本へ 富士山の 写真を 撮りに 来ました。", { answerSource: "prompt", promptKana: "{にほん／ふじさん／しゃしん／へ／の／を／きました／とりに}。" }),
      answerItem("l13-p2-a2-q3", "3", "{新幹線／東京／京都／か／で／から／かかります／どのぐらい／まで}。", "東京から 京都まで 新幹線で どのぐらい かかりますか。", { answerSource: "prompt", promptKana: "{しんかんせん／とうきょう／きょうと／か／で／から／かかります／どのぐらい／まで}。" }),
      answerItem("l13-p2-a2-q4", "4", "{3つ／箱／リンゴ／あります／中／の／が／に}。", "箱の 中に リンゴが 3つ あります。", { answerSource: "prompt", promptKana: "{みっつ／はこ／リンゴ／あります／なか／の／が／に}。" })
    ]
  },
  {
    id: "l13-p2-a3",
    section: "practice_2",
    order: 3,
    title: "仿照例句，根据自己的实际情况，在（　　）中填入适当的数字并造句。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "free_text",
    responseScope: "free_response",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("1週間に（"), blank("example"), text("）回")],
          beforeKana: "いっしゅうかんに（______）かい",
          after: [text("わたしは 1週間に 1回 公園へ 行きます。")],
          afterKana: "わたしは いっしゅうかんに いっかい こうえんへ いきます。"
        }
      }
    ],
    items: [
      personalSentenceItem("l13-p2-a3-q1", "1", "1日に（　　）時間", ["わたしは 1日に 〜時間 日本語を 勉強します。"], "いちにちに（______）じかん"),
      personalSentenceItem("l13-p2-a3-q2", "2", "1週間に（　　）回", ["わたしは 1週間に 〜回 公園へ 行きます。"], "いっしゅうかんに（______）かい"),
      personalSentenceItem("l13-p2-a3-q3", "3", "1か月に（　　）回", ["わたしは 1か月に 〜回 映画を 見ます。"], "いっかげつに（______）かい")
    ]
  },
  {
    id: "l13-p2-a4",
    section: "practice_2",
    order: 4,
    title: "下面是小张上一周的日程表。边看下表边听录音，回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 4),
      label: "第13课 练习II-4",
      transcript: {
        text: "いつ 大阪へ 行きましたか。月曜日に 行きました。1週間に どのぐらい 日本語を 勉強しましたか。1週間に 何回 ジョギングを しましたか。プールへ 行きましたか。大阪で 何時間 会議を しましたか。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按教材题面整理题号；答案依据日程表计算。",
        segments: [
          { itemNumber: "例", text: "いつ 大阪へ 行きましたか。月曜日に 行きました。" },
          { itemNumber: "1", text: "1週間に どのぐらい 日本語を 勉強しましたか。" },
          { itemNumber: "2", text: "1週間に 何回 ジョギングを しましたか。" },
          { itemNumber: "3", text: "プールへ 行きましたか。" },
          { itemNumber: "4", text: "大阪で 何時間 会議を しましたか。" }
        ]
      }
    },
    assets: [
      { id: "l13-p2-a4-weekly-schedule", kind: "exercise_image", imagePath: exerciseImage("book1_lesson13_2_4.png") }
    ],
    displayAssets: ["l13-p2-a4-weekly-schedule"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "いつ 大阪へ 行きましたか。",
          beforeKana: "いつ おおさかへ いきましたか。",
          after: [text("月曜日に 行きました。")],
          afterKana: "げつようびに いきました。"
        }
      }
    ],
    items: [
      answerItem("l13-p2-a4-q1", "1", "听录音并回答。", "4時間 勉強しました。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        acceptableAlternatives: ["1週間に 4時間 勉強しました。"]
      }),
      answerItem("l13-p2-a4-q2", "2", "听录音并回答。", "3回 しました。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        acceptableAlternatives: ["1週間に 3回 ジョギングを しました。"]
      }),
      answerItem("l13-p2-a4-q3", "3", "听录音并回答。", "はい、行きました。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        acceptableAlternatives: ["はい、プールへ 行きました。"]
      }),
      answerItem("l13-p2-a4-q4", "4", "听录音并回答。", "3時間 会議を しました。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        acceptableAlternatives: ["大阪で 3時間 会議を しました。"]
      })
    ]
  },
  {
    id: "l13-p2-a5",
    section: "practice_2",
    order: 5,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l13-p2-a5-q1", "1", "小李一周去两次游泳池(游泳)。", "李さんは 1週間に 2回 プールへ 泳ぎに 行きます。", {
        answerSource: "prompt",
        acceptableAlternatives: ["李さんは 週に 2回 プールへ 泳ぎに 行きます。"]
      }),
      answerItem("l13-p2-a5-q2", "2", "3 张 150 日元。", "3枚で 150円です。", { answerSource: "prompt" }),
      answerItem("l13-p2-a5-q3", "3", "去新宿看了电影。", "新宿へ 映画を 見に 行きました。", { answerSource: "prompt" })
    ]
  }
];

export const lesson13Practice: LessonPractice = {
  lessonId: "lesson13",
  title: "第13課 机の 上に 本が 3冊 あります",
  sourcePages: [
    { pageNo: 166, imagePath: page(166) },
    { pageNo: 167, imagePath: page(167) },
    { pageNo: 168, imagePath: page(168) }
  ],
  activities
};
