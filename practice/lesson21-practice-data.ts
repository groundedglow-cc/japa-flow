import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson21/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit6/lesson21/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const completionHint = "只补全题目中空格处需要填写的部分。";
const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
const sentenceSlot = (placeholder = "输入完整回答"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const multilineSlot = (placeholder = "输入完整回答", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "sentence", width: "long", multiline: true, rows, placeholder }
];
const dialogueSlot = (placeholder = "输入完整问答", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows, placeholder }
];
const slots = (slotIds: string[], expectedUnit: InputSlot["expectedUnit"] = "phrase"): InputSlot[] =>
  slotIds.map((slotId) => ({ id: slotId, expectedUnit, width: expectedUnit === "conjugated_form" ? "medium" : "short", placeholder: "输入词语" }));

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
  inputSlots: options.multiline ? multilineSlot("输入完整回答", options.rows || 4) : sentenceSlot("输入完整回答"),
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
  inputSlots: slots(Object.keys(answers), options.expectedUnit),
  answer: { slotValues: answers }
});

const dialogueItem = (id: string, number: string, prompt: string, answer: string, promptKana?: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "example_transform",
  responseScope: "question_and_answer",
  responseScopeHint: "写出完整问答。",
  inputSlots: dialogueSlot("输入完整问答", 4),
  answer: { slotValues: { answer } },
  renderHint: "dialogue"
});

const trueFalseItem = (id: string, number: string, prompt: string, value: boolean): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  instruction: "",
  answerSource: "audio",
  responseScope: "boolean_only",
  choices: [
    { id: "true", label: "○" },
    { id: "false", label: "×" }
  ],
  answer: { boolean: value, choiceIds: [value ? "true" : "false"] }
});

const taFormItem = (id: string, number: string, prompt: string, answer: string, promptKana?: string): PracticeItem =>
  blankItem(id, number, [text(prompt), text(" → "), blank("answer")], { answer }, {
    promptKana,
    answerSource: "audio",
    responseScope: "word_only",
    expectedUnit: "conjugated_form"
  });

