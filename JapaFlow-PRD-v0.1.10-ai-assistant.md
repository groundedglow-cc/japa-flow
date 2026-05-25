# JapaFlow PRD v0.1.10 - 课内 AI 学习助手

## 1. 背景

JapaFlow 当前以"按课次"组织学习：单词预热、语法、课文、练习、错题集、结果、音频。学习者在阅读课文或做语法练习时，常常会冒出一些"一句话能解释完"的疑问：

- 这句话里这个助词为什么用 `に` 不用 `で`？
- 这个语法点和之前学过的 `てくれる` 有什么区别？
- 这个汉字这里读作什么、为什么不读训读？
- 这道练习题为什么我做错了？正确思路是什么？

目前用户只能跳出 app 去查工具书或搜索引擎，体验断裂、上下文丢失。`ai-assistant-qa.md` 已经从产品形态层面给出了"悬浮入口 + 选句弹窗 + 侧边对话面板"的推荐方案。本 PRD 把该方案落到 JapaFlow 当前的工程结构和学习场景，并以**可复用的独立前端包**形式交付，主 app 是首个消费者。

## 2. 目标

v0.1.10 目标是引入一个**贴合课文/语法/练习场景的 AI 学习助手**，做到三层递进体验：

1. **一看即懂**：选中课文中的句子或词，可在原地呼出轻量解释卡片。
2. **一追问就深**：在卡片上一键转入侧边对话面板进行多轮追问。
3. **不问时静默**：助手以悬浮入口形式存在，不打扰主学习流。

工程目标：

- 助手以**独立 npm 包** `@japaflow/ai-assistant` 形式开发，仓内 monorepo 子目录管理，主 app 首个消费。
- 包对外提供两种消费方式：**React 组件**（直接 import）和 **Web Component**（`<japa-ai-assistant>` 标签）。JapaFlow 主 app 是原生 JS，走 Web Component。
- 助手默认带上当前课次上下文（课号、当前所在 tab、当前句子或练习），无需用户重复粘贴。
- 所有 AI 调用走自建 dev server（`server.mjs`）转发，不在前端裸暴露密钥。
- 与现有发音评测、音频生成等能力相互独立，不阻塞主链路。

## 3. 非目标

- 不在本版本接入语音对话（说出去 → AI 回答），只做文本对话。
- 不为助手单独建路由页或入口卡片，助手是"贴在已有页面上的浮层"。
- 不实现自动主动弹窗、自动打断阅读的形式。
- 不替换或下线现有发音评测、音频生成、错题集等能力。
- 不在 v0.1.10 把助手能力接入"课程初始化页"（init 流程目前已有自己的 AI 流水线）。
- 不持久化整段对话到课程数据 JSON；对话历史仅留在本地 storage。
- 不在本版本支持多设备会话同步。
- 不在 v0.1.10 把 `@japaflow/ai-assistant` 真正 `npm publish` 到公网；仅在 monorepo 内部用 path / workspace 引用，等到第二个消费者出现再发包。
- 不与现有「练习大题笔记」打通（已讨论过，单独后续 PRD 处理）。

## 4. 适用场景

助手在以下页面默认可用：

- `/lesson/:id/text`（课文）
- `/lesson/:id/grammar`（语法）
- `/lesson/:id/exercises`（练习）
- `/lesson/:id/wrongbook`（错题集）
- `/lesson/:id/vocab`（单词预热）

在首页 `/`、`/lesson/:id`（导航汇总页）和音频/结果页**不显示**助手入口，避免无意义的浮层。是否显示由宿主通过 `enabled(ctx)` prop 决定，包本身无内置路由判断。

## 5. 用户流程

### 5.1 悬浮入口

- 在适用页面的右下角常驻一个气泡图标（移动端略上移以避开 home indicator）。
- 点击图标，从右侧滑出 **侧边对话面板**：
  - 桌面端：宽 360–420px 的右抽屉，主区不被遮挡。
  - 移动端：从下方上推 70% 视高的半屏抽屉。
