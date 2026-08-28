# 2026-08-29 三仓库发布计划

本次发布涉及：

| 仓库 | 当前分支与 main 的关系 | 本次职责 | 数据库变更 |
| --- | --- | --- | --- |
| `japa-flow` | `dev` 比 `main` 多 13 个提交，另有 5 个未提交文件 | 学习前端、课程内容、OCR、练习界面 | 无 |
| `light-blog` | `dev` 比 `main` 多 1 个提交，另有已修改和未跟踪文件 | JapaFlow 练习 API、邮件验证码、AI 配额 | 有，必须执行 |
| `grounded-glow` | 在 `main`，有 7 个未提交文件 | 登录/注册界面及转发 `/api/*` | 无 |

> 发布前不要使用 `git add -A`。三个工作区都有未提交内容，应按本计划分批暂存、测试、提交，避免把未验证的首页进度改动一起发出。

## 0. 发布前的必做确认

1. 在三个仓库分别保存当前状态，确认没有他人的未提交改动。

   ```bash
   git status --short
   git diff --check
   ```

2. 修正 AI 配额的时区后再发布。后端 SQL 注释要求按 `Asia/Tokyo` 自然日，但 `JfAiQuotaController` 当前实际使用 `Asia/Shanghai`。两地夏令无差异但时区恒差一小时，跨日额度会在错误时间重置。

3. `japa-flow` 未提交的首页学习进度改动尚未完成浏览器端验收。此次若以稳定发布为目标，先不要提交以下文件；它们应单独修复和验收后再发：

   ```text
   app.js
   styles.css
   practice/react/PracticePreview.jsx
   practice/dist/practice-preview-react.js
   ```

4. 确定生产 API 的内部访问地址（下文以 `<BACKEND_INTERNAL_URL>` 表示），例如同一 Docker 网络可为 `http://light-blog:8081`，宿主机网络则可能为 `http://172.17.0.1:8081`。不要填写浏览器对外域名，也不要使用开发机默认的 `http://localhost:8081`，除非 Next.js 容器与后端确实在同一网络命名空间。

## 1. 先准备数据库变更

所有 SQL 均在 `light-blog` 仓库。先对生产库备份，再在维护窗口执行。以下操作应由有生产数据库权限的人执行。

### 1.1 备份与连接验证

```bash
# 在服务器上，按实际容器名、数据库名和凭据替换
docker exec <MYSQL_CONTAINER> mysql -u <DB_USER> -p -e 'SELECT NOW();' <DB_NAME>

# 建议先生成备份；不要将密码写进 shell 历史或仓库
docker exec <MYSQL_CONTAINER> mysqldump -u <DB_USER> -p <DB_NAME> > techblog-before-20260829.sql
```

### 1.2 执行三组变更

1. 从 `src/main/resources/db/jf_schema_init.sql` 提取并执行 4 个新增表的 `CREATE TABLE IF NOT EXISTS`：
   `jf_practice_set`、`jf_practice_session`、`jf_practice_activity_attempt`、`jf_practice_item_attempt`。
2. 执行 `jf_schema_patch_20260719_exercise_result_columns.sql`，为旧的 `jf_exercise_result` 安全补充字段。
3. 执行 `jf_schema_patch_20260816_ai_daily_quota.sql`，创建 `jf_ai_usage_daily`、`jf_ai_usage_event`、`jf_ai_quota_override`。

这些 SQL 使用 `IF NOT EXISTS` / 条件列检查，可重复执行；仍应先在预发布或备份后的生产库执行。

```bash
# 示例：SQL 已上传到服务器 /tmp/release-sql/ 后执行
docker exec -i <MYSQL_CONTAINER> mysql -u <DB_USER> -p <DB_NAME> \
  < /tmp/release-sql/jf_practice_tables.sql
docker exec -i <MYSQL_CONTAINER> mysql -u <DB_USER> -p <DB_NAME> \
  < /tmp/release-sql/jf_schema_patch_20260719_exercise_result_columns.sql
docker exec -i <MYSQL_CONTAINER> mysql -u <DB_USER> -p <DB_NAME> \
  < /tmp/release-sql/jf_schema_patch_20260816_ai_daily_quota.sql
```

### 1.3 验证

```sql
SHOW TABLES LIKE 'jf_practice_%';
SHOW TABLES LIKE 'jf_ai_%';
DESCRIBE jf_exercise_result;
```

出现错误时停止后续发布，恢复备份或根据错误修正 SQL；不要继续发布依赖这些表的后端。

## 2. 发布 light-blog（后端）

### 2.1 将改动拆成可审查的提交

建议至少拆分为三组：

1. 已提交的 JapaFlow versioned practice API（当前 `dev` 的 `d851f45`）。
2. AI 每日配额：`JfAiQuotaController`、配额 SQL、相关配置；先完成 Asia/Tokyo 修正。
3. 邮箱验证码注册：`RegistrationVerificationService`、DTO、`UserController`、`pom.xml`、Redis/Mail 配置。

注册验证码不需要新表，但生产必须具备 Redis 和 SMTP，并启用 profile：

