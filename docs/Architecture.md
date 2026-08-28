# Architecture.md
## Paper Trading Platform — System Architecture

This document is the technical source of truth for how the system is built. It should be read before writing any code, and updated whenever a structural decision changes.

---

## 1. High-Level Architecture

Three-tier architecture:

```
React Frontend  →  REST API / MVC Backend (Node + Express)  →  PostgreSQL + External Market Data
```

- The frontend never talks to external APIs (like market data) directly. It only talks to the backend.
- The backend owns all business logic, validation, and data persistence.
- No real money is ever involved; the wallet is a simulated ledger in PostgreSQL.

```text
                         ┌──────────────────────┐
                         │        USER           │
                         └──────────┬────────────┘
                                    ▼
                    ┌─────────────────────────────┐
                    │       FRONTEND (React)      │
                    │  Login/Register, Dashboard,  │
                    │  Stock Search, Charts,       │
                    │  Buy/Sell, Portfolio, Orders │
                    └──────────────┬──────────────┘
                                   │ HTTPS / REST (JSON)
                                   ▼
        ┌──────────────────────────────────────────────────┐
        │            BACKEND — Node.js + Express            │
        │                                                    │
        │   Routes → Controllers → Services → Models/ORM     │
        └─────────────────────────┬──────────────────────────┘
                                   ▼
                         ┌─────────────────┐
                         │   PostgreSQL     │
                         └─────────────────┘
                                   ▲
                         ┌────────┴────────┐
                         │ Market Data API  │
                         │ (external, only  │
                         │ called by backend)│
                         └─────────────────┘
```

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React.js | Functional components + hooks |
| Styling | Tailwind CSS | Utility-first, fast to iterate |
| Charts | Recharts | Portfolio performance, allocation |
| Backend | Node.js + Express.js | REST API |
| Architecture pattern | MVC + Service Layer | Controllers stay thin; Services hold business logic |
| Database | PostgreSQL | Relational integrity for financial data |
| ORM | Prisma | Schema, migrations, type-safe queries |
| Auth | JWT + bcrypt | Stateless auth, hashed passwords |
| API testing | Postman | Manual + collection-based testing |
| Market data | External market-data API, abstracted behind backend `marketData.service.js` | Backend is the only caller |
| Version control | Git + GitHub | Feature-branch workflow recommended |

## 3. Application Modules

```text
Authentication · User Management · Virtual Wallet · Market Data ·
Trading Engine · Order Management · Portfolio Management ·
Transaction Management · Analytics · Admin Panel
```

## 4. Backend Layering (MVC + Service Layer)

```text
Routes  →  Controllers  →  Services  →  Models (Prisma) →  PostgreSQL
```

- **Routes**: map HTTP verb + path to a controller function. No logic here.
- **Controllers**: parse/validate the request shape, call the relevant service(s), shape the HTTP response. No business logic here.
- **Services**: all business logic lives here (price lookup, wallet math, average price recalculation, validation rules). Services can call other services (e.g. `tradingService` calls `walletService` and `portfolioService`).
- **Models**: Prisma schema + generated client. No business logic here — pure data access.

Example call chain for an order:
```
OrderController → TradingService → WalletService → PortfolioService → TransactionService
```

## 5. Backend Folder Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── environment.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── stock.controller.js
│   │   ├── order.controller.js
│   │   ├── portfolio.controller.js
│   │   ├── wallet.controller.js
│   │   └── analytics.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── trading.service.js
│   │   ├── marketData.service.js
│   │   ├── portfolio.service.js
│   │   ├── wallet.service.js
│   │   └── analytics.service.js
│   ├── models/                     # Prisma schema + generated client access
│   │   ├── user.model.js
│   │   ├── stock.model.js
│   │   ├── order.model.js
│   │   ├── holding.model.js
│   │   ├── wallet.model.js
│   │   └── transaction.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── stock.routes.js
│   │   ├── order.routes.js
│   │   ├── portfolio.routes.js
│   │   ├── wallet.routes.js
│   │   └── analytics.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validation.middleware.js
│   │   └── error.middleware.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── order.validator.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── calculations.js
│   └── app.js
├── prisma/
│   └── schema.prisma
└── server.js
```

## 6. Frontend Folder Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   ├── StockCard/
│   │   ├── OrderForm/
│   │   ├── PortfolioTable/
│   │   └── PnLCard/
│   ├── pages/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Dashboard/
│   │   ├── Markets/
│   │   ├── StockDetails/
│   │   ├── Portfolio/
│   │   ├── Orders/
│   │   ├── Transactions/
│   │   └── Profile/
│   ├── services/           # API clients — one file per backend resource
│   │   ├── authApi.js
│   │   ├── stockApi.js
│   │   ├── orderApi.js
│   │   └── portfolioApi.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   ├── utils/
│   └── App.jsx
```

