import assert from "node:assert/strict";

class MemoryStorage {
  constructor() {
    this.map = new Map();
  }

  get length() {
    return this.map.size;
  }

  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }

  setItem(key, value) {
    this.map.set(key, String(value));
  }

  removeItem(key) {
    this.map.delete(key);
  }

  key(index) {
    return Array.from(this.map.keys())[index] || null;
  }
}

const localStorage = new MemoryStorage();
localStorage.setItem("light_blog_token", "test-token");

globalThis.window = {
  localStorage
};

const requests = [];
globalThis.fetch = async (url, options = {}) => {
  requests.push({ url, options });
  if (url === "/api/japaflow/lessons/1/practice") {
    return jsonResponse({
      code: 200,
      data: {
        id: 12,
        version: 3,
        contentJson: {
          lessonId: "lesson1",
          title: "Lesson 1 Practice",
          sourcePages: [],
          activities: []
        }
      }
    });
  }
  if (url === "/api/japaflow/lessons/1/practice/session") {
    return jsonResponse({
      code: 200,
      data: {
        session: {
          practiceSetId: 12,
          currentActivityId: "l1-p1-a1"
        },
        activityProgress: [
          {
            activityId: "l1-p1-a1",
            latestSubmittedAt: "2026-07-16T00:00:00",
            latestTotalItems: 1,
            latestCorrectItems: 1,
            answers: {
              i1: { slotValues: { answer: "これは本です。" } }
            },
            itemResults: {
              i1: { status: "correct", fieldResults: {} }
            }
          }
        ]
      }
    });
  }
  if (url === "/api/japaflow/lessons/1/practice/activities/l1-p1-a1/attempts") {
    return jsonResponse({ code: 200, data: { activityAttempt: { id: 100 }, itemAttempts: [] } });
  }
  if (url === "/api/japaflow/admin/practice/sets") {
    return jsonResponse({ code: 200, data: { id: 12, version: 1, status: "draft" } });
  }
  if (url === "/api/japaflow/admin/practice/sets/12/publish") {
    return jsonResponse({ code: 200, data: { id: 12, version: 1, status: "published" } });
  }
  return jsonResponse({ code: 404, data: null }, 404);
};

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return body;
    }
  };
}

const { practiceSessionApi } = await import("../practice/react/practiceSessionApi.js");

const fallbackPractice = { lessonId: "lesson1", title: "Fallback", sourcePages: [], activities: [] };
const loaded = await practiceSessionApi.loadPublishedPractice("lesson1", fallbackPractice);
assert.equal(loaded.practice.practiceSetId, 12);
assert.equal(loaded.practice.practiceVersion, 3);

const session = await practiceSessionApi.loadLessonSession("lesson1");
assert.equal(session.practiceSetId, 12);
assert.equal(session.currentActivityId, "l1-p1-a1");
assert.equal(session.activities["l1-p1-a1"].answers.i1.slotValues.answer, "これは本です。");
assert.equal(session.activities["l1-p1-a1"].grading.itemResults.i1.status, "correct");

await practiceSessionApi.saveActivitySubmission({
  lessonId: "lesson1",
  practiceSetId: 12,
  activityId: "l1-p1-a1",
  activity: {
    id: "l1-p1-a1",
    interaction: "fill_blank",
    answerUnit: "sentence",
    items: [
      {
        id: "i1",
        number: "1",
        evaluationMode: "exact",
        answer: { slotValues: { answer: "これは本です。" } }
      }
    ]
  },
  payload: {
    answers: { i1: { slotValues: { answer: "これは本です。" } } },
    grading: { itemResults: { i1: { status: "correct" } } }
  }
});

const attemptRequest = requests.find((request) => request.url.endsWith("/attempts"));
assert.ok(attemptRequest);
const attemptBody = JSON.parse(attemptRequest.options.body);
assert.equal(attemptBody.practiceSetId, 12);
assert.equal(attemptBody.items.length, 1);
assert.equal(attemptBody.items[0].isCorrect, true);

const published = await practiceSessionApi.publishLocalPractice({
  lessonId: "lesson1",
  practice: {
    lessonId: "lesson1",
    title: "Local Practice",
    sourcePages: [],
    activities: [{ id: "l1-p1-a1", items: [] }]
  }
});
assert.equal(published.status, "published");
const importRequest = requests.find((request) => request.url === "/api/japaflow/admin/practice/sets");
assert.ok(importRequest);
const importBody = JSON.parse(importRequest.options.body);
assert.equal(importBody.lessonId, 1);
assert.equal(importBody.contentJson.title, "Local Practice");

assert.equal(localStorage.getItem("japaflow.practice.session.v1:lesson1"), null);

localStorage.removeItem("light_blog_token");
assert.equal(practiceSessionApi.isAuthenticated(), false);
await assert.rejects(
  practiceSessionApi.loadPublishedPractice("lesson1", fallbackPractice),
  /请先登录/
);
await assert.rejects(
  practiceSessionApi.saveActivitySubmission({
    lessonId: "lesson1",
    practiceSetId: 12,
    activityId: "l1-p1-a1",
    activity: { id: "l1-p1-a1", items: [] },
    payload: { answers: {}, grading: { itemResults: {} } }
  }),
  /请先登录/
);
