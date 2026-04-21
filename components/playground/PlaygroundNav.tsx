"use client"

/**
 * PlaygroundNav — top-left native dropdown for switching between playground pages.
 *
 * Array-driven via PAGES. To add a new page, create /app/(playground)/<slug>/page.tsx
 * and add one entry to PAGES below. The dropdown and routing pick it up automatically.
 *
 * Uses native <select> deliberately — simple, accessible, zero state.
 */

import { usePathname, useRouter } from "next/navigation"

type PlaygroundPageEntry = {
  path: string
  label: string
}

const PAGES: PlaygroundPageEntry[] = [
  { path: "/demo", label: "Demo" },
  { path: "/analytics", label: "Analytics" },
  { path: "/fab", label: "FAB" },
  { path: "/campaign-planner", label: "Campaign planner" },
  { path: "/home", label: "Home page" },
  { path: "/conversation", label: "Conversation" },
  { path: "/artifact", label: "Artifact" },
  { path: "/", label: "Chatbox" },
  { path: "/thinking", label: "Thinking indicator" },
  { path: "/feed", label: "Feed" },
  { path: "/hover-card", label: "Hover card" },
]

export function PlaygroundNav() {
  const router = useRouter()
  const pathname = usePathname()

  const currentPath = PAGES.some((p) => p.path === pathname) ? pathname : "/"

  return (
    <nav
      className="playground-nav fixed top-6 left-6 z-50 flex items-center gap-2"
      aria-label="Playground navigation"
    >
      <label
        htmlFor="playground-page-dropdown"
        className="playground-nav-label text-[11px] font-medium tracking-wide text-black/45"
      >
        Page
      </label>
      <select
        id="playground-page-dropdown"
        value={currentPath}
        onChange={(e) => router.push(e.target.value)}
        className="playground-nav-dropdown text-foreground rounded-md border border-black/10 bg-white px-2.5 py-1 text-[12.5px] font-medium transition-colors outline-none hover:border-black/20 focus:border-black/30"
      >
        {PAGES.map((p) => (
          <option key={p.path} value={p.path}>
            {p.label}
          </option>
        ))}
      </select>
    </nav>
  )
}
