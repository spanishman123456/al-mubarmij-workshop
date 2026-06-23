import { useMemo, useState } from "react";

const BASE = 10;

function toDecimal(str, base) {
  const s = String(str || "").trim().toUpperCase();
  if (!s) return null;
  if (base === 16 && !/^[0-9A-F]+$/.test(s)) return null;
  if (base === 2 && !/^[01]+$/.test(s)) return null;
  if (base === 10 && !/^\d+$/.test(s)) return null;
  return parseInt(s, base);
}

function conversionSteps(dec, targetBase) {
  if (dec == null || Number.isNaN(dec)) return [];
  if (targetBase === 10) return [`القيمة العشرية = ${dec}`];
  const steps = [];
  let n = dec;
  const digits = [];
  const labels = targetBase === 2 ? ["0", "1"] : "0123456789ABCDEF".split("");
  while (n > 0) {
    const r = n % targetBase;
    digits.unshift(labels[r]);
    steps.push(`${n} ÷ ${targetBase} = ${Math.floor(n / targetBase)} باقٍ ${r}`);
    n = Math.floor(n / targetBase);
  }
  if (!digits.length) digits.push("0");
  steps.push(`النتيجة (${targetBase === 2 ? "ثنائي" : "ست عشري"}): ${digits.join("")}`);
  return steps;
}

export function NumberConverterSim() {
  const [input, setInput] = useState("27");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);

  const dec = useMemo(() => toDecimal(input, fromBase), [input, fromBase]);
  const result = useMemo(() => {
    if (dec == null) return "—";
    return dec.toString(toBase).toUpperCase();
  }, [dec, toBase]);
  const steps = useMemo(() => conversionSteps(dec, toBase), [dec, toBase]);

  return (
    <div className="space-y-4 font-ar text-right" dir="rtl">
      <p className="text-sm text-slate-400">حوّل بين الأنظمة مع عرض خطوات الحل التعليمية.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm">
          القيمة
          <input
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          من نظام
          <select
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#1a2038] px-3 py-2 text-white"
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
          >
            <option value={10}>عشري</option>
            <option value={2}>ثنائي</option>
            <option value={16}>ست عشري</option>
          </select>
        </label>
        <label className="block text-sm">
          إلى نظام
          <select
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#1a2038] px-3 py-2 text-white"
            value={toBase}
            onChange={(e) => setToBase(Number(e.target.value))}
          >
            <option value={2}>ثنائي</option>
            <option value={10}>عشري</option>
            <option value={16}>ست عشري</option>
          </select>
        </label>
      </div>
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-lg font-bold text-emerald-200">
        الناتج: {result}
      </div>
      <ol className="list-decimal space-y-1 pr-5 text-sm text-slate-300">
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </div>
  );
}

export function BinaryCalculatorSim() {
  const [a, setA] = useState("1011");
  const [b, setB] = useState("1101");
  const [op, setOp] = useState("add");

  const result = useMemo(() => {
    try {
      const x = parseInt(a, 2);
      const y = parseInt(b, 2);
      if (Number.isNaN(x) || Number.isNaN(y)) return null;
      return op === "add" ? x + y : x - y;
    } catch {
      return null;
    }
  }, [a, b, op]);

  const bin = result != null && result >= 0 ? result.toString(2) : "—";

  return (
    <div className="space-y-3 font-ar text-right" dir="rtl">
      <div className="grid gap-3 sm:grid-cols-3">
        <input className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-white" value={a} onChange={(e) => setA(e.target.value.replace(/[^01]/g, ""))} placeholder="ثنائي" />
        <select className="rounded-lg border border-white/10 bg-[#1a2038] px-3 py-2 text-white" value={op} onChange={(e) => setOp(e.target.value)}>
          <option value="add">جمع</option>
          <option value="sub">طرح</option>
        </select>
        <input className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-white" value={b} onChange={(e) => setB(e.target.value.replace(/[^01]/g, ""))} placeholder="ثنائي" />
      </div>
      <p className="text-emerald-300">عشري: {result ?? "—"} | ثنائي: {bin}</p>
    </div>
  );
}
