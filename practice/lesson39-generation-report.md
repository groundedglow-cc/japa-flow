# 第39课练习生成核验

依据 `practise-generete-prompt-v3.md`；逐页查看 lesson39 的 page162–171，练习来源为 page168–170。未使用其他课程题目或旧 OCR 数据。

## 练习清单与例句位置

全部标题按教材原文录入；原书无独立说明，instruction 均为空。所有日语题面、例句及词框已补 kana，中文标题和翻译题不标音。答案不含 kana 或 ruby 字段。

| 大题 | 小题 | 例句位置 | 作答范围 / 输入槽 | 录音 / 图片 |
| --- | --- | --- | --- | --- |
| I·1 | 1–8 | itemGroups g1、g2：肯定与否定示范 | 词形；每题1槽 | 无 |
| I·2 | 1–12 | itemGroups g1–g3：名词、动词、形容词示范；原书例2中的两个独立示范分别与7–9、10–12题对应 | 完整句；每题1槽 | 无 |
| I·3 | 1–14 | itemGroups g1–g3，分别对应1–4、5–8、9–14 | 完整句；每题1槽 | 无 |
| I·4 | 1–7 | itemGroups g1、g2，分别对应1–4、5–7 | 完整三轮/四轮会话；每题1槽 | Exe1_4 |
| II·1 | 1–8 | layout example | 词形；第4题2槽，其余每题1槽 | 无 |
| II·2 | 1–4 | layout example；word_bank保留a–e完整选项 | 单选 | 选项框结构化展示 |
| II·3 | 1–5 | layout example；标出示范正确项 | 单选 | 无 |
| II·4 | 1–3 | 原书无例句 | 第1题完整问答，其余完整句；每题1槽 | 无 |

共8大题、61小题、53个文本输入槽、9道选择题。例句参考词在 before/beforeKana 中，示范答案在 after 中；正式小题的替换词均在对应 prompt 中。替换画线题的实际替换位置使用 underline 和 substitutionKey。

## 录音

已转写：`https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio/book1-unit10/lesson39/Exe1_4.mp3`。

首次ASR仅覆盖前半段，追加35秒、70秒、108秒起始片段完成全部7小题核对。原始重叠转写保留于 audio.transcript.text；按小题整理的7段会话位于 segments。I·4所有答案均结合实际转写和教材例句确认。ASR「零」按教材识别为「例」，统一标点与汉字写法。无待确认答案。

## 图片与裁切

本课没有插图题。II·2选项框用word_bank完整呈现；无需crop ID或坐标，无未能裁切的图片题。已尝试规定的裁切脚本，但本机Python缺少cv2；因此手工创建空裁切目录，未伪造裁切坐标。完整教材页只在sourcePages中引用。

## 文件与兼容性

- 新增 lesson39-practice-data.ts、lesson39-image-crops.ts、lesson39-practice-preview.html 及本报告。
- 在 react/entry.jsx 中注册 lesson39。
- 已重新构建共享bundle。仓库现有构建脚本输出带哈希文件 practice/dist/practice-preview-react.d357864c7eae.js，并自动更新所有课程HTML的共享资源引用；不另行新增无哈希bundle。
- 本课之前没有练习数据，未改动任何既有课程activity/item/slot/choice ID；本课单输入槽统一answer，II·1第4题使用answer1、answer2。
- 未修改用户答案存储schema，未读取、写入或清空浏览器localStorage。
- 仅使用既有模板渲染；本次未修改全局React模板、CSS、类型、判题代码。工作区原有修改均保留。

## 检查结果与边界

- npm run build:practice：通过。
- git diff --check：通过。
- 使用实际PracticePreview组件逐大题进行React静态渲染检查：61道小题全部出现，分组顺序正确；admin=1下53个输入槽均填入纯文本答案，9道选择题均选中标准答案；输入槽数和渲染字段数一致。
- 检查ID唯一、小题连续、answer完整、responseScope完整、音频segments与7道小题一一对应，以及不存在ruby数据字段：通过。
- 本次验证为实际React组件的静态渲染，未在已登录浏览器中进行交互或像素级目视检查；未执行发布操作。
