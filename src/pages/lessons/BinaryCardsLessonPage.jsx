import { Link } from "react-router-dom";
import { binaryCardsLesson as L } from "../../content/lessons/day01/binaryCardsLesson";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import { LessonPractice } from "../../components/lesson/LessonPractice";
import { usePlatform } from "../../context/PlatformContext";

const CARD_VALUES = [16, 8, 4, 2, 1];

export default function BinaryCardsLessonPage() {
  const { user } = usePlatform();

  return (
    <PageShell title={L.titleAr} subtitle="pdfPage 31–32">
      <Link to="/path/day/day-01" className="mb-4 inline-block text-sm font-semibold text-violet-700">← اليوم الأول</Link>

      <EduCard title="ما ستتعلمه">
        <ul className="list-disc pr-5">{L.learningObjectives.map((o) => <li key={o}>{o}</li>)}</ul>
      </EduCard>

      <EduCard title="الشرح" className="mt-4">
        <p className="mb-4 text-slate-700">{L.conceptSimple}</p>
        <div className="flex flex-wrap gap-2">
          {CARD_VALUES.map((v) => (
            <div key={v} className="rounded-lg border-2 border-violet-300 bg-violet-50 px-4 py-3 text-center font-bold">
              {v}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">اقلب البطاقات لتمثيل العدد — الظاهرة = 1، المخفية = 0.</p>
      </EduCard>

      {L.workedExamples.map((ex) => (
        <EduCard key={ex.id} title={ex.titleAr} className="mt-4" accent="emerald">
          <ol className="list-decimal pr-5 text-sm">{ex.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
          <p className="mt-2 font-bold" dir="ltr">{ex.result}₂</p>
        </EduCard>
      ))}

      <EduCard title="تدريب" className="mt-4">
        <LessonPractice exercises={[...L.guidedPractice, ...L.independentPractice]} mode="guided" lessonId={L.id} userId={user?.id} />
      </EduCard>

      <Link to="/lessons/number-systems" className="edu-btn edu-btn-primary mt-6 inline-flex">التالي: أنظمة العد →</Link>
    </PageShell>
  );
}
