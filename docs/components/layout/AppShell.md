# AppShell

Root layout wrapper that pins the sidebar and main content to the viewport and wires sidebar state for the whole app.

**Domain:** layout
**File:** components/layout/AppShell.tsx

---

## Purpose

AppShell is the outer chrome for every route: it mounts `SidebarProvider`, renders the fixed-width animated `AppSidebar`, and places routed page content in a flex column that fills the remaining width. Without it, pages would not share the sidebar or consistent full-height behavior.

## When to use

- Wrap all authenticated or primary app routes from `app/layout.tsx` so every screen shares the same shell.
- When you need the sidebar + main split to persist across navigations.

## When NOT to use

- Marketing or legal pages that intentionally drop the product chrome (use a separate layout group without `AppShell`).
- Embedded widgets or print-only routes where the sidebar should not appear.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|

## Example usage

```tsx
// app/layout.tsx
import { AppShell } from "@/components/layout/AppShell"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
```

## Gotchas

- `AppShell` is a client component because it depends on `SidebarProvider`; keep heavy server-only logic in child pages, not inside the shell itself.
- The shell uses `h-screen` and `overflow-hidden`; long pages must scroll inside `main` children, not on `body`.

## Accessibility

- Landmark structure: `AppSidebar` renders an `<aside>`; `main` wraps primary content—avoid nesting another `<main>` inside children.
- Ensure routed pages expose a single logical `<h1>` for the active view.

## Related

- Components this composes: `SidebarProvider`, `AppSidebar`
- Components that use this: root `layout.tsx`
- Related ADRs: `docs/adr/0001-nextjs-app-router.md`
