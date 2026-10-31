# JapaFlow 课文语法例句提取与音频生成流程

为指定课次 `lesson{N}` 提取语法页例句（带 ruby 标音），生成 Azure TTS 音频并写入音频清单，供课程详情页 grammar 分页（`tools/grammar-image-preview.html`）右侧点击播放。

## 产物（每课两个文件）

- `data/ocr/lesson{N}-grammar-examples.json`：例句数据（含 ruby 标音，人工提取/审核）
- `data/ocr/lesson{N}-grammar-audio.json`：音频清单（由脚本生成）

音频文件写入 `audio/grammar/lesson{N}/azure-keita/{sha256}.mp3`（`audio/` 按 `.gitignore` 不入库）。

## 第一步：定位语法页

语法页 = `course-assets/by-lesson/lesson{N}/` 下第 2~5 张图（4 页语法）。

权威映射在 `tools/grammar-image-preview.html` 的 `firstPages` 数组，`lesson{N}` 的 `firstPage = firstPages[N-1]`，语法页为 `firstPage+1` 到 `firstPage+4`：

```js
const firstPages = [
  22, 32, 42, 52, 68, 78, 88, 98, 114, 124, 134, 144,          // lessons 1-12
  160, 170, 180, 190, 206, 216, 226, 236, 252, 262, 272, 282,   // lessons 13-24
  4, 14, 24, 34, 50, 60, 70, 80, 96, 106, 116, 126,            // lessons 25-36
  142, 152, 162, 172, 188, 198, 208, 218, 234, 244, 254, 264    // lessons 37-48
];
```

注意：初级上册（lesson1-24）与下册（lesson25-48）页码各自成册，下册从 page 4 重新开始。

## 第二步：提取例句 → 生成 examples JSON

### 数据来源（按优先级）

1. **直接读图（首选）**：用 Read 逐页读 `course-assets/by-lesson/lesson{N}/page{firstPage+1..firstPage+4}.webp`。
   - 若 Read 返回 `[Unsupported Image]`，先 `sips -s format png`（或 `jpeg`）转格式再读；仍不行则走第 2 条。
2. **OCR + 教材知识重建（回退）**：读 `data/ocr/lesson{N}-grammar-vocabulary-native-ocr-scan.json`（macOS Vision OCR，日文小字会严重乱码），结合标准教材（新版标准日本语）校正乱码并补 ruby。此路径必须在最终汇报中明确标注「未经逐图目视核对」。

### JSON 格式

```json
{
  "schemaVersion": 1,
  "lessonId": "lesson23",
  "reviewStatus": "approved",
  "rubyNotation": "漢字[かな]",
  "pages": {
    "273": {
      "groups": [
        {
          "id": "g1",
          "title": "1. 动たり 动たりします",
          "examples": [
            { "sentences": ["小野[おの]さんは休[やす]みの日[ひ]、散歩[さんぽ]したり買[か]い物[もの]に行[い]ったりします。"] },
            { "sentences": ["吉田[よしだ]さんは日曜日[にちようび]には何[なに]をしますか。", "家[いえ]の掃除[そうじ]をしたり洗濯[せんたく]したりします。"] }
          ]
        }
      ]
    },
    "276": { "groups": [], "emptyMessage": "本页为邮件相关词汇表与和服专栏，无日语例句。" }
  }
}
```

### 规则

- `sentences` 用 ruby 标音 `漢字[かな]`；播放时前端自动剥离 `[かな]`，只读汉字。
- 对话问答对放在**同一个 example** 的 `sentences` 数组里（参考 lesson22/24）。
- 语法点跨页时用 `-cont` 后缀分组（如 `g3-cont`），标题标「（续）」；同一语法点的并列子项用 `-a`/`-b`（参考 lesson24 的 `g3a`/`g3b`）。
- 教材反例（✕）用 `"incorrect": true, "note": "× 教材反例：…"`。
- 单个 example 可加 `note` 说明语境（如「孩子和母亲的对话」）。
- 只有词表/专栏、无例句的页，写 `{ "groups": [], "emptyMessage": "…" }`（参考 lesson39 第 166 页）。
- 汉字假名以教材图为准；不确定的读音宁可不标，不要编造。

## 第三步：生成音频

```bash
# 单课
node scripts/generate-azure-grammar-audio.mjs --lesson=23
# 批量（多课、多 worker、自动重试、可续跑）
node scripts/batch-azure-grammar-audio.mjs --lessons=33-38,40-48
# 先 dry-run 看每课句子数
node scripts/batch-azure-grammar-audio.mjs --lessons=33-38 --dry-run
```

前置：`lesson{N}-grammar-examples.json` 的 `reviewStatus` 必须为 `"approved"`。脚本从 `.env` 读 `AZURE_SPEECH_KEY` / `AZURE_SPEECH_REGION`，按「正文 + 音色 + 输出格式」的 SHA-256 缓存 MP3，写 `lesson{N}-grammar-audio.json`；缓存命中会复用，中断重跑可续。默认音色 `ja-JP-KeitaNeural`。

## 第四步：校验

```bash
# 检查每个音频清单句数、无缺失文件
node -e "const fs=require('fs');for(const n of [23,24]){const m=require('./data/ocr/lesson'+n+'-grammar-audio.json');const miss=Object.values(m.sentences).filter(v=>!fs.existsSync(v.replace(/^\//,''))).length;console.log(n,Object.keys(m.sentences).length,miss)}"
git diff --check
```

确认：`reviewStatus`、音频清单句数与 examples 去重句数一致、无缺失文件、无 `[object Object]`。

## 第五步（生产）上传 OSS

`audio/` 不入库，生产环境需上传音频到 OSS：

```bash
node scripts/upload-audio-to-oss.mjs --dir audio/grammar --dry-run   # 先看会传哪些
node scripts/upload-audio-to-oss.mjs --dir audio/grammar            # 实际上传
```

只提交 examples/audio 清单而不上传音频文件，生产环境无法播放。

## 参考示例

- 已审核完整示例：`data/ocr/lesson22-grammar-examples.json`、`lesson24-grammar-examples.json`、`lesson39-grammar-examples.json`。
- 验收记录：`docs/lesson39-grammar-interaction.md`。
- 播放逻辑与模拟语音测试：`tools/grammar-image-preview.html`、`scripts/test-grammar-audio.mjs`。
