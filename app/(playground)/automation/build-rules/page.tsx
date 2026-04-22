"use client"

import { useEffect, useState, type CSSProperties, type ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, FileText, Filter, SquareChevronRight } from "lucide-react"
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

/** Matches `MonthCalendar` scanning: `monthCalendarCellScan` + 80ms cascade between cells. */
const RULE_CARD_STYLE_TAG = `
  @keyframes buildRulesRuleCardScan {
    0%, 100% {
      border-color: rgba(0, 0, 0, 0.05);
    }
    50% {
      border-color: rgba(10, 132, 255, 0.45);
    }
  }
  .build-rules-rule-card {
    border-width: 1px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.05);
    animation: buildRulesRuleCardScan 4.8s ease-in-out infinite;
  }
  .build-rules-rule-card[data-scan-index="1"] { animation-delay: 0ms; }
  .build-rules-rule-card[data-scan-index="2"] { animation-delay: 800ms; }
  .build-rules-rule-card[data-scan-index="3"] { animation-delay: 1600ms; }
`

/** Same cycle for each row: loading → final copy → Edit; then repeats. */
const RULE_CARD_CYCLE_MS = 2200

const RULE_CARD_LINES = [
  { loading: "Identifying trigger…", final: "Trigger added" },
  { loading: "Applying filters…", final: "Filters applied" },
  { loading: "Drafting action…", final: "Action added" },
] as const

type RuleCyclePhase = 0 | 1 | 2

function RulesGhostCard({ icon, delay }: { icon: ReactNode; delay: number }) {
  return (
    <motion.div
      className="flex w-full items-center gap-3 rounded-xl border border-dashed border-black/14 bg-white/65 px-4 py-3 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-[1px]"
      animate={{ opacity: [0.36, 0.58, 0.36] }}
      transition={{
        duration: 2.35,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a84ff]/25 text-[#0a84ff]/55">
        {icon}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-2.5 w-[72%] rounded bg-black/10" />
        <div className="h-2.5 w-[48%] rounded bg-black/8" />
      </div>
      <div className="h-7 w-[52px] shrink-0 rounded-full bg-black/8" />
    </motion.div>
  )
}

function RuleBuilderGhostCanvas() {
  return (
    <motion.div
      className="relative z-10 flex w-full max-w-[440px] flex-col gap-5 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div className="w-full">
        <p className="mb-1.5 text-[11px] font-medium tracking-wide text-black/28">When</p>
        <RulesGhostCard
          icon={<FileText className="size-[18px]" strokeWidth={2} aria-hidden />}
          delay={0}
        />
      </div>
      <RulesGhostCard
        icon={<Filter className="size-[18px]" strokeWidth={2} aria-hidden />}
        delay={0.38}
      />
      <div className="w-full">
        <p className="mb-1.5 text-[11px] font-medium tracking-wide text-black/28">Then</p>
        <RulesGhostCard
          icon={<Check className="size-[18px]" strokeWidth={2} aria-hidden />}
          delay={0.76}
        />
      </div>
    </motion.div>
  )
}

function RuleCardMainAndEdit({
  loading,
  finalText,
  phase,
}: {
  loading: string
  finalText: string
  phase: RuleCyclePhase
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
        animate={{
          opacity: showEdit ? 1 : 0,
          scale: showEdit ? 1 : 0.85,
        }}
        transition={{ duration: 0.28, ease: [0.34, 1.28, 0.64, 1] }}
        style={{ pointerEvents: showEdit ? "auto" : "none" }}
      >
        Edit
      </motion.span>
    </>
  )
}

export default function AutomationBuildRulesPage() {
  const [panelOpen, setPanelOpen] = useState(true)
  const [composerValue, setComposerValue] = useState(
    "Build a welcome message for all new whatsapp contacts",
  )
  const [userMessages, setUserMessages] = useState<string[]>([])
  const [ruleCyclePhase, setRuleCyclePhase] = useState<RuleCyclePhase>(0)

  useEffect(() => {
    if (userMessages.length === 0) return
    let intervalId: number | undefined
    const timeoutId = window.setTimeout(() => {
      setRuleCyclePhase(0)
      intervalId = window.setInterval(() => {
        setRuleCyclePhase((p) => ((p + 1) % 3) as RuleCyclePhase)
      }, RULE_CARD_CYCLE_MS)
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

  const handleSend = (text: string) => {
    setUserMessages((prev) => [...prev, text])
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

        <AnimatePresence mode="wait">
          {userMessages.length === 0 ? (
            <RuleBuilderGhostCanvas key="ghost" />
          ) : (
            <motion.div
              key={userMessages.length}
              className="relative z-10 flex w-full max-w-[440px] flex-col items-center gap-5 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Border pulse + cascade delays match `MonthCalendar` cell scan (see RULE_CARD_STYLE_TAG). */}
              <style dangerouslySetInnerHTML={{ __html: RULE_CARD_STYLE_TAG }} />

              <motion.div
                className="w-full overflow-hidden"
                initial={{ opacity: 0, maxHeight: 0 }}
                animate={{ opacity: 1, maxHeight: 160 }}
                transition={{ delay: 0.42, duration: 0.48, ease: [0.34, 1.28, 0.64, 1] }}
              >
                <p className="mb-1.5 text-[11px] font-medium tracking-wide text-black/40">When</p>
                <div
                  className="build-rules-rule-card flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_2px_14px_rgba(0,0,0,0.06)]"
                  data-scan-index="1"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a84ff] text-white">
                    <FileText className="size-[18px]" strokeWidth={2} aria-hidden />
                  </div>
                  <RuleCardMainAndEdit
                    loading={RULE_CARD_LINES[0].loading}
                    finalText={RULE_CARD_LINES[0].final}
                    phase={ruleCyclePhase}
                  />
                </div>
              </motion.div>

              <motion.div
                className="w-full overflow-hidden"
                initial={{ opacity: 0, maxHeight: 0 }}
                animate={{ opacity: 1, maxHeight: 120 }}
                transition={{ delay: 2.35, duration: 0.48, ease: [0.34, 1.28, 0.64, 1] }}
              >
                <div
                  className="build-rules-rule-card flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_2px_14px_rgba(0,0,0,0.06)]"
                  data-scan-index="2"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a84ff] text-white">
                    <Filter className="size-[18px]" strokeWidth={2} aria-hidden />
                  </div>
                  <RuleCardMainAndEdit
                    loading={RULE_CARD_LINES[1].loading}
                    finalText={RULE_CARD_LINES[1].final}
                    phase={ruleCyclePhase}
                  />
                </div>
              </motion.div>

              <motion.div
                className="w-full overflow-hidden"
                initial={{ opacity: 0, maxHeight: 0 }}
                animate={{ opacity: 1, maxHeight: 180 }}
                transition={{ delay: 4.28, duration: 0.48, ease: [0.34, 1.28, 0.64, 1] }}
              >
                <p className="mb-1.5 text-[11px] font-medium tracking-wide text-black/40">Then</p>
                <div
                  className="build-rules-rule-card flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_2px_14px_rgba(0,0,0,0.06)]"
                  data-scan-index="3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a84ff] text-white">
                    <Check className="size-[18px]" strokeWidth={2} aria-hidden />
                  </div>
                  <RuleCardMainAndEdit
                    loading={RULE_CARD_LINES[2].loading}
                    finalText={RULE_CARD_LINES[2].final}
                    phase={ruleCyclePhase}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
          {userMessages.length > 0 ? (
            <div style={{ padding: "16px 4px" }}>
              <ThinkingIndicator />
            </div>
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
