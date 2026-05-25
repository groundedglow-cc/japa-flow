# Codex Course Parse Task - Lesson 3

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-init/codex-parse-common.md`

## Output

Write the final JSON to:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-drafts/lesson3.json`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `3`
- Lesson asset root: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson3`

Use these inferred image groups. Image names are ordering keys only; the bucket mapping is supplied here.

- `text`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson3/page42.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson3/page46.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson3/page47.webp`
- `grammar`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson3/page43.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson3/page44.webp`
- `vocabulary`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson3/page45.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson3/page46.webp`
- `word`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson3/page51.webp`
- `exercises`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson3/page48.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson3/page49.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson3/page50.webp`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially:

- the exercise `number -> question -> answer` checklist
- furigana-based disambiguation
- every `sentences[].id` appearing exactly once in `textStructure[].groups[].ids`
- the lesson 28 standard schema described in the shared rules
