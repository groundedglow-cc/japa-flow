import React from "react";
import { createRoot } from "react-dom/client";
import { PracticePreview } from "./PracticePreview.jsx";
import { practiceSessionApi } from "./practiceSessionApi.js";
import { lesson1Practice } from "../lesson1-practice-data.ts";
import { lesson2Practice } from "../lesson2-practice-data.ts";
import { lesson3Practice } from "../lesson3-practice-data.ts";
import { lesson4Practice } from "../lesson4-practice-data.ts";
import { lesson5Practice } from "../lesson5-practice-data.ts";
import { lesson6Practice } from "../lesson6-practice-data.ts";
import { lesson7Practice } from "../lesson7-practice-data.ts";
import { lesson8Practice } from "../lesson8-practice-data.ts";
import { lesson9Practice } from "../lesson9-practice-data.ts";
import { lesson10Practice } from "../lesson10-practice-data.ts";
import { lesson11Practice } from "../lesson11-practice-data.ts";
import { lesson12Practice } from "../lesson12-practice-data.ts";
import { lesson13Practice } from "../lesson13-practice-data.ts";
import { lesson14Practice } from "../lesson14-practice-data.ts";
import { lesson15Practice } from "../lesson15-practice-data.ts";
import { lesson16Practice } from "../lesson16-practice-data.ts";
import { lesson17Practice } from "../lesson17-practice-data.ts";
import { lesson18Practice } from "../lesson18-practice-data.ts";
import { lesson19Practice } from "../lesson19-practice-data.ts";

const practices = {
  lesson1: lesson1Practice,
  lesson2: lesson2Practice,
  lesson3: lesson3Practice,
  lesson4: lesson4Practice,
  lesson5: lesson5Practice,
  lesson6: lesson6Practice,
  lesson7: lesson7Practice,
  lesson8: lesson8Practice,
  lesson9: lesson9Practice,
  lesson10: lesson10Practice,
  lesson11: lesson11Practice,
  lesson12: lesson12Practice,
  lesson13: lesson13Practice,
  lesson14: lesson14Practice,
  lesson15: lesson15Practice,
  lesson16: lesson16Practice,
  lesson17: lesson17Practice,
  lesson18: lesson18Practice,
  lesson19: lesson19Practice
};

function lessonIdFromPage() {
  const explicit = document.body.dataset.lessonId;
  if (explicit) return explicit;
  const match = window.location.pathname.match(/lesson(\d+)-practice-preview/i);
  return match ? `lesson${match[1]}` : "lesson1";
}

const lessonId = lessonIdFromPage();
const localPractice = practices[lessonId] || null;
const fallbackPractice = localPractice || {
  lessonId,
  title: `${lessonId} 练习`,
  sourcePages: [],
  activities: []
};
const root = document.getElementById("practice-root");

if (!root) {
  throw new Error("Missing #practice-root.");
}

root.textContent = "加载练习...";

async function bootstrap() {
  if (!practiceSessionApi.isAuthenticated()) {
    root.textContent = "请先登录后继续练习，正在跳转...";
    practiceSessionApi.redirectToLogin();
    return;
  }
  const { practice } = await practiceSessionApi.loadPublishedPractice(lessonId, fallbackPractice);
  createRoot(root).render(<PracticePreview practice={practice} localPractice={localPractice} />);
}

bootstrap().catch((error) => {
  root.textContent = error?.message || "练习加载失败，请稍后重试。";
});
