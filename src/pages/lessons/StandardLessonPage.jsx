import { Link } from "react-router-dom";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import { LessonPractice } from "../../components/lesson/LessonPractice";
import { LessonProgressFooter } from "../../components/lesson/LessonProgressFooter";
import { usePlatform } from "../../context/PlatformContext";
import { MixedDirectionText, renderMixedDirectionText } from "../../components/MixedDirectionText";

/**
 * قالب درس تفصيلي — يعرض كل أقسام validateLessonContent
 */
export function StandardLessonPage({ lesson: L, subtitle, backTo = "/path/day/day-01", nextLink, children }) {
  const { user } = usePlatform();
  const pdfLabel = L.pdfRefs?.map((r) => r.pdfPageIndex ?? r.pdfPage).join("، ") || "";

  return (
    <PageShell title={L.titleAr} subtitle={subtitle || (pdfLabel ? `pdfPage ${pdfLabel}` : "")}>
      <Link to={backTo} className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← العودة لليوم
      </Link>

      <EduCard title="ما الذي ستتعلمه؟" accent="violet">
        <ul className="list-disc space-y-1 pr-5 text-slate-700">
          {L.learningObjectives.map((o) => (
            <li key={o}>{renderMixedDirectionText(o)}</li>
          ))}
        </ul>
      </EduCard>

      <EduCard title="لماذا نتعلم هذا؟" className="mt-4">
        <p className="text-slate-700">{renderMixedDirectionText(L.whyLearn)}</p>
      </EduCard>

      <EduCard title="المعرفة السابقة" className="mt-4">
        <ul className="list-disc pr-5 text-slate-700">
          {L.prerequisites.map((p) => (
            <li key={p}>{renderMixedDirectionText(p)}</li>
          ))}
        </ul>
      </EduCard>

      <EduCard title="المفهوم الأساسي" className="mt-4">
        <p className="leading-relaxed whitespace-pre-line text-slate-700">{renderMixedDirectionText(L.conceptSimple)}</p>
      </EduCard>

      {L.activityGuide ? (
        <EduCard title={`دليل ${L.lessonKind === "lab" ? "المختبر" : "النشاط"}`} className="mt-4" accent="amber">
          <p className="font-semibold text-slate-800">{renderMixedDirectionText(L.activityGuide.goalAr)}</p>
          <p className="mt-2 text-sm text-slate-600">⏱ <MixedDirectionText text={String(L.activityGuide.estimatedMinutes)} /> دقيقة</p>
          <h3 className="mt-3 font-bold">التعليمات</h3>
          <ul className="list-disc pr-5 text-sm">{L.activityGuide.instructionsAr.map((x) => <li key={x}>{renderMixedDirectionText(x)}</li>)}</ul>
          <h3 className="mt-3 font-bold">خطوات التنفيذ</h3>
          <ol className="list-decimal pr-5 text-sm">{L.activityGuide.executionSteps.map((x) => <li key={x}>{renderMixedDirectionText(x)}</li>)}</ol>
          <p className="mt-3 text-sm"><span className="font-bold">المهمة:</span> {renderMixedDirectionText(L.activityGuide.taskAr)}</p>
          <p className="mt-2 text-sm"><span className="font-bold">معايير النجاح:</span> {renderMixedDirectionText(L.activityGuide.successCriteria.join("؛ "))}</p>
          <p className="mt-2 text-sm text-slate-600">{renderMixedDirectionText(L.activityGuide.reflectionAr)}</p>
        </EduCard>
      ) : null}

      {L.deepSections?.length ? (
        <section className="mt-6 space-y-4">
          <h2 className="text-xl font-bold">شرح تفصيلي</h2>
          {L.deepSections.map((s) => (
            <EduCard key={s.id} title={s.titleAr}>
              <p className="leading-relaxed whitespace-pre-line text-slate-700">{renderMixedDirectionText(s.bodyAr)}</p>
            </EduCard>
          ))}
        </section>
      ) : null}

      <EduCard title="خطوات التعلّم" className="mt-6" accent="cyan">
        <ol className="list-decimal space-y-2 pr-5 text-slate-700">
          {L.stepsDetailed.map((st) => (
            <li key={st.titleAr}>
              <span className="font-semibold">{renderMixedDirectionText(st.titleAr)}</span>
              <span className="text-slate-600"> — {renderMixedDirectionText(st.bodyAr)}</span>
            </li>
          ))}
        </ol>
      </EduCard>

      {L.vocabularyAr?.length || L.terms?.length ? (
        <EduCard title="المصطلحات" className="mt-4" accent="amber">
          <dl className="space-y-2 text-sm">
            {(L.vocabularyAr || L.terms || []).map((t) => (
              <div key={t.term || t.termAr}>
                <dt className="font-bold text-violet-800">{renderMixedDirectionText(t.term || t.termAr)}</dt>
                <dd className="text-slate-600">{renderMixedDirectionText(t.def || t.definitionAr)}</dd>
              </div>
            ))}
          </dl>
        </EduCard>
      ) : null}

      {L.workedExamples?.length ? (
      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-bold">أمثلة محلولة ({L.workedExamples.length})</h2>
        {L.workedExamples.map((ex) => (
          <EduCard key={ex.id} title={ex.titleAr} accent="emerald">
            {ex.code ? (
              <pre className="mb-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-sm text-emerald-300" dir="ltr">
                {ex.code}
              </pre>
            ) : null}
            <ol className="list-decimal space-y-1 pr-5 text-sm text-slate-700">
              {ex.steps.map((st, i) => (
                <li key={i}>{renderMixedDirectionText(st)}</li>
              ))}
            </ol>
            {ex.result ? (
              <p className="mt-2 font-bold text-slate-800" dir="ltr">
                = {renderMixedDirectionText(ex.result)}
              </p>
            ) : null}
          </EduCard>
        ))}
      </section>
      ) : null}

      {L.wrongExamples?.length ? (
        <EduCard title="أمثلة خاطئة — تعلّم من الخطأ" className="mt-6" accent="rose">
          <ul className="space-y-2 text-sm text-slate-700">
            {L.wrongExamples.map((m) => (
              <li key={m.titleAr}>
                <span className="font-semibold">{renderMixedDirectionText(m.titleAr)}:</span> {renderMixedDirectionText(m.bodyAr)}
              </li>
            ))}
          </ul>
        </EduCard>
      ) : null}

      {children}

      {L.commonMistakes?.length ? (
      <EduCard title="أخطاء شائعة" className="mt-6" accent="rose">
        <ul className="space-y-2 text-sm text-slate-700">
          {L.commonMistakes.map((m) => (
            <li key={m.titleAr}>
                <span className="font-semibold">{renderMixedDirectionText(m.titleAr)}:</span> {renderMixedDirectionText(m.bodyAr)}
            </li>
          ))}
        </ul>
      </EduCard>
      ) : null}

      {L.guidedPractice?.length ? (
      <EduCard title="تدريب موجّه" className="mt-6">
        <LessonPractice
          exercises={L.guidedPractice}
          mode="guided"
          lessonId={L.id}
          userId={user?.id}
        />
      </EduCard>
      ) : null}

      {L.independentPractice?.length ? (
      <EduCard title="تدريب مستقل" className="mt-4">
        <LessonPractice
          exercises={L.independentPractice}
          mode="independent"
          lessonId={L.id}
          userId={user?.id}
        />
      </EduCard>
      ) : null}

      {L.quickCheck?.questions?.length ? (
      <EduCard title="تحقق سريع" className="mt-4">
        <ul className="space-y-2 text-sm">
          {L.quickCheck.questions.map((q) => (
            <li key={q.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="font-semibold">{renderMixedDirectionText(q.promptAr)}</p>
              {q.hintAr ? <p className="mt-1 text-xs text-slate-500">تلميح: {renderMixedDirectionText(q.hintAr)}</p> : null}
              <p className="mt-2 text-xs text-violet-700">فكّر في الإجابة ثم ناقشها مع المعلم — الحل لا يُعرض هنا.</p>
            </li>
          ))}
        </ul>
      </EduCard>
      ) : null}

      {L.challengeAr ? (
        <EduCard title="تحدٍ للمتقدمين" className="mt-4" accent="violet">
          <p className="text-sm text-slate-700">{renderMixedDirectionText(L.challengeAr)}</p>
        </EduCard>
      ) : null}

      <EduCard title="ملخص" className="mt-4">
        <p className="text-slate-700">{renderMixedDirectionText(L.summary)}</p>
        {L.linkedActivity ? (
          <Link to={L.linkedActivity} className="mt-3 inline-block text-sm font-semibold text-violet-700 hover:underline">
            نشاط مرتبط →
          </Link>
        ) : null}
      </EduCard>

      {nextLink ? (
        <Link to={nextLink.to} className="edu-btn edu-btn-primary mt-6 inline-flex">
          {nextLink.label}
        </Link>
      ) : null}

      <LessonProgressFooter lessonId={L.id} userId={user?.id} titleAr={L.titleAr} />
    </PageShell>
  );
}
