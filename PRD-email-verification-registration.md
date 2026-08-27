# PRD：邮箱验证码注册确认

**状态**：待实施  
**日期**：2026-08-27  
**仓库与职责**：

| 仓库 | 路径 | 本期职责 |
| --- | --- | --- |
| 主站 | ~/Documents/personal-projects/grounded-glow | 注册、验证码输入、登录和回跳 UI |
| Java API | ~/Documents/personal-projects/light-blog | 注册校验、验证码、Redis、邮件、用户创建 |
| 日语学习前端 | ~/Documents/personal-projects/japa-flow | 登录跳转与登录态同步的回归验证 |

## 1. 背景

当前 light-blog 的 POST /api/users/register 在用户名、邮箱格式和唯一性校验通过后，立即插入 user 表。用户并未证明邮箱由本人控制。

grounded-glow 的 /register 页当前直接调用该接口，成功后跳转 /login。JapaFlow 不维护用户表，它跳转主站登录页，随后通过 light_blog_token、light_blog_user 及 auth-bridge.js 获取主站登录态。因此验证码注册只能由主站与 Java API 实现，不能复制到 JapaFlow。

## 2. 目标与非目标

### 目标

1. 新用户只有通过邮箱验证码确认后才创建 user 记录。
2. 保持现有 JWT、POST /api/users/login、GET /api/users/me 和 JapaFlow 回跳兼容。
3. 生产使用已验证域名投递邮件；本地可不发真实邮件完成测试。
4. 限制验证码重发、尝试次数与有效期，避免基础滥用。

### 非目标

- 不做密码重置、换绑邮箱、营销邮件、MFA、退信自动处理。
- 不要求已有用户补做邮箱验证。
- 不修改 JapaFlow 的用户模型、练习数据或认证协议。

## 3. 核心设计决策

采用“验证成功后才落库”：

1. 用户提交用户名、邮箱、密码后，待注册信息暂存在 Redis。
2. 邮件验证码正确且未过期后，服务端再次检查唯一性并插入 MySQL。
3. 验证成功后删除 Redis 暂存。

不使用“先创建 email_verified=false 用户”的方案。否则攻击者可抢占他人邮箱，使邮箱实际所有人无法注册。

邮件发送采用 Resend SMTP + Spring JavaMailSender：

- Spring Boot 只依赖标准 SMTP，未来可替换服务商。
- 生产发件域名需在 Resend 完成 SPF/DKIM 验证。
- 本地 SMTP 指向 Mailpit，验证码在本机页面可见。
- Resend 免费档当前为 3,000 封/月、100 封/日，早期注册验证通常足够；价格以官网为准。

## 4. 用户流程

### 4.1 正常注册

1. 用户进入 grounded-glow 的 /register，可能带 redirect 参数。
2. 填写用户名、邮箱、密码，点击“发送验证码”。
3. 服务端校验并发送 6 位验证码；主站显示验证码步骤、脱敏邮箱、10 分钟有效期与 60 秒重发倒计时。
4. 用户输入验证码，点击“完成注册”。
5. 验证成功后创建用户，主站提示“注册成功，请登录”，跳转 /login 并保留 redirect。
6. 用户登录后，主站按原逻辑写入 token 并跳回 JapaFlow 原地址。

### 4.2 异常流程

| 场景 | 服务端处理 | 前端表现 |
| --- | --- | --- |
| 用户名或邮箱已存在 | 409 | 留在第一步并显示具体错误 |
| 发送过快 | 429，返回剩余秒数 | 保持倒计时，不重复请求 |
| 验证码错误 | 400，返回剩余次数 | 清空验证码输入，可重试 |
| 错误达 5 次 | 作废验证码 | 提示重新发送 |
| 超过 10 分钟 | Redis 自动过期 | 提示验证码过期 |
| 邮件服务失败 | 不保存待注册状态 | 提示稍后重试 |
| 验证期间被他人注册 | 409 | 返回第一步刷新可用性 |

