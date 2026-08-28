# Rules.md
## Boundaries for AI-assisted development on this project

This file governs how an AI assistant (or any contributor) should behave while building this codebase. Read this before writing code in every session. If a request conflicts with this file, this file wins unless the project owner explicitly overrides it in the conversation.

---

## 1. Stack Discipline

- **Use only the stack defined in Architecture.md**: React, Tailwind CSS, Node.js, Express, PostgreSQL, Prisma, JWT, bcrypt, Recharts.
- Do **not** introduce a new framework, database, ORM, state-management library, or CSS framework without explicit approval — even if it seems "better." Consistency matters more than optimality for a graded assignment.
- Do not swap Prisma for raw SQL or another ORM (TypeORM, Sequelize, etc.) mid-project.
- Do not add a GraphQL layer — this is a REST API project by design.
- Avoid adding heavy dependencies for something a few lines of code can do (e.g. don't pull in a whole date library for one format call unless formatting needs genuinely justify it).

## 2. Architecture Discipline

- Always respect the layering: **Routes → Controllers → Services → Models**.
  - Controllers must stay thin: parse request, call one or more services, shape the response. No business logic, no direct Prisma calls, in a controller.
  - Business logic (price calculation, average price, wallet math, validation rules) belongs in `services/`, never in `controllers/` or React components.
  - The frontend must never call the external market data API directly — only the backend's `marketData.service.js` does that.
- Any operation that mutates wallet balance, holdings, or creates an order **must** be wrapped in a Prisma transaction (`prisma.$transaction`). Never leave money/holdings state half-updated.
- Don't collapse modules together for convenience (e.g. don't merge `walletService` into `tradingService`) — keep the module boundaries defined in Architecture.md so the project stays explainable in a viva.

## 3. Scope Discipline

- Build strictly in the order defined in Phases.md. Do not start a later phase's feature while an earlier phase is incomplete or unstable.
- Do not build Bonus features (watchlists, limit orders, leaderboards, notifications, etc. — see PRD.md §7) until every Core feature (PRD.md §6) works end-to-end.
- If a request would add scope not listed in PRD.md, flag it explicitly ("this isn't in the current scope — do you want me to add it to Phases.md as a new phase, or skip it?") rather than silently building it.
- No real payment gateways, no real brokerage APIs, no real money anywhere in this codebase, under any circumstance.

## 4. Code Quality Rules

- Every API route must validate its input (via `validators/` + `validationMiddleware`) before touching the database.
- Every route that requires a logged-in user must go through `authMiddleware`. Every admin-only route must additionally go through `roleMiddleware`.
- Passwords are always hashed with bcrypt before storage — never store or log plaintext passwords.
- Never log JWTs, password hashes, or full request bodies containing credentials.
- All monetary values are stored and calculated server-side; the frontend only displays what the backend returns, never recalculates money independently.
- Prefer explicit, readable code over clever one-liners — this is a project a human evaluator will read.
- Keep functions single-purpose. If a service function is doing more than one clear thing, split it.

## 5. Error Handling

- All errors flow through the centralized `errorMiddleware` — don't hand-roll ad hoc error responses in individual controllers.
- API error responses use a consistent JSON shape, e.g.:
  ```json
  { "success": false, "error": { "code": "INSUFFICIENT_FUNDS", "message": "..." } }
  ```
- Never let an unhandled promise rejection crash the server silently — every async route handler must be wrapped (e.g. an `asyncHandler` utility) or use try/catch.
- User-facing error messages should be clear and non-technical ("Not enough cash to complete this order") — technical details go in server logs, not the HTTP response.
- On the frontend, every API call that can fail must have a visible loading and error state — no silent failures on Buy/Sell actions especially.

## 6. Data Integrity Rules

- Wallet balance must never go negative. Reject the order at the service layer before any write happens.
- A sell order can never reduce a holding's quantity below zero. Reject before any write happens.
- Every transaction that changes `cash_balance` must have a corresponding row in `transactions`. No silent balance mutation.
- Average buy price is recalculated only on BUY; SELL never changes average price, only quantity.

## 7. What the AI Should Do

- Ask before making an architectural decision not already specified in Architecture.md (e.g. "should orders be soft-deleted or hard-deleted on cancel?").
- Explain the reasoning behind non-trivial logic (e.g. the average price formula) inline as comments, since this is a learning project.
- Point out when a request would break a rule in this file, and suggest a compliant alternative, rather than silently complying or silently refusing.
- Keep Memory.md updated at the end of each work session (see Memory.md).
- Write code incrementally, matching the phase currently in progress — don't jump ahead and scaffold future phases "while you're at it."

## 8. What the AI Should Not Do

- Do not invent database fields, endpoints, or pages that aren't in PRD.md or Architecture.md without flagging it first.
- Do not silently change the tech stack, folder structure, or naming conventions already established in the codebase.
- Do not remove or bypass validation, auth, or transaction-safety code to "make something work faster."
- Do not fabricate market data results or pretend an external API call succeeded when it didn't — surface the failure.
- Do not rewrite large parts of the existing codebase without being asked; prefer small, targeted diffs.
- Do not mark a phase "done" in Memory.md until its features actually run end-to-end.

## 9. Naming Conventions

- Files: `camelCase.js` for JS files, `PascalCase.jsx` for React components.
- Database tables/columns: `snake_case`.
- REST routes: lowercase, plural nouns (`/api/orders`, `/api/stocks`).
- Environment variables: `UPPER_SNAKE_CASE`.

## 10. Git / Workflow

- One feature/phase per branch where practical (e.g. `feature/auth`, `feature/trading-engine`).
- Commit messages should be descriptive, not "fix stuff" or "wip" — e.g. `feat: add average price recalculation on buy order`.
- Do not commit `.env` files, `node_modules/`, or database credentials.
