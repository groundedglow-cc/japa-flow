let lesson = {
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
    example: "__子供です__ / 横浜に住んでいました → __子供の時__、横浜に住んでいました。",
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
    example: "__子供です__ / 横浜に住んでいました → __子供の時__、横浜に住んでいました。",
    type: "fill",
    question: "休みです / 子供とサッカーをします",
    answer: "休みの時、子供とサッカーをします。",
    referenceAnswers: ["休みの時、子供とサッカーをします。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "名词「休み」后接「の時」，表示休息或休假时。"
  },
  {
    id: "ex-i-1-3",
    groupId: "i-1",
    groupTitle: "练习 I · 1",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__子供です__ / 横浜に住んでいました → __子供の時__、横浜に住んでいました。",
    type: "fill",
    question: "信号が青です / 道を渡ってもいいです",
    answer: "信号が青の時、道を渡ってもいいです。",
    referenceAnswers: ["信号が青の時、道を渡ってもいいです。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "二类形容词「青」作名词性状态使用时，接「の時」。"
  },
  {
    id: "ex-i-1-4",
    groupId: "i-1",
    groupTitle: "练习 I · 1",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__子供です__ / 横浜に住んでいました → __子供の時__、横浜に住んでいました。",
    type: "fill",
    question: "信号が赤です / 道を渡ってはいけません",
    answer: "信号が赤の時、道を渡ってはいけません。",
    referenceAnswers: ["信号が赤の時、道を渡ってはいけません。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "二类形容词「赤」作名词性状态使用时，接「の時」。"
  },
  {
    id: "ex-i-1-5",
    groupId: "i-1",
    groupTitle: "练习 I · 1",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__子供です__ / 横浜に住んでいました → __子供の時__、横浜に住んでいました。",
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
    example: "__天気がいいです__ / 友達と野球をします → __天気がいい時__、友達と野球をします。",
    type: "fill",
    question: "寂しいです / 明るい曲を聞きます",
    answer: "寂しい時、明るい曲を聞きます。",
    referenceAnswers: ["寂しい時、明るい曲を聞きます。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "一类形容词接「時」时直接连接。"
  },
  {
    id: "ex-i-2-2",
    groupId: "i-2",
    groupTitle: "练习 I · 2",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__天気がいいです__ / 友達と野球をします → __天気がいい時__、友達と野球をします。",
    type: "fill",
    question: "夜静かです / 詩を書きます",
    answer: "夜静かな時、詩を書きます。",
    referenceAnswers: ["夜静かな時、詩を書きます。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "二类形容词接「時」时用「な時」。"
  },
  {
    id: "ex-i-2-3",
    groupId: "i-2",
    groupTitle: "练习 I · 2",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__天気がいいです__ / 友達と野球をします → __天気がいい時__、友達と野球をします。",
    type: "fill",
    question: "困りました / わたしに相談してください",
    answer: "困った時、わたしに相談してください。",
    referenceAnswers: ["困った時、わたしに相談してください。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "已经发生或处于该状态时，用动词た形 +「時」。"
  },
  {
    id: "ex-i-2-4",
    groupId: "i-2",
    groupTitle: "练习 I · 2",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__天気がいいです__ / 友達と野球をします → __天気がいい時__、友達と野球をします。",
    type: "fill",
    question: "紙を切ります / はさみを使います",
    answer: "紙を切る時、はさみを使います。",
    referenceAnswers: ["紙を切る時、はさみを使います。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "表示做某动作时，用动词基本形 +「時」。"
  },
  {
    id: "ex-i-2-5",
    groupId: "i-2",
    groupTitle: "练习 I · 2",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__仕事が暇です__ / 残業しません → __仕事が暇な時__、残業しません。",
    type: "fill",
    question: "部屋を使いません / 電気を消してください",
    answer: "部屋を使わない時、電気を消してください。",
    referenceAnswers: ["部屋を使わない時、電気を消してください。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "否定的“使用房间的时候”要用动词ない形 +「時」。"
  },
  {
    id: "ex-i-2-6",
    groupId: "i-2",
    groupTitle: "练习 I · 2",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__仕事が暇です__ / 残業しません → __仕事が暇な時__、残業しません。",
    type: "fill",
    question: "お金がありません / どうしますか",
    answer: "お金がない時、どうしますか。",
    referenceAnswers: ["お金がない時、どうしますか。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "「ありません」的普通否定形是「ない」，接「時」。"
  },
  {
    id: "ex-i-2-7",
    groupId: "i-2",
    groupTitle: "练习 I · 2",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__仕事が暇です__ / 残業しません → __仕事が暇な時__、残業しません。",
    type: "fill",
    question: "都合が悪いです / すぐ連絡してください",
    answer: "都合が悪い時、すぐ連絡してください。",
    referenceAnswers: ["都合が悪い時、すぐ連絡してください。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "一类形容词「悪い」直接接「時」。"
  },
  {
    id: "ex-i-2-8",
    groupId: "i-2",
    groupTitle: "练习 I · 2",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__コーヒーを飲みます__ / 砂糖を入れます → __コーヒーを飲む時__、砂糖を入れます。",
    type: "fill",
    question: "朝友達に会いました / 「おはよう」と言います",
    answer: "朝友達に会った時、「おはよう」と言います。",
    referenceAnswers: ["朝友達に会った時、「おはよう」と言います。", "朝友達に会った時、おはようと言います。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "已经见到朋友时，用动词た形 +「時」。"
  },
  {
    id: "ex-i-3-1",
    groupId: "i-3",
    groupTitle: "练习 I · 3",
    category: "听力练习",
    instruction: "听录音，仿照例句回答录音中的提问。",
    example: "例：子供の時、どこに住んでいましたか。上海に住んでいました。",
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
    example: "例：子供の時、どこに住んでいましたか。上海に住んでいました。",
    type: "listening",
    audioRequired: true,
    hasAnswer: false,
    question: "お金とパスポート",
    answer: "",
    referenceAnswers: [],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "本题需要教材录音。当前未提供录音，暂不判分。"
  },
  {
    id: "ex-i-3-3",
    groupId: "i-3",
    groupTitle: "练习 I · 3",
    category: "听力练习",
    instruction: "听录音，仿照例句回答录音中的提问。",
    example: "例：子供の時、どこに住んでいましたか。上海に住んでいました。",
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
    id: "ex-i-3-4",
    groupId: "i-3",
    groupTitle: "练习 I · 3",
    category: "听力练习",
    instruction: "听录音，仿照例句回答录音中的提问。",
    example: "例：子供の時、どこに住んでいましたか。上海に住んでいました。",
    type: "listening",
    audioRequired: true,
    hasAnswer: false,
    question: "「お先に失礼します」",
    answer: "",
    referenceAnswers: [],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "本题需要教材录音。当前未提供录音，暂不判分。"
  },
  {
    id: "ex-i-3-5",
    groupId: "i-3",
    groupTitle: "练习 I · 3",
    category: "听力练习",
    instruction: "听录音，仿照例句回答录音中的提问。",
    example: "例：子供の時、どこに住んでいましたか。上海に住んでいました。",
    type: "listening",
    audioRequired: true,
    hasAnswer: false,
    question: "家族や友達",
    answer: "",
    referenceAnswers: [],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "本题需要教材录音。当前未提供录音，暂不判分。"
  },
  {
    id: "ex-i-3-6",
    groupId: "i-3",
    groupTitle: "练习 I · 3",
    category: "听力练习",
    instruction: "听录音，仿照例句回答录音中的提问。",
    example: "例：子供の時、どこに住んでいましたか。上海に住んでいました。",
    type: "listening",
    audioRequired: true,
    hasAnswer: false,
    question: "卓球やバスケットボール",
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
    example: "例1：__雑誌を読みます__ / ご飯を食べます → 甲：李さんは何をしていますか。乙：__雑誌を読みながら__、ご飯を食べています。",
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
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "例1：__雑誌を読みます__ / ご飯を食べます → 甲：李さんは何をしていますか。乙：__雑誌を読みながら__、ご飯を食べています。",
    type: "fill",
    question: "長島さんと話します / 写真を選びます",
    answer: "長島さんと話しながら、写真を選んでいます。",
    referenceAnswers: ["長島さんと話しながら、写真を選んでいます。"],
    relatedGrammar: ["g2", "g4"],
    relatedSentences: [],
    explanation: "「話します」去掉「ます」接「ながら」，后项用「選んでいます」。"
  },
  {
    id: "ex-i-4-3",
    groupId: "i-4",
    groupTitle: "练习 I · 4",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "例1：__雑誌を読みます__ / ご飯を食べます → 甲：李さんは何をしていますか。乙：__雑誌を読みながら__、ご飯を食べています。",
    type: "fill",
    question: "手をたたきます / 歌ったり踊ったりします",
    answer: "手をたたきながら、歌ったり踊ったりしています。",
    referenceAnswers: ["手をたたきながら、歌ったり踊ったりしています。"],
    relatedGrammar: ["g2", "g4"],
    relatedSentences: [],
    explanation: "「手をたたきながら」表示一边拍手一边唱歌跳舞。"
  },
  {
    id: "ex-i-4-4",
    groupId: "i-4",
    groupTitle: "练习 I · 4",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "例1：__雑誌を読みます__ / ご飯を食べます → 甲：李さんは何をしていますか。乙：__雑誌を読みながら__、ご飯を食べています。",
    type: "fill",
    question: "部屋の中を歩きます / スピーチの練習をします",
    answer: "部屋の中を歩きながら、スピーチの練習をしています。",
    referenceAnswers: ["部屋の中を歩きながら、スピーチの練習をしています。"],
    relatedGrammar: ["g2"],
    relatedSentences: [],
    explanation: "「歩きながら」表示一边走一边做后项动作。"
  },
  {
    id: "ex-i-4-5",
    groupId: "i-4",
    groupTitle: "练习 I · 4",
    category: "替换练习",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "例1：__雑誌を読みます__ / ご飯を食べます → 甲：李さんは何をしていますか。乙：__雑誌を読みながら__、ご飯を食べています。",
    type: "fill",
    question: "表やグラフを見せます / 新しい企画の説明をします",
    answer: "表やグラフを見せながら、新しい企画の説明をしています。",
    referenceAnswers: ["表やグラフを見せながら、新しい企画の説明をしています。"],
    relatedGrammar: ["g2", "g4"],
    relatedSentences: [],
    explanation: "「見せます」去掉「ます」接「ながら」，表示一边展示表格和图表一边说明。"
  },
  {
    id: "ex-i-4-6",
    groupId: "i-4",
    groupTitle: "练习 I · 4",
    category: "确认表达练习",
    instruction: "仿照例句，用「でしょう？」确认对方信息。",
    example: "例2：野球が好きです / ええ、大好きです → 甲：森さん、野球が好きでしょう？ 乙：ええ、大好きです。",
    type: "fill",
    question: "明日から出張です / はい、1週間の予定です",
    answer: "明日から出張でしょう？",
    referenceAnswers: ["明日から出張でしょう？"],
    relatedGrammar: ["g3"],
    relatedSentences: ["s4"],
    explanation: "向对方确认自己认为基本确定的事情时，用升调的「でしょう？」。"
  },
  {
    id: "ex-i-4-7",
    groupId: "i-4",
    groupTitle: "练习 I · 4",
    category: "确认表达练习",
    instruction: "仿照例句，用「でしょう？」确认对方信息。",
    example: "例2：野球が好きです / ええ、大好きです → 甲：森さん、野球が好きでしょう？ 乙：ええ、大好きです。",
    type: "fill",
    question: "ここにカメラがありました / さあ、気がつきませんでしたが...",
    answer: "ここにカメラがあったでしょう？",
    referenceAnswers: ["ここにカメラがあったでしょう？"],
    relatedGrammar: ["g3"],
    relatedSentences: [],
    explanation: "过去的存在确认用「ありました」的普通形「あった」加「でしょう？」。"
  },
  {
    id: "ex-i-4-8",
    groupId: "i-4",
    groupTitle: "练习 I · 4",
    category: "确认表达练习",
    instruction: "仿照例句，用「でしょう？」确认对方信息。",
    example: "例2：野球が好きです / ええ、大好きです → 甲：森さん、野球が好きでしょう？ 乙：ええ、大好きです。",
    type: "fill",
    question: "日本に恋人がいます / えっ！ いいえ、いません",
    answer: "日本に恋人がいるでしょう？",
    referenceAnswers: ["日本に恋人がいるでしょう？"],
    relatedGrammar: ["g3"],
    relatedSentences: [],
    explanation: "「います」的普通形是「いる」，确认时接「でしょう？」。"
  },
  {
    id: "ex-i-4-9",
    groupId: "i-4",
    groupTitle: "练习 I · 4",
    category: "确认表达练习",
    instruction: "仿照例句，用「でしょう？」确认对方信息。",
    example: "例2：野球が好きです / ええ、大好きです → 甲：森さん、野球が好きでしょう？ 乙：ええ、大好きです。",
    type: "fill",
    question: "スキーができます / ええ。でも、上手ではありません",
    answer: "スキーができるでしょう？",
    referenceAnswers: ["スキーができるでしょう？"],
    relatedGrammar: ["g3"],
    relatedSentences: [],
    explanation: "「できます」的普通形是「できる」，确认时接「でしょう？」。"
  },
  {
    id: "ex-i-4-10",
    groupId: "i-4",
    groupTitle: "练习 I · 4",
    category: "确认表达练习",
    instruction: "仿照例句，用「でしょう？」确认对方信息。",
    example: "例2：野球が好きです / ええ、大好きです → 甲：森さん、野球が好きでしょう？ 乙：ええ、大好きです。",
    type: "fill",
    question: "スペイン語は難しいです / いいえ、そんなに難しくないですよ",
    answer: "スペイン語は難しいでしょう？",
    referenceAnswers: ["スペイン語は難しいでしょう？"],
    relatedGrammar: ["g3"],
    relatedSentences: [],
    explanation: "一类形容词可直接接「でしょう？」进行确认。"
  },
  {
    id: "ex-i-5-1",
    groupId: "i-5",
    groupTitle: "练习 I · 5",
    category: "句型变换",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__姉は銀行で働きます__ → __姉は銀行で働いています__。",
    type: "fill",
    question: "父は市役所で働きます",
    answer: "父は市役所で働いています。",
    referenceAnswers: ["父は市役所で働いています。"],
    relatedGrammar: ["g4"],
    relatedSentences: [],
    explanation: "表示职业、习惯或持续状态时，可用「働いています」。"
  },
  {
    id: "ex-i-5-2",
    groupId: "i-5",
    groupTitle: "练习 I · 5",
    category: "句型变换",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__姉は銀行で働きます__ → __姉は銀行で働いています__。",
    type: "fill",
    question: "兄は大学で国際関係学を勉強します",
    answer: "兄は大学で国際関係学を勉強しています。",
    referenceAnswers: ["兄は大学で国際関係学を勉強しています。"],
    relatedGrammar: ["g4"],
    relatedSentences: [],
    explanation: "表示正在学习或持续性的学习状态时，用「勉強しています」。"
  },
  {
    id: "ex-i-5-3",
    groupId: "i-5",
    groupTitle: "练习 I · 5",
    category: "句型变换",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__姉は銀行で働きます__ → __姉は銀行で働いています__。",
    type: "fill",
    question: "母は毎日病院に通います",
    answer: "母は毎日病院に通っています。",
    referenceAnswers: ["母は毎日病院に通っています。"],
    relatedGrammar: ["g4"],
    relatedSentences: [],
    explanation: "表示反复或持续的习惯时，用「通っています」。"
  },
  {
    id: "ex-i-5-4",
    groupId: "i-5",
    groupTitle: "练习 I · 5",
    category: "句型变换",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__姉は銀行で働きます__ → __姉は銀行で働いています__。",
    type: "fill",
    question: "駅前のスーパーは安い品物を売ります",
    answer: "駅前のスーパーは安い品物を売っています。",
    referenceAnswers: ["駅前のスーパーは安い品物を売っています。"],
    relatedGrammar: ["g4"],
    relatedSentences: [],
    explanation: "表示店铺长期销售某类商品时，用「売っています」。"
  },
  {
    id: "ex-i-5-5",
    groupId: "i-5",
    groupTitle: "练习 I · 5",
    category: "句型变换",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__姉は銀行で働きます__ → __姉は銀行で働いています__。",
    type: "fill",
    question: "わたしは毎日運動します",
    answer: "わたしは毎日運動しています。",
    referenceAnswers: ["わたしは毎日運動しています。"],
    relatedGrammar: ["g4"],
    relatedSentences: [],
    explanation: "表示每天持续进行的习惯时，用「運動しています」。"
  },
  {
    id: "ex-i-5-6",
    groupId: "i-5",
    groupTitle: "练习 I · 5",
    category: "句型变换",
    instruction: "仿照例句替换画线部分进行练习。",
    example: "__姉は銀行で働きます__ → __姉は銀行で働いています__。",
    type: "fill",
    question: "弟の会社はパソコンの部品を作ります",
    answer: "弟の会社はパソコンの部品を作っています。",
    referenceAnswers: ["弟の会社はパソコンの部品を作っています。"],
    relatedGrammar: ["g4"],
    relatedSentences: [],
    explanation: "表示公司长期生产某类产品时，用「作っています」。"
  },
  {
    id: "ex-i-6-1",
    groupId: "i-6",
    groupTitle: "练习 I · 6",
    category: "听力会话",
    instruction: "听录音，仿照例句替换画线部分练习会话。",
    example: "例：__葉子さん__ / __李さん__ / __大学に通います__ → 甲：あのう、__葉子さん__でしょう？ 乙：あっ、__李さん__、しばらくですね。甲：本当に、お元気ですか。乙：ええ。去年からこの近くの__大学に通っています__。",
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
    id: "ex-i-6-2",
    groupId: "i-6",
    groupTitle: "练习 I · 6",
    category: "听力会话",
    instruction: "听录音，仿照例句替换画线部分练习会话。",
    example: "例：__葉子さん__ / __李さん__ / __大学に通います__ → 甲：あのう、__葉子さん__でしょう？ 乙：あっ、__李さん__、しばらくですね。甲：本当に、お元気ですか。乙：ええ。去年からこの近くの__大学に通っています__。",
    type: "listening",
    audioRequired: true,
    hasAnswer: false,
    question: "田中さん / 張さん / マンションに住みます",
    answer: "",
    referenceAnswers: [],
    relatedGrammar: ["g3", "g4"],
    relatedSentences: [],
    explanation: "本题需要教材录音。当前未提供录音，暂不判分。"
  },
  {
    id: "ex-i-6-3",
    groupId: "i-6",
    groupTitle: "练习 I · 6",
    category: "听力会话",
    instruction: "听录音，仿照例句替换画线部分练习会话。",
    example: "例：__葉子さん__ / __李さん__ / __大学に通います__ → 甲：あのう、__葉子さん__でしょう？ 乙：あっ、__李さん__、しばらくですね。甲：本当に、お元気ですか。乙：ええ。去年からこの近くの__大学に通っています__。",
    type: "listening",
    audioRequired: true,
    hasAnswer: false,
    question: "陳さん / 田村さん / 会社で働きます",
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
    example: "例：__テレビを見ます__ / 晩ご飯を食べます → __テレビを見ながら__、晩ご飯を食べています。",
    type: "fill",
    question: "タバコを吸います / テレビを見ます",
    answer: "タバコを吸いながら、テレビを見ています。",
    referenceAnswers: ["タバコを吸いながら、テレビを見ています。"],
    relatedGrammar: ["g2", "g4"],
    relatedSentences: [],
    explanation: "「吸います」去掉「ます」接「ながら」。"
  },
  {
    id: "ex-ii-1-2",
    groupId: "ii-1",
    groupTitle: "练习 II · 1",
    category: "看图造句",
    instruction: "看图，仿照例句造句。",
    example: "例：__テレビを見ます__ / 晩ご飯を食べます → __テレビを見ながら__、晩ご飯を食べています。",
    type: "fill",
    question: "歌を歌います / 公園を散歩します",
    answer: "歌を歌いながら、公園を散歩しています。",
    referenceAnswers: ["歌を歌いながら、公園を散歩しています。"],
    relatedGrammar: ["g2", "g4"],
    relatedSentences: [],
    explanation: "「歌います」去掉「ます」接「ながら」。"
  },
  {
    id: "ex-ii-1-3",
    groupId: "ii-1",
    groupTitle: "练习 II · 1",
    category: "看图造句",
    instruction: "看图，仿照例句造句。",
    example: "例：__テレビを見ます__ / 晩ご飯を食べます → __テレビを見ながら__、晩ご飯を食べています。",
    type: "fill",
    question: "お茶を飲みます / 音楽を聞きます",
    answer: "お茶を飲みながら、音楽を聞いています。",
    referenceAnswers: ["お茶を飲みながら、音楽を聞いています。"],
    relatedGrammar: ["g2", "g4"],
    relatedSentences: [],
    explanation: "「飲みながら」表示一边喝茶，一边听音乐。"
  },
  {
    id: "ex-ii-1-4",
    groupId: "ii-1",
    groupTitle: "练习 II · 1",
    category: "看图造句",
    instruction: "看图，仿照例句造句。",
    example: "例：__テレビを見ます__ / 晩ご飯を食べます → __テレビを見ながら__、晩ご飯を食べています。",
    type: "fill",
    question: "笑います / アルバムを見ます",
    answer: "笑いながら、アルバムを見ています。",
    referenceAnswers: ["笑いながら、アルバムを見ています。"],
    relatedGrammar: ["g2", "g4"],
    relatedSentences: [],
    explanation: "「笑います」去掉「ます」接「ながら」。"
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
    choices: ["食堂", "携帯電話", "はし", "はさみ", "クレジットカード", "郵便局"],
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
    choices: ["食堂", "携帯電話", "はし", "はさみ", "クレジットカード", "郵便局"],
    answer: "クレジットカード",
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "购物时使用的物品是「クレジットカード」。"
  },
  {
    id: "ex-ii-2-3",
    groupId: "ii-2",
    groupTitle: "练习 II · 2",
    category: "选词填空",
    instruction: "从词库中选择适当的词语填入括号中。",
    example: "ご飯を食べる時に使う物です。（はし）",
    type: "choice",
    question: "話したりメールを送ったりする時に使う物です。",
    choices: ["食堂", "携帯電話", "はし", "はさみ", "クレジットカード", "郵便局"],
    answer: "携帯電話",
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "打电话或发邮件时使用的物品是「携帯電話」。"
  },
  {
    id: "ex-ii-2-4",
    groupId: "ii-2",
    groupTitle: "练习 II · 2",
    category: "选词填空",
    instruction: "从词库中选择适当的词语填入括号中。",
    example: "ご飯を食べる時に使う物です。（はし）",
    type: "choice",
    question: "ご飯を食べる時に行く所です。",
    choices: ["食堂", "携帯電話", "はし", "はさみ", "クレジットカード", "郵便局"],
    answer: "食堂",
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "吃饭时去的地方是「食堂」。"
  },
  {
    id: "ex-ii-2-5",
    groupId: "ii-2",
    groupTitle: "练习 II · 2",
    category: "选词填空",
    instruction: "从词库中选择适当的词语填入括号中。",
    example: "ご飯を食べる時に使う物です。（はし）",
    type: "choice",
    question: "切手を買ったり荷物を送ったりする時に行く所です。",
    choices: ["食堂", "携帯電話", "はし", "はさみ", "クレジットカード", "郵便局"],
    answer: "郵便局",
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "买邮票或寄包裹时去的地方是「郵便局」。"
  },
  {
    id: "ex-ii-3-1",
    groupId: "ii-3",
    groupTitle: "练习 II · 3",
    category: "变形完成句子",
    instruction: "将括号中的词语变成适当的形式，完成句子。",
    example: "__疲れます__ → __疲れた時__、ゆっくりお風呂に入ります。",
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
    example: "__疲れます__ → __疲れた時__、ゆっくりお風呂に入ります。",
    type: "fill",
    question: "あなたが（好きです→）音楽は何ですか。",
    answer: "あなたが好きな音楽は何ですか。",
    referenceAnswers: ["あなたが好きな音楽は何ですか。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "二类形容词「好き」修饰名词时用「好きな」。"
  },
  {
    id: "ex-ii-3-3",
    groupId: "ii-3",
    groupTitle: "练习 II · 3",
    category: "变形完成句子",
    instruction: "将括号中的词语变成适当的形式，完成句子。",
    example: "__疲れます__ → __疲れた時__、ゆっくりお風呂に入ります。",
    type: "fill",
    question: "吉田さんは昨日（来ませんでした→）でしょう？",
    answer: "吉田さんは昨日来なかったでしょう？",
    referenceAnswers: ["吉田さんは昨日来なかったでしょう？"],
    relatedGrammar: ["g3"],
    relatedSentences: [],
    explanation: "「来ませんでした」的普通形过去否定是「来なかった」。"
  },
  {
    id: "ex-ii-3-4",
    groupId: "ii-3",
    groupTitle: "练习 II · 3",
    category: "变形完成句子",
    instruction: "将括号中的词语变成适当的形式，完成句子。",
    example: "__疲れます__ → __疲れた時__、ゆっくりお風呂に入ります。",
    type: "fill",
    question: "李さんは歌を（歌います→）ながら、掃除しています。",
    answer: "李さんは歌を歌いながら、掃除しています。",
    referenceAnswers: ["李さんは歌を歌いながら、掃除しています。"],
    relatedGrammar: ["g2"],
    relatedSentences: ["s16"],
    explanation: "「歌います」去掉「ます」接「ながら」，变为「歌いながら」。"
  },
  {
    id: "ex-ii-3-5",
    groupId: "ii-3",
    groupTitle: "练习 II · 3",
    category: "变形完成句子",
    instruction: "将括号中的词语变成适当的形式，完成句子。",
    example: "__疲れます__ → __疲れた時__、ゆっくりお風呂に入ります。",
    type: "fill",
    question: "あの店は日曜日は（休みです→）かもしれません。",
    answer: "あの店は日曜日は休みかもしれません。",
    referenceAnswers: ["あの店は日曜日は休みかもしれません。"],
    relatedGrammar: ["g1"],
    relatedSentences: [],
    explanation: "名词或二类形容词接「かもしれません」时不加「です」。"
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

const lessonCatalogMetadata = {
  25: "これは明日会議で使う資料です",
  26: "自転車に2人で乗るのは危ないです",
  27: "子供の時、大きな地震がありました",
  28: "馬さんはわたしに地図をくれました",
  29: "電気を消せ",
  30: "もう11時だから寝よう",
  31: "このボタンを押すと，電源が入ります",
  32: "今度の日曜日に遊園地へ行くつもりです",
  33: "電車が急に止まりました",
  34: "壁にカレンダーが掛けてあります",
  35: "明日雨が降ったら，マラソン大会は中止です",
  36: "遅くなって，すみません",
  37: "優勝すれば，オリンピックに出場することができます",
  38: "戴さんは英語が話せます",
  39: "眼鏡をかけて本を読みます",
  40: "これから友達と食事に行くところです",
  41: "李さんは部長にほめられました",
  42: "テレビをつけたまま，出かけてしまいました",
  43: "陳さんは，息子をアメリカに留学させます",
  44: "玄関のところにだれかいるようです",
  45: "少子化が進んで，日本の人口はだんだん減っていくでしょう",
  46: "これは柔らかくて，まるで本物の毛皮のようです",
  47: "周先生は明日日本へ行かれます",
  48: "お荷物は私がお持ちします"
};

const lessonCatalog = Array.from({ length: 48 }, (_, index) => {
  const id = index + 1;
  const runtimeReady = id === 27;
  return {
    id,
    title: `第${id}课`,
    subtitle: lessonCatalogMetadata[id] || "待初始化",
    status: runtimeReady ? "ready" : "pending",
    description: runtimeReady
      ? "围绕第 27 课完成单词、语法、课文朗读、标准练习和结果复盘。"
      : "课程内容尚未采集，后续可继续按同一结构初始化。",
    runtimeReady
  };
});

let textStructure = [
  {
    id: "basic",
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
    id: "application",
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
const bundledLessonRuntime = JSON.parse(JSON.stringify({ lesson, textStructure }));
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

// ============ OSS (Alibaba Cloud Object Storage) CONFIGURATION ============
// In web mode, fetched from the server. In native mode, read from window.JAPAFLOW_CONFIG.
let ossEnabled = false;
let ossBaseUrl = "";

function embeddedOssConfig() {
  const config = window.JAPAFLOW_CONFIG || {};
  return {
    enabled: Boolean(config.OSS_ENABLED),
    baseUrl: config.OSS_BASE_URL || ""
  };
}

function applyOssConfig(config) {
  ossEnabled = Boolean(config.enabled);
  ossBaseUrl = config.baseUrl || "";
}

async function fetchFrontendConfig() {
  const embedded = embeddedOssConfig();
  if (IS_NATIVE_APP) {
    applyOssConfig(embedded);
    return;
  }
  try {
    const response = await fetch("/api/frontend-config");
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || "Failed to fetch frontend config");
    const apiConfig = {
      enabled: Boolean(data.ossEnabled),
      baseUrl: data.ossBaseUrl || ""
    };
    applyOssConfig(embedded.enabled && embedded.baseUrl ? embedded : apiConfig);
  } catch (e) {
    console.error("fetchFrontendConfig failed:", e.message);
    applyOssConfig(embedded);
  }
}

const state = {
  wordProgress: initialWordProgress(),
  wordLearning: initialWordLearning(),
  exerciseResults: read(`lesson:${lesson.id}:exerciseResults`, []),
  exerciseGroupAnswers: read(`lesson:${lesson.id}:exerciseGroupAnswers`, {}),
  exerciseGroupSubmitted: read(`lesson:${lesson.id}:exerciseGroupSubmitted`, {}),
  wrongBook: read(`lesson:${lesson.id}:wrongBook`, {}),
  wrongPractice: { current: 0, answer: "", submitted: false, result: null },
  interactionProgress: initialInteractionProgress(),
  grammarPractice: initialGrammarPractice(),
  currentVoiceId: read(`lesson:${lesson.id}:currentVoiceId`, defaultVoiceId),
  audioStatus: null,
  audioStatusVoiceId: "",
  audioBusy: "",
  audioMessage: "",
  lessonCatalogStatus: null,
  lessonCatalogLoading: false,
  lessonCatalogMessage: "",
  initStatus: null,
  initStatusLessonId: "",
  initStatusVoiceId: "",
  initStatusLoading: false,
  initImportJson: "",
  initBusy: "",
  initMessage: "",
  currentWord: 0,
  currentSentence: 0,
  currentGrammar: 0,
  currentExercise: 0,
  currentExerciseGroup: read(`lesson:${lesson.id}:currentExerciseGroup`, 0),
  vocabPhase: "pronunciation",
  vocabFocusOnly: read(`lesson:${lesson.id}:vocabFocusOnly`, false),
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
  textCurrentTab: read(`lesson:${lesson.id}:textCurrentTab`, "basic"),
  textCurrentSentenceByTab: read(`lesson:${lesson.id}:textCurrentSentenceByTab`, { basic: 0, application: 0 }),
  textPromptLanguage: read(`lesson:${lesson.id}:textPromptLanguage`, "zh"),
  textRecordingPreparingId: "",
  textRecordingId: "",
  textRecordingStoppingId: "",
  textRecordingError: "",
  favoriteRecordingPreparingKey: "",
  favoriteRecordingKey: "",
  favoriteRecordingStoppingKey: "",
  favoriteRecordingErrorKey: "",
  favoriteRecordingError: "",
  favoriteRecordingResults: {},
  sentencePractice: initialSentencePractice(),
  playbackRate: Number(read(`lesson:${lesson.id}:playbackRate`, 1)) || 1,
  answer: "",
  submitted: false,
  modal: null
};

const app = document.querySelector("#app");

// ============ ADMIN MODE SWITCH ============
// 管理端能力（课程初始化、音频生成等）仅当 URL 带 ?admin=1 或 sessionStorage 标记时启用。
// 默认（学员端）：隐藏所有管理入口，并阻止访问 /init、/audio 路由。
const ADMIN_ROUTES = new Set(["init", "audio"]);
const ADMIN_NAV_PATTERN = /\/(init|audio)(\/|$|\?)/;
const ADMIN_MODE = (() => {
  try {
    const params = new URLSearchParams(location.search);
    if (params.has("admin")) {
      const enabled = params.get("admin") !== "0";
      sessionStorage.setItem("japaflow:adminMode", enabled ? "1" : "0");
      return enabled;
    }
    return sessionStorage.getItem("japaflow:adminMode") === "1";
  } catch (error) {
    return false;
  }
})();
if (ADMIN_MODE) document.body.classList.add("admin-mode");

// 运行时环境检测：Capacitor 原生壳里 isNativePlatform() 返回 true。
const IS_NATIVE_APP = typeof window !== "undefined" && Boolean(window.Capacitor?.isNativePlatform?.());
// ============================================

// ============ PRONUNCIATION EVALUATION (DUAL MODE) ============
// Web 模式：POST 到本地 server 的 /api/pronunciation/evaluate（密钥在服务端）。
// App 模式：直接调 Azure REST 端点，密钥从打包期注入的 window.JAPAFLOW_CONFIG 读取。
// 调用方传入 FormData（字段：referenceText / wordId / audio），返回评分对象。
async function evaluatePronunciation(form) {
  if (IS_NATIVE_APP) return evaluatePronunciationViaAzure(form);
  const response = await fetch("/api/pronunciation/evaluate", { method: "POST", body: form });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || "发音评价失败");
  return data;
}

async function evaluatePronunciationViaAzure(form) {
  const config = window.JAPAFLOW_CONFIG || {};
  const key = config.AZURE_SPEECH_KEY;
  const region = String(config.AZURE_SPEECH_REGION || "").trim().toLowerCase().replace(/\s+/g, "");
  if (!key || !region) throw new Error("App 缺少 Azure 配置（JAPAFLOW_CONFIG.AZURE_SPEECH_KEY/REGION）。");
  const referenceText = form.get("referenceText") || "";
  if (!referenceText) throw new Error("Missing referenceText.");
  const audioPart = form.get("audio");
  const audioBuffer = audioPart instanceof Blob ? await audioPart.arrayBuffer() : audioPart;
  if (!audioBuffer || !audioBuffer.byteLength) throw new Error("Missing audio data.");
  const assessment = btoa(JSON.stringify({
    ReferenceText: referenceText,
    GradingSystem: "HundredMark",
    Granularity: "Phoneme",
    Dimension: "Comprehensive",
    EnableMiscue: true
  }));
  const endpoint = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=ja-JP`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
      "Accept": "application/json",
      "Pronunciation-Assessment": assessment
    },
    body: audioBuffer
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Azure Speech HTTP ${response.status}: ${text}`);
  const raw = JSON.parse(text);
  const best = raw.NBest?.[0] || {};
  const pa = best.PronunciationAssessment || best;
  const scores = {
    pronunciationScore: Math.round(pa.PronScore ?? 0),
    accuracyScore: Math.round(pa.AccuracyScore ?? 0),
    fluencyScore: Math.round(pa.FluencyScore ?? 0),
    completenessScore: Math.round(pa.CompletenessScore ?? 0)
  };
  const reasons = [];
  if (scores.accuracyScore < 75) reasons.push("发音不标准");
  if (scores.fluencyScore < 70) reasons.push("流畅度不足");
  if (scores.completenessScore < 80) reasons.push("发音不完整");
  return {
    wordId: form.get("wordId") || "",
    referenceText,
    passed: scores.pronunciationScore >= 75 && scores.accuracyScore >= 75 && scores.fluencyScore >= 70 && scores.completenessScore >= 80,
    ...scores,
    recognizedText: raw.DisplayText || "",
    reasons,
    raw
  };
}
// ===============================================================

let lastAutoSpokenSentence = null;
let lastAutoSpokenWord = null;
let pendingAutoSpeakWordId = "";
let autoWordPlaybackToken = 0;
let speechPrimed = false;
let lastHoverSpeech = { text: "", at: 0 };
let lastKeyAction = { key: "", at: 0 };
let activeAudio = null;
let audioPlaybackToken = 0;
const silentPrerollUrls = new Map();
let currentSpeechText = "";
let currentSpeechOnEnded = null;
let selectionLookupToken = 0;
let recordingSession = null;
let recordingPressWordId = "";
let recordingReleaseRequested = false;
let recordingPointerId = null;
let vocabTestAdvanceTimer = null;
let audioVersions = read(`lesson:${lesson.id}:audioVersions`, {});
let runtimeLessonLoadingId = "";
let runtimeLessonErrorId = "";
let runtimeLessonError = "";
const studyModules = ["vocab", "grammar", "text", "exercises", "wrongbook", "favorites"];
const studyTimeIdleMs = 60000;
let studySession = null;
let studyIdleTimer = null;

function parseMarkdown(text) {
  if (!text) return "";
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3>$1</h3>")
    .replace(/^# (.+)$/gm, "<h2>$1</h2>")
    .replace(/^---$/gm, "<hr>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n/g, "<br>");
}

// ============ API SYNC LAYER ============

const API_BASE = "/api/japaflow";
let authPromptShown = false;
let suppressApiSync = false;
const syncTimers = {};
const SYNC_DEBOUNCE_MS = 2000;

function getAuthToken() {
  return localStorage.getItem("light_blog_token") || "";
}

function isLoggedIn() {
  return Boolean(getAuthToken());
}

function getStoredUsername() {
  try {
    const raw = localStorage.getItem("light_blog_user");
    if (!raw) return "";
    return JSON.parse(raw).username || "";
  } catch { return ""; }
}

function hasSkippedAuth() {
  return sessionStorage.getItem("japaflow:skipAuth") === "1";
}

function shouldSync() {
  return isLoggedIn() && !hasSkippedAuth();
}

async function apiRequest(method, path, body = null) {
  const headers = { Authorization: `Bearer ${getAuthToken()}` };
  if (body !== null) headers["Content-Type"] = "application/json";
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== null ? JSON.stringify(body) : undefined
    });
    if (res.status === 401) {
      handleAuthExpired();
      return null;
    }
    if (!res.ok) {
      console.warn(`[API] ${method} ${path} → ${res.status}`);
      return null;
    }
    const json = await res.json();
    return (json.code === 0 || json.code === 200) ? json.data : null;
  } catch (err) {
    console.warn(`[API] ${method} ${path} failed:`, err.message);
    return null;
  }
}

function handleAuthExpired() {
  localStorage.removeItem("light_blog_token");
  localStorage.removeItem("light_blog_user");
  if (authPromptShown || hasSkippedAuth()) return;
  authPromptShown = true;
  state.modal = { type: "authPrompt" };
  render();
}

function apiFetchAllProgress() {
  return apiRequest("GET", "/progress/export");
}

function apiUploadAllProgress(lessons) {
  return apiRequest("POST", "/progress/import", { lessons });
}

function apiSyncWordLearning(lessonId, wordId, data) {
  return apiRequest("PUT", `/lessons/${lessonId}/words/${wordId}`, data);
}

function apiSyncResetWords(lessonId) {
  return apiRequest("DELETE", `/lessons/${lessonId}/words`);
}

function apiSyncGrammarPractice(lessonId, grammarId, exampleIndex, data) {
  return apiRequest("PUT", `/lessons/${lessonId}/grammar/${grammarId}/${exampleIndex}`, data);
}

function apiSyncSentencePractice(lessonId, sentenceId, data) {
  return apiRequest("PUT", `/lessons/${lessonId}/sentences/${sentenceId}`, data);
}

function apiSyncExerciseResult(lessonId, exerciseId, data) {
  return apiRequest("POST", `/lessons/${lessonId}/exercises/${exerciseId}`, data);
}

function apiSyncWrongBook(lessonId, itemType, itemId, data) {
  return apiRequest("POST", `/lessons/${lessonId}/wrong-book`, { itemType, itemId, ...data });
}

function apiSyncResolveWrongItem(lessonId, itemType, itemId) {
  return apiRequest("PUT", `/lessons/${lessonId}/wrong-book/${itemType}/${itemId}/resolve`);
}

function apiSyncInteractionProgress(lessonId, itemType, itemId, data) {
  return apiRequest("PUT", `/lessons/${lessonId}/interaction-progress/${itemType}/${itemId}`, data);
}

function apiSyncStudyTime(lessonId, module, deltaMs, activeAt) {
  return apiRequest("POST", `/lessons/${lessonId}/study-time/${module}`, { deltaMs, activeAt });
}

function apiSyncAddFavorite(lessonId, itemType, itemId, snapshot) {
  return apiRequest("POST", `/lessons/${lessonId}/favorites`, { itemType, itemId, snapshot });
}

function apiSyncRemoveFavorite(lessonId, itemType, itemId) {
  return apiRequest("DELETE", `/lessons/${lessonId}/favorites/${itemType}/${itemId}`);
}

function apiSyncPreference(lessonId, data) {
  return apiRequest("PUT", `/lessons/${lessonId}/preferences`, data);
}

function scheduleApiSync(key, value) {
  if (suppressApiSync) return;
  if (!shouldSync()) return;
  clearTimeout(syncTimers[key]);
  syncTimers[key] = setTimeout(() => dispatchSync(key, value), SYNC_DEBOUNCE_MS);
}

function dispatchSync(key, value) {
  const m = key.match(/^lesson:(\d+):(.+)$/);
  if (!m) return;
  const [, lessonId, dataKey] = m;

  switch (dataKey) {
    case "wordLearning":
      Object.entries(value || {}).forEach(([wordId, data]) => {
        apiSyncWordLearning(lessonId, wordId, data);
      });
      break;

    case "grammarPractice":
      Object.entries(value || {}).forEach(([compositeKey, data]) => {
        const sepIdx = compositeKey.indexOf(":");
        const grammarId = sepIdx > 0 ? compositeKey.slice(0, sepIdx) : compositeKey;
        const exIdx = sepIdx > 0 ? compositeKey.slice(sepIdx + 1) : "0";
        apiSyncGrammarPractice(lessonId, grammarId, exIdx, data);
      });
      break;

    case "sentencePractice":
      Object.entries(value || {}).forEach(([sentenceId, data]) => {
        apiSyncSentencePractice(lessonId, sentenceId, data);
      });
      break;

    case "exerciseResults":
      (value || []).forEach((result) => {
        apiSyncExerciseResult(lessonId, result.exerciseId, result);
      });
      break;

    case "wrongBook":
      Object.entries(value || {}).forEach(([exerciseId, data]) => {
        if (data.status === "resolved") {
          apiSyncResolveWrongItem(lessonId, "exercise", exerciseId);
        } else {
          apiSyncWrongBook(lessonId, "exercise", exerciseId, { wrongDetail: data });
        }
      });
      break;

    case "interactionProgress":
      ["words", "sentences", "grammarExamples"].forEach((type) => {
        const singularType = type === "grammarExamples" ? "grammarExample" : type.replace(/s$/, "");
        Object.entries(value?.[type] || {}).forEach(([itemId, data]) => {
          apiSyncInteractionProgress(lessonId, singularType, itemId, data);
        });
      });
      break;

    case "currentVoiceId":
      apiSyncPreference(lessonId, { currentVoiceId: value });
      break;
    case "playbackRate":
      apiSyncPreference(lessonId, { playbackRate: value });
      break;
    case "vocabFocusOnly":
      apiSyncPreference(lessonId, { vocabFocusOnly: value });
      break;
    case "currentExerciseGroup":
      apiSyncPreference(lessonId, { currentExerciseGroup: value });
      break;
    case "textCurrentTab":
      apiSyncPreference(lessonId, { textCurrentTab: value });
      break;

    case "wordProgress":
    case "exerciseGroupAnswers":
    case "exerciseGroupSubmitted":
    case "vocabTestQueue":
    case "currentVocabTest":
    case "textCurrentSentenceByTab":
    case "textPromptLanguage":
    case "audioVersions":
    case "favorites":
    case "studyTime":
      break;

    default:
      break;
  }
}

// ============ END API SYNC LAYER ============

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(`japaflow:${key}`)) || fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(`japaflow:${key}`, JSON.stringify(value));
  scheduleApiSync(key, value);
}

function removeStored(key) {
  localStorage.removeItem(`japaflow:${key}`);
}

function studyTimeStorageKey(lessonIdValue) {
  return `lesson:${lessonIdValue}:studyTime`;
}

function emptyStudyTime() {
  return Object.fromEntries(studyModules.map((module) => [module, { totalMs: 0, lastStartedAt: "", lastActiveAt: "" }]));
}

function normalizeStudyTime(value) {
  const fallback = emptyStudyTime();
  const source = value && typeof value === "object" ? value : {};
  return Object.fromEntries(studyModules.map((module) => {
    const item = source[module] || {};
    return [module, {
      totalMs: Math.max(0, Number(item.totalMs || 0)),
      lastStartedAt: item.lastStartedAt || "",
      lastActiveAt: item.lastActiveAt || ""
    }];
  }));
}

function readStudyTime(lessonIdValue) {
  return normalizeStudyTime(read(studyTimeStorageKey(lessonIdValue), emptyStudyTime()));
}

function writeStudyTime(lessonIdValue, value) {
  write(studyTimeStorageKey(lessonIdValue), normalizeStudyTime(value));
}

function currentStudyContext() {
  const currentRoute = route();
  if (!currentRoute.lessonId || !studyModules.includes(currentRoute.page)) return null;
  return { lessonId: String(currentRoute.lessonId), module: currentRoute.page };
}

function sameStudyContext(a, b) {
  return Boolean(a && b && a.lessonId === b.lessonId && a.module === b.module);
}

function activeStudyElapsed(lessonIdValue, module) {
  if (!studySession || studySession.lessonId !== String(lessonIdValue) || studySession.module !== module) return 0;
  return Math.max(0, Date.now() - studySession.startedAt);
}

function studyTimeMs(lessonIdValue, module) {
  const stored = readStudyTime(lessonIdValue)[module]?.totalMs || 0;
  return stored + activeStudyElapsed(lessonIdValue, module);
}

function studyTimeMinutes(lessonIdValue, module) {
  return Math.round(studyTimeMs(lessonIdValue, module) / 60000);
}

function studyTimeBadge(module, lessonIdValue = lesson.id) {
  return `<div class="study-time-badge" aria-label="练习时长 ${studyTimeMinutes(lessonIdValue, module)} 分钟">练习时长 ${studyTimeMinutes(lessonIdValue, module)} 分钟</div>`;
}

function studyModuleLabel(module) {
  return { vocab: "单词", grammar: "语法", text: "课文", exercises: "练习", wrongbook: "错题", favorites: "收藏" }[module] || module;
}

function settleStudyTimer(reason = "settle") {
  if (!studySession) return;
  const now = Date.now();
  const endAt = now - studySession.lastActiveAt > studyTimeIdleMs ? studySession.lastActiveAt : now;
  const elapsed = Math.max(0, endAt - studySession.startedAt);
  const data = readStudyTime(studySession.lessonId);
  data[studySession.module] = {
    ...(data[studySession.module] || { totalMs: 0 }),
    totalMs: Math.max(0, Number(data[studySession.module]?.totalMs || 0)) + elapsed,
    lastStartedAt: new Date(studySession.startedAt).toISOString(),
    lastActiveAt: new Date(studySession.lastActiveAt).toISOString()
  };
  writeStudyTime(studySession.lessonId, data);
  if (shouldSync()) {
    apiSyncStudyTime(studySession.lessonId, studySession.module, elapsed, new Date(studySession.lastActiveAt).toISOString());
  }
  studySession = null;
  if (studyIdleTimer) window.clearTimeout(studyIdleTimer);
  studyIdleTimer = null;
}

function scheduleStudyIdleCheck() {
  if (studyIdleTimer) window.clearTimeout(studyIdleTimer);
  if (!studySession) return;
  studyIdleTimer = window.setTimeout(() => {
    if (!studySession) return;
    if (Date.now() - studySession.lastActiveAt >= studyTimeIdleMs) settleStudyTimer("idle");
    else scheduleStudyIdleCheck();
  }, studyTimeIdleMs + 200);
}

function syncStudyTimerWithRoute() {
  const context = currentStudyContext();
  if (studySession && !sameStudyContext(studySession, context)) settleStudyTimer("route-change");
}

function trackStudyActivity(event) {
  const context = currentStudyContext();
  if (!context) return;
  const target = event?.target;
  if (target?.closest?.("[data-nav], [data-link], [data-export-progress], [data-import-progress-trigger], [data-import-progress-file], .playback-rate, .manage-menu")) return;
  const now = Date.now();
  if (!studySession || !sameStudyContext(studySession, context)) {
    if (studySession) settleStudyTimer("activity-context-change");
    studySession = { ...context, startedAt: now, lastActiveAt: now };
  } else {
    studySession.lastActiveAt = now;
  }
  scheduleStudyIdleCheck();
}

function downloadJsonBlob(payload, filename) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function exportLearningData() {
  if (shouldSync()) {
    const data = await apiFetchAllProgress();
    if (!data) { window.alert("导出失败，请重试。"); return; }
    downloadJsonBlob({
      app: "JapaFlow", type: "learning-progress", version: 2,
      exportedAt: new Date().toISOString(),
      lessons: data.lessons
    }, `japaflow-progress-${new Date().toISOString().slice(0, 10)}.json`);
    return;
  }
  const entries = {};
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith("japaflow:")) continue;
    entries[key] = localStorage.getItem(key);
  }
  downloadJsonBlob({
    app: "JapaFlow", type: "learning-progress", version: 1,
    exportedAt: new Date().toISOString(), entries
  }, `japaflow-progress-${new Date().toISOString().slice(0, 10)}.json`);
}

async function importLearningData(file) {
  if (!file) return;
  const text = await file.text();
  const payload = JSON.parse(text);

  if (shouldSync() && payload?.version === 2 && payload?.lessons) {
    const ok = window.confirm("确定导入学习数据吗？将覆盖云端已有数据。");
    if (!ok) return;
    const result = await apiUploadAllProgress(payload.lessons);
    if (!result) { window.alert("导入失败，请重试。"); return; }
    clearLocalLearningData();
    await pullServerData();
    window.alert("学习数据已导入，页面将刷新。");
    location.reload();
    return;
  }

  const entries = payload?.entries;
  if (payload?.app !== "JapaFlow" || payload?.type !== "learning-progress" || !entries || typeof entries !== "object") {
    throw new Error("这不是有效的 JapaFlow 学习数据文件。");
  }
  const count = Object.keys(entries).filter((key) => key.startsWith("japaflow:")).length;
  if (!count) throw new Error("导入文件里没有可用的学习数据。");

  if (shouldSync()) {
    const ok = window.confirm(`确定导入学习数据吗？共 ${count} 项，将覆盖云端已有数据。`);
    if (!ok) return;
    const lessons = collectLocalProgressFromEntries(entries);
    const result = await apiUploadAllProgress(lessons);
    if (!result) { window.alert("导入失败，请重试。"); return; }
    clearLocalLearningData();
    await pullServerData();
    window.alert("学习数据已导入，页面将刷新。");
    location.reload();
    return;
  }

  const ok = window.confirm(`导入会覆盖本机已有学习数据，共 ${count} 项。确定继续吗？`);
  if (!ok) return;
  const existingKeys = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith("japaflow:")) existingKeys.push(key);
  }
  existingKeys.forEach((key) => localStorage.removeItem(key));
  Object.entries(entries).forEach(([key, value]) => {
    if (!key.startsWith("japaflow:")) return;
    localStorage.setItem(key, String(value));
  });
  window.alert("学习数据已导入，页面将刷新。");
  location.reload();
}

// ============ DATA MIGRATION HELPERS ============

function hasLocalLearningData() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("japaflow:lesson:") && !key.endsWith(":studyTime")) return true;
  }
  return false;
}

function clearLocalLearningData() {
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("japaflow:lesson:")) toRemove.push(key);
  }
  toRemove.forEach((key) => localStorage.removeItem(key));
}

