# Core Logic Audit Report

## Scope
- Days audited now: Day 01 to Day 09 (logic paths + critical regressions).
- Priority fixes implemented first: binary subtraction, Python indentation support, saved-code library flow, algorithm ordering validation.
- Publication status: **no publish action executed**. `publishedDays` and Render deployment were not changed in this audit work.

## Critical Issues (Priority 1)

### 1) Binary two's complement subtraction
- **Problem**: subtraction behavior and carry/overflow semantics were ambiguous and not validated explicitly in the lab.
- **Location**: `src/lib/numberSystems/twosComplement.js`, `src/components/lesson/TwosComplementLab.jsx`, `src/content/lessons/day02/twosComplementLesson.js`
- **Current behavior before fix**: fixed-width addition returned overflow from extra bit length only; discarded carry and signed overflow checks were not exposed clearly to student validation.
- **Correct behavior**: perform `a + (-b)` in fixed width, discard carry-out, decode signed result, and report signed overflow separately.
- **Fix implemented**:
  - Reworked `subtractViaTwosComplement()` to return `carryOut`, `discardedCarry`, signed `overflow`.
  - Upgraded Two's Complement lab with explicit subtraction checker (student enters bits + value).
  - Clarified bit-width language in guided/independent practice items.
- **Proof tests**:
  - `src/lib/numberSystems/twosComplement.test.js` (new subtraction + overflow assertions)
  - `e2e/core-logic-audit.spec.js` (subtraction acceptance flow)
- **Status**: `fixed`

### 2) Python indentation/if flow in editor
- **Problem**: Enter/Tab behavior did not help students keep valid Python indentation.
- **Location**: `src/components/python/PythonCodeEditor.jsx`, `src/lib/python/indentation.js`, `src/pages/PythonLab.jsx`, `src/lib/pythonErrorHelp.js`
- **Current behavior before fix**: no smart Enter indentation, no guaranteed 4-space Tab insertion in editor flow.
- **Correct behavior**: Enter after `if/else/elif/for/while/def/class` supports indentation; Tab inserts spaces; clear educational remediation.
- **Fix implemented**:
  - Added indentation engine with smart Enter and Tab/Shift+Tab.
  - Added `إصلاح المسافات تلقائيًا` in Python lab.
  - Improved indentation error hint text to direct students to correction flow.
- **Proof tests**:
  - `src/lib/python/indentation.test.js`
  - `e2e/core-logic-audit.spec.js` (auto-fix + save flow)
- **Status**: `fixed`

### 3) Missing saved code library (student + teacher access)
- **Problem**: dashboard displayed snippet count without practical retrieval/management workflows.
- **Location**:
  - Student/Python UI: `src/pages/StudentDashboard.jsx`, `src/pages/PythonLab.jsx`
  - Data flow: `src/context/PlatformContext.jsx`, `src/lib/python/snippets.js`
  - Teacher access API + view: `server/routes/progressRoutes.js`, `src/lib/platformApi.js`, `src/pages/TeacherDashboard.jsx`
- **Current behavior before fix**: count only; no full browsing/editing operations; sync duplicated snippets by append.
- **Correct behavior**: searchable list with preview/open/copy/delete, teacher review path, stable deduplicated sync.
- **Fix implemented**:
  - Added in-Python library panel: search, sort, preview, open in editor, clone-edit, copy, delete.
  - Added student dashboard “saved code library” panel.
  - Added teacher snippet modal and API endpoint.
  - Fixed server progress merge logic to deduplicate snippets/projects by `id` (prevents inflated counts like 50 from sync duplication).
- **Proof tests**:
  - `src/lib/python/snippets.test.js`
  - `server/progress.integration.test.js` (dedup + teacher fetch)
  - `e2e/core-logic-audit.spec.js` (student save + teacher review)
- **Status**: `fixed`

### 4) Algorithm ordering activity false negatives
- **Problem**: activity included distractor steps but validator required full pool exact match, so correct student reasoning could still fail.
- **Location**: `src/components/lesson/AlgorithmStepsLab.jsx`, `src/lib/algorithms/stepOrdering.js`, `src/content/lessons/day02/algorithmsLesson.js`
- **Current behavior before fix**: always compared all rendered rows against exact answer length/order.
- **Correct behavior**: if distractors exist, student can select required steps and order only selected steps.
- **Fix implemented**:
  - Added step selection (checkbox) + ordered validation over selected steps only.
  - Updated instruction text to explicitly tell student to select required steps then order them.
  - Extracted validator into tested utility.
- **Proof tests**:
  - `src/lib/algorithms/stepOrdering.test.js`
  - `e2e/core-logic-audit.spec.js`
- **Status**: `fixed`

## Additional Notes
- Day 01 parity pass surfaced and fixed a worksheet/model-answer mismatch in Hex colors:
  - `FF0000` decimal corrected to `16711680` (was incorrect before),
  - lesson example typo fixed to `#444444`.
- Day 02 parity pass aligned worksheet model answers with actual structured worksheet keys
  (`ws-day-02`, especially items 5/9/10 that previously had generic non-matching model text).
- Day 03 parity pass revealed missing structured worksheet/model-answer artifacts; added
  `ws-day-03` plus teacher model answers and guard tests.
- Day 04 parity pass revealed missing structured worksheet/model-answer artifacts; added
  `ws-day-04` plus teacher model answers and guard tests.
- Day 05 parity pass revealed missing structured worksheet/model-answer artifacts; added
  `ws-day-05` plus teacher model answers and guard tests.
- Day 06 parity pass audited existing `ws-day-06` against day-06 lesson/teacher-answer
  keys and added worksheet guard tests for FCFS/Caesar/memory answer stability.
- Lesson-depth continuity audit (days 06–15): detailed lesson routes for days 06–09 were
  present but day-page presentation was not unified; fixed with explicit "دروس اليوم" start
  links and added continuity tests. Days 10–15 detailed lesson pages are still missing as
  content backlog (documented in `docs/lesson-depth-continuity-audit.md`).
- E2E environment had intermittent DB file lock (`EPERM ... platform.e2e.db.tmp`) in some runs; tests now include retry-compatible behavior and eventually passed in required suites.
- Teacher preview suite updated for current matching question UI and unpublished-day context.

## Blocker Summary For Publishing
- Critical four student-facing blockers are fixed with unit/integration/E2E coverage.
- Full manual pedagogical audit for every micro-activity across all days is still ongoing and should continue before publish decision.
- Current recommendation: **hold publish decision until full Day 1-9 PDF alignment checklist is fully signed off**.
