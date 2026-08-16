import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson10/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit3/lesson10/Exe${exerciseNo}_${order}.mp3`;
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
const shortSlots = (slotIds: string[]): InputSlot[] => slotIds.map((slotId) => ({ id: slotId, expectedUnit: "word", width: "short", placeholder: "输入假名或词语" }));

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
  responseScope: options.responseScope || "word_only",
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

const choiceItem = (
  id: string,
  number: string,
  prompt: string,
  choices: string[],
  answerIndex: number,
  promptKana?: string
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "prompt",
  responseScope: "choice_only",
  choices: choices.map((label, index) => ({ id: `c${index + 1}`, label })),
  answer: { choiceIds: [`c${answerIndex}`] }
});

const naAdjectiveForms = (word: string) => `${word}です。\n${word}では ありません。\n${word}でした。\n${word}では ありませんでした。`;

const naAdjectiveDrillItem = (number: string, word: string, kana: string): PracticeItem => answerItem(
  `l10-p1-a1-q${number}`,
  number,
  word,
  naAdjectiveForms(word),
  {
    promptKana: kana,
    answerSource: "audio",
    responseScope: "custom",
    responseScopeHint: "按例句写出「です／ではありません／でした／ではありませんでした」四种形式。",
    multiline: true,
    rows: 4,
    placeholder: "输入四种形式"
  }
);

const nounModifierPairItem = (
  id: string,
  number: string,
  prompt: string,
  firstAnswer: string,
  secondAnswer: string,
  promptKana?: string
): PracticeItem => answerItem(
  id,
  number,
  prompt,
  `${firstAnswer}\n${secondAnswer}`,
  {
    promptKana,
    responseScope: "custom",
    responseScopeHint: "按例句写出两个句子。",
    multiline: true,
    rows: 3,
    placeholder: "输入两个句子"
  }
);

const twoSentenceItem = (
  id: string,
  number: string,
  prompt: string,
  answer: string,
  promptKana?: string,
  answerSource: PracticeItem["answerSource"] = "example_transform"
): PracticeItem => answerItem(
  id,
  number,
  prompt,
  answer,
  {
    promptKana,
    answerSource,
    responseScope: "custom",
    responseScopeHint: "写出两句完整表达。",
    multiline: true,
    rows: 3,
    placeholder: "输入两句完整表达"
  }
);

const activities: PracticeActivity[] = [
  {
    id: "l10-p1-a1",
    section: "practice_1",
    order: 1,
    title: "边看图边听录音，仿照例句反复练习。",
    instruction: "",
    interaction: "listening_repeat",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: "按例句写出「です／ではありません／でした／ではありませんでした」四种形式。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 1),
      label: "第10课 练习I-1",
      transcript: {
        text: "きれいです。きれいでは ありません。きれいでした。きれいでは ありませんでした。元気です。元気では ありません。元気でした。元気では ありませんでした。親切です。親切では ありません。親切でした。親切では ありませんでした。ハンサムです。ハンサムでは ありません。ハンサムでした。ハンサムでは ありませんでした。有名です。有名では ありません。有名でした。有名では ありませんでした。便利です。便利では ありません。便利でした。便利では ありませんでした。簡単です。簡単では ありません。簡単でした。簡単では ありませんでした。暇です。暇では ありません。暇でした。暇では ありませんでした。静かです。静かでは ありません。静かでした。静かでは ありませんでした。にぎやかです。にぎやかでは ありません。にぎやかでした。にぎやかでは ありませんでした。",
        source: "manual",
        confidenceNote: "Azure STT 分段识别后按教材图项和ナ形容词变化校正。",
        segments: [
          { itemNumber: "例", text: naAdjectiveForms("きれい") },
          { itemNumber: "1", text: naAdjectiveForms("元気") },
          { itemNumber: "2", text: naAdjectiveForms("親切") },
          { itemNumber: "3", text: naAdjectiveForms("ハンサム") },
          { itemNumber: "4", text: naAdjectiveForms("有名") },
          { itemNumber: "5", text: naAdjectiveForms("便利") },
          { itemNumber: "6", text: naAdjectiveForms("簡単") },
          { itemNumber: "7", text: naAdjectiveForms("暇") },
          { itemNumber: "8", text: naAdjectiveForms("静か") },
          { itemNumber: "9", text: naAdjectiveForms("にぎやか") }
        ]
      }
    },
    assets: [
      { id: "l10-p1-a1-na-adjective-picture-prompts", kind: "exercise_image", imagePath: exerciseImage("book1_lesson10_1_1.png") }
    ],
    displayAssets: ["l10-p1-a1-na-adjective-picture-prompts"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "きれい",
          beforeKana: "きれい",
          after: [text(naAdjectiveForms("きれい"))],
          afterKana: "きれいです。きれいでは ありません。きれいでした。きれいでは ありませんでした。"
        }
      }
    ],
    items: [
      naAdjectiveDrillItem("1", "元気", "げんき"),
      naAdjectiveDrillItem("2", "親切", "しんせつ"),
      naAdjectiveDrillItem("3", "ハンサム", "ハンサム"),
      naAdjectiveDrillItem("4", "有名", "ゆうめい"),
      naAdjectiveDrillItem("5", "便利", "べんり"),
      naAdjectiveDrillItem("6", "簡単", "かんたん"),
      naAdjectiveDrillItem("7", "暇", "ひま"),
      naAdjectiveDrillItem("8", "静か", "しずか"),
      naAdjectiveDrillItem("9", "にぎやか", "にぎやか")
    ]
  },
  {
    id: "l10-p1-a2",
    section: "practice_1",
    order: 2,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: "按例句写出两个句子。",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "森さん／元気／人",
          beforeKana: "もりさん／げんき／ひと",
          after: [text("森さんは "), repl("元気", "adjective", { kana: "げんき" }), text("です。→ 森さんは "), repl("元気な", "adjective", { kana: "げんきな" }), text(" 人です。")],
          afterKana: "もりさんは げんきです。→ もりさんは げんきな ひとです。"
        }
      }
    ],
    items: [
      nounModifierPairItem("l10-p1-a2-q1", "1", "李さん／きれい／人", "李さんは きれいです。", "李さんは きれいな 人です。", "りさん／きれい／ひと"),
      nounModifierPairItem("l10-p1-a2-q2", "2", "部長／親切／方", "部長は 親切です。", "部長は 親切な 方です。", "ぶちょう／しんせつ／かた"),
      nounModifierPairItem("l10-p1-a2-q3", "3", "ここ／にぎやか／通り", "ここは にぎやかです。", "ここは にぎやかな 通りです。", "ここ／にぎやか／とおり"),
      nounModifierPairItem("l10-p1-a2-q4", "4", "これ／簡単／試験", "これは 簡単です。", "これは 簡単な 試験です。", "これ／かんたん／しけん"),
      nounModifierPairItem("l10-p1-a2-q5", "5", "ここ／有名／所", "ここは 有名です。", "ここは 有名な 所です。", "ここ／ゆうめい／ところ"),
      nounModifierPairItem("l10-p1-a2-q6", "6", "これ／便利／道具", "これは 便利です。", "これは 便利な 道具です。", "これ／べんり／どうぐ")
    ]
  },
  {
    id: "l10-p1-a3",
    section: "practice_1",
    order: 3,
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
          before: "人形を 買いました。（きれい）",
          beforeKana: "にんぎょうを かいました。（きれい）",
          after: [repl("きれいな", "adjective"), text(" 人形を 買いました。")],
          afterKana: "きれいな にんぎょうを かいました。"
        }
      }
    ],
    items: [
      answerItem("l10-p1-a3-q1", "1", "カメラを 買います。（簡単）", "簡単な カメラを 買います。", { promptKana: "カメラを かいます。（かんたん）" }),
      answerItem("l10-p1-a3-q2", "2", "道具を もらいました。（便利）", "便利な 道具を もらいました。", { promptKana: "どうぐを もらいました。（べんり）" }),
      answerItem("l10-p1-a3-q3", "3", "レストランへ 行きました。（有名）", "有名な レストランへ 行きました。", { promptKana: "レストランへ いきました。（ゆうめい）" }),
      answerItem("l10-p1-a3-q4", "4", "音楽を 聞きます。（静か）", "静かな 音楽を 聞きます。", { promptKana: "おんがくを ききます。（しずか）" })
    ]
  },
  {
    id: "l10-p1-a4",
    section: "practice_1",
    order: 4,
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
          before: "今日は 暇ですか。（はい／いいえ）",
          beforeKana: "きょうは ひまですか。（はい／いいえ）",
          after: [text("はい、暇です。／いいえ、暇では ありません。")],
          afterKana: "はい、ひまです。／いいえ、ひまでは ありません。"
        }
      }
    ],
    items: [
      answerItem("l10-p1-a4-q1", "1", "東京は にぎやかですか。（はい）", "はい、にぎやかです。", {
        promptKana: "とうきょうは にぎやかですか。（はい）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l10-p1-a4-q2", "2", "魚は 嫌いですか。（いいえ）", "いいえ、嫌いでは ありません。", {
        promptKana: "さかなは きらいですか。（いいえ）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l10-p1-a4-q3", "3", "地下鉄は 便利ですか。（はい）", "はい、便利です。", {
        promptKana: "ちかてつは べんりですか。（はい）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l10-p1-a4-q4", "4", "この 町は 有名ですか。（いいえ）", "いいえ、有名では ありません。", {
        promptKana: "この まちは ゆうめいですか。（いいえ）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      })
    ]
  },
  {
    id: "l10-p1-a5",
    section: "practice_1",
    order: 5,
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
          before: "あの 人／人／親切",
          beforeKana: "あの ひと／ひと／しんせつ",
          after: [text("甲：あの 人は どんな 人ですか。 乙：とても 親切な 人です。")],
          afterKana: "こう：あの ひとは どんな ひとですか。 おつ：とても しんせつな ひとです。"
        }
      }
    ],
    items: [
      dialogueItem("l10-p1-a5-q1", "1", "日本／国／きれい", "甲：日本は どんな 国ですか。\n乙：とても きれいな 国です。", "にほん／くに／きれい"),
      dialogueItem("l10-p1-a5-q2", "2", "京都／町／古い", "甲：京都は どんな 町ですか。\n乙：とても 古い 町です。", "きょうと／まち／ふるい"),
      dialogueItem("l10-p1-a5-q3", "3", "これ／お菓子／甘い", "甲：これは どんな お菓子ですか。\n乙：とても 甘い お菓子です。", "これ／おかし／あまい"),
      dialogueItem("l10-p1-a5-q4", "4", "それ／料理／簡単", "甲：それは どんな 料理ですか。\n乙：とても 簡単な 料理です。", "それ／りょうり／かんたん"),
      dialogueItem("l10-p1-a5-q5", "5", "富士山／山／高い", "甲：富士山は どんな 山ですか。\n乙：とても 高い 山です。", "ふじさん／やま／たかい"),
      dialogueItem("l10-p1-a5-q6", "6", "銀座／所／にぎやか", "甲：銀座は どんな 所ですか。\n乙：とても にぎやかな 所です。", "ぎんざ／ところ／にぎやか")
    ]
  },
  {
    id: "l10-p1-a6",
    section: "practice_1",
    order: 6,
    title: "听录音，仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: "写出两句完整表达。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 6),
      label: "第10课 练习I-6",
      transcript: {
        text: "高い、安い。これは ちょっと 高いです。もう 少し 安いのは ありませんか。小さい、大きい。これは ちょっと 小さいです。もう 少し 大きいのは ありませんか。汚い、きれい。これは ちょっと 汚いです。もう 少し きれいなのは ありませんか。難しい、簡単。これは ちょっと 難しいです。もう 少し 簡単なのは ありませんか。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按教材替换词校正。",
        segments: [
          { itemNumber: "例", text: "高い、安い。これは ちょっと 高いです。もう 少し 安いのは ありませんか。" },
          { itemNumber: "1", text: "小さい、大きい。これは ちょっと 小さいです。もう 少し 大きいのは ありませんか。" },
          { itemNumber: "2", text: "汚い、きれい。これは ちょっと 汚いです。もう 少し きれいなのは ありませんか。" },
          { itemNumber: "3", text: "難しい、簡単。これは ちょっと 難しいです。もう 少し 簡単なのは ありませんか。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "高い／安い",
          beforeKana: "たかい／やすい",
          after: [text("これは ちょっと 高いです。もう 少し 安いのは ありませんか。")],
          afterKana: "これは ちょっと たかいです。もう すこし やすいのは ありませんか。"
        }
      }
    ],
    items: [
      twoSentenceItem("l10-p1-a6-q1", "1", "小さい／大きい", "これは ちょっと 小さいです。\nもう 少し 大きいのは ありませんか。", "ちいさい／おおきい", "audio"),
      twoSentenceItem("l10-p1-a6-q2", "2", "汚い／きれい", "これは ちょっと 汚いです。\nもう 少し きれいなのは ありませんか。", "きたない／きれい", "audio"),
      twoSentenceItem("l10-p1-a6-q3", "3", "難しい／簡単", "これは ちょっと 難しいです。\nもう 少し 簡単なのは ありませんか。", "むずかしい／かんたん", "audio")
    ]
  },
  {
    id: "l10-p1-a7",
    section: "practice_1",
    order: 7,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: "写出两个句子。",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "日曜日／雪",
          beforeKana: "にちようび／ゆき",
          after: [text("昨日は 日曜日でした。昨日は 雪では ありませんでした。")],
          afterKana: "きのうは にちようびでした。きのうは ゆきでは ありませんでした。"
        }
      }
    ],
    items: [
      twoSentenceItem("l10-p1-a7-q1", "1", "月曜日／晴れ", "昨日は 月曜日でした。\n昨日は 晴れでは ありませんでした。", "げつようび／はれ"),
      twoSentenceItem("l10-p1-a7-q2", "2", "金曜日／誕生日", "昨日は 金曜日でした。\n昨日は 誕生日では ありませんでした。", "きんようび／たんじょうび"),
      twoSentenceItem("l10-p1-a7-q3", "3", "水曜日／曇り", "昨日は 水曜日でした。\n昨日は 曇りでは ありませんでした。", "すいようび／くもり"),
      twoSentenceItem("l10-p1-a7-q4", "4", "土曜日／休み", "昨日は 土曜日でした。\n昨日は 休みでは ありませんでした。", "どようび／やすみ")
    ]
  },
  {
    id: "l10-p1-a8",
    section: "practice_1",
    order: 8,
    title: "仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    layout: [],
    itemGroups: [
      {
        id: "l10-p1-a8-g1",
        example: {
          id: "l10-p1-a8-ex1",
          label: "[例1]",
          before: "田中さん／人／親切／ハンサム",
          beforeKana: "たなかさん／ひと／しんせつ／ハンサム",
          after: [text("甲：田中さんは どんな 人ですか。 乙：とても 親切な 人です。そして、ハンサムです。")],
          afterKana: "こう：たなかさんは どんな ひとですか。 おつ：とても しんせつな ひとです。そして、ハンサムです。"
        },
        items: [
          dialogueItem("l10-p1-a8-q1", "1", "中国／国／広い／きれい", "甲：中国は どんな 国ですか。\n乙：とても 広い 国です。そして、きれいです。", "ちゅうごく／くに／ひろい／きれい"),
          dialogueItem("l10-p1-a8-q2", "2", "張さん／人／おもしろい／元気", "甲：張さんは どんな 人ですか。\n乙：とても おもしろい 人です。そして、元気です。", "ちょうさん／ひと／おもしろい／げんき"),
          dialogueItem("l10-p1-a8-q3", "3", "それ／料理／簡単／おいしい", "甲：それは どんな 料理ですか。\n乙：とても 簡単な 料理です。そして、おいしいです。", "それ／りょうり／かんたん／おいしい"),
          dialogueItem("l10-p1-a8-q4", "4", "富士山／山／きれい／有名", "甲：富士山は どんな 山ですか。\n乙：とても きれいな 山です。そして、有名です。", "ふじさん／やま／きれい／ゆうめい")
        ]
      },
      {
        id: "l10-p1-a8-g2",
        example: {
          id: "l10-p1-a8-ex2",
          label: "[例2]",
          before: "仕事／おもしろい／暇",
          beforeKana: "しごと／おもしろい／ひま",
          after: [text("甲：仕事は どうですか。 乙：とても おもしろいです。でも、暇では ありません。")],
          afterKana: "こう：しごとは どうですか。 おつ：とても おもしろいです。でも、ひまでは ありません。"
        },
        items: [
          dialogueItem("l10-p1-a8-q5", "5", "新しい 課長／親切／ハンサム", "甲：新しい 課長は どうですか。\n乙：とても 親切です。でも、ハンサムでは ありません。", "あたらしい かちょう／しんせつ／ハンサム"),
          dialogueItem("l10-p1-a8-q6", "6", "あなたの 故郷／きれい／有名", "甲：あなたの 故郷は どうですか。\n乙：とても きれいです。でも、有名では ありません。", "あなたの こきょう／きれい／ゆうめい"),
          dialogueItem("l10-p1-a8-q7", "7", "その パソコン／便利／簡単", "甲：その パソコンは どうですか。\n乙：とても 便利です。でも、簡単では ありません。", "その パソコン／べんり／かんたん"),
          dialogueItem("l10-p1-a8-q8", "8", "新しい 家／便利／静か", "甲：新しい 家は どうですか。\n乙：とても 便利です。でも、静かでは ありません。", "あたらしい いえ／べんり／しずか")
        ]
      },
      {
        id: "l10-p1-a8-g3",
        example: {
          id: "l10-p1-a8-ex3",
          label: "[例3]",
          before: "仕事／簡単／忙しい",
          beforeKana: "しごと／かんたん／いそがしい",
          after: [text("甲：仕事は どうでしたか。 乙：簡単でした。でも、ちょっと 忙しかったです。")],
          afterKana: "こう：しごとは どうでしたか。 おつ：かんたんでした。でも、ちょっと いそがしかったです。"
        },
        items: [
          dialogueItem("l10-p1-a8-q9", "9", "ホテル／静か／駅から 遠い", "甲：ホテルは どうでしたか。\n乙：静かでした。でも、ちょっと 駅から 遠かったです。", "ホテル／しずか／えきから とおい"),
          dialogueItem("l10-p1-a8-q10", "10", "昨日の 天気／いい／寒い", "甲：昨日の 天気は どうでしたか。\n乙：よかったです。でも、ちょっと 寒かったです。", "きのうの てんき／いい／さむい"),
          dialogueItem("l10-p1-a8-q11", "11", "あの お店の 料理／おいしい／高い", "甲：あの お店の 料理は どうでしたか。\n乙：おいしかったです。でも、ちょっと 高かったです。", "あの おみせの りょうり／おいしい／たかい"),
          dialogueItem("l10-p1-a8-q12", "12", "日本の 生活／便利／忙しい", "甲：日本の 生活は どうでしたか。\n乙：便利でした。でも、ちょっと 忙しかったです。", "にほんの せいかつ／べんり／いそがしい")
        ]
      }
    ],
    items: []
  },
  {
    id: "l10-p2-a1",
    section: "practice_2",
    order: 1,
    title: "在（　　）中填入一个平假名。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("昨日 李さん（"), blank("example"), text("）会いました。")],
          beforeKana: "きのう りさん（に）あいました。",
          after: [text("に")]
        }
      }
    ],
    items: [
      blankItem("l10-p2-a1-q1", "1", [text("富士山は きれい（"), blank("answer"), text("）山です。")], { answer: "な" }, { promptKana: "ふじさんは きれい（  ）やまです。" }),
      blankItem("l10-p2-a1-q2", "2", [text("公園は あまり 静かで（"), blank("answer"), text("）ありませんでした。")], { answer: "は" }, { promptKana: "こうえんは あまり しずかで（  ）ありませんでした。" }),
      slotItem("l10-p2-a1-q3", "3", [text("万里の 長城は 北京（"), blank("first"), text("）（"), blank("second"), text("）遠いですか。")], [
        { id: "first", expectedUnit: "word", width: "short", placeholder: "假名" },
        { id: "second", expectedUnit: "word", width: "short", placeholder: "假名" }
      ], { first: "か", second: "ら" }, { promptKana: "ばんりの ちょうじょうは ペキン（  ）（  ）とおいですか。", responseScope: "word_only" }),
      blankItem("l10-p2-a1-q4", "4", [text("北京の 天気（"), blank("answer"), text("）どうでしたか。")], { answer: "は" }, { promptKana: "ペキンの てんき（  ）どうでしたか。" }),
      blankItem("l10-p2-a1-q5", "5", [text("この ノート（"), blank("answer"), text("）鉛筆を ください。")], { answer: "と" }, { promptKana: "この ノート（  ）えんぴつを ください。" }),
      slotItem("l10-p2-a1-q6", "6", [text("李さん、だれ（"), blank("person"), text("）その 花（"), blank("object"), text("）もらいましたか。")], [
        { id: "person", expectedUnit: "word", width: "short", placeholder: "假名" },
        { id: "object", expectedUnit: "word", width: "short", placeholder: "假名" }
      ], { person: "に", object: "を" }, { promptKana: "りさん、だれ（  ）その はな（  ）もらいましたか。", responseScope: "word_only" })
    ]
  },
  {
    id: "l10-p2-a2",
    section: "practice_2",
    order: 2,
    title: "选择正确回答，在（　　）中画○。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    layout: [],
    items: [
      choiceItem("l10-p2-a2-q1", "1", "どんな 傘を 買いましたか。", [
        "①はい、傘を 買いました。",
        "②きれいな 傘を 買いました。",
        "③はい、きれいの 傘です。"
      ], 2, "どんな かさを かいましたか。"),
      choiceItem("l10-p2-a2-q2", "2", "京都の 紅葉は 有名ですか。", [
        "①はい、有名です。",
        "②いいえ、有名です。",
        "③はい、有名なです。"
      ], 1, "きょうとの もみじは ゆうめいですか。"),
      choiceItem("l10-p2-a2-q3", "3", "旅行は どうでしたか。", [
        "①はい、楽しかったです。",
        "②いいえ、楽しく なかったです。でも、よかったです。",
        "③天気は よく なかったです。でも、楽しかったです。"
      ], 3, "りょこうは どうでしたか。")
    ]
  },
  {
    id: "l10-p2-a3",
    section: "practice_2",
    order: 3,
    title: "听录音，用“でも”或“そして”回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "第10课 练习II-3",
      transcript: {
        text: "日本の 食べ物は どうですか。おいしい。高い。とても おいしいです。でも、高いです。北京は どんな 町ですか。大きい。にぎやか。富士山は どんな 山ですか。高い。きれい。昨日の 天気は どうでしたか。いい。寒い。あの 料理は どうですか。おいしい。辛い。あなたの お父さんは どんな 人ですか。ハンサム。おもしろい。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按教材提示词校正。",
        segments: [
          { itemNumber: "例", text: "日本の 食べ物は どうですか。おいしい。高い。とても おいしいです。でも、高いです。" },
          { itemNumber: "1", text: "北京は どんな 町ですか。大きい。にぎやか。" },
          { itemNumber: "2", text: "富士山は どんな 山ですか。高い。きれい。" },
          { itemNumber: "3", text: "昨日の 天気は どうでしたか。いい。寒い。" },
          { itemNumber: "4", text: "あの 料理は どうですか。おいしい。辛い。" },
          { itemNumber: "5", text: "あなたの お父さんは どんな 人ですか。ハンサム。おもしろい。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "日本の 食べ物は どうですか。（おいしい／高い）",
          beforeKana: "にほんの たべものは どうですか。（おいしい／たかい）",
          after: [text("とても おいしいです。でも、高いです。")],
          afterKana: "とても おいしいです。でも、たかいです。"
        }
      }
    ],
    items: [
      answerItem("l10-p2-a3-q1", "1", "大きい／にぎやか", "とても 大きいです。そして、にぎやかです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "おおきい／にぎやか"
      }),
      answerItem("l10-p2-a3-q2", "2", "高い／きれい", "とても 高いです。そして、きれいです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "たかい／きれい"
      }),
      answerItem("l10-p2-a3-q3", "3", "いい／寒い", "とても よかったです。でも、寒かったです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "いい／さむい",
        evaluationMode: "acceptable_answers",
        acceptableAlternatives: ["よかったです。でも、寒かったです。"]
      }),
      answerItem("l10-p2-a3-q4", "4", "おいしい／辛い", "とても おいしいです。でも、辛いです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "おいしい／からい"
      }),
      answerItem("l10-p2-a3-q5", "5", "ハンサム／おもしろい", "とても ハンサムです。そして、おもしろいです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "ハンサム／おもしろい"
      })
    ]
  },
  {
    id: "l10-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l10-p2-a4-q1", "1", "京都的红叶很有名。", "京都の 紅葉は 有名です。", { answerSource: "prompt" }),
      answerItem("l10-p2-a4-q2", "2", "横滨是(个)什么样的城市？——是一个很大的城市，而且很热闹。", "横浜は どんな 町ですか。\nとても 大きい 町です。そして、にぎやかです。", {
        answerSource: "prompt",
        responseScope: "custom",
        responseScopeHint: "写出完整问答。",
        multiline: true,
        rows: 3
      }),
      answerItem("l10-p2-a4-q3", "3", "京都很美。不过，不太安静。", "京都は きれいです。でも、あまり 静かでは ありません。", { answerSource: "prompt" })
    ]
  }
];

export const lesson10Practice: LessonPractice = {
  lessonId: "lesson10",
  title: "第10課 京都の 紅葉は 有名です",
  sourcePages: [
    { pageNo: 130, imagePath: page(130) },
    { pageNo: 131, imagePath: page(131) },
    { pageNo: 132, imagePath: page(132) }
  ],
  activities
};
