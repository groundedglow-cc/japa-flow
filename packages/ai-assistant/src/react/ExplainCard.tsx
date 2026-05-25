import { useMemo } from "preact/hooks";
import type { SelectionAnchor } from "./hooks/useSelectionAnchor";
import { useExplainStream } from "./hooks/useExplainStream";
import type { AIAssistantContext, AIAssistantEndpoints } from "../protocol";

export interface ExplainCardProps {
  anchor: SelectionAnchor;
  endpoints: AIAssistantEndpoints;
  buildContext: (selectionText: string) => AIAssistantContext;
  onClose: () => void;
  onDeepDive: (text: string) => void;
}

// Popover card showing a streamed structured explanation for the selected
// text. Position is computed to stay inside the viewport.
export function ExplainCard({ anchor, endpoints, buildContext, onClose, onDeepDive }: ExplainCardProps) {
  const { raw, parsed, isStreaming, error } = useExplainStream(
    endpoints.explain,
    anchor.text,
    buildContext,
  );

  const style = useMemo(() => cardStyle(anchor), [anchor]);

  return (
    <div class="ja-ai-explain" style={style} onMouseDown={(e) => e.stopPropagation()}>
      <header class="ja-ai-explain__header">
        <div class="ja-ai-explain__selection" title={anchor.text}>{anchor.text}</div>
        <button type="button" class="ja-ai-explain__close" aria-label="关闭" onClick={onClose}>×</button>
      </header>

      <div class="ja-ai-explain__body">
        {error ? (
          <div class="ja-ai-explain__error">解释失败：{error.message}</div>
        ) : parsed ? (
          <>
            {parsed.translation && (
              <div class="ja-ai-explain__translation">{parsed.translation}</div>
            )}
            {parsed.tags && parsed.tags.length > 0 && (
              <ul class="ja-ai-explain__tags">
                {parsed.tags.map((t, i) => (
                  <li key={i} class="ja-ai-explain__tag">
                    <span class="ja-ai-explain__tag-label">{t.label}</span>
                    {t.detail && <span class="ja-ai-explain__tag-detail">{t.detail}</span>}
                  </li>
                ))}
              </ul>
            )}
            {parsed.note && <div class="ja-ai-explain__note">{parsed.note}</div>}
          </>
        ) : raw ? (
          <pre class="ja-ai-explain__raw">{raw}</pre>
        ) : (
          <div class="ja-ai-explain__loading">解释中…</div>
        )}
      </div>

      <footer class="ja-ai-explain__footer">
        <span class="ja-ai-explain__disclaimer">
          {isStreaming ? "生成中…" : "AI 解释仅供参考"}
        </span>
        <button
          type="button"
          class="ja-ai-btn ja-ai-btn--primary"
          onClick={() => onDeepDive(anchor.text)}
        >
          📖 详细分析
        </button>
      </footer>
    </div>
  );
}

function cardStyle(anchor: SelectionAnchor): Record<string, string> {
  const cardWidth = Math.min(360, window.innerWidth - 16);
  // Prefer below the selection; fall back to above if it would overflow.
  const below = anchor.rect.bottom + 12;
  const above = anchor.rect.top - 12;
  const useAbove = below + 220 > window.innerHeight && above > 220;
  const top = useAbove ? Math.max(8, above - 220) : below;
  let left = anchor.rect.left + anchor.rect.width / 2 - cardWidth / 2;
  left = Math.max(8, Math.min(window.innerWidth - cardWidth - 8, left));
  return {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
    width: `${cardWidth}px`,
    zIndex: "2147483002",
  };
}