function collectLocalProgressFromEntries(entries) {
  const lessons = {};
  Object.entries(entries).forEach(([key, value]) => {
    const m = key.match(/^japaflow:lesson:(\d+):(.+)$/);
    if (!m) return;
    const [, lessonId, dataKey] = m;
    if (!lessons[lessonId]) lessons[lessonId] = {};
    try {
      lessons[lessonId][dataKey] = typeof value === "string" ? JSON.parse(value) : value;
    } catch { /* skip */ }
  });
  return lessons;
}

function collectLocalProgressForUpload() {
  const entries = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("japaflow:")) entries[key] = localStorage.getItem(key);
  }
  return collectLocalProgressFromEntries(entries);
}

async function pullServerData() {
  const data = await apiFetchAllProgress();
  if (!data?.lessons) return;
  suppressApiSync = true;
  try {
    Object.entries(data.lessons).forEach(([lessonId, ld]) => {
      if (ld.wordLearning) write(`lesson:${lessonId}:wordLearning`, ld.wordLearning);
      if (ld.grammarPractice) write(`lesson:${lessonId}:grammarPractice`, ld.grammarPractice);
      if (ld.sentencePractice) write(`lesson:${lessonId}:sentencePractice`, ld.sentencePractice);
      if (ld.exerciseResults) write(`lesson:${lessonId}:exerciseResults`, ld.exerciseResults);
      if (ld.wrongBook) write(`lesson:${lessonId}:wrongBook`, ld.wrongBook);
      if (ld.interactionProgress) write(`lesson:${lessonId}:interactionProgress`, ld.interactionProgress);
      if (ld.studyTime) write(`lesson:${lessonId}:studyTime`, ld.studyTime);
      if (ld.favorites) write(`lesson:${lessonId}:favorites`, ld.favorites);
      if (ld.preferences) {
        const p = ld.preferences;
        if (p.currentVoiceId) write(`lesson:${lessonId}:currentVoiceId`, p.currentVoiceId);
        if (p.playbackRate != null) write(`lesson:${lessonId}:playbackRate`, p.playbackRate);
        if (p.vocabFocusOnly != null) write(`lesson:${lessonId}:vocabFocusOnly`, p.vocabFocusOnly);
        if (p.currentExerciseGroup != null) write(`lesson:${lessonId}:currentExerciseGroup`, p.currentExerciseGroup);
        if (p.textCurrentTab) write(`lesson:${lessonId}:textCurrentTab`, p.textCurrentTab);
      }
    });
  } finally {
    suppressApiSync = false;
  }
}

function buildLocalDataSummary() {
  const lessonsWithData = new Set();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const m = key?.match(/^japaflow:lesson:(\d+):/);
    if (m) lessonsWithData.add(Number(m[1]));
  }
  return Array.from(lessonsWithData).sort((a, b) => a - b).map((id) => {
    const catalogItem = lessonCatalog.find((item) => item.id === id) || { id, title: `第${id}课`, counts: {} };
    const summary = catalogLessonProgressSummary(catalogItem);
    return { lessonId: id, title: catalogItem.title, subtitle: catalogItem.subtitle, summary };
  });
}

async function checkLocalDataMigration() {
  if (sessionStorage.getItem("japaflow:migrationHandled") === "1") return;
  if (!isLoggedIn()) return;
  if (!hasLocalLearningData()) {
    await pullServerData();
    return;
  }
  showMigrationPanel();
}

function showMigrationPanel() {
  const localSummary = buildLocalDataSummary();
  state.modal = { type: "migration", localSummary };
  render();
}

async function handleMigration(action) {
  if (action === "upload") {
    const lessons = collectLocalProgressForUpload();
    const result = await apiUploadAllProgress(lessons);
    if (!result) {
      window.alert("上传失败，请稍后重试。");
      return;
    }
    clearLocalLearningData();
    await pullServerData();
    window.alert("数据已同步到云端。");
  }
  if (action === "discard") {
    const ok = window.confirm("确定丢弃本地数据吗？此操作不可恢复。");
    if (!ok) return;
    clearLocalLearningData();
    await pullServerData();
  }
  sessionStorage.setItem("japaflow:migrationHandled", "1");
  state.modal = null;
  reloadLessonScopedState();
  render();
}

