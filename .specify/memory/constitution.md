<!--
SYNC IMPACT REPORT
==================
Version change: (unfilled template) → 1.0.0
Type of bump: MAJOR — first ratification; template replaced with concrete governance.

Modified principles:
  [PRINCIPLE_1_NAME] → I. Code Quality
  [PRINCIPLE_2_NAME] → II. Testing Standards
  [PRINCIPLE_3_NAME] → III. User Experience Consistency
  [PRINCIPLE_4_NAME] → IV. Performance Requirements
  [PRINCIPLE_5_NAME] → V. Simplicity & Minimal Complexity

Added sections:
  - Technology Standards (replaces [SECTION_2_NAME])
  - Development Workflow (replaces [SECTION_3_NAME])

Removed sections: None

Templates requiring updates:
  ✅ .specify/templates/plan-template.md — Constitution Check section now maps to
     five concrete gate criteria (Code Quality, Testing, UX, Performance, Simplicity).
     No structural change needed; gates are derived at runtime from this document.
  ✅ .specify/templates/spec-template.md — Success Criteria section already mandates
     measurable outcomes aligned with SC metrics; no structural change required.
  ✅ .specify/templates/tasks-template.md — Phase N (Polish) already includes
     performance optimisation, security hardening, and test tasks consistent with
     principles II and IV. No structural change required.
  ⚠  .specify/templates/commands/ — Directory does not exist; no command files to update.

Deferred TODOs:
  - RATIFICATION_DATE: set to today (2026-03-10) as first formal ratification.
  - No other placeholders deferred.
-->

# Crypto Dashboard Constitution

## Core Principles

### I. Code Quality

All production code MUST be clean, readable, and maintainable. Specifically:

- Every component or function MUST have a single, well-defined responsibility.
- Code MUST be written for the next reader, not just the current author: variable and
  function names MUST be self-descriptive; inline comments are reserved for non-obvious
  logic only.
- Dead code, commented-out blocks, and unused imports MUST NOT be merged into `main`.
- All code changes MUST pass linting and static analysis gates before merge (ESLint /
  TypeScript strict mode for this project).
- Complexity MUST be justified: abstractions are only introduced when the same logic
  appears in three or more distinct locations, or when a single component exceeds a
  clear single responsibility.

**Rationale**: Readable code reduces review time, accelerates onboarding, and prevents
the accumulation of technical debt that slows future feature delivery.

### II. Testing Standards

Automated tests are a first-class deliverable, not an afterthought.

- Unit tests MUST cover all pure utility functions and data-transformation logic.
- Component tests MUST verify rendering under both success and error/loading states.
- Integration tests MUST cover the full data path from API fetch through to rendered
  output for each user-facing feature.
- Tests MUST be written before or alongside implementation (test-first preferred; tests
  written after implementation MUST be reviewed for coverage gaps).
- A failing test suite MUST block merge; no `--passWithNoTests` or skipped assertions
  without a documented reason in the PR.
- Test files MUST live adjacent to the code under test or in a parallel `__tests__` /
  `tests/` tree — never co-mingled with production source in ways that obscure coverage.

**Rationale**: High test coverage gives the team confidence to refactor and extend the
dashboard without regressions, which is critical when external API contracts may change.

### III. User Experience Consistency

The UI MUST present a coherent, predictable experience across all states and viewports.

- Visual language (typography, spacing, colour tokens) MUST be applied from a shared
  design system or Tailwind configuration — ad-hoc inline overrides are prohibited.
- Every data-driven view MUST implement all three states: loading, error, and populated.
  Skipping any state is a defect, not a design choice.
- Interactive elements MUST meet WCAG 2.1 AA contrast and keyboard-navigation
  requirements.
- New components MUST reuse existing primitives (e.g., `StatCard`, `CoinListItem`)
  before a new primitive is introduced. Duplication of UI patterns requires explicit
  justification.
- Responsive behaviour MUST be verified at mobile (375 px), tablet (768 px), and
  desktop (1280 px) breakpoints before a feature is considered complete.

**Rationale**: Users of a financial dashboard form strong mental models quickly.
Inconsistency erodes trust and increases the perceived risk of the data shown.

### IV. Performance Requirements

The dashboard MUST remain fast and respectful of external rate limits.

