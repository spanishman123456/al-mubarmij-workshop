# سياسة المصادقة والأمان

## Cookies (الإنتاج)

| Cookie | HttpOnly | Secure | SameSite | Max-Age |
|---|---|---|---|---|
| `platform_session` | ✅ | ✅ (prod) | Lax | 8h |
| `platform_csrf` | ❌ | ✅ (prod) | Lax | 8h |

**SameSite=Lax:** مناسب لـ SPA على نفس النطاق مع API. `Strict` يعطل بعض التنقلات؛ `None` يتطلب HTTPS وthird-party.

## تخزين كلمات المرور

| الدور | الآلية | ملاحظة |
|---|---|---|
| المعلم | **bcrypt** (cost 10) | لا SHA-256 مباشر |
| الطالب | رقم الهوية فقط | ⚠️ **خطر قبل الإنتاج** — يُنصح بOTP أو رمز فصل أو SSO موهبة |

## ما لا يُخزَّن

- كلمات المرور في `auth_access_log` أو `auth_login_failures`
- Session tokens كاملة في السجلات
- Cookies أو أجسام الطلبات

## CSRF

- Token مرتبط بالجلسة + cookie `platform_csrf` (double-submit)
- رأس `X-CSRF-Token` مطلوب لـ POST/PUT/PATCH/DELETE على `/api/*` (عدا login)
- التحقق من `Origin` للطلبات المعدّلة

## Session Fixation

- حذف الجلسة القديمة عند login ناجح
- إصدار token جديد دائماً

## Rate Limiting

- 5 محاولات / 15 دقيقة → قفل تدريجي
- رسالة موحّدة: «بيانات الدخول غير صحيحة»

## احتفاظ السجلات

- `auth_access_log`: 30 يومًا (`purgeOldAccessLogs`)
- `auth_login_failures`: 30 يومًا
