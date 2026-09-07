# Codex Course Parse Task - Lesson 34

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `/Users/rookie/Documents/personal-projects/japa-flow/data/lesson-init/codex-parse-common.md`

## Output

Write the final JSON to:

- `/Users/rookie/Documents/personal-projects/japa-flow/data/lesson-drafts/lesson34.json`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `34`
- Lesson asset root: `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson34`

Use these inferred image groups. Image names are ordering keys only; the bucket mapping is supplied here.

- `text`: `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson34/page106.webp`, `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson34/page110.webp`, `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson34/page111.webp`
- `grammar`: `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson34/page107.webp`, `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson34/page108.webp`
- `vocabulary`: `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson34/page109.webp`, `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson34/page110.webp`
- `word`: `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson34/page115.webp`
- `exercises`: `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson34/page112.webp`, `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson34/page113.webp`, `/Users/rookie/Documents/personal-projects/japa-flow/course-assets/by-lesson/lesson34/page114.webp`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially:

- the exercise `number -> question -> answer` checklist
- furigana-based disambiguation
- `vocabulary[]` entries coming only from the `word` bucket, never from `grammar` images
- every `sentences[].id` appearing exactly once in `textStructure[].groups[].ids`
- the lesson 28 standard schema described in the shared rules
