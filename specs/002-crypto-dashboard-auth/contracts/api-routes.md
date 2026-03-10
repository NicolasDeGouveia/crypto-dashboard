# API Contracts: Full Crypto Dashboard with Authentication & Favourites

**Branch**: `002-crypto-dashboard-auth` | **Date**: 2026-03-10

These contracts define the server interfaces this feature introduces. Auth.js v5
manages its own routes under `/api/auth/*` (login, logout, session); those are
not documented here. The contracts below cover application-level API routes and
Server Actions introduced for the favourites feature.

---

## Server Actions (Next.js)

Server Actions are the primary interface for mutations. They are invoked from
Client Components or forms. They run server-side only and have built-in CSRF
protection via Next.js Origin header validation.

---

### `addFavourite(coinId: string)`

Adds a coin to the authenticated user's favourites list.

**File**: `app/_actions/favourites.ts`

**Auth**: Required. Returns an error if called without a valid session.

**Input**:
```ts
coinId: string  // CoinGecko coin ID, e.g. "bitcoin"
```

**Validation**:
- `coinId` must be a non-empty string
- `coinId` must match pattern `/^[a-z0-9-]+$/` (CoinGecko IDs are lowercase alphanumeric with hyphens)
- Maximum length: 100 characters

**Success response**:
```ts
{ success: true }
```

**Error responses**:
```ts
{ success: false, error: "UNAUTHENTICATED" }   // No valid session
{ success: false, error: "INVALID_COIN_ID" }   // Fails validation
{ success: false, error: "ALREADY_EXISTS" }    // Coin already in favourites (idempotent: treat as success in UI)
{ success: false, error: "DB_ERROR" }          // Database write failed
```

**Behaviour**: Idempotent — if the coin is already a favourite, return success
without creating a duplicate row (enforced by unique constraint on `(userId, coinId)`).

---

### `removeFavourite(coinId: string)`

Removes a coin from the authenticated user's favourites list.

**File**: `app/_actions/favourites.ts`

**Auth**: Required.

**Input**:
```ts
coinId: string  // CoinGecko coin ID
```

**Success response**:
```ts
{ success: true }
```

**Error responses**:
```ts
{ success: false, error: "UNAUTHENTICATED" }
{ success: false, error: "INVALID_COIN_ID" }
{ success: false, error: "DB_ERROR" }
```

**Behaviour**: Idempotent — if the coin is not in favourites, return success
(no-op). Do not return an error for a missing record.

---

### `register(formData: FormData)`

Creates a new user account.

**File**: `app/_actions/auth.ts`

**Auth**: Must NOT be authenticated (redirect to dashboard if already logged in).

**Input** (from FormData):
```ts
email:    string  // Must be a valid email format
password: string  // Minimum 8 characters
```

**Validation**:
- `email`: non-empty, valid email format (`x@y.z`), max 254 characters
- `password`: minimum 8 characters, maximum 128 characters

**Success response**: Redirects to `/` (dashboard) with new session cookie set.

**Error responses** (returned to the form via `useActionState`):
```ts
{ error: "EMAIL_IN_USE" }       // Email already registered
{ error: "INVALID_EMAIL" }      // Email fails format validation
{ error: "PASSWORD_TOO_SHORT" } // Password < 8 characters
{ error: "DB_ERROR" }           // Account creation failed
```

**Security**: Never reveal whether a specific email is registered in error messages
shown to the user — use generic "Registration failed" copy for `EMAIL_IN_USE` in
the UI layer.

---

## API Route Handlers

Route Handlers are used where a REST-style endpoint is cleaner (e.g., fetching
favourites prices — a GET request with no side effects).

---

### `GET /api/favourites/prices`

Returns live price data for all coins in the authenticated user's favourites list.
Uses `GET /coins/markets?ids=...` to batch-fetch all favourite coins in a single
CoinGecko API call.

**Auth**: Required. Returns 401 if no session.

**Request**: No body. Session is read from cookie.

**Response (200)**:
```ts
{
  coins: Array<{
    id: string
    symbol: string
    name: string
    image: string
    currentPrice: number
    priceChangePercent24h: number
    marketCap: number
    totalVolume: number
  }>
}
```

**Response (401)**:
```json
{ "error": "UNAUTHENTICATED" }
```

**Response (200, empty)**:
```json
{ "coins": [] }
```
*(User has no favourites — empty list is a valid successful response.)*

**Caching**: `revalidate: 60` — CoinGecko prices are shared across requests for the
same set of coin IDs.

**Rate limit note**: One CoinGecko call for all N favourites. The `ids` parameter
accepts up to 250 comma-separated coin IDs — sufficient for any realistic favourites
list.

---

## Page Routes (Server Components)

These are not API routes but document the URL structure introduced by this feature.

| Route | Auth required | Description |
|-------|--------------|-------------|
| `/` | No | Paginated coin list (top 100, 50/page). Query: `?page=N&sort=...&q=...` |
| `/coins/[id]` | No | Enriched coin detail page |
| `/login` | No (redirect to `/` if already authed) | Login form |
| `/register` | No (redirect to `/` if already authed) | Registration form |
| `/favourites` | Yes (redirect to `/login` if not authed) | User's saved coins with live prices |

---

## CoinGecko External API (consumed, not exposed)

Documented here for reference — these are the external calls the application makes.

| Endpoint | When called | TTL | Parameters |
|---------|------------|-----|-----------|
| `GET /coins/markets` | List page, favourites page | 60s | `vs_currency=usd`, `order`, `per_page`, `page`, `ids` (for favourites) |
| `GET /coins/{id}` | Detail page | 120s | `localization=false`, `tickers=false`, `sparkline=true` |

Authentication: `x-cg-demo-api-key` header (existing pattern, no change).
