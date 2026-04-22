"use client"

import { useState, type CSSProperties } from "react"
import Link from "next/link"
import { BetweenHorizontalStart, ListTree, SquareChevronRight } from "lucide-react"
import { Chatbox } from "@/components/chat/Chatbox"
import { PlanWithVibeFab } from "@/components/fab/PlanWithVibeFab"

/** Matches `PlannerSidePanel` / campaign planner so the panel slides the same way. */
const SIDEPANEL_EASE = "cubic-bezier(0.34, 1.28, 0.64, 1)"
const SIDEPANEL_DURATION = "0.52s"

const AUTOMATION_BUILD_CARDS: { title: string; subtitle: string }[] = [
  { title: "Build rules", subtitle: "Do x when y happens" },
  { title: "Build Chatbots", subtitle: "Reply when customers message you" },
  { title: "Create sequences", subtitle: "Send steps in order over time" },
]

export default function AutomationPage() {
  const [panelOpen, setPanelOpen] = useState(false)
  const [composerValue, setComposerValue] = useState("")

  const handleClose = () => {
    setPanelOpen(false)
    setComposerValue("")
  }

  return (
    <div className="automation-page flex" style={{ minHeight: "100vh", background: "#FAFAF8" }}>
      <main
        className="automation-main flex flex-1 items-center justify-center"
        style={{
          minWidth: 0,
          minHeight: "100vh",
          paddingBottom: 120,
          paddingLeft: 40,
          paddingRight: panelOpen ? 420 : 40,
          transition: `padding-right ${SIDEPANEL_DURATION} ${SIDEPANEL_EASE}`,
        }}
      >
        <div
          className="automation-build-section w-[440px] max-w-full"
          style={{ background: "transparent" }}
        >
          <p
            className="text-center"
            style={{ fontSize: 11, color: "rgba(0,0,0,0.45)", marginBottom: 10 }}
          >
            Build automations
          </p>
          <div className="flex flex-col gap-3">
            {AUTOMATION_BUILD_CARDS.map((card, i) => {
              const cardStyle: CSSProperties = {
                display: "flex",
                alignItems: "center",
                height: 72,
                paddingLeft: 16,
                paddingRight: 16,
                borderRadius: "8px",
                background: "#fff",
              }
              const inner = (
                <>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gray-100">
                    {i === 0 ? (
                      <SquareChevronRight
                        className="size-5 text-neutral-600"
                        aria-hidden
                        strokeWidth={2}
                      />
                    ) : i === 1 ? (
                      <ListTree className="size-5 text-neutral-600" aria-hidden strokeWidth={2} />
                    ) : i === 2 ? (
                      <BetweenHorizontalStart
                        className="size-5 text-neutral-600"
                        aria-hidden
                        strokeWidth={2}
                      />
                    ) : null}
                  </div>
                  <div className="ml-3 flex min-w-0 flex-col gap-0.5">
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "rgba(0,0,0,0.88)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {card.title}
                    </span>
                    <span style={{ fontSize: 11, color: "rgba(0,0,0,0.45)", lineHeight: 1.35 }}>
                      {card.subtitle}
                    </span>
                  </div>
                </>
              )
              return i === 0 ? (
                <Link
                  key={i}
                  href="/automation/build-rules"
                  className="block cursor-pointer text-inherit no-underline outline-none"
                  style={cardStyle}
                >
                  {inner}
                </Link>
              ) : i === 1 ? (
                <Link
                  key={i}
                  href="/automation/chatbot-builder"
                  className="block cursor-pointer text-inherit no-underline outline-none"
                  style={cardStyle}
                >
                  {inner}
                </Link>
              ) : i === 2 ? (
                <Link
                  key={i}
                  href="/automation/sequences-builder"
                  className="block cursor-pointer text-inherit no-underline outline-none"
                  style={cardStyle}
                >
                  {inner}
                </Link>
              ) : (
                <div key={i} style={cardStyle}>
                  {inner}
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <aside
        className="automation-sidepanel flex min-h-0 flex-col"
        aria-hidden={!panelOpen}
        aria-label="Plan with Vibe"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          zIndex: 40,
          background: "#fff",
          borderLeft: "1px solid rgba(0,0,0,0.06)",
          transform: openPanelTransform(panelOpen),
          transition: `transform ${SIDEPANEL_DURATION} ${SIDEPANEL_EASE}`,
          pointerEvents: panelOpen ? "auto" : "none",
        }}
      >
        <header
          className="automation-sidepanel-head flex shrink-0 items-center justify-between"
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
              Plan with Vibe
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
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
          className="automation-sidepanel-stream flex-1"
          style={{
            overflowY: "auto",
            minHeight: 0,
          }}
        />

        <div
          className="automation-sidepanel-composer-dock shrink-0"
          style={{ padding: "12px 16px 16px" }}
        >
          <Chatbox
            onSend={(text) => alert(`Sent: ${text}`)}
            rotatePlaceholder={false}
            value={composerValue}
            onValueChange={setComposerValue}
          />
        </div>
      </aside>

      {!panelOpen && (
        <PlanWithVibeFab label="Build Automations with Vibe" onClick={() => setPanelOpen(true)} />
      )}
    </div>
  )
}

function openPanelTransform(open: boolean) {
  return open ? "translate3d(0,0,0)" : "translate3d(100%,0,0)"
}
