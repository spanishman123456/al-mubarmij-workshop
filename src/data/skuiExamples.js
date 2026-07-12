import { APPKIT_MINIMAL_EXAMPLE } from "./appkitReference.js";

export const SKUI_EXAMPLES = [
  { id: "welcome", titleAr: "تطبيق ترحيب", code: APPKIT_MINIMAL_EXAMPLE },
  {
    id: "calculator",
    titleAr: "آلة حاسبة",
    code: `import skui as ui
app = ui.App(title="آلة حاسبة حديثة", width="480px")
panel = ui.Card(padding="1.25rem", border_radius="1.5rem")
panel.add(ui.Badge(text="SKUI CALCULATOR"))
panel.add(ui.Heading(text="احسب بسرعة", level=1))
history = ui.Text("أدخل عملية حسابية")
display = ui.Input(placeholder="0", value="", size="lg", direction="ltr")
result = ui.Alert(text="النتيجة ستظهر هنا")

def append_symbol(symbol):
    display.set_value(display.value() + symbol)

def make_press(symbol):
    def press():
        append_symbol(symbol)
    return press

def clear():
    display.set_value("")
    history.set_text("تم مسح الشاشة")
    result.set_text("النتيجة ستظهر هنا")

def backspace():
    display.set_value(display.value()[:-1])

def calculate():
    expression = display.value()
    for operator in ["+", "-", "×", "÷"]:
        if operator in expression:
            parts = expression.split(operator)
            if len(parts) != 2 or parts[0] == "" or parts[1] == "":
                break
            first = float(parts[0])
            second = float(parts[1])
            if operator == "+":
                answer = first + second
            elif operator == "-":
                answer = first - second
            elif operator == "×":
                answer = first * second
            else:
                if second == 0:
                    result.set_text("لا يمكن القسمة على صفر")
                    return
                answer = first / second
            history.set_text(expression + " =")
            display.set_value(str(answer))
            result.set_text("تم الحساب بنجاح")
            return
    result.set_text("أدخل عملية مثل 7+5")

panel.add(history)
panel.add(display)
keypad = ui.Grid(columns=4, gap="0.65rem")
keys = ["C", "⌫", "÷", "×", "7", "8", "9", "-", "4", "5", "6", "+", "1", "2", "3", "=", "0", "00", "."]
for key in keys:
    if key == "C":
        button = ui.Button(text=key, variant="danger", on_click=clear)
    elif key == "⌫":
        button = ui.Button(text=key, variant="secondary", on_click=backspace)
    elif key == "=":
        button = ui.Button(text=key, variant="success", on_click=calculate)
    elif key in ["÷", "×", "-", "+"]:
        button = ui.Button(text=key, variant="operator", on_click=make_press(key))
    else:
        button = ui.Button(text=key, variant="ghost", on_click=make_press(key))
    keypad.add(button)
panel.add(keypad)
panel.add(result)
app.add(panel)
app.run()`,
  },
  {
    id: "registration",
    titleAr: "نموذج تسجيل",
    code: `import skui as ui
app = ui.App(title="نموذج تسجيل")
form = ui.Column(gap="1rem")
name = ui.Input(placeholder="الاسم")
email = ui.Input(placeholder="البريد")
message = ui.Text("")
def submit():
    message.set_text("تم حفظ تسجيل " + name.value())
form.add(name)
form.add(email)
form.add(ui.Button(text="تسجيل", on_click=submit))
form.add(message)
app.add(form)
app.run()`,
  },
  {
    id: "todo",
    titleAr: "قائمة مهام",
    code: `import skui as ui
app = ui.App(title="مهامي")
task = ui.Input(placeholder="مهمة جديدة")
items = ui.List(items=[])
tasks = []
def add_task():
    tasks.append(task.value())
    items.set_items(tasks)
app.add(task)
app.add(ui.Button(text="إضافة", on_click=add_task))
app.add(items)
app.run()`,
  },
  {
    id: "quiz",
    titleAr: "اختبار قصير",
    code: `import skui as ui
app = ui.App(title="اختبار قصير")
answer = ui.Select(options=["3", "4", "5"])
result = ui.Alert(text="كم يساوي 2 + 2؟")
def check():
    result.set_text("أحسنت" if answer.value() == "4" else "حاول مرة أخرى")
app.add(result)
app.add(answer)
app.add(ui.Button(text="تحقق", on_click=check))
app.run()`,
  },
  {
    id: "timer",
    titleAr: "مؤقت",
    code: `import skui as ui
app = ui.App(title="المؤقت")
app.add(ui.Timer(value=0, interval=1000, running=True))
app.run()`,
  },
  {
    id: "dashboard",
    titleAr: "لوحة بيانات بسيطة",
    code: `import skui as ui
app = ui.App(title="لوحة البيانات")
grid = ui.Grid(gap="1rem")
grid.add(ui.Card(ui.Heading(text="75%"), ui.Text("التقدم")))
grid.add(ui.Card(ui.Heading(text="12"), ui.Text("المهام")))
grid.add(ui.Chart(data=[4, 8, 5, 10], labels=["أ", "ب", "ج", "د"]))
app.add(grid)
app.run()`,
  },
  {
    id: "colors",
    titleAr: "تطبيق ألوان",
    code: `import skui as ui
app = ui.App(title="الألوان")
color = ui.Select(options=["#7c3aed", "#10b981", "#ef4444"])
card = ui.Card(ui.Text("اختر لونًا"), padding="1rem")
def change():
    card.set_value(color.value())
app.add(color)
app.add(card)
app.run()`,
  },
  {
    id: "canvas-game",
    titleAr: "لعبة Canvas",
    code: `import skui as ui
app = ui.App(title="لعبة الألوان")
canvas = ui.Canvas(width=480, height=280)
canvas.draw_rect(30, 40, 100, 80, "#7c3aed")
canvas.draw_text("skui", 55, 85, "#ffffff", 20)
app.add(canvas)
app.run()`,
  },
];
