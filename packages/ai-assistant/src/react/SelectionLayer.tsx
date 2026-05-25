import { useEffect, useState } from "preact/hooks";
import type { SelectionAnchor } from "./hooks/useSelectionAnchor";
import { useSelectionAnchor } from "./hooks/useSelectionAnchor";
import { ExplainCard } from "./ExplainCard";
import type { AIAssistantContext, AIAssistantEndpoints } from "../protocol";

export interface SelectionLayerProps {
  scope: string;
  endpoints: AIAssistantEndpoints;
  buildContext: (selectionText: string) => AIAssistantContext;
  onDeepDive: (text: string) => void;
}

// Tracks the user's selection inside `scope` and renders either a small
// toolbar (default) or, once they hit 🔍, an ExplainCard pinned to the
// selection.
//
// The card stays open even if the selection collapses (a click on the
// card body would clear native selection), so we snapshot the anchor at
// the moment 🔍 is pressed.
export function SelectionLayer({ scope, endpoints, buildContext, onDeepDive }: SelectionLayerProps) {
  const liveAnchor = useSelectionAnchor(scope);
  const [pinned, setPinned] = useState<SelectionAnchor | null>(null);

  // When the user clicks anywhere outside the card or toolbar, dismiss the card.
  useEffect(() => {
    if (!pinned) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest(".ja-ai-sel-toolbar") || target.closest(".ja-ai-explain")) return;
      setPinned(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPinned(null);
    }
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [pinned]);

  if (pinned) {
    return (
      <ExplainCard
        anchor={pinned}
        endpoints={endpoints}
        buildContext={buildContext}
        onClose={() => setPinned(null)}
        onDeepDive={(text) => {
          setPinned(null);
          onDeepDive(text);
        }}
      />
    );
  }

  if (!liveAnchor) return null;

  // preventDefault on mousedown so clicking the button doesn't blur the selection.
  return (
    <div
      class="ja-ai-sel-toolbar"
      style={toolbarStyle(liveAnchor)}
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.preventDefault()}
    >
      <button
        type="button"
        class="ja-ai-sel-toolbar__btn"
        onClick={() => setPinned(liveAnchor)}
      >
        🔍 解释
      </button>
      <button
        type="button"
        class="ja-ai-sel-toolbar__btn"
        onClick={() => onDeepDive(liveAnchor.text)}
      >
        📖 详细分析
      </button>
    </div>
  );
}

function toolbarStyle(a: SelectionAnchor): Record<string, string> {
  const top = Math.min(window.innerHeight - 48, a.rect.bottom + 8);
  const left = Math.max(8, Math.min(window.innerWidth - 8, a.rect.left + a.rect.width / 2));
  return {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
    transform: "translateX(-50%)",
    zIndex: "2147483001",
  };
}
