import { useEffect, useMemo, useRef } from "react";

export const SKUI_FRAME_HTML = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
:root{--c-bg:#070b18;--c-panel:#111a31;--c-text:#f8fafc;--c-muted:#a7b0c5;--c-primary:#8b5cf6;--c-primary2:#4f46e5;--c-accent:#22d3ee;--c-ok:#10b981;--c-warn:#f59e0b;--c-danger:#ef4444;--space:1rem;--radius:1rem;--shadow:0 24px 70px rgba(2,6,23,.48);color-scheme:dark}
*{box-sizing:border-box}html{min-height:100%}body{margin:0;min-height:100vh;background:radial-gradient(circle at 10% 5%,#312e8166,transparent 34%),radial-gradient(circle at 90% 15%,#0891b233,transparent 30%),linear-gradient(145deg,#070b18,#11183a 55%,#16113c);color:var(--c-text);font-family:Tajawal,"Segoe UI",sans-serif}.root{min-height:100vh;padding:clamp(1rem,4vw,2.5rem);display:grid;place-items:start center}.empty{display:grid;place-items:center;width:100%;min-height:260px;color:var(--c-muted);border:1px dashed #ffffff30;border-radius:1.25rem;background:#ffffff08}
.sk-App{width:min(100%,720px);margin:auto;padding:clamp(1rem,3vw,1.75rem);border:1px solid #ffffff24;border-radius:1.6rem;background:linear-gradient(155deg,#ffffff18,#ffffff08);box-shadow:var(--shadow);backdrop-filter:blur(18px)}.sk-Page{width:100%;max-width:100%;margin:auto}.sk-Container,.sk-Card{padding:var(--space);border:1px solid #ffffff1f;border-radius:var(--radius);background:linear-gradient(150deg,#ffffff12,#ffffff08);box-shadow:0 14px 35px rgba(2,6,23,.24)}.sk-Card{transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}.sk-Card:hover{transform:translateY(-2px);border-color:#8b5cf666;box-shadow:0 18px 42px #02061755}.sk-Row{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center}.sk-Column{display:flex;flex-direction:column;gap:.75rem}.sk-Grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:.75rem}
h1,h2,h3,h4,h5,h6,p{margin:.4rem 0;overflow-wrap:anywhere}h1,h2,h3{letter-spacing:-.025em}h1{font-size:clamp(1.7rem,5vw,2.45rem);background:linear-gradient(90deg,#fff,#c4b5fd 55%,#67e8f9);background-clip:text;color:transparent}button,input,textarea,select{font:inherit}button{min-height:48px;border:1px solid #ffffff18;border-radius:.85rem;padding:.75rem 1rem;background:linear-gradient(135deg,var(--c-primary),var(--c-primary2));box-shadow:0 10px 24px #4f46e544;color:white;font-weight:800;cursor:pointer;transition:transform .16s ease,filter .16s ease,box-shadow .16s ease}button:hover{transform:translateY(-2px);filter:brightness(1.1);box-shadow:0 14px 30px #4f46e566}button:active{transform:translateY(0) scale(.98)}button.secondary,button.variant-secondary{background:#273451;box-shadow:none}button.danger,button.variant-danger{background:linear-gradient(135deg,#ef4444,#be123c)}button.variant-operator{background:linear-gradient(135deg,#0891b2,#2563eb)}button.variant-success{background:linear-gradient(135deg,#10b981,#059669)}button.variant-ghost{background:#ffffff0d;box-shadow:none}button.size-lg{min-height:56px;font-size:1.1rem}button:disabled,input:disabled{opacity:.5;cursor:not-allowed;transform:none}
input,textarea,select{width:100%;min-height:48px;border:1px solid #ffffff24;border-radius:.85rem;padding:.78rem .9rem;background:#02061799;color:white;outline:none;transition:border-color .18s ease,box-shadow .18s ease,background .18s ease}input::placeholder,textarea::placeholder{color:#94a3b8}input:hover,textarea:hover,select:hover{background:#071027cc}input:focus,textarea:focus,select:focus{border-color:#a78bfa;box-shadow:0 0 0 4px #8b5cf629,0 12px 28px #02061755}.size-lg{min-height:62px;font-size:1.45rem;font-weight:800}.field{display:flex;gap:.6rem;align-items:center}.field input[type=checkbox],.field input[type=radio]{width:auto;accent-color:var(--c-primary)}.sk-Alert{padding:.85rem 1rem;border-radius:.8rem;background:#0ea5e922;border:1px solid #38bdf855}.sk-Badge{display:inline-flex;width:max-content;padding:.35rem .7rem;border-radius:999px;background:linear-gradient(90deg,#7c3aed,#2563eb);color:white;font-size:.78rem;font-weight:800}.sk-Image{max-width:100%;border-radius:.8rem}.sk-Progress{width:100%;accent-color:var(--c-primary)}canvas{max-width:100%;height:auto;background:#fff;border-radius:.8rem}.sk-Modal{position:fixed;inset:10%;z-index:10;overflow:auto;padding:1rem;border-radius:var(--radius);background:#172033;border:1px solid #ffffff30;box-shadow:0 30px 80px #000b}.sk-Accordion details,.sk-Tabs section{padding:.7rem;border:1px solid #ffffff20;border-radius:.75rem}.sk-Table{width:100%;border-collapse:collapse}.sk-Table td,.sk-Table th{padding:.6rem;border:1px solid #ffffff20}.timer{font-variant-numeric:tabular-nums;font-size:2.4rem;font-weight:900;color:#67e8f9}.sk-Guide{display:flex;gap:.85rem;align-items:flex-start;padding:1rem;border-radius:1.1rem;border:1px solid #67e8f944;background:linear-gradient(135deg,#0ea5e920,#7c3aed22);animation:skui-guide-in .45s ease}.sk-Guide .avatar{width:52px;height:52px;flex:0 0 auto;border-radius:50%;background:radial-gradient(circle at 30% 30%,#67e8f9,#4f46e5);display:grid;place-items:center;box-shadow:0 8px 20px #4f46e555}.sk-Guide .avatar svg{width:30px;height:30px}.sk-Guide .body{flex:1;min-width:0}.sk-Guide h4{margin:0 0 .35rem;font-size:1rem;color:#e0f2fe}.sk-Guide p{margin:0;color:#cbd5e1;font-size:.92rem;line-height:1.55}.sk-Guide .hide{margin-inline-start:auto;min-height:36px;padding:.35rem .7rem;font-size:.75rem;background:#ffffff14;box-shadow:none}@keyframes skui-guide-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}button.variant-calculator-key{background:linear-gradient(180deg,#334155,#1e293b);border:1px solid #64748b66;box-shadow:0 6px 0 #0f172a,0 10px 18px #02061766;font-size:1.2rem}button.variant-calculator-key:active,button.depth-raised:active{transform:translateY(3px);box-shadow:0 2px 0 #0f172a,0 4px 10px #02061755}button.depth-raised{box-shadow:0 6px 0 #312e81,0 12px 22px #02061755}button.depth-raised:active{transform:translateY(3px);box-shadow:0 2px 0 #312e81}.error{color:#fecaca;background:#7f1d1d66;padding:1rem;border-radius:.7rem}@media(max-width:520px){.root{padding:.65rem}.sk-App{padding:.85rem;border-radius:1.15rem}.sk-Grid{gap:.55rem}button{padding:.65rem .55rem}}
</style>
</head>
<body><main id="root" class="root"><div class="empty">اضغط «تشغيل» لعرض التطبيق</div></main>
<script>
"use strict";
var currentUi=null,timers=[],currentValues={};
function send(id,event,value){parent.postMessage({source:"skui-preview",type:"event",id:id,event:event,value:value,values:Object.assign({},currentValues)},"*")}
function clearTimers(){timers.forEach(clearInterval);timers=[]}
function text(value){return value==null?"":String(value)}
function safeStyle(el,p){
 var sizes=["width","height","padding","margin","gap","border_radius"];
 sizes.forEach(function(k){var v=p[k];if(v&&/^\\d+(\\.\\d+)?(px|%|rem|em|vh|vw)$/.test(String(v)))el.style[k==="border_radius"?"borderRadius":k]=v});
 if(p.background&&/^(#[0-9a-f]{3,8}|transparent|white|black)$/i.test(p.background))el.style.background=p.background;
 if(p.text_color&&/^(#[0-9a-f]{3,8}|white|black|currentColor)$/i.test(p.text_color))el.style.color=p.text_color;
 if(p.align)el.style.alignItems={start:"flex-start",center:"center",end:"flex-end",stretch:"stretch"}[p.align]||"";
 if(p.justify)el.style.justifyContent={start:"flex-start",center:"center",end:"flex-end",between:"space-between",around:"space-around"}[p.justify]||"";
 var columns=Math.round(Number(p.columns));if(columns>=1&&columns<=6)el.style.gridTemplateColumns="repeat("+columns+",minmax(0,1fr))";
}
function bindCommon(el,node){
 var p=node.props||{},id=node.id;
 ["focus","blur"].forEach(function(ev){el.addEventListener(ev,function(){send(id,"on_"+ev,currentValues[id]!==undefined?currentValues[id]:p.value)})});
 el.addEventListener("keydown",function(e){send(id,"on_key_press",e.key);if(e.key==="Enter")send(id,"on_submit",currentValues[id]!==undefined?currentValues[id]:p.value)});
 safeStyle(el,p);if(p.disabled)el.disabled=true;
}
function guideNode(node){
 var p=node.props||{};if(p.open===false){var hidden=document.createElement("div");hidden.hidden=true;return hidden}
 var el=document.createElement("section");el.className="sk-Guide";
 var avatar=document.createElement("div");avatar.className="avatar";avatar.innerHTML='<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="24" r="12" fill="#e0f2fe"/><rect x="16" y="38" width="32" height="18" rx="9" fill="#e0f2fe"/><circle cx="27" cy="23" r="2" fill="#1e3a8a"/><circle cx="37" cy="23" r="2" fill="#1e3a8a"/><path d="M26 29c2 2 10 2 12 0" stroke="#1e3a8a" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
 var body=document.createElement("div");body.className="body";
 var h=document.createElement("h4");h.textContent=text(p.title||"مرحبًا");
 var msg=document.createElement("p");msg.textContent=text(p.message||p.text||"");
 body.append(h,msg);
 var hide=document.createElement("button");hide.type="button";hide.className="hide";hide.textContent="إخفاء";
 hide.addEventListener("click",function(){el.style.display="none";send(node.id,"on_change",false)});
 el.append(avatar,body,hide);return el;
}
function canvasNode(node){
 var p=node.props||{},cv=document.createElement("canvas");cv.className="sk-Canvas";cv.tabIndex=0;cv.width=Math.min(1600,Number(p.width)||480);cv.height=Math.min(1000,Number(p.height)||280);
 function point(e){var r=cv.getBoundingClientRect();return{x:Math.round((e.clientX-r.left)*cv.width/r.width),y:Math.round((e.clientY-r.top)*cv.height/r.height)}}
 cv.addEventListener("pointerdown",function(e){send(node.id,"on_click",point(e))});
 var lastMove=0;cv.addEventListener("pointermove",function(e){if(Date.now()-lastMove>50){lastMove=Date.now();send(node.id,"on_input",point(e))}});
 requestAnimationFrame(function(){var c=cv.getContext("2d");c.fillStyle="#fff";c.fillRect(0,0,cv.width,cv.height);(p.operations||[]).forEach(function(op){if(op.op==="rect"){c.fillStyle=op.color||"#7c3aed";c.fillRect(op.x,op.y,op.width,op.height)}else if(op.op==="text"){c.fillStyle=op.color||"#111827";c.font=(op.size||16)+"px sans-serif";c.fillText(text(op.text),op.x,op.y)}})});
 return cv;
}
function make(node){
 var p=node.props||{},el;
 if(node.type==="Guide"){el=guideNode(node)}
 else if(node.type==="Heading"){var level=Math.max(1,Math.min(6,Number(p.level)||1));el=document.createElement("h"+level);el.textContent=text(p.text)}
 else if(node.type==="Text"){el=document.createElement("p");el.textContent=text(p.text)}
 else if(node.type==="Button"){el=document.createElement("button");el.textContent=text(p.text);if(p.variant==="secondary")el.className="secondary";if(p.variant==="danger")el.className="danger";el.addEventListener("click",function(){send(node.id,"on_click",p.value)})}
 else if(node.type==="Input"||node.type==="TextArea"){el=document.createElement(node.type==="TextArea"?"textarea":"input");el.placeholder=text(p.placeholder);el.value=text(p.value);currentValues[node.id]=el.value;if(node.type==="TextArea")el.rows=Math.max(1,Math.min(20,Number(p.rows)||4));el.addEventListener("input",function(){currentValues[node.id]=el.value;send(node.id,"on_input",el.value)});el.addEventListener("change",function(){currentValues[node.id]=el.value;send(node.id,"on_change",el.value)})}
 else if(node.type==="Checkbox"||node.type==="Radio"){el=document.createElement("label");el.className="field";var i=document.createElement("input");i.type=node.type.toLowerCase();i.checked=Boolean(p.checked||p.value===true);currentValues[node.id]=i.checked;if(node.type==="Radio")i.name=text(p.group);i.addEventListener("change",function(){currentValues[node.id]=node.type==="Checkbox"?i.checked:p.value;send(node.id,"on_change",currentValues[node.id])});var s=document.createElement("span");s.textContent=text(p.text);el.append(i,s)}
 else if(node.type==="Select"){el=document.createElement("select");(p.options||[]).forEach(function(item){var o=document.createElement("option");if(item&&typeof item==="object"){o.value=text(item.value);o.textContent=text(item.label||item.value)}else{o.value=text(item);o.textContent=text(item)}if(o.value===text(p.value))o.selected=true;el.appendChild(o)});currentValues[node.id]=el.value;el.addEventListener("change",function(){currentValues[node.id]=el.value;send(node.id,"on_select",el.value);send(node.id,"on_change",el.value)})}
 else if(node.type==="Slider"){el=document.createElement("input");el.type="range";el.min=Number(p.min)||0;el.max=Number(p.max)||100;el.step=Number(p.step)||1;el.value=Number(p.value)||0;currentValues[node.id]=Number(el.value);el.addEventListener("input",function(){currentValues[node.id]=Number(el.value);send(node.id,"on_input",Number(el.value))});el.addEventListener("change",function(){currentValues[node.id]=Number(el.value);send(node.id,"on_change",Number(el.value))})}
 else if(node.type==="Progress"){el=document.createElement("progress");el.className="sk-Progress";el.max=Number(p.max)||100;el.value=Number(p.value)||0}
 else if(node.type==="Image"){el=document.createElement("img");el.className="sk-Image";el.src=text(p.src);el.alt=text(p.alt)}
 else if(node.type==="Canvas"){el=canvasNode(node)}
 else if(node.type==="List"){el=document.createElement("ul");(p.items||[]).forEach(function(item){var li=document.createElement("li");li.textContent=text(item);el.appendChild(li)})}
 else if(node.type==="Table"){el=document.createElement("table");el.className="sk-Table";var rows=p.items||p.rows||[];(p.headers||[]).length&&rows.unshift(p.headers);rows.forEach(function(row,ri){var tr=document.createElement("tr");(Array.isArray(row)?row:[row]).forEach(function(cell){var td=document.createElement(ri===0&&p.headers?"th":"td");td.textContent=text(cell);tr.appendChild(td)});el.appendChild(tr)})}
 else if(node.type==="Accordion"){el=document.createElement("div");el.className="sk-Accordion";var d=document.createElement("details");d.open=Boolean(p.open);var summary=document.createElement("summary");summary.textContent=text(p.title||p.text||"التفاصيل");d.appendChild(summary);el.appendChild(d);node.childrenTarget=d}
 else if(node.type==="Modal"){el=document.createElement("section");el.className="sk-Modal";el.hidden=p.open===false}
 else if(node.type==="Tabs"){el=document.createElement("section");var tabs=p.tabs||[],panels=p.panels||[];var nav=document.createElement("div"),panel=document.createElement("p");nav.className="sk-Row";tabs.forEach(function(label,index){var b=document.createElement("button");b.type="button";b.textContent=text(label);b.addEventListener("click",function(){panel.textContent=text(panels[index]||label);send(node.id,"on_select",index)});nav.appendChild(b)});panel.textContent=text(panels[0]||tabs[0]||"");el.append(nav,panel)}
 else if(node.type==="Chart"){el=document.createElement("div");el.className="sk-Chart";var cv=document.createElement("canvas");cv.width=480;cv.height=240;el.appendChild(cv);requestAnimationFrame(function(){var c=cv.getContext("2d"),data=p.data||[],max=Math.max.apply(null,data.concat([1]));c.fillStyle="#fff";c.fillRect(0,0,480,240);data.forEach(function(v,i){var w=420/Math.max(data.length,1);c.fillStyle="#7c3aed";c.fillRect(30+i*w,210-(Number(v)/max)*180,w*.65,(Number(v)/max)*180)})})}
 else if(node.type==="Timer"){el=document.createElement("div");el.className="timer";var count=Number(p.value)||0;el.textContent=count;var interval=Math.max(100,Math.min(60000,Number(p.interval)||1000));if(p.running!==false){var tid=setInterval(function(){count+=1;el.textContent=count;send(node.id,"on_change",count)},interval);timers.push(tid)}}
 else if(node.type==="Audio"){el=document.createElement("audio");el.src=text(p.src);el.controls=p.controls!==false;el.autoplay=Boolean(p.autoplay)}
 else{el=document.createElement(["App","Page","Container","Row","Column","Grid","Card","Alert","Badge","Tabs"].includes(node.type)?"section":"div");if(p.text)el.textContent=text(p.text)}
 if(node.type!=="Guide")el.classList.add("sk-"+node.type);
 if(/^(secondary|danger|operator|success|ghost|calculator-key|primary)$/.test(p.variant||""))el.classList.add("variant-"+p.variant);
 if(/^(sm|md|lg)$/.test(p.size||""))el.classList.add("size-"+p.size);
 if(/^(raised|flat)$/.test(p.depth||""))el.classList.add("depth-"+p.depth);
 if(p.direction==="ltr"||p.direction==="rtl")el.dir=p.direction;bindCommon(el,node);return el;
}
function append(id,parent,seen){
 if(seen.has(id)||!currentUi.nodes[id])return;seen.add(id);var node=currentUi.nodes[id],el=make(node);parent.appendChild(el);var target=node.childrenTarget||el;(node.children||[]).forEach(function(child){append(child,target,seen)})
}
function render(ui){clearTimers();currentValues={};currentUi=ui;var root=document.getElementById("root");root.replaceChildren();if(!ui||!ui.nodes){root.innerHTML='<div class="empty">اضغط «تشغيل» لعرض التطبيق</div>';return}var ids=ui.appId?[ui.appId]:ui.roots||[];var seen=new Set();ids.forEach(function(id){append(id,root,seen)});if(!seen.size)root.innerHTML='<div class="empty">لا توجد مكونات للعرض</div>';var app=ui.appId&&ui.nodes[ui.appId];if(app){document.documentElement.dir=app.props.direction==="ltr"?"ltr":"rtl";document.title=text(app.props.title||"skui");var light=app.props.theme==="light"||(app.props.theme==="auto"&&matchMedia("(prefers-color-scheme:light)").matches);document.documentElement.style.colorScheme=light?"light":"dark";document.body.style.background=light?"#f8fafc":"linear-gradient(150deg,#0f172a,#1e1b4b)";document.body.style.color=light?"#0f172a":"#f8fafc"}}
addEventListener("message",function(e){if(e.source!==parent)return;var m=e.data||{};if(m.type==="render")render(m.ui);if(m.type==="clear")render(null)});
</script></body></html>`;

export function SkuiPreviewFrame({ ui, loading, onEvent, title = "معاينة تطبيق skui", minHeight = 360 }) {
  const frameRef = useRef(null);
  const srcDoc = useMemo(() => SKUI_FRAME_HTML, []);

  useEffect(() => {
    const handler = (event) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      const message = event.data || {};
      if (message.source === "skui-preview" && message.type === "event") {
        onEvent?.(message.id, message.event, message.value, message.values);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onEvent]);

  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage({ type: ui ? "render" : "clear", ui }, "*");
  }, [ui]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-slate-950">
      {loading ? (
        <div className="absolute inset-x-0 top-0 z-10 bg-violet-600/90 px-3 py-1 text-center text-xs text-white">
          جاري تشغيل المشروع…
        </div>
      ) : null}
      <iframe
        ref={frameRef}
        title={title}
        sandbox="allow-scripts"
        srcDoc={srcDoc}
        onLoad={() => frameRef.current?.contentWindow?.postMessage({ type: ui ? "render" : "clear", ui }, "*")}
        className="w-full border-0 bg-slate-950"
        style={{ minHeight }}
        data-testid="skui-preview-frame"
      />
    </div>
  );
}
