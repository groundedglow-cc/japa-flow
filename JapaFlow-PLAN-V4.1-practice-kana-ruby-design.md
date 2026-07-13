# JapaFlow PLAN V4.1：Practice Kana Ruby 设计与实施计划

## 目标

在练习页面中，为日语汉字、数字等学习者不一定能直接读出的内容补充假名标注，让页面可以渲染为 `<ruby>` 效果。

本计划只处理“练习题展示文本”的假名标注，不改变答案校验逻辑，不把标准答案改造成带假名的富文本。

## 本次确认的设计取舍

1. `RichText` 中保留 `kana`，不再要求生成 `ruby`。
   - `kana` 是数据层字段，表示这段日语文本的读音。
   - `ruby` 是渲染层产物，由组件根据 `text + kana` 自动生成。
   - 后续练习题数据生成时，不应再输出 `ruby` 字段，也不应把 `<ruby>` HTML 写进数据。

2. `PracticeItem.prompt` 如果是中文说明、中文翻译或中文题目，不展示假名。
   - 技术上通过“不填写 `promptKana`”实现。
   - 渲染层只在存在 `kana` / `promptKana` 时尝试渲染 ruby。
   - 练习题生成提示词中必须明确：中文 prompt、中文 instruction、中文 translation 不要补 kana。

3. `Answer` 不实现 kana。
   - 标准答案主要用于判分、管理员核验、自动填充，不承担教学展示文本的职责。
   - 答案中如果混入假名标注，会增加答案比较、开放答案、多可选答案的复杂度。
   - 如果未来需要在“答案解析”里展示假名，应新增展示型 explanation 字段，而不是修改 Answer 本身。

## 当前现状

当前练习数据和组件中已经有一部分 ruby 相关实现：

- `RichText` 类型中存在 `ruby?: string`，但还没有统一的 `kana?: string`。
- React 练习预览组件会读取 `part.ruby` 并渲染 ruby。
- `lesson1-practice-data.ts` 中已有少量 `ruby: "にほんじん"` 这类数据。
- 项目其它位置已有根据 kana 生成 ruby 的工具逻辑，例如 `rubyTextFromKana`、`alignRubyFromKana` 一类函数。

V4.1 的方向是：不兼容旧 `ruby` 数据，直接重新生成或迁移为 `kana`。组件只读取 `kana`，新数据生成规则不允许输出 `ruby`。

## 核心概念

### text

`text` 是用户在页面上看到的原始文本。

示例：

```ts
{ type: "text", text: "日本人" }
```

### kana

`kana` 是 `text` 对应的读音，用于渲染 ruby。

示例：

```ts
{ type: "text", text: "日本人", kana: "にほんじん" }
```

数据中只保存 `kana`，不保存 ruby HTML。组件渲染时可以得到：

```html
<ruby>日本人<rt>にほんじん</rt></ruby>
```

### ruby

`ruby` 不再作为新数据结构中的目标字段。

它只表示浏览器最终看到的 HTML 效果。也就是说，`ruby` 是由组件计算出来的，不是模型生成出来的。

## 数据结构改造

### RichText

建议将 `RichText` 改为：

```ts
export type RichText = {
  type: "text";
  text: string;
  kana?: string;
  underline?: boolean;
  substitutionKey?: string;
};
```

字段含义：

- `text`：展示文本。
- `kana`：可选。仅当 `text` 是日语学习文本，且需要读音辅助时填写。
- `underline`：是否作为替换练习的划线部分。
- `substitutionKey`：替换练习中对应的变量名。

不再推荐：

```ts
ruby?: string;
```

如果历史数据中存在 `ruby`，应重新生成数据或一次性迁移为 `kana`。渲染层不为旧 `ruby` 增加兼容逻辑。

### PracticeItem

`PracticeItem.prompt` 仍然可以由多个 `PromptPart` 组成。如果整段 prompt 是一句日语句子，也可以补充整句读音：

```ts
export type PracticeItem = {
  id: string;
  prompt?: PromptPart[];
  promptKana?: string;
  answer: Answer;
};
```

字段含义：

