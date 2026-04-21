/**
 * Playground layout — wraps every page inside the (playground) route group
 * with a shared PlaygroundNav in the top-left. Adds no URL segment.
 */

import type { ReactNode } from "react"
import { PlaygroundNav } from "@/components/playground/PlaygroundNav"

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PlaygroundNav />
      {children}
    </>
  )
}
