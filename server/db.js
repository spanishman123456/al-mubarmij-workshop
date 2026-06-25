import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";
import { config } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SQLJS_DIST = path.join(__dirname, "..", "node_modules", "sql.js", "dist");

/** @type {ReturnType<typeof createAdapter> | undefined} */
let adapter;
/** @type {Promise<ReturnType<typeof createAdapter>> | undefined} */
let initPromise;

function persistDatabase(rawDb) {
  const dir = path.dirname(config.databasePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(config.databasePath, Buffer.from(rawDb.export()));
}

/**
 * @param {import("sql.js").Database} rawDb
 * @param {() => void} persist
 */
function createAdapter(rawDb, persist) {
  return {
    prepare(sql) {
      return {
        run(...params) {
          rawDb.run(sql, params);
          persist();
          return { changes: rawDb.getRowsModified() };
        },
        get(...params) {
          const stmt = rawDb.prepare(sql);
          try {
            if (params.length) stmt.bind(params);
            if (stmt.step()) return stmt.getAsObject();
            return undefined;
          } finally {
            stmt.free();
          }
        },
        all(...params) {
          const stmt = rawDb.prepare(sql);
          const rows = [];
          try {
            if (params.length) stmt.bind(params);
            while (stmt.step()) rows.push(stmt.getAsObject());
            return rows;
          } finally {
            stmt.free();
          }
        },
      };
    },
    exec(sql) {
      rawDb.exec(sql);
      persist();
    },
    close() {
      rawDb.close();
      adapter = undefined;
      initPromise = undefined;
    },
  };
}

/** @param {import("sql.js").Database} database */
function migrate(database) {
  database.run(`
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

export async function initDb() {
  if (adapter) return adapter;
  if (!initPromise) {
    initPromise = (async () => {
      const SQL = await initSqlJs({
        locateFile: (file) => path.join(SQLJS_DIST, file),
      });

      const dir = path.dirname(config.databasePath);
      fs.mkdirSync(dir, { recursive: true });

      const rawDb = fs.existsSync(config.databasePath)
        ? new SQL.Database(fs.readFileSync(config.databasePath))
        : new SQL.Database();

      const persist = () => persistDatabase(rawDb);
      migrate(rawDb);
      persist();

      adapter = createAdapter(rawDb, persist);
      return adapter;
    })();
  }
  return initPromise;
}

export function getDb() {
  if (!adapter) {
    throw new Error("Database not initialized. Call initDb() before getDb().");
  }
  return adapter;
}

export function closeDb() {
  adapter?.close();
}
