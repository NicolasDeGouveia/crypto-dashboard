# Tasks: Full Crypto Dashboard with Authentication & Favourites

**Input**: Design documents from `specs/002-crypto-dashboard-auth/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ ✅ quickstart.md ✅

**Tests**: Included (Vitest + React Testing Library) — write tests first, verify they FAIL before implementing.

**Organization**: Tasks grouped by user story. Each story is independently implementable and testable.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install new dependencies, configure environment, set up Drizzle + Neon connection.

- [X] T001 Install new dependencies: `next-auth@beta`, `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `@node-rs/argon2`, `@upstash/ratelimit`, `@upstash/redis` in `package.json`
- [X] T00Add `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` to `.env.example` with placeholder values and document in `README.md`
- [X] T00[P] Add `assets.coingecko.com` to `images.remotePatterns` in `next.config.ts` for Next.js Image optimization
- [X] T00[P] Create `drizzle.config.ts` at repo root pointing `DATABASE_URL` to `app/_lib/db/schema.ts`
- [X] T00[P] Update `app/_lib/constants.ts` — add `PAGE_SIZE = 50`, `DEFAULT_SORT = 'market_cap_desc'`, `SORT_OPTIONS` map, remove hardcoded `COINS` array (keep as fallback constant)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema, Drizzle client, Auth.js config, and middleware — required before any user story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T00Create Drizzle client in `app/_lib/db/index.ts` — instantiate `drizzle()` with `@neondatabase/serverless` HTTP driver, export `db` singleton
- [X] T00Define Auth.js required tables in `app/_lib/db/schema.ts` — `users` (with added `password` and `createdAt` columns), `accounts`, `sessions`, `verificationTokens` using Drizzle schema syntax
- [X] T00Add `favourites` table to `app/_lib/db/schema.ts` — columns: `id` (serial PK), `userId` (text FK → users.id CASCADE), `coinId` (text), `addedAt` (timestamp DEFAULT now()); add unique constraint on `(userId, coinId)` and index on `userId`
- [X] T00Generate initial Drizzle migration with `drizzle-kit generate` — output to `db/migrations/`; verify SQL contains all tables with correct constraints
- [X] T01Create `auth.ts` at repo root — configure Auth.js v5 with credentials provider; implement `authorize` callback that fetches user by email via Drizzle and verifies password with `@node-rs/argon2`; set JWT session strategy, 24h expiry
- [X] T01Create `middleware.ts` at repo root — export Auth.js `auth` as middleware; configure matcher to exclude `/api/auth/*`, `_next/static`, `_next/image`, `favicon.ico`; redirect unauthenticated users away from `/(protected)/*` routes
- [X] T01Create `app/(protected)/layout.tsx` — call `auth()`, redirect to `/login` if no session (defence-in-depth layer 2)
- [X] T01[P] Create `app/_lib/types.ts` additions — define `CoinMarketSummary` and extend `CoinDetail` types per `data-model.md` field inventory (replacing current minimal `CoinDetails` type)
- [X] T01[P] Update `app/_lib/api.ts` — add `getCoinMarkets({ page, sort, perPage, ids? }: CoinMarketsParams)` function calling `GET /coins/markets` with `revalidate: 60`; update `getCoinDetails` to use new query params `localization=false&tickers=false&sparkline=true` with `revalidate: 120`

**Checkpoint**: `db`, `auth`, middleware, types, and API service layer are ready. Run `npm run build` — should compile without errors.

---

## Phase 3: User Story 1 — Browse the Full Coin List (Priority: P1) 🎯 MVP

**Goal**: Replace the 5-coin hardcoded list with a paginated, searchable, sortable top-100 list driven by URL `searchParams`.

**Independent Test**: Navigate to `/` without logging in. Verify 50 coins load on page 1, pagination works (`?page=2` shows next 50), search filters results, sort reorders list, clicking a coin navigates to detail page, and all three states (loading/error/populated) render correctly.

### Tests for User Story 1

> **Write tests FIRST — verify they FAIL before implementing**

