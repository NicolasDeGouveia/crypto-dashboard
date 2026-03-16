# Data Model: Fix Coin List Column Sorting

## No new data entities

This feature introduces no new database tables, API resources, or persistent data structures. It is a pure UI/logic fix on existing data.

---

## Sort Key Taxonomy

The internal sort key is a URL query parameter (`?sort=`). It serves as the single source of truth for sort state.

| Sort Key | Handled By | CoinGecko `order` passed |
|---|---|---|
| `market_cap_desc` | API | `market_cap_desc` |
| `market_cap_asc` | API | `market_cap_asc` |
| `volume_desc` | API | `volume_desc` |
| `volume_asc` | API | `volume_asc` |
| `price_change_percentage_24h_desc` | API | `price_change_percentage_24h_desc` |
| `price_change_percentage_24h_asc` | API | `price_change_percentage_24h_asc` |
| `name_asc` | Client (in-memory) | `market_cap_desc` (fetch default) |
| `name_desc` | Client (in-memory) | `market_cap_desc` (fetch default) |
| `price_asc` | Client (in-memory) | `market_cap_desc` (fetch default) |
| `price_desc` | Client (in-memory) | `market_cap_desc` (fetch default) |

**Default sort key**: `market_cap_desc` (unchanged).

---

## `SortableColumnHeader` Props Contract

Current props:
```ts
type Props = {
  label: string;
  sortKey: string; // single static key — BUG: no toggle
}
```

New props:
```ts
type Props = {
  label: string;
  defaultSortKey: string;  // key used on first click (when column is inactive)
  toggleSortKey: string;   // key used on second click (when column is active)
}
```

Toggle logic:
- `isActive = currentSort === defaultSortKey || currentSort === toggleSortKey`
- `nextSortKey = isActive && currentSort === defaultSortKey ? toggleSortKey : defaultSortKey`

Direction indicator:
- Active + current ends with `_desc` → show `↓`
- Active + current ends with `_asc` → show `↑`

---

## `SORT_OPTIONS` in `constants.ts`

Keys to **add** (currently missing, causing fallback to default):

```ts
name_asc: 'Name A→Z',
name_desc: 'Name Z→A',
price_asc: 'Price ↑',
price_desc: 'Price ↓',
```

---

## Client-side sort function (pure utility)

Location: `app/_lib/utils.ts` (existing file)

Signature:
```ts
function sortCoins(
  coins: CoinMarketSummary[],
  sortKey: string
): CoinMarketSummary[]
```

Behaviour:
- `name_asc`: sort by `coin.name` A→Z (locale-insensitive `.localeCompare`)
- `name_desc`: sort by `coin.name` Z→A
- `price_asc`: sort by `coin.current_price` ascending (nulls last)
- `price_desc`: sort by `coin.current_price` descending (nulls last)
- All other keys: return array unchanged (sorted by API already)

Called in `page.tsx` after `getCoinMarkets()` returns, before rendering.
