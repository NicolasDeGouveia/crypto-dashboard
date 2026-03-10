# Backend Guidelines — Full Reference

> Production-grade backend standards for this Next.js App Router crypto dashboard.
> Stack: TypeScript strict · Next.js 16 App Router · Drizzle ORM · Neon PostgreSQL · Auth.js v5 · Upstash Redis · Argon2id

---

## Category 1: Architecture & File Structure

### `arch-folder-conventions`

**Rule**: Follow Next.js App Router private folder conventions strictly.

```
app/
├── (auth)/                    # Route group — login/register, no URL segment
│   ├── login/page.tsx
│   └── register/page.tsx
├── (protected)/               # Route group — auth-required pages
│   ├── layout.tsx             # Auth guard (defence-in-depth layer 2)
│   └── favourites/page.tsx
├── api/
│   ├── auth/[...nextauth]/route.ts   # Auth.js handler ONLY
│   └── favourites/prices/route.ts    # GET read endpoints only
├── _actions/                  # Server Actions (private — not routable)
│   ├── auth.ts                # register()
│   └── favourites.ts          # addFavourite(), removeFavourite()
├── _lib/                      # Server-only utilities (private)
│   ├── api.ts                 # External fetch wrappers (CoinGecko)
│   ├── auth.ts                # Auth.js full config (Node.js only)
│   ├── auth.config.ts         # Auth.js edge-safe config
│   ├── constants.ts           # PAGE_SIZE, SORT_OPTIONS, etc.
│   ├── db/
│   │   ├── index.ts           # Drizzle db singleton
│   │   ├── schema.ts          # Table definitions
│   │   └── queries.ts         # React.cache()-wrapped query helpers
│   ├── redis.ts               # Upstash client + rate limiter
│   ├── types.ts               # Shared TypeScript types
│   └── utils.ts               # Pure utility functions
└── components/                # Shared UI components
```

**Why**: `_` prefix makes folders private to the router. Route groups `(auth)` and `(protected)` create layout boundaries without adding URL segments. `_actions/` signals server-only modules to both developers and bundlers.

---

### `arch-server-actions-vs-route-handlers`

**Rule**: Use Server Actions for mutations triggered from the UI. Use Route Handlers only for REST GET endpoints, webhooks, and Auth.js.

| Use Case | Correct Approach |
|---|---|
| Register user | Server Action in `_actions/auth.ts` |
| Add/remove favourite | Server Action in `_actions/favourites.ts` |
| Get prices for favourites list | Route Handler `GET /api/favourites/prices` |
| Auth.js session management | Route Handler `app/api/auth/[...nextauth]/route.ts` |

**Why Server Actions for mutations:**
- Built-in CSRF protection via Origin header validation
- `revalidatePath/revalidateTag` inside a Server Action busts BOTH the Data Cache AND the Router Cache. Route Handlers only bust the Data Cache — the client keeps serving stale data until the 5-minute TTL expires.
- One round-trip instead of two (no separate fetch call from the client)

```typescript
// CORRECT — Server Action for mutation
// app/_actions/favourites.ts
'use server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function addFavourite(coinId: string): Promise<ActionResult> {
  // ... auth + validation + DB insert
  revalidateTag(`favourites:${session.user.id}`)
  revalidatePath('/favourites')  // Also busts Router Cache
  return { success: true }
}

// ANTI-PATTERN — Route Handler POST for internal UI mutation
// app/api/favourites/route.ts  ← DO NOT create this
export async function POST(req: Request) {
  // revalidatePath here does NOT bust the Router Cache
}
```

---

### `arch-no-repository-pattern`

**Rule**: Use Drizzle directly in Server Actions. Do not create a repository or service layer.

**Justification (per constitution Principle V — Simplicity):**
- This project has 2 application tables: `users` and `favourites`
- All queries are simple: insert, delete, select-by-userId
- A repository adds 1 file, 1 interface, and 1 layer of indirection per table with zero complexity reduction
- Introduce a repository only when: the same query is needed in 3+ different Server Actions, OR when unit-testing the DB layer in isolation becomes necessary

```typescript
// CORRECT — direct Drizzle in Server Action
export async function addFavourite(coinId: string): Promise<ActionResult> {
  const session = await auth()
  await db.insert(favourites).values({ userId: session.user.id, coinId })
  return { success: true }
}

// ANTI-PATTERN — unnecessary abstraction
class FavouriteRepository {
  async add(userId: string, coinId: string) {  // indirection with no benefit
    return db.insert(favourites).values({ userId, coinId })
  }
}
```

