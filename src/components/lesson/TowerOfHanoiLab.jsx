import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import {
  createInitialTowers,
  validateHanoiMove,
  applyHanoiMove,
  isHanoiSolved,
  HANOI_COLUMNS,
} from "../../lib/logic/hanoi.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

const DISK_COUNT = 3;
const OPTIMAL_MOVES = 2 ** DISK_COUNT - 1;

function diskColor(size) {
  if (size === 3) return "bg-rose-500";
  if (size === 2) return "bg-rose-400";
  return "bg-rose-300";
}

function diskWidth(size) {
  return `${40 + size * 28}px`;
}

export function TowerOfHanoiLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "tower-of-hanoi-lab",
  });
  const [towers, setTowers] = useState(() => createInitialTowers(DISK_COUNT));
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [dragging, setDragging] = useState(null);

  const solved = useMemo(() => isHanoiSolved(towers, DISK_COUNT), [towers]);

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.towers) setTowers(progress.towers);
    if (progress.moveCount != null) setMoveCount(Number(progress.moveCount) || 0);
    if (progress.wrongAttempts != null) setWrongAttempts(Number(progress.wrongAttempts) || 0);
    if (progress.hints) setHints(Number(progress.hints) || 0);
  }, [restored, progress]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { towers, moveCount, wrongAttempts, hints, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [towers, moveCount, wrongAttempts, hints, persist, markComplete],
  );

  function resetPuzzle() {
    const initial = createInitialTowers(DISK_COUNT);
    setTowers(initial);
    setSelectedFrom(null);
    setMoveCount(0);
    setWrongAttempts(0);
    setFeedback("");
    setHints(0);
    setDragging(null);
    save({ towers: initial, moveCount: 0, wrongAttempts: 0, hints: 0 });
  }

  function moveDisk(fromCol, toCol) {
    if (fromCol === toCol) {
      setSelectedFrom(null);
      setDragging(null);
      setFeedback("اختر عمودًا مختلفًا لإتمام النقل.");
      return;
    }

    const check = validateHanoiMove(towers, fromCol, toCol);
    if (!check.ok) {
      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      setSelectedFrom(null);
      setDragging(null);
      setFeedback(check.reason);
      save({ wrongAttempts: nextWrong });
      return;
    }

    const result = applyHanoiMove(towers, fromCol, toCol);
    if (!result.ok) {
      const nextWrong = wrongAttempts + 1;
      setWrongAttempts(nextWrong);
      setSelectedFrom(null);
      setDragging(null);
      setFeedback(result.reason);
      save({ wrongAttempts: nextWrong });
      return;
    }

    const nextMoves = moveCount + 1;
    setTowers(result.towers);
    setMoveCount(nextMoves);
    setSelectedFrom(null);
    setDragging(null);
    setFeedback(`نُقل القرص ${result.disk} من ${HANOI_COLUMNS[fromCol]} إلى ${HANOI_COLUMNS[toCol]}.`);
    save({ towers: result.towers, moveCount: nextMoves });
  }

  function handleColumnClick(colIndex) {
    if (selectedFrom === null) {
      if (!towers[colIndex]?.length) {
        setFeedback("لا يوجد قرص في هذا العمود — اختر عمودًا آخر.");
        return;
      }
      setSelectedFrom(colIndex);
      setFeedback(`اختر عمود الوجهة لنقل القرص من ${HANOI_COLUMNS[colIndex]}.`);
      return;
    }
    if (selectedFrom === colIndex) {
      setSelectedFrom(null);
      setFeedback("تم إلغاء الاختيار.");
      return;
    }
    moveDisk(selectedFrom, colIndex);
  }

  function handleDiskDragStart(colIndex, disk) {
    setDragging({ from: colIndex, disk });
    setSelectedFrom(colIndex);
    setFeedback(`اسحب القرص ${disk} من ${HANOI_COLUMNS[colIndex]} ثم أفلت في العمود الهدف.`);
  }

  function handleColumnDrop(colIndex) {
    if (dragging == null) return;
    moveDisk(dragging.from, colIndex);
  }

  function checkSolution() {
    const ok = isHanoiSolved(towers, DISK_COUNT);
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "tower-of-hanoi-solve",
        answer: JSON.stringify({ moveCount, solved: ok }),
        correct: ok,
        hintsUsed: hints,
      });
    }
    if (ok) {
      const extra = moveCount <= OPTIMAL_MOVES ? " — الحد الأدنى للحركات!" : "";
      setFeedback(`أحسنت! حلّيت اللغز بـ ${moveCount} حركة${extra}.`);
      save({ solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("لم تُحلّ بعد — انقل كل الأقراص إلى العمود C بترتيب تصاعدي (1 فوق 2 فوق 3).");
    }
  }

  function revealHint() {
    if (hints >= 2) {
      setFeedback(AFTER_MAX_HINTS_AR);
      return;
    }
    const next = hints + 1;
    setHints(next);
    if (next === 1) {
      setFeedback("تلميح 1: لا تضع قرصًا أكبر فوق قرص أصغر — انقل قرصًا واحدًا في كل مرة.");
    } else {
      setFeedback(`تلميح 2: الحل الأمثل لـ ${DISK_COUNT} أقراص يحتاج ${OPTIMAL_MOVES} حركات — الهدف العمود C.`);
    }
    save({ hints: next });
  }

  return (
    <div
      className="rounded-xl border border-rose-200 bg-rose-50/40 p-4"
      dir="rtl"
      data-testid="tower-of-hanoi-lab"
    >
      <p className="font-bold text-rose-900">مختبر برج هانوي (3 أقراص)</p>
      <p className="mt-1 text-sm text-slate-700">
        انقل الأقراص من العمود A إلى C — قرص واحد في كل مرة، ولا قرص كبير فوق صغير.
      </p>
      <p className="mt-1 text-xs text-rose-700">
        يمكنك السحب والإفلات بالماوس (ضغط مستمر على القرص العلوي) أو النقل بالنقر على عمود المصدر ثم الوجهة.
      </p>

      <div className="mt-4 flex justify-center gap-4" dir="ltr">
        {towers.map((column, colIndex) => (
          <button
            key={colIndex}
            type="button"
            onClick={() => handleColumnClick(colIndex)}
            onDragOver={(ev) => ev.preventDefault()}
            onDrop={(ev) => {
              ev.preventDefault();
              handleColumnDrop(colIndex);
            }}
            className={`flex h-44 w-28 flex-col-reverse items-center rounded-lg border-2 pb-2 transition-colors ${
              selectedFrom === colIndex || dragging?.from === colIndex
                ? "border-rose-500 bg-rose-100"
                : "border-rose-300 bg-white hover:bg-rose-50"
            }`}
            data-testid={`hanoi-column-${HANOI_COLUMNS[colIndex]}`}
            aria-label={`عمود ${HANOI_COLUMNS[colIndex]}`}
          >
            <span className="mt-1 text-xs font-bold text-rose-800">{HANOI_COLUMNS[colIndex]}</span>
            {column.map((disk, i) => (
              <span
                key={`${colIndex}-${disk}-${i}`}
                draggable={!solved && i === column.length - 1}
                onDragStart={!solved && i === column.length - 1 ? () => handleDiskDragStart(colIndex, disk) : undefined}
                onDragEnd={() => setDragging(null)}
                className={`mb-0.5 block h-5 rounded-full ${diskColor(disk)} ${!solved && i === column.length - 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
                style={{ width: diskWidth(disk) }}
                aria-hidden
              />
            ))}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-slate-600">
        الحركات: {moveCount}
        {solved ? " — مكتمل!" : ""}
        {wrongAttempts > 0 ? ` — محاولات خاطئة: ${wrongAttempts}` : ""}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={checkSolution} className="edu-btn edu-btn-primary text-sm">
          تحقق
        </button>
        <button type="button" onClick={revealHint} className="edu-btn edu-btn-outline text-sm">
          تلميح ({hints}/2)
        </button>
        <button type="button" onClick={resetPuzzle} className="edu-btn edu-btn-outline text-sm">
          إعادة
        </button>
      </div>
      {feedback ? <p className="mt-3 text-sm font-semibold text-slate-800">{feedback}</p> : null}
    </div>
  );
}
