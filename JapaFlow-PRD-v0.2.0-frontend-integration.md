# JapaFlow 前端集成改造方案

> 前提：Java API 已按 `JapaFlow-PRD-v0.2.0-learning-progress-api.md` 实现完毕。本文档说明前端 `app.js` 需要做的所有改造。

---

## 1. 核心设计原则

### 1.1 双模式存储

用户可能处于两种状态：

| 状态 | 存储方式 | 触发条件 |
|---|---|---|
| **未登录 / 拒绝登录** | 仅 localStorage（行为与现在完全一致） | 无 token，或用户主动选择"暂不登录" |
| **已登录** | API 优先，localStorage 作为缓存 | token 存在且有效 |

原则：**已登录时写操作同时写 API + localStorage，读操作优先从 localStorage 取（已被 API 数据填充过）。**

### 1.2 401 处理流程

任何 API 返回 401 时，不直接跳登录页，而是弹窗询问：

```
┌────────────────────────────────────────────┐
│  登录后可跨设备同步学习数据。               │
│  是否前往登录？                             │
│                                            │
│  [ 前往登录 ]         [ 暂不需要 ]          │
└────────────────────────────────────────────┘
```

- **前往登录**：跳转 `groundedglow.cc/login?redirect=...` 或通知父窗口
- **暂不需要**：设置 `sessionStorage.setItem('japaflow:skipAuth', '1')`，本次会话不再弹窗，所有写操作仅走 localStorage

---

## 2. 新增模块：`api.js` — API 通信层

新建独立文件 `api.js`，封装所有后端调用。`app.js` 通过 `import` 引入。

### 2.1 基础设施

```js
// api.js

const API_BASE = '/api/japaflow';

// ---- 认证状态 ----

function getToken() {
  return localStorage.getItem('light_blog_token') || '';
}

function isLoggedIn() {
  return Boolean(getToken());
}

function hasSkippedAuth() {
  return sessionStorage.getItem('japaflow:skipAuth') === '1';
}

// 是否应该调用 API（已登录 且 未跳过认证）
function shouldSync() {
  return isLoggedIn() && !hasSkippedAuth();
}

// ---- 请求封装 ----

async function request(method, path, body = null) {
  const headers = { 'Authorization': `Bearer ${getToken()}` };
  if (body !== null) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== null ? JSON.stringify(body) : undefined
  });

  if (res.status === 401) {
    handleAuthExpired();
    return null; // 调用方需判断 null
  }

  if (!res.ok) {
    console.warn(`[API] ${method} ${path} → ${res.status}`);
    return null;
  }

  const json = await res.json();
  return json.code === 0 ? json.data : null;
}

// ---- 401 处理 ----

let authPromptShown = false;

function handleAuthExpired() {
  localStorage.removeItem('light_blog_token');
  localStorage.removeItem('light_blog_user');

  if (authPromptShown || hasSkippedAuth()) return;
  authPromptShown = true;

  // 通过 app.js 暴露的 showAuthPrompt() 弹出 UI
  // 具体实现见第 3 节
  if (typeof window.japaflowShowAuthPrompt === 'function') {
    window.japaflowShowAuthPrompt();
  }
}
```

### 2.2 各业务 API 方法

