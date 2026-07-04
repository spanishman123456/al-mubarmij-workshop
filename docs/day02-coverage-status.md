# حالة تغطية اليوم الثاني — نموذج منفصل

**حدود اليوم 2:** pdfPageIndex 93–150
**الحالة العامة:** ✅ **مكتمل** — `implementationStatus` منفصل عن `integrationMode`.

> **merged** = طريقة دمج المحتوى — **لا يعني اكتمالاً تلقائياً**. راجع `implementationStatus`.

| # | الموضوع | pdf | implementation | integration | mergedInto | qa | تفاعلي | المتبقي |
|---:|---|---:|---|---|---|---|---|---|
| 1 | النشاط التمهيدي: التحويلات و ASCII | 93 | **done** | activity | `conversions-intro` | passed | ActivityGuide | — |
| 2 | الحساب في أنظمة العد المختلفة | 99 | **done** | standalone | — | passed | BaseArithmeticLab | — |
| 3 | الجمع في النظام الست عشري | 100 | **done** | merged | `base-arithmetic` | passed | BaseArithmeticLab | — |
| 4 | الجمع في الأساس 5 | 99 | **done** | merged | `base-arithmetic` | passed | BaseArithmeticLab | — |
| 5 | قواعد الجمع الثنائي | 101 | **done** | merged | `base-arithmetic` | passed | BaseArithmeticLab | — |
| 6 | الطرح الثنائي | 102 | **done** | merged | `base-arithmetic` | passed | BaseArithmeticLab | — |
| 7 | مكمل العدد 2 في الطرح | 103 | **done** | standalone | — | passed | TwosComplementLab | — |
| 8 | تمثيل الأعداد السالبة | 104 | **done** | merged | `twos-complement` | passed | TwosComplementLab | — |
| 9 | تحديد عدد البتات | 104 | **done** | merged | `twos-complement` | passed | TwosComplementLab | — |
| 10 | تجاوز السعة Overflow | 105 | **done** | merged | `twos-complement` | passed | TwosComplementLab | — |
| 11 | الأعداد ذات الفاصلة العائمة | 106 | **done** | standalone | — | passed | IfStatementLab | — |
| 12 | تطبيقات حساب الأساس | 96 | **done** | standalone | — | passed | LessonPractice | — |
| 13 | مقدمة الخوارزميات | 107 | **done** | standalone | — | passed | AlgorithmStepsLab | — |
| 14 | نشاط فرز البطاقات | 109 | **done** | activity | `card-sort-algorithm` | passed | CardSortSimulation | — |
| 15 | كتابة الخوارزميات | 110 | **done** | merged | `algorithms` | passed | AlgorithmStepsLab | — |
| 16 | شبه الكود | 112 | **done** | merged | `algorithms` | passed | AlgorithmStepsLab | — |
| 17 | المصفوفات والقوائم | 114 | **done** | standalone | — | passed | PythonListLab | — |
| 18 | الفهرسة والوصول | 115 | **done** | merged | `python-arrays` | passed | PythonListLab | — |
| 19 | القيم المنطقية | 121 | **done** | merged | `if-statement` | passed | IfStatementLab | — |
| 20 | جملة if | 141 | **done** | standalone | — | passed | IfStatementLab | — |
| 21 | if/else والدليل المرجعي | 139 | **done** | standalone | — | passed | IfStatementLab | — |
| 22 | حلقة for | 118 | **done** | standalone | — | passed | ForRangeLab | — |
| 23 | range | 119 | **done** | merged | `python-for-range` | passed | ForRangeLab | — |
| 24 | حلقة while | 124 | **done** | standalone | — | passed | WhileLoopLab | — |
| 25 | تطبيقات الخوارزميات | 125 | **done** | merged | `algorithms` | passed | AlgorithmStepsLab | — |
| 26 | تطبيقات if | 143 | **done** | merged | `if-statement` | passed | IfStatementLab | — |
| 27 | النشاط العملي — مختبر الحاسب | 149 | **done** | lab | `day02-computer-lab` | passed | Day02ComputerLabPanel | — |
| 28 | إجابات المعلم | 150 | **done** | teacher-only | — | passed | TeacherDay02AnswersPage | — |

## ملخص implementationStatus

| الحالة | العدد |
|---|---:|
| done | 28 |

## ملخص integrationMode

| الوضع | العدد |
|---|---:|
| standalone | 10 |
| merged | 14 |
| activity | 2 |
| lab | 1 |
| teacher-only | 1 |

## ملخص qaStatus

| QA | العدد |
|---|---:|
| passed | 28 |

_JSON: `docs/day02-coverage.json` — أُنشئ بواسطة `scripts/generate-day02-coverage.py`_