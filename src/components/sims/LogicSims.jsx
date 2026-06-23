import { useMemo, useState } from "react";
import { LogicCircuitBuilder } from "./LogicCircuitBuilder";

const VARS = ["p", "q", "r"];

const GATE_INFO = {
  AND: "الناتج 1 فقط إذا كان كلا المدخلين 1.",
  OR: "الناتج 1 إذا كان أحد المدخلين على الأقل 1.",
  XOR: "الناتج 1 إذا اختلف المدخلان.",
  NAND: "عكس AND — الناتج 0 فقط عندما يكون كلا المدخلين 1.",
  NOR: "عكس OR — الناتج 1 فقط عندما يكون كلا المدخلين 0.",
  XNOR: "عكس XOR — الناتج 1 عند التطابق.",
};

function preprocessExpr(expr) {
  return expr
    .replace(/\bNOT\s+(\w+)/gi, "!$1")
    .replace(/\b(\w+)\s+XNOR\s+(\w+)/gi, "($1===$2)")
    .replace(/\b(\w+)\s+NAND\s+(\w+)/gi, "!($1&&$2)")
    .replace(/\b(\w+)\s+NOR\s+(\w+)/gi, "!($1||$2)")
    .replace(/\bXOR\b/gi, "!=")
    .replace(/\bAND\b/gi, "&&")
    .replace(/\bOR\b/gi, "||")
    .replace(/\b¬\s*/g, "!")
    .replace(/⋀/g, "&&")
    .replace(/⋁/g, "||")
    .replace(/⊕/g, "!=");
}

function evalExpr(expr) {
  const e = preprocessExpr(expr);
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
  return { used, rows };
}

export function TruthTableSim() {
  const [expr, setExpr] = useState("p AND q");
  const { used, rows } = useMemo(() => evalExpr(expr), [expr]);

  return (
    <div className="space-y-4" dir="rtl">
      <input
        className="lab-input font-mono"
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        placeholder="مثال: (p AND q) OR NOT r"
        dir="ltr"
      />
      <p className="lab-hint">العمليات: AND, OR, NOT, XOR, NAND, NOR, XNOR — المتغيرات: p, q, r</p>
      <div className="overflow-x-auto rounded-lg border border-slate-600">
        <table className="w-full min-w-[280px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-800">
              {used.map((v) => (
                <th key={v} className="border border-slate-600 px-4 py-2 text-cyan-300">
                  {v}
                </th>
              ))}
              <th className="border border-slate-600 px-4 py-2 text-violet-300">الناتج</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 ? "bg-slate-900/50" : ""}>
                {used.map((v) => (
                  <td key={v} className="border border-slate-600 px-4 py-2 text-center font-mono">
                    <span className={row[v] ? "text-emerald-400" : "text-slate-500"}>
                      {row[v] ? "1" : "0"}
                    </span>
                  </td>
                ))}
                <td className="border border-slate-600 px-4 py-2 text-center font-bold">
                  <span className={row.result ? "text-pink-400" : "text-slate-500"}>
                    {row.result ? "1" : "0"}
                  </span>
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

function GateShape({ type, a, b, out }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl border border-slate-600 bg-slate-800/50 p-6">
      <div className="flex flex-col items-center gap-2">
        <Wire value={a} />
        <Wire value={b} />
      </div>
      <div className="relative flex h-16 w-20 items-center justify-center rounded-lg border-2 border-violet-500 bg-violet-900/40">
        <span className="text-sm font-bold text-violet-200">{type}</span>
      </div>
      <Wire value={out} isOutput />
    </div>
  );
}

function Wire({ value, isOutput }) {
  return (
    <div className="flex items-center gap-2">
      {!isOutput ? (
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold ${value ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-400"}`}>
          {value ? "1" : "0"}
        </span>
      ) : null}
      <div className={`h-0.5 w-8 ${value ? "bg-emerald-400" : "bg-slate-600"}`} />
      {isOutput ? (
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold ${value ? "bg-pink-500 text-white" : "bg-slate-700 text-slate-400"}`}>
          {value ? "1" : "0"}
        </span>
      ) : null}
    </div>
  );
}

export function LogicGatesSim() {
  const [gate, setGate] = useState("AND");
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const out = GATES[gate](a, b);

  return (
    <div className="space-y-4" dir="rtl">
      <select className="lab-select" value={gate} onChange={(e) => setGate(e.target.value)}>
        {Object.keys(GATES).map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
      <p className="text-sm text-cyan-200">{GATE_INFO[gate]}</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setA((v) => !v)}
          className={`h-14 w-14 rounded-xl font-bold transition ${a ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-slate-700"}`}
        >
          A
        </button>
        <button
          type="button"
          onClick={() => setB((v) => !v)}
          className={`h-14 w-14 rounded-xl font-bold transition ${b ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-slate-700"}`}
        >
          B
        </button>
      </div>
      <GateShape type={gate} a={a} b={b} out={out} />
    </div>
  );
}

export function LogicCircuitSim() {
  return <LogicCircuitBuilder />;
}
