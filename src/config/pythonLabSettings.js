/** إعدادات مختبر بايثون — يمكن للمعلم تعديل VITE_PYTHON_CODE_ASSIST عند النشر */

export const CODE_ASSIST_MODES = {
  full: "full",
  reduced: "reduced",
  off: "off",
};

export const CODE_ASSIST_LABELS_AR = {
  full: "مفعّلة",
  reduced: "مخفّضة",
  off: "متوقفة",
};

/** @returns {"full"|"reduced"|"off"} */
export function parseAssistMode(raw) {
  const v = String(raw || "").trim().toLowerCase();
  if (v === "reduced" || v === "off") return v;
  return "full";
}

/** Build-time default from env (teacher sets on Render). */
export function getBuildTimeAssistMode() {
  return parseAssistMode(import.meta.env.VITE_PYTHON_CODE_ASSIST);
}
