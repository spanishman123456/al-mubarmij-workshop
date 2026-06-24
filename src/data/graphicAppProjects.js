/**
 * قوالب مشاريع رسومية — مرتبطة بمنهج برمجة الحاسب
 */

export const GRAPHIC_APP_PROJECTS = [
  {
    id: "app-guess-number",
    exportSlug: "number-guessing-game",
    titleAr: "لعبة تخمين الرقم",
    curriculumTopic: "Python — المتغيرات، الشروط if، الخوارزميات",
    dayId: "day-02",
    edu: {
      subtitle: "حاول تخمين الرقم السري بين 1 و 20",
      description: "لعبة تفاعلية تساعدك على تطبيق الشروط if/else والمتغيرات لبناء خوارزمية تخمين.",
      usageSteps: [
        "اختر رقمًا بين 1 و 20 في حقل «اكتب تخمينك هنا».",
        "اضغط «تحقق من التخمين».",
        "اقرأ الرسالة: هل الرقم أكبر أم أصغر أم صحيح؟",
        "تابع المحاولات حتى تفوز أو تنتهي المحاولات السبع.",
        "اضغط «محاولة جديدة» لبدء لعبة جديدة.",
      ],
      learningObjectives: [
        "استخدام المتغيرات لتخزين الرقم السري والتخمين وعدد المحاولات.",
        "استخدام if / elif / else للمقارنة واتخاذ القرار.",
        "استخدام random لاختيار رقم عشوائي.",
        "بناء خوارزمية بسيطة للتخمين التدريجي.",
        "التحقق من صحة المدخلات (نطاق الأرقام).",
      ],
      curriculumLink:
        "مرتبطة بيوم 2 في المسار: المتغيرات، الشروط، والتفكير الخوارزمي في برمجة الحاسب.",
      codeHowItWorks: [
        "secret يحفظ الرقم السري عشوائيًا.",
        "attempts يعدّ محاولاتك.",
        "on_check تقارن التخمين بالسرّ وتُحدّث الرسالة.",
        "playing يمنع الاستمرار بعد الفوز أو انتهاء المحاولات.",
        "new_game تعيد ضبط اللعبة بالكامل.",
      ],
      reflectionQuestions: [
        "كيف يمكن تقليل عدد المحاولات باستخدام «التخمين الثنائي»؟",
        "أي جزء من الكود يقرر إن كان التخمين صحيحًا؟",
        "ماذا يحدث إذا أدخلت حروفًا بدل أرقام؟",
        "كيف تضيف مستوى صعوبة (نطاق أكبر)؟",
      ],
    },
    starter: `import appkit
import random

MAX_ATTEMPTS = 7
secret = [random.randint(1, 20)]
attempts = [0]
playing = [True]

def new_game():
    secret[0] = random.randint(1, 20)
    attempts[0] = 0
    playing[0] = True
    appkit.set("msg", "اختر رقمًا بين 1 و 20 ثم اضغط «تحقق من التخمين».")
    appkit.set("attempts", "عدد المحاولات: 0 من " + str(MAX_ATTEMPTS))

appkit.title("لعبة تخمين الرقم")
appkit.text("حاول تخمين الرقم السري بين 1 و 20")
appkit.number_input("guess", "اكتب تخمينك هنا", "10", "مثال: 10")
appkit.output("attempts", "عداد المحاولات")
appkit.output("msg", "النتيجة")
appkit.button("check", "تحقق من التخمين")
appkit.button("new", "محاولة جديدة / إعادة اللعب")

def on_check():
    if not playing[0]:
        appkit.set("msg", "انتهت اللعبة — اضغط «محاولة جديدة» للبدء من جديد.")
        return
    raw = appkit.get("guess").strip()
    if raw == "":
        appkit.set("msg", "الرجاء إدخال رقم بين 1 و 20.")
        return
    try:
        g = int(raw)
    except:
        appkit.set("msg", "الرجاء إدخال رقم صحيح.")
        return
    if g < 1 or g > 20:
        appkit.set("msg", "الرجاء إدخال رقم بين 1 و 20.")
        return
    attempts[0] += 1
    appkit.set("attempts", "عدد المحاولات: " + str(attempts[0]) + " من " + str(MAX_ATTEMPTS))
    if g == secret[0]:
        playing[0] = False
        appkit.set("msg", "رائع! لقد خمنت الرقم الصحيح (" + str(secret[0]) + ") في " + str(attempts[0]) + " محاولة.")
    elif attempts[0] >= MAX_ATTEMPTS:
        playing[0] = False
        appkit.set("msg", "انتهت المحاولات. الرقم الصحيح كان: " + str(secret[0]))
    elif g < secret[0]:
        appkit.set("msg", "الرقم أكبر من تخمينك — جرّب رقمًا أعلى.")
    else:
        appkit.set("msg", "الرقم أصغر من تخمينك — جرّب رقمًا أقل.")

def on_new():
    new_game()

appkit.on_click("check", on_check)
appkit.on_click("new", on_new)
new_game()
appkit.build()`,
  },
  {
    id: "app-number-convert",
    exportSlug: "base-converter",
    titleAr: "أداة تحويل أنظمة العد",
    curriculumTopic: "الثنائي، العشري، الست عشري",
    dayId: "day-01",
    edu: {
      subtitle: "حوّل العدد العشري إلى تمثيل ثنائي",
      description: "أداة تطبيقية لفهم كيف يُمثَّل العدد العشري في النظام الثنائي.",
      usageSteps: [
        "اكتب عددًا عشريًا صحيحًا في الحقل.",
        "اضغط «حوّل إلى ثنائي».",
        "اقرأ الناتج في منطقة «النتيجة».",
        "جرّب أعدادًا مختلفة مثل 0 و 1 و 13 و 255.",
      ],
      learningObjectives: [
        "فهم العلاقة بين النظام العشري والثنائي.",
        "استخدام الحلقات while لبناء تمثيل ثنائي.",
        "استخدام العمليات الحسابية % و //.",
        "التحقق من صحة المدخلات الرقمية.",
      ],
      curriculumLink: "مرتبطة بوحدة أنظمة العد والتمثيل الثنائي في برمجة الحاسب.",
      codeHowItWorks: [
        "to_binary تقسم العدد على 2 وتجمع البواقي.",
        "الحلقة تتوقف عندما يصبح العدد صفرًا.",
        "on_convert يقرأ المدخل ويعرض الناتج.",
      ],
      reflectionQuestions: [
        "لماذا نبدأ البواقي من اليمين في الثنائي؟",
        "كيف تحوّل 13 يدويًا إلى 1101؟",
        "كيف تضيف تحويلًا إلى نظام ثماني أو سداسي عشري؟",
      ],
    },
    starter: `import appkit

def to_binary(n):
    if n == 0:
        return "0"
    bits = ""
    while n > 0:
        bits = str(n % 2) + bits
        n = n // 2
    return bits

appkit.title("محوّل عشري → ثنائي")
appkit.text("أدخل عددًا عشريًا وسيُحوَّل إلى نظام ثنائي")
appkit.number_input("decimal", "العدد العشري", "13", "مثال: 13")
appkit.button("convert", "حوّل إلى ثنائي")
appkit.output("result", "النتيجة")

def on_convert():
    raw = appkit.get("decimal").strip()
    if raw == "":
        appkit.set("result", "الرجاء إدخال عدد عشري.")
        return
    try:
        n = int(raw)
    except:
        appkit.set("result", "الرجاء إدخال رقم صحيح فقط.")
        return
    if n < 0:
        appkit.set("result", "الرجاء إدخال عدد موجب أو صفر.")
        return
    appkit.set("result", "الناتج بالنظام الثنائي هو: " + to_binary(n))

appkit.on_click("convert", on_convert)
appkit.build()`,
  },
  {
    id: "app-caesar",
    exportSlug: "caesar-cipher-app",
    titleAr: "برنامج تشفير وفك تشفير",
    curriculumTopic: "التشفير، النصوص، الحلقات",
    dayId: "day-07",
    edu: {
      subtitle: "شفّر رسالة نصية باستخدام شيفرة قيصر",
      description: "تطبيق عملي على التشفير ومعالجة النصوص حرفًا بحرف.",
      usageSteps: [
        "اكتب النص في حقل «النص الأصلي».",
        "حدد قيمة الإزاحة (مثل 3).",
        "اضغط «شفّر الرسالة» أو «فك التشفير».",
        "اقرأ الناتج في منطقة النتيجة.",
      ],
      learningObjectives: [
        "التعامل مع سلاسل نصية character by character.",
        "استخدام الحلقات for على النص.",
        "تطبيق عملية رياضية على رموز الأبجدية.",
        "فهم فكرة التشفير وفك التشفير.",
      ],
      curriculumLink: "مرتبطة بموضوع التشفير والأمن الرقمي في المنهج.",
      codeHowItWorks: [
        "caesar تمر على كل حرف وتزيحه في الأبجدية.",
        "on_encrypt يطبق الإزاحة للأمام.",
        "on_decrypt يطبق الإزاحة العكسية.",
      ],
      reflectionQuestions: [
        "لماذا Caesar cipher ضعيف أمنيًا؟",
        "كيف تتعامل مع الأرقام والرموز في النص؟",
        "كيف تجعل الإزاحة سرية بين المرسل والمستقبل؟",
      ],
    },
    starter: `import appkit

def caesar(text, shift):
    out = ""
    for c in text.upper():
        if "A" <= c <= "Z":
            out += chr((ord(c) - 65 + shift) % 26 + 65)
        else:
            out += c
    return out

appkit.title("شيفرة قيصر — تشفير وفك تشفير")
appkit.text("أدخل نصًا إنجليزيًا وأزاحة رقمية")
appkit.input("plain", "النص الأصلي", "MOHIBA", "مثال: MOHIBA")
appkit.number_input("shift", "قيمة الإزاحة", "3", "مثال: 3")
appkit.button("enc", "شفّر الرسالة")
appkit.button("dec", "فك التشفير")
appkit.output("cipher", "النتيجة")

def on_encrypt():
    t = appkit.get("plain").strip()
    if t == "":
        appkit.set("cipher", "الرسالة لا يمكن أن تكون فارغة.")
        return
    try:
        s = int(appkit.get("shift"))
    except:
        appkit.set("cipher", "الرجاء إدخال إزاحة رقمية.")
        return
    appkit.set("cipher", "النص المشفّر: " + caesar(t, s))

def on_decrypt():
    t = appkit.get("plain").strip()
    if t == "":
        appkit.set("cipher", "الرسالة لا يمكن أن تكون فارغة.")
        return
    try:
        s = int(appkit.get("shift"))
    except:
        appkit.set("cipher", "الرجاء إدخال إزاحة رقمية.")
        return
    appkit.set("cipher", "النص بعد فك التشفير: " + caesar(t, -s))

appkit.on_click("enc", on_encrypt)
appkit.on_click("dec", on_decrypt)
appkit.build()`,
  },
  {
    id: "app-linear-search",
    exportSlug: "linear-search-viz",
    titleAr: "محاكاة البحث الخطي",
    curriculumTopic: "Linear Search — الخوارزميات",
    dayId: "day-05",
    edu: {
      subtitle: "تابع خطوات البحث عن عنصر في قائمة",
      description: "محاكاة تعليمية لخوارزمية البحث الخطي خطوة بخطوة.",
      usageSteps: [
        "اقرأ القائمة والهدف المعروضين.",
        "اضغط «الخطوة التالية» لمشاهدة فحص عنصر واحد.",
        "تابع حتى يُعثر على الهدف أو تنتهي القائمة.",
        "اضغط «إعادة المحاكاة» للبدء من جديد.",
      ],
      learningObjectives: [
        "فهم خوارزمية البحث الخطي.",
        "تتبع مؤشر الموضع في القائمة.",
        "مقارنة كل عنصر بالهدف.",
        "تحليل أفضل/أسوأ حالة.",
      ],
      curriculumLink: "مرتبطة بخوارزميات البحث في وحدة الخوارزميات.",
      codeHowItWorks: [
        "step يحفظ موضع الفحص الحالي.",
        "on_next يفحص عنصرًا واحدًا ويحدّث الرسالة.",
        "عند المطابقة تتوقف المحاكاة.",
      ],
      reflectionQuestions: [
        "ما أسوأ حالة لعدد المقارنات؟",
        "كيف يختلف البحث الخطي عن الثنائي؟",
        "ماذا لو كانت القائمة غير مرتبة؟",
      ],
    },
    starter: `import appkit

data = [4, 9, 2, 7, 5]
target = 7
step = [0]

def reset():
    step[0] = 0
    appkit.set("status", "اضغط «الخطوة التالية» لبدء البحث.")

appkit.title("البحث الخطي — خطوة بخطوة")
appkit.text("القائمة: " + str(data) + "  |  الهدف: " + str(target))
appkit.button("next", "الخطوة التالية")
appkit.button("reset", "إعادة المحاكاة")
appkit.output("status", "النتيجة")

def on_next():
    i = step[0]
    if i >= len(data):
        appkit.set("status", "انتهى البحث — لم يُعثر على الهدف في القائمة.")
        return
    appkit.set("status", "الخطوة " + str(i + 1) + ": نفحص الموضع " + str(i) + " والقيمة = " + str(data[i]))
    if data[i] == target:
        appkit.set("status", "تم العثور على الهدف في الموضع " + str(i) + "!")
        step[0] = len(data)
    else:
        step[0] = i + 1

def on_reset():
    reset()

appkit.on_click("next", on_next)
appkit.on_click("reset", on_reset)
reset()
appkit.build()`,
  },
  {
    id: "app-quiz",
    exportSlug: "quiz-game",
    titleAr: "لعبة أسئلة تعليمية",
    curriculumTopic: "Python — الشروط والمتغيرات",
    dayId: "day-02",
    edu: {
      subtitle: "اختبر فهمك للنظام الثنائي",
      description: "سؤال تفاعلي سريع مع تغذية راجعة فورية.",
      usageSteps: [
        "اقرأ السؤال المعروض.",
        "اكتب إجابتك في الحقل.",
        "اضغط «تحقق من الإجابة».",
        "اقرأ التغذية الراجعة في منطقة النتيجة.",
      ],
      learningObjectives: [
        "مقارنة النصوص باستخدام if.",
        "استخدام متغير لحفظ النقاط.",
        "تقديم تغذية راجعة للمستخدم.",
      ],
      curriculumLink: "مرتبطة بالنظام الثنائي والشروط في برمجة الحاسب.",
      codeHowItWorks: [
        "score قائمة تحفظ النقاط بين الضغطات.",
        "on_submit تقارن الإجابة بالحل الصحيح 101.",
      ],
      reflectionQuestions: [
        "كيف تحوّل 5 يدويًا إلى ثنائي؟",
        "كيف تضيف أسئلة متعددة للاختبار؟",
      ],
    },
    starter: `import appkit

score = [0]

appkit.title("اختبار سريع — النظام الثنائي")
appkit.text("ما التمثيل الثنائي للعدد 5؟")
appkit.input("ans", "اكتب إجابتك هنا", "101", "مثال: 101")
appkit.button("submit", "تحقق من الإجابة")
appkit.output("feedback", "النتيجة")

def on_submit():
    ans = appkit.get("ans").strip()
    if ans == "":
        appkit.set("feedback", "الرجاء كتابة إجابة قبل التحقق.")
        return
    if ans == "101":
        score[0] += 1
        appkit.set("feedback", "صحيح! 5 بالثنائي = 101. نقاطك: " + str(score[0]))
    else:
        appkit.set("feedback", "حاول مجددًا — تلميح: 4 + 1 = 5 أي 100 + 001")

appkit.on_click("submit", on_submit)
appkit.build()`,
  },
  {
    id: "app-canvas-demo",
    exportSlug: "canvas-drawing-demo",
    titleAr: "تطبيق رسم بسيط — Canvas",
    curriculumTopic: "التكرار، الإحداثيات، Turtle مبسّط",
    dayId: "day-04",
    edu: {
      subtitle: "ارسم أشكالًا باستخدام Canvas والتكرار",
      description: "مقدمة بصرية على الإحداثيات والحلقات في الرسم البرمجي.",
      usageSteps: [
        "اضغط «ارسم الأشكال» لرسم المربعات.",
        "لاحظ تغيّر الألوان والمواقع.",
        "اقرأ رسالة التأكيد في النتيجة.",
        "اضغط مرة أخرى لإعادة الرسم.",
      ],
      learningObjectives: [
        "استخدام حلقة for للتكرار.",
        "الرسم بإحداثيات x و y.",
        "ربط الأزرار بدوال الرسم.",
      ],
      curriculumLink: "مرتبطة بالتكرار والإحداثيات في دروس بايثون.",
      codeHowItWorks: [
        "on_draw تكرر draw_rect بإزاحة متزايدة.",
        "draw_text يضيف نصًا على اللوحة.",
      ],
      reflectionQuestions: [
        "كيف ترسم دائرة بدل مربع؟",
        "كيف تجعل الأشكال تتحرك عبر الحلقات؟",
      ],
    },
    starter: `import appkit

appkit.title("رسم مربعات متدرجة")
appkit.text("اضغط الزر لرسم أشكال ملونة على Canvas")
appkit.canvas("cv", 320, 200)
appkit.button("draw", "ارسم الأشكال")
appkit.output("info", "النتيجة")

def on_draw():
    colors = ["#7c3aed", "#6366f1", "#22d3ee", "#10b981"]
    for i in range(4):
        appkit.draw_rect("cv", 20 + i * 25, 30 + i * 15, 60, 40, colors[i])
    appkit.draw_text("cv", 80, 170, "برمجة الحاسب", "#1e1b4b")
    appkit.set("info", "تم الرسم بنجاح! لاحظ استخدام الحلقة لرسم 4 مربعات.")

appkit.on_click("draw", on_draw)
appkit.build()`,
  },
];

export function getGraphicProject(id) {
  return GRAPHIC_APP_PROJECTS.find((p) => p.id === id) ?? null;
}
