"use client"

import type { ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import { easeExit, springEnter } from "@/lib/motion"

type ChatCanvasProps = {
  open: boolean
  onClose: () => void
  children?: ReactNode
}

export function ChatCanvas({ open, onClose, children }: ChatCanvasProps) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.aside
          key="chat-canvas"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "42%", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{
            width: springEnter,
            opacity: springEnter,
          }}
          className="bg-background flex flex-col overflow-hidden border-l"
          style={{
            boxShadow: "-1px 0 0 rgba(0,0,0,0.02), -4px 0 16px rgba(0,0,0,0.02)",
            flexShrink: 0,
          }}
        >
          <div className="flex h-11 flex-shrink-0 items-center justify-between border-b px-4">
            <span className="text-[13px] font-medium">Canvas</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close canvas"
              className="text-muted-foreground hover:bg-accent flex h-7 w-7 items-center justify-center rounded-md transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M3 3l8 8M11 3l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-auto p-5">
            {children ?? (
              <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center rounded-md text-[13px]">
                Canvas content
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

type WithCanvasOffsetProps = {
  canvasOpen: boolean
  children: ReactNode
}

export function WithCanvasOffset({ canvasOpen, children }: WithCanvasOffsetProps) {
  return (
    <motion.div
      animate={{ x: canvasOpen ? -6 : 0 }}
      transition={canvasOpen ? springEnter : easeExit}
      className="flex h-full w-full flex-col"
    >
      {children}
    </motion.div>
  )
}
