import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";
import { lesson22ImageCrops } from "./lesson22-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson22/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit6/lesson22/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });
const crop = (id: string) => lesson22ImageCrops.assets.find((asset) => asset.id === id)!;

const completionHint = "只补全题目中空格处需要填写的部分。";
const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
const sentenceSlot = (placeholder = "输入完整回答"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
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
  inputSlots: options.multiline ? dialogueSlot("输入完整回答", options.rows || 4) : sentenceSlot("输入完整回答"),
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

const activities: PracticeActivity[] = [
  {
    id: "l22-p1-a1",
    section: "practice_1",
    order: 1,
    title: "仿照例句进行练习。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: "填写箭头右侧的普通形肯定/否定形式。",
    assets: [crop("l22-p1-a1-conjugation")],
    displayAssets: ["l22-p1-a1-conjugation"],
    layout: [
      { type: "example", content: { label: "[例1]", before: "食べます", beforeKana: "たべます", after: [text("食べる／食べない")], afterKana: "たべる／たべない" } },
      { type: "example", content: { label: "[例2]", before: "大きいです", beforeKana: "おおきいです", after: [text("大きい／大きく ない")], afterKana: "おおきい／おおきく ない" } },
      { type: "example", content: { label: "[例3]", before: "元気です", beforeKana: "げんきです", after: [text("元気だ／元気では ない")], afterKana: "げんきだ／げんきでは ない" } },
      { type: "example", content: { label: "[例4]", before: "曇りです", beforeKana: "くもりです", after: [text("曇りだ／曇りでは ない")], afterKana: "くもりだ／くもりでは ない" } }
    ],
    items: [
      phraseItem("l22-p1-a1-q1", "1", "忘れます", "忘れる／忘れない", { promptKana: "わすれます" }),
      phraseItem("l22-p1-a1-q2", "2", "教えます", "教える／教えない", { promptKana: "おしえます" }),
      phraseItem("l22-p1-a1-q3", "3", "あげます", "あげる／あげない"),
      phraseItem("l22-p1-a1-q4", "4", "急ぎます", "急ぐ／急がない", { promptKana: "いそぎます" }),
      phraseItem("l22-p1-a1-q5", "5", "消します", "消す／消さない", { promptKana: "けします" }),
      phraseItem("l22-p1-a1-q6", "6", "飛びます", "飛ぶ／飛ばない", { promptKana: "とびます" }),
      phraseItem("l22-p1-a1-q7", "7", "書きます", "書く／書かない", { promptKana: "かきます" }),
      phraseItem("l22-p1-a1-q8", "8", "待ちます", "待つ／待たない", { promptKana: "まちます" }),
      phraseItem("l22-p1-a1-q9", "9", "買います", "買う／買わない", { promptKana: "かいます" }),
      phraseItem("l22-p1-a1-q10", "10", "使います", "使う／使わない", { promptKana: "つかいます" }),
      phraseItem("l22-p1-a1-q11", "11", "来ます", "来る／来ない", { promptKana: "きます", acceptableAlternatives: ["くる／こない"] }),
      phraseItem("l22-p1-a1-q12", "12", "バドミントンを します", "バドミントンを する／バドミントンを しない"),
      phraseItem("l22-p1-a1-q13", "13", "うれしいです", "うれしい／うれしく ない"),
      phraseItem("l22-p1-a1-q14", "14", "眠いです", "眠い／眠く ない", { promptKana: "ねむいです" }),
      phraseItem("l22-p1-a1-q15", "15", "おもしろいです", "おもしろい／おもしろく ない"),
      phraseItem("l22-p1-a1-q16", "16", "つまらないです", "つまらない／つまらなく ない"),
      phraseItem("l22-p1-a1-q17", "17", "易しいです", "易しい／易しく ない", { promptKana: "やさしいです" }),
      phraseItem("l22-p1-a1-q18", "18", "難しいです", "難しい／難しく ない", { promptKana: "むずかしいです" }),
      phraseItem("l22-p1-a1-q19", "19", "軽いです", "軽い／軽く ない", { promptKana: "かるいです" }),
      phraseItem("l22-p1-a1-q20", "20", "重いです", "重い／重く ない", { promptKana: "おもいです" }),
      phraseItem("l22-p1-a1-q21", "21", "暇です", "暇だ／暇では ない", { promptKana: "ひまです" }),
      phraseItem("l22-p1-a1-q22", "22", "好きです", "好きだ／好きでは ない", { promptKana: "すきです" }),
      phraseItem("l22-p1-a1-q23", "23", "嫌いです", "嫌いだ／嫌いでは ない", { promptKana: "きらいです" }),
      phraseItem("l22-p1-a1-q24", "24", "上手です", "上手だ／上手では ない", { promptKana: "じょうずです" }),
      phraseItem("l22-p1-a1-q25", "25", "立派です", "立派だ／立派では ない", { promptKana: "りっぱです" }),
      phraseItem("l22-p1-a1-q26", "26", "きれいです", "きれいだ／きれいでは ない"),
      phraseItem("l22-p1-a1-q27", "27", "派手です", "派手だ／派手では ない", { promptKana: "はでです" }),
      phraseItem("l22-p1-a1-q28", "28", "大変です", "大変だ／大変では ない", { promptKana: "たいへんです" }),
      phraseItem("l22-p1-a1-q29", "29", "晴れです", "晴れだ／晴れでは ない", { promptKana: "はれです" }),
      phraseItem("l22-p1-a1-q30", "30", "雨です", "雨だ／雨では ない", { promptKana: "あめです" }),
      phraseItem("l22-p1-a1-q31", "31", "29歳です", "29歳だ／29歳では ない", { promptKana: "にじゅうきゅうさいです" }),
      phraseItem("l22-p1-a1-q32", "32", "5枚です", "5枚だ／5枚では ない", { promptKana: "ごまいです" }),
      phraseItem("l22-p1-a1-q33", "33", "病気です", "病気だ／病気では ない", { promptKana: "びょうきです" }),
      phraseItem("l22-p1-a1-q34", "34", "火曜日です", "火曜日だ／火曜日では ない", { promptKana: "かようびです" }),
      phraseItem("l22-p1-a1-q35", "35", "4時です", "4時だ／4時では ない", { promptKana: "よじです" }),
      phraseItem("l22-p1-a1-q36", "36", "午前中です", "午前中だ／午前中では ない", { promptKana: "ごぜんちゅうです" })
    ]
  },
  {
    id: "l22-p1-a2",
    section: "practice_1",
    order: 2,
    title: "仿照例句进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [crop("l22-p1-a2-plain-form")],
    displayAssets: ["l22-p1-a2-plain-form"],
    layout: [
      { type: "example", content: { label: "[例1]", before: "朝 7時に 起きます。\n昨日は 暑かったです。\n森さんは 野菜が 嫌いです。", beforeKana: "あさ しちじに おきます。\nきのうは あつかったです。\nもりさんは やさいが きらいです。", after: [text("朝 7時に 起きる。\n昨日は 暑かった。\n森さんは 野菜が 嫌いだ。")], afterKana: "あさ しちじに おきる。\nきのうは あつかった。\nもりさんは やさいが きらいだ。" } },
      { type: "example", content: { label: "[例2]", before: "勉強して います。\n英語が できます。\n入っては いけません。", beforeKana: "べんきょうして います。\nえいごが できます。\nはいっては いけません。", after: [text("勉強して いる。\n英語が できる。\n入っては いけない。")], afterKana: "べんきょうして いる。\nえいごが できる。\nはいっては いけない。" } }
    ],
    items: [
      answerItem("l22-p1-a2-q1", "1", "毎朝 太極拳を します。", "毎朝 太極拳を する。", { promptKana: "まいあさ たいきょくけんを します。" }),
      answerItem("l22-p1-a2-q2", "2", "タバコを 吸いません。", "タバコを 吸わない。", { promptKana: "タバコを すいません。" }),
      answerItem("l22-p1-a2-q3", "3", "のどが 渇きました。", "のどが 渇いた。", { promptKana: "のどが かわきました。" }),
      answerItem("l22-p1-a2-q4", "4", "庭に 犬が います。", "庭に 犬が いる。", { promptKana: "にわに いぬが います。" }),
      answerItem("l22-p1-a2-q5", "5", "キムさんは 兄弟が いません。", "キムさんは 兄弟が いない。", { promptKana: "キムさんは きょうだいが いません。" }),
      answerItem("l22-p1-a2-q6", "6", "昨日は 寒く なかったです。", "昨日は 寒く なかった。", { promptKana: "きのうは さむく なかったです。" }),
      answerItem("l22-p1-a2-q7", "7", "その 映画は おもしろく ないです。", "その 映画は おもしろく ない。", { promptKana: "その えいがは おもしろく ないです。" }),
      answerItem("l22-p1-a2-q8", "8", "チョコレートが 好きです。", "チョコレートが 好きだ。", { promptKana: "チョコレートが すきです。" }),
      answerItem("l22-p1-a2-q9", "9", "明日 暇では ありません。", "明日 暇では ない。", { promptKana: "あした ひまでは ありません。" }),
      answerItem("l22-p1-a2-q10", "10", "あそこに 電話が あります。", "あそこに 電話が ある。", { promptKana: "あそこに でんわが あります。" }),
      answerItem("l22-p1-a2-q11", "11", "テレビで 歌手が 歌って います。", "テレビで 歌手が 歌って いる。", { promptKana: "テレビで かしゅが うたって います。" }),
      answerItem("l22-p1-a2-q12", "12", "ピアノを 弾く ことが できます。", "ピアノを 弾く ことが できる。", { promptKana: "ピアノを ひく ことが できます。" }),
      answerItem("l22-p1-a2-q13", "13", "ここで 写真を 撮っては いけません。", "ここで 写真を 撮っては いけない。", { promptKana: "ここで しゃしんを とっては いけません。" }),
      answerItem("l22-p1-a2-q14", "14", "薬を 飲まなくても いいです。", "薬を 飲まなくても いい。", { promptKana: "くすりを のまなくても いいです。" }),
      answerItem("l22-p1-a2-q15", "15", "大統領に 会った ことが ありません。", "大統領に 会った ことが ない。", { promptKana: "だいとうりょうに あった ことが ありません。" }),
      answerItem("l22-p1-a2-q16", "16", "まだ 結婚して いません。", "まだ 結婚して いない。", { promptKana: "まだ けっこんして いません。" })
    ]
  },
  {
    id: "l22-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    assets: [crop("l22-p1-a3-dialogue")],
    displayAssets: ["l22-p1-a3-dialogue"],
    layout: [
      { type: "example", content: { label: "[例]", before: "昨日の 試験／難しい／できる", beforeKana: "きのうの しけん／むずかしい／できる", after: [text("甲：昨日の 試験、どうだった？\n乙：難しかったけど、まあまあ できたよ。")], afterKana: "きのうの しけん、どうだった？\nむずかしかったけど、まあまあ できたよ。" } }
    ],
    items: [
      dialogueItem("l22-p1-a3-q1", "1", "あの 店／高い／おいしい", "甲：あの 店、どうだった？\n乙：高かったけど、おいしかったよ。", "あの みせ／たかい／おいしい"),
      dialogueItem("l22-p1-a3-q2", "2", "旅行／忙しい／楽しい", "甲：旅行、どうだった？\n乙：忙しかったけど、楽しかったよ。", "りょこう／いそがしい／たのしい"),
      dialogueItem("l22-p1-a3-q3", "3", "映画／長い／おもしろい", "甲：映画、どうだった？\n乙：長かったけど、おもしろかったよ。", "えいが／ながい／おもしろい"),
      dialogueItem("l22-p1-a3-q4", "4", "ディズニーランド／人が 多い／いい", "甲：ディズニーランド、どうだった？\n乙：人が 多かったけど、よかったよ。", "ディズニーランド／ひとが おおい／いい")
    ]
  },
  {
    id: "l22-p1-a4",
    section: "practice_1",
    order: 4,
    title: "先填补空栏，然后听录音确认。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: "按表格顺序填写该行缺少的形式。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 4),
      label: "第22课 练习I-4",
      transcript: { text: "普通形活用表。", source: "manual", confidenceNote: "表格题答案依据教材空栏和普通形活用规则整理。" }
    },
    assets: [crop("l22-p1-a4-table")],
    displayAssets: ["l22-p1-a4-table"],
    layout: [
      { type: "text", text: [text("按「ます形／辞书形／ない形／た形／なかった形」的顺序补全空栏。")] }
    ],
    items: [
      phraseItem("l22-p1-a4-q1", "1", "できます", "できます／できる／できない／できた／できなかった", { answerSource: "prompt" }),
      phraseItem("l22-p1-a4-q2", "2", "飲みます", "飲みます／飲む／飲まない／飲んだ／飲まなかった", { promptKana: "のみます", answerSource: "prompt" }),
      phraseItem("l22-p1-a4-q3", "3", "あります", "あります／ある／ない／あった／なかった", { answerSource: "prompt" }),
      phraseItem("l22-p1-a4-q4", "4", "なります", "なります／なる／ならない／なった／ならなかった", { answerSource: "prompt" }),
      phraseItem("l22-p1-a4-q5", "5", "会います", "会います／会う／会わない／会った／会わなかった", { promptKana: "あいます", answerSource: "prompt" }),
      phraseItem("l22-p1-a4-q6", "6", "死にます", "死にます／死ぬ／死なない／死んだ／死ななかった", { promptKana: "しにます", answerSource: "prompt" }),
      phraseItem("l22-p1-a4-q7", "7", "浴びます", "浴びます／浴びる／浴びない／浴びた／浴びなかった", { promptKana: "あびます", answerSource: "prompt" }),
      phraseItem("l22-p1-a4-q8", "8", "来ます", "来ます／来る／来ない／来た／来なかった", { promptKana: "きます", answerSource: "prompt" }),
      phraseItem("l22-p1-a4-q9", "9", "します", "します／する／しない／した／しなかった", { answerSource: "prompt" }),
      phraseItem("l22-p1-a4-q10", "10", "寒いです", "寒いです／寒い／寒く ない／寒かった／寒く なかった", { promptKana: "さむいです", answerSource: "prompt" }),
      phraseItem("l22-p1-a4-q11", "11", "簡単です", "簡単です／簡単だ／簡単では ない／簡単だった／簡単では なかった", { promptKana: "かんたんです", answerSource: "prompt" }),
      phraseItem("l22-p1-a4-q12", "12", "日曜日です", "日曜日です／日曜日だ／日曜日では ない／日曜日だった／日曜日では なかった", { promptKana: "にちようびです", answerSource: "prompt" })
    ]
  },
  {
    id: "l22-p1-a5",
    section: "practice_1",
    order: 5,
    title: "听录音，仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整会话。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 5),
      label: "第22课 练习I-5",
      transcript: { text: "サッカー、好き？うん。チケット あるけど、行かない？うん、行く。", source: "manual", confidenceNote: "例句结合题面整理。" }
    },
    assets: [crop("l22-p1-a5-dialogue")],
    displayAssets: ["l22-p1-a5-dialogue"],
    layout: [
      { type: "example", content: { label: "[例]", before: "サッカー／チケット／行きます", after: [text("甲：サッカー、好き？\n乙：うん。\n甲：チケット あるけど、行かない？\n乙：うん、行く。")], afterKana: "サッカー、すき？\nうん。\nチケット あるけど、いかない？\nうん、いく。" } }
    ],
    items: [
      dialogueItem("l22-p1-a5-q1", "1", "クラシック／モーツァルトの CD／聞きます", "甲：クラシック、好き？\n乙：うん。\n甲：モーツァルトの CD あるけど、聞かない？\n乙：うん、聞く。", "クラシック／モーツァルトの シーディー／ききます"),
      dialogueItem("l22-p1-a5-q2", "2", "そば／この 近くに おいしい お店／行きます", "甲：そば、好き？\n乙：うん。\n甲：この 近くに おいしい お店 あるけど、行かない？\n乙：うん、行く。", "そば／この ちかくに おいしい おみせ／いきます"),
      dialogueItem("l22-p1-a5-q3", "3", "バドミントン／ラケット／します", "甲：バドミントン、好き？\n乙：うん。\n甲：ラケット あるけど、しない？\n乙：うん、する。")
    ]
  },
  {
    id: "l22-p2-a1",
    section: "practice_2",
    order: 1,
    title: "在（　）中填入适当的词语，完成句子。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: completionHint,
    assets: [crop("l22-p2-a1-cloze")],
    displayAssets: ["l22-p2-a1-cloze"],
    layout: [
      { type: "example", content: { label: "[例]", before: "甲：試験、難しかった？\n乙：ううん、（　　　）。", beforeKana: "しけん、むずかしかった？\nううん、（　　　）。", after: [text("難しく なかった")], afterKana: "むずかしく なかった" } }
    ],
    items: [
      blankItem("l22-p2-a1-q1", "1", [text("甲：京都へ 行った こと ある？\n乙：ううん、（"), blank("answer"), text("）。")], { answer: "行った ことが ない" }, { promptKana: "きょうとへ いった こと ある？" }),
      blankItem("l22-p2-a1-q2", "2", [text("甲：太田君、何時に（"), blank("answer"), text("）の？\n乙：7時に 来るよ。")], { answer: "来る" }, { promptKana: "おおたくん、なんじに（　）の？" }),
      blankItem("l22-p2-a1-q3", "3", [text("甲：先生の 住所 分かった？\n乙：ううん、（"), blank("answer"), text("）。")], { answer: "分からなかった" }, { promptKana: "せんせいの じゅうしょ わかった？" }),
      blankItem("l22-p2-a1-q4", "4", [text("甲：もう あの 映画 見た？\n乙：（"), blank("a"), text("）、まだ。太郎君は？\n甲：うん、もう（"), blank("b"), text("）。\n乙：おもしろかった？\n甲：ううん、あまり（"), blank("c"), text("）。")], { a: "ううん", b: "見た", c: "おもしろく なかった" }, { promptKana: "もう あの えいが みた？", responseScope: "phrase_only" })
    ]
  },
  {
    id: "l22-p2-a2",
    section: "practice_2",
    order: 2,
    title: "从□中选择适当的词语填入（　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    assets: [crop("l22-p2-a2-word-bank")],
    displayAssets: ["l22-p2-a2-word-bank"],
    layout: [{ type: "word_bank", words: ["先に", "さらに", "特に", "ぜひ", "まだ", "もうすぐ"].map((word) => text(word)) }],
    items: [
      blankItem("l22-p2-a2-q1", "1", [text("（"), blank("answer"), text("）3月だ。暖かく なるね。")], { answer: "もうすぐ" }, { promptKana: "さんがつだ。あたたかく なるね。", expectedUnit: "word" }),
      blankItem("l22-p2-a2-q2", "2", [text("みんな よかったけど、（"), blank("answer"), text("）田中君が よかったよ。")], { answer: "特に" }, { promptKana: "みんな よかったけど、たなかくんが よかったよ。", expectedUnit: "word" }),
      blankItem("l22-p2-a2-q3", "3", [text("中国より（"), blank("answer"), text("）広い 国は どこ？")], { answer: "さらに" }, { promptKana: "ちゅうごくより ひろい くには どこ？", expectedUnit: "word" }),
      blankItem("l22-p2-a2-q4", "4", [text("今年中に（"), blank("answer"), text("）車を 買いたい。")], { answer: "ぜひ" }, { promptKana: "ことしじゅうに くるまを かいたい。", expectedUnit: "word" }),
      blankItem("l22-p2-a2-q5", "5", [text("（"), blank("answer"), text("）帰っても いい？")], { answer: "先に" }, { promptKana: "かえっても いい？", expectedUnit: "word" })
    ]
  },
  {
    id: "l22-p2-a3",
    section: "practice_2",
    order: 3,
    title: "读下面的日记，回答录音中的提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "第22课 练习II-3",
      transcript: {
        text: "2月4日は何曜日でしたか。2月4日の天気はどうでしたか。2月4日は何をしましたか。2月5日は何時に起きましたか。2月5日はどうやって家を出ましたか。",
        source: "manual",
        confidenceNote: "根据教材日记和例题整理的提问文本。"
      }
    },
    assets: [crop("l22-p2-a3-reading")],
    displayAssets: ["l22-p2-a3-reading"],
    layout: [
      {
        type: "passage",
        title: "2月4日（日）",
        lines: [text("今日 雪が 降った。道も 庭も 白く なって、きれいだった。日曜日で 暇だったから、1日 家に いて、本を 読んだ。寝る 前に、外を 見た。もう 雪は 降って いなかった。")]
      },
      {
        type: "passage",
        title: "2月5日（月）",
        lines: [text("朝 6時半に 起きて、テレビを つけて、朝ご飯を 食べた。いつもは 7時50分に 家を 出るけど、早く 出た ほうが いいから、7時半に 出た。いつもは 自転車で 行くけど、今日は 歩いた。")]
      },
      { type: "example", content: { label: "[例]", before: "2月4日は 何曜日でしたか。", beforeKana: "にがつ よっかは なんようびでしたか。", after: [text("日曜日でした。")], afterKana: "にちようびでした。" } }
    ],
    items: [
      answerItem("l22-p2-a3-q1", "1", "2月4日の天気はどうでしたか。", "雪が 降りました。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "にがつ よっかの てんきは どうでしたか。" }),
      answerItem("l22-p2-a3-q2", "2", "2月4日は何をしましたか。", "1日 家に いて、本を 読みました。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "にがつ よっかは なにを しましたか。" }),
      answerItem("l22-p2-a3-q3", "3", "寝る前に何を見ましたか。", "外を 見ました。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "ねる まえに なにを みましたか。" }),
      answerItem("l22-p2-a3-q4", "4", "2月5日は何時に起きましたか。", "朝 6時半に 起きました。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "にがつ いつかは なんじに おきましたか。" }),
      answerItem("l22-p2-a3-q5", "5", "2月5日はどうやって行きましたか。", "歩いて 行きました。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "にがつ いつかは どうやって いきましたか。" })
    ]
  },
  {
    id: "l22-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [crop("l22-p2-a4-translation")],
    displayAssets: ["l22-p2-a4-translation"],
    layout: [],
    items: [
      answerItem("l22-p2-a4-q1", "1", "昨天的考试怎么样啊？——有点难，不过大概都做出来了。", "昨日の 試験、どうだった？\n少し 難しかったけど、だいたい できた。", { multiline: true, rows: 3, acceptableAlternatives: ["昨日の 試験は どうだった？\n少し 難しかったけど、だいたい できた。"] }),
      answerItem("l22-p2-a4-q2", "2", "这个领带太花哨吗？——不，一点儿也不花哨。", "この ネクタイ、派手？\nううん、全然 派手では ない。", { multiline: true, rows: 3, acceptableAlternatives: ["この ネクタイは 派手？\nううん、全然 派手では ない。", "この ネクタイ、派手ですか。\nいいえ、全然 派手では ありません。"] }),
      answerItem("l22-p2-a4-q3", "3", "森先生每天晚上看电视。", "森さんは 毎晩 テレビを 見る。", { acceptableAlternatives: ["森さんは 毎晩 テレビを 見ます。"] })
    ]
  }
];

export const lesson22Practice: LessonPractice = {
  lessonId: "lesson22",
  title: "第22课 森さんは 毎晩 テレビを 見る",
  sourcePages: [
    { pageNo: 268, imagePath: page(268) },
    { pageNo: 269, imagePath: page(269) },
    { pageNo: 270, imagePath: page(270) }
  ],
  activities
};
