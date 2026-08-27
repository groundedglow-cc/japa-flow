import type {
  Choice,
  ExampleBlock,
  ImageAsset,
  LayoutBlock,
  LessonPractice,
  PracticeActivity,
  PracticeItemGroup,
  PracticeItem,
  PromptPart,
  RichText
} from "./lesson-practice-types";

const sectionLabel: Record<string, string> = {
  practice_1: "练习 I",
  practice_2: "练习 II",
  vocabulary: "生词",
  culture_note: "专栏"
};

const textbookAudioBaseUrl = "https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio";

export function renderLessonPracticePage(practice: LessonPractice): string {
  const first = practice.activities[0];
  return `
    <main class="practice-shell">
      <aside class="practice-sidebar">
        <div class="practice-brand">
          <span>練</span>
          <strong>${escapeHtml(practice.title)}</strong>
        </div>
        <nav class="activity-nav" aria-label="练习活动">
          ${practice.activities.map((activity) => `
            <a href="#${activity.id}" class="${activity.id === first?.id ? "active" : ""}" title="${escapeHtml(activity.title)}">
              <small>${sectionLabel[activity.section]} · ${activity.order}</small>
              <span>${escapeHtml(activity.title)}</span>
            </a>
          `).join("")}
        </nav>
      </aside>

      <section class="practice-content">
        <header class="practice-header">
          <div>
            <p>${practice.lessonId} · Activity / Asset / Blank</p>
            <h1>${escapeHtml(practice.title)}</h1>
          </div>
          <div class="practice-stats">
            <strong>${practice.activities.length}</strong><span>活动</span>
            <strong>${practice.activities.reduce((sum, activity) => sum + activityItemCount(activity), 0)}</strong><span>题目</span>
          </div>
        </header>

        ${practice.activities.map((activity) => renderActivity(activity, practice)).join("")}

        <section class="source-page-strip" aria-label="教材原页">
          ${practice.sourcePages.map((sourcePage) => `
            <a href="${sourcePage.imagePath}" target="_blank" rel="noreferrer">
              <img src="${sourcePage.imagePath}" alt="教材第 ${sourcePage.pageNo} 页" />
              <span>p.${sourcePage.pageNo}</span>
            </a>
          `).join("")}
        </section>
      </section>
    </main>
  `;
}

export function renderActivity(activity: PracticeActivity, practice?: LessonPractice): string {
  const assetMap = activityAssetMap(activity);
  const audioUrl = practice ? resolveActivityAudioUrl(practice, activity) : activity.audio?.url;
  return `
    <article class="practice-activity" id="${activity.id}">
      <div class="activity-head">
        <div>
          <span class="activity-kicker">${sectionLabel[activity.section]} · ${activity.order}</span>
          <h2>${escapeHtml(activity.title)}</h2>
          <p>${escapeHtml(activity.instruction)}</p>
        </div>
        <div class="activity-tags">
          <span>${activity.interaction}</span>
          <span>${activity.answerUnit}</span>
          ${activity.requiresAudio ? `<span>${audioUrl ? "audio ready" : "audio pending"}</span>` : ""}
        </div>
      </div>

      ${renderActivityAudio(activity, audioUrl)}
      ${renderActivityResources(activity, assetMap)}

      ${activity.layout.length ? `<div class="layout-blocks">${activity.layout.map(renderLayoutBlock).join("")}</div>` : ""}

      ${activity.itemGroups?.length ? `
        <div class="practice-item-groups">
          ${activity.itemGroups.map((group) => renderPracticeItemGroup(group, assetMap)).join("")}
        </div>
      ` : `
        <div class="practice-items">
          ${activity.items.map((item) => renderPracticeItem(item, assetMap)).join("")}
        </div>
      `}
    </article>
  `;
}

function renderActivityAudio(activity: PracticeActivity, audioUrl?: string): string {
  const hasAudio = activity.requiresAudio || activity.audio !== undefined;
  if (!hasAudio) return "";

  return `
    <div class="audio-placeholder ${audioUrl ? "ready" : "pending"}">
      ${audioUrl ? `<audio controls src="${escapeHtml(audioUrl)}"></audio>` : "<span>录音待补充</span>"}
    </div>
  `;
}

function renderActivityResources(activity: PracticeActivity, assetMap: Map<string, ImageAsset>): string {
  const hasAssets = Boolean(activity.displayAssets?.length);
  if (!hasAssets) return "";

  return `
    <div class="activity-resource-panel">
      ${activity.displayAssets?.length ? renderDisplayAssets(activity.displayAssets, assetMap) : ""}
    </div>
  `;
}

