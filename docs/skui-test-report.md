# تقرير اختبار skui

- Vitest: اختبارات manifest، validator، الأمان، ZIP، PWA، checksums، ووظائف
  export jobs.
- Playwright: تشغيل مثال الترحيب، callback وتحديث الحالة، جميع مكونات الإصدار
  الأول، الأحداث الثمانية، autocomplete، ورسالة المكوّن غير المدعوم.
- العزل: يتحقق الاختبار من أن iframe يحمل `allow-scripts` فقط.
- Skulpt: build محلي `e3c1c1a4e081362d96ba8afc5997be516b437f30`.

آخر نتائج التنفيذ تُسجل في `docs/export-test-report.md`. لا يعد Windows ناجحًا
إلا بعد ظهور EXE وMSI والتحقق من التوقيع في GitHub Actions.
