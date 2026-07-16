## 0. Cross-Repository Setup

- [x] 0.1 Confirm the Java API repository path, migration tool, auth/user-id extraction pattern, and standard response envelope.
- [x] 0.2 Confirm how this repo should reach the Java backend in local development, staging, and production.
- [x] 0.3 Confirm whether practice content authoring will be implemented as Java admin APIs or Java-side seed/import tooling for the first release.

## 1. External Java Backend: Database Schema

- [x] 1.1 Add a Java-backend migration or schema update for `practice_set` with lesson, version, status, content JSON, source metadata, and publish timestamps.
- [x] 1.2 Add a Java-backend migration or schema update for `practice_session` with user, lesson, practice set, status, current activity, completion counts, and last active timestamp.
- [x] 1.3 Add a Java-backend migration or schema update for `practice_activity_attempt` with user, lesson, practice set, activity, attempt number, aggregate counts, duration, client attempt ID, and submitted timestamp.
- [x] 1.4 Add a Java-backend migration or schema update for `practice_item_attempt` with parent attempt, item metadata, answer JSON, correctness, score, error tags, and submitted timestamp.
- [x] 1.5 Add unique constraints and indexes for published practice lookup, session lookup, idempotent client attempt IDs, and item-attempt analytics queries.

## 2. External Java Backend: Practice Content API

- [x] 2.1 Implement Java repository/service logic to save generated practice content as draft practice sets.
- [x] 2.2 Implement Java publish logic that marks a practice set as published without modifying already published versions.
- [x] 2.3 Implement `GET /api/japaflow/lessons/{lessonId}/practice` in the Java backend to return the latest published practice set document.
- [x] 2.4 Implement not-found behavior for lessons without published practice content.
- [x] 2.5 Add Java admin/content endpoints or seed tooling for creating and publishing practice sets.

## 3. External Java Backend: Attempt API

- [x] 3.1 Implement Java request validation for practice set ID, lesson ID, activity ID, client attempt ID, and submitted item results.
- [x] 3.2 Implement `POST /api/japaflow/lessons/{lessonId}/practice/activities/{activityId}/attempts` in the Java backend.
- [x] 3.3 Save each submission in one Java-backend transaction with one activity attempt row and one item attempt row per submitted item.
- [x] 3.4 Enforce idempotency so retrying the same client attempt ID returns the existing saved attempt.
- [x] 3.5 Preserve item-level metadata needed for future analytics: interaction type, answer unit, evaluation mode, correctness, score, and error tags.

## 4. External Java Backend: Session API

- [x] 4.1 Implement `GET /api/japaflow/lessons/{lessonId}/practice/session` in the Java backend to return existing or not-started session progress.
- [x] 4.2 Implement `PUT /api/japaflow/lessons/{lessonId}/practice/session` in the Java backend for mutable current activity and last-active updates.
- [x] 4.3 Update session summary after successful activity attempt submissions.
- [x] 4.4 Implement `DELETE /api/japaflow/lessons/{lessonId}/practice/session` in the Java backend to reset mutable progress without deleting attempt history.

## 5. This Repo: Frontend Integration

- [x] 5.1 Update the new practice adapter to load practice content from the Java backend API instead of static per-lesson imports where enabled.
- [x] 5.2 Update the practice submission flow to send activity attempts with one item result per exercise item.
- [x] 5.3 Generate and persist a client attempt ID per submit action so retries are idempotent.
- [x] 5.4 Load and update session progress for resume behavior.
- [x] 5.5 Keep local fallback behavior clearly separated from authenticated API sync behavior.
- [x] 5.6 Ensure this repo's local Node proxy/development configuration can call the Java backend endpoints.

## 6. Cross-Repo Verification

- [x] 6.1 Add Java backend tests for published content lookup, missing content, publish immutability, and version selection.
- [x] 6.2 Add Java backend tests for transactional attempt insertion and idempotent retry behavior.
- [x] 6.3 Add Java backend tests proving session reset does not delete attempt history.
- [x] 6.4 Add frontend or integration tests for loading content, submitting multi-item activity attempts, and resuming practice progress.
- [x] 6.5 Run OpenSpec validation for `add-versioned-practice-api`.