- [X] T01[P] [US1] Write unit tests for `getCoinMarkets()` in `app/_lib/__tests__/api.test.ts` — mock fetch, assert correct URL construction for page/sort/search params, assert `CoinMarketSummary[]` return shape, assert null on API error
- [X] T01[P] [US1] Write unit tests for `formatMarketCap()`, `formatVolume()`, `formatSupply()` utility functions in `app/_lib/__tests__/utils.test.ts`
- [X] T01[P] [US1] Write component test for `<PaginationControls>` in `app/components/__tests__/PaginationControls.test.tsx` — assert prev/next links render correct `?page=` URLs, assert current page is highlighted, assert disabled state on first/last page
- [X] T01[P] [US1] Write component test for `<SearchInput>` in `app/components/__tests__/SearchInput.test.tsx` — assert input renders with initial value from URL, assert `router.replace` is called with debounced query after typing
- [X] T01[P] [US1] Write component test for `<SortableColumnHeader>` in `app/components/__tests__/SortableColumnHeader.test.tsx` — assert active sort column shows directional indicator, assert link href resets page to 1 when sort changes
- [X] T02[P] [US1] Write component test for `<CoinListSkeleton>` in `app/components/__tests__/CoinListSkeleton.test.tsx` — assert exactly `PAGE_SIZE` (50) skeleton rows render
- [X] T02[P] [US1] Write component test for updated `<CoinListItem>` in `app/components/__tests__/CoinListItem.test.tsx` — assert coin image renders with `next/image`, assert name/symbol/price/change display correctly, assert link navigates to `/coins/[id]`

### Implementation for User Story 1

- [X] T02[P] [US1] Add `formatMarketCap(n: number)`, `formatVolume(n: number)`, `formatSupply(n: number | null)` utility functions to `app/_lib/utils.ts` — format large numbers as `$1.23T`, `$456.7B`, `123.4M` etc.
- [X] T02[P] [US1] Create `app/components/CoinListSkeleton.tsx` — renders `PAGE_SIZE` (50) animated pulse rows matching exact grid layout of `CoinListItem` (4-column at `lg`, stacked on mobile); include skeleton pagination bar at bottom
- [X] T02[P] [US1] Create `app/components/PaginationControls.tsx` — Client Component; reads `useSearchParams()` for current page; renders Prev/Next buttons and page number links as `<Link prefetch={false}>` using `createQueryString` helper; disables Prev on page 1
- [X] T02[P] [US1] Create `app/components/SearchInput.tsx` — Client Component; debounced (350ms) input that calls `router.replace()` with `?q=` param; clears `?page=` to 1 on new search; reads initial value from `useSearchParams()`
- [X] T02[P] [US1] Create `app/components/SortableColumnHeader.tsx` — Client Component; renders column header as `<Link prefetch={false}>` pointing to `?sort=<value>&page=1`; shows ▲/▼ indicator for active sort column
- [X] T02[US1] Update `app/components/CoinListItem.tsx` — add `image` prop; render coin logo with `<Image>` (24×24, from `assets.coingecko.com`); add `marketCap` and `volume` props with formatted display; keep existing price/change display
- [X] T02[US1] Update `app/page.tsx` — `await searchParams`; parse `page`, `sort`, `q` params with safe defaults; call `getCoinMarkets()`; when `q` is set fetch `perPage=250` and filter server-side; render column headers with `<SortableColumnHeader>`, list with `<CoinListItem>`, controls with `<SearchInput>` and `<PaginationControls>`; handle error and empty states
- [X] T02[US1] Update `app/loading.tsx` — replace hardcoded 5-row skeleton with `<CoinListSkeleton />` (50 rows)

**Checkpoint**: `npm run dev` → navigate to `/`. 50 coins visible, pagination/search/sort all functional without login. Run `npm test` — all US1 tests pass.

---

## Phase 4: User Story 2 — Rich Coin Detail Page (Priority: P2)

**Goal**: Enrich the existing `/coins/[id]` page with market cap, volume, supply, ATH, coin logo, description, and multi-period price changes.

**Independent Test**: Navigate to `/coins/bitcoin`. Verify logo, description, market cap, 24h volume, circulating supply, max supply, ATH price + date, 7d/30d change %, and sparkline all render. Verify error state for an unknown coin ID.

### Tests for User Story 2

> **Write tests FIRST — verify they FAIL before implementing**

