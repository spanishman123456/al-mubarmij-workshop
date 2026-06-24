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

function buildEduHtml(edu, displayTitle) {
  if (!edu) return "";
  const parts = [];
  if (edu.subtitle) parts.push(`<p class="edu-sub">${escapeHtml(edu.subtitle)}</p>`);
  if (edu.description) parts.push(`<p class="edu-desc">${escapeHtml(edu.description)}</p>`);
  if (edu.usageSteps?.length) {
    parts.push(`<section class="edu-box"><h3>طريقة الاستخدام</h3><ul>${edu.usageSteps.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul></section>`);
  }
  return parts.join("");
}

function buildEduFooterHtml(edu) {
  if (!edu) return "";
  const parts = [];
  if (edu.learningObjectives?.length) {
    parts.push(`<section class="edu-box edu-green"><h3>ماذا ستتعلم من هذا المشروع؟</h3><ul>${edu.learningObjectives.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul></section>`);
  }
  if (edu.curriculumLink) {
    parts.push(`<section class="edu-box"><h3>ارتباط المشروع بمنهج برمجة الحاسب</h3><p>${escapeHtml(edu.curriculumLink)}</p></section>`);
  }
  if (edu.codeHowItWorks?.length) {
    parts.push(`<section class="edu-box edu-amber"><h3>كيف يعمل الكود؟</h3><ul>${edu.codeHowItWorks.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul></section>`);
  }
  if (edu.reflectionQuestions?.length) {
    parts.push(`<section class="edu-box"><h3>أسئلة تفكير بعد التجربة</h3><ul>${edu.reflectionQuestions.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul></section>`);
  }
  return parts.join("");
}

