import { Link, useParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { getLessonById } from "../data/curriculum";
import { pythonExercises } from "../data/pythonExercises";

export default function LessonPage() {
  const { unitId, lessonId } = useParams();
  const lesson = getLessonById(unitId ?? "", lessonId ?? "");

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 pb-16 pt-28 text-center font-ar">
        <p className="text-slate-600">الدرس غير موجود.</p>
        <Link to="/curriculum" className="mt-4 inline-block text-violet-700 underline">
          المسار الدراسي
        </Link>
      </div>
    );
  }

  const linkedExercises = (lesson.exerciseIds ?? [])
    .map((id) => pythonExercises.find((e) => e.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-16 pt-24 font-ar">
      <article className="mx-auto max-w-3xl px-4">
        <nav className="mb-6 flex flex-wrap gap-2 text-sm text-slate-500">
          <Link to="/curriculum" className="text-violet-700 hover:underline">
            المسار
          </Link>
          <span>/</span>
          <Link to={`/curriculum/unit/${lesson.unitId}`} className="text-violet-700 hover:underline">
            {lesson.unitTitleAr}
          </Link>
          <span>/</span>
          <span className="text-slate-800">{lesson.titleAr}</span>
        </nav>

        <Motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-slate-900">{lesson.titleAr}</h1>
          <p className="mt-3 text-lg text-slate-600">{lesson.summaryAr}</p>
        </Motion.header>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-slate-900">أهداف التعلّم</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700">
            {(lesson.objectivesAr ?? []).map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>

        {(lesson.sections ?? []).map((sec) => (
          <section key={sec.titleAr} className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">{sec.titleAr}</h2>
            <p className="mt-2 leading-relaxed text-slate-700">{sec.bodyAr}</p>
          </section>
        ))}

        {(lesson.vocabulary?.length ?? 0) > 0 && (
          <section className="mt-8 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
            <h2 className="text-lg font-bold text-slate-900">مفردات</h2>
            <dl className="mt-2 space-y-2">
              {lesson.vocabulary.map((v) => (
                <div key={v.termAr}>
                  <dt className="font-semibold text-violet-900">{v.termAr}</dt>
                  <dd className="text-sm text-slate-700">{v.defAr}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {linkedExercises.length > 0 && (
          <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
            <h2 className="text-lg font-bold text-slate-900">تمارين بايثون مرتبطة</h2>
            <p className="mt-1 text-sm text-slate-600">
              افتح «مختبر بايثون» واختر التمرين نفسه من القائمة، أو استخدم الروابط أدناه للانتقال مع ترشيح
              التمرين.
            </p>
            <ul className="mt-3 space-y-2">
              {linkedExercises.map((ex) => (
                <li key={ex.id}>
                  <Link
                    to={`/python?ex=${ex.id}`}
                    className="font-medium text-emerald-800 underline-offset-2 hover:underline"
                  >
                    {ex.titleAr}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to={`/curriculum/unit/${lesson.unitId}`}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            ← الوحدة
          </Link>
          <Link
            to="/python"
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-500"
          >
            مختبر بايثون
          </Link>
        </div>
      </article>
    </div>
  );
}
