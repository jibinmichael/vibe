"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { Clock } from "lucide-react"
import { AutomationAiSidePanel } from "@/components/automation/AutomationAiSidePanel"
import {
  AUTOMATION_DOT_GRID_STYLE,
  AUTOMATION_SIDEPANEL_DURATION,
  AUTOMATION_SIDEPANEL_EASE,
} from "@/components/automation/automationShared"
import {
  DEFAULT_SEQUENCES_COMPOSER,
  SEQUENCE_CYCLE_MS,
  SequencesWorkflowCanvas,
  type SequenceCyclePhase,
} from "@/components/automation/sequences-builder/SequencesWorkflowCanvas"
import { PlanWithVibeFab } from "@/components/fab/PlanWithVibeFab"

const SIDEPANEL_DURATION = AUTOMATION_SIDEPANEL_DURATION
const SIDEPANEL_EASE = AUTOMATION_SIDEPANEL_EASE

export default function SequencesBuilderPage() {
  const [panelOpen, setPanelOpen] = useState(true)
  const [composerValue, setComposerValue] = useState(DEFAULT_SEQUENCES_COMPOSER)
  const [userMessages, setUserMessages] = useState<string[]>([])
  const [phase, setPhase] = useState<SequenceCyclePhase>(0)

  useEffect(() => {
    if (userMessages.length === 0) return
    let intervalId: number | undefined
    const timeoutId = window.setTimeout(() => {
      setPhase(0)
      intervalId = window.setInterval(
        () => setPhase((p) => ((p + 1) % 3) as SequenceCyclePhase),
        SEQUENCE_CYCLE_MS,
      )
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

        <SequencesWorkflowCanvas
          hasMessages={userMessages.length > 0}
          liveCanvasKey={userMessages.length}
          cyclePhase={phase}
        />
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
