import { renderMixedDirectionText } from "../MixedDirectionText";

export function parseMatchAnswer(raw) {
  if (!raw) return {};
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function MatchQuestion({ question, value, onChange, disabled }) {
  const pairs = parseMatchAnswer(value);
  const left = question.matchLeft || [];
  const right = question.matchRight || [];

  function setPair(leftIdx, rightIdx) {
    if (disabled) return;
    onChange(JSON.stringify({ ...pairs, [String(leftIdx)]: Number(rightIdx) }));
  }

  return (
    <div className="space-y-3" dir="rtl">
      <div className="space-y-2">
        {left.map((label, li) => (
          <div
            key={li}
            className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="font-semibold text-white">{renderMixedDirectionText(label)}</span>
            <select
              className="edu-input max-w-full bg-white/10 text-white sm:max-w-xs"
              value={pairs[String(li)] ?? ""}
              onChange={(e) => setPair(li, e.target.value)}
              disabled={disabled}
              aria-label={`اختيار وظيفة ${label}`}
            >
              <option value="">— اختر الوظيفة —</option>
              {right.map((opt, ri) => (
                <option key={ri} value={ri}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
