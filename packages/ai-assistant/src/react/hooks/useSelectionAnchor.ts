import { useEffect, useState } from "preact/hooks";

// Anchor info for a user text selection located inside the configured scope.
// rect is the bounding box of the visible selection (in viewport coordinates).
export interface SelectionAnchor {
  text: string;
  rect: { top: number; left: number; right: number; bottom: number; width: number; height: number };
}

// Listens to global selection changes and exposes a stable anchor whenever
// the selection (a) is non-empty, (b) is fully contained inside `scope`,
// and (c) actually has geometry to anchor a popover against.
//
// Returns null when there is no eligible selection.
export function useSelectionAnchor(scope: string): SelectionAnchor | null {
  const [anchor, setAnchor] = useState<SelectionAnchor | null>(null);

  useEffect(() => {
    // Debounce via setTimeout (not rAF — rAF can be throttled to 0Hz in
    // background/hidden tabs and split-pane WebKit views, which would silently
    // suppress all selection-driven UI).
    let timer: ReturnType<typeof setTimeout> | null = null;

    function compute() {
      timer = null;
      const sel = typeof window !== "undefined" ? window.getSelection() : null;
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setAnchor((cur) => (cur === null ? cur : null));
        return;
      }
      const text = sel.toString().trim();
      if (!text) {
        setAnchor((cur) => (cur === null ? cur : null));
        return;
      }
      const range = sel.getRangeAt(0);
      const startEl =
        range.startContainer.nodeType === Node.TEXT_NODE
          ? (range.startContainer.parentElement as Element | null)
          : (range.startContainer as Element);
      const endEl =
        range.endContainer.nodeType === Node.TEXT_NODE
          ? (range.endContainer.parentElement as Element | null)
          : (range.endContainer as Element);
      if (!startEl || !endEl) {
        setAnchor((cur) => (cur === null ? cur : null));
        return;
      }
      if (!startEl.closest(scope) || !endEl.closest(scope)) {
        setAnchor((cur) => (cur === null ? cur : null));
        return;
      }
      const domRect = range.getBoundingClientRect();
      if (domRect.width === 0 && domRect.height === 0) {
        setAnchor((cur) => (cur === null ? cur : null));
        return;
      }
      setAnchor({
        text,
        rect: {
          top: domRect.top,
          left: domRect.left,
          right: domRect.right,
          bottom: domRect.bottom,
          width: domRect.width,
          height: domRect.height,
        },
      });
    }

    function schedule() {
      if (timer != null) clearTimeout(timer);
      timer = setTimeout(compute, 16);
    }

    document.addEventListener("selectionchange", schedule);
    document.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);

    return () => {
      document.removeEventListener("selectionchange", schedule);
      document.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      if (timer != null) clearTimeout(timer);
    };
  }, [scope]);

  return anchor;
}
