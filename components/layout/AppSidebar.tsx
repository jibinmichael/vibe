"use client"

import { motion } from "motion/react"
import { useSidebar } from "@/lib/sidebar-context"
import { springEnter, subtleFade } from "@/lib/motion"
import { Micro } from "@/components/shared/Typography"

const SIDEBAR_EXPANDED_WIDTH = 220
const SIDEBAR_COLLAPSED_WIDTH = 56

export function AppSidebar() {
  const { expanded } = useSidebar()

  return (
    <motion.aside
      initial={false}
      animate={{ width: expanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH }}
      transition={springEnter}
      className="bg-background flex flex-shrink-0 flex-col overflow-hidden border-r"
      style={{ boxShadow: "1px 0 0 rgba(0,0,0,0.02), 4px 0 16px rgba(0,0,0,0.02)" }}
    >
      <div className="flex items-center gap-2.5 px-3 py-3">
        <div className="bg-foreground/90 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm">
          <span className="text-background text-[10px] font-semibold">v</span>
        </div>
        <motion.span
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={subtleFade}
          className="text-[13px] font-semibold tracking-tight whitespace-nowrap"
        >
          vibe
        </motion.span>
      </div>

      <div className="bg-border mx-3 h-px" />

      <nav className="flex flex-col gap-0.5 px-2 py-2">
        <SidebarRow active label="New chat" expanded={expanded} />
        <SidebarRow label="Server actions vs API" expanded={expanded} />
        <SidebarRow label="Typography tokens" expanded={expanded} />
        <SidebarRow label="Q2 roadmap planning" expanded={expanded} />
      </nav>

      <div className="flex-1" />

      <div className="bg-border mx-3 h-px" />

      <div className="flex items-center gap-2.5 px-3 py-3">
        <div className="bg-muted-foreground/40 h-5 w-5 flex-shrink-0 rounded-full" />
        <motion.span animate={{ opacity: expanded ? 1 : 0 }} transition={subtleFade}>
          <Micro muted={false} as="span" className="whitespace-nowrap">
            Jibin
          </Micro>
        </motion.span>
      </div>
    </motion.aside>
  )
}

function SidebarRow({
  label,
  active,
  expanded,
}: {
  label: string
  active?: boolean
  expanded: boolean
}) {
  return (
    <button
      type="button"
      className={[
        "flex items-center gap-2.5 overflow-hidden rounded-md px-2 py-1.5 text-left whitespace-nowrap transition-colors",
        active
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground hover:bg-accent/60",
      ].join(" ")}
    >
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
        <span className="h-2 w-2 rounded-full bg-current opacity-60" />
      </span>
      <motion.span
        animate={{ opacity: expanded ? 1 : 0 }}
        transition={subtleFade}
        className="text-[13px]"
      >
        {label}
      </motion.span>
    </button>
  )
}
