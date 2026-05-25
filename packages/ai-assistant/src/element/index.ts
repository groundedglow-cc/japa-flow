import { render, h } from "preact";
import { AIAssistant } from "../react/AIAssistant";
import type {
  AIAssistantContext,
  AIAssistantEndpoints,
  AIAssistantPosition,
  AIAssistantTheme,
} from "../protocol";
import { DEFAULT_ENDPOINTS, DEFAULT_POSITION, DEFAULT_THEME, DEFAULT_SELECTION_SCOPE } from "../protocol";

// <japa-ai-assistant>
//
// Attribute config (strings):
//   context-key="lesson:29"
//   position="bottom-right" | "bottom-left"
//   theme="auto" | "light" | "dark"
//   selection-scope="[data-ai-selectable]"
//   disclaimer="..."
//
// Property config (must be set via JS, not attributes):
//   .endpoints   = { chat, explain, health }
//   .getContext  = () => AIAssistantContext
//   .enabled     = (ctx) => boolean
//
// The element re-renders whenever an observed attribute or property changes.
const ATTRS = ["context-key", "position", "theme", "selection-scope", "disclaimer"];

class JapaAIAssistantElement extends HTMLElement {
  private _root: HTMLDivElement | null = null;
  private _endpoints: AIAssistantEndpoints = DEFAULT_ENDPOINTS;
  private _getContext: () => AIAssistantContext = () => ({});
  private _enabled: (ctx: AIAssistantContext) => boolean = () => true;

  static get observedAttributes() {
    return ATTRS;
  }

  connectedCallback() {
    if (!this._root) {
      this._root = document.createElement("div");
      this._root.className = "ja-ai-root";
      this.appendChild(this._root);
    }
    this.renderApp();
  }

  disconnectedCallback() {
    if (this._root) render(null, this._root);
  }

  attributeChangedCallback() {
    if (this._root) this.renderApp();
  }

  set endpoints(value: AIAssistantEndpoints) {
    this._endpoints = value ?? DEFAULT_ENDPOINTS;
    if (this._root) this.renderApp();
  }
  get endpoints() {
    return this._endpoints;
  }

  set getContext(fn: () => AIAssistantContext) {
    this._getContext = typeof fn === "function" ? fn : () => ({});
    if (this._root) this.renderApp();
  }
  get getContext() {
    return this._getContext;
  }

  set enabled(fn: (ctx: AIAssistantContext) => boolean) {
    this._enabled = typeof fn === "function" ? fn : () => true;
    if (this._root) this.renderApp();
  }
  get enabled() {
    return this._enabled;
  }

  private renderApp() {
    if (!this._root) return;
    const contextKey = this.getAttribute("context-key") ?? "default";
    const position = (this.getAttribute("position") as AIAssistantPosition) || DEFAULT_POSITION;
    const theme = (this.getAttribute("theme") as AIAssistantTheme) || DEFAULT_THEME;
    const selectionScope = this.getAttribute("selection-scope") || DEFAULT_SELECTION_SCOPE;
    const disclaimer = this.getAttribute("disclaimer") || undefined;

    render(
      h(AIAssistant, {
        endpoints: this._endpoints,
        getContext: this._getContext,
        enabled: this._enabled,
        contextKey,
        position,
        theme,
        selectionScope,
        disclaimer,
      }),
      this._root,
    );
  }
}

if (typeof window !== "undefined" && !customElements.get("japa-ai-assistant")) {
  customElements.define("japa-ai-assistant", JapaAIAssistantElement);
}

export { JapaAIAssistantElement };
