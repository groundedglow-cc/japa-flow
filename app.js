const lesson = {
  id: 27,
  title: "第27课",
  subtitle: "子供の時、大きな地震がありました",
  vocabulary: [
    { id: "w1", jp: "経済", kana: "けいざい", cn: "经济" },
    { id: "w2", jp: "国際関係学", kana: "こくさいかんけいがく", cn: "国际关系学" },
    { id: "w3", jp: "学部", kana: "がくぶ", cn: "系，学院" },
    { id: "w4", jp: "高校", kana: "こうこう", cn: "高中" },
    { id: "w5", jp: "日記", kana: "にっき", cn: "日记" },
    { id: "w6", jp: "教師", kana: "きょうし", cn: "教师" },
    { id: "w7", jp: "お年寄り", kana: "おとしより", cn: "老年人" },
    { id: "w8", jp: "体操", kana: "たいそう", cn: "体操" },
    { id: "w9", jp: "社交ダンス", kana: "しゃこうダンス", cn: "交际舞" },
    { id: "w10", jp: "卓球", kana: "たっきゅう", cn: "乒乓球" },
    { id: "w11", jp: "バスケットボール", kana: "バスケットボール", cn: "篮球" },
    { id: "w12", jp: "スポーツセンター", kana: "スポーツセンター", cn: "体育中心" },
    { id: "w13", jp: "入園料", kana: "にゅうえんりょう", cn: "门票，入园费" },
    { id: "w14", jp: "有料", kana: "ゆうりょう", cn: "收费" },
    { id: "w15", jp: "賞", kana: "しょう", cn: "奖" },
    { id: "w16", jp: "曲", kana: "きょく", cn: "乐曲，歌曲" },
    { id: "w17", jp: "詩", kana: "し", cn: "诗歌" },
    { id: "w18", jp: "信号", kana: "しんごう", cn: "信号，红绿灯" },
    { id: "w19", jp: "はさみ", kana: "はさみ", cn: "剪刀" },
    { id: "w20", jp: "部品", kana: "ぶひん", cn: "零部件" },
    { id: "w21", jp: "アルバイト", kana: "アルバイト", cn: "打工，副业" },
    { id: "w22", jp: "スピーチ", kana: "スピーチ", cn: "演说，演讲" },
    { id: "w23", jp: "グラフ", kana: "グラフ", cn: "图表" },
    { id: "w24", jp: "企画", kana: "きかく", cn: "策划，计划" },
    { id: "w25", jp: "説明", kana: "せつめい", cn: "说明" },
    { id: "w26", jp: "ご飯", kana: "ごはん", cn: "饭" },
    { id: "w27", jp: "砂糖", kana: "さとう", cn: "砂糖" },
    { id: "w28", jp: "海外旅行", kana: "かいがいりょこう", cn: "海外旅行" },
    { id: "w29", jp: "こと", kana: "こと", cn: "事情" },
    { id: "w30", jp: "おじいさん", kana: "おじいさん", cn: "爷爷，老大爷" },
    { id: "w31", jp: "おばあさん", kana: "おばあさん", cn: "奶奶，老奶奶" },
    { id: "w32", jp: "お姉さん", kana: "おねえさん", cn: "姐姐" },
    { id: "w33", jp: "通います", kana: "かよいます", cn: "上学，来往" },
    { id: "w34", jp: "集まります", kana: "あつまります", cn: "聚，集合" },
    { id: "w35", jp: "踊ります", kana: "おどります", cn: "跳舞" },
    { id: "w36", jp: "要ります", kana: "いります", cn: "需要" },
    { id: "w37", jp: "困ります", kana: "こまります", cn: "为难，难办" },
    { id: "w38", jp: "たたきます", kana: "たたきます", cn: "拍，敲，打" },
    { id: "w39", jp: "入れます", kana: "いれます", cn: "放入，放进" },
    { id: "w40", jp: "看病します", kana: "かんびょうします", cn: "护理，护理病人" },
    { id: "w41", jp: "けんかします", kana: "けんかします", cn: "吵架，打架" },
    { id: "w42", jp: "利用します", kana: "りようします", cn: "利用" },
    { id: "w43", jp: "相談します", kana: "そうだんします", cn: "商谈，商量" },
    { id: "w44", jp: "ほかに", kana: "ほかに", cn: "另外" },
    { id: "w45", jp: "しばらく", kana: "しばらく", cn: "许久，好久；片刻" },
    { id: "w46", jp: "へえ", kana: "へえ", cn: "哎，哎呀" },
    { id: "w47", jp: "木下", kana: "きのした", cn: "木下" },
    { id: "w48", jp: "田村", kana: "たむら", cn: "田村" },
    { id: "w49", jp: "この前", kana: "このまえ", cn: "前几天，之前，最近" },
    { id: "w50", jp: "そういえば", kana: "そういえば", cn: "说起来，这么说来" },
    { id: "w51", jp: "気がつきます", kana: "きがつきます", cn: "察觉，发现" },
    { id: "w52", jp: "しばらくです", kana: "しばらくです", cn: "好久不见" }
  ],
  sentences: [
    {
      id: "s1",
      order: 1,
      text: "子供の時、大きな地震がありました。",
      kana: "こどもの とき、おおきな じしんが ありました。",
      translation: "小时候，发生过很大的地震。",
      words: [],
      grammar: ["g1"]
    },
    {
      id: "s2",
      order: 2,
      text: "映画を見る時、いつもいちばん後ろの席に座ります。",
      kana: "えいがを みる とき、いつも いちばん うしろの せきに すわります。",
      translation: "看电影时，总是坐在最后面的座位。",
      words: [],
      grammar: ["g1"]
    },
    {
      id: "s3",
      order: 3,
      text: "李さんはテレビを見ながら食事をしています。",
      kana: "りさんは テレビを みながら しょくじを しています。",
      translation: "小李一边看电视一边吃饭。",
      words: [],
      grammar: ["g2", "g4"]
    },
    {
      id: "s4",
      order: 4,
      text: "李さん、明日パーティーに行くでしょう？",
      kana: "りさん、あした パーティーに いくでしょう？",
      translation: "小李，明天去参加联欢会吧？",
      words: [],
      grammar: ["g3"]
    },
    {
      id: "s5",
      order: 5,
      speaker: "甲",
      text: "学生の時、何を勉強しましたか。",
      kana: "がくせいの とき、なにを べんきょうしましたか。",
      translation: "学生时代学了什么？",
      words: [],
      grammar: ["g1"]
    },
    {
      id: "s6",
      order: 6,
      speaker: "乙",
      text: "日本の経済について勉強しました。",
      kana: "にほんの けいざいに ついて べんきょうしました。",
      translation: "学习了日本经济。",
      words: ["w1"],
      grammar: []
    },
    {
      id: "s7",
      order: 7,
      speaker: "甲",
      text: "馬さん、暇な時、この書類を整理してください。",
      kana: "ばさん、ひまな とき、この しょるいを せいりして ください。",
      translation: "小马，有空时请整理这些资料。",
      words: [],
      grammar: ["g1"]
    },
    {
      id: "s7b",
      order: "B-2",
      speaker: "乙",
      text: "はい、分かりました。",
      kana: "はい、わかりました。",
      translation: "好的，我知道了。",
      words: [],
      grammar: []
    },
    {
      id: "s8",
      order: 8,
      speaker: "甲",
      text: "葉子さんはアルバイトをしながら学校に通っているんですよ。",
      kana: "ようこさんは アルバイトを しながら がっこうに かよって いるんですよ。",
      translation: "叶子一边打工一边上学。",
      words: ["w21", "w33"],
      grammar: ["g2", "g4", "g7", "g8"]
    },
    {
      id: "s9",
      order: 9,
      speaker: "乙",
      text: "なかなか大変ですね。",
      kana: "なかなか たいへんですね。",
      translation: "真是不容易啊。",
      words: [],
      grammar: []
    },
    {
      id: "s10",
      order: 10,
      speaker: "甲",
      text: "森さん、昨日、駅前の喫茶店にいたでしょう？",
      kana: "もりさん、きのう、えきまえの きっさてんに いたでしょう？",
      translation: "森先生，你昨天在车站前的咖啡馆吧？",
      words: [],
      grammar: ["g3"]
    },
    {
      id: "s11",
      order: 11,
      speaker: "乙",
      text: "はい。仕事で、楊さんと会っていたんです。",
      kana: "はい。しごとで、ようさんと あって いたんです。",
      translation: "是的。因为工作，和杨先生见面了。",
      words: [],
      grammar: ["g5", "g6"]
    },
    {
      id: "s12",
      order: 12,
      speaker: "森",
      text: "今朝、公園を散歩している時、大勢の人が集まっているのを見ました。",
      kana: "けさ、こうえんを さんぽしている とき、おおぜいの ひとが あつまって いるのを みました。",
      translation: "今天早上在公园散步时，看见很多人聚在一起。",
      words: ["w34"],
      grammar: ["g1", "g4", "g9"]
    },
    {
      id: "s13",
      order: 13,
      speaker: "李",
      text: "お年寄りが多かったでしょう？",
      kana: "おとしよりが おおかったでしょう？",
      translation: "老年人很多吧？",
      words: ["w7"],
      grammar: ["g3", "g10"]
    },
    {
      id: "s14",
      order: 14,
      speaker: "森",
      text: "太極拳やラジオ体操をしていました。",
      kana: "たいきょくけんや ラジオたいそうを していました。",
      translation: "他们在打太极拳和做广播体操。",
      words: ["w8"],
      grammar: ["g4"]
    },
    {
      id: "s15",
      order: 15,
      speaker: "李",
      text: "社交ダンスをしている人たちもいたでしょう？",
      kana: "しゃこうダンスを している ひとたちも いたでしょう？",
      translation: "也有人在跳交际舞吧？",
      words: ["w9"],
      grammar: ["g3", "g4"]
    },
    {
      id: "s16",
      order: 16,
      speaker: "森",
      text: "ほかに、踊りながら歌を歌っている人もいましたよ。",
      kana: "ほかに、おどりながら うたを うたっている ひとも いましたよ。",
      translation: "另外，还有一边跳舞一边唱歌的人。",
      words: ["w35", "w44"],
      grammar: ["g2", "g4"]
    },
    {
      id: "s17",
      order: 17,
      speaker: "森",
      text: "公園に入る時、入園料を払いましたが、どの公園も有料ですか。",
      kana: "こうえんに はいる とき、にゅうえんりょうを はらいましたが、どの こうえんも ゆうりょうですか。",
      translation: "进公园时付了门票，所有公园都收费吗？",
      words: ["w13", "w14"],
      grammar: ["g1", "g13"]
    },
    {
      id: "s18",
      order: 18,
      speaker: "李",
      text: "有料の公園が多いですね。",
      kana: "ゆうりょうの こうえんが おおいですね。",
      translation: "收费公园比较多。",
      words: ["w14"],
      grammar: ["g13"]
    },
    {
      id: "s19",
      order: 19,
      speaker: "森",
      text: "朝の運動をしているお年寄りたちも入園料を払うんですか。",
      kana: "あさの うんどうを している おとしよりたちも にゅうえんりょうを はらうんですか。",
      translation: "早上锻炼的老人也要付门票吗？",
      words: ["w7", "w13"],
      grammar: ["g4", "g10"]
    },
    {
      id: "s20",
      order: 20,
      speaker: "李",
      text: "そうです。でも、毎日利用する人は割引があるんです。",
      kana: "そうです。でも、まいにち りようする ひとは わりびきが あるんです。",
      translation: "是的。不过，每天使用的人有优惠。",
      words: ["w42"],
      grammar: ["g4"]
    },
    {
      id: "s21",
      order: 21,
      speaker: "戴",
      text: "そう言えば、小さい時、よく祖母といっしょに公園へ行きました。",
      kana: "そういえば、ちいさい とき、よく そぼと いっしょに こうえんへ いきました。",
      translation: "说起来，小时候常和祖母一起去公园。",
      words: ["w50"],
      grammar: ["g1", "g11", "g13"]
    },
    {
      id: "s22",
      order: 22,
      speaker: "森",
      text: "いついっしょに運動をしたんですか。",
      kana: "いつ いっしょに うんどうを したんですか。",
      translation: "你什么时候一起运动的？",
      words: [],
      grammar: []
    },
    {
      id: "s23",
      order: 23,
      speaker: "戴",
      text: "わたしは遊びながら祖母が太極拳をするのを見ていました。",
      kana: "わたしは あそびながら そぼが たいきょくけんを するのを みていました。",
      translation: "我一边玩，一边看祖母打太极拳。",
      words: [],
      grammar: ["g2", "g4"]
    },
    {
      id: "s24",
      order: 24,
      speaker: "李",
      text: "休みの時、わたしも公園でジョギングをしています。",
      kana: "やすみの とき、わたしも こうえんで ジョギングを しています。",
      translation: "休息时，我也在公园慢跑。",
      words: [],
      grammar: ["g1", "g4", "g13"]
    },
    {
      id: "s25",
      order: 25,
      speaker: "戴",
      text: "朝や夕方の涼しい時にスポーツをするのは気持ちがいいですよね。",
      kana: "あさや ゆうがたの すずしい ときに スポーツを するのは きもちが いいですよね。",
      translation: "早上或傍晚凉爽的时候做运动很舒服啊。",
      words: [],
      grammar: ["g1", "g3"]
    }
  ],
  grammar: [
    {
      id: "g1",
      pattern: "小句（简体形）+ 時",
      meaning: "表示动作或状态发生的时间。动词小句可用基本形或た形，名词前接「の」。",
      structure: "动词简体形 + 時 / 一类形容词 + 時 / 二类形容词 + な時 / 名词 + の時",
      usage: "「子供の時」表示小时候；「映画を見る時」表示看电影的时候。",
      examples: ["s1", "s2", "s5", "s17", "s21", "s24"]
    },
    {
      id: "g2",
      pattern: "動ます形去ます + ながら",
      meaning: "表示同一主体同时进行两个动作，后项是主要动作。",
      structure: "动词ます形去掉ます + ながら",
      usage: "「見ながら食事をしています」表示一边看电视一边吃饭。",
      examples: ["s3", "s8", "s16", "s23"]
    },
    {
      id: "g3",
      pattern: "〜でしょう？",
      meaning: "用于确认自己认为基本确定的事情，读升调。",
      structure: "小句（简体形）+ でしょう？ / 名词・二类形容词 + でしょう？",
      usage: "「行くでしょう？」用于向对方确认是否会去。",
      examples: ["s4", "s10", "s13", "s15", "s25"]
    },
    {
      id: "g4",
      pattern: "動ています（反复・习惯）",
      meaning: "表示反复发生的动作或习惯，也可表示正在进行。",
      structure: "动词て形 + います",
      usage: "「散歩しています」「利用する人」等上下文中可表示习惯性行为。",
      examples: ["s3", "s8", "s12", "s14", "s16", "s19", "s20", "s23", "s24"]
    },
    {
      id: "g5",
      pattern: "名 + で（原因・理由）",
      meaning: "助词「で」接在名词后，表示原因或理由。",
      structure: "名词 + で",
      usage: "「仕事で」表示因为工作这一原因。",
      examples: ["s11"]
    },
    {
      id: "g6",
      pattern: "名 + と会います",
      meaning: "表示互动行为的对象；「会います」的对象既可用「に」，也可用「と」。",
      structure: "名词 + と + 会います",
      usage: "「楊さんと会っていた」表示和杨先生见面。",
      examples: ["s11"]
    },
    {
      id: "g7",
      pattern: "表达：アルバイト",
      meaning: "源自德语 Arbeit，一般译作“打工”，在日语中多指学生利用课外时间去工作的情况。",
      structure: "アルバイトをします / アルバイトをしながら",
      usage: "课文中的「アルバイトをしながら学校に通っている」表示一边打工一边上学。",
      examples: ["s8"],
      extraExamples: []
    },
    {
      id: "g8",
      pattern: "词语：〜に通っています",
      meaning: "「通います」表示来往于同一个地方，与表示目的地的「に」一起使用。强调从一个地方移动到另一个固定地点，并带有反复往来的意思。",
      structure: "地点 + に + 通っています / 地点 + に + 行きます",
      usage: "「学校に通っています」表示固定地上学、来往于学校；「スポーツセンターに行きます」只表示去体育中心。",
      examples: ["s8"],
      extraExamples: [
        { text: "田中さんは毎日スポーツセンターに通っています。", translation: "田中先生每天都去体育中心。" },
        { text: "田中さんは時々スポーツセンターに行きます。", translation: "田中先生时常去体育中心。" }
      ]
    },
    {
      id: "g9",
      pattern: "词语：大勢",
      meaning: "表示人数很多，只能用于人。修饰名词或动词时可用「大勢の人」「人が大勢います」等形式。",
      structure: "大勢の + 人 / 人が + 大勢 + います",
      usage: "不能用于人以外的事物。表示书、车等很多时，应使用「たくさん」。",
      examples: ["s12"],
      extraExamples: [
        { text: "今朝、公園を散歩している時、大勢の人が集まっているのを見ました。", translation: "今天早上在公园散步时，看见很多人聚在一起。" },
        { text: "教室に学生が大勢います。", translation: "教室里有许多学生。" }
      ]
    },
    {
      id: "g10",
      pattern: "词语：お年寄り",
      meaning: "「年寄り」前加上敬语前缀「お」，是对老年人的较为礼貌、带有敬意和亲切感的说法。",
      structure: "お年寄り / おじいさん / おばあさん",
      usage: "「お年寄り」不能直接用来称呼对方；直接称呼时通常说「おじいさん」「おばあさん」等。",
      examples: ["s13", "s19"],
      extraExamples: [
        { text: "お年寄りが多かったでしょう？", translation: "老年人很多吧？" }
      ]
    },
    {
      id: "g11",
      pattern: "表达：そう言えば",
      meaning: "由正在进行的对话或现场情况联想到另外一件相关事情时使用，相当于“说起来”“这么说来”。",
      structure: "そう言えば、〜",
      usage: "课文中戴女士由公园和晨练联想到小时候和祖母去公园的事情。",
      examples: ["s21"],
      extraExamples: [
        { text: "そう言えば、小さい時、よく祖母といっしょに公園へ行きました。", translation: "说起来，小时候常和祖母一起去公园。" },
        { text: "そう言えば、さっきから戴さんがいませんね。", translation: "这么说来，刚才小戴就不在啊。" }
      ]
    },
    {
      id: "g12",
      pattern: "表达：へえ",
      meaning: "表示对听来的信息感到惊讶或佩服。应用课文中可用于听到意外情况后的回应。",
      structure: "へえ、〜",
      usage: "语气上相当于“啊？是吗”“哎呀，真不容易啊”等，常用于口语反应。",
      examples: [],
      extraExamples: [
        { text: "へえ、いっしょに運動もしたんですか。", translation: "啊？是一起运动吗？" },
        { text: "加藤さんの息子さんは絵の展覧会で賞をもらったんです。", translation: "加藤的儿子在绘画展览会上得奖了。" },
        { text: "へえ、すごいですね。", translation: "哎呀，真了不起啊。" }
      ]
    },
    {
      id: "g13",
      pattern: "词语：公園（日中差异）",
      meaning: "日语中的「公園」与汉语“公园”不完全相同。日本的公园通常不售门票，范围也可包括供市民散步或休息的小地方。",
      structure: "公園 / 有料の公園 / 入園料",
      usage: "日本的公园一般不收费，少数收费公园类似中国那种发行门票的公园，但老人可免费或打折购票的地方较多。",
      examples: ["s17", "s18", "s21", "s24"],
      extraExamples: []
    }
  ],
  exercises: [
    {
      id: "e1",
      type: "fill",
      question: "练习I-1：仿照例句改写。病気です / 1か月会社を休みました",
      answer: "病気の時、1か月会社を休みました。",
      referenceAnswers: ["病気の時、1か月会社を休みました。"],
      relatedGrammar: ["g1"],
      relatedSentences: ["s1"],
      explanation: "二类形容词或名词接「時」时，用「病気の時」。"
    },
    {
      id: "e2",
      type: "fill",
      question: "练习I-1：仿照例句改写。海外旅行です / パスポートが要ります",
      answer: "海外旅行の時、パスポートが要ります。",
      referenceAnswers: ["海外旅行の時、パスポートが要ります。"],
      relatedGrammar: ["g1"],
      relatedSentences: ["s17"],
      explanation: "名词「海外旅行」后接「の時」，表示海外旅行的时候。"
    },
    {
      id: "e3",
      type: "fill",
      question: "练习I-2：仿照例句改写。困りました / わたしに相談してください",
      answer: "困った時、わたしに相談してください。",
      referenceAnswers: ["困った時、わたしに相談してください。"],
      relatedGrammar: ["g1"],
      relatedSentences: [],
      explanation: "已经发生或处于该状态时，用动词た形 +「時」。"
    },
    {
      id: "e4",
      type: "fill",
      question: "练习I-2：仿照例句改写。部屋を使いません / 電気を消してください",
      answer: "部屋を使わない時、電気を消してください。",
      referenceAnswers: ["部屋を使わない時、電気を消してください。"],
      relatedGrammar: ["g1"],
      relatedSentences: [],
      explanation: "否定的“使用房间的时候”要用动词ない形 +「時」。"
    },
    {
      id: "e5",
      type: "fill",
      question: "练习I-4：仿照例句改写。ラジオを聞きます / 食事の準備をします",
      answer: "ラジオを聞きながら、食事の準備をしています。",
      referenceAnswers: ["ラジオを聞きながら、食事の準備をしています。"],
      relatedGrammar: ["g2"],
      relatedSentences: ["s3"],
      explanation: "动词ます形去掉「ます」后接「ながら」，表示两个动作同时进行。"
    },
    {
      id: "e6",
      type: "fill",
      question: "练习I-4：仿照例句改写。部屋の中を歩きます / スピーチの練習をします",
      answer: "部屋の中を歩きながら、スピーチの練習をしています。",
      referenceAnswers: ["部屋の中を歩きながら、スピーチの練習をしています。"],
      relatedGrammar: ["g2"],
      relatedSentences: [],
      explanation: "「歩きながら」表示一边走一边做后项动作。"
    },
    {
      id: "e7",
      type: "fill",
      question: "练习I-4：仿照例句改写。明日から出張です / はい、1週間の予定です",
      answer: "明日から出張でしょう？",
      referenceAnswers: ["明日から出張でしょう？"],
      relatedGrammar: ["g3"],
      relatedSentences: ["s4"],
      explanation: "向对方确认自己认为基本确定的事情时，用升调的「でしょう？」。"
    },
    {
      id: "e8",
      type: "fill",
      question: "练习I-5：仿照例句改写。父は市役所で働きます",
      answer: "父は市役所で働いています。",
      referenceAnswers: ["父は市役所で働いています。"],
      relatedGrammar: ["g4"],
      relatedSentences: [],
      explanation: "表示职业、习惯或持续状态时，可用「働いています」。"
    },
    {
      id: "e9",
      type: "choice",
      question: "练习II-2：紙を切る時に使う道具です。请选择合适的词。",
      choices: ["食堂", "携帯電話", "はさみ", "クレジットカード", "郵便局"],
      answer: "はさみ",
      relatedGrammar: ["g1"],
      relatedSentences: [],
      explanation: "剪纸时使用的工具是「はさみ」。"
    },
    {
      id: "e10",
      type: "choice",
      question: "练习II-2：買い物する時に使う物です。请选择合适的词。",
      choices: ["食堂", "携帯電話", "はさみ", "クレジットカード", "郵便局"],
      answer: "クレジットカード",
      relatedGrammar: ["g1"],
      relatedSentences: [],
      explanation: "购物时使用的物品是「クレジットカード」。"
    },
    {
      id: "e11",
      type: "fill",
      question: "练习II-3：あそこで電話を（かけます→）人はだれですか。",
      answer: "あそこで電話をかけている人はだれですか。",
      referenceAnswers: ["あそこで電話をかけている人はだれですか。"],
      relatedGrammar: ["g4"],
      relatedSentences: [],
      explanation: "修饰名词「人」时，把「電話をかけます」变为「電話をかけている」。"
    },
    {
      id: "e12",
      type: "fill",
      question: "练习II-3：李さんは歌を（歌います→）ながら、掃除しています。",
      answer: "李さんは歌を歌いながら、掃除しています。",
      referenceAnswers: ["李さんは歌を歌いながら、掃除しています。"],
      relatedGrammar: ["g2"],
      relatedSentences: ["s16"],
      explanation: "「歌います」去掉「ます」接「ながら」，变为「歌いながら」。"
    },
    {
      id: "e13",
      type: "translation",
      question: "练习II-4：我小时候，发生过大地震。",
      answer: "子供の時、大きな地震がありました。",
      referenceAnswers: ["子供の時、大きな地震がありました。"],
      relatedGrammar: ["g1"],
      relatedSentences: ["s1"],
      explanation: "“小时候”用「子供の時」，后面接过去发生的事情。"
    },
    {
      id: "e14",
      type: "translation",
      question: "练习II-4：小李正边看电视边吃饭。",
      answer: "李さんはテレビを見ながら食事をしています。",
      referenceAnswers: ["李さんはテレビを見ながら食事をしています。"],
      relatedGrammar: ["g2", "g4"],
      relatedSentences: ["s3"],
      explanation: "同时进行两个动作时，用「見ながら」。"
    },
    {
      id: "e15",
      type: "translation",
      question: "练习II-4：森先生，昨天你在车站附近的咖啡馆来着吧？",
      answer: "森さん、昨日、駅前の喫茶店にいたでしょう？",
      referenceAnswers: ["森さん、昨日、駅前の喫茶店にいたでしょう？"],
      relatedGrammar: ["g3"],
      relatedSentences: ["s10"],
      explanation: "向对方确认过去的情况时，可用た形 +「でしょう？」。"
    }
  ]
};

