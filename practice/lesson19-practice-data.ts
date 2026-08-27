import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson19/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit5/lesson19/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const completionHint = "只补全题目中空格处需要填写的部分。";
const sentenceSlot = (placeholder = "输入完整回答"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const multilineSentenceSlot = (placeholder = "输入完整回答", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "sentence", width: "long", multiline: true, rows, placeholder }
];
const dialogueSlot = (placeholder = "输入完整问答", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows, placeholder }
];
const shortSlots = (slotIds: string[], expectedUnit: InputSlot["expectedUnit"] = "phrase"): InputSlot[] =>
  slotIds.map((slotId) => ({ id: slotId, expectedUnit, width: expectedUnit === "number" || expectedUnit === "particle" ? "short" : "medium", placeholder: "输入词语" }));

const verbFormItem = (id: string, number: string, prompt: string, answer: string, promptKana?: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt), text(" → "), blank("answer")],
  promptKana,
  instruction: "",
  answerSource: "audio",
  responseScope: "word_only",
  responseScopeHint: completionHint,
  inputSlots: shortSlots(["answer"], "conjugated_form"),
  answer: { slotValues: { answer } }
});

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
    acceptableAlternatives?: string[];
    multiline?: boolean;
    rows?: number;
  } = {}
): PracticeItem => ({
  id,
  number,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "example_transform",
  responseScope: options.responseScope || "sentence_only",
  responseScopeHint: options.responseScopeHint,
  inputSlots: options.multiline ? multilineSentenceSlot("输入完整回答", options.rows || 3) : sentenceSlot("输入完整回答"),
  answer: { slotValues: { answer }, acceptableAlternatives: options.acceptableAlternatives }
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
    expectedUnit?: InputSlot["expectedUnit"];
  } = {}
): PracticeItem => ({
  id,
  number,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "prompt",
  responseScope: options.responseScope || "phrase_only",
  responseScopeHint: options.responseScopeHint || completionHint,
  inputSlots: shortSlots(Object.keys(answers), options.expectedUnit),
  answer: { slotValues: answers }
});

const dialogueItem = (
  id: string,
  number: string,
  prompt: string,
  answer: string,
  options: {
    promptKana?: string;
    answerSource?: PracticeItem["answerSource"];
    responseScopeHint?: string;
    rows?: number;
  } = {}
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "example_transform",
  responseScope: "question_and_answer",
  responseScopeHint: options.responseScopeHint || "写出完整问答。",
  inputSlots: dialogueSlot("输入完整问答", options.rows || 4),
  answer: { slotValues: { answer } },
  renderHint: "dialogue"
});

const trueFalseItem = (id: string, number: string, prompt: string, value: boolean, promptKana?: string, answerSource: PracticeItem["answerSource"] = "prompt"): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource,
  responseScope: "boolean_only",
  choices: [
    { id: "true", label: "○" },
    { id: "false", label: "×" }
  ],
  answer: { boolean: value, choiceIds: [value ? "true" : "false"] }
});

