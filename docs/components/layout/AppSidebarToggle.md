# AppSidebarToggle

Icon-only control that expands or collapses the sidebar and persists preference to `localStorage`.

**Domain:** layout
**File:** components/layout/AppSidebarToggle.tsx

---

## Purpose

AppSidebarToggle exposes the sidebar expand/collapse affordance in the chat top bar (and anywhere else you mount it) while delegating state to `SidebarProvider`. The control updates `aria-label` to reflect the action that will occur on click.

## When to use

- In headers or toolbars where users need quick access to sidebar width without reaching the sidebar edge.
- Pair with `ChatTopBar` for chat screens.

## When NOT to use

- When the sidebar is permanently hidden for a route—omit the toggle to avoid dead controls.
- For mobile drawer openers that need different visuals or gestures (design a dedicated control).

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|

## Example usage

```tsx
import { AppSidebarToggle } from "@/components/layout/AppSidebarToggle"

export function CustomHeader() {
  return (
    <header className="flex items-center gap-2 border-b px-4 py-2">
      <AppSidebarToggle />
      <span>Session</span>
    </header>
  )
}
```

## Gotchas

- Must render under `SidebarProvider` (via `AppShell`); otherwise `useSidebar` throws.
- Toggle only affects layout width; it does not persist chat draft content.

## Accessibility

- `aria-label` switches between “Collapse sidebar” and “Expand sidebar” based on state.
- Decorative SVG uses `aria-hidden="true"` so the label is the sole announcement.

## Related

- Components this composes: none (uses `useSidebar`)
- Components that use this: `ChatTopBar`
- Related docs: `docs/components/layout/AppShell.md`
