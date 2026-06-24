/**
 * تصدير مشاريع micro:bit — HEX و MakeCode
 */

const MAKECODE_EDITOR = "https://makecode.microbit.org/?editor=PY";

/**
 * @param {string} filename
 * @param {string} content
 * @param {string} mime
 */
function downloadText(filename, content, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * @param {string} text
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {{ id: string, title: string, code: string, hexPath?: string, makecodeShareUrl?: string }} project
 * @returns {Promise<{ ok: boolean, messageAr: string }>}
 */
export async function exportMicrobitHex(project) {
  const hexPath = project.hexPath ?? `/microbit-hex/${project.id}.hex`;

  try {
    const res = await fetch(hexPath);
    if (res.ok) {
      const hex = await res.text();
      if (hex.includes(":02000004") || hex.includes(":10")) {
        downloadText(`${project.id}.hex`, hex, "application/x-microbit-hex");
        return {
          ok: true,
          messageAr: "تم تنزيل ملف HEX. اسحبه إلى مجلد MICROBIT على جهازك.",
        };
      }
    }
  } catch {
    /* bundled hex unavailable */
  }

  try {
    const compiled = await compileViaMakeCodeService(project.code, project.title);
    if (compiled) {
      downloadText(`${project.id}.hex`, compiled, "application/x-microbit-hex");
      return {
        ok: true,
        messageAr: "تم إنشاء ملف HEX عبر خدمة MakeCode وتنزيله بنجاح.",
      };
    }
  } catch (e) {
    console.warn("MakeCode compile failed", e);
  }

  downloadText(`${project.id}.py`, project.code, "text/x-python");
  return {
    ok: false,
    messageAr:
      "تعذّر إنشاء HEX تلقائياً. تم تنزيل ملف .py — افتح MakeCode والصق الكود، ثم اضغط «Download» للحصول على HEX.",
  };
}

/**
 * @param {string} code
 * @param {string} title
 * @returns {Promise<string|null>}
 */
async function compileViaMakeCodeService(code, title) {
  const payload = {
    name: title || "microbit-project",
    target: "microbit",
    targetVersion: "",
    editor: "py",
    files: {
      "main.py": code,
      "microbit/meta.json": JSON.stringify({ editor: "py" }),
    },
  };

  const endpoints = [
    "https://makecode.microbit.org/---compile",
    "https://maker.makecode.com/v0/compile",
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (text.includes(":02000004") || text.startsWith(":020000040000FA")) {
        return text;
      }
    } catch {
      /* CORS or network — try next */
    }
  }
  return null;
}

/**
 * @param {{ code: string, makecodeShareUrl?: string }} project
 * @returns {Promise<{ ok: boolean, messageAr: string, url: string }>}
 */
export async function openInMakeCode(project) {
  if (project.makecodeShareUrl) {
    window.open(project.makecodeShareUrl, "_blank", "noopener,noreferrer");
    return {
      ok: true,
      url: project.makecodeShareUrl,
      messageAr: "تم فتح المشروع في MakeCode.",
    };
  }

  const copied = await copyToClipboard(project.code);
  window.open(MAKECODE_EDITOR, "_blank", "noopener,noreferrer");

  return {
    ok: true,
    url: MAKECODE_EDITOR,
    messageAr: copied
      ? "تم فتح MakeCode ونسخ الكود. الصقه (Ctrl+V) ثم اضغط Download."
      : "تم فتح MakeCode. انسخ الكود من المنصة والصقه في المحرر.",
  };
}

export const MICROBIT_FLASH_STEPS = [
  "اضغط «تصدير HEX» أو افتح MakeCode وحمّل الملف.",
  "وصّل لوحة micro:bit بالكمبيوتر عبر USB.",
  "سيظهر مجلد MICROBIT — اسحب ملف .hex إليه.",
  "انتظر حتى تتوقف اللوحة عن الوميض — المشروع يعمل الآن!",
];
