/** تسجيل حفظ المسودات قبل الخروج التلقائي — لا يمس بيانات المصادقة */

/** @type {Set<() => void | Promise<void>>} */
const savers = new Set();

/** @param {() => void | Promise<void>} fn */
export function registerDraftSaver(fn) {
  savers.add(fn);
  return () => savers.delete(fn);
}

export async function flushDraftsBeforeLogout() {
  for (const fn of savers) {
    try {
      await fn();
    } catch (err) {
      console.warn("[draftFlush] saver failed", err);
    }
  }
}

const DRAFT_PREFIX = "mubarmij-inactivity-draft-";

/** @param {string} key @param {unknown} value */
export function saveInactivityDraft(key, value) {
  try {
    localStorage.setItem(`${DRAFT_PREFIX}${key}`, JSON.stringify({ savedAt: Date.now(), value }));
  } catch {
    /* ignore quota errors */
  }
}

/** @param {string} key */
export function loadInactivityDraft(key) {
  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.value ?? null;
  } catch {
    return null;
  }
}

/** @param {string} key */
export function clearInactivityDraft(key) {
  localStorage.removeItem(`${DRAFT_PREFIX}${key}`);
}
