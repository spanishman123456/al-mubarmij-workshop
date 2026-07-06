import { MIN_ATTEMPTS_BEFORE_SOLUTION } from "../../lib/stepLearningEngine.js";

/**
 * @param {{
 *   plan: import("../../data/stepLearningPlans.js").StepPlan | null,
 *   stepIndex: number,
 *   hintLevel: number,
 *   checkResult: { ok: boolean, messageAr: string, fixHintAr?: string } | null,
 *   checkAttempts: number,
 *   solutionRevealed: boolean,
 *   onHint: () => void,
 *   onCheck: () => void,
 *   onRevealSolution: () => void,
 *   onClearCheck: () => void,
 *   allowRevealSolution?: boolean,
 * }} props
 */
export function StepLearningPanel({
  plan,
  stepIndex,
  hintLevel,
  checkResult,
  checkAttempts,
  solutionRevealed,
  onHint,
  onCheck,
  onRevealSolution,
  onClearCheck,
  allowRevealSolution = false,
}) {
  if (!plan) return null;

  const step = plan.steps[stepIndex];
  const total = plan.steps.length;
  const progress = Math.round(((stepIndex + (checkResult?.ok ? 1 : 0)) / total) * 100);
  const hintsShown = step?.hints?.slice(0, hintLevel) ?? [];
  const canRevealSolution = allowRevealSolution && (checkAttempts >= MIN_ATTEMPTS_BEFORE_SOLUTION || solutionRevealed);

  return (
    <div className="step-learning-panel mt-4 space-y-4 rounded-2xl border border-violet-500/35 bg-violet-950/30 p-4" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-violet-200">تعلّم خطوة بخطوة</h3>
        <span className="rounded-full bg-violet-600/40 px-3 py-1 text-xs font-bold text-violet-100">
          الخطوة {stepIndex + 1} من {total}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="progress-bar-fill h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-500"
          style={{ width: `${Math.max(progress, 8)}%` }}
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-black/25 p-3 text-sm">
        <p className="font-bold text-emerald-300">💡 فكرة المشروع</p>
        <p className="mt-1 text-slate-200">{plan.ideaAr}</p>
        <p className="mt-2 font-bold text-cyan-300">أوامر ستتعلمها</p>
        <p className="mt-1 text-slate-300" dir="ltr">
          {plan.commandsAr.join(" · ")}
        </p>
        <p className="mt-2 font-bold text-amber-300">المخرج المتوقع</p>
        <p className="mt-1 text-slate-300">{plan.expectedOutputAr}</p>
      </div>

      {step ? (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-3">
          <p className="font-bold text-emerald-200">{step.titleAr}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{step.instructionAr}</p>
          {step.commandsLearned?.length ? (
            <p className="mt-2 text-xs text-slate-400">
              أوامر هذه الخطوة:{" "}
              <span dir="ltr" className="text-emerald-300">
                {step.commandsLearned.join(", ")}
              </span>
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-sm font-bold text-emerald-300">🎉 أكملت جميع الخطوات! يمكنك تشغيل المشروع الآن.</p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onHint}
          disabled={!step || hintLevel >= (step?.hints?.length ?? 0)}
          className="edu-btn press-scale rounded-xl border border-amber-500/40 bg-amber-950/30 px-4 py-2 text-sm font-bold text-amber-200 hover:bg-amber-900/40 disabled:opacity-40"
        >
          💡 عرض تلميح ({hintLevel}/{step?.hints?.length ?? 0})
        </button>
        <button
          type="button"
          onClick={onCheck}
          disabled={!step}
          className="edu-btn press-scale rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-2 text-sm font-bold text-emerald-200 hover:bg-emerald-900/40 disabled:opacity-40"
        >
          ✓ تحقق من الحل
        </button>
        {canRevealSolution ? (
          <button
            type="button"
            onClick={onRevealSolution}
            className="edu-btn press-scale rounded-xl border border-rose-500/40 px-4 py-2 text-sm text-rose-200 hover:bg-rose-950/30"
          >
            {solutionRevealed ? "الحل ظاهر" : "عرض الحل الكامل"}
          </button>
        ) : allowRevealSolution ? (
          <span className="self-center text-xs text-slate-500">
            الحل الكامل بعد {MIN_ATTEMPTS_BEFORE_SOLUTION - checkAttempts} محاولات أخرى
          </span>
        ) : (
          <span className="self-center text-xs text-slate-500">راجع التلميحات والشرح — الحل لا يُكشف تلقائيًا.</span>
        )}
      </div>

      {hintsShown.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {hintsShown.map((h, i) => (
            <li
              key={i}
              className="rounded-lg border border-amber-500/20 bg-amber-950/20 px-3 py-2 text-amber-100"
            >
              <span className="font-bold text-amber-300">تلميح {i + 1}: </span>
              {h}
            </li>
          ))}
        </ul>
      ) : null}

      {checkResult ? (
        <div
          className={`rounded-xl border p-3 text-sm ${
            checkResult.ok
              ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-100"
              : "border-rose-500/40 bg-rose-950/30 text-rose-100"
          }`}
        >
          <p className="font-bold">{checkResult.ok ? "✓ صحيح!" : "✗ يحتاج تعديلاً"}</p>
          <p className="mt-1">{checkResult.messageAr}</p>
          {!checkResult.ok && checkResult.fixHintAr ? (
            <p className="mt-2 text-xs text-amber-200">💡 {checkResult.fixHintAr}</p>
          ) : null}
          <button type="button" onClick={onClearCheck} className="mt-2 text-xs text-slate-400 underline">
            إخفاء الرسالة
          </button>
        </div>
      ) : null}

      {solutionRevealed ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-200">
          ⚠️ يُفضّل المحاولة بنفسك أولاً. الحل الكامل ظاهر في المحرر — استخدمه للتعلّم لا للنسخ فقط.
        </div>
      ) : null}
    </div>
  );
}
