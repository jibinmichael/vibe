"use client"

/**
 * Home page composition — a playground page that assembles real
 * homepage-level components into a single vertically-centered layout.
 *
 * Engineers see how the pieces fit together on the actual landing page.
 * Currently: AiPulse → tagline → Chatbox → artifact feed (Feed), stacked vertically.
 */

import { HomePlaygroundContent } from "@/components/playground/HomePlaygroundContent"

export default function HomePlaygroundPage() {
  return <HomePlaygroundContent />
}
