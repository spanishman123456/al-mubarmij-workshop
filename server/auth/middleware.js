import { getSession, logAccessDenied } from "./sessionRepository.js";
import { teacherCanAccessStudent } from "./users.js";

const COOKIE_NAME = "platform_session";

export function parseSessionToken(req) {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === COOKIE_NAME) return decodeURIComponent(rest.join("="));
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

/** Student may only access own id; teacher may access roster students */
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
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    maxAgeMs: 8 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  };
}
