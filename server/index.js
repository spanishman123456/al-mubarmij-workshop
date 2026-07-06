import { createApp, prepareApp, logError } from "./createApp.js";
import { registerGracefulShutdown } from "./shutdown.js";
import { assertProductionAuthConfig } from "./auth/password.js";
import { deleteSessionsForRole } from "./auth/sessionRepository.js";
import { getDbPath } from "./db/index.js";
import fs from "node:fs";
import path from "node:path";

const PORT = Number(process.env.PORT) || 3001;

function maybeRevokeTeacherSessionsOnce() {
  if (process.env.REVOKE_TEACHER_SESSIONS !== "1") return;
  const marker = path.join(path.dirname(getDbPath()), ".teacher-sessions-revoked");
  if (fs.existsSync(marker)) {
    console.log(JSON.stringify({ scope: "auth.revoke", message: "skipped — already revoked", at: new Date().toISOString() }));
    return;
  }
  deleteSessionsForRole("teacher");
  fs.writeFileSync(marker, new Date().toISOString(), "utf8");
  console.log(JSON.stringify({ scope: "auth.revoke", message: "teacher sessions cleared (one-time)", at: new Date().toISOString() }));
}

async function start() {
  assertProductionAuthConfig();
  const app = createApp();
  await prepareApp(app);

  maybeRevokeTeacherSessionsOnce();

  const server = app.listen(PORT, () => {
    console.log(JSON.stringify({
      scope: "server.start",
      port: PORT,
      env: process.env.NODE_ENV || "development",
      pid: process.pid,
      at: new Date().toISOString(),
    }));
  });

  registerGracefulShutdown(server);
}

start().catch((err) => {
  logError("server.start", err);
  process.exit(1);
});
