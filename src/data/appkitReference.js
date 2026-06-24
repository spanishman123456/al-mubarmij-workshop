export const APPKIT_COMMANDS = [
  { sig: 'appkit.title("العنوان")', desc: "عنوان البرنامج في أعلى الواجهة" },
  { sig: 'appkit.text("نص توضيحي")', desc: "سطر نصي للشرح" },
  { sig: 'appkit.input("id", "التسمية", "افتراضي")', desc: "مربع إدخال نص" },
  { sig: 'appkit.number_input("id", "التسمية", "0")', desc: "مربع إدخال رقم" },
  { sig: 'appkit.output("id", "التسمية")', desc: "منطقة عرض نتيجة" },
  { sig: 'appkit.button("id", "نص الزر")', desc: "زر تفاعلي" },
  { sig: 'appkit.get("id")', desc: "قراءة قيمة حقل إدخال" },
  { sig: 'appkit.set("id", "النص")', desc: "تحديث منطقة النتيجة" },
  { sig: "appkit.on_click(\"id\", دالة)", desc: "ربط زر بدالة عند الضغط" },
  { sig: 'appkit.canvas("id", عرض, ارتفاع)', desc: "مساحة رسم" },
  { sig: "appkit.draw_rect(...)", desc: "رسم مستطيل على Canvas" },
  { sig: "appkit.draw_text(...)", desc: "كتابة نص على Canvas" },
  { sig: "appkit.build()", desc: "إنهاء بناء الواجهة — ضعه في آخر الكود" },
];

export const APPKIT_MINIMAL_EXAMPLE = `import appkit

appkit.title("مثالي الأول")
appkit.text("مرحبًا! هذا مثال يعمل في App Mode")
appkit.input("name", "اسمك", "طالب")
appkit.button("hi", "قل مرحبًا")
appkit.output("msg", "النتيجة")

def on_hi():
    n = appkit.get("name")
    appkit.set("msg", "مرحبًا " + n + "!")

appkit.on_click("hi", on_hi)
appkit.build()`;