**Exception**: `_lib/db/queries.ts` is not a repository — it is a collection of `React.cache()`-wrapped helpers to enable per-request deduplication. It is a caching primitive, not an abstraction layer.

---

### `arch-server-only-guard`

**Rule**: Add `import 'server-only'` at the top of every file that must never reach the client bundle.

```typescript
// app/_lib/api.ts
import 'server-only'  // Build-time error if imported in 'use client' component
// ... COINGECKO_API_KEY is safe — cannot leak to client bundle

// app/_lib/db/index.ts
import 'server-only'

// app/_lib/db/queries.ts
import 'server-only'
```

**Why**: Next.js replaces `process.env.COINGECKO_API_KEY` with an empty string when included in the client bundle — this silently breaks the app without a build error. `server-only` converts this into a build-time failure with a clear message.

---

### `arch-split-auth-config`

**Rule**: Split Auth.js config into two files to support Edge Middleware.

```
auth.config.ts  ← edge-safe: no bcrypt, no DB, only JWT/cookie logic
auth.ts         ← Node.js full: Drizzle adapter, Credentials provider, Argon2
middleware.ts   ← imports ONLY from auth.config.ts
```

```typescript
// app/_lib/auth.config.ts — Edge-safe (no native modules)
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: { signIn: '/login' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected = nextUrl.pathname.startsWith('/favourites')
      if (isProtected && !isLoggedIn) return false  // redirects to pages.signIn
      return true
    },
  },
  providers: [],  // NO Credentials here — bcrypt cannot run on Edge
}
```

```typescript
// app/_lib/auth.ts — Node.js runtime only
import 'server-only'
import NextAuth from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { db } from './db'
import { users, accounts, sessions, verificationTokens } from './db/schema'
import { eq } from 'drizzle-orm'
import argon2 from '@node-rs/argon2'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: 'jwt' },  // REQUIRED with Credentials provider
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }
        const [user] = await db.select().from(users).where(eq(users.email, email))

        // Timing attack mitigation: always run Argon2 verify
        const dummyHash = '$argon2id$v=19$m=65536,t=3,p=4$dummysalt$dummyhash'
        const hashToCompare = user?.password ?? dummyHash
        const isValid = await argon2.verify(hashToCompare, password)

        if (!user || !isValid) return null  // Generic failure — no enumeration
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
})
```

```typescript
// middleware.ts — imports ONLY auth.config.ts, never auth.ts
import NextAuth from 'next-auth'
import { authConfig } from '@/app/_lib/auth.config'

const { auth } = NextAuth(authConfig)
export default auth

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
```

---

### `arch-db-queries-file`

**Rule**: Create `_lib/db/queries.ts` for all Drizzle queries that may be called from multiple Server Components in the same render tree. Wrap them in `React.cache()`.

```typescript
// app/_lib/db/queries.ts
import 'server-only'
import { cache } from 'react'
import { db } from './index'
import { favourites } from './schema'
import { eq } from 'drizzle-orm'

// React.cache() ensures this runs at most ONCE per request regardless of
// how many Server Components call it in the same render tree.
export const getUserFavouriteIds = cache(async (userId: string): Promise<string[]> => {
  const rows = await db
    .select({ coinId: favourites.coinId })
    .from(favourites)
    .where(eq(favourites.userId, userId))
  return rows.map(r => r.coinId)
})
```

---

## Category 2: Security (OWASP)

### `sec-auth-in-action`

**Rule**: Always call `auth()` inside the Server Action body. Middleware is not sufficient.

```typescript
// CORRECT — auth check inside the action
'use server'
export async function addFavourite(coinId: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'UNAUTHENTICATED' }
  // ...
}

// ANTI-PATTERN — trusting that middleware already checked
'use server'
export async function addFavourite(coinId: string) {
  // No auth check — assumes middleware protected this route
  // Server Actions are POST endpoints; any client can call them directly
  await db.insert(favourites).values({ userId: 'attacker-id', coinId })
}
```

**Why**: Middleware runs at the edge and redirects unauthenticated browser navigations. But Server Actions are invoked via `fetch POST` requests — any HTTP client can call them without going through middleware. Always re-verify auth inside the action.

---

### `sec-idor-scope-to-session`

**Rule**: NEVER accept `userId` as a parameter from the client. ALWAYS use `session.user.id`.

