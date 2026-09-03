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
  open_response: "开放题结构判分",
  self_check: "自检",
  manual_review: "人工复核"
};

const textbookAudioBaseUrl = "https://japaflow-audio-bucket.oss-cn-shanghai.aliyuncs.com/textbook-audio";
const CHOICE_RESULT_KEY = "__choice__";
const ANSWER_ALTERNATIVE_CACHE_KEY = "japaflow.practice.acceptedAlternatives.v1";
const HOME_PROGRESS_SNAPSHOT_PREFIX = "japaflow.practice.home-progress.v1";
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
  const preview = Boolean(practice.preview);
  const [session, setSession] = useState({ lessonId: practice.lessonId, activities: {} });
  const [sessionLoadKey, setSessionLoadKey] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [answerAlternatives, setAnswerAlternatives] = useState({});
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
    if (!isReady) return;
    const progress = activities.reduce((total, activity) => {
      const record = normalizeActivityRecord(activity, session.activities?.[activity.id]);
      const activityProgress = activityProgressSummary(activity, record);
      return {
        completed: total.completed + activityProgress.completed,
        total: total.total + activityProgress.total
      };
    }, { completed: 0, total: 0 });
    window.localStorage.setItem(homeProgressSnapshotKey(practice.lessonId), JSON.stringify({
      lessonId: practice.lessonId,
      practiceSetId,
      ...progress,
      updatedAt: new Date().toISOString()
    }));
  }, [activities, isReady, practice.lessonId, practiceSetId, session]);

  useEffect(() => {
    window.initPracticeAnswerFormatter?.();
  }, [currentActivity?.id, sessionLoadKey, admin]);

  useEffect(() => {
    if (!currentActivity?.id || typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [currentActivity?.id]);

  useEffect(() => {
    let mounted = true;
    loadAcceptedAnswerAlternatives(practice.lessonId).then((alternatives) => {
      if (mounted) setAnswerAlternatives(alternatives);
    });
    return () => {
      mounted = false;
    };
  }, [practice.lessonId]);

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
                title={activity.title}
              >
                <small>
                  {sectionLabel[activity.section]} · {activity.order}
                  <em className={`activity-nav-mobile-count${progress.percent === 100 ? " complete" : ""}`}> · {progress.completed}/{progress.total}</em>
                </small>
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
        <div className="practice-progress-dots" aria-label={`当前第 ${Math.max(0, activities.findIndex((activity) => activity.id === currentActivity?.id) + 1)} 题，共 ${activities.length} 题`}>
          {activities.map((activity, index) => <i key={activity.id} className={activity.id === currentActivity?.id ? "active" : ""} title={`第 ${index + 1} 题`} />)}
        </div>
      </aside>

      <section className="practice-content">
        {admin ? <PracticePublishPanel lessonId={practice.lessonId} practice={practice} localPractice={localPractice} /> : null}
        {admin ? (
          <PracticeAlternativeSyncPanel
            lessonId={practice.lessonId}
            practice={practice}
            answerAlternatives={answerAlternatives}
          />
        ) : null}
        {!admin && !isPublished && !preview ? (
          <UnpublishedPracticeNotice />
        ) : currentActivity ? (
          <PracticeActivity
            key={`${currentActivity.id}:${sessionLoadKey}:${admin ? "admin" : "user"}`}
            activity={currentActivity}
            practice={practice}
            admin={admin}
            record={currentRecord}
            isReady={isReady}
            answerAlternatives={answerAlternatives}
            onAnswerAlternativesChange={setAnswerAlternatives}
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

function homeProgressSnapshotKey(lessonId) {
  let user = {};
  try {
    user = JSON.parse(window.localStorage.getItem("light_blog_user") || "{}") || {};
  } catch {
    user = {};
  }
  const token = window.localStorage.getItem("light_blog_token") || "";
  const identity = user.id || user.userId || user.email || user.username || token.slice(-16) || "guest";
  const numericLessonId = String(lessonId).match(/\d+/)?.[0] || String(lessonId);
  return `${HOME_PROGRESS_SNAPSHOT_PREFIX}:${encodeURIComponent(String(identity)).replace(/%/g, "_")}:${numericLessonId}`;
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

function PracticePublishPanel({ lessonId, practice, localPractice }) {
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const lessonNo = String(lessonId || "").match(/\d+/)?.[0] || "";
  const generateCommand = lessonNo
    ? `practise-generete-prompt-v3.md generate lesson ${lessonNo} data`
    : "practise-generete-prompt-v3.md generate lesson N data";
  const canPublish = Boolean(localPractice?.activities?.length);
  const databaseVersion = practice.practiceVersion || null;

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
          <p>
            {localPractice.title} · {localPractice.activities.length} 题
            {databaseVersion ? ` · 当前数据库 version ${databaseVersion}` : " · 当前未加载数据库版本"}
          </p>
        ) : (
          <p>未找到本课本地练习数据。请先生成 `practice/lesson{lessonNo || "N"}-practice-data.ts`，例如：`{generateCommand}`。</p>
        )}
      </div>
      <div className="admin-publish-actions">
        <button type="button" className="secondary-action" onClick={handlePublish} disabled={!canPublish || status.state === "pending"}>
          {databaseVersion ? "重新发布为新版本" : "发布到数据库"}
        </button>
        {status.message ? <span className={`admin-publish-status ${status.state}`}>{status.message}</span> : null}
      </div>
    </section>
  );
}

function PracticeAlternativeSyncPanel({ lessonId, practice, answerAlternatives }) {
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [syncedVersion, setSyncedVersion] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const syncPlan = useMemo(
    () => buildAcceptedAnswerAlternativeSyncPlan(practice, answerAlternatives),
    [practice, answerAlternatives]
  );

  if (!syncPlan.answerCount && !syncedVersion) return null;

  const handleSync = async () => {
    if (!syncPlan.answerCount || status.state === "pending") return;
    setStatus({ state: "pending", message: "同步中..." });
    try {
      const published = await practiceSessionApi.publishPracticeVersion({
        lessonId,
        practice: syncPlan.practice,
        sourcePromptName: "practice-answer-alternative-sync",
        sourcePromptHash: ""
      });
      setSyncedVersion(published.version);
      setStatus({ state: "success", message: `已同步到 version ${published.version}，刷新后加载数据库版本。` });
    } catch (error) {
      setStatus({ state: "error", message: String(error.message || error) });
    }
  };

  return (
    <section className="admin-publish-panel admin-alternative-sync-panel">
      <div>
        <strong>候选答案同步</strong>
        {syncedVersion ? (
          <p>候选答案已写入数据库 version {syncedVersion}。</p>
        ) : (
          <p>
            有 {syncPlan.itemCount} 个练习题存在 {syncPlan.answerCount} 个候选答案，建议同步到数据库。
          </p>
        )}
      </div>
      <div className="admin-publish-actions">
        <button
          type="button"
          className="secondary-action compact-action"
          onClick={() => setExpanded((value) => !value)}
          disabled={!syncPlan.answerCount}
        >
          {expanded ? "收起明细" : "查看明细"}
        </button>
        <button
          type="button"
          className="secondary-action"
          onClick={handleSync}
          disabled={!syncPlan.answerCount || status.state === "pending" || Boolean(syncedVersion)}
        >
          同步到数据库
        </button>
        {status.message ? <span className={`admin-publish-status ${status.state}`}>{status.message}</span> : null}
      </div>
      {expanded && syncPlan.details.length ? (
        <div className="admin-alternative-details">
          {syncPlan.details.map((detail) => (
            <article className="admin-alternative-detail" key={`${detail.itemId}:${detail.slotId}`}>
              <div className="admin-alternative-detail-head">
                <strong>{detail.activityTitle}</strong>
                <span>{detail.itemNumber ? `题号 ${detail.itemNumber}` : detail.itemId}{detail.slotId !== "answer" ? ` · ${detail.slotId}` : ""}</span>
              </div>
              {detail.promptText ? <p className="admin-alternative-prompt">{detail.promptText}</p> : null}
              <div className="admin-answer-columns">
                <div>
                  <em>当前数据库答案</em>
                  {detail.standardAnswers.map((answer, index) => <code key={index}>{answer}</code>)}
                </div>
                <div>
                  <em>待同步候选答案</em>
                  {detail.candidateAnswers.map((answer, index) => <code key={index}>{answer}</code>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function PracticeActivity({ activity, practice, admin, record, isReady, answerAlternatives, onAnswerAlternativesChange, onSave, previousActivity, nextActivity, onNavigate }) {
  const layout = activity.layout || [];
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
    let grading = gradeActivity(activity, answers, undefined, answerAlternatives);
    const needsReview = hasIncorrectTextAnswers(activity, grading);
    setSubmitStatus({ state: "pending", message: needsReview ? "正在复核可能的可接受答案..." : "提交中..." });
    try {
      const review = needsReview
        ? await reviewIncorrectTextAnswers({ practice, activity, answers, grading, answerAlternatives })
        : { alternatives: answerAlternatives, acceptedCount: 0, reviewedCount: 0 };
      if (review.acceptedCount > 0) {
        onAnswerAlternativesChange(review.alternatives);
        writeLocalAcceptedAnswerAlternatives(practice.lessonId, review.alternatives);
        grading = {
          ...gradeActivity(activity, answers, undefined, review.alternatives),
          answerReview: {
            reviewedCount: review.reviewedCount,
            acceptedCount: review.acceptedCount
          }
        };
      }
      await onSave(activity.id, {
        answers,
        grading
      }, activity);
      setSubmitStatus({
        state: "success",
        message: review.acceptedCount > 0 ? `已提交，采纳 ${review.acceptedCount} 个可接受答案` : "已提交"
      });
    } catch (error) {
      setSubmitStatus({ state: "error", message: String(error.message || error) });
    }
  };

  return (
    <article className="practice-activity practice-activity-single" id={activity.id}>
      <div className="activity-head">
        <div>
          <span className="activity-kicker">{sectionLabel[activity.section]} · {activity.order}</span>
          <h2><span className="activity-kicker-inline">{sectionLabel[activity.section]} · {activity.order}</span>{activity.title}</h2>
          {activity.instruction ? <p>{activity.instruction}</p> : null}
        </div>
      </div>

      <ActivityAudio activity={activity} audioUrl={audioUrl} />
      <ActivityResources activity={activity} assetMap={assetMap} />

      <form ref={formRef} className="activity-form" onSubmit={(event) => event.preventDefault()}>
        {layout.length ? (
          <div className="layout-blocks">
            {layout.map((block, index) => <LayoutBlockView key={index} block={block} />)}
          </div>
        ) : null}
        {activityResponseScopeHint ? <div className="response-scope-callout">{activityResponseScopeHint}</div> : null}

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
          <div className="activity-nav-actions activity-nav-actions-mobile">
            {previousActivity ? (
              <button type="button" className="secondary-action" onClick={() => onNavigate(previousActivity.id)}>上一题</button>
            ) : null}
            {nextActivity ? (
              <button type="button" className="secondary-action" onClick={() => onNavigate(nextActivity.id)}>下一题</button>
            ) : null}
          </div>
          {activity.requiresAudio || activity.audio ? (
            <p className="submit-audio-hint">提示：录音转写可能不准确，提交前请人工核对。</p>
          ) : null}
          {submitStatus.message ? <p className={`submit-status-message ${submitStatus.state}`}>{submitStatus.message}</p> : null}
        </div>
        <div className="activity-nav-actions activity-nav-actions-desktop">
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

function ActivityAudio({ activity, audioUrl }) {
  const hasAudio = activity.requiresAudio || activity.audio;
  if (!hasAudio) return null;
  const audioGuidance = hasAudio ? resolveAudioGuidance(activity) : "";

  return (
    <>
      <div className={`audio-placeholder ${audioUrl ? "ready" : "pending"}`}>
        {audioUrl ? <audio controls src={audioUrl}></audio> : <span>录音待补充</span>}
      </div>
      {audioGuidance ? <p className="audio-guidance">{audioGuidance}</p> : null}
    </>
  );
}

function ActivityResources({ activity, assetMap }) {
  const groupAssetIds = new Set((activity.itemGroups || []).flatMap((group) => group.displayAssets || []));
  const activityAssetIds = (activity.displayAssets || []).filter((assetId) => !groupAssetIds.has(assetId));
  const hasAssets = Boolean(activityAssetIds.length);
  if (!hasAssets) return null;

  return (
    <div className="activity-resource-panel">
      <DisplayAssets assetIds={activityAssetIds} assetMap={assetMap} />
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
  const pairedRows = pairedExampleRows(example);
  if (pairedRows.length) {
    return (
      <div className="example-block paired-example">
        {example.label ? <span className="example-label">{example.label}</span> : null}
        <span className="example-pair-list">
          {pairedRows.map((row, index) => (
            <span className="example-pair-row" key={index}>
              <span className="example-before"><RubyText text={row.before} kana={row.beforeKana} /></span>
              <span className="example-arrow">→</span>
              <span className="example-after"><RubyText text={row.after} kana={row.afterKana} /></span>
            </span>
          ))}
        </span>
      </div>
    );
  }
  const dialogueLines = exampleDialogueLines(example.after, example.afterKana);
  const tripCompositionLines = example.renderHint === "trip_composition"
    ? splitExampleTextLines(promptPartsPlainText(example.after || []))
    : [];
  const tripCompositionKanaLines = example.renderHint === "trip_composition"
    ? splitExampleTextLines(example.afterKana || "")
    : [];
  return (
    <div className={`example-block ${dialogueLines ? "dialogue-example" : ""}`}>
      <span className="example-head">
        {example.label ? <span className="example-label">{example.label}</span> : null}
        {example.beforeParts?.length ? (
          <span className="example-before"><Prompt parts={example.beforeParts} kana={example.beforeKana} /></span>
        ) : example.before ? (
          <span className="example-before"><RubyText text={example.before} kana={example.beforeKana} /></span>
        ) : null}
        <span className="example-arrow">→</span>
      </span>
      {dialogueLines ? (
        <span className="example-after dialogue-lines">
          {dialogueLines.map((line, index) => (
            <span className="dialogue-line" key={index}>
              <span>{line.speaker}</span>
              <p><Prompt parts={line.parts} kana={line.kana} /></p>
            </span>
          ))}
        </span>
      ) : tripCompositionLines.length ? (
        <span className="example-after trip-composition-lines">
          {tripCompositionLines.map((line, index) => (
            <span key={index}><RubyText text={line} kana={tripCompositionKanaLines[index] || ""} /></span>
          ))}
        </span>
      ) : (
        <span className="example-after"><Prompt parts={example.after} kana={example.afterKana} /></span>
      )}
    </div>
  );
}

function pairedExampleRows(example) {
  const before = splitExampleTextLines(example.before || promptPartsPlainText(example.beforeParts || []));
  const after = splitExampleTextLines(promptPartsPlainText(example.after || []));
  if (before.length < 2 || before.length !== after.length) return [];
  const beforeKana = splitExampleTextLines(example.beforeKana || "");
  const afterKana = splitExampleTextLines(example.afterKana || "");
  return before.map((line, index) => ({
    before: line,
    beforeKana: beforeKana[index] || "",
    after: after[index],
    afterKana: afterKana[index] || ""
  }));
}

function splitExampleTextLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
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
      {item.evaluationMode === "open_response" ? (
        <p>回答未满足本题要求的时间、范围或句型结构，请检查后重新作答。</p>
      ) : (
        <AnswerComparison item={item} answer={answer} result={result} />
      )}
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

function AnswerComparison({ item, answer, result }) {
  const comparison = buildAnswerComparison(item, answer, result);
  if (!comparison) return null;
  if (comparison.kind === "choice") {
    return (
      <div className="answer-diff answer-comparison" aria-label="答案对比">
        <div className="answer-diff-head"><strong>答案对比</strong></div>
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

function answerComparisonRows(item, answer) {
  if (item.inputSlots?.length) {
    return item.inputSlots.map((slot) => ({
      id: slot.id,
      label: item.inputSlots.length > 1 ? (slot.label || slot.id) : "",
      actual: String(answer?.slotValues?.[slot.id] || ""),
      expected: answerValuesForSlot(item, slot.id).join(" / ")
    }));
  }
  if (item.choices?.length) {
    const labels = new Map(item.choices.map((choice) => [choice.id, choice.label]));
    return [{
      id: "choice",
      label: "",
      actual: (answer?.choiceIds || []).map((id) => labels.get(id) || id).join(" / "),
      expected: (item.answer?.choiceIds || []).map((id) => labels.get(id) || id).join(" / ")
    }];
  }
  return [];
}

function PracticeItemView({ item, admin, storedAnswer, gradingResult, activityResponseScope, activityResponseScopeHint }) {
  const itemResponseScopeHint = resolveItemResponseScopeHint(item, activityResponseScope, activityResponseScopeHint);
  return (
    <section className={`practice-item ${item.renderHint || "inline"}`} data-item-status={gradingResult?.status || "idle"}>
      {gradingResult?.status === "incorrect" && item.evaluationMode !== "open_response" ? (
        <IncorrectReasonPopover item={item} answer={storedAnswer} result={gradingResult} />
      ) : null}
      {gradingResult?.status === "correct" && item.answerSource !== "personal" && item.evaluationMode !== "open_response" ? (
        <CorrectAnswerComparisonPopover item={item} answer={storedAnswer} />
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
        <>
          <button
            type="button"
            className="incorrect-reason-backdrop"
            aria-label="关闭错误原因"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="incorrect-reason-panel"
            id={popoverId}
            role="dialog"
            aria-label={`第 ${item.number} 题错误原因`}
            onClick={(event) => event.stopPropagation()}
          >
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
        </>
      ) : null}
    </div>
  );
}

function CorrectAnswerComparisonPopover({ item, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverId = `${item.id}-answer-comparison`;
  const exact = isExactCorrectAnswer(item, answer);
  const resultLabel = exact ? "完全正确" : "答案等价";

  return (
    <div className="incorrect-reason-popover correct-answer-popover">
      <button
        type="button"
        className={`incorrect-reason-trigger correct-answer-trigger${exact ? "" : " equivalent-answer-trigger"}`}
        aria-label={`第 ${item.number} 题${resultLabel}，查看答案对比`}
        title={resultLabel}
        aria-expanded={isOpen}
        aria-controls={popoverId}
        onClick={() => setIsOpen((value) => !value)}
      >
        ✓
      </button>
      {isOpen ? (
        <>
          <button className="incorrect-reason-backdrop" type="button" aria-label="关闭答案对比" onClick={() => setIsOpen(false)} />
          <div className="incorrect-reason-panel correct-answer-panel" id={popoverId} role="dialog" aria-label={`第 ${item.number} 题答案对比`} onClick={(event) => event.stopPropagation()}>
            <div className="incorrect-reason-head correct-answer-head">
              <strong>{resultLabel} · 答案对比</strong>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="关闭答案对比">×</button>
            </div>
            <CorrectAnswerComparison item={item} answer={answer} />
          </div>
        </>
      ) : null}
    </div>
  );
}

function isExactCorrectAnswer(item, attempt) {
  if (item.choices?.length) {
    const actual = normalizeChoiceIds(attempt?.choiceIds || []);
    const expected = normalizeChoiceIds(item.answer?.choiceIds || []);
    return actual.length === expected.length && actual.every((choiceId, index) => choiceId === expected[index]);
  }
  if (!item.inputSlots?.length) return false;
  return item.inputSlots.every((slot) => {
    const expected = primaryAnswerValueForSlot(item, slot.id);
    const actual = String(attempt?.slotValues?.[slot.id] || "").trim();
    return Boolean(expected) && actual === expected;
  });
}

function primaryAnswerValueForSlot(item, slotId) {
  const value = item.answer?.slotValues?.[slotId];
  return Array.isArray(value) ? value.map((entry) => String(entry || "").trim()).filter(Boolean).join("\n") : String(value || "").trim();
}

function CorrectAnswerComparison({ item, answer }) {
  const rows = answerComparisonRows(item, answer);
  if (!rows.length) return null;
  return (
    <div className="answer-diff answer-comparison" aria-label="答案对比">
      {rows.map((row) => (
        <div className="answer-comparison-row" key={row.id}>
          {row.label ? <strong>{row.label}</strong> : null}
          <AnswerComparisonBlock tone="user" label="我的答案" value={row.actual || "未作答"} />
          <AnswerComparisonBlock tone="expected" label="标准答案" value={row.expected || "暂无"} />
        </div>
      ))}
    </div>
  );
}

function Choices({ choices, item, admin, storedAnswer, gradingResult }) {
  const storedChoiceIds = resolveStoredChoiceIds(item, storedAnswer?.choiceIds || []);
  const currentChoiceIds = storedAnswer ? storedChoiceIds : (admin ? item.answer?.choiceIds || [] : []);
  const currentChoiceIdSet = new Set(currentChoiceIds);
  const isMultiChoice = (item.answer?.choiceIds || []).length > 1;
  const choiceResult = gradingResult?.fieldResults?.[CHOICE_RESULT_KEY] || gradingResult?.status;
  return (
    <>
      <div className="choice-row">
        {choices.map((choice) => (
          <label key={choice.id} data-result={currentChoiceIdSet.has(choice.id) ? choiceResult || undefined : undefined}>
            <input
              type={isMultiChoice ? "checkbox" : "radio"}
              name={item.id}
              value={choice.id}
              defaultChecked={currentChoiceIdSet.has(choice.id)}
            />
            <span>{choice.label}</span>
          </label>
        ))}
      </div>
      <PracticeAiNote item={item} slot={{ id: "choice" }} />
    </>
  );
}

function InputSlotView({ item, slot, admin, storedAnswer, gradingResult }) {
  const defaultValue = defaultFieldValue(item, slot.id, storedAnswer, admin);
  const className = `practice-input ${slot.width || "medium"}${slot.multiline || slot.expectedUnit === "dialogue" ? " multiline" : ""}`;
  const label = `${item.number} ${slot.id}`;
  const placeholder = slot.placeholder || slot.expectedUnit;
  const result = gradingResult?.fieldResults?.[slot.id];

  if (slot.choices?.length) {
    const fieldName = slotFieldName(item.id, slot.id);
    return (
      <fieldset className="slot-choice-group" data-result={result || undefined}>
        <legend>{slot.label || `${item.number} ${slot.id}`}</legend>
        {slot.choices.map((choice) => (
          <label key={choice.id}>
            <input type="radio" name={fieldName} value={choice.label} defaultChecked={defaultValue === choice.label} />
            <span>{choice.label}</span>
          </label>
        ))}
      </fieldset>
    );
  }

  if (slot.multiline || slot.expectedUnit === "dialogue") {
    return (
      <div className="practice-input-with-notes">
        <textarea name={slotFieldName(item.id, slot.id)} className={className} rows={slot.rows || 3} aria-label={label} placeholder={placeholder} defaultValue={defaultValue} data-result={result || undefined} />
        <PracticeAiNote item={item} slot={slot} />
      </div>
    );
  }
  return (
    <div className="practice-input-with-notes">
      <input name={slotFieldName(item.id, slot.id)} className={className} aria-label={label} placeholder={placeholder} defaultValue={defaultValue} data-result={result || undefined} />
      <PracticeAiNote item={item} slot={slot} />
    </div>
  );
}

const PRACTICE_AI_NOTES_KEY = "japaflow.practice.aiNotes.v1";

function PracticeAiNote({ item, slot }) {
  const key = `${item.id}:${slot.id}`;
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [draft, setDraft] = useState("");
  const [answer, setAnswer] = useState("");
  const [savedNotes, setSavedNotes] = useState(() => notesForPracticeAiKey(key));
  const [status, setStatus] = useState("");
  const [colorPickerId, setColorPickerId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingText, setEditingText] = useState("");
  const addSavedNote = ({ text, kind = "note", color }) => {
    const all = readPracticeAiNotes();
    const next = [...notesForPracticeAiKey(key), { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, kind, color: color || (kind === "ai" ? "purple" : "yellow") }];
    all[key] = next;
    writePracticeAiNotes(all);
    setSavedNotes(next);
  };
  const ask = async () => {
    if (!draft.trim()) return setStatus("请输入问题。");
    setStatus("思考中…"); setAnswer("");
    try {
      const response = await fetch("/api/grammar/notebook-ai", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("light_blog_token") || ""}` }, body: JSON.stringify({ question: draft, lessonId: item.id, pageNo: slot.id }) });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401 || response.status === 403) {
        notifyPracticeAiAuthExpired();
        throw new Error("登录已失效，正在跳转登录页。");
      }
      if (!response.ok) throw new Error(data.error || data.message || "AI 请求失败。");
      const nextAnswer = practiceAiAnswerFromResponse(data);
      if (!nextAnswer) return setStatus("AI 未返回可保存的回答，请重试。");
      setAnswer(nextAnswer); setStatus("回答已生成。");
    } catch (error) { setStatus(error.message || "AI 请求失败。"); }
  };
  const closePanel = () => {
    if (!open || closing) return;
    setClosing(true);
    window.setTimeout(() => { setOpen(false); setClosing(false); setDraft(""); setAnswer(""); setStatus(""); }, 180);
  };
  const saveDraft = () => {
    const text = answer ? `问：${draft.trim()}\n答：${answer.trim()}` : draft.trim();
    if (!text) return;
    addSavedNote({ text, kind: answer ? "ai" : "note" });
    closePanel();
  };
  const erase = (noteId) => {
    const all = readPracticeAiNotes();
    const next = notesForPracticeAiKey(key).filter((note) => note.id !== noteId);
    if (next.length) all[key] = next; else delete all[key];
    writePracticeAiNotes(all); setSavedNotes(next);
  };
  const changeColor = (noteId, color) => {
    const all = readPracticeAiNotes();
    const next = notesForPracticeAiKey(key).map((note) => note.id === noteId ? { ...note, color } : note);
    all[key] = next; writePracticeAiNotes(all); setSavedNotes(next); setColorPickerId("");
  };
  const saveEdit = (noteId) => {
    const text = editingText.trim();
    if (!text) return;
    const all = readPracticeAiNotes();
    const next = notesForPracticeAiKey(key).map((note) => note.id === noteId ? { ...note, text } : note);
    all[key] = next; writePracticeAiNotes(all); setSavedNotes(next); setEditingId(""); setEditingText("");
  };
  const autoResize = (event) => { const textarea = event.currentTarget; textarea.style.height = "auto"; textarea.style.height = `${Math.max(38, textarea.scrollHeight)}px`; };
  return <div className="practice-ai-note">
    <div className="practice-note-tools">
      <button type="button" className={`practice-note-trigger${open ? " active" : ""}`} onClick={() => open ? closePanel() : (setClosing(false), setOpen(true))} aria-expanded={open} aria-pressed={open} title="问 AI 或记笔记"><span>✦</span></button>
    </div>
    {open || closing ? <div className={`practice-note-panel${closing ? " closing" : ""}`}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onInput={autoResize} placeholder="写下笔记，或输入想问 AI 的问题…" rows="1" autoFocus />{answer ? <div className="practice-ai-answer" aria-label="AI 回答"><strong>AI 回答</strong><p>{answer}</p></div> : null}{status ? <small>{status}</small> : null}{draft.trim() ? <div className="practice-note-actions"><button type="button" onClick={saveDraft}>保存笔记</button><button type="button" onClick={ask}>问 AI</button></div> : null}</div> : null}
    {savedNotes.length ? <div className="practice-ai-saved-list">{savedNotes.map((note) => <article className={`practice-ai-saved note-color-${note.color || (note.kind === "ai" ? "purple" : "yellow")}`} key={note.id} title="点击更改颜色，双击编辑笔记" onClick={(event) => { if (event.target.closest("textarea, button") || editingId) return; setColorPickerId((value) => value === note.id ? "" : note.id); }} onDoubleClick={(event) => { event.preventDefault(); event.stopPropagation(); setEditingId(note.id); setEditingText(note.text); setColorPickerId(""); }}>
      <button type="button" className="practice-ai-erase" onClick={(event) => { event.stopPropagation(); erase(note.id); }} aria-label="删除笔记" title="删除笔记">⌫</button>
      {editingId === note.id ? <div className="practice-note-edit" onClick={(event) => event.stopPropagation()}><textarea value={editingText} onChange={(event) => setEditingText(event.target.value)} onInput={autoResize} rows="2" autoFocus /><button type="button" onClick={(event) => { event.stopPropagation(); saveEdit(note.id); }}>保存修改</button></div> : <pre>{note.text}</pre>}
      {colorPickerId === note.id ? <div className="practice-note-color-picker" onClick={(event) => event.stopPropagation()}>{["yellow", "purple", "green", "blue", "pink"].map((color) => <button className={`note-color-choice ${color}`} type="button" key={color} onClick={() => changeColor(note.id, color)} aria-label={`标记为${color}`}/>)}</div> : null}
    </article>)}</div> : null}
  </div>;
}

function practiceAiAnswerFromResponse(data) { return String([data?.answer, data?.data?.answer, data?.content, data?.data?.content].find((value) => typeof value === "string" && value.trim()) || "").trim(); }
function notifyPracticeAiAuthExpired() {
  window.localStorage.removeItem("light_blog_token");
  window.localStorage.removeItem("light_blog_user");
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "AUTH_EXPIRED" }, window.location.origin);
    return;
  }
  const mainApp = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://groundedglow.cc";
  window.location.href = `${mainApp}/login?redirect=${encodeURIComponent(window.location.href)}`;
}
function readPracticeAiNotes() { try { return JSON.parse(localStorage.getItem(PRACTICE_AI_NOTES_KEY) || "{}"); } catch { return {}; } }
function writePracticeAiNotes(notes) { localStorage.setItem(PRACTICE_AI_NOTES_KEY, JSON.stringify(notes)); }
function notesForPracticeAiKey(key) {
  const stored = readPracticeAiNotes()[key];
  const entries = Array.isArray(stored) ? stored : stored ? [{ id: "legacy", text: stored }] : [];
  return entries.map((note, index) => typeof note === "string" ? { id: `legacy-${index}`, text: note, kind: "note", color: "yellow" } : { ...note, kind: note.kind || "note", color: note.color || (note.kind === "ai" ? "purple" : "yellow") });
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
  const partsWithKana = applyPromptKanaToTextParts(parts, kana);
  return (
    <>
      {partsWithKana.map((part, index) => {
        if (part.type === "text") return <RichText key={index} part={part} />;
        if (part.type === "blank") {
          if (part.display === "parentheses") {
            return <span className="inline-blank parentheses-blank" data-slot-id={part.slotId} key={index}>（　）</span>;
          }
          return <span className="inline-blank" data-slot-id={part.slotId} key={index}></span>;
        }
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

function applyPromptKanaToTextParts(parts, kana) {
  if (!kana || !parts.some((part) => part.type === "blank")) return parts;

  const blankMarkers = [...String(kana).matchAll(/[_＿]{2,}|…{2,}|[―—]{2,}/g)];
  const blankCount = parts.filter((part) => part.type === "blank").length;

  const textGroups = [[]];
  parts.forEach((part, index) => {
    if (part.type === "blank") {
      textGroups.push([]);
    } else if (part.type === "text") {
      textGroups[textGroups.length - 1].push(index);
    }
  });

  let terminalBlankReading = false;
  let kanaSegments;
  if (blankMarkers.length === blankCount) {
    kanaSegments = [];
    let cursor = 0;
    blankMarkers.forEach((marker) => {
      kanaSegments.push(String(kana).slice(cursor, marker.index));
      cursor = marker.index + marker[0].length;
    });
    kanaSegments.push(String(kana).slice(cursor));
  } else if (blankCount === 1 && blankMarkers.length === 0 && textGroups[1].length === 0) {
    // Base-form prompts store only the reading of the word before a final
    // blank, for example "書きます → ____" with kana "かきます".
    terminalBlankReading = true;
    kanaSegments = [String(kana), ""];
  } else {
    return parts;
  }

  const kanaByPartIndex = new Map();
  textGroups.forEach((partIndexes, groupIndex) => {
    if (partIndexes.length === 1) {
      kanaByPartIndex.set(partIndexes[0], kanaSegments[groupIndex]);
      return;
    }

    const rubyPartIndexes = partIndexes.filter((partIndex) =>
      Array.from(parts[partIndex].text || "").some(isRubyTargetChar)
    );
    // Support prompts such as "書きます → ____": the arrow is a separate
    // text part, while only the word before it needs the inferred reading.
    if (rubyPartIndexes.length !== 1) return;

    const rubyPartIndex = rubyPartIndexes[0];
    const rubyPartPosition = partIndexes.indexOf(rubyPartIndex);
    const prefix = partIndexes.slice(0, rubyPartPosition).map((partIndex) => parts[partIndex].text).join("");
    const suffix = partIndexes.slice(rubyPartPosition + 1).map((partIndex) => parts[partIndex].text).join("");
    let rubyKana = kanaSegments[groupIndex];
    if (prefix) rubyKana = consumePlainText(rubyKana, prefix);
    if (suffix) {
      const suffixIndex = findPlainTextBoundary(rubyKana, suffix);
      if (suffixIndex === -1) {
        // In the terminal-blank format the display arrow is intentionally not
        // stored in promptKana, so it cannot be used as a reading boundary.
        if (!terminalBlankReading) return;
      } else {
        rubyKana = rubyKana.slice(0, suffixIndex);
      }
    }
    kanaByPartIndex.set(rubyPartIndex, rubyKana);
  });

  return parts.map((part, index) => {
    if (part.type !== "text" || part.kana || !kanaByPartIndex.has(index)) return part;
    return { ...part, kana: kanaByPartIndex.get(index) };
  });
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
  (activity.layout || []).forEach((block) => {
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
      const selected = [...form.querySelectorAll(`input[name="${item.id}"]:checked`)];
      itemAnswer.choiceIds = selected.map((field) => field.value);
    }

    answers[item.id] = itemAnswer;
  });

  return answers;
}

function gradeActivity(activity, answers, submittedAt = new Date().toISOString(), answerAlternatives = {}) {
  const itemResults = {};
  let correctCount = 0;
  let incorrectCount = 0;
  let ungradedCount = 0;
  let gradedCount = 0;

  flattenActivityItems(activity).forEach((item) => {
    const result = gradeItem(item, answers[item.id] || {}, answerAlternatives);
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

function gradeItem(item, attempt, answerAlternatives = {}) {
  if (item.evaluationMode === "manual_review" || !item.answer) {
    return { status: "ungraded", fieldResults: {} };
  }
  if (item.evaluationMode === "open_response") {
    return gradeOpenResponseItem(item, attempt);
  }

  const fieldResults = {};
  let sawGradableField = false;
  let hasIncorrect = false;

  if (item.inputSlots?.length) {
    item.inputSlots.forEach((slot) => {
      const matcher = expectedTextMatcher(item, slot.id, answerAlternatives);
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

function gradeOpenResponseItem(item, attempt) {
  const rule = item.answer?.openResponseRule;
  const fieldResults = {};
  let hasIncorrect = false;
  (item.inputSlots || []).forEach((slot) => {
    const actual = String(attempt.slotValues?.[slot.id] || "").trim();
    const isCorrect = matchesOpenResponseRule(actual, rule);
    fieldResults[slot.id] = isCorrect ? "correct" : "incorrect";
    if (!isCorrect) hasIncorrect = true;
  });
  return { status: hasIncorrect ? "incorrect" : "correct", fieldResults };
}

function matchesOpenResponseRule(answer, rule) {
  const normalized = String(answer || "").normalize("NFKC").replace(/[\s、。！？]/g, "");
  if (!normalized || !rule) return false;

  const time = "(?:午前|午後)?(?:[0-9]+|[一二三四五六七八九十]+)時(?:(?:[0-9]+|[一二三四五六七八九十]+)分|半)?";
  const weekday = "(?:月|火|水|木|金|土|日)曜日";
  const hasExpectedAction = !rule.actions?.length || rule.actions.some((action) => normalized.includes(action));
  const allowsShortAnswer = rule.allowShortAnswer && /です$/.test(normalized);

  if (rule.kind === "time") {
    const hasTimeOnly = new RegExp(`^${time}(?:です)?$`).test(normalized);
    const hasFullSentence = new RegExp(`${time}に`).test(normalized) && hasExpectedAction;
    return hasTimeOnly || hasFullSentence;
  }

  const rangeUnit = rule.kind === "weekday_range" ? weekday : time;
  const hasRange = new RegExp(`${rangeUnit}から${rangeUnit}まで`).test(normalized);
  return hasRange && (allowsShortAnswer || hasExpectedAction);
}

function expectedTextMatcher(item, slotId, answerAlternatives = {}) {
  const answers = answerValuesForSlot(item, slotId).map((value) => normalizeAnswerText(value));
  (answerAlternatives?.[item.id]?.[slotId] || []).forEach((value) => answers.push(normalizeAnswerText(value)));

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

function hasIncorrectTextAnswers(activity, grading) {
  return flattenActivityItems(activity).some((item) =>
    item.evaluationMode !== "open_response" && item.inputSlots?.some((slot) => grading?.itemResults?.[item.id]?.fieldResults?.[slot.id] === "incorrect")
  );
}

async function reviewIncorrectTextAnswers({ practice, activity, answers, grading, answerAlternatives }) {
  let alternatives = answerAlternatives || {};
  let acceptedCount = 0;
  let reviewedCount = 0;
  const items = flattenActivityItems(activity);

  for (const item of items) {
    if (item.evaluationMode === "manual_review" || item.evaluationMode === "self_check" || item.evaluationMode === "open_response") continue;
    if (!item.inputSlots?.length) continue;
    for (const slot of item.inputSlots) {
      if (grading?.itemResults?.[item.id]?.fieldResults?.[slot.id] !== "incorrect") continue;
      const userAnswer = String(answers?.[item.id]?.slotValues?.[slot.id] || "").trim();
      if (!userAnswer) continue;
      reviewedCount += 1;
      const result = await requestAnswerReview({
        lessonId: practice.lessonId,
        activityId: activity.id,
        activityTitle: activity.title,
        activityInstruction: activity.instruction,
        itemId: item.id,
        itemNumber: item.number,
        slotId: slot.id,
        promptText: promptPartsPlainText(item.prompt),
        promptKana: item.promptKana || "",
        userAnswer,
        expectedAnswers: answerValuesForSlot(item, slot.id),
        answerUnit: slot.expectedUnit || activity.answerUnit,
        responseScope: item.responseScope || activity.responseScope || "",
        responseScopeHint: item.responseScopeHint || activity.responseScopeHint || "",
        examples: exampleTextForItem(activity, item.id),
        openResponseRule: item.answer?.openResponseRule,
        cacheAcceptedAnswer: item.evaluationMode !== "open_response"
      });
      if (!result?.accepted) continue;
      alternatives = mergeAcceptedAnswerAlternative(alternatives, item.id, slot.id, result.normalizedAnswer || userAnswer);
      acceptedCount += 1;
    }
  }

  return { alternatives, acceptedCount, reviewedCount };
}

async function requestAnswerReview(payload) {
  const response = await fetch("/api/practice/review-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("light_blog_token") || ""}`
      },
      body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || (data.code === "AI_DAILY_QUOTA_EXCEEDED" ? "今日 AI 调用额度已用完。" : `答案复核失败（HTTP ${response.status}）`));
  }
  return data;
}

async function loadAcceptedAnswerAlternatives(lessonId) {
  const local = readLocalAcceptedAnswerAlternatives(lessonId);
  try {
    const response = await fetch(`/api/practice/answer-alternatives?lessonId=${encodeURIComponent(lessonId)}`, { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return local;
    const merged = mergeAnswerAlternativeIndexes(local, data.alternatives || {});
    writeLocalAcceptedAnswerAlternatives(lessonId, merged);
    return merged;
  } catch {
    return local;
  }
}

function readLocalAcceptedAnswerAlternatives(lessonId) {
  if (typeof window === "undefined") return {};
  try {
    const all = JSON.parse(window.localStorage.getItem(ANSWER_ALTERNATIVE_CACHE_KEY) || "{}");
    return all?.[lessonId] && typeof all[lessonId] === "object" ? all[lessonId] : {};
  } catch {
    return {};
  }
}

function writeLocalAcceptedAnswerAlternatives(lessonId, alternatives) {
  if (typeof window === "undefined") return;
  try {
    const all = JSON.parse(window.localStorage.getItem(ANSWER_ALTERNATIVE_CACHE_KEY) || "{}");
    all[lessonId] = alternatives || {};
    window.localStorage.setItem(ANSWER_ALTERNATIVE_CACHE_KEY, JSON.stringify(all));
  } catch {}
}

function mergeAnswerAlternativeIndexes(left = {}, right = {}) {
  let merged = left || {};
  Object.entries(right || {}).forEach(([itemId, slots]) => {
    Object.entries(slots || {}).forEach(([slotId, values]) => {
      (Array.isArray(values) ? values : []).forEach((value) => {
        merged = mergeAcceptedAnswerAlternative(merged, itemId, slotId, value);
      });
    });
  });
  return merged;
}

function mergeAcceptedAnswerAlternative(alternatives = {}, itemId, slotId, answer) {
  const value = String(answer || "").trim();
  if (!value) return alternatives;
  const existing = alternatives?.[itemId]?.[slotId] || [];
  const normalizedValue = normalizeAnswerText(value);
  if (existing.some((entry) => normalizeAnswerText(entry) === normalizedValue)) return alternatives;
  return {
    ...alternatives,
    [itemId]: {
      ...(alternatives[itemId] || {}),
      [slotId]: [...existing, value]
    }
  };
}

function buildAcceptedAnswerAlternativeSyncPlan(practice, alternatives = {}) {
  let answerCount = 0;
  const itemIds = new Set();
  const details = [];
  const activities = (practice.activities || []).map((activity) => {
    let activityChanged = false;
    const mergeItem = (item) => {
      const result = mergePracticeItemAcceptedAlternatives(item, alternatives?.[item.id]);
      if (result.answerCount > 0) {
        activityChanged = true;
        answerCount += result.answerCount;
        itemIds.add(item.id);
        result.details.forEach((detail) => {
          details.push({
            ...detail,
            activityTitle: activity.title || activity.id || "",
            itemId: item.id,
            itemNumber: item.number || "",
            promptText: promptPartsPlainText(item.prompt || [])
          });
        });
      }
      return result.item;
    };

    if (activity.itemGroups?.length) {
      const itemGroups = activity.itemGroups.map((group) => {
        let groupChanged = false;
        const items = (group.items || []).map((item) => {
          const nextItem = mergeItem(item);
          if (nextItem !== item) groupChanged = true;
          return nextItem;
        });
        return groupChanged ? { ...group, items } : group;
      });
      return activityChanged ? { ...activity, itemGroups } : activity;
    }

    if (activity.items?.length) {
      const items = activity.items.map(mergeItem);
      return activityChanged ? { ...activity, items } : activity;
    }

    return activity;
  });

  return {
    practice: answerCount > 0 ? { ...practice, activities } : practice,
    itemCount: itemIds.size,
    answerCount,
    details
  };
}

function mergePracticeItemAcceptedAlternatives(item, itemAlternatives) {
  if (!itemAlternatives || !item.answer || !item.inputSlots?.length) {
    return { item, answerCount: 0, details: [] };
  }

  let nextAnswer = item.answer;
  let answerCount = 0;
  const details = [];
  item.inputSlots.forEach((slot) => {
    const incoming = Array.isArray(itemAlternatives[slot.id]) ? itemAlternatives[slot.id] : [];
    const standardAnswers = answerValuesForSlot(item, slot.id);
    const newValues = uniqueNewAnswerValues(standardAnswers, incoming);
    if (!newValues.length) return;

    if (nextAnswer === item.answer) nextAnswer = { ...item.answer };
    if (slot.id === "answer") {
      nextAnswer.acceptableAlternatives = [
        ...(Array.isArray(nextAnswer.acceptableAlternatives) ? nextAnswer.acceptableAlternatives : []),
        ...newValues
      ];
    } else {
      const slotAlternatives = { ...(nextAnswer.slotAlternatives || {}) };
      slotAlternatives[slot.id] = [
        ...(Array.isArray(slotAlternatives[slot.id]) ? slotAlternatives[slot.id] : []),
        ...newValues
      ];
      nextAnswer.slotAlternatives = slotAlternatives;
    }
    answerCount += newValues.length;
    details.push({
      slotId: slot.id,
      standardAnswers: standardAnswers.length ? standardAnswers : ["暂无"],
      candidateAnswers: newValues
    });
  });

  return answerCount > 0
    ? { item: { ...item, answer: nextAnswer }, answerCount, details }
    : { item, answerCount: 0, details: [] };
}

function uniqueNewAnswerValues(existingValues, incomingValues) {
  const normalizedExisting = new Set(existingValues.map((value) => normalizeAnswerText(value)).filter(Boolean));
  const additions = [];
  incomingValues.forEach((value) => {
    const answer = String(value || "").trim();
    const normalized = normalizeAnswerText(answer);
    if (!answer || !normalized || normalizedExisting.has(normalized)) return;
    normalizedExisting.add(normalized);
    additions.push(answer);
  });
  return additions;
}

function answerValuesForSlot(item, slotId) {
  const values = [];
  const slotValue = item.answer?.slotValues?.[slotId];
  if (Array.isArray(slotValue)) {
    const joined = slotValue.map((entry) => String(entry || "").trim()).filter(Boolean).join("\n");
    if (joined) values.push(joined);
  } else {
    appendAnswerValue(values, slotValue);
  }
  if (slotId === "answer") {
    appendAnswerValue(values, item.answer?.acceptableAlternatives);
    appendAnswerValue(values, item.answer?.modelAnswers);
  }
  appendAnswerValue(values, item.answer?.slotAlternatives?.[slotId]);
  return values;
}

function appendAnswerValue(values, value) {
  if (Array.isArray(value)) {
    value.forEach((entry) => appendAnswerValue(values, entry));
    return;
  }
  const textValue = String(value || "").trim();
  if (textValue) values.push(textValue);
}

function promptPartsPlainText(parts = []) {
  return parts.map((part) => {
    if (part.type === "text") return part.text || "";
    if (part.type === "blank") return "____";
    if (part.type === "choice_ref") return part.choiceIds?.join(" / ") || "";
    if (part.type === "asset_ref") return part.assetId || "";
    return "";
  }).join("");
}

function exampleTextForItem(activity, itemId) {
  const group = (activity.itemGroups || []).find((entry) => entry.items?.some((item) => item.id === itemId));
  if (group?.example) return examplePlainText(group.example);
  return (activity.layout || [])
    .filter((block) => block.type === "example")
    .map((block) => examplePlainText(block.content))
    .filter(Boolean)
    .join("\n\n");
}

function examplePlainText(example) {
  if (!example) return "";
  const before = example.before || promptPartsPlainText(example.beforeParts || []);
  const after = promptPartsPlainText(example.after || []);
  return [before, after].filter(Boolean).join("\n→\n");
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

  const submittedAt = record.grading?.submittedAt || record.grading?.summary?.submittedAt || record.updatedAt;
  // Older lesson data may have saved an item as manual_review before its
  // transcript and standard answer were completed. Once the item becomes
  // gradable, re-evaluate the preserved user answer instead of leaving it
  // permanently ungraded.
  const grading = record.grading?.itemResults && !needsGradingRefresh(activity, record.grading)
    ? record.grading
    : record.grading
      ? gradeActivity(activity, answers, submittedAt)
      : record.grading;

  return {
    ...record,
    answers,
    grading
  };
}

function needsGradingRefresh(activity, grading) {
  return flattenActivityItems(activity).some((item) => {
    if (item.evaluationMode === "manual_review" || !item.answer || !item.inputSlots?.length) return false;
    if (item.evaluationMode === "open_response") return true;
    const savedResult = grading?.itemResults?.[item.id];
    return savedResult?.status === "ungraded" && !Object.keys(savedResult.fieldResults || {}).length;
  });
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
      answerValuesForSlot(item, slot.id).forEach((value) => {
        if (String(value || "").trim()) answers.push(String(value).trim());
      });
    });
  }

  return Array.from(new Set(answers)).join(" / ") || "暂无";
}

function buildAnswerComparison(item, answer, result) {
  if (item.choices?.length) {
    return {
      kind: "choice",
      actual: formatAttemptSummary(item, answer),
      expected: formatExpectedAnswerSummary(item)
    };
  }

  if (!item.inputSlots?.length) return null;
  const targetSlots = result?.fieldResults
    ? item.inputSlots.filter((slot) => result.fieldResults?.[slot.id] === "incorrect")
    : [];
  const slots = targetSlots.length ? targetSlots : item.inputSlots;
  const diffLines = slots.flatMap((slot) => {
    const actual = formatSlotAttemptSummary(item, answer, slot.id);
    const candidates = answerValuesForSlot(item, slot.id);
    if (!actual || !candidates.length) return [];
    const expected = closestExpectedAnswer(actual, candidates);
    return gitLikeAnswerDiff(actual === "未作答" ? "" : actual, expected);
  });
  if (!diffLines.length) return null;
  return { kind: "text", diffLines };
}

function formatSlotAttemptSummary(item, answer, slotId) {
  if (!answer) return "未作答";
  const value = String(answer.slotValues?.[slotId] || "").trim();
  if (value) return value;
  if (item.inputSlots?.length === 1) {
    const legacyValue = firstStoredSlotValue(answer.slotValues).trim();
    if (legacyValue) return legacyValue;
  }
  return "未作答";
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
  if (!parts?.length) return null;
  const text = promptPartsPlainText(parts).trim();
  if (!/甲：|乙/.test(text)) return null;
  const textLines = splitDialogueContent(text);
  if (!textLines.length) return null;
  const kanaLines = splitDialogueKanaLines(kana, textLines.length);
  const partsLines = splitPromptPartsByDialogueLines(parts, textLines);
  return textLines.map((line, index) => ({
    speaker: line.speaker,
    parts: partsLines[index] || [],
    kana: kanaLines[index] || ""
  }));
}

function splitDialogueContent(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return [];
  const speakerPattern = /((?:甲|乙[12一二]?|丙|丁|A|B|C|D|こう|おつ(?:いち|に|[12一二])?|コウ|オツ(?:イチ|ニ|[12一二])?))：/g;
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

function splitDialogueKanaLines(kana, expectedLineCount) {
  const sourceKana = String(kana || "");
  if (!sourceKana) return [];

  // Keep dialogue readings aligned by physical line first.  Unlike the visible
  // text, kana dialogue data often uses こう／おつ for speakers; matching it
  // against the normalized visible dialogue can otherwise leave the complete
  // dialogue as the reading for one line.
  const newlineLines = sourceKana
    .split(/\r?\n/)
    .map((line) => stripDialogueSpeaker(line))
    .filter(Boolean);
  if (newlineLines.length === expectedLineCount) return newlineLines;

  const markedLines = splitDialogueContent(sourceKana).map((line) => line.body);
  if (markedLines.length === expectedLineCount) return markedLines;

  // Some lesson data omits speaker labels in kana but keeps each dialogue turn on its own line.
  const rawNewlineLines = sourceKana
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (rawNewlineLines.length === expectedLineCount) return rawNewlineLines;

  // An ambiguous reading must not be attached to a single kanji run.
  return [];
}

function stripDialogueSpeaker(line) {
  return String(line || "")
    .replace(/^\s*(?:甲|乙[12一二]?|丙|丁|A|B|C|D|こう|おつ(?:いち|に|[12一二])?|コウ|オツ(?:イチ|ニ|[12一二]?)?)：\s*/, "")
    .trim();
}

function splitPromptPartsByDialogueLines(parts, textLines) {
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

function slicePromptPart(part, text) {
  if (part.type !== "text") return part;
  return { ...part, text };
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
    reading = reading.trim();

    // Never turn an alignment failure into a misleading, multi-sentence ruby.
    // A reading is kana only; punctuation, speaker markers, or kanji indicate
    // that the remaining dialogue was not split correctly.
    if (!reading || reading === run.text || !isRubyReading(reading)) {
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

  // Dialogue lines are trimmed before their kana is assigned, while the sliced
  // text part can retain its trailing separator whitespace.
  const anchor = plainText.trim().replace(/[A-Za-z]+/g, "");
  if (!anchor) return -1;
  const anchorIndex = remainingKana.indexOf(anchor);
  if (anchorIndex > -1) return anchorIndex;
  return findWhitespaceTolerantIndex(remainingKana, anchor);
}

function consumePlainText(remainingKana, plainText) {
  if (!remainingKana || !plainText) return remainingKana;
  if (remainingKana.startsWith(plainText)) return remainingKana.slice(plainText.length);
  const trimmedPlainText = plainText.trim();
  if (trimmedPlainText && remainingKana.startsWith(trimmedPlainText)) {
    return remainingKana.slice(trimmedPlainText.length);
  }
  const whitespaceTolerantRest = consumeWhitespaceTolerantPrefix(remainingKana, plainText);
  if (whitespaceTolerantRest !== null) return whitespaceTolerantRest;

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

function findWhitespaceTolerantIndex(value, query) {
  const normalizedQuery = normalizeRubyAnchor(query);
  if (!normalizedQuery) return -1;
  const { text, indexMap } = normalizeRubyAnchorWithMap(value);
  const normalizedIndex = text.indexOf(normalizedQuery);
  return normalizedIndex > -1 ? indexMap[normalizedIndex] : -1;
}

function consumeWhitespaceTolerantPrefix(value, prefix) {
  const normalizedPrefix = normalizeRubyAnchor(prefix);
  if (!normalizedPrefix) return null;
  const { text, endIndexMap } = normalizeRubyAnchorWithMap(value);
  if (!text.startsWith(normalizedPrefix)) return null;
  const endIndex = endIndexMap[normalizedPrefix.length - 1];
  return value.slice(endIndex);
}

function normalizeRubyAnchor(value) {
  return Array.from(String(value || "")).filter((char) => !isRubyWhitespace(char)).join("");
}

function normalizeRubyAnchorWithMap(value) {
  const chars = Array.from(String(value || ""));
  let originalIndex = 0;
  let text = "";
  const indexMap = [];
  const endIndexMap = [];
  chars.forEach((char) => {
    const startIndex = originalIndex;
    originalIndex += char.length;
    if (isRubyWhitespace(char)) return;
    text += char;
    indexMap.push(startIndex);
    endIndexMap.push(originalIndex);
  });
  return { text, indexMap, endIndexMap };
}

function isRubyWhitespace(char) {
  return /[\s　]/.test(String(char || ""));
}

function isRubyReading(value) {
  return /^[\u3040-\u30ffーゝゞヽヾ\s　]+$/.test(String(value || ""));
}

function isKanaOnly(value) {
  return /^[\u3040-\u30ffー\s・、。！？（）]+$/.test(String(value || ""));
}
