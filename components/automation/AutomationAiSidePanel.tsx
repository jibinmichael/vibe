"use client"

import { Chatbox, type ChatboxChip } from "@/components/chat/Chatbox"
import { ThinkingIndicator } from "@/components/chat/ThinkingIndicator"
import { UserRow } from "@/components/chat/UserRow"
import {
  AUTOMATION_SIDEPANEL_DURATION,
  AUTOMATION_SIDEPANEL_EASE,
  automationOpenPanelTransform,
} from "@/components/automation/automationShared"

type AutomationAiSidePanelProps = {
  title: string
  ariaLabel: string
  panelOpen: boolean
  onClose: () => void
  userMessages: string[]
  composerValue: string
  onComposerChange: (v: string) => void
  onSend: (text: string) => void
  chip: ChatboxChip
  /** Extra class on aside for page-specific styling hooks */
  className?: string
}

/**
 * Shared right-side AI chat rail for automation builder playgrounds.
 * Matches build-rules / campaign planner panel chrome.
 */
export function AutomationAiSidePanel({
  title,
  ariaLabel,
  panelOpen,
  onClose,
  userMessages,
  composerValue,
  onComposerChange,
  onSend,
  chip,
  className = "",
}: AutomationAiSidePanelProps) {
  return (
    <aside
      className={`flex min-h-0 flex-col ${className}`}
      aria-hidden={!panelOpen}
      aria-label={ariaLabel}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 420,
        zIndex: 40,
        background: "#fff",
        borderLeft: "1px solid rgba(0,0,0,0.06)",
        transform: automationOpenPanelTransform(panelOpen),
        transition: `transform ${AUTOMATION_SIDEPANEL_DURATION} ${AUTOMATION_SIDEPANEL_EASE}`,
        pointerEvents: panelOpen ? "auto" : "none",
      }}
    >
      <header
        className="flex shrink-0 items-center justify-between"
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center" style={{ gap: 10 }}>
          <span
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
            {title}
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
        className="flex flex-1 flex-col"
        style={{
          overflowY: "auto",
          minHeight: 0,
          padding: "20px 16px",
          scrollBehavior: "smooth",
        }}
      >
        {userMessages.map((text, i) => (
          <UserRow key={`${i}-${text}`} text={text} />
        ))}
        {userMessages.length > 0 ? (
          <div style={{ padding: "16px 4px" }}>
            <ThinkingIndicator />
          </div>
        ) : null}
      </div>

      <div className="shrink-0" style={{ padding: "12px 16px 16px" }}>
        <Chatbox
          onSend={onSend}
          rotatePlaceholder={false}
          value={composerValue}
          onValueChange={onComposerChange}
          chip={chip}
        />
      </div>
    </aside>
  )
}
