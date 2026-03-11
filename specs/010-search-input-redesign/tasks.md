# Tasks: Search Input Redesign

**Feature**: 010-search-input-redesign
**Depends on**: 009
**Scope**: Modern search input — icon, pill shape, accent focus ring, semantic fixes.

---

## Tasks

- [X] T001 Remove redundant `role="textbox"` from `<input>` in `app/components/SearchInput.tsx`
- [X] T002 Replace `focus:outline-none` with proper focus ring using `focus-visible:ring-2`
- [X] T003 Add magnifying glass SVG icon inside the input (left side), adjust padding accordingly
- [X] T004 Switch to pill shape (`rounded-full`) with subtle background tint and stronger focus state
- [X] T005 Add `autoComplete="off"` and `spellCheck={false}` to the input
- [X] T006 Update `SearchInput` tests to reflect new DOM structure (icon present, no role attr)
