import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson29/page${pageNo}.webp`;
const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit8/lesson29/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const sentenceSlot = (placeholder = "输入完整句子"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const dialogueSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows: 5, placeholder: "输入完整对话" }];
const wordSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "word", width: "medium", placeholder: "输入答案" }];
const booleanSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "boolean", width: "short", placeholder: "○ / ×" }];

const answerItem = (id: string, number: string, prompt: string, promptKana: string, answer: string, options: Partial<PracticeItem> = {}): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource: "example_transform", evaluationMode: "exact",
  responseScope: "sentence_only", inputSlots: sentenceSlot(), answer: { slotValues: { answer } }, ...options
});

const dialogueItem = (id: string, number: string, prompt: string, promptKana: string, answer: string, options: Partial<PracticeItem> = {}): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource: "audio", evaluationMode: "exact",
  responseScope: "dialogue_only", responseScopeHint: "听录音并仿照例句写出完整会话。", inputSlots: dialogueSlot(), answer: { slotValues: { answer } }, renderHint: "dialogue", ...options
});

const activities: PracticeActivity[] = [
  {
    id: "l29-p1-a1", section: "practice_1", order: 1, title: "仿照例句，练习动词的命令形。", instruction: "",
    interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only",
    layout: [{ type: "example", content: {
      label: "[例]", before: "電気を消します", beforeKana: "でんきをけします",
      after: [text("電気を消せ。\n電気を消しなさい。", { kana: "でんきをけせ。\nでんきをけしなさい。" })], afterKana: "でんきをけせ。\nでんきをけしなさい。"
    } }, { type: "example", content: {
      before: "タバコを吸いません", beforeKana: "タバコをすいません",
      after: [text("タバコを吸うな。", { kana: "タバコをすうな。" })], afterKana: "タバコをすうな。"
    } }],
    items: [
      { id: "l29-p1-a1-q1", number: "1", prompt: [text("もっと急ぎます", { kana: "もっといそぎます" })], promptKana: "もっといそぎます", instruction: "", answerSource: "example_transform", evaluationMode: "exact", responseScope: "sentence_only", responseScopeHint: "分别写出命令形和「～なさい」形式。", inputSlots: [{ id: "imperative", expectedUnit: "sentence", width: "long", placeholder: "命令形" }, { id: "nasai", expectedUnit: "sentence", width: "long", placeholder: "～なさい形式" }], answer: { slotValues: { imperative: "もっと急げ。", nasai: "もっと急ぎなさい。" } } },
      { id: "l29-p1-a1-q2", number: "2", prompt: [text("免許証を見せます", { kana: "めんきょしょうをみせます" })], promptKana: "めんきょしょうをみせます", instruction: "", answerSource: "example_transform", evaluationMode: "exact", responseScope: "sentence_only", responseScopeHint: "分别写出命令形和「～なさい」形式。", inputSlots: [{ id: "imperative", expectedUnit: "sentence", width: "long", placeholder: "命令形" }, { id: "nasai", expectedUnit: "sentence", width: "long", placeholder: "～なさい形式" }], answer: { slotValues: { imperative: "免許証を見せろ。", nasai: "免許証を見せなさい。" } } },
      { id: "l29-p1-a1-q3", number: "3", prompt: [text("謝ります", { kana: "あやまります" })], promptKana: "あやまります", instruction: "", answerSource: "example_transform", evaluationMode: "exact", responseScope: "sentence_only", responseScopeHint: "分别写出命令形和「～なさい」形式。", inputSlots: [{ id: "imperative", expectedUnit: "sentence", width: "long", placeholder: "命令形" }, { id: "nasai", expectedUnit: "sentence", width: "long", placeholder: "～なさい形式" }], answer: { slotValues: { imperative: "謝れ。", nasai: "謝りなさい。" } } },
      { id: "l29-p1-a1-q4", number: "4", prompt: [text("仕事をします", { kana: "しごとをします" })], promptKana: "しごとをします", instruction: "", answerSource: "example_transform", evaluationMode: "exact", responseScope: "sentence_only", responseScopeHint: "分别写出命令形和「～なさい」形式。", inputSlots: [{ id: "imperative", expectedUnit: "sentence", width: "long", placeholder: "命令形" }, { id: "nasai", expectedUnit: "sentence", width: "long", placeholder: "～なさい形式" }], answer: { slotValues: { imperative: "仕事をしろ。", nasai: "仕事をしなさい。" } } },
      { id: "l29-p1-a1-q5", number: "5", prompt: [text("すぐに来ます", { kana: "すぐにきます" })], promptKana: "すぐにきます", instruction: "", answerSource: "example_transform", evaluationMode: "exact", responseScope: "sentence_only", responseScopeHint: "分别写出命令形和「～なさい」形式。", inputSlots: [{ id: "imperative", expectedUnit: "sentence", width: "long", placeholder: "命令形" }, { id: "nasai", expectedUnit: "sentence", width: "long", placeholder: "～なさい形式" }], answer: { slotValues: { imperative: "すぐに来い。", nasai: "すぐに来なさい。" } } },
      { id: "l29-p1-a1-q6", number: "6", prompt: [text("言葉を覚えます", { kana: "ことばをおぼえます" })], promptKana: "ことばをおぼえます", instruction: "", answerSource: "example_transform", evaluationMode: "exact", responseScope: "sentence_only", responseScopeHint: "分别写出命令形和「～なさい」形式。", inputSlots: [{ id: "imperative", expectedUnit: "sentence", width: "long", placeholder: "命令形" }, { id: "nasai", expectedUnit: "sentence", width: "long", placeholder: "～なさい形式" }], answer: { slotValues: { imperative: "言葉を覚えろ。", nasai: "言葉を覚えなさい。" } } },
      { id: "l29-p1-a1-q7", number: "7", prompt: [text("静かにします", { kana: "しずかにします" })], promptKana: "しずかにします", instruction: "", answerSource: "example_transform", evaluationMode: "exact", responseScope: "sentence_only", responseScopeHint: "分别写出命令形和「～なさい」形式。", inputSlots: [{ id: "imperative", expectedUnit: "sentence", width: "long", placeholder: "命令形" }, { id: "nasai", expectedUnit: "sentence", width: "long", placeholder: "～なさい形式" }], answer: { slotValues: { imperative: "静かにしろ。", nasai: "静かにしなさい。" } } },
      answerItem("l29-p1-a1-q8", "8", "スピードを出しません", "スピードをだしません", "スピードを出すな。"),
      answerItem("l29-p1-a1-q9", "9", "ここに来ません", "ここにきません", "ここに来るな。"),
      answerItem("l29-p1-a1-q10", "10", "人に迷惑をかけません", "ひとにめいわくをかけません", "人に迷惑をかけるな。"),
      answerItem("l29-p1-a1-q11", "11", "戦争をしません", "せんそうをしません", "戦争をするな。"),
      answerItem("l29-p1-a1-q12", "12", "授業をサボりません", "じゅぎょうをサボりません", "授業をサボるな。"),
      answerItem("l29-p1-a1-q13", "13", "約束を破りません", "やくそくをやぶりません", "約束を破るな。"),
      answerItem("l29-p1-a1-q14", "14", "慌てません", "あわてません", "慌てるな。")
    ]
  },
  {
    id: "l29-p1-a2", section: "practice_1", order: 2, title: "看图，仿照例句替换画线部分进行练习。", instruction: "",
    interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only",
    assets: [{ id: "l29-p1-a2-traffic-signs", kind: "exercise_image", imagePath: exerciseImage("book1_lesson29_1_2.png"), label: "练习 I 2 交通标志" }], displayAssets: ["l29-p1-a2-traffic-signs"],
    layout: [{ type: "example", content: { label: "[例]", before: "タバコを吸いません", beforeKana: "タバコをすいません", after: [text("あれは「タバコを吸うな」という意味です。", { kana: "あれは「タバコをすうな」といういみです。" })], afterKana: "あれは「タバコをすうな」といういみです。" } }, { type: "example", content: { before: "注意します", beforeKana: "ちゅういします", after: [text("あれは「注意しろ」という意味です。", { kana: "あれは「ちゅういしろ」といういみです。" })], afterKana: "あれは「ちゅういしろ」といういみです。" } }],
    items: [
      answerItem("l29-p1-a2-q1", "1", "写真を撮りません", "しゃしんをとりません", "あれは「写真を撮るな」という意味です。"),
      answerItem("l29-p1-a2-q2", "2", "まっすぐ行きます", "まっすぐいきます", "あれは「まっすぐ行け」という意味です。"),
      answerItem("l29-p1-a2-q3", "3", "車を止めません", "くるまをとめません", "あれは「車を止めるな」という意味です。"),
      answerItem("l29-p1-a2-q4", "4", "ここで止まります", "ここでとまります", "あれは「ここで止まれ」という意味です。")
    ]
  },
  {
    id: "l29-p1-a3", section: "practice_1", order: 3, title: "仿照例句替换画线部分进行练习。", instruction: "",
    interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only",
    layout: [{ type: "example", content: { label: "[例]", before: "もう11時です／早く寝ます", beforeKana: "もうじゅういちじです／はやくねます", after: [text("もう11時だから、早く寝なさい。", { kana: "もうじゅういちじだから、はやくねなさい。" })], afterKana: "もうじゅういちじだから、はやくねなさい。" } }],
    items: [
      answerItem("l29-p1-a3-q1", "1", "もう10時です／早く起きます", "もうじゅうじです／はやくおきます", "もう10時だから、早く起きなさい。"),
      answerItem("l29-p1-a3-q2", "2", "ご飯です／手を洗います", "ごはんです／てをあらいます", "ご飯だから、手を洗いなさい。"),
      answerItem("l29-p1-a3-q3", "3", "汚いです／テーブルの上を片づけます", "きたないです／テーブルのうえをかたづけます", "汚いから、テーブルの上を片づけなさい。"),
      answerItem("l29-p1-a3-q4", "4", "体にいいです／野菜をたくさん食べます", "からだにいいです／やさいをたくさんたべます", "体にいいから、野菜をたくさん食べなさい。"),
      answerItem("l29-p1-a3-q5", "5", "風邪を引きます／早く服を着ます", "かぜをひきます／はやくふくをきます", "風邪を引くから、早く服を着なさい。")
    ]
  },
  {
    id: "l29-p1-a4", section: "practice_1", order: 4, title: "仿照例句替换画线部分进行练习。", instruction: "",
    interaction: "dialogue_practice", answerUnit: "dialogue", responseScope: "dialogue_only",
    layout: [{ type: "example", content: { label: "[例]", before: "花／フジ", beforeKana: "はな／フジ", after: [text("甲：この花の名前を知っていますか。\n乙：それはフジという花です。", { kana: "こう：このはなのなまえをしっていますか。\nおつ：それはフジというはなです。" })], afterKana: "こう：このはなのなまえをしっていますか。\nおつ：それはフジというはなです。" } }],
    items: [
      answerItem("l29-p1-a4-q1", "1", "人／周恩来", "ひと／しゅうおんらい", "甲：この人の名前を知っていますか。\n乙：それは周恩来という人です。", { responseScope: "dialogue_only", responseScopeHint: "写出完整会话。", inputSlots: dialogueSlot(), renderHint: "dialogue" }),
      answerItem("l29-p1-a4-q2", "2", "酒／富士", "さけ／ふじ", "甲：この酒の名前を知っていますか。\n乙：それは富士という酒です。", { responseScope: "dialogue_only", responseScopeHint: "写出完整会话。", inputSlots: dialogueSlot(), renderHint: "dialogue" }),
      answerItem("l29-p1-a4-q3", "3", "山／エベレスト", "やま／エベレスト", "甲：この山の名前を知っていますか。\n乙：それはエベレストという山です。", { responseScope: "dialogue_only", responseScopeHint: "写出完整会话。", inputSlots: dialogueSlot(), renderHint: "dialogue" }),
      answerItem("l29-p1-a4-q4", "4", "建物／天安門", "たてもの／てんあんもん", "甲：この建物の名前を知っていますか。\n乙：それは天安門という建物です。", { responseScope: "dialogue_only", responseScopeHint: "写出完整会话。", inputSlots: dialogueSlot(), renderHint: "dialogue" }),
      answerItem("l29-p1-a4-q5", "5", "作家／魯迅", "さっか／ろじん", "甲：この作家の名前を知っていますか。\n乙：それは魯迅という作家です。", { responseScope: "dialogue_only", responseScopeHint: "写出完整会话。", inputSlots: dialogueSlot(), renderHint: "dialogue" }),
      answerItem("l29-p1-a4-q6", "6", "鳥／カササギ", "とり／カササギ", "甲：この鳥の名前を知っていますか。\n乙：それはカササギという鳥です。", { responseScope: "dialogue_only", responseScopeHint: "写出完整会话。", inputSlots: dialogueSlot(), renderHint: "dialogue" })
    ]
  },
  {
    id: "l29-p1-a5", section: "practice_1", order: 5, title: "听录音，仿照例句替换画线部分进行练习。", instruction: "",
    interaction: "listening_answer", answerUnit: "dialogue", responseScope: "dialogue_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 5), label: "第29课 练习I-5", transcript: { source: "asr", text: "0. 森さん／早く企画書を出します。森さんは何と言ったんですか。早く企画書を出して、と言いました。1. 森さん／時間を守ります。森さんは何と言ったんですか。時間を守って、と言いました。2. 友達／約束を忘れません。友達は何と言ったんですか。約束を忘れないで、と言いました。3. 警官／横断歩道を渡ります。警官は何と言ったんですか。横断歩道を渡って、と言いました。4. 先生／友達とけんかをしません。", confidenceNote: "ASR 在第 4 题题干后截断；第 4 题答案按教材印刷题干及例句模式补全。", segments: [{ itemNumber: "例", text: "森さんは何と言ったんですか。早く企画書を出して、と言いました。" }, { itemNumber: "1", text: "時間を守って、と言いました。" }, { itemNumber: "2", text: "約束を忘れないで、と言いました。" }, { itemNumber: "3", text: "横断歩道を渡って、と言いました。" }, { itemNumber: "4", text: "ASR 截断。" }] } },
    layout: [{ type: "example", content: { label: "[例]", before: "森さん／早く企画書を出します", beforeKana: "もりさん／はやくきかくしょをだします", after: [text("甲：森さんは何と言ったんですか。\n乙：「早く企画書を出して」と言いました。", { kana: "こう：もりさんはなんといったんですか。\nおつ：「はやくきかくしょをだして」といいました。" })], afterKana: "こう：もりさんはなんといったんですか。\nおつ：「はやくきかくしょをだして」といいました。" } }],
    items: [
      dialogueItem("l29-p1-a5-q1", "1", "森さん／時間を守ります", "もりさん／じかんをまもります", "甲：森さんは何と言ったんですか。\n乙：「時間を守って」と言いました。"),
      dialogueItem("l29-p1-a5-q2", "2", "友達／約束を忘れません", "ともだち／やくそくをわすれません", "甲：友達は何と言ったんですか。\n乙：「約束を忘れないで」と言いました。"),
      dialogueItem("l29-p1-a5-q3", "3", "警官／横断歩道を渡ります", "けいかん／おうだんほどうをわたります", "甲：警官は何と言ったんですか。\n乙：「横断歩道を渡って」と言いました。"),
      dialogueItem("l29-p1-a5-q4", "4", "先生／友達とけんかをしません", "せんせい／ともだちとけんかをしません", "甲：先生は何と言ったんですか。\n乙：「友達とけんかをしないで」と言いました。", { answer: { slotValues: { answer: "甲：先生は何と言ったんですか。\n乙：「友達とけんかをしないで」と言いました。" }, note: "ASR 在本题题干后截断；答案按教材印刷题干及例句模式补全。" } })
    ]
  },
  {
    id: "l29-p1-a6", section: "practice_1", order: 6, title: "听录音，仿照例句替换画线部分练习会话。", instruction: "",
    interaction: "dialogue_practice", answerUnit: "dialogue", responseScope: "dialogue_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 6), label: "第29课 练习I-6", transcript: { source: "asr", text: "0. 禁煙／タバコを吸いません。すみません、この漢字は何と読みますか。それは禁煙と読みます。どういう意味ですか。タバコを吸うな、という意味です。1. 立入禁止／ここに入りません。すみません、この漢字は何と読みますか。それは立入禁止と読みます。どういう意味ですか。ここに入るな、という意味です。2. 駐車禁止／ここに車を止めません。すみません、この漢字は何と読みますか。それは駐車禁止と読みます。どういう意味ですか。ここに。", confidenceNote: "ASR 在第 2 题后半截断；第 2–4 题的剩余会话答案按教材印刷题干及例句模式补全。", segments: [{ itemNumber: "例", text: "禁煙。タバコを吸うな、という意味です。" }, { itemNumber: "1", text: "立入禁止。ここに入るな、という意味です。" }, { itemNumber: "2", text: "駐車禁止。ASR 截断。" }, { itemNumber: "3", text: "ASR 截断。" }, { itemNumber: "4", text: "ASR 截断。" }] } },
    layout: [{ type: "example", content: { label: "[例]", before: "「きんえん」（禁煙）／タバコを吸いません", beforeKana: "「きんえん」（きんえん）／タバコをすいません", after: [text("甲：すみません、この漢字は何と読みますか。\n乙：それは「きんえん」と読みます。\n甲：どういう意味ですか。\n乙：「タバコを吸うな」という意味です。", { kana: "こう：すみません、このかんじはなんとよみますか。\nおつ：それは「きんえん」とよみます。\nこう：どういういみですか。\nおつ：「タバコをすうな」といういみです。" })], afterKana: "こう：すみません、このかんじはなんとよみますか。\nおつ：それは「きんえん」とよみます。\nこう：どういういみですか。\nおつ：「タバコをすうな」といういみです。" } }],
    items: [
      dialogueItem("l29-p1-a6-q1", "1", "「たちいりきんし」（立入禁止）／ここに入りません", "「たちいりきんし」（たちいりきんし）／ここにはいりません", "甲：すみません、この漢字は何と読みますか。\n乙：それは「たちいりきんし」と読みます。\n甲：どういう意味ですか。\n乙：「ここに入るな」という意味です。"),
      dialogueItem("l29-p1-a6-q2", "2", "「ちゅうしゃきんし」（駐車禁止）／ここに車を止めません", "「ちゅうしゃきんし」（ちゅうしゃきんし）／ここにくるまをとめません", "甲：すみません、この漢字は何と読みますか。\n乙：それは「ちゅうしゃきんし」と読みます。\n甲：どういう意味ですか。\n乙：「ここに車を止めるな」という意味です。", { answer: { slotValues: { answer: "甲：すみません、この漢字は何と読みますか。\n乙：それは「ちゅうしゃきんし」と読みます。\n甲：どういう意味ですか。\n乙：「ここに車を止めるな」という意味です。" }, note: "ASR 在本题后半截断；答案按教材印刷题干及例句模式补全。" } }),
      dialogueItem("l29-p1-a6-q3", "3", "「かきげんきん」（火気厳禁）／ここで火を使いません", "「かきげんきん」（かきげんきん）／ここでひをつかいません", "甲：すみません、この漢字は何と読みますか。\n乙：それは「かきげんきん」と読みます。\n甲：どういう意味ですか。\n乙：「ここで火を使うな」という意味です。", { answer: { slotValues: { answer: "甲：すみません、この漢字は何と読みますか。\n乙：それは「かきげんきん」と読みます。\n甲：どういう意味ですか。\n乙：「ここで火を使うな」という意味です。" }, note: "ASR 在前一题后截断；答案按教材印刷题干及例句模式补全。" } }),
      dialogueItem("l29-p1-a6-q4", "4", "「おうだんきんし」（横断禁止）／ここを渡りません", "「おうだんきんし」（おうだんきんし）／ここをわたりません", "甲：すみません、この漢字は何と読みますか。\n乙：それは「おうだんきんし」と読みます。\n甲：どういう意味ですか。\n乙：「ここを渡るな」という意味です。", { answer: { slotValues: { answer: "甲：すみません、この漢字は何と読みますか。\n乙：それは「おうだんきんし」と読みます。\n甲：どういう意味ですか。\n乙：「ここを渡るな」という意味です。" }, note: "ASR 在前一题后截断；答案按教材印刷题干及例句模式补全。" } })
    ]
  },
  {
    id: "l29-p2-a1", section: "practice_2", order: 1, title: "从框中选择适当的词语填入（　）中。", instruction: "",
    interaction: "fill_blank", answerUnit: "phrase", responseScope: "phrase_only",
    assets: [{ id: "l29-p2-a1-word-bank", kind: "exercise_image", imagePath: exerciseImage("book1_lesson29_2_1.png"), label: "练习 II 1 词框" }], displayAssets: ["l29-p2-a1-word-bank"],
    layout: [{ type: "example", content: { label: "[例]", before: "子供は遊ぶのが好きです。", beforeKana: "こどもはあそぶのがすきです。", after: [text("お母さんはもっと（勉強しなさい）と言いました。", { kana: "おかあさんはもっと（べんきょうしなさい）といいました。" })], afterKana: "おかあさんはもっと（べんきょうしなさい）といいました。" } }, { type: "word_bank", words: [text("頑張りなさい", { kana: "がんばりなさい" }), text("勉強しなさい", { kana: "べんきょうしなさい" }), text("話しなさい", { kana: "はなしなさい" }), text("静かにしなさい", { kana: "しずかにしなさい" })] }],
    items: [
      { id: "l29-p2-a1-q1", number: "1", prompt: [text("子供たちが大きい声で話しています。⇒ お母さんは（" , { kana: "こどもたちがおおきいこえではなしています。⇒ おかあさんは（" }), blank("answer"), text("）と言いました。", { kana: "）といいました。" })], promptKana: "こどもたちがおおきいこえではなしています。⇒ おかあさんは（）といいました。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "phrase_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer: "静かにしなさい" } } },
      { id: "l29-p2-a1-q2", number: "2", prompt: [text("サッカーの練習をしています。⇒ 先生は（", { kana: "サッカーのれんしゅうをしています。⇒ せんせいは（" }), blank("answer"), text("）と言いました。", { kana: "）といいました。" })], promptKana: "サッカーのれんしゅうをしています。⇒ せんせいは（）といいました。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "phrase_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer: "頑張りなさい" } } },
      { id: "l29-p2-a1-q3", number: "3", prompt: [text("森さんが説明していますが、よく分かりません。⇒ 課長はゆっくり（", { kana: "もりさんがせつめいしていますが、よくわかりません。⇒ かちょうはゆっくり（" }), blank("answer"), text("）と言いました。", { kana: "）といいました。" })], promptKana: "もりさんがせつめいしていますが、よくわかりません。⇒ かちょうはゆっくり（）といいました。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "phrase_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer: "話しなさい" } } }
    ]
  },
  {
    id: "l29-p2-a2", section: "practice_2", order: 2, title: "仿照例句，从框中选择适当的词语变成适当的形式填入（　）中。", instruction: "",
    interaction: "fill_blank", answerUnit: "word", responseScope: "word_only",
    assets: [{ id: "l29-p2-a2-word-bank", kind: "exercise_image", imagePath: exerciseImage("book1_lesson29_2_2.png"), label: "练习 II 2 词框" }], displayAssets: ["l29-p2-a2-word-bank"],
    layout: [{ type: "example", content: { label: "[例]", before: "遅刻しません／出します", beforeKana: "ちこくしません／だします", after: [text("課長は（遅刻するな）、早くレポートを（出せ）と言いました。", { kana: "かちょうは（ちこくするな）、はやくレポートを（だせ）といいました。" })], afterKana: "かちょうは（ちこくするな）、はやくレポートを（だせ）といいました。" } }, { type: "word_bank", words: [text("遅刻しません", { kana: "ちこくしません" }), text("止まります", { kana: "とまります" }), text("寝ます", { kana: "ねます" }), text("出します", { kana: "だします" }), text("見せます", { kana: "みせます" }), text("出しません", { kana: "だしません" }), text("勉強します", { kana: "べんきょうします" }), text("入りません", { kana: "はいりません" })] }],
    items: [
      { id: "l29-p2-a2-q1", number: "1", prompt: [text("警官はスピードを（", { kana: "けいかんはスピードを（" }), blank("a"), text("）、免許証を（", { kana: "）、めんきょしょうを（" }), blank("b"), text("）と言いました。", { kana: "）といいました。" })], promptKana: "けいかんはスピードを（）、めんきょしょうを（）といいました。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "按顺序填写两个括号中的词语。", inputSlots: [{ id: "a", expectedUnit: "word", width: "short", placeholder: "答案" }, { id: "b", expectedUnit: "word", width: "short", placeholder: "答案" }], answer: { slotValues: { a: "出すな", b: "見せろ" } } },
      { id: "l29-p2-a2-q2", number: "2", prompt: [text("信号の赤は（", { kana: "しんごうのあかは（" }), blank("answer"), text("）という意味です。", { kana: "）といういみです。" })], promptKana: "しんごうのあかは（）といういみです。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer: "止まれ" } } },
      { id: "l29-p2-a2-q3", number: "3", prompt: [text("医者は風呂に（", { kana: "いしゃはふろに（" }), blank("a"), text("）、早く（", { kana: "）、はやく（" }), blank("b"), text("）と言いました。", { kana: "）といいました。" })], promptKana: "いしゃはふろに（）、はやく（）といいました。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "按顺序填写两个括号中的词语。", inputSlots: [{ id: "a", expectedUnit: "word", width: "short", placeholder: "答案" }, { id: "b", expectedUnit: "word", width: "short", placeholder: "答案" }], answer: { slotValues: { a: "入るな", b: "寝ろ" } } },
      { id: "l29-p2-a2-q4", number: "4", prompt: [text("父はよく（", { kana: "ちちはよく（" }), blank("answer"), text("）、そしてよく遊べと言いました。", { kana: "）、そしてよくあそべといいました。" })], promptKana: "ちちはよく（）、そしてよくあそべといいました。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer: "勉強しろ" } } }
    ]
  },
  {
    id: "l29-p2-a3", section: "practice_2", order: 3, title: "读下面的文章，录音中所说的与文章内容一致的在（　）中画○，不一致的画×。", instruction: "",
    interaction: "true_false", answerUnit: "boolean", responseScope: "boolean_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(2, 3), label: "第29课 练习II-3", transcript: { source: "asr", text: "0. 田中さんは昨日、面白い映画を見ました。1. 課長は田中さんに遅れるな、と言いました。2. 課長は田中さんにタバコを吸うな、と言いました。3. 課長は田中さんに仕事をサボるな、と言いました。4. 課長は田中さんにレポートを出せ、と言いました。5. 田中さんは今日、レポートを出しました。", segments: [{ itemNumber: "例", text: "田中さんは昨日、面白い映画を見ました。" }, { itemNumber: "1", text: "課長は田中さんに遅れるな、と言いました。" }, { itemNumber: "2", text: "課長は田中さんにタバコを吸うな、と言いました。" }, { itemNumber: "3", text: "課長は田中さんに仕事をサボるな、と言いました。" }, { itemNumber: "4", text: "課長は田中さんにレポートを出せ、と言いました。" }, { itemNumber: "5", text: "田中さんは今日、レポートを出しました。" }] } },
    assets: [{ id: "l29-p2-a3-reading", kind: "exercise_image", imagePath: exerciseImage("book1_lesson29_2_3.png"), label: "练习 II 3 阅读文章" }], displayAssets: ["l29-p2-a3-reading"],
    layout: [{ type: "passage", lines: [
      text("田中さんは昨日夜中の２時までテレビを見ました。おもしろい映画があったからです。", { kana: "たなかさんはきのうよなかのにじまでテレビをみました。おもしろいえいががあったからです。" }),
      text("今朝５分遅刻しましたが、課長は何も言いませんでした。午後、とても眠くなりました。", { kana: "けさごふんちこくしましたが、かちょうはなにもいいませんでした。ごご、とてもねむくなりました。" }),
      text("田中さんはタバコを吸ったり、コーヒーを飲んだりして、あまり働きませんでした。", { kana: "たなかさんはタバコをすったり、コーヒーをのんだりして、あまりはたらきませんでした。" }),
      text("課長は田中さんに「仕事をサボるな。今日中にレポートを出せ」と言いました。田中さんは", { kana: "かちょうはたなかさんに「しごとをサボるな。きょうじゅうにレポートをだせ」といいました。たなかさんは" }),
      text("９時まで残業しましたが、レポートを書くことができませんでした。", { kana: "くじまでざんぎょうしましたが、レポートをかくことができませんでした。" })
    ] }, { type: "example", content: { label: "[例]", before: "田中さんは昨日おもしろい映画を見ました。", beforeKana: "たなかさんはきのうおもしろいえいがをみました。", after: [text("（○）", { kana: "（まる）" })], afterKana: "（まる）" } }],
    items: ["×", "×", "○", "○", "×"].map((answer, index) => ({ id: `l29-p2-a3-q${index + 1}`, number: String(index + 1), prompt: [text("（"), blank("answer"), text("）")], instruction: "", answerSource: "audio" as const, evaluationMode: "exact" as const, responseScope: "boolean_only" as const, responseScopeHint: "听录音，填写 ○ 或 ×。", inputSlots: booleanSlot(), answer: { slotValues: { answer } } }))
  },
  {
    id: "l29-p2-a4", section: "practice_2", order: 4, title: "将下面的句子译成日语。", instruction: "",
    interaction: "translation", answerUnit: "sentence", responseScope: "sentence_only", layout: [],
    items: [
      { id: "l29-p2-a4-q1", number: "1", prompt: [text("刚才部长说什么了？——说“快交文件”。")], instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "dialogue_only", responseScopeHint: "写出完整日语对话。", inputSlots: dialogueSlot(), answer: { slotValues: { answer: "さっき部長は何と言いましたか。——「書類を早く提出しろ」と言いました。" } }, renderHint: "dialogue" },
      { id: "l29-p2-a4-q2", number: "2", prompt: [text("这个符号是“禁止吸烟”的意思。")], instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "sentence_only", inputSlots: sentenceSlot(), answer: { slotValues: { answer: "このマークは「タバコを吸うな」という意味です。" } } },
      { id: "l29-p2-a4-q3", number: "3", prompt: [text("阿诚，快去洗澡！")], instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "sentence_only", inputSlots: sentenceSlot(), answer: { slotValues: { answer: "誠，早くお風呂に入りなさい。" } } }
    ]
  }
];

export const lesson29Practice: LessonPractice = {
  lessonId: "lesson29",
  title: "第29课",
  sourcePages: [{ pageNo: 56, imagePath: page(56) }, { pageNo: 57, imagePath: page(57) }, { pageNo: 58, imagePath: page(58) }],
  activities
};
