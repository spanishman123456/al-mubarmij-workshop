import fs from "node:fs";
import { getDb, initDb } from "../db.js";
import { config, validateServerConfig } from "../config.js";
import { purgeExpiredSessions } from "../auth/sessionService.js";

/** @returns {Promise<{ ok: boolean, checks: Record<string, string>, error?: string }>} */
export async function runStartupChecksAsync() {
  try {
    await initDb();
  } catch (err) {
    return {
      ok: false,
      checks: { database: "failed" },
      error: err instanceof Error ? err.message : "Database initialization failed",
    };
  }
  return runStartupChecks();
}

/** @returns {{ ok: boolean, checks: Record<string, string>, error?: string }} */
export function runStartupChecks() {
  const checks = {
    nodeEnv: config.nodeEnv,
    render: config.isRender ? "yes" : "no",
    dist: fs.existsSync(config.distPath) ? "ok" : "missing",
    sessionSecret: config.isProduction
      ? config.sessionSecret !== "dev-only-change-in-production"
        ? "ok"
        : "missing"
      : "dev",
  };

  const configCheck = validateServerConfig();
  if (!configCheck.ok) {
    return { ok: false, checks, error: configCheck.error };
  }

  try {
    getDb();
    checks.database = "ok";
    checks.databasePath = config.databasePath;
    purgeExpiredSessions();
  } catch (err) {
    checks.database = "failed";
    return {
      ok: false,
      checks,
      error: err instanceof Error ? err.message : "Database initialization failed",
    };
  }

  return { ok: true, checks };
}
