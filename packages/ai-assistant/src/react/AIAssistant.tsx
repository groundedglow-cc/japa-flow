import { useEffect, useState } from "preact/hooks";
import type { AIAssistantContext, AIAssistantHealth, AIAssistantProps } from "../protocol";
import { DEFAULT_POSITION, DEFAULT_SELECTION_SCOPE, DEFAULT_THEME } from "../protocol";
import { ChatPanel } from "./ChatPanel";
import { SelectionLayer } from "./SelectionLayer";

// Health-gated root component.
// Renders nothing when the backend reports it can't serve AI (missing key etc.).
// When healthy, shows a FAB + selection layer; clicking opens the chat panel.
export function AIAssistant(props: AIAssistantProps) {
  const position = props.position ?? DEFAULT_POSITION;
  const theme = props.theme ?? DEFAULT_THEME;
  const selectionScope = props.selectionScope ?? DEFAULT_SELECTION_SCOPE;

  const [health, setHealth] = useState<AIAssistantHealth | null>(null);
  const [open, setOpen] = useState(false);
  // seed is set when the selection layer escalates a snippet into the chat.
  // It is paired with a nonce so consecutive deep-dives on the same text
  // still trigger ChatPanel's send effect.
  const [seed, setSeed] = useState<{ text: string; nonce: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(props.endpoints.health, { method: "GET" })
      .then((r) => r.json())
      .then((data: AIAssistantHealth) => {
        if (!cancelled) setHealth(data);
      })
      .catch((err) => {
        if (!cancelled) setHealth({ ok: false, reason: String(err.message || err) });
      });
    return () => {
      cancelled = true;
    };
  }, [props.endpoints.health]);

  if (!health) return null;
  if (!health.ok) {
    if (typeof console !== "undefined") {
      console.warn("[japa-ai-assistant] disabled:", health.reason || "health check failed");
    }
    return null;
  }

  const enabled = props.enabled ? props.enabled(props.getContext()) : true;
  if (!enabled) return null;

  function buildContext(selectionText?: string): AIAssistantContext {
    const ctx = { ...props.getContext() };
    if (selectionText) {
      const prevSelection = (ctx.selection as Record<string, unknown> | undefined) || {};
      ctx.selection = { ...prevSelection, text: selectionText };
    }
    return ctx;
  }

  function handleDeepDive(text: string) {
    setSeed({ text, nonce: Date.now() });
    setOpen(true);
  }

  return (
    <div class={`ja-ai-root ja-ai-root--${theme} ja-ai-root--${position}`}>
      {open ? (
        <div class="ja-ai-panel-wrap">
          <ChatPanel
            endpoints={props.endpoints}
            getContext={() => buildContext(seed?.text)}
            contextKey={props.contextKey}
            seed={seed}
            onClose={() => setOpen(false)}
          />
        </div>
      ) : (
        <button
          type="button"
          class="ja-ai-fab"
          onClick={() => setOpen(true)}
          aria-label="打开 AI 助手"
          title={`JapaFlow AI · ${props.contextKey}`}
        >
          AI
        </button>
      )}

      <SelectionLayer
        scope={selectionScope}
        endpoints={props.endpoints}
        buildContext={buildContext}
        onDeepDive={handleDeepDive}
      />
    </div>
  );
}
