import { useMemo } from "react";
import { fromBaseToDecimalSteps, decimalToBaseSteps, formatWithBase } from "../../lib/numberSystems/conversions";

/**
 * جدول القيمة المكانية المرئي — لكل مثال تحويل إلى العشري أو من العشري
 */
export function PlaceValueTable({ value, base, mode = "toDecimal", titleAr }) {
  const data = useMemo(() => {
    if (mode === "toDecimal") {
      return fromBaseToDecimalSteps(value, base);
    }
    const dec = Number(value);
    if (Number.isNaN(dec)) return { ok: false, error: "أدخل عدداً عشرياً صالحاً." };
    return decimalToBaseSteps(dec, base);
  }, [value, base, mode]);

  if (!data.ok) {
    return <p className="text-sm text-red-600">{data.error}</p>;
  }

  if (mode === "toDecimal") {
    return (
      <div className="overflow-x-auto" dir="rtl">
        {titleAr ? <h4 className="mb-2 font-bold text-slate-800">{titleAr}</h4> : null}
        <p className="mb-2 text-sm text-slate-600">
          تحويل {formatWithBase(data.input, data.base)} إلى العشري — اضرب كل رقم في قيمة منزلته ثم اجمع.
        </p>
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="bg-violet-100 text-violet-900">
              <th className="border border-violet-200 px-2 py-2">رقم المنزلة</th>
              <th className="border border-violet-200 px-2 py-2">قوة الأساس</th>
              <th className="border border-violet-200 px-2 py-2">قيمة القوة</th>
              <th className="border border-violet-200 px-2 py-2">الرقم</th>
              <th className="border border-violet-200 px-2 py-2">ناتج الضرب</th>
            </tr>
          </thead>
          <tbody>
            {[...data.rows].reverse().map((row) => (
              <tr key={row.position} className="text-center">
                <td className="border border-slate-200 px-2 py-2">{row.position}</td>
                <td className="border border-slate-200 px-2 py-2" dir="ltr">
                  {row.powerExpression}
                </td>
                <td className="border border-slate-200 px-2 py-2">{row.powerValue}</td>
                <td className="border border-slate-200 px-2 py-2 font-bold">{row.digit}</td>
                <td className="border border-slate-200 px-2 py-2">{row.product}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-emerald-50 font-bold">
              <td colSpan={4} className="border border-emerald-200 px-2 py-2 text-right">
                المجموع النهائي
              </td>
              <td className="border border-emerald-200 px-2 py-2">{data.decimal}</td>
            </tr>
          </tfoot>
        </table>
        <p className="mt-2 text-sm font-semibold text-emerald-800" dir="ltr">
          = {formatWithBase(data.decimal, 10)}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" dir="rtl">
      {titleAr ? <h4 className="mb-2 font-bold text-slate-800">{titleAr}</h4> : null}
      <p className="mb-2 text-sm text-slate-600">
        تحويل {data.decimal}₁₀ إلى أساس {data.base} — قسمة متكررة، ثم اقرأ البواقي من الأسفل إلى الأعلى.
      </p>
      <table className="w-full min-w-[28rem] border-collapse text-sm">
        <thead>
          <tr className="bg-cyan-100 text-cyan-900">
            <th className="border px-2 py-2">العدد قبل القسمة</th>
            <th className="border px-2 py-2">÷ الأساس</th>
            <th className="border px-2 py-2">ناتج القسمة</th>
            <th className="border px-2 py-2">الباقي</th>
          </tr>
        </thead>
        <tbody>
          {data.divisions.map((d, i) => (
            <tr key={i} className="text-center">
              <td className="border px-2 py-2">{d.dividend}</td>
              <td className="border px-2 py-2">{d.divisor}</td>
              <td className="border px-2 py-2">{d.quotient}</td>
              <td className="border px-2 py-2 font-bold">{d.remainderDigit}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-emerald-50 font-bold">
            <td colSpan={2} className="border px-2 py-2 text-right">
              قراءة البواقي (من الأسفل ↑)
            </td>
            <td colSpan={2} className="border px-2 py-2" dir="ltr">
              {data.resultFormatted}
            </td>
          </tr>
        </tfoot>
      </table>
      {data.verifyOk ? (
        <p className="mt-2 text-sm text-emerald-700">✓ التحقق العكسي: {data.result} → {data.decimal} عشري</p>
      ) : null}
    </div>
  );
}
