## 课程音频与 Ruby 数据

当用户要求更新某课（`N`）的课程音频或 Ruby 数据时，按需执行以下命令：

- 单词音频：`npm run align:ocr-vocabulary-audio -- --lesson N --auto-approve`
- 课文音频：`npm run align:ocr-text-audio -- --lesson N --auto-approve`
- 课文汉字 Ruby 标记：`npm run backfill:ocr-text-ruby -- --lesson N`

将 `N` 替换为用户指定的课次；若用户未明确数据类型，先根据其请求判断需要执行的相关命令。
