# Interactive Activities Audit

## Targeted Activities (Priority Fixes)

### Two's Complement Lab (`twos-complement`)
- **Problem**: limited validation depth for subtraction/carry/overflow.
- **Fix**: added subtraction checker with fixed-width semantics and feedback on discarded carry + signed overflow.
- **Status**: `fixed`

### Algorithm Steps Lab (`algorithms`)
- **Problem**: distractor steps could cause false negative even when student reasoning was valid.
- **Fix**:
  - selectable required steps + ordering validation for selected subset.
  - explicit instruction updated in lesson content.
- **Status**: `fixed`

## Validation Logic Tests
- `src/lib/algorithms/stepOrdering.test.js`
- `src/lib/numberSystems/twosComplement.test.js`
- `e2e/core-logic-audit.spec.js`

## Remaining Audit Work
- Verify every interactive activity from Day 01..09 against PDF exact wording/expected-answer model.
- Add stable `data-testid` coverage to activities still selected by text-only assertions.
- **Status**: `needs-review`
