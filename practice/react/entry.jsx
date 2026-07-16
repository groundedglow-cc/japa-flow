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

const practices = {
  lesson1: lesson1Practice,
  lesson2: lesson2Practice,
  lesson3: lesson3Practice,
  lesson4: lesson4Practice,
  lesson5: lesson5Practice,
  lesson6: lesson6Practice
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
