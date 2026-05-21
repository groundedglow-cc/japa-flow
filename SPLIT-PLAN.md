# JapaFlow 拆分清单：管理端 / 学员端分离

**核心原则：渐进式、每步可验证、不得不改才改。**

---

## Phase 0：准备工作（10 分钟）

**目标：建立安全基线，避免误操作。**

### Step 0.1 创建工作分支
```bash
git checkout -b split/admin-student
```

### Step 0.2 清理仓库噪音
- 在 `.gitignore` 添加 `debug-recordings/`。
- `git rm -r --cached debug-recordings`（保留本地文件，仅从 git 移除）。
- 提交：`chore: ignore debug-recordings`。

**✅ 验证**：`git status` 中 `debug-recordings/` 不再被追踪；本地目录依然存在。

---

## Phase 1：识别边界（不改代码，仅梳理）

**目标：彻底搞清楚"学员端运行时"到底依赖哪些 API。**

### Step 1.1 扫描前端的所有 API 调用
- 在 `app.js` 中搜索 `fetch(`、`/api/`，列出每一处调用：
  - URL
  - 触发时机（用户操作 / 页面加载 / 管理流程）
  - 归属：**学员端运行时**（R） / **管理初始化**（A） / **两者都用**（B）

### Step 1.2 输出分类表（已实测）

**实测结果（基于 app.js 扫描，共 14 处 fetch）：**

| 行号 | 调用 | 归属 | 触发位置 |
|---|---|---|---|
| 4913 | `/api/pronunciation/evaluate` | **R** | 词汇练习发音评测 |
| 5132 | `/api/pronunciation/evaluate` | **R** | 语法练习发音评测 |
| 5323 | `/api/pronunciation/evaluate` | **R** | 课文练习发音评测 |
| 5624 | `/api/audio/status` | **A** | `audioManagePage` 音频管理页 |
| 5641 | `/api/lesson-catalog` | **R** | `loadCourseCatalog` 首页 |
| 5670 | `/data/lessons/lessonXX.json` | **R** | `ensureRuntimeLesson`（**已是静态**） |
| 5704 | `/api/init/status` | **A** | 初始化页状态 |
| 5729 | `/api/init/upload` | **A** | 图片上传 |
| 5750 | `/api/init/parse` | **A** | Codex 解析 |
| 5778 | `/api/init/import-json` | **A** | JSON 草稿导入 |
| 5811 | `/api/init/confirm-parse` | **A** | 确认解析 |
| 5835 | `/api/init/audio/generate` | **A** | 批量生成音频 |
| 5866 | `/api/init/confirm-audio` | **A** | 确认音频完整性 |
| 5896 | `/api/audio/sample` | **A** | 声音试听 |
| 5925/5943 | `/api/audio/generate` | **A** | 单条/批量生成 |
| - | `/api/audio/voices` | **N** | 前端未调用，`audioVoices` 是 app.js 内常量 |
| - | 静态 `/audio/*.mp3` | **R** | `<audio>` 元素播放 |
| - | 静态 `/data/*` | **R** | 课程 JSON |

**关键发现：**
1. 学员端运行时仅依赖 **2 个 API**：`/api/lesson-catalog`（首页课程目录）和 `/api/pronunciation/evaluate`（发音评测）。
2. `/data/lessons/lessonXX.json` 早已是静态文件 —— 学员端读单课数据无需后端。
3. 所有 `/api/init/*` 和 `/api/audio/*`（除 `pronunciation`）都是 **A** ——管理端独占。
4. `/api/audio/voices` 路由实际未被前端调用，可在 Phase 5 删除。
5. `audioManagePage`（音频管理 UI，第 3708 行）整页都属于 **A**。

**学员端剥离难度：**
- 课程目录（R）：Phase 3 改为静态 JSON 即可。
- 发音评测（R）：进入 Phase 4 判定。

**✅ 验证**：清单覆盖 `app.js` 中所有 fetch；每个 API 都有明确归属。

---

## Phase 2：在原仓库内做"逻辑拆分"（不拆物理目录）

**目标：把代码组织成"可以单独跑学员端"的形态，但仍在同一个仓库、同一个 server.mjs 下，确保零功能回归。**

### Step 2.1 前端代码层分离
- 在 `app.js` 顶部用注释划分区块：
  ```
  // ============ STUDENT RUNTIME ============
  // ============ ADMIN INITIALIZATION ============
  ```
- 把所有归属 A 的代码（课程导入流程、音频生成 UI 等）集中到 `// ADMIN` 区块。
- 不抽文件、不改逻辑，只重排顺序。

**✅ 验证**：`npm run dev`，把所有学员端功能（看课程目录、学课、播放音频、发音评测）走一遍 + 把所有管理功能（导入课程、生成音频）走一遍，全部正常。

### Step 2.2 引入"管理模式开关"
- 在 `index.html` 或 `app.js` 顶部加：
  ```js
  const ADMIN_MODE = new URLSearchParams(location.search).has('admin');
  ```
