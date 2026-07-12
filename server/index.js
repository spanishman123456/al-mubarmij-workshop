import express from "express";
import { Buffer } from "node:buffer";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import {
  loadStore,
  saveStore,
  applyLoginEvent,
  applyActivityPatch,
  mergeAnalytics,
} from "./analyticsStore.js";
import {
  exportJobsStore,
  ExportStoreError,
  MAX_ARTIFACT_BYTES,
} from "./exportJobsStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const DIST = path.join(__dirname, "..", "dist");

const app = express();
app.use(express.json({ limit: "18mb" }));

function logError(scope, err, extra = {}) {
  console.error(JSON.stringify({ scope, message: err?.message || String(err), ...extra, at: new Date().toISOString() }));
}

function capabilityToken(req, headerName, queryName) {
  const direct = req.get(headerName);
  if (direct) return direct;
  const authorization = req.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7);
  return queryName && typeof req.query[queryName] === "string" ? req.query[queryName] : "";
}

function validateShortText(value, name, maxLength = 128) {
  const hasControlCharacter = typeof value === "string"
    && [...value].some((character) => character.charCodeAt(0) <= 31 || character.charCodeAt(0) === 127);
  if (typeof value !== "string" || !value.trim() || value.length > maxLength || hasControlCharacter) {
    throw new ExportStoreError("INVALID_METADATA", `${name} must be a non-empty string of at most ${maxLength} characters`);
  }
  return value.trim();
}

function parseCreateExport(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ExportStoreError("INVALID_METADATA", "JSON object required");
  }
  const ownerId = validateShortText(body.ownerId, "ownerId");
  const projectId = validateShortText(body.projectId, "projectId");
  const target = validateShortText(body.target, "target", 64);
  const metadata = body.metadata ?? {};
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    throw new ExportStoreError("INVALID_METADATA", "metadata must be an object");
  }
  if (Buffer.byteLength(JSON.stringify(metadata)) > 16 * 1024) {
    throw new ExportStoreError("INVALID_METADATA", "metadata exceeds 16384 bytes", 413);
  }
  if (body.source === undefined && body.sourceBase64 === undefined) {
    throw new ExportStoreError("INVALID_METADATA", "source is required");
  }
  let source;
  if (typeof body.sourceBase64 === "string") {
    if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(body.sourceBase64)) {
      throw new ExportStoreError("INVALID_SOURCE", "sourceBase64 is not valid base64");
    }
    source = Buffer.from(body.sourceBase64, "base64");
  } else {
    source = typeof body.source === "string" ? body.source : JSON.stringify(body.source);
  }
  return { ownerId, projectId, target, metadata, source };
}

function sendExportError(res, error) {
  if (error instanceof ExportStoreError) {
    return res.status(error.status).json({ ok: false, error: error.message, code: error.code });
  }
  throw error;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, at: new Date().toISOString() });
});

// This app has no user authentication. These random bearer values are capabilities:
// possession grants only the operation named by the token. Deployments must deliver
// build tokens to trusted workers and must not log or embed any token in URLs.
app.post("/api/exports", (req, res) => {
  try {
    const created = exportJobsStore.createJob(parseCreateExport(req.body));
    res.status(201).json({ ok: true, ...created });
  } catch (error) {
    try {
      sendExportError(res, error);
    } catch (unexpected) {
      logError("exports.create", unexpected);
      res.status(500).json({ ok: false, error: "failed to create export" });
    }
  }
});

app.get("/api/exports", (req, res) => {
  try {
    const ownerId = validateShortText(req.query.ownerId, "ownerId");
    // ownerId is only a history selector, not an authenticated identity: this
    // legacy server has no account/session authority. Keep export metadata
    // non-sensitive; individual status, worker, and artifact access is tokened.
    const jobs = exportJobsStore.listJobs(ownerId);
    res.json({ ok: true, jobs });
  } catch (error) {
    try {
      sendExportError(res, error);
    } catch (unexpected) {
      logError("exports.list", unexpected);
      res.status(500).json({ ok: false, error: "failed to list exports" });
    }
  }
});

