# JapaFlow 练习数据生成 Prompt V3

你要为 JapaFlow 初始化指定课次 `lesson{N}` 的练习数据和 React 静态预览页面。

用户会给出目标课次 `N`，例如 `N=2`、`N=3`、`N=48`。你必须用 `N` 推导所有文件名、目录、`lessonId`、音频 URL、unit 编号和页面内容。

本 prompt 是生成练习数据的唯一主提示词，已经包含 kana/ruby 标准逻辑。执行时不需要再额外引用 `JapaFlow-PLAN-V4.1-practice-kana-ruby-design.md`。

`JapaFlow-PLAN-V4.1-practice-kana-ruby-design.md` 是设计计划和实现依据；本文件是实际生成 lesson 数据时使用的执行 prompt。两者发生冲突时，以本文件的生成规则为准，并回头更新设计计划，避免规则分裂。

## 前置条件

当前仓库必须已经实施 Practice Kana Ruby V4.1 类型和渲染逻辑：

- `RichText` 使用 `kana?: string`，不再使用 `ruby?: string`。
- `PracticeItem` 支持 `promptKana?: string`。
- 例句结构支持 `beforeKana?: string`、`afterKana?: string`。
- `DialogueLine` 支持 `kana?: string`。
- React preview 通过 `kana` 渲染 ruby，不读取 `part.ruby`。
- Answer 不包含 kana 字段，答案校验不读取 kana。
- `PracticeActivity` / `PracticeItem` 支持 `responseScope?: ResponseScope` 与 `responseScopeHint?: string`，用于显式定义“用户应该写完整句子、完整对话、只写回答部分、只写词语”等作答范围。

如果发现当前类型或组件仍然只支持 `ruby`，先停止生成新 lesson，报告“需要先实施 V4.1 类型和渲染改造”。

## 只允许依据

1. `practise-design.md`
2. `practice/lesson-practice-types.ts`
3. `practice/lesson-practice-components.ts`
4. `practice/react/PracticePreview.jsx`
5. `practice/react/entry.jsx`
6. `course-assets/by-lesson/lesson{N}/` 下的 `.webp` 原始教材截图
7. `scripts/generate-lesson-image-crops.py`
8. `scripts/transcribe-textbook-audio.mjs`
9. 按规则计算出的教材录音 URL

不要参考仓库中其他旧课程数据来复制题目内容、答案或练习结构。已有 lesson 只能作为产物形态参考，例如文件命名、HTML 壳结构、React 入口注册方式。

## 目标产物

必须创建或更新：

- `practice/lesson{N}-image-crops.ts`
- `practice/lesson{N}-practice-data.ts`
- `practice/lesson{N}-practice-preview.html`
- `practice/react/entry.jsx`
- `practice/dist/practice-preview-react.js`

默认不得修改：

- `practice/react/PracticePreview.jsx`
- `practice/lesson1-practice-preview.css`
- `practice/lesson-practice-components.ts`
- `practice/lesson-practice-types.ts`
- `practice/practice-answer-format.js`

这些文件属于全局模板、全局样式、全局类型或全局交互。生成单个 lesson 时，只能让 lesson 数据适配已有模板，不能为某一课生成定制 UI。

只有当教材中出现现有数据结构无法表达的新题型时，才允许提出模板扩展方案。此时必须先停止生成，报告：

1. 哪个题型无法用现有结构表达。
2. 需要扩展哪个全局类型。
3. 需要扩展哪个全局 React 组件。
4. 为什么不能只通过 lesson 数据表达。

未经确认，不要修改全局模板或样式。

## 命名规则

- `lessonId`: `"lesson{N}"`
- 数据导出名：`lesson{N}Practice`
- 图片裁切导出名：`lesson{N}ImageCrops`
- activity id: `l{N}-p1-a{order}` 或 `l{N}-p2-a{order}`
- item id: `l{N}-p1-a{order}-q{number}` 或 `l{N}-p2-a{order}-q{number}`

## 强制规则 0：用户答案存储兼容

用户答案存储协议是稳定契约，优先级高于重新生成 lesson 数据的便利性。重生成、修正或补全任意 lesson 时，必须保护浏览器 `localStorage` 中已经保存的用户答案。

固定存储 key：

```text
japaflow.practice.session.v1:lesson{N}
```

固定记录结构：

