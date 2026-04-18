"use client"

import { ChatInput, type ChatInputSendPayload } from "./ChatInput"

export function ChatInputWrapper() {
  const handleSend = (payload: ChatInputSendPayload) => {
    console.log("send", payload)
  }

  return <ChatInput onSend={handleSend} autoFocus />
}
