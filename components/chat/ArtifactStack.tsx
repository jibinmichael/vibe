"use client"

/**
 * ArtifactStack — upward-stacked preview of artifact cards.
 *
 * Front card sits at the bottom, fully readable. Up to 2 older cards
 * peek out from above. On hover, the back cards fan out to the upper-left
 * like a deck of cards spreading.
 *
 * Generic data shape — each artifact has id, title, optional subtitle,
 * and a ReactNode thumbnail. Click wires an onOpen callback.
 */

import type { ReactNode } from "react"

export type Artifact = {
  id: string
  title: string
  subtitle?: string
  thumbnail: ReactNode
}

type ArtifactStackProps = {
  artifacts: Artifact[]
  onOpen?: (id: string) => void
}

export function ArtifactStack({ artifacts, onOpen }: ArtifactStackProps) {
  if (artifacts.length === 0) return null

  const front = artifacts[artifacts.length - 1]
  if (!front) return null

  const behindCount = Math.min(artifacts.length - 1, 2)

  return (
    <div
      className="artifact-stack-wrap relative flex justify-end"
      style={{ paddingTop: 18, paddingRight: 4 }}
    >
      <div className="artifact-stack group relative">
        {behindCount >= 2 && (
          <div
            aria-hidden="true"
            className="artifact-stack-back-2 absolute inset-0 scale-[0.92] rounded-[10px] bg-white transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-4 group-hover:-translate-y-2 group-hover:scale-[0.95] group-hover:-rotate-6"
            style={{
              top: -12,
              transformOrigin: "bottom right",
              boxShadow: "0 0 0 0.5px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.03)",
              opacity: 0.6,
              zIndex: 1,
            }}
          />
        )}
        {behindCount >= 1 && (
          <div
            aria-hidden="true"
            className="artifact-stack-back-1 absolute inset-0 scale-[0.96] rounded-[10px] bg-white transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-2 group-hover:-translate-y-1 group-hover:scale-[0.98] group-hover:-rotate-3"
            style={{
              top: -6,
              transformOrigin: "bottom right",
              boxShadow: "0 0 0 0.5px rgba(0,0,0,0.08), 0 2px 5px rgba(0,0,0,0.04)",
              opacity: 0.85,
              zIndex: 2,
            }}
          />
        )}
        <button
          type="button"
          onClick={() => onOpen?.(front.id)}
          className="artifact-stack-front relative z-[3] flex min-w-[210px] items-center gap-2.5 rounded-[10px] bg-white py-2 pr-3 pl-2 text-left transition-shadow duration-200 hover:shadow-md"
          style={{
            boxShadow: "0 0 0 0.5px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)",
          }}
          aria-label={`Open ${front.title}`}
        >
          <div
            className="artifact-stack-thumb flex flex-shrink-0 items-center justify-center overflow-hidden rounded-[6px]"
            style={{
              width: 40,
              height: 40,
              background: "rgba(0,0,0,0.04)",
            }}
            aria-hidden="true"
          >
            {front.thumbnail}
          </div>
          <div className="artifact-stack-text flex min-w-0 flex-col" style={{ gap: 1 }}>
            <span
              className="artifact-stack-title text-[12.5px] leading-[1.25] font-medium"
              style={{ color: "rgba(0,0,0,0.85)" }}
            >
              {front.title}
            </span>
            {front.subtitle && (
              <span
                className="artifact-stack-subtitle text-[10.5px] leading-[1.25]"
                style={{ color: "rgba(0,0,0,0.45)" }}
              >
                {front.subtitle}
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  )
}
