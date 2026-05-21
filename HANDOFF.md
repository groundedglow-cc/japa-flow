# JapaFlow 跨机迁移笔记

> 当前机器升级系统才能装 Xcode，迁移到另一台 macOS 更新的机器继续 Phase 5b（添加 iOS 平台）。

## 一、整体进展速览

| Phase | 状态 | 内容 |
|---|---|---|
| 0 准备 | ✅ | 分支 `split/admin-student`；`debug-recordings/` 出 git；`.gitignore` 完善 |
| 1 识别边界 | ✅ | 实测学员端仅依赖 2 个 API：`/api/lesson-catalog`、`/api/pronunciation/evaluate` |
| 2 逻辑拆分 | ✅ | `ADMIN_MODE` 开关（`?admin=1`）+ 路由守卫 + 入口按钮隐藏 |
| 3 学员端只读 | ✅ | `scripts/export-catalog.mjs` 生成 `data/catalog.json`；学员模式读静态 |
| 4 发音评测双模式 | ✅ | `evaluatePronunciation()`：Web 走 server，App 直连 Azure |
| **5a Capacitor 脚手架** | ✅ | 装 Capacitor、`scripts/build-app-dist.mjs`、密钥注入位 |
| **5b 添加 iOS 平台** | ⏸ 阻塞 | 需 Xcode + CocoaPods |
| 6 构建装机 | ⏸ | 依赖 5b |

详细计划见 `SPLIT-PLAN.md`。

## 二、迁移前必做（当前机器）

### 1. 推送代码到 GitHub
```bash
git push -u origin split/admin-student
```
分支名 `split/admin-student`，从 `main` 分出，含 10+ 个 commit。

### 2. 备份不进 git 的本地文件（重要！）

这些文件**永远不应进 git**，必须手动转移到新机器：

| 文件 | 内容 | 怎么转移 |
|---|---|---|
| `.env` | Azure Speech Key/Region + MiniMax Key | 安全途径（1Password、加密 U 盘、隐私聊天）告诉新机器 |
| `japaflow-config.local.js`（如已创建） | Azure 密钥的 App 注入版本 | 同上 |

如果没创建过 `japaflow-config.local.js`，新机器直接照 `japaflow-config.example.js` 的模板创建即可。

### 3. （可选）备份 `debug-recordings/`
115 个本地录音 wav，不进 git。如果想保留作为发音评测调试材料，单独 zip 一份。**不重要可以扔掉**。

## 三、新机器初始化步骤

### 1. 系统要求
- macOS 已升级到能装最新 Xcode 的版本
- 至少 30GB 可用空间（Xcode 10GB + Android Studio 5GB + 项目本身 + node_modules）

### 2. 装基础工具
```bash
# Homebrew（如没有）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# nvm（管理 Node）
brew install nvm
mkdir -p ~/.nvm
# 把以下加到 ~/.zshrc：
#   export NVM_DIR="$HOME/.nvm"
#   [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
source ~/.zshrc

# Node 22（与原机一致）
nvm install 22
nvm alias default 22
node --version  # v22.x

# CocoaPods（iOS 依赖管理）
brew install cocoapods
pod --version

# Git（macOS 自带通常够用）
git --version
```

### 3. 装 Xcode
- App Store 搜 "Xcode" → 获取（10GB+，1-2 小时）
- 装完打开一次，同意 license
- 终端执行：
  ```bash
  sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
  sudo xcodebuild -license accept
  xcrun simctl list devices  # 应能列出 iOS 模拟器
  ```

### 4. 拉项目
```bash
cd ~/Documents  # 或你想放的位置
git clone git@github.com:tangyefei/japa-flow.git
cd japa-flow
git checkout split/admin-student
npm install     # 装回 node_modules（含 Capacitor）
```

### 5. 恢复 secrets
```bash
# 创建 .env（Web/管理端用）
cat > .env <<'EOF'
AZURE_SPEECH_KEY=<从旧机器复制>
AZURE_SPEECH_REGION=eastasia
MINIMAX_API_KEY=<从旧机器复制>
EOF

# 创建 japaflow-config.local.js（App 用）
cat > japaflow-config.local.js <<'EOF'
window.JAPAFLOW_CONFIG = {
  AZURE_SPEECH_KEY: "<同上>",
  AZURE_SPEECH_REGION: "eastasia"
};
EOF
```

