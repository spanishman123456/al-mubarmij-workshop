import { useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { compareLogicalEquivalence } from "../../lib/logic/equivalence.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

const TASKS = [
  { id: "demorgan", a: "NOT (p AND q)", b: "(NOT p) OR (NOT q)", expect: true },
  { id: "absorb", a: "p OR (p AND q)", b: "p", expect: true },
  { id: "diff", a: "p AND q", b: "p OR q", expect: false },
];

export function LogicEquivalenceLab({ lessonId, userId }) {
  const { persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "equivalence-lab",
  });
  const [taskIdx, setTaskIdx] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState({});

  const task = TASKS[taskIdx];
  const cmp = compareLogicalEquivalence(task.a, task.b, 2);

  function check() {
    const expectsYes = task.expect;
    const saidYes = /نعم|مكافئ|yes|true/i.test(studentAnswer);
    const saidNo = /لا|غير|no|false/i.test(studentAnswer);
    const ok = (expectsYes && saidYes) || (!expectsYes && saidNo);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: task.id,
        answer: studentAnswer,
        correct: ok,
        hintsUsed: hints,
      });
    }
    if (ok) {
      const next = { ...done, [task.id]: true };
      setDone(next);
      setFeedback("صحيح! " + (cmp.equivalent ? "الجدولان متطابقان." : "يوجد صف مختلف في الجدول."));
      if (Object.keys(next).length >= TASKS.length) {
        markComplete({ tasks: next });
      } else {
        persist({ tasks: next });
        setTaskIdx((i) => Math.min(i + 1, TASKS.length - 1));
        setStudentAnswer("");
      }
    } else {
      setFeedback(expectsYes ? "راجع جدول الحقيقة — التعبيران متطابقان." : "هناك صف يختلف — ليسا مكافئين.");
    }
  }

  function hint() {
    if (hints >= 2) {
      setFeedback(AFTER_MAX_HINTS_AR);
      return;
    }
    setHints((h) => h + 1);
    setFeedback(task.expect ? "ابنِ جدولًا لكل تعبير — هل عمود الناتج متطابق؟" : "جرب A=1,B=0 — هل الناتجان متساويان؟");
  }

  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-4" dir="rtl" data-testid="logic-equivalence-lab">
      <p className="font-bold text-cyan-900">مختبر المكافئة المنطقية</p>
      <p className="mt-2 text-sm">
        هل التعبيران مكافئان؟
        <br />
        <span dir="ltr" className="font-mono text-violet-800">
          {task.a} ≡ {task.b}
        </span>
      </p>
      <p className="mt-2 text-xs text-slate-600">
        التقدم: {Object.keys(done).length}/{TASKS.length}
      </p>
      <label className="mt-4 block text-sm font-semibold">
        إجابتك (اكتب «نعم» أو «لا»):
        <input
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          value={studentAnswer}
          onChange={(e) => setStudentAnswer(e.target.value)}
          placeholder="نعم / لا"
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={check}>
          تحقق
        </button>
        <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={hint}>
          تلميح
        </button>
      </div>
      {feedback ? <p className="mt-3 text-sm font-semibold text-cyan-900">{feedback}</p> : null}
    </div>
  );
}
