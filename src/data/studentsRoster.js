/**
 * سجل الطلاب — مُستورد من ملف Excel الرسمي (موهبة)
 * لا تعرض رقم الهوية كاملاً في الواجهة — استخدم maskNationalId()
 */

export const STUDENTS_ROSTER = [
  {
    "nationalId": "1165814631",
    "nameAr": "حسن حاجي حسين السلامين",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1167676921",
    "nameAr": "يحيى راضي محمد الطويل",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1171156852",
    "nameAr": "الحسن ناصر احمد السالم",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1168088449",
    "nameAr": "عبدالعزيز محمد بن عبداللطيف العرفج",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1167619236",
    "nameAr": "علي محمد سمير الماجد",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1170757924",
    "nameAr": "محمد أحمد محمد بن الشيخ",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1165324292",
    "nameAr": "هادي احمد ابن عبدالهادي الهاشم",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1167568268",
    "nameAr": "ريان حسين بن معتوق الاصمخ",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1166809952",
    "nameAr": "علي موسى ابراهيم الهاشم",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1167060266",
    "nameAr": "خالد عبدالله خالد الحسين",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1161185713",
    "nameAr": "عبدالعزيز أسامه عبدالعزيز القاضي",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1168058988",
    "nameAr": "رواف احمد بن عبداللطيف الدوغان",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1169897301",
    "nameAr": "عبدالعزيز عبدالرحمن عبدالعزيز الملحم",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1162034662",
    "nameAr": "حسن احمد جواد الصالح",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1166217404",
    "nameAr": "محمد خالد سليمان المديرس",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1167726064",
    "nameAr": "فهد سعد بن فهد بوسعدالجميعه",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1168174041",
    "nameAr": "عبدالمحسن محمد عبدالمحسن الحسن",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1164805762",
    "nameAr": "عبدالله عيسى محمد البشر",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1162716078",
    "nameAr": "مشاري عمر محمد السعيد",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  },
  {
    "nationalId": "1169721964",
    "nameAr": "سلمان خالد بن سلمان الملحم",
    "unitAr": "برمجة الحاسب",
    "languageAr": "عربي"
  }
];

export function maskNationalId(nationalId) {
  const s = String(nationalId || "").replace(/\D/g, "");
  if (s.length < 4) return "****";
  return "*".repeat(Math.max(s.length - 4, 6)) + s.slice(-4);
}

export function findStudentByNationalId(nationalId) {
  const nid = String(nationalId || "").replace(/\D/g, "");
  if (!nid) return null;
  return STUDENTS_ROSTER.find((s) => s.nationalId === nid) ?? null;
}

export function rosterStudentToUser(row) {
  return {
    id: `stu-${row.nationalId}`,
    role: "student",
    nationalId: row.nationalId,
    nameAr: row.nameAr,
    unitAr: row.unitAr,
    languageAr: row.languageAr,
    grade: "6-8",
  };
}

export function getAllRosterStudents() {
  return STUDENTS_ROSTER.map(rosterStudentToUser);
}

export function findRosterUserById(id) {
  return getAllRosterStudents().find((u) => u.id === id) ?? null;
}