const standardExercises = [
  {
    id: "ex-i-1-1",
    groupId: "i-1",
    groupTitle: "练习 I · 1",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "子供です / 横浜に住んでいました → 子供の時、横浜に住んでいました。",
    type: "fill",
    question: "病気です / 1か月会社を休みました",
    answer: "病気の時、1か月会社を休みました。",
    referenceAnswers: ["病気の時、1か月会社を休みました。"],
    relatedGrammar: ["g1"],
    relatedSentences: ["s1"],
    explanation: "二类形容词或名词接「時」时，用「病気の時」。"
  },
  {
    id: "ex-i-1-2",
    groupId: "i-1",
    groupTitle: "练习 I · 1",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "子供です / 横浜に住んでいました → 子供の時、横浜に住んでいました。",
    type: "fill",
    question: "海外旅行です / パスポートが要ります",
    answer: "海外旅行の時、パスポートが要ります。",
    referenceAnswers: ["海外旅行の時、パスポートが要ります。"],
    relatedGrammar: ["g1"],
    relatedSentences: ["s17"],
    explanation: "名词「海外旅行」后接「の時」，表示海外旅行的时候。"
  },
  {
    id: "ex-i-2-1",
    groupId: "i-2",
    groupTitle: "练习 I · 2",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "天気がいいです / 友達と野球をします → 天気がいい時、友達と野球をします。",
    type: "fill",
    question: "困りました / わたしに相談してください",
    answer: "困った時、わたしに相談してください。",
    referenceAnswers: ["困った時、わたしに相談してください。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "已经发生或处于该状态时，用动词た形 +「時」。"
  },
  {
    id: "ex-i-2-2",
    groupId: "i-2",
    groupTitle: "练习 I · 2",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "コーヒーを飲みます / 砂糖を入れます → コーヒーを飲む時、砂糖を入れます。",
    type: "fill",
    question: "部屋を使いません / 電気を消してください",
    answer: "部屋を使わない時、電気を消してください。",
    referenceAnswers: ["部屋を使わない時、電気を消してください。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "否定的“使用房间的时候”要用动词ない形 +「時」。"
  },
  {
    id: "ex-i-3-1",
    groupId: "i-3",
    groupTitle: "练习 I · 3",
    category: "听力练习",
    instruction: "听录音，仿照例句回答录音中的提问。",
    example: "子供の時、どこに住んでいましたか。 / 上海 → 上海に住んでいました。",
    type: "listening",
    audioRequired: true,
    hasAnswer: false,
    question: "コーヒーか紅茶",
    answer: "",
    referenceAnswers: [],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "本题需要教材录音。当前未提供录音，暂不判分。"
  },
  {
    id: "ex-i-3-2",
    groupId: "i-3",
    groupTitle: "练习 I · 3",
    category: "听力练习",
    instruction: "听录音，仿照例句回答录音中的提问。",
    example: "子供の時、どこに住んでいましたか。 / 上海 → 上海に住んでいました。",
    type: "listening",
    audioRequired: true,
    hasAnswer: false,
    question: "旅行",
    answer: "",
    referenceAnswers: [],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "本题需要教材录音。当前未提供录音，暂不判分。"
  },
  {
    id: "ex-i-4-1",
    groupId: "i-4",
    groupTitle: "练习 I · 4",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "雑誌を読みます / ご飯を食べます → 雑誌を読みながら、ご飯を食べています。",
    type: "fill",
    question: "ラジオを聞きます / 食事の準備をします",
    answer: "ラジオを聞きながら、食事の準備をしています。",
    referenceAnswers: ["ラジオを聞きながら、食事の準備をしています。"],
    relatedGrammar: ["g2"],
    relatedSentences: ["s3"],
    explanation: "动词ます形去掉「ます」后接「ながら」。"
  },
  {
    id: "ex-i-4-2",
    groupId: "i-4",
    groupTitle: "练习 I · 4",
    category: "确认表达练习",
    instruction: "仿照例句，用「でしょう？」确认对方信息。",
    example: "野球が好きです / ええ、大好きです → 森さん、野球が好きでしょう？",
    type: "fill",
    question: "明日から出張です / はい、1週間の予定です",
    answer: "明日から出張でしょう？",
    referenceAnswers: ["明日から出張でしょう？"],
    relatedGrammar: ["g3"],
    relatedSentences: ["s4"],
    explanation: "向对方确认自己认为基本确定的事情时，用升调的「でしょう？」。"
  },
  {
    id: "ex-i-5-1",
    groupId: "i-5",
    groupTitle: "练习 I · 5",
    category: "句型变换",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "姉は銀行で働きます → 姉は銀行で働いています。",
    type: "fill",
    question: "父は市役所で働きます",
    answer: "父は市役所で働いています。",
    referenceAnswers: ["父は市役所で働いています。"],
    relatedGrammar: ["g4"],
    relatedSentences: [],
    explanation: "表示职业、习惯或持续状态时，可用「働いています」。"
  },
  {
    id: "ex-i-6-1",
    groupId: "i-6",
    groupTitle: "练习 I · 6",
    category: "听力会话",
    instruction: "听录音，仿照例句替换画线部分练习会话。",
    example: "葉子さん / 大学に通います → 甲：あのう、葉子さんでしょう？ 乙：あっ、李さん、しばらくですね。",
    type: "listening",
    audioRequired: true,
    hasAnswer: false,
    question: "キムさん / 木下さん / スーパーで働きます",
    answer: "",
    referenceAnswers: [],
    relatedGrammar: ["g3", "g4"],
    relatedSentences: [],
    explanation: "本题需要教材录音。当前未提供录音，暂不判分。"
  },
  {
    id: "ex-ii-1-1",
    groupId: "ii-1",
    groupTitle: "练习 II · 1",
    category: "看图造句",
    instruction: "看图，仿照例句造句。",
    example: "テレビを見ながら、晩ご飯を食べています。",
    type: "fill",
    question: "タバコを吸います / テレビを見ます",
    answer: "タバコを吸いながら、テレビを見ています。",
    referenceAnswers: ["タバコを吸いながら、テレビを見ています。"],
    relatedGrammar: ["g2", "g4"],
    relatedSentences: [],
    explanation: "「吸います」去掉「ます」接「ながら」。"
  },
  {
    id: "ex-ii-2-1",
    groupId: "ii-2",
    groupTitle: "练习 II · 2",
    category: "选词填空",
    instruction: "从词库中选择适当的词语填入括号中。",
    example: "ご飯を食べる時に使う物です。（はし）",
    type: "choice",
    question: "紙を切る時に使う道具です。",
    choices: ["食堂", "携帯電話", "はさみ", "クレジットカード", "郵便局"],
    answer: "はさみ",
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "剪纸时使用的工具是「はさみ」。"
  },
  {
    id: "ex-ii-2-2",
    groupId: "ii-2",
    groupTitle: "练习 II · 2",
    category: "选词填空",
    instruction: "从词库中选择适当的词语填入括号中。",
    example: "ご飯を食べる時に使う物です。（はし）",
    type: "choice",
    question: "買い物する時に使う物です。",
    choices: ["食堂", "携帯電話", "はさみ", "クレジットカード", "郵便局"],
    answer: "クレジットカード",
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "购物时使用的物品是「クレジットカード」。"
  },
  {
    id: "ex-ii-3-1",
    groupId: "ii-3",
    groupTitle: "练习 II · 3",
    category: "变形完成句子",
    instruction: "将括号中的词语变成适当的形式，完成句子。",
    example: "疲れます → 疲れた時、ゆっくりお風呂に入ります。",
    type: "fill",
    question: "あそこで電話を（かけます→）人はだれですか。",
    answer: "あそこで電話をかけている人はだれですか。",
    referenceAnswers: ["あそこで電話をかけている人はだれですか。"],
    relatedGrammar: ["g4"],
    relatedSentences: [],
    explanation: "修饰名词「人」时，把「電話をかけます」变为「電話をかけている」。"
  },
  {
    id: "ex-ii-3-2",
    groupId: "ii-3",
    groupTitle: "练习 II · 3",
    category: "变形完成句子",
    instruction: "将括号中的词语变成适当的形式，完成句子。",
    example: "疲れます → 疲れた時、ゆっくりお風呂に入ります。",
    type: "fill",
    question: "李さんは歌を（歌います→）ながら、掃除しています。",
    answer: "李さんは歌を歌いながら、掃除しています。",
    referenceAnswers: ["李さんは歌を歌いながら、掃除しています。"],
    relatedGrammar: ["g2"],
    relatedSentences: ["s16"],
    explanation: "「歌います」去掉「ます」接「ながら」，变为「歌いながら」。"
  },
  {
    id: "ex-ii-4-1",
    groupId: "ii-4",
    groupTitle: "练习 II · 4",
    category: "翻译",
    instruction: "将下面的句子译成日语。",
    example: "",
    type: "translation",
    question: "我小时候，发生过大地震。",
    answer: "子供の時、大きな地震がありました。",
    referenceAnswers: ["子供の時、大きな地震がありました。"],
    relatedGrammar: ["g1"],
    relatedSentences: ["s1"],
    explanation: "“小时候”用「子供の時」，后面接过去发生的事情。"
  },
  {
    id: "ex-ii-4-2",
    groupId: "ii-4",
    groupTitle: "练习 II · 4",
    category: "翻译",
    instruction: "将下面的句子译成日语。",
    example: "",
    type: "translation",
    question: "小李正边看电视边吃饭。",
    answer: "李さんはテレビを見ながら食事をしています。",
    referenceAnswers: ["李さんはテレビを見ながら食事をしています。"],
    relatedGrammar: ["g2", "g4"],
    relatedSentences: ["s3"],
    explanation: "同时进行两个动作时，用「見ながら」。"
  },
  {
    id: "ex-ii-4-3",
    groupId: "ii-4",
    groupTitle: "练习 II · 4",
    category: "翻译",
    instruction: "将下面的句子译成日语。",
    example: "",
    type: "translation",
    question: "森先生，昨天你在车站附近的咖啡馆来着吧？",
    answer: "森さん、昨日、駅前の喫茶店にいたでしょう？",
    referenceAnswers: ["森さん、昨日、駅前の喫茶店にいたでしょう？"],
    relatedGrammar: ["g3"],
    relatedSentences: ["s10"],
    explanation: "向对方确认过去的情况时，可用た形 +「でしょう？」。"
  }
];

lesson.exercises = standardExercises;

const textStructure = [
  {
    title: "基本课文",
    groups: [
      { title: "基本句", kind: "statements", ids: ["s1", "s2", "s3", "s4"] },
      { title: "对话 A", kind: "dialogue", ids: ["s5", "s6"] },
      { title: "对话 B", kind: "dialogue", ids: ["s7", "s7b"] },
      { title: "对话 C", kind: "dialogue", ids: ["s8", "s9"] },
      { title: "对话 D", kind: "dialogue", ids: ["s10", "s11"] }
    ]
  },
  {
    title: "应用课文 · 朝の公園",
    groups: [
      { title: "到分公司后", kind: "dialogue", ids: ["s12", "s13", "s14", "s15", "s16"] },
      { title: "聊起公园收费的问题", kind: "dialogue", ids: ["s17", "s18", "s19", "s20"] },
      { title: "小戴想起孩提时代的事", kind: "dialogue", ids: ["s21", "s22", "s23", "s24", "s25"] }
    ]
  }
];

const audioVoices = [
  { no: 81, id: "Japanese_IntellectualSenior", name: "Intellectual Senior" },
  { no: 82, id: "Japanese_DecisivePrincess", name: "Decisive Princess" },
  { no: 83, id: "Japanese_LoyalKnight", name: "Loyal Knight" },
  { no: 84, id: "Japanese_DominantMan", name: "Dominant Man" },
  { no: 85, id: "Japanese_SeriousCommander", name: "Serious Commander" },
  { no: 86, id: "Japanese_ColdQueen", name: "Cold Queen" },
  { no: 87, id: "Japanese_DependableWoman", name: "Dependable Woman" },
  { no: 88, id: "Japanese_GentleButler", name: "Gentle Butler" },
  { no: 89, id: "Japanese_KindLady", name: "Kind Lady" },
  { no: 90, id: "Japanese_CalmLady", name: "Calm Lady" },
  { no: 91, id: "Japanese_OptimisticYouth", name: "Optimistic Youth" },
  { no: 92, id: "Japanese_GenerousIzakayaOwner", name: "Generous Izakaya Owner" },
  { no: 93, id: "Japanese_SportyStudent", name: "Sporty Student" },
  { no: 94, id: "Japanese_InnocentBoy", name: "Innocent Boy" }
];
const defaultVoiceId = "Japanese_IntellectualSenior";
const sampleAudioText = "子供の時、大きな地震がありました。";
const externalWordDistractors = [
  { id: "d-keiei", jp: "経営", kana: "けいえい", cn: "经营" },
  { id: "d-keiki", jp: "景気", kana: "けいき", cn: "景气，行情" },
  { id: "d-kankei", jp: "関係", kana: "かんけい", cn: "关系" },
  { id: "d-kokusai", jp: "国際", kana: "こくさい", cn: "国际" },
  { id: "d-gakko", jp: "学校", kana: "がっこう", cn: "学校" },
  { id: "d-gakusei", jp: "学生", kana: "がくせい", cn: "学生" },
  { id: "d-nikki", jp: "日程", kana: "にってい", cn: "日程" },
  { id: "d-kyoshi", jp: "教室", kana: "きょうしつ", cn: "教室" },
  { id: "d-taiso", jp: "運動", kana: "うんどう", cn: "运动" },
  { id: "d-ryoko", jp: "旅行", kana: "りょこう", cn: "旅行" },
  { id: "d-sodan", jp: "説明します", kana: "せつめいします", cn: "说明" },
  { id: "d-riyo", jp: "使用します", kana: "しようします", cn: "使用" },
  { id: "d-komarimasu", jp: "止まります", kana: "とまります", cn: "停止" },
  { id: "d-ireru", jp: "出します", kana: "だします", cn: "拿出，提交" },
  { id: "d-signal", jp: "交通", kana: "こうつう", cn: "交通" },
  { id: "d-yuryo", jp: "無料", kana: "むりょう", cn: "免费" },
  { id: "d-nyuen", jp: "入場料", kana: "にゅうじょうりょう", cn: "入场费" },
  { id: "d-hoka", jp: "さらに", kana: "さらに", cn: "而且，此外" },
  { id: "d-shibaraku", jp: "久しぶり", kana: "ひさしぶり", cn: "好久不见" },
  { id: "d-kizuku", jp: "気をつけます", kana: "きをつけます", cn: "小心，注意" }
];

const state = {
  wordProgress: initialWordProgress(),
  wordLearning: initialWordLearning(),
  exerciseResults: read(`lesson:${lesson.id}:exerciseResults`, []),
  interactionProgress: initialInteractionProgress(),
  grammarPractice: initialGrammarPractice(),
  currentVoiceId: read(`lesson:${lesson.id}:currentVoiceId`, defaultVoiceId),
  audioStatus: null,
  audioStatusVoiceId: "",
  audioBusy: "",
  audioMessage: "",
  currentWord: 0,
  currentSentence: 0,
  currentGrammar: 0,
  currentExercise: 0,
  vocabPhase: "pronunciation",
  vocabTestQueue: read(`lesson:${lesson.id}:vocabTestQueue`, []),
  currentVocabTest: read(`lesson:${lesson.id}:currentVocabTest`, 0),
  recallResult: "",
  vocabReveal: null,
  recordingPreparingWordId: "",
  recordingWordId: "",
  recordingStoppingWordId: "",
  recordingError: "",
  grammarRecordingPreparingId: "",
  grammarRecordingId: "",
  grammarRecordingStoppingId: "",
  grammarRecordingErrorKey: "",
  grammarRecordingError: "",
  playbackRate: Number(read(`lesson:${lesson.id}:playbackRate`, 1)) || 1,
  answer: "",
  submitted: false,
  modal: null
};

const app = document.querySelector("#app");
let lastAutoSpokenSentence = null;
let lastAutoSpokenWord = null;
let pendingAutoSpeakWordId = "";
let speechPrimed = false;
let lastHoverSpeech = { text: "", at: 0 };
let lastKeyAction = { key: "", at: 0 };
let activeAudio = null;
let currentSpeechText = "";
let currentSpeechOnEnded = null;
let selectionLookupToken = 0;
let recordingSession = null;
let recordingPressWordId = "";
let recordingReleaseRequested = false;
let recordingPointerId = null;
let vocabTestAdvanceTimer = null;
const audioVersions = read(`lesson:${lesson.id}:audioVersions`, {});

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(`japaflow:${key}`)) || fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(`japaflow:${key}`, JSON.stringify(value));
}

