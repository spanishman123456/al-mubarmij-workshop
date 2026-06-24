/**
 * قوالب مشاريع رسومية — مرتبطة بمنهج برمجة الحاسب
 * تستخدم وحدة appkit داخل المختبر (بديل Tkinter/Pygame في المتصفح)
 */

export const GRAPHIC_APP_PROJECTS = [
  {
    id: "app-guess-number",
    exportSlug: "number-guessing-game",
    titleAr: "لعبة تخمين الرقم",
    curriculumTopic: "Python — المتغيرات، الشروط if، الخوارزميات",
    dayId: "day-02",
    starter: `import appkit
import random

secret = random.randint(1, 20)

appkit.title("لعبة تخمين الرقم — برمجة الحاسب")
appkit.text("خمّن الرقم السري بين 1 و 20")
appkit.number_input("guess", "تخمينك", "10")
appkit.output("msg", "النتيجة")
appkit.button("check", "تحقق من التخمين")

def on_check():
    g = int(appkit.get("guess"))
    if g == secret:
        appkit.set("msg", "صحيح! أحسنت")
    elif g < secret:
        appkit.set("msg", "الرقم أكبر — جرّب مرة أخرى")
    else:
        appkit.set("msg", "الرقم أصغر — جرّب مرة أخرى")

appkit.on_click("check", on_check)
appkit.build()`,
  },
  {
    id: "app-number-convert",
    exportSlug: "base-converter",
    titleAr: "تحويل أنظمة العد",
    curriculumTopic: "الثنائي، العشري، الست عشري",
    dayId: "day-01",
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
appkit.number_input("decimal", "العدد العشري", "13")
appkit.button("convert", "حوّل")
appkit.output("result", "الناتج الثنائي")

def on_convert():
    n = int(appkit.get("decimal"))
    appkit.set("result", to_binary(n))

appkit.on_click("convert", on_convert)
appkit.build()`,
  },
  {
    id: "app-caesar",
    exportSlug: "caesar-cipher-app",
    titleAr: "تشفير رسالة — Caesar",
    curriculumTopic: "التشفير، النصوص، الحلقات",
    dayId: "day-07",
    starter: `import appkit

def caesar(text, shift):
    out = ""
    for c in text.upper():
        if "A" <= c <= "Z":
            out += chr((ord(c) - 65 + shift) % 26 + 65)
        else:
            out += c
    return out

appkit.title("شيفرة قيصر")
appkit.input("plain", "النص", "MOHIBA")
appkit.number_input("shift", "الإزاحة", "3")
appkit.button("enc", "شفّر")
appkit.output("cipher", "النص المشفّر")

def on_encrypt():
    t = appkit.get("plain")
    s = int(appkit.get("shift"))
    appkit.set("cipher", caesar(t, s))

appkit.on_click("enc", on_encrypt)
appkit.build()`,
  },
  {
    id: "app-linear-search",
    exportSlug: "linear-search-viz",
    titleAr: "البحث الخطي — عرض خطوة بخطوة",
    curriculumTopic: "Linear Search — الخوارزميات",
    dayId: "day-05",
    starter: `import appkit

data = [4, 9, 2, 7, 5]
target = 7
step = [0]

appkit.title("البحث الخطي")
appkit.text("القائمة: " + str(data) + " — الهدف: " + str(target))
appkit.button("next", "الخطوة التالية")
appkit.output("status", "اضغط للبدء")

def on_next():
    i = step[0]
    if i >= len(data):
        appkit.set("status", "انتهى البحث — لم يُعثر")
        return
    appkit.set("status", "نفحص العنصر في الموضع " + str(i) + " = " + str(data[i]))
    if data[i] == target:
        appkit.set("status", "وُجد الهدف في الموضع " + str(i))
        step[0] = len(data)
    else:
        step[0] = i + 1

appkit.on_click("next", on_next)
appkit.build()`,
  },
  {
    id: "app-quiz",
    exportSlug: "quiz-game",
    titleAr: "لعبة أسئلة تعليمية",
    curriculumTopic: "Python — الشروط والمتغيرات",
    dayId: "day-02",
    starter: `import appkit

score = [0]

appkit.title("اختبار سريع — النظام الثنائي")
appkit.text("ما التمثيل الثنائي للعدد 5؟")
appkit.input("ans", "إجابتك", "101")
appkit.button("submit", "تحقق")
appkit.output("feedback", "النتيجة")

def on_submit():
    if appkit.get("ans").strip() == "101":
        score[0] += 1
        appkit.set("feedback", "صحيح! النتيجة: " + str(score[0]))
    else:
        appkit.set("feedback", "حاول مجددًا — تلميح: 4+1")

appkit.on_click("submit", on_submit)
appkit.build()`,
  },
  {
    id: "app-canvas-demo",
    exportSlug: "canvas-drawing-demo",
    titleAr: "رسم بسيط — Canvas",
    curriculumTopic: "التكرار، الإحداثيات، Turtle مبسّط",
    dayId: "day-04",
    starter: `import appkit

appkit.title("رسم مربعات متدرجة")
appkit.canvas("cv", 320, 200)
appkit.button("draw", "ارسم")
appkit.output("info", "اضغط ارسم")

def on_draw():
    colors = ["#7c3aed", "#6366f1", "#22d3ee", "#10b981"]
    for i in range(4):
        appkit.draw_rect("cv", 20 + i * 25, 30 + i * 15, 60, 40, colors[i])
    appkit.draw_text("cv", 100, 170, "برمجة الحاسب", "#1e1b4b")
    appkit.set("info", "تم الرسم!")

appkit.on_click("draw", on_draw)
appkit.build()`,
  },
];

export function getGraphicProject(id) {
  return GRAPHIC_APP_PROJECTS.find((p) => p.id === id) ?? null;
}
