#!/usr/bin/env node
/** Audit pre/post questions — outputs JSON report to stdout or file. */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  OFFICIAL_PRE_TEST_QUESTIONS,
  OFFICIAL_POST_TEST_QUESTIONS,
} from "../src/data/officialPdfAssessments.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const EXTERNAL_PHRASES = ["ارسم", "دفتر", "ورقة خارج", "صف ما رسم", "خارج المنصة", "في المساحة المعطاة", "حسب PDF"];

function recommendType(q) {
  const text = q.questionAr || "";
  if (q.type === "match" || q.type === "order") return q.type;
  if (/اطابق|طابق|مطابقة/i.test(text)) return "match";
  if (/رتّب|رتب|ترتيب/i.test(text)) return "order";
  if (/جدول الحقيقة|truth/i.test(text)) return "truth-table";
  if (/مخطط|flowchart|خوارزم/i.test(text)) return "flowchart";
  if (/دارة|بوابة|AND|OR|NOT|منطق/i.test(text)) return "logic-circuit";
  if (/بطاق/i.test(text)) return "binary-cards";
  if (q.type === "code") return "code-editor";
  if (q.type === "fill") return "fill";
  if (q.type === "mcq" || q.type === "truefalse") return q.type;
  if (q.type === "essay") return "essay-structured";
  return q.type || "mcq";
}

function auditQuestion(q, quizLabel) {
  const needsExternal = EXTERNAL_PHRASES.some((p) => (q.questionAr || "").includes(p));
  const recommended = recommendType(q);
  const auto = ["mcq", "truefalse", "fill", "match", "order", "logic-circuit", "flowchart", "truth-table", "binary-cards", "binary-cards-sheet"].includes(q.type || recommended);
  return {
    id: q.id,
    quiz: quizLabel,
    pdfOrder: q.pdfOrder,
    questionAr: q.questionAr,
    currentType: q.type || "mcq",
    recommendedInteraction: recommended,
    autoGradable: auto,
    needsTeacherReview: !auto || q.type === "essay" || q.type === "code",
    modelAnswer: q.correctAnswer || q.correctPairs || q.correctIndex || q.modelAnswerAr,
    explainAr: q.explainAr,
    ambiguous: needsExternal,
    hadExternalNotebookCue: needsExternal,
  };
}

const pre = OFFICIAL_PRE_TEST_QUESTIONS.map((q) => auditQuestion(q, "quiz-pre"));
const post = OFFICIAL_POST_TEST_QUESTIONS.map((q) => auditQuestion(q, "quiz-post"));
const all = [...pre, ...post];

const summary = {
  preCount: pre.length,
  postCount: post.length,
  externalCueCount: all.filter((q) => q.hadExternalNotebookCue).length,
  byType: all.reduce((acc, q) => {
    acc[q.currentType] = (acc[q.currentType] || 0) + 1;
    return acc;
  }, {}),
  byRecommended: all.reduce((acc, q) => {
    acc[q.recommendedInteraction] = (acc[q.recommendedInteraction] || 0) + 1;
    return acc;
  }, {}),
};

const outPath = path.join(__dirname, "..", "docs", "quiz-question-audit.json");
writeFileSync(outPath, JSON.stringify({ summary, questions: all }, null, 2), "utf8");
console.log(JSON.stringify(summary, null, 2));
console.log(`Wrote ${outPath}`);
