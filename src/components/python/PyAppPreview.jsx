import { useEffect, useRef } from "react";

function drawCanvas(canvas, ops) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const op of ops || []) {
    if (op.op === "rect") {
      ctx.fillStyle = op.color || "#7c3aed";
      ctx.fillRect(op.x, op.y, op.w, op.h);
    } else if (op.op === "text") {
      ctx.fillStyle = op.color || "#1e1b4b";
      ctx.font = "14px Tajawal, sans-serif";
      ctx.fillText(op.text, op.x, op.y);
    }
  }
}

function outputTone(text) {
  const t = String(text || "");
  if (/مبروك|فزت|صحيح|أحسنت|نجح|اكتمل|تم التحويل|تم التشفير|تم فك|تم العثور/i.test(t)) return "success";
  if (/خسرت|خطأ|فارغ|غير صحيح|الرجاء/i.test(t)) return "error";
  if (/أكبر|أصغر|حاول|تلميح|انتهت|بانتظار/i.test(t)) return "warn";
  return "neutral";
}

const OUTPUT_STYLES = {
  success: "border-emerald-500/40 bg-emerald-950/40 text-emerald-50",
  error: "border-red-500/40 bg-red-950/35 text-red-50",
  warn: "border-amber-500/40 bg-amber-950/35 text-amber-50",
  neutral: "border-cyan-500/25 bg-cyan-950/30 text-cyan-50",
};

function buttonClass(id, label) {
  const key = `${id} ${label}`.toLowerCase();
  if (/new|reset|restart|محاولة|إعادة|مسح|clear|retry/.test(key)) {
    return "bg-slate-700 hover:bg-slate-600 text-white border border-white/20";
  }
  if (/start|begin|ابدأ|بدء/.test(key)) {
    return "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:opacity-95";
  }
  if (/help|تعليمات|طريقة/.test(key)) {
    return "bg-cyan-800 hover:bg-cyan-700 text-white";
  }
  return "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:opacity-95";
}

export function PyAppPreview({ ui, values, onChange, onButton, loading }) {
  const canvasRefs = useRef({});

  useEffect(() => {
    if (!ui?.elements) return;
    for (const el of ui.elements) {
      if (el.type === "canvas") {
        const canvas = canvasRefs.current[el.id];
        drawCanvas(canvas, ui.canvasOps?.[el.id]);
      }
    }
  }, [ui, values]);

  if (!ui || !ui.elements?.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/30 p-6 text-center text-sm text-slate-400">
        {loading ? "جاري بناء الواجهة..." : "اضغط «تشغيل المشروع» لعرض اللعبة هنا"}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-4 shadow-inner sm:p-5">
      {ui.title ? (
        <h3 className="mb-3 border-b border-white/10 pb-3 text-center text-lg font-bold text-emerald-200 sm:text-xl">
          {ui.title}
        </h3>
      ) : null}

      <div className="space-y-4">
        {ui.elements.map((el, idx) => {
          if (el.type === "text") {
            return (
              <p key={`text-${idx}`} className="text-sm leading-relaxed text-slate-200 sm:text-base">
                {el.content}
              </p>
            );
          }
          if (el.type === "input") {
            return (
              <label key={el.id} className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-200">{el.label}</span>
                <input
                  type={el.inputType === "number" ? "number" : "text"}
                  min={el.inputType === "number" ? 1 : undefined}
                  max={el.inputType === "number" ? 99999 : undefined}
                  placeholder={el.placeholder || ""}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-3 text-base text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                  value={values[el.id] ?? ""}
                  onChange={(e) => onChange(el.id, e.target.value)}
                  dir="ltr"
                />
              </label>
            );
          }
          if (el.type === "output") {
            const val = values[el.id] || "";
            const tone = outputTone(val);
            return (
              <div key={el.id} className={`rounded-lg border p-4 ${OUTPUT_STYLES[tone]}`}>
                {el.label ? (
                  <p className="mb-2 text-sm font-bold opacity-90">{el.label}</p>
                ) : null}
                <p className="min-h-[2.5rem] whitespace-pre-wrap text-base font-medium leading-relaxed" dir="auto">
                  {val || "انتظر إدخالك ثم اضغط الزر المناسب…"}
                </p>
              </div>
            );
          }
          if (el.type === "button") {
            return (
              <button
                key={el.id}
                type="button"
                disabled={loading}
                onClick={() => onButton(el.id)}
                className={`w-full rounded-xl py-3 text-base font-bold transition disabled:opacity-50 ${buttonClass(el.id, el.label)}`}
              >
                {el.label || "تنفيذ الإجراء"}
              </button>
            );
          }
          if (el.type === "canvas") {
            return (
              <canvas
                key={el.id}
                ref={(node) => {
                  canvasRefs.current[el.id] = node;
                }}
                width={el.width}
                height={el.height}
                className="w-full rounded-lg border border-white/10 bg-slate-100"
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
