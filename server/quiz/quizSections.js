/** Section labels for paginated pre/post assessments (Arabic). */

export const PRE_SECTIONS = [
  { id: "core", titleAr: "القسم 1: الأسئلة الأساسية", match: (q) => (q.pdfOrder ?? 0) <= 33 },
  { id: "conversions", titleAr: "القسم 2: تحويلات الأنظمة", match: (q) => q.id.startsWith("pre-bin-") },
  { id: "strings", titleAr: "القسم 3: النصوص والسلاسل", match: (q) => q.id.startsWith("pre-str-") },
  { id: "puzzles", titleAr: "القسم 4: ألغاز ثنائية", match: (q) => q.id.startsWith("pre-puzzle-") },
  { id: "ternary", titleAr: "القسم 5: بطاقات ثلاثية", match: (q) => q.id.startsWith("pre-tern-") },
  { id: "matching", titleAr: "القسم 6: بطاقات المطابقة", match: (q) => q.id.startsWith("pre-match-") },
  { id: "cards", titleAr: "القسم 7: بطاقات ثنائية", match: (q) => q.id.startsWith("pre-bincard") },
  { id: "programming", titleAr: "القسم 8: البرمجة", match: (q) => q.type === "code" && !q.id.startsWith("pre-bin-") },
  { id: "other", titleAr: "القسم 9: أسئلة إضافية", match: () => true },
];

export const POST_SECTIONS = [
  { id: "core", titleAr: "القسم 1: الأسئلة الأساسية", match: (q) => (q.pdfOrder ?? 0) <= 19 },
  { id: "supplement", titleAr: "القسم 2: أسئلة إضافية", match: () => true },
];

export function getSectionsForQuiz(quizId) {
  if (quizId === "quiz-pre") return PRE_SECTIONS;
  if (quizId === "quiz-post") return POST_SECTIONS;
  return [{ id: "all", titleAr: "جميع الأسئلة", match: () => true }];
}

export function assignSectionId(quizId, question) {
  const sections = getSectionsForQuiz(quizId);
  for (const s of sections) {
    if (s.id === "other" || s.id === "supplement") continue;
    if (s.match(question)) return s.id;
  }
  return sections.at(-1)?.id || "all";
}

export function buildSectionGroups(quizId, questions) {
  const sections = getSectionsForQuiz(quizId);
  const groups = sections.map((s) => ({
    id: s.id,
    titleAr: s.titleAr,
    questions: [],
  }));
  const byId = Object.fromEntries(groups.map((g) => [g.id, g]));

  for (const q of questions) {
    const sid = assignSectionId(quizId, q);
    byId[sid]?.questions.push(q);
  }

  return groups.filter((g) => g.questions.length > 0);
}
