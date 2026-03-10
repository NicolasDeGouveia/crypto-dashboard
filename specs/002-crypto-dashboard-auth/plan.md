# Implementation Plan: Full Crypto Dashboard with Authentication & Favourites

**Branch**: `002-crypto-dashboard-auth` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-crypto-dashboard-auth/spec.md`

## Summary

Evolve the 5-coin prototype into a full cryptocurrency dashboard showing the top
100 coins with pagination, search, and sorting. Enrich the coin detail page with
market cap, volume, supply, ATH, coin logo, and description. Add user authentication
(email + password via Auth.js v5) backed by a Neon PostgreSQL database, enabling
users to persist a personal list of favourite coins accessible across devices.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode) / Node.js 20.9.0+
**Primary Dependencies**:
- Next.js 16.1.6 (App Router) — existing
- Auth.js v5 (`next-auth`) — new
- Drizzle ORM + `drizzle-kit` — new
- `@neondatabase/serverless` (HTTP driver) — new
- `@node-rs/argon2` (password hashing) — new
- `@upstash/ratelimit` + `@upstash/redis` (rate limiting) — new
- React 19, Tailwind CSS v4, Vitest + RTL — existing

**Storage**: Neon serverless PostgreSQL (free tier)
- Tables: `users`, `accounts`, `sessions`, `verificationTokens` (Auth.js-managed),
  `favourites` (application-managed)

**Testing**: Vitest + React Testing Library (existing)
**Target Platform**: Vercel (serverless) or any Node.js 20+ host
**Performance Goals**:
- TTFB ≤ 500 ms (constitution Principle IV)
- LCP ≤ 2.5 s on simulated 4G
- Favourites toggle reflected in UI immediately (no full reload)

**Constraints**:
- CoinGecko Demo API: 30 calls/min rolling window; cache ≥ 60s (constitution IV)
- Bundle additions ≥ 50 KB gzipped require justification (constitution IV)
- JWT session expiry: 24 hours
- No password reset or email verification in this iteration (spec assumption)

**Scale/Scope**: Personal/portfolio project; Neon free tier sufficient. Top 100 coins,
50 per page. Up to 250 favourite coins per user (CoinGecko `ids` param limit).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality | ✅ PASS | All new code follows SRP; service layer isolation maintained |
| II. Testing Standards | ✅ PASS | Unit tests for Server Actions and utilities; component tests for new UI states; integration tests for auth flows |
| III. UX Consistency | ✅ PASS | Reusing `StatCard`, `CoinListItem`, `ErrorMessage` primitives; all three states (loading/error/populated) required for every new view |
| IV. Performance | ✅ PASS | `GET /coins/markets` replaces per-coin calls; cache TTLs ≥ 60s; JWT sessions avoid per-request DB reads |
| V. Simplicity | ⚠️ JUSTIFIED | Auth + DB is a material complexity increase. Justified: favourites require persistent user state that cannot live client-side (cross-device requirement in spec FR-010). Documented in Complexity Tracking below. |

**Post-Phase 1 re-check**: ✅ All principles satisfied. Data model is minimal (2 app tables). No over-engineering detected. Auth.js + Drizzle chosen over heavier alternatives specifically for simplicity and bundle size.

## Project Structure

### Documentation (this feature)

```text
specs/002-crypto-dashboard-auth/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── api-routes.md    # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── (auth)/                        # Auth route group (public: login, register)
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (protected)/                   # Protected route group (requires session)
│   └── favourites/
│       ├── page.tsx
│       └── loading.tsx
├── _actions/
│   ├── auth.ts                    # register() Server Action
│   └── favourites.ts              # addFavourite(), removeFavourite() Server Actions
├── _lib/
│   ├── api.ts                     # UPDATED: getCoinMarkets(), getCoinDetail() enriched
│   ├── constants.ts               # UPDATED: PAGE_SIZE, SORT_OPTIONS added
│   ├── db/
│   │   ├── index.ts               # Drizzle client (Neon HTTP)
│   │   └── schema.ts              # Users, Favourites schema + Auth.js tables
│   └── types.ts                   # UPDATED: CoinMarketSummary, CoinDetail extended
├── api/
│   └── favourites/
│       └── prices/
│           └── route.ts           # GET /api/favourites/prices
├── coins/
│   └── [id]/
│       └── page.tsx               # UPDATED: enriched detail page
├── components/
│   ├── CoinListItem.tsx           # UPDATED: add image + favourite toggle
│   ├── FavouriteToggle.tsx        # NEW: client component, calls Server Actions
│   ├── PaginationControls.tsx     # NEW: client component, URL-based navigation
│   ├── SearchInput.tsx            # NEW: client component, debounced router.replace
│   ├── SortableColumnHeader.tsx   # NEW: client component, URL-based sort
│   ├── CoinListSkeleton.tsx       # NEW: skeleton matching PAGE_SIZE rows
│   ├── UserNav.tsx                # NEW: login/logout/avatar in header
│   └── __tests__/                 # Existing + new component tests
├── layout.tsx                     # UPDATED: add UserNav, next/image domain config
├── loading.tsx                    # UPDATED: match PAGE_SIZE skeleton rows
└── page.tsx                       # UPDATED: searchParams-driven pagination/sort/search

auth.ts                            # Auth.js v5 config (credentials provider)
middleware.ts                      # NEW: Auth.js middleware for route protection
drizzle.config.ts                  # NEW: Drizzle kit config pointing to DATABASE_URL

db/
└── migrations/                    # Drizzle-generated SQL migration files
```

**Structure Decision**: Single Next.js App Router project (Option 2 web app structure
is not needed — there is no separate backend; Next.js Route Handlers serve as the
API layer). Route groups `(auth)` and `(protected)` provide clean separation between
public and authenticated routes without URL path changes.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Database (Neon Postgres) | Favourites must persist across devices (spec FR-010) | localStorage only works on one device; rejected by spec requirement |
| Auth.js v5 dependency | Secure session management requires cryptographic primitives and CSRF handling that should not be hand-rolled | Custom JWT implementation introduces security risk; Clerk introduces vendor lock-in |
| Argon2 for password hashing | OWASP best practice for new systems | bcrypt is acceptable fallback but argon2id is the current standard |
| Upstash rate limiting | Prevents brute-force on auth endpoints in a multi-instance serverless deployment | In-memory rate limiting is per-instance and useless on Vercel |
