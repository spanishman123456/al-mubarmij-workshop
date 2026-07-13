# تقرير اختبار skui

- Vitest: 50/50 ناجحة، وتشمل manifest وvalidator والأمان وZIP وPWA
  وchecksums ووظائف export jobs.
- Playwright: 9/9 ناجحة. شغلت الأمثلة التسعة المنشورة فعليًا داخل runtime،
  واختبرت التشغيل المباشر دون فتح تعليمي، والكتابة حرفًا حرفًا، ولوحة الآلة
  الحاسبة، ومعاينة WebApp المباشرة، وجميع المكونات والأحداث الثمانية.
- العزل: يتحقق الاختبار من أن iframe يحمل `allow-scripts` فقط.
- Skulpt: build محلي `e3c1c1a4e081362d96ba8afc5997be516b437f30`.
- skui: `1.0.0`.
- revision المختبر: `8e06ecad97c4d8213ed6be3f0b257e004127e31b`.

نتائج الحزم وWindows والقيود مسجلة بأمانة في `docs/export-test-report.md`.
