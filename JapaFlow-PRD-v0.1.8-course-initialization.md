# JapaFlow PRD v0.1.8 - Course Initialization

## Goal

Add a guided initialization flow for lessons that are shown as pending on the home page. The flow turns textbook screenshots into reviewable course data, generates local audio for every important Japanese learning item, and stores all source images and generated artifacts so the lesson can be audited later.

## Scope

This version covers pending lessons such as lesson 28 and lesson 29.

The initialized data is first saved as a reviewable lesson JSON draft under `data/lesson-drafts/lesson{lessonId}.json`. After the user confirms the draft, it is saved as the standalone lesson JSON under `data/lessons/lesson{lessonId}.json`. The learning runtime can dynamically load these saved lesson JSON files when the user enters `/lesson/{lessonId}`. Lesson 27 remains available as the bundled fallback lesson in `app.js`.

## User Flow

1. On the home page, pending lesson cards are clickable.
2. Clicking a pending lesson opens `/lesson/{lessonId}/init`.
3. The initialization page has two confirmed steps:
   - Course data preparation
   - Audio generation
4. Course data preparation supports two parallel paths:
   - Image parsing through a generated Codex CLI task
   - Manual JSON draft import through a paste box or local `.json` file
5. The user uploads images in four buckets:
   - Text
   - Grammar
   - Vocabulary
   - Exercises
6. Uploaded images are stored under `course-assets/lesson{lessonId}/{bucket}/`.
7. If using image parsing, the user clicks "Create Codex parsing task". The server writes a local task file under `data/lesson-init/lesson{lessonId}-codex-task.md`.
8. The user runs the generated Codex CLI command, or asks the current Codex session to execute the task. Codex reads the stored images and writes `data/lesson-drafts/lesson{lessonId}.json`.
9. If using manual JSON import, the user either pastes JSON into the import text area or clicks "Read JSON file into text box". The user must then click "Import text box as draft" to POST the JSON draft to the server.
10. The parsed or imported draft is displayed as counts plus JSON for user review.
11. The user confirms the parsed draft. Confirmation writes `data/lessons/lesson{lessonId}.json`.
12. The user starts audio generation. The server generates audio for missing audio jobs in small batches so the UI can show progress.
13. The user can play generated audio rows for spot checking.
14. The user confirms audio. The lesson initialization is marked complete in `data/lesson-init/lesson{lessonId}-state.json`.
15. The home page reads the server-side lesson catalog and shows a completed initialized lesson as "initialized" instead of "pending".
16. Clicking an initialized lesson opens `/lesson/{lessonId}`. The frontend loads `data/lessons/lesson{lessonId}.json`, switches the active runtime lesson, and initializes lesson-scoped local progress from `localStorage`.

## Data Requirements

The extracted JSON must follow the lesson 27 shape as closely as possible:

- `id`
- `title`
- `subtitle`
- `vocabulary[]`
  - `id`
  - `jp`
  - `kana`
  - `cn`
- `sentences[]`
  - `id`
  - `order`
  - optional `speaker`
  - `text`
  - `kana`
  - `translation`
  - `words[]`
  - `grammar[]`
- `textStructure[]`
  - sections and groups that preserve textbook order
- `grammar[]`
  - `id`
  - `pattern`
  - `meaning`
  - `structure`
  - `usage`
  - `examples[]`
  - `extraExamples[]`
- `exercises[]`
  - `id`
  - `groupId`
  - `groupTitle`
  - `category`
  - `instruction`
  - optional `example`
  - `type`
  - `question`
  - optional `choices[]`
  - `answer`
  - `referenceAnswers[]`
  - `relatedGrammar[]`
  - `relatedSentences[]`
  - `explanation`

The extraction prompt must prioritize completeness over elegance:

- Do not omit any exercise question.
- Do not merge separate exercise items into one item.
- Preserve examples and model answers if visible.
- Preserve grammar example sentences, including extra examples that are not part of the main text.
- Use empty strings or empty arrays when the source image lacks an answer or explanation.
- Listening exercises that have no visible answer must be preserved with `audioRequired: true`, `hasAnswer: false`, `answer: ""`, and `referenceAnswers: []`; do not invent answers.
- Manual JSON imports must still pass the same validation and review flow as Codex-generated drafts.

## Audio Requirements

Audio is generated with the same MiniMax TTS settings already used by the application.

Generate audio for:

- Every vocabulary Japanese headword.
- Every text sentence.
- Every grammar extra example sentence.
- Every exercise answer (the `answer` field) and `referenceAnswers[]`

Audio files are stored under:

- `audio/lesson{lessonId}/voices/{voiceId}/words/{wordId}.mp3`
- `audio/lesson{lessonId}/voices/{voiceId}/sentences/{sentenceId}.mp3`
- `audio/lesson{lessonId}/voices/{voiceId}/exercises/{exerciseAudioId}.mp3`

The page must show generated/missing counts and allow playback for generated audio.

Audio generation must be observable from the initialization page:

- The frontend requests small generation batches instead of one long blocking request.
- The page updates "generated" and "missing" counts after every completed batch.
- If a batch fails, generation stops and the page displays the error message.
- The service must be started with `MINIMAX_API_KEY`; otherwise generation fails with a clear error.
- Updating `server.mjs` or environment variables requires restarting the Node dev server.

