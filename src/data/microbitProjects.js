export const MICROBIT_PROJECTS = [
  {
    id: "step-counter",
    title: "عداد خطوات بسيط",
    idea: "استخدم زر A لزيادة عداد الخطوات وعرضه على شاشة LED.",
    tools: ["micro:bit", "كابل USB", "MakeCode أو Mu Editor"],
    steps: [
      "افتح محرر MakeCode لـ micro:bit",
      "أضف حدث «عند الضغط على زر A»",
      "زِد متغيرًا باسم steps بمقدار 1",
      "اعرض قيمة steps على الشاشة",
    ],
    code: `from microbit import *

steps = 0

while True:
    if button_a.was_pressed():
        steps += 1
        display.scroll(str(steps))`,
    test: "اضغط زر A عدة مرات وتأكد أن العداد يزيد.",
    extend: "أضف زر B لإعادة الضبط واهتزازًا عند كل 10 خطوات.",
  },
  {
    id: "guess-number",
    title: "لعبة تخمين رقم",
    idea: "يختار الجهاز رقمًا عشوائيًا والطالب يخمّن باستخدام الأزرار.",
    tools: ["micro:bit", "MicroPython"],
    steps: [
      "ولّد رقمًا عشوائيًا من 1 إلى 9",
      "عند الضغط على A زِد التخمين",
      "عند الضغط على B أكّد التخمين",
      "اعرض ✓ أو ✗",
    ],
    code: `from microbit import *
import random

secret = random.randint(1, 9)
guess = 5

while True:
    if button_a.was_pressed():
        guess = (guess % 9) + 1
        display.show(str(guess))
    if button_b.was_pressed():
        if guess == secret:
            display.show(Image.HAPPY)
        else:
            display.show(Image.SAD)`,
    test: "جرّب تخمينات مختلفة حتى تفوز.",
    extend: "أضف عدد محاولات محدود ورسالة LED عند الفوز.",
  },
  {
    id: "compass",
    title: "بوصلة اتجاهات",
    idea: "اعرض الحرف N/E/S/W حسب اتجاه الجهاز باستخدام البوصلة.",
    tools: ["micro:bit مع بوصلة"],
    steps: ["اقرأ قيمة compass.heading()", "حوّل الزاوية إلى اتجاه", "اعرض حرف الاتجاه"],
    code: `from microbit import *

while True:
    h = compass.heading()
    if h < 45 or h >= 315:
        display.show("N")
    elif h < 135:
        display.show("E")
    elif h < 225:
        display.show("S")
    else:
        display.show("W")`,
    test: "أدر الجهاز في اتجاهات مختلفة.",
    extend: "أضف سهمًا على الشاشة باستخدام Image.",
  },
  {
    id: "motion-sensor",
    title: "حساس حركة",
    idea: "عند هز الجهاز يظهر رمز تعبيري.",
    tools: ["micro:bit"],
    steps: ["استخدم accelerometer.was_gesture('shake')", "اعرض رمزًا على الشاشة"],
    code: `from microbit import *

while True:
    if accelerometer.was_gesture("shake"):
        display.show(Image.SURPRISED)
        sleep(500)
    display.show(Image.ASLEEP)`,
    test: "هز الجهاز وشاهد الاستجابة.",
    extend: "سجّل عدد مرات الهز في متغير.",
  },
  {
    id: "score-counter",
    title: "عداد نقاط للعبة",
    idea: "زر A يزيد النقاط وزر B ينقصها مع حد أقصى.",
    tools: ["micro:bit"],
    steps: ["أنشئ متغير score", "حدّث العرض عند كل ضغطة"],
    code: `from microbit import *

score = 0
while True:
    if button_a.was_pressed():
        score = min(99, score + 1)
    if button_b.was_pressed():
        score = max(0, score - 1)
    display.show(str(score) if score < 10 else str(score)[:2])`,
    test: "تأكد من عدم تجاوز الحدود.",
    extend: "أضف صوتًا عند الوصول لـ 10 نقاط.",
  },
  {
    id: "led-message",
    title: "رسالة LED تفاعلية",
    idea: "اعرض اسم الطالب أو رسالة تحفيزية متحركة.",
    tools: ["micro:bit"],
    steps: ["استخدم display.scroll()", "أضف تأخيرًا بين الرسائل"],
    code: `from microbit import *

messages = ["موهبة", "برمجة", "ابدأ"]
i = 0
while True:
    display.scroll(messages[i])
    i = (i + 1) % len(messages)
    sleep(1000)`,
    test: "تأكد من وضوح النص المتحرك.",
    extend: "اجعل الطالب يدخل اسمه من الحاسب ثم ينقله للكود.",
  },
  {
    id: "shake-game",
    title: "لعبة تفاعل بالاهتزاز",
    idea: "من يهز أسرع يفوز — عداد زمني بسيط.",
    tools: ["micro:bit"],
    steps: ["ابدأ العد التنازلي", "عند الهز سجّل الفوز"],
    code: `from microbit import *
import random

target = random.randint(3, 8)
t = 0
while t < target:
  display.show(str(target - t))
  sleep(1000)
  t += 1
display.show("!")
while True:
  if accelerometer.was_gesture("shake"):
    display.show(Image.HAPPY)
    break`,
    test: "هز الجهاز بعد انتهاء العد.",
    extend: "أضف مستويين صعوبة.",
  },
  {
    id: "simple-alarm",
    title: "جهاز إنذار بسيط",
    idea: "عند تجاوز مستوى ضوء معين يُشغّل إنذار LED.",
    tools: ["micro:bit"],
    steps: ["اقرأ display.read_light_level()", "إذا كان أقل من عتبة أظهر X"],
    code: `from microbit import *

THRESHOLD = 50
while True:
    if display.read_light_level() < THRESHOLD:
        display.show("X")
    else:
        display.show(Image.HAPPY)
    sleep(200)`,
    test: "غطّ الضوء حول الجهاز.",
    extend: "أضف نغمة buzzer إن توفرت.",
  },
  {
    id: "cipher-display",
    title: "عرض رسالة مشفرة",
    idea: "اربط تشفير قيصر بعرض الرسالة على micro:bit.",
    tools: ["micro:bit", "معرفة Caesar Cipher"],
    steps: ["شفّر نصًا بإزاحة", "اعرضه حرفًا حرفًا"],
    code: `def caesar(text, shift):
    out = ""
    for c in text:
        if "A" <= c <= "Z":
            out += chr((ord(c)-65+shift)%26+65)
        else:
            out += c
    return out

from microbit import *
msg = caesar("MAWhiba", 3)
display.scroll(msg)`,
    test: "تحقق أن الرسالة المشفرة تظهر بشكل صحيح.",
    extend: "أضف زرًا لفك التشفير.",
  },
  {
    id: "vars-conditions-loop",
    title: "متغيرات وشروط وتكرار",
    idea: "مشروع يجمع المفاهيم الأساسية في بايثون.",
    tools: ["micro:bit"],
    steps: ["عرّف متغيرات", "استخدم while و if", "كرّر نمط LED"],
    code: `from microbit import *

level = 1
while level <= 3:
    for y in range(5):
        for x in range(5):
            if (x + y) % 2 == 0:
                display.set_pixel(x, y, 9)
            else:
                display.set_pixel(x, y, 0)
        sleep(300)
    level += 1
display.show(Image.YES)`,
    test: "راقب تكرار النمط ثلاث مرات.",
    extend: "غيّر النمط حسب مستوى level.",
  },
];
