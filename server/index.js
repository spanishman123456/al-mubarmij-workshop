import { createApp, prepareApp, logError } from "./createApp.js";

const PORT = Number(process.env.PORT) || 3001;

async function start() {
  const app = createApp();
  await prepareApp(app);

  app.listen(PORT, () => {
    console.log(`[server] listening on ${PORT} (${process.env.NODE_ENV || "development"})`);
  });
}

start().catch((err) => {
  logError("server.start", err);
  process.exit(1);
});
