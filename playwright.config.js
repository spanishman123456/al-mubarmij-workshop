import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";

const PORT = 5173;
const API_PORT = 3011;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const E2E_DB = path.join(__dirname, "server", "data", "platform.e2e.db");
const E2E_TEACHER_PASSWORD = process.env.E2E_TEACHER_PASSWORD || "__e2e-teacher-local__";
const E2E_TEACHER_HASH =
  process.env.TEACHER_BCRYPT_HASH || bcrypt.hashSync(E2E_TEACHER_PASSWORD, 4);
process.env.E2E_TEACHER_PASSWORD = E2E_TEACHER_PASSWORD;

export default defineConfig({
  testDir: "e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 1,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
    locale: "ar-SA",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: `node server/index.js`,
      url: `http://127.0.0.1:${API_PORT}/api/health`,
      reuseExistingServer: false,
      timeout: 60_000,
      env: {
        PORT: String(API_PORT),
        PLATFORM_DB_PATH: E2E_DB,
        TEACHER_BCRYPT_HASH: E2E_TEACHER_HASH,
        PUBLISHED_DAYS: process.env.PUBLISHED_DAYS || "4",
        STUDENT_UNLOCK_POLICY: process.env.STUDENT_UNLOCK_POLICY || "sequential",
      },
    },
    {
      command: `npm run dev -- --host 127.0.0.1 --port ${PORT}`,
      url: `http://127.0.0.1:${PORT}`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        VITE_DEV_API_PORT: String(API_PORT),
        VITE_PUBLISHED_DAYS: process.env.VITE_PUBLISHED_DAYS || process.env.PUBLISHED_DAYS || "4",
      },
    },
  ],
});
