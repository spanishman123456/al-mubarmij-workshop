import { useMemo, useState } from "react";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function SearchSortSim() {
  const [arr, setArr] = useState([12, 5, 19, 3, 8, 14]);
  const [target, setTarget] = useState(8);
  const [algo, setAlgo] = useState("linear");
  const [log, setLog] = useState([]);
  const [busy, setBusy] = useState(false);
  const [highlight, setHighlight] = useState([]);

  const arrStr = useMemo(() => arr.join(", "), [arr]);

  async function runSearch() {
    setBusy(true);
    setLog([]);
    setHighlight([]);
    const steps = [];
    if (algo === "linear") {
      for (let i = 0; i < arr.length; i++) {
        setHighlight([i]);
        steps.push(`فحص الموضع ${i}: القيمة ${arr[i]}`);
        setLog([...steps]);
        await sleep(400);
        if (arr[i] === target) {
          steps.push(`✓ وُجدت ${target} في الموضع ${i}`);
          setLog([...steps]);
          setBusy(false);
          return;
        }
      }
      steps.push(`✗ لم يُعثر على ${target}`);
    } else {
      const sorted = [...arr].sort((a, b) => a - b);
      setArr(sorted);
      let lo = 0;
      let hi = sorted.length - 1;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        setHighlight([mid]);
        steps.push(`منتصف [${lo}..${hi}] = ${mid} → ${sorted[mid]}`);
        setLog([...steps]);
        await sleep(500);
        if (sorted[mid] === target) {
          steps.push(`✓ وُجدت في ${mid}`);
          setLog([...steps]);
          setBusy(false);
          return;
        }
        if (sorted[mid] < target) lo = mid + 1;
        else hi = mid - 1;
      }
      steps.push(`✗ لم يُعثر على ${target}`);
    }
    setLog([...steps]);
    setBusy(false);
  }

  async function runBubble() {
    setBusy(true);
    setLog([]);
    const a = [...arr];
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        setHighlight([j, j + 1]);
        setLog((prev) => [...prev, `مقارنة ${a[j]} و ${a[j + 1]}`]);
        await sleep(350);
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          setArr([...a]);
          setLog((prev) => [...prev, `تبديل → [${a.join(", ")}]`]);
        }
      }
    }
    setHighlight([]);
    setBusy(false);
  }

  return (
    <div className="space-y-4 font-ar text-right" dir="rtl">
      <p className="font-mono text-violet-200">[{arrStr}]</p>
      <div className="flex flex-wrap gap-2">
        {arr.map((v, i) => (
          <span
            key={i}
            className={`rounded-lg px-3 py-2 font-bold ${highlight.includes(i) ? "bg-pink-500 text-white" : "bg-white/10 text-slate-200"}`}
          >
            {v}
          </span>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <input type="number" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white" value={target} onChange={(e) => setTarget(Number(e.target.value))} />
        <select className="rounded-lg border border-white/10 bg-[#1a2038] px-3 py-2 text-white" value={algo} onChange={(e) => setAlgo(e.target.value)}>
          <option value="linear">بحث خطي</option>
          <option value="binary">بحث ثنائي</option>
        </select>
        <button type="button" disabled={busy} onClick={runSearch} className="rounded-lg bg-violet-600 px-4 py-2 font-bold text-white disabled:opacity-50">تشغيل البحث</button>
      </div>
      <button type="button" disabled={busy} onClick={runBubble} className="rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white disabled:opacity-50">فرز فقاعي خطوة بخطوة</button>
      <ul className="max-h-40 overflow-y-auto text-sm text-slate-400">
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
