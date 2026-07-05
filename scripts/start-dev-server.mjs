#!/usr/bin/env node
/**
 * Dev server launcher: port check, safe stale-process detection, smoke test.
 * Use --check-only to inspect port 3001 without killing anything.
 */
import { spawn, execSync } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT) || 3001;
const HOST = "127.0.0.1";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CHECK_ONLY = process.argv.includes("--check-only");

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

function pidsOnPortWindows(port) {
  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
    const pids = new Set();
    for (const line of out.split("\n")) {
      if (!line.includes("LISTENING")) continue;
      const m = line.trim().match(/\s(\d+)\s*$/);
      if (m) pids.add(m[1]);
    }
    return [...pids];
  } catch {
    return [];
  }
}

function isProjectServerPid(pid) {
  if (!pid || pid === "0") return false;
  try {
    const cmd = execSync(`wmic process where ProcessId=${pid} get CommandLine /format:list`, {
      encoding: "utf8",
    });
    const normalized = cmd.replace(/\\/g, "/").toLowerCase();
    const rootNorm = ROOT.replace(/\\/g, "/").toLowerCase();
    return (
      normalized.includes("server/index.js") &&
      (normalized.includes(rootNorm) || normalized.includes("al-mubarmij-workshop"))
    );
  } catch {
    return false;
  }
}

function inspectPort(port) {
  const pids = process.platform === "win32" ? pidsOnPortWindows(port) : [];
  const details = pids.map((pid) => ({ pid, projectServer: isProjectServerPid(pid) }));
  return { port, pids, details };
}

function killProjectServerPids(port) {
  const info = inspectPort(port);
  let killed = 0;
  for (const { pid, projectServer } of info.details) {
    if (!projectServer) {
      log("dev-server.skip-pid", {
        port,
        pid,
        reason: "not_project_server",
        hint: "Stop manually or use another PORT",
      });
      continue;
    }
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
      killed += 1;
      log("dev-server.kill-stale", { port, pid });
    } catch {
      /* ignore */
    }
  }
  return killed;
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
  const busy = await portInUse(PORT);
  const inspection = inspectPort(PORT);

  if (CHECK_ONLY) {
    log("dev-server.check-only", { busy, ...inspection });
    if (busy && !inspection.details.some((d) => d.projectServer)) {
      console.error(
        `Port ${PORT} is in use by a non-project process. Manual action required:`,
        inspection,
      );
      process.exit(2);
    }
    process.exit(busy ? 0 : 1);
  }

  if (busy) {
    log("dev-server.port-busy", inspection);
    if (process.platform === "win32") {
      const killed = killProjectServerPids(PORT);
      if (killed === 0 && (await portInUse(PORT))) {
        console.error(
          `Port ${PORT} still busy. Non-project process — stop manually:\n${JSON.stringify(inspection, null, 2)}`,
        );
        process.exit(2);
      }
      await new Promise((r) => setTimeout(r, 500));
    } else {
      console.error(`Port ${PORT} busy — set PORT or stop the process manually.`);
      process.exit(2);
    }
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