export function buildWebAppHtml({ title, code, mode, edu = null, displayTitle }) {
  const isApp = mode === "app" || /import\s+appkit/.test(code);
  const safeTitle = escapeHtml(displayTitle || title || "مشروع برمجة الحاسب");
  const safeCode = escapeJs(code);
  const moduleSrcJson = JSON.stringify(APPKIT_SKULPT_MODULE_SRC);
  const eduTop = buildEduHtml(edu, displayTitle);
  const eduBottom = buildEduFooterHtml(edu);

  const previewSection = isApp
    ? `<div id="app-root" class="app-shell"><p class="muted">جاري تشغيل المشروع…</p></div>${eduBottom}`
    : `<pre id="console-out" class="console">جاري التشغيل…</pre>`;

  const runScript = isApp
    ? `
    function showErr(msg) {
      var root = document.getElementById("app-root");
      root.innerHTML = "";
      var p = document.createElement("p");
      p.className = "err";
      p.textContent = msg;
      root.appendChild(p);
    }
    function outputClass(val) {
      var t = String(val || "");
      if (/مبروك|فزت|صحيح|أحسنت|نجح|اكتمل|تم التحويل|تم التشفير|تم فك|تم العثور/i.test(t)) return "out out-success";
      if (/خسرت|خطأ|فارغ|غير صحيح|الرجاء/i.test(t)) return "out out-error";
      if (/أكبر|أصغر|حاول|انتهت|بانتظار/i.test(t)) return "out out-warn";
      return "out";
    }
    function drawCanvas(cv, ops) {
      var ctx = cv.getContext("2d");
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, cv.width, cv.height);
      (ops || []).forEach(function(op) {
        if (op.op === "rect") { ctx.fillStyle = op.color; ctx.fillRect(op.x, op.y, op.w, op.h); }
        else if (op.op === "text") { ctx.fillStyle = op.color; ctx.font = "14px Tahoma,sans-serif"; ctx.fillText(op.text, op.x, op.y); }
      });
    }
    function renderApp() {
      var registry = window.__mubarmijAppKitRegistry;
      var root = document.getElementById("app-root");
      root.innerHTML = "";
      if (!registry || !registry.elements.length) {
        var m = document.createElement("p");
        m.className = "muted";
        m.textContent = "لا توجد واجهة بعد";
        root.appendChild(m);
        return;
      }
      if (registry.title) {
        var h = document.createElement("h2");
        h.textContent = registry.title;
        root.appendChild(h);
      }
      registry.elements.forEach(function(el) {
        if (el.type === "text") {
          var p = document.createElement("p");
          p.textContent = el.content;
          root.appendChild(p);
        } else if (el.type === "input") {
          var lbl = document.createElement("label");
          var span = document.createElement("span");
          span.className = "lbl";
          span.textContent = el.label || "";
          lbl.appendChild(span);
          var inp = document.createElement("input");
          inp.id = "in-" + el.id;
          inp.type = el.inputType === "number" ? "number" : "text";
          inp.value = registry.values[el.id] || "";
          if (el.placeholder) inp.placeholder = el.placeholder;
          inp.addEventListener("input", function() { registry.values[el.id] = inp.value; });
          lbl.appendChild(inp);
          root.appendChild(lbl);
        } else if (el.type === "output") {
          var box = document.createElement("div");
          box.className = outputClass(registry.values[el.id]);
          var b = document.createElement("b");
          b.textContent = el.label || "مخرجات";
          box.appendChild(b);
          var op = document.createElement("p");
          op.id = "out-" + el.id;
          op.style.whiteSpace = "pre-wrap";
          op.textContent = registry.values[el.id] || "انتظر إدخالك ثم اضغط الزر المناسب…";
          box.appendChild(op);
          root.appendChild(box);
        } else if (el.type === "button") {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.setAttribute("data-btn", el.id);
          btn.textContent = el.label || "تنفيذ الإجراء";
          var bid = (el.id + " " + (el.label || "")).toLowerCase();
          if (/new|reset|restart|محاولة|إعادة|مسح|clear|retry/.test(bid)) btn.className = "btn-secondary";
          else if (/start|begin|ابدأ|بدء/.test(bid)) btn.className = "btn-start";
          else btn.className = "btn-primary";
          root.appendChild(btn);
        } else if (el.type === "canvas") {
          var cv = document.createElement("canvas");
          cv.id = "cv-" + el.id;
          cv.width = el.width;
          cv.height = el.height;
          root.appendChild(cv);
        }
      });
      registry.elements.filter(function(e) { return e.type === "canvas"; }).forEach(function(el) {
        var cv = document.getElementById("cv-" + el.id);
        if (cv) drawCanvas(cv, registry.canvasOps[el.id]);
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
              var box = p && p.parentElement;
              if (p) {
                p.textContent = registry.values[el.id] || "—";
                p.style.whiteSpace = "pre-wrap";
                if (box) box.className = outputClass(registry.values[el.id]);
              }
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
    .app-shell{background:rgba(0,0,0,.35);border:1px solid rgba(16,185,129,.3);border-radius:12px;padding:1rem;margin-bottom:1rem}
    .app-shell h2{margin:0 0 1rem;text-align:center;color:#6ee7b7;font-size:1.25rem}
    .app-shell label{display:block;margin:.85rem 0}
    .app-shell .lbl{display:block;margin-bottom:.4rem;font-weight:bold;font-size:.95rem;color:#e2e8f0}
    .app-shell input{width:100%;padding:.75rem;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#fff;font-size:1rem}
    .btn-primary{width:100%;margin:.5rem 0;padding:.75rem;border:0;border-radius:10px;background:linear-gradient(90deg,#7c3aed,#4f46e5);color:#fff;font-weight:bold;font-size:1rem;cursor:pointer}
    .btn-start{width:100%;margin:.5rem 0;padding:.75rem;border:0;border-radius:10px;background:linear-gradient(90deg,#059669,#0d9488);color:#fff;font-weight:bold;font-size:1rem;cursor:pointer}
    .btn-secondary{width:100%;margin:.5rem 0;padding:.75rem;border:1px solid #64748b;border-radius:10px;background:#334155;color:#fff;font-weight:bold;font-size:1rem;cursor:pointer}
    .out{border-radius:8px;padding:.85rem;margin:.5rem 0;border:1px solid rgba(6,182,212,.3);background:rgba(6,182,212,.12)}
    .out-success{border-color:rgba(16,185,129,.4);background:rgba(16,185,129,.15);color:#d1fae5}
    .out-warn{border-color:rgba(245,158,11,.4);background:rgba(245,158,11,.12);color:#fde68a}
    .out-error{border-color:rgba(239,68,68,.4);background:rgba(239,68,68,.12);color:#fecaca}
    .out p{margin:.35rem 0 0;font-size:1rem;line-height:1.5}
    .app-shell canvas{width:100%;border-radius:8px;background:#f8fafc}
    .edu-sub{font-size:1.05rem;color:#c4b5fd;margin:.5rem 0}
    .edu-desc{color:#cbd5e1;margin-bottom:1rem;line-height:1.6}
    .edu-box{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:1rem;margin:1rem 0}
    .edu-box h3{margin:0 0 .5rem;font-size:1rem;color:#67e8f9}
    .edu-green h3{color:#6ee7b7}
    .edu-amber h3{color:#fcd34d}
    .edu-box ul{margin:0;padding-right:1.2rem;line-height:1.7;color:#e2e8f0}
    .console{background:#000;border-radius:12px;padding:1rem;min-height:200px;white-space:pre-wrap;direction:ltr;text-align:left;color:#6ee7b7;font-family:monospace}
    .muted{color:#94a3b8;text-align:center}.err{color:#fca5a5;white-space:pre-wrap}
    footer{text-align:center;font-size:.75rem;color:#64748b;padding:2rem 1rem}
  </style>
</head>
<body>
  <header><h1>${safeTitle}</h1><p>برمجة الحاسب — Web App</p>${eduTop}</header>
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
