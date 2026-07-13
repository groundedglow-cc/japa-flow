我基于 lesson1-4 设计后，又抽查了 lesson7、lesson18、lesson31、lesson44 的最后 4 页。结论：建议不要按“原书页面”建模，而是按“练习活动 Activity + 可复用素材 Asset + 可交互答题槽 Blank/Input”建模。这样既能保留图片/语音/例句/划线部分，也能让页面清楚表达用户到底要填词、选
  项、整句、对话还是判断。

  核心结构

  type LessonPractice = {
    lessonId: string
    title: string
    sourcePages: SourcePage[]
    vocabulary?: VocabularyEntry[]
    activities: PracticeActivity[]
  }

  type SourcePage = {
    pageNo: number
    imagePath: string
  }

  type PracticeActivity = {
    id: string
    section: "practice_1" | "practice_2" | "vocabulary" | "culture_note"
    order: number
    title: string
    instruction: string
    interaction:
      | "pattern_substitution"
      | "dialogue_practice"
      | "fill_blank"
      | "single_choice"
      | "multi_choice"
      | "true_false"
      | "sentence_ordering"
      | "translation"
      | "listening_repeat"
      | "listening_answer"
      | "role_play"
      | "reading_cloze"
    answerUnit: "word" | "phrase" | "sentence" | "dialogue" | "choice" | "boolean" | "free_text" | "none"
    requiresAudio?: boolean
    audio?: ActivityAudio
    assets?: ImageAsset[]
    displayAssets?: string[]
    layout: LayoutBlock[]
    items: PracticeItem[]
  }

  type ActivityAudio = {
    source: "textbook_exercise" | "external_url"
    url?: string
    label?: string
    transcript?: AudioTranscript
  }

  type AudioTranscript = {
    text: string
    source: "asr" | "manual"
    segments?: Array<{
      itemNumber?: string
      speaker?: string
      text: string
    }>
    confidenceNote?: string
  }

  页面排版块

  type LayoutBlock =
    | { type: "text"; text: RichText[] }
    | { type: "example"; content: ExampleBlock }
    | { type: "dialogue"; lines: DialogueLine[] }
    | { type: "image_grid"; assets: ImageAsset[]; columns?: number }
    | { type: "map"; image: ImageAsset; labels?: Label[] }
    | { type: "word_bank"; words: RichText[] }
    | { type: "passage"; title?: string; lines: RichText[] }

  题目与答题

  type PracticeItem = {
    id: string
    number: string
    prompt: PromptPart[]
    inputSlots?: InputSlot[]
    choices?: Choice[]
    answer?: Answer
    relatedAssets?: string[]
    renderHint?: "inline" | "dialogue" | "card" | "table_row" | "map_question"
  }

  type InputSlot = {
    id: string
    expectedUnit: "word" | "phrase" | "sentence" | "particle" | "conjugated_form" | "number" | "boolean"
    width?: "short" | "medium" | "long"
    placeholder?: string
  }

  type PromptPart =
    | { type: "text"; text: string; underline?: boolean; ruby?: string }
    | { type: "blank"; slotId: string }
    | { type: "choice_ref"; choiceIds: string[] }
    | { type: "asset_ref"; assetId: string }

  type Answer = {
    slotValues?: Record<string, string | string[]>
    choiceIds?: string[]
    boolean?: boolean
    acceptableAlternatives?: string[]
  }

  素材结构

  type ImageAsset = {
    id: string
    kind: "person_card" | "object_card" | "scene" | "map" | "table" | "source_crop"
    imagePath?: string
    label?: string
    meta?: Record<string, string | number>
  }

  type DialogueLine = {
    speaker: string
    parts: PromptPart[]
  }

  type VocabularyEntry = {
    kana: string
    kanjiOrTerm: string
    pos?: string
    chinese: string
  }

  为什么这套结构能满足友好页面

  1. 图片、语音、词汇、例句、划线部分都可表达：
     图片放 ImageAsset，语音放 ActivityAudio，生词放 VocabularyEntry，例句放 example，划线用 PromptPart.underline。

  2. 排版接近原书：
     对话用 dialogue.lines 一句一行；图卡题用 image_grid；地图/楼层/价格表用 map/table/source_crop；日记/长文用 passage。

  3. 答题无歧义：
     每个活动有 answerUnit，每个空有 expectedUnit。例如：
      - 只填一个助词：expectedUnit: "particle"
      - 填动词变形：expectedUnit: "conjugated_form"
      - 写完整句：expectedUnit: "sentence"
      - 圈选/判断：answerUnit: "choice" 或 "boolean"

  4. placeholder 只提示作答格式，不给出正确答案：
     假定用户可以从例句中学会替换规则。输入框 placeholder 应写“甲、乙1、乙2三行完整会话”“输入 1 个完整句子”等格式说明，不能把本题正确答案或局部答案放进 placeholder。

  5. 正确答案必须显式建模，开放题要声明判分模式：
     普通题使用 exact；有多个可接受答案的题使用 acceptable_answers，并在 modelAnswers/acceptableAlternatives 中列出参考答案。例如是否类开放题至少应包含肯定和否定两类完整回答。真正按个人情况作答、无法自动判分的题使用 self_check 或 manual_review。

  6. 图片和录音以大题为资源单元：
     一道练习大题下面即使包含多个小题，也只在 PracticeActivity 层配置 displayAssets 和 audio。不要把同一张看图练习拆到每个 PracticeItem 上重复展示，也不要把同一段大题录音挂到每个小题上。小题只负责题干、输入、答案和判分。

  6.1 教材录音 URL 由课程数据计算：
     如果活动需要教材录音，配置 audio: { source: "textbook_exercise" }，不要手写完整 URL。渲染时根据 lessonId、section、order 计算：
      - unit = ceil(lessonNo / 4)，例如 lesson1 是 unit1，lesson48 是 unit12
      - lesson 路径使用 lesson{lessonNo}
      - practice_1 对应 Exe1，practice_2 对应 Exe2
      - order 对应大题序号，例如练习 I · 2 是 Exe1_2
     URL 模板：
     https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit{unit}/lesson{lessonNo}/Exe{exerciseNo}_{order}.mp3

  7. 图片坐标独立成课次级 catalog：
     不把 crop 坐标散落在题目里。每课维护 LessonImageCropCatalog，活动用 displayAssets 引用要展示的局部图片。渲染时如果 displayAssets 指向的坐标不存在，展示“暂未正确配置好图片，请联系管理员。”，而不是静默缺失。看图练习优先裁切整道大题的图片区域；只有确有交互需要时，才额外生成单个小图坐标。

  8. 答案完整性检查：
     每个 PracticeItem 都必须有 answer，除非同时满足：
      - answerSource: "audio"
      - 所属 PracticeActivity 有 requiresAudio: true 和 audio: { source: "textbook_exercise" }
      - 该答案确实只能由录音转写得到
     看图、替换、选择、填空、排序、中译日、根据例句变换等题目，即使依赖图片，也必须根据图片和例句反推出 answer。不能因为题目有图片就省略答案。

  9. 录音题答案补全流程：
     强制要求：对有 audio: { source: "textbook_exercise" } 的活动，必须先按规则计算 URL、获取 mp3、转写为日语文本，再按题型写入答案。没有 transcript 之前，不允许为录音题生成或猜测 answer。
      - 听录音写句子：每个小题 answer.slotValues.answer = 对应句子的完整转写。
      - 听录音回答问题：prompt 保持“听录音问题并回答”，answer.modelAnswers 写根据录音问题可接受的完整回答；是否类问题至少写肯定/否定两类答案。
      - 听录音选择/判断：answer.choiceIds 或 answer.boolean 来自录音内容。
      - 听录音会话：answer.slotValues.answer 使用完整多行会话，保留甲/乙等说话人。
     如果不能可靠转写，保留 answerSource: "audio" 且不伪造答案，但必须在 note 或生成报告中列出缺失原因和音频 URL。
     对“看图听录音回答”类题目，答案不是只来自 transcript。必须把 transcript 中的问题，与该活动 displayAssets 或相关看图练习中的人物卡/地图/表格信息合并推断。例如 lesson1 练习 I · 5 中，录音问题“キムさんは中国人ですか”需要结合练习 I · 4 人物卡中“キム／韓国人／研修生”，答案应为“いいえ、違います。”。

  9.1 录音转写测验与准入标准：
     以 lesson1 练习 I · 2 为测试样例，可计算得到：
     https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit1/lesson1/Exe1_2.mp3
     测试流程必须完成：
      - 下载音频，并确认文件可读。
      - 使用 ASR 工具或人工听写得到日语转写。
      - 将完整转写写入 activity.audio.transcript.text。
      - 按小题切分到 activity.audio.transcript.segments。
     - 根据题型把每个片段写入 PracticeItem.answer。
      - 如题目要求看图回答，必须读取对应 displayAssets 或相关图片数据，把录音问题和图片信息一起用于推断答案。
     - 抽查答案必须能从 transcript 逐字或按题型规则推出。
     当前标准工具链使用 scripts/transcribe-textbook-audio.mjs：先用 ffmpeg-static 将教材 MP3 转成 16k mono PCM WAV，再复用 server.mjs 中同款 Azure Speech 短音频接口转写。若缺少 ffmpeg-static、AZURE_SPEECH_KEY 或 AZURE_SPEECH_REGION，模型必须报告“音频可获取但无法转写”，不能根据题目、例句或旧数据猜答案。

  可复用生成提示词

  将下面提示词交给没有本对话记忆的模型，并附上目标课次目录、practise-design.md、practice/lesson-practice-types.ts，以及 course-assets/by-lesson/lessonN 下的 .webp 文件。

  ```
  你要为 JapaFlow 生成 lesson{N} 的练习数据。只允许依据：
  1. practise-design.md
  2. practice/lesson-practice-types.ts
  3. course-assets/by-lesson/lesson{N}/ 下的 .webp 原始教材截图
  4. 按规则计算出的教材录音 URL

  目标：
  - 生成 lesson{N}-practice-data.ts，类型为 LessonPractice。
  - 如有看图练习，生成 lesson{N}-image-crops.ts，类型为 LessonImageCropCatalog。
  - 数据必须能驱动练习页面，不只是复刻原书截图。

  约束：
  - 不参考仓库其他课程或旧数据。
  - 练习以 PracticeActivity 为大题单位；小题用 PracticeItem。
  - 图片和录音只挂在 PracticeActivity 上，不挂在单个 PracticeItem 上。
  - 看图练习优先裁切整道大题区域，PracticeActivity.displayAssets 引用裁切 ID。
  - 录音地址不要手写，活动只写 audio: { source: "textbook_exercise" }，由 lessonId、section、order 计算。
  - 录音答案必须来自真实转写。没有 transcript 之前，不允许生成录音题 answer；不能根据题目、例句、旧数据或常识猜录音答案。
  - 每个非纯录音小题必须有 answer。
  - placeholder 只写作答格式，不能泄露正确答案。
  - 用户看到例句和题干后，必须 100% 知道要填词、短语、句子、对话、选择还是判断。

  处理步骤：
  1. 读取目标课次最后几页练习截图，识别练习 I、练习 II 的所有大题和小题，不得跳题。
  2. 为每个大题建立 PracticeActivity，确定 interaction、answerUnit、layout、items。
  3. 把例句完整建模。例句中所有替换变量都必须用 underline/substitutionKey 表达，不只标一部分。
  4. 根据例句和题干为每个小题设计 inputSlots，expectedUnit 必须准确。
  5. 为非纯录音题生成 answer：
     - 填空：slotValues
     - 选择：choiceIds
     - 判断：boolean
     - 排序/翻译/替换：slotValues.answer
     - 会话：slotValues.answer 为多行完整会话
     - 开放但可接受多答案：modelAnswers + acceptableAlternatives + evaluationMode
  6. 对纯录音题：
     - 先计算音频 URL，下载或读取音频。
     - 优先运行 node scripts/transcribe-textbook-audio.mjs lesson{N} practice_1|practice_2 {order}。
     - 该脚本会下载 MP3，用 ffmpeg-static 转为 16k mono PCM WAV，再调用 Azure Speech。
     - 如果脚本不可用，再检查是否有其他 ASR 工具、ASR API 或人工听写结果。
     - 能转写则把完整文本写入 activity.audio.transcript.text。
     - 按小题切分 transcript.segments，segment.itemNumber 必须对应小题 number。
     - 根据题型把 segment 写入 answer；听写句子用 slotValues.answer，选择题用 choiceIds，判断题用 boolean，开放问答用 modelAnswers/acceptableAlternatives。
     - 不能转写才允许暂缺 answer，并标明 answerSource: "audio"，同时在生成报告中列出：activity id、音频 URL、缺失原因、需要人工或 ASR 补全。
  7. 最后做自检：
     - 所有大题编号连续。
     - 所有小题编号连续。
     - 除纯录音未转写题外，每个 PracticeItem 都有 answer。
     - 所有有图片的大题要么有 displayAssets，要么页面会显示管理员提示。
     - 所有 requiresAudio 的大题都能按规则得到 URL。
     - 所有已补答案的录音题，都能从 activity.audio.transcript.segments 找到对应来源。
  ```

  例子：lesson1 的替换练习

  {
    "id": "l1-p1-a1",
    "section": "practice_1",
    "order": 1,
    "title": "仿照例句替换画线部分进行练习",
    "instruction": "根据给出的词组，替换例句中的画线部分。",
    "interaction": "pattern_substitution",
    "answerUnit": "sentence",
    "layout": [
      {
        "type": "example",
        "content": {
          "before": "わたし／日本人",
          "after": [
            { "type": "text", "text": "わたしは " },
            { "type": "text", "text": "日本人", "underline": true },
            { "type": "text", "text": "です。" }
          ]
        }
      }
    ],
    "items": [
      {
        "id": "l1-p1-a1-q1",
        "number": "1",
        "prompt": [{ "type": "text", "text": "李さん／中国人" }],
        "inputSlots": [
          {
            "id": "answer",
            "expectedUnit": "sentence",
            "width": "long"
          }
        ],
        "answer": {
          "slotValues": {
            "answer": "李さんは中国人です。"
          }
        }
      }
    ]
  }

  抽查验证

  lesson7：有日程叙述、角色扮演、听录音后选择、看图完成句子。现有 dialogue_practice、role_play、single_choice、fill_blank 足够。

  lesson18：有形容词变化、状态变化、听录音完成日记、正误判断。需要用 reading_cloze/listening_answer，但不需要新增底层结构。

  lesson31：有条件句、地图路线、长句填空、听录音问答。map + fill_blank + dialogue 可以覆盖。

  lesson44：有传闻/样态/过度表达、听录音选答案、正误判断、单位数量表达。conjugated_form、choice、boolean、number 都能覆盖。

  建议下一步可以把这套结构落成一个 practice.schema.json 或 TypeScript 类型文件，然后选 lesson1 做一份完整样例数据，用它反推页面组件。
