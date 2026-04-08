import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getUnitById, GRADES } from "../data/curriculum";

export default function UnitPage() {
  const { unitId } = useParams();
  const unit = getUnitById(unitId ?? "");

  if (!unit) {
    return (
      <div className="min-h-screen bg-slate-50 pb-16 pt-28 text-center font-ar">
        <p className="text-slate-600">الوحدة غير موجودة.</p>
        <Link to="/curriculum" className="mt-4 inline-block text-violet-700 underline">
          العودة للمسار
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-16 pt-24 font-ar">
      <div className="mx-auto max-w-3xl px-4">
        <nav className="mb-6 text-sm text-slate-500">
          <Link to="/curriculum" className="text-violet-700 hover:underline">
            المسار الدراسي
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">{unit.titleAr}</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-medium text-violet-600">{unit.weekHint}</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{unit.titleAr}</h1>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">{unit.summaryAr}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {unit.grades.map((gid) => (
              <span key={gid} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                {GRADES.find((g) => g.id === gid)?.labelAr}
              </span>
            ))}
            {unit.tags.map((t) => (
              <span key={t} className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        <h2 className="mb-4 mt-10 text-xl font-bold text-slate-900">الدروس</h2>
        <ol className="space-y-3">
          {(unit.lessons ?? []).map((le, idx) => (
            <motion.li
              key={le.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Link
                to={`/curriculum/unit/${unit.id}/lesson/${le.id}`}
                className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md"
              >
                <span className="text-sm text-violet-600">
                  الدرس {idx + 1}: {le.titleAr}
                </span>
                <p className="mt-1 text-sm text-slate-600">{le.summaryAr}</p>
              </Link>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