```js
// ---- 全量同步 ----

export async function fetchAllProgress() {
  return request('GET', '/progress/export');
}

export async function uploadAllProgress(lessons) {
  return request('POST', '/progress/import', { lessons });
}

// ---- 单词 ----

export async function syncWordLearning(lessonId, wordId, data) {
  return request('PUT', `/lessons/${lessonId}/words/${wordId}`, data);
}

export async function syncResetWords(lessonId) {
  return request('DELETE', `/lessons/${lessonId}/words`);
}

// ---- 语法 ----

export async function syncGrammarPractice(lessonId, grammarId, exampleIndex, data) {
  return request('PUT', `/lessons/${lessonId}/grammar/${grammarId}/${exampleIndex}`, data);
}

// ---- 课文句子 ----

export async function syncSentencePractice(lessonId, sentenceId, data) {
  return request('PUT', `/lessons/${lessonId}/sentences/${sentenceId}`, data);
}

// ---- 练习 ----

export async function syncExerciseResult(lessonId, exerciseId, data) {
  return request('POST', `/lessons/${lessonId}/exercises/${exerciseId}`, data);
}

export async function syncResetExercises(lessonId) {
  return request('DELETE', `/lessons/${lessonId}/exercises`);
}

// ---- 错题 ----

export async function syncWrongBook(lessonId, itemType, itemId, data) {
  return request('POST', `/lessons/${lessonId}/wrong-book`, { itemType, itemId, ...data });
}

export async function syncResolveWrongItem(lessonId, itemType, itemId) {
  return request('PUT', `/lessons/${lessonId}/wrong-book/${itemType}/${itemId}/resolve`);
}

// ---- 交互进度 ----

export async function syncInteractionProgress(lessonId, itemType, itemId, data) {
  return request('PUT', `/lessons/${lessonId}/interaction-progress/${itemType}/${itemId}`, data);
}

// ---- 学习时长 ----

export async function syncStudyTime(lessonId, module, deltaMs, activeAt) {
  return request('POST', `/lessons/${lessonId}/study-time/${module}`, { deltaMs, activeAt });
}

// ---- 收藏 ----

export async function syncAddFavorite(lessonId, itemType, itemId, snapshot) {
  return request('POST', `/lessons/${lessonId}/favorites`, { itemType, itemId, snapshot });
}

export async function syncRemoveFavorite(lessonId, itemType, itemId) {
  return request('DELETE', `/lessons/${lessonId}/favorites/${itemType}/${itemId}`);
}

// ---- 偏好 ----

export async function syncPreference(lessonId, data) {
  return request('PUT', `/lessons/${lessonId}/preferences`, data);
}

// ---- 进度总览 ----

export async function fetchProgressSummary(lessonIds) {
  const qs = lessonIds ? `?lessonIds=${lessonIds.join(',')}` : '';
  return request('GET', `/progress/summary${qs}`);
}
```

---

## 3. app.js 改造清单

### 3.1 引入 API 层

```js
// app.js 顶部
import * as api from './api.js';
```

---

### 3.2 改造 `write()` — 统一写入入口

当前 `write()` 仅写 localStorage。改造后在已登录状态下同时异步调 API，API 失败不阻塞 UI。

**改造前：**
```js
function write(key, value) {
  localStorage.setItem(`japaflow:${key}`, JSON.stringify(value));
}
```

**改造后：**
```js
function write(key, value) {
  localStorage.setItem(`japaflow:${key}`, JSON.stringify(value));
  scheduleApiSync(key, value);
}
```

`scheduleApiSync` 是新增的分发函数，根据 key 模式路由到对应 API 方法（见 3.3）。

---

### 3.3 新增 `scheduleApiSync()` — 写操作分发

