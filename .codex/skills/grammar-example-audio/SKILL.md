---
name: grammar-example-audio
description: Extract and organize Japanese grammar-page example sentences from lesson images, validate them in the course preview, and generate matching Azure Japanese audio manifests and MP3 files.
---

# Grammar example and audio workflow

Use this skill when adding or repairing grammar-page examples and their sentence audio in this JapaFlow project.

## Non-negotiable quality rule

The lesson image is the source of truth. OCR is only an index to locate likely text; it must never be used as the final sentence extractor. Do not generate audio from a whole-page OCR filter. Chinese OCR explanations, table rows, vocabulary, headings, and broken line fragments are commonly mixed into OCR output.

Before expanding to a batch, manually inspect every grammar-page image for one lesson and confirm the result in `course-detail-preview.html?lesson=N&part=grammar`. Use the validated lesson as the acceptance test for the workflow.

## Procedure

1. Identify the grammar-page image range in `course-assets/by-lesson/lessonN/`. Read the images directly (usually four pages before the application text pages). Use existing OCR only to help locate headings and candidate sentences.
2. Transcribe each Japanese example visible under each grammar point. Preserve dialogue turns, punctuation, textbook counterexamples, and sentence order. Exclude conjugation tables, vocabulary lists, Chinese explanations, and application-text pages unless the user explicitly requests them.
3. Write `data/ocr/lessonN-grammar-examples.json` using the established schema:
   - `reviewStatus: "approved"` only after image review; otherwise use `ocr-unreviewed`.
   - `pages` keyed by textbook page number.
   - `groups` keyed by grammar point, with `examples` containing `sentences` arrays.
   - Encode readings as `漢字[かな]`; use `note` for usage/context and `incorrect: true` for textbook-marked counterexamples.
4. Validate JSON and open the lesson grammar preview. Confirm page alignment, group titles, sentence count, visible Japanese wording, and that no OCR explanation/table text appears.
5. Generate Azure · Keita audio only after the visual check:

   ```bash
   node scripts/generate-azure-grammar-audio.mjs --lesson=N --voice=ja-JP-KeitaNeural
   ```

   This writes `data/ocr/lessonN-grammar-audio.json` and cached files under `audio/grammar/lessonN/azure-keita/`. Re-running skips existing hashes. Check every manifest path exists and refresh the browser to verify the online-audio status.

## Batch expansion

Do not extrapolate a sentence-selection regex from one lesson to the rest. After one lesson passes visual validation, repeat the image-first procedure per lesson (or in small batches with a visual spot check for every page). A batch may automate file creation and Azure calls, but it may not replace page-level sentence confirmation.

## Existing reference

The approved lesson39 data in `data/ocr/lesson39-grammar-examples.json` demonstrates the target structure: page-level groups, grammar-aware sentence bundling, ruby readings, usage notes, and explicitly marked counterexamples.