// ============ END DATA MIGRATION HELPERS ============

function normalizeRuntimeLesson(data) {
  const nextLesson = JSON.parse(JSON.stringify(data || {}));
  nextLesson.vocabulary = Array.isArray(nextLesson.vocabulary) ? nextLesson.vocabulary : [];
  nextLesson.sentences = Array.isArray(nextLesson.sentences) ? nextLesson.sentences : [];
  nextLesson.grammar = Array.isArray(nextLesson.grammar) ? nextLesson.grammar : [];
  nextLesson.exercises = Array.isArray(nextLesson.exercises) ? nextLesson.exercises : [];
  nextLesson.textStructure = Array.isArray(nextLesson.textStructure) ? nextLesson.textStructure : [];
  return nextLesson;
}

function applyRuntimeLesson(data) {
  const nextLesson = normalizeRuntimeLesson(data);
  lesson = nextLesson;
  textStructure = nextLesson.textStructure;
  reloadLessonScopedState();
}

function restoreBundledLesson() {
  lesson = JSON.parse(JSON.stringify(bundledLessonRuntime.lesson));
  textStructure = JSON.parse(JSON.stringify(bundledLessonRuntime.textStructure));
  reloadLessonScopedState();
}

function lessonAudioVoiceId() {
  return lesson.audioVoiceId || lesson.voiceId || defaultVoiceId;
}

function lessonCurrentVoiceId() {
  const preferred = lessonAudioVoiceId();
  const stored = read(`lesson:${lesson.id}:currentVoiceId`, "");
  if (!stored) return preferred;
  if (preferred !== defaultVoiceId && stored === defaultVoiceId) return preferred;
  return stored;
}

function reloadLessonScopedState() {
  stopCurrentAudio();
  state.wordProgress = initialWordProgress();
  state.wordLearning = initialWordLearning();
  state.exerciseResults = read(`lesson:${lesson.id}:exerciseResults`, []);
  state.exerciseGroupAnswers = read(`lesson:${lesson.id}:exerciseGroupAnswers`, {});
  state.exerciseGroupSubmitted = read(`lesson:${lesson.id}:exerciseGroupSubmitted`, {});
  state.wrongBook = read(`lesson:${lesson.id}:wrongBook`, {});
  state.wrongPractice = { current: 0, answer: "", submitted: false, result: null };
  state.interactionProgress = initialInteractionProgress();
  state.grammarPractice = initialGrammarPractice();
  state.currentVoiceId = lessonCurrentVoiceId();
  state.audioStatus = null;
  state.audioStatusVoiceId = "";
  state.audioBusy = "";
  state.audioMessage = "";
  state.currentWord = 0;
  state.currentSentence = 0;
  state.currentGrammar = 0;
  state.currentExercise = 0;
  state.currentExerciseGroup = read(`lesson:${lesson.id}:currentExerciseGroup`, 0);
  state.vocabPhase = "pronunciation";
  state.vocabFocusOnly = read(`lesson:${lesson.id}:vocabFocusOnly`, false);
  state.vocabTestQueue = read(`lesson:${lesson.id}:vocabTestQueue`, []);
  state.currentVocabTest = read(`lesson:${lesson.id}:currentVocabTest`, 0);
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
  state.textCurrentTab = read(`lesson:${lesson.id}:textCurrentTab`, textStructure[0]?.id || "basic");
  state.textCurrentSentenceByTab = read(`lesson:${lesson.id}:textCurrentSentenceByTab`, Object.fromEntries(textStructure.map((section) => [section.id, 0])));
  state.textPromptLanguage = read(`lesson:${lesson.id}:textPromptLanguage`, "zh");
  state.textRecordingPreparingId = "";
  state.textRecordingId = "";
  state.textRecordingStoppingId = "";
  state.textRecordingError = "";
  state.sentencePractice = initialSentencePractice();
  state.playbackRate = Number(read(`lesson:${lesson.id}:playbackRate`, 1)) || 1;
  state.answer = "";
  state.submitted = false;
  state.modal = null;
  audioVersions = read(`lesson:${lesson.id}:audioVersions`, {});
  lastAutoSpokenSentence = null;
  lastAutoSpokenWord = null;
  pendingAutoSpeakWordId = "";
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
    slashed: false,
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
  if (shouldSync()) apiSyncResetWords(lesson.id);
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

function defaultSentencePractice() {
  return {
    submitted: false,
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
    collapsed: false,
    updatedAt: ""
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

function initialSentencePractice() {
  const saved = read(`lesson:${lesson.id}:sentencePractice`, {});
  const fallback = Object.fromEntries(lesson.sentences.map((sentence) => [sentence.id, defaultSentencePractice()]));
  return Object.fromEntries(lesson.sentences.map((sentence) => [
    sentence.id,
    { ...fallback[sentence.id], ...(saved[sentence.id] || {}) }
  ]));
}

function writeSentencePractice() {
  write(`lesson:${lesson.id}:sentencePractice`, state.sentencePractice);
}

function writeTextProgress() {
  write(`lesson:${lesson.id}:textCurrentTab`, state.textCurrentTab);
  write(`lesson:${lesson.id}:textCurrentSentenceByTab`, state.textCurrentSentenceByTab);
  write(`lesson:${lesson.id}:textPromptLanguage`, state.textPromptLanguage);
}

function sentencePracticeState(sentenceId) {
  return state.sentencePractice[sentenceId] || defaultSentencePractice();
}

function updateSentencePractice(sentenceId, patch) {
  const current = sentencePracticeState(sentenceId);
  state.sentencePractice = {
    ...state.sentencePractice,
    [sentenceId]: {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString()
    }
  };
  writeSentencePractice();
}

function resetSentencePractice(sentenceId) {
  state.sentencePractice = { ...state.sentencePractice, [sentenceId]: defaultSentencePractice() };
  writeSentencePractice();
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

function resetTextLearningData() {
  stopCurrentAudio();
  removeStored(`lesson:${lesson.id}:sentencePractice`);
  state.sentencePractice = Object.fromEntries(lesson.sentences.map((sentence) => [sentence.id, defaultSentencePractice()]));
  const progress = initialInteractionProgress();
  state.interactionProgress = { ...progress, sentences: {} };
  writeInteractionProgress();
  state.textCurrentTab = "basic";
  state.textCurrentSentenceByTab = { basic: 0, application: 0 };
  state.textPromptLanguage = "zh";
  writeTextProgress();
  state.currentSentence = 0;
  state.textRecordingPreparingId = "";
  state.textRecordingId = "";
  state.textRecordingStoppingId = "";
  state.textRecordingError = "";
  lastAutoSpokenSentence = null;
  render();
}

function navigate(path) {
  history.pushState({}, "", lessonPath(path));
  render();
}

function route() {
  const pathname = decodeURIComponent(location.pathname).replace(/[\s\u3000/]+$/u, "");
  if (pathname === "/favorites") return { page: "favorites" };
  const lessonMatch = pathname.match(/^\/lesson\/(\d+)$/);
  if (lessonMatch) return { lessonId: lessonMatch[1], page: "lesson" };
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

function normalizeWordCompare(value) {
  return String(value || "")
    .trim()
    .replace(/[，。！？、,.!?;；:：'"“”‘’()\[\]（）【】\s]/g, "")
    .toLowerCase();
}

function wordHasMeaningfulCnChoice(word) {
  const jp = normalizeWordCompare(word.jp);
  const cn = normalizeWordCompare(word.cn);
  return Boolean(jp && cn && jp !== cn);
}

function wordIsWeakOrFavorite(word) {
  const learning = wordLearningState(word.id);
  return isFavorite("word", word.id)
    || learning.mainStatus === "review"
    || Boolean(learning.diagnosticTags?.length);
}

function vocabStudyWords() {
  const words = activeVocabulary();
  if (!state.vocabFocusOnly) return words;
  return words.filter(wordIsWeakOrFavorite);
}

function sentenceById(id) {
  return lesson.sentences.find((sentence) => sentence.id === id);
}

function textSectionById(tabId) {
  return textStructure.find((section) => section.id === tabId) || textStructure[0];
}

function textSectionGroups(section) {
  if (!section) return [];
  if (Array.isArray(section.groups)) return section.groups;
  if (Array.isArray(section.sentenceIds)) {
    return [{
      title: section.title || "课文",
      kind: section.kind || "statement",
      ids: section.sentenceIds
    }];
  }
  return [];
}

function textSentencesForTab(tabId) {
  const section = textSectionById(tabId);
  return textSectionGroups(section).flatMap((group) => (group.ids || []).map((id) => sentenceById(id)).filter(Boolean));
}

function textSentenceIdsForTab(tabId) {
  return textSentencesForTab(tabId).map((sentence) => sentence.id);
}

function textTabProgress(tabId) {
  const sentences = textSentencesForTab(tabId);
  const total = sentences.length;
  const completed = sentences.filter((sentence) => sentencePracticeState(sentence.id).pronunciationPassed).length;
  return { completed, total };
}

function textReviewUnlocked(tabId = state.textCurrentTab) {
  const sentences = textSentencesForTab(tabId);
  return sentences.length > 0 && sentences.every((sentence) => sentencePracticeState(sentence.id).pronunciationAttempts > 0);
}

function textLessonCompletedCount() {
  return lesson.sentences.filter((sentence) => sentencePracticeState(sentence.id).pronunciationPassed).length;
}

function textActiveSentenceIndex(tabId = state.textCurrentTab) {
  const total = textSentencesForTab(tabId).length;
  const saved = Number(state.textCurrentSentenceByTab?.[tabId] ?? 0);
  return clamp(Number.isFinite(saved) ? saved : 0, 0, Math.max(0, total - 1));
}

function currentTextSentence() {
  const sentences = textSentencesForTab(state.textCurrentTab);
  return sentences[textActiveSentenceIndex()] || sentences[0] || null;
}

function textTabIdForSentence(sentenceId) {
  return textStructure.find((section) => textSectionGroups(section).some((group) => (group.ids || []).includes(sentenceId)))?.id || "basic";
}

function setTextTab(tabId, sentenceIndex = 0) {
  const sentences = textSentencesForTab(tabId);
  const nextIndex = clamp(sentenceIndex, 0, Math.max(0, sentences.length - 1));
  state.textCurrentTab = tabId;
  state.textCurrentSentenceByTab = { ...state.textCurrentSentenceByTab, [tabId]: nextIndex };
  state.currentSentence = nextIndex;
  state.textRecordingError = "";
  state.textRecordingPreparingId = "";
  state.textRecordingId = "";
  state.textRecordingStoppingId = "";
  lastAutoSpokenSentence = null;
  writeTextProgress();
}

function setTextSentenceIndex(index) {
  const tabId = state.textCurrentTab;
  const sentences = textSentencesForTab(tabId);
  const nextIndex = clamp(index, 0, Math.max(0, sentences.length - 1));
  state.currentSentence = nextIndex;
  state.textCurrentSentenceByTab = { ...state.textCurrentSentenceByTab, [tabId]: nextIndex };
  state.textRecordingError = "";
  writeTextProgress();
}

function textLessonComplete() {
  return lesson.sentences.every((sentence) => sentencePracticeState(sentence.id).pronunciationPassed);
}

function wordById(id) {
  return lesson.vocabulary.find((word) => word.id === id);
}

function favoriteStorageKey(lessonIdValue) {
  return `lesson:${lessonIdValue}:favorites`;
}

function emptyFavorites() {
  return { words: {}, sentences: {} };
}

function normalizeFavorites(value) {
  return {
    words: value?.words && typeof value.words === "object" ? value.words : {},
    sentences: value?.sentences && typeof value.sentences === "object" ? value.sentences : {}
  };
}

function lessonFavorites(lessonIdValue = lesson.id) {
  return normalizeFavorites(read(favoriteStorageKey(lessonIdValue), emptyFavorites()));
}

function writeLessonFavorites(lessonIdValue, favorites) {
  write(favoriteStorageKey(lessonIdValue), normalizeFavorites(favorites));
}

function favoriteTypeKey(type) {
  return type === "sentence" ? "sentences" : "words";
}

function isFavorite(type, id, lessonIdValue = lesson.id) {
  return Boolean(lessonFavorites(lessonIdValue)[favoriteTypeKey(type)]?.[id]);
}

function wordFavoriteSnapshot(word) {
  return {
    id: word.id,
    jp: word.jp,
    kana: word.kana || "",
    cn: word.cn || "",
    audioType: "word",
    audioId: word.id,
    voiceId: lessonCurrentVoiceId(),
    savedAt: new Date().toISOString()
  };
}

function sentenceFavoriteSnapshot(sentence) {
  return {
    id: sentence.id,
    text: sentence.text,
    translation: sentence.translation || "",
    audioType: "sentence",
    audioId: sentence.id,
    voiceId: lessonCurrentVoiceId(),
    savedAt: new Date().toISOString()
  };
}

function toggleFavorite(type, item, lessonIdValue = lesson.id) {
  const favorites = lessonFavorites(lessonIdValue);
  const key = favoriteTypeKey(type);
  const id = item.id;
  const isRemoving = Boolean(favorites[key][id]);
  if (isRemoving) {
    delete favorites[key][id];
  } else {
    favorites[key][id] = type === "sentence" ? sentenceFavoriteSnapshot(item) : wordFavoriteSnapshot(item);
  }
  writeLessonFavorites(lessonIdValue, favorites);
  if (shouldSync()) {
    if (isRemoving) {
      apiSyncRemoveFavorite(lessonIdValue, type, id);
    } else {
      apiSyncAddFavorite(lessonIdValue, type, id, favorites[key][id]);
    }
  }
}

function allFavoriteItems() {
  const items = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const storageKey = localStorage.key(index);
    const match = storageKey?.match(/^japaflow:lesson:(\d+):favorites$/);
    if (!match) continue;
    const lessonIdValue = match[1];
    const favorites = lessonFavorites(lessonIdValue);
    Object.values(favorites.words || {}).forEach((item) => {
      items.push({ ...item, type: "word", lessonId: lessonIdValue });
    });
    Object.values(favorites.sentences || {}).forEach((item) => {
      items.push({ ...item, type: "sentence", lessonId: lessonIdValue });
    });
  }
  return items.sort((a, b) => Number(a.lessonId) - Number(b.lessonId) || String(b.savedAt || "").localeCompare(String(a.savedAt || "")));
}

function favoriteAudioUrl(item) {
  const type = item.audioType || item.type;
  const id = item.audioId || item.id;
  const catalogItem = courseCatalogItems().find((entry) => String(entry.id) === String(item.lessonId));
  const voiceId = item.voiceId || read(`lesson:${item.lessonId}:currentVoiceId`, "") || catalogItem?.voiceId || defaultVoiceId;
  const relative = `/audio/lesson${item.lessonId}/voices/${voiceId}/${type}s/${id}.mp3`;
  if (ossEnabled && ossBaseUrl) return `${ossBaseUrl}${relative}`;
  return relative;
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
  const lid = routeRuntimeLessonId() || String(lesson.id);
  let relative;
  if (state.currentVoiceId && (state.currentVoiceId !== defaultVoiceId || lid !== String(bundledLessonRuntime.lesson.id))) {
    relative = `/audio/lesson${lid}/voices/${state.currentVoiceId}/${type}s/${id}.mp3`;
  } else {
    relative = `/audio/lesson${lid}/${type}s/${id}.mp3`;
  }
  if (ossEnabled && ossBaseUrl) return `${ossBaseUrl}${relative}`;
  return relative;
}

function managedAudioUrl(voiceId, type, id) {
  let relative;
  if (voiceId === defaultVoiceId && String(lesson.id) === String(bundledLessonRuntime.lesson.id)) {
    relative = `/audio/lesson${lesson.id}/${type}s/${id}.mp3`;
  } else {
    relative = `/audio/lesson${lesson.id}/voices/${voiceId}/${type}s/${id}.mp3`;
  }
  if (ossEnabled && ossBaseUrl) return `${ossBaseUrl}${relative}`;
  return relative;
}

function extraExampleAudioUrl(grammarId, index) {
  return audioUrl("sentence", `${grammarId}-extra-${index + 1}`);
}

function isIncorrectGrammarExample(example) {
  const text = String(lessonTextValue(example)).trim();
  return Boolean(example?.isIncorrect || example?.incorrect || example?.correct === false || /^[×xX✕]/.test(text));
}

function cleanGrammarExampleText(text) {
  return String(text || "").trim().replace(/^[×xX✕]\s*/, "");
}

function lessonTextValue(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.text || value.jp || value.kana || "";
}

function normalizedGrammarExtraExamples(grammar) {
  return (grammar.extraExamples || [])
    .map((example, index) => ({
      ...example,
      sourceIndex: index,
      text: cleanGrammarExampleText(lessonTextValue(example)),
      translation: example.translation || example.cn || "",
      isIncorrect: isIncorrectGrammarExample(example)
    }))
    .filter((example) => example.text);
}

function playAudio(text, audio, onEnded, options = {}) {
  stopCurrentAudio();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  currentSpeechText = "";
  currentSpeechOnEnded = null;
  if (audio) {
    const token = ++audioPlaybackToken;
    const audioEl = new Audio(sanitizeAudioPath(audio));
    activeAudio = audioEl;
    audioEl.preload = "auto";
    audioEl.playbackRate = state.playbackRate;
    audioEl.currentTime = 0;
    const start = () => {
      if (activeAudio !== audioEl || token !== audioPlaybackToken) return;
      const playNow = () => {
        if (activeAudio !== audioEl || token !== audioPlaybackToken) return;
        audioEl.playbackRate = state.playbackRate;
        audioEl.currentTime = 0;
        audioEl.play().catch(() => {
          if (activeAudio === audioEl) activeAudio = null;
          speak(text, onEnded);
        });
      };
      if (options.startDelayMs) {
        window.setTimeout(playNow, options.startDelayMs);
        return;
      }
      playNow();
    };
    const fallbackToSpeech = () => {
      if (activeAudio !== audioEl || token !== audioPlaybackToken) return;
      if (activeAudio === audioEl) activeAudio = null;
      speak(text, onEnded);
    };
    if (audioEl.readyState >= 2) {
      start();
    } else {
      audioEl.addEventListener("canplay", start, { once: true });
      audioEl.load();
    }
    audioEl.addEventListener("ended", () => {
      if (activeAudio !== audioEl || token !== audioPlaybackToken) return;
      activeAudio = null;
      if (onEnded) onEnded();
    }, { once: true });
    audioEl.addEventListener("error", fallbackToSpeech, { once: true });
    return;
  }
  speak(text, onEnded);
}

function silentPrerollUrl(durationMs = 650) {
  const key = Math.max(100, Math.floor(durationMs));
  if (silentPrerollUrls.has(key)) return silentPrerollUrls.get(key);
  const sampleRate = 8000;
  const samples = Math.ceil(sampleRate * key / 1000);
  const bytesPerSample = 2;
  const dataSize = samples * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeString = (offset, value) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);
  const url = URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
  silentPrerollUrls.set(key, url);
  return url;
}

function playAudioAfterSilentPreroll(text, audio, onEnded, prerollMs = 650) {
  stopCurrentAudio();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  currentSpeechText = "";
  currentSpeechOnEnded = null;
  const token = ++audioPlaybackToken;
  const silentAudio = new Audio(silentPrerollUrl(prerollMs));
  activeAudio = silentAudio;
  silentAudio.preload = "auto";
  const continueToWord = () => {
    if (activeAudio !== silentAudio || token !== audioPlaybackToken) return;
    activeAudio = null;
    playAudio(text, audio, onEnded);
  };
  silentAudio.addEventListener("ended", continueToWord, { once: true });
  silentAudio.addEventListener("error", continueToWord, { once: true });
  silentAudio.play().catch(() => {
    if (activeAudio === silentAudio) activeAudio = null;
    playAudio(text, audio, onEnded);
  });
}

function scheduleAutoWordAudio(word, delayMs = 650) {
  const token = ++autoWordPlaybackToken;
  const wordId = word?.id || "";
  const text = word?.jp || "";
  if (!wordId || !text) return;
  const audio = audioUrl("word", wordId);
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        if (token !== autoWordPlaybackToken) return;
        if (route().page !== "vocab") return;
        if (state.vocabPhase !== "pronunciation" && state.vocabPhase !== "test") return;
        if (state.vocabPhase === "pronunciation" && vocabStudyWords()[state.currentWord]?.id !== wordId) return;
        if (state.recordingWordId || state.recordingPreparingWordId || state.recordingStoppingWordId) return;
        playAudioAfterSilentPreroll(text, audio, null, 700);
      }, delayMs);
    });
  });
}

