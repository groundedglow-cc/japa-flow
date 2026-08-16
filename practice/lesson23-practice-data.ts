import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson23/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit6/lesson23/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const completionHint = "只补全题目中空格处需要填写的部分。";
const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
const sentenceSlot = (placeholder = "输入完整句子"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const phraseSlot = (placeholder = "输入词语"): InputSlot[] => [{ id: "answer", expectedUnit: "phrase", width: "long", placeholder }];
const dialogueSlot = (placeholder = "输入完整问答", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows, placeholder }
];
const slots = (slotIds: string[], expectedUnit: InputSlot["expectedUnit"] = "phrase"): InputSlot[] =>
  slotIds.map((slotId) => ({ id: slotId, expectedUnit, width: "medium", placeholder: "输入词语" }));

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
    acceptableAlternatives?: string[];
    multiline?: boolean;
    rows?: number;
  } = {}
): PracticeItem => ({
  id,
  number,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "example_transform",
  responseScope: options.responseScope || "sentence_only",
  responseScopeHint: options.responseScopeHint,
  inputSlots: options.multiline ? dialogueSlot("输入完整问答", options.rows || 4) : sentenceSlot("输入完整句子"),
  answer: { slotValues: { answer }, acceptableAlternatives: options.acceptableAlternatives }
});

const phraseItem = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  answer: string,
  options: { promptKana?: string; answerSource?: PracticeItem["answerSource"]; responseScopeHint?: string; acceptableAlternatives?: string[] } = {}
): PracticeItem => ({
  id,
  number,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "example_transform",
  responseScope: "phrase_only",
  responseScopeHint: options.responseScopeHint || completionHint,
  inputSlots: phraseSlot("输入词语"),
  answer: { slotValues: { answer }, acceptableAlternatives: options.acceptableAlternatives }
});

const blankItem = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  answers: Record<string, string>,
  options: { promptKana?: string; answerSource?: PracticeItem["answerSource"]; responseScope?: PracticeItem["responseScope"]; expectedUnit?: InputSlot["expectedUnit"] } = {}
): PracticeItem => ({
  id,
  number,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "prompt",
  responseScope: options.responseScope || "phrase_only",
  responseScopeHint: completionHint,
  inputSlots: slots(Object.keys(answers), options.expectedUnit),
  answer: { slotValues: answers }
});

const dialogueItem = (id: string, number: string, prompt: string, answer: string, promptKana?: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "example_transform",
  responseScope: "question_and_answer",
  responseScopeHint: "写出完整问答。",
  inputSlots: dialogueSlot("输入完整问答", 4),
  answer: { slotValues: { answer } },
  renderHint: "dialogue"
});

const choiceItem = (
  id: string,
  number: string,
  prompt: string,
  choiceIds: string[],
  options: { promptKana?: string; choices?: PracticeItem["choices"]; multi?: boolean; answerSource?: PracticeItem["answerSource"] } = {}
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "audio",
  responseScope: "choice_only",
  choices: options.choices,
  answer: { choiceIds },
  renderHint: options.multi ? "table_row" : "inline"
});

const tableChoices = [
  { id: "beer", label: "ビール" },
  { id: "karaoke", label: "カラオケ" },
  { id: "yakitori", label: "焼き鳥" }
];

const connectChoices = [
  { id: "douka", label: "どうか 分かりません。" },
  { id: "wakari", label: "分かりません。" }
];

