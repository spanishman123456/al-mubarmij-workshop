import { Link } from "react-router-dom";
import { curriculumUnits } from "../data/curriculum";
import { quizzes, PRE_TEST_QUESTION_BANK, POST_TEST_QUESTION_BANK } from "../data/quizzes";
import { curriculumDays } from "../data/curriculum15Days";
import { usePlatform } from "../context/PlatformContext";
import { PageShell } from "../components/layout/PageShell";
import { getQuizQuestionCount } from "../lib/quizEngine";
import { getPublishedDaysCount, isCurriculumDayPublished } from "../config/publication";

function unitTitle(unitId) {
  if (!unitId) return "جميع الوحدات";
  return curriculumUnits.find((u) => u.id === unitId)?.titleAr ?? unitId;
}

export default function QuizzesPage() {
  const { myProgress } = usePlatform();
  const scores = myProgress?.quizScores ?? {};

  const byUnit = curriculumUnits.map((u) => ({
    unit: u,
    items: quizzes.filter((q) => q.unitId === u.id),
  }));
  const comprehensive = quizzes.filter(
    (q) => q.unitId == null && !["quiz-pre", "quiz-post"].includes(q.id) && !q.id.startsWith("quiz-day"),
  );
  const prePost = quizzes.filter((q) => {
    if (!["quiz-pre", "quiz-post"].includes(q.id)) return false;
    if (q.id === "quiz-post" && getPublishedDaysCount() < 15) return false;
    return true;
  });
  const dayQuizzes = curriculumDays
    .filter((d) => d.quizId && !["quiz-pre", "quiz-post"].includes(d.quizId))
    .filter((d) => isCurriculumDayPublished(d.id))
    .map((d) => ({
      day: d,
      quiz: quizzes.find((q) => q.id === d.quizId),
    }))
    .filter((x) => x.quiz);

  return (
    <PageShell
      title="الاختبارات الإلكترونية"
      subtitle="التقويم القبلي، الاختبارات القصيرة أثناء التعلم، والتقويم البعدي — تُحفظ النتائج في حسابك وللمعلم."
      badge="تقييم تكويني"
    >
      {prePost.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900">التقويم القبلي والبعدي</h2>
          <p className="mt-1 text-sm text-slate-600">
            القبلي يقيس مستواك قبل البدء ({PRE_TEST_QUESTION_BANK.length} سؤالاً تغطي محاور المنهج)؛ البعدي
            بعد إتمام المنهج ({POST_TEST_QUESTION_BANK.length} سؤالاً مختلفاً) — للمقارنة مع المعلم.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {prePost.map((q) => (
              <QuizCard key={q.id} quiz={q} score={scores[q.id]} variant="prepost" />
            ))}
          </div>
        </section>
      )}

      {dayQuizzes.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900">اختبارات قصيرة — مسار 15 يومًا</h2>
          <p className="mt-1 text-sm text-slate-600">اختبار بعد كل يوم دراسي لقياس الفهم الفوري.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dayQuizzes.map(({ day, quiz }) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                score={scores[quiz.id]}
                badge={`اليوم ${day.dayNumber}`}
              />
            ))}
          </div>
        </section>
      )}

      {comprehensive.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900">اختبار شامل</h2>
          <div className="mt-4 space-y-3">
            {comprehensive.map((q) => (
              <QuizCard key={q.id} quiz={q} score={scores[q.id]} variant="comprehensive" />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold text-slate-900">اختبارات حسب الوحدة</h2>
        <div className="mt-6 space-y-8">
          {byUnit.map(
            ({ unit, items }) =>
              items.length > 0 && (
                <div key={unit.id}>
                  <h3 className="mb-3 font-semibold text-violet-800">{unit.titleAr}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {items.map((q) => (
                      <QuizCard key={q.id} quiz={q} score={scores[q.id]} />
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
        <Link to="/path" className="font-semibold text-violet-700 hover:text-violet-900">
          المسار الدراسي
        </Link>
        <Link to="/worksheets" className="font-semibold text-violet-700 hover:text-violet-900">
          أوراق العمل
        </Link>
      </div>
    </PageShell>
  );
}

function QuizCard({ quiz, score, variant, badge }) {
  const questionCount = getQuizQuestionCount(quiz);
  const passLabel =
    quiz.passPercent > 0 ? `نجاح من ${quiz.passPercent}٪` : "بدون معيار نجاح إلزامي";
  const border =
    variant === "prepost"
      ? "border-emerald-300 bg-emerald-50"
      : variant === "comprehensive"
        ? "border-violet-300 bg-violet-50"
        : "border-slate-200 bg-white";

  return (
    <article className={`quiz-type-card flex flex-col ${border}`}>
      {badge ? (
        <span className="mb-2 inline-block w-fit rounded-md bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-800">
          {badge}
        </span>
      ) : null}
      <h3>{quiz.titleAr}</h3>
      <p>{quiz.descriptionAr}</p>
      <p className="mt-2 text-xs font-medium text-slate-500">
        {questionCount} أسئلة · {passLabel}
        {score ? ` · نتيجتك: ${score.percent}%` : ""}
      </p>
      <Link to={`/quizzes/run/${quiz.id}`} className="edu-btn edu-btn-primary mt-4 w-fit text-sm">
        {score ? "إعادة" : "ابدأ"}
      </Link>
    </article>
  );
}
