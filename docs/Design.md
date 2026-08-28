# Design.md
## Visual Design System — Paper Trading Platform

Purpose: keep the UI visually consistent across every page without needing a designer, and give the AI assistant unambiguous rules to follow instead of reinventing style per component.

---

## 1. Design Principles

- **Data-dense but calm.** This is a financial dashboard — prioritize clarity and scanability over decoration.
- **Consistent, not flashy.** A university evaluator should see one coherent design system, not five different button styles.
- **Color communicates meaning.** Green/red are reserved for gains/losses — never used decoratively elsewhere.
- **Mobile-responsive, desktop-first.** Trading dashboards are primarily used on larger screens, but core pages (login, portfolio) must not break on mobile.

## 2. Theme

Default to a **dark trading-terminal theme** with a light-theme toggle as a stretch goal (not required for core scope).

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `bg-primary` | `#0B0F14` | App background |
| `bg-surface` | `#131924` | Cards, panels, table rows |
| `bg-surface-raised` | `#1B2330` | Modals, dropdowns, hover states |
| `border-subtle` | `#232B3A` | Card borders, dividers |
| `text-primary` | `#F5F7FA` | Headings, primary text |
| `text-secondary` | `#8A94A6` | Labels, secondary/meta text |
| `brand-primary` | `#3B82F6` | Primary buttons, links, active nav |
| `brand-primary-hover` | `#2563EB` | Hover state for primary actions |
| `success` (gains / BUY) | `#22C55E` | Positive P&L, BUY badges, up-trend |
| `danger` (losses / SELL) | `#EF4444` | Negative P&L, SELL badges, down-trend |
| `warning` | `#F59E0B` | Pending states, cautionary alerts |

Rules:
- Never use `success`/`danger` green/red for anything other than gains/losses or buy/sell semantics (don't use red for a generic "delete" icon if it could be confused with a loss indicator on the same screen — use `text-secondary` + an icon instead where ambiguity is possible).
- Charts use `success`/`danger` for line/bar coloring tied to performance; use `brand-primary` for neutral/informational series.

### Light Theme (optional, Phase 8+ stretch)

If implemented, invert the surface/background tokens (`bg-primary` → `#F7F8FA`, `text-primary` → `#0B0F14`, etc.) while keeping `brand-primary`, `success`, and `danger` identical for consistency.

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| UI / body | `Inter` | Clean, highly legible at small sizes — standard for dashboards |
| Numeric data (prices, P&L, balances) | `Inter` with `font-variant-numeric: tabular-nums` (or a monospace fallback like `JetBrains Mono` for tables) | Tabular numbers so columns of numbers align |

Type scale (Tailwind-style):

| Use | Size | Weight |
|---|---|---|
| Page title | `text-2xl` (24px) | 600 |
| Section heading | `text-lg` (18px) | 600 |
| Card label / summary title | `text-sm` (14px) | 500, `text-secondary` |
| Body / table text | `text-sm` (14px) | 400 |
| Large stat (e.g. Portfolio Value) | `text-3xl` (30px) | 700 |
| Micro / meta text | `text-xs` (12px) | 400, `text-secondary` |

## 4. Layout

- **App shell:** fixed left `Sidebar` (nav: Dashboard, Markets, Portfolio, Orders, Transactions, Profile, [Admin]) + top `Navbar` (search, wallet balance snippet, user menu) + scrollable content area.
- **Spacing scale:** use Tailwind's default spacing scale (4px base unit) consistently — avoid arbitrary pixel values.
- **Cards:** `bg-surface`, `rounded-xl`, `border border-border-subtle`, consistent internal padding (`p-4` or `p-6`).
- **Tables:** zebra-free, rely on `border-subtle` row dividers; sticky header on scroll for long lists (Orders, Transactions).
- **Grid:** dashboard summary cards in a responsive grid (4 columns desktop → 2 columns tablet → 1 column mobile).

## 5. Components — Conventions

- **Buttons**
  - Primary (e.g. "Buy", "Confirm"): `brand-primary` background, white text, `rounded-lg`.
  - Buy-specific action: may use `success` background instead of `brand-primary` to reinforce meaning; Sell-specific action uses `danger` background. This is the one approved exception to "buttons are always brand-primary."
  - Secondary/ghost: transparent background, `border-subtle` border, `text-primary`.
  - Destructive (e.g. "Cancel Order"): `danger` text/border on transparent or ghost background — reserve solid `danger` fill for the Sell action only, to avoid visual confusion.
- **Badges/status pills** (order status, transaction type): small, `rounded-full`, colored by meaning — `EXECUTED`/`BUY` → `success`, `REJECTED`/`SELL` → context-dependent (`danger` for rejected, neutral badge with red accent text for SELL to distinguish "sell action" from "error"), `PENDING` → `warning`.
- **Charts (Recharts):** portfolio performance line chart uses `success`/`danger` per-segment or a single `brand-primary` line with a shaded gain/loss area; allocation uses a donut/pie with a muted, non-clashing categorical palette derived from `brand-primary` tints.
- **Empty states:** every list/table (no holdings yet, no orders yet) needs a simple centered empty state with an icon + one line of text + a relevant CTA (e.g. "No holdings yet — browse the market").
- **Loading states:** skeleton loaders for cards/tables, not blank screens or unstyled "Loading..." text.

## 6. Iconography

Use a single icon set throughout (recommended: `lucide-react`, if available in the frontend stack) — do not mix icon libraries. Icons are `text-secondary` by default, `text-primary` on hover/active, and only take `success`/`danger` color when representing a gain/loss or buy/sell action.

## 7. What NOT to do

- Don't introduce a second font family.
- Don't use `success`/`danger` for anything unrelated to gains, losses, buy, or sell.
- Don't hand-roll one-off colors outside the palette above — if a new color is genuinely needed, add it to this file first, then use it.
- Don't build inconsistent card/button styles per page — every page pulls from the same component set in `components/`.
- Don't sacrifice number alignment/readability for style — tabular data must stay easy to scan.