- [ ] T030 [P] [US2] Write unit tests for updated `getCoinDetails()` in `app/_lib/__tests__/api.test.ts` — assert correct URL with `localization=false&tickers=false&sparkline=true`, assert full `CoinDetail` return shape including `sparkline7d` array, assert null on 404
- [ ] T031 [P] [US2] Write component test for `<CoinDescription>` in `app/components/__tests__/CoinDescription.test.tsx` — assert HTML description is sanitized and rendered, assert component renders nothing when description is empty
- [ ] T032 [P] [US2] Write component test for `<SparklineChart>` in `app/components/__tests__/SparklineChart.test.tsx` — assert SVG renders with correct number of data points, assert green/red colour based on first vs last price
- [ ] T033 [P] [US2] Write component test for `<PriceChangeTable>` in `app/components/__tests__/PriceChangeTable.test.tsx` — assert 24h/7d/30d rows render with correct colours and `+/-` prefix

### Implementation for User Story 2

- [ ] T034 [P] [US2] Create `app/components/CoinDescription.tsx` — renders `description.en` field; strips HTML tags to plain text (no external HTML parser needed — use a simple regex replace for `<[^>]+>`); truncates to 500 chars with "Read more" expand; renders nothing if description is empty string
- [ ] T035 [P] [US2] Create `app/components/SparklineChart.tsx` — pure SVG, no chart library; accepts `prices: number[]` array; renders a simple polyline path scaled to a 200×50 viewBox; green if last price ≥ first, red if lower; no axes or labels (sparkline only)
- [ ] T036 [P] [US2] Create `app/components/PriceChangeTable.tsx` — renders a table of price change periods (24h, 7d, 30d); each row shows period label and `+X.XX%` / `-X.XX%` coloured emerald/red; reuses `formatPercent()` from utils
- [ ] T037 [P] [US2] Add `formatPercent(n: number)` and `formatDate(iso: string)` utility functions to `app/_lib/utils.ts`
- [ ] T038 [US2] Update `app/coins/[id]/page.tsx` — use updated `getCoinDetails()` (already updated in T014); render coin logo with `<Image>` (large, 64×64); add `<CoinDescription>`, `<SparklineChart sparkline7d={...}>`, `<PriceChangeTable>`; add new `<StatCard>` rows for market cap, 24h volume, circulating supply, max supply, ATH price + date; keep existing 24h high/low/change cards

**Checkpoint**: Navigate to `/coins/bitcoin` — all enriched fields visible. Run `npm test` — all US2 tests pass.

---

## Phase 5: User Story 3 — User Registration & Login (Priority: P3)

**Goal**: Email + password registration and login via Auth.js v5 credentials provider. Session persists 24h. UserNav in header shows login state.

**Independent Test**: Register new account → redirected to dashboard, logged in. Log out → guest. Log in again → session restored. Duplicate email → clear error. Wrong credentials → generic error.

### Tests for User Story 3

> **Write tests FIRST — verify they FAIL before implementing**

- [ ] T039 [P] [US3] Write unit tests for `register()` Server Action in `app/_actions/__tests__/auth.test.ts` — mock Drizzle `db`, mock `argon2.hash`; assert `EMAIL_IN_USE` error when email exists; assert `PASSWORD_TOO_SHORT` for <8 chars; assert `INVALID_EMAIL` for bad format; assert user row inserted and session set on success
- [ ] T040 [P] [US3] Write unit tests for Auth.js `authorize` callback in `auth.test.ts` — mock Drizzle `db.select`, mock `argon2.verify`; assert null returned for unknown email; assert null returned for wrong password; assert user object returned for correct credentials
- [ ] T041 [P] [US3] Write component test for `<LoginForm>` in `app/components/__tests__/LoginForm.test.tsx` — assert form renders email + password fields; assert error message displays when action returns error; assert submit button disables during pending state
- [ ] T042 [P] [US3] Write component test for `<RegisterForm>` in `app/components/__tests__/RegisterForm.test.tsx` — assert form renders; assert client-side validation shows error for password <8 chars before submit; assert server error message renders
- [ ] T043 [P] [US3] Write component test for `<UserNav>` in `app/components/__tests__/UserNav.test.tsx` — assert "Login" link renders when session is null; assert user email and "Log out" button render when session is present

### Implementation for User Story 3

