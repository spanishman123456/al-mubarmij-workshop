import { strToU8, zipSync } from "fflate";
import skulptMinUrl from "../assets/skulpt/skulpt.min.js?url";
import skulptStdlibUrl from "../assets/skulpt/skulpt-stdlib.js?url";
import { safeExportSlug } from "./exportSlugs.js";
import { SKUI_VERSION, SKULPT_BUILD, validateSkuiProject } from "./skui/manifest.js";
import {
  buildInfo,
  buildOfflineHtml,
  buildPlaceholderIcon,
  buildPreviewHtml,
  buildPwaManifest,
  buildServiceWorker,
  buildStandaloneAppJs,
  buildWebAppHtml,
} from "./webAppBundle.js";

const SENSITIVE_PATTERNS = [
  /\b\d{10}\b/g,
  /\b(api[_-]?key|secret|token|password)\s*[:=]\s*["'][^"']+["']/gi,
  /\b(session|authorization|cookie)\s*[:=]\s*["'][^"']+["']/gi,
];

export function usesSkui(code) {
  return /\b(import\s+skui|from\s+skui\s+import|import\s+appkit)\b/.test(String(code || ""));
}

export function stripSensitiveData(value) {
  let output = String(value ?? "");
  for (const pattern of SENSITIVE_PATTERNS) output = output.replace(pattern, "[REMOVED]");
  return output;
}

export async function sha256Hex(value) {
  const bytes = value instanceof Uint8Array ? value : new TextEncoder().encode(String(value));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function validateExportProject(
  code,
  {
    title = "",
    target = "webapp",
    icon = null,
    assets = [],
    lastSuccessfulCodeHash = null,
    currentCodeHash = null,
  } = {},
) {
  const validation = validateSkuiProject(
    /\bimport\s+appkit\b/.test(String(code || "")) ? `${code}\nimport skui` : code,
  );
  const issues = [...validation.issues];
  if (!String(title).trim()) issues.push({ code: "missing-name", message: "أدخل اسمًا للمشروع." });
  if (String(code || "").length > 250_000) {
    issues.push({ code: "code-size", message: "حجم كود المشروع أكبر من الحد المسموح." });
  }
  if (assets.length > 100) issues.push({ code: "asset-count", message: "عدد الأصول أكبر من الحد المسموح." });
  const totalAssetBytes = assets.reduce((sum, asset) => sum + Number(asset?.bytes?.length || asset?.size || 0), 0);
  if (totalAssetBytes > 25 * 1024 * 1024) {
    issues.push({ code: "asset-size", message: "حجم الأصول أكبر من 25MB." });
  }
  if (icon && !/^image\/(png|jpeg|webp)$/.test(icon.type || "")) {
    issues.push({ code: "invalid-icon", message: "الأيقونة يجب أن تكون PNG أو JPEG أو WebP." });
  }
  if (lastSuccessfulCodeHash && currentCodeHash && lastSuccessfulCodeHash !== currentCodeHash) {
    issues.push({ code: "not-run", message: "شغّل النسخة الحالية من المشروع بنجاح قبل التصدير." });
  }
  if (target === "windows" && !usesSkui(code)) {
    issues.push({ code: "windows-ui-only", message: "تصدير Windows متاح لمشروعات skui المحفوظة." });
  }
  return {
    ok: issues.length === 0,
    issues,
    components: validation.components,
    readiness: {
      source: issues.filter((issue) => issue.code === "code-size").length === 0,
      webapp: issues.length === 0,
      pwa: issues.length === 0,
      windows: issues.length === 0 && usesSkui(code),
    },
  };
}

export function analyzeExportCapabilities(code, mode = "app", options = {}) {
  const title = options.title || "مشروع";
  const base = validateExportProject(code, { title });
  const isApp = mode === "app" || usesSkui(code);
  const reason = base.issues[0]?.message;
  return {
    zip: { ok: true, message: "الكود وبيانات المشروع والأصول في حزمة منظمة." },
    webApp: { ok: base.ok, message: reason || "WebApp مستقل مع Skulpt وskui المحليين." },
    pwa: { ok: base.ok, message: reason || "PWA قابلة للتثبيت والعمل دون اتصال." },
    exe: {
      ok: base.ok && isApp,
      message: reason || (isApp ? "بناء Tauri 2 عبر Windows CI؛ لا يُنفّذ Python على الخادم." : "يتطلب مشروع skui."),
      note: "تطبيق ويب تعليمي مغلف، وليس تحويلًا إلى CPython.",
    },
    apk: { ok: false, future: true, message: "استخدم PWA للتثبيت على الجوال." },
  };
}

function safeAssetName(name) {
  const clean = String(name || "asset")
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/^\.+/, "")
    .slice(0, 100);
  return clean || "asset";
}

