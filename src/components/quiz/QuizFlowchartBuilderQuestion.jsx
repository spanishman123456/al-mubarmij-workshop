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

export function QuizFlowchartBuilderQuestion({ question, value, onChange, disabled }) {
  const slots = question.flowSlots || [
    { id: "1", label: "1 — بداية البرنامج" },
    { id: "2", label: "2 — قراءة/إدخال" },
    { id: "3", label: "3 — اختبار شرط" },
    { id: "4", label: "4 — طباعة/معالجة" },
    { id: "5", label: "5 — نهاية البرنامج" },
  ];
  const assignment = parseFlow(value);

  function setSlot(slotId, symbolId) {
    if (disabled) return;
    onChange(JSON.stringify({ ...assignment, [slotId]: symbolId }));
  }

  return (
    <div className="space-y-3" dir="rtl">
      {question.instructionAr ? (
        <p className="rounded-lg bg-violet-950/40 px-3 py-2 text-sm text-violet-100">{question.instructionAr}</p>
      ) : (
        <p className="text-sm text-slate-300">
          اختر الرمز المناسب لكل خطوة في المخطط — لا حاجة لرسم خارجي.
        </p>
      )}
      <div className="mb-3 flex flex-wrap gap-2">
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
      <div className="space-y-2">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm font-semibold text-white">{slot.label}</span>
            <select
              className="edu-input max-w-full bg-white/10 text-white sm:max-w-sm"
              value={assignment[slot.id] ?? ""}
              onChange={(e) => setSlot(slot.id, e.target.value)}
              disabled={disabled}
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