- 面板顶部展示当前课次上下文徽章，例如：`第 29 课 · 课文 · 第 4 句`。
- 输入框默认聚焦，支持自由提问。

### 5.2 选句解释

- 用户在课文区或语法例句区拖选/长按选中一段文本（一个词到一整句皆可）。
- 选中结束后，在选区附近浮出一个小工具条，含两枚按钮：
  - `🔍 解释`：调用 AI 生成轻量解释卡片。
  - `📖 详细分析`：直接把该句带入侧边面板深度追问。
- 选区交互只在带 `data-ai-selectable` 属性的子树内生效；落在已有按钮/控件上不触发。宿主负责在课文 / 语法例句的容器上加上该属性。

### 5.3 解释卡片

- 卡片以 popover 形式贴在选区附近，自动避让，不遮挡选中文本。
- 卡片内容分级展示（流式渲染）：
  1. **简明翻译**：中文意思。
  2. **关键点标签**：例如"被动语态 / 助词 `に` / 拟态词"，至多 3 个，点击展开一两句说明。
  3. 底部操作栏：`📖 详细分析` `📋 复制`。
- 关闭条件：点击页面其他区域、按 Esc、滚动主区、再次点击🔍。

### 5.4 卡片 → 对话面板

- 点击 `📖 详细分析` 后：
  1. 若侧边面板未打开，则自动滑出。
  2. 面板输入框自动注入：`请详细解释「<原句>」` + 当前课次/句号上下文。
  3. 自动提交一次，生成多轮可追问的结构化回答。
  4. 对话被记入本地历史。

## 6. 上下文协议

包不会主动读取宿主路由或 lesson 数据，全部通过 `getContext()` prop 由宿主自行采集后注入。包内只看见一个不透明的 JSON。

JapaFlow 主 app 实现的 `getContext()` 返回结构示例：

```json
{
  "appVersion": "0.1.10",
  "lessonId": 29,
  "lessonTitle": "第29课",
  "page": "text",
  "tab": "basic",
  "selection": {
    "text": "森さんは李さんに北京を案内してもらいました。",
    "sentenceId": "s3"
  },
  "userQuestion": "这里为什么用 もらいました 不用 くれました？"
}
```

字段说明（**契约由宿主决定**，包只透传到 server）：

- `selection.text`：用户选中或当前句的原文，宿主侧裁剪到 ≤ 500 字符。
- `selection.sentenceId`：宿主从 DOM 反查 lesson 数据里的句号，便于后续模型基于句子的语法标签做更准确回答。
- `userQuestion`：用户在面板输入框中的提问。

> 不发送整本 lesson JSON。模型上下文窗口和延迟都不允许这样做。仅在用户主动追问"这个语法点和之前哪些课讲的有什么区别"时，再追加当前课的语法点摘要（最多 30 行）。

## 7. 前端实现（独立包）

### 7.1 包结构

仓内 monorepo，新建子目录 `packages/ai-assistant/`。根 `package.json` 改成 npm workspaces：

```json
{
  "workspaces": ["packages/*"]
}
```

包内目录：

```
packages/ai-assistant/
  src/
    react/                  # 真正的实现，Preact + preact/compat
      AIAssistant.tsx       # 根组件，挂上 FAB + 面板 + 选区监听
      FloatingFab.tsx       # 悬浮入口
      ChatPanel.tsx         # 抽屉式聊天面板，useChat
      SelectionLayer.tsx    # 选区监听 + 工具条
      ExplainCard.tsx       # 解释卡片（结构化 JSON 流式）
      ContextBadge.tsx      # 当前上下文徽章
      hooks/
        useSelectionAnchor.ts
        useLocalHistory.ts
        useHealthGate.ts
        useExplainStream.ts
    element/                # Web Component 包装
      index.ts              # 注册 <japa-ai-assistant>
      adapter.ts            # 把 attributes/properties 映射到 React props
    protocol/               # 框架无关
      types.ts              # Context / Message / Health 类型
      defaults.ts           # 默认 endpoints / theme / position
    styles/
      tokens.css            # 主题变量
      index.css             # 组件样式
  package.json              # exports: ./react, ./element, ./protocol
  tsconfig.json
  vite.config.ts            # 构建 element 入口（ESM + IIFE）
  README.md
```

