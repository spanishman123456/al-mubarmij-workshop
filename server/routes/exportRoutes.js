import express from "express";
import { Buffer } from "node:buffer";
import process from "node:process";
import {
  exportJobsStore,
  ExportStoreError,
  MAX_ARTIFACT_BYTES,
} from "../exportJobsStore.js";

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
    throw new ExportStoreError(
      "INVALID_METADATA",
      `${name} must be a non-empty string of at most ${maxLength} characters`,
    );
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

async function dispatchWindowsWorkflow(created, metadata = {}) {
  const token = process.env.GITHUB_WORKFLOW_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const apiBase = process.env.EXPORT_PUBLIC_BASE_URL || process.env.APP_URL;
  if (!token || !repository || !apiBase) return { dispatched: false, reason: "not-configured" };
  if (!/^https:\/\//i.test(apiBase)) {
    throw new ExportStoreError("BUILD_CONFIG", "EXPORT_PUBLIC_BASE_URL must use HTTPS", 500);
  }
  const response = await fetch(
    `https://api.github.com/repos/${repository}/actions/workflows/skui-windows-export.yml/dispatches`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: process.env.GITHUB_EXPORT_REF || "main",
        inputs: {
          build_id: created.job.id,
          api_base: apiBase.replace(/\/+$/, ""),
          build_token: created.buildToken,
          product_name: String(metadata.name || "SKUI Project").slice(0, 80),
          version: /^\d+\.\d+\.\d+$/.test(metadata.version || "") ? metadata.version : "1.0.0",
          identifier: `org.mubarmij.skui.${created.job.id.replace(/-/g, "").slice(0, 20)}`,
          dist_path: "desktop/skui-tauri-template/dist",
          require_signing: metadata.signingMode === "official",
        },
      }),
    },
  );
  if (!response.ok) {
    throw new ExportStoreError("BUILD_DISPATCH_FAILED", `GitHub Actions dispatch failed (${response.status})`, 502);
  }
  return { dispatched: true };
}

export function registerExportRoutes(app, logError, store = exportJobsStore) {
  app.post("/api/exports", async (req, res) => {
    try {
      const parsed = parseCreateExport(req.body);
      const created = store.createJob(parsed);
      let dispatch = { dispatched: false, reason: "not-windows" };
      if (parsed.target === "windows") {
        try {
          dispatch = await dispatchWindowsWorkflow(created, parsed.metadata);
        } catch (error) {
          store.failJob(created.job.id, created.buildToken, error.message);
          throw error;
        }
      }
      const publicCreated = process.env.NODE_ENV === "production"
        ? { job: created.job, ownerToken: created.ownerToken, downloadToken: created.downloadToken }
        : created;
      res.status(201).json({ ok: true, ...publicCreated, dispatch });
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
      // ownerId selects non-sensitive history; operation access is capability-token protected.
      res.json({ ok: true, jobs: store.listJobs(ownerId) });
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
      res.json({ ok: true, job: store.getStatus(req.params.id, ownerToken) });
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
      const result = store.getWorkerSource(req.params.id, buildToken);
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
          const job = store.failJob(req.params.id, buildToken, req.body.error);
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
        const job = store.completeJob(req.params.id, buildToken, artifact, {
          filename: req.body.filename,
          contentType: req.body.contentType,
        });
        return res.json({ ok: true, job });
      }
      const job = store.completeJob(req.params.id, buildToken, req.body, {
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
      const result = store.getDownload(req.params.id, downloadToken);
      res.set("content-type", result.job.artifact.contentType);
      res.set(
        "content-disposition",
        `attachment; filename="${result.job.artifact.filename.replace(/["\\]/g, "-")}"`,
      );
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
}

export function startExportJobsCleanup(logError, store = exportJobsStore) {
  const cleanupTimer = setInterval(() => {
    try {
      store.cleanupExpired();
    } catch (error) {
      logError("exports.cleanup", error);
    }
  }, 60 * 60 * 1000);
  cleanupTimer.unref();
  return cleanupTimer;
}
