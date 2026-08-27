# JapaFlow 练习数据生成 Prompt V4（题图直引版）

本文件以 `practise-generete-prompt-v3.md` 为基础；除本文件明确替换的内容外，V3 的题目解析、例句、kana/ruby、录音转写、答案、预览、用户答案兼容和检查规则全部继续有效。本文件与 V3 有冲突时，以本文件为准。

目标是：练习数据中的题图不再从教材页裁切，而是直接引用已导出的“每道练习题一张图片”。不要创建、更新或引用任何 `lesson{N}-image-crops.ts`。

## 图片唯一来源

只允许将下列目录作为练习题图片来源：

```text
data/book1_exercise_images/
```

目录中的图片文件名规则为：

```text
book1_lesson{lessonNo}_{partNo}_{exerciseNo}.png
book1_lesson{lessonNo}_{partNo}_{exerciseNo}_{variantNo}.png
book1_lesson{lessonNo}_{partNo}_{exerciseNo}_{variantLabel}.png
```

含义示例：

```text
book1_lesson1_1_4.png
└─ book1 / lesson 1 / 练习第 1 部分 / 第 4 道大题

book1_lesson3_1_1_2.png
└─ book1 / lesson 3 / 练习第 1 部分 / 第 1 道大题 / 第 2 张独立题图

book1_lesson12_1_1_a.png、book1_lesson12_1_1_b.png
└─ 同一道练习中，例句 A 与例句 B 各自对应的一张独立题图；必须按 a、b 顺序绑定到相应的 `PracticeItemGroup`。
```

文件名是图片归属的唯一依据。必须先列出目标 lesson 在该目录中实际存在的文件，再建立引用；不得猜测不存在的图片名。对于历史遗留的不完全符合上述格式的文件，也必须直接使用其实际文件名，不得改名或自行补全编号。

`practice/lesson{N}-practice-data.ts` 中的相对路径固定为：

```ts
const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;
```

例如练习 I · 4：

```ts
const exerciseImage = (fileName: string) => `../data/book1_exercise_images/${fileName}`;

const personCards: ImageAsset = {
  id: "l1-p1-a4-person-cards",
  kind: "exercise_image",
  imagePath: exerciseImage("book1_lesson1_1_4.png"),
  label: "练习 I 4 人物信息图"
};
```

`ImageAsset` 必须有稳定的语义化 `id` 和 `imagePath`，**不得含有 `crop` 字段**。现有 React preview 在资源没有 `crop` 时会直接渲染完整 PNG，不需要修改全局组件、CSS 或类型。

## 取代 V3「强制规则 C」的图片规则

1. 带图片的练习题必须通过 `PracticeActivity.assets` 和 `displayAssets` 引用独立题图；禁止将图片路径散落在 HTML、JSX、`sourcePages` 或题目文本中。
2. 一张题图只定义一次 `ImageAsset`。活动通过 `displayAssets: [assetId]` 显示它；同一活动被多个位置使用时复用同一个 asset id。
3. 如果图片属于某个例句组或小题组，把对应 asset id 放进该 `PracticeItemGroup.displayAssets`；活动级 `displayAssets` 只放整道大题共同依赖的图片。展示顺序仍必须是“图片 → 例句 → 对应小题”。
4. 若一个大题有多张导出图，按文件名的 `_variantNo` 顺序建立多个 asset，并按教材视觉顺序写入同一 `displayAssets` 数组或各自的 item group。
5. 禁止使用 `crop`、`LessonImageCropCatalog`、`lesson{N}ImageCrops`、`generate-lesson-image-crops.py`、CSS crop-window 或教材整页图来呈现练习内容。
6. `sourcePages` 仍可保留原教材页链接，供溯源使用；它不可以代替练习题中的独立题图。
7. 如果目录没有该大题对应的图片：不要杜撰文件，也不要回退为裁切教材页。保留缺失的 `displayAssets` id 以触发管理员提示，并在最终汇报中列出缺失的预期文件名。
8. 图片本身就是该题完整视觉区域。不得因“看起来更聚焦”再次裁切、用 CSS 放大背景或添加裁切坐标。
9. 题图有词框、表格、地图或价格信息时，仍需根据 V3 的数据建模规则，将作答必须依赖的文字结构化到 `prompt`、`layout` 或 `example`；图片不能成为遗漏例句、题干或答案的理由。

对于已明确以新题图目录为准的课程，目录未提供该题图片即代表该题不应展示图片：必须移除旧 `assets`、`displayAssets`、`PracticeItemGroup.displayAssets` 和相关 `relatedAssets`，禁止保留旧 crop 或以管理员缺图提示替代。

## 目标产物

生成新 lesson 时必须创建或更新：

- `practice/lesson{N}-practice-data.ts`
- `practice/lesson{N}-practice-preview.html`
- `practice/react/entry.jsx`
- `practice/dist/practice-preview-react.js`

不得为新 lesson 创建 `practice/lesson{N}-image-crops.ts`。若该文件是旧数据遗留文件，在确认没有任何 import 或运行时引用后可以删除；删除不是生成新 lesson 的必要步骤。

## 执行顺序（替换 V3 中的图片相关步骤）