`package.json` 关键字段：

```json
{
  "name": "@japaflow/ai-assistant",
  "private": true,
  "type": "module",
  "exports": {
    "./react":    "./dist/react.js",
    "./element":  "./dist/element.js",
    "./protocol": "./dist/protocol.js",
    "./styles":   "./dist/styles/index.css"
  },
  "dependencies": {
    "preact": "^10.x",
    "@ai-sdk/react": "^1.x"
  },
  "peerDependencies": {
    "react": "*",
    "react-dom": "*"
  },
  "peerDependenciesMeta": {
    "react":     { "optional": true },
    "react-dom": { "optional": true }
  }
}
```

构建配置：在 Vite/tsup 中通过 alias 把 `react` / `react-dom` 指向 `preact/compat`，让 `@ai-sdk/react` 的 `useChat` 在产物中实际跑 Preact。

### 7.2 对外 API

**React 入口**（供未来 React 宿主用）：

```tsx
import { AIAssistant } from "@japaflow/ai-assistant/react";
import "@japaflow/ai-assistant/styles";

<AIAssistant
  endpoints={{
    chat:    "/api/ai/chat",
    explain: "/api/ai/explain",
    health:  "/api/ai/health",
  }}
  getContext={() => ({ lessonId: 29, page: "text", selection: { text, sentenceId } })}
  contextKey="lesson:29"
  enabled={(ctx) => ctx.page !== "home"}
  selectionScope="[data-ai-selectable]"
  position="bottom-right"
  theme="auto"
  disclaimer="AI 解释仅供参考"
/>
```

**Web Component 入口**（JapaFlow 主 app 用）：

```html
<japa-ai-assistant
  context-key="lesson:29"
  position="bottom-right"
  selection-scope="[data-ai-selectable]">
</japa-ai-assistant>

<script type="module">
  import "@japaflow/ai-assistant/element";
  import "@japaflow/ai-assistant/styles";

  const el = document.querySelector("japa-ai-assistant");
  el.endpoints  = { chat: "/api/ai/chat", explain: "/api/ai/explain", health: "/api/ai/health" };
  el.getContext = () => collectContextFromCurrentRoute();
  el.enabled    = (ctx) => ctx.page !== "home";
</script>
```

属性 vs 属性映射规则：

- 字符串类配置（`position`, `theme`, `context-key`, `selection-scope`, `disclaimer`）通过 attribute 提供。
- 复杂值（`endpoints`, `getContext`, `enabled`, `onSaveSnippet`）只能通过 JS property 赋值，无法走 attribute（HTML 属性不能传函数）。

### 7.3 JapaFlow 主 app 集成

`app.js` 不直接引入 React、不直接调用包内组件。它做三件事：

1. 在 `index.html` 加一个固定挂载点：`<japa-ai-assistant id="ja-ai-root"></japa-ai-assistant>`。
2. 在 `app.js` 的 `render()` 末尾调用一个新增的 `syncAIAssistant(route())` 函数，更新 element 的 `getContext` / `enabled`。
3. 在课文容器、语法例句、错题题面等 DOM 节点上加 `data-ai-selectable` 属性。

`syncAIAssistant` 大约 30 行，是 `app.js` 唯一的新增逻辑。

### 7.4 状态管理（包内）

- 对话历史按 `contextKey` 分桶，键 `japa-ai:history:<contextKey>`，存 localStorage。
- 单条消息结构沿用 `@ai-sdk/react` 的 `Message` 类型：`{ id, role, content, createdAt }`。每个 contextKey 保留最近 20 条。
- 用户可在面板顶部菜单点击"清空当前对话"。

### 7.5 流式