function resolveActivityAudioUrl(practice: LessonPractice, activity: PracticeActivity): string | undefined {
  if (activity.audio?.source === "external_url") return activity.audio.url;
  if (!activity.requiresAudio && activity.audio?.source !== "textbook_exercise") return undefined;

  const lessonNo = lessonNumber(practice.lessonId);
  const exerciseNo = exerciseNumber(activity.section);
  if (!lessonNo || !exerciseNo) return undefined;

  const unitNo = Math.ceil(lessonNo / 4);
  return `${textbookAudioBaseUrl}/book1-unit${unitNo}/lesson${lessonNo}/Exe${exerciseNo}_${activity.order}.mp3`;
}

function lessonNumber(lessonId: string): number | undefined {
  const match = lessonId.match(/lesson(\d+)/i);
  return match ? Number(match[1]) : undefined;
}

function exerciseNumber(section: PracticeActivity["section"]): number | undefined {
  if (section === "practice_1") return 1;
  if (section === "practice_2") return 2;
  return undefined;
}

function activityAssetMap(activity: PracticeActivity): Map<string, ImageAsset> {
  const map = new Map<string, ImageAsset>();
  const add = (asset?: ImageAsset) => {
    if (asset) map.set(asset.id, asset);
  };
  activity.assets?.forEach(add);
  activity.layout.forEach((block) => {
    if (block.type === "image_grid") block.assets.forEach(add);
    if (block.type === "map") add(block.image);
  });
  return map;
}

function activityItemCount(activity: PracticeActivity): number {
  return activity.itemGroups?.length
    ? activity.itemGroups.reduce((sum, group) => sum + group.items.length, 0)
    : activity.items.length;
}

function renderPracticeItemGroup(group: PracticeItemGroup, assetMap = new Map<string, ImageAsset>()): string {
  return `
    <section class="practice-item-group" id="${group.id}">
      <div class="group-head">
        <div>
          ${group.title ? `<h3>${escapeHtml(group.title)}</h3>` : ""}
          ${group.instruction ? `<p>${escapeHtml(group.instruction)}</p>` : ""}
        </div>
        ${renderExample(group.example)}
      </div>
      <div class="practice-items">
        ${group.items.map((item) => renderPracticeItem(item, assetMap)).join("")}
      </div>
    </section>
  `;
}

function renderLayoutBlock(block: LayoutBlock): string {
  if (block.type === "text") {
    return `<div class="layout-text">${renderRichTextList(block.text)}</div>`;
  }
  if (block.type === "example") {
    return renderExample(block.content);
  }
  if (block.type === "dialogue") {
    return `
      <div class="dialogue-block">
        ${block.lines.map((line) => `
          <div class="dialogue-line">
            <span>${escapeHtml(line.speaker)}</span>
            <p>${renderPrompt(line.parts, line.kana)}</p>
          </div>
        `).join("")}
      </div>
    `;
  }
  if (block.type === "image_grid") {
    return `
      <div class="asset-grid" style="--columns:${block.columns || 2}">
        ${block.assets.map(renderImageAsset).join("")}
      </div>
    `;
  }
  if (block.type === "map") {
    return `
      <div class="map-block">
        ${renderImageAsset(block.image)}
        ${(block.labels || []).map((label) => `<span class="map-label" style="left:${label.x}%;top:${label.y}%">${escapeHtml(label.text)}</span>`).join("")}
      </div>
    `;
  }
  if (block.type === "word_bank") {
    return `<div class="word-bank">${block.words.map((word) => `<span>${renderRichText(word)}</span>`).join("")}</div>`;
  }
  return `
    <div class="passage-block">
      ${block.title ? `<h3>${escapeHtml(block.title)}</h3>` : ""}
      ${block.lines.map((line) => `<p>${renderRichText(line)}</p>`).join("")}
    </div>
  `;
}

function renderExample(example: ExampleBlock): string {
  const dialogueLines = exampleDialogueLines(example.after, example.afterKana);
  if (dialogueLines) {
    return `
      <div class="example-block dialogue-example">
        <span class="example-head">
          ${example.label ? `<span class="example-label">${escapeHtml(example.label)}</span>` : ""}
          ${example.beforeParts?.length
            ? `<span class="example-before">${renderPrompt(example.beforeParts, example.beforeKana)}</span>`
            : example.before ? `<span class="example-before">${renderRubyText(example.before, example.beforeKana)}</span>` : ""}
          <span class="example-arrow">→</span>
        </span>
        <span class="example-after dialogue-lines">
          ${dialogueLines.map((line) => `
            <span class="dialogue-line">
              <span>${escapeHtml(line.speaker)}</span>
              <p>${renderPrompt(line.parts, line.kana)}</p>
            </span>
          `).join("")}
        </span>
      </div>
    `;
  }
  return `
    <div class="example-block">
      <span class="example-head">
        ${example.label ? `<span class="example-label">${escapeHtml(example.label)}</span>` : ""}
        ${example.beforeParts?.length
          ? `<span class="example-before">${renderPrompt(example.beforeParts, example.beforeKana)}</span>`
          : example.before ? `<span class="example-before">${renderRubyText(example.before, example.beforeKana)}</span>` : ""}
        <span class="example-arrow">→</span>
      </span>
      <span class="example-after">${renderPrompt(example.after, example.afterKana)}</span>
    </div>
  `;
}

