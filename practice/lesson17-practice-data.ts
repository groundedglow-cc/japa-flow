import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";
import { lesson17ImageCrops } from "./lesson17-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson17/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit5/lesson17/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });
const crop = (id: string) => lesson17ImageCrops.assets.find((asset) => asset.id === id)!;

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
  promptKana: options.promptKana,
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
  promptKana: options.promptKana,
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
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "prompt",
  responseScope: options.responseScope || "phrase_only",
  responseScopeHint: options.responseScopeHint,
  inputSlots: shortSlots(Object.keys(answers), options.expectedUnit),
  answer: { slotValues: answers }
});

const taiFormItem = (id: string, number: string, verb: string, desired: string, undesired: string, promptKana?: string): PracticeItem =>
  blankItem(
    id,
    number,
    [text(verb), text("："), blank("desired"), text("／"), blank("undesired")],
    { desired, undesired },
    { promptKana, answerSource: "audio", responseScope: "phrase_only", responseScopeHint: "分别填写肯定和否定的たい形。", expectedUnit: "phrase" }
  );

const trueFalseItem = (id: string, number: string, prompt: string, value: boolean): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  instruction: "",
  answerSource: "audio",
  responseScope: "boolean_only",
  choices: [
    { id: "true", label: "○" },
    { id: "false", label: "×" }
  ],
  answer: { boolean: value, choiceIds: [value ? "true" : "false"] }
});

const personalItem = (id: string, number: string, prompt: string, promptKana: string, modelAnswer: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "personal",
  evaluationMode: "manual_review",
  responseScope: "free_response",
  responseScopeHint: "根据自己的实际情况回答。",
  inputSlots: sentenceSlot("输入自己的回答"),
  answer: { modelAnswers: [modelAnswer], note: "开放题，答案仅作参考。" }
});

