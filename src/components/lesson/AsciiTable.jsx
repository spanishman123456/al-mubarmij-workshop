import { useMemo, useState } from "react";

const SAMPLE_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function charInfo(ch) {
  const code = ch.charCodeAt(0);
  const hex = code.toString(16).toUpperCase().padStart(2, "0");
  return { ch, code, hex };
}

export function AsciiTable({ highlightChar = "A" }) {
  const [selected, setSelected] = useState(highlightChar);
  const [input, setInput] = useState("");

  const info = useMemo(() => {
    if (!selected || selected.length === 0) return null;
    return charInfo(selected[0]);
  }, [selected]);

  const decoded = useMemo(() => {
    const parts = input
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map((n) => Number(n));
    if (parts.some((n) => Number.isNaN(n) || n < 0 || n > 1114111)) return null;
    try {
      return parts.map((n) => String.fromCharCode(n)).join("");
    } catch {
      return null;
    }
  }, [input]);

  return (
    <div className="space-y-4" dir="rtl">
      <p className="text-sm text-slate-600">
        انقر حرفاً لعرض ord (ASCII/Unicode). جرب chr بإدخال أرقام مفصولة بمسافات.
      </p>
      <div className="flex flex-wrap gap-1">
        {SAMPLE_CHARS.split("").map((ch) => {
          const { code } = charInfo(ch);
          const active = selected === ch;
          return (
            <button
              key={ch}
              type="button"
              onClick={() => setSelected(ch)}
              className={`min-w-[2rem] rounded border px-2 py-1 text-sm font-mono ${
                active ? "border-violet-600 bg-violet-100" : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
              dir="ltr"
              title={`${code}`}
            >
              {ch}
            </button>
          );
        })}
      </div>

      {info ? (
        <table className="w-full max-w-md border-collapse text-sm">
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-semibold">الحرف</td>
              <td className="py-2 font-mono" dir="ltr">
                {info.ch}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-semibold">ord (عشري)</td>
              <td className="py-2 font-mono">{info.code}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-semibold">hex</td>
              <td className="py-2 font-mono">0x{info.hex}</td>
            </tr>
            <tr>
              <td className="py-2 font-semibold">chr في بايثون</td>
              <td className="py-2 font-mono" dir="ltr">
                chr({info.code})
              </td>
            </tr>
          </tbody>
        </table>
      ) : null}

      <div>
        <label className="text-sm font-semibold">فك ترميز: أدخل ord مفصولاً بمسافات</label>
        <input
          className="mt-1 w-full max-w-md rounded border px-3 py-2 font-mono text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="72 105"
          dir="ltr"
        />
        {decoded ? (
          <p className="mt-2 text-emerald-700">
            النتيجة: <span dir="ltr">{decoded}</span>
          </p>
        ) : input ? (
          <p className="mt-2 text-red-600 text-sm">أدخل أرقاماً صالحة (0–1114111)</p>
        ) : null}
      </div>
    </div>
  );
}
