import { Link } from "react-router-dom";
import { numberSystemsLesson as L } from "../../content/lessons/numberSystemsLesson";
import { usePlatform } from "../../context/PlatformContext";
import { PlaceValueTable } from "../../components/lesson/PlaceValueTable";
import { LessonPractice } from "../../components/lesson/LessonPractice";
import {
  fromBaseToDecimalSteps,
  decimalToBaseSteps,
  isValidInBase,
  binaryToOctalDirect,
  binaryToHexDirect,
} from "../../lib/numberSystems/conversions";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";
import { recordLessonAttemptApi, saveLessonProgressApi } from "../../lib/platformApi";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import { useState } from "react";

function ConverterLab({ userId, lessonId }) {
  const [value, setValue] = useState("68");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
  const [answer, setAnswer] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  let correctResult = null;
  if (fromBase === 10) {
    const r = decimalToBaseSteps(Number(value), toBase);
    if (r.ok) correctResult = r.result;
  } else if (toBase === 10) {
    const r = fromBaseToDecimalSteps(value, fromBase);
    if (r.ok) correctResult = String(r.decimal);
  } else {
    const mid = fromBaseToDecimalSteps(value, fromBase);
    if (mid.ok) correctResult = decimalToBaseSteps(mid.decimal, toBase).result;
  }

  function check() {
    if (!isValidInBase(value, fromBase)) {
      setFeedback("خطأ: رقم غير صالح للأساس المدخل (invalid_digit).");
      return;
    }
    const ok = String(answer).trim().toUpperCase() === String(correctResult).toUpperCase();
    if (ok) {
      setFeedback("✓ صحيح — تم التحقق.");
      recordLessonAttemptApi(userId, { lessonId, exerciseId: "converter", answer, correct: true, hintsUsed: hints });
      saveLessonProgressApi(userId, lessonId, "converter", { value, fromBase, toBase, answer }, false);
      return;
    }
    if (hints === 0) setFeedback("تلميح 1: أنشئ جدول القيمة المكانية أو القسمة المتكررة.");
    else if (hints === 1) setFeedback("تلميح 2: راجع باقي القسمة أو مجموع المنازل — لا تنسَ ترتيب البواقي.");
    else setFeedback(AFTER_MAX_HINTS_AR);
    setHints((h) => h + 1);
    recordLessonAttemptApi(userId, {
      lessonId,
      exerciseId: "converter",
      answer,
      correct: false,
      hintsUsed: hints,
      errorType: hints >= 2 ? "wrong_answer" : "needs_hint",
    });
  }

  return (
    <EduCard title="مثال تفاعلي — محول مع تحقق" accent="cyan">
      <div className="grid gap-3 sm:grid-cols-3">
        <input className="rounded border px-3 py-2" value={value} onChange={(e) => setValue(e.target.value)} dir="ltr" />
        <select className="rounded border px-3 py-2" value={fromBase} onChange={(e) => setFromBase(Number(e.target.value))}>
          {[2, 3, 5, 8, 10, 16].map((b) => (
            <option key={b} value={b}>من {b}</option>
          ))}
        </select>
        <select className="rounded border px-3 py-2" value={toBase} onChange={(e) => setToBase(Number(e.target.value))}>
          {[2, 3, 5, 8, 10, 16].map((b) => (
            <option key={b} value={b}>إلى {b}</option>
          ))}
        </select>
      </div>
      {fromBase === 10 ? (
        <div className="mt-4">
          <PlaceValueTable value={value} base={toBase} mode="fromDecimal" titleAr="جدول القسمة المتكررة" />
        </div>
      ) : toBase === 10 ? (
        <div className="mt-4">
          <PlaceValueTable value={value} base={fromBase} mode="toDecimal" titleAr="جدول القيمة المكانية" />
        </div>
      ) : null}
      <div className="mt-3 flex gap-2">
        <input className="rounded border px-3 py-2" value={answer} onChange={(e) => setAnswer(e.target.value)} dir="ltr" />
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={check}>تحقق</button>
      </div>
      {feedback ? <p className="mt-2 text-sm">{feedback}</p> : null}
    </EduCard>
  );
}