- 聊天面板用 `useChat({ api: endpoints.chat })`，自动管理 `messages` / `input` / `isLoading` / `stop` / `reload`。
- 解释卡片用 `useExplainStream`（自写薄 hook，基于 fetch + `getReader` 读 Vercel AI SDK data stream protocol），渲染结构化 JSON。
- 切换页面、关闭面板会触发 `useChat` 的 `stop()`；解释流通过 `AbortController` 取消。

### 7.6 样式与隔离

- v0.1.10 **不**上 Shadow DOM。原因：选区交互需要跨 shadow 读宿主 `window.getSelection()`，事件桥复杂；JapaFlow 现有样式已用约定 class，无明显冲突。
- 包内所有 class 强制 `ja-ai-` 前缀，CSS 用 `@layer japa-ai` 包裹避免被宿主 reset 干扰。
- 暴露 CSS 变量供宿主覆盖：`--ja-ai-color-accent`、`--ja-ai-radius`、`--ja-ai-z-index` 等。

### 7.7 与发音/音频能力的边界

- 助手不调用 TTS。如果未来需要朗读 AI 回复，单独迭代。
- 用户当前播放音频时，打开助手面板不打断音频；助手也不主动暂停音频。

## 8. 后端实现

### 8.1 依赖

`server.mjs` 新增依赖：

```
ai                    # Vercel AI SDK 核心
@ai-sdk/deepseek      # DeepSeek provider
```

### 8.2 新增接口

| 路径 | 方法 | 说明 |
| --- | --- | --- |
| `/api/ai/explain` | POST | 选句轻量解释，返回 Vercel AI SDK data stream。Body: `{ context }` |
| `/api/ai/chat` | POST | 多轮对话，data stream。Body 由 `useChat` 自动发，包含 `messages`，server 端再拼上 `context` 注入 system prompt |
| `/api/ai/health` | GET | 探活，返回 `{ ok, provider, model }` |

实现骨架（伪代码，写在 `server/ai/handlers.mjs`）：

```js
import { createDeepSeek } from "@ai-sdk/deepseek";
import { streamText } from "ai";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";

export async function handleChat(req, res) {
  const { messages, context } = await readJson(req);
  const result = streamText({
    model: deepseek(MODEL),
    system: buildChatSystemPrompt(context),
    messages,
    maxTokens: 1200,
    abortSignal: req.signal,
  });
  result.pipeDataStreamToResponse(res);
}

export async function handleExplain(req, res) {
  const { context } = await readJson(req);
  const result = streamText({
    model: deepseek(MODEL),
    system: buildExplainSystemPrompt(),
    prompt: buildExplainUserPrompt(context),
    maxTokens: 600,
    abortSignal: req.signal,
  });
  result.pipeDataStreamToResponse(res);
}
```

`server.mjs` 主入口的 url 分发部分新增三条路由调用上面三个 handler。

### 8.3 配置项

复用现有 env 注入风格（与 `MINIMAX_API_KEY` 一致，前端不下发）：

```
DEEPSEEK_API_KEY=...                            # 必填，缺失时 health 返回 ok:false
DEEPSEEK_BASE_URL=https://api.deepseek.com      # 可选，便于走代理
DEEPSEEK_MODEL=deepseek-v4-flash                # 可选，默认值即如此
AI_REQUEST_TIMEOUT_MS=30000
AI_RATE_LIMIT_PER_MIN=30
```

- 缺少 `DEEPSEEK_API_KEY` 时，`/api/ai/health` 返回 `{ ok: false }`，前端 `useHealthGate` 命中后入口完全不渲染，控制台打一行 warning。
- 不在 iOS Capacitor 打包产物中走该接口；Capacitor App 端的助手在 v0.1.10 仅支持 dev server 模式（详见 §11 风险）。

### 8.4 Prompt 模板

- **system prompt（explain）**：约束模型只输出 JSON 结构 `{ translation, tags: [{label, detail}], note? }`，便于卡片渲染。利用 DeepSeek 的 JSON mode 或在 prompt 中强约束。
- **system prompt（chat）**：明确身份是"日语学习助手"，要求按学习者水平调整难度，回复中文，必要时给假名。
- 所有 prompt 模板单独放在 `server/ai/prompts.mjs`，便于和模型一起调参。

