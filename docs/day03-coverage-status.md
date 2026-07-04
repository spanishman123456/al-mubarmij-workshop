# حالة تغطية اليوم الثالث

**حدود اليوم 3:** pdfPageIndex ~152–174
**الحالة العامة:** ⏳ **غير مكتمل** — `implementationStatus` منفصل عن `integrationMode`.

> **merged** = طريقة دمج المحتوى — **لا يعني اكتمالاً تلقائياً**. راجع `implementationStatus`.

| # | الموضوع | pdf | print | implementation | integration | mergedInto | qa | المتبقي |
|---:|---|---:|---:|---|---|---|---|---|
| 1 | الثوابت في بايثون | 152 | 153 | **done** | standalone | — | passed | — |
| 2 | المصفوفات متعددة الأبعاد | 154 | 155 | **done** | standalone | — | passed | — |
| 3 | الفهرسة والوصول والتعديل | 154 | 155 | **done** | merged | `python-multi-arrays` | passed | — |
| 4 | break و continue و pass | 156 | 157 | **done** | standalone | — | passed | — |
| 5 | else المرتبطة بالحلقة | 157 | 158 | **done** | merged | `python-break-continue` | passed | — |
| 6 | نشاط المقسومات | 170 | 171 | **done** | activity | `divisors-activity` | passed | — |
| 7 | تخمين Collatz | 172 | 173 | **done** | standalone | — | passed | — |
| 8 | نشاط الأرقام والخطوات | 173 | 174 | **partial** | merged | `collatz` | not-tested | محاكاة أرقام/خطوات منفصلة عن Collatz |
| 9 | اشتقاق جداول الحقيقة | 160 | 161 | **done** | merged | `truth-tables` | passed | — |
| 10 | الدليل المرجعي لجداول الحقيقة والمنطق | 158 | 159 | **done** | merged | `truth-tables` | passed | — |
| 11 | جداول الحقيقة | 160 | 161 | **done** | standalone | — | passed | — |
| 12 | إجابات جداول الحقيقة | 162 | 163 | **partial** | teacher-only | — | not-tested | صفحة إجابات المعلم |
| 13 | الدليل المرجعي للبوابات المنطقية | 163 | 164 | **done** | merged | `logic-gates` | passed | — |
| 14 | البوابات المنطقية | 165 | 166 | **done** | standalone | — | passed | — |
| 15 | إجابات البوابات المنطقية | 167 | 168 | **partial** | teacher-only | — | not-tested | صفحة إجابات المعلم |
| 16 | المحتوى والإرشادات المخصصة للمعلم | 169 | 170 | **partial** | teacher-only | — | not-tested | إرشادات تدريس موسّعة |

## ملخص implementationStatus

| الحالة | العدد |
|---|---:|
| done | 12 |
| partial | 4 |

## ملخص integrationMode

| الوضع | العدد |
|---|---:|
| standalone | 6 |
| merged | 6 |
| activity | 1 |
| teacher-only | 3 |

## ملخص qaStatus

| QA | العدد |
|---|---:|
| passed | 12 |
| not-tested | 4 |
