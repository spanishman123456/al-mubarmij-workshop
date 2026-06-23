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
  if (targetBase === 10) return [`Decimal value = ${dec}`];
  const steps = [];
  let n = dec;
  const digits = [];
  const labels = targetBase === 2 ? ["0", "1"] : "0123456789ABCDEF".split("");
  while (n > 0) {
    const r = n % targetBase;
    digits.unshift(labels[r]);
    steps.push(`${n} ÷ ${targetBase} = ${Math.floor(n / targetBase)} remainder ${r}`);
    n = Math.floor(n / targetBase);
  }
  if (!digits.length) digits.push("0");
  steps.push(`Result: ${digits.join("")}`);
  return steps;
}

const baseName = { 2: "ثنائي", 10: "عشري", 16: "ست عشري" };

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
    <div className="space-y-4" dir="rtl">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="lab-hint block mb-1">القيمة</span>
          <input className="lab-input" value={input} onChange={(e) => setInput(e.target.value)} dir="ltr" />
        </label>
        <label className="block text-sm">
          <span className="lab-hint block mb-1">من نظام</span>
          <select className="lab-select w-full" value={fromBase} onChange={(e) => setFromBase(Number(e.target.value))}>
            <option value={10}>عشري</option>
            <option value={2}>ثنائي</option>
            <option value={16}>ست عشري</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="lab-hint block mb-1">إلى نظام</span>
          <select className="lab-select w-full" value={toBase} onChange={(e) => setToBase(Number(e.target.value))}>
            <option value={2}>ثنائي</option>
            <option value={10}>عشري</option>
            <option value={16}>ست عشري</option>
          </select>
        </label>
      </div>
      {dec != null ? (
        <p className="text-sm text-slate-300">
          القيمة العشرية الوسيطة: <strong className="text-cyan-300">{dec}</strong>
        </p>
      ) : (
        <p className="text-sm text-red-400">قيمة غير صالحة للنظام {baseName[fromBase]}</p>
      )}
      <div className="lab-result">الناتج ({baseName[toBase]}): {result}</div>
      {steps.length > 0 ? (
        <ol className="lab-steps list-decimal space-y-1">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

function binaryAddSteps(a, b) {
  const maxLen = Math.max(a.length, b.length);
  const sa = a.padStart(maxLen, "0");
  const sb = b.padStart(maxLen, "0");
  let carry = 0;
  const result = [];
  const steps = [];
  for (let i = maxLen - 1; i >= 0; i--) {
    const bitA = Number(sa[i]);
    const bitB = Number(sb[i]);
    const sum = bitA + bitB + carry;
    const bit = sum % 2;
    const newCarry = Math.floor(sum / 2);
    steps.push(`${bitA} + ${bitB} + carry(${carry}) = ${sum} → bit ${bit}, carry ${newCarry}`);
    result.unshift(String(bit));
    carry = newCarry;
  }
  if (carry) {
    result.unshift("1");
    steps.push(`Carry نهائي → 1`);
  }
  return { result: result.join(""), steps };
}

function binarySubSteps(a, b) {
  const maxLen = Math.max(a.length, b.length);
  let sa = a.padStart(maxLen, "0");
  let sb = b.padStart(maxLen, "0");
  let borrow = 0;
  const result = [];
  const steps = [];
  for (let i = maxLen - 1; i >= 0; i--) {
    let bitA = Number(sa[i]) - borrow;
    const bitB = Number(sb[i]);
    if (bitA < bitB) {
      bitA += 2;
      borrow = 1;
      steps.push(`Borrow: ${sa[i]} - ${sb[i]} → ${bitA} - ${bitB} = ${bitA - bitB}`);
    } else {
      borrow = 0;
      steps.push(`${bitA} - ${bitB} = ${bitA - bitB}`);
    }
    result.unshift(String(bitA - bitB));
  }
  return { result: result.join(""), steps };
}

export function BinaryCalculatorSim() {
  const [a, setA] = useState("1011");
  const [b, setB] = useState("1101");
  const [op, setOp] = useState("add");

  const calc = useMemo(() => {
    if (!/^[01]+$/.test(a) || !/^[01]+$/.test(b)) return null;
    if (op === "add") return binaryAddSteps(a, b);
    const x = parseInt(a, 2);
    const y = parseInt(b, 2);
    if (x < y) return { result: null, steps: ["الطرح غير ممكن: A < B"] };
    return binarySubSteps(a, b);
  }, [a, b, op]);

  const dec =
    calc?.result != null ? parseInt(calc.result, 2) : null;

  return (
    <div className="space-y-4" dir="rtl">
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          className="lab-input font-mono"
          value={a}
          onChange={(e) => setA(e.target.value.replace(/[^01]/g, ""))}
          placeholder="A ثنائي"
          dir="ltr"
        />
        <select className="lab-select" value={op} onChange={(e) => setOp(e.target.value)}>
          <option value="add">جمع (+)</option>
          <option value="sub">طرح (−)</option>
        </select>
        <input
          className="lab-input font-mono"
          value={b}
          onChange={(e) => setB(e.target.value.replace(/[^01]/g, ""))}
          placeholder="B ثنائي"
          dir="ltr"
        />
      </div>
      {calc ? (
        <>
          <div className="lab-result">
            ثنائي: {calc.result ?? "—"} | عشري: {dec ?? "—"}
          </div>
          <ol className="lab-steps list-decimal space-y-1">
            {calc.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </>
      ) : null}
    </div>
  );
}
