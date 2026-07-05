import { requireAuth, requireRole, requireProgressAccess } from "../auth/middleware.js";
import {
  createAttempt,
  getActiveAttempt,
  getAttemptById,
  getLatestSubmittedAttempt,
  migratePreAssessmentToAttempt,
  saveAttemptProgress,
  submitAttempt,
  listAttemptsForTeacher,
} from "../repositories/quizAttemptRepository.js";
import { getStudentProgress } from "../repositories/progressRepository.js";
import {
  buildReviewPayload,
  getPublicQuizPayload,
  gradeAttempt,
  isServerBankQuiz,
} from "../quiz/quizService.js";

export function registerQuizRoutes(app, logError) {
  app.get("/api/quiz/:quizId/public", requireAuth, requireRole("student"), (req, res) => {
    try {
      const { quizId } = req.params;
      if (!isServerBankQuiz(quizId)) {
        return res.status(404).json({ ok: false, error: "not_server_quiz" });
      }
      const payload = getPublicQuizPayload(quizId);
      if (!payload) return res.status(404).json({ ok: false, error: "not_found" });
      res.json({ ok: true, ...payload });
    } catch (err) {
      logError("quiz.public", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/quiz/:quizId/attempt", requireAuth, requireRole("student"), (req, res) => {
    try {
      const studentId = req.auth.userId;
      const { quizId } = req.params;
      if (!isServerBankQuiz(quizId)) {
        return res.status(404).json({ ok: false, error: "not_server_quiz" });
      }

      let attempt = getActiveAttempt(studentId, quizId);
      if (!attempt && quizId === "quiz-pre") {
        const progress = getStudentProgress(studentId);
        const pre = progress?.preAssessment;
        if (pre) attempt = migratePreAssessmentToAttempt(studentId, pre);
      }
      if (!attempt) {
        const latestSubmitted = getLatestSubmittedAttempt(studentId, quizId);
        if (latestSubmitted) {
          return res.json({ ok: true, attempt: latestSubmitted });
        }
        attempt = createAttempt(studentId, quizId);
      }

      res.json({ ok: true, attempt });
    } catch (err) {
      logError("quiz.attempt.get", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.patch("/api/quiz/:quizId/attempt/:attemptId", requireAuth, requireRole("student"), (req, res) => {
    try {
      const studentId = req.auth.userId;
      const attemptId = Number(req.params.attemptId);
      const attempt = getAttemptById(attemptId);
      if (!attempt || attempt.studentId !== studentId) {
        return res.status(403).json({ ok: false, error: "forbidden" });
      }
      if (attempt.status === "submitted") {
        return res.status(409).json({ ok: false, error: "attempt_locked" });
      }
      const { answers, meta, status } = req.body || {};
      const saved = saveAttemptProgress(attemptId, { answers, meta, status });
      res.json({ ok: true, attempt: saved });
    } catch (err) {
      if (err.message === "attempt_locked") {
        return res.status(409).json({ ok: false, error: "attempt_locked" });
      }
      logError("quiz.attempt.patch", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/quiz/:quizId/attempt/:attemptId/submit", requireAuth, requireRole("student"), (req, res) => {
    try {
      const studentId = req.auth.userId;
      const { quizId, attemptId: rawId } = req.params;
      const attemptId = Number(rawId);
      const attempt = getAttemptById(attemptId);
      if (!attempt || attempt.studentId !== studentId || attempt.quizId !== quizId) {
        return res.status(403).json({ ok: false, error: "forbidden" });
      }
      if (attempt.status === "submitted") {
        return res.status(409).json({ ok: false, error: "already_submitted" });
      }

      const graded = gradeAttempt(quizId, attempt.answers);
      const result = {
        autoCorrect: graded.autoCorrect,
        autoTotal: graded.autoTotal,
        percent: graded.percent,
        passed: graded.passed,
        manualPending: graded.manualPending,
        submittedAt: new Date().toISOString(),
      };
      const saved = submitAttempt(attemptId, result);
      res.json({ ok: true, attempt: saved, result });
    } catch (err) {
      logError("quiz.attempt.submit", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/quiz/review/:attemptId", requireAuth, (req, res) => {
    try {
      const attemptId = Number(req.params.attemptId);
      const attempt = getAttemptById(attemptId);
      if (!attempt) return res.status(404).json({ ok: false, error: "not_found" });

      const isOwner = req.auth.role === "student" && attempt.studentId === req.auth.userId;
      const isTeacher = req.auth.role === "teacher";
      if (!isOwner && !isTeacher) {
        return res.status(403).json({ ok: false, error: "forbidden" });
      }
      if (attempt.status !== "submitted") {
        return res.status(403).json({ ok: false, error: "not_submitted" });
      }

      const review = buildReviewPayload(attempt.quizId, attempt.answers);
      res.json({
        ok: true,
        attemptId: attempt.id,
        quizId: attempt.quizId,
        status: attempt.status,
        submittedAt: attempt.submittedAt,
        ...review,
      });
    } catch (err) {
      logError("quiz.review", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/teacher/quiz-attempts", requireAuth, requireRole("teacher"), (req, res) => {
    try {
      const { quizId } = req.query;
      res.json({ ok: true, attempts: listAttemptsForTeacher(quizId || null) });
    } catch (err) {
      logError("quiz.teacher.list", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/quiz/:quizId/latest-review", requireAuth, requireRole("student"), (req, res) => {
    try {
      const studentId = req.auth.userId;
      const { quizId } = req.params;
      const attempt = getLatestSubmittedAttempt(studentId, quizId);
      if (!attempt) return res.status(404).json({ ok: false, error: "no_submitted_attempt" });
      res.json({ ok: true, attemptId: attempt.id });
    } catch (err) {
      logError("quiz.latest_review", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });
}
