import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import { fetchTeacherDay05AnswersApi } from "../../lib/platformApi";
import { day05TeacherAnswers } from "../../content/teacher/day05TeacherAnswers";

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

export default function TeacherDay05AnswersPage() {
  const [data, setData] = useState(day05TeacherAnswers);

  useEffect(() => {
    let cancelled = false;
    fetchTeacherDay05AnswersApi()
      .then((res) => {
        if (!cancelled && res?.sections?.length) setData(res);
      })
      .catch(() => {
        /* fallback to local content */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { titleAr, teacherGuidance, sections } = data;

  return (
    <PageShell title={titleAr} subtitle="للمعلم فقط — pdfPage 253–294">
      <Link to="/teacher" className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← لوحة المعلم
      </Link>

      {teacherGuidance ? (
        <EduCard
          key="teacher-guidance-top"
          title={`${teacherGuidance.titleAr} (pdf ${teacherGuidance.pdfPageIndex})`}
          className="mb-4"
          accent="violet"
        >
          {teacherGuidance.overviewAr ? <p className="mb-2 text-sm text-slate-800">{teacherGuidance.overviewAr}</p> : null}
          {teacherGuidance.pacingAr ? (
            <p className="mb-2 text-sm text-slate-700">
              <span className="font-semibold">الإيقاع: </span>
              {teacherGuidance.pacingAr}
            </p>
          ) : null}
          {teacherGuidance.sequenceAr?.length ? (
            <ol className="mb-2 list-decimal pr-5 text-sm text-slate-700">
              {teacherGuidance.sequenceAr.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          ) : null}
        </EduCard>
      ) : null}

      {sections.map((sec) => (
        <EduCard key={sec.id} title={`${sec.titleAr} (pdf ${sec.pdfPageIndex})`} className="mb-4" accent="amber">
          {sec.lessonRoute ? (
            <p className="mb-2 text-xs text-violet-700">
              الدرس: <code dir="ltr">{sec.lessonRoute}</code>
            </p>
          ) : null}
          {sec.items.map((item, i) => (
            <TeacherItem key={i} item={item} />
          ))}
        </EduCard>
      ))}
    </PageShell>
  );
}
