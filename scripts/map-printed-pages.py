#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Find lesson start pages by printed page numbers from TOC."""
from pathlib import Path
from pypdf import PdfReader
import re

PDF = Path(r"C:\Users\hosam\OneDrive\Desktop\برمجة الحاسب.pdf")
OUT = Path(__file__).resolve().parent.parent / "docs" / "pdf-printed-page-map.txt"

# Key printed pages from TOC (pdfPage 4-8)
KEY_PRINTED = [53, 54, 55, 56, 57, 70, 71, 77, 78, 79, 82, 85, 143, 144, 184, 185, 187, 191, 196, 254, 274, 391, 398, 454, 528, 542]

FOOTER = re.compile(r"^(\d{1,3})$")


def printed_of(text: str):
    for line in reversed([l.strip() for l in text.split("\n") if l.strip()][-10:]):
        m = FOOTER.match(line)
        if m:
            n = int(m.group(1))
            if 1 <= n <= 600:
                return n
    return None


def main():
    r = PdfReader(str(PDF))
    lines = []
    printed_to_pdf = {}
    for i in range(len(r.pages)):
        text = r.pages[i].extract_text() or ""
        p = printed_of(text)
        if p is not None:
            printed_to_pdf[p] = i

    lines.append("=== printedPage -> pdfPageIndex ===")
    for p in sorted(printed_to_pdf.keys()):
        if p in KEY_PRINTED or (50 <= p <= 90) or (140 <= p <= 200) or (270 <= p <= 300) or (390 <= p <= 410):
            lines.append(f"printed {p:3d} -> pdfPageIndex {printed_to_pdf[p]} (pdfPage {printed_to_pdf[p]+1})")

    lines.append("\n=== Search: اليوم الثاني on content pages ===")
    for i in range(20, min(200, len(r.pages))):
        text = r.pages[i].extract_text() or ""
        if "اليوم الثاني" in text or "التحويلات" in text[:500]:
            p = printed_of(text)
            preview = " | ".join(l.strip() for l in text.split("\n") if l.strip())[:180]
            lines.append(f"pdfPageIndex={i} printed={p} | {preview}")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
