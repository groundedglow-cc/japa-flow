const STORAGE_PREFIX = "japaflow.practice.session.v1";
const API_BASE = "/api/japaflow";
const TOKEN_KEY = "light_blog_token";
const USER_KEY = "light_blog_user";

class AuthRequiredError extends Error {
  constructor(message = "请先登录后继续练习。") {
    super(message);
    this.name = "AuthRequiredError";
  }
}

function storageKey(lessonId) {
  return `${STORAGE_PREFIX}:${currentStorageOwnerKey()}:${lessonId}`;
}

function getAuthToken() {
  if (typeof window === "undefined") return "";
  syncAuthCookie();
  return window.localStorage.getItem(TOKEN_KEY) || "";
}

function shouldUseBackend() {
  return Boolean(getAuthToken());
}

function getCookie(name) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function getStoredUser() {
  if (typeof window === "undefined") return null;
  return safeJsonParse(window.localStorage.getItem(USER_KEY), null);
}

function storageSafeSegment(value) {
  return encodeURIComponent(String(value || "unknown")).replace(/%/g, "_");
}

function currentStorageOwnerKey() {
  if (!shouldUseBackend()) return "guest";
  const user = getStoredUser() || {};
  const identity = user.id || user.userId || user.email || user.username || getAuthToken().slice(-16);
  return `user:${storageSafeSegment(identity)}`;
}

function mainAppUrl() {
  return typeof window !== "undefined" && window.location?.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://groundedglow.cc";
}

function syncAuthCookie() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.parent !== window) return;
  const cookieToken = getCookie(TOKEN_KEY);
  if (!cookieToken || window.localStorage.getItem(TOKEN_KEY)) return;
  window.localStorage.setItem(TOKEN_KEY, cookieToken);
  const cookieUser = getCookie(USER_KEY);
  if (cookieUser) window.localStorage.setItem(USER_KEY, cookieUser);
}

function loginUrl() {
  const currentUrl = typeof window === "undefined" ? "" : window.location.href;
  return `${mainAppUrl()}/login?redirect=${encodeURIComponent(currentUrl)}`;
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  window.location.href = loginUrl();
}

function handleAuthExpired() {
  if (typeof window === "undefined") return;
  if (typeof window.japaflowAuthExpired === "function") {
    window.japaflowAuthExpired();
    return;
  }
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  redirectToLogin();
}

async function apiRequest(method, path, body = null) {
  if (!shouldUseBackend()) return null;
  const headers = { Authorization: `Bearer ${getAuthToken()}` };
  if (body !== null) headers["Content-Type"] = "application/json";
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== null ? JSON.stringify(body) : undefined
    });
    if (response.status === 401 || response.status === 403) {
      handleAuthExpired();
      throw new AuthRequiredError();
    }
    if (!response.ok) return null;
    const json = await response.json();
    return json.code === 0 || json.code === 200 ? json.data : null;
  } catch (error) {
    if (error?.name === "AuthRequiredError") throw error;
    return null;
  }
}

async function apiRequestOrThrow(method, path, body = null) {
  if (!shouldUseBackend()) throw new AuthRequiredError();
  const headers = { Authorization: `Bearer ${getAuthToken()}` };
  if (body !== null) headers["Content-Type"] = "application/json";
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== null ? JSON.stringify(body) : undefined
  });
  if (response.status === 401 || response.status === 403) {
    handleAuthExpired();
    throw new AuthRequiredError();
  }
  const json = await response.json().catch(() => ({}));
  if (!response.ok || !(json.code === 0 || json.code === 200)) {
    throw new Error(json.message || `请求失败 (${response.status})`);
  }
  return json.data;
}

function safeJsonParse(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function readLessonRecord(lessonId) {
  if (typeof window === "undefined") return { lessonId, activities: {} };
  const record = safeJsonParse(window.localStorage.getItem(storageKey(lessonId)), { lessonId, activities: {} });
  if (shouldUseBackend()) return record;
  return mergeLegacyLessonRecords(lessonId, record);
}

function writeLessonRecord(lessonId, record) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(lessonId), JSON.stringify(record));
}

function deleteLessonRecord(lessonId) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey(lessonId));
}

