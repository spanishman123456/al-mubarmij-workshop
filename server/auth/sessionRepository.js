import { randomBytes } from "node:crypto";
import { queryOne, runSql } from "../db/query.js";
import { persistDatabase } from "../db/index.js";

const SESSION_MS = 8 * 60 * 60 * 1000;
const ACCESS_LOG_RETENTION_DAYS = 30;

export function ensureSessionSchema() {
  runSql(`
    CREATE TABLE IF NOT EXISTS auth_sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      csrf_token TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    )
  `);
  runSql(`
    CREATE TABLE IF NOT EXISTS auth_access_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      at TEXT NOT NULL,
      ip TEXT,
      path TEXT,
      reason TEXT NOT NULL,
      user_id TEXT
    )
  `);
  try {
    runSql(`ALTER TABLE auth_sessions ADD COLUMN csrf_token TEXT NOT NULL DEFAULT ''`);
  } catch {
    /* column exists */
  }
  purgeExpiredSessions();
  purgeOldAccessLogs(ACCESS_LOG_RETENTION_DAYS);
}

export function createSession(userId, role) {
  const token = randomBytes(32).toString("hex");
  const csrfToken = randomBytes(24).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_MS);
  runSql(
    `INSERT INTO auth_sessions (token, user_id, role, csrf_token, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [token, userId, role, csrfToken, now.toISOString(), expiresAt.toISOString()],
  );
  persistDatabase();
  return { token, csrfToken, expiresAt: expiresAt.toISOString() };
}

export function getSession(token) {
  if (!token) return null;
  const row = queryOne(
    `SELECT user_id, role, csrf_token, expires_at FROM auth_sessions WHERE token = ?`,
    [token],
  );
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    runSql(`DELETE FROM auth_sessions WHERE token = ?`, [token]);
    persistDatabase();
    return null;
  }
  return {
    userId: row.user_id,
    role: row.role,
    csrfToken: row.csrf_token,
    expiresAt: row.expires_at,
  };
}

export function deleteSession(token) {
  if (!token) return;
  runSql(`DELETE FROM auth_sessions WHERE token = ?`, [token]);
  persistDatabase();
}

export function deleteSessionsForUser(userId) {
  if (!userId) return;
  runSql(`DELETE FROM auth_sessions WHERE user_id = ?`, [userId]);
  persistDatabase();
}

export function purgeExpiredSessions() {
  runSql(`DELETE FROM auth_sessions WHERE expires_at < ?`, [new Date().toISOString()]);
  persistDatabase();
}

export function purgeOldAccessLogs(maxAgeDays = ACCESS_LOG_RETENTION_DAYS) {
  const cutoff = new Date(Date.now() - maxAgeDays * 86400000).toISOString();
  runSql(`DELETE FROM auth_access_log WHERE at < ?`, [cutoff]);
  persistDatabase();
}

/** Logs only: timestamp, ip, path, reason code, userId — never passwords/tokens/bodies */
export function logAccessDenied({ ip, path, reason, userId }) {
  runSql(
    `INSERT INTO auth_access_log (at, ip, path, reason, user_id) VALUES (?, ?, ?, ?, ?)`,
    [new Date().toISOString(), ip || null, path || null, reason, userId || null],
  );
  persistDatabase();
}

export function logFailedLoginAttempt({ ip, reason }) {
  runSql(`INSERT INTO auth_access_log (at, ip, path, reason, user_id) VALUES (?, ?, ?, ?, ?)`, [
    new Date().toISOString(),
    ip || null,
    "/api/auth/login",
    reason,
    null,
  ]);
  persistDatabase();
}