```ts
{
  lessonId: "lesson{N}",
  activities: {
    [activityId]: {
      answers: {
        [itemId]: {
          slotValues?: {
            [slotId]: string
          },
          choiceIds?: string[]
        }
      },
      grading?: unknown,
      updatedAt?: string
    }
  }
}
```

生成规则：

1. 已发布 lesson 的 `activityId`、`itemId`、`slotId`、`choice.id` 必须保持稳定。只改题目文案、答案、kana、图片裁切、录音转写或布局时，不得顺手重命名这些 id。
2. 单输入答案的 slot id 必须优先使用 `"answer"`。只有一个小题确实有多个独立答案槽时，才允许使用多个语义稳定的 slot id。
3. 选择题的 `choice.id` 是用户答案的一部分，不得因为重新生成数据而从旧 id 改成自动编号 id，或从自动编号 id 改成新 id。
4. 不得在生成、预览、构建或迁移过程中删除、清空、覆盖、重建用户的 `localStorage` 答案数据。
5. 如果教材结构修正导致必须改变 `activityId`、`itemId`、`slotId`、`choice.id` 或存储 schema，必须先停止并报告兼容风险；实现兼容读取或迁移逻辑后，才能提交新数据。
6. 兼容读取必须至少支持当前标准结构，以及旧记录中按 `itemId`、`itemId::slotId`、单个 activity key、旧 `choiceIds` 等形态保存的答案。
7. 重生成 lesson 数据后，必须自检并报告：是否保留了所有既有 activity/item/slot/choice id；是否修改了用户答案存储 schema；是否重新构建了 `practice/dist/practice-preview-react.js`。
8. `?admin=1` 自动填答案只能读取 lesson 数据中的标准答案，不得写入或污染用户答案 session。

## React Preview 规则

当前 preview 是 React bundle 模板方案，不是每课一份完整手写页面。

核心规则：`PracticePreview.jsx` 是唯一通用 UI 模板；`lesson{N}-practice-data.ts` 是每课差异的唯一主要来源。模型不应该为每一课重新生成 UI。

`practice/lesson{N}-practice-preview.html` 应该是薄 HTML 壳：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lesson {N} Practice Preview</title>
    <link rel="stylesheet" href="./lesson1-practice-preview.css" />
  </head>
  <body data-lesson-id="lesson{N}">
    <div id="practice-root"></div>
    <script src="./practice-answer-format.js"></script>
    <script type="module" src="./dist/practice-preview-react.js"></script>
  </body>
