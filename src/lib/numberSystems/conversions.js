/**
 * تحويلات أنظمة العد — منطق موثّق وقابل للاختبار
 * جميع الأوقات UTC ISO؛ العرض بتوقيت الرياض في الواجهة.
 */

const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function digitsForBase(base) {
  if (!Number.isInteger(base) || base < 2 || base > 36) {
    throw new Error(`أساس غير مدعوم: ${base}`);
  }
  return DIGITS.slice(0, base).split("");
}

export function isValidInBase(value, base) {
  const s = String(value || "").trim().toUpperCase();
  if (!s) return false;
  const allowed = new Set(digitsForBase(base));
  return [...s].every((ch) => allowed.has(ch));
}

export function toSubscript(n) {
  const map = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉" };
  return String(n)
    .split("")
    .map((d) => map[d] ?? d)
    .join("");
}

export function formatWithBase(value, base) {
  return `${value}${toSubscript(base)}`;
}

/** تحويل من أي أساس إلى العشري مع جدول خطوات */
export function fromBaseToDecimalSteps(value, base) {
  const s = String(value || "").trim().toUpperCase();
  if (!isValidInBase(s, base)) {
    return { ok: false, error: `الرقم "${value}" غير صالح في النظام ذي الأساس ${base}.` };
  }
  const digits = [...s];
  const rows = [];
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    const position = digits.length - 1 - i;
    const digitValue = DIGITS.indexOf(digits[i]);
    const power = base ** position;
    const product = digitValue * power;
    sum += product;
    rows.push({
      position,
      digit: digits[i],
      digitValue,
      powerExpression: `${base}^${position}`,
      powerValue: power,
      product,
      runningSum: sum,
    });
  }
  return {
    ok: true,
    input: s,
    base,
    rows,
    decimal: sum,
    formatted: formatWithBase(s, base),
    resultFormatted: formatWithBase(sum, 10),
  };
}

/** تحويل من العشري إلى أي أساس — قسمة متكررة */
export function decimalToBaseSteps(decimal, targetBase) {
  const n0 = Number(decimal);
  if (!Number.isInteger(n0) || n0 < 0) {
    return { ok: false, error: "يجب إدخال عدد صحيح موجب." };
  }
  if (targetBase < 2 || targetBase > 36) {
    return { ok: false, error: `أساس الهدف ${targetBase} غير مدعوم.` };
  }
  if (n0 === 0) {
    return {
      ok: true,
      decimal: 0,
      base: targetBase,
      divisions: [],
      remainders: ["0"],
      result: "0",
      resultFormatted: formatWithBase("0", targetBase),
      verify: fromBaseToDecimalSteps("0", targetBase),
    };
  }
  const divisions = [];
  const remainders = [];
  let n = n0;
  const labels = digitsForBase(targetBase);
  while (n > 0) {
    const q = Math.floor(n / targetBase);
    const r = n % targetBase;
    remainders.unshift(labels[r]);
    divisions.push({
      dividend: n,
      divisor: targetBase,
      quotient: q,
      remainder: r,
      remainderDigit: labels[r],
    });
    n = q;
  }
  const result = remainders.join("");
  const verify = fromBaseToDecimalSteps(result, targetBase);
  return {
    ok: true,
    decimal: n0,
    base: targetBase,
    divisions,
    remainders,
    result,
    resultFormatted: formatWithBase(result, targetBase),
    verify,
    verifyOk: verify.ok && verify.decimal === n0,
  };
}

export function convertBetweenBases(value, fromBase, toBase) {
  const viaDec = fromBaseToDecimalSteps(value, fromBase);
  if (!viaDec.ok) return viaDec;
  if (toBase === 10) {
    return {
      ok: true,
      viaDecimal: viaDec.decimal,
      result: String(viaDec.decimal),
      resultFormatted: formatWithBase(viaDec.decimal, 10),
      steps: { toDecimal: viaDec },
    };
  }
  const toTarget = decimalToBaseSteps(viaDec.decimal, toBase);
  return {
    ok: toTarget.ok,
    error: toTarget.error,
    viaDecimal: viaDec.decimal,
    steps: { toDecimal: viaDec, toTarget },
    result: toTarget.result,
    resultFormatted: toTarget.resultFormatted,
  };
}

/** ثنائي → ثماني: تجميع 3 بتات من اليمين */
export function binaryToOctalDirect(binary) {
  const s = String(binary || "").replace(/\s/g, "");
  if (!/^[01]+$/.test(s)) return { ok: false, error: "أدخل عدداً ثنائياً صالحاً." };
  const padded = s.padStart(Math.ceil(s.length / 3) * 3, "0");
  const groups = padded.match(/.{3}/g) || [];
  const octal = groups.map((g) => parseInt(g, 2).toString(8)).join("");
  return { ok: true, binary: s, padded, groups, octal, formatted: formatWithBase(octal, 8) };
}

/** ثنائي → ست عشري: تجميع 4 بتات */
export function binaryToHexDirect(binary) {
  const s = String(binary || "").replace(/\s/g, "");
  if (!/^[01]+$/.test(s)) return { ok: false, error: "أدخل عدداً ثنائياً صالحاً." };
  const padded = s.padStart(Math.ceil(s.length / 4) * 4, "0");
  const groups = padded.match(/.{4}/g) || [];
  const hex = groups.map((g) => parseInt(g, 2).toString(16).toUpperCase()).join("");
  return { ok: true, binary: s, padded, groups, hex, formatted: formatWithBase(hex, 16) };
}

export const WORKED_EXAMPLES = [
  { id: "ex-10101", value: "10101", base: 2, expectedDecimal: 21 },
  { id: "ex-68", decimal: 68, targetBase: 2, expected: "1000100" },
  { id: "ex-38-bin", decimal: 38, targetBase: 2, expected: "100110" },
  { id: "ex-42-base3", decimal: 42, targetBase: 3, expected: "1120" },
  { id: "ex-38-base5", decimal: 38, targetBase: 5, expected: "123" },
];

export function verifyWorkedExamples() {
  const results = [];
  for (const ex of WORKED_EXAMPLES) {
    if (ex.value != null) {
      const r = fromBaseToDecimalSteps(ex.value, ex.base);
      results.push({ id: ex.id, ok: r.ok && r.decimal === ex.expectedDecimal, got: r.decimal, expected: ex.expectedDecimal });
    } else {
      const r = decimalToBaseSteps(ex.decimal, ex.targetBase);
      results.push({ id: ex.id, ok: r.ok && r.result === ex.expected, got: r.result, expected: ex.expected });
    }
  }
  return results;
}
