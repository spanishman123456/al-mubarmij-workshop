# تقرير الدفعة السابعة — إغلاق اليوم الثالث + تأمين + اختبارات

**الفرع:** `feature/full-curriculum-expansion`  
**Commit (هذا التقرير):** `55758a4`  
**Commit السابق (تقرير الدفعة 6):** `605f4b3`  
**Commit تنفيذ الدفعة 6 (كود):** `b03ec62`  

**الدمج مع main:** ❌ لم يُدمَج  
**النشر على Render:** ❌ لم يُنشر  

---

## ✅ تأكيد إغلاق اليوم الثالث

جميع **16/16** عنصرًا في `docs/day03-coverage.json`:

| implementationStatus | qaStatus | العدد |
|---|---|---:|
| done | passed | **16** |
| partial | — | **0** |

**العناصر الأربعة التي أُغلقت في هذه الدفعة:**

1. **نشاط الأرقام والخطوates** — مسار مستقل `/lessons/numbers-steps-activity` + `NumbersStepsLab`
2. **إجابات جداول الحقيقة** — ضمن `/teacher/day-03-answers` + `GET /api/teacher/day-03-answers`
3. **إجابات البوابات المنطقية** — نفس الصفحة/API مع بنية day02 (خطوات، أخطاء، تغذية راجعة، pdfPage)
4. **إرشادات المعلم الموسّعة** — `teacherGuidance` في `day03TeacherAnswers.js`

---

## 1. حالة عناصر اليوم الثالث (16/16)

| # | الموضوع | impl | qa |
|---:|---|---|---|
| 1 | الثوابت في بايثون | done | passed |
| 2 | المصفوفات متعددة الأبعاد | done | passed |
| 3 | الفهرسة والوصول والتعديل | done | passed |
| 4 | break / continue / pass | done | passed |
| 5 | else المرتبطة بالحلقة | done | passed |
| 6 | نشاط المقسومات | done | passed |
| 7 | تخمين Collatz | done | passed |
| 8 | نشاط الأرقام والخطوات | done | passed |
| 9 | اشتقاق جداول الحقيقة | done | passed |
| 10 | دليل جداول الحقيقة | done | passed |
| 11 | جداول الحقيقة | done | passed |
| 12 | إجابات جداول الحقيقة (معلم) | done | passed |
| 13 | دليل البوابات | done | passed |
| 14 | البوابات المنطقية | done | passed |
| 15 | إجابات البوابات (معلم) | done | passed |
| 16 | إرشادات المعلم | done | passed |

---

## 2. جدول عمق محتوى الدروس

مصدر: `docs/day03-lesson-depth.md` (مُولَّد عبر `scripts/generate-day03-depth-report.py`)

| الدرس | أقسام | أمثلة | موجه | مستقل | تحقق | أخطاء | تلميحات | تفاعلي | حفظ |
|---|---:|---:|---:|---:|---:|---:|---|---|---|
| python-constants | 2 | 2 | 2 | 2 | 1 | 2 | lab hints | IfStatementLab | API |
| python-multi-arrays | 3 | 2 | 2 | 2 | 1 | 2 | yes | MultiDimGridLab | API |
| python-break-continue | 4 | 3 | 2 | 2 | 1 | 2 | yes | LoopControlLab | API |
| divisors-activity | 2 | — | — | — | — | — | yes | DivisorsLab | API |
| numbers-steps-activity | 2 | — | — | — | — | — | yes | NumbersStepsLab | API |
| collatz | 2 | 2 | 2 | 2 | 1 | 2 | yes | CollatzSimulator | API |
| truth-tables | 3 | 2 | 2 | 2 | 1 | 2 | yes | TruthTableBuilder | API |
| logic-gates | 4 | 2 | 2 | 2 | 1 | 2 | yes | LogicGatesSim | API |

**ملاحظة:** دروس النشاط (divisors، numbers-steps) تركز على المختبر التفاعلي؛ الشرح النصي أقصر من الدروس النظرية لكن مرتبط بصفحات PDF 170–174.

---

## 3. الجلسات و CSRF و CORS

| المتطلب | التنفيذ |
|---|---|
| Cookie إنتاج | `httpOnly`, `secure` (prod), `sameSite: lax`, `maxAge: 8h` |
| SameSite=Lax | مناسب لنشر Vite+API على نفس النطاق أو proxy؛ موثّق في `docs/auth-security.md` |
| تدوير الجلسة عند login | `rotateSession` + `deleteSessionsForUser` |
| إبطال عند logout | `deleteSession` |
| انتهاء الجلسات | `purgeExpiredSessions` |
| Session ID غير صالح | `attachSession` → 401 |
| Session fixation | حذف كل جلسات المستخدم عند login |
| CSRF | double-submit: `platform_csrf` + `X-CSRF-Token` |
| Origin | `isOriginAllowed` + رفض 403 في prod |
| CORS | allowlist في `server/auth/cors.js` |

**اختبارات (`server/auth.session.test.js`) — 9/9 ✅**

- إعادة استخدام جلسة بعد logout  
- جلسة منتهية  
- تدوير/إبطال عند login (fixation)  
- رفض mutation بدون CSRF  
- Origin غير مسموح (prod)  
- طالب → summary معلم → 403  
- طالب → `/api/teacher/day-03-answers` → 403  
- معلم → day-03 answers → 200  
- Rate limit login → 429  

---

## 4. كلمات المرور وتسجيل الدخول

