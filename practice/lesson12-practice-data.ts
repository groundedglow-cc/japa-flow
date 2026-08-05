import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";
import { lesson12ImageCrops } from "./lesson12-image-crops";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson12/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit3/lesson12/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const repl = (value: string, substitutionKey: string, options: Omit<RichText, "type" | "text" | "underline" | "substitutionKey"> = {}): RichText =>
  text(value, { ...options, underline: true, substitutionKey });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });
const crop = (id: string) => lesson12ImageCrops.assets.find((asset) => asset.id === id)!;

const answerOnlyHint = "只填写提问后的回答部分，不需要重写问题。";
const sentenceSlot = (placeholder = "输入完整回答"): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder }];
const multilineSentenceSlot = (placeholder = "输入完整回答", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "sentence", width: "long", multiline: true, rows, placeholder }
];
const dialogueSlot = (placeholder = "输入完整对话", rows = 4): InputSlot[] => [
  { id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows, placeholder }
];
const shortSlots = (slotIds: string[]): InputSlot[] => slotIds.map((slotId) => ({ id: slotId, expectedUnit: "phrase", width: "medium", placeholder: "输入词语" }));

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
    evaluationMode?: PracticeItem["evaluationMode"];
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
  evaluationMode: options.evaluationMode,
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
  promptKana?: string,
  rows = 4
): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "example_transform",
  responseScope: "dialogue_only",
  inputSlots: dialogueSlot("输入完整对话", rows),
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
  inputSlots: shortSlots(Object.keys(answers)),
  answer: { slotValues: answers }
});

const slotItem = (
  id: string,
  number: string,
  prompt: string | PromptPart[],
  slots: InputSlot[],
  answers: Record<string, string>,
  options: {
    promptKana?: string;
    answerSource?: PracticeItem["answerSource"];
    responseScope?: PracticeItem["responseScope"];
    responseScopeHint?: string;
  } = {}
): PracticeItem => ({
  id,
  number,
  prompt: typeof prompt === "string" ? [text(prompt)] : prompt,
  promptKana: options.promptKana,
  instruction: "",
  answerSource: options.answerSource || "prompt",
  responseScope: options.responseScope || "custom",
  responseScopeHint: options.responseScopeHint,
  inputSlots: slots,
  answer: { slotValues: answers }
});

const personalItem = (id: string, number: string, prompt: string, promptKana?: string): PracticeItem => ({
  id,
  number,
  prompt: [text(prompt)],
  promptKana,
  instruction: "",
  answerSource: "personal",
  evaluationMode: "manual_review",
  responseScope: "free_response",
  inputSlots: sentenceSlot("按自己的情况回答")
});

