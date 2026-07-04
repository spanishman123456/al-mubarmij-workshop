import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCHEMA_SQL } from "./schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "platform.db");
const WASM_PATH = path.join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm");

let db = null;

function runSchema(database) {
  database.run(SCHEMA_SQL);
}

export function persistDatabase() {
  if (!db) return;
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export async function initDatabase() {
  if (db) return db;
  const SQL = await initSqlJs({ locateFile: () => WASM_PATH });
  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
    runSchema(db);
    persistDatabase();
  }
  runSchema(db);
  return db;
}

export function getDatabase() {
  if (!db) throw new Error("Database not initialized — call initDatabase() first");
  return db;
}

export { DB_PATH };
