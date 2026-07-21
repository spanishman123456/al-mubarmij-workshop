/** أساسيات التعلم الآلي — اليوم 11 */
export const machineLearningBasicsLesson = {
  id: "machine-learning-basics",
  titleAr: "أساسيات التعلم الآلي وقياس الأداء",
  pdfRefs: [
    { pdfPageIndex: 431, topic: "مدخل التعلم الآلي" },
    { pdfPageIndex: 432, topic: "أمثلة على التصنيف" },
    { pdfPageIndex: 433, topic: "مؤشرات الأداء" },
  ],
  vocabularyAr: [
    { term: "Training Data", def: "بيانات يستخدمها النموذج للتعلم." },
    { term: "Test Data", def: "بيانات مستقلة لقياس الأداء الحقيقي." },
    { term: "Accuracy", def: "نسبة التوقعات الصحيحة من جميع التوقعات." },
    { term: "Classification", def: "إسناد كل مثال إلى فئة محددة." },
  ],
  learningObjectives: [
    "تمييز بيانات التدريب عن الاختبار.",
    "حساب الدقة Accuracy يدويًا.",
    "تحليل نتيجة نموذج تصنيف بسيطة.",
    "تفسير لماذا لا تكفي الدقة وحدها أحيانًا.",
  ],
  whyLearn:
    "بدون قياس واضح للأداء لا يمكن الحكم على جودة أي نموذج. هذا الدرس يبني أساس التفكير النقدي قبل استخدام أدوات AI الجاهزة.",
  prerequisites: ["ai-foundations", "number-systems", "algorithms"],
  conceptSimple:
    "ندرب النموذج على بيانات أولاً، ثم نختبره على بيانات جديدة. الدقة = (TP + TN) / الإجمالي.",
  deepSections: [
    {
      id: "split-data",
      titleAr: "تقسيم البيانات",
      bodyAr:
        "إذا اختبرنا النموذج على نفس بيانات التدريب سنحصل غالبًا على نتيجة مبالغ فيها. لذلك نحتاج مجموعة اختبار منفصلة.",
    },
    {
      id: "accuracy",
      titleAr: "حساب الدقة",
      bodyAr:
        "الدقة مقياس سهل: عدد التوقعات الصحيحة مقسومًا على جميع الحالات. مثال: 14 صحيح من 20 = 70%.",
    },
    {
      id: "limits",
      titleAr: "حدود الدقة",
      bodyAr:
        "في بيانات غير متوازنة قد تكون الدقة مضللة، لذا نستخدم مقاييس إضافية (مثل precision/recall) عند الحاجة.",
    },
  ],
  stepsDetailed: [
    { titleAr: "1) جهّز البيانات", bodyAr: "نظّف الأمثلة وتحقق من التوازن." },
    { titleAr: "2) قسّم Train/Test", bodyAr: "افصل جزءًا للاختبار النهائي." },
    { titleAr: "3) درّب النموذج", bodyAr: "ابنِ العلاقة بين المدخلات والمخرجات." },
    { titleAr: "4) احسب Accuracy", bodyAr: "طبّق الصيغة بدقة." },
    { titleAr: "5) حلّل الأخطاء", bodyAr: "افهم الحالات التي فشل فيها النموذج." },
  ],
  workedExamples: [
    {
      id: "ml-ex-1",
      titleAr: "حساب Accuracy",
      difficulty: "متوسط",
      steps: ["TP=8, TN=6, FP=2, FN=4", "الصحيح = 14", "الإجمالي = 20", "الدقة = 70%"],
      result: "70%",
    },
  ],
  commonMistakes: [
    { titleAr: "اختبار على بيانات التدريب", bodyAr: "يعطي انطباعًا كاذبًا عن جودة النموذج." },
    { titleAr: "إهمال تحليل الأخطاء", bodyAr: "الرقم وحده لا يكشف سبب فشل النموذج." },
  ],
  guidedPractice: [
    { id: "g1", promptAr: "إذا كان الصحيح 9 من 12 فالدقة؟", answer: "75" },
    { id: "g2", promptAr: "هل train = test؟", answer: "لا" },
  ],
  independentPractice: [
    { id: "i1", promptAr: "TP=5, TN=3, FP=1, FN=1 — الدقة %؟", answer: "80" },
    { id: "i2", promptAr: "ما اسم مجموعة القياس النهائية؟", answer: "test", acceptedAnswers: ["test", "الاختبار"] },
  ],
  quickCheck: {
    questions: [{ id: "q1", promptAr: "هل الدقة = الصحيح/الإجمالي؟", answer: "نعم" }],
  },
  challengeAr: "صمم جدول نتائج صغير (TP,TN,FP,FN) بحيث تكون الدقة 90% ثم اشرحه.",
  summary:
    "التعلم الآلي يحتاج قياسًا موضوعيًا. Accuracy بداية جيدة، لكنها ليست نهاية التحليل.",
  linkedActivity: "/lessons/machine-learning-basics#lab",
};
