import { createHash } from "node:crypto";
import { queryOne, runSql } from "../db/query.js";
import { persistDatabase } from "../db/index.js";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const BASE_LOCK_MS = 15 * 60 * 1000;

function hashKey(ip, identifier) {
  return createHash("sha256")
    .update(`${ip || "unknown"}:${identifier || ""}`)
    .digest("hex")
    .slice(0, 32);
}

export function ensureRateLimitSchema() {
  runSql(`
    CREATE TABLE IF NOT EXISTS auth_login_attempts (
      key_hash TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL DEFAULT 0,
      first_at TEXT NOT NULL,
      last_at TEXT NOT NULL,
      locked_until TEXT
    )
  `);
  runSql(`
    CREATE TABLE IF NOT EXISTS auth_login_failures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      at TEXT NOT NULL,
      ip_hash TEXT,
      reason TEXT NOT NULL
    )
  `);
}

export function checkLoginRateLimit(ip, identifier) {
  const key = hashKey(ip, identifier);
  const row = queryOne(`SELECT attempts, first_at, locked_until FROM auth_login_attempts WHERE key_hash = ?`, [key]);
  const now = Date.now();
  if (row?.locked_until && new Date(row.locked_until).getTime() > now) {
    return { allowed: false, retryAfterMs: new Date(row.locked_until).getTime() - now };
  }
  if (row && now - new Date(row.first_at).getTime() > WINDOW_MS) {
    runSql(`DELETE FROM auth_login_attempts WHERE key_hash = ?`, [key]);
    persistDatabase();
    return { allowed: true };
  }
  if (row && row.attempts >= MAX_ATTEMPTS) {
    const lockMs = BASE_LOCK_MS * Math.min(4, Math.floor(row.attempts / MAX_ATTEMPTS));
    const lockedUntil = new Date(now + lockMs).toISOString();
    runSql(`UPDATE auth_login_attempts SET locked_until = ? WHERE key_hash = ?`, [lockedUntil, key]);
    persistDatabase();
    return { allowed: false, retryAfterMs: lockMs };
  }
  return { allowed: true };
}

export function recordLoginFailure(ip, identifier, reason = "invalid_credentials") {
  const key = hashKey(ip, identifier);
  const now = new Date().toISOString();
  const ipHash = createHash("sha256").update(String(ip || "")).digest("hex").slice(0, 16);
  runSql(`INSERT INTO auth_login_failures (at, ip_hash, reason) VALUES (?, ?, ?)`, [now, ipHash, reason]);
  const row = queryOne(`SELECT attempts, first_at FROM auth_login_attempts WHERE key_hash = ?`, [key]);
  if (!row) {
    runSql(`INSERT INTO auth_login_attempts (key_hash, attempts, first_at, last_at) VALUES (?, 1, ?, ?)`, [
      key,
      now,
      now,
    ]);
  } else {
    const firstAt =
      Date.now() - new Date(row.first_at).getTime() > WINDOW_MS ? now : row.first_at;
    const attempts = firstAt === now ? 1 : row.attempts + 1;
    runSql(`UPDATE auth_login_attempts SET attempts = ?, first_at = ?, last_at = ? WHERE key_hash = ?`, [
      attempts,
      firstAt,
      now,
      key,
    ]);
  }
  persistDatabase();
}

export function clearLoginAttempts(ip, identifier) {
  runSql(`DELETE FROM auth_login_attempts WHERE key_hash = ?`, [hashKey(ip, identifier)]);
  persistDatabase();
}

export function purgeOldLoginFailures(maxAgeDays = 30) {
  const cutoff = new Date(Date.now() - maxAgeDays * 86400000).toISOString();
  runSql(`DELETE FROM auth_login_failures WHERE at < ?`, [cutoff]);
  runSql(`DELETE FROM auth_login_attempts WHERE last_at < ? AND (locked_until IS NULL OR locked_until < ?)`, [
    cutoff,
    new Date().toISOString(),
  ]);
  persistDatabase();
}
