import { useCallback, useEffect, useRef, useState } from "react";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function SearchSortSim() {
  const [arr, setArr] = useState([12, 5, 19, 3, 8, 14]);
  const [target, setTarget] = useState(8);
  const [mode, setMode] = useState("linear");
  const [log, setLog] = useState([]);
  const [highlight, setHighlight] = useState([]);
  const [busy, setBusy] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);
  const stepsRef = useRef([]);
  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = true;
    setBusy(false);
    setLog([]);
    setHighlight([]);
    setStepIndex(-1);
    stepsRef.current = [];
    setArr([12, 5, 19, 3, 8, 14]);
  }, []);

  async function runLinear() {
    const steps = [];
    for (let i = 0; i < arr.length; i++) {
      steps.push({ type: "highlight", indices: [i], msg: `فحص الموضع ${i}: القيمة ${arr[i]}` });
      if (arr[i] === target) {
        steps.push({ type: "done", indices: [i], msg: `✓ وُجدت ${target} في الموضع ${i}` });
        return steps;
      }
    }
    steps.push({ type: "done", indices: [], msg: `✗ لم يُعثر على ${target}` });
    return steps;
  }

  async function buildBinarySteps() {
    const sorted = [...arr].sort((a, b) => a - b);
    const steps = [{ type: "sort", arr: sorted, msg: `ترتيب المصفوفة: [${sorted.join(", ")}]` }];
    let lo = 0;
    let hi = sorted.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      steps.push({
        type: "highlight",
        indices: [mid],
        arr: sorted,
        msg: `منتصف [${lo}..${hi}] = ${mid} → ${sorted[mid]}`,
      });
      if (sorted[mid] === target) {
        steps.push({ type: "done", indices: [mid], arr: sorted, msg: `✓ وُجدت في ${mid}` });
        return steps;
      }
      if (sorted[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    steps.push({ type: "done", indices: [], arr: sorted, msg: `✗ لم يُعثر على ${target}` });
    return steps;
  }

  async function buildBubbleSteps() {
    const a = [...arr];
    const steps = [];
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        steps.push({ type: "highlight", indices: [j, j + 1], arr: [...a], msg: `مقارنة ${a[j]} و ${a[j + 1]}` });
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          steps.push({ type: "swap", indices: [j, j + 1], arr: [...a], msg: `تبديل → [${a.join(", ")}]` });
        }
      }
    }
    steps.push({ type: "done", indices: [], arr: [...a], msg: "اكتمل الفرز الفقاعي" });
    return steps;
  }

  async function buildSelectionSteps() {
    const a = [...arr];
    const steps = [];
    for (let i = 0; i < a.length - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < a.length; j++) {
        steps.push({
          type: "highlight",
          indices: [minIdx, j],
          arr: [...a],
          msg: `البحث عن الأصغر من الموضع ${i}: مقارنة ${a[minIdx]} و ${a[j]}`,
        });
        if (a[j] < a[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
        steps.push({ type: "swap", indices: [i, minIdx], arr: [...a], msg: `تبديل → [${a.join(", ")}]` });
      }
    }
    steps.push({ type: "done", indices: [], arr: [...a], msg: "اكتمل فرز الاختيار" });
    return steps;
  }

  async function prepareSteps() {
    if (mode === "linear") return runLinear();
    if (mode === "binary") return buildBinarySteps();
    if (mode === "bubble") return buildBubbleSteps();
    return buildSelectionSteps();
  }

  async function playAll() {
    abortRef.current = false;
    setBusy(true);
    setLog([]);
    setStepIndex(0);
    const steps = await prepareSteps();
    stepsRef.current = steps;
    for (let i = 0; i < steps.length; i++) {
      if (abortRef.current) break;
      const s = steps[i];
      setStepIndex(i);
      if (s.arr) setArr(s.arr);
      setHighlight(s.indices || []);
      setLog((prev) => [...prev, s.msg]);
      await sleep(600);
    }
    setBusy(false);
  }

  function stepForward() {
    const steps = stepsRef.current;
    if (!steps.length) {
      prepareSteps().then((s) => {
        stepsRef.current = s;
        setStepIndex(0);
        applyStep(s[0], 0);
      });
      return;
    }
    const next = Math.min(stepIndex + 1, steps.length - 1);
    applyStep(steps[next], next);
  }

  function stepBack() {
    const steps = stepsRef.current;
    if (!steps.length || stepIndex <= 0) return;
    const prev = stepIndex - 1;
    applyStep(steps[prev], prev);
  }

  function applyStep(s, idx) {
    setStepIndex(idx);
    if (s.arr) setArr(s.arr);
    setHighlight(s.indices || []);
    setLog(stepsRef.current.slice(0, idx + 1).map((x) => x.msg));
  }

  useEffect(() => () => {
    abortRef.current = true;
  }, []);

  const displayArr = arr;

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap gap-2">
        {displayArr.map((v, i) => (
          <span
            key={`${i}-${v}`}
            className={`rounded-lg px-4 py-2 font-bold transition-all ${
              highlight.includes(i)
                ? "scale-110 bg-pink-500 text-white shadow-lg"
                : "bg-slate-800 text-slate-200"
            }`}
          >
            {v}
          </span>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="lab-hint">هدف البحث</span>
          <input
            type="number"
            className="lab-input mt-1"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          />
        </label>
        <label className="block text-sm">
          <span className="lab-hint">الخوارزمية</span>
          <select className="lab-select mt-1 w-full" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="linear">بحث خطي</option>
            <option value="binary">بحث ثنائي</option>
            <option value="bubble">فرز فقاعي</option>
            <option value="selection">فرز اختياري</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={playAll} className="edu-btn edu-btn-primary text-sm">
          ▶ تشغيل تلقائي
        </button>
        <button type="button" onClick={stepBack} className="edu-btn edu-btn-outline text-sm">
          ◀ السابق
        </button>
        <button type="button" onClick={stepForward} className="edu-btn edu-btn-outline text-sm">
          التالي ▶
        </button>
        <button type="button" onClick={reset} className="edu-btn edu-btn-ghost text-sm">
          إعادة
        </button>
      </div>

      <div className="lab-steps max-h-48">
        {log.length === 0 ? (
          <p className="text-slate-500">اضغط تشغيل أو التالي لبدء المحاكاة</p>
        ) : (
          <ol className="list-decimal space-y-1">
            {log.map((line, i) => (
              <li key={i} className={i === log.length - 1 ? "text-cyan-300" : ""}>
                {line}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
