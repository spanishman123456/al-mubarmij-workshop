/**
 * مخطط مقارنة التقويم القبلي والبعدي — SVG بدون مكتبات خارجية
 */
import { buildAssessmentSummary } from "../../lib/assessmentSummary.js";

export function PrePostComparisonChart({ students, className = "" }) {
  const data = students
    .map(({ student, progress, stats }) => {
      const summary =
        stats?.assessmentSummary ??
        buildAssessmentSummary(progress, { publishedDays: stats?.publishedDays ?? 15 });
      return {
        name: student.nameAr,
        pre: summary.preAssessment?.scorePercent ?? null,
        post: summary.postAssessment?.scorePercent ?? null,
      };
    })
    .filter((d) => d.pre != null || d.post != null);

  if (!data.length) {
    return (
      <div className={`rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600 ${className}`}>
        لا توجد نتائج قبلية أو بعدية مسجّلة بعد. يبدأ الطلاب بالتقويم القبلي من صفحة الاختبارات.
      </div>
    );
  }

  const chartW = 640;
  const chartH = 220;
  const padL = 36;
  const padB = 48;
  const padT = 16;
  const barGroupW = Math.min(48, (chartW - padL - 20) / data.length - 8);
  const gap = 6;
  const innerH = chartH - padB - padT;

  const avgPre = average(data.map((d) => d.pre));
  const avgPost = average(data.map((d) => d.post));

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">مقارنة التقويم القبلي والبعدي</h3>
          <p className="text-sm text-slate-600">لكل طالب — أزرق: قبلي | أخضر: بعدي</p>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-sky-700">
            متوسط قبلي: <strong>{avgPre != null ? `${Math.round(avgPre)}%` : "—"}</strong>
          </span>
          <span className="text-emerald-700">
            متوسط بعدي: <strong>{avgPost != null ? `${Math.round(avgPost)}%` : "—"}</strong>
          </span>
          {avgPre != null && avgPost != null ? (
            <span className="text-violet-700">
              نمو الصف: <strong>{avgPost - avgPre >= 0 ? "+" : ""}{Math.round(avgPost - avgPre)}%</strong>
            </span>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="min-w-[320px] w-full" role="img" aria-label="مخطط مقارنة قبلي وبعدي">
          {/* grid */}
          {[0, 25, 50, 75, 100].map((pct) => {
            const y = padT + innerH - (pct / 100) * innerH;
            return (
              <g key={pct}>
                <line x1={padL} y1={y} x2={chartW - 8} y2={y} stroke="#e2e8f0" strokeWidth={1} />
                <text x={padL - 6} y={y + 4} textAnchor="end" fontSize={9} fill="#64748b">
                  {pct}
                </text>
              </g>
            );
          })}

          {data.map((d, i) => {
            const gx = padL + i * (barGroupW * 2 + gap + 12) + 8;
            const preH = d.pre != null ? (d.pre / 100) * innerH : 0;
            const postH = d.post != null ? (d.post / 100) * innerH : 0;
            const baseY = padT + innerH;
            const label = d.name.split(" ")[0];

            return (
              <g key={d.name}>
                {d.pre != null ? (
                  <rect
                    x={gx}
                    y={baseY - preH}
                    width={barGroupW}
                    height={preH}
                    rx={3}
                    fill="#0ea5e9"
                    opacity={0.85}
                  />
                ) : null}
                {d.post != null ? (
                  <rect
                    x={gx + barGroupW + 2}
                    y={baseY - postH}
                    width={barGroupW}
                    height={postH}
                    rx={3}
                    fill="#10b981"
                    opacity={0.85}
                  />
                ) : null}
                <text
                  x={gx + barGroupW}
                  y={baseY + 14}
                  textAnchor="middle"
                  fontSize={8}
                  fill="#334155"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 flex gap-4 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-sky-500" /> قبلي
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-emerald-500" /> بعدي
        </span>
      </div>
    </div>
  );
}

function average(nums) {
  const valid = nums.filter((n) => n != null);
  if (!valid.length) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}
