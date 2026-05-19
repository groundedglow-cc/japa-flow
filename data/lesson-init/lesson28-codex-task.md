# Codex Course Parse Task - Lesson 28

You are extracting a Japanese textbook lesson from the attached images into strict JapaFlow lesson JSON.

## Output

Write the final JSON to: `/Users/tangyefei/Documents/projects/japa-flow/data/lesson-drafts/lesson28.json`

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
- /Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson28/text/1779028654152-1-2026-05-17-22-03-48.png
- /Users/tangyefei/Documents/projects/japa-flow/course-assets/lesson28/text/1779028654153-2-2026-05-17-22-04-17.png

### grammar

### vocabulary

### exercises

## Validation Before Writing

- Confirm every uploaded exercise image has corresponding `exercises[]` items.
- Confirm every uploaded grammar image has corresponding `grammar[]` entries or `extraExamples[]`.
- Confirm every uploaded vocabulary image has corresponding `vocabulary[]` entries.
- Confirm every text/dialogue line is represented in `sentences[]` and `textStructure[]`.

Write only the JSON file. In your final message, report counts for vocabulary, sentences, grammar, and exercises.