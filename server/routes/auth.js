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
import { sendError, sendSuccess } from "../lib/apiResponse.js";

const router = Router();

router.use(attachSession);

router.get("/me", (req, res) => {
  if (!req.user || !req.session) {
    return sendSuccess(res, { user: null, session: null });
  }
  return sendSuccess(res, {
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
    return sendError(res, 401, {
      code: "SESSION_EXPIRED",
      messageAr: "انتهت الجلسة بسبب عدم النشاط. سجّل الدخول مجدداً.",
    });
  }
  return sendSuccess(res, {
    session: {
      lastActivityAt: session.lastActivityAt,
      expiresAt: session.expiresAt,
    },
  });
});

router.post("/student/login", (req, res) => {
  try {
    const nationalId = String(req.body?.nationalId || "").replace(/\D/g, "");
    if (!nationalId) {
      return sendError(res, 400, {
        code: "INVALID_INPUT",
        messageAr: "أدخل رقم الهوية الوطنية.",
      });
    }

    const row = findStudentByNationalId(nationalId);
    if (!row) {
      return sendError(res, 401, {
        code: "INVALID_CREDENTIALS",
        messageAr: "رقم الهوية غير مسجل في النظام.",
      });
    }

    const student = rosterStudentToUser(row);
    const result = createSession({ userId: student.id, userRole: "student", rejectIfActive: true });

    if (!result.ok) {
      const status = result.code === SESSION_CONFLICT ? 409 : 400;
      return sendError(res, status, {
        code: result.code === SESSION_CONFLICT ? "ACTIVE_SESSION_EXISTS" : result.code,
        messageAr: result.messageAr,
        helpAr:
          "هل نسيت تسجيل الخروج من جهاز آخر؟ تواصل مع المعلم أو مسؤول المنصة لإنهاء الجلسة السابقة.",
      });
    }

    setSessionCookie(res, result.token);
    return sendSuccess(res, {
      message: "تم تسجيل الدخول بنجاح",
      messageAr: "تم تسجيل الدخول بنجاح",
      user: publicUser(student),
      session: {
        id: result.session.id,
        createdAt: result.session.createdAt,
        lastActivityAt: result.session.lastActivityAt,
        expiresAt: result.session.expiresAt,
      },
    });
  } catch (err) {
    console.error("[auth/student/login]", err);
    return sendError(res, 500, {
      code: "SERVER_ERROR",
      messageAr: "تعذر تسجيل الدخول حاليًا. يرجى إعادة المحاولة.",
    });
  }
});

router.post("/teacher/login", async (req, res) => {
  try {
    const username = String(req.body?.username || "");
    const password = String(req.body?.password || "");
    const found = await findTeacher(username, password);
    if (!found) {
      return sendError(res, 401, {
        code: "INVALID_CREDENTIALS",
        messageAr: "بيانات الدخول غير صحيحة.",
      });
    }

    const result = createSession({ userId: found.id, userRole: "teacher", rejectIfActive: false });
    if (!result.ok) {
      return sendError(res, 400, {
        code: result.code || "SESSION_ERROR",
        messageAr: result.messageAr,
      });
    }

    setSessionCookie(res, result.token);
    return sendSuccess(res, {
      message: "تم تسجيل الدخول بنجاح",
      messageAr: "تم تسجيل الدخول بنجاح",
      user: publicUser(found),
      session: {
        id: result.session.id,
        createdAt: result.session.createdAt,
        lastActivityAt: result.session.lastActivityAt,
        expiresAt: result.session.expiresAt,
      },
    });
  } catch (err) {
    console.error("[auth/teacher/login]", err);
    return sendError(res, 500, {
      code: "SERVER_ERROR",
      messageAr: "تعذر تسجيل الدخول حاليًا. يرجى إعادة المحاولة.",
    });
  }
});

router.post("/logout", (req, res) => {
  const token = readSessionToken(req);
  revokeSessionByToken(token, "logout");
  clearSessionCookie(res);
  return sendSuccess(res, { messageAr: "تم تسجيل الخروج بنجاح." });
});

export default router;
