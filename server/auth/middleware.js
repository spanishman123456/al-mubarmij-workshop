import { getSession, logAccessDenied } from "./sessionRepository.js";
import { teacherCanAccessStudent } from "./users.js";
import { isOriginAllowed } from "./cors.js";

const COOKIE_SESSION = "platform_session";
const COOKIE_CSRF = "platform_csrf";

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const CSRF_EXEMPT_PREFIX = "/api/auth/";

export function parseSessionToken(req) {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === COOKIE_SESSION) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function parseCsrfCookie(req) {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === COOKIE_CSRF) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function attachSession(req, _res, next) {
  const token = parseSessionToken(req);
  const session = getSession(token);
  req.auth = session ? { ...session, token } : null;
  next();
}

export function requireAuth(req, res, next) {
  if (!req.auth?.userId) {
    logAccessDenied({ ip: req.ip, path: req.path, reason: "no_session" });
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth?.userId) {
      logAccessDenied({ ip: req.ip, path: req.path, reason: "no_session" });
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
    if (!roles.includes(req.auth.role)) {
      logAccessDenied({ ip: req.ip, path: req.path, reason: "forbidden_role", userId: req.auth.userId });
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }
    next();
  };
}

export function requireCsrfAndOrigin(req, res, next) {
  if (!MUTATION_METHODS.has(req.method)) return next();

  if (req.headers.origin && !isOriginAllowed(req)) {
    logAccessDenied({ ip: req.ip, path: req.path, reason: "bad_origin", userId: req.auth?.userId });
    return res.status(403).json({ ok: false, error: "Forbidden" });
  }

  if (req.path.startsWith(CSRF_EXEMPT_PREFIX)) return next();
  if (!req.auth?.userId) return next();

  const headerToken = req.headers["x-csrf-token"];
  const cookieToken = parseCsrfCookie(req);
  const sessionToken = req.auth?.csrfToken;

  const valid =
    headerToken &&
    cookieToken &&
    sessionToken &&
    headerToken === cookieToken &&
    headerToken === sessionToken;

  if (!valid) {
    logAccessDenied({ ip: req.ip, path: req.path, reason: "csrf_invalid", userId: req.auth?.userId });
    return res.status(403).json({ ok: false, error: "Forbidden" });
  }
  next();
}

export function requireProgressAccess(req, res, next) {
  const targetId = req.params.studentId || req.body?.studentId;
  if (!req.auth?.userId) {
    logAccessDenied({ ip: req.ip, path: req.path, reason: "no_session" });
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  if (req.auth.role === "student") {
    if (targetId && targetId !== req.auth.userId) {
      logAccessDenied({
        ip: req.ip,
        path: req.path,
        reason: "idor_student",
        userId: req.auth.userId,
      });
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }
    req.effectiveStudentId = req.auth.userId;
    return next();
  }
  if (req.auth.role === "teacher") {
    if (targetId && !teacherCanAccessStudent(req.auth.userId, targetId)) {
      logAccessDenied({ ip: req.ip, path: req.path, reason: "teacher_scope", userId: req.auth.userId });
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }
    req.effectiveStudentId = targetId || null;
    return next();
  }
  return res.status(403).json({ ok: false, error: "Forbidden" });
}

export function sessionCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    sessionName: COOKIE_SESSION,
    csrfName: COOKIE_CSRF,
    path: "/",
    maxAgeMs: 8 * 60 * 60 * 1000,
    sameSite: "Lax",
    secure: isProd,
    httpOnlySession: true,
  };
}

export function buildSetCookie(name, value, { httpOnly, maxAgeMs }) {
  const opts = sessionCookieOptions();
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    httpOnly ? "HttpOnly" : "",
    `Path=${opts.path}`,
    `Max-Age=${Math.floor(maxAgeMs / 1000)}`,
    `SameSite=${opts.sameSite}`,
  ].filter(Boolean);
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}

export function setAuthCookies(res, sessionToken, csrfToken) {
  const opts = sessionCookieOptions();
  res.setHeader("Set-Cookie", [
    buildSetCookie(opts.sessionName, sessionToken, { httpOnly: true, maxAgeMs: opts.maxAgeMs }),
    buildSetCookie(opts.csrfName, csrfToken, { httpOnly: false, maxAgeMs: opts.maxAgeMs }),
  ]);
}

export function clearAuthCookies(res) {
  const opts = sessionCookieOptions();
  res.setHeader("Set-Cookie", [
    buildSetCookie(opts.sessionName, "", { httpOnly: true, maxAgeMs: 0 }),
    buildSetCookie(opts.csrfName, "", { httpOnly: false, maxAgeMs: 0 }),
  ]);
}