function renderPracticeItem(item: PracticeItem, assetMap = new Map<string, ImageAsset>()): string {
  return `
    <section class="practice-item ${item.renderHint || "inline"}">
      <div class="item-main">
        <span class="item-number">${escapeHtml(item.number)}</span>
        <div class="item-prompt">${renderPrompt(item.prompt, item.promptKana)}</div>
      </div>
      ${item.evaluationMode ? `<span class="evaluation-mode">${evaluationModeLabel(item.evaluationMode)}</span>` : ""}
      ${item.instruction ? `<p class="item-instruction">${escapeHtml(item.instruction)}</p>` : ""}
      ${item.choices?.length ? renderChoices(item.choices, item.id) : ""}
      ${item.inputSlots?.length ? `
        <div class="slot-row">
          ${item.inputSlots.map((slot) => renderInputSlot(item, slot)).join("")}
        </div>
      ` : ""}
    </section>
  `;
}

function renderDisplayAssets(assetIds: string[], assetMap: Map<string, ImageAsset>): string {
  const rows = assetIds.map((id) => {
    const asset = assetMap.get(id);
    return asset ? renderImageAsset(asset) : missingAssetNotice(id);
  });
  return `<div class="related-asset-strip">${rows.join("")}</div>`;
}

function missingAssetNotice(id: string): string {
  return `
    <div class="asset-config-warning" data-missing-asset="${escapeHtml(id)}">
      暂未正确配置好图片，请联系管理员。
    </div>
  `;
}

function evaluationModeLabel(mode: NonNullable<PracticeItem["evaluationMode"]>): string {
  return {
    exact: "精确判分",
    acceptable_answers: "多答案",
    self_check: "自检",
    manual_review: "人工复核"
  }[mode];
}

function renderInputSlot(item: PracticeItem, slot: NonNullable<PracticeItem["inputSlots"]>[number]): string {
  const label = `${item.number} ${slot.id}`;
  const placeholder = slot.placeholder || slot.expectedUnit;
  if (slot.multiline || slot.expectedUnit === "dialogue") {
    return `
      <textarea
        class="practice-input ${slot.width || "medium"} multiline"
        rows="${slot.rows || 3}"
        aria-label="${escapeHtml(label)}"
        placeholder="${escapeHtml(placeholder)}"
      ></textarea>
    `;
  }
  return `
    <input
      class="practice-input ${slot.width || "medium"}"
      aria-label="${escapeHtml(label)}"
      placeholder="${escapeHtml(placeholder)}"
    />
  `;
}

function renderChoices(choices: Choice[], itemId: string): string {
  return `
    <div class="choice-row">
      ${choices.map((choice) => `
        <label>
          <input type="radio" name="${escapeHtml(itemId)}" value="${escapeHtml(choice.id)}" />
          <span>${escapeHtml(choice.label)}</span>
        </label>
      `).join("")}
    </div>
  `;
}

function renderImageAsset(asset: ImageAsset): string {
  if (asset.crop && asset.imagePath) {
    const crop = asset.crop;
    const posX = crop.width >= 100 ? 0 : (crop.x / (100 - crop.width)) * 100;
    const posY = crop.height >= 100 ? 0 : (crop.y / (100 - crop.height)) * 100;
    return `
      <figure class="image-asset ${asset.kind} cropped">
        <div
          class="crop-window"
          role="img"
          aria-label="${escapeHtml(asset.label || asset.id)}"
          style="--crop-ratio:${crop.aspectRatio || crop.width / crop.height};--crop-size-x:${10000 / crop.width}%;--crop-size-y:${10000 / crop.height}%;--crop-pos-x:${posX}%;--crop-pos-y:${posY}%;background-image:url('${escapeHtml(asset.imagePath)}')"
        ></div>
        ${asset.label ? `<figcaption>${escapeHtml(asset.label)}</figcaption>` : ""}
      </figure>
    `;
  }
  return `
    <figure class="image-asset ${asset.kind}">
      ${asset.imagePath ? `<img src="${asset.imagePath}" alt="${escapeHtml(asset.label || asset.id)}" />` : `<div class="empty-asset">图片待补充</div>`}
      ${asset.label ? `<figcaption>${escapeHtml(asset.label)}</figcaption>` : ""}
    </figure>
  `;
}

