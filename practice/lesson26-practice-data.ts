import type { InputSlot, LessonPractice, PracticeActivity, PracticeItem, PromptPart, RichText } from "./lesson-practice-types";

const page = (pageNo: number) => `../course-assets/by-lesson/lesson26/page${pageNo}.webp`;
const audio = (exerciseNo: 1 | 2, order: number) =>
  `https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit7/lesson26/Exe${exerciseNo}_${order}.mp3`;
const text = (value: string, options: Omit<RichText, "type" | "text"> = {}): RichText => ({ type: "text", text: value, ...options });
const blank = (slotId: string): PromptPart => ({ type: "blank", slotId });

const sentenceSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "sentence", width: "long", placeholder: "输入完整句子" }];
const dialogueSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "dialogue", width: "long", multiline: true, rows: 5, placeholder: "输入完整对话" }];
const formSlot = (): InputSlot[] => [{ id: "answer", expectedUnit: "conjugated_form", width: "medium", placeholder: "输入适当形式" }];

const sentenceItem = (id: string, number: string, prompt: string, promptKana: string, answer: string, options: Partial<PracticeItem> = {}): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource: "example_transform", responseScope: "sentence_only",
  inputSlots: sentenceSlot(), answer: { slotValues: { answer } }, ...options
});

const dialogueItem = (id: string, number: string, prompt: string, promptKana: string, answer: string): PracticeItem => ({
  id, number, prompt: [text(prompt)], promptKana, instruction: "", answerSource: "example_transform", responseScope: "dialogue_only",
  inputSlots: dialogueSlot(), answer: { slotValues: { answer } }, renderHint: "dialogue"
});

const formItem = (id: string, number: string, before: string, beforeKana: string, answer: string, after: string, afterKana: string): PracticeItem => ({
  id, number,
  prompt: [text(before, { kana: beforeKana }), blank("answer"), text(after, { kana: afterKana })],
  instruction: "", answerSource: "prompt", responseScope: "word_only", responseScopeHint: "只填写括号中词语的适当形式。",
  inputSlots: formSlot(), answer: { slotValues: { answer } }
});