```typescript
// CORRECT — userId from session only
export async function removeFavourite(coinId: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: 'UNAUTHENTICATED' }

  await db.delete(favourites).where(
    and(
      eq(favourites.userId, session.user.id),  // ← from session, never from client
      eq(favourites.coinId, validatedCoinId),
    )
  )
  return { success: true }
}

// ANTI-PATTERN — IDOR vulnerability: any user can delete any other user's favourites
export async function removeFavourite(userId: string, coinId: string) {
  await db.delete(favourites).where(
    and(eq(favourites.userId, userId), eq(favourites.coinId, coinId))
    //                        ^^^^^^ accepts userId from the CALLER — critical vulnerability
  )
}
```

---

### `sec-input-validation-allowlist`

**Rule**: Validate ALL inputs with an allowlist approach before any DB operation or external call. Client-side validation is UX — server-side validation is security.

```typescript
// Validation helpers — pure functions, easy to unit test
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && email.length <= 254 && EMAIL_REGEX.test(email)
}

function validatePassword(password: unknown): password is string {
  return typeof password === 'string' && password.length >= 8 && password.length <= 128
}

const COIN_ID_REGEX = /^[a-z0-9-]+$/  // Hoisted outside function — not re-created per call

function validateCoinId(coinId: unknown): coinId is string {
  return typeof coinId === 'string' && coinId.length > 0 && coinId.length <= 100
    && COIN_ID_REGEX.test(coinId)
}

// Usage in action
export async function register(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!validateEmail(email)) return { success: false, error: 'INVALID_EMAIL' }
  if (!validatePassword(password)) return { success: false, error: 'PASSWORD_TOO_SHORT' }
  // Only proceed after validation passes
}
```

**Why `/^[a-z0-9-]+$/` for coinId**: The `^` and `$` anchors are essential — without them, `abc\ninject` would match `[a-z0-9-]` partially. The allowlist allows only characters that appear in CoinGecko IDs. This prevents path traversal and query injection regardless of Drizzle's parameterisation.

---

### `sec-timing-attack-dummy-hash`

**Rule**: In the `authorize` callback, always run Argon2 verify even when the user does not exist.

```typescript
// CORRECT — constant-time regardless of user existence
async authorize(credentials) {
  const [user] = await db.select().from(users).where(eq(users.email, email))

  // If user does not exist, we still run Argon2 with a dummy hash.
  // This ensures equal response time for existing vs non-existing accounts.
  const DUMMY_HASH = '$argon2id$v=19$m=65536,t=3,p=4$c2FsdHNhbHQ$bm90YXJlYWxoYXNo'
  const hashToVerify = user?.password ?? DUMMY_HASH
  const isValid = await argon2.verify(hashToVerify, password)

  if (!user || !isValid) return null  // Single generic failure path
  return { id: user.id, email: user.email }
}

// ANTI-PATTERN — early return leaks account existence via timing
async authorize(credentials) {
  const [user] = await db.select().from(users).where(eq(users.email, email))
  if (!user) return null  // ← Returns in ~5ms for unknown email
  const isValid = await argon2.verify(user.password, password)
  if (!isValid) return null  // ← Returns in ~200ms for wrong password on existing account
  // An attacker can enumerate accounts by measuring response time
}
```

---

### `sec-rate-limit-auth`

**Rule**: Apply Upstash rate limiting to the `register` Server Action and the `authorize` callback. Key by IP address.

```typescript
// app/_lib/redis.ts
import 'server-only'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

export const redis = Redis.fromEnv()

export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: false,
})
```

```typescript
// In register Server Action
import { headers } from 'next/headers'
import { authRatelimit } from '@/app/_lib/redis'

export async function register(formData: FormData): Promise<ActionResult> {
  const ip = (await headers()).get('x-forwarded-for') ?? 'unknown'
  const { success } = await authRatelimit.limit(ip)
  if (!success) return { success: false, error: 'RATE_LIMITED' }
  // ... continue with validation and DB operations
}
```

**Why sliding window over fixed window**: Fixed window allows up to 2× the limit at window boundaries (burst at end of one window + start of next). Sliding window prevents this. `@upstash/ratelimit` uses Redis MULTI/EXEC for atomic operations.

---

### `sec-env-var-validation`

**Rule**: Validate required env vars at module initialisation with descriptive error messages.

```typescript
// app/_lib/db/index.ts
import 'server-only'

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. ' +
    'Copy .env.example to .env and fill in the Neon connection string.'
  )
}

const sql = neon(process.env.DATABASE_URL)
export const db = drizzle(sql, { schema })
```

