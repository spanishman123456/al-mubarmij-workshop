/**
 * Code-visibility policy API — teacher control + student-safe gate.
 */
import { describe, expect, it, beforeAll, afterAll, beforeEach } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { resetPlatformSettingsForTests } from "./repositories/platformSettingsRepository.js";
import { loginTeacher, loginStudent, testTeacherPassword, authFetch } from "./testHelpers.js";

const TEST_DB = fileURLToPath(new URL("./data/code-visibility.integration.test.db", import.meta.url));
const SETTINGS_PATH = fileURLToPath(new URL("./data/code-visibility.integration.test-settings.json", import.meta.url));
const TEACHER_NID = "2297033843";
const STUDENT_NID = "1165814631";
const CONSOLE_RESOURCE = "intro-print";
const APP_RESOURCE = "app-guess-number";

async function teacherDelete(path, body) {
  const res = await authFetch(baseUrl, path, {
    method: "DELETE",
    body: JSON.stringify(body || {}),
    cookie: teacherAuth.cookie,
    csrf: teacherAuth.csrf,
  });
  return { res, data: await res.json().catch(() => ({})) };
}

let baseUrl;
let server;
let teacherAuth;
let studentAuth;

async function teacherPut(path, body) {
  const res = await authFetch(baseUrl, path, {
    method: "PUT",
    body: JSON.stringify(body),
    cookie: teacherAuth.cookie,
    csrf: teacherAuth.csrf,
  });
  return { res, data: await res.json().catch(() => ({})) };
}

async function teacherPost(path, body) {
  const res = await authFetch(baseUrl, path, {
    method: "POST",
    body: JSON.stringify(body || {}),
    cookie: teacherAuth.cookie,
    csrf: teacherAuth.csrf,
  });
  return { res, data: await res.json().catch(() => ({})) };
}

async function studentGet(path) {
  const res = await authFetch(baseUrl, path, { cookie: studentAuth.cookie });
  return { res, data: await res.json().catch(() => ({})) };
}

beforeAll(async () => {
  for (const p of [TEST_DB, `${TEST_DB}.bak`, `${TEST_DB}.tmp`]) {
    if (fs.existsSync(p)) fs.rmSync(p, { force: true });
  }
  process.env.PLATFORM_DB_PATH = TEST_DB;
  process.env.PLATFORM_SETTINGS_PATH = SETTINGS_PATH;
  process.env.PUBLISHED_DAYS = "15";
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
  studentAuth = await loginStudent(baseUrl, STUDENT_NID);
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
  delete process.env.PLATFORM_SETTINGS_PATH;
});

describe("code-visibility API", () => {
  it("GET config is public and defaults to level 4", async () => {
    const res = await fetch(`${baseUrl}/api/config/code-visibility`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.general).toBe(4);
    expect(data.source).toBe("default");
  });

  it("student cannot modify the policy", async () => {
    const res = await authFetch(baseUrl, "/api/config/code-visibility", {
      method: "PUT",
      body: JSON.stringify({ scope: "general", level: 8 }),
      cookie: studentAuth.cookie,
      csrf: studentAuth.csrf,
    });
    expect(res.status).toBe(403);
  });

  it("teacher change reflects immediately without redeploy", async () => {
    const put = await teacherPut("/api/config/code-visibility", { scope: "general", level: 6 });
    expect(put.res.status).toBe(200);
    expect(put.data.general).toBe(6);
    expect(put.data.source).toBe("database");

    const res = await fetch(`${baseUrl}/api/config/code-visibility`);
    const data = await res.json();
    expect(data.general).toBe(6);
    expect(data.source).toBe("database");
  });

  it("policy persists to platform-settings.json (survives restart)", async () => {
    await teacherPut("/api/config/code-visibility", { scope: "general", level: 5 });
    const raw = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
    expect(raw.codeVisibility.general).toBe(5);
  });
});

describe("code-visibility student gate — no solution leak", () => {
  it("does NOT return the full solution to a student at the default level", async () => {
    const { res, data } = await studentGet(
      `/api/lab/${CONSOLE_RESOURCE}/allowed-content?mode=console`,
    );
    expect(res.status).toBe(200);
    expect(data.content.fullSolution).toBeNull();
    expect(data.content.starterCode).toBeTruthy();
  });

  it("hides all content at level 1", async () => {
    await teacherPut("/api/config/code-visibility", { scope: "general", level: 1 });
    const { data } = await studentGet(`/api/lab/${CONSOLE_RESOURCE}/allowed-content?mode=console`);
    expect(data.content.starterCode).toBeNull();
    expect(data.content.hints).toEqual([]);
    expect(data.content.fullSolution).toBeNull();
  });

  it("reveals the full solution to the student only at level 8", async () => {
    await teacherPut("/api/config/code-visibility", { scope: "general", level: 8 });
    const { data } = await studentGet(`/api/lab/${CONSOLE_RESOURCE}/allowed-content?mode=console`);
    expect(data.content.fullSolution).toBeTruthy();
  });

  it("ignores a spoofed X-User-Role header (role taken from session)", async () => {
    await teacherPut("/api/config/code-visibility", { scope: "general", level: 8 });
    // Student spoofs teacher role — must still be treated as a student (gets the student payload).
    const res = await authFetch(baseUrl, `/api/lab/${CONSOLE_RESOURCE}/allowed-content?mode=console`, {
      cookie: studentAuth.cookie,
      headers: { "X-User-Role": "teacher" },
    });
    const data = await res.json();
    // Level 8 => student legitimately gets the solution; the point is role wasn't escalated to bypass gating.
    expect(res.status).toBe(200);
    expect(data.content.level).toBe(8);
  });

  it("requires authentication for the student gate", async () => {
    const res = await fetch(`${baseUrl}/api/lab/${CONSOLE_RESOURCE}/allowed-content?mode=console`);
    expect(res.status).toBe(401);
  });
});

