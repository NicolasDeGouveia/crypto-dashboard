# Research: Full Crypto Dashboard with Authentication & Favourites

**Branch**: `002-crypto-dashboard-auth` | **Date**: 2026-03-10
**Phase**: 0 — Research

---

## 1. Authentication Library

**Decision**: Auth.js v5 (NextAuth v5)

**Rationale**:
- Self-hosted — user data stays in your own database alongside favourites
- First-class Next.js App Router support: `auth()` works in Server Components,
  middleware, Server Actions, and Route Handlers without wrappers
- Credentials provider gives full control over registration/login logic
- Official Drizzle ORM adapter (maintained)
- Free — no MAU limits or pricing risk
- TypeScript strict mode fully compatible
- Edge-compatible when using JWT sessions

**Alternatives considered**:
- **Lucia Auth** — archived/unmaintained since late 2024; not appropriate for new work
- **Clerk** — managed SaaS: vendor lock-in, user data leaves your infrastructure,
  ~100 KB+ client bundle, unnecessary for a self-hosted project

---

## 2. Session Strategy

**Decision**: JWT sessions (encrypted, HttpOnly cookie)

**Rationale**:
- Zero database reads per request for session validation — critical in an App Router
  app where `auth()` may be called in middleware and multiple Server Components
- Edge-compatible: JWT validation runs without a DB connection pool
- Auth.js v5 encrypts JWTs with `AUTH_SECRET` using `jose`; payload is not
  readable client-side
- For a crypto dashboard (read-only prices + personalised favourites), the threat
  model does not require instant session revocation

**Alternatives considered**:
- **Database sessions** — adds a DB round-trip to every authenticated server render;
  correct choice if instant revocation or rich session metadata is required (future
  upgrade path via Auth.js adapter switch)

**Caveat**: JWT expiry set to 24 hours; on password change, increment a
`tokenVersion` field in the user record if instant invalidation is later required.

---

## 3. Database

**Decision**: Neon (serverless PostgreSQL) + Drizzle ORM

**Rationale**:

*Neon vs alternatives:*
- **Neon** — serverless Postgres, free tier (0.5 GB, 191.9 compute hours/month),
  **does not pause on inactivity** (unlike Supabase which pauses after 1 week),
  HTTP driver is edge-compatible
- **Supabase** — inactivity pausing is a dealbreaker for a personal/portfolio project
- **Turso/SQLite** — viable but Postgres is a better fit when Auth.js session tables
  and relational integrity between users and favourites are involved
- **JSON file store** — not viable on serverless platforms (read-only filesystem);
  race conditions on concurrent writes; rejected outright

*Drizzle vs Prisma:*
- **Drizzle** — pure TypeScript, no binary dependency, edge-compatible, ~30 KB,
  native Neon HTTP driver support (`drizzle-orm/neon-http`), official Auth.js
  adapter, TypeScript strict mode end-to-end
- **Prisma** — ships a Rust binary (~15–30 MB), not edge-compatible, heavier bundle,
  weaker libsql support; better DX for complex queries but over-engineered here

---

## 4. Route Protection

**Decision**: Two-layer approach — Edge Middleware + route group layout

- **Layer 1 (Middleware)**: `middleware.ts` exports Auth.js `auth` directly.
  Runs at the edge on every request; redirects unauthenticated users away from
  protected routes before any server component executes. Fast, no DB cost.
- **Layer 2 (Layout)**: A `(protected)` route group layout calls `auth()` and
  `redirect("/login")`. Defence-in-depth if middleware matcher is ever misconfigured.

The middleware matcher must exclude `/api/auth/*`, `_next/static`, `_next/image`,
and `favicon.ico` to avoid redirect loops.

---

## 5. Password Security

**Decision**: Argon2id via `@node-rs/argon2`

**Rationale**:
- Argon2id is OWASP's first recommendation for new systems
- Memory-hard (resists GPU/ASIC cracking); bcrypt is only CPU-hard
- `@node-rs/argon2` is WASM-based — no native binding fragility in serverless
- Auth.js credentials `authorize` runs in Node.js runtime, no edge restriction
- Defaults: memory=64 MB, iterations=3, parallelism=4 (OWASP minimums)

**Fallback**: `bcryptjs` (pure JS, zero native deps) if WASM causes issues —
acceptable security at cost factor 12.

---

## 6. CSRF & Rate Limiting

**CSRF**:
- Login/register forms use Next.js Server Actions → built-in Origin validation
  (Next.js 14+). No additional library needed.
- Session cookie set to `SameSite=Lax` (Auth.js default).

**Rate Limiting**:
- **Decision**: Upstash Redis + `@upstash/ratelimit`
- Edge-compatible, serverless-safe, free tier (10,000 req/day) sufficient
- Sliding window: 5 login attempts per IP per 15 minutes
- Applied to the login endpoint and registration endpoint

---

## 7. CoinGecko API — Expanded Capabilities

### Key findings for the existing integration

