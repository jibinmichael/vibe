"use client"

/**
 * Home — component playground at `/`
 *
 * Single Chatbox centered on the page. Dropdown above it switches
 * between component states. Extensible: add new states to the array.
 *
 * Every element has a `playground-` prefixed class name so you can
 * jump in and style any piece directly.
 */

import { SquareDashedMousePointer } from "lucide-react"
import { useState } from "react"
import { ArtifactStack, type Artifact } from "@/components/chat/ArtifactStack"
import type { ChatboxChip } from "@/components/chat/Chatbox"
import { Chatbox } from "@/components/chat/Chatbox"

type PlaygroundState = {
  id: string
  label: string
  description: string
  disabled: boolean
  rotatePlaceholder: boolean
}

const STATES: PlaygroundState[] = [
  {
    id: "default",
    label: "Default — home page",
    description:
      "Rotating placeholders, tab-to-fill suggestions, mic with Stop pill, Skills button, send button. The full affordance.",
    disabled: false,
    rotatePlaceholder: true,
  },
  {
    id: "chat-view",
    label: "Chatbox while AI responding",
    description:
      "Textarea accepts input but mic and send are disabled — user can type a follow-up but can't send or start voice while the AI is still responding. Static 'Ask a follow-up question' placeholder.",
    disabled: true,
    rotatePlaceholder: false,
  },
  {
    id: "chip",
    label: "Chatbox with attachment chip",
    description:
      "Chip sits inside the chatbox above the textarea — represents a generic attachment (file, saved view, chart selection, etc.). Click × on the chip to remove it. Click the button below to restore.",
    disabled: false,
    rotatePlaceholder: false,
  },
  {
    id: "artifact-stack",
    label: "Chatbox with artifact stack",
    description:
      "Right-aligned stack of artifact preview cards above the chatbox. Front card is full-sized with thumbnail. Up to 2 more peek out behind. Click the front card to 'open' (alert for now). Use the count buttons to see 1, 2, and 3 artifact states.",
    disabled: false,
    rotatePlaceholder: false,
  },
]

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<string>("default")
  const [value, setValue] = useState("")
  const [chipValue, setChipValue] = useState("")
  const [hasChip, setHasChip] = useState(true)
  const [artifactCount, setArtifactCount] = useState(3)

  const selected = STATES.find((s) => s.id === selectedId) ?? STATES[0]!

  const attachmentChip: ChatboxChip | null = hasChip
    ? {
        label: chipValue.trim() ? chipValue : "Product Launch campaign",
        icon: (
          <SquareDashedMousePointer
            aria-hidden
            size={12}
            strokeWidth={1.5}
            className="shrink-0 text-current"
          />
        ),
        onRemove: () => setHasChip(false),
      }
    : null

  const mockArtifacts: Artifact[] = Array.from({ length: artifactCount }, (_, i) => ({
    id: `artifact-${i}`,
    title: i === artifactCount - 1 ? "Campaigns — last 30 days" : `Artifact ${i + 1}`,
    ...(artifactCount > 1 ? { subtitle: `${artifactCount - 1} more` } : {}),
    thumbnail: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="11" width="4" height="10" rx="1" fill="#5aaaff" />
        <rect x="10" y="5" width="4" height="16" rx="1" fill="#0a84ff" />
        <rect x="17" y="14" width="4" height="7" rx="1" fill="#bfd8f5" />
      </svg>
    ),
  }))

  return (
    <div className="playground-page flex min-h-screen flex-col items-center justify-center px-8 py-16">
      <div className="playground-container flex w-full max-w-[680px] flex-col gap-8">
        <header className="playground-header flex flex-col gap-2">
          <h1 className="playground-title text-foreground text-[24px] font-semibold tracking-tight">
            Chatbox
          </h1>
          <p className="playground-subtitle text-[13px] leading-[1.55] text-black/55">
            {selected.description}
          </p>
        </header>

        <div className="playground-state-selector flex items-center gap-3">
          <label
            htmlFor="state-dropdown"
            className="playground-state-label text-[12px] font-medium text-black/55"
          >
            State
          </label>
          <select
            id="state-dropdown"
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value)
              setValue("")
              setHasChip(true)
              setChipValue("")
              setArtifactCount(3)
            }}
            className="playground-state-dropdown text-foreground rounded-md border border-black/10 bg-white px-3 py-1.5 text-[13px] font-medium transition-colors outline-none hover:border-black/20 focus:border-black/30"
          >
            {STATES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="playground-chatbox-stage flex flex-col">
          {selectedId === "artifact-stack" && (
            <ArtifactStack
              artifacts={mockArtifacts}
              onOpen={(id) => alert(`Open artifact: ${id}`)}
            />
          )}
          <Chatbox
            key={selected.id}
            onSend={(text) => alert(`[${selected.label}] Sent: ${text}`)}
            disabled={selected.disabled}
            rotatePlaceholder={selected.rotatePlaceholder}
            value={value}
            onValueChange={setValue}
            chip={selectedId === "chip" ? attachmentChip : null}
          />
          {selectedId === "chip" && !hasChip && (
            <button
              type="button"
              onClick={() => setHasChip(true)}
              className="playground-chip-restore mt-3 text-[12px] text-black/45 underline hover:text-black/70"
            >
              Restore chip
            </button>
          )}
          {selectedId === "artifact-stack" && (
            <div className="playground-artifact-count-controls mt-4 flex items-center gap-2">
              <span className="text-[12px] text-black/45">Stack size:</span>
              <button
                type="button"
                onClick={() => setArtifactCount(1)}
                className={`rounded-md px-2.5 py-1 text-[12px] ${
                  artifactCount === 1 ? "bg-black/10 font-medium" : "bg-black/5 hover:bg-black/10"
                }`}
              >
                1
              </button>
              <button
                type="button"
                onClick={() => setArtifactCount(2)}
                className={`rounded-md px-2.5 py-1 text-[12px] ${
                  artifactCount === 2 ? "bg-black/10 font-medium" : "bg-black/5 hover:bg-black/10"
                }`}
              >
                2
              </button>
              <button
                type="button"
                onClick={() => setArtifactCount(3)}
                className={`rounded-md px-2.5 py-1 text-[12px] ${
                  artifactCount === 3 ? "bg-black/10 font-medium" : "bg-black/5 hover:bg-black/10"
                }`}
              >
                3
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
