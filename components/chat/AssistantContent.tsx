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
 */

import type { ReactNode } from "react"
import {
  ChartArtifact,
  type ChartDatum,
  type PinpointSelectPayload,
} from "@/components/chat/ChartArtifact"
import { ChoiceArtifact, type ChoiceOption } from "@/components/chat/ChoiceArtifact"

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
    <div className="assistant-content" style={{ color: "rgba(0,0,0,0.82)" }}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "lead":
            return (
              <p
                key={i}
                className="assistant-lead"
                style={{
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "rgba(0,0,0,0.78)",
                  marginBottom: 20,
                }}
              >
                {renderInline(block.text)}
              </p>
            )
          case "h2":
            return (
              <h2
                key={i}
                className="assistant-h2"
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  lineHeight: 1.35,
                  color: "rgba(0,0,0,0.9)",
                  marginTop: 26,
                  marginBottom: 10,
                  letterSpacing: "-0.005em",
                }}
              >
                {block.text}
              </h2>
            )
          case "h3":
            return (
              <h3
                key={i}
                className="assistant-h3"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1.35,
                  color: "rgba(0,0,0,0.88)",
                  marginTop: 18,
                  marginBottom: 8,
                }}
              >
                {block.text}
              </h3>
            )
          case "p":
            return (
              <p
                key={i}
                className="assistant-p"
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(0,0,0,0.75)",
                  marginBottom: 14,
                }}
              >
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
                className="assistant-list"
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(0,0,0,0.75)",
                  marginTop: 8,
                  marginBottom: 14,
                  paddingLeft: 22,
                  listStyleType: "disc",
                  listStylePosition: "outside",
                }}
              >
                {block.items.map((item, j) => (
                  <li key={j} style={{ marginBottom: 8 }}>
                    {renderInline(item)}
                  </li>
                ))}
              </ul>
            )
          case "numbered":
            return (
              <ol
                key={i}
                className="assistant-numbered"
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(0,0,0,0.75)",
                  marginTop: 8,
                  marginBottom: 14,
                  paddingLeft: 22,
                  listStyleType: "decimal",
                  listStylePosition: "outside",
                }}
              >
                {block.items.map((item, j) => (
                  <li key={j} style={{ marginBottom: 10 }}>
                    {renderInline(item)}
                  </li>
                ))}
              </ol>
            )
          case "chart":
            return (
              <div key={i} style={{ margin: "16px 0 20px 0" }}>
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
              <div key={i} style={{ margin: "16px 0 20px 0" }}>
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
    <span
      className="assistant-cite"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "rgba(0,0,0,0.04)",
        borderRadius: 4,
        padding: "1px 6px 1px 4px",
        fontSize: 10.5,
        color: "rgba(0,0,0,0.55)",
        lineHeight: 1.2,
        fontWeight: 500,
        verticalAlign: "middle",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          borderRadius: 2,
          background: "rgba(0,0,0,0.15)",
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  )
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        {inner}
      </a>
    )
  }
  return inner
}

// Inline formatting — parses **bold** and *italic* marks.
function renderInline(text: string): ReactNode {
  // Split on **bold** and *italic* marks while keeping delimiters.
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ fontWeight: 600, color: "rgba(0,0,0,0.92)" }}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} style={{ fontStyle: "italic", color: "rgba(0,0,0,0.82)" }}>
          {part.slice(1, -1)}
        </em>
      )
    }
    return <span key={i}>{part}</span>
  })
}
