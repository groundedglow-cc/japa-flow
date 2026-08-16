(() => {
  const speechInputSelector = "input.practice-input, textarea.practice-input";
  let activePracticeRecording = null;

  function textOf(element) {
    if (!element) return "";
    const cloned = element.cloneNode(true);
    cloned.querySelectorAll("rt").forEach((node) => node.remove());
    return String(cloned.textContent || "").replace(/\s+/g, " ").trim();
  }

  function dialogueLineText(line) {
    const label = textOf(line.querySelector("span"));
    const body = textOf(line.querySelector("p"));
    return label && body ? `${label}：${body}` : "";
  }

  function exampleBlockText(example) {
    const pairedRows = Array.from(example.querySelectorAll(".example-pair-row"))
      .map((row) => {
        const before = textOf(row.querySelector(".example-before"));
        const after = textOf(row.querySelector(".example-after"));
        return before && after ? `${before}\n→\n${after}` : [before, after].filter(Boolean).join("\n");
      })
      .filter(Boolean);
    if (pairedRows.length) return pairedRows.join("\n\n");

    const lines = [];
    const before = textOf(example.querySelector(".example-before"));
    if (before) lines.push(before);

    const dialogueLines = Array.from(example.querySelectorAll(".example-after .dialogue-line"))
      .map(dialogueLineText)
      .filter(Boolean);
    if (dialogueLines.length) {
      lines.push(...dialogueLines);
    } else {
      const after = textOf(example.querySelector(".example-after"));
      if (after) lines.push(after);
    }

    return lines.join("\n").trim();
  }

  function collectExampleText(activity, item) {
    const group = item?.closest(".practice-item-group");
    const roots = group
      ? Array.from(group.querySelectorAll(".group-head .example-block, .group-head .dialogue-block"))
      : Array.from(activity.querySelectorAll(".layout-blocks > .example-block, .layout-blocks > .dialogue-block"));
    const seen = new Set();
    return roots
      .map((root) => {
        if (root.classList.contains("example-block")) return exampleBlockText(root);
        if (root.classList.contains("dialogue-block")) {
          return Array.from(root.querySelectorAll(".dialogue-line")).map(dialogueLineText).filter(Boolean).join("\n");
        }
        return "";
      })
      .filter(Boolean)
      .filter((value) => {
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
      })
      .join("\n\n");
  }

  function countDialogueSentences(value) {
    const sentences = String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .match(/[^。？！?!]+[。？！?!]?/g);
    return Math.max(1, (sentences || []).map((sentence) => sentence.trim()).filter(Boolean).length);
  }

  function dialogueTurnsFromText(value) {
    const source = String(value || "").replace(/\s+/g, " ").trim();
    if (!source) return [];
    const matches = Array.from(source.matchAll(/((?:乙[12１２]?)|[甲丙丁ABCD])\s*[:：]/g));
    return matches.map((match, index) => {
      const bodyStart = (match.index || 0) + match[0].length;
      const bodyEnd = matches[index + 1]?.index ?? source.length;
      const body = source.slice(bodyStart, bodyEnd).trim();
      return { label: match[1], body };
    }).filter((turn) => turn.label && turn.body);
  }

  function collectDialogueFormatHints(activity, item) {
    const labels = [];
    const sentenceCounts = [];
    const group = item?.closest(".practice-item-group");
    const roots = group
      ? Array.from(group.querySelectorAll(".group-head .example-block, .group-head .dialogue-block"))
      : Array.from(activity.querySelectorAll(".layout-blocks > .example-block, .layout-blocks > .dialogue-block"));

    roots.some((root) => {
      const lines = Array.from(root.querySelectorAll(".example-after .dialogue-line, .dialogue-line"));
      lines.forEach((line) => {
        const label = textOf(line.querySelector("span"));
        const body = textOf(line.querySelector("p"));
        if (/^((?:乙[12１２]?)|[甲丙丁ABCD])$/.test(label) && body) {
          labels.push(label);
          sentenceCounts.push(countDialogueSentences(body));
        }
      });
      return labels.length > 0;
    });

    if (labels.length) return { speakerLabels: labels, speakerSentenceCounts: sentenceCounts };

    const exampleText = collectExampleText(activity, item);
    const textTurns = dialogueTurnsFromText(exampleText);
    if (textTurns.length) {
      return {
        speakerLabels: textTurns.map((turn) => turn.label),
        speakerSentenceCounts: textTurns.map((turn) => countDialogueSentences(turn.body))
      };
    }

    for (const match of exampleText.matchAll(/(?:^|\n|\s)((?:乙[12１２]?)|[甲丙丁ABCD])\s*[:：]/g)) {
      labels.push(match[1]);
    }
    if (labels.length) return { speakerLabels: labels };
    if (/乙[1１].*乙[2２]/s.test(exampleText)) return { speakerLabels: ["甲", "乙1", "乙2"] };
    return { speakerLabels: ["甲", "乙"] };
  }

  function setStatus(status, message, tone = "") {
    status.textContent = message;
    status.dataset.tone = tone;
    const wrapper = status.__speechInputWrapper;
    if (message) {
      if (wrapper && !status.isConnected) wrapper.append(status);
      return;
    }
    if (status.isConnected) status.remove();
  }

  function normalizeFormattedText(value) {
    if (value && typeof value === "object" && typeof value.formattedText === "string") {
      return normalizeFormattedText(value.formattedText);
    }
    const text = String(value || "").trim();
    if (!text) return "";
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "string") return normalizeFormattedText(parsed);
      if (typeof parsed?.formattedText === "string") return normalizeFormattedText(parsed.formattedText);
    } catch {}
    const looseFormattedText = extractJsonishStringField(text, "formattedText");
    if (looseFormattedText) return looseFormattedText.trim();
    return text;
  }

  function decodeJsonishString(value) {
    const raw = String(value || "");
    for (const candidate of [raw, raw.replace(/\r/g, "\\r").replace(/\n/g, "\\n")]) {
      try {
        return JSON.parse(`"${candidate}"`);
      } catch {}
    }
    return raw
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\n")
      .replace(/\\"/g, "\"")
      .replace(/\\\\/g, "\\")
      .trim();
  }

  function extractJsonishStringField(value, fieldName) {
    const text = String(value || "").trim();
    if (!text) return "";
    const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const quotedPattern = new RegExp(`"${escapedName}"\\s*:\\s*"([\\s\\S]*?)"\\s*(?:,\\s*"[^"]+"\\s*:|\\s*})`);
    const quoted = text.match(quotedPattern);
    return quoted ? decodeJsonishString(quoted[1]) : "";
  }

  function normalizeLocalDialogueText(value) {
    return normalizeFormattedText(value)
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\s*(甲|乙[12１２]?|丙|丁)\s*[:：]?\s*/g, "\n$1：")
      .replace(/^\n+/, "")
      .replace(/([。？！?])\s+(?=(?:甲|乙[12１２]?|丙|丁)：)/g, "$1\n")
      .replace(/\n{2,}/g, "\n")
      .trim();
  }

  function speakerIcon() {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 10v4h4l5 4V6L8 10H4Z"></path>
        <path d="M16 9.5a3.5 3.5 0 0 1 0 5"></path>
        <path d="M18.5 7a7 7 0 0 1 0 10"></path>
      </svg>
    `;
  }

  function isDialogueField(field) {
    if (!(field instanceof HTMLTextAreaElement)) return false;
    const item = field.closest(".practice-item");
    const activity = field.closest(".practice-activity");
    const context = [
      field.placeholder,
      item?.classList.contains("dialogue") ? "dialogue" : "",
      textOf(item?.querySelector(".item-prompt")),
      collectExampleText(activity, item)
    ].join("\n");
    return /dialogue|会话|対話|甲|乙/.test(context);
  }

  function writeString(view, offset, string) {
    for (let index = 0; index < string.length; index += 1) view.setUint8(offset + index, string.charCodeAt(index));
  }

  function encodeWav(chunks, sampleRate) {
    const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const samples = new Float32Array(length);
    let offset = 0;
    chunks.forEach((chunk) => {
      samples.set(chunk, offset);
      offset += chunk.length;
    });
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, samples.length * 2, true);
    let position = 44;
    for (const sample of samples) {
      const clamped = Math.max(-1, Math.min(1, sample));
      view.setInt16(position, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
      position += 2;
    }
    return buffer;
  }

  function setButtonsDisabled(buttons, disabled) {
    buttons.filter(Boolean).forEach((button) => {
      button.disabled = disabled;
    });
  }

  async function transcribeChunks(chunks, sampleRate) {
    const wav = encodeWav(chunks, sampleRate);
    const formData = new FormData();
    formData.append("audio", new Blob([wav], { type: "audio/wav" }), "speech.wav");
    formData.append("language", "ja-JP");
    formData.append("sampleRate", String(sampleRate));
    const response = await fetch("/api/speech/transcribe", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("light_blog_token") || ""}` },
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.message || (data.code === "AI_DAILY_QUOTA_EXCEEDED" ? "今日 AI 调用额度已用完" : `HTTP ${response.status}`));
    return {
      text: String(data.recognizedText || "").trim(),
      status: String(data.recognitionStatus || "")
    };
  }

  async function formatDialogueAnswer(field, status) {
    const activity = field.closest(".practice-activity");
    const item = field.closest(".practice-item");
    const inputText = field.value.trim();
    if (!inputText) {
      setStatus(status, "请先输入文本", "warn");
      return;
    }

    setStatus(status, "格式化中...", "");
    try {
      const response = await fetch("/api/practice/format-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("light_blog_token") || ""}`
        },
        body: JSON.stringify({
          inputText,
          formatHints: collectDialogueFormatHints(activity, item),
          answerUnit: "dialogue"
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      const formattedText = normalizeFormattedText(data.formattedText || data) || inputText;
      field.value = data.provider === "local_fallback"
        ? formattedText
        : normalizeLocalDialogueText(formattedText) || inputText;
      field.dispatchEvent(new Event("input", { bubbles: true }));
      setStatus(status, data.notes ? `已格式化：${data.notes}` : "已格式化", "ok");
    } catch (error) {
      console.error("[practice formatter] failed:", error);
      field.value = inputText;
      field.dispatchEvent(new Event("input", { bubbles: true }));
      setStatus(status, "已转写，格式化服务暂不可用", "warn");
    }
  }

  function setFieldLocked(field, locked) {
    field.disabled = locked;
    field.closest(".speech-input-wrap")?.classList.toggle("processing", locked);
  }

  async function startSpeechInput(field, status, recordButton) {
    if (activePracticeRecording) {
      if (activePracticeRecording.button === recordButton) await activePracticeRecording.stop();
      else setStatus(status, "请先结束其他录音", "warn");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus(status, "当前浏览器不支持录音", "warn");
      return;
    }

    const shouldFormat = isDialogueField(field);
    let stream;
    let audioContext;
    let source;
    let processor;
    const chunks = [];
    let sampleRate = 16000;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextCtor({ sampleRate: 16000 });
      // 某些浏览器会忽略 AudioContext 的目标采样率；WAV 头必须使用实际采样率，
      // 否则 Azure 会把语速/音高解析错误，常见结果就是 NoMatch。
      sampleRate = audioContext.sampleRate || 16000;
      source = audioContext.createMediaStreamSource(stream);
      processor = audioContext.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (event) => {
        chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
      };
      source.connect(processor);
      processor.connect(audioContext.destination);
    } catch (error) {
      console.error("[practice recorder] getUserMedia failed:", error);
      setStatus(status, "无法获取麦克风权限", "warn");
      return;
    }

    recordButton.classList.add("recording");
    recordButton.setAttribute("aria-label", "结束录音");
    recordButton.title = "结束录音";
    setFieldLocked(field, true);
    setStatus(status, "录音中，再次点击结束", "");

    const cleanup = async () => {
      activePracticeRecording = null;
      recordButton.classList.remove("recording");
      recordButton.setAttribute("aria-label", "录音输入");
      recordButton.title = shouldFormat ? "录音后自动转写并整理为对话格式" : "录音后自动转写到输入框";
      try { processor.disconnect(); source.disconnect(); } catch {}
      try { stream.getTracks().forEach((track) => track.stop()); } catch {}
      try { await audioContext.close(); } catch {}
    };

    activePracticeRecording = {
      button: recordButton,
      cancel: cleanup,
      stop: async () => {
        if (!activePracticeRecording) return;
        await cleanup();
        if (!chunks.length) {
          setFieldLocked(field, false);
          setStatus(status, "没有录到声音", "warn");
          return;
        }
        setButtonsDisabled([recordButton], true);
        setStatus(status, "转写中...", "");
        try {
          const transcription = await transcribeChunks(chunks, sampleRate);
          const recognizedText = transcription.text;
          if (!recognizedText) {
            setStatus(status, transcription.status ? `Azure 未识别到文本（${transcription.status}）` : "未识别到文本", "warn");
            return;
          }
          field.value = recognizedText;
          field.dispatchEvent(new Event("input", { bubbles: true }));
          if (shouldFormat) await formatDialogueAnswer(field, status);
          else setStatus(status, "已转写", "ok");
        } catch (error) {
          console.error("[practice recorder] transcribe or format failed:", error);
          const message = String(error?.message || error || "未知错误").replace(/\s+/g, " ").trim();
          setStatus(status, `转写失败：${message}`, "warn");
        } finally {
          setFieldLocked(field, false);
          setButtonsDisabled([recordButton], false);
        }
      }
    };
  }

  function cancelActiveRecordingOnUnload() {
    if (!activePracticeRecording) return;
    try {
      activePracticeRecording.cancel();
    } catch {
      activePracticeRecording = null;
    }
  }

  function wrapField(field) {
    if (field.dataset.speechInputAttached === "1") return null;
    field.dataset.speechInputAttached = "1";

    const wrapper = document.createElement("div");
    wrapper.className = ["speech-input-wrap", field.classList.contains("short") ? "short" : "", field.classList.contains("medium") ? "medium" : "", field.classList.contains("long") ? "long" : ""]
      .filter(Boolean)
      .join(" ");
    field.insertAdjacentElement("beforebegin", wrapper);
    wrapper.append(field);
    return wrapper;
  }

  function attachSpeechInput(field) {
    const wrapper = wrapField(field);
    if (!wrapper) return;

    const status = document.createElement("span");
    status.className = "speech-input-status";
    status.setAttribute("aria-live", "polite");
    status.__speechInputWrapper = wrapper;

    const recordButton = document.createElement("button");
    recordButton.type = "button";
    recordButton.className = "speech-input-btn";
    recordButton.innerHTML = speakerIcon();
    recordButton.setAttribute("aria-label", "录音输入");
    recordButton.title = isDialogueField(field) ? "录音后自动转写并整理为对话格式" : "录音后自动转写到输入框";

    recordButton.addEventListener("click", () => startSpeechInput(field, status, recordButton));
    wrapper.append(recordButton);
  }

  function initPracticeAnswerFormatter() {
    document.querySelectorAll(speechInputSelector).forEach(attachSpeechInput);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPracticeAnswerFormatter);
  } else {
    initPracticeAnswerFormatter();
  }

  window.addEventListener("beforeunload", cancelActiveRecordingOnUnload);
  window.initPracticeAnswerFormatter = initPracticeAnswerFormatter;
})();
