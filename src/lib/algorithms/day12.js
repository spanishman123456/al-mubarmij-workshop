/** خوارزميات اليوم 12: الآلات الحتمية، التعقيد، والمخططات */

/** @param {number} vertices */
export function completeGraphEdges(vertices) {
  const n = Number(vertices);
  if (!Number.isFinite(n) || n < 0) return 0;
  return (n * (n - 1)) / 2;
}

/** @param {string} input */
export function acceptsBinaryEndsWith01(input) {
  const s = String(input ?? "").trim();
  return /^[01]*01$/.test(s);
}

/** @param {number[]} degrees */
export function isValidUndirectedDegreeSequence(degrees) {
  if (!Array.isArray(degrees) || degrees.length === 0) return false;
  const nums = degrees.map((v) => Number(v));
  if (nums.some((n) => !Number.isInteger(n) || n < 0)) return false;
  const sum = nums.reduce((a, b) => a + b, 0);
  return sum % 2 === 0;
}

export const DAY12_CHALLENGES = {
  automata: [
    { id: "auto-accept-1", promptAr: "هل السلسلة 1101 مقبولة في DFA تنتهي بـ 01؟ (نعم/لا)", expected: "نعم" },
    { id: "auto-accept-2", promptAr: "هل السلسلة 1110 مقبولة في نفس DFA؟ (نعم/لا)", expected: "لا" },
  ],
  regex: [
    { id: "regex-1", promptAr: "أي Regex يطابق سلاسل ثنائية تنتهي بـ 01؟", expected: "[01]*01" },
    { id: "regex-2", promptAr: "هل 0101 يطابق [01]*01؟ (نعم/لا)", expected: "نعم" },
  ],
  complexity: [
    { id: "comp-1", promptAr: "هل الفرز التقليدي ضمن P أم NP؟ اكتب: P أو NP", expected: "P" },
    { id: "comp-2", promptAr: "هل من الصحيح أن كل P ضمن NP؟ (نعم/لا)", expected: "نعم" },
  ],
  graphs: [
    { id: "graph-1", promptAr: "عدد الحواف في رسم كامل K5 =", expected: "10" },
    { id: "graph-2", promptAr: "هل المتتالية [3,3,2,2,2] ممكنة في رسم غير موجه؟ (نعم/لا)", expected: "نعم" },
  ],
};

/** @param {string} id @param {string|number} answer */
export function checkDay12Answer(id, answer) {
  const raw = String(answer ?? "").trim();
  const compact = raw.replace(/\s+/g, "").toLowerCase();
  const num = Number(raw);
  switch (id) {
    case "auto-accept-1":
      return compact === "نعم" || compact === "yes" || acceptsBinaryEndsWith01("1101");
    case "auto-accept-2":
      return compact === "لا" || compact === "no";
    case "regex-1":
      return compact.includes("[01]*01") || compact.includes("(0|1)*01");
    case "regex-2":
      return compact === "نعم" || compact === "yes";
    case "comp-1":
      return compact === "p";
    case "comp-2":
      return compact === "نعم" || compact === "yes";
    case "graph-1":
      return num === completeGraphEdges(5);
    case "graph-2":
      return compact === "نعم" || compact === "yes";
    default:
      return false;
  }
}
