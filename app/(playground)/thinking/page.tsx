"use client"

/**
 * Thinking indicator playground — isolated render.
 * Watch the full emotional arc by leaving it on screen for ~45 seconds:
 * focused → curious → working → playful → patient.
 */

import type { ComponentType } from "react"
import { useState } from "react"
import { ThinkingIndicator } from "@/components/chat/ThinkingIndicator"

const ThinkingIndicatorPlayground = ThinkingIndicator as ComponentType<{ completed?: boolean }>

export default function ThinkingPlaygroundPage() {
  const [completed, setCompleted] = useState(false)

  return (
    <div className="thinking-playground-page flex min-h-screen flex-col items-center justify-center px-8 py-16">
      <div className="thinking-playground-container flex w-full max-w-[680px] flex-col gap-8">
        <header className="thinking-playground-header flex flex-col gap-2">
          <h1 className="thinking-playground-title text-foreground text-[24px] font-semibold tracking-tight">
            Thinking indicator
          </h1>
          <p className="thinking-playground-subtitle text-[13px] leading-[1.55] text-black/55">
            5-state emotional arc over 45s: focused → curious → working → playful → patient. 40
            rotating copy lines. Watch it run to see the states shift.
          </p>
        </header>

        <div className="thinking-playground-controls flex items-center gap-3">
          <label
            htmlFor="completed-toggle"
            className="thinking-playground-control-label text-[12px] font-medium text-black/55"
          >
            completed
          </label>
          <button
            id="completed-toggle"
            type="button"
            onClick={() => setCompleted((v) => !v)}
            className="thinking-playground-toggle text-foreground rounded-md border border-black/10 bg-white px-3 py-1 text-[12.5px] font-medium transition-colors hover:border-black/20"
          >
            {completed ? "true (click to flip)" : "false (click to flip)"}
          </button>
        </div>

        <div className="thinking-playground-stage py-8">
          <ThinkingIndicatorPlayground completed={completed} />
        </div>
      </div>
    </div>
  )
}
