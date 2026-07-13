import React, { useEffect } from "react";

const sectionLabel = {
  practice_1: "练习 I",
  practice_2: "练习 II",
  vocabulary: "生词",
  culture_note: "专栏"
};

const evaluationModeLabel = {
  exact: "精确判分",
  acceptable_answers: "多答案",
  self_check: "自检",
  manual_review: "人工复核"
};

const textbookAudioBaseUrl = "https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio";

export function PracticePreview({ practice }) {
  const search = typeof window === "undefined" ? "" : window.location.search;
  const admin = new URLSearchParams(search).get("admin") === "1";

  useEffect(() => {
    if (admin) document.body.dataset.admin = "1";
    else delete document.body.dataset.admin;
    window.initPracticeAnswerFormatter?.();
  }, [admin, practice.lessonId]);

  return (
    <main className="practice-shell">
      <aside className="practice-sidebar">
        <div className="practice-brand">
          <span>練</span>
          <strong>{practice.title}</strong>
        </div>
        <nav className="activity-nav" aria-label="练习活动">
          {practice.activities.map((activity, index) => (
            <a key={activity.id} href={`#${activity.id}`} className={index === 0 ? "active" : ""}>
              <small>{sectionLabel[activity.section]} · {activity.order}</small>
              <span>{activity.title}</span>
            </a>
          ))}
          <a href="#source-pages">
            <small>Source</small>
            <span>教材原页</span>
          </a>
        </nav>
      </aside>

      <section className="practice-content">
        <header className="practice-header">
          <div>
            <p>{practice.lessonId} · Activity / Asset / Blank</p>
            <h1>{practice.title}</h1>
          </div>
          <div className="practice-stats">
            <strong>{practice.activities.length}</strong><span>活动</span>
            <strong>{practice.activities.reduce((sum, activity) => sum + activityItemCount(activity), 0)}</strong><span>题目</span>
          </div>
        </header>

        {practice.activities.map((activity) => (
          <PracticeActivity key={activity.id} activity={activity} practice={practice} admin={admin} />
        ))}

        <section className="source-page-strip" id="source-pages" aria-label="教材原页">
          {practice.sourcePages.map((sourcePage) => (
            <a key={sourcePage.pageNo} href={sourcePage.imagePath} target="_blank" rel="noreferrer">
              <img src={sourcePage.imagePath} alt={`教材第 ${sourcePage.pageNo} 页`} />
              <span>p.{sourcePage.pageNo}</span>
            </a>
          ))}
        </section>
      </section>
    </main>
  );
}

function PracticeActivity({ activity, practice, admin }) {
  const assetMap = activityAssetMap(activity);
  const audioUrl = resolveActivityAudioUrl(practice, activity);

  return (
    <article className="practice-activity" id={activity.id}>
      <div className="activity-head">
        <div>
          <span className="activity-kicker">{sectionLabel[activity.section]} · {activity.order}</span>
          <h2>{activity.title}</h2>
          <p>{activity.instruction}</p>
        </div>
        <div className="activity-tags">
          <span>{activity.interaction}</span>
          <span>{activity.answerUnit}</span>
          {activity.requiresAudio ? <span>{audioUrl ? "audio ready" : "audio pending"}</span> : null}
        </div>
      </div>

      <ActivityResources activity={activity} assetMap={assetMap} audioUrl={audioUrl} />

      {activity.layout.length ? (
        <div className="layout-blocks">
          {activity.layout.map((block, index) => <LayoutBlockView key={index} block={block} />)}
        </div>
      ) : null}

      {activity.itemGroups?.length ? (
        <div className="practice-item-groups">
          {activity.itemGroups.map((group) => (
            <PracticeItemGroupView key={group.id} group={group} assetMap={assetMap} admin={admin} />
          ))}
        </div>
      ) : (
        <div className="practice-items">
          {activity.items.map((item) => <PracticeItemView key={item.id} item={item} admin={admin} />)}
        </div>
      )}
    </article>
  );
}

function ActivityResources({ activity, assetMap, audioUrl }) {
  const hasAudio = activity.requiresAudio || activity.audio;
  const hasAssets = Boolean(activity.displayAssets?.length);
  if (!hasAudio && !hasAssets) return null;

  return (
    <div className="activity-resource-panel">
      {hasAudio ? (
        <div className={`audio-placeholder ${audioUrl ? "ready" : "pending"}`}>
          {audioUrl ? <audio controls src={audioUrl}></audio> : <span>录音待补充</span>}
        </div>
      ) : null}
      {hasAssets ? <DisplayAssets assetIds={activity.displayAssets} assetMap={assetMap} /> : null}
    </div>
  );
}

