# JapaFlow 每日 AI 调用限额 PRD

## 1. 背景

JapaFlow 的练习判题、答案格式化、发音评测与音频生成会调用付费的第三方 AI 服务。当前项目已通过副项目提供的用户登录能力识别用户，但尚未在服务端实施实际调用限额；首页“每日最多 50 次”的说明不能阻止接口被持续调用。

本需求建立以登录用户为单位、在服务端强制执行的每日 AI 调用额度，控制成本并避免匿名或恶意请求消耗密钥。

## 2. 目标与非目标

### 目标

1. 每位已登录用户每天只能消耗指定数量的 AI 调用额度。
2. 所有限额判断、扣减和用户身份识别在服务端完成，前端不能绕过或伪造。
3. 并发请求不能突破限额，重试不能重复扣费。
4. 超限时返回统一的可识别错误，前端明确提示恢复时间。
5. 管理员可配置默认限额，并可为个别用户设置覆盖额度。
6. 记录调用审计信息，便于排查成本、异常流量和申诉。

### 非目标（本期不做）

1. 付费、订阅、充值或购买额度。
2. 分钟级限流、IP 限流、风控黑名单（保留后续扩展位）。
3. 按实际 token、音频秒数或人民币成本做精确计费；本期采用“调用单位”。
4. 未登录用户的免费体验；受限能力必须要求登录。

## 3. 用户与权限

| 用户类型 | 权限 |
| --- | --- |
| 未登录用户 | 不可调用受限 AI 能力；收到 `401` / 登录引导。 |
| 普通已登录用户 | 按其每日额度调用。 |
| 白名单用户 | 使用单独覆盖额度；可设为不受限。 |
| 管理员 | 配置默认额度、用户覆盖额度，并查看用量。 |

用户身份必须来自副项目签发并在后端验证通过的 JWT。禁止从请求体、Query 参数或前端 localStorage 直接信任 `userId`。

## 4. 受限能力与计费单位

本期受限能力如下：

| capability | 当前能力 | 建议扣减 |
| --- | --- | --- |
| `deepseek_review` | 练习答案 AI 复核 | 1 单位 |
| `deepseek_format` | 练习答案格式化 | 1 单位 |
| `pronunciation_evaluate` | Azure 发音评测 | 1 单位 |
| `tts_generate` | 按需生成 TTS 音频 | 1 单位 |

默认规则：所有 capability 共用一个“每日 AI 总额度池”，默认 **100 单位 / 自然日**。后端仍须按 capability 记录明细，以便以后改成独立额度或不同权重。

“调用成功”的定义是第三方服务已经收到有效请求。为避免并发超额，系统先预占额度；若请求在发给第三方之前因参数校验、鉴权或本地错误失败，必须释放预占额度。

## 5. 日期、时区与额度恢复

1. 每日额度按 `Asia/Shanghai`（北京时间）的自然日计算。
2. 每天 00:00:00（日本时间）自动开始新的额度记录，无需定时清理旧数据。
3. 超限提示应说明当天额度已用完；恢复时间由接口字段提供给需要展示的客户端。
4. 历史记录至少保留 180 天；具体保留期可由运维策略调整。

## 6. 核心用户流程

### 6.1 正常调用

```text
用户点击 AI 功能
→ 前端携带 JWT 请求 JapaFlow 后端
→ 后端验证 JWT 并识别 userId
→ 后端以原子操作预占 1 单位
→ 调用第三方 AI 服务
→ 记录成功事件并返回结果
→ 前端显示结果与剩余额度（如接口返回）
```

### 6.2 达到限额

```text
用户请求 AI 功能
→ 后端发现今日已用额度 >= 有效额度
→ 不调用第三方服务
→ 返回 HTTP 429 + QUOTA_EXCEEDED
→ 前端展示额度已用完与恢复时间
```

### 6.3 外部服务失败

```text
已预占额度
→ 第三方服务超时或返回失败
→ 标记失败事件
→ 释放本次预占额度（仅限尚未得到有效服务响应的失败）
→ 返回原有服务错误
```

## 7. 数据模型

### 7.1 每日汇总表

建议表名：`jf_ai_usage_daily`

