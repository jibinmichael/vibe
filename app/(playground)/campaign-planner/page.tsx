"use client"

/**
 * Campaign Planner page — month calendar + Plan with Vibe FAB.
 *
 * Flow in the sidepanel:
 *   1. FAB click → thinking → greeting + scope choice
 *   2. Pick scope → user echo + thinking → objective choice
 *   3. Pick objective → user echo + thinking (next step hooks here)
 *
 * The main calendar pulses a subtle blue border on its cells whenever
 * a thinking indicator is active inside the sidepanel. This signals
 * the calendar is the canvas the AI is preparing to write to.
 */

import { useEffect, useRef, useState } from "react"
import type { AssistantBlock } from "@/components/chat/AssistantContent"
import { AssistantRow } from "@/components/chat/AssistantRow"
import { Chatbox, type ChatboxChip } from "@/components/chat/Chatbox"
import type { ChoiceOption } from "@/components/chat/ChoiceArtifact"
import { ThinkingIndicator } from "@/components/chat/ThinkingIndicator"
import { UserRow } from "@/components/chat/UserRow"
import { MonthCalendar, type CampaignPill } from "@/components/campaign/MonthCalendar"
import { PlanWithVibeFab } from "@/components/fab/PlanWithVibeFab"
import { getHolidayHints, getSegmentHints } from "@/data/calendar-hints"

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

/** Planned campaign pills aligned to holiday + opportunity dates for the visible month. */
function buildPlannedCampaignsForMonth(monthIndex: number): CampaignPill[] {
  const holidays = getHolidayHints(monthIndex)
  const segments = getSegmentHints(monthIndex)
  const byDate = new Map<number, CampaignPill[]>()

  const pushPill = (pill: CampaignPill) => {
    const list = byDate.get(pill.date) ?? []
    list.push(pill)
    byDate.set(pill.date, list)
  }

  holidays.forEach((h) => {
    const title = h.holidayName.replace(/\s+/g, " ").trim()
    pushPill({
      id: `plan-${h.id}`,
      date: h.date,
      title,
    })
  })

  segments.forEach((s) => {
    const plain = stripHtml(s.message)
    const title = plain.length > 48 ? `${plain.slice(0, 45)}…` : plain
    pushPill({
      id: `plan-${s.id}`,
      date: s.date,
      title,
    })
  })

  const days = [...byDate.keys()].sort((a, b) => a - b)
  const ordered: CampaignPill[] = []
  for (const d of days) {
    ordered.push(...(byDate.get(d) ?? []))
  }
  return ordered
}

type StreamItem =
  | { id: string; kind: "thinking" }
  | { id: string; kind: "user"; text: string }
  | { id: string; kind: "assistant"; blocks: AssistantBlock[] }

const SCOPE_OPTIONS: ChoiceOption[] = [
  { id: "day", label: "Plan for a specific day" },
  { id: "week", label: "Plan for a specific week" },
  { id: "month", label: "Plan for the entire month" },
]

const OBJECTIVE_OPTIONS: ChoiceOption[] = [
  { id: "awareness", label: "Awareness — reach more contacts with a new offer" },
  { id: "conversion", label: "Conversion — drive purchases or sign-ups" },
  { id: "retention", label: "Retention — re-engage lapsed customers" },
  { id: "support", label: "Support — proactive follow-ups and updates" },
]

const SCOPE_ECHO: Record<string, string> = {
  day: "Plan for a specific day",
  week: "Plan for a specific week",
  month: "Plan for the entire month",
}

const OBJECTIVE_ECHO: Record<string, string> = {
  awareness: "Awareness",
  conversion: "Conversion",
  retention: "Retention",
  support: "Support",
}

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const

/** Matches `SidePanelChat` so the planner panel slides in/out the same way. */
const SIDEPANEL_EASE = "cubic-bezier(0.34, 1.28, 0.64, 1)"
const SIDEPANEL_DURATION = "0.52s"

