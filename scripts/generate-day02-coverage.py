#!/usr/bin/env python3
"""Generate docs/day02-coverage-status.md — full PDF topic map."""
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# (id, title, pdfPageIndex, printedPage, route, status, kind, merged_into, interactive, remaining)
TOPICS = [
    ("warmup-conversions-ascii", "النشاط التمهيدي: التحويلات و ASCII", 93, None, "/lessons/conversions-intro", "partial", "activity", "conversions-intro", "ActivityGuide + NumberBaseConverter", "توسيع تمارين ASCII التفاعلية"),
    ("base-arithmetic", "الحساب في أنظمة العد المختلفة", 99, None, "/lessons/base-arithmetic", "partial", "lesson", None, "BaseArithmeticLab", "مزيد أمثلة خطوة بخطوة في PDF"),
    ("hex-addition", "الجمع في النظام الست عشري", 100, None, "/lessons/base-arithmetic", "merged", "lesson", "base-arithmetic", "BaseArithmeticLab", "—"),
    ("base5-addition", "الجمع في الأساس 5", 99, None, "/lessons/base-arithmetic", "merged", "lesson", "base-arithmetic", "BaseArithmeticLab", "—"),
    ("binary-add-rules", "قواعد الجمع الثنائي", 101, None, "/lessons/base-arithmetic", "merged", "lesson", "base-arithmetic", "BaseArithmeticLab", "—"),
    ("binary-subtraction", "الطرح الثنائي", 102, None, "/lessons/base-arithmetic", "merged", "lesson", "base-arithmetic", "BaseArithmeticLab", "—"),
    ("twos-complement-intro", "مكمل العدد 2 في الطرح", 103, None, "/lessons/twos-complement", "partial", "lesson", None, "TwosComplementLab", "—"),
    ("negative-twos", "تمثيل الأعداد السالبة", 104, None, "/lessons/twos-complement", "merged", "lesson", "twos-complement", "TwosComplementLab", "—"),
    ("bit-width", "تحديد عدد الخانات/البتات", 104, None, "/lessons/twos-complement", "merged", "lesson", "twos-complement", "TwosComplementLab", "—"),
    ("overflow", "تجاوز السعة Overflow", 105, None, "/lessons/twos-complement", "merged", "lesson", "twos-complement", "TwosComplementLab", "—"),
    ("floating-point", "الأعداد ذات الفاصلة العائمة", 106, None, "/lessons/floating-point", "partial", "lesson", None, "IfStatementLab (0.1+0.2)", "توسيع تمارين الدقة"),
    ("radix-practice", "تطبيقات حساب الأساس", 96, None, "/lessons/radix-practice", "done", "lesson", None, "LessonPractice", "—"),
    ("algo-intro", "مقدمة الخوارزميات", 107, None, "/lessons/algorithms", "partial", "lesson", None, "AlgorithmStepsLab", "توسيع مقدمة PDF"),
    ("card-sort", "نشاط فرز البطاقات", 109, None, "/lessons/card-sort-algorithm", "partial", "activity", "card-sort-algorithm", "ActivityGuide + AlgorithmStepsLab", "محاكاة بطاقات فعلية"),
    ("writing-algorithms", "كتابة الخوارزميات", 110, None, "/lessons/algorithms", "merged", "lesson", "algorithms", "AlgorithmStepsLab", "—"),
    ("pseudocode", "شبه الكود", 112, None, "/lessons/algorithms", "merged", "lesson", "algorithms", "AlgorithmStepsLab", "—"),
    ("python-arrays", "المصفوفات والقوائم", 114, None, "/lessons/python-arrays", "partial", "lesson", None, "PythonListLab", "—"),
    ("indexing", "الفهرسة والوصول", 115, None, "/lessons/python-arrays", "merged", "lesson", "python-arrays", "PythonListLab", "—"),
    ("booleans", "القيم المنطقية", 121, None, "/lessons/if-statement", "merged", "lesson", "if-statement", "IfStatementLab", "—"),
    ("if-statement", "جملة if", 141, None, "/lessons/if-statement", "partial", "lesson", None, "IfStatementLab", "توسيع elif/nested"),
    ("if-else", "if/else والدليل المرجعي", 139, None, "/lessons/sentence-reference", "partial", "lesson", None, "IfStatementLab", "—"),
    ("for-loop", "حلقة for", 118, None, "/lessons/python-for-range", "partial", "lesson", None, "ForRangeLab", "—"),
    ("range", "range", 119, None, "/lessons/python-for-range", "merged", "lesson", "python-for-range", "ForRangeLab", "—"),
    ("while-loop", "حلقة while", 124, None, "/lessons/python-while", "partial", "lesson", None, "WhileLoopLab", "—"),
    ("algo-apps", "تطبيقات الخوارزميات", 125, None, "/lessons/algorithms", "merged", "lesson", "algorithms", "AlgorithmStepsLab", "—"),
    ("if-apps", "تطبيقات if", 143, None, "/lessons/if-statement", "merged", "lesson", "if-statement", "IfStatementLab", "—"),
    ("computer-lab", "النشاط العملي — مختبر الحاسب", 149, None, "/lessons/day02-computer-lab", "partial", "lab", "day02-computer-lab", "ActivityGuide + IfStatementLab", "ربط حفظ التقدم بالمختبر"),
    ("teacher-answers", "إجابات المعلم", 150, None, "/teacher/day-02-answers", "partial", "teacher", None, "TeacherDay02AnswersPage", "توسيع مفتاح PDF كامل"),
]

