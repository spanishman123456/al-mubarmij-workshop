import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  sessionSecret: process.env.SESSION_SECRET || "dev-only-change-in-production",
  cookieName: "mb_session",
  databasePath: process.env.DATABASE_PATH || path.join(ROOT, "data", "sessions.db"),
  distPath: path.join(ROOT, "dist"),
  /** أقصى مدة للجلسة (8 ساعات) */
  absoluteSessionMs: Number(process.env.SESSION_ABSOLUTE_MS) || 8 * 60 * 60 * 1000,
  /** انتهاء عند عدم النشاط (30 دقيقة) */
  idleSessionMs: Number(process.env.SESSION_IDLE_MS) || 30 * 60 * 1000,
  /** تحديث last_activity في DB — كل دقيقتين كحد أقصى */
  activityWriteThrottleMs: Number(process.env.SESSION_ACTIVITY_THROTTLE_MS) || 2 * 60 * 1000,
};
