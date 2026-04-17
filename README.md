# vibe

A Next.js 16 web application built with React 19, Tailwind CSS v4, and shadcn/ui.

## Prerequisites

- **Node.js 20 LTS** — check with `node -v`
- **pnpm 10+** — install with `npm install -g pnpm`, verify with `pnpm -v`
- **Git** — check with `git --version`

## Quickstart

```bash
git clone https://github.com/jibinmichael/vibe.git
cd vibe
pnpm install
cp .env.example .env.local
pnpm dev
```

Visit http://localhost:3000.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript without emitting files |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting without writing (used in CI) |

## Project structure

```
app/                  Next.js App Router pages, layouts, route handlers
components/
  ui/                 shadcn/ui primitives (never renamed, see CLAUDE.md §4)
  <domain>/           usecase-specific components (see CLAUDE.md §3)
  shared/             components used in 2+ domains
hooks/                Custom React hooks
lib/                  Utilities, shared non-React logic
types/                Shared TypeScript types
public/               Static assets
docs/                 Project documentation (Phase 9)
```

## Conventions

This project follows strict conventions documented in CLAUDE.md. All AI coding assistants (Cursor, Claude Code, etc.) read this file automatically on every session. Humans should read it too.

Key rules:
- Component names are usecase-based (`PricingPlanCard`, not `Card`)
- Never modify files in `components/ui/` (shadcn vendored code)
- Server Components by default; `"use client"` only when needed
- No secrets in the repo, ever
- Every change goes through a pull request — no direct commits to `main`

## Tooling

- **TypeScript** — strict mode, with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`
- **ESLint** — Next.js config
- **Prettier** — formatting, with Tailwind class sorting
- **Husky** — pre-commit runs lint-staged; commit-msg enforces Conventional Commits
- **GitHub Actions CI** — runs typecheck, lint, format check, and build on every PR. Required to pass before merge.

## Contributing

1. `git checkout main && git pull`
2. `git checkout -b <type>/<short-description>` (e.g. `feat/pricing-page`)
3. Make changes. Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, etc.)
4. `git push -u origin <branch-name>`
5. Open a pull request against `main`
6. CI must pass before merge is allowed
7. Squash and merge; delete the branch

## License

Private — all rights reserved.
