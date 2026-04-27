"use client"

/**
 * SidePanelChat — a 420px right-side panel chat interface for analytics
 * pages. Header with AiPulse halo + "Ask vibe" + close button. Empty
 * stream with placeholder copy until the user sends. Composer at bottom
 * with chip + prefilled prompt.
 *
 * This is a NEW chat surface, intentionally distinct from the in-page
 * /conversation flow. Keeps the dashboard focused while allowing the user
 * to drill into any data point.
 */

import {
  AUTOMATION_SIDEPANEL_DURATION,
  AUTOMATION_SIDEPANEL_EASE,
} from "@/components/automation/automationShared"
import { Chatbox, type ChatboxChip } from "@/components/chat/Chatbox"

type SidePanelChatProps = {
  open: boolean
  chip: ChatboxChip | null
  prefill: string
  onClose: () => void
  onPrefillChange: (value: string) => void
}

export function SidePanelChat({
  open,
  chip,
  prefill,
  onClose,
  onPrefillChange,
}: SidePanelChatProps) {
  return (
    <aside
      className="sidepanel-chat chat-surface border-border bg-background text-foreground flex flex-col border-l antialiased"
      aria-hidden={!open}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 420,
        zIndex: 40,
        minHeight: 0,
        transform: open ? "translate3d(0,0,0)" : "translate3d(100%,0,0)",
        transition: `transform ${AUTOMATION_SIDEPANEL_DURATION} ${AUTOMATION_SIDEPANEL_EASE}`,
        pointerEvents: open ? "auto" : "none",
      }}
      aria-label="Ask vibe"
    >
      <header className="sidepanel-chat-head border-border flex items-center justify-between border-b px-5 py-4">
        <div className="sidepanel-chat-title flex items-center gap-2.5">
          <span
            className="sidepanel-chat-halo inline-block size-[22px] shrink-0 rounded-full"
            aria-hidden="true"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(10,132,255,0.35), rgba(90,170,255,0.2), rgba(191,216,245,0.3), rgba(10,132,255,0.35))",
              filter: "blur(3px)",
            }}
          />
          <span className="text-foreground text-[length:var(--text-chat)] leading-[var(--text-chat--line-height)] font-semibold">
            Ask vibe
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-[length:var(--text-chat)] leading-none transition-colors"
        >
          ×
        </button>
      </header>

      <div className="sidepanel-chat-stream flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-5 py-10">
        <p className="text-muted-foreground text-center text-[length:var(--text-chat)] leading-[var(--text-chat--line-height)]">
          Send your question to start
        </p>
      </div>

      <div className="sidepanel-chat-composer-dock shrink-0 px-4 pt-3 pb-4">
        <Chatbox
          onSend={(text) => alert(`Sent: ${text}`)}
          rotatePlaceholder={false}
          value={prefill}
          onValueChange={onPrefillChange}
          chip={chip}
        />
      </div>
    </aside>
  )
}
