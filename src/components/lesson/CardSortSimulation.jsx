import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [dragIdx, setDragIdx] = useState(null);
  const [moves, setMoves] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [algoStep, setAlgoStep] = useState(0);
  const startedAtRef = useRef(null);
  const refSteps = useMemo(() => bubbleSteps(DEFAULT_CARDS), []);

  useEffect(() => {
    if (!restored || !progress) return;
    if (Array.isArray(progress.cards)) setCards(progress.cards);
    if (typeof progress.moves === "number") setMoves(progress.moves);
    if (typeof progress.attempts === "number") setAttempts(progress.attempts);
    if (typeof progress.hintsUsed === "number") setHintsUsed(progress.hintsUsed);
    if (typeof progress.algoStep === "number") setAlgoStep(progress.algoStep);
    if (progress.feedback) setFeedback(progress.feedback);
    if (progress.startedAt) startedAtRef.current = progress.startedAt;
  }, [restored, progress]);

  const elapsedMs = useCallback(() => {
    const start = startedAtRef.current || Date.now();
    if (!startedAtRef.current) startedAtRef.current = start;
    return Date.now() - new Date(start).getTime();
  }, []);

  const saveState = useCallback(
    async (patch, done = false) => {
      const payload = {
        cards,
        moves,
        attempts,
        hintsUsed,
        algoStep,
        feedback,
        startedAt: startedAtRef.current || new Date().toISOString(),
        elapsedMs: elapsedMs(),
        finalOrder: patch.cards || cards,
        ...patch,
      };
      if (done) await markComplete(payload);
      else await persist(payload);
    },
    [cards, moves, attempts, hintsUsed, algoStep, feedback, persist, markComplete, elapsedMs],
  );

  function swap(i, j) {
    if (i == null || j == null || i === j) return;
    setCards((prev) => {
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setMoves((m) => m + 1);
    setFeedback("");
    setSelectedIdx(j);
  }

  function moveSelected(dir) {
    if (selectedIdx == null) {
      setFeedback("اختر بطاقة أولاً ثم استخدم تحريك يمين/يسار.");
      return;
    }
    const target = selectedIdx + dir;
    if (target < 0 || target >= cards.length) return;
    swap(selectedIdx, target);
    saveState({ lastStep: dir > 0 ? "move-right" : "move-left" });
  }

  function onDrop(targetIdx) {
    if (dragIdx == null) return;
    swap(dragIdx, targetIdx);
    setDragIdx(null);
    saveState({ lastStep: "drop" });
  }

  function checkOrder() {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const ok = isSorted(cards) && cards.join(",") === TARGET.join(",");
    const msg = ok
      ? `ترتيب صحيح ✓ — ${moves} حركة · ${Math.round(elapsedMs() / 1000)}ث`
      : "الترتيب غير صحيح — استمر بالمقارنة والتبديل";
    setFeedback(msg);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "card-sort-order",
        answer: cards.join(","),
        correct: ok,
        hintsUsed,
        durationMs: elapsedMs(),
      });
    }
    saveState({ feedback: msg, submitted: ok, attempts: nextAttempts, finalOrder: cards }, ok);
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
          : "راجع خوارزمية الفرز — قارن الجيران المتجاورين وبدّل عند الحاجة.";
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
    setAttempts(0);
    setAlgoStep(0);
    setSelectedIdx(null);
    startedAtRef.current = new Date().toISOString();
    setFeedback("أُعيد الترتيب الأولي.");
    saveState({ cards: DEFAULT_CARDS, moves: 0, attempts: 0, algoStep: 0, feedback: "reset" });
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveSelected(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        moveSelected(1);
      } else if (e.key === "Enter" && selectedIdx != null) {
        e.preventDefault();
        checkOrder();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      className="rounded-xl border border-violet-200 bg-violet-50/40 p-4"
      dir="rtl"
      role="region"
      aria-label="محاكاة فرز البطاقات"
    >
      <p className="font-bold text-violet-900">محاكاة فرز البطاقات</p>
      <p className="mt-1 text-xs text-slate-600">
        الهدف: {TARGET.join("، ")} · الحركات: {moves} · المحاولات: {attempts} · تلميحات: {hintsUsed}
      </p>
      <p className="sr-only" aria-live="polite">
        {feedback}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        يمكنك السحب بالفأرة أو اللمس، أو اختيار بطاقة ثم تحريكها بأزرار/أسهم لوحة المفاتيح.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2" role="list" aria-label="البطاقات">
        {cards.map((val, idx) => (
          <button
            key={`${idx}-${val}`}
            type="button"
            role="listitem"
            draggable
            aria-pressed={selectedIdx === idx}
            aria-label={`بطاقة ${val} في الموضع ${idx + 1}`}
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(idx)}
            onClick={() => setSelectedIdx(idx)}
            className={`flex h-16 w-14 cursor-grab items-center justify-center rounded-lg border-2 text-lg font-bold shadow-sm active:cursor-grabbing ${
              selectedIdx === idx || dragIdx === idx
                ? "border-violet-600 bg-violet-100 ring-2 ring-violet-400"
                : "border-slate-200 bg-white"
            }`}
            dir="ltr"
          >
            {val}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="edu-btn text-sm" onClick={() => moveSelected(-1)} aria-label="تحريك يسار">
          ← يسار
        </button>
        <button type="button" className="edu-btn text-sm" onClick={() => moveSelected(1)} aria-label="تحريك يمين">
          يمين →
        </button>
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

      {feedback ? <p className="mt-3 text-sm font-semibold text-slate-800" aria-hidden="true">{feedback}</p> : null}
      {!restored ? <p className="mt-2 text-xs text-slate-500">جاري استعادة التقدم…</p> : null}
    </div>
  );
}
