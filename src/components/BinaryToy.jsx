import { useMemo, useState } from "react";

const bits = [128, 64, 32, 16, 8, 4, 2, 1];

export function BinaryToy() {
  const [on, setOn] = useState(() => Array(8).fill(false));
  const value = useMemo(
    () => on.reduce((s, v, i) => s + (v ? bits[i] : 0), 0),
    [on],
  );

  function toggle(i) {
    setOn((prev) => {
      const n = [...prev];
      n[i] = !n[i];
      return n;
    });
  }

  return (
    <div className="card-glass p-4 text-white">
      <h3 className="font-ar mb-2 text-center text-lg font-bold">محوّل النظام الثنائي</h3>
      <p className="font-ar mb-4 text-center text-xs text-slate-300">
        اضغط الخانات كما في نشاط المقرر — لاحظ تغيّر القيمة العشرية
      </p>
      <div className="mb-3 flex flex-wrap justify-center gap-1">
        {bits.map((b, i) => (
          <button
            key={b}
            type="button"
            onClick={() => toggle(i)}
            className={`flex h-14 w-10 flex-col items-center justify-center rounded-lg border text-xs transition ${
              on[i]
                ? "border-cyan-400 bg-cyan-500/30 text-cyan-100"
                : "border-white/20 bg-white/5 text-slate-400"
            }`}
          >
            <span className="font-mono text-lg">{on[i] ? 1 : 0}</span>
            <span className="opacity-70">{b}</span>
          </button>
        ))}
      </div>
      <div className="font-ar rounded-lg bg-black/30 py-3 text-center">
        <span className="text-slate-400">القيمة العشرية: </span>
        <span className="text-2xl font-bold text-amber-300">{value}</span>
      </div>
    </div>
  );
}
