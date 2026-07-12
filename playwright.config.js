import { defineConfig } from "@playwright/test";
import process from "node:process";

export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  retries: 0,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4173",
    locale: "ar-SA",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "npm run dev:server",
      url: "http://127.0.0.1:3001/api/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { ...process.env, PORT: "3001" },
    },
    {
      command: "npm run dev -- --host 127.0.0.1 --port 4173",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
