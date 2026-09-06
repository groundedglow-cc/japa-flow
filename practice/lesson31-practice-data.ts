import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson31/page${pageNo}.webp`;
const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;
const audio = (exerciseNo: 1 | 2, order: number) => `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit8/lesson31/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });
const wordSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "word", width: "medium", placeholder: "输入答案" }];
const sentenceSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder: "输入完整句子" }];
const dialogueSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows: 5, placeholder: "输入完整会话" }];
const dialoguePromptParts = (prompt: string): PromptPart[] => {
  const parts: Record<string, RichText[]> = {
    "いつも電車で行きます／バスで行きます": [
      text("いつも"), text("電車", { kana: "でんしゃ" }), text("で"), text("行", { kana: "い" }), text("きます／バスで"), text("行", { kana: "い" }), text("きます")
    ],
    "毎日部長に報告します／忘れます": [
      text("毎日", { kana: "まいにち" }), text("部長", { kana: "ぶちょう" }), text("に"), text("報告", { kana: "ほうこく" }), text("します／忘れます")
    ],
    "いつも昼ご飯を食べないんです／食べます": [
      text("いつも"), text("昼", { kana: "ひる" }), text("ご"), text("飯", { kana: "はん" }), text("を"), text("食", { kana: "た" }), text("べないんです／"), text("食", { kana: "た" }), text("べます")
    ],
    "毎日ジョギングをします／しません": [
      text("毎日", { kana: "まいにち" }), text("ジョギングをします／しません")
    ]
  };
  return parts[prompt] || [text(prompt)];
};
const sentenceItem = (id: string, number: string, prompt: string, kana: string, answer: string, source: "audio" | "prompt" | "example_transform" = "example_transform"): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana: kana, instruction: "", answerSource: source, evaluationMode: "exact", responseScope: "sentence_only", responseScopeHint: "写出完整句子。", inputSlots: sentenceSlot(), answer: { slotValues: { answer } }
});
const dialogueItem = (id: string, number: string, prompt: string, kana: string, answer: string, source: "audio" | "prompt" = "prompt"): PracticeItem => ({
  id, number, prompt: dialoguePromptParts(prompt), promptKana: kana, instruction: "", answerSource: source, evaluationMode: "exact", responseScope: "dialogue_only", responseScopeHint: "写出完整会话。", inputSlots: dialogueSlot(), answer: { slotValues: { answer } }, renderHint: "dialogue"
});
const wordItem = (id: string, number: string, before: string, beforeKana: string, after: string, afterKana: string, answer: string): PracticeItem => ({
  id, number, prompt: [text(before), blank("answer"), text(after)], promptKana: `${beforeKana}______${afterKana}`, instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer } }
});

