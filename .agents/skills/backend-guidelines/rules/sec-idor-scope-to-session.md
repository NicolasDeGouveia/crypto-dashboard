# sec-idor-scope-to-session

**Category**: Security (OWASP A01 Broken Access Control)
**Impact**: CRITICAL

## Rule

Never accept `userId` as a parameter from the client. Always use `session.user.id` from `auth()`.

## Why

Accepting `userId` from the client allows any authenticated user to modify any other user's data by passing a different `userId`. This is an Insecure Direct Object Reference (IDOR) vulnerability — OWASP A01 and the most common auth bug in applications.

## Incorrect

```typescript
export async function removeFavourite(userId: string, coinId: string) {
  await db.delete(favourites).where(
    and(eq(favourites.userId, userId), eq(favourites.coinId, coinId))
  )
}
// Attacker passes userId = 'victim-user-id' → deletes victim's favourites
```

## Correct

```typescript
export async function removeFavourite(coinId: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'UNAUTHENTICATED' }

  await db.delete(favourites).where(
    and(
      eq(favourites.userId, session.user.id),  // From verified session — cannot be forged
      eq(favourites.coinId, validatedCoinId),
    )
  )
  return { success: true }
}
```
