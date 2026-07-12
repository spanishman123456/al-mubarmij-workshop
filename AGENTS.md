# al-mubarmij-workshop (ورشة المبرمج)

Arabic (RTL) educational SPA: Vite + React 19 + Tailwind v4, with a small Express analytics API. Standard dev/build/lint/test commands live in `package.json` `scripts`.

## Cursor Cloud specific instructions

- Node 22 is available and works with Vite 8 / React 19; no version switching needed.
- Two independent dev processes:
  - Frontend: `npm run dev` (Vite dev server on port `5173`).
  - Analytics API: `npm run dev:server` (Express on port `3001`). Run it separately — `npm run dev` does NOT start it.
  - Vite proxies `/api/*` to `http://localhost:3001` (see `vite.config.js`), so the frontend needs the analytics server running for login/analytics persistence to work end-to-end.
- The Express server only serves the built SPA when `NODE_ENV=production` (uses `dist/`). In dev, use the Vite server for the UI and the Express server just for `/api`.
- Auth is client-side against hardcoded data (no external DB/secrets):
  - Student login = a national ID from `src/data/studentsRoster.js` (e.g. `1165814631`). Entered on the default "دخول الطالب" tab.
  - Teacher login = national ID `2297033843` + a password (SHA-256 hashed in `src/data/demoUsers.js`; plaintext not in repo).
- Analytics are persisted to `server/data/analytics.json` (gitignored). Delete that file to reset state; inspect via `GET /api/analytics/all`.
- `npm run lint` currently reports pre-existing errors/warnings in the app source (e.g. `react-hooks` rules). These are not environment issues.
- `npm run test:makecode-compile` (MakeCode game compile check) reaches out to external tooling/CDN and is not needed for normal dev.
