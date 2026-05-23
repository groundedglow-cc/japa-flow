# Codex Course Parse Common Rules

Use these rules for every JapaFlow textbook image extraction task.

## Required JSON Shape

Follow the existing lesson 27 structure as closely as possible:

- `id`
- `title`
- `subtitle`
- `vocabulary[]`: `{ id, jp, kana, cn }`
- `sentences[]`: `{ id, order, speaker?, text, kana, translation, words, grammar }`
- `textStructure[]`: preserve textbook text sections as flat section records in visual order. Each section must use `{ id, title, note?, sentenceIds[] }`. Do not emit nested `groups`; if a section has multiple visible sub-blocks, preserve their order by listing the sentence ids in the exact visible order and use `note` for any section caption printed in the image.
- `grammar[]`: `{ id, pattern, meaning, structure, usage, examples, extraExamples }`
- `exercises[]`: `{ id, groupId, groupTitle, category, instruction, example?, exampleKana?, type, question, questionKana?, choices?, answer, answerKana?, referenceAnswers, referenceAnswerKana?, relatedGrammar, relatedSentences, explanation }`

## Image Reading Order

- The lesson task lists category directories, not semantic file names.
- In each category directory, read every image file in filename sort order.
- Use file names only as ordering keys. Do not infer content, section, or meaning from the file name.
- Use the directory category as the semantic bucket: `text`, `grammar`, `vocabulary`, `exercises`.
- Process categories in this order unless the lesson task says otherwise: `text`, `grammar`, `vocabulary`, `exercises`.

## Extraction Rules

- The source images are the authority. Existing JSON, older drafts, lesson titles, and prior assumptions are only schema references, never OCR truth.
- First transcribe from the image into an independent checklist, then compare with any existing JSON if needed.
- Do not use any existing lesson JSON or draft files from another lesson as content sources. Only use the current lesson images plus this prompt/rules as references.
- If a previous lesson draft is visible in the workspace, treat it only as a structural example after the image transcription is complete; never copy its content or carry over its wording.
- Do not use another lesson's vocabulary, sentence, grammar, or exercise content to fill a gap in the current lesson. If the image does not show a value, leave it empty or mark it unknown; do not infer from lesson 28/29/30 content patterns.
- Do not let a prior lesson's example block, question wording, or answer pattern anchor the current lesson's extraction. Each lesson must be rebuilt from the visible page only.
- Completeness is more important than brevity.
- Do not omit any exercise question.
- Do not merge separate exercise items into one item.
- Preserve examples and model answers if visible.
- Preserve grammar explanation text, sentence patterns, example sentences, and extra examples.
- Preserve listening exercises even if answers are not visible; set `audioRequired: true` and `hasAnswer: false` when appropriate.
- Use empty strings or empty arrays when source images do not show a value.
- Use stable ids: `w1`, `s1`, `g1`, `ex-i-1-1` style where possible.
- Keep Japanese punctuation and kana exactly where visible.
- Sentence `kana` is the primary source for ruby display. Preserve visible kana spacing as word/phrase boundaries, and keep each sentence's kana aligned to its `text` instead of relying on a static reading guess.
- Exercise `questionKana`, `answerKana`, `referenceAnswerKana[]`, and `exampleKana` are the primary source for ruby display inside exercises. When the image shows furigana for an exercise prompt, example, answer, or option, store that reading aligned to the corresponding Japanese text. If a reading is not visible, leave the kana field empty instead of guessing.
- For uncertain OCR, keep the visible text and add a concise note in `explanation` only when needed.

## OCR Accuracy Rules

- Check every numbered item against the source image one by one. Do not mark a group "mostly correct" after fixing only the most obvious error.
- Do not let an existing draft anchor the reading. If the draft and image conflict, the image wins.
- When a page contains similar-looking names or repeated nouns, use the local furigana, surrounding sentence, and nearby illustration together; do not substitute a more familiar name just because it fits an older lesson.
- For similar kanji or names, use furigana/kana printed above the text to disambiguate the visible word.
- Pay special attention to visually similar or easily substituted items, such as `姉/林`, `馬/森`, `李/季`, and names ending in `さん`.
- Do not replace a visible name or word with a more familiar lesson character name unless the image clearly says so.
- When a numbered question has furigana above the subject or key word, verify the kanji reading against that furigana before writing JSON.
- Before final output, print or mentally verify a `number -> question -> answer` checklist for every exercise group.

