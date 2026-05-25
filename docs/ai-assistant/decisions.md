# AI 助手 v0.1.10 决策记录

> 整理自需求澄清阶段的对话。每条决策记录方案、被排除的替代、当时的 tradeoff，以及未来什么情况下应该重新审视。

## D1. 助手交付形态：独立包 vs 内嵌模块

**决策**：在仓内 `packages/ai-assistant/` 以独立 npm 包形式开发（monorepo workspaces），但 v0.1.10 不真 publish 公网。

**被排除的方案**：

- **方案 A：直接写到 `app/ai-assistant/` 子目录**。开发最快，1 周内可交付。但因为没有边界约束，容易随手 `import { state, lesson } from '../app.js'`，把助手跟 JapaFlow 业务数据耦合死，未来抽离极难。
- **方案 B：双包 `@japaflow/ai-assistant-react` + `@japaflow/ai-assistant-element`**。最纯净，每个包职责单一。但维护成本翻倍，JapaFlow 现阶段只用 element 一种消费。

**tradeoff**：

- 比方案 A 多约 +20% 工作量（API 设计、样式隔离、类型导出）。
- 换来一旦出现第二个消费者（小程序、管理后台、外部开源）就能直接复用，且强制了"包不读宿主路由/不读 lesson 数据"的边界——主 app 接入只需要 30 行 `syncAIAssistant`。

**何时重审**：

- 若一年内只有 JapaFlow 一个消费者且没有要发包的需求，可以反向思考是否过度设计（但目前为止 §13 的"主 app 无 React/Preact import"验收已经证明边界确实有用）。
- 真要 publish 时，把 `private: true` 去掉、补 README / CHANGELOG / dist 入 git 即可。

---

## D2. 实现层：Preact + preact/compat vs React vs vanilla

**决策**：Preact 10 + `preact/compat`。Vite 构建时 alias `react`/`react-dom` 到 `preact/compat`，让 `@ai-sdk/react` 的 `useChat` hooks 直接跑在 Preact 之上。

**被排除的方案**：

- **完整 React**：~45KB gzipped。对一个挂件来说太重，挂到课文页加载/解析时间不可接受。
- **完全 vanilla JS（自己写 SSE + DOM diff）**：avoids 任何框架，但 useChat 那套自动管理 messages / abort / stop / reload 的逻辑要全部手撸，与"使用 @ai-sdk/react 等 API，避免手磕"的目标冲突。
- **React 改造整个 app**：成本巨大，不现实。

**tradeoff**：

- Preact bundle ~3KB（vs React ~45KB）。Element 入口 + protocol + 共享 chunk gzip 总和约 32KB，可接受。
- 失去 React concurrent rendering / Suspense for data / Server Component / React Native。对一个 chat widget 这些都不需要。
- `preact/compat` 是 React 兼容层，绝大多数 React-only 第三方库能跑，但少数底层用 React internals 的库不能。`@ai-sdk/react` v1.2/v2 实测兼容。

**何时重审**：

- 如果未来要做 React Native iOS 版（替换 Capacitor WKWebView），需要换成真 React Native 实现。
- 如果 ai-sdk 升级后用了底层 React internals，preact/compat 可能不再兼容，需要重新评估。

---

## D3. 对外消费：Web Component + React 双出口

**决策**：包 `exports` 字段同时暴露 `./element`（Web Component `<japa-ai-assistant>`）和 `./react`（React 组件 `<AIAssistant>`）。JapaFlow 主 app 用 Element 版引入。