```js
const syncTimers = {};
const SYNC_DEBOUNCE_MS = 2000;

function scheduleApiSync(key, value) {
  if (!api.shouldSync()) return;

  // debounce：同一个 key 2 秒内只发一次请求
  clearTimeout(syncTimers[key]);
  syncTimers[key] = setTimeout(() => dispatchSync(key, value), SYNC_DEBOUNCE_MS);
}

function dispatchSync(key, value) {
  const m = key.match(/^lesson:(\d+):(.+)$/);
  if (!m) return;
  const [, lessonId, dataKey] = m;

  switch (dataKey) {
    case 'wordLearning':
      // 批量：遍历 value 中每个 wordId 逐条同步
      Object.entries(value || {}).forEach(([wordId, data]) => {
        api.syncWordLearning(lessonId, wordId, data);
      });
      break;

    case 'grammarPractice':
      Object.entries(value || {}).forEach(([compositeKey, data]) => {
        // compositeKey 格式: "g1_0", "g2_1"
        const [grammarId, exIdx] = compositeKey.split('_');
        api.syncGrammarPractice(lessonId, grammarId, exIdx ?? 0, data);
      });
      break;

    case 'sentencePractice':
      Object.entries(value || {}).forEach(([sentenceId, data]) => {
        api.syncSentencePractice(lessonId, sentenceId, data);
      });
      break;

    case 'exerciseResults':
      (value || []).forEach((result) => {
        api.syncExerciseResult(lessonId, result.exerciseId, result);
      });
      break;

    case 'wrongBook':
      Object.entries(value || {}).forEach(([exerciseId, data]) => {
        if (data.status === 'resolved') {
          api.syncResolveWrongItem(lessonId, 'exercise', exerciseId);
        } else {
          api.syncWrongBook(lessonId, 'exercise', exerciseId, { wrongDetail: data });
        }
      });
      break;

    case 'interactionProgress':
      ['words', 'sentences', 'grammarExamples'].forEach((type) => {
        Object.entries(value?.[type] || {}).forEach(([itemId, data]) => {
          api.syncInteractionProgress(lessonId, type.replace(/s$/, ''), itemId, data);
        });
      });
      break;

    case 'currentVoiceId':
      api.syncPreference(lessonId, { currentVoiceId: value });
      break;
    case 'playbackRate':
      api.syncPreference(lessonId, { playbackRate: value });
      break;
    case 'vocabFocusOnly':
      api.syncPreference(lessonId, { vocabFocusOnly: value });
      break;
    case 'currentExerciseGroup':
      api.syncPreference(lessonId, { currentExerciseGroup: value });
      break;
    case 'textCurrentTab':
      api.syncPreference(lessonId, { textCurrentTab: value });
      break;

    // 以下 key 仅本地有意义，不同步到服务端
    case 'wordProgress':           // 冗余字段，由 wordLearning 覆盖
    case 'exerciseGroupAnswers':   // 临时草稿
    case 'exerciseGroupSubmitted': // 临时标记
    case 'vocabTestQueue':         // 临时队列
    case 'currentVocabTest':       // 临时索引
    case 'textCurrentSentenceByTab': // 临时游标
    case 'textPromptLanguage':     // 临时偏好
    case 'audioVersions':          // 管理端数据
    case 'exerciseGroupNotes':     // 本地笔记
      break;

    default:
      // 未识别的 key，跳过
      break;
  }
}
```

---

### 3.4 改造 `settleStudyTimer()` — 学习时长增量同步

**改造点**：在写入 localStorage 后，额外调用增量 API。

```js
// settleStudyTimer 中，writeStudyTime 之后新增：
if (api.shouldSync()) {
  api.syncStudyTime(
    studySession.lessonId,
    studySession.module,
    elapsed,
    new Date(studySession.lastActiveAt).toISOString()
  );
}
```

> 注意：学习时长使用增量累加（`deltaMs`），不走 `scheduleApiSync` 的全量分发。需在 `dispatchSync` 的 `switch` 中将 `studyTime` case 设为空（`break`），防止重复。

---

### 3.5 改造 `toggleFavorite()` — 收藏同步

**改造点**：在 `writeLessonFavorites` 之后，调用收藏 API。

```js
function toggleFavorite(type, item, lessonIdValue = lesson.id) {
  const favorites = lessonFavorites(lessonIdValue);
  const key = favoriteTypeKey(type);
  const id = item.id;
  const isRemoving = Boolean(favorites[key][id]);

  if (isRemoving) {
    delete favorites[key][id];
  } else {
    favorites[key][id] = type === 'sentence'
      ? sentenceFavoriteSnapshot(item)
      : wordFavoriteSnapshot(item);
  }
  writeLessonFavorites(lessonIdValue, favorites);

  // ---- 新增：API 同步 ----
  if (api.shouldSync()) {
    if (isRemoving) {
      api.syncRemoveFavorite(lessonIdValue, type, id);
    } else {
      api.syncAddFavorite(lessonIdValue, type, id, favorites[key][id]);
    }
  }
}
```

> 收藏是添加/删除两种语义，不适合走 `write()` 的通用 debounce 分发，所以在 `toggleFavorite` 内直接调用。需在 `dispatchSync` 中将 `favorites` case 设为空（`break`），防止重复。

---

### 3.6 改造 `resetWordLearningData()` — 重置同步

```js
function resetWordLearningData(shouldRender = true) {
  // ... 原有 removeStored / state 重置逻辑 ...

  // ---- 新增 ----
  if (api.shouldSync()) {
    api.syncResetWords(lesson.id);
  }

  if (shouldRender) render();
}
```