```typescript
// app/_lib/redis.ts
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error(
    'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set. ' +
    'Create a free Redis instance at https://upstash.com'
  )
}
```

**Why**: Without validation, the app fails with an obscure `TypeError: Cannot read properties of undefined` deep in a request handler. The descriptive error surfaces during startup, pointing directly to the fix.

---

## Category 3: Auth.js v5 Patterns

### `auth-jwt-strategy-required`

**Rule**: The Credentials provider REQUIRES `session: { strategy: 'jwt' }`. Database sessions are incompatible.

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },  // REQUIRED — cannot use 'database' with Credentials
  providers: [Credentials({ ... })],
})
```

**Why**: The Credentials provider does not create a row in the `accounts` table. Database sessions rely on the `sessions` table and require a user ID to look up. Without `accounts`, the link between the session token and the user cannot be established via database lookups.

---

### `auth-session-user-id`

**Rule**: Add `id` to the JWT token and session object via callbacks. Augment TypeScript types.

```typescript
// In auth.ts callbacks
callbacks: {
  jwt({ token, user }) {
    if (user) token.id = user.id  // Only present on initial sign-in
    return token
  },
  session({ session, token }) {
    session.user.id = token.id as string
    return session
  },
},
```

```typescript
// types/next-auth.d.ts — TypeScript module augmentation
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT { id: string }
}
```

After this, `session.user.id` is typed and accessible in ALL Server Components, Actions, and Route Handlers without casting.

---

### `auth-programmatic-signin`

**Rule**: `signIn()` called from a Server Action throws `NEXT_REDIRECT` internally. Never catch it.

```typescript
// CORRECT — signIn outside try/catch
export async function register(formData: FormData): Promise<ActionResult> {
  // ... validate + hash + insert user ...

  try {
    await db.insert(users).values({ id: crypto.randomUUID(), email, password: hash })
  } catch {
    return { success: false, error: 'EMAIL_IN_USE' }
  }

  // signIn() MUST be outside try/catch — it throws NEXT_REDIRECT to perform the redirect
  await signIn('credentials', { email, password, redirectTo: '/' })
  // Code after signIn() never runs — the redirect exception is thrown before this line
}

// ANTI-PATTERN — redirect is swallowed
export async function register(formData: FormData) {
  try {
    await db.insert(users).values({ ... })
    await signIn('credentials', { ... })  // ← NEXT_REDIRECT is caught here — redirect never fires
  } catch (err) {
    return { error: 'Registration failed' }
  }
}
```

---

## Category 4: Drizzle ORM Patterns

### `db-infer-types`

**Rule**: Use `$inferSelect` and `$inferInsert` for table-derived types. Never write manual interfaces that duplicate schema columns.

```typescript
// schema.ts
export const users = pgTable('users', { ... })
export const favourites = pgTable('favourites', { ... })

// types.ts — inferred, never drift from schema
type User = typeof users.$inferSelect          // { id: string, email: string, password: string | null, ... }
type NewUser = typeof users.$inferInsert       // { id: string, email: string, password?: string | null, ... }
type Favourite = typeof favourites.$inferSelect
```

---

### `db-conflict-handling`

**Rule**: Use `onConflictDoNothing()` for idempotent inserts. Use `onConflictDoUpdate()` for upserts.

```typescript
// Idempotent — unique constraint on (userId, coinId) handles duplicates silently
await db.insert(favourites)
  .values({ userId, coinId })
  .onConflictDoNothing()

// Upsert — update the timestamp if conflict
await db.insert(favourites)
  .values({ userId, coinId, addedAt: new Date() })
  .onConflictDoUpdate({
    target: [favourites.userId, favourites.coinId],
    set: { addedAt: new Date() },
  })
```

---

### `db-transaction-atomic`

**Rule**: Wrap any operation that touches multiple tables in `db.transaction()`.

```typescript
// Creating a user + initial data atomically
const newUser = await db.transaction(async (tx) => {
  const [user] = await tx.insert(users)
    .values({ id: crypto.randomUUID(), email, password: hash })
    .returning()

  // If this insert fails, the user insert also rolls back
  await tx.insert(userPreferences).values({ userId: user.id, theme: 'dark' })

  return user
})
```

---

### `db-react-cache-queries`

**Rule**: Wrap Drizzle queries called from Server Components in `React.cache()` to deduplicate within a single request.

```typescript
// app/_lib/db/queries.ts
import 'server-only'
import { cache } from 'react'
import { db } from './index'
import { favourites } from './schema'
import { eq } from 'drizzle-orm'