- [ ] T044 [P] [US3] Create `app/_actions/auth.ts` — implement `register(formData: FormData)` Server Action: validate email format (max 254 chars) and password length (8–128 chars); check for existing email via Drizzle; hash password with `argon2.hash()`; insert user row; call `signIn('credentials', ...)` to set session; return typed error objects for each failure case
- [ ] T045 [P] [US3] Create `app/components/LoginForm.tsx` — Client Component; `useActionState` bound to Auth.js `signIn`; email + password fields; shows error message from action state; submit button with pending state via `useFormStatus`
- [ ] T046 [P] [US3] Create `app/components/RegisterForm.tsx` — Client Component; `useActionState` bound to `register` Server Action; email + password fields; client-side password length check before submit; shows server error message; submit button with pending state
- [ ] T047 [P] [US3] Create `app/components/UserNav.tsx` — Server Component; calls `auth()` to get session; if no session renders `<Link href="/login">Login</Link>`; if session renders user email + logout button (form with Auth.js `signOut` Server Action)
- [ ] T048 [P] [US3] Create `app/(auth)/login/page.tsx` — redirect to `/` if already authenticated; render page title + `<LoginForm />`; include link to `/register`
- [ ] T049 [P] [US3] Create `app/(auth)/register/page.tsx` — redirect to `/` if already authenticated; render page title + `<RegisterForm />`; include link to `/login`
- [ ] T050 [US3] Update `app/layout.tsx` — import and render `<UserNav />` in the header area; ensure `<SessionProvider>` wraps children if needed for client-side session access

**Checkpoint**: Register, log out, log in — full cycle works. `npm test` — all US3 tests pass.

---

## Phase 6: User Story 4 — Manage Favourite Coins (Priority: P4)

**Goal**: Logged-in users can toggle favourites from the coin list and detail page, view a `/favourites` page with live prices, and remove favourites. Guest users are redirected to login.

**Independent Test**: Log in → toggle 3 coins as favourites from list and detail pages → navigate to `/favourites` → all 3 appear with live prices → remove one → list updates immediately without full reload. Log out → click favourite toggle → redirected to `/login`.

### Tests for User Story 4

> **Write tests FIRST — verify they FAIL before implementing**

- [ ] T051 [P] [US4] Write unit tests for `addFavourite()` in `app/_actions/__tests__/favourites.test.ts` — mock `auth()` and Drizzle `db`; assert `UNAUTHENTICATED` error when no session; assert `INVALID_COIN_ID` for bad coinId format; assert DB insert called with correct `userId` + `coinId`; assert idempotent (no error on duplicate insert attempt)
- [ ] T052 [P] [US4] Write unit tests for `removeFavourite()` in `app/_actions/__tests__/favourites.test.ts` — assert `UNAUTHENTICATED` when no session; assert DB delete called; assert no error when coin not in favourites (idempotent)
- [ ] T053 [P] [US4] Write unit tests for `GET /api/favourites/prices` route in `app/api/favourites/prices/__tests__/route.test.ts` — mock `auth()` and `getCoinMarkets()`; assert 401 when unauthenticated; assert empty `{ coins: [] }` when user has no favourites; assert `getCoinMarkets` called with `ids=` param matching user's saved coinIds
- [ ] T054 [P] [US4] Write component test for `<FavouriteToggle>` in `app/components/__tests__/FavouriteToggle.test.tsx` — assert filled icon when `isFavourited=true`; assert outline icon when false; assert `addFavourite` called on click when not favourited; assert `removeFavourite` called on click when favourited; assert redirect to `/login` triggered when `isAuthenticated=false`
- [ ] T055 [P] [US4] Write component test for `<FavouritesList>` in `app/components/__tests__/FavouritesList.test.tsx` — assert renders list of coins with price data; assert "data unavailable" indicator for coin with null price; assert empty-state message and link when list is empty

### Implementation for User Story 4

