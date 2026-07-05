import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { initDatabase, getDatabaseStatus } from "./db/index.js";
import {
  loadStore,
  saveStore,
  applyLoginEvent,
  applyActivityPatch,
  mergeAnalytics,
} from "./analyticsStore.js";
import { registerPlatformRoutes } from "./routes/platformRoutes.js";
import { registerAuthRoutes, ensureRateLimitSchema } from "./auth/authRoutes.js";
import { requireAuth, requireRole } from "./auth/middleware.js";
import { ensureSessionSchema } from "./auth/sessionRepository.js";
import { corsMiddleware } from "./auth/cors.js";
import { day03TeacherAnswers } from "../src/content/teacher/day03TeacherAnswers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "..", "dist");

export function getAppCommit() {
  if (process.env.APP_COMMIT_SHA) return process.env.APP_COMMIT_SHA;
  if (process.env.GIT_COMMIT) return process.env.GIT_COMMIT;
  if (process.env.RENDER_GIT_COMMIT) return process.env.RENDER_GIT_COMMIT;
  const gitDir = path.join(__dirname, "..", ".git");
  if (!existsSync(gitDir)) return "unknown";
  try {
    return execSync("git rev-parse --short HEAD", {
      encoding: "utf8",
      cwd: path.join(__dirname, ".."),
    }).trim();
  } catch {
    return "unknown";
  }
}

/** @deprecated use getAppCommit */
export function getGitCommit() {
  return getAppCommit();
}

export function logError(scope, err, extra = {}) {
  console.error(JSON.stringify({ scope, message: err?.message || String(err), ...extra, at: new Date().toISOString() }));
}

export function createApp() {
  const app = express();
  app.use(corsMiddleware());
  app.use(express.json({ limit: "512kb" }));

  registerAuthRoutes(app, logError);

  app.get("/api/health", (_req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    if (isProd) {
      return res.json({ ok: true });
    }
    const dbStatus = getDatabaseStatus?.() || { ok: Boolean(globalThis.__platformDbReady) };
    res.json({
      ok: true,
      storage: "sqlite",
      database: { ok: dbStatus.ok, exists: dbStatus.exists },
      appCommit: getAppCommit(),
      contentVersion: process.env.CONTENT_VERSION || getAppCommit(),
      buildTime: process.env.BUILD_TIME || null,
      port: Number(process.env.PORT) || 3001,
    });
  });

  app.get("/api/teacher/day-03-answers", requireAuth, requireRole("teacher"), (_req, res) => {
    res.json({ ok: true, ...day03TeacherAnswers });
  });

  app.post("/api/analytics/login", requireAuth, requireRole("student"), (req, res) => {
    try {
      const studentId = req.auth.userId;
      const { event } = req.body || {};
      if (!event?.at) return res.status(400).json({ ok: false, error: "event.at required" });
      const store = loadStore();
      const current = store.analyticsByStudent[studentId];
      store.analyticsByStudent[studentId] = applyLoginEvent(current, event);
      saveStore(store);
      res.json({ ok: true, analytics: store.analyticsByStudent[studentId] });
    } catch (err) {
      logError("analytics.login", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/analytics/activity", requireAuth, requireRole("student"), (req, res) => {
    try {
      const studentId = req.auth.userId;
      const { patch } = req.body || {};
      const store = loadStore();
      store.analyticsByStudent[studentId] = applyActivityPatch(store.analyticsByStudent[studentId], patch || {});
      saveStore(store);
      res.json({ ok: true, analytics: store.analyticsByStudent[studentId] });
    } catch (err) {
      logError("analytics.activity", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/analytics/sync", requireAuth, requireRole("student"), (req, res) => {
    try {
      const studentId = req.auth.userId;
      const { analytics } = req.body || {};
      if (!analytics) return res.status(400).json({ ok: false, error: "analytics required" });
      const store = loadStore();
      store.analyticsByStudent[studentId] = mergeAnalytics(store.analyticsByStudent[studentId], analytics);
      saveStore(store);
      res.json({ ok: true, analytics: store.analyticsByStudent[studentId] });
    } catch (err) {
      logError("analytics.sync", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/analytics/all", requireAuth, requireRole("teacher"), (_req, res) => {
    try {
      const store = loadStore();
      res.json({ ok: true, analyticsByStudent: store.analyticsByStudent, fetchedAt: new Date().toISOString() });
    } catch (err) {
      logError("analytics.all", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  return app;
}

export async function prepareApp(app) {
  await initDatabase();
  ensureSessionSchema();
  ensureRateLimitSchema();
  globalThis.__platformDbReady = true;
  registerPlatformRoutes(app, logError);

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(DIST));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(DIST, "index.html"));
    });
  }
  return app;
}
