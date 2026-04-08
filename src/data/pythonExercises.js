/**
 * تمارين بايثون — مرتبطة بالوحدات عبر unitId (اختياري) للفلترة في المختبر.
 * أضف المزيد عند مطابقة نصوص PDF الرسمي.
 */
export const pythonExercises = [
  {
    id: "intro-print",
    titleAr: "انطلاقة المقرر",
    unitId: "intro",
    grades: ["g4", "g5", "g6", "g7", "g8"],
    starter: `# أول سطر في رحلتك البرمجية
print("مرحباً بك في مقرر برمجة الحاسب!")`,
    hintAr: "غيّر النص بين علامتي التنصيص.",
  },
  {
    id: "hw-labels",
    titleAr: "مكونات الحاسب",
    unitId: "computing-basics",
    grades: ["g4", "g5", "g6", "g7", "g8"],
    starter: `# اطبع ثلاثة مكونات مادية تتذكرها
print("المعالج")
print("الذاكرة")
print("القرص")`,
    hintAr: "أضف تعليقاً يشرح دور كل مكوّن.",
  },
  {
    id: "hello",
    titleAr: "الترحيب",
    unitId: "python-basics",
    grades: ["g4", "g5", "g6", "g7", "g8"],
    starter: `# اطبع جملة ترحيب باسمك
name = "طالب مبرمج"
print("مرحباً، أنا " + name)`,
    hintAr: "جرّب تغيير النص داخل علامتي التنصيص.",
  },
  {
    id: "vars-swap",
    titleAr: "تبديل قيمتين",
    unitId: "python-basics",
    grades: ["g5", "g6", "g7", "g8"],
    starter: `a = 3
b = 7
# انقل القيم بحيث تصبح a=7 و b=3
`,
    hintAr: "استخدم متغيراً مساعداً أو الجمع والطرح بذكاء.",
  },
  {
    id: "types-cast",
    titleAr: "تحويل نص إلى رقم",
    unitId: "python-basics",
    grades: ["g5", "g6", "g7", "g8"],
    starter: `s = "42"
# حوّل s إلى عدد صحيح واطبع النتيجة + 1
n = int(s)
print(n + 1)`,
    hintAr: "استخدم int() ثم جرّب float() على رقم عشري كنص.",
  },
  {
    id: "strings-basics",
    titleAr: "سلسلة نصية",
    unitId: "binary",
    grades: ["g5", "g6", "g7", "g8"],
    starter: `t = "برمجة"
print(len(t))
print(t[0])`,
    hintAr: "في بايثون 3 قد تُعرض الحروف العربية كوحدة كاملة حسب الترميز.",
  },
  {
    id: "loop-sum",
    titleAr: "مجموع الأعداد",
    unitId: "python-control",
    grades: ["g5", "g6", "g7", "g8"],
    starter: `# احسب مجموع الأعداد من 1 إلى 10 باستخدام for
total = 0
for i in range(1, 11):
    total = total + i
print(total)`,
    hintAr: "غيّر النطاق إلى range(1, 101) لمجموع 1..100.",
  },
  {
    id: "if-grade",
    titleAr: "جملة إذا",
    unitId: "python-control",
    grades: ["g5", "g6", "g7", "g8"],
    starter: `score = 85
if score >= 50:
    print("نجحت!")
else:
    print("حاول مجدداً")`,
    hintAr: "أضف elif للدرجات بين 40 و49.",
  },
  {
    id: "while-sum",
    titleAr: "مجموع بـ while",
    unitId: "python-control",
    grades: ["g6", "g7", "g8"],
    starter: `# جمع الأعداد من 1 إلى 10 باستخدام while
i = 1
total = 0
while i <= 10:
    total += i
    i += 1
print(total)`,
    hintAr: "تأكد من تحديث i لتجنب حلقة لا نهائية.",
  },
  {
    id: "nested-loop-pattern",
    titleAr: "نمط نجوم",
    unitId: "python-control",
    grades: ["g6", "g7", "g8"],
    starter: `# اطبع مثلثاً من النجوم (سطر i فيه i نجمة)
for i in range(1, 6):
    print("*" * i)`,
    hintAr: "جرّب مدى أكبر أو مسافات بسيطة.",
  },
  {
    id: "collatz-step",
    titleAr: "خطوة كولاتز",
    unitId: "python-control",
    grades: ["g6", "g7", "g8"],
    starter: `n = 7
if n % 2 == 0:
    n = n // 2
else:
    n = 3 * n + 1
print(n)`,
    hintAr: "كرّر في حلقة while حتى تصبح n مساوية 1 (تحدٍ إضافي).",
  },
  {
    id: "algo-steps",
    titleAr: "خطوات خوارزمية",
    unitId: "algorithms",
    grades: ["g5", "g6", "g7", "g8"],
    starter: `# اطبع خطوات حساب مجموع 1..5 بشكل مرقم
for s in range(1, 6):
    print("خطوة", s)`,
    hintAr: "اربط هذا بمخطط انسيابي على الورق.",
  },
  {
    id: "trace-table",
    titleAr: "تتبع متغير",
    unitId: "algorithms",
    grades: ["g6", "g7", "g8"],
    starter: `x = 0
for i in range(3):
    x = x + i
    print("i=", i, "x=", x)`,
    hintAr: "توقع المخرجات قبل التشغيل.",
  },
  {
    id: "bin-convert-small",
    titleAr: "ثنائي صغير",
    unitId: "binary",
    grades: ["g4", "g5", "g6", "g7", "g8"],
    starter: `# 13 عشري = 1101 ثنائي — اطبع الرقم 13 ثم ناتج bin(13)
print(13)
print(bin(13))`,
    hintAr: "bin() يعيد نصاً يبدأ بـ 0b؛ للتحويل اليدوي استخدم القسمة على 2.",
  },
  {
    id: "bin-add",
    titleAr: "جمع ثنائي (فكرة)",
    unitId: "binary",
    grades: ["g7", "g8"],
    starter: `# جمع عددين صغيرين عشريين ثم اعرضهما ثنائياً
a, b = 5, 3
print(a + b, bin(a), bin(b))`,
    hintAr: "للمتقدمين: نفّذ جمعاً بمنطق بتّي بسيط على الورق أولاً.",
  },
  {
    id: "bool-expr",
    titleAr: "تعبيرات منطقية",
    unitId: "logic-digital",
    grades: ["g6", "g7", "g8"],
    starter: `print(True and False)
print(True or False)
print(not True)`,
    hintAr: "جرب مقارنات مثل 3 < 5 and 5 < 10.",
  },
  {
    id: "truth-and",
    titleAr: "جدول AND",
    unitId: "logic-digital",
    grades: ["g6", "g7", "g8"],
    starter: `for p in [False, True]:
    for q in [False, True]:
        print(p, q, p and q)`,
    hintAr: "اقرأ المخرجات كجدول حقيقة.",
  },
  {
    id: "linear-search",
    titleAr: "بحث خطي",
    unitId: "search-sort",
    grades: ["g7", "g8"],
    starter: `nums = [4, 2, 9, 1]
target = 9
for i in range(len(nums)):
    if nums[i] == target:
        print("الموضع:", i)
        break`,
    hintAr: "أضف حالة عند عدم العثور.",
  },
  {
    id: "bubble-sort-lite",
    titleAr: "مرور فقاعي واحد",
    unitId: "search-sort",
    grades: ["g7", "g8"],
    starter: `a = [3, 1, 4, 2]
for j in range(len(a) - 1):
    if a[j] > a[j + 1]:
        a[j], a[j + 1] = a[j + 1], a[j]
print(a)`,
    hintAr: "كرّر المرور عدة مرات لفرز كامل (فقاعات).",
  },
  {
    id: "list-sort",
    titleAr: "فرز بـ sorted",
    unitId: "search-sort",
    grades: ["g7", "g8"],
    starter: `nums = [5, 2, 8, 1]
print(sorted(nums))`,
    hintAr: "قارن مع .sort() لتعديل القائمة الأصلية.",
  },
  {
    id: "list-max",
    titleAr: "أكبر عنصر في قائمة",
    unitId: "oop-projects",
    grades: ["g7", "g8"],
    starter: `nums = [3, 9, 2, 15]
m = nums[0]
for x in nums:
    if x > m:
        m = x
print(m)`,
    hintAr: "بعد الفهم جرّب max(nums).",
  },
  {
    id: "list-comp-hint",
    titleAr: "قائمة مضغوطة",
    unitId: "oop-projects",
    grades: ["g8"],
    starter: `# مربعات الأعداد من 0 إلى 4
sq = [x * x for x in range(5)]
print(sq)`,
    hintAr: "أضف شرطاً if للأعداد الزوجية فقط.",
  },
  {
    id: "class-point",
    titleAr: "صف نقطة",
    unitId: "oop-projects",
    grades: ["g7", "g8"],
    starter: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(2, 3)
print(p.x, p.y)`,
    hintAr: "أضف دالة dist_from_origin تقريباً.",
  },
  {
    id: "mini-gradebook",
    titleAr: "سجل درجات بسيط",
    unitId: "oop-projects",
    grades: ["g8"],
    starter: `grades = [85, 90, 72]
print("المعدل:", sum(grades) / len(grades))`,
    hintAr: "وسّع بقائمة أسماء موازية أو قاموس.",
  },
];