## 5. 后端实现：light-blog

### 5.1 新接口

统一沿用 Result 响应外壳：{ code, message, data }。

#### 请求验证码

POST /api/users/register/request-code

请求：

~~~json
{
  "username": "rookie",
  "email": "rookie@example.com",
  "password": "at-least-6-characters"
}
~~~

成功 data：

~~~json
{
  "email": "rookie@example.com",
  "expiresInSeconds": 600,
  "resendAfterSeconds": 60
}
~~~

#### 确认并创建用户

POST /api/users/register/confirm

请求：

~~~json
{
  "email": "rookie@example.com",
  "code": "123456"
}
~~~

成功后返回现有成功外壳；不自动登录，保持当前“注册后登录”的产品行为。

### 5.2 Redis 设计

邮箱一律 trim + lowercase 后计算 SHA-256，Redis key 不直接存邮箱。

| Key | TTL | 内容 |
| --- | --- | --- |
| register:pending:{emailHash} | 10 分钟 | username、标准化邮箱、BCrypt 密码哈希、验证码 HMAC、错误次数、签发时间 |
| register:cooldown:{emailHash} | 60 秒 | 重发冷却 |
| register:ip-window:{ipHash} | 1 小时 | 发信次数 |

安全规则：

- 用 SecureRandom 生成 6 位数字验证码。
- Redis 仅保存 HMAC-SHA-256(code, REGISTER_CODE_SECRET)，不保存验证码明文。
- 密码入 Redis 前先 BCrypt；日志不能记录密码、验证码或 SMTP 凭据。
- 同验证码最多验证 5 次；同邮箱 60 秒最多发送一次；同 IP 默认每小时最多 10 封。
- 生产仅在受信任反向代理配置正确时使用 X-Forwarded-For，否则以连接地址限流。
- confirm 操作中再次检查用户名和邮箱唯一性。数据库唯一索引是并发下的最终防线；重复键必须转换为 409。

### 5.3 配置与依赖

light-blog 新增 spring-boot-starter-mail。现有项目虽然已经依赖 Redis starter，但 application.properties 默认禁用了 Redis 自动配置；本功能上线前必须启用 Redis。

| 环境变量 | 用途 |
| --- | --- |
| SPRING_MAIL_HOST / PORT | SMTP 主机与端口 |
| SPRING_MAIL_USERNAME / PASSWORD | SMTP 凭据 |
| MAIL_FROM | 已验证域名的发件人，如 JapaFlow <noreply@mail.groundedglow.cc> |
| REGISTER_CODE_SECRET | 独立高熵 HMAC 密钥，不复用 JWT 密钥 |
| REGISTER_CODE_TTL_SECONDS | 默认 600 |
| REGISTER_RESEND_COOLDOWN_SECONDS | 默认 60 |
| REGISTER_MAX_VERIFY_ATTEMPTS | 默认 5 |
| SPRING_DATA_REDIS_HOST / PORT / PASSWORD | Redis 连接 |
| APP_PUBLIC_URL | 邮件文案和公开站点地址 |

新增代码：

- RegisterCodeRequest、RegisterConfirmRequest、RegisterCodeResponse DTO。
- EmailVerificationService：生成、保存、发送、确认和作废验证码。
- RegistrationService 或扩展 UserService：最终创建用户。
- 邮件模板：HTML + 纯文本，内容包括验证码、有效期、“非本人操作请忽略”。
- Redis、Mail 和限流配置。
- 单元测试、Redis 集成测试、控制器接口测试。

### 5.4 旧注册接口

POST /api/users/register 不得继续绕过邮箱验证。

推荐发布策略：

1. grounded-glow 切换到两个新接口。
2. 旧接口保留一个发布周期，但返回 400：“请先获取并确认邮箱验证码”。
3. Swagger 标记 deprecated。
4. 确认无调用方后删除旧接口。

