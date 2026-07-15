const STORAGE_PREFIX = "japaflow.practice.session.v1";

function storageKey(lessonId) {
  return `${STORAGE_PREFIX}:${lessonId}`;
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
  return mergeLegacyLessonRecords(lessonId, record);
}

function writeLessonRecord(lessonId, record) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(lessonId), JSON.stringify(record));
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

export const practiceSessionApi = {
  async loadLessonSession(lessonId) {
    return readLessonRecord(lessonId);
  },

  async saveActivitySubmission({ lessonId, activityId, payload }) {
    const record = readLessonRecord(lessonId);
    record.activities ||= {};
    record.activities[activityId] = {
      ...(record.activities[activityId] || {}),
      ...payload,
      updatedAt: new Date().toISOString()
    };
    writeLessonRecord(lessonId, record);
    return record.activities[activityId];
  }
};
