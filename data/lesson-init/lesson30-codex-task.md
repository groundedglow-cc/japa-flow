# Codex Course Parse Task - Lesson 30

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-init/codex-parse-common.md`

Do not read any existing lesson JSON or draft files from other lessons as content sources. Only use the lesson30 images plus the shared rules.
Do not use lesson28/29/30 JSON as a template for wording, questions, answers, example grouping, or missing fields. If an item is not visible in the images, leave it empty rather than inferring from older lessons.

## Output

Write the final JSON to:

- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-drafts/lesson30.json`

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `30`
- Lesson asset root: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson30`

Read all image files under these directories in filename sort order. Ignore image names except for ordering.

- `text`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson30/text`
- `grammar`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson30/grammar`
- `vocabulary`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson30/vocabulary`
- `exercises`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson30/exercises`
- `word`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson30/word`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially the exercise `number -> question -> answer` checklist and furigana-based disambiguation.
