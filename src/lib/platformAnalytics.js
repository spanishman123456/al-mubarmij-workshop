/**
 * تحليلات الحضور والتفاعل
 */

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function maskNationalId(nationalId) {
  const s = String(nationalId || "").replace(/\D/g, "");
  if (s.length < 4) return "****";
  return "*".repeat(Math.max(s.length - 4, 6)) + s.slice(-4);
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

export function recordLogin(analytics) {
  const now = new Date().toISOString();
  const today = todayKey();
  const daily = { ...(analytics.dailyLog || {}) };
  const day = daily[today] || { entered: false, pages: 0, activities: 0, firstAt: null, lastAt: null };
  day.entered = true;
  day.firstAt = day.firstAt || now;
  day.lastAt = now;
  daily[today] = day;
  return {
    ...analytics,
    loginCount: (analytics.loginCount || 0) + 1,
    lastLoginAt: now,
    firstLoginAt: analytics.firstLoginAt || now,
    lastActivityAt: now,
    dailyLog: daily,
  };
}

export function recordPageView(analytics, path) {
  const now = new Date().toISOString();
  const today = todayKey();
  const daily = { ...(analytics.dailyLog || {}) };
  const day = daily[today] || { entered: true, pages: 0, activities: 0, firstAt: now, lastAt: now };
  day.pages = (day.pages || 0) + 1;
  day.lastAt = now;
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