## 6. 主站实现：grounded-glow

### 6.1 文件范围

| 文件 | 改动 |
| --- | --- |
| features/auth/api.ts | 新增 requestRegistrationCode 与 confirmRegistration |
| types/user.ts | 新增请求、确认及响应类型 |
| features/auth/schemas.ts | 新增 6 位数字验证码 schema |
| app/register/page.tsx | 改为单页两步骤注册，保留 redirect |
| 新增测试 | 覆盖成功、重发、过期、错误和跳转 |

### 6.2 UI 规格

第一步“注册账号”：

- 字段：用户名、邮箱、密码。
- 主按钮：“发送验证码”。
- 调用成功后切到第二步；邮箱展示为脱敏格式。
- 可点击“返回修改信息”回第一步。

第二步“确认邮箱”：

- 文案：“验证码已发送至 ro***@example.com”。
- 6 位数字输入框，设置 inputMode=numeric、autoComplete=one-time-code。
- 主按钮：“完成注册”。
- 重发按钮：60 秒内禁用并显示倒计时，到期后可发送。
- 页面刷新不恢复密码或验证码状态，用户重新请求；不把密码写入浏览器存储。
- 成功后跳 /login，并原样保留合法 redirect。

不得改变 app/login/page.tsx 的 storeLogin、可信跳转检查或 token/cookie 写入逻辑。

## 7. JapaFlow 范围与回归

预计不修改 app.js、auth-bridge.js、tools/course-detail-preview.html 或 practiceSessionApi.js。

必须回归：

1. 未登录的 JapaFlow 页面仍跳转主站 /login?redirect=<原始JapaFlow地址>。
2. 从登录页进入注册页时，redirect 被带到 /register。
3. 完成“验证码注册 -> 登录”后回到原 JapaFlow 地址。
4. 回跳后存在 light_blog_token、light_blog_user。
5. 受保护的练习/API 不再提示“请先登录后继续练习”。
6. iframe 内练习仍由父页面处理跳转，不发生循环。

若回归失败，优先修复 grounded-glow 的 redirect 或 token 写入链路，不在 JapaFlow 实现验证码逻辑。

## 8. 人工配合清单

### 开发前，你需要完成

1. 确认使用 Resend SMTP，或提供其他 SMTP 服务商。
2. 在邮件服务商控制台添加发信域名；建议 mail.groundedglow.cc。
3. 在 DNS 控制台添加服务商要求的 SPF/DKIM 记录，等待显示已验证。
4. 创建 SMTP 凭据，并通过安全渠道提供主机、端口、用户名、密码及 MAIL_FROM。
5. 提供生产 Redis 连接信息，或确认可以部署 Redis。
6. 确认生产服务器允许访问 Redis 与 SMTP 端口；如 465 受限，使用服务商支持的 587/STARTTLS。
7. 提供一个真实、未注册的测试邮箱。

### 实施中，需要你确认

1. 发件人名称：JapaFlow 或 Grounded Glow。
2. 发信子域名与 MAIL_FROM。
3. IP 限流默认值每小时 10 封是否合适。
4. 旧 /api/users/register 是否按“deprecated 一个发布周期后删除”执行。

### 部署时，你需要完成

1. 在服务器的密钥管理、部署平台或 Docker 环境写入全部环境变量。
2. 不把 .env、SMTP 密码、Resend API Key、REGISTER_CODE_SECRET 提交 Git。
3. 重启 light-blog 后确认 Redis 与 SMTP 连通。
4. 在邮件服务商控制台检查 DNS、投递日志和退信状态。

## 9. 本地开发与验收

### 本地基础设施

启动 Mailpit 和 Redis：

~~~bash
docker run --rm -p 1025:1025 -p 8025:8025 axllent/mailpit
docker run --rm -p 6379:6379 redis:7-alpine
~~~

local profile 核心配置：

