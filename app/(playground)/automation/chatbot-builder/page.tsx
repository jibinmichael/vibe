"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { AnimatePresence, motion } from "motion/react"
import { GripVertical, ListTree, MessageSquare, Plus, Zap } from "lucide-react"
import { AutomationAiSidePanel } from "@/components/automation/AutomationAiSidePanel"
import {
  AUTOMATION_DOT_GRID_STYLE,
  AUTOMATION_SIDEPANEL_DURATION,
  AUTOMATION_SIDEPANEL_EASE,
} from "@/components/automation/automationShared"
import { PlanWithVibeFab } from "@/components/fab/PlanWithVibeFab"

const SIDEPANEL_DURATION = AUTOMATION_SIDEPANEL_DURATION
const SIDEPANEL_EASE = AUTOMATION_SIDEPANEL_EASE

/** Indigo connectors — aligned with reference (~#6366f1). */
const FLOW_LINE = "#6366f1"

const CHATBOT_CARD_STYLE_TAG = `
  @keyframes chatbotBuilderCardScan {
    0%, 100% { border-color: rgba(0, 0, 0, 0.06); }
    50% { border-color: rgba(10, 132, 255, 0.45); }
  }
  .chatbot-builder-live-node {
    border-width: 1px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.06);
    animation: chatbotBuilderCardScan 4.8s ease-in-out infinite;
  }
  .chatbot-builder-live-node[data-scan-index="1"] { animation-delay: 0ms; }
  .chatbot-builder-live-node[data-scan-index="2"] { animation-delay: 700ms; }
  .chatbot-builder-live-node[data-scan-index="3"] { animation-delay: 1400ms; }
  .chatbot-builder-live-node[data-scan-index="4"] { animation-delay: 2100ms; }
  .chatbot-builder-live-node[data-scan-index="5"] { animation-delay: 2800ms; }
`

const CYCLE_MS = 2200

/** Tree order: root bot → 3 user branches → closing bot */
const STEP_LINES = [
  { loading: "Opening greeting…", final: "Hi — how can we help today?", kind: "bot" as const },
  { loading: "Branch A…", final: "Payment issues", kind: "user" as const },
  { loading: "Branch B…", final: "Can't sign in", kind: "user" as const },
  { loading: "Branch C…", final: "Something else", kind: "user" as const },
  { loading: "Acknowledging…", final: "Thanks — we're on it.", kind: "bot" as const },
] as const

type Phase = 0 | 1 | 2

function CycleBody({
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
    <div className="flex min-h-[52px] flex-col items-center justify-center gap-2 px-2 pt-1 pb-2 text-center">
      <span
        className={`line-clamp-3 text-[12px] leading-snug ${phase === 0 ? "animate-pulse text-black/45" : "text-[rgba(0,0,0,0.88)]"}`}
      >
        {phase === 0 ? loading : finalText}
      </span>
      <motion.span
        className="inline-flex shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
        animate={{ opacity: showEdit ? 1 : 0, scale: showEdit ? 1 : 0.85 }}
        transition={{ duration: 0.28, ease: [0.34, 1.28, 0.64, 1] }}
        style={{ pointerEvents: showEdit ? "auto" : "none" }}
      >
        Edit
      </motion.span>
    </div>
  )
}

/** Stepped fork: one trunk down → horizontal → three stubs down (reference-style). */
function ForkConnectorThree() {
  return (
    <svg
      width={320}
      height={44}
      viewBox="0 0 320 44"
      className="mx-auto shrink-0 text-[#6366f1]"
      aria-hidden
    >
      <path
        d="M 160 0 L 160 14 L 52 14 L 52 44 M 160 14 L 160 44 M 160 14 L 268 14 L 268 44"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.88}
      />
    </svg>
  )
}

function VerticalConnector({ dashed }: { dashed?: boolean }) {
  return (
    <div className="flex justify-center py-0.5" aria-hidden>
      <div
        className={`h-7 w-0.5 rounded-full ${dashed ? "border-l border-dashed border-black/25 bg-transparent" : ""}`}
        style={dashed ? undefined : { background: FLOW_LINE, opacity: 0.9 }}
      />
    </div>
  )
}

const NODE_W = "w-[168px]"

