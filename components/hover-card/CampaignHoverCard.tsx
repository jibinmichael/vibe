"use client"

import {
  HoverCardIconAudience,
  HoverCardIconContent,
  HoverCardIconSchedule,
} from "@/components/hover-card/hover-card-icons"

/**
 * Campaign hover card — pixel-aligned to Figma Campaigns 2.0 (node 163:379).
 * Icons match Figma-exported SVG paths (see hover-card-icons.tsx).
 * Uses app typography tokens via Tailwind theme classes.
 */

const HOVER_CARD_Z = 2147483647

const COL = {
  title: "#353735",
  body: "#505451",
  link: "#0c70ea",
  accent: "#b658c4",
  badgeFill: "#e7e9e8",
} as const

export type CampaignHoverCardProps = {
  className?: string
  title?: string
  scheduledAt?: string
  scheduleStatus?: string
  contentLabel?: string
  contentType?: string
  audienceSummary?: string
  audienceTags?: readonly { label: string; variant: "outline" | "ghost" }[]
  /** When false, hides the footer actions row. */
  showActions?: boolean
  onDelete?: () => void
  onEdit?: () => void
}

export function CampaignHoverCard({
  className = "",
  title = "",
  scheduledAt,
  scheduleStatus,
  contentLabel,
  contentType,
  audienceSummary,
  audienceTags,
  showActions = true,
  onDelete,
  onEdit,
}: CampaignHoverCardProps) {
  const showSchedule = scheduledAt != null || scheduleStatus != null
  const showContent = contentLabel != null && contentLabel !== ""
  const showAudience =
    (audienceSummary != null && audienceSummary !== "") ||
    (audienceTags != null && audienceTags.length > 0)

  return (
    <article
      className={`isolate inline-flex max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[12px] bg-white p-2 ${className}`}
      style={{
        zIndex: HOVER_CARD_Z,
        boxShadow: "0px 8px 10px -6px rgba(27,29,28,0.1), 0px 20px 25px -5px rgba(27,29,28,0.1)",
      }}
      data-name="hovercard"
      onPointerDownCapture={(e) => e.stopPropagation()}
    >
      <div className="flex w-full flex-col gap-3 overflow-hidden p-3">
        {/* Header */}
        <div className="flex w-full items-center gap-2 overflow-hidden">
          <span className="size-4 shrink-0" style={{ backgroundColor: COL.accent }} aria-hidden />
          <p
            className="min-w-0 flex-1 text-[length:var(--text-body-sm)] leading-5 font-semibold tracking-normal"
            style={{ color: COL.title }}
          >
            {title}
          </p>
        </div>

        {/* Schedule */}
        {showSchedule ? (
          <div className="flex w-full items-center gap-2 overflow-hidden py-1">
            <span className="relative flex size-4 shrink-0 items-center justify-center">
              <HoverCardIconSchedule className="block shrink-0" />
            </span>
            {scheduledAt != null && scheduledAt !== "" ? (
              <p
                className="min-w-0 shrink text-[length:var(--text-micro)] leading-4 font-normal tracking-normal whitespace-pre-wrap"
                style={{ color: COL.body }}
              >
                {scheduledAt}
              </p>
            ) : null}
            {scheduleStatus != null && scheduleStatus !== "" ? (
              <span
                className="inline-flex shrink-0 items-center justify-center gap-0.5 rounded-full px-1.5 py-0.5 text-[length:var(--text-micro)] leading-4 font-medium whitespace-nowrap"
                style={{ backgroundColor: COL.badgeFill, color: COL.body }}
              >
                {scheduleStatus}
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Content */}
        {showContent ? (
          <div className="flex w-full items-center gap-2 overflow-hidden py-1">
            <span className="relative flex size-4 shrink-0 items-center justify-center">
              <HoverCardIconContent className="block shrink-0" />
            </span>
            <p
              className="min-w-0 shrink text-[length:var(--text-micro)] leading-4 font-normal tracking-normal whitespace-pre-wrap"
              style={{ color: COL.body }}
            >
              {contentLabel}
            </p>
            {contentType != null && contentType !== "" ? (
              <span
                className="inline-flex shrink-0 items-center justify-center gap-0.5 rounded-full px-1.5 py-0.5 text-[length:var(--text-micro)] leading-4 font-medium whitespace-nowrap"
                style={{ backgroundColor: COL.badgeFill, color: COL.body }}
              >
                {contentType}
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Audience */}
        {showAudience ? (
          <div className="flex w-full flex-wrap items-center gap-2 overflow-hidden py-1">
            <span className="relative flex size-4 shrink-0 items-center justify-center">
              <HoverCardIconAudience className="block shrink-0" />
            </span>
            {audienceSummary != null && audienceSummary !== "" ? (
              <p
                className="min-w-0 shrink text-[length:var(--text-micro)] leading-4 font-normal tracking-normal whitespace-pre-wrap"
                style={{ color: COL.body }}
              >
                {audienceSummary}
              </p>
            ) : null}
            {audienceTags?.map((tag) => (
              <span
                key={tag.label}
                className={`inline-flex shrink-0 items-center justify-center gap-0.5 rounded-full px-1.5 py-0.5 text-[length:var(--text-micro)] leading-4 font-medium whitespace-nowrap ${
                  tag.variant === "outline" ? "border border-solid" : ""
                }`}
                style={{
                  color: COL.body,
                  borderColor: tag.variant === "outline" ? COL.body : "transparent",
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        ) : null}

        {/* Actions */}
        {showActions ? (
          <div
            className="flex w-full items-center gap-2 overflow-hidden py-1.5 text-[length:var(--text-micro)] leading-4 font-normal whitespace-nowrap"
            style={{ color: COL.body }}
          >
            <button
              type="button"
              className="cursor-pointer bg-transparent p-0 font-[inherit] leading-[inherit] tracking-normal transition-opacity hover:opacity-80"
              style={{ color: COL.body }}
              onClick={onDelete}
            >
              Delete campaign
            </button>
            <button
              type="button"
              className="cursor-pointer bg-transparent p-0 font-[inherit] leading-[inherit] tracking-normal transition-opacity hover:opacity-80"
              style={{ color: COL.link }}
              onClick={onEdit}
            >
              Edit campaign
            </button>
          </div>
        ) : null}
      </div>
    </article>
  )
}
