Read the 4 attached Japanese textbook grammar-page images for JapaFlow lesson 35. Write exactly one JSON file to /Users/rookie/Documents/personal-projects/japa-flow/data/ocr/lesson35-grammar-vocabulary-scan.json.

Schema:
{ "schemaVersion": 1, "lessonId": "lesson35", "reviewStatus": "pending", "pages": { "PAGE_NO": { "sourceText": ["Japanese learning text"], "warnings": [] } } }

Rules:
- Include every visible Japanese grammar heading, pattern, example sentence, dialogue line, and Japanese vocabulary/example label that a learner may study.
- Exclude Chinese explanatory prose, page headers/footers, page numbers, and decorative text.
- Keep page keys for every supplied image, even when no Japanese text is found.
- Preserve Japanese text exactly enough for vocabulary matching; split sourceText into short logical lines.
- Do not create wordIds and do not read any vocabulary JSON. Matching is performed later by a deterministic program.
- Do not modify any file except the requested JSON. Output valid JSON only.