function stopCurrentAudio() {
  audioPlaybackToken += 1;
  autoWordPlaybackToken += 1;
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

const exerciseRubyEntries = [
  ["国際関係学", "こくさいかんけいがく"],
  ["日本の経済", "にほんのけいざい"],
  ["スピーチの練習", "スピーチのれんしゅう"],
  ["パソコンの部品", "パソコンのぶひん"],
  ["スポーツセンター", "スポーツセンター"],
  ["社交ダンス", "しゃこうダンス"],
  ["太極拳", "たいきょくけん"],
  ["アルバイト", "アルバイト"],
  ["お年寄り", "おとしより"],
  ["入園料", "にゅうえんりょう"],
  ["気持ち", "きもち"],
  ["この前", "このまえ"],
  ["書類", "しょるい"],
  ["整理", "せいり"],
  ["学校", "がっこう"],
  ["大変", "たいへん"],
  ["楊さん", "ようさん"],
  ["今朝", "けさ"],
  ["大勢", "おおぜい"],
  ["集ま", "あつま"],
  ["多", "おお"],
  ["払", "はら"],
  ["利用", "りよう"],
  ["割引", "わりびき"],
  ["小さい", "ちいさい"],
  ["祖母", "そぼ"],
  ["遊", "あそ"],
  ["夕方", "ゆうがた"],
  ["涼しい", "すずしい"],
  ["時々", "ときどき"],
  ["教室", "きょうしつ"],
  ["加藤さん", "かとうさん"],
  ["息子さん", "むすこさん"],
  ["展覧会", "てんらんかい"],
  ["新しい企画", "あたらしいきかく"],
  ["食事の準備", "しょくじのじゅんび"],
  ["食事", "しょくじ"],
  ["1か月会社", "いっかげつかいしゃ"],
  ["海外旅行", "かいがいりょこう"],
  ["携帯電話", "けいたいでんわ"],
  ["明るい曲", "あかるいきょく"],
  ["駅前のスーパー", "えきまえのスーパー"],
  ["大きな地震", "おおきなじしん"],
  ["お先に失礼", "おさきにしつれい"],
  ["都合が悪い", "つごうがわるい"],
  ["毎日病院", "まいにちびょういん"],
  ["荷物を送", "にもつをおく"],
  ["写真を選", "しゃしんをえら"],
  ["道を渡", "みちをわた"],
  ["紙を切", "かみをき"],
  ["部屋の中", "へやのなか"],
  ["電気を消", "でんきをけ"],
  ["友達に会", "ともだちにあ"],
  ["表やグラフ", "ひょうやグラフ"],
  ["説明をし", "せつめいをし"],
  ["市役所", "しやくしょ"],
  ["郵便局", "ゆうびんきょく"],
  ["喫茶店", "きっさてん"],
  ["長島さん", "ながしまさん"],
  ["吉田さん", "よしださん"],
  ["田中さん", "たなかさん"],
  ["田村さん", "たむらさん"],
  ["木下さん", "きのしたさん"],
  ["馬さん", "ばさん"],
  ["張さん", "ちょうさん"],
  ["陳さん", "ちんさん"],
  ["葉子さん", "ようこさん"],
  ["李さん", "りさん"],
  ["森さん", "もりさん"],
  ["子供", "こども"],
  ["横浜", "よこはま"],
  ["病気", "びょうき"],
  ["会社", "かいしゃ"],
  ["休み", "やすみ"],
  ["信号", "しんごう"],
  ["青", "あお"],
  ["赤", "あか"],
  ["道", "みち"],
  ["渡", "わた"],
  ["要", "い"],
  ["寂しい", "さびしい"],
  ["明るい", "あかるい"],
  ["曲", "きょく"],
  ["聞", "き"],
  ["夜", "よる"],
  ["静か", "しずか"],
  ["詩", "し"],
  ["書", "か"],
  ["困", "こま"],
  ["相談", "そうだん"],
  ["紙", "かみ"],
  ["切", "き"],
  ["使", "つか"],
  ["仕事", "しごと"],
  ["暇", "ひま"],
  ["残業", "ざんぎょう"],
  ["部屋", "へや"],
  ["電気", "でんき"],
  ["消", "け"],
  ["お金", "おかね"],
  ["都合", "つごう"],
  ["悪い", "わるい"],
  ["連絡", "れんらく"],
  ["朝", "あさ"],
  ["友達", "ともだち"],
  ["会", "あ"],
  ["言", "い"],
  ["紅茶", "こうちゃ"],
  ["旅行", "りょこう"],
  ["先", "さき"],
  ["失礼", "しつれい"],
  ["家族", "かぞく"],
  ["卓球", "たっきゅう"],
  ["雑誌", "ざっし"],
  ["読", "よ"],
  ["ご飯", "ごはん"],
  ["食", "た"],
  ["何", "なに"],
  ["話", "はな"],
  ["写真", "しゃしん"],
  ["選", "えら"],
  ["手", "て"],
  ["歌", "うた"],
  ["踊", "おど"],
  ["中", "なか"],
  ["歩", "ある"],
  ["練習", "れんしゅう"],
  ["表", "ひょう"],
  ["見", "み"],
  ["新しい", "あたらしい"],
  ["企画", "きかく"],
  ["説明", "せつめい"],
  ["明日", "あした"],
  ["出張", "しゅっちょう"],
  ["週間", "しゅうかん"],
  ["予定", "よてい"],
  ["気", "き"],
  ["日本", "にほん"],
  ["恋人", "こいびと"],
  ["上手", "じょうず"],
  ["語", "ご"],
  ["難", "むずか"],
  ["姉", "あね"],
  ["銀行", "ぎんこう"],
  ["働", "はたら"],
  ["父", "ちち"],
  ["兄", "あに"],
  ["大学", "だいがく"],
  ["勉強", "べんきょう"],
  ["母", "はは"],
  ["毎日", "まいにち"],
  ["病院", "びょういん"],
  ["通", "かよ"],
  ["駅前", "えきまえ"],
  ["安い", "やすい"],
  ["品物", "しなもの"],
  ["売", "う"],
  ["運動", "うんどう"],
  ["弟", "おとうと"],
  ["部品", "ぶひん"],
  ["作", "つく"],
  ["去年", "きょねん"],
  ["今度", "こんど"],
  ["近所", "きんじょ"],
  ["近く", "ちかく"],
  ["公園", "こうえん"],
  ["散歩", "さんぽ"],
  ["お茶", "おちゃ"],
  ["音楽", "おんがく"],
  ["中国", "ちゅうごく"],
  ["笑", "わら"],
  ["道具", "どうぐ"],
  ["食堂", "しょくどう"],
  ["経済", "けいざい"],
  ["学部", "がくぶ"],
  ["高校", "こうこう"],
  ["日記", "にっき"],
  ["教師", "きょうし"],
  ["体操", "たいそう"],
  ["有料", "ゆうりょう"],
  ["映画", "えいが"],
  ["後ろ", "うしろ"],
  ["席", "せき"],
  ["座", "すわ"],
  ["学生", "がくせい"],
  ["分", "わ"],
  ["絵", "え"],
  ["賞", "しょう"],
  ["切手", "きって"],
  ["買", "か"],
  ["荷物", "にもつ"],
  ["送", "おく"],
  ["所", "ところ"],
  ["電話", "でんわ"],
  ["人", "ひと"],
  ["好き", "すき"],
  ["昨日", "きのう"],
  ["来なかった", "こなかった"],
  ["来ません", "きません"],
  ["来ました", "きました"],
  ["来て", "きて"],
  ["来る", "くる"],
  ["来ない", "こない"],
  ["来週", "らいしゅう"],
  ["来月", "らいげつ"],
  ["来年", "らいねん"],
  ["行", "い"],
  ["入", "はい"],
  ["掃除", "そうじ"],
  ["店", "みせ"],
  ["日曜日", "にちようび"],
  ["地震", "じしん"]
].sort((a, b) => b[0].length - a[0].length);

function renderExerciseText(value, options = {}) {
  const source = String(value || "");
  const allowStaticFallback = options.allowStaticFallback !== false;
  let html = options.kana
    ? rubyTextFromKana(source, options.kana) || (allowStaticFallback ? rubyExerciseText(source) : escapeHtml(source))
    : allowStaticFallback
      ? rubyExerciseText(source)
      : escapeHtml(source);
  html = html.replace(/__([\s\S]+?)__/g, `<span class="example-underline">$1</span>`);
  if (options.exampleBreaks) {
    html = html
      .replace(/\s*→\s*/g, `<br><span class="example-arrow">→</span> `)
      .replace(/\s*(甲：)/g, "<br>$1")
      .replace(/\s*(乙：)/g, "<br>$1")
      .replace(/^<br>/, "");
  }
  return html;
}

function renderJapaneseText(value, options = {}) {
  return renderExerciseText(value, options);
}

function exerciseQuestionHtml(exercise) {
  return renderExerciseText(exercise?.question || "", { kana: exercise?.questionKana, allowStaticFallback: false });
}

function exerciseExampleHtml(exercise, example = exercise?.example || "") {
  return renderExerciseText(example, { kana: exercise?.exampleKana, exampleBreaks: true, allowStaticFallback: false });
}

function exerciseAnswerHtml(exercise, value = exercise?.answer || "") {
  return renderExerciseText(value, { kana: exercise?.answerKana, allowStaticFallback: false });
}

function exerciseReferenceAnswerHtml(exercise, value, index) {
  const kana = Array.isArray(exercise?.referenceAnswerKana) ? exercise.referenceAnswerKana[index] : "";
  return renderExerciseText(value, { kana: kana || (value === exercise?.answer ? exercise?.answerKana : ""), allowStaticFallback: false });
}

function exerciseCorrectAnswerHtml(exercise, fallback = "暂无标准答案") {
  const references = Array.isArray(exercise?.referenceAnswers) ? exercise.referenceAnswers.filter(Boolean) : [];
  if (references.length) {
    return references.map((value, index) => exerciseReferenceAnswerHtml(exercise, value, index)).join(" / ");
  }
  return exercise?.answer ? exerciseAnswerHtml(exercise) : fallback;
}

function rubyTextFromKana(source, kana) {
  const text = String(source || "");
  const reading = String(kana || "");
  if (!text || !reading || !hasKanji(text)) return null;
  const result = alignRubyFromKana(text, reading);
  return result && readingFullyConsumed(reading, result.readingIndex) ? result.html : null;
}

function alignRubyFromKana(text, reading) {
  const memo = new Map();

  function finish(key, tail, build) {
    const result = tail ? build(tail) : null;
    memo.set(key, result);
    return result;
  }

  function walk(textIndex, readingIndex) {
    readingIndex = skipReadingSpaces(reading, readingIndex);
    const key = `${textIndex}:${readingIndex}`;
    if (memo.has(key)) return memo.get(key);
    if (textIndex >= text.length) {
      const done = readingFullyConsumed(reading, readingIndex) ? { html: "", readingIndex } : null;
      memo.set(key, done);
      return done;
    }

    const char = text[textIndex];
    if (/\s/.test(char)) {
      return finish(key, walk(textIndex + 1, readingIndex), (tail) => ({
        html: escapeHtml(char) + tail.html,
        readingIndex: tail.readingIndex
      }));
    }

    if (isJapanesePunctuation(char)) {
      const punctuationIndex = skipReadingSpaces(reading, readingIndex);
      const nextReadingIndex = isJapanesePunctuation(reading[punctuationIndex]) ? punctuationIndex + 1 : punctuationIndex;
      return finish(key, walk(textIndex + 1, nextReadingIndex), (tail) => ({
        html: escapeHtml(char) + tail.html,
        readingIndex: tail.readingIndex
      }));
    }

    if (!isKanjiChar(char)) {
      const end = nextPlainRunEnd(text, textIndex);
      const plain = text.slice(textIndex, end);
      const taken = takeReadingChars(reading, readingIndex, plain.length);
      if (!taken || !kanaSame(plain, taken.text)) {
        memo.set(key, null);
        return null;
      }
      return finish(key, walk(end, taken.end), (tail) => ({
        html: escapeHtml(plain) + tail.html,
        readingIndex: tail.readingIndex
      }));
    }

    const known = knownRubyMatch(text, textIndex, reading, readingIndex);
    for (const entry of known) {
      const tail = walk(textIndex + entry.text.length, entry.readingEnd);
      if (tail) {
        const done = {
          html: rubyKanjiSegment(entry.text, entry.reading) + tail.html,
          readingIndex: tail.readingIndex
        };
        memo.set(key, done);
        return done;
      }
    }

    const segmentEnds = possibleKanjiSegmentEnds(text, textIndex);
    for (const end of segmentEnds) {
      const surface = text.slice(textIndex, end);
      const suffix = kanjiSegmentSuffix(surface);
      const minLength = Math.max(1, suffix.length + 1);
      const candidates = readingCandidates(reading, readingIndex, minLength);
      for (const candidate of candidates) {
        if (/\s/.test(candidate.raw.trim())) continue;
        if (suffix && !kanaEndsWith(candidate.text, suffix)) continue;
        const tail = walk(end, candidate.end);
        if (tail) {
          const done = { html: rubyKanjiSegment(surface, candidate.text) + tail.html, readingIndex: tail.readingIndex };
          memo.set(key, done);
          return done;
        }
      }
    }

    memo.set(key, null);
    return null;
  }

  return walk(0, 0);
}

function nextPlainRunEnd(text, index) {
  let end = index;
  while (end < text.length && !isKanjiChar(text[end]) && !isJapanesePunctuation(text[end]) && !/\s/.test(text[end])) end += 1;
  return end;
}

function possibleKanjiSegmentEnds(text, index) {
  const ends = [];
  for (let end = index + 1; end <= text.length; end += 1) {
    const previous = text[end - 1];
    if (isJapanesePunctuation(previous) || /\s/.test(previous)) break;
    if (hasKanji(text.slice(index, end))) ends.push(end);
    const next = text[end];
    if (!next || isJapanesePunctuation(next) || /\s/.test(next)) break;
  }
  return ends.sort((a, b) => b - a);
}

function kanjiSegmentSuffix(surface) {
  let lastKanji = -1;
  for (let index = 0; index < surface.length; index += 1) {
    if (isKanjiChar(surface[index])) lastKanji = index;
  }
  return lastKanji >= 0 ? surface.slice(lastKanji + 1) : "";
}

function rubyKanjiSegment(surface, reading) {
  const suffix = kanjiSegmentSuffix(surface);
  const kanjiText = suffix ? surface.slice(0, surface.length - suffix.length) : surface;
  const rt = suffix && kanaEndsWith(reading, suffix) ? reading.slice(0, reading.length - suffix.length) : reading;
  if (!rt) return escapeHtml(surface);
  return `<ruby>${escapeHtml(kanjiText)}<rt>${escapeHtml(rt)}</rt></ruby>${escapeHtml(suffix)}`;
}

function hasKanji(value) {
  return /[\u3400-\u9fff]/u.test(String(value || ""));
}

function isKanjiChar(char) {
  return /[\u3400-\u9fff]/u.test(char || "");
}

function isJapanesePunctuation(char) {
  return /[。、，．,.！？!?「」『』（）()［］\[\]【】・:：;；]/u.test(char || "");
}

function kanaSame(left, right) {
  return comparableKana(left) === comparableKana(right);
}

function kanaEndsWith(value, suffix) {
  return comparableKana(value).endsWith(comparableKana(suffix));
}

function comparableKana(value) {
  return String(value || "").replace(/\s+/g, "").replace(/[\u30a1-\u30f6]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
}

function knownRubyMatch(text, textIndex, reading, readingIndex) {
  return rubyKnownEntries()
    .filter(([surface]) => text.startsWith(surface, textIndex))
    .map(([surface, ruby]) => {
      const taken = takeReadingChars(reading, readingIndex, String(ruby).length);
      if (!taken || !kanaSame(ruby, taken.text)) return null;
      return { text: surface, reading: ruby, readingEnd: taken.end };
    })
    .filter(Boolean);
}

function rubyKnownEntries() {
  const vocabEntries = Array.isArray(lesson?.vocabulary)
    ? lesson.vocabulary
      .filter((word) => word?.jp && word?.kana && hasKanji(word.jp))
      .map((word) => [word.jp, word.kana])
    : [];
  return [...vocabEntries, ...exerciseRubyEntries]
    .filter(([surface]) => String(surface).length > 1)
    .sort((a, b) => b[0].length - a[0].length);
}

function skipReadingSpaces(reading, index) {
  let next = index;
  while (next < reading.length && /\s/.test(reading[next])) next += 1;
  return next;
}

function readingFullyConsumed(reading, index) {
  return skipReadingSpaces(reading, index) >= reading.length;
}

function takeReadingChars(reading, index, visibleLength) {
  let end = skipReadingSpaces(reading, index);
  let text = "";
  while (end < reading.length && text.length < visibleLength) {
    if (!/\s/.test(reading[end])) text += reading[end];
    end += 1;
  }
  return text.length === visibleLength ? { text, end } : null;
}

function readingCandidates(reading, index, minVisibleLength) {
  const candidates = [];
  let end = skipReadingSpaces(reading, index);
  let visible = "";
  const start = end;
  while (end < reading.length) {
    const char = reading[end];
    if (isJapanesePunctuation(char)) break;
    if (!/\s/.test(char)) visible += char;
    end += 1;
    if (visible.length >= minVisibleLength) {
      candidates.push({ raw: reading.slice(start, end), text: visible, end });
    }
  }
  return candidates;
}

function rubyExerciseText(source) {
  let html = "";
  for (let index = 0; index < source.length;) {
    const entry = exerciseRubyEntries.find(([text]) => source.startsWith(text, index));
    if (entry) {
      const [text, reading] = entry;
      html += `<ruby>${escapeHtml(text)}<rt>${escapeHtml(reading)}</rt></ruby>`;
      index += text.length;
    } else {
      html += escapeHtml(source[index]);
      index += 1;
    }
  }
  return html;
}

function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[「」『』]/g, "")
    .replace(/[。．.、，,!?！？]+$/g, "");
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
  if (item.slashed) return "mastered";
  const touched = item.attempts.pronunciation || item.attempts.audioToWord || item.attempts.wordToMeaning;
  if (!touched) return "new";
  const mastered = item.pronunciationPassed && item.audioToWordCorrect && item.wordToMeaningCorrect;
  if (mastered) return "mastered";
  return item.diagnosticTags?.length ? "review" : "learning";
}

function wordMainStatusText(status) {
  return { new: "未学", learning: "学习中", review: "待复习", mastered: "已掌握" }[status] || "未学";
}

function wordStatusLabel(word) {
  const learning = wordLearningState(word.id);
  return learning.slashed ? "已斩" : wordMainStatusText(learning.mainStatus);
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
  const currentRoute = route();
  const current = currentRoute.page;
  const runtimeLessonId = routeRuntimeLessonId();
  const inLesson = Boolean(runtimeLessonId);
  const showLessonSubnav = inLesson && ["vocab", "grammar", "text", "exercises", "wrongbook", "result", "favorites"].includes(current);
  return `
    <div class="shell">
      <header class="topbar">
        <div class="brand" role="button" tabindex="0" data-nav="/">
          <span class="brand-mark">日</span>
          <span>JapaFlow</span>
        </div>
        <nav class="nav">
          ${navLink("/", "首页", current === "home")}
          ${inLesson ? navLink(`/lesson/${runtimeLessonId}`, "课程", current === "lesson") : ""}
          ${navLink(inLesson ? `/lesson/${runtimeLessonId}/favorites` : "/favorites", "收藏", current === "favorites")}
        </nav>
        <div class="topbar-actions">
          <div class="playback-control" aria-label="播放速度">
            ${[1, 0.6, 0.8, 1.2, 1.5].map((rate) => `
              <button class="playback-rate ${state.playbackRate === rate ? "active" : ""}" data-playback-rate="${rate}" type="button">${rate.toFixed(1)}x</button>
            `).join("")}
          </div>
          <div class="manage-menu progress-menu">
            <button class="manage-trigger progress-trigger" type="button" aria-label="学习数据菜单">...</button>
            <div class="manage-dropdown progress-dropdown">
              <button type="button" data-export-progress>导出</button>
              <button type="button" data-import-progress-trigger>导入</button>
            </div>
          </div>
          <input class="hidden" type="file" accept="application/json,.json" data-import-progress-file />
          ${isLoggedIn() ? `
            <span class="topbar-user"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>${escapeHtml(getStoredUsername())}</span>
          ` : `
            <button class="topbar-login" type="button" data-header-login><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>登录</button>
          `}
        </div>
      </header>
      ${showLessonSubnav ? lessonSubnav(runtimeLessonId, current) : ""}
      <main class="main">${content}</main>
      ${state.modal ? modal(state.modal) : ""}
    </div>
  `;
}

function navLink(path, text, active) {
  return `<a href="${path}" class="${active ? "active" : ""}" data-link>${text}</a>`;
}

function lessonSubnav(lessonId, current) {
  return `
    <nav class="lesson-subnav" aria-label="课程模块导航">
      ${navLink(`/lesson/${lessonId}/vocab`, "单词预热", current === "vocab")}
      ${navLink(`/lesson/${lessonId}/grammar`, "语法", current === "grammar")}
      ${navLink(`/lesson/${lessonId}/text`, "课文", current === "text")}
      ${navLink(`/lesson/${lessonId}/exercises`, "练习", current === "exercises")}
      ${navLink(`/lesson/${lessonId}/wrongbook`, "错题集", current === "wrongbook")}
      ${navLink(`/lesson/${lessonId}/favorites`, "收藏", current === "favorites")}
      ${navLink(`/lesson/${lessonId}/result`, "结果", current === "result")}
      ${navLink(`/lesson/${lessonId}/audio`, "音频", current === "audio")}
    </nav>
  `;
}

function home() {
  const catalog = courseCatalogItems();
  const pageSize = 12;
  const pageCount = Math.max(1, Math.ceil(catalog.length / pageSize));
  const currentPage = currentHomePage(pageCount);
  const start = (currentPage - 1) * pageSize;
  const pageItems = catalog.slice(start, start + pageSize);
  return layout(`
    <section class="course-home">
      <div class="page-head">
        <div>
          <p class="eyebrow">JapaFlow · 课程列表</p>
          <h1>选择一课开始学习</h1>
          <p class="lead">首页只负责选课和总览。进入具体课次后，再完成单词、语法、课文、练习和结果复盘。</p>
        </div>
        ${homePagination(currentPage, pageCount)}
      </div>
      <div class="course-grid">
        ${pageItems.map((item) => courseCard(item)).join("")}
      </div>
      ${state.lessonCatalogMessage ? `<p class="form-error">${escapeHtml(state.lessonCatalogMessage)}</p>` : ""}
    </section>
  `);
}

function currentHomePage(pageCount) {
  const value = Number(new URLSearchParams(location.search).get("page"));
  if (!Number.isFinite(value) || value < 1) return 1;
  return clamp(Math.floor(value), 1, pageCount);
}

function homePagePath(page) {
  const params = new URLSearchParams(location.search);
  params.set("page", String(page));
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

function homePagination(currentPage, pageCount) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  return `
    <nav class="home-pagination" aria-label="课程分页">
      <button class="secondary compact-action" type="button" ${currentPage <= 1 ? "disabled" : `data-nav="${homePagePath(currentPage - 1)}"`}>上一页</button>
      <div class="page-number-row">
        ${pages.map((page) => `
          <button class="page-number ${page === currentPage ? "active" : ""}" type="button" ${page === currentPage ? "aria-current=\"page\"" : `data-nav="${homePagePath(page)}"`}>${page}</button>
        `).join("")}
      </div>
      <button class="secondary compact-action" type="button" ${currentPage >= pageCount ? "disabled" : `data-nav="${homePagePath(currentPage + 1)}"`}>下一页</button>
    </nav>
  `;
}

function runtimeLoadingPage(lessonId) {
  return layout(`
    <section class="panel pending-lesson">
      <p class="eyebrow">第${lessonId}课 · 加载中</p>
      <h1>正在读取课程数据</h1>
      <p class="lead">正在加载 data/lessons/lesson${lessonId}.json。</p>
    </section>
  `);
}

function runtimeErrorPage(lessonId) {
  return layout(`
    <section class="panel pending-lesson">
      <p class="eyebrow">第${lessonId}课 · 加载失败</p>
      <h1>无法进入学习运行时</h1>
      <p class="lead">${escapeHtml(runtimeLessonError || "课程数据读取失败。")}</p>
      <div class="button-row">
        <button class="primary" data-nav="/lesson/${lessonId}/init">查看初始化结果</button>
        <button class="secondary" data-nav="/">返回首页</button>
      </div>
    </section>
  `);
}

function courseCatalogItems() {
  const base = state.lessonCatalogStatus?.length
    ? lessonCatalog.map((item) => ({
        ...item,
        ...(state.lessonCatalogStatus.find((entry) => Number(entry.id) === Number(item.id)) || {})
      }))
    : lessonCatalog;
  return [...base].sort(courseCatalogSort);
}

function courseCatalogSort(a, b) {
  const priority = (item) => {
    if (item.status === "ready" || item.status === "initialized") return 0;
    if (item.status === "invalid") return 2;
    return 3;
  };
  const byPriority = priority(a) - priority(b);
  if (byPriority) return byPriority;
  return Number(a.id) - Number(b.id);
}

function courseCard(item) {
  const runtimeReady = item.status === "ready" && item.runtimeReady !== false;
  const initialized = item.status === "initialized";
  const invalid = item.status === "invalid";
  const cardNav = runtimeReady || initialized || !ADMIN_MODE ? "" : `data-nav="/lesson/${item.id}/init"`;
  const summary = runtimeReady ? lessonProgressSummary() : initialized ? catalogLessonProgressSummary(item) : null;
  const lessonPct = summary ? lessonPercent(summary) : 0;
  const status = runtimeReady
    ? lessonStudyStatus(summary)
    : initialized
      ? lessonStudyStatus(summary)
      : invalid
        ? { label: item.statusLabel || "数据待校验", className: "invalid" }
        : { label: "待初始化", className: "pending" };
  return `
    <article class="course-card ${runtimeReady ? "ready" : initialized ? "initialized" : invalid ? "invalid" : "pending"}" ${cardNav}>
      <div class="course-card-head">
        <div>
          <p class="eyebrow">${item.title}</p>
          <h2>${item.subtitle}</h2>
        </div>
        <span class="course-status ${status.className}">${status.label}</span>
      </div>
      <p class="muted">${item.description}</p>
      ${summary ? `
        <div class="course-mini-progress" aria-label="本课学习进度 ${lessonPct}%">
          <span class="course-mini-progress-bar" style="--value:${lessonPct}%"></span>
          <small>${lessonPct}%</small>
        </div>
      ` : `
        <div class="course-mini-progress pending-bar" aria-label="本课学习进度 0%">
          <span class="course-mini-progress-bar" style="--value:0%"></span>
          <small>0%</small>
        </div>
      `}
      ${runtimeReady ? `
        <div class="course-progress-grid">
          ${courseMetric("单词", summary.vocab.completed, summary.vocab.total)}
          ${courseMetric("语法", summary.grammar.completed, summary.grammar.total)}
          ${courseMetric("课文", summary.text.completed, summary.text.total)}
          ${courseMetric("练习", summary.exercises.completed, summary.exercises.total)}
        </div>
        ${courseStudyTimeGrid(item.id)}
        <div class="button-row">
          <button class="primary" data-nav="/lesson/${item.id}">${summary.started ? "继续学习" : "开始学习"}</button>
          <button class="secondary" data-nav="/lesson/${item.id}/result">查看结果</button>
        </div>
      ` : initialized ? `
        <div class="course-progress-grid">
          ${courseMetric("单词", summary.vocab.completed, summary.vocab.total)}
          ${courseMetric("语法", summary.grammar.completed, summary.grammar.total)}
          ${courseMetric("课文", summary.text.completed, summary.text.total)}
          ${courseMetric("练习", summary.exercises.completed, summary.exercises.total)}
        </div>
        ${courseStudyTimeGrid(item.id)}
        <div class="button-row">
          <button class="primary" data-nav="/lesson/${item.id}">开始学习</button>
          <button class="secondary" data-nav="/lesson/${item.id}/init">初始化结果</button>
        </div>
      ` : `
        <div class="course-placeholder">${invalid ? "课程数据需要重新核对，暂不展示统计数量" : "课程数据尚未初始化"}</div>
        <button class="primary" data-nav="/lesson/${item.id}/init">${invalid ? "查看并修正" : "初始化课程"}</button>
      `}
    </article>
  `;
}

function lessonDashboard() {
  const currentRoute = route();
  const catalogItem = courseCatalogItems().find((item) => String(item.id) === String(currentRoute.lessonId));
  if (String(lesson.id) !== String(currentRoute.lessonId)) return pendingLessonPage(catalogItem);
  const summary = lessonProgressSummary();
  const next = nextLessonStep(summary);
  return layout(`
    <section class="lesson-dashboard">
      <div class="page-head">
        <div>
          <p class="eyebrow">${lesson.title} · 课程首页</p>
          <h1>${lesson.subtitle}</h1>
          <p class="lead">按推荐路径完成学习，也可以直接进入任意模块处理薄弱点。</p>
        </div>
        <div class="button-row">
          <button class="primary" data-nav="${next.path}">${next.label}</button>
          <button class="secondary" data-nav="/lesson/${lesson.id}/result">查看结果</button>
        </div>
      </div>
      <div class="dashboard-summary">
        ${progressRow("单词掌握", summary.vocab.completed, summary.vocab.total)}
        ${progressRow("语法通过", summary.grammar.completed, summary.grammar.total)}
        ${progressRow("课文朗读", summary.text.completed, summary.text.total)}
        ${progressRow("练习完成", summary.exercises.completed, summary.exercises.total)}
      </div>
      <div class="module-grid">
        ${moduleCard("单词", "先完成全词表发音与打乱测试。", summary.vocab, `/lesson/${lesson.id}/vocab`, "vocab")}
        ${moduleCard("语法", "围绕核心例句完成中译日和跟读。", summary.grammar, `/lesson/${lesson.id}/grammar`, "grammar")}
        ${moduleCard("课文", "按基本课文和应用课文连续朗读，再复盘弱句。", summary.text, `/lesson/${lesson.id}/text`, "text")}
        ${moduleCard("练习", "使用标准练习做最终验收。", summary.exercises, `/lesson/${lesson.id}/exercises`, "exercises")}
        ${moduleCard("结果", `当前弱项 ${summary.weak.total} 个。`, { completed: summary.weak.resolved, total: summary.weak.total }, `/lesson/${lesson.id}/result`)}
        ${moduleCard("音频", "管理全局默认声音和缺失音频。", summary.audio, `/lesson/${lesson.id}/audio`)}
      </div>
    </section>
  `);
}

function favoritesPage() {
  const params = new URLSearchParams(location.search);
  const activeTab = params.get("tab") === "sentences" ? "sentences" : "words";
  const currentRoute = route();
  const items = allFavoriteItems();
  const filtered = items.filter((item) => activeTab === "sentences" ? item.type === "sentence" : item.type === "word");
  const sorted = currentRoute.lessonId
    ? [...filtered].sort((a, b) => (String(b.lessonId) === String(currentRoute.lessonId)) - (String(a.lessonId) === String(currentRoute.lessonId)) || Number(a.lessonId) - Number(b.lessonId))
    : filtered;
  return layout(`
    <section class="favorites-page">
      <div class="page-head">
        <div>
          <p class="eyebrow">JapaFlow · 收藏</p>
          <h1>收藏夹</h1>
          <p class="lead">按课程集中复习收藏的单词和句子，可以查看中文和日文，播放标准音，也可以长按录音做发音评测。</p>
        </div>
        <div class="favorite-tabs" role="tablist" aria-label="收藏类型">
          ${currentRoute.lessonId ? studyTimeBadge("favorites", currentRoute.lessonId) : ""}
          ${favoriteTab("words", "单词", activeTab)}
          ${favoriteTab("sentences", "句子", activeTab)}
        </div>
      </div>
      ${sorted.length ? favoriteItemGroups(sorted, activeTab) : `
        <div class="panel favorite-empty">
          <h2>暂无${activeTab === "sentences" ? "句子" : "单词"}收藏</h2>
          <p class="muted">在学习页面点击星标后，收藏内容会出现在这里。</p>
        </div>
      `}
    </section>
  `);
}

function favoriteTab(tab, label, activeTab) {
  const currentRoute = route();
  const base = currentRoute.lessonId ? `/lesson/${currentRoute.lessonId}/favorites` : "/favorites";
  return `<button class="text-lang ${activeTab === tab ? "active" : ""}" type="button" data-nav="${base}?tab=${tab}">${label}</button>`;
}

function favoriteItemGroups(items, activeTab) {
  const groups = new Map();
  items.forEach((item) => {
    if (!groups.has(String(item.lessonId))) groups.set(String(item.lessonId), []);
    groups.get(String(item.lessonId)).push(item);
  });
  return [...groups.entries()].map(([lessonIdValue, groupItems]) => `
    <section class="favorite-group">
      <h2>${favoriteLessonTitle(lessonIdValue)}<span>${groupItems.length} 个${activeTab === "sentences" ? "句子" : "单词"}</span></h2>
      <div class="favorite-list">
        ${groupItems.map((item) => favoriteItemCard(item)).join("")}
      </div>
    </section>
  `).join("");
}

function favoriteLessonTitle(lessonIdValue) {
  const catalogItem = courseCatalogItems().find((item) => String(item.id) === String(lessonIdValue));
  return catalogItem ? `${catalogItem.title} · ${catalogItem.subtitle}` : `第${lessonIdValue}课`;
}

function favoriteItemCard(item) {
  const isWord = item.type === "word";
  const key = favoriteRecordKey(item);
  const preparing = state.favoriteRecordingPreparingKey === key;
  const recording = state.favoriteRecordingKey === key;
  const stopping = state.favoriteRecordingStoppingKey === key;
  const recordLabel = stopping ? "正在评价" : recording ? "正在说话" : preparing ? "准备中" : "长按录音";
  const result = state.favoriteRecordingResults[key];
  const error = state.favoriteRecordingErrorKey === key ? state.favoriteRecordingError : "";
  const referenceText = isWord ? item.jp : item.text;
  return `
    <article class="favorite-card">
      <div class="favorite-card-main">
        <div class="favorite-card-head">
          <span class="favorite-kind">${isWord ? "单词" : "句子"}</span>
          <button class="favorite-star active" type="button" aria-label="取消收藏" title="取消收藏" data-remove-favorite="${item.type}:${item.lessonId}:${item.id}">★</button>
        </div>
        <strong>${escapeHtml(referenceText || "")}</strong>
        ${isWord && item.kana ? `<span class="favorite-kana">${escapeHtml(item.kana)}</span>` : ""}
        <p>${escapeHtml(isWord ? item.cn || "" : item.translation || "")}</p>
      </div>
      <div class="favorite-actions">
        <button class="secondary" data-speak="${escapeHtml(referenceText || "")}" data-audio="${favoriteAudioUrl(item)}">听标准音</button>
        <button
          class="hold-record-button ${preparing ? "preparing" : ""} ${recording ? "recording" : ""} ${stopping ? "stopping" : ""}"
          data-hold-record-favorite="${key}"
          data-favorite-reference="${escapeHtml(referenceText || "")}"
          data-favorite-kana="${escapeHtml(isWord ? item.kana || "" : "")}"
          aria-label="${recordLabel}"
          ${stopping ? "disabled" : ""}
        >
          <span class="record-icon"></span>
          <span>${recordLabel}</span>
        </button>
      </div>
      ${result ? favoriteRecordingResult(result) : ""}
      ${error ? `<p class="hint danger-text">${escapeHtml(error)}</p>` : ""}
    </article>
  `;
}

