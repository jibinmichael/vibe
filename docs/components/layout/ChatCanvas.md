# ChatCanvas

Sliding auxiliary panel beside chat content with enter/exit animations and optional body slot.

**Domain:** layout
**File:** components/layout/ChatCanvas.tsx

---

## Purpose

ChatCanvas hosts secondary material (notes, previews, tools) next to the chat transcript. It animates width with a spring, dims on exit, and ships with a neutral placeholder when no children are provided. `WithCanvasOffset` nudges the chat column horizontally while the canvas is open for a subtle depth cue.

## When to use

- On chat routes when users can open a right-hand canvas without leaving the conversation.
- When auxiliary UI should feel attached to the chat session rather than a separate page.

## When NOT to use

- For modal dialogs that must block the entire viewport—use a dialog primitive instead.
- For permanent three-pane layouts where the right column never hides—consider static grid layout without `AnimatePresence`.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|

## Example usage

```tsx
import { useState } from "react"
import { ChatCanvas, WithCanvasOffset } from "@/components/layout/ChatCanvas"

export function Example() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex min-h-0 flex-1">
      <WithCanvasOffset canvasOpen={open}>
        <div className="flex-1">{/* chat */}</div>
      </WithCanvasOffset>
      <ChatCanvas open={open} onClose={() => setOpen(false)}>
        <p className="text-sm text-muted-foreground">Scratch notes</p>
      </ChatCanvas>
    </div>
  )
}
```

## Gotchas

- Width animates to `42%` of the parent flex row; parent must be a horizontal flex with `min-h-0` to avoid overflow bugs.
- `WithCanvasOffset` applies a small negative `x` translation; ensure it does not clip focus rings—add padding if necessary when adding interactive children.

## Accessibility

- Close control includes `aria-label="Close canvas"`.
- When open, consider moving focus into the canvas on open and restoring focus to the toggle on close in a future enhancement.

## Related

- Components this composes: Motion `AnimatePresence`, `motion.aside`, `motion.div`
- Components that use this: `app/c/[id]/page.tsx`
- Related docs: `docs/components/layout/ChatTopBar.md`
