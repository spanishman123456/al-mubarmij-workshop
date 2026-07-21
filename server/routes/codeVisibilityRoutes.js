import { requireAuth, requireRole } from "../auth/middleware.js";
import {
  getCodeVisibilityConfig,
  updateCodeVisibility,
  resetCodeVisibility,
  undoLastCodeVisibility,
  revertCodeVisibility,
  buildAllowedContent,
  previewAsStudent,
} from "../services/codeVisibilityService.js";

function serializeConfig(config) {
  return {
    ok: true,
    general: config.general,
    projects: config.projects,
    days: config.days,
    audit: config.audit,
    updatedBy: config.updatedBy,
    updatedAt: config.updatedAt,
    source: config.source,
  };
}

export function registerCodeVisibilityRoutes(app, logError) {
  // خريطة السياسة (بدون أي حل نموذجي) — قراءة عامة آمنة.
  app.get("/api/config/code-visibility", (_req, res) => {
    try {
      res.json(serializeConfig(getCodeVisibilityConfig()));
    } catch (err) {
      logError?.("codeVisibility.get", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.put("/api/config/code-visibility", requireAuth, requireRole("teacher"), (req, res) => {
    try {
      const updated = updateCodeVisibility(req.body || {}, req.auth.userId);
      res.json(serializeConfig(updated));
    } catch (err) {
      if (["invalid_scope", "missing_target", "invalid_level"].includes(err.message)) {
        return res.status(400).json({ ok: false, error: err.message });
      }
      logError?.("codeVisibility.put", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.delete("/api/config/code-visibility", requireAuth, requireRole("teacher"), (req, res) => {
    try {
      const updated = resetCodeVisibility(req.body || {}, req.auth.userId);
      res.json(serializeConfig(updated));
    } catch (err) {
      if (["invalid_scope", "missing_target"].includes(err.message)) {
        return res.status(400).json({ ok: false, error: err.message });
      }
      logError?.("codeVisibility.delete", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/config/code-visibility/revert", requireAuth, requireRole("teacher"), (req, res) => {
    try {
      const updated = revertCodeVisibility(req.auth.userId);
      res.json(serializeConfig(updated));
    } catch (err) {
      if (err.message === "nothing_to_undo") {
        return res.status(400).json({ ok: false, error: err.message });
      }
      logError?.("codeVisibility.revert", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/config/code-visibility/undo", requireAuth, requireRole("teacher"), (req, res) => {
    try {
      const updated = undoLastCodeVisibility(req.auth.userId);
      res.json(serializeConfig(updated));
    } catch (err) {
      if (err.message === "nothing_to_undo") {
        return res.status(400).json({ ok: false, error: err.message });
      }
      logError?.("codeVisibility.undo", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  // معاينة كطالب — للمعلم فقط، دون أي تأثير على التقدم.
  app.post("/api/config/code-visibility/preview", requireAuth, requireRole("teacher"), (req, res) => {
    try {
      const { mode, resourceId, attemptsCompleted, stepsCompleted } = req.body || {};
      if (!resourceId) return res.status(400).json({ ok: false, error: "missing_resource" });
      const content = previewAsStudent(mode === "console" ? "console" : "app", String(resourceId), {
        attemptsCompleted,
        stepsCompleted,
      });
      res.json({ ok: true, content });
    } catch (err) {
      logError?.("codeVisibility.preview", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  // المحتوى المسموح للطالب — الدور يؤخذ من الجلسة لا من رأس الطلب.
  app.get("/api/lab/:resourceId/allowed-content", requireAuth, (req, res) => {
    try {
      const mode = req.query.mode === "console" ? "console" : "app";
      const content = buildAllowedContent(mode, String(req.params.resourceId), {
        role: req.auth.role,
        attemptsCompleted: Number(req.query.attemptsCompleted) || 0,
        stepsCompleted: req.query.stepsCompleted === "true",
      });
      res.json({ ok: true, content });
    } catch (err) {
      logError?.("codeVisibility.allowedContent", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });
}
