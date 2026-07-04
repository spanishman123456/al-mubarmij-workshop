#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extract structured inventory from برمجة الحاسب.pdf — exact PDF page numbers."""

import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader

PDF_PATH = Path(r"C:\Users\hosam\OneDrive\Desktop\برمجة الحاسب.pdf")
OUT_MD = Path(__file__).resolve().parent.parent / "docs" / "pdf-content-inventory.md"
OUT_JSON = Path(__file__).resolve().parent.parent / "docs" / "pdf-content-inventory.json"

DAY_PATTERNS = [
    (re.compile(r"اليوم\s+الأ?و?ل\b|اليوم\s+1\b|1\s+اليوم\s+الأ?و?ل"), 1),
    (re.compile(r"اليوم\s+الثاني\b|اليوم\s+2\b|2\s+اليوم"), 2),
    (re.compile(r"اليوم\s+الثالث\b|اليوم\s+3\b|3\s+اليوم"), 3),
    (re.compile(r"اليوم\s+الرابع\b|اليوم\s+4\b|4\s+اليوم"), 4),
    (re.compile(r"اليوم\s+الخامس\b|اليوم\s+5\b|5\s+اليوم"), 5),
    (re.compile(r"اليوم\s+السادس\b|اليوم\s+6\b|6\s+اليوم"), 6),
    (re.compile(r"اليوم\s+السابع\b|اليوم\s+7\b|7\s+اليوم"), 7),
    (re.compile(r"اليوم\s+الثامن\b|اليوم\s+8\b|8\s+اليوم"), 8),
    (re.compile(r"اليوم\s+التاسع\b|اليوم\s+9\b|9\s+اليوم"), 9),
    (re.compile(r"اليوم\s+العاشر\b|اليوم\s+10\b|10\s+اليوم"), 10),
    (re.compile(r"اليوم\s+الحادي\s+عشر\b|11\s+اليوم"), 11),
    (re.compile(r"اليوم\s+الثاني\s+عشر\b|12\s+اليوم"), 12),
    (re.compile(r"اليوم\s+الثالث\s+عشر\b|13\s+اليوم"), 13),
    (re.compile(r"اليوم\s+الرابع\s+عشر\b|14\s+اليوم"), 14),
    (re.compile(r"اليوم\s+الخامس\s+عشر\b|15\s+اليوم"), 15),
]

CONTENT_TYPE_RULES = [
    (re.compile(r"إجابات?\s*الأ?"), "إجابة"),
    (re.compile(r"ورقة\s+عمل|ورقة\s+العمل"), "ورقة عمل"),
    (re.compile(r"تطبيقات\s+على|تطبيق\s+عملي|اط\s+عملي"), "نشاط"),
    (re.compile(r"نشاط\s+كسر\s+الجليد|BINGO", re.I), "نشاط"),
    (re.compile(r"مدونة\s+الشرف"), "شرح"),
    (re.compile(r"سياسة\s+الاستخدام|عقد\s+استخدام"), "شرح"),
    (re.compile(r"اتفاقية\s+مدونة"), "شرح"),
    (re.compile(r"تقويم\s+قبل|تقويم\s+بعد|تقويم\s+البرنامج"), "تقويم"),
    (re.compile(r"المشروع\s+الختام|مشروع\s+نهائي"), "مشروع"),
    (re.compile(r"المقدمة|مقدمة\s+"), "شرح"),
    (re.compile(r"الأ?هداف"), "شرح"),
    (re.compile(r"الخاتمة|إجراءات\s+الخاتمة"), "شرح"),
    (re.compile(r"مثال\s+ال|المثال\s+ال"), "مثال"),
    (re.compile(r"الدليل\s+المرجعي|مرجع"), "مرجع"),
]

TOPIC_KEYWORDS = [
    ("bingo", r"BINGO|كسر\s+الجليد"),
    ("honor-code", r"مدونة\s+الشرف"),
    ("acceptable-use", r"سياسة\s+الاستخدام|الاستخدام\s+المناسب"),
    ("honor-agreement", r"اتفاقية\s+مدونة"),
    ("tech-contract", r"عقد\s+استخدام\s+التقنيات"),
    ("number-systems", r"نظام\s+العد|الثنائي|الأساسات|القيمة\s+المكانية"),
    ("binary-cards", r"بطاقات\s+الأ?رقام\s+الثنائية|Unplugged|حديقة\s+الحوسبة"),
    ("python-intro", r"بايثون|Python"),
    ("ascii-unicode", r"ASCII|Unicode|يونيكود"),
    ("hex-colors", r"الست\s+عشري|RGB|Kuler|الأ?لوان"),
    ("algorithms", r"خوارزم"),
    ("if-statement", r"جملة\s+If|if\s+Statement|إذا"),
    ("loops", r"while|for|التكرار|حلقة"),
    ("arrays", r"مصفوف|قوائم|قائمة"),
    ("collatz", r"Collatz|كولاتز"),
    ("truth-tables", r"جدول\s+الحقيقة|جداول\s+الحقيقة"),
    ("logic-gates", r"البوابات\s+المنطقية|بوابة"),
    ("karnaugh", r"كارنوف|Karnaugh"),
    ("relations", r"اقتران|حقول\s+مترابطة"),
    ("search-sort", r"بحث|فرز"),
    ("caesar", r"قيصر|Caesar"),
    ("fibonacci", r"فيبوناتش|Fibonacci"),
    ("hanoi", r"هانوي|Hanoi"),
    ("scheduling", r"جدولة|FCFS"),
    ("oop", r"كائن|OOP|شيئ"),
    ("encryption", r"تشفير|فك\s+التشفير"),
    ("roman-numerals", r"رومان"),
    ("regex-nfa", r"Regex|NFA|DFA|تعبير\s+عادي"),
    ("graph-theory", r"نظرية\s+المخططات|مخطط"),
    ("halting", r"التوقف|Halting"),
    ("ip", r"ملكية\s+فكرية|انتحال"),
    ("final-project", r"مشروع\s+ختام|عرض\s+ختام"),
]