async function fetchRuntime() {
  const [runtime, stdlib] = await Promise.all([
    fetch(skulptMinUrl).then((response) => {
      if (!response.ok) throw new Error("تعذر تضمين Skulpt runtime.");
      return response.arrayBuffer();
    }),
    fetch(skulptStdlibUrl).then((response) => {
      if (!response.ok) throw new Error("تعذر تضمين Skulpt stdlib.");
      return response.arrayBuffer();
    }),
  ]);
  return { runtime: new Uint8Array(runtime), stdlib: new Uint8Array(stdlib) };
}

function createReadme(meta, components) {
  return `# ${meta.name}

${meta.description || "مشروع طالب مبني باستخدام Skulpt وskui."}

- Runtime: Skulpt (${SKULPT_BUILD.gitHash})
- UI Library: skui ${SKUI_VERSION}
- Version: ${meta.version}
- Type: ${meta.projectType}
- Components: ${components.join(", ") || "لا توجد مكونات مكتشفة"}

## التشغيل

شغّل مجلد webapp بواسطة خادم ملفات ثابت، مثل:

\`\`\`bash
python -m http.server 8080
\`\`\`

ثم افتح http://localhost:8080/webapp/

لا يتطلب التطبيق CPython ولا Tkinter. ينفّذ main.py داخل Skulpt في Web Worker.
`;
}

