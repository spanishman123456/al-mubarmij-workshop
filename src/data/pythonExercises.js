/** تمارين بايثون متدرجة — قابلة للتوسيع لاحقاً من صفحات PDF التفصيلية */
export const pythonExercises = [
  {
    id: "hello",
    titleAr: "الترحيب",
    grades: ["g4", "g5", "g6", "g7", "g8"],
    starter: `# اطبع جملة ترحيب باسمك
name = "طالب مبرمج"
print("مرحباً، أنا " + name)`,
    hintAr: "جرّب تغيير النص داخل علامتي التنصيص.",
  },
  {
    id: "loop-sum",
    titleAr: "مجموع الأعداد",
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
    grades: ["g5", "g6", "g7", "g8"],
    starter: `score = 85
if score >= 50:
    print("نجحت!")
else:
    print("حاول مجدداً")`,
    hintAr: "أضف حالة elif للدرجات بين 40 و49.",
  },
  {
    id: "collatz-step",
    titleAr: "خطوة من تسلسل كولاتز",
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
    id: "list-max",
    titleAr: "أكبر عنصر في قائمة",
    grades: ["g7", "g8"],
    starter: `nums = [3, 9, 2, 15]
m = nums[0]
for x in nums:
    if x > m:
        m = x
print(m)`,
    hintAr: "قارن مع استخدام الدالة الجاهزة max(nums) بعد أن تفهم الحلقة.",
  },
];
