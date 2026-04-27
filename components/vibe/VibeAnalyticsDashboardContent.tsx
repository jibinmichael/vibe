"use client"

import { useState, type CSSProperties } from "react"

import {
  AUTOMATION_SIDEPANEL_DURATION,
  AUTOMATION_SIDEPANEL_EASE,
} from "@/components/automation/automationShared"
import { Chatbox } from "@/components/chat/Chatbox"
import { PlanWithVibeFab } from "@/components/fab/PlanWithVibeFab"
import { cn } from "@/lib/utils"

const SIDEPANEL_EASE = AUTOMATION_SIDEPANEL_EASE
const SIDEPANEL_DURATION = AUTOMATION_SIDEPANEL_DURATION

export type VibeAnalyticsDashboardContentProps = {
  title: string
}

function SkeletonBar({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-black/[0.06]", className)}
      style={style}
      aria-hidden
    />
  )
}

function sidePanelTransform(open: boolean) {
  return open ? "translate3d(0,0,0)" : "translate3d(100%,0,0)"
}

export function VibeAnalyticsDashboardContent({ title }: VibeAnalyticsDashboardContentProps) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [composerValue, setComposerValue] = useState("")

  const handleClosePanel = () => {
    setPanelOpen(false)
    setComposerValue("")
  }

  return (
    <div
      className="automation-page chat-surface text-foreground relative flex min-h-0 flex-1 flex-col antialiased"
      style={{ background: "#FAFAF8", minHeight: "100%" }}
    >
      <main
        className="flex min-h-0 flex-1 flex-col"
        style={{
          minWidth: 0,
          paddingBottom: 120,
          paddingLeft: 40,
          paddingRight: panelOpen ? 420 : 40,
          transition: `padding-right ${SIDEPANEL_DURATION} ${SIDEPANEL_EASE}`,
        }}
      >
        <header className="automation-page-header border-border flex shrink-0 items-center justify-between border-b py-4 pr-1">
          <nav aria-label="Breadcrumb" className="min-w-0">
            <span className="text-foreground text-[length:var(--text-chat)] leading-[var(--text-chat--line-height)] font-semibold">
              {title}
            </span>
          </nav>
          {!panelOpen ? (
            <PlanWithVibeFab
              label="Ask Vibe"
              layout="inline"
              compact
              onClick={() => setPanelOpen(true)}
            />
          ) : null}
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-6 pt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={`kpi-${i}`}
                className="border-border bg-card rounded-lg border p-4 shadow-sm"
              >
                <SkeletonBar className="mb-3 h-3 w-[45%]" />
                <SkeletonBar className="h-8 w-[72%]" />
                <SkeletonBar className="mt-3 h-2.5 w-[35%]" />
              </div>
            ))}
          </div>

          <div className="border-border bg-card rounded-lg border p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <SkeletonBar className="h-4 w-40" />
              <SkeletonBar className="h-8 w-28 rounded-full" />
            </div>
            <SkeletonBar className="h-[220px] w-full max-w-full" />
            <div className="mt-4 flex gap-4">
              <SkeletonBar className="h-2.5 w-24" />
              <SkeletonBar className="h-2.5 w-24" />
              <SkeletonBar className="h-2.5 w-24" />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="border-border bg-card rounded-lg border p-4 shadow-sm">
              <SkeletonBar className="mb-4 h-4 w-32" />
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={`bar-${i}`} className="flex items-center gap-3">
                    <SkeletonBar className="h-3 w-8 shrink-0" />
                    <SkeletonBar className="h-6 flex-1" />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-border bg-card rounded-lg border p-4 shadow-sm">
              <SkeletonBar className="mb-4 h-4 w-36" />
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 15 }, (_, i) => (
                  <SkeletonBar key={`heat-${i}`} className="aspect-square rounded-sm" />
                ))}
              </div>
            </div>
          </div>

          <div className="border-border bg-card rounded-lg border shadow-sm">
            <div className="border-border border-b px-4 py-3">
              <SkeletonBar className="h-4 w-48" />
            </div>
            <div className="overflow-hidden px-4 py-3">
              <table
                className="w-full border-collapse text-left"
                aria-label={`${title} placeholder data`}
              >
                <thead>
                  <tr>
                    {["Dimension", "Metric", "Δ", "Period"].map((h) => (
                      <th key={h} className="pr-4 pb-3">
                        <SkeletonBar className="h-3 w-20" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }, (_, row) => (
                    <tr key={`row-${row}`}>
                      {Array.from({ length: 4 }, (_, col) => (
                        <td key={col} className="border-border border-t py-3 pr-4 align-middle">
                          <SkeletonBar
                            className="h-3"
                            style={{ width: `${[72, 55, 40, 48][col]}%` }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <aside
        className="border-border bg-background text-foreground flex min-h-0 flex-col border-l"
        aria-hidden={!panelOpen}
        aria-label="Ask Vibe"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          zIndex: 40,
          transform: sidePanelTransform(panelOpen),
          transition: `transform ${SIDEPANEL_DURATION} ${SIDEPANEL_EASE}`,
          pointerEvents: panelOpen ? "auto" : "none",
        }}
      >
        <header className="border-border flex shrink-0 items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-block size-[22px] shrink-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(10,132,255,0.35), rgba(90,170,255,0.2), rgba(191,216,245,0.3), rgba(10,132,255,0.35))",
                filter: "blur(3px)",
              }}
            />
            <span className="text-foreground text-[length:var(--text-chat)] leading-[var(--text-chat--line-height)] font-semibold">
              Ask Vibe
            </span>
          </div>
          <button
            type="button"
            onClick={handleClosePanel}
            aria-label="Close panel"
            className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-[length:var(--text-chat)] leading-none transition-colors"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-3" />

        <div className="shrink-0 px-4 pt-3 pb-4">
          <Chatbox
            onSend={() => {}}
            rotatePlaceholder={false}
            value={composerValue}
            onValueChange={setComposerValue}
          />
        </div>
      </aside>
    </div>
  )
}
