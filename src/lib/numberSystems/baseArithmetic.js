/**
 * الحساب في أنظمة العد — جمع وطرح مع الحمل
 */

const DIGITS = "0123456789ABCDEF";

export function parseInBase(str, base) {
  const s = String(str).trim().toUpperCase();
  let val = 0;
  for (const ch of s) {
    const d = DIGITS.indexOf(ch);
    if (d < 0 || d >= base) return { ok: false, error: "invalid_digit" };
    val = val * base + d;
  }
  return { ok: true, value: val };
}

export function formatInBase(n, base) {
  if (n === 0) return "0";
  let x = Math.abs(Math.floor(n));
  let out = "";
  while (x > 0) {
    out = DIGITS[x % base] + out;
    x = Math.floor(x / base);
  }
  return out;
}

/** جمع في أساس b مع خطوات الحمل */
export function addInBase(aStr, bStr, base) {
  const a = parseInBase(aStr, base);
  const b = parseInBase(bStr, base);
  if (!a.ok || !b.ok) return { ok: false, error: "invalid_digit" };

  const da = String(aStr).toUpperCase().split("").reverse();
  const db = String(bStr).toUpperCase().split("").reverse();
  const maxLen = Math.max(da.length, db.length);
  const steps = [];
  let carry = 0;
  const digits = [];

  for (let i = 0; i < maxLen || carry; i++) {
    const da_i = i < da.length ? DIGITS.indexOf(da[i]) : 0;
    const db_i = i < db.length ? DIGITS.indexOf(db[i]) : 0;
    if (da_i < 0 || da_i >= base || db_i < 0 || db_i >= base) {
      return { ok: false, error: "invalid_digit" };
    }
    const sum = da_i + db_i + carry;
    const digit = sum % base;
    carry = Math.floor(sum / base);
    digits.push(DIGITS[digit]);
    steps.push({
      column: i,
      a: da_i,
      b: db_i,
      carryIn: i === 0 ? 0 : steps[steps.length - 1]?.carryOut ?? 0,
      sum,
      digit,
      carryOut: carry,
    });
  }

  const result = digits.reverse().join("").replace(/^0+(?!$)/, "") || "0";
  const decimalCheck = a.value + b.value;
  return { ok: true, result, steps, decimalCheck, verified: parseInBase(result, base).value === decimalCheck };
}

/** طرح ثنائي بدون إشارة (a >= b) */
export function subtractBinaryUnsigned(aStr, bStr) {
  const a = parseInBase(aStr, 2);
  const b = parseInBase(bStr, 2);
  if (!a.ok || !b.ok) return { ok: false, error: "invalid_digit" };
  if (a.value < b.value) return { ok: false, error: "negative_unsigned" };

  const da = aStr.padStart(Math.max(aStr.length, bStr.length), "0").split("").reverse();
  const db = bStr.padStart(Math.max(aStr.length, bStr.length), "0").split("").reverse();
  const steps = [];
  let borrow = 0;
  const digits = [];

  for (let i = 0; i < da.length; i++) {
    let top = Number(da[i]) - borrow;
    const bottom = Number(db[i]);
    borrow = 0;
    if (top < bottom) {
      top += 2;
      borrow = 1;
    }
    const diff = top - bottom;
    digits.push(String(diff));
    steps.push({ column: i, top: Number(da[i]), bottom, borrowOut: borrow, diff });
  }

  const result = digits.reverse().join("").replace(/^0+(?!$)/, "") || "0";
  return { ok: true, result, steps, verified: a.value - b.value === parseInBase(result, 2).value };
}
