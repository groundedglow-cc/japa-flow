import type { LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";
import { lesson6ImageCrops } from "./lesson6-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson6/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit2/lesson6/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });
const crop = (id: string) => lesson6ImageCrops.assets.find((asset) => asset.id === id)!;

const sentenceSlots = (placeholder = "输入完整回答") => [{ id: "answer", expectedUnit: "sentence" as const, width: "long" as const, placeholder }];
const shortSlots = (slotIds: string[]) => slotIds.map((slotId) => ({ id: slotId, expectedUnit: "word" as const, width: "short" as const, placeholder: "输入 1 个假名" }));
const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
const tripCompositionHint = "先填写①②③④的回答，再填写⇒后的完整句子。";

const answerItem = (
  id: string,
  number: string,
  prompt: string,
  answer: string,
  promptKana?: string,
  answerSource: "example_transform" | "audio" = "example_transform",
  note?: string,
  responseScope?: PracticeItem["responseScope"]
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource,
  responseScope,
  inputSlots: sentenceSlots(),
  answer: { slotValues: { answer }, note }
});

const dialogueItem = (id: string, number: string, prompt: string, answer: string, promptKana?: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "example_transform",
  responseScope: "dialogue_only",
  inputSlots: [{ id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows: 3, placeholder: "输入完整对话" }],
  answer: { slotValues: { answer } }
});

