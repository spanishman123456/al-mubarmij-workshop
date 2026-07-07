/**
 * Publication settings API — DB-backed, env bootstrap only.
 */
import { describe, expect, it, beforeAll, afterAll, beforeEach } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { resetPlatformSettingsForTests } from "./repositories/platformSettingsRepository.js";
import { saveStudentProgress } from "./repositories/progressRepository.js";
import { loginTeacher, testTeacherPassword, authFetch } from "./testHelpers.js";

const TEST_DB = fileURLToPath(new URL("./data/publication.integration.test.db", import.meta.url));
const SETTINGS_PATH = fileURLToPath(new URL("./data/platform-settings.json", import.meta.url));
const TEACHER_NID = "2297033843";

let baseUrl;
let server;
let teacherAuth;

async function post(path, body) {
  const res = await authFetch(baseUrl, path, {
    method: "POST",
    body: JSON.stringify(body),
    cookie: teacherAuth.cookie,
    csrf: teacherAuth.csrf,
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

async function put(path, body) {
  const res = await authFetch(baseUrl, path, {
    method: "PUT",
    body: JSON.stringify(body),
    cookie: teacherAuth.cookie,
    csrf: teacherAuth.csrf,
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

async function get(path) {
  const res = await authFetch(baseUrl, path, { cookie: teacherAuth.cookie });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

beforeAll(async () => {
  for (const p of [TEST_DB, `${TEST_DB}.bak`, `${TEST_DB}.tmp`]) {
    if (fs.existsSync(p)) fs.rmSync(p, { force: true });
  }
  process.env.PLATFORM_DB_PATH = TEST_DB;
  process.env.PUBLISHED_DAYS = "1";
  process.env.STUDENT_UNLOCK_POLICY = "sequential";
  process.env.TEACHER_BCRYPT_HASH = bcrypt.hashSync(testTeacherPassword(), 4);
  resetDatabaseForTests();
  resetPlatformSettingsForTests();
  const app = createApp();
  await prepareApp(app);
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  teacherAuth = await loginTeacher(baseUrl, TEACHER_NID, testTeacherPassword());
  saveStudentProgress("stu-1165814631", { completedDays: ["day-01"] });
});

beforeEach(() => {
  resetPlatformSettingsForTests();
});

afterAll(async () => {
  await new Promise((resolve) => server?.close(resolve));
  closeDatabase();
  resetDatabaseForTests();
  resetPlatformSettingsForTests();
  if (fs.existsSync(SETTINGS_PATH)) fs.rmSync(SETTINGS_PATH, { force: true });
  delete process.env.PLATFORM_DB_PATH;
});

describe("publication settings API", () => {
  it("GET /api/config/publication uses env bootstrap initially", async () => {
    const res = await fetch(`${baseUrl}/api/config/publication`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.publishedDays).toBe(1);
    expect(data.source).toBe("env");
  });

  it("teacher can publish day 2 without redeploy", async () => {
    const publish = await post("/api/config/publication/publish-day", { dayNumber: 2 });
    expect(publish.res.status).toBe(200);
    expect(publish.data.publishedDays).toBe(2);
    expect(publish.data.source).toBe("database");

    const configRes = await fetch(`${baseUrl}/api/config/publication`);
    const config = await configRes.json();
    expect(config.publishedDays).toBe(2);
    expect(config.source).toBe("database");
  });

  it("settings survive server restart simulation", async () => {
    await put("/api/config/publication", { publishedDays: 3, unlockPolicy: "sequential" });
    const after = getPublicationConfigFromFile();
    expect(after?.publishedDays).toBe(3);

    const { data } = await get("/api/config/publication");
    expect(data.publishedDays).toBe(3);
    expect(data.unlockPolicy).toBe("sequential");
  });

  it("teacher unlock-day logs override", async () => {
    await post("/api/config/publication/publish-day", { dayNumber: 2 });
    const unlock = await post("/api/teacher/students/stu-1165814631/unlock-day", {
      dayNumber: 2,
      reason: "manual unlock test",
    });
    expect(unlock.res.status).toBe(200);

    const logs = await get("/api/teacher/students/stu-1165814631/unlock-log");
    expect(logs.res.status).toBe(200);
    expect(logs.data.logs?.length).toBeGreaterThan(0);
    expect(logs.data.logs[0].reason).toContain("manual unlock");
  });
});

function getPublicationConfigFromFile() {
  if (!fs.existsSync(SETTINGS_PATH)) return null;
  const raw = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
  return raw.publication || null;
}
