import React from "react";
import { createRoot } from "react-dom/client";
import { PracticePreview } from "./PracticePreview.jsx";
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
  if (explicit && practices[explicit]) return explicit;
  const match = window.location.pathname.match(/lesson(\d+)-practice-preview/i);
  return match ? `lesson${match[1]}` : "lesson1";
}

const lessonId = lessonIdFromPage();
const practice = practices[lessonId] || lesson1Practice;
const root = document.getElementById("practice-root");

if (!root) {
  throw new Error("Missing #practice-root.");
}

createRoot(root).render(<PracticePreview practice={practice} />);
