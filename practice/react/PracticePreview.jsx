import React, { useEffect, useMemo, useRef, useState } from "react";
import { practiceSessionApi } from "./practiceSessionApi.js";

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
const CHOICE_RESULT_KEY = "__choice__";
const answerLexicalVariantGroups = [
  ["わたし", "私", "我"],
  ["あなた", "貴方", "貴女"],
  ["だれ", "誰"],
  ["なん", "何", "なに"],
  ["いいえ違います", "いいえちがいます"],
  ["違います", "ちがいます"],
  ["どなた", "何方"],
  ["こちら", "此方"],
  ["そちら", "其方"],
  ["あちら", "彼方"],
  ["にほんじん", "日本人"],
  ["ちゅうごくじん", "中国人"],
  ["かんこくじん", "韓国人"],
  ["アメリカじん", "アメリカ人"],
  ["フランスじん", "フランス人"],
  ["にほんご", "日本語"],
  ["ちゅうごくご", "中国語"],
  ["かいしゃいん", "会社員"],
  ["しゃいん", "社員"],
  ["がくせい", "学生"],
  ["りゅうがくせい", "留学生"],
  ["けんしゅうせい", "研修生"],
  ["かちょう", "課長"],
  ["しゃちょう", "社長"],
  ["きょうじゅ", "教授"],
  ["かいしゃ", "会社"],
  ["JCきかく", "JC企画", "ジェーシーきかく", "ジェーシー企画"],
  ["きかく", "企画"],
  ["だいがく", "大学"],
  ["とうきょうだいがく", "東京大学"],
  ["ペキンだいがく", "北京大学"],
  ["にっちゅうしょうじ", "日中商事"],
  ["ペキンりょこうしゃ", "北京旅行社"],
  ["かばん", "鞄"],
  ["いす", "椅子"],
  ["つくえ", "机"],
  ["しんぶん", "新聞"],
  ["えんぴつ", "鉛筆"],
  ["ざっし", "雑誌"],
  ["じしょ", "辞書"],
  ["でんわ", "電話"],
  ["くるま", "車"],
  ["かぎ", "鍵"],
  ["かさ", "傘"],
  ["くつ", "靴"],
  ["とけい", "時計"],
  ["てちょう", "手帳"],
  ["ほん", "本"],
  ["しゃしん", "写真"],
  ["り", "李"],
  ["もり", "森"],
  ["はやし", "林"],
  ["おの", "小野"],
  ["たなか", "田中"],
  ["ちょう", "張"],
  ["おう", "王"],
  ["よしだ", "吉田"],
  ["なかむら", "中村"],
  ["ながしま", "長島"],
  ["おのみどり", "小野緑"],
  ["りしゅうれい", "李秀麗"],
  ["もりけんたろう", "森健太郎"]
];
const sortedAnswerLexicalVariantGroups = [...answerLexicalVariantGroups]
  .map((group) => [...group].sort((a, b) => b.length - a.length))
  .sort((a, b) => b[0].length - a[0].length);

