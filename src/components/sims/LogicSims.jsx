import { useMemo, useState } from "react";

const VARS = ["p", "q", "r"];

function evalExpr(expr, vals) {
  const e = expr
    .replace(/\bNOT\b/gi, "!")
    .replace(/\bAND\b/gi, "&&")
    .replace(/\bOR\b/gi, "||")
    .replace(/\bXOR\b/gi, "^")
    .replace(/\b¬\s*/g, "!")
    .replace(/⋀/g, "&&")
    .replace(/⋁/g, "||")
    .replace(/⊕/g, "^");
  const used = VARS.filter((v) => new RegExp(`\\b${v}\\b`).test(e));
  const rows = [];
  const n = used.length;
  const total = 2 ** n;
  for (let i = 0; i < total; i++) {
    const row = {};
    used.forEach((v, j) => {
      row[v] = Boolean((i >> (n - 1 - j)) & 1);
    });
    let out = false;
    try {
      const fn = new Function(...used, `return !!(${e});`);
      out = fn(...used.map((v) => row[v]));
    } catch {
      out = false;
    }
    rows.push({ ...row, result: out });
  }
  return { used, rows, error: null };
}

export function TruthTableSim() {
  const [expr, setExpr] = useState("p AND q");
  const { used, rows } = useMemo(() => evalExpr(expr, {}), [expr]);

  return (
    <div className="space-y-4 font-ar text-right" dir="rtl">
      <p className="text-sm text-slate-400">استخدم p, q, r مع AND / OR / NOT / XOR</p>
      <input
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-white"
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] border-collapse text-sm">
          <thead>
            <tr className="bg-white/10">
              {used.map((v) => (
                <th key={v} className="border border-white/10 px-3 py-2">{v}</th>
              ))}
              <th className="border border-white/10 px-3 py-2">الناتج</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {used.map((v) => (
                  <td key={v} className="border border-white/10 px-3 py-2 text-center">
                    {row[v] ? "T" : "F"}
                  </td>
                ))}
                <td className="border border-white/10 px-3 py-2 text-center font-bold text-violet-300">
                  {row.result ? "T" : "F"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const GATES = {
  AND: (a, b) => a && b,
  OR: (a, b) => a || b,
  XOR: (a, b) => a !== b,
  NAND: (a, b) => !(a && b),
  NOR: (a, b) => !(a || b),
  XNOR: (a, b) => a === b,
};

export function LogicGatesSim() {
  const [gate, setGate] = useState("AND");
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const out = GATES[gate](a, b);

  return (
    <div className="space-y-4 font-ar text-right" dir="rtl">
      <select className="rounded-lg border border-white/10 bg-[#1a2038] px-3 py-2 text-white" value={gate} onChange={(e) => setGate(e.target.value)}>
        {Object.keys(GATES).map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <div className="flex flex-wrap items-center justify-center gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
        <button type="button" onClick={() => setA((v) => !v)} className={`h-14 w-14 rounded-lg font-bold ${a ? "bg-emerald-500" : "bg-slate-600"}`}>A</button>
        <div className="text-2xl font-bold text-violet-300">{gate}</div>
        <button type="button" onClick={() => setB((v) => !v)} className={`h-14 w-14 rounded-lg font-bold ${b ? "bg-emerald-500" : "bg-slate-600"}`}>B</button>
        <div className="text-2xl">→</div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-lg font-bold ${out ? "bg-pink-500" : "bg-slate-700"}`}>
          {out ? "1" : "0"}
        </div>
      </div>
    </div>
  );
}

export function NOTGateSim() {
  const [a, setA] = useState(false);
  return (
    <div className="flex items-center justify-center gap-4 font-ar" dir="rtl">
      <button type="button" onClick={() => setA((v) => !v)} className={`h-14 w-14 rounded-lg font-bold ${a ? "bg-emerald-500" : "bg-slate-600"}`}>A</button>
      <span className="text-xl text-violet-300">NOT</span>
      <div className={`flex h-14 w-14 items-center justify-center rounded-lg font-bold ${!a ? "bg-pink-500" : "bg-slate-700"}`}>{!a ? "1" : "0"}</div>
    </div>
  );
}
