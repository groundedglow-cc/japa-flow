import type { AIAssistantEndpoints, AIAssistantPosition, AIAssistantTheme } from "./types";

export const DEFAULT_ENDPOINTS: AIAssistantEndpoints = {
  chat: "/api/ai/chat",
  explain: "/api/ai/explain",
  health: "/api/ai/health",
};

export const DEFAULT_POSITION: AIAssistantPosition = "bottom-right";
export const DEFAULT_THEME: AIAssistantTheme = "auto";
export const DEFAULT_SELECTION_SCOPE = "[data-ai-selectable]";
export const DEFAULT_DISCLAIMER = "AI 解释仅供参考，请以教材和老师讲解为准。";

export const HISTORY_STORAGE_PREFIX = "japa-ai:history:";
export const DISCLAIMER_ACKED_KEY = "japa-ai:disclaimer-acked";
export const HISTORY_MAX_MESSAGES = 20;
