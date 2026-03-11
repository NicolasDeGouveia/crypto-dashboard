# Tasks: Dark Glassmorphism Redesign

**Feature**: 013-dark-glassmorphism
**Depends on**: 011, 012
**Scope**: Dark-only redesign of the entire UI inspired by Coinova — deep violet background, glassmorphism cards, fuchsia/violet glow effects, gradient accents. Remove light mode entirely.

Design tokens:
- Background: `#0a0a1a` (near-black violet)
- Surface (cards): `bg-white/5` + `backdrop-blur-md` + `border border-white/10`
- Accent primary: violet-500 / fuchsia-500 gradient
- Accent hover glow: `shadow-[0_0_24px_rgba(139,92,246,0.35)]` (violet)
- Text primary: `zinc-100`
- Text secondary: `zinc-400`
- Price up: `emerald-400` on `bg-emerald-500/10`
- Price down: `red-400` on `bg-red-500/10`

---

## Tasks

- [X] T001 Update `globals.css` — set `bg-[#0a0a1a]` as body default, remove all light mode variants, add glass utility classes (`.glass`, `.glass-hover`, `.glow-violet`, `.glow-fuchsia`)
- [X] T002 Update `app/layout.tsx` — dark violet gradient background on `<html>`, glass header, remove `suppressHydrationWarning` light/dark split, update body classes
- [X] T003 Update `UserNav.tsx` — glass pill nav, fuchsia gradient "Sign up" button with glow, ghost "Log out" button
- [X] T004 Update `CoinListItem.tsx` — glass card, violet glow on hover, fuchsia/red percent badges with dark bg, tabular-nums preserved
- [X] T005 Update `StatCard.tsx` — glass card, glow on valueColor variants (emerald glow for success, red glow for danger)
- [X] T006 Update `SortableColumnHeader.tsx` — fuchsia accent on active column
- [X] T007 Update `PaginationControls.tsx` — glass buttons, fuchsia active page
- [X] T008 Update `FavouriteToggle.tsx` — fuchsia star on favourited, glass hover state
- [X] T009 Update `SearchInput.tsx` — glass input, violet focus ring glow
- [X] T010 Update `SparklineChart.tsx` — fuchsia line for up, red for down; subtle gradient fill below line; zinc-600 grid lines
- [X] T011 Update `CoinChart.tsx` — glass card wrapper, fuchsia active period pill with glow
- [X] T012 Update auth pages `login/page.tsx` + `register/page.tsx` — glass card centered on radial violet gradient background
- [X] T013 Update `app/coins/[id]/page.tsx` — glass ATH card, zinc/violet divider, dark text throughout
- [X] T014 Update `app/(protected)/favourites/page.tsx` — glass empty state, dark headings
- [X] T015 Update `app/page.tsx` — remove any remaining light mode classes
- [X] T016 Verify full test suite passes — `npm test`
