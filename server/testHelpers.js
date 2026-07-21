/** Helpers for integration / security tests (cookie session auth + CSRF). */
import { getTestTeacherPassword } from "./auth/password.js";

export function testTeacherPassword() {
  return getTestTeacherPassword();
}

function allSetCookies(res) {
  if (typeof res.headers.getSetCookie === "function") {
    const arr = res.headers.getSetCookie();
    if (arr?.length) return arr;
  }
  const raw = res.headers.get("set-cookie");
  if (!raw) return [];
  return raw.split(/,(?=\s*platform_)/);
}

export function extractAuthCookies(res) {
  let session = "";
  let csrf = "";
  for (const part of allSetCookies(res)) {
    const sm = part.match(/platform_session=([^;]+)/);
    const cm = part.match(/platform_csrf=([^;]+)/);
    if (sm) session = decodeURIComponent(sm[1]);
    if (cm) csrf = decodeURIComponent(cm[1]);
  }
  const parts = [];
  if (session) parts.push(`platform_session=${encodeURIComponent(session)}`);
  if (csrf) parts.push(`platform_csrf=${encodeURIComponent(csrf)}`);
  return { cookie: parts.join("; "), csrf, session, csrfToken: csrf };
}

export async function loginStudent(baseUrl, nationalId) {
  const res = await fetch(`${baseUrl}/api/auth/student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nationalId }),
  });
  const body = await res.json();
  return { res, body, ...extractAuthCookies(res) };
}

export async function loginDemoStudent(baseUrl) {
  const res = await fetch(`${baseUrl}/api/auth/student-demo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const body = await res.json();
  return { res, body, ...extractAuthCookies(res) };
}

export async function loginTeacher(baseUrl, nationalId, password) {
  const res = await fetch(`${baseUrl}/api/auth/teacher`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nationalId, password }),
  });
  const body = await res.json();
  return { res, body, ...extractAuthCookies(res) };
}

export function authFetch(baseUrl, path, { cookie, csrf, ...options } = {}) {
  const headers = { ...(options.headers || {}) };
  if (!headers["Content-Type"] && options.body) headers["Content-Type"] = "application/json";
  if (cookie) headers.Cookie = cookie;
  const method = (options.method || "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD" && csrf) {
    headers["X-CSRF-Token"] = csrf;
  }
  return fetch(`${baseUrl}${path}`, { ...options, headers });
}
