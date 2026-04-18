"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ChangeEvent,
} from "react"
import { cn } from "@/lib/utils"

export type ChatMode = "analyse" | "plan" | "generate"

export type ChatInputSendPayload = {
  text: string
  mode: ChatMode
}

type ChatInputProps = {
  onSend: (payload: ChatInputSendPayload) => void
  defaultMode?: ChatMode
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

const MODES: { value: ChatMode; label: string }[] = [
  { value: "analyse", label: "Analyse" },
  { value: "plan", label: "Plan" },
  { value: "generate", label: "Generate" },
]

const MIN_LINES = 1
const MAX_LINES = 8
const LINE_HEIGHT_PX = 24

export function ChatInput({
  onSend,
  defaultMode = "analyse",
  placeholder = "Message vibe…",
  autoFocus = false,
  className,
}: ChatInputProps) {
  const [value, setValue] = useState("")
  const [mode, setMode] = useState<ChatMode>(defaultMode)
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const autogrow = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    const max = LINE_HEIGHT_PX * MAX_LINES
    const next = Math.min(el.scrollHeight, max)
    el.style.height = `${next}px`
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden"
  }, [])

  useEffect(() => {
    autogrow()
  }, [value, autogrow])

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus()
    }
  }, [autoFocus])

  const canSend = value.trim().length > 0

  const handleSend = useCallback(() => {
    const text = value.trim()
    if (!text) return
    onSend({ text, mode })
    setValue("")
  }, [mode, onSend, value])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
        event.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handleChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
  }, [])

  return (
    <div
      className={cn(
        "bg-background rounded-lg border px-3 pt-3 pb-2.5 transition-colors",
        focused ? "border-border ring-ring/20 ring-1" : "border-border/60",
        className,
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={MIN_LINES}
        placeholder={placeholder}
        className={cn(
          "block w-full resize-none border-0 bg-transparent p-0 outline-none",
          "text-foreground placeholder:text-muted-foreground text-[0.9375rem] leading-[1.65]",
        )}
        aria-label="Message input"
      />

      <div className="mt-2 flex items-center justify-between">
        <ModeToggle value={mode} onChange={setMode} />
        <SendButton enabled={canSend} onClick={handleSend} />
      </div>
    </div>
  )
}

function ModeToggle({ value, onChange }: { value: ChatMode; onChange: (next: ChatMode) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="Response mode"
      className="bg-muted inline-flex items-center gap-0.5 rounded-md p-0.5"
    >
      {MODES.map((m) => {
        const active = m.value === value
        return (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(m.value)}
            className={cn(
              "rounded-[4px] px-3 py-1 text-[13px] transition-all",
              active
                ? "bg-background text-foreground font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m.label}
          </button>
        )
      })}
    </div>
  )
}

function SendButton({ enabled, onClick }: { enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!enabled}
      aria-label="Send message"
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md transition-opacity",
        enabled
          ? "bg-foreground text-background hover:opacity-90"
          : "bg-muted text-muted-foreground cursor-not-allowed",
      )}
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
