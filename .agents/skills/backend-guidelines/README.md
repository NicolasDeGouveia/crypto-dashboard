# backend-guidelines

Production-grade backend standards for Next.js App Router projects.

## Stack Coverage

- Next.js 16 App Router (Server Actions, Route Handlers, Middleware, Caching)
- Auth.js v5 (Credentials provider, JWT sessions, edge split pattern)
- Drizzle ORM + Neon PostgreSQL (query patterns, transactions, type inference)
- Upstash Redis (rate limiting, sliding window)
- Argon2id (OWASP-compliant password hashing, timing attack mitigation)
- TypeScript strict (discriminated unions, module augmentation, inferred types)

## Key Decisions Encoded in This Skill

| Decision | Choice | Reason |
|---|---|---|
| Server Actions vs Route Handlers | Actions for mutations | CSRF + Router Cache invalidation |
| Repository pattern | No | YAGNI — 2 tables, simple queries |
| Session strategy | JWT | Required for Credentials provider |
| Error handling in actions | Discriminated union | Typed, serialisable, no opaque throws |
| Auth edge split | auth.config.ts + auth.ts | bcrypt/Argon2 can't run on Edge |
| Rate limiting | Upstash sliding window | Works across serverless pod fleet |
| userId source | session.user.id only | Prevent IDOR — never from client |

## Rule Count

- 8 categories
- 35 rules
- All rules grounded in: Next.js 16 docs, Auth.js v5 docs, Drizzle docs, OWASP cheat sheets

## Files

- `SKILL.md` — skill metadata and quick reference
- `AGENTS.md` — full reference with all rules and code examples
- `rules/` — individual rule files (auto-generated from AGENTS.md sections)