app.get("/api/exports/:id/status", (req, res) => {
  try {
    const ownerToken = capabilityToken(req, "x-export-owner-token");
    const job = exportJobsStore.getStatus(req.params.id, ownerToken);
    res.json({ ok: true, job });
  } catch (error) {
    try {
      sendExportError(res, error);
    } catch (unexpected) {
      logError("exports.status", unexpected, { exportId: req.params.id });
      res.status(500).json({ ok: false, error: "failed to fetch export status" });
    }
  }
});

app.get("/api/exports/:id/source", (req, res) => {
  try {
    const buildToken = capabilityToken(req, "x-export-build-token");
    const result = exportJobsStore.getWorkerSource(req.params.id, buildToken);
    res.set("content-type", "application/octet-stream");
    res.set("x-export-source-bytes", String(result.source.length));
    res.send(result.source);
  } catch (error) {
    try {
      sendExportError(res, error);
    } catch (unexpected) {
      logError("exports.source", unexpected, { exportId: req.params.id });
      res.status(500).json({ ok: false, error: "failed to fetch export source" });
    }
  }
});

const artifactBody = express.raw({ type: "application/octet-stream", limit: MAX_ARTIFACT_BYTES });

function receiveExportResult(req, res) {
  try {
    const buildToken = capabilityToken(req, "x-export-build-token");
    if (!Buffer.isBuffer(req.body)) {
      if (req.body?.status === "failed" || req.body?.error) {
        const job = exportJobsStore.failJob(req.params.id, buildToken, req.body.error);
        return res.json({ ok: true, job });
      }
      if (typeof req.body?.artifactBase64 !== "string") {
        throw new ExportStoreError("ARTIFACT_REQUIRED", "Send an application/octet-stream body or artifactBase64");
      }
      const encoded = req.body.artifactBase64;
      if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) {
        throw new ExportStoreError("INVALID_ARTIFACT", "artifactBase64 is not valid base64");
      }
      const artifact = Buffer.from(encoded, "base64");
      const job = exportJobsStore.completeJob(req.params.id, buildToken, artifact, {
        filename: req.body.filename,
        contentType: req.body.contentType,
      });
      return res.json({ ok: true, job });
    }
    const job = exportJobsStore.completeJob(req.params.id, buildToken, req.body, {
      filename: req.get("x-export-filename"),
      contentType: req.get("x-export-content-type"),
    });
    return res.json({ ok: true, job });
  } catch (error) {
    try {
      return sendExportError(res, error);
    } catch (unexpected) {
      logError("exports.result", unexpected, { exportId: req.params.id });
      return res.status(500).json({ ok: false, error: "failed to record export result" });
    }
  }
}

app.put("/api/exports/:id/result", artifactBody, receiveExportResult);
app.post("/api/exports/:id/result", artifactBody, receiveExportResult);

app.get("/api/exports/:id/download", (req, res) => {
  try {
    const downloadToken = capabilityToken(req, "x-export-download-token", "token");
    const result = exportJobsStore.getDownload(req.params.id, downloadToken);
    res.set("content-type", result.job.artifact.contentType);
    res.set("content-disposition", `attachment; filename="${result.job.artifact.filename.replace(/["\\]/g, "-")}"`);
    res.set("x-artifact-sha256", result.job.artifact.sha256);
    res.sendFile(result.artifactPath);
  } catch (error) {
    try {
      sendExportError(res, error);
    } catch (unexpected) {
      logError("exports.download", unexpected, { exportId: req.params.id });
      res.status(500).json({ ok: false, error: "failed to download export" });
    }
  }
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

app.use((error, _req, res, _next) => {
  void _next; // Express recognizes error middleware by its four-argument signature.
  if (error?.type === "entity.too.large") {
    return res.status(413).json({ ok: false, error: "request payload is too large", code: "PAYLOAD_TOO_LARGE" });
  }
  logError("request", error);
  return res.status(400).json({ ok: false, error: "invalid request body", code: "INVALID_BODY" });
});

const cleanupTimer = setInterval(() => {
  try {
    exportJobsStore.cleanupExpired();
  } catch (error) {
    logError("exports.cleanup", error);
  }
}, 60 * 60 * 1000);
cleanupTimer.unref();

app.listen(PORT, () => {
  console.log(`[server] listening on ${PORT} (${process.env.NODE_ENV || "development"})`);
});
