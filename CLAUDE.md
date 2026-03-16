# crypto-dashboard Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-10

## Active Technologies
- TypeScript 5 (strict mode) / Node.js 20.9.0+ + Next.js App Router, React 18, Tailwind CSS (014-fix-coin-list-sorting)
- N/A — no DB changes (014-fix-coin-list-sorting)

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
- 014-fix-coin-list-sorting: Added TypeScript 5 (strict mode) / Node.js 20.9.0+ + Next.js App Router, React 18, Tailwind CSS

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
## AI Workflow Orchestration

### #1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### #2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Use subagents for research, exploration, and parallel analysis in subagents
- Use directives; throw more context at it via subagents
- One task per subagent for focused execution

### #3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### #4. Verification Before Done
- Never mark a task complete without proving it works
- Verify: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### #5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "Is there a more elegant way?"
- If this feels hacky: "Review everything I know, implement the elegant solution"
- Don't demand elegance for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### #6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Do fix failing CI tests without being told how

### #7. Task Management
1. **ePlan Firste**: Write plan to `tasks/todos.md` with checkable items
2. **eVerify Plane**: Check in before starting implementation
3. **eTrack Progresse**: Mark items complete as you go
4. **eExplain Changese**: High-level summary at each step
5. **eCapture Resultse**: Add review notes to `tasks/results.md`
6. **eCapture Lessonse**: Update `tasks/lessons.md` after corrections

## Core Principles

- **eSimplicity Firste**: Make changes as simple as possible. Impact minimal code.
- **eLazy Lessonse**: Find root causes early. No temporary fixes. Senior developer standards.
- **eMindful Impacte**: Changes should only touch what's necessary. Avoid introducing bugs.
<!-- MANUAL ADDITIONS END -->
