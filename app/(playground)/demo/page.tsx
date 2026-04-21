"use client"

/**
 * Demo page — mimics a real Claude-style chat session.
 *
 * Single user question + single short assistant answer containing an
 * embedded chart artifact. The chatbox is pinned to the bottom of the
 * viewport (sticky), so as the conversation scrolls, the composer stays
 * in place — matching Claude web's layout.
 */

import { useState } from "react"
import type { AssistantBlock } from "@/components/chat/AssistantContent"
import { AssistantRow } from "@/components/chat/AssistantRow"
import type { ChatboxChip } from "@/components/chat/Chatbox"
import { Chatbox } from "@/components/chat/Chatbox"
import { UserRow } from "@/components/chat/UserRow"

type ChatMessage = { role: "user"; text: string } | { role: "assistant"; blocks: AssistantBlock[] }

const DEMO_MESSAGES: ChatMessage[] = [
  {
    role: "user",
    text: "Why did our CX score drop this week?",
  },
  {
    role: "assistant",
    blocks: [
      {
        type: "p",
        text: "Your **CX score dropped 8 points** this week (81 → 73). Weekday handling was stable — the drop is concentrated entirely in **weekend first-response times**.",
      },
      {
        type: "chart",
        title: "First-response time — by day",
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
        type: "p",
        text: "Only **two agents** were online across Saturday and Sunday — the usual four-person weekend rotation dropped to two. Saturday FRT hit **4h 12m**, up from a 1h 38m baseline.",
      },
    ],
  },
]

export default function DemoPage() {
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
    <div className="demo-page flex min-h-screen flex-col">
      <div className="demo-scroll flex-1 overflow-y-auto">
        <div
          className="demo-stream mx-auto flex w-full max-w-[680px] flex-col"
          style={{ padding: "48px 8px 160px 8px" }}
        >
          {DEMO_MESSAGES.map((m, i) =>
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
      </div>

      <div
        className="demo-composer-dock sticky right-0 bottom-0 left-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(248,248,247,0) 0%, rgba(248,248,247,0.9) 30%, rgba(248,248,247,1) 60%)",
          paddingBottom: 24,
          paddingTop: 32,
        }}
      >
        <div
          className="demo-composer-rail mx-auto w-full max-w-[680px]"
          style={{ paddingLeft: 8, paddingRight: 8 }}
        >
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
