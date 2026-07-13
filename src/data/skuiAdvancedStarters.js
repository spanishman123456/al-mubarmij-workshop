/**
 * هياكل الطالب القابلة للتشغيل للمشروعات المتقدمة.
 * تحتوي الواجهة والمراحل فقط، ولا تتضمن خوارزميات الحل أو قيم الإجابات.
 */
export const SKUI_ADVANCED_STARTERS = Object.freeze({
  "advanced-algorithm-lab": `import skui as ui

# المرحلة 1: جهّز بيانات التجربة.
values = [8, 3, 6, 1, 7, 2]
state = {"step": 0, "comparisons": 0}

def next_step():
    # TODO: نفّذ مقارنة أو حركة واحدة ثم حدّث اللوحة.
    state["step"] += 1
    status.set_text("أكمل منطق الخطوة رقم " + str(state["step"]))
    counter.set_value(state["comparisons"])

def reset_experiment():
    state["step"] = 0
    state["comparisons"] = 0
    board.set_text("8 | 3 | 6 | 1 | 7 | 2")
    status.set_text("أعيدت التجربة. أضف خوارزميتك خطوة خطوة.")

app = ui.App(title="مختبر الخوارزميات المرئي", theme="modern", appearance="dark", direction="rtl")
hero = ui.HeroSection(title="مختبر الخوارزميات", subtitle="ابنِ تجربة فرز مرئية قابلة للمقارنة", icon="🧪")
scene = ui.Scene(name="algorithm-lab", layout="workspace")
guide = ui.CharacterGuide(title="مهمة البناء", message="ابدأ بدالة تنشئ خطوات الفرز دون تغيير القائمة الأصلية.", character="scientist")
board = ui.GameBoard(title="بيانات التجربة", text="8 | 3 | 6 | 1 | 7 | 2", rows=1, columns=6)
status = ui.StatusPanel(title="حالة المختبر", text="الهيكل يعمل. أكمل منطق الخوارزمية.", variant="info")
counter = ui.AnimatedCounter(label="المقارنات", value=0)
progress = ui.ProgressRing(value=0)
timeline = ui.Timeline(items=["بيانات", "مقارنات", "حركات", "تقرير"], value=0)
next_button = ui.Button(text="الخطوة التالية", variant="primary", on_click=next_step)
reset_button = ui.Button(text="إعادة", variant="secondary", on_click=reset_experiment)

scene.add(board)
scene.add(status)
scene.add(counter)
scene.add(progress)
scene.add(timeline)
scene.add(next_button)
scene.add(reset_button)
app.add(hero)
app.add(guide)
app.add(scene)
app.run()`,

  "advanced-cipher-escape": `import skui as ui

# المرحلة 1: عرّف حالة الغرفة، ثم أضف مولّد ألغاز لكل محطة.
state = {"stage": 0, "hints": 3, "score": 100}

def check_answer():
    # TODO: قارن الإجابة بحل المرحلة الحالية وانتقل عند النجاح.
    status.set_text("أضف التحقق من الرمز ثم حدّث المرحلة والنتيجة.")

def use_hint():
    if state["hints"] > 0:
        state["hints"] -= 1
        hints.set_value(state["hints"])
        drawer.set_text("اكتب تلميحًا سياقيًا لا يكشف الإجابة.")
        drawer.set_open(True)
    else:
        status.set_text("نفدت التلميحات.")

def replay():
    state["stage"] = 0
    state["hints"] = 3
    state["score"] = 100
    hints.set_value(3)
    score.set_value(100)
    drawer.set_open(False)
    status.set_text("بدأت جولة جديدة. أعد توليد قيم الألغاز هنا.")

app = ui.App(title="غرفة الألغاز المشفرة", theme="modern", appearance="dark", direction="rtl")
hero = ui.HeroSection(title="عملية: الهروب المشفّر", subtitle="ابنِ ثلاث محطات منطقية مترابطة", icon="🔐")
scene = ui.Scene(name="cipher-escape", layout="game")
guide = ui.CharacterGuide(title="العميلة نون", message="صمّم لغز قيصر ثم ASCII ثم نمطًا منطقيًا.", character="agent")
room = ui.MapPanel(title="خريطة الغرفة", text="المحطة النشطة: 1", markers=["قيصر", "ASCII", "النمط", "المخرج"])
mission = ui.MissionCard(title="المحطة الأولى", text="أضف نص اللغز المتولد هنا.", status="active")
answer = ui.Input(placeholder="رمز الفتح")
status = ui.StatusPanel(title="حالة المهمة", text="الهيكل يعمل. أكمل منطق المحطات.", variant="info")
hints = ui.AnimatedCounter(label="التلميحات", value=3)
score = ui.AnimatedCounter(label="النتيجة", value=100)
steps = ui.StepIndicator(steps=["قيصر", "ثنائي", "منطق"], current=1)
drawer = ui.Drawer(title="تلميح", text="لم يُستخدم تلميح بعد.", open=False)
check_button = ui.Button(text="تحقق", variant="primary", on_click=check_answer)
hint_button = ui.Button(text="تلميح", variant="secondary", on_click=use_hint)
replay_button = ui.Button(text="إعادة اللعب", variant="success", on_click=replay)

scene.add(room)
scene.add(mission)
scene.add(answer)
scene.add(check_button)
scene.add(hint_button)
scene.add(replay_button)
scene.add(status)
scene.add(hints)
scene.add(score)
scene.add(steps)
scene.add(drawer)
app.add(hero)
app.add(guide)
app.add(scene)
app.run()`,

  "advanced-smart-city-ops": `import skui as ui

# المرحلة 1: صمّم ثلاثة حوادث، ولكل قرار أثر متبادل على المؤشرات.
state = {"round": 0, "stability": 60, "budget": 70, "satisfaction": 55}

def apply_first_choice():
    # TODO: طبّق أثر القرار بعد فحص الميزانية والموارد.
    status.set_text("أضف آثار القرار ثم انتقل إلى الحادث التالي.")

def apply_second_choice():
    # TODO: اجعل البديل أقل كلفة ولكن ذا أثر مختلف.
    status.set_text("أضف trade-off حقيقيًا لهذا البديل.")

def replay():
    state["round"] = 0
    state["stability"] = 60
    state["budget"] = 70
    state["satisfaction"] = 55
    stability.set_value(60)
    budget.set_value(70)
    satisfaction.set_value(55)
    report.set_open(False)
    status.set_text("بدأت وردية جديدة. أعد اختيار الحوادث هنا.")

app = ui.App(title="غرفة عمليات المدينة الذكية", theme="modern", appearance="dark", direction="rtl")
hero = ui.HeroSection(title="مركز عمليات المدينة", subtitle="ابنِ محاكاة قرارات من ثلاث جولات", icon="🏙️")
scene = ui.Scene(name="smart-city-ops", layout="map")
guide = ui.CharacterGuide(title="مدير العمليات", message="لا تجعل هناك قرارًا مثاليًا؛ لكل خيار كلفة وأثر.", character="commander")
city_map = ui.MapPanel(title="قطاعات المدينة", text="القطاع النشط في الجولة 1", markers=["المركز", "الشرق", "الخدمات", "النقل"])
mission = ui.MissionCard(title="الحادث النشط", text="أضف وصف الحادث الأول.", status="urgent")
status = ui.StatusPanel(title="تقدير الموقف", text="الهيكل يعمل. أكمل منطق القرارات.", variant="warning")
stability = ui.MetricCard(title="الاستقرار", value=60, suffix="%")
budget = ui.MetricCard(title="الميزانية", value=70, suffix=" نقطة")
satisfaction = ui.MetricCard(title="رضا السكان", value=55, suffix="%")
steps = ui.StepIndicator(steps=["استجابة", "تكيّف", "حسم"], current=1)
decision_log = ui.DataGrid(columns=["الجولة", "الحادث", "القرار", "الأثر"], items=[])
report = ui.Drawer(title="تقرير الوردية", text="سيظهر تحليل القرارات بعد الجولة الثالثة.", open=False)
choice_a = ui.Button(text="الخيار أ", variant="primary", on_click=apply_first_choice)
choice_b = ui.Button(text="الخيار ب", variant="secondary", on_click=apply_second_choice)
replay_button = ui.Button(text="وردية جديدة", variant="success", on_click=replay)

scene.add(stability)
scene.add(budget)
scene.add(satisfaction)
scene.add(steps)
scene.add(city_map)
scene.add(mission)
scene.add(choice_a)
scene.add(choice_b)
scene.add(status)
scene.add(decision_log)
scene.add(report)
scene.add(replay_button)
app.add(hero)
app.add(guide)
app.add(scene)
app.run()`,
});

export function getSkuiAdvancedStarter(projectId) {
  return SKUI_ADVANCED_STARTERS[projectId] ?? null;
}
