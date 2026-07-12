export const GRAPHIC_SKUI_STARTERS = {
  "app-guess-number": `import random
import skui as ui

app = ui.App(title="لعبة تخمين الرقم")
secret = [random.randint(1, 20)]
attempts = [0]
guess = ui.Input(placeholder="رقم من 1 إلى 20")
status = ui.Alert(text="ابدأ التخمين")

def check():
    try:
        value = int(guess.value())
    except:
        status.set_text("أدخل رقمًا صحيحًا")
        return
    attempts[0] += 1
    if value == secret[0]:
        status.set_text("أحسنت! عدد المحاولات: " + str(attempts[0]))
    elif value < secret[0]:
        status.set_text("اختر رقمًا أكبر")
    else:
        status.set_text("اختر رقمًا أصغر")

app.add(ui.Heading(text="تخمين الرقم", level=1))
app.add(guess)
app.add(ui.Button(text="تحقق", on_click=check))
app.add(status)
app.run()`,

  "app-number-convert": `import skui as ui

app = ui.App(title="تحويل أنظمة العد")
number = ui.Input(placeholder="عدد عشري")
result = ui.Alert(text="أدخل عددًا ثم اضغط تحويل")

def convert():
    try:
        value = int(number.value())
        result.set_text("الثنائي: " + bin(value)[2:])
    except:
        result.set_text("أدخل عددًا صحيحًا موجبًا")

app.add(ui.Heading(text="عشري إلى ثنائي", level=1))
app.add(number)
app.add(ui.Button(text="تحويل", on_click=convert))
app.add(result)
app.run()`,

  "app-caesar": `import skui as ui

app = ui.App(title="شفرة قيصر")
plain = ui.Input(placeholder="اكتب نصًا إنجليزيًا")
shift = ui.Slider(value=3, min=1, max=25)
result = ui.Alert(text="الناتج")

def encrypt():
    output = ""
    key = int(shift.value())
    for char in plain.value():
        if "a" <= char.lower() <= "z":
            base = ord("A") if char.isupper() else ord("a")
            output += chr((ord(char) - base + key) % 26 + base)
        else:
            output += char
    result.set_text(output)

app.add(plain)
app.add(shift)
app.add(ui.Button(text="تشفير", on_click=encrypt))
app.add(result)
app.run()`,

  "app-linear-search": `import skui as ui

app = ui.App(title="البحث الخطي")
numbers = [4, 8, 15, 16, 23, 42]
target = ui.Input(placeholder="العدد المطلوب")
result = ui.Alert(text="القائمة: " + str(numbers))

def search():
    try:
        value = int(target.value())
        if value in numbers:
            result.set_text("وُجد في الموقع " + str(numbers.index(value)))
        else:
            result.set_text("غير موجود")
    except:
        result.set_text("أدخل عددًا صحيحًا")

app.add(target)
app.add(ui.Button(text="ابحث", on_click=search))
app.add(result)
app.run()`,

  "app-quiz": `import skui as ui

app = ui.App(title="اختبار سريع")
question = ui.Text("ما ناتج 6 × 7؟")
answer = ui.Select(options=["36", "42", "48"])
result = ui.Alert(text="اختر الإجابة")

def check():
    result.set_text("إجابة صحيحة" if answer.value() == "42" else "حاول مرة أخرى")

app.add(question)
app.add(answer)
app.add(ui.Button(text="تحقق", on_click=check))
app.add(result)
app.run()`,

  "app-canvas-demo": `import skui as ui

app = ui.App(title="رسم Canvas")
canvas = ui.Canvas(width=320, height=200)
status = ui.Text("اضغط الزر للرسم")

def draw():
    canvas.clear()
    colors = ["#7c3aed", "#6366f1", "#10b981", "#ef4444"]
    for i in range(4):
        canvas.draw_rect(20 + i * 35, 30 + i * 20, 70, 45, colors[i])
    canvas.draw_text("skui", 120, 180, "#111827", 20)
    status.set_text("اكتمل الرسم")

app.add(canvas)
app.add(ui.Button(text="ارسم", on_click=draw))
app.add(status)
app.run()`,
};
