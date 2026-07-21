# تقرير إصدار ونشر — student-pilot-batch-07

**تاريخ:** 2026-07-05  
**فرع التطوير:** `feature/full-curriculum-expansion`  
**فرع الإصدار:** `release/student-pilot-batch-07`  
**Tag:** `student-pilot-batch-07`  
**Commit الإصدار:** `457c1cb`  

**الدمج مع main:** ❌  
**النشر على Render:** ⏳ جاهز للنشر — يتطلب تعيين أسرار Render يدويًا (لا نشر تلقائي من هذا التقرير)

---

## 1. نطاق الإصدار

| المكوّن | مشمول |
|---|---|
| القسم التمهيدي (onboarding) | ✅ |
| الأيام 1–3 (دروس + مختبرات) | ✅ |
| قاعدة SQLite مركزية | ✅ |
| حفظ/استعادة تقدم | ✅ |
| مصادقة خادم + CSRF | ✅ |
| إجابات المعلم المحمية | ✅ |
| اليوم 4 (تطوير batch 8) | ❌ — draft فقط، بدون routes منشورة |
| الأيام 4–15 (محتوى curriculum قديم) | ✅ — صفحات عامة + sims كما كانت |

---

## 2. نتيجة البحث عن الأسرار

| نمط البحث | النتيجة |
|---|---|
| `babamama` | **0** تطابق بعد التنظيف |
| bcrypt hash ثابت في الكود | **0** — `TEACHER_BCRYPT_HASH` من env فقط |
| كلمات مرور في الاختبارات | **0** — Vitest/E2E يستخدمان env أو auto-test credentials |
| `SESSION_SECRET` ثابت | **0** — الجلسات عشوائية per-login في DB |
| API keys / tokens ثابتة | **0** في كود التطبيق |

**إجراءات:**
- إزالة التحقق من كلمة المرور على العميل (`demoUsers.js`)
- hash المعلم من `TEACHER_BCRYPT_HASH` فقط
- `REVOKE_TEACHER_SESSIONS=1` لمرة واحدة بعد تدوير كلمة المرور على Render

---

## 3. كلمة مرور المعلم

| البند | الحالة |
|---|---|
| كلمة `babamama` | ✅ **بُطلت** — لم تعد في الكود |
| hash جديد | ✅ يُولَّد محليًا: `TEACHER_PASSWORD='…' npm run hash:teacher-password` |
| تخزين | ✅ bcrypt في متغير `TEACHER_BCRYPT_HASH` على Render |
| إبطال جلسات | ✅ `REVOKE_TEACHER_SESSIONS=1` عند أول restart بعد التدوير |

**لا تُكتب كلمة المرور الجديدة في Git أو التقارير.**

---

## 4. متغيرات البيئة المطلوبة (Render)

| المتغير | مطلوب | الوصف |
|---|---|---|
| `NODE_ENV` | ✅ | `production` |
| `TEACHER_BCRYPT_HASH` | ✅ | bcrypt hash للمعلم |
| `APP_URL` | ✅ | `https://….onrender.com` |
| `ALLOWED_ORIGINS` | ✅ | نفس نطاق APP (CORS) |
| `PLATFORM_DB_PATH` | ✅ | `/opt/render/project/src/server/data/platform.db` |
| `REVOKE_TEACHER_SESSIONS` | مرة واحدة | `1` بعد تغيير كلمة المرور |
| `APP_COMMIT_SHA` | موصى | commit النشر |
| `CONTENT_VERSION` | موصى | `student-pilot-batch-07` |
| `BUILD_TIME` | اختياري | ISO timestamp |

**Cookies (إنتاج):** HttpOnly + Secure + SameSite=Lax + 8h  
**Express:** `trust proxy: 1` خلف Render proxy

---

## 5. Persistent Disk وقاعدة البيانات

