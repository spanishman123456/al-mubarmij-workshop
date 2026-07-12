/**
 * تطبيقات skui الجاهزة للتشغيل — مصدر واحد للطالب والمعلم.
 */

export const SKUI_DEMO_APPS = {
  "app-guess-number": `import random
import skui as ui

MAX_ATTEMPTS = 7
secret = [0]
attempts = [0]
state = ["idle"]

app = ui.App(title="لعبة تخمين الرقم", theme="modern", appearance="dark", width="440px")
guide = ui.Guide(
    title="مرحبًا بك!",
    message="خمّن رقمًا بين 1 و 20. لديك 7 محاولات. ابدأ الجولة ثم أدخل تخمينك.",
    character="assistant",
    position="top",
)
card = ui.Card(padding="1.25rem", border_radius="1.4rem")
title = ui.Heading(text="تخمين الرقم السري", level=1)
range_badge = ui.Badge(text="المجال: 1 — 20")
attempts_text = ui.Text("المحاولات: 0 / 7")
guess = ui.Input(placeholder="أدخل تخمينك", value="", size="lg")
feedback = ui.Alert(text="اضغط «ابدأ الجولة» للبدء", variant="info")
row = ui.Row(gap="0.6rem")

def refresh_attempts():
    attempts_text.set_text("المحاولات: " + str(attempts[0]) + " / " + str(MAX_ATTEMPTS))

def start_round():
    secret[0] = random.randint(1, 20)
    attempts[0] = 0
    state[0] = "playing"
    guess.set_value("")
    refresh_attempts()
    feedback.set_text("بدأت الجولة! حاول التخمين.")

def check_guess():
    if state[0] != "playing":
        feedback.set_text("ابدأ جولة جديدة أولًا.")
        return
    raw = str(guess.value()).strip()
    try:
        value = int(raw)
    except:
        feedback.set_text("أدخل رقمًا صحيحًا فقط.")
        return
    if value < 1 or value > 20:
        feedback.set_text("الرقم يجب أن يكون بين 1 و 20.")
        return
    attempts[0] += 1
    refresh_attempts()
    if value == secret[0]:
        state[0] = "won"
        feedback.set_text("إجابة صحيحة! فزت بعد " + str(attempts[0]) + " محاولة.")
    elif attempts[0] >= MAX_ATTEMPTS:
        state[0] = "lost"
        feedback.set_text("انتهت المحاولات. الرقم كان " + str(secret[0]))
    elif value < secret[0]:
        feedback.set_text("الرقم أكبر من تخمينك.")
    else:
        feedback.set_text("الرقم أصغر من تخمينك.")

def new_round():
    start_round()

btn_start = ui.Button(text="ابدأ الجولة", variant="success", depth="raised", on_click=start_round)
btn_check = ui.Button(text="تحقق", variant="primary", depth="raised", on_click=check_guess)
btn_new = ui.Button(text="جولة جديدة", variant="secondary", depth="raised", on_click=new_round)

row.add(btn_start)
row.add(btn_check)
row.add(btn_new)
card.add(title)
card.add(range_badge)
card.add(attempts_text)
card.add(guess)
card.add(row)
card.add(feedback)
app.add(guide)
app.add(card)
app.run()`,

  "app-calculator": `import skui as ui

app = ui.App(title="آلة حاسبة حديثة", theme="modern", appearance="dark", width="420px", direction="ltr")
guide = ui.Guide(title="مرحبًا بك في الآلة الحاسبة", message="استخدم الأزرار للحساب. C للمسح و⌫ للحذف.", character="assistant")
panel = ui.Card(padding="1rem", border_radius="1.5rem", background="#0b1224")
history = ui.Text("احسب بسرعة")
status = ui.Alert(text="جاهز للحساب", variant="info")
expr = [""]
op = [""]
left = [None]

def set_display(text):
    display.set_value(str(text))

def append_digit(d):
    status.set_text("جاهز للحساب")
    expr[0] = expr[0] + str(d)
    set_display(expr[0])

def make_digit(d):
    def press():
        append_digit(d)
    return press

def set_op(symbol):
    def press():
        if expr[0] == "" and left[0] is None:
            return
        if left[0] is None:
            try:
                left[0] = float(expr[0])
            except Exception:
                status.set_text("أدخل رقمًا صحيحًا")
                return
        op[0] = symbol
        expr[0] = ""
        set_display(str(left[0]) + " " + symbol)
        status.set_text("اختر الرقم الثاني")
    return press

def clear_all():
    expr[0] = ""
    op[0] = ""
    left[0] = None
    set_display("")
    status.set_text("تم المسح")

def backspace():
    expr[0] = expr[0][:-1]
    set_display(expr[0])

def calculate():
    if left[0] is None or op[0] == "" or expr[0] == "":
        status.set_text("أدخل عملية كاملة مثل 7 + 5")
        return
    try:
        right = float(expr[0])
    except Exception:
        status.set_text("أدخل رقمًا صحيحًا")
        return
    a = left[0]
    b = right
    symbol = op[0]
    if symbol == "+":
        answer = a + b
    elif symbol == "-":
        answer = a - b
    elif symbol == "×":
        answer = a * b
    elif symbol == "÷":
        if b == 0:
            status.set_text("خطأ: لا يمكن القسمة على صفر")
            return
        answer = a / b
    else:
        status.set_text("عملية غير معروفة")
        return
    set_display(str(answer))
    status.set_text("تم الحساب بنجاح")
    history.set_text(str(a) + " " + symbol + " " + str(b) + " = " + str(answer))
    left[0] = answer
    op[0] = ""
    expr[0] = ""

display = ui.Input(placeholder="0", value="", size="lg", direction="ltr")
keys = ui.Grid(columns=4, gap="0.55rem")
layout = [
    ("C", clear_all, "danger"),
    ("⌫", backspace, "ghost"),
    ("÷", set_op("÷"), "operator"),
    ("×", set_op("×"), "operator"),
    ("7", make_digit("7"), "calculator-key"),
    ("8", make_digit("8"), "calculator-key"),
    ("9", make_digit("9"), "calculator-key"),
    ("-", set_op("-"), "operator"),
    ("4", make_digit("4"), "calculator-key"),
    ("5", make_digit("5"), "calculator-key"),
    ("6", make_digit("6"), "calculator-key"),
    ("+", set_op("+"), "operator"),
    ("1", make_digit("1"), "calculator-key"),
    ("2", make_digit("2"), "calculator-key"),
    ("3", make_digit("3"), "calculator-key"),
    ("=", calculate, "success"),
    ("0", make_digit("0"), "calculator-key"),
    (".", make_digit("."), "calculator-key"),
]
for label, handler, variant in layout:
    keys.add(ui.Button(text=label, variant=variant, depth="raised", size="lg", on_click=handler))
panel.add(history)
panel.add(display)
panel.add(status)
panel.add(keys)
app.add(guide)
app.add(panel)
app.run()`,

  "app-registration": `import skui as ui

app = ui.App(title="نموذج التسجيل", theme="modern", appearance="dark", width="440px")
guide = ui.Guide(title="أهلًا بك", message="أدخل بياناتك بدقة. البريد يجب أن يحتوي @ وكلمة المرور 6 أحرف على الأقل.", character="assistant")
card = ui.Card(padding="1.25rem", border_radius="1.4rem")
name = ui.Input(placeholder="الاسم الكامل")
email = ui.Input(placeholder="البريد الإلكتروني")
password = ui.Input(placeholder="كلمة المرور")
msg = ui.Alert(text="املأ الحقول ثم سجّل", variant="info")

def submit():
    n = str(name.value()).strip()
    e = str(email.value()).strip()
    p = str(password.value()).strip()
    if len(n) < 2:
        msg.set_text("أدخل اسمًا صحيحًا.")
        return
    if "@" not in e or "." not in e:
        msg.set_text("أدخل بريدًا إلكترونيًا صالحًا.")
        return
    if len(p) < 6:
        msg.set_text("كلمة المرور قصيرة جدًا (6 أحرف على الأقل).")
        return
    msg.set_text("تم التسجيل بنجاح! مرحبًا " + n)

card.add(ui.Heading(text="إنشاء حساب", level=1))
card.add(name)
card.add(email)
card.add(password)
card.add(ui.Button(text="تسجيل", variant="success", depth="raised", on_click=submit))
card.add(msg)
app.add(guide)
app.add(card)
app.run()`,

  "app-todo": `import skui as ui

app = ui.App(title="قائمة المهام", theme="modern", appearance="dark", width="480px")
guide = ui.Guide(title="نظّم يومك", message="أضف مهمة، أكملها، أو احذفها. استخدم الفلاتر للعرض.", character="assistant")
tasks = []
filter_mode = ["all"]
entry = ui.Input(placeholder="مهمة جديدة")
list_view = ui.List(items=[])
status = ui.Alert(text="لا توجد مهام بعد", variant="info")

def render():
    items = []
    for i, t in enumerate(tasks):
        if filter_mode[0] == "done" and not t["done"]:
            continue
        if filter_mode[0] == "active" and t["done"]:
            continue
        mark = "✓ " if t["done"] else "• "
        items.append(mark + t["text"] + "  [" + str(i) + "]")
    list_view.set_items(items)
    status.set_text("عدد المهام المعروضة: " + str(len(items)))

def add_task():
    text = str(entry.value()).strip()
    if not text:
        status.set_text("اكتب نص المهمة أولًا")
        return
    tasks.append({"text": text, "done": False})
    entry.set_value("")
    render()

def toggle_first_active():
    for t in tasks:
        if not t["done"]:
            t["done"] = True
            render()
            return
    status.set_text("لا توجد مهام نشطة")

def delete_last():
    if tasks:
        tasks.pop()
        render()
    else:
        status.set_text("القائمة فارغة")

def show_all():
    filter_mode[0] = "all"
    render()

def show_active():
    filter_mode[0] = "active"
    render()

def show_done():
    filter_mode[0] = "done"
    render()

row = ui.Row(gap="0.5rem")
row.add(ui.Button(text="إضافة", variant="success", depth="raised", on_click=add_task))
row.add(ui.Button(text="إتمام أول نشطة", variant="primary", on_click=toggle_first_active))
row.add(ui.Button(text="حذف الأخيرة", variant="danger", on_click=delete_last))
filters = ui.Row(gap="0.4rem")
filters.add(ui.Button(text="الكل", variant="ghost", on_click=show_all))
filters.add(ui.Button(text="النشط", variant="ghost", on_click=show_active))
filters.add(ui.Button(text="المكتمل", variant="ghost", on_click=show_done))
app.add(guide)
app.add(ui.Heading(text="مهامي", level=1))
app.add(entry)
app.add(row)
app.add(filters)
app.add(list_view)
app.add(status)
app.run()`,

  "app-quiz": `import skui as ui

questions = [
    {"q": "ما ناتج 6 × 7؟", "options": ["36", "42", "48"], "answer": "42"},
    {"q": "ما ناتج 9 + 8؟", "options": ["15", "16", "17"], "answer": "17"},
    {"q": "ما ناتج 12 ÷ 3؟", "options": ["3", "4", "6"], "answer": "4"},
]
index = [0]
score = [0]

app = ui.App(title="اختبار قصير", theme="modern", appearance="dark", width="460px")
guide = ui.Guide(title="اختبر نفسك", message="أجب عن الأسئلة ثم شاهد نتيجتك النهائية.", character="assistant")
progress = ui.Progress(value=0, max=len(questions))
question = ui.Text("")
answer = ui.Select(options=questions[0]["options"])
msg = ui.Alert(text="اختر إجابة ثم اضغط التالي", variant="info")
result = ui.Text("")

def show_question():
    i = index[0]
    if i >= len(questions):
        question.set_text("انتهى الاختبار")
        result.set_text("نتيجتك: " + str(score[0]) + " من " + str(len(questions)))
        msg.set_text("أحسنت! يمكنك إعادة المحاولة.")
        progress.set_value(len(questions))
        return
    q = questions[i]
    question.set_text((i + 1).__str__() + ") " + q["q"])
    answer = ui.Select(options=q["options"])
    progress.set_value(i)
    msg.set_text("اختر إجابة")
    result.set_text("")

def next_q():
    i = index[0]
    if i >= len(questions):
        return
    chosen = answer.value()
    if chosen == questions[i]["answer"]:
        score[0] += 1
        msg.set_text("إجابة صحيحة")
    else:
        msg.set_text("إجابة غير صحيحة")
    index[0] += 1
    if index[0] >= len(questions):
        show_question()
    else:
        q = questions[index[0]]
        question.set_text(str(index[0] + 1) + ") " + q["q"])
        progress.set_value(index[0])

def retry():
    index[0] = 0
    score[0] = 0
    question.set_text("1) " + questions[0]["q"])
    progress.set_value(0)
    msg.set_text("ابدأ من جديد")
    result.set_text("")

question.set_text("1) " + questions[0]["q"])
app.add(guide)
app.add(ui.Heading(text="اختبار سريع", level=1))
app.add(progress)
app.add(question)
app.add(answer)
app.add(ui.Button(text="التالي", variant="primary", depth="raised", on_click=next_q))
app.add(ui.Button(text="إعادة المحاولة", variant="secondary", on_click=retry))
app.add(msg)
app.add(result)
app.run()`,

  "app-timer": `import skui as ui

remaining = [30]
running = [False]

app = ui.App(title="مؤقت التركيز", theme="modern", appearance="dark", width="400px")
guide = ui.Guide(title="ركّز الآن", message="اضبط الثواني ثم شغّل المؤقت. سيظهر تنبيه عند الانتهاء.", character="assistant")
display = ui.Text("30")
bar = ui.Progress(value=30, max=30)
msg = ui.Alert(text="اضغط تشغيل للبدء", variant="info")
timer = ui.Timer(interval=1000, running=False)

def tick(count):
    if not running[0]:
        return
    if remaining[0] <= 0:
        running[0] = False
        timer.set_disabled(True)
        msg.set_text("انتهى الوقت!")
        display.set_text("0")
        return
    remaining[0] -= 1
    display.set_text(str(remaining[0]))
    bar.set_value(remaining[0])
    if remaining[0] == 0:
        running[0] = False
        msg.set_text("انتهى الوقت! أحسنت.")

def start():
    running[0] = True
    msg.set_text("المؤقت يعمل…")

def pause():
    running[0] = False
    msg.set_text("تم الإيقاف مؤقتًا")

def reset():
    running[0] = False
    remaining[0] = 30
    display.set_text("30")
    bar.set_value(30)
    msg.set_text("تمت إعادة الضبط")

timer = ui.Timer(interval=1000, running=True, on_change=tick)
row = ui.Row(gap="0.5rem")
row.add(ui.Button(text="تشغيل", variant="success", depth="raised", on_click=start))
row.add(ui.Button(text="إيقاف", variant="danger", depth="raised", on_click=pause))
row.add(ui.Button(text="إعادة ضبط", variant="secondary", on_click=reset))
app.add(guide)
app.add(ui.Heading(text="مؤقت 30 ثانية", level=1))
app.add(display)
app.add(bar)
app.add(row)
app.add(msg)
app.add(timer)
app.run()`,

  "app-dashboard": `import skui as ui

app = ui.App(title="لوحة بيانات", theme="modern", appearance="dark", width="560px")
guide = ui.Guide(title="لوحة المتابعة", message="راجع المؤشرات والمخطط. اضغط تحديث لتغيير البيانات.", character="assistant")
grid = ui.Grid(columns=3, gap="0.75rem")
c1 = ui.Card(padding="0.9rem")
c1.add(ui.Badge(text="الطلاب"))
c1.add(ui.Heading(text="128", level=2))
c1.add(ui.Progress(value=72, max=100))
c2 = ui.Card(padding="0.9rem")
c2.add(ui.Badge(text="المشروعات"))
c2.add(ui.Heading(text="54", level=2))
c2.add(ui.Progress(value=54, max=100))
c3 = ui.Card(padding="0.9rem")
c3.add(ui.Badge(text="الإنجاز"))
c3.add(ui.Heading(text="86%", level=2))
c3.add(ui.Progress(value=86, max=100))
grid.add(c1)
grid.add(c2)
grid.add(c3)
chart = ui.Chart(data=[12, 18, 9, 22, 15, 28], labels=["س", "ح", "ث", "ر", "خ", "ج"])
msg = ui.Alert(text="بيانات هذا الأسبوع", variant="info")

def refresh():
    chart.set_data([14, 20, 11, 25, 17, 30])
    msg.set_text("تم تحديث البيانات")

app.add(guide)
app.add(ui.Heading(text="لوحة بسيطة", level=1))
app.add(grid)
app.add(chart)
app.add(ui.Button(text="تحديث", variant="primary", depth="raised", on_click=refresh))
app.add(msg)
app.run()`,

  "app-colors": `import skui as ui

app = ui.App(title="استوديو الألوان", theme="modern", appearance="dark", width="460px")
guide = ui.Guide(title="اصنع لونك", message="حرّك منزلقات RGB وشاهد المعاينة وقيمة HEX فورًا.", character="assistant")
r = ui.Slider(value=124, min=0, max=255)
g = ui.Slider(value=58, min=0, max=255)
b = ui.Slider(value=237, min=0, max=255)
preview = ui.Card(padding="2rem", border_radius="1.2rem", background="#7c3aed")
hex_text = ui.Text("#7C3AED")
msg = ui.Alert(text="حرّك المنزلقات", variant="info")

def to_hex(n):
    h = hex(int(n))[2:].upper()
    if len(h) < 2:
        h = "0" + h
    return h

def update(value):
    rr = int(r.value())
    gg = int(g.value())
    bb = int(b.value())
    color = "#" + to_hex(rr) + to_hex(gg) + to_hex(bb)
    preview.set_background(color)
    hex_text.set_text(color)
    msg.set_text("RGB(" + str(rr) + ", " + str(gg) + ", " + str(bb) + ")")

r = ui.Slider(value=124, min=0, max=255, on_input=update)
g = ui.Slider(value=58, min=0, max=255, on_input=update)
b = ui.Slider(value=237, min=0, max=255, on_input=update)

app.add(guide)
app.add(ui.Heading(text="ألوان RGB", level=1))
app.add(ui.Text("أحمر"))
app.add(r)
app.add(ui.Text("أخضر"))
app.add(g)
app.add(ui.Text("أزرق"))
app.add(b)
app.add(preview)
app.add(hex_text)
app.add(msg)
app.run()`,

  "app-canvas-demo": `import skui as ui

app = ui.App(title="لعبة Canvas", theme="modern", appearance="dark", width="520px")
guide = ui.Guide(title="حرّك الشكل", message="اضغط تحريك لجمع النقاط. أعد التشغيل لجولة جديدة.", character="assistant")
canvas = ui.Canvas(width=420, height=240)
score = [0]
x = [40]
y = [100]
status = ui.Text("النقاط: 0")

def draw():
    canvas.clear()
    canvas.draw_rect(x[0], y[0], 40, 40, "#22d3ee")
    canvas.draw_rect(300, 80, 30, 30, "#f59e0b")
    canvas.draw_text("النقاط: " + str(score[0]), 12, 28, "#111827", 18)
    status.set_text("النقاط: " + str(score[0]))

def move():
    x[0] += 24
    if x[0] > 360:
        x[0] = 20
    if abs(x[0] - 300) < 36 and abs(y[0] - 80) < 36:
        score[0] += 1
    draw()

def reset():
    score[0] = 0
    x[0] = 40
    y[0] = 100
    draw()

draw()
row = ui.Row(gap="0.5rem")
row.add(ui.Button(text="تحريك", variant="primary", depth="raised", on_click=move))
row.add(ui.Button(text="إعادة تشغيل", variant="secondary", on_click=reset))
app.add(guide)
app.add(ui.Heading(text="مطاردة النقاط", level=1))
app.add(canvas)
app.add(row)
app.add(status)
app.run()`,

  "app-linear-search": `import skui as ui

numbers = [4, 8, 15, 16, 23, 42]
app = ui.App(title="البحث الخطي", theme="modern", appearance="dark", width="460px")
guide = ui.Guide(title="خوارزمية البحث", message="أدخل قيمة ليُفحص كل عنصر بالترتيب حتى يُوجد أو تنتهي القائمة.", character="assistant")
target = ui.Input(placeholder="العدد المطلوب")
steps = ui.List(items=[])
result = ui.Alert(text="القائمة: " + str(numbers), variant="info")

def search():
    try:
        value = int(str(target.value()).strip())
    except:
        result.set_text("أدخل عددًا صحيحًا")
        return
    log = []
    found = -1
    for i, n in enumerate(numbers):
        log.append("فحص الموقع " + str(i) + " → " + str(n))
        if n == value:
            found = i
            break
    steps.set_items(log)
    if found >= 0:
        result.set_text("وُجد في الموقع " + str(found))
    else:
        result.set_text("غير موجود في القائمة")

app.add(guide)
app.add(ui.Heading(text="محاكاة البحث الخطي", level=1))
app.add(ui.Badge(text=str(numbers)))
app.add(target)
app.add(ui.Button(text="ابحث", variant="primary", depth="raised", on_click=search))
app.add(steps)
app.add(result)
app.run()`,

  "app-caesar": `import skui as ui

app = ui.App(title="تشفير قيصر", theme="modern", appearance="dark", width="480px")
guide = ui.Guide(title="شفرة قيصر", message="اكتب نصًا إنجليزيًا واضبط الإزاحة ثم شفّر أو افك التشفير.", character="assistant")
plain = ui.Input(placeholder="نص إنجليزي")
shift = ui.Slider(value=3, min=1, max=25)
result = ui.Alert(text="الناتج سيظهر هنا", variant="info")

def transform(text, key, decrypt):
    output = ""
    k = -key if decrypt else key
    for char in text:
        if "a" <= char.lower() <= "z":
            base = ord("A") if char.isupper() else ord("a")
            output += chr((ord(char) - base + k) % 26 + base)
        else:
            output += char
    return output

def encrypt():
    result.set_text(transform(plain.value(), int(shift.value()), False))

def decrypt():
    result.set_text(transform(plain.value(), int(shift.value()), True))

row = ui.Row(gap="0.5rem")
row.add(ui.Button(text="تشفير", variant="primary", depth="raised", on_click=encrypt))
row.add(ui.Button(text="فك التشفير", variant="secondary", depth="raised", on_click=decrypt))
app.add(guide)
app.add(ui.Heading(text="برنامج التشفير", level=1))
app.add(plain)
app.add(ui.Text("مفتاح الإزاحة"))
app.add(shift)
app.add(row)
app.add(result)
app.run()`,

  "app-edu-game": `import random
import skui as ui

score = [0]
a = [2]
b = [3]

app = ui.App(title="لعبة تعليمية", theme="modern", appearance="dark", width="440px")
guide = ui.Guide(title="تحدَّ نفسك", message="أجب عن أسئلة الضرب واجمع النقاط.", character="assistant")
question = ui.Text("كم يساوي 2 × 3؟")
answer = ui.Input(placeholder="إجابتك")
progress = ui.Progress(value=0, max=10)
msg = ui.Alert(text="أجب ثم تحقق", variant="info")
points = ui.Badge(text="النقاط: 0")

def new_q():
    a[0] = random.randint(2, 9)
    b[0] = random.randint(2, 9)
    question.set_text("كم يساوي " + str(a[0]) + " × " + str(b[0]) + "؟")
    answer.set_value("")
    msg.set_text("أجب ثم تحقق")

def check():
    try:
        value = int(str(answer.value()).strip())
    except:
        msg.set_text("أدخل رقمًا")
        return
    if value == a[0] * b[0]:
        score[0] += 1
        msg.set_text("صحيح!")
    else:
        msg.set_text("خطأ — الناتج " + str(a[0] * b[0]))
    points.set_text("النقاط: " + str(score[0]))
    progress.set_value(min(score[0], 10))
    new_q()

app.add(guide)
app.add(ui.Heading(text="مسابقة الضرب", level=1))
app.add(points)
app.add(progress)
app.add(question)
app.add(answer)
app.add(ui.Button(text="تحقق", variant="success", depth="raised", on_click=check))
app.add(ui.Button(text="سؤال جديد", variant="ghost", on_click=new_q))
app.add(msg)
app.run()`,

  "app-number-convert": `import skui as ui

app = ui.App(title="محول أنظمة العد", theme="modern", appearance="dark", width="440px")
guide = ui.Guide(title="عشري ↔ ثنائي", message="أدخل عددًا عشريًا موجبًا ثم حوّله إلى ثنائي.", character="assistant")
number = ui.Input(placeholder="عدد عشري")
result = ui.Alert(text="أدخل عددًا ثم اضغط تحويل", variant="info")

def convert():
    try:
        value = int(str(number.value()).strip())
        if value < 0:
            result.set_text("أدخل عددًا موجبًا")
            return
        result.set_text("الثنائي: " + bin(value)[2:])
    except Exception:
        result.set_text("أدخل عددًا صحيحًا موجبًا")

app.add(guide)
app.add(ui.Heading(text="تحويل أنظمة العد", level=1))
app.add(number)
app.add(ui.Button(text="تحويل", variant="primary", depth="raised", on_click=convert))
app.add(result)
app.run()`,
};

export function getSkuiDemoApp(projectId) {
  return SKUI_DEMO_APPS[projectId] || null;
}
