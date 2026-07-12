const PREVIEW_PREFIX = "skui-webapp-preview:";
const PREVIEW_TTL_MS = 60 * 60 * 1000;

function previewId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function saveWebAppPreview(payload, storage = globalThis.localStorage) {
  const id = previewId();
  storage.setItem(
    `${PREVIEW_PREFIX}${id}`,
    JSON.stringify({
      title: String(payload.title || "مشروع skui").slice(0, 120),
      code: String(payload.code || ""),
      createdAt: Date.now(),
    }),
  );
  return id;
}

export function loadWebAppPreview(id, storage = globalThis.localStorage, now = Date.now()) {
  if (!id || !/^[a-zA-Z0-9-]{8,80}$/.test(id)) return null;
  try {
    const raw = storage.getItem(`${PREVIEW_PREFIX}${id}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.code !== "string" ||
      typeof parsed.title !== "string" ||
      !Number.isFinite(parsed.createdAt) ||
      now - parsed.createdAt > PREVIEW_TTL_MS
    ) {
      storage.removeItem(`${PREVIEW_PREFIX}${id}`);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function openWebAppPreview(payload) {
  const validationCode = String(payload.code || "");
  if (!validationCode.trim()) {
    return { ok: false, message: "أضف كود المشروع قبل فتح المعاينة." };
  }
  const id = saveWebAppPreview(payload);
  const url = new URL("/webapp-preview", window.location.origin);
  url.searchParams.set("id", id);
  const previewWindow = window.open(url.toString(), "_blank");
  if (!previewWindow) {
    return {
      ok: false,
      message: "منع المتصفح فتح المعاينة. اسمح بالنوافذ المنبثقة لهذا الموقع ثم حاول مجددًا.",
    };
  }
  previewWindow.opener = null;
  return {
    ok: true,
    message: "فُتحت معاينة WebApp في صفحة مستقلة.",
    note: "يمكنك تجربتها الآن، أو تنزيل ZIP لاستضافتها خارج المنصة.",
  };
}
