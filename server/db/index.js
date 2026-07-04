import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCHEMA_SQL } from "./schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB_PATH = path.join(__dirname, "..", "data", "platform.db");

function getDbPath() {
  return process.env.PLATFORM_DB_PATH ? path.resolve(process.env.PLATFORM_DB_PATH) : DEFAULT_DB_PATH;
}

function getDbTmpPath() {
  return `${getDbPath()}.tmp`;
}

function getDbBackupPath() {
  return `${getDbPath()}.bak`;
}
const WASM_PATH = path.join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm");

let db = null;
let persisting = false;
let persistAgain = false;
let writeCount = 0;

function runSchema(database) {
  database.run(SCHEMA_SQL);
}

function atomicWriteFile(targetPath, buffer) {
  const tmpPath = `${targetPath}.tmp`;
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(tmpPath, buffer);
  if (process.platform === "win32" && fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { force: true });
  }
  fs.renameSync(tmpPath, targetPath);
}

/** Persist to disk — synchronous, coalesced, atomic rename + rolling backup */
export function persistDatabase() {
  if (!db) return;
  if (persisting) {
    persistAgain = true;
    return;
  }
  persisting = true;
  try {
    do {
      persistAgain = false;
      const buffer = Buffer.from(db.export());
      const dbPath = getDbPath();
      if (fs.existsSync(dbPath)) {
        try {
          fs.copyFileSync(dbPath, getDbBackupPath());
        } catch {
          /* best-effort backup */
        }
      }
      atomicWriteFile(dbPath, buffer);
      writeCount += 1;
    } while (persistAgain);
  } finally {
    persisting = false;
  }
}

export async function initDatabase() {
  if (db) return db;
  const SQL = await initSqlJs({ locateFile: () => WASM_PATH });
  if (fs.existsSync(getDbPath())) {
    db = new SQL.Database(fs.readFileSync(getDbPath()));
  } else {
    db = new SQL.Database();
    runSchema(db);
    persistDatabase();
  }
  runSchema(db);
  return db;
}

export function closeDatabase() {
  if (!db) return;
  persistDatabase();
  db.close();
  db = null;
}

export function getDatabase() {
  if (!db) throw new Error("Database not initialized — call initDatabase() first");
  return db;
}

export function resetDatabaseForTests() {
  if (db) {
    db.close();
    db = null;
  }
}

export { getDbPath as DB_PATH, getDbBackupPath as DB_BACKUP_PATH, writeCount as __writeCountForTests };
