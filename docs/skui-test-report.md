# تقرير اختبار skui

- Vitest: 48/48 ناجحة، وتشمل manifest وvalidator والأمان وZIP وPWA
  وchecksums ووظائف export jobs.
- Playwright: 7/7 ناجحة. شغلت الأمثلة التسعة المنشورة فعليًا داخل runtime،
  واختبرت تحديث الحالة، جميع المكونات المعلنة، الأحداث الثمانية، autocomplete،
  ورسالة المكوّن غير المدعوم.
- العزل: يتحقق الاختبار من أن iframe يحمل `allow-scripts` فقط.
- Skulpt: build محلي `e3c1c1a4e081362d96ba8afc5997be516b437f30`.
- skui: `1.0.0`.
- revision المختبر: `1e867c92d2d2944fcdb5b28b0110e85d961fdbbf`.

نتائج الحزم وWindows والقيود مسجلة بأمانة في `docs/export-test-report.md`.
