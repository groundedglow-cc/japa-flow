import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson25/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit7/lesson25/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const completionHint = "只补全题目中空格处需要填写的部分。";
const sentenceSlot = (placeholder = "输入完整句子"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const phraseSlot = (placeholder = "输入词语"): InputSlot[] => [{ id: "answer", expectedUnit: "phrase", width: "long", placeholder }];
const dialogueSlot = (placeholder = "输入完整对话", rows = 6): InputSlot[] => [
  { id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows, placeholder }
];
const slots = (slotIds: string[], expectedUnit: InputSlot["expectedUnit"] = "phrase"): InputSlot[] =>
  slotIds.map((slotId) => ({ id: slotId, expectedUnit, width: "medium", placeholder: "输入词语" }));

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
  inputSlots: options.multiline ? dialogueSlot("输入完整对话", options.rows || 6) : sentenceSlot("输入完整句子"),
  answer: { slotValues: { answer }, acceptableAlternatives: options.acceptableAlternatives }
});

const blankItem = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  answers: Record<string, string>,
  options: { promptKana?: string; answerSource?: PracticeItem["answerSource"]; responseScopeHint?: string; expectedUnit?: InputSlot["expectedUnit"] } = {}
): PracticeItem => ({
  id,
  number,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "prompt",
  responseScope: "phrase_only",
  responseScopeHint: options.responseScopeHint || completionHint,
  inputSlots: slots(Object.keys(answers), options.expectedUnit),
  answer: { slotValues: answers }
});

const choiceItem = (
  id: string,
  number: string,
  prompt: string,
  choiceIds: string[],
  options: { promptKana?: string; choices?: PracticeItem["choices"]; answerSource?: PracticeItem["answerSource"] } = {}
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "prompt",
  responseScope: "choice_only",
  choices: options.choices,
  answer: { choiceIds },
  renderHint: "inline"
});

const p2a1Choices = [
  { id: "a", label: "あの小さくて赤いのです。" },
  { id: "b", label: "いいえ。だれでしょうね。" },
  { id: "c", label: "20人です。" },
  { id: "d", label: "すみません、ちょっと…。" },
  { id: "e", label: "田中さんだと思います。" }
];

const p2a2Words = ["どんな", "何", "いつ", "どう", "だれ", "どこ"];

const p2a3Words = [
  "明日から 出張します",
  "写真を 撮って います",
  "ビールを 飲んで います",
  "コピーを 取って います",
  "スミスさんと 話して います",
  "資料を 見て います"
];

