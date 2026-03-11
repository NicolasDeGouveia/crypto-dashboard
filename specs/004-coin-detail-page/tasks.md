# Tasks: Rich Coin Detail Page

**Feature**: 004-coin-detail-page
**Depends on**: 002
**Scope**: Enrich `/coins/[id]` with sparkline, description, ATH, supply, multi-period price changes.

---

## Tasks

- [X] T001 [P] Write unit tests for updated `getCoinDetails()` in `app/_lib/__tests__/api.test.ts`
- [X] T002 [P] Write component test for `<CoinDescription>` in `app/components/__tests__/CoinDescription.test.tsx`
- [X] T003 [P] Write component test for `<SparklineChart>` in `app/components/__tests__/SparklineChart.test.tsx`
- [X] T004 [P] Write component test for `<PriceChangeTable>` in `app/components/__tests__/PriceChangeTable.test.tsx`
- [X] T005 [P] Create `app/components/coin/CoinDescription.tsx`
- [X] T006 [P] Create `app/components/coin/SparklineChart.tsx`
- [X] T007 [P] Create `app/components/coin/PriceChangeTable.tsx`
- [X] T008 [P] Add `formatPercent()` and `formatDate()` to `app/_lib/utils.ts`
- [X] T009 Update `app/coins/[id]/page.tsx` — add logo, CoinDescription, SparklineChart, PriceChangeTable, StatCard rows for marketCap/volume/supply/ATH
