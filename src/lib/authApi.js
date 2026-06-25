const API_BASE = import.meta.env.VITE_API_BASE || "";

/**
 * @template T
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<T>}
 */
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const err = new Error(data?.messageAr || "تعذّر الاتصال بالخادم.");
    err.status = res.status;
    err.code = data?.code;
    err.helpAr = data?.helpAr;
    err.payload = data;
    throw err;
  }

  return data;
}

export function fetchAuthMe() {
  return apiFetch("/api/auth/me");
}

export function heartbeatSession() {
  return apiFetch("/api/auth/heartbeat", { method: "POST" });
}

/** @param {string} nationalId */
export function loginStudentApi(nationalId) {
  return apiFetch("/api/auth/student/login", {
    method: "POST",
    body: JSON.stringify({ nationalId }),
  });
}

/** @param {string} username @param {string} password */
export function loginTeacherApi(username, password) {
  return apiFetch("/api/auth/teacher/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function logoutApi() {
  return apiFetch("/api/auth/logout", { method: "POST" });
}

export function fetchStudentSessions() {
  return apiFetch("/api/teacher/student-sessions");
}

/** @param {string} studentId */
export function revokeStudentSessionApi(studentId) {
  return apiFetch(`/api/teacher/students/${encodeURIComponent(studentId)}/sessions/revoke`, {
    method: "POST",
  });
}

/** @param {number} [limit] */
export function fetchSecurityLog(limit = 50) {
  return apiFetch(`/api/teacher/security-log?limit=${limit}`);
}
