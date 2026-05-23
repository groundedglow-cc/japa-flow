# Codex Course Parse Task - Lesson {{LESSON_ID}}

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `{{COMMON_RULES_PATH}}`

## Output

Write the final JSON to:

- `{{DRAFT_PATH}}`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `{{LESSON_ID}}`
- Lesson asset root: `{{LESSON_ASSET_ROOT}}`

Use these inferred image groups. Image names are ordering keys only; the bucket mapping is supplied here.

{{BUCKET_LIST}}

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially:

- the exercise `number -> question -> answer` checklist
- furigana-based disambiguation
- every `sentences[].id` appearing exactly once in `textStructure[].groups[].ids`
- the lesson 28 standard schema described in the shared rules
