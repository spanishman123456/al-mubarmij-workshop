import { requireAuth, requireRole, requireProgressAccess } from "../auth/middleware.js";
import { STUDENTS_ROSTER } from "../../src/data/studentsRoster.js";
import {
  calculateStudentProgress,
  calculateStudentProgressDetails,
  recalculateAllStudentsProgress,
} from "../progress/progressCalculationService.js";
import { saveStudentProgress, getStudentProgress } from "../repositories/progressRepository.js";
import {
  completeStudentDay,
  getStudentDayUnlockStatus,
  teacherUnlockDayForStudent,
} from "../progress/dayUnlockService.js";
import { filterWorksheetProgressForStudent } from "../worksheet/worksheetAccessService.js";
import { dayNumberFromId } from "../../src/lib/dayUnlockPolicy.js";
import { listDayUnlockOverrides } from "../repositories/dayUnlockRepository.js";

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

  app.get(
    "/api/teacher/students/:studentId/python-snippets",
    requireAuth,
    requireRole("teacher"),
    requireProgressAccess,
    (req, res) => {
      try {
        const studentId = req.effectiveStudentId || req.params.studentId;
        const row = getStudentProgress(studentId);
        const snippets = row?.progress?.pythonSnippets || [];
        res.json({ ok: true, studentId, snippets, fetchedAt: new Date().toISOString() });
      } catch (err) {
        logError("progress.teacher.studentSnippets", err);
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
      const sanitized = filterWorksheetProgressForStudent(studentId, merged);
      saveStudentProgress(studentId, sanitized);
      const computed = calculateStudentProgress(studentId, {
        reason: "sync",
        previousPercent: existing?.progress?._computedProgress?.availableProgressPercent ?? null,
        persistSnapshot: true,
      });
      res.json({ ok: true, updatedAt: computed.calculatedAt, computed, progress: sanitized });
    } catch (err) {
      logError("progress.sync", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/student/day-unlock", requireAuth, requireRole("student"), (req, res) => {
    try {
      const status = getStudentDayUnlockStatus(req.auth.userId);
      res.json({ ok: true, ...status });
    } catch (err) {
      logError("dayUnlock.status", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/student/day/:dayId/complete", requireAuth, requireRole("student"), (req, res) => {
    try {
      const result = completeStudentDay(req.auth.userId, req.params.dayId);
      const computed = calculateStudentProgress(req.auth.userId, {
        reason: "day_complete",
        persistSnapshot: true,
      });
      res.json({ ok: true, ...result, computed });
    } catch (err) {
      if (err.status === 403 || err.status === 400) {
        return res.status(err.status).json({
          ok: false,
          error: err.code || err.message,
          messageAr: err.message,
          incompleteItems: err.incompleteItems || [],
        });
      }
      logError("dayUnlock.complete", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post(
    "/api/teacher/students/:studentId/unlock-day",
    requireAuth,
    requireRole("teacher"),
    requireProgressAccess,
    (req, res) => {
      try {
        const dayNumber = Number(req.body?.dayNumber ?? dayNumberFromId(req.body?.dayId));
        if (!Number.isFinite(dayNumber) || dayNumber < 1) {
          return res.status(400).json({ ok: false, error: "invalid_day" });
        }
        const studentId = req.effectiveStudentId || req.params.studentId;
        if (!studentId) {
          return res.status(400).json({ ok: false, error: "missing_student" });
        }
        const result = teacherUnlockDayForStudent({
          studentId,
          dayNumber,
          teacherId: req.auth.userId,
          reason: req.body?.reason || "",
        });
        res.json({ ok: true, ...result });
      } catch (err) {
        if (err.status === 400) {
          return res.status(400).json({ ok: false, error: err.message });
        }
        logError("dayUnlock.teacherOverride", err);
        res.status(500).json({ ok: false, error: "failed" });
      }
    },
  );

  app.get(
    "/api/teacher/students/:studentId/unlock-log",
    requireAuth,
    requireRole("teacher"),
    requireProgressAccess,
    (req, res) => {
      try {
        const logs = listDayUnlockOverrides(req.params.studentId);
        res.json({ ok: true, logs });
      } catch (err) {
        logError("dayUnlock.log", err);
        res.status(500).json({ ok: false, error: "failed" });
      }
    },
  );
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
  const lessonCompletions = { ...(server.lessonCompletions || {}), ...(client.lessonCompletions || {}) };
  for (const [lessonId, entry] of Object.entries(client.lessonCompletions || {})) {
    const serverEntry = server.lessonCompletions?.[lessonId];
    if (!serverEntry) {
      lessonCompletions[lessonId] = entry;
      continue;
    }
    const serverDone = serverEntry.status === "completed" || serverEntry.completedAt;
    const clientDone = entry.status === "completed" || entry.completedAt;
    lessonCompletions[lessonId] = clientDone || serverDone ? { ...serverEntry, ...entry, status: "completed" } : { ...serverEntry, ...entry };
  }

  const dayUnlockOverrides = [
    ...new Set([...(server.dayUnlockOverrides || []), ...(client.dayUnlockOverrides || [])]),
  ];
  const dayCompletionTimes = { ...(server.dayCompletionTimes || {}), ...(client.dayCompletionTimes || {}) };

  const merged = {
    ...server,
    ...client,
    completedDays,
    dayUnlockOverrides,
    dayCompletionTimes,
    worksheetStatus,
    worksheetAnswers,
    quizScores,
    drillResults,
    microbitProjects,
    lessonCompletions,
    preAssessment: pickLatestObject(server.preAssessment, client.preAssessment),
    project: pickLatestObject(server.project, client.project),
    pythonSnippets: [...(server.pythonSnippets || []), ...(client.pythonSnippets || [])].slice(0, 50),
    graphicProjects: [...(server.graphicProjects || []), ...(client.graphicProjects || [])].slice(0, 50),
    updatedAt: new Date().toISOString(),
  };

  delete merged._computedProgress;
  return merged;
}