**核心区别**（参考 [对话第 12 轮记录](#)）：

| 维度 | npm 前端组件（如 React 组件包） | Web Component |
|---|---|---|
| 用法 | `import { Foo } from 'pkg'` → `<Foo />` 必须在同款框架的 JSX 里 | `customElements.define(...)` → `<japa-ai-assistant>` 直接写 HTML，宿主框架无关 |
| 通信 | props（任何 JS 值） | attribute（字符串）+ property（JS 赋值）+ CustomEvent |
| 样式 | 走宿主约定，有污染风险 | 可选 Shadow DOM 天然隔离 |
| 实现技术 | 必须用宿主框架的渲染机制 | 黑盒，内部可以 React / Preact / Lit / 手撸 DOM |

**为什么 JapaFlow 必须用 Web Component**：主 app 是原生 JS（`index.html` 一个 `<div id="app">` + 6700+ 行手撸 render 函数的 `app.js`），不是 React/Vue，无法 import React 组件。

**tradeoff**：

- 双出口让 React 入口的 bundle 比理想的小，但 Web Component 是 self-contained（preact runtime 内联到 chunk），无法对外 dedupe react 共享。本期 MVP 接受。
- 复杂值（`endpoints`, `getContext`, `enabled`）不能通过 HTML attribute 传，必须用 JS property setter；为此 element/index.ts 暴露了 setter，主 app `syncAIAssistant` 内 `el.endpoints = ...; el.getContext = ...`。

**何时重审**：

- 如果未来要在 React 宿主里复用，可以考虑去掉双出口、只发 React 版（更小、更简单）。
- 若要做 Shadow DOM 隔离（PRD §11.1 风险），element 入口要先处理跨 shadow 选区 API 的事件桥。

---

## D4. 不上 Shadow DOM（MVP）

**决策**：v0.1.10 不开启 Shadow DOM，所有 class 用 `ja-ai-` 前缀 + `@layer japa-ai` 包裹避免被宿主 reset。

**被排除的方案**：

- **Shadow DOM 全封装**：天然样式隔离最强。但选区交互需要跨 shadow boundary 读宿主 `window.getSelection()`，事件桥要专门写，对 MVP 复杂度太高。

**tradeoff**：

- JapaFlow 现有样式已用约定 class（`.text-tab`、`.exercise-box` 等），没有全局 reset 撞我们的前缀，实测无冲突。
- 给外部用户（未来发包）样式隔离会差，但他们一旦撞了可以靠 CSS 变量 `--ja-ai-*` 覆盖，或者自己 wrap 一层。

**何时重审**：

- 若未来要发布到外部、宿主 CSS 不可控（如挂到第三方网站），重新评估 Shadow DOM。
- 若 JapaFlow 本身改造了 CSS reset 撞我们前缀，先用 `@layer` 优先级补救，仍不行再上 Shadow DOM。

---

## D5. AI provider 选型：DeepSeek `deepseek-v4-flash`

**决策**：`@ai-sdk/deepseek` provider，模型 `deepseek-v4-flash`，base URL `https://api.deepseek.com`。

**tradeoff**：

- DeepSeek v4 flash 是用户内部最新模型别名，定价低、推理速度快。
- Vercel AI SDK 的 provider 接口抽象良好，未来切 OpenAI / Anthropic / 通义只需要换 `createDeepSeek` → `createOpenAI` 之类。
- DeepSeek API 与 OpenAI 兼容，response 协议一致；server 端用 `streamText().pipeDataStreamToResponse(res)` 自然适配前端 `useChat`。

**何时重审**：

- 若 DeepSeek 速率限制/可用性出问题，准备一个 fallback provider（OpenAI / 通义）。
- 若 explain 卡片对结构化输出要求更严，可考虑模型 JSON mode（DeepSeek 已支持），把 prompt 里的 JSON 约束改成 SDK 层的 `response_format: { type: "json_object" }`。

---

## D6. 笔记功能：v0.1.10 不做，单独 PRD 处理

**决策**：v0.1.10 不与现有"练习大题笔记"（`app.js:4892` contenteditable + `parseMarkdown`）打通，AI 卡片/对话上**不**加"保存为笔记"按钮。

**讨论过的三个方案**：

| 方案 | 描述 | 优点 | 缺点 |
|---|---|---|---|
| A. 追加到字符串 | AI 回答按 markdown 拼到当前 anchor 笔记末尾 | 改动最小，复用现有编辑器 | 单字段被撑成时间戳分隔的拼接日志，难管理、难删单条、跳不回锚点 |
| B. 升级为列表模型 | 笔记从 string 改成 `[{ id, anchor, source, body, ... }]`，一次到位 | 长期最干净，AI/手工统一模型 | parseMarkdown 撑不住长 markdown；UX 心智变了（从"就地编辑一段"变"列表卡片堆叠"）|
| C. 双轨制 | AI 笔记走全新独立数据结构，手工笔记保持现状 | 短期省事 | 后续合并代价更大；现在数据量小，合并窗口正合适 |

**用户决策**：暂时不做笔记，避免把 AI 助手需求复杂化。具体见 [对话第 8 轮](#)。

**何时重审**：

- 用户开始大量使用 AI 助手后再决定要不要做笔记打通。届时倾向方案 B（一次到位），因为数据量越大迁移成本越高。
- 若要做，需要解决：anchor 稳定性（lesson JSON 重新生成时 ID 漂移问题）、markdown 渲染升级（用 marked.min 或限定 AI 输出 schema）、UX「最近一条置顶 + 直接编辑」保留手工笔记的快捷形态。

---

## D7. 后端 SSE 接口：Vercel AI SDK data stream protocol

**决策**：

- server 用 `streamText({ model, system, messages, ... }).pipeDataStreamToResponse(res)`
- 前端 chat 走 `@ai-sdk/react` 的 `useChat`（自动管理 messages / abort / status）
- 前端 explain 用自写 `useExplainStream` hook（基于 fetch + ReadableStream getReader），解析同一种 data-stream 协议

**协议格式**：每行 `<type>:<json>\n`：
- `f:{"messageId":"..."}` — message metadata
- `0:"<text chunk>"` — text delta（我们只关心这个）
- `e:{...}` — message end usage
- `d:{...}` — done

**为什么 explain 不用 useChat**：explain 不是多轮对话，只是单次结构化输出。用 useChat 要塞 fake message 数组，语义不对。自写 hook 直接读 stream 更清晰。

**tradeoff**：

- 服务端 SSE 流式输出必须配合 nginx `proxy_buffering off`（否则被缓冲成完整响应才下发，破坏流式体验）。详见 PRD §15.1。
- DeepSeek 输出 JSON 时按 token 切分，客户端要累积 raw 后才能 `JSON.parse`，partial JSON 中间状态不可用——card 用 `parsed || raw fallback` 兜底。

---

## D8. WebKit/Safari rAF 在低优先级 pane 被 throttle 到 0Hz

**决策**：useSelectionAnchor 用 `setTimeout(compute, 16)` 防抖，**不要**用 `requestAnimationFrame`。

**Bug 实录**：

- 起初用 `requestAnimationFrame(compute)`。
- 测试时发现 selectionchange listener 注册成功、`scheduled` 被调用、但 `compute` 永远不跑（probe 显示 `computeRuns: 0`）。
- 排查后发现 WebKit/Safari 在「非前台 tab + split pane 区域 + 低优先级 widget」场景下，会把 rAF 完全 pause，frame callback 永不触发。

**tradeoff**：

- setTimeout 在所有浏览器场景下都会触发，没有 rAF 的潜在 throttle。
- 唯一损失是不再跟显示器刷新率对齐——对于一个一闪而过的工具条 popover，无影响。
- Chrome/Firefox 下也按 setTimeout 走，行为一致，易于跨浏览器调试。

---

## D9. Vite library 多入口 + preact 内联

**决策**：vite.config.ts 不外部化任何依赖，所有产物 self-contained。`react`/`react-dom` alias 到 `preact/compat`，preact 完整内联到共享 chunk。`process.env.NODE_ENV` 通过 `define` 在编译时替换为 `"production"`。

**演化过程**：

- 起初想 react 入口外部化 react、element 入口内联 preact，让 React 宿主复用自带 runtime。
- 测试发现：共享 chunk 把 preact 当外部，element 入口加载共享 chunk 时浏览器去 fetch `preact/jsx-runtime` → 404。
- 评估后决定本期 MVP 全部内联 preact——多 ~3KB，但消费者零依赖、零配置。

**tradeoff**：

- React 入口的 bundle 大约 30KB gzip（含 preact runtime），比理想的"宿主提供 react 不打"略胖。
- 但消费者侧极简：`<script type="module" src="...element.js"></script>` 就完了，不用配 import map / 不用装 peer dep。
- 若未来 React 宿主真的需要 dedupe runtime，可以再拆一个 `react-bare` 入口外部化 react——届时再做。

---

## D10. 上下文协议：宿主自采，包不读 lesson 数据

**决策**：包对宿主**只**通过两个 props 接收上下文：

- `getContext(): AIAssistantContext`：每次发送请求时由宿主侧调用，返回任意 JSON。包透传到 server。
- `enabled(ctx): boolean`：宿主决定当前路由是否显示入口。

JapaFlow 主 app 在 `app.js` 末尾的 `syncAIAssistant(currentPage)` 里实现这两个函数，把 `lessonId / lessonTitle / page / tab` 打包成 context。

**为什么不让包自己读宿主路由 / lesson 数据**：

- 包成了"日语学习 widget"而不是"AI chat widget"，复用性骤降。
- 一旦换宿主（小程序、管理后台），lesson schema 不一样，包代码就要改。
- 强制把宿主侧业务知识收拢到一个函数（`syncAIAssistant`）里，比散在助手代码里好维护。

**tradeoff**：

- 主 app 多写 ~30 行胶水代码。可接受。
- 包内部不能做"按 lessonId 缓存历史"这类智能事，但通过 `contextKey` prop（宿主传入的字符串）也能实现"按桶分离历史"。

---

## D11. 部署影响：5 处叠加性修改

**决策**：见 [JapaFlow-PRD-v0.1.10-ai-assistant.md §15](../../JapaFlow-PRD-v0.1.10-ai-assistant.md)。简述：

1. nginx.conf 给 `/api/ai/` 加 `proxy_buffering off`（高优先级，否则流式不可用）
2. Dockerfile runner 阶段 `npm ci --omit=dev --workspaces=false`（避免 workspaces 解析失败）
3. Dockerfile builder 阶段在 `build:app` 前加 `npm -w @japaflow/ai-assistant build`
4. docker-compose.yml 用 `:-` 软默认注入 DeepSeek env（**不**强制，让缺 key 时容器仍能启动）
5. `.dockerignore` 无需改动；`.gitignore` 已添加 `packages/*/dist` 和 `packages/*/node_modules`

**回滚成本**：低。镜像层面回上一版即可；env 层面清掉 `DEEPSEEK_API_KEY` 就关停 AI 但保留其他改动。

**首次发布建议**：先发空 key 镜像（AI 入口隐藏）验证 nginx / Dockerfile / compose 三处改动无 regression，再灌入 `DEEPSEEK_API_KEY` 打开 AI 入口（灰度方式）。
