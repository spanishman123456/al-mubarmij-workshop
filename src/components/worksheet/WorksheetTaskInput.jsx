import { QuizCardSheetQuestion } from "../quiz/QuizCardFlipQuestion.jsx";
import { gradeWorksheetPart, isStructuredTask } from "../../lib/worksheetGrading.js";
import { renderMixedDirectionText } from "../MixedDirectionText";
import { BilingualPrompt } from "../BilingualTextBlocks";

function PartFeedback({ result, part }) {
  if (!result || result.status === "unanswered") return null;
  if (result.status === "correct") {
    return <p className="mt-1 text-xs font-medium text-emerald-700">✓ إجابة صحيحة</p>;
  }
  const hint =
    part.feedback?.incorrect ||
    (typeof part.feedback === "string" ? part.feedback : null) ||
    part.explanationAr ||
    "راجع إجابتك وحاول مرة أخرى.";
  return <p className="mt-1 text-xs text-amber-800">{hint}</p>;
}

function McqOptions({ part, value, onChange, disabled, namePrefix }) {
  return (
    <div className="space-y-2">
      {(part.choices || []).map((c) => {
        const picked = String(value) === String(c.id);
        return (
          <label
            key={c.id}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
              picked ? "border-violet-500 bg-violet-50" : "border-slate-200 bg-white hover:border-violet-200"
            }`}
          >
            <input
              type="radio"
              name={`${namePrefix}-${part.id}`}
              checked={picked}
              onChange={() => onChange(c.id)}
              disabled={disabled}
              className="mt-1"
            />
            <span>{renderMixedDirectionText(c.textAr)}</span>
          </label>
        );
      })}
    </div>
  );
}

function TrueFalseButtons({ value, onChange, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {[
        { v: true, label: "صح" },
        { v: false, label: "خطأ" },
      ].map(({ v, label }) => (
        <button
          key={label}
          type="button"
          disabled={disabled}
          onClick={() => onChange(v)}
          className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
            value === v
              ? "border-violet-600 bg-violet-600 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-violet-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ShortInput({ part, value, onChange, disabled }) {
  const isNumeric = part.type === "numeric_answer";
  return (
    <input
      type="text"
      inputMode={isNumeric ? "numeric" : "text"}
      className="edu-input max-w-xs font-mono"
      dir="ltr"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={isNumeric ? "رقم" : "إجابة قصيرة"}
      data-testid={`ws-input-${part.id || "main"}`}
    />
  );
}

function renderPartInput(part, value, onChange, disabled, namePrefix) {
  if (part.type === "multiple_choice") {
    return <McqOptions part={part} value={value} onChange={onChange} disabled={disabled} namePrefix={namePrefix} />;
  }
  if (part.type === "true_false") {
    return <TrueFalseButtons value={value} onChange={onChange} disabled={disabled} />;
  }
  return <ShortInput part={part} value={value} onChange={onChange} disabled={disabled} />;
}

export function WorksheetTaskInput({
  task,
  value,
  onChange,
  disabled = false,
  checkedParts = {},
  onCheckPart,
  showTeacherMeta = false,
}) {
  if (!isStructuredTask(task)) {
    return (
      <label className="mt-4 block print:hidden">
        <span className="edu-label">ملاحظة اختيارية (لا تدخل في التقييم الآلي)</span>
        <textarea
          className="edu-input min-h-[80px]"
          value={typeof value === "string" ? value : value?.legacyFreeText ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="اختياري..."
          data-testid="ws-legacy-textarea"
        />
      </label>
    );
  }

  if (task.type === "binary_cards_sheet" || task.type === "binary-cards-sheet") {
    return (
      <div className="mt-4 print:hidden" data-testid="ws-binary-cards">
        <QuizCardSheetQuestion
          question={{
            cardValues: task.cardValues || [16, 8, 4, 2, 1],
            targets: task.targets || [],
            instructionAr: task.instructionAr,
          }}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    );
  }

  if (task.type === "multi_part") {
    const obj = typeof value === "object" && value ? value : {};
    return (
      <div className="mt-4 space-y-4 print:hidden">
        {(task.parts || []).map((part) => {
          const partResult = checkedParts[part.id];
          return (
            <div key={part.id} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="mb-2">
                <BilingualPrompt
                  promptAr={part.promptAr}
                  expression={part.expression}
                  values={part.values}
                  code={part.code}
                />
              </div>
              {renderPartInput(
                part,
                obj[part.id],
                (v) => onChange({ ...obj, [part.id]: v }),
                disabled,
                `ws-${task.n}`,
              )}
              {!disabled && onCheckPart ? (
                <button
                  type="button"
                  className="edu-btn edu-btn-outline mt-2 text-xs"
                  onClick={() => onCheckPart(part.id)}
                  data-testid={`ws-check-${part.id}`}
                >
                  تحقق
                </button>
              ) : null}
              <PartFeedback result={partResult} part={part} />
              {showTeacherMeta && part.correctAnswer != null ? (
                <p className="mt-2 text-xs text-emerald-700">الإجابة: {renderMixedDirectionText(String(part.correctAnswer))}</p>
              ) : null}
              {showTeacherMeta && part.correct != null && part.type === "true_false" ? (
                <p className="mt-2 text-xs text-emerald-700">الإجابة: {part.correct ? "صح" : "خطأ"}</p>
              ) : null}
              {showTeacherMeta && part.acceptedAnswers ? (
                <p className="mt-2 text-xs text-emerald-700">مقبول: {renderMixedDirectionText(part.acceptedAnswers.join("، "))}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  const part = task;
  const partResult = checkedParts.main;
  return (
    <div className="mt-4 print:hidden">
      {renderPartInput(part, value, onChange, disabled, `ws-${task.n}`)}
      {!disabled && onCheckPart ? (
        <button
          type="button"
          className="edu-btn edu-btn-outline mt-2 text-xs"
          onClick={() => onCheckPart("main")}
          data-testid={`ws-check-main`}
        >
          تحقق
        </button>
      ) : null}
      <PartFeedback result={partResult} part={part} />
    </div>
  );
}

export function getPartGrade(task, partId, answer) {
  if (task.type === "multi_part") {
    const part = task.parts?.find((p) => p.id === partId);
    if (!part) return null;
    const obj = typeof answer === "object" && answer ? answer : {};
    return gradeWorksheetPart(part, obj[partId]);
  }
  if (partId === "main") return gradeWorksheetPart(task, answer);
  return null;
}
