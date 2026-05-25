# Codex Course Parse Task - Lesson 29

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-init/codex-parse-common.md`

## Output

Write the final JSON to:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-drafts/lesson29.json`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `29`
- Lesson asset root: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson29`

Read all image files under these directories in filename sort order. Ignore image names except for ordering.

- `text`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson29/text`
- `grammar`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson29/grammar`
- `vocabulary`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson29/vocabulary`
- `word`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson29/word`
- `exercises`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson29/exercises`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially:

- the exercise `number -> question -> answer` checklist
- furigana-based disambiguation
- every `sentences[].id` appearing exactly once in `textStructure[].groups[].ids`
- the lesson 28 standard schema described in the shared rules
