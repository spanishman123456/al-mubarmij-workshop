/**
 * قوالب مشاريع رسومية — مرتبطة بمنهج برمجة الحاسب
 */
import { GRAPHIC_SKUI_STARTERS } from "./graphicSkuiStarters.js";

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
        "اضغط «ابدأ اللعبة» لتوليد رقم سري جديد.",
        "اكتب تخمينك بين 1 و 20 في الحقل المخصص.",
        "اضغط «تحقق من التخمين» واقرأ الرسالة: أكبر أم أصغر أم صحيح.",
        "تابع المحاولات حتى تفوز أو تنتهي المحاولات السبع.",
        "اضغط «إعادة اللعب» لبدء جولة جديدة.",
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
        "state يحدد حالة اللعبة: لم تبدأ / جارية / فوز / خسارة.",
        "secret يحفظ الرقم السري عشوائيًا عند بدء اللعبة.",
        "attempts يعدّ المحاولات المستخدمة.",
        "on_check تقارن التخمين وتُظهر تغذية راجعة واضحة.",
        "on_restart يعيد ضبط اللعبة بالكامل.",
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
secret = [0]
attempts = [0]
state = ["idle"]

def update_attempts_box():
    used = attempts[0]
    left = MAX_ATTEMPTS - used
    appkit.set(
        "attempts",
        "الحد الأقصى: " + str(MAX_ATTEMPTS) + " محاولات\\n"
        + "عدد المحاولات المستخدمة: " + str(used) + " من " + str(MAX_ATTEMPTS) + "\\n"
        + "المحاولات المتبقية: " + str(left),
    )

def start_game():
    secret[0] = random.randint(1, 20)
    attempts[0] = 0
    state[0] = "playing"
    appkit.set("guess", "")
    appkit.set("status", "حالة اللعبة: جارية")
    appkit.set("feedback", "تم بدء اللعبة. حاول تخمين الرقم السري.")
    update_attempts_box()

def on_start():
    start_game()

def on_check():
    if state[0] == "idle":
        appkit.set("feedback", "اضغط «ابدأ اللعبة» أولاً لبدء جولة جديدة.")
        return
    if state[0] == "won":
        appkit.set("feedback", "مبروك! لقد فزت بالفعل. اضغط «إعادة اللعب» لجولة جديدة.")
        return
    if state[0] == "lost":
        appkit.set("feedback", "انتهت هذه الجولة. اضغط «إعادة اللعب» للمحاولة من جديد.")
        return
    raw = appkit.get("guess").strip()
    if raw == "":
        appkit.set("feedback", "الرجاء إدخال رقم صحيح بين 1 و 20.")
        return
    try:
        g = int(raw)
    except:
        appkit.set("feedback", "الرجاء إدخال رقم صحيح بين 1 و 20.")
        return
    if g < 1 or g > 20:
        appkit.set("feedback", "الرجاء إدخال رقم صحيح بين 1 و 20.")
        return
    attempts[0] += 1
    update_attempts_box()
    if g == secret[0]:
        state[0] = "won"
        appkit.set("status", "حالة اللعبة: فزت")
        appkit.set(
            "feedback",
            "مبروك! فزت في اللعبة.\\n"
            + "لقد خمنت الرقم الصحيح (" + str(secret[0]) + ") في " + str(attempts[0]) + " محاولة.",
        )
        return
    if attempts[0] >= MAX_ATTEMPTS:
        state[0] = "lost"
        appkit.set("status", "حالة اللعبة: خسرت")
        appkit.set(
            "feedback",
            "انتهت المحاولات. خسرت هذه الجولة.\\nالرقم الصحيح كان: " + str(secret[0]),
        )
        return
    if g < secret[0]:
        appkit.set("feedback", "تخمينك أقل من الرقم السري، جرّب رقمًا أكبر.")
    else:
        appkit.set("feedback", "تخمينك أكبر من الرقم السري، جرّب رقمًا أصغر.")

