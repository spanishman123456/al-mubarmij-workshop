/**
 * تحليلات الحضور والتفاعل
 */

import { riyadhDateKey, formatRiyadhDateTime } from "./timezone.js";

export const LOGIN_SESSION_MS = 8 * 60 * 60 * 1000;
export const ONLINE_THRESHOLD_MS = 15 * 60 * 1000;
export const RECENTLY_ACTIVE_MS = 24 * 60 * 60 * 1000;

/** مفتاح اليوم بتوقيت الرياض (YYYY-MM-DD) */
export function todayKey(isoOrDate) {
  return riyadhDateKey(isoOrDate);
}

export function maskNationalId(nationalId) {
  const s = String(nationalId || "").replace(/\D/g, "");
  if (s.length < 4) return "****";
  return "*".repeat(Math.max(s.length - 4, 6)) + s.slice(-4);
}

export function formatLoginDateTime(iso) {
  if (!iso) return "لم يسجل الدخول";
  return formatRiyadhDateTime(iso) || "—";
}

function isDuplicateSessionLogin(history, sessionId, at) {
  if (!sessionId) return false;
  const atMs = new Date(at).getTime();
  return (history || []).some((entry) => {
    if (entry.sessionId !== sessionId || entry.success === false) return false;
    return Math.abs(atMs - new Date(entry.at).getTime()) < LOGIN_SESSION_MS;
  });
}

export function getPresenceStatus(analytics) {
  if (!analytics?.loginCount) {
    return { key: "never", label: "لم يسجل الدخول", color: "bg-slate-100 text-slate-700" };
  }
  const last = analytics.lastActivityAt || analytics.lastLoginAt;
  if (!last) {
    return { key: "logged_in", label: "سجّل الدخول سابقًا", color: "bg-violet-100 text-violet-800" };
  }
  const elapsed = Date.now() - new Date(last).getTime();
  if (elapsed <= ONLINE_THRESHOLD_MS) {
    return { key: "online", label: "متصل الآن", color: "bg-emerald-100 text-emerald-800" };
  }
  if (elapsed <= RECENTLY_ACTIVE_MS) {
    return { key: "recent", label: "نشط مؤخرًا", color: "bg-cyan-100 text-cyan-800" };
  }
  return { key: "offline", label: "غير متصل", color: "bg-slate-100 text-slate-600" };
}

export function getAccountStatus(analytics) {
  if (!analytics?.loginCount) return { key: "never", label: "لم يسجل الدخول بعد" };
  const last = analytics.lastActivityAt || analytics.lastLoginAt;
  if (!last) return { key: "activated", label: "مفعّل" };
  const days = (Date.now() - new Date(last).getTime()) / 86400000;
  if (days <= 7) return { key: "active", label: "نشط" };
  return { key: "inactive", label: "غير نشط" };
}

export function getAttendanceStatus(analytics, stats) {
  const today = todayKey();
  const daily = analytics?.dailyLog?.[today];
  if (!daily?.entered) {
    return { key: "absent", label: "غائب", color: "bg-red-100 text-red-800" };
  }
  const pages = daily.pages || 0;
  const acts = (analytics?.activitiesCompleted || 0) + (stats?.completedDays || 0);
  const sims = Object.values(analytics?.simRuns || {}).reduce((a, b) => a + b, 0);
  if (pages >= 4 || acts >= 2 || sims >= 2) {
    return { key: "present_active", label: "حاضر ومتفاعل", color: "bg-emerald-100 text-emerald-800" };
  }
  if (pages >= 1) {
    return { key: "present_low", label: "حاضر بتفاعل منخفض", color: "bg-amber-100 text-amber-800" };
  }
  if ((stats?.overallPercent ?? 0) < 20) {
    return { key: "needs_followup", label: "يحتاج متابعة", color: "bg-orange-100 text-orange-800" };
  }
  return { key: "present_low", label: "حاضر بتفاعل منخفض", color: "bg-amber-100 text-amber-800" };
}

export function defaultAnalytics() {
  return {
    loginCount: 0,
    lastLoginAt: null,
    firstLoginAt: null,
    lastActivityAt: null,
    totalSessionMs: 0,
    loginHistory: [],
    pageViews: [],
    pagesVisited: {},
    activitiesStarted: 0,
    activitiesCompleted: 0,
    simRuns: {},
    pythonRuns: 0,
    drillAttempts: {},
    dailyLog: {},
    teacherNotes: "",
  };
}

/**
 * تسجيل دخول ناجح — لا يُستدعى إلا عند submit نموذج الدخول.
 * @param {{ sessionId?: string }} options
 */
