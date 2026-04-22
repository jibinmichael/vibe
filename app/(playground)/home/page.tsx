"use client"

/**
 * Home page composition — a playground page that assembles real
 * homepage-level components into a single vertically-centered layout.
 *
 * Engineers see how the pieces fit together on the actual landing page.
 * Currently: AiPulse → tagline → Chatbox → artifact feed (Feed), stacked vertically.
 */

import { useState } from "react"
import { AiPulse } from "@/components/ai/AiPulse"
import { Chatbox } from "@/components/chat/Chatbox"
import { Feed, type FeedItem } from "@/components/feed/Feed"

const ARTIFACT_FEED_ITEMS: FeedItem[] = [
  {
    id: "feed-1",
    eyebrow: "Unanswered queue",
    title: "19 replies sitting over 12 hours, longest is 31h",
  },
  {
    id: "feed-2",
    eyebrow: "CX score drop",
    title: "Down 8 points this week, weekend FRT slower",
  },
  {
    id: "feed-3",
    eyebrow: "Load imbalance",
    title: "Rahul handling 2.4× the team's average volume",
  },
]

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
        <div className="home-playground-artifact-feed-slot mt-14 w-full">
          <Feed items={ARTIFACT_FEED_ITEMS} />
        </div>
      </div>
    </div>
  )
}
