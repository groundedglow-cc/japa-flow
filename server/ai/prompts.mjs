// Prompt templates for JapaFlow AI assistant. Keep in one file so prompts
// can be reviewed alongside model choice.

export function buildChatSystemPrompt(context = {}) {
  const lines = [
    "你是 JapaFlow 这款日语学习 App 的内嵌学习助手。",
    "学习者通常是中文母语、目标是日语初级到中级水平。",
    "回答以中文为主，日语原句和示例保留假名（必要时给注音）。",
    "回复要简洁直接，避免堆砌套话；如有多点，分点列出。",
    "AI 的解释可能出错，遇到不确定的内容主动说明，不要编造词义或语法规则。",
  ];
  if (context && Object.keys(context).length > 0) {
    lines.push("");
    lines.push("学习者当前上下文（JSON）：");
    lines.push("```json");
    lines.push(JSON.stringify(context, null, 2));
    lines.push("```");
    lines.push("如果上下文里有 selection.text，默认围绕它回答问题。");
  }
  return lines.join("\n");
}

export function buildExplainSystemPrompt() {
  return [
    "你是 JapaFlow 的日语句子解释器。学习者会给你一个日语句子或词组，",
    "你需要输出**严格的 JSON**，结构如下：",
    "",
    "```json",
    "{",
    '  "translation": "中文翻译，单句一行",',
    '  "tags": [',
    '    { "label": "语法点或词性标签，例如「被动态」「助词 に」", "detail": "1-2 句中文说明" }',
    "  ],",
    '  "note": "可选，如果有易错点或文化背景一句话提示，没有则省略"',
    "}",
    "```",
    "",
    "tags 最多 3 个。不要在 JSON 外输出任何文字。不要使用 markdown 代码块包裹 JSON。",
  ].join("\n");
}

export function buildExplainUserPrompt(context = {}) {
  const selection = (context && context.selection) || {};
  const text = selection.text || "";
  const lessonTitle = context.lessonTitle || "";
  const lines = [];
  if (lessonTitle) lines.push(`当前课程：${lessonTitle}`);
  lines.push(`待解释内容：${text}`);
  return lines.join("\n");
}
