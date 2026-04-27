"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import Link from "next/link"
import { BetweenHorizontalStart, Clock, ListTree, SquareChevronRight } from "lucide-react"
import { AutomationAiSidePanel } from "@/components/automation/AutomationAiSidePanel"
import { AUTOMATION_DOT_GRID_STYLE } from "@/components/automation/automationShared"
import {
  BUILD_RULES_DEFAULT_COMPOSER,
  BuildRulesWorkflowCanvas,
  RuleBuildAgentResponse,
  RULE_BUILD_ANIMATION_MS,
  type RuleCanvasPhase,
} from "@/components/automation/build-rules/BuildRulesWorkflowCanvas"
import {
  CHATBOT_BUILD_MS,
  CHATBOT_NAME,
  ChatbotBuildAgentResponse,
  ChatbotFlowCanvas,
  DEFAULT_CHATBOT_COMPOSER,
} from "@/components/automation/chatbot-builder/ChatbotBuilderCanvas"
import {
  DEFAULT_SEQUENCES_COMPOSER,
  SEQUENCE_CYCLE_MS,
  SequencesWorkflowCanvas,
  type SequenceCyclePhase,
} from "@/components/automation/sequences-builder/SequencesWorkflowCanvas"
import { AssistantContent, type AssistantBlock } from "@/components/chat/AssistantContent"
import type { ChoiceOption } from "@/components/chat/ChoiceArtifact"
import { Chatbox } from "@/components/chat/Chatbox"
import { ThinkingIndicator } from "@/components/chat/ThinkingIndicator"
import { PlanWithVibeFab } from "@/components/fab/PlanWithVibeFab"
import { cn } from "@/lib/utils"

/** Matches `PlannerSidePanel` / campaign planner so the panel slides the same way. */
const SIDEPANEL_EASE = "cubic-bezier(0.34, 1.28, 0.64, 1)"
const SIDEPANEL_DURATION = "0.52s"

type EmbeddedWorkflowKind = "rules" | "chatbots" | "sequences"

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

export type AutomationOverviewContentProps = {
  /** Renders inside Vibe main column instead of full-viewport playground. */
  embeddedInVibe?: boolean
}

