import { Link } from "react-router-dom";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import { day03TeacherAnswers } from "../../content/teacher/day03TeacherAnswers";

export default function TeacherDay03AnswersPage() {
  return (
    <PageShell title={day03TeacherAnswers.titleAr} subtitle="للمعلم فقط — pdfPage ~152–174">
      <Link to="/teacher" className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← لوحة المعلم
      </Link>
      {day03TeacherAnswers.sections.map((sec) => (
        <EduCard key={sec.id} title={sec.titleAr} className="mb-4" accent="amber">
          {sec.guidanceAr ? <p className="mb-3 text-sm text-violet-800">📋 {sec.guidanceAr}</p> : null}
          {sec.answers.map((item, i) => (
            <div key={i} className="mb-3 rounded border border-amber-100 bg-amber-50/50 p-3 text-sm">
              <p className="font-bold">{item.q}</p>
              <p className="mt-1 text-emerald-800">الإجابة: {item.a}</p>
            </div>
          ))}
        </EduCard>
      ))}
    </PageShell>
  );
}
