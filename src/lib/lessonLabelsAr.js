/** عناوين عربية للدروس — تُستخدم في تفاصيل التقدم */
export const LESSON_LABELS_AR = {
  "binary-cards": "بطاقات الأرقام الثنائية",
  "binary-puzzle": "ألغاز الأرقام الثنائية",
  "binary-matching": "مطابقة الأرقام الثنائية",
  "number-systems": "أنظمة العد",
  "python-intro": "مقدمة بايثون",
  "string-splitting": "تقسيم النصوص",
  "ascii-unicode": "ASCII و Unicode",
  "hex-puzzle": "لغز الست عشري",
  "hex-colors": "الألوان والست عشري",
};

export function lessonLabelAr(lessonId) {
  return LESSON_LABELS_AR[lessonId] || lessonId;
}