function removeLocalActivityRecord(lessonId, activityId, practiceSetId = null) {
  const record = readLessonRecord(lessonId);
  if (practiceSetId) record.practiceSetId = practiceSetId;
  if (record.activities?.[activityId]) {
    delete record.activities[activityId];
  }
  if (!Object.keys(record.activities || {}).length) {
    deleteLessonRecord(lessonId);
    return;
  }
  writeLessonRecord(lessonId, record);
}

function mergeLegacyLessonRecords(lessonId, record) {
  const merged = {
    lessonId,
    ...record,
    activities: { ...(record.activities || {}) }
  };
  const currentKey = storageKey(lessonId);
  const lessonNo = lessonNumber(lessonId);
  const activityIdPattern = lessonNo ? new RegExp(`^l${lessonNo}-p\\d+-a\\d+$`) : null;
  const activityIdInKeyPattern = lessonNo ? new RegExp(`l${lessonNo}-p\\d+-a\\d+`) : null;

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key || key === currentKey || !mightContainLegacyPracticeRecord(key, lessonId)) continue;
    const value = safeJsonParse(window.localStorage.getItem(key), null);
    const activities = extractLegacyActivities(value, lessonId, activityIdPattern, key, activityIdInKeyPattern);
    Object.entries(activities).forEach(([activityId, legacyRecord]) => {
      if (!activityIdPattern?.test(activityId) || !legacyRecord || typeof legacyRecord !== "object") return;
      const currentRecord = merged.activities[activityId] || {};
      merged.activities[activityId] = {
        ...legacyRecord,
        ...currentRecord,
        answers: {
          ...(legacyRecord.answers || {}),
          ...(currentRecord.answers || {})
        },
        grading: currentRecord.grading || legacyRecord.grading
      };
    });
  }

  return merged;
}

function mightContainLegacyPracticeRecord(key, lessonId) {
  const normalized = key.toLowerCase();
  return normalized.includes("practice") || normalized.includes(lessonId.toLowerCase()) || normalized.includes("japaflow");
}

function extractLegacyActivities(value, lessonId, activityIdPattern, storageKeyName = "", activityIdInKeyPattern = null) {
  if (!value || typeof value !== "object") return {};
  if (value.activities && typeof value.activities === "object") return value.activities;
  if (value.lessonId === lessonId && value.activityId) return { [value.activityId]: value };
  const activityIdFromKey = storageKeyName.match(activityIdInKeyPattern || /$^/)?.[0];
  if (activityIdFromKey) return { [activityIdFromKey]: value };

  const activities = {};
  Object.entries(value).forEach(([key, entry]) => {
    if (activityIdPattern?.test(key)) activities[key] = entry;
  });
  return activities;
}

function lessonNumber(lessonId) {
  const match = String(lessonId).match(/lesson(\d+)/i);
  return match ? Number(match[1]) : undefined;
}

function numericLessonPath(lessonId) {
  return lessonNumber(lessonId) || lessonId;
}

function serializablePractice(practice) {
  const { practiceSetId, practiceVersion, ...content } = practice || {};
  return content;
}

function createClientAttemptId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function flattenActivityItems(activity) {
  if (!activity) return [];
  return activity.itemGroups?.length
    ? activity.itemGroups.flatMap((group) => group.items)
    : activity.items || [];
}

function backendSessionToRecord(lessonId, backendSession) {
  const session = backendSession?.session;
  const record = {
    lessonId,
    practiceSetId: session?.practiceSetId,
    currentActivityId: session?.currentActivityId || "",
    activities: {}
  };

  for (const progress of backendSession?.activityProgress || []) {
    if (!progress.activityId) continue;
    record.activities[progress.activityId] = {
      updatedAt: progress.latestSubmittedAt,
      answers: progress.answers || {},
      grading: {
        submittedAt: progress.latestSubmittedAt,
        summary: {
          totalCount: progress.latestTotalItems || 0,
          gradedCount: progress.latestTotalItems || 0,
          correctCount: progress.latestCorrectItems || 0,
          incorrectCount: Math.max(0, (progress.latestTotalItems || 0) - (progress.latestCorrectItems || 0)),
          ungradedCount: 0,
          submittedAt: progress.latestSubmittedAt
        },
        itemResults: progress.itemResults || {}
      }
    };
  }
  return record;
}

