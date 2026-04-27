import type { ReactNode } from "react"

import { VibeAppShell } from "@/components/vibe/VibeAppShell"

export default function VibeLayout({ children }: { children: ReactNode }) {
  return <VibeAppShell>{children}</VibeAppShell>
}