同理，`resetTextLearningData()` 中 `removeStored` 之后如需同步句子练习重置，也调用对应 API。

---

### 3.7 改造 `exportLearningData()` / `importLearningData()`

已登录时，导出/导入走 API；未登录时保留原 JSON 文件方式。

```js
async function exportLearningData() {
  if (api.shouldSync()) {
    const data = await api.fetchAllProgress();
    if (!data) { window.alert('导出失败，请重试。'); return; }
    downloadJson({
      app: 'JapaFlow', type: 'learning-progress', version: 2,
      exportedAt: new Date().toISOString(),
      lessons: data.lessons
    }, `japaflow-progress-${new Date().toISOString().slice(0, 10)}.json`);
    return;
  }
  // 原有 localStorage 导出逻辑（保持不变）
  // ...
}

async function importLearningData(file) {
  // 原有文件解析逻辑（保持不变）
  // ...

  if (api.shouldSync()) {
    const result = await api.uploadAllProgress(payload.lessons || convertV1ToV2(payload.entries));
    if (!result) { window.alert('导入失败，请重试。'); return; }
    window.alert('学习数据已导入，页面将刷新。');
    location.reload();
    return;
  }
  // 原有 localStorage 导入逻辑（保持不变）
  // ...
}
```

---

## 4. 登录态变化处理

### 4.1 监听 auth-bridge 消息

在 `auth-bridge.js` 的 `AUTH_SYNC` 处理中，当新 token 到来时触发登录后流程。

**改造 `auth-bridge.js`**：

```js
window.addEventListener('message', function (e) {
  if (e.origin !== MAIN_APP_URL) return;
  if (e.data && e.data.type === 'AUTH_SYNC') {
    var wasLoggedIn = Boolean(localStorage.getItem(TOKEN_KEY));
    if (e.data.token) {
      localStorage.setItem(TOKEN_KEY, e.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(e.data.user));
      // ---- 新增：通知 app.js 登录态变化 ----
      if (!wasLoggedIn) {
        window.dispatchEvent(new CustomEvent('japaflow:auth-changed', { detail: { loggedIn: true } }));
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
});
```

### 4.2 app.js 监听登录态变化

```js
window.addEventListener('japaflow:auth-changed', (e) => {
  if (!e.detail.loggedIn) return;
  sessionStorage.removeItem('japaflow:skipAuth');
  checkLocalDataMigration();
});
```

---

## 5. 本地数据迁移面板

### 5.1 触发时机

当以下条件**同时满足**时显示迁移面板：

1. 用户刚完成登录（`japaflow:auth-changed` 事件触发）
2. localStorage 中存在 `japaflow:lesson:*` 数据
3. 本次会话未处理过迁移（`sessionStorage.getItem('japaflow:migrationHandled') !== '1'`）

### 5.2 检查逻辑

```js
function hasLocalLearningData() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('japaflow:lesson:')) return true;
  }
  return false;
}

async function checkLocalDataMigration() {
  if (sessionStorage.getItem('japaflow:migrationHandled') === '1') return;
  if (!api.isLoggedIn()) return;
  if (!hasLocalLearningData()) {
    // 无本地数据，直接从服务端拉取
    await pullServerData();
    return;
  }
  showMigrationPanel();
}
```

### 5.3 迁移面板 UI

在 `modal()` 系统中新增一种 modal 类型：

```html
<div class="dialog-backdrop">
  <article class="panel dialog migration-dialog">
    <h2>发现本地学习数据</h2>
    <p>当前设备上有未同步的学习记录。是否将这些数据上传到云端？</p>

    <div class="migration-summary">
      <!-- 展示本地数据概要 -->
      <ul>
        <li>第27课：单词 40/52 已掌握，语法 5/8 已完成</li>
        <li>第28课：单词 20/45 已掌握</li>
        <!-- ... -->
      </ul>
    </div>

    <div class="migration-actions">
      <button class="primary" data-migration="upload">
        上传本地数据到云端
      </button>
      <button class="secondary" data-migration="discard">
        丢弃本地数据，使用云端数据
      </button>
      <button class="text-button" data-migration="skip">
        稍后处理
      </button>
    </div>
  </article>
</div>
```

