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
import { registerProgressRoutes } from "./routes/progressRoutes.js";
import { registerQuizRoutes } from "./routes/quizRoutes.js";
import { registerWorksheetRoutes } from "./routes/worksheetRoutes.js";
import { registerAuthRoutes, ensureRateLimitSchema } from "./auth/authRoutes.js";
import { requireAuth, requireRole } from "./auth/middleware.js";
import { ensureSessionSchema } from "./auth/sessionRepository.js";
import { corsMiddleware } from "./auth/cors.js";
import { day03TeacherAnswers } from "../src/content/teacher/day03TeacherAnswers.js";
import { day04TeacherAnswers } from "../src/content/teacher/day04TeacherAnswers.js";
import { day05TeacherAnswers } from "../src/content/teacher/day05TeacherAnswers.js";
import { day06TeacherAnswers } from "../src/content/teacher/day06TeacherAnswers.js";
import { day07TeacherAnswers } from "../src/content/teacher/day07TeacherAnswers.js";
import { day08TeacherAnswers } from "../src/content/teacher/day08TeacherAnswers.js";
import { day09TeacherAnswers } from "../src/content/teacher/day09TeacherAnswers.js";
import { day10TeacherAnswers } from "../src/content/teacher/day10TeacherAnswers.js";
import { day11TeacherAnswers } from "../src/content/teacher/day11TeacherAnswers.js";
import { day12TeacherAnswers } from "../src/content/teacher/day12TeacherAnswers.js";
import { day13TeacherAnswers } from "../src/content/teacher/day13TeacherAnswers.js";
import { day14TeacherAnswers } from "../src/content/teacher/day14TeacherAnswers.js";
import { day15TeacherAnswers } from "../src/content/teacher/day15TeacherAnswers.js";
import { requirePublishedTeacherDay } from "./auth/publishedContent.js";
import { registerPublicationRoutes } from "./routes/publicationRoutes.js";
import { registerExportRoutes } from "./routes/exportRoutes.js";
import { registerSkuiTeacherRoutes } from "./routes/skuiTeacherRoutes.js";

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

export function createApp({ exportStore } = {}) {
  const app = express();
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }
  app.use(corsMiddleware());
  app.use("/api/exports", express.json({ limit: "18mb" }));
  app.use(express.json({ limit: "512kb" }));

  registerAuthRoutes(app, logError);
  registerExportRoutes(app, logError, exportStore);
  registerSkuiTeacherRoutes(app);

  app.use("/api/exports", (error, _req, res, _next) => {
    void _next;
    if (error?.type === "entity.too.large") {
      return res.status(413).json({
        ok: false,
        error: "request payload is too large",
        code: "PAYLOAD_TOO_LARGE",
      });
    }
    logError("exports.request", error);
    return res.status(400).json({ ok: false, error: "invalid request body", code: "INVALID_BODY" });
  });

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

  app.get(
    "/api/teacher/day-03-answers",
    requireAuth,
    requireRole("teacher"),
    requirePublishedTeacherDay(3),
    (_req, res) => {
      res.json({ ok: true, ...day03TeacherAnswers });
    },
  );

  app.get(
    "/api/teacher/day-04-answers",
    requireAuth,
    requireRole("teacher"),
    requirePublishedTeacherDay(4),
    (_req, res) => {
      res.json({ ok: true, ...day04TeacherAnswers });
    },
  );

  app.get(
    "/api/teacher/day-05-answers",
    requireAuth,
    requireRole("teacher"),
    requirePublishedTeacherDay(5),
    (_req, res) => {
      res.json({ ok: true, ...day05TeacherAnswers });
    },
  );

  app.get(
    "/api/teacher/day-06-answers",
    requireAuth,
    requireRole("teacher"),
    requirePublishedTeacherDay(6),
    (_req, res) => {
      res.json({ ok: true, ...day06TeacherAnswers });
    },
  );

  app.get(
    "/api/teacher/day-07-answers",
    requireAuth,
    requireRole("teacher"),
    requirePublishedTeacherDay(7),
    (_req, res) => {
      res.json({ ok: true, ...day07TeacherAnswers });
    },
  );

  app.get(
    "/api/teacher/day-08-answers",
    requireAuth,
    requireRole("teacher"),
    requirePublishedTeacherDay(8),
    (_req, res) => {
      res.json({ ok: true, ...day08TeacherAnswers });
    },
  );

  app.get(
    "/api/teacher/day-09-answers",
    requireAuth,
    requireRole("teacher"),
    requirePublishedTeacherDay(9),
    (_req, res) => {
      res.json({ ok: true, ...day09TeacherAnswers });
    },
  );

  app.get(
    "/api/teacher/day-10-answers",
    requireAuth,
    requireRole("teacher"),
    requirePublishedTeacherDay(10),
    (_req, res) => {
      res.json({ ok: true, ...day10TeacherAnswers });
    },
  );

  app.get(
    "/api/teacher/day-11-answers",
    requireAuth,
    requireRole("teacher"),
    requirePublishedTeacherDay(11),
    (_req, res) => {
      res.json({ ok: true, ...day11TeacherAnswers });
    },
  );

  app.get(
    "/api/teacher/day-12-answers",
    requireAuth,
    requireRole("teacher"),
    requirePublishedTeacherDay(12),
    (_req, res) => {
      res.json({ ok: true, ...day12TeacherAnswers });
    },
  );

  app.get(
    "/api/teacher/day-13-answers",
    requireAuth,
    requireRole("teacher"),
    requirePublishedTeacherDay(13),
    (_req, res) => {
      res.json({ ok: true, ...day13TeacherAnswers });
    },
  );

  app.get(
    "/api/teacher/day-14-answers",
    requireAuth,
    requireRole("teacher"),
    requirePublishedTeacherDay(14),
    (_req, res) => {
      res.json({ ok: true, ...day14TeacherAnswers });
    },
  );

  app.get(
    "/api/teacher/day-15-answers",
    requireAuth,
    requireRole("teacher"),
    requirePublishedTeacherDay(15),
    (_req, res) => {
      res.json({ ok: true, ...day15TeacherAnswers });
    },
  );

  registerPublicationRoutes(app, logError);

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
  registerProgressRoutes(app, logError);
  registerPlatformRoutes(app, logError);
  registerQuizRoutes(app, logError);
  registerWorksheetRoutes(app, logError);

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(DIST));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(DIST, "index.html"));
    });
  }
  return app;
}
