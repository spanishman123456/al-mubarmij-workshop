import { useMemo, useState } from "react";

/** خريطة كارنوف تعليمية لمتغيرين — عرض التبسيط المبدئي */
export function KarnaughMapSim() {
  const [vals, setVals] = useState(["0", "1", "1", "1"]);

  const labels = ["p̄q̄", "p̄q", "pq̄", "pq"];
  const grid = [
    [vals[0], vals[1]],
    [vals[2], vals[3]],
  ];

  const simplified = useMemo(() => {
    const ones = vals.map((v, i) => (v === "1" ? labels[i] : null)).filter(Boolean);
    if (ones.length === 0) return "0";
    if (ones.length === 4) return "1";
    if (ones.length === 1) return ones[0];
    const hasP = vals[2] === "1" || vals[3] === "1";
    const hasNotP = vals[0] === "1" || vals[1] === "1";
    const hasQ = vals[1] === "1" || vals[3] === "1";
    const hasNotQ = vals[0] === "1" || vals[2] === "1";
    const terms = [];
    if (hasP && !hasNotP) terms.push("p");
    else if (!hasP && hasNotP) terms.push("p̄");
    if (hasQ && !hasNotQ) terms.push("q");
    else if (!hasQ && hasNotQ) terms.push("q̄");
    if (terms.length) return terms.join(" · ");
    return ones.join(" + ");
  }, [vals, labels]);

  const steps = [
    "1. ضع قيم جدول الحقيقة في خلايا K-Map (2×2 لمتغيرين).",
    "2. ابحث عن مجموعات من 1 متجاورة (أفقية أو رأسية).",
    "3. كل مجموعة تُبسَّط إلى حد منطقي.",
    `4. التعبير المبسَّط المبدئي: F = ${simplified}`,
  ];

  function toggle(i) {
    setVals((prev) => {
      const next = [...prev];
      next[i] = prev[i] === "1" ? "0" : "1";
      return next;
    });
  }

  return (
    <div className="space-y-4" dir="rtl">
      <p className="lab-hint">انقر على الخلايا لتغيير القيم (0/1) — نسخة تعليمية لمتغيرين p و q</p>
      <div className="flex flex-wrap items-start gap-8 justify-center">
        <div>
          <div className="mb-2 flex justify-center gap-8 text-xs text-cyan-300">
            <span>q=0</span>
            <span>q=1</span>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col justify-center gap-6 text-xs text-cyan-300">
              <span>p=0</span>
              <span>p=1</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {vals.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(i)}
                  className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 text-xl font-bold transition ${
                    v === "1"
                      ? "border-emerald-400 bg-emerald-900/50 text-emerald-300"
                      : "border-slate-600 bg-slate-800 text-slate-500"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs text-slate-400">
            {labels.map((l, i) => (
              <span key={l}>
                {l}={vals[i]}
              </span>
            ))}
          </div>
        </div>
        <div className="max-w-xs">
          <p className="font-bold text-violet-300">خطوات التبسيط:</p>
          <ol className="mt-2 space-y-1 text-sm text-slate-300">
            {steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <div className="lab-result mt-4">F = {simplified}</div>
        </div>
      </div>
    </div>
  );
}
