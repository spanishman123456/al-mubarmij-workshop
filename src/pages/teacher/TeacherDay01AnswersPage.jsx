import { Link } from "react-router-dom";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import { day01TeacherAnswers } from "../../content/teacher/day01TeacherAnswers";

export default function TeacherDay01AnswersPage() {
  return (
    <PageShell title={day01TeacherAnswers.titleAr} subtitle="للمعلم فقط — pdfPageIndex 63, 78, 79, 81…">
      <Link to="/teacher" className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← لوحة المعلم
      </Link>
      <p className="mb-6 text-slate-600">
        هذه الصفحة لا تظهر للطلاب. تتضمن مفاتيح التصحيح والإرشادات من PDF دون نشرها في مسار الطالب.
      </p>
      {day01TeacherAnswers.sections.map((sec) => (
        <EduCard key={sec.id} title={`${sec.titleAr} (pdf ${sec.pdfPageIndex})`} className="mb-4" accent="amber">
          <dl className="space-y-3 text-sm">
            {sec.items.map((item, i) => (
              <div key={i} className="rounded-lg border border-amber-100 bg-amber-50/50 p-3">
                <dt className="font-bold text-slate-800">{item.q}</dt>
                <dd className="mt-1 text-slate-700">{item.a}</dd>
              </div>
            ))}
          </dl>
        </EduCard>
      ))}
    </PageShell>
  );
}
