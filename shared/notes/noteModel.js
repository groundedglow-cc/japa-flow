export function noteFields(note) {
  if (typeof note.question === 'string') return { draft: note.question, answer: note.answer || '' };
  const text = note.text || '';
  const match = note.kind === 'ai' && text.match(/^问：([\s\S]*?)\n答：([\s\S]*)$/);
  return match ? { draft: match[1], answer: match[2] } : { draft: text, answer: '' };
}
export function savedNote(previous, draft, answer) {
  const question = draft.trim();
  const reply = answer.trim();
  return { ...previous, id: previous?.id || crypto.randomUUID(), question, answer: reply,
    text: reply ? `问：${question}\n答：${reply}` : question,
    kind: reply ? 'ai' : 'note', color: previous?.color || 'green' };
}
