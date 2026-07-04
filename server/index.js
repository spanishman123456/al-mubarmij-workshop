import { createApp, prepareApp, logError } from "./createApp.js";
import { registerGracefulShutdown } from "./shutdown.js";

const PORT = Number(process.env.PORT) || 3001;

async function start() {
  const app = createApp();
  await prepareApp(app);

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
