import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";
import { lesson19ImageCrops } from "./lesson19-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson19/page${pageNo}.webp`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });
const crop = (id: string) => lesson19ImageCrops.assets.find((asset) => asset.id === id)!;

const completionHint = "只补全题目中空格处需要填写的部分。";
const sentenceSlot = (placeholder = "输入完整回答"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
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
  answerSource: "prompt",
  responseScope: "phrase_only",
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
    placeholder?: string;
    rows?: number;
    acceptableAlternatives?: string[];
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
  inputSlots: sentenceSlot(options.placeholder || "输入完整回答"),
  answer: { slotValues: { answer }, acceptableAlternatives: options.acceptableAlternatives }
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

const trueFalseItem = (id: string, number: string, prompt: string, value: boolean, promptKana?: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "prompt",
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
    title: "将“ます形”变为“ない形”。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: completionHint,
    assets: [crop("l19-page232-full")],
    displayAssets: ["l19-page232-full"],
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
    assets: [crop("l19-page232-full")],
    displayAssets: ["l19-page232-full"],
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
      answerItem("l19-p1-a2-q1", "1", "ここで 写真を 撮ります", "ここで 写真を 撮らないで ください。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "ここで しゃしんを とります"
      }),
      answerItem("l19-p1-a2-q2", "2", "駅で タバコを 吸います", "駅で タバコを 吸わないで ください。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "えきで タバコを すいます"
      }),
      answerItem("l19-p1-a2-q3", "3", "この 部屋に 入ります", "この 部屋に 入らないで ください。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "この へやに はいります"
      }),
      answerItem("l19-p1-a2-q4", "4", "ここに 車を 止めます", "ここに 車を 止めないで ください。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "ここに くるまを とめます"
      })
    ]
  },
  {
    id: "l19-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    responseScopeHint: "写出完整句子。",
    assets: [crop("l19-page232-full"), crop("l19-page233-full")],
    displayAssets: ["l19-page232-full", "l19-page233-full"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例1]",
          before: "今日 早く 帰ります",
          beforeKana: "きょう はやく かえります",
          after: [text("今日 早く 帰らなければ なりません。")],
          afterKana: "きょう はやく かえらなければ なりません。"
        }
      },
      {
        type: "example",
        content: {
          label: "[例2]",
          before: "レポートを 書きます",
          beforeKana: "レポートを かきます",
          after: [text("レポートを 書かなくても いいです。")],
          afterKana: "レポートを かかなくても いいです。"
        }
      }
    ],
    items: [
      answerItem("l19-p1-a3-q1", "1", "中国へ 電話を かけます", "中国へ 電話を かけなければ なりません。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "ちゅうごくへ でんわを かけます"
      }),
      answerItem("l19-p1-a3-q2", "2", "図書館の 本を 返します", "図書館の 本を 返さなければ なりません。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "としょかんの ほんを かえします"
      }),
      answerItem("l19-p1-a3-q3", "3", "部屋を きれいに します", "部屋を きれいに しなければ なりません。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "へやを きれいに します"
      }),
      answerItem("l19-p1-a3-q4", "4", "パスポートを 見せます", "パスポートを 見せなければ なりません。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "パスポートを みせます"
      }),
      answerItem("l19-p1-a3-q5", "5", "会社を 大きく します", "会社を 大きく しなければ なりません。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "かいしゃを おおきく します"
      }),
      answerItem("l19-p1-a3-q6", "6", "1日に 3回 薬を 飲みます", "1日に 3回 薬を 飲まなければ なりません。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "いちにちに さんかい くすりを のみます"
      }),
      answerItem("l19-p1-a3-q7", "7", "お皿を 洗います", "お皿を 洗わなくても いいです。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "おさらを あらいます"
      }),
      answerItem("l19-p1-a3-q8", "8", "仕事を します", "仕事を しなくても いいです。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "しごとを します"
      }),
      answerItem("l19-p1-a3-q9", "9", "テレビを 消します", "テレビを 消さなくても いいです。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "テレビを けします"
      }),
      answerItem("l19-p1-a3-q10", "10", "荷物を 運びます", "荷物を 運ばなくても いいです。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "にもつを はこびます"
      }),
      answerItem("l19-p1-a3-q11", "11", "今日 残業します", "今日 残業しなくても いいです。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "きょう ざんぎょうします"
      }),
      answerItem("l19-p1-a3-q12", "12", "歌を 歌います", "歌を 歌わなくても いいです。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "うたを うたいます"
      }),
      answerItem("l19-p1-a3-q13", "13", "靴を 脱ぎます", "靴を 脱がなくても いいです。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "くつを ぬぎます"
      }),
      answerItem("l19-p1-a3-q14", "14", "部長を 待ちます", "部長を 待たなくても いいです。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "ぶちょうを まちます"
      }),
      answerItem("l19-p1-a3-q15", "15", "明日 学校に 来ます", "明日 学校に 来なくても いいです。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        promptKana: "あした がっこうに きます"
      })
    ]
  },
  {
    id: "l19-p1-a4",
    section: "practice_1",
    order: 4,
    title: "仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    assets: [crop("l19-page233-full")],
    displayAssets: ["l19-page233-full"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例1]",
          before: "ここで 走ります",
          beforeKana: "ここで はしります",
          after: [text("甲：あのう、ちょっと…。\n乙：何ですか。\n甲：すみませんが、ここで 走らないで ください。\n乙：はい。")],
          afterKana: "あのう、ちょっと…。\nなんですか。\nすみませんが、ここで はしらないで ください。\nはい。"
        }
      },
      {
        type: "example",
        content: {
          label: "[例2]",
          before: "食事／レポートを 書きます",
          beforeKana: "しょくじ／レポートを かきます",
          after: [text("甲：いっしょに 食事に 行きませんか。\n乙：すみません。今日は ちょっと… レポートを 書かなければ なりません。\n甲：そうですか。じゃあ、また 今度。")],
          afterKana: "いっしょに しょくじに いきませんか。\nすみません。きょうは ちょっと… レポートを かかなければ なりません。\nそうですか。じゃあ、また こんど。"
        }
      },
      {
        type: "example",
        content: {
          label: "[例3]",
          before: "吉田さん／男の 人",
          beforeKana: "よしださん／おとこの ひと",
          after: [text("甲：あのう、吉田さんは どの 人ですか。\n乙：あの 男の 人が 吉田さんです。")],
          afterKana: "あのう、よしださんは どの ひとですか。\nあの おとこの ひとが よしださんです。"
        }
      }
    ],
    itemGroups: [
      {
        id: "l19-p1-a4-g1",
        title: "[例1]",
        example: {
          label: "[例1]",
          before: "ここで 走ります",
          beforeKana: "ここで はしります",
          after: [text("甲：あのう、ちょっと…。乙：何ですか。甲：すみませんが、ここで 走らないで ください。乙：はい。")],
          afterKana: "あのう、ちょっと…。 なんですか。 すみませんが、ここで はしらないで ください。 はい。"
        },
        items: [
          dialogueItem("l19-p1-a4-q1", "1", "そこに 立ちます", "甲：あのう、ちょっと…。\n乙：何ですか。\n甲：すみませんが、そこに 立たないで ください。\n乙：はい。", { promptKana: "そこに たちます" }),
          dialogueItem("l19-p1-a4-q2", "2", "その パソコンを 使います", "甲：あのう、ちょっと…。\n乙：何ですか。\n甲：すみませんが、その パソコンを 使わないで ください。\n乙：はい。", { promptKana: "その パソコンを つかいます" }),
          dialogueItem("l19-p1-a4-q3", "3", "大きい 声で 話します", "甲：あのう、ちょっと…。\n乙：何ですか。\n甲：すみませんが、大きい 声で 話さないで ください。\n乙：はい。", { promptKana: "おおきい こえで はなします" })
        ]
      },
      {
        id: "l19-p1-a4-g2",
        title: "[例2]",
        example: {
          label: "[例2]",
          before: "食事／レポートを 書きます",
          beforeKana: "しょくじ／レポートを かきます",
          after: [text("甲：いっしょに 食事に 行きませんか。\n乙：すみません。今日は ちょっと… レポートを 書かなければ なりません。\n甲：そうですか。じゃあ、また 今度。")],
          afterKana: "いっしょに しょくじに いきませんか。 すみません。 きょうは ちょっと… レポートを かかなければ なりません。 そうですか。 じゃあ、また こんど。"
        },
        items: [
          dialogueItem("l19-p1-a4-q4", "4", "映画／病院へ 行きます", "甲：いっしょに 映画を 見に 行きませんか。\n乙：すみません。今日は ちょっと… 病院へ 行かなければ なりません。\n甲：そうですか。じゃあ、また 今度。", { promptKana: "えいが／びょういんへ いきます" }),
          dialogueItem("l19-p1-a4-q5", "5", "コンサート／残業します", "甲：いっしょに コンサートへ 行きませんか。\n乙：すみません。今日は ちょっと… 残業しなければ なりません。\n甲：そうですか。じゃあ、また 今度。", { promptKana: "コンサート／ざんぎょうします" }),
          dialogueItem("l19-p1-a4-q6", "6", "カラオケ／明日 試験が ありますから、今晩 勉強します", "甲：いっしょに カラオケへ 行きませんか。\n乙：すみません。明日 試験が ありますから、今晩 勉強しなければ なりません。\n甲：そうですか。じゃあ、また 今度。", { promptKana: "カラオケ／あした しけんが ありますから、こんばん べんきょうします" })
        ]
      },
      {
        id: "l19-p1-a4-g3",
        title: "[例3]",
        example: {
          label: "[例3]",
          before: "吉田さん／男の 人",
          beforeKana: "よしださん／おとこの ひと",
          after: [text("甲：あのう、吉田さんは どの 人ですか。\n乙：あの 男の 人が 吉田さんです。")],
          afterKana: "あのう、よしださんは どの ひとですか。 あの おとこの ひとが よしださんです。"
        },
        items: [
          dialogueItem("l19-p1-a4-q7", "7", "スミスさん／若い 男の 人", "甲：あのう、スミスさんは どの 人ですか。\n乙：あの 若い 男の 人が スミスさんです。", { promptKana: "スミスさん／わかい おとこの ひと" }),
          dialogueItem("l19-p1-a4-q8", "8", "李さん／女の 人", "甲：あのう、李さんは どの 人ですか。\n乙：あの 女の 人が 李さんです。", { promptKana: "りさん／おんなの ひと" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l19-p2-a1",
    section: "practice_2",
    order: 1,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [crop("l19-page234-full")],
    displayAssets: ["l19-page234-full"],
    layout: [],
    items: [
      answerItem("l19-p2-a1-q1", "1", "请别忘了房间钥匙。", "部屋の かぎを 忘れないで ください。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        acceptableAlternatives: ["部屋のかぎを 忘れないでください。", "部屋の かぎを忘れないでください。"]
      }),
      answerItem("l19-p2-a1-q2", "2", "李先生今天必须早点儿回家。", "李さんは 今日 早く 帰らなければ なりません。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        acceptableAlternatives: ["李さんは今日 早く 帰らなければなりません。", "李さんは 今日 早く帰らなければなりません。"]
      }),
      answerItem("l19-p2-a1-q3", "3", "明天不加班也可以。", "明日は 残業しなくても いいですよ。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        acceptableAlternatives: ["明日は残業しなくてもいいですよ。", "明日は 残業しなくてもいいです。"]
      }),
      answerItem("l19-p2-a1-q4", "4", "那个人就是吉田科长。", "あの 人が 吉田課長ですよ。", {
        answerSource: "prompt",
        responseScope: "sentence_only",
        acceptableAlternatives: ["あの人が 吉田課長ですよ。", "あの 人が吉田課長ですよ。"]
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
