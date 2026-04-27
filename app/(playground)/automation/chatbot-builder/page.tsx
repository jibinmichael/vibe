"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { ListTree } from "lucide-react"
import { AutomationAiSidePanel } from "@/components/automation/AutomationAiSidePanel"
import {
  CHATBOT_BUILD_MS,
  CHATBOT_NAME,
  ChatbotBuildAgentResponse,
  ChatbotFlowCanvas,
  DEFAULT_CHATBOT_COMPOSER,
} from "@/components/automation/chatbot-builder/ChatbotBuilderCanvas"
import {
  AUTOMATION_DOT_GRID_STYLE,
  AUTOMATION_SIDEPANEL_DURATION,
  AUTOMATION_SIDEPANEL_EASE,
} from "@/components/automation/automationShared"
import { ThinkingIndicator } from "@/components/chat/ThinkingIndicator"
import { PlanWithVibeFab } from "@/components/fab/PlanWithVibeFab"

const SIDEPANEL_DURATION = AUTOMATION_SIDEPANEL_DURATION
const SIDEPANEL_EASE = AUTOMATION_SIDEPANEL_EASE

type ChatbotCanvasPhase = "ghost" | "building" | "ready"

export default function ChatbotBuilderPage() {
  const [panelOpen, setPanelOpen] = useState(true)
  const [composerValue, setComposerValue] = useState(DEFAULT_CHATBOT_COMPOSER)
  const [userMessages, setUserMessages] = useState<string[]>([])
  const [canvasPhase, setCanvasPhase] = useState<ChatbotCanvasPhase>("ghost")
  const readyTimerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (readyTimerRef.current !== undefined) {
        window.clearTimeout(readyTimerRef.current)
      }
    }
  }, [])

  const handleClose = () => {
    setPanelOpen(false)
    setComposerValue(DEFAULT_CHATBOT_COMPOSER)
  }

  const handleSend = (text: string) => {
    setUserMessages((prev) => [...prev, text])
    setCanvasPhase("building")
    if (readyTimerRef.current !== undefined) {
      window.clearTimeout(readyTimerRef.current)
    }
    readyTimerRef.current = window.setTimeout(() => {
      setCanvasPhase("ready")
      readyTimerRef.current = undefined
    }, CHATBOT_BUILD_MS)
  }

  const chip = {
    label: CHATBOT_NAME,
    icon: <ListTree className="size-3.5 text-neutral-600" aria-hidden strokeWidth={2} />,
  }

  const streamFooter: ReactNode | undefined =
    userMessages.length === 0 ? undefined : canvasPhase === "building" ? (
      <div style={{ padding: "16px 4px" }}>
        <ThinkingIndicator />
      </div>
    ) : (
      <ChatbotBuildAgentResponse />
    )

  const showLiveFlow = userMessages.length > 0 && canvasPhase === "ready"

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 w-full overflow-hidden bg-[#F9FAFB]">
      <main
        className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        style={{
          paddingRight: panelOpen ? 420 : 0,
          transition: `padding-right ${SIDEPANEL_DURATION} ${SIDEPANEL_EASE}`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={AUTOMATION_DOT_GRID_STYLE as CSSProperties}
          aria-hidden
        />

        <p
          className="pointer-events-none absolute top-3 right-0 left-0 z-20 mx-auto max-w-[90vw] text-center text-[11px] font-medium tracking-wide text-black/40"
          style={{ lineHeight: 1.35 }}
        >
          {CHATBOT_NAME}
        </p>

        <div className="relative z-10 h-full min-h-0 w-full flex-1 pt-9">
          <ChatbotFlowCanvas showLive={showLiveFlow} />
        </div>
      </main>

      <AutomationAiSidePanel
        title="Create a welcome bot series"
        ariaLabel="Create a welcome bot series"
        panelOpen={panelOpen}
        onClose={handleClose}
        userMessages={userMessages}
        composerValue={composerValue}
        onComposerChange={setComposerValue}
        onSend={handleSend}
        chip={chip}
        streamFooter={streamFooter}
        {...(userMessages.length > 0 && canvasPhase === "ready"
          ? { streamAutoScrollKey: userMessages.length }
          : {})}
      />

      {!panelOpen && (
        <PlanWithVibeFab label="Build Automations with Vibe" onClick={() => setPanelOpen(true)} />
      )}
    </div>
  )
}
