import test from 'node:test';
import assert from 'node:assert/strict';
import { noteFields, savedNote } from './noteModel.js';
test('legacy AI notes reopen as a question and answer, including multiline content', () => {
  assert.deepEqual(noteFields({kind:'ai',text:'问：第一行\n第二行\n答：解释\n例句'}), {draft:'第一行\n第二行',answer:'解释\n例句'});
  assert.deepEqual(noteFields({text:'问：普通笔记'}), {draft:'问：普通笔记',answer:''});
});
test('editing updates identity and color while allowing an AI note to become a plain note', () => {
  const existing = {id:'existing',color:'blue',kind:'ai',question:'old',answer:'old reply'};
  const edited = savedNote(existing,' new question ',' new reply ');
  assert.equal(edited.id,'existing'); assert.equal(edited.color,'blue');
  assert.deepEqual(noteFields(edited),{draft:'new question',answer:'new reply'});
  const plain = savedNote(edited,'my note','');
  assert.equal(plain.kind,'note'); assert.equal(plain.text,'my note'); assert.equal(plain.answer,'');
});
