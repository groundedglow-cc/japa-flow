import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { noteFields, savedNote } from './noteModel.js';

// Mount with key={scopeKey}. Storage and AI/auth integration belong to the host page.
export default function InlineAiNotes({ loadNotes, saveNotes, askAi }) {
  const [notes, setNotes] = useState(loadNotes);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [draft, setDraft] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [expanded, setExpanded] = useState({});
  const [deleted, setDeleted] = useState(null);
  const [highlight, setHighlight] = useState('');
  const drafts = useRef(new Map());
  const request = useRef(null);
  const input = useRef(null);
  const answerInput = useRef(null);
  const editor = useRef(null);
  useEffect(() => () => request.current?.abort(), []);
  useLayoutEffect(() => {
    if (!open || !input.current) return;
    input.current.style.height = 'auto';
    input.current.style.height = `${Math.min(224, Math.max(60, input.current.scrollHeight))}px`;
  }, [draft, open, editingId]);
  useLayoutEffect(() => {
    if (!open || !answerInput.current) return;
    answerInput.current.style.height = 'auto';
    answerInput.current.style.height = `${Math.min(224, Math.max(40, answerInput.current.scrollHeight))}px`;
  }, [answer, open, editingId]);
  useEffect(() => { if (open) { input.current?.focus(); editor.current?.scrollIntoView({ block: 'nearest' }); } }, [open, editingId]);
  const cancel = () => { request.current?.abort(); request.current = null; setBusy(false); };
  const persist = next => {
    try { saveNotes(next); setNotes(next); return true; }
    catch { setStatus('保存失败，请检查浏览器存储空间后重试。'); return false; }
  };
  const edit = note => {
    drafts.current.set(editingId, { draft, answer });
    cancel();
    const id = note?.id || '';
    const fields = drafts.current.get(id) || (note ? noteFields(note) : { draft: '', answer: '' });
    setEditingId(id); setDraft(fields.draft); setAnswer(fields.answer); setStatus(''); setOpen(true);
  };
  const save = (includeAnswer = true) => {
    if (!draft.trim()) return;
    const record = savedNote(notes.find(n => n.id === editingId), draft, includeAnswer ? answer : '');
    const next = editingId ? notes.map(n => n.id === editingId ? record : n) : [record, ...notes];
    if (!persist(next)) return;
    cancel(); drafts.current.delete(editingId); setEditingId(''); setDraft(''); setAnswer(''); setOpen(false); setStatus('已保存'); setHighlight(record.id);
  };
  const ask = async () => {
    if (!draft.trim() || busy) return;
    const controller = new AbortController(); request.current = controller;
    const question = draft.trim();
    setBusy(true); setStatus('正在回答…');
    const timer = setTimeout(() => { if (request.current === controller) { cancel(); setStatus('等待超时，请重试；也可以直接保存笔记。'); } }, 140000);
    try {
      const reply = await askAi(question, { signal: controller.signal });
      if (request.current !== controller) return;
      if (!reply?.trim()) throw new Error('AI 未返回内容，请重试。');
      setAnswer(reply); setStatus('');
    } catch (error) {
      if (request.current === controller) setStatus(error.message || '请求失败，请重试。');
    } finally {
      clearTimeout(timer);
      if (request.current === controller) { request.current = null; setBusy(false); }
    }
  };
  const remove = note => {
    if (!persist(notes.filter(n => n.id !== note.id))) return;
    setDeleted({ note, index: notes.findIndex(n => n.id === note.id) });
    drafts.current.delete(note.id);
    if (editingId === note.id) { cancel(); setEditingId(''); setDraft(''); setAnswer(''); setOpen(false); }
    setStatus('已删除笔记');
  };
  return <section className={`inline-ai-notes${open ? " is-open" : ""}`} aria-label="题目笔记">
    <div className="ian-entry"><button type="button" className={`ian-trigger ${open ? 'active' : ''}`} aria-label="记笔记 / 问 AI" title="记笔记 / 问 AI" aria-expanded={open} onClick={() => open ? setOpen(false) : setOpen(true)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13.5 5.5l5 5M4 20l4.5-1 12-12a2.1 2.1 0 0 0-5-3l-12 12L4 20Z"/><path d="M12 20h8"/></svg></button>
      {!open && (draft || busy) ? <small>{busy ? '正在回答…' : '有未保存的草稿'}</small> : null}
    </div>
    {open && <div className="ian-editor" ref={editor}>
      <header><strong>{editingId ? '编辑笔记' : '随手记'}</strong><div>{editingId && <button type="button" onClick={() => edit(null)}>新建笔记</button>}<button type="button" onClick={() => setOpen(false)}>收起</button></div></header>
      <textarea ref={input} aria-label="笔记或问题" placeholder="写下你的理解，或想问 AI 的问题…" value={draft} rows={2} onChange={e => { cancel(); setDraft(e.target.value); setAnswer(''); setStatus(answer ? '问题已修改，请重新问 AI。' : ''); }} />
      {answer && <label className="ian-answer"><span>✦ AI 回答 <small>可编辑整理</small></span><textarea ref={answerInput} aria-label="AI 回答" value={answer} onChange={e => setAnswer(e.target.value)} rows={1} /></label>}
      <div className="ian-actions">
        {busy ? <button type="button" onClick={() => { cancel(); setStatus('已取消，可继续编辑或保存。'); }}>取消回答</button> : <button type="button" disabled={!draft.trim()} onClick={ask}>{answer ? '重新回答' : '✦ 问 AI'}</button>}
        <div>{answer && <button type="button" disabled={!draft.trim()} onClick={() => save(false)}>仅保存输入</button>}<button type="button" className="ian-primary" disabled={!draft.trim()} onClick={() => save()}>{answer ? '保存问答笔记' : '保存笔记'}</button></div>
      </div>
    </div>}
    <div className="ian-status" role="status">{status}{deleted && <button type="button" onClick={() => { const next = [...notes]; next.splice(deleted.index, 0, deleted.note); if (persist(next)) { setDeleted(null); setStatus('已恢复笔记'); } }}>撤销删除</button>}</div>
    <div className="ian-list">{notes.map(note => {
      const fields = noteFields(note);
      return <article key={note.id} className={`ian-note ian-${note.color || 'yellow'} ${highlight === note.id ? 'ian-saved' : ''} ${editingId === note.id && open ? 'ian-editing' : ''}`} onDoubleClick={e => { if (!e.target.closest('button, select')) edit(note); }}>
        <header><small>{fields.answer ? '问答笔记' : '笔记'}{editingId === note.id && open ? ' · 编辑中' : ''}</small><div><div className="ian-colors" role="group" aria-label="笔记颜色">{[['yellow','黄色'],['purple','紫色'],['green','绿色'],['blue','蓝色'],['pink','粉色']].map(([value,label]) => <button type="button" key={value} className={`ian-swatch ian-swatch-${value}`} title={label} aria-label={label} aria-pressed={(note.color || 'yellow') === value} onClick={() => persist(notes.map(n => n.id === note.id ? { ...n, color: value } : n))} />)}</div><button type="button" onClick={() => edit(note)}>编辑</button><button type="button" onClick={() => remove(note)}>删除</button></div></header>
        <div className={expanded[note.id] ? 'ian-content' : 'ian-content ian-clamped'}><p>{fields.draft}</p>{fields.answer && <div className="ian-saved-answer"><small>✦ AI 回答</small><p>{fields.answer}</p></div>}</div>
        {(fields.answer || fields.draft.length > 120 || fields.draft.split('\n').length > 3) && <button type="button" className="ian-expand" onClick={() => setExpanded({ ...expanded, [note.id]: !expanded[note.id] })}>{expanded[note.id] ? '收起内容' : '展开内容'}</button>}
      </article>;
    })}</div>
  </section>;
}
