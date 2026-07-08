# Lesson Depth Continuity Audit (Days 06–15)

## Scope
- Verified day-path pages: `/path/day/day-06` ... `/path/day/day-15`.
- Verified detailed lesson routes under `/lessons/*`.
- Verified teacher/student visibility policy and publication gating.
- Verified structural depth fields in day 06–09 lesson content objects.

## Root Cause
1. **Day page rendering gap (UX/ربط عرض)**  
   The day page used scattered hardcoded blocks per day, so "lesson entry points" were not presented in a unified, explicit "start lesson" pattern.
2. **Content coverage gap (محتوى غير موجود أصلًا)**  
   Days 10–15 in `curriculum15Days` had day summaries only; no detailed lesson files, no lesson routes, and no teacher answer pages for those day lessons.
3. **Validation scope gap (اختبارات الحماية)**  
   Existing depth validation focused on older catalog slices and did not enforce continuity checks for days 06–15 route linkage.

## Comparison: Days 1–5 vs Days 6–15
- **Days 1–5**: detailed lessons + routes + visible links from day page.
- **Days 6–9 (before fix)**: detailed lessons/routes existed, but day-page presentation was not unified/explicit enough.
- **Days 10–15**: no detailed lesson pages/routes yet (day summary only).

## Day 06–15 Audit Matrix

| Day | Lesson | Route | Detailed explanation | Worked examples | Guided | Independent | Interactive | Quick check | Summary | Teacher view | Student view when published | Matches day 1–5 template | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Day 06 | شفرة قيصر | `/lessons/caesar-cipher` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 06 | الذاكرة والتخزين المؤقت | `/lessons/memory-hierarchy` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 06 | جدولة المعالج | `/lessons/cpu-scheduling` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 07 | Scope | `/lessons/python-scope` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 07 | Dice Random | `/lessons/dice-random` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 07 | Tic-Tac-Toe | `/lessons/tic-tac-toe` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 07 | Game Planning | `/lessons/game-planning` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 08 | Fibonacci | `/lessons/fibonacci-sequence` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 08 | Complexity | `/lessons/algorithm-complexity` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 08 | Tower of Hanoi | `/lessons/tower-of-hanoi` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 08 | Python Files I/O | `/lessons/python-files-io` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 09 | Recursion | `/lessons/python-recursion` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 09 | Fractals Intro | `/lessons/fractals-intro` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 09 | Koch Snowflake | `/lessons/koch-snowflake` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 09 | Sierpinski Triangle | `/lessons/sierpinski-triangle` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (with unlock policy) | Yes | مكتمل |
| Day 10 | — | — | No | No | No | No | No | No | No | Day page only | Day page only (if published) | No | غير موجود أصلًا |
| Day 11 | — | — | No | No | No | No | No | No | No | Day page only | Day page only (if published) | No | غير موجود أصلًا |
| Day 12 | — | — | No | No | No | No | No | No | No | Day page only | Day page only (if published) | No | غير موجود أصلًا |
| Day 13 | — | — | No | No | No | No | No | No | No | Day page only | Day page only (if published) | No | غير موجود أصلًا |
| Day 14 | — | — | No | No | No | No | No | No | No | Day page only | Day page only (if published) | No | غير موجود أصلًا |
| Day 15 | — | — | No | No | No | No | No | No | No | Day page only | Day page only (if published) | No | غير موجود أصلًا |

## Implemented Fixes
1. Added unified day-to-lesson route registry:
   - `src/content/lessons/dayLessonRoutes.js`
2. Refactored day page to always show **"دروس اليوم"** with explicit **"ابدأ الدرس"** buttons:
   - `src/pages/DayLessonPage.jsx`
3. Added unit guards for continuity and depth requirements (days 06–15):
   - `src/content/lessons/dayLessonRoutes.test.js`
4. Added E2E continuity scenarios (teacher + student):
   - `e2e/lesson-depth-continuity.spec.js`

## Files Needing Future Work (for full Day 10–15 parity)
- New detailed lesson content files under:
  - `src/content/lessons/day10/*`
  - `src/content/lessons/day11/*`
  - `src/content/lessons/day12/*`
  - `src/content/lessons/day13/*`
  - `src/content/lessons/day14/*`
  - `src/content/lessons/day15/*`
- New route pages:
  - `src/pages/lessons/Day10LessonPages.jsx` ... `Day15LessonPages.jsx`
- Route wiring:
  - `src/App.jsx`
- Teacher answer pages and API coverage for days 10–15.

## Problem Classification
- **Content**: yes (days 10–15 lessons missing).
- **Routing**: partial (for missing days, no lesson routes exist).
- **Day page UI**: yes (fixed by unifying "دروس اليوم" and start buttons).

## Post-Fix Result (current state)
- Days 06–09 now expose explicit lesson entry points from day page in a unified pattern.
- Clicking lesson links opens full detailed lesson pages.
- Lesson depth continuity is now guarded by unit + E2E tests.
- Days 10–15 remain content gaps (not yet implemented as detailed lessons).
