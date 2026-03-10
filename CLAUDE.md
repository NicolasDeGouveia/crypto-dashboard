# crypto-dashboard Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-10

## Active Technologies

- TypeScript 5 (strict mode) / Node.js 20.9.0+ (002-crypto-dashboard-auth)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5 (strict mode) / Node.js 20.9.0+: Follow standard conventions

## Recent Changes

- 002-crypto-dashboard-auth: Added TypeScript 5 (strict mode) / Node.js 20.9.0+

<!-- MANUAL ADDITIONS START -->
## Agent Skills

Three Vercel frontend skills are in `.agents/skills/`:
- `vercel-react-best-practices` — 58 React/Next.js performance rules
- `vercel-composition-patterns` — React 19 Server Components, compound components
- `web-design-guidelines` — UI/UX consistency audit

One backend skill:
- `backend-guidelines` — 35 rules covering architecture, OWASP security, Auth.js v5, Drizzle ORM, caching, Clean Code, TypeScript patterns. **Always reference this skill when writing Server Actions, Route Handlers, DB queries, auth flows, or rate limiting.**

## Critical Architecture Decisions

- **Server Actions for mutations** (add/remove favourite, register) — not Route Handlers
- **No repository pattern** — direct Drizzle in Server Actions (YAGNI, 2 tables)
- **JWT session strategy** — required by Auth.js Credentials provider
- **auth.config.ts (edge) + auth.ts (Node.js)** — split required for Middleware Edge runtime
- **userId always from session** — never accept userId as a parameter from the client
- **ActionResult<T> discriminated union** — all Server Actions return typed result objects, never throw
- **redirect() outside try/catch** — it throws NEXT_REDIRECT internally

## Security Non-Negotiables

- All Server Actions: call `auth()` first, then validate inputs with allowlist regex
- coinId: must match `/^[a-z0-9-]+$/` max 100 chars before any DB operation
- Rate limiting: Upstash sliding window (5/15min per IP) on register + authorize
- Timing attacks: always run Argon2 verify even for non-existent accounts (dummy hash)
- `import 'server-only'` in `_lib/api.ts`, `_lib/db/index.ts`, `_lib/db/queries.ts`
<!-- MANUAL ADDITIONS END -->
