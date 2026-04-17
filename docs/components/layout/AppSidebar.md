# AppSidebar

Primary navigation rail with animated width, chat history rows, and account footer.

**Domain:** layout
**File:** components/layout/AppSidebar.tsx

---

## Purpose

AppSidebar provides persistent navigation and session context: branding, recent chats, and the signed-in user. Width animates between expanded and collapsed states driven by `useSidebar`, with labels fading via Motion for a compact collapsed mode.

## When to use

- Inside `AppShell` whenever the product should show the global sidebar.
- When you want the same sidebar behavior on every primary screen.

## When NOT to use

- Full-screen experiences that must hide navigation entirely (use a layout branch without the sidebar).
- Mobile-first layouts that need a drawer pattern instead of a fixed rail (this component is desktop-oriented).

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|

## Example usage

```tsx
import { AppShell } from "@/components/layout/AppShell"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
```

`AppSidebar` is rendered by `AppShell` automatically; you do not mount it directly on each page.

## Gotchas

- Row buttons are placeholders and do not navigate yet; wire them to real routes when chat history exists.
- Collapsed width hides label text via opacity but keeps DOM nodes—screen readers still encounter text unless you add visibility handling in a future iteration.
- The expand/collapse control lives **inside** the sidebar header row (chevron top-right when expanded, centered when collapsed). It replaces the old standalone `AppSidebarToggle` used from `ChatTopBar`, which has been removed.
- The rail is distinguished from the main pane with **`bg-muted/40`** only—no `border-r` or drop shadow.

## Accessibility

- Sidebar rows are native `<button>` elements for keyboard activation.
- Provide real navigation semantics when links replace static rows (e.g., `aria-current` for active chat).
- The sidebar toggle is a `<button>` with `aria-label` “Collapse sidebar” / “Expand sidebar” matching the next action.

## Related

- Components this composes: `Micro` (Typography), Motion primitives
- Components that use this: `AppShell`
- Related ADRs: `docs/adr/0002-shadcn-ui-radix-nova.md`