const activities: PracticeActivity[] = [
  {
    id: "l17-p1-a1",
    section: "practice_1",
    order: 1,
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
          before: "カメラ",
          after: [text("わたしは カメラが 欲しいです。")],
          afterKana: "わたしは カメラが ほしいです。"
        }
      }
    ],
    items: [
      answerItem("l17-p1-a1-q1", "1", "ノートパソコン", "わたしは ノートパソコンが 欲しいです。", { responseScope: "sentence_only", promptKana: "ノートパソコン" }),
      answerItem("l17-p1-a1-q2", "2", "携帯電話", "わたしは 携帯電話が 欲しいです。", { responseScope: "sentence_only", promptKana: "けいたいでんわ" }),
      answerItem("l17-p1-a1-q3", "3", "新しい セーター", "わたしは 新しい セーターが 欲しいです。", { responseScope: "sentence_only", promptKana: "あたらしい セーター" }),
      answerItem("l17-p1-a1-q4", "4", "日本人の 友達", "わたしは 日本人の 友達が 欲しいです。", { responseScope: "sentence_only", promptKana: "にほんじんの ともだち" })
    ]
  },
  {
    id: "l17-p1-a2",
    section: "practice_1",
    order: 2,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    assets: [crop("l17-p1-a2-desire-word-bubbles")],
    displayAssets: ["l17-p1-a2-desire-word-bubbles"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "軽い カメラ",
          beforeKana: "かるい カメラ",
          after: [text("甲：何が 欲しいですか。\n乙：軽い カメラが 欲しいです。")],
          afterKana: "なにが ほしいですか。\nかるい カメラが ほしいです。"
        }
      }
    ],
    items: [
      dialogueItem("l17-p1-a2-q1", "1", "新しい バイク", "甲：何が 欲しいですか。\n乙：新しい バイクが 欲しいです。", { promptKana: "あたらしい バイク" }),
      dialogueItem("l17-p1-a2-q2", "2", "きれいな 服", "甲：何が 欲しいですか。\n乙：きれいな 服が 欲しいです。", { promptKana: "きれいな ふく" }),
      dialogueItem("l17-p1-a2-q3", "3", "立派な 家", "甲：何が 欲しいですか。\n乙：立派な 家が 欲しいです。", { promptKana: "りっぱな いえ" }),
      dialogueItem("l17-p1-a2-q4", "4", "英語の 辞書", "甲：何が 欲しいですか。\n乙：英語の 辞書が 欲しいです。", { promptKana: "えいごの じしょ" }),
      dialogueItem("l17-p1-a2-q5", "5", "外国人の 友達", "甲：何が 欲しいですか。\n乙：外国人の 友達が 欲しいです。", { promptKana: "がいこくじんの ともだち" })
    ]
  },
  {
    id: "l17-p1-a3",
    section: "practice_1",
    order: 3,
    title: "先仿照例子完成表格，然后听录音确认。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: "分别填写肯定和否定的たい形。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 3),
      label: "第17课 练习I-3",
      transcript: {
        text: "食べます。食べたいです。食べたく ないです。聞きます。聞きたいです。聞きたく ないです。飲みます。飲みたいです。飲みたく ないです。帰ります。帰りたいです。帰りたく ないです。持ちます。持ちたいです。持ちたく ないです。買います。買いたいです。買いたく ないです。話します。話したいです。話したく ないです。見ます。見たいです。見たく ないです。起きます。起きたいです。起きたく ないです。勉強します。勉強したいです。勉強したく ないです。来ます。来たいです。来たく ないです。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按题面和表格顺序人工整理，末两项按题面表格补全。"
      }
    },
    assets: [crop("l17-p1-a3-tai-form-table")],
    displayAssets: ["l17-p1-a3-tai-form-table"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "食べます",
          beforeKana: "たべます",
          after: [text("食べたいです／食べたく ないです")],
          afterKana: "たべたいです／たべたく ないです"
        }
      }
    ],
    items: [
      taiFormItem("l17-p1-a3-q1", "1", "聞きます", "聞きたいです", "聞きたく ないです", "ききます"),
      taiFormItem("l17-p1-a3-q2", "2", "飲みます", "飲みたいです", "飲みたく ないです", "のみます"),
      taiFormItem("l17-p1-a3-q3", "3", "帰ります", "帰りたいです", "帰りたく ないです", "かえります"),
      taiFormItem("l17-p1-a3-q4", "4", "持ちます", "持ちたいです", "持ちたく ないです", "もちます"),
      taiFormItem("l17-p1-a3-q5", "5", "買います", "買いたいです", "買いたく ないです", "かいます"),
      taiFormItem("l17-p1-a3-q6", "6", "話します", "話したいです", "話したく ないです", "はなします"),
      taiFormItem("l17-p1-a3-q7", "7", "見ます", "見たいです", "見たく ないです", "みます"),
      taiFormItem("l17-p1-a3-q8", "8", "起きます", "起きたいです", "起きたく ないです", "おきます"),
      taiFormItem("l17-p1-a3-q9", "9", "勉強します", "勉強したいです", "勉強したく ないです", "べんきょうします"),
      taiFormItem("l17-p1-a3-q10", "10", "来ます", "来たいです", "来たく ないです", "きます")
    ]
  },
  {
    id: "l17-p1-a4",
    section: "practice_1",
    order: 4,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    layout: [],
    itemGroups: [
      {
        id: "l17-p1-a4-g1",
        title: "[例1]",
        example: {
          label: "[例1]",
          before: "見ます／雪",
          beforeKana: "みます／ゆき",
          after: [text("甲：何を 見たいですか。\n乙：雪を 見たいです。")],
          afterKana: "なにを みたいですか。\nゆきを みたいです。"
        },
        items: [
          dialogueItem("l17-p1-a4-q1", "1", "します／サッカー", "甲：何を したいですか。\n乙：サッカーを したいです。"),
          dialogueItem("l17-p1-a4-q2", "2", "聞きます／クラシック", "甲：何を 聞きたいですか。\n乙：クラシックを 聞きたいです。", { promptKana: "ききます／クラシック" }),
          dialogueItem("l17-p1-a4-q3", "3", "食べます／寿司や 天ぷら", "甲：何を 食べたいですか。\n乙：寿司や 天ぷらを 食べたいです。", { promptKana: "たべます／すしや てんぷら" }),
          dialogueItem("l17-p1-a4-q4", "4", "読みます／日本の 雑誌", "甲：何を 読みたいですか。\n乙：日本の 雑誌を 読みたいです。", { promptKana: "よみます／にほんの ざっし" })
        ]
      },
      {
        id: "l17-p1-a4-g2",
        title: "[例2]",
        example: {
          label: "[例2]",
          before: "どこへ 行きたいですか",
          beforeKana: "どこへ いきたいですか",
          after: [text("甲：どこへ 行きたいですか。\n乙：どこでも いいです。")],
          afterKana: "どこへ いきたいですか。\nどこでも いいです。"
        },
        items: [
          dialogueItem("l17-p1-a4-q5", "5", "何時に 始めたいですか", "甲：何時に 始めたいですか。\n乙：何時でも いいです。", { promptKana: "なんじに はじめたいですか" }),
          dialogueItem("l17-p1-a4-q6", "6", "何を 飲みたいですか", "甲：何を 飲みたいですか。\n乙：何でも いいです。", { promptKana: "なにを のみたいですか" }),
          dialogueItem("l17-p1-a4-q7", "7", "どれが 欲しいですか", "甲：どれが 欲しいですか。\n乙：どれでも いいです。", { promptKana: "どれが ほしいですか" }),
          dialogueItem("l17-p1-a4-q8", "8", "いつ お風呂に 入りたいですか", "甲：いつ お風呂に 入りたいですか。\n乙：いつでも いいです。", { promptKana: "いつ おふろに はいりたいですか" })
        ]
      }
    ],
    items: []
  },
  {
    id: "l17-p1-a5",
    section: "practice_1",
    order: 5,
    title: "仿照例句，用（　　）中的词语回答提问。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "何を 見たいですか。（ドラマ）",
          beforeKana: "なにを みたいですか。（ドラマ）",
          after: [text("ドラマを 見たいです。")],
          afterKana: "ドラマを みたいです。"
        }
      }
    ],
    items: [
      answerItem("l17-p1-a5-q1", "1", "どこへ 旅行に 行きたいですか。（香港）", "香港へ 旅行に 行きたいです。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "どこへ りょこうに いきたいですか。（ホンコン）" }),
      answerItem("l17-p1-a5-q2", "2", "いつ 買い物に 行きたいですか。（あさって）", "あさって 買い物に 行きたいです。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "いつ かいものに いきたいですか。（あさって）" }),
      answerItem("l17-p1-a5-q3", "3", "だれに 会いたいですか。（大学の 先輩）", "大学の 先輩に 会いたいです。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "だれに あいたいですか。（だいがくの せんぱい）" }),
      answerItem("l17-p1-a5-q4", "4", "何を 買いたいですか。（暖かくて 軽い コート）", "暖かくて 軽い コートを 買いたいです。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "なにを かいたいですか。（あたたかくて かるい コート）" }),
      answerItem("l17-p1-a5-q5", "5", "何を 飲みたいですか。（熱い コーヒーか 紅茶）", "熱い コーヒーか 紅茶を 飲みたいです。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "なにを のみたいですか。（あつい コーヒーか こうちゃ）" }),
      answerItem("l17-p1-a5-q6", "6", "どんな 所に 住みたいですか。（きれいで 静かな 所）", "きれいで 静かな 所に 住みたいです。", { responseScope: "answer_only", responseScopeHint: answerOnlyHint, promptKana: "どんな ところに すみたいですか。（きれいで しずかな ところ）" })
    ]
  },
  {
    id: "l17-p1-a6",
    section: "practice_1",
    order: 6,
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
          before: "野球を します（はい）",
          beforeKana: "やきゅうを します（はい）",
          after: [text("甲：野球を したいですか。\n乙：はい、したいです。／いいえ、したく ないです。")],
          afterKana: "やきゅうを したいですか。\nはい、したいです。／いいえ、したく ないです。"
        }
      }
    ],
    items: [
      dialogueItem("l17-p1-a6-q1", "1", "歌舞伎を 見ます（はい）", "甲：歌舞伎を 見たいですか。\n乙：はい、見たいです。", { promptKana: "かぶきを みます（はい）" }),
      dialogueItem("l17-p1-a6-q2", "2", "映画に 行きます（いいえ）", "甲：映画に 行きたいですか。\n乙：いいえ、行きたく ないです。", { promptKana: "えいがに いきます（いいえ）" }),
      dialogueItem("l17-p1-a6-q3", "3", "東京に 住みます（いいえ）", "甲：東京に 住みたいですか。\n乙：いいえ、住みたく ないです。", { promptKana: "とうきょうに すみます（いいえ）" }),
      dialogueItem("l17-p1-a6-q4", "4", "コンピュータの 会社で 働きます（はい）", "甲：コンピュータの 会社で 働きたいですか。\n乙：はい、働きたいです。", { promptKana: "コンピュータの かいしゃで はたらきます（はい）" }),
      dialogueItem("l17-p1-a6-q5", "5", "ベートーベンや ショパンの 音楽を 聞きます（はい）", "甲：ベートーベンや ショパンの 音楽を 聞きたいですか。\n乙：はい、聞きたいです。", { promptKana: "ベートーベンや ショパンの おんがくを ききます（はい）" })
    ]
  },
  {
    id: "l17-p1-a7",
    section: "practice_1",
    order: 7,
    title: "仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 7),
      label: "第17课 练习I-7",
      transcript: {
        text: "コンサートに 行きます。コンサートに 行きませんか。ええ、行きましょう。あそこで 写真を 撮ります。あそこで 写真を 撮りませんか。ええ、撮りましょう。日曜日に サッカーを します。日曜日に サッカーを しませんか。ええ、しましょう。あの 喫茶店で お茶を 飲みます。あの 喫茶店で お茶を 飲みませんか。ええ、飲みましょう。いっしょに 昼ご飯を 食べます。いっしょに 昼ご飯を 食べませんか。ええ、食べましょう。中国。北京か 上海。中国へ 遊びに 行きたいですね。ええ、行きたいです。中国の どこが いいですか。北京か 上海が いいです。いつが いいですか。春ですか、夏ですか。いつでも いいです。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按题面人工整理；ASR 尾部漏识别，后半组按题面例句和录音模式补全。"
      }
    },
    layout: [],
    itemGroups: [
      {
        id: "l17-p1-a7-g1",
        title: "[例1]",
        example: {
          label: "[例1]",
          before: "コンサートに 行きます。",
          beforeKana: "コンサートに いきます。",
          after: [text("甲：コンサートに 行きませんか。\n乙：ええ、行きましょう。")],
          afterKana: "コンサートに いきませんか。\nええ、いきましょう。"
        },
        items: [
          dialogueItem("l17-p1-a7-q1", "1", "あそこで 写真を 撮ります", "甲：あそこで 写真を 撮りませんか。\n乙：ええ、撮りましょう。", { promptKana: "あそこで しゃしんを とります", answerSource: "audio" }),
          dialogueItem("l17-p1-a7-q2", "2", "日曜日に サッカーを します", "甲：日曜日に サッカーを しませんか。\n乙：ええ、しましょう。", { promptKana: "にちようびに サッカーを します", answerSource: "audio" }),
          dialogueItem("l17-p1-a7-q3", "3", "あの 喫茶店で お茶を 飲みます", "甲：あの 喫茶店で お茶を 飲みませんか。\n乙：ええ、飲みましょう。", { promptKana: "あの きっさてんで おちゃを のみます", answerSource: "audio" }),
          dialogueItem("l17-p1-a7-q4", "4", "いっしょに 昼ご飯を 食べます", "甲：いっしょに 昼ご飯を 食べませんか。\n乙：ええ、食べましょう。", { promptKana: "いっしょに ひるごはんを たべます", answerSource: "audio" })
        ]
      },
      {
        id: "l17-p1-a7-g2",
        title: "[例2]",
        example: {
          label: "[例2]",
          before: "中国／北京か 上海",
          beforeKana: "ちゅうごく／ペキンか シャンハイ",
          after: [text("甲：中国へ 遊びに 行きたいですね。\n乙：ええ、行きたいです。\n甲：中国の どこが いいですか。\n乙：北京か 上海が いいです。\n甲：いつが いいですか。春ですか、夏ですか。\n乙：いつでも いいです。")],
          afterKana: "ちゅうごくへ あそびに いきたいですね。\nええ、いきたいです。\nちゅうごくの どこが いいですか。\nペキンか シャンハイが いいです。\nいつが いいですか。はるですか、なつですか。\nいつでも いいです。"
        },
        items: [
          dialogueItem("l17-p1-a7-q5", "5", "日本／京都か 奈良", "甲：日本へ 遊びに 行きたいですね。\n乙：ええ、行きたいです。\n甲：日本の どこが いいですか。\n乙：京都か 奈良が いいです。\n甲：いつが いいですか。春ですか、夏ですか。\n乙：いつでも いいです。", { promptKana: "にほん／きょうとか なら", answerSource: "audio", rows: 7 }),
          dialogueItem("l17-p1-a7-q6", "6", "ヨーロッパ／フランスか スイス", "甲：ヨーロッパへ 遊びに 行きたいですね。\n乙：ええ、行きたいです。\n甲：ヨーロッパの どこが いいですか。\n乙：フランスか スイスが いいです。\n甲：いつが いいですか。春ですか、夏ですか。\n乙：いつでも いいです。", { answerSource: "audio", rows: 7 })
        ]
      }
    ],
    items: []
  },
  {
    id: "l17-p2-a1",
    section: "practice_2",
    order: 1,
    title: "从□中选择适当的词语，变成适当的形式填入（　　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "phrase",
    responseScope: "phrase_only",
    responseScopeHint: completionHint,
    layout: [
      { type: "word_bank", words: [text("立派", { kana: "りっぱ" }), text("難しい", { kana: "むずかしい" }), text("欲しい", { kana: "ほしい" }), text("熱い", { kana: "あつい" }), text("高い", { kana: "たかい" }), text("楽しい", { kana: "たのしい" })] },
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("この スープは あまり（"), blank("example"), text("）です。")],
          beforeKana: "この スープは あまり（______）です。",
          after: [text("熱く ない")],
          afterKana: "あつく ない"
        }
      }
    ],
    items: [
      blankItem("l17-p2-a1-q1", "1", [text("わたしは 新しい パソコンが（"), blank("answer"), text("）です。")], { answer: "欲しい" }, { promptKana: "わたしは あたらしい パソコンが（______）です。", responseScopeHint: completionHint }),
      blankItem("l17-p2-a1-q2", "2", [text("天安門は とても（"), blank("answer"), text("）建物です。")], { answer: "立派な" }, { promptKana: "てんあんもんは とても（______）たてものです。", responseScopeHint: completionHint }),
      blankItem("l17-p2-a1-q3", "3", [text("先週の 旅行は とても（"), blank("answer"), text("）です。")], { answer: "楽しかった" }, { promptKana: "せんしゅうの りょこうは とても（______）です。", responseScopeHint: completionHint }),
      blankItem("l17-p2-a1-q4", "4", [text("あの 人は 背が（"), blank("answer"), text("）て、ハンサムな 人です。")], { answer: "高く" }, { promptKana: "あの ひとは せが（______）て、ハンサムな ひとです。", responseScopeHint: completionHint }),
      blankItem("l17-p2-a1-q5", "5", [text("昨日の 試験は あまり（"), blank("answer"), text("）です。")], { answer: "難しく なかった" }, { promptKana: "きのうの しけんは あまり（______）です。", responseScopeHint: completionHint })
    ]
  },
  {
    id: "l17-p2-a2",
    section: "practice_2",
    order: 2,
    title: "从□中选择适当的词语填入（　　）中。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    responseScopeHint: completionHint,
    layout: [
      { type: "word_bank", words: [text("何", { kana: "なに" }), text("何", { kana: "なん" }), text("どこ"), text("いくら"), text("どちら"), text("だれ"), text("どんな"), text("どう")] },
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("これは（"), blank("example"), text("）のですか。")],
          beforeKana: "これは（______）のですか。",
          after: [text("だれ")]
        }
      }
    ],
    items: [
      blankItem("l17-p2-a2-q1", "1", [text("（"), blank("answer"), text("）音楽を 聞きたいですか。")], { answer: "どんな" }, { promptKana: "（______）おんがくを ききたいですか。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "word" }),
      blankItem("l17-p2-a2-q2", "2", [text("京都は（"), blank("answer"), text("）でしたか。")], { answer: "どう" }, { promptKana: "きょうとは（______）でしたか。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "word" }),
      blankItem("l17-p2-a2-q3", "3", [text("（"), blank("answer"), text("）も 欲しく ないです。")], { answer: "何" }, { promptKana: "（______）も ほしく ないです。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "word" }),
      blankItem("l17-p2-a2-q4", "4", [text("コーヒーと 紅茶と どちらが いいですか。——（"), blank("answer"), text("）でも いいです。")], { answer: "どちら" }, { promptKana: "コーヒーと こうちゃと どちらが いいですか。——（______）でも いいです。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "word" }),
      blankItem("l17-p2-a2-q5", "5", [text("ぜひ 欲しいです。（"), blank("answer"), text("）でも いいですから。")], { answer: "いくら" }, { promptKana: "ぜひ ほしいです。（______）でも いいですから。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "word" }),
      blankItem("l17-p2-a2-q6", "6", [text("何を 食べたいですか。——（"), blank("answer"), text("）でも いいです。")], { answer: "何" }, { promptKana: "なにを たべたいですか。——（______）でも いいです。", responseScope: "word_only", responseScopeHint: completionHint, expectedUnit: "word" })
    ]
  },
  {
    id: "l17-p2-a3",
    section: "practice_2",
    order: 3,
    title: "听录音，与录音内容一致的在（　　）中画○，不一致的画×。",
    instruction: "",
    interaction: "true_false",
    answerUnit: "boolean",
    responseScope: "boolean_only",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "第17课 练习II-3",
      transcript: {
        text: "李さんは 小さくて 軽い ノートパソコンが 欲しいです。李さんは パソコンを 買いに 新宿へ 行きました。でも、ノートパソコンは とても 高かったです。李さんは パソコンを 買いませんでした。新宿は いつも 人が 多くて とても にぎやかですから、李さんは 疲れました。喫茶店で お茶を 飲んでから 帰りました。李さんは パソコンを 買いに 新宿へ 行きました。李さんは 小さくて 軽い ノートパソコンが 欲しいです。ノートパソコンは 安かったです。李さんは パソコンを 買いました。李さんは 全然 疲れませんでした。李さんは 喫茶店で お茶を 飲んでから 帰りました。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按题面人工整理。",
        segments: [
          { itemNumber: "例", text: "李さんは パソコンを 買いに 新宿へ 行きました。" },
          { itemNumber: "1", text: "李さんは 小さくて 軽い ノートパソコンが 欲しいです。" },
          { itemNumber: "2", text: "ノートパソコンは 安かったです。" },
          { itemNumber: "3", text: "李さんは パソコンを 買いました。" },
          { itemNumber: "4", text: "李さんは 全然 疲れませんでした。" },
          { itemNumber: "5", text: "李さんは 喫茶店で お茶を 飲んでから 帰りました。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "李さんは、パソコンを 買いに 新宿へ 行きました。",
          beforeKana: "りさんは、パソコンを かいに しんじゅくへ いきました。",
          after: [text("○")]
        }
      }
    ],
    items: [
      trueFalseItem("l17-p2-a3-q1", "1", "听第 1 项并判断。", true),
      trueFalseItem("l17-p2-a3-q2", "2", "听第 2 项并判断。", false),
      trueFalseItem("l17-p2-a3-q3", "3", "听第 3 项并判断。", false),
      trueFalseItem("l17-p2-a3-q4", "4", "听第 4 项并判断。", false),
      trueFalseItem("l17-p2-a3-q5", "5", "听第 5 项并判断。", true)
    ]
  },
  {
    id: "l17-p2-a4",
    section: "practice_2",
    order: 4,
    title: "根据自己的实际情况回答提问。",
    instruction: "",
    interaction: "role_play",
    answerUnit: "free_text",
    responseScope: "free_response",
    responseScopeHint: "根据自己的实际情况回答。",
    layout: [],
    items: [
      personalItem("l17-p2-a4-q1", "1", "今 何が いちばん 欲しいですか。", "いま なにが いちばん ほしいですか。", "新しい パソコンが 欲しいです。"),
      personalItem("l17-p2-a4-q2", "2", "にぎやかな 所と 静かな 所と、どちらに 住みたいですか。", "にぎやかな ところと しずかな ところと、どちらに すみたいですか。", "静かな 所に 住みたいです。"),
      personalItem("l17-p2-a4-q3", "3", "日曜日は 家で 休みたいですか、町へ 遊びに 行きたいですか。", "にちようびは いえで やすみたいですか、まちへ あそびに いきたいですか。", "町へ 遊びに 行きたいです。"),
      personalItem("l17-p2-a4-q4", "4", "金曜日、仕事が 終わってから、カラオケに 行きませんか。", "きんようび、しごとが おわってから、カラオケに いきませんか。", "ええ、行きましょう。")
    ]
  },
  {
    id: "l17-p2-a5",
    section: "practice_2",
    order: 5,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "dialogue",
    responseScope: "question_and_answer",
    responseScopeHint: "写出完整问答。",
    layout: [],
    items: [
      dialogueItem("l17-p2-a5-q1", "1", "（你）现在最想要什么？——想要辆便宜点儿的车。", "今 何が いちばん 欲しいですか。\n安い 車が 欲しいです。", { answerSource: "prompt", rows: 3 }),
      dialogueItem("l17-p2-a5-q2", "2", "小李，（你）想吃什么？——什么都行。", "李さん、何を 食べたいですか。\n何でも いいです。", { answerSource: "prompt", rows: 3 }),
      dialogueItem("l17-p2-a5-q3", "3", "星期六下午去听音乐会好吗？——好啊，去吧。", "土曜日の 午後、コンサートに 行きませんか。\nええ、行きましょう。", { answerSource: "prompt", rows: 3 })
    ]
  }
];

export const lesson17Practice: LessonPractice = {
  lessonId: "lesson17",
  title: "第17課 わたしは 新しい 洋服が 欲しいです",
  sourcePages: [
    { pageNo: 212, imagePath: page(212) },
    { pageNo: 213, imagePath: page(213) },
    { pageNo: 214, imagePath: page(214) }
  ],
  activities
};
