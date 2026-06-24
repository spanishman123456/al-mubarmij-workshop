import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getQuizById } from "../data/quizzes";
import { usePlatform } from "../context/PlatformContext";
import { computeQuizResult, isAutoGradable, isQuestionCorrect, prepareQuizForAttempt } from "../lib/quizEngine";

function questionTypeLabel(type) {
  if (type === "fill") return "إكمال فراغ";
  if (type === "truefalse") return "صح / خطأ";
  if (type === "essay") return "سؤال مقالي / رسم";
  if (type === "code") return "سؤال برمجي";
  return "اختيار من متعدد";
}

export default function QuizTakePage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { saveQuizResult, user } = usePlatform();
  const rawQuiz = useMemo(() => getQuizById(quizId ?? ""), [quizId]);
  const [attemptSeed, setAttemptSeed] = useState(() => Date.now());

  const quiz = useMemo(
    () => (rawQuiz ? prepareQuizForAttempt(rawQuiz, attemptSeed) : null),
    [rawQuiz, attemptSeed],
  );

  const [answers, setAnswers] = useState(() => ({}));
  const [submitted, setSubmitted] = useState(false);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20 pt-24 text-center font-ar animate-fade-in">
        <p className="text-slate-600">الاختبار غير موجود.</p>
        <Link to="/quizzes" className="edu-btn edu-btn-outline press-scale mt-4 inline-flex">
          العودة لقائمة الاختبارات
        </Link>
      </div>
    );
  }

  const result = submitted ? computeQuizResult(quiz, answers) : null;
  const answeredCount = quiz.questions.filter((q) => {
    const a = answers[q.id];
    return a !== undefined && a !== null && String(a).trim() !== "";
  }).length;
  const progressPercent = Math.round((answeredCount / quiz.questions.length) * 100);

  function setAnswer(questionId, value) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleSubmit() {
    const unanswered = quiz.questions.filter((q) => {
      const a = answers[q.id];
      return a === undefined || a === null || String(a).trim() === "";
    });
    if (unanswered.length > 0) {
      const ok = window.confirm(`لم تُجِب عن ${unanswered.length} سؤالاً. هل تريد الإرسال على أي حال؟`);
      if (!ok) return;
    }
    setSubmitted(true);
    if (user?.role === "student") {
      const r = computeQuizResult(quiz, answers);
      saveQuizResult(quiz.id, {
        score: r.correct,
        total: r.total,
        percent: r.percent,
        passed: r.passed,
      });
    }
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    setAttemptSeed(Date.now());
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-24 pt-24 font-ar text-white">
      <div className="mx-auto max-w-3xl animate-slide-up px-4">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/quizzes")}
            className="press-scale text-sm text-slate-400 transition hover:text-white"
          >
            ← العودة للاختبارات
          </button>
        </div>

        <header className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-bold">{quiz.titleAr}</h1>
          <p className="mt-2 text-sm text-slate-300">{quiz.descriptionAr}</p>
          <p className="mt-3 text-xs text-emerald-300">
            معيار النجاح: {quiz.passPercent}٪ · عدد الأسئلة: {quiz.questions.length}
            {quiz.shuffle === false ? " · ترتيب PDF الرسمي" : quiz.shuffle || quiz.questionPool ? " · ترتيب عشوائي" : ""}
          </p>
          {!submitted && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-slate-400">
                <span>التقدم في الإجابة</span>
                <span>
                  {answeredCount} / {quiz.questions.length}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="progress-bar-fill h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {!submitted && (
          <div className="space-y-6">
            {quiz.questions.map((q, idx) => {
              const qType = q.type || "mcq";
              return (
                <fieldset
                  key={q.id}
                  className={`quiz-question-card rounded-2xl border border-white/10 bg-black/30 p-5 animate-slide-up stagger-${Math.min(idx + 1, 8)}`}
                  dir="rtl"
                >
                  <legend className="px-2 text-lg font-bold text-white">
                    السؤال {idx + 1} من {quiz.questions.length}
                    <span className="mr-2 text-xs font-normal text-violet-300">
                      ({questionTypeLabel(qType)})
                    </span>
                  </legend>
                  <p className="mb-4 whitespace-pre-wrap text-right leading-relaxed text-slate-200">{q.questionAr}</p>

                  {q.codeSnippetAr && (
                    <pre
                      className="mb-4 overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-left text-sm text-emerald-200"
                      dir="ltr"
                    >
                      {q.codeSnippetAr}
                    </pre>
                  )}

                  {qType === "fill" ? (
                    <input
                      type="text"
                      className="edu-input w-full bg-white/10 text-white placeholder:text-slate-500"
                      placeholder="اكتب إجابتك هنا"
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      dir="auto"
                    />
                  ) : qType === "essay" || qType === "code" ? (
                    <textarea
                      className="edu-input min-h-[140px] w-full resize-y bg-white/10 font-mono text-sm text-white placeholder:text-slate-500"
                      placeholder={
                        qType === "code"
                          ? "اكتب الكود أو الخوارزمية هنا..."
                          : "اكتب إجابتك أو ارسم في دفترك ثم صف الحل هنا..."
                      }
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      dir={qType === "code" ? "ltr" : "rtl"}
                    />
                  ) : (
                    <div className="space-y-2" dir="rtl">
                      {(q.optionsAr || []).map((opt, i) => {
                        const id = `${q.id}-opt-${i}`;
                        const picked = answers[q.id] === i;
                        return (
                          <label
                            key={id}
                            className={`quiz-option flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-right text-sm transition ${
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
                  )}
                </fieldset>
              );
            })}

            <button
              type="button"
              onClick={handleSubmit}
              className="edu-btn press-scale w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 text-lg font-bold text-white shadow-lg hover:brightness-110"
            >
              إنهاء الإرسال وحساب النتيجة
            </button>
          </div>
        )}

        {submitted && result && (
          <div className="animate-fade-in space-y-6">
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
                صحيح (أسئلة تُصحَّح آلياً): {result.correct} من {result.total}
                {result.manualTotal > 0 && (
                  <>
                    {" "}
                    · أسئلة مفتوحة/برمجية: {result.manualAnswered} من {result.manualTotal} (تصحيح المعلم)
                  </>
                )}
                {quiz.passPercent > 0 && (
                  <>
                    {" "}
                    · مطلوب للنجاح: {quiz.passPercent}٪ على الأقل
                  </>
                )}
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
                  className="press-scale rounded-full border border-white/30 px-6 py-2 text-sm font-semibold hover:bg-white/10"
                >
                  إعادة الاختبار{quiz.shuffle === false ? "" : " (أسئلة جديدة)"}
                </button>
                <Link
                  to="/quizzes"
                  className="press-scale rounded-full bg-violet-600 px-6 py-2 text-sm font-semibold text-white hover:bg-violet-500"
                >
                  قائمة الاختبارات
                </Link>
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-300">مراجعة الأسئلة</h2>
            <ul className="space-y-4">
              {quiz.questions.map((q, idx) => {
                const userAns = answers[q.id];
                const auto = isAutoGradable(q);
                const ok = auto ? isQuestionCorrect(q, userAns) : String(userAns ?? "").trim().length > 0;
                const qType = q.type || "mcq";
                return (
                  <li
                    key={q.id}
                    className={`rounded-2xl border p-5 ${
                      !auto
                        ? "border-violet-500/30 bg-violet-950/20"
                        : ok
                          ? "border-emerald-500/30 bg-emerald-950/20"
                          : "border-rose-500/30 bg-rose-950/20"
                    }`}
                    dir="rtl"
                  >
                    <p className="font-bold text-white">
                      {idx + 1}. {auto ? (ok ? "✓" : "✗") : "◆"} {q.questionAr}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      إجابتك:{" "}
                      {userAns !== undefined && String(userAns).trim() !== "" ? (
                        <span
                          dir={qType === "fill" || qType === "code" ? "ltr" : "rtl"}
                          className="whitespace-pre-wrap text-slate-200"
                        >
                          {qType === "fill" || qType === "essay" || qType === "code"
                            ? userAns
                            : q.optionsAr?.[userAns] ?? userAns}
                        </span>
                      ) : (
                        "لم تُجِب"
                      )}
                    </p>
                    {!auto && (
                      <p className="mt-1 text-sm text-violet-300/90">
                        هذا السؤال يحتاج تصحيحاً يدوياً من المعلم (رسم، مقالي، أو برمجي).
                      </p>
                    )}
                    {auto && !ok && (
                      <p className="mt-1 text-sm text-emerald-300/90">
                        الصحيح:{" "}
                        <span dir="ltr">
                          {qType === "fill"
                            ? q.correctAnswer
                            : q.optionsAr?.[q.correctIndex]}
                        </span>
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
