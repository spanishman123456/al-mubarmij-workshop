import { zipSync, strToU8 } from "fflate";
import { validatePythonCode } from "./pyAppKit.js";
import { APPKIT_DESKTOP_PY } from "./templates/appkitDesktopPy.js";
import {
  buildWebAppHtml,
  buildPwaManifest,
  buildServiceWorker,
  buildPlaceholderIcon,
  ANDROID_FUTURE_README,
} from "./webAppBundle.js";

const EXE_BLOCKERS = [
  /import\s+pygame\b/i,
  /import\s+tkinter\b/i,
  /from\s+tkinter\b/i,
  /import\s+PIL\b/i,
  /import\s+cv2\b/i,
  /import\s+requests\b/i,
  /import\s+socket\b/i,
  /import\s+http\b/i,
  /import\s+flask\b/i,
  /import\s+django\b/i,
];

export function slugifyTitle(title) {
  const base = (title || "project")
    .trim()
    .replace(/[^\w\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40);
  return base || "project";
}

export function usesAppkit(code) {
  return /import\s+appkit\b/.test(code);
}

export function analyzeExportCapabilities(code, mode = "app") {
  const security = validatePythonCode(code);
  const isApp = mode === "app" || usesAppkit(code);
  const exeBlockedReason = security
    ? security
    : EXE_BLOCKERS.find((re) => re.test(code))
      ? "المشروع يستخدم مكتبة غير مدعومة في حزمة Windows الحالية."
      : null;

  return {
    zip: {
      ok: true,
      message: "متاح دائمًا — يحتوي الكود وملفات التشغيل والتعليمات.",
    },
    webApp: {
      ok: true,
      message: isApp
        ? "صفحة HTML تعمل في المتصفح — مناسبة للجوال والتابلت."
        : "صفحة HTML لتشغيل الكود النصي في المتصفح.",
    },
    pwa: {
      ok: true,
      message: "حزمة Web App مع manifest — يمكن إضافتها لشاشة الجوال الرئيسية.",
    },
    exe: {
      ok: !exeBlockedReason,
      message: exeBlockedReason
        ? exeBlockedReason
        : "حزمة بناء EXE لنظام Windows — شغّل build_windows.bat على جهاز Windows.",
      note: "ملف .exe لا يُنشأ داخل المتصفح مباشرة؛ يُبنى محليًا عبر PyInstaller.",
    },
    apk: {
      ok: false,
      future: true,
      message: "تصدير APK مخطط للإصدارات القادمة — استخدم Web App / PWA حاليًا.",
    },
  };
}

export function downloadBytes(bytes, filename, mime = "application/octet-stream") {
  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function buildReadme({ title, mode, authorName, slug }) {
  const isApp = mode === "app";
  return `# ${title || "مشروع برمجة الحاسب"}

مشروع طالب — منصة برمجة الحاسب (موهبة)

${authorName ? `**الطالب:** ${authorName}\n` : ""}
**النوع:** ${isApp ? "مشروع رسومي (appkit)" : "برنامج نصي (Console)"}

## التشغيل السريع (Python)

\`\`\`bash
python main.py
\`\`\`

${isApp ? "يتطلب ملف `appkit.py` المرفق (واجهة Tkinter).\n" : ""}

## بناء ملف Windows (.exe)

> **ملاحظة:** ملف exe يعمل على **Windows فقط** — للجوال استخدم مجلد webapp أو ملف HTML.

1. ثبّت Python 3.10+ من https://python.org
2. افتح موجه الأوامر في هذا المجلد
3. شغّل:
   \`\`\`
   build_windows.bat
   \`\`\`
4. ستجد الملف في مجلد \`dist/${slug}.exe\`

## المتطلبات

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Web App / الجوال

- افتح \`webapp/index.html\` في المتصفح
- أو شغّل خادمًا محليًا: \`python -m http.server 8080\`
- على الجوال: أضف الصفحة إلى الشاشة الرئيسية

## Android APK (مستقبلي)

راجع \`ANDROID_FUTURE.md\`

---
تم التصدير من مختبر بايثون — برمجة الحاسب
`;
}

function buildRequirements(isApp) {
  const lines = ["# متطلبات مشروع برمجة الحاسب", "pyinstaller>=6.0"];
  if (isApp) lines.push("# appkit مدمج محليًا — لا حاجة لتثبيت إضافي");
  return lines.join("\n") + "\n";
}

function buildWindowsBat(slug) {
  return `@echo off
chcp 65001 >nul
echo ========================================
echo  بناء ملف EXE — برمجة الحاسب
echo  المشروع: ${slug}
echo ========================================
python --version >nul 2>&1
if errorlevel 1 (
  echo خطأ: Python غير مثبت. ثبّته من https://python.org
  pause
  exit /b 1
)
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python build_windows.py
if exist "dist\\${slug}.exe" (
  echo.
  echo نجح البناء! الملف: dist\\${slug}.exe
) else (
  echo.
  echo لم يُعثر على الملف — راجع رسائل الخطأ أعلاه.
)
pause
`;
}

function buildWindowsPy(slug, isApp, windowed) {
  const args = ["main.py", "--onefile", "--name", slug, "--clean", "--noconfirm"];
  if (windowed) args.push("--windowed");
  else args.push("--console");
  if (isApp) args.push("--hidden-import", "tkinter");
  return `# -*- coding: utf-8 -*-
"""سكربت PyInstaller — يُنشئ dist/${slug}.exe"""
import PyInstaller.__main__

PyInstaller.__main__.run(${JSON.stringify(args)})
`;
}

function zipProjectFiles({ title, code, mode, authorName, includeWebApp = true, includeExeKit = true }) {
  const slug = slugifyTitle(title);
  const isApp = mode === "app" || usesAppkit(code);
  const windowed = isApp;
  const prefix = slug;
  const files = {};

  files[`${prefix}/main.py`] = strToU8(code);
  files[`${prefix}/README.md`] = strToU8(buildReadme({ title, mode: isApp ? "app" : "console", authorName, slug }));
  files[`${prefix}/requirements.txt`] = strToU8(buildRequirements(isApp));
  files[`${prefix}/ANDROID_FUTURE.md`] = strToU8(ANDROID_FUTURE_README);

  if (isApp) {
    files[`${prefix}/appkit.py`] = strToU8(APPKIT_DESKTOP_PY);
  }

  if (includeExeKit) {
    files[`${prefix}/build_windows.bat`] = strToU8(buildWindowsBat(slug));
    files[`${prefix}/build_windows.py`] = strToU8(buildWindowsPy(slug, isApp, windowed));
    files[`${prefix}/EXE_README.txt`] = strToU8(
      `بناء ملف EXE لنظام Windows فقط\r\n\r\n1. افتح build_windows.bat\r\n2. انتظر حتى ينتهي البناء\r\n3. شغّل dist\\${slug}.exe\r\n\r\nللجوال: استخدم مجلد webapp\r\n`,
    );
  }

  if (includeWebApp) {
    const html = buildWebAppHtml({ title, code, mode: isApp ? "app" : "console" });
    files[`${prefix}/webapp/index.html`] = strToU8(html);
    files[`${prefix}/webapp/manifest.webmanifest`] = strToU8(buildPwaManifest({ title }));
    files[`${prefix}/webapp/sw.js`] = strToU8(buildServiceWorker());
    files[`${prefix}/webapp/README.txt`] = strToU8(
      "افتح index.html في المتصفح.\r\nللتجربة الكاملة: python -m http.server 8080\r\nثم افتح http://localhost:8080/webapp/\r\n",
    );
  }

  return { slug, bytes: zipSync(files), isApp };
}

export function exportProjectZip({ title, code, mode, authorName }) {
  const caps = analyzeExportCapabilities(code, mode);
  if (!caps.zip.ok) return { ok: false, message: caps.zip.message };
  const { slug, bytes } = zipProjectFiles({ title, code, mode, authorName, includeWebApp: true, includeExeKit: true });
  downloadBytes(bytes, `${slug}-project.zip`, "application/zip");
  return {
    ok: true,
    message: `تم تحميل ${slug}-project.zip — يحتوي الكود وREADME وWeb App وحزمة بناء EXE.`,
  };
}

export function exportWindowsExeKit({ title, code, mode, authorName }) {
  const caps = analyzeExportCapabilities(code, mode);
  if (!caps.exe.ok) {
    return { ok: false, message: caps.exe.message, note: caps.exe.note };
  }
  const slug = slugifyTitle(title);
  const isApp = mode === "app" || usesAppkit(code);
  const windowed = isApp;
  const prefix = `${slug}-windows-build`;
  const files = {};
  files[`${prefix}/main.py`] = strToU8(code);
  if (isApp) files[`${prefix}/appkit.py`] = strToU8(APPKIT_DESKTOP_PY);
  files[`${prefix}/requirements.txt`] = strToU8(buildRequirements(isApp));
  files[`${prefix}/build_windows.bat`] = strToU8(buildWindowsBat(slug));
  files[`${prefix}/build_windows.py`] = strToU8(buildWindowsPy(slug, isApp, windowed));
  files[`${prefix}/README.txt`] = strToU8(
    `حزمة بناء EXE — Windows فقط\r\n\r\nشغّل build_windows.bat\r\nالناتج: dist\\${slug}.exe\r\n\r\n${caps.exe.note}\r\n`,
  );
  downloadBytes(zipSync(files), `${slug}-windows-build.zip`, "application/zip");
  return {
    ok: true,
    message: `تم تحميل حزمة بناء EXE. افتح build_windows.bat على Windows لإنشاء ${slug}.exe`,
    note: caps.exe.note,
  };
}

export function exportWebAppHtml({ title, code, mode }) {
  const caps = analyzeExportCapabilities(code, mode);
  if (!caps.webApp.ok) return { ok: false, message: caps.webApp.message };
  const slug = slugifyTitle(title);
  const html = buildWebAppHtml({ title, code, mode });
  downloadBytes(strToU8(html), `${slug}.html`, "text/html;charset=utf-8");
  return {
    ok: true,
    message: `تم تحميل ${slug}.html — افتحه في المتصفح (يفضّل عبر خادم محلي لتحميل Skulpt).`,
  };
}

export function exportPwaZip({ title, code, mode }) {
  const caps = analyzeExportCapabilities(code, mode);
  if (!caps.pwa.ok) return { ok: false, message: caps.pwa.message };
  const slug = slugifyTitle(title);
  const isApp = mode === "app" || usesAppkit(code);
  const files = {};
  const webPrefix = `${slug}-webapp`;
  files[`${webPrefix}/index.html`] = strToU8(buildWebAppHtml({ title, code, mode: isApp ? "app" : "console" }));
  files[`${webPrefix}/manifest.webmanifest`] = strToU8(buildPwaManifest({ title }));
  files[`${webPrefix}/sw.js`] = strToU8(buildServiceWorker());
  files[`${webPrefix}/README.txt`] = strToU8(
    "Web App / PWA — برمجة الحاسب\r\n\r\n1. python -m http.server 8080\r\n2. افتح http://localhost:8080\r\n3. على الجوال: Add to Home Screen\r\n",
  );
  files[`${webPrefix}/ANDROID_FUTURE.md`] = strToU8(ANDROID_FUTURE_README);

  try {
    files[`${webPrefix}/icon-192.png`] = buildPlaceholderIcon(192);
    files[`${webPrefix}/icon-512.png`] = buildPlaceholderIcon(512);
  } catch {
    /* optional */
  }

  downloadBytes(zipSync(files), `${slug}-webapp.zip`, "application/zip");
  return {
    ok: true,
    message: `تم تحميل ${slug}-webapp.zip — مناسب للجوال والتابلت (PWA).`,
  };
}
