"""Extract worksheet-related pages from curriculum PDF."""
import json
import re
import sys
from pathlib import Path

import pypdf

PDF = Path(r"C:\Users\hosam\OneDrive\Desktop\برمجة الحاسب_compressed.pdf")
OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "pdf-worksheets-raw.json"

# Page ranges per day (1-indexed) — worksheet / answer sections from PDF TOC
DAY_PAGE_RANGES = {
    1: list(range(77, 93)),   # binary conversion worksheets ~p77-92
    2: list(range(115, 127)),
    3: list(range(145, 155)),
    4: list(range(260, 274)),
    5: list(range(274, 290)),
    6: list(range(310, 330)),
    7: list(range(350, 370)),
    8: list(range(390, 410)),
    9: list(range(420, 440)),
    10: list(range(450, 470)),
    11: list(range(480, 500)),
    12: list(range(500, 520)),
    13: list(range(520, 540)),
    14: list(range(540, 560)),
}


def clean(text: str) -> str:
    text = re.sub(r"\s+", " ", text or "").strip()
    return text


def split_questions(text: str) -> list[str]:
    """Heuristic: numbered items 1. 2. or Arabic question blocks."""
    parts = re.split(r"(?<=\d)\.\s+|\n\s*\d+[\.\)]\s+", text)
    items = []
    for p in parts:
        p = clean(p)
        if len(p) < 15:
            continue
        if re.match(r"^(إجابات|برمجة|اليوم|الأهداف)", p):
            continue
        items.append(p[:500])
    return items[:12]


def main():
    reader = pypdf.PdfReader(str(PDF))
    result = {"total_pages": len(reader.pages), "days": {}}

    for day, pages in DAY_PAGE_RANGES.items():
        combined = []
        for p in pages:
            if 1 <= p <= len(reader.pages):
                t = reader.pages[p - 1].extract_text() or ""
                if t.strip():
                    combined.append({"page": p, "text": clean(t)})
        full = " ".join(x["text"] for x in combined)
        questions = split_questions(full)
        result["days"][f"day-{day:02d}"] = {
            "pages": pages,
            "questions": questions,
            "raw_snippet": full[:2000],
        }

    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT} ({len(result['days'])} days)")


if __name__ == "__main__":
    main()
