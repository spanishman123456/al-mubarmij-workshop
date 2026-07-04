import { useState } from "react";
import { simulateRange, simulateForLoop } from "../../lib/pythonLabs/loopsAndLists";
import { recordLessonAttemptApi } from "../../lib/platformApi";

export function ForRangeLab({ lessonId, userId }) {
  const [stop, setStop] = useState("5");
  const [out, setOut] = useState("");

  function run() {
    const r = simulateForLoop(1, 0, Number(stop), 1);
    if (!r.ok) return;
    const trace = r.trace.map((t) => t.i).join(", ");
    setOut(trace);
    if (userId) recordLessonAttemptApi(userId, { lessonId, exerciseId: "for-range", answer: trace, correct: true });
  }

  return (
    <div className="rounded-xl border border-violet-200 p-4" dir="rtl">
      <label className="text-sm">
        range(0,{" "}
        <input className="w-12 rounded border px-1 font-mono" value={stop} onChange={(e) => setStop(e.target.value)} dir="ltr" />)
      </label>
      <button type="button" className="edu-btn edu-btn-primary mr-2 text-sm" onClick={run}>
        تتبع
      </button>
      {out ? (
        <p className="mt-2 font-mono text-sm" dir="ltr">
          i: {out}
        </p>
      ) : null}
    </div>
  );
}

export function WhileLoopLab({ lessonId, userId }) {
  const [start, setStart] = useState("5");
  const [trace, setTrace] = useState("");

  function run() {
    const n = Number(start);
    const t = [];
    let x = n;
    while (x > 0) {
      t.push(x);
      x -= 1;
    }
    setTrace(t.join(", "));
    if (userId) recordLessonAttemptApi(userId, { lessonId, exerciseId: "while-lab", answer: t.join(","), correct: true });
  }

  return (
    <div className="rounded-xl border border-amber-200 p-4" dir="rtl">
      <input className="w-12 rounded border px-1 font-mono" value={start} onChange={(e) => setStart(e.target.value)} dir="ltr" />
      <button type="button" className="edu-btn edu-btn-primary mr-2 text-sm" onClick={run}>
        countdown while
      </button>
      {trace ? (
        <p className="mt-2 font-mono text-sm" dir="ltr">
          {trace}
        </p>
      ) : null}
    </div>
  );
}

export { simulateRange };
