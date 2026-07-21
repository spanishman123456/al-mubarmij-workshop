# إصدار الطلاب — batch-08-day02-unlock

## الهدف

تفعيل **اليوم الثاني فقط** للطلاب الذين أكملوا اليوم الأول، مع نظام فتح الأيام بالتسلسل.

## لا يُنشر في هذا الإصدار

- اليوم الثالث وما بعده (يبقى `draft` عند `PUBLISHED_DAYS=2`)
- اليومان 4 و5 (محتوى التطوير فقط — غير مرئي للطلاب)

## متغيرات Render المطلوبة عند النشر

```text
PUBLISHED_DAYS=2
VITE_PUBLISHED_DAYS=2
STUDENT_UNLOCK_POLICY=sequential
```

**مهم:** يجب ضبط `VITE_PUBLISHED_DAYS` بنفس قيمة `PUBLISHED_DAYS` عند البناء على Render، وإلا قد يظهر اليوم الثاني «متاح الآن» بدون زر دخول (تم إصلاح ذلك في commit لاحق، لكن المتغيران يجب أن يتطابقا).

**لا تغيّر Render إلى `feature/full-curriculum-expansion` مباشرة** — استخدم هذا الفرع فقط.

## الفرع

```text
release/student-pilot-batch-08-day02-unlock
```

## بعد النشر

1. شغّل `POST /api/progress/recalculate` من لوحة المعلم.
2. تحقق أن الطلاب الذين أكملوا اليوم 1 يرون اليوم 2 «متاح الآن».
3. شغّل Playwright pilot smoke على الإنتاج إن أمكن.
