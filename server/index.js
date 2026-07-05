import { createApp, prepareApp, logError } from "./createApp.js";
import { registerGracefulShutdown } from "./shutdown.js";
import { assertProductionAuthConfig } from "./auth/password.js";
import { deleteSessionsForRole } from "./auth/sessionRepository.js";

const PORT = Number(process.env.PORT) || 3001;

async function start() {
  assertProductionAuthConfig();
  const app = createApp();
  await prepareApp(app);

  if (process.env.REVOKE_TEACHER_SESSIONS === "1") {
    deleteSessionsForRole("teacher");
    console.log(JSON.stringify({ scope: "auth.revoke", message: "teacher sessions cleared", at: new Date().toISOString() }));
  }

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