function buildAttemptPayload({ practiceSetId, activity, payload }) {
  return {
    practiceSetId,
    clientAttemptId: createClientAttemptId(),
    durationMs: null,
    items: flattenActivityItems(activity).map((item) => {
      const result = payload.grading?.itemResults?.[item.id] || {};
      return {
        itemId: item.id,
        itemNumber: item.number,
        interactionType: item.interaction || activity.interaction,
        answerUnit: item.answerUnit || activity.answerUnit,
        evaluationMode: item.evaluationMode || activity.evaluationMode || "exact",
        userAnswer: payload.answers?.[item.id] || {},
        correctAnswer: item.answer || null,
        isCorrect: result.status === "correct" ? true : result.status === "incorrect" ? false : null,
        score: result.status === "correct" ? 1 : result.status === "incorrect" ? 0 : null,
        errorTags: result.status === "incorrect" ? ["incorrect"] : []
      };
    })
  };
}

async function publishPracticeVersion({ lessonId, practice, sourcePromptName = "practice-answer-alternative-sync", sourcePromptHash = "" }) {
  if (!practice?.activities?.length) {
    throw new Error("当前课程没有可发布的练习数据。");
  }
  const draft = await apiRequestOrThrow("POST", "/admin/practice/sets", {
    lessonId: Number(numericLessonPath(lessonId)),
    schemaVersion: "v1",
    title: practice.title,
    contentJson: serializablePractice(practice),
    sourcePromptName,
    sourcePromptHash
  });
  return apiRequestOrThrow("POST", `/admin/practice/sets/${draft.id}/publish`);
}

export const practiceSessionApi = {
  isAuthenticated() {
    return shouldUseBackend();
  },

  redirectToLogin,

  async loadPublishedPractice(lessonId, fallbackPractice) {
    if (!shouldUseBackend()) throw new AuthRequiredError();
    const backendPracticeSet = await apiRequest("GET", `/lessons/${numericLessonPath(lessonId)}/practice`);
    if (!backendPracticeSet?.contentJson) {
      return {
        practice: fallbackPractice,
        practiceSetId: fallbackPractice.practiceSetId || null,
        source: "local"
      };
    }
    return {
      practice: {
        ...backendPracticeSet.contentJson,
        practiceSetId: backendPracticeSet.id,
        practiceVersion: backendPracticeSet.version
      },
      practiceSetId: backendPracticeSet.id,
      source: "backend"
    };
  },

  async publishLocalPractice({ lessonId, practice }) {
    return publishPracticeVersion({
      lessonId,
      practice,
      sourcePromptName: "practise-generete-prompt-v3.md",
      sourcePromptHash: ""
    });
  },

  async publishPracticeVersion({ lessonId, practice, sourcePromptName = "practice-answer-alternative-sync", sourcePromptHash = "" }) {
    return publishPracticeVersion({
      lessonId,
      practice,
      sourcePromptName,
      sourcePromptHash
    });
  },

  async loadLessonSession(lessonId) {
    if (!shouldUseBackend()) throw new AuthRequiredError();
    const backendSession = await apiRequest("GET", `/lessons/${numericLessonPath(lessonId)}/practice/session`);
    if (!backendSession) return { lessonId, activities: {} };
    return backendSessionToRecord(lessonId, backendSession);
  },

  async updateLessonSession({ lessonId, practiceSetId, currentActivityId }) {
    if (!practiceSetId) return null;
    try {
      return await apiRequest("PUT", `/lessons/${numericLessonPath(lessonId)}/practice/session`, {
        practiceSetId,
        currentActivityId
      });
    } catch (error) {
      if (error?.name === "AuthRequiredError") return null;
      throw error;
    }
  },

  async saveActivitySubmission({ lessonId, practiceSetId, activityId, activity, payload }) {
    if (!shouldUseBackend()) {
      throw new AuthRequiredError();
    }
    if (!practiceSetId || !activity) {
      throw new Error("当前练习尚未发布到数据库，无法保存提交记录。请先通过管理入口发布练习。");
    }
    await apiRequestOrThrow(
      "POST",
      `/lessons/${numericLessonPath(lessonId)}/practice/activities/${encodeURIComponent(activityId)}/attempts`,
      buildAttemptPayload({ practiceSetId, activity, payload })
    );
    removeLocalActivityRecord(lessonId, activityId, practiceSetId);
    return {
      ...payload,
      updatedAt: new Date().toISOString(),
      backendSynced: true
    };
  }
};
