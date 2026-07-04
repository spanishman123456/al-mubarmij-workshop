import {
  getOnboardingStatus,
  saveBingoProgress,
  saveAgreement,
  getAllOnboardingSummary,
} from "../repositories/onboardingRepository.js";
import {
  saveStudentProgress,
  getStudentProgress,
  saveLessonProgress,
  recordLessonAttempt,
  getLessonProgressAll,
  getTeacherLessonSummary,
} from "../repositories/progressRepository.js";

export function registerPlatformRoutes(app, logError) {
  app.get("/api/onboarding/status/:studentId", (req, res) => {
    try {
      res.json({ ok: true, ...getOnboardingStatus(req.params.studentId) });
    } catch (err) {
      logError("onboarding.status", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/onboarding/bingo", (req, res) => {
    try {
      const { studentId, cells, status, startedAt, completedAt, submittedAt } = req.body || {};
      if (!studentId) return res.status(400).json({ ok: false, error: "studentId required" });
      const result = saveBingoProgress(studentId, { cells, status, startedAt, completedAt, submittedAt });
      res.json({ ok: true, ...result });
    } catch (err) {
      logError("onboarding.bingo", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/onboarding/agreement", (req, res) => {
    try {
      const { studentId, docType, version, signatureText, payload } = req.body || {};
      if (!studentId || !docType || !signatureText) {
        return res.status(400).json({ ok: false, error: "studentId, docType, signatureText required" });
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

  app.get("/api/onboarding/all", (_req, res) => {
    try {
      res.json({ ok: true, ...getAllOnboardingSummary(), fetchedAt: new Date().toISOString() });
    } catch (err) {
      logError("onboarding.all", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/progress/:studentId", (req, res) => {
    try {
      const data = getStudentProgress(req.params.studentId);
      res.json({ ok: true, data, lessons: getLessonProgressAll(req.params.studentId) });
    } catch (err) {
      logError("progress.get", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/progress/sync", (req, res) => {
    try {
      const { studentId, progress } = req.body || {};
      if (!studentId) return res.status(400).json({ ok: false, error: "studentId required" });
      const result = saveStudentProgress(studentId, progress);
      res.json({ ok: true, ...result });
    } catch (err) {
      logError("progress.sync", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/lesson/progress", (req, res) => {
    try {
      const { studentId, lessonId, sectionId, progress, completed } = req.body || {};
      if (!studentId || !lessonId) return res.status(400).json({ ok: false, error: "studentId and lessonId required" });
      saveLessonProgress(studentId, lessonId, sectionId, progress, completed);
      res.json({ ok: true });
    } catch (err) {
      logError("lesson.progress", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/lesson/attempt", (req, res) => {
    try {
      const { studentId, lessonId, exerciseId, answer, correct, hintsUsed, errorType, durationMs } = req.body || {};
      if (!studentId || !lessonId || !exerciseId) {
        return res.status(400).json({ ok: false, error: "missing fields" });
      }
      recordLessonAttempt(studentId, { lessonId, exerciseId, answer, correct, hintsUsed, errorType, durationMs });
      res.json({ ok: true });
    } catch (err) {
      logError("lesson.attempt", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/lesson/summary", (_req, res) => {
    try {
      res.json({ ok: true, summary: getTeacherLessonSummary() });
    } catch (err) {
      logError("lesson.summary", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });
}
