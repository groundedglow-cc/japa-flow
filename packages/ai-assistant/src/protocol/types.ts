// Framework-agnostic types shared by react / element entries and the host app.

export interface AIAssistantEndpoints {
  chat: string;
  explain: string;
  health: string;
}

export interface AIAssistantContext {
  [key: string]: unknown;
}

export interface AIAssistantHealth {
  ok: boolean;
  provider?: string;
  model?: string;
  reason?: string;
}

export type AIAssistantPosition = "bottom-right" | "bottom-left";
export type AIAssistantTheme = "light" | "dark" | "auto";

export interface AIAssistantProps {
  endpoints: AIAssistantEndpoints;
  getContext: () => AIAssistantContext;
  contextKey: string;
  enabled?: (ctx: AIAssistantContext) => boolean;
  selectionScope?: string;
  position?: AIAssistantPosition;
  theme?: AIAssistantTheme;
  disclaimer?: string;
}
