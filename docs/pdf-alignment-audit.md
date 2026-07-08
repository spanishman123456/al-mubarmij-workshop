# PDF Alignment Audit

## Source Of Truth
- Official reference: `C:\Users\hosam\OneDrive\Desktop\برمجة الحاسب.pdf`.
- Audit baseline uses PDF anchors already present in lessons/worksheets plus direct extracted-text checks from the file.

## Fixed High-Risk Alignment Items
- **Day 02 — Two's complement subtraction path**: fixed-width semantics, discarded carry, signed overflow behavior now explicit and tested.
- **Python If indentation support**: editor behavior now aligns with expected teaching flow for block syntax in Python.
- **Algorithm ordering activity**: validation now accepts selected correct steps in correct order when distractors exist.

## Day-By-Day PDF Parity Checklist (Days 1–9)

### Day 01
- **Topics and lesson sequence vs PDF TOC anchors**: `fixed`
- **Binary conversions/matching answer keys vs worksheet refs (`ws-day-01`)**: `fixed`
- **Python intro examples expected output parity**: `needs-review`
- **Hex color decimal mapping correctness (`FF0000`) in worksheet/model answers**: `fixed`
- **Hex example notation typo in lesson (`#4444` -> `#444444`)**: `fixed`
- **Teacher answers visibility isolation (student blocked)**: `fixed`

### Day 02
- **Two's complement subtraction/carry/overflow logic**: `fixed`
- **`if statement` instructional flow and indentation support**: `fixed`
- **Algorithm steps activity logic and validation**: `fixed`
- **Worksheet (`ws-day-02`) vs model-answer key alignment check**: `fixed`
- **All day-02 lesson narrative/examples line-by-line wording parity vs PDF pages 93–127**: `needs-review`
- **Manual pedagogical sign-off for every solved example wording**: `blocked` (requires human curriculum review)

### Day 03
- **Numbers steps/Collatz/divisors activity expected answers**: `needs-review`
- **Truth table and logic-gates exercise keys vs PDF**: `needs-review`
- **Structured worksheet + teacher model answers availability (`ws-day-03`)**: `fixed`
- **Worksheet (`ws-day-03`) vs model-answer key alignment check**: `fixed`
- **Teacher answer isolation**: `fixed`

### Day 04
- **Logic equivalence and Karnaugh map answer-model parity**: `needs-review`
- **Loop/tuples activity validation for alternative correct forms**: `needs-review`
- **Structured worksheet + teacher model answers availability (`ws-day-04`)**: `fixed`
- **Worksheet (`ws-day-04`) vs model-answer key alignment check**: `fixed`
- **Teacher answer isolation**: `fixed`

### Day 05
- **Linear/Binary search and sorting expected-answer logic**: `needs-review`
- **Sieve activity step correctness vs PDF path**: `needs-review`
- **Structured worksheet + teacher model answers availability (`ws-day-05`)**: `fixed`
- **Worksheet (`ws-day-05`) vs model-answer key alignment check**: `fixed`
- **Worksheet/quiz answer-key consistency**: `needs-review`

### Day 06
- **Caesar/memory/CPU scheduling activity parity with worksheet refs (`ws-day-06`)**: `fixed`
- **Practice validation (guided/independent) tolerance and correctness**: `needs-review`
- **Teacher answer isolation**: `fixed`

### Day 07
- **Scope/random/tic-tac-toe/game-planning answer-checking parity**: `needs-review`
- **Worksheet refs (`ws-day-07`) and model answers match check**: `needs-review`
- **Teacher answer isolation**: `fixed`

### Day 08
- **Fibonacci/complexity/Hanoi/File I/O activity expected results parity**: `needs-review`
- **Worksheet refs (`ws-day-08`) and model answers match check**: `needs-review`
- **Teacher answer isolation**: `fixed`

### Day 09
- **Recursion/fractals lesson and activity parity with worksheet refs (`ws-day-09`)**: `needs-review`
- **Teacher day-09 answer-key parity and student blocking**: `needs-review`
- **Teacher answer isolation**: `fixed`

## Cross-Cutting Gaps Still Open
- Full row-by-row comparison of all worksheet model answers against PDF source pages for days 1–9.
- Full quiz-key parity audit (question stem, expected answer, validator behavior) for days 1–9.
- Stabilize text-dependent E2E assertions by adding/using deterministic `data-testid` in remaining pages.

## Current Recommendation
- Keep release paused.
- Continue parity pass day-by-day until every checklist item above is either `fixed` or explicitly accepted with curriculum sign-off.

## Next Execution Queue (Day-By-Day)
- **Day 01**: worksheet key verification (`ws-day-01`) -> lesson sample output check -> teacher answer file check.
- **Day 02**: remaining worksheet rows (`ws-day-02`) + all guided/independent answer lines in `if` and conversion lessons.
- **Day 03**: collatz/divisors/numbers-steps validator parity + worksheet model-answer cross-check.
- **Day 04**: Karnaugh/equivalence activity keys + alternative-valid-answer acceptance tests.
- **Day 05**: search/sort/sieve answer-key and validator deep pass.
- **Day 06**: Caesar/memory/CPU worksheet and quiz parity check.
- **Day 07**: scope/random/tic-tac-toe/game-planning answer and validation pass.
- **Day 08**: fibonacci/complexity/hanoi/file-io expected answer and edge-case pass.
- **Day 09**: recursion/fractals worksheet+teacher key parity completion.
