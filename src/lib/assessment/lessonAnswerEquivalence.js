export function normalizeLessonAnswer(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/\s/g, "");
}

export function areEquivalentLessonAnswers(actual, expected) {
  const a = normalizeLessonAnswer(actual);
  const e = normalizeLessonAnswer(expected);
  if (!a || !e) return a === e;
  if (a === e) return true;
  const boolSets = [
    ["TRUE", "1", "صح", "نعم"],
    ["FALSE", "0", "خطأ", "لا"],
  ];
  return boolSets.some((set) => set.includes(a) && set.includes(e));
}

