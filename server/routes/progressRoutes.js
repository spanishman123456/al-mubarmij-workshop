import { requireAuth, requireRole, requireProgressAccess } from "../auth/middleware.js";
import { STUDENTS_ROSTER } from "../../src/data/studentsRoster.js";
import {
  calculateStudentProgress,
  calculateStudentProgressDetails,
  recalculateAllStudentsProgress,
} from "../progress/progressCalculationService.js";
import { saveStudentProgress, getStudentProgress } from "../repositories/progressRepository.js";

export function registerProgressRoutes(app, logError) {
  app.get("/api/progress/me", requireAuth, requireRole("student"), (req, res) => {
    try {
      const computed = calculateStudentProgress(req.auth.userId, { reason: "api_me" });
      res.json({ ok: true, computed, fetchedAt: new Date().toISOString() });
    } catch (err) {
      logError("progress.me", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/progress/me/details", requireAuth, requireRole("student"), (req, res) => {
    try {
      const computed = calculateStudentProgressDetails(req.auth.userId, { reason: "api_me_details" });
      res.json({ ok: true, computed, fetchedAt: new Date().toISOString() });
    } catch (err) {
      logError("progress.me.details", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get(
    "/api/teacher/students/:studentId/progress",
    requireAuth,
    requireRole("teacher"),
    requireProgressAccess,
    (req, res) => {
      try {
        const computed = calculateStudentProgressDetails(req.params.studentId, {
          reason: "api_teacher_student",
        });
        res.json({ ok: true, computed, fetchedAt: new Date().toISOString() });
      } catch (err) {
        logError("progress.teacher.student", err);
        res.status(500).json({ ok: false, error: "failed" });
      }
    },
  );

  app.get("/api/progress/teacher/roster", requireAuth, requireRole("teacher"), (_req, res) => {
    try {
      const byStudent = {};
      for (const row of STUDENTS_ROSTER) {
        const studentId = `stu-${row.nationalId}`;
        byStudent[studentId] = calculateStudentProgress(studentId);
      }
      res.json({ ok: true, byStudent, fetchedAt: new Date().toISOString() });
    } catch (err) {
      logError("progress.teacher.roster", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/progress/recalculate", requireAuth, requireRole("teacher"), (req, res) => {
    try {
      const report = recalculateAllStudentsProgress({
        reason: req.body?.reason || "teacher_recalculate",
        persistSnapshot: req.body?.persistSnapshot !== false,
      });
      res.json({ ok: true, report });
    } catch (err) {
      logError("progress.recalculate", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/progress/sync", requireAuth, requireRole("student"), (req, res) => {
    try {
      const { progress } = req.body || {};
      const studentId = req.auth.userId;
      const existing = getStudentProgress(studentId);
      const merged = mergeProgressBlob(existing?.progress || {}, progress || {});
      saveStudentProgress(studentId, merged);
      const computed = calculateStudentProgress(studentId, {
        reason: "sync",
        previousPercent: existing?.progress?._computedProgress?.availableProgressPercent ?? null,
        persistSnapshot: true,
      });
      res.json({ ok: true, updatedAt: computed.calculatedAt, computed });
    } catch (err) {
      logError("progress.sync", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });
}

function mergeProgressBlob(server = {}, client = {}) {
  const pickLatestObject = (a, b) => {
    if (!a || Object.keys(a).length === 0) return b || {};
    if (!b || Object.keys(b).length === 0) return a || {};
    const aAt = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bAt = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bAt >= aAt ? { ...a, ...b } : { ...b, ...a };
  };

  const completedDays = [...new Set([...(server.completedDays || []), ...(client.completedDays || [])])];
  const worksheetStatus = { ...(server.worksheetStatus || {}), ...(client.worksheetStatus || {}) };
  const worksheetAnswers = { ...(server.worksheetAnswers || {}), ...(client.worksheetAnswers || {}) };
  const quizScores = { ...(server.quizScores || {}), ...(client.quizScores || {}) };
  const drillResults = { ...(server.drillResults || {}), ...(client.drillResults || {}) };
  const microbitProjects = { ...(server.microbitProjects || {}), ...(client.microbitProjects || {}) };

  const merged = {
    ...server,
    ...client,
    completedDays,
    worksheetStatus,
    worksheetAnswers,
    quizScores,
    drillResults,
    microbitProjects,
    preAssessment: pickLatestObject(server.preAssessment, client.preAssessment),
    project: pickLatestObject(server.project, client.project),
    pythonSnippets: [...(server.pythonSnippets || []), ...(client.pythonSnippets || [])].slice(0, 50),
    graphicProjects: [...(server.graphicProjects || []), ...(client.graphicProjects || [])].slice(0, 50),
    updatedAt: new Date().toISOString(),
  };

  delete merged._computedProgress;
  return merged;
}
