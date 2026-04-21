"use client"

/**
 * ChartArtifact — a chart wrapped in the artifact-card shell.
 *
 * Header: title on the left, chart-type segmented control on the right
 * (Bar / Line / Pie, icon-only). Body: Recharts chart that swaps type
 * based on selected tab.
 *
 * Sits inside an assistant response row at full column width (680px).
 * Data shape is generic — each datum has a label, a value, and an
 * optional status that drives color.
 */

import { useEffect, useRef, useState } from "react"
import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from "react"
import { Cursor } from "@phosphor-icons/react"
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { ActiveDotProps, DotItemDotProps } from "recharts"
import type { BarRectangleItem } from "recharts/types/cartesian/Bar"

export type ChartDatumStatus = "strong" | "good" | "normal" | "weak"

export type ChartDatum = {
  label: string
  value: number
  status?: ChartDatumStatus
  followUps?: string[]
}

export type PinpointSelectPayload = {
  chartTitle: string
  datum: ChartDatum
  prompt: string
}

type ChartArtifactProps = {
  title: string
  data: ChartDatum[]
  defaultType?: "bar" | "line" | "pie"
  onPinpointSelect?: (payload: PinpointSelectPayload) => void
}

const STATUS_COLOR: Record<ChartDatumStatus, string> = {
  strong: "#0a84ff",
  good: "#5aaaff",
  normal: "#bfd8f5",
  weak: "#f0a6a0",
}

/** Body height; inner plot area is smaller so ResponsiveContainer gets a definite size during SSG (avoids Recharts -1×-1). */
const CHART_BODY_HEIGHT_PX = 260
const CHART_BODY_PADDING_TOP = 18
const CHART_BODY_PADDING_BOTTOM = 14
const CHART_PLOT_HEIGHT_PX =
  CHART_BODY_HEIGHT_PX - CHART_BODY_PADDING_TOP - CHART_BODY_PADDING_BOTTOM

function colorFor(datum: ChartDatum): string {
  return STATUS_COLOR[datum.status ?? "good"]
}

