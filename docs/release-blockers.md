# Release Blockers

## Current Decision
- **Do not publish now** until final full Day 1-9 pedagogical parity review is signed off.

## Blocker Matrix

- **B1 — Binary subtraction / two's complement logic**
  - Risk: wrong math/validation in core concept.
  - State: fixed in code + tests.
  - Status: `fixed`

- **B2 — Python indentation student experience**
  - Risk: false learner failure due editor friction.
  - State: smart Enter/Tab + auto-fix + hint updates.
  - Status: `fixed`

- **B3 — Saved code access (student + teacher)**
  - Risk: learning artifacts saved but not retrievable; teacher cannot review.
  - State: library UI + teacher endpoint + dedup sync fix.
  - Status: `fixed`

- **B4 — Algorithm ordering false negatives**
  - Risk: correct student logic marked wrong.
  - State: selectable-step validator implemented.
  - Status: `fixed`

- **B5 — Full PDF parity audit across all days**
  - Risk: hidden mismatches in content/answer keys outside priority fixes.
  - State: started; not complete for every item.
  - Status: `needs-review`

## Test Gate Snapshot
- `npm test` -> passed.
- `npm run build` -> passed.
- E2E gates run and passed:
  - `test:e2e:pilot`, `test:e2e:day01`, `test:e2e:day02`, `test:e2e:python`,
    `test:e2e:worksheets`, `test:e2e:teacher`, `test:e2e:day06`, `test:e2e:day07`,
    `test:e2e:day08`, `test:e2e:day09`.
- Note: some runs showed transient Windows DB file-lock retries (`EPERM ... platform.e2e.db.tmp`) but final suite statuses passed.

## Recommendation
- Keep publication paused.
- Finish full lesson-by-lesson PDF answer-key parity checklist.
- Re-run full gate once parity checklist is completed, then decide on publishing.
