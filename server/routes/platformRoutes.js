import {
  getOnboardingStatus,
  saveBingoProgress,
  saveAgreement,
  savePreAssessmentProgress,
  getAllOnboardingSummary,
} from "../repositories/onboardingRepository.js";
import {
  getStudentProgress,
  saveLessonProgress,
  recordLessonAttempt,
  getLessonProgressAll,
  getTeacherLessonSummary,
} from "../repositories/progressRepository.js";
import { requireAuth, requireRole, requireProgressAccess } from "../auth/middleware.js";
import { rejectUnpublishedLessonProgress } from "../auth/publishedContent.js";
import {
  getPlatformSettings,
  setPythonCodeAssist,
} from "../repositories/platformSettingsRepository.js";

export function registerPlatformRoutes(app, logError) {
  app.get("/api/onboarding/status/:studentId", requireAuth, requireProgressAccess, (req, res) => {
    try {
      const sid = req.params.studentId;
      if (req.auth.role === "student" && sid !== req.auth.userId) {
        return res.status(403).json({ ok: false, error: "Forbidden" });
      }
      res.json({ ok: true, ...getOnboardingStatus(sid) });
    } catch (err) {
      logError("onboarding.status", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/onboarding/bingo", requireAuth, requireRole("student"), (req, res) => {
    try {
      const studentId = req.auth.userId;
      const { cells, status, startedAt, completedAt, submittedAt } = req.body || {};
      const result = saveBingoProgress(studentId, { cells, status, startedAt, completedAt, submittedAt });
      console.info(
        JSON.stringify({
          scope: "onboarding.bingo",
          event: "save_ok",
          studentId,
          path: "/api/onboarding/bingo",
          status: status || "in_progress",
          at: new Date().toISOString(),
        }),
      );
      res.json({ ok: true, ...result });
    } catch (err) {
      logError("onboarding.bingo", err, { studentId: req.auth?.userId, path: "/api/onboarding/bingo" });
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/onboarding/pre-assessment", requireAuth, requireRole("student"), (req, res) => {
    try {
      const studentId = req.auth.userId;
      const { answers, status, totalQuestions, defer, result } = req.body || {};
      const onboarding = savePreAssessmentProgress(studentId, {
        answers,
        status,
        totalQuestions,
        defer: Boolean(defer),
        result,
      });
      console.info(
        JSON.stringify({
          scope: "onboarding.pre_assessment",
          event: defer ? "deferred" : status || "save",
          studentId,
          path: "/api/onboarding/pre-assessment",
          at: new Date().toISOString(),
        }),
      );
      res.json({ ok: true, ...onboarding });
    } catch (err) {
      logError("onboarding.pre_assessment", err, {
        studentId: req.auth?.userId,
        path: "/api/onboarding/pre-assessment",
      });
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/onboarding/agreement", requireAuth, requireRole("student"), (req, res) => {
    try {
      const studentId = req.auth.userId;
      const { docType, version, signatureText, payload } = req.body || {};
      if (!docType || !signatureText) {
        return res.status(400).json({ ok: false, error: "docType, signatureText required" });
      }
      const result = saveAgreement(studentId, {
        docType,
        version,
        signatureText,
        payload,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
      res.json({ ok: true, ...result });
    } catch (err) {
      logError("onboarding.agreement", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/onboarding/all", requireAuth, requireRole("teacher"), (_req, res) => {
    try {
      res.json({ ok: true, ...getAllOnboardingSummary(), fetchedAt: new Date().toISOString() });
    } catch (err) {
      logError("onboarding.all", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/progress/:studentId", requireAuth, requireProgressAccess, (req, res) => {
    try {
      const studentId = req.params.studentId;
      const data = getStudentProgress(studentId);
      res.json({ ok: true, data, lessons: getLessonProgressAll(studentId) });
    } catch (err) {
      logError("progress.get", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/lesson/progress", requireAuth, requireRole("student"), rejectUnpublishedLessonProgress, (req, res) => {
    try {
      const { lessonId, sectionId, progress, completed } = req.body || {};
      if (!lessonId) return res.status(400).json({ ok: false, error: "lessonId required" });
      saveLessonProgress(req.auth.userId, lessonId, sectionId, progress, completed);
      res.json({ ok: true });
    } catch (err) {
      logError("lesson.progress", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/lesson/attempt", requireAuth, requireRole("student"), rejectUnpublishedLessonProgress, (req, res) => {
    try {
      const { lessonId, exerciseId, answer, correct, hintsUsed, errorType, durationMs } = req.body || {};
      if (!lessonId || !exerciseId) {
        return res.status(400).json({ ok: false, error: "missing fields" });
      }
      recordLessonAttempt(req.auth.userId, {
        lessonId,
        exerciseId,
        answer,
        correct,
        hintsUsed,
        errorType,
        durationMs,
      });
      res.json({ ok: true });
    } catch (err) {
      logError("lesson.attempt", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/lesson/summary", requireAuth, requireRole("teacher"), (_req, res) => {
    try {
      res.json({ ok: true, summary: getTeacherLessonSummary() });
    } catch (err) {
      logError("lesson.summary", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/platform/settings/public", requireAuth, (_req, res) => {
    try {
      res.json({ ok: true, ...getPlatformSettings() });
    } catch (err) {
      logError("platform.settings.public", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.put("/api/platform/settings/python-assist", requireAuth, requireRole("teacher"), (req, res) => {
    try {
      const { mode } = req.body || {};
      const settings = setPythonCodeAssist(mode);
      res.json({ ok: true, ...settings });
    } catch (err) {
      if (err.message === "invalid_mode") {
        return res.status(400).json({ ok: false, error: "invalid_mode" });
      }
      logError("platform.settings.python-assist", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });
}
