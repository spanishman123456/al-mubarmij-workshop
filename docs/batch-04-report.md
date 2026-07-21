# تقرير الدفعة 4 — استكمال وتصحيح اليوم الثاني

**الفرع:** `feature/full-curriculum-expansion`  
**التاريخ:** 2026-07-05  
**الحالة العامة لليوم 2:** ⏳ **غير مكتمل** (1 done · 13 partial · 14 merged · 0 pending)

---

## Commit

**`57bf0e9`** — `feat(curriculum): batch 4 — Day 2 coverage correction and lesson completion`

---

## 1. خريطة تغطية اليوم الثاني

الملف الكامل: [`docs/day02-coverage-status.md`](./day02-coverage-status.md)

| الحالة | العدد | المعنى |
|---|---:|---|
| done | 1 | `radix-practice` |
| partial | 13 | محتوى موجود — يحتاج توسيع/ربط تقدم |
| merged | 14 | مدمج في درس أب — غير مخفى |
| pending | 0 | لا عناصر بدون مسار |

**لا تُستخدم عبارة «اليوم الثاني مكتمل»** — 13 عنصراً لا يزال `partial`.

---

## 2. الدروس الجديدة والمحدّثة

### جديد (7 دروس + 1 نشاط)

| المسار | الملف | pdfPageIndex |
|---|---|---|
| `/lessons/base-arithmetic` | `baseArithmeticLesson.js` | 99–102 |
| `/lessons/twos-complement` | `twosComplementLesson.js` | 103–105 |
| `/lessons/floating-point` | `floatingPointLesson.js` | 106 |
| `/lessons/python-arrays` | `pythonArraysLesson.js` | 114–115 |
| `/lessons/python-for-range` | `pythonForRangeLesson.js` | 118–119 |
| `/lessons/python-while` | `pythonWhileLesson.js` | 124 |
| `/lessons/card-sort-algorithm` | `cardSortAlgorithmLesson.js` | 109 |
| `/teacher/day-02-answers` | `TeacherDay02AnswersPage.jsx` | 150 |

### محدّث

| المسار | التغيير |
|---|---|
| `/lessons/conversions-intro` | `lessonKind: activity` + `activityGuide` + `deepSections` |
| `/lessons/day02-computer-lab` | `lessonKind: lab` + `activityGuide` كامل |
| `/lessons/algorithms`, `/lessons/if-statement` | ربط مختبرات + مسارات |
| `StandardLessonPage.jsx` | عرض `activityGuide` + أقسام اختيارية لـ activity/lab |
| `validateLessonContent.js` | مخطط activity/lab — يرفض صفحات فارغة |

---

## 3. الدمج وأسبابه

| الموضوعات المدمجة | الدرس الأب | السبب |
|---|---|---|
| hex / base5 / binary add / binary sub | `base-arithmetic` | نفس آلية carry/borrow — درس واحد متسلسل |
| سالب / bit-width / overflow | `twos-complement` | مكمل 2 وحدة واحدة |
| range | `python-for-range` | for و range مترابطان في PDF |
| indexing | `python-arrays` | الفهرسة جزء من القوائم |
| booleans / if-apps | `if-statement` | تطبيقات if في نفس الدرس |
| pseudocode / writing / algo-apps | `algorithms` | مسار خوارزميات متصل |

---

## 4. الأقسام والأمثلة والتدريبات

| الدرس | deepSections | workedExamples | guided | independent | مختبر |
|---|---:|---:|---:|---:|---|
| base-arithmetic | 6 | 5 | 3 | 4 | BaseArithmeticLab |
| twos-complement | 6 | 5 | 3 | 3 | TwosComplementLab |
| floating-point | 5 | 3 | 2 | 2 | IfStatementLab |
| python-arrays | 5 | 4 | 2 | 3 | PythonListLab |
| python-for-range | 5 | 3 | 2 | 3 | ForRangeLab |
| python-while | 5 | 3 | 2 | 3 | WhileLoopLab |
| card-sort-algorithm | — | 1 | — | — | AlgorithmStepsLab |
| conversions-intro | 2 | 2 | 2 | 2 | NumberBaseConverter |
| day02-computer-lab | 3 | 2 | 2 | 2 | IfStatementLab |

