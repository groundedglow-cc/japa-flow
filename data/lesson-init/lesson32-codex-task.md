# Codex Course Parse Task - Lesson 32

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-init/codex-parse-common.md`

## Output

Write the final JSON to:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-drafts/lesson32.json`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `32`
- Lesson asset root: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson32`

Use these inferred image groups. Image names are ordering keys only; the bucket mapping is supplied here.

- `text`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson32/page80.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson32/page84.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson32/page85.webp`
- `grammar`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson32/page81.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson32/page82.webp`
- `vocabulary`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson32/page83.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson32/page84.webp`
- `word`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson32/page89.webp`
- `exercises`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson32/page86.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson32/page87.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson32/page88.webp`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially:

- the exercise `number -> question -> answer` checklist
- furigana-based disambiguation
- `vocabulary[]` entries coming only from the `word` bucket, never from `grammar` images
- every `sentences[].id` appearing exactly once in `textStructure[].groups[].ids`
- the lesson 28 standard schema described in the shared rules
