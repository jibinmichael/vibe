# vibe — engineering handoff

**Status:** Component-only scope. Single-page playground at `/` showing every production-ready component in isolated states.

## What exists

Every component is standalone, installable, and stateless unless noted. Engineers compose their own pages.

### Components

- **`components/chat/Chatbox.tsx`** — textarea with autogrow, rotating placeholders, tab-to-fill suggestions, mic with Stop pill animation, Skills button, send button. Props: `onSend`, `value`, `onValueChange`, `disabled`, `rotatePlaceholder`.
- **`components/chat/ThinkingIndicator.tsx`** — 5-state emotional animation (focused → curious → working → playful → patient) over 45 seconds with 40 rotating copy lines. Props: `completed?: boolean`. Currently commented out in the playground but importable anywhere.
- **`components/layout/AppShell.tsx`** — sidebar + main content shell. Used by `app/layout.tsx`.
- **`components/layout/AppSidebar.tsx`** — collapsible sidebar, 220 ↔ 56px, persists state via localStorage.
- **`components/ui/*`** — shadcn/ui primitives.

### Infrastructure

- Next.js 16.2 App Router + Turbopack
- React 19, TypeScript strict
- Tailwind v4 (CSS config in `app/globals.css`)
- CI (typecheck, lint, format, build) on every PR
- Husky + commitlint (conventional commits required)
- pnpm 10, Node 20 LTS

### Home page

`/app/page.tsx` is the component playground. Dropdown switches between Chatbox states. No routing, no shared state, no context. Extensible via the STATES array.

## What was removed from earlier iterations

- Chat route at `/c/[id]`
- Canvas panel and auto-open logic
- Inline chart (CampaignChart) + Pinpoint drill-down menu — stashed in git reflog, recoverable if needed
- Artifact shelf badge — same
- Message rendering (MessageBubble, UserMessage, AssistantMessage)
- Streaming and thinking state machines
- Custom useChatState hook

If engineers want any of those back, they can be restored from the stash `broken-refactor-2026-04-18` or rebuilt cleanly.

## Next steps for engineers

1. Decide routing model — likely `/`, `/c/[id]` for chats, and a sidebar-driven chat list
2. Build API route for chat streaming
3. Build conversation persistence
4. Wire Chatbox's `onSend` to the real chat backend
5. Add `AssistantMessage` and `UserMessage` components as they make sense in your component library
6. Restore chart + Pinpoint interaction when ready (reference commit 1fce7b5's stashed content)

## Key decisions preserved

- `docs/adr/0001-nextjs-app-router.md` — App Router over Pages Router
- `docs/adr/0002-shadcn-radix-nova.md` — shadcn/ui + Radix
- `docs/adr/0003-tailwind-v4.md` — Tailwind v4
- `CLAUDE.md` — AI assistant rules for this repo

## Getting started

```bash
pnpm install
pnpm dev
```

Visit `/`. You see the playground.