```sql
CREATE TABLE jf_ai_usage_daily (
  user_id BIGINT NOT NULL,
  usage_date DATE NOT NULL COMMENT 'Asia/Tokyo 自然日',
  used_units INT NOT NULL DEFAULT 0,
  reserved_units INT NOT NULL DEFAULT 0,
  daily_limit INT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, usage_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 7.2 调用审计表

建议表名：`jf_ai_usage_event`

```sql
CREATE TABLE jf_ai_usage_event (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  request_id CHAR(36) NOT NULL,
  user_id BIGINT NOT NULL,
  usage_date DATE NOT NULL,
  capability VARCHAR(32) NOT NULL,
  units INT NOT NULL DEFAULT 1,
  status VARCHAR(16) NOT NULL COMMENT 'reserved/succeeded/released/failed',
  provider VARCHAR(32) DEFAULT NULL,
  provider_request_id VARCHAR(128) DEFAULT NULL,
  error_code VARCHAR(64) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_request_id (request_id),
  KEY idx_user_date (user_id, usage_date),
  KEY idx_capability_date (capability, usage_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 7.3 用户覆盖额度

建议表名：`jf_ai_quota_override`

```sql
CREATE TABLE jf_ai_quota_override (
  user_id BIGINT PRIMARY KEY,
  daily_limit INT NULL COMMENT 'NULL 表示沿用默认值',
  unlimited TINYINT(1) NOT NULL DEFAULT 0,
  reason VARCHAR(255) DEFAULT NULL,
  expires_at DATETIME DEFAULT NULL,
  updated_by BIGINT DEFAULT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 8. 服务端行为与并发要求

1. 使用数据库事务或等效原子条件更新完成“检查余额 + 预占额度”；禁止先查询再普通更新。
2. `request_id` 由服务端生成，或后端验证客户端幂等键；同一个 `request_id` 重试不得重复扣费。
3. 有效额度顺序为：有效用户覆盖额度 → 系统默认额度。
4. 预占成功后创建 `reserved` 审计事件；外部调用成功后转为 `succeeded` 并将 `reserved_units` 转入 `used_units`。
5. 本地校验失败、请求取消、未发出第三方请求的错误必须释放额度并标记 `released`。
6. 已向第三方发出请求但网络结果不确定时，为控制成本，默认保留扣减并标记 `failed`；管理员可根据审计记录人工补回。
7. 所有真正调用 DeepSeek、Azure、TTS 的服务端入口都必须接入该流程；不得仅在前端按钮层限制。

## 9. API 契约

### 9.1 调用额度状态

`GET /api/japaflow/ai-quota`

认证：必须。

响应：

```json
{
  "date": "2026-08-16",
  "timezone": "Asia/Shanghai",
  "dailyLimit": 50,
  "usedUnits": 12,
  "remainingUnits": 38,
  "resetsAt": "2026-08-17T00:00:00+08:00"
}
```

### 9.2 超限错误

所有受限 AI 接口统一返回：

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
```

```json
{
  "code": "AI_DAILY_QUOTA_EXCEEDED",
  "message": "今日 AI 调用额度已用完。",
  "dailyLimit": 50,
  "usedUnits": 50,
  "resetsAt": "2026-08-17T00:00:00+08:00"
}
```

### 9.3 管理接口

管理端需提供：

- 查询用户今日用量与最近调用事件。
- 设置、修改、删除用户额度覆盖。
- 设置系统默认每日额度。

管理接口必须复用副项目已有管理员鉴权，不得只依赖前端隐藏入口。

## 10. 前端要求

1. AI 调用前不在前端自行扣减额度；以服务端响应为准。
2. 收到 `401` 时展示登录引导；收到 `429` 时禁止本次重试并展示恢复时间。
3. AI 结果区域可显示“今日剩余 N 次”，但这只是展示，不是安全控制。
4. 对可重复点击的按钮，在请求进行中禁用，减少无意义并发。
5. 不在浏览器存储剩余额度作为可信数据。

## 11. 验收标准

1. 同一用户在东京自然日内第 `dailyLimit + 1` 次调用被拒绝，且第三方服务未收到该次请求。
2. 两个并发请求只剩 1 单位时，最多一个请求成功预占。
3. 不同用户的额度相互独立。
4. 北京时间跨日后，用户可再次调用，旧日期记录不影响新日期。
5. 未携带或伪造身份的请求不能消耗或绕过任一用户的额度。
6. 相同 `request_id` 重试不重复扣费。
7. 在本地失败、第三方失败、成功三种路径中，汇总记录与审计事件状态一致。
8. 管理员覆盖额度与无限额设置立即生效，并保留变更原因。
9. 前端在 `429` 时展示统一、可理解的限额提示。

## 12. 实施依赖与下一步

实现前需要提供副项目后端仓库，以确认：

1. JWT 的签发方式、验签中间件和当前用户 / 管理员模型。
2. 数据库类型、迁移框架与既有用户表名称。
3. JapaFlow Node 服务与副项目后端之间的可信调用方式。
4. DeepSeek、Azure 与 TTS 最终分别由哪个服务发起请求。

确认后按以下顺序实施：数据库迁移 → JWT 鉴权统一 → 配额服务与审计 → AI 接口接入 → 前端错误体验与余额展示 → 并发/幂等/跨日测试。
