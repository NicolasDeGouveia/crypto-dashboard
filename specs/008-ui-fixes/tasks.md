# Tasks: UI Fixes — Mobile Nav & Sparkline

**Feature**: 008-ui-fixes
**Depends on**: 007
**Scope**: Two UI bugs identified during quickstart validation.

---

## Bug 1 — Mobile navbar: logo not tappable, layout broken on small screens

**Observed**: On mobile the navbar is cramped — "Crypto Dashboard" logo has no link back to `/`, items overflow.
**Expected**: Logo links to `/`; nav items wrap or collapse cleanly at 375 px.

- [ ] T001 Read `app/layout.tsx` and `app/components/UserNav.tsx` to understand current nav structure
- [ ] T002 Add `<Link href="/">` wrapper around the "Crypto Dashboard" logo/wordmark in the header
- [ ] T003 Fix mobile nav layout — ensure nav items don't overflow at 375 px (use `flex-wrap` or reduce padding/font size at `sm:`)
- [ ] T004 Write component test for nav logo link in `app/components/__tests__/UserNav.test.tsx` — assert `<a href="/">` renders with the brand name

---

## Bug 2 — Sparkline chart: unreadable, no price axis or labels

**Observed**: Sparkline renders but is too small, no Y-axis labels, no price context — user cannot understand the values.
**Expected**: Chart shows min/max price labels on Y-axis, a "7d" period label, and is large enough to be readable on mobile.

- [ ] T005 Read `app/components/coin/SparklineChart.tsx` to understand current SVG implementation
- [ ] T006 Increase sparkline viewBox height and render size — minimum 80px tall, full container width
- [ ] T007 Add min/max price labels on Y-axis (left side) — formatted with `formatPrice()` from utils
- [ ] T008 Add "7 days" period label below the chart
- [ ] T009 Add a horizontal baseline (zero-line or range indicator) to give visual context
- [ ] T010 Write component test for updated `<SparklineChart>` — assert min/max labels render with correct values, assert period label renders
