import { useState } from "react";
import { runSimpleIf } from "../../lib/pythonLabs/ifInterpreter";
import { recordLessonAttemptApi } from "../../lib/platformApi";

export function IfStatementLab({ lessonId, userId, initialCode = "" }) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState(null);

  function run() {
    const res = runSimpleIf(code);
    setResult(res);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "if-lab-run",
        answer: code.slice(0, 500),
        correct: res.errors.length === 0 && res.outputs.length > 0,
        errorType: res.errors[0] || null,
      });
    }
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-slate-900 p-4" dir="ltr">
      <p className="mb-2 text-right text-sm font-semibold text-violet-200" dir="rtl">
        مختبر if — score, d1/d2, a/b, g, n
      </p>
      <textarea
        className="min-h-[160px] w-full rounded-lg bg-slate-950 p-3 font-mono text-sm text-emerald-300"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
      />
      <div className="mt-2 flex gap-2" dir="rtl">
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={run}>
          تشغيل
        </button>
      </div>
      {result ? (
        <div className="mt-3 rounded-lg bg-slate-800 p-3 text-sm text-white" dir="rtl">
          {result.errors.map((e) => (
            <p key={e} className="text-red-300">
              {e}
            </p>
          ))}
          {result.outputs.map((o) => (
            <p key={o} className="font-mono text-emerald-300" dir="ltr">
              {">"} {o}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { runSimpleIf };
