"use client"

import { useState, type ReactNode } from "react"
import { ChatTopBar } from "@/components/layout/ChatTopBar"
import { ChatCanvas, WithCanvasOffset } from "@/components/layout/ChatCanvas"
import { Body, Micro } from "@/components/shared/Typography"

export default function ChatPage() {
  const [canvasOpen, setCanvasOpen] = useState(false)

  return (
    <>
      <ChatTopBar
        title="Server actions vs API routes"
        onToggleCanvas={() => setCanvasOpen((prev) => !prev)}
      />
      <div className="flex min-h-0 flex-1">
        <WithCanvasOffset canvasOpen={canvasOpen}>
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-auto px-6 py-5">
              <div className="mx-auto flex max-w-[720px] flex-col">
                <AssistantMessage>Happy to help. What are you working on?</AssistantMessage>
                <UserMessage>
                  {"I'm trying to decide between a REST API and server actions for a new form."}
                </UserMessage>
                <AssistantMessage timestamp="12:04">
                  If the form is submitted from within your own Next.js app, use a server action.
                  They remove the need for a separate API endpoint and handle progressive
                  enhancement automatically.
                </AssistantMessage>
                <UserMessage>Makes sense, thanks.</UserMessage>
              </div>
            </div>
            <div className="bg-background border-t px-6 pt-3 pb-4">
              <div className="bg-muted/50 mx-auto flex h-11 max-w-[720px] items-center rounded-md border px-4">
                <Body muted size="sm">
                  Message vibe…
                </Body>
              </div>
            </div>
          </div>
        </WithCanvasOffset>
        <ChatCanvas open={canvasOpen} onClose={() => setCanvasOpen(false)} />
      </div>
    </>
  )
}

function AssistantMessage({ children, timestamp }: { children: ReactNode; timestamp?: string }) {
  return (
    <div className="mb-5">
      <div className="text-muted-foreground mb-1 text-[11px] font-medium tracking-wide">
        Assistant
      </div>
      <Body>{children}</Body>
      {timestamp && (
        <div className="mt-1.5">
          <Micro>{timestamp}</Micro>
        </div>
      )}
    </div>
  )
}

function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 flex justify-end">
      <div className="bg-muted max-w-[75%] rounded-md px-3.5 py-2">
        <Body>{children}</Body>
      </div>
    </div>
  )
}
