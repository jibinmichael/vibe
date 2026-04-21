"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"

export type ChatboxChip = {
  label: string
  icon?: ReactNode
  onRemove?: () => void
  /** Campaign planner: blue square icon slot with month short + day; label stacks vertically beside it */
  plannerDate?: { monthShort: string; day: number }
}

const MAX_HEIGHT_PX = 200

type Placeholder = {
  text: string
  isSuggestion: boolean
}

const PLACEHOLDERS: Placeholder[] = [
  { text: "Ask anything…", isSuggestion: false },
  { text: "Find me the best agent for the week", isSuggestion: true },
  { text: "Find me the CX score trend for the month", isSuggestion: true },
]

const LISTENING_PLACEHOLDER: Placeholder = {
  text: "Listening…",
  isSuggestion: false,
}

const ROTATE_INTERVAL_MS = 3500

export type ChatboxProps = {
  onSend?: (text: string) => void
  disabled?: boolean
  rotatePlaceholder?: boolean
  value?: string
  onValueChange?: (next: string) => void
  chip?: ChatboxChip | null
}

export function Chatbox({
  onSend,
  disabled = false,
  rotatePlaceholder = true,
  value: valueProp,
  onValueChange,
  chip = null,
}: ChatboxProps) {
  const [internalValue, setInternalValue] = useState("")
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : internalValue

  const setTextValue = useCallback(
    (next: string) => {
      if (isControlled) {
        onValueChange?.(next)
      } else {
        setInternalValue(next)
      }
    },
    [isControlled, onValueChange],
  )
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const hasText = value.trim().length > 0
  const rotatingPlaceholder = PLACEHOLDERS[placeholderIndex]
  const recordingActive = isRecording && !disabled
  const displayedPlaceholder = recordingActive ? LISTENING_PLACEHOLDER : rotatingPlaceholder

  const submitMessage = useCallback(() => {
    if (disabled) return
    const text = value.trim()
    if (!text) return
    onSend?.(text)
    setTextValue("")
  }, [value, onSend, disabled, setTextValue])

  const autogrow = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    const next = Math.min(el.scrollHeight, MAX_HEIGHT_PX)
    el.style.height = `${next}px`
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT_PX ? "auto" : "hidden"
  }, [])

  useEffect(() => {
    autogrow()
  }, [value, autogrow])

  useEffect(() => {
    if (disabled) return
    if (hasText || isRecording) return
    if (!rotatePlaceholder) return
    const id = window.setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length)
    }, ROTATE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [disabled, hasText, isRecording, rotatePlaceholder])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (disabled) return
    if (e.key === "Enter" && !e.shiftKey && hasText) {
      e.preventDefault()
      submitMessage()
      return
    }
    if (e.key === "Tab" && !hasText && !recordingActive && rotatingPlaceholder?.isSuggestion) {
      e.preventDefault()
      const text = rotatingPlaceholder.text
      setTextValue(text)
      requestAnimationFrame(() => {
        const el = textareaRef.current
        if (!el) return
        el.focus()
        el.setSelectionRange(text.length, text.length)
      })
    }
  }

  const startRecording = () => setIsRecording(true)
  const stopRecording = () => setIsRecording(false)

  const showPlaceholder = !hasText
  const showTabHint =
    !disabled &&
    rotatePlaceholder &&
    showPlaceholder &&
    !recordingActive &&
    rotatingPlaceholder?.isSuggestion === true
  const placeholderKey = recordingActive ? "listening" : `rotating-${placeholderIndex}`

  return (
    <div
      className={cn("w-full max-w-[720px] rounded-[24px] bg-white")}
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {chip && (
        <div className="chatbox-chip-row flex px-4 pt-4 pb-2">
          <span
            className={cn(
              "chatbox-chip inline-flex items-center gap-1.5 rounded-sm bg-black/5 px-1 py-1 text-[12px] leading-[1.3] font-medium text-[#737373]",
            )}
          >
            {chip.plannerDate ? (
              <span
                className="chatbox-chip-icon chatbox-chip-icon-planner inline-flex h-[28px] w-[28px] shrink-0 flex-col items-center justify-center rounded-[4px] bg-[#0a84ff] p-px text-white"
                aria-hidden="true"
              >
                <span className="text-[7px] leading-none font-semibold tracking-wide uppercase">
                  {chip.plannerDate.monthShort}
                </span>
                <span className="text-[12px] leading-none font-bold tabular-nums">
                  {chip.plannerDate.day}
                </span>
              </span>
            ) : (
              chip.icon && (
                <span
                  className="chatbox-chip-icon inline-flex shrink-0 items-center justify-center rounded-[4px] bg-white p-1 text-black/55"
                  aria-hidden="true"
                >
                  {chip.icon}
                </span>
              )
            )}
            <span className="chatbox-chip-label max-w-[240px] truncate">{chip.label}</span>
            {chip.onRemove && (
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label="Remove attachment"
                className="chatbox-chip-close ml-0.5 flex h-3 w-3 items-center justify-center rounded-sm bg-[#e8e8e8] text-[#737373] transition-colors hover:bg-gray-300 hover:text-gray-900"
              >
                <svg width="6" height="6" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                  <path
                    d="M2 2l5 5M7 2l-5 5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </span>
        </div>
      )}
      <div className="relative px-5 pt-4">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isRecording}
          className={cn(
            "text-foreground block w-full resize-none border-0 bg-transparent p-0 text-[15px] leading-[1.65] outline-none",
            isRecording ? "cursor-not-allowed" : "disabled:cursor-default",
          )}
          aria-label="Message input"
        />
        {showPlaceholder &&
          (disabled ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-5 top-4"
              style={{ height: "calc(15px * 1.65)" }}
            >
              <span
                className="block truncate text-[15px] leading-[1.65]"
                style={{ color: "rgba(0,0,0,0.4)" }}
              >
                Ask a follow-up question
              </span>
            </div>
          ) : rotatePlaceholder ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-5 top-4 overflow-hidden"
              style={{ height: "calc(15px * 1.65)" }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={placeholderKey}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{
                    y: { type: "spring", stiffness: 500, damping: 40 },
                    opacity: { duration: 0.2 },
                  }}
                  className="flex items-center gap-2"
                >
                  <motion.span
                    animate={{
                      color: ["rgba(0,0,0,0.35)", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.35)"],
                    }}
                    transition={{
                      color: {
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                    className="truncate text-[15px] leading-[1.65]"
                  >
                    {displayedPlaceholder?.text}
                  </motion.span>
                  {showTabHint && (
                    <span className="text-muted-foreground inline-flex flex-shrink-0 items-center rounded-[4px] bg-black/5 px-1.5 py-1 text-[10.5px] leading-none font-semibold">
                      tab
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-5 top-4"
              style={{ height: "calc(15px * 1.65)" }}
            >
              <span
                className="block truncate text-[15px] leading-[1.65]"
                style={{ color: "rgba(0,0,0,0.4)" }}
              >
                Ask a follow-up...
              </span>
            </div>
          ))}
      </div>

      <div className="flex items-center justify-between px-3 pt-2 pb-3">
        <SkillsButton disabled={disabled} />

        <div className="flex items-center gap-1">
          <AnimatePresence initial={false}>
            {recordingActive && (
              <motion.div
                key="stop-pill"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{
                  width: { type: "spring", stiffness: 500, damping: 40 },
                  opacity: { duration: 0.18 },
                }}
                className="overflow-hidden"
              >
                <StopPill onStop={stopRecording} disabled={disabled} />
              </motion.div>
            )}
          </AnimatePresence>
          <MicButton
            dim={recordingActive}
            disabled={disabled}
            onClick={() => {
              if (disabled) return
              if (isRecording) stopRecording()
              else startRecording()
            }}
          />
          <AnimatePresence initial={false}>
            {!recordingActive && (
              <motion.div
                key="send-button"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{
                  width: { type: "spring", stiffness: 500, damping: 40 },
                  opacity: { duration: 0.18 },
                }}
                className="overflow-hidden"
              >
                <SendButton
                  enabled={hasText && !disabled}
                  disabled={disabled}
                  onClick={submitMessage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function SkillsButton({ disabled }: { disabled: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "border-border/80 text-foreground flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors hover:bg-black/5",
        disabled && "cursor-not-allowed opacity-60",
      )}
      aria-label="Skills"
    >
      <span>Skills</span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path
          d="M2 4l3 3 3-3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function MicButton({
  dim,
  disabled,
  onClick,
}: {
  dim: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={dim ? "Stop voice input" : "Start voice input"}
      className={cn(
        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors",
        dim
          ? "text-muted-foreground/60 hover:bg-black/5"
          : "text-muted-foreground hover:bg-black/5",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="6" y="2.5" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M4 8.5v0.5a4 4 0 0 0 8 0v-0.5M8 13v1.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

function StopPill({ onStop, disabled }: { onStop: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onStop}
      aria-label="Stop recording"
      className={cn(
        "border-border/80 text-foreground mr-1 flex h-8 items-center gap-2 rounded-full border pr-3.5 pl-3 text-[13px] font-medium transition-colors hover:bg-black/5",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 w-1 rounded-full bg-current"
            style={{
              animation: `vibeStopDot 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </span>
      <span>Stop</span>
    </button>
  )
}

function SendButton({
  enabled,
  disabled,
  onClick,
}: {
  enabled: boolean
  disabled: boolean
  onClick: () => void
}) {
  const inactive = !enabled || disabled
  return (
    <button
      type="button"
      aria-label="Send message"
      disabled={inactive}
      onClick={inactive ? undefined : onClick}
      className={[
        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors",
        enabled && !disabled
          ? "bg-foreground text-background hover:opacity-90"
          : "text-muted-foreground cursor-not-allowed bg-black/5",
      ].join(" ")}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 13V3M8 3l-4 4M8 3l4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
