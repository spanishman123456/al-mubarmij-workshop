/**
 * حلول المعلم الكاملة للمشروعات المتقدمة.
 *
 * مهم: لا تستورد هذا الملف من أي مسار يصل إلى حزمة الطالب. الاستيراد المسموح
 * الوحيد حاليًا هو server/teacher/skuiSolutions.js.
 */
export const SKUI_ADVANCED_APPS = Object.freeze({
  "advanced-algorithm-lab": `import skui as ui

DATASETS = [
    [8, 3, 6, 1, 7, 2],
    [5, 1, 5, 2, 9, 3],
    [2, 4, 6, 8, 10, 12],
]
state = {
    "dataset": 0,
    "algorithm": "Bubble Sort",
    "steps": [],
    "step": 0,
    "runs": 0,
}

def copy_values(values):
    result = []
    for value in values:
        result.append(value)
    return result

def bubble_steps(values):
    data = copy_values(values)
    steps = [{"values": copy_values(data), "note": "الحالة الابتدائية", "comparisons": 0, "swaps": 0}]
    comparisons = 0
    swaps = 0
    end = len(data) - 1
    while end > 0:
        index = 0
        changed = False
        while index < end:
            comparisons += 1
            note = "مقارنة " + str(data[index]) + " و " + str(data[index + 1])
            if data[index] > data[index + 1]:
                old = data[index]
                data[index] = data[index + 1]
                data[index + 1] = old
                swaps += 1
                changed = True
                note = note + " ثم التبديل"
            steps.append({"values": copy_values(data), "note": note, "comparisons": comparisons, "swaps": swaps})
            index += 1
        if not changed:
            break
        end -= 1
    return steps

def selection_steps(values):
    data = copy_values(values)
    steps = [{"values": copy_values(data), "note": "الحالة الابتدائية", "comparisons": 0, "swaps": 0}]
    comparisons = 0
    swaps = 0
    start = 0
    while start < len(data) - 1:
        smallest = start
        scan = start + 1
        while scan < len(data):
            comparisons += 1
            if data[scan] < data[smallest]:
                smallest = scan
            steps.append({
                "values": copy_values(data),
                "note": "فحص أصغر قيمة من الموضع " + str(start + 1),
                "comparisons": comparisons,
                "swaps": swaps,
            })
            scan += 1
        if smallest != start:
            old = data[start]
            data[start] = data[smallest]
            data[smallest] = old
            swaps += 1
            steps.append({
                "values": copy_values(data),
                "note": "نقل الأصغر إلى الموضع " + str(start + 1),
                "comparisons": comparisons,
                "swaps": swaps,
            })
        start += 1
    return steps

def insertion_steps(values):
    data = copy_values(values)
    steps = [{"values": copy_values(data), "note": "الحالة الابتدائية", "comparisons": 0, "swaps": 0}]
    comparisons = 0
    moves = 0
    index = 1
    while index < len(data):
        key = data[index]
        scan = index - 1
        while scan >= 0:
            comparisons += 1
            if data[scan] <= key:
                break
            data[scan + 1] = data[scan]
            moves += 1
            steps.append({
                "values": copy_values(data),
                "note": "إزاحة " + str(data[scan]) + " إلى اليمين",
                "comparisons": comparisons,
                "swaps": moves,
            })
            scan -= 1
        data[scan + 1] = key
        steps.append({
            "values": copy_values(data),
            "note": "إدراج " + str(key) + " في مكانه",
            "comparisons": comparisons,
            "swaps": moves,
        })
        index += 1
    return steps

def make_steps():
    values = DATASETS[state["dataset"]]
    if state["algorithm"] == "Selection Sort":
        state["steps"] = selection_steps(values)
    elif state["algorithm"] == "Insertion Sort":
        state["steps"] = insertion_steps(values)
    else:
        state["steps"] = bubble_steps(values)
    state["step"] = 0

def values_text(values):
    parts = []
    for value in values:
        parts.append(str(value))
    return "  |  ".join(parts)

def render():
    current = state["steps"][state["step"]]
    board.set_text(values_text(current["values"]))
    status.set_text(current["note"])
    comparisons.set_value(current["comparisons"])
    swaps.set_value(current["swaps"])
    progress_value = int((state["step"] * 100) / (len(state["steps"]) - 1))
    progress.set_value(progress_value)
    level.set_text("الخطوة " + str(state["step"] + 1) + " / " + str(len(state["steps"])))
    timeline.set_value(state["step"])

def choose_algorithm():
    state["algorithm"] = str(algorithm.value())
    make_steps()
    render()
    toast.set_text("تم تجهيز تجربة " + state["algorithm"])

def choose_dataset():
    selected = str(dataset.value())
    state["dataset"] = int(selected) - 1
    make_steps()
    render()

def next_step():
    if state["step"] < len(state["steps"]) - 1:
        state["step"] += 1
        render()
    else:
        state["runs"] += 1
        runs.set_value(state["runs"])
        status.set_text("اكتمل الفرز. غيّر البيانات أو الخوارزمية وقارن النتيجة.")
        result_dialog.set_text("اكتملت " + state["algorithm"] + " في " + str(len(state["steps"]) - 1) + " خطوة.")
        result_dialog.set_open(True)

def run_all():
    state["step"] = len(state["steps"]) - 1
    render()
    state["runs"] += 1
    runs.set_value(state["runs"])
    result_dialog.set_text("تقرير: " + state["algorithm"] + " — قارن عدد المقارنات والحركات مع تجربة أخرى.")
    result_dialog.set_open(True)

def reset_experiment():
    make_steps()
    render()
    result_dialog.set_open(False)
    toast.set_text("أعيدت التجربة من البداية")

app = ui.App(title="مختبر الخوارزميات المرئي", theme="modern", appearance="dark", direction="rtl")
hero = ui.HeroSection(title="مختبر الخوارزميات", subtitle="جرّب، تتبّع، ثم قارن كلفة كل خوارزمية", icon="🧪")
scene = ui.Scene(name="algorithm-lab", layout="workspace")
guide = ui.CharacterGuide(title="مساعد المختبر", message="اختر خوارزمية وبيانات، ثم تقدّم خطوة خطوة.", character="scientist")
algorithm = ui.Select(options=["Bubble Sort", "Selection Sort", "Insertion Sort"], value="Bubble Sort", on_change=choose_algorithm)
dataset = ui.Select(options=["1", "2", "3"], value="1", on_change=choose_dataset)
board = ui.GameBoard(title="مصفوفة التجربة", text="", rows=1, columns=6)
status = ui.StatusPanel(title="تفسير الخطوة", text="", variant="info")
comparisons = ui.AnimatedCounter(label="المقارنات", value=0)
swaps = ui.AnimatedCounter(label="الحركات", value=0)
runs = ui.AnimatedCounter(label="التجارب المكتملة", value=0)
progress = ui.ProgressRing(value=0)
level = ui.LevelBadge(text="الخطوة 1")
timeline = ui.Timeline(items=["بدء", "مقارنة", "حركة", "اكتمال"], value=0)
table = ui.DataGrid(columns=["الخوارزمية", "أفضل حالة", "متوسط"], items=[
    ["Bubble", "O(n)", "O(n²)"],
    ["Selection", "O(n²)", "O(n²)"],
    ["Insertion", "O(n)", "O(n²)"],
])
result_dialog = ui.Dialog(title="تقرير التجربة", text="لم تكتمل تجربة بعد", open=False)
toast = ui.Toast(text="المختبر جاهز", variant="info")
next_button = ui.Button(text="الخطوة التالية", variant="primary", on_click=next_step)
run_button = ui.Button(text="تشغيل للنهاية", variant="success", on_click=run_all)
reset_button = ui.Button(text="إعادة التجربة", variant="secondary", on_click=reset_experiment)
next_tip = ui.Tooltip(next_button, text="نفّذ عملية خوارزمية واحدة")

make_steps()
render()
scene.add(algorithm)
scene.add(dataset)
scene.add(board)
scene.add(status)
scene.add(comparisons)
scene.add(swaps)
scene.add(runs)
scene.add(progress)
scene.add(level)
scene.add(timeline)
scene.add(table)
scene.add(next_tip)
scene.add(run_button)
scene.add(reset_button)
scene.add(result_dialog)
scene.add(toast)
app.add(hero)
app.add(guide)
app.add(scene)
app.run()`,

  "advanced-cipher-escape": `import random
import skui as ui

WORDS = ["CODE", "LOGIC", "ESCAPE", "PYTHON"]
state = {
    "stage": 0,
    "hints": 3,
    "score": 100,
    "round": 0,
    "answers": [],
    "clues": [],
}

def caesar(text, shift):
    result = ""
    for char in text:
        code = ord(char)
        if code >= 65 and code <= 90:
            result += chr(((code - 65 + shift) % 26) + 65)
        else:
            result += char
    return result

def to_binary(number):
    if number == 0:
        return "0"
    digits = ""
    value = number
    while value > 0:
        digits = str(value % 2) + digits
        value = value // 2
    return digits

def new_puzzles():
    word = WORDS[random.randint(0, len(WORDS) - 1)]
    shift = random.randint(1, 5)
    ascii_value = random.randint(65, 90)
    pattern_start = random.randint(2, 6)
    state["answers"] = [word, chr(ascii_value), str(pattern_start + 8)]
    state["clues"] = [
        "أعد النص " + caesar(word, shift) + " بمقدار " + str(shift) + " للخلف",
        "حوّل " + to_binary(ascii_value) + " من ثنائي إلى حرف ASCII",
        "أكمل النمط: " + str(pattern_start) + "، " + str(pattern_start + 2) + "، " + str(pattern_start + 4) + "، " + str(pattern_start + 6) + "، ؟",
    ]

def render():
    stage_number = state["stage"] + 1
    step.set_value(stage_number)
    progress.set_value(int((state["stage"] * 100) / 3))
    level.set_text("المحطة " + str(stage_number) + " / 3")
    mission.set_text(state["clues"][state["stage"]])
    hints_counter.set_value(state["hints"])
    score_counter.set_value(state["score"])
    room_map.set_text("المحطة النشطة: " + str(stage_number))
    answer.set_value("")
    status.set_text("حل اللغز الحالي ثم اضغط تحقق.")

def check_answer():
    guess = str(answer.value()).strip().upper()
    expected = state["answers"][state["stage"]].upper()
    if guess == expected:
        state["score"] += 15
        toast.set_text("فُتح القفل!")
        if state["stage"] == 2:
            finish_escape()
        else:
            state["stage"] += 1
            render()
            guide.set_text("أحسنت. انتقل إلى المحطة التالية.")
    else:
        state["score"] -= 8
        score_counter.set_value(state["score"])
        status.set_text("الرمز غير صحيح. راجع الدليل وحاول مجددًا.")

def use_hint():
    if state["hints"] <= 0:
        status.set_text("نفدت التلميحات لهذه الجولة.")
        return
    state["hints"] -= 1
    state["score"] -= 5
    hints_counter.set_value(state["hints"])
    score_counter.set_value(state["score"])
    if state["stage"] == 0:
        drawer.set_text("حرّك كل حرف للخلف داخل A-Z بعدد الإزاحة.")
    elif state["stage"] == 1:
        drawer.set_text("اجمع قيم الخانات التي تحتوي 1: 64، 32، 16، 8، 4، 2، 1 ثم استخدم ASCII.")
    else:
        drawer.set_text("الفرق ثابت ويساوي 2.")
    drawer.set_open(True)

def finish_escape():
    state["round"] += 1
    score_counter.set_value(state["score"])
    progress.set_value(100)
    status.set_text("نجحت عملية الهروب! يمكنك بدء غرفة جديدة بقيم مختلفة.")
    result.set_text("الهروب رقم " + str(state["round"]) + " — النتيجة " + str(state["score"]) + " — التلميحات المتبقية " + str(state["hints"]))
    result.set_open(True)
    guide.set_text("اكتملت المهمة. أعد اللعب لتحسين نتيجتك.")

def replay():
    state["stage"] = 0
    state["hints"] = 3
    state["score"] = 100
    new_puzzles()
    progress.set_value(0)
    drawer.set_open(False)
    result.set_open(False)
    render()
    toast.set_text("تغيّرت رموز الغرفة؛ بدأت جولة جديدة")

app = ui.App(title="غرفة الألغاز المشفرة", theme="modern", appearance="dark", direction="rtl")
hero = ui.HeroSection(title="عملية: الهروب المشفّر", subtitle="ثلاثة أقفال، ثلاث خوارزميات، ومحاولات غير محدودة", icon="🔐")
scene = ui.Scene(name="cipher-escape", layout="game")
guide = ui.CharacterGuide(title="العميلة نون", message="حل المحطات بالترتيب. لديك ثلاثة تلميحات.", character="agent")
room_map = ui.MapPanel(title="خريطة الغرفة", text="المحطة النشطة: 1", markers=["قيصر", "ASCII", "النمط", "المخرج"])
mission = ui.MissionCard(title="الدليل الحالي", text="", status="active")
answer = ui.Input(placeholder="اكتب رمز الفتح هنا", value="")
status = ui.StatusPanel(title="حالة المهمة", text="", variant="info")
hints_counter = ui.AnimatedCounter(label="التلميحات", value=3)
score_counter = ui.AnimatedCounter(label="النتيجة", value=100)
progress = ui.ProgressRing(value=0)
level = ui.LevelBadge(text="المحطة 1 / 3")
step = ui.StepIndicator(steps=["قيصر", "ثنائي", "منطق"], current=1)
timeline = ui.Timeline(items=["دخول", "قفل 1", "قفل 2", "قفل 3", "هروب"], value=0)
drawer = ui.Drawer(title="تلميح ميداني", text="اختر «استخدم تلميحًا» عند الحاجة.", open=False)
result = ui.Dialog(title="تقرير الهروب", text="لم تكتمل المهمة بعد", open=False)
toast = ui.Toast(text="أُغلقت الأبواب وبدأت المهمة", variant="warning")
check_button = ui.Button(text="تحقق من الرمز", variant="primary", on_click=check_answer)
hint_button = ui.Button(text="استخدم تلميحًا", variant="secondary", on_click=use_hint)
replay_button = ui.Button(text="غرفة جديدة", variant="success", on_click=replay)

new_puzzles()
render()
scene.add(room_map)
scene.add(mission)
scene.add(answer)
scene.add(check_button)
scene.add(hint_button)
scene.add(replay_button)
scene.add(status)
scene.add(hints_counter)
scene.add(score_counter)
scene.add(progress)
scene.add(level)
scene.add(step)
scene.add(timeline)
scene.add(drawer)
scene.add(result)
scene.add(toast)
app.add(hero)
app.add(guide)
app.add(scene)
app.run()`,

  "advanced-smart-city-ops": `import random
import skui as ui

INCIDENTS = [
    {
        "title": "ازدحام عند المستشفى",
        "detail": "تأخر سيارات الطوارئ وارتفاع ضغط المرور.",
        "a": "افتح مسار طوارئ",
        "b": "حوّل المرور للأحياء",
        "impact_a": [8, -12, 6, 2],
        "impact_b": [3, -4, -5, 0],
    },
    {
        "title": "ذروة استهلاك الطاقة",
        "detail": "الشبكة قريبة من حدها الأقصى.",
        "a": "شغّل التخزين الاحتياطي",
        "b": "خفّض إنارة المرافق",
        "impact_a": [7, -15, 4, 2],
        "impact_b": [4, -3, -6, 0],
    },
    {
        "title": "تسرّب مياه في القطاع الشرقي",
        "detail": "الضغط ينخفض وقد تتأثر الخدمات.",
        "a": "أرسل فريق صيانة",
        "b": "اعزل القطاع مؤقتًا",
        "impact_a": [9, -18, 5, 2],
        "impact_b": [4, -6, -8, 0],
    },
    {
        "title": "فعالية جماهيرية مفاجئة",
        "detail": "المنطقة المركزية تحتاج تنظيمًا سريعًا.",
        "a": "وزّع فرق السلامة",
        "b": "غيّر مسار النقل العام",
        "impact_a": [8, -14, 7, 2],
        "impact_b": [5, -8, 2, 0],
    },
    {
        "title": "عطل في إشارات تقاطع",
        "detail": "زمن الرحلة يرتفع ومخاطر السلامة تتزايد.",
        "a": "صيانة فورية",
        "b": "دوريات تنظيم مؤقتة",
        "impact_a": [10, -16, 5, 2],
        "impact_b": [5, -7, 1, 1],
    },
]

state = {
    "round": 0,
    "stability": 60,
    "budget": 70,
    "satisfaction": 55,
    "teams": 3,
    "incidents": [],
    "history": [],
    "sessions": 0,
}

def pick_incidents():
    pool = []
    for incident in INCIDENTS:
        pool.append(incident)
    chosen = []
    while len(chosen) < 3:
        index = random.randint(0, len(pool) - 1)
        chosen.append(pool[index])
        del pool[index]
    state["incidents"] = chosen

def clamp(value):
    if value < 0:
        return 0
    if value > 100:
        return 100
    return value

def current_incident():
    return state["incidents"][state["round"]]

def render_metrics():
    stability.set_value(state["stability"])
    budget.set_value(state["budget"])
    satisfaction.set_value(state["satisfaction"])
    teams.set_value(state["teams"])
    stability_ring.set_value(state["stability"])

def render_round():
    incident = current_incident()
    round_badge.set_text("الجولة " + str(state["round"] + 1) + " / 3")
    step.set_value(state["round"] + 1)
    mission.set_text(incident["title"] + " — " + incident["detail"])
    action_a.set_text(incident["a"])
    action_b.set_text(incident["b"])
    city_map.set_text("القطاع النشط في الجولة " + str(state["round"] + 1))
    status.set_text("وازن بين الاستقرار والميزانية والرضا والفرق المتاحة.")
    timeline.set_value(state["round"])

def apply_choice(choice):
    incident = current_incident()
    if choice == "a":
        impact = incident["impact_a"]
        action_name = incident["a"]
    else:
        impact = incident["impact_b"]
        action_name = incident["b"]
    if impact[3] > state["teams"]:
        status.set_text("لا توجد فرق كافية لهذا القرار.")
        return
    if state["budget"] + impact[1] < 0:
        status.set_text("الميزانية لا تكفي. اختر بديلًا أقل كلفة.")
        return
    state["stability"] = clamp(state["stability"] + impact[0])
    state["budget"] = clamp(state["budget"] + impact[1])
    state["satisfaction"] = clamp(state["satisfaction"] + impact[2])
    state["teams"] -= impact[3]
    state["history"].append([
        str(state["round"] + 1),
        incident["title"],
        action_name,
        str(impact[0]),
        str(impact[1]),
        str(impact[2]),
    ])
    render_metrics()
    toast.set_text("تم القرار: " + action_name)
    if state["round"] == 2:
        finish_session()
    else:
        state["round"] += 1
        if state["teams"] < 3:
            state["teams"] += 1
        render_metrics()
        render_round()

def choose_a():
    apply_choice("a")

def choose_b():
    apply_choice("b")

def finish_session():
    state["sessions"] += 1
    final_score = int((state["stability"] * 45 + state["satisfaction"] * 35 + state["budget"] * 20) / 100)
    decision_log.set_items(state["history"])
    report.set_text(
        "مؤشر المدينة " + str(final_score) +
        ". الاستقرار " + str(state["stability"]) +
        "، الرضا " + str(state["satisfaction"]) +
        "، والميزانية " + str(state["budget"]) + "."
    )
    report.set_open(True)
    status.set_text("انتهت الوردية. راجع أثر قراراتك ثم ابدأ سيناريو جديدًا.")
    guide.set_text("كل قرار صنع أثرًا متبادلًا. جرّب استراتيجية مختلفة.")

def replay():
    state["round"] = 0
    state["stability"] = 60
    state["budget"] = 70
    state["satisfaction"] = 55
    state["teams"] = 3
    state["history"] = []
    report.set_open(False)
    pick_incidents()
    decision_log.set_items([])
    render_metrics()
    render_round()
    toast.set_text("بدأت وردية جديدة بحوادث مختلفة")

app = ui.App(title="غرفة عمليات المدينة الذكية", theme="modern", appearance="dark", direction="rtl")
hero = ui.HeroSection(title="مركز عمليات المدينة", subtitle="ثلاث جولات مترابطة؛ كل مورد له ثمن", icon="🏙️")
scene = ui.Scene(name="smart-city-ops", layout="map")
guide = ui.CharacterGuide(title="مدير العمليات", message="اتخذ قرارًا واحدًا لكل حادث. بعض الموارد تعود جزئيًا بين الجولات.", character="commander")
city_map = ui.MapPanel(title="قطاعات المدينة", text="القطاع النشط في الجولة 1", markers=["المركز", "الشرق", "الخدمات", "النقل"])
mission = ui.MissionCard(title="الحادث النشط", text="", status="urgent")
status = ui.StatusPanel(title="تقدير الموقف", text="", variant="warning")
stability = ui.MetricCard(title="الاستقرار", value=60, suffix="%")
budget = ui.MetricCard(title="الميزانية", value=70, suffix=" نقطة")
satisfaction = ui.MetricCard(title="رضا السكان", value=55, suffix="%")
teams = ui.AnimatedCounter(label="الفرق المتاحة", value=3)
stability_ring = ui.ProgressRing(value=60)
round_badge = ui.LevelBadge(text="الجولة 1 / 3")
step = ui.StepIndicator(steps=["استجابة", "تكيّف", "حسم"], current=1)
timeline = ui.Timeline(items=["بدء الوردية", "الحادث الأول", "الحادث الثاني", "الحادث الثالث", "التقرير"], value=0)
action_a = ui.Button(text="الخيار أ", variant="primary", on_click=choose_a)
action_b = ui.Button(text="الخيار ب", variant="secondary", on_click=choose_b)
decision_log = ui.DataGrid(columns=["الجولة", "الحادث", "القرار", "استقرار", "ميزانية", "رضا"], items=[])
report = ui.Drawer(title="تقرير الوردية", text="اتخذ ثلاثة قرارات لفتح التقرير.", open=False)
toast = ui.Toast(text="غرفة العمليات متصلة", variant="info")
replay_button = ui.Button(text="وردية جديدة", variant="success", on_click=replay)

pick_incidents()
render_metrics()
render_round()
scene.add(stability)
scene.add(budget)
scene.add(satisfaction)
scene.add(teams)
scene.add(stability_ring)
scene.add(round_badge)
scene.add(step)
scene.add(city_map)
scene.add(mission)
scene.add(action_a)
scene.add(action_b)
scene.add(status)
scene.add(timeline)
scene.add(decision_log)
scene.add(report)
scene.add(toast)
scene.add(replay_button)
app.add(hero)
app.add(guide)
app.add(scene)
app.run()`,
});

export function getSkuiAdvancedTeacherSolution(projectId) {
  return SKUI_ADVANCED_APPS[projectId] ?? null;
}
