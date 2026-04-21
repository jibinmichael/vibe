"use client"

/**
 * InboxAnalyticsDashboard — the main dashboard content (left column).
 *
 * Renders a page header, 4 KPI cards, one large chart, and two smaller
 * charts in a row. All chart artifacts reuse ChartArtifact and forward
 * its onPinpointSelect callback up to the page so snaps can open the
 * side-panel chat with the chosen prompt.
 */

import { ChartArtifact, type ChartDatum } from "@/components/chat/ChartArtifact"
import { cn } from "@/lib/utils"

type Kpi = {
  label: string
  value: string
  delta?: { text: string; direction: "up" | "down" | "flat" }
}

const KPIS: Kpi[] = [
  {
    label: "Conversations",
    value: "1,284",
    delta: { text: "↑ 12% vs last period", direction: "up" },
  },
  {
    label: "Avg first response",
    value: "42m",
    delta: { text: "↓ 18m slower", direction: "down" },
  },
  { label: "Resolved", value: "87%", delta: { text: "— stable", direction: "flat" } },
  { label: "CX score", value: "73", delta: { text: "↓ 8 points", direction: "down" } },
]

const FRT_BY_DAY: ChartDatum[] = [
  { label: "Mon", value: 34, status: "good" },
  { label: "Tue", value: 31, status: "good" },
  { label: "Wed", value: 33, status: "good" },
  { label: "Thu", value: 35, status: "good" },
  { label: "Fri", value: 38, status: "good" },
  { label: "Sat", value: 252, status: "weak" },
  { label: "Sun", value: 204, status: "weak" },
]

const LOAD_BY_AGENT: ChartDatum[] = [
  { label: "Rahul", value: 47, status: "weak" },
  { label: "Priya", value: 32, status: "good" },
  { label: "Anand", value: 28, status: "good" },
  { label: "Meera", value: 18, status: "normal" },
  { label: "Sonia", value: 15, status: "normal" },
]

const REOPENED_BY_WEEK: ChartDatum[] = [
  { label: "W12", value: 8, status: "good" },
  { label: "W13", value: 9, status: "good" },
  { label: "W14", value: 7, status: "good" },
  { label: "W15", value: 23, status: "weak" },
  { label: "W16", value: 10, status: "good" },
]

type DashboardProps = {
  onPinpointSelect: (payload: { chartTitle: string; datum: ChartDatum; prompt: string }) => void
  /** Tighter layout when the Ask-AI side panel is open (narrower main column). */
  sidePanelOpen?: boolean
}

export function InboxAnalyticsDashboard({
  onPinpointSelect,
  sidePanelOpen = false,
}: DashboardProps) {
  const compact = sidePanelOpen

  return (
    <div
      className={cn(
        "analytics-dashboard flex min-h-full w-full flex-col",
        compact ? "gap-6 py-8 md:py-10" : "gap-10 py-10 md:py-14",
      )}
      style={{ minWidth: 0 }}
    >
      <div
        className={cn(
          "mx-auto flex w-full flex-col",
          compact
            ? "max-w-[min(920px,100%)] gap-6 px-5 sm:px-7 lg:px-8"
            : "max-w-[min(1080px,100%)] gap-8 px-6 sm:px-10 lg:px-14",
        )}
      >
        <div
          className="flex flex-col gap-4 border-b border-black/[0.06] pb-5"
          style={{ paddingTop: compact ? 0 : 2 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className="text-[11px] font-semibold tracking-[0.12em] text-black/40 uppercase"
              style={{ letterSpacing: "0.12em" }}
            >
              Inbox · Overview
            </span>
            <span
              className="rounded-full border border-black/[0.08] bg-white px-3 py-1 text-[11px] font-medium text-black/55 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
            >
              Last 30 days
            </span>
          </div>
          <header className="analytics-dashboard-head flex flex-col gap-2">
            <h1
              className="text-[clamp(1.25rem,2vw,1.5rem)] font-semibold tracking-tight text-black/[0.92]"
              style={{ letterSpacing: "-0.02em" }}
            >
              Inbox analytics
            </h1>
            <p className="text-[13px] leading-relaxed text-black/45">
              Track response times, agent load, and conversation quality in one place.
            </p>
            <p className="text-[12px] text-black/38">Reporting period · Saturday, Apr 19</p>
          </header>
        </div>

        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Overview"
            subtitle="Volume and outcome signals for the current period."
          />
          <div
            className="analytics-kpis grid grid-cols-2 gap-3 lg:grid-cols-4"
            style={{ gap: compact ? 10 : 12 }}
          >
            {KPIS.map((kpi) => (
              <KpiCard key={kpi.label} kpi={kpi} compact={compact} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Response health"
            subtitle="Where first-response time spikes across the week."
          />
          <ChartArtifact
            title="First-response time — by day"
            data={FRT_BY_DAY}
            onPinpointSelect={onPinpointSelect}
          />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading
            title="Team & conversation quality"
            subtitle="Balance across agents and reopened ticket trends."
          />
          <div
            className="analytics-charts-row grid grid-cols-1 gap-4 lg:grid-cols-2"
            style={{ gap: compact ? 12 : 16 }}
          >
            <ChartArtifact
              title="Load by agent"
              data={LOAD_BY_AGENT}
              onPinpointSelect={onPinpointSelect}
            />
            <ChartArtifact
              title="Reopened conversations"
              data={REOPENED_BY_WEEK}
              onPinpointSelect={onPinpointSelect}
            />
          </div>
        </section>

        <footer
          className="mt-2 border-t border-black/[0.06] pt-6 text-[11px] leading-relaxed text-black/35"
          style={{ paddingBottom: compact ? 8 : 16 }}
        >
          Figures are illustrative for this playground. Pinpoint any bar or point to ask the AI
          about that slice.
        </footer>
      </div>
    </div>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-[13px] font-semibold tracking-tight text-black/[0.82]">{title}</h2>
      <p className="max-w-xl text-[12px] leading-snug text-black/42">{subtitle}</p>
    </div>
  )
}

function KpiCard({ kpi, compact }: { kpi: Kpi; compact: boolean }) {
  const deltaColor =
    kpi.delta?.direction === "up"
      ? "#059669"
      : kpi.delta?.direction === "down"
        ? "#c44"
        : "rgba(0,0,0,0.4)"

  return (
    <div
      className="analytics-kpi flex flex-col border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
      style={{
        borderRadius: compact ? 9 : 11,
        padding: compact ? "12px 14px" : "14px 16px",
        gap: 5,
      }}
    >
      <span
        style={{
          fontSize: compact ? 10 : 10.5,
          color: "rgba(0,0,0,0.42)",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {kpi.label}
      </span>
      <span
        style={{
          fontSize: compact ? 20 : 22,
          fontWeight: 600,
          color: "rgba(0,0,0,0.88)",
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {kpi.value}
      </span>
      {kpi.delta && (
        <span style={{ fontSize: compact ? 10 : 10.5, color: deltaColor }}>{kpi.delta.text}</span>
      )}
    </div>
  )
}
