"use client"

import { Fragment, useEffect, useState, type CSSProperties } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Clock } from "lucide-react"
import { AutomationAiSidePanel } from "@/components/automation/AutomationAiSidePanel"
import {
  AUTOMATION_DOT_GRID_STYLE,
  AUTOMATION_SIDEPANEL_DURATION,
  AUTOMATION_SIDEPANEL_EASE,
} from "@/components/automation/automationShared"
import { PlanWithVibeFab } from "@/components/fab/PlanWithVibeFab"

const SIDEPANEL_DURATION = AUTOMATION_SIDEPANEL_DURATION
const SIDEPANEL_EASE = AUTOMATION_SIDEPANEL_EASE

const FLOW_LINE = "rgba(99, 102, 241, 0.85)"

const SEQUENCE_CARD_STYLE_TAG = `
  @keyframes sequencesBuilderCardScan {
    0%, 100% { border-color: rgba(0, 0, 0, 0.05); }
    50% { border-color: rgba(10, 132, 255, 0.45); }
  }
  .sequences-builder-live-card {
    border-width: 1px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.05);
    animation: sequencesBuilderCardScan 4.8s ease-in-out infinite;
  }
  .sequences-builder-live-card[data-scan-index="1"] { animation-delay: 0ms; }
  .sequences-builder-live-card[data-scan-index="2"] { animation-delay: 800ms; }
  .sequences-builder-live-card[data-scan-index="3"] { animation-delay: 1600ms; }
`

const CYCLE_MS = 2200

/** Gaps between Day 0 → Day 2 → Day 7 */
const WAIT_BETWEEN_STEPS = ["Wait 2 days", "Wait 5 days"] as const

const SEQUENCE_LINES = [
  { loading: "Scheduling Day 0…", final: "Welcome message timed" },
  { loading: "Queueing Day 2…", final: "Check-in action scheduled" },
  { loading: "Setting Day 7…", final: "Offer step queued" },
] as const

type Phase = 0 | 1 | 2

function CycleRow({
  loading,
  finalText,
  phase,
}: {
  loading: string
  finalText: string
  phase: Phase
}) {
  const showEdit = phase === 2
  return (
    <>
      <span
        className={`min-w-0 flex-1 text-[14px] leading-snug ${phase === 0 ? "animate-pulse text-black/45" : "text-[rgba(0,0,0,0.88)]"}`}
      >
        {phase === 0 ? loading : finalText}
      </span>
      <motion.span
        className="inline-flex shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700"
        animate={{ opacity: showEdit ? 1 : 0, scale: showEdit ? 1 : 0.85 }}
        transition={{ duration: 0.28, ease: [0.34, 1.28, 0.64, 1] }}
        style={{ pointerEvents: showEdit ? "auto" : "none" }}
      >
        Edit
      </motion.span>
    </>
  )
}

function WaitBetweenNodes({ label, variant }: { label: string; variant: "ghost" | "live" }) {
  const lineStyle =
    variant === "ghost"
      ? { background: "linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(99,102,241,0.35))" }
      : { background: FLOW_LINE }

  return (
    <div className="flex w-full flex-col items-center gap-0 py-1">
      <div className="h-5 w-px rounded-full" style={lineStyle} aria-hidden />
      {variant === "ghost" ? (
        <motion.div
          className="flex items-center gap-1.5 rounded-full border border-dashed border-black/18 bg-white/60 px-2.5 py-1 text-[10px] font-semibold tracking-tight text-black/40"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Clock className="size-3 shrink-0 text-current opacity-90" strokeWidth={2} aria-hidden />
          <span>{label}</span>
        </motion.div>
      ) : (
        <div className="flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/90 px-2.5 py-1 text-[10px] font-semibold tracking-tight text-indigo-800">
          <Clock className="size-3 shrink-0 text-current opacity-90" strokeWidth={2} aria-hidden />
          <span>{label}</span>
        </div>
      )}
      <div className="h-5 w-px rounded-full" style={lineStyle} aria-hidden />
    </div>
  )
}

