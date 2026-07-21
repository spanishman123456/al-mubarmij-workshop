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

const DAY_LESSON_SECTIONS = {
  "day-01": {
    title: "دروس اليوم الأول — شرح تفصيلي",
    accent: "violet",
    lessons: [
      { to: "/lessons/binary-cards", label: "1. بطاقات الأرقام الثنائية" },
      { to: "/lessons/binary-puzzle", label: "2. أحجية الأرقام الثنائية" },
      { to: "/lessons/number-systems", label: "3. أنظمة العد والتحويل" },
      { to: "/lessons/binary-matching", label: "4. بطاقات المطابقة" },
      { to: "/lessons/python-intro", label: "5. مقدمة بايثون" },
      { to: "/lessons/string-splitting", label: "6. تقسيم سلاسل الرموز" },
      { to: "/lessons/ascii-unicode", label: "7. ASCII و Unicode" },
      { to: "/lessons/hex-puzzle", label: "8. أحجية Hex" },
      { to: "/lessons/hex-colors", label: "9. ألوان Hex و RGB" },
    ],
    extras: [{ to: "/quizzes/run/quiz-pre", label: "التقويم القبلي" }],
  },
  "day-02": {
    title: "دروس اليوم الثاني",
    accent: "violet",
    lessons: [
      { to: "/lessons/conversions-intro", label: "1. تمهيد: تحويلات + ASCII" },
      { to: "/lessons/base-arithmetic", label: "2. الحساب في الأنظمة" },
      { to: "/lessons/twos-complement", label: "3. مكمل العدد 2" },
      { to: "/lessons/floating-point", label: "4. الفاصلة العائمة" },
      { to: "/lessons/radix-practice", label: "5. تطبيقات الأساس" },
      { to: "/lessons/card-sort-algorithm", label: "6. فرز البطاقات" },
      { to: "/lessons/algorithms", label: "7. الخوارزميات" },
      { to: "/lessons/python-arrays", label: "8. المصفوفات/القوائم" },
      { to: "/lessons/python-for-range", label: "9. for و range" },
      { to: "/lessons/python-while", label: "10. while" },
      { to: "/lessons/sentence-reference", label: "11. الدليل المرجعي" },
      { to: "/lessons/if-statement", label: "12. جمل If" },
      { to: "/lessons/day02-computer-lab", label: "13. مختبر 60 دقيقة" },
    ],
  },
  "day-03": {
    title: "دروس اليوم الثالث",
    accent: "cyan",
    lessons: [
      { to: "/lessons/python-constants", label: "1. الثوابت" },
      { to: "/lessons/python-multi-arrays", label: "2. مصفوفات متعددة الأبعاد" },
      { to: "/lessons/python-break-continue", label: "3. break / continue / pass / else" },
      { to: "/lessons/divisors-activity", label: "4. نشاط المقسومات" },
      { to: "/lessons/numbers-steps-activity", label: "5. نشاط الأرقام والخطوات" },
      { to: "/lessons/collatz", label: "6. تخمين Collatz" },
      { to: "/lessons/truth-tables", label: "7. جداول الحقيقة" },
      { to: "/lessons/logic-gates", label: "8. البوابات المنطقية" },
    ],
  },
  "day-04": {
    title: "دروس اليوم الرابع",
    accent: "violet",
    lessons: [
      { to: "/lessons/karnaugh-maps", label: "1. خريطة كارنوف" },
      { to: "/lessons/logic-equivalence", label: "2. الاقترانات المنطقية والمكافئات" },
      { to: "/lessons/python-tuples", label: "3. الحقول المترابطة (Tuples)" },
      { to: "/lessons/nested-loops-lab", label: "4. الحلقات المتداخلة" },
    ],
  },
  "day-05": {
    title: "دروس اليوم الخامس",
    accent: "violet",
    lessons: [
      { to: "/lessons/linear-search", label: "1. البحث الخطي" },
      { to: "/lessons/binary-search", label: "2. البحث الثنائي" },
      { to: "/lessons/sorting-algorithms", label: "3. فرز الاختيار (Selection Sort)" },
      { to: "/lessons/sieve-primes", label: "4. غربال إراتوستينس" },
    ],
  },
  "day-06": {
    title: "دروس اليوم السادس",
    accent: "violet",
    lessons: [
      { to: "/lessons/caesar-cipher", label: "1. شفرة قيصر وعلم التشفير" },
      { to: "/lessons/memory-hierarchy", label: "2. الذاكرة والتخزين المؤقت" },
      { to: "/lessons/cpu-scheduling", label: "3. جدولة عمليات المعالج" },
    ],
  },
  "day-07": {
    title: "دروس اليوم السابع",
    accent: "violet",
    lessons: [
      { to: "/lessons/python-scope", label: "1. نطاق المتغيرات (Scope)" },
      { to: "/lessons/dice-random", label: "2. رمي النرد والعشوائية" },
      { to: "/lessons/tic-tac-toe", label: "3. تيك-تاك-تو" },
      { to: "/lessons/game-planning", label: "4. التخطيط التعاوني للألعاب" },
    ],
  },
  "day-08": {
    title: "دروس اليوم الثامن",
    accent: "violet",
    lessons: [
      { to: "/lessons/fibonacci-sequence", label: "1. متتالية فيبوناتشي" },
      { to: "/lessons/algorithm-complexity", label: "2. تعقيد الخوارزميات (Big-O)" },
      { to: "/lessons/tower-of-hanoi", label: "3. برج هانوي" },
      { to: "/lessons/python-files-io", label: "4. الملفات في بايثون" },
    ],
  },
  "day-09": {
    title: "دروس اليوم التاسع",
    accent: "violet",
    lessons: [
      { to: "/lessons/python-recursion", label: "1. الاستدعاء الذاتي" },
      { to: "/lessons/fractals-intro", label: "2. الكسوريات والتشابه الذاتي" },
      { to: "/lessons/koch-snowflake", label: "3. ندفة Koch" },
      { to: "/lessons/sierpinski-triangle", label: "4. مثلث Sierpinski" },
    ],
  },
  "day-10": {
    title: "دروس اليوم العاشر",
    accent: "violet",
    lessons: [
      { to: "/lessons/oop-foundations", label: "1. البرمجة كائنية التوجه" },
      { to: "/lessons/steganography-python", label: "2. إخفاء المعلومات" },
      { to: "/lessons/fractal-tree-recursion", label: "3. الشجرة الهندسية المتكررة" },
      { to: "/lessons/locker-pascal-problem", label: "4. مشكلة الخزانة ومثلث باسكال" },
    ],
  },
  "day-11": {
    title: "دروس اليوم الحادي عشر",
    accent: "violet",
    lessons: [
      { to: "/lessons/ai-foundations", label: "1. مقدمة الذكاء الاصطناعي" },
      { to: "/lessons/machine-learning-basics", label: "2. أساسيات التعلم الآلي" },
      { to: "/lessons/ai-ethics-safety", label: "3. أخلاقيات الذكاء الاصطناعي" },
      { to: "/lessons/ai-research-presentation", label: "4. البحث والعرض في الذكاء الاصطناعي" },
    ],
  },
  "day-12": {
    title: "دروس اليوم الثاني عشر",
    accent: "violet",
    lessons: [
      { to: "/lessons/regex-automata", label: "1. التعبيرات العادية وآلات الحالة" },
      { to: "/lessons/dfa-nfa-design", label: "2. الفرق بين DFA و NFA" },
      { to: "/lessons/p-vs-np-intro", label: "3. مقدمة P و NP" },
      { to: "/lessons/graph-theory-basics", label: "4. أساسيات نظرية المخططات" },
    ],
  },
  "day-13": {
    title: "دروس اليوم الثالث عشر",
    accent: "violet",
    lessons: [
      { to: "/lessons/comprehensive-review", label: "1. مراجعة شاملة" },
      { to: "/lessons/post-assessment-readiness", label: "2. التقويم البعدي" },
      { to: "/lessons/project-ideation", label: "3. صياغة فكرة المشروع" },
      { to: "/lessons/project-planning", label: "4. تخطيط المشروع" },
    ],
  },
  "day-14": {
    title: "دروس اليوم الرابع عشر",
    accent: "violet",
    lessons: [
      { to: "/lessons/project-architecture", label: "1. هيكل المشروع" },
      { to: "/lessons/project-implementation-sprint", label: "2. تنفيذ المشروع على مراحل" },
      { to: "/lessons/project-testing-debugging", label: "3. اختبار وتصحيح المشروع" },
      { to: "/lessons/project-presentation-rehearsal", label: "4. تجهيز العرض التقديمي" },
    ],
  },
  "day-15": {
    title: "دروس اليوم الخامس عشر",
    accent: "violet",
    lessons: [
      { to: "/lessons/final-project-presentation", label: "1. العرض النهائي للمشروع" },
      { to: "/lessons/peer-feedback-and-refinement", label: "2. التغذية الراجعة من الأقران" },
      { to: "/lessons/final-evaluation", label: "3. التقييم الختامي" },
      { to: "/lessons/program-closure-next-steps", label: "4. خاتمة البرنامج والخطوات التالية" },
    ],
  },
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
  const dayLessonSection = DAY_LESSON_SECTIONS[day.id];

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

          {dayLessonSection ? (
            <EduCard title={dayLessonSection.title} accent={dayLessonSection.accent}>
              <div className="mt-2 flex flex-col gap-2 text-sm">
                {dayLessonSection.lessons.map((lesson) => (
                  <div key={lesson.to} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <Link to={lesson.to} className="text-sm font-semibold text-slate-800 hover:text-violet-700">
                      {lesson.label}
                    </Link>
                    <Link to={lesson.to} className="edu-btn edu-btn-primary text-xs">
                      إبدأ الدرس
                    </Link>
                  </div>
                ))}
                {dayLessonSection.extras?.map((extra) => (
                  <Link key={extra.to} to={extra.to} className="edu-btn edu-btn-outline mt-1 inline-flex w-fit text-sm">
                    {extra.label}
                  </Link>
                ))}
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
