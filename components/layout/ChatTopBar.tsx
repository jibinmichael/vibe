"use client"

import { motion } from "motion/react"
import { AppSidebarToggle } from "./AppSidebarToggle"
import { subtleFade } from "@/lib/motion"

export function ChatTopBar({
  title,
  onToggleCanvas,
}: {
  title: string
  onToggleCanvas: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...subtleFade, duration: 0.26 }}
      className="bg-background flex h-11 flex-shrink-0 items-center justify-between border-b px-4"
    >
      <div className="flex items-center gap-2">
        <AppSidebarToggle />
        <span className="text-[13px] font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleCanvas}
          aria-label="Toggle canvas"
          className="text-muted-foreground hover:bg-accent flex h-7 w-7 items-center justify-center rounded-md transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect
              x="2"
              y="3"
              width="12"
              height="10"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path d="M10 3v10" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
