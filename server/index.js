import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadStore,
  saveStore,
  applyLoginEvent,
  applyActivityPatch,
  mergeAnalytics,
} from "./analyticsStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const DIST = path.join(__dirname, "..", "dist");

const app = express();
app.use(express.json({ limit: "256kb" }));

function logError(scope, err, extra = {}) {
  console.error(JSON.stringify({ scope, message: err?.message || String(err), ...extra, at: new Date().toISOString() }));
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, at: new Date().toISOString() });
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
    if (!studentId) {
      return res.status(400).json({ ok: false, error: "studentId required" });
    }

    const store = loadStore();
    const current = store.analyticsByStudent[studentId];
    store.analyticsByStudent[studentId] = applyActivityPatch(current, patch || {});
    saveStore(store);

    res.json({ ok: true, analytics: store.analyticsByStudent[studentId] });
  } catch (err) {
    logError("analytics.activity", err, { studentId: req.body?.studentId });
    res.status(500).json({ ok: false, error: "failed to record activity" });
  }
});

app.post("/api/analytics/sync", (req, res) => {
  try {
    const { studentId, analytics } = req.body || {};
    if (!studentId || !analytics) {
      return res.status(400).json({ ok: false, error: "studentId and analytics required" });
    }

    const store = loadStore();
    const current = store.analyticsByStudent[studentId];
    store.analyticsByStudent[studentId] = mergeAnalytics(current, analytics);
    saveStore(store);

    res.json({ ok: true, analytics: store.analyticsByStudent[studentId] });
  } catch (err) {
    logError("analytics.sync", err, { studentId: req.body?.studentId });
    res.status(500).json({ ok: false, error: "failed to sync analytics" });
  }
});

app.get("/api/analytics/all", (_req, res) => {
  try {
    const store = loadStore();
    res.json({ ok: true, analyticsByStudent: store.analyticsByStudent, fetchedAt: new Date().toISOString() });
  } catch (err) {
    logError("analytics.all", err);
    res.status(500).json({ ok: false, error: "failed to fetch analytics" });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(DIST));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(DIST, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`[server] listening on ${PORT} (${process.env.NODE_ENV || "development"})`);
});
