/**
 * خطط التعلّم التدريجي — مختبر بايثون (تمارين + مشاريع رسومية)
 */
import { GRAPHIC_APP_PROJECTS } from "./graphicAppProjects.js";
import { pythonExercises } from "./pythonExercises.js";
import { getExerciseGuidance } from "../lib/pythonExerciseGuidance.js";
import { runChecks } from "../lib/stepLearningEngine.js";

/** @typedef {import("../lib/stepLearningEngine.js").StepPlan} StepPlan */

/** @type {Record<string, StepPlan>} */
export const CONSOLE_STEP_PLANS = {
  "intro-print": {
    ideaAr: "برنامجك الأول يطبع رسالة ترحيب على الشاشة.",
    commandsAr: ["print"],
    stepsOverviewAr: ["اكتب أمر الطباعة", "غيّر النص", "شغّل البرنامج"],
    expectedOutputAr: "مرحباً بك في مقرر برمجة الحاسب! (أو رسالة مشابهة)",
    steps: [
      {
        titleAr: "الخطوة 1 — أمر الطباعة",
        instructionAr: "اكتب سطراً واحداً يستخدم print لطباعة أي رسالة ترحيب.",
        commandsLearned: ["print"],
        initialCode: `# اكتب سطر الطباعة هنا\nprint("______")`,
        appendCode: "",
        hints: [
          "المطلوب: طباعة نص على الشاشة باستخدام print.",
          "الصيغة: print(\"نصك هنا\") — ضع النص بين علامتي تنصيص.",
          "مثال: print(\"مرحباً بك في مقرر برمجة الحاسب!\")",
        ],
        check: (code) =>
          runChecks(code, [
            { check: (c) => /\bprint\s*\(/.test(c), messageAr: "استخدم print()" },
            { check: (c) => /print\s*\(\s*["'][^"']+["']/.test(c), messageAr: "ضع نصاً بين علامتي تنصيح" },
          ]),
        runnable: true,
      },
    ],
    fullSolution: `print("مرحباً بك في مقرر برمجة الحاسب!")`,
  },
  hello: {
    ideaAr: "تخزين اسمك في متغير ثم طباعته في جملة ترحيب.",
    commandsAr: ["متغير", "print", "+"],
    stepsOverviewAr: ["أنشئ متغير name", "اجمع النصوص", "اطبع الجملة"],
    expectedOutputAr: "مرحباً، أنا [اسمك]",
    steps: [
      {
        titleAr: "الخطوة 1 — المتغير",
        instructionAr: "عرّف متغيراً اسمه name وخزّن فيه اسمك كنص.",
        initialCode: `# اكتب: name = "اسمك"\nname = ______`,
        appendCode: "",
        hints: [
          "المتغير يخزّن قيمة — مثل name = \"أحمد\".",
          "النص يُكتب بين علامتي تنصيص \" \".",
          "name = \"طالب مبرمج\"",
        ],
        check: (code) =>
          runChecks(code, [
            { check: (c) => /\bname\s*=/.test(c), messageAr: "عرّف name =" },
            { check: (c) => /name\s*=\s*["'][^"']+["']/.test(c), messageAr: "ضع نصاً لاسمك" },
          ]),
        runnable: false,
      },
      {
        titleAr: "الخطوة 2 — الطباعة",
        instructionAr: "اكتب print يدمج نصاً ثابتاً مع المتغير name.",
        appendCode: `\n# اكتب: print("مرحباً، أنا " + name)\nprint(______)`,
        hints: [
          "اجمع نصاً مع متغير باستخدام +.",
          "print(\"مرحباً، أنا \" + name)",
          "تأكد من وجود + بين النص و name.",
        ],
        check: (code) =>
          runChecks(code, [
            { check: (c) => /\bprint\s*\(/.test(c), messageAr: "استخدم print" },
            { check: (c) => /\+\s*name|name\s*\+/.test(c), messageAr: "اجمع name مع نص" },
          ]),
        runnable: true,
      },
    ],
    fullSolution: `name = "طالب مبرمج"\nprint("مرحباً، أنا " + name)`,
  },
  "if-grade": {
    ideaAr: "قرّر إن كان الطالب ناجحاً أم راسباً باستخدام if و else.",
    commandsAr: ["if", "else", "print"],
    stepsOverviewAr: ["عرّف الدرجة", "اكتب الشرط", "اطبع النتيجة"],
    expectedOutputAr: "ناجح أو راسب حسب score",
    steps: [
      {
        titleAr: "الخطوة 1 — الدرجة",
        instructionAr: "عرّف score بقيمة رقمية (مثلاً 75).",
        initialCode: `# score = درجة الطالب\nscore = ______`,
        appendCode: "",
        hints: ["score متغير رقمي.", "score = 75", "استخدم رقماً بدون علامات تنصيص."],
        check: (code) =>
          runChecks(code, [{ check: (c) => /\bscore\s*=\s*\d+/.test(c), messageAr: "score = رقم" }]),
        runnable: false,
      },
      {
        titleAr: "الخطوة 2 — الشرط",
        instructionAr: "اكتب if يقارن score مع 50، ثم else يطبع رسالة مختلفة.",
        appendCode: `\nif score >= 50:\n    print("______")\nelse:\n    print("______")`,
        hints: [
          "if score >= 50: ثم سطر بمسافة بادئة.",
          "في if اطبع «ناجح» وفي else «راسب».",
          "لا تنسَ : بعد الشرط والمسافة قبل print.",
        ],
        check: (code) =>
          runChecks(code, [
            { check: (c) => /\bif\b/.test(c), messageAr: "استخدم if" },
            { check: (c) => /\belse\b/.test(c), messageAr: "أضف else" },
            { check: (c) => /score\s*>=|score\s*</.test(c), messageAr: "قارن score" },
          ]),
        runnable: true,
      },
    ],
    fullSolution: `score = 75\nif score >= 75:\n    print("ممتاز!")\nelif score >= 50:\n    print("ناجح")\nelse:\n    print("راسب")`,
  },
  "loop-sum": {
    ideaAr: "احسب مجموع الأعداد من 1 إلى 10 باستخدام حلقة for.",
    commandsAr: ["for", "range", "total"],
    stepsOverviewAr: ["متغير المجموع", "حلقة for", "اطبع النتيجة"],
    expectedOutputAr: "55",
    steps: [
      {
        titleAr: "الخطوة 1 — المجموع",
        instructionAr: "ابدأ total = 0 لجمع الأعداد.",
        initialCode: `total = ______`,
        appendCode: "",
        hints: ["total يبدأ من 0.", "total = 0", "المجموع يزيد في كل تكرار."],
        check: (code) =>
          runChecks(code, [{ check: (c) => /\btotal\s*=\s*0\b/.test(c), messageAr: "total = 0" }]),
        runnable: false,
      },
      {
        titleAr: "الخطوة 2 — الحلقة",
        instructionAr: "استخدم for مع range(1, 11) لجمع الأعداد.",
        appendCode: `\nfor i in range(______):\n    total = total + i\nprint(total)`,
        hints: [
          "range(1, 11) يعطي 1..10.",
          "في كل تكرار: total = total + i",
          "range(1, 11) ثم print(total) في النهاية.",
        ],
        check: (code) =>
          runChecks(code, [
            { check: (c) => /\bfor\b/.test(c), messageAr: "استخدم for" },
            { check: (c) => /range\s*\(\s*1\s*,\s*11\s*\)/.test(c), messageAr: "range(1, 11)" },
            { check: (c) => /\bprint\s*\(\s*total\s*\)/.test(c), messageAr: "اطبع total" },
          ]),
        runnable: true,
      },
    ],
    fullSolution: `total = 0\nfor i in range(1, 11):\n    total = total + i\nprint(total)`,
  },
};

/** @type {Record<string, StepPlan>} */
export const APP_STEP_PLANS = {
  "app-guess-number": buildGuessNumberPlan(),
};

function buildGuessNumberPlan() {
  const full = GRAPHIC_APP_PROJECTS.find((p) => p.id === "app-guess-number")?.starter ?? "";
  return {
    ideaAr: "لعبة تخمين رقم سرّي بين 1 و 20 — تتعلم if والمتغيرات.",
    commandsAr: ["import", "random", "if", "appkit"],
    stepsOverviewAr: [
      "استورد الأدوات",
      "عرّف المتغيرات",
      "اكتب دالة البدء",
      "اكتب دالة التحقق",
      "ابنِ الواجهة",
    ],
    expectedOutputAr: "لعبة تفاعلية: ابدأ → خمّن → رسالة أكبر/أصغر/فوز",
    steps: [
      {
        titleAr: "الخطوة 1 — الاستيراد",
        instructionAr: "اكتب import لـ appkit و random.",
        initialCode: `# اكتب سطرين import\nimport ______\nimport ______`,
        appendCode: "",
        hints: [
          "نحتاج appkit للواجهة و random للرقم العشوائي.",
          "import appkit ثم import random",
          "import appkit\\nimport random",
        ],
        check: (code) =>
          runChecks(code, [
            { check: (c) => /import\s+appkit/.test(c), messageAr: "import appkit" },
            { check: (c) => /import\s+random/.test(c), messageAr: "import random" },
          ]),
        runnable: false,
      },
      {
        titleAr: "الخطوة 2 — المتغيرات",
        instructionAr: "عرّف max_tries = 7 و secret = [0] و used = [0].",
        appendCode: `\nmax_tries = ______\nsecret = [0]\nused = [0]`,
        hints: [
          "max_tries عدد المحاولات (7).",
          "secret و used قوائم لتخزين قيم متغيرة.",
          "max_tries = 7",
        ],
        check: (code) =>
          runChecks(code, [
            { check: (c) => /max_tries\s*=\s*7/.test(c), messageAr: "max_tries = 7" },
            { check: (c) => /\bsecret\s*=\s*\[0\]/.test(c), messageAr: "secret = [0]" },
          ]),
        runnable: false,
      },
      {
        titleAr: "الخطوة 3 — بدء اللعبة",
        instructionAr: "اكتب def start_game(): تختار رقمًا عشوائياً وتصفّر used.",
        appendCode: `\ndef start_game():\n    secret[0] = random.randint(______, ______)\n    used[0] = 0\n    appkit.set("msg", "ابدأ التخمين!")`,
        hints: [
          "random.randint(1, 20) يختار رقمًا بين 1 و 20.",
          "used[0] = 0 يصفّر المحاولات.",
          "secret[0] = random.randint(1, 20)",
        ],
        check: (code) =>
          runChecks(code, [
            { check: (c) => /def\s+start_game\s*\(\s*\)/.test(c), messageAr: "def start_game():" },
            { check: (c) => /random\.randint\s*\(\s*1\s*,\s*20\s*\)/.test(c), messageAr: "randint(1, 20)" },
          ]),
        runnable: false,
      },
      {
        titleAr: "الخطوة 4 — التحقق",
        instructionAr: "اكتب def check_guess(): تقارن التخمين بالرقم السري.",
        appendCode: `\ndef check_guess():\n    g = int(appkit.get("guess"))\n    used[0] += 1\n    if g == secret[0]:\n        appkit.set("msg", "______")\n    elif g < secret[0]:\n        appkit.set("msg", "رقم أكبر")\n    else:\n        appkit.set("msg", "رقم أصغر")`,
        hints: [
          "قارن g مع secret[0] باستخدام if / elif / else.",
          "عند التطابق اطبع رسالة فوز.",
          "if g == secret[0]: appkit.set(\"msg\", \"فزت!\")",
        ],
        check: (code) =>
          runChecks(code, [
            { check: (c) => /def\s+check_guess/.test(c), messageAr: "def check_guess" },
            { check: (c) => /\bif\b/.test(c) && /\belif\b/.test(c), messageAr: "if و elif" },
          ]),
        runnable: false,
      },
      {
        titleAr: "الخطوة 5 — الواجهة",
        instructionAr: "أضف حقول الإدخال والأزرار ثم appkit.build().",
        appendCode: `\nappkit.input("guess", "تخمينك:")\nappkit.button("start", "ابدأ", start_game)\nappkit.button("check", "تحقق", check_guess)\nappkit.text("msg", "اضغط ابدأ")\nappkit.build()`,
        hints: [
          "appkit.input للحقل و appkit.button للأزرار.",
          "اربط الأزرار بالدوال start_game و check_guess.",
          "لا تنسَ appkit.build() في النهاية.",
        ],
        check: (code) =>
          runChecks(code, [
            { check: (c) => /appkit\.build\s*\(\s*\)/.test(c), messageAr: "appkit.build()" },
            { check: (c) => /appkit\.button/.test(c), messageAr: "أضف أزراراً" },
          ]),
        runnable: true,
      },
    ],
    fullSolution: full,
  };
}

/** @param {string} exerciseId */
function buildGenericConsolePlan(exerciseId) {
  const ex = pythonExercises.find((e) => e.id === exerciseId);
  if (!ex) return null;
  const guidance = getExerciseGuidance(exerciseId);
  return {
    ideaAr: ex.titleAr,
    commandsAr: ["print", "متغيرات"],
    stepsOverviewAr: ["اقرأ المطلوب", "اكتب الكود", "شغّل واختبر"],
    expectedOutputAr: "مخرجات صحيحة في نافذة التشغيل",
    steps: [
      {
        titleAr: "الخطوة 1 — اكتب البرنامج",
        instructionAr: ex.hintAr || "أكمل البرنامج حسب المطلوب في التعليقات.",
        initialCode: ex.starter.replace(/(\w+\s*=\s*)([^\n]+)/g, "$1______").replace(/print\([^)]*\)/, 'print("______")'),
        appendCode: "",
        hints: guidance.hints.slice(0, 3),
        check: (code) => {
          const checks = guidance.checks.length
            ? guidance.checks
            : [{ check: (c) => /\bprint\s*\(/.test(c), messageAr: "استخدم print" }];
          return runChecks(code, checks);
        },
        runnable: true,
      },
    ],
    fullSolution: ex.starter,
  };
}

/** @param {typeof GRAPHIC_APP_PROJECTS[0]} project */
function buildGenericAppPlan(project) {
  return {
    ideaAr: project.edu?.description ?? project.titleAr,
    commandsAr: ["skui", "App", "Button", "on_click", "app.run"],
    stepsOverviewAr: (project.edu?.usageSteps ?? []).slice(0, 4),
    expectedOutputAr: "تطبيق تفاعلي في المعاينة",
    // الحل الكامل للمعلم فقط عبر API — لا يُضمَّن في حزمة الطالب
    fullSolution: null,
    steps: [
      {
        titleAr: "الخطوة 1 — الاستيراد",
        instructionAr: `ابدأ مشروع «${project.titleAr}» باستيراد مكتبة skui باسم ui.`,
        initialCode: project.starter || `# استورد مكتبة الواجهة\nimport skui as ______`,
        appendCode: "",
        hints: [
          "أول سطر: import skui as ui",
          "إن احتجت random: import random",
          "import skui as ui",
        ],
        check: (code) =>
          runChecks(code, [{ check: (c) => /import\s+skui\s+as\s+ui/.test(c), messageAr: "import skui as ui" }]),
        runnable: false,
      },
      {
        titleAr: "الخطوة 2 — إنشاء التطبيق",
        instructionAr: "أنشئ App بعنوان المشروع ثم أضف عنصر نص أو تنبيه.",
        appendCode: `\napp = ui.App(title="${project.titleAr}", theme="modern", appearance="dark")\nmessage = ui.Alert(text="جاهز للبناء", variant="info")`,
        hints: [
          "أنشئ التطبيق عبر ui.App(title=...)",
          "أضف ui.Alert أو ui.Text",
          "احفظ المرجع في متغير مثل message",
        ],
        check: (code) =>
          runChecks(code, [
            { check: (c) => /ui\.App\s*\(/.test(c), messageAr: "أنشئ ui.App" },
          ]),
        runnable: false,
      },
      {
        titleAr: "الخطوة 3 — زر وتشغيل",
        instructionAr: "أضف Button مع on_click ثم app.add وapp.run().",
        appendCode: `\ndef on_action():\n    message.set_text("تم التنفيذ")\n\nbutton = ui.Button(text="تشغيل", variant="primary", depth="raised", on_click=on_action)\napp.add(button)\napp.add(message)\napp.run()`,
        hints: [
          "ui.Button(text=\"...\", on_click=اسم_الدالة)",
          "أضف المكونات بواسطة app.add",
          "app.run() في النهاية",
        ],
        check: (code) =>
          runChecks(code, [
            { check: (c) => /app\.run\s*\(\s*\)/.test(c), messageAr: "app.run()" },
          ]),
        runnable: true,
      },
    ],
  };
}

/**
 * @param {"console"|"app"} mode
 * @param {string} resourceId
 * @returns {StepPlan|null}
 */
export function getStepPlan(mode, resourceId) {
  if (mode === "app") {
    return APP_STEP_PLANS[resourceId] ?? buildGenericAppPlan(
      GRAPHIC_APP_PROJECTS.find((p) => p.id === resourceId) ?? GRAPHIC_APP_PROJECTS[0],
    );
  }
  return CONSOLE_STEP_PLANS[resourceId] ?? buildGenericConsolePlan(resourceId);
}

// خطط مخصصة إضافية للمشاريع الرسومية
for (const p of GRAPHIC_APP_PROJECTS) {
  APP_STEP_PLANS[p.id] = buildGenericAppPlan(p);
}