const activities: PracticeActivity[] = [
  {
    id: "l26-p1-a1", section: "practice_1", order: 1, title: "仿照例句替换画线部分进行练习。", instruction: "",
    interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [], items: [],
    itemGroups: [
      {
        id: "l26-p1-a1-g1",
        example: { label: "[例1]", before: "自転車に 2人で 乗ります／危ないです", beforeKana: "じてんしゃに ふたりで のります／あぶないです", after: [text("自転車に 2人で 乗るのは 危ないです。", { kana: "じてんしゃに ふたりで のるのは あぶないです。" })] },
        items: [
          sentenceItem("l26-p1-a1-q1", "1", "友達と 話します／楽しいです", "ともだちと はなします／たのしいです", "友達と 話すのは 楽しいです。"),
          sentenceItem("l26-p1-a1-q2", "2", "町を 歩きます／おもしろいです", "まちを あるきます／おもしろいです", "町を 歩くのは おもしろいです。"),
          sentenceItem("l26-p1-a1-q3", "3", "朝早く 走ります／気持ちが いいです", "あさはやく はしります／きもちが いいです", "朝早く 走るのは 気持ちが いいです。"),
          sentenceItem("l26-p1-a1-q4", "4", "家族で 旅行します／楽しいです", "かぞくで りょこうします／たのしいです", "家族で 旅行するのは 楽しいです。")
        ]
      },
      {
        id: "l26-p1-a1-g2",
        example: { label: "[例2]", before: "色鉛筆で スケッチします／好きです", beforeKana: "いろえんぴつで スケッチします／すきです", after: [text("加藤さんは 色鉛筆で スケッチするのが 好きです。", { kana: "かとうさんは いろえんぴつで スケッチするのが すきです。" })] },
        items: [
          sentenceItem("l26-p1-a1-q5", "5", "泳ぎます／下手です", "およぎます／へたです", "加藤さんは 泳ぐのが 下手です。"),
          sentenceItem("l26-p1-a1-q6", "6", "歌を 歌います／上手です", "うたを うたいます／じょうずです", "加藤さんは 歌を 歌うのが 上手です。"),
          sentenceItem("l26-p1-a1-q7", "7", "歩きます／嫌いです", "あるきます／きらいです", "加藤さんは 歩くのが 嫌いです。"),
          sentenceItem("l26-p1-a1-q8", "8", "外国の 映画を 見ます／好きです", "がいこくの えいがを みます／すきです", "加藤さんは 外国の 映画を 見るのが 好きです。")
        ]
      },
      {
        id: "l26-p1-a1-g3",
        example: { label: "[例3]", before: "吉田さんが 転勤しました。", beforeKana: "よしださんが てんきんしました。", after: [text("吉田さんが 転勤したのを 知って いますか。", { kana: "よしださんが てんきんしたのを しって いますか。" })] },
        items: [
          sentenceItem("l26-p1-a1-q9", "9", "明日 試験が あります。", "あした しけんが あります。", "明日 試験が あるのを 知って いますか。"),
          sentenceItem("l26-p1-a1-q10", "10", "駅前に 新しい スーパーが できます。", "えきまえに あたらしい スーパーが できます。", "駅前に 新しい スーパーが できるのを 知って いますか。"),
          sentenceItem("l26-p1-a1-q11", "11", "北京タイガースが 優勝しました。", "ペキンタイガースが ゆうしょうしました。", "北京タイガースが 優勝したのを 知って いますか。"),
          sentenceItem("l26-p1-a1-q12", "12", "水曜日は 映画の 料金が 半額に なります。", "すいようびは えいがの りょうきんが はんがくに なります。", "水曜日は 映画の 料金が 半額に なるのを 知って いますか。")
        ]
      }
    ]
  },
  {
    id: "l26-p1-a2", section: "practice_1", order: 2, title: "仿照例句替换画线部分进行练习。", instruction: "",
    interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", items: [], itemGroups: [
      {
        id: "l26-p1-a2-g1",
        example: { label: "[例]", before: "今日 来ます／だれ", beforeKana: "きょう きます／だれ", after: [text("今日 来るのは だれですか。", { kana: "きょう くるのは だれですか。" })] },
        items: [
          sentenceItem("l26-p1-a2-q1", "1", "李さんが かきました／どの 絵", "りさんが かきました／どの え", "李さんが かいたのは どの 絵ですか。"),
          sentenceItem("l26-p1-a2-q2", "2", "ここに 箱を 置きました／だれ", "ここに はこを おきました／だれ", "ここに 箱を 置いたのは だれですか。"),
          sentenceItem("l26-p1-a2-q3", "3", "その 服を 買いました／どこ", "その ふくを かいました／どこ", "その 服を 買ったのは どこですか。"),
          sentenceItem("l26-p1-a2-q4", "4", "最近 森さんに 会いました／いつ", "さいきん もりさんに あいました／いつ", "最近 森さんに 会ったのは いつですか。")
        ]
      }
    ]
  },
  {
    id: "l26-p1-a3", section: "practice_1", order: 3, title: "仿照例句替换画线部分练习会话。", instruction: "",
    interaction: "dialogue_practice", answerUnit: "dialogue", responseScope: "dialogue_only", layout: [
      { type: "example", content: { label: "[例]", before: "李さん、なかなか 来ませんね。／李さんに 言います", beforeKana: "りさん、なかなか きませんね。／りさんに いいます", after: [text("甲：李さん、なかなか 来ませんね。\n乙：あっ、いけない。李さんに 言うのを 忘れました。\n甲：えっ、また 忘れたんですか。\n乙：どうも すみません。", { kana: "こう：りさん、なかなか きませんね。\nおつ：あっ、いけない。りさんに いうのを わすれました。\nこう：えっ、また わすれたんですか。\nおつ：どうも すみません。" })] } }
    ], items: [
      dialogueItem("l26-p1-a3-q1", "1", "来週の コンサート、楽しみですね。／チケットを 注文します", "らいしゅうの コンサート、たのしみですね。／チケットを ちゅうもんします", "甲：来週の コンサート、楽しみですね。\n乙：あっ、いけない。チケットを 注文するのを 忘れました。\n甲：えっ、また 忘れたんですか。\n乙：どうも すみません。"),
      dialogueItem("l26-p1-a3-q2", "2", "会費を 払って ください。／お金を 下ろします", "かいひを はらって ください。／おかねを おろします", "甲：会費を 払って ください。\n乙：あっ、いけない。お金を 下ろすのを 忘れました。\n甲：えっ、また 忘れたんですか。\n乙：どうも すみません。"),
      dialogueItem("l26-p1-a3-q3", "3", "宿題を 出しましたか。／します", "しゅくだいを だしましたか。／します", "甲：宿題を 出しましたか。\n乙：あっ、いけない。宿題を 出すのを 忘れました。\n甲：えっ、また 忘れたんですか。\n乙：どうも すみません。"),
      dialogueItem("l26-p1-a3-q4", "4", "昼ご飯を 食べませんか。／お弁当を 買います", "ひるごはんを たべませんか。／おべんとうを かいます", "甲：昼ご飯を 食べませんか。\n乙：あっ、いけない。お弁当を 買うのを 忘れました。\n甲：えっ、また 忘れたんですか。\n乙：どうも すみません。")
    ]
  },
  {
    id: "l26-p1-a4", section: "practice_1", order: 4, title: "仿照例句替换画线部分进行练习。", instruction: "",
    interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [], items: [], itemGroups: [
      {
        id: "l26-p1-a4-g1",
        example: { label: "[例1]", before: "大雨です", beforeKana: "おおあめです", after: [text("明日は 大雨でしょう。", { kana: "あしたは おおあめ でしょう。" })] },
        items: [
          sentenceItem("l26-p1-a4-q1", "1", "暖かいです", "あたたかいです", "明日は 暖かいでしょう。"),
          sentenceItem("l26-p1-a4-q2", "2", "風が 吹きます", "かぜが ふきます", "明日は 風が 吹くでしょう。"),
          sentenceItem("l26-p1-a4-q3", "3", "雪が 降りません", "ゆきが ふりません", "明日は 雪が 降らないでしょう。"),
          sentenceItem("l26-p1-a4-q4", "4", "暇です", "ひまです", "明日は 暇でしょう。"),
          sentenceItem("l26-p1-a4-q5", "5", "森さんは 会社に 行きません", "もりさんは かいしゃに いきません", "明日は 森さんは 会社に 行かないでしょう。")
        ]
      },
      {
        id: "l26-p1-a4-g2",
        example: { label: "[例2]", before: "甲：李さんは 料理が 上手ですか。\n乙：（料理の 本を よく 読んで います）", beforeKana: "こう：りさんは りょうりが じょうずですか。\nおつ：（りょうりの ほんを よく よんで います）", after: [text("料理の 本を よく 読んでいるから、たぶん 上手でしょう。", { kana: "りょうりの ほんを よく よんでいるから、たぶん じょうず でしょう。" })] },
        items: [
          sentenceItem("l26-p1-a4-q6", "6", "甲：明日は 試験ですね。葉子さんは 合格しますか。\n乙：（毎日 6時間 勉強して います）", "こう：あしたは しけんですね。ようこさんは ごうかくしますか。\nおつ：（まいにち ろくじかん べんきょうして います）", "毎日 6時間 勉強しているから、たぶん 合格するでしょう。"),
          sentenceItem("l26-p1-a4-q7", "7", "甲：明日は 晴れますか。\n乙：（月が きれいです）", "こう：あしたは はれますか。\nおつ：（つきが きれいです）", "月が きれいだから、たぶん 晴れるでしょう。"),
          sentenceItem("l26-p1-a4-q8", "8", "甲：李さんは パーティーに 来ますか。\n乙：（昨日 約束しました）", "こう：りさんは パーティーに きますか。\nおつ：（きのう やくそくしました）", "昨日 約束したから、たぶん 来るでしょう。")
        ]
      }
    ]
  },
  {
    id: "l26-p1-a5", section: "practice_1", order: 5, title: "仿照例句替换画线部分进行练习。", instruction: "",
    interaction: "pattern_substitution", answerUnit: "sentence", responseScope: "sentence_only", layout: [], items: [], itemGroups: [
      {
        id: "l26-p1-a5-g1",
        example: { label: "[例1]", before: "来ません", beforeKana: "きません", after: [text("馬さんは 来ないかも しれません。", { kana: "ばさんは こないかも しれません。" })] },
        items: [
          sentenceItem("l26-p1-a5-q1", "1", "休みます", "やすみます", "馬さんは 休むかも しれません。"),
          sentenceItem("l26-p1-a5-q2", "2", "買いません", "かいません", "馬さんは 買わないかも しれません。"),
          sentenceItem("l26-p1-a5-q3", "3", "忙しいです", "いそがしいです", "馬さんは 忙しいかも しれません。"),
          sentenceItem("l26-p1-a5-q4", "4", "暇です", "ひまです", "馬さんは 暇かも しれません。"),
          sentenceItem("l26-p1-a5-q5", "5", "病気です", "びょうきです", "馬さんは 病気かも しれません。"),
          sentenceItem("l26-p1-a5-q6", "6", "行きません", "いきません", "馬さんは 行かないかも しれません。")
        ]
      },
      {
        id: "l26-p1-a5-g2",
        example: { label: "[例2]", before: "あの 売り場に 人が たくさん います／バーゲンです", beforeKana: "あの うりばに ひとが たくさん います／バーゲンです", after: [text("甲：あの 売り場に 人が たくさん いますね。\n乙：そうですね。バーゲンかも しれません。", { kana: "こう：あの うりばに ひとが たくさん いますね。\nおつ：そうですね。バーゲンかも しれません。" })] },
        items: [
          dialogueItem("l26-p1-a5-q7", "7", "隣の うちは にぎやかです／パーティーです", "となりの うちは にぎやかです／パーティーです", "甲：隣の うちは にぎやかですね。\n乙：そうですね。パーティーかも しれません。"),
          dialogueItem("l26-p1-a5-q8", "8", "事務所に だれも いません／昼休みです", "じむしょに だれも いません／ひるやすみです", "甲：事務所に だれも いませんね。\n乙：そうですね。昼休みかも しれません。"),
          dialogueItem("l26-p1-a5-q9", "9", "どれも 高いです／お金が 足りません", "どれも たかいです／おかねが たりません", "甲：どれも 高いですね。\n乙：そうですね。お金が 足りないかも しれません。")
        ]
      }
    ]
  },
  {
    id: "l26-p1-a6", section: "practice_1", order: 6, title: "听录音，仿照例句造句。", instruction: "",
    interaction: "listening_answer", answerUnit: "sentence", responseScope: "sentence_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(1, 6), label: "第26课 练习I-6", transcript: { source: "asr", text: "例：毎日、スポーツをします。毎日スポーツをするのは体に良いです。1. 朝早く散歩します。朝早く散歩するのは気持ちがいいです。2. お風呂に入ります。お風呂に入るのが好きです。3. 吉田さんが転勤します。吉田さんが転勤するのを昨日聞きました。", segments: [{ itemNumber: "1", text: "朝早く散歩します。" }, { itemNumber: "2", text: "お風呂に入ります。" }, { itemNumber: "3", text: "吉田さんが転勤します。" }], confidenceNote: "ASR 将题号识别为零、一、二、三；依据音频完整句型整理。" } },
    layout: [{ type: "example", content: { label: "[例]", before: "（毎日 スポーツを します）", beforeKana: "（まいにち スポーツを します）", after: [text("毎日 スポーツを するのは 体に いいです。", { kana: "まいにち スポーツを するのは からだに いいです。" })] } }],
    items: [
      sentenceItem("l26-p1-a6-q1", "1", "听录音，仿照例句造句。", "", "朝早く 散歩するのは 気持ちが いいです。", { answerSource: "audio" }),
      sentenceItem("l26-p1-a6-q2", "2", "听录音，仿照例句造句。", "", "お風呂に 入るのが 好きです。", { answerSource: "audio" }),
      sentenceItem("l26-p1-a6-q3", "3", "听录音，仿照例句造句。", "", "吉田さんが 転勤するのを 昨日 聞きました。", { answerSource: "audio" })
    ]
  },
  {
    id: "l26-p2-a1", section: "practice_2", order: 1, title: "将（　）中的词语变成适当的形式完成句子。", instruction: "",
    interaction: "fill_blank", answerUnit: "word", responseScope: "word_only", layout: [{ type: "example", content: { label: "[例]", before: "わたしは 本を（読みます → 読むのが）好きです。", beforeKana: "わたしは ほんを（よみます → よむのが）すきです。", after: [] } }], items: [
      formItem("l26-p2-a1-q1", "1", "テレビを（消します → ", "テレビを（けします → ", "消すのを", "）忘れました。", "）わすれました。"),
      formItem("l26-p2-a1-q2", "2", "友達と（遊びます → ", "ともだちと（あそびます → ", "遊ぶのは", "）楽しいです。", "）たのしいです。"),
      formItem("l26-p2-a1-q3", "3", "天気が悪いから、（行きます → ", "てんきが わるいから、（いきます → ", "行くのを", "）やめました。", "）やめました。"),
      formItem("l26-p2-a1-q4", "4", "森さんは（走ります → ", "もりさんは（はしります → ", "走るのが", "）速いです。", "）はやいです。"),
      formItem("l26-p2-a1-q5", "5", "今（食べました → ", "いま（たべました → ", "食べたのは", "）何ですか。", "）なんですか。")
    ]
  },
  {
    id: "l26-p2-a2", section: "practice_2", order: 2, title: "将（　）中的词语变成适当的形式完成句子。", instruction: "",
    interaction: "fill_blank", answerUnit: "word", responseScope: "word_only", layout: [{ type: "example", content: { label: "[例]", before: "明日は（曇りです → 曇り）でしょう。", beforeKana: "あしたは（くもりです → くもり）でしょう。", after: [] } }], items: [
      formItem("l26-p2-a2-q1", "1", "王さんは今週忙しいから、たぶん（来ません → ", "おうさんは こんしゅう いそがしいから、たぶん（きません → ", "来ない", "）でしょう。", "）でしょう。"),
      formItem("l26-p2-a2-q2", "2", "李さんはカラオケが（嫌いです → ", "りさんは カラオケが（きらいです → ", "嫌い", "）かもしれません。", "）かも しれません。"),
      formItem("l26-p2-a2-q3", "3", "李さんはたぶん（合格します → ", "りさんは たぶん（ごうかくします → ", "合格する", "）でしょう。", "）でしょう。"),
      formItem("l26-p2-a2-q4", "4", "人がたくさんいますから、部屋の中は（暑いです → ", "ひとが たくさん いますから、へやの なかは（あついです → ", "暑い", "）かもしれません。", "）かも しれません。"),
      formItem("l26-p2-a2-q5", "5", "森さんはまだ会社に（います → ", "もりさんは まだ かいしゃに（います → ", "いる", "）かもしれません。", "）かも しれません。")
    ]
  },
  {
    id: "l26-p2-a3", section: "practice_2", order: 3, title: "听录音，给正确的答案画○。", instruction: "",
    interaction: "single_choice", answerUnit: "choice", responseScope: "choice_only", requiresAudio: true,
    audio: { source: "textbook_exercise", url: audio(2, 3), label: "第26课 练习II-3", transcript: { source: "asr", text: "例：あっ、この手紙、出すのを忘れたわ。手紙を出しませんでした。1. お金がないから旅行に行くのをやめました。2. 忙しいけど、ゴルフをする時間はあります。3. あの2人が結婚したの？知りませんでした。", segments: [{ itemNumber: "1", text: "お金がないから旅行に行くのをやめました。" }, { itemNumber: "2", text: "忙しいけど、ゴルフをする時間はあります。" }, { itemNumber: "3", text: "あの2人が結婚したの？知りませんでした。" }], confidenceNote: "第 3 题 ASR 最后一句语义不完整；答案按教材的二选一与“結婚したの？”的听力内容判断。" } },
    layout: [{ type: "example", content: { label: "[例]", before: "あっ、この 手紙、出すのを 忘れたわ。", beforeKana: "あっ、この てがみ、だすのを わすれたわ。", after: [text("○ 手紙を 出しませんでした。", { kana: "まる てがみを だしませんでした。" })] } }], items: [
      { id: "l26-p2-a3-q1", number: "1", prompt: [text("听录音，选择正确句子。")], instruction: "", answerSource: "audio", responseScope: "choice_only", choices: [{ id: "a", label: "旅行に 行きました。" }, { id: "b", label: "旅行に 行きませんでした。" }], answer: { choiceIds: ["b"] } },
      { id: "l26-p2-a3-q2", number: "2", prompt: [text("听录音，选择正确句子。")], instruction: "", answerSource: "audio", responseScope: "choice_only", choices: [{ id: "a", label: "ゴルフを します。" }, { id: "b", label: "ゴルフを しません。" }], answer: { choiceIds: ["a"] } },
      { id: "l26-p2-a3-q3", number: "3", prompt: [text("听录音，选择正确句子。")], instruction: "", answerSource: "audio", responseScope: "choice_only", choices: [{ id: "a", label: "あの 2人は 結婚しました。" }, { id: "b", label: "あの 2人は 結婚して いません。" }], answer: { choiceIds: ["a"] } }
    ]
  },
  {
    id: "l26-p2-a4", section: "practice_2", order: 4, title: "将下面的句子译成日语。", instruction: "",
    interaction: "translation", answerUnit: "sentence", responseScope: "sentence_only", layout: [], items: [
      sentenceItem("l26-p2-a4-q1", "1", "小李喜欢画画。", "", "李さんは 絵を 描くのが 好きです。"),
      sentenceItem("l26-p2-a4-q2", "2", "（我）忘了寄信。", "", "わたしは 手紙を 出すのを 忘れました。", { acceptableAlternatives: ["手紙を 出すのを 忘れました。"] }),
      sentenceItem("l26-p2-a4-q3", "3", "森先生今天也许不来（公司）上班。", "", "森先生は 今日 会社に 来ないかも しれません。")
    ]
  }
];

export const lesson26Practice: LessonPractice = {
  lessonId: "lesson26",
  title: "第26课 自転車に2人で乗るのは危ないです",
  sourcePages: [{ pageNo: 20, imagePath: page(20) }, { pageNo: 21, imagePath: page(21) }, { pageNo: 22, imagePath: page(22) }],
  activities
};
