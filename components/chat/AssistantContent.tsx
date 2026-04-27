"use client"

/**
 * AssistantContent — renders structured assistant responses.
 *
 * Accepts an array of typed blocks and renders each with the correct
 * typography role. Engineers (or the model) return blocks, this component
 * renders them. One shape, many layouts.
 *
 * Block roles:
 *   - lead:    opening summary paragraph, slightly larger
 *   - h2:      major section heading
 *   - h3:      subsection heading
 *   - p:       body paragraph (supports **bold** and *italic* inline)
 *   - list:    unordered bulleted list
 *   - numbered: ordered numbered list
 *   - cite:    inline citation chip (renders inline inside paragraphs)
 *   - chart:   data chart inside the artifact shell
 *
 * See block schema types below.
 *
 * Typography inherits from themes.css — system UI + 13px chat scale (.chat-surface).
 */

import type { ReactNode } from "react"
import {
  ChartArtifact,
  type ChartDatum,
  type PinpointSelectPayload,
} from "@/components/chat/ChartArtifact"
import { ChoiceArtifact, type ChoiceOption } from "@/components/chat/ChoiceArtifact"
import { cn } from "@/lib/utils"

export type AssistantBlock =
  | { type: "lead"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string; cite?: { label: string; url?: string } }
  | { type: "list"; items: string[] }
  | { type: "numbered"; items: string[] }
  | {
      type: "chart"
      title: string
      data: ChartDatum[]
      defaultType?: "bar" | "line" | "pie"
    }
  | {
      type: "choice"
      title: string
      question?: string
      options: ChoiceOption[]
      onSelect?: (option: ChoiceOption, index: number) => void
      selectedId?: string
    }

type AssistantContentProps = {
  blocks: AssistantBlock[]
  onPinpointSelect?: (payload: PinpointSelectPayload) => void
}

export function AssistantContent({ blocks, onPinpointSelect }: AssistantContentProps) {
  return (
    <div className={cn("assistant-content chat-surface text-foreground")}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "lead":
            return (
              <p key={i} className="assistant-lead text-foreground/90 mb-5 font-medium">
                {renderInline(block.text)}
              </p>
            )
          case "h2":
            return (
              <h2
                key={i}
                className="assistant-h2 text-foreground mt-6 mb-2.5 font-semibold tracking-tight"
              >
                {block.text}
              </h2>
            )
          case "h3":
            return (
              <h3 key={i} className="assistant-h3 text-foreground mt-4 mb-2 font-semibold">
                {block.text}
              </h3>
            )
          case "p":
            return (
              <p key={i} className="assistant-p text-foreground/90 mb-3.5">
                {renderInline(block.text)}
                {block.cite && (
                  <>
                    {" "}
                    <CitationChip
                      label={block.cite.label}
                      {...(block.cite.url !== undefined ? { url: block.cite.url } : {})}
                    />
                  </>
                )}
              </p>
            )
          case "list":
            return (
              <ul
                key={i}
                className="assistant-list text-foreground/90 mt-2 mb-3.5 list-outside list-disc pl-[22px]"
              >
                {block.items.map((item, j) => (
                  <li key={j} className="mb-2">
                    {renderInline(item)}
                  </li>
                ))}
              </ul>
            )
          case "numbered":
            return (
              <ol
                key={i}
                className="assistant-numbered text-foreground/90 mt-2 mb-3.5 list-outside list-decimal pl-[22px]"
              >
                {block.items.map((item, j) => (
                  <li key={j} className="mb-2.5">
                    {renderInline(item)}
                  </li>
                ))}
              </ol>
            )
          case "chart":
            return (
              <div key={i} className="my-4 mb-5">
                <ChartArtifact
                  title={block.title}
                  data={block.data}
                  {...(block.defaultType !== undefined ? { defaultType: block.defaultType } : {})}
                  {...(onPinpointSelect !== undefined ? { onPinpointSelect } : {})}
                />
              </div>
            )
          case "choice":
            return (
              <div key={i} className="my-4 mb-5">
                <ChoiceArtifact
                  title={block.title}
                  {...(block.question !== undefined ? { question: block.question } : {})}
                  options={block.options}
                  {...(block.onSelect !== undefined ? { onSelect: block.onSelect } : {})}
                  {...(block.selectedId !== undefined ? { selectedId: block.selectedId } : {})}
                />
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}

function CitationChip({ label, url }: { label: string; url?: string }) {
  const inner = (
    <span className="assistant-cite text-muted-foreground inline-flex items-center gap-1 rounded bg-black/[0.04] px-1 py-px align-middle text-[length:var(--text-micro)] leading-tight font-medium">
      <span aria-hidden="true" className="size-2.5 shrink-0 rounded-sm bg-black/15" />
      {label}
    </span>
  )
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="no-underline">
        {inner}
      </a>
    )
  }
  return inner
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-foreground font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} className="text-foreground/95 italic">
          {part.slice(1, -1)}
        </em>
      )
    }
    return <span key={i}>{part}</span>
  })
}
