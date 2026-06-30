/** @typedef {import('../types.js').CodeValidationResult} CodeValidationResult */

const FORBIDDEN = [
  { re: /^\s*import\s/m, msg: "import غير مسموح في MakeCode Python" },
  { re: /^\s*from\s+/m, msg: "from ... import غير مسموح" },
  { re: /from\s+microbit/mi, msg: "from microbit غير مسموح — استخدم pins و basic" },
  { re: /\bos\./m, msg: "os غير مسموح" },
  { re: /\btime\./m, msg: "time غير مسموح — استخدم basic.pause" },
  { re: /\bthreading\b/m, msg: "threading غير مسموح" },
];

const RECOMMENDED = [
  { re: /\bpins\./m, msg: null },
  { re: /\bbasic\./m, msg: null },
  { re: /NumberFormat\.UINT8_LE/m, msg: null },
];

/**
 * @param {string} code
 * @returns {CodeValidationResult}
 */
export function validateMakeCodePython(code) {
  const errors = [];
  const warnings = [];
  const src = String(code || "");

  for (const rule of FORBIDDEN) {
    if (rule.re.test(src)) errors.push(rule.msg);
  }

  if (!/\bpins\./m.test(src)) {
    warnings.push("لم يُعثر على pins.* — تأكد من قراءة الأزرار والـ LEDs");
  }
  if (!/\bbasic\./m.test(src)) {
    warnings.push("لم يُعثر على basic.* — أضف basic.forever أو basic.pause");
  }
  if (!/lcd_/m.test(src) && !/basic\.show/m.test(src)) {
    warnings.push("لا يوجد عرض على LCD أو LED matrix — قد يكون مقصودًا");
  }

  if (src.length > 12000) {
    warnings.push("الكود طويل — قد يبطئ التجميع في MakeCode");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