const activities: PracticeActivity[] = [
  {
    id: "l19-p1-a1",
    section: "practice_1",
    order: 1,
    title: "听录音，将“ます形”变为“ない形”。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 1),
      label: "第19课 练习I-1",
      transcript: {
        text: "行きます、行かない。泳ぎます、泳がない。読みます、読まない。呼びます、呼ばない。帰ります、帰らない。買います、買わない。待ちます、待たない。貸します、貸さない。食べます、食べない。見ます、見ない。起きます、起きない。います、いない。結婚します、結婚しない。来ます、来ない。",
        source: "manual",
        confidenceNote: "按教材表格顺序整理。"
      }
    },
    assets: [
      { id: "l19-p1-a1-masu-nai-table", kind: "exercise_image", imagePath: exerciseImage("book1_lesson19_1_1.png") }
    ],
    displayAssets: ["l19-p1-a1-masu-nai-table"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "行きます",
          beforeKana: "いきます",
          after: [text("行かない")],
          afterKana: "いかない"
        }
      }
    ],
    items: [
      verbFormItem("l19-p1-a1-q1", "1", "行きます", "行かない", "いきます"),
      verbFormItem("l19-p1-a1-q2", "2", "泳ぎます", "泳がない", "およぎます"),
      verbFormItem("l19-p1-a1-q3", "3", "読みます", "読まない", "よみます"),
      verbFormItem("l19-p1-a1-q4", "4", "呼びます", "呼ばない", "よびます"),
      verbFormItem("l19-p1-a1-q5", "5", "帰ります", "帰らない", "かえります"),
      verbFormItem("l19-p1-a1-q6", "6", "買います", "買わない", "かいます"),
      verbFormItem("l19-p1-a1-q7", "7", "待ちます", "待たない", "まちます"),
      verbFormItem("l19-p1-a1-q8", "8", "貸します", "貸さない", "かします"),
      verbFormItem("l19-p1-a1-q9", "9", "食べます", "食べない", "たべます"),
      verbFormItem("l19-p1-a1-q10", "10", "見ます", "見ない", "みます"),
      verbFormItem("l19-p1-a1-q11", "11", "起きます", "起きない", "おきます"),
      verbFormItem("l19-p1-a1-q12", "12", "います", "いない", "います"),
      verbFormItem("l19-p1-a1-q13", "13", "結婚します", "結婚しない", "けっこんします"),
      verbFormItem("l19-p1-a1-q14", "14", "来ます", "来ない", "きます")
    ]
  },
  {
    id: "l19-p1-a2",
    section: "practice_1",
    order: 2,
    title: "看图，仿照例句进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "この いすに 座ります",
          beforeKana: "この いすに すわります",
          after: [text("この いすに 座らないで ください。")],
          afterKana: "この いすに すわらないで ください。"
        }
      }
    ],
    items: [
      answerItem("l19-p1-a2-q1", "1", "ここで 写真を 撮ります", "ここで 写真を 撮らないで ください。", { promptKana: "ここで しゃしんを とります" }),
      answerItem("l19-p1-a2-q2", "2", "駅で タバコを 吸います", "駅で タバコを 吸わないで ください。", { promptKana: "えきで タバコを すいます" }),
      answerItem("l19-p1-a2-q3", "3", "この 部屋に 入ります", "この 部屋に 入らないで ください。", { promptKana: "この へやに はいります" }),
      answerItem("l19-p1-a2-q4", "4", "ここに 車を 止めます", "ここに 車を 止めないで ください。", { promptKana: "ここに くるまを とめます" })
    ]
  },
  {
    id: "l19-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    responseScopeHint: "写出完整句子。",
    assets: [],
    layout: [],
    itemGroups: [
      {
        id: "l19-p1-a3-g1",
        title: "[例1]",
        example: {
          label: "[例1]",
          before: "今日 早く 帰ります",
          beforeKana: "きょう はやく かえります",
          after: [text("今日 早く 帰らなければ なりません。")],
          afterKana: "きょう はやく かえらなければ なりません。"
        },
        items: [
          answerItem("l19-p1-a3-q1", "1", "中国へ 電話を かけます", "中国へ 電話を かけなければ なりません。", { promptKana: "ちゅうごくへ でんわを かけます" }),
          answerItem("l19-p1-a3-q2", "2", "図書館の 本を 返します", "図書館の 本を 返さなければ なりません。", { promptKana: "としょかんの ほんを かえします" }),
          answerItem("l19-p1-a3-q3", "3", "部屋を きれいに します", "部屋を きれいに しなければ なりません。", { promptKana: "へやを きれいに します" }),
          answerItem("l19-p1-a3-q4", "4", "パスポートを 見せます", "パスポートを 見せなければ なりません。", { promptKana: "パスポートを みせます" }),
          answerItem("l19-p1-a3-q5", "5", "会社を 大きく します", "会社を 大きく しなければ なりません。", { promptKana: "かいしゃを おおきく します" }),
          answerItem("l19-p1-a3-q6", "6", "1日に 3回 薬を 飲みます", "1日に 3回 薬を 飲まなければ なりません。", { promptKana: "いちにちに さんかい くすりを のみます" })
        ]
      },
      {
        id: "l19-p1-a3-g2",
        title: "[例2]",
        example: {
          label: "[例2]",
          before: "レポートを 書きます",
          beforeKana: "レポートを かきます",
          after: [text("レポートを 書かなくても いいです。")],
          afterKana: "レポートを かかなくても いいです。"
        },
        items: [
          answerItem("l19-p1-a3-q7", "7", "お皿を 洗います", "お皿を 洗わなくても いいです。", { promptKana: "おさらを あらいます" }),
          answerItem("l19-p1-a3-q8", "8", "仕事を 手伝います", "仕事を 手伝わなくても いいです。", { promptKana: "しごとを てつだいます" }),
          answerItem("l19-p1-a3-q9", "9", "テレビを 消します", "テレビを 消さなくても いいです。", { promptKana: "テレビを けします" }),
          answerItem("l19-p1-a3-q10", "10", "荷物を 運びます", "荷物を 運ばなくても いいです。", { promptKana: "にもつを はこびます" }),
          answerItem("l19-p1-a3-q11", "11", "名前を 書きます", "名前を 書かなくても いいです。", { promptKana: "なまえを かきます" }),
          answerItem("l19-p1-a3-q12", "12", "急ぎます", "急がなくても いいです。", { promptKana: "いそぎます" })
        ]
      },
      {
        id: "l19-p1-a3-g3",
        title: "[例3]",
        example: {
          label: "[例3]",
          before: "その 品物に 触ります",
          beforeKana: "その しなものに さわります",
          after: [text("その 品物に 触らないで ください。")],
          afterKana: "その しなものに さわらないで ください。"
        },
        items: [
          answerItem("l19-p1-a3-q13", "13", "パスポートを なくします", "パスポートを なくさないで ください。"),
          answerItem("l19-p1-a3-q14", "14", "そこに ごみを 捨てます", "そこに ごみを 捨てないで ください。", { promptKana: "そこに ごみを すてます" }),
          answerItem("l19-p1-a3-q15", "15", "お金を 落とします", "お金を 落とさないで ください。", { promptKana: "おかねを おとします" }),
          answerItem("l19-p1-a3-q16", "16", "窓を 開けます", "窓を 開けないで ください。", { promptKana: "まどを あけます" }),
          answerItem("l19-p1-a3-q17", "17", "その 書類を 見ます", "その 書類を 見ないで ください。", { promptKana: "その しょるいを みます" }),
          answerItem("l19-p1-a3-q18", "18", "机の 上に 荷物を 置きます", "机の 上に 荷物を 置かないで ください。", { promptKana: "つくえの うえに にもつを おきます" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l19-p1-a4",
    section: "practice_1",
    order: 4,
    title: "听录音，仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 4), label: "第19课 练习I-4" },
    assets: [],
    layout: [],
    itemGroups: [
      {
        id: "l19-p1-a4-g1",
        title: "[例1]",
        example: {
          label: "[例1]",
          before: "帰ります",
          beforeKana: "かえります",
          after: [text("甲：もう 帰っても いいですか。\n乙：いいえ、まだ 帰らないで ください。")],
          afterKana: "もう かえっても いいですか。\nいいえ、まだ かえらないで ください。"
        },
        items: [
          dialogueItem("l19-p1-a4-q1", "1", "食べます", "甲：もう 食べても いいですか。\n乙：いいえ、まだ 食べないで ください。", { promptKana: "たべます", answerSource: "audio" }),
          dialogueItem("l19-p1-a4-q2", "2", "飲みます", "甲：もう 飲んでも いいですか。\n乙：いいえ、まだ 飲まないで ください。", { promptKana: "のみます", answerSource: "audio" }),
          dialogueItem("l19-p1-a4-q3", "3", "歩きます", "甲：もう 歩いても いいですか。\n乙：いいえ、まだ 歩かないで ください。", { promptKana: "あるきます", answerSource: "audio" }),
          dialogueItem("l19-p1-a4-q4", "4", "見ます", "甲：もう 見ても いいですか。\n乙：いいえ、まだ 見ないで ください。", { promptKana: "みます", answerSource: "audio" }),
          dialogueItem("l19-p1-a4-q5", "5", "話します", "甲：もう 話しても いいですか。\n乙：いいえ、まだ 話さないで ください。", { promptKana: "はなします", answerSource: "audio" })
        ]
      },
      {
        id: "l19-p1-a4-g2",
        title: "[例2]",
        example: {
          label: "[例2]",
          before: "薬を 飲みます",
          beforeKana: "くすりを のみます",
          after: [text("甲：もう 薬を 飲まなくても いいですか。\n乙：いいえ、まだ 飲まないと いけません。")],
          afterKana: "もう くすりを のまなくても いいですか。\nいいえ、まだ のまないと いけません。"
        },
        items: [
          dialogueItem("l19-p1-a4-q6", "6", "練習します", "甲：もう 練習しなくても いいですか。\n乙：いいえ、まだ 練習しないと いけません。", { promptKana: "れんしゅうします", answerSource: "audio" }),
          dialogueItem("l19-p1-a4-q7", "7", "来ます", "甲：もう 来なくても いいですか。\n乙：いいえ、まだ 来ないと いけません。", { promptKana: "きます", answerSource: "audio" }),
          dialogueItem("l19-p1-a4-q8", "8", "病院へ 行きます", "甲：もう 病院へ 行かなくても いいですか。\n乙：いいえ、まだ 行かないと いけません。", { promptKana: "びょういんへ いきます", answerSource: "audio" }),
          dialogueItem("l19-p1-a4-q9", "9", "ここに います", "甲：もう ここに いなくても いいですか。\n乙：いいえ、まだ いないと いけません。", { answerSource: "audio" }),
          dialogueItem("l19-p1-a4-q10", "10", "毎日 レポートを 書きます", "甲：もう 毎日 レポートを 書かなくても いいですか。\n乙：いいえ、まだ 書かないと いけません。", { promptKana: "まいにち レポートを かきます", answerSource: "audio" })
        ]
      },
      {
        id: "l19-p1-a4-g3",
        title: "[例3]",
        example: {
          label: "[例3]",
          before: "今 お金を 払います",
          beforeKana: "いま おかねを はらいます",
          after: [text("甲：今 お金を 払わなければ なりませんか。\n乙：いいえ、払わなくても いいですよ。")],
          afterKana: "いま おかねを はらわなければ なりませんか。\nいいえ、はらわなくても いいですよ。"
        },
        items: [
          dialogueItem("l19-p1-a4-q11", "11", "今日 残業します", "甲：今日 残業しなければ なりませんか。\n乙：いいえ、残業しなくても いいですよ。", { promptKana: "きょう ざんぎょうします", answerSource: "audio" }),
          dialogueItem("l19-p1-a4-q12", "12", "歌を 歌います", "甲：歌を 歌わなければ なりませんか。\n乙：いいえ、歌わなくても いいですよ。", { promptKana: "うたを うたいます", answerSource: "audio" }),
          dialogueItem("l19-p1-a4-q13", "13", "靴を 脱ぎます", "甲：靴を 脱がなければ なりませんか。\n乙：いいえ、脱がなくても いいですよ。", { promptKana: "くつを ぬぎます", answerSource: "audio" }),
          dialogueItem("l19-p1-a4-q14", "14", "部長を 待ちます", "甲：部長を 待たなければ なりませんか。\n乙：いいえ、待たなくても いいですよ。", { promptKana: "ぶちょうを まちます", answerSource: "audio" }),
          dialogueItem("l19-p1-a4-q15", "15", "明日 学校に 来ます", "甲：明日 学校に 来なければ なりませんか。\n乙：いいえ、来なくても いいですよ。", { promptKana: "あした がっこうに きます", answerSource: "audio" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l19-p1-a5",
    section: "practice_1",
    order: 5,
    title: "听录音，仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 5), label: "第19课 练习I-5" },
    assets: [],
    layout: [],
    itemGroups: [
      {
        id: "l19-p1-a5-g1",
        title: "[例1]",
        example: {
          label: "[例1]",
          before: "ここで 走ります",
          beforeKana: "ここで はしります",
          after: [text("甲：あのう、ちょっと…。\n乙：何ですか。\n甲：すみませんが、ここで 走らないで ください。\n乙：はい。")],
          afterKana: "あのう、ちょっと…。\nなんですか。\nすみませんが、ここで はしらないで ください。\nはい。"
        },
        items: [
          dialogueItem("l19-p1-a5-q1", "1", "そこに 立ちます", "甲：あのう、ちょっと…。\n乙：何ですか。\n甲：すみませんが、そこに 立たないで ください。\n乙：はい。", { promptKana: "そこに たちます", answerSource: "audio" }),
          dialogueItem("l19-p1-a5-q2", "2", "その パソコンを 使います", "甲：あのう、ちょっと…。\n乙：何ですか。\n甲：すみませんが、その パソコンを 使わないで ください。\n乙：はい。", { promptKana: "その パソコンを つかいます", answerSource: "audio" }),
          dialogueItem("l19-p1-a5-q3", "3", "大きい 声で 話します", "甲：あのう、ちょっと…。\n乙：何ですか。\n甲：すみませんが、大きい 声で 話さないで ください。\n乙：はい。", { promptKana: "おおきい こえで はなします", answerSource: "audio" })
        ]
      },
      {
        id: "l19-p1-a5-g2",
        title: "[例2]",
        example: {
          label: "[例2]",
          before: "食事／レポートを 書きます",
          beforeKana: "しょくじ／レポートを かきます",
          after: [text("甲：いっしょに 食事に 行きませんか。\n乙：すみません。今日は ちょっと…。レポートを 書かなければ なりません。\n甲：そうですか。じゃあ、また 今度。")],
          afterKana: "いっしょに しょくじに いきませんか。\nすみません。きょうは ちょっと…。レポートを かかなければ なりません。\nそうですか。じゃあ、また こんど。"
        },
        items: [
          dialogueItem("l19-p1-a5-q4", "4", "映画／病院へ 行きます", "甲：いっしょに 映画を 見に 行きませんか。\n乙：すみません。今日は ちょっと…。病院へ 行かなければ なりません。\n甲：そうですか。じゃあ、また 今度。", { promptKana: "えいが／びょういんへ いきます", answerSource: "audio" }),
          dialogueItem("l19-p1-a5-q5", "5", "コンサート／残業します", "甲：いっしょに コンサートへ 行きませんか。\n乙：すみません。今日は ちょっと…。残業しなければ なりません。\n甲：そうですか。じゃあ、また 今度。", { promptKana: "コンサート／ざんぎょうします", answerSource: "audio" }),
          dialogueItem("l19-p1-a5-q6", "6", "カラオケ／明日 試験が ありますから、今晩 勉強します", "甲：いっしょに カラオケへ 行きませんか。\n乙：すみません。明日 試験が ありますから、今晩 勉強しなければ なりません。\n甲：そうですか。じゃあ、また 今度。", { promptKana: "カラオケ／あした しけんが ありますから、こんばん べんきょうします", answerSource: "audio" })
        ]
      },
      {
        id: "l19-p1-a5-g3",
        title: "[例3]",
        example: {
          label: "[例3]",
          before: "吉田さん／男の 人",
          beforeKana: "よしださん／おとこの ひと",
          after: [text("甲：あのう、吉田さんは どの 人ですか。\n乙：あの 男の 人が 吉田さんです。")],
          afterKana: "あのう、よしださんは どの ひとですか。\nあの おとこの ひとが よしださんです。"
        },
        items: [
          dialogueItem("l19-p1-a5-q7", "7", "スミスさん／若い 男の 人", "甲：あのう、スミスさんは どの 人ですか。\n乙：あの 若い 男の 人が スミスさんです。", { promptKana: "スミスさん／わかい おとこの ひと", answerSource: "audio" }),
          dialogueItem("l19-p1-a5-q8", "8", "李さん／女の 人", "甲：あのう、李さんは どの 人ですか。\n乙：あの 女の 人が 李さんです。", { promptKana: "りさん／おんなの ひと", answerSource: "audio" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l19-p2-a1",
    section: "practice_2",
    order: 1,
    title: "下面是小野某个星期的日程表。（1）～（4）句与日程表一致的在（　）中画○，不一致的画×。",
    instruction: "",
    interaction: "true_false",
    answerUnit: "boolean",
    responseScope: "boolean_only",
    assets: [
      { id: "l19-p2-a1-schedule", kind: "exercise_image", imagePath: exerciseImage("book1_lesson19_2_1.png") }
    ],
    displayAssets: ["l19-p2-a1-schedule"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "小野さんは 月曜日に 会社へ 行かなくても いいです。",
          beforeKana: "おのさんは げつようびに かいしゃへ いかなくても いいです。",
          after: [text("×")]
        }
      }
    ],
    items: [
      trueFalseItem("l19-p2-a1-q1", "1", "小野さんは 日曜日に 会社へ 行かなければ なりません。", false, "おのさんは にちようびに かいしゃへ いかなければ なりません。"),
      trueFalseItem("l19-p2-a1-q2", "2", "小野さんは 水曜日に 大阪へ 出張しなければ なりません。", true, "おのさんは すいようびに おおさかへ しゅっちょうしなければ なりません。"),
      trueFalseItem("l19-p2-a1-q3", "3", "木曜日は 会社へ 行かなくても いいです。", true, "もくようびは かいしゃへ いかなくても いいです。"),
      trueFalseItem("l19-p2-a1-q4", "4", "今週は 残業しなくても いいです。", false, "こんしゅうは ざんぎょうしなくても いいです。")
    ]
  },
  {
    id: "l19-p2-a2",
    section: "practice_2",
    order: 2,
    title: "从□中选择适当的词语填入（　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    assets: [
      { id: "l19-p2-a2-word-bank", kind: "exercise_image", imagePath: exerciseImage("book1_lesson19_2_2.png") }
    ],
    displayAssets: ["l19-p2-a2-word-bank"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("よく 分かりません。（"), blank("example"), text("）言って ください。")],
          beforeKana: "よく わかりません。（______）いって ください。",
          after: [text("もう 一度")],
          afterKana: "もう いちど"
        }
      }
    ],
    items: [
      blankItem(
        "l19-p2-a2-q1",
        "1",
        [text("その 靴は（"), blank("shoe"), text("）小さいです。この スカートは（"), blank("skirt"), text("）いいです。")],
        { shoe: "ちょっと", skirt: "ちょうど" },
        { promptKana: "その くつは（______）ちいさいです。この スカートは（______）いいです。", expectedUnit: "word" }
      ),
      blankItem("l19-p2-a2-q2", "2", [text("森さん、パスポートは ありますか。——はい、心配しないで ください。（"), blank("answer"), text("）持って いますよ。")], { answer: "ちゃんと" }, { promptKana: "もりさん、パスポートは ありますか。——はい、しんぱいしないで ください。（______）もって いますよ。", expectedUnit: "word" }),
      blankItem("l19-p2-a2-q3", "3", [text("生ビールは いくらぐらいですか。——そうですね。（"), blank("answer"), text("）1杯 400円ぐらいです。")], { answer: "だいたい" }, { promptKana: "なまビールは いくらぐらいですか。——そうですね。（______）いっぱい よんひゃくえんぐらいです。", expectedUnit: "word" })
    ]
  },
  {
    id: "l19-p2-a3",
    section: "practice_2",
    order: 3,
    title: "听录音，在（　）中填入适当的词语。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: "按题中括号位置补全词语或句子。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "第19课 练习II-3",
      transcript: {
        text: "寒いですから、窓を 開けないで ください。まだ 熱が ありますから、お風呂に 入らないで ください。これは 図書館の 本ですから、返さなければ なりません。中国の 陳さんに 書類を 送らなければ なりませんが、住所が 分かりません。駐車禁止ですから、ここに 車を 止めないで ください。薬を 飲まなくても いいです。もう 元気に なりましたから。",
        source: "manual",
        confidenceNote: "按题面空格和第19课句型整理。"
      }
    },
    assets: [],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("寒いですから、（"), blank("example"), text("）。")],
          beforeKana: "さむいですから、（______）。",
          after: [text("窓を 開けないで ください")],
          afterKana: "まどを あけないで ください"
        }
      }
    ],
    items: [
      blankItem("l19-p2-a3-q1", "1", [text("まだ 熱が ありますから、（"), blank("answer"), text("）。")], { answer: "お風呂に 入らないで ください" }, { answerSource: "audio", promptKana: "まだ ねつが ありますから、（______）。", responseScope: "sentence_only", expectedUnit: "sentence" }),
      blankItem("l19-p2-a3-q2", "2", [text("これは 図書館の 本ですから、（"), blank("answer"), text("）。")], { answer: "返さなければ なりません" }, { answerSource: "audio", promptKana: "これは としょかんの ほんですから、（______）。", responseScope: "sentence_only", expectedUnit: "sentence" }),
      blankItem("l19-p2-a3-q3", "3", [text("中国の 陳さんに 書類を（"), blank("answer"), text("）が、住所が 分かりません。")], { answer: "送らなければ なりません" }, { answerSource: "audio", promptKana: "ちゅうごくの ちんさんに しょるいを（______）が、じゅうしょが わかりません。", responseScope: "phrase_only" }),
      blankItem("l19-p2-a3-q4", "4", [text("駐車禁止ですから、ここに（"), blank("answer"), text("）。")], { answer: "車を 止めないで ください" }, { answerSource: "audio", promptKana: "ちゅうしゃきんしですから、ここに（______）。", responseScope: "sentence_only", expectedUnit: "sentence" }),
      blankItem("l19-p2-a3-q5", "5", [text("（"), blank("answer"), text("）。もう 元気に なりましたから。")], { answer: "薬を 飲まなくても いいです" }, { answerSource: "audio", promptKana: "（______）。もう げんきに なりましたから。", responseScope: "sentence_only", expectedUnit: "sentence" })
    ]
  },
  {
    id: "l19-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [],
    layout: [],
    items: [
      answerItem("l19-p2-a4-q1", "1", "请别忘了房间钥匙。", "部屋の かぎを 忘れないで ください。", {
        answerSource: "prompt",
        acceptableAlternatives: ["部屋のかぎを 忘れないでください。", "部屋の かぎを忘れないでください。"]
      }),
      answerItem("l19-p2-a4-q2", "2", "小李今天必须早点儿回家。", "李さんは 今日 早く 帰らなければ なりません。", {
        answerSource: "prompt",
        acceptableAlternatives: ["李さんは今日 早く 帰らなければなりません。", "李さんは 今日 早く帰らなければなりません。"]
      }),
      answerItem("l19-p2-a4-q3", "3", "大夫，（我）可以不吃药了吗？——嗯，可以了。", "先生、もう 薬を 飲まなくても いいですか。\nはい、いいですよ。", {
        answerSource: "prompt",
        multiline: true,
        rows: 3,
        acceptableAlternatives: ["先生、もう 薬を 飲まなくても いいですか。\nはい、いいです。"]
      })
    ]
  }
];

export const lesson19Practice: LessonPractice = {
  lessonId: "lesson19",
  title: "第19課 部屋の かぎを 忘れないで ください",
  sourcePages: [
    { pageNo: 232, imagePath: page(232) },
    { pageNo: 233, imagePath: page(233) },
    { pageNo: 234, imagePath: page(234) }
  ],
  activities
};
