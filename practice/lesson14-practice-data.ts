import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson14/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit4/lesson14/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
const completionHint = "只补全题目中空格处需要填写的部分。";
const sentenceSlot = (placeholder = "输入完整回答"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const multilineSentenceSlot = (placeholder = "输入完整回答", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "sentence", width: "long", multiline: true, rows, placeholder }
];
const dialogueSlot = (placeholder = "输入完整对话", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows, placeholder }
];
const shortSlots = (slotIds: string[], expectedUnit: InputSlot["expectedUnit"] = "phrase"): InputSlot[] =>
  slotIds.map((slotId) => ({ id: slotId, expectedUnit, width: expectedUnit === "particle" ? "short" : "medium", placeholder: "输入词语" }));

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
  responseScope: "dialogue_only",
  inputSlots: dialogueSlot("输入完整对话", rows),
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

const choiceItem = (id: string, number: string, prompt: string, answerChoiceId: "a" | "b" | "c", promptKana?: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "audio",
  responseScope: "choice_only",
  choices: [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
    { id: "c", label: "C" }
  ],
  answer: { choiceIds: [answerChoiceId] }
});

const activities: PracticeActivity[] = [
  {
    id: "l14-p1-a1",
    section: "practice_1",
    order: 1,
    title: "看图，仿照例子练习各个动词的“て形”。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    assets: [
      { id: "l14-p1-a1-te-form-pictures", kind: "exercise_image", imagePath: exerciseImage("book1_lesson14_1_1.png") }
    ],
    displayAssets: ["l14-p1-a1-te-form-pictures"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "飲みます",
          beforeKana: "のみます",
          after: [text("飲んで")],
          afterKana: "のんで"
        }
      }
    ],
    items: [
      blankItem("l14-p1-a1-q1", "1", "書きます", { answer: "書いて" }, { promptKana: "かきます", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p1-a1-q2", "2", "買います", { answer: "買って" }, { promptKana: "かいます", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p1-a1-q3", "3", "読みます", { answer: "読んで" }, { promptKana: "よみます", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p1-a1-q4", "4", "聞きます", { answer: "聞いて" }, { promptKana: "ききます", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p1-a1-q5", "5", "見ます", { answer: "見て" }, { promptKana: "みます", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p1-a1-q6", "6", "待ちます", { answer: "待って" }, { promptKana: "まちます", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p1-a1-q7", "7", "勉強します", { answer: "勉強して" }, { promptKana: "べんきょうします", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p1-a1-q8", "8", "つけます", { answer: "つけて" }, { responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p1-a1-q9", "9", "消します", { answer: "消して" }, { promptKana: "けします", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p1-a1-q10", "10", "開けます", { answer: "開けて" }, { promptKana: "あけます", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p1-a1-q11", "11", "閉めます", { answer: "閉めて" }, { promptKana: "しめます", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" })
    ]
  },
  {
    id: "l14-p1-a2",
    section: "practice_1",
    order: 2,
    title: "仿照例句进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    itemGroups: [
      {
        id: "l14-p1-a2-g1",
        example: {
          id: "l14-p1-a2-ex1",
          label: "[例1]",
          before: "急ぎます",
          beforeKana: "いそぎます",
          after: [repl("急いで", "verb_te", { kana: "いそいで" }), text(" ください。")],
          afterKana: "いそいで ください。"
        },
        items: [
          answerItem("l14-p1-a2-q1", "1", "ドアを 開けます", "ドアを 開けて ください。", { promptKana: "ドアを あけます" }),
          answerItem("l14-p1-a2-q2", "2", "電気を 消します", "電気を 消して ください。", { promptKana: "でんきを けします" }),
          answerItem("l14-p1-a2-q3", "3", "あの 橋を 渡ります", "あの 橋を 渡って ください。", { promptKana: "あの はしを わたります" })
        ]
      },
      {
        id: "l14-p1-a2-g2",
        example: {
          id: "l14-p1-a2-ex2",
          label: "[例2]",
          before: "デパートへ 行きます／買い物します",
          beforeKana: "デパートへ いきます／かいものします",
          after: [text("李さんは "), repl("デパートへ 行って", "first_action", { kana: "デパートへ いって" }), text("、"), repl("買い物します", "second_action", { kana: "かいものします" }), text("。")],
          afterKana: "りさんは デパートへ いって、かいものします。"
        },
        items: [
          answerItem("l14-p1-a2-q4", "4", "6時半に 起きます／太極拳を します", "李さんは 6時半に 起きて、太極拳を します。", { promptKana: "ろくじはんに おきます／たいきょくけんを します" }),
          answerItem("l14-p1-a2-q5", "5", "窓を 閉めます／寝ます", "李さんは 窓を 閉めて、寝ます。", { promptKana: "まどを しめます／ねます" }),
          answerItem("l14-p1-a2-q6", "6", "バスを 降ります／歩きます", "李さんは バスを 降りて、歩きます。", { promptKana: "バスを おります／あるきます" }),
          answerItem("l14-p1-a2-q7", "7", "お弁当を 買います／新幹線の 中で 食べます", "李さんは お弁当を 買って、新幹線の 中で 食べます。", { promptKana: "おべんとうを かいます／しんかんせんの なかで たべます" })
        ]
      },
      {
        id: "l14-p1-a2-g3",
        example: {
          id: "l14-p1-a2-ex3",
          label: "[例3]",
          before: "散歩します → 朝ご飯を 食べます",
          beforeKana: "さんぽします → あさごはんを たべます",
          after: [text("わたしは いつも "), repl("散歩してから", "first_action", { kana: "さんぽしてから" }), text("、"), repl("朝ご飯を 食べます", "second_action", { kana: "あさごはんを たべます" }), text("。")],
          afterKana: "わたしは いつも さんぽしてから、あさごはんを たべます。"
        },
        items: [
          answerItem("l14-p1-a2-q8", "8", "コーヒーを 飲みます ⇒ 働きます", "わたしは いつも コーヒーを 飲んでから、働きます。", { promptKana: "コーヒーを のみます ⇒ はたらきます" }),
          answerItem("l14-p1-a2-q9", "9", "部屋を 掃除します ⇒ 勉強します", "わたしは いつも 部屋を 掃除してから、勉強します。", { promptKana: "へやを そうじします ⇒ べんきょうします" }),
          answerItem("l14-p1-a2-q10", "10", "家へ 帰ります ⇒ 晩ご飯を 食べます", "わたしは いつも 家へ 帰ってから、晩ご飯を 食べます。", { promptKana: "いえへ かえります ⇒ ばんごはんを たべます" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l14-p1-a3",
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
        id: "l14-p1-a3-g1",
        example: {
          id: "l14-p1-a3-ex1",
          label: "[例1]",
          before: "李／7時半",
          beforeKana: "り／しちじはん",
          after: [repl("李さん", "person", { kana: "りさん" }), text("は、毎朝 "), repl("7時半", "time", { kana: "しちじはん" }), text("に 家を 出ます。")],
          afterKana: "りさんは、まいあさ しちじはんに いえを でます。"
        },
        items: [
          answerItem("l14-p1-a3-q1", "1", "森／8時", "森さんは、毎朝 8時に 家を 出ます。", { promptKana: "もり／はちじ" }),
          answerItem("l14-p1-a3-q2", "2", "吉田課長／6時50分", "吉田課長は、毎朝 6時50分に 家を 出ます。", { promptKana: "よしだかちょう／ろくじごじゅっぷん" }),
          answerItem("l14-p1-a3-q3", "3", "小野／7時45分", "小野さんは、毎朝 7時45分に 家を 出ます。", { promptKana: "おの／しちじよんじゅうごふん" }),
          answerItem("l14-p1-a3-q4", "4", "社長／9時", "社長は、毎朝 9時に 家を 出ます。", { promptKana: "しゃちょう／くじ" })
        ]
      },
      {
        id: "l14-p1-a3-g2",
        example: {
          id: "l14-p1-a3-ex2",
          label: "[例2]",
          before: "バス／駅前",
          beforeKana: "バス／えきまえ",
          after: [text("この "), repl("バス", "vehicle", { kana: "バス" }), text("は "), repl("駅前", "place", { kana: "えきまえ" }), text("を 通りますか。")],
          afterKana: "この バスは えきまえを とおりますか。"
        },
        items: [
          answerItem("l14-p1-a3-q5", "5", "電車／渋谷", "この 電車は 渋谷を 通りますか。", { promptKana: "でんしゃ／しぶや" }),
          answerItem("l14-p1-a3-q6", "6", "地下鉄／新宿", "この 地下鉄は 新宿を 通りますか。", { promptKana: "ちかてつ／しんじゅく" }),
          answerItem("l14-p1-a3-q7", "7", "バス／東京大学の 近く", "この バスは 東京大学の 近くを 通りますか。", { promptKana: "バス／とうきょうだいがくの ちかく" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l14-p1-a4",
    section: "practice_1",
    order: 4,
    title: "看图，仿照例句进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [
      { id: "l14-p1-a4-direction-pictures", kind: "exercise_image", imagePath: exerciseImage("book1_lesson14_1_4.png") }
    ],
    displayAssets: ["l14-p1-a4-direction-pictures"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "角／左／曲がります",
          beforeKana: "かど／ひだり／まがります",
          after: [text("角を 左へ 曲がります。")],
          afterKana: "かどを ひだりへ まがります。"
        }
      }
    ],
    items: [
      answerItem("l14-p1-a4-q1", "1", "横断歩道／渡ります", "横断歩道を 渡ります。", { promptKana: "おうだんほどう／わたります" }),
      answerItem("l14-p1-a4-q2", "2", "角／右／曲がります", "角を 右へ 曲がります。", { promptKana: "かど／みぎ／まがります" }),
      answerItem("l14-p1-a4-q3", "3", "交差点／まっすぐ／行きます", "交差点を まっすぐ 行きます。", { promptKana: "こうさてん／まっすぐ／いきます" })
    ]
  },
  {
    id: "l14-p1-a5",
    section: "practice_1",
    order: 5,
    title: "听录音，仿照例句进行练习。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 5),
      label: "第14课 练习I-5",
      transcript: {
        text: "窓を 開けて ください。はい、開けます。メモを 見て ください。はい、見ます。水を 飲んで ください。はい、飲みます。右へ 曲がって ください。はい、曲がります。英語を 勉強して ください。はい、勉強します。テレビを 消して ください。はい、消します。名前を 書いて ください。はい、書きます。橋を 渡って ください。はい、渡ります。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按题目顺序人工校正。",
        segments: [
          { itemNumber: "例", text: "窓を 開けて ください。はい、開けます。" },
          { itemNumber: "1", text: "メモを 見て ください。はい、見ます。" },
          { itemNumber: "2", text: "水を 飲んで ください。はい、飲みます。" },
          { itemNumber: "3", text: "右へ 曲がって ください。はい、曲がります。" },
          { itemNumber: "4", text: "英語を 勉強して ください。はい、勉強します。" },
          { itemNumber: "5", text: "テレビを 消して ください。はい、消します。" },
          { itemNumber: "6", text: "名前を 書いて ください。はい、書きます。" },
          { itemNumber: "7", text: "橋を 渡って ください。はい、渡ります。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "窓を 開けて ください。",
          beforeKana: "まどを あけて ください。",
          after: [text("はい、開けます。")],
          afterKana: "はい、あけます。"
        }
      }
    ],
    items: [
      answerItem("l14-p1-a5-q1", "1", "听录音并回答。", "はい、見ます。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l14-p1-a5-q2", "2", "听录音并回答。", "はい、飲みます。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l14-p1-a5-q3", "3", "听录音并回答。", "はい、曲がります。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l14-p1-a5-q4", "4", "听录音并回答。", "はい、勉強します。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l14-p1-a5-q5", "5", "听录音并回答。", "はい、消します。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l14-p1-a5-q6", "6", "听录音并回答。", "はい、書きます。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l14-p1-a5-q7", "7", "听录音并回答。", "はい、渡ります。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint })
    ]
  },
  {
    id: "l14-p1-a6",
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
      label: "第14课 练习I-6",
      transcript: {
        text: "いつ 出かけますか。昼ご飯を 食べます。昼ご飯を 食べてから、出かけます。いつ 勉強しますか。テレビを 見ます。テレビを 見てから、勉強します。いつ 散歩しますか。晩ご飯を 食べます。晩ご飯を 食べてから、散歩します。いつ 中国へ 帰りますか。大学を 卒業します。大学を 卒業してから、中国へ 帰ります。いつ 新聞を 読みますか。会社へ 行きます。会社へ 行ってから、新聞を 読みます。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按教材题面人工整理。",
        segments: [
          { itemNumber: "例", text: "いつ 出かけますか。昼ご飯を 食べます。昼ご飯を 食べてから、出かけます。" },
          { itemNumber: "1", text: "いつ 勉強しますか。テレビを 見ます。テレビを 見てから、勉強します。" },
          { itemNumber: "2", text: "いつ 散歩しますか。晩ご飯を 食べます。晩ご飯を 食べてから、散歩します。" },
          { itemNumber: "3", text: "いつ 中国へ 帰りますか。大学を 卒業します。大学を 卒業してから、中国へ 帰ります。" },
          { itemNumber: "4", text: "いつ 新聞を 読みますか。会社へ 行きます。会社へ 行ってから、新聞を 読みます。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "いつ 出かけますか。（昼ご飯を 食べます）",
          beforeKana: "いつ でかけますか。（ひるごはんを たべます）",
          after: [text("昼ご飯を 食べてから、出かけます。")],
          afterKana: "ひるごはんを たべてから、でかけます。"
        }
      }
    ],
    items: [
      answerItem("l14-p1-a6-q1", "1", "テレビを 見ます", "テレビを 見てから、勉強します。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "テレビを みます" }),
      answerItem("l14-p1-a6-q2", "2", "晩ご飯を 食べます", "晩ご飯を 食べてから、散歩します。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "ばんごはんを たべます" }),
      answerItem("l14-p1-a6-q3", "3", "大学を 卒業します", "大学を 卒業してから、中国へ 帰ります。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "だいがくを そつぎょうします" }),
      answerItem("l14-p1-a6-q4", "4", "会社へ 行きます", "会社へ 行ってから、新聞を 読みます。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "かいしゃへ いきます" })
    ]
  },
  {
    id: "l14-p1-a7",
    section: "practice_1",
    order: 7,
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
          before: "図書館へ 行きます／勉強します／家へ 帰ります",
          beforeKana: "としょかんへ いきます／べんきょうします／いえへ かえります",
          after: [text("甲：今日の 午後 何を しますか。\n乙：図書館へ 行って 勉強します。それから 家へ 帰ります。")],
          afterKana: "甲：きょうの ごご なにを しますか。\n乙：としょかんへ いって べんきょうします。それから いえへ かえります。"
        }
      }
    ],
    items: [
      dialogueItem("l14-p1-a7-q1", "1", "家へ 帰ります／掃除します／車を 洗います", "甲：今日の 午後 何を しますか。\n乙：家へ 帰って 掃除します。それから 車を 洗います。", "いえへ かえります／そうじします／くるまを あらいます", 4),
      dialogueItem("l14-p1-a7-q2", "2", "箱根へ 行きます／富士山を 見ます／美術館へ 行きます", "甲：今日の 午後 何を しますか。\n乙：箱根へ 行って 富士山を 見ます。それから 美術館へ 行きます。", "はこねへ いきます／ふじさんを みます／びじゅつかんへ いきます", 4),
      dialogueItem("l14-p1-a7-q3", "3", "海へ 行きます／泳ぎます／バーベキューを します", "甲：今日の 午後 何を しますか。\n乙：海へ 行って 泳ぎます。それから バーベキューを します。", "うみへ いきます／およぎます／バーベキューを します", 4)
    ]
  },
  {
    id: "l14-p2-a1",
    section: "practice_2",
    order: 1,
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
          beforeParts: [text("お茶（"), blank("example"), text("）飲みます。")],
          beforeKana: "おちゃ（______）のみます。",
          after: [text("を")],
          afterKana: "を"
        }
      }
    ],
    items: [
      blankItem("l14-p2-a1-q1", "1", [text("森さんは テニス（"), blank("answer"), text("）上手です。")], { answer: "が" }, { promptKana: "もりさんは テニス（______）じょうずです。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" }),
      blankItem("l14-p2-a1-q2", "2", [text("この バス（"), blank("subject"), text("）駅前（"), blank("route"), text("）通りますか。")], { subject: "は", route: "を" }, { promptKana: "この バス（______）えきまえ（______）とおりますか。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" }),
      blankItem("l14-p2-a1-q3", "3", [text("毎朝 6時に 家（"), blank("answer"), text("）出ます。")], { answer: "を" }, { promptKana: "まいあさ ろくじに いえ（______）でます。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" }),
      blankItem("l14-p2-a1-q4", "4", [text("机（"), blank("possessive"), text("）上に リンゴ（"), blank("subject"), text("）あります。")], { possessive: "の", subject: "が" }, { promptKana: "つくえ（______）うえに リンゴ（______）あります。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" }),
      blankItem("l14-p2-a1-q5", "5", [text("渋谷で 電車（"), blank("answer"), text("）降りて ください。")], { answer: "を" }, { promptKana: "しぶやで でんしゃ（______）おりて ください。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" }),
      blankItem("l14-p2-a1-q6", "6", [text("この 道（"), blank("answer"), text("）まっすぐ 行って ください。左に 公園が ありますよ。")], { answer: "を" }, { promptKana: "この みち（______）まっすぐ いって ください。ひだりに こうえんが ありますよ。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" })
    ]
  },
  {
    id: "l14-p2-a2",
    section: "practice_2",
    order: 2,
    title: "从□中选择词语，变成“て形”填入（　　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    layout: [
      {
        type: "word_bank",
        words: [text("見ます", { kana: "みます" }), text("行きます", { kana: "いきます" }), text("読みます", { kana: "よみます" }), text("起きます", { kana: "おきます" }), text("曲がります", { kana: "まがります" }), text("飲みます", { kana: "のみます" }), text("撮ります", { kana: "とります" })]
      },
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("テレビを（"), blank("example"), text("）から、寝ました。")],
          beforeKana: "テレビを（______）から、ねました。",
          after: [text("見て")],
          afterKana: "みて"
        }
      }
    ],
    items: [
      blankItem("l14-p2-a2-q1", "1", [text("毎朝 6時半に（"), blank("answer"), text("）、ジョギングを します。")], { answer: "起きて" }, { promptKana: "まいあさ ろくじはんに（______）、ジョギングを します。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p2-a2-q2", "2", [text("コーヒーを（"), blank("answer"), text("）から、会社へ 行きます。")], { answer: "飲んで" }, { promptKana: "コーヒーを（______）から、かいしゃへ いきます。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p2-a2-q3", "3", [text("デジカメで 写真を（"), blank("answer"), text("）、送ります。")], { answer: "撮って" }, { promptKana: "デジカメで しゃしんを（______）、おくります。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p2-a2-q4", "4", [text("パソコンの 雑誌を（"), blank("answer"), text("）から、新しい パソコンを 買います。")], { answer: "読んで" }, { promptKana: "パソコンの ざっしを（______）から、あたらしい パソコンを かいます。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p2-a2-q5", "5", [text("図書館へ（"), blank("answer"), text("）、本を 5冊 借りました。")], { answer: "行って" }, { promptKana: "としょかんへ（______）、ほんを ごさつ かりました。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }),
      blankItem("l14-p2-a2-q6", "6", [text("その 角を 右へ（"), blank("answer"), text("）ください。")], { answer: "曲がって" }, { promptKana: "その かどを みぎへ（______）ください。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" })
    ]
  },
  {
    id: "l14-p2-a3",
    section: "practice_2",
    order: 3,
    title: "听录音，从 A～C 中选择符合(1)～(3)的图。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "第14课 练习II-3",
      transcript: {
        text: "今朝 6時に 起きて、公園で 太極拳を しました。それから 8時に 家を 出ました。今朝 8時に 起きて コーヒーを 飲みました。それから 8時半に 家を 出ました。8時に 起きて、新聞を 読みました。それから 9時に 家を 出ました。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按图示和题目顺序人工校正。",
        segments: [
          { itemNumber: "1", text: "今朝 6時に 起きて、公園で 太極拳を しました。それから 8時に 家を 出ました。" },
          { itemNumber: "2", text: "今朝 8時に 起きて コーヒーを 飲みました。それから 8時半に 家を 出ました。" },
          { itemNumber: "3", text: "8時に 起きて、新聞を 読みました。それから 9時に 家を 出ました。" }
        ]
      }
    },
    assets: [
      { id: "l14-p2-a3-listening-choice-pictures", kind: "exercise_image", imagePath: exerciseImage("book1_lesson14_2_3.png") }
    ],
    displayAssets: ["l14-p2-a3-listening-choice-pictures"],
    layout: [],
    items: [
      choiceItem("l14-p2-a3-q1", "1", "听录音并选择符合内容的图。", "c"),
      choiceItem("l14-p2-a3-q2", "2", "听录音并选择符合内容的图。", "a"),
      choiceItem("l14-p2-a3-q3", "3", "听录音并选择符合内容的图。", "b")
    ]
  },
  {
    id: "l14-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l14-p2-a4-q1", "1", "小李每晚听了收音机后睡觉。", "李さんは 毎晩 ラジオを 聞いてから、寝ます。", {
        answerSource: "prompt",
        acceptableAlternatives: ["李さんは 毎晩 ラジオを 聞いてから 寝ます。"]
      }),
      answerItem("l14-p2-a4-q2", "2", "对不起，请把这个包裹寄到中国。", "すみません、この 荷物を 中国へ 送って ください。", { answerSource: "prompt" }),
      answerItem("l14-p2-a4-q3", "3", "小李每天早晨 7 点离开家。", "李さんは 毎朝 7時に 家を 出ます。", { answerSource: "prompt" })
    ]
  }
];

export const lesson14Practice: LessonPractice = {
  lessonId: "lesson14",
  title: "第14課 昨日 デパートへ 行って、買い物しました",
  sourcePages: [
    { pageNo: 176, imagePath: page(176) },
    { pageNo: 177, imagePath: page(177) },
    { pageNo: 178, imagePath: page(178) }
  ],
  activities
};
