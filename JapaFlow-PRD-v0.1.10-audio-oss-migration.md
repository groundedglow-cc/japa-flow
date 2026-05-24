# JapaFlow PRD v0.1.10 - 音频迁移至 OSS

## 1. 背景

当前项目的音频文件（1547 个 mp3，约 68MB）存储在 `audio/` 目录中，随项目仓库一起管理。虽然 `audio/` 已加入 `.gitignore`，OSS 工具代码（`oss-utils.mjs`、`upload-audio-to-oss.mjs`）也已就绪，但音频仍然在本地文件系统中，生产环境部署时音频的存储和分发存在以下问题：

- 本地音频文件占用部署包体积，每次部署需携带全部音频。
- 新增课程生成音频后，音频仅存在于服务器本地磁盘，多实例部署时无法共享。
- 开发环境和生产环境的音频路径不完全一致，本地依赖文件系统，生产依赖 OSS。

## 2. 现状分析

### 2.1 已有的 OSS 基础设施

| 组件 | 文件 | 状态 |
|------|------|------|
| OSS SDK 封装 | `scripts/oss-utils.mjs` | 已完成，支持上传/URL生成/存在检查 |
| 一次性上传脚本 | `scripts/upload-audio-to-oss.mjs` | 已完成，并发上传、断点续传、dry-run |
| 音频生成集成 | `server.mjs` (L886-888) | 已完成，生成时可选上传到 OSS |
| 条件 URL 生成 | `server.mjs` (L368, L378, L429) | 已完成，`OSS_ENABLED=true` 时返回 OSS URL |
| `.gitignore` | 根目录 | 已包含 `audio/` |
| 环境变量 | `.env` | 需要 `OSS_ENABLED=true` + OSS 凭证 |

### 2.2 当前音频分布

```
audio/
├── lesson1/voices/Japanese_IntellectualSenior/  (words/sentences/exercises)
├── lesson2/voices/...
├── lesson3/voices/...
├── lesson4/voices/...
├── lesson27/voices/...
├── lesson28/voices/...
└── lesson29/voices/...
共 1547 个 .mp3 文件，约 68MB
```

### 2.3 当前音频流

```
请求音频 → server.mjs 查找本地文件
  ├── 存在 → 直接返回本地 mp3
  └── 不存在 → 调用 MiniMax API 合成 → 存本地 → 返回
                            └── OSS_ENABLED? → 同时上传到 OSS
```

客户端（`app.js`）通过 `/api/audio/status` 获取音频 URL 列表，直接播放 URL。

## 3. 目标

1. **所有已生成的音频上传到 OSS**，作为单一事实来源。
2. **生产环境完全从 OSS 提供音频**，不依赖服务器本地文件。
3. **开发环境可选使用 OSS 或本地缓存**，保持开发灵活性。
4. **新课程初始化音频生成后自动上传 OSS**，不再仅存本地。
5. **Git 仓库不再追踪任何音频文件**（`.gitignore` 已生效，需确认无遗漏）。

## 4. 实施计划

### Phase 1: OSS 环境准备

1. 创建/确认阿里云 OSS Bucket（建议：`japaflow-audio`）
   - 区域：与目标用户就近（如 `oss-cn-hangzhou`）
   - 访问权限：公共读（Public Read）
   - 设置 CORS（允许 `GET`，来源 `*` 或限定域名）
2. 配置 CDN 加速（可选但建议）：
   - 绑定自定义域名（如 `audio.japaflow.app`）
   - 配置 HTTPS 证书
   - 更新 `OSS_BASE_URL` 指向 CDN 域名

3. 填充 `.env` 文件：
   ```env
   OSS_ENABLED=true
   OSS_REGION=oss-cn-hangzhou
   OSS_ACCESS_KEY_ID=your-key
   OSS_ACCESS_KEY_SECRET=your-secret
   OSS_BUCKET=japaflow-audio
   OSS_BASE_URL=https://japaflow-audio.oss-cn-hangzhou.aliyuncs.com
   ```

### Phase 2: 上传已有音频

执行一次性全量上传：

```bash
# 预览待上传文件
node scripts/upload-audio-to-oss.mjs --dry-run

# 正式上传
node scripts/upload-audio-to-oss.mjs
```

脚本特性：
- 5 并发上传，自动跳过已存在的文件
- 设置 `Cache-Control: public, max-age=31536000, immutable`（永久缓存）
- 支持断点续传（失败的重新上传即可）

