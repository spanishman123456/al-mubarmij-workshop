import { getDatabase } from "./index.js";

export function queryAll(sql, params = []) {
  const db = getDatabase();
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

export function queryOne(sql, params = []) {
  const rows = queryAll(sql, params);
  return rows[0] || null;
}

export function runSql(sql, params = []) {
  const db = getDatabase();
  db.run(sql, params);
}
