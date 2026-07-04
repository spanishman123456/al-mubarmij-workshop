import { useCallback, useEffect, useMemo, useState } from "react";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";

const DEFAULT_CARDS = [7, 3, 9, 1, 5];
const TARGET = [1, 3, 5, 7, 9];

function isSorted(arr) {
  for (let i = 1; i < arr.length; i += 1) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

/** خطوات فرز فقاعي مرجعية للمقارنة */
function bubbleSteps(cards) {
  const steps = [];
  const a = [...cards];
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < a.length - 1 - i; j += 1) {
      steps.push({ compare: [j, j + 1], swap: a[j] > a[j + 1] });
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
  }
  return steps;
}

export function CardSortSimulation({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "card-sort-sim",
  });

  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [dragIdx, setDragIdx] = useState(null);
  const [moves, setMoves] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [algoStep, setAlgoStep] = useState(0);
  const refSteps = useMemo(() => bubbleSteps(DEFAULT_CARDS), []);

  useEffect(() => {
    if (!restored || !progress) return;
    if (Array.isArray(progress.cards)) setCards(progress.cards);
    if (typeof progress.moves === "number") setMoves(progress.moves);
    if (typeof progress.hintsUsed === "number") setHintsUsed(progress.hintsUsed);
    if (typeof progress.algoStep === "number") setAlgoStep(progress.algoStep);
    if (progress.feedback) setFeedback(progress.feedback);
  }, [restored, progress]);

  const saveState = useCallback(
    async (patch, done = false) => {
      const payload = {
        cards,
        moves,
        hintsUsed,
        algoStep,
        feedback,
        lastStep: "drag",
        ...patch,
      };
      if (done) await markComplete(payload);
      else await persist(payload);
    },
    [cards, moves, hintsUsed, algoStep, feedback, persist, markComplete],
  );

  function swap(i, j) {
    if (i === j) return;
    setCards((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setMoves((m) => m + 1);
    setFeedback("");
  }

  function onDrop(targetIdx) {
    if (dragIdx == null) return;
    swap(dragIdx, targetIdx);
    setDragIdx(null);
    saveState({ lastStep: "drop" });
  }

  function checkOrder() {
    const ok = isSorted(cards) && cards.join(",") === TARGET.join(",");
    const msg = ok
      ? `ترتيب صحيح ✓ — ${moves} حركة`
      : "الترتيب غير صحيح — استمر بالمقارنة والتبديل";
    setFeedback(msg);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "card-sort-order",
        answer: cards.join(","),
        correct: ok,
        hintsUsed,
      });
    }
    saveState({ feedback: msg, submitted: ok }, ok);
    return ok;
  }

  function showHint() {
    const next = hintsUsed + 1;
    setHintsUsed(next);
    const hint =
      next === 1
        ? "ابحث عن أصغر بطاقة في الباقي وضعها في موضعها."
        : next === 2
          ? `الخطوة ${algoStep + 1}/${refSteps.length}: قارن الموضعين ${refSteps[algoStep]?.compare?.map((x) => x + 1).join(" و ") || "—"}`
          : `الترتيب الهدف: ${TARGET.join("، ")}`;
    setFeedback(`تلميح: ${hint}`);
    saveState({ hintsUsed: next, feedback: hint, lastStep: "hint" });
  }

  function nextAlgoStep() {
    const step = refSteps[algoStep];
    if (!step) {
      setFeedback("أكملت خطوات الخوارزمية المرجعية — قارن بحركاتك.");
      return;
    }
    const [i, j] = step.compare;
    const msg = step.swap
      ? `الخوارزمية: بدّل ${cards[i]} و ${cards[j]} (لأن ${cards[i]} > ${cards[j]})`
      : `الخوارزمية: لا تبديل بين ${cards[i]} و ${cards[j]}`;
    setAlgoStep((s) => s + 1);
    setFeedback(msg);
    saveState({ algoStep: algoStep + 1, feedback: msg, lastStep: "algo-step" });
  }

  function resetCards() {
    setCards([...DEFAULT_CARDS]);
    setMoves(0);
    setAlgoStep(0);
    setFeedback("أُعيد الترتيب الأولي.");
    saveState({ cards: DEFAULT_CARDS, moves: 0, algoStep: 0, feedback: "reset" });
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4" dir="rtl">
      <p className="font-bold text-violet-900">محاكاة فرز البطاقات — اسحب وأعد الترتيب</p>
      <p className="mt-1 text-xs text-slate-600">الهدف: {TARGET.join("، ")} · الحركات: {moves} · تلميحات: {hintsUsed}</p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {cards.map((val, idx) => (
          <div
            key={`${idx}-${val}`}
            draggable
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(idx)}
            className={`flex h-16 w-14 cursor-grab items-center justify-center rounded-lg border-2 text-lg font-bold shadow-sm active:cursor-grabbing ${
              dragIdx === idx ? "border-violet-600 bg-violet-100" : "border-slate-200 bg-white"
            }`}
            dir="ltr"
          >
            {val}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="edu-btn edu-btn-primary text-sm" onClick={checkOrder}>
          تحقق من الترتيب
        </button>
        <button type="button" className="edu-btn text-sm" onClick={showHint}>
          تلميح
        </button>
        <button type="button" className="edu-btn text-sm" onClick={nextAlgoStep}>
          خطوة خوارزمية مرجعية
        </button>
        <button type="button" className="edu-btn text-sm" onClick={resetCards}>
          إعادة
        </button>
      </div>

      {feedback ? <p className="mt-3 text-sm font-semibold text-slate-800">{feedback}</p> : null}
      {!restored ? <p className="mt-2 text-xs text-slate-500">جاري استعادة التقدم…</p> : null}
    </div>
  );
}
