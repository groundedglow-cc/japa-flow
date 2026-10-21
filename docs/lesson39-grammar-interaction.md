# 第 39 课语法交互验收

入口：`http://localhost:5173/tools/course-detail-preview.html?lesson=39&part=grammar`

## 实现与数据

1. 通用语法页四张图片各占一行，每行左右各 50%。
2. 本页生词放入右侧，保留折叠及原单词音频播放。
3. `data/ocr/lesson39-grammar-examples.json` 根据 163–166 页图片整理，按语法点分组。163 页 14 句，164 页 16 句，165 页 10 句；166 页只有词表，因此显示说明。第一语法点包含 6 句。反例明确标记为错误用法。数据中的 `漢字[かな]` 渲染为 ruby，播放时移除读音标记以避免重复朗读。
4. 默认播放预生成的在线 MP3（第 39 课当前为 Azure Keita），可通过“例句发音”切换为本机 SpeechSynthesis 对比。点击句子开始，再次点击停止；切换句子或播放生词时停止前一段。缺少在线音频或本机日语语音时显示提示。浏览器提供的非本机语音可能需要联网。

其他课程复用相同加载、布局、ruby 和朗读逻辑；没有例句文件时显示“本页例句尚未整理，待站点维护者批量升级后查看”，不影响图片与生词。

## 已完成的检查

- JavaScript 语法、JSON、补丁空白检查通过。
- 使用 Node VM 与模拟 DOM/语音对象检查四个页面、八个分组、40 个句子、两条错误用法、ruby 输出、生词在右侧、播放/停止与缺少语音的处理。
- 本机 5173 页面 HTTP 200。
- 当前计算机控制权限未开启，尚未进行浏览器目视验收和真实音频试听。模拟语音测试不能证明本机发声质量。

## 用户验收

刷新入口后检查四行及左右比例；展开生词并播放；核对第一组六句与假名；点击例句试听、再次点击停止、连续点击不同句子检查是否重叠。若提示无日语语音，需先在操作系统安装日语语音。

## MiniMax 音频集成（2026-10-09）

- 浏览器方案不需要 API 密钥，适合先验收交互；音色与语音可用性取决于设备。依据：[MDN SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)、[getVoices](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices)。
- MiniMax 同步 TTS 的 `/v1/t2a_v2` 支持 `language_boost: "Japanese"`、可选音色、语速和 MP3 输出。依据：[官方同步 TTS 文档](https://platform.minimax.io/docs/api-reference/speech-t2a-http)，复核于 2026-10-09。
- 已复用项目 `.env` 中的 `MINIMAX_API_KEY`，真实请求验证成功。采用独立构建脚本预生成语音，无需新增浏览器付费生成接口或修改现有登录/额度逻辑。
- 运行 `node scripts/generate-grammar-audio.mjs --lesson=39` 生成全部例句；加 `--limit=1` 可仅合成一条未缓存例句用于验证。支持其他课程相同格式的例句 JSON。
- 默认模型 `speech-2.8-hd`，音色 `Japanese_IntellectualSenior`，语速 0.9；使用既有 `MINIMAX_TTS_MODEL`、`MINIMAX_VOICE_ID`、`MINIMAX_TTS_URL` 环境配置。密钥只读取到生成进程，错误输出不包含密钥或原始响应。
- 按“正文 + 模型 + 音色 + 语速”生成 SHA-256 缓存键，MP3 放在 `audio/grammar/lesson39/`，页面通过 `data/ocr/lesson39-grammar-audio.json` 查找音频。重复执行复用已有文件；重复点击只播放缓存，不调用 MiniMax。
- `audio/` 按项目既有规则被 Git 忽略。当前文件由本机开发服务提供；在其他环境部署时需同时复制音频目录和清单，不能只部署清单。
- 验证命令：`node scripts/test-grammar-audio.mjs`，覆盖快速切句竞态、重复点击停止、音频缺失和播放失败清理。真实接口返回与音频解码用于验证生成文件，实际音色体验仍以用户试听为准。

## Azure 小样本验证（2026-10-09）

使用项目现有 `AZURE_SPEECH_KEY` 与 `AZURE_SPEECH_REGION`，通过 Azure Speech SSML 接口生成了 5 句 × 2 个音色的 MP3：`ja-JP-NanamiNeural` 和 `ja-JP-KeitaNeural`。包括：`李さんは中国人です。`、`李さんが来てくれて、わたしはうれしかったです。`、`眼鏡をかけて本を読みます。`、`道路工事のために、道が込んでいます。`、`李さんは急いで帰っていきました。`。10 个文件均返回成功并通过 MP3 解码检查。

对照试听页：[Azure 日语 TTS 验证](http://localhost:5173/tools/azure-tts-validation.html)。初步 F0 波形分析显示，Keita 的「李さん」升降轮廓比当前 MiniMax 更接近教材原音；Nanami 的音高范围更高、变化更夸张。这是小样本观察，尚不足以替整套课程做质量承诺。

## Azure Keita 生成器（2026-10-09）

第 39 课已切换为 Azure `ja-JP-KeitaNeural`，40 句全部生成并通过 MP3 解码检查。生成命令为 `node scripts/generate-azure-grammar-audio.mjs --lesson=39`；未来课程只要存在对应的 `data/ocr/lessonN-grammar-examples.json`，即可使用同一命令生成。支持 `--voice=ja-JP-NanamiNeural` 和 `--limit=1` 小样本验证；同一正文、音色和输出格式会复用缓存，不重复请求接口。页面根据音频清单的 `provider` 和 `voice` 自动显示在线音频名称，因此更换其他 TTS 提供商时不需要改页面播放逻辑。
