# تقرير اختبارات التصدير

النتائج المحلية في آخر تشغيل:

- توليد manifests وService Worker وmetadata وSHA-256 وإزالة الأسرار: مغطى بـVitest.
- Source/WebApp/PWA ZIP وبنية الملفات المحلية: مغطى بـVitest.
- تشغيل WebApp/PWA الناتج والتفاعل مع callback: ناجح في Playwright.
- تسجيل Service Worker وإعادة تحميل PWA دون اتصال: ناجح في Playwright.
- دورة export job والتوكنات والartifact والتنزيل: ناجحة في Playwright واختبارات الخادم.
- Vite build: ناجح.
- Tauri Linux check: يتطلب GTK3 غير المثبت في بيئة Linux الحالية.
- Windows EXE/MSI وAuthenticode: لا تسجل ناجحة إلا بعد workflow على
  `windows-latest`; راجع نتيجة GitHub Actions المرتبطة بالـcommit.
