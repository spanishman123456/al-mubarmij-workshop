/**
 * يجمّع مشاريع micro:bit إلى ملفات HEX حقيقية عبر أداة MakeCode الرسمية (mkc).
 * التشغيل: npm run build:microbit-hex
 */
import { spawn } from "node:child_process";
import { copyFile, mkdir, readFile, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const WORKSPACE = join(__dirname, "microbit-hex-workspace");
const OUT_DIR = join(ROOT, "public", "microbit-hex");

const PXT_JSON = {
  name: "microbit-export",
  version: "0.0.0",
  files: ["main.py", "microbit/meta.json"],
  supportedTargets: ["microbit"],
  dependencies: { core: "*", radio: "*", microphone: "*" },
  testDependencies: {},
};

const MKC_JSON = {
  targetWebsite: "https://makecode.microbit.org/beta",
  links: {},
};

const META_JSON = { editor: "py" };

/** @param {string} cmd @param {string[]} args @param {string} cwd */
function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function ensureWorkspace() {
  await mkdir(WORKSPACE, { recursive: true });
  await mkdir(join(WORKSPACE, "microbit"), { recursive: true });

  const hasPxt = await exists(join(WORKSPACE, "pxt.json"));
  if (!hasPxt) {
    console.log("Initializing mkc workspace (first run may take ~1 min)…");
    await run("npx", ["mkc", "init", "microbit"], WORKSPACE);
  }

  await writeFile(join(WORKSPACE, "pxt.json"), JSON.stringify(PXT_JSON, null, 4));
  await writeFile(join(WORKSPACE, "mkc.json"), JSON.stringify(MKC_JSON, null, 2));
  await writeFile(join(WORKSPACE, "microbit", "meta.json"), JSON.stringify(META_JSON));
}

/** @param {string} code */
async function compileProjectCode(code) {
  await writeFile(join(WORKSPACE, "main.py"), code.trim() + "\n");
  await run("npx", ["mkc", "build"], WORKSPACE);
  const hexPath = join(WORKSPACE, "built", "binary.hex");
  const hex = await readFile(hexPath, "utf8");
  if (!hex.includes(":02000004") && !hex.startsWith(":020000040000FA")) {
    throw new Error("Compiler output is not a valid Intel HEX file");
  }
  return hex;
}

async function main() {
  const { MICROBIT_PROJECTS } = await import(
    pathToFileURL(join(ROOT, "src/data/microbitProjects.js")).href
  );

  await ensureWorkspace();
  await mkdir(OUT_DIR, { recursive: true });

  let ok = 0;
  let failed = 0;

  for (const project of MICROBIT_PROJECTS) {
    process.stdout.write(`Compiling ${project.id}… `);
    try {
      const hex = await compileProjectCode(project.code);
      const outPath = join(OUT_DIR, `${project.id}.hex`);
      await writeFile(outPath, hex, "utf8");
      console.log(`OK → public/microbit-hex/${project.id}.hex (${hex.split("\n").length} lines)`);
      ok += 1;
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      failed += 1;
    }
  }

  console.log(`\nDone: ${ok} succeeded, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