## 9. 性能与成本

- DeepSeek `deepseek-v4-flash` 走流式输出，目标首字 < 1000ms、整段 < 4s。
- 单次请求 token 上限默认 600（explain）/ 1200（chat），上下文 + 历史合计 ≤ 2K tokens。
- 服务端做简单 in-memory 速率限制：同一 IP 每分钟最多 `AI_RATE_LIMIT_PER_MIN` 次请求，命中限流返回 429 + 友好提示。
- 包内对相同选区做最小本地缓存：同一 `selection.text + selection.sentenceId` 在 30 秒内重复点击 🔍 不再发请求，直接复用上次卡片结果。

## 10. 隐私与合规

- 助手只发送：当前选区文本、当前课号、用户输入。**不发送**用户的发音录音、设备信息等隐私数据。
- 在面板首次打开时展示一次性提示："你的提问将发送至第三方大模型（DeepSeek）以生成回答，请勿输入隐私信息。" 用户点击"知道了"后不再展示（标志位存 `japa-ai:disclaimer-acked`）。
- 默认不上报对话内容到任何分析平台。

## 11. 风险

### 11.1 技术风险

- `app.js` 已 6700+ 行，本版本所有助手代码都在 `packages/ai-assistant/`，主 app 只新增 ~30 行 `syncAIAssistant`，规避继续膨胀。
- iOS Capacitor 打包后无 Node server，助手能力暂不可用。需要在 element 内做 health 探测，`ok:false` 时 FAB 完全不渲染，避免"点了没反应"。
- Web Component 在 iOS WKWebView 兼容性 OK，但 `customElements` polyfill 需要确认是否要打进 bundle（iOS 14+ 原生支持，不需要 polyfill）。
- 选区 popover 在移动端与原生文本选择菜单的冲突需要专门处理（监听 `selectionchange` 而非 `mouseup`，并在工具条出现期间不阻塞原生菜单）。
- Preact 通过 `preact/compat` 跑 `@ai-sdk/react` 已有大量案例，但仍需 smoke test 一次 `useChat` 全功能（流式、stop、reload、错误态）。

### 11.2 产品风险

- AI 解释错误会反过来误导学习者，尤其是助词、敬语、授受动词这种本课重点。需要在解释卡片角标提示"AI 解释，仅供参考"。
- 选句弹窗的"两步操作"可能让习惯划词翻译的用户觉得多余。后续在设置中提供"选中后直接展示解释"的高效模式开关（v0.1.10 不做，留 v0.1.11）。

### 11.3 成本风险

- 高频选句调用会拉高 AI 调用成本。已在 §9 加最小本地缓存。
- 若 dev server 被局域网内多人共享，需要在 README 提醒打开 `AI_RATE_LIMIT_PER_MIN`。

### 11.4 包工程风险

- monorepo 加入会改变 `npm install` 行为，需要更新 README 启动步骤。
- 包构建产物（Vite 出 `dist/`）不入 git，主 app 用 workspace 引用直接消费源码或通过 prebuild。决定：dev 模式直接消费 `src/`（Vite alias），打 iOS 包前跑一次 `npm -w @japaflow/ai-assistant build`。

## 12. MVP 范围

第一阶段只交付以下能力：

1. `packages/ai-assistant/` 包骨架就绪，对外能 `import "@japaflow/ai-assistant/element"` 注册 Web Component。
2. 课文页右下角悬浮气泡，点击展开侧边对话面板（桌面端右抽屉、移动端半屏）。
3. 课文页选中文本后浮出工具条，含 `🔍 解释` 和 `📖 详细分析` 两个按钮。
4. 解释卡片支持流式渲染，并提供"详细分析"跳转到对话面板。
5. 对话面板用 `useChat` 接 `/api/ai/chat`，支持文本提问、流式回答、按 `contextKey` 分桶的本地历史、清空当前对话。
6. `server.mjs` 新增 `/api/ai/explain`、`/api/ai/chat`、`/api/ai/health` 三个端点，基于 `ai` + `@ai-sdk/deepseek`。
7. 缺少 `DEEPSEEK_API_KEY` 时入口完全隐藏，不影响其它学习流程。

