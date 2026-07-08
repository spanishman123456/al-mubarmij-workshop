# إصدار الطلاب — batch-13 (الأيام 6–9)

## الهدف

نشر محتوى **الأيام 6–9** للطلاب مع بقاء الفتح **بالتسلسل** (`STUDENT_UNLOCK_POLICY=sequential`).

- الطالب الذي أكمل اليوم 5 → يفتح له اليوم 6.
- بعد إكمال اليوم 6 → اليوم 7، وهكذا حتى اليوم 9.
- **لا** يُفتح اليوم 9 لجميع الطلاب دفعة واحدة.

## الفرع

```text
release/student-pilot-batch-13-days-06-09
```

مبني فوق commit اليوم التاسع: `batch-13-day09-complete`.

## المحتوى المضمّن (1–9)

| اليوم | الفرع المصدر | الحالة |
|------|--------------|--------|
| 1–2 | منشور سابقًا | pilot |
| 3–5 | feature batches | منشور في الكود |
| 6 | batch-10-day06 | ✅ |
| 7 | batch-11-day07 | ✅ |
| 8 | batch-12-day08 | ✅ |
| 9 | batch-13-day09 | ✅ |

## ضبط النشر — `publishedDays = 9`

### الطريقة 1 (مفضّلة): لوحة المعلم

من `/teacher` → **إعدادات النشر** (`DayPublicationPanel`):

- اضبط **عدد الأيام المنشورة** إلى **9**.
- تأكد أن **سياسة الفتح** = **sequential**.
- يُحفظ في `platform-settings.json` على الخادم (قاعدة البيانات/الملف).

### الطريقة 2: متغيرات Render (عند النشر)

```text
PUBLISHED_DAYS=9
VITE_PUBLISHED_DAYS=9
STUDENT_UNLOCK_POLICY=sequential
```

**مهم:** `VITE_PUBLISHED_DAYS` يجب أن يساوي `PUBLISHED_DAYS` عند البناء على Render.

**لا تطبّق على Render** حتى الموافقة النهائية بعد نجاح جميع الاختبارات.

## اختبارات ما قبل النشر

```bash
npm test
npm run build
npm run test:e2e:day06
npm run test:e2e:day07
npm run test:e2e:day08
npm run test:e2e:day09
npm run test:e2e:days06-09-release
npm run test:e2e:pilot
```

## بعد النشر على Render

1. شغّل **إعادة حساب التقدم** من لوحة المعلم (`POST /api/progress/recalculate`).
2. تحقق أن `/path` يعرض:
   - **متاح الآن** — يوم منشور + الطالب مؤهل.
   - **مقفل / أكمل اليوم السابق** — منشور لكن غير مؤهل.
   - **غير منشور / الجدول** — أيام 10+.
3. راجع لوحة المعلم لتقدم الأيام 6–9.

## لا يُنشر في هذا الإصدار

- اليوم 10 وما بعده (`draft` عند `publishedDays=9`).
