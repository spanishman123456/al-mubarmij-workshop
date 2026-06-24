import { useState } from "react";

const LEVELS = {
  easy: [
    { gate: "AND", inputs: [[0, 0], [0, 1], [1, 0], [1, 1]], hint: "الناتج 1 فقط عندما يكون كلا المدخلين 1" },
    { gate: "OR", inputs: [[0, 0], [0, 1], [1, 0], [1, 1]], hint: "الناتج 1 إذا كان أحد المدخلين على الأقل 1" },
    { gate: "NOT", inputs: [[0], [1]], unary: true, hint: "يعكس القيمة" },
  ],
  medium: [
    { gate: "XOR", inputs: [[0, 0], [0, 1], [1, 0], [1, 1]], hint: "1 عندما يختلف المدخلان" },
    { gate: "NAND", inputs: [[0, 0], [0, 1], [1, 0], [1, 1]], hint: "عكس AND" },
    { gate: "NOR", inputs: [[0, 0], [0, 1], [1, 0], [1, 1]], hint: "1 فقط عندما يكون كلا المدخلين 0" },
  ],
  advanced: [
    { gate: "XNOR", inputs: [[0, 0], [0, 1], [1, 0], [1, 1]], hint: "1 عندما يتطابق المدخلان" },
    {
      expr: "(A AND B) OR (NOT A)",
      inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
      custom: (a, b) => (a && b) || !a,
      hint: "احسب A AND B ثم OR مع NOT A",
    },
  ],
};

const OPS = {
  AND: (a, b) => (a && b ? 1 : 0),
  OR: (a, b) => (a || b ? 1 : 0),
  NAND: (a, b) => (a && b ? 0 : 1),
  NOR: (a, b) => (a || b ? 0 : 1),
  XOR: (a, b) => (a !== b ? 1 : 0),
  XNOR: (a, b) => (a === b ? 1 : 0),
  NOT: (a) => (a ? 0 : 1),
};

export function TruthTableExercises() {
  const [level, setLevel] = useState("easy");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [hints, setHints] = useState(0);

  const exercises = LEVELS[level];
  const ex = exercises[idx % exercises.length];
  const label = ex.gate || ex.expr;

  function expected(row) {
    if (ex.custom) return ex.custom(row[0], row[1]);
    if (ex.unary) return OPS.NOT(row[0]);
    return OPS[ex.gate](row[0], row[1]);
  }

  function check() {
    setAttempted(true);
  }

  function allCorrect() {
    return ex.inputs.every((row, i) => Number(answers[i]) === expected(row));
  }

  function next() {
    setIdx((i) => i + 1);
    setAnswers({});
    setAttempted(false);
    setHints(0);
  }

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex flex-wrap gap-2">
        {Object.keys(LEVELS).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => {
              setLevel(l);
              setIdx(0);
              setAnswers({});
              setAttempted(false);
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
              level === l ? "bg-violet-700 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {l === "easy" ? "سهل" : l === "medium" ? "متوسط" : "متقدم"}
          </button>
        ))}
      </div>

      <p className="font-bold text-slate-800">أكمل جدول الحقيقة لـ: {label}</p>

      <table className="w-full max-w-md border-collapse text-center text-sm">
        <thead>
          <tr className="bg-violet-100">
            {!ex.unary ? (
              <>
                <th className="border p-2">A</th>
                <th className="border p-2">B</th>
              </>
            ) : (
              <th className="border p-2">A</th>
            )}
            <th className="border p-2">Y</th>
          </tr>
        </thead>
        <tbody>
          {ex.inputs.map((row, i) => (
            <tr key={i}>
              {!ex.unary ? (
                <>
                  <td className="border p-2 font-mono">{row[0]}</td>
                  <td className="border p-2 font-mono">{row[1]}</td>
                </>
              ) : (
                <td className="border p-2 font-mono">{row[0]}</td>
              )}
              <td className="border p-2">
                <select
                  className="edu-select edu-select-compact w-full max-w-[5rem]"
                  value={answers[i] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                  disabled={attempted}
                >
                  <option value="">؟</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                </select>
                {attempted ? (
                  <span className={`mr-2 text-xs ${Number(answers[i]) === expected(row) ? "text-emerald-600" : "text-red-600"}`}>
                    {expected(row)}
                  </span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-wrap gap-2">
        {!attempted ? (
          <>
            <button type="button" className="edu-btn edu-btn-primary" onClick={check}>
              تحقق من الإجابة
            </button>
            <button
              type="button"
              className="edu-btn edu-btn-outline"
              onClick={() => setHints((h) => h + 1)}
            >
              تلميح ({hints}/2)
            </button>
          </>
        ) : (
          <button type="button" className="edu-btn edu-btn-primary" onClick={next}>
            تمرين تالي
          </button>
        )}
      </div>

      {hints > 0 && !attempted ? <p className="text-sm text-amber-800">تلميح: {ex.hint}</p> : null}

      {attempted ? (
        <div className="rounded-lg bg-slate-50 p-4 text-sm">
          <p className={`font-bold ${allCorrect() ? "text-emerald-700" : "text-red-700"}`}>
            {allCorrect() ? "ممتاز! جميع الإجابات صحيحة." : "راجع الصفوف الخاطئة — الحل معروض بجانب كل خانة."}
          </p>
          <p className="mt-2 text-slate-600">شرح: {ex.hint}</p>
        </div>
      ) : null}
    </div>
  );
}
