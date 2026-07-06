import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "analytics.json");

export const LOGIN_SESSION_MS = 8 * 60 * 60 * 1000;
export const ONLINE_THRESHOLD_MS = 15 * 60 * 1000;
export const RECENTLY_ACTIVE_MS = 24 * 60 * 60 * 1000;

function riyadhDateKey(isoOrDate) {
  const d = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function defaultStudentAnalytics() {
  return {
    loginCount: 0,
    lastLoginAt: null,
    firstLoginAt: null,
    lastActivityAt: null,
    loginHistory: [],
    dailyLog: {},
    pageViews: [],
    pagesVisited: {},
    simRuns: {},
    pythonRuns: 0,
    activitiesCompleted: 0,
    teacherNotes: "",
  };
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ analyticsByStudent: {} }, null, 2), "utf8");
  }
}

export function loadStore() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return { analyticsByStudent: parsed.analyticsByStudent || {} };
  } catch (err) {
    console.error("[analytics-store] load failed", err);
    return { analyticsByStudent: {} };
  }
}

export function saveStore(store) {
  ensureDataFile();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch (err) {
    console.error("[analytics-store] save failed", err);
    throw err;
  }
}

function isDuplicateSessionLogin(history, sessionId, at) {
  if (!sessionId) return false;
  const atMs = new Date(at).getTime();
  return (history || []).some((entry) => {
    if (entry.sessionId !== sessionId || entry.success === false) return false;
    const entryMs = new Date(entry.at).getTime();
    return Math.abs(atMs - entryMs) < LOGIN_SESSION_MS;
  });
}

export function applyLoginEvent(existing, event) {
  const base = existing || defaultStudentAnalytics();
  const { at, sessionId, success = true, userAgent = "" } = event;
  if (!success) return base;

  if (isDuplicateSessionLogin(base.loginHistory, sessionId, at)) {
    return {
      ...base,
      lastActivityAt: at,
    };
  }

  const day = riyadhDateKey(at);
  const dailyLog = { ...(base.dailyLog || {}) };
  const dayRec = dailyLog[day] || {
    entered: false,
    pages: 0,
    activities: 0,
    firstAt: null,
    lastAt: null,
  };
  dayRec.entered = true;
  dayRec.firstAt = dayRec.firstAt || at;
  dayRec.lastAt = at;
  dailyLog[day] = dayRec;

  const entry = { at, sessionId: sessionId || null, success: true, userAgent };
  const loginHistory = [...(base.loginHistory || []), entry].slice(-100);

  return {
    ...base,
    loginCount: (base.loginCount || 0) + 1,
    lastLoginAt: at,
    firstLoginAt: base.firstLoginAt || at,
    lastActivityAt: at,
    dailyLog,
    loginHistory,
  };
}

function mergeDailyLog(a = {}, b = {}) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  const out = {};
  for (const key of keys) {
    const da = a[key] || {};
    const db = b[key] || {};
    out[key] = {
      entered: Boolean(da.entered || db.entered),
      pages: Math.max(da.pages || 0, db.pages || 0),
      activities: Math.max(da.activities || 0, db.activities || 0),
      firstAt: [da.firstAt, db.firstAt].filter(Boolean).sort()[0] || null,
      lastAt: [da.lastAt, db.lastAt].filter(Boolean).sort().pop() || null,
    };
  }
  return out;
}

function mergeLoginHistory(a = [], b = []) {
  const seen = new Set();
  const merged = [...a, ...b]
    .filter((entry) => {
      const key = `${entry.at}|${entry.sessionId || ""}|${entry.success}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((x, y) => new Date(x.at) - new Date(y.at))
    .slice(-100);
  return merged;
}

export function mergeAnalytics(remote, local) {
  if (!remote && !local) return defaultStudentAnalytics();
  if (!remote) return local;
  if (!local) return remote;

  const loginHistory = mergeLoginHistory(remote.loginHistory, local.loginHistory);
  const loginCount = Math.max(remote.loginCount || 0, local.loginCount || 0, loginHistory.filter((e) => e.success !== false).length);

  const pickLatest = (a, b) => {
    if (!a) return b || null;
    if (!b) return a;
    return new Date(a) >= new Date(b) ? a : b;
  };

  const pickEarliest = (a, b) => {
    if (!a) return b || null;
    if (!b) return a;
    return new Date(a) <= new Date(b) ? a : b;
  };

  return {
    ...defaultStudentAnalytics(),
    ...remote,
    ...local,
    loginCount,
    loginHistory,
    lastLoginAt: pickLatest(remote.lastLoginAt, local.lastLoginAt),
    firstLoginAt: pickEarliest(remote.firstLoginAt, local.firstLoginAt),
    lastActivityAt: pickLatest(remote.lastActivityAt, local.lastActivityAt),
    dailyLog: mergeDailyLog(remote.dailyLog, local.dailyLog),
    pythonRuns: Math.max(remote.pythonRuns || 0, local.pythonRuns || 0),
    lastPythonRunAt: pickLatest(remote.lastPythonRunAt, local.lastPythonRunAt),
    activitiesCompleted: Math.max(remote.activitiesCompleted || 0, local.activitiesCompleted || 0),
    teacherNotes: local.teacherNotes || remote.teacherNotes || "",
  };
}

export function applyActivityPatch(existing, patch) {
  const base = existing || defaultStudentAnalytics();
  const at = patch.lastActivityAt || new Date().toISOString();
  const dailyLog = mergeDailyLog(base.dailyLog, patch.dailyLog || {});

  if (patch.pageView) {
    const { path: pagePath } = patch.pageView;
    const pagesVisited = {
      ...(base.pagesVisited || {}),
      [pagePath]: Math.max(base.pagesVisited?.[pagePath] || 0, patch.pagesVisited?.[pagePath] || 1),
    };
    const pageViews = [...(base.pageViews || []), { path: pagePath, at }].slice(-200);
    return {
      ...base,
      lastActivityAt: at,
      dailyLog,
      pagesVisited,
      pageViews,
    };
  }

  return {
    ...base,
    ...patch,
    lastActivityAt: at,
    dailyLog,
  };
}
