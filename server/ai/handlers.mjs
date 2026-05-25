// HTTP handlers for the /api/ai/* endpoints.
// Built on Vercel AI SDK (`ai`) + `@ai-sdk/deepseek`.
//
// Routes (registered in server.mjs):
//   GET  /api/ai/health   - probe DeepSeek configuration without billing a token.
//   POST /api/ai/chat     - multi-turn chat, streams Vercel AI SDK data stream.
//   POST /api/ai/explain  - one-shot structured sentence explanation, JSON via stream.
//
// All POST handlers stream Server-Sent Events (Vercel data stream protocol).
// nginx in front of this server MUST disable proxy_buffering for /api/ai/.

import { createDeepSeek } from "@ai-sdk/deepseek";
import { streamText } from "ai";
import {
  buildChatSystemPrompt,
  buildExplainSystemPrompt,
  buildExplainUserPrompt,
} from "./prompts.mjs";

const DEFAULT_BASE_URL = "https://api.deepseek.com";
const DEFAULT_MODEL = "deepseek-v4-flash";
const DEFAULT_CHAT_MAX_TOKENS = 1200;
const DEFAULT_EXPLAIN_MAX_TOKENS = 600;

let providerCache = null;

function getProvider() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;
  if (providerCache && providerCache.apiKey === apiKey) return providerCache;
  const baseURL = process.env.DEEPSEEK_BASE_URL || DEFAULT_BASE_URL;
  providerCache = {
    apiKey,
    baseURL,
    provider: createDeepSeek({ apiKey, baseURL }),
  };
  return providerCache;
}

function getModelName() {
  return process.env.DEEPSEEK_MODEL || DEFAULT_MODEL;
}

function getHealth() {
  const provider = getProvider();
  const model = getModelName();
  if (!provider) {
    return {
      ok: false,
      provider: "deepseek",
      model,
      reason: "DEEPSEEK_API_KEY is not set on the server.",
    };
  }
  return { ok: true, provider: "deepseek", model, baseURL: provider.baseURL };
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function sendUnavailable(res, reason) {
  sendJson(res, 503, {
    error: "AI assistant unavailable",
    reason,
  });
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf-8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON body: ${e.message}`);
  }
}

function abortControllerFor(req) {
  const ctrl = new AbortController();
  req.on("close", () => {
    if (!ctrl.signal.aborted) ctrl.abort();
  });
  return ctrl;
}

async function handleHealth(_req, res) {
  sendJson(res, 200, getHealth());
}

async function handleChat(req, res) {
  const cfg = getProvider();
  if (!cfg) return sendUnavailable(res, "DEEPSEEK_API_KEY is not set.");
  let body;
  try {
    body = await readJson(req);
  } catch (e) {
    return sendJson(res, 400, { error: e.message });
  }
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const context = body.context && typeof body.context === "object" ? body.context : {};
  if (messages.length === 0) {
    return sendJson(res, 400, { error: "messages array is required" });
  }
  const ctrl = abortControllerFor(req);
  try {
    const result = streamText({
      model: cfg.provider(getModelName()),
      system: buildChatSystemPrompt(context),
      messages,
      maxTokens: Number(process.env.AI_CHAT_MAX_TOKENS) || DEFAULT_CHAT_MAX_TOKENS,
      abortSignal: ctrl.signal,
    });
    result.pipeDataStreamToResponse(res);
  } catch (e) {
    if (!res.headersSent) sendJson(res, 500, { error: String(e.message || e) });
  }
}

async function handleExplain(req, res) {
  const cfg = getProvider();
  if (!cfg) return sendUnavailable(res, "DEEPSEEK_API_KEY is not set.");
  let body;
  try {
    body = await readJson(req);
  } catch (e) {
    return sendJson(res, 400, { error: e.message });
  }
  const context = body.context && typeof body.context === "object" ? body.context : {};
  if (!context.selection || !context.selection.text) {
    return sendJson(res, 400, { error: "context.selection.text is required" });
  }
  const ctrl = abortControllerFor(req);
  try {
    const result = streamText({
      model: cfg.provider(getModelName()),
      system: buildExplainSystemPrompt(),
      prompt: buildExplainUserPrompt(context),
      maxTokens: Number(process.env.AI_EXPLAIN_MAX_TOKENS) || DEFAULT_EXPLAIN_MAX_TOKENS,
      abortSignal: ctrl.signal,
    });
    result.pipeDataStreamToResponse(res);
  } catch (e) {
    if (!res.headersSent) sendJson(res, 500, { error: String(e.message || e) });
  }
}

// Returns true if the request was handled, false otherwise.
export async function handleAiApi(req, res, url) {
  if (url.pathname === "/api/ai/health" && req.method === "GET") {
    await handleHealth(req, res);
    return true;
  }
  if (url.pathname === "/api/ai/chat" && req.method === "POST") {
    await handleChat(req, res);
    return true;
  }
  if (url.pathname === "/api/ai/explain" && req.method === "POST") {
    await handleExplain(req, res);
    return true;
  }
  return false;
}
