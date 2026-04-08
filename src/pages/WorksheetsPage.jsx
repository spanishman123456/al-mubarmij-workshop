import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { curriculumUnits } from "../data/curriculum";
import { worksheets, worksheetsIntroAr } from "../data/worksheets";

function unitTitle(unitId) {
  return curriculumUnits.find((u) => u.id === unitId)?.titleAr ?? unitId;
}

export default function WorksheetsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const unitParam = searchParams.get("unit");
  const filter =
    unitParam && curriculumUnits.some((u) => u.id === unitParam) ? unitParam : "all";

  const list = useMemo(() => {
    if (filter === "all") return worksheets;
    return worksheets.filter((w) => w.unitId === filter);
  }, [filter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20 pt-24 font-ar">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">أوراق العمل</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            {worksheetsIntroAr} الموضوعات متوافقة مع{" "}
            <Link to="/curriculum" className="font-semibold text-violet-700 underline-offset-2 hover:underline">
              المسار الدراسي
            </Link>{" "}
            والمواد في المقرر (PDF).
          </p>
        </div>

        <div className="no-print mb-8 flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-600">فلتر الوحدة:</label>
          <select
            dir="ltr"
            value={filter}
            onChange={(e) => {
              const v = e.target.value;
              setSearchParams(v === "all" ? {} : { unit: v });
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="all">كل الوحدات</option>
            {curriculumUnits.map((u) => (
              <option key={u.id} value={u.id}>
                {u.titleAr}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-violet-300 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-100"
          >
            طباعة الصفحة الحالية
          </button>
        </div>

        <ul className="space-y-8 print:space-y-6">
          {list.map((ws) => (
            <li
              key={ws.id}
              className="print-area rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:border-slate-400 print:shadow-none"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <p className="text-xs font-medium text-violet-600">{unitTitle(ws.unitId)}</p>
                  <h2 className="text-xl font-bold text-slate-900">{ws.titleAr}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  طباعة
                </button>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-slate-600">{ws.introAr}</p>
              <ol className="list-none space-y-4">
                {ws.tasks.map((t) => (
                  <li key={t.n} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                    <span className="font-bold text-violet-700">السؤال {t.n}.</span>
                    <p className="mt-2 text-sm leading-relaxed text-slate-800">{t.textAr}</p>
                    <div className="mt-6 min-h-[4rem] border-t border-dashed border-slate-200 pt-2 print:min-h-[5rem]">
                      <span className="text-xs text-slate-400">مساحة الإجابة:</span>
                    </div>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>

        {list.length === 0 && <p className="text-center text-slate-500">لا توجد أوراق لهذا الفلتر.</p>}
      </div>
    </div>
  );
}
