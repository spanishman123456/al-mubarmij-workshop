import { analyzeExportCapabilities, sha256Hex, usesSkui, validateExportProject } from "./projectExport.js";
import { validateSkuiProject } from "./skui/manifest.js";

/**
 * فحص جاهزية المشروع قبل التصدير/المعاينة.
 */
export async function checkProjectReadiness({
  title,
  code,
  mode = "app",
  lastRunOk = false,
  lastRunCodeHash = null,
}) {
  const currentHash = await sha256Hex(code || "");
  const validation = validateSkuiProject(
    /\bimport\s+appkit\b/.test(String(code || "")) ? `${code}\nimport skui` : code,
  );
  const exportCheck = validateExportProject(code, {
    title,
    lastSuccessfulCodeHash: lastRunOk ? lastRunCodeHash : null,
    currentCodeHash: currentHash,
  });
  const caps = analyzeExportCapabilities(code, mode, { title });
  const hasRun = Boolean(lastRunOk && lastRunCodeHash === currentHash);
  const issues = [];

  if (!String(title || "").trim()) issues.push("أدخل اسمًا للمشروع.");
  if (!validation.ok) issues.push(...validation.issues.map((i) => i.message));
  if (!hasRun) issues.push("شغّل المشروع بنجاح في المعاينة قبل التصدير.");
  if (!usesSkui(code) && mode === "app") issues.push("أضف import skui as ui.");

  const previewReady = validation.ok && hasRun;
  const webAppReady = previewReady && caps.webApp.ok;
  // PWA/Windows: الحزمة قد تُبنى لكن التثبيت/التشغيل المحلي غير مثبت — لا تُعلَّم جاهزة
  const pwaReady = false;
  const windowsReady = false;

  return {
    ok: issues.length === 0 && webAppReady,
    issues,
    codeHash: currentHash,
    statuses: {
      preview: previewReady ? "جاهز للمعاينة" : "غير جاهز — توجد مشكلات يجب إصلاحها.",
      webApp: webAppReady ? "جاهز لتصدير WebApp" : "غير جاهز لتصدير WebApp",
      pwa: pwaReady ? "جاهز لتصدير PWA" : "قيد التطوير — لم يُثبت التثبيت الفعلي بعد",
      windows: windowsReady
        ? "جاهز لتصدير Windows"
        : "تصدير Windows غير متاح حاليًا — قيد استكمال التحقق من التثبيت",
    },
    capabilities: caps,
    validation,
    exportCheck,
  };
}
