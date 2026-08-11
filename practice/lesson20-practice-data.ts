import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";
import { lesson20ImageCrops } from "./lesson20-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson20/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit5/lesson20/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });
const crop = (id: string) => lesson20ImageCrops.assets.find((asset) => asset.id === id)!;

const completionHint = "只补全题目中空格处需要填写的部分。";
const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
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
  inputSlots: options.multiline ? multilineSentenceSlot("输入完整回答", options.rows || 3) : sentenceSlot("输入完整回答"),
  answer: { slotValues: { answer }, acceptableAlternatives: options.acceptableAlternatives }
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
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "prompt",
  responseScope: options.responseScope || "phrase_only",
  responseScopeHint: options.responseScopeHint || completionHint,
  inputSlots: shortSlots(Object.keys(answers), options.expectedUnit),
  answer: { slotValues: answers }
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
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "example_transform",
  responseScope: "question_and_answer",
  responseScopeHint: options.responseScopeHint || "写出完整问答。",
  inputSlots: dialogueSlot("输入完整问答", options.rows || 4),
  answer: { slotValues: { answer } },
  renderHint: "dialogue"
});

const baseFormItem = (id: string, number: string, prompt: string, answer: string, promptKana?: string): PracticeItem =>
  blankItem(
    id,
    number,
    [text(prompt), text(" → "), blank("answer")],
    { answer },
    { promptKana, answerSource: "audio", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "conjugated_form" }
  );

