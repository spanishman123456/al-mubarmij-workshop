#!/usr/bin/env python3
"""Generate docs/day03-coverage.json + docs/day03-coverage-status.md"""
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# id, title, pdfPageIndex, printedPage, route, impl, mode, merged, qa, remaining[]
TOPICS = [
    ("constants", "الثوابت في بايثون", 152, 153, "/lessons/python-constants", "done", "standalone", None, "passed", []),
    ("multi-dim-arrays", "المصفوفات متعددة الأبعاد", 154, 155, "/lessons/python-multi-arrays", "done", "standalone", None, "passed", []),
    ("multi-dim-index", "الفهرسة والوصول والتعديل", 154, 155, "/lessons/python-multi-arrays", "done", "merged", "python-multi-arrays", "passed", []),
    ("break-continue-pass", "break و continue و pass", 156, 157, "/lessons/python-break-continue", "done", "standalone", None, "passed", []),
    ("loop-else", "else المرتبطة بالحلقة", 157, 158, "/lessons/python-break-continue", "done", "merged", "python-break-continue", "passed", []),
    ("divisors-activity", "نشاط المقسومات", 170, 171, "/lessons/divisors-activity", "done", "activity", "divisors-activity", "passed", []),
    ("collatz", "تخمين Collatz", 172, 173, "/lessons/collatz", "done", "standalone", None, "passed", []),
    ("numbers-steps-activity", "نشاط الأرقام والخطوات", 173, 174, "/lessons/numbers-steps-activity", "done", "activity", "numbers-steps-activity", "passed", []),
    ("truth-derive", "اشتقاق جداول الحقيقة", 160, 161, "/lessons/truth-tables", "done", "merged", "truth-tables", "passed", []),
    ("truth-ref-guide", "الدليل المرجعي لجداول الحقيقة والمنطق", 158, 159, "/lessons/truth-tables", "done", "merged", "truth-tables", "passed", []),
    ("truth-tables", "جداول الحقيقة", 160, 161, "/lessons/truth-tables", "done", "standalone", None, "passed", []),
    ("truth-answers", "إجابات جداول الحقيقة", 162, 163, "/teacher/day-03-answers", "done", "teacher-only", None, "passed", []),
    ("gates-ref-guide", "الدليل المرجعي للبوابات المنطقية", 163, 164, "/lessons/logic-gates", "done", "merged", "logic-gates", "passed", []),
    ("logic-gates", "البوابات المنطقية", 165, 166, "/lessons/logic-gates", "done", "standalone", None, "passed", []),
    ("gates-answers", "إجابات البوابات المنطقية", 167, 168, "/teacher/day-03-answers", "done", "teacher-only", None, "passed", []),
    ("teacher-guidance", "المحتوى والإرشادات المخصصة للمعلم", 169, 170, "/teacher/day-03-answers", "done", "teacher-only", None, "passed", []),
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

json_path = ROOT / "docs/day03-coverage.json"
json_path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")

impl_c = Counter(r["implementationStatus"] for r in records)
qa_c = Counter(r["qaStatus"] for r in records)
mode_c = Counter(r["integrationMode"] for r in records)
all_done = all(r["implementationStatus"] == "done" for r in records)

lines = [
    "# حالة تغطية اليوم الثالث",
    "",
    "**حدود اليوم 3:** pdfPageIndex ~152–174",
    f"**الحالة العامة:** {'✅ **مكتمل**' if all_done else '⏳ **غير مكتمل**'} — `implementationStatus` منفصل عن `integrationMode`.",
    "",
    "> **merged** = طريقة دمج المحتوى — **لا يعني اكتمالاً تلقائياً**. راجع `implementationStatus`.",
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
for st in ("done", "partial", "pending", "not-applicable"):
    if impl_c.get(st, 0):
        lines.append(f"| {st} | {impl_c[st]} |")

lines += ["", "## ملخص integrationMode", "", "| الوضع | العدد |", "|---|---:|"]
for st in ("standalone", "merged", "activity", "lab", "teacher-only"):
    if mode_c.get(st, 0):
        lines.append(f"| {st} | {mode_c[st]} |")

lines += ["", "## ملخص qaStatus", "", "| QA | العدد |", "|---|---:|"]
for st in ("passed", "failed", "not-tested"):
    if qa_c.get(st, 0):
        lines.append(f"| {st} | {qa_c[st]} |")

(ROOT / "docs/day03-coverage-status.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Wrote {len(records)} records to {json_path}")
