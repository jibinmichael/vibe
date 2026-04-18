"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { Chatbox } from "@/components/chat/Chatbox"
import { ThinkingIndicator } from "@/components/chat/ThinkingIndicator"
import { easeExit, springEnter } from "@/lib/motion"

const CANVAS_WIDTH = 480

type Message = {
  id: string
  role: "user" | "assistant"
  text: string
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const canvasOpen = searchParams.get("canvas") === "open"
  const initialText = searchParams.get("initial") ?? ""

  const [messages, setMessages] = useState<Message[]>(() => {
    if (initialText.trim().length === 0) return []
    return [
      {
        id: `m-${Date.now()}`,
        role: "user",
        text: initialText,
      },
    ]
  })
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const isThinking = messages.length > 0 && messages[messages.length - 1]?.role === "user"

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, { id: `m-${Date.now()}`, role: "user", text }])
  }

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatTopBar title="New chat" />

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-3">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start pt-2">
                <ThinkingIndicator />
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 px-6 pb-6">
          <div className="mx-auto w-full max-w-[720px]">
            <Chatbox onSend={handleSend} disabled={isThinking} />
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {canvasOpen && (
          <motion.aside
            key="canvas"
            initial={{ width: 0 }}
            animate={{ width: CANVAS_WIDTH }}
            exit={{ width: 0 }}
            transition={{
              width: canvasOpen ? springEnter : easeExit,
            }}
            style={{
              backgroundColor: "#F8F8F7",
              boxShadow: "-1px 0 0 rgba(0,0,0,0.05), -2px 0 8px -2px rgba(0,0,0,0.04)",
            }}
            className="flex flex-shrink-0 flex-col overflow-hidden"
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ChatTopBar({ title }: { title: string }) {
  return (
    <div className="flex h-11 flex-shrink-0 items-center justify-between px-6">
      <span className="text-foreground text-[14px] font-medium">{title}</span>
      <button
        type="button"
        className="border-border/80 text-foreground flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors hover:bg-black/5"
        aria-label="Share chat"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <path
            d="M4 7.5L9 4.5M4 5.5L9 8.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <circle cx="3" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="10" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="10" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        <span>Share</span>
      </button>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-[15px] leading-[1.5]",
          isUser ? "text-foreground bg-black/5" : "text-foreground bg-transparent",
        ].join(" ")}
      >
        {message.text}
      </div>
    </div>
  )
}
