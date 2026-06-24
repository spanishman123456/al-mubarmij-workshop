import { GRAPHIC_APP_PROJECTS } from "../data/graphicAppProjects.js";

/** اسم افتراضي عند غياب قالب معروف */
export const EXE_BINARY_NAME = "project_runner";

const TEMPLATE_SLUG_BY_ID = Object.fromEntries(
  GRAPHIC_APP_PROJECTS.map((p) => [p.id, p.exportSlug || p.id.replace(/^app-/, "")]),
);

/**
 * اسم ملف exe من slug المشروع — إنجليزي وشرطات سفلية فقط
 * مثال: number-guessing-game → number_guessing_game.exe
 */
export function exeBinaryName(safeSlug) {
  const base = String(safeSlug || "")
    .replace(/-/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase()
    .slice(0, 48);
  if (base.length >= 3 && /^[a-z]/.test(base)) return base;
  return EXE_BINARY_NAME;
}

/**
 * slug آمن للملفات والمجلدات — أحرف إنجليزية وأرقام وشرطة فقط
 */
export function safeExportSlug(title, templateId = null) {
  if (templateId && TEMPLATE_SLUG_BY_ID[templateId]) {
    return TEMPLATE_SLUG_BY_ID[templateId];
  }

  const ascii = (title || "")
    .normalize("NFD")
    .replace(/[\u0600-\u06FF]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 48);

  if (ascii.length >= 3) return ascii;

  const seed = `${title || "project"}-${templateId || ""}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return `student-project-${hash.toString(16).slice(0, 8)}`;
}

export function buildProjectMeta({ title, templateId, safeSlug, mode, authorName }) {
  const exeName = exeBinaryName(safeSlug);
  return JSON.stringify(
    {
      titleAr: title || "مشروع برمجة الحاسب",
      exportSlug: safeSlug,
      templateId: templateId || null,
      mode,
      authorName: authorName || null,
      exeFileName: `${exeName}.exe`,
      exeBinaryName: exeName,
      buildScript: "build_windows.bat",
      runScript: "run_with_python.bat",
      exportedAt: new Date().toISOString(),
    },
    null,
    2,
  );
}