The general audio management API is lesson-aware. For dynamically loaded lessons, the frontend sends `lessonId` to `/api/audio/status` and `/api/audio/generate`; the server reads `data/lessons/lesson{lessonId}.json` and checks audio under `audio/lesson{lessonId}/voices/{voiceId}/`.

## API

### `GET /api/init/status?lessonId=28&voiceId=Japanese_IntellectualSenior`

Returns uploaded images, parse draft summary, audio status, and completion state.

The app caches in-flight and failed status reads on the client to avoid render-triggered request loops. Manual "refresh result" can force a reload.

### `GET /api/lesson-catalog`

Returns the home page lesson catalog.

For hard-coded runtime lessons such as lesson 27, the response keeps `status: "ready"` and `runtimeReady: true`.

For initialized lessons saved under `data/lessons/lesson{lessonId}.json`, the response returns:

- `status: "initialized"`
- `statusLabel: "已初始化"`
- `runtimeReady: false`
- `counts` for vocabulary, grammar, sentences, and exercises

This makes the home page distinguish "initialization complete" from "bundled". Initialized lessons can be opened in the shared learning runtime by dynamically loading their saved JSON.

### `GET /data/lessons/lesson{lessonId}.json`

Serves the confirmed lesson JSON used by the dynamic learning runtime.

The frontend uses this file when entering `/lesson/{lessonId}` for a lesson that is not bundled in `app.js`. After loading it, the frontend:

- replaces the active `lesson`
- replaces `textStructure`
- reloads lesson-scoped progress keys from `localStorage`
- resets transient UI state such as current word, current sentence, selected grammar, recording state, and audio status

### `POST /api/init/upload`

Multipart upload fields:

- `lessonId`
- `bucket`
- `images`

Stores images in `course-assets/lesson{lessonId}/{bucket}/`.

### `POST /api/init/parse`

JSON body:

- `lessonId`

Reads stored image manifests and creates a Codex CLI parsing task. It does not call OpenAI Platform APIs and does not require `OPENAI_API_KEY`.

Response includes:

- task file path
- expected draft path
- Codex CLI command with image attachments
- image manifest grouped by bucket

Codex CLI is responsible for reading the images and writing the JSON draft.

### `POST /api/init/import-json`

JSON body:

- `lessonId`
- `draft`

Validates the draft against the lesson shape and saves it to `data/lesson-drafts/lesson{lessonId}.json`.

This endpoint is for manual JSON import. The UI has two separate actions:

- "Read JSON file into text box" reads a local file into the browser text area only.
- "Import text box as draft" sends the text area JSON to this endpoint.

Importing JSON does not confirm parsing. The user must still review the displayed JSON and click "Confirm parse result".

### `POST /api/init/confirm-parse`

JSON body:

- `lessonId`
- `draft`

Validates and saves the draft.

### `POST /api/init/audio/generate`

JSON body:

- `lessonId`
- `voiceId`
- optional `scope`
- optional `id`
- optional `limit`

Generates missing audio for the saved lesson draft. When `limit` is provided, the server generates at most that many missing jobs and returns updated audio status. The frontend uses this to show incremental progress.

Response includes:

- `generated`
- `failed`
- `attempted`
- `remainingBefore`
- `items`
- updated `audio` summary with `generated`, `missing`, `total`, and `items`

### `GET /api/audio/status?lessonId=28&voiceId=Japanese_IntellectualSenior`

Returns audio status for the active learning runtime lesson. When `lessonId` is omitted, the bundled lesson 27 is used for backward compatibility.

For non-bundled lessons, the server reads `data/lessons/lesson{lessonId}.json` and returns status for all generated runtime audio jobs.

### `POST /api/audio/generate`

JSON body:

- optional `lessonId`
- `voiceId`
- `type`
- `id`
- optional `scope`

Generates audio for the requested runtime lesson. When `lessonId` is omitted, lesson 27 is used for backward compatibility.

### `POST /api/init/confirm-audio`

JSON body:

- `lessonId`
- `voiceId`

Marks initialization complete only if no audio jobs are missing.

## Acceptance Criteria

- Pending lesson cards navigate to an initialization page.
- Images upload into stable per-lesson and per-bucket directories.
- Image parsing does not require `OPENAI_API_KEY` and does not call OpenAI Platform APIs from the app server.
- The app produces a Codex CLI parsing task that preserves all image paths and extraction instructions.
- Parse cannot be confirmed until a draft exists.
- Manual JSON import clearly distinguishes "read file into text box" from "import text box as draft".
- Imported JSON appears as a reviewable draft and must be explicitly confirmed before audio generation.
- Audio generation cannot start until parse is confirmed and saved.
- Audio generation shows visible batch progress instead of waiting silently for one long request.
- MiniMax configuration failures are shown in the initialization page.
- Generated audio rows can be played from the initialization page.
- Completion state is persisted on disk.
- The home page shows completed initialized lessons as initialized, not pending.
- Initialized lessons can be opened from the home page and are loaded from `data/lessons/lesson{lessonId}.json`.
- Lesson-specific local progress is isolated by `lesson:{lessonId}:...` keys.
- Audio management uses the current lesson id and does not accidentally show lesson 27 audio for a dynamically loaded lesson.
- Unrecognized `/api/*` routes return JSON 404 errors, not the SPA `index.html`.
- Existing lesson 27 learning behavior remains unchanged.
