"use client"

/**
 * Chart artifact playground — isolated render of ChartArtifact.
 * Demonstrates the bar/line/pie tabs with a shared dataset so the
 * user can switch and see how each chart type renders.
 */

import { ChoiceArtifact, type ChoiceOption } from "@/components/chat/ChoiceArtifact"
import { ChartArtifact, type ChartDatum } from "@/components/chat/ChartArtifact"

const CAMPAIGN_DATA: ChartDatum[] = [
  { label: "Black Friday", value: 12.8, status: "strong" },
  { label: "Welcome", value: 8.1, status: "good" },
  { label: "Abandoned", value: 2.9, status: "weak" },
  { label: "Feedback", value: 6.7, status: "good" },
  { label: "Product Launch", value: 14.5, status: "strong" },
  { label: "Win-back", value: 2.1, status: "weak" },
]

const WEEKLY_OPTIONS: ChoiceOption[] = [
  { id: "mon-9", label: "Monday 9am — start-of-week kickoff" },
  { id: "tue-10", label: "Tuesday 10am — after the Monday scramble" },
  { id: "wed-11", label: "Wednesday 11am — mid-week check-in" },
  { id: "thu-2", label: "Thursday 2pm — afternoon review window" },
  { id: "fri-3", label: "Friday 3pm — end-of-week wrap" },
]

export default function ArtifactPlaygroundPage() {
  return (
    <div className="artifact-playground-page flex min-h-screen flex-col items-center px-8 py-16">
      <div className="artifact-playground-container flex w-full max-w-[680px] flex-col gap-6">
        <header className="artifact-playground-header flex flex-col gap-2">
          <h1
            className="artifact-playground-title text-[24px] font-semibold tracking-tight"
            style={{ color: "rgba(0,0,0,0.85)" }}
          >
            Chart artifact
          </h1>
          <p
            className="artifact-playground-subtitle text-[13px] leading-[1.55]"
            style={{ color: "rgba(0,0,0,0.55)" }}
          >
            Wraps a chart inside the assistant-response artifact shell. Switch between bar / line /
            pie using the segmented control in the header. Data is passed in as a generic array of{" "}
            {"{ label, value, status }"} — status drives color.
          </p>
        </header>

        <ChartArtifact title="Campaigns — last 30 days" data={CAMPAIGN_DATA} />

        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
          <header style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "rgba(0,0,0,0.85)",
                letterSpacing: "-0.005em",
              }}
            >
              Choice artifact
            </h2>
            <p style={{ fontSize: 13, color: "rgba(0,0,0,0.55)", lineHeight: 1.55 }}>
              Inline single-choice artifact for assistant responses. Shares the same shell as the
              chart artifact. Kbd-styled number chips — tap or press the digit.
            </p>
          </header>

          <ChoiceArtifact
            title="Weekly rhythm"
            question="Which weekly rhythm works best for your team? Choose one or press the number."
            options={WEEKLY_OPTIONS}
            onSelect={(opt) => console.log("Picked:", opt)}
          />
        </div>
      </div>
    </div>
  )
}