lines = [
    "# حالة تغطية اليوم الثاني — خريطة PDF كاملة",
    "",
    "**حدود اليوم 2:** pdfPageIndex 93–150  ",
    "**الحالة العامة:** ⏳ **غير مكتمل** — لا تُستخدم عبارة «اليوم الثاني مكتمل» قبل **done** لكل عنصر.",
    "",
    "| # | الموضوع | pdfPageIndex | printedPage | الحالة | المسار | مدمج في | تفاعلي | المتبقي |",
    "|---:|---|---:|---:|---|---|---|---|---|",
]

for n, row in enumerate(TOPICS, 1):
    _id, title, pdf_idx, printed, route, status, kind, merged, interactive, remaining = row
    merged_txt = f"`{merged}`" if merged else "—"
    lines.append(
        f"| {n} | {title} | {pdf_idx} | {printed or '—'} | **{status}** | {route} | {merged_txt} | {interactive} | {remaining or '—'} |"
    )

items = json.load(open(ROOT / "docs/pdf-content-inventory.json", encoding="utf-8"))
d2_inv = len([i for i in items if i.get("dayNumber") == 2])

lines += [
    "",
    f"**عناصر الجرد OCR لليوم 2:** {d2_inv} (مرجع — التصنيف أعلاه يعتمد خطة PDF اليدوية)",
    "",
    "## ملخص الحالة",
    "",
    "| الحالة | العدد |",
    "|---|---:|",
]

c = Counter(t[5] for t in TOPICS)
for st in ("done", "partial", "merged", "pending"):
    if c.get(st, 0):
        lines.append(f"| {st} | {c.get(st, 0)} |")

lines += [
    "",
    "## الدروس الجديدة (الدفعة 4)",
    "",
    "| المسار | الأقسام | أمثلة | تدريب موجّه | تدريب مستقل | مختبر |",
    "|---|---:|---:|---:|---:|---|",
    "| /lessons/base-arithmetic | 6 | 5 | 3 | 4 | BaseArithmeticLab |",
    "| /lessons/twos-complement | 6 | 4 | 3 | 3 | TwosComplementLab |",
    "| /lessons/floating-point | 5 | 3 | 2 | 2 | IfStatementLab |",
    "| /lessons/python-arrays | 5 | 4 | 2 | 3 | PythonListLab |",
    "| /lessons/python-for-range | 5 | 3 | 2 | 3 | ForRangeLab |",
    "| /lessons/python-while | 5 | 3 | 2 | 3 | WhileLoopLab |",
    "| /lessons/card-sort-algorithm | 2 | 1 | — | — | AlgorithmStepsLab |",
    "| /lessons/conversions-intro | 2 | 2 | 2 | 2 | NumberBaseConverter |",
    "| /lessons/day02-computer-lab | 3 | 1 | — | — | IfStatementLab |",
    "",
    "_أُنشئ بواسطة `scripts/generate-day02-coverage.py`_",
]

out = ROOT / "docs/day02-coverage-status.md"
out.write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote {out}")
