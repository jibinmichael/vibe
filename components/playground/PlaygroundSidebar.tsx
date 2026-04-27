"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  AudioLines,
  BarChart3,
  CupSoda,
  FileBox,
  GitBranch,
  Home,
  LayoutList,
  Lightbulb,
  ListTree,
  MessageSquare,
  MousePointer2,
  Rss,
  Settings2,
  Sparkles,
  StickyNote,
} from "lucide-react"

import { PlanWithVibeFab } from "@/components/fab/PlanWithVibeFab"

type NavItem = { path: string; label: string; icon: LucideIcon }

const PLAYGROUND_NAV: NavItem[] = [
  { path: "/demo", label: "Demo", icon: Sparkles },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/fab", label: "FAB", icon: MousePointer2 },
  { path: "/campaign-planner", label: "Campaign planner", icon: LayoutList },
  { path: "/automation", label: "Automation", icon: AudioLines },
  { path: "/automation/chatbot-builder", label: "Chatbot builder", icon: ListTree },
  { path: "/automation/sequences-builder", label: "Sequences builder", icon: GitBranch },
  { path: "/automation/build-rules", label: "Build rules", icon: Settings2 },
  { path: "/home", label: "Home page", icon: Home },
  { path: "/vibe", label: "Vibe", icon: CupSoda },
  { path: "/conversation", label: "Conversation", icon: StickyNote },
  { path: "/artifact", label: "Artifact", icon: FileBox },
  { path: "/", label: "Chatbox", icon: MessageSquare },
  { path: "/thinking", label: "Thinking indicator", icon: Lightbulb },
  { path: "/feed", label: "Feed", icon: Rss },
]

function isActivePath(pathname: string, itemPath: string): boolean {
  if (itemPath === "/") return pathname === "/"
  return pathname === itemPath
}

export function PlaygroundSidebar() {
  const pathname = usePathname() ?? "/"
  const router = useRouter()

  return (
    <aside
      className="playground-sidebar flex w-[min(15.5rem,32vw)] shrink-0 flex-col border-r border-black/10 bg-[#FAFAF8]"
      aria-label="Playground"
    >
      <p className="shrink-0 border-b border-black/10 px-4 py-3 text-[11px] font-medium tracking-wide text-black/45">
        Playground
      </p>
      <nav
        className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-2"
        aria-label="Playground pages"
      >
        <div className="px-1 pb-2">
          <PlanWithVibeFab
            layout="inline"
            compact
            label="Ask Vibe"
            onClick={() => router.push("/home")}
          />
        </div>
        {PLAYGROUND_NAV.map((item) => {
          const active = isActivePath(pathname, item.path)
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              href={item.path}
              className={
                active
                  ? "playground-sidebar-link text-foreground flex items-center gap-2.5 rounded-md bg-black/10 px-3 py-2 text-[12.5px] font-medium"
                  : "playground-sidebar-link text-foreground flex items-center gap-2.5 rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors hover:bg-black/5"
              }
            >
              <Icon className="size-4 shrink-0 text-neutral-600" aria-hidden strokeWidth={2} />
              <span className="min-w-0 leading-snug">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
