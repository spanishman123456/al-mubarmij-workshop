import json
from pathlib import Path

items = json.load(open(Path(__file__).parents[1] / "docs/pdf-content-inventory.json", encoding="utf-8"))
d2 = sorted([i for i in items if i.get("dayNumber") == 2], key=lambda x: x.get("pdfPageIndex") or 0)
lines = []
for i in d2:
    lines.append(
        f"{i.get('pdfPageIndex')}|{i.get('printedPageNumber')}|{i.get('contentType')}|{(i.get('title') or '')[:80]}|{i.get('topicSlug')}|{i.get('implementationStatus')}"
    )
Path(__file__).parents[1].joinpath("docs/_d2_dump.txt").write_text("\n".join(lines), encoding="utf-8")
print(len(d2))
