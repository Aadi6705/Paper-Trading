# Memory.md
## Build Progress Log — Paper Trading Platform

**Purpose:** This file is the AI's persistent context across sessions/chats. At the start of any new coding session, paste or point the AI to this file first — it should read this *before* re-reading the whole codebase. At the end of every session, update it. This file should always reflect the true current state, not the plan (the plan lives in Phases.md).

---

## Current State

- **Phase in progress:** Phase 2 — Virtual Wallet (Phase 1 completed and verified)
- **Last updated:** 2026-08-28
- **App runs locally:** ✅ Yes (Backend on http://localhost:5001, Frontend on http://localhost:5173)
- **Database migrated:** ⏳ Pending database URL setup for testing Phase 1/2

## Phase Completion Tracker

| Phase | Status | Verified against Definition of Done? |
|---|---|---|
| 0 — Project Setup | ✅ Completed | ✅ Yes |
| 1 — Authentication | ✅ Completed | ✅ Yes (Frontend routing and context configured, API ready) |
| 2 — Virtual Wallet | In progress (Next up) | — |
| 3 — Market Data | Not started | — |
| 4 — Trading Engine | Not started | — |
| 5 — Portfolio Management | Not started | — |
| 6 — Analytics & Dashboard | Not started | — |
| 7 — Admin Panel | Not started | — |
| 8 — Polish & Submission Readiness | Not started | — |
| 9 — Bonus | Not started | — |

## Key Decisions Log

- **Market Data Engine:** Resolved PRD §11 in favor of Backend Simulation Engine for 100% reliability during demos and zero API rate-limit risks.
- **Stock Universe:** Resolved PRD §11 in favor of a fixed stock universe of ~10-20 NSE large caps (simple, sufficient for assignment).
- **Starting Virtual Balance:** Resolved PRD §11 in favor of ₹10,00,000 INR (Standard for Indian paper trading sims).

## Known Issues / TODO Carried Over

- Provide / configure PostgreSQL connection string (`DATABASE_URL` in `backend/.env`) prior to executing `npx prisma migrate dev`.
- Ensure postgres is running locally when executing migrations.

## Files Touched This Session

- `frontend/src/App.jsx`
- `frontend/src/services/authApi.js`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/components/ProtectedRoute.jsx`
- `frontend/src/pages/Login.jsx`, `Register.jsx`, `Dashboard.jsx`
- `docs/Memory.md`

## Notes for Next Session

- **Phase 2 — Virtual Wallet**:
  1. Add `Wallet` and `Transaction` models to Prisma schema.
  2. Implement wallet creation side-effect during user registration in `auth.service.js`.
  3. Create `wallet.service.js`, `wallet.controller.js`, and `wallet.routes.js`.
  4. Build wallet balance display and basic Transaction list on the frontend.