不在 MVP：

- 语法页和练习页的选句、错题集追问按钮。
- 高效模式、加入生词本、复制按钮等细节。
- 多 provider 切换、客户端缓存层、对话搜索。
- npm publish 到公网；Shadow DOM 隔离；i18n / 主题切换。

## 13. 验收标准

- 主 app 通过 `<japa-ai-assistant>` Web Component 引入助手，`app.js` 没有任何 React/Preact import。
- 在课文页选中任意一句话，能在 1 秒内浮出工具条，点击解释后 4 秒内出现完整卡片。
- 卡片关闭、面板收起、切换 tab 时正在进行的请求会被取消，不出现"关闭后内容仍在追加"的现象。
- 对话历史在刷新页面后仍能恢复，仅限当前 `contextKey` 的历史。
- 未配置 `DEEPSEEK_API_KEY` 时，所有 AI 入口在前端完全不渲染，控制台仅一行 warning，不影响其它页面功能。
- 在 iOS Capacitor 打包产物中打开 app，不会出现 AI 入口或与之相关的报错。
- `/api/ai/health` 返回 `{ ok, provider: "deepseek", model: "deepseek-v4-flash" }`。
- `packages/ai-assistant/` 可独立 `npm -w @japaflow/ai-assistant build` 产出 `dist/`，无外部依赖于 JapaFlow 主仓代码。

## 14. 推荐实施顺序

1. **改 monorepo**：根 `package.json` 加 `workspaces`，新建 `packages/ai-assistant/` 骨架（`package.json`、`tsconfig`、`vite.config.ts`、空 `src/react/AIAssistant.tsx`），跑通空白 build。
2. **后端打底**：`server.mjs` 接入 `ai` + `@ai-sdk/deepseek`，加 `/api/ai/health`，验证 env 注入和 DeepSeek 联通性。
3. **跑通 useChat**：在 `AIAssistant` 内做一个最小化全屏 chat，`/api/ai/chat` 返回 data stream，确认 Preact + preact/compat 下 `useChat` 流式无问题。
4. **悬浮入口 + 抽屉面板**：把全屏 chat 收进右抽屉，加 FAB 入口、上下文徽章、本地历史。
5. **Web Component 包装**：`element/index.ts` 注册 `<japa-ai-assistant>`，attribute / property 映射，确认在原生 HTML 页面里也能跑。
6. **JapaFlow 集成**：`index.html` 挂 element，`app.js` 加 `syncAIAssistant`，课文 DOM 加 `data-ai-selectable`，先只在课文页显示。
7. **选区 + 解释卡片**：`SelectionLayer` + `ExplainCard` + `/api/ai/explain` + `useExplainStream`，打通"卡片 → 详细分析"自动注入面板的链路。
8. **iOS 兜底**：在 element 里加 health gate，确认 Capacitor 打包后入口不渲染。
9. **打磨**：节流缓存、错误态、disclaimer、清空对话按钮、移动端样式。
10. v0.1.10 收尾，把 §12 「不在 MVP」清单排进 v0.1.11 候选。

## 15. 部署影响清单

当前生产环境通过 docker + nginx 部署（多阶段 Dockerfile + `docker-entrypoint.sh` 同时跑 nginx 静态 + `node server.mjs`，`docker-compose.yml` 注入 env）。本 PRD 实施会触发 5 处发布链路相关改动，全部为叠加性修改，**缺 `DEEPSEEK_API_KEY` 时 AI 入口自动隐藏，其余功能零影响**。

### 15.1 nginx.conf：必须给 `/api/ai/` 关 buffering（高优先级）

现有 `location /api/` 反代到 `127.0.0.1:5173`，**未关 `proxy_buffering`**。流式 SSE / data stream 会被缓冲成完整响应才下发，`useChat` 看到的是"等很久 → 一下子全出来"，流式体验破坏。

