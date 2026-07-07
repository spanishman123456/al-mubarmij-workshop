import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import { fetchTeacherDay07AnswersApi } from "../../lib/platformApi";
import { day07TeacherAnswers } from "../../content/teacher/day07TeacherAnswers";

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
      {item.teachingNotes ? <p className="mt-2 text-xs text-slate-600">📝 {item.teachingNotes}</p> : null}
      {item.expectedErrors?.length ? (
        <p className="mt-1 text-xs text-rose-700">أخطاء متوقعة: {item.expectedErrors.join("؛ ")}</p>
      ) : null}
      {item.feedback ? <p className="mt-1 text-xs text-violet-700">تغذية راجعة: {item.feedback}</p> : null}
    </div>
  );
}

export default function TeacherDay07AnswersPage() {
  const [data, setData] = useState(day07TeacherAnswers);

  useEffect(() => {
    let cancelled = false;
    fetchTeacherDay07AnswersApi()
      .then((res) => {
        if (!cancelled && res?.sections?.length) setData(res);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const { titleAr, teacherGuidance, sections } = data;

  return (
    <PageShell title={titleAr} subtitle="للمعلم فقط — pdfPage 339–372">
      <Link to="/teacher" className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← لوحة المعلم
      </Link>

      <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
        معاينة المعلم — هذا المحتوى غير منشور للطلاب بعد.
      </div>

      {teacherGuidance ? (
        <EduCard title={teacherGuidance.titleAr} accent="violet">
          <p className="mt-2 text-sm text-slate-700">{teacherGuidance.overviewAr}</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">التوقيت: {teacherGuidance.pacingAr}</p>
          <ol className="mt-2 list-decimal pr-5 text-sm text-slate-700">
            {teacherGuidance.sequenceAr.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </EduCard>
      ) : null}

      <div className="mt-6 space-y-6">
        {sections.map((sec) => (
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
