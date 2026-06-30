import { MGL_MAKECODE_ORIGIN } from "../types.js";

/**
 * @param {HTMLIFrameElement} iframe
 * @param {string} code
 */
export function postImportProject(iframe, code) {
  if (!iframe?.contentWindow) return false;
  const project = {
    files: {
      "main.py": code,
      "microbit/meta.json": JSON.stringify({ editor: "py" }),
    },
    text: { "main.py": code },
    meta: { editor: "py" },
  };
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
