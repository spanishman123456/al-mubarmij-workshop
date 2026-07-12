import { SKUI_FRAME_HTML } from "../components/python/SkuiPreviewFrame.jsx";
import { SKUI_VERSION, SKULPT_BUILD } from "./skui/manifest.js";
import { buildSkuiWorkerSource } from "./skui/workerSource.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildWebAppHtml({
  title,
  description = "",
  lang = "ar",
  direction = "rtl",
  themeColor = "#7c3aed",
  pwa = false,
}) {
  const safeTitle = escapeHtml(title || "مشروع skui");
  const safeDescription = escapeHtml(description || "مشروع طالب يعمل بواسطة Skulpt وskui");
  const manifest = pwa ? '<link rel="manifest" href="./manifest.webmanifest">' : "";
  return `<!doctype html>
<html lang="${lang === "en" ? "en" : "ar"}" dir="${direction === "ltr" ? "ltr" : "rtl"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${safeDescription}">
  <meta name="theme-color" content="${escapeHtml(themeColor)}">
  ${manifest}
  <title>${safeTitle}</title>
  <style>
    *{box-sizing:border-box}body{margin:0;background:#020617;color:#f8fafc;font-family:"Segoe UI",Tahoma,sans-serif}
    header{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.75rem 1rem;border-bottom:1px solid #ffffff20;background:#0f172a}
    h1{margin:0;font-size:1.05rem}.status{font-size:.8rem;color:#94a3b8}
    iframe{display:block;width:100%;height:calc(100vh - 58px);border:0;background:#0f172a}
  </style>
</head>
<body>
  <header><h1>${safeTitle}</h1><span id="status" class="status">جاري تشغيل المشروع…</span></header>
  <iframe id="preview" title="معاينة التطبيق" sandbox="allow-scripts" src="./preview.html"></iframe>
  <script src="./app.js" defer></script>
</body>
</html>`;
}

export function buildStandaloneAppJs() {
  const workerSource = JSON.stringify(buildSkuiWorkerSource());
  return `"use strict";
(function(){
  var status=document.getElementById("status"),frame=document.getElementById("preview");
  var source=${workerSource};
  var workerUrl=URL.createObjectURL(new Blob([source],{type:"text/javascript"}));
  var worker=new Worker(workerUrl);
  function setStatus(text,error){status.textContent=text;status.style.color=error?"#fca5a5":"#94a3b8"}
  worker.onmessage=function(event){
    var message=event.data||{};
    if(message.type==="ready"){
      fetch("./main.py",{cache:"no-store"}).then(function(r){if(!r.ok)throw new Error("main.py");return r.text()})
        .then(function(code){worker.postMessage({type:"run",code:code})})
        .catch(function(){setStatus("تعذر تحميل كود المشروع.",true)});
    }else if(message.type==="snapshot"){
      frame.contentWindow.postMessage({type:"render",ui:message.ui},"*");
    }else if(message.type==="run-complete"){
      setStatus("يعمل محليًا بواسطة Skulpt وskui",false);
    }else if(message.type==="error"){
      setStatus((message.feedback&&message.feedback.headlineAr)||"تعذر تشغيل المشروع.",true);
    }
  };
  worker.onerror=function(){setStatus("تعذر تشغيل عامل التطبيق.",true)};
  addEventListener("message",function(event){
    if(event.source!==frame.contentWindow)return;
    var message=event.data||{};
    if(message.source==="skui-preview"&&message.type==="event"){
      worker.postMessage({type:"event",id:message.id,event:message.event,value:message.value,values:message.values});
    }
  });
  frame.addEventListener("load",function(){
    worker.postMessage({
      type:"init",
      skulptUrl:new URL("./runtime/skulpt.min.js",location.href).href,
      stdlibUrl:new URL("./runtime/skulpt-stdlib.js",location.href).href
    });
  },{once:true});
  if("serviceWorker" in navigator&&document.querySelector('link[rel="manifest"]')){
    navigator.serviceWorker.register("./service-worker.js").catch(function(){});
  }
  addEventListener("beforeunload",function(){worker.terminate();URL.revokeObjectURL(workerUrl)});
})();`;
}

export function buildPreviewHtml() {
  return SKUI_FRAME_HTML;
}

export function buildPwaManifest({
  title,
  description = "",
  themeColor = "#7c3aed",
  backgroundColor = "#0f172a",
  lang = "ar",
  direction = "rtl",
  orientation = "any",
}) {
  return JSON.stringify(
    {
      id: "./",
      name: title || "مشروع skui",
      short_name: (title || "skui").slice(0, 12),
      description: description || "مشروع طالب يعمل بواسطة Skulpt وskui",
      start_url: "./index.html",
      scope: "./",
      display: "standalone",
      theme_color: themeColor,
      background_color: backgroundColor,
      orientation,
      lang: lang === "en" ? "en" : "ar",
      dir: direction === "ltr" ? "ltr" : "rtl",
      icons: [
        { src: "./icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
        { src: "./icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
      ],
    },
    null,
    2,
  );
}

export function buildServiceWorker({ cacheVersion = "1", assets = [] } = {}) {
  const core = [
    "./",
    "./index.html",
    "./app.js",
    "./main.py",
    "./preview.html",
    "./offline.html",
    "./manifest.webmanifest",
    "./runtime/skulpt.min.js",
    "./runtime/skulpt-stdlib.js",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    ...assets.map((asset) => `./assets/${String(asset).replace(/^\/+/, "")}`),
  ];
  return `"use strict";
const CACHE=${JSON.stringify(`skui-${cacheVersion}`)};
const ASSETS=${JSON.stringify([...new Set(core)])};
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE&&key.startsWith("skui-")).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{
    if(!response||response.status!==200)return response;
    const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;
  }).catch(()=>caches.match("./offline.html"))));
});`;
}

export function buildOfflineHtml(title = "مشروع skui") {
  return `<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>غير متصل</title><body style="font-family:sans-serif;background:#0f172a;color:white;text-align:center;padding:15vh 1rem"><h1>${escapeHtml(title)}</h1><p>التطبيق غير متصل الآن. افتحه مرة واحدة أثناء الاتصال لتخزين ملفاته.</p></body></html>`;
}

export function buildPlaceholderIcon(size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  context.fillStyle = "#7c3aed";
  context.fillRect(0, 0, size, size);
  context.fillStyle = "#fff";
  context.font = `bold ${Math.floor(size * 0.34)}px sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("sk", size / 2, size / 2);
  const binary = atob(canvas.toDataURL("image/png").split(",")[1]);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function buildInfo({ projectName, projectVersion = "1.0.0", target, buildId, builtAt }) {
  return {
    projectName,
    projectVersion,
    runtime: "Skulpt",
    runtimeVersion: SKULPT_BUILD.gitHash,
    skulptDate: SKULPT_BUILD.date,
    uiLibrary: "skui",
    uiLibraryVersion: SKUI_VERSION,
    exportRuntimeVersion: "1.1.0",
    exportTarget: target,
    buildId,
    builtAt,
  };
}

export const ANDROID_FUTURE_README =
  "تعمل حزمة PWA على Android وiOS والحاسب. لا تتضمن المنصة حاليًا تحويل APK أصليًا.";
