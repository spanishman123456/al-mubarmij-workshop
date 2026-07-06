import { useState } from "react";

function fibSteps(n) {
  const steps = [];
  const seq = [];
  for (let i = 0; i < n; i++) {
    let val;
    if (i === 0) val = 0;
    else if (i === 1) val = 1;
    else val = seq[i - 1] + seq[i - 2];
    seq.push(val);
    steps.push({
      i,
      val,
      explain:
        i === 0
          ? "F(0) = 0 — الحد الأول"
          : i === 1
            ? "F(1) = 1 — الحد الثاني"
            : `F(${i}) = F(${i - 1}) + F(${i - 2}) = ${seq[i - 1]} + ${seq[i - 2]} = ${val}`,
    });
  }
  return { seq, steps };
}

const DRILLS = [
  { q: "ما الحد التالي؟ 0, 1, 1, 2, 3, 5, ?", a: "8", hint: "اجمع آخر حدين" },
  { q: "احسب F(6)", a: "8", hint: "0,1,1,2,3,5,8" },
  { q: "أي رقم خاطئ؟ 0, 1, 1, 2, 4, 5", a: "4", hint: "2+1=3 وليس 4" },
];

export function FibonacciSim() {
  const [n, setN] = useState(8);
  const [stepIdx, setStepIdx] = useState(-1);
  const [drillIdx, setDrillIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const { seq, steps } = fibSteps(Math.min(Math.max(n, 2), 15));
  const current = stepIdx >= 0 ? steps[stepIdx] : null;

  function checkDrill() {
    setAttempted(true);
    setShowSolution(true);
  }

  const correct = answer.trim() === DRILLS[drillIdx].a;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-xl bg-violet-50 p-4 text-sm text-violet-900">
        <p className="font-bold">متتالية فيبوناتشي</p>
        <p className="mt-1 font-mono" dir="ltr">
          F(n) = F(n-1) + F(n-2)
        </p>
        <p className="mt-2">كل حد يساوي مجموع الحدين السابقين — تبدأ بـ 0 و 1.</p>
      </div>

      <label className="block">
        <span className="lab-label">عدد الحدود (2–15)</span>
        <input
          type="range"
          min={2}
          max={15}
          value={n}
          onChange={(e) => {
            setN(Number(e.target.value));
            setStepIdx(-1);
          }}
          className="w-full"
        />
        <span className="text-sm font-bold text-slate-700">{n} حدود</span>
      </label>

      <div className="flex flex-wrap gap-2">
        {seq.map((v, i) => (
          <span
            key={i}
            className={`rounded-lg px-3 py-2 font-mono text-lg font-bold ${
              current?.i === i ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-800"
            }`}
          >
            {v}
          </span>
        ))}
      </div>

      {current ? (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-900">{current.explain}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button type="button" className="edu-btn edu-btn-primary" onClick={() => setStepIdx(0)}>
          تشغيل خطوة بخطوة
        </button>
        <button
          type="button"
          className="edu-btn edu-btn-outline"
          disabled={stepIdx <= 0}
          onClick={() => setStepIdx((s) => Math.max(0, s - 1))}
        >
          السابق
        </button>
        <button
          type="button"
          className="edu-btn edu-btn-outline"
          disabled={stepIdx >= steps.length - 1}
          onClick={() => setStepIdx((s) => Math.min(steps.length - 1, s + 1))}
        >
          التالي
        </button>
        <button type="button" className="edu-btn edu-btn-outline" onClick={() => setStepIdx(-1)}>
          إعادة
        </button>
      </div>

      <details className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer font-bold text-slate-800">كود Python</summary>
        <pre className="code-editor mt-3 text-xs" dir="ltr">{`n = ${n}
a, b = 0, 1
for i in range(n):
    print(a, end=" ")
    a, b = b, a + b`}</pre>
      </details>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="font-bold text-amber-900">تمرين: {DRILLS[drillIdx].q}</p>
        <input
          className="edu-input mt-3 max-w-xs"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setAttempted(false);
            setShowSolution(false);
          }}
          placeholder="إجابتك"
        />
        <div className="mt-3 flex gap-2">
          <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={checkDrill}>
            تحقق
          </button>
          {!attempted ? (
            <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={() => setShowSolution(true)}>
              تلميح
            </button>
          ) : null}
        </div>
        {showSolution && !attempted ? (
          <p className="mt-2 text-sm text-amber-800">تلميح: {DRILLS[drillIdx].hint}</p>
        ) : null}
        {attempted ? (
          <p className={`mt-2 text-sm font-bold ${correct ? "text-emerald-700" : "text-red-700"}`}>
            {correct ? "إجابة صحيحة!" : "حاول مجددًا — راجع التلميح أو الشرح في الدرس."}
          </p>
        ) : null}
        <button
          type="button"
          className="mt-3 text-xs text-violet-700 underline"
          onClick={() => {
            setDrillIdx((d) => (d + 1) % DRILLS.length);
            setAnswer("");
            setAttempted(false);
            setShowSolution(false);
          }}
        >
          تمرين آخر
        </button>
      </div>
    </div>
  );
}
