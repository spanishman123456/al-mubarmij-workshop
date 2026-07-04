import { Link } from "react-router-dom";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import { day02TeacherAnswers } from "../../content/teacher/day02TeacherAnswers";

export default function TeacherDay02AnswersPage() {
  return (
    <PageShell title={day02TeacherAnswers.titleAr} subtitle="للمعلم فقط">
      <Link to="/teacher" className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← لوحة المعلم
      </Link>
      {day02TeacherAnswers.sections.map((sec) => (
        <EduCard key={sec.id} title={`${sec.titleAr} (pdf ${sec.pdfPageIndex})`} className="mb-4" accent="amber">
          {sec.items.map((item, i) => (
            <div key={i} className="mb-2 rounded border border-amber-100 p-2 text-sm">
              <p className="font-bold">{item.q}</p>
              <p>{item.a}</p>
            </div>
          ))}
        </EduCard>
      ))}
    </PageShell>
  );
}
