# نشر student-pilot-batch-07 على Render

## الوضع الحالي (فحص خارجي — 2026-07-05)

| البند | الملاحظة |
|---|---|
| **URL** | https://al-mubarmij-workshop.onrender.com |
| **الخدمة** | Web Service (Express + SPA) — تستيقظ من sleep |
| **Commit على `main`** | `9db4f20` (قديم — analytics fix) |
| **Commit الإصدار المطلوب** | `457c1cb` على `release/student-pilot-batch-07` |
| **Health حالي** | `GET /api/health` → `{"ok":true,"at":"…"}` (صيغة قديمة) |
| **Auth API** | `/api/auth/me` يعيد HTML SPA — يشير لنسخة قديمة/توجيه غير مكتمل |
| **Frontend bundle** | `index-BowpIY04.js` (ليست build الدفعة 7) |
| **Render CLI/API** | غير مصادق في هذه الجلسة (`render login` مطلوب) |

## خطوات النشر (Dashboard)

1. **Render Dashboard** → خدمة `al-mubarmij-workshop`
2. **Settings → Build & Deploy**
   - Branch: `release/student-pilot-batch-07`
   - Auto-Deploy: On (أو Manual Deploy → Deploy commit `457c1cb`)
3. **Settings → Environment** — أضف (بدون commit للقيم):

```
NODE_ENV=production
TEACHER_BCRYPT_HASH=<from: TEACHER_PASSWORD='…' npm run hash:teacher-password>
APP_URL=https://al-mubarmij-workshop.onrender.com
ALLOWED_ORIGINS=https://al-mubarmij-workshop.onrender.com
PLATFORM_DB_PATH=/opt/render/project/src/server/data/platform.db
CONTENT_VERSION=student-pilot-batch-07
APP_COMMIT_SHA=457c1cb
REVOKE_TEACHER_SESSIONS=1
```

4. **Settings → Disks** — Mount: `/opt/render/project/src/server/data` (1 GB)
5. **Manual Deploy** → Deploy commit `457c1cb` (أو Clear cache & deploy)
6. بعد نجاح login المعلم → احذف `REVOKE_TEACHER_SESSIONS` أو = `0`

## نشر عبر Deploy Hook (CLI)

```bash
# من Render → Service → Settings → Deploy Hook
RENDER_DEPLOY_HOOK_URL='https://api.render.com/deploy/srv-…?key=…' \
  node scripts/render-deploy-pilot.mjs
```

## نشر عبر GitHub Actions

1. أضف secret: `RENDER_DEPLOY_HOOK_URL`
2. Actions → **Deploy student pilot to Render** → Run workflow (commit: `457c1cb`)

## نسخة احتياطية قبل التحديث

```bash
npm run backup:db
# على Render Shell: cp platform.db platform-pre-pilot-YYYY-MM-DD.bak
```

## Rollback

- Deploy commit `9db4f20` (النسخة السابقة على main)
- استعادة `platform-pre-pilot-*.bak`