export async function createExportBundle({
  title,
  description = "",
  code,
  version = "1.0.0",
  authorName = "",
  authorVisibility = "hidden",
  projectType = "application",
  target = "source",
  themeColor = "#7c3aed",
  lang = "ar",
  direction = "rtl",
  orientation = "any",
  assets = [],
  templateId = null,
  buildId = crypto.randomUUID(),
  now = new Date().toISOString(),
  runtimeFiles = null,
  iconFiles = null,
}) {
  const safeSlug = safeExportSlug(title, templateId);
  const validation = validateExportProject(code, { title, target, assets });
  if (!validation.ok && target !== "source") {
    throw new Error(validation.issues.map((issue) => issue.message).join("\n"));
  }
  const author =
    authorVisibility === "name"
      ? stripSensitiveData(authorName).replace(/\[REMOVED\]/g, "").trim().slice(0, 100)
      : authorVisibility === "alias"
        ? "طالب مبرمج"
        : null;
  const meta = {
    name: stripSensitiveData(title).replace(/\[REMOVED\]/g, "").trim().slice(0, 120),
    description: stripSensitiveData(description).slice(0, 500),
    version,
    author,
    runtime: "skulpt",
    runtimeVersion: SKULPT_BUILD.gitHash,
    uiLibrary: "skui",
    uiLibraryVersion: SKUI_VERSION,
    projectType,
    createdAt: now,
    exportedAt: now,
  };
  const files = {};
  const root = `${safeSlug}/`;
  const web = target === "source" ? `${root}webapp/` : root;
  const { runtime, stdlib } = runtimeFiles || (await fetchRuntime());
  files[`${web}index.html`] = strToU8(
    buildWebAppHtml({
      title: meta.name,
      description: meta.description,
      lang,
      direction,
      themeColor,
      pwa: target === "pwa" || target === "source",
    }),
  );
  files[`${web}app.js`] = strToU8(buildStandaloneAppJs());
  files[`${web}preview.html`] = strToU8(buildPreviewHtml());
  files[`${web}main.py`] = strToU8(String(code || ""));
  files[`${web}runtime/skulpt.min.js`] = runtime;
  files[`${web}runtime/skulpt-stdlib.js`] = stdlib;
  files[`${web}project.json`] = strToU8(JSON.stringify(meta, null, 2));
  const info = buildInfo({ projectName: meta.name, projectVersion: version, target, buildId, builtAt: now });
  files[`${web}build-info.json`] = strToU8(JSON.stringify(info, null, 2));
  for (const asset of assets) {
    if (!asset?.bytes) continue;
    files[`${web}assets/${safeAssetName(asset.name)}`] =
      asset.bytes instanceof Uint8Array ? asset.bytes : new Uint8Array(asset.bytes);
  }
  if (target === "pwa" || target === "source") {
    files[`${web}manifest.webmanifest`] = strToU8(
      buildPwaManifest({ title: meta.name, description: meta.description, themeColor, lang, direction, orientation }),
    );
    files[`${web}service-worker.js`] = strToU8(buildServiceWorker({ cacheVersion: version }));
    files[`${web}offline.html`] = strToU8(buildOfflineHtml(meta.name));
    files[`${web}icons/icon-192.png`] = iconFiles?.icon192 || buildPlaceholderIcon(192);
    files[`${web}icons/icon-512.png`] = iconFiles?.icon512 || buildPlaceholderIcon(512);
  }
  if (target === "source") {
    files[`${root}main.py`] = strToU8(String(code || ""));
    files[`${root}project.json`] = strToU8(JSON.stringify(meta, null, 2));
    files[`${root}README.md`] = strToU8(createReadme(meta, validation.components));
    files[`${root}LICENSE.txt`] = strToU8("حقوق المشروع محفوظة لصاحب المشروع. للاستخدام التعليمي.\n");
    files[`${root}export-info.json`] = strToU8(JSON.stringify(info, null, 2));
  }
  const bytes = zipSync(files, { level: 6 });
  return {
    bytes,
    filename: `${safeSlug}-${target === "source" ? "source" : target}.zip`,
    checksum: await sha256Hex(bytes),
    manifest: meta,
    buildInfo: info,
    files: Object.keys(files),
    validation,
  };
}

export function downloadBytes(bytes, filename, mime = "application/zip") {
  const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function bytesToBase64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }
  return btoa(binary);
}

async function exportTarget(target, payload) {
  const bundle = await createExportBundle({ ...payload, target });
  downloadBytes(bundle.bytes, bundle.filename);
  return {
    ok: true,
    message: `تم إنشاء ${bundle.filename}`,
    note: `SHA-256: ${bundle.checksum}`,
    report: bundle,
  };
}

export const exportProjectZip = (payload) => exportTarget("source", payload);
export const exportWebAppHtml = (payload) => exportTarget("webapp", payload);
export const exportPwaZip = (payload) => exportTarget("pwa", payload);

export async function exportWindowsExeKit(payload) {
  const validation = validateExportProject(payload.code, { title: payload.title, target: "windows" });
  if (!validation.ok) return { ok: false, message: validation.issues[0].message };
  const source = await createExportBundle({ ...payload, target: "webapp" });
  const response = await fetch("/api/exports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ownerId: payload.ownerId || "local-user",
      projectId: payload.projectId || safeExportSlug(payload.title, payload.templateId),
      target: "windows",
      metadata: {
        name: payload.title,
        version: payload.version || "1.0.0",
        signingMode: payload.signingMode === "official" ? "official" : "educational",
      },
      sourceBase64: bytesToBase64(source.bytes),
      sourceChecksum: source.checksum,
    }),
  });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    return { ok: false, message: data.error || "تعذر إرسال مهمة Windows." };
  }
  return {
    ok: true,
    message: payload.signingMode === "official"
      ? "أُرسلت مهمة Windows الرسمية؛ لن تنجح دون توقيع Authenticode صالح."
      : "أُرسلت مهمة Windows التعليمية غير الموقّعة.",
    note: `Build ID: ${data.job?.id || data.id}`,
    job: data.job || data,
  };
}

export function slugifyTitle(title, templateId) {
  return safeExportSlug(title, templateId);
}
