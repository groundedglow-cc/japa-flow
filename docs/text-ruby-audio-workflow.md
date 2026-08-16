# 课文 Ruby 与音频标记操作流程

## 适用范围

本流程处理课文的三类数据：

- `kana`：整句假名读音。
- `segments/ruby`：页面显示在汉字上方的切片标音。
- `audioSegment`：课文音频的起止时间与核验状态。

## 新课标准流程

1. 生成原始 OCR 数据。

   ```bash
   node scripts/batch-generate-ocr-with-codex.mjs --from N --to N
   ```

   当前完整 OCR 流程会校验日文句子的 `kana`、`segments` 与汉字 `ruby`。

2. 如需补齐旧数据或 OCR 遗漏的标音，运行 ruby 回填。

3. 生成单词和课文音频标记。

   ```bash
   npm run align:ocr-vocabulary-audio -- --lesson N --auto-approve
   npm run align:ocr-text-audio -- --lesson N --auto-approve
   ```

   课文音频脚本会从最新的 `lesson{N}-text.json` 生成完整的 `lesson{N}-text-audio-verified.json`，其中自动包含 kana 与 ruby。

4. 在预览页人工试听、调整并保存待核对项。

   保存后的 verified 文件是最终音频数据。

## Ruby 回填命令

先用 `--dry-run` 查看会修改多少句，再执行正式命令。

### 单课

```bash
npm run backfill:ocr-text-ruby -- --lesson 7 --dry-run
npm run backfill:ocr-text-ruby -- --lesson 7
```

### 指定课次

适合不连续的课次。

```bash
npm run backfill:ocr-text-ruby -- --lessons 3,4,5,6,26 --dry-run
npm run backfill:ocr-text-ruby -- --lessons 3,4,5,6,26
```

### 连续范围

适合一批连续课程。

```bash
npm run backfill:ocr-text-ruby -- --from 7 --to 12 --dry-run
npm run backfill:ocr-text-ruby -- --from 7 --to 12
```

回填只发送缺少或不完整的课文句子给模型，不读取教材图片、不重跑词汇、不改正文、翻译、ID 或顺序。它会先校验模型生成的补丁，再写入 `lesson{N}-text.json`。

## 历史 verified 数据

如果某课已经完成了人工音频校准，之后才补 ruby，不能重新运行：

```bash
npm run align:ocr-text-audio -- --lesson N --auto-approve --reuse-existing-asr
```

该命令会按旧 ASR 重新构建音频片段，可能覆盖人工调整过的时间与核验状态。

这类历史数据需要使用“只同步 kana/ruby 到 verified 文件、保留 audioSegment 与 review”的专用同步工具；在该工具添加前，不要对人工确认完成的课次运行音频对齐命令。
