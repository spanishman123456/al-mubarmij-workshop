#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path
from pypdf import PdfReader

PDF = Path(r"C:\Users\hosam\OneDrive\Desktop\برمجة الحاسب.pdf")
OUT = Path(__file__).resolve().parent.parent / "docs" / "pdf-day7-search.txt"
r = PdfReader(str(PDF))
lines = []
for i in range(295, 375):
    t = r.pages[i].extract_text() or ""
    if "السابع" in t or ("اليوم" in t and "برمجة" in t):
        head = " | ".join(l.strip() for l in t.split("\n") if l.strip())[:200]
        lines.append(f"idx={i} pdf={i+1} | {head}")
OUT.write_text("\n".join(lines), encoding="utf-8")
print(len(lines))