function PracticeItemGroupView({ group, assetMap, admin }) {
  return (
    <section className="practice-item-group" id={group.id}>
      <div className="group-head">
        <div>
          {group.title ? <h3>{group.title}</h3> : null}
          {group.instruction ? <p>{group.instruction}</p> : null}
        </div>
        <ExampleBlockView example={group.example} />
      </div>
      <div className="practice-items">
        {group.items.map((item) => (
          <PracticeItemView key={item.id} item={item} assetMap={assetMap} admin={admin} />
        ))}
      </div>
    </section>
  );
}

function LayoutBlockView({ block }) {
  if (block.type === "text") return <div className="layout-text"><RichTextList parts={block.text} /></div>;
  if (block.type === "example") return <ExampleBlockView example={block.content} />;
  if (block.type === "dialogue") {
    return (
      <div className="dialogue-block">
        {block.lines.map((line, index) => (
          <div className="dialogue-line" key={index}>
            <span>{line.speaker}</span>
            <p><Prompt parts={line.parts} kana={line.kana} /></p>
          </div>
        ))}
      </div>
    );
  }
  if (block.type === "image_grid") {
    return (
      <div className="asset-grid" style={{ "--columns": block.columns || 2 }}>
        {block.assets.map((asset) => <ImageAssetView key={asset.id} asset={asset} />)}
      </div>
    );
  }
  if (block.type === "map") {
    return (
      <div className="map-block">
        <ImageAssetView asset={block.image} />
        {(block.labels || []).map((label, index) => (
          <span className="map-label" key={index} style={{ left: `${label.x}%`, top: `${label.y}%` }}>{label.text}</span>
        ))}
      </div>
    );
  }
  if (block.type === "word_bank") {
    return <div className="word-bank">{block.words.map((word, index) => <span key={index}><RichText part={word} /></span>)}</div>;
  }
  return (
    <div className="passage-block">
      {block.title ? <h3>{block.title}</h3> : null}
      {block.lines.map((line, index) => <p key={index}><RichText part={line} /></p>)}
    </div>
  );
}

function ExampleBlockView({ example }) {
  if (!example) return null;
  return (
    <div className="example-block">
      {example.label ? <span className="example-label">{example.label}</span> : null}
      {example.beforeParts?.length ? (
        <span className="example-before"><Prompt parts={example.beforeParts} kana={example.beforeKana} /></span>
      ) : example.before ? (
        <span className="example-before"><RubyText text={example.before} kana={example.beforeKana} /></span>
      ) : null}
      <span className="example-arrow">→</span>
      <span className="example-after"><Prompt parts={example.after} kana={example.afterKana} /></span>
    </div>
  );
}

function PracticeItemView({ item, admin }) {
  return (
    <section className={`practice-item ${item.renderHint || "inline"}`}>
      <div className="item-main">
        <span className="item-number">{item.number}</span>
        <div className="item-prompt"><Prompt parts={item.prompt} kana={item.promptKana} /></div>
      </div>
      {item.evaluationMode ? <span className="evaluation-mode">{evaluationModeLabel[item.evaluationMode]}</span> : null}
      {item.instruction ? <p className="item-instruction">{item.instruction}</p> : null}
      {item.choices?.length ? <Choices choices={item.choices} item={item} admin={admin} /> : null}
      {item.inputSlots?.length ? (
        <div className="slot-row">
          {item.inputSlots.map((slot) => <InputSlotView key={slot.id} item={item} slot={slot} admin={admin} />)}
        </div>
      ) : null}
    </section>
  );
}

function Choices({ choices, item, admin }) {
  const answerIds = admin ? item.answer?.choiceIds || [] : [];
  return (
    <div className="choice-row">
      {choices.map((choice) => (
        <label key={choice.id}>
          <input
            type="radio"
            name={item.id}
            value={choice.id}
            defaultChecked={answerIds.includes(choice.id)}
          />
          <span>{choice.label}</span>
        </label>
      ))}
    </div>
  );
}

function InputSlotView({ item, slot, admin }) {
  const defaultValue = admin ? answerValue(item, slot.id) : "";
  const className = `practice-input ${slot.width || "medium"}${slot.multiline || slot.expectedUnit === "dialogue" ? " multiline" : ""}`;
  const label = `${item.number} ${slot.id}`;
  const placeholder = slot.placeholder || slot.expectedUnit;

  if (slot.multiline || slot.expectedUnit === "dialogue") {
    return (
      <textarea
        className={className}
        rows={slot.rows || 3}
        aria-label={label}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    );
  }
  return (
    <input
      className={className}
      aria-label={label}
      placeholder={placeholder}
      defaultValue={defaultValue}
    />
  );
}

