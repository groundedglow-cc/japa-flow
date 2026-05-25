# Codex Course Parse Task - Lesson 8

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-init/codex-parse-common.md`

## Output

Write the final JSON to:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-drafts/lesson8.json`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `8`
- Lesson asset root: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson8`

Use these inferred image groups. Image names are ordering keys only; the bucket mapping is supplied here.

- `text`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson8/page98.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson8/page102.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson8/page103.webp`
- `grammar`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson8/page99.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson8/page100.webp`
- `vocabulary`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson8/page101.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson8/page102.webp`
- `word`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson8/page107.webp`
- `exercises`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson8/page104.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson8/page105.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson8/page106.webp`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially:

- the exercise `number -> question -> answer` checklist
- furigana-based disambiguation
- every `sentences[].id` appearing exactly once in `textStructure[].groups[].ids`
- the lesson 28 standard schema described in the shared rules
