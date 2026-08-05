# 批量 OCR 任务：lesson17

你需要读取随命令传入的教材图片，按照下面两份规则生成两份 JSON 文件。

## 输出文件

1. 单词 JSON：`/Users/rookie/Documents/personal-projects/japa-flow/data/ocr/lesson17-vocabulary.json`
2. 课文 JSON：`/Users/rookie/Documents/personal-projects/japa-flow/data/ocr/lesson17-text.json`

必须直接写入上述两个文件。不要写 Markdown 代码块，不要把 JSON 输出到终端作为唯一结果。

## 当前课次

lesson17

## 已传入的关键图片

- #1: `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson17/page206.webp`
- #2: `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson17/page211.webp`
- #3: `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson17/page215.webp`

通常 #1 是基本课文，#2 是应用课文，#3 是词汇表。若页面内容和这个推断不一致，以图片内容为准。

## 单词提取规则

# JapaFlow 教材词汇 OCR 提取 Prompt

你要为 JapaFlow 提取指定课次 `lesson{N}` 的词汇数据，并输出结构化 JSON。

用户只会告诉你目标课次，例如：

- 提取第 1 课词汇
- lesson 18
- 第 18 课

## 数据来源规则

1. 先读取 `practise-generete-prompt-v3.md`，学习如何根据课次编号定位教材图片目录。
2. 根据课次编号推导目录：

```text
course-assets/by-lesson/lesson{N}/
```

3. 该目录下通常有多张 `.webp` 图片。
4. 词汇表通常在该课程目录的最后一张图片中。
5. 如果最后一张图片不是词汇表，则继续向前检查相邻图片，直到找到包含词汇列表的页面。
6. 只提取词汇表中的单词数据。忽略页面表头、页脚、页码、栏目标题、补充说明、专栏文字、文化说明等非词汇数据。

## OCR 提取目标

请通过 OCR 或视觉识别读取图片中的词汇内容，并为每个词汇提取以下字段。

### `kana`

日语发音。

规则：

- 图片中完全用假名标注的部分通常是发音。
- 例如：`もり`
- 片假名外来词如果本身就是读音，也作为 `kana`，例如：`スミス`
- 保留长音、促音、小假名、浊音等原始写法。

### `writing`

日语写法。

规则：

- 如果图片中假名后面有括号，括号内通常是日语写法。
- 例如：`もり（森）`：
  - `kana`: `もり`
  - `writing`: `森`
- 如果没有括号，通常认为没有独立写法，此时 `writing` 等于 `kana`。
- 外来词、人名、感叹词等没有单独汉字写法时，`writing` 等于 `kana`。
  - `スミス` -> `writing: "スミス"`
  - `あっ` -> `writing: "あっ"`
- 如果写法中出现 `〜`，需要结合前面的假名补全。
  - `アメリカじん（〜人）`
  - `kana`: `アメリカじん`
  - `writing`: `アメリカ人`
- 不要把中文释义误识别为 `writing`。

### `meaningZh`

中文含义。

规则：

- 提取该词对应的中文释义。
- 保留教材中的主要中文含义。
- 如果有多个中文含义，使用数组。
- 不要加入教材中不存在的解释。

### `partOfSpeech`

词汇类型。

规则：

- 图片中通常用方括号标注词性，例如 `[名]`、`[代]`、`[副]`。
- 提取方括号中的内容，不包含方括号。
- 例如 `[名]` -> `partOfSpeech: "名"`
- 如果没有词性，设为 `null`，不要猜测。

## 输出 JSON 格式

只输出 JSON，不要输出 Markdown 解释。

```json
{
  "lessonId": "lesson{N}",
  "sourceImages": [
    {
      "path": "course-assets/by-lesson/lesson{N}/pageXXX.webp",
      "pageNo": 123
    }
  ],
  "vocabulary": [
    {
      "id": "l{N}-v001",
      "kana": "もり",
      "writing": "森",
      "meaningZh": ["森"],
      "partOfSpeech": "专",
      "rawText": "もり（森）[专] 森",
      "confidence": "high"
    }
  ],
  "warnings": []
}
```

