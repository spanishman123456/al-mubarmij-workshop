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
  "karnaugh-maps": "خريطة كارنوف",
  "logic-equivalence": "الاقترانات المنطقية",
  "python-tuples": "الحقول المترابطة",
  "nested-loops-lab": "الحلقات المتداخلة",
  "linear-search": "البحث الخطي",
  "binary-search": "البحث الثنائي",
  "sorting-algorithms": "فرز الاختيار",
  "sieve-primes": "غربال إراتوستينس",
  "caesar-cipher": "شفرة قيصر والتشفير",
  "memory-hierarchy": "الذاكرة والتخزين المؤقت",
  "cpu-scheduling": "جدولة المعالج",
};

export function lessonLabelAr(lessonId) {
  return LESSON_LABELS_AR[lessonId] || lessonId;
}
