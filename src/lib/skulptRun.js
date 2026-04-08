/** تشغيل بايثون في المتصفح عبر Skulpt — مسارات الملفات تُحلّ عبر Vite (?url) لتعمل مع أي base ونشر ثابت */

import skulptMinUrl from "../assets/skulpt/skulpt.min.js?url";
import skulptStdlibUrl from "../assets/skulpt/skulpt-stdlib.js?url";

const SKULPT_SCRIPT_URLS = [skulptMinUrl, skulptStdlibUrl];

function waitForSkulpt(ms) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const id = setInterval(() => {
      if (typeof window !== "undefined" && window.Sk) {
        clearInterval(id);
        resolve(window.Sk);
        return;
      }
      if (performance.now() - start >= ms) {
        clearInterval(id);
        reject(new Error("timeout"));
      }
    }, 40);
  });
}

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (window.Sk) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error(`فشل تحميل المكتبة من ${src}`))
      );
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = () => resolve();
    s.onerror = () =>
      reject(new Error(`فشل تحميل محرك التنفيذ من ${src}`));
    document.head.appendChild(s);
  });
}

let inflight = null;

export function ensureSkulptLoaded() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Skulpt يعمل فقط في المتصفح"));
  }
  if (window.Sk) {
    return Promise.resolve(window.Sk);
  }
  if (!inflight) {
    inflight = (async () => {
      try {
        await waitForSkulpt(1500);
        return window.Sk;
      } catch {
        /* لم يُحمَّل بعد — نُحمِّل من عناوين Vite الثابتة */
      }
      for (const url of SKULPT_SCRIPT_URLS) {
        await loadScriptOnce(url);
      }
      await waitForSkulpt(45000);
      if (!window.Sk) {
        throw new Error(
          "تعذّر تحميل محرّك بايثون (Skulpt). أعد تحميل الصفحة بقوة (Ctrl+F5) أو جرّب متصفحاً آخر."
        );
      }
      return window.Sk;
    })().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

export async function runPythonWithSkulpt(code) {
  const Sk = await ensureSkulptLoaded();
  const out = [];
  function outf(text) {
    out.push(text);
  }
  function builtinRead(x) {
    if (!Sk.builtinFiles?.files?.[x]) {
      throw new Error("File not found: " + x);
    }
    return Sk.builtinFiles.files[x];
  }
  Sk.configure({
    output: outf,
    read: builtinRead,
    __future__: Sk.python3,
  });
  return Sk.misceval
    .asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true), Infinity)
    .then(() => out.join("") || "(لا يوجد إخراج)")
    .catch((err) => {
      throw err;
    });
}
