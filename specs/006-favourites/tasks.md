# Tasks: Manage Favourite Coins

**Feature**: 006-favourites
**Depends on**: 003, 005
**Scope**: Toggle favourites from list/detail pages, `/favourites` page with live prices.

---

## Tasks

- [X] T001 [P] Write unit tests for `addFavourite()` in `app/_actions/__tests__/favourites.test.ts`
- [X] T002 [P] Write unit tests for `removeFavourite()` in `app/_actions/__tests__/favourites.test.ts`
- [X] T003 [P] Write unit tests for `GET /api/favourites/prices` in `app/api/favourites/__tests__/route.test.ts`
- [X] T004 [P] Write component test for `<FavouriteToggle>` in `app/components/__tests__/FavouriteToggle.test.tsx`
- [X] T005 [P] Write component test for `<FavouritesList>` in `app/components/__tests__/FavouritesList.test.tsx`
- [X] T006 [P] Create `app/_actions/favourites.ts` — `addFavourite()` and `removeFavourite()` Server Actions
- [X] T007 Create `app/api/favourites/prices/route.ts` — GET Route Handler
- [X] T008 [P] Create `app/components/FavouriteToggle.tsx`
- [X] T009 [P] Create `app/components/FavouritesList.tsx`
- [X] T010 Update `app/page.tsx` — pass isFavourited/isAuthenticated to CoinListItem, render FavouriteToggle
- [X] T011 Update `app/coins/[id]/page.tsx` — add FavouriteToggle near coin title
- [X] T012 Create `app/(protected)/favourites/page.tsx`
- [X] T013 [P] Create `app/(protected)/favourites/loading.tsx`
- [X] T014 Update `app/components/UserNav.tsx` — add link to `/favourites`
