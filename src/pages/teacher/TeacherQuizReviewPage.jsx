import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import {
  AssessmentAnswer,
  AssessmentPrompt,
} from "../../components/quiz/QuizQuestionRenderer";

async function teacherFetch(path) {
  const res = await fetch(path, { credentials: "include", cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "failed");
  return data;
}

export default function TeacherQuizReviewPage() {
  const [attempts, setAttempts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [review, setReview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    teacherFetch("/api/teacher/quiz-attempts?quizId=quiz-pre")
      .then((d) => setAttempts(d.attempts || []))
      .catch(() => setError("تعذر تحميل المحاولات."));
  }, []);

  async function loadReview(attemptId) {
    setSelected(attemptId);
    setReview(null);
    try {
      const data = await teacherFetch(`/api/quiz/review/${attemptId}`);
      setReview(data);
    } catch {
      setError("تعذر تحميل مراجعة المحاولة.");
    }
  }

  return (
    <PageShell title="مراجعة اختبارات الطلاب" subtitle="التقويم القبلي والبعدي">
      <Link to="/teacher" className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← لوحة المعلم
      </Link>

      {error ? <p className="text-rose-600">{error}</p> : null}

      <EduCard title="المحاولات المرسلة">
        <ul className="space-y-2 text-sm">
          {attempts
            .filter((a) => a.status === "submitted")
            .map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                <span>
                  {a.student_id} — {a.quiz_id} #{a.attempt_number}
                </span>
                <button type="button" className="edu-btn edu-btn-outline text-xs" onClick={() => loadReview(a.id)}>
                  عرض الإجابات
                </button>
              </li>
            ))}
        </ul>
      </EduCard>

      {review ? (
        <EduCard title={`مراجعة المحاولة #${selected}`} className="mt-4">
          <p className="mb-4 text-sm text-slate-600">
            صحيح (آلي): {review.summary.autoCorrect}/{review.summary.autoTotal} — بانتظار المعلم:{" "}
            {review.summary.manualPending}
          </p>
          <ul className="max-h-[32rem] space-y-3 overflow-y-auto text-sm">
            {review.questions
              .filter((q) => q.gradingStatus === "pending_teacher_review")
              .map((q) => (
                <li key={q.id} className="rounded-lg border border-violet-100 bg-violet-50/40 p-3">
                  <AssessmentPrompt question={q} className="font-bold text-slate-900" />
                  <div className="mt-2 whitespace-pre-wrap text-slate-700">
                    <AssessmentAnswer question={q}>{String(q.userAnswer || "—")}</AssessmentAnswer>
                  </div>
                </li>
              ))}
          </ul>
        </EduCard>
      ) : null}
    </PageShell>
  );
}