def on_restart():
    start_game()

appkit.title("لعبة تخمين الرقم")
appkit.text("حاول تخمين الرقم السري بين 1 و 20")
appkit.output("status", "حالة اللعبة")
appkit.output("attempts", "عدد المحاولات")
appkit.output("feedback", "رسالة اللعبة")
appkit.number_input("guess", "اكتب تخمينك هنا", "", "مثال: 10")
appkit.button("start", "ابدأ اللعبة")
appkit.button("check", "تحقق من التخمين")
appkit.button("restart", "إعادة اللعب")

appkit.on_click("start", on_start)
appkit.on_click("check", on_check)
appkit.on_click("restart", on_restart)

appkit.set("status", "حالة اللعبة: لم تبدأ بعد")
appkit.set("attempts", "الحد الأقصى: 7 محاولات\\nعدد المحاولات المستخدمة: 0 من 7\\nالمحاولات المتبقية: 7")
appkit.set("feedback", "اضغط «ابدأ اللعبة» لبدء جولة جديدة.")
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
        "اكتب عددًا عشريًا صحيحًا في حقل «العدد العشري».",
        "اضغط «حوّل إلى ثنائي».",
        "اقرأ الناتج في «نتيجة التحويل».",
        "إذا ظهر خطأ، صحّح المدخل وحاول مجددًا.",
        "اضغط «مسح النتيجة» لإعادة التجربة.",
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
appkit.output("status", "حالة الأداة")
appkit.number_input("decimal", "العدد العشري", "13", "مثال: 13")
appkit.button("convert", "حوّل إلى ثنائي")
appkit.button("clear", "مسح النتيجة")
appkit.output("result", "نتيجة التحويل")

def on_convert():
    raw = appkit.get("decimal").strip()
    if raw == "":
        appkit.set("status", "حالة الأداة: خطأ في المدخل")
        appkit.set("result", "الرجاء إدخال عدد عشري صحيح.")
        return
    try:
        n = int(raw)
    except:
        appkit.set("status", "حالة الأداة: خطأ في المدخل")
        appkit.set("result", "الرجاء إدخال رقم صحيح فقط (بدون حروف).")
        return
    if n < 0:
        appkit.set("status", "حالة الأداة: خطأ في المدخل")
        appkit.set("result", "الرجاء إدخال عدد موجب أو صفر.")
        return
    appkit.set("status", "حالة الأداة: اكتمل التحويل بنجاح")
    appkit.set("result", "تم التحويل بنجاح!\\nالعدد " + str(n) + " بالنظام الثنائي = " + to_binary(n))

def on_clear():
    appkit.set("status", "حالة الأداة: جاهزة للتحويل")
    appkit.set("result", "اكتب عددًا عشريًا ثم اضغط «حوّل إلى ثنائي».")

appkit.on_click("convert", on_convert)
appkit.on_click("clear", on_clear)
appkit.set("status", "حالة الأداة: جاهزة للتحويل")
appkit.set("result", "اكتب عددًا عشريًا ثم اضغط «حوّل إلى ثنائي».")
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
appkit.output("status", "حالة البرنامج")
appkit.input("plain", "النص الأصلي", "MOHIBA", "مثال: MOHIBA")
appkit.number_input("shift", "قيمة الإزاحة", "3", "مثال: 3")
appkit.button("enc", "شفّر الرسالة")
appkit.button("dec", "فك التشفير")
appkit.button("clear", "مسح النتيجة")
appkit.output("cipher", "نتيجة التشفير")

