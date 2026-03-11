# Features Registry

> Source of truth for all project features.
> Add a new entry here before running `/speckit.specify` to create a feature.
> Status is derived automatically by `/speckit.next` from each feature's `tasks.md`.

## How to use

1. Add a new feature entry below (next available number, priority, short description)
2. Run `/speckit.next` to see the global roadmap and create the branch for the next pending feature
3. Run `/speckit.specify` to write the spec, then `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`

## Features

| # | Slug | Title | Priority | Depends on | Notes |
|---|------|-------|----------|------------|-------|
| 002 | 002-crypto-dashboard-auth | Setup & Foundational Infrastructure | P0 | — | DB schema, auth config, middleware. Blocks all user stories. |
| 003 | 003-coin-list | Browse the Full Coin List | P1 | 002 | Paginated, searchable, sortable top-100 list. MVP. |
| 004 | 004-coin-detail-page | Rich Coin Detail Page | P2 | 002 | Sparkline, description, ATH, supply, multi-period price changes. |
| 005 | 005-auth-register-login | User Registration & Login | P3 | 002 | Email + password auth via Auth.js v5 credentials provider. |
| 006 | 006-favourites | Manage Favourite Coins | P4 | 003, 005 | Toggle favourites, `/favourites` page with live prices. |
| 007 | 007-polish | Polish & Cross-Cutting Concerns | P5 | 003, 004, 005, 006 | Rate limiting, responsive audit, WCAG 2.1 AA, error states. |
| 008 | 008-ui-fixes | UI Fixes — Mobile Nav & Sparkline | P6 | 007 | Mobile navbar not tappable (logo link missing); sparkline unreadable with no axes or price labels. |
| 009 | 009-remove-redundant-h1 | Remove Redundant H1 on Home | P7 | 008 | H1 "Crypto Dashboard" is redundant with the navbar logo — remove it. |
| 010 | 010-search-input-redesign | Search Input Redesign | P8 | 009 | Modern search input: icon, pill shape, focus ring, fix role="textbox" anti-pattern. |
| 011 | 011-ui-redesign | UI Redesign — Light + Dark Mode | P9 | 010 | Light mode with more character (inspired by Linear/Vercel/Raycast) + full dark mode. |
| 012 | 012-chart-multi-period | Chart Multi-Period View | P10 | 008 | 1h/24h/7d/30d/1y period selector on coin detail page using CoinGecko market_chart endpoint. |
| 013 | 013-dark-glassmorphism | Dark Glassmorphism Redesign | P11 | 011, 012 | Dark-only redesign inspired by Coinova: deep violet background, glass cards, fuchsia/violet glow effects, gradient accents. Remove light mode entirely. |

## Naming convention

- Directory: `NNN-short-slug` (e.g. `003-coin-list`)
- Branch: `feat/NNN-short-slug` (e.g. `feat/003-coin-list`)
- Numbers are sequential and never reused

## Dependency rules

- A feature may only start when all its `Depends on` features are `completed`
- `/speckit.next` enforces this automatically — it skips features whose dependencies are not yet complete
