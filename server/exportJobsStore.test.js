import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Buffer } from "node:buffer";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createExportJobsStore,
  ExportStoreError,
  safeArtifactFilename,
} from "./exportJobsStore.js";

describe("exportJobsStore", () => {
  let rootDir;
  let clock;
  let store;

  beforeEach(() => {
    rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "export-jobs-"));
    clock = Date.parse("2026-07-12T12:00:00.000Z");
    store = createExportJobsStore({
      rootDir,
      now: () => clock,
      jobTtlMs: 60_000,
      downloadTtlMs: 10_000,
      maxSourceBytes: 100,
      maxArtifactBytes: 100,
    });
  });

  afterEach(() => {
    fs.rmSync(rootDir, { recursive: true, force: true });
  });

  function create() {
    return store.createJob({
      ownerId: "student-1",
      projectId: "project-1",
      target: "web",
      metadata: { title: "Game" },
      source: "student source, never executed here",
    });
  }

  it("persists jobs without persisting bearer tokens", () => {
    const created = create();
    const reloaded = createExportJobsStore({ rootDir, now: () => clock });

    expect(reloaded.getStatus(created.job.id, created.ownerToken)).toMatchObject({
      id: created.job.id,
      status: "queued",
      metadata: { title: "Game" },
    });
    const index = fs.readFileSync(path.join(rootDir, "jobs.json"), "utf8");
    expect(index).not.toContain(created.ownerToken);
    expect(index).not.toContain(created.buildToken);
    expect(index).not.toContain(created.downloadToken);
  });

  it("enforces capability separation and valid state transitions", () => {
    const created = create();

    expect(() => store.getStatus(created.job.id, created.buildToken)).toThrowError(
      expect.objectContaining({ code: "UNAUTHORIZED" }),
    );
    expect(() => store.getWorkerSource(created.job.id, created.ownerToken)).toThrowError(
      expect.objectContaining({ code: "UNAUTHORIZED" }),
    );

    const claimed = store.getWorkerSource(created.job.id, created.buildToken);
    expect(claimed.source.toString()).toContain("never executed");
    expect(claimed.job.status).toBe("building");

    const artifact = Buffer.from("zip artifact bytes");
    const completed = store.completeJob(created.job.id, created.buildToken, artifact, {
      filename: "../../unsafe?.zip",
      contentType: "application/zip",
    });
    expect(completed).toMatchObject({
      status: "completed",
      artifact: {
        filename: "unsafe-.zip",
        bytes: artifact.length,
        sha256: crypto.createHash("sha256").update(artifact).digest("hex"),
      },
    });
    expect(() => store.completeJob(created.job.id, created.buildToken, artifact)).toThrowError(
      expect.objectContaining({ code: "INVALID_STATE" }),
    );
  });

  it("lists only jobs selected by ownerId", () => {
    create();
    store.createJob({
      ownerId: "student-1",
      projectId: "project-2",
      target: "web",
      source: "two",
    });
    store.createJob({
      ownerId: "student-2",
      projectId: "project-3",
      target: "web",
      source: "three",
    });

    expect(store.listJobs("student-1")).toHaveLength(2);
    expect(store.listJobs("student-2")).toHaveLength(1);
  });

  it("serves artifacts only before the download capability expires", () => {
    const created = create();
    store.getWorkerSource(created.job.id, created.buildToken);
    store.completeJob(created.job.id, created.buildToken, Buffer.from("artifact"));

    expect(store.getDownload(created.job.id, created.downloadToken).artifactPath).toContain(created.job.id);
    expect(() => store.getDownload(created.job.id, created.ownerToken)).toThrowError(
      expect.objectContaining({ code: "UNAUTHORIZED" }),
    );
    clock += 10_001;
    expect(() => store.getDownload(created.job.id, created.downloadToken)).toThrowError(
      expect.objectContaining({ code: "DOWNLOAD_EXPIRED", status: 410 }),
    );
  });

  it("cleans expired records and payload files", () => {
    const created = create();
    const sourcePath = path.join(rootDir, "sources", `${created.job.id}.source`);
    expect(fs.existsSync(sourcePath)).toBe(true);

    clock += 60_001;
    expect(store.cleanupExpired()).toBe(1);
    expect(fs.existsSync(sourcePath)).toBe(false);
    expect(store.listJobs("student-1")).toEqual([]);
  });

  it("caps source and artifact payloads and sanitizes filenames", () => {
    expect(() => store.createJob({
      ownerId: "student-1",
      projectId: "project-1",
      target: "web",
      source: "x".repeat(101),
    })).toThrowError(expect.objectContaining({ code: "SOURCE_TOO_LARGE", status: 413 }));

    const created = create();
    store.getWorkerSource(created.job.id, created.buildToken);
    expect(() => store.completeJob(created.job.id, created.buildToken, Buffer.alloc(101))).toThrowError(
      expect.objectContaining({ code: "ARTIFACT_TOO_LARGE", status: 413 }),
    );
    expect(safeArtifactFilename("../../../\u0000")).toBe("export-export.zip");
  });

  it("records bounded worker failures", () => {
    const created = create();
    const failed = store.failJob(created.job.id, created.buildToken, "x".repeat(2_000));
    expect(failed.status).toBe("failed");
    expect(failed.error).toHaveLength(1_000);
    expect(() => store.getWorkerSource(created.job.id, created.buildToken)).toThrow(ExportStoreError);
  });
});
