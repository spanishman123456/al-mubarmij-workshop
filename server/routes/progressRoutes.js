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
import { queryAll } from "../db/query.js";

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

  app.get("/api/teacher/python-snippets/audit", requireAuth, requireRole("teacher"), (_req, res) => {
    try {
      const rows = queryAllStudentProgressRows();
      const report = buildPythonSnippetsAudit(rows);
      res.json({ ok: true, report, fetchedAt: new Date().toISOString() });
    } catch (err) {
      logError("progress.teacher.snippetAudit", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.delete(
    "/api/teacher/students/:studentId/python-snippets/:snippetId",
    requireAuth,
    requireRole("teacher"),
    requireProgressAccess,
    (req, res) => {
      try {
        const studentId = req.effectiveStudentId || req.params.studentId;
        const snippetId = String(req.params.snippetId || "").trim();
        if (!snippetId) return res.status(400).json({ ok: false, error: "missing_snippet_id" });
        const row = getStudentProgress(studentId);
        const progress = row?.progress || {};
        const before = Array.isArray(progress.pythonSnippets) ? progress.pythonSnippets : [];
        const after = before.filter((s) => String(s?.id || "") !== snippetId);
        if (after.length === before.length) {
          return res.status(404).json({ ok: false, error: "snippet_not_found" });
        }
        saveStudentProgress(studentId, {
          ...progress,
          pythonSnippets: after,
          updatedAt: new Date().toISOString(),
        });
        res.json({
          ok: true,
          studentId,
          deletedSnippetId: snippetId,
          totalBefore: before.length,
          totalAfter: after.length,
        });
      } catch (err) {
        logError("progress.teacher.deleteSnippet", err);
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

  const mergeSnippetArrays = (serverList = [], clientList = []) => {
    const byKey = new Map();
    const toTs = (v) => {
      const n = Date.parse(v || "");
      return Number.isFinite(n) ? n : 0;
    };
    const keyFor = (s) =>
      String(s?.id || "").trim() ||
      `${s?.title || ""}|${s?.lessonId || ""}|${s?.activityId || ""}|${s?.at || ""}|${s?.updatedAt || ""}`;
    const pickBetter = (a, b) => {
      if (!a) return b;
      if (!b) return a;
      const aCode = String(a.code || "").trim();
      const bCode = String(b.code || "").trim();
      if (!aCode && bCode) return b;
      if (aCode && !bCode) return a;
      const aTs = Math.max(toTs(a.updatedAt), toTs(a.at));
      const bTs = Math.max(toTs(b.updatedAt), toTs(b.at));
      return bTs >= aTs ? { ...a, ...b } : { ...b, ...a };
    };
    for (const s of [...(serverList || []), ...(clientList || [])]) {
      const key = keyFor(s);
      byKey.set(key, pickBetter(byKey.get(key), s));
    }
    return [...byKey.values()].sort((a, b) => {
      const aTs = Math.max(toTs(a.updatedAt), toTs(a.at));
      const bTs = Math.max(toTs(b.updatedAt), toTs(b.at));
      return bTs - aTs;
    });
  };

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
    pythonSnippets: mergeSnippetArrays(server.pythonSnippets || [], client.pythonSnippets || []),
    graphicProjects: mergeSnippetArrays(server.graphicProjects || [], client.graphicProjects || []),
    updatedAt: new Date().toISOString(),
  };

  delete merged._computedProgress;
  return merged;
}

function queryAllStudentProgressRows() {
  const byId = new Map();
  for (const student of STUDENTS_ROSTER) {
    byId.set(`stu-${student.nationalId}`, student.nameAr);
  }
  const rows = queryAll(`SELECT student_id, progress_json, updated_at FROM student_progress`);
  return rows.map((row) => {
    let progress = {};
    try {
      progress = JSON.parse(row.progress_json || "{}");
    } catch {
      progress = {};
    }
    return {
      studentId: row.student_id || "",
      studentNameAr: byId.get(row.student_id || "") || "طالب غير معروف",
      progress,
      updatedAt: row.updated_at || null,
    };
  });
}

function buildPythonSnippetsAudit(rows = []) {
  const detail = [];
  let studentsWithCodes = 0;
  let totalSnippets = 0;
  let snippetsWithCodeText = 0;
  let emptyCodeSnippets = 0;
  let titleOnlySnippets = 0;
  let missingStudentLink = 0;
  let missingActivityOrLesson = 0;
  let potentialDataCorruption = false;

  for (const row of rows) {
    const snippets = Array.isArray(row.progress?.pythonSnippets) ? row.progress.pythonSnippets : [];
    if (snippets.length > 0) studentsWithCodes += 1;
    let rowWithCode = 0;
    let rowEmpty = 0;
    for (const snippet of snippets) {
      totalSnippets += 1;
      const code = String(snippet?.code || "");
      const hasCode = code.trim().length > 0;
      if (hasCode) {
        snippetsWithCodeText += 1;
        rowWithCode += 1;
      } else {
        emptyCodeSnippets += 1;
        rowEmpty += 1;
        if (String(snippet?.title || "").trim()) titleOnlySnippets += 1;
      }
      if (!row.studentId) missingStudentLink += 1;
      const hasLesson = String(snippet?.lessonId || "").trim().length > 0;
      const hasActivity = String(snippet?.activityId || "").trim().length > 0;
      if (!hasLesson || !hasActivity) missingActivityOrLesson += 1;
    }
    if (snippets.length > 0) {
      detail.push({
        studentId: row.studentId,
        studentNameAr: row.studentNameAr,
        totalSnippets: snippets.length,
        snippetsWithCodeText: rowWithCode,
        emptyCodeSnippets: rowEmpty,
        updatedAt: row.updatedAt,
      });
    }
  }
  if (emptyCodeSnippets > 0 || missingStudentLink > 0) potentialDataCorruption = true;
  detail.sort((a, b) => b.totalSnippets - a.totalSnippets);
  return {
    studentsWithCodes,
    totalSnippets,
    snippetsWithCodeText,
    emptyCodeSnippets,
    titleOnlySnippets,
    missingStudentLink,
    missingActivityOrLesson,
    potentialDataCorruption,
    perStudent: detail,
  };
}
