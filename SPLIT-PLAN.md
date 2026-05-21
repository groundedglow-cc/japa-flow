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

### Step 4.2 用户决策（已敲定）

**用户目标：**
- Web：本地 `npm run dev` 即可，**不部署到服务器，密钥风险不考虑**。
- App：iOS/Android，**离线可用**，覆盖通勤场景。
- 发音评测：**Web 和 App 都要支持**。

**最终策略：**
- Web 端 → 不动 server.mjs，发音评测继续走 `/api/pronunciation/evaluate`。
- App 端 → 前端直连 Azure，密钥内嵌 App 包（仅本人安装，零泄露风险）。
- 统一抽象：在前端添加一个 `evaluatePronunciation()` 函数，运行时根据环境选实现：
  - Web 模式 → POST 到本地 server `/api/pronunciation/evaluate`
  - App 模式 → 用 `@capacitor/http` 直接 POST 到 Azure REST 端点

### Step 4.3 实施步骤

1. **抽取前端发音评测调用**：把 app.js 中 3 处 `fetch("/api/pronunciation/evaluate")` 统一替换为 `evaluatePronunciation(...)` 函数。
2. **加运行时环境检测**：`const IS_NATIVE_APP = !!window.Capacitor?.isNativePlatform?.();`
3. **App 模式实现**：用 `@capacitor/http` 调 `https://${REGION}.stt.speech.microsoft.com/...`，密钥从构建期注入的 `config.js` 读取（该文件在 `.gitignore` 中）。
4. **Web 模式实现**：保留现有 fetch 行为。

**✅ 验证**：
- Web 模式：本地 `npm run dev`，发音评测正常。
- App 模式：稍后在 Phase 5 完成 Capacitor 集成后真机验证。

**🛑 Phase 4 完成提交：`chore: handle pronunciation evaluation in static deployment`**

---

## Phase 5：接入 Capacitor，打包成 iOS/Android App

**前提：Phase 3、4 完成且 Web 端验证通过。**

**目标：用 Capacitor 把学员端打包成可在自己手机上运行的离线 App。**

### Step 5.1 安装 Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android @capacitor/http
npx cap init "JapaFlow" "com.tangyefei.japaflow" --web-dir=app-dist
```

### Step 5.2 准备 App 打包产物目录
- 新建 `app-dist/`，包含纯静态的学员端：
  - `index.html` + `app.js` + `styles.css`
  - `data/`（全部课程 JSON，**含 Phase 3 生成的 catalog.json**）
  - `audio/`（全部音频文件，离线播放）
- 写 `scripts/build-app-dist.mjs`：从仓库根复制所需文件到 `app-dist/`。
- ADMIN_MODE 在 App 包里始终关闭（构建脚本可强制移除/置 false）。

### Step 5.3 注入 Azure 密钥（仅 App 构建）
- 新建 `app-dist-config.local.js`（**`.gitignore`**）：
  ```js
  window.JAPAFLOW_CONFIG = {
    AZURE_SPEECH_KEY: "your-key",
    AZURE_SPEECH_REGION: "eastasia"
  };
  ```
- `index.html` 在 App 构建时引入该文件。
- `app.js` 的 App 模式发音评测从 `window.JAPAFLOW_CONFIG` 读取密钥。

### Step 5.4 添加原生平台
```bash
npx cap add ios       # 需要 macOS + Xcode
npx cap add android   # 需要 Android Studio
```

### Step 5.5 配置原生 HTTP 权限
- `capacitor.config.json` 配置允许 cleartext / HTTPS to Azure 域名。
- iOS 的 `Info.plist` 加 NSMicrophoneUsageDescription（发音评测要录音）。
- Android 的 `AndroidManifest.xml` 加 `RECORD_AUDIO` 权限。

**✅ 验证**：
- `npm run build:app` 产出 `app-dist/`。
- `npx cap sync` 同步到原生项目。
- `npx cap open ios` / `npx cap open android` 打开原生 IDE。

**🛑 Phase 5 完成提交：`feat: integrate capacitor for ios/android packaging`**

---

## Phase 6：构建并安装到本人手机

**目标：把 App 装到自己手机上，离线可用，覆盖通勤场景。**

### Step 6.1 iOS 构建（如果有 Mac）
1. `npm run build:app && npx cap sync ios`
2. `npx cap open ios` 打开 Xcode
3. 配置签名（个人 Apple ID 免费 7 天证书 / 开发者账号永久）
4. 连接 iPhone → Run → 装机
5. iOS 设置 → 通用 → VPN 与设备管理 → 信任开发者证书

### Step 6.2 Android 构建
1. `npm run build:app && npx cap sync android`
2. `npx cap open android` 打开 Android Studio
3. 连接 Android 手机（开启 USB 调试） → Run
4. 或导出 APK → 手机直接安装

### Step 6.3 离线验证（断网测试）
- 飞行模式下：
  - 浏览课程目录 ✓
  - 学习词汇/语法/课文/练习 ✓
  - 播放音频 ✓
  - **发音评测在飞行模式下应失败**（需要 Azure 网络）；连 WiFi/数据后应成功 ✓

**✅ 验证**：
- 自己手机离线能跑学员端核心功能。
- 联网状态下发音评测正常返回评分。
- 关闭 App 重启，进度数据（localStorage）保留。

**🛑 Phase 6 完成提交：`feat: ship app to personal devices`**

---

## Phase 9（推迟）：Web 上线到服务器

仅当未来想让 Web 端也对外可访问时再做。届时需要：
- 选 Phase 4 的 A 方案（最小后端代理）部署发音评测
- Nginx + HTTPS + 静态资源部署
- OSS 视音频体量决定

**当前阶段暂不实施。**

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
