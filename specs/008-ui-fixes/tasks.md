# Tasks: UI Fixes — Mobile Nav & Sparkline

**Feature**: 008-ui-fixes
**Depends on**: 007
**Scope**: Two UI bugs identified during quickstart validation.

---

## Bug 1 — Mobile navbar: logo not tappable, layout broken on small screens

**Observed**: On mobile the navbar is cramped — "Crypto Dashboard" logo has no link back to `/`, items overflow.
**Expected**: Logo links to `/`; nav items wrap or collapse cleanly at 375 px.

- [X] T001 Read `app/layout.tsx` and `app/components/UserNav.tsx` to understand current nav structure
- [X] T002 Add `<Link href="/">` wrapper around the "Crypto Dashboard" logo/wordmark in the header
- [X] T003 Fix mobile nav layout — hide email on mobile (`hidden sm:block`), reduce gap to `gap-2 sm:gap-4`
- [X] T004 Write component test for nav — assert My Favourites link renders with `href="/favourites"` in `app/components/__tests__/UserNav.test.tsx`

---

## Bug 2 — Sparkline chart: unreadable, no price axis or labels

**Observed**: Sparkline renders but is too small, no Y-axis labels, no price context — user cannot understand the values.
**Expected**: Chart shows min/max price labels on Y-axis, a "7d" period label, and is large enough to be readable on mobile.

- [X] T005 Read `app/components/coin/SparklineChart.tsx` to understand current SVG implementation
- [X] T006 Increase sparkline viewBox height to 80px tall, full container width (`width="100%"`)
- [X] T007 Add min/max price labels on Y-axis (left side) — formatted with `formatPrice()` from utils
- [X] T008 Add "7-day price (USD)" period label below the chart
- [X] T009 Add horizontal grid lines at top/bottom to give visual context
- [X] T010 Update `SparklineChart` tests — assert min/max labels and period label render
