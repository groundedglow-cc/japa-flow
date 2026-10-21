import { readFileSync } from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const html = readFileSync("tools/grammar-image-preview.html", "utf8");
const code = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1].replace(/\n      render\(\);\s*$/, "");
const nodes = new Map();
const element = () => ({ textContent: "", classList: { add() {}, remove() {} }, setAttribute() {}, addEventListener() {} });
const recordings = [];
class AudioMock {
  constructor(url) { this.url = url; this.handlers = {}; recordings.push(this); }
  pause() { this.paused = true; }
  removeAttribute() {}
  load() {}
  addEventListener(name, fn) { this.handlers[name] = fn; }
  play() { return new Promise((resolve, reject) => { this.resolve = resolve; this.reject = reject; }); }
}
const context = vm.createContext({
  URLSearchParams, Audio: AudioMock,
  document: { querySelector(key) { if (!nodes.has(key)) nodes.set(key, element()); return nodes.get(key); }, querySelectorAll: () => [], addEventListener() {} },
  window: { speechSynthesis: { cancel() {}, getVoices: () => [], addEventListener() {} }, addEventListener() {} },
  location: { search: "?lesson=39", hash: "" },
  localStorage: { getItem: () => null },
});
vm.runInContext(code, context);
const url = `/audio/grammar/lesson39/${"a".repeat(64)}.mp3`;
context.manifest = { sentences: { A: url, B: url } };
context.first = { ...element(), dataset: { sentence: "A" } };
context.second = { ...element(), dataset: { sentence: "B" } };
vm.runInContext("grammarAudioManifest = manifest", context);
const firstPlay = vm.runInContext("playSentence(first)", context);
const firstAudio = recordings.at(-1);
const secondPlay = vm.runInContext("playSentence(second)", context);
const secondAudio = recordings.at(-1);
assert.equal(firstAudio.paused, true);
secondAudio.resolve(); await secondPlay;
firstAudio.reject(new Error("cancelled")); await firstPlay;
assert.match(nodes.get("#speechStatus").textContent, /正在播放 MiniMax/);
assert.equal(vm.runInContext("activeSentenceButton === second", context), true);
await vm.runInContext("playSentence(second)", context);
assert.equal(secondAudio.paused, true);
assert.match(nodes.get("#speechStatus").textContent, /已停止/);
vm.runInContext("grammarAudioManifest = null", context);
await vm.runInContext("playSentence(first)", context);
assert.match(nodes.get("#speechStatus").textContent, /尚未生成/);
vm.runInContext("grammarAudioManifest = manifest", context);
const failingPlay = vm.runInContext("playSentence(first)", context);
recordings.at(-1).reject(new Error("not allowed")); await failingPlay;
assert.match(nodes.get("#speechStatus").textContent, /播放未能开始/);
assert.equal(vm.runInContext("activeSentenceButton", context), null);
console.log("PASS: MiniMax playback, switching race, click-to-stop, missing audio, rejected playback cleanup.");
