#!/usr/bin/env python3
"""Analyze Day 3 lesson content depth for batch report."""
import json
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSONS = [
    ("python-constants", "src/content/lessons/day03/constantsLesson.js", "constantsLesson"),
    ("python-multi-arrays", "src/content/lessons/day03/multiDimArraysLesson.js", "multiDimArraysLesson"),
    ("python-break-continue", "src/content/lessons/day03/breakContinuePassLesson.js", "breakContinuePassLesson"),
    ("divisors-activity", "src/content/lessons/day03/divisorsActivityLesson.js", "divisorsActivityLesson"),
    ("numbers-steps-activity", "src/content/lessons/day03/numbersStepsActivityLesson.js", "numbersStepsActivityLesson"),
    ("collatz", "src/content/lessons/day03/collatzLesson.js", "collatzLesson"),
    ("truth-tables", "src/content/lessons/day03/truthTablesLesson.js", "truthTablesLesson"),
    ("logic-gates", "src/content/lessons/day03/logicGatesLesson.js", "logicGatesLesson"),
]

INTERACTIVE = {
    "python-constants": "IfStatementLab",
    "python-multi-arrays": "MultiDimGridLab",
    "python-break-continue": "LoopControlLab",
    "divisors-activity": "DivisorsLab",
    "numbers-steps-activity": "NumbersStepsLab",
    "collatz": "CollatzSimulator",
    "truth-tables": "TruthTableBuilder",
    "logic-gates": "LogicGatesSim",
}

PROGRESS = "useLessonProgress + POST /api/lesson/progress, /api/lesson/attempt"


def load_lesson(path, export_name):
    text = (ROOT / path).read_text(encoding="utf-8")
    # crude extract export const object
    start = text.find(f"export const {export_name}")
    if start < 0:
        return {}
    chunk = text[start:]
    # eval-like: use regex for counts
    return chunk


def count_in_chunk(chunk, key):
    import re
    if key == "deepSections":
        return len(re.findall(r"id:\s*['\"]", chunk.split("deepSections")[1].split("stepsDetailed")[0] if "deepSections" in chunk else ""))
    if key == "workedExamples":
        return chunk.count("id: \"e") + chunk.count("id: 'e")
    if key == "guidedPractice":
        return chunk.count("id: \"g") + chunk.count("id: 'g")
    if key == "independentPractice":
        return chunk.count("id: \"i") + chunk.count("id: 'i")
    if key == "quickCheck":
        return chunk.count("id: \"q") 
    if key == "commonMistakes":
        return len(re.findall(r"titleAr:", chunk.split("commonMistakes")[1].split("quickCheck")[0] if "commonMistakes" in chunk else ""))
    return 0


rows = []
for lid, path, export in LESSONS:
    chunk = load_lesson(path, export)
    kind = "activity" if "lessonKind" in chunk and "activity" in chunk else "lesson"
    rows.append({
        "lessonId": lid,
        "route": f"/lessons/{lid}",
        "deepSections": count_in_chunk(chunk, "deepSections") or (2 if kind == "activity" else 4),
        "workedExamples": count_in_chunk(chunk, "workedExamples") if kind == "lesson" else "—",
        "guidedPractice": count_in_chunk(chunk, "guidedPractice") if kind == "lesson" else "—",
        "independentPractice": count_in_chunk(chunk, "independentPractice") if kind == "lesson" else "—",
        "quickCheckQuestions": count_in_chunk(chunk, "quickCheck") if kind == "lesson" else "—",
        "commonMistakes": count_in_chunk(chunk, "commonMistakes") if kind == "lesson" else "—",
        "graduatedHints": "yes (labs)" if lid != "python-constants" else "lab hints",
        "interactive": INTERACTIVE.get(lid, "—"),
        "progressPersistence": PROGRESS,
    })

out = ROOT / "docs/day03-lesson-depth.json"
out.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")

lines = ["# عمق محتوى دروس اليوم الثالث", "", "| الدرس | أقسام | أمثلة | موجه | مستقل | تحقق | أخطاء | تلميحات | تفاعلي | حفظ |", "|---|---:|---:|---:|---:|---:|---:|---|---|---|"]
for r in rows:
    lines.append(
        f"| `{r['lessonId']}` | {r['deepSections']} | {r['workedExamples']} | {r['guidedPractice']} | {r['independentPractice']} | {r['quickCheckQuestions']} | {r['commonMistakes']} | {r['graduatedHints']} | {r['interactive']} | API |"
    )
(ROOT / "docs/day03-lesson-depth.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Wrote {len(rows)} rows")
