#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Scan PDF for day boundaries and TOC — output UTF-8 file."""
import re
import sys
from pathlib import Path

from pypdf import PdfReader

PDF_PATH = Path(r"C:\Users\hosam\OneDrive\Desktop\برمجة الحاسب.pdf")
OUT = Path(__file__).resolve().parent.parent / "docs" / "pdf-day-scan.txt"

DAY_MARKERS = [
    (1, re.compile(r"اليوم\s+الأ?و?ل\b|1\s+اليوم\s+الأ?و?ل")),
    (2, re.compile(r"اليوم\s+الثاني\b|2\s+اليوم\s+الثاني")),
    (3, re.compile(r"اليوم\s+الثالث\b|3\s+اليوم\s+الثالث")),
    (4, re.compile(r"اليوم\s+الرابع\b|4\s+اليوم\s+الرابع")),
    (5, re.compile(r"اليوم\s+الخامس\b|5\s+اليوم\s+الخامس")),
    (6, re.compile(r"اليوم\s+السادس\b|6\s+اليوم\s+السادس")),
    (7, re.compile(r"اليوم\s+السابع\b|7\s+اليوم\s+السابع")),
    (8, re.compile(r"اليوم\s+الثامن\b|8\s+اليوم\s+الثامن")),
    (9, re.compile(r"اليوم\s+التاسع\b|9\s+اليوم\s+التاسع")),
    (10, re.compile(r"اليوم\s+العاشر\b|10\s+اليوم\s+العاشر")),
    (11, re.compile(r"اليوم\s+الحادي\s+عشر\b|11\s+اليوم")),
    (12, re.compile(r"اليوم\s+الثاني\s+عشر\b|12\s+اليوم")),
    (13, re.compile(r"اليوم\s+الثالث\s+عشر\b|13\s+اليوم")),
    (14, re.compile(r"اليوم\s+الرابع\s+عشر\b|14\s+اليوم")),
    (15, re.compile(r"اليوم\s+الخامس\s+عشر\b|15\s+اليوم")),
]

PRINTED_FOOTER = re.compile(r"^(\d{1,3})$")


def extract_printed(text: str) -> int | None:
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    for line in reversed(lines[-8:]):
        m = PRINTED_FOOTER.match(line)
        if m:
            n = int(m.group(1))
            if 1 <= n <= 600:
                return n
    return None


def main():
    if not PDF_PATH.exists():
        print(f"Missing PDF: {PDF_PATH}", file=sys.stderr)
        sys.exit(1)

    reader = PdfReader(str(PDF_PATH))
    total = len(reader.pages)
    lines_out = [f"Total PDF pages: {total}", ""]

    # TOC scan first 30 pages
    lines_out.append("=== TOC / early pages ===")
    for i in range(min(30, total)):
        text = reader.pages[i].extract_text() or ""
        if "اليوم" in text or "جدول" in text or "المحتويات" in text:
            lines_out.append(f"\n--- pdfPageIndex={i} pdfPage={i+1} printed={extract_printed(text)} ---")
            for ln in text.split("\n")[:25]:
                ln = ln.strip()
                if ln:
                    lines_out.append(ln[:120])

    lines_out.append("\n=== Day marker hits ===")
    day_first_page = {}
    for i in range(total):
        text = reader.pages[i].extract_text() or ""
        for day_num, pat in DAY_MARKERS:
            if pat.search(text):
                key = day_num
                if key not in day_first_page:
                    day_first_page[key] = i
                lines_out.append(
                    f"day={day_num} pdfPageIndex={i} pdfPage={i+1} printed={extract_printed(text)}"
                )
                preview = " | ".join(l.strip() for l in text.split("\n") if l.strip())[:200]
                lines_out.append(f"  preview: {preview}")

    lines_out.append("\n=== First page per day (summary) ===")
    for d in sorted(day_first_page):
        i = day_first_page[d]
        lines_out.append(f"Day {d}: pdfPageIndex={i} (pdfPage {i+1})")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines_out), encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
