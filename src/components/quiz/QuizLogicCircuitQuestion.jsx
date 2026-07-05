import { LogicCircuitBuilder } from "../sims/LogicCircuitBuilder.jsx";

export function QuizLogicCircuitQuestion({ question, value, onChange, disabled }) {
  return (
    <div className="space-y-2" dir="rtl" data-testid="quiz-logic-circuit">
      {question.instructionAr ? (
        <p className="rounded-lg bg-violet-950/40 px-3 py-2 text-sm text-violet-100">{question.instructionAr}</p>
      ) : (
        <p className="text-sm text-slate-300">
          أضف البوابة المناسبة ووصّل المدخلات بالمخرج — جرّب A/B = 0/1 ولاحظ المصباح.
        </p>
      )}
      {question.expectedOutputs?.length ? (
        <p className="text-xs text-cyan-200/90">
          المطلوب: جدول مخرجات صحيح لكل تركيبات المدخلات (يُقيَّم بعد الإرسال).
        </p>
      ) : null}
      <LogicCircuitBuilder
        key={question.id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        quizMode
        allowedGates={question.allowedGates}
        circuitPreset={question.circuitPreset}
      />
    </div>
  );
}
