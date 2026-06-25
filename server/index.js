import express from "express";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import { initDb } from "./db.js";
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

let dbReady = false;

app.get("/api/health/live", (_req, res) => {
  res.json({ ok: true, service: "al-mubarmij-workshop-api", live: true });
});

app.get("/api/health", (_req, res) => {
  const startup = runStartupChecks();
  if (!startup.ok || !dbReady) {
    console.error("[health] startup checks failed", startup, { dbReady });
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

app.use("/api/auth", (req, res, next) => {
  if (!dbReady) {
    return sendError(res, 503, {
      code: "DATABASE_CONNECTION_FAILED",
      messageAr: "خدمة تسجيل الدخول قيد التشغيل. أعد المحاولة بعد لحظات.",
    });
  }
  next();
}, authRoutes);
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

async function main() {
  console.log("[boot]", {
    node: process.version,
    port: config.port,
    host: config.host,
    render: config.isRender ? "yes" : "no",
    nodeEnv: config.nodeEnv,
  });

  app.listen(config.port, config.host, () => {
    console.log(`[startup] listening on http://${config.host}:${config.port}`);
  });

  try {
    await initDb();
    dbReady = true;
  } catch (err) {
    console.error("[startup] database init failed", err);
    return;
  }

  const startup = runStartupChecks();
  if (!startup.ok) {
    console.error("[startup] FATAL", startup.error, startup.checks);
    return;
  }

  console.log("[startup] ready", startup.checks);

  setInterval(() => {
    if (!dbReady) return;
    try {
      purgeExpiredSessions();
    } catch (err) {
      console.error("[sessions] purge failed", err);
    }
  }, 5 * 60 * 1000);
}

main().catch((err) => {
  console.error("[startup] unhandled", err);
  process.exit(1);
});
