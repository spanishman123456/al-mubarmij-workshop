/**
 * Compile Game Lab sources via mkc (official MakeCode CLI).
 * Run: node scripts/compileMakecodeGames.mjs
 */
import {
  writeFileSync,
  mkdirSync,
  rmSync,
  readFileSync,
  existsSync,
  readdirSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { spawnSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const WORK = join(ROOT, "scripts", "makecode-compile-workspace");
const OUT = join(ROOT, "scripts", "makecode-compile-results.json");

const { generateGameCode } = await import(
  pathToFileURL(join(ROOT, "src/features/microbit-game-lab/engine/codeGenerator.js")).href
);
const { HARDWARE_TESTS, HARDWARE_DRIVER } = await import(
  pathToFileURL(join(ROOT, "src/features/microbit-game-lab/hardware/hardwareDriver.js")).href
);
const { buildMakeCodeProject } = await import(
  pathToFileURL(join(ROOT, "src/features/microbit-game-lab/makecode/bridge.js")).href
);
const { assertValidMakeCodePython } = await import(
  pathToFileURL(join(ROOT, "src/features/microbit-game-lab/hardware/validateCode.js")).href
);

const GAMES = [
  "guess-number",
  "binary-system",
  "cipher",
  "search-sort",
  "score-counter",
  "logic-gates",
  "truth-table",
  "fibonacci",
  "hanoi",
];

function fullTest(name, logic) {
  return `${HARDWARE_DRIVER}\n# Test: ${name}\n${logic.trim()}\n`;
}

const targets = [
  ...GAMES.map((id) => ({ id, code: () => generateGameCode(id) })),
  ...Object.entries(HARDWARE_TESTS).map(([id, logic]) => ({
    id: `hw-${id}`,
    code: () => fullTest(id, logic),
  })),
];

function writeProject(dir, code) {
  const project = buildMakeCodeProject(code);
  for (const [name, content] of Object.entries(project.files)) {
    const filePath = join(dir, name);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content, "utf8");
  }
}

function npx(args, cwd) {
  return spawnSync(process.platform === "win32" ? "npx.cmd" : "npx", args, {
    cwd,
    encoding: "utf8",
    timeout: 180000,
    shell: process.platform === "win32",
  });
}

function findHex(dir) {
  const built = join(dir, "built");
  if (!existsSync(built)) return null;
  const files = readdirSync(built).filter((f) => f.endsWith(".hex"));
  return files[0] ? join(built, files[0]) : null;
}

rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });

const results = [];

for (const t of targets) {
  let code;
  try {
    code = t.code();
    assertValidMakeCodePython(code, t.id);
  } catch (err) {
    results.push({ id: t.id, validator: "fail", compile: "skip", error: String(err.message) });
    process.stdout.write(`${t.id}: VALIDATOR FAIL\n`);
    continue;
  }

  const dir = join(WORK, t.id);
  mkdirSync(dir, { recursive: true });

  if (!existsSync(join(dir, "pxt.json")) || !existsSync(join(dir, "mkc.json"))) {
    npx(["mkc", "init", "microbit"], dir);
  }

  writeProject(dir, code);
  const build = npx(["mkc", "build"], dir);
  const hexPath = findHex(dir);
  let hexValid = false;
  if (hexPath) {
    const hex = readFileSync(hexPath, "utf8");
    hexValid = hex.includes(":02000004") || /^:[0-9A-Fa-f]{2}/m.test(hex);
  }

  const errText = [build.stderr, build.stdout].filter(Boolean).join("\n").slice(-800);

  results.push({
    id: t.id,
    validator: "pass",
    compile: build.status === 0 && hexValid ? "pass" : "fail",
    hexFile: hexPath ? hexPath.replace(/\\/g, "/").replace(ROOT.replace(/\\/g, "/") + "/", "") : null,
    error: build.status === 0 && hexValid ? null : errText || "build failed",
  });

  process.stdout.write(`${t.id}: ${build.status === 0 && hexValid ? "OK" : "FAIL"}\n`);
}

writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log(`\nWrote ${OUT}`);
