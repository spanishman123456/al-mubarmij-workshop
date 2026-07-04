# قائمة تحقق RTL والهاتف — الدفعة 3

**التاريخ:** 2026-07-05  
**الفرع:** `feature/full-curriculum-expansion`

## يدوي — يُنفَّذ قبل دمج main

| # | البند | الحالة | ملاحظات |
|---:|---|---|---|
| 1 | سلامة العربية | ✅ | دروس day01/day02 بـ `dir="rtl"` |
| 2 | اتجاه RTL | ✅ | `font-ar` + rtl افتراضي |
| 3 | الأكواد `dir="ltr"` | ✅ | IfStatementLab، `<pre>` |
| 4 | جداول على الهاتف | ⚠️ | `overflow-x-auto` — مراجعة يدوية |
| 5 | وضوح الأزرار | ✅ | edu-btn |
| 6 | حفظ محاولات الدرس | ✅ | attempts API |
| 7 | استعادة بعد refresh | ✅ | PlatformContext + sync |
| 8 | جهاز/جلسة أخرى | ⚠️ | نفس الحساب + `/api/progress/sync` |
| 9 | قفل قبل التمهيد | ✅ | OnboardingGate + quiz-pre |
| 10 | لوحة المعلم | ✅ | pre/post + onboarding |
| 11 | إجابات المعلم | ✅ | `/teacher/day-01-answers` |

## Vitest + Build

`npm run test` و `npm run build` — تُشغَّل في كل دفعة.

## وصف واجهات

- **/onboarding:** 6 عناصر؛ التقويم القبلي يظهر «مكتمل» بعد quiz-pre.
- **/lessons/algorithms:** 9 أقسام، 8 أمثلة، AlgorithmStepsLab.
- **/lessons/if-statement:** 8 أمثلة، IfStatementLab مع حفظ محاولات.
- **/teacher/day-01-answers:** مفاتيح pdf 63, 78, 79, 81.
