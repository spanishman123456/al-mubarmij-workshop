import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { curriculumUnits, GRADES } from "../data/curriculum";

export default function CurriculumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-16 pt-24 font-ar">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">المسار الدراسي للورشة</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            هيكل كامل: <strong>وحدات</strong> و<strong>دروس</strong> و<strong>تمارين بايثون</strong> مرتبطة — مُحاذى
            لمقرر «برمجة الحاسب»؛ يمكن مطابقة النصوص حرفياً مع ملف المقرر الرسمي عند توفره.
          </p>
        </motion.div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {GRADES.map((g) => (
            <span
              key={g.id}
              className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm text-violet-800"
            >
              {g.labelAr}
            </span>
          ))}
        </div>

        <ul className="space-y-5">
          {curriculumUnits.map((u, idx) => (
            <motion.li
              key={u.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs font-medium text-violet-600">{u.weekHint}</p>
                  <h2 className="text-xl font-bold text-slate-900">{u.titleAr}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{u.summaryAr}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    عدد الدروس: <strong>{u.lessons?.length ?? 0}</strong>
                  </p>
                </div>
                <Link
                  to={`/curriculum/unit/${u.id}`}
                  className="shrink-0 rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-500"
                >
                  عرض الوحدة
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {u.grades.map((gid) => (
                  <span key={gid} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                    {GRADES.find((x) => x.id === gid)?.labelAr ?? gid}
                  </span>
                ))}
                {u.tags.map((t) => (
                  <span key={t} className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
                    {t}
                  </span>
                ))}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