### 5.4 迁移操作实现

```js
function showMigrationPanel() {
  const localSummary = buildLocalDataSummary(); // 遍历 localStorage 构建概要
  state.modal = { type: 'migration', localSummary };
  render();
}

async function handleMigration(action) {
  if (action === 'upload') {
    // 1. 收集 localStorage 数据，转换为 API 格式
    const lessons = collectLocalProgressForUpload();
    // 2. 调用导入接口
    const result = await api.uploadAllProgress(lessons);
    if (!result) {
      window.alert('上传失败，请稍后重试。');
      return;
    }
    // 3. 清除本地 localStorage 学习数据
    clearLocalLearningData();
    // 4. 从服务端拉取最新数据回填 localStorage
    await pullServerData();
    window.alert('数据已同步到云端。');
  }

  if (action === 'discard') {
    const ok = window.confirm('确定丢弃本地数据吗？此操作不可恢复。');
    if (!ok) return;
    clearLocalLearningData();
    await pullServerData();
  }

  if (action === 'skip') {
    // 仅标记本次会话已处理，下次登录仍会提醒
  }

  sessionStorage.setItem('japaflow:migrationHandled', '1');
  state.modal = null;
  render();
}
```

### 5.5 辅助函数

```js
// 从服务端拉取全量数据，写入 localStorage
async function pullServerData() {
  const data = await api.fetchAllProgress();
  if (!data?.lessons) return;

  Object.entries(data.lessons).forEach(([lessonId, lessonData]) => {
    if (lessonData.wordLearning)
      write(`lesson:${lessonId}:wordLearning`, lessonData.wordLearning);
    if (lessonData.grammarPractice)
      write(`lesson:${lessonId}:grammarPractice`, lessonData.grammarPractice);
    if (lessonData.sentencePractice)
      write(`lesson:${lessonId}:sentencePractice`, lessonData.sentencePractice);
    if (lessonData.exerciseResults)
      write(`lesson:${lessonId}:exerciseResults`, lessonData.exerciseResults);
    if (lessonData.wrongBook)
      write(`lesson:${lessonId}:wrongBook`, lessonData.wrongBook);
    if (lessonData.interactionProgress)
      write(`lesson:${lessonId}:interactionProgress`, lessonData.interactionProgress);
    if (lessonData.studyTime)
      write(`lesson:${lessonId}:studyTime`, lessonData.studyTime);
    if (lessonData.favorites)
      write(`lesson:${lessonId}:favorites`, lessonData.favorites);
    if (lessonData.preferences) {
      const p = lessonData.preferences;
      if (p.currentVoiceId) write(`lesson:${lessonId}:currentVoiceId`, p.currentVoiceId);
      if (p.playbackRate) write(`lesson:${lessonId}:playbackRate`, p.playbackRate);
    }
  });

  // 拉取数据后的 write() 也会触发 scheduleApiSync，
  // 但因为数据本身来自服务端，不会产生实际变更。
  // 为避免无效请求，pullServerData 期间临时禁用 sync。
}

// 清除本地 japaflow 学习数据
function clearLocalLearningData() {
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('japaflow:lesson:')) toRemove.push(key);
  }
  toRemove.forEach((key) => localStorage.removeItem(key));
}

// 收集本地数据转换为上传格式
function collectLocalProgressForUpload() {
  const lessons = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const m = key?.match(/^japaflow:lesson:(\d+):(.+)$/);
    if (!m) continue;
    const [, lessonId, dataKey] = m;
    if (!lessons[lessonId]) lessons[lessonId] = {};
    try {
      lessons[lessonId][dataKey] = JSON.parse(localStorage.getItem(key));
    } catch { /* skip */ }
  }
  return lessons;
}
```

---

## 6. 启动流程改造

当前 `app.js` 启动后直接渲染。改造后增加一个初始化步骤：

```js
// app.js 启动入口
async function boot() {
  // 1. 渲染 UI（不阻塞，立刻使用 localStorage 数据渲染）
  render();
  bindEvents();

  // 2. 异步检查登录态 & 数据同步
  if (api.isLoggedIn() && !api.hasSkippedAuth()) {
    await checkLocalDataMigration();
    // 迁移完成后用最新数据重新渲染
    reloadLessonScopedState();
    render();
  }
}

boot();
```

