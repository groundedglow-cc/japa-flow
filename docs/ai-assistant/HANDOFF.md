# AI 助手 v0.1.10 开发进度 HANDOFF

> 用于换机/中断后续作。读完这一页就能恢复上下文。
> 关联文档：[PRD](../../JapaFlow-PRD-v0.1.10-ai-assistant.md)、[决策记录](./decisions.md)。

最后更新：2026-05-25。

## 1. 一句话现状

PRD v0.1.10 §14 实施顺序 10 步里 **1–7 已完成**（含真机端到端验证），8–10 待做：iOS gate 兜底复核、节流缓存、disclaimer、本地历史持久化、收尾。

## 2. 已完成

| Step | 内容 | 验证 |
|---|---|---|
| 1 | monorepo + `packages/ai-assistant/` 包骨架 | `npm -w @japaflow/ai-assistant run build` 通过，element 入口 gzip ~32KB |
| 2 | server.mjs 接入 `ai` + `@ai-sdk/deepseek`，三接口 `/api/ai/{health,chat,explain}` | curl 全部正确响应，含无 key 时 503 + 友好提示 |
| 3 | `ChatPanel.tsx` 用 `useChat` 接 chat 接口，流式渲染 | 浏览器实测 FAB ↔ Panel 三态切换正常 |
| 4 | FAB + 抽屉式 Chat panel + 上下文徽章 | 同上 |
| 5 | Web Component 包装 `<japa-ai-assistant>` | `dist/element.js` 注册自定义元素，attribute/property 双通道生效 |
| 6 | JapaFlow 主 app 集成（`index.html` 挂载 element + `app.js` 末尾 `syncAIAssistant(route().page)` 同步上下文）；课文/语法/单词/练习/错题集五页都加了 `data-ai-selectable` | 浏览器实测：home 不渲染入口，text/grammar/vocab/exercises/wrongbook 显示 FAB |
| 7 | 选区监听 + 工具条 + 解释卡片（流式 JSON 解析）+ "详细分析"自动注入对话面板并提交 | 浏览器 mock + 真 DeepSeek 联通双验证通过 |
| extra | 真 DeepSeek key 联通测试 | health ok:true，explain/chat 真实流式返回 |
| extra | PRD §15 部署影响清单（nginx/Dockerfile/compose/build 脚本/gitignore） | 已写入 PRD |
| extra | [决策记录](./decisions.md) 落档 | D1–D11 全部对话决策有据可查 |

## 3. 剩余任务（PRD §14 step 8–10）

| Task | 范围 | 提示 |
|---|---|---|
| **iOS gate 复核** | 现在的 `AIAssistant.tsx` 已有 health gate：fetch 失败走 catch → `setHealth({ok:false})` → 入口隐藏。iOS Capacitor 包没有 server，fetch 会失败。**功能已满足**，只需手动 `npm run sync:ios` + Xcode 跑一次 iOS 模拟器确认 FAB 不出现、无 console 报错 | 见 §6 |
| **节流缓存** | 同一 `selection.text + sentenceId` 30 秒内重复点 🔍 不再发请求，直接复用上次 raw/parsed | 新增 `useExplainStream` 的 `cacheKey` 参数；hook 内维护一个 `useRef` 的 Map<key, {raw, parsed, ts}>。30 秒内命中直接 set 状态不发 fetch |
| **disclaimer** | 面板首次打开时一次性提示「你的提问将发送至第三方大模型（DeepSeek），请勿输入隐私信息」，用户确认后存 `japa-ai:disclaimer-acked` | 在 `ChatPanel.tsx` 顶部加一个条件渲染的 banner，按钮点击后 `localStorage.setItem(...)` |
| **本地历史持久化** | useChat 的 `messages` 按 `contextKey` 分桶存 localStorage，限制最近 20 条；面板顶部加「清空当前对话」按钮 | useChat 接 `initialMessages` 从 localStorage 读；用 `onFinish` 回调或一个 useEffect watching `messages` 写回 |
| **错误态文案打磨** | DeepSeek 限流（429）/超时/网络错给具体提示而不是裸 error message | 改 `useChat` 的 `onError`、`ChatPanel.tsx` 的 error 渲染、`useExplainStream.ts` 的 catch 分支 |
| **README/部署 checklist 更新** | 主 README 加一节「AI 助手」说明 env 配置 + 启动命令 | `README.md`（若没有则先创）+ `packages/ai-assistant/README.md` 补完 |
| **`scripts/build-app-dist.mjs` 跑通验证** | 已经在脚本里加了 `copyAIAssistant`，但还没真跑过 `npm run build:app` 验证产物 | 跑一遍看 `app-dist/vendor/ai-assistant/` 是否有 `element.js` + `styles/index.css`，且 `index.html` 路径已 rewrite |
| **commit 并 push** | 当前 working tree 一堆未提交改动（见 §4），换机前最好先 commit 推上去 | 见 §7 commit 建议 |

