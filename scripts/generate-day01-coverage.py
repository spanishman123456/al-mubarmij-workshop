#!/usr/bin/env python3
"""Generate docs/day01-coverage-status.md from inventory."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
items = json.load(open(ROOT / "docs/pdf-content-inventory.json", encoding="utf-8"))
d1 = sorted([i for i in items if i.get("dayNumber") == 1], key=lambda x: x.get("pdfPageIndex") or 0)

ROUTE_MAP = {
    "bingo": ("/onboarding/bingo", "done"),
    "honor": ("/onboarding/honor-code", "done"),
    "acceptable": ("/onboarding/acceptable-use", "done"),
    "honor-agreement": ("/onboarding/honor-agreement", "done"),
    "tech-contract": ("/onboarding/tech-contract", "done"),
    "pre-assessment": ("/quizzes/run/quiz-pre", "done"),
    "binary-cards": ("/lessons/binary-cards", "done"),
    "binary-puzzle": ("/lessons/binary-puzzle", "done"),
    "number-systems": ("/lessons/number-systems", "done"),
    "binary-matching": ("/lessons/binary-matching", "done"),
    "python-intro": ("/lessons/python-intro", "done"),
    "string-splitting": ("/lessons/string-splitting", "done"),
    "ascii-unicode": ("/lessons/ascii-unicode", "done"),
    "hex-puzzle": ("/lessons/hex-puzzle", "done"),
    "hex-colors": ("/lessons/hex-colors", "done"),
}

def classify(item):
    slug = item.get("topicSlug") or ""
    title = (item.get("title") or "").lower()
    ctype = item.get("contentType") or ""
    if slug in ROUTE_MAP:
        route, st = ROUTE_MAP[slug]
        return route, st, "منفذ على المنصة"
    if "إجاب" in title or "معلم" in title or ctype == "teacher_answer":
        return "/teacher/day-01-answers", "teacher", "مخصص للمعلم — لا يُعرض للطلاب"
    if "خاتمة" in title or ctype in ("footer", "header"):
        return "—", "merged", "دمج في ملخص اليوم / هيكل PDF"
    if "بينجو" in title or "bingo" in title:
        return "/onboarding/bingo", "done", "منفذ"
    if item.get("implementationStatus") == "done":
        return item.get("platformRoute") or "—", "done", "من inventory"
    if item.get("implementationStatus") == "partial":
        return item.get("platformRoute") or "—", "partial", "جزئي"
    return item.get("platformRoute") or "—", "pending", "قيد التخطيط"

lines = [
    "# حالة تغطية اليوم الأول — كل عنصر مصنّف",
    "",
    "**حدود اليوم 1:** pdfPageIndex 23–92  ",
    "**آخر تحديث:** 2026-07-05  ",
    f"**عدد عناصر الجرد لليوم 1:** {len(d1)}",
    "",
    "| # | pdfPageIndex | العنوان | النوع | المسار | الحالة | التصنيف |",
    "|---:|---:|---|---|---|---|---|",
]
for n, item in enumerate(d1, 1):
    route, status, note = classify(item)
    title = (item.get("title") or "—").replace("|", "/")[:55]
    lines.append(
        f"| {n} | {item.get('pdfPageIndex', '—')} | {title} | {item.get('contentType', '—')} | {route} | **{status}** | {note} |"
    )

lines += [
    "",
    "## ملخص التصنيف",
    "",
    "| الحالة | المعنى |",
    "|---|---|",
    "| **done** | منفذ تفاعلياً أو مدمج في درس مكتمل |",
    "| **teacher** | إجابات/مفتاح معلم في `/teacher/day-01-answers` |",
    "| **merged** | دُمج في درس آخر أو ملخص يوم |",
    "| **pending** | لم يُنفّذ بعد — له بديل أو في قائمة انتظار |",
    "",
    "## تأكيدات",
    "",
    "- التقويم القبلي مُدمج في بوابة التمهيد (`preAssessment` في SQLite).",
    "- بطاقات نظام الأرقام الثنائي (pdf 79) في `/lessons/binary-cards`.",
    "- **لا** يُدرج الجمع الثنائي في اليوم 1 — موضعه لاحقاً في المنهج.",
    "",
    "_أُنشئ بواسطة `scripts/generate-day01-coverage.py`_",
]

out = ROOT / "docs/day01-coverage-status.md"
out.write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote {out} ({len(d1)} items)")
