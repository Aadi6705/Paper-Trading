# Product Requirements Document (PRD)
## Paper Trading Platform

**Version:** 1.0
**Owner:** [Your Name]
**Purpose:** University full-stack assignment
**Status:** Draft — ready for build

---

## 1. Overview

The Paper Trading Platform is a simulated stock trading web application. Users register, receive virtual money, search for stocks, place buy/sell orders at simulated market prices, and track their portfolio performance over time. No real money or real brokerage integration is involved anywhere in the system.

The project exists to demonstrate full-stack engineering competency for a university assignment: authentication, a REST API built on an MVC + Service Layer pattern, a relational database with proper relationships, business logic (order execution, average price calculation, P&L), external API integration (market data), and a React frontend with data visualization.

## 2. Problem Statement

Students want to learn how trading platforms work and practice investment strategies without financial risk. There is no requirement for real-time execution accuracy or regulatory compliance — the goal is a believable, functionally correct simulation.

## 3. Target Users

| User | Description | Needs |
|---|---|---|
| Student / Trader (primary) | A user practicing trading strategies | Register, get virtual funds, search stocks, buy/sell, track portfolio and P&L |
| Admin (secondary) | Project owner / evaluator-facing role | View all users, monitor orders and transactions across the platform |

There is no "real broker," "real bank," or "compliance officer" persona — this is intentionally a two-role system (`USER`, `ADMIN`).

## 4. Goals

- Ship a working, demoable full-stack app: React frontend, Node/Express REST API, PostgreSQL database.
- Cleanly demonstrate MVC + Service Layer separation for a viva/evaluation.
- Implement realistic (not necessarily real-time) trading mechanics: virtual wallet, order execution, holdings, average price, transaction history.
- Provide portfolio analytics: total value, P&L, return %, allocation.
- Keep scope achievable within a single-semester assignment timeline.

## 5. Non-Goals (explicitly out of scope)

- Real money, real payments, real brokerage/exchange connectivity.
- Real-time streaming tick data or millisecond-accurate order matching.
- Regulatory/compliance features (KYC, AML, audit filing, etc.).
- Multi-currency support (single currency, e.g. INR, is sufficient).
- Mobile native apps (web-responsive is enough).
- Complex order types beyond MARKET orders in the core build (LIMIT/STOP are bonus only).

## 6. Core Features (Must-Have)

1. **Authentication** — register, login, logout, JWT-based sessions, password hashing (bcrypt).
2. **Virtual Wallet** — every new user starts with a fixed virtual balance (e.g. ₹10,00,000); balance updates on every trade.
3. **Stock Search / Market Data** — list and search a fixed set of stocks; view current simulated price and basic details.
4. **Trading Engine** — place BUY/SELL MARKET orders; validate funds/holdings; execute immediately; update wallet, holdings, and transactions atomically.
5. **Order Management** — view order history and order status (EXECUTED, REJECTED, CANCELLED).
6. **Portfolio Management** — holdings list with quantity, average buy price, current value, unrealized P&L.
7. **Transaction History** — full audit trail of every wallet-affecting event (BUY, SELL, INITIAL_DEPOSIT).
8. **Analytics Dashboard** — total portfolio value, invested capital, available cash, total P&L, return %, allocation breakdown, a performance chart.
9. **Admin Panel** — list all users, view all orders and transactions platform-wide.

## 7. Bonus Features (Nice-to-Have, only after core is complete and stable)

- Watchlists
- LIMIT and STOP-LOSS orders
- Leaderboard across users
- Portfolio comparison between users
- In-app notifications
- Market news feed
- Advanced charting (candlesticks, technical indicators)
- Simple risk score per portfolio
- Paper trading competitions / time-boxed contests

Bonus features must not be started until every core feature works end-to-end and is demoable.

## 8. Key User Flows

### 8.1 Registration & First Login
User registers with name/email/password → backend hashes password and creates `users` row → a `wallets` row is created with the starting virtual balance and an `INITIAL_DEPOSIT` transaction is logged → user logs in → JWT issued → redirected to Dashboard.

### 8.2 Buy Order
User searches a stock → opens stock detail → enters quantity → clicks Buy → frontend calls `POST /api/orders` → backend validates JWT, validates input, fetches current price, checks wallet balance → if sufficient: deducts cash, creates/updates holding (recalculating average price), creates order (EXECUTED) and transaction records → returns updated state → frontend refreshes dashboard.

### 8.3 Sell Order
Same as Buy, but validates the user holds enough quantity instead of enough cash; on execution, credits cash, reduces/removes the holding, logs a SELL transaction.

### 8.4 Portfolio Review
User opens Portfolio page → sees holdings table (qty, avg price, current price, P&L) and summary cards (portfolio value, invested capital, cash, total P&L, return %) plus an allocation/performance chart.

### 8.5 Admin Review
Admin logs in → sees a list of all users, all orders, and all transactions read-only, for evaluation/demo purposes.

## 9. Success Criteria (what "done" looks like)

- A user can register, log in, and see a starting virtual balance.
- A user can search stocks, place a buy order, and see wallet/holdings/transactions update correctly and consistently.
- A user can sell a held stock and see cash return and holdings reduce (or be removed if fully sold).
- Average buy price recalculates correctly across multiple buys of the same stock.
- Portfolio dashboard shows accurate, consistent totals (value = cash + holdings market value).
- All financial mutations are recorded in the `transactions` table (auditable).
- Admin can view platform-wide users/orders/transactions.
- The system runs end-to-end locally (frontend + backend + database) and can be demoed live.

## 10. Constraints

- Single-semester university timeline — favor simplicity and correctness over completeness.
- No real payment or brokerage integrations are permitted or needed.
- Market data can be simulated or pulled from a free external API; either is acceptable as long as the backend, not the frontend, owns that integration (see Architecture.md).

## 11. Open Questions (resolve early, then remove this section)

- Which market data source: a real free external API, or a backend-simulated price generator? (Architecture.md assumes an external API is used but abstracted behind the backend.)
- Fixed stock universe (e.g. ~10–20 NSE large caps) vs. a larger searchable set?
- Starting virtual balance amount — confirm ₹10,00,000 or another figure?
