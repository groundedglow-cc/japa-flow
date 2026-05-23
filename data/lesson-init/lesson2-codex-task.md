# Codex Course Parse Task - Lesson 2

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-init/codex-parse-common.md`

## Output

Write the final JSON to:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-drafts/lesson2.json`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `2`
- Lesson asset root: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson2`

Use these inferred image groups. Image names are ordering keys only; the bucket mapping is supplied here.

- `text`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson2/page32.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson2/page36.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson2/page37.webp`
- `grammar`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson2/page33.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson2/page34.webp`
- `vocabulary`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson2/page35.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson2/page36.webp`
- `word`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson2/page41.webp`
- `exercises`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson2/page38.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson2/page39.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson2/page40.webp`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially:

- the exercise `number -> question -> answer` checklist
- furigana-based disambiguation
- every `sentences[].id` appearing exactly once in `textStructure[].groups[].ids`
- the lesson 28 standard schema described in the shared rules
