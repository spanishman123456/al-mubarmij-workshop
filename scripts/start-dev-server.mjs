#!/usr/bin/env node
/**
 * Dev server launcher: port check, stale process cleanup, smoke test after start.
 * Exit code 4294967295 on Windows = external kill (SIGKILL/taskkill) — logged on shutdown.
 */
import { spawn, execSync } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT) || 3001;
const HOST = "127.0.0.1";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function log(scope, extra = {}) {
  console.log(JSON.stringify({ scope, ...extra, at: new Date().toISOString() }));
}

function portInUse(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once("error", () => resolve(true));
    srv.once("listening", () => srv.close(() => resolve(false)));
    srv.listen(port, HOST);
  });
}

function killPortWindows(port) {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
    const pids = new Set();
    for (const line of out.split("\n")) {
      const m = line.trim().match(/\s(\d+)\s*$/);
      if (m) pids.add(m[1]);
    }
    for (const pid of pids) {
      if (pid && pid !== "0") {
        log("dev-server.kill-stale", { port, pid });
        try {
          execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        } catch {
          /* ignore */
        }
      }
    }
  } catch {
    /* no process on port */
  }
}

async function smokeTest(url, attempts = 20) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      const body = await res.json();
      if (body.ok) return body;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Smoke test failed: ${url}`);
}

async function main() {
  if (await portInUse(PORT)) {
    log("dev-server.port-busy", { port: PORT });
    if (process.platform === "win32") killPortWindows(PORT);
    await new Promise((r) => setTimeout(r, 500));
  }

  const child = spawn(process.execPath, ["server/index.js"], {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env, PORT: String(PORT) },
  });

  child.on("exit", (code, signal) => {
    log("dev-server.child-exit", {
      code,
      signal,
      note: code === 4294967295 ? "Windows unsigned exit — likely external kill" : undefined,
    });
    process.exit(code ?? 1);
  });

  const health = await smokeTest(`http://${HOST}:${PORT}/api/health`);
  log("dev-server.smoke-ok", { port: PORT, health });

  process.on("SIGINT", () => {
    log("dev-server.sigint");
    child.kill("SIGINT");
  });
  process.on("SIGTERM", () => {
    log("dev-server.sigterm");
    child.kill("SIGTERM");
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
