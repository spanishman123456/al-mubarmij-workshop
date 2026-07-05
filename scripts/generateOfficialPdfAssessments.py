# -*- coding: utf-8 -*-
"""Generate official pre/post assessment banks from Mawhiba PDF structure."""
import json
import os

OUT = os.path.join(
    os.path.dirname(__file__),
    "..",
    "src",
    "data",
    "officialPdfAssessments.js",
)


def q(id_, order, question_ar, qtype="mcq", **kw):
    item = {
        "id": id_,
        "pdfOrder": order,
        "type": qtype,
        "questionAr": question_ar,
        "explainAr": kw.get("explainAr", "من التقويم الرسمي — ملف PDF المعتمد."),
    }
    for k in (
        "optionsAr", "correctIndex", "correctAnswer", "acceptAnswers", "codeSnippetAr",
        "matchLeft", "matchRight", "correctPairs", "orderItems", "correctOrder",
        "instructionAr", "lessonLink", "modelAnswerAr",
        "logicExpr", "logicExprDisplay", "varCount", "resultOnly",
        "cardValues", "target", "targets", "baseLabel",
        "correctFlow", "flowSlots", "flowMatchSymbols", "flowRoleOptions",
        "circuitPreset", "circuitGate", "expectedOutputs", "allowedGates",
    ):
        if k in kw:
            item[k] = kw[k]
    return item


