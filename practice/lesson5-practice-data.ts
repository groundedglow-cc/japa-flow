import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson5/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit2/lesson5/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const sentenceSlot = (placeholder = "输入完整回答"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const shortSlot = (id: string, placeholder = "输入 1 个假名"): InputSlot => ({ id, expectedUnit: "word", width: "short", placeholder });
const mediumSlot = (id: string, placeholder: string): InputSlot => ({ id, expectedUnit: "phrase", width: "medium", placeholder });
const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";

const answerItem = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  answer: string,
  options: {
    promptKana?: string;
    placeholder?: string;
    note?: string;
    answerSource?: "example_transform" | "audio" | "personal";
    responseScope?: PracticeItem["responseScope"];
    responseScopeHint?: string;
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
  inputSlots: sentenceSlot(options.placeholder || "输入完整回答"),
  answer: { slotValues: { answer }, note: options.note }
});

const personalItem = (id: string, number: string, prompt: string, modelAnswers: string[], promptKana: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "personal",
  evaluationMode: "acceptable_answers",
  responseScope: "free_response",
  inputSlots: sentenceSlot("按实际情况作答"),
  answer: {
    modelAnswers,
    note: "按句式校验。可填写与你实际情况一致的答案，只要句型完整即可判对。"
  }
});

const blankItem = (
  id: string,
  number: string,
  prompt: PromptPart[],
  slotIds: string[],
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
  inputSlots: slotIds.map((slotId) => shortSlot(slotId)),
  answer: { slotValues: answers }
});

const gridItem = (id: string, number: string, prompt: string, answer: Record<string, string>, given: string, promptKana: string): PracticeItem => ({
  id,
  number,
  prompt: [text(`提示：${given}`)],
  promptKana,
  instruction: prompt,
  answerSource: "example_transform",
  responseScope: "phrase_only",
  inputSlots: [
    mediumSlot("masu", "～ます"),
    mediumSlot("masen", "～ません"),
    mediumSlot("mashita", "～ました"),
    mediumSlot("masendeshita", "～ませんでした")
  ],
  answer: { slotValues: answer }
});

