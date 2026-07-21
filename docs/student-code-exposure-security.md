# حماية الطالب من تسرّب الحل الكامل

## المبدأ

الحل الكامل **لا يُرسَل إطلاقًا** إلى متصفّح الطالب ثم يُخفى عبر CSS/JS. بل تُتخذ
الحماية على **الخادم**: يقرّر الخادم ما المسموح إرساله بناءً على المستوى الفعّال.

## نقطة الحماية المركزية

الدالة `buildAllowedContent(mode, resourceId, ctx)` في
[`server/services/codeVisibilityService.js`](../server/services/codeVisibilityService.js):

- لا تُرجع `fullSolution` إلا إذا كان المستوى **8** (فوري)، أو **7** (بعد المحاولة)
  مع تحقّق شرط المحاولات/الخطوات (`MIN_ATTEMPTS_FOR_FULL`).
- في المستويات 1–6 تكون `fullSolution = null` دائمًا.
- في المستوى 1 تُحجب أيضًا التلميحات والكود الابتدائي ووصف المهمة.

## المسار المخصّص للطالب

`GET /api/lab/:resourceId/allowed-content`:

- يتطلّب مصادقة (`requireAuth`) — طلب بلا جلسة يُرفض بـ 401.
- **الدور يُؤخذ من الجلسة** (`req.auth.role`) وليس من رأس `X-User-Role`، لذا لا يمكن
  للطالب انتحال دور المعلم لتجاوز التقييد.
- الحل الكامل لا يُرسَل للمعلم عبر هذا المسار (يستخدم المعلم مساره المخصّص
  `/api/teacher/skui-projects/:id/solution`).

## مصدر الحل على الخادم فقط

- مشاريع skui/الرسومية: [`server/teacher/skuiSolutions.js`](../server/teacher/skuiSolutions.js)
  (لا يُستورد في حزمة الطالب).
- تمارين الـ console: `fullSolution` من خطة التعلّم، ولا يُرسَل إلا وفق المستوى.

## عند الفشل

إذا تعذّر تحميل السياسة، يسقط النظام إلى المستوى الاحتياطي **1 (إخفاء الحل)** بدل
كشفه — الافتراض الآمن.

## اختبارات التحقق

- وحدة: `server/services/codeVisibilityService.test.js` (لا تسريب دون 7/8، رفض انتحال الدور).
- تكامل: `server/codeVisibility.integration.test.js` (401 بلا جلسة، 403 للطالب على مسارات المعلم،
  `fullSolution=null` في المستويات المخفية).
- E2E: `e2e/code-visibility.spec.js` (فحص استجابة الشبكة تأكيدًا لعدم وصول الحل).
