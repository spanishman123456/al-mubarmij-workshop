#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extract PDF inventory with corrected day mapping.
Uses docs/curriculum-day-boundaries.json — NOT OCR day detection alone.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
PDF_PATH = Path(r"C:\Users\hosam\OneDrive\Desktop\برمجة الحاسب.pdf")
BOUNDARIES_PATH = ROOT / "docs" / "curriculum-day-boundaries.json"
COVERAGE_PATH = ROOT / "docs" / "platform-coverage-map.json"
OUT_JSON = ROOT / "docs" / "pdf-content-inventory.json"
OUT_MD = ROOT / "docs" / "pdf-content-inventory.md"

FOOTER_NUM = re.compile(r"^(\d{1,3})$")
GARBAGE = re.compile(r"^[.\s\u2026\uFFFD\d]+$|^\d+\s+\.{3,}")

CONTENT_TYPE_RULES = [
    (re.compile(r"إجابات?\s"), "إجابة"),
    (re.compile(r"ورقة\s+عمل|ورقة\s+العمل|ورقة\s+نش"), "ورقة عمل"),
    (re.compile(r"تطبيقات\s+على|تطبيق\s+عملي|اط\s+عملي|اط\s+خوارز"), "نشاط"),
    (re.compile(r"BINGO|كسر\s+الجليد", re.I), "نشاط"),
    (re.compile(r"تقويم\s+قبل|تقويم\s+بعد|تقويم\s+البرنامج|التقويم\s+القبل"), "تقويم"),
    (re.compile(r"مدونة\s+الشرف|اتفاقية\s+مدونة|عقد\s+استخدام|سياسة\s+الاستخدام"), "شرح"),
    (re.compile(r"الدليل\s+المرجعي"), "مرجع"),
    (re.compile(r"الأ?هداف"), "شرح"),
    (re.compile(r"خطوات\s+ال?تنفيذ"), "شرح"),
    (re.compile(r"الخاتمة|إجراءات\s+ال?خاتمة"), "شرح"),
    (re.compile(r"^مثال|المثال"), "مثال"),
    (re.compile(r"أ?حجية"), "نشاط"),
    (re.compile(r"^مقدمة|مقدمة\s"), "شرح"),
]

TOPIC_RULES = [
    ("bingo", r"BINGO|كسر\s+الجليد"),
    ("honor-code", r"مدونة\s+الشرف"),
    ("acceptable-use", r"سياسة\s+الاستخدام|الاستخدام\s+المقبول"),
    ("honor-agreement", r"اتفاقية\s+مدونة"),
    ("tech-contract", r"عقد\s+استخدام\s+التقنيات"),
    ("pre-assessment", r"التقويم\s+القبل|تقويم\s+قبل"),
    ("number-systems", r"نظام\s+ال?عد|القيمة\s+المكان|تحويل.*نظام|الأساسات?|حساب\s+الأساس"),
    ("binary-cards", r"بطاقات\s+.*ثنائ|Unplugged|حديقة\s+الحوس"),
    ("binary-puzzle", r"أ?حجية\s+.*ثنائ"),
    ("binary-matching", r"مطابقة.*ثنائ|بطاقات\s+المطابقة"),
    ("bases-radix", r"الأساسات|حساب\s+الأساس"),
    ("python-intro", r"بايثون|Python|print\s*\("),
    ("string-splitting", r"تقسيم\s+سل|split\s*\(|سلاسل\s+الرموز"),
    ("ascii-unicode", r"ASCII|Unicode|يونيكود"),
    ("hex-puzzle", r"أ?حجية.*ست\s+عشري|تحويل\s+النظام\s+ال"),
    ("fibonacci", r"فيبونات|Fibonacci"),
    ("big-o", r"Big-O|التعقيد"),
    ("hanoi", r"هانوي|Hanoi|Tower"),
    ("hex-colors", r"RGB|Kuler|الأ?لوان|#"),
    ("conversions-intro", r"التحويلات|الروتين"),
    ("algorithms", r"خوارزم|pseudocode|خوارزمية"),
    ("sentence-reference", r"الدليل\s+المرجعي\s+لبناء\s+الجمل"),
    ("if-statement", r"If\s+Statement|جملة\s+If|إذا"),
    ("loops", r"\bwhile\b|\bfor\b|التكرار|حلقة|Range"),
    ("truth-tables", r"جدول\s+الحق|جداول\s+الحق"),
    ("logic-gates", r"البوابات\s+المنطق|بوابة\s+منط"),
    ("karnaugh", r"كارنوف|Karnaugh"),
    ("relations", r"اقتران|Tuples|الحقول\s+المتر"),
    ("search-sort", r"البحث|الفرز|search|sort"),
    ("caesar", r"قيصر|Caesar|تشفير"),
    ("oop", r"كائن|OOP|class\s"),
    ("regex-nfa", r"Regex|NFA|DFA|تعبير\s+عادي"),
    ("graph-theory", r"نظرية\s+المخط|مخطط"),
    ("halting", r"التوقف|Halting|Turing"),
    ("final-project", r"مشروع\s+ختام|عرض\s+ختام"),
]


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def day_for_index(pdf_page_index: int, boundaries: list) -> int | None:
    for d in boundaries:
        if d["pdfPageIndexStart"] <= pdf_page_index <= d["pdfPageIndexEnd"]:
            return d["dayNumber"]
    return None