```text
SPRING_PROFILES_ACTIVE=docker,email-verification
SPRING_MAIL_HOST=...
SPRING_MAIL_PORT=...
SPRING_MAIL_USERNAME=...
SPRING_MAIL_PASSWORD=...
MAIL_FROM=...
REGISTER_CODE_SECRET=<高强度随机密钥>
```

不要将上述密码或密钥提交进 `.env`、Git 或部署计划。应通过服务器 secret、CI secret 或受权限保护的环境文件注入。

### 2.2 测试、合并、发布

```bash
cd ~/Documents/personal-projects/light-blog
./mvnw test
git status --short
git diff --check
# 审查并按上面的三组 git add / git commit
git push origin dev
# 经 PR 或既有发布流程合并到 main，再推送 main 触发部署
```

### 2.3 发布后验证

1. 已登录请求 `GET /api/japaflow/lessons/1/practice/session`，确认返回当前 versioned practice 的 `activityProgress` 与 `session`。
2. 请求 AI 配额接口，确认返回 `timezone: "Asia/Tokyo"`，且日期/重置时间正确。
3. 发送一次注册码并完成一次注册；确认 Redis 有短期验证码、邮件可达、验证码不能复用。

## 3. 发布 japa-flow（学习前端）

先只选择已经验收的提交。`dev` 比 `main` 多 13 个提交，其中包括课程内容、OCR 数据、练习预览、语音录制与 AI 配额交互；改动量很大，应先在测试环境完成构建和关键路径验证。

```bash
cd ~/Documents/personal-projects/japa-flow
npm run build:practice
node --check app.js
git diff --check
git log --oneline main..dev
```

发布后检查：

1. 课程进入和练习加载正常。
2. Lesson 1 的新练习会话接口可读写，完成 12 个 activity 后返回 completed。
3. 语音录制、OCR 课程内容、AI 额度提示正常。

若首页进度尚未验收，保留本地未提交改动，不随本次上线。

## 4. 发布 grounded-glow（主应用）

### 4.1 `/api/*` rewrite 的含义与必要配置

这条未提交改动首次在 `next.config.ts` 增加：

```ts
source: '/api/:path*'
destination: `${API_PROXY_TARGET}/api/:path*`
```

它让浏览器始终请求 grounded-glow 自己的 `/api/...`，由 Next.js 服务端转发到 Java 后端。好处是前端不必暴露后端地址，并避免跨域/CORS 问题。此前生产环境没有此变量；前端生产环境中 `NEXT_PUBLIC_API_BASE_URL` 默认是空字符串，因此请求会直接打到当前域名，但没有 Next rewrite 时该路径没有后端可接收。

**关键点：** `next.config.ts` 在 `next build` 时读取该变量。当前 Dockerfile 仅声明了 `NEXT_PUBLIC_API_BASE_URL`，没有将 `API_PROXY_TARGET` 传入 builder。因此，部署后才在容器运行环境的 `.env` 写 `API_PROXY_TARGET`，通常不会改变已构建镜像中的 rewrite 目标。

在 `grounded-glow/Dockerfile` 的 builder 阶段补充：

```dockerfile
ARG API_PROXY_TARGET
ENV API_PROXY_TARGET=$API_PROXY_TARGET
```

在 CI 构建镜像时从 secret/变量注入：

```bash
docker build \
  --build-arg API_PROXY_TARGET=<BACKEND_INTERNAL_URL> \
  -t grounded-glow:<release-tag> .
```

如果服务器是在该机上直接 `docker compose build`，可将 `API_PROXY_TARGET=<BACKEND_INTERNAL_URL>` 写入服务器受保护的 `.env`，并在 compose 中显式透传到**构建参数**：

```yaml
services:
  grounded-glow:
    build:
      args:
        API_PROXY_TARGET: ${API_PROXY_TARGET}
```

`.env` 可以存放该配置，但它必须通过 `build.args` 或 CI 的 `--build-arg` 进入构建阶段；单放在 `environment:` 仅影响运行期，不足以配置本次 rewrite。

### 4.2 验收和发布

```bash
cd ~/Documents/personal-projects/grounded-glow
npm ci
npm run build
git diff --check
git status --short
# 审查 7 个未提交文件，连同 Dockerfile/CI 的 API_PROXY_TARGET 改动一并提交
git push origin main
```

部署后使用浏览器和服务端分别验证：

```bash
# 容器内部：确认可以连到后端（返回 401 也说明路由通）
curl -i http://127.0.0.1:3000/api/japaflow/progress/summary
```

再验证注册页：发送验证码、输入验证码完成注册、登录后进入学习页。

## 5. 建议发布顺序和每步停止条件

1. 完成备份和 SQL 验证；失败则停止。
2. 发布 `light-blog`；练习会话、AI 配额、验证码接口验收失败则停止。
3. 发布已验收的 `japa-flow`；练习主路径失败则回滚前端镜像。
4. 完成 grounded-glow Dockerfile/CI 的构建参数接线后发布；`/api/*` 代理失败则回滚 grounded-glow 镜像。

数据库迁移采用新增表/新增列，通常无需回滚；应用回滚到前一镜像即可。除非明确确认没有数据写入，不要删除本次新增的生产表。