export default function NumberSystemsLessonPage() {
  const { user } = usePlatform();

  return (
    <PageShell title={L.titleAr} subtitle="شرح كامل — pdfPage 32–34, 77–78">
      <Link to="/path/day/day-01" className="mb-4 inline-block text-sm font-semibold text-violet-700">← اليوم الأول</Link>

      <EduCard title="ما الذي ستتعلمه؟" accent="violet">
        <ul className="list-disc space-y-1 pr-5 text-slate-700">{L.learningObjectives.map((o) => <li key={o}>{o}</li>)}</ul>
      </EduCard>

      <EduCard title="لماذا نتعلم هذا؟" className="mt-4"><p className="text-slate-700">{L.whyLearn}</p></EduCard>
      <EduCard title="المعرفة السابقة" className="mt-4"><ul className="list-disc pr-5">{L.prerequisites.map((p) => <li key={p}>{p}</li>)}</ul></EduCard>
      <EduCard title="المفهوم الأساسي" className="mt-4"><p className="leading-relaxed text-slate-700">{L.conceptSimple}</p></EduCard>

      <section className="mt-6 space-y-4">
        <h2 className="text-xl font-bold">شرح تفصيلي</h2>
        {L.deepSections.map((s) => (
          <EduCard key={s.id} title={s.titleAr}>
            <p className="text-slate-700 leading-relaxed">{s.bodyAr}</p>
          </EduCard>
        ))}
      </section>

      <EduCard title="جدول الأنظمة" className="mt-6">
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="py-2">النظام</th><th>الأساس</th><th>الرموز</th><th>لماذا؟</th></tr></thead>
          <tbody>
            {L.systemsTable.map((r) => (
              <tr key={r.base} className="border-b border-slate-100">
                <td className="py-2">{r.nameAr}</td><td>{r.base}</td><td dir="ltr">{r.digits}</td><td className="text-slate-600">{r.whyAr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </EduCard>

      <section className="mt-8 space-y-6">
        <h2 className="text-xl font-bold">أمثلة محلولة ({L.workedExamples.length}) — مع جدول القيمة المكانية</h2>
        {L.workedExamples.map((ex) => (
          <EduCard key={ex.id} title={`${ex.titleAr} [${ex.difficulty}]`} accent="emerald">
            {ex.placeValue ? (
              <PlaceValueTable
                value={ex.placeValue.value}
                base={ex.placeValue.base}
                mode={ex.placeValue.mode}
              />
            ) : null}
            <ol className="mt-3 list-decimal space-y-1 pr-5 text-sm">{ex.steps.map((st, i) => <li key={i}>{st}</li>)}</ol>
            {ex.result ? <p className="mt-2 font-bold" dir="ltr">= {ex.result}</p> : null}
          </EduCard>
        ))}
      </section>

      <div className="mt-8"><ConverterLab userId={user?.id} lessonId={L.id} /></div>

      <EduCard title="أخطاء شائعة ونوع الخطأ" className="mt-6" accent="amber">
        <ul className="space-y-2 text-sm">{L.commonMistakes.map((m) => (
          <li key={m.titleAr}><strong>{m.titleAr}</strong> ({m.step}): {m.bodyAr}</li>
        ))}</ul>
      </EduCard>

      <EduCard title="تدريب موجّه (5)" className="mt-6">
        <LessonPractice exercises={L.guidedPractice} mode="guided" lessonId={L.id} userId={user?.id} />
      </EduCard>

      <EduCard title="تدريب مستقل (6)" className="mt-6">
        <LessonPractice exercises={L.independentPractice} mode="independent" lessonId={L.id} userId={user?.id} />
      </EduCard>

      <EduCard title="ملخص + النشاط التالي" className="mt-6">
        <p className="text-slate-700">{L.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={L.linkedActivity} className="edu-btn edu-btn-outline inline-flex">محاكاة المحوّل</Link>
          <Link to="/lessons/hex-colors" className="edu-btn edu-btn-primary inline-flex">التالي: ألوان Hex →</Link>
        </div>
      </EduCard>
    </PageShell>
  );
}
