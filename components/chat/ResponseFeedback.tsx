"use client"

/**
 * ResponseFeedback — a small 5-star rating widget that sits at the end
 * of an assistant response.
 *
 * Flow:
 *   1. Rest — pill shows "How was this result?" + 5 grey stars
 *   2. Hover — stars fill amber up to the hovered one (preview)
 *   3. Submit — click a star, calls onRate, stars disappear, pill shows
 *      "Thanks for the feedback" for 5 seconds
 *   4. Auto-dismiss — after 5s the whole pill animates out and unmounts
 *
 * Once submitted, it cannot be re-rated in the same session. Mount a fresh
 * instance if you need a new rating cycle.
 */

import { useEffect, useState } from "react"

type ResponseFeedbackProps = {
  onRate?: (rating: number) => void
  question?: string
}

type Phase = "rest" | "submitted" | "dismissed"

const AMBER = "#f5a623"
const REST_GREY = "rgba(0,0,0,0.2)"

export function ResponseFeedback({
  onRate,
  question = "How was this result?",
}: ResponseFeedbackProps) {
  const [phase, setPhase] = useState<Phase>("rest")
  const [hoverRating, setHoverRating] = useState<number>(0)

  // After submit, wait 5s then dismiss
  useEffect(() => {
    if (phase !== "submitted") return
    const t = window.setTimeout(() => setPhase("dismissed"), 5000)
    return () => window.clearTimeout(t)
  }, [phase])

  if (phase === "dismissed") return null

  const handleSubmit = (rating: number) => {
    onRate?.(rating)
    setPhase("submitted")
    setHoverRating(0)
  }

  if (phase === "rest") {
    return (
      <div
        className="response-feedback response-feedback-rest inline-flex items-center"
        style={{
          gap: 10,
          background: "rgba(0,0,0,0.04)",
          borderRadius: 9999,
          padding: "6px 14px",
          transition: "opacity 300ms ease",
        }}
        role="group"
        aria-label="Rate this response"
      >
        <span
          className="response-feedback-question"
          style={{
            fontSize: 13,
            color: "rgba(0,0,0,0.65)",
            fontWeight: 400,
          }}
        >
          {question}
        </span>
        <span
          className="response-feedback-stars"
          style={{ display: "inline-flex", gap: 2 }}
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              active={i <= hoverRating}
              onMouseEnter={() => setHoverRating(i)}
              onClick={() => handleSubmit(i)}
              label={`${i} ${i === 1 ? "star" : "stars"}`}
            />
          ))}
        </span>
      </div>
    )
  }

  // phase === "submitted"
  return (
    <div
      className="response-feedback response-feedback-submitted inline-flex items-center"
      style={{
        gap: 6,
        background: "transparent",
        padding: 0,
        transition: "opacity 300ms ease",
      }}
      role="status"
      aria-live="polite"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "rgba(0,0,0,0.55)", flexShrink: 0 }}
        aria-hidden="true"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
      <span
        className="response-feedback-thanks"
        style={{
          fontSize: 13,
          color: "rgba(0,0,0,0.55)",
          fontWeight: 400,
        }}
      >
        Thanks for the feedback
      </span>
    </div>
  )
}

function Star({
  active,
  onMouseEnter,
  onClick,
  label,
}: {
  active: boolean
  onMouseEnter: () => void
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className="response-feedback-star"
      style={{
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
        color: active ? AMBER : REST_GREY,
        transition: "color 120ms, transform 120ms",
        lineHeight: 0,
        display: "inline-flex",
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.92)"
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)"
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2l2.76 6.35 6.91.6-5.22 4.58 1.57 6.77L12 16.95l-6.02 3.35 1.57-6.77L2.33 8.95l6.91-.6L12 2z" />
      </svg>
    </button>
  )
}