export function AutomationOverviewContent({
  embeddedInVibe = false,
}: AutomationOverviewContentProps) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [composerValue, setComposerValue] = useState("")
  const [embeddedWorkflow, setEmbeddedWorkflow] = useState<EmbeddedWorkflowKind | null>(null)

  const [rulesUserMessages, setRulesUserMessages] = useState<string[]>([])
  const [rulesCanvasPhase, setRulesCanvasPhase] = useState<RuleCanvasPhase>("ghost")
  const [rulesFilterAccordionOpen, setRulesFilterAccordionOpen] = useState(true)
  const ruleReadyTimerRef = useRef<number | undefined>(undefined)

  const [chatUserMessages, setChatUserMessages] = useState<string[]>([])
  const [chatCanvasPhase, setChatCanvasPhase] = useState<"ghost" | "building" | "ready">("ghost")
  const chatReadyTimerRef = useRef<number | undefined>(undefined)

  const [seqUserMessages, setSeqUserMessages] = useState<string[]>([])
  const [seqCyclePhase, setSeqCyclePhase] = useState<SequenceCyclePhase>(0)

  useEffect(() => {
    return () => {
      if (ruleReadyTimerRef.current !== undefined) window.clearTimeout(ruleReadyTimerRef.current)
      if (chatReadyTimerRef.current !== undefined) window.clearTimeout(chatReadyTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (embeddedWorkflow !== "sequences") return
    if (seqUserMessages.length === 0) return
    let intervalId: number | undefined
    const timeoutId = window.setTimeout(() => {
      setSeqCyclePhase(0)
      intervalId = window.setInterval(
        () => setSeqCyclePhase((p) => ((p + 1) % 3) as SequenceCyclePhase),
        SEQUENCE_CYCLE_MS,
      )
    }, 0)
    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId !== undefined) window.clearInterval(intervalId)
    }
  }, [embeddedWorkflow, seqUserMessages.length])

  const clearAutomationTimers = useCallback(() => {
    if (ruleReadyTimerRef.current !== undefined) {
      window.clearTimeout(ruleReadyTimerRef.current)
      ruleReadyTimerRef.current = undefined
    }
    if (chatReadyTimerRef.current !== undefined) {
      window.clearTimeout(chatReadyTimerRef.current)
      chatReadyTimerRef.current = undefined
    }
  }, [])

  const resetEmbeddedDraftState = useCallback(() => {
    clearAutomationTimers()
    setRulesUserMessages([])
    setRulesCanvasPhase("ghost")
    setRulesFilterAccordionOpen(true)
    setChatUserMessages([])
    setChatCanvasPhase("ghost")
    setSeqUserMessages([])
    setSeqCyclePhase(0)
  }, [clearAutomationTimers])

  const exitEmbeddedAndClosePanel = useCallback(() => {
    setEmbeddedWorkflow(null)
    setPanelOpen(false)
    setComposerValue("")
    resetEmbeddedDraftState()
  }, [resetEmbeddedDraftState])

  const handleAutomationKindSelect = useCallback(
    (opt: ChoiceOption) => {
      if (opt.id !== "rules" && opt.id !== "chatbots" && opt.id !== "sequences") return
      resetEmbeddedDraftState()
      setEmbeddedWorkflow(opt.id)
      setComposerValue(
        opt.id === "rules"
          ? BUILD_RULES_DEFAULT_COMPOSER
          : opt.id === "chatbots"
            ? DEFAULT_CHATBOT_COMPOSER
            : DEFAULT_SEQUENCES_COMPOSER,
      )
    },
    [resetEmbeddedDraftState],
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

  const handleRulesSend = useCallback((text: string) => {
    setRulesUserMessages((prev) => [...prev, text])
    setRulesCanvasPhase("building")
    if (ruleReadyTimerRef.current !== undefined) window.clearTimeout(ruleReadyTimerRef.current)
    ruleReadyTimerRef.current = window.setTimeout(() => {
      setRulesCanvasPhase("ready")
      ruleReadyTimerRef.current = undefined
    }, RULE_BUILD_ANIMATION_MS)
  }, [])

  const handleChatSend = useCallback((text: string) => {
    setChatUserMessages((prev) => [...prev, text])
    setChatCanvasPhase("building")
    if (chatReadyTimerRef.current !== undefined) window.clearTimeout(chatReadyTimerRef.current)
    chatReadyTimerRef.current = window.setTimeout(() => {
      setChatCanvasPhase("ready")
      chatReadyTimerRef.current = undefined
    }, CHATBOT_BUILD_MS)
  }, [])

  const rulesStreamFooter: ReactNode | undefined =
    rulesUserMessages.length === 0 ? undefined : rulesCanvasPhase === "building" ? (
      <div style={{ padding: "16px 4px" }}>
        <ThinkingIndicator />
      </div>
    ) : (
      <RuleBuildAgentResponse />
    )

  const chatStreamFooter: ReactNode | undefined =
    chatUserMessages.length === 0 ? undefined : chatCanvasPhase === "building" ? (
      <div style={{ padding: "16px 4px" }}>
        <ThinkingIndicator />
      </div>
    ) : (
      <ChatbotBuildAgentResponse />
    )

  const showChatbotLiveFlow = chatUserMessages.length > 0 && chatCanvasPhase === "ready"

  const rulesChip = {
    label: "build a new rule",
    icon: <SquareChevronRight className="size-3.5 text-neutral-600" aria-hidden strokeWidth={2} />,
  }

  const chatChip = {
    label: CHATBOT_NAME,
    icon: <ListTree className="size-3.5 text-neutral-600" aria-hidden strokeWidth={2} />,
  }

  const seqChip = {
    label: "Timed outreach sequence",
    icon: <Clock className="size-3.5 text-neutral-600" aria-hidden strokeWidth={2} />,
  }

  return (
    <div
      className={cn(
        "automation-page chat-surface text-foreground flex min-h-0 flex-col antialiased",
        embeddedInVibe && "h-full min-h-0 flex-1",
        !embeddedInVibe && "min-h-screen",
      )}
      style={
        embeddedInVibe ? { background: "#FAFAF8" } : { minHeight: "100vh", background: "#FAFAF8" }
      }
    >
      <main
        className={cn(
          "automation-main flex min-h-0 flex-1 flex-col",
          embeddedInVibe && "min-h-full",
          embeddedWorkflow && "min-h-0 flex-1",
          embeddedWorkflow === "rules" && "overflow-x-hidden overflow-y-auto overscroll-contain",
        )}
        style={{
          minWidth: 0,
          ...(embeddedInVibe ? {} : { minHeight: "100vh" }),
          paddingBottom: embeddedWorkflow ? 0 : 120,
          paddingLeft: embeddedWorkflow ? 0 : 40,
          paddingRight: panelOpen ? 420 : 40,
          transition: `padding-right ${SIDEPANEL_DURATION} ${SIDEPANEL_EASE}`,
        }}
      >
        <header
          className={cn(
            "automation-page-header border-border flex shrink-0 items-center justify-between border-b py-4 pr-1",
            embeddedWorkflow && "pl-10",
            embeddedWorkflow === "rules" && "sticky top-0 z-30 bg-[#FAFAF8]",
          )}
        >
          <nav aria-label="Breadcrumb" className="min-w-0">
            <span className="text-foreground text-[length:var(--text-chat)] leading-[var(--text-chat--line-height)] font-semibold">
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

        {embeddedWorkflow ? (
          <div
            className={cn(
              "relative flex w-full flex-col",
              embeddedWorkflow === "rules"
                ? "shrink-0 overflow-x-hidden pb-10"
                : "min-h-0 flex-1 overflow-hidden",
            )}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={AUTOMATION_DOT_GRID_STYLE as CSSProperties}
              aria-hidden
            />

            {embeddedWorkflow === "chatbots" ? (
              <p
                className="pointer-events-none absolute top-3 right-0 left-0 z-20 mx-auto max-w-[90vw] text-center text-[11px] font-medium tracking-wide text-black/40"
                style={{ lineHeight: 1.35 }}
              >
                {CHATBOT_NAME}
              </p>
            ) : null}

            <div
              className={cn(
                "relative z-10 flex w-full flex-col",
                embeddedWorkflow === "chatbots"
                  ? "min-h-0 flex-1 pt-9"
                  : embeddedWorkflow === "rules"
                    ? "items-stretch"
                    : "min-h-0 flex-1 items-center justify-center",
              )}
            >
              {embeddedWorkflow === "rules" ? (
                <div className="relative flex w-full flex-col items-center px-2 py-4 pb-16">
                  <BuildRulesWorkflowCanvas
                    userMessagesLength={rulesUserMessages.length}
                    ruleCanvasPhase={rulesCanvasPhase}
                    filterAccordionOpen={rulesFilterAccordionOpen}
                    onFilterToggle={() => setRulesFilterAccordionOpen((o) => !o)}
                  />
                </div>
              ) : null}
              {embeddedWorkflow === "chatbots" ? (
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                  <ChatbotFlowCanvas showLive={showChatbotLiveFlow} />
                </div>
              ) : null}
              {embeddedWorkflow === "sequences" ? (
                <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-auto">
                  <SequencesWorkflowCanvas
                    hasMessages={seqUserMessages.length > 0}
                    liveCanvasKey={seqUserMessages.length}
                    cyclePhase={seqCyclePhase}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <div
              className="automation-build-section w-full shrink-0 pt-4"
              style={{ background: "transparent" }}
            >
              <p className="text-muted-foreground mb-2.5 text-left text-[11px] font-medium tracking-[var(--text-micro--letter-spacing)]">
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
                          <ListTree
                            className="size-5 text-neutral-600"
                            aria-hidden
                            strokeWidth={2}
                          />
                        ) : i === 2 ? (
                          <BetweenHorizontalStart
                            className="size-5 text-neutral-600"
                            aria-hidden
                            strokeWidth={2}
                          />
                        ) : null}
                      </div>
                      <div className="ml-3 flex min-w-0 flex-col gap-0.5">
                        <span className="text-foreground text-[length:var(--text-chat)] leading-[var(--text-chat--line-height)] font-semibold tracking-tight">
                          {card.title}
                        </span>
                        <span className="text-muted-foreground text-[11px] leading-[1.35]">
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
              <p className="text-muted-foreground mb-2.5 text-left text-[11px] font-medium tracking-[var(--text-micro--letter-spacing)]">
                My automation
              </p>
              <div className="border-border bg-card w-full overflow-hidden rounded-md border">
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
                          className="border-border bg-card text-muted-foreground border px-2.5 py-2 text-[length:var(--text-micro)] leading-[var(--text-micro--line-height)] font-semibold"
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
                              className="border-border bg-card border px-2.5 py-2 align-middle"
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
          </>
        )}
      </main>

      {panelOpen && embeddedWorkflow === "rules" ? (
        <AutomationAiSidePanel
          title="Build rules"
          ariaLabel="Build rules"
          panelOpen={panelOpen}
          onClose={exitEmbeddedAndClosePanel}
          userMessages={rulesUserMessages}
          composerValue={composerValue}
          onComposerChange={setComposerValue}
          onSend={handleRulesSend}
          chip={rulesChip}
          streamFooter={rulesStreamFooter}
          {...(rulesCanvasPhase === "ready" && rulesUserMessages.length > 0
            ? { streamAutoScrollKey: rulesUserMessages.length }
            : {})}
        />
      ) : null}

      {panelOpen && embeddedWorkflow === "chatbots" ? (
        <AutomationAiSidePanel
          title="Create a welcome bot series"
          ariaLabel="Create a welcome bot series"
          panelOpen={panelOpen}
          onClose={exitEmbeddedAndClosePanel}
          userMessages={chatUserMessages}
          composerValue={composerValue}
          onComposerChange={setComposerValue}
          onSend={handleChatSend}
          chip={chatChip}
          streamFooter={chatStreamFooter}
          {...(chatUserMessages.length > 0 && chatCanvasPhase === "ready"
            ? { streamAutoScrollKey: chatUserMessages.length }
            : {})}
        />
      ) : null}

      {panelOpen && embeddedWorkflow === "sequences" ? (
        <AutomationAiSidePanel
          title="Design your sequence"
          ariaLabel="Design your sequence"
          panelOpen={panelOpen}
          onClose={exitEmbeddedAndClosePanel}
          userMessages={seqUserMessages}
          composerValue={composerValue}
          onComposerChange={setComposerValue}
          onSend={(text) => setSeqUserMessages((prev) => [...prev, text])}
          chip={seqChip}
        />
      ) : null}

      {panelOpen && !embeddedWorkflow ? (
        <aside
          className="automation-sidepanel border-border bg-background text-foreground flex min-h-0 flex-col border-l"
          aria-hidden={!panelOpen}
          aria-label="Plan with Vibe"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: 420,
            zIndex: 40,
            transform: openPanelTransform(panelOpen),
            transition: `transform ${SIDEPANEL_DURATION} ${SIDEPANEL_EASE}`,
            pointerEvents: panelOpen ? "auto" : "none",
          }}
        >
          <header className="automation-sidepanel-head border-border flex shrink-0 items-center justify-between border-b px-5 py-4">
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
                Plan with Vibe
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setPanelOpen(false)
                setComposerValue("")
              }}
              aria-label="Close panel"
              className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-[length:var(--text-chat)] leading-none transition-colors"
            >
              ×
            </button>
          </header>

          <div className="automation-sidepanel-stream min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-3">
            <AssistantContent blocks={buildWithVibeBlocks} />
          </div>

          <div className="automation-sidepanel-composer-dock shrink-0 px-4 pt-3 pb-4">
            <Chatbox
              onSend={(text) => alert(`Sent: ${text}`)}
              rotatePlaceholder={false}
              value={composerValue}
              onValueChange={setComposerValue}
            />
          </div>
        </aside>
      ) : null}
    </div>
  )
}

function openPanelTransform(open: boolean) {
  return open ? "translate3d(0,0,0)" : "translate3d(100%,0,0)"
}