在原 `/api/` 之前新增更精确的 location：

```nginx
location /api/ai/ {
  proxy_pass http://127.0.0.1:5173;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header Connection '';
  proxy_buffering off;
  proxy_cache off;
  proxy_read_timeout 300s;
  chunked_transfer_encoding off;
}
```

其他接口不动。

### 15.2 Dockerfile runner 阶段：workspaces 解析（高优先级）

monorepo 化后根 `package.json` 多 `"workspaces": ["packages/*"]`。runner 阶段当前是：

```dockerfile
COPY --from=builder /app/server.mjs /app/package.json /app/package-lock.json /app/.npmrc ./
RUN npm ci --omit=dev
```

`npm ci` 会去找 `packages/ai-assistant/package.json`，**找不到会失败**。

**采用方案**：runner 改成 `npm ci --omit=dev --workspaces=false`，只装根 deps。`ai-assistant` 的依赖（preact 等）只 builder 用，runner 用不到，省镜像体积。

### 15.3 Dockerfile builder 阶段：多一步包构建（中）

`npm run build:app` 之前先 build ai-assistant：

```dockerfile
RUN npm -w @japaflow/ai-assistant build && npm run build:app
```

并修改 `scripts/build-app-dist.mjs` 把 `packages/ai-assistant/dist/` 下的 Web Component bundle 拷进 `app-dist/vendor/ai-assistant/`。脚本改动，非 Dockerfile 改动。

### 15.4 docker-compose.yml：注入 DeepSeek env（中）

加四行，全部用 `:-` 软默认，**不像 `AZURE_SPEECH_KEY:?` 那样强制**，让没配 key 时 compose 仍能启动：

```yaml
environment:
  AZURE_SPEECH_KEY: ${AZURE_SPEECH_KEY:?AZURE_SPEECH_KEY is required}
  AZURE_SPEECH_REGION: ${AZURE_SPEECH_REGION:?AZURE_SPEECH_REGION is required}
  DEEPSEEK_API_KEY: ${DEEPSEEK_API_KEY:-}
  DEEPSEEK_MODEL: ${DEEPSEEK_MODEL:-deepseek-v4-flash}
  DEEPSEEK_BASE_URL: ${DEEPSEEK_BASE_URL:-https://api.deepseek.com}
  AI_RATE_LIMIT_PER_MIN: ${AI_RATE_LIMIT_PER_MIN:-30}
```

完全不配 `DEEPSEEK_API_KEY` 时，老镜像换新镜像后所有现有功能照常，只是 AI 入口不显示——干净的灰度方式。

### 15.5 .dockerignore：放行 packages（小）

当前 `.dockerignore` 未排除 `packages/`，无需改动。仅需确认 `packages/*/node_modules` 和 `packages/*/dist` 不入 git（由 `.gitignore` 处理）。

### 15.6 不会受影响的部分

- 现有端口映射 `8091:80` 不变。
- `docker-entrypoint.sh` 不动。
- Azure Speech / Minimax / 课程数据 / 音频生成流程零改动。
- iOS Capacitor 包：ai-assistant bundle 合进静态产物增加约 50–80KB；运行时 health gate 探测失败 → 入口不渲染，老 iOS 用户无感。

### 15.7 回滚与运行期风险

- **回滚成本**：低。镜像层面回滚到上一版本镜像即可；env 层面把 `DEEPSEEK_API_KEY` 清掉就关停 AI 功能但保留其它代码变更。
- **运行期主要风险**：nginx buffering 漏改 → 流式不可用但接口可用，用户体验差但不会 500。
- **构建期主要风险**：runner 的 `npm ci` 与 workspaces 互踩 → 镜像构建失败但**不会污染线上**（构建失败就不部署）。
- **首次发布建议**：先发空 key 镜像（AI 入口隐藏）验证 nginx / Dockerfile / compose 三处改动无 regression，再灌入 `DEEPSEEK_API_KEY` 打开 AI 入口。
