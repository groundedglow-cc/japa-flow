import type { ExampleBlock, InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const page = (pageNo: number) => `../course-assets/by-lesson/lesson16/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit4/lesson16/Exe${exerciseNo}_${order}.mp3`;
const readings: Record<string, string> = {
  "東京大学": "とうきょうだいがく", "旅行会社": "りょこうがいしゃ", "営業部": "えいぎょうぶ", "中国人": "ちゅうごくじん", "韓国人": "かんこくじん", "日本人": "にほんじん", "オーストラリア人": "オーストラリアじん", "フランス人": "フランスじん", "フランス製": "フランスせい", "中国製": "ちゅうごくせい", "日本語": "にほんご", "中国語": "ちゅうごくご", "結婚": "けっこん", "親切": "しんせつ", "元気": "げんき", "安全": "あんぜん", "天気": "てんき", "試験": "しけん", "問題": "もんだい", "生活": "せいかつ", "全然": "ぜんぜん", "若くて": "わかくて", "広くて": "ひろくて", "多くて": "おおくて", "明るくて": "あかるくて", "短くて": "みじかくて", "高くて": "たかくて", "新しくて": "あたらしくて", "大きかった": "おおきかった", "おいしくて": "おいしくて", "白くて": "しろくて", "黒くて": "くろくて", "小さい": "ちいさい", "大切な": "たいせつな", "よくて": "よくて", "明るい": "あかるい", "短い": "みじかい", "暖かい": "あたたかい", "便利": "べんり", "緑": "みどり", "多い": "おおい", "静か": "しずか", "狭い": "せまい", "暗い": "くらい", "若い": "わかい", "高い": "たかい", "大きい": "おおきい", "新しい": "あたらしい", "古い": "ふるい", "安い": "やすい", "難しい": "むずかしい", "楽しい": "たのしい", "忙しい": "いそがしい", "広い": "ひろい", "長い": "ながい", "白い": "しろい", "黒い": "くろい", "青い": "あおい", "赤い": "あかい", "上手": "じょうず", "社員": "しゃいん", "研修生": "けんしゅうせい", "課長": "かちょう", "学生": "がくせい", "大学": "だいがく", "先生": "せんせい", "社長": "しゃちょう", "住所": "じゅうしょ", "事務所": "じむしょ", "電話": "でんわ", "横浜": "よこはま", "昨日": "きのう", "部屋": "へや", "料理": "りょうり", "複雑": "ふくざつ", "勉強": "べんきょう", "書類": "しょるい", "大切": "たいせつ", "水筒": "すいとう", "お菓子": "おかし", "財布": "さいふ", "写真": "しゃしん", "新聞": "しんぶん", "車": "くるま", "家": "いえ", "庭": "にわ", "海": "うみ", "頭": "あたま", "背": "せ", "髪": "かみ", "脚": "あし", "窓": "まど", "革": "かわ", "布": "ぬの", "中": "なか", "何": "なに", "お金": "おかね", "3か月": "さんかげつ", "3年": "さんねん", "8歳": "はっさい", "4時": "よじ", "東京": "とうきょう", "日本": "にほん", "今": "いま", "人": "ひと", "所": "ところ", "国": "くに", "女の子": "おんなのこ", "子": "こ", "物": "もの", "森": "もり", "李": "り", "小野": "おの", "田中": "たなか", "佐藤": "さとう", "中村": "なかむら", "吉田": "よしだ", "王": "おう", "持ちます": "もちます", "持って": "もって", "知ります": "しります", "知って": "しって", "住みます": "すみます", "住んで": "すんで", "買いました": "かいました", "帰りました": "かえりました", "読みます": "よみます", "読んで": "よんで", "聞いて": "きいて", "撮って": "とって", "使って": "つかって", "借りても": "かりても", "行きました": "いきました", "行き": "いき", "来た": "きた", "来ません": "きません", "見て": "みて", "住ん": "すん", "持っ": "もっ", "知っ": "しっ", "撮っ": "とっ", "結婚し": "けっこんし", "訳して": "やくして", "案内して": "あんないして", "入って": "はいって", "送って": "おくって", "買いに": "かいに"
};
const kana = (value: string) => {
  const converted = Object.keys(readings).sort((a, b) => b.length - a.length).reduce((result, key) => result.replaceAll(key, readings[key]), value);
  return /[\u3400-\u9fff々]/.test(converted) ? undefined : converted;
};
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, kana: options.kana || kana(value), ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
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
  promptKana: options.promptKana || (typeof prompt === "string" ? kana(prompt) : undefined),
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
  promptKana: options.promptKana || kana(prompt),
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
  promptKana: options.promptKana || (typeof prompt === "string" ? kana(prompt) : undefined),
  instruction: "",
  answerSource: options.answerSource || "prompt",
  responseScope: options.responseScope || "phrase_only",
  responseScopeHint: options.responseScopeHint,
  inputSlots: shortSlots(Object.keys(answers), options.expectedUnit),
  answer: { slotValues: answers }
});

