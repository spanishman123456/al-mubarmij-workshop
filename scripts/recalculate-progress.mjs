#!/usr/bin/env node
/**
 * إعادة احتساب تقدم جميع الطلاب من سجلات الخادم.
 * Usage: npm run recalculate:progress
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initDatabase, closeDatabase } from "../server/db/index.js";
import { recalculateAllStudentsProgress } from "../server/progress/progressCalculationService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dbPath = process.env.PLATFORM_DB_PATH || path.join(root, "server/data/platform.db");

async function main() {
  if (!fs.existsSync(dbPath)) {
    console.error(`Database not found: ${dbPath}`);
    process.exit(1);
  }

  const backupPath = `${dbPath}.backup-${Date.now()}`;
  fs.copyFileSync(dbPath, backupPath);
  console.info(`Backup created: ${backupPath}`);

  await initDatabase();

  const report = recalculateAllStudentsProgress({
    reason: "npm_recalculate_progress",
    persistSnapshot: true,
  });

  console.info(JSON.stringify(report, null, 2));
  console.info(`Students with changed percent: ${report.changed}`);

  closeDatabase();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