function favoriteRecordKey(item) {
  return `${item.type}:${item.lessonId}:${item.id}`;
}

function favoriteRecordingResult(result) {
  return `
    <div class="pronunciation-result ${result.passed ? "passed" : "failed"}">
      <strong>${result.passed ? "发音通过" : "发音需复习"}</strong>
      <span>总分 ${result.pronunciationScore || 0} · 准确 ${result.accuracyScore || 0} · 流畅 ${result.fluencyScore || 0} · 完整 ${result.completenessScore || 0}</span>
      ${result.reasons?.length ? `<small>${result.reasons.map(escapeHtml).join(" / ")}</small>` : ""}
      ${result.debugAudioUrl ? `<audio controls src="${result.debugAudioUrl}"></audio>` : ""}
    </div>
  `;
}

function pendingLessonPage(item) {
  return layout(`
    <section class="panel pending-lesson">
      <p class="eyebrow">${item?.title || "课程"} · 待初始化</p>
      <h1>${item?.subtitle || "课程数据不存在"}</h1>
      <p class="lead">这课还没有导入单词、课文、语法和练习数据。请先完成数据初始化后再进入学习模块。</p>
      <div class="button-row">
        <button class="primary" data-nav="/lesson/${item?.id || ""}/init">初始化课程</button>
        <button class="secondary" data-nav="/">返回课程列表</button>
      </div>
    </section>
  `);
}

function courseMetric(label, value, total) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return `<div class="course-metric"><span>${label}</span><strong>${value}/${total}</strong><small>${pct}%</small></div>`;
}

