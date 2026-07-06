# تقرير نشر Render — student-pilot-batch-07

**التاريخ:** 2026-07-05  
**URL:** https://al-mubarmij-workshop.onrender.com  
**الإصدار المطلوب:** `457c1cb` / `release/student-pilot-batch-07` / tag `student-pilot-batch-07`

---

## حالة النشر

| البند | الحالة |
|---|---|
| **نشر commit 457c1cb على Render** | ⏸ **لم يُكتمل** — لا يوجد `RENDER_API_KEY` ولا Deploy Hook في الجلسة؛ Dashboard يتطلب تسجيل دخول |
| **الكود على GitHub** | ✅ جاهز (`release/student-pilot-batch-07` @ `457c1cb`) |
| **أتمتة النشر** | ✅ أُضيفت (`scripts/render-deploy-pilot.mjs`, `.github/workflows/render-deploy-pilot.yml`) |
| **جاهز للطلاب** | ❌ **لا** — الموقع الحالي يشغّل نسخة أقدم |

---

## 1. فحص Render الحالي (قبل التغيير)

| البند | النتيجة |
|---|---|
| **URL** | https://al-mubarmij-workshop.onrender.com |
| **فرع GitHub على `main`** | `9db4f20` — Fix student login tracking… |
| **Commit منشور فعليًا (تقدير)** | `9db4f20` أو أقدم — bundle `index-BowpIY04.js` ≠ build الدفعة 7 |
| **Auto-Deploy** | غير مؤكد (يحتاج Dashboard) — على الأرجح من `main` |
| **Persistent Disk** | غير مؤكد — `/api/health` لا يُرجع `database` (صيغة prod القديمة) |
| **بيانات طلاب** | غير مؤكدة — لا وصول لملف DB |
| **Health** | `GET /api/health` → `200` + `{"ok":true,"at":"…"}` |
| **Auth API** | `GET /api/auth/me` → HTML SPA (مسارات auth غير مفعّلة في النسخة الحالية) |
| **Login UI** | ✅ صفحة `/login` بالعربية تعمل |
| **متغيرات بيئة قديمة** | غير مرئية — يُفترض عدم وجود `TEACHER_BCRYPT_HASH` (نسخة ما قبل batch 7) |

---

## 2. ما يلزم لإتمام النشر (خطوتان — ~5 دقائق)

### أ) Render Dashboard

1. **Settings → Branch:** `release/student-pilot-batch-07`
2. **Environment:** (انظر `.env.example` — **لا تُكتب القيم السرية في Git**)
   - `NODE_ENV=production`
   - `TEACHER_BCRYPT_HASH` ← `TEACHER_PASSWORD='…' npm run hash:teacher-password`
   - `APP_URL` + `ALLOWED_ORIGINS` = `https://al-mubarmij-workshop.onrender.com`
   - `PLATFORM_DB_PATH=/opt/render/project/src/server/data/platform.db`
   - `CONTENT_VERSION=student-pilot-batch-07`
   - `APP_COMMIT_SHA=457c1cb`
   - `REVOKE_TEACHER_SESSIONS=1` (مرة واحدة — marker file يمنع التكرار)
3. **Disks:** mount `/opt/render/project/src/server/data`
4. **Manual Deploy → commit `457c1cb`**

### ب) أو Deploy Hook

```bash
RENDER_DEPLOY_HOOK_URL='…من Dashboard…' npm run deploy:render-pilot
```

أو GitHub Actions → **Deploy student pilot to Render** (بعد إضافة secret `RENDER_DEPLOY_HOOK_URL`).

---

## 3. اختبارات ما بعد النشر (HTTPS — checklist)

نفّذ بعد اكتمال Deploy:

| الاختبار | المتوقع |
|---|---|
| `GET /api/health` | `{ ok: true }` (prod minimal) |
| `GET /api/auth/me` بدون cookie | `401` JSON |
| login طالب | cookie HttpOnly + تقدم يُحفظ |
| reload + re-login | استعادة التقدم |
| login معلم (hash جديد) | 200 + لوحة المعلم |
| `/teacher/day-03-answers` طالب | 403 API + redirect UI |
| CSRF mutation بدون token | 403 |
| draft day-4 routes | غير موجودة / محجوبة |
| Restart Render | بيانات تبقى على disk |

**لم تُنفَّذ بعد** — تنتظر اكتمال النشر.

---

## 4. Rollback

| البند | المرجع |
|---|---|
| Commit سابق | `9db4f20` (main) |
| DB backup | `platform-pre-pilot-<date>.bak` قبل التحديث |
| إعادة نشر | Manual Deploy → `9db4f20` |
| استعادة DB | `cp backup platform.db` على disk |

---

## 5. تأكيدات

| البند | الحالة |
|---|---|
| توقف batch 8 / اليوم 4 | ✅ |
| لا merge مع main | ✅ |
| إصدار 457c1cb على GitHub | ✅ |
| **الموقع جاهز للطلاب** | ❌ **بعد النشر + الاختبارات أعلاه** |

التفاصيل: [`docs/render-deploy-pilot.md`](docs/render-deploy-pilot.md)
