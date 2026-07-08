/** تصنيف Big-O — أمثلة تعليمية */

export const BIG_O_OPTIONS = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2^n)"];

/** @type {Array<{ id: string, snippetAr: string, answer: string, explainAr: string }>} */
export const COMPLEXITY_SCENARIOS = [
  {
    id: "const-access",
    snippetAr: "x = arr[5]",
    answer: "O(1)",
    explainAr: "الوصول لم index ثابت — وقت ثابت.",
  },
  {
    id: "single-loop",
    snippetAr: "for i in range(n):\n    print(i)",
    answer: "O(n)",
    explainAr: "حلقة واحدة على n.",
  },
  {
    id: "nested-loop",
    snippetAr: "for i in range(n):\n  for j in range(n):\n    total += 1",
    answer: "O(n²)",
    explainAr: "حلقتان متداخلتان → n×n.",
  },
  {
    id: "binary-halving",
    snippetAr: "while n > 1:\n    n = n // 2",
    answer: "O(log n)",
    explainAr: "تقسيم المتغير إلى النصف كل مرة.",
  },
  {
    id: "fib-recursive",
    snippetAr: "def fib(n):\n  return fib(n-1)+fib(n-2)",
    answer: "O(2^n)",
    explainAr: "تكرار فيبوناتشي الساذج — يتضاعف عدد الاستدعاءات.",
  },
  {
    id: "merge-sort-like",
    snippetAr: "sort(arr)  # خوارزمية n log n",
    answer: "O(n log n)",
    explainAr: "فرز فعال مثل merge sort.",
  },
];

/** @param {string} scenarioId @param {string} guess */
export function checkComplexityAnswer(scenarioId, guess) {
  const scenario = COMPLEXITY_SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario) return { ok: false, expected: null };
  const normalized = String(guess || "").trim().replace(/\s+/g, " ");
  const ok = normalized.toLowerCase() === scenario.answer.toLowerCase();
  return { ok, expected: scenario.answer, explainAr: scenario.explainAr };
}

/** @param {number} n */
export function linearSteps(n) {
  return Math.max(0, Math.floor(n));
}

/** @param {number} n */
export function quadraticSteps(n) {
  const x = Math.max(0, Math.floor(n));
  return x * x;
}