> 关键：首次渲染不等 API，保证离线可用。同步完成后静默刷新 state。

---

## 7. 401 登录引导弹窗

### 7.1 触发

`api.js` 中 `handleAuthExpired()` 调用 `window.japaflowShowAuthPrompt()`。

### 7.2 实现

```js
// app.js 中注册
window.japaflowShowAuthPrompt = function () {
  state.modal = { type: 'authPrompt' };
  render();
};
```

Modal 模板：

```html
<div class="dialog-backdrop">
  <article class="panel dialog auth-dialog">
    <h2>登录以同步学习数据</h2>
    <p>登录后，你的学习进度可以在多个设备间同步。</p>
    <div class="button-row">
      <button class="primary" data-auth-action="login">前往登录</button>
      <button class="secondary" data-auth-action="skip">暂不需要</button>
    </div>
  </article>
</div>
```

事件处理：

```js
// bindEvents 中新增
app.querySelector('[data-auth-action="login"]')?.addEventListener('click', () => {
  const MAIN_APP_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://groundedglow.cc';
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'AUTH_EXPIRED' }, MAIN_APP_URL);
  } else {
    window.location.href = MAIN_APP_URL + '/login?redirect=' + encodeURIComponent(window.location.href);
  }
  state.modal = null;
  render();
});

app.querySelector('[data-auth-action="skip"]')?.addEventListener('click', () => {
  sessionStorage.setItem('japaflow:skipAuth', '1');
  state.modal = null;
  render();
});
```

---

## 8. pullServerData 防回写

`pullServerData()` 调用 `write()` 回填 localStorage 时，会触发 `scheduleApiSync` 把数据再写回服务端（无意义的回写）。需加一个全局开关：

```js
let suppressApiSync = false;

function scheduleApiSync(key, value) {
  if (suppressApiSync) return;
  if (!api.shouldSync()) return;
  // ... 原逻辑
}

async function pullServerData() {
  suppressApiSync = true;
  try {
    // ... 写入 localStorage
  } finally {
    suppressApiSync = false;
  }
}
```

---

## 9. 改动文件清单

| 文件 | 改动类型 | 说明 |
|---|---|---|
| `api.js` | **新建** | API 通信层，所有后端调用 |
| `app.js` | 改造 | `write()`、启动流程、导出导入、收藏、重置、modal 系统 |
| `auth-bridge.js` | 改造 | 登录态变化时派发 `japaflow:auth-changed` 事件 |
| `index.html` | 改造 | `<script type="module" src="/api.js">` 引入（或 app.js 内 import） |
| `styles.css` | 改造 | 新增 `.migration-dialog`、`.auth-dialog` 样式 |

---

## 10. 状态流转总览

```
用户打开 JapaFlow
       │
       ├─ 无 token ──→ 纯 localStorage 模式（与现在一致）
       │                    │
       │                    ├─ 任意 API 返回 401
       │                    │       │
       │                    │       └─ 弹窗："是否登录？"
       │                    │           ├─ 是 → 跳转登录 → 回来后走下方流程
       │                    │           └─ 否 → skipAuth=1，本会话不再提示
       │                    │
       │                    └─ 收到 AUTH_SYNC（父窗口登录成功）
       │                            │
       │                            └─ 触发 japaflow:auth-changed
       │                                    │
       │                                    ▼
       ├─ 有 token ──→ 检查 localStorage 是否有数据
       │                    │
       │                    ├─ 有 → 弹出迁移面板
       │                    │       ├─ "上传到云端" → POST /import → 清 localStorage → 拉服务端数据
       │                    │       ├─ "丢弃本地"   → 清 localStorage → 拉服务端数据
       │                    │       └─ "稍后处理"   → 标记本次已处理，不再弹窗
       │                    │
       │                    └─ 无 → 直接拉服务端数据写入 localStorage
       │
       └─ 正常使用（已登录）
               │
               └─ 每次 write() → localStorage + debounce 2s → API 同步
```
