import { useMemo, useState } from "react";

function hanoiMoves(n, from = 0, to = 2, aux = 1, moves = []) {
  if (n === 1) {
    moves.push({ disk: 1, from, to });
    return moves;
  }
  hanoiMoves(n - 1, from, aux, to, moves);
  moves.push({ disk: n, from, to });
  hanoiMoves(n - 1, aux, to, from, moves);
  return moves;
}

const COLS = ["A", "B", "C"];

export function HanoiSim() {
  const [disks, setDisks] = useState(3);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);

  const moves = useMemo(() => hanoiMoves(Math.min(Math.max(disks, 2), 6)), [disks]);
  const optimal = 2 ** disks - 1;

  const towers = useMemo(() => {
    const t = [[], [], []];
    for (let d = disks; d >= 1; d--) t[0].push(d);
    for (let i = 0; i < step && i < moves.length; i++) {
      const m = moves[i];
      const disk = t[m.from].pop();
      if (disk) t[m.to].push(disk);
    }
    return t;
  }, [disks, moves, step]);

  function reset() {
    setStep(0);
    setAuto(false);
  }

  function runAuto() {
    setAuto(true);
    let s = 0;
    const id = setInterval(() => {
      s += 1;
      setStep(s);
      if (s >= moves.length) {
        clearInterval(id);
        setAuto(false);
      }
    }, 700);
  }

  const currentMove = step > 0 && step <= moves.length ? moves[step - 1] : null;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-xl bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-bold">برج هانوي</p>
        <p className="mt-1">انقل كل الأقراص إلى العمود الأخير دون وضع قرص أكبر فوق أصغر.</p>
        <p className="mt-2 font-mono" dir="ltr">
          الحد الأدنى للنقلات = 2^n - 1 = {optimal}
        </p>
      </div>

      <label className="block">
        <span className="lab-label">عدد الأقراص (2–6)</span>
        <input
          type="range"
          min={2}
          max={6}
          value={disks}
          onChange={(e) => {
            setDisks(Number(e.target.value));
            reset();
          }}
          className="w-full"
        />
      </label>

      <div className="flex items-end justify-center gap-8 py-6">
        {towers.map((stack, col) => (
          <div key={col} className="flex flex-col items-center">
            <div className="relative flex h-40 w-24 flex-col-reverse items-center border-b-4 border-slate-600">
              <div className="absolute bottom-0 h-full w-1 bg-slate-400" />
              {stack.map((d) => (
                <div
                  key={`${col}-${d}`}
                  className="relative z-10 rounded-md bg-violet-600 text-center text-xs font-bold text-white"
                  style={{ width: `${d * 18 + 24}px`, height: 18, marginBottom: 2 }}
                >
                  {d}
                </div>
              ))}
            </div>
            <span className="mt-2 font-bold text-slate-700">{COLS[col]}</span>
          </div>
        ))}
      </div>

      {currentMove ? (
        <p className="text-center text-sm font-medium text-violet-800">
          الخطوة {step}: انقل القرص {currentMove.disk} من {COLS[currentMove.from]} إلى {COLS[currentMove.to]}
        </p>
      ) : null}

      <p className="text-center text-sm text-slate-600">
        النقلات: {step} / {optimal}
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" className="edu-btn edu-btn-outline" disabled={step <= 0} onClick={() => setStep((s) => s - 1)}>
          السابق
        </button>
        <button
          type="button"
          className="edu-btn edu-btn-primary"
          disabled={step >= moves.length}
          onClick={() => setStep((s) => Math.min(moves.length, s + 1))}
        >
          التالي
        </button>
        <button type="button" className="edu-btn edu-btn-outline" disabled={auto} onClick={runAuto}>
          تشغيل تلقائي
        </button>
        <button type="button" className="edu-btn edu-btn-outline" onClick={reset}>
          إعادة
        </button>
      </div>

      <details className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer font-bold">كود Python (Recursion)</summary>
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
