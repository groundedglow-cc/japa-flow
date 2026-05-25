# Codex Course Parse Task - Lesson 30

You are extracting a Japanese textbook lesson from local images into strict JapaFlow lesson JSON.

Read and obey the shared extraction rules first:

<<<<<<< HEAD
- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-init/codex-parse-common.md`
=======
- `/Users/eleme/Documents/japa-flow/data/lesson-init/codex-parse-common.md`
>>>>>>> split/admin-student

## Output

Write the final JSON to:

<<<<<<< HEAD
- `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-drafts/lesson30.json`
=======
- `/Users/eleme/Documents/japa-flow/data/lesson-drafts/lesson30.json`
>>>>>>> split/admin-student

Do not edit `app.js`. Do not overwrite existing lesson 27 data.

## Lesson Context

- Lesson id: `30`
<<<<<<< HEAD
- Lesson asset root: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson30`

Use these inferred image groups. Image names are ordering keys only; the bucket mapping is supplied here.

- `text`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson30/page60.webp` (#1 page60.webp), `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson30/page64.webp` (#5 page64.webp), `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson30/page65.webp` (#6 page65.webp)
- `grammar`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson30/page61.webp` (#2 page61.webp), `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson30/page62.webp` (#3 page62.webp)
- `vocabulary`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson30/page63.webp` (#4 page63.webp), `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson30/page64.webp` (#5 page64.webp)
- `word`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson30/page69.webp` (#10 page69.webp)
- `exercises`: `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson30/page66.webp` (#7 page66.webp), `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson30/page67.webp` (#8 page67.webp), `/Users/tangyefei/Documents/projects/japa-flow/course-assets/by-lesson/lesson30/page68.webp` (#9 page68.webp)

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially:

- the exercise `number -> question -> answer` checklist
- furigana-based disambiguation
- `vocabulary[]` entries coming only from the `word` bucket, never from `grammar` images
- every `sentences[].id` appearing exactly once in `textStructure[].groups[].ids`
- the lesson 28 standard schema described in the shared rules
=======
- Lesson asset root: `/Users/eleme/Documents/japa-flow/course-assets/lesson30`

Read all image files under these directories in filename sort order. Ignore image names except for ordering.

- `text`: `/Users/eleme/Documents/japa-flow/course-assets/lesson30/text`
- `grammar`: `/Users/eleme/Documents/japa-flow/course-assets/lesson30/grammar`
- `vocabulary`: `/Users/eleme/Documents/japa-flow/course-assets/lesson30/vocabulary`
- `exercises`: `/Users/eleme/Documents/japa-flow/course-assets/lesson30/exercises`

If a category directory is empty or missing, skip that category and use empty arrays where the source images do not show values.

Before writing, perform the validation checklist from the shared rules, especially the exercise `number -> question -> answer` checklist and furigana-based disambiguation.
>>>>>>> split/admin-student
