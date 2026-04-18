# ChatInput

The primary user-input component for composing messages to the assistant. One textarea plus a segmented mode toggle (Analyse | Plan | Generate) and a send button.

**Domain:** chat
**File:** components/chat/ChatInput.tsx

---

## Purpose

Captures a user's message plus the mode that tells the assistant how to respond (analyse existing content, produce a plan, or generate something new). The mode is always set — there is no "no mode" state — because this product is a task-typed assistant.

## When to use

- Wherever the user composes a new message to the assistant
- On the home page, as the primary affordance
- Inside an active conversation, pinned to the bottom

## When NOT to use

- For free-form text in non-chat contexts (comments, notes, form fields) — use a plain textarea or the shadcn `Textarea` primitive instead
- For single-line inputs (search, inline edit) — use `Input`

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onSend | (payload: { text: string; mode: ChatMode }) => void | Yes | — | Called when the user presses Enter or clicks Send |
| defaultMode | ChatMode | No | "analyse" | Which mode starts selected |
| placeholder | string | No | "Message vibe…" | Textarea placeholder |
| autoFocus | boolean | No | false | Focus textarea on mount |
| className | string | No | — | Escape hatch for container spacing |

`ChatMode` is `"analyse" | "plan" | "generate"`.

## Example usage

```tsx
import { ChatInput } from "@/components/chat/ChatInput"

export function HomePage() {
  return (
    <ChatInput
      autoFocus
      onSend={({ text, mode }) => {
        console.log("sending in mode", mode, text)
      }}
    />
  )
}
```

## Gotchas

- Autogrow calculates against a fixed 24px line-height constant. If typography tokens change body line-height, update `LINE_HEIGHT_PX` in ChatInput.tsx to match.
- Enter sends, Shift+Enter inserts a newline. IME composition (e.g. Japanese, Chinese input) is respected — Enter during composition does not trigger send.
- Send is disabled when the trimmed text is empty. The mode toggle remains interactive regardless.
- This is a Client Component ("use client") because it owns input state and keyboard handling.
- The component does NOT handle optimistic UI, loading state, or network errors — those are the parent's responsibility. Wrap the `onSend` callback with whatever async handling your app needs.

## Accessibility

- Textarea has an `aria-label` of "Message input".
- Mode toggle uses `role="radiogroup"` with each button as `role="radio"` and proper `aria-checked`. Keyboard users can Tab into the group.
- Send button has `aria-label="Send message"` and is properly disabled when there's no text.
- Focus state is visible via the container's ring — not just a color change.

## Related

- Typography: uses body-size (15px, 1.65 line-height) from the token scale
- Future: mention popup, slash command menu, model picker, file attachment chips, drag-and-drop — all are deferred PRs
- Future: a dedicated ChatInput wrapper that handles pending/loading states after send