## Exercise Block Boundary Rules

- Read exercises by visual blocks, not by inferred grammar similarity. A numbered exercise starts at its heading and ends before the next numbered exercise heading.
- Within one exercise, each visible `[例]` starts an example block. All numbered questions immediately following that example belong to that example until the next `[例]` or the next exercise heading.
- Do not pool all examples at the top of an exercise. For every extracted exercise item, repeat the exact example block it belongs to in that item's `example` field.
- Build the example list from the page block order first, then attach each numbered question to its nearest visible example block. Do not backfill or merge blocks based on later questions.
- Do not attach questions from a later example block to an earlier example block, even if the target grammar is the same.
- When an example shows short replacement prompts followed by a full transformed sentence or dialogue, preserve the complete visible example in `example`: include both the short prompt(s) and the full transformed sentence/dialogue.
- The `example` field for replacement-dialogue exercises must be self-contained: `short prompt(s) -> full dialogue`. It is incorrect to store only the short prompt(s), because the learner needs the dialogue pattern.
- Preserve the arrow/transition marker (`→`) when visible between prompts and transformed output.
- For dialogue replacement exercises, preserve speaker labels and all dialogue turns visible in the example. Do not keep only the short replacement phrases.
- If one example block has multiple dialogue turns, keep all turns in the same `example` string in visual order, using speaker labels such as `甲：` and `乙：`.
- During validation, list each exercise group as `example -> question ids` and verify it matches the visual order in the image.

## Grammar Block Boundary Rules

- Treat every numbered grammar/expression heading as its own block. A block starts at that heading and ends before the next numbered heading or the next major textbook section.
- Assign grammar example sentences only to the grammar block where they visually appear. Do not borrow sentences from a later grammar/expression block, even if the grammar form looks related.
- Put every example sentence printed inside the current grammar explanation block in `extraExamples[]`, in visual order. Use one `extraExamples[]` item per visible sentence or dialogue line; do not merge multiple printed sentences into one item. Do not omit a printed grammar example just because the same sentence already exists in `sentences[]` or is referenced from `examples[]`.
- Put related textbook text/dialogue sentence ids in `examples[]`; these must reference `sentences[]` ids, not duplicate sentence text.
- If a later block is an expression note such as `〜てあげます（表达）`, create or update a separate grammar entry for that block and keep its examples there.
- If a grammar example is marked with `×`, preserve it in the same block's `extraExamples[]` with `isIncorrect: true` and a short `note`; do not treat it as a correct/core practice example.
- During validation, re-check each grammar entry against the image block boundaries and remove any examples that came from a neighboring block.

## Validation Before Writing

- Confirm every uploaded exercise image has corresponding `exercises[]` items.
- Confirm each exercise item's `example` is the nearest preceding visible `[例]` block, not a pooled list of all examples in the group.
- Confirm every numbered exercise item was checked against the image, including subject names and furigana.
- Confirm dialogue examples preserve short prompt(s), `→`, and all full visible dialogue turns, not only replacement prompts.
- Confirm every uploaded grammar image has corresponding `grammar[]` entries or `extraExamples[]`.
- Confirm each grammar entry's `extraExamples[]` contains every visible example sentence from that grammar block as separate items, including examples that duplicate core text/dialogue sentences already present in `sentences[]`.
- Confirm every grammar entry's `extraExamples[]` only contains sentences from that entry's visual block.
- Confirm every `×` grammar example is marked `isIncorrect: true` and is not mixed into correct examples.
- Confirm every uploaded vocabulary image has corresponding `vocabulary[]` entries.
- Confirm every text/dialogue line is represented in `sentences[]` and `textStructure[]`, and that `textStructure[]` uses the flat section schema above rather than a nested `groups` structure.

Write only the requested JSON file. In the final message, report counts for vocabulary, sentences, grammar, and exercises.