## ID 规则

- `id` 使用稳定递增编号。
- 格式：

```text
l{N}-v001
l{N}-v002
l{N}-v003
```

- 按图片中词汇出现顺序编号。
- 不要因为词性、中文含义或 OCR 修正改变顺序。

## 质量要求

1. 必须完整提取词汇表中的所有单词。
2. 不要提取页面表头、页脚、页码、专栏说明、语法说明。
3. 不确定的词汇也要保留，但 `confidence` 标为 `"low"`。
4. `rawText` 保留 OCR 原始行或人工整理后的原始片段，方便校对。
5. 不要编造图片中不存在的词汇。
6. 如果某个字段无法确认：
   - `kana` 无法确认：该条不要输出，并在 `warnings` 中说明。
   - `writing` 无法确认：使用 `kana`。
   - `meaningZh` 无法确认：使用空数组。
   - `partOfSpeech` 无法确认：使用 `null`。

## 特殊处理规则

### 括号写法

输入示例：

```text
もり（森）[专] 森
```

输出：

```json
{
  "kana": "もり",
  "writing": "森",
  "meaningZh": ["森"],
  "partOfSpeech": "专"
}
```

### 没有括号

输入示例：

```text
スミス [专] 史密斯
```

输出：

```json
{
  "kana": "スミス",
  "writing": "スミス",
  "meaningZh": ["史密斯"],
  "partOfSpeech": "专"
}
```

### `〜` 补全

输入示例：

```text
アメリカじん（〜人）[名] 美国人
```

输出：

```json
{
  "kana": "アメリカじん",
  "writing": "アメリカ人",
  "meaningZh": ["美国人"],
  "partOfSpeech": "名"
}
```

## 最终输出

只输出合法 JSON。

如果发现词汇页不存在，输出：

```json
{
  "lessonId": "lesson{N}",
  "sourceImages": [],
  "vocabulary": [],
  "warnings": [
    "未在 course-assets/by-lesson/lesson{N}/ 中找到词汇页。"
  ]
}
```


## 课文提取规则

# JapaFlow 教材课文 OCR 提取 Prompt

你要为 JapaFlow 提取指定课次 `lesson{N}` 的课文数据，包括“基本课文”和“应用课文”，并输出结构化 JSON。

用户只会告诉你目标课次，例如：

- 提取第 1 课课文
- lesson 18 text
- 第 18 课基本课文和应用课文

## 数据来源规则

1. 先读取 `practise-generete-prompt-v3.md`，学习如何根据课次编号定位教材图片目录。
2. 根据课次编号推导目录：

```text
course-assets/by-lesson/lesson{N}/
```

3. 按图片文件名中的页码升序排列该目录下的 `.webp` 图片。
4. 通常：
   - 第一张图是“基本课文”
   - 第六张图是“应用课文”
5. 如果第一张图或第六张图不是对应课文页，则检查相邻图片，直到找到包含“基本课文”或“应用课文”的页面。
6. 只提取课文区域内容。忽略页眉、页脚、页码、栏目装饰、练习题、单词表、专栏说明等非课文内容。

## 提取范围

必须提取：

1. 课文标题。
2. 基本课文中的所有例句。
3. 基本课文中的所有对话。
4. 应用课文中的所有旁白。
5. 应用课文中的所有对话。
6. 对话者名称，例如 `甲`、`乙`、`李`、`小野`、`森` 等。
7. 每一句课文对应的中文释义。

不要提取：

- 页面顶部课次标题，例如“第 1 课 李さんは 中国人です”，除非它就是课文标题。
- 页脚词汇注释。
- 练习题。
- 语法讲解。
- 专栏文字。
- 图片说明中与课文正文无关的文字。

## 基本课文结构规则

基本课文通常包含两类内容。

### 基本句

通常是若干个编号句子，例如：

```text
1. 李さんは 中国人です。
2. 森さんは 学生では ありません。
```

应提取为 `basicSentences`。

### 对话

