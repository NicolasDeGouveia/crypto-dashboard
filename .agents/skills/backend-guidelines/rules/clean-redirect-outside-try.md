# clean-redirect-outside-try

**Category**: Clean Code
**Impact**: MEDIUM (correctness bug if violated)

## Rule

`redirect()` and `notFound()` from `next/navigation` throw a special Next.js exception internally.
They MUST be called outside of try/catch blocks.

## Why

`redirect()` works by throwing a `NEXT_REDIRECT` error class. If this is inside a try/catch, the
catch block intercepts it and the redirect never fires. This is a silent correctness bug — the 
action appears to succeed but the user is never redirected.

## Incorrect

```typescript
export async function register(formData: FormData) {
  try {
    await db.insert(users).values({ ... })
    await signIn('credentials', { email, password, redirectTo: '/' })
    // ↑ signIn throws NEXT_REDIRECT — caught below — user never redirected
  } catch (err) {
    return { error: 'Registration failed' }
  }
}
```

## Correct

```typescript
export async function register(formData: FormData): Promise<ActionResult> {
  // DB operation inside try/catch
  try {
    await db.insert(users).values({ id: crypto.randomUUID(), email, password: hash })
  } catch {
    return { success: false, error: 'EMAIL_IN_USE' }
  }

  // signIn OUTSIDE try/catch — NEXT_REDIRECT propagates correctly
  await signIn('credentials', { email, password, redirectTo: '/' })
}
```

## Same Rule for notFound()

```typescript
// CORRECT
const coinData = await getCoinDetails(id)
if (!coinData) notFound()  // Propagates to not-found.tsx

// ANTI-PATTERN
try {
  const coinData = await getCoinDetails(id)
  if (!coinData) notFound()  // Caught by catch — 404 never shown
} catch (err) { ... }
```
