#!/usr/bin/env node
/**
 * Run Playwright with explicit PUBLISHED_DAYS for E2E splits.
 * Usage: node scripts/run-playwright-env.mjs --days=1 -- e2e/pilot-smoke.spec.js
 */
import { spawnSync } from "node:child_process";

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

const bin = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(bin, ["playwright", "test", ...passArgs], {
  stdio: "inherit",
  env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
