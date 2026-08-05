# 当前未提交内容的必要性说明

这份说明只针对当前 `git status` 里出现的未提交内容，按“功能链路”和“是否可删除”来分。

## 1. 调用链路

### 1.1 生成单词 / 课文 OCR 数据

1. 提示词来源：
   - [docs/vocabulary-ocr-extraction-prompt.md](/Users/rookie/Documents/personal-projects/japa-flow/docs/vocabulary-ocr-extraction-prompt.md)
   - [docs/text-ocr-extraction-prompt.md](/Users/rookie/Documents/personal-projects/japa-flow/docs/text-ocr-extraction-prompt.md)
2. 批量生成脚本读取提示词并拼出每课任务：
   - [scripts/batch-generate-ocr-with-codex.mjs](/Users/rookie/Documents/personal-projects/japa-flow/scripts/batch-generate-ocr-with-codex.mjs)
3. 脚本根据 `course-assets/by-lesson/lesson{N}/` 下的图片生成任务文件：
   - `data/ocr-tasks/lesson{N}-ocr-task.md`
4. Codex 读取任务文件，把结果写入：
   - `data/ocr/lesson{N}-vocabulary.json`
   - `data/ocr/lesson{N}-text.json`

这条链里，提示词和脚本是源头，`data/ocr-tasks/*` 是中间任务文档，`data/ocr/*.json` 是生成结果。

### 1.2 生成可用的音频匹配数据

1. 服务端工具接口：
   - `server.mjs` 的 `/api/ocr/audio-align`
2. 服务端调用的脚本：
   - `scripts/generate-ocr-audio-segments.mjs`
   - `scripts/align-ocr-vocabulary-audio.mjs`
3. 课文音频单独链路：
   - `server.mjs` 里的 `runOcrTextAudioAlignment`
   - `server.mjs` 里的 `runOcrTextAudioPublish`
   - 对应脚本：
     - `scripts/align-ocr-text-audio.mjs`
     - `scripts/publish-ocr-text-audio-alignment.mjs`
4. 页面消费：
   - `app.js` 会直接加载 `/data/ocr/lesson{N}-vocabulary-audio.json`
   - 工具页 `tools/vocabulary-import-preview.html`、`tools/text-import-preview.html` 会通过 `/api/ocr/sample-lessons` 和 `/api/ocr/audio-align` 触发生成/预览

### 1.3 练习页相关

1. 练习页主入口：
   - `practice/react/entry.jsx`
   - `practice/react/PracticePreview.jsx`
   - `practice/react/practiceSessionApi.js`
2. 运行时会读取：
   - [data/practice-answer-alternatives.json](/Users/rookie/Documents/personal-projects/japa-flow/data/practice-answer-alternatives.json)
3. 构建产物：
   - [practice/dist/practice-preview-react.js](/Users/rookie/Documents/personal-projects/japa-flow/practice/dist/practice-preview-react.js)

## 2. 建议保留的内容

这些文件不是临时调试垃圾，删了会直接断功能，或者删除后恢复成本高。

