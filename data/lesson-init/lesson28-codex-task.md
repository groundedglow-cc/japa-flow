# Codex Course Parse Task - Lesson 28

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-init/codex-parse-common.md`

## Output

Write the final JSON to:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-drafts/lesson28.json`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `28`
- Lesson asset root: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson28`

Read all image files under these directories in filename sort order. Ignore image names except for ordering.

- `text`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson28/text`
- `grammar`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson28/grammar`
- `vocabulary`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson28/vocabulary`
- `word`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson28/word`
- `exercises`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson28/exercises`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially:

- the exercise `number -> question -> answer` checklist
- furigana-based disambiguation
- every `sentences[].id` appearing exactly once in `textStructure[].groups[].ids`
- the lesson 28 standard schema described in the shared rules
