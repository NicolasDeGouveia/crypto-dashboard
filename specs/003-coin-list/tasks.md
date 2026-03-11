# Tasks: Browse the Full Coin List

**Feature**: 003-coin-list
**Depends on**: 002
**Scope**: Paginated, searchable, sortable top-100 coin list driven by URL searchParams.

---

## Tasks

- [X] T001 [P] Write unit tests for `getCoinMarkets()` in `app/_lib/__tests__/api.test.ts`
- [X] T002 [P] Write unit tests for `formatMarketCap()`, `formatVolume()`, `formatSupply()` in `app/_lib/__tests__/utils.test.ts`
- [X] T003 [P] Write component test for `<PaginationControls>` in `app/components/__tests__/PaginationControls.test.tsx`
- [X] T004 [P] Write component test for `<SearchInput>` in `app/components/__tests__/SearchInput.test.tsx`
- [X] T005 [P] Write component test for `<SortableColumnHeader>` in `app/components/__tests__/SortableColumnHeader.test.tsx`
- [X] T006 [P] Write component test for `<CoinListSkeleton>` in `app/components/__tests__/CoinListSkeleton.test.tsx`
- [X] T007 [P] Write component test for `<CoinListItem>` in `app/components/__tests__/CoinListItem.test.tsx`
- [X] T008 [P] Add `formatMarketCap()`, `formatVolume()`, `formatSupply()` to `app/_lib/utils.ts`
- [X] T009 [P] Create `app/components/CoinListSkeleton.tsx`
- [X] T010 [P] Create `app/components/PaginationControls.tsx`
- [X] T011 [P] Create `app/components/SearchInput.tsx`
- [X] T012 [P] Create `app/components/SortableColumnHeader.tsx`
- [X] T013 Update `app/components/coin/CoinListItem.tsx` — add image, marketCap, volume props
- [X] T014 Update `app/page.tsx` — parse searchParams, call getCoinMarkets(), render list with search/sort/pagination
- [X] T015 Update `app/loading.tsx` — replace skeleton with `<CoinListSkeleton />`