export default function CampaignPlannerPage() {
  const today = new Date()
  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth() // 0-indexed
  const todayDate = today.getDate()

  const [panelOpen, setPanelOpen] = useState(false)
  const [stream, setStream] = useState<StreamItem[]>([])
  const [selectedScope, setSelectedScope] = useState<string | undefined>(undefined)
  const [selectedObjective, setSelectedObjective] = useState<string | undefined>(undefined)
  const [composerValue, setComposerValue] = useState("")
  const [composerChip, setComposerChip] = useState<ChatboxChip | null>(null)
  const [visibleYear, setVisibleYear] = useState(todayYear)
  const [visibleMonth, setVisibleMonth] = useState(todayMonth)
  const [campaignsByMonth, setCampaignsByMonth] = useState<Record<string, CampaignPill[]>>({})

  const timersRef = useRef<number[]>([])

  const monthKey = `${visibleYear}-${String(visibleMonth).padStart(2, "0")}`
  const campaigns = campaignsByMonth[monthKey] ?? []

  const canGoBack =
    visibleYear > todayYear || (visibleYear === todayYear && visibleMonth > todayMonth)

  const handlePrevMonth = () => {
    if (!canGoBack) return
    if (visibleMonth === 0) {
      setVisibleMonth(11)
      setVisibleYear((y) => y - 1)
    } else {
      setVisibleMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (visibleMonth === 11) {
      setVisibleMonth(0)
      setVisibleYear((y) => y + 1)
    } else {
      setVisibleMonth((m) => m + 1)
    }
  }

  const visibleTodayDate =
    visibleYear === todayYear && visibleMonth === todayMonth ? todayDate : undefined

  // Derived: is there any active thinking indicator in the stream right now?
  const isThinking = stream.some((item) => item.kind === "thinking")
  const isScanning = isThinking && campaigns.length === 0

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
  }

  const handleFabClick = () => {
    if (campaigns.length > 0) {
      // Re-open without resetting anything — user is refining an existing plan
      setComposerChip(null)
      setPanelOpen(true)
      return
    }

    clearTimers()
    setComposerChip(null)
    setPanelOpen(true)
    setSelectedScope(undefined)
    setSelectedObjective(undefined)
    setComposerValue("")

    setStream([{ id: "think-1", kind: "thinking" }])

    const t1 = window.setTimeout(() => {
      setStream([
        {
          id: "assist-1",
          kind: "assistant",
          blocks: [
            {
              type: "lead",
              text: "Hi Jibin — I can help plan your April campaigns.",
            },
            {
              type: "p",
              text: "Tell me the scope you want to plan for and I'll suggest a draft schedule with templates and audiences.",
            },
            {
              type: "choice",
              title: "Planning scope",
              question: "What would you like me to plan for?",
              options: SCOPE_OPTIONS,
            },
          ],
        },
      ])
    }, 1400)
    timersRef.current.push(t1)
  }

  const handleScopePick = (opt: ChoiceOption) => {
    if (selectedScope !== undefined) return
    setSelectedScope(opt.id)

    setStream((prev) => [
      ...prev,
      {
        id: `user-scope-${opt.id}`,
        kind: "user",
        text: SCOPE_ECHO[opt.id] ?? opt.label,
      },
      { id: `think-scope-${opt.id}`, kind: "thinking" },
    ])

    const t = window.setTimeout(() => {
      setStream((prev) => {
        const withoutThinking = prev.filter((s) => s.id !== `think-scope-${opt.id}`)
        return [
          ...withoutThinking,
          {
            id: `assist-objective-${opt.id}`,
            kind: "assistant",
            blocks: [
              {
                type: "p",
                text: `Got it. Now what's the primary objective for this ${opt.id === "day" ? "day" : opt.id === "week" ? "week" : "month"}?`,
              },
              {
                type: "choice",
                title: "Objective",
                question: "Pick the goal that matters most.",
                options: OBJECTIVE_OPTIONS,
              },
            ],
          },
        ]
      })
    }, 1400)
    timersRef.current.push(t)
  }

  const handleObjectivePick = (opt: ChoiceOption) => {
    if (selectedObjective !== undefined) return
    setSelectedObjective(opt.id)

    setStream((prev) => [
      ...prev,
      {
        id: `user-objective-${opt.id}`,
        kind: "user",
        text: OBJECTIVE_ECHO[opt.id] ?? opt.label,
      },
      { id: `think-objective-${opt.id}`, kind: "thinking" },
    ])

    // After the calendar has been pulsing for a bit, drop in the
    // AI-generated campaign pills. The calendar pulse is 2.4s one-way,
    // 4.8s full cycle — wait a little past the halfway point so the
    // scan feels intentional before dates start filling.
    const t = window.setTimeout(() => {
      setCampaignsByMonth((prev) => ({
        ...prev,
        [monthKey]: buildPlannedCampaignsForMonth(visibleMonth),
      }))
    }, 3200)
    timersRef.current.push(t)
  }

  const handleCellClick = (date: number) => {
    clearTimers()
    setStream([])
    setSelectedScope(undefined)
    setSelectedObjective(undefined)
    setComposerValue("")
    setComposerChip({
      label: "Plan a campaign",
      plannerDate: {
        monthShort: MONTH_SHORT[visibleMonth] ?? "Jan",
        day: date,
      },
      onRemove: () => setComposerChip(null),
    })
    setPanelOpen(true)
  }

  const handleClose = () => {
    clearTimers()
    setPanelOpen(false)
    setStream([])
    setSelectedScope(undefined)
    setSelectedObjective(undefined)
    setComposerValue("")
    setComposerChip(null)
    // Campaigns stay on the calendar after the panel closes — they're the
    // result of the plan, not ephemeral state. The user can re-open the
    // panel via the FAB to refine.
    // Intentionally NOT clearing campaigns here.
  }

  useEffect(() => {
    return () => clearTimers()
  }, [])

  // Inject callbacks + selectedId into choice blocks by title matching
  const streamWithCallbacks: StreamItem[] = stream.map((item) => {
    if (item.kind !== "assistant") return item
    return {
      ...item,
      blocks: item.blocks.map((block) => {
        if (block.type !== "choice") return block
        if (block.title === "Planning scope") {
          return {
            ...block,
            onSelect: handleScopePick,
            ...(selectedScope !== undefined ? { selectedId: selectedScope } : {}),
          }
        }
        if (block.title === "Objective") {
          return {
            ...block,
            onSelect: handleObjectivePick,
            ...(selectedObjective !== undefined ? { selectedId: selectedObjective } : {}),
          }
        }
        return block
      }),
    }
  })

  return (
    <div
      className="campaign-planner-page flex"
      style={{ minHeight: "100vh", background: "#FAFAF8" }}
    >
      <main
        className="campaign-planner-main"
        style={{
          flex: 1,
          minWidth: 0,
          paddingTop: 32,
          paddingBottom: 120,
          paddingLeft: 40,
          paddingRight: panelOpen ? 420 : 40,
          transition: `padding-right ${SIDEPANEL_DURATION} ${SIDEPANEL_EASE}`,
        }}
      >
        <div
          className="campaign-planner-container"
          style={{
            maxWidth: 1200,
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <header className="campaign-planner-head flex flex-col" style={{ gap: 4 }}>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "rgba(0,0,0,0.88)",
                letterSpacing: "-0.01em",
              }}
            >
              Campaign planner
            </h1>
            <p style={{ fontSize: 12.5, color: "rgba(0,0,0,0.5)" }}>
              Monthly view of your WhatsApp campaigns
            </p>
          </header>

          <MonthCalendar
            year={visibleYear}
            month={visibleMonth}
            {...(visibleTodayDate !== undefined ? { todayDate: visibleTodayDate } : {})}
            scanning={isScanning}
            campaigns={campaigns}
            holidayHints={getHolidayHints(visibleMonth)}
            segmentHints={getSegmentHints(visibleMonth)}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            canGoBack={canGoBack}
            onCellClick={handleCellClick}
          />
        </div>
      </main>

      <PlannerSidePanel
        open={panelOpen}
        items={streamWithCallbacks}
        composerValue={composerValue}
        onComposerChange={setComposerValue}
        composerChip={composerChip}
        onClose={handleClose}
      />

      {campaigns.length > 0 ? (
        <PlanWithVibeFab
          onClick={() => {
            if (!panelOpen) setPanelOpen(true)
          }}
          label={`Added ${campaigns.length} campaigns`}
          status="done"
        />
      ) : (
        !panelOpen && <PlanWithVibeFab onClick={handleFabClick} />
      )}
    </div>
  )
}

