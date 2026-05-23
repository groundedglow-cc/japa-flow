# Codex Course Parse Task - Lesson 5

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-init/codex-parse-common.md`

## Output

Write the final JSON to:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-drafts/lesson5.json`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `5`
- Lesson asset root: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson5`

Use these inferred image groups. Image names are ordering keys only; the bucket mapping is supplied here.

- `text`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson5/page68.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson5/page72.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson5/page73.webp`
- `grammar`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson5/page69.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson5/page70.webp`
- `vocabulary`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson5/page71.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson5/page72.webp`
- `word`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson5/page77.webp`
- `exercises`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson5/page74.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson5/page75.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson5/page76.webp`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially:

- the exercise `number -> question -> answer` checklist
- furigana-based disambiguation
- every `sentences[].id` appearing exactly once in `textStructure[].groups[].ids`
- the lesson 28 standard schema described in the shared rules
