# Release Blockers

## Critical
- Complete full content-bank migration to structured bilingual prompts (`expression/values/code`) for all remaining mixed-line items.
- Complete PDF row-level parity sign-off for all high-risk answer keys.

## High
- Add integration + E2E coverage for:
  - structured expression rendering in quizzes and worksheets
  - student snippet pagination and delete-confirm flow
  - teacher snippet browsing (search/sort/page)

## Medium
- Add admin visibility dashboard for snippet ingestion counts per student/day to catch missing-save anomalies early.
- Add explicit read-only snippet modal in teacher dashboard (optional UX enhancement).

## Non-blocked Decisions
- No Render branch changes in this patch.
- No `publishedDays` change in this patch.
- No new day content started in this patch.

## Status Summary
- `fixed`: core code-library UI and bidi renderer layer
- `needs-review`: full content-bank/PDF parity closure