**المكتبات:** `baseArithmetic.js`, `twosComplement.js`, `ifInterpreter.js`, `loopsAndLists.js`

---

## 5. المكونات التفاعلية

| المكوّن | الدروس |
|---|---|
| `BaseArithmeticLab` | base-arithmetic (hex/5/2 add/sub + تحقق) |
| `TwosComplementLab` | twos-complement (encode/decode + overflow) |
| `PythonListLab` | python-arrays (فهرسة + IndexError) |
| `ForRangeLab` | python-for-range (تتبع range) |
| `WhileLoopLab` | python-while (تتبع + infinite guard) |
| `AlgorithmStepsLab` | algorithms, card-sort |
| `IfStatementLab` | if-statement, sentence-reference, floating-point, lab |
| `ActivityGuide` UI | conversions-intro, card-sort, day02-computer-lab |

---

## 6. الاختبارات

| | الدفعة 3 | الدفعة 4 |
|---|---:|---:|
| **إجمالي Vitest** | 73 | **110** |
| **ملفات جديدة** | — | 4 |
| **توسيع validateLessonContent** | — | activity/lab + catalog ids |

### ملفات اختبار جديدة

- `baseArithmetic.test.js` — 7 (hex/base5/binary add/sub + verify)
- `twosComplement.test.js` — 8 (encode/decode/overflow/range)
- `ifInterpreter.test.js` — 10 (if/elif/indent/compare/hints)
- `loopsAndLists.test.js` — 8 (for/range/while/lists/index)

**النتيجة:** `110/110` ✅ · **Build:** ✅

---

## 7. المراجعة المرئية (RTL + مختبرات)

لقطات في [`docs/screenshots/`](./screenshots/):

| الملف | الصفحة |
|---|---|
| `algorithms-lesson.png` | /lessons/algorithms |
| `algorithm-steps-lab.png` | /lessons/card-sort-algorithm |
| `if-statement-lesson.png` | /lessons/if-statement |
| `base-arithmetic-lesson.png` | /lessons/base-arithmetic |
| `twos-complement-lesson.png` | /lessons/twos-complement |
| `python-arrays-lesson.png` | /lessons/python-arrays |
| `python-for-range-lesson.png` | /lessons/python-for-range |
| `python-while-lesson.png` | /lessons/python-while |

**تحقق:** RTL ✅ · أكواد `dir="ltr"` ✅ · جداول/بطاقات responsive ✅ · رسائل خطأ/تلميحات في المختبرات ✅

**إصلاح أثناء المراجعة:** `StandardLessonPage` — أقسام اختيارية لدروس activity/lab (كان يسبب crash في card-sort).

---

## 8. المتبقي قبل اليوم الثالث

| الأولوية | العنصر |
|---|---|
| عالية | توسيع `algorithms` (مقدمة PDF 107) |
| عالية | `if-statement` — elif/nested كامل PDF |
| متوسطة | `floating-point` — تمارين دقة إضافية |
| متوسطة | `card-sort` — محاكاة بطاقات drag |
| متوسطة | `day02-computer-lab` — ربط حفظ التقدم API |
| متوسطة | `/teacher/day-02-answers` — مفتاح PDF كامل |
| منخفض | `conversions-intro` — ASCII تفاعلي أوسع |

**⚠️ لا يُبدأ اليوم 3** (ثوابت، مصفوفات متعددة، break/continue/pass/else، جداول الحقيقة) قبل `done` أو موافقة على partial المتبقية.

---

_الدفعة 4 — feature/full-curriculum-expansion — لا دمج main · لا Render_
