# Codex Course Parse Common Rules

Use these rules for every JapaFlow textbook image extraction task.

## Required JSON Shape

Use `data/lessons/lesson28.json` as the structural standard for all future initialized lessons. Generate one complete lesson JSON object with these top-level fields:

- `id`: numeric lesson id.
- `title`: Chinese lesson title, for example `第28课`.
- `subtitle`: main Japanese lesson title or first representative sentence.
- `vocabulary[]`: word list in textbook order.
- `sentences[]`: every textbook basic/application sentence or dialogue line.
- `textStructure[]`: nested lesson text navigation using sections and groups.
- `grammar[]`: grammar/expression blocks in textbook order.
- `exercises[]`: every visible exercise item in textbook order.
- `audioVoiceId?`: optional voice id, only include when the lesson audio voice is known.

### `vocabulary[]`

Each vocabulary item must use:

- `{ id, jp, kana, cn }`
- `id`: stable sequential id, for example `w1`.
- `jp`: Japanese headword exactly as visible.
- `kana`: visible reading, or a reliable reading only when the textbook clearly supplies it.
- `cn`: Chinese meaning exactly as visible, preserving short glosses and punctuation.

### `sentences[]`

Each sentence item must use:

- `{ id, order, speaker?, text, kana, translation, words, grammar }`
- `id`: stable sequential id, for example `s1`.
- `order`: textbook/display order. Use numbers when possible; use strings only when the visible order requires labels.
- `speaker?`: dialogue speaker label when visible, such as `甲`, `乙`, `森`, `馬`.
- `text`: Japanese sentence/dialogue line.
- `kana`: aligned reading for the full `text`.
- `translation`: Chinese translation.
- `words`: array of related `vocabulary[].id` values. Use `[]` when no clear relation is visible.
- `grammar`: array of related `grammar[].id` values. Use `[]` when no clear relation is visible.

### `textStructure[]`

Use the nested groups structure from lesson 28. Do not generate the older flat `{ sentenceIds[] }` structure for new lessons.

Each section must use:

- `{ id, title, groups }`
- `id`: stable semantic id when possible, for example `basic`, `application`.
- `title`: section tab title, for example `基本课文` or `应用课文 · 森的新居`.
- `groups`: ordered list of visible sub-blocks inside the section.

Each group must use:

- `{ title, kind, ids, note? }`
- `title`: group title, for example `基本句`, `对话 A`, or an application-scene caption.
- `kind`: `statements` for non-dialogue basic sentence groups, otherwise `dialogue`.
- `ids`: ordered `sentences[].id` values belonging to this group.
- `note?`: short printed or necessary scene note, for example `第二个星期`.

Every `sentences[].id` must appear exactly once in `textStructure[].groups[].ids`. Do not duplicate sentence ids across groups.

Recommended grouping:

- Basic text: one `basic` section with groups such as `基本句`, `对话 A`, `对话 B`, `对话 C`, `对话 D`.
- Application text: one `application` section with scene/dialogue groups in visual order.
- If a textbook lesson has additional major text sections, add more sections, but keep the same `{ id, title, groups }` schema.

### `grammar[]`

Each grammar item must use:

- `{ id, pattern, meaning, structure, usage, examples, extraExamples }`
- `id`: stable sequential id, for example `g1`.
- `pattern`: visible grammar/expression heading.
- `meaning`: concise Chinese meaning.
- `structure`: connection/formula/formation rule.
- `usage`: textbook explanation of usage and constraints.
- `examples`: array of related `sentences[].id` values, not duplicated sentence text.
- `extraExamples`: visible grammar-block example sentences, one item per sentence/dialogue line.

Each `extraExamples[]` item should use:

- `{ jp, kana, cn, isIncorrect?, note? }`
- `jp`: Japanese example.
- `kana`: aligned reading when visible or reliably supplied by the image.
- `cn`: Chinese meaning.
- `isIncorrect?`: `true` for examples marked with `×`.
- `note?`: short note for incorrect examples or special usage.

### `exercises[]`

Each exercise item must use:

- `{ id, groupId, groupTitle, category, instruction, example, exampleKana, type, question, questionKana, choices, answer, answerKana, referenceAnswers, referenceAnswerKana, relatedGrammar, relatedSentences, explanation, audioRequired?, hasAnswer? }`
- `id`: stable id in textbook order, for example `ex-i-1-1`.
- `groupId`: exercise group id, for example `ex-i-1`.
- `groupTitle`: visible group title, for example `练习I 1`.
- `category`: stable category label such as `replacement`, `picture-answer`, `listening-dialogue`, `particle-choice`, `choice`, `word-choice`, `listening-true-false`, `translation`.
- `instruction`: visible instruction or concise task description.
- `example`: nearest visible example block for this item. Use `""` if no example is visible.
- `exampleKana`: aligned reading for `example`. Use `""` if not visible.
- `type`: stable answer interaction type, such as `transform`, `short-answer`, `listening`, `choice`, `translation`.
- `question`: visible prompt/question.
- `questionKana`: aligned reading for `question`. Use `""` if not visible.
- `choices`: array of visible choices. Use `[]` when not a choice item.
- `answer`: primary expected answer. Use `""` if answer is not visible.
- `answerKana`: aligned reading for `answer`. Use `""` if not visible.
- `referenceAnswers`: array of accepted answers. Include `answer` when there is a visible or reliable answer; use `[]` when no answer is visible.
- `referenceAnswerKana`: array aligned by index to `referenceAnswers`; use `[]` or empty strings when readings are not visible.
- `relatedGrammar`: array of related `grammar[].id` values.
- `relatedSentences`: array of related `sentences[].id` values.
- `explanation`: concise explanation or OCR uncertainty note. Use `""` when unnecessary.
- `audioRequired?`: `true` for listening/speaking items that require audio.
- `hasAnswer?`: `false` when the item is visible but the answer is not shown.