// If both layout.tsx AND page.tsx call getUserFavouriteIds(userId),
// only ONE Neon query fires per request.
export const getUserFavouriteIds = cache(async (userId: string): Promise<string[]> => {
  const rows = await db
    .select({ coinId: favourites.coinId })
    .from(favourites)
    .where(eq(favourites.userId, userId))
  return rows.map(r => r.coinId)
})
```

**When to use `unstable_cache` instead**: If you need the result to persist across multiple requests (cross-request caching, like a slow query whose result changes infrequently), use `unstable_cache` with `revalidate` and `tags`. Use `React.cache()` for per-request dedup (free, no TTL needed).

---

## Category 5: Caching Strategy

### `cache-fetch-tags`

**Rule**: Always add `tags` to CoinGecko fetch calls to enable on-demand revalidation.

```typescript
// getCoinMarkets
const res = await fetch(`${COINGECKO_BASE_URL}/coins/markets?${params}`, {
  headers: getHeaders(),
  next: {
    revalidate: 60,
    tags: ['coin-markets'],
  },
})

// getCoinDetails
const res = await fetch(`${COINGECKO_BASE_URL}/coins/${id}?...`, {
  headers: getHeaders(),
  next: {
    revalidate: 120,
    tags: [`coin-detail:${id}`, 'coin-detail'],
  },
})
```

After mutations or admin actions: `revalidateTag('coin-markets')` purges all market data. `revalidateTag('coin-detail:bitcoin')` purges only the Bitcoin detail page.

---

### `cache-server-actions-revalidate`

**Rule**: Call `revalidatePath` / `revalidateTag` inside Server Actions (not Route Handlers) to bust the Router Cache AND the Data Cache.

```typescript
// CORRECT — Server Action revalidation busts both caches
export async function addFavourite(coinId: string): Promise<ActionResult> {
  await db.insert(favourites).values({ ... })
  revalidateTag(`favourites:${session.user.id}`)
  revalidatePath('/favourites')  // Next.js also purges the Router Cache for this path
  return { success: true }
}

// ANTI-PATTERN — Route Handler revalidation only busts Data Cache
// Client Router Cache keeps serving stale /favourites for up to 5 minutes
export async function POST() {
  await db.insert(favourites).values({ ... })
  revalidatePath('/favourites')  // ← Does NOT bust Router Cache from a Route Handler
}
```

---

## Category 6: Clean Code

### `clean-one-file-per-domain`

**Rule**: One file per domain in `_actions/`, not one file per action.

```
✅ _actions/auth.ts          — contains register()
✅ _actions/favourites.ts    — contains addFavourite() and removeFavourite()

❌ _actions/register.ts      — one action per file adds navigation overhead
❌ _actions/add-favourite.ts
❌ _actions/index.ts          — barrel re-export obscures source and hurts tree-shaking
```

**Split rule**: Split only when a file exceeds ~150 lines of non-boilerplate code, or when two actions in the same domain share zero code and are developed by different people.

---

### `clean-redirect-outside-try`

**Rule**: `redirect()` and `notFound()` from `next/navigation` throw internally. They must be called OUTSIDE try/catch blocks.

```typescript
// CORRECT
export async function savePost(formData: FormData): Promise<ActionResult> {
  let post

  try {
    post = await db.insert(posts).values({ ... }).returning()
  } catch {
    return { success: false, error: 'DB_ERROR' }
  }

  revalidatePath('/posts')
  redirect(`/posts/${post[0].id}`)  // ← Outside try/catch — redirect fires correctly
}

// ANTI-PATTERN — redirect is swallowed by the catch
try {
  await db.insert(posts).values({ ... })
  redirect('/posts')  // ← Caught by catch below — redirect never fires
} catch (err) {
  return { error: 'failed' }
}
```

The same rule applies to `notFound()`:
```typescript
// CORRECT
const coinData = await getCoinDetails(id)
if (!coinData) notFound()  // Outside try/catch — propagates to not-found.tsx
```

---

### `clean-ids-array-param`

**Rule**: Accept `string[]` for multi-ID parameters. Join inside the function, not at call sites.

```typescript
// CORRECT — clean call sites
type CoinMarketsParams = {
  page?: number
  sort?: string
  perPage?: number
  ids?: string[]  // ← Array at the boundary
}

async function getCoinMarkets({ ids, ... }: CoinMarketsParams) {
  if (ids?.length) params.set('ids', ids.join(','))  // ← Join happens once, here
}