function removeStored(key) {
  localStorage.removeItem(`japaflow:${key}`);
}

function initialWordProgress() {
  const fallback = Object.fromEntries(lesson.vocabulary.map((word) => [word.id, "unseen"]));
  const saved = read(`lesson:${lesson.id}:wordProgress`, fallback);
  return { ...fallback, ...saved };
}

function defaultWordLearning(wordId, legacy = "unseen") {
  return {
    mainStatus: legacy === "familiar" ? "mastered" : legacy === "unfamiliar" ? "review" : "new",
    diagnosticTags: [],
    meaningToWordCorrect: false,
    audioToWordCorrect: false,
    wordToMeaningCorrect: false,
    pronunciationPassed: false,
    pronunciationScore: 0,
    accuracyScore: 0,
    fluencyScore: 0,
    completenessScore: 0,
    pronunciationReasons: [],
    recognizedText: "",
    attempts: { meaningToWord: 0, audioToWord: 0, wordToMeaning: 0, pronunciation: 0 },
    lastPracticedAt: ""
  };
}

function initialWordLearning() {
  const legacyProgress = initialWordProgress();
  const fallback = Object.fromEntries(lesson.vocabulary.map((word) => [word.id, defaultWordLearning(word.id, legacyProgress[word.id])]));
  const saved = read(`lesson:${lesson.id}:wordLearning`, {});
  return Object.fromEntries(lesson.vocabulary.map((word) => [
    word.id,
    { ...fallback[word.id], ...(saved[word.id] || {}), attempts: { ...fallback[word.id].attempts, ...(saved[word.id]?.attempts || {}) } }
  ]));
}

function writeWordLearning() {
  write(`lesson:${lesson.id}:wordLearning`, state.wordLearning);
}

function resetWordLearningData(shouldRender = true) {
  removeStored(`lesson:${lesson.id}:wordProgress`);
  removeStored(`lesson:${lesson.id}:wordLearning`);
  removeStored(`lesson:${lesson.id}:vocabTestQueue`);
  removeStored(`lesson:${lesson.id}:currentVocabTest`);
  state.wordProgress = Object.fromEntries(lesson.vocabulary.map((word) => [word.id, "unseen"]));
  state.wordLearning = Object.fromEntries(lesson.vocabulary.map((word) => [word.id, defaultWordLearning(word.id)]));
  state.vocabTestQueue = [];
  state.currentVocabTest = 0;
  state.currentWord = 0;
  state.vocabPhase = "pronunciation";
  state.recallResult = "";
  state.vocabReveal = null;
  state.recordingPreparingWordId = "";
  state.recordingWordId = "";
  state.recordingStoppingWordId = "";
  state.recordingError = "";
  state.grammarRecordingPreparingId = "";
  state.grammarRecordingId = "";
  state.grammarRecordingStoppingId = "";
  state.grammarRecordingErrorKey = "";
  state.grammarRecordingError = "";
  lastAutoSpokenWord = null;
  pendingAutoSpeakWordId = "";
  if (shouldRender) render();
}

function initialInteractionProgress() {
  const fallback = { words: {}, sentences: {}, grammarExamples: {} };
  const saved = read(`lesson:${lesson.id}:interactionProgress`, fallback);
  return {
    words: { ...fallback.words, ...(saved.words || {}) },
    sentences: { ...fallback.sentences, ...(saved.sentences || {}) },
    grammarExamples: { ...fallback.grammarExamples, ...(saved.grammarExamples || {}) }
  };
}

function writeInteractionProgress() {
  write(`lesson:${lesson.id}:interactionProgress`, state.interactionProgress);
}

function defaultGrammarPractice() {
  return {
    answer: "",
    submitted: false,
    correct: false,
    attempts: 0,
    updatedAt: "",
    revealed: false,
    pronunciationPassed: false,
    pronunciationScore: 0,
    accuracyScore: 0,
    fluencyScore: 0,
    completenessScore: 0,
    pronunciationReasons: [],
    recognizedText: "",
    debugAudioUrl: "",
    debugAudioPath: "",
    pronunciationDuration: 0,
    pronunciationPeak: 0,
    pronunciationAttempts: 0,
    collapsed: false
  };
}

function grammarPracticeKey(grammarId, exampleId) {
  return `${grammarId}:${exampleId}`;
}

function initialGrammarPractice() {
  const saved = read(`lesson:${lesson.id}:grammarPractice`, {});
  const fallback = {};
  lesson.grammar.forEach((grammar) => {
    const practiceItems = grammarPracticeItems(grammar).items;
    practiceItems.forEach((item) => {
      const exampleId = item.id;
      fallback[grammarPracticeKey(grammar.id, exampleId)] = defaultGrammarPractice();
    });
  });
  return Object.fromEntries(Object.entries(fallback).map(([key, base]) => [key, { ...base, ...(saved[key] || {}) }]));
}

function writeGrammarPractice() {
  write(`lesson:${lesson.id}:grammarPractice`, state.grammarPractice);
}

function grammarPracticeState(grammarId, exampleId) {
  return state.grammarPractice[grammarPracticeKey(grammarId, exampleId)] || defaultGrammarPractice();
}

function updateGrammarPractice(grammarId, exampleId, patch) {
  const key = grammarPracticeKey(grammarId, exampleId);
  const previous = grammarPracticeState(grammarId, exampleId);
  state.grammarPractice = { ...state.grammarPractice, [key]: { ...previous, ...patch } };
  writeGrammarPractice();
}

function resetGrammarPractice(grammarId, exampleId) {
  const key = grammarPracticeKey(grammarId, exampleId);
  state.grammarPractice = { ...state.grammarPractice, [key]: defaultGrammarPractice() };
  writeGrammarPractice();
}

function navigate(path) {
  history.pushState({}, "", lessonPath(path));
  render();
}

function route() {
  const pathname = decodeURIComponent(location.pathname).replace(/[\s\u3000/]+$/u, "");
  const match = pathname.match(/^\/lesson\/(\d+)\/([^/]+)$/);
  return match ? { lessonId: match[1], page: match[2] } : { page: "home" };
}

