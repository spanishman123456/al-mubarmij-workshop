/** أكواد تشغيل لاختبارات E2E فقط — ليست حزمة طالب */
export const E2E_WELCOME_APP = `import skui as ui
app = ui.App(title="مثالي الأول", theme="modern", appearance="dark")
guide = ui.Guide(title="مرحبًا بك", message="اكتب اسمك ثم اضغط تشغيل.", character="assistant")
name = ui.Input(placeholder="اكتب اسمك")
msg = ui.Alert(text="جاهز", variant="info")

def run():
    msg.set_text("مرحبًا " + name.value())

app.add(guide)
app.add(name)
app.add(ui.Button(text="تشغيل", variant="primary", depth="raised", on_click=run))
app.add(msg)
app.run()`;

export const E2E_CALCULATOR_APP = `import skui as ui
app = ui.App(title="آلة حاسبة حديثة", theme="modern", appearance="dark", width="420px", direction="ltr")
guide = ui.Guide(title="مرحبًا بك في الآلة الحاسبة", message="استخدم الأزرار.", character="assistant")
panel = ui.Card(padding="1rem", border_radius="1.5rem", background="#0b1224")
history = ui.Text("احسب بسرعة")
status = ui.Alert(text="تم الحساب بنجاح", variant="info")
expr = [""]
op = [""]
left = [None]

def set_display(text):
    display.set_value(str(text))

def append_digit(d):
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
            left[0] = float(expr[0])
        op[0] = symbol
        expr[0] = ""
        set_display(str(left[0]) + " " + symbol)
    return press

def clear_all():
    expr[0] = ""
    op[0] = ""
    left[0] = None
    set_display("")

def backspace():
    expr[0] = expr[0][:-1]
    set_display(expr[0])

def calculate():
    if left[0] is None or op[0] == "" or expr[0] == "":
        status.set_text("أدخل عملية كاملة")
        return
    right = float(expr[0])
    a = left[0]
    b = right
    symbol = op[0]
    if symbol == "+":
        answer = a + b
    elif symbol == "-":
        answer = a - b
    elif symbol == "×":
        answer = a * b
    else:
        if b == 0:
            status.set_text("خطأ: لا يمكن القسمة على صفر")
            return
        answer = a / b
    set_display(str(answer))
    status.set_text("تم الحساب بنجاح")
    history.set_text("احسب بسرعة")
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
app.run()`;

export const E2E_EXAMPLES = [
  { id: "welcome", code: E2E_WELCOME_APP },
  { id: "calculator", code: E2E_CALCULATOR_APP },
];