~~~properties
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.mail.host=localhost
spring.mail.port=1025
spring.mail.properties.mail.smtp.auth=false
spring.mail.properties.mail.smtp.starttls.enable=false
mail.from=JapaFlow Local <noreply@localhost>
~~~

Mailpit 页面为 http://localhost:8025。此测试无需域名、Resend 账号或真实邮箱。

### 本地流程

1. 启动 MySQL、Redis、Mailpit、light-blog、grounded-glow、japa-flow。
2. 主站 /register 提交账号信息。
3. 在 Mailpit 读取验证码；确认验证码邮件内容、有效期、发件人。
4. 确认前查询 MySQL：user 表没有该用户。
5. 输入验证码后确认 user 表新增一条记录；password 为 BCrypt 哈希。
6. 登录并从 JapaFlow 的带 redirect 页面完成回跳。

### 真实邮件预发布

DNS 验证完成后，开发机也可临时使用生产 SMTP 凭据对真实测试邮箱发送。无需先把代码部署生产；真实密钥仅注入本地进程，不进入仓库。

## 10. 验收清单

### 后端

- [ ] 验证前 user 表不新增记录。
- [ ] request-code 成功后能在 Mailpit/真实邮箱收到 6 位验证码。
- [ ] 正确码有效期内只可使用一次；成功后 pending Redis key 删除。
- [ ] 错误、过期、5 次错误、重发冷却和 IP 限流都返回预期错误。
- [ ] 重发后旧码失效。
- [ ] 已存在用户名或邮箱返回 409 且不发邮件。
- [ ] 并发确认最多创建一个用户。
- [ ] 邮件发送失败不产生可确认的 pending 状态。
- [ ] 旧 register 接口不能创建未验证用户。
- [ ] 测试通过，日志不含机密。

### grounded-glow

- [ ] 两步 UI、字段校验、倒计时、重发、错误提示符合本 PRD。
- [ ] 注册成功跳转 /login 并保留合法 redirect。
- [ ] 登录后 token 和 cookie 的行为与当前一致。
- [ ] npm run lint、npm run build 通过。

### JapaFlow 与生产

- [ ] 从 http://localhost:5173/tools/course-detail-preview.html?lesson=1&part=practice 完成注册、登录后回到同一地址。
- [ ] 回跳后练习可以继续，不提示登录，也不循环跳转。
- [ ] 生产发信域名 SPF/DKIM 均已验证。
- [ ] 真实未注册邮箱 2 分钟内收到验证码；可在服务商投递日志查询状态。
- [ ] 垃圾邮箱风险通过 SPF/DKIM/DMARC 和实际投递验证检查。

## 11. 实施顺序、时间与上线

| 阶段 | 负责人 | 工作量 |
| --- | --- | --- |
| 邮件服务、DNS、Redis 准备 | 你 | 30 分钟至 DNS 生效时间 |
| light-blog 后端和测试 | 开发 | 4-6 小时 |
| grounded-glow 两步注册页和测试 | 开发 | 2-4 小时 |
| 本地 Mailpit/Redis/JapaFlow 回归 | 共同 | 1-2 小时 |
| 真实投递、部署、生产验收 | 共同 | 1-2 小时，不含 DNS 等待 |

预计纯开发约 1 个工作日。

上线顺序：先配置并验证 Redis/SMTP 和后端新接口，再部署主站注册页，最后从 JapaFlow 做完整注册、登录、回跳验证。

回滚原则：邮件服务故障时仅阻断新注册，现有用户仍可登录。正式上线后不应为了临时恢复注册而重新开放未验证的旧接口。

## 12. 开始实施前的确认

1. 是否采用 Resend SMTP？
2. 最终的发信域名/子域名、发件人名称和 MAIL_FROM 是什么？
3. 生产 Redis 是否已可用？
4. 是否接受旧 POST /api/users/register 先 deprecated 一个发布周期、后删除？

