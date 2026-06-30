/** @typedef {import('../types.js').CodeValidationResult} CodeValidationResult */

const FORBIDDEN = [
  { re: /^\s*import\s/m, msg: "import غير مسموح" },
  { re: /^\s*from\s+/m, msg: "from ... import غير مسموح" },
  { re: /from\s+microbit/mi, msg: "from microbit غير مسموح" },
  { re: /\bos\./m, msg: "os غير مسموح" },
  { re: /\btime\./m, msg: "time غير مسموح — استخدم basic.pause" },
  { re: /\bthreading\b/m, msg: "threading غير مسموح" },
  { re: /i2c_lcd/i, msg: "مكتبات LCD خارجية غير مسموحة" },
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

  if (/\bpins\.(set_pull|digital_read_pin|digital_write_pin)/m.test(src)) {
    if (!/\bDigitalPin\.P\d+/m.test(src)) {
      errors.push("يجب استخدام DigitalPin.Px وليس أرقامًا خامة للـ pins");
    }
    if (!/PinPullMode\.PULL_UP/m.test(src) && /set_pull/m.test(src)) {
      errors.push("يجب استخدام PinPullMode.PULL_UP للأزرار");
    }
  }

  if (/i2c_write_number/m.test(src) && !/NumberFormat\.UINT8_LE/m.test(src)) {
    errors.push("I2C يتطلب NumberFormat.UINT8_LE");
  }

  if (/lcd_/m.test(src)) {
    if (!/def lcd_init\s*\(/m.test(src)) errors.push("يجب وجود lcd_init()");
    if (!/LCD_ADDR\s*=\s*0x27/m.test(src)) errors.push("عنوان LCD يجب أن يكون 0x27");
  }

  if (/def on_forever\s*\(/m.test(src) && !/\bbasic\.forever\s*\(\s*on_forever\s*\)/m.test(src)) {
    errors.push("يجب استدعاء basic.forever(on_forever)");
  }

  if (/pins\.set_pull\s*\(\s*\d+/m.test(src)) {
    warnings.push("pins.set_pull يستخدم رقمًا خامًا — استخدم DigitalPin");
  }
  if (/LCD_ADDR_ALT/m.test(src)) {
    warnings.push("لا تستخدم عنوانين LCD في الوقت نفسه");
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * @param {string} code
 * @param {string} [context]
 */
export function assertValidMakeCodePython(code, context = "generated code") {
  const result = validateMakeCodePython(code);
  if (!result.valid) {
    throw new Error(`${context}: ${result.errors.join("; ")}`);
  }
  return result;
}