- `prompt`：题目给用户看的文本。
- `promptKana`：可选。仅当 prompt 是日语学习文本时填写。

如果 prompt 是中文，例如：

```ts
prompt: [{ type: "text", text: "请根据录音填写句子。" }]
```

则不要写：

```ts
promptKana: "..."
```

### ExampleBlock

例句是学习规则的核心展示内容，应支持 kana。

```ts
export type ExampleBlock = {
  id: string;
  label?: string;
  before?: PromptPart[];
  beforeKana?: string;
  after?: PromptPart[];
  afterKana?: string;
};
```

字段含义：

- `before`：例句左侧、替换前或问句部分。
- `beforeKana`：`before` 对应的整句读音。
- `after`：例句右侧、替换后或答句部分。
- `afterKana`：`after` 对应的整句读音。

如果例句使用多人对话，也可以在每一行对话中维护 kana。

### DialogueLine

对话类型练习建议按行维护：

```ts
export type DialogueLine = {
  speaker: string;
  parts: PromptPart[];
  kana?: string;
};
```

字段含义：

- `speaker`：说话人，例如 `甲`、`乙`、`乙1`、`乙2`。
- `parts`：这一行实际说出的文本。
- `kana`：这一行台词正文的读音，不包含 speaker。

示例：

```ts
{
  speaker: "甲",
  parts: [{ type: "text", text: "トイレは どこですか。" }],
  kana: "トイレは どこですか。"
}
```

## Answer 不增加 kana

V4.1 不新增以下字段：

```ts
slotKanaValues?: string[];
modelAnswerKana?: string;
acceptableAlternativeKana?: string[];
answerKana?: string;
```

原因：

- 标准答案用于比较用户输入是否正确，应该尽量保持纯文本。
- 假名、汉字、不同写法本身就是答案判定策略的问题，不应该通过给 Answer 加 ruby 解决。
- 多可选答案、错判反馈、管理员采纳等能力，可以通过扩展“可接受答案数组”处理，而不是让答案承担读音展示职责。

管理员模式 `admin=1` 自动填充答案时，也应填充纯文本答案，不显示 ruby。

## 中文 Prompt 的处理方式

中文 prompt 不需要假名标注。实现上分三层处理。

### 数据生成层

生成练习数据时，如果 prompt 是中文说明、中文翻译、中文题干，不填写 `promptKana`。

示例：

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

### 渲染层

组件不需要复杂判断“这是不是中文”。基本规则是：

- 有 `kana` / `promptKana`：尝试渲染 ruby。
- 没有 `kana` / `promptKana`：按普通文本渲染。

这样中文 prompt 天然不会显示假名。

### 校验层

为了避免模型误生成，可以增加数据校验规则：

- 如果字段名是 `instruction`、`translation`、中文题干类字段，不允许出现 kana。
- 如果文本明显是中文说明，且存在 `promptKana`，给出警告。
- 如果是日语句子、日语例句、日语对话、替换词汇，可以允许 kana。

中日文本都可能包含汉字，所以不要只靠“是否包含汉字”判断语言。更可靠的方式是结合字段语义判断。

## 渲染方案

建议新增一个统一组件，例如 `JapaneseText`：

```tsx
type JapaneseTextProps = {
  text: string;
  kana?: string;
  className?: string;
};
```

渲染逻辑：

1. 如果没有 `kana`，直接渲染 `text`。
2. 如果有 `kana`，调用共享 ruby 工具，将 `text + kana` 转成 ruby 片段。
3. 如果 kana 对齐失败，回退为普通 `text`，避免页面崩溃或显示错误 ruby。

共享工具可以从现有实现中提取，例如：

```ts
rubyTextFromKana(text, kana)
alignRubyFromKana(text, kana)
```

React 页面中的 `PromptPart`、`ExampleBlock`、`DialogueLine` 都应该通过这个统一组件渲染。

当前组件中直接读取 `part.ruby` 的逻辑应迁移为读取 `part.kana`。

## 练习题生成提示词新增规则

后续让模型生成 lesson 数据时，应加入以下强规则：

