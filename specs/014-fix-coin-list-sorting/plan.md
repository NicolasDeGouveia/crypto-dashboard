# Implementation Plan: Fix Coin List Column Sorting

**Branch**: `014-fix-coin-list-sorting` | **Date**: 2026-03-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-fix-coin-list-sorting/spec.md`

## Summary

The coin list column headers (Name, Market Cap, Price) do not sort the list correctly. Three root bugs are identified: (1) `SORT_OPTIONS` is missing `name_*` and `price_*` keys, causing the sort guard in `page.tsx` to always fall back to the default; (2) `SortableColumnHeader` has no toggle logic — a second click on an active column never inverts direction; (3) `id_asc`/`price_asc` are not valid CoinGecko `order` values — Name and Price must be sorted client-side.

The fix is entirely contained to three files (`constants.ts`, `utils.ts`, `SortableColumnHeader.tsx`) plus their test files, with a minor update to `page.tsx` for client-sort wiring.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode) / Node.js 20.9.0+
**Primary Dependencies**: Next.js App Router, React 18, Tailwind CSS
**Storage**: N/A — no DB changes
**Testing**: Vitest + React Testing Library
**Target Platform**: Web (Next.js SSR)
**Project Type**: Web application
**Performance Goals**: Sort completes in < 1ms (client-side on ≤ 50 items)
**Constraints**: No new dependencies; no additional API calls; CoinGecko 60s cache must be preserved
**Scale/Scope**: Fixed 5-coin list display; up to 50 items per page in the full 100-coin list

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Code Quality | PASS | Fix is surgical — 3 files changed, single responsibility maintained |
| II. Testing Standards | PASS | Unit tests for `sortCoins`, component tests for toggle logic required |
| III. UX Consistency | PASS | Direction indicator already exists; toggle fixes the broken interaction |
| IV. Performance | PASS | Client sort on ≤ 50 items is negligible; no extra API calls; 60s cache untouched |
| V. Simplicity | PASS | No new abstractions; no new dependencies; pure `.sort()` utility |

No violations. Complexity Tracking section not required.

## Project Structure

### Documentation (this feature)

```text
specs/014-fix-coin-list-sorting/
├── plan.md              # This file
├── research.md          # Root cause analysis & decisions
├── data-model.md        # Sort key taxonomy & prop contracts
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (files touched)

```text
app/
├── _lib/
│   ├── constants.ts                          # Add name_* and price_* to SORT_OPTIONS
│   └── utils.ts                              # Add sortCoins() pure function
├── components/
│   ├── SortableColumnHeader.tsx              # Fix props: defaultSortKey + toggleSortKey + toggle logic
│   └── __tests__/
│       └── SortableColumnHeader.test.tsx     # Extend: toggle href, direction indicator
├── _lib/__tests__/
│   └── utils.test.ts                         # Add sortCoins() unit tests
└── page.tsx                                  # Wire sortCoins(); update header sortKey props
```

**Structure Decision**: Single Next.js project. No new directories needed.

## Implementation Phases

### Phase 1 — Fix `SORT_OPTIONS` (constants.ts)

Add the four missing sort keys so the page guard no longer falls back to default:

```ts
// Add to SORT_OPTIONS in constants.ts
name_asc:  'Name A→Z',
name_desc: 'Name Z→A',
price_asc: 'Price ↑',
price_desc: 'Price ↓',
```

**Why first**: Unblocks all other changes. Without this fix, `page.tsx` silently ignores all Name/Price clicks.

---

### Phase 2 — Add `sortCoins()` utility (utils.ts)

Pure function that performs client-side sorting for keys the API does not support:

```ts
export function sortCoins(
  coins: CoinMarketSummary[],
  sortKey: string
): CoinMarketSummary[] {
  // name_asc / name_desc → localeCompare on coin.name
  // price_asc / price_desc → numeric sort on coin.current_price (nulls last)
  // all other keys → return unchanged (API-sorted)
}
```

No mutation of the original array (return a new sorted copy).

---

### Phase 3 — Fix `SortableColumnHeader` (SortableColumnHeader.tsx)

**Props change**:
```ts
// Before
type Props = { label: string; sortKey: string }

// After
type Props = { label: string; defaultSortKey: string; toggleSortKey: string }
```

**Toggle logic**:
```ts
const isActive = currentSort === defaultSortKey || currentSort === toggleSortKey
const nextSortKey = isActive && currentSort === defaultSortKey
  ? toggleSortKey
  : defaultSortKey
```

**Direction indicator**: derive from `currentSort` suffix (`_asc` → ↑, `_desc` → ↓).

---

### Phase 4 — Wire everything in `page.tsx`

1. Apply `sortCoins(coins, currentSort)` after `getCoinMarkets()` returns (before filtering).
2. Update each `SortableColumnHeader` with correct `defaultSortKey` / `toggleSortKey` pairs:

| Column | defaultSortKey | toggleSortKey |
|---|---|---|
| Name | `name_asc` | `name_desc` |
| Price | `price_desc` | `price_asc` |
| Market Cap | `market_cap_desc` | `market_cap_asc` |
| Volume | `volume_desc` | `volume_asc` |
| 24h Change | `price_change_percentage_24h_desc` | `price_change_percentage_24h_asc` |

---

### Phase 5 — Tests

**`utils.test.ts`** — add unit tests for `sortCoins()`:
- Name A→Z / Z→A correctness
- Price high→low / low→high correctness
- Null/undefined price values sort to bottom
- Non-client-sort keys return array unchanged

**`SortableColumnHeader.test.tsx`** — extend existing tests:
- Inactive column → link href uses `defaultSortKey`
- Active column (on `defaultSortKey`) → link href uses `toggleSortKey`
- Active column (on `toggleSortKey`) → link href uses `defaultSortKey`
- Direction indicator shows ↑ for `_asc` active, ↓ for `_desc` active

---

### Phase 6 — Polish & Verification

- Run `npm test` — all tests green
- Run `npm run lint` — no warnings
- Manual smoke test: click each column header twice, verify correct ordering and toggle
- Verify null-price edge case does not crash the page