## 7. Database Schema (entities & relationships)

```text
users
  │
  ├── 1:1  → wallets
  ├── 1:N  → orders        ── N:1 → stocks
  ├── 1:N  → holdings      ── N:1 → stocks
  └── 1:N  → transactions
```

### Tables

**users**
```
id, name, email, password_hash, role (USER|ADMIN), created_at, updated_at
```

**wallets**
```
id, user_id, cash_balance, created_at, updated_at
```

**stocks**
```
id, symbol, company_name, exchange, sector
```

**orders**
```
id, user_id, stock_id, order_type, side (BUY|SELL), quantity, price,
status (PENDING|EXECUTED|CANCELLED|REJECTED), created_at, executed_at
```

**holdings**
```
id, user_id, stock_id, quantity, average_buy_price, created_at, updated_at
```

**transactions**
```
id, user_id, type (INITIAL_DEPOSIT|BUY|SELL|REFUND), amount, reference_id,
description, created_at
```

Future/bonus tables (not in core scope): `watchlists`, `price_history`, `notifications`.

## 8. REST API Surface

```text
Auth
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

Stocks
GET    /api/stocks
GET    /api/stocks/:symbol
GET    /api/stocks/:symbol/history

Orders
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
DELETE /api/orders/:id

Portfolio
GET    /api/portfolio
GET    /api/portfolio/holdings
GET    /api/portfolio/performance

Wallet
GET    /api/wallet
GET    /api/wallet/transactions

Analytics
GET    /api/analytics/pnl
GET    /api/analytics/allocation
GET    /api/analytics/performance

Admin
GET    /api/admin/users
GET    /api/admin/orders
GET    /api/admin/transactions
```

## 9. Core Business Logic

### 9.1 Buy Order Flow

```text
USER → React → POST /api/orders → auth.middleware (verify JWT)
   → order.controller (validate request shape)
   → trading.service:
        1. get current price (marketData.service)
        2. calculate total cost = price × quantity
        3. check wallet.cash_balance >= total cost
        4. if insufficient → reject, return 4xx with reason
        5. if sufficient:
             - create order row (status EXECUTED)
             - debit wallet.cash_balance
             - upsert holding (recalculate average price, see 9.2)
             - create transaction row (type BUY)
   → return updated wallet + holding + order to frontend
```

### 9.2 Average Price Recalculation

```
new_total_qty  = existing_qty + bought_qty
new_avg_price  = ((existing_qty × existing_avg) + (bought_qty × buy_price)) / new_total_qty
```

### 9.3 Sell Order Flow

Same shape as Buy, but validates `holding.quantity >= sell_quantity` instead of cash, credits the wallet instead of debiting it, and reduces (or deletes, if quantity hits zero) the holding row. Average price is unchanged by a sell.

### 9.4 Portfolio Valuation

```
current_value(stock)   = quantity × current_market_price
unrealized_pnl(stock)  = current_value - (quantity × average_buy_price)
portfolio_value         = cash_balance + Σ current_value(stock) for all holdings
return_pct               = (portfolio_value - initial_deposit) / initial_deposit × 100
```

All of the above math lives in `analytics.service.js` / `portfolio.service.js` — never in the frontend and never in a controller.

## 10. Middleware Stack

```text
authMiddleware        → verifies JWT, attaches req.user
roleMiddleware         → restricts admin-only routes to role = ADMIN
validationMiddleware   → validates request bodies against validators/
errorMiddleware        → centralized error handler, consistent JSON error shape
rateLimitMiddleware    → basic abuse protection (optional but recommended)
```

## 11. Data Consistency Rule

Every operation that touches money or holdings (wallet debit/credit, holding create/update/delete, order creation, transaction logging) must happen atomically — wrap it in a single Prisma transaction (`prisma.$transaction`). A half-applied trade (e.g. cash debited but holding not updated) is the single biggest bug risk in this system and must never be allowed to happen, even on error.