通常是几组简短对话，对话人多为 `甲`、`乙`。

应提取为 `dialogues`，并保留每一行的 `speaker`。

示例：

```json
{
  "id": "l1-basic-dialogue-001",
  "label": "A",
  "lines": [
    {
      "speaker": "甲",
      "text": "わたしは 李です。小野さんですか。",
      "translationZh": "我姓李。您是小野女士吗？"
    },
    {
      "speaker": "乙",
      "text": "はい、そうです。小野です。",
      "translationZh": "是的，我是小野。"
    }
  ]
}
```

如果教材中没有显式 `A/B/C/D` 标签，则按出现顺序生成稳定编号。

## 应用课文结构规则

应用课文通常包含：

1. 应用课文标题，例如 `出迎え`。
2. 整体旁白，例如说明人物、地点、背景的句子。
3. 场景旁白，例如某段对话前的情景说明。
4. 多人对话，对话者可能是姓名，例如 `李`、`小野`、`森`。

应按原文出现顺序提取为 `blocks`。

block 类型：

- `narration`: 旁白
- `dialogue`: 对话
- `scene`: 场景说明，如果旁白明显用于引入一段场景

如果无法区分 `scene` 和 `narration`，统一使用 `narration`，不要猜测过度。

## 日语字段规则

每条正文至少包含：

- `text`: 日语原文
- `translationZh`: 中文释义

如果图片中有清晰假名标注，并且可以可靠识别，可额外填写：

- `kana`
- `segments`

如果假名标注无法完整确认，不要强行补全 `kana`，在 `warnings` 中说明。

不要生成 HTML，不要生成 `<ruby>` 或 `<rt>`。

### 汉字假名标音与 `segments`

教材图片中正文汉字上方通常有假名标音。需要尽量通过 OCR/视觉识别提取这些标音，并写入 `segments`，用于前端渲染 ruby。

`segments` 是正文从左到右的切片数组，所有 `segments[*].text` 拼接后必须与该句 `text` 完全一致。

切片规则：

- 有假名标音的汉字或词组独立成一个切片，并写入 `ruby`。
- 没有假名标音的假名、标点、空格、助词等也要作为普通切片保留，但不要写 `ruby`。
- `ruby` 只写图片中对应汉字上方明确标出的假名，不要根据常识、词汇表或整句 `kana` 猜测。
- 如果一个连续词组的标音覆盖整个词组，可以作为一个切片。例如：`{"text":"携帯電話","ruby":"けいたいでんわ"}`。
- 如果图片中只给单个汉字标音，就只给该汉字切片标音。例如：`{"text":"小","ruby":"ちい"}` + `{"text":"さく なりました。"}`。
- 如果标音无法可靠识别，不要写 `ruby`；保留普通 `text` 切片，并在 `warnings` 中说明。

示例：

```json
{
  "text": "携帯電話は とても 小さく なりました。",
  "kana": "けいたいでんわは とても ちいさく なりました。",
  "segments": [
    { "text": "携帯電話", "ruby": "けいたいでんわ" },
    { "text": "は とても " },
    { "text": "小", "ruby": "ちい" },
    { "text": "さく なりました。" }
  ]
}
```

## 中文释义规则

1. 中文释义应忠实表达日语原文意思。
2. 不要加入教材中不存在的扩展解释。
3. 对话中称呼、人称应符合中文自然表达。
4. 如果一句日语包含两个短句，中文也可以合并为一句。
5. 如果无法确认某句含义，仍保留该句，并将 `confidence` 标为 `"low"`。

## 输出 JSON 格式

只输出合法 JSON，不要输出 Markdown 解释。

