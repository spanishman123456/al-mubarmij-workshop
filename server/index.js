import express from "express";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import { attachSession } from "./auth/middleware.js";
import { sendError, sendSuccess } from "./lib/apiResponse.js";
import { runStartupChecks } from "./lib/startup.js";
import { purgeExpiredSessions } from "./auth/sessionService.js";
import authRoutes from "./routes/auth.js";
import teacherRoutes from "./routes/teacher.js";

const app = express();

app.set("trust proxy", 1);
app.use(express.json({ limit: "64kb" }));
app.use(cookieParser(config.sessionSecret));

app.get("/api/health", (_req, res) => {
  const startup = runStartupChecks();
  if (!startup.ok) {
    console.error("[health] startup checks failed", startup);
    return sendError(res, 503, {
      code: "SERVER_CONFIGURATION_ERROR",
      messageAr: "خدمة المصادقة غير جاهزة. يرجى التواصل مع مسؤول المنصة.",
    });
  }
  return sendSuccess(res, {
    service: "al-mubarmij-workshop",
    auth: "ready",
    database: "ok",
    checks: startup.checks,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);

app.use("/api", attachSession, (_req, res) => {
  sendError(res, 404, { code: "NOT_FOUND", messageAr: "المسار المطلوب غير موجود." });
});

if (fs.existsSync(config.distPath)) {
  app.use(express.static(config.distPath, { index: false, maxAge: config.isProduction ? "1d" : 0 }));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(config.distPath, "index.html"));
  });
} else {
  console.warn("[startup] dist folder missing — API only mode");
}

/** @type {import("express").ErrorRequestHandler} */
app.use((err, _req, res, next) => {
  if (res.headersSent) return next(err);
  if (err instanceof SyntaxError && "body" in err) {
    return sendError(res, 400, {
      code: "INVALID_JSON",
      messageAr: "طلب غير صالح. يرجى إعادة المحاولة.",
    });
  }
  console.error("[server]", err);
  sendError(res, 500, {
    code: "SERVER_ERROR",
    messageAr: "حدث خطأ في الخادم. يرجى إعادة المحاولة.",
  });
});

const startup = runStartupChecks();
if (!startup.ok) {
  console.error("[startup] FATAL", startup.error, startup.checks);
  process.exit(1);
}

console.log("[startup] ready", startup.checks);

setInterval(() => {
  try {
    purgeExpiredSessions();
  } catch (err) {
    console.error("[sessions] purge failed", err);
  }
}, 5 * 60 * 1000);

app.listen(config.port, config.host, () => {
  console.log(`[startup] listening on http://${config.host}:${config.port}`);
});
