/**
 * Day unlock integration — PUBLISHED_DAYS=2, sequential policy.
 */
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { saveStudentProgress } from "./repositories/progressRepository.js";

const TEST_DB = fileURLToPath(new URL("./data/dayunlock.integration.test.db", import.meta.url));
const STUDENT_NID = "1165814631";
const STUDENT_ID = `stu-${STUDENT_NID}`;

let baseUrl;
let server;

async function post(path, body, cookie = "") {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

async function get(path, cookie = "") {
  const res = await fetch(`${baseUrl}${path}`, { headers: { Cookie: cookie } });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

beforeAll(async () => {
  for (const p of [TEST_DB, `${TEST_DB}.bak`, `${TEST_DB}.tmp`]) {
    if (fs.existsSync(p)) fs.rmSync(p, { force: true });
  }
  process.env.PLATFORM_DB_PATH = TEST_DB;
  process.env.PUBLISHED_DAYS = "2";
  process.env.STUDENT_UNLOCK_POLICY = "sequential";
  process.env.TEACHER_BCRYPT_HASH = bcrypt.hashSync("teacher-test", 4);
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

describe("day unlock integration", () => {
  it("locks day 2 until day 1 completed", async () => {
    saveStudentProgress(STUDENT_ID, { completedDays: [], worksheetStatus: {} });

    const login = await post("/api/auth/student", { nationalId: STUDENT_NID });
    expect(login.res.status).toBe(200);
    const cookie = login.res.headers.get("set-cookie") || "";

    const unlock = await get("/api/student/day-unlock", cookie);
    expect(unlock.data.dayUnlockMap["day-02"]).toBe("locked");

    const complete = await post("/api/student/day/day-02/complete", {}, cookie);
    expect(complete.res.status).toBe(403);
  });

  it("opens day 2 after day 1 marked complete", async () => {
    saveStudentProgress(STUDENT_ID, {
      completedDays: ["day-01"],
      dayCompletionTimes: { "day-01": new Date().toISOString() },
    });

    const login = await post("/api/auth/student", { nationalId: STUDENT_NID });
    const cookie = login.res.headers.get("set-cookie") || "";
    const unlock = await get("/api/student/day-unlock", cookie);
    expect(unlock.data.dayUnlockMap["day-02"]).not.toBe("locked");
    expect(unlock.data.dayUnlockMap["day-03"]).toBe("draft");
  });

  it("does not open unpublished day 3 when day 2 completed", async () => {
    saveStudentProgress(STUDENT_ID, {
      completedDays: ["day-01", "day-02"],
      dayCompletionTimes: {
        "day-01": new Date().toISOString(),
        "day-02": new Date().toISOString(),
      },
    });

    const login = await post("/api/auth/student", { nationalId: STUDENT_NID });
    const cookie = login.res.headers.get("set-cookie") || "";
    const unlock = await get("/api/student/day-unlock", cookie);
    expect(unlock.data.dayUnlockMap["day-03"]).toBe("draft");
  });
});
