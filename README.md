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

## 部署

推送 `main` 分支自动触发 GitHub Actions 部署流程：

1. 构建 Docker 镜像并推送到 AWS ECR
2. SSH 到服务器，拉取镜像并重启容器

服务端口：`8091`（经反向代理到 `japaflow.groundedglow.cc`）
