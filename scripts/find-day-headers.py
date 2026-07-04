#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Find all day header pages in PDF content."""
import re
from pathlib import Path
from pypdf import PdfReader

PDF = Path(r"C:\Users\hosam\OneDrive\Desktop\برمجة الحاسب.pdf")
OUT = Path(__file__).resolve().parent.parent / "docs" / "pdf-day-headers.txt"

DAY_NUM = {
    "الأول": 1, "الاول": 1, "أول": 1,
    "الثاني": 2, "الثالث": 3, "الرابع": 4, "الخامس": 5,
    "السادس": 6, "السابع": 7, "الثامن": 8, "التاسع": 9, "العاشر": 10,
    "الحادي عشر": 11, "الثاني عشر": 12, "الثالث عشر": 13,
    "الرابع عشر": 14, "الخامس عشر": 15,
}

r = PdfReader(str(PDF))
lines = []
for i in range(len(r.pages)):
    t = r.pages[i].extract_text() or ""
    # content pages usually have "برمجة الحاسب" + day number in header
    if "برمجة" in t and "الحاسب" in t and "اليوم" in t:
        m = re.search(r"اليوم\s*\n?\s*(ال[^\n]{3,20}|\d+|[٠-٩]+)", t)
        if m:
            frag = m.group(1).strip()
            for name, num in DAY_NUM.items():
                if name in frag or frag.startswith(str(num)):
                    lines.append(f"day={num} pdfPageIndex={i} pdfPage={i+1}")
                    preview = " | ".join(l.strip() for l in t.split("\n") if l.strip())[:120]
                    lines.append(f"  {preview}")
                    break

OUT.write_text("\n".join(lines), encoding="utf-8")
print(f"{len(lines)} lines -> {OUT}")
