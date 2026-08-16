import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson24/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit6/lesson24/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const completionHint = "只补全题目中空格处需要填写的部分。";
const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
const sentenceSlot = (placeholder = "输入完整句子"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const phraseSlot = (placeholder = "输入词语"): InputSlot[] => [{ id: "answer", expectedUnit: "phrase", width: "long", placeholder }];
const dialogueSlot = (placeholder = "输入完整问答", rows = 4): InputSlot[] => [
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
  inputSlots: options.multiline ? dialogueSlot("输入完整问答", options.rows || 4) : sentenceSlot("输入完整句子"),
  answer: { slotValues: { answer }, acceptableAlternatives: options.acceptableAlternatives }
});

const phraseItem = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  answer: string,
  options: { promptKana?: string; answerSource?: PracticeItem["answerSource"]; responseScopeHint?: string; acceptableAlternatives?: string[] } = {}
): PracticeItem => ({
  id,
  number,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "example_transform",
  responseScope: "phrase_only",
  responseScopeHint: options.responseScopeHint || completionHint,
  inputSlots: phraseSlot("输入词语"),
  answer: { slotValues: { answer }, acceptableAlternatives: options.acceptableAlternatives }
});

const blankItem = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  answers: Record<string, string>,
  options: { promptKana?: string; answerSource?: PracticeItem["answerSource"]; expectedUnit?: InputSlot["expectedUnit"] } = {}
): PracticeItem => ({
  id,
  number,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "prompt",
  responseScope: "phrase_only",
  responseScopeHint: completionHint,
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
  answerSource: options.answerSource || "audio",
  responseScope: "choice_only",
  choices: options.choices,
  answer: { choiceIds },
  renderHint: "inline"
});

const listeningChoices = [
  { id: "c1", label: "もう おなかが いっぱいなんです。" },
  { id: "c2", label: "明日 11時に 来ると 思います。" },
  { id: "c3", label: "駅から バスで 来たんです。" },
  { id: "c4", label: "すみません。車で 来たんです。" },
  { id: "c5", label: "安全な 国だと 思います。" },
  { id: "c6", label: "絶対に 吸わない ほうが いいと 思います。" }
];

