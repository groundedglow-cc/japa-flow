import type { Choice, InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson33/page${pageNo}.webp`;
const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;
const audio = (exerciseNo: 1 | 2, order: number) => `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit9/lesson33/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });
const slot = (expectedUnit: InputSlot["expectedUnit"], width: InputSlot["width"] = "medium"): InputSlot[] => [{ id: "answer", expectedUnit, width, placeholder: "输入答案" }];
const fillItem = (id: string, number: string, prompt: string, promptKana: string, answer: string, suffix = "）。"): PracticeItem => ({ id, number, instruction: "", answerSource: "example_transform", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写箭头后的词语。", prompt: [text(prompt), blank("answer"), text(suffix)], promptKana, inputSlots: slot("conjugated_form"), answer: { slotValues: { answer } } });
const sentenceItem = (id: string, number: string, prompt: string, promptKana: string, answer: string, source: PracticeItem["answerSource"] = "example_transform"): PracticeItem => ({ id, number, instruction: "", answerSource: source, evaluationMode: "exact", responseScope: "sentence_only", responseScopeHint: "写出完整句子。", prompt: [text(prompt)], promptKana, inputSlots: slot("sentence", "long"), answer: { slotValues: { answer } } });
const dialogueItem = (id: string, number: string, prompt: string, promptKana: string, answer: string): PracticeItem => ({ id, number, instruction: "", answerSource: "audio", evaluationMode: "exact", responseScope: "dialogue_only", responseScopeHint: "写出完整会话。", prompt: [text(prompt)], promptKana, inputSlots: [{ id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows: 4, placeholder: "输入完整会话" }], answer: { slotValues: { answer } }, renderHint: "dialogue" });
const choiceItem = (id: string, number: string, prompt: string, promptKana: string, choices: Choice[], answerChoiceId: string, source: PracticeItem["answerSource"] = "prompt"): PracticeItem => ({ id, number, instruction: "", answerSource: source, evaluationMode: "exact", responseScope: "choice_only", prompt: [text(prompt)], promptKana, choices, answer: { choiceIds: [answerChoiceId] }, renderHint: "inline" });

const listeningChoices: Choice[] = [
  { id: "c1", label: "① 隣の人に借りました" }, { id: "c2", label: "② クーラーがついています" }, { id: "c3", label: "③ 図書館へ返しに行きます" },
  { id: "c4", label: "④ 銀行は閉まっています" }, { id: "c5", label: "⑤ まだ起きています" }, { id: "c6", label: "⑥ 散歩に行くのをやめました" }
];
const listeningChoiceKana: Record<string, string> = {
  c1: "① となりのひとにかりました", c2: "② クーラーがついています", c3: "③ としょかんへかえしにいきます",
  c4: "④ ぎんこうはしまっています", c5: "⑤ まだおきています", c6: "⑥ さんぽにいくのをやめました"
};

const activities: PracticeActivity[] = [
  {
    id: "l33-p1-a1", section: "practice_1", order: 1, title: "仿照例句，看图造句。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only",
    assets: [{ id: "l33-p1-a1-picture", kind: "exercise_image", imagePath: exerciseImage("book1_lesson33_1_1.png"), label: "练习 I 1 图片" }], displayAssets: ["l33-p1-a1-picture"],
    layout: [{ type: "example", content: { label: "[例]", before: "ドアを開けます。⇔ ドアが開きます。", beforeKana: "ドアをあけます。⇔ ドアがあきます。", after: [] } }],
    items: [
      sentenceItem("l33-p1-a1-q1", "1", "カキを落とします。", "カキをおとします。", "カキが落ちます。"),
      sentenceItem("l33-p1-a1-q2", "2", "卵を割ります。", "たまごをわります。", "卵が割れます。"),
      sentenceItem("l33-p1-a1-q3", "3", "電気を消します。", "でんきをけします。", "電気が消えます。")
    ]
  },
  {
    id: "l33-p1-a2", section: "practice_1", order: 2, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only",
    layout: [{ type: "example", content: { label: "[例]", before: "眼鏡をかけます。", beforeKana: "めがねをかけます。", after: [text("眼鏡をかけています。", { kana: "めがねをかけています。" })] } }],
    items: [
      sentenceItem("l33-p1-a2-q1", "1", "帽子をかぶります。", "ぼうしをかぶります。", "帽子をかぶっています。"),
      sentenceItem("l33-p1-a2-q2", "2", "ネックレスをします。", "ネックレスをします。", "ネックレスをしています。"),
      sentenceItem("l33-p1-a2-q3", "3", "スーツを着ます。", "スーツをきます。", "スーツを着ています。"),
      sentenceItem("l33-p1-a2-q4", "4", "サンダルをはきます。", "サンダルをはきます。", "サンダルをはいています。"),
      sentenceItem("l33-p1-a2-q5", "5", "ズボンをはきます。", "ズボンをはきます。", "ズボンをはいています。"),
      sentenceItem("l33-p1-a2-q6", "6", "ネクタイをします。", "ネクタイをします。", "ネクタイをしています。")
    ]
  },
  {
    id: "l33-p1-a3", section: "practice_1", order: 3, title: "仿照例句，将（　）中的词语变成“～ています”的形式完成句子。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only",
    layout: [{ type: "example", content: { label: "[例]", before: "佐藤さんは窓を開けました。\n今、窓は（開きます → 開いています）。", beforeKana: "さとうさんはまどをあけました。\nいま、まどは（あきます → あいています）。", after: [] } }],
    items: [
      fillItem("l33-p1-a3-q1", "1", "李さんは部屋の電気を消しました。今、部屋の電気は（消えます → ", "りさんはへやのでんきをけしました。いま、へやのでんきは（きえます → ______）。", "消えています"),
      fillItem("l33-p1-a3-q2", "2", "田中さんは車を駐車場に止めました。今、車は駐車場に（止まります → ", "たなかさんはくるまをちゅうしゃじょうにとめました。いま、くるまはちゅうしゃじょうに（とまります → ______）。", "止まっています"),
      fillItem("l33-p1-a3-q3", "3", "馬さんは昨日、パソコンを壊しました。今、馬さんのパソコンは（壊れます → ", "ばさんはきのう、パソコンをこわしました。いま、ばさんのパソコンは（こわれます → ______）。", "壊れています"),
      fillItem("l33-p1-a3-q4", "4", "森さんは床を汚しました。今、床は（汚れます → ", "もりさんはゆかをよごしました。いま、ゆかは（よごれます → ______）。", "汚れています")
    ]
  },
  {
    id: "l33-p1-a4", section: "practice_1", order: 4, title: "仿照例句，将（　）中的词语变成“～てしまいます”的形式完成句子。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only",
    layout: [
      { type: "example", content: { label: "[例]", before: "わたしは家のかぎをよく（なくします", beforeKana: "わたしはいえのかぎをよく（なくします", after: [text("なくしてしまいます）。", { kana: "なくしてしまいます）。" })] } },
      { type: "example", content: { before: "ボーナスを全部（使いました", beforeKana: "ボーナスをぜんぶ（つかいました", after: [text("使ってしまいました）から、もう旅行に行きません。", { kana: "つかってしまいました）から、もうりょこうにいきません。" })] } }
    ],
    items: [
      fillItem("l33-p1-a4-q1", "1", "いつも傘を電車の中に（忘れます → ", "いつもかさをでんしゃのなかに（わすれます → ______）。", "忘れてしまいます"),
      fillItem("l33-p1-a4-q2", "2", "わたしたちのチームは（負けました → ", "わたしたちのチームは（まけました → ______）。", "負けてしまいました"),
      fillItem("l33-p1-a4-q3", "3", "森さんは給料をもらうと、すぐ（使います → ", "もりさんはきゅうりょうをもらうと、すぐ（つかいます → ______）。", "使ってしまいます"),
      fillItem("l33-p1-a4-q4", "4", "新しいＴシャツがもう（汚れました → ", "あたらしいティーシャツがもう（よごれました → ______）。", "汚れてしまいました"),
      fillItem("l33-p1-a4-q5", "5", "宿題を（しました → ", "しゅくだいを（しました → ______）から、遊びに行きます。", "してしまいました", "）から、遊びに行きます。"),
      fillItem("l33-p1-a4-q6", "6", "この本は（読みました → ", "このほんは（よみました → ______）から、王さんにあげます。", "読んでしまいました", "）から、王さんにあげます。"),
      fillItem("l33-p1-a4-q7", "7", "ちょっと待ってください。すぐ（書きます → ", "ちょっとまってください。すぐ（かきます → ______）から。", "書いてしまいます", "）から。")
    ]
  },
  {
    id: "l33-p1-a5", section: "practice_1", order: 5, title: "仿照例句，将（　）中的词语变成“～そうです”的形式进行练习。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only",
    layout: [
      { type: "example", content: { label: "[例]", before: "雨が（降ります", beforeKana: "あめが（ふります", after: [text("降りそうです）。", { kana: "ふりそうです）。" })] } },
      { type: "example", content: { before: "このケーキは（おいしいです", beforeKana: "このケーキは（おいしいです", after: [text("おいしそうです）。", { kana: "おいしそうです）。" })] } },
      { type: "example", content: { before: "この問題は（簡単です", beforeKana: "このもんだいは（かんたんです", after: [text("簡単そうです）。", { kana: "かんたんそうです）。" })] } }
    ],
    items: [
      fillItem("l33-p1-a5-q1", "1", "いすが（壊れます → ", "いすが（こわれます → ______）。", "壊れそうです"),
      fillItem("l33-p1-a5-q2", "2", "明日は会議が（ありません → ", "あしたはかいぎが（ありません → ______）。", "なさそうです"),
      fillItem("l33-p1-a5-q3", "3", "あの歌は（流行します → ", "あのうたは（りゅうこうします → ______）。", "流行しそうです"),
      fillItem("l33-p1-a5-q4", "4", "あの部屋は（暑いです → ", "あのへやは（あついです → ______）。", "暑そうです"),
      fillItem("l33-p1-a5-q5", "5", "この料理は（辛くないです → ", "このりょうりは（からくないです → ______）。", "辛くなさそうです"),
      fillItem("l33-p1-a5-q6", "6", "森さんは（元気です → ", "もりさんは（げんきです → ______）。", "元気そうです"),
      fillItem("l33-p1-a5-q7", "7", "社長は（暇です → ", "しゃちょうは（ひまです → ______）。", "暇そうです")
    ]
  },
  {
    id: "l33-p1-a6", section: "practice_1", order: 6, title: "听录音，仿照例句替换画线部分进行练习。", instruction: "", interaction: "listening_answer", answerUnit: "dialogue", responseScope: "dialogue_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 6), label: "第33课 练习I-6", transcript: { source: "asr", confidenceNote: "分段 ASR 已覆盖例1与第1—3题；后续答案按教材例句和题面词语推导。", text: "[例1] 使い方を忘れました。甲：どうしたんですか。乙：使い方を忘れてしまったんです。1 鍵をなくしました。甲：どうしたんですか。乙：鍵をなくしてしまったんです。2 飼っていた犬が死にました。甲：どうしたんですか。乙：飼っていた犬が死んでしまったんです。3 車が故障しました。", segments: [{ itemNumber: "1", text: "鍵をなくしました。どうしたんですか。鍵をなくしてしまったんです。" }, { itemNumber: "2", text: "飼っていた犬が死にました。どうしたんですか。飼っていた犬が死んでしまったんです。" }, { itemNumber: "3", text: "車が故障しました。" }] } },
    layout: [], itemGroups: [
      { id: "l33-p1-a6-g1", example: { label: "[例1]", before: "使い方を忘れました", beforeKana: "つかいかたをわすれました", after: [text("甲：どうしたんですか。\n乙：使い方を忘れてしまったんです。", { kana: "こう：どうしたんですか。\nおつ：つかいかたをわすれてしまったんです。" })] }, items: [
        dialogueItem("l33-p1-a6-q1", "1", "かぎをなくしました", "かぎをなくしました", "甲：どうしたんですか。\n乙：鍵をなくしてしまったんです。"),
        dialogueItem("l33-p1-a6-q2", "2", "飼っていた犬が死にました", "かっていたいぬがしにました", "甲：どうしたんですか。\n乙：飼っていた犬が死んでしまったんです。"),
        dialogueItem("l33-p1-a6-q3", "3", "車が故障しました", "くるまがこしょうしました", "甲：どうしたんですか。\n乙：車が故障してしまったんです。"),
        dialogueItem("l33-p1-a6-q4", "4", "道を間違えました", "みちをまちがえました", "甲：どうしたんですか。\n乙：道を間違えてしまったんです。")
      ] },
      { id: "l33-p1-a6-g2", example: { label: "[例2]", before: "お菓子／おいしい", beforeKana: "おかし／おいしい", after: [text("甲：このお菓子、どうですか。\n乙：おいしそうなお菓子ですね。", { kana: "こう：このおかし、どうですか。\nおつ：おいしそうなおかしですね。" })] }, items: [
        dialogueItem("l33-p1-a6-q5", "5", "人／優しい", "ひと／やさしい", "甲：この人、どうですか。\n乙：優しそうな人ですね。"),
        dialogueItem("l33-p1-a6-q6", "6", "仕事／楽", "しごと／らく", "甲：この仕事、どうですか。\n乙：楽しそうな仕事ですね。"),
        dialogueItem("l33-p1-a6-q7", "7", "映画／おもしろくない", "えいが／おもしろくない", "甲：この映画、どうですか。\n乙：おもしろくなさそうな映画ですね。"),
        dialogueItem("l33-p1-a6-q8", "8", "本／難しい", "ほん／むずかしい", "甲：この本、どうですか。\n乙：難しそうな本ですね。")
      ] }
    ], items: []
  },
  {
    id: "l33-p2-a1", section: "practice_2", order: 1, title: "从□中选择适当的词语变成适当的形式填入（　）中。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only",
    assets: [{ id: "l33-p2-a1-word-bank", kind: "exercise_image", imagePath: exerciseImage("book1_lesson33_2_1.png"), label: "练习 II 1 词框" }], displayAssets: ["l33-p2-a1-word-bank"],
    layout: [{ type: "example", content: { label: "[例]", before: "昨日買ったカメラを子供が（壊しました）。", beforeKana: "きのうかったカメラをこどもが（こわしました）。", after: [] } }, { type: "word_bank", words: [text("壊します", { kana: "こわします" }), text("壊れます", { kana: "こわれます" }), text("開きます", { kana: "あきます" }), text("開けます", { kana: "あけます" }), text("入れます", { kana: "いれます" }), text("入ります", { kana: "はいります" }), text("汚れます", { kana: "よごれます" })] }],
    items: [
      fillItem("l33-p2-a1-q1", "1", "暑いので、窓を（", "あついので、まどを（______）ください。", "開けて", "）ください。"),
      fillItem("l33-p2-a1-q2", "2", "さっき急にドアが（", "さっききゅうにドアが（______）。", "開きました"),
      fillItem("l33-p2-a1-q3", "3", "服がずいぶん（", "ふくがずいぶん（______）いますね。", "汚れて", "）いますね。"),
      fillItem("l33-p2-a1-q4", "4", "このカメラは長い間使ったので、（", "このカメラはながいあいつかったので、（______）しまいました。", "壊れて", "）しまいました。"),
      fillItem("l33-p2-a1-q5", "5", "甘い物が好きなので、いつもコーヒーに砂糖を（", "あまいものがすきなので、いつもコーヒーにさとうを（______）。", "入れます", "）。"),
      fillItem("l33-p2-a1-q6", "6", "昨日散歩している時、目の中にごみが（", "きのうさんぽしているとき、めのなかにごみが（______）。", "入りました")
    ]
  },
  {
    id: "l33-p2-a2", section: "practice_2", order: 2, title: "给正确的答案画○。", instruction: "", interaction: "single_choice", answerUnit: "choice", responseScope: "choice_only", layout: [{ type: "example", content: { label: "[例]", before: "窓が（開け・開き）ました。", beforeKana: "まどが（あけ・あき）ました。", after: [] } }],
    items: [
      choiceItem("l33-p2-a2-q1", "1", "森さんは今日も黒い靴を（ はいて ・ 着て ）います。", "もりさんはきょうもくろいくつを（はいて・きて）います。", [{ id: "wear-shoes", label: "はいて" }, { id: "wear-clothes", label: "着て" }], "wear-shoes"),
      choiceItem("l33-p2-a2-q2", "2", "あの赤いネクタイを（ している ・ 着ている ）人がわたしの先生です。", "あのあかいネクタイを（している・きている）ひとがわたしのせんせいです。", [{ id: "wear-tie", label: "している" }, { id: "wear-tie-wrong", label: "着ている" }], "wear-tie"),
      choiceItem("l33-p2-a2-q3", "3", "部屋の電気が（ 消えて ・ 消して ）います。", "へやのでんきが（きえて・けして）います。", [{ id: "off-state", label: "消えて" }, { id: "off-action", label: "消して" }], "off-state"),
      choiceItem("l33-p2-a2-q4", "4", "その辞書が（ よさ ・ よ ）そうですよ。", "そのじしょが（よさ・よ）そうですよ。", [{ id: "good-wrong", label: "よさ" }, { id: "good", label: "よ" }], "good-wrong"),
      choiceItem("l33-p2-a2-q5", "5", "李さんのコートは（ 高く ・ 高 ）そうですね。", "りさんのコートは（たかく・たか）そうですね。", [{ id: "expensive-wrong", label: "高く" }, { id: "expensive", label: "高" }], "expensive"),
      choiceItem("l33-p2-a2-q6", "6", "ああ、おなかがすいた。何かある？\n——あっ、ごめん。何もないよ。全部（ 食べた ・ 食べて ）しまったよ。", "ああ、おなかがすいた。なにかある？\n——あっ、ごめん。なにもないよ。ぜんぶ（たべた・たべて）しまったよ。", [{ id: "ate-past", label: "食べた" }, { id: "ate-te", label: "食べて" }], "ate-te")
    ]
  },
  {
    id: "l33-p2-a3", section: "practice_2", order: 3, title: "听录音，从①～⑥中选择正确答案。", instruction: "", interaction: "single_choice", answerUnit: "choice", responseScope: "choice_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(2, 3), label: "第33课 练习II-3", transcript: { source: "asr", confidenceNote: "分段 ASR 在停顿处只识别到每句前半；选择结果按录音句式与教材选项逐项对应。", text: "[例] 雨が降りそうなので、散歩に行くのをやめました。1 借りた本を読んでしまったので。2 森さんの部屋は電気がついているので。3 今日は大変暑いので。4 もう5時なので。5 ボールペンを忘れてしまったので。", segments: [{ itemNumber: "1", text: "借りた本を読んでしまったので。" }, { itemNumber: "2", text: "森さんの部屋は電気がついているので。" }, { itemNumber: "3", text: "今日は大変暑いので。" }, { itemNumber: "4", text: "もう5時なので。" }, { itemNumber: "5", text: "ボールペンを忘れてしまったので。" }] } },
    assets: [{ id: "l33-p2-a3-choice-bank", kind: "exercise_image", imagePath: exerciseImage("book1_lesson33_2_3.png"), label: "练习 II 3 选项框" }], displayAssets: ["l33-p2-a3-choice-bank"], layout: [{ type: "word_bank", words: listeningChoices.map((choice) => text(choice.label, { kana: listeningChoiceKana[choice.id] })) }],
    items: [
      choiceItem("l33-p2-a3-q1", "1", "听录音，选择对应答案。", "", listeningChoices, "c3", "audio"), choiceItem("l33-p2-a3-q2", "2", "听录音，选择对应答案。", "", listeningChoices, "c5", "audio"), choiceItem("l33-p2-a3-q3", "3", "听录音，选择对应答案。", "", listeningChoices, "c2", "audio"), choiceItem("l33-p2-a3-q4", "4", "听录音，选择对应答案。", "", listeningChoices, "c4", "audio"), choiceItem("l33-p2-a3-q5", "5", "听录音，选择对应答案。", "", listeningChoices, "c1", "audio")
    ]
  },
  {
    id: "l33-p2-a4", section: "practice_2", order: 4, title: "将下面的句子译成日语。", instruction: "", interaction: "translation", answerUnit: "sentence", responseScope: "sentence_only", layout: [],
    items: [
      sentenceItem("l33-p2-a4-q1", "1", "是你开的窗户吗？——不，是风刮开的。", "", "あなたが窓を開けたんですか。——いいえ、風で開いたんです。", "prompt"),
      sentenceItem("l33-p2-a4-q2", "2", "森先生把奖金全都花光了。", "", "森さんはボーナスを全部使ってしまいました。", "prompt"),
      sentenceItem("l33-p2-a4-q3", "3", "这个蛋糕看上去很好吃。", "", "このケーキはおいしそうです。", "prompt")
    ]
  }
];

export const lesson33Practice: LessonPractice = {
  lessonId: "lesson33",
  title: "第33课 電車が急に止まりました",
  sourcePages: [{ pageNo: 102, imagePath: page(102) }, { pageNo: 103, imagePath: page(103) }, { pageNo: 104, imagePath: page(104) }],
  activities
};
