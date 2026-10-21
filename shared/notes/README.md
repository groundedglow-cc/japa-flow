# InlineAiNotes

Reusable React inline note editor. Import `InlineAiNotes.jsx` and include
`inline-ai-notes.css` in the host page's stylesheet bundle (practice's build script does this).

Mount with `key={scopeKey}` to isolate each question/page. Provide:

- `loadNotes(): Note[]`: synchronous initial read.
- `saveNotes(notes): void`: synchronous persistence; throw on failure. The host should merge this scope into its store.
- `askAi(question, { signal }): Promise<string>`: AI transport, auth and response extraction belong to the host. Honor AbortSignal.

Notes retain `id`, `text`, `kind`, `color` for existing consumers and additionally store
`question` and `answer` separately. `noteFields` handles old `问：…\n答：…` AI notes without migrating the whole store.
Editing preserves the record ID; saving plain text clears the previous answer.
Drafts survive collapse and switching editors within the mounted component, but not page reload/unmount.
Deletion offers a single-level undo until the component unmounts. Saved notes use the host's existing persistence.

The component supports double-click and explicit Edit buttons, adjustable textarea height,
cancel/retry, stale-response rejection, and plain-text rendering of AI output.

Run model checks: `node --test shared/notes/noteModel.test.js`.

## Plain HTML pages

`mountInlineNotes.jsx` adapts the component to grammar/text previews. Add a
`.inline-notes-host` with `data-inline-notes-key` (localStorage key),
`data-notes-lesson` and `data-notes-item`. AI requests send only the user-entered question; page content is never prepended.
Use `.inline-notes-container` on the containing grammar group or sentence.
Load the generated JS/CSS and call `window.mountInlineNotes?.()` after replacing
page HTML. Roots with the same storage key are reattached so ordinary rerenders
preserve drafts and active requests. Removed scopes are unmounted and cancelled.

`npm run build:notes` bundles this adapter and styles and updates cache versions in
both HTML pages; `npm run build:practice` also invokes it.
Desktop entries appear on container hover/focus; touch devices keep them visible.
Text preview retains its existing localStorage keys and infers legacy AI question/answer records.
