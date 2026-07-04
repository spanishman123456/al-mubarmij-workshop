import { useCallback, useEffect, useState } from "react";
import { runSimpleIf } from "../../lib/pythonLabs/ifInterpreter";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";

const PRESETS = {
  break: "for i in range(1, 6):\n    if i == 3:\n        break\n    print(i)",
  continue: "for i in range(5):\n    if i == 2:\n        continue\n    print(i)",
  pass: "for i in range(3):\n    if i == 1:\n        pass\n    print(i)",
  else: "for i in range(3):\n    print(i)\nelse:\n    print('done')",
};

export function LoopControlLab({ lessonId, userId, preset = "continue" }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "loop-control",
  });

  const [mode, setMode] = useState(preset);
  const [code, setCode] = useState(PRESETS[preset] || PRESETS.continue);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.mode) setMode(progress.mode);
    if (progress.code) setCode(progress.code);
  }, [restored, progress]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { mode, code, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [mode, code, persist, markComplete],
  );

  function applyPreset(key) {
    setMode(key);
    setCode(PRESETS[key]);
    save({ mode: key, code: PRESETS[key] });
  }

  function run() {
    const res = runSimpleIf(code);
    setResult(res);
    const outputStr = res.outputs.join(",");
    const expected = {
      break: "1,2",
      continue: "0,1,3,4",
      pass: "0,1,2",
      else: "0,1,2,done",
    }[mode];
    const ok = res.errors.length === 0 && outputStr === expected;
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `loop-${mode}`,
        answer: outputStr,
        correct: ok,
      });
    }
    save({ lastOutput: outputStr, lastOk: ok }, ok);
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-slate-900 p-4" dir="rtl">
      <p className="font-bold text-violet-200">break · continue · pass · else مع الحلقات</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {Object.keys(PRESETS).map((k) => (
          <button
            key={k}
            type="button"
            className={`edu-btn text-xs ${mode === k ? "edu-btn-primary" : ""}`}
            onClick={() => applyPreset(k)}
          >
            {k}
          </button>
        ))}
      </div>
      <textarea
        className="mt-3 min-h-[140px] w-full rounded-lg bg-slate-950 p-3 font-mono text-sm text-emerald-300"
        dir="ltr"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          save({ code: e.target.value });
        }}
        spellCheck={false}
      />
      <button type="button" className="edu-btn edu-btn-primary mt-2 text-sm" onClick={run}>
        تشغيل وتتبّع
      </button>
      {result ? (
        <div className="mt-3 rounded-lg bg-slate-800 p-3 text-sm">
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
          {progress?.lastOk != null ? (
            <p className="mt-2 text-white">{progress.lastOk ? "✓ مطابق للمثال" : "✗ راجع مسار التنفيذ"}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
