/** توقيت المملكة العربية السعودية (Asia/Riyadh) — UTC+3 بدون DST */

export const RIYADH_TZ = "Asia/Riyadh";

export function riyadhDateKey(isoOrDate = new Date()) {
  const d = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: RIYADH_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function formatRiyadhDateTime(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString("ar-SA", {
      timeZone: RIYADH_TZ,
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return null;
  }
}
