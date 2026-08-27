import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson30/page${pageNo}.webp`;
const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit8/lesson30/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const wordSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "word", width: "medium", placeholder: "输入答案" }];
const sentenceSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder: "输入完整句子" }];
const dialogueSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows: 5, placeholder: "输入完整会话" }];
const booleanSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "boolean", width: "short", placeholder: "○ / ×" }];

const formItem = (id: string, number: string, prompt: string, kana: string, answer: string, source: "audio" | "prompt" = "prompt"): PracticeItem => ({
  id, number, prompt: [text(prompt), text(" → "), blank("answer")], promptKana: `${kana} → ______`, instruction: "",
  answerSource: source, evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写箭头后的词语。",
  inputSlots: wordSlot(), answer: { slotValues: { answer } }
});

const bracketTransformItem = (id: string, number: string, before: string, beforeKana: string, after: string, afterKana: string, answer: string): PracticeItem => ({
  id, number, prompt: [text(before), blank("answer"), text(after)], promptKana: `${beforeKana}______${afterKana}`, instruction: "",
  answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写箭头后的词语。",
  inputSlots: wordSlot(), answer: { slotValues: { answer } }
});

const sentenceItem = (id: string, number: string, prompt: string, kana: string, answer: string): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana: kana, instruction: "", answerSource: "example_transform", evaluationMode: "exact",
  responseScope: "sentence_only", responseScopeHint: "写出完整句子。", inputSlots: sentenceSlot(), answer: { slotValues: { answer } }
});

const dialogueItem = (id: string, number: string, prompt: string, kana: string, answer: string): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana: kana, instruction: "", answerSource: "audio", evaluationMode: "exact",
  responseScope: "dialogue_only", responseScopeHint: "听录音并仿照例句写出完整会话。", inputSlots: dialogueSlot(), answer: { slotValues: { answer } }, renderHint: "dialogue"
});

const activities: PracticeActivity[] = [
  {
    id: "l30-p1-a1", section: "practice_1", order: 1, title: "听录音，填空并反复朗读。", instruction: "",
    interaction: "fill_blank", answerUnit: "word", responseScope: "word_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 1), label: "第30课 练习I-1", transcript: { source: "asr", text: "聞く、聞こう。泳ぐ、泳ごう。飲む、飲もう。遊ぶ、遊ぼう。待つ、待とう。買う、買おう。洗う、洗おう。貸す、貸そう。消す、消そう。あげる、あげよう。やめる、やめよう。食べる、食べよう。来る、来よう。相談する、相談しよう。" } },
    assets: [{ id: "l30-p1-a1-volitional-table", kind: "exercise_image", imagePath: exerciseImage("book1_lesson30_1_1.png"), label: "练习 I 1 动词意志形表" }], displayAssets: ["l30-p1-a1-volitional-table"], layout: [],
    items: [
      ["聞く", "きく", "聞こう"], ["泳ぐ", "およぐ", "泳ごう"], ["飲む", "のむ", "飲もう"], ["遊ぶ", "あそぶ", "遊ぼう"], ["待つ", "まつ", "待とう"], ["買う", "かう", "買おう"], ["洗う", "あらう", "洗おう"], ["貸す", "かす", "貸そう"], ["消す", "けす", "消そう"], ["あげる", "あげる", "あげよう"], ["やめる", "やめる", "やめよう"], ["食べる", "たべる", "食べよう"], ["来る", "くる", "来よう"], ["相談する", "そうだんする", "相談しよう"]
    ].map(([prompt, kana, answer], index) => formItem(`l30-p1-a1-q${index + 1}`, String(index + 1), prompt, kana, answer, "audio"))
  },
  {
    id: "l30-p1-a2", section: "practice_1", order: 2, title: "仿照例句，将（　）中的词语变为意志形。", instruction: "",
    interaction: "fill_blank", answerUnit: "word", responseScope: "word_only", layout: [
      { type: "example", content: { label: "[例]", before: "もう11時だから（寝ます → 寝よう）。", beforeKana: "もうじゅういちじだから（ねます → ねよう）。", after: [text("")] } }
    ],
    items: [
      { id: "l30-p1-a2-q1", number: "1", prompt: [text("疲れたね。ちょっと（休みます → "), blank("a"), text("）。——うん、そう（します → "), blank("b"), text("）。")], promptKana: "つかれたね。ちょっと（やすみます → ______）。——うん、そう（します → ______）。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "按顺序填写两个括号中的词语。", inputSlots: [{ id: "a", expectedUnit: "word", width: "short", placeholder: "答案" }, { id: "b", expectedUnit: "word", width: "short", placeholder: "答案" }], answer: { slotValues: { a: "休もう", b: "しよう" } } },
      bracketTransformItem("l30-p1-a2-q2", "2", "安くなったから、この靴を（買います → ", "やすくなったから、このくつを（かいます → ", "）。", "）。", "買おう"),
      bracketTransformItem("l30-p1-a2-q3", "3", "この時計、気に入っているから、直して（使います → ", "このとけい、きにいっているから、なおして（つかいます → ", "）。", "）。", "使おう"),
      bracketTransformItem("l30-p1-a2-q4", "4", "みんなそろったから、会議を（始めます → ", "みんなそろったから、かいぎを（はじめます → ", "）。", "）。", "始めよう")
    ]
  },
  {
    id: "l30-p1-a3", section: "practice_1", order: 3, title: "仿照例句替换画线部分进行练习。", instruction: "",
    interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [], itemGroups: [
      { id: "l30-p1-a3-g1", example: { label: "[例1]", before: "帰ります", beforeKana: "かえります", after: [text("そろそろ帰ろうと思います。", { kana: "そろそろかえろうとおもいます。" })], afterKana: "そろそろかえろうとおもいます。" }, items: [
        sentenceItem("l30-p1-a3-q1", "1", "寝ます", "ねます", "そろそろ寝ようと思います。"), sentenceItem("l30-p1-a3-q2", "2", "結婚します", "けっこんします", "そろそろ結婚しようと思います。"), sentenceItem("l30-p1-a3-q3", "3", "出発します", "しゅっぱつします", "そろそろ出発しようと思います。"), sentenceItem("l30-p1-a3-q4", "4", "片づけます", "かたづけます", "そろそろ片づけようと思います。")
      ] },
      { id: "l30-p1-a3-g2", example: { label: "[例2]", before: "今度、長江下りをします。", beforeKana: "こんど、ちょうこうくだりをします。", after: [text("今度、長江下りをしようと思っています。", { kana: "こんど、ちょうこうくだりをしようとおもっています。" })], afterKana: "こんど、ちょうこうくだりをしようとおもっています。" }, items: [
        sentenceItem("l30-p1-a3-q5", "5", "来年は北海道に行きます。", "らいねんはほっかいどうにいきます。", "来年は北海道に行こうと思っています。"), sentenceItem("l30-p1-a3-q6", "6", "これは大切なので、もう一度彼に言います。", "これはたいせつなので、もういちどかれにいいます。", "これは大切なので、もう一度彼に言おうと思っています。"), sentenceItem("l30-p1-a3-q7", "7", "ここは不便なので、引っ越します。", "ここはふべんなので、ひっこします。", "ここは不便なので、引っ越そうと思っています。"), sentenceItem("l30-p1-a3-q8", "8", "1人では決められないので、先生に相談します。", "ひとりではきめられないので、せんせいにそうだんします。", "1人では決められないので、先生に相談しようと思っています。")
      ] }
    ], items: []
  },
  {
    id: "l30-p1-a4", section: "practice_1", order: 4, title: "仿照例句用“～ので”将两个句子连接成一个句子。", instruction: "",
    interaction: "sentence_ordering", answerUnit: "sentence", responseScope: "sentence_only", layout: [], itemGroups: [
      { id: "l30-p1-a4-g1", example: { label: "[例1]", before: "お客さんが来ます／迎えに行きます", beforeKana: "おきゃくさんがきます／むかえにいきます", after: [text("お客さんが来るので、迎えに行きます。", { kana: "おきゃくさんがくるので、むかえにいきます。" })], afterKana: "おきゃくさんがくるので、むかえにいきます。" }, items: [
        sentenceItem("l30-p1-a4-q1", "1", "社長が来ます／集まってください", "しゃちょうがきます／あつまってください", "社長が来るので、集まってください。"), sentenceItem("l30-p1-a4-q2", "2", "パソコンが壊れました／修理に来てください", "パソコンがこわれました／しゅうりにきてください", "パソコンが壊れたので、修理に来てください。"), sentenceItem("l30-p1-a4-q3", "3", "今日は帰るのが遅くなります／明日の朝連絡します", "きょうはかえるのがおそくなります／あしたのあされんらくします", "今日は帰るのが遅くなるので、明日の朝連絡します。"), sentenceItem("l30-p1-a4-q4", "4", "長島さんには会ったことがありません／写真を見せてください", "ながしまさんにはあったことがありません／しゃしんをみせてください", "長島さんには会ったことがないので、写真を見せてください。"), sentenceItem("l30-p1-a4-q5", "5", "予約をしたいです／電話番号を教えてください", "よやくをしたいです／でんわばんごうをおしえてください", "予約をしたいので、電話番号を教えてください。")
      ] },
      { id: "l30-p1-a4-g2", example: { label: "[例2]", before: "おなかが痛いです／ちょっと寝ます", beforeKana: "おなかがいたいです／ちょっとねます", after: [text("おなかが痛いので、ちょっと寝ます。", { kana: "おなかがいたいので、ちょっとねます。" })], afterKana: "おなかがいたいので、ちょっとねます。" }, items: [
        sentenceItem("l30-p1-a4-q6", "6", "目が疲れました／ちょっと休みます", "めがつかれました／ちょっとやすみます", "目が疲れたので、ちょっと休みます。"), sentenceItem("l30-p1-a4-q7", "7", "あの人は有名です／だれでも知っています", "あのひとはゆうめいです／だれでもしっています", "あの人は有名なので、だれでも知っています。"), sentenceItem("l30-p1-a4-q8", "8", "静かでした／ゆっくり寝ました", "しずかでした／ゆっくりねました", "静かだったので、ゆっくり寝ました。"), sentenceItem("l30-p1-a4-q9", "9", "今日は特別な日です／ピザを作ります", "きょうはとくべつなひです／ピザをつくります", "今日は特別な日なので、ピザを作ります。"), sentenceItem("l30-p1-a4-q10", "10", "昨日休みでした／友達とサッカーをしました", "きのうやすみでした／ともだちとサッカーをしました", "昨日休みだったので、友達とサッカーをしました。")
      ] }
    ], items: []
  },
  {
    id: "l30-p1-a5", section: "practice_1", order: 5, title: "仿照例句替换画线部分进行练习。", instruction: "",
    interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [{ type: "example", content: { label: "[例]", before: "頭が痛いです／早く帰ります", beforeKana: "あたまがいたいです／はやくかえります", after: [text("頭が痛いので、早く帰りたいんですが。", { kana: "あたまがいたいので、はやくかえりたいんですが。" })], afterKana: "あたまがいたいので、はやくかえりたいんですが。" } }],
    items: [
      sentenceItem("l30-p1-a5-q1", "1", "熱があります／休みます", "ねつがあります／やすみます", "熱があるので、休みたいんですが。"), sentenceItem("l30-p1-a5-q2", "2", "お金がありません／銀行で下ろします", "おかねがありません／ぎんこうでおろします", "お金がないので、銀行で下ろしたいんですが。"), sentenceItem("l30-p1-a5-q3", "3", "歯が痛いです／薬を飲みます", "はがいたいです／くすりをのみます", "歯が痛いので、薬を飲みたいんですが。"), sentenceItem("l30-p1-a5-q4", "4", "息子の誕生日です／早く帰ります", "むすこのたんじょうびです／はやくかえります", "息子の誕生日なので、早く帰りたいんですが。"), sentenceItem("l30-p1-a5-q5", "5", "使い方が簡単です／これを買います", "つかいかたがかんたんです／これをかいます", "使い方が簡単なので、これを買いたいんですが。"), sentenceItem("l30-p1-a5-q6", "6", "寂しいです／友達を呼びます", "さびしいです／ともだちをよびます", "寂しいので、友達を呼びたいんですが。")
    ]
  },
  {
    id: "l30-p1-a6", section: "practice_1", order: 6, title: "听录音，仿照例句替换画线部分练习会话。", instruction: "",
    interaction: "dialogue_practice", answerUnit: "dialogue", responseScope: "dialogue_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 6), label: "第30课 练习I-6", transcript: { source: "asr", text: "週末に何をしますか。テニスをしようと思っています。私もしようと思っています。じゃあ、一緒にしませんか。ずいぶん遅かったね。すみません。道を間違えたので、遅くなりました。じゃあ、仕方ないな。" } }, layout: [], itemGroups: [
      { id: "l30-p1-a6-g1", example: { label: "[例1]", before: "テニスをします", beforeKana: "テニスをします", after: [text("甲：週末に何をしますか。\n乙：テニスをしようと思っています。\n甲：わたしもしようと思っています。\n乙：じゃあ、いっしょにしませんか。", { kana: "こう：しゅうまつになにをしますか。\nおつ：テニスをしようとおもっています。\nこう：わたしもしようとおもっています。\nおつ：じゃあ、いっしょにしませんか。" })], afterKana: "こう：しゅうまつになにをしますか。\nおつ：テニスをしようとおもっています。\nこう：わたしもしようとおもっています。\nおつ：じゃあ、いっしょにしませんか。" }, items: [
        dialogueItem("l30-p1-a6-q1", "1", "山に登ります", "やまにのぼります", "甲：週末に何をしますか。\n乙：山に登ろうと思っています。\n甲：わたしも山に登ろうと思っています。\n乙：じゃあ、いっしょに登りませんか。"), dialogueItem("l30-p1-a6-q2", "2", "家族とピクニックに行きます", "かぞくとピクニックにいきます", "甲：週末に何をしますか。\n乙：家族とピクニックに行こうと思っています。\n甲：わたしも家族とピクニックに行こうと思っています。\n乙：じゃあ、いっしょに行きませんか。"), dialogueItem("l30-p1-a6-q3", "3", "フランス語を勉強します", "フランスごをべんきょうします", "甲：週末に何をしますか。\n乙：フランス語を勉強しようと思っています。\n甲：わたしも勉強しようと思っています。\n乙：じゃあ、いっしょにしませんか。"), dialogueItem("l30-p1-a6-q4", "4", "公園で太極拳をします", "こうえんでたいきょくけんをします", "甲：週末に何をしますか。\n乙：公園で太極拳をしようと思っています。\n甲：わたしもしようと思っています。\n乙：じゃあ、いっしょにしませんか。")
      ] },
      { id: "l30-p1-a6-g2", example: { label: "[例2]", before: "道を間違えました", beforeKana: "みちをまちがえました", after: [text("甲：ずいぶん遅かったね。\n乙：すみません。道を間違えたので、遅くなりました。\n甲：じゃあ、仕方ないな。", { kana: "こう：ずいぶんおそかったね。\nおつ：すみません。みちをまちがえたので、おそくなりました。\nこう：じゃあ、しかたないな。" })], afterKana: "こう：ずいぶんおそかったね。\nおつ：すみません。みちをまちがえたので、おそくなりました。\nこう：じゃあ、しかたないな。" }, items: [
        dialogueItem("l30-p1-a6-q5", "5", "自転車がパンクしました", "じてんしゃがパンクしました", "甲：ずいぶん遅かったね。\n乙：すみません。自転車がパンクしたので、遅くなりました。\n甲：じゃあ、仕方ないな。"), dialogueItem("l30-p1-a6-q6", "6", "電車が遅れました", "でんしゃがおくれました", "甲：ずいぶん遅かったね。\n乙：すみません。電車が遅れたので、遅くなりました。\n甲：じゃあ、仕方ないな。"), dialogueItem("l30-p1-a6-q7", "7", "バスが全然来ませんでした", "バスがぜんぜんきませんでした", "甲：ずいぶん遅かったね。\n乙：すみません。バスが全然来なかったので、遅くなりました。\n甲：じゃあ、仕方ないな。"), dialogueItem("l30-p1-a6-q8", "8", "病院に寄りました", "びょういんによりました", "甲：ずいぶん遅かったね。\n乙：すみません。病院に寄ったので、遅くなりました。\n甲：じゃあ、仕方ないな。")
      ] }
    ], items: []
  },
  {
    id: "l30-p2-a1", section: "practice_2", order: 1, title: "从框中选择动词，变成适当的形式完成句子。", instruction: "",
    interaction: "fill_blank", answerUnit: "word", responseScope: "word_only", assets: [{ id: "l30-p2-a1-word-bank", kind: "exercise_image", imagePath: exerciseImage("book1_lesson30_2_1.png"), label: "练习 II 1 动词框" }], displayAssets: ["l30-p2-a1-word-bank"], layout: [{ type: "example", content: { label: "[例]", before: "箱根に（行った）時、富士山を見ました。", beforeKana: "はこねに（いった）とき、ふじさんをみました。", after: [text("")] } }, { type: "word_bank", words: [text("行きます", { kana: "いきます" }), text("撮ります", { kana: "とります" }), text("見せます", { kana: "みせます" }), text("届けます", { kana: "とどけます" }), text("買います", { kana: "かいます" }), text("します")] }],
    items: [
      { id: "l30-p2-a1-q1", number: "1", prompt: [text("給料をもらったので、新しい靴を（"), blank("answer"), text("）と思います。")], promptKana: "きゅうりょうをもらったので、あたらしいくつを（______）とおもいます。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer: "買おう" } } },
      { id: "l30-p2-a1-q2", number: "2", prompt: [text("写真を（"), blank("answer"), text("）ながら、説明します。")], promptKana: "しゃしんを（______）ながら、せつめいします。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer: "見せ" } } },
      { id: "l30-p2-a1-q3", number: "3", prompt: [text("雨で、外に出たくなかったので、電話して、ピザを（"), blank("answer"), text("）もらいました。")], promptKana: "あめで、そとにでたくなかったので、でんわして、ピザを（______）もらいました。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer: "届けて" } } },
      { id: "l30-p2-a1-q4", number: "4", prompt: [text("来年は北海道旅行を（"), blank("answer"), text("）と思っています。")], promptKana: "らいねんはほっかいどうりょこうを（______）とおもっています。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer: "しよう" } } },
      { id: "l30-p2-a1-q5", number: "5", prompt: [text("「撮影禁止」は写真を（"), blank("answer"), text("）という意味です。")], promptKana: "「さつえいきんし」はしゃしんを（______）といういみです。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer: "撮るな" } } }
    ]
  },
  {
    id: "l30-p2-a2", section: "practice_2", order: 2, title: "将（　）中的词语变成适当的形式完成句子。", instruction: "",
    interaction: "fill_blank", answerUnit: "word", responseScope: "word_only", layout: [{ type: "example", content: { label: "[例]", before: "（暑いです → 暑い）ので、窓を開けてもいいですか。", beforeKana: "（あついです → あつい）ので、まどをあけてもいいですか。", after: [text("")] } }],
    items: [
      bracketTransformItem("l30-p2-a2-q1", "1", "日本語が（上手ではありません → ", "にほんごが（じょうずではありません → ", "）ので、中国語で話してもいいですか。", "）ので、ちゅうごくごではなしてもいいですか。", "上手ではない"), bracketTransformItem("l30-p2-a2-q2", "2", "JIC企画へ午後（行きます → ", "ジェイアイシーきかくへごご（いきます → ", "）ので、資料を準備してください。", "）ので、しりょうをじゅんびしてください。", "行く"), bracketTransformItem("l30-p2-a2-q3", "3", "母が（病気です → ", "ははが（びょうきです → ", "）ので、少し早く帰ります。", "）ので、すこしはやくかえります。", "病気な"), bracketTransformItem("l30-p2-a2-q4", "4", "1年間韓国に（住んでいました → ", "いちねんかんかんこくに（すんでいました → ", "）ので、韓国語が少し分かります。", "）ので、かんこくごがすこしわかります。", "住んでいた"), bracketTransformItem("l30-p2-a2-q5", "5", "王さんはコンピュータ会社で（働いています → ", "おうさんはコンピュータがいしゃで（はたらいています → ", "）ので、コンピュータの使い方をよく知っています。", "）ので、コンピュータのつかいかたをよくしっています。", "働いている")
    ]
  },
  {
    id: "l30-p2-a3", section: "practice_2", order: 3, title: "读下面的文章，回答录音中的提问。", instruction: "",
    interaction: "listening_answer", answerUnit: "sentence", responseScope: "answer_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(2, 3), label: "第30课 练习II-3", transcript: { source: "asr", text: "陳さんと王さんは日本で何をしましたか。2人は今どこにいますか。陳さんは何をするのが好きですか。陳さんはどこでアルバイトをしましたか。2人の夢は何ですか。" } },
    assets: [{ id: "l30-p2-a3-passage", kind: "exercise_image", imagePath: exerciseImage("book1_lesson30_2_3.png"), label: "练习 II 3 阅读文章" }], displayAssets: ["l30-p2-a3-passage"], layout: [{ type: "passage", lines: [text("陳さんと王さんは留学生です。2年間日本に住んで、日本語を勉強しました。もうすぐ中国へ帰ります。", { kana: "ちんさんとおうさんはりゅうがくせいです。にねんかんにほんにすんで、にほんごをべんきょうしました。もうすぐちゅうごくへかえります。" }), text("陳さんは料理を作るのが好きなので、日本料理のいろいろな店でアルバイトをしました。おいしい天ぷらや親子丼を作ることができます。", { kana: "ちんさんはりょうりをつくるのがすきなので、にほんりょうりのいろいろなみせでアルバイトをしました。おいしいてんぷらやおやこどんをつくることができます。" }), text("だから、中国へ帰って、2人で日本料理の小さな店を開こうと言っています。それで、中国人に日本料理を食べてもらおうと思っています。これは2人の夢です。", { kana: "だから、ちゅうごくへかえって、ふたりでにほんりょうりのちいさなみせをひらこうといっています。それで、ちゅうごくじんににほんりょうりをたべてもらおうとおもっています。これはふたりのゆめです。" })] }, { type: "example", content: { label: "[例]", before: "陳さんは留学生ですか。", beforeKana: "ちんさんはりゅうがくせいですか。", after: [text("はい、そうです。")] } }],
    items: [
      sentenceItem("l30-p2-a3-q1", "1", "陳さんと王さんは日本で何をしましたか。", "ちんさんとおうさんはにほんでなにをしましたか。", "日本語を勉強しました。"), sentenceItem("l30-p2-a3-q2", "2", "2人は今どこにいますか。", "ふたりはいまどこにいますか。", "日本にいます。"), sentenceItem("l30-p2-a3-q3", "3", "陳さんは何をするのが好きですか。", "ちんさんはなにをするのがすきですか。", "料理を作るのが好きです。"), sentenceItem("l30-p2-a3-q4", "4", "陳さんはどこでアルバイトをしましたか。", "ちんさんはどこでアルバイトをしましたか。", "日本料理のいろいろな店でアルバイトをしました。"), sentenceItem("l30-p2-a3-q5", "5", "2人の夢は何ですか。", "ふたりのゆめはなんですか。", "中国へ帰って、2人で日本料理の小さな店を開くことです。")
    ].map((item) => ({ ...item, answerSource: "audio", responseScope: "answer_only", responseScopeHint: "只写回答句。" }))
  },
  {
    id: "l30-p2-a4", section: "practice_2", order: 4, title: "将下面的句子译成日语。", instruction: "",
    interaction: "translation", answerUnit: "sentence", responseScope: "sentence_only", layout: [],
    items: [
      sentenceItem("l30-p2-a4-q1", "1", "工作结束后，去喝酒吧。", "", "仕事が終わってから、飲みに行こう。"), sentenceItem("l30-p2-a4-q2", "2", "明天（我）想去医院。", "", "明日、病院へ行こうと思っています。"), sentenceItem("l30-p2-a4-q3", "3", "行李很重，所以用送货上门的方式送达。", "", "荷物が重いので、宅配便で送ります。")
    ]
  }
];

export const lesson30Practice: LessonPractice = {
  lessonId: "lesson30",
  title: "第30课",
  sourcePages: [66, 67, 68].map((pageNo) => ({ pageNo, imagePath: page(pageNo) })),
  activities
};
