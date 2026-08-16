import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson7/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit2/lesson7/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
const sentenceSlot = (placeholder = "输入完整回答"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const dialogueSlot = (placeholder = "输入完整对话"): InputSlot[] => [{ id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows: 4, placeholder }];
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
    note?: string;
    multiline?: boolean;
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
  inputSlots: options.multiline
    ? [{ id: "answer", expectedUnit: "sentence", width: "long", multiline: true, rows: 4, placeholder: options.placeholder || "输入完整回答" }]
    : sentenceSlot(options.placeholder || "输入完整回答"),
  answer: { slotValues: { answer }, note: options.note }
});

const dialogueItem = (
  id: string,
  number: string,
  prompt: string,
  answer: string,
  promptKana?: string,
  answerSource: PracticeItem["answerSource"] = "example_transform"
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource,
  responseScope: "dialogue_only",
  inputSlots: dialogueSlot(),
  answer: { slotValues: { answer } }
});

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
    note?: string;
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
  answer: { slotValues: answers, note: options.note }
});

const choiceItem = (
  id: string,
  number: string,
  prompt: string,
  choices: { id: string; label: string }[],
  answerChoiceId: string,
  promptKana?: string
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "audio",
  responseScope: "choice_only",
  choices,
  answer: { choiceIds: [answerChoiceId] }
});

const actionPairItem = (
  id: string,
  number: string,
  prompt: string,
  affirmative: string,
  negative: string,
  promptKana?: string
): PracticeItem => slotItem(
  id,
  number,
  prompt,
  [
    { id: "affirmative", expectedUnit: "sentence", width: "long", placeholder: "例1 肯定句" },
    { id: "negative", expectedUnit: "sentence", width: "long", placeholder: "例2 否定句" }
  ],
  { affirmative, negative },
  {
    promptKana,
    answerSource: "example_transform",
    responseScope: "custom",
    responseScopeHint: "按例1写肯定句，再按例2写否定句。"
  }
);

