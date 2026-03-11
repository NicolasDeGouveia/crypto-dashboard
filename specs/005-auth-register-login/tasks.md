# Tasks: User Registration & Login

**Feature**: 005-auth-register-login
**Depends on**: 002
**Scope**: Email + password auth via Auth.js v5 credentials provider. Session persists 24h.

---

## Tasks

- [X] T001 [P] Write unit tests for `register()` Server Action in `app/_actions/__tests__/auth.test.ts`
- [X] T002 [P] Write unit tests for Auth.js `authorize` callback in `app/_actions/__tests__/auth.test.ts`
- [X] T003 [P] Write component test for `<LoginForm>` in `app/components/__tests__/LoginForm.test.tsx`
- [X] T004 [P] Write component test for `<RegisterForm>` in `app/components/__tests__/RegisterForm.test.tsx`
- [X] T005 [P] Write component test for `<UserNav>` in `app/components/__tests__/UserNav.test.tsx`
- [X] T006 [P] Create `app/_actions/auth.ts` — `register()` Server Action with validation, argon2 hash, signIn
- [X] T007 [P] Create `app/components/auth/LoginForm.tsx`
- [X] T008 [P] Create `app/components/auth/RegisterForm.tsx`
- [X] T009 [P] Create `app/components/UserNav.tsx`
- [X] T010 [P] Create `app/(auth)/login/page.tsx`
- [X] T011 [P] Create `app/(auth)/register/page.tsx`
- [X] T012 Update `app/layout.tsx` — render `<UserNav />` in header
