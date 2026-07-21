import { mutationHeaders } from "./csrfCookie.js";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function url(path) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

async function requestJson(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers =
    method !== "GET" && method !== "HEAD"
      ? mutationHeaders({ ...(options.headers || {}) })
      : { ...(options.headers || {}) };
  const res = await fetch(url(path), {
    cache: "no-store",
    credentials: "include",
    headers,
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

/** خريطة السياسة الحالية (بدون حلول). */
export function fetchCodeVisibilityConfig() {
  return requestJson("/api/config/code-visibility");
}

/** تحديث مستوى نطاق (general | project | day). */
export function updateCodeVisibility({ scope, target, level, reason }) {
  return requestJson("/api/config/code-visibility", {
    method: "PUT",
    body: JSON.stringify({ scope, target, level, reason }),
  });
}

/** إعادة نطاق إلى الافتراضي. */
export function resetCodeVisibility({ scope, target, reason }) {
  return requestJson("/api/config/code-visibility", {
    method: "DELETE",
    body: JSON.stringify({ scope, target, reason }),
  });
}

/** استرجاع آخر إعداد سابق. */
export function revertCodeVisibility() {
  return requestJson("/api/config/code-visibility/revert", { method: "POST", body: "{}" });
}

/** التراجع عن آخر تغيير. */
export function undoCodeVisibility() {
  return requestJson("/api/config/code-visibility/undo", { method: "POST", body: "{}" });
}

/** معاينة كطالب لمورد محدّد (للمعلم فقط). */
export function previewCodeVisibility({ mode, resourceId, attemptsCompleted, stepsCompleted }) {
  return requestJson("/api/config/code-visibility/preview", {
    method: "POST",
    body: JSON.stringify({ mode, resourceId, attemptsCompleted, stepsCompleted }),
  });
}

/** المحتوى المسموح للمستخدم الحالي (الدور من الجلسة). */
export function fetchAllowedContent(resourceId, { mode = "app", attemptsCompleted = 0, stepsCompleted = false } = {}) {
  const params = new URLSearchParams({
    mode,
    attemptsCompleted: String(attemptsCompleted),
    stepsCompleted: String(stepsCompleted),
  });
  return requestJson(`/api/lab/${encodeURIComponent(resourceId)}/allowed-content?${params.toString()}`);
}