const activities: PracticeActivity[] = [
  {
    id: "l21-p1-a1",
    section: "practice_1",
    order: 1,
    title: "听录音，将“ます形”变为“た形”。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 1),
      label: "第21课 练习I-1",
      transcript: {
        text: "歩きます、歩いた。脱ぎます、脱いだ。急ぎます、急いだ。飲みます、飲んだ。休みます、休んだ。乗ります、乗った。歌います、歌った。立ちます、立った。消します、消した。話します、話した。浴びます、浴びた。見ます、見た。考えます、考えた。寝ます、寝た。忘れます、忘れた。始めます、始めた。します、した。安心します、安心した。運動します、運動した。来ます、来た。",
        source: "manual",
        confidenceNote: "ASR 转写结合教材表格校对整理。"
      }
    },
    assets: [],
    layout: [
      { type: "example", content: { label: "[例]", before: "歩きます", beforeKana: "あるきます", after: [text("歩いた")], afterKana: "あるいた" } }
    ],
    items: [
      taFormItem("l21-p1-a1-q2", "2", "脱ぎます", "脱いだ", "ぬぎます"),
      taFormItem("l21-p1-a1-q3", "3", "急ぎます", "急いだ", "いそぎます"),
      taFormItem("l21-p1-a1-q4", "4", "飲みます", "飲んだ", "のみます"),
      taFormItem("l21-p1-a1-q5", "5", "休みます", "休んだ", "やすみます"),
      taFormItem("l21-p1-a1-q6", "6", "乗ります", "乗った", "のります"),
      taFormItem("l21-p1-a1-q7", "7", "歌います", "歌った", "うたいます"),
      taFormItem("l21-p1-a1-q8", "8", "立ちます", "立った", "たちます"),
      taFormItem("l21-p1-a1-q9", "9", "消します", "消した", "けします"),
      taFormItem("l21-p1-a1-q10", "10", "話します", "話した", "はなします"),
      taFormItem("l21-p1-a1-q11", "11", "浴びます", "浴びた", "あびます"),
      taFormItem("l21-p1-a1-q12", "12", "見ます", "見た", "みます"),
      taFormItem("l21-p1-a1-q13", "13", "考えます", "考えた", "かんがえます"),
      taFormItem("l21-p1-a1-q14", "14", "寝ます", "寝た", "ねます"),
      taFormItem("l21-p1-a1-q15", "15", "忘れます", "忘れた", "わすれます"),
      taFormItem("l21-p1-a1-q16", "16", "始めます", "始めた", "はじめます"),
      taFormItem("l21-p1-a1-q17", "17", "します", "した"),
      taFormItem("l21-p1-a1-q18", "18", "安心します", "安心した", "あんしんします"),
      taFormItem("l21-p1-a1-q19", "19", "運動します", "運動した", "うんどうします"),
      taFormItem("l21-p1-a1-q20", "20", "来ます", "来た", "きます")
    ]
  },
  {
    id: "l21-p1-a2",
    section: "practice_1",
    order: 2,
    title: "边看图边听录音，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: "每题填写两个回答，不需要重写问题。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 2),
      label: "第21课 练习I-2",
      transcript: {
        text: "晩ご飯を食べた後で何をしますか。テレビを見ます。テレビを見る前に何をしますか。晩ご飯を食べます。ジョギングをした後で何をしますか。シャワーを浴びます。シャワーを浴びる前に何をしますか。ジョギングをします。掃除した後で何をしますか。洗濯します。洗濯する前に何をしますか。掃除します。勉強した後で何をしますか。音楽を聞きます。音楽を聞く前に何をしますか。勉強します。",
        source: "manual",
        confidenceNote: "ASR 转写结合图片顺序校对整理。"
      }
    },
    assets: [
      { id: "l21-p1-a2-picture-sequence", kind: "exercise_image", imagePath: exerciseImage("book1_lesson21_1_2.png") }
    ],
    displayAssets: ["l21-p1-a2-picture-sequence"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "シャワーを 浴びます → 寝ます",
          beforeKana: "シャワーを あびます → ねます",
          after: [text("シャワーを 浴びた 後で、何を しますか。——寝ます。\n寝る 前に、何を しますか。——シャワーを 浴びます。")],
          afterKana: "シャワーを あびた あとで、なにを しますか。——ねます。\nねる まえに、なにを しますか。——シャワーを あびます。"
        }
      }
    ],
    items: [
      answerItem("l21-p1-a2-q1", "1", "晩ご飯を 食べます → テレビを 見ます", "テレビを 見ます。\n晩ご飯を 食べます。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: "按录音中的两个问题，依次填写两个回答。", multiline: true, rows: 3, promptKana: "ばんごはんを たべます → テレビを みます" }),
      answerItem("l21-p1-a2-q2", "2", "ジョギングを します → シャワーを 浴びます", "シャワーを 浴びます。\nジョギングを します。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: "按录音中的两个问题，依次填写两个回答。", multiline: true, rows: 3, promptKana: "ジョギングを します → シャワーを あびます" }),
      answerItem("l21-p1-a2-q3", "3", "掃除します → 洗濯します", "洗濯します。\n掃除します。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: "按录音中的两个问题，依次填写两个回答。", multiline: true, rows: 3, promptKana: "そうじします → せんたくします" }),
      answerItem("l21-p1-a2-q4", "4", "勉強します → 音楽を 聞きます", "音楽を 聞きます。\n勉強します。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: "按录音中的两个问题，依次填写两个回答。", multiline: true, rows: 3, promptKana: "べんきょうします → おんがくを ききます" })
    ]
  },
  {
    id: "l21-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [],
    layout: [],
    itemGroups: [
      {
        id: "l21-p1-a3-g1",
        example: {
          label: "[例1]",
          before: "すき焼きを 食べます",
          beforeKana: "すきやきを たべます",
          after: [text("わたしは すき焼きを 食べた ことが あります。")],
          afterKana: "わたしは すきやきを たべた ことが あります。"
        },
        items: [
          answerItem("l21-p1-a3-q1", "1", "中国語を 教えます", "わたしは 中国語を 教えた ことが あります。", { promptKana: "ちゅうごくごを おしえます" }),
          answerItem("l21-p1-a3-q2", "2", "ゴルフを します", "わたしは ゴルフを した ことが あります。"),
          answerItem("l21-p1-a3-q3", "3", "ここに 来ます", "わたしは ここに 来た ことが あります。", { promptKana: "ここに きます" }),
          answerItem("l21-p1-a3-q4", "4", "東京タワーへ 行きます", "わたしは 東京タワーへ 行った ことが あります。", { promptKana: "とうきょうタワーへ いきます" }),
          answerItem("l21-p1-a3-q5", "5", "東京から 横浜まで 歩きます", "わたしは 東京から 横浜まで 歩いた ことが あります。", { promptKana: "とうきょうから よこはままで あるきます" })
        ]
      },
      {
        id: "l21-p1-a3-g2",
        example: {
          label: "[例2]",
          before: "会社が 終わります／飲みに 行きます",
          beforeKana: "かいしゃが おわります／のみに いきます",
          after: [text("会社が 終わった 後で、飲みに 行きます。")],
          afterKana: "かいしゃが おわった あとで、のみに いきます。"
        },
        items: [
          answerItem("l21-p1-a3-q6", "6", "調べます／報告します", "調べた 後で、報告します。", { promptKana: "しらべます／ほうこくします" }),
          answerItem("l21-p1-a3-q7", "7", "家へ 帰ります／電話します", "家へ 帰った 後で、電話します。", { promptKana: "いえへ かえります／でんわします" }),
          answerItem("l21-p1-a3-q8", "8", "子供が 寝ました／ワインを 飲みました", "子供が 寝た 後で、ワインを 飲みました。", { promptKana: "こどもが ねました／ワインを のみました" }),
          answerItem("l21-p1-a3-q9", "9", "映画を 見ました／食事しました", "映画を 見た 後で、食事しました。", { promptKana: "えいがを みました／しょくじしました" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l21-p1-a4",
    section: "practice_1",
    order: 4,
    title: "仿照例句进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [],
    layout: [],
    itemGroups: [
      {
        id: "l21-p1-a4-g1",
        example: {
          label: "[例1]",
          before: "予約します → 予約した ほうが いいですよ。\n食べません → 食べない ほうが いいですよ。",
          beforeKana: "よやくします → よやくした ほうが いいですよ。\nたべません → たべない ほうが いいですよ。",
          after: [text("予約した ほうが いいですよ。\n食べない ほうが いいですよ。")],
          afterKana: "よやくした ほうが いいですよ。\nたべない ほうが いいですよ。"
        },
        items: [
          answerItem("l21-p1-a4-q1", "1", "後で 電話します", "後で 電話した ほうが いいですよ。", { promptKana: "あとで でんわします" }),
          answerItem("l21-p1-a4-q2", "2", "吉田さんに 話します", "吉田さんに 話した ほうが いいですよ。", { promptKana: "よしださんに はなします" }),
          answerItem("l21-p1-a4-q3", "3", "毎晩 お酒を 飲みません", "毎晩 お酒を 飲まない ほうが いいですよ。", { promptKana: "まいばん おさけを のみません" }),
          answerItem("l21-p1-a4-q4", "4", "お風呂に 入りません", "お風呂に 入らない ほうが いいですよ。", { promptKana: "おふろに はいりません" })
        ]
      },
      {
        id: "l21-p1-a4-g2",
        example: {
          label: "[例2]",
          before: "窓を 閉めます",
          beforeKana: "まどを しめます",
          after: [text("窓を 閉めましょうか。")],
          afterKana: "まどを しめましょうか。"
        },
        items: [
          answerItem("l21-p1-a4-q5", "5", "電気を つけます", "電気を つけましょうか。", { promptKana: "でんきを つけます" }),
          answerItem("l21-p1-a4-q6", "6", "テレビを 消します", "テレビを 消しましょうか。", { promptKana: "テレビを けします" }),
          answerItem("l21-p1-a4-q7", "7", "メールアドレスを 書きます", "メールアドレスを 書きましょうか。", { promptKana: "メールアドレスを かきます" }),
          answerItem("l21-p1-a4-q8", "8", "ドアを 開けます", "ドアを 開けましょうか。", { promptKana: "ドアを あけます" }),
          answerItem("l21-p1-a4-q9", "9", "切符を 買います", "切符を 買いましょうか。", { promptKana: "きっぷを かいます" }),
          answerItem("l21-p1-a4-q10", "10", "スミスさんに 連絡します", "スミスさんに 連絡しましょうか。", { promptKana: "スミスさんに れんらくします" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l21-p1-a5",
    section: "practice_1",
    order: 5,
    title: "仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    assets: [],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "大阪へ 行きます（はい／いいえ）",
          beforeKana: "おおさかへ いきます（はい／いいえ）",
          after: [text("甲：大阪へ 行った ことが ありますか。\n乙：はい、あります。／いいえ、ありません。")],
          afterKana: "おおさかへ いった ことが ありますか。\nはい、あります。／いいえ、ありません。"
        }
      }
    ],
    items: [
      dialogueItem("l21-p1-a5-q1", "1", "太極拳を 習います（いいえ）", "甲：太極拳を 習った ことが ありますか。\n乙：いいえ、ありません。", "たいきょくけんを ならいます（いいえ）"),
      dialogueItem("l21-p1-a5-q2", "2", "海で 泳ぎます（いいえ）", "甲：海で 泳いだ ことが ありますか。\n乙：いいえ、ありません。", "うみで およぎます（いいえ）"),
      dialogueItem("l21-p1-a5-q3", "3", "浴衣を 着ます（はい）", "甲：浴衣を 着た ことが ありますか。\n乙：はい、あります。", "ゆかたを きます（はい）"),
      dialogueItem("l21-p1-a5-q4", "4", "富士山に 登ります（はい）", "甲：富士山に 登った ことが ありますか。\n乙：はい、あります。", "ふじさんに のぼります（はい）")
    ]
  },
  {
    id: "l21-p1-a6",
    section: "practice_1",
    order: 6,
    title: "仿照例句替换画线部分进行练习。",
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
          before: "連休です／予約します\n体に よく ないです／タバコを 吸いません",
          beforeKana: "れんきゅうです／よやくします\nからだに よく ないです／タバコを すいません",
          after: [text("連休ですから、予約した ほうが いいです。\n体に よく ないですから、タバコを 吸わない ほうが いいです。")],
          afterKana: "れんきゅうですから、よやくした ほうが いいです。\nからだに よく ないですから、タバコを すわない ほうが いいです。"
        }
      }
    ],
    items: [
      answerItem("l21-p1-a6-q1", "1", "便利です／地図を 買います", "便利ですから、地図を 買った ほうが いいです。", { promptKana: "べんりです／ちずを かいます" }),
      answerItem("l21-p1-a6-q2", "2", "暗いです／電気を つけます", "暗いですから、電気を つけた ほうが いいです。", { promptKana: "くらいです／でんきを つけます" }),
      answerItem("l21-p1-a6-q3", "3", "駐車場が ありません／車で 行きません", "駐車場が ありませんから、車で 行かない ほうが いいです。", { promptKana: "ちゅうしゃじょうが ありません／くるまで いきません" }),
      answerItem("l21-p1-a6-q4", "4", "危ないです／そこを 渡りません", "危ないですから、そこを 渡らない ほうが いいです。", { promptKana: "あぶないです／そこを わたりません" })
    ]
  },
  {
    id: "l21-p2-a1",
    section: "practice_2",
    order: 1,
    title: "从□中选择适当的词语，变成适当的形式填入（　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    assets: [
      { id: "l21-p2-a1-cloze", kind: "exercise_image", imagePath: exerciseImage("book1_lesson21_2_1.png") }
    ],
    displayAssets: ["l21-p2-a1-cloze"],
    layout: [
      { type: "example", content: { label: "[例]", beforeParts: [text("ラジオを（"), blank("example"), text("）ください。")], beforeKana: "ラジオを（______）ください。", after: [text("聞いて")], afterKana: "きいて" } }
    ],
    items: [
      blankItem("l21-p2-a1-q1", "1", [text("歌舞伎を（"), blank("answer"), text("）ことが ありますか。")], { answer: "見た" }, { promptKana: "かぶきを（______）ことが ありますか。", expectedUnit: "conjugated_form" }),
      blankItem("l21-p2-a1-q2", "2", [text("シャワーを（"), blank("answer"), text("）から、プールに 入って ください。")], { answer: "浴びて" }, { promptKana: "シャワーを（______）から、プールに はいって ください。", expectedUnit: "conjugated_form" }),
      blankItem("l21-p2-a1-q3", "3", [text("暗いですね。電気を（"), blank("answer"), text("）ましょうか。")], { answer: "つけ" }, { promptKana: "くらいですね。でんきを（______）ましょうか。", expectedUnit: "conjugated_form" }),
      blankItem("l21-p2-a1-q4", "4", [text("お酒は たくさん（"), blank("answer"), text("）ない ほうが いいです。")], { answer: "飲ま" }, { promptKana: "おさけは たくさん（______）ない ほうが いいです。", expectedUnit: "conjugated_form" }),
      blankItem("l21-p2-a1-q5", "5", [text("ご飯を（"), blank("answer"), text("）後で、部屋を 掃除します。")], { answer: "食べた" }, { promptKana: "ごはんを（______）あとで、へやを そうじします。", expectedUnit: "conjugated_form" })
    ]
  },
  {
    id: "l21-p2-a2",
    section: "practice_2",
    order: 2,
    title: "从□中选择适当的词语，变成适当的形式填入（　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    assets: [],
    layout: [
      { type: "example", content: { label: "[例]", beforeParts: [text("連休ですから、ホテルを 予約（"), blank("example"), text("）ほうが いいです。")], beforeKana: "れんきゅうですから、ホテルを よやく（______）ほうが いいです。", after: [text("した")], afterKana: "した" } },
      { type: "word_bank", words: [text("します"), text("歌います"), text("止めます"), text("話します"), text("入ります"), text("閉めます")] }
    ],
    items: [
      blankItem("l21-p2-a2-q1", "1", [text("外の 音が うるさいですから、窓を（"), blank("answer"), text("）ほうが いいですね。")], { answer: "閉めた" }, { promptKana: "そとの おとが うるさいですから、まどを（______）ほうが いいですね。", expectedUnit: "conjugated_form" }),
      blankItem("l21-p2-a2-q2", "2", [text("のどが 痛いです。——じゃあ、歌を（"), blank("answer"), text("）ほうが いいですよ。")], { answer: "歌わない" }, { promptKana: "のどが いたいです。——じゃあ、うたを（______）ほうが いいですよ。", expectedUnit: "conjugated_form" }),
      blankItem("l21-p2-a2-q3", "3", [text("交差点の 近くですから、ここに 車を（"), blank("answer"), text("）ほうが いいです。")], { answer: "止めない" }, { promptKana: "こうさてんの ちかくですから、ここに くるまを（______）ほうが いいです。", expectedUnit: "conjugated_form" }),
      blankItem("l21-p2-a2-q4", "4", [text("毎日 運動を（"), blank("answer"), text("）ほうが いいです。")], { answer: "した" }, { promptKana: "まいにち うんどうを（______）ほうが いいです。", expectedUnit: "conjugated_form" }),
      blankItem("l21-p2-a2-q5", "5", [text("お酒を 飲んでから、お風呂に（"), blank("answer"), text("）ほうが いいです。")], { answer: "入らない" }, { promptKana: "おさけを のんでから、おふろに（______）ほうが いいです。", expectedUnit: "conjugated_form" }),
      blankItem("l21-p2-a2-q6", "6", [text("田中さんは 中国語が よく 分かりませんから、ゆっくり（"), blank("answer"), text("）ほうが いいです。")], { answer: "話した" }, { promptKana: "たなかさんは ちゅうごくごが よく わかりませんから、ゆっくり（______）ほうが いいです。", expectedUnit: "conjugated_form" })
    ]
  },
  {
    id: "l21-p2-a3",
    section: "practice_2",
    order: 3,
    title: "听录音，与录音内容一致的在（　）中画○，不一致的画×。",
    instruction: "",
    interaction: "true_false",
    answerUnit: "boolean",
    responseScope: "boolean_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "第21课 练习II-3",
      transcript: {
        text: "テニスをした後で、ビールを飲みます。プールへ行って、泳ぐ前にパンを食べます。寝る前に友達に電話をかけます。朝起きてからお風呂に入ります。",
        source: "manual",
        confidenceNote: "ASR 转写结合题图整理。"
      }
    },
    assets: [
      { id: "l21-p2-a3-true-false", kind: "exercise_image", imagePath: exerciseImage("book1_lesson21_2_3.png") }
    ],
    displayAssets: ["l21-p2-a3-true-false"],
    layout: [
      { type: "example", content: { label: "[例]", before: "テニスを した 後で、ビールを 飲みます。", beforeKana: "テニスを した あとで、ビールを のみます。", after: [text("○")], afterKana: "○" } }
    ],
    items: [
      trueFalseItem("l21-p2-a3-q1", "1", "（1）", false),
      trueFalseItem("l21-p2-a3-q2", "2", "（2）", true)
    ]
  },
  {
    id: "l21-p2-a4",
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
      answerItem("l21-p2-a4-q1", "1", "（我）把窗户关上吧。", "窓を 閉めましょうか。", { answerSource: "prompt", acceptableAlternatives: ["窓を 閉めましょう。"] }),
      answerItem("l21-p2-a4-q2", "2", "我吃过日式牛肉火锅。", "わたしは すき焼きを 食べた ことが あります。", { answerSource: "prompt" }),
      answerItem("l21-p2-a4-q3", "3", "还是多吃点蔬菜的好啊。", "もっと 野菜を 食べた ほうが いいですよ。", { answerSource: "prompt", acceptableAlternatives: ["もっと 野菜を 食べた ほうが いいです。"] })
    ]
  }
];

export const lesson21Practice: LessonPractice = {
  lessonId: "lesson21",
  title: "第21课 练习",
  sourcePages: [
    { pageNo: 258, imagePath: page(258) },
    { pageNo: 259, imagePath: page(259) },
    { pageNo: 260, imagePath: page(260) }
  ],
  activities
};