def on_encrypt():
    t = appkit.get("plain").strip()
    if t == "":
        appkit.set("status", "حالة البرنامج: خطأ — النص فارغ")
        appkit.set("cipher", "الرسالة لا يمكن أن تكون فارغة. اكتب نصًا ثم اضغط «شفّر الرسالة».")
        return
    try:
        s = int(appkit.get("shift"))
    except:
        appkit.set("status", "حالة البرنامج: خطأ — الإزاحة غير صحيحة")
        appkit.set("cipher", "الرجاء إدخال إزاحة رقمية صحيحة.")
        return
    appkit.set("status", "حالة البرنامج: تم التشفير بنجاح")
    appkit.set("cipher", "تم التشفير بنجاح!\\nالنص المشفّر: " + caesar(t, s))

def on_decrypt():
    t = appkit.get("plain").strip()
    if t == "":
        appkit.set("status", "حالة البرنامج: خطأ — النص فارغ")
        appkit.set("cipher", "الرسالة لا يمكن أن تكون فارغة. اكتب نصًا ثم اضغط «فك التشفير».")
        return
    try:
        s = int(appkit.get("shift"))
    except:
        appkit.set("status", "حالة البرنامج: خطأ — الإزاحة غير صحيحة")
        appkit.set("cipher", "الرجاء إدخال إزاحة رقمية صحيحة.")
        return
    appkit.set("status", "حالة البرنامج: تم فك التشفير بنجاح")
    appkit.set("cipher", "تم فك التشفير بنجاح!\\nالنص الأصلي: " + caesar(t, -s))

def on_clear():
    appkit.set("status", "حالة البرنامج: جاهز")
    appkit.set("cipher", "اكتب نصًا وإزاحة ثم اختر «شفّر الرسالة» أو «فك التشفير».")

appkit.on_click("enc", on_encrypt)
appkit.on_click("dec", on_decrypt)
appkit.on_click("clear", on_clear)
appkit.set("status", "حالة البرنامج: جاهز")
appkit.set("cipher", "اكتب نصًا وإزاحة ثم اختر «شفّر الرسالة» أو «فك التشفير».")
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
state = ["ready"]

def reset():
    step[0] = 0
    state[0] = "ready"
    appkit.set("status", "حالة المحاكاة: جاهزة للبدء")
    appkit.set("progress", "الخطوة الحالية: 0 من " + str(len(data)))
    appkit.set("message", "اضغط «ابدأ المحاكاة» ثم «الخطوة التالية» لمتابعة البحث.")

appkit.title("البحث الخطي — خطوة بخطوة")
appkit.text("القائمة: " + str(data) + "  |  الهدف: " + str(target))
appkit.output("status", "حالة المحاكاة")
appkit.output("progress", "تقدّم البحث")
appkit.output("message", "رسالة الخطوة")
appkit.button("begin", "ابدأ المحاكاة")
appkit.button("next", "الخطوة التالية")
appkit.button("reset", "إعادة المحاكاة")

def on_begin():
    reset()
    state[0] = "running"
    appkit.set("status", "حالة المحاكاة: جارية")
    appkit.set("message", "بدأت المحاكاة. اضغط «الخطوة التالية» لفحص أول عنصر.")

def on_next():
    if state[0] == "ready":
        appkit.set("message", "اضغط «ابدأ المحاكاة» أولاً.")
        return
    if state[0] == "found":
        appkit.set("message", "تم العثور على الهدف! اضغط «إعادة المحاكاة» لبدء جولة جديدة.")
        return
    if state[0] == "failed":
        appkit.set("message", "انتهى البحث دون نجاح. اضغط «إعادة المحاكاة» للمحاولة من جديد.")
        return
    i = step[0]
    if i >= len(data):
        state[0] = "failed"
        appkit.set("status", "حالة المحاكاة: انتهت دون نجاح")
        appkit.set("message", "انتهى البحث — لم يُعثر على الهدف في القائمة.")
        return
    appkit.set("progress", "الخطوة الحالية: " + str(i + 1) + " من " + str(len(data)))
    appkit.set("message", "الخطوة " + str(i + 1) + ": نفحص الموضع " + str(i) + " والقيمة = " + str(data[i]))
    if data[i] == target:
        state[0] = "found"
        appkit.set("status", "حالة المحاكاة: نجح البحث")
        appkit.set("message", "مبروك! تم العثور على الهدف في الموضع " + str(i) + ".")
        step[0] = len(data)
    else:
        step[0] = i + 1

