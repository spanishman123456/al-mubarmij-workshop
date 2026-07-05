import { MatchQuestion } from "./MatchQuestion";
import { OrderQuestion } from "./OrderQuestion";

export function questionTypeLabel(type) {
  if (type === "fill") return "إكمال";
  if (type === "truefalse") return "صح / خطأ";
  if (type === "essay") return "مقالي";
  if (type === "code") return "برمجي";
  if (type === "match") return "مطابقة";
  if (type === "order") return "ترتيب";
  return "اختيار";
}

export function gradingBadge(status) {
  if (status === "correct") return { text: "صحيحة", cls: "text-emerald-300" };
  if (status === "incorrect") return { text: "غير صحيحة", cls: "text-rose-300" };
  if (status === "pending_teacher_review") return { text: "بانتظار مراجعة المعلم", cls: "text-violet-300" };
  return { text: "لم تُجَب", cls: "text-slate-400" };
}

export function QuizQuestionRenderer({ question, value, onChange, disabled, showReview }) {
  const qType = question.type || "mcq";

  return (
    <div dir="rtl">
      {question.instructionAr && !showReview ? (
        <p className="mb-3 rounded-lg border border-violet-400/30 bg-violet-950/30 px-3 py-2 text-sm text-violet-100">
          {question.instructionAr}
        </p>
      ) : null}

      {qType === "fill" ? (
        <input
          type="text"
          className="edu-input w-full bg-white/10 text-white placeholder:text-slate-500"
          placeholder="اكتب إجابتك هنا"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          dir="auto"
        />
      ) : qType === "essay" ? (
        <textarea
          className="edu-input min-h-[160px] w-full resize-y bg-white/10 text-sm text-white placeholder:text-slate-500"
          placeholder="اكتب إجابتك داخل المنصة — استخدم نقاطًا مرقمة أو جدولًا نصيًا عند الحاجة."
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          dir="rtl"
        />
      ) : qType === "code" ? (
        <textarea
          className="edu-input min-h-[180px] w-full resize-y bg-black/40 font-mono text-sm text-emerald-100 placeholder:text-slate-500"
          placeholder="اكتب الكود هنا..."
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          dir="ltr"
          spellCheck={false}
        />
      ) : qType === "match" ? (
        <MatchQuestion question={question} value={value} onChange={onChange} disabled={disabled} />
      ) : qType === "order" ? (
        <OrderQuestion question={question} value={value} onChange={onChange} disabled={disabled} />
      ) : (
        <div className="space-y-2">
          {(question.optionsAr || []).map((opt, i) => {
            const picked = Number(value) === i;
            return (
              <label
                key={i}
                className={`quiz-option flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-right text-sm transition ${
                  picked
                    ? "border-emerald-500/60 bg-emerald-950/40"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={picked}
                  onChange={() => onChange(i)}
                  disabled={disabled}
                  className="mt-1"
                />
                <span className="flex-1 leading-relaxed">{opt}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
