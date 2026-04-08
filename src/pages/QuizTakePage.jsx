import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getQuizById } from "../data/quizzes";

function computeResult(quiz, answers) {
  let correct = 0;
  for (const q of quiz.questions) {
    if (answers[q.id] === q.correctIndex) correct += 1;
  }
  const total = quiz.questions.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  const passed = percent >= quiz.passPercent;
  return { correct, total, percent, passed };
}

export default function QuizTakePage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const quiz = useMemo(() => getQuizById(quizId ?? ""), [quizId]);

  const [answers, setAnswers] = useState(() => ({}));
  const [submitted, setSubmitted] = useState(false);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20 pt-24 text-center font-ar">
        <p className="text-slate-600">الاختبار غير موجود.</p>
        <Link to="/quizzes" className="mt-4 inline-block text-violet-700 underline">
          العودة لقائمة الاختبارات
        </Link>
      </div>
    );
  }

  const result = submitted ? computeResult(quiz, answers) : null;

  function setAnswer(questionId, optionIndex) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function handleSubmit() {
    const unanswered = quiz.questions.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      const ok = window.confirm(
        `لم تُجِب عن ${unanswered.length} سؤالاً. هل تريد الإرسال على أي حال؟`
      );
      if (!ok) return;
    }
    setSubmitted(true);
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-24 pt-24 font-ar text-white">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/quizzes")}
            className="text-sm text-slate-400 hover:text-white"
          >
            ← العودة للاختبارات
          </button>
        </div>

        <header className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-bold">{quiz.titleAr}</h1>
          <p className="mt-2 text-sm text-slate-400">{quiz.descriptionAr}</p>
          <p className="mt-3 text-xs text-emerald-300/90">
            معيار النجاح: {quiz.passPercent}٪ · عدد الأسئلة: {quiz.questions.length}
          </p>
        </header>

        {!submitted && (
          <div className="space-y-6">
            {quiz.questions.map((q, idx) => (
              <fieldset
                key={q.id}
                className="rounded-2xl border border-white/10 bg-black/30 p-5"
                dir="rtl"
              >
                <legend className="px-2 text-lg font-bold text-white">
                  السؤال {idx + 1} من {quiz.questions.length}
                </legend>
                <p className="mb-4 text-right leading-relaxed text-slate-200">{q.questionAr}</p>
                <div className="space-y-2" dir="rtl">
                  {q.optionsAr.map((opt, i) => {
                    const id = `${q.id}-opt-${i}`;
                    const picked = answers[q.id] === i;
                    return (
                      <label
                        key={id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-right text-sm transition ${
                          picked
                            ? "border-emerald-500/60 bg-emerald-950/40"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={picked}
                          onChange={() => setAnswer(q.id, i)}
                          className="mt-1"
                        />
                        <span className="flex-1 leading-relaxed">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 text-lg font-bold text-white shadow-lg hover:brightness-110"
            >
              إنهاء الإرسال وحساب النتيجة
            </button>
          </div>
        )}

        {submitted && result && (
          <div className="space-y-6">
            <div
              className={`rounded-2xl border-2 p-8 text-center ${
                result.passed
                  ? "border-emerald-500/50 bg-emerald-950/40"
                  : "border-amber-500/50 bg-amber-950/30"
              }`}
            >
              <p className="text-2xl font-bold">
                {result.passed ? "✓ ناجح — أحسنت!" : "لم يتحقق معيار النجاح بعد"}
              </p>
              <p className="mt-3 text-4xl font-black text-white">{result.percent}٪</p>
              <p className="mt-2 text-slate-300">
                صحيح: {result.correct} من {result.total} · مطلوب للنجاح: {quiz.passPercent}٪ على الأقل
              </p>
              {!result.passed && (
                <p className="mt-4 text-sm text-amber-200/90">
                  راجع الأسئلة أدناه، ثم عد للمسار الدراسي أو أوراق العمل، وحاول مرة أخرى عندما تكون جاهزاً.
                </p>
              )}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold hover:bg-white/10"
                >
                  إعادة الاختبار
                </button>
                <Link
                  to="/quizzes"
                  className="rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white hover:bg-violet-500"
                >
                  قائمة الاختبارات
                </Link>
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-300">مراجعة الأسئلة</h2>
            <ul className="space-y-4">
              {quiz.questions.map((q, idx) => {
                const user = answers[q.id];
                const ok = user === q.correctIndex;
                return (
                  <li
                    key={q.id}
                    className={`rounded-2xl border p-5 ${
                      ok ? "border-emerald-500/30 bg-emerald-950/20" : "border-rose-500/30 bg-rose-950/20"
                    }`}
                    dir="rtl"
                  >
                    <p className="font-bold text-white">
                      {idx + 1}. {ok ? "✓" : "✗"} {q.questionAr}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      إجابتك:{" "}
                      {user !== undefined ? (
                        <span dir="ltr" className="text-slate-200">
                          {q.optionsAr[user]}
                        </span>
                      ) : (
                        "لم تُجِب"
                      )}
                    </p>
                    {!ok && (
                      <p className="mt-1 text-sm text-emerald-300/90">
                        الصحيح: <span dir="ltr">{q.optionsAr[q.correctIndex]}</span>
                      </p>
                    )}
                    <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-slate-300">
                      <span className="font-semibold text-violet-300">لماذا؟ </span>
                      {q.explainAr}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
