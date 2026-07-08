/** كسوريات — Koch و Sierpinski — اليوم 9 */

/**
 * عدد قطع الخط في منحنى Koch بعد depth تكرارات
 * @param {number} initialSegments
 * @param {number} depth
 */
export function kochSegmentCount(initialSegments, depth) {
  const base = Math.max(0, Math.floor(Number(initialSegments)));
  const d = Math.max(0, Math.floor(Number(depth)));
  if (d === 0) return base;
  return base * 4 ** d;
}

/**
 * عدد أصغر مثلثات مملوءة في مثلث Sierpinski عند عمق depth
 * @param {number} depth
 */
export function sierpinskiSmallTriangles(depth) {
  const d = Math.max(0, Math.floor(Number(depth)));
  return 3 ** d;
}

/**
 * مضاعف محيط Koch (لكل ضلع) بعد depth
 * @param {number} depth
 */
export function kochPerimeterMultiplier(depth) {
  const d = Math.max(0, Math.floor(Number(depth)));
  return (4 / 3) ** d;
}

/** @param {string} id @param {number|string} answer */
export function checkFractalLabAnswer(id, answer) {
  const raw = String(answer ?? "").trim();
  const num = Number(raw);
  /** @type {Record<string, { expected: number, explainAr: string }>} */
  const map = {
    "koch-seg-2": {
      expected: kochSegmentCount(3, 2),
      explainAr: "ثلاثة أضلاع × 4² = 48 قطعة خط",
    },
    "koch-seg-1": {
      expected: kochSegmentCount(3, 1),
      explainAr: "3 × 4 = 12 قطعة بعد تكرار واحد",
    },
    "sierp-3": {
      expected: sierpinskiSmallTriangles(3),
      explainAr: "3³ = 27 مثلثًا صغيرًا",
    },
    "sierp-2": {
      expected: sierpinskiSmallTriangles(2),
      explainAr: "3² = 9 مثلثات",
    },
    "self-similar": {
      expected: 1,
      explainAr: "الجزء يشبه الكل — تعريف التشابه الذاتي",
    },
  };
  const row = map[id];
  if (!row) return { ok: false, explainAr: "سؤال غير معروف." };
  if (id === "self-similar") {
    return {
      ok: raw === "1" || raw.toLowerCase() === "a",
      explainAr: row.explainAr,
      expected: row.expected,
    };
  }
  return {
    ok: Number.isFinite(num) && num === row.expected,
    explainAr: row.explainAr,
    expected: row.expected,
  };
}

export const FRACTAL_INTRO_CHALLENGES = [
  {
    id: "self-similar",
    promptAr: "أي خيار يصف الكسورية؟",
    options: [
      { id: "a", labelAr: "الجزء يشبه الكل عند تكبير" },
      { id: "b", labelAr: "خط مستقيم واحد فقط" },
      { id: "c", labelAr: "حلقة while بدون توقف" },
      { id: "d", labelAr: "ملف نصي" },
    ],
    correct: "a",
  },
];

export const KOCH_CHALLENGES = [
  { id: "koch-seg-1", promptAr: "ندفة Koch — 3 أضلاع، عمق 1 — كم قطعة خط؟", kind: "numeric" },
  { id: "koch-seg-2", promptAr: "ندفة Koch — 3 أضلاع، عمق 2 — كم قطعة خط؟", kind: "numeric" },
];

export const SIERPINSKI_CHALLENGES = [
  { id: "sierp-2", promptAr: "مثلث Sierpinski — عمق 2 — كم مثلثًا صغيرًا؟", kind: "numeric" },
  { id: "sierp-3", promptAr: "مثلث Sierpinski — عمق 3 — كم مثلثًا صغيرًا؟", kind: "numeric" },
];