- [ ] T056 [P] [US4] Create `app/_actions/favourites.ts` — implement `addFavourite(coinId: string)` and `removeFavourite(coinId: string)` Server Actions per contracts/api-routes.md; validate coinId with `/^[a-z0-9-]+$/` regex (max 100 chars); use `auth()` to get session; use Drizzle `insert ... onConflictDoNothing()` for add and `delete ... where(and(...))` for remove; return typed `{ success: boolean, error?: string }` responses
- [ ] T057 [US4] Create `app/api/favourites/prices/route.ts` — GET Route Handler; call `auth()`, return 401 if no session; query `db.select().from(favourites).where(eq(favourites.userId, session.user.id))`; if empty return `{ coins: [] }`; call `getCoinMarkets({ ids: coinIds.join(','), perPage: 250 })` with `revalidate: 60`; return `{ coins }` shaped per contract
- [ ] T058 [P] [US4] Create `app/components/FavouriteToggle.tsx` — Client Component; accepts `coinId`, `isFavourited`, `isAuthenticated` props; renders star/bookmark icon (filled or outline); on click: if not authenticated call `router.push('/login')`; otherwise call `addFavourite` or `removeFavourite` Server Action; use `useTransition` for pending state (icon spins/dims during action); update local optimistic state immediately via `useOptimistic`
- [ ] T059 [P] [US4] Create `app/components/FavouritesList.tsx` — Server Component; accepts `coins: CoinMarketSummary[]` and `favouriteIds: string[]`; renders list of `<CoinListItem>` with `<FavouriteToggle>` for each; shows "data unavailable" badge for coins with null `currentPrice`; shows empty-state with link to `/` if `coins` is empty
- [ ] T060 [US4] Update `app/page.tsx` — pass `isFavourited` and `isAuthenticated` props to each `<CoinListItem>`; call `auth()` to get session; if session, query `db.select(favourites.coinId).from(favourites).where(eq(favourites.userId, session.user.id))` to get user's favourite IDs; render `<FavouriteToggle>` inside each row
- [ ] T061 [US4] Update `app/coins/[id]/page.tsx` — add `<FavouriteToggle>` near the coin title; pass `isFavourited` (check against user's favourite IDs) and `isAuthenticated`
- [ ] T062 [US4] Create `app/(protected)/favourites/page.tsx` — session is guaranteed by `(protected)` layout; fetch user's favourite coin IDs from DB; fetch live prices via `GET /api/favourites/prices` (or call `getCoinMarkets` directly with `ids=`); render `<FavouritesList>`; render page title "My Favourites" with count badge
- [ ] T063 [P] [US4] Create `app/(protected)/favourites/loading.tsx` — skeleton for favourites page: title bar + 5-row coin list skeleton (favourites lists are typically smaller than the main list)
- [ ] T064 [US4] Update `app/components/UserNav.tsx` — add link to `/favourites` when session is active (alongside existing logout button)

**Checkpoint**: Full favourites flow works end-to-end. Toggle persists across logout/login. `npm test` — all US4 tests pass.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, rate-limit protection, error boundaries, accessibility, and final validation.

- [ ] T065 [P] Add Upstash rate limiting to the login endpoint — create `app/_lib/ratelimit.ts` wrapping `@upstash/ratelimit` with sliding window (5 requests / 15 min per IP); apply in the Auth.js credentials `authorize` callback; return generic auth failure (not a rate-limit-specific message) to avoid leaking limit info
- [ ] T066 [P] Add `SESSION_EXPIRED` redirect handling — in `middleware.ts`, detect expired JWT (Auth.js throws on decode); redirect to `/login?reason=expired`; in `app/(auth)/login/page.tsx` read `reason` searchParam and show "Your session expired" banner
- [ ] T067 [P] Responsive audit — verify all new pages/components at 375 px, 768 px, 1280 px breakpoints per constitution Principle III; fix any overflowing content in `PaginationControls`, `CoinListItem` (image + toggle), and `FavouritesList`
- [ ] T068 [P] Keyboard navigation & WCAG 2.1 AA audit — ensure `<FavouriteToggle>` has `aria-label` (e.g., "Add bitcoin to favourites"), `<PaginationControls>` has `aria-label="Pagination"`, `<SearchInput>` has associated `<label>`, all interactive elements reachable via Tab
- [ ] T069 [P] Add rate-limit error state — in `app/page.tsx` and `app/(protected)/favourites/page.tsx`, detect HTTP 429 from CoinGecko (null return from API with rate-limit log); render dedicated `<ErrorMessage title="Too many requests" message="Data will refresh automatically in 60 seconds." />` instead of generic error
- [ ] T070 [P] Update `README.md` — add `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `UPSTASH_*` env vars to setup instructions; add `npm run db:migrate` step; add links to Neon and Upstash free tier signup
- [ ] T071 [P] Add `db:migrate` and `db:studio` scripts to `package.json` — `"db:migrate": "drizzle-kit migrate"`, `"db:studio": "drizzle-kit studio"`
- [ ] T072 Run full `quickstart.md` validation — execute every step in the quickstart guide against the running dev server; confirm all acceptance scenarios pass; check browser console for errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 only — no dependency on US2/US3/US4
- **Phase 4 (US2)**: Depends on Phase 2 only — no dependency on US1/US3/US4
- **Phase 5 (US3)**: Depends on Phase 2 only — no dependency on US1/US2/US4
- **Phase 6 (US4)**: Depends on Phase 2 + US1 (coin list needed) + US3 (auth needed)
- **Phase 7 (Polish)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Independent after Phase 2
- **US2 (P2)**: Independent after Phase 2 — can run in parallel with US1
- **US3 (P3)**: Independent after Phase 2 — can run in parallel with US1 and US2
- **US4 (P4)**: Requires US1 (coin list + `CoinListItem`) and US3 (auth session) to be complete

### Within Each User Story

- Tests MUST be written and confirmed FAILING before implementation begins
- Types/utilities before components
- Components before pages
- Core implementation before integration with other stories
- Commit after each task or logical group

### Parallel Opportunities

- T015–T021 (US1 tests): all parallel
- T022–T026 (US1 components): all parallel
- T030–T033 (US2 tests): all parallel
- T034–T037 (US2 components/utils): all parallel
- T039–T043 (US3 tests): all parallel
- T044–T049 (US3 implementation): all parallel
- T051–T055 (US4 tests): all parallel
- T056, T058, T059, T063 (US4 parallel tasks): all parallel
- T065–T071 (Polish): all parallel

---

## Parallel Execution Examples

### Launching US1 tests together (write first, verify FAIL)
```
T015: unit test getCoinMarkets() → app/_lib/__tests__/api.test.ts
T016: unit test formatMarketCap/Volume/Supply → app/_lib/__tests__/utils.test.ts
T017: component test PaginationControls → app/components/__tests__/PaginationControls.test.tsx
T018: component test SearchInput → app/components/__tests__/SearchInput.test.tsx
T019: component test SortableColumnHeader → app/components/__tests__/SortableColumnHeader.test.tsx
T020: component test CoinListSkeleton → app/components/__tests__/CoinListSkeleton.test.tsx
T021: component test CoinListItem → app/components/__tests__/CoinListItem.test.tsx
```

### Launching US1 components together (after tests written)
```
T022: utils formatMarketCap/Volume/Supply → app/_lib/utils.ts
T023: CoinListSkeleton → app/components/CoinListSkeleton.tsx
T024: PaginationControls → app/components/PaginationControls.tsx
T025: SearchInput → app/components/SearchInput.tsx
T026: SortableColumnHeader → app/components/SortableColumnHeader.tsx
```

### Running US1 + US2 + US3 in parallel after Phase 2
```
Developer A: Phase 3 (US1) — T015 → T029
Developer B: Phase 4 (US2) — T030 → T038
Developer C: Phase 5 (US3) — T039 → T050
All converge at Phase 6 (US4)
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks everything)
3. Complete Phase 3: US1 (paginated coin list)
4. **STOP AND VALIDATE**: open `/`, verify 50 coins, pagination, search, sort
5. Deploy/demo — the dashboard already delivers core value without auth

### Incremental Delivery

1. Setup + Foundational → infra ready
2. US1 → paginated list live → **demo-able MVP**
3. US2 → enriched detail pages → **more informative**
4. US3 → auth working → **users can register**
5. US4 → favourites working → **full feature complete**

### Solo Developer Order (recommended)

P1 → P2 → P3 → P4 sequentially. Each phase is fully testable before the next begins.
US1 and US2 have no auth dependency and can be shipped publicly immediately after Phase 2.

---

## Notes

- `[P]` = parallelizable (different files, no incomplete dependency)
- `[USN]` = traceability to user story N from `spec.md`
- Tests MUST fail before implementation — red-green-refactor
- Commit after each task or logical group
- Stop at each **Checkpoint** to validate the story independently before moving on
- `npm run build` should pass at every checkpoint (no TypeScript errors)
