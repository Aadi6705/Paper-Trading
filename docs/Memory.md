# Memory.md
## Build Progress Log — Paper Trading Platform

**Purpose:** This file is the AI's persistent context across sessions/chats. At the start of any new coding session, paste or point the AI to this file first — it should read this *before* re-reading the whole codebase. At the end of every session, update it. This file should always reflect the true current state, not the plan (the plan lives in Phases.md).

---

## How to update this file (rules for the AI)

- Update this file at the **end of every session**, before ending the conversation.
- Keep the "Current State" section accurate above all else — it's the first thing read next session.
- Log only what actually happened (files created, decisions made, bugs found/fixed) — not intentions or plans (those belong in Phases.md).
- When a Phase is completed and verified against its Definition of Done in Phases.md, mark it complete here and move the "Currently working on" pointer to the next phase.
- Keep a running "Known Issues" list so nothing gets silently forgotten between sessions.
- If a decision is made that changes something in Architecture.md, Rules.md, or Design.md, update that source file too — don't let Memory.md and the spec files drift apart.

---

## Current State

- **Phase in progress:** Phase 1 — Authentication (Phase 0 completed and verified)
- **Last updated:** 2026-08-27
- **App runs locally:** ✅ Yes (Backend on http://localhost:5001, Frontend on http://localhost:5173)
- **Database migrated:** ⏳ Pending database connection URL in backend/.env for Phase 1 migrations (Prisma client generated)

## Phase Completion Tracker

| Phase | Status | Verified against Definition of Done? |
|---|---|---|
| 0 — Project Setup | ✅ Completed | ✅ Yes (`npm run dev` on both apps works, frontend calls `GET /api/health` and displays healthy status) |
| 1 — Authentication | In progress (Next up) | — |
| 2 — Virtual Wallet | Not started | — |
| 3 — Market Data | Not started | — |
| 4 — Trading Engine | Not started | — |
| 5 — Portfolio Management | Not started | — |
| 6 — Analytics & Dashboard | Not started | — |
| 7 — Admin Panel | Not started | — |
| 8 — Polish & Submission Readiness | Not started | — |
| 9 — Bonus | Not started | — |

## Key Decisions Log

- **Market Data Engine:** Resolved PRD §11 in favor of Option A (Backend Simulation Engine in `marketData.service.js` with random walk / GBM anchored to real starting base prices and historical candlestick data) for 100% reliability during demos and zero API rate-limit risks.
- **Stock Universe & Currency:** Resolved PRD §11 in favor of Option A (~15–20 curated Indian Large-Cap NSE stocks: `RELIANCE`, `TCS`, `INFY`, `HDFCBANK`, `TATAMOTORS`, `ICICIBANK`, `SBIN`, `ITC`, `LT`, etc.) with INR (`₹`) as the single currency.
- **Starting Virtual Balance:** Resolved PRD §11 in favor of Option A (`₹10,00,000.00` INR) credited upon user registration.
- **Backend Port:** Changed backend default port to `5001` (from 5000) because macOS AirPlay Receiver occupies port 5000 by default. Updated `.env`, `.env.example`, and frontend `VITE_API_BASE_URL` accordingly.

## Known Issues / TODO Carried Over

- Provide / configure PostgreSQL connection string (`DATABASE_URL` in `backend/.env`) prior to executing `npx prisma migrate dev` in Phase 1.

## Files Touched This Session (most recent session)

- `.gitignore`
- `Document/Phases.md`
- `Document/Memory.md`
- `backend/package.json`
- `backend/prisma/schema.prisma`
- `backend/.env`, `backend/.env.example`
- `backend/server.js`, `backend/src/app.js`
- `backend/src/config/database.js`, `backend/src/config/environment.js`
- `backend/src/middleware/error.middleware.js`, `validation.middleware.js`, `auth.middleware.js`, `role.middleware.js`
- `backend/src/routes/health.routes.js`, `auth.routes.js`, `stock.routes.js`, `order.routes.js`, `portfolio.routes.js`, `wallet.routes.js`, `analytics.routes.js`
- `backend/src/controllers/` (all placeholder controllers)
- `backend/src/services/` (all placeholder services)
- `backend/src/models/` (all placeholder models)
- `backend/src/validators/auth.validator.js`, `order.validator.js`
- `backend/src/utils/asyncHandler.js`, `calculations.js`, `jwt.js`
- `frontend/package.json`, `frontend/vite.config.js`, `frontend/tailwind.config.js`, `frontend/postcss.config.js`, `frontend/index.html`
- `frontend/.env`, `frontend/.env.example`
- `frontend/src/index.css`, `frontend/src/main.jsx`, `frontend/src/App.jsx`
- `frontend/src/services/authApi.js`, `stockApi.js`, `orderApi.js`, `portfolioApi.js`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/utils/formatters.js`
- `frontend/src/components/` (all placeholder components)
- `frontend/src/pages/` (all placeholder pages)

## Notes for Next Session

- Begin **Phase 1 — Authentication**:
  1. Apply Prisma migration for `User` model.
  2. Implement `auth.service.js` (registration, password hashing with bcrypt, login with JWT issuance, `getMe`).
  3. Implement `auth.controller.js`, `auth.routes.js`, `auth.middleware.js`, and `role.middleware.js`.
  4. Build Login and Register UI pages in frontend and wire up `AuthContext` and protected routes.
