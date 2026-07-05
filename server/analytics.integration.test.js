process.env.PLATFORM_DB_PATH = new URL("./data/analytics.integration.test.db", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createApp, prepareApp } from "./createApp.js";
import { closeDatabase, resetDatabaseForTests } from "./db/index.js";
import { loginStudent, authFetch } from "./testHelpers.js";

const TEST_DB = fileURLToPath(new URL("./data/analytics.integration.test.db", import.meta.url));

describe("analytics sync after auth", () => {
  let baseUrl;
  let server;

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
  });

  afterAll(async () => {
    await new Promise((resolve) => server?.close(resolve));
    closeDatabase();
    delete process.env.PLATFORM_DB_PATH;
  });

  it("POST /api/analytics/login succeeds with session + CSRF after login", async () => {
    const auth = await loginStudent(baseUrl, "1165814631");
    const res = await authFetch(baseUrl, "/api/analytics/login", {
      cookie: auth.cookie,
      csrf: auth.csrf,
      method: "POST",
      body: JSON.stringify({
        event: { at: new Date().toISOString(), sessionId: "test-session", success: true },
      }),
    });
    expect(res.ok).toBe(true);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.analytics?.loginCount).toBeGreaterThan(0);
  });
});
