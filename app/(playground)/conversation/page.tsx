"use client"

/**
 * Conversation page composition — demonstrates UserRow + AssistantRow
 * inside a 680px chat column, with Chatbox pinned at the bottom
 * (chat-view variant, placeholder "Ask a follow-up question").
 *
 * Sample exchange wired in locally so engineers can see how rows
 * render in sequence.
 */

import { useState } from "react"
import type { AssistantBlock } from "@/components/chat/AssistantContent"
import { AssistantRow } from "@/components/chat/AssistantRow"
import type { ChatboxChip } from "@/components/chat/Chatbox"
import { Chatbox } from "@/components/chat/Chatbox"
import { UserRow } from "@/components/chat/UserRow"

type ChatMessage = { role: "user"; text: string } | { role: "assistant"; blocks: AssistantBlock[] }

const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    role: "user",
    text: "Why did our CX score drop this week?",
  },
  {
    role: "assistant",
    blocks: [
      {
        type: "lead",
        text: "Your **CX score dropped 8 points** this week (from 81 to 73). The drop isn't broad-based — it's concentrated in weekend first-response times. Weekday handling stayed stable.",
      },
      {
        type: "h2",
        text: "Where the drop is coming from",
      },
      {
        type: "p",
        text: "The composite CX score is built from four inputs: first-response time, resolution speed, customer rating, and reopen rate. Only **first-response time** moved significantly this week.",
      },
      {
        type: "numbered",
        items: [
          "**Weekend FRT:** 4h 12m this week, up from 1h 38m last week — the single biggest contributor to the drop.",
          "**Weekday FRT:** stable at ~32 minutes, unchanged from your 4-week baseline.",
          "Resolution speed, rating, and reopen rate: all within normal range.",
        ],
      },
      {
        type: "chart",
        title: "First-response time — weekend vs weekday",
        data: [
          { label: "Mon", value: 34, status: "good" },
          { label: "Tue", value: 31, status: "good" },
          { label: "Wed", value: 33, status: "good" },
          { label: "Thu", value: 35, status: "good" },
          { label: "Fri", value: 38, status: "good" },
          { label: "Sat", value: 252, status: "weak" },
          { label: "Sun", value: 204, status: "weak" },
        ],
      },
      {
        type: "h2",
        text: "The root cause",
      },
      {
        type: "p",
        text: "Only **two agents** (Rahul and Priya) were online across Saturday and Sunday this week, compared to the usual four. They together handled 68% of weekend volume and were saturated by late morning each day.",
        cite: { label: "inbox analytics" },
      },
      {
        type: "p",
        text: "Three customers waited **over 6 hours** for a first reply on Saturday — a pattern that hasn't appeared in the last 4 weeks of data.",
      },
      {
        type: "h2",
        text: "What I'd look at next",
      },
      {
        type: "list",
        items: [
          "Weekend staffing coverage for the next two weekends",
          "Whether routing rules are concentrating load on Rahul and Priya specifically",
          "Setting up an alert if FRT crosses 2 hours on any single day",
        ],
      },
    ],
  },
  {
    role: "user",
    text: "Show me Rahul's conversations from Saturday",
  },
  {
    role: "assistant",
    blocks: [
      {
        type: "p",
        text: "Rahul handled **47 conversations on Saturday**, his busiest day in the last 30 days. The team average for a Saturday is 18.",
      },
      {
        type: "list",
        items: [
          "First conversation opened: 9:14am",
          "Last reply sent: 9:47pm",
          "Median response time: 2h 04m (his personal baseline: 28m)",
          "3 conversations remain unresolved",
        ],
      },
    ],
  },
]

export default function ConversationPlaygroundPage() {
  const [value, setValue] = useState("")
  const [chip, setChip] = useState<ChatboxChip | null>(null)

  const makeChartChipIcon = () => (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="2.2" height="6" rx="0.6" fill="currentColor" />
      <rect x="5.9" y="3" width="2.2" height="9" rx="0.6" fill="currentColor" />
      <rect x="9.8" y="8" width="2.2" height="4" rx="0.6" fill="currentColor" />
    </svg>
  )

  return (
    <div className="conversation-playground-page flex min-h-screen flex-col items-center px-8 py-16">
      <div className="conversation-playground-container flex w-full max-w-[680px] flex-col">
        <div className="conversation-stream flex flex-col" style={{ paddingBottom: 32 }}>
          {SAMPLE_MESSAGES.map((m, i) =>
            m.role === "user" ? (
              <UserRow key={i} text={m.text} />
            ) : (
              <AssistantRow
                key={i}
                blocks={m.blocks}
                onPinpointSelect={({ chartTitle, prompt }) => {
                  setChip({
                    label: chartTitle,
                    icon: makeChartChipIcon(),
                    onRemove: () => {
                      setChip(null)
                      setValue("")
                    },
                  })
                  setValue(prompt)
                }}
              />
            ),
          )}
        </div>

        <div className="conversation-chatbox-slot">
          <Chatbox
            onSend={(text) => alert(`Sent: ${text}`)}
            rotatePlaceholder={false}
            value={value}
            onValueChange={setValue}
            chip={chip}
          />
        </div>
      </div>
    </div>
  )
}
