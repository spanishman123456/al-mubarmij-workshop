import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Buffer } from "node:buffer";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DEFAULT_EXPORTS_DIR = path.join(__dirname, "data", "exports");
export const DEFAULT_JOB_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const DEFAULT_DOWNLOAD_TTL_MS = 24 * 60 * 60 * 1000;
export const MAX_SOURCE_BYTES = 12 * 1024 * 1024;
export const MAX_ARTIFACT_BYTES = 150 * 1024 * 1024;

export class ExportStoreError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = "ExportStoreError";
    this.code = code;
    this.status = status;
  }
}

function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function tokenMatches(token, expectedHash) {
  if (typeof token !== "string" || !token || typeof expectedHash !== "string") return false;
  const actual = Buffer.from(tokenHash(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function atomicWrite(file, contents) {
  const temporary = `${file}.${process.pid}.${crypto.randomBytes(6).toString("hex")}.tmp`;
  fs.writeFileSync(temporary, contents, { flag: "wx" });
  try {
    fs.renameSync(temporary, file);
  } finally {
    if (fs.existsSync(temporary)) fs.rmSync(temporary, { force: true });
  }
}

export function safeArtifactFilename(value, target = "export") {
  const fallback = `export-${String(target).replace(/[^a-z0-9_-]/gi, "-")}.zip`;
  if (typeof value !== "string") return fallback;
  const basename = [...path.basename(value)]
    .filter((character) => character.charCodeAt(0) > 31 && character.charCodeAt(0) !== 127)
    .join("");
  const safe = basename.replace(/[^a-z0-9._() -]/gi, "-").replace(/^\.+/, "").slice(0, 120);
  return safe || fallback;
}

function publicJob(job) {
  return {
    id: job.id,
    ownerId: job.ownerId,
    projectId: job.projectId,
    target: job.target,
    metadata: job.metadata,
    status: job.status,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    expiresAt: job.expiresAt,
    downloadExpiresAt: job.downloadExpiresAt || null,
    artifact: job.artifact || null,
    error: job.error || null,
  };
}

export function createExportJobsStore(options = {}) {
  const rootDir = options.rootDir || DEFAULT_EXPORTS_DIR;
  const now = options.now || (() => Date.now());
  const jobTtlMs = options.jobTtlMs || DEFAULT_JOB_TTL_MS;
  const downloadTtlMs = options.downloadTtlMs || DEFAULT_DOWNLOAD_TTL_MS;
  const sourceLimit = options.maxSourceBytes || MAX_SOURCE_BYTES;
  const artifactLimit = options.maxArtifactBytes || MAX_ARTIFACT_BYTES;
  const indexFile = path.join(rootDir, "jobs.json");
  const sourceDir = path.join(rootDir, "sources");
  const artifactDir = path.join(rootDir, "artifacts");

  function ensureStorage() {
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(artifactDir, { recursive: true });
    if (!fs.existsSync(indexFile)) atomicWrite(indexFile, JSON.stringify({ version: 1, jobs: {} }, null, 2));
  }

  function load() {
    ensureStorage();
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(indexFile, "utf8"));
    } catch (error) {
      throw new ExportStoreError("STORAGE_CORRUPT", `Export jobs index cannot be read: ${error.message}`, 500);
    }
    if (parsed?.version !== 1 || !parsed.jobs || typeof parsed.jobs !== "object") {
      throw new ExportStoreError("STORAGE_CORRUPT", "Export jobs index has an unsupported format", 500);
    }
    return parsed;
  }

  function save(data) {
    atomicWrite(indexFile, JSON.stringify(data, null, 2));
  }

  function requireJob(data, id) {
    const job = data.jobs[id];
    if (!job) throw new ExportStoreError("NOT_FOUND", "Export job not found", 404);
    if (new Date(job.expiresAt).getTime() <= now()) {
      throw new ExportStoreError("EXPIRED", "Export job has expired", 410);
    }
    return job;
  }

  function requireToken(token, hash, kind) {
    if (!tokenMatches(token, hash)) {
      throw new ExportStoreError("UNAUTHORIZED", `Invalid ${kind} token`, 401);
    }
  }

  function removeFiles(job) {
    fs.rmSync(path.join(sourceDir, `${job.id}.source`), { force: true });
    fs.rmSync(path.join(artifactDir, `${job.id}.artifact`), { force: true });
  }

  function cleanupExpired() {
    const data = load();
    let removed = 0;
    for (const [id, job] of Object.entries(data.jobs)) {
      if (new Date(job.expiresAt).getTime() <= now()) {
        removeFiles(job);
        delete data.jobs[id];
        removed += 1;
      }
    }
    if (removed) save(data);
    return removed;
  }

  function createJob({ ownerId, projectId, target, metadata = {}, source }) {
    const sourceBuffer = Buffer.isBuffer(source) ? source : Buffer.from(source ?? "", "utf8");
    if (sourceBuffer.length > sourceLimit) {
      throw new ExportStoreError("SOURCE_TOO_LARGE", `Source exceeds ${sourceLimit} bytes`, 413);
    }
    cleanupExpired();
    const data = load();
    const id = crypto.randomUUID();
    const ownerToken = crypto.randomBytes(32).toString("base64url");
    const buildToken = crypto.randomBytes(32).toString("base64url");
    const downloadToken = crypto.randomBytes(32).toString("base64url");
    const timestamp = new Date(now()).toISOString();
    const job = {
      id,
      ownerId,
      projectId,
      target,
      metadata,
      status: "queued",
      createdAt: timestamp,
      updatedAt: timestamp,
      expiresAt: new Date(now() + jobTtlMs).toISOString(),
      ownerTokenHash: tokenHash(ownerToken),
      buildTokenHash: tokenHash(buildToken),
      downloadTokenHash: tokenHash(downloadToken),
      sourceBytes: sourceBuffer.length,
      downloadExpiresAt: null,
      artifact: null,
      error: null,
    };
    atomicWrite(path.join(sourceDir, `${id}.source`), sourceBuffer);
    try {
      data.jobs[id] = job;
      save(data);
    } catch (error) {
      removeFiles(job);
      throw error;
    }
    return { job: publicJob(job), ownerToken, buildToken, downloadToken };
  }

  function listJobs(ownerId) {
    cleanupExpired();
    const jobs = Object.values(load().jobs)
      .filter((job) => job.ownerId === ownerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(publicJob);
    return jobs;
  }

  function getStatus(id, ownerToken) {
    const data = load();
    const job = requireJob(data, id);
    requireToken(ownerToken, job.ownerTokenHash, "owner");
    return publicJob(job);
  }

  function getWorkerSource(id, buildToken) {
    const data = load();
    const job = requireJob(data, id);
    requireToken(buildToken, job.buildTokenHash, "build");
    if (!["queued", "building"].includes(job.status)) {
      throw new ExportStoreError("INVALID_STATE", `Cannot read source for a ${job.status} job`, 409);
    }
    const sourcePath = path.join(sourceDir, `${job.id}.source`);
    if (!fs.existsSync(sourcePath)) {
      throw new ExportStoreError("SOURCE_MISSING", "Export source is missing", 500);
    }
    if (job.status === "queued") {
      job.status = "building";
      job.updatedAt = new Date(now()).toISOString();
      save(data);
    }
    return { job: publicJob(job), source: fs.readFileSync(sourcePath) };
  }

  function completeJob(id, buildToken, artifact, details = {}) {
    const artifactBuffer = Buffer.isBuffer(artifact) ? artifact : Buffer.from(artifact || "");
    if (!artifactBuffer.length) throw new ExportStoreError("ARTIFACT_EMPTY", "Artifact is required");
    if (artifactBuffer.length > artifactLimit) {
      throw new ExportStoreError("ARTIFACT_TOO_LARGE", `Artifact exceeds ${artifactLimit} bytes`, 413);
    }
    const data = load();
    const job = requireJob(data, id);
    requireToken(buildToken, job.buildTokenHash, "build");
    if (job.status !== "building") {
      throw new ExportStoreError("INVALID_STATE", `Cannot complete a ${job.status} job`, 409);
    }
    const artifactPath = path.join(artifactDir, `${job.id}.artifact`);
    atomicWrite(artifactPath, artifactBuffer);
    const timestamp = new Date(now()).toISOString();
    job.status = "completed";
    job.updatedAt = timestamp;
    job.downloadExpiresAt = new Date(Math.min(now() + downloadTtlMs, new Date(job.expiresAt).getTime())).toISOString();
    job.artifact = {
      filename: safeArtifactFilename(details.filename, job.target),
      contentType: typeof details.contentType === "string" && details.contentType.length <= 100
        ? details.contentType
        : "application/octet-stream",
      bytes: artifactBuffer.length,
      sha256: crypto.createHash("sha256").update(artifactBuffer).digest("hex"),
    };
    job.error = null;
    try {
      save(data);
    } catch (error) {
      fs.rmSync(artifactPath, { force: true });
      throw error;
    }
    return publicJob(job);
  }

  function failJob(id, buildToken, message) {
    const data = load();
    const job = requireJob(data, id);
    requireToken(buildToken, job.buildTokenHash, "build");
    if (!["queued", "building"].includes(job.status)) {
      throw new ExportStoreError("INVALID_STATE", `Cannot fail a ${job.status} job`, 409);
    }
    job.status = "failed";
    job.updatedAt = new Date(now()).toISOString();
    job.error = String(message || "Build failed").slice(0, 1000);
    save(data);
    return publicJob(job);
  }

  function getDownload(id, downloadToken) {
    const data = load();
    const job = requireJob(data, id);
    requireToken(downloadToken, job.downloadTokenHash, "download");
    if (job.status !== "completed") {
      throw new ExportStoreError("NOT_READY", "Export artifact is not ready", 409);
    }
    if (new Date(job.downloadExpiresAt).getTime() <= now()) {
      throw new ExportStoreError("DOWNLOAD_EXPIRED", "Download token has expired", 410);
    }
    const artifactPath = path.join(artifactDir, `${job.id}.artifact`);
    if (!fs.existsSync(artifactPath)) {
      throw new ExportStoreError("ARTIFACT_MISSING", "Export artifact is missing", 500);
    }
    return { job: publicJob(job), artifactPath };
  }

  return {
    createJob,
    listJobs,
    getStatus,
    getWorkerSource,
    completeJob,
    failJob,
    getDownload,
    cleanupExpired,
  };
}

export const exportJobsStore = createExportJobsStore();
