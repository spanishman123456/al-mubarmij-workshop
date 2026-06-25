import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { config } from "./config.js";

let db;

export function getDb() {
  if (!db) {
    const dir = path.dirname(config.databasePath);
    fs.mkdirSync(dir, { recursive: true });
    db = new Database(config.databasePath);
    db.pragma("journal_mode = WAL");
    migrate(db);
  }
  return db;
}

/** @param {import("better-sqlite3").Database} database */
function migrate(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_role TEXT NOT NULL CHECK(user_role IN ('student', 'teacher')),
      token_hash TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL,
      last_activity_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      revoked_at INTEGER,
      revoke_reason TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id, user_role);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);

    CREATE UNIQUE INDEX IF NOT EXISTS idx_student_single_active
      ON sessions(user_id)
      WHERE user_role = 'student' AND revoked_at IS NULL;

    CREATE TABLE IF NOT EXISTS security_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      user_id TEXT,
      user_role TEXT,
      session_id TEXT,
      actor_id TEXT,
      created_at INTEGER NOT NULL,
      meta_json TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_audit_created ON security_audit(created_at DESC);
  `);
}

export function closeDb() {
  if (db) {
    db.close();
    db = undefined;
  }
}
