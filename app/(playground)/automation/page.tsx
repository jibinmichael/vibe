"use client"

import { useCallback, useMemo, useState, type CSSProperties } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BetweenHorizontalStart, ListTree, SquareChevronRight } from "lucide-react"
import { AssistantContent, type AssistantBlock } from "@/components/chat/AssistantContent"
import type { ChoiceOption } from "@/components/chat/ChoiceArtifact"
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

const BUILD_WITH_VIBE_CHOICE_OPTIONS: ChoiceOption[] = [
  { id: "rules", label: "Build rules — Do x when y happens" },
  { id: "chatbots", label: "Build Chatbots — Reply when customers message you" },
  { id: "sequences", label: "Create sequences — Send steps in order over time" },
]

/** Percent of cell width for value skeletons (10×8) — not full-bleed, read as text-length variety. */
const MY_AUTOMATION_SKELETON_VALUE_WIDTH_PCT: readonly number[][] = [
  [72, 45, 88, 40, 65, 52, 70, 48],
  [55, 90, 38, 68, 52, 44, 78, 62],
  [42, 60, 75, 45, 82, 55, 40, 88],
  [80, 50, 65, 72, 44, 65, 58, 45],
  [48, 78, 40, 92, 58, 50, 70, 55],
  [65, 42, 70, 55, 75, 60, 45, 82],
  [50, 85, 48, 38, 65, 72, 55, 40],
  [44, 58, 80, 62, 50, 45, 90, 68],
  [76, 40, 55, 88, 42, 60, 48, 75],
  [60, 68, 45, 50, 80, 55, 65, 42],
]

export default function AutomationPage() {
  const router = useRouter()
  const [panelOpen, setPanelOpen] = useState(false)
  const [composerValue, setComposerValue] = useState("")

  const handleAutomationKindSelect = useCallback(
    (opt: ChoiceOption) => {
      if (opt.id === "rules") router.push("/automation/build-rules")
      if (opt.id === "chatbots") router.push("/automation/chatbot-builder")
      if (opt.id === "sequences") router.push("/automation/sequences-builder")
    },
    [router],
  )

  const buildWithVibeBlocks: AssistantBlock[] = useMemo(
    () => [
      { type: "lead", text: "What kind of automation do you want to build?" },
      {
        type: "choice",
        title: "Automation",
        options: BUILD_WITH_VIBE_CHOICE_OPTIONS,
        onSelect: (opt) => {
          handleAutomationKindSelect(opt)
        },
      },
    ],
    [handleAutomationKindSelect],
  )

  const handleClose = () => {
    setPanelOpen(false)
    setComposerValue("")
  }

  return (
    <div className="automation-page flex" style={{ minHeight: "100vh", background: "#FAFAF8" }}>
      <main
        className="automation-main flex min-h-0 flex-1 flex-col"
        style={{
          minWidth: 0,
          minHeight: "100vh",
          paddingBottom: 120,
          paddingLeft: 40,
          paddingRight: panelOpen ? 420 : 40,
          transition: `padding-right ${SIDEPANEL_DURATION} ${SIDEPANEL_EASE}`,
        }}
      >
        <header className="automation-page-header flex shrink-0 items-center justify-between border-b border-black/10 py-4 pr-1">
          <nav aria-label="Breadcrumb" className="min-w-0">
            <span className="text-foreground text-[0.9375rem] leading-[var(--text-body--line-height)] font-semibold">
              Automation
            </span>
          </nav>
          {!panelOpen ? (
            <PlanWithVibeFab
              label="Build with Vibe"
              layout="inline"
              compact
              onClick={() => setPanelOpen(true)}
            />
          ) : null}
        </header>

        <div
          className="automation-build-section w-full shrink-0 pt-4"
          style={{ background: "transparent" }}
        >
          <p
            className="text-left"
            style={{ fontSize: 11, color: "rgba(0,0,0,0.45)", marginBottom: 10 }}
          >
            Build automations
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-start">
            {AUTOMATION_BUILD_CARDS.map((card, i) => {
              const cardStyle: CSSProperties = {
                display: "flex",
                alignItems: "center",
                minHeight: 72,
                width: 220,
                maxWidth: 220,
                flex: "0 0 auto",
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

        <div
          className="automation-my-section w-full shrink-0 pt-8"
          style={{ background: "transparent" }}
        >
          <p
            className="text-left"
            style={{ fontSize: 11, color: "rgba(0,0,0,0.45)", marginBottom: 10 }}
          >
            My automation
          </p>
          <div className="w-full overflow-hidden rounded-md border border-black/12 bg-white">
            <table className="w-full border-collapse text-left" aria-label="My automation">
              <thead>
                <tr>
                  {[
                    "Name",
                    "Type",
                    "Status",
                    "Last updated",
                    "Owner",
                    "Runs",
                    "Channel",
                    "Created",
                  ].map((h) => (
                    <th
                      key={h}
                      className="border border-black/12 bg-white px-2.5 py-2"
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "rgba(0,0,0,0.5)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }, (_, row) => (
                  <tr key={`automation-skeleton-${row}`}>
                    {Array.from({ length: 8 }, (_, col) => {
                      const pct = MY_AUTOMATION_SKELETON_VALUE_WIDTH_PCT[row]![col]!
                      return (
                        <td
                          key={col}
                          className="border border-black/12 bg-white px-2.5 py-2 align-middle"
                        >
                          <div
                            className="h-3.5 max-w-full min-w-0 animate-pulse rounded-sm bg-black/[0.06]"
                            style={{ width: `${pct}%` }}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
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
            padding: "20px 20px 12px",
          }}
        >
          {panelOpen ? <AssistantContent blocks={buildWithVibeBlocks} /> : null}
        </div>

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
    </div>
  )
}

function openPanelTransform(open: boolean) {
  return open ? "translate3d(0,0,0)" : "translate3d(100%,0,0)"
}
