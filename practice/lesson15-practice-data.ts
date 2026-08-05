import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";
import { lesson15ImageCrops } from "./lesson15-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson15/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit4/lesson15/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });
const crop = (id: string) => lesson15ImageCrops.assets.find((asset) => asset.id === id)!;

const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
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
  responseScope: "question_and_answer",
  responseScopeHint: "写出完整问答。",
  inputSlots: dialogueSlot("输入完整问答", rows),
  answer: { slotValues: { answer } },
  renderHint: "dialogue"
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
  responseScopeHint: options.responseScopeHint,
  inputSlots: shortSlots(Object.keys(answers), options.expectedUnit),
  answer: { slotValues: answers }
});

const teClassChoices = [
  { id: "godan_ite_ide", label: "一类动词：—いて／—いで" },
  { id: "godan_n_de", label: "一类动词：—んで" },
  { id: "godan_shite", label: "一类动词：—して" },
  { id: "godan_tte", label: "一类动词：—って" },
  { id: "ichidan", label: "二类动词：—て" },
  { id: "suru_kuru", label: "三类动词：して／来て" }
];

const teClassItem = (id: string, number: string, prompt: string, answerChoiceId: string, promptKana?: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "prompt",
  responseScope: "choice_only",
  choices: teClassChoices,
  answer: { choiceIds: [answerChoiceId] }
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
  answerSource: "prompt",
  responseScope: "choice_only",
  choices,
  answer: { choiceIds: [answerChoiceId] }
});

const trueFalseItem = (id: string, number: string, prompt: string, value: boolean, promptKana?: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "audio",
  responseScope: "boolean_only",
  choices: [
    { id: "true", label: "○" },
    { id: "false", label: "×" }
  ],
  answer: { boolean: value, choiceIds: [value ? "true" : "false"] }
});

