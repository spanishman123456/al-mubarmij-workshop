/**
 * توليد Web App / PWA مستقلة من مشروع المختبر
 */

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

  const previewSection = isApp
    ? `<div id="app-root" class="app-shell"><p class="muted">جاري تشغيل المشروع…</p></div>`
    : `<pre id="console-out" class="console">جاري التشغيل…</pre>`;

  const runScript = isApp
    ? `
    const registry = { title:"", elements:[], handlers:{}, values:{}, canvasOps:{} };
    function jsStr(v){ return v===undefined||v===Sk.builtin.none.none$?"":Sk.ffi.remapToJs(v); }
    function buildAppKit(Sk,r){
      const e={};
      e.title=new Sk.builtin.func((_s,t)=>{r.title=jsStr(Sk,t);return Sk.builtin.none.none$;});
      e.text=new Sk.builtin.func((_s,c)=>{r.elements.push({type:"text",content:jsStr(Sk,c)});return Sk.builtin.none.none$;});
      e.input=new Sk.builtin.func((_s,id,lb,d)=>{const i=jsStr(Sk,id);r.elements.push({type:"input",id:i,label:jsStr(Sk,lb),inputType:"text"});r.values[i]=jsStr(Sk,d);return Sk.builtin.none.none$;});
      e.number_input=new Sk.builtin.func((_s,id,lb,d)=>{const i=jsStr(Sk,id);r.elements.push({type:"input",id:i,label:jsStr(Sk,lb),inputType:"number"});r.values[i]=jsStr(Sk,d)||"0";return Sk.builtin.none.none$;});
      e.output=new Sk.builtin.func((_s,id,lb)=>{const i=jsStr(Sk,id);r.elements.push({type:"output",id:i,label:jsStr(Sk,lb)});r.values[i]="";return Sk.builtin.none.none$;});
      e.button=new Sk.builtin.func((_s,id,lb)=>{r.elements.push({type:"button",id:jsStr(Sk,id),label:jsStr(Sk,lb)});return Sk.builtin.none.none$;});
      e.get=new Sk.builtin.func((_s,id)=>new Sk.builtin.str(String(r.values[jsStr(Sk,id)]??"")));
      e.set=new Sk.builtin.func((_s,id,v)=>{r.values[jsStr(Sk,id)]=jsStr(Sk,v);renderApp();return Sk.builtin.none.none$;});
      e.on_click=new Sk.builtin.func((_s,id,h)=>{r.handlers[jsStr(Sk,id)]=h;return Sk.builtin.none.none$;});
      e.canvas=new Sk.builtin.func((_s,id,w,h)=>{const c=jsStr(Sk,id);r.elements.push({type:"canvas",id:c,width:Number(jsStr(Sk,w))||300,height:Number(jsStr(Sk,h))||180});r.canvasOps[c]=[];return Sk.builtin.none.none$;});
      e.draw_rect=new Sk.builtin.func((_s,cid,x,y,w,h,col)=>{const c=jsStr(Sk,cid);(r.canvasOps[c]=r.canvasOps[c]||[]).push({op:"rect",x:Number(jsStr(Sk,x)),y:Number(jsStr(Sk,y)),w:Number(jsStr(Sk,w)),h:Number(jsStr(Sk,h)),color:jsStr(Sk,col)||"#7c3aed"});return Sk.builtin.none.none$;});
      e.draw_text=new Sk.builtin.func((_s,cid,x,y,t,col)=>{const c=jsStr(Sk,cid);(r.canvasOps[c]=r.canvasOps[c]||[]).push({op:"text",x:Number(jsStr(Sk,x)),y:Number(jsStr(Sk,y)),text:jsStr(Sk,t),color:jsStr(Sk,col)||"#1e1b4b"});return Sk.builtin.none.none$;});
      e.build=new Sk.builtin.func(()=>{renderApp();return Sk.builtin.none.none$;});
      return e;
    }
    function drawCanvas(cv,ops){
      const ctx=cv.getContext("2d");
      ctx.fillStyle="#f8fafc";ctx.fillRect(0,0,cv.width,cv.height);
      (ops||[]).forEach(op=>{
        if(op.op==="rect"){ctx.fillStyle=op.color;ctx.fillRect(op.x,op.y,op.w,op.h);}
        else if(op.op==="text"){ctx.fillStyle=op.color;ctx.font="14px sans-serif";ctx.fillText(op.text,op.x,op.y);}
      });
    }
    function renderApp(){
      const root=document.getElementById("app-root");
      if(!registry.elements.length){root.innerHTML='<p class="muted">لا توجد واجهة بعد</p>';return;}
      let html=registry.title?'<h2>'+registry.title+'</h2>':"";
      registry.elements.forEach(el=>{
        if(el.type==="text") html+='<p>'+el.content+'</p>';
        else if(el.type==="input") html+='<label>'+el.label+'<input id="in-'+el.id+'" type="'+(el.inputType==="number"?"number":"text")+'" value="'+(registry.values[el.id]||"")+'"></label>';
        else if(el.type==="output") html+='<div class="out"><b>'+el.label+'</b><p id="out-'+el.id+'">'+(registry.values[el.id]||"—")+'</p></div>';
        else if(el.type==="button") html+='<button type="button" data-btn="'+el.id+'">'+el.label+'</button>';
        else if(el.type==="canvas") html+='<canvas id="cv-'+el.id+'" width="'+el.width+'" height="'+el.height+'"></canvas>';
      });
      root.innerHTML=html;
      registry.elements.filter(e=>e.type==="canvas").forEach(el=>{
        const cv=document.getElementById("cv-"+el.id);
        if(cv) drawCanvas(cv, registry.canvasOps[el.id]);
      });
      root.querySelectorAll("input").forEach(inp=>{
        const id=inp.id.replace("in-","");
        inp.addEventListener("input",()=>{registry.values[id]=inp.value;});
      });
      root.querySelectorAll("button[data-btn]").forEach(btn=>{
        btn.addEventListener("click",async()=>{
          const id=btn.getAttribute("data-btn");
          root.querySelectorAll("input").forEach(inp=>{registry.values[inp.id.replace("in-","")]=inp.value;});
          const h=registry.handlers[id];
          if(h) await Sk.misceval.asyncToPromise(()=>Sk.misceval.callsimOrSuspend(h));
          registry.elements.filter(e=>e.type==="output").forEach(el=>{
            const p=document.getElementById("out-"+el.id);
            if(p) p.textContent=registry.values[el.id]||"—";
          });
          registry.elements.filter(e=>e.type==="canvas").forEach(el=>{
            const cv=document.getElementById("cv-"+el.id);
            if(cv) drawCanvas(cv, registry.canvasOps[el.id]);
          });
        });
      });
    }
    async function runApp(){
      const prev=window.$builtinmodule;
      window.$builtinmodule=(name)=>name==="appkit"?buildAppKit(Sk,registry):prev?prev(name):undefined;
      try{
        await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody("<stdin>",false,\`${safeCode}\`,true));
      }finally{window.$builtinmodule=prev;}
    }
    runApp().catch(e=>{document.getElementById("app-root").innerHTML='<p class="err">'+e+'</p>';});
    `
    : `
    async function runConsole(){
      const out=[];
      Sk.configure({output:t=>out.push(t),read:x=>Sk.builtinFiles.files[x],__future__:Sk.python3});
      try{
        await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody("<stdin>",false,\`${safeCode}\`,true));
        document.getElementById("console-out").textContent=out.join("")||"(لا يوجد إخراج)";
      }catch(e){document.getElementById("console-out").textContent="خطأ: "+e;}
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
    .muted{color:#94a3b8;text-align:center}.err{color:#fca5a5}
    footer{text-align:center;font-size:.75rem;color:#64748b;padding:2rem 1rem}
  </style>
</head>
<body>
  <header><h1>${safeTitle}</h1><p>برمجة الحاسب — Web App</p></header>
  <main>${previewSection}</main>
  <footer>يُشغَّل عبر Skulpt في المتصفح — مناسب للجوال والتابلت</footer>
  <script src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js"></script>
  <script>
    ${runScript}
    if("serviceWorker" in navigator){navigator.serviceWorker.register("./sw.js").catch(()=>{});}
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