## 4. 工作区现状（git status）

```
 M .gitignore                                       # +packages/*/dist + packages/*/node_modules
 M JapaFlow-PRD-v0.1.10-ai-assistant.md             # PRD v0.1.10 整篇内容（含 §15 部署清单）
 M app.js                                           # +syncAIAssistant (30 行) + data-ai-selectable 五处
 M index.html                                       # +element script/style/<japa-ai-assistant>
 M package-lock.json                                # npm install 后产物
 M package.json                                     # +workspaces + ai/@ai-sdk/deepseek deps + build:ai-assistant script
 M scripts/build-app-dist.mjs                       # +copyAIAssistant + patchIndexHtml 路径 rewrite
 M server.mjs                                       # +handleAiApi import + 路由分发
 M data/lesson-init/lesson30-*                      # 不在本任务范围，是其他工作残留，不要随便丢
?? docs/                                            # 本文档 + decisions.md
?? packages/                                        # 整个新包
?? server/                                          # AI handlers/prompts
 M .DS_Store                                        # 系统文件，建议 gitignore
```

`.env` 不在 git status 里（已 gitignored），但**必须**有 `DEEPSEEK_API_KEY=...` 一行才能让 AI 入口出现。

## 5. 换机后的环境准备

### 5.1 必装

```bash
# 1. clone 仓库到新机器
git clone git@github.com:tangyefei/japa-flow.git
cd japa-flow

# 2. 切到正在用的分支（当前是 main，但也可能是 split/admin-student）
git checkout main

# 3. 安装依赖（npm workspaces 会同时装根和 packages/ai-assistant）
npm install

# 4. 构建 AI 助手包
npm -w @japaflow/ai-assistant run build
```

### 5.2 配 .env

`.env` 是 gitignored 的，不会带过来。需要手动重建：

```bash
cat > .env <<'EOF'
# Azure Speech Services (用于发音评测)
AZURE_SPEECH_KEY=<从原机器 .env 复制>
AZURE_SPEECH_REGION=eastasia

# MiniMax TTS (仅管理端需要)
MINIMAX_API_KEY=<从原机器 .env 复制>

# DeepSeek (用于课内 AI 助手 /api/ai/*)
DEEPSEEK_API_KEY=<DeepSeek API key>
# DEEPSEEK_BASE_URL=https://api.deepseek.com
# DEEPSEEK_MODEL=deepseek-v4-flash
EOF
```

> 安全提示：DeepSeek key 不要写到任何会 commit 的文件。`.env` 已在 `.gitignore`。

### 5.3 启动

```bash
# 启动 dev server（5173 端口）
npm run dev

# 另开终端跑 AI 包的 watch build（可选，只有改 packages/ai-assistant 才需要）
npm -w @japaflow/ai-assistant run dev
```

打开 http://localhost:5173/lesson/27/text，右下角应该出现蓝色"AI"圆形 FAB。

### 5.4 验证

```bash
# health 应该返回 ok:true
curl http://localhost:5173/api/ai/health
# {"ok":true,"provider":"deepseek","model":"deepseek-v4-flash","baseURL":"https://api.deepseek.com"}

# explain 应该返回流式 JSON
curl -N -X POST http://localhost:5173/api/ai/explain \
  -H "Content-Type: application/json" \
  -d '{"context":{"selection":{"text":"森さんは李さんに北京を案内してもらいました。"}}}'

# chat 同理
curl -N -X POST http://localhost:5173/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"日语「に」表示对象用法是什么"}],"context":{}}'
```

浏览器实操：

1. 进 `/lesson/27/text`，看右下角 FAB
2. 选中一句课文（在「基本课文」tab 下的句子）
3. 选区附近会出现黑色工具条「🔍 解释」「📖 详细分析」
4. 点🔍 → 弹出解释卡片，流式渲染翻译 + 标签
5. 点📖 → 卡片关闭，右下侧边 Chat panel 弹出并自动发了一条「请详细解释这句话的语法和含义：「...」」

## 6. 关键文件位置