const blankItem = (id: string, number: string, prompt: PromptPart[], answers: Record<string, string>, promptKana?: string): PracticeItem => ({
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

const tripCompositionItem = (
  id: string,
  number: string,
  prompt: string,
  answers: Record<string, string>,
  promptKana?: string,
  note?: string
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "audio",
  responseScope: "custom",
  responseScopeHint: tripCompositionHint,
  inputSlots: [
    { id: "when", expectedUnit: "sentence", width: "medium", placeholder: "① いつ" },
    ...(answers.who ? [{ id: "who", expectedUnit: "sentence" as const, width: "medium" as const, placeholder: "② だれと" }] : []),
    ...(answers.how ? [{ id: "how", expectedUnit: "sentence" as const, width: "medium" as const, placeholder: answers.who ? "③ 何で" : "② 何で" }] : []),
    ...(answers.where ? [{ id: "where", expectedUnit: "sentence" as const, width: "medium" as const, placeholder: answers.who ? "④ どこへ" : "③ どこへ" }] : []),
    ...(answers.route ? [{ id: "route", expectedUnit: "sentence" as const, width: "medium" as const, placeholder: "③ どこからどこへ" }] : []),
    { id: "answer", expectedUnit: "sentence", width: "long", placeholder: "⇒ 完整句子" }
  ],
  answer: { slotValues: answers, note }
});

const activities: PracticeActivity[] = [
  {
    id: "l6-p1-a1",
    section: "practice_1",
    order: 1,
    title: "注意听录音中的日期，进行练习。",
    instruction: "",
    interaction: "listening_repeat",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 1),
      label: "第6课 练习I-1",
      transcript: {
        text: "クリスマスは12月25日です。わたしの誕生日は9月1日です。「こどもの日」は5月5日です。明日は11月3日です。",
        source: "manual",
        segments: [
          { itemNumber: "1", text: "クリスマスは12月25日です。" },
          { itemNumber: "2", text: "わたしの誕生日は9月1日です。" },
          { itemNumber: "3", text: "「こどもの日」は5月5日です。" },
          { itemNumber: "4", text: "明日は11月3日です。" }
        ]
      }
    },
    layout: [],
    items: [
      answerItem("l6-p1-a1-q1", "1", "クリスマスは 12月25日です。", "クリスマスは 12月25日です。", "クリスマスは じゅうにがつ にじゅうごにちです。"),
      answerItem("l6-p1-a1-q2", "2", "わたしの 誕生日は 9月1日です。", "わたしの 誕生日は 9月1日です。", "わたしの たんじょうびは くがつ ついたちです。"),
      answerItem("l6-p1-a1-q3", "3", "「こどもの日」は 5月5日です。", "「こどもの日」は 5月5日です。", "「こどものひ」は ごがつ いつかです。"),
      answerItem("l6-p1-a1-q4", "4", "明日は 11月3日です。", "明日は 11月3日です。", "あしたは じゅういちがつ みっかです。")
    ]
  },
  {
    id: "l6-p1-a2",
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
        id: "l6-p1-a2-g1",
        example: {
          id: "l6-p1-a2-ex1",
          label: "[例1]",
          before: "来月／韓国",
          beforeKana: "らいげつ／かんこく",
          after: [text("小野さんは "), repl("来月", "when", { kana: "らいげつ" }), text(" "), repl("韓国", "place", { kana: "かんこく" }), text("へ 行きます。")],
          afterKana: "おのさんは らいげつ かんこくへ いきます。"
        },
        items: [
          answerItem("l6-p1-a2-q1", "1", "来週／大阪", "小野さんは 来週 大阪へ 行きます。", "らいしゅう／おおさか"),
          answerItem("l6-p1-a2-q2", "2", "明日／図書館", "小野さんは 明日 図書館へ 行きます。", "あした／としょかん"),
          answerItem("l6-p1-a2-q3", "3", "来年／アメリカ", "小野さんは 来年 アメリカへ 行きます。", "らいねん／アメリカ")
        ]
      },
      {
        id: "l6-p1-a2-g2",
        example: {
          id: "l6-p1-a2-ex2",
          label: "[例2]",
          before: "先月／名古屋",
          beforeKana: "せんげつ／なごや",
          after: [text("小野さんは "), repl("先月", "when", { kana: "せんげつ" }), text(" 友達と "), repl("名古屋", "place", { kana: "なごや" }), text("へ 行きました。")],
          afterKana: "おのさんは せんげつ ともだちと なごやへ いきました。"
        },
        items: [
          answerItem("l6-p1-a2-q4", "4", "昨日／デパート", "小野さんは 昨日 友達と デパートへ 行きました。", "きのう／デパート"),
          answerItem("l6-p1-a2-q5", "5", "去年／上海", "小野さんは 去年 友達と 上海へ 行きました。", "きょねん／シャンハイ"),
          answerItem("l6-p1-a2-q6", "6", "おととい／レストラン", "小野さんは おととい 友達と レストランへ 行きました。", "おととい／レストラン")
        ]
      },
      {
        id: "l6-p1-a2-g3",
        example: {
          id: "l6-p1-a2-ex3",
          label: "[例3]",
          before: "李／北京",
          beforeKana: "り／ペキン",
          after: [text("李さんは 去年 "), repl("北京", "place", { kana: "ペキン" }), text("から 来ました。")],
          afterKana: "りさんは きょねん ペキンから きました。"
        },
        items: [
          answerItem("l6-p1-a2-q7", "7", "キム／韓国", "キムさんは 去年 韓国から 来ました。", "キム／かんこく"),
          answerItem("l6-p1-a2-q8", "8", "スミス／アメリカ", "スミスさんは 去年 アメリカから 来ました。", "スミス／アメリカ"),
          answerItem("l6-p1-a2-q9", "9", "デュポン／フランス", "デュポンさんは 去年 フランスから 来ました。", "デュポン／フランス")
        ]
      }
    ],
    items: []
  },
  {
    id: "l6-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    layout: [],
    itemGroups: [
      {
        id: "l6-p1-a3-g1",
        example: {
          id: "l6-p1-a3-ex1",
          label: "[例1]",
          before: "上海／飛行機／フェリー",
          beforeKana: "シャンハイ／ひこうき／フェリー",
          after: [text("甲：上海へ 飛行機で 行きますか。 乙：いいえ、フェリーで 行きます。")],
          afterKana: "こう：シャンハイへ ひこうきで いきますか。 おつ：いいえ、フェリーで いきます。"
        },
        items: [
          dialogueItem("l6-p1-a3-q1", "1", "大阪／新幹線／飛行機", "甲：大阪へ 新幹線で 行きますか。\n乙：いいえ、飛行機で 行きます。", "おおさか／しんかんせん／ひこうき"),
          dialogueItem("l6-p1-a3-q2", "2", "友達の家／バス／歩いて", "甲：友達の家へ バスで 行きますか。\n乙：いいえ、歩いて 行きます。", "ともだちのいえ／バス／あるいて"),
          dialogueItem("l6-p1-a3-q3", "3", "デパート／バス／地下鉄", "甲：デパートへ バスで 行きますか。\n乙：いいえ、地下鉄で 行きます。", "デパート／バス／ちかてつ"),
          dialogueItem("l6-p1-a3-q4", "4", "学校／電車／自転車", "甲：学校へ 電車で 行きますか。\n乙：いいえ、自転車で 行きます。", "がっこう／でんしゃ／じてんしゃ")
        ]
      },
      {
        id: "l6-p1-a3-g2",
        example: {
          id: "l6-p1-a3-ex2",
          label: "[例2]",
          before: "美術館／李さん",
          beforeKana: "びじゅつかん／りさん",
          after: [text("甲：だれと 美術館へ 行きますか。 乙：李さんと 行きます。")],
          afterKana: "こう：だれと びじゅつかんへ いきますか。 おつ：りさんと いきます。"
        },
        items: [
          dialogueItem("l6-p1-a3-q5", "5", "本屋／父", "甲：だれと 本屋へ 行きますか。\n乙：父と 行きます。", "ほんや／ちち"),
          dialogueItem("l6-p1-a3-q6", "6", "プール／弟", "甲：だれと プールへ 行きますか。\n乙：弟と 行きます。", "プール／おとうと"),
          dialogueItem("l6-p1-a3-q7", "7", "コンビニ／友達", "甲：だれと コンビニへ 行きますか。\n乙：友達と 行きます。", "コンビニ／ともだち")
        ]
      },
      {
        id: "l6-p1-a3-g3",
        example: {
          id: "l6-p1-a3-ex3",
          label: "[例3]",
          before: "王／10月／中国",
          beforeKana: "おう／じゅうがつ／ちゅうごく",
          after: [text("王さんは 10月に 中国へ 帰りました。")],
          afterKana: "おうさんは じゅうがつに ちゅうごくへ かえりました。"
        },
        items: [
          answerItem("l6-p1-a3-q8", "8", "張／6月／中国", "張さんは 6月に 中国へ 帰りました。", "ちょう／ろくがつ／ちゅうごく", "example_transform", undefined, "sentence_only"),
          answerItem("l6-p1-a3-q9", "9", "スミス／9月／アメリカ", "スミスさんは 9月に アメリカへ 帰りました。", "スミス／くがつ／アメリカ", "example_transform", undefined, "sentence_only"),
          answerItem("l6-p1-a3-q10", "10", "キム／12月／韓国", "キムさんは 12月に 韓国へ 帰りました。", "キム／じゅうにがつ／かんこく", "example_transform", undefined, "sentence_only"),
          answerItem("l6-p1-a3-q11", "11", "デュポン／7月／フランス", "デュポンさんは 7月に フランスへ 帰りました。", "デュポン／しちがつ／フランス", "example_transform", undefined, "sentence_only")
        ]
      }
    ],
    items: []
  },
  {
    id: "l6-p1-a4",
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
          before: "バス／銀座",
          beforeKana: "バス／ぎんざ",
          after: [text("甲：この バスは 銀座へ 行きますか。 乙：はい、行きます。")],
          afterKana: "こう：この バスは ぎんざへ いきますか。 おつ：はい、いきます。"
        }
      }
    ],
    items: [
      dialogueItem("l6-p1-a4-q1", "1", "バス／渋谷", "甲：この バスは 渋谷へ 行きますか。\n乙：はい、行きます。", "バス／しぶや"),
      dialogueItem("l6-p1-a4-q2", "2", "新幹線／広島", "甲：この 新幹線は 広島へ 行きますか。\n乙：はい、行きます。", "しんかんせん／ひろしま"),
      dialogueItem("l6-p1-a4-q3", "3", "地下鉄／新宿", "甲：この 地下鉄は 新宿へ 行きますか。\n乙：はい、行きます。", "ちかてつ／しんじゅく")
    ]
  },
  {
    id: "l6-p1-a5",
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
          before: "吉田さんは いつ 中国へ 行きますか。",
          beforeKana: "よしださんは いつ ちゅうごくへ いきますか。",
          after: [text("来月 行きます。")],
          afterKana: "らいげつ いきます。"
        }
      }
    ],
    items: [
      answerItem("l6-p1-a5-q1", "1", "家から 駅まで 何で 行きますか。", "自転車で 行きます。", "いえから えきまで なんで いきますか。"),
      answerItem("l6-p1-a5-q2", "2", "北海道まで 何で 行きますか。", "飛行機で 行きます。", "ほっかいどうまで なんで いきますか。"),
      answerItem("l6-p1-a5-q3", "3", "昨日 森さんは 何時に 家へ 帰りましたか。", "夜中の 2時に 帰りました。", "きのう もりさんは なんじに いえへ かえりましたか。"),
      answerItem("l6-p1-a5-q4", "4", "昨日の夜 何で 家へ 帰りましたか。", "タクシーで 帰りました。", "きのうのよる なんで いえへ かえりましたか。"),
      answerItem("l6-p1-a5-q5", "5", "日曜日に だれと コンサートへ 行きましたか。", "友達と 行きました。", "にちようびに だれと コンサートへ いきましたか。")
    ]
  },
  {
    id: "l6-p1-a6",
    section: "practice_1",
    order: 6,
    title: "边看图边听录音，仿照例句回答提问。然后将几个词语组成一个句子。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: tripCompositionHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 6),
      label: "第6课 练习I-6",
      transcript: {
        text: "李さんはいつ行きましたか。先月、行きました。だれと行きましたか。佐藤さんと行きました。何で行きましたか。新幹線で行きました。どこへ行きましたか。大阪へ行きました。李さんは先月、佐藤さんと新幹線で大阪へ行きました。李さんはいつ行きましたか。夏休みに行きました。だれと行きましたか。友達と行きました。何で行きましたか。車で行きました。どこへ行きましたか。箱根へ行きました。キムさんはいつ来ますか。来月来ます。何で来ますか。飛行機で来ます。どこへ来ますか。日本へ来ます。吉田さんはいつ帰りましたか。昨日帰りました。何で帰りましたか。タクシーで帰りました。どこからどこへ帰りましたか。会社から家へ帰りました。",
        source: "manual",
        confidenceNote: "ASR 稳定识别了例题和第 1 组，后两组按图中给定词组与同一问答模式补全。",
        segments: [
          { itemNumber: "1", text: "李さんはいつ行きましたか。夏休みに行きました。だれと行きましたか。友達と行きました。何で行きましたか。車で行きました。どこへ行きましたか。箱根へ行きました。" },
          { itemNumber: "2", text: "キムさんはいつ来ますか。来月来ます。何で来ますか。飛行機で来ます。どこへ来ますか。日本へ来ます。" },
          { itemNumber: "3", text: "吉田さんはいつ帰りましたか。昨日帰りました。何で帰りましたか。タクシーで帰りました。どこからどこへ帰りましたか。会社から家へ帰りました。" }
        ]
      }
    },
    assets: [crop("l6-p1-a6-trip-scenes")],
    displayAssets: ["l6-p1-a6-trip-scenes"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "李／先月／佐藤／新幹線／大阪／行きます",
          beforeKana: "り／せんげつ／さとう／しんかんせん／おおさか／いきます",
          after: [text("①先月 行きました。 ②佐藤さんと 行きました。 ③新幹線で 行きました。 ④大阪へ 行きました。 ⇒ 李さんは 先月 佐藤さんと 新幹線で 大阪へ 行きました。")],
          afterKana: "せんげつ いきました。 さとうさんと いきました。 しんかんせんで いきました。 おおさかへ いきました。 りさんは せんげつ さとうさんと しんかんせんで おおさかへ いきました。"
        }
      }
    ],
    items: [
      tripCompositionItem("l6-p1-a6-q1", "1", "李／夏休み／友達／車／箱根／行きます", {
        when: "夏休みに 行きました。",
        who: "友達と 行きました。",
        how: "車で 行きました。",
        where: "箱根へ 行きました。",
        answer: "李さんは 夏休みに 友達と 車で 箱根へ 行きました。"
      }, "り／なつやすみ／ともだち／くるま／はこね／いきます"),
      tripCompositionItem("l6-p1-a6-q2", "2", "キム／来月／飛行機／日本／来ます", {
        when: "来月 来ます。",
        how: "飛行機で 来ます。",
        where: "日本へ 来ます。",
        answer: "キムさんは 来月 飛行機で 日本へ 来ます。"
      }, "キム／らいげつ／ひこうき／にほん／きます", "ASR 未完整识别该组，答案按图中词组和同一问答模式补全。"),
      tripCompositionItem("l6-p1-a6-q3", "3", "吉田／昨日／タクシー／会社→家／帰ります", {
        when: "昨日 帰りました。",
        how: "タクシーで 帰りました。",
        route: "会社から 家へ 帰りました。",
        answer: "吉田さんは 昨日 タクシーで 会社から 家へ 帰りました。"
      }, "よしだ／きのう／タクシー／かいしゃ→いえ／かえります", "ASR 未完整识别该组，答案按图中词组和同一问答模式补全。")
    ]
  },
  {
    id: "l6-p2-a1",
    section: "practice_2",
    order: 1,
    title: "在（　）中填入一个平假名。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [],
    items: [
      blankItem("l6-p2-a1-q1", "1", [text("昨日 友達 "), blank("a1"), text(" 図書館 "), blank("a2"), text(" 行きました。")], { a1: "と", a2: "へ" }, "きのう ともだち （  ） としょかん （  ） いきました。"),
      blankItem("l6-p2-a1-q2", "2", [text("新宿 "), blank("a1"), blank("a2"), text(" 渋谷 "), blank("a3"), blank("a4"), text(" 150円です。")], { a1: "か", a2: "ら", a3: "ま", a4: "で" }, "しんじゅく （  ）（  ） しぶや （  ）（  ） ひゃくごじゅうえんです。"),
      blankItem("l6-p2-a1-q3", "3", [text("11時 "), blank("a1"), text(" タクシー "), blank("a2"), text(" 家 "), blank("a3"), text(" 帰りました。")], { a1: "に", a2: "で", a3: "へ" }, "じゅういちじ （  ） タクシー （  ） いえ （  ） かえりました。"),
      blankItem("l6-p2-a1-q4", "4", [text("明日 李さんは だれ "), blank("a1"), text(" 箱根 "), blank("a2"), text(" 行きますか。")], { a1: "と", a2: "へ" }, "あした りさんは だれ （  ） はこね （  ） いきますか。")
    ]
  },
  {
    id: "l6-p2-a2",
    section: "practice_2",
    order: 2,
    title: "看图回答提问。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    assets: [crop("l6-p2-a2-bus-routes")],
    displayAssets: ["l6-p2-a2-bus-routes"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "新宿から 渋谷まで 行きます。どの バスですか。",
          beforeKana: "しんじゅくから しぶやまで いきます。どの バスですか。",
          after: [text("25番です。")],
          afterKana: "にじゅうごばんです。"
        }
      }
    ],
    items: [
      answerItem("l6-p2-a2-q1", "1", "9番の バスは 京都へ 行きますか。", "はい、行きます。", "きゅうばんの バスは きょうとへ いきますか。"),
      answerItem("l6-p2-a2-q2", "2", "京都から 大阪まで 行きます。 1番の バスですか、2番の バスですか。", "2番の バスです。", "きょうとから おおさかまで いきます。 いちばんの バスですか、にばんの バスですか。"),
      answerItem("l6-p2-a2-q3", "3", "14番の バスは どこへ 行きますか。", "箱根へ 行きます。", "じゅうよんばんの バスは どこへ いきますか。"),
      answerItem("l6-p2-a2-q4", "4", "大阪から 広島まで 行きます。 どの バスですか。", "49番です。", "おおさかから ひろしままで いきます。 どの バスですか。")
    ]
  },
  {
    id: "l6-p2-a3",
    section: "practice_2",
    order: 3,
    title: "从□中选择适当的词语填入（　）中。",
    instruction: "",
    interaction: "reading_cloze",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [
      {
        type: "word_bank",
        words: [text("何"), text("いつ"), text("だれ"), text("何時"), text("どこまで")]
      }
    ],
    items: [
      blankItem("l6-p2-a3-q1", "1", [text("昨日 "), blank("a1"), text(" と 美術館へ 行きましたか。")], { a1: "だれ" }, "きのう （  ） と びじゅつかんへ いきましたか。"),
      blankItem("l6-p2-a3-q2", "2", [text("田中さんは "), blank("a1"), text(" に 帰りましたか。")], { a1: "何時" }, "たなかさんは （  ） に かえりましたか。"),
      blankItem("l6-p2-a3-q3", "3", [text("この バスは "), blank("a1"), text(" 行きますか。")], { a1: "どこまで" }, "この バスは （  ） いきますか。"),
      blankItem("l6-p2-a3-q4", "4", [blank("a1"), text("で 箱根へ 行きますか。")], { a1: "何" }, "（  ）で はこねへ いきますか。")
    ]
  },
  {
    id: "l6-p2-a4",
    section: "practice_2",
    order: 4,
    title: "听录音回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 4),
      label: "第6课 练习II-4",
      transcript: {
        text: "8月15日から24日まで、夏休みです。家族と飛行機で北京へ行きます。北京から電車で上海へ行きます。23日に上海から日本へ帰ります。夏休みにどこへ行きますか。北京へ行きます。だれと行きますか。家族と行きます。北京まで何で行きますか。飛行機で行きます。北京から電車でどこへ行きますか。上海へ行きます。いつ日本へ帰りますか。23日に帰ります。",
        source: "manual",
        segments: [
          { itemNumber: "1", text: "だれと行きますか。家族と行きます。" },
          { itemNumber: "2", text: "北京まで何で行きますか。飛行機で行きます。" },
          { itemNumber: "3", text: "北京から電車でどこへ行きますか。上海へ行きます。" },
          { itemNumber: "4", text: "いつ日本へ帰りますか。23日に帰ります。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "夏休みに どこへ 行きますか。",
          beforeKana: "なつやすみに どこへ いきますか。",
          after: [text("北京へ 行きます。")],
          afterKana: "ペキンへ いきます。"
        }
      }
    ],
    items: [
      answerItem("l6-p2-a4-q1", "1", "だれと 行きますか。", "家族と 行きます。", "だれと いきますか。", "audio"),
      answerItem("l6-p2-a4-q2", "2", "北京まで 何で 行きますか。", "飛行機で 行きます。", "ペキンまで なんで いきますか。", "audio"),
      answerItem("l6-p2-a4-q3", "3", "北京から 電車で どこへ 行きますか。", "上海へ 行きます。", "ペキンから でんしゃで どこへ いきますか。", "audio"),
      answerItem("l6-p2-a4-q4", "4", "いつ 日本へ 帰りますか。", "23日に 帰ります。", "いつ にほんへ かえりますか。", "audio")
    ]
  },
  {
    id: "l6-p2-a5",
    section: "practice_2",
    order: 5,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l6-p2-a5-q1", "1", "小野女士和朋友（一块儿）回去。", "小野さんは 友達と いっしょに 帰ります。"),
      answerItem("l6-p2-a5-q2", "2", "小李上个月从北京来。", "李さんは 先月 北京から 来ました。"),
      answerItem("l6-p2-a5-q3", "3", "吉田老师下个月去中国。", "吉田先生は 来月 中国へ 行きます。")
    ]
  }
];

export const lesson6Practice: LessonPractice = {
  lessonId: "lesson6",
  title: "第6課 吉田さんは 来月 中国へ 行きます",
  sourcePages: [
    { pageNo: 84, imagePath: page(84) },
    { pageNo: 85, imagePath: page(85) },
    { pageNo: 86, imagePath: page(86) }
  ],
  activities
};