const activities: PracticeActivity[] = [
  {
    id: "l31-p1-a1", section: "practice_1", order: 1, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [], itemGroups: [
      { id: "l31-p1-a1-g1", example: { label: "[例1]", before: "このボタンを押します／電源が入ります", beforeKana: "このボタンをおします／でんげんがはいります", after: [text("このボタンを押すと、電源が入ります。", { kana: "このボタンをおすと、でんげんがはいります。" })] }, items: [
        sentenceItem("l31-p1-a1-q1", "1", "ここに立ちます／ドアが開きます", "ここにたちます／ドアがひらきます", "ここに立つと、ドアが開きます。"),
        sentenceItem("l31-p1-a1-q2", "2", "ここにお金を入れます／切符が出ます", "ここにおかねをいれます／きっぷがでます", "ここにお金を入れると、切符が出ます。"),
        sentenceItem("l31-p1-a1-q3", "3", "夜になります／急に気温が下がります", "よるになります／きゅうにきおんがさがります", "夜になると、急に気温が下がります。")
      ] },
      { id: "l31-p1-a1-g2", example: { label: "[例2]", before: "練習しません／上手になりません", beforeKana: "れんしゅうしません／じょうずになりません", after: [text("練習しないと、上手になりません。", { kana: "れんしゅうしないと、じょうずになりません。" })] }, items: [
        sentenceItem("l31-p1-a1-q4", "4", "この橋を渡りません／駅へ行くことができません", "このはしをわたりません／えきへいくことができません", "この橋を渡らないと、駅へ行くことができません。"),
        sentenceItem("l31-p1-a1-q5", "5", "言葉が分かりません／とても不便です", "ことばがわかりません／とてもふべんです", "言葉が分からないと、とても不便です。"),
        sentenceItem("l31-p1-a1-q6", "6", "薬を飲みません／病気が治りません", "くすりをのみません／びょうきがなおります", "薬を飲まないと、病気が治りません。"),
        sentenceItem("l31-p1-a1-q7", "7", "このスイッチを切りません／機械は止まりません", "このスイッチをきりません／きかいはとまりません", "このスイッチを切らないと、機械は止まりません。")
      ] },
      { id: "l31-p1-a1-g3", example: { label: "[例3]", before: "お酒を飲みます／気持ち悪くなります／楽しくなります", beforeKana: "おさけをのみます／きもちわるくなります／たのしくなります", after: [text("甲：わたしはお酒を飲むと、気持ち悪くなります。\n乙：そうですか。わたしは楽しくなります。", { kana: "こう：わたしはおさけをのむと、きもちわるくなります。\nおつ：そうですか。わたしはたのしくなります。" })], afterKana: "こう：わたしはおさけをのむと、きもちわるくなります。\nおつ：そうですか。わたしはたのしくなります。" }, items: [
        dialogueItem("l31-p1-a1-q8", "8", "飯を食べます／すぐ眠くなります／元気になります", "めしをたべます／すぐねむくなります／げんきになります", "甲：わたしは飯を食べると、すぐ眠くなります。\n乙：そうですか。わたしは元気になります。"),
        dialogueItem("l31-p1-a1-q9", "9", "難しい本を読みます／眠くなります／寝ることができなくなります", "むずかしいほんをよみます／ねむくなります／ねることができなくなります", "甲：わたしは難しい本を読むと、眠くなります。\n乙：そうですか。わたしは寝ることができなくなります。"),
        dialogueItem("l31-p1-a1-q10", "10", "家に帰ります／すぐお風呂に入ります／まずテレビのスイッチを入れます", "いえにかえります／すぐおふろにはいります／まずテレビのスイッチをいれます", "甲：わたしは家に帰ると、すぐお風呂に入ります。\n乙：そうですか。わたしはまずテレビのスイッチを入れます。"),
        dialogueItem("l31-p1-a1-q11", "11", "朝起きます／まずコーヒーを飲みます／すぐメールをチェックします", "あさおきます／まずコーヒーをのみます／すぐメールをチェックします", "甲：わたしは朝起きると、まずコーヒーを飲みます。\n乙：そうですか。わたしはすぐメールをチェックします。\n")
      ] }
    ], items: []
  },
  {
    id: "l31-p1-a2", section: "practice_1", order: 2, title: "看图，仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only",
    assets: [{ id: "l31-p1-a2-map", kind: "exercise_image", imagePath: exerciseImage("book1_lesson31_1_2.png"), label: "练习 I 2 路线图" }], displayAssets: ["l31-p1-a2-map"], layout: [{ type: "example", content: { label: "[例]", before: "この道／まっすぐ行きます／交差点", beforeKana: "このみち／まっすぐいきます／こうさてん", after: [text("この道をまっすぐ行くと、交差点があります。", { kana: "このみちをまっすぐいくと、こうさてんがあります。" })] } }], items: [
      sentenceItem("l31-p1-a2-q1", "1", "この道／まっすぐ行きます／右に病院", "このみち／まっすぐいきます／みぎにびょういん", "この道をまっすぐ行くと、右に病院があります。"),
      sentenceItem("l31-p1-a2-q2", "2", "信号のある交差点／右に曲がります／左にスーパー", "しんごうのあるこうさてん／みぎにまがります／ひだりにスーパー", "信号のある交差点を右に曲がると、左にスーパーがあります。"),
      sentenceItem("l31-p1-a2-q3", "3", "橋／渡ります／右に銀行", "はし／わたります／みぎにぎんこう", "橋を渡ると、右に銀行があります。"),
      sentenceItem("l31-p1-a2-q4", "4", "あの横断歩道／渡ります／すぐ前に郵便局", "あのおうだんほどうを／わたります／すぐまえにゆうびんきょく", "あの横断歩道を渡ると、すぐ前に郵便局があります。")
    ]
  },
  {
    id: "l31-p1-a3", section: "practice_1", order: 3, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [{ type: "example", content: { label: "[例]", before: "このパソコンは、たまにフリーズします。", beforeKana: "このパソコンは、たまにフリーズします。", after: [text("このパソコンは、たまにフリーズすることがあります。", { kana: "このパソコンは、たまにフリーズすることがあります。" })] } }], items: [
      sentenceItem("l31-p1-a3-q1", "1", "この車は時々故障します", "このくるまはときどきこしょうします", "この車は、時々故障することがあります。"), sentenceItem("l31-p1-a3-q2", "2", "父はたまに怒ります", "ちちはたまにおこります", "父は、たまに怒ることがあります。"), sentenceItem("l31-p1-a3-q3", "3", "わたしは1年に1、2回風邪を引きます", "わたしはいちねんにいち、にかいかぜをひきます", "わたしは1年に1、2回風邪を引くことがあります。"), sentenceItem("l31-p1-a3-q4", "4", "母は時々財布を忘れます", "はははときどきさいふをわすれます", "母は、時々財布を忘れることがあります。")
    ]
  },
  {
    id: "l31-p1-a4", section: "practice_1", order: 4, title: "听录音，仿照例句替换画线部分进行练习。", instruction: "", interaction: "dialogue_practice", answerUnit: "dialogue", responseScope: "dialogue_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 4), label: "第31课 练习I-4", transcript: { source: "asr", text: "いつも朝ごはんを食べます。食べません。いつも朝ごはんを食べますか。ええ。でも、たまに食べないことがあります。いつも電車で行きます。バスで行きます。いつも電車で行きますか。ええ。でも、たまにバスで行くことがあります。毎日、部長に報告します。忘れます。毎日、部長に報告しますか。ええ。でも、たまに忘れることがあります。いつも昼ごはんを食べないんです。食べます。いつも昼ごはんを食べないんですか。ええ。でも、たまに食べることがあります。毎日ジョギングをします。しません。毎日、ジョギングをしますか。ええ。でも、たまにしないことがあります。", segments: [{ itemNumber: "例", text: "いつも朝ごはんを食べますか。ええ。でも、たまに食べないことがあります。" }, { itemNumber: "1", text: "いつも電車で行きますか。ええ。でも、たまにバスで行くことがあります。" }, { itemNumber: "2", text: "毎日、部長に報告しますか。ええ。でも、たまに忘れることがあります。" }, { itemNumber: "3", text: "いつも昼ごはんを食べないんですか。ええ。でも、たまに食べることがあります。" }, { itemNumber: "4", text: "毎日、ジョギングをしますか。ええ。でも、たまにしないことがあります。" }] } }, layout: [], itemGroups: [{ id: "l31-p1-a4-g1", example: { label: "[例]", before: "いつも朝ご飯を食べます／食べません", beforeKana: "いつもあさごはんをたべます／たべません", after: [text("甲：いつも朝ご飯を食べますか。\n乙：ええ。でも、たまに食べないことがあります。", { kana: "こう：いつもあさごはんをたべますか。\nおつ：ええ。でも、たまにたべないことがあります。" })], afterKana: "こう：いつもあさごはんをたべますか。\nおつ：ええ。でも、たまにたべないことがあります。" }, items: [
      dialogueItem("l31-p1-a4-q1", "1", "いつも電車で行きます／バスで行きます", "いつもでんしゃでいきます／バスでいきます", "甲：いつも電車で行きますか。\n乙：ええ。でも、たまにバスで行くことがあります。", "audio"), dialogueItem("l31-p1-a4-q2", "2", "毎日部長に報告します／忘れます", "まいにちぶちょうにほうこくします／わすれます", "甲：毎日部長に報告しますか。\n乙：ええ。でも、たまに忘れることがあります。", "audio"), dialogueItem("l31-p1-a4-q3", "3", "いつも昼ご飯を食べないんです／食べます", "いつもひるごはんをたべないんです／たべます", "甲：いつも昼ご飯を食べないんですか。\n乙：ええ。でも、たまに食べることがあります。", "audio"), dialogueItem("l31-p1-a4-q4", "4", "毎日ジョギングをします／しません", "まいにちジョギングをします／しません", "甲：毎日ジョギングをしますか。\n乙：ええ。でも、たまにしないことがあります。", "audio")
    ] }], items: []
  },
  {
    id: "l31-p1-a5", section: "practice_1", order: 5, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [], itemGroups: [
      { id: "l31-p1-a5-g1", example: { label: "[例1]", before: "うまい", beforeKana: "うまい", after: [text("馬さんはとてもうまく説明しました。", { kana: "ばさんはとてもうまくせつめいしました。" })] }, items: [sentenceItem("l31-p1-a5-q1", "1", "短い", "みじかい", "馬さんはとても短く説明しました。"), sentenceItem("l31-p1-a5-q2", "2", "美しい", "うつくしい", "馬さんはとても美しく説明しました。"), sentenceItem("l31-p1-a5-q3", "3", "おもしろい", "おもしろい", "馬さんはとてもおもしろく説明しました。")] },
      { id: "l31-p1-a5-g2", example: { label: "[例2]", before: "上手", beforeKana: "じょうず", after: [text("馬さんはとても上手にレポートをまとめました。", { kana: "ばさんはとてもじょうずにレポートをまとめました。" })] }, items: [sentenceItem("l31-p1-a5-q4", "4", "簡単", "かんたん", "馬さんはとても簡単にレポートをまとめました。"), sentenceItem("l31-p1-a5-q5", "5", "きれい", "きれい", "馬さんはとてもきれいにレポートをまとめました。"), sentenceItem("l31-p1-a5-q6", "6", "丁寧", "ていねい", "馬さんはとても丁寧にレポートをまとめました。")] },
      { id: "l31-p1-a5-g3", example: { label: "[例3]", before: "馬さんは来ます", beforeKana: "ばさんはきます", after: [text("馬さんは来るでしょうか。", { kana: "ばさんはくるでしょうか。" })] }, items: [sentenceItem("l31-p1-a5-q7", "7", "これは小野さんの傘です", "これはおのさんのかさです", "これは小野さんの傘でしょうか。"), sentenceItem("l31-p1-a5-q8", "8", "この料理は辛いです", "このりょうりはからいです", "この料理は辛いでしょうか。"), sentenceItem("l31-p1-a5-q9", "9", "森さんは今日遅れません", "もりさんはきょうおくれません", "森さんは今日遅れないでしょうか。"), sentenceItem("l31-p1-a5-q10", "10", "馬さんはもう帰りました", "ばさんはもうかえりました", "馬さんはもう帰ったでしょうか。"), sentenceItem("l31-p1-a5-q11", "11", "陳さんは来ませんでした", "ちんさんはきませんでした", "陳さんは来なかったでしょうか。"), sentenceItem("l31-p1-a5-q12", "12", "李さんはスイカが好きです", "りさんはスイカがすきです", "李さんはスイカが好きでしょうか。")] }
    ], items: []
  },
  {
    id: "l31-p1-a6", section: "practice_1", order: 6, title: "听录音，仿照例句替换画线部分进行练习。", instruction: "", interaction: "dialogue_practice", answerUnit: "dialogue", responseScope: "dialogue_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 6), label: "第31课 练习I-6", transcript: { source: "asr", text: "市役所へ行きたいです。この道をまっすぐ行きます。左にあります。あの、すみません。市役所へ行きたいんですが。この道をまっすぐ行くと、左にありますよ。あ、どうもありがとうございます。いいえ、どういたしまして。音が出ません。これを右に回します。出ます。あの、すみません。音が出ないんですが。これを右に回すと、出ますよ。ああ、どうもありがとうございます。いいえ、どういたしまして。パソコンが動かなくなりました。サービスセンターに電話します。教えてくれます。あの、すみません。パソコンが動かなくなったんですが。サービスセンターに電話すると、教えてくれますよ。ああ、どうもありがとうございます。いいえ、どういたしまして。お手洗いを探しています。あの階段を下ります。左にあります。あの、すみません。お手洗いを探しているんですが。あの階段を下りると、左にありますよ。あ、どうもありがとうございます。いいえ、どういたしまして。", segments: [{ itemNumber: "例", text: "市役所へ行きたいんですが。この道をまっすぐ行くと、左にありますよ。" }, { itemNumber: "1", text: "音が出ないんですが。これを右に回すと、出ますよ。" }, { itemNumber: "2", text: "パソコンが動かなくなったんですが。サービスセンターに電話すると、教えてくれますよ。" }, { itemNumber: "3", text: "お手洗いを探しているんですが。あの階段を下りると、左にありますよ。" }] } }, layout: [], itemGroups: [{ id: "l31-p1-a6-g1", example: { label: "[例]", before: "市役所へ行きたいです／この道をまっすぐ行きます／左にあります", beforeKana: "しやくしょへいきたいです／このみちをまっすぐいきます／ひだりにあります", after: [text("甲：あのう、すみません。市役所へ行きたいんですが……。\n乙：この道をまっすぐ行くと、左にありますよ。\n甲：ああ、どうもありがとうございます。\n乙：いいえ、どういたしまして。", { kana: "こう：あのう、すみません。しやくしょへいきたいんですが……。\nおつ：このみちをまっすぐいくと、ひだりにありますよ。\nこう：ああ、どうもありがとうございます。\nおつ：いいえ、どういたしまして。" })], afterKana: "こう：あのう、すみません。しやくしょへいきたいんですが……。\nおつ：このみちをまっすぐいくと、ひだりにありますよ。\nこう：ああ、どうもありがとうございます。\nおつ：いいえ、どういたしまして。" }, items: [
      dialogueItem("l31-p1-a6-q1", "1", "音が出ません／これを右に回します／出ます", "おとがでません／これをみぎにまわします／でます", "甲：あのう、すみません。音が出ないんですが……。\n乙：これを右に回すと、出ますよ。\n甲：ああ、どうもありがとうございます。\n乙：いいえ、どういたしまして。", "audio"), dialogueItem("l31-p1-a6-q2", "2", "パソコンが動かなくなりました／サービスセンターに電話します／教えてくれます", "パソコンがうごかなくなりました／サービスセンターにでんわします／おしえてくれます", "甲：あのう、すみません。パソコンが動かなくなったんですが……。\n乙：サービスセンターに電話すると、教えてくれますよ。\n甲：ああ、どうもありがとうございます。\n乙：いいえ、どういたしまして。", "audio"), dialogueItem("l31-p1-a6-q3", "3", "お手洗いを探しています／あの階段を下ります／左にあります", "おてあらいをさがしています／あのかいだんをおります／ひだりにあります", "甲：あのう、すみません。お手洗いを探しているんですが……。\n乙：あの階段を下りると、左にありますよ。\n甲：ああ、どうもありがとうございます。\n乙：いいえ、どういたしまして。", "audio")
    ] }], items: []
  },
  {
    id: "l31-p2-a1", section: "practice_2", order: 1, title: "将（　）中的词语变成适当的形式，完成句子。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only", layout: [{ type: "example", content: { label: "[例]", before: "薬を（飲みます → 飲む）と、元気になります。", beforeKana: "くすりを（のみます → のむ）と、げんきになります。", after: [text("")] } }], items: [
      wordItem("l31-p2-a1-q1", "1", "課長は森さんの説明を（静かです → ", "かちょうはもりさんのせつめいを（しずかです → ", "）聞いています。", "）きいています。", "静かに"), wordItem("l31-p2-a1-q2", "2", "ボタンを（押します → ", "ボタンを（おします → ", "）と、電気がつきます。", "）と、でんきがつきます。", "押す"), wordItem("l31-p2-a1-q3", "3", "馬さんはもう（帰りました → ", "ばさんはもう（かえりました → ", "）でしょうか。", "）でしょうか。", "帰った"), wordItem("l31-p2-a1-q4", "4", "春になると、花が（美しいです → ", "はるになると、はなが（うつくしいです → ", "）咲きます。", "）さきます。", "美しく"), wordItem("l31-p2-a1-q5", "5", "たまに雪が（降ります → ", "たまにゆきが（ふります → ", "）ことがあります。", "）ことがあります。", "降る"), wordItem("l31-p2-a1-q6", "6", "子供は（元気です → ", "こどもは（げんきです → ", "）遊んでいます。", "）あそんでいます。", "元気に"), wordItem("l31-p2-a1-q7", "7", "仕事が（ありません → ", "しごとが（ありません → ", "）と、困ります。", "）と、こまります。", "ない")
    ]
  },
  {
    id: "l31-p2-a2", section: "practice_2", order: 2, title: "看图，将与句子内容一致的序号填入（　）中。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only", assets: [{ id: "l31-p2-a2-map", kind: "exercise_image", imagePath: exerciseImage("book1_lesson31_2_2.png"), label: "练习 II 2 地图" }], displayAssets: ["l31-p2-a2-map"], layout: [{ type: "example", content: { label: "[例]", before: "郵便局はどこですか。——駅からまっすぐ行くと、交差点があります。そこを右に曲がって少し行くと、左にあります。郵便局は（②）です。", beforeKana: "ゆうびんきょくはどこですか。——えきからまっすぐいくと、こうさてんがあります。そこをみぎにまがってすこしいくと、ひだりにあります。ゆうびんきょくは（に）です。", after: [text("")] } }], items: [
      { id: "l31-p2-a2-q1", number: "1", prompt: [text("デパートはどこですか。——駅からまっすぐ行くと、交差点があります。交差点を渡ると、左の角にあります。デパートは（"), blank("answer"), text("）です。")], promptKana: "デパートはどこですか。——えきからまっすぐいくと、こうさてんがあります。こうさてんをわたると、ひだりのかどにあります。デパートは（______）です。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写地图中的序号。", inputSlots: wordSlot(), answer: { slotValues: { answer: "⑦" } } },
      { id: "l31-p2-a2-q2", number: "2", prompt: [text("市役所はどこですか。——駅からまっすぐ行くと、交差点があります。そこを渡って少し行くと、前に大きい公園があります。市役所は公園の隣にあります。市役所は（"), blank("answer"), text("）です。")], promptKana: "しやくしょはどこですか。——えきからまっすぐいくと、こうさてんがあります。そこをわたってすこしいくと、まえにおおきいこうえんがあります。しやくしょはこうえんのとなりにあります。しやくしょは（______）です。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写地图中的序号。", inputSlots: wordSlot(), answer: { slotValues: { answer: "⑥" } } }
    ]
  },
  {
    id: "l31-p2-a3", section: "practice_2", order: 3, title: "看第2题图，在（　）中填入适当的词语，说明如何去图书馆。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only", layout: [], items: [{ id: "l31-p2-a3-q1", number: "1", prompt: [text("駅から（"), blank("a"), text("）行くと、（"), blank("b"), text("）があります。そこを（"), blank("c"), text("）に曲がって少し行くと、橋があります。橋を（"), blank("d"), text("）と、（"), blank("e"), text("）に図書館があります。")], promptKana: "えきから（______）いくと、（______）があります。そこを（______）にまがってすこしいくと、はしがあります。はしを（______）と、（______）にとしょかんがあります。", instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "按顺序填写五个词语。", inputSlots: ["a", "b", "c", "d", "e"].map((id) => ({ id, expectedUnit: "word" as const, width: "short" as const, placeholder: "答案" })), answer: { slotValues: { a: "まっすぐ", b: "交差点", c: "左", d: "渡る", e: "右" } } }]
  },
  { id: "l31-p2-a4", section: "practice_2", order: 4, title: "将下面的句子译成日语。", instruction: "", interaction: "translation", answerUnit: "sentence", responseScope: "sentence_only", layout: [], items: [sentenceItem("l31-p2-a4-q1", "1", "按下这个钮，电源就接通了。", "", "このボタンを押すと、電源が入ります。", "prompt"), sentenceItem("l31-p2-a4-q2", "2", "（你）每天都正经吃早饭吗？——是的。不过偶尔也有不吃的时候。", "", "毎朝、朝ご飯を食べますか。——ええ。でも、たまに食べないことがあります。", "prompt"), sentenceItem("l31-p2-a4-q3", "3", "请问，小马在哪里？", "", "すみません。馬さんはどこですか。", "prompt")] }
];

export const lesson31Practice: LessonPractice = { lessonId: "lesson31", title: "第31课 このボタンを押すと、電源が入ります", sourcePages: [{ pageNo: 76, imagePath: page(76), label: "练习 I" }, { pageNo: 77, imagePath: page(77), label: "练习 I" }, { pageNo: 78, imagePath: page(78), label: "练习 II" }], activities };
