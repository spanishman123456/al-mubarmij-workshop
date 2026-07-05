import { findStudentByNationalId, verifyTeacher, GENERIC_AUTH_ERROR } from "./users.js";
import {
  createSession,
  deleteSession,
  deleteSessionsForUser,
  logFailedLoginAttempt,
} from "./sessionRepository.js";
import {
  checkLoginRateLimit,
  recordLoginFailure,
  clearLoginAttempts,
  ensureRateLimitSchema,
} from "./rateLimit.js";
import {
  attachSession,
  setAuthCookies,
  clearAuthCookies,
  requireCsrfAndOrigin,
} from "./middleware.js";

function rotateSession(req, res, userId, role) {
  if (req.auth?.token) deleteSession(req.auth.token);
  deleteSessionsForUser(userId);
  const { token, csrfToken } = createSession(userId, role);
  setAuthCookies(res, token, csrfToken);
  return { token, csrfToken };
}

export function registerAuthRoutes(app, logError) {
  app.use("/api", attachSession);
  app.use("/api", requireCsrfAndOrigin);

  app.post("/api/auth/student", (req, res) => {
    try {
      const { nationalId } = req.body || {};
      const idKey = String(nationalId || "").replace(/\D/g, "").slice(-4) || "x";
      const rate = checkLoginRateLimit(req.ip, `stu:${idKey}`);
      if (!rate.allowed) {
        logFailedLoginAttempt({ ip: req.ip, reason: "rate_limited" });
        return res.status(429).json({ ok: false, error: GENERIC_AUTH_ERROR });
      }

      const student = findStudentByNationalId(nationalId);
      if (!student) {
        recordLoginFailure(req.ip, `stu:${idKey}`, "invalid_student");
        logFailedLoginAttempt({ ip: req.ip, reason: "invalid_student" });
        return res.status(401).json({ ok: false, error: GENERIC_AUTH_ERROR });
      }

      clearLoginAttempts(req.ip, `stu:${idKey}`);
      rotateSession(req, res, student.id, "student");
      res.json({ ok: true, user: { id: student.id, role: student.role, nameAr: student.nameAr } });
    } catch (err) {
      logError("auth.student", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/auth/teacher", (req, res) => {
    try {
      const { nationalId, password } = req.body || {};
      const idKey = String(nationalId || "").replace(/\D/g, "").slice(-4) || "x";
      const rate = checkLoginRateLimit(req.ip, `tch:${idKey}`);
      if (!rate.allowed) {
        logFailedLoginAttempt({ ip: req.ip, reason: "rate_limited" });
        return res.status(429).json({ ok: false, error: GENERIC_AUTH_ERROR });
      }

      const teacher = verifyTeacher(nationalId, password);
      if (!teacher) {
        recordLoginFailure(req.ip, `tch:${idKey}`, "invalid_teacher");
        logFailedLoginAttempt({ ip: req.ip, reason: "invalid_teacher" });
        return res.status(401).json({ ok: false, error: GENERIC_AUTH_ERROR });
      }

      clearLoginAttempts(req.ip, `tch:${idKey}`);
      rotateSession(req, res, teacher.id, "teacher");
      res.json({ ok: true, user: { id: teacher.id, role: teacher.role, nameAr: teacher.nameAr } });
    } catch (err) {
      logError("auth.teacher", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    if (req.auth?.token) deleteSession(req.auth.token);
    clearAuthCookies(res);
    res.json({ ok: true });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.auth?.userId) return res.status(401).json({ ok: false, error: "Unauthorized" });
    res.json({
      ok: true,
      user: { id: req.auth.userId, role: req.auth.role },
    });
  });
}

export { ensureRateLimitSchema };
