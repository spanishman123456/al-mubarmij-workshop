import { zipSync, strToU8 } from "fflate";
import { validatePythonCode } from "./pyAppKit.js";
import { validateDesktopAppkitCode } from "./appkitDesktopValidate.js";
import { APPKIT_DESKTOP_PY } from "./templates/appkitDesktopPy.js";
import { MAIN_LAUNCHER_PY, VERIFY_EXPORT_PY } from "./templates/mainLauncherPy.js";
import { getGraphicProject } from "../data/graphicAppProjects.js";
import { EXE_BINARY_NAME, exeBinaryName, safeExportSlug, buildProjectMeta } from "./exportSlugs.js";
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

export { safeExportSlug, EXE_BINARY_NAME, exeBinaryName };

export function usesAppkit(code) {
  return /import\s+appkit\b/.test(code);
}

function desktopValidationError(code, mode) {
  const security = validatePythonCode(code);
  if (security) return security;
  const isApp = mode === "app" || usesAppkit(code);
  if (!isApp) return "التصدير كـ EXE متاح للمشاريع الرسومية (appkit) فقط. استخدم ZIP أو Web App.";
  return validateDesktopAppkitCode(code);
}

function webAppBuildOpts({ title, code, mode, templateId }) {
  const project = templateId ? getGraphicProject(templateId) : null;
  const isApp = mode === "app" || usesAppkit(code);
  return {
    title,
    code,
    mode: isApp ? "app" : "console",
    edu: project?.edu ?? null,
    displayTitle: project?.titleAr || title,
  };
}

