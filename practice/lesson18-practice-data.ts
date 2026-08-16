import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson18/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit5/lesson18/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

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
    ? multilineSentenceSlot(options.placeholder || "输入完整回答", options.rows || 3)
    : sentenceSlot(options.placeholder || "输入完整回答"),
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
    id: "l18-p1-a1",
    section: "practice_1",
    order: 1,
    title: "仿照例句进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    itemGroups: [
      {
        id: "l18-p1-a1-g1",
        title: "[例1]",
        example: {
          label: "[例1]",
          before: "大きい／きれい",
          beforeKana: "おおきい／きれい",
          after: [text("大きく します。\nきれいに します。")],
          afterKana: "おおきく します。\nきれいに します。"
        },
        items: [
          answerItem("l18-p1-a1-q1", "1", "新しい", "新しく します。", { responseScope: "sentence_only", promptKana: "あたらしい" }),
          answerItem("l18-p1-a1-q2", "2", "おいしい", "おいしく します。", { responseScope: "sentence_only" }),
          answerItem("l18-p1-a1-q3", "3", "広い", "広く します。", { responseScope: "sentence_only", promptKana: "ひろい" }),
          answerItem("l18-p1-a1-q4", "4", "静か", "静かに します。", { responseScope: "sentence_only", promptKana: "しずか" }),
          answerItem("l18-p1-a1-q5", "5", "派手", "派手に します。", { responseScope: "sentence_only", promptKana: "はで" }),
          answerItem("l18-p1-a1-q6", "6", "簡単", "簡単に します。", { responseScope: "sentence_only", promptKana: "かんたん" })
        ]
      },
      {
        id: "l18-p1-a1-g2",
        title: "[例2]",
        example: {
          label: "[例2]",
          before: "大きい／きれい",
          beforeKana: "おおきい／きれい",
          after: [text("大きく なります。\nきれいに なります。")],
          afterKana: "おおきく なります。\nきれいに なります。"
        },
        items: [
          answerItem("l18-p1-a1-q7", "7", "元気", "元気に なります。", { responseScope: "sentence_only", promptKana: "げんき" }),
          answerItem("l18-p1-a1-q8", "8", "速い", "速く なります。", { responseScope: "sentence_only", promptKana: "はやい" }),
          answerItem("l18-p1-a1-q9", "9", "便利", "便利に なります。", { responseScope: "sentence_only", promptKana: "べんり" }),
          answerItem("l18-p1-a1-q10", "10", "にぎやか", "にぎやかに なります。", { responseScope: "sentence_only" }),
          answerItem("l18-p1-a1-q11", "11", "背が 高い", "背が 高く なります。", { responseScope: "sentence_only", promptKana: "せが たかい" }),
          answerItem("l18-p1-a1-q12", "12", "髪が 長い", "髪が 長く なります。", { responseScope: "sentence_only", promptKana: "かみが ながい" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l18-p1-a2",
    section: "practice_1",
    order: 2,
    title: "看图，仿照例句进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: "写出原因/动作句和结果句。",
    assets: [
      { id: "l18-p1-a2-change-result-picture-table", kind: "exercise_image", imagePath: exerciseImage("book1_lesson18_1_2.png") }
    ],
    displayAssets: ["l18-p1-a2-change-result-picture-table"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "汚い／掃除します／きれい",
          beforeKana: "きたない／そうじします／きれい",
          after: [text("汚いですから、掃除しました。\nきれいに なりました。")],
          afterKana: "きたないですから、そうじしました。\nきれいに なりました。"
        }
      }
    ],
    items: [
      answerItem("l18-p1-a2-q1", "1", "病気／薬を 飲みます／元気", "病気ですから、薬を 飲みました。\n元気に なりました。", { multiline: true, rows: 3, responseScope: "custom", responseScopeHint: "写出原因/动作句和结果句。", promptKana: "びょうき／くすりを のみます／げんき" }),
      answerItem("l18-p1-a2-q2", "2", "下手／練習します／上手", "下手ですから、練習しました。\n上手に なりました。", { multiline: true, rows: 3, responseScope: "custom", responseScopeHint: "写出原因/动作句和结果句。", promptKana: "へた／れんしゅうします／じょうず" }),
      answerItem("l18-p1-a2-q3", "3", "暗い／電気を つけます／明るい", "暗いですから、電気を つけました。\n明るく なりました。", { multiline: true, rows: 3, responseScope: "custom", responseScopeHint: "写出原因/动作句和结果句。", promptKana: "くらい／でんきを つけます／あかるい" })
    ]
  },
  {
    id: "l18-p1-a3",
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
        id: "l18-p1-a3-g1",
        title: "[例1]",
        example: {
          label: "[例1]",
          before: "テレビの 音／小さい\n部屋／きれい",
          beforeKana: "テレビの おと／ちいさい\nへや／きれい",
          after: [text("テレビの 音を 小さく します。\n部屋を きれいに します。")],
          afterKana: "テレビの おとを ちいさく します。\nへやを きれいに します。"
        },
        items: [
          answerItem("l18-p1-a3-q1", "1", "値段／安い", "値段を 安く します。", { responseScope: "sentence_only", promptKana: "ねだん／やすい" }),
          answerItem("l18-p1-a3-q2", "2", "壁の 色／白い", "壁の 色を 白く します。", { responseScope: "sentence_only", promptKana: "かべの いろ／しろい" }),
          answerItem("l18-p1-a3-q3", "3", "髪／短い", "髪を 短く します。", { responseScope: "sentence_only", promptKana: "かみ／みじかい" }),
          answerItem("l18-p1-a3-q4", "4", "水や 空気／きれい", "水や 空気を きれいに します。", { responseScope: "sentence_only", promptKana: "みずや くうき／きれい" }),
          answerItem("l18-p1-a3-q5", "5", "家／立派", "家を 立派に します。", { responseScope: "sentence_only", promptKana: "いえ／りっぱ" }),
          answerItem("l18-p1-a3-q6", "6", "デザイン／シンプル", "デザインを シンプルに します。", { responseScope: "sentence_only" })
        ]
      },
      {
        id: "l18-p1-a3-g2",
        title: "[例2]",
        example: {
          label: "[例2]",
          before: "携帯電話／小さい\n部屋／きれい",
          beforeKana: "けいたいでんわ／ちいさい\nへや／きれい",
          after: [text("携帯電話は 小さく なりました。\n部屋は きれいに なりました。")],
          afterKana: "けいたいでんわは ちいさく なりました。\nへやは きれいに なりました。"
        },
        items: [
          answerItem("l18-p1-a3-q7", "7", "家／古い", "家は 古く なりました。", { responseScope: "sentence_only", promptKana: "いえ／ふるい" }),
          answerItem("l18-p1-a3-q8", "8", "荷物／軽い", "荷物は 軽く なりました。", { responseScope: "sentence_only", promptKana: "にもつ／かるい" }),
          answerItem("l18-p1-a3-q9", "9", "風邪／いい", "風邪は よく なりました。", { responseScope: "sentence_only", promptKana: "かぜ／いい" }),
          answerItem("l18-p1-a3-q10", "10", "教室／静か", "教室は 静かに なりました。", { responseScope: "sentence_only", promptKana: "きょうしつ／しずか" }),
          answerItem("l18-p1-a3-q11", "11", "操作／簡単", "操作は 簡単に なりました。", { responseScope: "sentence_only", promptKana: "そうさ／かんたん" }),
          answerItem("l18-p1-a3-q12", "12", "あの 会社／有名", "あの 会社は 有名に なりました。", { responseScope: "sentence_only", promptKana: "あの かいしゃ／ゆうめい" })
        ]
      },
      {
        id: "l18-p1-a3-g3",
        title: "[例3]",
        example: {
          label: "[例3]",
          before: "医者です",
          beforeKana: "いしゃです",
          after: [text("医者に なりました。")],
          afterKana: "いしゃに なりました。"
        },
        items: [
          answerItem("l18-p1-a3-q13", "13", "春", "春に なりました。", { responseScope: "sentence_only", promptKana: "はる" }),
          answerItem("l18-p1-a3-q14", "14", "12時", "12時に なりました。", { responseScope: "sentence_only", promptKana: "じゅうにじ", acceptableAlternatives: ["十二時に なりました。"] }),
          answerItem("l18-p1-a3-q15", "15", "旅行ガイド", "旅行ガイドに なりました。", { responseScope: "sentence_only", promptKana: "りょこうガイド" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l18-p1-a4",
    section: "practice_1",
    order: 4,
    title: "仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "学者",
          beforeKana: "がくしゃ",
          after: [text("甲：将来 何に なりたいですか。\n乙：学者に なりたいです。")],
          afterKana: "しょうらい なにに なりたいですか。\nがくしゃに なりたいです。"
        }
      }
    ],
    items: [
      dialogueItem("l18-p1-a4-q1", "1", "パイロット", "甲：将来 何に なりたいですか。\n乙：パイロットに なりたいです。"),
      dialogueItem("l18-p1-a4-q2", "2", "先生", "甲：将来 何に なりたいですか。\n乙：先生に なりたいです。", { promptKana: "せんせい" }),
      dialogueItem("l18-p1-a4-q3", "3", "医者", "甲：将来 何に なりたいですか。\n乙：医者に なりたいです。", { promptKana: "いしゃ" }),
      dialogueItem("l18-p1-a4-q4", "4", "デザイナー", "甲：将来 何に なりたいですか。\n乙：デザイナーに なりたいです。"),
      dialogueItem("l18-p1-a4-q5", "5", "旅行ガイド", "甲：将来 何に なりたいですか。\n乙：旅行ガイドに なりたいです。", { promptKana: "りょこうガイド" }),
      dialogueItem("l18-p1-a4-q6", "6", "大きい 会社の 社長", "甲：将来 何に なりたいですか。\n乙：大きい 会社の 社長に なりたいです。", { promptKana: "おおきい かいしゃの しゃちょう" })
    ]
  },
  {
    id: "l18-p1-a5",
    section: "practice_1",
    order: 5,
    title: "听录音，仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 5),
      label: "第18课 练习I-5",
      transcript: {
        text: "風邪。いいです。薬を 飲みました。風邪は よく なりましたか。薬を 飲みましたが、まだ よく なりません。部屋。きれいです。掃除しました。部屋は きれいに なりましたか。掃除しましたが、まだ きれいに なりません。会議室。涼しいです。クーラーを つけました。会議室は 涼しく なりましたか。クーラーを つけましたが、まだ 涼しく なりません。スカート。きれいです。洗いました。スカートは きれいに なりましたか。洗いましたが、まだ きれいに なりません。病気。いいです。昨日も 病院に 行きました。病気は よく なりましたか。昨日も 病院に 行きましたが、まだ よく なりません。ゴルフ。上手です。3か月 練習しました。ゴルフは 上手に なりましたか。3か月 練習しましたが、まだ 上手に なりません。外。明るいです。6時に なりました。外は 明るく なりましたか。6時に なりましたが、まだ 明るく なりません。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按题面人工整理；ASR 后半漏识别，后续小题按题面替换词和例句模式补全。",
        segments: [
          { itemNumber: "例1", text: "風邪は よく なりましたか。薬を 飲みましたが、まだ よく なりません。" },
          { itemNumber: "例2", text: "部屋は きれいに なりましたか。掃除しましたが、まだ きれいに なりません。" },
          { itemNumber: "1", text: "会議室は 涼しく なりましたか。クーラーを つけましたが、まだ 涼しく なりません。" },
          { itemNumber: "2", text: "スカートは きれいに なりましたか。洗いましたが、まだ きれいに なりません。" },
          { itemNumber: "3", text: "病気は よく なりましたか。昨日も 病院に 行きましたが、まだ よく なりません。" },
          { itemNumber: "4", text: "ゴルフは 上手に なりましたか。3か月 練習しましたが、まだ 上手に なりません。" },
          { itemNumber: "5", text: "外は 明るく なりましたか。6時に なりましたが、まだ 明るく なりません。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "風邪／いいです／薬を 飲みました\n部屋／きれいです／掃除しました",
          beforeKana: "かぜ／いいです／くすりを のみました\nへや／きれいです／そうじしました",
          after: [text("甲：風邪は よく なりましたか。\n乙：薬を 飲みましたが、まだ よく なりません。\n甲：部屋は きれいに なりましたか。\n乙：掃除しましたが、まだ きれいに なりません。")],
          afterKana: "かぜは よく なりましたか。\nくすりを のみましたが、まだ よく なりません。\nへやは きれいに なりましたか。\nそうじしましたが、まだ きれいに なりません。"
        }
      }
    ],
    items: [
      dialogueItem("l18-p1-a5-q1", "1", "会議室／涼しいです／クーラーを つけました", "甲：会議室は 涼しく なりましたか。\n乙：クーラーを つけましたが、まだ 涼しく なりません。", { promptKana: "かいぎしつ／すずしいです／クーラーを つけました", answerSource: "audio" }),
      dialogueItem("l18-p1-a5-q2", "2", "スカート／きれいです／洗いました", "甲：スカートは きれいに なりましたか。\n乙：洗いましたが、まだ きれいに なりません。", { promptKana: "スカート／きれいです／あらいました", answerSource: "audio" }),
      dialogueItem("l18-p1-a5-q3", "3", "病気／いいです／昨日も 病院に 行きました", "甲：病気は よく なりましたか。\n乙：昨日も 病院に 行きましたが、まだ よく なりません。", { promptKana: "びょうき／いいです／きのうも びょういんに いきました", answerSource: "audio" }),
      dialogueItem("l18-p1-a5-q4", "4", "ゴルフ／上手です／3か月 練習しました", "甲：ゴルフは 上手に なりましたか。\n乙：3か月 練習しましたが、まだ 上手に なりません。", { promptKana: "ゴルフ／じょうずです／さんかげつ れんしゅうしました", answerSource: "audio" }),
      dialogueItem("l18-p1-a5-q5", "5", "外／明るいです／6時に なりました", "甲：外は 明るく なりましたか。\n乙：6時に なりましたが、まだ 明るく なりません。", { promptKana: "そと／あかるいです／ろくじに なりました", answerSource: "audio" })
    ]
  },
  {
    id: "l18-p1-a6",
    section: "practice_1",
    order: 6,
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
          before: "旅行の 荷物／軽い\n部屋／静か",
          beforeKana: "りょこうの にもつ／かるい\nへや／しずか",
          after: [text("旅行の 荷物は 軽い ほうが いいですよ。\n部屋は 静かな ほうが いいですよ。")],
          afterKana: "りょこうの にもつは かるい ほうが いいですよ。\nへやは しずかな ほうが いいですよ。"
        }
      }
    ],
    items: [
      answerItem("l18-p1-a6-q1", "1", "家／駅から 近い", "家は 駅から 近い ほうが いいですよ。", { responseScope: "sentence_only", promptKana: "いえ／えきから ちかい" }),
      answerItem("l18-p1-a6-q2", "2", "友達／多い", "友達は 多い ほうが いいですよ。", { responseScope: "sentence_only", promptKana: "ともだち／おおい" }),
      answerItem("l18-p1-a6-q3", "3", "話／短い", "話は 短い ほうが いいですよ。", { responseScope: "sentence_only", promptKana: "はなし／みじかい" }),
      answerItem("l18-p1-a6-q4", "4", "問題／簡単", "問題は 簡単な ほうが いいですよ。", { responseScope: "sentence_only", promptKana: "もんだい／かんたん" }),
      answerItem("l18-p1-a6-q5", "5", "広告／派手", "広告は 派手な ほうが いいですよ。", { responseScope: "sentence_only", promptKana: "こうこく／はで" })
    ]
  },
  {
    id: "l18-p2-a1",
    section: "practice_2",
    order: 1,
    title: "将（　　）中的词语变成适当的形式。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: completionHint,
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("子供は（大きい → "), blank("example"), text("）なりました。")],
          beforeKana: "こどもは（おおきい → ______）なりました。",
          after: [text("大きく")],
          afterKana: "おおきく"
        }
      }
    ],
    items: [
      blankItem("l18-p2-a1-q1", "1", [text("（春 → "), blank("season"), text("）なって、（暖かい → "), blank("warm"), text("）なりました。")], { season: "春に", warm: "暖かく" }, { promptKana: "（はる → ______）なって、（あたたかい → ______）なりました。", responseScopeHint: completionHint }),
      blankItem("l18-p2-a1-q2", "2", [text("（夜 → "), blank("night"), text("）なって、町は（静か → "), blank("quiet"), text("）なりました。")], { night: "夜に", quiet: "静かに" }, { promptKana: "（よる → ______）なって、まちは（しずか → ______）なりました。", responseScopeHint: completionHint }),
      blankItem("l18-p2-a1-q3", "3", [text("部屋が（汚い → "), blank("dirty"), text("）なりました。掃除して（きれい → "), blank("clean"), text("）しましょう。")], { dirty: "汚く", clean: "きれいに" }, { promptKana: "へやが（きたない → ______）なりました。そうじして（きれい → ______）しましょう。", responseScopeHint: completionHint }),
      blankItem("l18-p2-a1-q4", "4", [text("部屋を（明るい → "), blank("bright"), text("）したいですから、壁を 明るい（色 → "), blank("color"), text("）します。")], { bright: "明るく", color: "色に" }, { promptKana: "へやを（あかるい → ______）したいですから、かべを あかるい（いろ → ______）します。", responseScopeHint: completionHint })
    ]
  },
  {
    id: "l18-p2-a2",
    section: "practice_2",
    order: 2,
    title: "使用“～く します”“～く なります”“～に します”“～に なります”，将（　　）中的词语变成适当的形式，完成句子。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: completionHint,
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("部屋が 暗いですね。もっと "), blank("example"), text(" ください。（明るい）")],
          beforeKana: "へやが くらいですね。もっと ______ ください。（あかるい）",
          after: [text("明るく して")],
          afterKana: "あかるく して"
        }
      }
    ],
    items: [
      blankItem("l18-p2-a2-q1", "1", [text("ゆうべ 薬を 飲みましたが、まだ "), blank("answer"), text("。（いい）")], { answer: "よく なりません" }, { promptKana: "ゆうべ くすりを のみましたが、まだ ______。（いい）", responseScopeHint: completionHint }),
      blankItem("l18-p2-a2-q2", "2", [text("ラジオの 音が 大きいです。もっと "), blank("answer"), text("。（小さい）")], { answer: "小さく して ください" }, { promptKana: "ラジオの おとが おおきいです。もっと ______。（ちいさい）", responseScopeHint: completionHint }),
      blankItem("l18-p2-a2-q3", "3", [text("3か月 パソコンを 練習しましたが、まだ "), blank("answer"), text("。（上手）")], { answer: "上手に なりません" }, { promptKana: "さんかげつ パソコンを れんしゅうしましたが、まだ ______。（じょうず）", responseScopeHint: completionHint }),
      blankItem("l18-p2-a2-q4", "4", [text("机の 上が 汚いですよ。もっと "), blank("answer"), text("。（きれい）")], { answer: "きれいに して ください" }, { promptKana: "つくえの うえが きたないですよ。もっと ______。（きれい）", responseScopeHint: completionHint })
    ]
  },
  {
    id: "l18-p2-a3",
    section: "practice_2",
    order: 3,
    title: "先听录音，完成下面的日记。下面的句子与日记内容一致的在（　　）中画○，不一致的画×。",
    instruction: "",
    interaction: "reading_cloze",
    answerUnit: "free_text",
    responseScope: "custom",
    responseScopeHint: "先补全日记①-③，再判断下面句子。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "第18课 练习II-3",
      transcript: {
        text: "今日は 休みです。朝から 雨で、寒いです。スープを 熱くして 飲みました。それから 部屋を 掃除しました。とても きれいに なりました。午後、ちょっと 頭が 痛く なりましたから、すぐ 薬を 飲んで、少し 寝ました。夜に なって、天気は よく なりました。わたしも 元気に なりました。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按题面人工整理。",
        segments: [
          { itemNumber: "①", text: "スープを 熱くして" },
          { itemNumber: "②", text: "とても きれいに なりました" },
          { itemNumber: "③", text: "天気は よく なりました" }
        ]
      }
    },
    assets: [
      { id: "l18-p2-a3-diary-cloze-box", kind: "exercise_image", imagePath: exerciseImage("book1_lesson18_2_3.png") }
    ],
    displayAssets: ["l18-p2-a3-diary-cloze-box"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("今日は 休みです。例（"), blank("example"), text("），寒いです。")],
          beforeKana: "きょうは やすみです。れい（______），さむいです。",
          after: [text("朝から 雨で")],
          afterKana: "あさから あめで"
        }
      }
    ],
    items: [
      blankItem("l18-p2-a3-q1", "①", [text("①（"), blank("answer"), text("）飲みました。")], { answer: "スープを 熱くして" }, { answerSource: "audio", promptKana: "①（______）のみました。", responseScope: "phrase_only", responseScopeHint: completionHint }),
      blankItem("l18-p2-a3-q2", "②", [text("部屋を 掃除しました。②（"), blank("answer"), text("）。")], { answer: "とても きれいに なりました" }, { answerSource: "audio", promptKana: "へやを そうじしました。②（______）。", responseScope: "sentence_only", responseScopeHint: completionHint, expectedUnit: "sentence" }),
      blankItem("l18-p2-a3-q3", "③", [text("夜に なって、③（"), blank("answer"), text("）。")], { answer: "天気は よく なりました" }, { answerSource: "audio", promptKana: "よるに なって、③（______）。", responseScope: "sentence_only", responseScopeHint: completionHint, expectedUnit: "sentence" }),
      trueFalseItem("l18-p2-a3-q4", "1", "今日は 朝から 雨です。", true, "きょうは あさから あめです。"),
      trueFalseItem("l18-p2-a3-q5", "2", "寒いですから、熱い スープを 飲みました。", true, "さむいですから、あつい スープを のみました。"),
      trueFalseItem("l18-p2-a3-q6", "3", "部屋を 掃除しましたが、まだ 汚いです。", false, "へやを そうじしましたが、まだ きたないです。"),
      trueFalseItem("l18-p2-a3-q7", "4", "昼から 天気が よく なりました。", false, "ひるから てんきが よく なりました。"),
      trueFalseItem("l18-p2-a3-q8", "5", "夜に なって、わたしは 元気に なりました。", true, "よるに なって、わたしは げんきに なりました。")
    ]
  },
  {
    id: "l18-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l18-p2-a4-q1", "1", "手机变小了。", "携帯電話は 小さく なりました。", { answerSource: "prompt", responseScope: "sentence_only" }),
      answerItem("l18-p2-a4-q2", "2", "儿子当医生了。", "息子は 医者に なりました。", { answerSource: "prompt", responseScope: "sentence_only" }),
      answerItem("l18-p2-a4-q3", "3", "把电视机的声音开大。", "テレビの 音を 大きく します。", { answerSource: "prompt", responseScope: "sentence_only" })
    ]
  }
];

export const lesson18Practice: LessonPractice = {
  lessonId: "lesson18",
  title: "第18課 携帯電話は とても 小さく なりました",
  sourcePages: [
    { pageNo: 222, imagePath: page(222) },
    { pageNo: 223, imagePath: page(223) },
    { pageNo: 224, imagePath: page(224) }
  ],
  activities
};
