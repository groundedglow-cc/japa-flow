import type { Choice, InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson34/page${pageNo}.webp`;
const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;
const audio = (exerciseNo: 1 | 2, order: number) => `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit9/lesson34/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });
const wordSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "word", width: "medium", placeholder: "输入答案" }];
const sentenceSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder: "输入完整句子" }];
const dialogueSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows: 5, placeholder: "输入完整会话" }];
const wordItem = (id: string, number: string, prompt: PromptPart[], promptKana: string, answer: string, source: PracticeItem["answerSource"] = "example_transform"): PracticeItem => ({ id, number, prompt, promptKana, instruction: "", answerSource: source, evaluationMode: "exact", responseScope: "word_only", responseScopeHint: "填写括号中的词语。", inputSlots: wordSlot(), answer: { slotValues: { answer } } });
const sentenceItem = (id: string, number: string, prompt: string, promptKana: string, answer: string, source: PracticeItem["answerSource"] = "example_transform"): PracticeItem => ({ id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource: source, evaluationMode: "exact", responseScope: "sentence_only", responseScopeHint: "写出完整句子。", inputSlots: sentenceSlot(), answer: { slotValues: { answer } } });
const answerOnlyItem = (id: string, number: string, prompt: string, promptKana: string, answer: string): PracticeItem => ({ ...sentenceItem(id, number, prompt, promptKana, answer), responseScope: "answer_only", responseScopeHint: "只写回答句。" });
const dialogueItem = (id: string, number: string, prompt: string, promptKana: string, answer: string): PracticeItem => ({ id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource: "audio", evaluationMode: "exact", responseScope: "dialogue_only", responseScopeHint: "写出完整会话。", inputSlots: dialogueSlot(), answer: { slotValues: { answer } }, renderHint: "dialogue" });
const choiceItem = (id: string, number: string, prompt: string, promptKana: string, choices: Choice[], answerChoiceId: string, source: PracticeItem["answerSource"] = "prompt"): PracticeItem => ({ id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource: source, evaluationMode: "exact", responseScope: "choice_only", choices, answer: { choiceIds: [answerChoiceId] }, renderHint: "inline" });

const boolChoices: Choice[] = [{ id: "true", label: "○" }, { id: "false", label: "×" }];
const boolItem = (id: string, number: string, value: boolean): PracticeItem => ({ ...choiceItem(id, number, "听录音，判断第 " + number + " 句。", "", boolChoices, value ? "true" : "false", "audio"), responseScope: "boolean_only", responseScopeHint: "听录音，选择 ○ 或 ×。" });

