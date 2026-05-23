# Codex Course Parse Task - Lesson 9

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-init/codex-parse-common.md`

## Output

Write the final JSON to:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-drafts/lesson9.json`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `9`
- Lesson asset root: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson9`

Use these inferred image groups. Image names are ordering keys only; the bucket mapping is supplied here.

- `text`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson9/page114.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson9/page118.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson9/page119.webp`
- `grammar`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson9/page115.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson9/page116.webp`
- `vocabulary`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson9/page117.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson9/page118.webp`
- `word`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson9/page123.webp`
- `exercises`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson9/page120.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson9/page121.webp`, `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson9/page122.webp`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially:

- the exercise `number -> question -> answer` checklist
- furigana-based disambiguation
- every `sentences[].id` appearing exactly once in `textStructure[].groups[].ids`
- the lesson 28 standard schema described in the shared rules
