# Architecture Decisions

## ADR-001 — Task 0: Walking Skeleton Repo Structure
**Date**: 2026-11-13  
**Status**: Accepted  
**Context**: Task 0 requires setting up frontend/, backend/, and shared/ folders with separate staging deployments.

**Decision**:
- **Monorepo via npm workspaces** (not pnpm; pnpm not installed on dev machine).
- `frontend/` — Next.js 15 (App Router, React 19) handles user-facing pages and **imports** shared types. Deployed as a standalone Vercel project.
- `backend/` — Next.js 15 (App Router) handles **only** `/api/*` routes. Deployed as a separate Vercel project so each has an independent URL and deploy lifecycle.
- `shared/` — TypeScript types + Zod schemas. Published as a workspace package `@reportsaathi/shared` consumed by both frontend and backend.

**Consequences**:
- Two separate Vercel projects = two separate `VERCEL_PROJECT_ID` secrets in GitHub Actions.
- Backend URL must be injected into frontend at build time via `NEXT_PUBLIC_BACKEND_URL`.
- Both apps share the same repository and get a coordinated CI pipeline.

---

## ADR-002 — Database for Health Check (Walking Skeleton)
**Date**: 2026-11-13  
**Status**: Accepted  
**Context**: Task 0.3 requires the health endpoint to return "a value the backend read from the database." The architecture mandates zero persistent health-data storage (DPDP Act 2023).

**Decision**: Use Node.js built-in `node:sqlite` (available in Node ≥ 22.5) with an **in-memory** SQLite database seeded with immutable app config (app name, version, seeded timestamp). This is NOT used for user health data — it satisfies the walking skeleton DB-read requirement while remaining fully stateless and compliant.

**Consequences**:
- No external DB credentials needed in this phase.
- DB is re-seeded fresh on every serverless invocation (expected and correct).
- When future phases need persistent storage for non-health data (e.g., rate-limit counters), a decision will be recorded here.

---

## ADR-003 — Test Stack
**Date**: 2026-11-13  
**Status**: Accepted

- **Unit/component tests**: Vitest + React Testing Library (fast, ESM-native, works with Next.js).
- **E2E/smoke tests**: Playwright (required by Task 4.1).
- **Pre-commit**: Husky + lint-staged (ESLint + Prettier on changed files only).
- **Pre-push**: TypeScript strict check across all workspaces.

---

## ADR-004 — Zero External Fonts
**Date**: 2026-11-13  
**Status**: Accepted  
**Context**: NFR constraint — no external font loading.

**Decision**: `font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` declared in CSS; Tailwind configured with no Google Fonts import. Devanagari vowel matra rendering validated via `line-height: 1.6` (Tailwind `leading-devanagari` utility).
