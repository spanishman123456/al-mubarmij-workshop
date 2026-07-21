import { mutationHeaders } from "./csrfCookie.js";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function apiUrl(path) {
  if (API_BASE) return `${API_BASE}${path}`;
  return path;
}

const fetchOpts = { credentials: "include", cache: "no-store" };

function logSyncError(scope, err, extra = {}) {
  console.error(`[analytics-sync:${scope}]`, err?.message || err, extra);
}

export function isAnalyticsApiEnabled() {
  return typeof window !== "undefined";
}

export async function reportLoginEvent(_studentId, event) {
  try {
    const res = await fetch(apiUrl("/api/analytics/login"), {
      ...fetchOpts,
      method: "POST",
      headers: mutationHeaders(),
      body: JSON.stringify({ event }),
    });
    if (!res.ok) throw new Error(await res.text() || res.statusText);
    return await res.json();
  } catch (err) {
    logSyncError("login", err);
    return { ok: false, error: err.message };
  }
}

export async function reportActivityPatch(_studentId, patch) {
  try {
    const res = await fetch(apiUrl("/api/analytics/activity"), {
      ...fetchOpts,
      method: "POST",
      headers: mutationHeaders(),
      body: JSON.stringify({ patch }),
    });
    if (!res.ok) throw new Error(await res.text() || res.statusText);
    return await res.json();
  } catch (err) {
    logSyncError("activity", err);
    return { ok: false, error: err.message };
  }
}

export async function fetchAllAnalytics() {
  try {
    const res = await fetch(apiUrl("/api/analytics/all"), fetchOpts);
    if (!res.ok) throw new Error(await res.text() || res.statusText);
    return await res.json();
  } catch (err) {
    logSyncError("fetch-all", err);
    return { ok: false, error: err.message, analyticsByStudent: {} };
  }
}

export async function syncStudentAnalytics(_studentId, analytics) {
  try {
    const res = await fetch(apiUrl("/api/analytics/sync"), {
      ...fetchOpts,
      method: "POST",
      headers: mutationHeaders(),
      body: JSON.stringify({ analytics }),
    });
    if (!res.ok) throw new Error(await res.text() || res.statusText);
    return await res.json();
  } catch (err) {
    logSyncError("sync", err);
    return { ok: false, error: err.message };
  }
}
