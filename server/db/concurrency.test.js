process.env.PLATFORM_DB_PATH = new URL("./data/concurrency.test.db", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp } from "../createApp.js";
import { closeDatabase, resetDatabaseForTests, persistDatabase, getDatabaseStatus } from "./index.js";
import { loginStudent, authFetch } from "../testHelpers.js";
import { STUDENTS_ROSTER } from "../../src/data/studentsRoster.js";

const TEST_DB = fileURLToPath(new URL("./data/concurrency.test.db", import.meta.url));

describe("SQLite concurrent writes", () => {
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
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  afterAll(async () => {
    await new Promise((resolve) => server?.close(resolve));
    closeDatabase();
    resetDatabaseForTests();
    delete process.env.PLATFORM_DB_PATH;
  });

  it("50 concurrent saves from 20 students — no cross-contamination", async () => {
    const roster = STUDENTS_ROSTER.slice(0, 20);
    const sessions = await Promise.all(
      roster.map((s) => loginStudent(baseUrl, s.nationalId)),
    );

    const writes = [];
    for (let i = 0; i < 50; i += 1) {
      const idx = i % sessions.length;
      const auth = sessions[idx];
      const studentId = `stu-${roster[idx].nationalId}`;
      writes.push(
        authFetch(baseUrl, "/api/lesson/progress", {
          cookie: auth.cookie,
          csrf: auth.csrf,
          method: "POST",
          body: JSON.stringify({
            lessonId: "concurrency-test",
            sectionId: `sec-${i}`,
            progress: { studentId, seq: i, marker: `${studentId}-${i}` },
            completed: i % 3 === 0,
          }),
        }),
      );
    }

    const results = await Promise.all(writes);
    expect(results.every((r) => r.ok)).toBe(true);

    for (let idx = 0; idx < sessions.length; idx += 1) {
      const auth = sessions[idx];
      const studentId = `stu-${roster[idx].nationalId}`;
      const data = await (await authFetch(baseUrl, `/api/progress/${studentId}`, { cookie: auth.cookie })).json();
      const rows = (data.lessons || []).filter((l) => l.lessonId === "concurrency-test");
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        expect(String(row.progress?.marker || "").startsWith(studentId)).toBe(true);
      }
    }

    persistDatabase();
    const dbStatus = getDatabaseStatus();
    expect(dbStatus.exists).toBe(true);
    expect(dbStatus.ok).toBe(true);
  });
});
