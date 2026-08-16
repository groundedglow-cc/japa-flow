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

每条包含日语正文的句子都必须包含：

- `text`: 日语原文
- `kana`: 与 `text` 完整对应的整句假名读音
- `segments`: 用于前端逐词显示读音的切片数组
- `translationZh`: 中文释义

这两个字段不得省略、不得为 `null`、不得以空数组代替。教材图片中有振假名时，优先按图片提取；图片中某处振假名过小或被遮挡时，可以根据完整日语原文补全读音，但必须在 `warnings` 中记录该句 ID 需要复核。

`kana` 必须覆盖整句 `text` 的读音，不只是带汉字的部分。

不要生成 HTML，不要生成 `<ruby>` 或 `<rt>`。

### 汉字假名标音与 `segments`

教材图片中正文汉字上方通常有假名标音。必须为每句生成 `segments`，用于前端渲染 ruby。

`segments` 是正文从左到右的切片数组，所有 `segments[*].text` 拼接后必须与该句 `text` 完全一致。

切片规则：

- 所有含汉字的词或词组都必须独立成一个切片，并写入 `ruby`。优先采用图片标注；图片无法辨认时，使用该句的 `kana` 补全并写入 `warnings`。
- 没有假名标音的假名、标点、空格、助词等也要作为普通切片保留，但不要写 `ruby`。
- `ruby` 必须与该切片中的汉字对应；不能因为图片标注不清就省略该切片的读音。
- 如果一个连续词组的标音覆盖整个词组，可以作为一个切片。例如：`{"text":"携帯電話","ruby":"けいたいでんわ"}`。
- 如果图片中只给单个汉字标音，就只给该汉字切片标音。例如：`{"text":"小","ruby":"ちい"}` + `{"text":"さく なりました。"}`。
- 所有 `segments[*].text` 从左到右拼接后必须与 `text` 完全一致；每个含汉字的切片都必须有非空 `ruby`。

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
11. 提交前逐句自检：每个日语句子都有非空 `kana`；每个日语句子都有 `segments`；`segments` 拼接后严格等于 `text`；所有含汉字的 segment 都有 `ruby`。不满足时不得完成任务。

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