const activities: PracticeActivity[] = [
  {
    id: "l34-p1-a1", section: "practice_1", order: 1, title: "看图，仿照例句进行练习。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only",
    assets: [{ id: "l34-p1-a1-picture", kind: "exercise_image", imagePath: exerciseImage("book1_lesson34_1_1.png"), label: "练习 I 1 图片" }], displayAssets: ["l34-p1-a1-picture"],
    layout: [{ type: "example", content: { label: "[例]", before: "閉めます", beforeKana: "しめます", after: [text("閉めてあります。", { kana: "しめてあります。" })] } }],
    items: [
      wordItem("l34-p1-a1-q1", "1", [text("書きます → ", { kana: "かきます → " }), blank("answer")], "かきます →", "書いてあります"),
      wordItem("l34-p1-a1-q2", "2", [text("開けます → ", { kana: "あけます → " }), blank("answer")], "あけます →", "開けてあります"),
      wordItem("l34-p1-a1-q3", "3", [text("はります → "), blank("answer")], "はります →", "はってあります"),
      wordItem("l34-p1-a1-q4", "4", [text("飾ります → ", { kana: "かざります → " }), blank("answer")], "かざります →", "飾ってあります")
    ]
  },
  {
    id: "l34-p1-a2", section: "practice_1", order: 2, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only",
    layout: [{ type: "example", content: { label: "[例]", before: "壁にカレンダーを掛けました。", beforeKana: "かべにカレンダーをかけました。", after: [text("壁にカレンダーが掛けてあります。", { kana: "かべにカレンダーがかけてあります。" })] } }],
    items: [
      sentenceItem("l34-p1-a2-q1", "1", "冷蔵庫にビールを入れました。", "れいぞうこにビールをいれました。", "冷蔵庫にビールが入れてあります。"),
      sentenceItem("l34-p1-a2-q2", "2", "玄関に花を飾りました。", "げんかんにはなをかざりました。", "玄関に花が飾ってあります。"),
      sentenceItem("l34-p1-a2-q3", "3", "あそこに車を止めました。", "あそこにくるまをとめました。", "あそこに車が止めてあります。"),
      sentenceItem("l34-p1-a2-q4", "4", "会議室のいすを片づけました。", "かいぎしつのいすをかたづけました。", "会議室のいすが片づけてあります。"),
      sentenceItem("l34-p1-a2-q5", "5", "部屋の電気をつけました。", "へやのでんきをつけました。", "部屋の電気がつけてあります。"),
      sentenceItem("l34-p1-a2-q6", "6", "本棚に本をきちんと並べました。", "ほんだなにほんをきちんとならべました。", "本棚に本がきちんと並べてあります。")
    ]
  },
  {
    id: "l34-p1-a3", section: "practice_1", order: 3, title: "仿照例句，用（　）中的词语回答提问。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "answer_only",
    layout: [{ type: "example", content: { label: "[例]", before: "どこに車を止めましたか。（公園の横）", beforeKana: "どこにくるまをとめましたか。（こうえんのよこ）", after: [text("公園の横に止めてあります。", { kana: "こうえんのよこにとめてあります。" })] } }],
    items: [
      answerOnlyItem("l34-p1-a3-q1", "1", "どこに荷物を置きましたか。（ロッカーの前）", "どこににもつをおきましたか。（ロッカーのまえ）", "ロッカーの前に置いてあります。"),
      answerOnlyItem("l34-p1-a3-q2", "2", "だれにパスポートを預けましたか。（旅行社の人）", "だれにパスポートをあずけましたか。（りょこうしゃのひと）", "旅行社の人に預けてあります。"),
      answerOnlyItem("l34-p1-a3-q3", "3", "どこにかぎをしまいましたか。（引き出しの中）", "どこにかぎをしまいましたか。（ひきだしのなか）", "引き出しの中にしまってあります。"),
      answerOnlyItem("l34-p1-a3-q4", "4", "どこにポスターをはりましたか。（受付の後ろの壁）", "どこにポスターをはりましたか。（うけつけのうしろのかべ）", "受付の後ろの壁にはってあります。"),
      answerOnlyItem("l34-p1-a3-q5", "5", "だれに会議のあいさつを頼みましたか。（部長）", "だれにかいぎのあいさつをたのみましたか。（ぶちょう）", "部長に頼んであります。")
    ]
  },
  {
    id: "l34-p1-a4", section: "practice_1", order: 4, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [], itemGroups: [
      { id: "l34-p1-a4-g1", example: { label: "[例 1]", before: "歓迎の準備をします", beforeKana: "かんげいのじゅんびをします", after: [text("歓迎客が来る前に、歓迎の準備をしておきます。", { kana: "かんげいきゃくがくるまえに、かんげいのじゅんびをしておきます。" })] }, items: [
        sentenceItem("l34-p1-a4-q1", "1", "到着の時間を調べます。", "とうちゃくのじかんをしらべます。", "到着の時間を調べておきます。"),
        sentenceItem("l34-p1-a4-q2", "2", "花束をたくさん用意します。", "はなたばをたくさんよういします。", "花束をたくさん用意しておきます。"),
        sentenceItem("l34-p1-a4-q3", "3", "いいホテルを探します。", "いいホテルをさがします。", "いいホテルを探しておきます。"),
        sentenceItem("l34-p1-a4-q4", "4", "会議の打ち合わせをします。", "かいぎのうちあわせをします。", "会議の打ち合わせをしておきます。"),
        sentenceItem("l34-p1-a4-q5", "5", "訪問先の資料を集めます。", "ほうもんさきのしりょうをあつめます。", "訪問先の資料を集めておきます。"),
        sentenceItem("l34-p1-a4-q6", "6", "歓迎のあいさつを考えます。", "かんげいのあいさつをかんがえます。", "歓迎のあいさつを考えておきます。")
      ] },
      { id: "l34-p1-a4-g2", example: { label: "[例 2]", before: "おいしいです／食べます", beforeKana: "おいしいです／たべます", after: [text("おいしいかどうか、食べてみます。", { kana: "おいしいかどうか、たべてみます。" })] }, items: [
        sentenceItem("l34-p1-a4-q7", "7", "似合います／着ます", "にあいます／きます", "似合うかどうか、着てみます。"),
        sentenceItem("l34-p1-a4-q8", "8", "おもしろいです／読みます", "おもしろいです／よみます", "おもしろいかどうか、読んでみます。"),
        sentenceItem("l34-p1-a4-q9", "9", "便利です／田中さんに聞きます", "べんりです／たなかさんにききます", "便利かどうか、田中さんに聞いてみます。"),
        sentenceItem("l34-p1-a4-q10", "10", "できます／やります", "できます／やります", "できるかどうか、やってみます。"),
        sentenceItem("l34-p1-a4-q11", "11", "サイズが合います／はきます", "サイズがあいます／はきます", "サイズが合うかどうか、はいてみます。"),
        sentenceItem("l34-p1-a4-q12", "12", "予約してあります／調べます", "よやくしてあります／しらべます", "予約してあるかどうか、調べてみます。")
      ] }
    ], items: []
  },
  {
    id: "l34-p1-a5", section: "practice_1", order: 5, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [], itemGroups: [
      { id: "l34-p1-a5-g1", example: { label: "[例]", before: "健康／ジョギングをします", beforeKana: "けんこう／ジョギングをします", after: [text("健康のために、ジョギングをしています。", { kana: "けんこうのために、ジョギングをしています。" })] }, items: [
        sentenceItem("l34-p1-a5-q1", "1", "発表会／毎日２時間ピアノを練習します", "はっぴょうかい／まいにちにじかんピアノをれんしゅうします", "発表会のために、毎日２時間ピアノを練習しています。"),
        sentenceItem("l34-p1-a5-q2", "2", "家族／一生懸命働きます", "かぞく／いっしょうけんめいはたらきます", "家族のために、一生懸命働いています。"),
        sentenceItem("l34-p1-a5-q3", "3", "明日の試験／今晩よく勉強しようと思います", "あしたのしけん／こんばんよくべんきょうしようとおもいます", "明日の試験のために、今晩よく勉強しようと思います。")
      ] },
      { id: "l34-p1-a5-g2", example: { before: "医者になります／一生懸命勉強します", beforeKana: "いしゃになります／いっしょうけんめいべんきょうします", after: [text("医者になるために、一生懸命勉強しています。", { kana: "いしゃになるために、いっしょうけんめいべんきょうしています。" })] }, items: [
        sentenceItem("l34-p1-a5-q4", "4", "留学します／日本語の勉強を続けます", "りゅうがくします／にほんごのべんきょうをつづけます", "留学するために、日本語の勉強を続けます。"),
        sentenceItem("l34-p1-a5-q5", "5", "やせます／１か月ダイエットをします", "やせます／いっかげつダイエットをします", "やせるために、１か月ダイエットをします。"),
        sentenceItem("l34-p1-a5-q6", "6", "論文を書きます／資料をたくさん読みます", "ろんぶんをかきます／しりょうをたくさんよみます", "論文を書くために、資料をたくさん読みます。"),
        sentenceItem("l34-p1-a5-q7", "7", "オリンピックに出ます／毎日１万メートル泳ぎます", "オリンピックにでます／まいにちいちまんメートルおよぎます", "オリンピックに出るために、毎日１万メートル泳ぎます。")
      ] }
    ], items: []
  },
  {
    id: "l34-p1-a6", section: "practice_1", order: 6, title: "听录音，仿照例句替换画线部分练习会话。", instruction: "", interaction: "dialogue_practice", answerUnit: "dialogue", responseScope: "dialogue_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 6), label: "第34课 练习I-6", transcript: { source: "asr", confidenceNote: "已分段转写两组示范及第 1—7 题；会话答案按录音中的固定轮次整理。", text: "[例1] 窓を開けます。あのう、この窓を開けておいてもいいですか。ええ、そのままにしておいてください。じゃあ、お先に失礼します。お疲れ様でした。1 パソコンの電源をつけます。2 資料を机の上に置きます。3 辞書を本棚に戻しません。4 会議室を片づけません。[例2] お菓子を食べます。このお菓子、おいしそうですね。どうぞ食べてみてください。いいですか。じゃあ、ちょっと。あっ、おいしいですね。そうですか。どうぞたくさん食べてください。ありがとうございます。じゃあ、遠慮なく。5 ワインを飲みます。6 料理を食べます。7 チーズを食べます。", segments: [{ itemNumber: "1", text: "このパソコンの電源をつけておいてもいいですか。" }, { itemNumber: "2", text: "この資料を机の上に置いておいてもいいですか。" }, { itemNumber: "3", text: "この辞書を本棚に戻しておかなくてもいいですか。" }, { itemNumber: "4", text: "この会議室を片づけておかなくてもいいですか。" }, { itemNumber: "5", text: "このワイン、おいしそうですね。どうぞ飲んでみてください。" }, { itemNumber: "6", text: "この料理、おいしそうですね。どうぞ食べてみてください。" }, { itemNumber: "7", text: "このチーズ、おいしそうですね。どうぞ食べてみてください。" }] } },
    layout: [], itemGroups: [
      { id: "l34-p1-a6-g1", example: { label: "[例 1]", before: "窓を開けます\n窓を閉めません", beforeKana: "まどをあけます\nまどをしめません", after: [text("甲：あのう、この窓を開けておいてもいいですか。\n甲：あのう、この窓を閉めておかなくてもいいですか。\n乙：ええ。そのままにしておいてください。\n甲：じゃあ、お先に失礼します。\n乙：お疲れ様でした。", { kana: "こう：あのう、このまどをあけておいてもいいですか。\nこう：あのう、このまどをしめておかなくてもいいですか。\nおつ：ええ。そのままにしておいてください。\nこう：じゃあ、おさきにしつれいします。\nおつ：おつかれさまでした。" })] }, items: [
        dialogueItem("l34-p1-a6-q1", "1", "パソコンの電源をつけます", "パソコンのでんげんをつけます", "甲：あのう、このパソコンの電源をつけておいてもいいですか。\n乙：ええ。そのままにしておいてください。\n甲：じゃあ、お先に失礼します。\n乙：お疲れ様でした。"),
        dialogueItem("l34-p1-a6-q2", "2", "資料を机の上に置きます", "しりょうをつくえのうえにおきます", "甲：あのう、この資料を机の上に置いておいてもいいですか。\n乙：ええ。そのままにしておいてください。\n甲：じゃあ、お先に失礼します。\n乙：お疲れ様でした。"),
        dialogueItem("l34-p1-a6-q3", "3", "辞書を本棚に戻しません", "じしょをほんだなにもどしません", "甲：あのう、この辞書を本棚に戻しておかなくてもいいですか。\n乙：ええ。そのままにしておいてください。\n甲：じゃあ、お先に失礼します。\n乙：お疲れ様でした。"),
        dialogueItem("l34-p1-a6-q4", "4", "会議室を片づけません", "かいぎしつをかたづけません", "甲：あのう、この会議室を片づけておかなくてもいいですか。\n乙：ええ。そのままにしておいてください。\n甲：じゃあ、お先に失礼します。\n乙：お疲れ様でした。")
      ] },
      { id: "l34-p1-a6-g2", example: { label: "[例 2]", before: "お菓子／食べます", beforeKana: "おかし／たべます", after: [text("甲：このお菓子、おいしそうですね。\n乙：どうぞ食べてみてください。\n甲：いいですか。じゃあ、ちょっと……あっ、おいしいですね。\n乙：そうですか。どうぞたくさん食べてください。\n甲：ありがとうございます。じゃあ、遠慮なく。", { kana: "こう：このおかし、おいしそうですね。\nおつ：どうぞたべてみてください。\nこう：いいですか。じゃあ、ちょっと……あっ、おいしいですね。\nおつ：そうですか。どうぞたくさんたべてください。\nこう：ありがとうございます。じゃあ、えんりょなく。" })] }, items: [
        dialogueItem("l34-p1-a6-q5", "5", "ワイン／飲みます", "ワイン／のみます", "甲：このワイン、おいしそうですね。\n乙：どうぞ飲んでみてください。\n甲：いいですか。じゃあ、ちょっと……あっ、おいしいですね。\n乙：そうですか。どうぞたくさん飲んでください。\n甲：ありがとうございます。じゃあ、遠慮なく。"),
        dialogueItem("l34-p1-a6-q6", "6", "料理／食べます", "りょうり／たべます", "甲：この料理、おいしそうですね。\n乙：どうぞ食べてみてください。\n甲：いいですか。じゃあ、ちょっと……あっ、おいしいですね。\n乙：そうですか。どうぞたくさん食べてください。\n甲：ありがとうございます。じゃあ、遠慮なく。"),
        dialogueItem("l34-p1-a6-q7", "7", "チーズ／食べます", "チーズ／たべます", "甲：このチーズ、おいしそうですね。\n乙：どうぞ食べてみてください。\n甲：いいですか。じゃあ、ちょっと……あっ、おいしいですね。\n乙：そうですか。どうぞたくさん食べてください。\n甲：ありがとうございます。じゃあ、遠慮なく。")
      ] }
    ], items: []
  },
  {
    id: "l34-p2-a1", section: "practice_2", order: 1, title: "给正确的答案画○。", instruction: "", interaction: "single_choice", answerUnit: "choice", responseScope: "choice_only",
    layout: [{ type: "example", content: { label: "[例]", before: "名前や住所が書いて（あります・います）。", beforeKana: "なまえやじゅうしょがかいて（あります・います）。", after: [] } }],
    items: [
      choiceItem("l34-p2-a1-q1", "1", "暗いので、電気がつけて（います・あります）。", "くらいので、でんきがつけて（います・あります）。", [{ id: "imasu", label: "います" }, { id: "arimasu", label: "あります" }], "arimasu"),
      choiceItem("l34-p2-a1-q2", "2", "風邪ですから、早く薬を飲んで（おいた・しまった）ほうがいいですよ。", "かぜですから、はやくくすりをのんで（おいた・しまった）ほうがいいですよ。", [{ id: "oita", label: "おいた" }, { id: "shimatta", label: "しまった" }], "oita"),
      choiceItem("l34-p2-a1-q3", "3", "お客さんが来るので、部屋を掃除して（みて・おいて）ください。", "おきゃくさんがくるので、へやをそうじして（みて・おいて）ください。", [{ id: "mite", label: "みて" }, { id: "oite", label: "おいて" }], "oite"),
      choiceItem("l34-p2-a1-q4", "4", "健康のために、ジョギングを始めて（みよう・いよう）と思っています。", "けんこうのために、ジョギングをはじめて（みよう・いよう）とおもっています。", [{ id: "miyou", label: "みよう" }, { id: "iyou", label: "いよう" }], "miyou"),
      choiceItem("l34-p2-a1-q5", "5", "冷蔵庫にビールが入って（います・おきます）。", "れいぞうこにビールがはいって（います・おきます）。", [{ id: "imasu", label: "います" }, { id: "okimasu", label: "おきます" }], "imasu")
    ]
  },
  {
    id: "l34-p2-a2", section: "practice_2", order: 2, title: "听录音，与录音内容一致的在（　）中画○，不一致的画×。", instruction: "", interaction: "true_false", answerUnit: "boolean", responseScope: "boolean_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(2, 2), label: "第34课 练习II-2", transcript: { source: "asr", text: "[例] 部屋にテーブルが置いてあります。1 テーブルの上に花が飾ってあります。2 本棚に本が並べてあります。3 本棚の上に人形が飾ってあります。4 窓が閉めてありません。5 ドアが開けてあります。6 壁にカレンダーがかけてあります。7 ドアに何も貼ってありません。8 テーブルの下にかばんが置いてあります。9 テレビは消してあります。10 カレンダーの横にコートがかけてあります。", segments: [{ itemNumber: "1", text: "テーブルの上に花が飾ってあります。" }, { itemNumber: "2", text: "本棚に本が並べてあります。" }, { itemNumber: "3", text: "本棚の上に人形が飾ってあります。" }, { itemNumber: "4", text: "窓が閉めてありません。" }, { itemNumber: "5", text: "ドアが開けてあります。" }, { itemNumber: "6", text: "壁にカレンダーがかけてあります。" }, { itemNumber: "7", text: "ドアに何も貼ってありません。" }, { itemNumber: "8", text: "テーブルの下にかばんが置いてあります。" }, { itemNumber: "9", text: "テレビは消してあります。" }, { itemNumber: "10", text: "カレンダーの横にコートがかけてあります。" }] } },
    assets: [{ id: "l34-p2-a2-room", kind: "exercise_image", imagePath: exerciseImage("book1_lesson34_2_2.png"), label: "练习 II 2 房间图" }], displayAssets: ["l34-p2-a2-room"],
    layout: [{ type: "example", content: { label: "[例]", before: "部屋にテーブルが置いてあります。", beforeKana: "へやにテーブルがおいてあります。", after: [text("（○）")] } }],
    items: [boolItem("l34-p2-a2-q1", "1", true), boolItem("l34-p2-a2-q2", "2", true), boolItem("l34-p2-a2-q3", "3", false), boolItem("l34-p2-a2-q4", "4", false), boolItem("l34-p2-a2-q5", "5", false), boolItem("l34-p2-a2-q6", "6", true), boolItem("l34-p2-a2-q7", "7", true), boolItem("l34-p2-a2-q8", "8", false), boolItem("l34-p2-a2-q9", "9", true), boolItem("l34-p2-a2-q10", "10", false)]
  },
  {
    id: "l34-p2-a3", section: "practice_2", order: 3, title: "从□中选择适当的词语填入（　）中。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only",
    assets: [{ id: "l34-p2-a3-word-bank", kind: "exercise_image", imagePath: exerciseImage("book1_lesson34_2_3.png"), label: "练习 II 3 词框" }], displayAssets: ["l34-p2-a3-word-bank"],
    layout: [{ type: "example", content: { label: "[例]", before: "会議は（だいたい）３時半ごろには終わるでしょう。", beforeKana: "かいぎは（だいたい）さんじはんごろにはおわるでしょう。", after: [] } }, { type: "word_bank", words: [text("だいたい"), text("必ず", { kana: "かならず" }), text("ずっと"), text("そろそろ"), text("つい"), text("ちゃんと"), text("あちこち"), text("こんなに")] }],
    items: [
      wordItem("l34-p2-a3-q1", "1", [text("お客さんが来る前に、部屋を（", { kana: "おきゃくさんがくるまえに、へやを（" }), blank("answer"), text("）掃除しておいてください。", { kana: "）そうじしておいてください。" })], "おきゃくさんがくるまえに、へやを（）そうじしておいてください。", "ちゃんと", "prompt"),
      wordItem("l34-p2-a3-q2", "2", [text("久しぶりに運動したので、体の（", { kana: "ひさしぶりにうんどうしたので、からだの（" }), blank("answer"), text("）が痛いです。", { kana: "）がいたいです。" })], "ひさしぶりにうんどうしたので、からだの（）がいたいです。", "あちこち", "prompt"),
      wordItem("l34-p2-a3-q3", "3", [text("（"), blank("answer"), text("）おいしい料理は、食べたことがありません。", { kana: "）おいしいりょうりは、たべたことがありません。" })], "（）おいしいりょうりは、たべたことがありません。", "こんなに", "prompt"),
      wordItem("l34-p2-a3-q4", "4", [text("おいしいと、（"), blank("answer"), text("）たくさん食べてしまいます。", { kana: "）たくさんたべてしまいます。" })], "おいしいと、（）たくさんたべてしまいます。", "つい", "prompt"),
      wordItem("l34-p2-a3-q5", "5", [text("天気予報によると、連休中は（", { kana: "てんきよほうによると、れんきゅうちゅうは（" }), blank("answer"), text("）晴れだそうです。", { kana: "）はれだそうです。" })], "てんきよほうによると、れんきゅうちゅうは（）はれだそうです。", "ずっと", "prompt"),
      wordItem("l34-p2-a3-q6", "6", [text("10時になりましたから、（", { kana: "じゅうじになりましたから、（" }), blank("answer"), text("）会議を始めましょうか。", { kana: "）かいぎをはじめましょうか。" })], "じゅうじになりましたから、（）かいぎをはじめましょうか。", "そろそろ", "prompt"),
      wordItem("l34-p2-a3-q7", "7", [text("５、６人集まると、（", { kana: "ご、ろくにんあつまると、（" }), blank("answer"), text("）だれかが遅刻しますね。", { kana: "）だれかがちこくしますね。" })], "ご、ろくにんあつまると、（）だれかがちこくしますね。", "必ず", "prompt")
    ]
  },
  {
    id: "l34-p2-a4", section: "practice_2", order: 4, title: "将下面的句子译成日语。", instruction: "", interaction: "translation", answerUnit: "sentence", responseScope: "sentence_only", layout: [],
    items: [
      sentenceItem("l34-p2-a4-q1", "1", "森先生，你把车停在哪儿了？——停在公园前面了。", "", "森さん、車をどこに止めましたか。——公園の前に止めてあります。", "prompt"),
      sentenceItem("l34-p2-a4-q2", "2", "请把会议资料复印10份。", "", "会議の資料を10部コピーしておいてください。", "prompt"),
      sentenceItem("l34-p2-a4-q3", "3", "我正在为去日本留学攒钱。", "", "日本へ留学するために、貯金しています。", "prompt")
    ]
  }
];

export const lesson34Practice: LessonPractice = {
  lessonId: "lesson34",
  title: "第34课 壁にカレンダーが掛けてあります",
  sourcePages: [{ pageNo: 112, imagePath: page(112) }, { pageNo: 113, imagePath: page(113) }, { pageNo: 114, imagePath: page(114) }],
  activities
};
