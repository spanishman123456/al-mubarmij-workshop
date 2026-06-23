"""Generate students roster JS from Excel."""
import json
import re
import sys
from pathlib import Path

import openpyxl

EXCEL = Path(r"C:\Users\hosam\OneDrive\Desktop\نموذج تحضير الطلبة معدل.xlsx")
OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "studentsRoster.js"

def main():
    wb = openpyxl.load_workbook(str(EXCEL), read_only=True, data_only=True)
    ws = wb["الأسبوع الأول"]
    students = []
    seen = set()
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            continue
        cells = [c for c in row]
        if len(cells) < 3:
            continue
        nid = str(cells[1] or "").strip()
        nid = re.sub(r"\D", "", nid)
        name = str(cells[2] or "").strip()
        if not nid or len(nid) < 8 or not name:
            continue
        if nid in seen:
            continue
        seen.add(nid)
        students.append({
            "nationalId": nid,
            "nameAr": name,
            "unitAr": str(cells[3] or "برمجة الحاسب").strip(),
            "languageAr": str(cells[4] or "عربي").strip(),
        })
    wb.close()

    lines = [
        "/**",
        " * سجل الطلاب — مُستورد من ملف Excel الرسمي (موهبة)",
        " * لا تعرض رقم الهوية كاملاً في الواجهة — استخدم maskNationalId()",
        " */",
        "",
        f"export const STUDENTS_ROSTER = {json.dumps(students, ensure_ascii=False, indent=2)};",
        "",
        "export function maskNationalId(nationalId) {",
        '  const s = String(nationalId || "").replace(/\\D/g, "");',
        '  if (s.length < 4) return "****";',
        '  return "*".repeat(Math.max(s.length - 4, 6)) + s.slice(-4);',
        "}",
        "",
        "export function findStudentByNationalId(nationalId) {",
        '  const nid = String(nationalId || "").replace(/\\D/g, "");',
        "  if (!nid) return null;",
        "  return STUDENTS_ROSTER.find((s) => s.nationalId === nid) ?? null;",
        "}",
        "",
        "export function rosterStudentToUser(row) {",
        "  return {",
        '    id: `stu-${row.nationalId}`,',
        '    role: "student",',
        "    nationalId: row.nationalId,",
        "    nameAr: row.nameAr,",
        '    unitAr: row.unitAr,',
        '    languageAr: row.languageAr,',
        '    grade: "6-8",',
        "  };",
        "}",
        "",
        "export function getAllRosterStudents() {",
        "  return STUDENTS_ROSTER.map(rosterStudentToUser);",
        "}",
        "",
        "export function findRosterUserById(id) {",
        "  return getAllRosterStudents().find((u) => u.id === id) ?? null;",
        "}",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(students)} students to {OUT}")


if __name__ == "__main__":
    main()
