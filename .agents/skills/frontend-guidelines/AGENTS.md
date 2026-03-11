# Frontend Guidelines — crypto-dashboard

**Version 1.0.0**
Project conventions

> This document is for agents and LLMs to follow when maintaining, generating, or refactoring frontend code in this codebase.

---

## Overview

This skill defines the project-specific frontend conventions for the crypto-dashboard. It extends the three Vercel skills (`vercel-react-best-practices`, `vercel-composition-patterns`, `web-design-guidelines`) with rules specific to this codebase.

**When to apply:** Writing or reviewing any React component, Next.js page, form, or client-side hook.

---

## Rule 1 — Naming: no abbreviations

Every identifier must be self-descriptive. Single-letter or abbreviated names are forbidden.

**Mapping of forbidden → correct names:**

| Forbidden | Correct | Context |
|---|---|---|
| `n` | `amount` | Numeric params in formatMarketCap, formatVolume, formatSupply |
| `iso` | `isoDate` | Date string param in formatDate |
| `md` | `marketData` | market_data alias in coin detail page |
| `v` | `isExpanded` | Toggle callback param in CoinDescription |
| `plain` | `plainText` | HTML-stripped text in CoinDescription |
| `percent` | `priceChangePercent24h` | 24h change prop in CoinListItem |
| `value` | `changeValue` | Loop variable in PriceChangeTable |
| `key`/`value` | `paramKey`/`paramValue` | Params in createQueryString |

**searchParams destructuring — always suffix with `Param`:**

```ts
// ✅ Server Component pages
const { page: pageParam, sort: sortParam, q: queryParam } = await searchParams;
const { error: authError, callbackUrl } = await searchParams;
```

Rationale: avoids shadowing `useSearchParams` hook and makes the data origin explicit.

Source: refactoring.guru — Obscure Variable Name

---

## Rule 2 — Forms: React Hook Form mandatory

Package: `react-hook-form` (installed).

**Required pattern:**

```tsx
"use client";
import { useForm } from "react-hook-form";

type FormValues = { email: string; password: string };

export default function MyForm() {
  const { register, handleSubmit, formState, setError } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);
    const result = await myServerAction(formData);
    if (result && !result.success) {
      setError("root.serverError", { message: ACTION_ERROR_MESSAGES[result.error] });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: "Required", pattern: { value: /.../, message: "Invalid email" } })} />
      {formState.errors.email && <p>{formState.errors.email.message}</p>}

      <input {...register("password", { minLength: { value: 8, message: "Min 8 chars" } })} />
      {formState.errors.password && <p>{formState.errors.password.message}</p>}

      {formState.errors.root?.serverError && (
        <p>{formState.errors.root.serverError.message}</p>
      )}

      <button disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
```

**Forbidden patterns:**
- `useState` + `onSubmit` manual validation
- `useActionState` + `useState<clientError>` combo
- `useFormStatus` / separate `SubmitButton` component — use `formState.isSubmitting`

Source: refactoring.guru — Lazy Class (component extracted only for one hook without reuse)

---

## Rule 3 — Debounce: useDebouncedCallback

Package: `use-debounce` (installed).

**Correct:**
```tsx
import { useDebouncedCallback } from "use-debounce";

const handleChange = useDebouncedCallback((query: string) => {
  router.replace(`${pathname}?${qs}`);
}, 350);

<input onChange={(e) => { setValue(e.target.value); handleChange(e.target.value); }} />
```

**Forbidden:**
```tsx
// ✗ — useEffect fires after every render, masking intent
const timerRef = useRef(null);
useEffect(() => {
  timerRef.current = setTimeout(() => router.replace(...), 350);
  return () => clearTimeout(timerRef.current);
}, [value]);
```

Sources:
- react.dev/learn/you-might-not-need-an-effect — "You Might Not Need an Effect" case: responding to user events
- refactoring.guru — Temporary Field: `timerRef` has no meaning outside the Effect

---

## Rule 4 — Component structure by domain

New components must be placed in the correct subdirectory:

```
app/components/
  coin/           — CoinListItem, CoinListSkeleton, CoinDescription, SparklineChart, PriceChangeTable
  auth/           — LoginForm, RegisterForm
  ui/             — StatCard, ErrorMessage
  (root)          — FavouriteToggle, FavouritesList, PaginationControls, SearchInput, SortableColumnHeader, UserNav
  __tests__/      — flat, test files import from subdirs (e.g. '../coin/CoinListItem')
```

---

## Rule 5 — Server Components by default

No `"use client"` unless the component uses React hooks or browser events. Server Components have better performance and reduce bundle size.

---

## Rule 6 — Types: most specific type available

```ts
// ✗ — forces redundant typeof guards inside the function
function validateEmail(email: unknown): boolean

// ✅ — caller already narrowed to string
function validateEmail(email: string): boolean
```

Only use `unknown` at system boundaries (raw user input, external API responses before parsing).

---

## Anti-pattern Quick Reference

| Anti-pattern | Category | Fix |
|---|---|---|
| `useEffect` for user event response | Code Smell (react.dev) | Move to event handler |
| `useEffect` to derive state | Code Smell (react.dev) | Compute during render |
| `useEffect` + `useRef` for debounce | Temporary Field | `useDebouncedCallback` |
| `useState` + manual `onSubmit` validation | Code Smell | `react-hook-form` |
| Separate `SubmitButton` for `useFormStatus` | Lazy Class | `formState.isSubmitting` |
| Abbreviated variable names | Obscure Variable Name | Explicit names |
| `useActionState` + `useState<error>` combo | Code Smell | RHF `setError('root.serverError')` |

---

## Verification Commands

```bash
npx tsc --noEmit     # 0 TypeScript errors
npx vitest run       # all tests pass
```
