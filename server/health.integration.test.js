process.env.PLATFORM_DB_PATH = new URL("./data/platform.integration.test.db", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp, getGitCommit } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";

const TEST_DB = fileURLToPath(new URL("./data/platform.integration.test.db", import.meta.url));

describe("API health + progress integration", () => {
  let baseUrl;
  let server;

  beforeAll(async () => {
    for (const p of [TEST_DB, `${TEST_DB}.bak`, `${TEST_DB}.tmp`]) {
      if (fs.existsSync(p)) fs.rmSync(p, { force: true });
    }
    resetDatabaseForTests();
    const app = createApp();
    await prepareApp(app);
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterAll(async () => {
    await new Promise((resolve) => server?.close(resolve));
    closeDatabase();
    resetDatabaseForTests();
    for (const p of [TEST_DB, `${TEST_DB}.bak`, `${TEST_DB}.tmp`]) {
      if (fs.existsSync(p)) fs.rmSync(p, { force: true });
    }
    delete process.env.PLATFORM_DB_PATH;
  });

  it("GET /api/health returns ok, storage, database, commit", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.storage).toBe("sqlite");
    expect(body.database?.ok).toBe(true);
    expect(typeof body.commit).toBe("string");
    expect(body.commit).toBe(getGitCommit());
  });

  it("saves and restores lesson progress across sessions (no localStorage)", async () => {
    const studentA = "1165814631";
    const studentB = "1167676921";
    const lessonId = "base-arithmetic";

    const saveRes = await fetch(`${baseUrl}/api/lesson/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: studentA,
        lessonId,
        sectionId: "main",
        progress: { moves: 3, answer: "11000" },
        completed: false,
      }),
    });
    expect(saveRes.ok).toBe(true);

    const getA = await fetch(`${baseUrl}/api/progress/${studentA}`);
    const dataA = await getA.json();
    const rowA = dataA.lessons.find((l) => l.lessonId === lessonId);
    expect(rowA?.progress?.moves).toBe(3);

    const getB = await fetch(`${baseUrl}/api/progress/${studentB}`);
    const dataB = await getB.json();
    const rowB = dataB.lessons.find((l) => l.lessonId === lessonId);
    expect(rowB).toBeUndefined();
  });

  it("records lesson progress and appears in teacher summary", async () => {
    const studentId = "1165814631";
    await fetch(`${baseUrl}/api/lesson/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        lessonId: "if-statement",
        sectionId: "main",
        progress: { score: 55 },
        completed: true,
      }),
    });

    const summaryRes = await fetch(`${baseUrl}/api/lesson/summary`);
    const summary = await summaryRes.json();
    expect(summary.ok).toBe(true);
    expect(summary.summary[studentId]?.["if-statement"]?.completed).toBe(true);
  });

  it("smoke: onboarding status endpoint", async () => {
    const res = await fetch(`${baseUrl}/api/onboarding/status/1165814631`);
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
