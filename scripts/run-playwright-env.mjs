#!/usr/bin/env node
/**
 * Run Playwright with explicit PUBLISHED_DAYS for E2E splits.
 * Usage: node scripts/run-playwright-env.mjs --days=1 -- e2e/pilot-smoke.spec.js
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_PATH = path.join(__dirname, "../server/data/platform-settings.json");

function syncPublicationForE2e(days, policy) {
  let settings = {};
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
    }
  } catch {
    settings = {};
  }
  settings.publication = {
    publishedDays: Number(days) || 1,
    unlockPolicy: policy || "open",
    daySchedules: {},
    updatedBy: "e2e-runner",
    updatedAt: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf8");
}

const args = process.argv.slice(2);
let days = process.env.PUBLISHED_DAYS || "4";
let viteDays = process.env.VITE_PUBLISHED_DAYS || "";
let policy = process.env.STUDENT_UNLOCK_POLICY || "";
const passArgs = [];
for (let i = 0; i < args.length; i += 1) {
  if (args[i].startsWith("--days=")) {
    days = args[i].split("=")[1];
  } else if (args[i].startsWith("--vite-days=")) {
    viteDays = args[i].split("=")[1];
  } else if (args[i].startsWith("--policy=")) {
    policy = args[i].split("=")[1];
  } else if (args[i] === "--") {
    passArgs.push(...args.slice(i + 1));
    break;
  } else {
    passArgs.push(args[i]);
  }
}

const env = {
  ...process.env,
  PUBLISHED_DAYS: days,
  VITE_PUBLISHED_DAYS: viteDays || days,
};
if (policy) {
  env.STUDENT_UNLOCK_POLICY = policy;
  env.VITE_STUDENT_UNLOCK_POLICY = policy;
}
env.E2E_ALLOW_PROGRESS_SET = "1";

syncPublicationForE2e(days, policy || env.STUDENT_UNLOCK_POLICY || "open");

const bin = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(bin, ["playwright", "test", ...passArgs], {
  stdio: "inherit",
  env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