const activities: PracticeActivity[] = [
  {
    id: "l23-p1-a1",
    section: "practice_1",
    order: 1,
    title: "看图，仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [
      { id: "l23-p1-a1-picture-substitution", kind: "exercise_image", imagePath: exerciseImage("book1_lesson23_1_1.png") }
    ],
    displayAssets: ["l23-p1-a1-picture-substitution"],
    layout: [
      { type: "example", content: { label: "[例]", before: "休みの 日 → 休みの 日、散歩に 行ったり 買い物に 行ったり します。", beforeKana: "やすみの ひ → やすみの ひ、さんぽに いったり かいものに いったり します。", after: [text("休みの 日、散歩に 行ったり 買い物に 行ったり します。", { kana: "やすみの ひ、さんぽに いったり かいものに いったり します。" })] } }
    ],
    items: [
      answerItem("l23-p1-a1-q1", "1", "毎晩／本を 読みます／テレビを 見ます", "毎晩、本を 読んだり テレビを 見たり します。", { promptKana: "まいばん／ほんを よみます／テレビを みます" }),
      answerItem("l23-p1-a1-q2", "2", "昨日／部屋を 掃除しました／車を 洗いました", "昨日、部屋を 掃除したり 車を 洗ったり しました。", { promptKana: "きのう／へやを そうじしました／くるまを あらいました" }),
      answerItem("l23-p1-a1-q3", "3", "金曜日の 晩／飲みに 行きます／カラオケに 行きます", "金曜日の 晩、飲みに 行ったり カラオケに 行ったり します。", { promptKana: "きんようびの ばん／のみに いきます／カラオケに いきます" })
    ]
  },
  {
    id: "l23-p1-a2",
    section: "practice_1",
    order: 2,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [],
    layout: [
      { type: "example", content: { label: "[例]", before: "チケット／高い／安い\n公園／静か／にぎやか\n先生／中国人／日本人", beforeKana: "チケット／たかい／やすい\nこうえん／しずか／にぎやか\nせんせい／ちゅうごくじん／にほんじん", after: [text("チケットは 高かったり 安かったりです。\n公園は 静かだったり にぎやかだったりです。\n先生は 中国人だったり 日本人だったりです。")], afterKana: "チケットは たかかったり やすかったりです。\nこうえんは しずかだったり にぎやかだったりです。\nせんせいは ちゅうごくじんだったり にほんじんだったりです。" } }
    ],
    items: [
      answerItem("l23-p1-a2-q1", "1", "休み／金曜日／月曜日", "休みは 金曜日だったり 月曜日だったりです。", { promptKana: "やすみ／きんようび／げつようび" }),
      answerItem("l23-p1-a2-q2", "2", "試験／易しい／難しい", "試験は 易しかったり 難しかったりです。", { promptKana: "しけん／やさしい／むずかしい" }),
      answerItem("l23-p1-a2-q3", "3", "閉店時刻／早い／遅い", "閉店時刻は 早かったり 遅かったりです。", { promptKana: "へいてんじこく／はやい／おそい" }),
      answerItem("l23-p1-a2-q4", "4", "仕事／暇／忙しい", "仕事は 暇だったり 忙しかったりです。", { promptKana: "しごと／ひま／いそがしい" })
    ]
  },
  {
    id: "l23-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句回答提问。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    assets: [],
    layout: [
      { type: "example", content: { label: "[例]", before: "毎晩 何を しますか。（テレビを 見ます／雑誌を 読みます）", beforeKana: "まいばん なにを しますか。（テレビを みます／ざっしを よみます）", after: [text("テレビを 見たり 雑誌を 読んだり します。", { kana: "テレビを みたり ざっしを よんだり します。" })] } }
    ],
    items: [
      answerItem("l23-p1-a3-q1", "1", "休みの 日に 何を しますか。（掃除を します／洗濯を します）", "掃除を したり 洗濯を したり します。", { promptKana: "やすみの ひに なにを しますか。（そうじを します／せんたくを します）", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l23-p1-a3-q2", "2", "箱根に 行って、何を しますか。（山に 登ります／船に 乗ります）", "山に 登ったり 船に 乗ったり します。", { promptKana: "はこねに いって、なにを しますか。（やまに のぼります／ふねに のります）", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l23-p1-a3-q3", "3", "夏休み、海で 何を しますか。（泳ぎます／釣りを します）", "泳いだり 釣りを したり します。", { promptKana: "なつやすみ、うみで なにを しますか。（およぎます／つりを します）", responseScope: "answer_only", responseScopeHint: answerOnlyHint })
    ]
  },
  {
    id: "l23-p1-a4",
    section: "practice_1",
    order: 4,
    title: "先仿照例句替换画线部分进行练习，然后听录音确认。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整转换句或完整问答。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 4),
      label: "第23课 练习I-4",
      transcript: {
        text: "森さんは何時ごろ来ますか。森さんが何時ごろ来るか知っていますか。卒業式は何時に始まりますか。卒業式が何時に始まるか知っていますか。だれが今会社の車を運転していますか。だれが今会社の車を運転しているか知っていますか。この箱の中に何がありますか。この箱の中に何があるか知っていますか。森さんはどこへ出かけましたか。森さんがどこへ出かけたか知っていますか。今日森さんは来ますか。さあ、来るか来ないか分かりません。来るかどうか分かりません。",
        source: "asr",
        confidenceNote: "ASR 完整覆盖例1和正式题 1-4，并识别到例2；正式题 5-8 的答案按教材印刷题干和例2句型补全。"
      }
    },
    assets: [],
    layout: [
      { type: "example", content: { label: "[例1]", before: "森さんは 何時ごろ 来ますか。", beforeKana: "もりさんは なんじごろ きますか。", after: [text("森さんが 何時ごろ 来るか 知って いますか。")], afterKana: "もりさんが なんじごろ くるか しって いますか。" } },
      { type: "example", content: { label: "[例2]", before: "今日 森さんは 来ます。", beforeKana: "きょう もりさんは きます。", after: [text("甲：今日 森さんは 来ますか。\n乙1：さあ、来るか 来ないか 分かりません。\n乙2：来るか どうか 分かりません。")], afterKana: "きょう もりさんは きますか。\nさあ、くるか こないか わかりません。\nくるか どうか わかりません。" } }
    ],
    items: [
      answerItem("l23-p1-a4-q1", "1", "卒業式は 何時に 始まりますか。", "卒業式が 何時に 始まるか 知って いますか。", { promptKana: "そつぎょうしきは なんじに はじまりますか。", answerSource: "audio" }),
      answerItem("l23-p1-a4-q2", "2", "だれが 今 会社の 車を 運転して いますか。", "だれが 今 会社の 車を 運転して いるか 知って いますか。", { promptKana: "だれが いま かいしゃの くるまを うんてんして いますか。", answerSource: "audio" }),
      answerItem("l23-p1-a4-q3", "3", "この 箱の 中に 何が ありますか。", "この 箱の 中に 何が あるか 知って いますか。", { promptKana: "この はこの なかに なにが ありますか。", answerSource: "audio" }),
      answerItem("l23-p1-a4-q4", "4", "森さんは どこへ 出かけましたか。", "森さんが どこへ 出かけたか 知って いますか。", { promptKana: "もりさんは どこへ でかけましたか。", answerSource: "audio" }),
      dialogueItem("l23-p1-a4-q5", "5", "明日 雪が 降ります。", "甲：明日 雪が 降りますか。\n乙1：さあ、降るか 降らないか 分かりません。\n乙2：降るか どうか 分かりません。", "あした ゆきが ふります。"),
      dialogueItem("l23-p1-a4-q6", "6", "キムさんは お酒を 飲みます。", "甲：キムさんは お酒を 飲みますか。\n乙1：さあ、飲むか 飲まないか 分かりません。\n乙2：飲むか どうか 分かりません。", "キムさんは おさけを のみます。"),
      dialogueItem("l23-p1-a4-q7", "7", "李さんは まだ 会社に います。", "甲：李さんは まだ 会社に いますか。\n乙1：さあ、いるか いないか 分かりません。\n乙2：いるか どうか 分かりません。", "りさんは まだ かいしゃに います。"),
      dialogueItem("l23-p1-a4-q8", "8", "来週 暇です。", "甲：来週 暇ですか。\n乙1：さあ、暇か 暇では ないか 分かりません。\n乙2：暇か どうか 分かりません。", "らいしゅう ひまです。")
    ]
  },
  {
    id: "l23-p1-a5",
    section: "practice_1",
    order: 5,
    title: "仿照例句进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [],
    layout: [
      { type: "example", content: { label: "[例1]", before: "この 仕事は いつ 終わりますか／分かりません", beforeKana: "この しごとは いつ おわりますか／わかりません", after: [text("この 仕事が いつ 終わるか 分かりません。")], afterKana: "この しごとが いつ おわるか わかりません。" } },
      { type: "example", content: { label: "[例2]", before: "北京へ 帰りますか／分かりません", beforeKana: "ペキンへ かえりますか／わかりません", after: [text("北京へ 帰るか どうか 分かりません。")], afterKana: "ペキンへ かえるか どうか わかりません。" } }
    ],
    items: [
      answerItem("l23-p1-a5-q1", "1", "東京駅まで 何で 行きますか／分かりません", "東京駅まで 何で 行くか 分かりません。", { promptKana: "とうきょうえきまで なんで いきますか／わかりません" }),
      answerItem("l23-p1-a5-q2", "2", "書類を どこに 置きましたか／忘れました", "書類を どこに 置いたか 忘れました。", { promptKana: "しょるいを どこに おきましたか／わすれました" }),
      answerItem("l23-p1-a5-q3", "3", "李さんは いつ 中国へ 帰りますか／知って いますか", "李さんが いつ 中国へ 帰るか 知って いますか。", { promptKana: "りさんは いつ ちゅうごくへ かえりますか／しって いますか" }),
      answerItem("l23-p1-a5-q4", "4", "間違いが ありませんか／もう 一度 見て ください", "間違いが あるか どうか、もう 一度 見て ください。", { promptKana: "まちがいが ありませんか／もう いちど みて ください" }),
      answerItem("l23-p1-a5-q5", "5", "窓を 閉めましたか／確かめて ください", "窓を 閉めたか どうか 確かめて ください。", { promptKana: "まどを しめましたか／たしかめて ください" }),
      answerItem("l23-p1-a5-q6", "6", "仕事が 終わりましたか／小野さんに 聞いて ください", "仕事が 終わったか どうか 小野さんに 聞いて ください。", { promptKana: "しごとが おわりましたか／おのさんに きいて ください" })
    ]
  },
  {
    id: "l23-p1-a6",
    section: "practice_1",
    order: 6,
    title: "边看图边听录音，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 6),
      label: "第23课 练习I-6",
      transcript: {
        text: "小野さんが何時に来るか知っていますか。はい、8時に来ます。小野さんの家がどこにあるか知っていますか。はい、横浜にあります。吉田さんが昨日の昼、何を食べたか知っていますか。はい、そばを食べました。田中さんの車がいくらだったか知っていますか。はい、10万円でした。",
        source: "asr",
        segments: [
          { itemNumber: "1", text: "小野さんの家がどこにあるか知っていますか。はい、横浜にあります。" },
          { itemNumber: "2", text: "吉田さんが昨日の昼、何を食べたか知っていますか。はい、そばを食べました。" },
          { itemNumber: "3", text: "田中さんの車がいくらだったか知っていますか。はい、10万円でした。" }
        ]
      }
    },
    assets: [
      { id: "l23-p1-a6-listening-picture", kind: "exercise_image", imagePath: exerciseImage("book1_lesson23_1_6.png") }
    ],
    displayAssets: ["l23-p1-a6-listening-picture"],
    layout: [
      { type: "example", content: { label: "[例]", before: "小野さんが 何時に 来るか 知って いますか。", beforeKana: "おのさんが なんじに くるか しって いますか。", after: [text("はい、8時に 来ます。")], afterKana: "はい、はちじに きます。" } }
    ],
    items: [
      answerItem("l23-p1-a6-q1", "1", "听录音，回答对应问题。", "はい、横浜に あります。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l23-p1-a6-q2", "2", "听录音，回答对应问题。", "はい、そばを 食べました。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l23-p1-a6-q3", "3", "听录音，回答对应问题。", "はい、10万円でした。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint })
    ]
  },
  {
    id: "l23-p2-a1",
    section: "practice_2",
    order: 1,
    title: "仿照例句，连接正确答案。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    assets: [],
    layout: [{ type: "example", content: { label: "[例]", before: "いつ 行くか", beforeKana: "いつ いくか", after: [text("どうか 分かりません。", { kana: "どうか わかりません。" })] } }],
    items: [
      choiceItem("l23-p2-a1-q1", "1", "土曜日に 行く ことが できるか", ["douka"], { promptKana: "どようびに いく ことが できるか", choices: connectChoices, answerSource: "prompt" }),
      choiceItem("l23-p2-a1-q2", "2", "この 本が 図書館に あるか", ["douka"], { promptKana: "この ほんが としょかんに あるか", choices: connectChoices, answerSource: "prompt" }),
      choiceItem("l23-p2-a1-q3", "3", "来週 出張するか", ["douka"], { promptKana: "らいしゅう しゅっちょうするか", choices: connectChoices, answerSource: "prompt" }),
      choiceItem("l23-p2-a1-q4", "4", "だれが 来るか", ["wakari"], { promptKana: "だれが くるか", choices: connectChoices, answerSource: "prompt" })
    ]
  },
  {
    id: "l23-p2-a2",
    section: "practice_2",
    order: 2,
    title: "听录音，在正确的答案上画○。",
    instruction: "",
    interaction: "multi_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 2),
      label: "第23课 练习II-2",
      transcript: {
        text: "小野さんはビールを飲んだり、歌を歌ったりしました。焼き鳥を全然食べませんでした。李さんは歌が好きですが、歌いませんでした。焼き鳥を食べたり、ビールを飲んだりしていました。長島さんは全然ビールを飲みませんでした。焼き鳥を食べてから、すぐ帰りました。森さんはビールを飲んだり、焼き鳥を食べたり、歌を歌ったりしました。とてもにぎやかでした。",
        source: "asr",
        segments: [
          { itemNumber: "1", speaker: "森", text: "ビールを飲んだり、焼き鳥を食べたり、歌を歌ったりしました。" },
          { itemNumber: "2", speaker: "李", text: "焼き鳥を食べたり、ビールを飲んだりしていました。歌いませんでした。" },
          { itemNumber: "3", speaker: "長島", text: "全然ビールを飲みませんでした。焼き鳥を食べてから、すぐ帰りました。" }
        ],
        confidenceNote: "ASR 中「焼き鳥を全然ためませんでした」は结合表格选项校正为「焼き鳥を全然食べませんでした」。"
      }
    },
    assets: [
      { id: "l23-p2-a2-listening-table", kind: "exercise_image", imagePath: exerciseImage("book1_lesson23_2_2.png") }
    ],
    displayAssets: ["l23-p2-a2-listening-table"],
    layout: [
      { type: "example", content: { label: "[例]", before: "小野", beforeKana: "おの", after: [text("ビール、カラオケ")], afterKana: "ビール、カラオケ" } }
    ],
    items: [
      choiceItem("l23-p2-a2-q1", "1", "森", ["beer", "karaoke", "yakitori"], { promptKana: "もり", choices: tableChoices, multi: true }),
      choiceItem("l23-p2-a2-q2", "2", "李", ["beer", "yakitori"], { promptKana: "り", choices: tableChoices, multi: true }),
      choiceItem("l23-p2-a2-q3", "3", "長島", ["yakitori"], { promptKana: "ながしま", choices: tableChoices, multi: true })
    ]
  },
  {
    id: "l23-p2-a3",
    section: "practice_2",
    order: 3,
    title: "在（　）中填入适当的词语。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: completionHint,
    assets: [],
    layout: [
      { type: "example", content: { label: "[例]", before: "休みの 日は、午後、散歩（したり）買い物に（行ったり）します。", beforeKana: "やすみの ひは、ごご、さんぽ（したり）かいものに（いったり）します。", after: [text("したり／行ったり")], afterKana: "したり／いったり" } }
    ],
    items: [
      blankItem("l23-p2-a3-q1", "1", [text("社長は 何時ごろ 会社に 来ますか。\n一日に よって（"), blank("answer"), text("）遅かったりです。")], { answer: "早かったり" }, { promptKana: "しゃちょうは なんじごろ かいしゃに きますか。\nひに よって（　）おそかったりです。" }),
      blankItem("l23-p2-a3-q2", "2", [text("朝ご飯は パンですか、ご飯ですか。\nパンだったり（"), blank("answer"), text("）です。")], { answer: "ご飯だったり" }, { promptKana: "あさごはんは パンですか、ごはんですか。\nパンだったり（　）です。" }),
      blankItem("l23-p2-a3-q3", "3", [text("値段は 季節に よって 高かったり（"), blank("answer"), text("）です。")], { answer: "安かったり" }, { promptKana: "ねだんは きせつに よって たかかったり（　）です。" })
    ]
  },
  {
    id: "l23-p2-a4",
    section: "practice_2",
    order: 4,
    title: "从□中选择适当的词语，变成适当的形式填入（　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    assets: [
      { id: "l23-p2-a4-word-bank", kind: "exercise_image", imagePath: exerciseImage("book1_lesson23_2_4.png") }
    ],
    displayAssets: ["l23-p2-a4-word-bank"],
    layout: [{ type: "word_bank", words: ["来ます", "います", "ありません", "始まります"].map((word) => text(word)) }],
    items: [
      blankItem("l23-p2-a4-q1", "1", [text("展覧会が いつから（"), blank("answer"), text("）か 分かりません。")], { answer: "始まる" }, { promptKana: "てんらんかいが いつから（　）か わかりません。", expectedUnit: "word" }),
      blankItem("l23-p2-a4-q2", "2", [text("この 書類に 間違いが あるか（"), blank("answer"), text("）か 確かめて ください。")], { answer: "ない" }, { promptKana: "この しょるいに まちがいが あるか（　）か たしかめて ください。", expectedUnit: "word" }),
      blankItem("l23-p2-a4-q3", "3", [text("李さんは どこに いますか。——さあ、どこに（"), blank("answer"), text("）か 分かりません。")], { answer: "いる" }, { promptKana: "りさんは どこに いますか。さあ、どこに（　）か わかりません。", expectedUnit: "word" })
    ]
  },
  {
    id: "l23-p2-a5",
    section: "practice_2",
    order: 5,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [],
    layout: [],
    items: [
      answerItem("l23-p2-a5-q1", "1", "请告诉我钥匙在哪儿。", "かぎが どこに あるか 教えて ください。", { acceptableAlternatives: ["かぎが どこに あるかを 教えて ください。"] }),
      answerItem("l23-p2-a5-q2", "2", "我今年夏天去不去北京，还不知道。", "わたしは 今年の 夏、北京へ 行くか どうか 分かりません。", { acceptableAlternatives: ["今年の 夏、北京へ 行くか どうか 分かりません。"] }),
      answerItem("l23-p2-a5-q3", "3", "周末滑了滑冰，打了打保龄球。", "週末、スケートを したり、ボーリングを したり しました。", { acceptableAlternatives: ["週末に スケートを したり、ボーリングを したり しました。"] })
    ]
  }
];

export const lesson23Practice: LessonPractice = {
  lessonId: "lesson23",
  title: "第23课 休みの 日、散歩したり 買い物に 行ったり します",
  sourcePages: [
    { pageNo: 278, imagePath: page(278) },
    { pageNo: 279, imagePath: page(279) },
    { pageNo: 280, imagePath: page(280) }
  ],
  activities
};
