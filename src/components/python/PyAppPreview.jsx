import { useEffect, useRef } from "react";

function drawCanvas(canvas, ops) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, w, h);
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
  }, [ui]);

  if (!ui || !ui.elements?.length) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/30 p-6 text-center text-sm text-slate-400">
        {loading ? "جاري بناء الواجهة..." : "شغّل المشروع لعرض الواجهة الرسومية هنا"}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-inner">
      {ui.title ? (
        <h3 className="mb-4 border-b border-white/10 pb-3 text-center text-lg font-bold text-emerald-200">
          {ui.title}
        </h3>
      ) : null}

      <div className="space-y-4">
        {ui.elements.map((el) => {
          if (el.type === "text") {
            return (
              <p key={`t-${el.content}`} className="text-sm leading-relaxed text-slate-200">
                {el.content}
              </p>
            );
          }
          if (el.type === "input") {
            return (
              <label key={el.id} className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-400">{el.label}</span>
                <input
                  type={el.inputType === "number" ? "number" : "text"}
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                  value={values[el.id] ?? ""}
                  onChange={(e) => onChange(el.id, e.target.value)}
                  dir="ltr"
                />
              </label>
            );
          }
          if (el.type === "output") {
            return (
              <div key={el.id} className="rounded-lg border border-cyan-500/25 bg-cyan-950/30 p-3">
                {el.label ? <p className="mb-1 text-xs font-bold text-cyan-300">{el.label}</p> : null}
                <p className="min-h-[2rem] whitespace-pre-wrap text-sm text-cyan-50" dir="auto">
                  {values[el.id] || "—"}
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
                className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-bold text-white shadow disabled:opacity-50"
              >
                {el.label}
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
