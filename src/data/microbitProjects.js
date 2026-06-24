/**
 * مشاريع micro:bit المرتبطة بمنهج «برمجة الحاسب» — موهبة
 * كل مشروع مربوط بموضوع علمي ويوم/أيام دراسية من المسار الـ15
 */

export const MICROBIT_CATEGORIES = [
  { id: "all", label: "جميع المشاريع", icon: "📚" },
  { id: "number-systems", label: "أنظمة العد", icon: "🔢" },
  { id: "python", label: "Python والخوارزميات", icon: "🐍" },
  { id: "search-sort", label: "البحث والفرز", icon: "🔍" },
  { id: "cipher", label: "التشفير", icon: "🔐" },
  { id: "logic", label: "المنطق الرقمي", icon: "⚡" },
  { id: "sequences", label: "فيبوناتشي وبرج هانوي", icon: "🌀" },
];

export const MICROBIT_PROJECTS = [
  {
    id: "guess-number",
    title: "لعبة تخمين الرقم باستخدام micro:bit",
    category: "python",
    curriculumTopic: "Python — المتغيرات، الشروط (if)، التكرار (while)، الخوارزميات",
    relatedDays: [
      { dayId: "day-02", label: "اليوم 2 — الخوارزميات وجمل التحكم" },
      { dayId: "day-03", label: "اليوم 3 — المنطق والبوابات" },
    ],
    relatedLinks: [
      { to: "/python", label: "مختبر بايثون" },
      { to: "/simulations#truth", label: "محاكاة المنطق" },
    ],
    objective:
      "تطبيق التفكير الشرطي والخوارزمية لحل مسألة تخمين رقم باستخدام الأزرار وشاشة LED.",
    idea: "يختار micro:bit رقمًا سريًا. يزيد الطالب تخمينه بزر A ويؤكد بزر B. تعرض الشاشة H (أعلى) أو L (أقل) أو ✓ (صحيح).",
    tools: ["لوحة micro:bit", "كابل USB", "Mu Editor أو Thonny", "معرفة if/while من بايثون"],
    steps: [
      "راجع درس الخوارزميات والشروط في اليوم الثاني.",
      "أنشئ متغيرات: secret للرقم السري، guess للتخمين، attempts للمحاولات.",
      "استخدم random.randint لاختيار الرقم السري عند التشغيل.",
      "في حلقة while: زر A يزيد التخمين، زر B يقارن ويعرض H/L/✓.",
      "حمّل الكود على micro:bit واختبره عمليًا.",
      "سجّل كودك في المنصة واجب على أسئلة «اختبر فهمك».",
    ],
    code: `from microbit import *
import random

secret = random.randint(1, 9)
guess = 5
attempts = 0

display.show(str(guess))

while True:
    if button_a.was_pressed():
        guess = guess + 1 if guess < 9 else 1
        display.show(str(guess))
    if button_b.was_pressed():
        attempts += 1
        if guess == secret:
            display.show(Image.HAPPY)
            break
        elif guess < secret:
            display.show("H")  # Higher — حاول رقمًا أكبر
        else:
            display.show("L")  # Lower — حاول رقمًا أصغر
        sleep(600)
        display.show(str(guess))`,
    codeExplanation: [
      "random.randint يولّد الرقم السري — مثل اختيار عشوائي في خوارزمية.",
      "while True حلقة لا نهائية تنتظر أحداث الأزرار — مثل حلقة في برنامج بايثون.",
      "if / elif / else تطبّق التفكير الشرطي: قارن التخمين بالسرّ.",
      "attempts متغير يُحدَّث عند كل محاولة — تتبع للخوارزمية.",
    ],
    test: "اضغط A لتغيير التخمين و B للتأكيد. تأكد أن H/L/الوجه الصحيح يظهر في الوقت المناسب.",
    reflectionQuestions: [
      "ما الخطوات الخوارزمية لحل لعبة التخمين؟ اكتبها قبل الكود.",
      "كيف يختلف استخدام if عن while في هذا المشروع؟",
      "كيف يمكن تحديد عدد المحاولات الأقصى؟",
    ],
    extend: "أضف حدًا أقصى للمحاولات، واهتزازًا عند الفوز، وعرض عدد المحاولات على الشاشة.",
    quiz: [
      {
        q: "ماذا يعني عرض H على الشاشة؟",
        options: ["التخمين صحيح", "الرقم السري أكبر — جرّب رقمًا أكبر", "انتهت المحاولات"],
        answer: 1,
      },
      {
        q: "أي مفهوم بايثون نستخدم لانتظار ضغط الزر باستمرار؟",
        options: ["for فقط", "while", "def"],
        answer: 1,
      },
    ],
  },
  {
    id: "number-systems",
    title: "برنامج تحويل أنظمة العد",
    category: "number-systems",
    curriculumTopic: "النظام العشري، الثنائي، الست عشري — تمثيل البيانات",
    relatedDays: [{ dayId: "day-01", label: "اليوم 1 — النظام الثنائي وبداية بايثون" }],
    relatedLinks: [
      { to: "/simulations#number-converter", label: "محوّل الأنظمة" },
      { to: "/path/day/day-01", label: "درس اليوم الأول" },
    ],
    objective: "ربط التحويل بين أنظمة العد بعرض النتائج على شاشة LED عمليًا.",
    idea: "يختار الطالب رقمًا عشريًا (1–15) بزر A. يعرض micro:bit النسخة الثنائية كأصفار وواحدات على صف LED أو كنص متحرك.",
    tools: ["micro:bit", "Mu Editor", "محاكاة التحويل في المنصة أولًا"],
    steps: [
      "حوّل الأعداد 5 و 10 و 15 يدويًا في محاكاة المنصة.",
      "اكتب دالة bin(n) في بايثون لتحويل عشري → ثنائي.",
      "زر A يزيد الرقم العشري، زر B يعرض التمثيل الثنائي scroll.",
      "اختبر مع أرقام من درس اليوم الأول.",
    ],
    code: `from microbit import *

def to_binary(n):
    if n == 0:
        return "0"
    bits = ""
    while n > 0:
        bits = str(n % 2) + bits
        n //= 2
    return bits

decimal = 5

while True:
    if button_a.was_pressed():
        decimal = decimal + 1 if decimal < 15 else 0
        display.show(str(decimal))
    if button_b.was_pressed():
        display.scroll(to_binary(decimal))
    sleep(100)`,
    codeExplanation: [
      "to_binary تستخدم القسمة على 2 — نفس خطوات التحويل في المنهج.",
      "decimal متغير يمثل القيمة العشرية المختارة.",
      "display.scroll يعرض سلسلة البتات كنص على LED.",
    ],
    test: "اختر 5 واضغط B — يجب أن يظهر 101. جرّب 10 → 1010.",
    reflectionQuestions: [
      "لماذا نستخدم باقي القسمة على 2 في التحويل؟",
      "ما الفرق بين عرض الرقم كنص وتمثيله ببكسلات LED؟",
      "كيف تحوّل ثنائيًا إلى عشري في الكود؟",
    ],
    extend: "أضف تحويلًا ست عشريًا واعرض النتيجة بالتناوب.",
    quiz: [
      {
        q: "التمثيل الثنائي للعدد العشري 7 هو:",
        options: ["111", "101", "110"],
        answer: 0,
      },
    ],
  },
  {
    id: "cipher-message",
    title: "مشروع تشفير وفك تشفير رسالة",
    category: "cipher",
    curriculumTopic: "تشفير Caesar Cipher — النصوص، المتغيرات، الحلقات",
    relatedDays: [{ dayId: "day-07", label: "اليوم 7 — التشفير والأمان" }],
    relatedLinks: [{ to: "/simulations#caesar", label: "محاكاة تشفير قيصر" }],
    objective: "فهم التشفير عمليًا عبر تشفير رسالة وعرضها على micro:bit.",
    idea: "تشفّر رسالة قصيرة بإزاحة (Shift) وتعرضها حرفًا حرفًا على شاشة LED.",
    tools: ["micro:bit", "ورقة عمل التشفير من المنهج", "Mu Editor"],
    steps: [
      "جرّب التشفير في محاكاة Caesar بالمنصة.",
      "اكتب دالة caesar(text, shift) في MicroPython.",
      "اختر رسالة مثل MOHIBA وإزاحة 3.",
      "اعرض الرسالة المشفرة بالتمرير على LED.",
    ],
    code: `def caesar(text, shift):
    out = ""
    for c in text:
        if "A" <= c <= "Z":
            out += chr((ord(c) - 65 + shift) % 26 + 65)
        else:
            out += c
    return out

from microbit import *

plain = "CODE"
shift = 3
cipher = caesar(plain, shift)

while True:
    if button_a.was_pressed():
        display.scroll(cipher)
    if button_b.was_pressed():
        display.scroll(plain)`,
    codeExplanation: [
      "ord و chr لتحويل الحروف لأرقام والعكس — مثل ASCII في اليوم الأول.",
      "for c in text حلقة على كل حرف — مفهوم من بايثون.",
      "% 26 يبقي الحرف ضمن الأبجدية الإنجليزية.",
    ],
    test: "CODE بإزاحة 3 تعطي FRGH. تحقق على الشاشة.",
    reflectionQuestions: [
      "لماذا يُسمّى هذا التشفير بشيفرة قيصر؟",
      "كيف تفك التشفير بدون معرفة الإزاحة؟",
      "ما قصور هذا النوع من التشفير؟",
    ],
    extend: "أضف زرًا لتغيير الإزاحة وعرض الرسالة الأصلية والمشفرة بالتناوب.",
    quiz: [
      {
        q: "بإزاحة 1، الحرف A يصبح:",
        options: ["B", "Z", "C"],
        answer: 0,
      },
    ],
  },
  {
    id: "search-sort",
    title: "برنامج بحث وفرز على micro:bit",
    category: "search-sort",
    curriculumTopic: "Linear Search، Binary Search، Bubble Sort، Selection Sort",
    relatedDays: [{ dayId: "day-05", label: "اليوم 5 — البحث والفرز" }],
    relatedLinks: [{ to: "/simulations#search", label: "محاكاة البحث والفرز" }],
    objective: "رؤية خطوات البحث الخطي عمليًا عبر LED والمقارنات.",
    idea: "قائمة أرقام ثابتة في الكود. زر A ينفّذ خطوة بحث ويعرض الرقم المفحوص. زر B يعرض إن وُجد الهدف.",
    tools: ["micro:bit", "محاكاة البحث بالمنصة", "Mu Editor"],
    steps: [
      "شغّل Linear Search في محاكاة المنصة وافهم الخطوات.",
      "خزّن القائمة والهدف في متغيرات.",
      "كل ضغطة A تنتقل لعنصر تالي وتعرضه.",
      "عند العثور على الهدف اعرض ✓.",
    ],
    code: `from microbit import *

data = [3, 7, 2, 9, 5]
target = 9
index = 0
found = False

while True:
    if button_a.was_pressed() and not found:
        if index < len(data):
            display.show(str(data[index]))
            if data[index] == target:
                found = True
                sleep(400)
                display.show(Image.YES)
            index += 1
        else:
            display.show(Image.NO)
    sleep(80)`,
    codeExplanation: [
      "data قائمة — بنية بيانات من درس البحث والفرز.",
      "index مؤشر يتقدم خطوة بخطوة — جوهر البحث الخطي.",
      "المقارنة data[index] == target هي عملية البحث.",
    ],
    test: "اضغط A حتى تجد 9. يجب أن يظهر ✓ عند العثور.",
    reflectionQuestions: [
      "كم مقارنة احتجت للوصول إلى 9؟",
      "متى يكون البحث الثنائي أفضل من الخطي؟",
      "كيف تعرض خطوات الفرز الفقاعي على LED؟",
    ],
    extend: "نفّذ Bubble Sort خطوة بخطوة مع عرض القائمة بعد كل تبادل.",
    quiz: [
      {
        q: "البحث الخطي يفحص العناصر:",
        options: ["عشوائيًا", "واحدًا تلو الآخر", "بقسمة القائمة نصفين"],
        answer: 1,
      },
    ],
  },
  {
    id: "step-counter",
    title: "عداد خطوات / عداد نقاط",
    category: "python",
    curriculumTopic: "المتغيرات، التكرار، الشروط، الأحداث (Events)",
    relatedDays: [
      { dayId: "day-01", label: "اليوم 1 — المتغيرات" },
      { dayId: "day-02", label: "اليوم 2 — التكرار والأحداث" },
    ],
    relatedLinks: [{ to: "/python", label: "مختبر بايثون" }],
    objective: "تطبيق تحديث المتغيرات استجابة لأحداث الحساس أو الأزرار.",
    idea: "هزّ الجهاز أو اضغط A لزيادة العداد. اعرض القيمة على LED. B يصفّر العداد.",
    tools: ["micro:bit مع حساس حركة", "Mu Editor"],
    steps: [
      "عرّف متغير count = 0.",
      "اربط زيادة العداد بحدث shake أو button_a.",
      "اعرض القيمة باستمرار أو عند التغيير.",
      "أضف حدًا أقصى ورسالة عند الوصول له.",
    ],
    code: `from microbit import *

count = 0
MAX = 20

while True:
    if accelerometer.was_gesture("shake") or button_a.was_pressed():
        if count < MAX:
            count += 1
        else:
            display.show("!")
    if button_b.was_pressed():
        count = 0
    display.show(str(count) if count < 10 else str(count)[:2])
    sleep(80)`,
    codeExplanation: [
      "count متغير يتغير مع الأحداث — أساس البرمجة التفاعلية.",
      "if count < MAX شرط يمنع تجاوز الحد.",
      "was_gesture و was_pressed أحداث من مكتبة micro:bit.",
    ],
    test: "هز الجهاز وتأكد من زيادة العداد. صفّره بـ B.",
    reflectionQuestions: [
      "ما الفرق بين الحدث والحلقة في هذا البرنامج؟",
      "كيف تسجّل أعلى قيمة وصلت إليها؟",
    ],
    extend: "احفظ أفضل رقم في متغير best واعرضه عند الضغط المطول.",
    quiz: [
      {
        q: "لإعادة العداد إلى صفر نستخدم زر:",
        options: ["A", "B"],
        answer: 1,
      },
    ],
  },
  {
    id: "logic-gate",
    title: "بوابة منطقية باستخدام micro:bit",
    category: "logic",
    curriculumTopic: "جداول الحقيقة — AND / OR / NOT — المنطق الرقمي",
    relatedDays: [{ dayId: "day-03", label: "اليوم 3 — جداول الحقيقة والبوابات" }],
    relatedLinks: [
      { to: "/simulations#gates", label: "محاكاة البوابات" },
      { to: "/simulations#circuit", label: "بناء الدوائر" },
    ],
    objective: "ربط جدول الحقيقة بمدخلات رقمية حقيقية (أزرار) ومخرج LED.",
    idea: "زر A و B يمثلان 0/1. يعرض LED ناتج بوابة AND (يمكن تغييرها في الكود).",
    tools: ["micro:bit", "جدول حقيقة من الدرس", "Mu Editor"],
    steps: [
      "أكمل جدول AND في المنصة.",
      "اقرأ حالة الزرين كقيم منطقية.",
      "طبّق AND/OR/NOT في دالة Python.",
      "أضئ LED أو اعرض 1/0 حسب الناتج.",
    ],
    code: `from microbit import *

def AND(a, b):
    return a and b

while True:
    a = button_a.is_pressed()
    b = button_b.is_pressed()
    out = AND(a, b)
    if out:
        display.show(Image.HAPPY)
    else:
        display.show("0")
    sleep(50)`,
    codeExplanation: [
      "is_pressed يعيد True/False — يمثل 1 و 0 في المنطق.",
      "and عملية منطقية مباشرة من بايثون = بوابة AND.",
      "يمكن استبدالها بـ OR أو NOT لتجربة بوابات أخرى.",
    ],
    test: "جدول الحقيقة لـ AND: يضيء فقط عند ضغط الزرين معًا.",
    reflectionQuestions: [
      "اكتب جدول الحقيقة لحالتك من الزرين والمخرج.",
      "كيف تمثّل بوابة NOT بزر واحد؟",
    ],
    extend: "أضف تبديل نوع البوابة بزرين معًا لمدة طويلة.",
    quiz: [
      {
        q: "ناتج AND عندما A=1 و B=0 هو:",
        options: ["1", "0"],
        answer: 1,
      },
    ],
  },
  {
    id: "truth-table-sim",
    title: "محاكاة جدول حقيقة تفاعلي",
    category: "logic",
    curriculumTopic: "جداول الحقيقة — تعبيرات منطقية مركبة",
    relatedDays: [
      { dayId: "day-03", label: "اليوم 3 — جداول الحقيقة" },
      { dayId: "day-04", label: "اليوم 4 — كارنوف" },
    ],
    relatedLinks: [{ to: "/simulations#truth-drills", label: "تدريبات جداول الحقيقة" }],
    objective: "تحويل جدول الحقيقة من ورقة نظرية إلى تجربة عملية بالأزرار.",
    idea: "تغيير A و B بالأزرار وعرض ناتج تعبير مثل (A AND B) OR NOT A على الشاشة.",
    tools: ["micro:bit", "تدريبات الحقيقة بالمنصة"],
    steps: [
      "أكمل تعبيرًا منطقيًا في تدريبات المنصة.",
      "برمج التعبير نفسه في MicroPython.",
      "اعرض 1 أو 0 على LED لكل تركيبة مدخلات.",
      "قارن النتائج بجدولك الورقي.",
    ],
    code: `from microbit import *

def expr(a, b):
  return (a and b) or (not a)

while True:
    a = button_a.is_pressed()
    b = button_b.is_pressed()
    y = expr(a, b)
    display.show("1" if y else "0")
    sleep(60)`,
    codeExplanation: [
      "expr تمثل التعبير المنطقي من المنهج.",
      "كل تركيبة أزرار = صف في جدول الحقيقة.",
      "العرض الفوري يربط النظرية بالتطبيق.",
    ],
    test: "اختبر الصفوف الأربعة لجدول الحقيقة وقارن بالمنصة.",
    reflectionQuestions: [
      "هل يمكن تبسيط التعبير بكارنوف؟ كيف؟",
      "ما الفرق بين العرض النظري والتجربة العملية؟",
    ],
    extend: "اعرض رقم الصف في الجدول (1–4) قبل الناتج.",
    quiz: [
      {
        q: "جدول الحقيقة لمدخلين يحتوي على:",
        options: ["صفين", "أربعة صفوف", "ثمانية صفوف"],
        answer: 1,
      },
    ],
  },
  {
    id: "fibonacci-microbit",
    title: "متتالية فيبوناتشي على micro:bit",
    category: "sequences",
    curriculumTopic: "المتتاليات، الخوارزميات، التكرار، Recursion",
    relatedDays: [{ dayId: "day-09", label: "اليوم 9 — التكرار والتعقيد" }],
    relatedLinks: [{ to: "/simulations#fibonacci", label: "محاكاة فيبوناتشي" }],
    objective: "توليد متتالية فيبوناتشي خطوة بخطوة وعرض كل حد على LED.",
    idea: "زر A يولّد الحد التالي ويعرضه. يبدأ بـ 0, 1, 1, 2, 3...",
    tools: ["micro:bit", "محاكاة فيبوناتشي", "Mu Editor"],
    steps: [
      "راجع F(n)=F(n-1)+F(n-2) في المحاكاة.",
      "خزّن الحدين السابقين في متغيرات.",
      "كل ضغطة تحسب الحد التالي وتعرضه.",
    ],
    code: `from microbit import *

a, b = 0, 1

display.show(str(a))

while True:
    if button_a.was_pressed():
        nxt = a + b
        a, b = b, nxt
        display.show(str(nxt))
        sleep(300)`,
    codeExplanation: [
      "a و b يمثلان الحدين السابقين — نفس فكرة المحاكاة.",
      "nxt = a + b معادلة فيبوناتشي.",
      "تحديث a, b = b, nxt يجهّز الحد التالي.",
    ],
    test: "اضغط A عدة مرات: 0,1,1,2,3,5,8...",
    reflectionQuestions: [
      "ما الفرق بين الحل التكراري والتكراري بذاكرة متغيرين؟",
      "لماذا تنمو الأرقام سريعًا على LED؟",
    ],
    extend: "أضف حدًا أقصى وعرض تنبيه عند تجاوز 99.",
    quiz: [
      {
        q: "الحد التالي بعد 3 و 5 في فيبوناتشي هو:",
        options: ["7", "8", "9"],
        answer: 1,
      },
    ],
  },
  {
    id: "hanoi-microbit",
    title: "برج هانوي — عرض خطوات الخوارزمية",
    category: "sequences",
    curriculumTopic: "برج هانوي — التفكير الخوارزمي، Recursion",
    relatedDays: [{ dayId: "day-10", label: "اليوم 10 — التعقيد والخوارزميات" }],
    relatedLinks: [{ to: "/simulations#hanoi", label: "محاكاة برج هانوي" }],
    objective: "ربط محاكاة برج هانوي بعرض رقم الخطوة واتجاه النقل على micro:bit.",
    idea: "الموقع يولّد خطوات الحل. micro:bit يعرض رقم الخطوة (زر A للتالي) واتجاه النقل A→B كنص قصير.",
    tools: ["micro:bit", "محاكاة هانوي بالمنصة", "قائمة خطوات مسبقة الحساب"],
    steps: [
      "شغّل محاكاة هانوي لثلاثة أقراص وافهم الخطوات.",
      "خزّن الخطوات في قائمة نصوص مثل '1->3'.",
      "زر A يعرض الخطوة التالية.",
      "سجّل عدد النقلات وقارن بـ 2^n-1.",
    ],
    code: `from microbit import *

moves = ["1>2", "1>3", "2>3", "1>2", "3>1", "3>2", "1>2"]
step = 0

while True:
    if button_a.was_pressed() and step < len(moves):
        display.scroll(moves[step])
        step += 1
    if button_b.was_pressed():
        step = 0
        display.show("0")`,
    codeExplanation: [
      "moves قائمة بخطوات الحل — مثل مخرجات الخوارزمية.",
      "step مؤشر الخطوة الحالية.",
      "display.scroll يعرض اتجاه النقل على LED.",
    ],
    test: "لثلاثة أقراص يجب 7 نقلات. تأكد من الترتيب مع المحاكاة.",
    reflectionQuestions: [
      "لماذا عدد النقلات = 2^n - 1؟",
      "ما قاعدة عدم وضع قرص كبير فوق صغير؟",
    ],
    extend: "ولّد moves تلقائيًا بدالة recursive في بايثون على الحاسب ثم انقلها.",
    quiz: [
      {
        q: "عدد النقلات لـ 3 أقراص هو:",
        options: ["5", "7", "9"],
        answer: 1,
      },
    ],
  },
];

export function getProjectsByCategory(categoryId) {
  if (!categoryId || categoryId === "all") return MICROBIT_PROJECTS;
  return MICROBIT_PROJECTS.filter((p) => p.category === categoryId);
}

export function getMicrobitProject(id) {
  return MICROBIT_PROJECTS.find((p) => p.id === id) ?? null;
}