const activities: PracticeActivity[] = [
  {
    id: "l20-p1-a1",
    section: "practice_1",
    order: 1,
    title: "看图，仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [crop("l20-p1-a1-picture-grid")],
    displayAssets: ["l20-p1-a1-picture-grid"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "李さん　ピアノ／弾きます\n森さん　ピアノ／弾きません",
          beforeKana: "りさん　ピアノ／ひきます\nもりさん　ピアノ／ひきません",
          after: [text("李さんは ピアノを 弾く ことが できます。\n森さんは ピアノを 弾く ことが できません。")],
          afterKana: "りさんは ピアノを ひく ことが できます。\nもりさんは ピアノを ひく ことが できません。"
        }
      }
    ],
    items: [
      answerItem("l20-p1-a1-q1", "1", "張さん　日本の 歌／歌います", "張さんは 日本の 歌を 歌う ことが できます。", { promptKana: "ちょうさん　にほんの うた／うたいます" }),
      answerItem("l20-p1-a1-q2", "2", "小野さん　自転車／乗りません", "小野さんは 自転車に 乗る ことが できません。", { promptKana: "おのさん　じてんしゃ／のりません" }),
      answerItem("l20-p1-a1-q3", "3", "森さん　ギター／弾きます", "森さんは ギターを 弾く ことが できます。", { promptKana: "もりさん　ギター／ひきます" }),
      answerItem("l20-p1-a1-q4", "4", "張さん　車／運転しません", "張さんは 車を 運転する ことが できません。", { promptKana: "ちょうさん　くるま／うんてんしません" }),
      answerItem("l20-p1-a1-q5", "5", "李さん　パソコン／使います", "李さんは パソコンを 使う ことが できます。", { promptKana: "りさん　パソコン／つかいます" }),
      answerItem("l20-p1-a1-q6", "6", "小野さん　英語／話します", "小野さんは 英語を 話す ことが できます。", { promptKana: "おのさん　えいご／はなします" })
    ]
  },
  {
    id: "l20-p1-a2",
    section: "practice_1",
    order: 2,
    title: "仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    assets: [crop("l20-p1-a2-dialogue")],
    displayAssets: ["l20-p1-a2-dialogue"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "中国語を 話します（はい／いいえ）",
          beforeKana: "ちゅうごくごを はなします（はい／いいえ）",
          after: [text("甲：長島さんは 中国語を 話す ことが できますか。\n乙：はい、できます。／いいえ、全然 できません。")],
          afterKana: "ながしまさんは ちゅうごくごを はなす ことが できますか。\nはい、できます。／いいえ、ぜんぜん できません。"
        }
      }
    ],
    items: [
      dialogueItem("l20-p1-a2-q1", "1", "自転車を 修理します（はい）", "甲：長島さんは 自転車を 修理する ことが できますか。\n乙：はい、できます。", { promptKana: "じてんしゃを しゅうりします（はい）" }),
      dialogueItem("l20-p1-a2-q2", "2", "フランス語を 教えます（いいえ）", "甲：長島さんは フランス語を 教える ことが できますか。\n乙：いいえ、全然 できません。", { promptKana: "フランスごを おしえます（いいえ）" }),
      dialogueItem("l20-p1-a2-q3", "3", "パソコンを 使います（いいえ）", "甲：長島さんは パソコンを 使う ことが できますか。\n乙：いいえ、全然 できません。", { promptKana: "パソコンを つかいます（いいえ）" }),
      dialogueItem("l20-p1-a2-q4", "4", "車を 運転します（はい）", "甲：長島さんは 車を 運転する ことが できますか。\n乙：はい、できます。", { promptKana: "くるまを うんてんします（はい）" })
    ]
  },
  {
    id: "l20-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    assets: [crop("l20-p1-a3-dialogue")],
    displayAssets: ["l20-p1-a3-dialogue"],
    layout: [],
    itemGroups: [
      {
        id: "l20-p1-a3-g1",
        title: "[例1]",
        example: {
          label: "[例1]",
          before: "ここで 写真を 撮ります",
          beforeKana: "ここで しゃしんを とります",
          after: [text("甲：ここで 写真を 撮っても いいですか。\n乙：いいえ、ここでは 写真を 撮る ことが できません。")],
          afterKana: "ここで しゃしんを とっても いいですか。\nいいえ、ここでは しゃしんを とる ことが できません。"
        },
        items: [
          dialogueItem("l20-p1-a3-q1", "1", "ここで 携帯電話を 使います", "甲：ここで 携帯電話を 使っても いいですか。\n乙：いいえ、ここでは 携帯電話を 使う ことが できません。", { promptKana: "ここで けいたいでんわを つかいます" }),
          dialogueItem("l20-p1-a3-q2", "2", "ここに 車を 止めます", "甲：ここに 車を 止めても いいですか。\n乙：いいえ、ここには 車を 止める ことが できません。", { promptKana: "ここに くるまを とめます" }),
          dialogueItem("l20-p1-a3-q3", "3", "ここで 食事します", "甲：ここで 食事しても いいですか。\n乙：いいえ、ここでは 食事する ことが できません。", { promptKana: "ここで しょくじします" }),
          dialogueItem("l20-p1-a3-q4", "4", "あそこに 荷物を 置きます", "甲：あそこに 荷物を 置いても いいですか。\n乙：いいえ、あそこには 荷物を 置く ことが できません。", { promptKana: "あそこに にもつを おきます" })
        ]
      },
      {
        id: "l20-p1-a3-g2",
        title: "[例2]",
        example: {
          label: "[例2]",
          before: "切手を 集めます",
          beforeKana: "きってを あつめます",
          after: [text("わたしの 趣味は 切手を 集める ことです。")],
          afterKana: "わたしの しゅみは きってを あつめる ことです。"
        },
        items: [
          answerItem("l20-p1-a3-q5", "5", "釣りを します", "わたしの 趣味は 釣りを する ことです。", { promptKana: "つりを します" }),
          answerItem("l20-p1-a3-q6", "6", "小説を 読みます", "わたしの 趣味は 小説を 読む ことです。", { promptKana: "しょうせつを よみます" }),
          answerItem("l20-p1-a3-q7", "7", "海岸を ドライブします", "わたしの 趣味は 海岸を ドライブする ことです。", { promptKana: "かいがんを ドライブします" }),
          answerItem("l20-p1-a3-q8", "8", "外国へ 旅行に 行きます", "わたしの 趣味は 外国へ 旅行に 行く ことです。", { promptKana: "がいこくへ りょこうに いきます" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l20-p1-a4",
    section: "practice_1",
    order: 4,
    title: "听录音，将“ます形”变为“基本形”。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 4),
      label: "第20课 练习I-4",
      transcript: {
        text: "書きます、書く。急ぎます、急ぐ。泳ぎます、泳ぐ。休みます、休む。呼びます、呼ぶ。撮ります、撮る。会います、会う。持ちます、持つ。話します、話す。出します、出す。起きます、起きる。見ます、見る。食べます、食べる。つけます、つける。閉めます、閉める。寝ます、寝る。します、する。結婚します、結婚する。勉強します、勉強する。来ます、来る。",
        source: "manual",
        confidenceNote: "按教材表格顺序整理。"
      }
    },
    assets: [crop("l20-p1-a4-basic-form-table")],
    displayAssets: ["l20-p1-a4-basic-form-table"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "書きます",
          beforeKana: "かきます",
          after: [text("書く")],
          afterKana: "かく"
        }
      }
    ],
    items: [
      baseFormItem("l20-p1-a4-q1", "1", "書きます", "書く", "かきます"),
      baseFormItem("l20-p1-a4-q2", "2", "急ぎます", "急ぐ", "いそぎます"),
      baseFormItem("l20-p1-a4-q3", "3", "泳ぎます", "泳ぐ", "およぎます"),
      baseFormItem("l20-p1-a4-q4", "4", "休みます", "休む", "やすみます"),
      baseFormItem("l20-p1-a4-q5", "5", "呼びます", "呼ぶ", "よびます"),
      baseFormItem("l20-p1-a4-q6", "6", "撮ります", "撮る", "とります"),
      baseFormItem("l20-p1-a4-q7", "7", "会います", "会う", "あいます"),
      baseFormItem("l20-p1-a4-q8", "8", "持ちます", "持つ", "もちます"),
      baseFormItem("l20-p1-a4-q9", "9", "話します", "話す", "はなします"),
      baseFormItem("l20-p1-a4-q10", "10", "出します", "出す", "だします"),
      baseFormItem("l20-p1-a4-q11", "11", "起きます", "起きる", "おきます"),
      baseFormItem("l20-p1-a4-q12", "12", "見ます", "見る", "みます"),
      baseFormItem("l20-p1-a4-q13", "13", "食べます", "食べる", "たべます"),
      baseFormItem("l20-p1-a4-q14", "14", "つけます", "つける"),
      baseFormItem("l20-p1-a4-q15", "15", "閉めます", "閉める", "しめます"),
      baseFormItem("l20-p1-a4-q16", "16", "寝ます", "寝る", "ねます"),
      baseFormItem("l20-p1-a4-q17", "17", "します", "する"),
      baseFormItem("l20-p1-a4-q18", "18", "結婚します", "結婚する", "けっこんします"),
      baseFormItem("l20-p1-a4-q19", "19", "勉強します", "勉強する", "べんきょうします"),
      baseFormItem("l20-p1-a4-q20", "20", "来ます", "来る", "きます")
    ]
  },
  {
    id: "l20-p1-a5",
    section: "practice_1",
    order: 5,
    title: "听录音，仿照例句练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 5), label: "第20课 练习I-5" },
    assets: [crop("l20-p1-a5-dialogue")],
    displayAssets: ["l20-p1-a5-dialogue"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "音楽を 聞きます／コンサートに 行きます",
          beforeKana: "おんがくを ききます／コンサートに いきます",
          after: [text("甲：何か 趣味が ありますか。\n乙：ええ、音楽を 聞く ことです。\n甲：いいですね。わたしも 音楽を 聞く ことが 大好きです。\n乙：じゃあ、今度 いっしょに コンサートに 行きませんか。")],
          afterKana: "なにか しゅみが ありますか。\nええ、おんがくを きく ことです。\nいいですね。わたしも おんがくを きく ことが だいすきです。\nじゃあ、こんど いっしょに コンサートに いきませんか。"
        }
      }
    ],
    items: [
      dialogueItem("l20-p1-a5-q1", "1", "写真を 撮ります／花の 写真を 撮りに 行きます", "甲：何か 趣味が ありますか。\n乙：ええ、写真を 撮る ことです。\n甲：いいですね。わたしも 写真を 撮る ことが 大好きです。\n乙：じゃあ、今度 いっしょに 花の 写真を 撮りに 行きませんか。", { promptKana: "しゃしんを とります／はなの しゃしんを とりに いきます", answerSource: "audio", rows: 5 }),
      dialogueItem("l20-p1-a5-q2", "2", "山に 登ります／富士山に 登ります", "甲：何か 趣味が ありますか。\n乙：ええ、山に 登る ことです。\n甲：いいですね。わたしも 山に 登る ことが 大好きです。\n乙：じゃあ、今度 いっしょに 富士山に 登りませんか。", { promptKana: "やまに のぼります／ふじさんに のぼります", answerSource: "audio", rows: 5 }),
      dialogueItem("l20-p1-a5-q3", "3", "ドライブを します／海岸を ドライブします", "甲：何か 趣味が ありますか。\n乙：ええ、ドライブを する ことです。\n甲：いいですね。わたしも ドライブを する ことが 大好きです。\n乙：じゃあ、今度 いっしょに 海岸を ドライブしませんか。", { promptKana: "ドライブを します／かいがんを ドライブします", answerSource: "audio", rows: 5 }),
      dialogueItem("l20-p1-a5-q4", "4", "釣りを します／海へ 釣りに 行きます", "甲：何か 趣味が ありますか。\n乙：ええ、釣りを する ことです。\n甲：いいですね。わたしも 釣りを する ことが 大好きです。\n乙：じゃあ、今度 いっしょに 海へ 釣りに 行きませんか。", { promptKana: "つりを します／うみへ つりに いきます", answerSource: "audio", rows: 5 }),
      dialogueItem("l20-p1-a5-q5", "5", "絵を かきます／美術館に 絵を 見に 行きます", "甲：何か 趣味が ありますか。\n乙：ええ、絵を かく ことです。\n甲：いいですね。わたしも 絵を かく ことが 大好きです。\n乙：じゃあ、今度 いっしょに 美術館に 絵を 見に 行きませんか。", { promptKana: "えを かきます／びじゅつかんに えを みに いきます", answerSource: "audio", rows: 5 })
    ]
  },
  {
    id: "l20-p1-a6",
    section: "practice_1",
    order: 6,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    assets: [crop("l20-p1-a6-dialogue")],
    displayAssets: ["l20-p1-a6-dialogue"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "日本へ 来ます／勉強しました／日本語と 英語",
          beforeKana: "にほんへ きます／べんきょうしました／にほんごと えいご",
          after: [text("甲：日本へ 来る 前に、何か 勉強しましたか。\n乙：ええ、日本語と 英語を 勉強しました。")],
          afterKana: "にほんへ くる まえに、なにか べんきょうしましたか。\nええ、にほんごと えいごを べんきょうしました。"
        }
      }
    ],
    items: [
      dialogueItem("l20-p1-a6-q1", "1", "会社に 入ります／習いました／パソコンと 車の 運転", "甲：会社に 入る 前に、何か 習いましたか。\n乙：ええ、パソコンと 車の 運転を 習いました。", { promptKana: "かいしゃに はいります／ならいました／パソコンと くるまの うんてん" }),
      dialogueItem("l20-p1-a6-q2", "2", "結婚します／習いたいです／いろいろな 料理や 編み物など", "甲：結婚する 前に、何か 習いたいですか。\n乙：ええ、いろいろな 料理や 編み物などを 習いたいです。", { promptKana: "けっこんします／ならいたいです／いろいろな りょうりや あみものなど" })
    ]
  },
  {
    id: "l20-p2-a1",
    section: "practice_2",
    order: 1,
    title: "将（　）中的词语变成适当的形式。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: completionHint,
    assets: [crop("l20-p2-a1-form-change")],
    displayAssets: ["l20-p2-a1-form-change"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("こちらへ（来ます → "), blank("example"), text("）前に、電話を かけて ください。")],
          beforeKana: "こちらへ（きます → ______）まえに、でんわを かけて ください。",
          after: [text("来る")],
          afterKana: "くる"
        }
      }
    ],
    items: [
      blankItem("l20-p2-a1-q1", "1", [text("スペイン語を（話します → "), blank("answer"), text("）ことが できますか。")], { answer: "話す" }, { promptKana: "スペインごを（はなします → ______）ことが できますか。", expectedUnit: "conjugated_form" }),
      blankItem("l20-p2-a1-q2", "2", [text("わたしの 趣味は クラシックを（聞きます → "), blank("answer"), text("）ことです。")], { answer: "聞く" }, { promptKana: "わたしの しゅみは クラシックを（ききます → ______）ことです。", expectedUnit: "conjugated_form" }),
      blankItem("l20-p2-a1-q3", "3", [text("明日 銀行に お金を（返します → "), blank("answer"), text("）なければ なりません。")], { answer: "返さ" }, { promptKana: "あした ぎんこうに おかねを（かえします → ______）なければ なりません。", expectedUnit: "conjugated_form" }),
      blankItem("l20-p2-a1-q4", "4", [text("早く（大きいです → "), blank("big"), text("）なって、外国で（働きます → "), blank("work"), text("）たいです。")], { big: "大きく", work: "働き" }, { promptKana: "はやく（おおきいです → ______）なって、がいこくで（はたらきます → ______）たいです。", expectedUnit: "conjugated_form" }),
      blankItem("l20-p2-a1-q5", "5", [text("もう（いい → "), blank("good"), text("）なりましたから、薬を（飲みます → "), blank("drink"), text("）ても いいですよ。")], { good: "よく", drink: "飲まなく" }, { promptKana: "もう（いい → ______）なりましたから、くすりを（のみます → ______）ても いいですよ。", expectedUnit: "conjugated_form" })
    ]
  },
  {
    id: "l20-p2-a2",
    section: "practice_2",
    order: 2,
    title: "看图，使用“～前に”造句。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [crop("l20-p2-a2-before-picture-grid")],
    displayAssets: ["l20-p2-a2-before-picture-grid"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "寝る／シャワーを 浴びます",
          beforeKana: "ねる／シャワーを あびます",
          after: [text("寝る 前に、シャワーを 浴びます。")],
          afterKana: "ねる まえに、シャワーを あびます。"
        }
      }
    ],
    items: [
      answerItem("l20-p2-a2-q1", "1", "朝ご飯を 食べます／ジョギングを します", "朝ご飯を 食べる 前に、ジョギングを します。", { promptKana: "あさごはんを たべます／ジョギングを します" }),
      answerItem("l20-p2-a2-q2", "2", "友達に 会います／電話を かけます", "友達に 会う 前に、電話を かけます。", { promptKana: "ともだちに あいます／でんわを かけます" }),
      answerItem("l20-p2-a2-q3", "3", "会社へ 行きます／新聞を 読みます", "会社へ 行く 前に、新聞を 読みます。", { promptKana: "かいしゃへ いきます／しんぶんを よみます" }),
      answerItem("l20-p2-a2-q4", "4", "テレビを 見ます／日本語を 勉強します", "テレビを 見る 前に、日本語を 勉強します。", { promptKana: "テレビを みます／にほんごを べんきょうします" })
    ]
  },
  {
    id: "l20-p2-a3",
    section: "practice_2",
    order: 3,
    title: "听录音回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "第20课 练习II-3"
    },
    assets: [crop("l20-p2-a3-listening")],
    displayAssets: ["l20-p2-a3-listening"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "森さんの 趣味は 何ですか。",
          beforeKana: "もりさんの しゅみは なんですか。",
          after: [text("野球を する ことです。")],
          afterKana: "やきゅうを する ことです。"
        }
      }
    ],
    items: [
      answerItem("l20-p2-a3-q1", "1", "いつ 野球を しますか。", "日曜日に します。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "いつ やきゅうを しますか。" }),
      answerItem("l20-p2-a3-q2", "2", "だれと しますか。", "友達と します。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "だれと しますか。" }),
      answerItem("l20-p2-a3-q3", "3", "どうして 家の 近くで 野球を する ことが できませんか。", "家の 近くには 広い 公園が ありませんから。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "どうして いえの ちかくで やきゅうを する ことが できませんか。" }),
      answerItem("l20-p2-a3-q4", "4", "公園まで バスで どのぐらい かかりますか。", "20分ぐらい かかります。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "こうえんまで バスで どのぐらい かかりますか。" }),
      answerItem("l20-p2-a3-q5", "5", "野球を してから、公園を 掃除しますか。", "はい、掃除します。", { answerSource: "audio", responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "やきゅうを してから、こうえんを そうじしますか。" })
    ]
  },
  {
    id: "l20-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    assets: [crop("l20-p2-a4-translation")],
    displayAssets: ["l20-p2-a4-translation"],
    layout: [],
    items: [
      answerItem("l20-p2-a4-q1", "1", "小李会开车。", "李さんは 車を 運転する ことが できます。", { answerSource: "prompt", acceptableAlternatives: ["李さんは 車の 運転が できます。"] }),
      answerItem("l20-p2-a4-q2", "2", "你有什么爱好吗？——有啊。我喜欢听音乐。", "何か 趣味が ありますか。\nええ、音楽を 聞く ことが 好きです。", { answerSource: "prompt", multiline: true, rows: 3, acceptableAlternatives: ["何か 趣味が ありますか。\nええ、音楽を 聞く ことです。"] }),
      answerItem("l20-p2-a4-q3", "3", "（你）来这儿之前请打个电话。", "こちらへ 来る 前に、電話を かけて ください。", { answerSource: "prompt" })
    ]
  }
];

export const lesson20Practice: LessonPractice = {
  lessonId: "lesson20",
  title: "第20課 スミスさんは ピアノを 弾く ことが できます",
  sourcePages: [
    { pageNo: 242, imagePath: page(242) },
    { pageNo: 243, imagePath: page(243) },
    { pageNo: 244, imagePath: page(244) }
  ],
  activities
};
