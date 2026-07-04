import { findStudentByNationalId, verifyTeacher } from "./users.js";
import { createSession, deleteSession } from "./sessionRepository.js";
import { attachSession, sessionCookieOptions } from "./middleware.js";

function setSessionCookie(res, token) {
  const opts = sessionCookieOptions();
  const parts = [
    `${opts.name}=${encodeURIComponent(token)}`,
    "HttpOnly",
    `Path=${opts.path}`,
    `Max-Age=${Math.floor(opts.maxAgeMs / 1000)}`,
    `SameSite=${opts.sameSite}`,
  ];
  if (opts.secure) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

function clearSessionCookie(res) {
  const opts = sessionCookieOptions();
  res.setHeader("Set-Cookie", `${opts.name}=; HttpOnly; Path=${opts.path}; Max-Age=0; SameSite=${opts.sameSite}`);
}

export function registerAuthRoutes(app, logError) {
  app.use("/api", attachSession);

  app.post("/api/auth/student", (req, res) => {
    try {
      const { nationalId } = req.body || {};
      const student = findStudentByNationalId(nationalId);
      if (!student) return res.status(401).json({ ok: false, error: "Invalid credentials" });
      const { token } = createSession(student.id, "student");
      setSessionCookie(res, token);
      res.json({ ok: true, user: student });
    } catch (err) {
      logError("auth.student", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/auth/teacher", (req, res) => {
    try {
      const { nationalId, password } = req.body || {};
      const teacher = verifyTeacher(nationalId, password);
      if (!teacher) return res.status(401).json({ ok: false, error: "Invalid credentials" });
      const { token } = createSession(teacher.id, "teacher");
      setSessionCookie(res, token);
      res.json({ ok: true, user: teacher });
    } catch (err) {
      logError("auth.teacher", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    if (req.auth?.token) deleteSession(req.auth.token);
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.auth?.userId) return res.status(401).json({ ok: false, error: "Unauthorized" });
    res.json({ ok: true, user: { id: req.auth.userId, role: req.auth.role } });
  });
}