export function analyzeExportCapabilities(code, mode = "app", { templateId = null, title = null } = {}) {
  const security = validatePythonCode(code);
  const isApp = mode === "app" || usesAppkit(code);
  const desktopError = desktopValidationError(code, mode);
  const exeBlockedReason = security
    ? security
    : EXE_BLOCKERS.find((re) => re.test(code))
      ? "المشروع يستخدم مكتبة غير مدعومة في حزمة Windows الحالية."
      : desktopError;

  const slug = safeExportSlug(title, templateId);
  const exeFile = `${exeBinaryName(slug)}.exe`;

  return {
    zip: {
      ok: true,
      message: "متاح دائمًا — كود + README + Web App + سكربتات بناء آمنة.",
    },
    webApp: {
      ok: true,
      message: isApp
        ? "صفحة HTML للمتصفح — مناسبة للجوال والتابلت."
        : "صفحة HTML لتشغيل الكود النصي في المتصفح.",
    },
    pwa: {
      ok: true,
      message: "حزمة Web App مع manifest — أضفها لشاشة الجوال.",
    },
    exe: {
      ok: !exeBlockedReason,
      message: exeBlockedReason
        ? exeBlockedReason
        : `حزمة بناء Windows — شغّل build_windows.bat ثم افتح dist\\${exeFile}`,
      note: `ملف EXE يُنشأ على Windows عبر PyInstaller. اسم الملف: ${exeFile}`,
    },
    apk: {
      ok: false,
      future: true,
      message: "تصدير APK مخطط لاحقًا — استخدم Web App / PWA حاليًا.",
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

function buildReadme({ title, mode, authorName, safeSlug, exeName }) {
  const isApp = mode === "app";
  const exeFile = `${exeName}.exe`;
  return `# ${title || "مشروع برمجة الحاسب"}

مشروع طالب — منصة برمجة الحاسب (موهبة)

${authorName ? `**الطالب:** ${authorName}\n` : ""}
**معرّف التصدير (إنجليزي):** \`${safeSlug}\`
**النوع:** ${isApp ? "مشروع رسومي (appkit → Tkinter)" : "برنامج نصي (Console)"}

## التشغيل السريع بدون بناء EXE

1. ثبّت Python 3.10+ من https://python.org
2. انقر مرتين على **run_with_python.bat**
   أو من موجه الأوامر:
   \`\`\`bash
   python main.py
   \`\`\`

${isApp ? "يتطلب ملف `appkit.py` و`project.py` المرفقين (واجهة Tkinter على سطح المكتب).\n" : ""}

## بناء ملف Windows (.exe) — واجهة رسومية مستقلة

> ملف exe يعمل على **Windows فقط**. للجوال استخدم مجلد **webapp/**.

1. ثبّت Python 3.10+ (فعّل "Add to PATH")
2. انقر مرتين على **build_windows.bat** (نص إنجليزي فقط — متوافق مع CMD)
3. بعد النجاح شغّل **launch_app.bat** أو افتح:
   \`dist/${exeFile}\`

> **مهم:** اسم الملف التنفيذي: \`${exeFile}\` (إنجليزي) لتجنب مشاكل الأحرف العربية في CMD.

## المتطلبات

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Web App / الجوال

- افتح \`webapp/index.html\` في المتصفح (يفضّل: \`python -m http.server 8080\`)
- أو استخدم ملف HTML المُصدَّر من المختبر مباشرة

## Android APK (مستقبلي)

راجع \`ANDROID_FUTURE.md\`

---
تم التصدير من مختبر بايثون — برمجة الحاسب
`;
}

function buildRequirements(isApp) {
  const lines = ["# Mubarmij project requirements", "pyinstaller>=6.0"];
  if (isApp) lines.push("# appkit.py is bundled locally");
  return lines.join("\n") + "\n";
}

/** ملفات BAT — ASCII فقط — لا تضع نصًا عربيًا هنا أبدًا */
function buildWindowsBat(exeName) {
  return `@echo off
setlocal EnableExtensions
cd /d "%~dp0"
echo ========================================
echo  Mubarmij - Build Windows EXE
echo  Output: dist\\${exeName}.exe
echo ========================================
python --version >nul 2>&1
if errorlevel 1 (
  echo ERROR: Python not found. Install from https://python.org
  echo Enable "Add Python to PATH" during install.
  pause
  exit /b 1
)
python verify_export.py
if errorlevel 1 (
  echo.
  echo VERIFY FAILED. Fix project.py then rebuild.
  echo See debug_log.txt for details.
  pause
  exit /b 1
)
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python build_windows.py
if exist "dist\\${exeName}.exe" (
  echo.
  echo SUCCESS: dist\\${exeName}.exe
  echo Run launch_app.bat to start the app.
) else (
  echo.
  echo BUILD FAILED. Read the error messages above.
  echo You can still run: run_with_python.bat
)
pause
`;
}

function buildLaunchAppBat(exeName) {
  return `@echo off
setlocal EnableExtensions
cd /d "%~dp0"
if exist "dist\\${exeName}.exe" (
  start "" "dist\\${exeName}.exe"
) else (
  echo EXE not built yet. Run build_windows.bat first.
  echo Or use run_with_python.bat to test with Python.
  pause
)
`;
}

function buildRunWithPythonBat() {
  return `@echo off
setlocal EnableExtensions
cd /d "%~dp0"
python --version >nul 2>&1
if errorlevel 1 (
  echo ERROR: Python not found.
  pause
  exit /b 1
)
python main.py
pause
`;
}

function buildWindowsPy(exeName, isApp) {
  const windowed = isApp;
  const args = [
    "main.py",
    "--onefile",
    "--name",
    exeName,
    "--clean",
    "--noconfirm",
    windowed ? "--windowed" : "--console",
    "--hidden-import",
    "tkinter",
    "--hidden-import",
    "tkinter.ttk",
  ];
  return `# -*- coding: utf-8 -*-
"""Build ${exeName}.exe with PyInstaller (run via build_windows.bat)"""
import os
import PyInstaller.__main__

os.chdir(os.path.dirname(os.path.abspath(__file__)))

PyInstaller.__main__.run(${JSON.stringify(args)})
`;
}

function buildExeReadmeTxt(title, exeName) {
  return [
    "Mubarmij - Windows EXE build kit",
    "================================",
    "",
    `Project title (display): ${title || "Mubarmij Project"}`,
    `EXE file name: ${exeName}.exe`,
    "",
    "Steps:",
    "1. Install Python 3.10+ with PATH enabled",
    "2. Double-click build_windows.bat (runs verify_export.py first)",
    "3. Double-click launch_app.bat",
    "",
    "On error: read debug_log.txt",
    "Fallback: run_with_python.bat or webapp/index.html",
    "",
  ].join("\r\n");
}

function zipProjectFiles({
  title,
  code,
  mode,
  authorName,
  templateId,
  includeWebApp = true,
  includeExeKit = true,
}) {
  const safeSlug = safeExportSlug(title, templateId);
  const exeName = exeBinaryName(safeSlug);
  const isApp = mode === "app" || usesAppkit(code);
  const prefix = safeSlug;
  const files = {};

  if (isApp) {
    files[`${prefix}/project.py`] = strToU8(code);
    files[`${prefix}/main.py`] = strToU8(MAIN_LAUNCHER_PY);
    files[`${prefix}/appkit.py`] = strToU8(APPKIT_DESKTOP_PY);
    files[`${prefix}/verify_export.py`] = strToU8(VERIFY_EXPORT_PY);
  } else {
    files[`${prefix}/main.py`] = strToU8(code);
  }

  files[`${prefix}/project_meta.json`] = strToU8(
    buildProjectMeta({ title, templateId, safeSlug, mode: isApp ? "app" : "console", authorName }),
  );
  files[`${prefix}/README.md`] = strToU8(
    buildReadme({ title, mode: isApp ? "app" : "console", authorName, safeSlug, exeName }),
  );
  files[`${prefix}/requirements.txt`] = strToU8(buildRequirements(isApp));
  files[`${prefix}/ANDROID_FUTURE.md`] = strToU8(ANDROID_FUTURE_README);
  files[`${prefix}/run_with_python.bat`] = strToU8(buildRunWithPythonBat());

  if (includeExeKit && isApp) {
    files[`${prefix}/build_windows.bat`] = strToU8(buildWindowsBat(exeName));
    files[`${prefix}/build_windows.py`] = strToU8(buildWindowsPy(exeName, isApp));
    files[`${prefix}/launch_app.bat`] = strToU8(buildLaunchAppBat(exeName));
    files[`${prefix}/EXE_README.txt`] = strToU8(buildExeReadmeTxt(title, exeName));
  }

  if (includeWebApp) {
    const html = buildWebAppHtml(webAppBuildOpts({ title, code, mode, templateId }));
    files[`${prefix}/webapp/index.html`] = strToU8(html);
    files[`${prefix}/webapp/manifest.webmanifest`] = strToU8(buildPwaManifest({ title }));
    files[`${prefix}/webapp/sw.js`] = strToU8(buildServiceWorker());
    files[`${prefix}/webapp/README.txt`] = strToU8(
      "Open index.html in a browser.\r\nRecommended: python -m http.server 8080\r\n",
    );
  }

  return { safeSlug, bytes: zipSync(files), isApp };
}

export function exportProjectZip({ title, code, mode, authorName, templateId }) {
  const caps = analyzeExportCapabilities(code, mode, { templateId, title });
  if (!caps.zip.ok) return { ok: false, message: caps.zip.message };
  const { safeSlug, bytes } = zipProjectFiles({
    title,
    code,
    mode,
    authorName,
    templateId,
    includeWebApp: true,
    includeExeKit: true,
  });
  downloadBytes(bytes, `${safeSlug}-project.zip`, "application/zip");
  return {
    ok: true,
    message: `تم تحميل ${safeSlug}-project.zip — افتح run_with_python.bat أو build_windows.bat داخل المجلد.`,
    note: `اسم المشروع العربي محفوظ في README — الملفات الداخلية باسم إنجليزي: ${safeSlug}`,
  };
}

export function exportWindowsExeKit({ title, code, mode, authorName, templateId }) {
  const caps = analyzeExportCapabilities(code, mode, { templateId, title });
  if (!caps.exe.ok) {
    return {
      ok: false,
      message: caps.exe.message,
      note: "أصلح الأخطاء في المحرر ثم أعد التصدير، أو استخدم Web App.",
    };
  }
  const safeSlug = safeExportSlug(title, templateId);
  const exeName = exeBinaryName(safeSlug);
  const isApp = mode === "app" || usesAppkit(code);
  const prefix = `${safeSlug}-windows-build`;
  const files = {};
  files[`${prefix}/project.py`] = strToU8(code);
  files[`${prefix}/main.py`] = strToU8(MAIN_LAUNCHER_PY);
  files[`${prefix}/project_meta.json`] = strToU8(
    buildProjectMeta({ title, templateId, safeSlug, mode: "app", authorName }),
  );
  if (isApp) {
    files[`${prefix}/appkit.py`] = strToU8(APPKIT_DESKTOP_PY);
    files[`${prefix}/verify_export.py`] = strToU8(VERIFY_EXPORT_PY);
  }
  files[`${prefix}/requirements.txt`] = strToU8(buildRequirements(isApp));
  files[`${prefix}/build_windows.bat`] = strToU8(buildWindowsBat(exeName));
  files[`${prefix}/build_windows.py`] = strToU8(buildWindowsPy(exeName, isApp));
  files[`${prefix}/launch_app.bat`] = strToU8(buildLaunchAppBat(exeName));
  files[`${prefix}/run_with_python.bat`] = strToU8(buildRunWithPythonBat());
  files[`${prefix}/README.txt`] = strToU8(buildExeReadmeTxt(title, exeName));
  downloadBytes(zipSync(files), `${safeSlug}-windows-build.zip`, "application/zip");
  return {
    ok: true,
    message: `تم تحميل حزمة البناء. شغّل build_windows.bat ثم launch_app.bat — الناتج: ${exeName}.exe`,
    note: caps.exe.note,
  };
}

export function exportWebAppHtml({ title, code, mode, templateId }) {
  const caps = analyzeExportCapabilities(code, mode);
  if (!caps.webApp.ok) return { ok: false, message: caps.webApp.message };
  const safeSlug = safeExportSlug(title, templateId);
  const html = buildWebAppHtml(webAppBuildOpts({ title, code, mode, templateId }));
  downloadBytes(strToU8(html), `${safeSlug}.html`, "text/html;charset=utf-8");
  return {
    ok: true,
    message: `تم تحميل ${safeSlug}.html — للتشغيل الكامل استخدم خادمًا محليًا مع إنترنت.`,
  };
}

export function exportPwaZip({ title, code, mode, templateId }) {
  const caps = analyzeExportCapabilities(code, mode);
  if (!caps.pwa.ok) return { ok: false, message: caps.pwa.message };
  const safeSlug = safeExportSlug(title, templateId);
  const isApp = mode === "app" || usesAppkit(code);
  const webPrefix = `${safeSlug}-webapp`;
  const files = {};
  files[`${webPrefix}/index.html`] = strToU8(
    buildWebAppHtml(webAppBuildOpts({ title, code, mode, templateId })),
  );
  files[`${webPrefix}/manifest.webmanifest`] = strToU8(buildPwaManifest({ title }));
  files[`${webPrefix}/sw.js`] = strToU8(buildServiceWorker());
  files[`${webPrefix}/README.txt`] = strToU8(
    "Web App / PWA\r\n1. python -m http.server 8080\r\n2. open http://localhost:8080\r\n",
  );
  files[`${webPrefix}/ANDROID_FUTURE.md`] = strToU8(ANDROID_FUTURE_README);

  try {
    files[`${webPrefix}/icon-192.png`] = buildPlaceholderIcon(192);
    files[`${webPrefix}/icon-512.png`] = buildPlaceholderIcon(512);
  } catch {
    /* optional */
  }

  downloadBytes(zipSync(files), `${safeSlug}-webapp.zip`, "application/zip");
  return {
    ok: true,
    message: `تم تحميل ${safeSlug}-webapp.zip — مناسب للجوال والتابلت.`,
  };
}

// Legacy alias
export function slugifyTitle(title, templateId) {
  return safeExportSlug(title, templateId);
}
