# دليل PWA

حزمة PWA تضيف `manifest.webmanifest`, `service-worker.js`, `offline.html`
وأيقونات 192 و512. افتحها أول مرة عبر HTTPS أو localhost، ثم استخدم خيار تثبيت
التطبيق في المتصفح.

يخزن Service Worker كود المشروع وSkulpt وskui والأصول، ويحذف caches ذات الإصدارات
القديمة عند التفعيل. اختبارات Playwright تشغّل الحزمة ثم تعيد تحميلها دون اتصال.
