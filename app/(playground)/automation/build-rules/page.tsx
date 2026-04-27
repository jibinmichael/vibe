"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { SquareChevronRight } from "lucide-react"
import {
  BUILD_RULES_DEFAULT_COMPOSER,
  BuildRulesWorkflowCanvas,
  RuleBuildAgentResponse,
  RULE_BUILD_ANIMATION_MS,
  type RuleCanvasPhase,
} from "@/components/automation/build-rules/BuildRulesWorkflowCanvas"
import { Chatbox } from "@/components/chat/Chatbox"
import { ThinkingIndicator } from "@/components/chat/ThinkingIndicator"
import { UserRow } from "@/components/chat/UserRow"
import { PlanWithVibeFab } from "@/components/fab/PlanWithVibeFab"

/** Matches automation page sidepanel timing. */
const SIDEPANEL_EASE = "cubic-bezier(0.34, 1.28, 0.64, 1)"
const SIDEPANEL_DURATION = "0.52s"

const DOT_GRID_STYLE: CSSProperties = {
  backgroundColor: "#f4f4f2",
  backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px)`,
  backgroundSize: "14px 14px",
}

export default function AutomationBuildRulesPage() {
  const [panelOpen, setPanelOpen] = useState(true)
  const [composerValue, setComposerValue] = useState(BUILD_RULES_DEFAULT_COMPOSER)
  const [userMessages, setUserMessages] = useState<string[]>([])
  const [ruleCanvasPhase, setRuleCanvasPhase] = useState<RuleCanvasPhase>("ghost")
  const [filterAccordionOpen, setFilterAccordionOpen] = useState(true)
  const ruleReadyTimerRef = useRef<number | undefined>(undefined)
  const ruleStreamRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (ruleReadyTimerRef.current !== undefined) {
        window.clearTimeout(ruleReadyTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (ruleCanvasPhase !== "ready" || userMessages.length === 0) return
    const el = ruleStreamRef.current
    if (!el) return
    const scroll = () => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    }
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(scroll)
    })
    const t = window.setTimeout(scroll, 150)
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      window.clearTimeout(t)
    }
  }, [ruleCanvasPhase, userMessages.length])

  const handleClose = () => {
    setPanelOpen(false)
    setComposerValue("")
  }

  const handleSend = (text: string) => {
    setUserMessages((prev) => [...prev, text])
    setRuleCanvasPhase("building")
    if (ruleReadyTimerRef.current !== undefined) {
      window.clearTimeout(ruleReadyTimerRef.current)
    }
    ruleReadyTimerRef.current = window.setTimeout(() => {
      setRuleCanvasPhase("ready")
      ruleReadyTimerRef.current = undefined
    }, RULE_BUILD_ANIMATION_MS)
  }

  return (
    <div
      className="automation-build-rules-page flex"
      style={{ minHeight: "100vh", background: "#FAFAF8" }}
    >
      <main
        className="automation-build-rules-main relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden"
        style={{
          minWidth: 0,
          minHeight: "100vh",
          paddingBottom: 120,
          paddingLeft: 40,
          paddingRight: panelOpen ? 420 : 40,
          transition: `padding-right ${SIDEPANEL_DURATION} ${SIDEPANEL_EASE}`,
        }}
      >
        <div className="pointer-events-none absolute inset-0" style={DOT_GRID_STYLE} aria-hidden />

        <BuildRulesWorkflowCanvas
          userMessagesLength={userMessages.length}
          ruleCanvasPhase={ruleCanvasPhase}
          filterAccordionOpen={filterAccordionOpen}
          onFilterToggle={() => setFilterAccordionOpen((o) => !o)}
        />
      </main>

      <aside
        className="automation-build-rules-sidepanel flex min-h-0 flex-col"
        aria-hidden={!panelOpen}
        aria-label="Build rules"
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
          className="automation-build-rules-sidepanel-head flex shrink-0 items-center justify-between"
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
              Build rules
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
          ref={ruleStreamRef}
          className="automation-build-rules-sidepanel-stream flex flex-1 flex-col"
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
          {userMessages.length > 0 && ruleCanvasPhase === "building" ? (
            <div style={{ padding: "16px 4px" }}>
              <ThinkingIndicator />
            </div>
          ) : null}
          {userMessages.length > 0 && ruleCanvasPhase === "ready" ? (
            <RuleBuildAgentResponse />
          ) : null}
        </div>

        <div
          className="automation-build-rules-sidepanel-composer-dock shrink-0"
          style={{ padding: "12px 16px 16px" }}
        >
          <Chatbox
            onSend={handleSend}
            rotatePlaceholder={false}
            value={composerValue}
            onValueChange={setComposerValue}
            chip={{
              label: "build a new rule",
              icon: (
                <SquareChevronRight
                  className="size-3.5 text-neutral-600"
                  aria-hidden
                  strokeWidth={2}
                />
              ),
            }}
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
