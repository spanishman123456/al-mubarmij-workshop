import { Link } from "react-router-dom";
import { binaryCardsLesson as L } from "../../content/lessons/day01/binaryCardsLesson";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import { BinaryCardsLab } from "../../components/lesson/BinaryCardsLab";
import { LessonProgressFooter } from "../../components/lesson/LessonProgressFooter";
import { usePlatform } from "../../context/PlatformContext";
import { ArabicText, BinaryValue } from "../../components/BilingualTextBlocks";
import { renderMixedDirectionText } from "../../components/MixedDirectionText";

const CARD_EXERCISES = [
  { id: "g1", target: 5, promptAr: "مثّل العدد 5" },
  { id: "g2", target: 13, promptAr: "مثّل العدد 13" },
  { id: "i1", target: 10, promptAr: "مثّل العدد 10" },
  { id: "i2", target: 7, promptAr: "مثّل العدد 7" },
];

export default function BinaryCardsLessonPage() {
  const { user } = usePlatform();

  return (
    <PageShell title={L.titleAr} subtitle="pdfPage 31–32">
      <Link to="/path/day/day-01" className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← اليوم الأول
      </Link>

      <EduCard title="ما ستتعلمه">
        <ul className="list-disc pr-5">{L.learningObjectives.map((o) => <li key={o}>{renderMixedDirectionText(o)}</li>)}</ul>
      </EduCard>

      <EduCard title="الشرح" className="mt-4">
        <ArabicText text={L.conceptSimple} className="mb-4 text-slate-700" />
        {L.deepSections?.map((s) => (
          <div key={s.id} className="mb-3 rounded-lg border border-violet-100 bg-violet-50/50 p-3 text-sm">
            <p className="font-bold text-violet-900">{s.titleAr}</p>
            <ArabicText text={s.bodyAr} className="mt-1 text-slate-700" />
          </div>
        ))}
        <p className="text-sm text-slate-600">
          البطاقات الخمس تمثل القيم 16، 8، 4، 2، 1. في النشاط التفاعلي أدناه يمكنك قلبها — الظاهرة = 1،
          المخفية = 0.
        </p>
      </EduCard>

      <EduCard title="أمثلة محلولة" className="mt-4" accent="emerald">
        {L.workedExamples.map((ex) => (
          <div key={ex.id} className="mb-4 border-b border-emerald-100 pb-4 last:mb-0 last:border-0 last:pb-0">
            <p className="font-bold text-emerald-900">{ex.titleAr}</p>
            <ol className="mt-2 list-decimal pr-5 text-sm text-slate-700">
              {ex.steps.map((s, i) => (
                <li key={i}>{renderMixedDirectionText(s)}</li>
              ))}
            </ol>
            <BinaryValue value={`${ex.result}₂`} className="mt-2 font-bold" />
          </div>
        ))}
      </EduCard>

      <EduCard title="جرّب بنفسك" className="mt-4" accent="violet">
        <BinaryCardsLab lessonId={L.id} userId={user?.id} exercises={CARD_EXERCISES} />
      </EduCard>

      <Link to="/lessons/number-systems" className="edu-btn edu-btn-primary mt-6 inline-flex">
        التالي: أنظمة العد →
      </Link>

      <LessonProgressFooter lessonId={L.id} userId={user?.id} titleAr={L.titleAr} />
    </PageShell>
  );
}
