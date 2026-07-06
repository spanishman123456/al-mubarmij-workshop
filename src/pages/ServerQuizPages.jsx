import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QuizQuestionRenderer, questionTypeLabel } from "../components/quiz/QuizQuestionRenderer";
import {
  PRE_ASSESSMENT_DEFER_CONFIRM_AR,
  PRE_ASSESSMENT_DEFERRED_AR,
  PRE_ASSESSMENT_INTRO_AR,
  PRE_ASSESSMENT_STATUS,
  PRE_ASSESSMENT_SUBMITTED_AR,
} from "../content/onboarding/onboardingPolicy";
import {
  fetchQuizAttemptApi,
  fetchQuizPublicApi,
  fetchQuizReviewApi,
  fetchTeacherQuizPreviewApi,
  saveQuizAttemptApi,
  submitQuizAttemptApi,
} from "../lib/quizApi";
import { TEACHER_PREVIEW_BADGE_AR } from "../config/publication";
import { usePlatform } from "../context/PlatformContext";

function isAnswered(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
}

export function ServerQuizTakePage({ quizId }) {
  const navigate = useNavigate();
  const { savePreAssessmentProgress, user } = usePlatform();
  const isTeacher = user?.role === "teacher";
  const isPreAssessment = quizId === "quiz-pre";
  const saveTimerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [teacherPreview, setTeacherPreview] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [meta, setMeta] = useState({ sectionIndex: 0, questionIndex: 0, flagged: {} });
  const [saveMessage, setSaveMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const submitted = attempt?.status === "submitted";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isTeacher) {
          const preview = await fetchTeacherQuizPreviewApi(quizId);
          if (cancelled) return;
          setTeacherPreview(preview);
          setQuiz({ titleAr: preview.titleAr, sections: [] });
        } else {
          const [pub, att] = await Promise.all([fetchQuizPublicApi(quizId), fetchQuizAttemptApi(quizId)]);
          if (cancelled) return;
          setQuiz(pub);
          setAttempt(att.attempt);
          setAnswers(att.attempt.answers || {});
          setMeta({ sectionIndex: 0, questionIndex: 0, flagged: {}, ...(att.attempt.meta || {}) });
          if (att.attempt.status === "submitted") {
            navigate(`/quizzes/review/${att.attempt.id}`, { replace: true });
          }
        }
      } catch {
        if (!cancelled) setError("تعذر تحميل الاختبار — تحقق من الاتصال.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [quizId, navigate, isTeacher]);

  const flatQuestions = useMemo(() => {
    if (!quiz?.sections) return [];
    return quiz.sections.flatMap((s, si) =>
      s.questions.map((q, qi) => ({ ...q, sectionId: s.id, sectionTitle: s.titleAr, sectionIndex: si, questionIndex: qi })),
    );
  }, [quiz]);

  const currentFlatIndex = useMemo(() => {
    if (!flatQuestions.length) return 0;
    const idx = flatQuestions.findIndex(
      (q) => q.sectionIndex === meta.sectionIndex && q.questionIndex === meta.questionIndex,
    );
    return idx >= 0 ? idx : 0;
  }, [flatQuestions, meta.sectionIndex, meta.questionIndex]);

  const currentQuestion = flatQuestions[currentFlatIndex];

  const persist = useCallback(
    async (nextAnswers, nextMeta, options = {}) => {
      if (!attempt || submitted) return;
      try {
        const data = await saveQuizAttemptApi(quizId, attempt.id, {
          answers: nextAnswers,
          meta: nextMeta,
          status: options.defer ? "deferred" : "in_progress",
        });
        setAttempt(data.attempt);
        setSaveMessage(options.defer ? PRE_ASSESSMENT_DEFER_CONFIRM_AR : "تم حفظ تقدمك.");
        if (isPreAssessment && user?.role === "student") {
          await savePreAssessmentProgress({
            answers: nextAnswers,
            status: options.defer ? PRE_ASSESSMENT_STATUS.DEFERRED : PRE_ASSESSMENT_STATUS.IN_PROGRESS,
            totalQuestions: flatQuestions.length,
          });
        }
      } catch {
        setSaveMessage("تعذر حفظ آخر تعديل — تحقق من الاتصال.");
      }
    },
    [attempt, submitted, quizId, isPreAssessment, user?.role, savePreAssessmentProgress, flatQuestions.length],
  );

  useEffect(() => {
    if (submitted || !attempt) return undefined;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => persist(answers, meta), 900);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [answers, meta, submitted, attempt, persist]);

  const answeredCount = flatQuestions.filter((q) => isAnswered(answers[q.id])).length;
  const progressPercent = flatQuestions.length ? Math.round((answeredCount / flatQuestions.length) * 100) : 0;

  function setAnswer(questionId, value) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function goToFlatIndex(idx) {
    const q = flatQuestions[idx];
    if (!q) return;
    setMeta((m) => ({ ...m, sectionIndex: q.sectionIndex, questionIndex: q.questionIndex }));
  }

  function toggleFlag() {
    if (!currentQuestion) return;
    setMeta((m) => ({
      ...m,
      flagged: { ...m.flagged, [currentQuestion.id]: !m.flagged?.[currentQuestion.id] },
    }));
  }

  async function handleSubmit() {
    const unanswered = flatQuestions.filter((q) => !isAnswered(answers[q.id]));
    if (unanswered.length > 0) {
      const msg = isPreAssessment
        ? `أجبت عن ${answeredCount} من ${flatQuestions.length} سؤالًا.\nتركت ${unanswered.length} سؤالًا دون إجابة.\n\nيمكنك العودة لإكمال الأسئلة أو إرسال الإجابات الحالية (اختبار تشخيصي).`
        : `أجبت عن ${answeredCount} من ${flatQuestions.length} سؤالًا.\nتركت ${unanswered.length} سؤالًا دون إجابة.\n\nهل تريد الإرسال على أي حال؟`;
      if (!window.confirm(msg)) return;
    }
    setSubmitting(true);
    try {
      await persist(answers, meta);
      const data = await submitQuizAttemptApi(quizId, attempt.id);
      if (isPreAssessment && user?.role === "student") {
        await savePreAssessmentProgress({
          answers,
          status: PRE_ASSESSMENT_STATUS.SUBMITTED,
          totalQuestions: flatQuestions.length,
          result: data.result,
        });
      }
      navigate(`/quizzes/review/${data.attempt.id}`);
    } catch {
      setSaveMessage("تعذر إرسال الاختبار — حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDefer() {
    await persist(answers, meta, { defer: true });
    navigate("/path/day/day-01");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] pb-24 pt-24 text-center font-ar text-white">
        <p>جاري تحميل الاختبار…</p>
      </div>
    );
  }

  if (isTeacher && teacherPreview) {
    return (
      <TeacherQuizPreviewView
        preview={teacherPreview}
        quizId={quizId}
        previewIndex={previewIndex}
        setPreviewIndex={setPreviewIndex}
        onBack={() => navigate("/quizzes")}
      />
    );
  }

  if (error || !quiz || !currentQuestion) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] pb-24 pt-24 text-center font-ar text-white">
        <p>{error || "الاختبار غير متاح."}</p>
        <Link to="/quizzes" className="edu-btn edu-btn-outline press-scale mt-4 inline-flex">
          العودة
        </Link>
      </div>
    );
  }

  const qType = currentQuestion.type || "mcq";

  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-24 pt-24 font-ar text-white">
      <div className="mx-auto max-w-3xl animate-slide-up px-4">
        <button
          type="button"
          onClick={() => navigate("/quizzes")}
          className="press-scale mb-6 text-sm text-slate-400 transition hover:text-white"
        >
          ← العودة للاختبارات
        </button>

        <header className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-bold">{quiz.titleAr}</h1>
          <p className="mt-2 text-sm text-slate-300">
            {isPreAssessment ? PRE_ASSESSMENT_INTRO_AR : "أجب عن الأسئلة داخل المنصة — لا حاجة لدفتر خارجي."}
          </p>
          {isPreAssessment ? <p className="mt-2 text-xs text-violet-200">{PRE_ASSESSMENT_DEFERRED_AR}</p> : null}
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-slate-400">
              <span>التقدم</span>
              <span>
                {answeredCount} / {flatQuestions.length}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </header>

        <div className="mb-4 flex flex-wrap gap-2">
          {quiz.sections.map((s, si) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                const first = flatQuestions.findIndex((q) => q.sectionIndex === si);
                if (first >= 0) goToFlatIndex(first);
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                meta.sectionIndex === si ? "bg-violet-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"
              }`}
            >
              {s.titleAr.replace(/^القسم \d+: /, "")}
            </button>
          ))}
        </div>

        <fieldset className="quiz-question-card rounded-2xl border border-white/10 bg-black/30 p-5" dir="rtl" data-testid="quiz-question-card">
          <legend className="px-2 text-lg font-bold">
            السؤال {currentFlatIndex + 1} من {flatQuestions.length}
            <span className="mr-2 text-xs font-normal text-violet-300">({questionTypeLabel(qType)})</span>
          </legend>
          <p className="mb-1 text-xs text-slate-400">{currentQuestion.sectionTitle}</p>
          <p className="mb-4 whitespace-pre-wrap text-right leading-relaxed text-slate-200">{currentQuestion.questionAr}</p>

          {currentQuestion.codeSnippetAr ? (
            <pre
              className="mb-4 overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-left text-sm text-emerald-200"
              dir="ltr"
            >
              {currentQuestion.codeSnippetAr}
            </pre>
          ) : null}

          <QuizQuestionRenderer
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={(v) => setAnswer(currentQuestion.id, v)}
            disabled={submitted}
          />

          <p className="mt-3 text-xs text-slate-500">
            {["essay", "code", "code-editor"].includes(qType)
              ? "يُراجع المعلم هذا السؤال بعد الإرسال."
              : "تُصحَّح هذه الإجابة آلياً بعد الإرسال النهائي."}
          </p>
        </fieldset>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="edu-btn edu-btn-outline text-sm"
            disabled={currentFlatIndex === 0}
            onClick={() => goToFlatIndex(currentFlatIndex - 1)}
          >
            السابق
          </button>
          <button
            type="button"
            className="edu-btn edu-btn-outline text-sm"
            disabled={currentFlatIndex >= flatQuestions.length - 1}
            onClick={() => goToFlatIndex(currentFlatIndex + 1)}
          >
            التالي
          </button>
          <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={toggleFlag}>
            {meta.flagged?.[currentQuestion.id] ? "★ مراجعة لاحقًا" : "☆ وضع علامة مراجعة"}
          </button>
        </div>

        <div className="mt-4 max-h-32 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="mb-2 text-xs font-bold text-slate-400">قائمة الأسئلة</p>
          <div className="flex flex-wrap gap-1">
            {flatQuestions.map((q, i) => {
              const done = isAnswered(answers[q.id]);
              const flagged = meta.flagged?.[q.id];
              return (
                <button
                  key={q.id}
                  type="button"
                  data-testid={`quiz-nav-${q.id}`}
                  onClick={() => goToFlatIndex(i)}
                  className={`h-8 w-8 rounded text-xs font-bold ${
                    i === currentFlatIndex
                      ? "bg-violet-600 text-white"
                      : done
                        ? "bg-emerald-900/60 text-emerald-200"
                        : flagged
                          ? "bg-amber-900/50 text-amber-200"
                          : "bg-white/10 text-slate-400"
                  }`}
                  title={q.questionAr.slice(0, 60)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="edu-btn press-scale mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 text-lg font-bold text-white"
          data-testid="quiz-submit"
        >
          {isPreAssessment ? "إرسال التقويم القبلي" : "إرسال الاختبار النهائي"}
        </button>

        {isPreAssessment ? (
          <>
            {saveMessage ? <p className="mt-2 text-center text-sm text-slate-300">{saveMessage}</p> : null}
            <button
              type="button"
              onClick={handleDefer}
              className="edu-btn press-scale mt-3 w-full rounded-xl border border-violet-400/50 bg-violet-950/30 py-3 font-bold text-violet-100"
            >
              إكمال التقويم لاحقًا والانتقال إلى الدرس الأول
            </button>
          </>
        ) : (
          saveMessage && <p className="mt-2 text-center text-sm text-slate-300">{saveMessage}</p>
        )}
      </div>
    </div>
  );
}

function formatModelAnswer(q) {
  const v = q.modelAnswer;
  if (v == null) return "—";
  if (Array.isArray(v)) return v.join(" → ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function TeacherQuizPreviewView({ preview, quizId, previewIndex, setPreviewIndex, onBack }) {
  const questions = preview.questions || [];
  const current = questions[previewIndex];
  const isPre = quizId === "quiz-pre";

  if (!current) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] pb-24 pt-24 text-center font-ar text-white">
        <p>لا توجد أسئلة في هذا الاختبار.</p>
        <button type="button" onClick={onBack} className="edu-btn edu-btn-outline press-scale mt-4">
          العودة
        </button>
      </div>
    );
  }

  const qType = current.type || "mcq";

  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-24 pt-24 font-ar text-white" data-testid="teacher-quiz-preview">
      <div className="mx-auto max-w-3xl animate-slide-up px-4">
        <button type="button" onClick={onBack} className="press-scale mb-6 text-sm text-slate-400 transition hover:text-white">
          ← العودة للاختبارات
        </button>

        <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-950/30 p-4 text-sm text-amber-100">
          <p className="font-bold">معاينة المعلم</p>
          <p className="mt-1">{TEACHER_PREVIEW_BADGE_AR}</p>
          <p className="mt-2 text-xs text-amber-200/90">
            لا تُنشأ محاولة طالب ولا تُحسب نتيجة — للمراجعة والإشراف فقط.
            {isPre ? " الاختبار القبلي تشخيصي ولا يمنع تقدم الطالب." : " الاختبار البعدي مستقل عن القبلي لقياس التحسن."}
          </p>
        </div>

        <header className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-bold">{preview.titleAr}</h1>
          <p className="mt-2 text-sm text-slate-300">
            {questions.length} سؤالاً · وضع المعاينة مع الإجابات النموذجية والشرح
          </p>
        </header>

        <fieldset className="quiz-question-card rounded-2xl border border-white/10 bg-black/30 p-5" dir="rtl">
          <legend className="px-2 text-lg font-bold">
            السؤال {previewIndex + 1} من {questions.length}
            <span className="mr-2 text-xs font-normal text-violet-300">({questionTypeLabel(qType)})</span>
          </legend>
          <p className="mb-4 whitespace-pre-wrap text-right leading-relaxed text-slate-200">{current.questionAr}</p>

          {current.codeSnippetAr ? (
            <pre
              className="mb-4 overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-left text-sm text-emerald-200"
              dir="ltr"
            >
              {current.codeSnippetAr}
            </pre>
          ) : null}

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-sm">
            <p className="font-bold text-emerald-200">الإجابة النموذجية</p>
            <p className="mt-2 whitespace-pre-wrap text-emerald-100" dir="auto">
              {formatModelAnswer(current)}
            </p>
          </div>

          {current.explainAr ? (
            <p className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-300">
              <span className="font-semibold text-violet-300">الشرح: </span>
              {current.explainAr}
            </p>
          ) : null}
        </fieldset>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="edu-btn edu-btn-outline text-sm"
            disabled={previewIndex === 0}
            onClick={() => setPreviewIndex((i) => Math.max(0, i - 1))}
          >
            السابق
          </button>
          <button
            type="button"
            className="edu-btn edu-btn-outline text-sm"
            disabled={previewIndex >= questions.length - 1}
            onClick={() => setPreviewIndex((i) => Math.min(questions.length - 1, i + 1))}
          >
            التالي
          </button>
        </div>

        <div className="mt-4 max-h-32 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="mb-2 text-xs font-bold text-slate-400">قائمة الأسئلة</p>
          <div className="flex flex-wrap gap-1">
            {questions.map((q, i) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setPreviewIndex(i)}
                className={`h-8 w-8 rounded text-xs font-bold ${
                  i === previewIndex ? "bg-violet-600 text-white" : "bg-white/10 text-slate-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuizReviewPageContent({ attemptId }) {
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchQuizReviewApi(attemptId);
        if (!cancelled) setReview(data);
      } catch {
        if (!cancelled) setError("تعذر تحميل المراجعة — قد لا يكون الاختبار مُرسَلًا بعد.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  if (loading) {
    return <p className="text-center text-slate-300">جاري تحميل مراجعة الإجابات…</p>;
  }
  if (error || !review) {
    return <p className="text-center text-rose-300">{error}</p>;
  }

  const isPre = review.quizId === "quiz-pre";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-violet-500/30 bg-violet-950/30 p-6 text-center">
        <h2 className="text-xl font-bold">{isPre ? PRE_ASSESSMENT_SUBMITTED_AR : "تم إرسال الاختبار"}</h2>
        {isPre ? (
          <p className="mt-3 text-sm text-violet-100">
            هذه النتيجة تشخيصية، وهدفها مساعدتك ومعلمك على معرفة المفاهيم التي ستتعلمها. لا تمنعك نتيجتك من
            متابعة الدروس.
          </p>
        ) : null}
        <p className="mt-4 text-3xl font-black">{review.summary.percent}٪</p>
        <p className="text-sm text-slate-300">
          صحيح (تصحيح آلي): {review.summary.autoCorrect} من {review.summary.autoTotal}
          {review.summary.manualPending > 0 ? ` · بانتظار المعلم: ${review.summary.manualPending}` : ""}
        </p>
        <Link
          to={isPre ? "/path/day/day-01" : "/quizzes"}
          className="edu-btn edu-btn-primary press-scale mt-4 inline-flex"
        >
          {isPre ? "بدء الدرس الأول" : "قائمة الاختبارات"}
        </Link>
      </div>

      <h3 className="text-lg font-bold text-slate-200">مراجعة الأسئلة والشرح</h3>
      <ul className="space-y-4">
        {review.questions.map((q, idx) => {
          const badge =
            q.gradingStatus === "correct"
              ? "✓"
              : q.gradingStatus === "incorrect"
                ? "✗"
                : q.gradingStatus === "pending_teacher_review"
                  ? "◆"
                  : "○";
          return (
            <li key={q.id} className="rounded-2xl border border-white/10 bg-black/30 p-5" dir="rtl">
              <p className="font-bold text-white">
                {idx + 1}. {badge} {q.questionAr}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                إجابتك:{" "}
                <span className="whitespace-pre-wrap text-slate-200" dir="auto">
                  {formatReviewAnswer(q)}
                </span>
              </p>
              {q.autoGraded && q.gradingStatus === "incorrect" && q.modelAnswer ? (
                <p className="mt-1 text-sm text-emerald-300">
                  الإجابة النموذجية: <span dir="ltr">{String(q.modelAnswer)}</span>
                </p>
              ) : null}
              {q.gradingStatus === "pending_teacher_review" ? (
                <p className="mt-1 text-sm text-violet-300">تم حفظ إجابتك — بانتظار مراجعة المعلم.</p>
              ) : null}
              <p className="mt-3 border-t border-white/10 pt-3 text-sm text-slate-300">
                <span className="font-semibold text-violet-300">الشرح: </span>
                {q.explainAr}
              </p>
              {q.lessonLink ? (
                <Link to={q.lessonLink} className="mt-2 inline-block text-sm text-violet-300 hover:text-white">
                  ← راجع الدرس المرتبط
                </Link>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function formatReviewAnswer(q) {
  const v = q.userAnswer;
  if (v === undefined || v === null || String(v).trim() === "") return "لم تُجِب";
  if (q.type === "match") {
    try {
      const p = JSON.parse(v);
      return (q.matchLeft || [])
        .map((left, i) => `${left} → ${(q.matchRight || [])[p[String(i)]] ?? "?"}`)
        .join(" | ");
    } catch {
      return v;
    }
  }
  if (q.type === "mcq" || q.type === "truefalse") return q.optionsAr?.[Number(v)] ?? v;
  return v;
}