def build_pre():
    items = []
    o = 1

    # ── سؤال 1 ──
    items.append(
        q(
            "pre-01a",
            o,
            "سؤال 1-أ: حوِّل العدد 42 (من نظام الأرقام العشري) إلى نظام الأرقام الثنائي.",
            "fill",
            correctAnswer="101010",
            acceptAnswers=["101010", "101010₂"],
        )
    )
    o += 1
    items.append(
        q(
            "pre-01b",
            o,
            "سؤال 1-ب: حوِّل العدد 100101 (من نظام الأرقام الثنائي) إلى نظام الأرقام العشري.",
            "fill",
            correctAnswer="37",
            acceptAnswers=["37"],
        )
    )
    o += 1
    items.append(
        q(
            "pre-01c",
            o,
            "سؤال 1-ج: حوِّل العدد 101101010110 (من نظام الأرقام الثنائي) إلى نظام الأرقام الست عشري.",
            "fill",
            correctAnswer="B56",
            acceptAnswers=["B56", "b56"],
        )
    )
    o += 1
    items.append(
        q(
            "pre-01d",
            o,
            "سؤال 1-د: حوِّل الحرف EF (من نظام الأرقام الست عشري) إلى نظام الأرقام العشري.",
            "fill",
            correctAnswer="239",
            acceptAnswers=["239"],
        )
    )
    o += 1

    # ── سؤال 2 ──
    items.append(
        q(
            "pre-02a",
            o,
            "سؤال 2-أ: نفِّذ جمع الأعداد التالية في نظام الأرقام الثنائي:\n001010111 + 11010101",
            "fill",
            correctAnswer="1000001100",
            acceptAnswers=["1000001100", "1000001100₂"],
        )
    )
    o += 1
    items.append(
        q(
            "pre-02b",
            o,
            "سؤال 2-ب: نفِّذ جمع الأعداد التالية في نظام الأرقام الست عشري:\n5A7 + 2B4",
            "fill",
            correctAnswer="85B",
            acceptAnswers=["85B", "85b"],
        )
    )
    o += 1

    # ── سؤال 3 ──
    items.append(
        q(
            "pre-03a",
            o,
            "سؤال 3-أ: مثِّل العدد −41 بالنظام المكمّل للعدد (2's complement) بثماني خانات ثنائية.",
            "fill",
            correctAnswer="11010111",
            acceptAnswers=["11010111"],
        )
    )
    o += 1
    items.append(
        q(
            "pre-03b",
            o,
            "سؤال 3-ب: مثِّل العدد 41 بالنظام المكمّل للعدد (2's complement) بثماني خانات ثنائية.",
            "fill",
            correctAnswer="00101001",
            acceptAnswers=["00101001"],
        )
    )
    o += 1
    items.append(
        q(
            "pre-03c",
            o,
            "سؤال 3-ج: مثِّل العدد −1 بالنظام المكمّل للعدد (2's complement) بثماني خانات ثنائية.",
            "fill",
            correctAnswer="11111111",
            acceptAnswers=["11111111"],
        )
    )
    o += 1

    # ── سؤال 4 ──
    items.append(
        q(
            "pre-04",
            o,
            "سؤال 4: أكمل جدول الحقيقة لتمثيل العبارة المنطقية: (¬p ∧ q) ∨ r",
            "truth-table",
            logicExpr="(NOT p AND q) OR r",
            logicExprDisplay="(¬p ∧ q) ∨ r",
            varCount=3,
            resultOnly=True,
            instructionAr="عبّئ عمود الناتج F لكل صف — استخدم 0 أو 1.",
            explainAr="8 صفوف — الناتج = (NOT p AND q) OR r.",
            lessonLink="/lessons/truth-tables",
        )
    )
    o += 1

    items.append(
        q(
            "pre-logic-and",
            o,
            "سؤال 4-ب: ابْنِ دارة منطقية ببوابة AND — وصّل A و B إلى المصباح (OUT).",
            "logic-circuit",
            circuitPreset="ab-out",
            circuitGate="AND",
            expectedOutputs=[False, False, False, True],
            allowedGates=["AND", "NOT", "OR", "XOR", "NAND", "NOR", "XNOR"],
            instructionAr="أضف بوابة AND ووصّل المدخلين A و B بالمخرج. جرّب قيم 0/1 قبل الإرسال.",
            explainAr="AND: المخرج 1 فقط عندما A=1 و B=1 — جدول 0001.",
            lessonLink="/simulations#circuit",
        )
    )
    o += 1
    items.append(
        q(
            "pre-logic-or",
            o,
            "سؤال 4-ج: ابْنِ دارة منطقية ببوابة OR — وصّل A و B إلى المصباح (OUT).",
            "logic-circuit",
            circuitPreset="ab-out",
            circuitGate="OR",
            expectedOutputs=[False, True, True, True],
            allowedGates=["OR", "AND", "NOT", "XOR", "NOR", "XNOR", "NAND"],
            instructionAr="أضف بوابة OR ووصّل A و B بالمخرج.",
            explainAr="OR: المخرج 1 إذا كان A أو B = 1 — جدول 0111.",
            lessonLink="/simulations#circuit",
        )
    )
    o += 1
    items.append(
        q(
            "pre-logic-not",
            o,
            "سؤال 4-د: ابْنِ دارة ببوابة NOT — وصّل A إلى المصباح (OUT).",
            "logic-circuit",
            circuitPreset="a-out",
            circuitGate="NOT",
            expectedOutputs=[True, False],
            allowedGates=["NOT", "AND", "OR", "XOR"],
            instructionAr="أضف بوابة NOT بين المدخل A والمخرج.",
            explainAr="NOT يعكس A: 0→1 و 1→0.",
            lessonLink="/simulations#circuit",
        )
    )
    o += 1

    # ── سؤال 5 ──
    for label, term in [
        ("أ", "الخوارزمية"),
        ("ب", "المكونات المادية"),
        ("ج", "المكونات البرمجية"),
        ("د", "نظام التشغيل"),
    ]:
        items.append(
            q(
                f"pre-05{label}",
                o,
                f"سؤال 5-{label}: عرِّف المصطلح «{term}» كما ورد في المنهج.",
                "essay",
            )
        )
        o += 1

    # ── ترتيب خطوات خوارزمية ──
    items.append(
        q(
            "pre-algo-order",
            o,
            "سؤال ترتيب: رتّب خطوات خوارزمية «قراءة عددين وطباعة المجموع».",
            "order",
            orderItems=["بداية البرنامج", "قراءة العددين", "جمع العددين", "طباعة النتيجة", "نهاية البرنامج"],
            correctOrder=[0, 1, 2, 3, 4],
            instructionAr="استخدم أزرار ↑ ↓ لترتيب الخطوات من البداية إلى النهاية.",
            explainAr="الترتيب الصحيح: بداية → قراءة → جمع → طباعة → نهاية.",
            lessonLink="/lessons/algorithms",
        )
    )
    o += 1

    # ── سؤال 6 ──
    items.append(
        q(
            "pre-06a",
            o,
            "سؤال 6-أ: ما وظيفة وحدة المعالجة المركزية (CPU)؟",
            "mcq",
            optionsAr=[
                "تخزين الملفات على القرص",
                "تنفيذ التعليمات الموجودة في البرامج",
                "عرض الصور على الشاشة فقط",
                "تشغيل الإنترنت",
            ],
            correctIndex=1,
        )
    )
    o += 1
    items.append(
        q(
            "pre-06b",
            o,
            "سؤال 6-ب: ما وظيفة الذاكرة المؤقتة (Cache)؟",
            "mcq",
            optionsAr=[
                "تقليل زمن الوصول للبيانات المستخدمة بكثرة",
                "طباعة النصوص",
                "حذف الفيروسات",
                "تخزين دائم للملفات",
            ],
            correctIndex=0,
        )
    )
    o += 1
    items.append(
        q(
            "pre-06c",
            o,
            "سؤال 6-ج: ما وظيفة ذاكرة الوصول العشوائي (RAM)؟",
            "mcq",
            optionsAr=[
                "تخزين البرامج والبيانات أثناء التشغيل",
                "تبريد المعالج",
                "تحويل الأعداد إلى ثنائي",
                "تشفير الشبكة",
            ],
            correctIndex=0,
        )
    )
    o += 1
    items.append(
        q(
            "pre-06d",
            o,
            "سؤال 6-د: ما وظيفة القرص الصلب (HDD)؟",
            "mcq",
            optionsAr=[
                "تخزين الملفات بشكل دائم",
                "تنفيذ العمليات الحسابية فقط",
                "إرسال البريد",
                "عرض جداول الحقيقة",
            ],
            correctIndex=0,
        )
    )
    o += 1

    # ── سؤال 7 ──
    items.append(
        q(
            "pre-07",
            o,
            "سؤال 7: كيف يمكن تمثيل الخانات الثنائية (bits) تمثيلاً حقيقياً في جهاز الحاسب؟",
            "essay",
        )
    )
    o += 1

    # ── سؤال 8 ──
    items.append(
        q(
            "pre-08",
            o,
            "سؤال 8: ما الإجراء الذي يهدف إلى البحث في قائمة A وإخراج أكبر قيمة فيها؟",
            "mcq",
            optionsAr=[
                "فرز القائمة تصاعدياً فقط",
                "البحث عن أكبر عنصر في القائمة",
                "حذف جميع العناصر",
                "تحويل القائمة إلى نص",
            ],
            correctIndex=1,
        )
    )
    o += 1

    # ── سؤال 9 ──
    items.append(
        q(
            "pre-09",
            o,
            "سؤال 9: اكتب برنامجاً قصيراً بلغة بايثون يطلب من المستخدم إدخال أعداد حتى يُدخل صفراً، ثم يحسب متوسط الأعداد المدخلة جميعها ما عدا الصفر.",
            "code",
        )
    )
    o += 1

    # ── سؤال 10 ──
    items.append(
        q(
            "pre-10",
            o,
            "سؤال 10: بيِّن بإيجاز أوجه الاختلاف بين حقوق التأليف وبراءات الاختراع.",
            "essay",
        )
    )
    o += 1

    # ── سؤال 11 ──
    items.append(
        q(
            "pre-11",
            o,
            "سؤال 11: سمِّ ثلاث خوارزميات فرز وبيِّن الفرق بينها بإيجاز (الفرز بالاختيار، الإدراج، الفقاعات).",
            "essay",
        )
    )
    o += 1

    # ── سؤال 12 ──
    items.append(
        q(
            "pre-12",
            o,
            "سؤال 12: اكتب خوارزمية معاودة (Recursion) لحساب n! باستخدام عملية المعاودة، مبيّناً حالة القاعدة وحالة المعاودة.",
            "code",
        )
    )
    o += 1

    # ── سؤال 13 ──
    items.append(
        q(
            "pre-13a",
            o,
            "سؤال 13: أي نوع من التكرار في بايثون يسهّل كتابة حلقة لا نهائية؟",
            "mcq",
            optionsAr=["for فقط", "while", "if", "import"],
            correctIndex=1,
        )
    )
    o += 1
    items.append(
        q(
            "pre-13b",
            o,
            "سؤال 13-ب: حلقة for في بايثون تنفّذ مجموعة تعليمات بشكل متكرر وفق تسلسل محدد.",
            "truefalse",
            optionsAr=["صح", "خطأ"],
            correctIndex=0,
        )
    )
    o += 1

    # ── سؤال 14 ──
    items.append(
        q(
            "pre-14",
            o,
            "سؤال 14: ماذا يستفاد من البرنامج الآتي؟ (يطبع نمطاً من النجوم متزايداً ثم متناقصاً)",
            "essay",
            codeSnippetAr=(
                'num1 = int(input("Enter a number: "))\n'
                "for x in range(1, num1 + 1):\n"
                '    print("*" * x)\n'
                "for x in range(num1 - 1, 0, -1):\n"
                '    print("*" * x)'
            ),
        )
    )
    o += 1

    # ── سؤال 15 ──
    items.append(
        q(
            "pre-15",
            o,
            "سؤال 15: صِف مسار أويلر (Euler Path) يبدأ بالرقم 1 ويعطي كل زاوية رقماً صحيحاً متزايداً.",
            "essay",
            instructionAr="اكتب تسلسل الأرقام على الحواف داخل المنصة — لا حاجة لرسم خارجي.",
        )
    )
    o += 1

    # ── سؤال 16 ──
    items.append(
        q(
            "pre-16a",
            o,
            "سؤال 16: باستخدام خوارزمية جدولة FCFS، احسب متوسط وقت الانتظار للعمليات:\n"
            "العملية 1: وقت الوصول 2، وقت الخدمة 3\n"
            "العملية 2: وقت الوصول 4، وقت الخدمة 4\n"
            "العملية 3: وقت الوصول 2، وقت الخدمة 7\n"
            "العملية 4: وقت الوصول 11، وقت الخدمة 5\n"
            "العملية 5: وقت الوصول 15، وقت الخدمة 3",
            "fill",
            correctAnswer="0.8",
            acceptAnswers=["0.8", "0,8"],
            explainAr="متوسط وقت الانتظار حسب نموذج الإجابة في PDF.",
        )
    )
    o += 1
    items.append(
        q(
            "pre-16b",
            o,
            "سؤال 16-ب: احسب متوسط وقت الدوران (Turnaround) لنفس العمليات في سؤال FCFS أعلاه.",
            "fill",
            correctAnswer="4.2",
            acceptAnswers=["4.2", "4,2"],
        )
    )
    o += 1

    # ── سؤال 17 ──
    items.append(
        q(
            "pre-17",
            o,
            "سؤال 17: استخدم خريطة كارنوف لإيجاد مجموع العبارة: (A→C)(B∨C)→(¬A∧B)",
            "essay",
        )
    )
    o += 1

    # ── سؤال 18 ──
    items.append(
        q(
            "pre-18",
            o,
            "سؤال 18: اكتب الخوارزمية والبرنامج اللذين يُستخدمان في حساب القيمة المطلقة لعدد يُدخله المستخدم.",
            "code",
        )
    )
    o += 1
    items.append(
        q(
            "pre-18-flow",
            o,
            "سؤال 18-ب: اختر الرمز المناسب لكل خطوة في مخطط حساب القيمة المطلقة لعدد.",
            "flowchart",
            flowSlots=[
                {"id": "1", "label": "1 — بداية البرنامج"},
                {"id": "2", "label": "2 — قراءة العدد من المستخدم"},
                {"id": "3", "label": "3 — هل العدد سالب؟"},
                {"id": "4", "label": "4 — طباعة القيمة المطلقة"},
                {"id": "5", "label": "5 — نهاية البرنامج"},
            ],
            correctFlow={"1": "oval", "2": "parallelogram", "3": "diamond", "4": "rectangle", "5": "oval"},
            instructionAr="اختر رمز مخطط التدفق المناسب لكل خطوة — داخل المنصة دون رسم خارجي.",
            explainAr="بداية/نهاية = بيضاوي، إدخال = متوازي أضلاع، شرط = معيّن، طباعة = مستطيل.",
            lessonLink="/lessons/algorithms",
        )
    )
    o += 1

    # ── سؤال 19 ──
    items.append(
        q(
            "pre-19",
            o,
            "سؤال 19: اطابق بين رمز مخطط التدفق ووظيفته.",
            "flowchart",
            flowMatchSymbols=[
                {"id": "oval", "label": "البيضاوي", "emoji": "⬭"},
                {"id": "parallelogram", "label": "متوازي الأضلاع", "emoji": "▱"},
                {"id": "diamond", "label": "المعيّن (قرار)", "emoji": "◇"},
                {"id": "rectangle", "label": "المستطيل", "emoji": "▭"},
            ],
            flowRoleOptions=[
                {"id": "start-end", "label": "بداية أو نهاية"},
                {"id": "io", "label": "إدخال أو إخراج"},
                {"id": "decision", "label": "اختبار شرط"},
                {"id": "process", "label": "تنفيذ عملية (طباعة/معالجة)"},
            ],
            correctFlow={
                "oval": "start-end",
                "parallelogram": "io",
                "diamond": "decision",
                "rectangle": "process",
            },
            instructionAr="اختر الوظيفة المناسبة لكل رمز — لا حاجة لرسم خارجي.",
            explainAr="البيضاوي = بداية/نهاية، متوازي الأضلاع = I/O، المعيّن = شرط، المستطيل = عملية.",
            lessonLink="/lessons/algorithms",
        )
    )
    o += 1

    # ── قسم تحويل الأنظمة (صفحة 54 من PDF) ──
    dec_to_bin = [
        (7, "000111"),
        (17, "010001"),
        (32, "100000"),
        (50, "110010"),
        (61, "111101"),
        (22, "010110"),
    ]
    for i, (dec, ans) in enumerate(dec_to_bin, 1):
        items.append(
            q(
                f"pre-bin-d2b-{i}",
                o,
                f"تحويل الأنظمة {i}: حوِّل العدد العشري {dec} إلى ثنائي (6 خانات).",
                "fill",
                correctAnswer=ans,
                acceptAnswers=[ans],
            )
        )
        o += 1

    bin_to_dec = [
        ("101101", "45"),
        ("111111", "63"),
        ("001110", "14"),
        ("011010", "26"),
    ]
    for i, (binv, ans) in enumerate(bin_to_dec, 7):
        items.append(
            q(
                f"pre-bin-b2d-{i}",
                o,
                f"تحويل الأنظمة {i}: حوِّل العدد الثنائي {binv} إلى عشري.",
                "fill",
                correctAnswer=ans,
                acceptAnswers=[ans],
            )
        )
        o += 1

    items.append(
        q(
            "pre-bin-11",
            o,
            "تحويل الأنظمة 11: فسّر قيمة العدد الثنائي 1111111 في نظام الأرقام العشري.",
            "fill",
            correctAnswer="127",
            acceptAnswers=["127"],
        )
    )
    o += 1

    # جدول تحويل الأساس (أساس 11)
    for base_val, digit in [(2, "2"), (3, "3"), (4, "4"), (5, "5"), (6, "6"), (7, "7"), (8, "8")]:
        items.append(
            q(
                f"pre-base11-{base_val}",
                o,
                f"تحويل الأساس: اكتب ما يمثله الرقم {base_val} في نظام أساسه 11 (حسب جدول PDF).",
                "fill",
                correctAnswer=digit,
                acceptAnswers=[digit, str(base_val)],
            )
        )
        o += 1

    # ── مقدمة بايثون (صفحات 62–66) ──
    items.append(
        q(
            "pre-py-01",
            o,
            "بايثون 1: أكمل البرنامج لتحويل 7.87 دولاراً إلى يورو (سعر الصرف 1.3271) مع التقريب لمنزلتين عشريتين.",
            "code",
            codeSnippetAr=(
                "dollars = 7.87\n"
                "# أكمل الكود\n"
                "euros = 0\n"
                "print('The equivalent of', dollars, 'dollars is', '%.2f' % euros, 'euros.')"
            ),
        )
    )
    o += 1
    items.append(
        q(
            "pre-py-02",
            o,
            "بايثون 2: اكتب برنامجاً يطلب مبلغاً بالدولار من المستخدم ويطبع المكافئ باليورو.",
            "code",
        )
    )
    o += 1
    items.append(
        q(
            "pre-py-03",
            o,
            "بايثون 3: حوّل درجة الحرارة 36 فهرنهايت إلى مئوية في البرنامج المعطى.",
            "code",
            codeSnippetAr="f_temp = 36\n# أكمل الكود\nc_temp = \nprint(...)",
        )
    )
    o += 1
    items.append(
        q(
            "pre-py-04",
            o,
            "بايثون 4: احسب عمر شخص (30 سنة و4 أشهر) بالثواني مع افتراض 30 يوماً في الشهر.",
            "code",
            codeSnippetAr="years = 30\nmonths = 4\n# أكمل الكود",
        )
    )
    o += 1
    items.append(
        q(
            "pre-py-05",
            o,
            "بايثون 5: اطلب من المستخدم طولاً وعرضاً لمستطيل واحسب مساحته.",
            "code",
        )
    )
    o += 1
    items.append(
        q(
            "pre-py-06",
            o,
            "بايثون 6: صمّم جملة طباعة تجمع اسمك واسم عائلتك باستخدام المتغيرات وعلامة +.",
            "code",
        )
    )
    o += 1

    # تقسيم السلاسل
    for i, prompt in enumerate(
        [
            "print string1[:7] + string3[-9:] — ما المخرج؟",
            "print string4[:2] + string2[2:3] + ... — ما المخرج؟",
            "print string4[-7:] + string3[2:12] + string2[:4] — ما المخرج؟",
        ],
        1,
    ):
        items.append(
            q(
                f"pre-str-{i}",
                o,
                f"تقسيم السلاسل {i}: {prompt}",
                "fill",
                correctAnswer=["I love football.", "I eat books", "Avenue. favorite Open"][i - 1],
                acceptAnswers=[
                    ["I love football.", "I love football"],
                    ["I eat books", "I eat books."],
                    ["Avenue. favorite Open", "Avenue. favorite Open."],
                ][i - 1],
            )
        )
        o += 1

    # ── أحجية الأرقام الثنائية (صفحات 48–53 من PDF) ──
    puzzle_targets = [8, 12, 15, 19, 21, 26, 31]
    for i, target in enumerate(puzzle_targets, 1):
        items.append(
            q(
                f"pre-puzzle-{i}",
                o,
                f"أحجية الأرقام الثنائية رقم {i}: مثِّل العدد {target} باستخدام بطاقات النظام الثنائي.",
                "binary-cards",
                target=target,
                cardValues=[16, 8, 4, 2, 1],
                instructionAr="اقلب البطاقات حتى يصبح مجموع الظاهر مساويًا للعدد المطلوب.",
                lessonLink="/lessons/binary-cards",
            )
        )
        o += 1

    # ── بطاقات المطابقة للأرقام الثنائية (صفحات 59–60) ──
    letter_matches = [
        ("A", "10"),
        ("B", "5"),
        ("C", "17"),
        ("D", "1"),
        ("E", "7"),
        ("F", "2"),
        ("G", "20"),
        ("H", "4"),
        ("I", "14"),
        ("J", "16"),
        ("K", "3"),
        ("L", "19"),
        ("M", "9"),
        ("N", "6"),
        ("O", "15"),
        ("P", "8"),
        ("Q", "18"),
        ("R", "11"),
        ("S", "13"),
        ("T", "12"),
    ]
    for letter, ans in letter_matches:
        items.append(
            q(
                f"pre-match-{letter}",
                o,
                f"بطاقات المطابقة ({letter}): مثِّل العدد {ans} باستخدام بطاقات النظام الثنائي.",
                "binary-cards",
                target=int(ans),
                cardValues=[16, 8, 4, 2, 1],
                instructionAr="اقلب البطاقات لتمثيل العدد المطلوب.",
                lessonLink="/lessons/binary-cards",
            )
        )
        o += 1

    items.append(
        q(
            "pre-bincard-sheet",
            o,
            "بطاقات نظام الأرقام الثنائي: مثِّل الأعداد 13 و 27 و 31 باستخدام البطاقات.",
            "binary-cards-sheet",
            targets=[13, 27, 31],
            cardValues=[16, 8, 4, 2, 1],
            instructionAr="لكل عدد، اقلب البطاقات حتى يطابق المجموع العدد المطلوب.",
            lessonLink="/lessons/binary-cards",
        )
    )
    o += 1

    ternary_nums = [1, 5, 9, 18, 25, 16, 12, 10, 29, 31, 65, 40, 36, 15, 57]
    for i, n in enumerate(ternary_nums, 1):
        items.append(
            q(
                f"pre-tern-{i}",
                o,
                f"الأساس الثلاثي {i}: مثِّل العدد {n} باستخدام بطاقات الأساس الثلاثي (1، 3، 9، 27، 81).",
                "binary-cards",
                target=n,
                cardValues=[81, 27, 9, 3, 1],
                baseLabel="₃",
                instructionAr="اقلب البطاقات — الظاهرة = 1، المخفية = 0.",
                lessonLink="/lessons/number-systems",
            )
        )
        o += 1

    return items


