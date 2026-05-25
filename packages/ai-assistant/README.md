# @japaflow/ai-assistant

JapaFlow 课内 AI 学习助手组件包。提供悬浮入口、侧边对话面板、选句解释卡片三件套，供宿主页面以最小集成成本接入。

> 当前版本（v0.1.0）处于 PRD v0.1.10 §14 的 step 1 阶段，仅提供包骨架与 Web Component 容器；完整功能（useChat 流式、选区监听、解释卡片）按 §14 后续步骤交付。

## 安装

仓内通过 npm workspaces 引用：

```json
{
  "workspaces": ["packages/*"]
}
```

```bash
npm install
npm -w @japaflow/ai-assistant run build
```

## 两种消费方式

### 1. React / Preact 宿主

```tsx
import { AIAssistant } from "@japaflow/ai-assistant/react";
import "@japaflow/ai-assistant/styles";

<AIAssistant
  endpoints={{ chat: "/api/ai/chat", explain: "/api/ai/explain", health: "/api/ai/health" }}
  getContext={() => ({ lessonId: 29, page: "text" })}
  contextKey="lesson:29"
/>
```

### 2. 原生 HTML / 任意框架（JapaFlow 主 app 走这条）

```html
<japa-ai-assistant context-key="lesson:29" position="bottom-right"></japa-ai-assistant>

<script type="module">
  import "@japaflow/ai-assistant/element";
  import "@japaflow/ai-assistant/styles";

  const el = document.querySelector("japa-ai-assistant");
  el.endpoints = { chat: "/api/ai/chat", explain: "/api/ai/explain", health: "/api/ai/health" };
  el.getContext = () => ({ lessonId: 29, page: "text" });
  el.enabled = (ctx) => ctx.page !== "home";
</script>
```

## 配置

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `endpoints` | `{chat, explain, health}` | `/api/ai/*` | 后端三接口 |
| `getContext` | `() => object` | `() => ({})` | 宿主侧采集当前上下文 |
| `contextKey` | string | `"default"` | 本地历史分桶键 |
| `enabled` | `(ctx) => boolean` | `() => true` | 是否在当前路由显示入口 |
| `selectionScope` | string | `[data-ai-selectable]` | 选区交互生效的 DOM 选择器 |
| `position` | `bottom-right` \| `bottom-left` | `bottom-right` | FAB 位置 |
| `theme` | `auto` \| `light` \| `dark` | `auto` | 主题 |
| `disclaimer` | string | 内置中文 | 首次打开提示文案 |

## 技术栈

- 实现层：Preact 10 + `preact/compat`（让 `@ai-sdk/react` 的 hooks 直接跑在 Preact 上）
- 流式：`@ai-sdk/react` 的 `useChat`（自动管理 messages / stop / reload）
- 构建：Vite library mode，三入口 `react` / `element` / `protocol`

## 开发

```bash
# 监听构建
npm -w @japaflow/ai-assistant run dev

# 类型检查
npm -w @japaflow/ai-assistant run typecheck
```
