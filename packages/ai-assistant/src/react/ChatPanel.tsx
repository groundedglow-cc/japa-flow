import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "preact/hooks";
import type { AIAssistantContext, AIAssistantEndpoints } from "../protocol";

export interface ChatPanelSeed {
  text: string;
  nonce: number;
}

export interface ChatPanelProps {
  endpoints: AIAssistantEndpoints;
  getContext: () => AIAssistantContext;
  contextKey: string;
  onClose: () => void;
  /**
   * When provided, automatically appends a request to deep-dive the snippet
   * exactly once per nonce. Used by the selection layer's "详细分析" action.
   */
  seed?: ChatPanelSeed | null;
}

// Minimal chat panel — Step 3 of PRD §14, extended in Step 7 with seed support.
// Will be wrapped into a richer side drawer in §14 Step 4 (already mostly true).
export function ChatPanel({ endpoints, getContext, contextKey, onClose, seed }: ChatPanelProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    append,
    error,
  } = useChat({
    api: endpoints.chat,
    id: contextKey,
    experimental_prepareRequestBody: ({ messages }) => ({
      messages,
      context: getContext(),
    }),
  });

  // Auto-send seeded deep-dive prompts (once per nonce).
  const lastSeedNonce = useRef<number | null>(null);
  useEffect(() => {
    if (!seed) return;
    if (lastSeedNonce.current === seed.nonce) return;
    lastSeedNonce.current = seed.nonce;
    append({ role: "user", content: `请详细解释这句话的语法和含义：「${seed.text}」` });
  }, [seed, append]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  const isStreaming = status === "submitted" || status === "streaming";

  return (
    <div class="ja-ai-chat">
      <header class="ja-ai-chat__header">
        <div>
          <strong>JapaFlow AI</strong>
          <span class="ja-ai-chat__context" title={contextKey}>{contextKey}</span>
        </div>
        <button class="ja-ai-chat__close" type="button" onClick={onClose} aria-label="关闭">×</button>
      </header>

      <div class="ja-ai-chat__messages" ref={scrollerRef}>
        {messages.length === 0 ? (
          <div class="ja-ai-chat__empty">
            随时问我课文里不懂的句子或语法。<br />
            示例：「请解释这句话的语法」「这个助词为什么用 に？」
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} class={`ja-ai-msg ja-ai-msg--${m.role}`}>
              <div class="ja-ai-msg__role">{m.role === "user" ? "你" : "AI"}</div>
              <div class="ja-ai-msg__body">{m.content}</div>
            </div>
          ))
        )}
        {error && (
          <div class="ja-ai-msg ja-ai-msg--error">
            <div class="ja-ai-msg__role">错误</div>
            <div class="ja-ai-msg__body">{error.message || String(error)}</div>
          </div>
        )}
      </div>

      <form class="ja-ai-chat__form" onSubmit={handleSubmit}>
        <textarea
          class="ja-ai-chat__input"
          value={input}
          onInput={handleInputChange as any}
          placeholder="按 Enter 发送，Shift+Enter 换行"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div class="ja-ai-chat__actions">
          {isStreaming ? (
            <button type="button" class="ja-ai-btn ja-ai-btn--ghost" onClick={stop}>停止</button>
          ) : (
            <button
              type="submit"
              class="ja-ai-btn ja-ai-btn--primary"
              disabled={!input.trim()}
            >发送</button>
          )}
        </div>
      </form>
    </div>
  );
}