const activities: PracticeActivity[] = [
  {
    id: "l25-p1-a1",
    section: "practice_1",
    order: 1,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    itemGroups: [
      {
        id: "l25-p1-a1-g1",
        example: { label: "[例1]", before: "李さんに あげます／本", beforeKana: "りさんに あげます／ほん", after: [text("これは 李さんに あげる 本です。")], afterKana: "これは りさんに あげる ほんです。" },
        items: [
          answerItem("l25-p1-a1-q1", "1", "課長に 見せます／手紙", "これは 課長に 見せる 手紙です。", { promptKana: "かちょうに みせます／てがみ" }),
          answerItem("l25-p1-a1-q2", "2", "図書館で 借りました／雑誌", "これは 図書館で 借りた 雑誌です。", { promptKana: "としょかんで かりました／ざっし" }),
          answerItem("l25-p1-a1-q3", "3", "1日に 3回 飲みます／薬", "これは 1日に 3回 飲む 薬です。", { promptKana: "いちにちに さんかい のみます／くすり" }),
          answerItem("l25-p1-a1-q4", "4", "甘くて おいしいです／飲み物", "これは 甘くて おいしい 飲み物です。", { promptKana: "あまくて おいしいです／のみもの" }),
          answerItem("l25-p1-a1-q5", "5", "日本には ありません／果物", "これは 日本には ない 果物です。", { promptKana: "にほんには ありません／くだもの" }),
          answerItem("l25-p1-a1-q6", "6", "きれいで 優しかったです／母の 写真", "これは きれいで 優しかった 母の 写真です。", { promptKana: "きれいで やさしかったです／ははの しゃしん" })
        ]
      },
      {
        id: "l25-p1-a1-g2",
        example: { label: "[例2]", before: "子供／読みます／絵本", beforeKana: "こども／よみます／えほん", after: [text("これは 子供が 読む 絵本です。")], afterKana: "これは こどもが よむ えほんです。" },
        items: [
          answerItem("l25-p1-a1-q7", "7", "森さん／カラオケで よく 歌います／中国の 歌", "これは 森さんが カラオケで よく 歌う 中国の 歌です。", { promptKana: "もりさん／カラオケで よく うたいます／ちゅうごくの うた" }),
          answerItem("l25-p1-a1-q8", "8", "わたし／生まれました／家の 写真", "これは わたしが 生まれた 家の 写真です。", { promptKana: "わたし／うまれました／いえの しゃしん" }),
          answerItem("l25-p1-a1-q9", "9", "陳さん／まだ 食べた ことが ありません／日本料理", "これは 陳さんが まだ 食べた ことが ない 日本料理です。", { promptKana: "ちんさん／まだ たべた ことが ありません／にほんりょうり" }),
          answerItem("l25-p1-a1-q10", "10", "李さん／明日の 会議で 使います／資料", "これは 李さんが 明日の 会議で 使う 資料です。", { promptKana: "りさん／あしたの かいぎで つかいます／しりょう" })
        ]
      },
      {
        id: "l25-p1-a1-g3",
        example: { label: "[例3]", before: "昨日 会社を 休みました", beforeKana: "きのう かいしゃを やすみました", after: [text("昨日 会社を 休んだ 人は 森さんです。")], afterKana: "きのう かいしゃを やすんだ ひとは もりさんです。" },
        items: [
          answerItem("l25-p1-a1-q11", "11", "明日 会社へ 来ません", "明日 会社へ 来ない 人は 森さんです。", { promptKana: "あした かいしゃへ きません" }),
          answerItem("l25-p1-a1-q12", "12", "山で けがを しました", "山で けがを した 人は 森さんです。", { promptKana: "やまで けがを しました" }),
          answerItem("l25-p1-a1-q13", "13", "まだ 結婚して いません", "まだ 結婚して いない 人は 森さんです。", { promptKana: "まだ けっこんして いません" }),
          answerItem("l25-p1-a1-q14", "14", "周さんを 知りませんでした", "周さんを 知らなかった 人は 森さんです。", { promptKana: "しゅうさんを しりませんでした" })
        ]
      }
    ]
  },
  {
    id: "l25-p1-a2",
    section: "practice_1",
    order: 2,
    title: "看图，仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [
      { id: "lesson25-page10-rb0", kind: "exercise_image", imagePath: exerciseImage("book1_lesson25_1_2.png") },
      { id: "lesson25-page10-rb1", kind: "exercise_image", imagePath: exerciseImage("book1_lesson25_1_2.png") }
    ],
    displayAssets: ["lesson25-page10-rb0", "lesson25-page10-rb1"],
    layout: [
      { type: "example", content: { label: "[例]", before: "①", beforeKana: "いち", after: [text("テレビを 見ている 人は だれですか。")], afterKana: "テレビを みている ひとは だれですか。" } },
      { type: "word_bank", words: ["テレビを 見ます", "タバコを 吸います", "電話を かけます", "新聞を 読みます", "お茶を 飲みます", "手紙を 書きます"].map((word) => text(word)) }
    ],
    items: [
      answerItem("l25-p1-a2-q1", "1", "②", "手紙を 書いている 人は だれですか。", { promptKana: "に" }),
      answerItem("l25-p1-a2-q2", "2", "③", "お茶を 飲んでいる 人は だれですか。", { promptKana: "さん" }),
      answerItem("l25-p1-a2-q3", "3", "④", "タバコを 吸っている 人は だれですか。", { promptKana: "よん" }),
      answerItem("l25-p1-a2-q4", "4", "⑤", "新聞を 読んでいる 人は だれですか。", { promptKana: "ご" }),
      answerItem("l25-p1-a2-q5", "5", "⑥", "電話を かけている 人は だれですか。", { promptKana: "ろく" })
    ]
  },
  {
    id: "l25-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句连接句子。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例1]",
          beforeParts: [text("中国", { kana: "ちゅうごく" }), text("で "), text("買", { kana: "か" }), text("いました／CDを "), text("友達", { kana: "ともだち" }), text("に "), text("貸", { kana: "か" }), text("しました")],
          after: [text("中国", { kana: "ちゅうごく" }), text("で "), text("買", { kana: "か" }), text("った CDを "), text("友達", { kana: "ともだち" }), text("に "), text("貸", { kana: "か" }), text("しました。")]
        }
      },
      {
        type: "example",
        content: {
          label: "[例2]",
          beforeParts: [text("操作", { kana: "そうさ" }), text("が "), text("簡単", { kana: "かんたん" }), text("です／パソコンが "), text("欲", { kana: "ほ" }), text("しいです")],
          after: [text("操作", { kana: "そうさ" }), text("が "), text("簡単", { kana: "かんたん" }), text("な パソコンが "), text("欲", { kana: "ほ" }), text("しいです。")]
        }
      }
    ],
    items: [
      answerItem("l25-p1-a3-q1", "1", "李さんが 書きました／レポートを 読みました", "李さんが 書いた レポートを 読みました。", { promptKana: "りさんが かきました／レポートを よみました" }),
      answerItem("l25-p1-a3-q2", "2", "日本で 撮りました／ビデオを 見ませんか", "日本で 撮った ビデオを 見ませんか。", { promptKana: "にほんで とりました／ビデオを みませんか" }),
      answerItem("l25-p1-a3-q3", "3", "明日 泊まります／ホテルの 電話番号を 教えてください", "明日 泊まる ホテルの 電話番号を 教えてください。", { promptKana: "あした とまります／ホテルの でんわばんごうを おしえてください" }),
      answerItem("l25-p1-a3-q4", "4", "父にもらいました／時計を なくしました", "父に もらった 時計を なくしました。", { promptKana: "ちちに もらいました／とけいを なくしました" }),
      answerItem("l25-p1-a3-q5", "5", "デザインが 新しいです／靴を 買いたいです", "デザインが 新しい 靴を 買いたいです。", { promptKana: "デザインが あたらしいです／くつを かいたいです" }),
      answerItem("l25-p1-a3-q6", "6", "自然が 豊かです／国が 少なく なりました", "自然が 豊かな 国が 少なく なりました。", { promptKana: "しぜんが ゆたかです／くにが すくなく なりました" }),
      answerItem("l25-p1-a3-q7", "7", "あなたの 子供が 好きです／料理は 何ですか", "あなたの 子供が 好きな 料理は 何ですか。", { promptKana: "あなたの こどもが すきです／りょうりは なんですか" }),
      answerItem("l25-p1-a3-q8", "8", "仕事が おもしろくて、給料が 高いです／会社に 入りたいです", "仕事が おもしろくて、給料が 高い 会社に 入りたいです。", { promptKana: "しごとが おもしろくて、きゅうりょうが たかいです／かいしゃに はいりたいです" })
    ]
  },
  {
    id: "l25-p1-a4",
    section: "practice_1",
    order: 4,
    title: "听录音，仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 4),
      label: "第25课 练习I-4",
      transcript: {
        text: "例句包含电话邀约和询问人物两个会话模板；正式题按图片中的替换词生成完整会话。",
        source: "manual",
        confidenceNote: "未重新转写音频，答案依据教材图片例句和替换词整理。"
      }
    },
    layout: [
      { type: "example", content: { label: "[例1]", before: "陳／小野さんに もらいました／CDを 聞きます／買い物", beforeKana: "ちん／おのさんに もらいました／シーディーを ききます／かいもの", after: [text("甲：もしもし、李さんですか。陳です。\n乙：あっ、陳さん、こんにちは。\n甲：今、忙しいですか。\n乙：いいえ、別に。今、小野さんに もらった CDを 聞いていますが。\n甲：そうですか。じゃあ、いっしょに 買い物に 行きませんか。\n乙：ええ、いいですよ。")], afterKana: "こう：もしもし、りさんですか。ちんです。\nおつ：あっ、ちんさん、こんにちは。\nこう：いま、いそがしいですか。\nおつ：いいえ、べつに。いま、おのさんに もらった シーディーを きいていますが。\nこう：そうですか。じゃあ、いっしょに かいものに いきませんか。\nおつ：ええ、いいですよ。" } },
      { type: "example", content: { label: "[例2]", before: "今、田中さんと 話して います／見ました", beforeKana: "いま、たなかさんと はなして います／みました", after: [text("甲：あの 人は だれですか。\n乙：どの 人ですか。\n甲：今、田中さんと 話している 人です。\n乙：ああ、あの 人ですか。見た ことは あるんですが、名前は ちょっと…。")], afterKana: "こう：あの ひとは だれですか。\nおつ：どの ひとですか。\nこう：いま、たなかさんと はなしている ひとです。\nおつ：ああ、あの ひとですか。みた ことは あるんですが、なまえは ちょっと…。" } }
    ],
    items: [
      answerItem("l25-p1-a4-q1", "1", "唐／日本から 来ました／メールを チェックします／食事", "甲：もしもし、唐さんですか。日本から 来た 唐です。\n乙：あっ、唐さん、こんにちは。\n甲：今、忙しいですか。\n乙：いいえ、別に。今、メールを チェックして いますが。\n甲：そうですか。じゃあ、いっしょに 食事に 行きませんか。\n乙：ええ、いいですよ。", { promptKana: "とう／にほんから きました／メールを チェックします／しょくじ", multiline: true, rows: 7 }),
      answerItem("l25-p1-a4-q2", "2", "田中／先月の 旅行で 撮りました／写真を 見ます／美術館", "甲：もしもし、田中さんですか。\n乙：あっ、こんにちは。\n甲：今、忙しいですか。\n乙：いいえ、別に。今、先月の 旅行で 撮った 写真を 見て いますが。\n甲：そうですか。じゃあ、いっしょに 美術館に 行きませんか。\n乙：ええ、いいですよ。", { promptKana: "たなか／せんげつの りょこうで とりました／しゃしんを みます／びじゅつかん", multiline: true, rows: 7 }),
      answerItem("l25-p1-a4-q3", "3", "森／日本の 友達に 出します／手紙を 書きます／公園", "甲：もしもし、森さんですか。\n乙：あっ、こんにちは。\n甲：今、忙しいですか。\n乙：いいえ、別に。今、日本の 友達に 出す 手紙を 書いて いますが。\n甲：そうですか。じゃあ、いっしょに 公園に 行きませんか。\n乙：ええ、いいですよ。", { promptKana: "もり／にほんの ともだちに だします／てがみを かきます／こうえん", multiline: true, rows: 7 }),
      answerItem("l25-p1-a4-q4", "4", "あそこで コピーを 取って います／話しました", "甲：あの 人は だれですか。\n乙：どの 人ですか。\n甲：あそこで コピーを 取っている 人です。\n乙：ああ、あの 人ですか。話した ことは あるんですが、名前は ちょっと…。", { promptKana: "あそこで コピーを とって います／はなしました", multiline: true, rows: 5 }),
      answerItem("l25-p1-a4-q5", "5", "今、李さんと お茶を 飲んで います／顔を 見ました", "甲：あの 人は だれですか。\n乙：どの 人ですか。\n甲：今、李さんと お茶を 飲んでいる 人です。\n乙：ああ、あの 人ですか。顔を 見た ことは あるんですが、名前は ちょっと…。", { promptKana: "いま、りさんと おちゃを のんで います／かおを みました", multiline: true, rows: 5 }),
      answerItem("l25-p1-a4-q6", "6", "さっき 入り口で 会いました／一度 会いました", "甲：あの 人は だれですか。\n乙：どの 人ですか。\n甲：さっき 入り口で 会った 人です。\n乙：ああ、あの 人ですか。一度 会った ことは あるんですが、名前は ちょっと…。", { promptKana: "さっき いりぐちで あいました／いちど あいました", multiline: true, rows: 5 }),
      answerItem("l25-p1-a4-q7", "7", "あそこで 電話を かけて います／一度 話しました", "甲：あの 人は だれですか。\n乙：どの 人ですか。\n甲：あそこで 電話を かけている 人です。\n乙：ああ、あの 人ですか。一度 話した ことは あるんですが、名前は ちょっと…。", { promptKana: "あそこで でんわを かけて います／いちど はなしました", multiline: true, rows: 5 }),
      answerItem("l25-p1-a4-q8", "8", "窓の ところに います／何度か 顔を 見ました", "甲：あの 人は だれですか。\n乙：どの 人ですか。\n甲：窓の ところに いる 人です。\n乙：ああ、あの 人ですか。何度か 顔を 見た ことは あるんですが、名前は ちょっと…。", { promptKana: "まどの ところに います／なんどか かおを みました", multiline: true, rows: 5 })
    ]
  },
  {
    id: "l25-p2-a1",
    section: "practice_2",
    order: 1,
    title: "从□中选择适当的答案，并将字母填入（　）中。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    layout: [
      { type: "example", content: { label: "[例]", before: "去年 JC企画に 入った 社員は 何人ですか。", beforeKana: "きょねん ジェーシーきかくに はいった しゃいんは なんにんですか。", after: [text("c")], afterKana: "シー" } },
      { type: "word_bank", words: p2a1Choices.map((choice) => text(`${choice.id} ${choice.label}`)) }
    ],
    items: [
      choiceItem("l25-p2-a1-q1", "1", "エレベーターの 前に いる 人を 知って いますか。", ["e"], { promptKana: "エレベーターの まえに いる ひとを しって いますか。", choices: p2a1Choices }),
      choiceItem("l25-p2-a1-q2", "2", "あなたが 買いたい かばんは どれですか。", ["a"], { promptKana: "あなたが かいたい かばんは どれですか。", choices: p2a1Choices }),
      choiceItem("l25-p2-a1-q3", "3", "フランス語が できる 人は だれですか。", ["b"], { promptKana: "フランスごが できる ひとは だれですか。", choices: p2a1Choices }),
      choiceItem("l25-p2-a1-q4", "4", "机の 上に ある パソコンを 使っても いいですか。", ["d"], { promptKana: "つくえの うえに ある パソコンを つかっても いいですか。", choices: p2a1Choices })
    ]
  },
  {
    id: "l25-p2-a2",
    section: "practice_2",
    order: 2,
    title: "从□中选择适当的词语填入（　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: completionHint,
    layout: [
      { type: "example", content: { label: "[例]", beforeParts: [text("今 パソコンを 使っている 人は（", { kana: "いま パソコンを つかっている ひとは（" }), blank("example"), text("）ですか。——李さんです。", { kana: "）ですか。——りさんです。" })], after: [text("だれ")], afterKana: "だれ" } },
      { type: "word_bank", words: p2a2Words.map((word) => text(word)) }
    ],
    items: [
      blankItem("l25-p2-a2-q1", "1", [text("小野さんが 中国へ 行く 日は（", { kana: "おのさんが ちゅうごくへ いく ひは（" }), blank("answer"), text("）ですか。——あさってです。", { kana: "）ですか。——あさってです。" })], { answer: "いつ" }),
      blankItem("l25-p2-a2-q2", "2", [text("それは（", { kana: "それは（" }), blank("answer"), text("）で 撮った 写真ですか。——北京です。", { kana: "）で とった しゃしんですか。——ペキンです。" })], { answer: "どこ" }),
      blankItem("l25-p2-a2-q3", "3", [text("昨日 聞いた CDは（", { kana: "きのう きいた シーディーは（" }), blank("answer"), text("）でしたか。——よかったですよ。", { kana: "）でしたか。——よかったですよ。" })], { answer: "どう" }),
      blankItem("l25-p2-a2-q4", "4", [text("あなたが 生まれた 町は（", { kana: "あなたが うまれた まちは（" }), blank("answer"), text("）所ですか。——静かな 所です。", { kana: "）ところですか。——しずかな ところです。" })], { answer: "どんな" }),
      blankItem("l25-p2-a2-q5", "5", [text("今年 JC企画に 入った 人の 名前は（", { kana: "ことし ジェーシーきかくに はいった ひとの なまえは（" }), blank("answer"), text("）と 言いますか。——山田さんです。", { kana: "）と いいますか。——やまださんです。" })], { answer: "何" })
    ]
  },
  {
    id: "l25-p2-a3",
    section: "practice_2",
    order: 3,
    title: "听录音，从□中选择句子变成适当的形式，填入（　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: completionHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "第25课 练习II-3",
      transcript: {
        text: "例：林さんはビールを飲んでいる人です。正式题按图片中的句子框选择并改成名词修饰形式。",
        source: "manual",
        confidenceNote: "未重新转写音频，答案依据教材图片和题面整理。"
      }
    },
    layout: [
      { type: "example", content: { label: "[例]", beforeParts: [text("林さんは（", { kana: "はやしさんは（" }), blank("example"), text("）人です。", { kana: "）ひとです。" })], after: [text("ビールを 飲んでいる")], afterKana: "ビールを のんでいる" } },
      { type: "word_bank", words: p2a3Words.map((word) => text(word)) }
    ],
    items: [
      blankItem("l25-p2-a3-q1", "1", [blank("answer"), text(" 人は 李さんです。", { kana: " ひとは りさんです。" })], { answer: "明日から 出張する" }),
      blankItem("l25-p2-a3-q2", "2", [text("吉田さんは（", { kana: "よしださんは（" }), blank("answer"), text("）人では ありません。", { kana: "）ひとでは ありません。" })], { answer: "写真を 撮っている" }),
      blankItem("l25-p2-a3-q3", "3", [text("馬さんは（", { kana: "ばさんは（" }), blank("answer"), text("）人です。", { kana: "）ひとです。" })], { answer: "コピーを 取っている" }),
      blankItem("l25-p2-a3-q4", "4", [blank("answer"), text(" 人は 森さんです。", { kana: " ひとは もりさんです。" })], { answer: "スミスさんと 話している" }),
      blankItem("l25-p2-a3-q5", "5", [blank("answer"), text(" 人は 陳さんでは ありません。", { kana: " ひとは ちんさんでは ありません。" })], { answer: "資料を 見ている" })
    ]
  },
  {
    id: "l25-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l25-p2-a4-q1", "1", "这是明天会议要用的资料。", "これは 明日 会議で 使う 資料です。", { acceptableAlternatives: ["これは 明日の 会議で 使う 資料です。"] }),
      answerItem("l25-p2-a4-q2", "2", "（我）把在中国买的 CD 借给朋友了。", "中国で 買った CDを 友達に 貸しました。", { acceptableAlternatives: ["中国で 買った CDを 友達に 貸したんです。"] }),
      answerItem("l25-p2-a4-q3", "3", "（我）想要操作简单的个人电脑。", "操作が 簡単な パソコンが 欲しいです。", { acceptableAlternatives: ["操作が 簡単な パソコンが ほしいです。"] })
    ]
  }
];

export const lesson25Practice: LessonPractice = {
  lessonId: "lesson25",
  title: "第25课 これは 明日 会議で 使う 資料です",
  sourcePages: [
    { pageNo: 10, imagePath: page(10) },
    { pageNo: 11, imagePath: page(11) },
    { pageNo: 12, imagePath: page(12) }
  ],
  activities
};
