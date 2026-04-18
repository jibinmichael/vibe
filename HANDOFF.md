# vibe — handoff (real vs placeholder)

This doc is for backend and frontend engineers integrating real product behavior. The UI scaffold is intentionally client-only until APIs exist.

## Routes

| Route | What’s real | Placeholder |
| ----- | ----------- | ----------- |
| `/` (home) | Centered [`Chatbox`](./components/chat/Chatbox.tsx); `onSend` navigates to `/c/[id]?initial=…` | No persistence, no thread list |
| `/c/[id]` | Scrollable transcript, pinned [`Chatbox`](./components/chat/Chatbox.tsx), optional canvas aside when `?canvas=open`, [`ThinkingIndicator`](./components/chat/ThinkingIndicator.tsx) after last user bubble | Messages are React state only (lost on reload). No streaming, no assistant replies |
| Canvas aside | Animated width (`springEnter` / `easeExit`) | Empty `<aside>` — no embedded app yet |

## Components

### `Chatbox`

**Real:** Autogrowing textarea (max height), rotating placeholders + Tab-to-fill suggestions, fake mic/stop (“recording”), Send on Enter / button, Skills button chrome, optional `disabled` prop (chat page disables while “thinking”).  
**Placeholder:** No speech-to-text; mic toggles UI state only. Skills does nothing. Sending only runs `onSend(text)` — home page navigates; chat page appends a user message.

### `ThinkingIndicator`

**Real:** Five emotional phases driven by elapsed time thresholds, rotating copy pools, blink animation on static eyes, “Generating dashboard” card with [`formatElapsed`](./components/chat/ThinkingIndicator.tsx) timer.  
**Placeholder:** Represents “assistant working” visually only — not tied to a job ID, SSE, or server progress.

### Motion / CSS

[`lib/motion.ts`](./lib/motion.ts) exports transitions for layout animation. [`app/globals.css`](./app/globals.css) defines `@keyframes vibeStopDot` for the recording Stop pill dots.

## What backend should build next

- Auth/session (if multi-user).
- Threads + messages persistence; id generation aligned with URLs if desired.
- Assistant completions (streaming), tool use, cancellation.
- Optional: voice pipeline if mic becomes real.

## What frontend should build next

- Wire `Chatbox` submit to API; render assistant tokens/messages from server state.
- Replace fake “thinking” with real loading/streaming signals from backend.
- Canvas panel: embed real widgets or iframe when backend provides artifact URLs.
- Remove or gate demo timers when prod behavior ships.
