# حالة تغطية اليوم الأول — مراجعة مقابل PDF

**حدود اليوم 1:** pdfPageIndex 23–92 (pdfPage 24–93)  
**مصدر:** `docs/curriculum-day-boundaries.json` + مراجعة يدوية

| الموضوع | pdfPageIndex | المسار | الحالة | ملاحظات |
|---|---:|---|---|---|
| نشاط BINGO | 26–28, 53 | `/onboarding/bingo` | **مكتمل** | 5×5 + حفظ API |
| مدونة الشرف | 54 | `/onboarding/honor-code` | **مكتمل** | توقيع رقمي |
| سياسة الاستخدام | 55 | `/onboarding/acceptable-use` | **مكتمل** | |
| اتفاقية مدونة الشرف | 55–56 | `/onboarding/honor-agreement` | **مكتمل** | |
| عقد استخدام التقنيات | 56–57 | `/onboarding/tech-contract` | **مكتمل** | |
| التقويم القبلي | 14, 63 | `/quizzes/take/quiz-pre` | **جزئي** | الاختبار موجود؛ لم يُدمج في بوابة التمهيد |
| أحجية بطاقات الأرقام الثنائية | 31–32 | `/lessons/binary-cards` | **مكتمل** | Unplugged |
| أحجية الأرقام الثنائية | 70–76 | `/lessons/binary-puzzle` | **قيد التنفيذ** | ألغاز أعداد طويلة |
| الأساس الثنائي / أنظمة العد | 30–34, 77–78 | `/lessons/number-systems` | **مكتمل** | نموذج عمق كامل |
| بطاقات نظام الأرقام الثنائي | 78–79 | `/lessons/binary-cards` | **جزئي** | يحتاج قسم pdf 79 منفصل |
| الأساسات (3، 5، 8، 16) | 48–50 | `/lessons/number-systems` | **جزئي** | ضمن درس العد |
| بطاقات المطابقة | 81–82 | `/lessons/binary-matching` | **قيد التنفيذ** | |
| مقدمة بايثون | 85, 113 | `/lessons/python-intro` | **جزئي** | يحتاج توسيع مختبر |
| تقسيم سلاسل الرموز | 40, 129 | `/lessons/string-splitting` | **قيد التنفيذ** | |
| ASCII / Unicode | 46, 96–97 | `/lessons/ascii-unicode` | **مكتمل** | جدول تفاعلي |
| أحجية تحويل hex | 50–51 | `/lessons/hex-puzzle` | **قيد التنفيذ** | |
| الألوان / Kuler | 51–52 | `/lessons/hex-colors` | **مكتمل** | HexColorLab |
| إجابات المعلم | 63, 78, 81… | — | **غير منفذ** | للمعلم فقط — لاحقاً |

## أخطاء جرد سابقة — تم تصحيحها

| الخطأ | التصحيح |
|---|---|
| Fibonacci / Big-O / Hanoi في «اليوم 2» | نُقلت إلى **اليوم 8** (pdfPageIndex 373+) |
| OCR يحدد اليوم من TOC | الاعتماد على `curriculum-day-boundaries.json` |
| `pdfPage` vs `printedPage` مخلوطان | الحقلان منفصلان: `pdfPageIndex` (0-based) و `printedPageNumber` |
| 556 عنصراً = منجز | `implementationStatus` يفرّق done / partial / pending |

## العناصر المتبقية لليوم 1 (أولوية الدفعة الحالية)

1. `/lessons/binary-puzzle`
2. `/lessons/binary-matching`
3. `/lessons/string-splitting`
4. `/lessons/hex-puzzle`
5. دمج التقويم القبلي في التمهيد
6. قسم بطاقات النظام (pdf 79) — توسيع binary-cards

**لا يُدرج الجمع الثنائي في اليوم 1** — موضعه في المنهج بعد اليوم 1 (مراجعة لاحقة).
