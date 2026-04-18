"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
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

  const hasText = value.trim().length > 0

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

  const handleModeChange = useCallback((next: string) => {
    if (next === "analyse" || next === "plan" || next === "generate") {
      setMode(next)
    }
  }, [])

  return (
    <div
      className={cn(
        "bg-background rounded-2xl border px-3 pt-3 pb-2.5 transition-colors",
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
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(next) => {
            if (next) handleModeChange(next)
          }}
          className="bg-muted inline-flex gap-0.5 rounded-md p-0.5"
          aria-label="Response mode"
        >
          {MODES.map((m) => (
            <ToggleGroupItem
              key={m.value}
              value={m.value}
              className={cn(
                "text-muted-foreground h-7 rounded-[4px] px-3 text-[13px] font-normal transition-all",
                "hover:text-foreground hover:bg-transparent",
                "data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:font-medium data-[state=on]:shadow-sm",
              )}
            >
              {m.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <ActionButton hasText={hasText} onSend={handleSend} />
      </div>
    </div>
  )
}

function ActionButton({ hasText, onSend }: { hasText: boolean; onSend: () => void }) {
  return (
    <button
      type="button"
      onClick={hasText ? onSend : undefined}
      disabled={!hasText}
      aria-label={hasText ? "Send message" : "Audio mode (coming soon)"}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded-full transition-all",
        hasText
          ? "bg-foreground text-background hover:opacity-90"
          : "bg-muted text-muted-foreground cursor-not-allowed",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-150",
          hasText ? "opacity-0" : "opacity-100",
        )}
      >
        <MicIcon />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-150",
          hasText ? "opacity-100" : "opacity-0",
        )}
      >
        <ArrowUpIcon />
      </span>
    </button>
  )
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="6" y="2.5" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 8.5v0.5a4 4 0 0 0 8 0v-0.5M8 13v1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 13V3M8 3l-4 4M8 3l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
