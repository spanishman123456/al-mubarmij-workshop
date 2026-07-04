#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dump page headers for day boundary calibration."""
from pathlib import Path
from pypdf import PdfReader

PDF = Path(r"C:\Users\hosam\OneDrive\Desktop\برمجة الحاسب.pdf")
OUT = Path(__file__).resolve().parent.parent / "docs" / "pdf-content-range-dump.txt"

FOOTER = __import__("re").compile(r"^(\d{1,3})$")


def printed(text):
    for line in reversed([l.strip() for l in text.split("\n") if l.strip()][-8:]):
        m = FOOTER.match(line)
        if m:
            n = int(m.group(1))
            if 1 <= n <= 600:
                return n
    return None


def main():
    r = PdfReader(str(PDF))
    lines = []
    # Day 1 likely 24-142, Day 2 starts ~143
    for i in range(23, min(220, len(r.pages))):
        text = r.pages[i].extract_text() or ""
        p = printed(text)
        head = " | ".join(l.strip() for l in text.split("\n") if l.strip())[:160]
        if p and (p <= 160 or "اليوم" in text or "BINGO" in text or "If" in text or "خوارز" in text):
            lines.append(f"idx={i} pdf={i+1} printed={p} | {head}")
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(lines)} lines to {OUT}")


if __name__ == "__main__":
    main()
