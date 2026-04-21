"use client"

import { useMemo, useState } from "react"

/**
 * MonthCalendar — a full-width month view calendar.
 *
 * Shows weekday labels, then a grid of date cells spanning the full
 * month. Leading cells (dates from the previous month) are visible but
 * rendered with subtle diagonal stripes and reduced opacity to indicate
 * they are disabled. Same treatment for trailing days if the grid ends
 * before filling a full week row.
 *
 * Optional chevron navigation updates the visible month via callbacks from
 * the parent.
 *
 * Props:
 *   - year: the year shown (e.g. 2026)
 *   - month: 0-indexed month (0 = January, 3 = April)
 *   - todayDate: optional number for today's date highlight
 *   - onPrevMonth / onNextMonth / canGoBack: optional month navigation
 *   - onCellClick: optional handler when user activates an in-month date cell
 */

export type CampaignPill = {
  id: string
  date: number // 1..31 (current month only)
  title: string
}

export type HolidayHint = {
  id: string
  date: number // 1..31
  holidayName: string // shown as the red tag next to the date number
  message: string // observational copy; render with <b> for bolded parts
}

export type SegmentHint = {
  id: string
  date: number // 1..31
  tagLabel: string // the right-side chip text, e.g. "OPPORTUNITY"
  message: string // copy; supports <b>..</b> for emphasis
}

type MonthCalendarProps = {
  year: number
  month: number
  todayDate?: number
  scanning?: boolean
  campaigns?: CampaignPill[]
  holidayHints?: HolidayHint[]
  segmentHints?: SegmentHint[]
  onPrevMonth?: () => void
  onNextMonth?: () => void
  canGoBack?: boolean
  onCellClick?: (date: number) => void
}

type Cell = {
  date: number
  inMonth: boolean
  isToday: boolean
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function hash32(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  }
  return h >>> 0
}

type MockSentCampaign = { id: string; date: number; title: string }

/** Local mock “completed send” pills — deterministic dates per visible month. */
function buildMockSentCampaigns(year: number, month: number): MockSentCampaign[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const names = [
    "VIP spring touch",
    "Cart recovery batch",
    "Announcement — April drops",
    "Regional festival greet",
    "Renewal reminders",
    "Cold list warm-up",
  ]
  let state = hash32(`${year}-${month}-sent`) | 1
  const rnd = (): number => {
    state = Math.imul(state, 48271) % 0x7fffffff
    return state >>> 0
  }
  const picked = new Set<number>()
  const count = Math.min(6, Math.max(4, Math.floor(daysInMonth / 5)))
  let guard = 0
  while (picked.size < count && guard < 400) {
    guard += 1
    const day = (rnd() % daysInMonth) + 1
    if (picked.has(day)) continue
    picked.add(day)
  }
  const dates = [...picked].sort((a, b) => a - b)
  return dates.map((date, i) => ({
    id: `mock-sent-${year}-${month}-${date}`,
    date,
    title: names[(i + rnd()) % names.length] ?? "Campaign sent",
  }))
}

