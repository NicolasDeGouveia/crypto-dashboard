# Research: Fix Coin List Column Sorting

## Root Cause Analysis

### Bug 1 — `SORT_OPTIONS` does not include Name and Price sort keys

`page.tsx` uses `SortableColumnHeader` with `sortKey="id_asc"` (Name) and `sortKey="price_asc"` (Price). These two keys are **not present** in `constants.ts` `SORT_OPTIONS`. The page guard:

```ts
const currentSort = SORT_OPTIONS[sortParam ?? ""] ? sortParam : DEFAULT_SORT;
```

evaluates `SORT_OPTIONS["id_asc"]` → `undefined` (falsy) and falls back to `market_cap_desc`. Clicking Name or Price effectively does nothing — the list always renders in default market-cap order.

**Fix**: Add `id_asc`, `id_desc`, `price_asc`, `price_desc` (and analogues for all togglable columns) to `SORT_OPTIONS`.

---

### Bug 2 — No asc/desc toggle on the same column

Each `SortableColumnHeader` receives a single static `sortKey`. A second click on the same active column navigates to the exact same URL with the same `sort=` param — direction never inverts.

**Fix**: `SortableColumnHeader` must compute the _next_ sort key based on whether the column is currently active:
- If inactive → navigate to the column's default direction.
- If active and currently `_desc` → navigate to `_asc`.
- If active and currently `_asc` → navigate to `_desc`.

---

### Bug 3 — `id_asc` is not a valid CoinGecko `order` parameter

The CoinGecko `/coins/markets` endpoint accepts the following `order` values:
- `market_cap_desc`, `market_cap_asc`
- `volume_desc`, `volume_asc`
- `price_change_percentage_24h_desc`, `price_change_percentage_24h_asc`
- `gecko_desc`, `gecko_asc` — gecko score (not name)

**There is no `id_asc` or `price_asc`/`price_desc` order parameter** in the CoinGecko API.

**Consequence**: Sorting by Name and Price cannot be delegated to the API. It must be done client-side (after fetch) on the already-returned page of data.

**Fix strategy**:
- API sort: keep delegating `market_cap_desc/asc`, `volume_desc/asc`, `price_change_percentage_24h_desc/asc` to CoinGecko.
- Client sort: for `name_asc/desc` and `price_asc/desc`, fetch with `DEFAULT_SORT` and sort the returned array in-memory before rendering.

This is consistent with the constitution's **Principle V (Simplicity)** — no new dependency needed; array `.sort()` is sufficient for ≤ 50 items per page.

---

## Decisions

### Decision 1: Client-side sort for Name and Price

- **Chosen**: Sort the fetched array in `page.tsx` for `name_*` and `price_*` keys.
- **Rationale**: CoinGecko does not support these orderings server-side. For ≤ 50 items this is instant and adds zero complexity.
- **Alternatives considered**: Pre-sorting at build time (not applicable — live data); separate API call (unnecessary overhead).

### Decision 2: Sort key naming convention

Internal sort keys will follow the pattern `{field}_{direction}`:
- `name_asc` / `name_desc`
- `price_asc` / `price_desc`
- `market_cap_desc` / `market_cap_asc` (already exist, keep as-is)
- `volume_desc` / `volume_asc` (already exist, keep as-is)
- `price_change_percentage_24h_desc` / `price_change_percentage_24h_asc` (already exist, keep as-is)

### Decision 3: Toggle logic lives in `SortableColumnHeader`

The component receives a `defaultSortKey` and a `toggleSortKey`. When active it links to `toggleSortKey`; when inactive it links to `defaultSortKey`. This is purely presentational — zero server-side changes.

**Alternative considered**: Compute toggle in `page.tsx` and pass resolved `href` as prop. Rejected — the component already reads `useSearchParams()` client-side, so computing the toggle there is natural and keeps `page.tsx` lean.

### Decision 4: Sort state is URL-driven (no client state)

Sorting is already URL-driven (`?sort=`). This is preserved. No `useState` or `useReducer` is introduced. Sorting survives page reload if the user copies the URL — good UX for free.

---

## CoinGecko API — Valid `order` values (confirmed)

| Value | Meaning |
|---|---|
| `market_cap_desc` | Market cap descending (default) |
| `market_cap_asc` | Market cap ascending |
| `volume_desc` | 24h volume descending |
| `volume_asc` | 24h volume ascending |
| `price_change_percentage_24h_desc` | 24h % change descending |
| `price_change_percentage_24h_asc` | 24h % change ascending |
| `gecko_desc` / `gecko_asc` | Gecko score (not used) |

`id_asc`, `price_asc`, `price_desc` — **not valid**; must be handled client-side.
