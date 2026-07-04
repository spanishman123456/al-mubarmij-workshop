import { Link, useParams } from "react-router-dom";
import { getDayById } from "../data/curriculum15Days";
import { usePlatform } from "../context/PlatformContext";
import { PageShell, EduCard } from "../components/layout/PageShell";

const SIM_LINKS = {
  "number-converter": "/simulations#number-converter",
  "binary-calculator": "/simulations#binary-calc",
  "truth-table": "/simulations#truth",
  "logic-gates": "/simulations#gates",
  "logic-circuit": "/simulations#circuit",
  karnaugh: "/simulations#karnaugh",
  "caesar-cipher": "/simulations#caesar",
  "search-sort": "/simulations#search",
};

const SIM_LABELS = {
  "number-converter": "محوّل الأنظمة",
  "binary-calculator": "حاسبة ثنائية",
  "truth-table": "جدول الحقيقة",
  "logic-gates": "البوابات المنطقية",
  "logic-circuit": "دوائر منطقية",
  karnaugh: "خريطة كارنوف",
  "caesar-cipher": "تشفير قيصر",
  "search-sort": "بحث وفرز",
};

export default function DayLessonPage() {
  const { dayId } = useParams();
  const day = getDayById(dayId);
  const { user, markDayComplete, myProgress } = usePlatform();
  const done = myProgress?.completedDays?.includes(dayId);

  if (!day) {
    return (
      <PageShell title="الدرس">
        <EduCard>
          <Link to="/path" className="edu-btn edu-btn-outline inline-flex">
            العودة للمسار
          </Link>
        </EduCard>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={day.titleAr}
      subtitle={day.summaryAr}
      badge={`الأسبوع ${day.weekNumber} — اليوم ${day.dayNumber}`}
    >
      <Link to="/path" className="mb-6 inline-flex text-sm font-semibold text-violet-700 hover:text-violet-900">
        ← المسار الدراسي
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <EduCard title="الأهداف التعليمية" accent="violet">
            <ul className="mt-3 list-disc space-y-2 pr-5 text-slate-700">
              {day.objectivesAr.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </EduCard>

          <EduCard title="المفاهيم الأساسية" accent="cyan">
            <div className="mt-3 flex flex-wrap gap-2">
              {day.conceptsAr.map((c) => (
                <span key={c} className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800">
                  {c}
                </span>
              ))}
            </div>
          </EduCard>

          {day.sections.map((sec) => (
            <EduCard key={sec.titleAr} title={sec.titleAr}>
              <p className="mt-2 leading-relaxed text-slate-700">{sec.bodyAr}</p>
            </EduCard>
          ))}

          {day.id === "day-01" ? (
            <>
              <EduCard title="دروس اليوم الأول — شرح تفصيلي" accent="violet">
                <div className="mt-2 flex flex-col gap-2">
                  <Link to="/lessons/binary-cards" className="text-sm font-semibold text-violet-700 hover:underline">
                    1. بطاقات الأرقام الثنائية (pdfPageIndex 31–32) →
                  </Link>
                  <Link to="/lessons/binary-puzzle" className="text-sm font-semibold text-violet-700 hover:underline">
                    2. أحجية الأرقام الثنائية (pdfPageIndex 70–76) →
                  </Link>
                  <Link to="/lessons/number-systems" className="text-sm font-semibold text-violet-700 hover:underline">
                    3. أنظمة العد والتحويل →
                  </Link>
                  <Link to="/lessons/binary-matching" className="text-sm font-semibold text-violet-700 hover:underline">
                    4. بطاقات المطابقة (pdfPageIndex 81–82) →
                  </Link>
                  <Link to="/lessons/python-intro" className="text-sm font-semibold text-violet-700 hover:underline">
                    5. مقدمة بايثون →
                  </Link>
                  <Link to="/lessons/string-splitting" className="text-sm font-semibold text-violet-700 hover:underline">
                    6. تقسيم سلاسل الرموز →
                  </Link>
                  <Link to="/lessons/ascii-unicode" className="text-sm font-semibold text-violet-700 hover:underline">
                    7. ASCII و Unicode →
                  </Link>
                  <Link to="/lessons/hex-puzzle" className="text-sm font-semibold text-violet-700 hover:underline">
                    8. أحجية hex →
                  </Link>
                  <Link to="/lessons/hex-colors" className="text-sm font-semibold text-violet-700 hover:underline">
                    9. ألوان Hex و RGB →
                  </Link>
                  <Link to="/quizzes/run/quiz-pre" className="text-sm font-semibold text-amber-700 hover:underline">
                    التقويم القبلي →
                  </Link>
                </div>
              </EduCard>
            </>
          ) : null}

          {day.id === "day-02" ? (
            <EduCard title="دروس اليوم الثاني — ⏳ غير مكتمل" accent="violet">
              <p className="mb-2 text-sm text-amber-800">راجع <code className="text-xs">docs/day02-coverage-status.md</code></p>
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <Link to="/lessons/conversions-intro">1. تمهيد: تحويلات + ASCII</Link>
                <Link to="/lessons/base-arithmetic">2. الحساب في الأنظمة</Link>
                <Link to="/lessons/twos-complement">3. مكمل العدد 2</Link>
                <Link to="/lessons/floating-point">4. الفاصلة العائمة</Link>
                <Link to="/lessons/radix-practice">5. تطبيقات الأساس</Link>
                <Link to="/lessons/card-sort-algorithm">6. فرز البطاقات</Link>
                <Link to="/lessons/algorithms">7. الخوارزميات</Link>
                <Link to="/lessons/python-arrays">8. المصفوفات/القوائم</Link>
                <Link to="/lessons/python-for-range">9. for و range</Link>
                <Link to="/lessons/python-while">10. while</Link>
                <Link to="/lessons/sentence-reference">11. الدليل المرجعي</Link>
                <Link to="/lessons/if-statement">12. جمل If</Link>
                <Link to="/lessons/day02-computer-lab">13. مختبر 60 دقيقة</Link>
              </div>
            </EduCard>
          ) : null}

          <EduCard title="تطبيق عملي" accent="emerald">
            <p className="mt-2 text-slate-700">{day.practicalAr}</p>
            {day.exerciseIds?.length ? (
              <Link to={`/python?ex=${day.exerciseIds[0]}`} className="edu-btn edu-btn-primary mt-4 inline-flex text-sm">
                افتح التمرين في مختبر بايثون
              </Link>
            ) : null}
          </EduCard>
        </div>

        <div className="space-y-6">
          <EduCard title="أنشطة تفاعلية" accent="amber">
            <ul className="mt-3 list-disc space-y-2 pr-5 text-sm text-slate-700">
              {day.activitiesAr.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </EduCard>

          {day.simulationIds?.length ? (
            <EduCard title="محاكاة مرتبطة" accent="violet">
              <div className="mt-3 flex flex-col gap-2">
                {day.simulationIds.map((sid) => (
                  <Link
                    key={sid}
                    to={SIM_LINKS[sid] || "/simulations"}
                    className="rounded-lg bg-pink-50 px-3 py-2 text-sm font-semibold text-pink-800 hover:bg-pink-100"
                  >
                    {SIM_LABELS[sid] ?? sid} →
                  </Link>
                ))}
              </div>
            </EduCard>
          ) : null}

          <EduCard title="موارد الدرس">
            <div className="mt-3 flex flex-col gap-2">
              {day.worksheetId ? (
                <Link to={`/worksheets/${day.worksheetId}`} className="edu-btn edu-btn-outline text-sm">
                  ورقة العمل
                </Link>
              ) : null}
              {day.quizId ? (
                <Link to={`/quizzes/run/${day.quizId}`} className="edu-btn edu-btn-outline text-sm">
                  اختبار قصير
                </Link>
              ) : null}
              {user?.role === "student" ? (
                <button
                  type="button"
                  disabled={done}
                  onClick={() => markDayComplete(dayId)}
                  className="edu-btn edu-btn-primary text-sm disabled:opacity-50"
                >
                  {done ? "تم إكمال اليوم ✓" : "أتممت هذا اليوم"}
                </button>
              ) : null}
            </div>
          </EduCard>

          <EduCard title="ملخص نهاية اليوم" accent="emerald">
            <p className="mt-2 text-slate-700">{day.daySummaryAr}</p>
          </EduCard>
        </div>
      </div>
    </PageShell>
  );
}
