# Update.md
## Paper Trading Platform — Phase 10: Polish, Interaction & Scale-Up

This document extends `Phases.md`. It does **not** replace any existing doc — `Architecture.md`, `Design.md`, `Rules.md`, and `PRD.md` remain the source of truth for stack, layering, and boundaries. This file only defines the *next* phase of work, now that Phases 0–9 are complete and verified (per `Memory.md`).

**Do not treat this as a rewrite.** The app is functionally done end-to-end. This phase is additive polish and hardening — small, targeted diffs, not a redesign.

---

## 0. Why this phase exists

The functional build is complete (auth, wallet, trading engine, portfolio, analytics, admin, SSE live prices). What's missing before this is submission/demo-ready at a "professional" bar is:

- Motion and feedback — the UI currently updates state instantly with no transition, so trades and live price ticks feel abrupt.
- Depth in the data visualization — Recharts is wired for basic charts but not yet used to its full potential (tooltips, gradients, comparative views).
- Micro-UX gaps — no confirmation step before an order, no toast notifications, no optimistic UI, no skeleton loaders on slower fetches, no empty/error states in a few views (visible in the current Order History and Portfolio screenshots — no pagination, no visual hierarchy between repeated rows).
- Consistency debt — a few surfaces don't yet fully match `Design.md` (e.g. repeated identical BUY rows in Order History have no grouping/summary, portfolio table lacks sparkline/trend indicators).

None of this changes scope in the PRD sense — it's Design.md and Rules.md §4/§5 being applied more thoroughly, plus new Phase 10 checklist items.

---

## 1. Motion & Micro-interactions

- [ ] Animate numeric changes (Net Worth, Available Cash, P&L, LTP) with a brief count-up/count-down transition on change, not an instant re-render.
- [ ] Add enter/exit transitions (fade + slight translate) for cards and table rows using Tailwind transition utilities — no new animation library unless justified.
- [ ] Skeleton loaders (per `Design.md` §5) on every card/table that fetches on mount — Dashboard, Portfolio, Orders, Transactions, Markets.
- [ ] Toast notification system for trade success/failure, session expiry, and admin actions — replace any silent state updates.
- [ ] Hover states on all interactive rows/cards (`bg-surface-raised`, per Design.md tokens) — currently static.
- [ ] Live SSE price ticks should flash the changed cell briefly (green/red per Design.md `success`/`danger`) instead of silently repainting the number.

## 2. Data Visualization Upgrades

- [ ] Portfolio performance chart: switch from a flat line to a gradient area chart (`success`/`danger` shaded fill under/over the initial-deposit baseline), with a hover crosshair + tooltip showing date/value.
- [ ] Add per-holding sparklines (7-day mini trend) in the Holdings table — small inline Recharts `LineChart`, no axes.
- [ ] Allocation donut chart: add hover-to-highlight segment + center label showing total portfolio value.
- [ ] Stock detail page: add a simple historical price chart if `GET /api/stocks/:symbol/history` isn't already rendered visually.
- [ ] All charts must keep using only `brand-primary`/`success`/`danger` tokens — no new ad hoc colors (Rules.md / Design.md still apply here).

## 3. Trading UX Hardening

- [ ] Add a confirmation step (modal or inline expand) before submitting a BUY/SELL order, showing symbol, qty, estimated price, and estimated total — this also reduces accidental duplicate orders (visible in the current Order History: multiple 1-share RELIANCE buys seconds apart suggest the current Buy button has no debounce/confirmation).
- [ ] Debounce/disable the Buy/Sell button while a request is in flight to prevent double-submission.
- [ ] Optimistic UI: reflect the wallet/holding change immediately on submit, then reconcile with the server response; roll back visually on rejection with a toast explaining why.
- [ ] Order History: collapse/group rapid identical repeat orders for the same symbol+side within a short window into a single expandable row (display only — the underlying `orders` rows are unchanged; do not alter Architecture.md's data model to do this).
- [ ] Add pagination or infinite scroll to Orders and Transactions tables once row count grows past ~20.

## 4. Visual Consistency Pass (Design.md compliance)

- [ ] Audit every page against `Design.md` §2–§6 — confirm tabular-nums are actually applied to all numeric columns (Portfolio, Orders, Wallet).
- [ ] Ensure every empty-state case (no holdings, no orders, no transactions) has the icon + text + CTA pattern specified in `Design.md` §5 — several currently just render an empty table.
- [ ] Standardize badge styling for order status/side across Orders, Transactions, and Admin views (single shared `<Badge>` component, not per-page markup).
- [ ] Confirm `lucide-react` (or the chosen icon set) is used consistently — no mixed icon sources.
- [ ] Responsive pass on mobile widths for Portfolio and Orders tables (horizontal scroll container or stacked-card fallback below `sm`), per Design.md §1's mobile requirement for core pages.

## 5. Performance & Code Health

- [ ] Introduce a client-side data-fetching/caching layer (e.g. React Query / TanStack Query) if not already present, to de-duplicate refetches and support the optimistic-update pattern in §3 — flag this as a new dependency for approval per Rules.md §1 before adding it.
- [ ] Memoize expensive derived calculations on the frontend (portfolio totals, allocation %) so they aren't recomputed on every SSE tick.
- [ ] Confirm every wallet/holding-mutating endpoint is still wrapped in `prisma.$transaction` (Architecture.md §11) — re-verify, don't assume, since new UI work often tempts shortcuts on the backend too.
- [ ] Add a basic React error boundary around the Dashboard/Portfolio/Orders routes so a single failed widget doesn't blank the page.

## 6. Optional / Only if time remains

Pick from `PRD.md` §7 bonus list, in this order of "polish value per effort": Watchlist → Leaderboard → Market news feed. Do not start these before §1–§5 above are done, per `Rules.md` §3.

---

## How to use this file

1. Read `Rules.md`, `Architecture.md`, `Design.md` first — they still govern every change made here.
2. Work top-to-bottom through §1–§5; treat each checklist item as its own small diff, not a batch rewrite.
3. Update `Memory.md` at the end of each session, same as every prior phase.
4. Add this phase to `Phases.md` as **Phase 10 — Polish, Interaction & Scale-Up**, with these checklists as its content, once work begins.
