import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/** مسار قابل للكتابة على Render (بدون قرص دائم) */
function resolveDatabasePath() {
  if (process.env.DATABASE_PATH) return process.env.DATABASE_PATH;
  if (process.env.RENDER) {
    return path.join(ROOT, "data", "sessions.db");
  }
  return path.join(ROOT, "data", "sessions.db");
}

export const config = {
  port: Number(process.env.PORT) || 3001,
  host: process.env.HOST || "0.0.0.0",
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isRender: Boolean(process.env.RENDER),
  sessionSecret: process.env.SESSION_SECRET || "dev-only-change-in-production",
  cookieName: "mb_session",
  databasePath: resolveDatabasePath(),
  distPath: path.join(ROOT, "dist"),
  /** أقصى مدة للجلسة (8 ساعات) */
  absoluteSessionMs: Number(process.env.SESSION_ABSOLUTE_MS) || 8 * 60 * 60 * 1000,
  /** انتهاء عند عدم النشاط (30 دقيقة) */
  idleSessionMs: Number(process.env.SESSION_IDLE_MS) || 30 * 60 * 1000,
  /** تحديث last_activity في DB — كل دقيقتين كحد أقصى */
  activityWriteThrottleMs: Number(process.env.SESSION_ACTIVITY_THROTTLE_MS) || 2 * 60 * 1000,
};

/** @returns {{ ok: boolean, error?: string }} */
export function validateServerConfig() {
  if (config.isProduction && config.sessionSecret === "dev-only-change-in-production") {
    return {
      ok: false,
      error: "SESSION_SECRET is not configured for production.",
    };
  }
  if (!fs.existsSync(config.distPath)) {
    return {
      ok: false,
      error: `Build output missing at ${config.distPath}. Run npm run build first.`,
    };
  }
  return { ok: true };
}
