import { build } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const lessonArgument = process.argv.find((argument) => argument.startsWith("--lesson="))?.slice("--lesson=".length)
  || process.argv[process.argv.indexOf("--lesson") + 1];

if (!/^\d+$/.test(lessonArgument || "")) {
  throw new Error("Usage: node scripts/merge-practice-into-lesson-draft.mjs --lesson <number>");
}

const lessonNumber = Number(lessonArgument);
const lessonId = `lesson${lessonNumber}`;
const draftPath = join(root, "data", "lesson-drafts", `${lessonId}.json`);
const practicePath = join(root, "practice", `${lessonId}-practice-data.ts`);

function textFromParts(parts = []) {
  return parts.map((part) => {
    if (part?.type === "text") return part.text || "";
    if (part?.type === "blank") return "（　）";
    return "";
  }).join("");
}

function kanaFromParts(parts = []) {
  return parts.map((part) => part?.type === "text" ? (part.kana || part.text || "") : "").join("");
}

function exampleText(example) {
  if (!example) return { text: "", kana: "" };
  const rows = (example.pairedRows || []).map((row) => `${textFromParts(row.before)} → ${textFromParts(row.after)}`);
  const rowKana = (example.pairedRows || []).map((row) => `${kanaFromParts(row.before)} → ${kanaFromParts(row.after)}`);
  const before = example.before || textFromParts(example.beforeParts);
  const beforeKana = example.beforeKana || kanaFromParts(example.beforeParts);
  const after = textFromParts(example.after);
  const afterKana = example.afterKana || kanaFromParts(example.after);
  return {
    text: [...rows, [before, after].filter(Boolean).join(" → ")].filter(Boolean).join("\n"),
    kana: [...rowKana, [beforeKana, afterKana].filter(Boolean).join(" → ")].filter(Boolean).join("\n")
  };
}

function answerForItem(item) {
  const answer = item.answer || {};
  if (answer.slotValues) {
    const first = Object.values(answer.slotValues)[0];
    return Array.isArray(first) ? first.join("\n") : String(first || "");
  }
  if (answer.choiceIds?.length) {
    return answer.choiceIds.map((id) => item.choices?.find((choice) => choice.id === id)?.label || id).join("、");
  }
  if (typeof answer.boolean === "boolean") return answer.boolean ? "○" : "×";
  return "";
}

function relatedGrammar(activityId, groupId) {
  if (/p1-a[1-3]|p2-a[1-3]/.test(activityId)) return ["g1"];
  if (activityId.endsWith("a4")) return groupId?.endsWith("g2") ? ["g3"] : ["g2"];
  if (activityId.endsWith("a5")) return ["g4"];
  if (activityId.endsWith("a6")) return groupId?.endsWith("g2") ? ["g3"] : ["g2"];
  return [];
}

function categoryFor(activity) {
  const categories = {
    fill_blank: "replacement",
    pattern_substitution: "replacement",
    dialogue_practice: "listening-dialogue",
    single_choice: "choice",
    true_false: "listening-true-false",
    translation: "translation"
  };
  return categories[activity.interaction] || "short-answer";
}

function typeFor(activity) {
  if (["single_choice", "true_false"].includes(activity.interaction)) return "choice";
  if (activity.interaction === "dialogue_practice") return "listening";
  if (activity.interaction === "translation") return "translation";
  return "transform";
}

function normalizeItems(practice) {
  return practice.activities.flatMap((activity) => {
    const directGroups = activity.itemGroups?.length
      ? activity.itemGroups.map((group) => ({ id: group.id, title: group.title || activity.title, instruction: group.instruction || activity.instruction || activity.title, example: group.example, items: group.items }))
      : [{ id: activity.id, title: activity.title, instruction: activity.instruction || activity.title, example: activity.layout?.find((block) => block.type === "example")?.content, items: activity.items || [] }];
    return directGroups.flatMap((group) => {
      const example = exampleText(group.example);
      return group.items.map((item) => {
        const answer = answerForItem(item);
        const choices = (item.choices || []).map((choice) => choice.label);
        return {
          id: `ex-${item.id}`,
          groupId: `ex-${activity.id}-${group.id}`,
          groupTitle: group.title,
          category: categoryFor(activity),
          instruction: group.instruction,
          example: example.text,
          exampleKana: example.kana,
          type: typeFor(activity),
          question: textFromParts(item.prompt),
          questionKana: item.promptKana || kanaFromParts(item.prompt),
          choices,
          answer,
          answerKana: "",
          referenceAnswers: answer ? [answer] : [],
          referenceAnswerKana: answer ? [""] : [],
          relatedGrammar: relatedGrammar(activity.id, group.id),
          relatedSentences: [],
          explanation: activity.requiresAudio ? "按教材录音完成。" : "",
          ...(activity.requiresAudio ? { audioRequired: true } : {})
        };
      });
    });
  });
}

const bundle = await build({
  entryPoints: [practicePath], bundle: true, format: "esm", platform: "node", target: ["node20"], write: false, logLevel: "silent"
});
const moduleCode = bundle.outputFiles[0]?.text;
if (!moduleCode) throw new Error("Practice data bundle was not generated.");
const practiceModule = await import(`data:text/javascript;base64,${Buffer.from(moduleCode).toString("base64")}`);
const practice = practiceModule[`${lessonId}Practice`];
if (!practice) throw new Error(`Missing exported ${lessonId}Practice.`);
const lesson = JSON.parse(await readFile(draftPath, "utf8"));
lesson.exercises = normalizeItems(practice);
await writeFile(draftPath, `${JSON.stringify(lesson, null, 2)}\n`);
console.log(JSON.stringify({ lessonId, exercises: lesson.exercises.length }, null, 2));