export function ChartArtifact({
  title,
  data,
  defaultType = "bar",
  onPinpointSelect,
}: ChartArtifactProps) {
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">(defaultType)
  const [pinpointActive, setPinpointActive] = useState(false)
  const [clickedDatum, setClickedDatum] = useState<ChartDatum | null>(null)
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null)
  const [cursorPos, setCursorPos] = useState<{
    x: number
    y: number
    bw: number
    bh: number
  } | null>(null)
  /** Recharts measures the DOM during render; skip until mounted so SSG/prerender never hits width/height -1. */
  const [plotMounted, setPlotMounted] = useState(false)
  const bodyRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    queueMicrotask(() => setPlotMounted(true))
  }, [])

  const handlePinpointClick = (datum: ChartDatum, event: ReactMouseEvent | MouseEvent) => {
    if (!pinpointActive) return
    if (!bodyRef.current) return
    const rect = bodyRef.current.getBoundingClientRect()
    setClickedDatum(datum)
    setMenuAnchor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  useEffect(() => {
    if (!pinpointActive && !clickedDatum) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setClickedDatum(null)
        setMenuAnchor(null)
        setPinpointActive(false)
        setCursorPos(null)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [pinpointActive, clickedDatum])

  return (
    <div
      className="chart-artifact bg-white"
      data-pinpoint={pinpointActive ? "true" : "false"}
      data-menu-open={clickedDatum ? "true" : "false"}
      style={{
        width: "100%",
        borderRadius: 10,
        boxShadow: "0 0 0 0.5px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <style>{`
    .chart-artifact .chart-artifact-body {
      -webkit-tap-highlight-color: transparent !important;
    }
    .chart-artifact .recharts-wrapper,
    .chart-artifact .recharts-wrapper:focus,
    .chart-artifact .recharts-wrapper:focus-visible,
    .chart-artifact .recharts-surface,
    .chart-artifact .recharts-surface:focus,
    .chart-artifact .recharts-surface:focus-visible,
    .chart-artifact svg:focus,
    .chart-artifact svg:focus-visible {
      outline: none !important;
    }
    .chart-artifact .chart-artifact-body .recharts-wrapper,
    .chart-artifact .chart-artifact-body .recharts-wrapper *,
    .chart-artifact .chart-artifact-body .recharts-wrapper *:hover,
    .chart-artifact .chart-artifact-body .recharts-wrapper *:focus,
    .chart-artifact .chart-artifact-body .recharts-wrapper *:focus-visible,
    .chart-artifact .chart-artifact-body .recharts-wrapper *:focus-within,
    .chart-artifact .chart-artifact-body .recharts-wrapper *:active {
      outline: none !important;
      box-shadow: none !important;
    }
    .chart-artifact .chart-artifact-body svg,
    .chart-artifact .chart-artifact-body svg * {
      outline: none !important;
      box-shadow: none !important;
    }
    .chart-artifact .chart-artifact-body .recharts-tooltip-cursor,
    .chart-artifact .chart-artifact-body .recharts-cursor,
    .chart-artifact .chart-artifact-body .recharts-layer-recharts-tooltip-cursor {
      display: none !important;
    }
    .chart-artifact .chart-artifact-body .recharts-active-bar {
      stroke: transparent !important;
      filter: none !important;
    }
    .chart-artifact[data-pinpoint="true"][data-menu-open="false"] .chart-artifact-body,
    .chart-artifact[data-pinpoint="true"][data-menu-open="false"] .chart-artifact-body * {
      cursor: none !important;
    }
  `}</style>
      <div
        className="chart-artifact-head flex items-center justify-between"
        style={{
          padding: "10px 14px",
          background: "#FBFBFA",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <div className="chart-artifact-title-group flex items-center gap-2">
          <span
            className="chart-artifact-title"
            style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.82)" }}
          >
            {title}
          </span>
        </div>

        <div className="chart-artifact-head-actions flex items-center gap-2">
          <div
            className="chart-artifact-tabs inline-flex items-center"
            role="tablist"
            aria-label="Chart type"
            style={{
              background: "rgba(0,0,0,0.04)",
              borderRadius: 6,
              padding: 2,
              gap: 2,
            }}
          >
            <ChartTab
              label="Bar chart"
              active={chartType === "bar"}
              onClick={() => setChartType("bar")}
              icon={<BarChart3 size={12} strokeWidth={2} />}
            />
            <ChartTab
              label="Line chart"
              active={chartType === "line"}
              onClick={() => setChartType("line")}
              icon={<LineIcon size={12} strokeWidth={2} />}
            />
            <ChartTab
              label="Pie chart"
              active={chartType === "pie"}
              onClick={() => setChartType("pie")}
              icon={<PieIcon size={12} strokeWidth={2} />}
            />
          </div>
          <PinpointButton
            active={pinpointActive}
            onToggle={() => {
              setPinpointActive((v) => {
                const next = !v
                if (!next) setCursorPos(null)
                return next
              })
            }}
          />
        </div>
      </div>

      <div
        ref={bodyRef}
        className="chart-artifact-body"
        onMouseMove={(e) => {
          if (!pinpointActive || !bodyRef.current) return
          const rect = bodyRef.current.getBoundingClientRect()
          setCursorPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            bw: rect.width,
            bh: rect.height,
          })
        }}
        onMouseLeave={() => setCursorPos(null)}
        style={{
          boxSizing: "border-box",
          padding: `${CHART_BODY_PADDING_TOP}px 18px ${CHART_BODY_PADDING_BOTTOM}px`,
          height: CHART_BODY_HEIGHT_PX,
          outline: "none",
          position: "relative",
          cursor: pinpointActive && !clickedDatum ? "none" : "default",
        }}
      >
        <div
          className="chart-artifact-plot"
          style={{
            width: "100%",
            minWidth: 0,
            height: CHART_PLOT_HEIGHT_PX,
            minHeight: CHART_PLOT_HEIGHT_PX,
            position: "relative",
          }}
        >
          {!plotMounted ? (
            <div aria-hidden style={{ height: CHART_PLOT_HEIGHT_PX }} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10.5, fill: "rgba(0,0,0,0.45)" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 10.5, fill: "rgba(0,0,0,0.45)" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    cursor={pinpointActive ? false : { fill: "rgba(0,0,0,0.03)" }}
                    contentStyle={tooltipStyle}
                    {...(pinpointActive ? { active: false } : {})}
                  />
                  <Bar
                    dataKey="value"
                    radius={[3, 3, 0, 0]}
                    {...(pinpointActive ? { activeBar: false } : {})}
                    onClick={(barData, _index, event) => {
                      handlePinpointClick(
                        (barData as BarRectangleItem).payload as ChartDatum,
                        event as unknown as ReactMouseEvent,
                      )
                    }}
                  >
                    {data.map((d, i) => (
                      <Cell key={i} fill={colorFor(d)} />
                    ))}
                  </Bar>
                </BarChart>
              ) : chartType === "line" ? (
                <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10.5, fill: "rgba(0,0,0,0.45)" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 10.5, fill: "rgba(0,0,0,0.45)" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    cursor={pinpointActive ? false : { stroke: "rgba(0,0,0,0.1)" }}
                    contentStyle={tooltipStyle}
                    {...(pinpointActive ? { active: false } : {})}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0a84ff"
                    strokeWidth={2}
                    dot={(props: DotItemDotProps) => {
                      const { cx, cy, payload, index } = props
                      const datum = payload as ChartDatum
                      if (cx == null || cy == null) {
                        return <g key={`dot-${index}`} />
                      }
                      return (
                        <circle
                          key={`dot-${index}`}
                          cx={cx}
                          cy={cy}
                          r={3}
                          fill="#0a84ff"
                          style={{ cursor: pinpointActive ? "none" : "default" }}
                          onClick={(e) => handlePinpointClick(datum, e)}
                          pointerEvents="all"
                        />
                      )
                    }}
                    activeDot={(props: ActiveDotProps) => {
                      const { cx, cy, payload, index } = props
                      const datum = payload as ChartDatum
                      if (cx == null || cy == null) {
                        return <g key={`active-dot-${index}`} />
                      }
                      return (
                        <circle
                          key={`active-dot-${index}`}
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill="#0a84ff"
                          onClick={(e) => handlePinpointClick(datum, e)}
                          pointerEvents="all"
                        />
                      )
                    }}
                  />
                </LineChart>
              ) : (
                <PieChart>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    label={{ fontSize: 10, fill: "rgba(0,0,0,0.55)" }}
                    onClick={(pieData, _index, event) => {
                      const datum = (pieData.payload ?? pieData) as ChartDatum
                      handlePinpointClick(datum, event)
                    }}
                  >
                    {data.map((d, i) => (
                      <Cell
                        key={i}
                        fill={colorFor(d)}
                        style={{ cursor: pinpointActive ? "none" : "default" }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {pinpointActive && !clickedDatum && cursorPos && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: cursorPos.x,
              top: cursorPos.y,
              pointerEvents: "none",
              transform: "translate(-4px, -4px)",
              zIndex: 10,
            }}
          >
            <Cursor weight="duotone" size={18} color="#0a84ff" style={{ display: "block" }} />
            <div
              style={{
                position: "absolute",
                ...(cursorPos.y > cursorPos.bh - 48
                  ? {
                      top: "auto",
                      bottom: "100%",
                      marginBottom: 6,
                    }
                  : {
                      top: 22,
                      bottom: "auto",
                      marginBottom: 0,
                    }),
                ...(cursorPos.x > cursorPos.bw - 188
                  ? {
                      left: 0,
                      right: "auto",
                      transform: "translateX(calc(-100% - 6px))",
                    }
                  : {
                      left: 16,
                      right: "auto",
                      transform: "none",
                    }),
                background: "rgba(24,24,24,0.92)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 500,
                padding: "5px 9px",
                borderRadius: 5,
                whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              Click any data point
            </div>
          </div>
        )}

        {clickedDatum && menuAnchor && (
          <>
            <div
              className="fixed inset-0"
              style={{ zIndex: 40 }}
              onClick={() => {
                setClickedDatum(null)
                setMenuAnchor(null)
              }}
              aria-hidden="true"
            />
            <div
              role="menu"
              aria-label="Ask further"
              className="pinpoint-menu"
              style={{
                position: "absolute",
                left: menuAnchor.x,
                top: menuAnchor.y + 4,
                minWidth: 320,
                maxWidth: 360,
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 0 0 0.5px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.1)",
                padding: 4,
                zIndex: 50,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(0,0,0,0.5)",
                  letterSpacing: 0,
                  textTransform: "none",
                  padding: "6px 10px 4px",
                }}
              >
                Ask further
              </div>
              <div
                aria-hidden="true"
                style={{
                  height: 1,
                  background: "rgba(0,0,0,0.06)",
                  margin: "2px 4px 4px",
                }}
              />
              {(clickedDatum.followUps ?? defaultFollowUps(clickedDatum)).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onPinpointSelect?.({
                      chartTitle: title,
                      datum: clickedDatum,
                      prompt,
                    })
                    setClickedDatum(null)
                    setMenuAnchor(null)
                    setPinpointActive(false)
                    setCursorPos(null)
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.04)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent"
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    background: "transparent",
                    fontSize: 12.5,
                    color: "rgba(0,0,0,0.82)",
                    padding: "7px 10px",
                    lineHeight: 1.4,
                    borderRadius: 4,
                    cursor: "pointer",
                    whiteSpace: "normal",
                    fontFamily: "inherit",
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const tooltipStyle: CSSProperties = {
  fontSize: 11,
  background: "#fff",
  border: "none",
  borderRadius: 6,
  boxShadow:
    "0 6px 20px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.08)",
  padding: "6px 10px 6px 14px",
}

function ChartTab({
  label,
  active,
  onClick,
  icon,
}: {
  label: string
  active: boolean
  onClick: () => void
  icon: ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={label}
      onClick={onClick}
      className="chart-artifact-tab"
      style={{
        padding: "4px 8px",
        borderRadius: 4,
        color: active ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.55)",
        background: active ? "#fff" : "transparent",
        boxShadow: active ? "0 0 0 0.5px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)" : "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: "pointer",
        transition: "background 150ms, color 150ms, box-shadow 150ms",
      }}
    >
      {icon}
    </button>
  )
}

function PinpointButton({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  const [hover, setHover] = useState(false)

  const restBg = "rgba(10,132,255,0.08)"
  const hoverBg = "rgba(10,132,255,0.14)"
  const activeBg = "rgba(10,132,255,0.18)"

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        aria-label="Pinpoint — snap to a data point"
        aria-pressed={active}
        onClick={onToggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="chart-artifact-pinpoint"
        style={{
          padding: 5,
          borderRadius: 5,
          border: "none",
          background: active ? activeBg : hover ? hoverBg : restBg,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 150ms",
        }}
      >
        <Cursor weight="duotone" size={15} color="#0a84ff" />
      </button>
      {hover && !active && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "rgba(24,24,24,0.92)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 500,
            padding: "5px 9px",
            borderRadius: 5,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          Snap any data point to ask follow-ups
        </div>
      )}
    </div>
  )
}

function defaultFollowUps(datum: ChartDatum): string[] {
  const label = datum.label
  const status = datum.status ?? "normal"

  if (status === "weak") {
    return [
      `Why is ${label} underperforming?`,
      `What's driving the drop at ${label}?`,
      `When did ${label} start trending down?`,
      `What should I do about ${label}?`,
    ]
  }

  if (status === "strong") {
    return [
      `Why is ${label} performing so well?`,
      `What's driving the lift at ${label}?`,
      `Can we replicate what's working at ${label}?`,
      `Who contributed most to ${label}'s result?`,
    ]
  }

  if (status === "good") {
    return [
      `How is ${label} trending week over week?`,
      `What's influencing ${label} right now?`,
      `Compare ${label} to its 4-week average`,
      `Break ${label} down by agent`,
    ]
  }

  // normal / no status
  return [
    `Tell me more about ${label}`,
    `How does ${label} compare to the rest?`,
    `What's influencing ${label}?`,
    `Break ${label} down further`,
  ]
}
