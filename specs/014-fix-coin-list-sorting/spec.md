# Feature Specification: Fix Coin List Column Sorting

**Feature Branch**: `014-fix-coin-list-sorting`
**Created**: 2026-03-16
**Status**: Draft
**Input**: User description: "The coin list sorting filters are broken. Clicking on Name, Market Cap, or Price column headers does not reorder the list correctly. The feature needs a proper fix to handle sorting correctly."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sort by Name (Priority: P1)

A user browsing the coin list wants to sort coins alphabetically by name to quickly locate a specific coin. They click the "Name" column header and expect the list to reorder A→Z on the first click and Z→A on the second.

**Why this priority**: Alphabetical sorting is the most basic orientation mechanism. It is the entry point to all other sorting behaviour and the fastest path to find a specific coin.

**Independent Test**: Open the coin list, click "Name" header — verify coins sort A→Z. Click again — verify Z→A.

**Acceptance Scenarios**:

1. **Given** the coin list is displayed in its default order, **When** the user clicks the "Name" header once, **Then** the list is reordered alphabetically A→Z.
2. **Given** the list is sorted A→Z, **When** the user clicks the "Name" header again, **Then** the list reverses to Z→A.
3. **Given** the list is sorted by Name, **When** the user refreshes the page, **Then** the default order is restored (sorting is not persisted across sessions).

---

### User Story 2 - Sort by Market Cap (Priority: P2)

A user wants to compare coins by financial weight. They click the "Market Cap" header and expect the list to rank coins from the largest to the smallest market capitalisation on the first click, and reverse on the second.

**Why this priority**: Market cap is the most common ranking signal in crypto dashboards and is expected to work correctly by default.

**Independent Test**: Open the coin list, click "Market Cap" header — verify coins order highest→lowest by market cap value. Click again — verify lowest→highest.

**Acceptance Scenarios**:

1. **Given** the coin list is displayed, **When** the user clicks the "Market Cap" header once, **Then** coins are ordered from highest to lowest market cap.
2. **Given** the list is sorted highest→lowest, **When** the user clicks "Market Cap" again, **Then** the order reverses to lowest→highest.
3. **Given** two coins have the same market cap value, **When** sorted by Market Cap, **Then** their relative order is stable (consistent, not random).

---

### User Story 3 - Sort by Price (Priority: P3)

A user wants to rank coins by current price. They click the "Price" header and expect the list to order coins from the most to the least expensive, with toggle on second click.

**Why this priority**: Price sorting is a common secondary signal; it is less critical than market cap but still part of the core sort feature set.

**Independent Test**: Open the coin list, click "Price" header — verify coins order highest→lowest by price. Click again — verify lowest→highest.

**Acceptance Scenarios**:

1. **Given** the coin list is displayed, **When** the user clicks the "Price" header once, **Then** coins are ordered from highest to lowest price.
2. **Given** the list is sorted highest→lowest, **When** the user clicks "Price" again, **Then** the order reverses to lowest→highest.

---

### User Story 4 - Visual Sort Direction Indicator (Priority: P4)

A user needs to know which column is currently active and in which direction the list is sorted. The active header should display a clear visual indicator (e.g., an arrow or chevron) showing ascending or descending order.

**Why this priority**: Without a direction indicator, users cannot tell the current sort state, which degrades usability.

**Independent Test**: Click any sortable header — verify an indicator appears on that header showing the current direction. Click again — verify the indicator flips.

**Acceptance Scenarios**:

1. **Given** no sort is active, **When** the user clicks a column header, **Then** the header displays a visual indicator for the active sort direction.
2. **Given** column A is the active sort, **When** the user clicks column B, **Then** the indicator moves to column B and disappears from column A.

---

### Edge Cases

- What happens when all 5 coins have unique values for the sorted column? — All coins reorder unambiguously.
- What happens when a coin's market cap or price data is temporarily unavailable (null/undefined)? — Coins with missing values should sort to the bottom regardless of sort direction.
- What happens if the user clicks the same header more than twice? — The sort toggles continuously between ascending and descending; it does not reset to default.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The coin list MUST support sorting by Name, Market Cap, and Price columns.
- **FR-002**: Clicking a sortable column header MUST reorder the entire list according to that column's values.
- **FR-003**: The first click on a column MUST sort descending for numeric columns (Market Cap, Price) and ascending (A→Z) for the Name column.
- **FR-004**: A second click on the same active column MUST reverse the sort direction.
- **FR-005**: Clicking a different column header MUST switch the active sort to that column, resetting to its default direction.
- **FR-006**: Each sortable column header MUST display a visual indicator showing whether it is active and in which direction it is sorted.
- **FR-007**: Coins with missing or null values for the sorted column MUST appear at the bottom of the list regardless of sort direction.
- **FR-008**: Sort state MUST NOT persist across page reloads — the list returns to its default order on reload.

### Assumptions

- The fixed coin list contains exactly 5 coins (Bitcoin, Ethereum, Dogecoin, Cardano, Solana); sort logic does not need to scale beyond this.
- Default display order (no active sort) is determined by the existing API/data fetch order (typically by market cap rank).
- Sorting is performed client-side on already-fetched data — no additional API calls are required.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Clicking any sortable column header produces a correctly ordered list within 100ms (instant, no perceptible delay).
- **SC-002**: 100% of the 5 coins are reordered correctly for all three sortable columns in both directions (verified by automated tests).
- **SC-003**: The active sort direction indicator is visible and accurate for every sort state — 0 cases where indicator and actual order disagree.
- **SC-004**: Coins with null/missing values consistently appear at the bottom across all sort columns and directions.