export function MonthCalendar({
  year,
  month,
  todayDate,
  scanning = false,
  campaigns = [],
  holidayHints = [],
  segmentHints = [],
  onPrevMonth,
  onNextMonth,
  canGoBack = true,
  onCellClick,
}: MonthCalendarProps) {
  const cells = buildCells(year, month, todayDate)
  const monthLabel = `${MONTH_NAMES[month]} ${year}`

  const [showSentCampaigns, setShowSentCampaigns] = useState(true)
  const mockSentCampaigns = useMemo(() => buildMockSentCampaigns(year, month), [year, month])

  return (
    <div
      className="month-calendar flex w-full flex-col"
      data-scanning={scanning ? "true" : "false"}
      style={{
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 0 0 0.5px rgba(0,0,0,0.06)",
        overflow: "visible",
      }}
    >
      <style>{`
        .month-calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
        }
        .month-calendar-cell {
          min-width: 0;
          min-height: 120px;
          padding: 8px 10px;
          border-right: 1px solid rgba(0,0,0,0.05);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: #fff;
        }
        .month-calendar-cell:nth-child(7n) {
          border-right: none;
        }
        .month-calendar-cell[data-in-month="false"] {
          background-color: #FBFBFA;
          background-image: repeating-linear-gradient(
            -45deg,
            rgba(0,0,0,0.025) 0,
            rgba(0,0,0,0.025) 1px,
            transparent 1px,
            transparent 7px
          );
          color: rgba(0,0,0,0.25);
          pointer-events: none;
        }
        .month-calendar-cell[data-today="true"] {
          background: rgba(10,132,255,0.04);
        }
        .month-calendar-date-num {
          font-size: 11.5px;
          font-weight: 500;
          color: rgba(0,0,0,0.6);
          font-variant-numeric: tabular-nums;
          line-height: 1;
        }
        .month-calendar-cell[data-in-month="false"] .month-calendar-date-num {
          color: rgba(0,0,0,0.28);
        }
        .month-calendar-cell[data-today="true"] .month-calendar-date-num {
          color: #0a84ff;
          font-weight: 600;
        }
        /* Scanning: border color cascades across in-month cells one at a time.
           Uses the existing bottom + right borders (no added shadow, no new border). */
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-in-month="true"] {
          animation: monthCalendarCellScan 4.8s ease-in-out infinite;
          border-right-color: rgba(0,0,0,0.05);
          border-bottom-color: rgba(0,0,0,0.05);
        }
        @keyframes monthCalendarCellScan {
          0%, 100% {
            border-right-color: rgba(0,0,0,0.05);
            border-bottom-color: rgba(0,0,0,0.05);
          }
          50% {
            border-right-color: rgba(10,132,255,0.45);
            border-bottom-color: rgba(10,132,255,0.45);
          }
        }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="1"]  { animation-delay: 0ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="2"]  { animation-delay: 80ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="3"]  { animation-delay: 160ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="4"]  { animation-delay: 240ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="5"]  { animation-delay: 320ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="6"]  { animation-delay: 400ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="7"]  { animation-delay: 480ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="8"]  { animation-delay: 560ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="9"]  { animation-delay: 640ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="10"] { animation-delay: 720ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="11"] { animation-delay: 800ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="12"] { animation-delay: 880ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="13"] { animation-delay: 960ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="14"] { animation-delay: 1040ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="15"] { animation-delay: 1120ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="16"] { animation-delay: 1200ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="17"] { animation-delay: 1280ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="18"] { animation-delay: 1360ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="19"] { animation-delay: 1440ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="20"] { animation-delay: 1520ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="21"] { animation-delay: 1600ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="22"] { animation-delay: 1680ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="23"] { animation-delay: 1760ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="24"] { animation-delay: 1840ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="25"] { animation-delay: 1920ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="26"] { animation-delay: 2000ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="27"] { animation-delay: 2080ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="28"] { animation-delay: 2160ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="29"] { animation-delay: 2240ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="30"] { animation-delay: 2320ms; }
        .month-calendar[data-scanning="true"] .month-calendar-cell[data-cell-index="31"] { animation-delay: 2400ms; }
        .month-calendar-draft-event {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          opacity: 0;
          transform: translateY(4px);
          animation: monthCalendarPillIn 420ms ease-out forwards;
        }
        .month-calendar-draft-label {
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(0, 0, 0, 0.38);
          line-height: 1;
        }
        .month-calendar-pill {
          display: block;
          width: 100%;
          box-sizing: border-box;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10.5px;
          font-weight: 500;
          line-height: 1.35;
          color: #0a5fd4;
          background: rgba(10,132,255,0.1);
          white-space: normal;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .month-calendar-sent-row {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          padding-top: 2px;
        }
        .month-calendar-sent-pill {
          display: block;
          width: 100%;
          box-sizing: border-box;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10.5px;
          font-weight: 500;
          line-height: 1.35;
          color: #15803d;
          background: rgba(22, 163, 74, 0.1);
          white-space: normal;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        @keyframes monthCalendarPillIn {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .month-calendar-draft-event-wrap {
          position: relative;
        }
        .month-calendar-date-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          min-width: 0;
        }
        .month-calendar-holiday-tag {
          font-size: 9px;
          font-weight: 600;
          color: rgba(212, 80, 50, 0.85);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          line-height: 1;
        }
        .month-calendar-opportunity-tag {
          font-size: 9px;
          font-weight: 600;
          color: rgba(118, 75, 200, 0.92);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          line-height: 1;
        }

        .month-calendar-opportunity {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          padding: 2px 0 0 0;
          opacity: 0;
          animation: monthCalendarOpportunityIn 420ms ease-out forwards;
        }
        @keyframes monthCalendarOpportunityIn {
          0% { opacity: 0; transform: translateY(2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .month-calendar-opportunity-copy {
          font-size: 10.5px;
          line-height: 1.4;
          color: rgba(0,0,0,0.55);
          font-weight: 400;
        }
        .month-calendar-opportunity-copy b {
          font-weight: 400;
          color: rgba(0,0,0,0.82);
        }
        .month-calendar-nav button:not(:disabled):hover {
          background: rgba(0,0,0,0.04);
        }
        .month-calendar-cell-clickable {
          cursor: default;
        }
        .month-calendar-cell-clickable:hover {
          cursor: pointer;
          background: rgba(10,132,255,0.03);
        }
        .month-calendar-cell-clickable:focus-visible {
          outline: 2px solid rgba(10,132,255,0.4);
          outline-offset: -2px;
        }

        .month-calendar-cell-hover {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 150ms ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .month-calendar-cell-clickable:hover .month-calendar-cell-hover {
          opacity: 1;
        }
        .month-calendar-cell-clickable:focus-visible .month-calendar-cell-hover {
          opacity: 1;
        }

        .month-calendar-cell-hover-tooltip {
          position: absolute;
          bottom: calc(50% - 26px);
          left: 50%;
          transform: translate(-50%, 100%);
          background: rgba(24,24,24,0.92);
          color: #fff;
          font-size: 10.5px;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
          margin-top: 6px;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
      `}</style>

      <header
        className="month-calendar-head flex items-center justify-between gap-4"
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          background: "#FBFBFA",
        }}
      >
        <div
          className="month-calendar-nav"
          role="group"
          aria-label="Change month"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <button
            type="button"
            aria-label="Previous month"
            aria-disabled={!canGoBack}
            onClick={canGoBack ? onPrevMonth : undefined}
            disabled={!canGoBack}
            style={{
              width: 24,
              height: 24,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
              color: canGoBack ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.2)",
              cursor: canGoBack ? "pointer" : "not-allowed",
              padding: 0,
              borderRadius: 4,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "rgba(0,0,0,0.88)",
              letterSpacing: "-0.01em",
              minWidth: 120,
              textAlign: "center",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {monthLabel}
          </span>

          <button
            type="button"
            aria-label="Next month"
            onClick={onNextMonth}
            style={{
              width: 24,
              height: 24,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
              color: "rgba(0,0,0,0.7)",
              cursor: "pointer",
              padding: 0,
              borderRadius: 4,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <label
          className="month-calendar-sent-toggle flex shrink-0 cursor-pointer items-center gap-1.5 select-none"
          style={{ fontSize: 11, fontWeight: 500, color: "rgba(0,0,0,0.55)" }}
        >
          <span>Show send campaign</span>
          <button
            type="button"
            role="switch"
            aria-checked={showSentCampaigns}
            onClick={() => setShowSentCampaigns((v) => !v)}
            className="relative inline-flex h-4 w-[26px] shrink-0 cursor-pointer rounded-full border-0 p-0 transition-colors"
            style={{
              background: showSentCampaigns ? "rgba(22, 163, 74, 0.45)" : "rgba(0,0,0,0.15)",
            }}
          >
            <span
              className="pointer-events-none absolute top-[2px] block size-[12px] rounded-full bg-white shadow-sm transition-[left]"
              style={{
                left: showSentCampaigns ? 12 : 2,
              }}
            />
          </button>
        </label>
      </header>

      <div
        className="month-calendar-daylabels"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          background: "#FBFBFA",
        }}
      >
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            style={{
              padding: "10px 12px",
              fontSize: 10.5,
              fontWeight: 600,
              color: "rgba(0,0,0,0.4)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="month-calendar-grid">
        {cells.map((cell, i) => {
          if (!cell.inMonth) {
            return (
              <div
                key={i}
                className="month-calendar-cell"
                data-in-month="false"
                data-today={cell.isToday ? "true" : "false"}
                data-cell-index={-1}
                aria-disabled={true}
              >
                <span className="month-calendar-date-num">{cell.date}</span>
              </div>
            )
          }

          const cellCampaigns = campaigns.filter((c) => c.date === cell.date)
          const cellSentCampaigns = showSentCampaigns
            ? mockSentCampaigns.filter((s) => s.date === cell.date)
            : []
          const hideHintsForPlan = cellCampaigns.length > 0
          const hints = hideHintsForPlan ? [] : holidayHints.filter((h) => h.date === cell.date)
          const firstHint = hints[0]
          const segmentsForCell = hideHintsForPlan
            ? []
            : segmentHints.filter((s) => s.date === cell.date)

          return (
            <div
              key={i}
              className="month-calendar-cell month-calendar-cell-clickable"
              data-in-month="true"
              data-today={cell.isToday ? "true" : "false"}
              data-cell-index={cell.date}
              role="button"
              tabIndex={0}
              onClick={() => onCellClick?.(cell.date)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onCellClick?.(cell.date)
                }
              }}
              aria-label={`Add campaign on ${cell.date}`}
            >
              <div className="month-calendar-date-row">
                <span className="month-calendar-date-num">{cell.date}</span>
                {firstHint ? (
                  <span className="month-calendar-holiday-tag">{firstHint.holidayName}</span>
                ) : (
                  (() => {
                    const firstSegment = segmentsForCell[0]
                    return firstSegment ? (
                      <span className="month-calendar-opportunity-tag">
                        {firstSegment.tagLabel}
                      </span>
                    ) : null
                  })()
                )}
              </div>
              {hints.map((hint, hintIdx) => (
                <div
                  key={hint.id}
                  className="month-calendar-opportunity"
                  style={{ animationDelay: `${hintIdx * 140}ms` }}
                >
                  <span
                    className="month-calendar-opportunity-copy"
                    dangerouslySetInnerHTML={{ __html: hint.message }}
                  />
                </div>
              ))}
              {segmentsForCell.map((segHint, segIdx) => (
                <div
                  key={segHint.id}
                  className="month-calendar-opportunity"
                  style={{ animationDelay: `${(hints.length + segIdx) * 140}ms` }}
                >
                  <span
                    className="month-calendar-opportunity-copy"
                    dangerouslySetInnerHTML={{ __html: segHint.message }}
                  />
                </div>
              ))}
              {cellCampaigns.map((c, pillIdx) => (
                <div key={c.id} className="month-calendar-draft-event-wrap">
                  <div
                    className="month-calendar-draft-event"
                    style={{ animationDelay: `${pillIdx * 120}ms` }}
                  >
                    <span className="month-calendar-draft-label">Draft</span>
                    <span className="month-calendar-pill">{c.title}</span>
                  </div>
                </div>
              ))}
              {cellSentCampaigns.map((s) => (
                <div key={s.id} className="month-calendar-sent-row">
                  <span className="month-calendar-sent-pill">{s.title}</span>
                </div>
              ))}
              <span className="month-calendar-cell-hover" aria-hidden="true">
                <span className="month-calendar-cell-hover-tooltip">Click to add new</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function buildCells(year: number, month: number, todayDate?: number): Cell[] {
  // Monday-start week. JS Date.getDay() returns 0 (Sun) to 6 (Sat).
  // Convert to 0 (Mon) to 6 (Sun).
  const firstOfMonth = new Date(year, month, 1)
  const jsDow = firstOfMonth.getDay() // 0 = Sun ... 6 = Sat
  const mondayStartDow = (jsDow + 6) % 7 // 0 = Mon ... 6 = Sun

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: Cell[] = []

  // Leading prev-month cells
  for (let i = mondayStartDow - 1; i >= 0; i--) {
    cells.push({
      date: daysInPrevMonth - i,
      inMonth: false,
      isToday: false,
    })
  }

  // Current-month cells
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: d,
      inMonth: true,
      isToday: todayDate === d,
    })
  }

  // Trailing cells to fill the final week row
  const remainder = cells.length % 7
  if (remainder !== 0) {
    const trailing = 7 - remainder
    for (let d = 1; d <= trailing; d++) {
      cells.push({
        date: d,
        inMonth: false,
        isToday: false,
      })
    }
  }

  return cells
}
