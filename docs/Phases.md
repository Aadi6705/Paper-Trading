# Phases.md
## Build Plan — Paper Trading Platform

Build strictly in this order. Do not begin a phase until the previous phase is working end-to-end (not just "code written" — actually runnable and testable). Each phase lists its goal, deliverables, and a definition of done. Update the checkboxes as you go, and log progress in Memory.md at the end of each session.

---

## Phase 0 — Project Setup

**Goal:** A skeleton that runs, with nothing functional yet.

- [x] Initialize `backend/` (Node + Express) and `frontend/` (React + Tailwind) as separate apps in one repo
- [x] Set up PostgreSQL locally (or hosted, e.g. Supabase/Neon/Railway free tier)
- [x] Install and configure Prisma; connect to the database
- [x] Create `.env` / `.env.example` for both apps (DB URL, JWT secret, ports)
- [x] Set up the backend folder structure exactly as in Architecture.md §5
- [x] Set up the frontend folder structure exactly as in Architecture.md §6
- [x] Basic Express server (`server.js` + `app.js`) responding on a health-check route (`GET /api/health`)
- [x] Basic React app boots and can hit `/api/health` successfully
- [x] Git repo initialized, `.gitignore` in place, first commit pushed

**Definition of done:** `npm run dev` on both apps works; frontend can successfully call the backend health check and render the result.

---

## Phase 1 — Authentication

**Goal:** Users can register, log in, and stay logged in.

- [ ] `users` table in Prisma schema + migration
- [ ] `POST /api/auth/register` — hashes password with bcrypt, creates user
- [ ] `POST /api/auth/login` — verifies password, issues JWT
- [ ] `GET /api/auth/me` — returns current user from JWT
- [ ] `authMiddleware` — verifies JWT on protected routes
- [ ] `roleMiddleware` — restricts admin-only routes (used later)
- [ ] Frontend: Login page, Register page, `AuthContext`, token storage
- [ ] Protected route wrapper on the frontend (redirect to login if unauthenticated)

**Definition of done:** A new user can register, log out, log back in, and reach a protected page; an invalid login is rejected with a clear error.

---

## Phase 2 — Virtual Wallet

**Goal:** Every user has a starting virtual balance that's visible and correctly tracked.

- [ ] `wallets` and `transactions` tables in Prisma schema + migration
- [ ] On registration: auto-create a wallet with the starting virtual balance + an `INITIAL_DEPOSIT` transaction
- [ ] `GET /api/wallet` — current cash balance
- [ ] `GET /api/wallet/transactions` — transaction history
- [ ] Frontend: wallet balance visible on Dashboard; a basic Transactions page listing history

**Definition of done:** A new user immediately sees their starting balance and one `INITIAL_DEPOSIT` transaction in their history.

---

## Phase 3 — Market Data

**Goal:** Stocks exist and can be searched, with a price.

- [ ] `stocks` table in Prisma schema + migration; seed with a fixed list (~10–20 stocks)
- [ ] `marketData.service.js` — backend-only integration point for prices (external API or simulated generator; frontend never touches this directly)
- [ ] `GET /api/stocks` — list all stocks with current price
- [ ] `GET /api/stocks/:symbol` — single stock detail
- [ ] `GET /api/stocks/:symbol/history` — (can be simplified/mocked if the external API is limited)
- [ ] Frontend: Markets page (search/list), StockDetails page

**Definition of done:** A logged-in user can browse and search the fixed stock list and open a stock's detail page showing a current price.

---

## Phase 4 — Trading Engine (core of the project)

**Goal:** Buy and sell orders execute correctly and safely.

- [ ] `orders` and `holdings` tables in Prisma schema + migration
- [ ] `trading.service.js` — implements the Buy flow (Architecture.md §9.1) and Sell flow (§9.3), wrapped in a Prisma transaction
- [ ] Average price recalculation logic (Architecture.md §9.2) in a shared `utils/calculations.js`
- [ ] `POST /api/orders` — place BUY or SELL market order
- [ ] `GET /api/orders`, `GET /api/orders/:id` — order history and detail
- [ ] `order.validator.js` — validate symbol/side/quantity/orderType on the request
- [ ] Insufficient funds and insufficient holdings are rejected with clear errors, no partial state changes
- [ ] Frontend: OrderForm component, Buy/Sell actions on StockDetails, Orders page listing history

**Definition of done:** A user can buy a stock (cash decreases, holding appears, order shows EXECUTED, transaction logged), and sell it back (cash increases, holding reduces/disappears, second transaction logged). Attempting to overspend or oversell is cleanly rejected.

---

## Phase 5 — Portfolio Management

**Goal:** Holdings and portfolio totals are visible and accurate.

- [ ] `GET /api/portfolio` — summary (cash, invested capital, portfolio value, total P&L, return %)
- [ ] `GET /api/portfolio/holdings` — per-stock holdings with current value and P&L
- [ ] `portfolio.service.js` — implements valuation formulas (Architecture.md §9.4)
- [ ] Frontend: Portfolio page — summary cards + holdings table

**Definition of done:** Portfolio totals always reconcile: `portfolio_value = cash_balance + Σ holding current values`, and this is verified against the wallet and holdings tables directly (e.g. via Postman) at least once.

---

## Phase 6 — Analytics & Dashboard

**Goal:** The dashboard tells a visual story, not just numbers in a table.

- [ ] `GET /api/analytics/pnl`, `/allocation`, `/performance`
- [ ] `analytics.service.js` — aggregates data for charts
- [ ] Frontend: Dashboard page assembled — summary cards, holdings table, performance chart (Recharts), allocation chart

**Definition of done:** Dashboard loads with real user data and updates correctly immediately after a trade (no stale numbers, no manual refresh required beyond a standard re-fetch).

---

## Phase 7 — Admin Panel

**Goal:** A read-only oversight view for evaluation/demo purposes.

- [ ] `GET /api/admin/users`, `/orders`, `/transactions` — protected by `roleMiddleware` (ADMIN only)
- [ ] Seed or manually promote one user to `ADMIN` role
- [ ] Frontend: simple Admin pages (tables, no editing required for core scope)

**Definition of done:** An ADMIN-role user can view platform-wide users/orders/transactions; a USER-role account is blocked (403) from these routes.

---

## Phase 8 — Polish & Submission Readiness

**Goal:** The project is stable, presentable, and explainable.

- [ ] Apply Design.md consistently across all pages
- [ ] Add loading and error states to every API-driven view
- [ ] Basic input validation and helpful error messages throughout
- [ ] Write/update `README.md` with setup instructions
- [ ] Do a full manual test pass through every Core feature in PRD.md §6
- [ ] Prepare the "Complete Buy-Order Flow" diagram (Architecture.md §9.1) as a talking point for the viva
- [ ] Confirm the app runs from a clean clone (fresh `npm install`, fresh migration) before submission

**Definition of done:** A fresh checkout of the repo can be installed, migrated, seeded, and run by someone else following only the README, and every Core feature works.

---

## Phase 9 — Bonus (optional, only if time remains)

Pick from PRD.md §7 (watchlists, limit orders, leaderboard, notifications, etc.). Treat each bonus feature as its own mini-phase with its own definition of done. Never start this phase before Phase 8 is complete.

---

## How to use this file with an AI assistant

- Tell the assistant which phase you're on at the start of a session (or point it to Memory.md).
- Don't ask for "the whole app" in one prompt — ask phase by phase, feature by feature within a phase.
- When a phase's checklist is fully checked and its Definition of Done is verified, update Memory.md before moving to the next phase.
