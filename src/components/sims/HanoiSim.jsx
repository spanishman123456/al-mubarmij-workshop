import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  applyHanoiMove,
  createInitialTowers,
  generateOptimalMoves,
  HANOI_COLUMNS,
  isHanoiSolved,
  scoreHanoiAttempt,
  validateHanoiMove,
} from "../../lib/logic/hanoi.js";

export function HanoiSim() {
  const [disks, setDisks] = useState(3);
  const [towers, setTowers] = useState(() => createInitialTowers(3));
  const [selectedCol, setSelectedCol] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [error, setError] = useState("");
  const [solved, setSolved] = useState(false);
  const [history, setHistory] = useState([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [dragDisk, setDragDisk] = useState(null);
  const timerRef = useRef(null);
  const startedRef = useRef(false);

  const optimal = 2 ** disks - 1;
  const solutionMoves = useMemo(() => generateOptimalMoves(disks), [disks]);
  const [demoStep, setDemoStep] = useState(0);

  const demoTowers = useMemo(() => {
    const t = createInitialTowers(disks);
    for (let i = 0; i < demoStep && i < solutionMoves.length; i += 1) {
      const m = solutionMoves[i];
      const disk = t[m.from].pop();
      if (disk) t[m.to].push(disk);
    }
    return t;
  }, [disks, demoStep, solutionMoves]);

  useEffect(() => {
    if (startedRef.current && !solved) {
      timerRef.current = setInterval(() => setElapsedMs((t) => t + 1000), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [solved, moveCount]);

  const resetGame = useCallback((count = disks) => {
    setTowers(createInitialTowers(count));
    setSelectedCol(null);
    setMoveCount(0);
    setWrongAttempts(0);
    setError("");
    setSolved(false);
    setHistory([]);
    setElapsedMs(0);
    startedRef.current = false;
    setDragDisk(null);
  }, [disks]);

  function tryMove(from, to) {
    if (solved) return;
    const check = validateHanoiMove(towers, from, to);
    if (!check.ok) {
      setWrongAttempts((w) => w + 1);
      setError(check.reason);
      setSelectedCol(null);
      return;
    }
    if (!startedRef.current) startedRef.current = true;
    setHistory((h) => [...h, towers.map((c) => [...c])]);
    const res = applyHanoiMove(towers, from, to);
    if (res.ok) {
      setTowers(res.towers);
      setMoveCount((m) => m + 1);
      setError("");
      if (isHanoiSolved(res.towers, disks)) setSolved(true);
    }
    setSelectedCol(null);
    setDragDisk(null);
  }

  function onColumnClick(col) {
    if (selectedCol === null) {
      if (!towers[col].length) {
        setError("لا يوجد قرص في هذا العمود.");
        return;
      }
      setSelectedCol(col);
      setError("");
      return;
    }
    tryMove(selectedCol, col);
  }

  function undoMove() {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setTowers(prev);
    setMoveCount((m) => Math.max(0, m - 1));
    setSolved(false);
    setSelectedCol(null);
  }

  const score = solved ? scoreHanoiAttempt(moveCount, disks, wrongAttempts, elapsedMs) : null;

  function renderTowers(stackTowers, interactive = true) {
    return (
      <div className="flex items-end justify-center gap-6 py-4 sm:gap-10">
        {stackTowers.map((stack, col) => (
          <div key={col} className="flex flex-col items-center">
            <div
              className={`relative flex h-44 w-24 flex-col-reverse items-center border-b-4 sm:h-48 sm:w-28 ${
                interactive && selectedCol === col ? "border-cyan-400" : "border-slate-600"
              }`}
              onClick={interactive ? () => onColumnClick(col) : undefined}
              onDragOver={interactive ? (e) => e.preventDefault() : undefined}
              onDrop={
                interactive && dragDisk !== null
                  ? (e) => {
                      e.preventDefault();
                      tryMove(dragDisk.from, col);
                    }
                  : undefined
              }
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : undefined}
              onKeyDown={
                interactive
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") onColumnClick(col);
                    }
                  : undefined
              }
            >
              <div className="absolute bottom-0 h-full w-1 bg-slate-400" />
              {stack.map((d, idx) => (
                <div
                  key={`${col}-${d}-${idx}`}
                  draggable={interactive && idx === stack.length - 1}
                  onDragStart={
                    interactive && idx === stack.length - 1
                      ? () => setDragDisk({ from: col, disk: d })
                      : undefined
                  }
                  className="relative z-10 rounded-md bg-violet-600 text-center text-xs font-bold text-white"
                  style={{ width: `${d * 16 + 28}px`, height: 20, marginBottom: 2 }}
                >
                  {d}
                </div>
              ))}
            </div>
            <span className="mt-2 font-bold text-slate-200">{HANOI_COLUMNS[col]}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-sm text-cyan-100">
        <p className="text-base font-bold text-white">برج هانوي — حلّ بنفسك</p>
        <p className="mt-1">انقل كل الأقراص إلى العمود C دون وضع قرص أكبر فوق أصغر.</p>
        <p className="mt-2 font-mono text-cyan-200" dir="ltr">
          الحد الأدنى = 2^n - 1 = {optimal}
        </p>
        <p className="mt-1 text-xs text-slate-300">
          انقر عمود المصدر ثم الهدف، أو اسحب القرص العلوي.
        </p>
      </div>

      <label className="block">
        <span className="lab-label text-cyan-200">عدد الأقراص (2–6)</span>
        <input
          type="range"
          min={2}
          max={6}
          value={disks}
          onChange={(e) => {
            const n = Number(e.target.value);
            setDisks(n);
            resetGame(n);
            setDemoStep(0);
          }}
          className="w-full accent-violet-500"
        />
      </label>

      {renderTowers(towers, true)}

      {error ? <p className="text-center text-sm text-red-300" role="alert">{error}</p> : null}

      <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-200">
        <span>الحركات: {moveCount}</span>
        <span>محاولات خاطئة: {wrongAttempts}</span>
        <span>الوقت: {Math.floor(elapsedMs / 1000)} ث</span>
      </div>

      {solved && score ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-center">
          <p className="text-lg font-bold text-emerald-300">أحسنت! أكملت اللغز.</p>
          <p className="mt-2 text-sm text-slate-200">
            التقييم: {score.total}/100 — {score.grade} (حركات: {moveCount}/{score.optimal})
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" className="edu-btn edu-btn-outline" onClick={undoMove} disabled={!history.length}>
          تراجع
        </button>
        <button type="button" className="edu-btn edu-btn-outline" onClick={() => resetGame()}>
          إعادة البدء
        </button>
      </div>

      <details className="rounded-xl border border-slate-600 bg-slate-900/50 p-4">
        <summary className="cursor-pointer font-bold text-violet-300">عرض الحل — خطوة بخطوة</summary>
        <div className="mt-4 space-y-3">
          {renderTowers(demoTowers, false)}
          <p className="text-center text-sm text-slate-300">
            خطوة {demoStep} / {solutionMoves.length}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              className="edu-btn edu-btn-outline"
              disabled={demoStep <= 0}
              onClick={() => setDemoStep((s) => s - 1)}
            >
              السابق
            </button>
            <button
              type="button"
              className="edu-btn edu-btn-primary"
              disabled={demoStep >= solutionMoves.length}
              onClick={() => setDemoStep((s) => s + 1)}
            >
              التالي
            </button>
            <button type="button" className="edu-btn edu-btn-outline" onClick={() => setDemoStep(0)}>
              إعادة العرض
            </button>
          </div>
        </div>
      </details>

      <details className="rounded-xl border border-slate-200/20 bg-slate-900/30 p-4">
        <summary className="cursor-pointer font-bold text-slate-200">كود Python (Recursion)</summary>
        <pre className="code-editor mt-3 text-xs" dir="ltr">{`def hanoi(n, a, b, c):
    if n == 1:
        print(f"Move disk 1 from {a} to {c}")
    else:
        hanoi(n-1, a, c, b)
        print(f"Move disk {n} from {a} to {c}")
        hanoi(n-1, b, a, c)

hanoi(${disks}, 'A', 'B', 'C')`}</pre>
      </details>
    </div>
  );
}
