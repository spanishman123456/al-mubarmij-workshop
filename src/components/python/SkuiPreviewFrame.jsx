import { useEffect, useMemo, useRef, useState } from "react";
import { SKUI_SCENE_CSS } from "../../lib/skui/sceneStyles.js";

// The export bundle and React iframe must render the same skui document template.
// eslint-disable-next-line react-refresh/only-export-components
export function buildSkuiFrameHtml({ lang = "ar", direction = "rtl" } = {}) {
  const frameLang = lang === "en" ? "en" : "ar";
  const frameDirection = direction === "ltr" ? "ltr" : "rtl";
  return `<!doctype html>
<html lang="${frameLang}" dir="${frameDirection}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
:root{--c-bg:#070b18;--c-panel:#111a31;--c-text:#f8fafc;--c-muted:#a7b0c5;--c-primary:#8b5cf6;--c-primary2:#4f46e5;--c-accent:#22d3ee;--c-ok:#10b981;--c-warn:#f59e0b;--c-danger:#ef4444;--space:1rem;--radius:1rem;--shadow:0 24px 70px rgba(2,6,23,.48);color-scheme:dark}
*{box-sizing:border-box}html{min-height:100%;scrollbar-gutter:stable}body{margin:0;min-height:100%;overflow-x:hidden;background:radial-gradient(circle at 10% 5%,#312e8166,transparent 34%),radial-gradient(circle at 90% 15%,#0891b233,transparent 30%),linear-gradient(145deg,#070b18,#11183a 55%,#16113c);color:var(--c-text);font-family:Tajawal,"Segoe UI",sans-serif}.root{width:100%;min-height:100%;padding:clamp(1rem,4vw,2.5rem);display:grid;place-items:start center}.empty{display:grid;place-items:center;width:100%;min-height:260px;color:var(--c-muted);border:1px dashed #ffffff30;border-radius:1.25rem;background:#ffffff08}
.sk-App{width:min(100%,720px);margin:auto;padding:clamp(1rem,3vw,1.75rem);border:1px solid #ffffff24;border-radius:1.6rem;background:linear-gradient(155deg,#ffffff18,#ffffff08);box-shadow:var(--shadow);backdrop-filter:blur(18px)}.sk-Page{width:100%;max-width:100%;margin:auto}.sk-Container,.sk-Card{padding:var(--space);border:1px solid #ffffff1f;border-radius:var(--radius);background:linear-gradient(150deg,#ffffff12,#ffffff08);box-shadow:0 14px 35px rgba(2,6,23,.24)}.sk-Card{transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}.sk-Card:hover{transform:translateY(-2px);border-color:#8b5cf666;box-shadow:0 18px 42px #02061755}.sk-Row{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center}.sk-Column{display:flex;flex-direction:column;gap:.75rem}.sk-Grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:.75rem}
h1,h2,h3,h4,h5,h6,p{margin:.4rem 0;overflow-wrap:anywhere}h1,h2,h3{letter-spacing:-.025em}h1{font-size:clamp(1.7rem,5vw,2.45rem);background:linear-gradient(90deg,#fff,#c4b5fd 55%,#67e8f9);background-clip:text;color:transparent}button,input,textarea,select{font:inherit}button{min-height:48px;border:1px solid #ffffff18;border-radius:.85rem;padding:.75rem 1rem;background:linear-gradient(135deg,var(--c-primary),var(--c-primary2));box-shadow:0 10px 24px #4f46e544;color:white;font-weight:800;cursor:pointer;transition:transform .16s ease,filter .16s ease,box-shadow .16s ease}button:hover{transform:translateY(-2px);filter:brightness(1.1);box-shadow:0 14px 30px #4f46e566}button:active{transform:translateY(0) scale(.98)}button.secondary,button.variant-secondary{background:#273451;box-shadow:none}button.danger,button.variant-danger{background:linear-gradient(135deg,#ef4444,#be123c)}button.variant-operator{background:linear-gradient(135deg,#0891b2,#2563eb)}button.variant-success{background:linear-gradient(135deg,#10b981,#059669)}button.variant-ghost{background:#ffffff0d;box-shadow:none}button.size-lg{min-height:56px;font-size:1.1rem}button:disabled,input:disabled{opacity:.5;cursor:not-allowed;transform:none}
input,textarea,select{width:100%;min-height:48px;border:1px solid #ffffff24;border-radius:.85rem;padding:.78rem .9rem;background:#02061799;color:white;outline:none;transition:border-color .18s ease,box-shadow .18s ease,background .18s ease}input::placeholder,textarea::placeholder{color:#94a3b8}input:hover,textarea:hover,select:hover{background:#071027cc}input:focus,textarea:focus,select:focus{border-color:#a78bfa;box-shadow:0 0 0 4px #8b5cf629,0 12px 28px #02061755}.size-lg{min-height:62px;font-size:1.45rem;font-weight:800}.field{display:flex;gap:.6rem;align-items:center}.field input[type=checkbox],.field input[type=radio]{width:auto;accent-color:var(--c-primary)}.sk-Alert{padding:.85rem 1rem;border-radius:.8rem;background:#0ea5e922;border:1px solid #38bdf855}.sk-Badge,.sk-LevelBadge{display:inline-flex;width:max-content;padding:.35rem .7rem;border-radius:999px;background:linear-gradient(90deg,#7c3aed,#2563eb);color:white;font-size:.78rem;font-weight:800}.sk-Image{max-width:100%;border-radius:.8rem}.sk-Progress{width:100%;accent-color:var(--c-primary)}canvas{display:block;max-width:100%;height:auto;background:#fff;border-radius:.8rem}.sk-Modal{position:fixed;inset:50% auto auto 50%;translate:-50% -50%;width:min(92vw,640px);max-height:82vh;z-index:30;overflow:auto;padding:1.25rem;border-radius:var(--radius);background:#172033;border:1px solid #ffffff30;box-shadow:0 30px 80px #000b}.sk-Dialog,.sk-Drawer{position:relative;inset:auto;translate:none;grid-column:1/-1;width:100%;max-height:none;overflow:visible;padding:1.25rem;border-radius:var(--radius);background:#172033;border:1px solid #ffffff30;box-shadow:0 18px 45px #0007}.sk-Dialog:before{display:none}.sk-Drawer[data-position=start]{inset:auto;border:1px solid #ffffff30}.sk-Toast{position:fixed;z-index:40;inset-inline:1rem;inset-block-end:1rem;width:min(420px,calc(100% - 2rem));margin-inline:auto;padding:1rem;border:1px solid #34d39966;border-radius:1rem;background:#052e2eee;box-shadow:0 20px 50px #0008}.sk-Accordion details,.sk-Tabs section{padding:.7rem;border:1px solid #ffffff20;border-radius:.75rem}.sk-Table,.sk-DataGrid{width:100%;border-collapse:collapse}.sk-Table td,.sk-Table th,.sk-DataGrid td,.sk-DataGrid th{padding:.7rem;border-bottom:1px solid #ffffff18;text-align:start}.sk-DataGrid th{position:sticky;top:0;background:#111827;color:#a5f3fc}.sk-DataGrid-wrap{max-width:100%;overflow:auto;border:1px solid #ffffff18;border-radius:1rem}.timer{font-variant-numeric:tabular-nums;font-size:2.4rem;font-weight:900;color:#67e8f9}.sk-Guide{display:flex;gap:.85rem;align-items:flex-start;padding:1rem;border-radius:1.1rem;border:1px solid #67e8f944;background:linear-gradient(135deg,#0ea5e920,#7c3aed22);animation:skui-guide-in .45s ease}.sk-Guide[data-mood=warning]{border-color:#fbbf2466;background:#78350f55}.sk-Guide[data-mood=success]{border-color:#34d39966;background:#064e3b66}.sk-Guide .avatar{width:52px;height:52px;flex:0 0 auto;border-radius:50%;background:radial-gradient(circle at 30% 30%,#67e8f9,#4f46e5);display:grid;place-items:center;box-shadow:0 8px 20px #4f46e555}.sk-Guide .avatar svg{width:30px;height:30px}.sk-Guide .body{flex:1;min-width:0}.sk-Guide h4{margin:0 0 .35rem;font-size:1rem;color:#e0f2fe}.sk-Guide p{margin:0;color:#cbd5e1;font-size:.92rem;line-height:1.55}.sk-Guide .hide{margin-inline-start:auto;min-height:36px;padding:.35rem .7rem;font-size:.75rem;background:#ffffff14;box-shadow:none}.sk-HeroSection{position:relative;overflow:hidden;padding:clamp(1.25rem,5vw,3.5rem);border:1px solid #ffffff20;border-radius:1.5rem;background:linear-gradient(135deg,#4f46e555,#0891b244)}.sk-HeroSection:after{content:"";position:absolute;width:260px;height:260px;inset-inline-end:-90px;top:-130px;border-radius:50%;background:#67e8f922}.sk-HeroSection .hero-icon{position:relative;z-index:1;display:inline-grid;place-items:center;width:3.25rem;height:3.25rem;margin-block-end:.75rem;border-radius:1rem;background:#ffffff18;font-size:1.7rem}.sk-HeroSection>img{width:min(38%,320px);float:inline-end;position:relative;z-index:1}.sk-GameBoard,.sk-MapPanel{position:relative;min-height:clamp(260px,48vh,620px);overflow:hidden;padding:1rem;border:1px solid #ffffff24;border-radius:1.25rem;background:linear-gradient(145deg,#0f172acc,#172554cc);box-shadow:inset 0 0 50px #020617aa}.sk-GameBoard{display:grid;gap:.5rem;align-content:center}.board-cell{display:grid;place-items:center;min-height:54px;padding:.5rem;border:1px solid #ffffff20;border-radius:.7rem;background:#ffffff0b;font-weight:800}.sk-MapPanel{background-color:#082f49;background-image:linear-gradient(#38bdf811 1px,transparent 1px),linear-gradient(90deg,#38bdf811 1px,transparent 1px);background-size:28px 28px}.map-marker{position:absolute;translate:-50% -50%;display:grid;place-items:center;min-width:2.3rem;min-height:2.3rem;padding:.35rem;border:2px solid white;border-radius:999px;background:var(--c-primary);box-shadow:0 0 0 5px #ffffff18,0 8px 24px #0008;font-size:.75rem;font-weight:900}.sk-MetricCard,.sk-StatusPanel,.sk-MissionCard{padding:1rem;border:1px solid #ffffff20;border-radius:1rem;background:linear-gradient(145deg,#ffffff10,#ffffff06)}.sk-MetricCard{border-block-start:3px solid var(--c-accent)}.sk-MetricCard .metric-value,.sk-AnimatedCounter{font-size:clamp(1.6rem,5vw,2.6rem);font-weight:900;font-variant-numeric:tabular-nums;color:#67e8f9}.sk-StatusPanel{display:grid;gap:.65rem}.status-chip{width:max-content;padding:.25rem .55rem;border-radius:999px;background:#0f766e;color:#ccfbf1;font-size:.75rem;font-weight:800}.panel-item{padding:.55rem .7rem;border-radius:.65rem;background:#ffffff0b}.sk-MissionCard{border-inline-start:4px solid var(--c-primary)}.sk-MissionCard progress{width:100%;accent-color:var(--c-primary)}.sk-Timeline{display:grid;gap:.75rem;border-inline-start:2px solid #ffffff22;padding-inline-start:1rem}.sk-Timeline .timeline-item{position:relative;padding:.65rem .8rem;border-radius:.75rem;background:#ffffff0b}.sk-Timeline .timeline-item.active{color:white;background:#0e749044}.sk-Timeline .timeline-item:before{content:"";position:absolute;inset-inline-start:-1.42rem;top:1rem;width:.7rem;height:.7rem;border-radius:50%;background:var(--c-accent);box-shadow:0 0 14px var(--c-accent)}.sk-StepIndicator{display:flex;gap:.5rem;flex-wrap:wrap;counter-reset:step}.sk-StepIndicator .step{display:flex;align-items:center;gap:.35rem;color:var(--c-muted)}.sk-StepIndicator .step:before{counter-increment:step;content:counter(step);display:grid;place-items:center;width:1.8rem;height:1.8rem;border-radius:50%;background:#334155;color:white;font-weight:800}.sk-StepIndicator .step.active{color:white}.sk-StepIndicator .step.active:before{background:var(--c-primary)}.sk-ProgressRing{display:grid;place-items:center;position:relative;width:max-content}.sk-ProgressRing svg{width:110px;height:110px;rotate:-90deg}.sk-ProgressRing .ring-value{position:absolute;font-weight:900;font-size:1.2rem}.sk-Tooltip{position:relative;display:inline-flex}.sk-Tooltip .tooltip-text{visibility:hidden;opacity:0;position:absolute;z-index:15;inset-block-end:calc(100% + .5rem);inset-inline-start:50%;translate:-50%;width:max-content;max-width:220px;padding:.45rem .65rem;border-radius:.55rem;background:#020617;color:white;font-size:.78rem;transition:.15s}.sk-Tooltip:hover .tooltip-text,.sk-Tooltip:focus-within .tooltip-text{visibility:visible;opacity:1}@keyframes skui-guide-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}button.variant-calculator-key{background:linear-gradient(180deg,#334155,#1e293b);border:1px solid #64748b66;box-shadow:0 6px 0 #0f172a,0 10px 18px #02061766;font-size:1.2rem}button.variant-calculator-key:active,button.depth-raised:active{transform:translateY(3px);box-shadow:0 2px 0 #0f172a,0 4px 10px #02061755}button.depth-raised{box-shadow:0 6px 0 #312e81,0 12px 22px #02061755}button.depth-raised:active{transform:translateY(3px);box-shadow:0 2px 0 #312e81}.error{color:#fecaca;background:#7f1d1d66;padding:1rem;border-radius:.7rem}body.layout-fullscreen .root,body.layout-workspace .root,body.layout-split .root,body.layout-map .root,body.layout-game .root{padding:0;min-height:100vh;place-items:stretch}body[class*=layout-] .sk-App{width:100%;max-width:none;margin:0;border-radius:0;min-height:100vh}body.layout-workspace .sk-App{display:grid;grid-template-columns:minmax(0,2fr) minmax(260px,1fr);align-content:start}body.layout-split .sk-App{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start}body.layout-map .sk-App,body.layout-game .sk-App{background:#020617dd}.layout-span{grid-column:1/-1}@media(max-width:760px){body.layout-workspace .sk-App,body.layout-split .sk-App{grid-template-columns:1fr}.layout-span{grid-column:auto}}@media(max-width:520px){.root{padding:.65rem}.sk-App{padding:.85rem;border-radius:1.15rem}.sk-Grid{gap:.55rem}button{padding:.65rem .55rem}.sk-Guide{align-items:center;flex-wrap:wrap}.sk-HeroSection{padding:1rem}.sk-HeroSection>img{width:100%;float:none}.sk-GameBoard,.sk-MapPanel{min-height:240px}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}
${SKUI_SCENE_CSS}
</style>
</head>
<body><main id="root" class="root"><div class="empty">اضغط «تشغيل» لعرض التطبيق</div></main>
<script>
"use strict";
var currentUi=null,timers=[],currentValues={},defaultDirection=${JSON.stringify(frameDirection)},defaultLang=${JSON.stringify(frameLang)};
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
 var el=document.createElement("section");el.className="sk-Guide";el.dataset.mood=text(p.mood||p.variant||"info");el.setAttribute("role","status");
 var avatar=document.createElement("div");avatar.className="avatar";avatar.innerHTML='<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="24" r="12" fill="#e0f2fe"/><rect x="16" y="38" width="32" height="18" rx="9" fill="#e0f2fe"/><circle cx="27" cy="23" r="2" fill="#1e3a8a"/><circle cx="37" cy="23" r="2" fill="#1e3a8a"/><path d="M26 29c2 2 10 2 12 0" stroke="#1e3a8a" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
 var body=document.createElement("div");body.className="body";
 var h=document.createElement("h4");h.textContent=text(p.title||p.name||"مرحبًا");
 var msg=document.createElement("p");msg.textContent=text(p.message||p.text||"");
 body.append(h,msg);
 el.append(avatar,body);
 if(p.dismissible!==false){var hide=document.createElement("button");hide.type="button";hide.className="hide";hide.textContent=text(p.dismiss_text||"إخفاء");hide.addEventListener("click",function(){el.style.display="none";send(node.id,"on_change",false)});el.appendChild(hide)}
 return el;
}
function canvasNode(node){
 var p=node.props||{},cv=document.createElement("canvas");cv.className="sk-Canvas";cv.tabIndex=0;cv.width=Math.min(1600,Number(p.width)||480);cv.height=Math.min(1000,Number(p.height)||280);
 function point(e){var r=cv.getBoundingClientRect();return{x:Math.round((e.clientX-r.left)*cv.width/r.width),y:Math.round((e.clientY-r.top)*cv.height/r.height)}}
 cv.addEventListener("pointerdown",function(e){send(node.id,"on_click",point(e))});
 var lastMove=0;cv.addEventListener("pointermove",function(e){if(Date.now()-lastMove>50){lastMove=Date.now();send(node.id,"on_input",point(e))}});
 requestAnimationFrame(function(){var c=cv.getContext("2d");c.fillStyle=p.background||"#fff";c.fillRect(0,0,cv.width,cv.height);(p.operations||[]).forEach(function(op){c.save();c.globalAlpha=Math.max(0,Math.min(1,Number(op.opacity==null?1:op.opacity)));c.lineWidth=Math.max(1,Number(op.line_width||op.width_line)||2);c.lineCap=op.line_cap||"round";if(op.op==="rect"){if(op.fill!==false){c.fillStyle=op.color||op.fill_color||"#7c3aed";c.fillRect(Number(op.x)||0,Number(op.y)||0,Number(op.width)||0,Number(op.height)||0)}if(op.stroke||op.stroke_color){c.strokeStyle=op.stroke_color||op.color||"#111827";c.strokeRect(Number(op.x)||0,Number(op.y)||0,Number(op.width)||0,Number(op.height)||0)}}else if(op.op==="line"){c.beginPath();c.lineWidth=Math.max(1,Number(op.width)||2);c.moveTo(Number(op.x1!=null?op.x1:op.x)||0,Number(op.y1!=null?op.y1:op.y)||0);c.lineTo(Number(op.x2!=null?op.x2:op.to_x)||0,Number(op.y2!=null?op.y2:op.to_y)||0);c.strokeStyle=op.color||"#7c3aed";c.stroke()}else if(op.op==="circle"){c.beginPath();c.arc(Number(op.x!=null?op.x:op.cx)||0,Number(op.y!=null?op.y:op.cy)||0,Math.max(0,Number(op.radius||op.r)||0),0,Math.PI*2);if(Number(op.width)>0){c.lineWidth=Number(op.width);c.strokeStyle=op.stroke_color||op.color||"#111827";c.stroke()}else{c.fillStyle=op.color||op.fill_color||"#7c3aed";c.fill()}}else if(op.op==="text"){c.fillStyle=op.color||"#111827";c.font=(Number(op.size)||16)+"px "+(op.font||"sans-serif");c.textAlign=op.align||"start";c.direction=op.direction||document.documentElement.dir;c.fillText(text(op.text),Number(op.x)||0,Number(op.y)||0)}c.restore()})});
 return cv;
}
function addTextBlock(el,p){
 var title=p.title||p.label,description=p.description||p.subtitle||p.text;
 if(title){var h=document.createElement("h3");h.textContent=text(title);el.appendChild(h)}
 if(description){var d=document.createElement("p");d.textContent=text(description);el.appendChild(d)}
}
function metricNode(node){
 var p=node.props||{},el=document.createElement("section");addTextBlock(el,p);var value=document.createElement("div");value.className="metric-value";value.textContent=text(p.value==null?"—":p.value)+(p.unit||p.suffix||"");el.appendChild(value);if(p.trend){var trend=document.createElement("small");trend.textContent=text(p.trend);el.appendChild(trend)}return el;
}
function listComponent(node,className){
 var p=node.props||{},el=document.createElement("section"),current=p.value!=null?p.value:(p.current!=null?p.current:p.active||0);el.className=className;addTextBlock(el,p);(p.items||p.steps||p.events||[]).forEach(function(item,index){var row=document.createElement("div");row.className=className==="sk-StepIndicator"?"step"+(index<Number(current)?" active":""):"timeline-item"+(index<=Number(current)?" active":"");row.textContent=text(item&&typeof item==="object"?(item.title||item.label||item.text||item.value):item);el.appendChild(row)});return el;
}
function dataGridNode(node){
 var p=node.props||{},wrap=document.createElement("div"),table=document.createElement("table");wrap.className="sk-DataGrid-wrap";table.className="sk-DataGrid";var columns=p.columns||p.headers||[],rows=p.items&&p.items.length?p.items:(p.data||p.rows||[]);if(columns.length){var trh=document.createElement("tr");columns.forEach(function(column){var th=document.createElement("th");th.textContent=text(column&&typeof column==="object"?(column.label||column.title||column.key):column);trh.appendChild(th)});var thead=document.createElement("thead");thead.appendChild(trh);table.appendChild(thead)}var tbody=document.createElement("tbody");rows.forEach(function(row){var tr=document.createElement("tr");var cells=Array.isArray(row)?row:columns.map(function(column){return row&&row[column.key||column]});cells.forEach(function(cell){var td=document.createElement("td");td.textContent=text(cell);tr.appendChild(td)});tbody.appendChild(tr)});table.appendChild(tbody);wrap.appendChild(table);return wrap;
}
function panelNode(node){
 var p=node.props||{},el=document.createElement("section");addTextBlock(el,p);
 if(node.type==="HeroSection"&&p.icon){var icon=document.createElement("span");icon.className="hero-icon";icon.textContent=text(p.icon);el.prepend(icon)}
 if(node.type==="HeroSection"&&p.image){var image=document.createElement("img");image.src=text(p.image);image.alt="";el.prepend(image)}
 if(node.type==="GameBoard"){var columns=Math.max(1,Math.min(12,Number(p.columns)||3));el.style.gridTemplateColumns="repeat("+columns+",minmax(0,1fr))";(p.items||[]).forEach(function(item){var cell=document.createElement("div");cell.className="board-cell";cell.textContent=text(item&&typeof item==="object"?(item.label||item.text||item.value):item);el.appendChild(cell)})}
 if(node.type==="StatusPanel"){if(p.status){var status=document.createElement("span");status.className="status-chip";status.textContent=text(p.status);el.appendChild(status)}(p.items||[]).forEach(function(item){var row=document.createElement("div");row.className="panel-item";row.textContent=text(item&&typeof item==="object"?(item.label||item.title||item.text||item.value):item);el.appendChild(row)})}
 if(node.type==="MissionCard"){if(p.status){var missionStatus=document.createElement("span");missionStatus.className="status-chip";missionStatus.textContent=text(p.status);el.appendChild(missionStatus)}var progress=document.createElement("progress");progress.max=100;progress.value=Math.max(0,Math.min(100,Number(p.progress)||0));el.appendChild(progress)}
 if(node.type==="MapPanel"){(p.markers||[]).forEach(function(marker,index,all){var pin=document.createElement("button"),x=marker&&Number(marker.x),y=marker&&Number(marker.y);pin.type="button";pin.className="map-marker";pin.style.left=(Number.isFinite(x)?Math.max(5,Math.min(95,x)):15+70*((index+1)/(all.length+1)))+"%";pin.style.top=(Number.isFinite(y)?Math.max(8,Math.min(92,y)):25+50*((index%3)/2))+"%";pin.textContent=text(marker&&typeof marker==="object"?(marker.label||marker.title||marker.icon||index+1):marker);pin.addEventListener("click",function(){send(node.id,"on_select",marker)});el.appendChild(pin)})}
 return el;
}
function progressRingNode(node){
 var p=node.props||{},value=Math.max(0,Math.min(Number(p.max)||100,Number(p.value)||0)),max=Number(p.max)||100,ratio=value/max,el=document.createElement("div");el.className="sk-ProgressRing";el.innerHTML='<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" fill="none" stroke="#ffffff18" stroke-width="10"/><circle class="value-ring" cx="60" cy="60" r="50" fill="none" stroke="'+(p.color||"#22d3ee")+'" stroke-width="10" stroke-linecap="round"/></svg>';var ring=el.querySelector(".value-ring"),length=2*Math.PI*50;ring.style.strokeDasharray=length;ring.style.strokeDashoffset=length*(1-ratio);var label=document.createElement("span");label.className="ring-value";label.textContent=text(p.label||Math.round(ratio*100)+"%");el.appendChild(label);return el;
}
function animatedCounterNode(node){
 var p=node.props||{},el=document.createElement("strong"),target=Number(p.value)||0,duration=Math.max(0,Math.min(5000,Number(p.duration)||700)),start=performance.now();el.className="sk-AnimatedCounter";function frame(now){var progress=duration?Math.min(1,(now-start)/duration):1;el.textContent=text(Math.round(target*progress))+(p.suffix||"");if(progress<1)requestAnimationFrame(frame)}requestAnimationFrame(frame);return el;
}
function make(node){
 var p=node.props||{},el;
 if(node.type==="Guide"||node.type==="CharacterGuide"){el=guideNode(node)}
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
 else if(node.type==="MetricCard"){el=metricNode(node)}
 else if(node.type==="Timeline"){el=listComponent(node,"sk-Timeline")}
 else if(node.type==="StepIndicator"){el=listComponent(node,"sk-StepIndicator")}
 else if(node.type==="DataGrid"){el=dataGridNode(node)}
 else if(node.type==="ProgressRing"){el=progressRingNode(node)}
 else if(node.type==="AnimatedCounter"){el=animatedCounterNode(node)}
 else if(node.type==="LevelBadge"){el=document.createElement("span");el.textContent=text(p.text||p.label||p.level)}
 else if(node.type==="Tooltip"){el=document.createElement("span");el.className="sk-Tooltip";var tip=document.createElement("span");tip.className="tooltip-text";tip.textContent=text(p.content||p.text||p.message||p.tip);el.appendChild(tip);node.childrenTarget=el}
 else if(node.type==="List"){el=document.createElement("ul");(p.items||[]).forEach(function(item){var li=document.createElement("li");li.textContent=text(item);el.appendChild(li)})}
 else if(node.type==="Table"){el=document.createElement("table");el.className="sk-Table";var rows=p.items||p.rows||[];(p.headers||[]).length&&rows.unshift(p.headers);rows.forEach(function(row,ri){var tr=document.createElement("tr");(Array.isArray(row)?row:[row]).forEach(function(cell){var td=document.createElement(ri===0&&p.headers?"th":"td");td.textContent=text(cell);tr.appendChild(td)});el.appendChild(tr)})}
 else if(node.type==="Accordion"){el=document.createElement("div");el.className="sk-Accordion";var d=document.createElement("details");d.open=Boolean(p.open);var summary=document.createElement("summary");summary.textContent=text(p.title||p.text||"التفاصيل");d.appendChild(summary);el.appendChild(d);node.childrenTarget=d}
 else if(node.type==="Modal"||node.type==="Dialog"||node.type==="Drawer"||node.type==="Toast"){el=document.createElement("section");el.hidden=p.open===false;el.setAttribute("role",node.type==="Toast"?"status":"dialog");if(node.type!=="Toast")el.setAttribute("aria-modal","true");if(node.type==="Drawer")el.dataset.position=p.position==="start"?"start":"end";addTextBlock(el,p);if(node.type==="Toast")el.textContent=text(p.message||p.text);else{var close=document.createElement("button");close.type="button";close.className="secondary";close.textContent=text(p.dismiss_text||"إغلاق");close.addEventListener("click",function(){el.hidden=true});el.appendChild(close)}}
 else if(node.type==="Tabs"){el=document.createElement("section");var tabs=p.tabs||[],panels=p.panels||[];var nav=document.createElement("div"),panel=document.createElement("p");nav.className="sk-Row";tabs.forEach(function(label,index){var b=document.createElement("button");b.type="button";b.textContent=text(label);b.addEventListener("click",function(){panel.textContent=text(panels[index]||label);send(node.id,"on_select",index)});nav.appendChild(b)});panel.textContent=text(panels[0]||tabs[0]||"");el.append(nav,panel)}
 else if(node.type==="Chart"){el=document.createElement("div");el.className="sk-Chart";var cv=document.createElement("canvas");cv.width=480;cv.height=240;el.appendChild(cv);requestAnimationFrame(function(){var c=cv.getContext("2d"),data=p.data||[],max=Math.max.apply(null,data.concat([1]));c.fillStyle="#fff";c.fillRect(0,0,480,240);data.forEach(function(v,i){var w=420/Math.max(data.length,1);c.fillStyle="#7c3aed";c.fillRect(30+i*w,210-(Number(v)/max)*180,w*.65,(Number(v)/max)*180)})})}
 else if(node.type==="Timer"){el=document.createElement("div");el.className="timer";var count=Number(p.value)||0;el.textContent=count;var interval=Math.max(100,Math.min(60000,Number(p.interval)||1000));if(p.running!==false){var tid=setInterval(function(){count+=1;el.textContent=count;send(node.id,"on_change",count)},interval);timers.push(tid)}}
 else if(node.type==="Audio"){el=document.createElement("audio");el.src=text(p.src);el.controls=p.controls!==false;el.autoplay=Boolean(p.autoplay)}
 else if(["HeroSection","GameBoard","StatusPanel","MissionCard","MapPanel"].includes(node.type)){el=panelNode(node)}
 else{el=document.createElement(["App","Page","Container","Row","Column","Grid","Card","Alert","Badge","Tabs","Scene"].includes(node.type)?"section":"div");if(p.text)el.textContent=text(p.text)}
 if(node.type!=="Guide"&&node.type!=="CharacterGuide"&&!el.classList.contains("sk-"+node.type))el.classList.add("sk-"+node.type);
 if(/^(secondary|danger|operator|success|ghost|calculator-key|primary)$/.test(p.variant||""))el.classList.add("variant-"+p.variant);
 if(/^(sm|md|lg)$/.test(p.size||""))el.classList.add("size-"+p.size);
 if(/^(raised|flat)$/.test(p.depth||""))el.classList.add("depth-"+p.depth);
 if(p.span==="full"||p.full_width===true)el.classList.add("layout-span");
 if(p.direction==="ltr"||p.direction==="rtl")el.dir=p.direction;if(p.visible===false)el.hidden=true;bindCommon(el,node);return el;
}
function append(id,parent,seen){
 if(seen.has(id)||!currentUi.nodes[id])return;seen.add(id);var node=currentUi.nodes[id],el=make(node);parent.appendChild(el);var target=node.childrenTarget||el;(node.children||[]).forEach(function(child){append(child,target,seen)})
}
function render(ui,emptyMessage){clearTimers();currentValues={};currentUi=ui;var root=document.getElementById("root");root.replaceChildren();var emptyText=emptyMessage||"اضغط «تشغيل» لعرض التطبيق";if(!ui||!ui.nodes){document.documentElement.lang=defaultLang;document.documentElement.dir=defaultDirection;document.body.className="";root.innerHTML='<div class="empty">'+emptyText+'</div>';return}var ids=ui.appId?[ui.appId]:ui.roots||[];var seen=new Set();ids.forEach(function(id){append(id,root,seen)});if(!seen.size){document.body.className="";root.innerHTML='<div class="empty">لا توجد مكونات للعرض</div>';return}var app=ui.appId&&ui.nodes[ui.appId];if(app){var sceneNode=Object.keys(ui.nodes).map(function(id){return ui.nodes[id]}).find(function(item){return item.type==="Scene"}),settings=Object.assign({},app.props||{},sceneNode&&sceneNode.props||{});document.documentElement.lang=settings.lang==="en"?"en":defaultLang;document.documentElement.dir=settings.direction==="ltr"?"ltr":settings.direction==="rtl"?"rtl":defaultDirection;document.title=text(settings.title||"skui");var light=settings.theme==="light"||(settings.theme==="auto"&&matchMedia("(prefers-color-scheme:light)").matches);document.documentElement.style.colorScheme=light?"light":"dark";var scene=text(settings.scene||settings.name||settings.id||""),layoutValue=settings.layout||settings.appearance||"",layout=/^(fullscreen|workspace|split|map|game)$/.test(layoutValue)?layoutValue:"";document.body.className=(scene?"scene-"+scene+" ":"")+(layout?"layout-"+layout:"");if(!scene){document.body.style.background=light?"#f8fafc":"linear-gradient(150deg,#0f172a,#1e1b4b)";document.body.style.color=light?"#0f172a":"#f8fafc"}else{document.body.style.background="";document.body.style.color=light?"#0f172a":"#f8fafc"}}}
addEventListener("message",function(e){if(e.source!==parent)return;var m=e.data||{};if(m.type==="render")render(m.ui,m.emptyMessage);if(m.type==="clear")render(null,m.emptyMessage)});
function reportSize(){parent.postMessage({source:"skui-preview",type:"resize",height:Math.ceil(Math.max(document.documentElement.scrollHeight,document.body.scrollHeight))},"*")}
if("ResizeObserver" in window)new ResizeObserver(reportSize).observe(document.body);else addEventListener("resize",reportSize);
</script></body></html>`;
}

