import React from 'react';
import { createRoot } from 'react-dom/client';
import InlineAiNotes from './InlineAiNotes.jsx';

// Reattach existing roots after a vanilla page replaces its rendered HTML.
const mounted = new Map();
function mountInlineNotes() {
  const live = new Set();
  document.querySelectorAll('[data-inline-notes-key]').forEach(placeholder => {
    const key = placeholder.dataset.inlineNotesKey;
    live.add(key);
    const existing = mounted.get(key);
    if (existing) {
      if (existing.node !== placeholder) placeholder.replaceWith(existing.node);
      return;
    }
    const { notesLesson = '', notesItem = '' } = placeholder.dataset;
    // Editing a note must never trigger the surrounding sentence's audio/copy handlers.
    for (const type of ['click', 'dblclick', 'keydown']) placeholder.addEventListener(type, event => event.stopPropagation());
    const root = createRoot(placeholder);
    mounted.set(key, { root, node: placeholder });
    root.render(<InlineAiNotes
      loadNotes={() => {
        try {
          const entries = JSON.parse(localStorage.getItem(key) || '[]');
          return Array.isArray(entries) ? entries.map((entry, index) => {
            const note = typeof entry === 'string' ? { text: entry } : entry;
            return { ...note, id: note.id || `legacy-${index}`, kind: note.kind || (/^问：[\s\S]*\n答：/.test(note.text || '') ? 'ai' : 'note') };
          }) : [];
        } catch { return []; }
      }}
      saveNotes={notes => localStorage.setItem(key, JSON.stringify(notes))}
      askAi={async (question, { signal }) => {
        const response = await fetch('/api/grammar/notebook-ai', {
          method: 'POST', signal,
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('light_blog_token') || ''}` },
          body: JSON.stringify({ question, lessonId: notesLesson, pageNo: notesItem })
        });
        const data = await response.json().catch(() => ({}));
        if (response.status === 401 || response.status === 403) throw new Error('登录已失效，请重新登录后重试。');
        if (!response.ok) throw new Error(data.error || data.message || 'AI 请求失败。');
        return [data.answer, data.data?.answer, data.content, data.data?.content].find(value => typeof value === 'string' && value.trim()) || '';
      }} />);
  });
  for (const [key, entry] of mounted) {
    if (!live.has(key)) { entry.root.unmount(); mounted.delete(key); }
  }
}
window.mountInlineNotes = mountInlineNotes;
mountInlineNotes();
