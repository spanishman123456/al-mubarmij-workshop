import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BINARY_CARD_VALUES,
  cardSum,
  checkTarget,
  getGraduatedHint,
  getWrongFeedback,
  hiddenCards,
  initialCardState,
  sumExpression,
  toBinaryString,
  toggleCard,
  visibleCards,
} from "../../lib/binaryCards/binaryCardsLogic";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";

function cardAriaLabel(value, visible) {
  return visible
    ? `بطاقة القيمة ${value}، حالتها ظاهرة، اضغط لإخفائها`
    : `بطاقة القيمة ${value}، حالتها مخفية، اضغط لإظهارها`;
}

function BinaryCard({ value, visible, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={visible}
      aria-label={cardAriaLabel(value, visible)}
      onClick={() => onToggle(value)}
      className={`binary-card press-scale min-h-[5.5rem] min-w-[4.5rem] cursor-pointer rounded-xl border-2 px-3 py-4 text-center font-bold transition-all hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-400 active:scale-95 ${
        visible
          ? "binary-card--visible border-violet-600 bg-gradient-to-b from-violet-500 to-violet-700 text-white shadow-md"
          : "binary-card--hidden border-slate-300 bg-slate-100 text-slate-400 shadow-inner"
      }`}
    >
      <span className="block text-2xl">{value}</span>
      <span className="mt-1 block text-xs font-semibold">{visible ? "ظاهرة" : "مخفية"}</span>
      <span className="mt-0.5 block text-[10px] opacity-80">{visible ? "1" : "0"}</span>
    </button>
  );
}

