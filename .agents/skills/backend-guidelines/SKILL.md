---
name: backend-guidelines
description: Production-grade backend guidelines for Next.js App Router projects using TypeScript strict mode, Drizzle ORM, Neon PostgreSQL, Auth.js v5, and Upstash Redis. Covers architecture decisions, security (OWASP), Clean Code patterns, and caching strategies. Apply when writing Server Actions, Route Handlers, DB queries, auth logic, rate limiting, or any server-side code.
license: MIT
metadata:
  author: internal
  version: "1.0.0"
---

# Backend Guidelines — Next.js App Router

Production-grade backend standards for this crypto dashboard. Covers architecture, security (OWASP), Clean Code, caching, and technology-specific patterns.

## When to Apply

Reference these guidelines when:
- Writing or reviewing Server Actions (`app/_actions/`)
- Implementing Route Handlers (`app/api/`)
- Writing database queries with Drizzle ORM
- Implementing Auth.js v5 auth flows
- Adding rate limiting or input validation
- Defining TypeScript types for server responses
- Making architectural decisions (layers, abstractions, file structure)

## Rule Categories

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Architecture & File Structure | CRITICAL | `arch-` |
| 2 | Security (OWASP) | CRITICAL | `sec-` |
| 3 | Auth.js v5 Patterns | HIGH | `auth-` |
| 4 | Drizzle ORM Patterns | HIGH | `db-` |
| 5 | Caching Strategy | HIGH | `cache-` |
| 6 | Clean Code | MEDIUM | `clean-` |
| 7 | Error Handling | MEDIUM | `err-` |
| 8 | TypeScript Patterns | MEDIUM | `ts-` |

## Quick Reference

### 1. Architecture & File Structure (CRITICAL)

- `arch-folder-conventions` — `_lib/`, `_actions/`, `(auth)/`, `(protected)/` naming
- `arch-server-actions-vs-route-handlers` — mutations = Server Actions, REST/external = Route Handlers
- `arch-no-repository-pattern` — direct Drizzle at this scale (YAGNI)
- `arch-server-only-guard` — `import 'server-only'` in `_lib/db/` and `_lib/api.ts`
- `arch-db-queries-file` — `_lib/db/queries.ts` for React.cache()-wrapped query helpers
- `arch-split-auth-config` — `auth.config.ts` (edge-safe) vs `auth.ts` (Node.js full)
- `arch-no-barrel-exports` — no `_actions/index.ts` re-exports
- `arch-route-groups` — `(auth)` for login/register, `(protected)` for auth-required pages

### 2. Security (OWASP) (CRITICAL)

- `sec-auth-in-action` — always call `auth()` inside Server Actions, not only middleware
- `sec-idor-scope-to-session` — never accept userId from client; always use `session.user.id`
- `sec-input-validation-allowlist` — validate all inputs with allowlist regex before DB
- `sec-coinid-regex` — `coinId` must match `/^[a-z0-9-]+$/` max 100 chars
- `sec-no-error-leakage` — generic auth error messages; rich error codes stay server-side
- `sec-timing-attack-dummy-hash` — always run Argon2 verify even for non-existent accounts
- `sec-rate-limit-auth` — Upstash sliding window on register + authorize (5/15min per IP)
- `sec-password-max-length` — enforce max 128 chars to prevent Argon2 DoS
- `sec-session-cookie-defaults` — never override HttpOnly/Secure/SameSite defaults
- `sec-csrf-server-actions` — Next.js Origin check handles CSRF; no extra library needed
- `sec-env-var-validation` — validate required env vars at module init with descriptive errors

### 3. Auth.js v5 Patterns (HIGH)

- `auth-jwt-strategy-required` — Credentials provider requires `session: { strategy: "jwt" }`
- `auth-session-user-id` — add `id` to session via `jwt` + `session` callbacks
- `auth-type-augmentation` — `next-auth.d.ts` with `id: string` on Session and JWT
- `auth-authorize-return-null` — return `null` for failed auth, never throw
- `auth-programmatic-signin` — `signIn()` in Server Action throws NEXT_REDIRECT, never catch it
- `auth-edge-split` — middleware imports `auth.config.ts` only (no bcrypt, no DB)
- `auth-drizzle-adapter` — pass explicit table references to `DrizzleAdapter`
- `auth-no-userid-in-accounts-table` — Credentials users have no row in `accounts` table

### 4. Drizzle ORM Patterns (HIGH)

- `db-infer-types` — use `$inferSelect` / `$inferInsert` for table types
- `db-conflict-handling` — `onConflictDoNothing()` for idempotent inserts
- `db-transaction-atomic` — wrap multi-table writes in `db.transaction()`
- `db-composable-tx` — accept `DB | TX` parameter in query helpers for testability
- `db-react-cache-queries` — wrap Drizzle queries in `React.cache()` for per-request dedup
- `db-neon-http-driver` — use `drizzle-orm/neon-http` with `@neondatabase/serverless`
- `db-snake-case-columns` — snake_case DB columns, camelCase TypeScript properties
- `db-no-raw-sql` — no raw SQL string interpolation; use Drizzle query builder always

### 5. Caching Strategy (HIGH)

- `cache-fetch-revalidate` — `next: { revalidate: 60 }` on market calls, 120 on detail
- `cache-fetch-tags` — add `tags: ['coin-markets']` to enable `revalidateTag()`
- `cache-react-cache` — `React.cache()` for per-request DB query dedup
- `cache-server-actions-revalidate` — call `revalidatePath/revalidateTag` after mutations in Server Actions (not Route Handlers)
- `cache-no-force-dynamic` — only use `force-dynamic` when cookies/searchParams actually needed
- `cache-generate-static-params` — pre-render top 50 coins in `generateStaticParams`

### 6. Clean Code (MEDIUM)

- `clean-one-file-per-domain` — `_actions/auth.ts` + `_actions/favourites.ts`, not per-action
- `clean-verb-first-naming` — `getCoinMarkets`, `addFavourite`, `registerUser`
- `clean-no-wrapper-functions` — don't wrap single-line operations in named helpers
- `clean-redirect-outside-try` — `redirect()` and `notFound()` must be outside try/catch
- `clean-ids-array-param` — accept `string[]` for IDs, join inside the function
- `clean-env-var-fail-fast` — fail with descriptive message at module init, not at first use

### 7. Error Handling (MEDIUM)

- `err-discriminated-union` — `ActionResult<T>` = `{ success: true; data?: T } | { success: false; error: ActionError }`
- `err-never-throw-from-action` — return typed error objects, never throw to client
- `err-not-found-vs-null` — `notFound()` for 404 routes, return `null` for expected API errors
- `err-log-with-context` — `console.error('[functionName]', { inputs, err })` server-side
- `err-no-internal-in-response` — never surface DB errors, stack traces, or internal IDs to client

### 8. TypeScript Patterns (MEDIUM)

- `ts-action-error-union` — define `ActionError` as a string union of all possible error codes
- `ts-session-augmentation` — always type `session.user.id` via module augmentation
- `ts-infer-drizzle` — use `typeof table.$inferSelect` instead of manual interfaces
- `ts-async-params` — `const { id } = await params` (params is a Promise in Next.js 15+)
- `ts-typed-fetch-response` — always cast `await res.json()` to a concrete type

## Full Reference

See `AGENTS.md` for all rules with code examples.