const activities: PracticeActivity[] = [
  {
    id: "l12-p1-a1",
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
          before: "李さん／森さん／若い",
          beforeKana: "りさん／もりさん／わかい",
          after: [repl("李さん", "subject", { kana: "りさん" }), text("は "), repl("森さん", "comparison", { kana: "もりさん" }), text("より "), repl("若い", "predicate", { kana: "わかい" }), text("です。")],
          afterKana: "りさんは もりさんより わかいです。"
        }
      }
    ],
    items: [
      answerItem("l12-p1-a1-q1", "1", "10月／9月／涼しい", "10月は 9月より 涼しいです。", { promptKana: "じゅうがつ／くがつ／すずしい" }),
      answerItem("l12-p1-a1-q2", "2", "森さん／吉田さん／元気", "森さんは 吉田さんより 元気です。", { promptKana: "もりさん／よしださん／げんき" }),
      answerItem("l12-p1-a1-q3", "3", "上海／北京／にぎやか", "上海は 北京より にぎやかです。", { promptKana: "シャンハイ／ペキン／にぎやか" }),
      answerItem("l12-p1-a1-q4", "4", "奈良／京都／静か", "奈良は 京都より 静かです。", { promptKana: "なら／きょうと／しずか" }),
      answerItem("l12-p1-a1-q5", "5", "今日／昨日／暖かい", "今日は 昨日より 暖かいです。", { promptKana: "きょう／きのう／あたたかい" }),
      answerItem("l12-p1-a1-q6", "6", "電車／バス／速い", "電車は バスより 速いです。", { promptKana: "でんしゃ／バス／はやい" })
    ]
  },
  {
    id: "l12-p1-a2",
    section: "practice_1",
    order: 2,
    title: "边看图边听录音，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 2),
      label: "第12课 练习I-2",
      transcript: {
        text: "李さんと 森さんと、どちらが 若いですか。李さんの ほうが 若いです。リンゴと ミカンと、どちらが 高いですか。リンゴの ほうが 高いです。森さんと 吉田さんと、どちらが 歌が 上手ですか。森さんの ほうが 上手です。飛行機と 新幹線と、どちらが 速いですか。飛行機の ほうが 速いです。李さんと 小野さんと、どちらが きれいですか。どちらも きれいです。テニスと サッカーと、どちらが 好きですか。どちらも 好きです。英語と 日本語と、どちらが 難しいですか。どちらも 難しいです。スミスさんと ジョンソンさんと、どちらが 背が 高いですか。どちらも 背が 高いです。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按教材图片人工校正人名和尾部分段。",
        segments: [
          { itemNumber: "例1", text: "李さんと 森さんと、どちらが 若いですか。李さんの ほうが 若いです。" },
          { itemNumber: "1", text: "リンゴと ミカンと、どちらが 高いですか。リンゴの ほうが 高いです。" },
          { itemNumber: "2", text: "森さんと 吉田さんと、どちらが 歌が 上手ですか。森さんの ほうが 上手です。" },
          { itemNumber: "3", text: "飛行機と 新幹線と、どちらが 速いですか。飛行機の ほうが 速いです。" },
          { itemNumber: "例2", text: "李さんと 小野さんと、どちらが きれいですか。どちらも きれいです。" },
          { itemNumber: "4", text: "テニスと サッカーと、どちらが 好きですか。どちらも 好きです。" },
          { itemNumber: "5", text: "英語と 日本語と、どちらが 難しいですか。どちらも 難しいです。" },
          { itemNumber: "6", text: "スミスさんと ジョンソンさんと、どちらが 背が 高いですか。どちらも 背が 高いです。" }
        ]
      }
    },
    assets: [crop("l12-p1-a2-comparison-pictures-group1"), crop("l12-p1-a2-comparison-pictures-group2")],
    layout: [],
    itemGroups: [
      {
        id: "l12-p1-a2-g1",
        displayAssets: ["l12-p1-a2-comparison-pictures-group1"],
        example: {
          id: "l12-p1-a2-ex1",
          label: "[例1]",
          before: "森さん／李さん　若い",
          beforeKana: "もりさん／りさん　わかい",
          after: [text("森さんと 李さんと、どちらが 若いですか。——李さんの ほうが 若いです。")],
          afterKana: "もりさんと りさんと、どちらが わかいですか。——りさんの ほうが わかいです。"
        },
        items: [
          answerItem("l12-p1-a2-q1", "1", "リンゴ／ミカン　高い", "リンゴの ほうが 高いです。", {
            answerSource: "audio",
            responseScope: "answer_only",
            responseScopeHint: answerOnlyHint,
            promptKana: "リンゴ／ミカン　たかい"
          }),
          answerItem("l12-p1-a2-q2", "2", "森さん／吉田さん　歌が 上手", "森さんの ほうが 歌が 上手です。", {
            answerSource: "audio",
            responseScope: "answer_only",
            responseScopeHint: answerOnlyHint,
            promptKana: "もりさん／よしださん　うたが じょうず"
          }),
          answerItem("l12-p1-a2-q3", "3", "飛行機／新幹線　速い", "飛行機の ほうが 速いです。", {
            answerSource: "audio",
            responseScope: "answer_only",
            responseScopeHint: answerOnlyHint,
            promptKana: "ひこうき／しんかんせん　はやい"
          })
        ]
      },
      {
        id: "l12-p1-a2-g2",
        displayAssets: ["l12-p1-a2-comparison-pictures-group2"],
        example: {
          id: "l12-p1-a2-ex2",
          label: "[例2]",
          before: "李さん／小野さん　きれい",
          beforeKana: "りさん／おのさん　きれい",
          after: [text("李さんと 小野さんと、どちらが きれいですか。——どちらも きれいです。")],
          afterKana: "りさんと おのさんと、どちらが きれいですか。——どちらも きれいです。"
        },
        items: [
          answerItem("l12-p1-a2-q4", "4", "テニス／サッカー　好き", "どちらも 好きです。", {
            answerSource: "audio",
            responseScope: "answer_only",
            responseScopeHint: answerOnlyHint,
            promptKana: "テニス／サッカー　すき"
          }),
          answerItem("l12-p1-a2-q5", "5", "英語／日本語　難しい", "どちらも 難しいです。", {
            answerSource: "audio",
            responseScope: "answer_only",
            responseScopeHint: answerOnlyHint,
            promptKana: "えいご／にほんご　むずかしい"
          }),
          answerItem("l12-p1-a2-q6", "6", "スミスさん／ジョンソンさん　背が 高い", "どちらも 背が 高いです。", {
            answerSource: "audio",
            responseScope: "answer_only",
            responseScopeHint: answerOnlyHint,
            promptKana: "スミスさん／ジョンソンさん　せが たかい"
          })
        ]
      }
    ],
    items: []
  },
  {
    id: "l12-p1-a3",
    section: "practice_1",
    order: 3,
    title: "仿照例句替换画线部分进行练习。",
    instruction: "",
    interaction: "pattern_substitution",
    answerUnit: "sentence",
    responseScope: "custom",
    responseScopeHint: "按对应例句写出完整句子或完整问答。",
    layout: [],
    itemGroups: [
      {
        id: "l12-p1-a3-g1",
        example: {
          id: "l12-p1-a3-ex1",
          label: "[例1]",
          before: "森さん／李さん／若い　　神戸／大阪／にぎやか",
          beforeKana: "もりさん／りさん／わかい　　こうべ／おおさか／にぎやか",
          after: [
            repl("森さん", "subject", { kana: "もりさん" }),
            text("は "),
            repl("李さん", "comparison", { kana: "りさん" }),
            text("ほど "),
            repl("若く ない", "predicate", { kana: "わかく ない" }),
            text("です。／"),
            repl("神戸", "subject", { kana: "こうべ" }),
            text("は "),
            repl("大阪", "comparison", { kana: "おおさか" }),
            text("ほど "),
            repl("にぎやかでは ありません", "predicate", { kana: "にぎやかでは ありません" }),
            text("。")
          ],
          afterKana: "もりさんは りさんほど わかく ないです。／こうべは おおさかほど にぎやかでは ありません。"
        },
        items: [
          answerItem("l12-p1-a3-q1", "1", "今日／昨日／暑い", "今日は 昨日ほど 暑く ないです。", { promptKana: "きょう／きのう／あつい", responseScope: "sentence_only" }),
          answerItem("l12-p1-a3-q2", "2", "京都／奈良／静か", "京都は 奈良ほど 静かでは ありません。", { promptKana: "きょうと／なら／しずか", responseScope: "sentence_only" }),
          answerItem("l12-p1-a3-q3", "3", "この 店／あの 店／おいしい", "この 店は あの 店ほど おいしく ないです。", { promptKana: "この みせ／あの みせ／おいしい", responseScope: "sentence_only" }),
          answerItem("l12-p1-a3-q4", "4", "富士山／エベレスト／高い", "富士山は エベレストほど 高く ないです。", { promptKana: "ふじさん／エベレスト／たかい", responseScope: "sentence_only" }),
          answerItem("l12-p1-a3-q5", "5", "バス／地下鉄／便利", "バスは 地下鉄ほど 便利では ありません。", { promptKana: "バス／ちかてつ／べんり", responseScope: "sentence_only" }),
          answerItem("l12-p1-a3-q6", "6", "日本語／中国語／難しい", "日本語は 中国語ほど 難しく ないです。", { promptKana: "にほんご／ちゅうごくご／むずかしい", responseScope: "sentence_only" })
        ]
      },
      {
        id: "l12-p1-a3-g2",
        example: {
          id: "l12-p1-a3-ex2",
          label: "[例2]",
          before: "スポーツ／好き／サッカー",
          beforeKana: "スポーツ／すき／サッカー",
          after: [text("甲：スポーツの 中で 何が いちばん 好きですか。\n乙：サッカーが いちばん 好きです。")],
          afterKana: "スポーツの なかで なにが いちばん すきですか。\nサッカーが いちばん すきです。"
        },
        items: [
          dialogueItem("l12-p1-a3-q7", "7", "飲み物／好き／ウーロン茶", "甲：飲み物の 中で 何が いちばん 好きですか。\n乙：ウーロン茶が いちばん 好きです。", "のみもの／すき／ウーロンちゃ", 3),
          dialogueItem("l12-p1-a3-q8", "8", "音楽／好き／ロック", "甲：音楽の 中で 何が いちばん 好きですか。\n乙：ロックが いちばん 好きです。", "おんがく／すき／ロック", 3),
          dialogueItem("l12-p1-a3-q9", "9", "食べ物／好き／肉", "甲：食べ物の 中で 何が いちばん 好きですか。\n乙：肉が いちばん 好きです。", "たべもの／すき／にく", 3)
        ]
      },
      {
        id: "l12-p1-a3-g3",
        example: {
          id: "l12-p1-a3-ex3",
          label: "[例3]",
          before: "クラス／ハンサム／張さん",
          beforeKana: "クラス／ハンサム／ちょうさん",
          after: [text("甲：クラスの 中で だれが いちばん ハンサムですか。\n乙：張さんが いちばん ハンサムです。")],
          afterKana: "クラスの なかで だれが いちばん ハンサムですか。\nちょうさんが いちばん ハンサムです。"
        },
        items: [
          dialogueItem("l12-p1-a3-q10", "10", "会社／忙しい／社長", "甲：会社の 中で だれが いちばん 忙しいですか。\n乙：社長が いちばん 忙しいです。", "かいしゃ／いそがしい／しゃちょう", 3),
          dialogueItem("l12-p1-a3-q11", "11", "家族／歌が 好き／兄", "甲：家族の 中で だれが いちばん 歌が 好きですか。\n乙：兄が いちばん 歌が 好きです。", "かぞく／うたが すき／あに", 3),
          dialogueItem("l12-p1-a3-q12", "12", "友達／英語が 上手／林さん", "甲：友達の 中で だれが いちばん 英語が 上手ですか。\n乙：林さんが いちばん 英語が 上手です。", "ともだち／えいごが じょうず／はやしさん", 3)
        ]
      }
    ],
    items: []
  },
  {
    id: "l12-p1-a4",
    section: "practice_1",
    order: 4,
    title: "听录音，仿照例句回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "sentence",
    responseScope: "answer_only",
    responseScopeHint: answerOnlyHint,
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(1, 4),
      label: "第12课 练习I-4",
      transcript: {
        text: "北京は 東京より 寒いですか。ええ、北京は 東京より ずっと 寒いです。チョモランマは 富士山より 高いですか。ええ、チョモランマは 富士山より ずっと 高いです。先週は 今週より 暇でしたか。ええ、先週は 今週より ずっと 暇でした。メールは 手紙より 速いですか。ええ、メールは 手紙より ずっと 速いです。昨日は 今日より 忙しかったですか。ええ、昨日は 今日より ずっと 忙しかったです。李さんは 張さんより 日本語が 上手ですか。ええ、李さんは 張さんより ずっと 日本語が 上手です。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按教材图片和分段转写人工校正。",
        segments: [
          { itemNumber: "例", text: "北京は 東京より 寒いですか。ええ、北京は 東京より ずっと 寒いです。" },
          { itemNumber: "1", text: "チョモランマは 富士山より 高いですか。ええ、チョモランマは 富士山より ずっと 高いです。" },
          { itemNumber: "2", text: "先週は 今週より 暇でしたか。ええ、先週は 今週より ずっと 暇でした。" },
          { itemNumber: "3", text: "メールは 手紙より 速いですか。ええ、メールは 手紙より ずっと 速いです。" },
          { itemNumber: "4", text: "昨日は 今日より 忙しかったですか。ええ、昨日は 今日より ずっと 忙しかったです。" },
          { itemNumber: "5", text: "李さんは 張さんより 日本語が 上手ですか。ええ、李さんは 張さんより ずっと 日本語が 上手です。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "北京／東京／寒いです",
          beforeKana: "ペキン／とうきょう／さむいです",
          after: [text("北京は 東京より 寒いですか。——ええ、北京は 東京より ずっと 寒いです。")],
          afterKana: "ペキンは とうきょうより さむいですか。——ええ、ペキンは とうきょうより ずっと さむいです。"
        }
      }
    ],
    items: [
      answerItem("l12-p1-a4-q1", "1", "チョモランマ／富士山／高いです", "ええ、チョモランマは 富士山より ずっと 高いです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "チョモランマ／ふじさん／たかいです"
      }),
      answerItem("l12-p1-a4-q2", "2", "先週／今週／暇でした", "ええ、先週は 今週より ずっと 暇でした。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "せんしゅう／こんしゅう／ひまでした"
      }),
      answerItem("l12-p1-a4-q3", "3", "メール／手紙／速いです", "ええ、メールは 手紙より ずっと 速いです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "メール／てがみ／はやいです"
      }),
      answerItem("l12-p1-a4-q4", "4", "昨日／今日／忙しかったです", "ええ、昨日は 今日より ずっと 忙しかったです。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "きのう／きょう／いそがしかったです"
      }),
      answerItem("l12-p1-a4-q5", "5", "李さん／張さん／日本語が 上手です", "ええ、李さんは 張さんより ずっと 日本語が 上手です。", {
        answerSource: "audio",
        responseScope: "answer_only",
        responseScopeHint: answerOnlyHint,
        promptKana: "りさん／ちょうさん／にほんごが じょうずです"
      })
    ]
  },
  {
    id: "l12-p1-a5",
    section: "practice_1",
    order: 5,
    title: "仿照例句替换画线部分练习会话。",
    instruction: "",
    interaction: "dialogue_practice",
    answerUnit: "dialogue",
    responseScope: "dialogue_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "ウーロン茶／ジャスミン茶",
          beforeKana: "ウーロンちゃ／ジャスミンちゃ",
          after: [text("甲：ウーロン茶と ジャスミン茶と、どちらが おいしいですか。\n乙：どちらも おいしいですよ。わたしは ジャスミン茶の ほうが 好きですが…。")],
          afterKana: "ウーロンちゃと ジャスミンちゃと、どちらが おいしいですか。\nどちらも おいしいですよ。わたしは ジャスミンちゃの ほうが すきですが…。 "
        }
      }
    ],
    items: [
      dialogueItem("l12-p1-a5-q1", "1", "中国の お茶／日本の お茶", "甲：中国の お茶と 日本の お茶と、どちらが おいしいですか。\n乙：どちらも おいしいですよ。わたしは 日本の お茶の ほうが 好きですが…。", "ちゅうごくの おちゃ／にほんの おちゃ", 4),
      dialogueItem("l12-p1-a5-q2", "2", "コーヒー／紅茶", "甲：コーヒーと 紅茶と、どちらが おいしいですか。\n乙：どちらも おいしいですよ。わたしは 紅茶の ほうが 好きですが…。", "コーヒー／こうちゃ", 4),
      dialogueItem("l12-p1-a5-q3", "3", "コーラ／ジュース", "甲：コーラと ジュースと、どちらが おいしいですか。\n乙：どちらも おいしいですよ。わたしは ジュースの ほうが 好きですが…。", "コーラ／ジュース", 4)
    ]
  },
  {
    id: "l12-p2-a1",
    section: "practice_2",
    order: 1,
    title: "在（　　）中填入适当的词语。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("明日（"), blank("example"), text("）へ 行きますか。——北京へ 行きます。")],
          beforeKana: "あした（______）へ いきますか。——ペキンへ いきます。",
          after: [text("どこ")],
          afterKana: "どこ"
        }
      }
    ],
    items: [
      blankItem("l12-p2-a1-q1", "1", [text("リンゴと バナナと（"), blank("answer"), text("）が 好きですか。——リンゴの ほうが 好きです。")], { answer: "どちら" }, { promptKana: "リンゴと バナナと（______）が すきですか。——リンゴの ほうが すきです。", responseScope: "word_only" }),
      blankItem("l12-p2-a1-q2", "2", [text("家族の 中で（"), blank("answer"), text("）が いちばん 元気ですか。——母が いちばん 元気です。")], { answer: "だれ" }, { promptKana: "かぞくの なかで（______）が いちばん げんきですか。——ははが いちばん げんきです。", responseScope: "word_only" }),
      blankItem("l12-p2-a1-q3", "3", [text("田中さんは（"), blank("answer"), text("）人ですか。——とても おもしろい 人です。")], { answer: "どんな" }, { promptKana: "たなかさんは（______）ひとですか。——とても おもしろい ひとです。", responseScope: "word_only" }),
      blankItem("l12-p2-a1-q4", "4", [text("昨日 来ませんでしたね。（"), blank("answer"), text("）ですか。——足が 痛かったからです。")], { answer: "どうして" }, { promptKana: "きのう きませんでしたね。（______）ですか。——あしが いたかったからです。", responseScope: "word_only" })
    ]
  },
  {
    id: "l12-p2-a2",
    section: "practice_2",
    order: 2,
    title: "看图，在（　　）中填入适当的词语。",
    instruction: "",
    interaction: "fill_blank",
    answerUnit: "word",
    responseScope: "word_only",
    assets: [crop("l12-p2-a2-tokyo-temperature-chart")],
    displayAssets: ["l12-p2-a2-tokyo-temperature-chart"],
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          beforeParts: [text("（"), blank("example"), text("）月が いちばん 暑いです。")],
          beforeKana: "（______）がつが いちばん あついです。",
          after: [text("7")],
          afterKana: "しち"
        }
      }
    ],
    items: [
      blankItem("l12-p2-a2-q1", "1", [text("（"), blank("answer"), text("）月が いちばん 寒いです。")], { answer: "1" }, { promptKana: "（______）がつが いちばん さむいです。", responseScope: "word_only" }),
      blankItem("l12-p2-a2-q2", "2", [text("12月は 2月ほど （"), blank("answer"), text("）く ないです。")], { answer: "寒" }, { promptKana: "じゅうにがつは にがつほど（______）く ないです。", responseScope: "word_only" }),
      blankItem("l12-p2-a2-q3", "3", [text("7月と 8月は、どちらも （"), blank("answer"), text("）です。")], { answer: "暑い" }, { promptKana: "しちがつと はちがつは、どちらも（______）です。", responseScope: "word_only" }),
      slotItem("l12-p2-a2-q4", "4", [text("4月と 5月と、どちらが （"), blank("adjective"), text("）ですか。——（"), blank("month"), text("）月の ほうが 暖かいです。")], [
        { id: "adjective", expectedUnit: "word", width: "medium", placeholder: "形容词" },
        { id: "month", expectedUnit: "number", width: "short", placeholder: "月" }
      ], { adjective: "暖かい", month: "5" }, { promptKana: "しがつと ごがつと、どちらが（______）ですか。——（______）がつの ほうが あたたかいです。", responseScope: "word_only" }),
      slotItem("l12-p2-a2-q5", "5", [text("11月は 10月より （"), blank("adjective"), text("）ですか。——はい、（"), blank("firstMonth"), text("）月は （"), blank("secondMonth"), text("）月より ずっと 涼しいです。")], [
        { id: "adjective", expectedUnit: "word", width: "medium", placeholder: "形容词" },
        { id: "firstMonth", expectedUnit: "number", width: "short", placeholder: "月" },
        { id: "secondMonth", expectedUnit: "number", width: "short", placeholder: "月" }
      ], { adjective: "涼しい", firstMonth: "11", secondMonth: "10" }, { promptKana: "じゅういちがつは じゅうがつより（______）ですか。——はい、（______）がつは（______）がつより ずっと すずしいです。", responseScope: "word_only" })
    ]
  },
  {
    id: "l12-p2-a3",
    section: "practice_2",
    order: 3,
    title: "听录音，根据自己的实际情况回答提问。",
    instruction: "",
    interaction: "listening_answer",
    answerUnit: "free_text",
    responseScope: "free_response",
    requiresAudio: true,
    audio: {
      source: "textbook_exercise",
      url: audio(2, 3),
      label: "第12课 练习II-3",
      transcript: {
        text: "あなたは どんな 飲み物が 好きですか。コーラが 好きです。北京は 上海より 寒いですか。季節の 中で いつが いちばん 好きですか。家族の 中で だれが いちばん 料理が 上手ですか。コーヒーと 紅茶と、どちらを よく 飲みますか。",
        source: "manual",
        confidenceNote: "Azure STT 识别后按题目顺序整理。",
        segments: [
          { itemNumber: "例", text: "あなたは どんな 飲み物が 好きですか。コーラが 好きです。" },
          { itemNumber: "1", text: "北京は 上海より 寒いですか。" },
          { itemNumber: "2", text: "季節の 中で いつが いちばん 好きですか。" },
          { itemNumber: "3", text: "家族の 中で だれが いちばん 料理が 上手ですか。" },
          { itemNumber: "4", text: "コーヒーと 紅茶と、どちらを よく 飲みますか。" }
        ]
      }
    },
    layout: [
      {
        type: "example",
        content: {
          label: "[例]",
          before: "あなたは どんな 飲み物が 好きですか。",
          beforeKana: "あなたは どんな のみものが すきですか。",
          after: [text("コーラが 好きです。")],
          afterKana: "コーラが すきです。"
        }
      }
    ],
    items: [
      personalItem("l12-p2-a3-q1", "1", "北京は 上海より 寒いですか。", "ペキンは シャンハイより さむいですか。"),
      personalItem("l12-p2-a3-q2", "2", "季節の 中で いつが いちばん 好きですか。", "きせつの なかで いつが いちばん すきですか。"),
      personalItem("l12-p2-a3-q3", "3", "家族の 中で だれが いちばん 料理が 上手ですか。", "かぞくの なかで だれが いちばん りょうりが じょうずですか。"),
      personalItem("l12-p2-a3-q4", "4", "コーヒーと 紅茶と、どちらを よく 飲みますか。", "コーヒーと こうちゃと、どちらを よく のみますか。")
    ]
  },
  {
    id: "l12-p2-a4",
    section: "practice_2",
    order: 4,
    title: "将下面的句子译成日语。",
    instruction: "",
    interaction: "translation",
    answerUnit: "sentence",
    responseScope: "sentence_only",
    layout: [],
    items: [
      answerItem("l12-p2-a4-q1", "1", "冬天的北京比东京冷多了。", "冬の 北京は 東京より ずっと 寒いです。", { answerSource: "prompt" }),
      answerItem("l12-p2-a4-q2", "2", "日语和英语，哪个难学？——日语难学。", "日本語と 英語と、どちらが 難しいですか。\n日本語の ほうが 難しいです。", {
        answerSource: "prompt",
        responseScope: "question_and_answer",
        multiline: true,
        rows: 3,
        placeholder: "输入完整问答"
      }),
      answerItem("l12-p2-a4-q3", "3", "在各种体育活动中，足球最有意思。", "スポーツの 中で サッカーが いちばん おもしろいです。", { answerSource: "prompt" })
    ]
  }
];

export const lesson12Practice: LessonPractice = {
  lessonId: "lesson12",
  title: "第12課 李さんは 森さんより 若いです",
  sourcePages: [
    { pageNo: 150, imagePath: page(150) },
    { pageNo: 151, imagePath: page(151) },
    { pageNo: 152, imagePath: page(152) }
  ],
  activities
};
