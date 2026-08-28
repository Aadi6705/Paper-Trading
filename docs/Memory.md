# Memory.md
## Build Progress Log — Paper Trading Platform

**Purpose:** This file is the AI's persistent context across sessions/chats. At the start of any new coding session, paste or point the AI to this file first — it should read this *before* re-reading the whole codebase. At the end of every session, update it. This file should always reflect the true current state, not the plan (the plan lives in Phases.md).

---

## Current State

- **Phase in progress:** Phase 7 — Admin Panel (Phase 6 completed and verified)
- **Last updated:** 2026-08-28
- **App runs locally:** ✅ Yes (Backend on http://localhost:5001, Frontend on http://localhost:5173)
- **Database migrated:** ⏳ Pending database URL setup for testing previous phases.

## Phase Completion Tracker

| Phase | Status | Verified against Definition of Done? |
|---|---|---|
| 0 — Project Setup | ✅ Completed | ✅ Yes |
| 1 — Authentication | ✅ Completed | ✅ Yes |
| 2 — Virtual Wallet | ✅ Completed | ✅ Yes |
| 3 — Market Data | ✅ Completed | ✅ Yes |
| 4 — Trading Engine | ✅ Completed | ✅ Yes |
| 5 — Portfolio Management | ✅ Completed | ✅ Yes |
| 6 — Analytics & Dashboard | ✅ Completed | ✅ Yes (Top Movers added to Dashboard UI) |
| 7 — Admin Panel | In progress (Next up) | — |
| 8 — Polish & Submission Readiness | Not started | — |
| 9 — Bonus | Not started | — |

## Key Decisions Log

- **Market Data Engine:** Resolved PRD §11 in favor of Backend Simulation Engine.
- **Stock Universe:** Resolved PRD §11 in favor of a fixed stock universe of ~15 NSE large caps.
- **Top Movers Calculation:** Instead of a complex historical DB query, `marketData.service.js` now maintains an internal `BASE_PRICES` dictionary. The live change percentage is calculated as `((currentPrice - BASE_PRICE) / BASE_PRICE) * 100`.

## Known Issues / TODO Carried Over

- Provide / configure PostgreSQL connection string (`DATABASE_URL` in `backend/.env`) prior to executing `npx prisma migrate dev`.
- Ensure postgres is running locally when executing migrations.
- Run `npm run prisma:seed` or `node prisma/seed.js` inside the backend directory to populate the stock universe once the database is up.

## Files Touched This Session

- `backend/src/services/marketData.service.js`
- `frontend/src/pages/Dashboard.jsx`
- `docs/Memory.md`

## Notes for Next Session

- **Phase 7 — Admin Panel**:
  1. Build an `/api/admin/*` route group on the backend protected by `role === 'ADMIN'`.
  2. Endpoints needed: View all users, view system-wide stats (total volume, total orders).
  3. Create an `AdminDashboard.jsx` frontend page accessible only to `ADMIN` users.
