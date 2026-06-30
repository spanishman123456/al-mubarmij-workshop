import { MGL_MAKECODE_ORIGIN } from "../types.js";

const PXT_JSON = JSON.stringify({
  name: "microbit-game-lab",
  description: "Micro:bit Unified Game Lab — MakeCode Python",
  files: ["main.py", "main.blocks", "main.ts", "README.md"],
  preferredEditor: "py",
  dependencies: {},
  testDependencies: {},
});

const MAIN_BLOCKS = `<xml xmlns="https://makecode.microbit.org/199-0-0-0"></xml>`;

const MAIN_TS = `\n// MakeCode Python project — main.py is the source of truth\n`;

const README = `# Micro:bit Unified Game Lab\n\nGenerated MakeCode Python. Edit main.py only.\n`;

/**
 * @param {string} code
 */
export function buildMakeCodeProject(code) {
  return {
    files: {
      "main.py": code,
      "main.blocks": MAIN_BLOCKS,
      "main.ts": MAIN_TS,
      "pxt.json": PXT_JSON,
      "README.md": README,
      "microbit/meta.json": JSON.stringify({ editor: "py", preferredEditor: "py" }),
    },
    text: {
      "main.py": code,
      "main.blocks": MAIN_BLOCKS,
      "main.ts": MAIN_TS,
      "pxt.json": PXT_JSON,
      "README.md": README,
    },
    meta: { editor: "py", preferredEditor: "py" },
  };
}

/**
 * @param {HTMLIFrameElement} iframe
 * @param {string} code
 */
export function postImportProject(iframe, code) {
  if (!iframe?.contentWindow) return false;
  const project = buildMakeCodeProject(code);
  iframe.contentWindow.postMessage(
    { type: "importproject", project },
    MGL_MAKECODE_ORIGIN,
  );
  return true;
}

/**
 * @param {HTMLIFrameElement} iframe
 */
export function postCompileRequest(iframe) {
  if (!iframe?.contentWindow) return false;
  iframe.contentWindow.postMessage({ type: "compile" }, MGL_MAKECODE_ORIGIN);
  return true;
}

/**
 * @param {MessageEvent} event
 * @param {(payload: object) => void} handler
 */
export function handleMakeCodeMessage(event, handler) {
  if (event.origin !== MGL_MAKECODE_ORIGIN) return;
  if (!event.data || typeof event.data !== "object") return;
  handler(event.data);
}

export const MAKECODE_IFRAME_URL = `${MGL_MAKECODE_ORIGIN}/?editor=PY#editor`;

export const HEX_USER_GUIDE =
  "يُنشأ ملف HEX حصريًا عبر Microsoft MakeCode الرسمي بعد نجاح استيراد المشروع وتجميعه. بعد التنزيل، انقل الملف إلى مجلد MICROBIT أو أرسله إلى الشريحة عبر WebUSB.";

/**
 * @param {string} code
 */
export function downloadMainPy(code) {
  const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "main.py";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * @param {string} code
 */
export async function copyCode(code) {
  try {
    await navigator.clipboard.writeText(code);
    return true;
  } catch {
    return false;
  }
}

/**
 * Compile via MakeCode public API (server-side verification).
 * @param {string} code
 * @returns {Promise<{ ok: boolean, hex?: string, error?: string }>}
 */
export async function compileViaMakeCodeApi(code) {
  const project = buildMakeCodeProject(code);
  const body = {
    target: "microbit",
    platformid: "codal",
    code: project.text["main.py"],
    files: project.files,
  };
  try {
    const res = await fetch(`${MGL_MAKECODE_ORIGIN}/api/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 500)}` };
    }
    const json = await res.json();
    if (json.success && json.out) {
      const hex = typeof json.out === "string" ? json.out : json.out.hex;
      if (hex && (hex.includes(":02000004") || /^:[0-9A-Fa-f]{2}/m.test(hex))) {
        return { ok: true, hex };
      }
    }
    const diag = json.diagnostics?.map((d) => d.messageText || d.message).join("; ");
    return { ok: false, error: diag || JSON.stringify(json).slice(0, 500) };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
}
