#!/usr/bin/env node
/** Timestamped backup of platform.db — run before deploy. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.PLATFORM_DB_PATH
  ? path.dirname(path.resolve(process.env.PLATFORM_DB_PATH))
  : path.join(__dirname, "..", "server", "data");
const dbPath = process.env.PLATFORM_DB_PATH
  ? path.resolve(process.env.PLATFORM_DB_PATH)
  : path.join(dataDir, "platform.db");

if (!fs.existsSync(dbPath)) {
  console.error(JSON.stringify({ ok: false, error: "database not found", path: dbPath }));
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const dest = path.join(dataDir, `platform-${stamp}.bak`);
fs.copyFileSync(dbPath, dest);
console.log(JSON.stringify({ ok: true, backup: dest, bytes: fs.statSync(dest).size }));
