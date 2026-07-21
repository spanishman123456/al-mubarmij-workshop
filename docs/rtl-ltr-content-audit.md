# RTL/LTR Content Audit

## Problem
Mixed Arabic + English technical tokens (`if`, `AND`, `True`, `a = 3`) were rendered in a way that could visually reorder symbols, causing ambiguous reading for students.

## Root Cause
- Token isolation depended on a CSS utility class that was not guaranteed to apply effective `unicode-bidi: isolate`.
- Many prompts were single mixed lines with expression/value content embedded in Arabic prose.

## Fixes Implemented
- Added reusable bidi components:
  - `LtrInlineToken`
  - `LtrCodeBlock`
  - `CodeExpression`
  - `LogicExpression`
  - `MathExpression`
  - `BilingualPrompt`
- Enforced explicit LTR styles for technical blocks:
  - `direction: ltr`
  - `unicode-bidi: isolate`
  - `text-align: left`
- Added tokenizer utility:
  - `src/lib/bidi/directionalTokens.js`
- Updated renderer surfaces:
  - `LessonPractice`
  - `QuizQuestionRenderer`
  - `WorksheetTaskInput`
  - `StandardLessonPage` quick-check and worked examples

## Additional Content Structuring
- Introduced structured prompt fields for high-risk lessons (`expression`, `values`, `code`) to avoid ambiguous mixed lines.
- Applied to:
  - `day03/truthTablesLesson`
  - key checks/practices in `day02/ifStatementLesson`

## Affected Users
- Student: fixed
- Teacher: fixed

## Validation
- Unit: `src/lib/bidi/directionalTokens.test.js`
- Visual checks required in staging for:
  - truth-table lessons
  - if-statement lesson
  - worksheet prompt rendering

## Status
- `fixed` (core renderer layer)
- `needs-review` (full content-bank normalization across all days)

