import { Link } from "react-router-dom";
import { curriculumUnits } from "../data/curriculum";
import { quizzes } from "../data/quizzes";

function unitTitle(unitId) {
  if (!unitId) return "جميع الوحدات";
  return curriculumUnits.find((u) => u.id === unitId)?.titleAr ?? unitId;
}

export default function QuizzesPage() {
  const byUnit = curriculumUnits.map((u) => ({
    unit: u,
    items: quizzes.filter((q) => q.unitId === u.id),
  }));
  const comprehensive = quizzes.filter((q) => q.unitId == null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20 pt-24 font-ar">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">الاختبارات الإلكترونية</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            اختبارات نظرية متعددة الخيارات لكل وحدة، واختبار شامل للمراجعة. بعد الإرسال تحصل على النتيجة ومعيار النجاح
            (يختلف حسب الاختبار)، وشرح لكل سؤال.
          </p>
        </div>

        {comprehensive.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-lg font-bold text-slate-900">اختبار شامل</h2>
            <ul className="space-y-3">
              {comprehensive.map((q) => (
                <li
                  key={q.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-violet-200 bg-violet-50/80 p-5"
                >
                  <div>
                    <h3 className="font-bold text-slate-900">{q.titleAr}</h3>
                    <p className="mt-1 text-sm text-slate-600">{q.descriptionAr}</p>
                    <p className="mt-2 text-xs text-violet-700">
                      {q.questions.length} أسئلة · نجاح من {q.passPercent}٪
                    </p>
                  </div>
                  <Link
                    to={`/quizzes/run/${q.id}`}
                    className="shrink-0 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-violet-500"
                  >
                    ابدأ الاختبار
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-lg font-bold text-slate-900">اختبارات حسب الوحدة</h2>
          <div className="space-y-8">
            {byUnit.map(
              ({ unit, items }) =>
                items.length > 0 && (
                  <div key={unit.id}>
                    <h3 className="mb-3 text-sm font-semibold text-violet-700">{unit.titleAr}</h3>
                    <ul className="space-y-3">
                      {items.map((q) => (
                        <li
                          key={q.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                          <div>
                            <h4 className="font-bold text-slate-900">{q.titleAr}</h4>
                            <p className="mt-1 text-sm text-slate-600">{q.descriptionAr}</p>
                            <p className="mt-2 text-xs text-slate-500">
                              {q.questions.length} أسئلة · نجاح من {q.passPercent}٪ · {unitTitle(q.unitId)}
                            </p>
                          </div>
                          <Link
                            to={`/quizzes/run/${q.id}`}
                            className="shrink-0 rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-500"
                          >
                            ابدأ
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        </section>

        <p className="mt-12 text-center text-sm text-slate-500">
          <Link to="/curriculum" className="text-violet-700 underline-offset-2 hover:underline">
            مراجعة المسار الدراسي
          </Link>
          {" · "}
          <Link to="/worksheets" className="text-violet-700 underline-offset-2 hover:underline">
            أوراق العمل
          </Link>
        </p>
      </div>
    </div>
  );
}