def build_post():
    """Post-test: الأسئلة 1–19 من PDF البعدي (مطابقة للقبلي مع بيانات FCFS الخاصة بالبعدي)."""
    items = []
    o = 1

    for src in build_pre():
        if any(
            src["id"].startswith(p)
            for p in (
                "pre-bin-",
                "pre-base11-",
                "pre-py-",
                "pre-str-",
                "pre-tern-",
                "pre-puzzle-",
                "pre-match-",
                "pre-bincard-",
            )
        ):
            continue
        if src["id"].startswith("pre-16"):
            continue
        post_item = {**src, "id": src["id"].replace("pre-", "post-", 1), "pdfOrder": o}
        items.append(post_item)
        o += 1

    items.append(
        q(
            "post-16a",
            o,
            "سؤال 16: باستخدام FCFS احسب متوسط وقت الانتظار:\n"
            "العملية 1: وصول 2، خدمة 3 | 2: وصول 4، خدمة 4 | 3: وصول 2، خدمة 7\n"
            "4: وصول 11، خدمة 5 | 5: وصول 15، خدمة 3",
            "fill",
            correctAnswer="0.8",
            acceptAnswers=["0.8", "0,8"],
        )
    )
    o += 1
    items.append(
        q(
            "post-16b",
            o,
            "سؤال 16-ب: احسب متوسط وقت الدوران (Turnaround) لنفس بيانات FCFS أعلاه.",
            "fill",
            correctAnswer="4.2",
            acceptAnswers=["4.2", "4,2"],
        )
    )
    return items