function SequencesGhostCanvas() {
  const GhostCard = ({ delay, subtitle }: { delay: number; subtitle: string }) => (
    <motion.div
      className="flex w-full flex-col gap-2 rounded-xl border border-dashed border-black/14 bg-white/65 px-4 py-3 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-[1px]"
      animate={{ opacity: [0.34, 0.56, 0.34] }}
      transition={{ duration: 2.35, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <span className="text-[10px] font-semibold tracking-wide text-black/35 uppercase">
        {subtitle}
      </span>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a84ff]/25 text-[#0a84ff]/55">
          <Clock className="size-[18px]" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-2.5 w-[75%] rounded bg-black/10" />
          <div className="h-2.5 w-[50%] rounded bg-black/8" />
        </div>
        <div className="h-7 w-[52px] shrink-0 rounded-full bg-black/8" />
      </div>
    </motion.div>
  )

  const ghosts = [
    { delay: 0, subtitle: "Step · Day 0" },
    { delay: 0.28, subtitle: "Step · Day 2" },
    { delay: 0.56, subtitle: "Step · Day 7" },
  ] as const

  return (
    <motion.div
      className="relative z-10 flex w-full max-w-[440px] flex-col px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <p className="mb-3 text-center text-[11px] font-medium tracking-wide text-black/35">
        Timed messages & actions
      </p>
      {ghosts.map((g, i) => (
        <Fragment key={g.subtitle}>
          <GhostCard delay={g.delay} subtitle={g.subtitle} />
          {i < ghosts.length - 1 ? (
            <WaitBetweenNodes label={WAIT_BETWEEN_STEPS[i as 0 | 1]} variant="ghost" />
          ) : null}
        </Fragment>
      ))}
    </motion.div>
  )
}

export default function SequencesBuilderPage() {
  const [panelOpen, setPanelOpen] = useState(true)
  const [composerValue, setComposerValue] = useState(
    "Build a 3-step nurture: welcome, then day-2 check-in, then day-7 offer",
  )
  const [userMessages, setUserMessages] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>(0)

  useEffect(() => {
    if (userMessages.length === 0) return
    let intervalId: number | undefined
    const timeoutId = window.setTimeout(() => {
      setPhase(0)
      intervalId = window.setInterval(() => setPhase((p) => ((p + 1) % 3) as Phase), CYCLE_MS)
    }, 0)
    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId !== undefined) window.clearInterval(intervalId)
    }
  }, [userMessages.length])

  const handleClose = () => {
    setPanelOpen(false)
    setComposerValue("")
  }

  const chip = {
    label: "Timed outreach sequence",
    icon: <Clock className="size-3.5 text-neutral-600" aria-hidden strokeWidth={2} />,
  }

  return (
    <div className="flex" style={{ minHeight: "100vh", background: "#FAFAF8" }}>
      <main
        className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden"
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
          className="pointer-events-none absolute inset-0"
          style={AUTOMATION_DOT_GRID_STYLE as CSSProperties}
          aria-hidden
        />

        <AnimatePresence mode="wait">
          {userMessages.length === 0 ? (
            <SequencesGhostCanvas key="ghost" />
          ) : (
            <motion.div
              key={userMessages.length}
              className="relative z-10 flex w-full max-w-[440px] flex-col items-center gap-0 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <style dangerouslySetInnerHTML={{ __html: SEQUENCE_CARD_STYLE_TAG }} />
              <p className="mb-4 text-[11px] font-medium tracking-wide text-black/40">
                Timed sequence
              </p>
              {SEQUENCE_LINES.map((line, i) => {
                const dayLabel = ["Day 0", "Day 2", "Day 7"][i as 0 | 1 | 2]
                return (
                  <Fragment key={line.final}>
                    <motion.div
                      className="w-full overflow-hidden"
                      initial={{ opacity: 0, maxHeight: 0 }}
                      animate={{ opacity: 1, maxHeight: 220 }}
                      transition={{
                        delay: 0.4 + i * 0.95,
                        duration: 0.48,
                        ease: [0.34, 1.28, 0.64, 1],
                      }}
                    >
                      <span className="mb-1.5 block text-[10px] font-semibold tracking-wide text-black/38 uppercase">
                        {dayLabel}
                      </span>
                      <div
                        className="sequences-builder-live-card flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_2px_14px_rgba(0,0,0,0.06)]"
                        data-scan-index={String(i + 1)}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a84ff] text-white">
                          <Clock className="size-[18px]" strokeWidth={2} aria-hidden />
                        </div>
                        <CycleRow loading={line.loading} finalText={line.final} phase={phase} />
                      </div>
                    </motion.div>
                    {i < SEQUENCE_LINES.length - 1 ? (
                      <WaitBetweenNodes label={WAIT_BETWEEN_STEPS[i as 0 | 1]} variant="live" />
                    ) : null}
                  </Fragment>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AutomationAiSidePanel
        title="Design your sequence"
        ariaLabel="Design your sequence"
        panelOpen={panelOpen}
        onClose={handleClose}
        userMessages={userMessages}
        composerValue={composerValue}
        onComposerChange={setComposerValue}
        onSend={(text) => setUserMessages((prev) => [...prev, text])}
        chip={chip}
      />

      {!panelOpen && (
        <PlanWithVibeFab label="Build Automations with Vibe" onClick={() => setPanelOpen(true)} />
      )}
    </div>
  )
}