def on_reset():
    reset()

appkit.on_click("begin", on_begin)
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
answered = [False]

appkit.title("اختبار سريع — النظام الثنائي")
appkit.text("ما التمثيل الثنائي للعدد 5؟")
appkit.output("status", "حالة الاختبار")
appkit.input("ans", "اكتب إجابتك هنا", "", "مثال: 101")
appkit.button("submit", "تحقق من الإجابة")
appkit.button("retry", "إعادة المحاولة")
appkit.output("feedback", "نتيجة الإجابة")

def on_submit():
    ans = appkit.get("ans").strip()
    if ans == "":
        appkit.set("status", "حالة الاختبار: بانتظار إجابة")
        appkit.set("feedback", "الرجاء كتابة إجابة قبل التحقق.")
        return
    answered[0] = True
    if ans == "101":
        score[0] += 1
        appkit.set("status", "حالة الاختبار: إجابة صحيحة")
        appkit.set("feedback", "مبروك! إجابة صحيحة. 5 بالثنائي = 101.\\nنقاطك: " + str(score[0]))
    else:
        appkit.set("status", "حالة الاختبار: إجابة خاطئة")
        appkit.set("feedback", "إجابة غير صحيحة. حاول مجددًا — تلميح: 4 + 1 = 5 أي 100 + 001")

def on_retry():
    answered[0] = False
    appkit.set("ans", "")
    appkit.set("status", "حالة الاختبار: جاهز لمحاولة جديدة")
    appkit.set("feedback", "اكتب إجابتك ثم اضغط «تحقق من الإجابة».")

appkit.on_click("submit", on_submit)
appkit.on_click("retry", on_retry)
appkit.set("status", "حالة الاختبار: جاهز")
appkit.set("feedback", "اقرأ السؤال ثم اكتب إجابتك واضغط «تحقق من الإجابة».")
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

drawn = [False]

appkit.title("رسم مربعات متدرجة")
appkit.text("اضغط الزر لرسم أشكال ملونة على Canvas")
appkit.output("status", "حالة الرسم")
appkit.canvas("cv", 320, 200)
appkit.button("draw", "ارسم الأشكال")
appkit.button("clear", "امسح اللوحة")

def on_draw():
    colors = ["#7c3aed", "#6366f1", "#22d3ee", "#10b981"]
    for i in range(4):
        appkit.draw_rect("cv", 20 + i * 25, 30 + i * 15, 60, 40, colors[i])
    appkit.draw_text("cv", 80, 170, "برمجة الحاسب", "#1e1b4b")
    drawn[0] = True
    appkit.set("status", "حالة الرسم: اكتمل بنجاح — تم رسم 4 مربعات ملونة.")

def on_clear():
    appkit.clear_canvas("cv")
    drawn[0] = False
    appkit.set("status", "حالة الرسم: اللوحة فارغة — اضغط «ارسم الأشكال» للبدء.")

appkit.on_click("draw", on_draw)
appkit.on_click("clear", on_clear)
appkit.set("status", "حالة الرسم: جاهز — اضغط «ارسم الأشكال» لبدء الرسم.")
appkit.build()`,
  },
];

// appkit remains a runtime compatibility adapter only; every lesson/template
// presented to students uses the official skui API.
for (const project of GRAPHIC_APP_PROJECTS) {
  if (GRAPHIC_SKUI_STARTERS[project.id]) project.starter = GRAPHIC_SKUI_STARTERS[project.id];
}

export function getGraphicProject(id) {
  return GRAPHIC_APP_PROJECTS.find((p) => p.id === id) ?? null;
}