function courseStudyTimeGrid(lessonIdValue) {
  const modules = [
    ["vocab", "单词"],
    ["grammar", "语法"],
    ["text", "课文"],
    ["exercises", "练习"]
  ];
  return `
    <div class="course-time-grid" aria-label="本课模块练习时长">
      ${modules.map(([module, label]) => `
        <div class="course-time-item">
          <span>${label}</span>
          <strong>${studyTimeMinutes(lessonIdValue, module)} 分钟</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function lessonPercent(summary) {
  const keys = ["vocab", "grammar", "text", "exercises"];
  const pcts = keys.map((k) => summary[k]?.total ? Math.round((summary[k].completed / summary[k].total) * 100) : 0);
  return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
}

function readLessonStoredValue(lessonId, key, fallback) {
  return read(`lesson:${lessonId}:${key}`, fallback);
}

function objectCount(value, predicate = () => true) {
  return Object.values(value || {}).filter(predicate).length;
}

function catalogLessonProgressSummary(item) {
  const lessonId = item.id;
  const counts = item.counts || {};
  const wordLearning = readLessonStoredValue(lessonId, "wordLearning", {});
  const wordProgress = readLessonStoredValue(lessonId, "wordProgress", {});
  const grammarPractice = readLessonStoredValue(lessonId, "grammarPractice", {});
  const sentencePractice = readLessonStoredValue(lessonId, "sentencePractice", {});
  const exerciseResults = readLessonStoredValue(lessonId, "exerciseResults", []);
  const interactionProgress = readLessonStoredValue(lessonId, "interactionProgress", { words: {}, sentences: {}, grammarExamples: {} });
  const vocabCompleted = Math.min(
    counts.vocabulary || 0,
    Math.max(
      objectCount(wordLearning, (entry) => entry?.mainStatus === "mastered"),
      objectCount(wordProgress, (entry) => entry === "familiar")
    )
  );
  const grammarCompleted = Math.min(
    counts.grammar || 0,
    objectCount(grammarPractice, (entry) => Boolean(entry?.correct && entry?.pronunciationPassed))
  );
  const textCompleted = Math.min(
    counts.sentences || 0,
    objectCount(sentencePractice, (entry) => Boolean(entry?.pronunciationPassed))
  );
  const exerciseCompleted = Math.min(
    counts.exercises || 0,
    Array.isArray(exerciseResults) ? new Set(exerciseResults.map((entry) => entry?.exerciseId).filter(Boolean)).size : 0
  );
  const weakTotal = [
    ...Object.values(interactionProgress.words || {}),
    ...Object.values(interactionProgress.sentences || {}),
    ...Object.values(interactionProgress.grammarExamples || {})
  ].filter((entry) => entry?.pronunciationState === "retry" || entry?.skipped).length;
  return {
    vocab: { completed: vocabCompleted, total: counts.vocabulary || 0 },
    grammar: { completed: grammarCompleted, total: counts.grammar || 0 },
    text: { completed: textCompleted, total: counts.sentences || 0 },
    exercises: { completed: exerciseCompleted, total: counts.exercises || 0 },
    weak: { resolved: 0, total: weakTotal },
    audio: { completed: 0, total: 0 },
    started: vocabCompleted > 0 || grammarCompleted > 0 || textCompleted > 0 || exerciseCompleted > 0
  };
}

function moduleCard(title, description, progress, path, module = "") {
  return `
    <article class="module-card" data-nav="${path}">
      <div class="module-card-head">
        <h3>${title}</h3>
        <strong>${progress.completed}/${progress.total}</strong>
      </div>
      <p class="muted">${description}</p>
      ${module ? `<p class="module-time">${studyTimeMinutes(lesson.id, module)} 分钟</p>` : ""}
      ${progressRow("进度", progress.completed, progress.total)}
    </article>
  `;
}

function lessonProgressSummary() {
  const vocab = activeVocabulary();
  const vocabCompleted = vocab.filter((word) => wordLearningState(word.id).mainStatus === "mastered").length;
  const grammarSummaries = lesson.grammar.map((item) => grammarPracticeSummary(item));
  const grammarCompleted = grammarSummaries.filter((item) => item.total > 0 && item.completed === item.total).length;
  const textCompleted = lesson.sentences.filter((sentence) => sentencePracticeState(sentence.id).pronunciationPassed).length;
  const exerciseCompleted = state.exerciseResults.filter((item) => lesson.exercises.some((exercise) => exercise.id === item.exerciseId)).length;
  const weakTotal = activeWrongItems().length + weakInteractionItems().length;
  return {
    vocab: { completed: vocabCompleted, total: vocab.length },
    grammar: { completed: grammarCompleted, total: lesson.grammar.length },
    text: { completed: textCompleted, total: lesson.sentences.length },
    exercises: { completed: exerciseCompleted, total: lesson.exercises.length },
    weak: { resolved: 0, total: weakTotal },
    audio: { completed: 0, total: 0 },
    started: vocabCompleted > 0 || grammarCompleted > 0 || textCompleted > 0 || exerciseCompleted > 0
  };
}

function lessonStudyStatus(summary) {
  const totals = [summary.vocab, summary.grammar, summary.text, summary.exercises];
  const completed = totals.every((item) => item.total > 0 && item.completed >= item.total);
  if (completed) return { label: "已完成", className: "done" };
  if (summary.weak.total > 0) return { label: "需复习", className: "review" };
  if (summary.started) return { label: "学习中", className: "learning" };
  return { label: "未开始", className: "new" };
}

function nextLessonStep(summary) {
  if (summary.vocab.completed < summary.vocab.total) return { label: "继续单词", path: `/lesson/${lesson.id}/vocab` };
  if (summary.grammar.completed < summary.grammar.total) return { label: "进入语法", path: `/lesson/${lesson.id}/grammar` };
  if (summary.text.completed < summary.text.total) return { label: "进入课文", path: `/lesson/${lesson.id}/text` };
  if (summary.exercises.completed < summary.exercises.total) return { label: "开始练习", path: `/lesson/${lesson.id}/exercises` };
  return { label: "查看结果", path: `/lesson/${lesson.id}/result` };
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

function vocabFocusToggle() {
  return `
    <label class="toggle-control">
      <input type="checkbox" data-vocab-focus-only ${state.vocabFocusOnly ? "checked" : ""} />
      <span>只看收藏和弱项</span>
    </label>
  `;
}

function wordHasLearningRecord(wordId) {
  return wordLearningState(wordId).mainStatus !== "new";
}

function vocabReadyForTest() {
  const words = vocabStudyWords();
  return Boolean(words.length) && words.every((word) => wordHasLearningRecord(word.id));
}

function ensureVocabTestQueue() {
  const words = vocabStudyWords().filter((word) => !wordLearningState(word.id).slashed);
  const expectedTasks = words.flatMap((word) => [
    ...(wordHasMeaningfulCnChoice(word) ? [{ id: `${word.id}:wordToMeaning`, wordId: word.id, type: "wordToMeaning" }] : []),
    { id: `${word.id}:audioToWord`, wordId: word.id, type: "audioToWord" }
  ]).sort((a, b) => stableOptionOrder(`${a.id}:test`) - stableOptionOrder(`${b.id}:test`));
  const expectedIds = expectedTasks.map((task) => task.id).join("|");
  const valid = Array.isArray(state.vocabTestQueue)
    && state.vocabTestQueue.map((task) => task?.id).join("|") === expectedIds
    && state.vocabTestQueue.every((task) => task?.wordId && task?.type && !wordLearningState(task.wordId).slashed);
  if (valid) return;
  state.vocabTestQueue = expectedTasks;
  state.currentVocabTest = 0;
  write(`lesson:${lesson.id}:vocabTestQueue`, state.vocabTestQueue);
  write(`lesson:${lesson.id}:currentVocabTest`, state.currentVocabTest);
}

function currentVocabTestTask() {
  ensureVocabTestQueue();
  if (state.currentVocabTest >= state.vocabTestQueue.length) {
    state.currentVocabTest = Math.max(0, state.vocabTestQueue.length - 1);
    write(`lesson:${lesson.id}:currentVocabTest`, state.currentVocabTest);
  }
  return state.vocabTestQueue[state.currentVocabTest] || null;
}

function startVocabTest() {
  if (!vocabReadyForTest()) {
    state.recallResult = "所有单词都有学习记录后才能进入系统测试。";
    render();
    return;
  }
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
  const vocabWords = vocabStudyWords();
  if (!vocabWords.length) {
    return layout(`
      <div class="page-head">
        <div>
          <p class="eyebrow">${lesson.title} · 单词预热</p>
          <h2>没有符合条件的单词</h2>
          <p>当前已开启“只看收藏和弱项”，但还没有收藏单词或弱项记录。</p>
        </div>
        <div class="button-row">
          ${studyTimeBadge("vocab")}
          ${vocabFocusToggle()}
        </div>
      </div>
      <section class="panel favorite-empty">
        <p class="muted">关闭筛选后可以继续查看全部单词。</p>
      </section>
    `);
  }
  if (state.currentWord >= vocabWords.length) state.currentWord = 0;
  const word = vocabWords[state.currentWord] || vocabWords[0];
  const learning = wordLearningState(word.id);
  const favorite = isFavorite("word", word.id);
  const finished = vocabWords.every((item) => wordLearningState(item.id).mainStatus === "mastered");
  const weakItems = vocabWords.filter((item) => wordLearningState(item.id).mainStatus === "review");
  const testing = state.vocabPhase === "test";
  const readyForTest = vocabReadyForTest();
  const wordsWithoutRecord = vocabWords.length - vocabWords.filter((item) => wordHasLearningRecord(item.id)).length;
  const task = testing ? currentVocabTestTask() : null;
  return layout(`
    <div class="page-head">
      <div>
        <p class="eyebrow">${lesson.title} · 单词预热</p>
        <h2>${testing ? "全词表打乱测试" : "先完成全量发音预热"}</h2>
        <p>${testing ? "测试阶段不会展示假名、释义或右侧词表，避免短期提示干扰结果。" : "所有单词先走一遍听音和发音评价，再进入系统测试。"}</p>
      </div>
      <div class="button-row">
        ${studyTimeBadge("vocab")}
        ${vocabFocusToggle()}
        ${!testing ? `<button class="primary" data-start-vocab-test ${readyForTest ? "" : "disabled"}>进入系统测试</button>` : ""}
        <button class="primary ${finished ? "emphasis" : ""}" data-nav="/lesson/${lesson.id}/grammar">进入语法</button>
      </div>
    </div>
    <section class="focus-layout">
      <div>
        <article class="panel word-focus">
          ${testing ? vocabTestPanel(task) : `
            <button class="favorite-star word-favorite-star ${favorite ? "active" : ""}" type="button" aria-label="${favorite ? "取消收藏" : "收藏单词"}" title="${favorite ? "取消收藏" : "收藏单词"}" data-toggle-word-favorite="${word.id}">${favorite ? "★" : "☆"}</button>
            <div class="word-count">${Math.min(state.currentWord + 1, vocabWords.length)}/${vocabWords.length}</div>
            <div class="kana">${word.kana}</div>
            <div class="jp-large">${word.jp}</div>
            <div class="meaning">${word.cn}</div>
            <p class="hint"><span class="kbd">←</span><span class="kbd">→</span> 切换单词，切换后会播放标准音</p>
            <div class="word-diagnostic-line">
              <strong>${wordStatusLabel(word)}</strong>
              ${wordTagBadges(learning.diagnosticTags)}
            </div>
            ${pronunciationPanel(word)}
            <div class="button-row word-step-row">
              <button class="secondary" data-prev-pronunciation-word ${state.currentWord <= 0 ? "disabled" : ""}>上一个单词</button>
              <button class="primary" data-next-pronunciation-word>${state.currentWord === vocabWords.length - 1 ? "完成预热" : "下一个单词"}</button>
            </div>
          `}
        </article>
        ${testing ? "" : `<div class="rail">
          ${vocabWords.map((item, index) => `
            <button class="${index === state.currentWord ? "current" : ""} ${wordLearningState(item.id).mainStatus === "mastered" ? "done" : ""}" data-word-index="${index}">
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
          ${readyForTest ? "" : `<p class="hint">还有 ${wordsWithoutRecord} 个单词没有学习记录，全部记录后可进入系统测试。</p>`}
          ${weakItems.length ? `<p class="hint">待复习 ${weakItems.length} 个。系统会保留进阶入口，但建议复习弱项。</p>` : ""}
          <div class="status-list">
            ${vocabWords.map((item, index) => `
              <button class="status-item ${index === state.currentWord ? "current" : ""}" data-word-index="${index}">
                <span>${item.jp} · ${item.cn}</span>
                <strong class="status-${state.wordProgress[item.id]}">${wordStatusLabel(item)}</strong>
              </button>
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
  const optionLabels = ["A", "B", "C", "D"];
  const label = task.type === "audioToWord" ? "听音选日文" : "日文选中文";
  const favorite = isFavorite("word", word.id);
  return `
    <div class="recall-box">
      <span class="label">${label}</span>
      <button class="favorite-star test-favorite-star ${favorite ? "active" : ""}" type="button" aria-label="${favorite ? "取消收藏" : "收藏单词"}" title="${favorite ? "取消收藏" : "收藏单词"}" data-toggle-word-favorite="${word.id}">${favorite ? "★" : "☆"}</button>
      <div class="word-count">${state.currentVocabTest + 1}/${state.vocabTestQueue.length}</div>
      <h3>${task.type === "audioToWord" ? "听音频，选择对应日文" : word.jp}</h3>
      <div class="button-row">
        ${task.type === "audioToWord" ? `<button class="secondary" data-speak="${word.jp}" data-audio="${audioUrl("word", word.id)}">播放题目音频</button>` : ""}
        <button class="danger" data-slash-word="${word.id}" ${state.vocabReveal ? "disabled" : ""}>斩</button>
      </div>
      ${state.vocabReveal && state.vocabReveal.wordId === word.id ? `
        <div class="vocab-reveal ${state.vocabReveal.correct ? "passed" : "failed"}">
          <strong>${word.jp}</strong>
          <span>${word.cn}</span>
          ${state.vocabReveal.correct ? "<small>回答正确，稍后进入下一题。</small>" : `<small>正确答案已显示，稍后进入下一题。${state.vocabReveal.selectedWordId ? ` 你的选择：${wordById(state.vocabReveal.selectedWordId)?.jp || ""}` : ""}</small>`}
        </div>
      ` : ""}
      <div class="choices compact">
        ${options.map((item, index) => {
          const selected = state.vocabReveal?.selectedWordId === item.id;
          const correctAnswer = state.vocabReveal && item.id === word.id;
          const revealed = Boolean(state.vocabReveal);
          const classes = ["choice"];
          if (revealed && correctAnswer) classes.push("correct");
          if (revealed && selected && !correctAnswer) classes.push("wrong");
          return `
            <button class="${classes.join(" ")}" data-word-quiz="${task.type}:${item.id}" ${revealed ? "disabled" : ""}>
              <span class="choice-key">${optionLabels[index]}</span>
              <span>${task.type === "audioToWord" ? item.jp : item.cn}</span>
            </button>
          `;
        }).join("")}
      </div>
      <p class="hint compact-hint">也可以按键盘 A / B / C / D 选择对应选项。</p>
      ${state.recallResult ? `<p class="hint">${state.recallResult}</p>` : ""}
    </div>
  `;
}

function testOptions(word, type) {
  const limited = currentVocabularyLimit() < lesson.vocabulary.length;
  const pool = limited
    ? vocabStudyWords().filter((item) => item.id !== word.id)
    : [...externalWordDistractors, ...lesson.vocabulary.filter((item) => item.id !== word.id)];
  const candidates = pool
    .filter((item) => item.id !== word.id)
    .filter((item) => type !== "wordToMeaning" || wordHasMeaningfulCnChoice(item))
    .map((item) => ({ item, score: wordSimilarity(word, item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);
  return [word, ...candidates].sort((a, b) => stableOptionOrder(a.id) - stableOptionOrder(b.id));
}

function chooseVocabTestOptionByKey(key) {
  if (state.vocabPhase !== "test" || state.vocabReveal) return false;
  const letter = String(key || "").toUpperCase();
  const index = ["A", "B", "C", "D"].indexOf(letter);
  if (index < 0) return false;
  const task = currentVocabTestTask();
  if (!task) return false;
  const word = wordById(task.wordId);
  if (!word) return false;
  const option = testOptions(word, task.type)[index];
  if (!option) return false;
  handleWordQuiz(task.type, option.id);
  return true;
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
  const vocabWords = route().page === "vocab" ? vocabStudyWords() : activeVocabulary();
  const nextIndex = clamp(index, 0, vocabWords.length - 1);
  if (index >= vocabWords.length) {
    startVocabTest();
    return;
  }
  stopCurrentAudio();
  state.currentWord = nextIndex;
  state.vocabPhase = "pronunciation";
  state.recallResult = "";
  state.recordingError = "";
  pendingAutoSpeakWordId = shouldSpeak ? vocabWords[nextIndex]?.id || "" : "";
  render();
}

function textPage() {
  if (!["zh", "ja"].includes(state.textPromptLanguage)) {
    state.textPromptLanguage = "zh";
    writeTextProgress();
  }
  const requested = new URLSearchParams(location.search).get("sentenceId");
  if (requested) {
    const tabId = textTabIdForSentence(requested);
    const index = textSentencesForTab(tabId).findIndex((sentence) => sentence.id === requested);
    if (index >= 0) setTextTab(tabId, index);
    history.replaceState({}, "", lessonPath(`/lesson/${lesson.id}/text`));
  }
  const section = textSectionById(state.textCurrentTab);
  state.currentSentence = textActiveSentenceIndex(section.id);
  const sentences = textSentencesForTab(section.id);
  const sentence = currentTextSentence() || sentences[0] || null;
  const complete = textLessonComplete();
  const progress = textTabProgress(section.id);
  return layout(`
    <div class="page-head text-page-head">
      <div>
        <p class="eyebrow">${lesson.title} · 课文逐句学习</p>
        <h2>先连续读完整段，再回头复盘弱句</h2>
        <p class="hint">当前已通过 ${progress.completed}/${progress.total} 句，${complete ? "所有句子都已通过" : "未通过的句子会标红"}。</p>
      </div>
      <div class="text-head-actions">
        ${studyTimeBadge("text")}
        <div class="text-tab-switch" role="tablist" aria-label="课文分类">
          ${textTabs().map((tab) => `
            <button class="text-tab ${state.textCurrentTab === tab.id ? "active" : ""}" data-text-tab="${tab.id}" type="button">${tab.title}<span>${textTabProgress(tab.id).completed}/${textTabProgress(tab.id).total}</span></button>
          `).join("")}
        </div>
        <div class="text-prompt-switch" aria-label="提示语言">
          <button class="text-lang ${state.textPromptLanguage === "zh" ? "active" : ""}" data-text-prompt-lang="zh" type="button">中文</button>
          <button class="text-lang ${state.textPromptLanguage === "ja" ? "active" : ""}" data-text-prompt-lang="ja" type="button">日语</button>
        </div>
      </div>
    </div>
    <section class="text-stage">
      <div class="text-stage-summary ${complete ? "complete" : ""}">
        <div>
          <span class="label">总体评价</span>
          <strong>${complete ? "所有句子都已达到标准" : `已通过 ${progress.completed}/${progress.total}`}</strong>
        </div>
        <div class="text-stage-summary-meta">
          <span>当前句：${sentence ? sentence.order || sentence.id : "-"}</span>
          <span>${textReviewUnlocked(section.id) ? "可针对弱句重读" : "读完当前课文后显示评分"}</span>
        </div>
      </div>
      <div class="sentence-list">
        ${renderTextStructure(section)}
      </div>
    </section>
  `);
}

function sentencePronunciationResult(practice) {
  const recordingText = practice.pronunciationDuration
    ? `录音 ${practice.pronunciationDuration.toFixed(1)} 秒，音量峰值 ${Number(practice.pronunciationPeak || 0).toFixed(2)}`
    : "";
  return `
    <div class="pronunciation-result ${practice.pronunciationPassed ? "passed" : "failed"}">
      <strong>${practice.pronunciationPassed ? "发音通过" : "发音需复读"}</strong>
      <span>总分 ${practice.pronunciationScore || 0} · 准确 ${practice.accuracyScore || 0} · 流畅 ${practice.fluencyScore || 0} · 完整 ${practice.completenessScore || 0}${recordingText ? ` · ${recordingText}` : ""}</span>
      ${practice.pronunciationReasons?.length ? `<small>${practice.pronunciationReasons.join(" / ")}</small>` : ""}
      ${practice.recognizedText ? `
        <div class="diff-box">
          <div><span class="diff-label">你说的是</span><p class="diff-line">${escapeHtml(practice.recognizedText)}</p></div>
        </div>
      ` : ""}
    </div>
  `;
}

function textTabs() {
  return textStructure.map((section) => ({ id: section.id, title: section.title }));
}

function textGroupProgress(ids) {
  const total = ids.length;
  const completed = ids.filter((id) => sentencePracticeState(id).pronunciationPassed).length;
  return `${completed}/${total}`;
}

function renderTextStructure(section) {
  if (!section) return "";
  return textSectionGroups(section).map((group) => `
    <section class="text-section">
      <div class="text-group-title">
        <span>${escapeHtml(group.title)}${group.note ? `<small>${escapeHtml(group.note)}</small>` : ""}</span>
        <span class="text-group-progress">${textGroupProgress(group.ids)}</span>
      </div>
      <div class="${group.kind === "statements" ? "statement-group" : "dialogue-group"}">
        ${group.ids.map((id) => {
          const sentence = sentenceById(id);
          const index = textSentencesForTab(section.id).findIndex((item) => item.id === id);
          return sentence ? sentenceListItem(sentence, index, section.id) : "";
        }).join("")}
      </div>
    </section>
  `).join("");
}

function sentenceListItem(item, index, tabId) {
  const practice = sentencePracticeState(item.id);
  const current = tabId === state.textCurrentTab && index === state.currentSentence ? "current" : "";
  const stateClass = practice.pronunciationAttempts === 0 ? "new" : practice.pronunciationPassed ? "done" : "failed";
  const status = practice.pronunciationAttempts === 0 ? "未学" : practice.pronunciationPassed ? "已通过" : "需复读";
  const statusClass = practice.pronunciationAttempts === 0 ? "new" : practice.pronunciationPassed ? "done" : "failed";
  const displayJapanese = state.textPromptLanguage === "ja";
  const visibleText = displayJapanese ? item.text : item.translation;
  const displayText = displayJapanese ? renderJapaneseText(visibleText, { kana: item.kana }) : escapeHtml(visibleText || "");
  return `
    <article class="sentence-card ${item.speaker ? "dialogue" : "statement"} ${current} ${stateClass}" data-sentence-index="${index}">
      <div class="sentence-card-head">
        ${item.speaker ? `<span class="speaker">${item.speaker}</span>` : ""}
        <div class="sentence-text">
          <div class="${displayJapanese ? "sentence-jp" : "sentence-translation primary"}">${displayText}</div>
        </div>
        <span class="sentence-status ${statusClass}">${status}</span>
      </div>
      ${sentencePracticeBlock(item, tabId, practice, Boolean(current))}
    </article>
  `;
}

function sentencePracticeBlock(item, tabId, practice, current) {
  const attempts = practice.pronunciationAttempts || 0;
  const showScores = textReviewUnlocked(tabId);
  const scoreBlock = showScores && attempts > 0 ? sentencePronunciationResult(practice) : "";
  const audioBlock = attempts > 0 ? `
    <div class="text-recording-row">
      <div class="text-recording-label">${practice.pronunciationPassed ? "本次录音" : "你刚才的录音"}</div>
      ${practice.debugAudioUrl ? `<audio controls src="${practice.debugAudioUrl}"></audio>` : ""}
    </div>
  ` : "";
  const currentControls = current ? `
    <div class="sentence-actions">
      <button class="secondary" data-speak="${item.text}" data-audio="${audioUrl("sentence", item.id)}">听标准音</button>
      <button
        class="hold-record-button ${state.textRecordingPreparingId === item.id ? "preparing" : ""} ${state.textRecordingId === item.id ? "recording" : ""} ${state.textRecordingStoppingId === item.id ? "stopping" : ""}"
        data-hold-record-sentence="${item.id}"
        aria-label="长按跟读"
        ${state.textRecordingStoppingId === item.id ? "disabled" : ""}
      >
        <span class="record-icon"></span>
        <span>${state.textRecordingStoppingId === item.id ? "正在评价" : state.textRecordingId === item.id ? "正在说话" : state.textRecordingPreparingId === item.id ? "准备中" : "长按跟读"}</span>
      </button>
    </div>
  ` : "";
  return `
    <div class="sentence-card-body">
      ${currentControls}
      ${current && state.textRecordingError ? `<p class="hint danger-text">${state.textRecordingError}</p>` : ""}
      ${audioBlock}
      ${scoreBlock}
      ${showScores && attempts > 0 && !practice.pronunciationPassed ? `<div class="text-weak-hint">此句未通过，点开后重读直到通过。</div>` : ""}
      ${showScores && attempts > 0 ? "" : ""}
    </div>
  `;
}

function sentencePosition(sentenceId) {
  for (const section of textStructure) {
    for (const group of textSectionGroups(section)) {
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
      <span class="jp-text">${renderJapaneseText(jp, { kana: sentence?.kana })}</span>
      <span class="cn-text">${escapeHtml(cn)}</span>
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
      <div class="button-row">
        ${studyTimeBadge("grammar")}
        <button class="primary" data-nav="/lesson/${lesson.id}/exercises">开始练习</button>
      </div>
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
  const grammarExamples = normalizedGrammarExtraExamples(grammar);
  const correctGrammarExamples = grammarExamples.filter((example) => !example.isIncorrect);
  const relatedSentenceItems = (grammar.examples || [])
    .map((id) => ({ kind: "core", id, sentence: sentenceById(id) }))
    .filter((item) => item.sentence);
  const coreItems = correctGrammarExamples.map((example) => ({
    kind: "extra",
    id: `extra-${example.sourceIndex}`,
    sentence: { id: `extra-${example.sourceIndex}`, text: example.text, kana: "", translation: example.translation },
    example,
    extraSourceIndex: example.sourceIndex
  }));
  const fallbackCoreItems = coreItems.length ? [] : relatedSentenceItems;
  const supplementalExamples = coreItems.length ? relatedSentenceItems.map((item) => ({
    id: item.id,
    text: item.sentence.text,
    kana: item.sentence.kana,
    translation: item.sentence.translation,
    audioId: item.id,
    sourceLabel: sentencePosition(item.id)
  })) : [];
  return {
    items: coreItems.length ? coreItems : fallbackCoreItems,
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

function grammarExamplePromptText(sentence) {
  return sentence.translation || sentence.cn || "请将中文翻译成日语。";
}

function grammarDetail(grammar) {
  const relatedExercises = lesson.exercises
    .map((exercise, index) => ({ exercise, index }))
    .filter(({ exercise }) => exercise.relatedGrammar.includes(grammar.id));
  const { items: practiceItems, supplementalExamples } = grammarPracticeItems(grammar);
  const progress = grammarPracticeSummary(grammar);
  const supplementCount = supplementalExamples.length;
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
                  <span class="sentence supplemental-preview">${sentenceHoverContent({ text: example.text, kana: example.kana, translation: example.translation })}</span>
                  <button class="icon-button" aria-label="播放补充例句" title="播放补充例句" data-speak="${example.text}" data-audio="${audioUrl("sentence", example.audioId)}">🔊</button>
                </div>
                ${example.sourceLabel ? `<small class="muted">${example.sourceLabel}</small>` : ""}
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
              <span class="related-exercise-title">${escapeHtml(exercise.groupTitle)} · ${exerciseQuestionHtml(exercise)}</span>
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
  const ready = practice.submitted;
  const mastered = grammarPracticeMastered(practice);
  const judgementReady = ready && practice.pronunciationAttempts > 0;
  const statusClass = mastered ? "passed" : judgementReady ? "failed" : "pending";
  const targetText = sentence.text;
  const locationText = item.kind === "extra" ? "补充例句" : sentencePosition(sentence.id);
  const collapsed = Boolean(practice.collapsed);
  const promptText = grammarExamplePromptText(sentence);
  return `
    <article class="grammar-practice-card ${statusClass} ${collapsed ? "collapsed" : ""}">
      <div class="grammar-practice-head">
        <div class="grammar-practice-head-main">
          <span class="grammar-practice-no">${index + 1}</span>
          <div>
            <strong>${promptText}</strong>
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
          <div class="diff-line">翻译结果：${practice.correct ? "正确" : "错误"}；标准答案：${renderJapaneseText(targetText, { kana: sentence.kana })}</div>
        </div>
      ` : ""}
      <div class="grammar-practice-body ${collapsed ? "collapsed" : ""}">
        <div class="grammar-practice-cloze grammar-prompt-cn">${escapeHtml(promptText)}</div>
        <div class="grammar-practice-form">
          <input class="answer-input" data-grammar-answer="${grammarPracticeKey(grammar.id, item.id)}" value="${escapeHtml(practice.answer || "")}" placeholder="翻译中文为日语" />
          <button class="primary" data-grammar-check="${grammarPracticeKey(grammar.id, item.id)}">检查</button>
        </div>
        ${grammarPronunciationPanel(grammar, item)}
      ${judgementReady ? `
        <div class="grammar-practice-result ${mastered ? "passed" : "failed"}">
          <strong>${mastered ? "已会" : "需复习"}</strong>
          <span>${mastered ? "翻译和跟读都已通过。" : practice.correct ? "翻译已对，继续完成跟读。" : "先把中文翻成日语，再进行跟读。"} </span>
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
        <button class="secondary" data-speak="${sentence.text}" data-audio="${grammarPracticeAudioUrl(grammar, item)}">听标准音</button>
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

function grammarPracticeAudioUrl(grammar, item) {
  if (Number.isInteger(item.extraSourceIndex)) return extraExampleAudioUrl(grammar.id, item.extraSourceIndex);
  return audioUrl("sentence", item.sentence.id);
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
  const target = item.sentence?.text || "";
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
  const extraIndex = Number(String(exampleId).replace(/^extra-/, ""));
  if (Number.isInteger(extraIndex)) {
    const extra = normalizedGrammarExtraExamples(grammar).find((example) => example.sourceIndex === extraIndex);
    if (extra && !extra.isIncorrect) {
      return {
        kind: "extra",
        id: exampleId,
        sentence: { id: exampleId, text: extra.text, kana: "", translation: extra.translation },
        example: extra,
        extraSourceIndex: extra.sourceIndex
      };
    }
  }
  const core = (grammar.examples || []).find((id) => id === exampleId);
  if (core) {
    const sentence = sentenceById(core);
    if (sentence) return { kind: "core", id: core, sentence };
  }
  return null;
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

const initBuckets = [
  { id: "text", label: "课文", hint: "基本课文、应用课文、对话和翻译。" },
  { id: "grammar", label: "语法", hint: "语法解释、接续、用法、教材例句和补充例句。" },
  { id: "vocabulary", label: "单词", hint: "单词表、假名、中文释义。" },
  { id: "word", label: "单词页", hint: "单词专页或补充词汇页。" },
  { id: "exercises", label: "练习", hint: "练习题、例题、选项、答案和说明，题目不能丢。" }
];

function initLessonId() {
  return route().lessonId || "";
}

function initCatalogItem() {
  const id = initLessonId();
  return lessonCatalog.find((item) => String(item.id) === String(id)) || { id, title: `第${id}课`, subtitle: "待初始化" };
}

function initDraftSummary(draft) {
  if (!draft) return null;
  return {
    vocabulary: draft.vocabulary?.length || 0,
    sentences: draft.sentences?.length || 0,
    grammar: draft.grammar?.length || 0,
    exercises: draft.exercises?.length || 0
  };
}

function initImportPreview() {
  if (!state.initImportJson?.trim()) return null;
  try {
    return initDraftSummary(JSON.parse(state.initImportJson));
  } catch {
    return { invalid: true };
  }
}

function initStepState(status) {
  const parseConfirmed = Boolean(status?.state?.parseConfirmed);
  const audioConfirmed = Boolean(status?.state?.audioConfirmed);
  const lessonSaved = Boolean(status?.lessonSaved);
  const audioComplete = Boolean(status?.audio?.total) && !status?.audio?.missing;
  return {
    parse: audioConfirmed || parseConfirmed || lessonSaved ? "done" : status?.draft ? "review" : "active",
    audio: audioConfirmed ? "done" : parseConfirmed || lessonSaved || audioComplete ? "active" : "locked"
  };
}

function initStepBadge(value) {
  return {
    active: "进行中",
    review: "待确认",
    locked: "未开始",
    done: "已确认"
  }[value] || "未开始";
}

function initPage() {
  const item = initCatalogItem();
  const status = state.initStatus;
  const draft = status?.draft;
  const inferredImages = initBuckets.some((bucket) => (status?.images?.[bucket.id] || []).some((image) => image.source === "by-lesson"));
  const codexTask = status?.codexTask || status?.state?.codexTaskPath ? {
    taskPath: status?.codexTask?.taskPath || status?.state?.codexTaskPath,
    taskUrl: status?.codexTask?.taskUrl || `/data/lesson-init/lesson${item.id}-codex-task.md`,
    draftPath: status?.codexTask?.draftPath || status?.state?.draftPath
  } : null;
  const summary = initDraftSummary(draft);
  const steps = initStepState(status);
  const audio = status?.audio || { items: [], generated: 0, missing: 0, total: 0 };
  const lessonSaved = Boolean(status?.lessonSaved);
  const hasConfirmedOrSavedLesson = Boolean(status?.state?.parseConfirmed || lessonSaved);
  const canConfirmAudio = Boolean((hasConfirmedOrSavedLesson || audio.total) && audio.total && !audio.missing && !state.initBusy);
  const audioHint = initAudioHint(status, audio);
  const draftText = draft ? escapeHtml(JSON.stringify(draft, null, 2)) : "";
  return layout(`
    <section class="init-page">
      <div class="page-head init-page-head">
        <div>
          <p class="eyebrow">${item.title} · 课程初始化</p>
          <h1>${item.subtitle}</h1>
          <p class="lead">${inferredImages ? "系统已从 course-assets/by-lesson 自动匹配教材图片。直接生成 Codex 解析任务，确认无误后再生成标准音频。" : "先上传教材图片并解析为课程数据，确认无误后再生成所有标准音频。"}</p>
        </div>
        <div class="button-row">
          <button class="secondary" data-nav="/">返回首页</button>
        </div>
      </div>
      ${state.initMessage ? `<p class="hint">${escapeHtml(state.initMessage)}</p>` : ""}
      ${state.initBusy ? `<div class="locked-panel init-busy-panel ${isInitAudioBusy() ? "loading" : ""}">${isInitAudioBusy() ? "<span class=\"loading-spinner\" aria-hidden=\"true\"></span>" : ""}<span>${escapeHtml(state.initBusy)}</span></div>` : ""}
      <div class="init-steps">
        <article class="panel init-step ${steps.parse}">
          <div class="init-step-head">
            <div>
              <span class="course-status ${steps.parse === "done" ? "done" : steps.parse === "review" ? "review" : "learning"}">${initStepBadge(steps.parse)}</span>
              <h2>1. 图片解析</h2>
            </div>
            <div class="button-row">
              <button class="primary" data-init-parse ${state.initBusy ? "disabled" : ""}>生成 Codex 解析任务</button>
              <button class="secondary" data-init-refresh ${state.initBusy ? "disabled" : ""}>刷新结果</button>
            </div>
          </div>
          <div class="init-upload-grid">
            ${initBuckets.map((bucket) => initUploadBox(bucket, status?.images?.[bucket.id] || [])).join("")}
          </div>
          ${codexTask && !summary ? `
            <div class="init-task-box">
              <h3>Codex CLI 解析任务已生成</h3>
              <p class="muted">任务文件：<a href="${codexTask.taskUrl}" target="_blank">${escapeHtml(codexTask.taskPath)}</a></p>
              <p class="muted">预期输出：${escapeHtml(codexTask.draftPath || "")}</p>
              ${status?.state?.codexCommand ? `<pre class="command-box">${escapeHtml(status.state.codexCommand)}</pre>` : ""}
              <p class="hint">在当前 Codex 会话里让我执行这个任务，或在终端运行上面的命令。完成后点击“刷新结果”。</p>
            </div>
          ` : ""}
          ${initJsonImportBox()}
          ${summary ? `
            <div class="audio-summary init-summary">
              <div><span>单词</span><strong>${summary.vocabulary}</strong></div>
              <div><span>课文句子</span><strong>${summary.sentences}</strong></div>
              <div><span>语法</span><strong>${summary.grammar}</strong></div>
              <div><span>练习</span><strong>${summary.exercises}</strong></div>
            </div>
            <textarea class="init-draft-json" data-init-draft-json spellcheck="false">${draftText}</textarea>
            <div class="button-row">
              <button class="primary" data-init-confirm-parse ${state.initBusy ? "disabled" : ""}>确认解析结果</button>
            </div>
          ` : `<p class="muted">${inferredImages ? "已自动匹配教材图片。点击“生成 Codex 解析任务”即可得到可执行命令；确认前请重点检查练习题、语法例句和课文句子是否完整。" : "上传图片后生成 Codex 解析任务。确认前请重点检查练习题、语法例句和课文句子是否完整。"}</p>`}
        </article>

        <article class="panel init-step ${steps.audio}">
          <div class="init-step-head">
            <div>
              <span class="course-status ${steps.audio === "done" ? "done" : steps.audio === "active" ? "learning" : "pending"}">${initStepBadge(steps.audio)}</span>
              <h2>2. 音频生成</h2>
            </div>
            <div class="button-row">
              <button class="primary" data-init-generate-audio ${!hasConfirmedOrSavedLesson || state.initBusy || !audio.missing ? "disabled" : ""}>生成缺失 ${audio.missing || 0}</button>
              <button class="secondary" data-init-confirm-audio ${canConfirmAudio ? "" : "disabled"}>确认音频</button>
            </div>
          </div>
          ${audioHint ? `<p class="hint">${escapeHtml(audioHint)}</p>` : ""}
          <div class="audio-summary init-summary">
            <div><span>已生成</span><strong>${audio.generated || 0}</strong></div>
            <div><span>缺失</span><strong>${audio.missing || 0}</strong></div>
            <div><span>总计</span><strong>${audio.total || 0}</strong></div>
          </div>
          <div class="audio-item-list init-audio-list">
            ${audio.items?.length ? audio.items.map((item) => initAudioRow(item)).join("") : "<span class='muted'>确认解析结果后会列出所有待生成音频。</span>"}
          </div>
        </article>
      </div>
    </section>
  `);
}

function initAudioHint(status, audio) {
  const lessonSaved = Boolean(status?.lessonSaved);
  const hasConfirmedOrSavedLesson = Boolean(status?.state?.parseConfirmed || lessonSaved);
  if (!status?.draft && !lessonSaved) return "音频生成会在导入或解析出 JSON 草稿后计算待生成项目。";
  if (!hasConfirmedOrSavedLesson) return "已经有 JSON 草稿，但还没有确认解析结果。请先审核草稿并点击“确认解析结果”，确认后才能生成音频。";
  if (!audio.total) return "已确认课程数据，但没有可生成的日语音频项目。请检查 JSON 中的 vocabulary、sentences、grammar.extraExamples、exercises.answer/referenceAnswers。";
  if (!audio.missing) return "音频已完整，可以确认音频。";
  return "";
}

function isInitAudioBusy() {
  return /^正在(?:并行发起|生成音频)/.test(state.initBusy || "");
}

function initJsonImportBox() {
  const preview = initImportPreview();
  return `
    <div class="init-task-box">
      <h3>人工导入 JSON 草稿</h3>
      <p class="muted">这条路径跳过图片 OCR。先把 JSON 放进文本框，再点击“导入文本框为草稿”。导入后还要审核并点击“确认解析结果”，音频生成才会解锁。</p>
      <textarea class="init-import-json" data-init-import-json spellcheck="false" placeholder="粘贴 lesson JSON，或点击“读取 JSON 文件到文本框”">${escapeHtml(state.initImportJson || "")}</textarea>
      ${preview ? initImportPreviewLine(preview) : ""}
      <div class="button-row">
        <button class="secondary" type="button" data-init-json-file-trigger ${state.initBusy ? "disabled" : ""}>读取 JSON 文件到文本框</button>
        <button class="primary" type="button" data-init-import-json-submit ${state.initBusy || !state.initImportJson?.trim() ? "disabled" : ""}>导入文本框为草稿</button>
      </div>
      <input class="init-upload-input" type="file" accept="application/json,.json" data-init-json-file ${state.initBusy ? "disabled" : ""} />
    </div>
  `;
}

function initImportPreviewLine(preview) {
  if (preview.invalid) return `<p class="hint danger-text">文本框里的内容还不是合法 JSON，暂不能导入。</p>`;
  return `
    <div class="init-preview-line">
      <span>待导入预览</span>
      <strong>单词 ${preview.vocabulary}</strong>
      <strong>句子 ${preview.sentences}</strong>
      <strong>语法 ${preview.grammar}</strong>
      <strong>练习 ${preview.exercises}</strong>
    </div>
  `;
}

function initUploadBox(bucket, images) {
  const inputId = `init-upload-${bucket.id}`;
  const inferred = images.some((image) => image.source === "by-lesson");
  return `
    <div class="init-upload-box ${inferred ? "inferred" : ""}">
      <div>
        <h3>${bucket.label}${inferred ? "<small>自动匹配</small>" : ""}</h3>
        <p class="muted">${bucket.hint}</p>
      </div>
      ${inferred ? "" : `
        <button class="secondary init-upload-button" type="button" data-init-upload-trigger="${bucket.id}" ${state.initBusy ? "disabled" : ""}>选择文件</button>
        <input id="${inputId}" class="init-upload-input" type="file" accept="image/*" multiple data-init-upload="${bucket.id}" ${state.initBusy ? "disabled" : ""} />
      `}
      <div class="init-image-list">
        ${images.length ? images.map((image) => `<a href="${image.url}" target="_blank">${image.index ? `<span>#${image.index}</span>` : ""}${escapeHtml(image.name)}</a>`).join("") : "<span class='muted'>尚未上传</span>"}
      </div>
    </div>
  `;
}

function initAudioRow(item) {
  const label = item.type === "word" ? "单词" : item.type === "exercise" ? "练习" : "句子";
  return `
    <div class="audio-asset-row ${item.exists ? "ready" : "missing"}" ${item.exists ? `data-speak="${escapeHtml(item.text)}" data-audio="${item.url}"` : ""}>
      <span class="audio-type">${label}</span>
      <span class="audio-title">${escapeHtml(item.label || item.text || item.id)}</span>
      <span class="audio-state">${item.exists ? "已生成" : "未生成"}</span>
      <button class="secondary compact-action" ${item.exists ? "" : "disabled"}>播放</button>
    </div>
  `;
}

function exerciseGroups() {
  const map = new Map();
  lesson.exercises.forEach((exercise) => {
    const key = exercise.groupId || exercise.id;
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        title: exercise.groupTitle || "练习",
        category: exercise.category,
        instruction: exercise.instruction,
        example: exercise.example,
        items: []
      });
    }
    map.get(key).items.push(exercise);
  });
  return [...map.values()];
}

function currentExerciseGroup() {
  const groups = exerciseGroups();
  const index = Math.min(Math.max(Number(state.currentExerciseGroup) || 0, 0), groups.length - 1);
  state.currentExerciseGroup = index;
  return groups[index];
}

function exerciseResultById(exerciseId) {
  return state.exerciseResults.find((item) => item.exerciseId === exerciseId);
}

function exerciseGroupStatus(group) {
  const complete = Boolean(state.exerciseGroupSubmitted[group.id]) && group.items.every((exercise) => exerciseResultById(exercise.id));
  if (!complete) return { status: "pending", label: "未完成", correct: 0, scored: 0 };
  const results = group.items.map((exercise) => exerciseResultById(exercise.id)).filter(Boolean);
  const scored = results.filter((item) => !item.isSkipped);
  const wrong = scored.filter((item) => !item.isCorrect);
  if (wrong.length) return { status: "wrong", label: "有错题", correct: scored.length - wrong.length, scored: scored.length };
  return { status: "passed", label: "全通过", correct: scored.length, scored: scored.length };
}

function exerciseProgressSummary(groups) {
  const statuses = groups.map(exerciseGroupStatus);
  const completed = statuses.filter((item) => item.status !== "pending").length;
  const passed = statuses.filter((item) => item.status === "passed").length;
  const wrong = statuses.filter((item) => item.status === "wrong").length;
  return { total: groups.length, completed, passed, wrong, pending: groups.length - completed };
}

function activeWrongItems(includeResolved = false) {
  return Object.values(state.wrongBook)
    .filter((item) => includeResolved || item.status !== "resolved")
    .sort((a, b) => {
      const statusOrder = { active: 0, reviewing: 1, resolved: 2 };
      return (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9)
        || String(b.lastWrongAt || b.lastPracticedAt || "").localeCompare(String(a.lastWrongAt || a.lastPracticedAt || ""));
    });
}

function exercisesPage() {
  const groups = exerciseGroups();
  const group = currentExerciseGroup();
  const summary = exerciseProgressSummary(groups);
  const groupStatus = exerciseGroupStatus(group);
  const submitted = Boolean(state.exerciseGroupSubmitted[group.id]) && group.items.every((exercise) => exerciseResultById(exercise.id));
  const results = group.items.map((exercise) => exerciseResultById(exercise.id)).filter(Boolean);
  const scored = results.filter((item) => !item.isSkipped);
  const correct = scored.filter((item) => item.isCorrect).length;
  return layout(`
    <section class="exercise-box">
      <div class="page-head">
        <div>
          <p class="eyebrow">${lesson.title} · 标准练习题</p>
          <h2>${group.title}</h2>
          <p>${group.category} · 大题 ${state.currentExerciseGroup + 1} / ${groups.length} · 小题 ${group.items.length} 道</p>
        </div>
        <div class="button-row">
          ${studyTimeBadge("exercises")}
          <button class="secondary" data-nav="/lesson/${lesson.id}/wrongbook">错题集 ${activeWrongItems().length}</button>
          <button class="secondary" data-nav="/lesson/${lesson.id}/result">查看结果</button>
        </div>
      </div>
      ${exerciseProgressOverview(groups, summary)}
      <div class="exercise-workspace">
        <article class="panel exercise-main-panel">
          <div class="exercise-context">
            <span class="exercise-badge">${group.category}</span>
            <div class="meta-line">
              <span class="label">要求</span>
              <span>${group.instruction}${exerciseGroupAnswerGuidance(group) ? ` ${exerciseGroupAnswerGuidance(group)}` : ""}</span>
            </div>
            ${submitted ? `<div class="group-score">本大题 ${correct} / ${scored.length || group.items.length} 正确</div>` : ""}
          </div>
          <div class="exercise-group-list">
            ${exerciseGroupItems(group, submitted)}
          </div>
        </article>
        <aside class="panel exercise-action-panel">
          <div class="exercise-action-sticky">
            <span class="exercise-action-label">当前大题</span>
            <strong>${group.title}</strong>
            <small>${group.category} · ${groupStatus.label}${groupStatus.scored ? ` · ${groupStatus.correct}/${groupStatus.scored}` : ""}</small>
            <div class="exercise-action-buttons">
              <button class="secondary" data-prev-exercise-group ${state.currentExerciseGroup === 0 ? "disabled" : ""}>上一大题</button>
              <button class="primary" data-submit-exercise-group ${submitted ? "disabled" : ""}>提交本大题</button>
              <button class="secondary" data-next-exercise-group>${state.currentExerciseGroup === groups.length - 1 ? "进入结果页" : "下一大题"}</button>
            </div>
            <div class="exercise-notes-area">
              <span class="exercise-action-label">笔记</span>
              <div class="exercise-notes-textarea" data-exercise-group-note contenteditable="true" data-placeholder="记录学习笔记...">${parseMarkdown(read(`lesson:${lesson.id}:exerciseGroupNotes:${group.id}`, ""))}</div>
            </div>
          </div>
        </aside>
      </div>
      ${submitted ? exerciseGroupFeedback(group) : ""}
    </section>
  `);
}

function exerciseProgressOverview(groups, summary) {
  return `
    <section class="exercise-progress-overview" aria-label="练习进展概览">
      <div class="exercise-progress-summary">
        <span>大题进展</span>
        <strong>${summary.completed}/${summary.total} 完成 · ${summary.passed} 全通过 · ${summary.wrong} 有错题 · ${summary.pending} 未完成</strong>
      </div>
      <div class="exercise-progress-nav">
        ${groups.map((group, index) => {
          const status = exerciseGroupStatus(group);
          const active = index === state.currentExerciseGroup;
          return `
            <button class="exercise-progress-chip ${status.status} ${active ? "active" : ""}" data-exercise-group-index="${index}" type="button" title="${group.title} · ${status.label}">
              <span class="progress-chip-no">${index + 1}</span>
              <span class="progress-chip-state">${status.label}</span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function exerciseType(type) {
  return { fill: "填空题", choice: "选择题", translation: "翻译题", sentence_making: "造句题", listening: "听力题" }[type];
}

function exerciseGroupItem(exercise, index, submitted) {
  const result = exerciseResultById(exercise.id);
  const answer = state.exerciseGroupAnswers[exercise.id] || "";
  return `
    <article class="exercise-item ${submitted && result?.isCorrect ? "passed" : submitted && !result?.isCorrect ? "wrong" : ""}">
      <div class="exercise-item-head">
        <span class="related-exercise-no">${index + 1}</span>
        <div class="question">${exerciseQuestionHtml(exercise)}</div>
        ${submitted && result ? `<span class="practice-status ${result.isCorrect ? "success" : "danger"}">${result.isSkipped ? "已记录" : result.isCorrect ? "正确" : "错误"}</span>` : ""}
      </div>
      ${exerciseAnswerGuidance(exercise) ? `<p class="answer-guidance">${exerciseAnswerGuidance(exercise)}</p>` : ""}
      ${answerControl(exercise, answer, { id: exercise.id, mode: "group", disabled: submitted })}
    </article>
  `;
}

function exerciseRequiresFullSentence(exercise) {
  return ["i-4", "ii-3"].includes(exercise.groupId);
}

function exerciseAnswerGuidance(exercise) {
  if (!exerciseRequiresFullSentence(exercise)) return "";
  return "请写出完整句子，并包含句末标点。不要只填写变形或替换后的片段。";
}

function exerciseGroupAnswerGuidance(group) {
  if (!group.items.some(exerciseRequiresFullSentence)) return "";
  return "作答时请写完整句子，并保留句末标点。";
}

function exerciseGroupItems(group, submitted) {
  let previousKey = "";
  return group.items.map((exercise, index) => {
    const key = `${exercise.category || ""}:${exercise.example || ""}`;
    const section = key !== previousKey ? exerciseExampleSection({ exercise, category: exercise.category, examples: [exercise.example] }) : "";
    previousKey = key;
    return `${section}${exerciseGroupItem(exercise, index, submitted)}`;
  }).join("");
}

function exerciseExampleSection({ exercise, category, examples }) {
  const validExamples = (examples || []).filter(Boolean);
  if (!validExamples.length) return "";
  return `
    <div class="exercise-example-section">
      <span>${category}</span>
      <div class="exercise-example-lines">
        ${validExamples.map((example) => `<div class="exercise-example">${formatExerciseExample(example, exercise)}</div>`).join("")}
      </div>
    </div>
  `;
}

function formatExerciseExample(example, exercise = null) {
  return exercise ? exerciseExampleHtml(exercise, example) : renderExerciseText(example, { exampleBreaks: true });
}

function answerControl(exercise, value = "", options = {}) {
  const mode = options.mode || "single";
  const disabled = options.disabled ? "disabled" : "";
  if (exercise.audioRequired) {
    return `<div class="answer-input muted">等待录音材料后补充作答。</div>`;
  }
  if (exercise.type === "choice") {
    return `
      <select class="answer-input choice-select" data-${mode}-answer data-exercise-id="${options.id || exercise.id}" ${disabled}>
        <option value="">选择答案</option>
        ${exercise.choices.map((choice) => `<option value="${escapeHtml(choice)}" ${value === choice ? "selected" : ""}>${escapeHtml(choice)}</option>`).join("")}
      </select>
    `;
  }
  if (exercise.type === "sentence_making") {
    return `<textarea class="answer-input" data-${mode}-answer data-exercise-id="${options.id || exercise.id}" placeholder="输入你的造句" ${disabled}>${escapeHtml(value)}</textarea>`;
  }
  const placeholder = exerciseRequiresFullSentence(exercise) ? "输入完整句子，包含句末标点" : "输入答案";
  return `<input class="answer-input" data-${mode}-answer data-exercise-id="${options.id || exercise.id}" value="${escapeHtml(value)}" placeholder="${placeholder}" ${disabled} />`;
}

function buildFeedback(exercise, answer) {
  const now = new Date().toISOString();
  if (exercise.audioRequired || exercise.hasAnswer === false) {
    return {
      exerciseId: exercise.id,
      groupId: exercise.groupId,
      userAnswer: "",
      isCorrect: true,
      isSkipped: true,
      relatedGrammar: exercise.relatedGrammar,
      relatedSentences: exercise.relatedSentences,
      createdAt: now
    };
  }
  const correct = isCorrect(exercise, answer);
  return {
    exerciseId: exercise.id,
    groupId: exercise.groupId,
    userAnswer: answer,
    isCorrect: correct,
    relatedGrammar: exercise.relatedGrammar,
    relatedSentences: exercise.relatedSentences,
    createdAt: now
  };
}

function exerciseGroupFeedback(group) {
  const results = group.items.map((exercise) => ({ exercise, result: exerciseResultById(exercise.id) })).filter((item) => item.result);
  const reviewItems = results.filter(({ result }) => result.isSkipped || !result.isCorrect);
  const wrong = reviewItems.filter(({ result }) => !result.isSkipped);
  return `
    <article class="panel feedback">
      <div class="feedback-verdict">
        <strong>本大题反馈</strong>
        <span>${wrong.length ? `有 ${wrong.length} 道错题，已加入错题集。` : reviewItems.length ? "本大题没有错题，以下题目暂不判分。" : "本大题没有错题。"}</span>
      </div>
      ${reviewItems.length ? `
        <div class="exercise-feedback-list">
          ${reviewItems.map(({ exercise, result }) => {
            const originalIndex = group.items.findIndex((item) => item.id === exercise.id);
            return exerciseFeedbackRow(exercise, result, originalIndex);
          }).join("")}
        </div>
      ` : ""}
      <div class="button-row">
        ${wrong.length ? `<button class="primary" data-nav="/lesson/${lesson.id}/wrongbook">只练错题</button>` : ""}
        <button class="secondary" data-next-exercise-group>${state.currentExerciseGroup === exerciseGroups().length - 1 ? "进入结果页" : "进入下一大题"}</button>
      </div>
    </article>
  `;
}

function exerciseFeedbackRow(exercise, result, index) {
  return `
    <div class="exercise-feedback-row ${result.isCorrect ? "passed" : "wrong"}">
      <div class="exercise-item-head">
        <span class="related-exercise-no">${index + 1}</span>
        <div>
          <strong>${result.isSkipped ? "已记录" : result.isCorrect ? "正确" : "错误"}</strong>
          <p>${exerciseQuestionHtml(exercise)}</p>
        </div>
      </div>
      ${meta("你的答案", result.userAnswer ? renderExerciseText(result.userAnswer) : "未作答")}
      ${meta(exercise.type === "sentence_making" ? "参考答案" : "正确答案", exerciseCorrectAnswerHtml(exercise))}
      ${!result.isCorrect ? meta("错误说明", exercise.explanation) : ""}
      <div class="meta-line">
        <span class="label">相关语法</span>
        <div class="tags">${exercise.relatedGrammar.map((id) => grammarTag(id)).join("")}</div>
      </div>
      ${exercise.relatedSentences.length ? `
        <div class="meta-line">
          <span class="label">相关课文</span>
          <div class="tags">${exercise.relatedSentences.map((id) => {
            const sentence = sentenceById(id);
            return `<button class="tag" data-nav="/lesson/${lesson.id}/text?sentenceId=${id}">第 ${sentence.order} 句</button>`;
          }).join("")}</div>
        </div>
      ` : ""}
    </div>
  `;
}

function feedbackView(exercise, result) {
  if (result.isSkipped) {
    return `
      <article class="panel feedback">
        <h3>录音题暂不判分</h3>
        ${meta("题目", exerciseQuestionHtml(exercise))}
        ${meta("说明", exercise.explanation)}
        <div class="button-row">
          <button class="primary" data-next-exercise>${state.currentExercise === lesson.exercises.length - 1 ? "进入结果页" : "下一题"}</button>
        </div>
      </article>
    `;
  }
  const diff = answerDiff(result.userAnswer || "", exercise.answer);
  return `
    <article class="panel feedback ${result.isCorrect ? "passed" : "wrong"}">
      <div class="feedback-verdict">
        <strong>${result.isCorrect ? "通过" : "不通过"}</strong>
        <span>${result.isCorrect ? "答案与正确答案一致" : "答案与正确答案不一致"}</span>
      </div>
      ${meta("你的答案", result.userAnswer ? renderExerciseText(result.userAnswer) : "未作答")}
      ${meta(exercise.type === "sentence_making" ? "参考答案" : "正确答案", exerciseCorrectAnswerHtml(exercise, ""))}
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
  const activeWrong = activeWrongItems();
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
      <div class="button-row">
        <button class="primary" data-nav="/lesson/${lesson.id}/wrongbook">错题集 ${activeWrong.length}</button>
        <button class="secondary" data-nav="/lesson/${lesson.id}/vocab">重新学习</button>
      </div>
    </div>
    <section class="result-grid">
      <article class="panel metric"><span class="muted">完成题数</span><strong>${validResults.length}</strong></article>
      <article class="panel metric"><span class="muted">正确题数</span><strong>${scored.filter((item) => item.isCorrect).length}</strong></article>
      <article class="panel metric"><span class="muted">重点错题</span><strong>${activeWrong.length}</strong></article>
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
          ${activeWrong.length ? activeWrong.map((item) => wrongItem(item)).join("") : "<p class='muted'>还没有需要复练的错题。完成练习后这里会展示错误回溯入口。</p>"}
        </div>
      </article>
    </section>
  `);
}

function wrongItem(item) {
  const exercise = lesson.exercises.find((entry) => entry.id === item.exerciseId);
  return `
    <div class="card panel">
      <p class="label">${exercise.groupTitle} · ${exercise.category} · ${wrongStatusText(item.status)}</p>
      <h3>${exerciseQuestionHtml(exercise)}</h3>
      ${meta("你的答案", item.userAnswer ? renderExerciseText(item.userAnswer) : "未作答")}
      ${meta("正确答案 / 参考答案", exerciseCorrectAnswerHtml(exercise, ""))}
      ${meta("错题状态", `${wrongStatusText(item.status)} · 错误 ${item.wrongCount || 1} 次 · 连续正确 ${item.correctStreak || 0} 次`)}
      <div class="tags">${exercise.relatedGrammar.map((id) => grammarTag(id)).join("")}</div>
      <div class="button-row" style="margin-top:12px">
        <button class="secondary" data-wrong-detail="${exercise.id}">查看详情</button>
        <button class="primary" data-nav="/lesson/${lesson.id}/wrongbook">进入错题集</button>
        ${exercise.relatedSentences.map((id) => `<button class="ghost" data-nav="/lesson/${lesson.id}/text?sentenceId=${id}">回到课文</button>`).join("")}
      </div>
    </div>
  `;
}

function wrongStatusText(status) {
  return { active: "重点错题", reviewing: "复练中", resolved: "已归档" }[status] || "重点错题";
}

function wrongBookPage() {
  const activeItems = activeWrongItems();
  const allItems = activeWrongItems(true);
  const submittedResult = state.wrongPractice.submitted ? state.wrongPractice.result : null;
  if (!activeItems.length && !submittedResult) {
    return layout(`
      <div class="page-head">
        <div>
          <p class="eyebrow">${lesson.title} · 错题集</p>
          <h2>暂无需要复练的错题</h2>
        </div>
        <div class="button-row">
          ${studyTimeBadge("wrongbook")}
          <button class="secondary" data-nav="/lesson/${lesson.id}/exercises">返回练习</button>
        </div>
      </div>
      <article class="panel">
        <p class="muted">做错的标准练习会自动进入这里。连续正确两次后，错题会进入归档状态。</p>
        ${allItems.length ? `<h3>已归档错题</h3><div class="stack">${allItems.filter((item) => item.status === "resolved").map((item) => wrongItem(item)).join("")}</div>` : ""}
      </article>
    `);
  }
  state.wrongPractice.current = Math.min(Math.max(state.wrongPractice.current || 0, 0), activeItems.length - 1);
  const item = submittedResult ? state.wrongBook[submittedResult.exerciseId] : activeItems[state.wrongPractice.current];
  const exercise = lesson.exercises.find((entry) => entry.id === item.exerciseId);
  const result = submittedResult;
  return layout(`
    <section class="exercise-box">
      <div class="page-head">
        <div>
          <p class="eyebrow">${lesson.title} · 错题集</p>
          <h2>${exercise.groupTitle}</h2>
          <p>${wrongStatusText(item.status)} · ${activeItems.length ? `第 ${state.wrongPractice.current + 1} / ${activeItems.length} 题` : "本轮错题已清空"}</p>
        </div>
        <div class="button-row">
          ${studyTimeBadge("wrongbook")}
          <button class="secondary" data-nav="/lesson/${lesson.id}/exercises">返回练习</button>
          <button class="secondary" data-nav="/lesson/${lesson.id}/result">结果页</button>
        </div>
      </div>
      <article class="panel">
        <div class="exercise-context">
          <span class="exercise-badge">${exercise.category}</span>
          <div class="meta-line"><span class="label">要求</span><span>${exercise.instruction}</span></div>
          ${exercise.example ? `<div class="meta-line"><span class="label">例</span><span>${formatExerciseExample(exercise.example, exercise)}</span></div>` : ""}
          <div class="group-score">错误 ${item.wrongCount || 1} 次 · 连续正确 ${item.correctStreak || 0} 次</div>
        </div>
        <p class="label">原题</p>
        <div class="question">${exerciseQuestionHtml(exercise)}</div>
        ${answerControl(exercise, state.wrongPractice.answer, { id: exercise.id, mode: "wrong", disabled: state.wrongPractice.submitted })}
        <div class="button-row" style="margin-top:16px">
          <button class="primary" data-submit-wrong-practice ${state.wrongPractice.submitted ? "disabled" : ""}>提交错题</button>
          <button class="secondary" data-next-wrong-practice>${activeItems.length ? state.wrongPractice.current === activeItems.length - 1 ? "回到第一题" : "下一道错题" : "查看错题集"}</button>
        </div>
      </article>
      ${result ? wrongPracticeFeedback(exercise, result, state.wrongBook[exercise.id]) : ""}
    </section>
  `);
}

function wrongPracticeFeedback(exercise, result, wrongItemState) {
  return `
    <article class="panel feedback ${result.isCorrect ? "passed" : "wrong"}">
      <div class="feedback-verdict">
        <strong>${result.isCorrect ? "订正正确" : "仍需复练"}</strong>
        <span>${wrongStatusText(wrongItemState?.status)} · 连续正确 ${wrongItemState?.correctStreak || 0} 次</span>
      </div>
      ${exerciseFeedbackRow(exercise, result, 0)}
    </article>
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
  if (data.type === "authPrompt") {
    return `
      <div class="dialog-backdrop">
        <article class="panel dialog" data-dialog>
          <h2>登录以同步学习数据</h2>
          <p class="muted">登录后，你的学习进度可以在多个设备间同步。</p>
          <div class="button-row">
            <button class="primary" data-auth-action="login">前往登录</button>
            <button class="secondary" data-auth-action="skip">暂不需要</button>
          </div>
        </article>
      </div>
    `;
  }
  if (data.type === "migration") {
    const summaryItems = (data.localSummary || []).map((item) => {
      const s = item.summary;
      const parts = [];
      if (s.vocab.total) parts.push(`单词 ${s.vocab.completed}/${s.vocab.total}`);
      if (s.grammar.total) parts.push(`语法 ${s.grammar.completed}/${s.grammar.total}`);
      if (s.text.total) parts.push(`课文 ${s.text.completed}/${s.text.total}`);
      if (s.exercises.total) parts.push(`练习 ${s.exercises.completed}/${s.exercises.total}`);
      return `<li>${escapeHtml(item.title)} — ${parts.join("，") || "有学习记录"}</li>`;
    }).join("");
    return `
      <div class="dialog-backdrop">
        <article class="panel dialog" data-dialog>
          <h2>发现本地学习数据</h2>
          <p class="muted">当前设备上有未同步的学习记录。是否将这些数据上传到云端？</p>
          <div class="migration-summary"><ul>${summaryItems}</ul></div>
          <div class="button-row migration-actions">
            <button class="primary" data-migration="upload">上传到云端</button>
            <button class="secondary" data-migration="discard">丢弃本地，使用云端</button>
          </div>
          <div class="button-row"><button class="ghost" data-migration="skip">稍后处理</button></div>
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

function persistExerciseState() {
  write(`lesson:${lesson.id}:exerciseResults`, state.exerciseResults);
  write(`lesson:${lesson.id}:exerciseGroupAnswers`, state.exerciseGroupAnswers);
  write(`lesson:${lesson.id}:exerciseGroupSubmitted`, state.exerciseGroupSubmitted);
  write(`lesson:${lesson.id}:wrongBook`, state.wrongBook);
  write(`lesson:${lesson.id}:currentExerciseGroup`, state.currentExerciseGroup);
}

function upsertExerciseResult(result) {
  state.exerciseResults = state.exerciseResults.filter((item) => item.exerciseId !== result.exerciseId);
  state.exerciseResults.push(result);
}

function updateWrongBookFromResult(exercise, result) {
  if (result.isSkipped) return;
  const now = new Date().toISOString();
  const existing = state.wrongBook[exercise.id];
  const correctAnswer = exercise.referenceAnswers?.[0] || exercise.answer || "";
  if (result.isCorrect) {
    if (!existing) return;
    const correctStreak = (existing.correctStreak || 0) + 1;
    state.wrongBook[exercise.id] = {
      ...existing,
      correctStreak,
      status: correctStreak >= 2 ? "resolved" : "reviewing",
      lastPracticedAt: now,
      dueAt: now
    };
    return;
  }
  state.wrongBook[exercise.id] = {
    lessonId: String(lesson.id),
    exerciseId: exercise.id,
    groupId: exercise.groupId,
    userAnswer: result.userAnswer || "",
    correctAnswer,
    relatedGrammar: exercise.relatedGrammar,
    relatedSentences: exercise.relatedSentences,
    wrongCount: (existing?.wrongCount || 0) + 1,
    correctStreak: 0,
    firstWrongAt: existing?.firstWrongAt || now,
    lastWrongAt: now,
    lastPracticedAt: now,
    dueAt: now,
    status: "active"
  };
}

function commitExerciseGroup() {
  const group = currentExerciseGroup();
  group.items.forEach((exercise) => {
    const answer = state.exerciseGroupAnswers[exercise.id] || "";
    const result = buildFeedback(exercise, answer);
    upsertExerciseResult(result);
    updateWrongBookFromResult(exercise, result);
  });
  state.exerciseGroupSubmitted[group.id] = true;
  persistExerciseState();
  render();
}

function moveExerciseGroup(delta) {
  const groups = exerciseGroups();
  const next = state.currentExerciseGroup + delta;
  if (next >= groups.length) {
    navigate(`/lesson/${lesson.id}/result`);
    return;
  }
  state.currentExerciseGroup = Math.min(Math.max(next, 0), groups.length - 1);
  write(`lesson:${lesson.id}:currentExerciseGroup`, state.currentExerciseGroup);
  render();
}

function commitWrongPractice() {
  const item = activeWrongItems()[state.wrongPractice.current];
  if (!item) return;
  const exercise = lesson.exercises.find((entry) => entry.id === item.exerciseId);
  const result = buildFeedback(exercise, state.wrongPractice.answer);
  updateWrongBookFromResult(exercise, result);
  state.wrongPractice = { ...state.wrongPractice, submitted: true, result };
  write(`lesson:${lesson.id}:wrongBook`, state.wrongBook);
  render();
}

function nextWrongPractice() {
  const items = activeWrongItems();
  state.wrongPractice = {
    current: items.length ? (state.wrongPractice.current + 1) % items.length : 0,
    answer: "",
    submitted: false,
    result: null
  };
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
  const word = task ? wordById(task.wordId) : vocabStudyWords()[state.currentWord];
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

function slashWord(wordId) {
  const word = wordById(wordId);
  if (!word) return;
  const learning = wordLearningState(word.id);
  updateWordLearning(word.id, {
    slashed: true,
    pronunciationPassed: true,
    audioToWordCorrect: true,
    wordToMeaningCorrect: true,
    diagnosticTags: [],
    pronunciationReasons: [],
    attempts: {
      ...learning.attempts,
      pronunciation: Math.max(learning.attempts.pronunciation || 0, 1),
      audioToWord: Math.max(learning.attempts.audioToWord || 0, 1),
      wordToMeaning: Math.max(learning.attempts.wordToMeaning || 0, 1)
    }
  });
  state.vocabTestQueue = state.vocabTestQueue.filter((task) => task.wordId !== word.id);
  if (state.currentVocabTest >= state.vocabTestQueue.length) state.currentVocabTest = Math.max(0, state.vocabTestQueue.length - 1);
  write(`lesson:${lesson.id}:vocabTestQueue`, state.vocabTestQueue);
  write(`lesson:${lesson.id}:currentVocabTest`, state.currentVocabTest);
  state.vocabReveal = null;
  state.recallResult = `${word.jp} 已斩，本轮测试不再出现。`;
  render();
}

function revealAndAdvanceTest(word, selectedWordId, correct, mode) {
  if (vocabTestAdvanceTimer) window.clearTimeout(vocabTestAdvanceTimer);
  state.vocabReveal = { wordId: word.id, selectedWordId, correct };
  state.recallResult = correct ? "正确。" : "不正确。系统已记录该弱项，稍后会进入复习。";
  render();
  const delayMs = 1200;
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
    const data = await evaluatePronunciation(form);
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
        if (vocabStudyWords()[state.currentWord]?.id !== currentWordId) return;
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
    const data = await evaluatePronunciation(form);
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

function releaseTextRecording(sentenceId) {
  if (!sentenceId || state.textRecordingStoppingId) return;
  recordingReleaseRequested = true;
  if (recordingSession?.kind === "sentence" && recordingSession?.sentenceId === sentenceId) {
    stopTextRecording(sentenceId);
  }
}

async function startTextRecording(sentenceId) {
  const sentence = sentenceById(sentenceId);
  if (!sentence || recordingSession || state.textRecordingStoppingId) return;
  state.textRecordingPreparingId = sentenceId;
  state.textRecordingError = "";
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
      kind: "sentence",
      sentenceId,
      stream,
      audioContext,
      source,
      processor,
      chunks,
      referenceText: sentence.text,
      label: sentence.text,
      startedAt: Date.now(),
      sampleRate: audioContext.sampleRate,
      ready: false
    };
    await delay(250);
    if (!recordingSession || recordingSession.sentenceId !== sentenceId) return;
    if (recordingReleaseRequested) {
      cleanupRecordingSession(recordingSession);
      recordingSession = null;
      recordingReleaseRequested = false;
      recordingPointerId = null;
      state.textRecordingPreparingId = "";
      state.textRecordingId = "";
      state.textRecordingError = "录音尚未准备好，请长按到按钮变为“正在说话”后再开口。";
      render();
      return;
    }
    recordingSession.ready = true;
    state.textRecordingPreparingId = "";
    state.textRecordingId = sentenceId;
    state.textRecordingStoppingId = "";
    state.textRecordingError = "";
    render();
  } catch (error) {
    state.textRecordingPreparingId = "";
    cleanupRecordingSession(recordingSession);
    recordingSession = null;
    recordingReleaseRequested = false;
    recordingPointerId = null;
    state.textRecordingError = `无法录音：${error.message || error}`;
    render();
  }
}

async function stopTextRecording(sentenceId) {
  if (!recordingSession || recordingSession.sentenceId !== sentenceId) return;
  const session = recordingSession;
  if (session.stopping) return;
  if (!session.ready) {
    cleanupRecordingSession(session);
    recordingSession = null;
    recordingReleaseRequested = false;
    recordingPointerId = null;
    state.textRecordingPreparingId = "";
    state.textRecordingId = "";
    state.textRecordingStoppingId = "";
    state.textRecordingError = "录音尚未准备好，请长按到按钮变为“正在说话”后再开口。";
    render();
    return;
  }
  session.stopping = true;
  state.textRecordingPreparingId = "";
  state.textRecordingStoppingId = sentenceId;
  state.textRecordingError = "";
  render();
  await delay(800);
  if (recordingSession !== session) return;
  recordingSession = null;
  session.processor.disconnect();
  session.source.disconnect();
  session.stream.getTracks().forEach((track) => track.stop());
  await session.audioContext.close();
  state.textRecordingId = "";
  state.textRecordingStoppingId = "";
  state.textRecordingError = "正在提交发音评价...";
  render();
  const sentence = sentenceById(sentenceId);
  const stats = audioStats(session.chunks, session.sampleRate);
  if (stats.duration < 0.25 || stats.peak < 0.01) {
    state.textRecordingError = `录音音量过低或时长太短：${stats.duration.toFixed(1)} 秒，峰值 ${stats.peak.toFixed(3)}。请靠近麦克风重试。`;
    recordingReleaseRequested = false;
    recordingPointerId = null;
    render();
    return;
  }
  const wav = encodeWav(session.chunks, session.sampleRate);
  const form = new FormData();
  form.append("wordId", `sentence:${sentence.id}`);
  form.append("referenceText", sentence.text);
  form.append("kana", sentence.kana || "");
  form.append("audio", new Blob([wav], { type: "audio/wav" }), `${sentence.id}.wav`);
  try {
    const data = await evaluatePronunciation(form);
    updateSentencePractice(sentence.id, {
      submitted: true,
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
      pronunciationAttempts: sentencePracticeState(sentence.id).pronunciationAttempts + 1
    });
    recordInteraction("sentence", sentence.id, data.passed ? "smooth" : "retry");
    state.textRecordingError = "";
    recordingReleaseRequested = false;
    recordingPointerId = null;
    render();
    window.setTimeout(() => {
      if (route().page !== "text") return;
      if (state.textRecordingId || state.textRecordingPreparingId || state.textRecordingStoppingId) return;
      const tabSentences = textSentencesForTab(state.textCurrentTab);
      if (state.currentSentence >= tabSentences.length - 1) return;
      setTextSentenceIndex(state.currentSentence + 1);
      history.replaceState({}, "", lessonPath(`/lesson/${lesson.id}/text`));
      render();
    }, 350);
  } catch (error) {
    updateSentencePractice(sentence.id, {
      submitted: true,
      pronunciationPassed: false,
      pronunciationReasons: [String(error.message || error)],
      debugAudioUrl: "",
      debugAudioPath: "",
      pronunciationDuration: 0,
      pronunciationPeak: 0,
      pronunciationAttempts: sentencePracticeState(sentence.id).pronunciationAttempts + 1
    });
    recordInteraction("sentence", sentence.id, "retry");
    state.textRecordingError = String(error.message || error);
    recordingReleaseRequested = false;
    recordingPointerId = null;
    render();
  }
}

function startTextHold(button, sentenceId, event) {
  if (!sentenceId || recordingSession || state.textRecordingStoppingId) return;
  if (event?.pointerId != null) recordingPointerId = event.pointerId;
  if (event?.currentTarget?.setPointerCapture && event?.pointerId != null) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Ignore capture failures; document/window listeners remain as fallback.
    }
  }
  recordingReleaseRequested = false;
  startTextRecording(sentenceId);
}

function endTextHold(sentenceId, event) {
  if (!sentenceId) return;
  if (recordingPointerId != null && event?.pointerId != null && event.pointerId !== recordingPointerId) return;
  if (event?.currentTarget?.releasePointerCapture && event?.pointerId != null) {
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore capture release failures.
    }
  }
  releaseTextRecording(sentenceId);
}

function releaseFavoriteRecording(key) {
  if (!key || state.favoriteRecordingStoppingKey) return;
  if (recordingSession?.kind !== "favorite" && !state.favoriteRecordingPreparingKey && !state.favoriteRecordingKey) return;
  recordingReleaseRequested = true;
  if (recordingSession?.kind === "favorite" && recordingSession?.key === key) {
    stopFavoriteRecording(key);
  }
}

async function startFavoriteRecording(key, referenceText, kana = "") {
  if (!key || !referenceText || recordingSession || state.favoriteRecordingStoppingKey) return;
  state.favoriteRecordingPreparingKey = key;
  state.favoriteRecordingErrorKey = "";
  state.favoriteRecordingError = "";
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
      kind: "favorite",
      key,
      referenceText,
      kana,
      stream,
      audioContext,
      source,
      processor,
      chunks,
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
      state.favoriteRecordingPreparingKey = "";
      state.favoriteRecordingKey = "";
      state.favoriteRecordingErrorKey = key;
      state.favoriteRecordingError = "录音尚未准备好，请长按到按钮变为“正在说话”后再开口。";
      render();
      return;
    }
    recordingSession.ready = true;
    state.favoriteRecordingPreparingKey = "";
    state.favoriteRecordingKey = key;
    state.favoriteRecordingStoppingKey = "";
    render();
  } catch (error) {
    state.favoriteRecordingPreparingKey = "";
    cleanupRecordingSession(recordingSession);
    recordingSession = null;
    recordingReleaseRequested = false;
    recordingPointerId = null;
    state.favoriteRecordingErrorKey = key;
    state.favoriteRecordingError = `无法录音：${error.message || error}`;
    render();
  }
}

async function stopFavoriteRecording(key) {
  if (!recordingSession || recordingSession.kind !== "favorite" || recordingSession.key !== key) return;
  const session = recordingSession;
  if (session.stopping) return;
  if (!session.ready) {
    cleanupRecordingSession(session);
    recordingSession = null;
    recordingReleaseRequested = false;
    recordingPointerId = null;
    state.favoriteRecordingPreparingKey = "";
    state.favoriteRecordingKey = "";
    state.favoriteRecordingStoppingKey = "";
    state.favoriteRecordingErrorKey = key;
    state.favoriteRecordingError = "录音尚未准备好，请长按到按钮变为“正在说话”后再开口。";
    render();
    return;
  }
  session.stopping = true;
  state.favoriteRecordingPreparingKey = "";
  state.favoriteRecordingStoppingKey = key;
  state.favoriteRecordingErrorKey = key;
  state.favoriteRecordingError = "";
  render();
  await delay(800);
  if (recordingSession !== session) return;
  recordingSession = null;
  session.processor.disconnect();
  session.source.disconnect();
  session.stream.getTracks().forEach((track) => track.stop());
  await session.audioContext.close();
  state.favoriteRecordingKey = "";
  state.favoriteRecordingStoppingKey = "";
  state.favoriteRecordingError = "正在提交发音评价...";
  render();
  const stats = audioStats(session.chunks, session.sampleRate);
  if (stats.duration < 0.25 || stats.peak < 0.01) {
    state.favoriteRecordingError = `录音音量过低或时长太短：${stats.duration.toFixed(1)} 秒，峰值 ${stats.peak.toFixed(3)}。请靠近麦克风重试。`;
    recordingReleaseRequested = false;
    recordingPointerId = null;
    render();
    return;
  }
  const wav = encodeWav(session.chunks, session.sampleRate);
  const form = new FormData();
  form.append("wordId", `favorite:${key}`);
  form.append("referenceText", session.referenceText);
  form.append("kana", session.kana || "");
  form.append("audio", new Blob([wav], { type: "audio/wav" }), `${key.replaceAll(":", "-")}.wav`);
  try {
    const data = await evaluatePronunciation(form);
    state.favoriteRecordingResults = {
      ...state.favoriteRecordingResults,
      [key]: {
        ...data,
        reasons: [...(data.reasons || []), `录音 ${stats.duration.toFixed(1)} 秒，音量峰值 ${stats.peak.toFixed(2)}`]
      }
    };
    state.favoriteRecordingError = "";
    state.favoriteRecordingErrorKey = key;
    recordingReleaseRequested = false;
    recordingPointerId = null;
    render();
  } catch (error) {
    state.favoriteRecordingResults = {
      ...state.favoriteRecordingResults,
      [key]: {
        passed: false,
        pronunciationScore: 0,
        accuracyScore: 0,
        fluencyScore: 0,
        completenessScore: 0,
        reasons: [String(error.message || error)]
      }
    };
    state.favoriteRecordingErrorKey = key;
    state.favoriteRecordingError = String(error.message || error);
    recordingReleaseRequested = false;
    recordingPointerId = null;
    render();
  }
}

function startFavoriteHold(button, key, event) {
  if (!key || recordingSession || state.favoriteRecordingStoppingKey) return;
  if (event?.pointerId != null) recordingPointerId = event.pointerId;
  if (event?.currentTarget?.setPointerCapture && event?.pointerId != null) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Ignore capture failures; document/window listeners remain as fallback.
    }
  }
  recordingReleaseRequested = false;
  startFavoriteRecording(key, button.dataset.favoriteReference, button.dataset.favoriteKana || "");
}

function endFavoriteHold(key, event) {
  if (!key) return;
  if (recordingPointerId != null && event?.pointerId != null && event.pointerId !== recordingPointerId) return;
  if (event?.currentTarget?.releasePointerCapture && event?.pointerId != null) {
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore capture release failures.
    }
  }
  releaseFavoriteRecording(key);
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
    const response = await fetch(`/api/audio/status?lessonId=${encodeURIComponent(lesson.id)}&voiceId=${encodeURIComponent(state.currentVoiceId)}`);
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

async function loadCourseCatalog(force = false) {
  if (state.lessonCatalogLoading) return;
  if (!force && state.lessonCatalogStatus) return;
  state.lessonCatalogLoading = true;
  try {
    // 学员端读静态 JSON（适用于纯静态部署 / App）；管理端读 API（看实时状态）。
    let data;
    if (ADMIN_MODE) {
      const response = await fetch("/api/lesson-catalog");
      data = await response.json();
      if (!response.ok) throw new Error(data.error || "读取课程目录失败");
    } else {
      const response = await fetch("/data/catalog.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`读取课程目录失败 (${response.status})`);
      data = await response.json();
    }
    state.lessonCatalogStatus = data.lessons || [];
    state.lessonCatalogMessage = "";
  } catch (error) {
    state.lessonCatalogMessage = String(error.message || error);
  } finally {
    state.lessonCatalogLoading = false;
  }
  if (route().page === "home") render();
}

function routeRuntimeLessonId() {
  const currentRoute = route();
  if (!currentRoute.lessonId || currentRoute.page === "init") return "";
  return String(currentRoute.lessonId);
}

async function ensureRuntimeLesson(lessonId) {
  if (!lessonId || runtimeLessonLoadingId === lessonId) return;
  runtimeLessonLoadingId = lessonId;
  runtimeLessonErrorId = "";
  runtimeLessonError = "";
  try {
    if (lessonId === String(bundledLessonRuntime.lesson.id)) {
      restoreBundledLesson();
      return;
    }
    const response = await fetch(`/data/lessons/lesson${encodeURIComponent(lessonId)}.json`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `第 ${lessonId} 课还没有可加载的课程 JSON`);
    applyRuntimeLesson(data);
  } catch (error) {
    runtimeLessonErrorId = lessonId;
    runtimeLessonError = String(error.message || error);
  } finally {
    runtimeLessonLoadingId = "";
  }
  render();
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

async function loadInitStatus(force = false) {
  const lessonId = initLessonId();
  if (!lessonId) return;
  if (state.initStatusLoading && state.initStatusLessonId === lessonId && state.initStatusVoiceId === state.currentVoiceId) return;
  if (!force && state.initStatusLessonId === lessonId && state.initStatusVoiceId === state.currentVoiceId && (state.initStatus || state.initMessage)) return;
  state.initStatusLessonId = lessonId;
  state.initStatusVoiceId = state.currentVoiceId;
  state.initStatusLoading = true;
  try {
    const response = await fetch(`/api/init/status?lessonId=${encodeURIComponent(lessonId)}&voiceId=${encodeURIComponent(state.currentVoiceId)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "读取初始化状态失败");
    state.initStatus = data;
    state.initMessage = "";
  } catch (error) {
    state.initStatus = null;
    state.initMessage = String(error.message || error);
  } finally {
    state.initStatusLoading = false;
  }
  if (route().page === "init") render();
}

async function uploadInitImages(bucket, files) {
  const lessonId = initLessonId();
  if (!lessonId || !files?.length) return;
  state.initBusy = `正在上传${initBuckets.find((item) => item.id === bucket)?.label || ""}图片...`;
  state.initMessage = "";
  render();
  const form = new FormData();
  form.append("lessonId", lessonId);
  form.append("bucket", bucket);
  [...files].forEach((file) => form.append("images", file, file.name));
  try {
    const response = await fetch("/api/init/upload", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || "上传失败");
    state.initStatus = { ...(state.initStatus || {}), images: data.images, state: data.state };
    state.initBusy = "";
    state.initMessage = `已上传 ${data.files?.length || 0} 张图片。`;
    await loadInitStatus(true);
  } catch (error) {
    state.initBusy = "";
    state.initMessage = String(error.message || error);
    render();
  }
}

async function parseInitImages() {
  const lessonId = initLessonId();
  if (!lessonId) return;
  state.initBusy = "正在生成 Codex CLI 解析任务...";
  state.initMessage = "";
  render();
  try {
    const data = await postAudioApi("/api/init/parse", { lessonId });
    state.initStatus = { ...(state.initStatus || {}), draft: data.draft, state: data.state, codexTask: data.task };
    state.initBusy = "";
    state.initMessage = "Codex 解析任务已生成。请用当前 Codex 会话执行任务，或在终端运行页面中的命令；完成后刷新结果。";
    await loadInitStatus(true);
  } catch (error) {
    state.initBusy = "";
    state.initMessage = String(error.message || error);
    render();
  }
}

async function importInitJsonDraft() {
  const lessonId = initLessonId();
  const textarea = app.querySelector("[data-init-import-json]");
  const source = textarea?.value || state.initImportJson || "";
  let draft;
  try {
    draft = JSON.parse(source);
  } catch (error) {
    state.initMessage = `导入 JSON 格式不正确：${error.message || error}`;
    render();
    return;
  }
  state.initBusy = "正在导入 JSON 草稿...";
  state.initMessage = "";
  render();
  try {
    const data = await postAudioApi("/api/init/import-json", { lessonId, draft });
    state.initStatus = { ...(state.initStatus || {}), draft: data.draft, state: data.state, audio: data.audio };
    state.initImportJson = "";
    state.initBusy = "";
    state.initMessage = "JSON 草稿已导入。请审核后确认解析结果。";
    await loadInitStatus(true);
  } catch (error) {
    state.initBusy = "";
    state.initMessage = String(error.message || error);
    render();
  }
}

async function confirmInitParse() {
  const lessonId = initLessonId();
  const textarea = app.querySelector("[data-init-draft-json]");
  let draft = state.initStatus?.draft;
  try {
    if (textarea?.value) draft = JSON.parse(textarea.value);
  } catch (error) {
    state.initMessage = `JSON 格式不正确：${error.message || error}`;
    render();
    return;
  }
  if (!draft) {
    state.initMessage = "还没有可确认的解析结果。";
    render();
    return;
  }
  state.initBusy = "正在保存课程数据...";
  state.initMessage = "";
  render();
  try {
    const data = await postAudioApi("/api/init/confirm-parse", { lessonId, draft });
    state.initStatus = { ...(state.initStatus || {}), draft: data.draft, state: data.state };
    state.initBusy = "";
    state.initMessage = "课程数据已确认保存，可以生成音频。";
    await loadInitStatus(true);
  } catch (error) {
    state.initBusy = "";
    state.initMessage = String(error.message || error);
    render();
  }
}

async function generateInitAudio() {
  const lessonId = initLessonId();
  if (!lessonId) return;
  if (!state.initStatus?.audio?.items?.length) await loadInitStatus(true);
  const targets = (state.initStatus?.audio?.items || []).filter((item) => !item.exists);
  if (!targets.length) {
    state.initMessage = "音频已完整，可以确认音频。";
    render();
    return;
  }
  let generatedTotal = 0;
  let failedTotal = 0;
  let completedTotal = 0;
  state.initBusy = `正在并行发起 ${targets.length} 个音频生成请求...`;
  state.initMessage = "";
  render();
  try {
    const requests = targets.map(async (item) => {
      try {
        const data = await postAudioApi("/api/init/audio/generate", {
          lessonId,
          voiceId: state.currentVoiceId,
          scope: "one",
          id: `${item.type}:${item.id}`
        });
        const itemUpdate = data.items?.[0];
        if (itemUpdate?.error) failedTotal += 1;
        if (itemUpdate?.generated || itemUpdate?.exists) generatedTotal += 1;
        updateInitAudioItemStatus(itemUpdate);
      } catch (error) {
        failedTotal += 1;
        updateInitAudioItemStatus({ ...item, error: String(error.message || error), exists: false, generated: false });
      } finally {
        completedTotal += 1;
        const remaining = targets.length - completedTotal;
        state.initBusy = `正在生成音频：已完成 ${completedTotal} / ${targets.length}，成功 ${generatedTotal} 个，失败 ${failedTotal} 个，剩余 ${remaining} 个。`;
        render();
      }
    });
    await Promise.all(requests);
    state.initBusy = "";
    state.initMessage = failedTotal
      ? `音频生成完成：成功 ${generatedTotal} 个，失败 ${failedTotal} 个。可稍后再次点击继续补齐。`
      : `音频生成完成：生成 ${generatedTotal} 个。`;
    await loadInitStatus(true);
  } catch (error) {
    state.initBusy = "";
    state.initMessage = String(error.message || error);
    render();
  }
}

function updateInitAudioItemStatus(itemUpdate) {
  if (!state.initStatus?.audio?.items || !itemUpdate) return;
  const items = state.initStatus.audio.items.map((item) => {
    if (item.type !== itemUpdate.type || item.id !== itemUpdate.id) return item;
    return { ...item, ...itemUpdate };
  });
  const generated = items.filter((item) => item.exists).length;
  state.initStatus = {
    ...(state.initStatus || {}),
    audio: {
      ...(state.initStatus.audio || {}),
      items,
      generated,
      missing: Math.max(0, items.length - generated),
      total: items.length
    }
  };
}

async function confirmInitAudio() {
  const lessonId = initLessonId();
  if (!lessonId) return;
  state.initBusy = "正在确认音频完整性...";
  state.initMessage = "";
  render();
  try {
    const data = await postAudioApi("/api/init/confirm-audio", { lessonId, voiceId: state.currentVoiceId });
    state.initStatus = { ...(state.initStatus || {}), state: data.state, audio: data.audio };
    state.initBusy = "";
    state.initMessage = "该课初始化已完成。";
    await loadCourseCatalog(true);
    navigate("/");
  } catch (error) {
    state.initBusy = "";
    state.initMessage = String(error.message || error);
    render();
  }
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
          const data = await postAudioApi("/api/audio/generate", { lessonId: lesson.id, voiceId: state.currentVoiceId, type: item.type, id: item.id });
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
      ? { lessonId: lesson.id, voiceId: state.currentVoiceId, scope: "all" }
      : { lessonId: lesson.id, voiceId: state.currentVoiceId, type, id });
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
  syncStudyTimerWithRoute();
  // ADMIN_MODE 关闭时，访问管理路由（init/audio）直接重定向到课程主页或首页。
  if (!ADMIN_MODE && ADMIN_ROUTES.has(current)) {
    const currentRoute = route();
    history.replaceState({}, "", currentRoute.lessonId ? `/lesson/${currentRoute.lessonId}` : "/");
    return render();
  }
  const views = { home, lesson: lessonDashboard, init: initPage, vocab, text: textPage, grammar: grammarPage, exercises: exercisesPage, wrongbook: wrongBookPage, favorites: favoritesPage, audio: audioManagePage, result: resultPage };
  hideSelectionBubble();
  const runtimeLessonId = routeRuntimeLessonId();
  if (runtimeLessonId && String(lesson.id) !== runtimeLessonId) {
    if (runtimeLessonErrorId !== runtimeLessonId) ensureRuntimeLesson(runtimeLessonId);
    app.innerHTML = runtimeLessonErrorId === runtimeLessonId ? runtimeErrorPage(runtimeLessonId) : runtimeLoadingPage(runtimeLessonId);
    ensurePageFocus();
    bind();
    return;
  }
  try {
    app.innerHTML = (views[current] || home)();
  } catch (error) {
    console.error(error);
    app.innerHTML = layout(`
      <section class="panel">
        <p class="eyebrow">页面渲染失败</p>
        <h2>当前模块暂时无法显示</h2>
        <p class="lead">${escapeHtml(String(error.message || error))}</p>
        <button class="secondary" data-nav="/lesson/${route().lessonId || lesson.id}">返回课程</button>
      </section>
    `);
  }
  ensurePageFocus();
  bind();
  if (current === "home" || current === "favorites") loadCourseCatalog();
  if (current === "audio") loadAudioStatus();
  if (current === "init") loadInitStatus();
  if (current === "vocab" && state.vocabPhase === "pronunciation" && !state.modal) {
    const word = vocabStudyWords()[state.currentWord];
    if (word && lastAutoSpokenWord !== word.id) {
      lastAutoSpokenWord = word.id;
      const shouldDelay = pendingAutoSpeakWordId === word.id;
      pendingAutoSpeakWordId = "";
      scheduleAutoWordAudio(word, shouldDelay ? 650 : 450);
    }
  }
  if (current === "vocab" && state.vocabPhase === "test" && !state.modal) {
    const task = currentVocabTestTask();
    if (task?.type === "audioToWord") {
      const word = wordById(task.wordId);
      const key = `test:${task.id}`;
      if (word && lastAutoSpokenWord !== key) {
        lastAutoSpokenWord = key;
        scheduleAutoWordAudio(word, 450);
      }
    }
  }
}

function ensurePageFocus() {
  if (document.activeElement?.matches?.("input, textarea, select, [contenteditable='true']")) return;
  document.body.setAttribute("tabindex", "-1");
  document.body.focus({ preventScroll: true });
}

function bind() {
  // 学员模式：隐藏所有跳转到管理路由（/init、/audio）的入口按钮。
  if (!ADMIN_MODE) {
    app.querySelectorAll("[data-nav]").forEach((el) => {
      const target = el.getAttribute("data-nav") || "";
      if (ADMIN_NAV_PATTERN.test(target)) el.style.display = "none";
    });
  }
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
  app.querySelector("[data-export-progress]")?.addEventListener("click", exportLearningData);
  app.querySelector("[data-import-progress-trigger]")?.addEventListener("click", () => {
    app.querySelector("[data-import-progress-file]")?.click();
  });
  app.querySelector("[data-import-progress-file]")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      await importLearningData(file);
    } catch (error) {
      window.alert(String(error.message || error));
    }
  });
  function triggerLogin() {
    const mainUrl = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://groundedglow.cc";
    if (window.parent !== window) {
      window.parent.postMessage({ type: "AUTH_EXPIRED" }, mainUrl);
      return;
    }
    window.location.href = mainUrl + "/login?redirect=" + encodeURIComponent(window.location.href);
  }
  app.querySelector('[data-auth-action="login"]')?.addEventListener("click", triggerLogin);
  app.querySelector("[data-header-login]")?.addEventListener("click", triggerLogin);
  app.querySelector('[data-auth-action="skip"]')?.addEventListener("click", () => {
    sessionStorage.setItem("japaflow:skipAuth", "1");
    localStorage.setItem("japaflow:authPromptDismissed", "1");
    state.modal = null;
    render();
  });
  app.querySelectorAll("[data-migration]").forEach((button) => button.addEventListener("click", () => {
    handleMigration(button.dataset.migration);
  }));
  app.querySelectorAll("[data-speak]").forEach((button) => {
    button.addEventListener("click", () => playAudio(button.dataset.speak, button.dataset.audio));
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
  app.querySelectorAll("[data-init-upload]").forEach((input) => input.addEventListener("change", (event) => {
    uploadInitImages(input.dataset.initUpload, event.target.files);
    event.target.value = "";
  }));
  app.querySelectorAll("[data-init-upload-trigger]").forEach((button) => button.addEventListener("click", () => {
    app.querySelector(`[data-init-upload="${button.dataset.initUploadTrigger}"]`)?.click();
  }));
  app.querySelector("[data-init-import-json]")?.addEventListener("input", (event) => {
    state.initImportJson = event.target.value;
  });
  app.querySelector("[data-init-json-file-trigger]")?.addEventListener("click", () => {
    app.querySelector("[data-init-json-file]")?.click();
  });
  app.querySelector("[data-init-json-file]")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    state.initImportJson = await file.text();
    event.target.value = "";
    render();
  });
  app.querySelector("[data-init-import-json-submit]")?.addEventListener("click", importInitJsonDraft);
  app.querySelector("[data-init-parse]")?.addEventListener("click", parseInitImages);
  app.querySelector("[data-init-refresh]")?.addEventListener("click", () => loadInitStatus(true));
  app.querySelector("[data-init-confirm-parse]")?.addEventListener("click", confirmInitParse);
  app.querySelector("[data-init-generate-audio]")?.addEventListener("click", generateInitAudio);
  app.querySelector("[data-init-confirm-audio]")?.addEventListener("click", confirmInitAudio);
  app.querySelectorAll("[data-word-index]").forEach((button) => button.addEventListener("click", () => {
    setCurrentWord(Number(button.dataset.wordIndex), true);
  }));
  app.querySelector("[data-vocab-focus-only]")?.addEventListener("change", (event) => {
    state.vocabFocusOnly = Boolean(event.target.checked);
    write(`lesson:${lesson.id}:vocabFocusOnly`, state.vocabFocusOnly);
    state.currentWord = 0;
    state.currentVocabTest = 0;
    state.vocabTestQueue = [];
    write(`lesson:${lesson.id}:currentVocabTest`, state.currentVocabTest);
    write(`lesson:${lesson.id}:vocabTestQueue`, state.vocabTestQueue);
    lastAutoSpokenWord = null;
    render();
  });
  app.querySelectorAll("[data-toggle-word-favorite]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    const word = wordById(button.dataset.toggleWordFavorite);
    if (!word) return;
    toggleFavorite("word", word);
    render();
  }));
  app.querySelectorAll("[data-remove-favorite]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    const [type, lessonIdValue, ...rest] = button.dataset.removeFavorite.split(":");
    const id = rest.join(":");
    const favorites = lessonFavorites(lessonIdValue);
    delete favorites[favoriteTypeKey(type)]?.[id];
    writeLessonFavorites(lessonIdValue, favorites);
    render();
  }));
  app.querySelectorAll("[data-word-status]").forEach((button) => button.addEventListener("click", () => {
    const word = vocabStudyWords()[state.currentWord];
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
  app.querySelectorAll("[data-slash-word]").forEach((button) => button.addEventListener("click", () => {
    slashWord(button.dataset.slashWord);
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
  app.querySelectorAll("[data-prev-pronunciation-word]").forEach((button) => button.addEventListener("click", () => {
    setCurrentWord(state.currentWord - 1, true);
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
  app.querySelectorAll("[data-text-tab]").forEach((button) => button.addEventListener("click", () => {
    setTextTab(button.dataset.textTab, textActiveSentenceIndex(button.dataset.textTab));
    render();
  }));
  app.querySelectorAll("[data-text-prompt-lang]").forEach((button) => button.addEventListener("click", () => {
    state.textPromptLanguage = button.dataset.textPromptLang;
    writeTextProgress();
    render();
  }));
  app.querySelectorAll("[data-sentence-index]").forEach((button) => button.addEventListener("click", (event) => {
    if (event.target.closest?.("button, audio")) return;
    setTextSentenceIndex(Number(button.dataset.sentenceIndex));
    history.replaceState({}, "", lessonPath(`/lesson/${lesson.id}/text`));
    render();
  }));
  app.querySelector("[data-start-text-flow]")?.addEventListener("click", () => {
    stopCurrentAudio();
    setTextSentenceIndex(0);
    lastAutoSpokenSentence = null;
    history.replaceState({}, "", lessonPath(`/lesson/${lesson.id}/text`));
    render();
  });
  app.querySelector("[data-reset-text-learning]")?.addEventListener("click", resetTextLearningData);
  app.querySelector("[data-prev-sentence]")?.addEventListener("click", () => {
    setTextSentenceIndex(state.currentSentence - 1);
    render();
  });
  app.querySelector("[data-next-sentence]")?.addEventListener("click", () => {
    const sentence = currentTextSentence();
    if (!sentence) return;
    if (!interactionDone("sentence", sentence.id)) return;
    setTextSentenceIndex(state.currentSentence + 1);
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
  app.querySelectorAll("[data-hold-record-sentence]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      startTextHold(button, button.dataset.holdRecordSentence, event);
    });
    button.addEventListener("pointerup", (event) => {
      endTextHold(button.dataset.holdRecordSentence, event);
    });
    button.addEventListener("pointercancel", (event) => {
      endTextHold(button.dataset.holdRecordSentence, event);
    });
    button.addEventListener("lostpointercapture", (event) => {
      endTextHold(button.dataset.holdRecordSentence, event);
    });
  });
  app.querySelectorAll("[data-hold-record-favorite]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      startFavoriteHold(button, button.dataset.holdRecordFavorite, event);
    });
    button.addEventListener("pointerup", (event) => {
      endFavoriteHold(button.dataset.holdRecordFavorite, event);
    });
    button.addEventListener("pointercancel", (event) => {
      endFavoriteHold(button.dataset.holdRecordFavorite, event);
    });
    button.addEventListener("lostpointercapture", (event) => {
      endFavoriteHold(button.dataset.holdRecordFavorite, event);
    });
  });
  app.querySelectorAll("[data-exercise-index]").forEach((button) => button.addEventListener("click", () => {
    const exerciseIndex = Number(button.dataset.exerciseIndex);
    const exercise = lesson.exercises[exerciseIndex];
    const groupIndex = exerciseGroups().findIndex((group) => group.id === exercise.groupId);
    state.currentExerciseGroup = Math.max(groupIndex, 0);
    write(`lesson:${lesson.id}:currentExerciseGroup`, state.currentExerciseGroup);
    navigate(`/lesson/${lesson.id}/exercises`);
  }));
  app.querySelectorAll("[data-exercise-group-index]").forEach((button) => button.addEventListener("click", () => {
    state.currentExerciseGroup = Number(button.dataset.exerciseGroupIndex);
    write(`lesson:${lesson.id}:currentExerciseGroup`, state.currentExerciseGroup);
    render();
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
  app.querySelectorAll("[data-group-answer]").forEach((input) => {
    const handler = (event) => {
    state.exerciseGroupAnswers[event.target.dataset.exerciseId] = event.target.value;
    write(`lesson:${lesson.id}:exerciseGroupAnswers`, state.exerciseGroupAnswers);
    };
    input.addEventListener("input", handler);
    input.addEventListener("change", handler);
  });
  app.querySelectorAll("[data-group-choice]").forEach((button) => button.addEventListener("click", () => {
    state.exerciseGroupAnswers[button.dataset.exerciseId] = button.dataset.groupChoice;
    write(`lesson:${lesson.id}:exerciseGroupAnswers`, state.exerciseGroupAnswers);
    render();
  }));
  app.querySelectorAll("[data-wrong-answer]").forEach((input) => {
    const handler = (event) => {
      state.wrongPractice.answer = event.target.value;
    };
    input.addEventListener("input", handler);
    input.addEventListener("change", handler);
  });
  app.querySelectorAll("[data-wrong-choice]").forEach((button) => button.addEventListener("click", () => {
    state.wrongPractice.answer = button.dataset.wrongChoice;
    render();
  }));
  app.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
    state.answer = button.dataset.choice;
    render();
  }));
  app.querySelector("[data-submit-answer]")?.addEventListener("click", commitResult);
  app.querySelectorAll("[data-submit-exercise-group]").forEach((button) => button.addEventListener("click", commitExerciseGroup));
  app.querySelectorAll("[data-prev-exercise-group]").forEach((button) => button.addEventListener("click", () => moveExerciseGroup(-1)));
  app.querySelectorAll("[data-next-exercise-group]").forEach((button) => button.addEventListener("click", () => moveExerciseGroup(1)));
  app.querySelectorAll("[data-exercise-group-note]").forEach((el) => {
    el.addEventListener("input", (e) => {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
      const group = currentExerciseGroup();
      const noteKey = `lesson:${lesson.id}:exerciseGroupNotes:${group.id}`;
      write(noteKey, e.target.innerText);
    });
    // auto-grow on page load
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  });
  app.querySelector("[data-submit-wrong-practice]")?.addEventListener("click", commitWrongPractice);
  app.querySelector("[data-next-wrong-practice]")?.addEventListener("click", nextWrongPractice);
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
window.addEventListener("japaflow:auth-changed", (e) => {
  if (e.detail?.loggedIn) {
    sessionStorage.removeItem("japaflow:skipAuth");
    state.modal = null;
    checkLocalDataMigration().then(() => {
      reloadLessonScopedState();
      render();
    });
  } else {
    if (!localStorage.getItem("japaflow:authPromptDismissed")) {
      state.modal = { type: "authPrompt" };
      render();
    }
  }
});
document.addEventListener("keydown", handleKeyboard, true);
document.addEventListener("keyup", handleKeyboard, true);
["click", "input", "change", "pointerdown", "keydown"].forEach((eventName) => {
  document.addEventListener(eventName, trackStudyActivity, true);
});
["beforeunload", "pagehide"].forEach((eventName) => {
  window.addEventListener(eventName, () => settleStudyTimer(eventName));
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") settleStudyTimer("visibility-hidden");
});
document.addEventListener("selectionchange", () => window.setTimeout(handleSelectionLookup, 0));
document.addEventListener("pointerdown", (event) => {
  if (!event.target.closest?.("#selection-bubble")) hideSelectionBubble();
}, true);
document.addEventListener("pointerup", () => {
  releaseWordRecording(recordingPressWordId || recordingSession?.wordId || state.recordingPreparingWordId);
  releaseGrammarRecording(state.grammarRecordingId || state.grammarRecordingPreparingId || recordingSession?.key);
  releaseTextRecording(state.textRecordingId || state.textRecordingPreparingId || recordingSession?.sentenceId);
  releaseFavoriteRecording(state.favoriteRecordingKey || state.favoriteRecordingPreparingKey || recordingSession?.key);
}, true);
document.addEventListener("pointercancel", () => {
  releaseWordRecording(recordingPressWordId || recordingSession?.wordId || state.recordingPreparingWordId);
  releaseGrammarRecording(state.grammarRecordingId || state.grammarRecordingPreparingId || recordingSession?.key);
  releaseTextRecording(state.textRecordingId || state.textRecordingPreparingId || recordingSession?.sentenceId);
  releaseFavoriteRecording(state.favoriteRecordingKey || state.favoriteRecordingPreparingKey || recordingSession?.key);
}, true);
document.addEventListener("copy", (e) => {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;
  const range = selection.getRangeAt(0);
  const fragment = range.cloneContents();
  const temp = document.createElement("div");
  temp.appendChild(fragment);
  // Remove ruby rt elements before copying
  temp.querySelectorAll("rt").forEach((rt) => rt.remove());
  const plainText = temp.innerText || temp.textContent || "";
  if (plainText) {
    e.clipboardData?.setData("text/plain", plainText);
    e.preventDefault();
  }
});

document.addEventListener("click", (event) => {
  const button = event.target.closest?.("[data-selection-speak]");
  if (!button) return;
  playAudio(button.dataset.selectionSpeak, button.dataset.selectionAudio);
});
window.addEventListener("pointerdown", primeSpeech, { once: true });
if ("speechSynthesis" in window) {
  speechSynthesis.addEventListener?.("voiceschanged", primeSpeech);
}
fetchFrontendConfig().then(() => {
  render();
  if (isLoggedIn() && !hasSkippedAuth()) {
    checkLocalDataMigration().then(() => {
      reloadLessonScopedState();
      render();
    });
  } else if (!isLoggedIn() && !localStorage.getItem("japaflow:authPromptDismissed") && window.parent === window) {
    state.modal = { type: "authPrompt" };
    render();
  }
});

function handleKeyboard(event) {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (event.target.closest?.("input, textarea, select, [contenteditable='true']")) return;
  if (state.modal) return;

  const current = route().page;
  const key = event.key || event.code;
  const now = Date.now();
  const actionKey = `${current}:${key || event.code}:${event.type}`;
  if (event.type === "keyup" && lastKeyAction.key === `${current}:${key || event.code}:keydown` && now - lastKeyAction.at < 180) return;

  if (event.type === "keydown" && current === "vocab" && chooseVocabTestOptionByKey(key)) {
    event.preventDefault();
    lastKeyAction = { key: actionKey, at: now };
    return;
  }

  if (current === "vocab" && (key === "ArrowLeft" || event.code === "ArrowLeft" || key === "ArrowRight" || event.code === "ArrowRight")) {
    event.preventDefault();
    lastKeyAction = { key: actionKey, at: now };
    const step = key === "ArrowRight" || event.code === "ArrowRight" ? 1 : -1;
    setCurrentWord(state.currentWord + step, true);
  }

  if (current === "text" && (key === "ArrowUp" || event.code === "ArrowUp" || key === "ArrowDown" || event.code === "ArrowDown")) {
    event.preventDefault();
    lastKeyAction = { key: actionKey, at: now };
    const step = key === "ArrowDown" || event.code === "ArrowDown" ? 1 : -1;
    setTextSentenceIndex(state.currentSentence + step);
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
