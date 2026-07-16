## Why

The new lesson practice experience needs persistent backend support that is independent from the older `/lesson/{N}/exercises` implementation. Practice submissions should be saved at both the main-question and small-exercise levels so the system can later analyze weak exercise types and power features such as a wrong-exercise playground.

## What Changes

- Add a versioned practice content model for generated lesson practice data.
- Add authenticated APIs for loading published practice content and user practice state.
- Add an append-only attempt history model where each main-question submission records one activity attempt and multiple item attempts.
- Track each item attempt with user answer, correctness, score, answer metadata, and optional error tags.
- Keep the design extensible for future analytics and wrong-exercise replay without requiring those features in the first implementation.
- Treat the new practice system as separate from the older lesson exercise implementation.

## Capabilities

### New Capabilities

- `versioned-practice-content`: Stores and exposes generated lesson practice content as versioned publishable data.
- `practice-attempt-tracking`: Records user submissions for practice activities and their contained exercise item results.
- `practice-session-progress`: Tracks current user practice progress for resume/reset behavior.

### Modified Capabilities

- None.

## Impact

- External Java backend: add database migrations and Java API implementation for practice content, session/progress, activity attempt, and item attempt persistence.
- API contract: add `/api/japaflow/lessons/{lessonId}/practice...` endpoints for practice content, session, reset, and submissions in the Java backend codebase.
- This repo: update the new practice UI adapter to load content from the backend and submit attempts through the new API while preserving local fallback behavior if desired.
- Future systems: item-level attempt history enables later analytics, wrong-item queues, and targeted replay without changing the core submission contract.