// Usage — no string manipulation at call site
getCoinMarkets({ ids: favouriteIds })  // ✅ Clean
getCoinMarkets({ ids: ['bitcoin', 'ethereum'] })  // ✅ Clean

// ANTI-PATTERN — leaks API format into callers
getCoinMarkets({ ids: favouriteIds.join(',') })  // ❌ Every caller must know to join
```

---

## Category 7: Error Handling

### `err-discriminated-union`

**Rule**: All Server Actions return `ActionResult<T>`. Define error codes as a union string type.

```typescript
// app/_lib/types.ts — shared across all actions
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
```

Usage in components:
```typescript
// Client Component using useActionState
const [state, action, isPending] = useActionState(addFavourite, null)

// TypeScript narrows the type on both branches
if (state && !state.success) {
  // state.error is typed as ActionErrorCode — IDE autocompletes all values
  const message = ERROR_MESSAGES[state.error]
}
```

---

### `err-never-throw-from-action`

**Rule**: Server Actions must never throw exceptions to the client. Return typed error objects.

```typescript
// CORRECT — all error paths return typed values
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

// ANTI-PATTERN — throws to client; client receives opaque error with no type information
export async function addFavourite(coinId: string) {
  const session = await auth()
  if (!session) throw new Error('Not authenticated')  // ← Client sees "Error: Not authenticated"
  await db.insert(favourites).values({ ... })  // ← Throws on constraint violation; client crashes
}
```

---

### `err-log-with-context`

**Rule**: Log errors with function name and relevant input context. Never log passwords, tokens, or full stack traces to production.

```typescript
// CORRECT — structured log with context
console.error('[addFavourite]', { userId: session.user.id, coinId, err: err.message })

// ANTI-PATTERN — no context
console.error(err)

// ANTI-PATTERN — logs sensitive data
console.error('[register]', { email, password, err })  // ← Never log passwords
```

---

## Category 8: TypeScript Patterns

### `ts-action-error-union`

**Rule**: Define all possible error codes as a union string type, not as string literals scattered across action files.

```typescript
// Centralised in _lib/types.ts — import everywhere
export type ActionErrorCode =
  | 'UNAUTHENTICATED'
  | 'INVALID_COIN_ID'
  | 'DB_ERROR'
  | 'RATE_LIMITED'
  | 'INVALID_EMAIL'
  | 'PASSWORD_TOO_SHORT'
  | 'EMAIL_IN_USE'

// Human-readable messages for UI — also centralised
export const ACTION_ERROR_MESSAGES: Record<ActionErrorCode, string> = {
  UNAUTHENTICATED: 'You must be logged in to do this.',
  INVALID_COIN_ID: 'Invalid coin.',
  DB_ERROR: 'Something went wrong. Please try again.',
  RATE_LIMITED: 'Too many attempts. Please try again in 15 minutes.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.',
  EMAIL_IN_USE: 'An account with this email already exists.',
}
```

---

### `ts-async-params`

**Rule**: In Next.js 15+, `params` and `searchParams` are Promises. Always `await` them.

```typescript
// CORRECT — Next.js 15+ async params
interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string; sort?: string; q?: string }>
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params
  const { page = '1', sort = DEFAULT_SORT, q } = await searchParams
}

// ANTI-PATTERN — sync access (works in dev, breaks in production)
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params  // ← TypeScript error in strict mode; runtime error in Next.js 15+
}
```

---

## Anti-Patterns Summary

| Anti-Pattern | Correct Alternative |
|---|---|
| Route Handler POST for UI mutations | Server Action |
| `userId` accepted from client | `session.user.id` from `auth()` |
| Early return before Argon2 verify | Always run dummy hash verify |
| `redirect()` inside try/catch | `redirect()` after try/catch block |
| `throw` from Server Action | Return `{ success: false, error: '...' }` |
| `import api.ts` in Client Component | Add `import 'server-only'` to api.ts |
| Manual type interfaces for DB tables | `typeof table.$inferSelect` |
| `ids.join(',')` at every call site | `ids?: string[]` parameter, join inside function |
| No rate limiting on auth actions | Upstash sliding window before DB queries |
| `process.env.X!` without validation | Throw descriptive error at module init |
| Repository/service layer for 2 tables | Direct Drizzle in Server Actions |
| Barrel re-exports from `_actions/` | Import directly from `_actions/auth.ts` |
| Logging passwords or tokens | Log only function name + non-sensitive inputs |
| Generic error messages in action responses | Rich error codes in actions, generic text in UI |
