import { Router } from "express";
import { findRosterUserById } from "../../src/data/studentsRoster.js";
import { attachSession, requireAuth, requireRole } from "../auth/middleware.js";
import {
  getSecurityAuditLog,
  listActiveStudentSessions,
  revokeAllSessionsForUser,
} from "../auth/sessionService.js";

const router = Router();

router.use(attachSession);
router.use(requireAuth);
router.use(requireRole("teacher"));

router.get("/student-sessions", (_req, res) => {
  const sessions = listActiveStudentSessions().map((s) => {
    const student = findRosterUserById(s.userId);
    return {
      sessionId: s.id,
      studentId: s.userId,
      studentName: student?.nameAr ?? "طالب",
      createdAt: s.createdAt,
      lastActivityAt: s.lastActivityAt,
      expiresAt: s.expiresAt,
    };
  });
  res.json({ ok: true, sessions });
});

router.post("/students/:studentId/sessions/revoke", (req, res) => {
  const studentId = req.params.studentId;
  const student = findRosterUserById(studentId);
  if (!student) {
    return res.status(404).json({ ok: false, messageAr: "الطالب غير موجود." });
  }
  const count = revokeAllSessionsForUser(studentId, "student", "admin_revoke", req.user.id);
  res.json({
    ok: true,
    revoked: count,
    messageAr:
      count > 0
        ? "تم إنهاء الجلسة النشطة. يمكن للطالب تسجيل الدخول من جهاز جديد."
        : "لا توجد جلسة نشطة لهذا الطالب.",
  });
});

router.get("/security-log", (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  res.json({ ok: true, events: getSecurityAuditLog(limit) });
});

export default router;
