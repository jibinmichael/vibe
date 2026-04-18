"use client"

import { useRouter } from "next/navigation"
import { Chatbox } from "@/components/chat/Chatbox"

export default function HomePage() {
  const router = useRouter()

  const handleSend = (text: string) => {
    const id = `chat-${Math.random().toString(36).slice(2, 8)}`
    const url = `/c/${id}?initial=${encodeURIComponent(text)}`
    router.push(url)
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <Chatbox onSend={handleSend} />
    </div>
  )
}
