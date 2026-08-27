import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson28/page${pageNo}.webp`;
const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit7/lesson28/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const sentenceSlot = (placeholder = "输入完整句子"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const dialogueSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows: 5, placeholder: "输入完整对话" }];
const wordSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "word", width: "medium", placeholder: "输入答案" }];
const booleanSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "boolean", width: "short", placeholder: "○ / ×" }];

const answerItem = (id: string, number: string, prompt: string, answer: string, options: Partial<PracticeItem> = {}): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana: options.promptKana,
  instruction: "",
  answerSource: "example_transform",
  responseScope: "sentence_only",
  inputSlots: sentenceSlot(),
  answer: { slotValues: { answer } },
  ...options
});

const blankItem = (id: string, number: string, prompt: PromptPart[], answer: string, options: Partial<PracticeItem> = {}): PracticeItem => ({
  id,
  number,
  prompt,
  instruction: "",
  answerSource: "prompt",
  responseScope: "word_only",
  responseScopeHint: "只填写括号中的词语。",
  inputSlots: wordSlot(),
  answer: { slotValues: { answer } },
  ...options
});

const multiBlankItem = (id: string, number: string, prompt: PromptPart[], answers: Record<string, string>, choices: Record<string, string[]> = {}): PracticeItem => ({
  id,
  number,
  prompt,
  instruction: "",
  answerSource: "prompt",
  responseScope: "phrase_only",
  responseScopeHint: "按顺序填写括号中的正确答案。",
  inputSlots: Object.keys(answers).map((slotId, index) => ({
    id: slotId,
    expectedUnit: "word",
    width: "short",
    placeholder: "答案",
    label: `第${index + 1}空`,
    choices: (choices[slotId] || []).map((label) => ({ id: `${slotId}-${label}`, label }))
  })),
  answer: { slotValues: answers }
});

const dialogueItem = (id: string, number: string, prompt: string, promptKana: string, answer: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "audio",
  evaluationMode: "exact",
  responseScope: "dialogue_only",
  responseScopeHint: "听录音并仿照例句写出完整会话。",
  inputSlots: dialogueSlot(),
  answer: { slotValues: { answer } },
  renderHint: "dialogue"
});

const listeningBooleanItem = (id: string, number: string, prompt: string, promptKana: string, answer: "○" | "×"): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "audio",
  evaluationMode: "exact",
  responseScope: "boolean_only",
  responseScopeHint: "听录音，输入 ○ 或 ×。",
  inputSlots: booleanSlot(),
  answer: { slotValues: { answer } }
});

const activities: PracticeActivity[] = [
  {
    id: "l28-p1-a1",
    section: "practice_1",
    order: 1,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    itemGroups: [
      {
        id: "l28-p1-a1-g1",
        example: {
          label: "[例1]",
          before: "馬さん／地図",
          beforeKana: "ばさん／ちず",
          after: [text("馬さんはわたしに地図をくれました。", { kana: "ばさんはわたしにちずをくれました。" })],
          afterKana: "ばさんはわたしにちずをくれました。"
        },
        items: [
          answerItem("l28-p1-a1-q1", "1", "姉／ネックレス", "姉はわたしにネックレスをくれました。", { promptKana: "あね／ネックレス" }),
          answerItem("l28-p1-a1-q2", "2", "李さん／本", "李さんはわたしに本をくれました。", { promptKana: "りさん／ほん" }),
          answerItem("l28-p1-a1-q3", "3", "兄／パソコン", "兄はわたしにパソコンをくれました。", { promptKana: "あに／パソコン" }),
          answerItem("l28-p1-a1-q4", "4", "友達／中国のお土産", "友達はわたしに中国のお土産をくれました。", { promptKana: "ともだち／ちゅうごくのおみやげ" })
        ]
      },
      {
        id: "l28-p1-a1-g2",
        example: {
          label: "[例2]",
          before: "北京を案内します",
          beforeKana: "ペキンをあんないします",
          after: [text("森さんは李さんに北京を案内してもらいました。", { kana: "もりさんはりさんにペキンをあんないしてもらいました。" })],
          afterKana: "もりさんはりさんにペキンをあんないしてもらいました。"
        },
        items: [
          answerItem("l28-p1-a1-q5", "5", "有名なレストランを紹介します", "森さんは李さんに有名なレストランを紹介してもらいました。", { promptKana: "ゆうめいなレストランをしょうかいします" }),
          answerItem("l28-p1-a1-q6", "6", "食事をごちそうします", "森さんは李さんに食事をごちそうしてもらいました。", { promptKana: "しょくじをごちそうします" }),
          answerItem("l28-p1-a1-q7", "7", "家族の写真を見せます", "森さんは李さんに家族の写真を見せてもらいました。", { promptKana: "かぞくのしゃしんをみせます" }),
          answerItem("l28-p1-a1-q8", "8", "切符の買い方を教えます", "森さんは李さんに切符の買い方を教えてもらいました。", { promptKana: "きっぷのかいかたをおしえます" })
        ]
      },
      {
        id: "l28-p1-a1-g3",
        example: {
          label: "[例3]",
          before: "森さん／デジカメ／貸します",
          beforeKana: "もりさん／デジカメ／かします",
          after: [text("わたしは森さんにデジカメを貸してあげました。", { kana: "わたしはもりさんにデジカメをかしてあげました。" })],
          afterKana: "わたしはもりさんにデジカメをかしてあげました。"
        },
        items: [
          answerItem("l28-p1-a1-q9", "9", "王さん／自転車／貸します", "わたしは王さんに自転車を貸してあげました。", { promptKana: "おうさん／じてんしゃ／かします" }),
          answerItem("l28-p1-a1-q10", "10", "キムさん／英語／教えます", "わたしはキムさんに英語を教えてあげました。", { promptKana: "キムさん／えいご／おしえます" }),
          answerItem("l28-p1-a1-q11", "11", "田村さん／仕事／紹介します", "わたしは田村さんに仕事を紹介してあげました。", { promptKana: "たむらさん／しごと／しょうかいします" }),
          answerItem("l28-p1-a1-q12", "12", "李さん／パソコン／貸します", "わたしは李さんにパソコンを貸してあげました。", { promptKana: "りさん／パソコン／かします" })
        ]
      },
      {
        id: "l28-p1-a1-g4",
        example: {
          label: "[例4]",
          before: "おいしいお茶／送ります",
          beforeKana: "おいしいおちゃ／おくります",
          after: [text("小野さんがおいしいお茶を送ってくれました。", { kana: "おのさんがおいしいおちゃをおくってくれました。" })],
          afterKana: "おのさんがおいしいおちゃをおくってくれました。"
        },
        items: [
          answerItem("l28-p1-a1-q13", "13", "新鮮な野菜／送ります", "小野さんが新鮮な野菜を送ってくれました。", { promptKana: "しんせんなやさい／おくります" }),
          answerItem("l28-p1-a1-q14", "14", "旅行のお土産／届けます", "小野さんが旅行のお土産を届けてくれました。", { promptKana: "りょこうのおみやげ／とどけます" }),
          answerItem("l28-p1-a1-q15", "15", "日本語／教えます", "小野さんが日本語を教えてくれました。", { promptKana: "にほんご／おしえます" }),
          answerItem("l28-p1-a1-q16", "16", "仕事／遅くまで手伝います", "小野さんが仕事を遅くまで手伝ってくれました。", { promptKana: "しごと／おそくまでてつだいます" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l28-p1-a2",
    section: "practice_1",
    order: 2,
    title: "看图，仿照例句回答提问。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: "只写回答句。",
    assets: [{ id: "l28-p1-a2-picture", kind: "exercise_image", imagePath: exerciseImage("book1_lesson28_1_2.png"), label: "练习I-2 图片" }],
    displayAssets: ["l28-p1-a2-picture"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "① その本、だれがくれましたか。／② その本、だれにもらいましたか。／③ 李さんはだれにあげましたか。",
          beforeKana: "① そのほん、だれがくれましたか。／② そのほん、だれにもらいましたか。／③ りさんはだれにあげましたか。",
          after: [text("① 李さんがくれました。\n② 李さんにもらいました。\n③ わたしにくれました。", { kana: "① りさんがくれました。\n② りさんにもらいました。\n③ わたしにくれました。" })],
          afterKana: "① りさんがくれました。\n② りさんにもらいました。\n③ わたしにくれました。"
        }
      }
    ],
    items: [
      answerItem("l28-p1-a2-q1", "1-①", "その地図、だれが見せてくれましたか。", "李さんが見せてくれました。", { promptKana: "そのちず、だれがみせてくれましたか。", responseScope: "answer_only", responseScopeHint: "只写回答句。" }),
      answerItem("l28-p1-a2-q2", "1-②", "その地図、だれに見せてもらいましたか。", "李さんに見せてもらいました。", { promptKana: "そのちず、だれにみせてもらいましたか。", responseScope: "answer_only", responseScopeHint: "只写回答句。" }),
      answerItem("l28-p1-a2-q3", "1-③", "李さんは地図をだれに見せてあげましたか。", "わたしに見せてくれました。", { promptKana: "りさんはちずをだれにみせてあげましたか。", responseScope: "answer_only", responseScopeHint: "只写回答句。" }),
      answerItem("l28-p1-a2-q4", "2-①", "森さんは自転車をだれに貸してもらいましたか。", "陳さんに貸してもらいました。", { promptKana: "もりさんはじてんしゃをだれにかしてもらいましたか。", responseScope: "answer_only", responseScopeHint: "只写回答句。" }),
      answerItem("l28-p1-a2-q5", "2-②", "陳さんは自転車をだれに貸してあげましたか。", "森さんに貸してあげました。", { promptKana: "ちんさんはじてんしゃをだれにかしてあげましたか。", responseScope: "answer_only", responseScopeHint: "只写回答句。" })
    ]
  },
  {
    id: "l28-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "天ぷらの作り方／教えます／うまくできません",
          beforeKana: "てんぷらのつくりかた／おしえます／うまくできません",
          after: [text("天ぷらの作り方を教えてもらいましたが、うまくできません。", { kana: "てんぷらのつくりかたをおしえてもらいましたが、うまくできません。" })],
          afterKana: "てんぷらのつくりかたをおしえてもらいましたが、うまくできません。"
        }
      }
    ],
    items: [
      answerItem("l28-p1-a3-q1", "1", "コンピュータの部品／交換します／うまく動きません", "コンピュータの部品を交換してもらいましたが、うまく動きません。", { promptKana: "コンピュータのぶひん／こうかんします／うまくうごきません" }),
      answerItem("l28-p1-a3-q2", "2", "中田先生の住所／調べます／分かりませんでした", "中田先生の住所を調べてもらいましたが、分かりませんでした。", { promptKana: "なかたせんせいのじゅうしょ／しらべます／わかりませんでした" }),
      answerItem("l28-p1-a3-q3", "3", "日本語の発音／直します／まだうまくできません", "日本語の発音を直してもらいましたが、まだうまくできません。", { promptKana: "にほんごのはつおん／なおします／まだうまくできません" }),
      answerItem("l28-p1-a3-q4", "4", "大使館の電話番号／教えます／書いたメモをなくしました", "大使館の電話番号を教えてもらいましたが、書いたメモをなくしました。", { promptKana: "たいしかんのでんわばんごう／おしえます／かいたメモをなくしました" })
    ]
  },
  {
    id: "l28-p1-a4",
    section: "practice_1",
    order: 4,
    title: "听录音，仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 4),
      label: "第28课 练习I-4",
      transcript: { source: "asr", text: "1. 鉛筆を貸します。辞書も貸します。ちょっと鉛筆を貸してくれますか。はい。それから辞書も貸してくれませんか。ええ、いいですよ。2. これを5枚コピーします。部長に届けます。ちょっとこれを5枚コピーしてくれますか。はい。それから部長に届けてくれませんか。ええ、いいですよ。3. 1人で作ります。手伝います。1人で作りましたか。いいえ。王さんに手伝ってもらいました。王さんが手伝ってくれたんですか。ええ、そうなんですよ。4. 1人でこの手紙を読みます。訳します。1人でこの手紙を読みましたか。いいえ。王さんに訳してもらいました。王さんが訳してくれたんですか。ええ、そうなんですよ。" }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例1]",
          before: "テレビをつけます／お茶も入れます",
          beforeKana: "テレビをつけます／おちゃもいれます",
          after: [
            text("甲：ちょっとテレビをつけてくれますか。\n乙：はい。\n甲：それから、お茶も入れてくれませんか。\n乙：ええ、いいですよ。", {
              kana: "こう：ちょっとテレビをつけてくれますか。\nおつ：はい。\nこう：それから、おちゃもいれてくれませんか。\nおつ：ええ、いいですよ。"
            })
          ],
          afterKana: "こう：ちょっとテレビをつけてくれますか。\nおつ：はい。\nこう：それから、おちゃもいれてくれませんか。\nおつ：ええ、いいですよ。"
        }
      },
      {
        type: "example",
        content: {
          label: "[例2]",
          before: "1人で帰ります／車で送ります",
          beforeKana: "ひとりでかえります／くるまでおくります",
          after: [
            text("甲：1人で帰りましたか。\n乙：いいえ。王さんに車で送ってもらいました。\n甲：王さんが車で送ってくれたんですか。\n乙：ええ、そうなんですよ。", {
              kana: "こう：ひとりでかえりましたか。\nおつ：いいえ。おうさんにくるまでおくってもらいました。\nこう：おうさんがくるまでおくってくれたんですか。\nおつ：ええ、そうなんですよ。"
            })
          ],
          afterKana: "こう：ひとりでかえりましたか。\nおつ：いいえ。おうさんにくるまでおくってもらいました。\nこう：おうさんがくるまでおくってくれたんですか。\nおつ：ええ、そうなんですよ。"
        }
      }
    ],
    items: [
      dialogueItem("l28-p1-a4-q1", "1", "鉛筆を貸します／辞書も貸します", "えんぴつを かします／じしょも かします", "甲：ちょっと鉛筆を貸してくれますか。\n乙：はい。\n甲：それから、辞書も貸してくれませんか。\n乙：ええ、いいですよ。"),
      dialogueItem("l28-p1-a4-q2", "2", "これを5枚コピーします／部長に届けます", "これを ごまい コピーします／ぶちょうに とどけます", "甲：ちょっとこれを5枚コピーしてくれますか。\n乙：はい。\n甲：それから、部長に届けてくれませんか。\n乙：ええ、いいですよ。"),
      dialogueItem("l28-p1-a4-q3", "3", "1人で作ります／手伝います", "ひとりで つくります／てつだいます", "甲：1人で作りましたか。\n乙：いいえ。王さんに手伝ってもらいました。\n甲：王さんが手伝ってくれたんですか。\n乙：ええ、そうなんですよ。"),
      dialogueItem("l28-p1-a4-q4", "4", "1人でこの手紙を読みます／訳します", "ひとりで このてがみを よみます／やくします", "甲：1人でこの手紙を読みましたか。\n乙：いいえ。王さんに訳してもらいました。\n甲：王さんが訳してくれたんですか。\n乙：ええ、そうなんですよ。")
    ]
  },
  {
    id: "l28-p2-a1",
    section: "practice_2",
    order: 1,
    title: "给正确的答案画○。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    layout: [
      { type: "example", content: { label: "[例]", before: "戴さんがわたし（を・に）空港まで送ってくれました。", beforeKana: "たいさんがわたし（を・に）くうこうまでおくってくれました。", after: [text("を")] } }
    ],
    items: [
      multiBlankItem("l28-p2-a1-q1", "1", [text("父（を・に）パソコンの雑誌（を・に）買ってあげました。", { kana: "ちち（を・に）パソコンのざっし（を・に）かってあげました。" })], { a: "に", b: "を" }, { a: ["を", "に"], b: ["を", "に"] }),
      multiBlankItem("l28-p2-a1-q2", "2", [text("友達（に・が）引っ越し（を・に）手伝ってくれるから、大丈夫です。", { kana: "ともだち（に・が）ひっこし（を・に）てつだってくれるから、だいじょうぶです。" })], { a: "が", b: "を" }, { a: ["に", "が"], b: ["を", "に"] }),
      multiBlankItem("l28-p2-a1-q3", "3", [text("わたしは森さん（が・に）荷物（に・を）持ってもらいました。", { kana: "わたしはもりさん（が・に）にもつ（に・を）もってもらいました。" })], { a: "に", b: "を" }, { a: ["が", "に"], b: ["に", "を"] }),
      multiBlankItem("l28-p2-a1-q4", "4", [text("わたしに来た中国語の手紙を、李さんが訳して（あげました・くれました）。", { kana: "わたしにきたちゅうごくごのてがみを、りさんがやくして（あげました・くれました）。" })], { answer: "くれました" }, { answer: ["あげました", "くれました"] }),
      multiBlankItem("l28-p2-a1-q5", "5", [text("わたしは小野さんに東京を案内して（くれました・もらいました）。", { kana: "わたしはおのさんにとうきょうをあんないして（くれました・もらいました）。" })], { answer: "もらいました" }, { answer: ["くれました", "もらいました"] }),
      multiBlankItem("l28-p2-a1-q6", "6", [text("分からないんですか。じゃあ、教えて（あげましょう・くれませんか）。", { kana: "わからないんですか。じゃあ、おしえて（あげましょう・くれませんか）。" })], { answer: "あげましょう" }, { answer: ["あげましょう", "くれませんか"] })
    ]
  },
  {
    id: "l28-p2-a2",
    section: "practice_2",
    order: 2,
    title: "从框中选择适当的词语填入（ ）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    assets: [{ id: "l28-p2-a2-word-bank", kind: "exercise_image", imagePath: exerciseImage("book1_lesson28_2_2.png"), label: "练习II-2 词框" }],
    displayAssets: ["l28-p2-a2-word-bank"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "あの店の料理は（　）おいしかったですよ。",
          beforeKana: "あのみせのりょうりは（　）おいしかったですよ。",
          after: [text("なかなか")]
        }
      },
      {
        type: "word_bank",
        words: [text("もしかしたら"), text("それで"), text("すぐに"), text("なかなか"), text("そう言えば", { kana: "そういえば" }), text("それに"), text("ほとんど")]
      }
    ],
    items: [
      blankItem("l28-p2-a2-q1", "1", [text("（"), blank("answer"), text("）王さんは行かないかもしれません。", { kana: "）おうさんはいかないかもしれません。" })], "もしかしたら"),
      blankItem("l28-p2-a2-q2", "2", [text("あの人は英語とフランス語が上手です。（", { kana: "あのひとはえいごとフランスごがじょうずです。（" }), blank("answer"), text("）韓国語もできます。", { kana: "）かんこくごもできます。" })], "それに"),
      blankItem("l28-p2-a2-q3", "3", [text("時間がありませんから、（", { kana: "じかんがありませんから、（" }), blank("answer"), text("）来てください。", { kana: "）きてください。" })], "すぐに"),
      blankItem("l28-p2-a2-q4", "4", [text("朝はパンですか、ご飯ですか。——（", { kana: "あさはパンですか、ごはんですか。——（" }), blank("answer"), text("）ご飯です。", { kana: "）ごはんです。" })], "ほとんど"),
      blankItem("l28-p2-a2-q5", "5", [text("明日の朝、横浜へ行かなければなりません。（", { kana: "あしたのあさ、よこはまへいかなければなりません。（" }), blank("answer"), text("）、すみませんが、会社へ行くのが少し遅れます。", { kana: "）、すみませんが、かいしゃへいくのがすこしおくれます。" })], "それで"),
      blankItem("l28-p2-a2-q6", "6", [text("（"), blank("answer"), text("）、明日は9月1日、ぼくの誕生日だ。", { kana: "）、あしたはくがつついたち、ぼくのたんじょうびだ。" })], "そう言えば")
    ]
  },
  {
    id: "l28-p2-a3",
    section: "practice_2",
    order: 3,
    title: "听录音，与录音内容一致的在（ ）中画○，不一致的画×。",
    instruction: "听录音，输入 ○ 或 ×。",
    interaction: "true_false",
    answerUnit: "boolean",
    responseScope: "boolean_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "第28课 练习II-3",
      transcript: { source: "asr", text: "1. 森君、お茶を入れてくれますか。あ、いいですよ。2. あ、雨、困ったなあ。李さん、この傘を使ってください。どうもありがとう。3. 森さん、その書類、コピーしましょうか。ええ、お願いします。4. 長島さん、雨が降っているから、駅まで車で送りましょうか。すみません、ありがとうございます。" }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "森さん、すてきなマフラーですね。——ええ、小野さんが誕生日にくれたんです。",
          beforeKana: "もりさん、すてきなマフラーですね。——ええ、おのさんがたんじょうびにくれたんです。",
          after: [text("（○）森さんは小野さんにマフラーをもらいました。", { kana: "（まる）もりさんはおのさんにマフラーをもらいました。" })],
          afterKana: "（まる）もりさんはおのさんにマフラーをもらいました。"
        }
      }
    ],
    items: [
      listeningBooleanItem("l28-p2-a3-q1", "1", "森さんはお茶を入れます。", "もりさんは おちゃを いれます。", "○"),
      listeningBooleanItem("l28-p2-a3-q2", "2", "李さんは傘を貸してあげました。", "りさんは かさを かして あげました。", "×"),
      listeningBooleanItem("l28-p2-a3-q3", "3", "森さんが書類をコピーしてくれました。", "もりさんが しょるいを コピーして くれました。", "×"),
      listeningBooleanItem("l28-p2-a3-q4", "4", "長島さんは駅まで送ってもらいました。", "ながしまさんは えきまで おくって もらいました。", "○")
    ]
  },
  {
    id: "l28-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l28-p2-a4-q1", "1", "小马给了我(一张)地图。", "馬さんはわたしに地図をくれました。", { answerSource: "prompt" }),
      answerItem("l28-p2-a4-q2", "2", "森先生让小李带他游览了北京。", "森さんは李さんに北京を案内してもらいました。", { answerSource: "prompt" }),
      answerItem("l28-p2-a4-q3", "3", "森先生明天搬家吧。——是的，大家帮他一下吧。", "森さんは明日引っ越しですね。——ええ、みんなで手伝ってあげましょう。", { answerSource: "prompt" })
    ]
  }
];

export const lesson28Practice: LessonPractice = {
  lessonId: "lesson28",
  title: "第28课 馬さんはわたしに地図をくれました",
  sourcePages: [
    { pageNo: 40, imagePath: page(40) },
    { pageNo: 41, imagePath: page(41) },
    { pageNo: 42, imagePath: page(42) }
  ],
  activities
};
