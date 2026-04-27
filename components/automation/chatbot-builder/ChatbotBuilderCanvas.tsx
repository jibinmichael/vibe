"use client"

import { useEffect, useMemo } from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Handle,
  Position,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { ArrowLeftRight, CircleHelp, MessageSquare, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export const CHATBOT_BUILD_MS = 3800

export const CHATBOT_NAME = "Welcome series"

/** Fixed node width — spacing derived so nodes and edges never intersect labels. */
const NODE_W = 220
const NODE_BODY_MIN_H = 108
/** Horizontal gap between nodes in a row */
const H_GAP = 52
/** Vertical gap between graph rows */
const V_ROW = 112

/** 11px helper — moon indigo */
const MOON_INDIGO = "text-[11px] font-normal leading-snug text-[#7174c9]"

type ChatbotNodeData = {
  ghost: boolean
  step: number
  help: string
  title: string
  subtitle: string
  icon: LucideIcon
  iconColor: string
}

const STEP_DEFS = [
  {
    id: "s1",
    step: 1,
    help: "Handshake + plan confirmation without needing a reply.",
    title: "Send a message",
    subtitle: "Welcome, locale, and expectation in ≤2 bubbles",
    icon: MessageSquare,
    iconColor: "#e11d48",
  },
  {
    id: "s2",
    step: 2,
    help: "Structured capture into profile.custom_fields.",
    title: "Ask a question",
    subtitle: "Use case, company size, implementation window",
    icon: CircleHelp,
    iconColor: "#f97316",
  },
  {
    id: "s3",
    step: 3,
    help: "Enterprise vs SMB vs ambiguous routing.",
    title: "Set a condition",
    subtitle: "Branch on segment + confidence score",
    icon: ArrowLeftRight,
    iconColor: "#4f46e5",
  },
  {
    id: "s4a",
    step: 4,
    help: "Enterprise path — CSM + security FAQ.",
    title: "Send a message",
    subtitle: "VIP: schedule CSM + shortlinks",
    icon: MessageSquare,
    iconColor: "#be185d",
  },
  {
    id: "s4b",
    step: 5,
    help: "SMB path — self-serve assets.",
    title: "Send a message",
    subtitle: "Standard: checklist + Looms",
    icon: MessageSquare,
    iconColor: "#ca8a04",
  },
  {
    id: "s4c",
    step: 6,
    help: "Fallback — queue for human review.",
    title: "Send a message",
    subtitle: "Fallback: collect email + SLA",
    icon: MessageSquare,
    iconColor: "#0d9488",
  },
  {
    id: "s5",
    step: 7,
    help: "Exit survey; respect stop keyword.",
    title: "Ask a question",
    subtitle: "NPS 0–10 + optional free text",
    icon: CircleHelp,
    iconColor: "#7c3aed",
  },
] as const

export const DEFAULT_CHATBOT_COMPOSER = [
  "We need a production WhatsApp onboarding assistant for paid signups (mixed EN-IN / EN-AE).",
  "",
  "Objectives:",
  "• Greet, confirm plan + locale, and set expectations in ≤2 outbound bubbles (typing delay 400–800ms).",
  "• Ask structured profiling: primary use case, company size bucket, preferred implementation window — persist each answer to `profile.custom_fields` with validation retries.",
  "• Branch logic: Enterprise (score ≥0.82) → copy that offers CSM scheduling + security FAQ shortlinks; SMB → self-serve checklist + Loom links; ambiguous / low confidence → fallback that collects email for human review and logs intent tags.",
  "",
  "Constraints: concise tone; no PII in outbound webhook payloads; honor opt-out/stop; degrade gracefully if templates are throttled.",
].join("\n")

/**
 * Left-to-right spine (s1→s2→s3), parallel branch row (s4a–c), merge to s5 below center.
 * Uses explicit handles so edges never cut through node bodies.
 */
function buildPositions() {
  const START_X = 64
  const START_Y = 96
  const row1y = START_Y
  const s1 = { x: START_X, y: row1y }
  const s2 = { x: START_X + NODE_W + H_GAP, y: row1y }
  const s3 = { x: START_X + 2 * (NODE_W + H_GAP), y: row1y }

  const row2y = row1y + NODE_BODY_MIN_H + 32 + V_ROW
  const s4a = { x: START_X, y: row2y }
  const s4b = { x: START_X + NODE_W + H_GAP, y: row2y }
  const s4c = { x: START_X + 2 * (NODE_W + H_GAP), y: row2y }

  const row3y = row2y + NODE_BODY_MIN_H + 28 + V_ROW
  const s5 = { x: START_X + NODE_W + H_GAP, y: row3y }

  return { s1, s2, s3, s4a, s4b, s4c, s5 }
}

function buildGraph(ghost: boolean): { nodes: Node<ChatbotNodeData>[]; edges: Edge[] } {
  const p = buildPositions()

  const nodes: Node<ChatbotNodeData>[] = STEP_DEFS.map((def) => {
    const pos =
      def.id === "s1"
        ? p.s1
        : def.id === "s2"
          ? p.s2
          : def.id === "s3"
            ? p.s3
            : def.id === "s4a"
              ? p.s4a
              : def.id === "s4b"
                ? p.s4b
                : def.id === "s4c"
                  ? p.s4c
                  : p.s5

    return {
      id: def.id,
      type: "chatbotBuilder",
      position: pos,
      data: {
        ghost,
        step: def.step,
        help: def.help,
        title: def.title,
        subtitle: def.subtitle,
        icon: def.icon,
        iconColor: def.iconColor,
      },
      draggable: true,
      selectable: true,
    }
  })

  const stroke = ghost ? "rgba(99, 102, 241, 0.35)" : "rgba(99, 102, 241, 0.85)"
  const edgeStyle = ghost ? { stroke, strokeDasharray: "6 4" as const } : { stroke }

  const edges: Edge[] = [
    {
      id: "e1",
      source: "s1",
      target: "s2",
      sourceHandle: "r",
      targetHandle: "l",
      type: "smoothstep",
      style: edgeStyle,
    },
    {
      id: "e2",
      source: "s2",
      target: "s3",
      sourceHandle: "r",
      targetHandle: "l",
      type: "smoothstep",
      style: edgeStyle,
    },
    {
      id: "e3a",
      source: "s3",
      target: "s4a",
      sourceHandle: "b",
      targetHandle: "t",
      type: "smoothstep",
      style: edgeStyle,
    },
    {
      id: "e3b",
      source: "s3",
      target: "s4b",
      sourceHandle: "b",
      targetHandle: "t",
      type: "smoothstep",
      style: edgeStyle,
    },
    {
      id: "e3c",
      source: "s3",
      target: "s4c",
      sourceHandle: "b",
      targetHandle: "t",
      type: "smoothstep",
      style: edgeStyle,
    },
    {
      id: "e4a",
      source: "s4a",
      target: "s5",
      sourceHandle: "b",
      targetHandle: "t",
      type: "smoothstep",
      style: edgeStyle,
    },
    {
      id: "e4b",
      source: "s4b",
      target: "s5",
      sourceHandle: "b",
      targetHandle: "t",
      type: "smoothstep",
      style: edgeStyle,
    },
    {
      id: "e4c",
      source: "s4c",
      target: "s5",
      sourceHandle: "b",
      targetHandle: "t",
      type: "smoothstep",
      style: edgeStyle,
    },
  ]

  return { nodes, edges }
}

function ChatbotBuilderNode({ id, data }: NodeProps<Node<ChatbotNodeData>>) {
  const { ghost, step, help, title, subtitle, icon: Icon, iconColor } = data

  const showTargetTop = id === "s4a" || id === "s4b" || id === "s4c" || id === "s5"
  const showTargetLeft = id === "s2" || id === "s3"
  const showSourceRight = id === "s1" || id === "s2"
  const showSourceBottom = id === "s3" || id === "s4a" || id === "s4b" || id === "s4c"

  return (
    <div className="relative" style={{ width: NODE_W }}>
      {showTargetTop ? (
        <Handle
          id="t"
          type="target"
          position={Position.Top}
          className="!h-2 !w-2 !border-0 !bg-indigo-400"
        />
      ) : null}
      {showTargetLeft ? (
        <Handle
          id="l"
          type="target"
          position={Position.Left}
          className="!h-2 !w-2 !border-0 !bg-indigo-400"
        />
      ) : null}
      <div
        className={cn(
          "rounded-xl border bg-white px-3 py-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]",
          ghost ? "border-dashed border-indigo-300/55" : "border-black/[0.08]",
        )}
        style={{ minHeight: NODE_BODY_MIN_H }}
      >
        {ghost ? (
          <div className="flex gap-2.5">
            <div className="flex h-9 w-9 shrink-0 animate-pulse rounded-full bg-black/[0.07]" />
            <div className="min-w-0 flex-1 space-y-2 pt-0.5">
              <div className="h-2 w-[40%] rounded bg-[#7174c9]/30" />
              <div className="h-3 w-[92%] rounded bg-black/10" />
              <div className="h-2.5 w-[78%] rounded bg-black/[0.07]" />
            </div>
          </div>
        ) : (
          <div className="flex gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.06]">
              <Icon
                className="size-[18px]"
                strokeWidth={2}
                aria-hidden
                style={{ color: iconColor }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className={MOON_INDIGO}>
                Step {step} · {help}
              </p>
              <p className="mt-1 text-[13px] leading-snug font-semibold text-[rgba(0,0,0,0.88)]">
                {title}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-black/50">{subtitle}</p>
            </div>
          </div>
        )}
      </div>
      {showSourceRight ? (
        <Handle
          id="r"
          type="source"
          position={Position.Right}
          className="!h-2 !w-2 !border-0 !bg-indigo-400"
        />
      ) : null}
      {showSourceBottom ? (
        <Handle
          id="b"
          type="source"
          position={Position.Bottom}
          className="!h-2 !w-2 !border-0 !bg-indigo-400"
        />
      ) : null}
    </div>
  )
}

const nodeTypes = { chatbotBuilder: ChatbotBuilderNode }

function ChatbotReactFlowInner({ showLive }: { showLive: boolean }) {
  const ghost = !showLive
  const { fitView } = useReactFlow()
  const { nodes: nextNodes, edges: nextEdges } = useMemo(() => buildGraph(ghost), [ghost])
  const [nodes, setNodes, onNodesChange] = useNodesState(nextNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(nextEdges)

  useEffect(() => {
    setNodes(nextNodes)
    setEdges(nextEdges)
  }, [nextNodes, nextEdges, setNodes, setEdges])

  useEffect(() => {
    const id = window.setTimeout(() => {
      void fitView({ padding: 0.2, duration: 280 })
    }, 60)
    return () => window.clearTimeout(id)
  }, [showLive, fitView])

  return (
    <ReactFlow
      className="h-full w-full touch-none"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      nodesDraggable
      nodesConnectable={false}
      elementsSelectable
      panOnScroll
      zoomOnScroll
      zoomOnPinch
      minZoom={0.25}
      maxZoom={1.35}
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={14} size={1} color="rgba(0,0,0,0.06)" />
    </ReactFlow>
  )
}

export function ChatbotFlowCanvas({ showLive }: { showLive: boolean }) {
  return (
    <div className="h-full min-h-0 w-full bg-white">
      <ReactFlowProvider>
        <ChatbotReactFlowInner showLive={showLive} />
      </ReactFlowProvider>
    </div>
  )
}

export function ChatbotBuildAgentResponse() {
  const mono = "font-mono text-[13px] font-[450]"
  return (
    <div className="w-full" style={{ padding: "8px 18px 16px" }}>
      <div
        className="w-full rounded-2xl px-4 py-3"
        style={{
          background: "rgba(0,0,0,0.04)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex flex-col gap-3">
          <p className="m-0 text-[13px] leading-[1.5] font-normal text-[rgba(0,0,0,0.88)]">
            I have created chatbot <span className={`${mono} text-[#0a84ff]`}>{CHATBOT_NAME}</span>
            {" — "}
            multi-step flow: welcome send, profiling questions, conditional branch (3 outbound
            paths), then NPS. You can edit or modify.
          </p>
          <p className="m-0 text-[13px] leading-[1.5] font-normal text-[rgba(0,0,0,0.88)]">
            You can edit or modify, or to start triggering chatbots create a rule.
          </p>
        </div>
        <div className="mt-4 flex w-full flex-col gap-2">
          <button
            type="button"
            className="w-full rounded-lg bg-[#0a84ff] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#0988f0]"
          >
            Edit chatbot
          </button>
          <button
            type="button"
            className="w-full rounded-lg border border-black/12 bg-white px-4 py-2.5 text-[13px] font-semibold text-[rgba(0,0,0,0.88)] transition-colors hover:bg-black/[0.03]"
          >
            Create a rules to trigger chatbot
          </button>
        </div>
      </div>
    </div>
  )
}