const activities: PracticeActivity[] = [
  {
    id: "l15-p1-a1",
    section: "practice_1",
    order: 1,
    title: "看图，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    assets: [crop("l15-p1-a1-current-action-picture")],
    displayAssets: ["l15-p1-a1-current-action-picture"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "何を して いますか。①",
          beforeKana: "なにを して いますか。いち",
          after: [text("テレビを 見て います。")],
          afterKana: "テレビを みて います。"
        }
      }
    ],
    items: [
      answerItem("l15-p1-a1-q1", "1", "②", "新聞を 読んで います。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l15-p1-a1-q2", "2", "③", "お茶を 飲んで います。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l15-p1-a1-q3", "3", "④", "タバコを 吸って います。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l15-p1-a1-q4", "4", "⑤", "英語で 話して います。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l15-p1-a1-q5", "5", "⑥", "電話を かけて います。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l15-p1-a1-q6", "6", "⑦", "手紙を 書いて います。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint })
    ]
  },
  {
    id: "l15-p1-a2",
    section: "practice_1",
    order: 2,
    title: "仿照例子给下列动词分类。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    assets: [crop("l15-p1-a2-te-form-classification-chart")],
    displayAssets: ["l15-p1-a2-te-form-classification-chart"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "書きます",
          beforeKana: "かきます",
          after: [text("一类动词：—いて／—いで")],
          afterKana: "かいて"
        }
      }
    ],
    items: [
      teClassItem("l15-p1-a2-q1", "1", "待ちます", "godan_tte", "まちます"),
      teClassItem("l15-p1-a2-q2", "2", "食べます", "ichidan", "たべます"),
      teClassItem("l15-p1-a2-q3", "3", "勉強します", "suru_kuru", "べんきょうします"),
      teClassItem("l15-p1-a2-q4", "4", "使います", "godan_tte", "つかいます"),
      teClassItem("l15-p1-a2-q5", "5", "止めます", "ichidan", "とめます"),
      teClassItem("l15-p1-a2-q6", "6", "読みます", "godan_n_de", "よみます"),
      teClassItem("l15-p1-a2-q7", "7", "あげます", "ichidan"),
      teClassItem("l15-p1-a2-q8", "8", "撮ります", "godan_tte", "とります"),
      teClassItem("l15-p1-a2-q9", "9", "聞きます", "godan_ite_ide", "ききます"),
      teClassItem("l15-p1-a2-q10", "10", "見ます", "ichidan", "みます"),
      teClassItem("l15-p1-a2-q11", "11", "行きます", "godan_tte", "いきます"),
      teClassItem("l15-p1-a2-q12", "12", "遊びます", "godan_n_de", "あそびます"),
      teClassItem("l15-p1-a2-q13", "13", "歌います", "godan_tte", "うたいます"),
      teClassItem("l15-p1-a2-q14", "14", "話します", "godan_shite", "はなします"),
      teClassItem("l15-p1-a2-q15", "15", "来ます", "suru_kuru", "きます"),
      teClassItem("l15-p1-a2-q16", "16", "買い物します", "suru_kuru", "かいものします"),
      teClassItem("l15-p1-a2-q17", "17", "閉めます", "ichidan", "しめます"),
      teClassItem("l15-p1-a2-q18", "18", "入ります", "godan_tte", "はいります"),
      teClassItem("l15-p1-a2-q19", "19", "消します", "godan_shite", "けします"),
      teClassItem("l15-p1-a2-q20", "20", "死にます", "godan_n_de", "しにます"),
      teClassItem("l15-p1-a2-q21", "21", "歩きます", "godan_ite_ide", "あるきます"),
      teClassItem("l15-p1-a2-q22", "22", "洗います", "godan_tte", "あらいます"),
      teClassItem("l15-p1-a2-q23", "23", "借ります", "ichidan", "かります"),
      teClassItem("l15-p1-a2-q24", "24", "教えます", "ichidan", "おしえます"),
      teClassItem("l15-p1-a2-q25", "25", "泳ぎます", "godan_ite_ide", "およぎます")
    ]
  },
  {
    id: "l15-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "custom",
    responseScopeHint: "按对应例句写出完整问答或完整句子。",
    layout: [],
    itemGroups: [
      {
        id: "l15-p1-a3-g1",
        example: {
          id: "l15-p1-a3-ex1",
          label: "[例1]",
          before: "座ります",
          beforeKana: "すわります",
          after: [text("座っても いいですか。——はい、座っても いいですよ。")],
          afterKana: "すわっても いいですか。——はい、すわっても いいですよ。"
        },
        items: [
          dialogueItem("l15-p1-a3-q1", "1", "見ます", "見ても いいですか。\nはい、見ても いいですよ。", "みます", 3),
          dialogueItem("l15-p1-a3-q2", "2", "使います", "使っても いいですか。\nはい、使っても いいですよ。", "つかいます", 3),
          dialogueItem("l15-p1-a3-q3", "3", "閉めます", "閉めても いいですか。\nはい、閉めても いいですよ。", "しめます", 3),
          dialogueItem("l15-p1-a3-q4", "4", "入ります", "入っても いいですか。\nはい、入っても いいですよ。", "はいります", 3)
        ]
      },
      {
        id: "l15-p1-a3-g2",
        example: {
          id: "l15-p1-a3-ex2",
          label: "[例2]",
          before: "自転車／借ります。",
          beforeKana: "じてんしゃ／かります。",
          after: [text("自転車を 借りても いいですか。——はい、どうぞ。")],
          afterKana: "じてんしゃを かりても いいですか。——はい、どうぞ。"
        },
        items: [
          dialogueItem("l15-p1-a3-q5", "5", "この パンフレット／もらいます", "この パンフレットを もらっても いいですか。\nはい、どうぞ。", "この パンフレット／もらいます", 3),
          dialogueItem("l15-p1-a3-q6", "6", "クーラー／つけます", "クーラーを つけても いいですか。\nはい、どうぞ。", "クーラー／つけます", 3),
          dialogueItem("l15-p1-a3-q7", "7", "この 新聞／読みます", "この 新聞を 読んでも いいですか。\nはい、どうぞ。", "この しんぶん／よみます", 3),
          dialogueItem("l15-p1-a3-q8", "8", "この 水／飲みます", "この 水を 飲んでも いいですか。\nはい、どうぞ。", "この みず／のみます", 3)
        ]
      },
      {
        id: "l15-p1-a3-g3",
        example: {
          id: "l15-p1-a3-ex3",
          label: "[例3]",
          before: "ここで パンを 食べます。",
          beforeKana: "ここで パンを たべます。",
          after: [text("ここで パンを 食べては いけません。")],
          afterKana: "ここで パンを たべては いけません。"
        },
        items: [
          answerItem("l15-p1-a3-q9", "9", "ここに 座ります。", "ここに 座っては いけません。", { promptKana: "ここに すわります。", responseScope: "sentence_only" }),
          answerItem("l15-p1-a3-q10", "10", "公園で バーベキューを します。", "公園で バーベキューを しては いけません。", { promptKana: "こうえんで バーベキューを します。", responseScope: "sentence_only" }),
          answerItem("l15-p1-a3-q11", "11", "図書館で 話します。", "図書館で 話しては いけません。", { promptKana: "としょかんで はなします。", responseScope: "sentence_only" }),
          answerItem("l15-p1-a3-q12", "12", "ここを 左に 曲がります。", "ここを 左に 曲がっては いけません。", { promptKana: "ここを ひだりに まがります。", responseScope: "sentence_only" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l15-p1-a4",
    section: "practice_1",
    order: 4,
    title: "仿照例句，用「　　」中的词语完成句子。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("「禁煙」：タバコを（"), blank("example"), text("）は いけません。［吸います］")],
          beforeKana: "「きんえん」：タバコを（______）は いけません。［すいます］",
          after: [text("吸って")],
          afterKana: "すって"
        }
      }
    ],
    items: [
      blankItem("l15-p1-a4-q1", "1", [text("「駐車禁止」：車を（"), blank("answer"), text("）は いけません。［止めます］")], { answer: "止めて" }, { promptKana: "「ちゅうしゃきんし」：くるまを（______）は いけません。［とめます］", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l15-p1-a4-q2", "2", [text("「立入禁止」：ここに（"), blank("answer"), text("）は いけません。［入ります］")], { answer: "入って" }, { promptKana: "「たちいりきんし」：ここに（______）は いけません。［はいります］", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l15-p1-a4-q3", "3", [text("「火気厳禁」：火を（"), blank("answer"), text("）は いけません。［使います］")], { answer: "使って" }, { promptKana: "「かきげんきん」：ひを（______）は いけません。［つかいます］", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l15-p1-a4-q4", "4", [text("「撮影禁止」：写真を（"), blank("answer"), text("）は いけません。［撮ります］")], { answer: "撮って" }, { promptKana: "「さつえいきんし」：しゃしんを（______）は いけません。［とります］", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" })
    ]
  },
  {
    id: "l15-p1-a5",
    section: "practice_1",
    order: 5,
    title: "边看第 1 题的图边听录音，写入相应的图号。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: "填写对应图片编号。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 5),
      label: "第15课 练习I-5",
      transcript: {
        text: "お茶を 飲んで います。テレビを 見て います。新聞を 読んで います。電話を かけて います。手紙を 書いて います。英語で 話して います。タバコを 吸って います。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按题面和图片编号人工整理。",
        segments: [
          { itemNumber: "例", text: "お茶を 飲んで います。" },
          { itemNumber: "1", text: "テレビを 見て います。" },
          { itemNumber: "2", text: "新聞を 読んで います。" },
          { itemNumber: "3", text: "電話を かけて います。" },
          { itemNumber: "4", text: "手紙を 書いて います。" },
          { itemNumber: "5", text: "英語で 話して います。" },
          { itemNumber: "6", text: "タバコを 吸って います。" }
        ]
      }
    },
    assets: [crop("l15-p1-a1-current-action-picture")],
    displayAssets: ["l15-p1-a1-current-action-picture"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "お茶を 飲んで います",
          beforeKana: "おちゃを のんで います",
          after: [text("③")],
          afterKana: "さん"
        }
      }
    ],
    items: [
      blankItem("l15-p1-a5-q1", "1", "听录音并写图号。", { answer: "1" }, { answerSource: "audio", responseScope: "word_only", responseScopeHint: "填写对应图片编号。", expectedUnit: "number" }),
      blankItem("l15-p1-a5-q2", "2", "听录音并写图号。", { answer: "2" }, { answerSource: "audio", responseScope: "word_only", responseScopeHint: "填写对应图片编号。", expectedUnit: "number" }),
      blankItem("l15-p1-a5-q3", "3", "听录音并写图号。", { answer: "6" }, { answerSource: "audio", responseScope: "word_only", responseScopeHint: "填写对应图片编号。", expectedUnit: "number" }),
      blankItem("l15-p1-a5-q4", "4", "听录音并写图号。", { answer: "7" }, { answerSource: "audio", responseScope: "word_only", responseScopeHint: "填写对应图片编号。", expectedUnit: "number" }),
      blankItem("l15-p1-a5-q5", "5", "听录音并写图号。", { answer: "5" }, { answerSource: "audio", responseScope: "word_only", responseScopeHint: "填写对应图片编号。", expectedUnit: "number" }),
      blankItem("l15-p1-a5-q6", "6", "听录音并写图号。", { answer: "4" }, { answerSource: "audio", responseScope: "word_only", responseScopeHint: "填写对应图片编号。", expectedUnit: "number" })
    ]
  },
  {
    id: "l15-p1-a6",
    section: "practice_1",
    order: 6,
    title: "听录音，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: "根据题目给出的“はい/いいえ”，只补全后面的回答部分。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 6),
      label: "第15课 练习I-6",
      transcript: {
        text: "今、ケーキを 食べて いますか。はい。はい、食べて います。いいえ。いいえ、食べて いません。今、新聞を 読んで いますか。はい。はい、読んで います。今、歌を 歌って いますか。いいえ。いいえ、歌って いません。今、日本語を 勉強して いますか。はい。はい、勉強して います。今、パソコンを 使って いますか。いいえ。いいえ、使って いません。今、タバコを 吸って いますか。はい。はい、吸って います。今、お酒を 飲んで いますか。いいえ。いいえ、飲んで いません。この 電話を 使っても いいですか。はい。はい、使っても いいです。いいえ。いいえ、使っては いけません。この パソコンを 使っても いいですか。はい。はい、使っても いいです。窓を 開けても いいですか。はい。はい、開けても いいです。これを 食べても いいですか。はい。はい、食べても いいです。ボートに 乗っても いいですか。いいえ。いいえ、乗っては いけません。この 部屋に 入っても いいですか。いいえ。いいえ、入っては いけません。タバコを 吸っても いいですか。いいえ。いいえ、吸っては いけません。",
        source: "manual",
        confidenceNote: "Azure STT 识别后，后半段按分段转写补齐并人工校正。",
        segments: [
          { itemNumber: "例1-はい", text: "今、ケーキを 食べて いますか。はい。はい、食べて います。" },
          { itemNumber: "例1-いいえ", text: "今、ケーキを 食べて いますか。いいえ。いいえ、食べて いません。" },
          { itemNumber: "1", text: "今、新聞を 読んで いますか。はい。はい、読んで います。" },
          { itemNumber: "2", text: "今、歌を 歌って いますか。いいえ。いいえ、歌って いません。" },
          { itemNumber: "3", text: "今、日本語を 勉強して いますか。はい。はい、勉強して います。" },
          { itemNumber: "4", text: "今、パソコンを 使って いますか。いいえ。いいえ、使って いません。" },
          { itemNumber: "5", text: "今、タバコを 吸って いますか。はい。はい、吸って います。" },
          { itemNumber: "6", text: "今、お酒を 飲んで いますか。いいえ。いいえ、飲んで いません。" },
          { itemNumber: "例2-はい", text: "この 電話を 使っても いいですか。はい。はい、使っても いいです。" },
          { itemNumber: "例2-いいえ", text: "この 電話を 使っても いいですか。いいえ。いいえ、使っては いけません。" },
          { itemNumber: "7", text: "この パソコンを 使っても いいですか。はい。はい、使っても いいです。" },
          { itemNumber: "8", text: "窓を 開けても いいですか。はい。はい、開けても いいです。" },
          { itemNumber: "9", text: "これを 食べても いいですか。はい。はい、食べても いいです。" },
          { itemNumber: "10", text: "ボートに 乗っても いいですか。いいえ。いいえ、乗っては いけません。" },
          { itemNumber: "11", text: "この 部屋に 入っても いいですか。いいえ。いいえ、入っては いけません。" },
          { itemNumber: "12", text: "タバコを 吸っても いいですか。いいえ。いいえ、吸っては いけません。" }
        ]
      }
    },
    layout: [],
    itemGroups: [
      {
        id: "l15-p1-a6-g1",
        example: {
          id: "l15-p1-a6-ex1",
          label: "[例1]",
          before: "今、ケーキを 食べて いますか。",
          beforeKana: "いま、ケーキを たべて いますか。",
          after: [text("はい、食べて います。／いいえ、食べて いません。")],
          afterKana: "はい、たべて います。／いいえ、たべて いません。"
        },
        items: [
          blankItem("l15-p1-a6-q1", "1", [text("はい、"), blank("answer"), text("。")], { answer: "読んで います" }, { answerSource: "audio", responseScope: "phrase_only" }),
          blankItem("l15-p1-a6-q2", "2", [text("いいえ、"), blank("answer"), text("。")], { answer: "歌って いません" }, { answerSource: "audio", responseScope: "phrase_only" }),
          blankItem("l15-p1-a6-q3", "3", [text("はい、"), blank("answer"), text("。")], { answer: "勉強して います" }, { answerSource: "audio", responseScope: "phrase_only" }),
          blankItem("l15-p1-a6-q4", "4", [text("いいえ、"), blank("answer"), text("。")], { answer: "使って いません" }, { answerSource: "audio", responseScope: "phrase_only" }),
          blankItem("l15-p1-a6-q5", "5", [text("はい、"), blank("answer"), text("。")], { answer: "吸って います" }, { answerSource: "audio", responseScope: "phrase_only" }),
          blankItem("l15-p1-a6-q6", "6", [text("いいえ、"), blank("answer"), text("。")], { answer: "飲んで いません" }, { answerSource: "audio", responseScope: "phrase_only" })
        ]
      },
      {
        id: "l15-p1-a6-g2",
        example: {
          id: "l15-p1-a6-ex2",
          label: "[例2]",
          before: "この 電話を 使っても いいですか。",
          beforeKana: "この でんわを つかっても いいですか。",
          after: [text("はい、使っても いいです。／いいえ、使っては いけません。")],
          afterKana: "はい、つかっても いいです。／いいえ、つかっては いけません。"
        },
        items: [
          blankItem("l15-p1-a6-q7", "7", [text("はい、"), blank("answer"), text("。")], { answer: "使っても いいです" }, { answerSource: "audio", responseScope: "phrase_only" }),
          blankItem("l15-p1-a6-q8", "8", [text("はい、"), blank("answer"), text("。")], { answer: "開けても いいです" }, { answerSource: "audio", responseScope: "phrase_only" }),
          blankItem("l15-p1-a6-q9", "9", [text("はい、"), blank("answer"), text("。")], { answer: "食べても いいです" }, { answerSource: "audio", responseScope: "phrase_only" }),
          blankItem("l15-p1-a6-q10", "10", [text("いいえ、"), blank("answer"), text("。")], { answer: "乗っては いけません" }, { answerSource: "audio", responseScope: "phrase_only" }),
          blankItem("l15-p1-a6-q11", "11", [text("いいえ、"), blank("answer"), text("。")], { answer: "入っては いけません" }, { answerSource: "audio", responseScope: "phrase_only" }),
          blankItem("l15-p1-a6-q12", "12", [text("いいえ、"), blank("answer"), text("。")], { answer: "吸っては いけません" }, { answerSource: "audio", responseScope: "phrase_only" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l15-p2-a1",
    section: "practice_2",
    order: 1,
    title: "从□中选择适当的词语，变成适当的形式填入（　　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    layout: [
      {
        type: "word_bank",
        words: [text("食べます", { kana: "たべます" }), text("止めます", { kana: "とめます" }), text("見ます", { kana: "みます" }), text("遊びます", { kana: "あそびます" }), text("します"), text("話します", { kana: "はなします" })]
      },
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("今、晩ご飯を（"), blank("example"), text("）います。")],
          beforeKana: "いま、ばんごはんを（______）います。",
          after: [text("食べて")],
          afterKana: "たべて"
        }
      }
    ],
    items: [
      blankItem("l15-p2-a1-q1", "1", [text("吉田さんは どこですか。——外です。子供と サッカーボールで（"), blank("answer"), text("）います。")], { answer: "遊んで" }, { promptKana: "よしださんは どこですか。——そとです。こどもと サッカーボールで（______）います。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l15-p2-a1-q2", "2", [text("この アルバムを（"), blank("answer"), text("）も いいですか。——はい、どうぞ。")], { answer: "見て" }, { promptKana: "この アルバムを（______）も いいですか。——はい、どうぞ。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l15-p2-a1-q3", "3", [text("李さんは 何を（"), blank("doing"), text("）いますか。——森さんと（"), blank("speaking"), text("）います。")], { doing: "して", speaking: "話して" }, { promptKana: "りさんは なにを（______）いますか。——もりさんと（______）います。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l15-p2-a1-q4", "4", [text("ここに 車を（"), blank("answer"), text("）は いけません。")], { answer: "止めて" }, { promptKana: "ここに くるまを（______）は いけません。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" })
    ]
  },
  {
    id: "l15-p2-a2",
    section: "practice_2",
    order: 2,
    title: "在（　　）中填入一个平假名。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("コーヒー（"), blank("example"), text("）飲みます。")],
          beforeKana: "コーヒー（______）のみます。",
          after: [text("を")],
          afterKana: "を"
        }
      }
    ],
    items: [
      blankItem("l15-p2-a2-q1", "1", [text("ここは 禁煙です。タバコを 吸って（"), blank("answer"), text("）いけません。")], { answer: "は" }, { promptKana: "ここは きんえんです。タバコを すって（______）いけません。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" }),
      blankItem("l15-p2-a2-q2", "2", [text("橋（"), blank("answer"), text("）渡ってから 右に 曲がります。")], { answer: "を" }, { promptKana: "はし（______）わたってから みぎに まがります。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" }),
      blankItem("l15-p2-a2-q3", "3", [text("ここで 写真を 撮って（"), blank("answer"), text("）いいですか。")], { answer: "も" }, { promptKana: "ここで しゃしんを とって（______）いいですか。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" }),
      blankItem("l15-p2-a2-q4", "4", [text("1年（"), blank("answer"), text("）何回 コンサートへ 行きますか。")], { answer: "に" }, { promptKana: "いちねん（______）なんかい コンサートへ いきますか。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" })
    ]
  },
  {
    id: "l15-p2-a3",
    section: "practice_2",
    order: 3,
    title: "在正确答案上画○。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "窓を {して・あって・しめて} ください。",
          beforeKana: "まどを {して・あって・しめて} ください。",
          after: [text("しめて")],
          afterKana: "しめて"
        }
      }
    ],
    items: [
      choiceItem("l15-p2-a3-q1", "1", "森さんが ビールを { のって・よんで・のんで } います。", [
        { id: "notte", label: "のって" },
        { id: "yonde", label: "よんで" },
        { id: "nonde", label: "のんで" }
      ], "nonde", "もりさんが ビールを { のって・よんで・のんで } います。"),
      choiceItem("l15-p2-a3-q2", "2", "李さんは 箱根の 記事を { かって・かいて・かけて } います。", [
        { id: "katte", label: "かって" },
        { id: "kaite", label: "かいて" },
        { id: "kakete", label: "かけて" }
      ], "kaite", "りさんは はこねの きじを { かって・かいて・かけて } います。"),
      choiceItem("l15-p2-a3-q3", "3", "来年 5月 中国に { きいて・きて・きって } ください。", [
        { id: "kiite", label: "きいて" },
        { id: "kite", label: "きて" },
        { id: "kitte", label: "きって" }
      ], "kite", "らいねん ごがつ ちゅうごくに { きいて・きて・きって } ください。"),
      choiceItem("l15-p2-a3-q4", "4", "森さんに 誕生日の プレゼントを { あけ・あい・あげ } ます。", [
        { id: "ake", label: "あけ" },
        { id: "ai", label: "あい" },
        { id: "age", label: "あげ" }
      ], "age", "もりさんに たんじょうびの プレゼントを { あけ・あい・あげ } ます。")
    ]
  },
  {
    id: "l15-p2-a4",
    section: "practice_2",
    order: 4,
    title: "听录音，与录音内容一致的在（　　）中画○，不一致的画×。",
    instruction: "",
    interaction: "true_false",
    answerUnit: "boolean",
    responseScope: "boolean_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 4),
      label: "第15课 练习II-4",
      transcript: {
        text: "ビールを 1杯 どうぞ。ありがとう。おいしいですね。ここで 携帯電話を 使っても いいですか。携帯電話ですか。外で 使って ください。ファックスで 送っても いいですか。そうですね。メールの ほうが いいです。森さん、自転車を 借りても いいですか。あ、今日は 自転車で 来ませんでした。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按题面人工整理。",
        segments: [
          { itemNumber: "例", text: "ビールを 1杯 どうぞ。ありがとう。おいしいですね。" },
          { itemNumber: "1", text: "ここで 携帯電話を 使っても いいですか。携帯電話ですか。外で 使って ください。" },
          { itemNumber: "2", text: "ファックスで 送っても いいですか。そうですね。メールの ほうが いいです。" },
          { itemNumber: "3", text: "森さん、自転車を 借りても いいですか。あ、今日は 自転車で 来ませんでした。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "ビールを 飲みます。",
          beforeKana: "ビールを のみます。",
          after: [text("○")],
          afterKana: "まる"
        }
      }
    ],
    items: [
      trueFalseItem("l15-p2-a4-q1", "1", "ここで 携帯電話を 使いました。", false, "ここで けいたいでんわを つかいました。"),
      trueFalseItem("l15-p2-a4-q2", "2", "メールで 送ります。", true, "メールで おくります。"),
      trueFalseItem("l15-p2-a4-q3", "3", "自転車を 借りました。", false, "じてんしゃを かりました。")
    ]
  },
  {
    id: "l15-p2-a5",
    section: "practice_2",
    order: 5,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l15-p2-a5-q1", "1", "小野女士现在正在看报纸。", "小野さんは 今 新聞を 読んで います。", { answerSource: "prompt" }),
      answerItem("l15-p2-a5-q2", "2", "（我）可以坐这儿吗？", "ここに 座っても いいですか。", { answerSource: "prompt" }),
      answerItem("l15-p2-a5-q3", "3", "这儿不能吸烟。", "ここで タバコを 吸っては いけません。", { answerSource: "prompt" })
    ]
  }
];

export const lesson15Practice: LessonPractice = {
  lessonId: "lesson15",
  title: "第15課 小野さんは 今 新聞を 読んで います",
  sourcePages: [
    { pageNo: 186, imagePath: page(186) },
    { pageNo: 187, imagePath: page(187) },
    { pageNo: 188, imagePath: page(188) }
  ],
  activities
};
