import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { getDayById } from "../data/curriculum15Days";
import { usePlatform } from "../context/PlatformContext";
import { PageShell, EduCard } from "../components/layout/PageShell";
import {
  canStudentAccessDayContent,
  getStudentDayState,
  DAY_SCHEDULE_MESSAGE_AR,
  DAY_LOCKED_MESSAGE_AR,
  DayStudentState,
  TEACHER_PREVIEW_BADGE_AR,
  isTeacherRole,
  isCurriculumDayPublished,
  resolvePublishedDaysForRole,
} from "../config/publication";

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
  const { user, markDayComplete, myProgress, myStats } = usePlatform();
  const [completeError, setCompleteError] = useState(null);
  const [completing, setCompleting] = useState(false);
  const dayUnlock = myStats?.dayUnlock?.dayCompletions?.[dayId];
  const dayUnlockMap = myStats?.dayUnlock?.dayUnlockMap;
  const studentState = getStudentDayState(dayId, dayUnlockMap);
  const isTeacher = isTeacherRole(user?.role);
  const studentPublished = isCurriculumDayPublished(dayId, resolvePublishedDaysForRole("student", myStats));
  const done = dayUnlock?.completed || myProgress?.completedDays?.includes(dayId);
  const incomplete = dayUnlock?.incompleteItems || [];

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

  if (user?.role === "student" && !canStudentAccessDayContent(dayId, dayUnlockMap, myStats)) {
    const locked = studentState === DayStudentState.LOCKED;
    return (
      <PageShell
        title={locked ? "اليوم مقفل" : "المحتوى غير متاح بعد"}
        badge={locked ? "المسار التعليمي" : "الجدول التدريبي"}
      >
        <EduCard accent="amber">
          <p className="text-lg font-semibold text-slate-800">
            {locked ? DAY_LOCKED_MESSAGE_AR : DAY_SCHEDULE_MESSAGE_AR}
          </p>
          <Link to="/path" className="edu-btn edu-btn-outline mt-4 inline-flex">
            العودة للمسار
          </Link>
        </EduCard>
      </PageShell>
    );
  }

  async function handleCompleteDay() {
    setCompleteError(null);
    setCompleting(true);
    const res = await markDayComplete(dayId);
    setCompleting(false);
    if (!res?.ok) {
      setCompleteError(res?.incompleteItems?.length ? res.incompleteItems : [{ labelAr: res?.error || "تعذّر الإكمال" }]);
    }
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

      {isTeacher && !studentPublished ? (
        <EduCard className="mb-6" accent="amber">
          <p className="font-semibold text-amber-900">{TEACHER_PREVIEW_BADGE_AR}</p>
          <p className="mt-2 text-sm text-amber-800">
            أنت تعرض هذا اليوم كمعلم. الطلاب لا يرونه حتى يُنشر وفق سياسة النشر وفتح الأيام.
          </p>
        </EduCard>
      ) : null}

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
            <EduCard title="دروس اليوم الثاني — ✅ مكتمل" accent="violet">
              <p className="mb-2 text-sm text-emerald-800">راجع <code className="text-xs">docs/day02-coverage-status.md</code></p>
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

          {day.id === "day-03" ? (
            <EduCard title="دروس اليوم الثالث" accent="cyan">
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <Link to="/lessons/python-constants">1. الثوابت</Link>
                <Link to="/lessons/python-multi-arrays">2. مصفوفات متعددة الأبعاد</Link>
                <Link to="/lessons/python-break-continue">3. break / continue / pass / else</Link>
                <Link to="/lessons/divisors-activity">4. نشاط المقسومات</Link>
                <Link to="/lessons/numbers-steps-activity">5. نشاط الأرقام والخطوات</Link>
                <Link to="/lessons/collatz">6. تخمين Collatz</Link>
                <Link to="/lessons/truth-tables">7. جداول الحقيقة</Link>
                <Link to="/lessons/logic-gates">8. البوابات المنطقية</Link>
              </div>
            </EduCard>
          ) : null}

          {day.id === "day-04" ? (
            <EduCard title="دروس اليوم الرابع" accent="violet">
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <Link to="/lessons/karnaugh-maps">1. خريطة كارنوف</Link>
                <Link to="/lessons/logic-equivalence">2. الاقترانات المنطقية والمكافئات</Link>
                <Link to="/lessons/python-tuples">3. الحقول المترابطة (Tuples)</Link>
                <Link to="/lessons/nested-loops-lab">4. الحلقات المتداخلة</Link>
              </div>
            </EduCard>
          ) : null}

          {day.id === "day-05" ? (
            <EduCard title="دروس اليوم الخامس" accent="violet">
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <Link to="/lessons/linear-search">1. البحث الخطي</Link>
                <Link to="/lessons/binary-search">2. البحث الثنائي</Link>
                <Link to="/lessons/sorting-algorithms">3. فرز الاختيار (Selection Sort)</Link>
                <Link to="/lessons/sieve-primes">4. غربال إراتوستينس</Link>
              </div>
            </EduCard>
          ) : null}

          {day.id === "day-06" ? (
            <EduCard title="دروس اليوم السادس" accent="violet">
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <Link to="/lessons/caesar-cipher">1. شفرة قيصر وعلم التشفير</Link>
                <Link to="/lessons/memory-hierarchy">2. الذاكرة والتخزين المؤقت</Link>
                <Link to="/lessons/cpu-scheduling">3. جدولة عمليات المعالج</Link>
              </div>
            </EduCard>
          ) : null}

          {day.id === "day-07" ? (
            <EduCard title="دروس اليوم السابع" accent="violet">
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <Link to="/lessons/python-scope">1. نطاق المتغيرات (Scope)</Link>
                <Link to="/lessons/dice-random">2. رمي النرد والعشوائية</Link>
                <Link to="/lessons/tic-tac-toe">3. تيك-تاك-تو</Link>
                <Link to="/lessons/game-planning">4. التخطيط التعاوني للألعاب</Link>
              </div>
            </EduCard>
          ) : null}

          {day.id === "day-08" ? (
            <EduCard title="دروس اليوم الثامن" accent="violet">
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <Link to="/lessons/fibonacci-sequence">1. متتالية فيبوناتشي</Link>
                <Link to="/lessons/algorithm-complexity">2. تعقيد الخوارزميات (Big-O)</Link>
                <Link to="/lessons/tower-of-hanoi">3. برج هانوي</Link>
                <Link to="/lessons/python-files-io">4. الملفات في بايثون</Link>
              </div>
            </EduCard>
          ) : null}

          {day.id === "day-09" ? (
            <EduCard title="دروس اليوم التاسع" accent="violet">
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <Link to="/lessons/python-recursion">1. الاستدعاء الذاتي</Link>
                <Link to="/lessons/fractals-intro">2. الكسوريات والتشابه الذاتي</Link>
                <Link to="/lessons/koch-snowflake">3. ندفة Koch</Link>
                <Link to="/lessons/sierpinski-triangle">4. مثلث Sierpinski</Link>
              </div>
            </EduCard>
          ) : null}

          {day.id === "day-10" ? (
            <EduCard title="دروس اليوم العاشر" accent="violet">
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <Link to="/lessons/oop-foundations">1. البرمجة كائنية التوجه</Link>
                <Link to="/lessons/steganography-python">2. إخفاء المعلومات</Link>
                <Link to="/lessons/fractal-tree-recursion">3. الشجرة الهندسية المتكررة</Link>
                <Link to="/lessons/locker-pascal-problem">4. مشكلة الخزانة ومثلث باسكال</Link>
              </div>
            </EduCard>
          ) : null}

          {day.id === "day-11" ? (
            <EduCard title="دروس اليوم الحادي عشر" accent="violet">
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <Link to="/lessons/ai-foundations">1. مقدمة الذكاء الاصطناعي</Link>
                <Link to="/lessons/machine-learning-basics">2. أساسيات التعلم الآلي</Link>
                <Link to="/lessons/ai-ethics-safety">3. أخلاقيات الذكاء الاصطناعي</Link>
                <Link to="/lessons/ai-research-presentation">4. البحث والعرض في الذكاء الاصطناعي</Link>
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
                <div className="space-y-3">
                  {!done && incomplete.length > 0 ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                      <p className="font-bold text-amber-900">بقي عليك لإكمال هذا اليوم:</p>
                      <ul className="mt-2 space-y-1 pr-4">
                        {incomplete.map((item) => (
                          <li key={item.id} className="text-amber-900">
                            ○ {item.labelAr}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {completeError?.length ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                      {completeError.map((item) => (
                        <p key={item.id || item.labelAr}>○ {item.labelAr}</p>
                      ))}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    disabled={done || completing}
                    onClick={handleCompleteDay}
                    className="edu-btn edu-btn-primary w-full text-sm disabled:opacity-50"
                    data-testid="complete-day-btn"
                  >
                    {done ? "تم إكمال اليوم ✓" : completing ? "جاري الحفظ…" : "إكمال اليوم وفتح اليوم التالي"}
                  </button>
                </div>
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
