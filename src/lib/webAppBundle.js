/**
 * توليد Web App / PWA مستقلة من مشروع المختبر
 */

import { APPKIT_SKULPT_MODULE_SRC } from "./appkitSkulptBridge.js";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeJs(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");
}

export function buildWebAppHtml({ title, code, mode }) {
  const isApp = mode === "app" || /import\s+appkit/.test(code);
  const safeTitle = escapeHtml(title || "مشروع برمجة الحاسب");
  const safeCode = escapeJs(code);
  const moduleSrcJson = JSON.stringify(APPKIT_SKULPT_MODULE_SRC);

  const previewSection = isApp
    ? `<div id="app-root" class="app-shell"><p class="muted">جاري تشغيل المشروع…</p></div>`
    : `<pre id="console-out" class="console">جاري التشغيل…</pre>`;

  const runScript = isApp
    ? `
    function showErr(msg) {
      document.getElementById("app-root").innerHTML = '<p class="err">' + msg + '</p>';
    }
    function drawCanvas(cv, ops) {
      const ctx = cv.getContext("2d");
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, cv.width, cv.height);
      (ops || []).forEach(function(op) {
        if (op.op === "rect") { ctx.fillStyle = op.color; ctx.fillRect(op.x, op.y, op.w, op.h); }
        else if (op.op === "text") { ctx.fillStyle = op.color; ctx.font = "14px sans-serif"; ctx.fillText(op.text, op.x, op.y); }
      });
    }
    function renderApp() {
      var registry = window.__mubarmijAppKitRegistry;
      var root = document.getElementById("app-root");
      if (!registry || !registry.elements.length) {
        root.innerHTML = '<p class="muted">لا توجد واجهة بعد</p>';
        return;
      }
      var html = registry.title ? '<h2>' + registry.title + '</h2>' : '';
      registry.elements.forEach(function(el) {
        if (el.type === "text") html += '<p>' + el.content + '</p>';
        else if (el.type === "input") {
          html += '<label>' + el.label + '<input id="in-' + el.id + '" type="' + (el.inputType === "number" ? "number" : "text") + '" value="' + (registry.values[el.id] || "") + '"></label>';
        } else if (el.type === "output") {
          html += '<div class="out"><b>' + el.label + '</b><p id="out-' + el.id + '">' + (registry.values[el.id] || "—") + '</p></div>';
        } else if (el.type === "button") {
          html += '<button type="button" data-btn="' + el.id + '">' + el.label + '</button>';
        } else if (el.type === "canvas") {
          html += '<canvas id="cv-' + el.id + '" width="' + el.width + '" height="' + el.height + '"></canvas>';
        }
      });
      root.innerHTML = html;
      registry.elements.filter(function(e) { return e.type === "canvas"; }).forEach(function(el) {
        var cv = document.getElementById("cv-" + el.id);
        if (cv) drawCanvas(cv, registry.canvasOps[el.id]);
      });
      root.querySelectorAll("input").forEach(function(inp) {
        var id = inp.id.replace("in-", "");
        inp.addEventListener("input", function() { registry.values[id] = inp.value; });
      });
      root.querySelectorAll("button[data-btn]").forEach(function(btn) {
        btn.addEventListener("click", function() {
          var id = btn.getAttribute("data-btn");
          root.querySelectorAll("input").forEach(function(inp) {
            registry.values[inp.id.replace("in-", "")] = inp.value;
          });
          var h = registry.handlers[id];
          if (!h) return;
          Sk.misceval.asyncToPromise(function() {
            return Sk.misceval.callsimOrSuspend(h);
          }).then(function() {
            registry.elements.filter(function(e) { return e.type === "output"; }).forEach(function(el) {
              var p = document.getElementById("out-" + el.id);
              if (p) p.textContent = registry.values[el.id] || "—";
            });
            registry.elements.filter(function(e) { return e.type === "canvas"; }).forEach(function(el) {
              var cv = document.getElementById("cv-" + el.id);
              if (cv) drawCanvas(cv, registry.canvasOps[el.id]);
            });
          }).catch(function(e) { showErr("خطأ عند الضغط على الزر: " + e); });
        });
      });
    }
    async function runApp() {
      if (!window.Sk || !Sk.builtinFiles) {
        showErr("تعذر تحميل محرك بايثون. افتح الملف عبر خادم محلي (python -m http.server) مع اتصال إنترنت.");
        return;
      }
      window.__mubarmijAppKitRegistry = { title: "", elements: [], handlers: {}, values: {}, canvasOps: {} };
      window.__mubarmijAppKitOnBuild = renderApp;
      Sk.builtinFiles.files["src/lib/appkit.js"] = ${moduleSrcJson};
      var origRead = Sk.read;
      Sk.configure({
        output: function() {},
        read: function(path) {
          if (path === "src/lib/appkit.js") return ${moduleSrcJson};
          return origRead(path);
        },
        __future__: Sk.python3
      });
      try {
        await Sk.misceval.asyncToPromise(function() {
          return Sk.importMainWithBody("<stdin>", false, \`${safeCode}\`, true);
        });
        renderApp();
      } catch (e) {
        var msg = (e && e.message) ? e.message : String(e);
        if (/No module named appkit/i.test(msg)) {
          showErr("وحدة appkit غير مهيأة. افتح الملف عبر خادم محلي مع اتصال إنترنت.");
        } else {
          showErr(msg);
        }
      }
    }
    runApp();
    `
    : `
    async function runConsole() {
      if (!window.Sk || !Sk.builtinFiles) {
        document.getElementById("console-out").textContent = "تعذر تحميل Skulpt — استخدم خادمًا محليًا مع إنترنت.";
        return;
      }
      var out = [];
      Sk.configure({
        output: function(t) { out.push(t); },
        read: function(x) { return Sk.builtinFiles.files[x]; },
        __future__: Sk.python3
      });
      try {
        await Sk.misceval.asyncToPromise(function() {
          return Sk.importMainWithBody("<stdin>", false, \`${safeCode}\`, true);
        });
        document.getElementById("console-out").textContent = out.join("") || "(لا يوجد إخراج)";
      } catch (e) {
        document.getElementById("console-out").textContent = "خطأ: " + ((e && e.message) ? e.message : e);
      }
    }
    runConsole();
    `;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#1e1b4b" />
  <meta name="description" content="${safeTitle} — مشروع برمجة الحاسب" />
  <link rel="manifest" href="manifest.webmanifest" />
  <title>${safeTitle}</title>
  <style>
    *{box-sizing:border-box}body{margin:0;font-family:"Segoe UI",Tahoma,sans-serif;background:linear-gradient(180deg,#0f172a,#1e1b4b);color:#f1f5f9;min-height:100vh}
    header{padding:1rem 1.25rem;border-bottom:1px solid rgba(255,255,255,.1);text-align:center}
    main{max-width:520px;margin:0 auto;padding:1.25rem}
    .app-shell{background:rgba(0,0,0,.35);border:1px solid rgba(16,185,129,.3);border-radius:12px;padding:1rem}
    .app-shell h2{margin:0 0 1rem;text-align:center;color:#6ee7b7}
    .app-shell label{display:block;margin:.75rem 0;font-size:.85rem;color:#cbd5e1}
    .app-shell input{width:100%;padding:.5rem;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#fff}
    .app-shell button{width:100%;margin:.5rem 0;padding:.65rem;border:0;border-radius:8px;background:linear-gradient(90deg,#7c3aed,#4f46e5);color:#fff;font-weight:bold;cursor:pointer}
    .app-shell .out{background:rgba(6,182,212,.15);border:1px solid rgba(6,182,212,.3);border-radius:8px;padding:.75rem;margin:.5rem 0}
    .app-shell canvas{width:100%;border-radius:8px;background:#f8fafc}
    .console{background:#000;border-radius:12px;padding:1rem;min-height:200px;white-space:pre-wrap;direction:ltr;text-align:left;color:#6ee7b7;font-family:monospace}
    .muted{color:#94a3b8;text-align:center}.err{color:#fca5a5;white-space:pre-wrap}
    footer{text-align:center;font-size:.75rem;color:#64748b;padding:2rem 1rem}
  </style>
</head>
<body>
  <header><h1>${safeTitle}</h1><p>برمجة الحاسب — Web App</p></header>
  <main>${previewSection}</main>
  <footer>يُشغَّل عبر Skulpt في المتصفح — للتشغيل الكامل استخدم خادمًا محليًا (python -m http.server)</footer>
  <script src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js"></script>
  <script>
    ${runScript}
    if("serviceWorker" in navigator){navigator.serviceWorker.register("./sw.js").catch(function(){});}
  </script>
</body>
</html>`;
}

export function buildPwaManifest({ title }) {
  return JSON.stringify(
    {
      name: title || "مشروع برمجة الحاسب",
      short_name: (title || "مشروع").slice(0, 12),
      description: "مشروع طالب — برمجة الحاسب",
      start_url: "./index.html",
      display: "standalone",
      background_color: "#0f172a",
      theme_color: "#1e1b4b",
      lang: "ar",
      dir: "rtl",
      icons: [
        { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      ],
    },
    null,
    2,
  );
}

export function buildServiceWorker() {
  return `const CACHE="mubarmij-pwa-v1";
const ASSETS=["./","./index.html","./manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(self.clients.claim());});
self.addEventListener("fetch",e=>{
  if(e.request.url.includes("skulpt")) return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});`;
}

export function buildPlaceholderIcon(size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#7c3aed";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${Math.floor(size * 0.35)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ب", size / 2, size / 2);
  const dataUrl = canvas.toDataURL("image/png");
  const bin = atob(dataUrl.split(",")[1]);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

export const ANDROID_FUTURE_README = `# تصدير Android APK (مستقبلي)

هذا المشروع مُهيَّأ للتطوير المستقبلي كتطبيق Android.

## المسار المقترح لاحقًا
1. تحويل واجهة appkit إلى Flutter / React Native WebView
2. أو استخدام Briefcase / BeeWare لتغليف Python + Tkinter (محدود على Android)
3. أو نشر نسخة PWA من مجلد webapp/ عبر TWA (Trusted Web Activity)

## الحل الحالي للجوال
- استخدم مجلد **webapp/** أو ملف **index.html** — يعمل في متصفح الجوال
- أضف إلى الشاشة الرئيسية (Add to Home Screen) لتجربة شبيهة بالتطبيق

تم إنشاء هذا الملف تلقائيًا من مختبر برمجة الحاسب.
`;