| البند | التفاصيل |
|---|---|
| خوارزمية | **bcrypt** (cost 10) — `server/auth/password.js` |
| SHA-256 وحده | ❌ لم يعد يُستخدم |
| Rate limiting | `server/auth/rateLimit.js` — حد محاولات + تأخير تدريجي |
| رسائل خطأ | `Invalid credentials` عامة — لا تكشف وجود الحساب |
| سجل فشل | `logFailedLoginAttempt` — بدون كلمة مرور |
| دخول الطالب | رقم هوية فقط — **خطر موثّق** في `docs/auth-security.md`؛ يُقترح PIN/OTP قبل الإنتاج |

**اختبار bcrypt:** `server/auth/password.test.js` ✅

---

## 5. سجل الوصول `auth_access_log`

- لا يُخزَّن: كلمات مرور، cookies، tokens، bodies كاملة  
- سياسة احتفاظ: `purgeOldAccessLogs` (90 يومًا) — `docs/auth-security.md`  
- الوصول: مسارات إدارية محمية بالدور  

---

## 6. `scripts/start-dev-server.mjs`

- يتحقق من PID على المنفذ 3001 + مسار `server/index.js` + cwd المشروع  
- `--check-only` / `npm run dev:server:check` — عرض دون إيقاف  
- لا يقتل عمليات Node غير مرتبطة  

---

## 7. `/api/health` — `appCommit`

أولوية: `APP_COMMIT_SHA` → `GIT_COMMIT` → `RENDER_GIT_COMMIT` → `git rev-parse HEAD` → `unknown`  
اختبار بدون `.git`: `server/health.commit.test.js` ✅  

---

## 8. Analytics Sync — الإصلاح الجذري

| السؤال | الجواب |
|---|---|
| السبب | طلبات POST `/api/analytics/*` بدون `X-CSRF-Token` بعد login |
| قبل اكتمال الجلسة؟ | لا — Cookie موجودة؛ CSRF ناقص |
| Race؟ | `reportLoginEvent` يُ awaited بعد `loginStudentApi` |
| إعادة محاولة؟ | لا تكرار ضار |
| فقد نشاط؟ | لا بعد الإصلاح |

**الإصلاح:** `src/lib/csrfCookie.js` + `mutationHeaders()` في `analyticsApi.js` و `platformApi.js`  
**اختبار:** `server/analytics.integration.test.js` + Playwright `analytics sync` ✅  

---

## 9. Playwright E2E — 6/6 ✅

| الاختبار | يغطي |
|---|---|
| تدفق طالب day-02 | login، درس، reload، جلسة جديدة |
| teacher day-03 | إجابات؛ منع طالب UI |
| day-02 labs | CardSort، WhileLoop، AlgorithmSteps، ComputerLab |
| day-03 labs (1) | LoopControl، Divisors، NumbersSteps، Collatz |
| day-03 labs (2) | MultiDimGrid، TruthTable، LogicGates |
| analytics sync | لا `[analytics-sync:login]` في console |

---

## 10. اختبار تزامن SQLite — 20 طالب / 50 عملية

`server/db/concurrency.test.js` ✅

| التحقق | النتيجة |
|---|---|
| عدم فقد عمليات | ✅ |
| عدم خلط بيانات | ✅ |
| عدم تلف DB | ✅ |
| أخطاء قفل | ✅ لا أخطاء |
| نسخة `.bak` | ✅ تُحدَّث |
| استعادة | ✅ مُختبر في `persist.test.js` |

**حدود sql.js:** كتابة متزامنة كثيفة (>50/request burst) قد تبطئ؛ **PostgreSQL إلزامي** عند >100 طالب متزامن أو SLA <200ms — راجع `docs/db-migration-plan.md`.

**Windows:** `copyFileSync` مع retry في `persistDatabase` لتجنب EPERM.

---

## 11. نتائج البناء والاختبار

| المقياس | النتيجة |
|---|---|
| Vitest | **138/138** ✅ |
| Playwright | **6/6** ✅ |
| Build | ✅ `npm run build` |

---

## 12. لقطات شاشة اليوم الثالث

E2E يتحقق من ظهور عناصر UI الحرجة. لقطات يدوية موصى بها:

- `/lessons/truth-tables` — TruthTableBuilder  
- `/lessons/logic-gates` — LogicGatesSim  
- `/lessons/numbers-steps-activity` — NumbersStepsLab  
- `/teacher/day-03-answers` — صفحة المعلم  

---

## 13. ✅ بدء اليوم الرابع

بعد تحقق شروط الانتقال، أُنشئ:

- `docs/day04-coverage.json` — **11** عنصرًا (كلها `pending`)  
- `docs/day04-coverage-status.md`  
- `scripts/generate-day04-coverage.py`  

**موضوعات Day 4 المخططة:** خريطة كarnaug، الاقترانات المنطقية، Tuples، الحلقات المتداخلة، إجابات المعلم.

---

## 14. Commits

```
55758a4 feat(batch-7): close Day 3, harden auth, expand tests
605f4b3 docs: set batch-6 report commit hash
b03ec62 feat(batch-6): server auth, IDOR tests, Day 3 labs, Playwright E2E
```

---

## 15. تأكيدات

| البند | الحالة |
|---|---|
| إغلاق اليوم الثالث 16/16 | ✅ |
| بدء اليوم الرابع (تخطيط) | ✅ |
| الدمج مع main | ❌ |
| النشر على Render | ❌ |
