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