export function PracticePreview({ practice, localPractice = null }) {
  const search = typeof window === "undefined" ? "" : window.location.search;
  const admin = new URLSearchParams(search).get("admin") === "1";
  const activities = practice.activities;
  const practiceSetId = practice.practiceSetId || null;
  const [session, setSession] = useState({ lessonId: practice.lessonId, activities: {} });
  const [sessionLoadKey, setSessionLoadKey] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(() => activityIdFromHash(window.location.hash, activities[0]?.id));

  useEffect(() => {
    let mounted = true;
    setIsReady(false);
    practiceSessionApi
      .loadLessonSession(practice.lessonId)
      .then((record) => {
        if (!mounted) return;
        const nextSession = record?.lessonId === practice.lessonId ? record : { lessonId: practice.lessonId, activities: {} };
        setSession(nextSession);
        setSessionLoadKey((value) => value + 1);
        if (!window.location.hash && nextSession.currentActivityId) {
          setCurrentActivityId(nextSession.currentActivityId);
          window.location.hash = nextSession.currentActivityId;
        }
        setIsReady(true);
      })
      .catch((error) => {
        if (!mounted) return;
        console.error("Failed to load practice session", error);
        setIsReady(true);
      });
    return () => {
      mounted = false;
    };
  }, [practice.lessonId]);

  useEffect(() => {
    if (admin) document.body.dataset.admin = "1";
    else delete document.body.dataset.admin;
  }, [admin]);

  useEffect(() => {
    const fallbackId = activities[0]?.id;
    const syncFromHash = () => {
      const nextId = activityIdFromHash(window.location.hash, fallbackId);
      setCurrentActivityId(nextId);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [activities]);

  useEffect(() => {
    if (!activities.some((activity) => activity.id === currentActivityId) && activities[0]?.id) {
      setCurrentActivityId(activities[0].id);
      if (typeof window !== "undefined") window.location.hash = activities[0].id;
    }
  }, [activities, currentActivityId]);

  const currentIndex = Math.max(0, activities.findIndex((activity) => activity.id === currentActivityId));
  const currentActivity = activities[currentIndex] || activities[0];
  const previousActivity = currentIndex > 0 ? activities[currentIndex - 1] : null;
  const nextActivity = currentIndex < activities.length - 1 ? activities[currentIndex + 1] : null;
  const currentRecord = normalizeActivityRecord(currentActivity, session.activities?.[currentActivity?.id]);
  const isPublished = Boolean(practiceSetId);

  useEffect(() => {
    window.initPracticeAnswerFormatter?.();
  }, [currentActivity?.id, sessionLoadKey, admin]);

  const handleNavigate = (activityId) => {
    if (!activityId || typeof window === "undefined") return;
    window.location.hash = activityId;
    practiceSessionApi.updateLessonSession({
      lessonId: practice.lessonId,
      practiceSetId,
      currentActivityId: activityId
    });
  };

  const handleActivitySave = async (activityId, payload, activity) => {
    const saved = await practiceSessionApi.saveActivitySubmission({
      lessonId: practice.lessonId,
      practiceSetId,
      activityId,
      activity,
      payload
    });
    setSession((prev) => ({
      ...prev,
      lessonId: practice.lessonId,
      activities: {
        ...(prev.activities || {}),
        [activityId]: saved
      }
    }));
    notifyPracticeProgressChanged({ lessonId: practice.lessonId, practiceSetId, activityId });
  };

  return (
    <main className="practice-shell">
      <aside className="practice-sidebar">
        <div className="practice-brand">
          <span>練</span>
          <strong>{practice.title}</strong>
        </div>
        <nav className="activity-nav" aria-label="练习活动">
          {activities.map((activity) => {
            const record = normalizeActivityRecord(activity, session.activities?.[activity.id]);
            const progress = activityProgressSummary(activity, record);
            return (
              <a
                key={activity.id}
                href={`#${activity.id}`}
                className={activity.id === currentActivity?.id ? "active" : ""}
              >
                <small>{sectionLabel[activity.section]} · {activity.order}</small>
                <span>{activity.title}</span>
                <div className="activity-nav-progress" aria-label={`完成度 ${progress.percent}%${progress.incorrect ? `，错题 ${progress.incorrect} 题` : ""}`}>
                  <div className="activity-progress-meta">
                    <em>
                      已做 {progress.completed}/{progress.total}
                      {progress.incorrect ? <span className="activity-progress-wrong">（错 {progress.incorrect}）</span> : null}
                    </em>
                    <strong>{progress.percent}%</strong>
                  </div>
                  <div
                    className="activity-progress-track"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={progress.percent}
                  >
                    <i style={{ width: `${progress.percent}%` }} />
                  </div>
                </div>
              </a>
            );
          })}
        </nav>
      </aside>

      <section className="practice-content">
        {admin ? <PracticePublishPanel lessonId={practice.lessonId} localPractice={localPractice} /> : null}
        {!admin && !isPublished ? (
          <UnpublishedPracticeNotice />
        ) : currentActivity ? (
          <PracticeActivity
            key={`${currentActivity.id}:${sessionLoadKey}:${admin ? "admin" : "user"}`}
            activity={currentActivity}
            practice={practice}
            admin={admin}
            record={currentRecord}
            isReady={isReady}
            onSave={handleActivitySave}
            previousActivity={previousActivity}
            nextActivity={nextActivity}
            onNavigate={handleNavigate}
          />
        ) : null}

        <section className="source-page-strip" aria-label="教材原页">
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

function notifyPracticeProgressChanged(detail) {
  if (typeof window === "undefined" || window.parent === window) return;
  window.parent.postMessage({
    type: "JAPAFLOW_PRACTICE_PROGRESS_CHANGED",
    ...detail
  }, window.location.origin);
}

function UnpublishedPracticeNotice() {
  return (
    <section className="practice-blocked-panel">
      <p className="practice-blocked-kicker">练习暂不可用</p>
      <h1>本课练习尚未发布到数据库</h1>
      <p>
        当前页面只有本地练习草稿，还没有可保存提交记录的数据库版本。请联系管理员发布本课练习数据后再开始练习。
      </p>
    </section>
  );
}

function PracticePublishPanel({ lessonId, localPractice }) {
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const lessonNo = String(lessonId || "").match(/\d+/)?.[0] || "";
  const generateCommand = lessonNo
    ? `practise-generete-prompt-v3.md generate lesson ${lessonNo} data`
    : "practise-generete-prompt-v3.md generate lesson N data";
  const canPublish = Boolean(localPractice?.activities?.length);

  const handlePublish = async () => {
    if (!canPublish) return;
    setStatus({ state: "pending", message: "发布中..." });
    try {
      const published = await practiceSessionApi.publishLocalPractice({ lessonId, practice: localPractice });
      setStatus({ state: "success", message: `已发布 version ${published.version}` });
    } catch (error) {
      setStatus({ state: "error", message: String(error.message || error) });
    }
  };

  return (
    <section className="admin-publish-panel">
      <div>
        <strong>本地练习数据</strong>
        {canPublish ? (
          <p>{localPractice.title} · {localPractice.activities.length} 题</p>
        ) : (
          <p>未找到本课本地练习数据。请先生成 `practice/lesson{lessonNo || "N"}-practice-data.ts`，例如：`{generateCommand}`。</p>
        )}
      </div>
      <div className="admin-publish-actions">
        <button type="button" className="secondary-action" onClick={handlePublish} disabled={!canPublish || status.state === "pending"}>
          发布到数据库
        </button>
        {status.message ? <span className={`admin-publish-status ${status.state}`}>{status.message}</span> : null}
      </div>
    </section>
  );
}

function PracticeActivity({ activity, practice, admin, record, isReady, onSave, previousActivity, nextActivity, onNavigate }) {
  const assetMap = useMemo(() => activityAssetMap(activity), [activity]);
  const audioUrl = resolveActivityAudioUrl(practice, activity);
  const formRef = useRef(null);
  const summary = record?.grading?.summary || null;
  const [isAnswerSheetOpen, setIsAnswerSheetOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ state: "idle", message: "" });
  const activityResponseScopeHint = resolveResponseScopeHint(activity.responseScope, activity.responseScopeHint);

  const handleSubmit = async () => {
    if (!formRef.current) return;
    const answers = collectActivityAnswers(formRef.current, activity);
    const grading = gradeActivity(activity, answers);
    setSubmitStatus({ state: "pending", message: "提交中..." });
    try {
      await onSave(activity.id, {
        answers,
        grading
      }, activity);
      setSubmitStatus({ state: "success", message: "已提交" });
    } catch (error) {
      setSubmitStatus({ state: "error", message: String(error.message || error) });
    }
  };

  return (
    <article className="practice-activity practice-activity-single" id={activity.id}>
      <div className="activity-head">
        <div>
          <span className="activity-kicker">{sectionLabel[activity.section]} · {activity.order}</span>
          <h2>{activity.title}</h2>
          {activity.instruction ? <p>{activity.instruction}</p> : null}
          {activityResponseScopeHint ? <div className="response-scope-callout">{activityResponseScopeHint}</div> : null}
        </div>
      </div>

      <ActivityResources activity={activity} assetMap={assetMap} audioUrl={audioUrl} />

      <form ref={formRef} className="activity-form" onSubmit={(event) => event.preventDefault()}>
        {activity.layout.length ? (
          <div className="layout-blocks">
            {activity.layout.map((block, index) => <LayoutBlockView key={index} block={block} />)}
          </div>
        ) : null}

        {activity.itemGroups?.length ? (
          <div className="practice-item-groups">
            {activity.itemGroups.map((group) => (
              <PracticeItemGroupView
                key={group.id}
                group={group}
                assetMap={assetMap}
                admin={admin}
                answerRecord={record?.answers || {}}
                gradingRecord={record?.grading?.itemResults || {}}
                activityResponseScope={activity.responseScope}
                activityResponseScopeHint={activity.responseScopeHint}
              />
            ))}
          </div>
        ) : (
          <div className="practice-items">
            {activity.items.map((item) => (
              <PracticeItemView
                key={item.id}
                item={item}
                admin={admin}
                storedAnswer={record?.answers?.[item.id]}
                gradingResult={record?.grading?.itemResults?.[item.id]}
                activityResponseScope={activity.responseScope}
                activityResponseScopeHint={activity.responseScopeHint}
              />
            ))}
          </div>
        )}
      </form>

      <footer className="activity-footer">
        <div className="activity-submit-block">
          <button type="button" className="primary-action" onClick={handleSubmit} disabled={!isReady}>
            提交本题
          </button>
          {summary?.submittedAt ? (
            <div className="submission-summary">
              <strong>{summary.correctCount}/{summary.gradedCount || summary.totalCount}</strong>
              <span>
                {summary.incorrectCount ? (
                  <button type="button" className="inline-answer-sheet-trigger" onClick={() => setIsAnswerSheetOpen(true)}>
                    {summary.incorrectCount} 题错误
                  </button>
                ) : "已判题"}
                {summary.ungradedCount ? ` · ${summary.ungradedCount} 题未自动判分` : ""}
              </span>
            </div>
          ) : (
            <div className="submission-summary pending">
              <strong>未提交</strong>
              <span>提交后会本地保存并恢复你的作答记录</span>
            </div>
          )}
          {activity.requiresAudio || activity.audio ? (
            <p className="submit-audio-hint">提示：录音转写可能不准确，提交前请人工核对。</p>
          ) : null}
          {submitStatus.message ? <p className={`submit-status-message ${submitStatus.state}`}>{submitStatus.message}</p> : null}
        </div>
        <div className="activity-nav-actions">
          {previousActivity ? (
            <button type="button" className="secondary-action" onClick={() => onNavigate(previousActivity.id)}>
              上一题
            </button>
          ) : null}
          {nextActivity ? (
            <button type="button" className="secondary-action" onClick={() => onNavigate(nextActivity.id)}>
              下一题
            </button>
          ) : null}
        </div>
      </footer>
      {isAnswerSheetOpen ? (
        <IncorrectAnswerModal
          activity={activity}
          answers={record?.answers || {}}
          grading={record?.grading?.itemResults || {}}
          onClose={() => setIsAnswerSheetOpen(false)}
        />
      ) : null}
    </article>
  );
}

function ActivityResources({ activity, assetMap, audioUrl }) {
  const hasAudio = activity.requiresAudio || activity.audio;
  const groupAssetIds = new Set((activity.itemGroups || []).flatMap((group) => group.displayAssets || []));
  const activityAssetIds = (activity.displayAssets || []).filter((assetId) => !groupAssetIds.has(assetId));
  const hasAssets = Boolean(activityAssetIds.length);
  if (!hasAudio && !hasAssets) return null;
  const audioGuidance = hasAudio ? resolveAudioGuidance(activity) : "";

  return (
    <div className="activity-resource-panel">
      {hasAudio ? (
        <>
          <div className={`audio-placeholder ${audioUrl ? "ready" : "pending"}`}>
            {audioUrl ? <audio controls src={audioUrl}></audio> : <span>录音待补充</span>}
          </div>
          {audioGuidance ? <p className="audio-guidance">{audioGuidance}</p> : null}
        </>
      ) : null}
      {hasAssets ? <DisplayAssets assetIds={activityAssetIds} assetMap={assetMap} /> : null}
    </div>
  );
}

function PracticeItemGroupView({ group, assetMap, admin, answerRecord, gradingRecord, activityResponseScope, activityResponseScopeHint }) {
  return (
    <section className="practice-item-group" id={group.id}>
      {group.displayAssets?.length ? <DisplayAssets assetIds={group.displayAssets} assetMap={assetMap} /> : null}
      <div className="example-practice-block">
        <div className="group-head">
          <div>
            {group.title ? <h3>{group.title}</h3> : null}
            {group.instruction ? <p>{group.instruction}</p> : null}
          </div>
          <ExampleBlockView example={group.example} />
        </div>
        <div className="practice-items">
          {group.items.map((item) => (
            <PracticeItemView
              key={item.id}
              item={item}
              assetMap={assetMap}
              admin={admin}
              storedAnswer={answerRecord?.[item.id]}
              gradingResult={gradingRecord?.[item.id]}
              activityResponseScope={activityResponseScope}
              activityResponseScopeHint={activityResponseScopeHint}
            />
          ))}
        </div>
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
  const dialogueLines = exampleDialogueLines(example.after, example.afterKana);
  return (
    <div className={`example-block ${dialogueLines ? "dialogue-example" : ""}`}>
      {example.label ? <span className="example-label">{example.label}</span> : null}
      {example.beforeParts?.length ? (
        <span className="example-before"><Prompt parts={example.beforeParts} kana={example.beforeKana} /></span>
      ) : example.before ? (
        <span className="example-before"><RubyText text={example.before} kana={example.beforeKana} /></span>
      ) : null}
      <span className="example-arrow">→</span>
      {dialogueLines ? (
        <span className="example-after dialogue-lines">
          {dialogueLines.map((line, index) => (
            <span className="dialogue-line" key={index}>
              <span>{line.speaker}</span>
              <p><RubyText text={line.text} kana={line.kana} /></p>
            </span>
          ))}
        </span>
      ) : (
        <span className="example-after"><Prompt parts={example.after} kana={example.afterKana} /></span>
      )}
    </div>
  );
}

function IncorrectAnswerModal({ activity, answers, grading, onClose }) {
  const incorrectItems = flattenActivityItems(activity)
    .map((item) => ({ item, result: grading?.[item.id], answer: answers?.[item.id] }))
    .filter(({ result }) => result?.status === "incorrect");

  return (
    <div className="answer-sheet-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="answer-sheet-modal"
        role="dialog"
        aria-modal="true"
        aria-label="错误题目与参考答案"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="answer-sheet-head">
          <div>
            <strong>错误题目与参考答案</strong>
            <p>以下内容仅展示本次提交里自动判错的题目。</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>关闭</button>
        </header>
        <div className="answer-sheet-list">
          {incorrectItems.map(({ item, answer, result }) => (
            <IncorrectAnswerDetails
              key={item.id}
              item={item}
              answer={answer}
              result={result}
              className="answer-sheet-entry"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function IncorrectAnswerDetails({ item, answer, result, className = "incorrect-answer-details", showPrompt = true }) {
  return (
    <article className={className}>
      {showPrompt ? <h4>{item.number}. <Prompt parts={item.prompt} kana={item.promptKana} /></h4> : null}
      <AnswerComparison item={item} answer={answer} />
      {result?.status === "incorrect" && item.evaluationMode === "acceptable_answers" ? (
        <small>本题支持多个可接受答案，已在“正确答案”中合并展示。</small>
      ) : null}
    </article>
  );
}

function AnswerComparisonBlock({ tone, label, value }) {
  return (
    <div className={`answer-comparison-block ${tone}`}>
      <span>{label}</span>
      <code>{value}</code>
    </div>
  );
}

function AnswerGitDiff({ lines }) {
  if (!lines?.length) return null;
  return (
    <div className="git-answer-diff" role="table" aria-label="答案差异明细">
      {lines.map((line, index) => (
        <div className={`git-diff-row ${line.type}`} role="row" key={index}>
          <span className="git-diff-prefix" aria-hidden="true">{line.type === "delete" ? "-" : line.type === "insert" ? "+" : " "}</span>
          <code>{renderAnswerDiffParts(line.parts)}</code>
        </div>
      ))}
    </div>
  );
}

function renderAnswerDiffParts(parts = []) {
  return parts.map((part, index) => {
    if (part.type === "equal") return <React.Fragment key={index}>{part.text}</React.Fragment>;
    return <mark data-diff={part.type} key={index}>{part.text}</mark>;
  });
}

function AnswerComparison({ item, answer }) {
  const comparison = buildAnswerComparison(item, answer);
  if (!comparison) return null;
  if (comparison.kind === "choice") {
    return (
      <div className="answer-diff answer-comparison" aria-label="答案对比">
        <div className="answer-diff-head">
          <strong>答案对比</strong>
        </div>
        <AnswerComparisonBlock tone="user" label="你的答案" value={comparison.actual || "未选择"} />
        <AnswerComparisonBlock tone="expected" label="正确答案" value={comparison.expected || "暂无"} />
      </div>
    );
  }

  return (
    <div className="answer-diff answer-comparison" aria-label="答案对比">
      <div className="answer-diff-head">
        <strong>差异对比</strong>
        <span>- 你的答案 / + 正确答案，已忽略说话人、空格和标点</span>
      </div>
      <AnswerGitDiff lines={comparison.diffLines} />
    </div>
  );
}

function PracticeItemView({ item, admin, storedAnswer, gradingResult, activityResponseScope, activityResponseScopeHint }) {
  const itemResponseScopeHint = resolveItemResponseScopeHint(item, activityResponseScope, activityResponseScopeHint);
  return (
    <section className={`practice-item ${item.renderHint || "inline"}`} data-item-status={gradingResult?.status || "idle"}>
      {gradingResult?.status === "incorrect" ? (
        <IncorrectReasonPopover item={item} answer={storedAnswer} result={gradingResult} />
      ) : null}
      <div className="item-main">
        <span className="item-number">{item.number}</span>
        <div className="item-prompt"><Prompt parts={item.prompt} kana={item.promptKana} /></div>
      </div>
      {item.evaluationMode ? <span className="evaluation-mode">{evaluationModeLabel[item.evaluationMode]}</span> : null}
      {item.instruction ? <p className="item-instruction">{item.instruction}</p> : null}
      {itemResponseScopeHint ? <p className="item-response-scope">{itemResponseScopeHint}</p> : null}
      {item.choices?.length ? <Choices choices={item.choices} item={item} admin={admin} storedAnswer={storedAnswer} gradingResult={gradingResult} /> : null}
      {item.inputSlots?.length ? (
        <div className="slot-row">
          {item.inputSlots.map((slot) => (
            <InputSlotView
              key={slot.id}
              item={item}
              slot={slot}
              admin={admin}
              storedAnswer={storedAnswer}
              gradingResult={gradingResult}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function IncorrectReasonPopover({ item, answer, result }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverId = `${item.id}-incorrect-reason`;

  return (
    <div className="incorrect-reason-popover">
      <button
        type="button"
        className="incorrect-reason-trigger"
        aria-label={`查看第 ${item.number} 题错误原因`}
        aria-expanded={isOpen}
        aria-controls={popoverId}
        onClick={() => setIsOpen((value) => !value)}
      >
        ?
      </button>
      {isOpen ? (
        <div className="incorrect-reason-panel" id={popoverId} role="dialog" aria-label={`第 ${item.number} 题错误原因`}>
          <div className="incorrect-reason-head">
            <strong>错误原因</strong>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="关闭错误原因">×</button>
          </div>
          <IncorrectAnswerDetails
            item={item}
            answer={answer}
            result={result}
            className="incorrect-answer-details compact"
            showPrompt={false}
          />
        </div>
      ) : null}
    </div>
  );
}

function Choices({ choices, item, admin, storedAnswer, gradingResult }) {
  const storedChoiceIds = resolveStoredChoiceIds(item, storedAnswer?.choiceIds || []);
  const currentChoiceIds = storedAnswer ? storedChoiceIds : (admin ? item.answer?.choiceIds || [] : []);
  const currentChoiceIdSet = new Set(currentChoiceIds);
  const choiceResult = gradingResult?.fieldResults?.[CHOICE_RESULT_KEY] || gradingResult?.status;
  return (
    <div className="choice-row">
      {choices.map((choice) => (
        <label key={choice.id} data-result={currentChoiceIdSet.has(choice.id) ? choiceResult || undefined : undefined}>
          <input
            type="radio"
            name={item.id}
            value={choice.id}
            defaultChecked={currentChoiceIdSet.has(choice.id)}
          />
          <span>{choice.label}</span>
        </label>
      ))}
    </div>
  );
}

function InputSlotView({ item, slot, admin, storedAnswer, gradingResult }) {
  const defaultValue = defaultFieldValue(item, slot.id, storedAnswer, admin);
  const className = `practice-input ${slot.width || "medium"}${slot.multiline || slot.expectedUnit === "dialogue" ? " multiline" : ""}`;
  const label = `${item.number} ${slot.id}`;
  const placeholder = slot.placeholder || slot.expectedUnit;
  const result = gradingResult?.fieldResults?.[slot.id];

  if (slot.multiline || slot.expectedUnit === "dialogue") {
    return (
      <textarea
        name={slotFieldName(item.id, slot.id)}
        className={className}
        rows={slot.rows || 3}
        aria-label={label}
        placeholder={placeholder}
        defaultValue={defaultValue}
        data-result={result || undefined}
      />
    );
  }
  return (
    <input
      name={slotFieldName(item.id, slot.id)}
      className={className}
      aria-label={label}
      placeholder={placeholder}
      defaultValue={defaultValue}
      data-result={result || undefined}
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
  if (!kana) return text;
  const segments = splitRubySegments(text, kana);
  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === "ruby") {
          return <ruby key={index}>{segment.text}<rt>{segment.kana}</rt></ruby>;
        }
        return <React.Fragment key={index}>{segment.text}</React.Fragment>;
      })}
    </>
  );
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

function activityIdFromHash(hash, fallbackId) {
  const value = String(hash || "").replace(/^#/, "").trim();
  return value || fallbackId;
}

function slotFieldName(itemId, slotId) {
  return `${itemId}::${slotId}`;
}

function collectActivityAnswers(form, activity) {
  const items = flattenActivityItems(activity);
  const answers = {};

  items.forEach((item) => {
    const itemAnswer = {};

    if (item.inputSlots?.length) {
      const slotValues = {};
      item.inputSlots.forEach((slot) => {
        const field = form.elements.namedItem(slotFieldName(item.id, slot.id));
        const value = field && "value" in field ? String(field.value || "") : "";
        slotValues[slot.id] = value;
      });
      itemAnswer.slotValues = slotValues;
    }

    if (item.choices?.length) {
      const selected = form.querySelector(`input[name="${item.id}"]:checked`);
      itemAnswer.choiceIds = selected ? [selected.value] : [];
    }

    answers[item.id] = itemAnswer;
  });

  return answers;
}

function gradeActivity(activity, answers, submittedAt = new Date().toISOString()) {
  const itemResults = {};
  let correctCount = 0;
  let incorrectCount = 0;
  let ungradedCount = 0;
  let gradedCount = 0;

  flattenActivityItems(activity).forEach((item) => {
    const result = gradeItem(item, answers[item.id] || {});
    itemResults[item.id] = result;
    if (result.status === "correct") {
      correctCount += 1;
      gradedCount += 1;
    } else if (result.status === "incorrect") {
      incorrectCount += 1;
      gradedCount += 1;
    } else {
      ungradedCount += 1;
    }
  });

  return {
    submittedAt,
    summary: {
      totalCount: flattenActivityItems(activity).length,
      gradedCount,
      correctCount,
      incorrectCount,
      ungradedCount,
      submittedAt
    },
    itemResults
  };
}

function gradeItem(item, attempt) {
  if (item.evaluationMode === "manual_review" || !item.answer) {
    return { status: "ungraded", fieldResults: {} };
  }

  const fieldResults = {};
  let sawGradableField = false;
  let hasIncorrect = false;

  if (item.inputSlots?.length) {
    item.inputSlots.forEach((slot) => {
      const matcher = expectedTextMatcher(item, slot.id);
      if (!matcher.exacts.length && !matcher.patterns.length) return;
      sawGradableField = true;
      const actual = normalizeAnswerText(attempt.slotValues?.[slot.id]);
      const actualCandidates = [actual];
      const speakerlessActual = normalizeSpeakerlessAnswer(attempt.slotValues?.[slot.id]);
      if (speakerlessActual && speakerlessActual !== actual && canAcceptSpeakerlessAnswer(item, matcher)) {
        actualCandidates.push(speakerlessActual);
      }
      const isCorrect = actualCandidates.some((candidate) =>
        matcher.exacts.includes(candidate) || matcher.patterns.some((pattern) => pattern.test(candidate))
      );
      fieldResults[slot.id] = isCorrect ? "correct" : "incorrect";
      if (!isCorrect) hasIncorrect = true;
    });
  }

  if (item.choices?.length && Array.isArray(item.answer.choiceIds)) {
    sawGradableField = true;
    const actualChoices = normalizeChoiceIds(attempt.choiceIds || []);
    const expectedChoices = normalizeChoiceIds(item.answer.choiceIds);
    const isCorrect = actualChoices.length === expectedChoices.length && actualChoices.every((choiceId, index) => choiceId === expectedChoices[index]);
    fieldResults[CHOICE_RESULT_KEY] = isCorrect ? "correct" : "incorrect";
    if (!isCorrect) hasIncorrect = true;
  }

  if (!sawGradableField) return { status: "ungraded", fieldResults };
  return {
    status: hasIncorrect ? "incorrect" : "correct",
    fieldResults
  };
}

function expectedTextMatcher(item, slotId) {
  const answers = [];
  const slotValue = item.answer?.slotValues?.[slotId];
  if (typeof slotValue === "string" || Array.isArray(slotValue)) answers.push(normalizeAnswerText(slotValue));

  if (slotId === "answer") {
    (item.answer?.modelAnswers || []).forEach((value) => answers.push(normalizeAnswerText(value)));
    (item.answer?.acceptableAlternatives || []).forEach((value) => answers.push(normalizeAnswerText(value)));
  }

  const unique = Array.from(new Set(answers.filter(Boolean)));
  return {
    exacts: unique.filter((value) => !value.includes("〜")),
    patterns: unique
      .filter((value) => value.includes("〜"))
      .map(patternFromPlaceholderAnswer)
      .filter(Boolean),
    speakerTaggedExpected: unique.some((value) => /(?:^|\n)[甲乙丙丁A-DＡ-Ｄ][：:]/.test(value))
  };
}

function canAcceptSpeakerlessAnswer(item, matcher) {
  if (matcher.speakerTaggedExpected) return false;
  return item.renderHint === "dialogue" || item.responseScope === "dialogue_only";
}

function normalizeSpeakerlessAnswer(value) {
  const normalized = String(value || "")
    .replace(/(?:^|\n)\s*[甲乙丙丁A-DＡ-Ｄ]\s*[：:]\s*/g, "\n")
    .replace(/^\n+/, "");
  return normalizeAnswerText(normalized);
}

function normalizeAnswerText(value) {
  if (Array.isArray(value)) return value.map((entry) => normalizeAnswerText(entry)).join("\n");
  const normalized = String(value || "")
    .normalize("NFKC")
    .replace(/\u3000/g, " ")
    .replace(/[A-Za-z]+/g, (textValue) => textValue.toUpperCase())
    .replace(/て\s*は\s*ありません/g, "ではありません")
    .replace(/て\s*は\s*ないです/g, "ではありません")
    .replace(/じゃありません/g, "ではありません")
    .replace(/じゃないです/g, "ではありません")
    .replace(/\s+/g, "")
    .replace(/\p{P}/gu, (mark) => mark === "〜" ? mark : "")
    .replace(/^ー+/, "")
    .trim();
  return normalizeAnswerLexicalVariants(normalized);
}

function normalizeAnswerLexicalVariants(value) {
  let normalized = value;
  sortedAnswerLexicalVariantGroups.forEach((group) => {
    const canonical = group[0];
    group.forEach((variant) => {
      normalized = normalized.split(variant).join(canonical);
    });
  });
  return normalized;
}

function normalizeChoiceIds(value) {
  return [...value].map(String).sort();
}

function patternFromPlaceholderAnswer(template) {
  const normalized = normalizeAnswerText(template);
  if (!normalized) return null;
  const escaped = escapeRegExp(normalized);
  const source = `^${escaped.replaceAll("〜", ".+?")}$`;
  return new RegExp(source);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function flattenActivityItems(activity) {
  return activity.itemGroups?.length
    ? activity.itemGroups.flatMap((group) => group.items)
    : activity.items;
}

function normalizeActivityRecord(activity, record) {
  if (!activity || !record) return record || null;
  const source = record.answers || record.answerRecord || record.submissions || record.values || record;
  const answers = { ...(record.answers || {}) };

  flattenActivityItems(activity).forEach((item) => {
    const normalized = normalizeStoredItemAnswer(item, source);
    if (normalized) answers[item.id] = normalized;
  });

  const grading = record.grading
    ? gradeActivity(activity, answers, record.grading.submittedAt || record.grading.summary?.submittedAt || record.updatedAt)
    : record.grading;

  return {
    ...record,
    answers,
    grading
  };
}

function normalizeStoredItemAnswer(item, source) {
  if (!source || typeof source !== "object") return null;
  const direct = source[item.id];

  if (item.choices?.length) {
    if (direct?.choiceIds?.length) return direct;
    const choiceIds = directChoiceIds(item, source, direct);
    return choiceIds.length ? { ...(typeof direct === "object" ? direct : {}), choiceIds } : null;
  }

  if (!item.inputSlots?.length) return direct && typeof direct === "object" ? direct : null;

  const slotValues = direct?.slotValues && typeof direct.slotValues === "object"
    ? { ...direct.slotValues }
    : {};

  if (typeof direct === "string") {
    slotValues[item.inputSlots[0]?.id || "answer"] ||= direct;
  } else if (direct && typeof direct === "object") {
    const directValue = direct.answer || direct.value || direct.text || direct.userAnswer;
    if (typeof directValue === "string") slotValues[item.inputSlots[0]?.id || "answer"] ||= directValue;
  }

  item.inputSlots.forEach((slot) => {
    if (slotValues[slot.id]) return;
    const value = firstStringValue([
      source[slotFieldName(item.id, slot.id)],
      source[`${item.id}.${slot.id}`],
      source[`${item.id}:${slot.id}`],
      source[`${item.id}_${slot.id}`],
      source[slot.id]
    ]);
    if (value) slotValues[slot.id] = value;
  });

  return Object.keys(slotValues).length
    ? { ...(direct && typeof direct === "object" ? direct : {}), slotValues }
    : null;
}

function directChoiceIds(item, source, direct) {
  if (Array.isArray(direct)) return direct.map(String);
  if (typeof direct === "string") return [direct];
  if (direct && typeof direct === "object") {
    const choice = direct.choiceId || direct.choice || direct.value || direct.answer || direct.userAnswer;
    if (Array.isArray(choice)) return choice.map(String);
    if (typeof choice === "string") return [choice];
  }
  return firstStringValue([
    source[`${item.id}::choice`],
    source[`${item.id}::__choice__`],
    source[`${item.id}.choice`]
  ], true);
}

function firstStringValue(values, asArray = false) {
  for (const value of values) {
    if (Array.isArray(value) && value.length) return asArray ? value.map(String) : String(value[0] || "");
    if (typeof value === "string" && value) return asArray ? [value] : value;
    if (value && typeof value === "object") {
      const nested = value.value || value.answer || value.userAnswer || value.text;
      if (typeof nested === "string" && nested) return asArray ? [nested] : nested;
    }
  }
  return asArray ? [] : "";
}

function activityProgressSummary(activity, record) {
  const items = flattenActivityItems(activity);
  const total = items.length;
  const completed = items.filter((item) => isItemAnswered(item, record?.answers?.[item.id])).length;
  const incorrect = items.filter((item) => record?.grading?.itemResults?.[item.id]?.status === "incorrect").length;
  return {
    total,
    completed,
    incorrect,
    percent: total ? Math.round((completed / total) * 100) : 0
  };
}

function isItemAnswered(item, answer) {
  if (!answer) return false;
  if (item.choices?.length) return Boolean(answer.choiceIds?.length);
  if (!item.inputSlots?.length) return false;
  return item.inputSlots.some((slot) => String(answer.slotValues?.[slot.id] || "").trim().length > 0)
    || Boolean(firstStoredSlotValue(answer.slotValues).trim());
}

function defaultFieldValue(item, slotId, storedAnswer, admin) {
  const stored = storedAnswer?.slotValues?.[slotId];
  if (Array.isArray(stored)) return stored.join("\n");
  if (typeof stored === "string") return stored;
  const legacyStored = firstStoredSlotValue(storedAnswer?.slotValues);
  if (legacyStored && (item.inputSlots?.length || 0) <= 1) return legacyStored;
  if (!admin) return "";
  const answer = item.answer?.slotValues?.[slotId];
  if (Array.isArray(answer)) return answer.join("\n");
  return typeof answer === "string" ? answer : "";
}

function firstStoredSlotValue(slotValues) {
  if (!slotValues || typeof slotValues !== "object") return "";
  for (const value of Object.values(slotValues)) {
    if (Array.isArray(value)) {
      const joined = value.join("\n");
      if (joined) return joined;
    } else if (typeof value === "string" && value) {
      return value;
    }
  }
  return "";
}

function resolveStoredChoiceIds(item, choiceIds) {
  if (!item.choices?.length || !choiceIds?.length) return choiceIds || [];
  const current = new Set(item.choices.map((choice) => choice.id));
  return choiceIds.map((choiceId) => {
    const normalized = String(choiceId);
    if (current.has(normalized)) return normalized;
    const generatedMatch = normalized.match(/-c(\d+)$/);
    if (!generatedMatch) return normalized;
    return item.choices[Number(generatedMatch[1]) - 1]?.id || normalized;
  });
}

function resolveItemResponseScopeHint(item, activityResponseScope, activityResponseScopeHint) {
  const ownHint = resolveResponseScopeHint(item.responseScope, item.responseScopeHint);
  if (!ownHint) return "";
  if (!activityResponseScopeHint) return ownHint;
  if (item.responseScope && item.responseScope !== activityResponseScope) return ownHint;
  if (item.responseScopeHint && item.responseScopeHint !== activityResponseScopeHint) return ownHint;
  return "";
}

function resolveResponseScopeHint(responseScope, responseScopeHint) {
  if (responseScopeHint) return responseScopeHint;
  if (!responseScope) return "";
  return "";
}

function resolveAudioGuidance(activity) {
  if (!activity.requiresAudio && !activity.audio) return "";
  return "请听完整段录音，每一道小题录音听完后可暂停，再在下方作答。";
}

function formatAttemptSummary(item, answer) {
  if (!answer) return "未作答";
  if (item.choices?.length) {
    const selected = new Set(resolveStoredChoiceIds(item, answer.choiceIds || []));
    const labels = item.choices.filter((choice) => selected.has(choice.id)).map((choice) => choice.label);
    return labels.length ? labels.join(" / ") : "未选择";
  }
  if (item.inputSlots?.length) {
    const values = item.inputSlots
      .map((slot) => String(answer.slotValues?.[slot.id] || "").trim())
      .filter(Boolean);
    if (!values.length) {
      const legacyValue = firstStoredSlotValue(answer.slotValues).trim();
      if (legacyValue) values.push(legacyValue);
    }
    return values.length ? values.join(" / ") : "未作答";
  }
  return "未作答";
}

function formatExpectedAnswerSummary(item) {
  if (item.choices?.length) {
    const expected = new Set(item.answer?.choiceIds || []);
    const labels = item.choices.filter((choice) => expected.has(choice.id)).map((choice) => choice.label);
    return labels.join(" / ");
  }

  const answers = [];
  if (item.inputSlots?.length) {
    item.inputSlots.forEach((slot) => {
      const slotValue = item.answer?.slotValues?.[slot.id];
      if (typeof slotValue === "string" && slotValue.trim()) answers.push(slotValue.trim());
    });
  }
  (item.answer?.acceptableAlternatives || []).forEach((value) => {
    if (String(value || "").trim()) answers.push(String(value).trim());
  });
  (item.answer?.modelAnswers || []).forEach((value) => {
    if (String(value || "").trim()) answers.push(String(value).trim());
  });

  return Array.from(new Set(answers)).join(" / ") || "暂无";
}

function buildAnswerComparison(item, answer) {
  if (item.choices?.length) {
    return {
      kind: "choice",
      actual: formatAttemptSummary(item, answer),
      expected: formatExpectedAnswerSummary(item)
    };
  }

  if (!item.inputSlots?.length) return null;
  const actual = formatAttemptSummary(item, answer);
  const candidates = expectedAnswerCandidates(item);
  if (!actual || !candidates.length) return null;
  const expected = closestExpectedAnswer(actual, candidates);
  const diffLines = gitLikeAnswerDiff(actual === "未作答" ? "" : actual, expected);
  return { kind: "text", actual, expected, diffLines };
}

function expectedAnswerCandidates(item) {
  const answers = [];
  if (item.inputSlots?.length) {
    item.inputSlots.forEach((slot) => {
      const slotValue = item.answer?.slotValues?.[slot.id];
      if (Array.isArray(slotValue)) {
        const value = slotValue.map((entry) => String(entry || "").trim()).filter(Boolean).join("\n");
        if (value) answers.push(value);
      } else if (typeof slotValue === "string" && slotValue.trim()) {
        answers.push(slotValue.trim());
      }
    });
  }
  (item.answer?.acceptableAlternatives || []).forEach((value) => {
    if (String(value || "").trim()) answers.push(String(value).trim());
  });
  (item.answer?.modelAnswers || []).forEach((value) => {
    if (String(value || "").trim()) answers.push(String(value).trim());
  });
  return Array.from(new Set(answers));
}

function closestExpectedAnswer(actual, candidates) {
  const actualNormalized = normalizeAnswerText(actual);
  return candidates
    .map((candidate) => ({
      candidate,
      distance: editDistance(actualNormalized, normalizeAnswerText(candidate))
    }))
    .sort((a, b) => a.distance - b.distance)[0]?.candidate || candidates[0];
}

function editDistance(left, right) {
  const a = Array.from(String(left || ""));
  const b = Array.from(String(right || ""));
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let row = 1; row <= a.length; row += 1) {
    const current = [row];
    for (let col = 1; col <= b.length; col += 1) {
      current[col] = a[row - 1] === b[col - 1]
        ? previous[col - 1]
        : Math.min(previous[col - 1], previous[col], current[col - 1]) + 1;
    }
    previous = current;
  }
  return previous[b.length] || 0;
}

function comparableAnswerText(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/^\s*(?:乙[0-9０-９]+|[甲乙丙丁]|[A-DＡ-Ｄ])\s*[：:]\s*/u, ""))
    .join("\n")
    .replace(/[ \t\u3000]+/g, "")
    .replace(/\p{P}/gu, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\n+|\n+$/g, "");
}

function diffComparableAnswerText(actual, expected) {
  const actualComparable = comparableAnswerText(actual);
  const expectedComparable = comparableAnswerText(expected);
  if (!actualComparable && !expectedComparable) return { actualParts: [], expectedParts: [] };
  return diffText(actualComparable, expectedComparable);
}

function comparableAnswerLines(value) {
  const comparable = comparableAnswerText(value);
  return comparable ? comparable.split("\n") : [];
}

function gitLikeAnswerDiff(actual, expected) {
  const actualLines = comparableAnswerLines(actual);
  const expectedLines = comparableAnswerLines(expected);
  const ops = diffLineOperations(actualLines, expectedLines);
  const rows = [];
  let index = 0;
  while (index < ops.length) {
    if (ops[index].type === "equal") {
      rows.push({ type: "context", parts: [{ type: "equal", text: ops[index].text || " " }] });
      index += 1;
      continue;
    }

    const deletes = [];
    const inserts = [];
    while (index < ops.length && ops[index].type !== "equal") {
      if (ops[index].type === "delete") deletes.push(ops[index].text);
      if (ops[index].type === "insert") inserts.push(ops[index].text);
      index += 1;
    }

    const length = Math.max(deletes.length, inserts.length);
    for (let pairIndex = 0; pairIndex < length; pairIndex += 1) {
      const deleted = deletes[pairIndex];
      const inserted = inserts[pairIndex];
      if (deleted != null && inserted != null) {
        const { actualParts, expectedParts } = diffComparableAnswerText(deleted, inserted);
        rows.push({ type: "delete", parts: actualParts.length ? actualParts : [{ type: "delete", text: deleted || " " }] });
        rows.push({ type: "insert", parts: expectedParts.length ? expectedParts : [{ type: "insert", text: inserted || " " }] });
      } else if (deleted != null) {
        rows.push({ type: "delete", parts: [{ type: "delete", text: deleted || " " }] });
      } else if (inserted != null) {
        rows.push({ type: "insert", parts: [{ type: "insert", text: inserted || " " }] });
      }
    }
  }
  return rows;
}

function diffLineOperations(actualLines, expectedLines) {
  const width = expectedLines.length + 1;
  const table = new Uint16Array((actualLines.length + 1) * width);
  for (let row = actualLines.length - 1; row >= 0; row -= 1) {
    for (let col = expectedLines.length - 1; col >= 0; col -= 1) {
      table[row * width + col] = actualLines[row] === expectedLines[col]
        ? table[(row + 1) * width + col + 1] + 1
        : Math.max(table[(row + 1) * width + col], table[row * width + col + 1]);
    }
  }

  const ops = [];
  let row = 0;
  let col = 0;
  while (row < actualLines.length && col < expectedLines.length) {
    if (actualLines[row] === expectedLines[col]) {
      ops.push({ type: "equal", text: actualLines[row] });
      row += 1;
      col += 1;
    } else if (table[(row + 1) * width + col] >= table[row * width + col + 1]) {
      ops.push({ type: "delete", text: actualLines[row] });
      row += 1;
    } else {
      ops.push({ type: "insert", text: expectedLines[col] });
      col += 1;
    }
  }
  while (row < actualLines.length) {
    ops.push({ type: "delete", text: actualLines[row] });
    row += 1;
  }
  while (col < expectedLines.length) {
    ops.push({ type: "insert", text: expectedLines[col] });
    col += 1;
  }
  return ops;
}

function diffText(actual, expected) {
  const a = Array.from(actual);
  const b = Array.from(expected);
  const width = b.length + 1;
  const table = new Uint16Array((a.length + 1) * width);
  for (let row = a.length - 1; row >= 0; row -= 1) {
    for (let col = b.length - 1; col >= 0; col -= 1) {
      table[row * width + col] = a[row] === b[col]
        ? table[(row + 1) * width + col + 1] + 1
        : Math.max(table[(row + 1) * width + col], table[row * width + col + 1]);
    }
  }

  const actualParts = [];
  const expectedParts = [];
  let row = 0;
  let col = 0;
  while (row < a.length && col < b.length) {
    if (a[row] === b[col]) {
      pushDiffPart(actualParts, "equal", a[row]);
      pushDiffPart(expectedParts, "equal", b[col]);
      row += 1;
      col += 1;
    } else if (table[(row + 1) * width + col] >= table[row * width + col + 1]) {
      pushDiffPart(actualParts, "delete", a[row]);
      row += 1;
    } else {
      pushDiffPart(expectedParts, "insert", b[col]);
      col += 1;
    }
  }
  while (row < a.length) {
    pushDiffPart(actualParts, "delete", a[row]);
    row += 1;
  }
  while (col < b.length) {
    pushDiffPart(expectedParts, "insert", b[col]);
    col += 1;
  }

  return { actualParts, expectedParts };
}

function pushDiffPart(parts, type, text) {
  const last = parts[parts.length - 1];
  if (last?.type === type) {
    last.text += text;
    return;
  }
  parts.push({ type, text });
}

function exampleDialogueLines(parts, kana) {
  if (!parts?.length || parts.some((part) => part.type !== "text" || part.kana || part.underline || part.substitutionKey)) return null;
  const text = parts.map((part) => part.text).join("").trim();
  if (!/甲：|乙/.test(text)) return null;
  const textLines = splitDialogueContent(text);
  const kanaLines = kana ? splitDialogueContent(kana) : [];
  if (!textLines.length) return null;
  return textLines.map((line, index) => ({
    speaker: line.speaker,
    text: line.body,
    kana: kanaLines[index]?.body || ""
  }));
}

function splitDialogueContent(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?=(?:甲|乙|丙|丁|A|B|C|D|乙1|乙2)：)/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const matched = line.match(/^([^：]+)：\s*(.*)$/);
      return matched ? { speaker: matched[1], body: matched[2] } : null;
    })
    .filter(Boolean);
}

function splitRubySegments(text, kana) {
  const sourceText = String(text || "");
  const sourceKana = String(kana || "");
  if (!sourceText || !sourceKana || sourceText === sourceKana || isKanaOnly(sourceText)) {
    return [{ type: "text", text: sourceText }];
  }

  const runs = splitRubyRuns(sourceText);
  if (!runs.some((run) => run.annotatable)) return [{ type: "text", text: sourceText }];

  let remainingKana = sourceKana;
  const segments = [];
  runs.forEach((run, index) => {
    if (!run.annotatable) {
      segments.push({ type: "text", text: run.text });
      remainingKana = consumePlainText(remainingKana, run.text);
      return;
    }

    const nextPlainText = findAnchorPlainText(remainingKana, runs.slice(index + 1));
    let reading = "";
    if (nextPlainText) {
      const boundaryIndex = findPlainTextBoundary(remainingKana, nextPlainText);
      if (boundaryIndex > -1) {
        reading = remainingKana.slice(0, boundaryIndex);
        remainingKana = remainingKana.slice(boundaryIndex);
      }
    } else {
      reading = remainingKana;
      remainingKana = "";
    }

    if (!reading || reading === run.text) {
      segments.push({ type: "text", text: run.text });
      return;
    }

    segments.push({ type: "ruby", text: run.text, kana: reading });
  });

  if (!segments.some((segment) => segment.type === "ruby")) {
    return [{ type: "text", text: sourceText }];
  }
  return segments.filter((segment) => segment.text);
}

function splitRubyRuns(value) {
  const chars = Array.from(String(value || ""));
  const runs = [];

  chars.forEach((char) => {
    const annotatable = isRubyTargetChar(char);
    const previous = runs[runs.length - 1];
    if (previous && previous.annotatable === annotatable) {
      previous.text += char;
      return;
    }
    runs.push({ text: char, annotatable });
  });

  return runs;
}

function isRubyTargetChar(char) {
  return /[\u3400-\u4dbf\u4e00-\u9fff々〇〆ヶヵ0-9０-９]/.test(String(char || ""));
}

function findAnchorPlainText(remainingKana, futureRuns) {
  for (const run of futureRuns) {
    if (run.annotatable || !run.text) continue;
    if (findPlainTextBoundary(remainingKana, run.text) > -1) return run.text;
  }
  return "";
}

function findPlainTextBoundary(remainingKana, plainText) {
  const exactIndex = remainingKana.indexOf(plainText);
  if (exactIndex > -1) return exactIndex;

  const anchor = plainText.replace(/[A-Za-z]+/g, "");
  if (!anchor) return -1;
  return remainingKana.indexOf(anchor);
}

function consumePlainText(remainingKana, plainText) {
  if (!remainingKana || !plainText) return remainingKana;
  if (remainingKana.startsWith(plainText)) return remainingKana.slice(plainText.length);

  let cursor = remainingKana;
  const segments = plainText.match(/[A-Za-z]+|[^A-Za-z]+/g) || [plainText];
  segments.forEach((segment) => {
    if (!segment) return;
    if (cursor.startsWith(segment)) {
      cursor = cursor.slice(segment.length);
      return;
    }

    if (/^[A-Za-z]+$/.test(segment)) {
      const katakanaChunk = cursor.match(/^[\u30a0-\u30ffー]+/);
      if (katakanaChunk) cursor = cursor.slice(katakanaChunk[0].length);
    }
  });
  return cursor;
}

function isKanaOnly(value) {
  return /^[\u3040-\u30ffー\s・、。！？（）]+$/.test(String(value || ""));
}