1. 读取 `course-assets/by-lesson/lesson{N}/` 的原始教材页，仅用于完整转写题目、例句、题号和视觉顺序。
2. 列出 `data/book1_exercise_images/` 中匹配 `book1_lesson{N}_*.png` 的所有实际文件名，并建立“练习部分 / 大题编号 / 变体号 / 文件名”清单。
3. 逐题核对清单与教材；每个有题图的大题都在 data 文件中建立无 `crop` 的 `ImageAsset`，并绑定到正确的 `displayAssets` 层级。
4. 继续按 V3 转写录音、推断答案、补 kana、生成数据、薄 HTML 壳和入口注册。
5. 运行 `npm run build:practice` 和 `git diff --check`，并打开 preview 目检图片、例句和小题的相对顺序。

## 已生成课程的图片迁移

迁移只改变图片资源定义和引用，不能改变 `activityId`、`itemId`、`slotId`、`choice.id`、题目、答案、例句、录音、`responseScope` 或用户答案存储 schema。

对每个已生成的 `practice/lesson{N}-practice-data.ts`，按以下规则迁移：

1. 从 activity id 计算默认题图文件名：

```text
l{N}-p{partNo}-a{exerciseNo}
→ book1_lesson{N}_{partNo}_{exerciseNo}.png
```

例如 `l1-p1-a4` 默认指向 `book1_lesson1_1_4.png`。

2. 保留现有 `displayAssets` 与 `PracticeItemGroup.displayAssets` 的 asset id，不改动其展示层级和顺序。
3. 把原 crop catalog import、`crop(id)` helper、旧 `assets` 中的 `crop` 坐标删除，改为在该 activity 的 `assets` 中以**原 asset id**定义直接图片：

```ts
assets: [
  {
    id: "l1-p1-a4-person-cards", // 保持原 id
    kind: "exercise_image",
    imagePath: exerciseImage("book1_lesson1_1_4.png"),
    label: "练习 I 4 人物信息图"
  }
],
displayAssets: ["l1-p1-a4-person-cards"]
```

4. 当同一大题有多个旧 asset id 时，先检查目录是否有对应变体文件。例如旧 activity 有两个资产且目录有 `book1_lesson3_1_1_1.png`、`book1_lesson3_1_1_2.png`，或 `book1_lesson12_1_1_a.png`、`book1_lesson12_1_1_b.png`，按教材例句 / item group 的视觉顺序一一对应。禁止靠旧 crop 的坐标顺序猜测；必须目检新 PNG。
5. 当一个旧图片资源被多个 activity 共用时，为每个实际大题改用其自身文件；只有新目录明确只提供同一张图片时才继续共用。同一图片的 asset id 可保留，但其 `imagePath` 必须与所属大题一致。
6. 迁移后删除已无 import 的 `lesson{N}-image-crops.ts`，并用 `rg` 确认该 lesson 没有残留 `ImageCrops`、`crop(` 或 `crop:` 引用。
7. 逐课构建并在 preview 中检查：每个 `displayAssets` 都能加载到新 PNG，且不出现管理员缺图提示。

推荐先用文件名做“候选映射”，再人工确认有多个图片或不规则命名的少数题目。不要对不存在的标准文件名做批量替换；迁移报告必须列出这些例外。

## V4 自检与最终汇报替换项

在 V3 自检清单中，将所有“crop catalog / 裁切 / crop 坐标 / 目视校准 crop”的要求替换为：

1. 每个图片题的 `ImageAsset.imagePath` 都指向 `../data/book1_exercise_images/` 下实际存在的文件。
2. 所有题图资源均不含 `crop` 字段，也没有 `lesson{N}-image-crops.ts` import。
3. 每个 `displayAssets` / `PracticeItemGroup.displayAssets` id 都能解析到本活动的 `assets` 中，且图片位置符合教材顺序。
4. 图片题未使用教材整页图代替独立题图。
5. 最终汇报列出每个图片题的“activity id → asset id → PNG 文件名 → 展示层级（activity 或 itemGroup）”，以及任何缺图或人工确认的变体映射。

最终汇报中不再报告 crop id、source page 裁切坐标、裁切失败或人工 crop 校准；改为报告新 PNG 引用及其存在性检查结果。

## 新课初始化硬性质量门：音频答案与会话 ruby

以下规则覆盖 V3 中任何将“听力题”笼统标为人工复核的做法：

1. 每个录音活动必须先运行 `scripts/transcribe-textbook-audio.mjs`。录音超过单次识别长度时，使用 `--start <seconds> --duration <seconds>` 分段转写，直到覆盖例句和全部小题；禁止用“暂无逐题录音转写”代替转写结果。
2. 只要录音或例句能确定唯一的标准作答，每个小题必须写入 `answer.slotValues` 并使用可自动判分的 `evaluationMode`；不得标为 `manual_review`。`manual_review` 只允许用于教材本身没有唯一答案的自由表达题，并在最终汇报中逐题说明原因。
3. 会话题的标准答案必须保留完整说话人、每一轮对话、助词、时态和句尾；`?admin=1` 必须能自动填入它，用户答错时必须能展示“你的答案 / 正确答案”对比。
4. 会话例句的 `after` 与 `afterKana` 必须逐行一一对应。文本说话人可为 `甲/乙`，假名说话人可为 `こう/おつ`，但每一行假名仅包含该行正文；不得把整段会话、说话人标签或标点写进任一汉字的 ruby 读音。
5. 交付前必须逐项检查：所有 `requiresAudio` item 是否有实际 transcript、标准答案和非 `manual_review` 判分；所有含 `甲/乙` 的例句是否按行展示；故意提交一个错误答案后是否展示正确答案与差异对比。任一项未通过不得交付。
