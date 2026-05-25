import { useEffect, useRef, useState } from "preact/hooks";
import type { AIAssistantContext } from "../../protocol";

export interface ExplainPayload {
  translation?: string;
  tags?: Array<{ label: string; detail?: string }>;
  note?: string;
}

export interface ExplainStreamResult {
  raw: string;
  parsed: ExplainPayload | null;
  isStreaming: boolean;
  error: Error | null;
}

// Reads the Vercel AI SDK v4 data-stream protocol over fetch.
//
// Each line in the response body is of the form `<type>:<json>\n`. We only
// care about text deltas (type "0"). Other line types (`d:`, `e:`, `2:`,
// `f:`, `g:`) carry tool / metadata frames and are ignored here.
//
// `raw` is the cumulative text. `parsed` attempts to JSON.parse `raw` on
// every chunk so the card can render partial fields as soon as they arrive.
// Most partial JSON won't parse mid-stream; the card just renders the raw
// text as a fallback in that case.
export function useExplainStream(
  endpoint: string,
  text: string | null,
  buildContext: (selectionText: string) => AIAssistantContext,
): ExplainStreamResult {
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<ExplainPayload | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const ctxRef = useRef(buildContext);
  ctxRef.current = buildContext;

  useEffect(() => {
    if (!text) {
      setRaw("");
      setParsed(null);
      setError(null);
      setIsStreaming(false);
      return;
    }

    const ctrl = new AbortController();
    setRaw("");
    setParsed(null);
    setError(null);
    setIsStreaming(true);

    (async () => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context: ctxRef.current(text) }),
          signal: ctrl.signal,
        });
        if (!res.ok) {
          let detail: string;
          try {
            const j = await res.json();
            detail = j.error || JSON.stringify(j);
          } catch {
            detail = await res.text();
          }
          throw new Error(detail || `HTTP ${res.status}`);
        }
        if (!res.body) throw new Error("Response has no body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let acc = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, nl);
            buffer = buffer.slice(nl + 1);
            if (!line) continue;
            const colon = line.indexOf(":");
            if (colon <= 0) continue;
            const kind = line.slice(0, colon);
            const payload = line.slice(colon + 1);
            if (kind === "0") {
              try {
                const chunk = JSON.parse(payload);
                if (typeof chunk === "string") {
                  acc += chunk;
                  setRaw(acc);
                  try {
                    setParsed(JSON.parse(acc));
                  } catch {
                    // partial JSON; fine, keep showing raw text
                  }
                }
              } catch {
                // ignore malformed line
              }
            } else if (kind === "3") {
              // error frame
              try {
                throw new Error(String(JSON.parse(payload)));
              } catch (e) {
                throw e instanceof Error ? e : new Error(String(e));
              }
            }
          }
        }
        setIsStreaming(false);
      } catch (e) {
        if ((e as any)?.name === "AbortError") {
          setIsStreaming(false);
          return;
        }
        setError(e as Error);
        setIsStreaming(false);
      }
    })();

    return () => {
      ctrl.abort();
    };
  }, [endpoint, text]);

  return { raw, parsed, isStreaming, error };
}
