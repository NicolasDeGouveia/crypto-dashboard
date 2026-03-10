---
name: frontend-guidelines
description: Project-specific frontend conventions for the crypto-dashboard. Use when writing, reviewing, or refactoring any React component, page, form, or client-side hook in this codebase. Orchestrates the three Vercel skills and adds project-specific naming, RHF, debounce, and structure rules.
license: MIT
metadata:
  author: project
  version: "1.0.0"
---

# Frontend Guidelines — crypto-dashboard

Project-specific frontend conventions layered on top of the three Vercel skills. Apply whenever writing or reviewing components, pages, forms, or client-side hooks.

---

## Inherited Skills

This skill orchestrates and extends the following skills. Read them for the full rule sets they define:

| Skill | Scope |
|---|---|
| `vercel-react-best-practices` | 58 perf rules: waterfalls, bundle, Server Components, re-renders |
| `vercel-composition-patterns` | React 19 APIs, compound components, avoid boolean prop proliferation |
| `web-design-guidelines` | WCAG 2.1 AA accessibility, UI patterns, design consistency |

---

## Project-Specific Rules

### 1. Naming — no abbreviations

Every identifier must be self-descriptive. Single-letter or abbreviated names are forbidden.

| Forbidden | Correct |
|---|---|
| `n` (numeric param) | `amount` |
| `iso` | `isoDate` |
| `md` (market data alias) | `marketData` |
| `v` (toggle callback param) | `isExpanded` |
| `plain` (stripped text) | `plainText` |
| `percent` (prop/var) | `priceChangePercent24h` |
| `value` (loop variable for change %) | `changeValue` |
| `key`/`value` in query builder | `paramKey`/`paramValue` |

**searchParams destructuring**: always suffix with `Param` to avoid collision with the `useSearchParams` hook:
```ts
// ✅ correct
const { page: pageParam, sort: sortParam, q: queryParam } = await searchParams;
// ✅ correct (auth pages)
const { error: authError, callbackUrl } = await searchParams;

// ✗ wrong — collides with hook name and hides origin
const { page, sort, q } = await searchParams;
```

Source: refactoring.guru — *Obscure Variable Name* smell.

---

### 2. Forms — React Hook Form mandatory

All forms use `react-hook-form`. Manual `useState` + `onSubmit` validation is forbidden.

**Pattern:**
```ts
const { register, handleSubmit, formState, setError } = useForm<FormValues>();

const onSubmit = async (data: FormValues) => {
  const result = await myServerAction(data);
  if (result && !result.success) {
    setError("root.serverError", { message: ACTION_ERROR_MESSAGES[result.error] });
  }
};
```

**Rules:**
- Inline field validation via `register('field', { required, minLength, pattern })`
- `formState.errors.field.message` for inline field errors
- `formState.errors.root.serverError.message` for server errors
- `formState.isSubmitting` replaces manual `isPending` state and `useFormStatus`
- No separate `SubmitButton` component extracted just to use `useFormStatus` — use `isSubmitting` instead
- No `useActionState` + `useState<clientError>` combo

**Anti-pattern (Lazy Class):**
```tsx
// ✗ wrong — component extracted only to access useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}

// ✅ correct — use RHF isSubmitting
<button disabled={formState.isSubmitting}>
  {formState.isSubmitting ? "Submitting…" : "Submit"}
</button>
```

---

### 3. Debounce — `useDebouncedCallback` from `use-debounce`

`useEffect` + `setTimeout` + `useRef` for debouncing is forbidden.

**Pattern:**
```ts
import { useDebouncedCallback } from "use-debounce";

const handleChange = useDebouncedCallback((query: string) => {
  router.replace(`${pathname}?${qs}`);
}, DEBOUNCE_MS);

// In onChange handler:
onChange={(e) => {
  setValue(e.target.value);
  handleChange(e.target.value);
}}
```

Sources:
- react.dev — *You Might Not Need an Effect* (case: responding to a user event → put in the handler, not an Effect)
- refactoring.guru — *Temporary Field* (timerRef has no meaning outside the Effect)

---

### 4. Component structure — organised by domain

```
app/components/
  coin/           ← CoinListItem, CoinListSkeleton, CoinDescription, SparklineChart, PriceChangeTable
  auth/           ← LoginForm, RegisterForm
  ui/             ← StatCard, ErrorMessage
  FavouriteToggle.tsx    ← cross-cutting concern
  FavouritesList.tsx     ← depends on coin/ + FavouriteToggle
  PaginationControls.tsx ← navigation domain
  SearchInput.tsx        ← navigation domain
  SortableColumnHeader.tsx
  UserNav.tsx
  __tests__/      ← flat, import from subdirs
```

New components go in the appropriate domain subdirectory. Tests remain flat in `__tests__/`.

---

### 5. Server Components by default

Add `"use client"` only when the component requires React hooks or browser events. Server Components have no `"use client"` directive.

---

### 6. Types — use the most specific type available

```ts
// ✗ wrong — unknown forces redundant guards inside the function
function validateEmail(email: unknown): boolean { ... }

// ✅ correct — the caller already narrowed to string
function validateEmail(email: string): boolean { ... }
```

Only use `unknown` at system boundaries (user input parsing, external API responses).

---

## Anti-patterns (quick reference)

| Anti-pattern | Source | Correct alternative |
|---|---|---|
| `useEffect` to respond to a user event | react.dev/YMNNAAE | Move logic into the event handler |
| `useEffect` to derive state | react.dev/YMNNAAE | Compute during render |
| `useEffect` + `useState` to hide a calculation | react.dev/YMNNAAE | `useMemo` |
| `useEffect` + `useRef` for debounce | refactoring.guru/Temporary Field | `useDebouncedCallback` |
| `useState` + `onSubmit` for form validation | — | `react-hook-form` |
| Abbreviations in identifiers | refactoring.guru/Obscure Variable Name | Explicit names (see table above) |
| Component extracted only for one hook | refactoring.guru/Lazy Class | Inline with `isSubmitting` |

References:
- https://react.dev/learn/you-might-not-need-an-effect
- https://refactoring.guru/refactoring/smells

---

## Checklist (before submitting a PR)

- [ ] No abbreviated variable names
- [ ] All forms use RHF (`useForm`, `handleSubmit`, `formState`)
- [ ] Debounce implemented with `useDebouncedCallback`, not `useEffect`
- [ ] `searchParams` destructured with `*Param` suffix in Server Components
- [ ] New components placed in the correct domain subdirectory
- [ ] `"use client"` only where hooks or browser events are required
- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] `npx vitest run` passes all tests