- Time-to-first-byte for server-rendered pages MUST be ≤ 500 ms under normal load.
- Largest Contentful Paint (LCP) MUST be ≤ 2.5 s on a simulated 4G connection.
- API data MUST be cached with a revalidation window of at least 60 seconds to respect
  CoinGecko Demo tier rate limits (10–30 calls/min); this value MUST NOT be reduced
  without explicit approval and a documented rate-limit impact assessment.
- Bundle size additions ≥ 50 kB (gzipped) MUST be reviewed and justified before merge.
- No synchronous blocking operations (heavy computation, file I/O) are permitted in
  Next.js route handlers or React render paths.

**Rationale**: A cryptocurrency dashboard is only useful if it loads quickly and stays
live. Performance regressions and rate-limit violations directly degrade the product's
core value proposition.

### V. Simplicity & Minimal Complexity

The simplest solution that meets the requirements MUST be preferred.

- YAGNI (You Aren't Gonna Need It): features, abstractions, and configuration options
  MUST NOT be added for hypothetical future requirements.
- The fixed coin list (Bitcoin, Ethereum, Dogecoin, Cardano, Solana) is a deliberate
  constraint; dynamic coin management MUST NOT be introduced unless explicitly requested.
- Third-party dependencies MUST be evaluated for necessity: if a utility can be written
  in ≤ 20 lines without sacrificing readability, the dependency SHOULD be avoided.
- Over-engineering (repository patterns, excessive DI frameworks, premature
  micro-frontends) requires a written justification in the PR description.

**Rationale**: This is a focused, single-purpose dashboard. Complexity that is not
demanded by requirements creates maintenance burden and violates Principles I and IV.

## Technology Standards

This section defines the non-negotiable technology choices for the project.

- **Runtime**: Node.js 20.9.0 or higher (LTS); version MUST be pinned in `.nvmrc` or
  `engines` field in `package.json`.
- **Framework**: Next.js (App Router) with server-side rendering enabled by default.
  Client components MUST only be introduced when interactivity requires them.
- **Language**: TypeScript in strict mode. `any` types are prohibited without a
  suppression comment explaining why the type cannot be known.
- **Styling**: Tailwind CSS utility classes. Custom CSS files are permitted only for
  animations or pseudo-selectors not achievable in Tailwind.
- **External API**: CoinGecko Demo API (free tier). All fetch logic MUST be isolated
  in a dedicated service layer; components MUST NOT call the API directly.
- **Testing**: Jest + React Testing Library for unit and component tests. Playwright
  for end-to-end tests if added in future.
- **Environment secrets**: All API keys MUST be stored in `.env` (git-ignored) and
  accessed exclusively via server-side code. Keys MUST NEVER be exposed to the browser.

## Development Workflow

Standard process for all code changes.

- All work MUST be done on a feature branch named `###-feature-name` (e.g.,
  `001-coin-detail-page`).
- Pull requests MUST reference the relevant spec or task ID and include a brief
  description of the change and test approach.
- The PR author MUST self-review the diff against the five Core Principles before
  requesting a review.
- CI MUST run lint, type-check, and the full test suite on every PR. A red CI build
  blocks merge with no exceptions.
- Merges to `main` MUST be squash-merged to keep history linear and readable.
- Deployments to production MUST only originate from `main` after CI passes.

## Governance

This constitution supersedes all other written or informal practices. Where a conflict
exists between this document and a README, PR comment, or verbal agreement, this
constitution takes precedence.

**Amendment procedure**:
1. Open a PR that edits this file.
2. Increment `CONSTITUTION_VERSION` per semantic versioning rules documented in the
   Sync Impact Report header of this file.
3. Update `LAST_AMENDED_DATE` to the date of merge.
4. Run the consistency propagation checklist (see `/speckit.constitution` command) and
   update any dependent templates or docs in the same PR.
5. Obtain approval from at least one other contributor before merging.

**Versioning policy**:
- MAJOR: Removal or redefinition of a principle, or a backward-incompatible governance change.
- MINOR: New principle or section added, or materially expanded guidance.
- PATCH: Clarifications, wording fixes, non-semantic refinements.

**Compliance review**: All PRs must be verified against the Core Principles by the
reviewer. Violations noted in review MUST be resolved, not waived, before merge.

**Version**: 1.0.0 | **Ratified**: 2026-03-10 | **Last Amended**: 2026-03-10