function StaticExampleDemo() {
  const target = 5;
  const state = useMemo(() => {
    const s = initialCardState(false);
    s[4] = true;
    s[1] = true;
    return s;
  }, []);

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
      <p className="font-bold text-emerald-900">مثال: تمثيل العدد {target}</p>
      <p className="mt-2 text-sm text-slate-700">
        البطاقات <strong>4</strong> و<strong>1</strong> ظاهرة، والبطاقات 2 و8 و16 مخفية.
      </p>
      <p className="mt-1 text-sm text-slate-700">
        {target} = 4 + 1 — التمثيل الثنائي{" "}
        <span dir="ltr" className="font-mono font-bold">
          {toBinaryString(state)}₂
        </span>
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2" dir="ltr">
        {BINARY_CARD_VALUES.map((v) => (
          <div
            key={v}
            className={`min-w-[3.5rem] rounded-lg border-2 px-2 py-2 text-center text-sm font-bold ${
              state[v] ? "border-violet-500 bg-violet-100 text-violet-900" : "border-slate-200 bg-white text-slate-400"
            }`}
          >
            {v}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">ترتيب البطاقات من اليسار: 16 → 8 → 4 → 2 → 1 (الأكبر إلى الأصغر).</p>
    </div>
  );
}

export function BinaryCardsLab({ lessonId, userId, exercises = [] }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "binary-cards-lab",
  });

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [cards, setCards] = useState(() => initialCardState(false));
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState({});

  const exercise = exercises[exerciseIndex];
  const target = exercise?.target ?? 5;

  useEffect(() => {
    if (!restored || !progress) return;
    if (typeof progress.exerciseIndex === "number") setExerciseIndex(progress.exerciseIndex);
    if (progress.cards) setCards(progress.cards);
    if (typeof progress.hintsUsed === "number") setHintsUsed(progress.hintsUsed);
    if (typeof progress.attempts === "number") setAttempts(progress.attempts);
    if (progress.completed) setCompleted(progress.completed);
  }, [restored, progress]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = {
        exerciseIndex,
        cards,
        hintsUsed,
        attempts,
        completed,
        target,
        ...patch,
      };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [exerciseIndex, cards, hintsUsed, attempts, completed, target, persist, markComplete],
  );

  function handleToggle(value) {
    const next = toggleCard(cards, value);
    setCards(next);
    setFeedback("");
    save({ cards: next });
  }

  function resetCards() {
    const fresh = initialCardState(false);
    setCards(fresh);
    setFeedback("");
    save({ cards: fresh, hintsUsed: 0 });
  }

  function showHint() {
    const next = hintsUsed + 1;
    setHintsUsed(next);
    setFeedback(getGraduatedHint(target, hintsUsed));
    save({ hintsUsed: next });
  }

  function checkAnswer() {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const ok = checkTarget(cards, target);
    const binary = toBinaryString(cards);

    if (userId && exercise) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: `cards-${exercise.id}`,
        answer: binary,
        correct: ok,
        hintsUsed,
      });
    }

    if (ok) {
      const msg = `ممتاز! البطاقات الظاهرة مجموعها ${target}، والتمثيل الثنائي هو ${binary}₂.`;
      setFeedback(msg);
      const nextCompleted = { ...completed, [exercise.id]: true };
      setCompleted(nextCompleted);
      save({ attempts: nextAttempts, completed: nextCompleted, lastResult: "correct", feedback: msg });
      return;
    }

    const msg = getWrongFeedback(cards, target);
    setFeedback(msg);
    save({ attempts: nextAttempts, lastResult: "wrong", feedback: msg });
  }

  function nextExercise() {
    if (exerciseIndex >= exercises.length - 1) return;
    const nextIdx = exerciseIndex + 1;
    const fresh = initialCardState(false);
    setExerciseIndex(nextIdx);
    setCards(fresh);
    setHintsUsed(0);
    setAttempts(0);
    setFeedback("");
    save({ exerciseIndex: nextIdx, cards: fresh, hintsUsed: 0, attempts: 0, target: exercises[nextIdx]?.target });
  }

  const sum = cardSum(cards);
  const vis = visibleCards(cards);
  const hid = hiddenCards(cards);

  if (!exercise) return null;

  return (
    <div className="space-y-4" dir="rtl">
      <StaticExampleDemo />

      <div className="rounded-xl border-2 border-violet-300 bg-violet-50/40 p-4">
        <h3 className="text-lg font-bold text-violet-900">نشاط تفاعلي: اقلب البطاقات لتمثيل العدد</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          كل بطاقة لها قيمة: 1، 2، 4، 8، 16. عندما تكون البطاقة <strong>ظاهرة</strong> نستخدم قيمتها وتمثل{" "}
          <strong>1</strong> في النظام الثنائي. عندما تكون <strong>مخفية</strong> لا نستخدم قيمتها وتمثل{" "}
          <strong>0</strong>. اضغط على البطاقات لإظهارها أو إخفائها.
        </p>

        <p className="mt-4 text-base font-bold text-slate-900">
          مثّل العدد: <span dir="ltr">{target}</span>
          <span className="mr-2 text-sm font-normal text-slate-600">
            (سؤال {exerciseIndex + 1} من {exercises.length})
          </span>
        </p>

        <p className="mt-1 text-xs text-violet-700">اضغط لقلب البطاقة — الظاهرة = 1، المخفية = 0</p>

        <div className="mt-4 flex flex-wrap justify-center gap-3" dir="ltr">
          {BINARY_CARD_VALUES.map((v) => (
            <BinaryCard key={v} value={v} visible={Boolean(cards[v])} onToggle={handleToggle} />
          ))}
        </div>

        <div className="mt-4 grid gap-2 rounded-lg bg-white/80 p-3 text-sm sm:grid-cols-2">
          <p>
            <span className="font-semibold text-slate-700">البطاقات المستخدمة:</span>{" "}
            <span dir="ltr">{vis.length ? sumExpression(cards) : "—"}</span>
          </p>
          <p>
            <span className="font-semibold text-slate-700">المجموع الحالي:</span>{" "}
            <span dir="ltr">{sum}</span>
          </p>
          <p>
            <span className="font-semibold text-slate-700">التمثيل الثنائي:</span>{" "}
            <span dir="ltr" className="font-mono font-bold">
              {toBinaryString(cards)}₂
            </span>
          </p>
          <p>
            <span className="font-semibold text-slate-700">العدد المطلوب:</span>{" "}
            <span dir="ltr">{target}</span>
          </p>
        </div>

        {vis.length > 0 ? (
          <p className="mt-2 text-xs text-slate-600">
            ظاهرة: {vis.join("، ")} — مخفية: {hid.length ? hid.join("، ") : "لا شيء"}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={checkAnswer}>
            تحقق من الإجابة
          </button>
          <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={resetCards}>
            إعادة ضبط البطاقات
          </button>
          <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={showHint}>
            إظهار تلميح
          </button>
          {completed[exercise.id] && exerciseIndex < exercises.length - 1 ? (
            <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={nextExercise}>
              السؤال التالي
            </button>
          ) : null}
        </div>

        {feedback ? (
          <p
            className={`mt-3 rounded-lg p-3 text-sm ${
              completed[exercise.id] ? "bg-emerald-100 text-emerald-900" : "bg-amber-50 text-amber-900"
            }`}
          >
            {feedback}
          </p>
        ) : null}
        {completed[exercise.id] ? <p className="mt-1 text-xs font-bold text-emerald-700">✓ مكتمل</p> : null}
      </div>
    </div>
  );
}
