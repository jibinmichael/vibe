"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

type EmotionalState = "focused" | "curious" | "working" | "playful" | "patient"

const STATE_THRESHOLDS_MS: { state: EmotionalState; after: number }[] = [
  { state: "focused", after: 0 },
  { state: "curious", after: 5000 },
  { state: "working", after: 15000 },
  { state: "playful", after: 30000 },
  { state: "patient", after: 45000 },
]

const TEXT_POOLS: Record<EmotionalState, string[]> = {
  focused: [
    "Thinking…",
    "Looking into this.",
    "On it.",
    "One moment.",
    "Processing.",
    "Reading your question.",
    "Gathering context.",
    "Working on it.",
  ],
  curious: [
    "This deserves a proper look.",
    "Following a couple of threads.",
    "Checking a few angles.",
    "Cross-referencing.",
    "Getting the shape of it.",
    "Considering a few options.",
    "Finding the right frame.",
    "Working through the layers.",
  ],
  working: [
    "This one's got depth.",
    "Multiple moving parts.",
    "Tightening the reasoning.",
    "Verifying the edges.",
    "Checking the math.",
    "Making sure this holds up.",
    "Not a simple one.",
    "Worth doing right.",
  ],
  playful: [
    "Taking a cappuccino to regain power.",
    "Consulting my notes.",
    "Okay, it's complicated.",
    "Running the long way around.",
    "Re-reading my own work.",
    "Earning my keep today.",
    "This one deserves the scenic route.",
    "Doing the unglamorous part.",
  ],
  patient: [
    "Still here, still thinking.",
    "Almost through it.",
    "Close.",
    "Wrapping up the thinking.",
    "Worth the wait, I promise.",
    "Final stretch.",
    "Sharpening the answer.",
    "Landing it properly.",
  ],
}

const TEXT_ROTATE_MS = 4000
const EYE_COLOR = "rgba(0,0,0,0.55)"

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  if (totalSeconds < 60) return `${totalSeconds}s`
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (seconds === 0) return `${minutes}m`
  return `${minutes}m ${seconds}s`
}

type ThinkingState = {
  emotionalState: EmotionalState
  textIndex: number
}

export function ThinkingIndicator() {
  const startRef = useRef(0)
  const [thinking, setThinking] = useState<ThinkingState>({
    emotionalState: "focused",
    textIndex: 0,
  })
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    startRef.current = Date.now()

    const stateTimer = window.setInterval(() => {
      const elapsed = Date.now() - startRef.current
      setElapsedMs(elapsed)
      let current: EmotionalState = "focused"
      for (const t of STATE_THRESHOLDS_MS) {
        if (elapsed >= t.after) current = t.state
      }
      setThinking((prev) => {
        if (prev.emotionalState === current) return prev
        return { emotionalState: current, textIndex: 0 }
      })
    }, 500)

    const textTimer = window.setInterval(() => {
      setThinking((prev) => ({ ...prev, textIndex: prev.textIndex + 1 }))
    }, TEXT_ROTATE_MS)

    return () => {
      window.clearInterval(stateTimer)
      window.clearInterval(textTimer)
    }
  }, [])

  const state = thinking.emotionalState
  const textIndex = thinking.textIndex

  const pool = TEXT_POOLS[state]
  const currentText = pool[textIndex % pool.length] ?? ""

  return (
    <div className="flex items-start gap-2.5">
      <span
        className="flex flex-shrink-0 items-center gap-1"
        aria-hidden="true"
        style={{ marginTop: 5 }}
      >
        <Eye />
        <Eye />
      </span>
      <div className="flex flex-col gap-2.5">
        <span className="relative inline-block min-h-[20px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${state}-${textIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{
                opacity: { duration: 0.3 },
                y: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
              }}
              className="block text-[13px] leading-[1.4] whitespace-nowrap"
              style={{ color: "rgba(0,0,0,0.4)" }}
            >
              {currentText}
            </motion.span>
          </AnimatePresence>
        </span>
        <ThinkingCard elapsedMs={elapsedMs} />
      </div>
    </div>
  )
}

function Eye() {
  return (
    <motion.span
      style={{
        display: "inline-block",
        width: 4,
        background: EYE_COLOR,
        borderRadius: 1,
      }}
      animate={{ height: [4, 4, 1, 4] }}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.92, 0.96, 1],
      }}
    />
  )
}

function ThinkingCard({ elapsedMs }: { elapsedMs: number }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-[10px] bg-white"
      style={{
        width: 280,
        padding: "10px 12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.03)",
      }}
    >
      <div
        className="flex flex-shrink-0 items-center justify-center"
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: "rgba(0,0,0,0.06)",
          color: "rgba(0,0,0,0.4)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect
            x="2"
            y="2"
            width="10"
            height="10"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <path d="M2 6h10M6 2v10" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </div>
      <div className="flex min-w-0 flex-col" style={{ gap: 2 }}>
        <span
          className="text-[13px] leading-[1.3] font-medium"
          style={{ color: "rgba(0,0,0,0.7)" }}
        >
          Generating dashboard
        </span>
        <span
          className="text-[11px] leading-[1.3] tabular-nums"
          style={{ color: "rgba(0,0,0,0.35)" }}
        >
          {formatElapsed(elapsedMs)}
        </span>
      </div>
    </div>
  )
}
