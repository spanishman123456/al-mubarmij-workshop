import { requireAuth, requireRole } from "../auth/middleware.js";
import {
  getPublicationConfig,
  getPublicationStatusMap,
  publishDay,
  unpublishDay,
  updatePublicationConfig,
} from "../services/publicationConfigService.js";
import { buildTeacherPublicationSummary } from "../services/publicationSummaryService.js";

export function registerPublicationRoutes(app, logError) {
  app.get("/api/config/publication", (_req, res) => {
    try {
      const config = getPublicationConfig();
      res.json({
        ok: true,
        publishedDays: config.publishedDays,
        unlockPolicy: config.unlockPolicy,
        daySchedules: config.daySchedules,
        publicationStatus: getPublicationStatusMap(config),
        source: config.source,
        updatedBy: config.updatedBy,
        updatedAt: config.updatedAt,
      });
    } catch (err) {
      logError("publication.get", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.put("/api/config/publication", requireAuth, requireRole("teacher"), (req, res) => {
    try {
      const updated = updatePublicationConfig(req.body || {}, req.auth.userId);
      res.json({
        ok: true,
        publishedDays: updated.publishedDays,
        unlockPolicy: updated.unlockPolicy,
        daySchedules: updated.daySchedules,
        publicationStatus: getPublicationStatusMap(updated),
        source: updated.source,
        updatedBy: updated.updatedBy,
        updatedAt: updated.updatedAt,
      });
    } catch (err) {
      logError("publication.put", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/config/publication/publish-day", requireAuth, requireRole("teacher"), (req, res) => {
    try {
      const dayNumber = Number(req.body?.dayNumber);
      if (!Number.isFinite(dayNumber) || dayNumber < 1 || dayNumber > 15) {
        return res.status(400).json({ ok: false, error: "invalid_day" });
      }
      const updated = publishDay(dayNumber, req.auth.userId, { releaseAt: req.body?.releaseAt || null });
      res.json({
        ok: true,
        publishedDays: updated.publishedDays,
        unlockPolicy: updated.unlockPolicy,
        daySchedules: updated.daySchedules,
        publicationStatus: getPublicationStatusMap(updated),
        source: updated.source,
        updatedBy: updated.updatedBy,
        updatedAt: updated.updatedAt,
      });
    } catch (err) {
      logError("publication.publishDay", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/config/publication/unpublish-day", requireAuth, requireRole("teacher"), (req, res) => {
    try {
      const dayNumber = Number(req.body?.dayNumber);
      if (!Number.isFinite(dayNumber) || dayNumber < 1 || dayNumber > 15) {
        return res.status(400).json({ ok: false, error: "invalid_day" });
      }
      const updated = unpublishDay(dayNumber, req.auth.userId);
      res.json({
        ok: true,
        publishedDays: updated.publishedDays,
        unlockPolicy: updated.unlockPolicy,
        daySchedules: updated.daySchedules,
        publicationStatus: getPublicationStatusMap(updated),
        source: updated.source,
        updatedBy: updated.updatedBy,
        updatedAt: updated.updatedAt,
      });
    } catch (err) {
      logError("publication.unpublishDay", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/teacher/publication/summary", requireAuth, requireRole("teacher"), (_req, res) => {
    try {
      res.json({ ok: true, summary: buildTeacherPublicationSummary() });
    } catch (err) {
      logError("publication.summary", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });
}
