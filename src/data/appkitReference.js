export const APPKIT_COMMANDS = [
  { sig: 'ui.App(title="تطبيقي")', desc: "إنشاء التطبيق الرئيسي" },
  { sig: 'ui.Column(gap="1rem")', desc: "ترتيب المكونات عموديًا" },
  { sig: 'ui.Row(gap="1rem")', desc: "ترتيب المكونات أفقيًا" },
  { sig: 'ui.Text("نص")', desc: "نص قابل للتحديث عبر set_text" },
  { sig: 'ui.Heading(text="عنوان", level=1)', desc: "عنوان من المستوى 1 إلى 6" },
  { sig: 'ui.Input(placeholder="اكتب")', desc: "حقل إدخال تُقرأ قيمته عبر value()" },
  { sig: 'ui.Button(text="تشغيل", on_click=دالة)', desc: "زر مرتبط بدالة Python" },
  { sig: "widget.set_text(value)", desc: "تحديث النص مباشرة" },
  { sig: "widget.set_value(value)", desc: "تحديث قيمة المكوّن" },
  { sig: "app.add(widget)", desc: "إضافة مكوّن إلى التطبيق" },
  { sig: "app.run()", desc: "عرض التطبيق في المعاينة" },
];

export const APPKIT_MINIMAL_EXAMPLE = `import skui as ui

app = ui.App(title="تطبيقي الأول", width=520, height=380)
title = ui.Heading(text="مرحبًا بك", level=1)
name_input = ui.Input(placeholder="اكتب اسمك")
message = ui.Text("")

def welcome():
    name = name_input.value()
    message.set_text("مرحبًا " + name)

button = ui.Button(text="تشغيل", variant="primary", on_click=welcome)
app.add(title)
app.add(name_input)
app.add(button)
app.add(message)
app.run()`;
