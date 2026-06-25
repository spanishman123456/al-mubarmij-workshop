import express from "express";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import { attachSession } from "./auth/middleware.js";
import { purgeExpiredSessions } from "./auth/sessionService.js";
import { sendError } from "./lib/apiResponse.js";
import authRoutes from "./routes/auth.js";
import teacherRoutes from "./routes/teacher.js";

const app = express();

app.set("trust proxy", 1);
app.use(express.json({ limit: "64kb" }));
app.use(cookieParser(config.sessionSecret));

app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);

/** التحقق من الجلسة لأي طلب API محمي مستقبلي */
app.use("/api", attachSession, (req, res, next) => {
  if (req.method === "GET" && req.path === "/health") return next();
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ success: true, ok: true, service: "al-mubarmij-workshop" });
});

app.use("/api", (_req, res) => {
  sendError(res, 404, { code: "NOT_FOUND", messageAr: "المسار المطلوب غير موجود." });
});

if (fs.existsSync(config.distPath)) {
  app.use(express.static(config.distPath, { index: false, maxAge: config.isProduction ? "1d" : 0 }));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(config.distPath, "index.html"));
  });
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

setInterval(() => {
  try {
    purgeExpiredSessions();
  } catch (err) {
    console.error("[sessions] purge failed", err);
  }
}, 5 * 60 * 1000);

app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
  purgeExpiredSessions();
});
