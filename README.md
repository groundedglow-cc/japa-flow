# JapaFlow

标准日本语（初级）交互式学习应用。支持单词记忆、课文朗读、语法学习、练习评测和发音跟读打分。

## 技术栈

- 前端：Vanilla JS SPA
- 后端：Node.js (server.mjs)
- 部署：Docker + nginx + AWS ECR
- 音频：MiniMax TTS 生成 → 阿里云 OSS 存储
- 发音评测：Azure Speech Services

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# → http://localhost:5173
```

## 项目结构

```
├── app.js              # 前端 SPA
├── server.mjs          # 后端 API 服务器
├── styles.css          # 样式
├── index.html          # 入口 HTML
├── data/
│   ├── lessons/        # 课程 JSON 数据
│   ├── catalog.json    # 课程目录（自动生成）
│   └── lesson-drafts/  # 课程草稿
├── audio/              # 音频文件（本地缓存，不提交 git）
├── scripts/
│   ├── oss-utils.mjs           # OSS 工具
│   ├── upload-audio-to-oss.mjs # 音频上传 OSS
│   ├── export-catalog.mjs      # 生成课程目录
│   └── build-app-dist.mjs      # 构建静态包
├── deploy/
│   └── docker-compose.yml      # 生产环境部署配置
├── Dockerfile          # Docker 镜像
├── nginx.conf          # nginx 配置
└── .github/workflows/
    └── deploy.yml      # CI/CD 自动部署
```

## 环境变量

本地开发需创建 `.env` 文件（参考 `.env.example`）：

```env
# Azure Speech Services（发音评测）
AZURE_SPEECH_KEY=your-key
AZURE_SPEECH_REGION=eastasia

# MiniMax TTS（管理端音频生成）
MINIMAX_API_KEY=your-key

# 阿里云 OSS（音频存储，生产环境启用）
OSS_ENABLED=false
OSS_ACCESS_KEY_ID=your-key
OSS_ACCESS_KEY_SECRET=your-secret
OSS_BUCKET=japaflow-audio-bucket
OSS_REGION=oss-cn-shanghai
OSS_BASE_URL=https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com
```

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build:app` | 构建静态分发包到 `app-dist/` |
| `node scripts/export-catalog.mjs` | 重新生成课程目录 |
| `node scripts/upload-audio-to-oss.mjs` | 上传本地音频到 OSS |

## Change Log

### 2026-07-16

- 重整第 3、4、5、6 课 practice 数据，补充 `responseScope`、听力音频元信息、kana、教材原题标题和 answer-only / free-response 等作答范围。
- 优化 practice preview 的多例句分组渲染，支持 `PracticeItemGroup.displayAssets`，让图片、例句和对应小题按教材视觉顺序绑定展示。
- 调整错题答案对比展示，从字符级 diff 改为更直接的“你的答案 / 正确答案”对照，并修正选择题只高亮已选项的批改状态。
- 强化对话录音格式化接口：从例句文本提取 speaker 轮次，按自然可朗读的一轮话合并 ASR 片段，并特别处理 `Aですか？Bですか？Aです。` 这类选择疑问句。
- 更新 `practise-generete-prompt-v3.md` 的生成规范，明确禁止听力题泄露转写文本、禁止自造分组说明，并要求分组图片绑定到对应 item group。

### 2026-07-15

- 重新整理第 1、2 课 practice preview 数据，补充 response scope、例句展示、录音转写、图片裁切与薄 HTML/bundle 入口兼容。
- 增加 practice preview 本地答题 session 保存与恢复，固定使用 `japaflow.practice.session.v1:lesson{N}`，保留已有用户答案并兼容旧记录读取。
- 抽象错题详情组件，在错题卡片右上角新增 `?` popover，复用错误弹窗中的“你的答案 / 正确答案 / 差异对比”展示。
- 增加全局答案词汇表记归一化，支持 `我 / 私 / わたし`、`鍵 / かぎ`、`誰 / だれ` 等等价写法，读取已有 localStorage 答案后会用最新规则重判。
- 修复对话录音格式化：当 ASR 将一句回答拆成多段时，服务端会按例句 speaker 轮次数合并，避免多生成对话轮次。
- 新增 `practice-normalization-prompt.md`，用于后续快速追加全局答案归一化词表。

## 部署

推送 `main` 分支自动触发 GitHub Actions 部署流程：

1. 构建 Docker 镜像并推送到 AWS ECR
2. SSH 到服务器，拉取镜像并重启容器

服务端口：`8091`（经反向代理到 `japaflow.groundedglow.cc`）