const activities: PracticeActivity[] = [
  {
    id: "l24-p1-a1",
    section: "practice_1",
    order: 1,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [],
    layout: [
      { type: "example", content: { label: "[例]", before: "李さんは もう すぐ 来ます。", beforeKana: "りさんは もう すぐ きます。", after: [text("李さんは もう すぐ 来ると 思います。")], afterKana: "りさんは もう すぐ くると おもいます。" } }
    ],
    items: [
      answerItem("l24-p1-a1-q1", "1", "明日は 雨が 降りません。", "明日は 雨が 降らないと 思います。", { promptKana: "あしたは あめが ふりません。" }),
      answerItem("l24-p1-a1-q2", "2", "森さんは もう 帰りました。", "森さんは もう 帰ったと 思います。", { promptKana: "もりさんは もう かえりました。" }),
      answerItem("l24-p1-a1-q3", "3", "韓国語の 勉強は おもしろいです。", "韓国語の 勉強は おもしろいと 思います。", { promptKana: "かんこくごの べんきょうは おもしろいです。" }),
      answerItem("l24-p1-a1-q4", "4", "携帯電話は 便利です。", "携帯電話は 便利だと 思います。", { promptKana: "けいたいでんわは べんりです。" }),
      answerItem("l24-p1-a1-q5", "5", "小野さんは 李さんより 上手でした。", "小野さんは 李さんより 上手だったと 思います。", { promptKana: "おのさんは りさんより じょうずでした。" }),
      answerItem("l24-p1-a1-q6", "6", "昨日の ほうが 寒かったです。", "昨日の ほうが 寒かったと 思います。", { promptKana: "きのうの ほうが さむかったです。" }),
      answerItem("l24-p1-a1-q7", "7", "森さんは 昨日 来ませんでした。", "森さんは 昨日 来なかったと 思います。", { promptKana: "もりさんは きのう きませんでした。" }),
      answerItem("l24-p1-a1-q8", "8", "午後、忙しいです。", "午後、忙しいと 思います。", { promptKana: "ごご、いそがしいです。" }),
      answerItem("l24-p1-a1-q9", "9", "4月は もっと 暖かく なります。", "4月は もっと 暖かく なると 思います。", { promptKana: "しがつは もっと あたたかく なります。" }),
      answerItem("l24-p1-a1-q10", "10", "森さんは 料理が 上手です。", "森さんは 料理が 上手だと 思います。", { promptKana: "もりさんは りょうりが じょうずです。" }),
      answerItem("l24-p1-a1-q11", "11", "毎朝 6時に 起きた ほうが いいです。", "毎朝 6時に 起きた ほうが いいと 思います。", { promptKana: "まいあさ ろくじに おきた ほうが いいです。" }),
      answerItem("l24-p1-a1-q12", "12", "森さんは 中国語を 話す ことが できます。", "森さんは 中国語を 話す ことが できると 思います。", { promptKana: "もりさんは ちゅうごくごを はなす ことが できます。" })
    ]
  },
  {
    id: "l24-p1-a2",
    section: "practice_1",
    order: 2,
    title: "仿照例句回答提问。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    assets: [],
    layout: [
      { type: "example", content: { label: "[例1]", before: "日本料理は どうですか。（きれいです／おいしいです）", beforeKana: "にほんりょうりは どうですか。（きれいです／おいしいです）", after: [text("きれいで おいしいと 思います。")], afterKana: "きれいで おいしいと おもいます。" } },
      { type: "example", content: { label: "[例2]", before: "四川料理は どうですか。（とても おいしいです／辛いです）", beforeKana: "しせんりょうりは どうですか。（とても おいしいです／からいです）", after: [text("とても おいしいですが、辛いと 思います。")], afterKana: "とても おいしいですが、からいと おもいます。" } }
    ],
    items: [
      answerItem("l24-p1-a2-q1", "1", "この お店は どうですか。（安いです／おいしいです）", "安くて おいしいと 思います。", { promptKana: "この おみせは どうですか。（やすいです／おいしいです）", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l24-p1-a2-q2", "2", "この コンピュータは どうですか。（簡単です／便利です）", "簡単で 便利だと 思います。", { promptKana: "この コンピュータは どうですか。（かんたんです／べんりです）", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l24-p1-a2-q3", "3", "この ネクタイは どうですか。（悪く ないです／少し 派手です）", "悪く ないですが、少し 派手だと 思います。", { promptKana: "この ネクタイは どうですか。（わるく ないです／すこし はでです）", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l24-p1-a2-q4", "4", "法律の 勉強は どうですか。（難しいです／役に 立ちます）", "難しいですが、役に 立つと 思います。", { promptKana: "ほうりつの べんきょうは どうですか。（むずかしいです／やくに たちます）", responseScope: "answer_only", responseScopeHint: answerOnlyHint })
    ]
  },
  {
    id: "l24-p1-a3",
    section: "practice_1",
    order: 3,
    title: "听录音，仿照例句用“～と 思います”回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 3),
      label: "第24课 练习I-3",
      transcript: {
        text: "李さんはもうすぐ来ますか。はい、もうすぐ来ます。はい、もうすぐ来ると思います。一、メガネはどこにありますか。かばんの中にあります。かばんの中にあると思います。二、王さんは中国人ですか。はい、中国人です。はい、中国人だと思います。三、森さんは、このニュースを知っていますか。いいえ、知りません。いいえ、知らないと思います。四、タバコは吸わない方がいいですか。はい、絶対に吸わないほうがいいです。はい、絶対に吸わない方がいいと思います。",
        source: "asr",
        confidenceNote: "ASR 覆盖例题和正式题 1-4，题目括号内容与教材图片一致。"
      }
    },
    assets: [],
    layout: [
      { type: "example", content: { label: "[例]", before: "李さんは もう すぐ 来ますか。（はい、もう すぐ 来ます）", beforeKana: "りさんは もう すぐ きますか。（はい、もう すぐ きます）", after: [text("はい、もう すぐ 来ると 思います。")], afterKana: "はい、もう すぐ くると おもいます。" } }
    ],
    items: [
      answerItem("l24-p1-a3-q1", "1", "（かばんの 中に あります）", "かばんの 中に あると 思います。", { promptKana: "（かばんの なかに あります）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l24-p1-a3-q2", "2", "（はい、中国人です）", "はい、中国人だと 思います。", { promptKana: "（はい、ちゅうごくじんです）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l24-p1-a3-q3", "3", "（いいえ、知りません）", "いいえ、知らないと 思います。", { promptKana: "（いいえ、しりません）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l24-p1-a3-q4", "4", "（はい、絶対に 吸わない ほうが いいです）", "はい、絶対に 吸わない ほうが いいと 思います。", { promptKana: "（はい、ぜったいに すわない ほうが いいです）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint })
    ]
  },
  {
    id: "l24-p1-a4",
    section: "practice_1",
    order: 4,
    title: "仿照例句，将小野、小李、长岛的话转告他人。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [],
    layout: [
      { type: "example", content: { label: "[例]", before: "清水さん／午後から 出かけます", beforeKana: "しみずさん／ごごから でかけます", after: [text("清水さんは 午後から 出かけると 言いました。")], afterKana: "しみずさんは ごごから でかけると いいました。" } }
    ],
    items: [
      answerItem("l24-p1-a4-q1", "1", "小野さん／今年中に 結婚したいです", "小野さんは 今年中に 結婚したいと 言いました。", { promptKana: "おのさん／ことしじゅうに けっこんしたいです" }),
      answerItem("l24-p1-a4-q2", "2", "李さん／旅行に 行くか どうか 分かりません", "李さんは 旅行に 行くか どうか 分からないと 言いました。", { promptKana: "りさん／りょこうに いくか どうか わかりません", acceptableAlternatives: ["李さんは 旅行に 行くか どうか 分かりませんと 言いました。"] }),
      answerItem("l24-p1-a4-q3", "3", "長島さん／焼酎が いちばん 好きです", "長島さんは 焼酎が いちばん 好きだと 言いました。", { promptKana: "ながしまさん／しょうちゅうが いちばん すきです" })
    ]
  },
  {
    id: "l24-p1-a5",
    section: "practice_1",
    order: 5,
    title: "先仿照例句进行练习，然后听录音确认。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 5),
      label: "第24课 练习I-5",
      transcript: {
        text: "暑いです。暑いんです。静かです。静かなんです。晴れです。晴れなんです。行きます。行くんです。一、高いです。高いんです。二、安かったです。安かったんです。三、易しくないです。易しくないんです。四、おもしろくなかったです。おもしろくなかったんです。五、元気です。元気なんです。六、暇でした。暇だったんです。七、きれいではありません。きれいではないんです。八、雨です。雨なんです。九、日曜日でした。日曜日だったんです。",
        source: "asr",
        confidenceNote: "ASR 清晰覆盖例题和正式题 1-9；正式题 10-15 根据教材图片和“んです”转换规则补全。"
      }
    },
    assets: [],
    layout: [
      { type: "example", content: { label: "[例]", before: "暑いです。\n静かです。\n晴れです。\n行きます。", beforeKana: "あついです。\nしずかです。\nはれです。\nいきます。", after: [text("暑いんです。\n静かなんです。\n晴れなんです。\n行くんです。")], afterKana: "あついんです。\nしずかなんです。\nはれなんです。\nいくんです。" } }
    ],
    items: [
      answerItem("l24-p1-a5-q1", "1", "高いです。", "高いんです。", { promptKana: "たかいです。" }),
      answerItem("l24-p1-a5-q2", "2", "安かったです。", "安かったんです。", { promptKana: "やすかったです。" }),
      answerItem("l24-p1-a5-q3", "3", "易しく ないです。", "易しく ないんです。", { promptKana: "やさしく ないです。" }),
      answerItem("l24-p1-a5-q4", "4", "おもしろく なかったです。", "おもしろく なかったんです。", { promptKana: "おもしろく なかったです。" }),
      answerItem("l24-p1-a5-q5", "5", "元気です。", "元気なんです。", { promptKana: "げんきです。" }),
      answerItem("l24-p1-a5-q6", "6", "暇でした。", "暇だったんです。", { promptKana: "ひまでした。" }),
      answerItem("l24-p1-a5-q7", "7", "きれいでは ありません。", "きれいでは ないんです。", { promptKana: "きれいでは ありません。" }),
      answerItem("l24-p1-a5-q8", "8", "雨です。", "雨なんです。", { promptKana: "あめです。" }),
      answerItem("l24-p1-a5-q9", "9", "日曜日でした。", "日曜日だったんです。", { promptKana: "にちようびでした。" }),
      answerItem("l24-p1-a5-q10", "10", "雨では ありませんでした。", "雨では なかったんです。", { promptKana: "あめでは ありませんでした。" }),
      answerItem("l24-p1-a5-q11", "11", "見ません。", "見ないんです。", { promptKana: "みません。" }),
      answerItem("l24-p1-a5-q12", "12", "読みました。", "読んだんです。", { promptKana: "よみました。" }),
      answerItem("l24-p1-a5-q13", "13", "聞きませんでした。", "聞かなかったんです。", { promptKana: "ききませんでした。" }),
      answerItem("l24-p1-a5-q14", "14", "子供では ありません。", "子供では ないんです。", { promptKana: "こどもでは ありません。" }),
      answerItem("l24-p1-a5-q15", "15", "静かでは ありませんでした。", "静かでは なかったんです。", { promptKana: "しずかでは ありませんでした。" })
    ]
  },
  {
    id: "l24-p1-a6",
    section: "practice_1",
    order: 6,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [],
    layout: [
      { type: "example", content: { label: "[例1]", before: "東京タワー", beforeKana: "とうきょうタワー", after: [text("東京タワーへ 行きたいんですが、どうやって 行きますか。")], afterKana: "とうきょうタワーへ いきたいんですが、どうやって いきますか。" } },
      { type: "example", content: { label: "[例2]", before: "使い方を 教えます", beforeKana: "つかいかたを おしえます", after: [text("すみませんが、使い方を 教えて くださいませんか。")], afterKana: "すみませんが、つかいかたを おしえて くださいませんか。" } }
    ],
    items: [
      answerItem("l24-p1-a6-q1", "1", "新宿", "新宿へ 行きたいんですが、どうやって 行きますか。", { promptKana: "しんじゅく" }),
      answerItem("l24-p1-a6-q2", "2", "横浜", "横浜へ 行きたいんですが、どうやって 行きますか。", { promptKana: "よこはま" }),
      answerItem("l24-p1-a6-q3", "3", "JC企画", "JC企画へ 行きたいんですが、どうやって 行きますか。", { promptKana: "JCきかく" }),
      answerItem("l24-p1-a6-q4", "4", "東京大学", "東京大学へ 行きたいんですが、どうやって 行きますか。", { promptKana: "とうきょうだいがく" }),
      answerItem("l24-p1-a6-q5", "5", "箱根の 美術館", "箱根の 美術館へ 行きたいんですが、どうやって 行きますか。", { promptKana: "はこねの びじゅつかん" }),
      answerItem("l24-p1-a6-q6", "6", "読み方を 教えます", "すみませんが、読み方を 教えて くださいませんか。", { promptKana: "よみかたを おしえます" }),
      answerItem("l24-p1-a6-q7", "7", "もう 一度 言います", "すみませんが、もう 一度 言って くださいませんか。", { promptKana: "もう いちど いいます" }),
      answerItem("l24-p1-a6-q8", "8", "ゆっくり 言います", "すみませんが、ゆっくり 言って くださいませんか。", { promptKana: "ゆっくり いいます" }),
      answerItem("l24-p1-a6-q9", "9", "紙に 書きます", "すみませんが、紙に 書いて くださいませんか。", { promptKana: "かみに かきます" }),
      answerItem("l24-p1-a6-q10", "10", "地図を かきます", "すみませんが、地図を かいて くださいませんか。", { promptKana: "ちずを かきます" })
    ]
  },
  {
    id: "l24-p1-a7",
    section: "practice_1",
    order: 7,
    title: "先仿照例句替换画线部分练习会话，然后听录音确认。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 7),
      label: "第24课 练习I-7",
      transcript: {
        text: "食べません。もう、お腹がいっぱいです。どうして食べないんですか。もう、おなかがいっぱいなんです。一、学校に行きません。今日は休みです。どうして学校に行かないんですか。今日は休みなんです。二、窓を閉めます。寒いです。どうして窓を閉めるんですか。寒いんです。三、行きませんでした。都合が悪かったです。どうして行かなかったんですか。都合が悪かったんです。四、笑っています。長島さんの話がおかしかったです。どうして笑っているんですか。長島さんの話がおかしかったんです。",
        source: "asr",
        confidenceNote: "ASR 覆盖例题和正式题 1-4。"
      }
    },
    assets: [],
    layout: [
      { type: "example", content: { label: "[例]", before: "食べません／もう おなかが いっぱいです", beforeKana: "たべません／もう おなかが いっぱいです", after: [text("甲：どうして 食べないんですか。\n乙：もう おなかが いっぱいなんです。")], afterKana: "どうして たべないんですか。\nもう おなかが いっぱいなんです。" } }
    ],
    items: [
      answerItem("l24-p1-a7-q1", "1", "学校に 行きません／今日は 休みです", "甲：どうして 学校に 行かないんですか。\n乙：今日は 休みなんです。", { promptKana: "がっこうに いきません／きょうは やすみです", multiline: true, rows: 4 }),
      answerItem("l24-p1-a7-q2", "2", "窓を 閉めます／寒いです", "甲：どうして 窓を 閉めるんですか。\n乙：寒いんです。", { promptKana: "まどを しめます／さむいです", multiline: true, rows: 4 }),
      answerItem("l24-p1-a7-q3", "3", "行きませんでした／都合が 悪かったです", "甲：どうして 行かなかったんですか。\n乙：都合が 悪かったんです。", { promptKana: "いきませんでした／つごうが わるかったです", multiline: true, rows: 4 }),
      answerItem("l24-p1-a7-q4", "4", "笑って います／長島さんの 話が おかしかったです", "甲：どうして 笑って いるんですか。\n乙：長島さんの 話が おかしかったんです。", { promptKana: "わらって います／ながしまさんの はなしが おかしかったです", multiline: true, rows: 4 })
    ]
  },
  {
    id: "l24-p2-a1",
    section: "practice_2",
    order: 1,
    title: "从□中选择适当的词语，变成适当的形式填入（　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: completionHint,
    assets: [
      { id: "l24-p2-a1-word-bank", kind: "exercise_image", imagePath: exerciseImage("book1_lesson24_2_1.png") }
    ],
    displayAssets: ["l24-p2-a1-word-bank"],
    layout: [
      { type: "example", content: { label: "[例]", beforeParts: [text("長島さんは 焼酎が いちばん（"), blank("example"), text("）と 言いました。")], beforeKana: "ながしまさんは しょうちゅうが いちばん（　）と いいました。", after: [text("好きだ")], afterKana: "すきだ" } },
      { type: "word_bank", words: ["好きです", "吸いません", "上手です", "来ません", "火曜日でした", "食べた ことが ありません"].map((word) => text(word)) }
    ],
    items: [
      blankItem("l24-p2-a1-q1", "1", [text("この 絵は とても（"), blank("answer"), text("）と 思います。")], { answer: "上手だ" }, { promptKana: "この えは とても（　）と おもいます。" }),
      blankItem("l24-p2-a1-q2", "2", [text("森さんは 今日から タバコを（"), blank("answer"), text("）と 言いました。")], { answer: "吸わない" }, { promptKana: "もりさんは きょうから タバコを（　）と いいました。" }),
      blankItem("l24-p2-a1-q3", "3", [text("この 料理は（"), blank("answer"), text("）と 思います。")], { answer: "食べた ことが ない" }, { promptKana: "この りょうりは（　）と おもいます。" }),
      blankItem("l24-p2-a1-q4", "4", [text("太田さんは 明日 会社へ（"), blank("answer"), text("）と 言いました。")], { answer: "来ない" }, { promptKana: "おおたさんは あした かいしゃへ（　）と いいました。" }),
      blankItem("l24-p2-a1-q5", "5", [text("4日は（"), blank("answer"), text("）と 思います。")], { answer: "火曜日だった" }, { promptKana: "よっかは（　）と おもいます。" })
    ]
  },
  {
    id: "l24-p2-a2",
    section: "practice_2",
    order: 2,
    title: "将（　）中的词语变成适当的形式，完成句子。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: completionHint,
    assets: [],
    layout: [
      { type: "example", content: { label: "[例]", beforeParts: [text("李さんを（探して います → ", { kana: "りさんを（さがして います → " }), blank("example"), text("）んですが、どこに いますか。", { kana: "）んですが、どこに いますか。" })], after: [text("探して いる")], afterKana: "さがして いる" } }
    ],
    items: [
      blankItem("l24-p2-a2-q1", "1", [text("頭が（痛いです → ", { kana: "あたまが（いたいです → " }), blank("answer"), text("）んですが、もう 帰っても いいですか。", { kana: "）んですが、もう かえっても いいですか。" })], { answer: "痛い" }),
      blankItem("l24-p2-a2-q2", "2", [text("明日の（会議です → ", { kana: "あしたの（かいぎです → " }), blank("answer"), text("）んですが、何時から 始めますか。", { kana: "）んですが、なんじから はじめますか。" })], { answer: "会議な" }),
      blankItem("l24-p2-a2-q3", "3", [text("切符を（なくしました → ", { kana: "きっぷを（なくしました → " }), blank("answer"), text("）んですが、もう 一度 買わなければ なりませんか。", { kana: "）んですが、もう いちど かわなければ なりませんか。" })], { answer: "なくした" }),
      blankItem("l24-p2-a2-q4", "4", [text("来週 北京へ（行きます → ", { kana: "らいしゅう ペキンへ（いきます → " }), blank("answer"), text("）んですが、何か 欲しい 物が ありますか。", { kana: "）んですが、なにか ほしい ものが ありますか。" })], { answer: "行く" }),
      blankItem("l24-p2-a2-q5", "5", [text("李さんの 電話番号を（忘れました → ", { kana: "りさんの でんわばんごうを（わすれました → " }), blank("answer"), text("）んですが、知って いますか。", { kana: "）んですが、しって いますか。" })], { answer: "忘れた" })
    ]
  },
  {
    id: "l24-p2-a3",
    section: "practice_2",
    order: 3,
    title: "听录音，从□中选择正确答案，并将号码写在横线上。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "第24课 练习II-3",
      transcript: {
        text: "どうして食べないんですか。もう、お腹がいっぱいなんです。一、田中さんがいつ来るか知っていますか。二、日本についてどう思いますか。三、タバコについてどう思いますか。四、ここまでどうやって来たんですか。五、ビールはいかがですか。",
        source: "asr",
        confidenceNote: "ASR 识别到正式题 1-5；第 5 题音频转写与选项匹配度较低，按教材选项剩余项整理为 ③。"
      }
    },
    assets: [
      { id: "l24-p2-a3-listening-choice", kind: "exercise_image", imagePath: exerciseImage("book1_lesson24_2_3.png") }
    ],
    displayAssets: ["l24-p2-a3-listening-choice"],
    layout: [
      { type: "example", content: { label: "[例]", before: "どうして 食べないんですか。", beforeKana: "どうして たべないんですか。", after: [text("①")], afterKana: "いち" } },
      { type: "word_bank", words: listeningChoices.map((choice, index) => text(`${index + 1}. ${choice.label}`)) }
    ],
    items: [
      choiceItem("l24-p2-a3-q1", "1", "田中さんが いつ 来るか 知って いますか。", ["c2"], { promptKana: "たなかさんが いつ くるか しって いますか。", choices: listeningChoices }),
      choiceItem("l24-p2-a3-q2", "2", "日本に ついて どう 思いますか。", ["c5"], { promptKana: "にほんに ついて どう おもいますか。", choices: listeningChoices }),
      choiceItem("l24-p2-a3-q3", "3", "タバコに ついて どう 思いますか。", ["c6"], { promptKana: "タバコに ついて どう おもいますか。", choices: listeningChoices }),
      choiceItem("l24-p2-a3-q4", "4", "ここまで どうやって 来たんですか。", ["c3"], { promptKana: "ここまで どうやって きたんですか。", choices: listeningChoices }),
      choiceItem("l24-p2-a3-q5", "5", "ビールは いかがですか。", ["c4"], { promptKana: "ビールは いかがですか。", choices: listeningChoices })
    ]
  },
  {
    id: "l24-p2-a4",
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
      answerItem("l24-p2-a4-q1", "1", "（我想）小李马上就来。", "李さんは もう すぐ 来ると 思います。", { acceptableAlternatives: ["李さんは すぐ 来ると 思います。"] }),
      answerItem("l24-p2-a4-q2", "2", "我想去东京塔，怎么走好啊？", "東京タワーへ 行きたいんですが、どうやって 行きますか。", { acceptableAlternatives: ["東京タワーへ 行きたいんですが、どう 行きますか。"] }),
      answerItem("l24-p2-a4-q3", "3", "老陈说要去参加晚会。", "陳さんは パーティーに 行くと 言いました。", { acceptableAlternatives: ["陳さんは パーティーへ 行くと 言いました。"] })
    ]
  }
];

export const lesson24Practice: LessonPractice = {
  lessonId: "lesson24",
  title: "第24课 李さんは もう すぐ 来ると 思います",
  sourcePages: [
    { pageNo: 288, imagePath: page(288) },
    { pageNo: 289, imagePath: page(289) },
    { pageNo: 290, imagePath: page(290) }
  ],
  activities
};
