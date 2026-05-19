# Lesson 28 初始化问题复盘

## 背景

在实现 `JapaFlow-PRD-v0.1.8-course-initialization.md` 的课程初始化流程时，第 28 课初始化页出现两个直接影响使用的问题：

- 点击“选择文件”没有稳定弹出系统文件选择窗口。
- 浏览器高频请求 `/api/init/status?lessonId=28&voiceId=Japanese_IntellectualSenior`。

## 表现

用户在初始化页尝试上传教材截图时，点击文件选择控件没有明显反应。与此同时，浏览器网络面板持续刷初始化状态接口，页面不断重绘。

## 根因

根因不是一个单独的同步任务长时间占用主线程，而是前端进入了异步请求和重绘自旋：

1. 初始化页 `render()` 后会调用 `loadInitStatus()`。
2. 当状态请求失败或返回异常时，前端把 `initStatus` 置空。
3. `loadInitStatus()` 结束后再次 `render()`。
4. 新一轮 `render()` 发现没有可用状态，又立即发起同一个状态请求。

这个循环导致浏览器持续发请求并重绘页面。文件上传控件在用户点击前后可能被新的 DOM 替换，原生文件选择窗口因此没有稳定打开。

## 已修复内容

### 状态请求防抖与失败缓存

在 `app.js` 中加入：

- `initStatusLoading`：同一课程和声音的状态请求进行中时不重复发起。
- `initStatusVoiceId`：把状态缓存绑定到当前声音版本。
- 失败缓存：请求失败后不会因为 `render()` 自动高频重试，只能通过“刷新结果”手动强制重试。

### 文件选择控件稳定化

初始化页不再直接展示裸 `input type="file"`，改为：

- 显式按钮 `选择文件`
- 隐藏的真实 file input
- 按钮点击时用 JS 触发 file input
- 文件选择后清空 input value，允许重复选择同一个文件也能触发上传

### JSON 导入路径

第一步“图片解析”现在支持并存的人工导入路径：

- 粘贴 lesson JSON
- 选择本地 `.json` 文件
- 点击“导入 JSON 草稿”

导入后服务器保存到 `data/lesson-drafts/lesson{lessonId}.json`，仍需人工审核并点击“确认解析结果”后才会写入 `data/lessons/lesson{lessonId}.json`。

## 第 28 课数据处理

已从项目目录 `28/` 读取以下截图并整理结构化草稿：

- `28-单词.png`
- `28-基本课文.png`
- `28-应用课文.png`
- `28-语法1.png`
- `28-语法2.png`
- `28-表达及词语讲解1.png`
- `28-表达及词语讲解2.png`
- `28-练习1.png`
- `28-练习2.png`
- `28-练习3.png`

输出文件：

- `28/lesson28.json`
- `data/lesson-drafts/lesson28.json`

数据结构按第 27 课现有形状组织，包含：

- `id`
- `title`
- `subtitle`
- `vocabulary[]`
- `sentences[]`
- `textStructure[]`
- `grammar[]`
- `exercises[]`

听力判断题截图没有给出标准答案，因此保留为 `audioRequired: true`、`hasAnswer: false`，不伪造答案。

## 后续风险

- 部分图片 OCR 只能依据可见截图人工整理，仍需要在初始化页审核 JSON。
- 第 28 课听力题如需自动判分，需要补充教材录音或答案页。
- 当前主学习运行时仍是硬编码第 27 课；第 28 课 JSON 只服务初始化草稿和后续动态加载版本。
