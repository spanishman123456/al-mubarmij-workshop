import { useState } from "react";
import { recordLessonAttemptApi } from "../../lib/platformApi";

function runSimpleIf(code) {
  const lines = code.split("\n").map((l) => l.trim()).filter(Boolean);
  let score = null;
  let d1 = null;
  let d2 = null;
  let a = null;
  let b = null;
  const outputs = [];
  const errors = [];

  for (const line of lines) {
    if (line.startsWith("score")) {
      const m = line.match(/score\s*=\s*(\d+)/);
      if (m) score = Number(m[1]);
    }
    if (line.match(/d1,\s*d2/)) {
      const m = line.match(/=\s*(\d+)\s*,\s*(\d+)/);
      if (m) {
        d1 = Number(m[1]);
        d2 = Number(m[2]);
      }
    }
    if (line.match(/^a,\s*b/)) {
      const m = line.match(/=\s*(\d+)\s*,\s*(\d+)/);
      if (m) {
        a = Number(m[1]);
        b = Number(m[2]);
      }
    }
    if (line.includes("=") && line.includes("if") && !line.includes("==")) {
      errors.push("SyntaxError: استخدم == للمقارنة لا =");
    }
    if (line.startsWith("if") && line.includes(":") === false) {
      errors.push("SyntaxError: ناقص : بعد if");
    }
  }

  if (errors.length) return { outputs, errors };

  if (score != null) {
    outputs.push(score >= 50 ? "ناجح" : "راسب");
  }
  if (d1 != null && d2 != null) {
    if (d1 > d2) outputs.push("1");
    else if (d1 < d2) outputs.push("2");
    else outputs.push("تعادل");
  }
  if (a != null && b != null) {
    outputs.push(String(a > b ? a : b));
  }

  if (!outputs.length && lines.some((l) => l.includes("print"))) {
    errors.push("لم أتعرف على المتغيرات — جرّب score= أو d1,d2= أو a,b=");
  }

  return { outputs, errors };
}

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
        مختبر if — محاكاة مبسّطة (score, d1/d2, a/b)
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
