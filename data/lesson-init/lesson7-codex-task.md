# Codex Course Parse Task - Lesson 7

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-init/codex-parse-common.md`

## Output

Write the final JSON to:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-drafts/lesson7.json`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `7`
- Lesson asset root: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson7`

Use these inferred image groups. Image names are ordering keys only; the bucket mapping is supplied here.

- `text`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson7/page88.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson7/page92.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson7/page93.webp`
- `grammar`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson7/page89.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson7/page90.webp`
- `vocabulary`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson7/page91.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson7/page92.webp`
- `word`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson7/page97.webp`
- `exercises`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson7/page94.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson7/page95.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson7/page96.webp`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially:

- the exercise `number -> question -> answer` checklist
- furigana-based disambiguation
- every `sentences[].id` appearing exactly once in `textStructure[].groups[].ids`
- the lesson 28 standard schema described in the shared rules
