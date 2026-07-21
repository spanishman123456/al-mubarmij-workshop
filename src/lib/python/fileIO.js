/** محاكاة قراءة/كتابة ملفات — للمختبر (بدون نظام ملفات حقيقي) */

/** @param {string} filename @param {string} content */
export function simulateWrite(filename, content) {
  const text = String(content ?? "");
  const lines = text.split("\n");
  return {
    filename: String(filename || "output.txt"),
    content: text,
    lineCount: lines.length,
    charCount: text.length,
    writtenAt: new Date().toISOString(),
  };
}

/** @param {{ content?: string }} file */
export function simulateRead(file) {
  return file?.content ?? "";
}

/** @param {string} content */
export function countWords(content) {
  return String(content || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/** @param {string} template @param {Record<string, string|number>} vars */
export function fillTemplate(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}