export function SkuiPreviewFrame({
  ui,
  loading,
  onEvent,
  title = "معاينة تطبيق skui",
  minHeight = 360,
  emptyMessage = "اضغط «تشغيل» لعرض التطبيق",
  viewport = "desktop",
  lang = "ar",
  direction = "rtl",
}) {
  const frameRef = useRef(null);
  const srcDoc = useMemo(() => buildSkuiFrameHtml({ lang, direction }), [lang, direction]);
  const numericMinHeight = typeof minHeight === "number" ? minHeight : 360;
  const [frameHeight, setFrameHeight] = useState(numericMinHeight);

  useEffect(() => {
    const handler = (event) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      const message = event.data || {};
      if (message.source === "skui-preview" && message.type === "event") {
        onEvent?.(message.id, message.event, message.value, message.values);
      }
      if (message.source === "skui-preview" && message.type === "resize") {
        const nextHeight = Math.ceil(Number(message.height));
        if (Number.isFinite(nextHeight) && nextHeight > 0) {
          setFrameHeight(Math.max(numericMinHeight, nextHeight));
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onEvent, numericMinHeight]);

  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage(
      { type: ui ? "render" : "clear", ui, emptyMessage },
      "*",
    );
  }, [ui, emptyMessage]);

  const viewportWidth = {
    desktop: "100%",
    tablet: 820,
    mobile: 430,
  }[viewport] ?? "100%";

  return (
    <div
      className="relative mx-auto overflow-hidden rounded-xl border border-emerald-500/30 bg-slate-950 transition-[width]"
      style={{ width: viewportWidth, maxWidth: "100%" }}
      data-viewport={viewport}
    >
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
        scrolling="no"
        onLoad={() =>
          frameRef.current?.contentWindow?.postMessage(
            { type: ui ? "render" : "clear", ui, emptyMessage },
            "*",
          )
        }
        className="w-full border-0 bg-slate-950"
        style={{ height: frameHeight, minHeight }}
        data-testid="skui-preview-frame"
      />
    </div>
  );
}
