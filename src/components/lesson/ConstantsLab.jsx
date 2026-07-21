import { useState } from "react";
import { runSimpleIf } from "../../lib/pythonLabs/ifInterpreter";
import { recordLessonAttemptApi } from "../../lib/platformApi";

/**
 * Interactive lab for constants lesson — UPPER_CASE naming and constant usage.
 * Uses the same lightweight interpreter as other day-3 labs (not if-specific UI).
 */
export function ConstantsLab({ lessonId, userId, initialCode = "" }) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState(null);

  function run() {
    const res = runSimpleIf(code);
    setResult(res);
    const ok = res.errors.length === 0 && res.outputs.length > 0;
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "constants-lab-run",
        answer: code.slice(0, 500),
        correct: ok,
        errorType: res.errors[0] || null,
      });
    }
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4" dir="ltr">
      <p className="mb-2 text-right text-sm font-semibold text-amber-900" dir="rtl">
        مختبر الثوابت — استخدم أسماء UPPER_CASE (مثل MAX_SCORE، PI) ثم شغّل الكود
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
        <div className="mt-3 rounded-lg bg-white p-3 text-sm text-slate-800" dir="rtl">
          {result.errors.map((e) => (
            <p key={e} className="text-red-600">
              {e}
            </p>
          ))}
          {result.outputs.map((o) => (
            <p key={o} className="font-mono text-emerald-700" dir="ltr">
              {">"} {o}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