PRINTED_PAGE_RE = re.compile(r"(?:^|\s)(\d{1,3})(?:\s|$)")


def detect_day(text: str) -> int | None:
    for pat, num in DAY_PATTERNS:
        if pat.search(text):
            return num
    return None


def detect_content_type(line: str) -> str | None:
    for pat, ctype in CONTENT_TYPE_RULES:
        if pat.search(line):
            return ctype
    return None


def detect_topic_slug(text: str) -> str | None:
    for slug, pat in TOPIC_KEYWORDS:
        if re.search(pat, text, re.I):
            return slug
    return None


def extract_printed_page(text: str) -> int | None:
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    for line in reversed(lines[-6:]):
        m = re.match(r"^(\d{1,3})$", line)
        if m:
            n = int(m.group(1))
            if 1 <= n <= 600:
                return n
    return None


def title_from_lines(lines: list[str]) -> str:
    for line in lines[:12]:
        clean = re.sub(r"\s+", " ", line).strip()
        if len(clean) < 8 or len(clean) > 120:
            continue
        if re.match(r"^[\d\s\.]+$", clean):
            continue
        if "برمجة" in clean and "الحاسب" in clean and len(clean) < 25:
            continue
        return clean[:100]
    return ""


def main():
    if not PDF_PATH.exists():
        print(f"PDF not found: {PDF_PATH}", file=sys.stderr)
        sys.exit(1)

    reader = PdfReader(str(PDF_PATH))
    total = len(reader.pages)
    items = []
    current_day = None

    for pdf_page in range(1, total + 1):
        text = reader.pages[pdf_page - 1].extract_text() or ""
        lines = [l.strip() for l in text.split("\n") if l.strip()]
        joined = " ".join(lines)

        day_hit = detect_day(joined)
        if day_hit:
            current_day = day_hit

        printed = extract_printed_page(text)
        ctype = None
        title = ""
        for line in lines:
            t = detect_content_type(line)
            if t:
                ctype = t
                title = line[:100]
                break
        if not title:
            title = title_from_lines(lines)

        topic = detect_topic_slug(joined)
        if not ctype and not title and not topic:
            continue

        items.append(
            {
                "pdfPage": pdf_page,
                "printedPage": printed,
                "day": current_day,
                "topicSlug": topic,
                "titleAr": title or f"صفحة {pdf_page}",
                "contentType": ctype or "شرح",
                "preview": joined[:200],
            }
        )

    OUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")

    # Platform mapping hints
    platform_map = {
        "bingo": ("/onboarding/bingo", "❌"),
        "honor-code": ("/onboarding/honor-code", "❌"),
        "number-systems": ("/lessons/number-systems", "⚠️ جزئي"),
        "truth-tables": ("/simulations#truth", "✅ محاكاة"),
    }

    with OUT_MD.open("w", encoding="utf-8") as f:
        f.write("# جرد محتوى PDF — برمجة الحاسب\n\n")
        f.write(f"**مصدر:** `{PDF_PATH.name}`  \n")
        f.write(f"**عدد صفحات PDF:** {total}  \n")
        f.write(f"**عدد العناصر المستخرجة:** {len(items)}  \n")
        f.write(f"**تاريخ الاستخراج:** آلياً عبر `scripts/extract-pdf-inventory.py`\n\n")
        f.write("## دليل الأعمدة\n\n")
        f.write("| العمود | الوصف |\n|---|---|\n")
        f.write("| pdfPage | رقم الصفحة في ملف PDF (1-based) |\n")
        f.write("| printedPage | الرقم المطبوع في أسفل الصفحة إن وُجد |\n")
        f.write("| day | اليوم التدريبي |\n")
        f.write("| contentType | شرح / مثال / نشاط / ورقة عمل / تقويم / إجابة / مشروع / مرجع |\n")
        f.write("| platformRoute | المسار المقترح في المنصة |\n")
        f.write("| coverage | حالة التغطية الحالية |\n")
        f.write("| status | pending / in_progress / done |\n\n")
        f.write("## الجرد الكامل\n\n")
        f.write(
            "| pdfPage | printedPage | day | contentType | topicSlug | titleAr | platformRoute | coverage | needs | component | status |\n"
        )
        f.write("|---:|---:|---:|---|---|---|---|---|---|---|\n")
        for it in items:
            route, cov = platform_map.get(it["topicSlug"] or "", ("—", "❌"))
            needs = "محتوى تفصيلي + تفاعل" if cov.startswith("❌") or cov.startswith("⚠️") else "—"
            comp = it["topicSlug"] or "LessonContent"
            f.write(
                f"| {it['pdfPage']} | {it['printedPage'] or '—'} | {it['day'] or '—'} | "
                f"{it['contentType']} | {it['topicSlug'] or '—'} | "
                f"{it['titleAr'].replace('|', '/')} | {route} | {cov} | {needs} | {comp} | pending |\n"
            )

    print(f"Wrote {len(items)} items to {OUT_MD} and {OUT_JSON}")


if __name__ == "__main__":
    main()
