# ChatTopBar

Sticky header for chat views with sidebar toggle, conversation title, and canvas toggle.

**Domain:** layout
**File:** components/layout/ChatTopBar.tsx

---

## Purpose

ChatTopBar anchors the chat workspace: it surfaces the active conversation title, exposes the sidebar control, and opens the auxiliary canvas panel. A short Motion entrance animation makes the bar feel anchored without slowing interaction.

## When to use

- At the top of `/c/[id]` (or any chat route) above transcript and composer regions.
- Whenever a chat screen needs consistent global actions beside the title.

## When NOT to use

- On the marketing home page where no conversation title exists—use a simpler header or none.
- For modal chat widgets embedded elsewhere; this bar assumes full-width shell layout.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|

## Example usage

```tsx
import { useState } from "react"
import { ChatTopBar } from "@/components/layout/ChatTopBar"

export function ChatScreen() {
  const [canvasOpen, setCanvasOpen] = useState(false)
  return (
    <>
      <ChatTopBar title="Design review" onToggleCanvas={() => setCanvasOpen((v) => !v)} />
      {/* transcript + canvas */}
    </>
  )
}
```

## Gotchas

- `title` is plain text today; rich titles (avatars, status) belong in a future composition layer.
- Canvas toggle only fires the callback; parent must own `canvasOpen` state and render `ChatCanvas`.

## Accessibility

- Canvas control is a `<button>` with `aria-label="Toggle canvas"`.
- Title text should remain concise; pair with document `<title>` updates at the page level when routing.

## Related

- Components this composes: `AppSidebarToggle`, Motion primitives
- Components that use this: `app/c/[id]/page.tsx`
- Related docs: `docs/components/layout/ChatCanvas.md`
