# Tasks: Fix Coin List Column Sorting

**Input**: Design documents from `/specs/014-fix-coin-list-sorting/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Add missing sort keys and the client-sort utility — both required before any column header can work correctly.

**⚠️ CRITICAL**: Phase 2+ cannot begin until this phase is complete.

- [X] T001 Add `name_asc`, `name_desc`, `price_asc`, `price_desc` entries to `SORT_OPTIONS` in `app/_lib/constants.ts`
- [X] T002 Add `sortCoins(coins, sortKey)` pure utility function in `app/_lib/utils.ts` — sorts by name (localeCompare) or price (numeric, nulls last); returns unchanged array for API-handled keys
- [X] T003 [P] Add unit tests for `sortCoins()` in `app/_lib/__tests__/utils.test.ts` — cover name_asc, name_desc, price_asc, price_desc, null prices to bottom, passthrough for market_cap_desc

**Checkpoint**: `sortCoins()` is tested and green. `SORT_OPTIONS` contains all 10 valid keys.

---

## Phase 2: User Story 1 — Sort by Name (Priority: P1) 🎯 MVP

**Goal**: Clicking the "Name" column header sorts the list A→Z on first click and Z→A on second click.

**Independent Test**: Open `/`, click "Name" header → list reorders A→Z. Click again → Z→A.

- [X] T004 [US1] Refactor `SortableColumnHeader` props from `sortKey` to `defaultSortKey` + `toggleSortKey` in `app/components/SortableColumnHeader.tsx`
- [X] T005 [US1] Implement toggle logic in `SortableColumnHeader`: when active on `defaultSortKey` link to `toggleSortKey`, when active on `toggleSortKey` link to `defaultSortKey`, when inactive link to `defaultSortKey` — in `app/components/SortableColumnHeader.tsx`
- [X] T006 [US1] Fix direction indicator in `SortableColumnHeader` to derive arrow from `currentSort` suffix (`_asc` → ↑, `_desc` → ↓) — in `app/components/SortableColumnHeader.tsx`
- [X] T007 [US1] Update Name column header in `app/page.tsx`: `defaultSortKey="name_asc"` `toggleSortKey="name_desc"`
- [X] T008 [US1] Wire `sortCoins(coins, currentSort)` call in `app/page.tsx` after `getCoinMarkets()` returns, before the search filter
- [X] T009 [P] [US1] Update `SortableColumnHeader` component tests in `app/components/__tests__/SortableColumnHeader.test.tsx` — add: inactive uses defaultSortKey, active on default links to toggle, active on toggle links back to default, ↑ indicator for _asc, ↓ indicator for _desc

**Checkpoint**: Name column sorts correctly in both directions with visible arrow indicator.

---

## Phase 3: User Story 2 — Sort by Market Cap (Priority: P2)

**Goal**: Clicking "Market Cap" header sorts highest→lowest on first click, lowest→highest on second.

**Independent Test**: Click "Market Cap" → highest market cap coin appears first. Click again → lowest first.

- [ ] T010 [US2] Update Market Cap column header in `app/page.tsx`: `defaultSortKey="market_cap_desc"` `toggleSortKey="market_cap_asc"`

**Checkpoint**: Market Cap column toggles correctly. API handles the ordering (no client sort needed).

---

## Phase 4: User Story 3 — Sort by Price (Priority: P3)

**Goal**: Clicking "Price" header sorts highest→lowest on first click, lowest→highest on second.

**Independent Test**: Click "Price" → highest price coin appears first. Click again → lowest first.

- [ ] T011 [US3] Update Price column header in `app/page.tsx`: `defaultSortKey="price_desc"` `toggleSortKey="price_asc"`

**Checkpoint**: Price column toggles correctly using the client-side `sortCoins()` utility.

---

## Phase 5: User Story 4 — Visual Sort Direction Indicator (Priority: P4)

**Goal**: Active column displays ↑ or ↓ matching actual sort direction; switching columns moves the indicator.

**Independent Test**: Click any header → indicator appears on that header. Click another header → indicator moves.

- [ ] T012 [US4] Update Volume column header in `app/page.tsx`: `defaultSortKey="volume_desc"` `toggleSortKey="volume_asc"`
- [ ] T013 [US4] Update 24h Change column header in `app/page.tsx`: `defaultSortKey="price_change_percentage_24h_desc"` `toggleSortKey="price_change_percentage_24h_asc"`

**Checkpoint**: All five column headers show correct indicators and none conflict.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T014 [P] Run `npm test` — confirm all tests pass including updated SortableColumnHeader and utils suites
- [ ] T015 [P] Run `npm run lint` — confirm no TypeScript or ESLint errors
- [ ] T016 Manual smoke test: click each of the 5 column headers twice and verify correct ordering and indicator toggle in browser

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: No dependencies — start immediately
- **Phase 2 (US1)**: Depends on Phase 1 completion — `sortCoins()` and updated `SORT_OPTIONS` must exist
- **Phase 3 (US2)**: Depends on Phase 2 — `SortableColumnHeader` new props shape must be in place
- **Phase 4 (US3)**: Depends on Phase 2 — same reason; also needs `sortCoins()` from Phase 1
- **Phase 5 (US4)**: Depends on Phase 2 — remaining columns reuse same refactored component
- **Phase 6 (Polish)**: Depends on all implementation phases

### User Story Dependencies

- **US1 (P1)**: Requires Phase 1 complete. Core refactor — all other US depend on it.
- **US2 (P2)**: Requires US1 complete (component shape change). Single line in page.tsx.
- **US3 (P3)**: Requires US1 complete. Single line in page.tsx.
- **US4 (P4)**: Requires US1 complete. Two lines in page.tsx.

### Parallel Opportunities

- T002 and T003 can run in parallel (utils.ts + its test file)
- T001 is independent from T002/T003
- T009 (test update) can run in parallel with T004–T008 (different test file)
- T010, T011, T012, T013 are all single-line page.tsx changes — sequential to avoid conflicts
- T014 and T015 can run in parallel (different commands)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 — foundation (T001, T002, T003)
2. Complete Phase 2 — Name sort working (T004–T009)
3. **STOP and VALIDATE**: Name column sorts A→Z / Z→A correctly
4. Proceed to remaining stories

### Incremental Delivery

1. Phase 1 → sort infrastructure ready
2. Phase 2 → Name sort fixed (MVP, most visible bug)
3. Phase 3 → Market Cap sort fixed
4. Phase 4 → Price sort fixed
5. Phase 5 → Volume + 24h Change headers updated
6. Phase 6 → Clean build + smoke test

---

## Notes

- T001 is the single most impactful fix — without it, the page guard silently rejects all Name/Price sort params
- `sortCoins()` must NOT mutate the input array — return a sorted copy
- `SortableColumnHeader` prop rename is a breaking change for all 5 call sites in `page.tsx` — update all in T007/T010/T011/T012/T013
- No new dependencies introduced; no DB or API changes
