# JapaFlow 开发须知

## 构建规则

- 生产构建通过 `npm run build:app` 执行，脚本为 `scripts/build-app-dist.mjs`
- 该脚本**不会自动打包所有文件**，只打包 `studentFiles` 数组中显式列出的文件到 `app-dist/`
- **新增任何需要在生产环境运行的静态文件（JS/CSS/HTML），必须将文件名添加到 `scripts/build-app-dist.mjs` 的 `studentFiles` 数组中**，否则 Docker 镜像中不会包含该文件
