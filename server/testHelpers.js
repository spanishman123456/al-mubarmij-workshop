/** Helpers for integration / security tests (cookie session auth). */

export function extractSessionCookie(res) {
  const raw = res.headers.get("set-cookie") || "";
  const match = raw.match(/platform_session=([^;]+)/);
  return match ? `platform_session=${decodeURIComponent(match[1])}` : "";
}

export async function loginStudent(baseUrl, nationalId) {
  const res = await fetch(`${baseUrl}/api/auth/student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nationalId }),
  });
  const body = await res.json();
  return { res, body, cookie: extractSessionCookie(res) };
}

export async function loginTeacher(baseUrl, nationalId, password) {
  const res = await fetch(`${baseUrl}/api/auth/teacher`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nationalId, password }),
  });
  const body = await res.json();
  return { res, body, cookie: extractSessionCookie(res) };
}

export function authFetch(baseUrl, path, { cookie, ...options } = {}) {
  const headers = { ...(options.headers || {}) };
  if (cookie) headers.Cookie = cookie;
  return fetch(`${baseUrl}${path}`, { ...options, headers });
}
