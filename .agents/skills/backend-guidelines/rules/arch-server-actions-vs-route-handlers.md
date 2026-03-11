# arch-server-actions-vs-route-handlers

**Category**: Architecture
**Impact**: CRITICAL

## Rule

Use Server Actions for all mutations triggered from the UI. Use Route Handlers only for GET endpoints, webhooks, and Auth.js.

## Why

1. **CSRF**: Server Actions validate the `Origin` header automatically. Route Handler POSTs do not.
2. **Cache invalidation**: `revalidatePath/revalidateTag` inside a Server Action busts BOTH the Data Cache AND the Router Cache. The same call inside a Route Handler only busts the Data Cache — the client keeps serving stale data for up to 5 minutes.
3. **Round trips**: Server Actions avoid a separate `fetch()` call from the client.

## Incorrect

```typescript
// app/api/favourites/route.ts
export async function POST(req: Request) {
  const { coinId } = await req.json()
  await db.insert(favourites).values({ userId: session.user.id, coinId })
  revalidatePath('/favourites')  // ← Does NOT bust Router Cache — client stays stale
}
```

## Correct

```typescript
// app/_actions/favourites.ts
'use server'
export async function addFavourite(coinId: string): Promise<ActionResult> {
  // ...
  revalidatePath('/favourites')  // ← Busts both Data Cache AND Router Cache
  return { success: true }
}
```

## Decision Matrix

| Use Case | Pattern |
|---|---|
| Register user | Server Action |
| Add / remove favourite | Server Action |
| Get favourite prices | Route Handler (GET) |
| Auth.js session | Route Handler (required by Auth.js) |
| Webhook ingestion | Route Handler |
