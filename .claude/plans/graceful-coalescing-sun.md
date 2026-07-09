JapaFlow 学习数据同步修复计划

Context

用户诉求：已登录时优先使用服务端数据展示学习进度，仅在未登录时使用本地存储。

修复范围

1. 学习时长逻辑从 `app.js` 拆到 `study-time.js`，并支持秒级显示刷新。
2. 服务端进度加载时兼容 `grammarPractice`、`wrongBook` 和 `studyTime` 数据。
3. 语法练习的 `extra-*` key 上传时转换为服务端使用的数字 index。
4. 错题列表在服务端返回结构变化或题目不存在时避免渲染崩溃。
5. 练习输入框和语法翻译输入框增加麦克风转写入口。
6. 服务端增加 `/api/speech/transcribe`，复用 Azure Speech 转写日语音频。
7. MiniMax TTS 音高从 `-1` 调整为 `0`。

验证重点

1. 已登录刷新后能加载服务端学习进度。
2. 错题集能正常渲染服务端返回的 wrong-book 数据。
3. 语法练习补充例句能正确同步。
4. 麦克风输入能调用 `/api/speech/transcribe` 并回填输入框。
5. 应用本地启动后首页和第 27 课各模块能正常渲染。
