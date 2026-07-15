# Practice Answer Normalization Prompt

目标：维护 JapaFlow 练习判分的全局答案归一化词表，减少日语表记差异导致的错判。

## 适用场景

用户会给出若干组等价写法，例如：

- `私 / わたし / 我`
- `鍵 / かぎ`
- `誰 / だれ`
- `JC企画 / ＪＣ企画 / ジェーシー企画`

你需要把这些写法加入全局判分归一化，让所有 lesson 共用。

## 修改位置

默认只修改：

- `practice/react/PracticePreview.jsx` 中的 `answerLexicalVariantGroups`
- 运行 `npm run build:practice` 后生成的 `practice/dist/practice-preview-react.js`

不要修改 lesson 数据文件，除非用户明确要求。
不要修改 localStorage 存储 key、schema 或用户答案记录。

## 添加规则

1. 每一组等价词加入 `answerLexicalVariantGroups`。
2. 每组第一个值是 canonical form。
3. canonical form 选择原则：
   - 优先使用教材标准答案中常见写法。
   - 如果教材标准答案是假名，canonical 优先用假名。
   - 如果教材标准答案是汉字，canonical 优先用汉字。
   - 专有名词优先使用教材中的正式写法。
4. 同一组必须包含用户提供的所有等价写法。
5. 不要把语义不同的词合并。
6. 不要把读音相同但意义不同的词随意合并。
7. 只合并可确定等价的表记差异，例如假名/汉字/全角半角/教材专有名词写法。
8. 如果用户给出的词组有歧义，先停止并报告风险，不要擅自加入。

## 判分范围

`answerLexicalVariantGroups` 接入 `normalizeAnswerText`，因此会同时作用于：

- 用户输入答案
- 标准答案
- `modelAnswers`
- `acceptableAlternatives`
- 错误 popover / 错误弹窗里的差异对比
- 读取已有 localStorage 答案后的重新判分

这应当对所有使用 `PracticePreview.jsx` 的 lesson 生效。

## 必须检查

修改后至少运行：

```bash
npm run build:practice
git diff --check
```

再用一个只读脚本抽样验证新增词组归一化后相等。例如：

```bash
node -e '/* read PracticePreview.jsx, evaluate answerLexicalVariantGroups, compare sample pairs */'
```

不要通过清空 localStorage 来验证。

## 最终报告

最终回复必须包含：

1. 新增了哪些归一化词组。
2. 是否影响所有 lesson。
3. 是否修改了 localStorage schema。
4. 是否重新构建了 `practice/dist/practice-preview-react.js`。
5. 已运行哪些检查，结果是什么。