function GhostSquareNode({ kind, delay }: { kind: "bot" | "user"; delay: number }) {
  const label = kind === "bot" ? "Bot Says:" : "User Clicks:"
  return (
    <motion.div
      className={`${NODE_W} overflow-hidden rounded-lg border border-dashed border-black/18 bg-white/75 shadow-[0_1px_6px_rgba(0,0,0,0.05)]`}
      animate={{ opacity: [0.38, 0.58, 0.38] }}
      transition={{ duration: 2.35, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div
        className={`flex items-center justify-between gap-1 border-b border-black/8 px-2.5 py-2 ${kind === "user" ? "text-indigo-600" : "text-black/80"}`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${kind === "user" ? "bg-indigo-500 text-white" : "bg-neutral-600 text-white"}`}
          >
            {kind === "user" ? (
              <Zap className="size-3.5" strokeWidth={2} aria-hidden />
            ) : (
              <MessageSquare className="size-3.5" strokeWidth={2} aria-hidden />
            )}
          </span>
          <span className="truncate text-[11px] font-semibold">{label}</span>
        </div>
        <GripVertical className="size-3.5 shrink-0 text-black/25" aria-hidden />
      </div>
      <div className="flex flex-col items-center gap-2 px-2 py-3">
        <div className="h-2 w-[78%] rounded bg-black/10" />
        <div className="h-2 w-[55%] rounded bg-black/8" />
      </div>
    </motion.div>
  )
}

function GhostAddMessageNode({ delay }: { delay: number }) {
  return (
    <motion.div
      className={`${NODE_W} rounded-lg border border-dashed border-black/22 bg-transparent px-2 py-4`}
      animate={{ opacity: [0.35, 0.55, 0.35] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#0a84ff]">
        <Plus className="size-5" strokeWidth={2} aria-hidden />
        <span>Add Message</span>
      </div>
    </motion.div>
  )
}

function GhostConnectedChain() {
  return (
    <motion.div
      className="relative z-10 flex w-full max-w-[520px] flex-col items-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <p className="mb-4 text-center text-[11px] font-medium tracking-wide text-black/35">
        Welcome bot flow
      </p>

      <GhostSquareNode kind="bot" delay={0} />
      <VerticalConnector />
      <ForkConnectorThree />
      <div className="flex w-full max-w-[380px] flex-wrap justify-center gap-6 pt-1">
        <GhostSquareNode kind="user" delay={0.15} />
        <GhostSquareNode kind="user" delay={0.28} />
        <GhostSquareNode kind="user" delay={0.41} />
      </div>
      <VerticalConnector dashed />
      <GhostAddMessageNode delay={0.5} />
    </motion.div>
  )
}

function LiveSquareNode({
  line,
  phase,
  scanIndex,
}: {
  line: (typeof STEP_LINES)[number]
  phase: Phase
  scanIndex: number
}) {
  const kind = line.kind
  const label = kind === "bot" ? "Bot Says:" : "User Clicks:"
  const IconCmp = kind === "bot" ? MessageSquare : Zap

  return (
    <div
      className={`chatbot-builder-live-node ${NODE_W} shrink-0 overflow-hidden rounded-lg bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)]`}
      data-scan-index={String(scanIndex)}
    >
      <div
        className={`flex items-center justify-between gap-1 border-b border-black/[0.07] px-2.5 py-2 ${kind === "user" ? "text-indigo-600" : "text-black/85"}`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${kind === "user" ? "bg-indigo-500 text-white" : "bg-neutral-700 text-white"}`}
          >
            <IconCmp className="size-3.5" strokeWidth={2} aria-hidden />
          </span>
          <span className="truncate text-[11px] font-semibold">{label}</span>
        </div>
        <GripVertical className="size-3.5 shrink-0 text-black/30" aria-hidden />
      </div>
      <CycleBody loading={line.loading} finalText={line.final} phase={phase} />
    </div>
  )
}

export default function ChatbotBuilderPage() {
  const [panelOpen, setPanelOpen] = useState(true)
  const [composerValue, setComposerValue] = useState(
    "Outline a 3-message welcome series for new WhatsApp subscribers",
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
    label: "Welcome bot series",
    icon: <ListTree className="size-3.5 text-neutral-600" aria-hidden strokeWidth={2} />,
  }

  const root = STEP_LINES[0]
  const branches = [STEP_LINES[1], STEP_LINES[2], STEP_LINES[3]]
  const closing = STEP_LINES[4]

  return (
    <div className="flex" style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <main
        className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-auto overflow-x-hidden"
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
            <GhostConnectedChain key="ghost" />
          ) : (
            <motion.div
              key={userMessages.length}
              className="relative z-10 flex w-full max-w-[540px] flex-col items-center px-4 py-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <style dangerouslySetInnerHTML={{ __html: CHATBOT_CARD_STYLE_TAG }} />
              <p className="mb-4 text-[11px] font-medium tracking-wide text-black/40">
                Welcome bot series
              </p>

              <motion.div
                className="flex justify-center overflow-hidden"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.42, ease: [0.34, 1.28, 0.64, 1] }}
              >
                <LiveSquareNode line={root} phase={phase} scanIndex={1} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <VerticalConnector />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <ForkConnectorThree />
              </motion.div>

              <div className="flex w-full max-w-[400px] flex-wrap justify-center gap-6">
                {branches.map((line, i) => (
                  <motion.div
                    key={line.final}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.65 + i * 0.18,
                      duration: 0.42,
                      ease: [0.34, 1.28, 0.64, 1],
                    }}
                  >
                    <LiveSquareNode line={line} phase={phase} scanIndex={i + 2} />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.15 }}
              >
                <VerticalConnector dashed />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.28, duration: 0.42, ease: [0.34, 1.28, 0.64, 1] }}
              >
                <LiveSquareNode line={closing} phase={phase} scanIndex={5} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AutomationAiSidePanel
        title="Create a welcome bot series"
        ariaLabel="Create a welcome bot series"
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
