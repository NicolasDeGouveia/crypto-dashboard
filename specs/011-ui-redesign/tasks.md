# Tasks: UI Redesign — Light + Dark Mode

**Feature**: 011-ui-redesign
**Depends on**: 010
**Scope**: Light mode with more character (Linear/Vercel/Raycast inspired) + full dark mode.

Design direction:
- Light: zinc-50 background (warm), indigo accent, tabular-nums on prices, backdrop-blur header
- Dark: zinc-950 background, zinc-900 cards, indigo-400 accent
- Typography: Geist (already loaded), fix globals.css font-family override

---

## Tasks

- [X] T001 Fix `globals.css` — remove Arial override, add CSS vars, `color-scheme: light dark`, `tabular-nums` utility
- [X] T002 Update `app/layout.tsx` — dark mode body/html classes, header backdrop-blur, `suppressHydrationWarning`
- [X] T003 Update `app/components/UserNav.tsx` — dark mode nav links and logout button
- [X] T004 Update `app/components/coin/CoinListItem.tsx` — zinc palette, dark mode, tabular-nums on prices, hover gradient
- [X] T005 Update `app/components/ui/StatCard.tsx` — zinc palette, dark mode, tabular-nums on value
- [X] T006 Update `app/components/SortableColumnHeader.tsx` — indigo accent on active column, dark mode
- [X] T007 Update `app/components/PaginationControls.tsx` — dark mode, indigo accent on current page
- [X] T008 Update `app/components/FavouriteToggle.tsx` — dark mode star icon
- [X] T009 Update auth pages `app/(auth)/login/page.tsx` and `app/(auth)/register/page.tsx` — dark mode form wrapper
- [X] T010 Verify full test suite still passes — `npm test`