def extract_printed_page(text: str, pdf_page_index: int) -> int | None:
    """Footer printed page — only when page looks like teacher guide content."""
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if not lines:
        return None
    # Teacher pages often: برمجة | الحاسب | N | ...
    if "برمجة" not in text or "الحاسب" not in text:
        # still try footer on content worksheets
        pass
    candidates = []
    for line in reversed(lines[-6:]):
        m = FOOTER_NUM.match(line)
        if m:
            n = int(m.group(1))
            if 1 <= n <= 600:
                candidates.append(n)
    if not candidates:
        return None
    # Prefer smallest footer on guide pages (printed page), ignore TOC dot leaders
    return candidates[0]


def detect_content_type(text: str) -> str:
    for pat, ctype in CONTENT_TYPE_RULES:
        if pat.search(text):
            return ctype
    return "شرح"


def detect_topic(text: str) -> str | None:
    for slug, pat in TOPIC_RULES:
        if re.search(pat, text, re.I):
            return slug
    return None


def clean_title(line: str) -> str:
    line = re.sub(r"\s+", " ", line).strip()
    line = re.sub(r"\.{3,}.*$", "", line).strip()
    return line[:120]


def title_from_page(lines: list[str], joined: str) -> str:
    priority_patterns = [
        r"أ?حجية",
        r"مدونة\s+الشرف",
        r"BINGO",
        r"التقويم\s+القبل",
        r"الدليل\s+المرجعي",
        r"تطبيقات\s+على",
        r"مقدمة\s+",
        r"إلى\s+.*مقدمة",
        r"كتابة\s+الخوارز",
        r"خطوات\s+ال?تنفيذ",
        r"الأ?هداف",
    ]
    for pat in priority_patterns:
        for line in lines[:20]:
            if re.search(pat, line, re.I):
                t = clean_title(line)
                if len(t) >= 6:
                    return t
    for line in lines[:15]:
        t = clean_title(line)
        if len(t) < 8 or len(t) > 100:
            continue
        if GARBAGE.match(t):
            continue
        if t in ("برمجة", "الحاسب", "vww"):
            continue
        return t
    return ""


def should_include_page(text: str, title: str, topic: str | None, day: int | None) -> bool:
    if day is None:
        return False
    if not text.strip():
        return False
    # skip nearly empty or corrupted-only pages
    if len(text.strip()) < 40 and not topic:
        return False
    if not title and not topic:
        return False
    return True