const choiceItem = (
  id: string,
  number: string,
  prompt: string,
  choices: { id: string; label: string }[],
  answerChoiceId: string,
  promptKana?: string
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana: promptKana || kana(prompt),
  instruction: "",
  answerSource: "prompt",
  responseScope: "choice_only",
  choices,
  answer: { choiceIds: [answerChoiceId] }
});

const trueFalseItem = (id: string, number: string, prompt: string, value: boolean, promptKana?: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana: promptKana || kana(prompt),
  instruction: "",
  answerSource: "audio",
  responseScope: "boolean_only",
  choices: [
    { id: "true", label: "○" },
    { id: "false", label: "×" }
  ],
  answer: { boolean: value, choiceIds: [value ? "true" : "false"] }
});

const teImasuChoices = [
  { id: "ongoing", label: "① 动作正在进行" },
  { id: "state", label: "② 结果状态" }
];

const activities: PracticeActivity[] = [
  {
    id: "l16-p1-a1",
    section: "practice_1",
    order: 1,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: "按对应例句写出回答句或完整句子。",
    layout: [],
    itemGroups: [
      {
        id: "l16-p1-a1-g1",
        title: "[例1]",
        example: {
          label: "[例1]",
          before: "李さんは どんな 人ですか。（若い／元気）",
          after: [text("若くて 元気な 人です。")]
        },
        items: [
          answerItem("l16-p1-a1-q1", "1", "明るい／親切", "明るくて 親切な 人です。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
          answerItem("l16-p1-a1-q2", "2", "髪が 短い／きれい", "髪が 短くて きれいな 人です。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
          answerItem("l16-p1-a1-q3", "3", "おもしろい／にぎやか", "おもしろくて にぎやかな 人です。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
          answerItem("l16-p1-a1-q4", "4", "頭が いい／まじめ", "頭が よくて まじめな 人です。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
          answerItem("l16-p1-a1-q5", "5", "背が 高い／テニスが 上手", "背が 高くて テニスが 上手な 人です。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint })
        ]
      },
      {
        id: "l16-p1-a1-g2",
        title: "[例2]",
        example: {
          label: "[例2]",
          before: "どんな 所ですか。（静か／きれい）",
          after: [text("静かで きれいな 所です。")]
        },
        items: [
          answerItem("l16-p1-a1-q6", "6", "便利／にぎやか", "便利で にぎやかな 所です。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
          answerItem("l16-p1-a1-q7", "7", "緑が 多い／静か", "緑が 多くて 静かな 所です。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
          answerItem("l16-p1-a1-q8", "8", "狭い／暗い", "狭くて 暗い 所です。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
          answerItem("l16-p1-a1-q9", "9", "にぎやか／おもしろい", "にぎやかで おもしろい 所です。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
          answerItem("l16-p1-a1-q10", "10", "海が きれい／暖かい", "海が きれいで 暖かい 所です。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint })
        ]
      },
      {
        id: "l16-p1-a1-g3",
        title: "[例3]",
        example: {
          label: "[例3]",
          before: "スミスさん／旅行会社の 社員／営業部の 部長",
          after: [text("スミスさんは 旅行会社の 社員で、営業部の 部長です。")]
        },
        items: [
          answerItem("l16-p1-a1-q11", "11", "李さん／中国人／JC企画の 社員", "李さんは 中国人で、JC企画の 社員です。", { responseScope: "sentence_only" }),
          answerItem("l16-p1-a1-q12", "12", "キムさん／韓国人／研修生", "キムさんは 韓国人で、研修生です。", { responseScope: "sentence_only" }),
          answerItem("l16-p1-a1-q13", "13", "ジョンソンさん／オーストラリア人／東京大学の 学生", "ジョンソンさんは オーストラリア人で、東京大学の 学生です。", { responseScope: "sentence_only" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l16-p1-a2",
    section: "practice_1",
    order: 2,
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
          before: "旅行／天気が いい／楽しい",
          after: [text("甲：旅行は どうでしたか。\n乙：天気が よくて、楽しかったです。")]
        }
      }
    ],
    items: [
      dialogueItem("l16-p1-a2-q1", "1", "社長の 家／新しい／大きい", "甲：社長の 家は どうでしたか。\n乙：新しくて、大きかったです。"),
      dialogueItem("l16-p1-a2-q2", "2", "パーティー／にぎやか／おもしろい", "甲：パーティーは どうでしたか。\n乙：にぎやかで、おもしろかったです。"),
      dialogueItem("l16-p1-a2-q3", "3", "試験／問題が 多い／難しい", "甲：試験は どうでしたか。\n乙：問題が 多くて、難しかったです。"),
      dialogueItem("l16-p1-a2-q4", "4", "あの ホテル／料理が おいしい／静か", "甲：あの ホテルは どうでしたか。\n乙：料理が おいしくて、静かでした。")
    ]
  },
  {
    id: "l16-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句替换画线部分进行练习。",
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
          before: "日本／安全／物が 高い",
          after: [text("甲：日本は どうですか。\n乙：安全ですが、物が 高いです。")]
        }
      }
    ],
    items: [
      dialogueItem("l16-p1-a3-q1", "1", "新しい 家／静か／不便", "甲：新しい 家は どうですか。\n乙：静かですが、不便です。"),
      dialogueItem("l16-p1-a3-q2", "2", "この ネクタイ／安い／デザインが よく ない", "甲：この ネクタイは どうですか。\n乙：安いですが、デザインが よく ないです。"),
      dialogueItem("l16-p1-a3-q3", "3", "日本の 生活／忙しい／楽しい", "甲：日本の 生活は どうですか。\n乙：忙しいですが、楽しいです。"),
      dialogueItem("l16-p1-a3-q4", "4", "あの ホテル／古い／サービスが いい", "甲：あの ホテルは どうですか。\n乙：古いですが、サービスが いいです。")
    ]
  },
  {
    id: "l16-p1-a4",
    section: "practice_1",
    order: 4,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: "按例句写出田中さん和佐藤さん两行句子。",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "東京に 住みます",
          after: [text("田中さんは 東京に 住んで います。\n佐藤さんは 東京に 住んで いません。")]
        }
      }
    ],
    items: [
      answerItem("l16-p1-a4-q1", "1", "結婚します", "田中さんは 結婚して います。\n佐藤さんは 結婚して いません。", { multiline: true, rows: 3, responseScope: "custom", responseScopeHint: "写出田中さん和佐藤さん两行句子。" }),
      answerItem("l16-p1-a4-q2", "2", "大きい 車を 持ちます", "田中さんは 大きい 車を 持って います。\n佐藤さんは 大きい 車を 持って いません。", { multiline: true, rows: 3, responseScope: "custom", responseScopeHint: "写出田中さん和佐藤さん两行句子。" }),
      answerItem("l16-p1-a4-q3", "3", "小野さんを 知ります", "田中さんは 小野さんを 知って います。\n佐藤さんは 小野さんを 知って いません。", { multiline: true, rows: 3, responseScope: "custom", responseScopeHint: "写出田中さん和佐藤さん两行句子。" })
    ]
  },
  {
    id: "l16-p1-a5",
    section: "practice_1",
    order: 5,
    title: "仿照例句连接两个句子。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "3か月 パソコンを 勉強しました。まだ あまり できません。",
          after: [text("3か月 パソコンを 勉強しましたが、まだ あまり できません。")]
        }
      }
    ],
    items: [
      answerItem("l16-p1-a5-q1", "1", "王さんは 日本に もう 3年 住んで います。日本語が まだ 上手では ありません。", "王さんは 日本に もう 3年 住んで いますが、日本語が まだ 上手では ありません。", { responseScope: "sentence_only" }),
      answerItem("l16-p1-a5-q2", "2", "あの 女の 子は まだ 8歳です。テニスが とても 上手です。", "あの 女の 子は まだ 8歳ですが、テニスが とても 上手です。", { responseScope: "sentence_only" }),
      answerItem("l16-p1-a5-q3", "3", "まだ 4時です。森さんは もう 帰りました。", "まだ 4時ですが、森さんは もう 帰りました。", { responseScope: "sentence_only" }),
      answerItem("l16-p1-a5-q4", "4", "昨日 ビールを たくさん 買いました。もう 全然 ありません。", "昨日 ビールを たくさん 買いましたが、もう 全然 ありません。", { responseScope: "sentence_only" }),
      answerItem("l16-p1-a5-q5", "5", "森さんは さっき そこに いました。もう いません。", "森さんは さっき そこに いましたが、もう いません。", { responseScope: "sentence_only" })
    ]
  },
  {
    id: "l16-p1-a6",
    section: "practice_1",
    order: 6,
    title: "看图，仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    assets: [
      { id: "l16-p1-a6-wallet-bag-picture-prompts", kind: "exercise_image", imagePath: exerciseImage("book1_lesson16_1_6.png") }
    ],
    displayAssets: ["l16-p1-a6-wallet-bag-picture-prompts"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "財布／フランス製／革／お金",
          after: [text("甲：どんな 財布ですか。\n乙：フランス製で 革の 財布です。\n甲：中は 何ですか。\n乙：お金です。")]
        }
      }
    ],
    items: [
      dialogueItem("l16-p1-a6-q1", "1", "財布／白い／小さい／家の かぎ", "甲：どんな 財布ですか。\n乙：白くて 小さい 財布です。\n甲：中は 何ですか。\n乙：家の かぎです。", { rows: 5 }),
      dialogueItem("l16-p1-a6-q2", "2", "かばん／黒い／大きい／大切な 書類", "甲：どんな かばんですか。\n乙：黒くて 大きい かばんです。\n甲：中は 何ですか。\n乙：大切な 書類です。", { rows: 5 }),
      dialogueItem("l16-p1-a6-q3", "3", "かばん／中国製／布／水筒と お菓子", "甲：どんな かばんですか。\n乙：中国製で 布の かばんです。\n甲：中は 何ですか。\n乙：水筒と お菓子です。", { rows: 5 })
    ]
  },
  {
    id: "l16-p1-a7",
    section: "practice_1",
    order: 7,
    title: "听录音，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 7),
      label: "第16课 练习I-7",
      transcript: {
        text: "小野さんは どんな 人ですか。親切。楽しい 人。親切で 楽しい 人です。中国は どんな 国ですか。人が 多い。大きい 国。人が 多くて 大きい 国です。李さんは どんな 人ですか。若い。元気な 人。若くて 元気な 人です。吉田さんは どんな 人ですか。JC企画の 課長。日本人。JC企画の 課長で、日本人です。中村さんの 家は どんな 家ですか。庭が 広い。とても 大きい 家。庭が 広くて とても 大きい 家です。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按题面人工整理。",
        segments: [
          { itemNumber: "例", text: "小野さんは どんな 人ですか。親切。楽しい 人。親切で 楽しい 人です。" },
          { itemNumber: "1", text: "中国は どんな 国ですか。人が 多い。大きい 国。人が 多くて 大きい 国です。" },
          { itemNumber: "2", text: "李さんは どんな 人ですか。若い。元気な 人。若くて 元気な 人です。" },
          { itemNumber: "3", text: "吉田さんは どんな 人ですか。JC企画の 課長。日本人。JC企画の 課長で、日本人です。" },
          { itemNumber: "4", text: "中村さんの 家は どんな 家ですか。庭が 広い。とても 大きい 家。庭が 広くて とても 大きい 家です。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "小野さんは、どんな 人ですか。（親切／楽しい 人）",
          after: [text("親切で 楽しい 人です。")]
        }
      }
    ],
    items: [
      answerItem("l16-p1-a7-q1", "1", "人が 多い／大きい 国", "人が 多くて 大きい 国です。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l16-p1-a7-q2", "2", "若い／元気な 人", "若くて 元気な 人です。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l16-p1-a7-q3", "3", "JC企画の 課長／日本人", "JC企画の 課長で、日本人です。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l16-p1-a7-q4", "4", "庭が 広い／とても 大きい 家", "庭が 広くて とても 大きい 家です。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint })
    ]
  },
  {
    id: "l16-p1-a8",
    section: "practice_1",
    order: 8,
    title: "听录音，仿照例句用（　　）中的词语回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 8),
      label: "第16课 练习I-8",
      transcript: {
        text: "日本語の 勉強は どうですか。おもしろい。楽しい。おもしろくて 楽しいです。パソコンの 勉強は どうですか。複雑。難しい。複雑で 難しいです。新しい 部屋は どうですか。きれい。静か。きれいで 静かです。あの ホテルは どうですか。明るい。きれい。明るくて きれいです。駅前の レストランは どうでしたか。料理が おいしい。安い。料理が おいしくて 安かったです。旅行は どうでしたか。天気が いい。おもしろい。天気が よくて おもしろかったです。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按题面人工整理，末题按录音提问和题面词语补全。",
        segments: [
          { itemNumber: "例", text: "日本語の 勉強は どうですか。おもしろい。楽しい。おもしろくて 楽しいです。" },
          { itemNumber: "1", text: "パソコンの 勉強は どうですか。複雑。難しい。複雑で 難しいです。" },
          { itemNumber: "2", text: "新しい 部屋は どうですか。きれい。静か。きれいで 静かです。" },
          { itemNumber: "3", text: "あの ホテルは どうですか。明るい。きれい。明るくて きれいです。" },
          { itemNumber: "4", text: "駅前の レストランは どうでしたか。料理が おいしい。安い。料理が おいしくて 安かったです。" },
          { itemNumber: "5", text: "旅行は どうでしたか。天気が いい。おもしろい。天気が よくて おもしろかったです。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "日本語の 勉強は どうですか。（おもしろい／楽しい）",
          after: [text("おもしろくて 楽しいです。")]
        }
      }
    ],
    items: [
      answerItem("l16-p1-a8-q1", "1", "複雑／難しい", "複雑で 難しいです。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l16-p1-a8-q2", "2", "きれい／静か", "きれいで 静かです。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l16-p1-a8-q3", "3", "明るい／きれい", "明るくて きれいです。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l16-p1-a8-q4", "4", "料理が おいしい／安い", "料理が おいしくて 安かったです。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint }),
      answerItem("l16-p1-a8-q5", "5", "天気が いい／おもしろい", "天気が よくて おもしろかったです。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint })
    ]
  },
  {
    id: "l16-p2-a1",
    section: "practice_2",
    order: 1,
    title: "从□中选择适当的词语填入（　　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: completionHint,
    layout: [
      { type: "word_bank", words: [text("広いです"), text("大きいです"), text("フランス人です"), text("きれいです")] },
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("ホテルの 部屋は（"), blank("example"), text("）明るいです。")],
          after: [text("広くて")]
        }
      }
    ],
    items: [
      blankItem("l16-p2-a1-q1", "1", [text("日本は（"), blank("answer"), text("）安全です。")], { answer: "きれいで" }, { responseScopeHint: completionHint }),
      blankItem("l16-p2-a1-q2", "2", [text("窓が（"), blank("answer"), text("）明るいです。")], { answer: "大きくて" }, { responseScopeHint: completionHint }),
      blankItem("l16-p2-a1-q3", "3", [text("デュポンさんは（"), blank("answer"), text("）、大学の 先生です。")], { answer: "フランス人で" }, { responseScopeHint: completionHint })
    ]
  },
  {
    id: "l16-p2-a2",
    section: "practice_2",
    order: 2,
    title: "在（　　）中填入一个平假名。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("森さんは 脚（"), blank("example"), text("）長いです。")],
          after: [text("が")]
        }
      }
    ],
    items: [
      blankItem("l16-p2-a2-q1", "1", [text("キムさんは 韓国人（"), blank("answer"), text("）、JC企画の 研修生です。")], { answer: "で" }, { responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" }),
      blankItem("l16-p2-a2-q2", "2", [text("ここで 写真を 撮って（"), blank("answer"), text("）いけません。")], { answer: "は" }, { responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" }),
      blankItem("l16-p2-a2-q3", "3", [text("佐藤さんと キムさんは 結婚して います（"), blank("answer"), text("）、いっしょに 住んで いません。")], { answer: "が" }, { responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" }),
      blankItem("l16-p2-a2-q4", "4", [text("これを 使って（"), blank("answer"), text("）いいですか。——はい、どうぞ。")], { answer: "も" }, { responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "particle" })
    ]
  },
  {
    id: "l16-p2-a3",
    section: "practice_2",
    order: 3,
    title: "确认①②画线部分的“～て います”的用法，在（　　）中填入数字①或②。",
    instruction: "",
    interaction: "single_choice",
    answerUnit: "choice",
    responseScope: "choice_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "テレビを 見て います。",
          after: [text("① 动作正在进行")]
        }
      },
      {
        type: "text",
        text: [text("① 小野さんは 今 新聞を 読んで います。／② 森さんは 車を 持って います。")]
      }
    ],
    items: [
      choiceItem("l16-p2-a3-q1", "1", "森さんの 住所を 知って います。", teImasuChoices, "state"),
      choiceItem("l16-p2-a3-q2", "2", "ラジオで ニュースを 聞いて います。", teImasuChoices, "ongoing"),
      choiceItem("l16-p2-a3-q3", "3", "森さんは 事務所で 電話を かけて います。", teImasuChoices, "ongoing"),
      choiceItem("l16-p2-a3-q4", "4", "小野さんは 横浜に 住んで います。", teImasuChoices, "state")
    ]
  },
  {
    id: "l16-p2-a4",
    section: "practice_2",
    order: 4,
    title: "听录音，与录音内容一致的在（　　）中画○，不一致的画×。",
    instruction: "",
    interaction: "true_false",
    answerUnit: "boolean",
    responseScope: "boolean_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 4),
      label: "第16课 练习II-4",
      transcript: {
        text: "昨日、ネクタイを 買いに デパートへ 行きました。シルクの 青い ネクタイは 4,000円でした。フランス製の 赤い ネクタイは 5,000円でした。私は 赤いのが 好きでしたが、安い ほうを 買いました。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按题面人工整理。",
        segments: [
          { itemNumber: "例", text: "昨日、ネクタイを 買いに デパートへ 行きました。" },
          { itemNumber: "1", text: "シルクの 青い ネクタイは 4,000円でした。" },
          { itemNumber: "2", text: "シルクの 青い ネクタイは 4,000円でした。" },
          { itemNumber: "3", text: "フランス製の 赤い ネクタイは 5,000円でした。" },
          { itemNumber: "4", text: "私は 赤いのが 好きでしたが、安い ほうを 買いました。" }
        ]
      }
    },
    assets: [
      { id: "l16-p2-a4-necktie-shop-picture", kind: "exercise_image", imagePath: exerciseImage("book1_lesson16_2_4.png") }
    ],
    displayAssets: ["l16-p2-a4-necktie-shop-picture"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "昨日 デパートへ 行きました。",
          after: [text("○")]
        }
      }
    ],
    items: [
      trueFalseItem("l16-p2-a4-q1", "1", "青い ネクタイは 5,000円です。", false),
      trueFalseItem("l16-p2-a4-q2", "2", "青い ネクタイは シルクです。", true),
      trueFalseItem("l16-p2-a4-q3", "3", "赤い ネクタイは フランス製です。", true),
      trueFalseItem("l16-p2-a4-q4", "4", "赤い ネクタイを 買いました。", false)
    ]
  },
  {
    id: "l16-p2-a5",
    section: "practice_2",
    order: 5,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l16-p2-a5-q1", "1", "森先生有辆车。", "森さんは 車を 持って います。", { answerSource: "prompt", responseScope: "sentence_only" }),
      answerItem("l16-p2-a5-q2", "2", "这房间又宽敞又明亮。", "この 部屋は 広くて 明るいです。", { answerSource: "prompt", responseScope: "sentence_only" }),
      answerItem("l16-p2-a5-q3", "3", "（我）学了 3 个月电脑，但还不太会用。", "3か月 パソコンを 勉強しましたが、まだ あまり できません。", { answerSource: "prompt", responseScope: "sentence_only" })
    ]
  }
];

const withExampleKana = (example: ExampleBlock): ExampleBlock => ({
  ...example,
  beforeKana: example.beforeKana || kana(example.before || "") || undefined
});

const withPracticeKana = (activity: PracticeActivity): PracticeActivity => ({
  ...activity,
  layout: activity.layout.map((block) => block.type === "example" ? { ...block, content: withExampleKana(block.content) } : block),
  itemGroups: activity.itemGroups?.map((group) => ({ ...group, example: withExampleKana(group.example) }))
});

export const lesson16Practice: LessonPractice = {
  lessonId: "lesson16",
  title: "第16課 ホテルの 部屋は 広くて 明るいです",
  sourcePages: [
    { pageNo: 196, imagePath: page(196) },
    { pageNo: 197, imagePath: page(197) },
    { pageNo: 198, imagePath: page(198) }
  ],
  activities: activities.map(withPracticeKana)
};