| البند | القيمة |
|---|---|
| Disk mount | `/opt/render/project/src/server/data` |
| ملف DB | `/opt/render/project/src/server/data/platform.db` |
| نسخة `.bak` | rolling backup عند كل persist |
| نسخة قبل النشر | `npm run backup:db` → `platform-<timestamp>.bak` |
| Scaling | **instance واحدة** — لا horizontal scaling مع sql.js |
| استبداء DB | ❌ لا تنسخ dev DB إلى prod |

---

## 6. فحص ربط الدروس والمختبرات (أيام 1–3)

| الدرس | المختبر | الحالة |
|---|---|---|
| python-constants | **ConstantsLab** | ✅ أُصلح (كان IfStatementLab) |
| python-multi-arrays | MultiDimGridLab | ✅ |
| python-break-continue | LoopControlLab | ✅ |
| divisors-activity | DivisorsLab | ✅ |
| numbers-steps-activity | NumbersStepsLab | ✅ |
| collatz | CollatzSimulator | ✅ |
| truth-tables | TruthTableBuilder | ✅ |
| logic-gates | LogicGatesSim | ✅ |
| دروس day-02 | labs مخصصة لكل درس | ✅ (CardSort, While, AlgorithmSteps, …) |

---

## 7. إخفاء محتوى اليوم 4 (draft)

- `src/config/publication.js` — `DRAFT_LESSON_ROUTES` لمسارات batch 8
- `PublishedLessonRoute` — يمنع الطلاب من draft routes
- صفحات curriculum day-04..15 **تبقى** كما كانت (محتوى عام + karnaugh sim)
- لا routes جديدة لـ `/lessons/karnaugh-maps` إلخ في App

---

## 8. نتائج الاختبارات (محليًا)

| المجموعة | النتيجة |
|---|---|
| Vitest | **138/138** ✅ |
| Playwright | **6/6** ✅ |
| Build | ✅ |

---

## 9. Staging / Smoke على Render

> **لم يُنفَّذ النشر الفعلي من CI** — يتطلب إعداد Dashboard Render.

### checklist قبل تفعيل الطلاب

- [ ] تعيين `TEACHER_BCRYPT_HASH` (hash جديد)
- [ ] تعيين `APP_URL` + `ALLOWED_ORIGINS`
- [ ] تفعيل Persistent Disk
- [ ] `npm run backup:db` على prod قبل أول deploy
- [ ] Preview deploy + اختبار HTTPS:
  - login طالب / معلم
  - حفظ تقدم + reload + re-login
  - CSRF (mutations)
  - منع `/teacher/day-03-answers` للطالب
  - عدم ظهور draft day-4 lessons
  - mobile smoke
- [ ] Restart service → تحقق بقاء البيانات
- [ ] Smoke: `GET /api/health`, `GET /api/auth/me`

**لا تُفعَّل للطلاب إذا:** كلمة مرور قديمة، أو فشل persist بعد restart، أو فشل استعادة التقدم.

---

## 10. خطة Rollback

| البند | المرجع |
|---|---|
| Tag سابق | `student-pilot-batch-07` (هذا الإصدار) — للرجوع استخدم tag/commit سابق إن وُجد |
| DB backup | `server/data/platform-<timestamp>.bak` قبل النشر |
| إعادة نشر | Render → Deploy previous commit من `release/student-pilot-batch-07` |
| استعادة DB | استبدال `platform.db` من `.bak` على disk |
| سجل | تاريخ/وقت النشر + حساب المنفّذ |

---

## 11. تأكيدات

| البند | الحالة |
|---|---|
| توقف التطوير عند batch 7 | ✅ |
| لا بدء batch 8 / اليوم 4 اليوم | ✅ |
| استكمال batch 8 غدًا على فرع التطوير | ✅ |
| إصدار مجمّد للتجربة | ✅ |

---

## 12. Commits

```
457c1cb release: freeze student-pilot-batch-07 for staging
415bf08 docs: set batch-7 report commit hash
55758a4 feat(batch-7): close Day 3, harden auth, expand tests
```
