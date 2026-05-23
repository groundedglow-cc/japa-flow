# Codex Course Parse Task - Lesson 30

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `/Users/eleme/Documents/japa-flow/data/lesson-init/codex-parse-common.md`

## Output

Write the final JSON to:

- `/Users/eleme/Documents/japa-flow/data/lesson-drafts/lesson30.json`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `30`
- Lesson asset root: `/Users/eleme/Documents/japa-flow/course-assets/lesson30`

Read all image files under these directories in filename sort order. Ignore image names except for ordering.

- `text`: `/Users/eleme/Documents/japa-flow/course-assets/lesson30/text`
- `grammar`: `/Users/eleme/Documents/japa-flow/course-assets/lesson30/grammar`
- `vocabulary`: `/Users/eleme/Documents/japa-flow/course-assets/lesson30/vocabulary`
- `exercises`: `/Users/eleme/Documents/japa-flow/course-assets/lesson30/exercises`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially the exercise `number -> question -> answer` checklist and furigana-based disambiguation.