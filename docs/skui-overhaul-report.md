# تقرير إصلاح وضع المشروعات الرسومية skui

**التاريخ:** 2026-07-12  
**الفرع:** `cursor/fix-skui-export-input-edf1`  
**Commit:** يُنشأ عند طلب المستخدم (التغييرات جاهزة محليًا)

## 1) سبب عدم تطابق المشروع مع الاسم والكود

- إدراج الأمثلة كان يستدعي `setCode` فقط دون تحديث `activeAppId`.
- تحميل مشروع محفوظ لم يربط `templateId`.
- إطار التعليمات اعتمد على `activeAppId` بينما الكود لمشروع آخر.

## 2) سبب فراغ المعاينة

- كود الخطوات الجزئي بدون مكونات/`app.run()` يترك `appUi` فارغًا.
- رسائل الحالة كانت ضعيفة. أُضيفت حالات: جاري البناء / نجاح / خطأ سطر / خطأ محرك.

## 3) توحيد قائمة المشروعات

سجل واحد: `src/data/skuiProjectsRegistry.js` (13 مشروعًا) مع بطاقات `SkuiProjectGallery`.

## 4) استقلالية كل مشروع

لكل مشروع: عنوان، وصف، نوع، صعوبة، مكونات، usageSteps، starterCode، tests، teacherSolutionId منفصل.

## 5) تحسينات الآلة الحاسبة

لوحة أرقام كاملة، عمليات، C/⌫، `variant="calculator-key"` و`depth="raised"`، تاريخ عمليات، رسالة قسمة على صفر، Guide، دعم لوحة المفاتيح (في حل المعلم).

## 6) الكائن الإرشادي

`ui.Guide(title, message, character, position)` — SVG أصلي، زر إخفاء، حركة خفيفة، RTL.

## 7) الأقسام المحذوفة من واجهة التنفيذ

ماذا ستتعلم، ارتباط المنهج، كيف يعمل الكود، أسئلة تفكير. بقي: الاسم، الوصف، طريقة الاستخدام، الكود، التلميحات، المعاينة، الحفظ، التشغيل، التصدير.

## 8) حساب المعلم

تبويب «الحل النموذجي» + تحميل من API + «فتح الحل الكامل في المحرر» + معاينة معلم دون حفظ كطالب ودون إجبار الخطوات.

## 9) إخفاء الحل عن الطالب

`fullSolution: null` في خطط الخطوات؛ الحلول فقط في `server/teacher/skuiSolutions.js` عبر API محمي بـ `X-User-Role: teacher`.

## 10–13) التشغيل والتصدير

- تخمين الرقم والآلة الحاسبة يعملان داخل المنصة (E2E).
- WebApp بعد ZIP يعمل على خادم ثابت محلي (E2E).
- عاد «فتح WebApp في تبويب جديد» منفصلًا عن «تنزيل WebApp ZIP».

## 14–17) PWA وWindows

- **PWA:** قيد التطوير — الزر معطّل.
- **Windows:** غير متاح حاليًا في الواجهة — الزر معطّل. مسار jobs/CI موجود لكن لم يُختبر تثبيت EXE محليًا في هذه الجولة.

## 18) قيد التطوير

PWA (تثبيت فعلي)، Windows (تثبيت/تشغيل EXE محلي)، تحقق تثبيت الجوال/التابلت.

## 19) مصفوفة QA

انظر `docs/skui-qa-matrix.md`.

## 20) نتائج الاختبارات

- Vitest: **55/55** ناجحة  
- ESLint: ناجح  
- Vite build: ناجح  
- Playwright: **11/11** ناجحة (بعد تثبيت Chromium)

## 21) Build

`npm run build` نجح.

## 22) أهم الملفات المعدّلة

- `src/data/skuiProjectsRegistry.js` (+ test)
- `src/pages/PythonLab.jsx`
- `src/components/python/{SkuiProjectGallery,GraphicProjectFrame,ProjectExportPanel,AppModeHelp,SkuiPreviewFrame,StepLearningPanel}.jsx`
- `src/lib/skui/{manifest,moduleSources}.js`
- `src/lib/{projectReadiness,webAppBundle}.js`
- `server/teacher/skuiSolutions.js` + مسار في `server/index.js`
- `e2e/skui.spec.js` + `e2e/fixtures/skuiApps.js`
- `docs/skui-qa-matrix.md`

## 23) Commit

لم يُنشأ بعد — اطلب commit عند الرغبة.

## 24) التأكيد

تم إصلاح وضع المشروعات الرسومية في مختبر بايثون، وأصبح كل مشروع مستقلًا بعنوانه وكوده وتلميحاته ومعاينته، وأصبحت واجهات skui عصرية واحترافية، وتم فصل تجربة الطالب عن المعلم، كما تم التحقق الفعلي من تشغيل المشروعات داخل المنصة وبعد تصديرها إلى WebApp وZIP، مع بيان الحالة الحقيقية لتصدير PWA وWindows دون عرض ميزات غير مكتملة.
