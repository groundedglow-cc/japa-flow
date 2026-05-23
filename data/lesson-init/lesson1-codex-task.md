# Codex Course Parse Task - Lesson 1

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-init/codex-parse-common.md`

## Output

Write the final JSON to:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-drafts/lesson1.json`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `1`
- Lesson asset root: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson1`

Use these inferred image groups. Image names are ordering keys only; the bucket mapping is supplied here.

- `text`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson1/page22.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson1/page26.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson1/page27.webp`
- `grammar`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson1/page23.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson1/page24.webp`
- `vocabulary`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson1/page25.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson1/page26.webp`
- `word`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson1/page31.webp`
- `exercises`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson1/page28.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson1/page29.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson1/page30.webp`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially:

- the exercise `number -> question -> answer` checklist
- furigana-based disambiguation
- every `sentences[].id` appearing exactly once in `textStructure[].groups[].ids`
- the lesson 28 standard schema described in the shared rules
