# Codex Course Parse Task - Lesson 29

You are extracting a Japanese textbook lesson from the attached images into strict JapaFlow lesson JSON.

## Output

Write the final JSON to: `/Users/eleme/Documents/japa-flow/data/lesson-drafts/lesson29.json`

Do not edit `app.js` for this task. Do not overwrite existing lesson 27 data.

## Required JSON Shape

Follow the existing lesson 27 structure as closely as possible:

- `id`
- `title`
- `subtitle`
- `vocabulary[]`: `{ id, jp, kana, cn }`
- `sentences[]`: `{ id, order, speaker?, text, kana, translation, words, grammar }`
- `textStructure[]`: preserve textbook text sections and group sentence ids in order
- `grammar[]`: `{ id, pattern, meaning, structure, usage, examples, extraExamples }`
- `exercises[]`: `{ id, groupId, groupTitle, category, instruction, example?, type, question, choices?, answer, referenceAnswers, relatedGrammar, relatedSentences, explanation }`

## Extraction Rules

- Completeness is more important than brevity.
- Do not omit any exercise question.
- Do not merge separate exercise items into one item.
- Preserve examples and model answers if visible.
- Preserve grammar explanation text, sentence patterns, example sentences, and extra examples.
- Preserve listening exercises even if answers are not visible; set `audioRequired: true` and `hasAnswer: false` when appropriate.
- Use empty strings or empty arrays when source images do not show a value.
- Use stable ids: `w1`, `s1`, `g1`, `ex-i-1-1` style where possible.
- Keep Japanese punctuation and kana exactly where visible.
- For uncertain OCR, keep the visible text and add a concise note in `explanation` only when needed.

## Image Manifest

### text
- /Users/eleme/Documents/japa-flow/course-assets/lesson29/text/基本课文.PNG
- /Users/eleme/Documents/japa-flow/course-assets/lesson29/text/应用课文.PNG

### grammar
- /Users/eleme/Documents/japa-flow/course-assets/lesson29/grammar/语法1.PNG
- /Users/eleme/Documents/japa-flow/course-assets/lesson29/grammar/语法2.PNG

### vocabulary
- /Users/eleme/Documents/japa-flow/course-assets/lesson29/vocabulary/表达及词语1.PNG
- /Users/eleme/Documents/japa-flow/course-assets/lesson29/vocabulary/表达及词语2.PNG

### exercises
- /Users/eleme/Documents/japa-flow/course-assets/lesson29/exercises/练习1-1.PNG
- /Users/eleme/Documents/japa-flow/course-assets/lesson29/exercises/练习1-2.PNG
- /Users/eleme/Documents/japa-flow/course-assets/lesson29/exercises/练习2-1.PNG

## Validation Before Writing

- Confirm every uploaded exercise image has corresponding `exercises[]` items.
- Confirm every uploaded grammar image has corresponding `grammar[]` entries or `extraExamples[]`.
- Confirm every uploaded vocabulary image has corresponding `vocabulary[]` entries.
- Confirm every text/dialogue line is represented in `sentences[]` and `textStructure[]`.

Write only the JSON file. In your final message, report counts for vocabulary, sentences, grammar, and exercises.