const activities: PracticeActivity[] = [
  {
    id: "l5-p1-a1",
    section: "practice_1",
    order: 1,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [
      { id: "l5-p1-a1-clock-set", kind: "exercise_image", imagePath: exerciseImage("book1_lesson5_1_1_a.png") },
      { id: "l5-p1-a1-digital-set", kind: "exercise_image", imagePath: exerciseImage("book1_lesson5_1_1_b.png") }
    ],
    layout: [],
    itemGroups: [
      {
        id: "l5-p1-a1-g1",
        displayAssets: ["l5-p1-a1-clock-set"],
        example: {
          id: "l5-p1-a1-ex1",
          label: "[例1]",
          before: "7時",
          beforeKana: "しちじ",
          after: [text("今 "), repl("7時", "time", { kana: "しちじ" }), text("です。")],
          afterKana: "いま しちじです。"
        },
        items: [
          answerItem("l5-p1-a1-q1", "1", "今 何時ですか。", "今 3時30分です。", { promptKana: "いま なんじですか。" }),
          answerItem("l5-p1-a1-q2", "2", "今 何時ですか。", "今 5時10分です。", { promptKana: "いま なんじですか。" }),
          answerItem("l5-p1-a1-q3", "3", "今 何時ですか。", "今 9時20分です。", { promptKana: "いま なんじですか。" }),
          answerItem("l5-p1-a1-q4", "4", "今 何時ですか。", "今 12時40分です。", { promptKana: "いま なんじですか。" })
        ]
      },
      {
        id: "l5-p1-a1-g2",
        displayAssets: ["l5-p1-a1-digital-set"],
        example: {
          id: "l5-p1-a1-ex2",
          label: "[例2]",
          after: [text("今 何時ですか。 午前 "), repl("7時35分", "time", { kana: "しちじさんじゅうごふん" }), text("です。")],
          afterKana: "いま なんじですか。 ごぜん しちじさんじゅうごふんです。"
        },
        items: [
          answerItem("l5-p1-a1-q5", "5", "今 何時ですか。", "午前9時15分です。", { promptKana: "いま なんじですか。" }),
          answerItem("l5-p1-a1-q6", "6", "今 何時ですか。", "午前10時50分です。", { promptKana: "いま なんじですか。" }),
          answerItem("l5-p1-a1-q7", "7", "今 何時ですか。", "午後4時45分です。", { promptKana: "いま なんじですか。" }),
          answerItem("l5-p1-a1-q8", "8", "今 何時ですか。", "午前6時5分です。", { promptKana: "いま なんじですか。" }),
          answerItem("l5-p1-a1-q9", "9", "今 何時ですか。", "午後11時25分です。", { promptKana: "いま なんじですか。" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l5-p1-a2",
    section: "practice_1",
    order: 2,
    title: "先完成下面的活用表，然后听录音练习。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 2),
      label: "第5课 练习I-2",
      transcript: {
        text: "起きます。起きません。起きました。起きませんでした。寝ます。寝ません。寝ました。寝ませんでした。働きます。働きません。働きました。働きませんでした。休みます。休みません。休みました。休みませんでした。勉強します。勉強しません。勉強しました。勉強しませんでした。",
        source: "manual",
        segments: [
          { itemNumber: "1", text: "起きます。起きません。起きました。起きませんでした。" },
          { itemNumber: "2", text: "寝ます。寝ません。寝ました。寝ませんでした。" },
          { itemNumber: "3", text: "働きます。働きません。働きました。働きませんでした。" },
          { itemNumber: "4", text: "休みます。休みません。休みました。休みませんでした。" },
          { itemNumber: "5", text: "勉強します。勉強しません。勉強しました。勉強しませんでした。" }
        ]
      }
    },
    layout: [],
    items: [
      gridItem("l5-p1-a2-q1", "1", "补全起きます的活用。", { masu: "起きます", masen: "起きません", mashita: "起きました", masendeshita: "起きませんでした" }, "起きます", "おきます"),
      gridItem("l5-p1-a2-q2", "2", "补全寝ます的活用。", { masu: "寝ます", masen: "寝ません", mashita: "寝ました", masendeshita: "寝ませんでした" }, "寝ました", "ねました"),
      gridItem("l5-p1-a2-q3", "3", "补全働きます的活用。", { masu: "働きます", masen: "働きません", mashita: "働きました", masendeshita: "働きませんでした" }, "働きませんでした", "はたらきませんでした"),
      gridItem("l5-p1-a2-q4", "4", "补全休みます的活用。", { masu: "休みます", masen: "休みません", mashita: "休みました", masendeshita: "休みませんでした" }, "休みません", "やすみません"),
      gridItem("l5-p1-a2-q5", "5", "补全勉強します的活用。", { masu: "勉強します", masen: "勉強しません", mashita: "勉強しました", masendeshita: "勉強しませんでした" }, "勉強します", "べんきょうします")
    ]
  },
  {
    id: "l5-p1-a3",
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
        id: "l5-p1-a3-g1",
        example: {
          id: "l5-p1-a3-ex1",
          label: "[例1]",
          before: "毎日／7時／起きます",
          beforeKana: "まいにち／しちじ／おきます",
          after: [text("森さんは "), repl("毎日", "when", { kana: "まいにち" }), text(" "), repl("7時", "time", { kana: "しちじ" }), text("に "), repl("起きます", "verb", { kana: "おきます" }), text("。")],
          afterKana: "もりさんは まいにち しちじに おきます。"
        },
        items: [
          answerItem("l5-p1-a3-q1", "1", "毎晩／12時半／寝ます", "森さんは 毎晩 12時半に 寝ます。", { promptKana: "まいばん／じゅうにじはん／ねます" }),
          answerItem("l5-p1-a3-q2", "2", "来週／日曜日／働きます", "森さんは 来週 日曜日に 働きます。", { promptKana: "らいしゅう／にちようび／はたらきます" }),
          answerItem("l5-p1-a3-q3", "3", "さ来週／金曜日／休みます", "森さんは さ来週 金曜日に 休みます。", { promptKana: "さらいしゅう／きんようび／やすみます" })
        ]
      },
      {
        id: "l5-p1-a3-g2",
        example: {
          id: "l5-p1-a3-ex2",
          label: "[例2]",
          before: "明日／休みます",
          beforeKana: "あした／やすみます",
          after: [text("李さんは "), repl("明日", "when", { kana: "あした" }), text(" "), repl("休みません", "verb", { kana: "やすみません" }), text("。")],
          afterKana: "りさんは あした やすみません。"
        },
        items: [
          answerItem("l5-p1-a3-q4", "4", "今日／休みます", "李さんは 今日 休みません。", { promptKana: "きょう／やすみます" }),
          answerItem("l5-p1-a3-q5", "5", "明日の夜／働きます", "李さんは 明日の夜 働きません。", { promptKana: "あしたのよる／はたらきます" }),
          answerItem("l5-p1-a3-q6", "6", "あさって／勉強します", "李さんは あさって 勉強しません。", { promptKana: "あさって／べんきょうします" })
        ]
      },
      {
        id: "l5-p1-a3-g3",
        example: {
          id: "l5-p1-a3-ex3",
          label: "[例3]",
          before: "昨日／働きます",
          beforeKana: "きのう／はたらきます",
          after: [text("小野さんは "), repl("昨日", "when", { kana: "きのう" }), text(" "), repl("働きました", "verb", { kana: "はたらきました" }), text("。")],
          afterKana: "おのさんは きのう はたらきました。"
        },
        items: [
          answerItem("l5-p1-a3-q7", "7", "先週／休みます", "小野さんは 先週 休みました。", { promptKana: "せんしゅう／やすみます" }),
          answerItem("l5-p1-a3-q8", "8", "今朝 9時に／起きます", "小野さんは 今朝 9時に 起きました。", { promptKana: "けさ くじに／おきます" }),
          answerItem("l5-p1-a3-q9", "9", "昨日の夜 2時に／寝ます", "小野さんは 昨日の夜 2時に 寝ました。", { promptKana: "きのうのよる にじに／ねます" })
        ]
      },
      {
        id: "l5-p1-a3-g4",
        example: {
          id: "l5-p1-a3-ex4",
          label: "[例4]",
          before: "田中／働きます",
          beforeKana: "たなか／はたらきます",
          after: [text("田中さんは "), repl("昨日", "when", { kana: "きのう" }), text(" "), repl("働きませんでした", "verb", { kana: "はたらきませんでした" }), text("。")],
          afterKana: "たなかさんは きのう はたらきませんでした。"
        },
        items: [
          answerItem("l5-p1-a3-q10", "10", "森／休みます", "森さんは 昨日 休みませんでした。", { promptKana: "もり／やすみます" }),
          answerItem("l5-p1-a3-q11", "11", "李／勉強します", "李さんは 昨日 勉強しませんでした。", { promptKana: "り／べんきょうします" }),
          answerItem("l5-p1-a3-q12", "12", "小野／11時に／寝ます", "小野さんは 昨日 11時に 寝ませんでした。", { promptKana: "おの／じゅういちじに／ねます" })
        ]
      },
      {
        id: "l5-p1-a3-g5",
        example: {
          id: "l5-p1-a3-ex5",
          label: "[例5]",
          before: "月曜日／金曜日／働きます",
          beforeKana: "げつようび／きんようび／はたらきます",
          after: [text("張さんは "), repl("月曜日", "from", { kana: "げつようび" }), text("から "), repl("金曜日", "to", { kana: "きんようび" }), text("まで "), repl("働きます", "verb", { kana: "はたらきます" }), text("。")],
          afterKana: "ちょうさんは げつようびから きんようびまで はたらきます。"
        },
        items: [
          answerItem("l5-p1-a3-q13", "13", "明日／木曜日／休みます", "張さんは 明日から 木曜日まで 休みます。", { promptKana: "あした／もくようび／やすみます" }),
          answerItem("l5-p1-a3-q14", "14", "9時半／12時半／勉強します", "張さんは 9時半から 12時半まで 勉強します。", { promptKana: "くじはん／じゅうにじはん／べんきょうします" }),
          answerItem("l5-p1-a3-q15", "15", "11時／今朝 7時／寝ました", "張さんは 11時から 今朝 7時まで 寝ました。", { promptKana: "じゅういちじ／けさ しちじ／ねました" }),
          answerItem("l5-p1-a3-q16", "16", "昨日 午後1時／5時／働きました", "張さんは 昨日 午後1時から 5時まで 働きました。", { promptKana: "きのう ごごいちじ／ごじ／はたらきました" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l5-p1-a4",
    section: "practice_1",
    order: 4,
    title: "仿照例句回答提问。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    layout: [],
    itemGroups: [
      {
        id: "l5-p1-a4-g1",
        example: {
          id: "l5-p1-a4-ex1",
          label: "[例1]",
          before: "田中さん、昨日 働きましたか。",
          beforeKana: "たなかさん、きのう はたらきましたか。",
          after: [text("はい、働きました。／いいえ、働きませんでした。")],
          afterKana: "はい、はたらきました。／いいえ、はたらきませんでした。"
        },
        items: [
          answerItem("l5-p1-a4-q1", "1", "吉田さん、来週の日曜日 働きますか。", "いいえ、働きません。", { promptKana: "よしださん、らいしゅうのにちようび はたらきますか。" }),
          answerItem("l5-p1-a4-q2", "2", "李さん、おととい 休みましたか。", "はい、休みました。", { promptKana: "りさん、おととい やすみましたか。" }),
          answerItem("l5-p1-a4-q3", "3", "小野さん、昨日の朝 6時に 起きましたか。", "いいえ、起きませんでした。", { promptKana: "おのさん、きのうのあさ ろくじに おきましたか。" }),
          answerItem("l5-p1-a4-q4", "4", "張さん、今晩 勉強しますか。", "はい、勉強します。", { promptKana: "ちょうさん、こんばん べんきょうしますか。" })
        ]
      },
      {
        id: "l5-p1-a4-g2",
        example: {
          id: "l5-p1-a4-ex2",
          label: "[例2]",
          before: "李さん、今朝 何時に 起きましたか。",
          beforeKana: "りさん、けさ なんじに おきましたか。",
          after: [text("6時半に 起きました。")],
          afterKana: "ろくじはんに おきました。"
        },
        items: [
          answerItem("l5-p1-a4-q5", "5", "森さん、仕事は 何時に 終わりますか。", "5時に 終わります。", { promptKana: "もりさん、しごとは なんじに おわりますか。" }),
          answerItem("l5-p1-a4-q6", "6", "小野さん、金曜日、何時まで 働きましたか。", "7時30分まで 働きました。", { promptKana: "おのさん、きんようび、なんじまで はたらきましたか。" }),
          answerItem("l5-p1-a4-q7", "7", "張さん、学校は 何時から 始まりますか。", "9時から 始まります。", { promptKana: "ちょうさん、がっこうは なんじから はじまりますか。" }),
          answerItem("l5-p1-a4-q8", "8", "スミスさん、先週 何曜日から 何曜日まで 休みましたか。", "先週 月曜日から 水曜日まで 休みました。", { promptKana: "スミスさん、せんしゅう なんようびから なんようびまで やすみましたか。" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l5-p1-a5",
    section: "practice_1",
    order: 5,
    title: "仿照例句回答提问。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "試験は いつですか。",
          beforeKana: "しけんは いつですか。",
          after: [text("木曜日です。")],
          afterKana: "もくようびです。"
        }
      }
    ],
    items: [
      answerItem("l5-p1-a5-q1", "1", "出張は いつですか。", "金曜日です。", { promptKana: "しゅっちょうは いつですか。" }),
      answerItem("l5-p1-a5-q2", "2", "パーティーは いつですか。", "来週の 土曜日です。", { promptKana: "パーティーは いつですか。" }),
      answerItem("l5-p1-a5-q3", "3", "研修は いつからですか。", "今週の 水曜日からです。", { promptKana: "けんしゅうは いつからですか。" }),
      answerItem("l5-p1-a5-q4", "4", "休みは いつまでですか。", "来週の 火曜日までです。", { promptKana: "やすみは いつまでですか。" }),
      answerItem("l5-p1-a5-q5", "5", "旅行は いつから いつまでですか。", "今週の 水曜日から 来週の 火曜日までです。", { promptKana: "りょこうは いつから いつまでですか。" })
    ]
  },
  {
    id: "l5-p1-a6",
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
      label: "第5课 练习I-6",
      transcript: {
        text: "今日、9時から5時まで働きますか。はい、今日、9時から5時まで働きます。毎朝7時に起きますか。はい、毎朝7時に起きます。昨日の夜10時に寝ましたか。いいえ、昨日の夜10時に寝ませんでした。毎週月曜日から土曜日まで働きますか。はい、毎週月曜日から土曜日まで働きます。今晩8時から勉強しますか。はい、今晩8時から勉強します。今朝5時に起きましたか。はい、今朝5時に起きました。",
        source: "manual",
        confidenceNote: "ASR 只稳定识别到前 3 题，后 3 题按教材给定词组和同一问答模式补全。",
        segments: [
          { itemNumber: "1", text: "毎朝7時に起きますか。はい、毎朝7時に起きます。" },
          { itemNumber: "2", text: "昨日の夜10時に寝ましたか。いいえ、昨日の夜10時に寝ませんでした。" },
          { itemNumber: "3", text: "毎週月曜日から土曜日まで働きますか。はい、毎週月曜日から土曜日まで働きます。" },
          { itemNumber: "4", text: "今晩8時から勉強しますか。はい、今晩8時から勉強します。" },
          { itemNumber: "5", text: "今朝5時に起きましたか。はい、今朝5時に起きました。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "今日／9時～5時／働きます（はい）",
          beforeKana: "きょう／くじ～ごじ／はたらきます（はい）",
          after: [text("今日、9時から 5時まで 働きますか。 はい、今日、9時から 5時まで 働きます。")],
          afterKana: "きょう、くじから ごじまで はたらきますか。 はい、きょう、くじから ごじまで はたらきます。"
        }
      }
    ],
    items: [
      answerItem("l5-p1-a6-q1", "1", "听录音并回答。", "はい、毎朝 7時に 起きます。", { answerSource: "audio" }),
      answerItem("l5-p1-a6-q2", "2", "听录音并回答。", "いいえ、昨日の夜 10時に 寝ませんでした。", { answerSource: "audio" }),
      answerItem("l5-p1-a6-q3", "3", "听录音并回答。", "はい、毎週 月曜日から 土曜日まで 働きます。", { answerSource: "audio", note: "ASR 后半段漏识别，答案按教材词组和同一问答模式补全。" }),
      answerItem("l5-p1-a6-q4", "4", "听录音并回答。", "はい、今晩 8時から 勉強します。", { answerSource: "audio", note: "ASR 后半段漏识别，答案按教材词组和同一问答模式补全。" }),
      answerItem("l5-p1-a6-q5", "5", "听录音并回答。", "はい、今朝 5時に 起きました。", { answerSource: "audio", note: "ASR 后半段漏识别，答案按教材词组和同一问答模式补全。" })
    ]
  },
  {
    id: "l5-p2-a1",
    section: "practice_2",
    order: 1,
    title: "在（　）中填入一个平假名，不需要的画×。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [],
    items: [
      blankItem("l5-p2-a1-q1", "1", [text("今 何時 "), blank("a1"), text(" です "), blank("a2"), text("。")], ["a1", "a2"], { a1: "×", a2: "か" }, "いま なんじ （  ） です （  ）。"),
      blankItem("l5-p2-a1-q2", "2", [text("昨日は 何時 "), blank("a1"), text(" 起きましたか。")], ["a1"], { a1: "に" }, "きのうは なんじ （  ） おきましたか。"),
      blankItem("l5-p2-a1-q3", "3", [text("小野さんは、毎日 "), blank("a1"), text(" 9時 "), blank("a2"), blank("a3"), text(" 5時 "), blank("a4"), blank("a5"), text(" 働きます。")], ["a1", "a2", "a3", "a4", "a5"], { a1: "×", a2: "か", a3: "ら", a4: "ま", a5: "で" }, "おのさんは、まいにち （  ） くじ （  ）（  ） ごじ （  ）（  ） はたらきます。"),
      blankItem("l5-p2-a1-q4", "4", [text("試験は いつ "), blank("a1"), text(" ですか。")], ["a1"], { a1: "×" }, "しけんは いつ （  ） ですか。"),
      blankItem("l5-p2-a1-q5", "5", [text("李さんは 先週 "), blank("a1"), text(" 土曜日 休みませんでした。")], ["a1"], { a1: "の" }, "りさんは せんしゅう （  ） どようび やすみませんでした。")
    ]
  },
  {
    id: "l5-p2-a2",
    section: "practice_2",
    order: 2,
    title: "边看日历边听录音，回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 2),
      label: "第5课 练习II-2",
      transcript: {
        text: "出張はいつからですか。来週の水曜日からです。研修はいつまでですか。今週の月曜日までです。休みはいつから何曜日までですか。今週の水曜日から土曜日までです。旅行はいつからいつまでですか。来週の土曜日からさ来週の月曜日までです。パーティーはいつですか。さ来週の金曜日です。",
        source: "manual",
        confidenceNote: "ASR 能识别问题骨架，具体日期按日历图补全。",
        segments: [
          { itemNumber: "1", text: "出張はいつからですか。来週の水曜日からです。" },
          { itemNumber: "2", text: "研修はいつまでですか。今週の月曜日までです。" },
          { itemNumber: "3", text: "休みはいつから何曜日までですか。今週の水曜日から土曜日までです。" },
          { itemNumber: "4", text: "旅行はいつからいつまでですか。来週の土曜日からさ来週の月曜日までです。" },
          { itemNumber: "5", text: "パーティーはいつですか。さ来週の金曜日です。" }
        ]
      }
    },
    assets: [
      { id: "l5-p2-a2-calendar", kind: "exercise_image", imagePath: exerciseImage("book1_lesson5_2_2.png") }
    ],
    displayAssets: ["l5-p2-a2-calendar"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "試験は いつですか。",
          beforeKana: "しけんは いつですか。",
          after: [text("今週の 火曜日です。")],
          afterKana: "こんしゅうの かようびです。"
        }
      }
    ],
    items: [
      answerItem("l5-p2-a2-q1", "1", "听录音并回答。", "来週の 水曜日からです。", { answerSource: "audio", note: "日期根据日历图补全。" }),
      answerItem("l5-p2-a2-q2", "2", "听录音并回答。", "今週の 月曜日までです。", { answerSource: "audio", note: "日期根据日历图补全。" }),
      answerItem("l5-p2-a2-q3", "3", "听录音并回答。", "今週の 水曜日から 土曜日までです。", { answerSource: "audio", note: "日期根据日历图补全。" }),
      answerItem("l5-p2-a2-q4", "4", "听录音并回答。", "来週の 土曜日から さ来週の 月曜日までです。", { answerSource: "audio", note: "日期根据日历图补全。" }),
      answerItem("l5-p2-a2-q5", "5", "听录音并回答。", "さ来週の 金曜日です。", { answerSource: "audio", note: "日期根据日历图补全。" })
    ]
  },
  {
    id: "l5-p2-a3",
    section: "practice_2",
    order: 3,
    title: "回答提问。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "free_text",
    responseScope: "free_response",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "今日は 日曜日ですか。",
          beforeKana: "きょうは にちようびですか。",
          after: [text("はい、そうです。／いいえ、ちがいます。")],
          afterKana: "はい、そうです。／いいえ、ちがいます。"
        }
      }
    ],
    items: [
      personalItem("l5-p2-a3-q1", "1", "中国は 今 何時ですか。", ["中国は 今 〜時です。"], "ちゅうごくは いま なんじですか。"),
      personalItem("l5-p2-a3-q2", "2", "（あなたは）今朝 何時に 起きましたか。", ["今朝 〜時に 起きました。"], "（あなたは）けさ なんじに おきましたか。"),
      personalItem("l5-p2-a3-q3", "3", "（あなたは）何曜日から 何曜日まで 働きますか。", ["〜曜日から 〜曜日まで 働きます。"], "（あなたは）なんようびから なんようびまで はたらきますか。"),
      personalItem("l5-p2-a3-q4", "4", "（あなたは）昨日の晩 何時から 何時まで 勉強しましたか。", ["昨日の晩 〜時から 〜時まで 勉強しました。"], "（あなたは）きのうのばん なんじから なんじまで べんきょうしましたか。")
    ]
  },
  {
    id: "l5-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l5-p2-a4-q1", "1", "森老师 7 点起床。", "森先生は 7時に 起きます。"),
      answerItem("l5-p2-a4-q2", "2", "我昨天没上班。", "わたしは 昨日 働きませんでした。"),
      answerItem("l5-p2-a4-q3", "3", "森老师昨天从 9 点工作到 6 点。", "森先生は 昨日 9時から 6時まで 働きました。")
    ]
  }
];

export const lesson5Practice: LessonPractice = {
  lessonId: "lesson5",
  title: "第5課 森さんは 7時に 起きます",
  sourcePages: [
    { pageNo: 74, imagePath: page(74) },
    { pageNo: 75, imagePath: page(75) },
    { pageNo: 76, imagePath: page(76) }
  ],
  activities
};