const activities: PracticeActivity[] = [
  {
    id: "l7-p1-a1",
    section: "practice_1",
    order: 1,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: "按例1写肯定句，再按例2写否定句。",
    assets: [
      { id: "l7-p1-a1-action-cards", kind: "exercise_image", imagePath: exerciseImage("book1_lesson7_1_1.png") }
    ],
    displayAssets: ["l7-p1-a1-action-cards"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例1]",
          before: "リンゴ／食べます",
          beforeKana: "リンゴ／たべます",
          after: [repl("リンゴ", "object"), text("を "), repl("食べます", "verb", { kana: "たべます" }), text("。")],
          afterKana: "リンゴを たべます。"
        }
      },
      {
        type: "example",
        content: {
          label: "[例2]",
          before: "リンゴ／食べます",
          beforeKana: "リンゴ／たべます",
          after: [repl("リンゴ", "object"), text("を "), repl("食べません", "verb", { kana: "たべません" }), text("。")],
          afterKana: "リンゴを たべません。"
        }
      }
    ],
    items: [
      actionPairItem("l7-p1-a1-q1", "1", "コーヒー／飲みます", "コーヒーを 飲みます。", "コーヒーを 飲みません。", "コーヒー／のみます"),
      actionPairItem("l7-p1-a1-q2", "2", "手紙／書きます", "手紙を 書きます。", "手紙を 書きません。", "てがみ／かきます"),
      actionPairItem("l7-p1-a1-q3", "3", "本／読みます", "本を 読みます。", "本を 読みません。", "ほん／よみます"),
      actionPairItem("l7-p1-a1-q4", "4", "CD／聞きます", "CDを 聞きます。", "CDを 聞きません。", "シーディー／ききます"),
      actionPairItem("l7-p1-a1-q5", "5", "映画／見ます", "映画を 見ます。", "映画を 見ません。", "えいが／みます")
    ]
  },
  {
    id: "l7-p1-a2",
    section: "practice_1",
    order: 2,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    itemGroups: [
      {
        id: "l7-p1-a2-g1",
        example: {
          id: "l7-p1-a2-ex1",
          label: "[例1]",
          before: "家／パン／食べます",
          beforeKana: "いえ／パン／たべます",
          after: [text("李さんは "), repl("家", "place", { kana: "いえ" }), text("で "), repl("パン", "object"), text("を "), repl("食べました", "verb", { kana: "たべました" }), text("。")],
          afterKana: "りさんは いえで パンを たべました。"
        },
        items: [
          answerItem("l7-p1-a2-q1", "1", "喫茶店／コーヒー／飲みます", "李さんは 喫茶店で コーヒーを 飲みました。", { promptKana: "きっさてん／コーヒー／のみます" }),
          answerItem("l7-p1-a2-q2", "2", "電車の中／新聞／読みます", "李さんは 電車の中で 新聞を 読みました。", { promptKana: "でんしゃのなか／しんぶん／よみます" }),
          answerItem("l7-p1-a2-q3", "3", "本屋／地図／買います", "李さんは 本屋で 地図を 買いました。", { promptKana: "ほんや／ちず／かいます" }),
          answerItem("l7-p1-a2-q4", "4", "公園／テニス／します", "李さんは 公園で テニスを しました。", { promptKana: "こうえん／テニス／します" })
        ]
      },
      {
        id: "l7-p1-a2-g2",
        example: {
          id: "l7-p1-a2-ex2",
          label: "[例2]",
          before: "毎朝 何を 食べますか。（パン／お粥）",
          beforeKana: "まいあさ なにを たべますか。（パン／おかゆ）",
          after: [repl("パン", "first"), text("か "), repl("お粥", "second", { kana: "おかゆ" }), text("を 食べます。")],
          afterKana: "パンか おかゆを たべます。"
        },
        items: [
          answerItem("l7-p1-a2-q5", "5", "今日 何時まで 働きますか。（5時／6時）", "5時か 6時まで 働きます。", {
            promptKana: "きょう なんじまで はたらきますか。（ごじ／ろくじ）",
            responseScope: "answer_only",
            responseScopeHint: answerOnlyHint
          }),
          answerItem("l7-p1-a2-q6", "6", "日曜日 何を しますか。（サッカー／野球）", "サッカーか 野球を します。", {
            promptKana: "にちようび なにを しますか。（サッカー／やきゅう）",
            responseScope: "answer_only",
            responseScopeHint: answerOnlyHint
          })
        ]
      }
    ],
    items: []
  },
  {
    id: "l7-p1-a3",
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
      label: "第7课 练习I-3",
      transcript: {
        text: "毎朝 コーヒーを 飲みますか。いいえ。いいえ、飲みません。今日、手紙を 書きますか。はい。はい、書きます。昨日、映画を 見ましたか。いいえ。いいえ、見ませんでした。今晩、CDを 聞きますか。いいえ。いいえ、聞きません。昨日の 新聞を 読みましたか。はい。はい、読みました。先週 テニスを しましたか。いいえ。いいえ、しませんでした。昨日 何を 買いましたか。辞書。辞書を 買いました。昨日 何を 買いましたか。パソコン。パソコンを 買いました。毎朝 何を 飲みますか。何も。何も 飲みません。毎晩 何を 聞きますか。CD。CDを 聞きます。日曜日 何を しましたか。何も。何も しませんでした。昨日の朝 何を 食べましたか。パンと 卵。パンと 卵を 食べました。",
        source: "manual",
        confidenceNote: "Azure STT 分段识别后按教材题面和例句校正。",
        segments: [
          { itemNumber: "1", text: "今日、手紙を 書きますか。はい、書きます。" },
          { itemNumber: "2", text: "昨日、映画を 見ましたか。いいえ、見ませんでした。" },
          { itemNumber: "3", text: "今晩、CDを 聞きますか。いいえ、聞きません。" },
          { itemNumber: "4", text: "昨日の 新聞を 読みましたか。はい、読みました。" },
          { itemNumber: "5", text: "先週 テニスを しましたか。いいえ、しませんでした。" },
          { itemNumber: "6", text: "昨日 何を 買いましたか。パソコンを 買いました。" },
          { itemNumber: "7", text: "毎朝 何を 飲みますか。何も 飲みません。" },
          { itemNumber: "8", text: "毎晩 何を 聞きますか。CDを 聞きます。" },
          { itemNumber: "9", text: "日曜日 何を しましたか。何も しませんでした。" },
          { itemNumber: "10", text: "昨日の朝 何を 食べましたか。パンと 卵を 食べました。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例1]",
          before: "毎朝 コーヒーを 飲みますか。（いいえ）",
          beforeKana: "まいあさ コーヒーを のみますか。（いいえ）",
          after: [text("いいえ、飲みません。")],
          afterKana: "いいえ、のみません。"
        }
      },
      {
        type: "example",
        content: {
          label: "[例2]",
          before: "昨日 何を 買いましたか。（辞書）",
          beforeKana: "きのう なにを かいましたか。（じしょ）",
          after: [text("辞書を 買いました。")],
          afterKana: "じしょを かいました。"
        }
      }
    ],
    items: [
      answerItem("l7-p1-a3-q1", "1", "今日、手紙を 書きますか。（はい）", "はい、書きます。", { promptKana: "きょう、てがみを かきますか。（はい）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l7-p1-a3-q2", "2", "昨日、映画を 見ましたか。（いいえ）", "いいえ、見ませんでした。", { promptKana: "きのう、えいがを みましたか。（いいえ）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l7-p1-a3-q3", "3", "今晩、CDを 聞きますか。（いいえ）", "いいえ、聞きません。", { promptKana: "こんばん、シーディーを ききますか。（いいえ）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l7-p1-a3-q4", "4", "昨日の 新聞を 読みましたか。（はい）", "はい、読みました。", { promptKana: "きのうの しんぶんを よみましたか。（はい）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l7-p1-a3-q5", "5", "先週 テニスを しましたか。（いいえ）", "いいえ、しませんでした。", { promptKana: "せんしゅう テニスを しましたか。（いいえ）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l7-p1-a3-q6", "6", "昨日 何を 買いましたか。（パソコン）", "パソコンを 買いました。", { promptKana: "きのう なにを かいましたか。（パソコン）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l7-p1-a3-q7", "7", "毎朝 何を 飲みますか。（何も）", "何も 飲みません。", { promptKana: "まいあさ なにを のみますか。（なにも）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l7-p1-a3-q8", "8", "毎晩 何を 聞きますか。（CD）", "CDを 聞きます。", { promptKana: "まいばん なにを ききますか。（シーディー）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l7-p1-a3-q9", "9", "日曜日 何を しましたか。（何も）", "何も しませんでした。", { promptKana: "にちようび なにを しましたか。（なにも）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l7-p1-a3-q10", "10", "昨日の朝 何を 食べましたか。（パンと 卵）", "パンと 卵を 食べました。", { promptKana: "きのうのあさ なにを たべましたか。（パンと たまご）", answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint })
    ]
  },
  {
    id: "l7-p1-a4",
    section: "practice_1",
    order: 4,
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
          before: "デパート／靴を 買います",
          beforeKana: "デパート／くつを かいます",
          after: [text("甲：先週の 日曜日 何を しましたか。 乙：デパートへ 行きました。 甲：デパートで 何を しましたか。 乙：靴を 買いました。")],
          afterKana: "こう：せんしゅうの にちようび なにを しましたか。 おつ：デパートへ いきました。 こう：デパートで なにを しましたか。 おつ：くつを かいました。"
        }
      }
    ],
    items: [
      dialogueItem("l7-p1-a4-q1", "1", "動物園／パンダを 見ます", "甲：先週の 日曜日 何を しましたか。\n乙：動物園へ 行きました。\n甲：動物園で 何を しましたか。\n乙：パンダを 見ました。", "どうぶつえん／パンダを みます"),
      dialogueItem("l7-p1-a4-q2", "2", "友達の家／パーティーを します", "甲：先週の 日曜日 何を しましたか。\n乙：友達の家へ 行きました。\n甲：友達の家で 何を しましたか。\n乙：パーティーを しました。", "ともだちのいえ／パーティーを します")
    ]
  },
  {
    id: "l7-p1-a5",
    section: "practice_1",
    order: 5,
    title: "先看图并仿照例句进行练习。然后听录音，确认对错。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: "按图和录音写出这一人的完整一天。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 5),
      label: "第7课 练习I-5",
      transcript: {
        text: "小野さんの 一日です。小野さんは 今日 会社へ 行きませんでした。午前中 部屋を 掃除しました。午後 公園で 写真を 撮りました。夜 手紙を 書きました。10時から 11時まで 音楽を 聞きました。李さんの 一日です。李さんは 今朝 6時に 起きました。9時から 5時まで 働きました。本屋で 本を 買いました。夜 テレビを 見ませんでした。11時に 寝ました。張さんの 一日です。昨日の 日曜日、8時に 起きました。午前中 日本語を 勉強しませんでした。午後 友達と サッカーを しました。夜 テレビを 見ました。11時半に 寝ました。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按教材图片和例句校正。",
        segments: [
          { itemNumber: "1", text: "李さんは 今朝 6時に 起きました。9時から 5時まで 働きました。本屋で 本を 買いました。夜 テレビを 見ませんでした。11時に 寝ました。" },
          { itemNumber: "2", text: "張さんは 昨日の 日曜日 8時に 起きました。午前中 日本語を 勉強しませんでした。午後 友達と サッカーを しました。夜 テレビを 見ました。11時半に 寝ました。" }
        ]
      }
    },
    assets: [
      { id: "l7-p1-a5-daily-schedules", kind: "exercise_image", imagePath: exerciseImage("book1_lesson7_1_5.png") }
    ],
    displayAssets: ["l7-p1-a5-daily-schedules"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "小野さんの 1日です。",
          beforeKana: "おのさんの いちにちです。",
          after: [text("小野さんは 今日 会社へ 行きませんでした。午前中 部屋を 掃除しました。午後 公園で 写真を 撮りました。夜 手紙を 書きました。10時から 11時まで 音楽を 聞きました。")],
          afterKana: "おのさんは きょう かいしゃへ いきませんでした。ごぜんちゅう へやを そうじしました。ごご こうえんで しゃしんを とりました。よる てがみを かきました。じゅうじから じゅういちじまで おんがくを ききました。"
        }
      }
    ],
    items: [
      answerItem("l7-p1-a5-q1", "1", "李さんの 1日です。", "李さんは 今朝 6時に 起きました。9時から 5時まで 働きました。本屋で 本を 買いました。夜 テレビを 見ませんでした。11時に 寝ました。", {
        promptKana: "りさんの いちにちです。",
        answerSource: "audio",
        responseScope: "custom",
        responseScopeHint: "按图和录音写出李さん的一天。",
        multiline: true
      }),
      answerItem("l7-p1-a5-q2", "2", "張さんの 1日です。", "張さんは 昨日の 日曜日 8時に 起きました。午前中 日本語を 勉強しませんでした。午後 友達と サッカーを しました。夜 テレビを 見ました。11時半に 寝ました。", {
        promptKana: "ちょうさんの いちにちです。",
        answerSource: "audio",
        responseScope: "custom",
        responseScopeHint: "按图和录音写出張さん的一天。",
        multiline: true
      })
    ]
  },
  {
    id: "l7-p1-a6",
    section: "practice_1",
    order: 6,
    title: "先听录音，然后看图并扮演乙的角色。",
    instruction: "",
    interaction: "role_play",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 6),
      label: "第7课 练习I-6",
      transcript: {
        text: "いらっしゃいませ。ノートと 鉛筆を ください。いらっしゃいませ。イチゴと リンゴを ください。いらっしゃいませ。ワインと チーズを ください。いらっしゃいませ。カレーと コーヒーを ください。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按教材图片校正。",
        segments: [
          { itemNumber: "1", text: "いらっしゃいませ。イチゴと リンゴを ください。" },
          { itemNumber: "2", text: "いらっしゃいませ。ワインと チーズを ください。" },
          { itemNumber: "3", text: "いらっしゃいませ。カレーと コーヒーを ください。" }
        ]
      }
    },
    assets: [
      { id: "l7-p1-a6-shop-items", kind: "exercise_image", imagePath: exerciseImage("book1_lesson7_1_6.png") }
    ],
    displayAssets: ["l7-p1-a6-shop-items"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "ノート／鉛筆",
          beforeKana: "ノート／えんぴつ",
          after: [text("甲：いらっしゃいませ。 乙：ノートと 鉛筆を ください。")],
          afterKana: "こう：いらっしゃいませ。 おつ：ノートと えんぴつを ください。"
        }
      }
    ],
    items: [
      dialogueItem("l7-p1-a6-q1", "1", "イチゴ／リンゴ", "甲：いらっしゃいませ。\n乙：イチゴと リンゴを ください。", "イチゴ／リンゴ", "audio"),
      dialogueItem("l7-p1-a6-q2", "2", "ワイン／チーズ", "甲：いらっしゃいませ。\n乙：ワインと チーズを ください。", "ワイン／チーズ", "audio"),
      dialogueItem("l7-p1-a6-q3", "3", "カレー／コーヒー", "甲：いらっしゃいませ。\n乙：カレーと コーヒーを ください。", "カレー／コーヒー", "audio")
    ]
  },
  {
    id: "l7-p2-a1",
    section: "practice_2",
    order: 1,
    title: "在（　）中填入适当的词语。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("昨日 "), blank("example"), text("を 買いましたか。")],
          beforeKana: "きのう （なに）を かいましたか。",
          after: [text("車の 雑誌を 買いました。")],
          afterKana: "くるまの ざっしを かいました。"
        }
      }
    ],
    items: [
      blankItem("l7-p2-a1-q1", "1", [blank("answer"), text(" 上海へ 行きますか。 —— 来週 行きます。")], { answer: "いつ" }, "（  ）シャンハイへ いきますか。—— らいしゅう いきます。"),
      blankItem("l7-p2-a1-q2", "2", [text("毎日 "), blank("answer"), text("に 起きますか。 —— 6時半に 起きます。")], { answer: "何時" }, "まいにち （  ）に おきますか。—— ろくじはんに おきます。"),
      blankItem("l7-p2-a1-q3", "3", [blank("answer"), text("と 図書館へ 行きますか。 —— 小野さんと 行きます。")], { answer: "だれ" }, "（  ）と としょかんへ いきますか。—— おのさんと いきます。"),
      blankItem("l7-p2-a1-q4", "4", [text("駅へ "), blank("answer"), text("で 行きますか。 —— バスで 行きます。")], { answer: "何" }, "えきへ （  ）で いきますか。—— バスで いきます。"),
      blankItem("l7-p2-a1-q5", "5", [text("小野さんの 家は "), blank("answer"), text("ですか。 —— 横浜です。")], { answer: "どこ" }, "おのさんの いえは （  ）ですか。—— よこはまです。")
    ]
  },
  {
    id: "l7-p2-a2",
    section: "practice_2",
    order: 2,
    title: "看图完成句子。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: "填写括号里的助词和横线上的词句。",
    assets: [
      { id: "l7-p2-a2-picture-prompts", kind: "exercise_image", imagePath: exerciseImage("book1_lesson7_2_2.png") }
    ],
    displayAssets: ["l7-p2-a2-picture-prompts"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("毎日 6時 "), blank("particle"), text(" 起きます。")],
          beforeKana: "まいにち ろくじ （に） おきます。",
          after: [text("毎日 6時に 起きます。")],
          afterKana: "まいにち ろくじに おきます。"
        }
      }
    ],
    items: [
      slotItem("l7-p2-a2-q1", "1", [text("昨日 わたしは 友達 "), blank("p1"), text(" 銀座 "), blank("p2"), text(" 映画 "), blank("p3"), text(" "), blank("answer"), text("。")], [
        { id: "p1", expectedUnit: "particle", width: "short", placeholder: "助词" },
        { id: "p2", expectedUnit: "particle", width: "short", placeholder: "助词" },
        { id: "p3", expectedUnit: "particle", width: "short", placeholder: "助词" },
        { id: "answer", expectedUnit: "phrase", width: "medium", placeholder: "动词" }
      ], { p1: "と", p2: "で", p3: "を", answer: "見ました" }, { promptKana: "きのう わたしは ともだち （  ） ぎんざ （  ） えいが （  ） ______。" }),
      slotItem("l7-p2-a2-q2", "2", [text("いつも バス "), blank("p1"), text(" 会社 "), blank("p2"), text(" "), blank("answer"), text("。")], [
        { id: "p1", expectedUnit: "particle", width: "short", placeholder: "助词" },
        { id: "p2", expectedUnit: "particle", width: "short", placeholder: "助词" },
        { id: "answer", expectedUnit: "phrase", width: "medium", placeholder: "动词" }
      ], { p1: "で", p2: "へ", answer: "行きます" }, { promptKana: "いつも バス （  ） かいしゃ （  ） ______。" }),
      slotItem("l7-p2-a2-q3", "3", [text("先週 公園 "), blank("p1"), text(" "), blank("object"), text(" "), blank("answer"), text("。")], [
        { id: "p1", expectedUnit: "particle", width: "short", placeholder: "助词" },
        { id: "object", expectedUnit: "word", width: "medium", placeholder: "名词" },
        { id: "answer", expectedUnit: "phrase", width: "medium", placeholder: "动词" }
      ], { p1: "で", object: "サッカーを", answer: "しました" }, { promptKana: "せんしゅう こうえん （  ） （  ） ______。" }),
      slotItem("l7-p2-a2-q4", "4", [text("昨日の 夜 8時 "), blank("p1"), text(" 10時 "), blank("p2"), text(" テレビ "), blank("p3"), text(" "), blank("answer"), text("。")], [
        { id: "p1", expectedUnit: "particle", width: "short", placeholder: "助词" },
        { id: "p2", expectedUnit: "particle", width: "short", placeholder: "助词" },
        { id: "p3", expectedUnit: "particle", width: "short", placeholder: "助词" },
        { id: "answer", expectedUnit: "phrase", width: "medium", placeholder: "动词" }
      ], { p1: "から", p2: "まで", p3: "を", answer: "見ました" }, { promptKana: "きのうの よる はちじ （  ） じゅうじ （  ） テレビ （  ） ______。" })
    ]
  },
  {
    id: "l7-p2-a3",
    section: "practice_2",
    order: 3,
    title: "先听录音“小野的一天”。然后根据录音内容从“a”“b”中选择正确答案画○。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "第7课 练习II-3",
      transcript: {
        text: "小野さんの 一日。小野さんは 朝 6時に 起きました。朝、何も 食べませんでした。8時半に 会社へ 行きました。9時から 5時まで 働きました。昼、パンと チーズを 食べました。6時に バスで うちへ 帰りました。夜、カレーを 食べました。テレビを 見ませんでした。10時に 寝ました。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按选项校正。",
        segments: [
          { itemNumber: "1", text: "小野さんは 9時から 5時まで 働きました。" },
          { itemNumber: "2", text: "小野さんは 昼、パンと チーズを 食べました。" },
          { itemNumber: "3", text: "小野さんは 6時に バスで うちへ 帰りました。" },
          { itemNumber: "4", text: "小野さんは テレビを 見ませんでした。" },
          { itemNumber: "5", text: "小野さんは 10時に 寝ました。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "小野さんは 何時に 起きましたか。",
          beforeKana: "おのさんは なんじに おきましたか。",
          after: [text("a 6時")],
          afterKana: "a ろくじ"
        }
      }
    ],
    items: [
      choiceItem("l7-p2-a3-q1", "1", "小野さんは 何時から 何時まで 働きましたか。", [
        { id: "a", label: "a 9時から 6時まで" },
        { id: "b", label: "b 9時から 5時まで" }
      ], "b", "おのさんは なんじから なんじまで はたらきましたか。"),
      choiceItem("l7-p2-a3-q2", "2", "小野さんは 昼 何を 食べましたか。", [
        { id: "a", label: "a パンと チーズ" },
        { id: "b", label: "b カレー" }
      ], "a", "おのさんは ひる なにを たべましたか。"),
      choiceItem("l7-p2-a3-q3", "3", "小野さんは 何で うちへ 帰りましたか。", [
        { id: "a", label: "a バス" },
        { id: "b", label: "b 電車" }
      ], "a", "おのさんは なんで うちへ かえりましたか。"),
      choiceItem("l7-p2-a3-q4", "4", "小野さんは 夜 テレビを 見ましたか。", [
        { id: "a", label: "a はい" },
        { id: "b", label: "b いいえ" }
      ], "b", "おのさんは よる テレビを みましたか。"),
      choiceItem("l7-p2-a3-q5", "5", "小野さんは 何時に 寝ましたか。", [
        { id: "a", label: "a 8時半" },
        { id: "b", label: "b 10時" }
      ], "b", "おのさんは なんじに ねましたか。")
    ]
  },
  {
    id: "l7-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l7-p2-a4-q1", "1", "小李在图书馆学习。", "李さんは 図書館で 勉強します。", { answerSource: "prompt" }),
      answerItem("l7-p2-a4-q2", "2", "小李每天喝咖啡。", "李さんは 毎日 コーヒーを 飲みます。", { answerSource: "prompt" }),
      answerItem("l7-p2-a4-q3", "3", "森先生今天早晨什么都没吃。", "森さんは 今朝 何も 食べませんでした。", { answerSource: "prompt" })
    ]
  }
];

export const lesson7Practice: LessonPractice = {
  lessonId: "lesson7",
  title: "第7課 李さんは 毎日 コーヒーを 飲みます",
  sourcePages: [
    { pageNo: 94, imagePath: page(94) },
    { pageNo: 95, imagePath: page(95) },
    { pageNo: 96, imagePath: page(96) }
  ],
  activities
};
