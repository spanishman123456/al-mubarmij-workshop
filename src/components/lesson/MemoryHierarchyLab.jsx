import { useCallback, useEffect, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

const COMPONENTS = [
  { id: "cpu", labelAr: "CPU", roleAr: "تنفيذ التعليمات والحسابات" },
  { id: "cache", labelAr: "Cache", roleAr: "ذاكرة سريعة صغيرة قرب المعالج لتسريع الوصول" },
  { id: "ram", labelAr: "RAM", roleAr: "تخزين البرامج والبيانات أثناء التشغيل" },
  { id: "hdd", labelAr: "HDD/SSD", roleAr: "تخزين دائم كبير السعة" },
];

const SPEED_ORDER = ["cache", "ram", "hdd"];

const ROLE_OPTIONS = [
  { id: "exec", textAr: "تنفيذ التعليمات" },
  { id: "fast", textAr: "تسريع الوصول للبيانات المتكررة" },
  { id: "runtime", textAr: "تخزين مؤقت أثناء التشغيل" },
  { id: "persist", textAr: "حفظ دائم بعد الإطفاء" },
];

const CORRECT_MAP = { cpu: "exec", cache: "fast", ram: "runtime", hdd: "persist" };

export function MemoryHierarchyLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "memory-hierarchy-lab",
  });
  const [answers, setAnswers] = useState({ cpu: "", cache: "", ram: "", hdd: "" });
  const [speedGuess, setSpeedGuess] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.answers) setAnswers(progress.answers);
    if (progress.speedGuess != null) setSpeedGuess(String(progress.speedGuess));
    if (progress.hints) setHints(Number(progress.hints) || 0);
  }, [restored, progress]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { answers, speedGuess, hints, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [answers, speedGuess, hints, persist, markComplete],
  );

  function setAnswer(compId, value) {
    const next = { ...answers, [compId]: value };
    setAnswers(next);
    save({ answers: next });
  }

  function checkAll() {
    const matchOk = COMPONENTS.every((c) => answers[c.id] === CORRECT_MAP[c.id]);
    const speedOk = speedGuess.trim().toLowerCase() === SPEED_ORDER.join(",");
    const ok = matchOk && speedOk;

    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "memory-hierarchy-match",
        answer: JSON.stringify({ answers, speedGuess }),
        correct: ok,
        hintsUsed: hints,
      });
    }

    if (ok) {
      setFeedback("ممتاز ✓ طابقت الوظائف ورتّبت السرعة بشكل صحيح.");
      save({ solvedAt: new Date().toISOString() }, true);
    } else if (!matchOk) {
      setFeedback("راجع مطابقة الوظيفة لكل مكوّن — CPU للتنفيذ، Cache للتسريع…");
    } else {
      setFeedback("المطابقة صحيحة — رتّب السرعة: Cache ثم RAM ثم HDD (مفصولة بفواصل).");
    }
  }

  function revealHint() {
    if (hints >= 2) {
      setFeedback(AFTER_MAX_HINTS_AR);
      return;
    }
    const next = hints + 1;
    setHints(next);
    setFeedback(next === 1 ? "تلميح 1: CPU لا يخزّن ملفاتك طويلًا — ينفّذ." : "تلميح 2: الأسرع بعد CPU مباشرة هو Cache.");
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4" dir="rtl" data-testid="memory-hierarchy-lab">
      <p className="font-bold text-emerald-900">مختبر هرم الذاكرة</p>
      <p className="mt-1 text-sm text-slate-700">طابِق كل مكوّن بوظيفته، ثم اكتب ترتيب السرعة (من الأسرع للأبطأ بين Cache و RAM و HDD).</p>

      <div className="mt-4 space-y-3">
        {COMPONENTS.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 text-sm">
            <span className="min-w-[80px] font-bold">{c.labelAr}</span>
            <span className="text-slate-600">{c.roleAr}</span>
            <select
              value={answers[c.id] || ""}
              onChange={(e) => setAnswer(c.id, e.target.value)}
              className="mr-auto rounded border border-slate-300 px-2 py-1"
            >
              <option value="">— الوظيفة —</option>
              {ROLE_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.textAr}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <label className="mt-4 block text-sm">
        <span className="font-semibold">ترتيب السرعة (مثال: cache,ram,hdd)</span>
        <input
          type="text"
          value={speedGuess}
          onChange={(e) => {
            setSpeedGuess(e.target.value);
            save({ speedGuess: e.target.value });
          }}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          dir="ltr"
          placeholder="cache,ram,hdd"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={checkAll} className="edu-btn edu-btn-primary text-sm">
          تحقق
        </button>
        <button type="button" onClick={revealHint} className="edu-btn edu-btn-outline text-sm">
          تلميح ({hints}/2)
        </button>
      </div>
      {feedback ? <p className="mt-3 text-sm font-semibold text-slate-800">{feedback}</p> : null}
    </div>
  );
}
