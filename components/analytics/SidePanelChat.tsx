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

import { Chatbox, type ChatboxChip } from "@/components/chat/Chatbox"

const SIDEPANEL_EASE = "cubic-bezier(0.34, 1.28, 0.64, 1)"
const SIDEPANEL_DURATION = "0.52s"

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
      className="sidepanel-chat flex flex-col"
      aria-hidden={!open}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 420,
        zIndex: 40,
        background: "#fff",
        borderLeft: "1px solid rgba(0,0,0,0.06)",
        minHeight: 0,
        transform: open ? "translate3d(0,0,0)" : "translate3d(100%,0,0)",
        transition: `transform ${SIDEPANEL_DURATION} ${SIDEPANEL_EASE}`,
        pointerEvents: open ? "auto" : "none",
      }}
      aria-label="Ask vibe"
    >
      <header
        className="sidepanel-chat-head flex items-center justify-between"
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="sidepanel-chat-title flex items-center" style={{ gap: 10 }}>
          <span
            className="sidepanel-chat-halo"
            aria-hidden="true"
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background:
                "conic-gradient(from 0deg, rgba(10,132,255,0.35), rgba(90,170,255,0.2), rgba(191,216,245,0.3), rgba(10,132,255,0.35))",
              filter: "blur(3px)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(0,0,0,0.85)",
            }}
          >
            Ask vibe
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          style={{
            border: "none",
            background: "transparent",
            width: 28,
            height: 28,
            borderRadius: 6,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "rgba(0,0,0,0.5)",
            fontSize: 14,
          }}
        >
          ×
        </button>
      </header>

      <div
        className="sidepanel-chat-stream min-h-0 flex-1"
        style={{
          overflowY: "auto",
          padding: "40px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontSize: 12.5,
            color: "rgba(0,0,0,0.4)",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Send your question to start
        </p>
      </div>

      <div className="sidepanel-chat-composer-dock shrink-0" style={{ padding: "12px 16px 16px" }}>
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
