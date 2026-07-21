import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import { day12TeacherAnswers } from "../../content/teacher/day12TeacherAnswers";
import { fetchTeacherDay12AnswersApi } from "../../lib/platformApi";

function TeacherItem({ item }) {
  return (
    <div className="mb-3 rounded border border-amber-100 bg-amber-50/50 p-3 text-sm">
      <p className="font-bold">{item.q}</p>
      <p className="mt-1 text-emerald-800">الإجابة: {item.a}</p>
      {item.steps?.length ? (
        <ol className="mt-2 list-decimal pr-5 text-slate-700">
          {item.steps.map((s, j) => (
            <li key={j}>{s}</li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export default function TeacherDay12AnswersPage() {
  const [data, setData] = useState(day12TeacherAnswers);

  useEffect(() => {
    let cancelled = false;
    fetchTeacherDay12AnswersApi()
      .then((res) => {
        if (!cancelled && res?.sections?.length) setData(res);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageShell title={data.titleAr} subtitle="للمعلم فقط — day12">
      <Link to="/teacher" className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← لوحة المعلم
      </Link>
      <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
        معاينة المعلم — هذا المحتوى غير منشور للطلاب بعد.
      </div>
      <EduCard title={data.teacherGuidance.titleAr} accent="violet">
        <p className="mt-2 text-sm text-slate-700">{data.teacherGuidance.overviewAr}</p>
      </EduCard>
      <div className="mt-6 space-y-6">
        {data.sections.map((sec) => (
          <EduCard key={sec.id} title={sec.titleAr} accent="amber">
            {sec.lessonRoute ? (
              <Link to={sec.lessonRoute} className="mt-2 inline-block text-sm font-semibold text-violet-700">
                فتح الدرس →
              </Link>
            ) : null}
            <div className="mt-3">
              {sec.items.map((item, i) => (
                <TeacherItem key={i} item={item} />
              ))}
            </div>
          </EduCard>
        ))}
      </div>
    </PageShell>
  );
}
