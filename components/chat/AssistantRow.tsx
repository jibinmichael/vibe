"use client"

/**
 * AssistantRow — one chat row containing an assistant message.
 *
 * Accepts either a plain text string (simple response) or a structured
 * array of AssistantBlock (rich response with headings, lists, etc.).
 */

import { AssistantContent, type AssistantBlock } from "@/components/chat/AssistantContent"
import type { ChartDatum } from "@/components/chat/ChartArtifact"
import { ResponseFeedback } from "@/components/chat/ResponseFeedback"

type AssistantRowProps =
  | {
      text: string
      blocks?: undefined
      onPinpointSelect?: undefined
      showFeedback?: boolean
    }
  | {
      blocks: AssistantBlock[]
      text?: undefined
      onPinpointSelect?: (payload: {
        chartTitle: string
        datum: ChartDatum
        prompt: string
      }) => void
      showFeedback?: boolean
    }

export function AssistantRow(props: AssistantRowProps) {
  return (
    <div
      className="chat-row chat-row-assistant flex w-full justify-start"
      style={{ padding: "16px 18px" }}
    >
      <div
        className="chat-assistant-content flex flex-col items-start"
        style={{ maxWidth: "85%", wordBreak: "break-word", gap: 14 }}
      >
        <div className="chat-assistant-body" style={{ width: "100%" }}>
          {"blocks" in props && props.blocks ? (
            <AssistantContent
              blocks={props.blocks}
              {...(props.onPinpointSelect !== undefined
                ? { onPinpointSelect: props.onPinpointSelect }
                : {})}
            />
          ) : (
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: "rgba(0,0,0,0.8)",
              }}
            >
              {props.text}
            </div>
          )}
        </div>
        {(props.showFeedback ?? true) && (
          <div className="chat-assistant-feedback-slot">
            <ResponseFeedback />
          </div>
        )}
      </div>
    </div>
  )
}