### 6. 验证 Web 端正常
```bash
npm run dev
# 浏览器开 http://localhost:5173/
# - 学员模式：能看到 lesson 27/28/29
# - ?admin=1：管理模式入口出现
# - 发音评测：能录音并拿到分数（验证 .env 生效）
```

### 7. 验证 App 构建产物
```bash
npm run build:app
# 应输出 ✓ Injected real Azure key from japaflow-config.local.js
# 检查 app-dist/ 目录已生成（~40MB）
```

## 四、新机器接着做（Phase 5b → 6）

按 `SPLIT-PLAN.md` 的 Phase 5b 步骤：

```bash
# 1. 添加 iOS 平台（生成 ios/ 目录 + Xcode 工程）
npx cap add ios

# 2. 同步资产 + Capacitor 配置到 iOS 工程
npx cap sync ios

# 3. 打开 Xcode
npx cap open ios
```

在 Xcode 里：
1. **配置签名**：选 Project → Signing & Capabilities → Team 选你的 Apple ID（个人免费证书）
2. **加麦克风权限**：编辑 `ios/App/App/Info.plist`，加：
   ```xml
   <key>NSMicrophoneUsageDescription</key>
   <string>JapaFlow 需要麦克风进行发音评测</string>
   ```
3. **连真机**：iPhone 用数据线接 Mac，信任电脑
4. **Run**：选连接的 iPhone 设备 → ▶
5. 第一次装机后到 iPhone 设置 → 通用 → VPN 与设备管理 → 信任你的 Apple ID 证书

### 进入 Phase 6
- 离线测试（飞行模式下能学课程、播音频）
- 联网测发音评测（直连 Azure）

## 五、关键文件清单

### 必须在新机器存在（来自 git）
- `package.json`、`package-lock.json` → `npm install` 后有 node_modules
- `capacitor.config.json`
- `scripts/build-app-dist.mjs`、`scripts/export-catalog.mjs`、`scripts/generate-minimax-audio.mjs`
- `app.js`、`index.html`、`styles.css`、`server.mjs`
- `data/`、`audio/`、`course-assets/`
- `SPLIT-PLAN.md`、`HANDOFF.md`（这份文件）
- `japaflow-config.example.js`

### 必须手动转移（不在 git）
- `.env`
- `japaflow-config.local.js`（如已创建）

### 不要转移（新机器重新生成）
- `node_modules/`
- `app-dist/`
- `ios/`（Phase 5b 会重新生成）
- `debug-recordings/`（可选保留）
- `.DS_Store`

## 六、回到本次工作的提示词

新机器拉好代码、装好环境后，告诉 Claude：

```
我把 japa-flow 项目从旧机器迁到了新机器，新机器装好了 Xcode 和 CocoaPods，
Node 22，已经按 HANDOFF.md 恢复了 .env 和 japaflow-config.local.js。
请继续 SPLIT-PLAN.md 的 Phase 5b。
```

Claude 会读 `SPLIT-PLAN.md` 和 `HANDOFF.md` 直接接续。

## 七、当前未解决/待办

1. **lesson 29 数据**：旧机器初始化时 AI 可能用了 lesson 28 的素材生成 `subtitle: "森さんの新居"`——这是 lesson 28 的标题。如果发现 lesson 29 内容串了 lesson 28 的数据，需要重新初始化。
2. **lesson 29 旧时间戳图片**：`course-assets/lesson29/{bucket}/1779*.png` 是早期 UI 上传的残留，可考虑清理：
   ```bash
   find course-assets/lesson29 -name '1779*' -delete
   ```
3. **catalog.json 自动刷新钩子**：目前管理端"确认音频"后需要手动 `npm run export:catalog` 才能让学员端目录更新。可选改进，不阻塞。

---

**最后一步**：把这份 HANDOFF.md 也 commit 进 git，新机器克隆即可看到。
