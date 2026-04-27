/**
 * Playground layout — wraps every page in the (playground) route group
 * with a shared left sidebar for navigation. Adds no URL segment.
 */

import type { ReactNode } from "react"
import { PlaygroundSidebar } from "@/components/playground/PlaygroundSidebar"

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
  return (
    <div className="playground-layout flex h-svh min-h-0 w-full">
      <PlaygroundSidebar />
      <div className="playground-layout-main min-h-0 min-w-0 flex-1 overflow-auto">{children}</div>
    </div>
  )
}