**Current gaps:**
| Surface | Current | Available |
|---------|---------|-----------|
| List endpoint | `GET /simple/price`, 5 hardcoded coins | `GET /coins/markets`, up to 250 coins, includes image, market cap, volume |
| Detail fields | 4 fields mapped | 30+ fields: market cap, volume, supply, ATH, multi-period changes, sparkline, description |
| Coin images | Not fetched | `image.thumb/small/large` on `/coins/{id}`; `image` field on `/coins/markets` |
| Price charts | Not implemented | `GET /coins/{id}/market_chart` available on Demo tier; or free sparkline via `sparkline=true` |

**Rate limit**: 30 calls/minute on Demo tier (rolling window). HTTP 429 on breach.

### List page migration

Replace `GET /simple/price` with `GET /coins/markets`:
```
GET /coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1
```
Returns per coin: `id`, `symbol`, `name`, `image`, `current_price`, `market_cap`,
`market_cap_rank`, `total_volume`, `high_24h`, `low_24h`, `price_change_percentage_24h`,
`circulating_supply`, `total_supply`, `max_supply`, `ath`, `ath_date`, `last_updated`.

**Top 100 in one call** (replaces current 1-call-for-5-coins approach).

### Detail page enrichment

Use existing `GET /coins/{id}` but with query params:
```
GET /coins/{id}?localization=false&tickers=false&market_data=true&sparkline=true
```
- `localization=false` — removes 30+ localised name strings, dramatically reduces payload
- `tickers=false` — removes large exchange ticker array
- `sparkline=true` — adds 7-day hourly price array for free (avoids separate chart call)

### Coin images

Images hosted on `assets.coingecko.com` CDN. URLs are stable and long-lived.
Must add to `next.config.ts` `images.remotePatterns`:
```ts
{ hostname: 'assets.coingecko.com' }
```

### Price history

`GET /coins/{id}/market_chart?vs_currency=usd&days=7` → hourly data (168 points).
Available on Demo tier. Can be skipped in favour of `sparkline=true` on the detail
call for a lightweight 7-day trend line.

### Caching strategy (rate-limit-aware)

| Surface | Endpoint | TTL | Calls/min (steady state) |
|---------|---------|-----|--------------------------|
| List page | `GET /coins/markets` | 60s | 1 |
| Detail page (price data) | `GET /coins/{id}` | 120s | ≤ unique coins/min |
| Detail page (metadata) | Same call, split if needed | 3600s | — |
| Favourites prices | `GET /coins/markets?ids=...` | 60s | 1 |
| Price history chart | `GET /coins/{id}/market_chart` | 300s | ≤ unique coins with open chart |

**Key principle**: Use `GET /coins/markets?ids=...` for the favourites list —
one call for all N coins, not N calls. Never loop `GET /coins/{id}`.

---

## 8. Pagination, Search & Sort Architecture

### Pagination strategy

**Decision**: URL-driven page-based pagination, 50 coins per page

- `GET /coins/markets?per_page=50&page={N}` maps directly to the URL `?page=N`
- Every page is a distinct, bookmarkable, shareable URL
- Works with Next.js App Router `searchParams` prop (Server Component reads it)
- Reading `searchParams` opts the route into dynamic rendering (correct for live data)
- The Data Cache (`revalidate: 60`) still applies at the fetch layer — two users on
  `/?page=2` within 60s share one cached CoinGecko response

**Rejected**: Infinite scroll (breaks URL state, requires client component for scroll
listener, hostile to keyboard nav and deep-linking). Virtual scroll (no DOM bloat
problem at 50 rows; requires `"use client"`, loses server rendering).

### Search

**Decision**: Server-side via `?q=` URL param; fetch 250 coins and filter server-side

- Client-side filter only operates on the current page — misleads users who expect
  global search
- When `q` is set: fetch `per_page=250&page=1`, filter by name/symbol on the server,
  render matches (pagination disabled during active search)
- Search input is a Client Component with debounced `router.replace()` (300–500ms)
  to avoid per-keystroke API calls

### Sorting

**Decision**: Server-side via `?sort=` URL param; always reset `?page=1` on sort change

CoinGecko native `order` values: `market_cap_desc` (default), `market_cap_asc`,
`volume_desc`, `volume_asc`, `id_asc`, `id_desc`.

For 24h-change sort (not a native CoinGecko order param): fetch `per_page=250`,
sort application-side by `price_change_percentage_24h`, then paginate. The 250-record
fetch is cached for 60s and shared across requests.

Column header components: Client Components reading `useSearchParams()`, rendering
`<Link prefetch={false}>` to prevent N background CoinGecko calls on mount.

### Loading skeletons

- `loading.tsx` at route level: full-page fallback during navigation
- Manual `<Suspense fallback={<CoinListSkeleton rows={50} />}>` around the coin list:
  shows page chrome (title, search, column headers, pagination) instantly while only
  the list area shows skeleton rows
- Skeleton row count must match `PAGE_SIZE` constant to eliminate layout shift
- Pagination controls also get skeleton treatment at the bottom
