import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";
import { lesson8ImageCrops } from "./lesson8-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson8/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit2/lesson8/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });
const crop = (id: string) => lesson8ImageCrops.assets.find((asset) => asset.id === id)!;

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
    ? [{ id: "answer", expectedUnit: "sentence", width: "long", multiline: true, rows: 3, placeholder: options.placeholder || "输入完整回答" }]
    : sentenceSlot(options.placeholder || "输入完整回答"),
  answer: { slotValues: { answer } }
});

const qaItem = (
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
  responseScope: "question_and_answer",
  inputSlots: dialogueSlot("输入完整问答", 3),
  answer: { slotValues: { answer } }
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
  answerChoiceId: "yes" | "no",
  promptKana?: string
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "audio",
  responseScope: "choice_only",
  choices: [
    { id: "yes", label: "はい" },
    { id: "no", label: "いいえ" }
  ],
  answer: { choiceIds: [answerChoiceId] }
});

const transformVerbItem = (
  id: string,
  number: string,
  prompt: PromptPart[],
  answer: string,
  promptKana?: string
): PracticeItem => slotItem(
  id,
  number,
  prompt,
  [{ id: "answer", expectedUnit: "conjugated_form", width: "medium", placeholder: "动词形式" }],
  { answer },
  { promptKana, responseScope: "phrase_only" }
);