```json
{
  "lessonId": "lesson{N}",
  "sourceImages": [
    {
      "section": "basic",
      "path": "course-assets/by-lesson/lesson{N}/pageXXX.webp",
      "pageNo": 123
    },
    {
      "section": "application",
      "path": "course-assets/by-lesson/lesson{N}/pageYYY.webp",
      "pageNo": 128
    }
  ],
  "basicText": {
    "title": "基本课文",
    "basicSentences": [
      {
        "id": "l{N}-basic-s001",
        "order": 1,
        "text": "李さんは 中国人です。",
        "kana": "りさんは ちゅうごくじんです。",
        "segments": [
          { "text": "李", "ruby": "り" },
          { "text": "さんは " },
          { "text": "中国人", "ruby": "ちゅうごくじん" },
          { "text": "です。" }
        ],
        "translationZh": "小李是中国人。",
        "confidence": "high",
        "rawText": "李さんは 中国人です。"
      }
    ],
    "dialogues": [
      {
        "id": "l{N}-basic-dialogue-001",
        "label": "A",
        "lines": [
          {
            "id": "l{N}-basic-dialogue-001-line-001",
            "speaker": "甲",
            "text": "李さんは 中国人ですか。",
            "kana": "りさんは ちゅうごくじんですか。",
            "translationZh": "小李是中国人吗？",
            "confidence": "high",
            "rawText": "甲：李さんは 中国人ですか。"
          }
        ]
      }
    ]
  },
  "applicationText": {
    "title": "出迎え",
    "blocks": [
      {
        "id": "l{N}-app-block-001",
        "type": "narration",
        "text": "旁白日语原文",
        "kana": null,
        "translationZh": "旁白中文释义",
        "confidence": "high",
        "rawText": "旁白原始文本"
      },
      {
        "id": "l{N}-app-block-002",
        "type": "dialogue",
        "lines": [
          {
            "id": "l{N}-app-block-002-line-001",
            "speaker": "李",
            "text": "こんにちは。",
            "kana": null,
            "translationZh": "你好。",
            "confidence": "high",
            "rawText": "李：こんにちは。"
          }
        ]
      }
    ]
  },
  "warnings": []
}
```

## ID 规则

### 基本课文

基本句：

```text
l{N}-basic-s001
l{N}-basic-s002
```

基本对话：

```text
l{N}-basic-dialogue-001
l{N}-basic-dialogue-001-line-001
```

### 应用课文

应用课文 block：

```text
l{N}-app-block-001
l{N}-app-block-002
```

应用课文对话行：

```text
l{N}-app-block-002-line-001
```

规则：

1. 所有 ID 按图片中出现顺序递增。
2. 不要因为 OCR 修正、中文翻译或 speaker 名称变化而改变顺序。
3. `speaker` 必须使用教材原文中的说话人名称。
4. 如果某一行没有 speaker，但属于旁白，用 `type: "narration"`。
5. 如果某一行 speaker 不清楚，保留该行，`speaker` 设为 `null`，`confidence` 设为 `"low"`，并加入 `warnings`。

## 质量要求

1. 必须完整提取基本课文和应用课文。
2. 必须保留原文顺序。
3. 必须保留对话者名称。
4. 必须保留旁白。
5. 必须生成中文释义。
6. 不要把课文标题、旁白、对话混在一个大字符串里。
7. 不要把多个 speaker 的对话合并成同一行。
8. 不要提取课文之外的页眉、页脚、练习题、单词表和专栏。
9. 不确定的内容不要编造，标记 `confidence: "low"`。
10. `rawText` 保留 OCR 原始行或人工整理后的原始片段，方便校对。

## 缺失处理

如果未找到基本课文页：

```json
{
  "basicText": null,
  "warnings": ["未找到 lesson{N} 的基本课文页。"]
}
```

如果未找到应用课文页：

```json
{
  "applicationText": null,
  "warnings": ["未找到 lesson{N} 的应用课文页。"]
}
```

如果中文释义无法确认：

```json
{
  "translationZh": "",
  "confidence": "low"
}
```

并在 `warnings` 中说明对应句子 ID。

## 最终输出

最终只输出合法 JSON，不要输出解释文字。


## 额外约束

- 只生成 `lesson17` 的数据。
- 两个 JSON 都必须是合法 JSON。
- 如果无法可靠提取 ruby/segments，可以省略对应字段，并在 warnings 中说明。
- 完成后只用一句话报告两个文件是否已写入和数量统计。
