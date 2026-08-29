# 2026-08-29 三仓库发布计划

本次发布涉及：

| 仓库 | 当前分支与 main 的关系 | 本次职责 | 数据库变更 |
| --- | --- | --- | --- |
| `japa-flow` | `dev` 比 `main` 多 13 个提交，另有 5 个未提交文件 | 学习前端、课程内容、OCR、练习界面 | 无 |
| `light-blog` | `dev` 比 `main` 多 1 个提交，另有已修改和未跟踪文件 | JapaFlow 练习 API、邮件验证码、AI 配额 | 有，必须执行 |
| `grounded-glow` | 在 `main`，有未提交文件 | 登录/注册界面 | 无 |

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

4. 确认生产 Nginx 保留 `location /api/ { proxy_pass http://127.0.0.1:8081; }`。该规则将浏览器的同源 `/api/*` 请求直接转发给 Java 后端；现有 `grounded-glow` 部署文档已经包含此规则。

## 1. 先准备数据库变更

所有 SQL 均在 `light-blog` 仓库。先对生产库备份，再在维护窗口执行。以下操作应由有生产数据库权限的人执行。

### 1.1 备份与连接验证

```bash
# 在服务器上执行；命令会交互式提示输入 light_blog 的数据库密码
sudo docker exec light-blog-mysql mysql -u light_blog -p -e 'SELECT NOW();' techblog

# 建议先生成备份；不要将密码写进 shell 历史或仓库
sudo docker exec light-blog-mysql mysqldump -u light_blog -p techblog > techblog-before-20260829.sql
```

### 1.2 执行三组变更

1. 执行仓库内实际存在的 `src/main/resources/db/jf_schema_init.sql`。其中包含 4 个新增表：
   `jf_practice_set`、`jf_practice_session`、`jf_practice_activity_attempt`、`jf_practice_item_attempt`；其余建表语句同样使用 `CREATE TABLE IF NOT EXISTS`，可安全重复执行。
2. 执行 `jf_schema_patch_20260719_exercise_result_columns.sql`，为旧的 `jf_exercise_result` 安全补充字段。
3. 执行 `jf_schema_patch_20260816_ai_daily_quota.sql`，创建 `jf_ai_usage_daily`、`jf_ai_usage_event`、`jf_ai_quota_override`。

这些 SQL 使用 `IF NOT EXISTS` / 条件列检查，可重复执行；仍应先在预发布或备份后的生产库执行。

```bash
# 先从已提交的 light-blog 工作区上传三个 SQL 文件到服务器 /tmp/release-sql/。
# 以下命令在服务器执行；每条命令都会交互式提示数据库密码。
sudo docker exec -i light-blog-mysql mysql -u light_blog -p techblog \
  < /tmp/release-sql/jf_schema_init.sql
sudo docker exec -i light-blog-mysql mysql -u light_blog -p techblog \
  < /tmp/release-sql/jf_schema_patch_20260719_exercise_result_columns.sql
sudo docker exec -i light-blog-mysql mysql -u light_blog -p techblog \
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

本次代码提交必须包含以下验证码配置迁移：

1. `application.properties`：启用 Redis，并统一定义 Redis、SMTP 与验证码规则的环境变量占位符。
2. `application-docker.properties`：保留 Docker 网络中的 Redis 地址覆盖，并读取 `REDIS_PASSWORD`。
3. 删除 `application-email-verification.properties`：验证码能力不再依赖手工激活该 profile。

注册验证码不需要新表，但生产必须具备 Redis 和 SMTP。验证码配置已在基础 `application.properties` 中自动启用，生产仅使用既有 `docker` profile；不要再依赖人工补写 `email-verification` profile。

服务器的 `docker-compose.yml` 中，`api.environment` 必须包含以下内容（真实密码和密钥由同目录、未提交 Git 的 `.env` 提供）：

```yaml
api:
  environment:
    SPRING_PROFILES_ACTIVE: docker
    DB_USERNAME: ${DB_USERNAME}
    DB_PASSWORD: ${DB_PASSWORD}
    JWT_SECRET: ${JWT_SECRET}
    MYSQL_HOST: mysql
    MYSQL_PORT: 3306
    MYSQL_DATABASE: ${MYSQL_DATABASE}
    REDIS_HOST: redis
    REDIS_PORT: 6379
    REDIS_PASSWORD: ${REDIS_PASSWORD}
    SPRING_MAIL_HOST: ${SPRING_MAIL_HOST}
    SPRING_MAIL_PORT: ${SPRING_MAIL_PORT}
    SPRING_MAIL_USERNAME: ${SPRING_MAIL_USERNAME}
    SPRING_MAIL_PASSWORD: ${SPRING_MAIL_PASSWORD}
    SPRING_MAIL_SMTP_AUTH: ${SPRING_MAIL_SMTP_AUTH}
    SPRING_MAIL_STARTTLS: ${SPRING_MAIL_STARTTLS}
    SPRING_MAIL_SSL: ${SPRING_MAIL_SSL}
    MAIL_FROM: ${MAIL_FROM}
    REGISTER_CODE_SECRET: ${REGISTER_CODE_SECRET}
    TZ: Asia/Shanghai
```

服务器 `.env` 至少需设置 `REDIS_PASSWORD`（无密码时可留空）、全部 `SPRING_MAIL_*`、`MAIL_FROM` 和高强度的 `REGISTER_CODE_SECRET`。不要将这些真实值提交到 Git 或粘贴到部署日志。

不要将上述密码或密钥提交进 Git 或粘贴到部署计划。应通过服务器 secret、CI secret 或受权限保护的环境文件注入。

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

### 4.1 保持既有 Nginx → Java 调用链

不新增 Next.js rewrite，也不需要 `API_PROXY_TARGET`。前端在生产环境保持 `API_BASE_URL=''`，因此请求仍是同源路径，例如：

```text
浏览器 → https://groundedglow.cc/api/users/register/request-code
        → Nginx 的 location /api/
        → http://127.0.0.1:8081/api/users/register/request-code
        → light-blog Java UserController
```

这与原有登录、注册请求的链路一致。新增的邮箱验证码仅增加 Java 接口 `/api/users/register/request-code` 和 `/api/users/register/confirm`，无需新增代理层或配置新环境变量。

### 4.2 验收和发布

```bash
cd ~/Documents/personal-projects/grounded-glow
npm ci
npm run build
git diff --check
git status --short
# 审查未提交文件并提交
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
4. 发布 grounded-glow；确认 Nginx 的 `/api/*` 直接转发和注册流程正常，失败则回滚 grounded-glow 镜像。

数据库迁移采用新增表/新增列，通常无需回滚；应用回滚到前一镜像即可。除非明确确认没有数据写入，不要删除本次新增的生产表。
