import { requireAuth, requireRole } from "../auth/middleware.js";
import {
  assertStudentCanAccessWorksheet,
  getWorksheetById,
  listWorksheetsForStudent,
  listWorksheetsForTeacher,
} from "../worksheet/worksheetAccessService.js";
import { WORKSHEET_MODEL_ANSWERS } from "../../src/content/teacher/worksheetModelAnswers.js";

export function registerWorksheetRoutes(app, logError) {
  app.get("/api/worksheets", requireAuth, (req, res) => {
    try {
      if (req.auth.role === "teacher") {
        return res.json({ ok: true, role: "teacher", worksheets: listWorksheetsForTeacher() });
      }
      if (req.auth.role === "student") {
        return res.json({ ok: true, role: "student", worksheets: listWorksheetsForStudent(req.auth.userId) });
      }
      return res.status(403).json({ ok: false, error: "forbidden" });
    } catch (err) {
      logError("worksheets.list", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/worksheets/:worksheetId/access", requireAuth, requireRole("student"), (req, res) => {
    try {
      const ws = assertStudentCanAccessWorksheet(req.auth.userId, req.params.worksheetId);
      res.json({
        ok: true,
        worksheetId: ws.id,
        dayId: ws.dayId,
        titleAr: ws.titleAr,
        taskCount: ws.tasks.length,
      });
    } catch (err) {
      if (err.status === 403 || err.status === 404) {
        return res.status(err.status).json({ ok: false, error: err.message });
      }
      logError("worksheets.access", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/teacher/worksheets/:worksheetId/preview", requireAuth, requireRole("teacher"), (req, res) => {
    try {
      const ws = getWorksheetById(req.params.worksheetId);
      if (!ws) return res.status(404).json({ ok: false, error: "not_found" });
      const model = WORKSHEET_MODEL_ANSWERS[ws.id] || null;
      res.json({
        ok: true,
        mode: "teacher_preview",
        worksheetId: ws.id,
        dayId: ws.dayId,
        titleAr: ws.titleAr,
        introAr: ws.introAr,
        topicAr: ws.topicAr,
        tasks: ws.tasks,
        modelAnswers: model?.tasks ?? [],
        teacherAnswersRoute: model?.teacherDayRoute ?? null,
      });
    } catch (err) {
      logError("worksheets.teacher.preview", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });
}
