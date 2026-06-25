const API_BASE = import.meta.env.VITE_API_BASE || "";

export class AuthApiError extends Error {
  /** @param {string} message @param {string} [code] @param {{ helpAr?: string, status?: number }} [extra] */
  constructor(message, code = "AUTH_ERROR", extra = {}) {
    super(message);
    this.name = "AuthApiError";
    this.code = code;
    this.helpAr = extra.helpAr;
    this.status = extra.status;
  }
}

const GENERIC_AR =
  "تعذر تسجيل الدخول حاليًا. يرجى إعادة المحاولة، وإذا استمرت المشكلة فتواصل مع مسؤول المنصة.";

/** @param {unknown} message */
function isTechnicalMessage(message) {
  const msg = String(message || "");
  return /cannot read properties|typeerror|undefined|null|internal server error|syntaxerror|unexpected token/i.test(
    msg,
  );
}

/** @param {unknown} err @param {string} [fallback] */
export function toFriendlyAuthMessage(err, fallback = GENERIC_AR) {
  if (err instanceof AuthApiError) return err.message;
  const msg = err instanceof Error ? err.message : String(err || "");
  if (!msg || isTechnicalMessage(msg)) return fallback;
  return msg;
}

/**
 * @param {unknown} data
 * @param {{ requireUser?: boolean }} [opts]
 */
export function assertAuthSuccess(data, { requireUser = false } = {}) {
  if (data == null || typeof data !== "object") {
    throw new AuthApiError(GENERIC_AR, "INVALID_RESPONSE");
  }
  const success = data.success === true || data.ok === true;
  if (!success) {
    throw new AuthApiError(
      data.messageAr || data.message || GENERIC_AR,
      data.code || "AUTH_FAILED",
      { helpAr: data.helpAr },
    );
  }
  if (requireUser && (!data.user || typeof data.user !== "object" || !data.user.id)) {
    throw new AuthApiError(GENERIC_AR, "MISSING_USER");
  }
  return data;
}

/**
 * @template T
 * @param {string} path
 * @param {RequestInit & { requireUser?: boolean }} [options]
 * @returns {Promise<T>}
 */
async function apiFetch(path, options = {}) {
  const { requireUser = false, ...fetchOptions } = options;
  let res;

  try {
    res = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(fetchOptions.headers || {}),
      },
      ...fetchOptions,
    });
  } catch {
    throw new AuthApiError(
      "تعذر الاتصال بالخادم. تحقق من الإنترنت ثم أعد المحاولة.",
      "NETWORK_ERROR",
    );
  }

  const contentType = res.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message =
      data?.messageAr ||
      data?.message ||
      (res.status === 409
        ? "هذا الحساب مستخدم حاليًا على جهاز آخر."
        : res.status >= 500
          ? GENERIC_AR
          : "تعذر تسجيل الدخول. تحقق من البيانات وحاول مجدداً.");

    throw new AuthApiError(message, data?.code || `HTTP_${res.status}`, {
      helpAr: data?.helpAr,
      status: res.status,
    });
  }

  if (!contentType.includes("application/json") || data == null) {
    throw new AuthApiError(GENERIC_AR, "INVALID_RESPONSE");
  }

  return assertAuthSuccess(data, { requireUser });
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
    requireUser: true,
  });
}

/** @param {string} username @param {string} password */
export function loginTeacherApi(username, password) {
  return apiFetch("/api/auth/teacher/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    requireUser: true,
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

export async function checkAuthServiceAvailable() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return false;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) return false;
    const data = await res.json();
    return data?.ok === true || data?.success === true;
  } catch {
    return false;
  }
}