def js_string(s):
    return json.dumps(s, ensure_ascii=False)


def emit(items, name):
    lines = [f"export const {name} = ["]
    for item in items:
        lines.append("  {")
        for k, v in item.items():
            if k == "acceptAnswers":
                lines.append(f"    acceptAnswers: {json.dumps(v, ensure_ascii=False)},")
            elif k == "optionsAr":
                lines.append(f"    optionsAr: {json.dumps(v, ensure_ascii=False)},")
            elif k == "codeSnippetAr":
                lines.append(f"    codeSnippetAr: {js_string(v)},")
            elif isinstance(v, bool):
                lines.append(f"    {k}: {'true' if v else 'false'},")
            elif isinstance(v, (list, dict)):
                lines.append(f"    {k}: {json.dumps(v, ensure_ascii=False)},")
            elif isinstance(v, str):
                lines.append(f"    {k}: {js_string(v)},")
            else:
                lines.append(f"    {k}: {v},")
        lines.append("  },")
    lines.append("];")
    return "\n".join(lines)


def main():
    pre = build_pre()
    post = build_post()
    content = f"""/**
 * أسئلة التقويم القبلي والبعدي — مُستمدة من ملفات PDF الرسمية
 * «الاختبار القبلي برمجة الحاسب» و«الاختبار البعدي برمجة الحاسب»
 * الترتيب محفوظ حسب pdfOrder — لا يُعاد خلط هذه الاختبارات.
 */

{emit(pre, "OFFICIAL_PRE_TEST_QUESTIONS")}

{emit(post, "OFFICIAL_POST_TEST_QUESTIONS")}
"""
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"PRE: {len(pre)} questions")
    print(f"POST: {len(post)} questions")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
