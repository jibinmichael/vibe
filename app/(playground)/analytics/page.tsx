"use client"

/**
 * Analytics playground page — wires InboxAnalyticsDashboard on the left
 * with the SidePanelChat on the right. When the user snaps a data point
 * on any chart, the sidepanel opens with the chart's title as a chip and
 * the chosen follow-up prompt pre-filled in the composer. Main column
 * SHRINKS to make room for the 420px panel.
 */

import { useState, type ReactElement } from "react"
import { InboxAnalyticsDashboard } from "@/components/analytics/InboxAnalyticsDashboard"
import { SidePanelChat } from "@/components/analytics/SidePanelChat"
import {
  AUTOMATION_SIDEPANEL_DURATION,
  AUTOMATION_SIDEPANEL_EASE,
} from "@/components/automation/automationShared"
import type { ChatboxChip } from "@/components/chat/Chatbox"
import type { ChartDatum } from "@/components/chat/ChartArtifact"

export default function AnalyticsPlaygroundPage() {
  const [panelOpen, setPanelOpen] = useState(false)
  const [chip, setChip] = useState<ChatboxChip | null>(null)
  const [prefill, setPrefill] = useState("")

  const handlePinpointSelect = ({
    chartTitle,
    prompt,
  }: {
    chartTitle: string
    datum: ChartDatum
    prompt: string
  }) => {
    setChip({
      label: chartTitle,
      icon: makeChartChipIcon(),
      onRemove: () => {
        setChip(null)
        setPrefill("")
      },
    })
    setPrefill(prompt)
    setPanelOpen(true)
  }

  const handleClose = () => {
    setPanelOpen(false)
    setChip(null)
    setPrefill("")
  }

  return (
    <div
      className="analytics-playground-page flex"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f6f9fc 0%, #f0f4f8 52%, #eef2f7 100%)",
      }}
    >
      <main
        className="analytics-playground-main"
        style={{
          flex: 1,
          minWidth: 0,
          paddingRight: panelOpen ? 420 : 0,
          transition: `padding-right ${AUTOMATION_SIDEPANEL_DURATION} ${AUTOMATION_SIDEPANEL_EASE}`,
        }}
      >
        <InboxAnalyticsDashboard
          onPinpointSelect={handlePinpointSelect}
          sidePanelOpen={panelOpen}
        />
      </main>
      <SidePanelChat
        open={panelOpen}
        chip={chip}
        prefill={prefill}
        onClose={handleClose}
        onPrefillChange={setPrefill}
      />
    </div>
  )
}

function makeChartChipIcon(): ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="2.2" height="6" rx="0.6" fill="currentColor" />
      <rect x="5.9" y="3" width="2.2" height="9" rx="0.6" fill="currentColor" />
      <rect x="9.8" y="8" width="2.2" height="4" rx="0.6" fill="currentColor" />
    </svg>
  )
}
