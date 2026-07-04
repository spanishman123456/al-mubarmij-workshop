const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function apiUrl(path) {
  if (API_BASE) return `${API_BASE}${path}`;
  return path;
}

function logSyncError(scope, err, extra = {}) {
  console.error(`[analytics-sync:${scope}]`, err?.message || err, extra);
}

export function isAnalyticsApiEnabled() {
  if (typeof window === "undefined") return false;
  return true;
}

export async function reportLoginEvent(studentId, event) {
  try {
    const res = await fetch(apiUrl("/api/analytics/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, event }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return await res.json();
  } catch (err) {
    logSyncError("login", err, { studentId });
    return { ok: false, error: err.message };
  }
}

export async function reportActivityPatch(studentId, patch) {
  try {
    const res = await fetch(apiUrl("/api/analytics/activity"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, patch }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return await res.json();
  } catch (err) {
    logSyncError("activity", err, { studentId });
    return { ok: false, error: err.message };
  }
}

export async function fetchAllAnalytics() {
  try {
    const res = await fetch(apiUrl("/api/analytics/all"), { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return await res.json();
  } catch (err) {
    logSyncError("fetch-all", err);
    return { ok: false, error: err.message, analyticsByStudent: {} };
  }
}

export async function syncStudentAnalytics(studentId, analytics) {
  try {
    const res = await fetch(apiUrl("/api/analytics/sync"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, analytics }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return await res.json();
  } catch (err) {
    logSyncError("sync", err, { studentId });
    return { ok: false, error: err.message };
  }
}