export function recordLogin(analytics, { sessionId } = {}) {
  const now = new Date().toISOString();
  const history = analytics.loginHistory || [];

  if (isDuplicateSessionLogin(history, sessionId, now)) {
    return {
      ...analytics,
      lastActivityAt: now,
    };
  }

  const today = todayKey(now);
  const daily = { ...(analytics.dailyLog || {}) };
  const day = daily[today] || { entered: false, pages: 0, activities: 0, firstAt: null, lastAt: null };
  day.entered = true;
  day.firstAt = day.firstAt || now;
  day.lastAt = now;
  daily[today] = day;

  const entry = {
    at: now,
    sessionId: sessionId || null,
    success: true,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 200) : "",
  };

  return {
    ...analytics,
    loginCount: (analytics.loginCount || 0) + 1,
    lastLoginAt: now,
    firstLoginAt: analytics.firstLoginAt || now,
    lastActivityAt: now,
    dailyLog: daily,
    loginHistory: [...history, entry].slice(-100),
  };
}

export function recordPageView(analytics, path) {
  const now = new Date().toISOString();
  const today = todayKey(now);
  const daily = { ...(analytics.dailyLog || {}) };
  const day = daily[today] || { entered: false, pages: 0, activities: 0, firstAt: null, lastAt: null };
  day.pages = (day.pages || 0) + 1;
  day.lastAt = now;
  if (day.entered) {
    day.firstAt = day.firstAt || now;
  }
  daily[today] = day;
  const pagesVisited = { ...(analytics.pagesVisited || {}), [path]: (analytics.pagesVisited?.[path] || 0) + 1 };
  const pageViews = [...(analytics.pageViews || []), { path, at: now }].slice(-200);
  return {
    ...analytics,
    lastActivityAt: now,
    dailyLog: daily,
    pagesVisited,
    pageViews,
  };
}

export function recordSimRun(analytics, simId) {
  const simRuns = { ...(analytics.simRuns || {}), [simId]: (analytics.simRuns?.[simId] || 0) + 1 };
  return { ...analytics, simRuns, lastActivityAt: new Date().toISOString() };
}

export function recordPythonRun(analytics) {
  return {
    ...analytics,
    pythonRuns: (analytics.pythonRuns || 0) + 1,
    lastActivityAt: new Date().toISOString(),
  };
}

export function recordActivityStart(analytics) {
  return {
    ...analytics,
    activitiesStarted: (analytics.activitiesStarted || 0) + 1,
    lastActivityAt: new Date().toISOString(),
  };
}

export function recordActivityComplete(analytics, activityId) {
  const completed = new Set(analytics.completedActivities || []);
  completed.add(activityId);
  return {
    ...analytics,
    activitiesCompleted: (analytics.activitiesCompleted || 0) + 1,
    completedActivities: [...completed],
    lastActivityAt: new Date().toISOString(),
  };
}

export function mergeRemoteAnalytics(local, remote) {
  if (!remote) return local || defaultAnalytics();
  if (!local) return remote;

  const historyMap = new Map();
  for (const entry of [...(local.loginHistory || []), ...(remote.loginHistory || [])]) {
    const key = `${entry.at}|${entry.sessionId || ""}`;
    historyMap.set(key, entry);
  }
  const loginHistory = [...historyMap.values()].sort((a, b) => new Date(a.at) - new Date(b.at)).slice(-100);
  const successLogins = loginHistory.filter((e) => e.success !== false).length;

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

  const dailyKeys = new Set([
    ...Object.keys(local.dailyLog || {}),
    ...Object.keys(remote.dailyLog || {}),
  ]);
  const dailyLog = {};
  for (const key of dailyKeys) {
    const l = local.dailyLog?.[key] || {};
    const r = remote.dailyLog?.[key] || {};
    dailyLog[key] = {
      entered: Boolean(l.entered || r.entered),
      pages: Math.max(l.pages || 0, r.pages || 0),
      activities: Math.max(l.activities || 0, r.activities || 0),
      firstAt: pickEarliest(l.firstAt, r.firstAt),
      lastAt: pickLatest(l.lastAt, r.lastAt),
    };
  }

  return {
    ...defaultAnalytics(),
    ...local,
    ...remote,
    loginCount: Math.max(local.loginCount || 0, remote.loginCount || 0, successLogins),
    loginHistory,
    lastLoginAt: pickLatest(local.lastLoginAt, remote.lastLoginAt),
    firstLoginAt: pickEarliest(local.firstLoginAt, remote.firstLoginAt),
    lastActivityAt: pickLatest(local.lastActivityAt, remote.lastActivityAt),
    dailyLog,
    pythonRuns: Math.max(local.pythonRuns || 0, remote.pythonRuns || 0),
    activitiesCompleted: Math.max(local.activitiesCompleted || 0, remote.activitiesCompleted || 0),
    teacherNotes: local.teacherNotes || remote.teacherNotes || "",
  };
}

export function filterByLastLogin(students, filterKey) {
  if (!filterKey || filterKey === "all") return students;
  const now = Date.now();
  const day = 86400000;

  return students.filter(({ analytics }) => {
    const last = analytics?.lastLoginAt;
    if (filterKey === "never") return !analytics?.loginCount;
    if (!last) return false;
    const elapsed = now - new Date(last).getTime();
    if (filterKey === "today") return todayKey(last) === todayKey();
    if (filterKey === "week") return elapsed <= 7 * day;
    if (filterKey === "month") return elapsed <= 30 * day;
    return true;
  });
}