const activities: PracticeActivity[] = [
  {
    id: "l8-p1-a1",
    section: "practice_1",
    order: 1,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    itemGroups: [
      {
        id: "l8-p1-a1-g1",
        example: {
          id: "l8-p1-a1-ex1",
          label: "[例1]",
          before: "鉛筆／手紙／書きます",
          beforeKana: "えんぴつ／てがみ／かきます",
          after: [repl("鉛筆", "tool", { kana: "えんぴつ" }), text("で "), repl("手紙", "object", { kana: "てがみ" }), text("を "), repl("書きます", "verb", { kana: "かきます" }), text("。")],
          afterKana: "えんぴつで てがみを かきます。"
        },
        items: [
          answerItem("l8-p1-a1-q1", "1", "ボールペン／名前／書きます", "ボールペンで 名前を 書きます。", { promptKana: "ボールペン／なまえ／かきます" }),
          answerItem("l8-p1-a1-q2", "2", "パソコン／地図／かきます", "パソコンで 地図を かきます。", { promptKana: "パソコン／ちず／かきます" }),
          answerItem("l8-p1-a1-q3", "3", "はし／うどん／食べます", "はしで うどんを 食べます。", { promptKana: "はし／うどん／たべます" }),
          answerItem("l8-p1-a1-q4", "4", "テレビ／中国語／勉強します", "テレビで 中国語を 勉強します。", { promptKana: "テレビ／ちゅうごくご／べんきょうします" }),
          answerItem("l8-p1-a1-q5", "5", "ファックス／申込書／送ります", "ファックスで 申込書を 送ります。", { promptKana: "ファックス／もうしこみしょ／おくります" }),
          answerItem("l8-p1-a1-q6", "6", "スプーン／アイスクリーム／食べます", "スプーンで アイスクリームを 食べます。", { promptKana: "スプーン／アイスクリーム／たべます" })
        ]
      },
      {
        id: "l8-p1-a1-g2",
        example: {
          id: "l8-p1-a1-ex2",
          label: "[例2]",
          before: "木／箱",
          beforeKana: "き／はこ",
          after: [repl("木", "material", { kana: "き" }), text("で "), repl("箱", "object", { kana: "はこ" }), text("を 作ります。")],
          afterKana: "きで はこを つくります。"
        },
        items: [
          answerItem("l8-p1-a1-q7", "7", "小麦粉／うどん", "小麦粉で うどんを 作ります。", { promptKana: "こむぎこ／うどん" }),
          answerItem("l8-p1-a1-q8", "8", "小麦粉／パン", "小麦粉で パンを 作ります。", { promptKana: "こむぎこ／パン" }),
          answerItem("l8-p1-a1-q9", "9", "木／机と いす", "木で 机と いすを 作ります。", { promptKana: "き／つくえと いす" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l8-p1-a2",
    section: "practice_1",
    order: 2,
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
          before: "公園／小野",
          beforeKana: "こうえん／おの",
          after: [repl("公園", "place", { kana: "こうえん" }), text("で "), repl("小野さん", "person", { kana: "おのさん" }), text("に 会いました。")],
          afterKana: "こうえんで おのさんに あいました。"
        }
      }
    ],
    items: [
      answerItem("l8-p1-a2-q1", "1", "駅／スミス", "駅で スミスさんに 会いました。", { promptKana: "えき／スミス" }),
      answerItem("l8-p1-a2-q2", "2", "図書館／陳", "図書館で 陳さんに 会いました。", { promptKana: "としょかん／ちん" }),
      answerItem("l8-p1-a2-q3", "3", "デパート／李", "デパートで 李さんに 会いました。", { promptKana: "デパート／り" })
    ]
  },
  {
    id: "l8-p1-a3",
    section: "practice_1",
    order: 3,
    title: "看图，仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    assets: [crop("l8-p1-a3-gift-scenes")],
    displayAssets: ["l8-p1-a3-gift-scenes"],
    layout: [],
    itemGroups: [
      {
        id: "l8-p1-a3-g1",
        example: {
          id: "l8-p1-a3-ex1",
          label: "[例1]",
          before: "小野さん／花",
          beforeKana: "おのさん／はな",
          after: [text("甲：森さんは 小野さんに 何を あげましたか。 乙：花を あげました。")],
          afterKana: "こう：もりさんは おのさんに なにを あげましたか。 おつ：はなを あげました。"
        },
        items: [
          dialogueItem("l8-p1-a3-q1", "1", "李さん／コンサートの チケット", "甲：森さんは 李さんに 何を あげましたか。\n乙：コンサートの チケットを あげました。", "りさん／コンサートの チケット"),
          dialogueItem("l8-p1-a3-q2", "2", "張さん／サッカーの 雑誌", "甲：森さんは 張さんに 何を あげましたか。\n乙：サッカーの 雑誌を あげました。", "ちょうさん／サッカーの ざっし"),
          dialogueItem("l8-p1-a3-q3", "3", "弟／お金", "甲：森さんは 弟に 何を あげましたか。\n乙：お金を あげました。", "おとうと／おかね"),
          dialogueItem("l8-p1-a3-q4", "4", "課長／何も", "甲：森さんは 課長に 何を あげましたか。\n乙：何も あげませんでした。", "かちょう／なにも")
        ]
      },
      {
        id: "l8-p1-a3-g2",
        example: {
          id: "l8-p1-a3-ex2",
          label: "[例2]",
          before: "小野さん／花",
          beforeKana: "おのさん／はな",
          after: [text("甲：森さんは 小野さんに 何を もらいましたか。 乙：花を もらいました。")],
          afterKana: "こう：もりさんは おのさんに なにを もらいましたか。 おつ：はなを もらいました。"
        },
        items: [
          dialogueItem("l8-p1-a3-q5", "5", "お母さん／時計", "甲：森さんは お母さんに 何を もらいましたか。\n乙：時計を もらいました。", "おかあさん／とけい"),
          dialogueItem("l8-p1-a3-q6", "6", "友達／中国語の 本", "甲：森さんは 友達に 何を もらいましたか。\n乙：中国語の 本を もらいました。", "ともだち／ちゅうごくごの ほん"),
          dialogueItem("l8-p1-a3-q7", "7", "小野さん／CD", "甲：森さんは 小野さんに 何を もらいましたか。\n乙：CDを もらいました。", "おのさん／シーディー"),
          dialogueItem("l8-p1-a3-q8", "8", "お兄さん／何も", "甲：森さんは お兄さんに 何を もらいましたか。\n乙：何も もらいませんでした。", "おにいさん／なにも")
        ]
      }
    ],
    items: []
  },
  {
    id: "l8-p1-a4",
    section: "practice_1",
    order: 4,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "お昼ご飯／食べます",
          beforeKana: "おひるごはん／たべます",
          after: [text("もう "), repl("お昼ご飯", "object", { kana: "おひるごはん" }), text("を "), repl("食べました", "verb", { kana: "たべました" }), text("か。——はい、もう 食べました。")],
          afterKana: "もう おひるごはんを たべましたか。——はい、もう たべました。"
        }
      }
    ],
    items: [
      qaItem("l8-p1-a4-q1", "1", "この 本／読みます", "もう この 本を 読みましたか。\nはい、もう 読みました。", "この ほん／よみます"),
      qaItem("l8-p1-a4-q2", "2", "手紙／書きます", "もう 手紙を 書きましたか。\nはい、もう 書きました。", "てがみ／かきます"),
      qaItem("l8-p1-a4-q3", "3", "宿題／します", "もう 宿題を しましたか。\nはい、もう しました。", "しゅくだい／します")
    ]
  },
  {
    id: "l8-p1-a5",
    section: "practice_1",
    order: 5,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "李さん／手紙／書きます（はい）",
          beforeKana: "りさん／てがみ／かきます（はい）",
          after: [repl("李さん", "person", { kana: "りさん" }), text("に "), repl("手紙", "object", { kana: "てがみ" }), text("を "), repl("書きます", "verb", { kana: "かきます" }), text("か。——はい、書きます。")],
          afterKana: "りさんに てがみを かきますか。——はい、かきます。"
        }
      }
    ],
    items: [
      qaItem("l8-p1-a5-q1", "1", "友達／自転車／借ります（いいえ）", "友達に 自転車を 借りますか。\nいいえ、借りません。", "ともだち／じてんしゃ／かります（いいえ）"),
      qaItem("l8-p1-a5-q2", "2", "李さん／電話番号／教えました（はい）", "李さんに 電話番号を 教えましたか。\nはい、教えました。", "りさん／でんわばんごう／おしえました（はい）"),
      qaItem("l8-p1-a5-q3", "3", "友達／お金／貸しました（いいえ）", "友達に お金を 貸しましたか。\nいいえ、貸しませんでした。", "ともだち／おかね／かしました（いいえ）"),
      qaItem("l8-p1-a5-q4", "4", "お母さん／電話／します（はい）", "お母さんに 電話を しますか。\nはい、します。", "おかあさん／でんわ／します（はい）")
    ]
  },
  {
    id: "l8-p1-a6",
    section: "practice_1",
    order: 6,
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
          before: "何で 本を 送りましたか。（航空便）",
          beforeKana: "なんで ほんを おくりましたか。（こうくうびん）",
          after: [text("航空便で 送りました。")],
          afterKana: "こうくうびんで おくりました。"
        }
      }
    ],
    items: [
      answerItem("l8-p1-a6-q1", "1", "キムさんに 何を 習いましたか。（韓国語）", "韓国語を 習いました。", {
        promptKana: "キムさんに なにを ならいましたか。（かんこくご）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l8-p1-a6-q2", "2", "何で 名前と 住所を 書きましたか。（ボールペン）", "ボールペンで 書きました。", {
        promptKana: "なんで なまえと じゅうしょを かきましたか。（ボールペン）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l8-p1-a6-q3", "3", "昼休みに だれと テニスを しましたか。（小野さん）", "小野さんと しました。", {
        promptKana: "ひるやすみに だれと テニスを しましたか。（おのさん）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      }),
      answerItem("l8-p1-a6-q4", "4", "駅で だれに 会いましたか。（スミスさん）", "スミスさんに 会いました。", {
        promptKana: "えきで だれに あいましたか。（スミスさん）",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint
      })
    ]
  },
  {
    id: "l8-p1-a7",
    section: "practice_1",
    order: 7,
    title: "边看下面的表格边听录音，仿照例句在正确答案上画○。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 7),
      label: "第8课 练习I-7",
      transcript: {
        text: "もう プレゼントを 買いましたか。いいえ。もう 小野さんと 映画を 見ましたか。はい。もう JC企画に ファックスを 送りましたか。はい。もう 李さんに 手紙を 書きましたか。いいえ。もう 森さんに 飛行機の チケットを もらいましたか。いいえ。もう スミスさんに デジカメを 借りましたか。はい。もう 吉田さんに 電話しましたか。はい。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按教材表格顺序校正。",
        segments: [
          { itemNumber: "例1", text: "もう プレゼントを 買いましたか。いいえ。" },
          { itemNumber: "例2", text: "もう 小野さんと 映画を 見ましたか。はい。" },
          { itemNumber: "1", text: "もう JC企画に ファックスを 送りましたか。はい。" },
          { itemNumber: "2", text: "もう 李さんに 手紙を 書きましたか。いいえ。" },
          { itemNumber: "3", text: "もう 森さんに 飛行機の チケットを もらいましたか。いいえ。" },
          { itemNumber: "4", text: "もう スミスさんに デジカメを 借りましたか。はい。" },
          { itemNumber: "5", text: "もう 吉田さんに 電話しましたか。はい。" }
        ]
      }
    },
    assets: [crop("l8-p1-a7-completion-table")],
    displayAssets: ["l8-p1-a7-completion-table"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "もう プレゼントを 買いましたか。",
          beforeKana: "もう プレゼントを かいましたか。",
          after: [text("いいえ")],
          afterKana: "いいえ"
        }
      },
      {
        type: "example",
        content: {
          label: "",
          before: "もう 小野さんと 映画を 見ましたか。",
          beforeKana: "もう おのさんと えいがを みましたか。",
          after: [text("はい")],
          afterKana: "はい"
        }
      }
    ],
    items: [
      choiceItem("l8-p1-a7-q1", "1", "もう JC企画に ファックスを 送りましたか。", "yes", "もう ジェーシーきかくに ファックスを おくりましたか。"),
      choiceItem("l8-p1-a7-q2", "2", "もう 李さんに 手紙を 書きましたか。", "no", "もう りさんに てがみを かきましたか。"),
      choiceItem("l8-p1-a7-q3", "3", "もう 森さんに 飛行機の チケットを もらいましたか。", "no", "もう もりさんに ひこうきの チケットを もらいましたか。"),
      choiceItem("l8-p1-a7-q4", "4", "もう スミスさんに デジカメを 借りましたか。", "yes", "もう スミスさんに デジカメを かりましたか。"),
      choiceItem("l8-p1-a7-q5", "5", "もう 吉田さんに 電話しましたか。", "yes", "もう よしださんに でんわしましたか。")
    ]
  },
  {
    id: "l8-p2-a1",
    section: "practice_2",
    order: 1,
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
          before: "{これ／です／の／わたし／本／は}",
          beforeKana: "{これ／です／の／わたし／ほん／は}",
          after: [text("これは わたしの 本です。")],
          afterKana: "これは わたしの ほんです。"
        }
      }
    ],
    items: [
      answerItem("l8-p2-a1-q1", "1", "{を／か／送りました／誕生日に／何／李さんの}", "李さんの 誕生日に 何を 送りましたか。", { promptKana: "{を／か／おくりました／たんじょうびに／なに／りさんの}" }),
      answerItem("l8-p2-a1-q2", "2", "{で／を／と／住所／ボールペン／書きます／名前}", "ボールペンで 名前と 住所を 書きます。", { promptKana: "{で／を／と／じゅうしょ／ボールペン／かきます／なまえ}" }),
      answerItem("l8-p2-a1-q3", "3", "{に／で／に／先生／10時／会います／学校}", "10時に 学校で 先生に 会います。", { promptKana: "{に／で／に／せんせい／じゅうじ／あいます／がっこう}" })
    ]
  },
  {
    id: "l8-p2-a2",
    section: "practice_2",
    order: 2,
    title: "从□中选择适当的词语填入（　　　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("誕生日は（"), blank("example"), text("）ですか。——明日です。")],
          beforeKana: "たんじょうびは（いつ）ですか。——あしたです。",
          after: [text("いつ")],
          afterKana: "いつ"
        }
      },
      {
        type: "word_bank",
        words: [text("もう"), text("どこで"), text("何で", { kana: "なんで" }), text("だれに"), text("何も", { kana: "なにも" })]
      }
    ],
    items: [
      blankItem("l8-p2-a2-q1", "1", [text("その プレゼントを（"), blank("answer"), text("）あげますか。——森さんに あげます。")], { answer: "だれに" }, "その プレゼントを（  ）あげますか。——もりさんに あげます。"),
      blankItem("l8-p2-a2-q2", "2", [text("その プレゼントを（"), blank("answer"), text("）送りますか。——航空便で 送ります。")], { answer: "何で" }, "その プレゼントを（  ）おくりますか。——こうくうびんで おくります。"),
      blankItem("l8-p2-a2-q3", "3", [text("（"), blank("answer"), text("）食べませんでしたか。——ええ、食べませんでした。")], { answer: "何も" }, "（  ）たべませんでしたか。——ええ、たべませんでした。"),
      blankItem("l8-p2-a2-q4", "4", [text("その 地図を（"), blank("answer"), text("）もらいましたか。——駅で もらいました。")], { answer: "どこで" }, "その ちずを（  ）もらいましたか。——えきで もらいました。")
    ]
  },
  {
    id: "l8-p2-a3",
    section: "practice_2",
    order: 3,
    title: "将□中的词语变成适当的形式填在＿＿＿上。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "李さんは 小野さんに お茶を あげました。",
          beforeKana: "りさんは おのさんに おちゃを あげました。",
          after: [text("小野さんは 李さんに お茶を もらいました。")],
          afterKana: "おのさんは りさんに おちゃを もらいました。"
        }
      },
      {
        type: "word_bank",
        words: [text("あげます"), text("貸します", { kana: "かします" }), text("教えます", { kana: "おしえます" }), text("もらいます")]
      }
    ],
    items: [
      transformVerbItem("l8-p2-a3-q1", "1", [text("わたしは キムさんに 韓国語を 習います。= キムさんは わたしに 韓国語を "), blank("answer"), text("。")], "教えます", "わたしは キムさんに かんこくごを ならいます。= キムさんは わたしに かんこくごを ______。"),
      transformVerbItem("l8-p2-a3-q2", "2", [text("小野さんは 李さんに シルクの ハンカチを もらいました。= 李さんは 小野さんに シルクの ハンカチを "), blank("answer"), text("。")], "あげました", "おのさんは りさんに シルクの ハンカチを もらいました。= りさんは おのさんに シルクの ハンカチを ______。"),
      transformVerbItem("l8-p2-a3-q3", "3", [text("田中さんは 森さんに 自転車を 借りました。= 森さんは 田中さんに 自転車を "), blank("answer"), text("。")], "貸しました", "たなかさんは もりさんに じてんしゃを かりました。= もりさんは たなかさんに じてんしゃを ______。")
    ]
  },
  {
    id: "l8-p2-a4",
    section: "practice_2",
    order: 4,
    title: "听录音回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "word",
    responseScope: "custom",
    responseScopeHint: "只填写每个问题的括号答案，不需要重写问题。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 4),
      label: "第8课 练习II-4",
      transcript: {
        text: "李さんは お母さんに 手紙を 書きました。航空便で 送りました。今日は 森さんの 誕生日です。李さんに CDを もらいました。小野さんに 靴を もらいました。小野さんは さっき 長島さんに 会いました。図書室で 会いました。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按题目问答校正。",
        segments: [
          { itemNumber: "例", text: "李さんは お母さんに 手紙を 書きました。航空便で 送りました。" },
          { itemNumber: "1", text: "今日は 森さんの 誕生日です。李さんに CDを もらいました。小野さんに 靴を もらいました。" },
          { itemNumber: "2", text: "小野さんは さっき 長島さんに 会いました。図書室で 会いました。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "①李さんは だれに 手紙を 書きましたか。 ②何で 送りましたか。",
          beforeKana: "いち りさんは だれに てがみを かきましたか。 に なんで おくりましたか。",
          after: [text("①お母さん　②航空便")],
          afterKana: "いち おかあさん　に こうくうびん"
        }
      }
    ],
    items: [
      slotItem("l8-p2-a4-q1", "1", "①森さんは だれに CDを もらいましたか。　②小野さんは 森さんに 何を あげましたか。", [
        { id: "first", expectedUnit: "word", width: "medium", placeholder: "①" },
        { id: "second", expectedUnit: "word", width: "medium", placeholder: "②" }
      ], { first: "李さん", second: "靴" }, {
        promptKana: "いち もりさんは だれに シーディーを もらいましたか。 に おのさんは もりさんに なにを あげましたか。",
        answerSource: "audio",
        responseScope: "custom",
        responseScopeHint: "只填写两个括号答案。"
      }),
      slotItem("l8-p2-a4-q2", "2", "①小野さんは だれに 会いましたか。　②どこで 会いましたか。", [
        { id: "first", expectedUnit: "word", width: "medium", placeholder: "①" },
        { id: "second", expectedUnit: "word", width: "medium", placeholder: "②" }
      ], { first: "長島さん", second: "図書室" }, {
        promptKana: "いち おのさんは だれに あいましたか。 に どこで あいましたか。",
        answerSource: "audio",
        responseScope: "custom",
        responseScopeHint: "只填写两个括号答案。"
      })
    ]
  },
  {
    id: "l8-p2-a5",
    section: "practice_2",
    order: 5,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l8-p2-a5-q1", "1", "我送给小野女士礼物。", "わたしは 小野さんに プレゼントを あげます。", { answerSource: "prompt" }),
      answerItem("l8-p2-a5-q2", "2", "我从长岛先生那儿得到的小册子。", "わたしは 長島さんに パンフレットを もらいました。", { answerSource: "prompt" }),
      answerItem("l8-p2-a5-q3", "3", "用航空邮件给妈妈寄了生日礼物。", "航空便で 母に 誕生日の プレゼントを 送りました。", { answerSource: "prompt" })
    ]
  }
];

export const lesson8Practice: LessonPractice = {
  lessonId: "lesson8",
  title: "第8課 李さんは 日本語で 手紙を 書きます",
  sourcePages: [
    { pageNo: 104, imagePath: page(104) },
    { pageNo: 105, imagePath: page(105) },
    { pageNo: 106, imagePath: page(106) }
  ],
  activities
};
