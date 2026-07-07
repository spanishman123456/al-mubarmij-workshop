import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonProgress } from "../../lib/hooks/useLessonProgress";
import { recordLessonAttemptApi } from "../../lib/platformApi";
import { createBoard, applyMove, checkWinner, emptyCells } from "../../lib/games/ticTacToe.js";
import { AFTER_MAX_HINTS_AR } from "../../lib/exerciseFeedbackPolicy.js";

const X_MOVES_BEFORE_PREDICT = 3;

function pickOMove(board) {
  const empties = emptyCells(board);
  if (!empties.length) return null;
  return empties[0];
}

function winnerLabel(winner) {
  if (winner === "X") return "X";
  if (winner === "O") return "O";
  if (winner === "draw") return "تعادل";
  return "لا يزال";
}

export function TicTacToeLab({ lessonId, userId }) {
  const { progress, restored, persist, markComplete } = useLessonProgress({
    studentId: userId,
    lessonId,
    sectionId: "tic-tac-toe-lab",
  });
  const [board, setBoard] = useState(() => createBoard());
  const [xMoveCount, setXMoveCount] = useState(0);
  const [winnerGuess, setWinnerGuess] = useState("");
  const [hints, setHints] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!restored || !progress) return;
    if (progress.board) setBoard(progress.board);
    if (progress.xMoveCount != null) setXMoveCount(Number(progress.xMoveCount) || 0);
    if (progress.winnerGuess != null) setWinnerGuess(String(progress.winnerGuess));
    if (progress.hints) setHints(Number(progress.hints) || 0);
  }, [restored, progress]);

  const winner = useMemo(() => checkWinner(board), [board]);
  const canPredict = xMoveCount >= X_MOVES_BEFORE_PREDICT || winner !== null;
  const turn = useMemo(() => {
    const xs = board.filter((c) => c === "X").length;
    const os = board.filter((c) => c === "O").length;
    return xs === os ? "X" : "O";
  }, [board]);

  const save = useCallback(
    (patch, done = false) => {
      const payload = { board, xMoveCount, winnerGuess, hints, ...patch };
      if (done) markComplete(payload);
      else persist(payload);
    },
    [board, xMoveCount, winnerGuess, hints, persist, markComplete],
  );

  function resetGame() {
    const fresh = createBoard();
    setBoard(fresh);
    setXMoveCount(0);
    setWinnerGuess("");
    setFeedback("");
    setHints(0);
    save({ board: fresh, xMoveCount: 0, winnerGuess: "", hints: 0 });
  }

  function playMove(index) {
    if (!canPredict && winner === null && turn === "X") {
      const next = applyMove(board, index, "X");
      if (!next) return;

      let afterX = next;
      let moves = xMoveCount + 1;
      const xWin = checkWinner(afterX);

      if (xWin === null) {
        const oIndex = pickOMove(afterX);
        if (oIndex != null) {
          const afterO = applyMove(afterX, oIndex, "O");
          if (afterO) afterX = afterO;
        }
      }

      setBoard(afterX);
      setXMoveCount(moves);
      save({ board: afterX, xMoveCount: moves });
      return;
    }
  }

  function checkWinnerGuess() {
    const expected = winnerLabel(winner);
    const ok = winnerGuess === expected;
    if (userId) {
      recordLessonAttemptApi(userId, {
        lessonId,
        exerciseId: "tic-tac-toe-winner",
        answer: winnerGuess,
        correct: ok,
        hintsUsed: hints,
      });
    }
    if (ok) {
      setFeedback("إجابة صحيحة ✓ حلّلت لوحة تك-تاك-تو بنجاح.");
      save({ winnerGuess, solvedAt: new Date().toISOString() }, true);
    } else {
      setFeedback("غير صحيح — راجع الصفوف والأعمدة والأقطار.");
      save({ winnerGuess });
    }
  }

  const expected = winnerLabel(winner);

  function revealHint() {
    if (hints >= 2) {
      setFeedback(AFTER_MAX_HINTS_AR);
      return;
    }
    const next = hints + 1;
    setHints(next);
    if (next === 1) {
      setFeedback("تلميح 1: ابحث عن ثلاثة X أو O متتالية في صف أو عمود أو قطر.");
    } else {
      const filled = board.filter(Boolean).length;
      setFeedback(
        winner === null
          ? `تلميح 2: ${filled} خانات مملوءة — اللعب لا يزال جاريًا.`
          : `تلميح 2: النتيجة الحالية: ${expected}.`,
      );
    }
    save({ hints: next });
  }

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4" dir="rtl" data-testid="tic-tac-toe-lab">
      <p className="font-bold text-sky-900">مختبر تك-تاك-تو</p>
      <p className="mt-1 text-sm text-slate-700">
        العب X ضد O (يختار أول خانة فارغة). بعد {X_MOVES_BEFORE_PREDICT} حركات أو انتهاء اللعبة، حدّد الفائز.
      </p>

      <div className="mt-4 inline-grid grid-cols-3 gap-1" dir="ltr">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            onClick={() => playMove(i)}
            disabled={Boolean(cell) || canPredict || turn !== "X" || winner !== null}
            className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-sky-300 bg-white text-2xl font-bold text-sky-900 disabled:cursor-default disabled:opacity-90"
            data-testid={`ttt-cell-${i}`}
            aria-label={`خلية ${i + 1}${cell ? `: ${cell}` : ""}`}
          >
            {cell || ""}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-slate-600">
        حركات X: {xMoveCount}/{X_MOVES_BEFORE_PREDICT}
        {winner !== null ? ` — النتيجة: ${expected}` : turn === "X" && !canPredict ? " — دورك (X)" : ""}
      </p>

      {canPredict ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-slate-800">من الفائز؟</p>
          <div className="flex flex-wrap gap-2">
            {["X", "O", "تعادل", "لا يزال"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setWinnerGuess(opt);
                  save({ winnerGuess: opt });
                }}
                className={`edu-btn text-sm ${winnerGuess === opt ? "edu-btn-primary" : "edu-btn-outline"}`}
                data-testid={`winner-guess-${opt}`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={checkWinnerGuess} className="edu-btn edu-btn-primary text-sm">
              تحقق
            </button>
            <button type="button" onClick={revealHint} className="edu-btn edu-btn-outline text-sm">
              تلميح ({hints}/2)
            </button>
          </div>
        </div>
      ) : null}

      <button type="button" onClick={resetGame} className="edu-btn edu-btn-outline mt-4 text-sm">
        لعبة جديدة
      </button>
      {feedback ? <p className="mt-3 text-sm font-semibold text-slate-800">{feedback}</p> : null}
    </div>
  );
}
