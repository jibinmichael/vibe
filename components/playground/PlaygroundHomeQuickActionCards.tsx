"use client"

import type { LucideIcon } from "lucide-react"
import { AppWindowMac, AudioLines, PackageSearch, ToolCase } from "lucide-react"

import { cn } from "@/lib/utils"

type QuickActionItem = {
  id: string
  icon: LucideIcon
  title: string
  description: string
}

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: "create-automation",
    icon: AudioLines,
    title: "Create automation",
    description: "Build workflows, triggers, and bot paths",
  },
  {
    id: "plan-campaigns",
    icon: AppWindowMac,
    title: "Plan campaigns",
    description: "Schedule sends and align your calendar",
  },
  {
    id: "analyse-performance",
    icon: PackageSearch,
    title: "Analyse",
    description: "Review metrics, trends, and benchmarks",
  },
  {
    id: "template-generator",
    icon: ToolCase,
    title: "Template generator",
    description: "Start from reusable layouts and blocks",
  },
]

const CARD_SURFACE_CLASS = cn(
  "flex flex-col items-start gap-2 rounded-lg border border-neutral-200 bg-white p-4 text-left",
  "transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2",
)

export function PlaygroundHomeQuickActionCards({ className }: { className?: string }) {
  return (
    <div className={cn("grid w-full grid-cols-4 gap-3", className)}>
      {QUICK_ACTIONS.map((item) => {
        const Icon = item.icon
        return (
          <button key={item.id} type="button" className={CARD_SURFACE_CLASS}>
            <Icon className="size-4 shrink-0 text-neutral-400" strokeWidth={2} aria-hidden />
            <span className="text-[12px] leading-snug font-medium text-neutral-950">
              {item.title}
            </span>
            <span className="text-[12px] leading-snug text-neutral-500">{item.description}</span>
          </button>
        )
      })}
    </div>
  )
}
