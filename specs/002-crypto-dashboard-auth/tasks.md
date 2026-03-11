# Tasks: Setup & Foundational Infrastructure

**Feature**: 002-crypto-dashboard-auth
**Scope**: Phases 1 & 2 only — shared infrastructure, DB schema, auth config, middleware.
> User stories (US1–US4) and polish are tracked as separate features (003–006).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install new dependencies, configure environment, set up Drizzle + Neon connection.

- [X] T001 Install new dependencies: `next-auth@beta`, `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `@node-rs/argon2`, `@upstash/ratelimit`, `@upstash/redis` in `package.json`
- [X] T002 Add `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` to `.env.example` with placeholder values and document in `README.md`
- [X] T003 [P] Add `assets.coingecko.com` to `images.remotePatterns` in `next.config.ts` for Next.js Image optimization
- [X] T004 [P] Create `drizzle.config.ts` at repo root pointing `DATABASE_URL` to `app/_lib/db/schema.ts`
- [X] T005 [P] Update `app/_lib/constants.ts` — add `PAGE_SIZE = 50`, `DEFAULT_SORT = 'market_cap_desc'`, `SORT_OPTIONS` map, remove hardcoded `COINS` array (keep as fallback constant)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema, Drizzle client, Auth.js config, and middleware — required before any user story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 Create Drizzle client in `app/_lib/db/index.ts` — instantiate `drizzle()` with `@neondatabase/serverless` HTTP driver, export `db` singleton
- [X] T007 Define Auth.js required tables in `app/_lib/db/schema.ts` — `users` (with added `password` and `createdAt` columns), `accounts`, `sessions`, `verificationTokens` using Drizzle schema syntax
- [X] T008 Add `favourites` table to `app/_lib/db/schema.ts` — columns: `id` (serial PK), `userId` (text FK → users.id CASCADE), `coinId` (text), `addedAt` (timestamp DEFAULT now()); add unique constraint on `(userId, coinId)` and index on `userId`
- [X] T009 Generate initial Drizzle migration with `drizzle-kit generate` — output to `db/migrations/`; verify SQL contains all tables with correct constraints
- [X] T010 Create `auth.ts` at repo root — configure Auth.js v5 with credentials provider; implement `authorize` callback that fetches user by email via Drizzle and verifies password with `@node-rs/argon2`; set JWT session strategy, 24h expiry
- [X] T011 Create `middleware.ts` at repo root — export Auth.js `auth` as middleware; configure matcher to exclude `/api/auth/*`, `_next/static`, `_next/image`, `favicon.ico`; redirect unauthenticated users away from `/(protected)/*` routes
- [X] T012 Create `app/(protected)/layout.tsx` — call `auth()`, redirect to `/login` if no session (defence-in-depth layer 2)
- [X] T013 [P] Create `app/_lib/types.ts` additions — define `CoinMarketSummary` and extend `CoinDetail` types per `data-model.md` field inventory (replacing current minimal `CoinDetails` type)
- [X] T014 [P] Update `app/_lib/api.ts` — add `getCoinMarkets({ page, sort, perPage, ids? }: CoinMarketsParams)` function calling `GET /coins/markets` with `revalidate: 60`; update `getCoinDetails` to use new query params `localization=false&tickers=false&sparkline=true` with `revalidate: 120`

**Checkpoint**: `db`, `auth`, middleware, types, and API service layer are ready. Run `npm run build` — should compile without errors.
