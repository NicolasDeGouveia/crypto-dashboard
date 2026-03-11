# err-discriminated-union

**Category**: Error Handling
**Impact**: MEDIUM

## Rule

All Server Actions return `ActionResult<T>`. Define all error codes as a union string type in `_lib/types.ts`.

## Why

1. Errors are serialisable across the server/client boundary (unlike thrown exceptions)
2. TypeScript narrows both branches — the compiler tells you when you forget to handle an error case
3. UI components map error codes to user-facing messages in one place (`ACTION_ERROR_MESSAGES`)
4. Consistent shape means `useActionState` always receives the same object structure

## Type Definition

```typescript
// app/_lib/types.ts
export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: ActionErrorCode }

export type ActionErrorCode =
  | 'UNAUTHENTICATED'
  | 'INVALID_COIN_ID'
  | 'DB_ERROR'
  | 'RATE_LIMITED'
  | 'INVALID_EMAIL'
  | 'PASSWORD_TOO_SHORT'
  | 'EMAIL_IN_USE'

export const ACTION_ERROR_MESSAGES: Record<ActionErrorCode, string> = {
  UNAUTHENTICATED: 'You must be logged in.',
  INVALID_COIN_ID: 'Invalid coin.',
  DB_ERROR: 'Something went wrong. Please try again.',
  RATE_LIMITED: 'Too many attempts. Try again in 15 minutes.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.',
  EMAIL_IN_USE: 'An account with this email already exists.',
}
```

## Incorrect

```typescript
export async function addFavourite(coinId: string) {
  if (!session) throw new Error('Not authenticated')  // Client receives opaque error
  await db.insert(...)  // Throws on DB error — unhandled on client
}
```

## Correct

```typescript
export async function addFavourite(coinId: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'UNAUTHENTICATED' }
  if (!validateCoinId(coinId)) return { success: false, error: 'INVALID_COIN_ID' }

  try {
    await db.insert(favourites).values({ userId: session.user.id, coinId })
  } catch (err) {
    console.error('[addFavourite]', { userId: session.user.id, coinId, err })
    return { success: false, error: 'DB_ERROR' }
  }

  revalidatePath('/favourites')
  return { success: true }
}
```
