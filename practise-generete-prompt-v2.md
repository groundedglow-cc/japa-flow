你要为 JapaFlow 初始化指定课次 lesson{N} 的练习数据和静态预览页面。

  用户会给出目标课次 N，例如 N=2、N=3、N=48。你必须用 N 推导所有文件名、目录、lessonId、音频 URL、unit 编号和页面内容。

  只允许依据：
  1. practise-design.md
  2. practice/lesson-practice-types.ts
  3. practice/lesson-practice-components.ts
  4. course-assets/by-lesson/lesson{N}/ 下的 .webp 原始教材截图
  5. scripts/generate-lesson-image-crops.py
  6. scripts/transcribe-textbook-audio.mjs
  7. 按规则计算出的教材录音 URL

  不要参考仓库中其他旧课程数据。已有 lesson1 只能作为产物形态参考，不允许复制题目内容、答案或练习结构。

  目标产物：
  - practice/lesson{N}-image-crops.ts
  - practice/lesson{N}-practice-data.ts
  - practice/lesson{N}-practice-preview.html
  - 如需要，复用现有 preview CSS，但不要破坏其他课次页面

  命名规则：
  - lessonId: "lesson{N}"
  - 数据导出名：lesson{N}Practice
  - 图片裁切导出名：lesson{N}ImageCrops
  - activity id: l{N}-p1-a{order} 或 l{N}-p2-a{order}
  - item id: l{N}-p1-a{order}-q{number} 或 l{N}-p2-a{order}-q{number}

  强制规则 A：例句不能丢失
  1. 每个大题如果原教材中出现了例句、示范对话、示范答案、替换格式、划线部分、箭头转换，都必须进入 PracticeActivity.layout 或 PracticeItemGroup.example。
  2. 不允许只写 instruction 而丢掉例句。
  3. 不允许把例句改写成泛泛说明。必须保留原始例句中的日语句子、说话人、箭头前后关系。
  4. 如果一个大题有多个例句，必须全部保留，并用 itemGroups 或多个 layout example 表达。
  5. 如果例句有「例1」「例2」且对应不同句式，必须拆成不同 PracticeItemGroup；对应小题必须挂到正确 exampleGroupId。
  6. 例句中的所有替换变量都要体现 underline/substitutionKey，不允许只标其中一个词。
  7. 自检时必须逐个大题回答：这个大题原书是否有例句？如果有，数据里在哪里表达？
  8. 不只要“数据里有例句”，静态 preview 中也必须真实展示例句。不得出现数据文件保留了 example，但 preview 只显示题目和输入框的情况。
  9. 大题内部的呈现顺序必须跟教材截图中的视觉顺序一致。若教材顺序是“图片 → 例 1 → 小题作答 → 图片 → 例 2 → 小题作答”，preview 也必须按这个顺序渲染；不得把所有图片统一放到大题顶部后再显示所有例句和题目。
  10. 一个大题内有多个例句时，必须始终按“例句 → 该例句对应的小题 → 下一条例句 → 下一组小题”的交错结构排布。例如原书是「例 1、练习 1、练习 2、练习 3、例 2、练习 4、练习 5」，preview 和数据分组也必须保持这个顺序；不得渲染成「例 1、例 2、练习 1、练习 2、练习 3、练习 4、练习 5」。
  11. 对同一大题中多个例句分别服务不同小题区段的情况，必须把图片、例句和对应 items 绑定为 visual section。即使 PracticeActivity 仍是一个大题，preview 也要分段显示，不能把例句集中或省略。
  12. 例句的展示形式必须贴近原图排版。如果原图把例句拆成多行，例如第一行是「[例] 词汇/替换格式」，第二、三行是「甲：...」「乙：...」，preview 也必须拆成对应多行，并保留「甲」「乙」等说话人标签；不得压缩成一行或把说话人混进普通文本。
  13. 例句中的词汇提示、箭头转换、说话人、回答行是不同信息层级，渲染时要有视觉区隔。会话例句优先用 dialogue-line 结构表达，而不是普通段落。

  强制规则 B：图片题必须 CSS 裁切，不允许整页图替代
  1. 带图片的练习题，必须使用 LessonImageCropCatalog + displayAssets。
  2. 不允许把整张教材页直接作为 image_grid 放在大题上来替代裁切图。
  3. 只有 sourcePages 区域可以展示完整教材页；练习大题内部不能展示完整教材页。
  4. 看图练习优先裁切整道大题图片区域，而不是拆到每个小题上。
  5. 必须先运行或复用：
     python3 scripts/generate-lesson-image-crops.py course-assets/by-lesson/lesson{N} --lesson-id lesson{N} --format ts --export-name lesson{N}ImageCrops
  6. 如果自动裁切结果可用，写入 practice/lesson{N}-image-crops.ts。
  7. 如果自动裁切不准，可以人工调整 crop 坐标，但仍必须写入 lesson{N}-image-crops.ts。
  8. PracticeActivity.assets 必须引用 crop catalog 中的 ImageAsset。
  9. PracticeActivity.displayAssets 必须引用要展示的 crop id。
  10. 如果确实无法取得坐标，才允许 displayAssets 指向缺失 ID，让页面显示：
      暂未正确配置好图片，请联系管理员。
  11. 不允许用整页图“临时代替”裁切图。
  12. 自检时必须列出所有图片题：crop id、source page、crop 坐标、是否展示在 activity 层。
  13. crop 坐标必须用截图逐项目视校准，尤其检查 y/height 是否垂直偏移。自动脚本只提供初稿，不能把明显上移/下移、截断标题或截掉图片边框的结果直接提交。
  14. crop 必须覆盖教材中该题实际需要看的完整区域：题号、图框、标签、价格/楼层等关键信息都不能被裁掉；也不能向上下扩展到相邻大题。
  15. preview 中展示 crop 时必须使用 CSS crop-window 或等效裁切渲染，不得在活动内部用完整页图片替代 crop。底部 sourcePages 才能展示完整页。
  16. 如果题目有词框、选项框、地图、表格等视觉辅助，也视为需要展示的素材：能用结构化 word_bank 表达就必须在 preview 展示；需要保持教材视觉区域时也要加入 crop catalog。
  17. crop.aspectRatio 必须按真实像素比例计算，不允许凭感觉填写，也不能简单使用百分比宽高相除。正确公式：
      aspectRatio = (crop.widthPercent * sourceImagePixelWidth) / (crop.heightPercent * sourceImagePixelHeight)
      例如原图为 1059x1600，crop width=35.5%、height=28.5%，真实比例约为 (35.5*1059)/(28.5*1600)。
  18. 如果 preview 中图片看起来被横向或纵向拉伸，优先检查 aspectRatio 是否与真实像素比例一致；其次检查 crop 框是否过窄、过宽、过高或过低。不能通过随意改 CSS 逃避 crop 数据错误。
  19. 人工调整 crop 时必须同时更新 lesson{N}-image-crops.ts 和 preview 中任何内联/镜像的 crop 配置，避免 catalog 与 preview 不一致。
  20. 对地图、楼层图、表格、价格图这类有明显原始比例的图片，必须在最终自检中目视确认：文字没有变形，方格/楼层/商品图没有被压扁或拉宽。
  21. crop 的 x/y/width/height 与 aspectRatio 是一组数据：改变裁切框宽高后必须重新计算 aspectRatio。不得沿用旧 aspectRatio。
  22. 如果 CSS crop-window 用 aspect-ratio 控制窗口尺寸，必须确认窗口比例等于裁切区域真实比例；否则即使裁切坐标准确，也会出现视觉拉伸。

  核心建模要求：
  1. 完整识别 lesson{N} 的练习 I、练习 II 所有大题和小题，不得跳题。
  2. 每个大题建模为 PracticeActivity，每个小题建模为 PracticeItem。
  3. 图片和录音都挂在 PracticeActivity 层，不挂在单个 PracticeItem 层。
  4. 所有非录音题必须有 answer。
  5. 录音题必须先转写，再生成答案。没有 transcript 之前，不允许猜答案。
  6. 对有 audio: { source: "textbook_exercise" } 的活动，先运行：
     node scripts/transcribe-textbook-audio.mjs lesson{N} practice_1 {order}
     或：
     node scripts/transcribe-textbook-audio.mjs lesson{N} practice_2 {order}
  7. 将转写结果写入 activity.audio.transcript.text，并按小题切分 transcript.segments。
  8. 根据 transcript、例句、题目提示、图片信息共同推断答案。
  9. 听写句子用 answer.slotValues.answer。
  10. 选择题用 answer.choiceIds。
  11. 判断题用 answer.boolean。
  12. 开放问答用 modelAnswers + acceptableAlternatives + evaluationMode。
  13. placeholder 只能提示作答格式，不能泄露正确答案。
  14. 用户看到题干和例句后，必须明确知道要填词、句子、对话、选择还是判断。
  15. preview HTML 必须支持 ?admin=1，开启后自动填入所有正确答案，并自动选中选择题正确项，方便人工核验。
  16. preview 中选择题的视觉选项不得重复编号。如果选项文本本身已经是「①」「②」「③」这类编号，就不要再额外显示阿拉伯数字序号。
  17. ASR 结果尾部漏识别时，不能简单断言“录音不完整”。必须结合音频时长、题目模式、例句、前后小题和 ASR 原文判断：如果录音模式完整且答案可由录音模式和例句确定，可以补全答案，但要在 confidenceNote/note 中说明“ASR 漏字，答案按录音模式和例句补全”。

  音频 URL 规则：
  - unit = ceil(N / 4)
  - lesson 路径为 lesson{N}
  - practice_1 对应 Exe1
  - practice_2 对应 Exe2
  - order 对应大题序号
  - URL 模板：
    https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit{unit}/lesson{N}/Exe{exerciseNo}_{order}.mp3

  执行顺序：
  1. 读取 course-assets/by-lesson/lesson{N}/ 下全部 .webp。
  2. 找出练习页，完整转写练习 I、练习 II 的所有大题、小题和例句。
  3. 先制作“练习清单”，列出：
     - section
     - order
     - title
     - 原书例句/示范
     - 小题编号
     - 是否图片题
     - 是否录音题
     - 预期 answerUnit
  4. 对每个大题检查例句是否已进入数据结构。
  5. 对图片题运行 crop 生成脚本，生成 lesson{N}-image-crops.ts。
  6. 对所有录音大题逐个转写。
  7. 生成 lesson{N}-practice-data.ts。
  8. 生成 lesson{N}-practice-preview.html。
  9. 为 preview 添加 ?admin=1 自动填答案逻辑。
  10. 自检：
      - 大题编号连续。
      - 小题编号连续。
      - 每个有例句的大题都保留了例句。
      - 多例句大题正确拆分 itemGroups。
      - 除无法转写的纯录音题外，每个 PracticeItem 都有 answer。
      - 所有录音题有 transcript 或明确缺失报告。
      - 所有图片题都使用 crop catalog + displayAssets。
      - 大题内部没有直接展示完整教材页。
      - admin=1 填充字段数量与输入框数量一致。
      - preview 的每个大题都按教材视觉顺序展示：图片/词框/例句/小题作答区的相对顺序不能颠倒。
      - 多例句大题必须按“例句 → 对应小题 → 下一条例句 → 对应小题”的交错顺序展示，不得把多个例句集中展示在所有题目前。
      - preview 的例句行数、说话人标签和词汇提示应与原图排版一致，不得把多行例句压成一行。
      - 所有 crop 都经过目视校准，报告中说明自动识别是否被人工调整。
      - 选择题若使用圆圈编号选项，preview 中没有额外阿拉伯数字编号。
  11. 运行检查：
      - node --check practice/lesson{N}-practice-data.ts
      - node --check scripts/transcribe-textbook-audio.mjs
      - git diff --check

  最终汇报必须包含：
  1. 创建/修改了哪些文件。
  2. 每个大题是否保留例句，例句在数据中的位置。
  3. 哪些录音已转写，哪些答案来自录音转写。
  4. 哪些图片题使用了 crop，列出 crop id 和坐标。
  5. 是否存在未能裁切的图片题。
  6. 是否存在无法确认的题目或答案。

  关键变化是这两条：

  - 先制作“练习清单”，强迫模型在写数据前枚举每个大题的例句，避免漏掉。
  - 图片题禁止整页图替代，必须走 lesson{N}-image-crops.ts + displayAssets，整页图只能出现在底部 sourcePages。
