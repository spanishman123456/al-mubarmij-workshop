#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path
from pypdf import PdfReader

PDF = Path(r"C:\Users\hosam\OneDrive\Desktop\برمجة الحاسب.pdf")
OUT = Path(__file__).resolve().parent.parent / "docs" / "pdf-day2-search.txt"
KEYS = ["التحويلات", "حساب الأساس", "خوارزم", "If", "الدليل المرجعي", "اليوم الثاني", "الروتين"]

r = PdfReader(str(PDF))
lines = []
for i in range(len(r.pages)):
    t = r.pages[i].extract_text() or ""
    if any(k in t for k in KEYS):
        head = " | ".join(l.strip() for l in t.split("\n") if l.strip())[:200]
        lines.append(f"idx={i} pdf={i+1} | {head}")
OUT.write_text("\n".join(lines[:80]), encoding="utf-8")
print(len(lines), "hits")
