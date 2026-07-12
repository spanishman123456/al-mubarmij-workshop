# تقرير اختبارات التصدير

آخر بوابات الويب — 12 يوليو 2026، revision
`8e06ecad97c4d8213ed6be3f0b257e004127e31b`:

- ESLint: ناجح.
- Vitest: 50/50 ناجحة. يغطي manifests وService Worker وmetadata وSHA-256
  وإزالة الأسرار وبنية Source/WebApp/PWA ZIP ودورة export jobs ومراجع المعاينة
  المباشرة محدودة العمر.
- Vite production build: ناجح. تحذير حجم chunk فقط، دون خطأ بناء.
- Playwright: 9/9 ناجحة. يغطي iframe المعزول، التشغيل دون قفل الخطوات،
  الكتابة العادية، الآلة الحاسبة الاحترافية، فتح WebApp مباشرة في صفحة مستقلة،
  حزمة WebApp، PWA دون اتصال، وفصل capability tokens.
- Windows Actions run `29194752367`: ناجح على `windows-latest`. أنشأ ورفع:
  - `SKUI Project_1.0.0_x64-setup.exe` — SHA-256
    `5fe9e48a81da5ecf752748d518c8eea7df9851280702c3a7c19514fcada71a09`.
  - `SKUI Project_1.0.0_x64_en-US.msi` — SHA-256
    `d32155a3a08a1bc2b1162efb0081eb997b53cf48f67f0f9bdf08f13bb32fe1e1`.
  - تحقق تنزيل artifact من الملفين مقابل `SHA256SUMS.txt`.

حالة التوقيع الدقيقة: `unsigned-educational`. أسرار
`WINDOWS_CERTIFICATE_BASE64` و`WINDOWS_CERTIFICATE_PASSWORD` غير مهيأة في
المستودع، لذلك لم يحدث توقيع Authenticode فعلي. يميز المنتج الآن صراحةً بين
البناء التعليمي غير الموقع والبناء الرسمي؛ البناء الرسمي يفشل بأمان عند غياب
الشهادة ولا يسجل نجاحًا زائفًا.

غير منفذ: smoke فعلي لتثبيت/فتح/تفاعل/إزالة المثبت على Windows، والتحقق من
توقيع رسمي موثوق. لا يعلن هذا التقرير نجاح هاتين البوابتين.