- [app.js](/Users/rookie/Documents/personal-projects/japa-flow/app.js)
- [server.mjs](/Users/rookie/Documents/personal-projects/japa-flow/server.mjs)
- [package.json](/Users/rookie/Documents/personal-projects/japa-flow/package.json)
- [package-lock.json](/Users/rookie/Documents/personal-projects/japa-flow/package-lock.json)
- [docs/vocabulary-ocr-extraction-prompt.md](/Users/rookie/Documents/personal-projects/japa-flow/docs/vocabulary-ocr-extraction-prompt.md)
- [docs/text-ocr-extraction-prompt.md](/Users/rookie/Documents/personal-projects/japa-flow/docs/text-ocr-extraction-prompt.md)
- [scripts/batch-generate-ocr-with-codex.mjs](/Users/rookie/Documents/personal-projects/japa-flow/scripts/batch-generate-ocr-with-codex.mjs)
- [scripts/generate-ocr-audio-segments.mjs](/Users/rookie/Documents/personal-projects/japa-flow/scripts/generate-ocr-audio-segments.mjs)
- [scripts/align-ocr-vocabulary-audio.mjs](/Users/rookie/Documents/personal-projects/japa-flow/scripts/align-ocr-vocabulary-audio.mjs)
- [scripts/align-ocr-text-audio.mjs](/Users/rookie/Documents/personal-projects/japa-flow/scripts/align-ocr-text-audio.mjs)
- [scripts/publish-ocr-text-audio-alignment.mjs](/Users/rookie/Documents/personal-projects/japa-flow/scripts/publish-ocr-text-audio-alignment.mjs)
- [scripts/auto-align-ocr-vocabulary-audio.mjs](/Users/rookie/Documents/personal-projects/japa-flow/scripts/auto-align-ocr-vocabulary-audio.mjs)
- [scripts/auto-publish-ocr-text-audio.mjs](/Users/rookie/Documents/personal-projects/japa-flow/scripts/auto-publish-ocr-text-audio.mjs)
- [practice/lesson-practice-types.ts](/Users/rookie/Documents/personal-projects/japa-flow/practice/lesson-practice-types.ts)
- [practice/lesson1-practice-preview.css](/Users/rookie/Documents/personal-projects/japa-flow/practice/lesson1-practice-preview.css)
- [practice/practice-answer-format.js](/Users/rookie/Documents/personal-projects/japa-flow/practice/practice-answer-format.js)
- [practice/react/PracticePreview.jsx](/Users/rookie/Documents/personal-projects/japa-flow/practice/react/PracticePreview.jsx)
- [practice/react/practiceSessionApi.js](/Users/rookie/Documents/personal-projects/japa-flow/practice/react/practiceSessionApi.js)
- [tools/course-detail-preview.html](/Users/rookie/Documents/personal-projects/japa-flow/tools/course-detail-preview.html)
- [tools/grammar-image-preview.html](/Users/rookie/Documents/personal-projects/japa-flow/tools/grammar-image-preview.html)
- [tools/text-audio-alignment-review.html](/Users/rookie/Documents/personal-projects/japa-flow/tools/text-audio-alignment-review.html)
- [tools/text-import-preview.html](/Users/rookie/Documents/personal-projects/japa-flow/tools/text-import-preview.html)
- [tools/vocabulary-import-preview.html](/Users/rookie/Documents/personal-projects/japa-flow/tools/vocabulary-import-preview.html)
- [data/practice-answer-alternatives.json](/Users/rookie/Documents/personal-projects/japa-flow/data/practice-answer-alternatives.json)

## 3. 确切可以删掉的东西

这部分是纯中间产物、缓存、日志或可重建构建结果，删了不会破坏源码本身。

### 可以直接删

- [.DS_Store](/Users/rookie/Documents/personal-projects/japa-flow/.DS_Store)
- `data/ocr/audio-cache/`
  - ffmpeg 处理用的临时缓存音频。
  - 可由音频切片脚本重新下载/重新转码。
- `data/ocr/audio-clips/`
  - 课文音频切片输出。
  - 可由发布脚本重新生成。
- `data/ocr/audio-align-logs/`
  - 词汇音频切片日志。
  - 纯调试信息，删了不影响功能。
- `data/ocr-tasks/`
  - 每课 OCR 任务文档。
  - 这是批量提取时的工作记录，不是运行时依赖。

### 可删但前提是你接受重新生成

- `data/ocr/lesson{N}-vocabulary.json`
- `data/ocr/lesson{N}-text.json`
- `data/ocr/lesson{N}-vocabulary-audio.json`
- `data/ocr/lesson{N}-text-audio.json`
- `data/ocr/lesson{N}-vocabulary-audio-verified.json`
- `data/ocr/lesson{N}-text-audio-verified.json`

这些文件是实际生成结果，不是源代码。它们会被 `app.js`、工具页和音频预览页直接读取，所以不能“边跑边删”而不影响当前功能，但如果你愿意重新跑整条生成链，它们都能重建。

### 可删但前提是你接受重新构建

- [practice/dist/practice-preview-react.js](/Users/rookie/Documents/personal-projects/japa-flow/practice/dist/practice-preview-react.js)

它是前端构建产物，可由 `npm run build:practice` 或 `npm run build:app` 重建。

## 4. 你当前最该优先保留的两个数据文件

- [data/practice-answer-alternatives.json](/Users/rookie/Documents/personal-projects/japa-flow/data/practice-answer-alternatives.json)
  - `server.mjs` 明确读取它，属于当前运行时依赖。
- `data/ocr/lesson{N}-vocabulary.json` 和 `data/ocr/lesson{N}-text.json`
  - 它们是 OCR 提取结果的主数据源，后面的音频切片和预览页面都基于它们。

## 5. 简短结论

如果你的目标是清理 `git` 未提交区域，优先删：

1. `.DS_Store`
2. `data/ocr/audio-cache/`
3. `data/ocr/audio-clips/`
4. `data/ocr/audio-align-logs/`
5. `data/ocr-tasks/`
6. `practice/dist/practice-preview-react.js`（前提是能重新构建）

如果你想保留当前这套预览和播放链路，则不要删：

1. `docs/*`
2. `scripts/*`
3. `app.js`
4. `server.mjs`
5. `data/practice-answer-alternatives.json`
6. `data/ocr/lesson{N}-vocabulary.json`
7. `data/ocr/lesson{N}-text.json`
8. `data/ocr/lesson{N}-vocabulary-audio.json`
9. `data/ocr/lesson{N}-text-audio.json`