- 把所有管理端 UI 入口（按钮 / 路由）用 `ADMIN_MODE` 包裹，默认隐藏。
- 访问 `http://localhost:5173/` → 只看到学员端。
- 访问 `http://localhost:5173/?admin=1` → 看到全部功能。

**✅ 验证**：
- 默认页面只有学员端 UI，所有学员功能正常。
- 加 `?admin=1` 后管理 UI 出现，导入/生成音频正常。

### Step 2.3 server.mjs 路由分组（仅注释划分）
- 在 server.mjs 用注释标记 STUDENT / ADMIN 两组路由。
- 暂不删除任何路由。

**✅ 验证**：所有功能依然可用。

**🛑 Phase 2 完成后提交一次：`refactor: separate admin and student concerns in single repo`**

---

## Phase 3：固化学员端"只读契约"

**目标：让学员端运行时只读静态文件，不再依赖任何 API（除发音评测）。**

### Step 3.1 把 `/api/lesson-catalog` 改成静态 JSON
- 写一个脚本 `scripts/export-catalog.mjs`：调用 server 内部的目录构造逻辑，把结果写到 `data/catalog.json`。
- 学员端 `fetch('/api/lesson-catalog')` → `fetch('/data/catalog.json')`。
- 保留 `/api/lesson-catalog` 路由（不删，作为兼容）。

**✅ 验证**：
- 跑一次 `node scripts/export-catalog.mjs`，生成 `data/catalog.json`。
- 刷新学员端，课程目录正常显示。
- Network 面板确认请求的是 `/data/catalog.json`。

### Step 3.2 检查其余学员端 API（若 Step 1.1 发现遗漏）
- 对每一个学员端 API 重复 Step 3.1 模式：
  1. 让管理端流程产出对应的静态 JSON。
  2. 学员端改读静态文件。
  3. 验证。

### Step 3.3 学员端 "纯静态启动" 验证
- 临时启动一个纯静态服务器：
  ```bash
  npx http-server . -p 8080 -c-1
  ```
- 访问 `http://localhost:8080/`（不带 `?admin`），完整走一遍学员端所有功能。
- **发音评测如果走 `/api/pronunciation/evaluate` 仍会失败**，先记录，不处理。

**✅ 验证**：除发音评测外，学员端在无 Node 后端的环境下完全可用。

**🛑 Phase 3 完成提交：`feat: student runtime no longer depends on backend APIs`**

---

## Phase 4：处理发音评测（按实际依赖决定）

**目标：决定发音评测的最终形态。**

### Step 4.1 排查 `/api/pronunciation/evaluate` 实现
- 读 server.mjs 中该路由，判断：
  - **(a) 仅本地算法（无外部调用）**：可移植到浏览器端，直接前端实现。
  - **(b) 调第三方 API + 密钥**：需要保留一个最小后端代理。
  - **(c) 暂时是 mock / 未实现**：直接砍掉或保留 mock。

### Step 4.2 按结论处理

**情况 (a)：** 把算法搬到 `app.js`，删除 `/api/pronunciation/evaluate`。
**情况 (b)：** 暂不处理，记入 Phase 7 待办，学员端先把按钮置灰或提示"该功能即将上线"。
**情况 (c)：** 删除路由 + 删除前端调用，UI 临时隐藏。

**✅ 验证**：学员端在纯静态环境下行为符合预期（功能可用 / 优雅降级）。

**🛑 Phase 4 完成提交：`chore: handle pronunciation evaluation in static deployment`**

---

## Phase 5：物理拆分仓库（确认契约后再动）

**前提：Phase 3、4 完成且验证通过。否则不要进入本阶段。**

**目标：拆成两个仓库（或一个 monorepo 的两个目录）。**

### Step 5.1 决定结构（二选一）
- **方案 A：双仓库** —— `japa-flow-admin`（本地用）、`japa-flow-student`（上线用）。
- **方案 B：单仓库双目录** —— `apps/admin/`、`apps/student/`、`packages/shared/`。

**推荐方案 B**：迁移成本低，共享代码方便，部署时只发布 `apps/student/` 的产物。

### Step 5.2 创建目录结构（以方案 B 为例）
```
japa-flow/
├── apps/
│   ├── admin/        # 当前 server.mjs + 管理端 UI + 初始化 scripts
│   └── student/      # index.html + 学员端 app.js + 静态 data/
├── packages/
│   └── shared/       # 学员端 + 管理端共用的类型/工具
└── data-pipeline/    # 管理端产物 → 同步到 apps/student/data/ 的脚本
```

### Step 5.3 迁移文件（一次一类，每次验证）
1. 复制 `index.html`、学员端 `app.js`、`styles.css`、`data/`、`audio/`、`course-assets/` → `apps/student/`。
2. 复制 `server.mjs`、管理端代码、`scripts/` → `apps/admin/`。
3. 暂时**两份代码并存**，根目录保留旧代码作为 fallback。
4. 在 `apps/student/` 下跑 `npx http-server`，验证学员端所有功能。
5. 在 `apps/admin/` 下跑 `node server.mjs`，验证管理端所有功能。
6. 全部通过后再删除根目录的重复文件。