function DisplayAssets({ assetIds, assetMap }) {
  return (
    <div className="related-asset-strip">
      {assetIds.map((id) => {
        const asset = assetMap.get(id);
        return asset ? <ImageAssetView key={id} asset={asset} /> : <MissingAssetNotice key={id} id={id} />;
      })}
    </div>
  );
}

function MissingAssetNotice({ id }) {
  return <div className="asset-config-warning" data-missing-asset={id}>暂未正确配置好图片，请联系管理员。</div>;
}

function ImageAssetView({ asset }) {
  if (asset.crop && asset.imagePath) {
    const crop = asset.crop;
    const posX = crop.width >= 100 ? 0 : (crop.x / (100 - crop.width)) * 100;
    const posY = crop.height >= 100 ? 0 : (crop.y / (100 - crop.height)) * 100;
    const style = {
      "--crop-ratio": crop.aspectRatio || crop.width / crop.height,
      "--crop-size-x": `${10000 / crop.width}%`,
      "--crop-size-y": `${10000 / crop.height}%`,
      "--crop-pos-x": `${posX}%`,
      "--crop-pos-y": `${posY}%`,
      backgroundImage: `url('${asset.imagePath}')`
    };
    return (
      <figure className={`image-asset ${asset.kind} cropped`}>
        <div className="crop-window" role="img" aria-label={asset.label || asset.id} style={style}></div>
        {asset.label ? <figcaption>{asset.label}</figcaption> : null}
      </figure>
    );
  }
  return (
    <figure className={`image-asset ${asset.kind}`}>
      {asset.imagePath ? <img src={asset.imagePath} alt={asset.label || asset.id} /> : <div className="empty-asset">图片待补充</div>}
      {asset.label ? <figcaption>{asset.label}</figcaption> : null}
    </figure>
  );
}

function Prompt({ parts, kana }) {
  if (shouldRenderWholePrompt(parts, kana)) {
    return <RubyText text={parts.map((part) => part.text).join("")} kana={kana} />;
  }
  return (
    <>
      {parts.map((part, index) => {
        if (part.type === "text") return <RichText key={index} part={part} />;
        if (part.type === "blank") return <span className="inline-blank" data-slot-id={part.slotId} key={index}></span>;
        if (part.type === "choice_ref") return <span className="choice-ref" key={index}>{part.choiceIds.join(" / ")}</span>;
        return <span className="asset-ref" key={index}>{part.assetId}</span>;
      })}
    </>
  );
}

function RichTextList({ parts }) {
  return <>{parts.map((part, index) => <RichText key={index} part={part} />)}</>;
}

function RichText({ part }) {
  const content = <RubyText text={part.text} kana={part.kana} />;
  return part.underline ? (
    <span className="underlined" data-substitution-key={part.substitutionKey || undefined}>{content}</span>
  ) : (
    <>{content}</>
  );
}

function RubyText({ text, kana }) {
  return kana ? <ruby>{text}<rt>{kana}</rt></ruby> : text;
}

function shouldRenderWholePrompt(parts, kana) {
  return Boolean(kana) && parts.every((part) => part.type === "text" && !part.underline && !part.substitutionKey && !part.kana);
}

function resolveActivityAudioUrl(practice, activity) {
  if (activity.audio?.source === "external_url") return activity.audio.url;
  if (!activity.requiresAudio && activity.audio?.source !== "textbook_exercise") return undefined;

  const lessonNo = lessonNumber(practice.lessonId);
  const exerciseNo = exerciseNumber(activity.section);
  if (!lessonNo || !exerciseNo) return undefined;

  const unitNo = Math.ceil(lessonNo / 4);
  return `${textbookAudioBaseUrl}/book1-unit${unitNo}/lesson${lessonNo}/Exe${exerciseNo}_${activity.order}.mp3`;
}

function lessonNumber(lessonId) {
  const match = String(lessonId).match(/lesson(\d+)/i);
  return match ? Number(match[1]) : undefined;
}

function exerciseNumber(section) {
  if (section === "practice_1") return 1;
  if (section === "practice_2") return 2;
  return undefined;
}

function activityAssetMap(activity) {
  const map = new Map();
  const add = (asset) => {
    if (asset) map.set(asset.id, asset);
  };
  activity.assets?.forEach(add);
  activity.layout.forEach((block) => {
    if (block.type === "image_grid") block.assets.forEach(add);
    if (block.type === "map") add(block.image);
  });
  return map;
}

function activityItemCount(activity) {
  return activity.itemGroups?.length
    ? activity.itemGroups.reduce((sum, group) => sum + group.items.length, 0)
    : activity.items.length;
}

function answerValue(item, slotId) {
  const value = item.answer?.slotValues?.[slotId];
  if (Array.isArray(value)) return value.join("\n");
  return value || "";
}
