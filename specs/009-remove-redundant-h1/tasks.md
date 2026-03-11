# Tasks: Remove Redundant H1 on Home

**Feature**: 009-remove-redundant-h1
**Depends on**: 008
**Scope**: The H1 "Crypto Dashboard" in app/page.tsx duplicates the navbar logo. Remove it cleanly.

---

## Tasks

- [X] T001 Remove the `Header()` component and its usage from `app/page.tsx`
- [X] T002 Verify build passes — navbar `<header>` provides brand context
- [X] T003 No tests reference the H1 text — no test updates needed