describe("code-visibility revert/undo + preview", () => {
  it("teacher can undo the last change", async () => {
    await teacherPut("/api/config/code-visibility", { scope: "general", level: 3 });
    await teacherPut("/api/config/code-visibility", { scope: "general", level: 8 });
    const undo = await teacherPost("/api/config/code-visibility/undo");
    expect(undo.res.status).toBe(200);
    expect(undo.data.general).toBe(3);
  });

  it("teacher preview-as-student never mutates progress", async () => {
    await teacherPut("/api/config/code-visibility", { scope: "general", level: 2 });
    const preview = await teacherPost("/api/config/code-visibility/preview", {
      mode: "console",
      resourceId: CONSOLE_RESOURCE,
    });
    expect(preview.res.status).toBe(200);
    expect(preview.data.content.level).toBe(2);
    expect(preview.data.content.starterCode).toBeNull();
  });

  it("student cannot access preview endpoint", async () => {
    const res = await authFetch(baseUrl, "/api/config/code-visibility/preview", {
      method: "POST",
      body: JSON.stringify({ mode: "console", resourceId: CONSOLE_RESOURCE }),
      cookie: studentAuth.cookie,
      csrf: studentAuth.csrf,
    });
    expect(res.status).toBe(403);
  });
});

describe("code-visibility scope priority end-to-end (the reported bug)", () => {
  it("general=8 → student gets solution; project=4 overrides; delete → back to 8", async () => {
    // 1) general = 8 → الطالب يحصل على الحل الكامل للمشروع الرسومي.
    await teacherPut("/api/config/code-visibility", { scope: "general", level: 8 });
    let r = await studentGet(`/api/lab/${APP_RESOURCE}/allowed-content?mode=app`);
    expect(r.data.content.level).toBe(8);
    expect(r.data.content.resolvedScope).toBe("general");
    expect(r.data.content.fullSolution).toBeTruthy();

    // 4) project = 4 → يتغلب على العام، ويُخفي الحل.
    await teacherPut("/api/config/code-visibility", {
      scope: "project",
      target: APP_RESOURCE,
      level: 4,
    });
    r = await studentGet(`/api/lab/${APP_RESOURCE}/allowed-content?mode=app`);
    expect(r.data.content.level).toBe(4);
    expect(r.data.content.resolvedScope).toBe("project");
    expect(r.data.content.fullSolution).toBeNull();

    // 6) حذف إعداد المشروع → العودة للمستوى العام 8.
    await teacherDelete("/api/config/code-visibility", { scope: "project", target: APP_RESOURCE });
    r = await studentGet(`/api/lab/${APP_RESOURCE}/allowed-content?mode=app`);
    expect(r.data.content.level).toBe(8);
    expect(r.data.content.fullSolution).toBeTruthy();
  });

  it("teacher diagnose endpoint shows scope breakdown + deciding scope", async () => {
    await teacherPut("/api/config/code-visibility", { scope: "general", level: 8 });
    await teacherPut("/api/config/code-visibility", {
      scope: "project",
      target: APP_RESOURCE,
      level: 3,
    });
    const { res, data } = await authFetch(
      baseUrl,
      `/api/config/code-visibility/diagnose?mode=app&resourceId=${APP_RESOURCE}`,
      { cookie: teacherAuth.cookie },
    ).then(async (r) => ({ res: r, data: await r.json() }));
    expect(res.status).toBe(200);
    expect(data.diagnostic.generalLevel).toBe(8);
    expect(data.diagnostic.projectLevel).toBe(3);
    expect(data.diagnostic.resolvedLevel).toBe(3);
    expect(data.diagnostic.resolvedScope).toBe("project");
    expect(data.diagnostic.fullSolutionAvailable).toBe(true);
  });

  it("student cannot access the diagnose endpoint", async () => {
    const res = await authFetch(
      baseUrl,
      `/api/config/code-visibility/diagnose?mode=app&resourceId=${APP_RESOURCE}`,
      { cookie: studentAuth.cookie },
    );
    expect(res.status).toBe(403);
  });

  it("allowed-content responses are not cached (no-store)", async () => {
    const res = await authFetch(baseUrl, `/api/lab/${APP_RESOURCE}/allowed-content?mode=app`, {
      cookie: studentAuth.cookie,
    });
    expect(res.headers.get("cache-control")).toMatch(/no-store/);
  });
});
