process.env.PLATFORM_DB_PATH = new URL("../data/platform.test.db", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TEST_DB = fileURLToPath(new URL("../data/platform.test.db", import.meta.url));

describe("SQLite persistence (sql.js)", () => {
  beforeAll(() => {
    for (const p of [TEST_DB, `${TEST_DB}.bak`, `${TEST_DB}.tmp`]) {
      if (fs.existsSync(p)) fs.rmSync(p, { force: true });
    }
  });

  afterAll(() => {
    for (const p of [TEST_DB, `${TEST_DB}.bak`, `${TEST_DB}.tmp`]) {
      if (fs.existsSync(p)) fs.rmSync(p, { force: true });
    }
    delete process.env.PLATFORM_DB_PATH;
  });

  it("persists lesson attempts across re-init", async () => {
    const dbMod = await import("./index.js");
    const queryMod = await import("./query.js");

    dbMod.resetDatabaseForTests();
    await dbMod.initDatabase();
    queryMod.runSql(
      `INSERT INTO lesson_attempts (student_id, lesson_id, exercise_id, answer, correct, hints_used, created_at)
       VALUES ('stu-test', 'number-systems', 'gp1', '101', 1, 0, datetime('now'))`,
    );
    dbMod.persistDatabase();
    dbMod.closeDatabase();

    dbMod.resetDatabaseForTests();
    await dbMod.initDatabase();
    const row = queryMod.queryOne(
      `SELECT answer, correct FROM lesson_attempts WHERE student_id = 'stu-test' AND exercise_id = 'gp1'`,
    );
    expect(row?.answer).toBe("101");
    expect(row?.correct).toBe(1);
    dbMod.closeDatabase();
  });
});
