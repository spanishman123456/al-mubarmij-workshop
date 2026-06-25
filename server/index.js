import express from "express";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import { attachSession } from "./auth/middleware.js";
import { purgeExpiredSessions } from "./auth/sessionService.js";
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
  res.json({ ok: true, service: "al-mubarmij-workshop" });
});

if (fs.existsSync(config.distPath)) {
  app.use(express.static(config.distPath, { index: false, maxAge: config.isProduction ? "1d" : 0 }));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(config.distPath, "index.html"));
  });
}

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
