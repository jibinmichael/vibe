"use client"

import { useSidebar } from "@/lib/sidebar-context"

export function AppSidebarToggle() {
  const { expanded, toggle } = useSidebar()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      className="text-muted-foreground hover:bg-accent flex h-7 w-7 items-center justify-center rounded-md transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6 3v10" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </button>
  )
}
