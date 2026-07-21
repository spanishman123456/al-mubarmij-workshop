import { MatchQuestion } from "./MatchQuestion";
import { OrderQuestion } from "./OrderQuestion";
import { QuizTruthTableQuestion } from "./QuizTruthTableQuestion";
import { QuizCardFlipQuestion, QuizCardSheetQuestion } from "./QuizCardFlipQuestion";
import { QuizCodeEditorQuestion } from "./QuizCodeEditorQuestion";
import { QuizFlowchartBuilderQuestion } from "./QuizFlowchartBuilderQuestion";
import { QuizLogicCircuitQuestion } from "./QuizLogicCircuitQuestion";
import { renderMixedDirectionText } from "../MixedDirectionText";
import { BilingualPrompt, TechnicalValue } from "../BilingualTextBlocks";

const TECHNICAL_ANSWER_TYPES = new Set(["fill", "code", "code-editor", "truth-table"]);

export function AssessmentPrompt({ question, className = "" }) {
  return (
    <BilingualPrompt
      promptAr={question.questionAr || question.promptAr || question.instructionAr}
      expression={question.expression}
      values={question.values}
      code={question.codeSnippetAr || question.code}
      className={className}
    />
  );
}

export function AssessmentAnswer({ question, children, className = "" }) {
  const qType = question?.type || "mcq";
  if (TECHNICAL_ANSWER_TYPES.has(qType) || question?.answerDirection === "ltr") {
    return (
      <TechnicalValue
        className={`whitespace-pre-wrap ${className}`.trim()}
        data-technical-kind={qType === "code" || qType === "code-editor" ? "code" : undefined}
      >
        {children}
      </TechnicalValue>
    );
  }
  return <span className={className}>{renderMixedDirectionText(children)}</span>;
}

export function questionTypeLabel(type) {
  if (type === "fill") return "إكمال";
  if (type === "truefalse") return "صح / خطأ";
  if (type === "essay") return "مقالي";
  if (type === "code" || type === "code-editor") return "برمجي";
  if (type === "match") return "مطابقة";
  if (type === "order") return "ترتيب";
  if (type === "truth-table") return "جدول حقيقة";
  if (type === "binary-cards") return "بطاقات";
  if (type === "binary-cards-sheet") return "ورقة بطاقات";
  if (type === "flowchart") return "مخطط تدفق";
  if (type === "logic-circuit") return "دارة منطقية";
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
        <div className="mb-3 rounded-lg border border-violet-400/30 bg-violet-950/30 px-3 py-2 text-sm text-violet-100">
          <BilingualPrompt
            promptAr={question.instructionAr}
            expression={question.expression}
            values={question.values}
            code={question.code}
          />
        </div>
      ) : null}

      {qType === "fill" ? (
        <input
          type="text"
          className="edu-input w-full bg-white/10 text-white placeholder:text-slate-500"
          placeholder="اكتب إجابتك هنا"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          dir={question.answerDirection === "rtl" ? "rtl" : "ltr"}
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
      ) : qType === "code" || qType === "code-editor" ? (
        <QuizCodeEditorQuestion question={question} value={value} onChange={onChange} disabled={disabled} />
      ) : qType === "truth-table" ? (
        <QuizTruthTableQuestion question={question} value={value} onChange={onChange} disabled={disabled} />
      ) : qType === "binary-cards" ? (
        <QuizCardFlipQuestion question={question} value={value} onChange={onChange} disabled={disabled} />
      ) : qType === "binary-cards-sheet" ? (
        <QuizCardSheetQuestion question={question} value={value} onChange={onChange} disabled={disabled} />
      ) : qType === "flowchart" ? (
        <QuizFlowchartBuilderQuestion question={question} value={value} onChange={onChange} disabled={disabled} />
      ) : qType === "logic-circuit" ? (
        <QuizLogicCircuitQuestion question={question} value={value} onChange={onChange} disabled={disabled} />
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
                data-testid={`quiz-mcq-${i}`}
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
                <span className="flex-1 leading-relaxed">{renderMixedDirectionText(opt)}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