**✅ 验证**：两个 app 独立运行，功能完全等价于 Phase 4 结束时的状态。

### Step 5.4 建立"数据同步管道"
- 写 `data-pipeline/publish.mjs`：把 `apps/admin/data/` 和 `apps/admin/audio/` 同步到 `apps/student/data/` 和 `apps/student/audio/`。
- 命令：`npm run publish`。

**✅ 验证**：在管理端生成新课程 → 跑 `npm run publish` → 学员端能看到新课程。

**🛑 Phase 5 完成提交：`refactor: split into admin and student apps`**

---

## Phase 6：部署学员端（首次上线，仍用本地音频）

**目标：让学员端上线跑起来，音频暂时跟着仓库一起部署（不引入 OSS）。**

### Step 6.1 选择静态托管
- 候选：Nginx（自己的服务器）/ Cloudflare Pages / Vercel。
- 既然你"已经有服务器和域名"，**走自己的 Nginx**。

### Step 6.2 构建产物准备
- `apps/student/` 目录直接就是部署产物，不需要构建。
- 写 `apps/student/.deployignore` 或部署脚本，排除 `*.md`、`debug-*` 等。

### Step 6.3 服务器部署
- 服务器上：
  ```
  /var/www/japa-flow/  ← rsync 同步 apps/student/ 的内容
  ```
- Nginx 配置：
  - root 指向 `/var/www/japa-flow/`
  - HTTPS（Let's Encrypt + certbot）
  - 配置 `.mp3`、`.json` 的长缓存
  - SPA fallback（如果用了前端路由）

### Step 6.4 发布脚本
- 本地：`npm run publish && rsync -avz apps/student/ user@server:/var/www/japa-flow/`。

**✅ 验证**：
- 通过域名访问，学员端所有功能正常（发音评测按 Phase 4 结论行事）。
- 浏览器 Network 面板：所有请求都是静态文件，无 4xx/5xx。
- 麦克风功能在 HTTPS 下可用。

**🛑 Phase 6 完成提交：`feat: deploy student app to production server`**

---

## Phase 7：引入 OSS（仅当音频体量成为问题时）

**触发条件（满足任一才做）：**
- 仓库 audio 目录 > 100 MB
- 发布时间 > 5 分钟
- 服务器带宽 / 磁盘吃紧

**改造步骤：**

### Step 7.1 注册 OSS + 配 CORS
- 阿里云 OSS / Cloudflare R2 / AWS S3 任选。
- Bucket 配置允许学员端域名 GET。

### Step 7.2 管理端加上传逻辑
- 在 `apps/admin/` 的音频生成流程末尾追加：生成 → 上传 OSS → 把 URL 写入 JSON。
- JSON 中音频字段从 `"/audio/xxx.mp3"` 变成 `"https://cdn.xxx.com/audio/xxx.mp3"`。

### Step 7.3 学员端无改动
- 因为 `<audio src>` 用的就是 JSON 里的字段，URL 变了直接生效。

### Step 7.4 历史音频迁移
- 写一次性脚本：扫 `apps/admin/audio/` → 全部上传 → 重写所有 JSON 中的 URL。

**✅ 验证**：
- 学员端音频请求走 CDN，源站零音频流量。
- 旧课程 + 新课程音频都能播。
- 仓库 audio 目录可以删除（保留备份）。

---

## Phase 8（未来）：跨设备进度

**触发条件：** 用户明确表达需求。

按"无注册同步码方案"：用户首次进入随机生成一个长字符串作为身份标识，新设备粘贴即可同步。加 Cloudflare Workers + D1（SQLite），0.5 - 1 天工作量，**不影响学员端架构**。

---

## 给执行模型的关键约束

1. **每个 Step 都要先验证再进入下一步**，禁止跳跃。
2. **每个 Phase 结束必须 git commit**，便于回滚。
3. **Phase 2 引入 ADMIN_MODE 之前不要删任何代码**，只重排。
4. **Phase 5 物理拆分前必须确认 Phase 3 的"纯静态可运行"**。
5. **Phase 7 OSS 是可选的**，不满足触发条件就跳过。
6. 验证步骤失败时**立即停下排查**，不要试图"先继续看看"。
7. 所有文件移动用 `git mv`，保留历史。

---

## 推荐执行顺序速览

```
Phase 0 (10min) → 1 (30min) → 2 (1-2h) → 3 (1-2h) → 4 (30min-2h)
   → 5 (2-3h) → 6 (1-2h) → [上线运行一段时间] → 7 (按需) → 8 (按需)
```

总工作量预估：**1-2 天可上线**（Phase 0-6），OSS 和数据库按需追加。
