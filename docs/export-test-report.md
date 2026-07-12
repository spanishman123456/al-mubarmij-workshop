# تقرير اختبارات التصدير

آخر بوابات الإصدار — 12 يوليو 2026، revision
`1e867c92d2d2944fcdb5b28b0110e85d961fdbbf`:

- ESLint: ناجح.
- Vitest: 48/48 ناجحة. يغطي manifests وService Worker وmetadata وSHA-256
  وإزالة الأسرار وبنية Source/WebApp/PWA ZIP ودورة export jobs.
- Vite production build: ناجح. تحذير حجم chunk فقط، دون خطأ بناء.
- Playwright: 7/7 ناجحة. يغطي iframe المعزول، المكونات والأحداث، جميع الأمثلة
  المنشورة، WebApp، PWA دون اتصال، وفصل capability tokens.
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
