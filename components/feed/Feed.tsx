"use client"

/**
 * Feed — vertically stacked cards.
 *
 * Top card sits fully visible. The two below peek out from under it,
 * scaled down and fading (artifact-stack language). No tilts — stack
 * effect comes purely from vertical overlap + scale + opacity.
 *
 * On hover any card: it jumps to front, lifts 3px, scales 1.015×,
 * resets opacity to full, shadow deepens.
 *
 * All content inside the card. Icon slot is a neutral 36×36 grey box
 * for now — engineers plug real icons in when ready.
 */

import { useState, type ReactNode } from "react"

export type FeedItem = {
  id: string
  eyebrow: string
  title: string
  icon?: ReactNode
}

type FeedProps = {
  items: FeedItem[]
}

// Peek depth + scale + opacity per card index. 0 = front, 1 = mid, 2 = back.
const STACK = [
  { marginTop: 0, scale: 1, opacity: 1 },
  { marginTop: -56, scale: 0.97, opacity: 0.92 },
  { marginTop: -56, scale: 0.94, opacity: 0.82 },
]

export function Feed({ items }: FeedProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  const visible = items.filter((i) => !dismissedIds.has(i.id)).slice(0, 3)

  if (visible.length === 0) return null

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  return (
    <section className="feed flex w-full flex-col">
      <div className="feed-stack flex flex-col items-center">
        {visible.map((item, i) => {
          const layer = STACK[i] ?? STACK[STACK.length - 1]!
          return (
            <FeedCard
              key={item.id}
              item={item}
              zIndex={visible.length - i}
              marginTop={layer.marginTop}
              scale={layer.scale}
              opacity={layer.opacity}
              isActive={i === 0}
              onDismiss={() => handleDismiss(item.id)}
            />
          )
        })}
      </div>
    </section>
  )
}

function FeedCard({
  item,
  zIndex,
  marginTop,
  scale,
  opacity,
  isActive,
  onDismiss,
}: {
  item: FeedItem
  zIndex: number
  marginTop: number
  scale: number
  opacity: number
  isActive: boolean
  onDismiss: () => void
}) {
  const [hover, setHover] = useState(false)
  const [closeHover, setCloseHover] = useState(false)

  return (
    <div
      className="feed-card-wrapper relative"
      style={{
        marginTop,
        zIndex: hover ? 100 : zIndex,
      }}
    >
      <button
        type="button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="feed-card flex items-center gap-3.5 bg-white text-left"
        style={{
          width: 380,
          padding: "14px 18px",
          borderRadius: 14,
          transform: hover ? "translateY(-3px) scale(1.015)" : `scale(${scale})`,
          opacity: hover ? 1 : opacity,
          transition:
            "transform 350ms cubic-bezier(0.32, 0.72, 0, 1), box-shadow 250ms, opacity 200ms",
          boxShadow: hover
            ? "0 10px 26px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.1)"
            : "0 2px 14px rgba(0,0,0,0.07), 0 0 0 0.5px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="feed-card-icon flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "rgba(0,0,0,0.05)",
          }}
          aria-hidden="true"
        >
          {item.icon}
        </div>
        <div className="feed-card-text flex min-w-0 flex-1 flex-col" style={{ gap: 2 }}>
          <span
            className="feed-card-eyebrow text-[10.5px] leading-[1.3] font-medium"
            style={{ color: "rgba(0,0,0,0.45)", letterSpacing: "0.02em" }}
          >
            {item.eyebrow}
          </span>
          <span
            className="feed-card-title text-[13px] leading-[1.35] font-medium"
            style={{ color: "rgba(0,0,0,0.82)" }}
          >
            {item.title}
          </span>
        </div>
      </button>

      {isActive && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          onMouseEnter={() => setCloseHover(true)}
          onMouseLeave={() => setCloseHover(false)}
          aria-label={`Dismiss ${item.eyebrow}`}
          className="feed-card-close absolute flex items-center justify-center"
          style={{
            top: -5,
            right: -5,
            width: 16,
            height: 16,
            borderRadius: 9999,
            background: closeHover ? "#374151" : "#4B5563",
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            color: "#ffffff",
            zIndex: 2,
            border: "none",
            transition: "background 160ms ease",
          }}
        >
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none" aria-hidden="true">
            <path
              d="M1.5 1.5 L6.5 6.5 M6.5 1.5 L1.5 6.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
