"use client"

import { Feed, type FeedItem } from "@/components/feed/Feed"

const MOCK_ITEMS: FeedItem[] = [
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

export default function FeedPlaygroundPage() {
  return (
    <div className="feed-playground-page flex min-h-screen flex-col items-center justify-center px-8 py-16">
      <div className="feed-playground-container flex w-full max-w-[680px] flex-col gap-8">
        <header className="feed-playground-header flex flex-col gap-2">
          <h1 className="feed-playground-title text-foreground text-[24px] font-semibold tracking-tight">
            Feed
          </h1>
          <p className="feed-playground-subtitle text-[13px] leading-[1.55] text-black/55">
            Vertically stacked cards with overlap, scale, and hover. Same layout as the home page
            feed block — fits within the chatbox column width.
          </p>
        </header>

        <div className="feed-playground-stage">
          <Feed items={MOCK_ITEMS} />
        </div>
      </div>
    </div>
  )
}
