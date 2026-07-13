你要为 JapaFlow 初始化指定课次 lesson{N} 的练习数据和静态预览页面。

  用户会给出目标课次 N，例如 N=2、N=3、N=48。你必须用 N 推导所有文件名、目录、lessonId、音频 URL、unit 编号和页面内容。

  只允许依据：
  1. practise-design.md
  2. practice/lesson-practice-types.ts
  3. practice/lesson-practice-components.ts
  4. course-assets/by-lesson/lesson{N}/ 下的 .webp 原始教材截图
  5. 按规则计算出的教材录音 URL
  6. scripts/transcribe-textbook-audio.mjs
  7. scripts/generate-lesson-image-crops.py

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

  核心要求：
  1. 完整识别 lesson{N} 的练习 I、练习 II 所有大题和小题，不得跳题。
  2. 每个大题建模为 PracticeActivity，每个小题建模为 PracticeItem。
  3. 图片和录音都挂在 PracticeActivity 层，不挂在单个 PracticeItem 层。
  4. 看图练习优先生成整道大题区域裁切，写入 LessonImageCropCatalog，活动用 displayAssets 引用。
  5. 如果图片题暂时没有可用 crop，页面图片位置必须显示：暂未正确配置好图片，请联系管理员。
  6. 所有非录音题必须有 answer。
  7. 录音题必须先转写，再生成答案。没有 transcript 之前，不允许猜答案。
  8. 对有 audio: { source: "textbook_exercise" } 的活动，先运行：
     node scripts/transcribe-textbook-audio.mjs lesson{N} practice_1 {order}
     或：
     node scripts/transcribe-textbook-audio.mjs lesson{N} practice_2 {order}
  9. 将转写结果写入 activity.audio.transcript.text，并按小题切分 transcript.segments。
  10. 根据 transcript、例句、题目提示、图片信息共同推断答案。
  11. 听写句子用 answer.slotValues.answer。
  12. 选择题用 answer.choiceIds。
  13. 判断题用 answer.boolean。
  14. 开放问答用 modelAnswers + acceptableAlternatives + evaluationMode。
  15. placeholder 只能提示作答格式，不能泄露正确答案。
  16. 用户看到题干和例句后，必须明确知道要填词、句子、对话、选择还是判断。
  17. preview HTML 必须支持 ?admin=1，开启后自动填入所有正确答案，并自动选中选择题正确项，方便人工核验。

  音频 URL 规则：
  - unit = ceil(N / 4)
  - lesson 路径为 lesson{N}
  - practice_1 对应 Exe1
  - practice_2 对应 Exe2
  - order 对应大题序号
  - URL 模板：
    https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit{unit}/lesson{N}/Exe{exerciseNo}_{order}.mp3

  图片规则：
  - 读取 course-assets/by-lesson/lesson{N}/ 下的 .webp。
  - 优先读取倒数第二、三、四张图片，提取看图练习区域。
  - crop 坐标写入 lesson{N}-image-crops.ts。
  - 坐标为百分比，不写死像素到题目数据里。
  - 题目数据只通过 displayAssets 引用裁切 ID。

  执行顺序：
  1. 读取 lesson{N} 图片，确认练习页范围。
  2. 识别所有大题、小题、例句、图片题、录音题。
  3. 生成或补全 lesson{N}-image-crops.ts。
  4. 对所有录音大题逐个转写。
  5. 生成 lesson{N}-practice-data.ts。
  6. 生成 lesson{N}-practice-preview.html。
  7. 为 preview 添加 ?admin=1 自动填答案逻辑。
  8. 自检：
     - 大题编号连续。
     - 小题编号连续。
     - 除无法转写的纯录音题外，每个 PracticeItem 都有 answer。
     - 所有录音题有 transcript 或明确缺失报告。
     - 所有图片题有 displayAssets 或管理员提示。
     - admin=1 填充字段数量与输入框数量一致。
  9. 运行检查：
     - node --check practice/lesson{N}-practice-data.ts
     - node --check scripts/transcribe-textbook-audio.mjs
     - git diff --check

  最终汇报：
  - 创建/修改了哪些文件。
  - 哪些录音已转写。
  - 哪些答案来自录音转写。
  - 哪些图片 crop 自动识别成功。
  - 是否有无法确认的题目或答案。

  这版就可以对任意课次复用。用户只需要说“初始化 lesson3”或“初始化第 48 课”，模型就应把 {N} 替换成对应课号，并按 ceil(N / 4) 计算 unit。
