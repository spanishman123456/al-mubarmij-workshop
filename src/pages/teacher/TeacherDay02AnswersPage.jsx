import { Link } from "react-router-dom";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import { day02TeacherAnswers } from "../../content/teacher/day02TeacherAnswers";

export default function TeacherDay02AnswersPage() {
  return (
    <PageShell title={day02TeacherAnswers.titleAr} subtitle="للمعلم فقط — pdfPage 93–150">
      <Link to="/teacher" className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← لوحة المعلم
      </Link>
      {day02TeacherAnswers.sections.map((sec) => (
        <EduCard key={sec.id} title={`${sec.titleAr} (pdf ${sec.pdfPageIndex})`} className="mb-4" accent="amber">
          {sec.lessonRoute ? (
            <p className="mb-2 text-xs text-violet-700">
              الدرس: <code dir="ltr">{sec.lessonRoute}</code>
            </p>
          ) : null}
          {sec.items.map((item, i) => (
            <div key={i} className="mb-3 rounded border border-amber-100 bg-amber-50/50 p-3 text-sm">
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
          ))}
        </EduCard>
      ))}
    </PageShell>
  );
}
