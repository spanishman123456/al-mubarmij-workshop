/** محاكاة if مبسّطة — للاختبار والمختبر */

export function runSimpleIf(code) {
  const lines = code.split("\n").map((l) => l.trim()).filter(Boolean);
  let score = null;
  let d1 = null;
  let d2 = null;
  let a = null;
  let b = null;
  let g = null;
  let n = null;
  const outputs = [];
  const errors = [];

  for (const line of lines) {
    if (/^score\s*=/.test(line)) {
      const m = line.match(/score\s*=\s*(-?\d+)/);
      if (m) score = Number(m[1]);
    }
    if (/^d1,\s*d2/.test(line)) {
      const m = line.match(/=\s*(-?\d+)\s*,\s*(-?\d+)/);
      if (m) {
        d1 = Number(m[1]);
        d2 = Number(m[2]);
      }
    }
    if (/^a,\s*b/.test(line)) {
      const m = line.match(/=\s*(-?\d+)\s*,\s*(-?\d+)/);
      if (m) {
        a = Number(m[1]);
        b = Number(m[2]);
      }
    }
    if (/^g\s*=/.test(line)) {
      const m = line.match(/g\s*=\s*(-?\d+)/);
      if (m) g = Number(m[1]);
    }
    if (/^n\s*=/.test(line)) {
      const m = line.match(/n\s*=\s*(-?\d+)/);
      if (m) n = Number(m[1]);
    }
    if (/\bif\b/.test(line) && /=/.test(line) && !/==/.test(line) && !/>=|<=|!=/.test(line)) {
      errors.push("SyntaxError: استخدم == للمقارنة لا =");
    }
    if (line.startsWith("if") && !line.includes(":")) {
      errors.push("SyntaxError: ناقص : بعد if");
    }
    if (/^\s*print\s*\(/.test(line) && !line.startsWith("if") && !line.startsWith("elif") && !line.startsWith("else")) {
      const badIndent = lines.some((l) => l.startsWith("if") && !code.includes("    print"));
      if (badIndent && line.startsWith("print(")) {
        errors.push("IndentationError: أزحف print داخل if");
      }
    }
  }

  if (errors.length) return { outputs, errors };

  if (score != null) {
    outputs.push(score >= 50 ? "ناجح" : "راسب");
  }
  if (d1 != null && d2 != null) {
    if (d1 > d2) outputs.push("1");
    else if (d1 < d2) outputs.push("2");
    else outputs.push("تعادل");
  }
  if (a != null && b != null) outputs.push(String(a > b ? a : b));
  if (g != null) {
    if (g >= 90) outputs.push("A");
    else if (g >= 80) outputs.push("B");
    else if (g >= 70) outputs.push("C");
    else outputs.push("F");
  }
  if (n != null) outputs.push(n % 2 === 0 ? "زوجي" : "فردي");

  if (!outputs.length && lines.some((l) => l.includes("print"))) {
    errors.push("تعذر تحليل الكود الحالي في هذا النشاط. قد يكون الكود صحيحًا لكن صيغة التتبع غير مدعومة بالكامل.");
  }

  return { outputs, errors };
}

/** ترتيب خطوات خوارزمية */
export function validateAlgorithmStepOrder(selected, correct) {
  if (!Array.isArray(selected) || !Array.isArray(correct)) return false;
  if (selected.length !== correct.length) return false;
  return selected.every((s, i) => s === correct[i]);
}

export const MAX_TWO_STEPS = ["اقرأ a و b", "إذا a > b فاجعل max = a وإلا max = b", "اطبع max"];
