process.env.PLATFORM_DB_PATH = new URL("./data/progress.integration.test.db", import.meta.url).pathname.replace(
  /^\/([A-Z]:)/,
  "$1",
);
process.env.PUBLISHED_DAYS = "1";

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { loginStudent, authFetch } from "./testHelpers.js";
import { buildPublishedRequiredCatalog } from "../src/lib/progressCatalog.js";
import { getPublishedDaysCount } from "./config/publication.js";

const TEST_DB = fileURLToPath(new URL("./data/progress.integration.test.db", import.meta.url));
const STUDENT_NID = "1165814631";
const STUDENT_ID = `stu-${STUDENT_NID}`;

describe("progress API v2", () => {
  let baseUrl;
  let server;
  let auth;

  beforeAll(async () => {
    for (const p of [TEST_DB, `${TEST_DB}.bak`]) {
      if (fs.existsSync(p)) fs.rmSync(p, { force: true });
    }
    resetDatabaseForTests();
    const app = createApp();
    await prepareApp(app);
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
    auth = await loginStudent(baseUrl, STUDENT_NID);
  });

  afterAll(async () => {
    await new Promise((resolve) => server?.close(resolve));
    closeDatabase();
    delete process.env.PLATFORM_DB_PATH;
    delete process.env.PUBLISHED_DAYS;
  });

  it("counts completed lesson after lesson_progress save", async () => {
    const saveRes = await authFetch(baseUrl, "/api/lesson/progress", {
      cookie: auth.cookie,
      csrf: auth.csrf,
      method: "POST",
      body: JSON.stringify({
        lessonId: "python-intro",
        sectionId: "main",
        progress: { startedAt: new Date().toISOString(), status: "completed" },
        completed: true,
      }),
    });
    expect(saveRes.ok).toBe(true);

    const meRes = await authFetch(baseUrl, "/api/progress/me", {
      cookie: auth.cookie,
      csrf: auth.csrf,
    });
    expect(meRes.ok).toBe(true);
    const body = await meRes.json();
    expect(body.computed.completedLessons).toBeGreaterThanOrEqual(1);
    const expectedLessons = buildPublishedRequiredCatalog(getPublishedDaysCount()).filter(
      (i) => i.category === "lesson",
    ).length;
    expect(body.computed.totalPublishedLessons).toBeGreaterThan(0);
    expect(body.computed.totalPublishedLessons).toBeLessThanOrEqual(expectedLessons);
    const lesson = body.computed.details.find((d) => d.id === "lesson-python-intro");
    expect(lesson?.status).toBe("completed");
  });

  it("reflects python runs from analytics activity patch", async () => {
    const actRes = await authFetch(baseUrl, "/api/analytics/activity", {
      cookie: auth.cookie,
      csrf: auth.csrf,
      method: "POST",
      body: JSON.stringify({
        patch: { pythonRuns: 3, lastPythonRunAt: new Date().toISOString() },
      }),
    });
    expect(actRes.ok).toBe(true);

    const meRes = await authFetch(baseUrl, "/api/progress/me", {
      cookie: auth.cookie,
      csrf: auth.csrf,
    });
    const body = await meRes.json();
    expect(body.computed.pythonRuns).toBeGreaterThanOrEqual(3);
    expect(body.computed.pythonActivityNoteAr).toBeTruthy();
  });
});
