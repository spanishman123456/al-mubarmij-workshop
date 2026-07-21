import { closeDatabase, persistDatabase } from "./db/index.js";
import { logError } from "./createApp.js";

let shuttingDown = false;

export function registerGracefulShutdown(server) {
  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(JSON.stringify({ scope: "server.shutdown", signal, at: new Date().toISOString() }));

    server.close((err) => {
      try {
        persistDatabase();
        closeDatabase();
      } catch (e) {
        logError("server.shutdown.db", e);
      }
      if (err) logError("server.shutdown", err);
      process.exit(err ? 1 : 0);
    });

    setTimeout(() => {
      logError("server.shutdown", new Error("forced exit after timeout"));
      process.exit(1);
    }, 10000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("uncaughtException", (err) => {
    logError("uncaughtException", err);
    shutdown("uncaughtException");
  });
  process.on("unhandledRejection", (err) => {
    logError("unhandledRejection", err);
  });
}