/**
 * PlannerSidePanel — right-side chat panel for campaign planning.
 *
 * Auto-scrolls the stream to the bottom when items are added so new
 * thinking indicators or choice artifacts are always visible.
 */
function PlannerSidePanel({
  open,
  items,
  composerValue,
  onComposerChange,
  composerChip,
  onClose,
}: {
  open: boolean
  items: StreamItem[]
  composerValue: string
  onComposerChange: (v: string) => void
  composerChip: ChatboxChip | null
  onClose: () => void
}) {
  const streamRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!streamRef.current) return
    // Scroll to bottom whenever the items array changes
    streamRef.current.scrollTo({
      top: streamRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [items])

  return (
    <aside
      className="campaign-planner-sidepanel flex flex-col"
      aria-hidden={!open}
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
        minHeight: 0,
        transform: open ? "translate3d(0,0,0)" : "translate3d(100%,0,0)",
        transition: `transform ${SIDEPANEL_DURATION} ${SIDEPANEL_EASE}`,
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <header
        className="campaign-planner-sidepanel-head flex items-center justify-between"
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
        ref={streamRef}
        className="campaign-planner-sidepanel-stream flex-1"
        style={{
          overflowY: "auto",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          scrollBehavior: "smooth",
        }}
      >
        {items.map((item) =>
          item.kind === "thinking" ? (
            <div key={item.id} style={{ padding: "16px 4px" }}>
              <ThinkingIndicator />
            </div>
          ) : item.kind === "user" ? (
            <UserRow key={item.id} text={item.text} />
          ) : (
            <AssistantRow key={item.id} blocks={item.blocks} showFeedback={false} />
          ),
        )}
      </div>

      <div
        className="campaign-planner-sidepanel-composer-dock"
        style={{ padding: "12px 16px 16px" }}
      >
        <Chatbox
          onSend={(text) => alert(`Sent: ${text}`)}
          rotatePlaceholder={false}
          value={composerValue}
          onValueChange={onComposerChange}
          chip={composerChip}
        />
      </div>
    </aside>
  )
}