def main():
    if not PDF_PATH.exists():
        print(f"PDF missing: {PDF_PATH}", file=sys.stderr)
        sys.exit(1)

    boundaries_doc = load_json(BOUNDARIES_PATH)
    coverage = load_json(COVERAGE_PATH)
    boundaries = boundaries_doc["days"]

    reader = PdfReader(str(PDF_PATH))
    total = len(reader.pages)
    items = []

    content_start = min(d["pdfPageIndexStart"] for d in boundaries)
    content_end = max(d["pdfPageIndexEnd"] for d in boundaries)

    for pdf_page_index in range(content_start, min(content_end + 1, total)):
        text = reader.pages[pdf_page_index].extract_text() or ""
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        joined = " ".join(lines)

        day_number = day_for_index(pdf_page_index, boundaries)
        printed = extract_printed_page(text, pdf_page_index)
        topic_slug = detect_topic(joined)
        content_type = detect_content_type(joined)
        title = title_from_page(lines, joined)

        if not should_include_page(text, title, topic_slug, day_number):
            continue

        cov = coverage.get(topic_slug or "", {})
        platform_route = cov.get("route", "—")
        impl_status = cov.get("status", "pending")

        items.append(
            {
                "pdfPageIndex": pdf_page_index,
                "printedPageNumber": printed,
                "dayNumber": day_number,
                "title": title or f"صفحة محتوى {pdf_page_index + 1}",
                "contentType": content_type,
                "topicSlug": topic_slug,
                "platformRoute": platform_route,
                "implementationStatus": impl_status,
                "status": "done" if impl_status == "done" else "pending",
            }
        )

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")

    with OUT_MD.open("w", encoding="utf-8") as f:
        f.write("# جرد محتوى PDF — برمجة الحاسب (مصحح)\n\n")
        f.write(f"**مصدر:** `{PDF_PATH.name}`  \n")
        f.write(f"**حدود الأيام:** `docs/curriculum-day-boundaries.json`  \n")
        f.write(f"**عدد صفحات PDF:** {total}  \n")
        f.write(f"**عدد عناصر المحتوى:** {len(items)}  \n\n")
        f.write("## دليل الحقول\n\n")
        f.write("| الحقل | الوصف |\n|---|---|\n")
        f.write("| pdfPageIndex | فهرس الصفحة في قارئ PDF (0-based) |\n")
        f.write("| printedPageNumber | الرقم المطبوع في تذييل الكتاب (إن وُجد بشكل موثوق) |\n")
        f.write("| dayNumber | اليوم التدريبي (1–15) من حدود يدوية |\n")
        f.write("| contentType | شرح / نشاط / مثال / ورقة عمل / تقoيم / إجابة / مرجع |\n")
        f.write("| implementationStatus | done / partial / pending / simulation-only |\n")
        f.write("| status | pending / done |\n\n")

        f.write("## ملخص حسب اليوم\n\n")
        f.write("| اليوم | عناصر |\n|---:|---:|\n")
        for d in range(1, 16):
            count = sum(1 for it in items if it["dayNumber"] == d)
            f.write(f"| {d} | {count} |\n")

        f.write("\n## الجرد الكامل\n\n")
        f.write(
            "| pdfPageIndex | printedPage | day | contentType | topicSlug | title | route | impl | status |\n"
        )
        f.write("|---:|---:|---:|---|---|---|---|---|---|\n")
        for it in items:
            f.write(
                f"| {it['pdfPageIndex']} | {it['printedPageNumber'] or '—'} | {it['dayNumber']} | "
                f"{it['contentType']} | {it.get('topicSlug') or '—'} | "
                f"{it['title'].replace('|', '/')} | {it['platformRoute']} | "
                f"{it['implementationStatus']} | {it['status']} |\n"
            )

    print(f"Wrote {len(items)} items -> {OUT_JSON}")


if __name__ == "__main__":
    main()
