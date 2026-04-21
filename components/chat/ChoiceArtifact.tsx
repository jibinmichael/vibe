"use client"

/**
 * ChoiceArtifact — inline single-choice widget for assistant responses.
 *
 * Shares the same outer shell as ChartArtifact: 10px rounded, subtle
 * double shadow, #FBFBFA header with a title + language chip. Body is
 * a list of card-style options, each with a kbd-styled number chip
 * (1–9), label, and hover/selected states.
 *
 * Supports both mouse click and keyboard (digit keys map to options).
 */

import { useEffect, useState } from "react"

export type ChoiceOption = {
  id: string
  label: string
}

type ChoiceArtifactProps = {
  title: string
  question?: string
  options: ChoiceOption[]
  onSelect?: (option: ChoiceOption, index: number) => void
  selectedId?: string
}

export function ChoiceArtifact({
  title,
  question,
  options,
  onSelect,
  selectedId,
}: ChoiceArtifactProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(selectedId ?? null)
  const activeSelected = selectedId ?? internalSelected

  const handlePick = (opt: ChoiceOption, idx: number) => {
    setInternalSelected(opt.id)
    onSelect?.(opt, idx)
  }

  // Keyboard shortcuts — digit keys 1..9 pick the corresponding option.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const digit = parseInt(e.key, 10)
      if (!Number.isInteger(digit) || digit < 1 || digit > options.length) return
      const idx = digit - 1
      const opt = options[idx]
      if (!opt) return
      handlePick(opt, idx)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options])

  return (
    <div
      className="choice-artifact bg-white"
      style={{
        width: "100%",
        borderRadius: 10,
        boxShadow: "0 0 0 0.5px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <style>{`
        .choice-artifact-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 8px;
          cursor: pointer;
          transition: border-color 150ms, background 150ms;
          text-align: left;
          width: 100%;
          font-family: inherit;
        }
        .choice-artifact-option:hover {
          border-color: rgba(10,132,255,0.5);
          background: rgba(10,132,255,0.02);
        }
        .choice-artifact-option[data-selected="true"] {
          border-color: #0a84ff;
          background: rgba(10,132,255,0.06);
        }
        .choice-artifact-kbd {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 5px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.15);
          border-bottom-width: 2px;
          border-radius: 4px;
          font-family: ui-monospace, "SF Mono", Menlo, monospace;
          font-size: 11px;
          font-weight: 600;
          color: rgba(0,0,0,0.75);
          line-height: 1;
          flex-shrink: 0;
        }
        .choice-artifact-option[data-selected="true"] .choice-artifact-kbd {
          background: #0a84ff;
          border-color: #0a84ff;
          color: #fff;
        }
        .choice-artifact-label {
          font-size: 13.5px;
          color: rgba(0,0,0,0.82);
          line-height: 1.4;
        }
      `}</style>

      <div
        className="choice-artifact-head flex items-center justify-between"
        style={{
          padding: "10px 14px",
          background: "#FBFBFA",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <div className="choice-artifact-title-group flex items-center" style={{ gap: 8 }}>
          <span
            className="choice-artifact-title"
            style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.82)" }}
          >
            {title}
          </span>
          <span
            className="choice-artifact-lang-chip"
            style={{
              fontSize: 10.5,
              color: "rgba(0,0,0,0.4)",
              padding: "1px 6px",
              background: "rgba(0,0,0,0.04)",
              borderRadius: 3,
              fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
            }}
          >
            choice
          </span>
        </div>
        <span className="choice-artifact-hint" style={{ fontSize: 10.5, color: "rgba(0,0,0,0.4)" }}>
          Press 1–{options.length} or tap
        </span>
      </div>

      <div
        className="choice-artifact-body"
        style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}
      >
        {question && (
          <p
            className="choice-artifact-question"
            style={{
              fontSize: 13,
              color: "rgba(0,0,0,0.62)",
              lineHeight: 1.5,
              marginBottom: 4,
            }}
          >
            {question}
          </p>
        )}
        <div
          className="choice-artifact-options"
          style={{ display: "flex", flexDirection: "column", gap: 6 }}
        >
          {options.map((opt, idx) => {
            const isSelected = activeSelected === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                className="choice-artifact-option"
                data-selected={isSelected ? "true" : "false"}
                onClick={() => handlePick(opt, idx)}
                aria-pressed={isSelected}
              >
                <span className="choice-artifact-kbd">{idx + 1}</span>
                <span className="choice-artifact-label">{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