</html>
```

必须在 `practice/react/entry.jsx` 中：

1. import `lesson{N}Practice`。
2. 将 `lesson{N}` 注册到 `practices` 映射。
3. 运行 `npm run build:practice` 重新生成 `practice/dist/practice-preview-react.js`。

禁止事项：

1. 不要在 `lesson{N}-practice-preview.html` 中写 lesson-specific 练习 UI。
2. 不要在 HTML 中内联题目、答案、图片 crop、录音播放器或交互逻辑。
3. 不要为单个 lesson 新增独立 JS。
4. 不要为单个 lesson 新增独立 CSS。
5. 不要为了某一课修改通用样式，让其它 lesson 的表现发生变化。
6. 不要绕过 `PracticePreview.jsx` 直接渲染页面。

如果 preview 显示不符合教材顺序，优先检查数据结构中的 `layout`、`itemGroups`、`displayAssets`、`exampleGroupId` 是否表达正确。只有确认数据无法表达时，才提出全局模板扩展。

## 强制规则 A：完整识别练习

1. 完整识别 `lesson{N}` 的练习 I、练习 II 所有大题和小题，不得跳题。
2. 每个大题建模为 `PracticeActivity`。
3. 每个小题建模为 `PracticeItem`。
4. 图片和录音都挂在 `PracticeActivity` 层，不挂在单个 `PracticeItem` 层。
5. 所有非录音题必须有 `answer`。
6. 录音题必须先转写，再生成答案。没有 transcript 之前，不允许猜答案。
7. 题干、例句、输入框、选项必须让用户明确知道要填词、句子、对话、选择还是判断。
7.1 每个 `PracticeActivity` 必须显式填写 `responseScope`。如果同一大题内某个小题的作答范围与大题默认范围不同，必须在对应 `PracticeItem` 上覆盖 `responseScope`。
7.2 当题面、例句、录音内容与标准答案之间存在“用户可能不知道要写完整问答还是只写回答部分”的歧义时，必须填写 `responseScopeHint`，由 preview 直接展示给用户；不要只把这类信息藏在 placeholder 或判题逻辑里。
7.3 `responseScopeHint` 只用于表达“作答范围/作答格式”，不用于补充教材知识点，不用于解释语法。
8. placeholder 只能提示作答格式，不能泄露正确答案。
9. preview 必须支持 `?admin=1`，开启后自动填入所有正确答案，并自动选中选择题正确项，方便人工核验。
10. preview 中选择题的视觉选项不得重复编号。如果选项文本本身已经是 `①`、`②`、`③` 这类编号，就不要再额外显示阿拉伯数字序号。
10.1 对「在正确答案上画○」这类括号选择题，正确项是让括号所在句子本身成立、并能被后续回答自然回应的选项；不要把后续回答里出现的最终身份或补充信息误当作括号选项。例如「張さんは（会社員・学生）ですか。——いいえ、会社員では ありません。学生です。」正确选项是「会社員」，因为回答否定的是「会社員ですか」这个问题。
11. `PracticeActivity.title` 必须原样使用教材原图中的大题标题，不要改写、提炼、总结或重新命名。
12. `PracticeActivity.instruction` 只能填写教材原图中真实存在的说明文字。
13. 如果教材原图没有单独的副标题、说明句或补充说明，就不要自行新增 `instruction`，应设为空字符串或保持缺省语义，不允许为了“帮助理解”自行补一句说明。
14. 不允许把原题「注意听日期中的日期，进行练习。」改写成类似「听日期并写句子」「注意听录音中的日期，填写完整句子。」这类二次加工文案。其它题目同理，必须逐题检查。
15. 任何新增字段都必须服务于教材原图信息的结构化表达，不允许为了展示效果添加原书没有的解释性标题、副标题、总结句、教师口吻提示。

### `responseScope` 取值规范

- `word_only`: 只填写 1 个词语或多个独立词槽。
- `phrase_only`: 只填写短语，不是完整句。
- `sentence_only`: 填写 1 个完整句子。
- `dialogue_only`: 填写完整对话，通常包含说话人或多行内容。
- `answer_only`: 录音或题面中出现了提问，但用户只需要填写回答部分。
- `question_and_answer`: 用户需要同时写出提问和回答。
- `choice_only`: 用户只需要选择，不需要自行输入句子。
- `boolean_only`: 用户只需要判断正误。
- `free_response`: 自由作答，答案不固定。
- `custom`: 只有在以上类型都不够表达时才允许使用，并且必须提供 `responseScopeHint`。

### `responseScope` 推断规则

1. 先看教材原图。如果原图已经通过括号、空格、例句结构、说话人排版明确了作答范围，`responseScope` 必须忠实表达这个范围。
2. 再看标准答案。如果每个小题的答案只有 `はい、そうです。`、`いいえ、ちがいます。` 这类回答句，而录音中同时包含提问句，则通常应建模为 `answer_only`，并补 `responseScopeHint`。
3. 再看例句。如果例句展示的是“提问 + 回答”，但题目要求学生模仿后只替换回答，不能误建成 `question_and_answer`。
4. 如果题目要求学生把打乱的词语拼成两行问答，或答案天然包含两句及以上内容，应优先建模为 `dialogue_only` 或 `question_and_answer`，不要偷懒塞成 `sentence_only`。
5. 不要把“根据当前 lesson 的答案看起来像回答句”当成唯一依据。必须同时参考教材标题、例句、录音分段、图片提示和答案结构，最后再确定 `responseScope`。
6. 如果你无法确定是 `answer_only` 还是 `question_and_answer`，先停止并报告歧义点，不要擅自生成模糊数据。
7. 如果教材例句使用 `乙1` / `乙2` 展示肯定与否定两个回答分支，例如「甲：李さんですか。乙1：はい、李です。乙2：いいえ、李では ありません。」，
   标准答案必须在同一个 `slotValues.answer` 中保留完整三行 `甲` / `乙1` / `乙2`，不要把肯定分支放入 `slotValues.answer`、否定分支放入 `acceptableAlternatives`。
   这类题的用户作答范围是完整对话模板，不是二选一答案；preview 的“正确答案”也必须显示同一个 `乙1` / `乙2` 模板。

## 强制规则 B：例句不能丢失

1. 每个大题如果原教材中出现了例句、示范对话、示范答案、替换格式、划线部分、箭头转换，都必须进入 `PracticeActivity.layout` 或 `PracticeItemGroup.example`。
2. 不允许只写 instruction 而丢掉例句。
3. 不允许把例句改写成泛泛说明。必须保留原始例句中的日语句子、说话人、箭头前后关系。
4. 如果一个大题有多个例句，必须全部保留，并用 `itemGroups` 或多个 layout example 表达。
5. 如果例句有「例1」「例2」且对应不同句式，必须拆成不同 `PracticeItemGroup`；对应小题必须挂到正确 `exampleGroupId`。
6. 例句中的所有替换变量都要体现 `underline/substitutionKey`，不允许只标其中一个词。
7. 自检时必须逐个大题回答：这个大题原书是否有例句？如果有，数据里在哪里表达？
8. 不只要“数据里有例句”，静态 preview 中也必须真实展示例句。不得出现数据文件保留了 example，但 preview 只显示题目和输入框的情况。
9. 大题内部的呈现顺序必须跟教材截图中的视觉顺序一致。若教材顺序是“图片 → 例 1 → 小题作答 → 图片 → 例 2 → 小题作答”，preview 也必须按这个顺序渲染。
10. 一个大题内有多个例句时，必须始终按“例句 → 该例句对应的小题 → 下一条例句 → 下一组小题”的交错结构排布。
11. 对同一大题中多个例句分别服务不同小题区段的情况，必须把图片、例句和对应 items 绑定为 visual section。即使 `PracticeActivity` 仍是一个大题，preview 也要分段显示，不能把例句集中或省略。
12. 例句的展示形式必须贴近原图排版。如果原图把例句拆成多行，例如第一行是「[例] 词汇/替换格式」，第二、三行是「甲：...」「乙：...」，preview 也必须拆成对应多行，并保留「甲」「乙」等说话人标签。
13. 例句中的词汇提示、箭头转换、说话人、回答行是不同信息层级，渲染时要有视觉区隔。会话例句优先用 `dialogue-line` 结构表达，而不是普通段落。
14. 不允许在例句前后追加解释性文案，例如“例1 使用……”“例1 根据……填写……”这类帮助性描述。用户应直接看到教材原图中的例句结构，而不是模型的转述。
15. 如果原图例句是“示例词汇/替换词 → 示例句子”，就必须按这个结构保留；不要拆成“说明句 + 箭头例句”两层。
16. 例句推出的标准答案必须保留例句句式中的必要成分，尤其不能丢主语、助词、时态或否定形式。若原例句表明答案应是完整句子，则答案必须是完整句子，不允许只保留替换词或半句。
17. 对“根据两个词推断完整句子”的练习，如果例句中主语固定存在，例如「小野さんは……」，则对应小题答案也必须保留该主语，不能因为 prompt 只展示替换词就把主语从标准答案中删掉。
18. 例句必须同时包含完整的参考信息和作答信息。参考信息是原图中用于推导例句答案的词汇、图片标签、表格行、人物卡信息、替换词组或题干输入；作答信息是根据这些参考信息写出的示范句子或示范对话。不得只保留作答信息。
19. 如果例句依赖图片、表格、人物卡、地图、价格图等视觉信息，必须在 `layout` 或对应 `example.before/beforeParts` 中把例题使用的那一条参考信息结构化展示出来。例如人物信息图中小题列出 1-4 时，例题人物也必须同样列出，不能只列正式小题。
20. 如果正式小题在 preview 中展示了从图片抽取出的参考信息，则例题必须使用同一种展示方式包含对应参考信息，避免用户看到例句却不知道例句是由哪组输入推导出来的。
21. 对所有替换、看图、表格、地图、听图回答类练习，用户必须在不打开教材原页的情况下从 preview 看到完成作答所需的参考信息。不要只把参考信息藏在 `answer.note`、`relatedAssets`、截图内部或标准答案里。
22. 每个小题有独立参考信息时，必须把这条参考信息放在对应 `PracticeItem.prompt` / `promptKana` 中，而不是单独放一个共享 `layout` 区块。共享 `layout` 只允许承载所有小题共同依赖的图片、表格、地图、词框或整题通用说明；不能替代小题级 prompt。
23. 对「例：A／B → 完整对话；1. C／D；2. E／F」这类替换练习，例题的 `example.before` 必须是 `A／B`，每个正式小题的 `PracticeItem.prompt` 必须分别是 `C／D`、`E／F`，不得把 `C／D`、`E／F` 合并成“参考词汇”区块再让小题 prompt 写成泛泛的“听录音并写出完整对话”。
24. 自检时必须逐个大题回答：例句的参考信息在哪里展示？例句的作答信息在哪里展示？正式小题的参考信息在哪里展示？如果任一项缺失，必须先补数据再交付。
25. 替换练习必须严格区分“画线/替换变量”和“例句固定成分”。只有原图中画线、空格、词框、替换列表或小题 prompt 明确提供的变量可以替换；例句中没有画线的词、反问项、助词、否定对象、说话人轮次和句尾结构必须原样保留。不要为了让内容“更符合人物图片”而自行把固定成分替换成其它词。
26. 对「[例] 李さん：中国人 / 会社員 → 甲：李さんは 中国人ですか。乙：はい、中国人です。甲：李さんは 学生ですか。乙：いいえ、学生では ありません。会社員です。」这类题，`李さん`、`中国人`、`会社員` 是替换变量，`学生ですか / 学生では ありません` 是例句固定成分。正式小题「デュポンさん / フランス人 / 東京大学の 教授」应生成「デュポンさんは フランス人ですか」「デュポンさんは 学生ですか」「学生では ありません。東京大学の 教授です」，不得擅自改成「会社員ですか」或其它未出现在小题 prompt 的职业。

## 强制规则 C：图片题必须 CSS 裁切

1. 带图片的练习题，必须使用 `LessonImageCropCatalog + displayAssets`。
2. 不允许把整张教材页直接作为 `image_grid` 放在大题上来替代裁切图。
3. 只有 `sourcePages` 区域可以展示完整教材页；练习大题内部不能展示完整教材页。
4. 看图练习优先裁切整道大题图片区域，而不是拆到每个小题上。
5. 必须先运行或复用：

```bash
python3 scripts/generate-lesson-image-crops.py course-assets/by-lesson/lesson{N} --lesson-id lesson{N} --format ts --export-name lesson{N}ImageCrops
```

6. 如果自动裁切结果可用，写入 `practice/lesson{N}-image-crops.ts`。
7. 如果自动裁切不准，可以人工调整 crop 坐标，但仍必须写入 `lesson{N}-image-crops.ts`。
8. `PracticeActivity.assets` 必须引用 crop catalog 中的 `ImageAsset`。
9. `PracticeActivity.displayAssets` 必须引用要展示的 crop id。
10. 如果确实无法取得坐标，才允许 `displayAssets` 指向缺失 ID，让页面显示：`暂未正确配置好图片，请联系管理员。`
11. 不允许用整页图“临时代替”裁切图。
12. 自检时必须列出所有图片题：crop id、source page、crop 坐标、是否展示在 activity 层。
13. crop 坐标必须用截图逐项目视校准，尤其检查 y/height 是否垂直偏移。自动脚本只提供初稿，不能把明显上移/下移、截断标题或截掉图片边框的结果直接提交。
14. crop 必须覆盖教材中该题实际需要看的完整区域：题号、图框、标签、价格/楼层等关键信息都不能被裁掉；也不能向上下扩展到相邻大题。
15. preview 中展示 crop 时必须使用 CSS crop-window 或等效裁切渲染，不得在活动内部用完整页图片替代 crop。
16. 如果题目有词框、选项框、地图、表格等视觉辅助，也视为需要展示的素材：能用结构化 `word_bank` 表达就必须在 preview 展示；需要保持教材视觉区域时也要加入 crop catalog。
17. `crop.aspectRatio` 必须按真实像素比例计算，不允许凭感觉填写，也不能简单使用百分比宽高相除。正确公式：

```text
aspectRatio = (crop.widthPercent * sourceImagePixelWidth) / (crop.heightPercent * sourceImagePixelHeight)
```

18. 如果 preview 中图片看起来被横向或纵向拉伸，优先检查 `aspectRatio` 是否与真实像素比例一致；其次检查 crop 框是否过窄、过宽、过高或过低。不能通过随意改 CSS 逃避 crop 数据错误。
19. 人工调整 crop 时必须同时更新 `lesson{N}-image-crops.ts` 和 preview 使用的数据来源，避免 catalog 与 preview 不一致。
20. 对地图、楼层图、表格、价格图这类有明显原始比例的图片，必须在最终自检中目视确认：文字没有变形，方格/楼层/商品图没有被压扁或拉宽。
21. crop 的 x/y/width/height 与 aspectRatio 是一组数据：改变裁切框宽高后必须重新计算 aspectRatio。不得沿用旧 aspectRatio。

## 强制规则 D：录音题必须先转写

对有 `audio: { source: "textbook_exercise" }` 的活动，先运行：

```bash
node scripts/transcribe-textbook-audio.mjs lesson{N} practice_1 {order}
```

或：

```bash
node scripts/transcribe-textbook-audio.mjs lesson{N} practice_2 {order}
```

然后：

1. 将转写结果写入 `activity.audio.transcript.text`。
2. 按小题切分 `transcript.segments`。
3. 根据 transcript、例句、题目提示、图片信息共同推断答案。
4. 听写句子用 `answer.slotValues.answer`。
5. 选择题用 `answer.choiceIds`。
6. 判断题用 `answer.boolean`。
7. 开放问答用 `modelAnswers + acceptableAlternatives + evaluationMode`。
8. ASR 结果尾部漏识别时，不能简单断言“录音不完整”。必须结合音频时长、题目模式、例句、前后小题和 ASR 原文判断：如果录音模式完整且答案可由录音模式和例句确定，可以补全答案，但要在 `confidenceNote` 或 `answer.note` 中说明“ASR 漏字，答案按录音模式和例句补全”。
9. 当前系统的语音输入能力是“一个录音按钮对应一个输入槽位，并转写为一个词、词组、句子或一段对话”，不要假设一个录音按钮可以自然拆分成多个独立空。
10. 因此，如果一个小题需要用户分别填写两个或以上独立空位，就必须在数据结构中建模为多个 `inputSlots`，让每个槽位都能拥有自己的输入与录音入口；不要把多个空合并成一个单一录音输入。
11. 只有当教材原图明确要求用户一次性说出/写出一个完整句子或完整对话时，才建模为单个 `sentence` 或 `dialogue` 输入槽位。
12. 如果练习本质上是“听录音后分别填写两个词”或“两个独立空格”，应优先建模为两个 `word`/`phrase` 槽位，而不是一个大文本框。
13. 录音题的数据建模必须与输入交互保持一致：用户看到几个独立空，就应对应几个可单独输入、单独录音的槽位，避免用户不知道一段录音该填到哪个空。

## 强制规则 E：Kana / Ruby 标准逻辑

### 核心原则

1. 数据层只存 `text + kana`。
2. `ruby` 是渲染层根据 `text + kana` 生成的 HTML 效果，不是数据字段。
3. 不要输出 `ruby` 字段。
4. 不要在数据中写入 `<ruby>`、`<rt>` 或其它 HTML。
5. 不兼容旧 `ruby` 数据。如果旧数据中有 `ruby`，必须改成 `kana`。
6. Answer 不增加 kana。标准答案只保留用于判分的纯文本。

### RichText

日语展示文本需要读音时，在 `RichText` 上写 `kana`：

```ts
{ type: "text", text: "日本人", kana: "にほんじん" }
```

不要写：

```ts
{ type: "text", text: "日本人", ruby: "にほんじん" }
```

只为日语学习文本补充 kana，包括：

- 日语例句
- 日语对话
- 日语题目
- 日语替换词汇
- 日语词框
- 日语地图标签
- 含日语读法的数字、楼层、金额、时间

### PracticeItem.prompt

如果 prompt 是日语学习文本，可以填写 `promptKana`：

```ts
{
  prompt: [{ type: "text", text: "李さんは 中国人です。" }],
  promptKana: "りさんは ちゅうごくじんです。"
}
```

如果 prompt 是中文说明、中文题干、中文翻译、中文注释，不要填写 `promptKana`：

```ts
{
  prompt: [{ type: "text", text: "请听录音，写出你听到的句子。" }]
}
```

不要生成：

```ts
{
  prompt: [{ type: "text", text: "请听录音，写出你听到的句子。" }],
  promptKana: "..."
}
```

### PracticeActivity.title / instruction

`PracticeActivity.title` 与 `PracticeActivity.instruction` 的要求如下：

- `title` 只允许使用教材原图中真实存在的大题标题。
- `instruction` 只允许使用教材原图中真实存在的说明句。
- 如果原图没有副标题或补充说明，不要自行生成。
- 不要为了“让用户更容易理解”改写、缩写、概括或补充标题。

错误示例：

- 原图：`注意听日期中的日期，进行练习。`
- 错误生成：`title: "听日期并写句子"`，`instruction: "注意听录音中的日期，填写完整句子。"`

正确做法：

- `title: "注意听日期中的日期，进行练习。"`
- `instruction: ""`，除非原图另有独立说明文字。

### PracticeItem.inputSlots

`inputSlots` 的数量必须反映用户实际需要填写的独立答案数量。

- 一个独立答案对应一个 slot。
- 两个独立空格对应两个 slot。
- 一个完整句子对应一个 slot。
- 一个完整对话对应一个 slot。

不要因为底层数据书写方便，就把两个答案槽合并成一个 slot。

示例：

如果题目要求分别填写两个词：

```ts
inputSlots: [
  { id: "answer1", expectedUnit: "word", width: "short" },
  { id: "answer2", expectedUnit: "word", width: "short" }
]
```

不要生成：

```ts
inputSlots: [
  { id: "answer", expectedUnit: "sentence", width: "long" }
]
```

因为当前系统的录音输入是按 slot 工作的。合并成一个 slot 会导致页面上只有一个录音入口，用户无法判断两个空该如何填写。

### ExampleBlock

例句是学习规则的核心展示内容，应补充 kana：

- `beforeKana` 对应 `before` 或 `beforeParts` 的读音。
- `afterKana` 对应 `after` 的读音。
- 如果例句是多行对话，优先给每个 `DialogueLine.kana` 补读音。
- `ExampleBlock` 只表达教材原图中的原始例句结构，不表达模型自己补充的解释性说明。
- 如果例句结构里隐含固定主语、固定助词或固定句尾，后续答案推导必须保留这些固定成分。

### DialogueLine

对话行可以填写 `kana`：

```ts
{
  speaker: "甲",
  parts: [{ type: "text", text: "受付は どこですか。" }],
  kana: "うけつけは どこですか。"
}
```

`kana` 只对应台词正文，不包含 `speaker`。

### Answer

不要新增或使用这些字段：

```ts
slotKanaValues?: string[];
modelAnswerKana?: string;
acceptableAlternativeKana?: string[];
answerKana?: string;
```

原因：

- 标准答案用于比较用户输入是否正确，应该保持纯文本。
- 假名、汉字、不同写法属于答案判定策略问题，不通过 Answer kana 解决。
- `admin=1` 自动填充答案时，也应填充纯文本答案，不显示 ruby。

### 数字和专有读法

数字、楼层、金额、时间等如果在日语中有明确读法，应在对应展示文本上补 kana。

示例：

- `7階` -> `ななかい`
- `2,500円` -> `にせんごひゃくえん`
- `4時` -> `よじ`

如果无法可靠判断读音，宁可省略 kana，并在最终报告中说明需要人工补充。

### 校验规则

生成后必须检查：

1. 新数据中没有 `ruby:`。
2. 中文 prompt、中文 instruction、中文 translation 没有 kana。
3. 日语例句、日语对话、日语替换词汇尽量补充 kana。
4. Answer 数据结构不包含 kana。
5. 答案校验逻辑不依赖 kana。

## 音频 URL 规则

- `unit = ceil(N / 4)`
- lesson 路径为 `lesson{N}`
- `practice_1` 对应 `Exe1`
- `practice_2` 对应 `Exe2`
- `order` 对应大题序号

URL 模板：

```text
https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit{unit}/lesson{N}/Exe{exerciseNo}_{order}.mp3
```

示例：

- lesson1 的练习 I · 2：

```text
https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit1/lesson1/Exe1_2.mp3
```

- lesson48 的练习 II · 3：

```text
https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit12/lesson48/Exe2_3.mp3
```

## 执行顺序

1. 读取 `course-assets/by-lesson/lesson{N}/` 下全部 `.webp`。
2. 找出练习页，完整转写练习 I、练习 II 的所有大题、小题和例句。
3. 先制作“练习清单”，列出：
   - section
   - order
   - title
   - instruction 是否原样摘录自原图
   - 原书例句/示范
   - 小题编号
   - 是否图片题
   - 是否录音题
   - 预期 `answerUnit`
   - 预期 `inputSlots` 数量
   - 是否需要 kana
4. 对每个大题检查例句是否已进入数据结构。
5. 对图片题运行 crop 生成脚本，生成 `lesson{N}-image-crops.ts`。
6. 对所有录音大题逐个转写。
7. 根据教材截图、例句、录音 transcript、图片信息生成完整答案。
8. 生成 `practice/lesson{N}-practice-data.ts`。所有题目、例句、图片引用、录音引用、答案、kana 都应在数据文件中表达。
9. 生成 `practice/lesson{N}-practice-preview.html`。该文件只能是薄 HTML 壳，不包含 lesson-specific UI。
10. 更新 `practice/react/entry.jsx`，注册 `lesson{N}Practice`。
11. 运行 `npm run build:practice`，生成 `practice/dist/practice-preview-react.js`。
12. 打开或检查 preview，尤其检查 `?admin=1`。

## 自检清单

生成结束前必须逐项检查：

1. 大题编号连续。
2. 小题编号连续。
3. 每个有例句的大题都保留了例句。
4. 多例句大题正确拆分 `itemGroups`。
5. 除无法转写的纯录音题外，每个 `PracticeItem` 都有 answer。
6. 所有录音题有 transcript 或明确缺失报告。
7. 所有图片题都使用 crop catalog + `displayAssets`。
8. 大题内部没有直接展示完整教材页。
9. `admin=1` 填充字段数量与输入框数量一致。
10. preview 的每个大题都按教材视觉顺序展示：图片/词框/例句/小题作答区的相对顺序不能颠倒。
11. 多例句大题必须按“例句 → 对应小题 → 下一条例句 → 对应小题”的交错顺序展示，不得把多个例句集中展示在所有题目前。
12. preview 的例句行数、说话人标签和词汇提示应与原图排版一致，不得把多行例句压成一行。
13. 所有 crop 都经过目视校准，报告中说明自动识别是否被人工调整。
14. 选择题若使用圆圈编号选项，preview 中没有额外阿拉伯数字编号。
15. 新数据中没有 `ruby:`。
16. 中文 prompt、中文 instruction、中文 translation 没有 kana。
17. 日语例句、日语对话、日语替换词汇尽量补充 kana。
18. Answer 不包含 kana 字段。
19. `admin=1` 自动填充的是纯文本答案。
20. `lesson{N}-practice-preview.html` 只是薄 HTML 壳，没有内联题目 UI。
21. 没有为单个 lesson 新增独立 JS 或 CSS。
22. 没有修改全局 preview 模板；如果修改了，必须在最终报告中说明是为了解决哪个新题型，并确认不会造成旧 lesson 回归。
23. 所有 `title` 与 `instruction` 都逐题对照教材原图，未出现模型自行改写或额外补充。
24. 例句展示中没有出现“例1 使用……”“例1 根据……推断……”这类模型补充说明。
25. 所有需要两个或以上独立答案的小题，都建模成对应数量的 `inputSlots`，不会出现“两个空但只有一个录音输入槽”的数据结构。
26. 所有由例句推导完整句子的题目，标准答案都保留了主语和其它固定句式成分，没有被截短。

## 必须运行的检查

至少运行：

```bash
npm run build:practice
git diff --check
```

如果修改了脚本，额外运行：

```bash
node --check scripts/transcribe-textbook-audio.mjs
```

如果当前数据文件不含 TypeScript 类型语法，也可以运行：

```bash
node --check practice/lesson{N}-practice-data.ts
```

如果 `node --check` 因 `.ts` 模块语法或类型语法不适用而失败，必须说明原因，并以 `npm run build:practice` 作为主要校验。

## 最终汇报必须包含

1. 创建/修改了哪些文件。
2. 每个大题是否保留例句，例句在数据中的位置。
3. 哪些录音已转写，哪些答案来自录音转写。
4. 哪些图片题使用了 crop，列出 crop id 和坐标。
5. 是否存在未能裁切的图片题。
6. 哪些字段补充了 kana，哪些内容因为中文或不确定读音没有补 kana。
7. 是否存在无法确认的题目或答案。
8. 已运行哪些检查，结果是什么。
9. 是否修改了全局 preview 模板、全局样式、全局类型；如果没有，明确说明“仅使用既有模板渲染”。
10. 哪些题目使用了多个 `inputSlots` 来匹配多个独立填写空位。

## 关键防漏策略

1. 先制作“练习清单”，强迫自己在写数据前枚举每个大题的例句，避免漏掉。
2. 图片题禁止整页图替代，必须走 `lesson{N}-image-crops.ts + displayAssets`，整页图只能出现在底部 `sourcePages`。
3. 录音题必须先转写，再生成答案。
4. kana/ruby 只影响展示文本，不影响 Answer。
5. preview 是模板驱动。生成新 lesson 时，不重新生成 UI，只生成数据、crop、薄 HTML 和入口注册。
6. 生成新 lesson 时只使用本 V3 prompt，不要把 V4.1 计划文档当作第二份独立 prompt 让模型自行合并。
