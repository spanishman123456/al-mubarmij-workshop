#!/usr/bin/env python3
"""Generate docs/day04-coverage.json + docs/day04-coverage-status.md (Day 4 scaffold)."""
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TOPICS = [
    ("karnaugh-intro", "مقدمة خريطة كارنوف", 190, 191, "/lessons/karnaugh-maps", "pending", "standalone", None, "pending", ["lesson content", "KarnaughMapLab"]),
    ("karnaugh-applications", "تطبيقات على خريطة كارنوف", 192, 193, "/lessons/karnaugh-maps", "pending", "merged", "karnaugh-maps", "pending", ["guided exercises"]),
    ("logic-equivalence", "الاقترانات المنطقية والمكافئات", 194, 195, "/lessons/logic-equivalence", "pending", "standalone", None, "pending", ["truth-table tie-in"]),
    ("tuples-intro", "الحقول المترابطة (Tuples)", 196, 197, "/lessons/python-tuples", "pending", "standalone", None, "pending", ["TupleLab"]),
    ("tuples-applications", "تطبيقات على الحقول المترابطة", 198, 199, "/lessons/python-tuples", "pending", "merged", "python-tuples", "pending", []),
    ("nested-loops-program", "برنامج الحلقات المتداخلة", 200, 201, "/lessons/nested-loops-lab", "pending", "standalone", None, "pending", ["NestedLoopsLab"]),
    ("nested-loops-applications", "تطبيقات على برنامج الحلقات", 202, 203, "/lessons/nested-loops-lab", "pending", "merged", "nested-loops-lab", "pending", []),
    ("karnaugh-answers", "إجابات خريطة كارنوف", 204, 205, "/teacher/day-04-answers", "pending", "teacher-only", None, "pending", ["teacher API route"]),
    ("equivalence-answers", "إجابات الاقترانات المنطقية", 206, 207, "/teacher/day-04-answers", "pending", "teacher-only", None, "pending", []),
    ("tuples-answers", "إجابات الحقول المترابطة", 208, 209, "/teacher/day-04-answers", "pending", "teacher-only", None, "pending", []),
    ("teacher-guidance", "إرشادات المعلم — اليوم الرابع", 210, 211, "/teacher/day-04-answers", "pending", "teacher-only", None, "pending", []),
]

records = []
for t in TOPICS:
    tid, title, pdf_idx, printed, route, impl, mode, merged, qa, remaining = t
    records.append({
        "id": tid,
        "titleAr": title,
        "pdfPageIndex": pdf_idx,
        "printedPageNumber": printed,
        "route": route,
        "implementationStatus": impl,
        "integrationMode": mode,
        "mergedInto": merged,
        "qaStatus": qa,
        "remainingWork": remaining,
    })

json_path = ROOT / "docs/day04-coverage.json"
json_path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")

impl_c = Counter(r["implementationStatus"] for r in records)
qa_c = Counter(r["qaStatus"] for r in records)

lines = [
    "# حالة تغطية اليوم الرابع",
    "",
    "**حدود اليوم 4 (تقديري):** pdfPageIndex ~190–211",
    "**الحالة العامة:** ⏳ **بدء التخطيط** — جميع العناصر `pending` حتى الدفعة 8.",
    "",
    "| # | الموضوع | pdf | print | implementation | integration | mergedInto | qa | المتبقي |",
    "|---:|---|---:|---:|---|---|---|---|---|",
]

for n, r in enumerate(records, 1):
    merged = f"`{r['mergedInto']}`" if r["mergedInto"] else "—"
    rem = "—" if not r["remainingWork"] else "؛ ".join(r["remainingWork"])
    lines.append(
        f"| {n} | {r['titleAr']} | {r['pdfPageIndex']} | {r['printedPageNumber']} | **{r['implementationStatus']}** | {r['integrationMode']} | {merged} | {r['qaStatus']} | {rem} |"
    )

lines += ["", "## ملخص implementationStatus", "", "| الحالة | العدد |", "|---|---:|"]
for st in ("done", "partial", "pending"):
    if impl_c.get(st, 0):
        lines.append(f"| {st} | {impl_c[st]} |")

lines += ["", "## ملخص qaStatus", "", "| QA | العدد |", "|---|---:|"]
for st in ("passed", "pending"):
    if qa_c.get(st, 0):
        lines.append(f"| {st} | {qa_c[st]} |")

(ROOT / "docs/day04-coverage-status.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Wrote {len(records)} Day 4 topics (all pending)")
