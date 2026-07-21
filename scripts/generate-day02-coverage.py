#!/usr/bin/env python3
"""Generate docs/day02-coverage.json + docs/day02-coverage-status.md"""
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Each topic: id, title, pdfPageIndex, route, implementationStatus, integrationMode, mergedInto, interactive, qaStatus, remainingWork[]
TOPICS = [
    ("warmup", "النشاط التمهيدي: التحويلات و ASCII", 93, "/lessons/conversions-intro", "done", "activity", "conversions-intro", "ActivityGuide", "passed", []),
    ("base-arithmetic", "الحساب في أنظمة العد المختلفة", 99, "/lessons/base-arithmetic", "done", "standalone", None, "BaseArithmeticLab", "passed", []),
    ("hex-addition", "الجمع في النظام الست عشري", 100, "/lessons/base-arithmetic", "done", "merged", "base-arithmetic", "BaseArithmeticLab", "passed", []),
    ("base5-addition", "الجمع في الأساس 5", 99, "/lessons/base-arithmetic", "done", "merged", "base-arithmetic", "BaseArithmeticLab", "passed", []),
    ("binary-add", "قواعد الجمع الثنائي", 101, "/lessons/base-arithmetic", "done", "merged", "base-arithmetic", "BaseArithmeticLab", "passed", []),
    ("binary-sub", "الطرح الثنائي", 102, "/lessons/base-arithmetic", "done", "merged", "base-arithmetic", "BaseArithmeticLab", "passed", []),
    ("twos", "مكمل العدد 2 في الطرح", 103, "/lessons/twos-complement", "done", "standalone", None, "TwosComplementLab", "passed", []),
    ("negative", "تمثيل الأعداد السالبة", 104, "/lessons/twos-complement", "done", "merged", "twos-complement", "TwosComplementLab", "passed", []),
    ("bit-width", "تحديد عدد البتات", 104, "/lessons/twos-complement", "done", "merged", "twos-complement", "TwosComplementLab", "passed", []),
    ("overflow", "تجاوز السعة Overflow", 105, "/lessons/twos-complement", "done", "merged", "twos-complement", "TwosComplementLab", "passed", []),
    ("float", "الأعداد ذات الفاصلة العائمة", 106, "/lessons/floating-point", "done", "standalone", None, "IfStatementLab", "passed", []),
    ("radix-practice", "تطبيقات حساب الأساس", 96, "/lessons/radix-practice", "done", "standalone", None, "LessonPractice", "passed", []),
    ("algo-intro", "مقدمة الخوارزميات", 107, "/lessons/algorithms", "done", "standalone", None, "AlgorithmStepsLab", "passed", []),
    ("card-sort", "نشاط فرز البطاقات", 109, "/lessons/card-sort-algorithm", "done", "activity", "card-sort-algorithm", "CardSortSimulation", "passed", []),
    ("writing-algo", "كتابة الخوارزميات", 110, "/lessons/algorithms", "done", "merged", "algorithms", "AlgorithmStepsLab", "passed", []),
    ("pseudocode", "شبه الكود", 112, "/lessons/algorithms", "done", "merged", "algorithms", "AlgorithmStepsLab", "passed", []),
    ("python-arrays", "المصفوفات والقوائم", 114, "/lessons/python-arrays", "done", "standalone", None, "PythonListLab", "passed", []),
    ("indexing", "الفهرسة والوصول", 115, "/lessons/python-arrays", "done", "merged", "python-arrays", "PythonListLab", "passed", []),
    ("booleans", "القيم المنطقية", 121, "/lessons/if-statement", "done", "merged", "if-statement", "IfStatementLab", "passed", []),
    ("if-statement", "جملة if", 141, "/lessons/if-statement", "done", "standalone", None, "IfStatementLab", "passed", []),
    ("if-else-ref", "if/else والدليل المرجعي", 139, "/lessons/sentence-reference", "done", "standalone", None, "IfStatementLab", "passed", []),
    ("for-loop", "حلقة for", 118, "/lessons/python-for-range", "done", "standalone", None, "ForRangeLab", "passed", []),
    ("range", "range", 119, "/lessons/python-for-range", "done", "merged", "python-for-range", "ForRangeLab", "passed", []),
    ("while-loop", "حلقة while", 124, "/lessons/python-while", "done", "standalone", None, "WhileLoopLab", "passed", []),
    ("algo-apps", "تطبيقات الخوارزميات", 125, "/lessons/algorithms", "done", "merged", "algorithms", "AlgorithmStepsLab", "passed", []),
    ("if-apps", "تطبيقات if", 143, "/lessons/if-statement", "done", "merged", "if-statement", "IfStatementLab", "passed", []),
    ("computer-lab", "النشاط العملي — مختبر الحاسب", 149, "/lessons/day02-computer-lab", "done", "lab", "day02-computer-lab", "Day02ComputerLabPanel", "passed", []),
    ("teacher-answers", "إجابات المعلم", 150, "/teacher/day-02-answers", "done", "teacher-only", None, "TeacherDay02AnswersPage", "passed", []),
]

records = []
for t in TOPICS:
    tid, title, pdf_idx, route, impl, mode, merged, interactive, qa, remaining = t
    records.append({
        "id": tid,
        "titleAr": title,
        "pdfPageIndex": pdf_idx,
        "route": route,
        "implementationStatus": impl,
        "integrationMode": mode,
        "mergedInto": merged,
        "interactive": interactive,
        "qaStatus": qa,
        "remainingWork": remaining,
    })

json_path = ROOT / "docs/day02-coverage.json"
json_path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")

impl_c = Counter(r["implementationStatus"] for r in records)
qa_c = Counter(r["qaStatus"] for r in records)
mode_c = Counter(r["integrationMode"] for r in records)
all_done = all(r["implementationStatus"] == "done" for r in records)

lines = [
    "# حالة تغطية اليوم الثاني — نموذج منفصل",
    "",
    "**حدود اليوم 2:** pdfPageIndex 93–150",
    f"**الحالة العامة:** {'✅ **مكتمل**' if all_done else '⏳ **غير مكتمل**'} — `implementationStatus` منفصل عن `integrationMode`.",
    "",
    "> **merged** = طريقة دمج المحتوى — **لا يعني اكتمالاً تلقائياً**. راجع `implementationStatus`.",
    "",
    "| # | الموضوع | pdf | implementation | integration | mergedInto | qa | تفاعلي | المتبقي |",
    "|---:|---|---:|---|---|---|---|---|---|",
]

for n, r in enumerate(records, 1):
    merged = f"`{r['mergedInto']}`" if r["mergedInto"] else "—"
    rem = "—" if not r["remainingWork"] else "؛ ".join(r["remainingWork"])
    lines.append(
        f"| {n} | {r['titleAr']} | {r['pdfPageIndex']} | **{r['implementationStatus']}** | {r['integrationMode']} | {merged} | {r['qaStatus']} | {r['interactive']} | {rem} |"
    )

lines += [
    "",
    "## ملخص implementationStatus",
    "",
    "| الحالة | العدد |",
    "|---|---:|",
]
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

lines += ["", "_JSON: `docs/day02-coverage.json` — أُنشئ بواسطة `scripts/generate-day02-coverage.py`_"]

md_path = ROOT / "docs/day02-coverage-status.md"
md_path.write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote {json_path} and {md_path}")
