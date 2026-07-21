/** دوال استدعاء ذاتي — اليوم 9 */

/** @param {number} n */
export function factorial(n) {
  const k = Math.floor(Number(n));
  if (k <= 1) return 1;
  return k * factorial(k - 1);
}

/** @param {number} n */
export function sumToN(n) {
  const k = Math.floor(Number(n));
  if (k <= 0) return 0;
  return k + sumToN(k - 1);
}

/** @param {number} n */
export function countDownSteps(n) {
  const k = Math.floor(Number(n));
  if (k <= 0) return 0;
  return 1 + countDownSteps(k - 1);
}

/**
 * تتبّع استدعاءات factorial(n) — للتعليم فقط (n صغير)
 * @param {number} n
 * @returns {{ result: number, calls: number }}
 */
export function factorialWithTrace(n) {
  let calls = 0;
  function fact(k) {
    calls += 1;
    if (k <= 1) return 1;
    return k * fact(k - 1);
  }
  return { result: fact(Math.floor(Number(n))), calls };
}

/** @param {string} id @param {number|string} answer */
export function checkRecursionLabAnswer(id, answer) {
  const raw = String(answer ?? "").trim();
  const num = Number(raw);
  /** @type {Record<string, { expected: number, explainAr: string }>} */
  const map = {
    "fact-5": { expected: 120, explainAr: "5! = 5×4×3×2×1 = 120" },
    "sum-6": { expected: 21, explainAr: "6+5+4+3+2+1 = 21" },
    "count-4": { expected: 4, explainAr: "4→3→2→1 أربع خطوات عدّ" },
    "fact-calls-4": { expected: 4, explainAr: "fact(4) يستدعي fact(3)…fact(1) — 4 استدعاءات" },
    "sum-10": { expected: 55, explainAr: "مجموع 1..10 = 55" },
  };
  const row = map[id];
  if (!row) return { ok: false, explainAr: "سؤال غير معروف." };
  return {
    ok: Number.isFinite(num) && num === row.expected,
    explainAr: row.explainAr,
    expected: row.expected,
  };
}

export const RECURSION_CHALLENGES = [
  { id: "fact-5", promptAr: "factorial(5) = ?", kind: "numeric" },
  { id: "sum-6", promptAr: "sumToN(6) = ?", kind: "numeric" },
  { id: "count-4", promptAr: "countDownSteps(4) = ?", kind: "numeric" },
  { id: "fact-calls-4", promptAr: "كم استدعاءً لـ factorial(4)؟", kind: "numeric" },
  { id: "sum-10", promptAr: "sumToN(10) = ?", kind: "numeric" },
];
