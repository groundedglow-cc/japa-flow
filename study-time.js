export const studyModules = ["vocab", "grammar", "text", "exercises", "wrongbook", "favorites"];

let getRoute = null;
let getLesson = null;
let syncStudyTime = null;
const studyTimeData = {};
let session = null;
let tickTimer = null;

function emptyStudyTime() {
  return Object.fromEntries(studyModules.map((module) => [module, { totalMs: 0, lastStartedAt: "", lastActiveAt: "" }]));
}

function normalizeStudyTime(value) {
  const source = value && typeof value === "object" ? value : {};
  return Object.fromEntries(studyModules.map((module) => {
    const item = source[module] || {};
    return [module, {
      totalMs: Math.max(0, Number(item.totalMs || 0)),
      lastStartedAt: item.lastStartedAt || "",
      lastActiveAt: item.lastActiveAt || ""
    }];
  }));
}

export function initStudyTime({ getRoute: routeGetter, getLesson: lessonGetter, apiSyncStudyTime }) {
  getRoute = routeGetter;
  getLesson = lessonGetter;
  syncStudyTime = apiSyncStudyTime;
}

export function readStudyTime(lessonId) {
  return normalizeStudyTime(studyTimeData[lessonId] || emptyStudyTime());
}

export function writeStudyTime(lessonId, value) {
  studyTimeData[lessonId] = normalizeStudyTime(value);
}

function liveMs(lessonId, module) {
  const stored = readStudyTime(lessonId)[module]?.totalMs || 0;
  if (session && session.lessonId === String(lessonId) && session.module === module) {
    return stored + Math.max(0, Date.now() - session.startedAt);
  }
  return stored;
}

export function studyTimeDisplay(lessonId, module) {
  const totalSeconds = Math.floor(liveMs(lessonId, module) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}秒`;
  return `${minutes}分${seconds}秒`;
}

export function studyTimeBadge(module, lessonId) {
  const id = lessonId === undefined ? getLesson()?.id : lessonId;
  const text = studyTimeDisplay(id, module);
  return `<div class="study-time-badge" data-module="${module}" data-lesson-id="${id}" aria-label="练习时长 ${text}">练习时长 ${text}</div>`;
}

export function studyModuleLabel(module) {
  return { vocab: "单词", grammar: "语法", text: "课文", exercises: "练习", wrongbook: "错题", favorites: "收藏" }[module] || module;
}

export function courseStudyTimeGrid(lessonId) {
  const modules = [
    ["vocab", "单词"],
    ["grammar", "语法"],
    ["text", "课文"],
    ["exercises", "练习"]
  ];
  return `
    <div class="course-time-grid" aria-label="本课模块练习时长">
      ${modules.map(([module, label]) => `
        <div class="course-time-item" data-module="${module}" data-lesson-id="${lessonId}">
          <span>${label}</span>
          <strong>${studyTimeDisplay(lessonId, module)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function updateVisibleStudyTimes() {
  document.querySelectorAll(".study-time-badge").forEach((el) => {
    const { module, lessonId } = el.dataset;
    if (!module || !lessonId) return;
    const text = studyTimeDisplay(lessonId, module);
    el.textContent = `练习时长 ${text}`;
    el.setAttribute("aria-label", `练习时长 ${text}`);
  });
  document.querySelectorAll(".course-time-item").forEach((el) => {
    const { module, lessonId } = el.dataset;
    if (!module || !lessonId) return;
    const strong = el.querySelector("strong");
    if (strong) strong.textContent = studyTimeDisplay(lessonId, module);
  });
  document.querySelectorAll(".module-time").forEach((el) => {
    const { module, lessonId } = el.dataset;
    if (!module || !lessonId) return;
    el.textContent = studyTimeDisplay(lessonId, module);
  });
}

function startTick() {
  if (tickTimer) return;
  tickTimer = window.setInterval(updateVisibleStudyTimes, 1000);
}

function stopTick() {
  if (!tickTimer) return;
  window.clearInterval(tickTimer);
  tickTimer = null;
}

export function settleStudyTimer() {
  if (!session) return;
  const now = Date.now();
  const elapsed = Math.max(0, now - session.startedAt);
  const data = readStudyTime(session.lessonId);
  data[session.module] = {
    ...(data[session.module] || { totalMs: 0 }),
    totalMs: Math.max(0, Number(data[session.module]?.totalMs || 0)) + elapsed,
    lastStartedAt: new Date(session.startedAt).toISOString(),
    lastActiveAt: new Date(now).toISOString()
  };
  writeStudyTime(session.lessonId, data);
  syncStudyTime?.(session.lessonId, session.module, elapsed, new Date(now).toISOString());
  session = null;
  stopTick();
  updateVisibleStudyTimes();
}

export function syncStudyTimerWithRoute() {
  if (!getRoute) return;
  const { lessonId, page } = getRoute();
  const moduleMatch = lessonId && studyModules.includes(page);
  if (session && (!moduleMatch || session.lessonId !== String(lessonId) || session.module !== page)) {
    settleStudyTimer();
  }
  if (moduleMatch && !session) {
    session = { lessonId: String(lessonId), module: page, startedAt: Date.now() };
    startTick();
  }
}
