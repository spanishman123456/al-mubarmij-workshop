import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { initDatabase, getDatabaseStatus } from "./db/index.js";
import {
  loadStore,
  saveStore,
  applyLoginEvent,
  applyActivityPatch,
  mergeAnalytics,
} from "./analyticsStore.js";
import { registerPlatformRoutes } from "./routes/platformRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "..", "dist");

export function getGitCommit() {
  if (process.env.GIT_COMMIT) return process.env.GIT_COMMIT;
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8", cwd: path.join(__dirname, "..") }).trim();
  } catch {
    return "unknown";
  }
}

export function logError(scope, err, extra = {}) {
  console.error(JSON.stringify({ scope, message: err?.message || String(err), ...extra, at: new Date().toISOString() }));
}

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "512kb" }));

  app.get("/api/health", (_req, res) => {
    const dbStatus = getDatabaseStatus?.() || { ok: Boolean(globalThis.__platformDbReady) };
    res.json({
      ok: true,
      at: new Date().toISOString(),
      storage: "sqlite",
      database: dbStatus,
      commit: getGitCommit(),
      nodeEnv: process.env.NODE_ENV || "development",
      port: Number(process.env.PORT) || 3001,
    });
  });

  app.post("/api/analytics/login", (req, res) => {
    try {
      const { studentId, event } = req.body || {};
      if (!studentId || !event?.at) {
        return res.status(400).json({ ok: false, error: "studentId and event.at required" });
      }
      const store = loadStore();
      const current = store.analyticsByStudent[studentId];
      store.analyticsByStudent[studentId] = applyLoginEvent(current, event);
      saveStore(store);
      res.json({ ok: true, analytics: store.analyticsByStudent[studentId] });
    } catch (err) {
      logError("analytics.login", err, { studentId: req.body?.studentId });
      res.status(500).json({ ok: false, error: "failed to record login" });
    }
  });

  app.post("/api/analytics/activity", (req, res) => {
    try {
      const { studentId, patch } = req.body || {};
      if (!studentId) return res.status(400).json({ ok: false, error: "studentId required" });
      const store = loadStore();
      store.analyticsByStudent[studentId] = applyActivityPatch(store.analyticsByStudent[studentId], patch || {});
      saveStore(store);
      res.json({ ok: true, analytics: store.analyticsByStudent[studentId] });
    } catch (err) {
      logError("analytics.activity", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.post("/api/analytics/sync", (req, res) => {
    try {
      const { studentId, analytics } = req.body || {};
      if (!studentId || !analytics) return res.status(400).json({ ok: false, error: "missing fields" });
      const store = loadStore();
      store.analyticsByStudent[studentId] = mergeAnalytics(store.analyticsByStudent[studentId], analytics);
      saveStore(store);
      res.json({ ok: true, analytics: store.analyticsByStudent[studentId] });
    } catch (err) {
      logError("analytics.sync", err);
      res.status(500).json({ ok: false, error: "failed" });
    }
  });

  app.get("/api/analytics/all", (_req, res) => {
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
