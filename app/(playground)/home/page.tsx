"use client"

/**
 * Home page composition — a playground page that assembles real
 * homepage-level components into a single vertically-centered layout.
 *
 * Engineers see how the pieces fit together on the actual landing page.
 * Currently: AiPulse → tagline → Chatbox, stacked vertically with generous spacing.
 */

import { useState } from "react"
import { AiPulse } from "@/components/ai/AiPulse"
import { Chatbox } from "@/components/chat/Chatbox"

export default function HomePlaygroundPage() {
  const [value, setValue] = useState("")

  return (
    <div className="home-playground-page flex min-h-screen flex-col items-center justify-center px-8 py-16">
      <div className="home-playground-container flex w-full max-w-[680px] flex-col">
        <div className="home-playground-pulse-slot flex justify-center pb-2">
          <AiPulse />
        </div>
        <div className="home-playground-tagline-slot mt-3 flex justify-center">
          <p
            className="home-playground-tagline text-[16px] font-medium"
            style={{ color: "rgba(0,0,0,0.7)" }}
          >
            How may I be of service?
          </p>
        </div>
        <div className="home-playground-chatbox-slot mt-9">
          <Chatbox
            onSend={(text) => alert(`Sent: ${text}`)}
            value={value}
            onValueChange={setValue}
          />
        </div>
      </div>
    </div>
  )
}