预计耗时：1547 个文件 / 5 并发 ≈ 几分钟（取决于网络和文件大小）。

### Phase 3: 生产环境切换

1. **服务器部署配置**：
   - 生产环境设置 `OSS_ENABLED=true`
   - 配置 OSS 环境变量（通过部署平台的环境变量管理，不依赖 `.env` 文件）

2. **验证音频流**：
   - 访问 `/api/audio/status?lessonId=4`，确认所有 `url` 字段指向 OSS
   - 在课程学习页面播放音频，确认正常加载
   - 检查浏览器 Network 面板，确认音频请求发往 OSS 域名

3. **音频生成验证**：
   - 在初始化页触发音频生成
   - 确认生成后音频自动上传到 OSS
   - 确认返回的 URL 指向 OSS

### Phase 4: 本地开发环境适配

当前 `server.mjs` 在启动时不强制加载 `.env`。本地开发有两种模式：

**模式 A — 使用本地音频缓存（默认）**：
```env
# .env 不设置 OSS_ENABLED 或设为 false
OSS_ENABLED=false
```
- 音频从本地 `audio/` 目录读取
- 新生成的音频同时存本地 + 上传 OSS（如果 OSS_ENABLED=true）

**模式 B — 使用 OSS（与生产一致）**：
```env
OSS_ENABLED=true
# ... OSS 凭证
```
- 音频 URL 全部指向 OSS
- 本地 `audio/` 目录仅作为生成缓存，不用于请求响应

### Phase 5: Git 仓库清理

1. 确认 `audio/` 在 `.gitignore` 中（已确认完成）。
2. 执行 `git rm -r --cached audio/`（如果 audio 仍在 git index 中）：
   ```bash
   # 检查 audio 是否被 git 追踪
   git ls-files audio/ | head
   # 如果还有追踪，从索引中移除
   git rm -r --cached audio/
   ```
3. 提交变更，确保后续 commit 不再包含音频文件。

### Phase 6: CI/CD 调整

- **构建流程**（`npm run build:app`）：无需打包 `audio/` 目录。
  - 当前 `scripts/build-app-dist.mjs` 如果需要排除 audio，确认逻辑。
- **服务端部署**：无需上传音频文件到服务器。
- **音频生成**：应在有 OSS 访问权限的环境中运行（本地或 CI）。

## 5. 风险和注意事项

| 风险 | 应对 |
|------|------|
| OSS 不可用时音频无法播放 | 保留本地缓存逻辑作为 fallback（server.mjs 已有 `existsSync` 检查） |
| OSS 费用 | 预估：1547 文件 × ~5KB ≈ 8MB 存储；播放量取决于用户数，建议设置预算告警 |
| CDN HTTPS 证书过期 | 使用阿里云自动续期或 CDN 提供的免费证书 |
| 大文件上传失败 | 脚本已支持逐个文件重试，失败的重新运行即可 |
| MiniMax 生成的音频未及时上传 | server.mjs 已在 `generateInitAudioJob` 中写入 OSS upload 逻辑 |

## 6. 验收标准

- [ ] 执行 `upload-audio-to-oss.mjs --dry-run` 列出所有待上传文件
- [ ] 执行 `upload-audio-to-oss.mjs` 完成全量上传
- [ ] 生产环境设置 `OSS_ENABLED=true` 后，`/api/audio/status` 返回 OSS URL
- [ ] 课程页播放音频正常，浏览器 Network 面板显示来自 OSS
- [ ] 新初始化一课并生成音频，音频自动出现在 OSS
- [ ] 本地开发环境在 `OSS_ENABLED=false` 时仍可正常使用本地音频
- [ ] `git ls-files audio/` 返回空（audio 目录不被 git 追踪）
- [ ] 服务器部署包不再包含 `audio/` 目录

## 7. 附录: OSS 对象 Key 命名规范

```
audio/lesson{id}/voices/{voiceId}/{type}s/{itemId}.mp3
```

示例：
```
audio/lesson4/voices/Japanese_IntellectualSenior/words/w1.mp3
audio/lesson4/voices/Japanese_IntellectualSenior/sentences/s1.mp3
audio/lesson4/voices/Japanese_IntellectualSenior/exercises/ex-i-1-1-answer.mp3
```