function lessonPath(path) {
  const [pathname, search = ""] = String(path).split("?");
  const params = new URLSearchParams(search);
  const currentLimit = new URLSearchParams(location.search).get("limit");
  if (currentLimit && !params.has("limit")) params.set("limit", currentLimit);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function currentVocabularyLimit() {
  const value = Number(new URLSearchParams(location.search).get("limit"));
  if (!Number.isFinite(value) || value <= 0) return lesson.vocabulary.length;
  return Math.min(Math.floor(value), lesson.vocabulary.length);
}

function activeVocabulary() {
  return lesson.vocabulary.slice(0, currentVocabularyLimit());
}

function sentenceById(id) {
  return lesson.sentences.find((sentence) => sentence.id === id);
}

function wordById(id) {
  return lesson.vocabulary.find((word) => word.id === id);
}

function wordByText(text) {
  const normalized = normalizeLookupText(text);
  if (!normalized) return null;
  return lesson.vocabulary.find((word) => {
    const jp = normalizeLookupText(word.jp);
    const kana = normalizeLookupText(word.kana);
    return normalized === jp || normalized === kana;
  }) || null;
}

function grammarById(id) {
  return lesson.grammar.find((grammar) => grammar.id === id);
}

const grammarClozeTargets = {
  g1: ["子供の時", "映画を見る時", "学生の時", "入る時", "小さい時", "休みの時", "朝や夕方の涼しい時"],
  g2: ["見ながら", "しながら", "踊りながら", "遊びながら"],
  g3: ["でしょう？"],
  g4: ["しています", "していました", "している", "集まっている"],
  g5: ["仕事で"],
  g6: ["と会っていた"],
  g7: ["アルバイトをしながら"],
  g8: ["学校に通っている", "学校に通っています"],
  g9: ["大勢の人", "大勢の"],
  g10: ["お年寄り"],
  g11: ["そう言えば"],
  g12: ["へえ"],
  g13: ["有料", "入園料"]
};

function grammarExampleTarget(grammar, sentenceText) {
  const candidates = grammarClozeTargets[grammar.id] || [];
  return candidates.find((candidate) => sentenceText.includes(candidate)) || "";
}

function grammarExampleCloze(grammar, sentenceText) {
  const target = grammarExampleTarget(grammar, sentenceText);
  if (!target) {
    return { target: "", cloze: sentenceText.replace(/[^\s、。？]+/, "＿＿＿＿") };
  }
  return {
    target,
    cloze: sentenceText.replace(target, "＿＿＿＿")
  };
}

function sanitizeAudioPath(path) {
  return path ? `${path}?v=${audioVersions[path] || 0}` : "";
}

function speak(text, onEnded) {
  if (!("speechSynthesis" in window)) {
    if (onEnded) window.setTimeout(onEnded, 0);
    return;
  }
  primeSpeech();
  stopCurrentAudio();
  speechSynthesis.cancel();
  currentSpeechText = text;
  currentSpeechOnEnded = onEnded || null;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = state.playbackRate;
  const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ja"));
  if (voice) utterance.voice = voice;
  utterance.onend = () => {
    if (currentSpeechText === text) currentSpeechText = "";
    const ended = currentSpeechOnEnded;
    currentSpeechOnEnded = null;
    if (ended) ended();
  };
  utterance.onerror = () => {
    if (currentSpeechText === text) currentSpeechText = "";
    currentSpeechOnEnded = null;
  };
  speechSynthesis.speak(utterance);
}

function audioUrl(type, id) {
  if (state.currentVoiceId && state.currentVoiceId !== defaultVoiceId) {
    return `/audio/lesson${lesson.id}/voices/${state.currentVoiceId}/${type}s/${id}.mp3`;
  }
  return `/audio/lesson${lesson.id}/${type}s/${id}.mp3`;
}

function managedAudioUrl(voiceId, type, id) {
  if (voiceId === defaultVoiceId) return `/audio/lesson${lesson.id}/${type}s/${id}.mp3`;
  return `/audio/lesson${lesson.id}/voices/${voiceId}/${type}s/${id}.mp3`;
}

function extraExampleAudioUrl(grammarId, index) {
  return audioUrl("sentence", `${grammarId}-extra-${index + 1}`);
}

function playAudio(text, audio, onEnded) {
  stopCurrentAudio();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  currentSpeechText = "";
  currentSpeechOnEnded = null;
  if (audio) {
    activeAudio = new Audio(sanitizeAudioPath(audio));
    activeAudio.preload = "auto";
    activeAudio.playbackRate = state.playbackRate;
    activeAudio.currentTime = 0;
    const start = () => {
      if (!activeAudio) return;
      activeAudio.playbackRate = state.playbackRate;
      activeAudio.currentTime = 0;
      activeAudio.play().catch(() => {
        activeAudio = null;
        speak(text);
      });
    };
    if (activeAudio.readyState >= 2) {
      start();
    } else {
      activeAudio.addEventListener("canplaythrough", start, { once: true });
      activeAudio.load();
    }
    activeAudio.addEventListener("ended", () => {
      activeAudio = null;
      if (onEnded) onEnded();
    }, { once: true });
    activeAudio.addEventListener("error", () => {
      activeAudio = null;
      speak(text, onEnded);
    }, { once: true });
    return;
  }
  speak(text, onEnded);
}

function stopCurrentAudio() {
  if (!activeAudio) return;
  activeAudio.pause();
  activeAudio.currentTime = 0;
  activeAudio = null;
  currentSpeechText = "";
  currentSpeechOnEnded = null;
}

function primeSpeech() {
  if (speechPrimed || !("speechSynthesis" in window)) return;
  speechPrimed = true;
  speechSynthesis.getVoices();
}

function speakFromHover(text, audio) {
  const now = Date.now();
  if (lastHoverSpeech.text === text && now - lastHoverSpeech.at < 700) return;
  lastHoverSpeech = { text, at: now };
  playAudio(text, audio);
}

function setPlaybackRate(rate) {
  const next = Number(rate);
  if (!Number.isFinite(next) || next <= 0) return;
  state.playbackRate = next;
  write(`lesson:${lesson.id}:playbackRate`, state.playbackRate);
  if (activeAudio) {
    activeAudio.playbackRate = state.playbackRate;
  }
  if (("speechSynthesis" in window) && (speechSynthesis.speaking || speechSynthesis.pending) && currentSpeechText) {
    const text = currentSpeechText;
    const onEnded = currentSpeechOnEnded;
    currentSpeechOnEnded = null;
    speechSynthesis.cancel();
    window.setTimeout(() => {
      speak(text, onEnded || null);
    }, 0);
  }
  render();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeAnswer(value) {
  return value.trim().replace(/\s+/g, "").replace(/[。．.、，,「」『』]/g, "");
}

function normalizeLookupText(value) {
  return String(value || "")
    .trim()
    .replace(/^[\s「『（(【\[]+|[\s」』）)】\]、。,.!?！？]+$/g, "");
}

function isCorrect(exercise, value) {
  if (exercise.type === "sentence_making") return value.trim().length > 0;
  const candidates = [exercise.answer, ...(exercise.referenceAnswers || [])];
  return candidates.some((item) => normalizeAnswer(item) === normalizeAnswer(value));
}

function wordLearningState(wordId) {
  return state.wordLearning[wordId] || defaultWordLearning(wordId, state.wordProgress[wordId]);
}

function updateWordLearning(wordId, patch) {
  const current = wordLearningState(wordId);
  const next = {
    ...current,
    ...patch,
    attempts: { ...current.attempts, ...(patch.attempts || {}) },
    lastPracticedAt: new Date().toISOString()
  };
  next.diagnosticTags = wordDiagnostics(next);
  next.mainStatus = wordMainStatus(next);
  state.wordLearning[wordId] = next;
  state.wordProgress[wordId] = next.mainStatus === "mastered" ? "familiar" : next.mainStatus === "new" ? "unseen" : "unfamiliar";
  writeWordLearning();
  write(`lesson:${lesson.id}:wordProgress`, state.wordProgress);
  return next;
}

function wordDiagnostics(item) {
  const tags = new Set(item.diagnosticTags || []);
  if (item.attempts.audioToWord && !item.audioToWordCorrect) tags.add("听音弱");
  if (item.attempts.wordToMeaning && !item.wordToMeaningCorrect) tags.add("日文识别弱");
  if (item.attempts.pronunciation && !item.pronunciationPassed) {
    if ((item.fluencyScore || 0) < 70) tags.add("流畅度不足");
    tags.add("发音不标准");
  }
  if (item.pronunciationPassed) {
    tags.delete("发音不标准");
    tags.delete("流畅度不足");
  }
  if (item.audioToWordCorrect) tags.delete("听音弱");
  if (item.wordToMeaningCorrect) tags.delete("日文识别弱");
  return [...tags];
}

function wordMainStatus(item) {
  const touched = item.attempts.pronunciation || item.attempts.audioToWord || item.attempts.wordToMeaning;
  if (!touched) return "new";
  const mastered = item.pronunciationPassed && item.audioToWordCorrect && item.wordToMeaningCorrect;
  if (mastered) return "mastered";
  return item.diagnosticTags?.length ? "review" : "learning";
}

function wordMainStatusText(status) {
  return { new: "未学", learning: "学习中", review: "待复习", mastered: "已掌握" }[status] || "未学";
}

function wordTagBadges(tags) {
  return tags.length ? tags.map((tag) => `<span class="diagnostic-tag">${tag}</span>`).join("") : "<span class='muted'>暂无诊断标签</span>";
}

function interactionBucket(type) {
  return {
    word: state.interactionProgress.words,
    sentence: state.interactionProgress.sentences,
    grammarExample: state.interactionProgress.grammarExamples
  }[type];
}

function interactionState(type, id) {
  return interactionBucket(type)?.[id] || {
    pronunciationState: "unseen",
    retryCount: 0,
    skipped: false,
    lastPracticedAt: ""
  };
}

function recordInteraction(type, id, pronunciationState) {
  const bucket = interactionBucket(type);
  if (!bucket) return;
  const previous = interactionState(type, id);
  bucket[id] = {
    pronunciationState,
    retryCount: previous.retryCount + (pronunciationState === "retry" ? 1 : 0),
    skipped: pronunciationState === "skipped" ? true : previous.skipped,
    lastPracticedAt: new Date().toISOString()
  };
  writeInteractionProgress();
}

function interactionDone(type, id) {
  return ["smooth", "skipped"].includes(interactionState(type, id).pronunciationState);
}

function weakInteractionItems() {
  const weakWords = Object.entries(state.interactionProgress.words)
    .filter(([, item]) => item.pronunciationState === "retry" || item.skipped)
    .map(([id, item]) => ({ type: "word", id, label: wordById(id)?.jp || id, ...item }));
  const weakSentences = Object.entries(state.interactionProgress.sentences)
    .filter(([, item]) => item.pronunciationState === "retry" || item.skipped)
    .map(([id, item]) => ({ type: "sentence", id, label: sentenceById(id)?.text || id, ...item }));
  const weakGrammar = Object.entries(state.interactionProgress.grammarExamples)
    .filter(([, item]) => item.pronunciationState === "retry" || item.skipped)
    .map(([id, item]) => {
      const [, sentenceId] = id.split(":");
      return { type: "grammarExample", id, label: sentenceById(sentenceId)?.text || id, ...item };
    });
  return [...weakWords, ...weakSentences, ...weakGrammar];
}

function shadowControls(type, id, text, audio, options = {}) {
  const progress = interactionState(type, id);
  return `
    <div class="shadow-box">
      <div>
        <span class="label">跟读反馈</span>
        <p class="hint">${options.hint || "听标准音频后跟读，再选择你的状态。"}</p>
      </div>
      <div class="button-row">
        <button class="primary" data-shadow-action="smooth" data-shadow-type="${type}" data-shadow-id="${id}">流畅</button>
        <button class="secondary" data-shadow-action="retry" data-shadow-type="${type}" data-shadow-id="${id}" data-shadow-text="${text}" data-shadow-audio="${audio}">再听一遍</button>
        <button class="danger" data-shadow-action="skipped" data-shadow-type="${type}" data-shadow-id="${id}">跳过</button>
      </div>
      <p class="hint">状态：${pronunciationText(progress.pronunciationState)} · 重试 ${progress.retryCount} 次</p>
    </div>
  `;
}

function compactGrammarShadowControls(id, text, audio) {
  const progress = interactionState("grammarExample", id);
  if (progress.pronunciationState === "smooth") {
    return `<span class="compact-status success">已掌握</span>`;
  }
  return `
    <div class="compact-shadow">
      <span class="compact-status ${progress.pronunciationState}">${pronunciationText(progress.pronunciationState)}</span>
      <button class="mini-button primary" data-shadow-action="smooth" data-shadow-type="grammarExample" data-shadow-id="${id}">流畅</button>
      <button class="mini-button" data-shadow-action="retry" data-shadow-type="grammarExample" data-shadow-id="${id}" data-shadow-text="${text}" data-shadow-audio="${audio}">再听</button>
      <button class="mini-button danger" data-shadow-action="skipped" data-shadow-type="grammarExample" data-shadow-id="${id}">跳过</button>
    </div>
  `;
}

function pronunciationText(status) {
  return { smooth: "流畅", retry: "需要重试", skipped: "已跳过", unseen: "未跟读" }[status] || "未跟读";
}

function layout(content) {
  const current = route().page;
  return `
    <div class="shell">
      <header class="topbar">
        <div class="brand" role="button" tabindex="0" data-nav="/">
          <span class="brand-mark">日</span>
          <span>JapaFlow</span>
        </div>
        <nav class="nav">
          ${navLink("/", "首页", current === "home")}
          ${navLink(`/lesson/${lesson.id}/vocab`, "单词预热", current === "vocab")}
          ${navLink(`/lesson/${lesson.id}/grammar`, "语法", current === "grammar")}
          ${navLink(`/lesson/${lesson.id}/text`, "课文", current === "text")}
          ${navLink(`/lesson/${lesson.id}/exercises`, "练习", current === "exercises")}
      ${navLink(`/lesson/${lesson.id}/result`, "结果", current === "result")}
      <div class="manage-menu ${current === "audio" ? "active" : ""}">
        <button class="manage-trigger" type="button" data-nav="/lesson/${lesson.id}/audio">管理</button>
        <div class="manage-dropdown">
          ${navLink(`/lesson/${lesson.id}/audio`, "音频", current === "audio")}
        </div>
      </div>
    </nav>
    <div class="playback-control" aria-label="播放速度">
      ${[1, 0.6, 0.8, 1.2, 1.5].map((rate) => `
        <button class="playback-rate ${state.playbackRate === rate ? "active" : ""}" data-playback-rate="${rate}" type="button">${rate.toFixed(1)}x</button>
      `).join("")}
    </div>
  </header>
      <main class="main">${content}</main>
      ${state.modal ? modal(state.modal) : ""}
    </div>
  `;
}

function navLink(path, text, active) {
  return `<a href="${path}" class="${active ? "active" : ""}" data-link>${text}</a>`;
}

function home() {
  const seen = Object.values(state.wordProgress).filter((status) => status !== "unseen").length;
  const done = state.exerciseResults.length;
  return layout(`
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">教材驱动的逐步聚焦学习闭环</p>
        <h1>JapaFlow</h1>
        <p class="lead">从单词预热进入课文，再回到语法和练习反馈。当前原型聚焦一课的完整学习路径。</p>
        <div class="button-row">
          <button class="primary" data-nav="/lesson/${lesson.id}/vocab">开始学习</button>
          <button class="secondary" data-nav="/lesson/${lesson.id}/result">查看进度</button>
        </div>
      </div>
      <aside class="panel lesson-board">
        <div>
          <p class="eyebrow">当前学习课次</p>
          <h2>${lesson.title} · ${lesson.subtitle}</h2>
          <p class="muted">目标：完成单词预热、逐句课文、语法回顾、练习反馈和错误回溯。</p>
        </div>
        ${progressRow("单词预热", seen, activeVocabulary().length)}
        ${progressRow("课文句子", state.currentSentence + 1, lesson.sentences.length)}
        ${progressRow("练习完成", done, lesson.exercises.length)}
      </aside>
    </section>
  `);
}

function progressRow(label, value, total) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return `
    <div class="progress-row">
      <span>${label}</span>
      <div class="bar" aria-label="${label} ${pct}%"><span style="--value:${pct}%"></span></div>
      <strong>${value}/${total}</strong>
    </div>
  `;
}

function pronunciationPreheatDone() {
  return activeVocabulary().every((word) => wordLearningState(word.id).attempts.pronunciation > 0);
}

function ensureVocabTestQueue() {
  const words = activeVocabulary();
  const expectedLength = words.length * 2;
  const valid = Array.isArray(state.vocabTestQueue)
    && state.vocabTestQueue.length === expectedLength
    && state.vocabTestQueue.every((task) => task?.wordId && task?.type);
  if (valid) return;
  state.vocabTestQueue = words
    .flatMap((word) => [
      { id: `${word.id}:wordToMeaning`, wordId: word.id, type: "wordToMeaning" },
      { id: `${word.id}:audioToWord`, wordId: word.id, type: "audioToWord" }
    ])
    .sort((a, b) => stableOptionOrder(`${a.id}:test`) - stableOptionOrder(`${b.id}:test`));
  state.currentVocabTest = 0;
  write(`lesson:${lesson.id}:vocabTestQueue`, state.vocabTestQueue);
  write(`lesson:${lesson.id}:currentVocabTest`, state.currentVocabTest);
}

function currentVocabTestTask() {
  ensureVocabTestQueue();
  return state.vocabTestQueue[state.currentVocabTest] || null;
}

function startVocabTest() {
  ensureVocabTestQueue();
  state.vocabPhase = "test";
  state.recallResult = "";
  state.vocabReveal = null;
  if (vocabTestAdvanceTimer) window.clearTimeout(vocabTestAdvanceTimer);
  vocabTestAdvanceTimer = null;
  write(`lesson:${lesson.id}:currentVocabTest`, state.currentVocabTest);
  render();
}

function vocab() {
  if (new URLSearchParams(location.search).get("resetWords") === "1") {
    history.replaceState({}, "", lessonPath(`/lesson/${lesson.id}/vocab`));
    resetWordLearningData(false);
  }
  const vocabWords = activeVocabulary();
  if (state.currentWord >= vocabWords.length) state.currentWord = 0;
  const word = vocabWords[state.currentWord] || vocabWords[0];
  const learning = wordLearningState(word.id);
  const finished = vocabWords.every((item) => wordLearningState(item.id).mainStatus === "mastered");
  const weakItems = vocabWords.filter((item) => wordLearningState(item.id).mainStatus === "review");
  const testing = state.vocabPhase === "test";
  const preheated = pronunciationPreheatDone();
  const task = testing ? currentVocabTestTask() : null;
  return layout(`
    <div class="page-head">
      <div>
        <p class="eyebrow">${lesson.title} · 单词预热</p>
        <h2>${testing ? "全词表打乱测试" : "先完成全量发音预热"}</h2>
        <p>${testing ? "测试阶段不会展示假名、释义或右侧词表，避免短期提示干扰结果。" : "所有单词先走一遍听音和发音评价，再进入系统测试。"}</p>
      </div>
      <div class="button-row">
        ${!testing && preheated ? `<button class="primary" data-start-vocab-test>进入系统测试</button>` : ""}
        <button class="primary ${finished ? "emphasis" : ""}" data-nav="/lesson/${lesson.id}/grammar">进入语法</button>
      </div>
    </div>
    <section class="focus-layout">
      <div>
        <article class="panel word-focus">
          ${testing ? vocabTestPanel(task) : `
            <div class="word-count">${Math.min(state.currentWord + 1, vocabWords.length)}/${vocabWords.length}</div>
            <div class="kana">${word.kana}</div>
            <div class="jp-large">${word.jp}</div>
            <div class="meaning">${word.cn}</div>
            <p class="hint"><span class="kbd">←</span><span class="kbd">→</span> 切换单词，切换后会播放标准音</p>
            <div class="word-diagnostic-line">
              <strong>${wordMainStatusText(learning.mainStatus)}</strong>
              ${wordTagBadges(learning.diagnosticTags)}
            </div>
            ${pronunciationPanel(word)}
          `}
        </article>
        ${testing ? "" : `<div class="rail">
          ${vocabWords.map((item, index) => `
            <button class="${index === state.currentWord ? "current" : ""} ${wordLearningState(item.id).mainStatus === "mastered" ? "done" : ""}" data-word-index="${index}" ${index === state.currentWord ? "" : "disabled"}>
              ${item.jp}
            </button>
          `).join("")}
        </div>`}
      </div>
      <aside class="panel">
        ${testing ? `
          <h3>测试进度</h3>
          ${progressRow("打乱测试", Math.min(state.currentVocabTest + 1, state.vocabTestQueue.length), state.vocabTestQueue.length || vocabWords.length * 2)}
          <p class="hint">测试阶段不会展示词表，避免额外提示。</p>
        ` : `
          <h3>单词状态</h3>
          <div class="button-row">
            <button class="secondary" data-regenerate-word="${word.id}">勘误：重生成当前词发音</button>
            <button class="danger" data-reset-word-learning>重置单词学习数据</button>
          </div>
          ${weakItems.length ? `<p class="hint">待复习 ${weakItems.length} 个。系统会保留进阶入口，但建议复习弱项。</p>` : ""}
          <div class="status-list">
            ${vocabWords.map((item) => `
              <div class="status-item">
                <span>${item.jp} · ${item.cn}</span>
                <strong class="status-${state.wordProgress[item.id]}">${wordMainStatusText(wordLearningState(item.id).mainStatus)}</strong>
              </div>
            `).join("")}
          </div>
        `}
      </aside>
    </section>
  `);
}

function pronunciationPanel(word) {
  const learning = wordLearningState(word.id);
  const preparing = state.recordingPreparingWordId === word.id;
  const recording = state.recordingWordId === word.id;
  const stopping = state.recordingStoppingWordId === word.id;
  const recordLabel = stopping ? "正在评价" : recording ? "正在说话" : preparing ? "准备中" : "长按录音";
  const recordHint = stopping
    ? "正在收尾录音，马上提交评价..."
    : recording
      ? "请继续按住按钮，说完后松手提交评价。"
      : preparing
        ? "正在准备麦克风，等按钮变为正在说话后再开口。"
        : "";
  return `
    <div class="recall-box pronunciation-box">
      <span class="label">发音评价</span>
      <p class="hint">先听标准音，再长按录音按钮。按钮显示“正在说话”后再开口，松手自动停止并评价。</p>
      <div class="button-row">
        <button class="secondary" data-speak="${word.jp}" data-audio="${audioUrl("word", word.id)}">听标准音</button>
        <button
          class="hold-record-button ${preparing ? "preparing" : ""} ${recording ? "recording" : ""} ${stopping ? "stopping" : ""}"
          data-hold-record-word="${word.id}"
          aria-label="${recordLabel}"
          ${stopping ? "disabled" : ""}
        >
          <span class="record-icon"></span>
          <span>${recordLabel}</span>
        </button>
        <button class="ghost" data-skip-pronunciation="${word.id}">稍后复习</button>
      </div>
      ${recordHint ? `<p class="hint">${recordHint}</p>` : ""}
      ${state.recordingError ? `<p class="hint danger-text">${state.recordingError}</p>` : ""}
      ${learning.attempts.pronunciation ? pronunciationResult(learning) : ""}
    </div>
  `;
}

function pronunciationResult(learning) {
  return `
    <div class="pronunciation-result ${learning.pronunciationPassed ? "passed" : "failed"}">
      <strong>${learning.pronunciationPassed ? "发音通过" : "发音需复习"}</strong>
      <span>总分 ${learning.pronunciationScore || 0} · 准确 ${learning.accuracyScore || 0} · 流畅 ${learning.fluencyScore || 0} · 完整 ${learning.completenessScore || 0}</span>
      ${learning.pronunciationReasons?.length ? `<small>${learning.pronunciationReasons.join(" / ")}</small>` : ""}
      ${learning.debugAudioUrl ? `
        <div class="debug-recording">
          <span>本次录音</span>
          <audio controls src="${learning.debugAudioUrl}"></audio>
          ${learning.debugAudioPath ? `<small>${learning.debugAudioPath}</small>` : ""}
        </div>
      ` : ""}
      <button class="primary" data-next-pronunciation-word>${state.currentWord === activeVocabulary().length - 1 ? "完成预热" : "下一个单词"}</button>
    </div>
  `;
}

function vocabTestPanel(task) {
  if (!task) {
    return `
      <div class="recall-box">
        <span class="label">测试完成</span>
        <h3>本轮单词测试已完成</h3>
        <p class="hint">你可以进入结果页查看单词诊断，或重新开始发音预热。</p>
        <div class="button-row">
          <button class="primary" data-nav="/lesson/${lesson.id}/result">查看诊断</button>
          <button class="secondary" data-reset-vocab-test>重新测试</button>
        </div>
      </div>
    `;
  }
  const word = wordById(task.wordId);
  const options = testOptions(word, task.type);
  const label = task.type === "audioToWord" ? "听音选日文" : "日文选中文";
  return `
    <div class="recall-box">
      <span class="label">${label}</span>
      <div class="word-count">${state.currentVocabTest + 1}/${state.vocabTestQueue.length}</div>
      <h3>${task.type === "audioToWord" ? "听音频，选择对应日文" : word.jp}</h3>
      ${task.type === "audioToWord" ? `<button class="secondary" data-speak="${word.jp}" data-audio="${audioUrl("word", word.id)}">播放题目音频</button>` : ""}
      ${state.vocabReveal && state.vocabReveal.wordId === word.id ? `
        <div class="vocab-reveal ${state.vocabReveal.correct ? "passed" : "failed"}">
          <strong>${word.jp}</strong>
          <span>${word.cn}</span>
          ${state.vocabReveal.correct ? "<small>回答正确，稍后进入下一题。</small>" : `<small>正确答案已显示，稍后进入下一题。${state.vocabReveal.selectedWordId ? ` 你的选择：${wordById(state.vocabReveal.selectedWordId)?.jp || ""}` : ""}</small>`}
        </div>
      ` : ""}
      <div class="choices compact">
        ${options.map((item) => {
          const selected = state.vocabReveal?.selectedWordId === item.id;
          const correctAnswer = state.vocabReveal && item.id === word.id;
          const revealed = Boolean(state.vocabReveal);
          const classes = ["choice"];
          if (revealed && correctAnswer) classes.push("correct");
          if (revealed && selected && !correctAnswer) classes.push("wrong");
          return `<button class="${classes.join(" ")}" data-word-quiz="${task.type}:${item.id}" ${revealed ? "disabled" : ""}>${task.type === "audioToWord" ? item.jp : item.cn}</button>`;
        }).join("")}
      </div>
      ${state.recallResult ? `<p class="hint">${state.recallResult}</p>` : ""}
    </div>
  `;
}

function testOptions(word, type) {
  const limited = currentVocabularyLimit() < lesson.vocabulary.length;
  const pool = limited
    ? activeVocabulary().filter((item) => item.id !== word.id)
    : [...externalWordDistractors, ...lesson.vocabulary.filter((item) => item.id !== word.id)];
  const candidates = pool
    .filter((item) => item.id !== word.id)
    .map((item) => ({ item, score: wordSimilarity(word, item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);
  return [word, ...candidates].sort((a, b) => stableOptionOrder(a.id) - stableOptionOrder(b.id));
}

function wordSimilarity(base, candidate) {
  let score = 0;
  if (base.kana[0] && base.kana[0] === candidate.kana[0]) score += 5;
  if (base.jp[0] && base.jp[0] === candidate.jp[0]) score += 4;
  score += Math.max(0, 5 - Math.abs(base.kana.length - candidate.kana.length));
  score += commonCharCount(base.kana, candidate.kana);
  score += commonCharCount(base.jp, candidate.jp);
  return score;
}

function commonCharCount(a, b) {
  return [...new Set([...a])].filter((char) => b.includes(char)).length;
}

function stableOptionOrder(id) {
  return [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 17;
}

function statusText(status) {
  return { familiar: "认识", unfamiliar: "不熟", unseen: "未看" }[status] || "未看";
}

function setCurrentWord(index, shouldSpeak = false) {
  const vocabWords = activeVocabulary();
  const nextIndex = clamp(index, 0, vocabWords.length - 1);
  if (index >= vocabWords.length) {
    startVocabTest();
    return;
  }
  state.currentWord = nextIndex;
  state.vocabPhase = "pronunciation";
  state.recallResult = "";
  state.recordingError = "";
  pendingAutoSpeakWordId = shouldSpeak ? vocabWords[nextIndex]?.id || "" : "";
  render();
}

function canLeaveCurrentWord() {
  const word = activeVocabulary()[state.currentWord];
  return wordLearningState(word.id).mainStatus !== "new";
}

function textPage() {
  const requested = new URLSearchParams(location.search).get("sentenceId");
  if (requested) {
    const index = lesson.sentences.findIndex((sentence) => sentence.id === requested);
    if (index >= 0) state.currentSentence = index;
    history.replaceState({}, "", lessonPath(`/lesson/${lesson.id}/text`));
  }
  const sentence = lesson.sentences[state.currentSentence];
  const sentenceReady = interactionDone("sentence", sentence.id);
  const weakSentences = weakInteractionItems().filter((item) => item.type === "sentence");
  return layout(`
    <div class="page-head">
      <div>
        <p class="eyebrow">${lesson.title} · 课文逐句学习</p>
        <h2>聚焦当前句子，右侧同步解释</h2>
      </div>
      <button class="primary" data-nav="/lesson/${lesson.id}/grammar">进入语法回顾</button>
    </div>
    <section class="text-layout">
      <div class="sentence-list">
        ${renderTextStructure()}
      </div>
      <aside class="panel detail-panel">
        <h2>${sentenceHoverContent(sentence)}</h2>
        <p class="hint"><span class="kbd">↑</span><span class="kbd">↓</span> 切换句子，定位后自动发音。${weakSentences.length ? `弱句 ${weakSentences.length} 个。` : ""}</p>
        ${shadowControls("sentence", sentence.id, sentence.text, audioUrl("sentence", sentence.id), { hint: "跟读当前句子后，解释面板会展开。" })}
        ${sentenceReady ? sentenceExplanation(sentence) : `<div class="locked-panel">完成跟读反馈后显示中文、单词和语法说明。</div>`}
        <div class="button-row">
          <button class="secondary" data-speak="${sentence.text}" data-audio="${audioUrl("sentence", sentence.id)}">播放发音</button>
          <button class="secondary" data-prev-sentence>上一句</button>
          <button class="primary" data-next-sentence ${sentenceReady ? "" : "disabled"}>下一句</button>
        </div>
      </aside>
    </section>
  `);
}

function sentenceExplanation(sentence) {
  return `
    <div class="meta-list">
      ${meta("课文位置", sentencePosition(sentence.id))}
      ${sentence.speaker ? meta("说话人", sentence.speaker) : ""}
      ${meta("假名", sentence.kana)}
      ${meta("中文翻译", sentence.translation)}
      <div class="meta-line">
        <span class="label">单词列表</span>
        <div class="tags">${sentence.words.map((id) => {
          const word = wordById(id);
          return `<button class="word-chip" data-word-modal="${id}">${word.jp} · ${word.cn}</button>`;
        }).join("") || "<span class='muted'>本句无重点单词</span>"}</div>
      </div>
      <div class="meta-line">
        <span class="label">相关语法</span>
        <div class="tags">${sentence.grammar.map((id) => grammarTag(id)).join("") || "<span class='muted'>本句无语法标签</span>"}</div>
      </div>
    </div>
  `;
}

function renderTextStructure() {
  return textStructure.map((section) => `
    <section class="text-section">
      <h3>${section.title}</h3>
      ${section.groups.map((group) => `
        <div class="text-group ${group.kind}">
          <div class="text-group-title">${group.title}</div>
          <div class="${group.kind === "statements" ? "statement-group" : "dialogue-group"}">
            ${group.ids.map((id) => {
              const sentence = sentenceById(id);
              const index = lesson.sentences.findIndex((item) => item.id === id);
              return sentence ? sentenceListItem(sentence, index, group) : "";
            }).join("")}
          </div>
        </div>
      `).join("")}
    </section>
  `).join("");
}

function sentenceListItem(item, index) {
  const current = index === state.currentSentence ? "current" : "";
  if (!item.speaker) {
    return `
      <button class="sentence statement ${current}" data-sentence-index="${index}">
        ${sentenceHoverContent(item)}
      </button>
    `;
  }

  return `
    <button class="sentence dialogue ${current}" data-sentence-index="${index}">
      <span class="speaker">${item.speaker}</span>
      <span class="bubble">
        ${sentenceHoverContent(item)}
      </span>
    </button>
  `;
}

function sentencePosition(sentenceId) {
  for (const section of textStructure) {
    for (const group of section.groups) {
      if (group.ids.includes(sentenceId)) return `${section.title} · ${group.title}`;
    }
  }
  return "课文";
}

function sentenceHoverContent(sentence, fallbackText = "") {
  const jp = sentence?.text || fallbackText;
  const cn = sentence?.translation || "暂无中文解释";
  return `
    <span class="hover-translation">
      <span class="translation-switch" title="悬浮查看中文" aria-label="悬浮查看中文">⇄</span>
      <span class="jp-text">${jp}</span>
      <span class="cn-text">${cn}</span>
    </span>
  `;
}

function meta(label, value) {
  return `<div class="meta-line"><span class="label">${label}</span><span>${value}</span></div>`;
}

function grammarTag(id) {
  const grammar = grammarById(id);
  return `<button class="tag" data-grammar-modal="${id}">${grammar.pattern}</button>`;
}

function grammarPage() {
  const grammar = lesson.grammar[state.currentGrammar];
  const grammarItems = lesson.grammar
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => isGrammarPattern(item));
  const expressionItems = lesson.grammar
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !isGrammarPattern(item));
  return layout(`
    <div class="page-head">
      <div>
        <p class="eyebrow">${lesson.title} · 语法回顾</p>
        <h2>语法点与例句回忆</h2>
        <p class="hint"><span class="kbd">↑</span><span class="kbd">↓</span> 切换上一个 / 下一个语法。先挖空回忆，再揭晓对照。</p>
      </div>
      <button class="primary" data-nav="/lesson/${lesson.id}/exercises">开始练习</button>
    </div>
    <section class="split">
      <nav class="list-nav">
        ${grammarNavGroup("语法", grammarItems)}
        <div class="nav-divider" aria-hidden="true"></div>
        ${grammarNavGroup("表达及词语讲解", expressionItems)}
      </nav>
      <article class="panel">
        ${grammarDetail(grammar)}
      </article>
    </section>
  `);
}

function isGrammarPattern(item) {
  return !item.pattern.startsWith("表达：") && !item.pattern.startsWith("词语：");
}

function grammarNavGroup(title, entries) {
  return `
    <div class="grammar-nav-group">
      <div class="grammar-nav-title">${title}</div>
      ${entries.map(({ item, index }, groupIndex) => `
        <button class="numbered-nav-item ${grammarNavProgress(item).statusClass} ${index === state.currentGrammar ? "active" : ""}" data-grammar-index="${index}">
          <span class="nav-number">${groupIndex + 1}</span>
          <span class="nav-content">
            <span class="nav-title">${item.pattern}</span>
            ${grammarNavStatus(item)}
          </span>
        </button>
      `).join("")}
    </div>
  `;
}

function grammarNavProgress(grammar) {
  const { items } = grammarPracticeItems(grammar);
  const total = items.length;
  if (!total) {
    return { statusClass: "empty", label: "暂无", progress: "0/0" };
  }
  const practices = items.map((item) => grammarPracticeState(grammar.id, item.id));
  const mastered = practices.filter((item) => grammarPracticeMastered(item)).length;
  const started = practices.filter((item) => item.submitted || item.pronunciationAttempts > 0).length;
  const statusClass = mastered === total
    ? "done"
    : started === 0
      ? "new"
      : mastered === 0
        ? "failed"
        : "learning";
  return { statusClass, label: mastered === total ? "已学完" : started === 0 ? "未学" : mastered === 0 ? "未通过" : "学习中", progress: `${mastered}/${total}` };
}

function grammarNavStatus(grammar) {
  const progress = grammarNavProgress(grammar);
  return `<span class="nav-meta"><span class="nav-status ${progress.statusClass}">${progress.label}</span><span class="nav-progress">${progress.progress}</span></span>`;
}

function grammarPracticeItems(grammar) {
  const coreItems = (grammar.examples || [])
    .map((id) => ({ kind: "core", id, sentence: sentenceById(id) }))
    .filter((item) => item.sentence);
  const hasCore = coreItems.length > 0;
  const supplementalSource = grammar.extraExamples || [];
  const fallbackCoreItems = hasCore ? [] : supplementalSource.slice(0, 1).map((example, index) => ({
    kind: "extra",
    id: `extra-${index}`,
    sentence: { id: `extra-${index}`, text: example.text, kana: "", translation: example.translation },
    example
  }));
  const supplementalExamples = supplementalSource.slice(hasCore ? 0 : 1).map((example, index) => ({
    id: `extra-${hasCore ? index : index + 1}`,
    text: example.text,
    translation: example.translation,
    sourceIndex: hasCore ? index : index + 1
  }));
  return {
    items: hasCore ? coreItems : fallbackCoreItems,
    supplementalExamples
  };
}

function grammarPracticeSummary(grammar) {
  const { items } = grammarPracticeItems(grammar);
  const completed = items.filter((item) => grammarPracticeMastered(grammarPracticeState(grammar.id, item.id))).length;
  return { completed, total: items.length };
}

function grammarExampleStatus(practice) {
  if (!practice.submitted) return "待练";
  if (practice.pronunciationAttempts === 0) return practice.correct ? "待跟读" : "已检查";
  if (practice.correct && practice.pronunciationPassed) return "已会";
  return "需复习";
}

function grammarPracticeMastered(practice) {
  return Boolean(practice.correct && practice.pronunciationPassed);
}

function grammarExampleTargetTone(sentence) {
  return sentence.translation || sentence.kana || "请补全上面的关键语法点。";
}

function renderGrammarCloze(grammar, sentence) {
  const { target, cloze } = grammarExampleCloze(grammar, sentence.text);
  return { target, cloze: target ? cloze : sentence.text };
}

function grammarDetail(grammar) {
  const relatedExercises = lesson.exercises
    .map((exercise, index) => ({ exercise, index }))
    .filter(({ exercise }) => exercise.relatedGrammar.includes(grammar.id));
  const { items: practiceItems, supplementalExamples } = grammarPracticeItems(grammar);
  const progress = grammarPracticeSummary(grammar);
  const supplementCount = grammar.extraExamples?.length || 0;
  return `
    <h2>${grammar.pattern}</h2>
    <div class="grammar-summary-grid">
      <div class="grammar-summary-item">
        <span>核心例句</span>
        <strong>${progress.completed}/${progress.total || 0}</strong>
      </div>
      <div class="grammar-summary-item">
        <span>补充例句</span>
        <strong>${supplementCount}</strong>
      </div>
      <div class="grammar-summary-item">
        <span>相关练习</span>
        <strong>${relatedExercises.length}</strong>
      </div>
    </div>
    <p class="muted grammar-progress">${progress.total ? `核心例句完成 ${progress.completed}/${progress.total}` : "当前语法点暂无核心例句"}</p>
    <div class="meta-list">
      ${meta("简要解释", grammar.meaning)}
      ${meta("结构", grammar.structure)}
      ${meta("当前课文中的用法", grammar.usage)}
      <div class="meta-line">
        <span class="label">核心例句回忆</span>
        <div class="stack">
          ${practiceItems.length ? practiceItems.map((item, index) => grammarExamplePracticeCard(grammar, item, index)).join("") : "<span class='muted'>暂无核心例句。</span>"}
        </div>
      </div>
      ${supplementalExamples.length ? `
        <div class="meta-line">
          <span class="label">教材补充例句（可选）</span>
          <div class="stack">
            ${supplementalExamples.map((example, index) => `
              <div class="supplemental-example-card supplemental-example">
                <div class="example-row">
                  <span class="sentence supplemental-preview">${sentenceHoverContent({ text: example.text, translation: example.translation })}</span>
                  <button class="icon-button" aria-label="播放补充例句" title="播放补充例句" data-speak="${example.text}" data-audio="${extraExampleAudioUrl(grammar.id, example.sourceIndex)}">🔊</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}
      <div class="meta-line">
        <span class="label">相关练习</span>
        <div class="related-exercise-list">
          ${relatedExercises.length ? relatedExercises.map(({ exercise, index }) => `
            <div class="related-exercise-row">
              <span class="related-exercise-no">${index + 1}</span>
              <span class="exercise-badge">${exercise.category}</span>
              <span class="related-exercise-title">${exercise.groupTitle} · ${exercise.question}</span>
              <button class="secondary compact-action" data-exercise-index="${index}">去练习</button>
            </div>
          `).join("") : "<span class='muted'>暂无相关练习。</span>"}
        </div>
      </div>
    </div>
  `;
}

function grammarExamplePracticeCard(grammar, item, index) {
  const sentence = item.sentence;
  const practice = grammarPracticeState(grammar.id, item.id);
  const { target, cloze } = renderGrammarCloze(grammar, sentence);
  const clozeText = target ? cloze : sentence.text;
  const ready = practice.submitted;
  const mastered = grammarPracticeMastered(practice);
  const judgementReady = ready && practice.pronunciationAttempts > 0;
  const statusClass = mastered ? "passed" : judgementReady ? "failed" : "pending";
  const targetText = target || sentence.text;
  const locationText = item.kind === "extra" ? "补充例句" : sentencePosition(sentence.id);
  const collapsed = Boolean(practice.collapsed);
  return `
    <article class="grammar-practice-card ${statusClass} ${collapsed ? "collapsed" : ""}">
      <div class="grammar-practice-head">
        <div class="grammar-practice-head-main">
          <span class="grammar-practice-no">${index + 1}</span>
          <div>
            <strong>${grammarExampleTargetTone(sentence)}</strong>
            <small>${locationText}</small>
          </div>
        </div>
        <div class="grammar-practice-head-actions">
          <span class="practice-status ${mastered ? "success" : ready && practice.pronunciationAttempts > 0 ? "danger" : ""}">${grammarExampleStatus(practice)}</span>
          <button class="ghost grammar-toggle-button" data-grammar-toggle-collapse="${grammarPracticeKey(grammar.id, item.id)}">${collapsed ? "展开" : "收起"}</button>
          <button class="ghost grammar-reset-button" data-grammar-reset="${grammarPracticeKey(grammar.id, item.id)}">重置</button>
        </div>
      </div>
      ${ready ? `
        <div class="grammar-answer-inline ${practice.correct ? "passed" : "failed"}">
          <div class="diff-line">填空结果：${practice.correct ? "正确" : "错误"}；标准答案：${escapeHtml(targetText)}</div>
        </div>
      ` : ""}
      <div class="grammar-practice-body ${collapsed ? "collapsed" : ""}">
        <div class="grammar-practice-cloze">${escapeHtml(clozeText)}</div>
        <div class="grammar-practice-form">
          <input class="answer-input" data-grammar-answer="${grammarPracticeKey(grammar.id, item.id)}" value="${escapeHtml(practice.answer || "")}" placeholder="补全空缺部分" />
          <button class="primary" data-grammar-check="${grammarPracticeKey(grammar.id, item.id)}">检查</button>
        </div>
        ${grammarPronunciationPanel(grammar, item)}
      ${judgementReady ? `
        <div class="grammar-practice-result ${mastered ? "passed" : "failed"}">
          <strong>${mastered ? "已会" : "需复习"}</strong>
          <span>${mastered ? "填空和跟读都已通过。" : practice.correct ? "填空已对，继续完成跟读。" : "先补全关键语法点，再进行跟读。"} </span>
        </div>
      ` : ""}
      </div>
    </article>
  `;
}

function grammarPronunciationPanel(grammar, item) {
  const sentence = item.sentence;
  const key = grammarPracticeKey(grammar.id, item.id);
  const practice = grammarPracticeState(grammar.id, item.id);
  const preparing = state.grammarRecordingPreparingId === key;
  const recording = state.grammarRecordingId === key;
  const stopping = state.grammarRecordingStoppingId === key;
  const recordLabel = stopping ? "正在评价" : recording ? "正在说话" : preparing ? "准备中" : "长按跟读";
  const recordHint = stopping
    ? "正在收尾录音，马上提交评价..."
    : recording
      ? "请继续按住按钮，说完后松手提交评价。"
      : preparing
        ? "正在准备麦克风，等按钮变为正在说话后再开口。"
        : "先听标准音，再长按录音按钮。按钮变成“正在说话”后再开口，松手自动停止并评价。";
  return `
    <div class="recall-box pronunciation-box grammar-pronunciation-box">
      <div class="grammar-pronunciation-head">
        <span class="label">开口或跟读</span>
      </div>
      <div class="button-row">
        <button class="secondary" data-speak="${sentence.text}" data-audio="${audioUrl("sentence", sentence.id)}">听标准音</button>
        <button
          class="hold-record-button ${preparing ? "preparing" : ""} ${recording ? "recording" : ""} ${stopping ? "stopping" : ""}"
          data-hold-record-grammar="${key}"
          aria-label="${recordLabel}"
          ${stopping ? "disabled" : ""}
        >
          <span class="record-icon"></span>
          <span>${recordLabel}</span>
        </button>
      </div>
      ${(state.grammarRecordingError && state.grammarRecordingErrorKey === key) ? `<p class="hint danger-text">${state.grammarRecordingError}</p>` : ""}
      ${practice.pronunciationAttempts ? grammarPronunciationResult(practice) : ""}
    </div>
  `;
}

function grammarPronunciationResult(practice) {
  const recordingText = practice.pronunciationDuration
    ? `录音 ${practice.pronunciationDuration.toFixed(1)} 秒，音量峰值 ${Number(practice.pronunciationPeak || 0).toFixed(2)}`
    : "";
  return `
    <div class="pronunciation-result ${practice.pronunciationPassed ? "passed" : "failed"}">
      <strong>${practice.pronunciationPassed ? "发音通过" : "发音需复习"}</strong>
      <span>总分 ${practice.pronunciationScore || 0} · 准确 ${practice.accuracyScore || 0} · 流畅 ${practice.fluencyScore || 0} · 完整 ${practice.completenessScore || 0}${recordingText ? ` · ${recordingText}` : ""}</span>
      ${practice.pronunciationReasons?.length ? `<small>${practice.pronunciationReasons.join(" / ")}</small>` : ""}
      ${practice.debugAudioUrl ? `
        <div class="debug-recording">
          <audio controls src="${practice.debugAudioUrl}"></audio>
        </div>
      ` : ""}
      ${practice.recognizedText ? `
        <div class="diff-box">
          <div><span class="diff-label">你说的是</span><p class="diff-line">${escapeHtml(practice.recognizedText)}</p></div>
        </div>
      ` : ""}
    </div>
  `;
}

function handleGrammarPracticeInput(key, value) {
  const current = state.grammarPractice[key] || defaultGrammarPractice();
  state.grammarPractice = { ...state.grammarPractice, [key]: { ...current, answer: value, revealed: false } };
  writeGrammarPractice();
}

function handleGrammarPracticeCheck(key) {
  const [grammarId, exampleId] = key.split(":");
  const grammar = grammarById(grammarId);
  if (!grammar) return;
  const item = grammarPracticeItemByKey(grammar, exampleId);
  if (!item) return;
  const practice = grammarPracticeState(grammarId, exampleId);
  const target = grammarPracticeTargetText(grammar, item);
  const correct = normalizeForDiff(practice.answer || "") === normalizeForDiff(target || "");
  updateGrammarPractice(grammarId, exampleId, {
    submitted: true,
    correct,
    attempts: (practice.attempts || 0) + 1,
    revealed: true,
    updatedAt: new Date().toISOString()
  });
  recordInteraction("grammarExample", key, correct ? "smooth" : "retry");
  render();
}

function handleGrammarPracticeReset(key) {
  const [grammarId, exampleId] = key.split(":");
  resetGrammarPractice(grammarId, exampleId);
  render();
}

function toggleGrammarPracticeCollapse(key) {
  const [grammarId, exampleId] = key.split(":");
  const practice = grammarPracticeState(grammarId, exampleId);
  updateGrammarPractice(grammarId, exampleId, { collapsed: !practice.collapsed });
  render();
}

function grammarPracticeItemByKey(grammar, exampleId) {
  const core = (grammar.examples || []).find((id) => id === exampleId);
  if (core) {
    const sentence = sentenceById(core);
    if (sentence) return { kind: "core", id: core, sentence };
  }
  const extraIndex = Number(String(exampleId).replace(/^extra-/, ""));
  const extra = (grammar.extraExamples || [])[extraIndex];
  if (extra) {
    return { kind: "extra", id: exampleId, sentence: { id: exampleId, text: extra.text, kana: "", translation: extra.translation } };
  }
  return null;
}

function grammarPracticeTargetText(grammar, item) {
  if (!item?.sentence?.text) return "";
  const { target } = grammarExampleCloze(grammar, item.sentence.text);
  return target || item.sentence.text;
}

function audioManagePage() {
  const selectedVoice = audioVoices.find((voice) => voice.id === state.currentVoiceId) || audioVoices[0];
  const items = state.audioStatus?.items || [];
  const generated = items.filter((item) => item.exists).length;
  const missing = Math.max(0, items.length - generated);
  return layout(`
    <div class="page-head">
      <div>
        <p class="eyebrow">${lesson.title} · 音频管理</p>
        <h2>按声音版本管理本地 MP3</h2>
        <p class="hint">当前声音：${selectedVoice.no} · ${selectedVoice.id} · ${selectedVoice.name}</p>
      </div>
      <div class="button-row">
        <button class="secondary" data-preview-voice="${selectedVoice.id}" ${state.audioBusy ? "disabled" : ""}>试听示例</button>
        <button class="primary" data-generate-audio="all" ${state.audioBusy || !missing ? "disabled" : ""}>一键生成缺失 ${missing}</button>
      </div>
    </div>
    <section class="audio-layout">
      <aside class="panel audio-voice-panel">
        <h3>声音版本</h3>
        <div class="voice-list">
          ${audioVoices.map((voice) => `
            <div class="voice-option ${voice.id === state.currentVoiceId ? "active" : ""}" data-voice-id="${voice.id}">
              <button class="voice-main" data-voice-id="${voice.id}">
                <span>${voice.no}</span>
                <strong>${voice.id}</strong>
                <small>${voice.name}</small>
              </button>
              <button class="set-default-voice" data-set-default-voice="${voice.id}" ${state.audioBusy ? "disabled" : ""}>设为默认</button>
            </div>
          `).join("")}
        </div>
      </aside>
      <article class="panel audio-assets-panel">
        <div class="audio-summary">
          <div><span>已生成</span><strong>${generated}</strong></div>
          <div><span>缺失</span><strong>${missing}</strong></div>
          <div><span>总计</span><strong>${items.length || "..."}</strong></div>
        </div>
        ${state.audioMessage ? `<p class="hint">${state.audioMessage}</p>` : ""}
        ${state.audioBusy ? `<div class="locked-panel">${state.audioBusy}</div>` : ""}
        <div class="audio-item-list">
          ${items.length ? items.map((item) => audioAssetRow(item)).join("") : "<span class='muted'>正在读取音频状态...</span>"}
        </div>
      </article>
    </section>
  `);
}

function audioAssetRow(item) {
  const label = item.type === "word" ? "单词" : "句子";
  const audio = item.exists ? item.url : managedAudioUrl(state.currentVoiceId, item.type, item.id);
  return `
    <div class="audio-asset-row ${item.exists ? "ready" : "missing"}" ${item.exists ? `data-speak="${escapeHtml(item.text)}" data-audio="${audio}"` : ""}>
      <span class="audio-type">${label}</span>
      <span class="audio-title">${item.label}</span>
      <span class="audio-state">${item.exists ? "已生成" : "未生成"}</span>
      <button class="secondary compact-action" ${item.exists ? "" : "disabled"}>播放</button>
      <button class="secondary compact-action" data-generate-audio="${item.type}:${item.id}" ${item.exists || state.audioBusy ? "disabled" : ""}>生成</button>
    </div>
  `;
}

function exercisesPage() {
  const exercise = lesson.exercises[state.currentExercise];
  const result = state.submitted ? buildFeedback(exercise, state.answer) : null;
  const groupItems = lesson.exercises.filter((item) => item.groupId === exercise.groupId);
  const groupIndex = groupItems.findIndex((item) => item.id === exercise.id);
  return layout(`
    <section class="exercise-box">
      <div class="page-head">
        <div>
          <p class="eyebrow">${lesson.title} · 标准练习题</p>
          <h2>${exercise.groupTitle}</h2>
          <p>${exercise.category} · 小题 ${groupIndex + 1} / ${groupItems.length}</p>
        </div>
        <button class="secondary" data-nav="/lesson/${lesson.id}/result">查看结果</button>
      </div>
      <article class="panel">
        <div class="exercise-context">
          <span class="exercise-badge">${exercise.category}</span>
          <div class="meta-line">
            <span class="label">要求</span>
            <span>${exercise.instruction}</span>
          </div>
          ${exercise.example ? `<div class="meta-line"><span class="label">例</span><span>${exercise.example}</span></div>` : ""}
          ${exercise.audioRequired ? `
            <div class="audio-placeholder">
              <button class="secondary" disabled>录音暂无</button>
              <span class="muted">本题保留教材录音入口；当前未提供录音，暂不判分。</span>
            </div>
          ` : ""}
        </div>
        <p class="label">原题</p>
        <div class="question">${exercise.question}</div>
        ${answerControl(exercise)}
        <div class="button-row" style="margin-top:16px">
          <button class="primary" data-submit-answer ${state.submitted ? "disabled" : ""}>${exercise.audioRequired ? "记录并继续" : "提交"}</button>
        </div>
      </article>
      ${result ? feedbackView(exercise, result) : ""}
    </section>
  `);
}

function exerciseType(type) {
  return { fill: "填空题", choice: "选择题", translation: "翻译题", sentence_making: "造句题", listening: "听力题" }[type];
}

function answerControl(exercise) {
  if (exercise.audioRequired) {
    return `<div class="answer-input muted">等待录音材料后补充作答。</div>`;
  }
  if (exercise.type === "choice") {
    return `<div class="choices">${exercise.choices.map((choice) => `
      <button class="choice ${state.answer === choice ? "selected" : ""}" data-choice="${choice}">${choice}</button>
    `).join("")}</div>`;
  }
  if (exercise.type === "sentence_making") {
    return `<textarea class="answer-input" data-answer placeholder="输入你的造句">${state.answer}</textarea>`;
  }
  return `<input class="answer-input" data-answer value="${state.answer}" placeholder="输入答案" />`;
}

function buildFeedback(exercise, answer) {
  if (exercise.audioRequired || exercise.hasAnswer === false) {
    return {
      exerciseId: exercise.id,
      userAnswer: "",
      isCorrect: true,
      isSkipped: true,
      relatedGrammar: exercise.relatedGrammar,
      relatedSentences: exercise.relatedSentences,
      createdAt: new Date().toISOString()
    };
  }
  const correct = isCorrect(exercise, answer);
  return {
    exerciseId: exercise.id,
    userAnswer: answer,
    isCorrect: correct,
    relatedGrammar: exercise.relatedGrammar,
    relatedSentences: exercise.relatedSentences,
    createdAt: new Date().toISOString()
  };
}

function feedbackView(exercise, result) {
  if (result.isSkipped) {
    return `
      <article class="panel feedback">
        <h3>录音题暂不判分</h3>
        ${meta("题目", exercise.question)}
        ${meta("说明", exercise.explanation)}
        <div class="button-row">
          <button class="primary" data-next-exercise>${state.currentExercise === lesson.exercises.length - 1 ? "进入结果页" : "下一题"}</button>
        </div>
      </article>
    `;
  }
  const correctText = exercise.referenceAnswers?.join(" / ") || exercise.answer;
  const diff = answerDiff(result.userAnswer || "", exercise.answer);
  return `
    <article class="panel feedback ${result.isCorrect ? "passed" : "wrong"}">
      <div class="feedback-verdict">
        <strong>${result.isCorrect ? "通过" : "不通过"}</strong>
        <span>${result.isCorrect ? "答案与正确答案一致" : "答案与正确答案不一致"}</span>
      </div>
      ${meta("你的答案", result.userAnswer || "未作答")}
      ${meta(exercise.type === "sentence_making" ? "参考答案" : "正确答案", correctText)}
      <div class="meta-line">
        <span class="label">差异对比</span>
        ${result.isCorrect ? "<span>答案与参考要求一致。</span>" : `
          <div class="diff-box">
            <div><span class="diff-label">你的答案</span><p class="diff-line">${diff.user}</p></div>
            <div><span class="diff-label">正确答案</span><p class="diff-line">${diff.correct}</p></div>
          </div>
        `}
      </div>
      ${meta("错误说明", exercise.explanation)}
      <div class="meta-line">
        <span class="label">相关语法</span>
        <div class="tags">${exercise.relatedGrammar.map((id) => grammarTag(id)).join("")}</div>
      </div>
      <div class="meta-line">
        <span class="label">相关课文</span>
        <div class="tags">${exercise.relatedSentences.map((id) => {
          const sentence = sentenceById(id);
          return `<button class="tag" data-nav="/lesson/${lesson.id}/text?sentenceId=${id}">第 ${sentence.order} 句</button>`;
        }).join("")}</div>
      </div>
      <div class="button-row">
        <button class="primary" data-next-exercise>${state.currentExercise === lesson.exercises.length - 1 ? "进入结果页" : "下一题"}</button>
      </div>
    </article>
  `;
}

function answerDiff(userValue, correctValue) {
  const user = [...normalizeForDiff(userValue)];
  const correct = [...normalizeForDiff(correctValue)];
  const dp = Array.from({ length: user.length + 1 }, () => Array(correct.length + 1).fill(0));

  for (let i = user.length - 1; i >= 0; i -= 1) {
    for (let j = correct.length - 1; j >= 0; j -= 1) {
      dp[i][j] = user[i] === correct[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  let i = 0;
  let j = 0;
  let userHtml = "";
  let correctHtml = "";

  while (i < user.length || j < correct.length) {
    if (i < user.length && j < correct.length && user[i] === correct[j]) {
      const same = escapeHtml(user[i]);
      userHtml += same;
      correctHtml += same;
      i += 1;
      j += 1;
    } else if (j < correct.length && (i === user.length || dp[i][j + 1] >= dp[i + 1]?.[j])) {
      correctHtml += `<mark class="diff-missing">${escapeHtml(correct[j])}</mark>`;
      j += 1;
    } else if (i < user.length) {
      userHtml += `<mark class="diff-wrong">${escapeHtml(user[i])}</mark>`;
      i += 1;
    }
  }

  return {
    user: userHtml || "<span class=\"muted\">未作答</span>",
    correct: correctHtml
  };
}

function normalizeForDiff(value) {
  return String(value).trim().replace(/\s+/g, "");
}

function resultPage() {
  const validResults = state.exerciseResults.filter((item) => lesson.exercises.some((exercise) => exercise.id === item.exerciseId));
  const scored = validResults.filter((item) => !item.isSkipped);
  const wrong = scored.filter((item) => !item.isCorrect);
  const wordDiagnostics = activeVocabulary()
    .map((word) => ({ word, learning: wordLearningState(word.id) }))
    .filter(({ learning }) => learning.mainStatus !== "mastered");
  const weakGrammar = [...new Set(wrong.flatMap((item) => item.relatedGrammar))].map(grammarById);
  const weakInput = weakInteractionItems();
  return layout(`
    <div class="page-head">
      <div>
        <p class="eyebrow">${lesson.title} · 结果页 / 错误回溯</p>
        <h2>本课学习表现</h2>
      </div>
      <button class="primary" data-nav="/lesson/${lesson.id}/vocab">重新学习</button>
    </div>
    <section class="result-grid">
      <article class="panel metric"><span class="muted">完成题数</span><strong>${validResults.length}</strong></article>
      <article class="panel metric"><span class="muted">正确题数</span><strong>${scored.filter((item) => item.isCorrect).length}</strong></article>
      <article class="panel metric"><span class="muted">错题数</span><strong>${wrong.length}</strong></article>
    </section>
    <section class="split">
      <div class="stack">
        <article class="panel">
          <h3>单词诊断</h3>
          <div class="stack">${wordDiagnostics.length ? wordDiagnostics.slice(0, 12).map(({ word, learning }) => `
            <div class="weak-item">
              <span>${wordMainStatusText(learning.mainStatus)}</span>
              <strong>${word.jp} · ${word.cn}</strong>
              <small>${learning.diagnosticTags.join(" / ") || "能力项尚未完成"}</small>
              <button class="ghost" data-weak-jump="word:${word.id}">复习这个词</button>
            </div>
          `).join("") : "<span class='muted'>暂无</span>"}</div>
        </article>
        <article class="panel">
          <h3>易错语法点</h3>
          <div class="tags">${weakGrammar.length ? weakGrammar.map((grammar) => `<button class="tag" data-grammar-modal="${grammar.id}">${grammar.pattern}</button>`).join("") : "<span class='muted'>暂无</span>"}</div>
        </article>
        <article class="panel">
          <h3>互动输入弱项</h3>
          <div class="stack">${weakInput.length ? weakInput.slice(0, 8).map((item) => `
            <div class="weak-item">
              <span>${weakTypeText(item.type)}</span>
              <strong>${item.label}</strong>
              <small>${pronunciationText(item.pronunciationState)} · 重试 ${item.retryCount} 次</small>
              <button class="ghost" data-weak-jump="${item.type}:${item.id}">强化回顾</button>
            </div>
          `).join("") : "<span class='muted'>暂无</span>"}</div>
        </article>
      </div>
      <article class="panel">
        <h3>错题列表</h3>
        <div class="stack">
          ${wrong.length ? wrong.map((item) => wrongItem(item)).join("") : "<p class='muted'>还没有错题。完成练习后这里会展示错误回溯入口。</p>"}
        </div>
      </article>
    </section>
  `);
}

function wrongItem(item) {
  const exercise = lesson.exercises.find((entry) => entry.id === item.exerciseId);
  return `
    <div class="card panel">
      <p class="label">${exercise.groupTitle} · ${exercise.category}</p>
      <h3>${exercise.question}</h3>
      ${meta("你的答案", item.userAnswer || "未作答")}
      ${meta("正确答案 / 参考答案", exercise.referenceAnswers?.join(" / ") || exercise.answer)}
      <div class="tags">${exercise.relatedGrammar.map((id) => grammarTag(id)).join("")}</div>
      <div class="button-row" style="margin-top:12px">
        <button class="secondary" data-wrong-detail="${exercise.id}">查看详情</button>
        ${exercise.relatedSentences.map((id) => `<button class="ghost" data-nav="/lesson/${lesson.id}/text?sentenceId=${id}">回到课文</button>`).join("")}
      </div>
    </div>
  `;
}

function weakTypeText(type) {
  return { word: "弱词", sentence: "弱句", grammarExample: "语法例句" }[type] || "弱项";
}

function modal(data) {
  if (data.type === "word") {
    const word = wordById(data.id);
    return `
      <div class="dialog-backdrop" data-close-modal>
        <article class="panel dialog" data-dialog>
          <h2>${word.jp}</h2>
          ${meta("假名", word.kana)}
          ${meta("中文释义", word.cn)}
          ${meta("当前状态", statusText(state.wordProgress[word.id]))}
          <div class="button-row"><button class="primary" data-speak="${word.jp}" data-audio="${audioUrl("word", word.id)}">播放发音</button><button class="secondary" data-close-modal>关闭</button></div>
        </article>
      </div>
    `;
  }
  if (data.type === "wrong") {
    const exercise = lesson.exercises.find((item) => item.id === data.id);
    const result = state.exerciseResults.find((item) => item.exerciseId === data.id);
    return `<div class="dialog-backdrop" data-close-modal><article class="panel dialog" data-dialog>${feedbackView(exercise, result)}<button class="secondary" data-close-modal>关闭</button></article></div>`;
  }
  if (data.type === "audioCorrection") {
    return `
      <div class="dialog-backdrop" data-close-modal>
        <article class="panel dialog" data-dialog>
          <h2>${data.title}</h2>
          <p class="muted">静态页面不能安全保存 API key。请在终端执行下面命令重生成该单词 mp3，然后刷新页面；已自动刷新该音频的缓存版本。</p>
          <pre class="command-box">${data.command}</pre>
          <div class="button-row">
            <button class="secondary" data-close-modal>关闭</button>
          </div>
        </article>
      </div>
    `;
  }
  const grammar = grammarById(data.id);
  return `<div class="dialog-backdrop" data-close-modal><article class="panel dialog" data-dialog>${grammarDetail(grammar)}<button class="secondary" data-close-modal>关闭</button></article></div>`;
}

function commitResult() {
  const exercise = lesson.exercises[state.currentExercise];
  const result = buildFeedback(exercise, state.answer);
  state.exerciseResults = state.exerciseResults.filter((item) => item.exerciseId !== exercise.id);
  state.exerciseResults.push(result);
  write(`lesson:${lesson.id}:exerciseResults`, state.exerciseResults);
  state.submitted = true;
  render();
}

function handleShadowAction(type, id, action, text = "", audio = "") {
  recordInteraction(type, id, action);

  if (type === "word") {
    const word = wordById(id);
    if (action === "smooth") {
      state.vocabPhase = "recall";
      state.recallResult = "";
      render();
      return;
    }
    if (action === "retry") {
      state.wordProgress[id] = "unfamiliar";
      write(`lesson:${lesson.id}:wordProgress`, state.wordProgress);
      playAudio(text || word.jp, audio || audioUrl("word", id));
      render();
      return;
    }
    if (action === "skipped") {
      state.wordProgress[id] = "unfamiliar";
      write(`lesson:${lesson.id}:wordProgress`, state.wordProgress);
      setCurrentWord(state.currentWord + 1, true);
      return;
    }
  }

  if (action === "retry") {
    playAudio(text, audio);
  }
  render();
}

function handleRecall(selectedWordId) {
  handleWordQuiz("wordToMeaning", selectedWordId);
}

function handleWordQuiz(mode, selectedWordId) {
  const task = state.vocabPhase === "test" ? currentVocabTestTask() : null;
  const word = task ? wordById(task.wordId) : activeVocabulary()[state.currentWord];
  const learning = wordLearningState(word.id);
  const correct = selectedWordId === word.id;
  const attempts = { ...learning.attempts };
  attempts[mode] = (attempts[mode] || 0) + 1;
  updateWordLearning(word.id, {
    [`${mode}Correct`]: correct,
    attempts
  });
  if (!correct) {
    state.recallResult = "不正确。系统已记录该弱项，稍后会进入复习。";
    if (state.vocabPhase === "test") {
      revealAndAdvanceTest(word, selectedWordId, false, mode);
    }
    render();
    return;
  }
  if (state.vocabPhase === "test") {
    revealAndAdvanceTest(word, selectedWordId, true, mode);
    return;
  }
  state.recallResult = "正确。进入下一个单词。";
  setCurrentWord(state.currentWord + 1, true);
}

function revealAndAdvanceTest(word, selectedWordId, correct, mode) {
  if (vocabTestAdvanceTimer) window.clearTimeout(vocabTestAdvanceTimer);
  state.vocabReveal = { wordId: word.id, selectedWordId, correct };
  state.recallResult = correct ? "正确。" : "不正确。系统已记录该弱项，稍后会进入复习。";
  render();
  const delayMs = 2500;
  const audioMustEnd = mode === "wordToMeaning";
  let audioEnded = !audioMustEnd;
  const startedAt = Date.now();
  let settled = false;
  const advanceOnce = () => {
    if (settled) return;
    settled = true;
    if (vocabTestAdvanceTimer) window.clearTimeout(vocabTestAdvanceTimer);
    vocabTestAdvanceTimer = null;
    if (state.vocabPhase !== "test") return;
    if (state.vocabReveal?.wordId !== word.id) return;
    state.vocabReveal = null;
    advanceVocabTest();
  };
  const maybeAdvance = () => {
    if (settled) return;
    if (Date.now() - startedAt < delayMs) return;
    if (audioMustEnd && !audioEnded) return;
    advanceOnce();
  };
  vocabTestAdvanceTimer = window.setTimeout(maybeAdvance, delayMs);
  if (mode === "wordToMeaning") {
    playAudio(word.jp, audioUrl("word", word.id), () => {
      audioEnded = true;
      maybeAdvance();
    });
  }
}

function advanceVocabTest() {
  state.currentVocabTest += 1;
  write(`lesson:${lesson.id}:currentVocabTest`, state.currentVocabTest);
  window.setTimeout(() => {
    state.recallResult = "";
    render();
    const task = currentVocabTestTask();
    if (task?.type === "audioToWord") {
      const word = wordById(task.wordId);
      window.setTimeout(() => playAudio(word.jp, audioUrl("word", word.id)), 80);
    }
  }, 80);
}

async function startWordRecording(wordId) {
  const word = wordById(wordId);
  if (!word || recordingSession || state.recordingStoppingWordId) return;
  recordingPressWordId = wordId;
  recordingReleaseRequested = false;
  recordingPointerId = null;
  state.recordingPreparingWordId = wordId;
  state.recordingError = "";
  render();
  try {
    stopCurrentAudio();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext({ sampleRate: 16000 });
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    const chunks = [];
    const startedAt = Date.now();
    processor.onaudioprocess = (event) => {
      chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
    };
    source.connect(processor);
    processor.connect(audioContext.destination);
    recordingSession = { stream, audioContext, source, processor, chunks, wordId, startedAt, sampleRate: audioContext.sampleRate, ready: false };
    await delay(250);
    if (!recordingSession || recordingSession.wordId !== wordId) return;
    if (recordingReleaseRequested) {
      cleanupRecordingSession(recordingSession);
      recordingSession = null;
      recordingPressWordId = "";
      recordingReleaseRequested = false;
      recordingPointerId = null;
      state.recordingPreparingWordId = "";
      state.recordingWordId = "";
      state.recordingError = "录音尚未准备好，请长按到按钮变为“正在说话”后再开口。";
      render();
      return;
    }
    recordingSession.ready = true;
    state.recordingPreparingWordId = "";
    state.recordingWordId = wordId;
    state.recordingStoppingWordId = "";
    state.recordingError = "";
    render();
  } catch (error) {
    state.recordingPreparingWordId = "";
    cleanupRecordingSession(recordingSession);
    recordingSession = null;
    recordingPressWordId = "";
    recordingReleaseRequested = false;
    recordingPointerId = null;
    state.recordingError = `无法录音：${error.message || error}`;
    render();
  }
}

async function stopWordRecording(wordId) {
  if (!recordingSession || recordingSession.wordId !== wordId) return;
  const session = recordingSession;
  if (session.stopping) return;
  if (!session.ready) {
    cleanupRecordingSession(session);
    recordingSession = null;
    recordingPressWordId = "";
    recordingReleaseRequested = false;
    recordingPointerId = null;
    state.recordingPreparingWordId = "";
    state.recordingWordId = "";
    state.recordingStoppingWordId = "";
    state.recordingError = "录音尚未准备好，请长按到按钮变为“正在说话”后再开口。";
    render();
    return;
  }
  session.stopping = true;
  state.recordingPreparingWordId = "";
  state.recordingStoppingWordId = wordId;
  state.recordingError = "";
  render();
  await delay(800);
  if (recordingSession !== session) return;
  recordingSession = null;
  session.processor.disconnect();
  session.source.disconnect();
  session.stream.getTracks().forEach((track) => track.stop());
  await session.audioContext.close();
  state.recordingWordId = "";
  state.recordingStoppingWordId = "";
  state.recordingError = "正在提交发音评价...";
  render();
  const word = wordById(wordId);
  const stats = audioStats(session.chunks, session.sampleRate);
  if (stats.duration < 0.25 || stats.peak < 0.01) {
    state.recordingError = `录音音量过低或时长太短：${stats.duration.toFixed(1)} 秒，峰值 ${stats.peak.toFixed(3)}。请靠近麦克风重试。`;
    recordingPressWordId = "";
    recordingReleaseRequested = false;
    recordingPointerId = null;
    render();
    return;
  }
  const wav = encodeWav(session.chunks, session.sampleRate);
  const form = new FormData();
  form.append("wordId", word.id);
  form.append("referenceText", word.jp);
  form.append("kana", word.kana);
  form.append("audio", new Blob([wav], { type: "audio/wav" }), `${word.id}.wav`);
  try {
    const currentWordIndex = state.currentWord;
    const currentWordId = word.id;
    const response = await fetch("/api/pronunciation/evaluate", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || "发音评价失败");
    const previous = wordLearningState(word.id);
    updateWordLearning(word.id, {
      pronunciationPassed: data.passed,
      pronunciationScore: data.pronunciationScore,
      accuracyScore: data.accuracyScore,
      fluencyScore: data.fluencyScore,
      completenessScore: data.completenessScore,
      pronunciationReasons: [...(data.reasons || []), `录音 ${stats.duration.toFixed(1)} 秒，音量峰值 ${stats.peak.toFixed(2)}`],
      recognizedText: data.recognizedText || "",
      debugAudioUrl: data.debugAudioUrl || "",
      debugAudioPath: data.debugAudioPath || "",
      attempts: { ...previous.attempts, pronunciation: (previous.attempts.pronunciation || 0) + 1 }
    });
    state.recordingError = "";
    recordingPressWordId = "";
    recordingReleaseRequested = false;
    recordingPointerId = null;
    render();
    if (data.passed) {
      window.setTimeout(() => {
        if (route().page !== "vocab") return;
        if (state.vocabPhase !== "pronunciation") return;
        if (state.recordingWordId || state.recordingPreparingWordId || state.recordingStoppingWordId) return;
        if (state.currentWord !== currentWordIndex) return;
        if (activeVocabulary()[state.currentWord]?.id !== currentWordId) return;
        setCurrentWord(state.currentWord + 1, true);
      }, 350);
    }
  } catch (error) {
    const previous = wordLearningState(word.id);
    updateWordLearning(word.id, {
      pronunciationPassed: false,
      pronunciationReasons: [String(error.message || error)],
      debugAudioUrl: "",
      debugAudioPath: "",
      attempts: { ...previous.attempts, pronunciation: (previous.attempts.pronunciation || 0) + 1 }
    });
    state.recordingError = String(error.message || error);
    recordingPressWordId = "";
    recordingReleaseRequested = false;
    recordingPointerId = null;
    render();
  }
}

function releaseWordRecording(wordId) {
  if (!wordId || state.recordingStoppingWordId) return;
  recordingReleaseRequested = true;
  if (recordingSession?.wordId === wordId) {
    stopWordRecording(wordId);
  }
}

function holdWordRecording(button, wordId, event) {
  if (!wordId || recordingSession || state.recordingStoppingWordId) return;
  if (event?.pointerId != null) recordingPointerId = event.pointerId;
  if (event?.currentTarget?.setPointerCapture && event?.pointerId != null) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Ignore capture failures; document/window listeners remain as fallback.
    }
  }
  startWordRecording(wordId);
}

function endWordRecording(wordId, event) {
  if (!wordId) return;
  if (recordingPointerId != null && event?.pointerId != null && event.pointerId !== recordingPointerId) return;
  if (event?.currentTarget?.releasePointerCapture && event?.pointerId != null) {
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore capture release failures.
    }
  }
  releaseWordRecording(wordId);
}

function releaseGrammarRecording(key) {
  if (!key || state.grammarRecordingStoppingId) return;
  recordingReleaseRequested = true;
  if (recordingSession?.kind === "grammar" && recordingSession?.key === key) {
    stopGrammarRecording(key);
  }
}

async function startGrammarRecording(key) {
  if (!key || recordingSession || state.grammarRecordingStoppingId) return;
  const [grammarId, exampleId] = key.split(":");
  const grammar = grammarById(grammarId);
  if (!grammar) return;
  const item = grammarPracticeItemByKey(grammar, exampleId);
  if (!item?.sentence?.text) return;
  state.grammarRecordingPreparingId = key;
  state.grammarRecordingError = "";
  recordingPressWordId = "";
  recordingReleaseRequested = false;
  recordingPointerId = null;
  render();
  try {
    stopCurrentAudio();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext({ sampleRate: 16000 });
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    const chunks = [];
    processor.onaudioprocess = (event) => {
      chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
    };
    source.connect(processor);
    processor.connect(audioContext.destination);
    recordingSession = {
      kind: "grammar",
      key,
      stream,
      audioContext,
      source,
      processor,
      chunks,
      referenceText: item.sentence.text,
      label: item.sentence.text,
      startedAt: Date.now(),
      sampleRate: audioContext.sampleRate,
      ready: false
    };
    await delay(250);
    if (!recordingSession || recordingSession.key !== key) return;
    if (recordingReleaseRequested) {
      cleanupRecordingSession(recordingSession);
      recordingSession = null;
      recordingReleaseRequested = false;
      recordingPointerId = null;
      state.grammarRecordingPreparingId = "";
      state.grammarRecordingId = "";
      state.grammarRecordingErrorKey = key;
      state.grammarRecordingError = "录音尚未准备好，请长按到按钮变为“正在说话”后再开口。";
      render();
      return;
    }
    recordingSession.ready = true;
    state.grammarRecordingPreparingId = "";
    state.grammarRecordingId = key;
    state.grammarRecordingStoppingId = "";
    state.grammarRecordingError = "";
    render();
  } catch (error) {
    state.grammarRecordingPreparingId = "";
    cleanupRecordingSession(recordingSession);
    recordingSession = null;
    recordingReleaseRequested = false;
    recordingPointerId = null;
    state.grammarRecordingErrorKey = key;
    state.grammarRecordingError = `无法录音：${error.message || error}`;
    render();
  }
}

async function stopGrammarRecording(key) {
  if (!recordingSession || recordingSession.key !== key) return;
  const session = recordingSession;
  if (session.stopping) return;
  if (!session.ready) {
    cleanupRecordingSession(session);
    recordingSession = null;
    recordingReleaseRequested = false;
    recordingPointerId = null;
    state.grammarRecordingPreparingId = "";
    state.grammarRecordingId = "";
    state.grammarRecordingStoppingId = "";
    state.grammarRecordingErrorKey = key;
    state.grammarRecordingError = "录音尚未准备好，请长按到按钮变为“正在说话”后再开口。";
    render();
    return;
  }
  session.stopping = true;
  state.grammarRecordingPreparingId = "";
  state.grammarRecordingStoppingId = key;
  state.grammarRecordingErrorKey = key;
  state.grammarRecordingError = "";
  render();
  await delay(800);
  if (recordingSession !== session) return;
  recordingSession = null;
  session.processor.disconnect();
  session.source.disconnect();
  session.stream.getTracks().forEach((track) => track.stop());
  await session.audioContext.close();
  state.grammarRecordingId = "";
  state.grammarRecordingStoppingId = "";
  state.grammarRecordingErrorKey = key;
  state.grammarRecordingError = "正在提交发音评价...";
  render();
  const [grammarId, exampleId] = key.split(":");
  const grammar = grammarById(grammarId);
  const item = grammarPracticeItemByKey(grammar, exampleId);
  if (!grammar || !item?.sentence?.text) {
    state.grammarRecordingError = "未找到对应语法例句。";
    render();
    return;
  }
  const stats = audioStats(session.chunks, session.sampleRate);
  if (stats.duration < 0.25 || stats.peak < 0.01) {
    state.grammarRecordingError = `录音音量过低或时长太短：${stats.duration.toFixed(1)} 秒，峰值 ${stats.peak.toFixed(3)}。请靠近麦克风重试。`;
    recordingReleaseRequested = false;
    recordingPointerId = null;
    render();
    return;
  }
  const wav = encodeWav(session.chunks, session.sampleRate);
  const form = new FormData();
  form.append("wordId", `grammar:${grammar.id}:${item.id}`);
  form.append("referenceText", item.sentence.text);
  form.append("kana", item.sentence.kana || "");
  form.append("audio", new Blob([wav], { type: "audio/wav" }), `${grammar.id}-${item.id}.wav`);
  try {
    const response = await fetch("/api/pronunciation/evaluate", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || "发音评价失败");
    updateGrammarPractice(grammar.id, item.id, {
      pronunciationPassed: data.passed,
      pronunciationScore: data.pronunciationScore,
      accuracyScore: data.accuracyScore,
      fluencyScore: data.fluencyScore,
      completenessScore: data.completenessScore,
      pronunciationReasons: [...(data.reasons || []), `录音 ${stats.duration.toFixed(1)} 秒，音量峰值 ${stats.peak.toFixed(2)}`],
      recognizedText: data.recognizedText || "",
      debugAudioUrl: data.debugAudioUrl || "",
      debugAudioPath: data.debugAudioPath || "",
      pronunciationDuration: stats.duration,
      pronunciationPeak: stats.peak,
      pronunciationAttempts: (grammarPracticeState(grammar.id, item.id).pronunciationAttempts || 0) + 1
    });
    state.grammarRecordingError = "";
    state.grammarRecordingErrorKey = key;
    recordingReleaseRequested = false;
    recordingPointerId = null;
    render();
  } catch (error) {
    updateGrammarPractice(grammar.id, item.id, {
      pronunciationPassed: false,
      pronunciationReasons: [String(error.message || error)],
      debugAudioUrl: "",
      debugAudioPath: "",
      pronunciationDuration: 0,
      pronunciationPeak: 0,
      pronunciationAttempts: (grammarPracticeState(grammar.id, item.id).pronunciationAttempts || 0) + 1
    });
    state.grammarRecordingErrorKey = key;
    state.grammarRecordingError = String(error.message || error);
    recordingReleaseRequested = false;
    recordingPointerId = null;
    render();
  }
}

function startGrammarHold(button, key, event) {
  if (!key || recordingSession || state.grammarRecordingStoppingId) return;
  if (event?.pointerId != null) recordingPointerId = event.pointerId;
  if (event?.currentTarget?.setPointerCapture && event?.pointerId != null) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Ignore capture failures; document/window listeners remain as fallback.
    }
  }
  recordingReleaseRequested = false;
  startGrammarRecording(key);
}

function endGrammarHold(key, event) {
  if (!key) return;
  if (recordingPointerId != null && event?.pointerId != null && event.pointerId !== recordingPointerId) return;
  if (event?.currentTarget?.releasePointerCapture && event?.pointerId != null) {
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore capture release failures.
    }
  }
  recordingReleaseRequested = true;
  if (recordingSession?.kind === "grammar" && recordingSession?.key === key) {
    stopGrammarRecording(key);
  }
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function encodeWav(chunks, sampleRate) {
  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const samples = new Float32Array(length);
  let offset = 0;
  chunks.forEach((chunk) => {
    samples.set(chunk, offset);
    offset += chunk.length;
  });
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);
  let pos = 44;
  for (const sample of samples) {
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(pos, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    pos += 2;
  }
  return buffer;
}

function audioStats(chunks, sampleRate) {
  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  let peak = 0;
  for (const chunk of chunks) {
    for (const sample of chunk) {
      peak = Math.max(peak, Math.abs(sample));
    }
  }
  return { duration: sampleRate ? length / sampleRate : 0, peak };
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i += 1) view.setUint8(offset + i, string.charCodeAt(i));
}

function jumpToWeakItem(value) {
  const [type, ...rest] = value.split(":");
  const id = rest.join(":");
  if (type === "word") {
    const index = lesson.vocabulary.findIndex((word) => word.id === id);
    if (index >= 0) {
      state.currentWord = index;
      state.vocabPhase = "pronunciation";
      state.recallResult = "";
      navigate(`/lesson/${lesson.id}/vocab`);
    }
    return;
  }
  if (type === "sentence") {
    navigate(`/lesson/${lesson.id}/text?sentenceId=${id}`);
    return;
  }
  if (type === "grammarExample") {
    const [grammarId] = id.split(":");
    const index = lesson.grammar.findIndex((grammar) => grammar.id === grammarId);
    if (index >= 0) state.currentGrammar = index;
    navigate(`/lesson/${lesson.id}/grammar`);
  }
}

function handleRegenerateWordAudio(wordId) {
  const word = wordById(wordId);
  const audio = audioUrl("word", wordId);
  audioVersions[audio] = Date.now();
  write(`lesson:${lesson.id}:audioVersions`, audioVersions);
  state.modal = {
    type: "audioCorrection",
    id: wordId,
    command: `MINIMAX_API_KEY="你的TTS可用key" MINIMAX_ONLY=word:${wordId} node scripts/generate-minimax-audio.mjs --force`,
    title: `${word.jp} 发音勘误`
  };
  render();
}

function cleanupRecordingSession(session) {
  if (!session) return;
  try {
    session.processor?.disconnect();
    session.source?.disconnect();
    session.stream?.getTracks().forEach((track) => track.stop());
    session.audioContext?.close();
  } catch {
    // Best-effort cleanup for aborted microphone sessions.
  }
}

function closestElement(node, selector) {
  const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
  return element?.closest?.(selector) || null;
}

function getSelectionContext() {
  const selection = window.getSelection?.();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
  const text = normalizeLookupText(selection.toString());
  if (!text) return null;

  const range = selection.getRangeAt(0);
  const startRoot = closestElement(range.startContainer, ".hover-translation");
  const endRoot = closestElement(range.endContainer, ".hover-translation");
  if (!startRoot || startRoot !== endRoot) return null;

  const rect = range.getBoundingClientRect();
  if (!rect.width && !rect.height) return null;
  return { text, rect };
}

function selectionBubble() {
  let bubble = document.querySelector("#selection-bubble");
  if (bubble) return bubble;
  bubble = document.createElement("div");
  bubble.id = "selection-bubble";
  bubble.className = "selection-bubble";
  bubble.hidden = true;
  document.body.appendChild(bubble);
  return bubble;
}

function hideSelectionBubble() {
  selectionLookupToken += 1;
  const bubble = document.querySelector("#selection-bubble");
  if (bubble) bubble.hidden = true;
}

function placeSelectionBubble(bubble, rect) {
  const padding = 10;
  bubble.hidden = false;
  const width = bubble.offsetWidth || 260;
  const height = bubble.offsetHeight || 120;
  const left = clamp(rect.left + rect.width / 2 - width / 2, padding, window.innerWidth - width - padding);
  const top = rect.top > height + padding
    ? rect.top - height - 8
    : Math.min(window.innerHeight - height - padding, rect.bottom + 8);
  bubble.style.left = `${Math.max(padding, left)}px`;
  bubble.style.top = `${Math.max(padding, top)}px`;
}

function showSelectionBubble(content, rect) {
  const bubble = selectionBubble();
  bubble.innerHTML = content;
  placeSelectionBubble(bubble, rect);
}

function vocabularyBubbleContent(word) {
  return `
    <div class="selection-bubble-head">
      <strong>${escapeHtml(word.jp)}</strong>
      <button class="icon-button" data-selection-speak="${escapeHtml(word.jp)}" data-selection-audio="${audioUrl("word", word.id)}" aria-label="播放单词" title="播放单词">🔊</button>
    </div>
    <div class="selection-bubble-row"><span>发音</span><b>${escapeHtml(word.kana)}</b></div>
    <div class="selection-bubble-row"><span>意思</span><b>${escapeHtml(word.cn)}</b></div>
  `;
}

function unavailableBubbleContent(text) {
  return `
    <div class="selection-bubble-head">
      <strong>${escapeHtml(text)}</strong>
    </div>
    <p class="selection-bubble-note">词库中没有这个词汇</p>
  `;
}

async function translateWithLocalTranslator(text) {
  try {
    const translatorApi = window.Translator;
    if (!translatorApi?.availability || !translatorApi?.create) return "";
    const options = { sourceLanguage: "ja", targetLanguage: "zh" };
    const availability = await translatorApi.availability(options);
    if (availability !== "available") return "";
    const translator = await translatorApi.create(options);
    return await translator.translate(text);
  } catch {
    return "";
  }
}

async function handleSelectionLookup() {
  const context = getSelectionContext();
  if (!context) {
    hideSelectionBubble();
    return;
  }

  const token = selectionLookupToken + 1;
  selectionLookupToken = token;
  const word = wordByText(context.text);
  if (word) {
    showSelectionBubble(vocabularyBubbleContent(word), context.rect);
    return;
  }

  showSelectionBubble(unavailableBubbleContent(context.text), context.rect);
  const translated = await translateWithLocalTranslator(context.text);
  if (selectionLookupToken !== token || !translated) return;
  showSelectionBubble(`
    <div class="selection-bubble-head">
      <strong>${escapeHtml(context.text)}</strong>
    </div>
    <div class="selection-bubble-row"><span>本机翻译</span><b>${escapeHtml(translated)}</b></div>
  `, context.rect);
}

async function loadAudioStatus(force = false) {
  if (!force && state.audioStatusVoiceId === state.currentVoiceId && state.audioStatus) return;
  state.audioStatusVoiceId = state.currentVoiceId;
  try {
    const response = await fetch(`/api/audio/status?voiceId=${encodeURIComponent(state.currentVoiceId)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "读取音频状态失败");
    state.audioStatus = data;
    state.audioMessage = "";
  } catch (error) {
    state.audioStatus = { items: [] };
    state.audioMessage = String(error.message || error);
  }
  if (route().page === "audio") render();
}

async function postAudioApi(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "音频操作失败");
  if (data.error) throw new Error(data.error);
  return data;
}

function waitClient(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateAudioItemStatus(itemUpdate) {
  if (!state.audioStatus?.items || !itemUpdate) return;
  state.audioStatus.items = state.audioStatus.items.map((item) => {
    if (item.type !== itemUpdate.type || item.id !== itemUpdate.id) return item;
    return { ...item, ...itemUpdate };
  });
}

async function previewVoice(voiceId) {
  state.audioBusy = "正在生成并播放示例音频...";
  state.audioMessage = "";
  render();
  try {
    const data = await postAudioApi("/api/audio/sample", { voiceId });
    state.audioBusy = "";
    state.audioMessage = data.generated ? "示例音频已生成。" : "示例音频已存在，直接播放。";
    render();
    playAudio(sampleAudioText, data.url);
  } catch (error) {
    state.audioBusy = "";
    state.audioMessage = String(error.message || error);
    render();
  }
}

async function generateManagedAudio(value) {
  const [type, id] = value.split(":");
  const isAll = value === "all";
  state.audioBusy = isAll ? "正在生成当前声音缺失的全部音频，完成前请保持服务运行..." : "正在生成当前音频...";
  state.audioMessage = "";
  render();
  try {
    if (isAll) {
      if (!state.audioStatus?.items?.length) await loadAudioStatus(true);
      const targets = (state.audioStatus?.items || []).filter((item) => !item.exists);
      let generated = 0;
      let failed = 0;
      for (const [index, item] of targets.entries()) {
        state.audioBusy = `正在生成 ${index + 1} / ${targets.length}：${item.label}`;
        state.audioMessage = `已生成 ${generated} 个，失败 ${failed} 个，剩余 ${targets.length - index} 个。`;
        render();
        try {
          const data = await postAudioApi("/api/audio/generate", { voiceId: state.currentVoiceId, type: item.type, id: item.id });
          const itemUpdate = data.items?.[0];
          if (itemUpdate?.error) failed += 1;
          if (itemUpdate?.generated || itemUpdate?.exists) generated += 1;
          updateAudioItemStatus(itemUpdate);
        } catch (error) {
          failed += 1;
          updateAudioItemStatus({ id: item.id, type: item.type, error: String(error.message || error), exists: false });
        }
        state.audioMessage = `已生成 ${generated} 个，失败 ${failed} 个，剩余 ${targets.length - index - 1} 个。`;
        render();
        if (index < targets.length - 1) await waitClient(200);
      }
      state.audioBusy = "";
      state.audioMessage = `批量生成完成：生成 ${generated} 个${failed ? `，失败 ${failed} 个。可稍后再次点击继续补齐。` : "。"}`;
      await loadAudioStatus(true);
      return;
    }
    const data = await postAudioApi("/api/audio/generate", isAll
      ? { voiceId: state.currentVoiceId, scope: "all" }
      : { voiceId: state.currentVoiceId, type, id });
    state.audioBusy = "";
    state.audioMessage = `生成 ${data.generated} 个，跳过 ${data.skipped} 个${data.failed ? `，失败 ${data.failed} 个。可稍后再次点击继续生成剩余缺失音频。` : "。"}`;
    await loadAudioStatus(true);
  } catch (error) {
    state.audioBusy = "";
    state.audioMessage = String(error.message || error);
    render();
  }
}

async function setDefaultVoice(voiceId) {
  state.currentVoiceId = voiceId;
  state.audioStatus = null;
  state.audioStatusVoiceId = "";
  state.audioMessage = "已设为默认声音，正在检查并生成缺失音频。";
  write(`lesson:${lesson.id}:currentVoiceId`, state.currentVoiceId);
  render();
  await loadAudioStatus(true);
  const missing = state.audioStatus?.items?.filter((item) => !item.exists).length || 0;
  if (missing > 0) {
    await generateManagedAudio("all");
    return;
  }
  state.audioMessage = "已设为默认声音，当前版本音频已完整。";
  render();
}

function render() {
  const current = route().page;
  const views = { home, vocab, text: textPage, grammar: grammarPage, exercises: exercisesPage, audio: audioManagePage, result: resultPage };
  hideSelectionBubble();
  app.innerHTML = (views[current] || home)();
  ensurePageFocus();
  bind();
  if (current === "audio") loadAudioStatus();
  if (current === "vocab" && state.vocabPhase === "pronunciation" && !state.modal) {
    const word = activeVocabulary()[state.currentWord];
    if (word && lastAutoSpokenWord !== word.id) {
      lastAutoSpokenWord = word.id;
      const shouldDelay = pendingAutoSpeakWordId === word.id;
      pendingAutoSpeakWordId = "";
      window.setTimeout(() => {
        if (route().page !== "vocab") return;
        if (state.vocabPhase !== "pronunciation") return;
        if (activeVocabulary()[state.currentWord]?.id !== word.id) return;
        if (state.recordingWordId || state.recordingPreparingWordId || state.recordingStoppingWordId) return;
        playAudio(word.jp, audioUrl("word", word.id));
      }, shouldDelay ? 260 : 100);
    }
  }
  if (current === "vocab" && state.vocabPhase === "test" && !state.modal) {
    const task = currentVocabTestTask();
    if (task?.type === "audioToWord") {
      const word = wordById(task.wordId);
      const key = `test:${task.id}`;
      if (word && lastAutoSpokenWord !== key) {
        lastAutoSpokenWord = key;
        window.setTimeout(() => playAudio(word.jp, audioUrl("word", word.id)), 80);
      }
    }
  }
  if (current === "text" && !state.modal) {
    const sentence = lesson.sentences[state.currentSentence];
    if (sentence && lastAutoSpokenSentence !== sentence.id) {
      lastAutoSpokenSentence = sentence.id;
      window.setTimeout(() => playAudio(sentence.text, audioUrl("sentence", sentence.id)), 80);
    }
  }
}

function ensurePageFocus() {
  if (document.activeElement?.matches?.("input, textarea, select, [contenteditable='true']")) return;
  document.body.setAttribute("tabindex", "-1");
  document.body.focus({ preventScroll: true });
}

function bind() {
  app.querySelectorAll("[data-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(link.getAttribute("href"));
    });
  });
  app.querySelectorAll("[data-nav]").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.nav)));
  app.querySelectorAll("[data-playback-rate]").forEach((button) => button.addEventListener("click", () => {
    setPlaybackRate(button.dataset.playbackRate);
  }));
  app.querySelectorAll("[data-speak]").forEach((button) => {
    button.addEventListener("click", () => playAudio(button.dataset.speak, button.dataset.audio));
    button.addEventListener("pointerenter", () => speakFromHover(button.dataset.speak, button.dataset.audio));
    button.addEventListener("pointermove", () => speakFromHover(button.dataset.speak, button.dataset.audio));
    button.addEventListener("mouseenter", () => speakFromHover(button.dataset.speak, button.dataset.audio));
    button.addEventListener("mouseover", () => speakFromHover(button.dataset.speak, button.dataset.audio));
    button.addEventListener("focus", () => speakFromHover(button.dataset.speak, button.dataset.audio));
  });
  app.querySelectorAll(".voice-main[data-voice-id]").forEach((button) => button.addEventListener("click", () => {
    state.currentVoiceId = button.dataset.voiceId;
    state.audioStatus = null;
    state.audioStatusVoiceId = "";
    state.audioMessage = "";
    write(`lesson:${lesson.id}:currentVoiceId`, state.currentVoiceId);
    render();
  }));
  app.querySelectorAll("[data-set-default-voice]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    setDefaultVoice(button.dataset.setDefaultVoice);
  }));
  app.querySelector("[data-preview-voice]")?.addEventListener("click", (event) => {
    previewVoice(event.currentTarget.dataset.previewVoice);
  });
  app.querySelectorAll("[data-generate-audio]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    generateManagedAudio(button.dataset.generateAudio);
  }));
  app.querySelectorAll("[data-word-index]").forEach((button) => button.addEventListener("click", () => {
    setCurrentWord(Number(button.dataset.wordIndex), true);
  }));
  app.querySelectorAll("[data-word-status]").forEach((button) => button.addEventListener("click", () => {
    const word = activeVocabulary()[state.currentWord];
    state.wordProgress[word.id] = button.dataset.wordStatus;
    write(`lesson:${lesson.id}:wordProgress`, state.wordProgress);
    setCurrentWord(state.currentWord + 1, true);
  }));
  app.querySelectorAll("[data-shadow-action]").forEach((button) => button.addEventListener("click", () => {
    handleShadowAction(button.dataset.shadowType, button.dataset.shadowId, button.dataset.shadowAction, button.dataset.shadowText, button.dataset.shadowAudio);
  }));
  app.querySelectorAll("[data-recall-word]").forEach((button) => button.addEventListener("click", () => {
    handleRecall(button.dataset.recallWord);
  }));
  app.querySelectorAll("[data-word-quiz]").forEach((button) => button.addEventListener("click", () => {
    const [mode, selectedWordId] = button.dataset.wordQuiz.split(":");
    handleWordQuiz(mode, selectedWordId);
  }));
  app.querySelectorAll("[data-hold-record-word]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      holdWordRecording(button, button.dataset.holdRecordWord, event);
    });
    button.addEventListener("pointerup", (event) => {
      endWordRecording(button.dataset.holdRecordWord, event);
    });
    button.addEventListener("pointercancel", (event) => {
      endWordRecording(button.dataset.holdRecordWord, event);
    });
    button.addEventListener("lostpointercapture", (event) => {
      endWordRecording(button.dataset.holdRecordWord, event);
    });
  });
  app.querySelector("[data-reset-word-learning]")?.addEventListener("click", resetWordLearningData);
  app.querySelectorAll("[data-next-pronunciation-word]").forEach((button) => button.addEventListener("click", () => {
    setCurrentWord(state.currentWord + 1, true);
  }));
  app.querySelector("[data-start-vocab-test]")?.addEventListener("click", startVocabTest);
  app.querySelector("[data-reset-vocab-test]")?.addEventListener("click", () => {
    state.currentVocabTest = 0;
    state.vocabTestQueue = [];
    write(`lesson:${lesson.id}:vocabTestQueue`, state.vocabTestQueue);
    write(`lesson:${lesson.id}:currentVocabTest`, state.currentVocabTest);
    startVocabTest();
  });
  app.querySelectorAll("[data-next-word-phase]").forEach((button) => button.addEventListener("click", () => {
    state.vocabPhase = button.dataset.nextWordPhase;
    state.recallResult = "";
    render();
  }));
  app.querySelectorAll("[data-skip-pronunciation]").forEach((button) => button.addEventListener("click", () => {
    const previous = wordLearningState(button.dataset.skipPronunciation);
    updateWordLearning(button.dataset.skipPronunciation, {
      pronunciationPassed: false,
      pronunciationReasons: ["稍后复习发音"],
      attempts: { ...previous.attempts, pronunciation: (previous.attempts.pronunciation || 0) + 1 }
    });
    setCurrentWord(state.currentWord + 1, true);
    state.recallResult = "";
    render();
  }));
  app.querySelectorAll("[data-regenerate-word]").forEach((button) => button.addEventListener("click", () => {
    handleRegenerateWordAudio(button.dataset.regenerateWord);
  }));
  app.querySelectorAll("[data-sentence-index]").forEach((button) => button.addEventListener("click", () => {
    state.currentSentence = Number(button.dataset.sentenceIndex);
    history.replaceState({}, "", lessonPath(`/lesson/${lesson.id}/text`));
    render();
  }));
  app.querySelector("[data-prev-sentence]")?.addEventListener("click", () => {
    state.currentSentence = Math.max(0, state.currentSentence - 1);
    render();
  });
  app.querySelector("[data-next-sentence]")?.addEventListener("click", () => {
    const sentence = lesson.sentences[state.currentSentence];
    if (!interactionDone("sentence", sentence.id)) return;
    state.currentSentence = Math.min(lesson.sentences.length - 1, state.currentSentence + 1);
    render();
  });
  app.querySelectorAll("[data-grammar-index]").forEach((button) => button.addEventListener("click", () => {
    state.currentGrammar = Number(button.dataset.grammarIndex);
    render();
  }));
  app.querySelectorAll("[data-grammar-answer]").forEach((input) => input.addEventListener("input", (event) => {
    handleGrammarPracticeInput(input.dataset.grammarAnswer, event.target.value);
  }));
  app.querySelectorAll("[data-grammar-check]").forEach((button) => button.addEventListener("click", () => {
    handleGrammarPracticeCheck(button.dataset.grammarCheck);
  }));
  app.querySelectorAll("[data-grammar-reset]").forEach((button) => button.addEventListener("click", () => {
    handleGrammarPracticeReset(button.dataset.grammarReset);
  }));
  app.querySelectorAll("[data-grammar-toggle-collapse]").forEach((button) => button.addEventListener("click", () => {
    toggleGrammarPracticeCollapse(button.dataset.grammarToggleCollapse);
  }));
  app.querySelectorAll("[data-hold-record-grammar]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      startGrammarHold(button, button.dataset.holdRecordGrammar, event);
    });
    button.addEventListener("pointerup", (event) => {
      endGrammarHold(button.dataset.holdRecordGrammar, event);
    });
    button.addEventListener("pointercancel", (event) => {
      endGrammarHold(button.dataset.holdRecordGrammar, event);
    });
    button.addEventListener("lostpointercapture", (event) => {
      endGrammarHold(button.dataset.holdRecordGrammar, event);
    });
  });
  app.querySelectorAll("[data-exercise-index]").forEach((button) => button.addEventListener("click", () => {
    state.currentExercise = Number(button.dataset.exerciseIndex);
    state.answer = "";
    state.submitted = false;
    navigate(`/lesson/${lesson.id}/exercises`);
  }));
  app.querySelectorAll("[data-grammar-modal]").forEach((button) => button.addEventListener("click", () => {
    state.modal = { type: "grammar", id: button.dataset.grammarModal };
    render();
  }));
  app.querySelectorAll("[data-word-modal]").forEach((button) => button.addEventListener("click", () => {
    state.modal = { type: "word", id: button.dataset.wordModal };
    render();
  }));
  app.querySelectorAll("[data-wrong-detail]").forEach((button) => button.addEventListener("click", () => {
    state.modal = { type: "wrong", id: button.dataset.wrongDetail };
    render();
  }));
  app.querySelectorAll("[data-weak-jump]").forEach((button) => button.addEventListener("click", () => {
    jumpToWeakItem(button.dataset.weakJump);
  }));
  app.querySelector("[data-answer]")?.addEventListener("input", (event) => {
    state.answer = event.target.value;
  });
  app.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
    state.answer = button.dataset.choice;
    render();
  }));
  app.querySelector("[data-submit-answer]")?.addEventListener("click", commitResult);
  app.querySelector("[data-next-exercise]")?.addEventListener("click", () => {
    if (state.currentExercise === lesson.exercises.length - 1) {
      state.answer = "";
      state.submitted = false;
      navigate(`/lesson/${lesson.id}/result`);
      return;
    }
    state.currentExercise += 1;
    state.answer = "";
    state.submitted = false;
    render();
  });
  app.querySelectorAll("[data-close-modal]").forEach((item) => item.addEventListener("click", (event) => {
    if (event.target.closest("[data-dialog]") && !event.target.matches("[data-close-modal]")) return;
    state.modal = null;
    render();
  }));
}

window.addEventListener("popstate", render);
document.addEventListener("keydown", handleKeyboard, true);
document.addEventListener("keyup", handleKeyboard, true);
document.addEventListener("pointerover", handleSpeakHover, true);
document.addEventListener("pointermove", handleSpeakHover, true);
document.addEventListener("selectionchange", () => window.setTimeout(handleSelectionLookup, 0));
document.addEventListener("pointerdown", (event) => {
  if (!event.target.closest?.("#selection-bubble")) hideSelectionBubble();
}, true);
document.addEventListener("pointerup", () => {
  releaseWordRecording(recordingPressWordId || recordingSession?.wordId || state.recordingPreparingWordId);
  releaseGrammarRecording(state.grammarRecordingId || state.grammarRecordingPreparingId || recordingSession?.key);
}, true);
document.addEventListener("pointercancel", () => {
  releaseWordRecording(recordingPressWordId || recordingSession?.wordId || state.recordingPreparingWordId);
  releaseGrammarRecording(state.grammarRecordingId || state.grammarRecordingPreparingId || recordingSession?.key);
}, true);
document.addEventListener("click", (event) => {
  const button = event.target.closest?.("[data-selection-speak]");
  if (!button) return;
  playAudio(button.dataset.selectionSpeak, button.dataset.selectionAudio);
});
window.addEventListener("pointerdown", primeSpeech, { once: true });
if ("speechSynthesis" in window) {
  speechSynthesis.addEventListener?.("voiceschanged", primeSpeech);
}
render();

function handleKeyboard(event) {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.target.closest?.("input, textarea, select, [contenteditable='true']")) return;
  if (state.modal) return;

  const current = route().page;
  const key = event.key || event.code;
  const now = Date.now();
  const actionKey = `${current}:${key || event.code}:${event.type}`;
  if (event.type === "keyup" && lastKeyAction.key === `${current}:${key || event.code}:keydown` && now - lastKeyAction.at < 180) return;

  if (current === "vocab" && (key === "ArrowLeft" || event.code === "ArrowLeft" || key === "ArrowRight" || event.code === "ArrowRight")) {
    event.preventDefault();
    if (!canLeaveCurrentWord()) return;
    lastKeyAction = { key: actionKey, at: now };
    const step = key === "ArrowRight" || event.code === "ArrowRight" ? 1 : -1;
    setCurrentWord(state.currentWord + step, true);
  }

  if (current === "text" && (key === "ArrowUp" || event.code === "ArrowUp" || key === "ArrowDown" || event.code === "ArrowDown")) {
    event.preventDefault();
    lastKeyAction = { key: actionKey, at: now };
    const step = key === "ArrowDown" || event.code === "ArrowDown" ? 1 : -1;
    state.currentSentence = clamp(state.currentSentence + step, 0, lesson.sentences.length - 1);
    render();
  }

  if (current === "grammar" && (key === "ArrowUp" || event.code === "ArrowUp" || key === "ArrowDown" || event.code === "ArrowDown")) {
    event.preventDefault();
    lastKeyAction = { key: actionKey, at: now };
    const step = key === "ArrowDown" || event.code === "ArrowDown" ? 1 : -1;
    state.currentGrammar = clamp(state.currentGrammar + step, 0, lesson.grammar.length - 1);
    render();
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function handleSpeakHover(event) {
  const trigger = event.target.closest?.("[data-speak]");
  if (!trigger) return;
  speakFromHover(trigger.dataset.speak, trigger.dataset.audio);
}
