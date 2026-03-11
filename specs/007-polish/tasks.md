# Tasks: Polish & Cross-Cutting Concerns

**Feature**: 007-polish
**Depends on**: 003, 004, 005, 006
**Scope**: Rate limiting, responsive audit, WCAG 2.1 AA, error states, README, validation.

---

## Tasks

- [X] T001 [P] Add Upstash rate limiting — create `app/_lib/redis.ts` with sliding window (5 req/15 min per IP); apply in Auth.js `authorize` callback
- [X] T002 [P] Add 429 error state — detect null return from CoinGecko API; render `<ErrorMessage>` in `app/page.tsx` and `app/(protected)/favourites/page.tsx`
- [X] T003 [P] Keyboard navigation & WCAG 2.1 AA — `aria-label` on `<FavouriteToggle>`, `<PaginationControls>`, `<SearchInput>`
- [X] T004 [P] Add `db:migrate` and `db:studio` scripts to `package.json`
- [X] T005 [P] Update `README.md` — env vars setup, `npm run db:migrate` step, Neon/Upstash links
- [ ] T006 Add `SESSION_EXPIRED` redirect handling — detect expired JWT in `middleware.ts`; redirect to `/login?reason=expired`; show "Your session expired" banner in `app/(auth)/login/page.tsx`
- [ ] T007 Responsive audit — verify all pages/components at 375 px, 768 px, 1280 px; fix any overflow in `PaginationControls`, `CoinListItem`, `FavouritesList`
- [ ] T008 Run full `quickstart.md` validation — execute every acceptance scenario against running dev server; confirm no browser console errors
