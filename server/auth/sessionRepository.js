import { randomBytes } from "node:crypto";
import { queryOne, runSql } from "../db/query.js";
import { persistDatabase } from "../db/index.js";

const SESSION_MS = 8 * 60 * 60 * 1000;

export function ensureSessionSchema() {
  runSql(`
    CREATE TABLE IF NOT EXISTS auth_sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
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
}

export function createSession(userId, role) {
  const token = randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_MS);
  runSql(
    `INSERT INTO auth_sessions (token, user_id, role, created_at, expires_at) VALUES (?, ?, ?, ?, ?)`,
    [token, userId, role, now.toISOString(), expiresAt.toISOString()],
  );
  persistDatabase();
  return { token, expiresAt: expiresAt.toISOString() };
}

export function getSession(token) {
  if (!token) return null;
  const row = queryOne(`SELECT user_id, role, expires_at FROM auth_sessions WHERE token = ?`, [token]);
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    runSql(`DELETE FROM auth_sessions WHERE token = ?`, [token]);
    persistDatabase();
    return null;
  }
  return { userId: row.user_id, role: row.role, expiresAt: row.expires_at };
}

export function deleteSession(token) {
  if (!token) return;
  runSql(`DELETE FROM auth_sessions WHERE token = ?`, [token]);
  persistDatabase();
}

export function logAccessDenied({ ip, path, reason, userId }) {
  runSql(
    `INSERT INTO auth_access_log (at, ip, path, reason, user_id) VALUES (?, ?, ?, ?, ?)`,
    [new Date().toISOString(), ip || null, path || null, reason, userId || null],
  );
  persistDatabase();
}
