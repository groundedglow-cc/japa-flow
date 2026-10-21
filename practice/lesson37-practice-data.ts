import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson37/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) => `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit10/lesson37/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId = "answer"): PromptPart => ({ type: "blank", slotId });
const sentenceSlot = (placeholder = "输入完整句子"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const phraseSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "phrase", width: "long", placeholder: "输入答案" }];
const wordSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "word", width: "medium", placeholder: "输入答案" }];
const dialogueSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows: 4, placeholder: "输入完整会话" }];

const sentenceItem = (id: string, number: string, prompt: string, promptKana: string, answer: string, answerSource: PracticeItem["answerSource"] = "example_transform"): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource, evaluationMode: "exact", responseScope: "sentence_only", responseScopeHint: "写出完整句子。", inputSlots: sentenceSlot(), answer: { slotValues: { answer } }
});

const phraseItem = (id: string, number: string, prompt: string, promptKana: string, answer: string): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource: "example_transform", evaluationMode: "exact", responseScope: "phrase_only", responseScopeHint: "写出变形后的词组。", inputSlots: phraseSlot(), answer: { slotValues: { answer } }
});

const dialogueItem = (id: string, number: string, prompt: string, promptKana: string, answer: string, answerSource: PracticeItem["answerSource"] = "audio"): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource, evaluationMode: "exact", responseScope: "dialogue_only", responseScopeHint: "写出完整会话。", inputSlots: dialogueSlot(), answer: { slotValues: { answer } }, renderHint: "dialogue"
});

const wordItem = (id: string, number: string, prompt: PromptPart[], promptKana: string, answer: string): PracticeItem => ({
  id, number, prompt, promptKana, instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer } }
});

const choiceItem = (id: string, number: string, prompt: string, promptKana: string, choices: string[], answerIndex: number, answerSource: PracticeItem["answerSource"] = "prompt"): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource, evaluationMode: "exact", responseScope: "choice_only", responseScopeHint: "选择正确答案。", choices: choices.map((label, index) => ({ id: `${id}-c${index + 1}`, label })), answer: { choiceIds: [`${id}-c${answerIndex}`] }
});

const activities: PracticeActivity[] = [
  {
    id: "l37-p1-a1", section: "practice_1", order: 1, title: "仿照例句进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "phrase", responseScope: "phrase_only",
    layout: [], itemGroups: [
      { id: "l37-p1-a1-g1", example: { label: "[例 1]", before: "中国へ行きます", beforeKana: "ちゅうごくへいきます", after: [text("中国へ行けば → 中国へ行かなければ", { kana: "ちゅうごくへいけば → ちゅうごくへいかなければ" })] }, items: [
        phraseItem("l37-p1-a1-q1", "1", "手紙を書きます", "てがみをかきます", "手紙を書けば → 手紙を書かなければ"),
        phraseItem("l37-p1-a1-q2", "2", "課長に話します", "かちょうにはなします", "課長に話せば → 課長に話さなければ"),
        phraseItem("l37-p1-a1-q3", "3", "飛行機が飛びます", "ひこうきがとびます", "飛行機が飛べば → 飛行機が飛ばなければ"),
        phraseItem("l37-p1-a1-q4", "4", "川を渡ります", "かわをわたります", "川を渡れば → 川を渡らなければ"),
        phraseItem("l37-p1-a1-q5", "5", "出発が遅れます", "しゅっぱつがおくれます", "出発が遅れれば → 出発が遅れなければ"),
        phraseItem("l37-p1-a1-q6", "6", "パソコンを使います", "パソコンをつかいます", "パソコンを使えば → パソコンを使わなければ"),
        phraseItem("l37-p1-a1-q7", "7", "切符を見せます", "きっぷをみせます", "切符を見せれば → 切符を見せなければ"),
        phraseItem("l37-p1-a1-q8", "8", "電話をかけます", "でんわをかけます", "電話をかければ → 電話をかけなければ"),
        phraseItem("l37-p1-a1-q9", "9", "計画を決めます", "けいかくをきめます", "計画を決めれば → 計画を決めなければ"),
        phraseItem("l37-p1-a1-q10", "10", "毎日復習します", "まいにちふくしゅうします", "毎日復習すれば → 毎日復習しなければ"),
        phraseItem("l37-p1-a1-q11", "11", "会議で発言します", "かいぎではつげんします", "会議で発言すれば → 会議で発言しなければ"),
        phraseItem("l37-p1-a1-q12", "12", "明日来ます", "あしたきます", "明日来れば → 明日来なければ")
      ] },
      { id: "l37-p1-a1-g2", example: { label: "[例 2]", before: "暑いです", beforeKana: "あついです", after: [text("暑ければ → 暑くなければ", { kana: "あつければ → あつくなければ" })] }, items: [
        phraseItem("l37-p1-a1-q13", "13", "若いです", "わかいです", "若ければ → 若くなければ"),
        phraseItem("l37-p1-a1-q14", "14", "重いです", "おもいです", "重ければ → 重くなければ"),
        phraseItem("l37-p1-a1-q15", "15", "眠いです", "ねむいです", "眠ければ → 眠くなければ"),
        phraseItem("l37-p1-a1-q16", "16", "弱いです", "よわいです", "弱ければ → 弱くなければ"),
        phraseItem("l37-p1-a1-q17", "17", "厳しいです", "きびしいです", "厳しければ → 厳しくなければ"),
        phraseItem("l37-p1-a1-q18", "18", "悲しいです", "かなしいです", "悲しければ → 悲しくなければ")
      ] },
      { id: "l37-p1-a1-g3", example: { label: "[例 3]", before: "雨が降ります／寒いです／便利です", beforeKana: "あめがふります／さむいです／べんりです", after: [text("雨が降るなら → 雨が降らないなら\n寒いなら → 寒くないなら\n便利なら → 便利でないなら", { kana: "あめがふるなら → あめがふらないなら\nさむいなら → さむくないなら\nべんりなら → べんりでないなら" })] }, items: [
        phraseItem("l37-p1-a1-q19", "19", "時間があります", "じかんがあります", "時間があるなら → 時間がないなら"),
        phraseItem("l37-p1-a1-q20", "20", "音がいいです", "おとがいいです", "音がいいなら → 音がよくないなら"),
        phraseItem("l37-p1-a1-q21", "21", "簡単です", "かんたんです", "簡単なら → 簡単でないなら")
      ] }
    ], items: []
  },
  {
    id: "l37-p1-a2", section: "practice_1", order: 2, title: "仿照例句，用“〜ば”造句。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only",
    layout: [], itemGroups: [
      { id: "l37-p1-a2-g1", example: { label: "[例 1]", before: "洗います／きれいになります\n急ぎません／遅れます", beforeKana: "あらいます／きれいになります\nいそぎません／おくれます", after: [text("洗えば、きれいになります。\n急がなければ、遅れます。", { kana: "あらえば、きれいになります。\nいそがなければ、おくれます。" })] }, items: [
        sentenceItem("l37-p1-a2-q1", "1", "見ます／欲しくなります", "みます／ほしくなります", "見れば、欲しくなります。"),
        sentenceItem("l37-p1-a2-q2", "2", "秋になります／涼しくなります", "あきになります／すずしくなります", "秋になれば、涼しくなります。"),
        sentenceItem("l37-p1-a2-q3", "3", "急ぎます／間に合うでしょう", "いそぎます／まにあうでしょう", "急げば、間に合うでしょう。"),
        sentenceItem("l37-p1-a2-q4", "4", "一生懸命やります／成功するでしょう", "いっしょうけんめいやります／せいこうするでしょう", "一生懸命やれば、成功するでしょう。"),
        sentenceItem("l37-p1-a2-q5", "5", "質問がありません／これで終わります", "しつもんがありません／これでおわります", "質問がなければ、これで終わります。"),
        sentenceItem("l37-p1-a2-q6", "6", "練習しません／上手になりません", "れんしゅうしません／じょうずになりません", "練習しなければ、上手になりません。"),
        sentenceItem("l37-p1-a2-q7", "7", "今すぐ始めません／間に合いません", "いますぐはじめません／まにあいません", "今すぐ始めなければ、間に合いません。"),
        sentenceItem("l37-p1-a2-q8", "8", "規則を守りません／交通事故が起きます", "きそくをまもりません／こうつうじこがおきます", "規則を守らなければ、交通事故が起きます。")
      ] },
      { id: "l37-p1-a2-g2", example: { label: "[例 2]", before: "忙しいです／手伝いましょうか\n安くないです／買いません", beforeKana: "いそがしいです／てつだいましょうか\nやすくないです／かいません", after: [text("忙しければ、手伝いましょうか。\n安くなければ、買いません。", { kana: "いそがしければ、てつだいましょうか。\nやすくなければ、かいません。" })] }, items: [
        sentenceItem("l37-p1-a2-q9", "9", "重いです／持ちましょうか", "おもいです／もちましょうか", "重ければ、持ちましょうか。"),
        sentenceItem("l37-p1-a2-q10", "10", "店のサービスが悪いです／行きません", "みせのサービスがわるいです／いきません", "店のサービスが悪ければ、行きません。"),
        sentenceItem("l37-p1-a2-q11", "11", "暑いです／窓を開けてください", "あついです／まどをあけてください", "暑ければ、窓を開けてください。"),
        sentenceItem("l37-p1-a2-q12", "12", "費用が高くないです／参加します", "ひようがたかくないです／さんかします", "費用が高くなければ、参加します。"),
        sentenceItem("l37-p1-a2-q13", "13", "遠くないです／行きたいです", "とおくないです／いきたいです", "遠くなければ、行きたいです。"),
        sentenceItem("l37-p1-a2-q14", "14", "天気がよくないです／出かけません", "てんきがよくないです／でかけません", "天気がよくなければ、出かけません。")
      ] }
    ], items: []
  },
  {
    id: "l37-p1-a3", section: "practice_1", order: 3, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only",
    layout: [{ type: "example", content: { label: "[例]", before: "あなたが行きます／わたしはここで待ちます", beforeKana: "あなたがいきます／わたしはここでまちます", after: [text("あなたが行くなら、わたしはここで待ちます。", { kana: "あなたがいくなら、わたしはここでまちます。" })] } }],
    items: [
      sentenceItem("l37-p1-a3-q1", "1", "パソコンで絵をかきます／このソフトがいいです", "パソコンでえをかきます／このソフトがいいです", "パソコンで絵をかくなら、このソフトがいいです。"),
      sentenceItem("l37-p1-a3-q2", "2", "あなたが行きません／わたしが行きます", "あなたがいきません／わたしがいきます", "あなたが行かないなら、わたしが行きます。"),
      sentenceItem("l37-p1-a3-q3", "3", "寒いです／窓を閉めてもいいですよ", "さむいです／まどをしめてもいいですよ", "寒いなら、窓を閉めてもいいですよ。"),
      sentenceItem("l37-p1-a3-q4", "4", "ラジオがうるさいです／ボリュームを下げましょうか", "ラジオがうるさいです／ボリュームをさげましょうか", "ラジオがうるさいなら、ボリュームを下げましょうか。"),
      sentenceItem("l37-p1-a3-q5", "5", "明日暇です／いっしょに買い物に行きませんか", "あしたひまです／いっしょにかいものにいきませんか", "明日暇なら、いっしょに買い物に行きませんか。"),
      sentenceItem("l37-p1-a3-q6", "6", "日曜日です／時間があります", "にちようびです／じかんがあります", "日曜日なら、時間があります。")
    ]
  },
  {
    id: "l37-p1-a4", section: "practice_1", order: 4, title: "仿照例句回答提问。然后听录音练习会话。", instruction: "", interaction: "dialogue_practice", answerUnit: "sentence", responseScope: "answer_only", responseScopeHint: "只写回答句。", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 4), label: "第37课 练习I-4", transcript: { source: "asr", confidenceNote: "ASR 覆盖例句和全部4题；按教材括号中的 はい/いいえ 与例句规则整理标准答案。", text: "高ければ買いませんか。はい。高ければ買いません。いいえ。高くても買います。1 遠ければ行きませんか。はい。遠ければ行きません。2 聞かなければ分かりませんか。いいえ。聞かなくても分かります。3 雨なら運動会は中止ですか。はい。雨なら運動会は中止です。4 時間がなければ勉強しませんか。いいえ。時間がなくても勉強します。", segments: [
      { itemNumber: "1", text: "遠ければ行きません。" }, { itemNumber: "2", text: "聞かなくても分かります。" }, { itemNumber: "3", text: "雨なら運動会は中止です。" }, { itemNumber: "4", text: "時間がなくても勉強します。" }
    ] } },
    layout: [{ type: "example", content: { label: "[例]", before: "高ければ、買いませんか。（はい）\n高ければ、買いませんか。（いいえ）", beforeKana: "たかければ、かいませんか。（はい）\nたかければ、かいませんか。（いいえ）", after: [text("はい、高ければ、買いません。\nいいえ、高くても、買います。", { kana: "はい、たかければ、かいません。\nいいえ、たかくても、かいます。" })] } }],
    items: [
      sentenceItem("l37-p1-a4-q1", "1", "遠ければ、行きませんか。（はい）", "とおければ、いきませんか。（はい）", "はい、遠ければ、行きません。", "audio"),
      sentenceItem("l37-p1-a4-q2", "2", "聞かなければ、分かりませんか。（いいえ）", "きかなければ、わかりませんか。（いいえ）", "いいえ、聞かなくても、分かります。", "audio"),
      sentenceItem("l37-p1-a4-q3", "3", "雨なら、運動会は中止ですか。（はい）", "あめなら、うんどうかいはちゅうしですか。（はい）", "はい、雨なら、運動会は中止です。", "audio"),
      sentenceItem("l37-p1-a4-q4", "4", "時間がなければ、勉強しませんか。（いいえ）", "じかんがなければ、べんきょうしませんか。（いいえ）", "いいえ、時間がなくても、勉強します。", "audio")
    ].map(item => ({ ...item, responseScope: "answer_only" as const, responseScopeHint: "只写回答句。" }))
  },
  {
    id: "l37-p1-a5", section: "practice_1", order: 5, title: "听录音，仿照例句替换画线部分练习会话。", instruction: "", interaction: "dialogue_practice", answerUnit: "dialogue", responseScope: "dialogue_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 5), label: "第37课 练习I-5", transcript: { source: "asr", confidenceNote: "ASR 分段覆盖例句1、1—3题、例句2、4—6题；据教材替换词校正专名和片假名。", text: "例1 お茶を飲みます。お久しぶりですね。お元気ですか。ええ、相変わらずです。もし時間があるなら、ちょっとお茶でも飲みませんか。いいですね。そうしましょう。1 ビールを飲みます。2 昼ご飯を食べます。3 話をします。例2 何を買いましたか。Tシャツ、サンダル。何を買ったんですか。Tシャツとかサンダルとか、いろいろ買いました。ずいぶんたくさん買ったんですね。4 どんなお土産を買いましたか。シルクのハンカチ、ネクタイ。5 何を食べましたか。寿司、天ぷら。6 どこへ行きましたか。天安門、万里の長城。", segments: [] } },
    layout: [], itemGroups: [
      { id: "l37-p1-a5-g1", example: { label: "[例 1]", before: "お茶を飲みます", beforeKana: "おちゃをのみます", after: [text("甲：お久しぶりですね。お元気ですか。\n乙：ええ、相変わらずです。\n甲：もし、時間があるなら、ちょっとお茶でも飲みませんか。\n乙：いいですね。そうしましょう。", { kana: "こう：おひさしぶりですね。おげんきですか。\nおつ：ええ、あいかわらずです。\nこう：もし、じかんがあるなら、ちょっとおちゃでものみませんか。\nおつ：いいですね。そうしましょう。" })] }, items: [
        dialogueItem("l37-p1-a5-q1", "1", "ビールを飲みます", "ビールをのみます", "甲：お久しぶりですね。お元気ですか。\n乙：ええ、相変わらずです。\n甲：もし、時間があるなら、ちょっとビールでも飲みませんか。\n乙：いいですね。そうしましょう。"),
        dialogueItem("l37-p1-a5-q2", "2", "昼ご飯を食べます", "ひるごはんをたべます", "甲：お久しぶりですね。お元気ですか。\n乙：ええ、相変わらずです。\n甲：もし、時間があるなら、ちょっと昼ご飯でも食べませんか。\n乙：いいですね。そうしましょう。"),
        dialogueItem("l37-p1-a5-q3", "3", "話をします", "はなしをします", "甲：お久しぶりですね。お元気ですか。\n乙：ええ、相変わらずです。\n甲：もし、時間があるなら、ちょっと話でもしませんか。\n乙：いいですね。そうしましょう。")
      ] },
      { id: "l37-p1-a5-g2", example: { label: "[例 2]", before: "何を買いましたか／Tシャツ／サンダル", beforeKana: "なにをかいましたか／ティーシャツ／サンダル", after: [text("甲：何を買ったんですか。\n乙：Tシャツとかサンダルとか、いろいろ買いました。\n甲：ずいぶんたくさん買ったんですね。", { kana: "こう：なにをかったんですか。\nおつ：ティーシャツとかサンダルとか、いろいろかいました。\nこう：ずいぶんたくさんかったんですね。" })] }, items: [
        dialogueItem("l37-p1-a5-q4", "4", "どんなお土産を買いましたか／シルクのハンカチ／ネクタイ", "どんなおみやげをかいましたか／シルクのハンカチ／ネクタイ", "甲：どんなお土産を買ったんですか。\n乙：シルクのハンカチとかネクタイとか、いろいろ買いました。\n甲：ずいぶんたくさん買ったんですね。"),
        dialogueItem("l37-p1-a5-q5", "5", "何を食べましたか／寿司／天ぷら", "なにをたべましたか／すし／てんぷら", "甲：何を食べたんですか。\n乙：寿司とか天ぷらとか、いろいろ食べました。\n甲：ずいぶんたくさん食べたんですね。"),
        dialogueItem("l37-p1-a5-q6", "6", "どこへ行きましたか／天安門／万里の長城", "どこへいきましたか／てんあんもん／ばんりのちょうじょう", "甲：どこへ行ったんですか。\n乙：天安門とか万里の長城とか、いろいろ行きました。\n甲：ずいぶんたくさん行ったんですね。")
      ] }
    ], items: []
  },
  {
    id: "l37-p2-a1", section: "practice_2", order: 1, title: "给正确的答案画○。", instruction: "", interaction: "single_choice", answerUnit: "choice", responseScope: "choice_only",
    layout: [{ type: "example", content: { label: "[例]", beforeParts: [text("京都へ（", { kana: "きょうとへ（" }), text("行けば", { kana: "いけば" }), text("・", { kana: "・" }), text("行ったら", { kana: "いったら", underline: true }), text("）、わたしの友達に会ってください。", { kana: "）、わたしのともだちにあってください。" })], after: [] } }],
    items: [
      choiceItem("l37-p2-a1-q1", "1", "このボタンを（押すと・押すなら）、電気がつきます。", "このボタンを（おすと・おすなら）、でんきがつきます。", ["押すと", "押すなら"], 1),
      choiceItem("l37-p2-a1-q2", "2", "明日（いい天気なら・いい天気だと）、ピクニックに行きたいです。", "あした（いいてんきなら・いいてんきだと）、ピクニックにいきたいです。", ["いい天気なら", "いい天気だと"], 1),
      choiceItem("l37-p2-a1-q3", "3", "（困ったら・困ると）、わたしに相談してください。", "（こまったら・こまると）、わたしにそうだんしてください。", ["困ったら", "困ると"], 1),
      choiceItem("l37-p2-a1-q4", "4", "問題が（なければ・ないと）、会議を終わります。", "もんだいが（なければ・ないと）、かいぎをおわります。", ["なければ", "ないと"], 1),
      choiceItem("l37-p2-a1-q5", "5", "（暑いと・暑いなら）、クーラーをつけてください。", "（あついと・あついなら）、クーラーをつけてください。", ["暑いと", "暑いなら"], 2),
      choiceItem("l37-p2-a1-q6", "6", "雨（でも・だったら）、参加しなくてもいいですか。——いいえ、雨（なら・でも）、参加しないといけません。", "あめ（でも・だったら）、さんかしなくてもいいですか。——いいえ、あめ（なら・でも）、さんかしないといけません。", ["だったら／でも", "でも／なら"], 1)
    ]
  },
  {
    id: "l37-p2-a2", section: "practice_2", order: 2, title: "从□中选择适当的词语填入（　）中。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only",
    layout: [{ type: "example", content: { label: "[例]", beforeParts: [text("セーターや靴やかばん（", { kana: "セーターやくつやかばん（" }), text("など", { kana: "など", underline: true }), text("）、いろいろ売っています。", { kana: "）、いろいろうっています。" })], after: [] } }, { type: "word_bank", words: ["でも", "しか", "など", "とか", "だけ", "でも", "とか"].map(value => text(value)) }],
    items: [
      wordItem("l37-p2-a2-q1", "1", [text("部屋には机といす（", { kana: "へやにはつくえといす（" }), blank(), text("）ありません。")], "へやにはつくえといす（____）ありません。", "しか"),
      wordItem("l37-p2-a2-q2", "2", [text("30分（", { kana: "さんじゅっぷん（" }), blank(), text("）ならテレビを見てもいいです。", { kana: "）ならテレビをみてもいいです。" })], "さんじゅっぷん（____）ならテレビをみてもいいです。", "だけ"),
      wordItem("l37-p2-a2-q3", "3", [text("それは簡単だから、子供（", { kana: "それはかんたんだから、こども（" }), blank(), text("）できるでしょう。")], "それはかんたんだから、こども（____）できるでしょう。", "でも"),
      wordItem("l37-p2-a2-q4", "4", [text("CD（"), blank(), text("）テープ（"), { type: "blank", slotId: "answer2" }, text("）を聞いて、勉強しています。", { kana: "）をきいて、べんきょうしています。" })], "シーディー（____）テープ（____）をきいて、べんきょうしています。", "とか"),
      wordItem("l37-p2-a2-q5", "5", [text("李さんなら、小野さんとお茶（", { kana: "りさんなら、おのさんとおちゃ（" }), blank(), text("）飲みに行ったんじゃないでしょうか。", { kana: "）のみにいったんじゃないでしょうか。" })], "りさんなら、おのさんとおちゃ（____）のみにいったんじゃないでしょうか。", "でも")
    ].map(item => item.id === "l37-p2-a2-q4" ? ({ ...item, renderHint: "dual_word" as const, inputSlots: [{ id: "answer", expectedUnit: "word" as const, width: "medium" as const, placeholder: "输入答案" }, { id: "answer2", expectedUnit: "word" as const, width: "medium" as const, placeholder: "输入答案" }], answer: { slotValues: { answer: "とか", answer2: "とか" } } }) : item)
  },
  {
    id: "l37-p2-a3", section: "practice_2", order: 3, title: "听录音，给正确答案画○。", instruction: "", interaction: "single_choice", answerUnit: "choice", responseScope: "choice_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(2, 3), label: "第37课 练习II-3", transcript: { source: "asr", confidenceNote: "ASR 分段覆盖例句及2题；第1题答案为「馬さんに聞けば分かります」，第2题答案为「いいえ、雨だったら行きません」。", text: "例 新しいパソコン、安ければ買いますか。そうですね。今使っているのをもう少し使ってみます。この人は新しいパソコンを買いますか。1 はい、買います。2 いいえ、買いません。1 歓迎会のために予約したレストランの行き方、分かりますか。森さんに聞けば分かるかもしれませんよ。それが知らないんですって。じゃあ、馬さんなら絶対に知っていますよ。馬さんがよく行くレストランですから。誰に聞いたら分かりますか。1 森さんに聞けば分かります。2 馬さんに聞けば分かります。2 日曜日、天気がよければピクニックに行きませんか。いいですね。雨だったらどうしますか。そうですね。雨だったら来月にしましょう。日曜日、雨でもピクニックに行きますか。1 はい、雨でも行きます。2 いいえ、雨だったら行きません。", segments: [{ itemNumber: "1", text: "馬さんに聞けば分かります。" }, { itemNumber: "2", text: "いいえ、雨だったら行きません。" }] } },
    layout: [{ type: "example", content: { label: "[例]", before: "この人は新しいパソコンを買いますか。", beforeKana: "このひとはあたらしいパソコンをかいますか。", after: [text("① はい、買います。\n② いいえ、買いません。", { kana: "いち はい、かいます。\nに いいえ、かいません。" })] } }],
    items: [
      choiceItem("l37-p2-a3-q1", "1", "誰に聞いたら分かりますか。", "だれにきいたらわかりますか。", ["森さんに聞けば分かります。", "馬さんに聞けば分かります。"], 2, "audio"),
      choiceItem("l37-p2-a3-q2", "2", "日曜日、雨でもピクニックに行きますか。", "にちようび、あめでもピクニックにいきますか。", ["はい、雨でも行きます。", "いいえ、雨だったら行きません。"], 2, "audio")
    ]
  },
  {
    id: "l37-p2-a4", section: "practice_2", order: 4, title: "将下面的句子译成日语。", instruction: "", interaction: "translation", answerUnit: "sentence", responseScope: "sentence_only",
    layout: [], items: [
      sentenceItem("l37-p2-a4-q1", "1", "如果获胜，就能够参加奥运会。", "", "優勝すれば、オリンピックに出場することができます。", "prompt"),
      sentenceItem("l37-p2-a4-q2", "2", "如果去天安门，坐地铁很方便。", "", "天安門へ行くなら、地下鉄が便利です。", "prompt"),
      sentenceItem("l37-p2-a4-q3", "3", "最近有点胖了。——那就运动运动怎么样？", "", "最近ちょっと太りました。——じゃあ、運動でもしたらどうですか。", "prompt")
    ]
  }
];

export const lesson37Practice: LessonPractice = {
  lessonId: "lesson37",
  title: "第37课 優勝すれば、オリンピックに出場することができます",
  sourcePages: [{ pageNo: 148, imagePath: page(148) }, { pageNo: 149, imagePath: page(149) }, { pageNo: 150, imagePath: page(150) }],
  activities
};
