import { APPKIT_MINIMAL_EXAMPLE } from "./appkitReference.js";

export const SKUI_EXAMPLES = [
  { id: "welcome", titleAr: "تطبيق ترحيب", code: APPKIT_MINIMAL_EXAMPLE },
  {
    id: "calculator",
    titleAr: "آلة حاسبة",
    code: `import skui as ui
app = ui.App(title="آلة حاسبة")
a = ui.Input(placeholder="العدد الأول")
b = ui.Input(placeholder="العدد الثاني")
result = ui.Alert(text="النتيجة")
def calculate():
    result.set_text(str(float(a.value()) + float(b.value())))
app.add(ui.Heading(text="الجمع"))
app.add(a)
app.add(b)
app.add(ui.Button(text="احسب", on_click=calculate))
app.add(result)
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
