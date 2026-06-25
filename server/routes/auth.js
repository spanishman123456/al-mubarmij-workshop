import { Router } from "express";
import { findTeacher } from "../../src/data/demoUsers.js";
import { findStudentByNationalId, rosterStudentToUser } from "../../src/data/studentsRoster.js";
import {
  attachSession,
  clearSessionCookie,
  publicUser,
  readSessionToken,
  requireAuth,
  setSessionCookie,
} from "../auth/middleware.js";
import {
  createSession,
  revokeSessionByToken,
  SESSION_CONFLICT,
  touchSession,
} from "../auth/sessionService.js";

const router = Router();

router.use(attachSession);

router.get("/me", (req, res) => {
  if (!req.user || !req.session) {
    return res.json({ ok: true, user: null, session: null });
  }
  res.json({
    ok: true,
    user: publicUser(req.user),
    session: {
      id: req.session.id,
      createdAt: req.session.createdAt,
      lastActivityAt: req.session.lastActivityAt,
      expiresAt: req.session.expiresAt,
    },
  });
});

router.post("/heartbeat", requireAuth, (req, res) => {
  const token = readSessionToken(req);
  const session = touchSession(token);
  if (!session) {
    clearSessionCookie(res);
    return res.status(401).json({
      ok: false,
      code: "SESSION_EXPIRED",
      messageAr: "انتهت الجلسة بسبب عدم النشاط. سجّل الدخول مجدداً.",
    });
  }
  res.json({
    ok: true,
    session: {
      lastActivityAt: session.lastActivityAt,
      expiresAt: session.expiresAt,
    },
  });
});

router.post("/student/login", (req, res) => {
  const nationalId = String(req.body?.nationalId || "").replace(/\D/g, "");
  if (!nationalId) {
    return res.status(400).json({
      ok: false,
      messageAr: "أدخل رقم الهوية الوطنية.",
    });
  }

  const row = findStudentByNationalId(nationalId);
  if (!row) {
    return res.status(401).json({
      ok: false,
      messageAr: "رقم الهوية غير مسجل في النظام.",
    });
  }

  const student = rosterStudentToUser(row);
  const result = createSession({ userId: student.id, userRole: "student", rejectIfActive: true });

  if (!result.ok) {
    const status = result.code === SESSION_CONFLICT ? 409 : 400;
    return res.status(status).json({
      ok: false,
      code: result.code,
      messageAr: result.messageAr,
      helpAr:
        "هل نسيت تسجيل الخروج من جهاز آخر؟ تواصل مع المعلم أو مسؤول المنصة لإنهاء الجلسة السابقة.",
    });
  }

  setSessionCookie(res, result.token);
  res.json({
    ok: true,
    user: publicUser(student),
    session: {
      id: result.session.id,
      createdAt: result.session.createdAt,
      lastActivityAt: result.session.lastActivityAt,
      expiresAt: result.session.expiresAt,
    },
  });
});

router.post("/teacher/login", async (req, res) => {
  const username = String(req.body?.username || "");
  const password = String(req.body?.password || "");
  const found = await findTeacher(username, password);
  if (!found) {
    return res.status(401).json({
      ok: false,
      messageAr: "بيانات الدخول غير صحيحة.",
    });
  }

  const result = createSession({ userId: found.id, userRole: "teacher", rejectIfActive: false });
  if (!result.ok) {
    return res.status(400).json({ ok: false, messageAr: result.messageAr });
  }

  setSessionCookie(res, result.token);
  res.json({
    ok: true,
    user: publicUser(found),
    session: {
      id: result.session.id,
      createdAt: result.session.createdAt,
      lastActivityAt: result.session.lastActivityAt,
      expiresAt: result.session.expiresAt,
    },
  });
});

router.post("/logout", (req, res) => {
  const token = readSessionToken(req);
  revokeSessionByToken(token, "logout");
  clearSessionCookie(res);
  res.json({ ok: true, messageAr: "تم تسجيل الخروج بنجاح." });
});

export default router;
