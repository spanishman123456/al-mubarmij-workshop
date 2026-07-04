# خطة الانتقال من SQLite إلى PostgreSQL

## الوضع الحالي (فرع التطوير)

- **التخزين:** SQLite عبر `sql.js` في ملف `server/data/platform.db`
- **النسخ الاحتياطي:** `.bak` قبل كل كتابة ذرية
- **الجلسات:** جدول `auth_sessions` في نفس الملف
- **مناسب ل:** التطوير، الفصل الواحد، عدد محدود من المستخدمين المتزامنين

## مخاطر الإنتاج على SQLite

| المخاطرة | التأثير |
|---|---|
| كتابات متزامنة | sql.js single-writer — تنافس على ملف واحد |
| إيقاف أثناء الحفظ | mitigated بـ atomic rename + `.bak` |
| نسخ الملف على Render | ephemeral disk — فقدان بيانات |
| توسع أفقي | غير مدعوم |

## اختبارات ما قبل الانتقال (مطلوبة قبل النشر الواسع)

1. **تزامن:** 20+ طالب يحفظون تقدماً خلال 30 ثانية — لا فقدان ولا تلف
2. **كتابة متزامنة:** `POST /api/lesson/progress` متوازية — تحقق من سلامة الصفوف
3. **استعادة `.bak`:** إيقاف الخادم، استبدال `.db` بـ `.bak`، إعادة التشغيل
4. **إيقاف أثناء الحفظ:** `SIGKILL` أثناء `persistDatabase` — الملف السابق أو `.bak` سليم

> **لا يُنفَّذ الانتقال الآن** — يستمر التطوير على SQLite في `feature/full-curriculum-expansion`.

## مراحل الانتقال المقترحة

### المرحلة 1 — تجريد طبقة البيانات (1–2 أيام)

- استبدال استدعاءات `runSql` المباشرة بـ repositories موجودة (جاهزة جزئياً)
- إضافة `DATABASE_URL` في `.env` مع fallback إلى SQLite محلياً

### المرحلة 2 — PostgreSQL محلي (2–3 أيام)

- Docker Compose: `postgres:16` + migrate schema
- نقل الجداول: `lesson_progress`, `lesson_attempts`, `onboarding_*`, `auth_sessions`, `auth_access_log`
- script `npm run db:migrate` باستخدام `pg` أو Drizzle

### المرحلة 3 — Render / إنتاج (1 يوم)

- Render PostgreSQL add-on
- `DATABASE_URL` في متغيرات البيئة
- إزالة الاعتماد على ملف `.db` على القرص

### المرحلة 4 — تحقق

- إعادة تشغيل suite: Vitest integration + Playwright E2E
- اختبار تزامن من CI

## قرار

| البيئة | التخزين |
|---|---|
| `feature/full-curriculum-expansion` | SQLite + sql.js |
| `main` بعد المراجعة | SQLite مؤقتاً على Render Static فقط (بدون API) |
| إنتاج كامل (API + تقدم) | PostgreSQL **قبل** الاستخدام الواسع |

## مراجع الملفات

- `server/db/index.js` — persist atomic
- `server/db/schema.js` — DDL
- `server/repositories/*.js` — منطق CRUD
- `server/auth/sessionRepository.js` — جلسات