function renderPrompt(parts: PromptPart[], kana?: string): string {
  if (shouldRenderWholePrompt(parts, kana)) {
    return renderRubyText(parts.map((part) => part.text).join(""), kana);
  }
  return parts.map((part) => {
    if (part.type === "text") return renderRichText(part);
    if (part.type === "blank") return `<span class="inline-blank" data-slot-id="${escapeHtml(part.slotId)}"></span>`;
    if (part.type === "choice_ref") return `<span class="choice-ref">${part.choiceIds.map(escapeHtml).join(" / ")}</span>`;
    return `<span class="asset-ref">${escapeHtml(part.assetId)}</span>`;
  }).join("");
}

function renderRichTextList(parts: RichText[]): string {
  return parts.map(renderRichText).join("");
}

function renderRichText(part: RichText): string {
  const content = renderRubyText(part.text, part.kana);
  const substitutionAttr = part.substitutionKey ? ` data-substitution-key="${escapeHtml(part.substitutionKey)}"` : "";
  return part.underline ? `<span class="underlined"${substitutionAttr}>${content}</span>` : content;
}

function renderRubyText(text: string, kana?: string): string {
  return kana
    ? `<ruby>${escapeHtml(text)}<rt>${escapeHtml(kana)}</rt></ruby>`
    : escapeHtml(text);
}

function shouldRenderWholePrompt(parts: PromptPart[], kana?: string): parts is RichText[] {
  return Boolean(kana) && parts.every((part) => part.type === "text" && !part.underline && !part.substitutionKey && !part.kana);
}

function exampleDialogueLines(parts: PromptPart[], kana?: string) {
  if (!parts?.length) return null;
  const text = promptPartsPlainText(parts).trim();
  if (!/甲：|乙|こう：|おつ：|コウ：|オツ：/.test(text)) return null;
  const textLines = splitDialogueContent(text);
  const kanaLines = kana ? splitDialogueContent(kana) : [];
  if (!textLines.length) return null;
  const partsLines = splitPromptPartsByDialogueLines(parts, textLines);
  return textLines.map((line, index) => ({
    speaker: line.speaker,
    parts: partsLines[index] || [],
    kana: kanaLines[index]?.body || ""
  }));
}

function splitDialogueContent(value: string) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return [];
  const speakerPattern = /((?:甲|乙[12]?|丙|丁|A|B|C|D|こう|おつ|コウ|オツ))：/g;
  const matches = Array.from(text.matchAll(speakerPattern));
  return matches.map((match, index) => {
    const speaker = match[1];
    const bodyStart = (match.index || 0) + match[0].length;
    const bodyEnd = matches[index + 1]?.index ?? text.length;
    return {
      speaker,
      body: text.slice(bodyStart, bodyEnd).trim(),
      start: bodyStart,
      end: bodyEnd
    };
  }).filter((line) => line.body);
}

function splitPromptPartsByDialogueLines(parts: PromptPart[], textLines: { start: number; end: number }[]) {
  const result = textLines.map(() => []);
  const ranges = textLines.map((line) => ({ start: line.start, end: line.end }));
  let cursor = 0;
  for (const part of parts) {
    const partText = promptPartsPlainText([part]);
    const partStart = cursor;
    const partEnd = cursor + partText.length;
    ranges.forEach((range, index) => {
      const overlapStart = Math.max(partStart, range.start);
      const overlapEnd = Math.min(partEnd, range.end);
      if (overlapStart >= overlapEnd) return;
      const sliceStart = overlapStart - partStart;
      const sliceEnd = overlapEnd - partStart;
      result[index].push(slicePromptPart(part, partText.slice(sliceStart, sliceEnd)));
    });
    cursor = partEnd;
  }
  return result;
}

function slicePromptPart(part: PromptPart, text: string): PromptPart {
  if (part.type !== "text") return part;
  return { ...part, text };
}

function promptPartsPlainText(parts: PromptPart[]): string {
  return parts.map((part) => {
    if (part.type === "text") return part.text;
    if (part.type === "blank") return "";
    if (part.type === "choice_ref") return part.choiceIds.join(" / ");
    return part.assetId;
  }).join("");
}

function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
