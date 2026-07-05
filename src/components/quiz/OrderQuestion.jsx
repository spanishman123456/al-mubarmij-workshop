function parseOrderAnswer(raw, length) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* ignore */
    }
  }
  return Array.from({ length }, (_, i) => i);
}

export function OrderQuestion({ question, value, onChange, disabled }) {
  const items = question.orderItems || [];
  const order = parseOrderAnswer(value, items.length);

  function move(idx, dir) {
    if (disabled) return;
    const next = [...order];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(JSON.stringify(next));
  }

  return (
    <div className="space-y-3" dir="rtl" data-testid="quiz-order">
      {question.instructionAr ? (
        <p className="rounded-lg bg-violet-950/40 px-3 py-2 text-sm text-violet-100">{question.instructionAr}</p>
      ) : null}
      <ol className="space-y-2">
        {order.map((itemIdx, pos) => (
          <li
            key={itemIdx}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold">
              {pos + 1}
            </span>
            <span className="flex-1 text-sm text-white">{items[itemIdx]}</span>
            <div className="flex gap-1">
              <button
                type="button"
                className="rounded border border-white/20 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-40"
                onClick={() => move(pos, -1)}
                disabled={disabled || pos === 0}
                aria-label="تحريك لأعلى"
              >
                ↑
              </button>
              <button
                type="button"
                className="rounded border border-white/20 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-40"
                onClick={() => move(pos, 1)}
                disabled={disabled || pos === order.length - 1}
                aria-label="تحريك لأسفل"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
