# Question/Answer Logic Audit

## Scope
- Guided practice
- Independent practice
- Quick checks
- Structured worksheet grading
- Snippet-linked Python practice flow

## Findings
- Some legacy practice items were still sensitive to formatting variants.
- Mixed-line prompts made otherwise correct logical answers harder to parse.
- High-risk boolean/comparison items needed explicit expression blocks.

## Fixes Implemented
- Added shared answer-equivalence utility:
  - `src/lib/assessment/lessonAnswerEquivalence.js`
  - handles Arabic numerals and boolean equivalents.
- Updated `LessonPractice` validator to:
  - accept equivalent forms (`True/صح/1`, `False/خطأ/0`)
  - honor `acceptedAnswers` for legacy items.
- Added structured expression metadata for critical prompts in:
  - truth tables
  - if statement checks/practices

## Test Evidence
- `src/lib/assessment/lessonAnswerEquivalence.test.js`
- Existing worksheet and assessment tests remain compatible.

## Remaining Audit Work
- Full pass over all content banks (days 1-15) to standardize mixed prompts to structured fields.
- Add deterministic validation snapshots for all high-risk topics.

## Status
- `fixed` (validator normalization and high-risk lessons)
- `needs-review` (full-bank structured migration)