```text
假名标注规则：
1. 只为日语学习文本补充 kana，包括日语例句、日语对话、日语题目、日语替换词汇。
2. 不要为中文说明、中文题干、中文翻译、中文注释补充 kana。
3. 不要输出 ruby 字段。
4. 不要在数据中写入 <ruby>、<rt> 或其它 HTML。
5. 如果某段日语文本需要读音，使用 kana 字段保存完整读音。
6. RichText 片段使用 kana；整句 prompt 使用 promptKana；例句使用 beforeKana / afterKana；对话行使用 DialogueLine.kana。
7. Answer 不要增加 kana。标准答案只保留用于判分的纯文本。
8. 数字、楼层、金额、时间等如果在日语中有明确读法，应在对应展示文本上补 kana。例如 7階 -> ななかい，2,500円 -> にせんごひゃくえん。
9. 如果无法可靠判断读音，宁可省略 kana，并在生成报告中说明需要人工补充。
```

## 实施步骤

### 阶段 1：提取 ruby 工具

- 从现有实现中提取 `rubyTextFromKana` / `alignRubyFromKana` 到共享模块。
- 确保 React 练习页面和其它页面可以复用同一套逻辑。
- 对对齐失败增加安全回退。

### 阶段 2：更新类型

- 给 `RichText` 增加 `kana?: string`。
- 给 `PracticeItem` 增加 `promptKana?: string`。
- 给例句结构增加 `beforeKana?: string`、`afterKana?: string`。
- 给 `DialogueLine` 增加 `kana?: string`。
- 从类型中移除 `ruby?: string`，渲染层不读取 `part.ruby`。

### 阶段 3：更新渲染组件

- 新增 `JapaneseText`。
- `PromptPart` 渲染改为使用 `text + kana`。
- 整句 prompt 如果有 `promptKana`，按整句 ruby 渲染。
- 例句和对话行接入 kana。
- Answer 展示和答案校验逻辑保持不变。

### 阶段 4：迁移 lesson1 数据

- 将已有 `ruby: "にほんじん"` 迁移为 `kana: "にほんじん"`。
- 检查 lesson1 中所有日语例句、对话、替换词汇、题目展示文本，补充必要 kana。
- 中文 prompt 不补 kana。
- Answer 不补 kana。

### 阶段 5：更新生成提示词

- 将本计划中的“练习题生成提示词新增规则”加入 lesson 数据生成提示词。
- 明确要求模型不要输出 `ruby`。
- 明确要求中文 prompt 不输出 kana。
- 明确要求 Answer 不输出 kana。

### 阶段 6：验证

- 构建练习页面。
- 打开 lesson1 practice preview。
- 检查日语汉字、数字是否显示 ruby。
- 检查中文说明是否没有假名。
- 检查 `admin=1` 自动填充答案仍然是纯文本。
- 检查答案判定逻辑没有因为 kana 改造发生变化。

## 验收标准

- 新生成的练习数据中不再出现 `ruby:`。
- 中文 prompt、中文 instruction、中文 translation 不出现 kana。
- 日语例句、日语对话、日语替换词汇可以通过 kana 渲染 ruby。
- Answer 数据结构不包含 kana。
- `admin=1` 自动填充仍可正常工作。
- 答案校验逻辑不读取 kana。
- 练习页面构建通过。

## 风险与边界

1. kana 对齐可能失败。
   - 处理方式：渲染层回退为普通文本，不阻塞页面。

2. 中文和日语都可能包含汉字。
   - 处理方式：不要只靠字符集判断，优先根据字段语义判断是否需要 kana。

3. 人名、地名、专有名词可能有多种读法。
   - 处理方式：模型不确定时省略 kana，并在生成报告中标记人工补充。

4. 答案存在汉字/假名不同写法。
   - 这属于答案判定策略问题，不在 V4.1 的 kana/ruby 展示改造中处理。

## 结论

V4.1 采用最小可维护方案：

- 数据层只存 `text + kana`。
- 渲染层负责生成 ruby。
- 中文 prompt 不写 kana。
- Answer 不写 kana。
- 练习题生成提示词禁止输出 `ruby` 和 ruby HTML。

这样既能实现练习页的假名标注，又不会把展示逻辑、答案判定和模型生成格式混在一起。
