# Student/Teacher Code Library Flow

## Student Flow
1. Student writes code in `\/python`.
2. Save stores snippet with metadata:
   - title
   - lesson/activity identifiers
   - snippet type
   - created/updated timestamps
3. Student opens `saved library` panel and can:
   - search/filter/sort
   - page through results
   - preview code
   - open in editor
   - copy
   - rename
   - delete (confirm)

## Teacher Flow
1. Teacher opens `\/teacher` dashboard.
2. Selects student in quick-access snippets panel.
3. Dashboard fetches snippets from server endpoint:
   - `GET /api/teacher/students/:studentId/python-snippets`
4. Teacher can:
   - search/sort/paginate
   - preview code
   - copy code
   - view lesson/activity metadata for progress evidence

## Reliability Notes
- Student snippets are server-synced via progress APIs.
- Teacher quick-access view depends on selected student fetch, not stale in-memory counts only.

## Status
- `fixed`

