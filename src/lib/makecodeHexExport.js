/**
 * تصدير مشاريع micro:bit — ملفات HEX مُجمَّعة مسبقاً (MakeCode/mkc).
 * لا يُنزَّل ملف .py بدلاً من HEX؛ عند الفشل يُعرض خيار MakeCode فقط.
 */

const MAKECODE_EDITOR = "https://makecode.microbit.org/?editor=PY#editor";

/**
 * @param {string} filename
 * @param {string} content
 * @param {string} mime
 */
function downloadBlob(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * @param {string} hex
 */
function isValidIntelHex(hex) {
  const sample = hex.trim().slice(0, 512);
  return sample.includes(":02000004") || /^:[0-9A-Fa-f]{2}/m.test(sample);
}

/**
 * @param {{ id: string, code: string, makecodeShareUrl?: string }} project
 * @returns {Promise<{ ok: boolean, messageAr: string, usedMakeCode?: boolean }>}
 */
export async function exportMicrobitHex(project) {
  const hexFilename = `${project.id}.hex`;
  const hexPath = project.hexPath ?? `/microbit-hex/${project.id}.hex`;

  let res;
  try {
    res = await fetch(hexPath, { cache: "no-cache" });
  } catch {
    return {
      ok: false,
      messageAr:
        "تعذّر الوصول لملف HEX على الخادم. استخدم «فتح في MakeCode» لإنشاء الملف وتنزيله من البيئة الرسمية.",
      usedMakeCode: false,
    };
  }

  if (!res.ok) {
    return {
      ok: false,
      messageAr: `ملف HEX غير متوفر (${res.status}). افتح المشروع في MakeCode ثم اضغط Download للحصول على ملف .hex حقيقي.`,
      usedMakeCode: false,
    };
  }

  const hex = await res.text();
  if (!isValidIntelHex(hex)) {
    return {
      ok: false,
      messageAr:
        "الملف الموجود على الخادم ليس HEX صالحاً. استخدم «فتح في MakeCode» لإكمال التجميع والتنزيل.",
      usedMakeCode: false,
    };
  }

  downloadBlob(hexFilename, hex, "application/x-microbit-hex");
  return {
    ok: true,
    messageAr: `تم تنزيل ${hexFilename} بنجاح. اسحبه إلى مجلد MICROBIT على جهازك.`,
    usedMakeCode: false,
  };
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
      ? "تم فتح MakeCode ونسخ الكود. الصقه (Ctrl+V) ثم اضغط Download للحصول على ملف .hex."
      : "تم فتح MakeCode. انسخ الكود من المنصة والصقه في المحرر ثم اضغط Download.",
  };
}

export const MICROBIT_FLASH_STEPS = [
  "اضغط «تصدير HEX» لتنزيل ملف .hex المُجمَّع، أو افتح MakeCode وحمّل من هناك.",
  "وصّل لوحة micro:bit بالكمبيوتر عبر USB.",
  "سيظهر مجلد MICROBIT — اسحب ملف .hex إليه.",
  "انتظر حتى تتوقف اللوحة عن الوميض — المشروع يعمل الآن!",
];