## Image Reading Order

- The lesson task lists category directories, not semantic file names.
- In each category directory, read every image file in filename sort order.
- Use file names only as ordering keys. Do not infer content, section, or meaning from the file name.
- Use the directory category or inferred image group as the semantic bucket: `text`, `grammar`, `vocabulary`, `word`, `exercises`.
- Process categories in this order unless the lesson task says otherwise: `text`, `grammar`, `vocabulary`, `word`, `exercises`.
- If the lesson uses `course-assets/by-lesson/lessonXX`, map the sorted 10 images by index: `text` = 1, 5, 6; `grammar` = 2, 3; `vocabulary` = 4, 5; `word` = 10; `exercises` = 7, 8, 9. The same source image may belong to more than one semantic bucket.
- Vocabulary source boundary: populate top-level `vocabulary[]` only from the `word` bucket, meaning the textbook word-list page(s). Do not add `vocabulary[]` entries from `grammar`, `text`, `vocabulary`, or `exercises` bucket images, even when those pages contain example words, grammar terms, expression notes, or repeated lesson words.
- Treat the `vocabulary` bucket as expression/wording explanation source material, not as the authoritative source for top-level `vocabulary[]`. Use it only for explanations when a target schema field needs that context; do not turn its incidental terms into word-list entries.

## Extraction Rules

- The source images are the authority. Existing JSON, older drafts, lesson titles, and prior assumptions are only schema references, never OCR truth.
- First transcribe from the image into an independent checklist, then compare with any existing JSON if needed.
- Do not use any existing lesson JSON or draft files from another lesson as content sources. Only use the current lesson images plus this prompt/rules as references.
- If a previous lesson draft is visible in the workspace, treat it only as a structural example after the image transcription is complete; never copy its content or carry over its wording.
- Do not use another lesson's vocabulary, sentence, grammar, or exercise content to fill a gap in the current lesson. Lesson 28 is only the schema/template reference; never copy its content into another lesson.
- Do not let a prior lesson's example block, question wording, or answer pattern anchor the current lesson's extraction. Each lesson must be rebuilt from the visible page only.
- Completeness is more important than brevity.
- For `vocabulary[]`, completeness means all visible entries from the `word` bucket only. If a useful word appears only in grammar examples or exercise prompts and is absent from the word-list page, do not create a `vocabulary[]` item for it.
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
- Keep `referenceAnswerKana[]` index-aligned with `referenceAnswers[]`. If a reference answer lacks a visible reading, use an empty string at that index rather than shifting later readings.
- Always include `choices` on exercise items. Use an empty array for non-choice exercises.
- For uncertain OCR, keep the visible text and add a concise note in `explanation` only when needed.

## Text Structure Rules

- Build `textStructure[]` after all `sentences[]` have stable ids.
- Use section tabs for major textbook text areas, usually `basic` and `application`.
- Use groups for visible sentence clusters, such as `基本句`, `对话 A`, `对话 B`, or application-scene captions.
- Use `kind: "statements"` only for non-dialogue basic sentence lists. Use `kind: "dialogue"` for any group that has speakers or dialogue turns.
- Preserve visual order: section order, group order, and ids inside every group must match the textbook.
- Put scene captions or timing notes in `group.note` when they are not suitable as the group title.
- Do not create one section per small dialogue unless the textbook truly presents it as a major tab-level section.
- Do not emit `sentenceIds[]` for new lessons. The target schema is `textStructure[].groups[].ids`.
- Validate that every `sentences[].id` appears exactly once in the nested groups.

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
- Confirm every uploaded `word` bucket image has corresponding `vocabulary[]` entries, and confirm no `vocabulary[]` entry was sourced only from `grammar`, `text`, `vocabulary`, or `exercises` bucket images.
- Confirm every text/dialogue line is represented in `sentences[]` and exactly once in `textStructure[].groups[].ids`.
- Confirm `textStructure[]` uses the nested `{ id, title, groups }` schema and does not use the older flat `sentenceIds[]` schema.
- Confirm all exercise items include the standard fields from this document, including `choices`, kana fields, `referenceAnswers`, and `referenceAnswerKana`.

Write only the requested JSON file. In the final message, report counts for vocabulary, sentences, grammar, and exercises.