| 文件 | 作用 |
|---|---|
| `packages/ai-assistant/src/react/AIAssistant.tsx` | 根组件，health gate + FAB ↔ Panel 切换 + 挂 SelectionLayer |
| `packages/ai-assistant/src/react/ChatPanel.tsx` | useChat + 流式渲染 + seed 自动提交 |
| `packages/ai-assistant/src/react/SelectionLayer.tsx` | 选区监听 + 工具条 + 浮出 ExplainCard |
| `packages/ai-assistant/src/react/ExplainCard.tsx` | popover 卡片，结构化 JSON 流式渲染 |
| `packages/ai-assistant/src/react/hooks/useSelectionAnchor.ts` | 选区 anchor hook（**注意：用 setTimeout 不用 rAF，见 [决策 D8](./decisions.md#d8)**）|
| `packages/ai-assistant/src/react/hooks/useExplainStream.ts` | Vercel AI SDK data-stream 协议解析 |
| `packages/ai-assistant/src/element/index.ts` | Web Component 注册（attribute/property 双通道）|
| `packages/ai-assistant/src/protocol/{types,defaults}.ts` | 框架无关类型 + 常量 |
| `packages/ai-assistant/src/styles/index.css` | 所有样式，`ja-ai-` 前缀，`@layer japa-ai` 包裹 |
| `packages/ai-assistant/vite.config.ts` | preact/compat alias + `process.env.NODE_ENV` define |
| `server/ai/handlers.mjs` | health/chat/explain 三个 handler |
| `server/ai/prompts.mjs` | chat / explain 的 system prompt + user prompt 模板 |
| `app.js:6812-6833` | `syncAIAssistant(currentPage)` + `AI_ASSISTANT_PAGES` 白名单 |
| `index.html` | 挂载点 + element script + styles link |

## 7. 换机前建议 commit

未提交改动很多，建议在换机前先 commit + push。推荐拆两个 commit：

```bash
# 1. 仓库层基础设施改动
git add .gitignore package.json package-lock.json
git commit -m "chore: monorepo workspaces + ai-assistant deps"

# 2. AI 助手实现
git add packages/ server/ index.html app.js server.mjs scripts/build-app-dist.mjs
git add JapaFlow-PRD-v0.1.10-ai-assistant.md docs/
git commit -m "feat(ai-assistant): v0.1.10 chat panel + selection explain card"

git push
```

`data/lesson-init/lesson30-*` 这两个文件不在本任务范围，建议**单独评估**要不要 commit（可能是历史残留）。

## 8. 已知 quirks / 易踩坑

1. **WebKit/Safari 在 split pane / 隐藏 tab 把 `requestAnimationFrame` throttle 到 0Hz**。所以 `useSelectionAnchor` 用 `setTimeout(compute, 16)`。如果你改回 rAF，cmux browser / iOS WKWebView 后台时选区监听会完全失效（fired 但 callback 不跑）。
2. **`process.env.NODE_ENV` 是唯一需要 polyfill 的 Node 引用**。Vite `define` 在 build 时替换为 `"production"`。如果未来引入新依赖出现新的 `process.X` 引用，浏览器会报 `Can't find variable: process`，需要继续扩 define。
3. **`useChat` 的 contextKey 决定历史持久化分桶**。当前没接 localStorage，只在内存。换 lesson 后历史会丢——这是 **task 9 待做的**「本地历史持久化」。
4. **Element bundle 一旦修改要 rebuild**。dev 模式下 `app.js` / `server.mjs` 改动会被 server 即时响应（重启 server 即可），但 `packages/ai-assistant/src/**` 改动**必须**跑 `npm -w @japaflow/ai-assistant run build`（或 `:dev` watch 模式）才会反映到浏览器。
5. **iOS Capacitor 包不能用 AI 助手**。因为没有 server。`scripts/build-app-dist.mjs` 已经把 element bundle 打进 `app-dist/vendor/ai-assistant/`，但 iOS 包加载时 health fetch 会失败 → 入口自动隐藏。这是设计行为，不是 bug。
6. **server.mjs / app.js 有过 git merge marker 残留**（HEAD vs b8fffc9 关于 lessonCatalog 是 4 课还是 48 课）。两边都已选了 HEAD（4 课硬编码）。如果未来 merge 触发又出现 marker，按一致原则同样选 HEAD 一侧即可。
7. **5173 端口被孤儿 server 占住**：开发时如果之前后台 `node server.mjs &` 没被正确 kill，会显示 EADDRINUSE。用 `lsof -ti tcp:5173 | xargs kill` 处理。
8. **DeepSeek 模型 ID** 是 `deepseek-v4-flash`，server 默认值已对，无需 env 覆盖。

## 9. 下一步具体建议

按性价比从高到低：

1. **commit + push 当前进度**（保护已完成工作）。
2. **跑一遍 `npm run build:app`**，验证 `app-dist/vendor/ai-assistant/` 产物正确、`app-dist/index.html` 路径已 rewrite 为 `/vendor/ai-assistant/`。这是 PRD §13「`packages/ai-assistant/` 可独立 build 产出 `dist/`」验收的最后一步。
3. **本地历史持久化**（用户痛点最大，下次打开看不到历史会困惑）。
4. **节流缓存**（避免误触花钱）。
5. **disclaimer**（合规要求）。
6. **iOS 模拟器跑一次**确认 gate 行为。
7. **错误态文案 + README** 收尾。
