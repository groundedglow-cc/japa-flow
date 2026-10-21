import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson38/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) => `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit10/lesson38/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const substitution = (value: string, kana: string, key: string): RichText => text(value, { kana, underline: true, substitutionKey: key });
const blank = (slotId = "answer"): PromptPart => ({ type: "blank", slotId });
const sentenceSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder: "输入完整句子" }];
const wordSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "word", width: "medium", placeholder: "输入答案" }];
const dialogueSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows: 4, placeholder: "输入完整会话" }];

const sentenceItem = (id: string, number: string, prompt: string, promptKana: string, answer: string, answerSource: PracticeItem["answerSource"] = "example_transform"): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource, evaluationMode: "exact", responseScope: "sentence_only", responseScopeHint: "写出完整句子。", inputSlots: sentenceSlot(), answer: { slotValues: { answer } }
});
const wordItem = (id: string, number: string, prompt: PromptPart[], promptKana: string, answer: string, answerSource: PracticeItem["answerSource"] = "prompt"): PracticeItem => ({
  id, number, prompt, promptKana, instruction: "", answerSource, evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer } }
});
const dialogueItem = (id: string, number: string, prompt: string, promptKana: string, answer: string): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource: "audio", evaluationMode: "exact", responseScope: "dialogue_only", responseScopeHint: "写出完整会话。", inputSlots: dialogueSlot(), answer: { slotValues: { answer } }, renderHint: "dialogue"
});
const booleanItem = (id: string, number: string, prompt: string, promptKana: string, value: boolean): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource: "prompt", evaluationMode: "exact", responseScope: "boolean_only", responseScopeHint: "判断内容是否与书信一致。", choices: [{ id: `${id}-true`, label: "○" }, { id: `${id}-false`, label: "×" }], answer: { boolean: value }
});

const activities: PracticeActivity[] = [
  {
    id: "l38-p1-a1", section: "practice_1", order: 1, title: "仿照例句，将（　）中的动词变成可能形式。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only",
    itemGroups: [
      { id: "l38-p1-a1-g1", example: { label: "[例 1]", before: "英語が（話します → 話せます）。", beforeKana: "えいごが（はなします → はなせます）。", after: [] }, items: [
        wordItem("l38-p1-a1-q1", "1", [text("日本の新聞が（読みます → ", { kana: "にほんのしんぶんが（よみます → " }), blank(), text("）。")], "にほんのしんぶんが（よみます → ____）。", "読めます"),
        wordItem("l38-p1-a1-q2", "2", [text("500メートル（泳ぎます → ", { kana: "ごひゃくメートル（およぎます → " }), blank(), text("）。")], "ごひゃくメートル（およぎます → ____）。", "泳げます"),
        wordItem("l38-p1-a1-q3", "3", [text("歩いて（行きます → ", { kana: "あるいて（いきます → " }), blank(), text("）。")], "あるいて（いきます → ____）。", "行けます"),
        wordItem("l38-p1-a1-q4", "4", [text("写真が（撮ります → ", { kana: "しゃしんが（とります → " }), blank(), text("）。")], "しゃしんが（とります → ____）。", "撮れます"),
        wordItem("l38-p1-a1-q5", "5", [text("1人で着物が（着ます → ", { kana: "ひとりできものが（きます → " }), blank(), text("）。")], "ひとりできものが（きます → ____）。", "着られます"),
        wordItem("l38-p1-a1-q6", "6", [text("餃子が上手に（作ります → ", { kana: "ギョーザがじょうずに（つくります → " }), blank(), text("）。")], "ギョーザがじょうずに（つくります → ____）。", "作れます"),
        wordItem("l38-p1-a1-q7", "7", [text("衛星放送が（見ます → ", { kana: "えいせいほうそうが（みます → " }), blank(), text("）。")], "えいせいほうそうが（みます → ____）。", "見られます"),
        wordItem("l38-p1-a1-q8", "8", [text("車が（借ります → ", { kana: "くるまが（かります → " }), blank(), text("）。")], "くるまが（かります → ____）。", "借りられます"),
        wordItem("l38-p1-a1-q9", "9", [text("電話で（予約します → ", { kana: "でんわで（よやくします → " }), blank(), text("）。")], "でんわで（よやくします → ____）。", "予約できます"),
        wordItem("l38-p1-a1-q10", "10", [text("1人で（来ます → ", { kana: "ひとりで（きます → " }), blank(), text("）。")], "ひとりで（きます → ____）。", "来られます")
      ] },
      { id: "l38-p1-a1-g2", example: { label: "[例 2]", before: "辞書は（貸しません → 貸せません）。", beforeKana: "じしょは（かしません → かせません）。", after: [] }, items: [
        wordItem("l38-p1-a1-q11", "11", [text("お酒は（飲みません → ", { kana: "おさけは（のみません → " }), blank(), text("）。")], "おさけは（のみません → ____）。", "飲めません"),
        wordItem("l38-p1-a1-q12", "12", [text("畳に（座りません → ", { kana: "たたみに（すわりません → " }), blank(), text("）。")], "たたみに（すわりません → ____）。", "座れません"),
        wordItem("l38-p1-a1-q13", "13", [text("今、部屋に（入りません → ", { kana: "いま、へやに（はいりません → " }), blank(), text("）。")], "いま、へやに（はいりません → ____）。", "入れません"),
        wordItem("l38-p1-a1-q14", "14", [text("3時間しか（いません → ", { kana: "さんじかんしか（いません → " }), blank(), text("）。")], "さんじかんしか（いません → ____）。", "いられません"),
        wordItem("l38-p1-a1-q15", "15", [text("古くて、（使いません → ", { kana: "ふるくて、（つかいません → " }), blank(), text("）。")], "ふるくて、（つかいません → ____）。", "使えません"),
        wordItem("l38-p1-a1-q16", "16", [text("大きくて、（運びません → ", { kana: "おおきくて、（はこびません → " }), blank(), text("）。")], "おおきくて、（はこびません → ____）。", "運べません"),
        wordItem("l38-p1-a1-q17", "17", [text("課長は（来ません → ", { kana: "かちょうは（きません → " }), blank(), text("）。")], "かちょうは（きません → ____）。", "来られません"),
        wordItem("l38-p1-a1-q18", "18", [text("オリンピックに（出ません → ", { kana: "オリンピックに（でません → " }), blank(), text("）。")], "オリンピックに（でません → ____）。", "出られません"),
        wordItem("l38-p1-a1-q19", "19", [text("ここには車を（止めません → ", { kana: "ここにはくるまを（とめません → " }), blank(), text("）。")], "ここにはくるまを（とめません → ____）。", "止められません"),
        wordItem("l38-p1-a1-q20", "20", [text("こんなにたくさん（覚えません → ", { kana: "こんなにたくさん（おぼえません → " }), blank(), text("）。")], "こんなにたくさん（おぼえません → ____）。", "覚えられません")
      ] },
    ]
  },
  {
    id: "l38-p1-a2", section: "practice_1", order: 2, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only",
    itemGroups: [
      { id: "l38-p1-a2-g1", example: { label: "[例 1]", before: "この図書館は多くの人が利用できます／夜9時まで開いています", beforeKana: "このとしょかんはおおくのひとがりようできます／よるくじまであいています", after: [text("この図書館は"), substitution("多くの人が利用できるように", "おおくのひとがりようできるように", "利用"), text("、夜9時まで開いています。", { kana: "、よるくじまであいています。" })] }, items: [
        sentenceItem("l38-p1-a2-q1", "1", "最終の新幹線に間に合います／急いで出かけましょう", "さいしゅうのしんかんせんにまにあいます／いそいででかけましょう", "最終の新幹線に間に合うように、急いで出かけましょう。"),
        sentenceItem("l38-p1-a2-q2", "2", "お年寄りも使えます／操作が簡単になっています", "おとしよりもつかえます／そうさがかんたんになっています", "お年寄りも使えるように、操作が簡単になっています。"),
        sentenceItem("l38-p1-a2-q3", "3", "みんなに聞こえます／大きな声で話してください", "みんなにきこえます／おおきなこえではなしてください", "みんなに聞こえるように、大きな声で話してください。"),
        {
          ...sentenceItem("l38-p1-a2-q6", "6", "日本に留学できます／一生懸命勉強しています", "にほんにりゅうがくできます／いっしょうけんめいべんきょうしています", "日本に留学できるように、一生懸命勉強しています。"),
          prompt: [text("日本", { kana: "にほん" }), text("に"), text("留学", { kana: "りゅうがく" }), text("できます／"), text("一生懸命", { kana: "いっしょうけんめい" }), text("勉強", { kana: "べんきょう" }), text("しています")]
        }
      ] },
      { id: "l38-p1-a2-g2", example: { label: "[例 2]", before: "忘れません／メモしておきましょう", beforeKana: "わすれません／メモしておきましょう", after: [substitution("忘れないように", "わすれないように", "忘れ"), text("、メモしておきましょう。", { kana: "、メモしておきましょう。" })] }, items: [
        sentenceItem("l38-p1-a2-q4", "4", "風邪を引きません／気をつけてください", "かぜをひきません／きをつけてください", "風邪を引かないように、気をつけてください。"),
        sentenceItem("l38-p1-a2-q5", "5", "転びません／ゆっくり歩きましょう", "ころびません／ゆっくりあるきましょう", "転ばないように、ゆっくり歩きましょう。")
      ] },
    ]
  },
  {
    id: "l38-p1-a3", section: "practice_1", order: 3, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "dialogue_practice", answerUnit: "dialogue", responseScope: "dialogue_only",
    layout: [{ type: "example", content: { label: "[例]", before: "足の具合はいかがですか／昨日から少し歩きます", beforeKana: "あしのぐあいはいかがですか／きのうからすこしあるきます", after: [text("甲："), substitution("足の具合はいかがですか。", "あしのぐあいはいかがですか。", "質問"), text("\n乙：やっと、"), substitution("昨日から少し歩けるようになりました。", "きのうからすこしあるけるようになりました。", "回答"), text("\n甲：それはよかったですね。", { kana: "\nこう：それはよかったですね。" })] } }],
    items: [
      dialogueItem("l38-p1-a3-q1", "1", "ピアノの練習はどうですか／1曲弾きます", "ピアノのれんしゅうはどうですか／いっきょくひきます", "甲：ピアノの練習はどうですか。\n乙：やっと、1曲弾けるようになりました。\n甲：それはよかったですね。"),
      dialogueItem("l38-p1-a3-q2", "2", "日本語の勉強はどうですか／日本語でレポートを書きます", "にほんごのべんきょうはどうですか／にほんごでレポートをかきます", "甲：日本語の勉強はどうですか。\n乙：やっと、日本語でレポートを書けるようになりました。\n甲：それはよかったですね。"),
      dialogueItem("l38-p1-a3-q3", "3", "日本食には慣れましたか／刺し身も食べます", "にほんしょくにはなれましたか／さしみもたべます", "甲：日本食には慣れましたか。\n乙：やっと、刺し身も食べられるようになりました。\n甲：それはよかったですね。"),
      dialogueItem("l38-p1-a3-q4", "4", "機械の操作は慣れましたか／1人で動かします", "きかいのそうさはなれましたか／ひとりでうごかします", "甲：機械の操作は慣れましたか。\n乙：やっと、1人で動かせるようになりました。\n甲：それはよかったですね。")
    ]
  },
  {
    id: "l38-p1-a4", section: "practice_1", order: 4, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only",
    itemGroups: [
      { id: "l38-p1-a4-g1", example: { label: "[例 1]", before: "研修に全員参加します", beforeKana: "けんしゅうにぜんいんさんかします", after: [text("研修に"), substitution("全員参加するように", "ぜんいんさんかするように", "参加"), text("してください。", { kana: "してください。" })] }, items: [
        sentenceItem("l38-p1-a4-q1", "1", "毎日メールをチェックします", "まいにちメールをチェックします", "毎日メールをチェックするようにしてください。"),
        sentenceItem("l38-p1-a4-q2", "2", "必ずかぎをかけます", "かならずかぎをかけます", "必ずかぎをかけるようにしてください。")
      ] },
      { id: "l38-p1-a4-g2", example: { label: "[例 2]", before: "電話番号を間違えません", beforeKana: "でんわばんごうをまちがえません", after: [text("電話番号を"), substitution("間違えないように", "まちがえないように", "間違え"), text("してください。", { kana: "してください。" })] }, items: [
        sentenceItem("l38-p1-a4-q3", "3", "約束の時間を忘れません", "やくそくのじかんをわすれません", "約束の時間を忘れないようにしてください。"),
        sentenceItem("l38-p1-a4-q4", "4", "このごみ箱にペットボトルを捨てません", "このごみばこにペットボトルをすてません", "このごみ箱にペットボトルを捨てないようにしてください。")
      ] },
    ]
  },
  {
    id: "l38-p1-a5", section: "practice_1", order: 5, title: "听录音，仿照例句替换画线部分回答提问。", instruction: "", interaction: "listening_answer", answerUnit: "sentence", responseScope: "answer_only", responseScopeHint: "只写回答句。", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 5), label: "第38课 练习I-5", transcript: { source: "asr", confidenceNote: "ASR 分段覆盖例句和1—5题；第6题按教材提示与相同录音模式补全。", text: "健康のために何をしていますか。1週間に2回プールで泳ぎます。1週間に2回プールで泳ぐようにしています。寝る前に食べません。寝る前に食べないようにしています。1 毎日30分歩きます。2 十分睡眠を取ります。3 お酒をたくさん飲みません。4 できるだけ運動します。5 ストレスをためません。6 野菜をたくさん食べます。", segments: [
      { itemNumber: "1", text: "毎日30分歩くようにしています。" }, { itemNumber: "2", text: "十分睡眠を取るようにしています。" }, { itemNumber: "3", text: "お酒をたくさん飲まないようにしています。" }, { itemNumber: "4", text: "できるだけ運動するようにしています。" }, { itemNumber: "5", text: "ストレスをためないようにしています。" }, { itemNumber: "6", text: "野菜をたくさん食べるようにしています。" }
    ] } },
    layout: [{ type: "example", content: { label: "[例]", before: "健康のために、何をしていますか。", beforeKana: "けんこうのために、なにをしていますか。", after: [text("（1週間に2回プールで泳ぎます） → ", { kana: "（いっしゅうかんににかいプールでおよぎます） → " }), substitution("1週間に2回プールで泳ぐようにしています。", "いっしゅうかんににかいプールでおよぐようにしています。", "習慣1"), text("\n（寝る前に食べません） → ", { kana: "\n（ねるまえにたべません） → " }), substitution("寝る前に食べないようにしています。", "ねるまえにたべないようにしています。", "習慣2")] } }],
    items: [
      sentenceItem("l38-p1-a5-q1", "1", "毎日30分歩きます", "まいにちさんじゅっぷんあるきます", "毎日30分歩くようにしています。", "audio"),
      sentenceItem("l38-p1-a5-q2", "2", "十分睡眠をとります", "じゅうぶんすいみんをとります", "十分睡眠をとるようにしています。", "audio"),
      sentenceItem("l38-p1-a5-q3", "3", "お酒をたくさん飲みません", "おさけをたくさんのみません", "お酒をたくさん飲まないようにしています。", "audio"),
      sentenceItem("l38-p1-a5-q4", "4", "できるだけ運動します", "できるだけうんどうします", "できるだけ運動するようにしています。", "audio"),
      sentenceItem("l38-p1-a5-q5", "5", "ストレスをためません", "ストレスをためません", "ストレスをためないようにしています。", "audio"),
      sentenceItem("l38-p1-a5-q6", "6", "野菜をたくさん食べます", "やさいをたくさんたべます", "野菜をたくさん食べるようにしています。", "audio")
    ].map(item => ({ ...item, responseScope: "answer_only" as const, responseScopeHint: "只写回答句。" }))
  },
  {
    id: "l38-p1-a6", section: "practice_1", order: 6, title: "听录音，仿照例句替换画线部分练习会话。", instruction: "", interaction: "dialogue_practice", answerUnit: "dialogue", responseScope: "dialogue_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 6), label: "第38课 练习I-6", transcript: { source: "asr", confidenceNote: "ASR 覆盖例句和全部3题；将误识别的「離せる」按教材与语境校正为「話せる」。", text: "英語がうまく話せないんですが。毎日テープを聞きます、話します。毎日テープを聞けば、話せるようになると思いますよ。1 この自転車はまだ乗れますか。タイヤを取り替えます、乗ります。2 なかなか試合で勝てないんですが。もっと練習します、勝ちます。3 この商品は売れるでしょうか。もう少し安くします、売ります。", segments: [
      { itemNumber: "1", text: "この自転車はまだ乗れますか。タイヤを取り替えれば、乗れるようになると思いますよ。じゃあ、やってみます。" },
      { itemNumber: "2", text: "なかなか試合で勝てないんですが。もっと練習すれば、勝てるようになると思いますよ。じゃあ、やってみます。" },
      { itemNumber: "3", text: "この商品は売れるでしょうか。もう少し安くすれば、売れるようになると思いますよ。じゃあ、やってみます。" }
    ] } },
    layout: [{ type: "example", content: { label: "[例]", before: "英語がうまく話せないんですが…。／毎日テープを聞きます／話します", beforeKana: "えいごがうまくはなせないんですが…。／まいにちテープをききます／はなします", after: [text("甲：英語がうまく話せないんですが…。\n乙："), substitution("毎日テープを聞けば", "まいにちテープをきけば", "条件"), text("、"), substitution("話せるようになる", "はなせるようになる", "結果"), text("と思いますよ。\n甲：じゃあ、やってみます。", { kana: "とおもいますよ。\nこう：じゃあ、やってみます。" })] } }],
    items: [
      dialogueItem("l38-p1-a6-q1", "1", "この自転車はまだ乗れますか。／タイヤを取り替えます／乗ります", "このじてんしゃはまだのれますか。／タイヤをとりかえます／のります", "甲：この自転車はまだ乗れますか。\n乙：タイヤを取り替えれば、乗れるようになると思いますよ。\n甲：じゃあ、やってみます。"),
      dialogueItem("l38-p1-a6-q2", "2", "なかなか試合で勝てないんですが…。／もっと練習します／勝ちます", "なかなかしあいでかてないんですが…。／もっとれんしゅうします／かちます", "甲：なかなか試合で勝てないんですが…。\n乙：もっと練習すれば、勝てるようになると思いますよ。\n甲：じゃあ、やってみます。"),
      dialogueItem("l38-p1-a6-q3", "3", "この商品は売れるでしょうか。／もう少し安くします／売ります", "このしょうひんはうれるでしょうか。／もうすこしやすくします／うります", "甲：この商品は売れるでしょうか。\n乙：もう少し安くすれば、売れるようになると思いますよ。\n甲：じゃあ、やってみます。")
    ]
  },
  {
    id: "l38-p2-a1", section: "practice_2", order: 1, title: "将（　）中的词语变成适当的可能形式，完成句子。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only",
    layout: [{ type: "example", content: { label: "[例]", before: "キムさんは1キロメートルぐらい（泳ぎます → 泳げます）。", beforeKana: "キムさんはいちキロメートルぐらい（およぎます → およげます）。", after: [] } }],
    items: [
      wordItem("l38-p2-a1-q1", "1", [text("この本は来週の木曜日まで（借ります → ", { kana: "このほんはらいしゅうのもくようびまで（かります → " }), blank(), text("）。")], "このほんはらいしゅうのもくようびまで（かります → ____）。", "借りられます"),
      wordItem("l38-p2-a1-q2", "2", [text("社員の名前がなかなか（覚えます → ", { kana: "しゃいんのなまえがなかなか（おぼえます → " }), blank(), text("）。")], "しゃいんのなまえがなかなか（おぼえます → ____）。", "覚えられません"),
      wordItem("l38-p2-a1-q3", "3", [text("冬でもスイカが（食べます → ", { kana: "ふゆでもスイカが（たべます → " }), blank(), text("）ようになりました。")], "ふゆでもスイカが（たべます → ____）ようになりました。", "食べられる"),
      wordItem("l38-p2-a1-q4", "4", [text("今仕事がとても忙しいので、日曜日でも（休みます → ", { kana: "いましごとがとてもいそがしいので、にちようびでも（やすみます → " }), blank(), text("）。")], "いましごとがとてもいそがしいので、にちようびでも（やすみます → ____）。", "休めません"),
      wordItem("l38-p2-a1-q5", "5", [text("駅前の本屋で日本語のテープが（買います → ", { kana: "えきまえのほんやでにほんごのテープが（かいます → " }), blank(), text("）でしょう。")], "えきまえのほんやでにほんごのテープが（かいます → ____）でしょう。", "買える"),
      wordItem("l38-p2-a1-q6", "6", [text("ニュースによると、飛行機は雪で（飛びます → ", { kana: "ニュースによると、ひこうきはゆきで（とびます → " }), blank(), text("）そうです。")], "ニュースによると、ひこうきはゆきで（とびます → ____）そうです。", "飛べない")
    ]
  },
  {
    id: "l38-p2-a2", section: "practice_2", order: 2, title: "听录音，回答提问。", instruction: "", interaction: "listening_answer", answerUnit: "sentence", responseScope: "answer_only", responseScopeHint: "只写回答句。", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(2, 2), label: "第38课 练习II-2", transcript: { source: "asr", confidenceNote: "ASR 覆盖全部题号和回答；第2题将误识别的「21月」按语境校正为「冬でも」。", text: "もう出かけられますか。はい、出かけられます。1 英語が話せますか。いいえ。2 冬でも山に登れますか。はい。3 明日、来られますか。はい。4 このホテルは衛星放送が見られますか。いいえ。", segments: [
      { itemNumber: "1", text: "いいえ、話せません。" }, { itemNumber: "2", text: "はい、登れます。" }, { itemNumber: "3", text: "はい、来られます。" }, { itemNumber: "4", text: "いいえ、見られません。" }
    ] } },
    layout: [{ type: "example", content: { label: "[例]", before: "もう出かけられますか。（はい）", beforeKana: "もうでかけられますか。（はい）", after: [text("はい、出かけられます。", { kana: "はい、でかけられます。" })] } }],
    items: [
      sentenceItem("l38-p2-a2-q1", "1", "英語が話せますか。（いいえ）", "えいごがはなせますか。（いいえ）", "いいえ、話せません。", "audio"),
      sentenceItem("l38-p2-a2-q2", "2", "冬でも山に登れますか。（はい）", "ふゆでもやまにのぼれますか。（はい）", "はい、登れます。", "audio"),
      sentenceItem("l38-p2-a2-q3", "3", "明日、来られますか。（はい）", "あした、こられますか。（はい）", "はい、来られます。", "audio"),
      sentenceItem("l38-p2-a2-q4", "4", "このホテルは衛星放送が見られますか。（いいえ）", "このホテルはえいせいほうそうがみられますか。（いいえ）", "いいえ、見られません。", "audio")
    ].map(item => ({ ...item, responseScope: "answer_only" as const, responseScopeHint: "只写回答句。" }))
  },
  {
    id: "l38-p2-a3", section: "practice_2", order: 3, title: "读下面的书信，与书信内容一致的在（　）中画○，不一致的画×。", instruction: "", interaction: "true_false", answerUnit: "boolean", responseScope: "boolean_only",
    layout: [{ type: "passage", title: "", lines: [
      text("田中さん、お元気ですか。", { kana: "たなかさん、おげんきですか。" }),
      text("東京に来て1か月です。仕事にもずいぶん慣れて、会社の人と日本語で話せるようになりました。でも、一人暮らしは少し寂しいです。", { kana: "とうきょうにきていっかげつです。しごとにもずいぶんなれて、かいしゃのひととにほんごではなせるようになりました。でも、ひとりぐらしはすこしさびしいです。" }),
      text("先週風邪を引いてしまいました。高い熱があって、何も食べられませんでした。早く治るように、病院に行って薬をもらいましたが、3日間会社を休んでしまいました。", { kana: "せんしゅうかぜをひいてしまいました。たかいねつがあって、なにもたべられませんでした。はやくなおるように、びょういんにいってくすりをもらいましたが、みっかかんかいしゃをやすんでしまいました。" }),
      text("これからは健康にも十分気をつけるようにしたいと思います。田中さんもお体を大切にしてください。", { kana: "これからはけんこうにもじゅうぶんきをつけるようにしたいとおもいます。たなかさんもおからだをたいせつにしてください。" }),
      text("また手紙を書きます。劉英", { kana: "またてがみをかきます。りゅうえい" })
    ] }, { type: "example", content: { label: "[例]", before: "劉さんは田中さんに手紙を書きました。", beforeKana: "りゅうさんはたなかさんにてがみをかきました。", after: [text("○")] } }],
    items: [
      booleanItem("l38-p2-a3-q1", "1", "劉さんは中国にいます。", "りゅうさんはちゅうごくにいます。", false),
      booleanItem("l38-p2-a3-q2", "2", "病院に行ったので、風邪はすぐ治りました。", "びょういんにいったので、かぜはすぐなおりました。", false),
      booleanItem("l38-p2-a3-q3", "3", "劉さんは会社の人と日本語で話します。", "りゅうさんはかいしゃのひととにほんごではなします。", true),
      booleanItem("l38-p2-a3-q4", "4", "これから劉さんは健康に気をつけようと思っています。", "これからりゅうさんはけんこうにきをつけようとおもっています。", true)
    ]
  },
  {
    id: "l38-p2-a4", section: "practice_2", order: 4, title: "将下面的句子译成日语。", instruction: "", interaction: "translation", answerUnit: "sentence", responseScope: "sentence_only",
    layout: [], items: [
      sentenceItem("l38-p2-a4-q1", "1", "小戴会说英语。", "", "戴さんは英語が話せます。", "prompt"),
      sentenceItem("l38-p2-a4-q2", "2", "伤已经痊愈，能够走路了。", "", "けがはもう治って、歩けるようになりました。", "prompt"),
      sentenceItem("l38-p2-a4-q3", "3", "为了保持身体健康，（你平时）做点什么吗？——是的，（我）每天早晨坚持散步1个小时。", "", "健康のために、何かしていますか。——はい、毎朝1時間散歩するようにしています。", "prompt")
    ]
  }
];

export const lesson38Practice: LessonPractice = {
  lessonId: "lesson38",
  title: "第38课 戴さんは英語が話せます",
  sourcePages: [{ pageNo: 158, imagePath: page(158) }, { pageNo: 159, imagePath: page(159) }, { pageNo: 160, imagePath: page(160) }],
  activities
};
