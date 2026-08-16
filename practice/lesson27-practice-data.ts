import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson27/page${pageNo}.webp`;
const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit7/lesson27/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const sentenceSlot = (placeholder = "输入完整句子"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const dialogueSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows: 4, placeholder: "输入完整对话" }];
const answerItem = (id: string, number: string, prompt: string, answer: string, options: Partial<PracticeItem> = {}): PracticeItem => ({
  id, number, prompt: [text(prompt)], instruction: "", answerSource: "example_transform", responseScope: "sentence_only",
  inputSlots: sentenceSlot(), answer: { slotValues: { answer } }, ...options
});
const dialogueItem = (id: string, number: string, prompt: string, answer: string): PracticeItem => ({
  id, number, prompt: [text(prompt)], instruction: "", answerSource: "audio", responseScope: "dialogue_only",
  inputSlots: dialogueSlot(), answer: { slotValues: { answer } }, renderHint: "dialogue"
});
const blankItem = (id: string, number: string, prompt: PromptPart[], answer: string): PracticeItem => ({
  id, number, prompt, instruction: "", answerSource: "prompt", responseScope: "word_only",
  inputSlots: [{ id: "answer", expectedUnit: "conjugated_form", width: "medium", placeholder: "输入适当形式" }], answer: { slotValues: { answer } }
});

const activities: PracticeActivity[] = [
  {
    id: "l27-p1-a1", section: "practice_1", order: 1, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [
      { type: "example", content: { label: "[例]", before: "子供です／横浜に住んでいました", beforeKana: "こどもです／よこはまに すんでいました", after: [text("子供の時、横浜に住んでいました。", { kana: "こどもの とき、よこはまに すんでいました。" })] } }
    ], items: [
      answerItem("l27-p1-a1-q1", "1", "病気です／1か月会社を休みました", "病気の時、1か月会社を休みました。"),
      answerItem("l27-p1-a1-q2", "2", "休みです／子供とサッカーをします", "休みの時、子供とサッカーをします。"),
      answerItem("l27-p1-a1-q3", "3", "信号が青です／道を渡ってもいいです", "信号が青の時、道を渡ってもいいです。"),
      answerItem("l27-p1-a1-q4", "4", "信号が赤です／道を渡ってはいけません", "信号が赤の時、道を渡ってはいけません。"),
      answerItem("l27-p1-a1-q5", "5", "海外旅行です／パスポートが要ります", "海外旅行の時、パスポートが要ります。")
    ]
  },
  {
    id: "l27-p1-a2", section: "practice_1", order: 2, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [
      { type: "example", content: { label: "[例]", before: "天気がいいです／友達と野球をします", beforeKana: "てんきが いいです／ともだちと やきゅうを します", after: [text("天気がいい時、友達と野球をします。", { kana: "てんきが いい とき、ともだちと やきゅうを します。" })] } }
    ], items: [
      answerItem("l27-p1-a2-q1", "1", "楽しいです／明るい曲を聞きます", "楽しい時、明るい曲を聞きます。"),
      answerItem("l27-p1-a2-q2", "2", "夜静かです／詩を書きます", "夜静かな時、詩を書きます。"),
      answerItem("l27-p1-a2-q3", "3", "困りました／わたしに相談してください", "困った時、わたしに相談してください。"),
      answerItem("l27-p1-a2-q4", "4", "紙を切ります／はさみを使います", "紙を切る時、はさみを使います。"),
      answerItem("l27-p1-a2-q5", "5", "部屋を使いません／電気を消してください", "部屋を使わない時、電気を消してください。"),
      answerItem("l27-p1-a2-q6", "6", "お金がありません／どうしますか", "お金がない時、どうしますか。"),
      answerItem("l27-p1-a2-q7", "7", "都合が悪いです／すぐ連絡してください", "都合が悪い時、すぐ連絡してください。"),
      answerItem("l27-p1-a2-q8", "8", "朝友達に会いました／「おはよう」と言います", "朝友達に会った時、「おはよう」と言います。")
    ]
  },
  {
    id: "l27-p1-a3", section: "practice_1", order: 3, title: "仿照例句，回答录音中的提问。", instruction: "听录音，写出完整回答。", interaction: "listening_answer", answerUnit: "sentence", responseScope: "answer_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 3), label: "第27课 练习I-3", transcript: { source: "manual", text: "根据教材的例句和提示词回答录音提问。" } }, layout: [], items: [
      answerItem("l27-p1-a3-q1", "1", "コーヒーか紅茶", "紅茶のほうが好きでした。", { answerSource: "audio", responseScope: "answer_only" }),
      answerItem("l27-p1-a3-q2", "2", "お金とパスポート", "海外旅行の時、パスポートが要ります。", { answerSource: "audio", responseScope: "answer_only" }),
      answerItem("l27-p1-a3-q3", "3", "旅行", "旅行の時、写真を撮ります。", { answerSource: "audio", responseScope: "answer_only" }),
      answerItem("l27-p1-a3-q4", "4", "「お先に失礼します」", "会社を出る時、「お先に失礼します」と言います。", { answerSource: "audio", responseScope: "answer_only" }),
      answerItem("l27-p1-a3-q5", "5", "家族や友達", "家族や友達に会った時、うれしいです。", { answerSource: "audio", responseScope: "answer_only" }),
      answerItem("l27-p1-a3-q6", "6", "卓球やバスケットボール", "卓球やバスケットボールをする時、スポーツセンターへ行きます。", { answerSource: "audio", responseScope: "answer_only" })
    ]
  },
  {
    id: "l27-p1-a4", section: "practice_1", order: 4, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [
      { type: "example", content: { label: "[例1]", before: "雑誌を読みます／ご飯を食べます", beforeKana: "ざっしを よみます／ごはんを たべます", after: [text("雑誌を読みながら、ご飯を食べています。", { kana: "ざっしを よみながら、ごはんを たべています。" })] } }
    ], items: [
      answerItem("l27-p1-a4-q1", "1", "ラジオを聞きます／食事の準備をします", "ラジオを聞きながら、食事の準備をしています。"),
      answerItem("l27-p1-a4-q2", "2", "長島さんと話します／写真を選びます", "長島さんと話しながら、写真を選びます。"),
      answerItem("l27-p1-a4-q3", "3", "手をたたきます／歌ったり踊ったりします", "手をたたきながら、歌ったり踊ったりします。"),
      answerItem("l27-p1-a4-q4", "4", "部屋の中を歩きます／スピーチの練習をします", "部屋の中を歩きながら、スピーチの練習をします。"),
      answerItem("l27-p1-a4-q5", "5", "表やグラフを見せます／新しい企画の説明をします", "表やグラフを見せながら、新しい企画の説明をします。")
    ]
  },
  {
    id: "l27-p1-a5", section: "practice_1", order: 5, title: "仿照例句替换画线部分进行练习。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [
      { type: "example", content: { label: "[例]", before: "姉は銀行で働きます", beforeKana: "あねは ぎんこうで はたらきます", after: [text("銀行で働いている人は姉です。", { kana: "ぎんこうで はたらいている ひとは あねです。" })] } }
    ], items: [
      answerItem("l27-p1-a5-q1", "1", "父は市役所で働きます", "市役所で働いている人は父です。"),
      answerItem("l27-p1-a5-q2", "2", "兄は大学で国際関係学を勉強します", "大学で国際関係学を勉強している人は兄です。"),
      answerItem("l27-p1-a5-q3", "3", "母は毎日病院に通います", "毎日病院に通っている人は母です。"),
      answerItem("l27-p1-a5-q4", "4", "駅前のスーパーは安い品物を売ります", "安い品物を売っているスーパーは駅前のスーパーです。"),
      answerItem("l27-p1-a5-q5", "5", "わたしは毎日運動します", "毎日運動している人はわたしです。"),
      answerItem("l27-p1-a5-q6", "6", "弟の会社はパソコンの部品を作ります", "パソコンの部品を作っている会社は弟の会社です。")
    ]
  },
  {
    id: "l27-p1-a6", section: "practice_1", order: 6, title: "听录音，仿照例句替换画线部分练习会话。", instruction: "输入完整对话。", interaction: "dialogue_practice", answerUnit: "dialogue", responseScope: "dialogue_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 6), label: "第27课 练习I-6", transcript: { source: "manual", text: "以教材例句的问候和近况会话结构替换人物、地点和动作。" } }, layout: [], items: [
      dialogueItem("l27-p1-a6-q1", "1", "キムさん／木下さん／スーパーで働きます", "甲：あのう、キムさんでしょう？\n乙：あっ、木下さん、しばらくですね。\n甲：本当に。お元気ですか。\n乙：ええ、スーパーで働いています。"),
      dialogueItem("l27-p1-a6-q2", "2", "田中さん／張さん／マンションに住みます", "甲：あのう、田中さんでしょう？\n乙：あっ、張さん、しばらくですね。\n甲：本当に。お元気ですか。\n乙：ええ、マンションに住んでいます。"),
      dialogueItem("l27-p1-a6-q3", "3", "陳さん／田村さん／会社で働きます", "甲：あのう、陳さんでしょう？\n乙：あっ、田村さん、しばらくですね。\n甲：本当に。お元気ですか。\n乙：ええ、会社で働いています。")
    ]
  },
  {
    id: "l27-p2-a1", section: "practice_2", order: 1, title: "看图，仿照例句造句。", instruction: "", interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only",
    assets: [{ id: "l27-p2-a1-picture-sequences", kind: "exercise_image", imagePath: exerciseImage("book1_lesson27_2_1.png"), label: "练习II-1 图片" }], displayAssets: ["l27-p2-a1-picture-sequences"], layout: [
      { type: "example", content: { label: "[例]", before: "テレビ／見ます　晩ご飯／食べます", beforeKana: "テレビ／みます　ばんごはん／たべます", after: [text("テレビを見ながら、晩ご飯を食べています。", { kana: "テレビを みながら、ばんごはんを たべています。" })] } }
    ], items: [
      answerItem("l27-p2-a1-q1", "1", "タバコ／吸います　テレビ／見ます", "タバコを吸いながら、テレビを見ています。"),
      answerItem("l27-p2-a1-q2", "2", "歌／歌います　公園／散歩します", "歌を歌いながら、公園を散歩しています。"),
      answerItem("l27-p2-a1-q3", "3", "お茶／飲みます　音楽／聞きます", "お茶を飲みながら、音楽を聞いています。"),
      answerItem("l27-p2-a1-q4", "4", "笑います　アルバム／見ます", "笑いながら、アルバムを見ています。")
    ]
  },
  {
    id: "l27-p2-a2", section: "practice_2", order: 2, title: "从词框中选择适当的词语填入括号中。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only",
    assets: [{ id: "l27-p2-a2-word-bank", kind: "exercise_image", imagePath: exerciseImage("book1_lesson27_2_2.png"), label: "练习II-2 词框" }], displayAssets: ["l27-p2-a2-word-bank"], layout: [], items: [
      blankItem("l27-p2-a2-q1", "1", [text("紙を切る時に使う道具です。（"), blank("answer"), text("）")], "はさみ"),
      blankItem("l27-p2-a2-q2", "2", [text("買い物する時に使う物です。（"), blank("answer"), text("）")], "クレジットカード"),
      blankItem("l27-p2-a2-q3", "3", [text("話したりメールを送ったりする時に使う物です。（"), blank("answer"), text("）")], "携帯電話"),
      blankItem("l27-p2-a2-q4", "4", [text("ご飯を食べる時に行く所です。（"), blank("answer"), text("）")], "食堂"),
      blankItem("l27-p2-a2-q5", "5", [text("切手を買ったり荷物を送ったりする時に行く所です。（"), blank("answer"), text("）")], "郵便局")
    ]
  },
  {
    id: "l27-p2-a3", section: "practice_2", order: 3, title: "将括号中的词语变成适当的形式，完成句子。", instruction: "", interaction: "fill_blank", answerUnit: "word", responseScope: "word_only", layout: [
      { type: "example", content: { label: "[例]", before: "（疲れます → 疲れた）時", beforeKana: "（つかれます → つかれた）とき", after: [text("ゆっくりお風呂に入ります。", { kana: "ゆっくり おふろに はいります。" })] } }
    ], items: [
      blankItem("l27-p2-a3-q1", "1", [text("あそこで電話を（かけます → "), blank("answer"), text("）人はだれですか。")], "かけている"),
      blankItem("l27-p2-a3-q2", "2", [text("あなたが（好きです → "), blank("answer"), text("）音楽は何ですか。")], "好きな"),
      blankItem("l27-p2-a3-q3", "3", [text("吉田さんは昨日（来ませんでした → "), blank("answer"), text("）でしょう？")], "来なかった"),
      blankItem("l27-p2-a3-q4", "4", [text("李さんは歌を（歌います → "), blank("answer"), text("）ながら、掃除しています。")], "歌い"),
      blankItem("l27-p2-a3-q5", "5", [text("あの店は日曜日は（休みです → "), blank("answer"), text("）かもしれません。")], "休み" )
    ]
  },
  {
    id: "l27-p2-a4", section: "practice_2", order: 4, title: "将下面的句子译成日语。", instruction: "", interaction: "translation", answerUnit: "sentence", responseScope: "sentence_only", layout: [], items: [
      answerItem("l27-p2-a4-q1", "1", "（我）小时候，发生过大地震。", "子供の時、大きな地震がありました。"),
      answerItem("l27-p2-a4-q2", "2", "小李正边看电视边吃饭。", "李さんはテレビを見ながら、ご飯を食べています。"),
      answerItem("l27-p2-a4-q3", "3", "森先生，昨天你在车站附近的咖啡馆来着吧？", "森先生、昨日駅の近くの喫茶店にいましたでしょう？")
    ]
  }
];

export const lesson27Practice: LessonPractice = {
  lessonId: "lesson27",
  title: "第27课 子供の時、大きな地震がありました",
  sourcePages: [{ pageNo: 30, imagePath: page(30) }, { pageNo: 31, imagePath: page(31) }, { pageNo: 32, imagePath: page(32) }],
  activities
};
