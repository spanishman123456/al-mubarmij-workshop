const SYMBOLS = [
  { id: "oval", label: "بيضاوي — بداية/نهاية", emoji: "⬭" },
  { id: "parallelogram", label: "متوازي أضلاع — إدخال/إخراج", emoji: "▱" },
  { id: "rectangle", label: "مستطيل — عملية", emoji: "▭" },
  { id: "diamond", label: "معيّن — شرط", emoji: "◇" },
];

function parseFlow(raw) {
  if (!raw) return {};
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function SymbolLegend() {
  return (
    <div className="mb-3 flex flex-wrap gap-2" data-testid="flowchart-legend">
      {SYMBOLS.map((s) => (
        <span
          key={s.id}
          className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200"
          title={s.label}
        >
          {s.emoji} {s.label.split(" — ")[0]}
        </span>
      ))}
    </div>
  );
}

/** Match each flowchart symbol to its role (pre-19 style). */
function FlowchartSymbolMatchMode({ question, assignment, disabled, onAssign }) {
  const symbols = question.flowMatchSymbols || SYMBOLS.map((s) => ({ id: s.id, label: s.label.split(" — ")[0], emoji: s.emoji }));
  const roles =
    question.flowRoleOptions || [
      { id: "start-end", label: "بداية أو نهاية" },
      { id: "io", label: "إدخال أو إخراج" },
      { id: "decision", label: "اختبار شرط" },
      { id: "process", label: "تنفيذ عملية (طباعة/معالجة)" },
    ];

  return (
    <div className="space-y-2" data-testid="flowchart-symbol-match">
      {symbols.map((sym) => (
        <div
          key={sym.id}
          className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="text-lg" aria-hidden>
              {sym.emoji || "◆"}
            </span>
            {sym.label}
          </span>
          <select
            className="edu-input max-w-full bg-white/10 text-white sm:max-w-sm"
            value={assignment[sym.id] ?? ""}
            onChange={(e) => onAssign(sym.id, e.target.value)}
            disabled={disabled}
            data-testid={`flowchart-symbol-${sym.id}`}
            aria-label={`وظيفة ${sym.label}`}
          >
            <option value="">— اختر الوظيفة —</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

/** Assign a flowchart symbol to each algorithm step (pre-18-flow style). */
function FlowchartSlotMode({ question, assignment, disabled, onAssign }) {
  const slots = question.flowSlots || [
    { id: "1", label: "1 — بداية البرنامج" },
    { id: "2", label: "2 — قراءة/إدخال" },
    { id: "3", label: "3 — اختبار شرط" },
    { id: "4", label: "4 — طباعة/معالجة" },
    { id: "5", label: "5 — نهاية البرنامج" },
  ];

  return (
    <div className="space-y-2" data-testid="flowchart-slot-builder">
      {slots.map((slot) => (
        <div
          key={slot.id}
          className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="text-sm font-semibold text-white">{slot.label}</span>
          <select
            className="edu-input max-w-full bg-white/10 text-white sm:max-w-sm"
            value={assignment[slot.id] ?? ""}
            onChange={(e) => onAssign(slot.id, e.target.value)}
            disabled={disabled}
            data-testid={`flowchart-slot-${slot.id}`}
            aria-label={`رمز ${slot.label}`}
          >
            <option value="">— اختر الرمز —</option>
            {SYMBOLS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.emoji} {s.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export function QuizFlowchartBuilderQuestion({ question, value, onChange, disabled }) {
  const assignment = parseFlow(value);
  const isSymbolMatch = Boolean(question.flowMatchSymbols?.length);

  function setAssignment(key, val) {
    if (disabled) return;
    onChange(JSON.stringify({ ...assignment, [key]: val }));
  }

  return (
    <div className="space-y-3" dir="rtl" data-testid="quiz-flowchart">
      {question.instructionAr ? (
        <p className="rounded-lg bg-violet-950/40 px-3 py-2 text-sm text-violet-100">{question.instructionAr}</p>
      ) : (
        <p className="text-sm text-slate-300">
          {isSymbolMatch
            ? "اختر الوظيفة المناسبة لكل رمز في مخطط التدفق — داخل المنصة دون رسم خارجي."
            : "اختر الرمز المناسب لكل خطوة في المخطط — لا حاجة لرسم خارجي."}
        </p>
      )}
      {!isSymbolMatch ? <SymbolLegend /> : null}
      {isSymbolMatch ? (
        <FlowchartSymbolMatchMode
          question={question}
          assignment={assignment}
          disabled={disabled}
          onAssign={setAssignment}
        />
      ) : (
        <FlowchartSlotMode question={question} assignment={assignment} disabled={disabled} onAssign={setAssignment} />
      )}
    </div>
  );
}

export function gradeFlowchartAnswer(question, userAnswer) {
  const expected = question.correctFlow || {};
  const assignment = parseFlow(userAnswer);
  const keys = Object.keys(expected);
  if (!keys.length) return false;
  return keys.every((k) => assignment[k] === expected[k]);
}
