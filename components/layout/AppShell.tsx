"use client"

import type { ReactNode } from "react"
import { AppSidebar } from "./AppSidebar"
import { SidebarProvider } from "@/lib/sidebar-context"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="bg-background text-foreground flex h-screen w-screen overflow-hidden">
        <AppSidebar />
        <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </SidebarProvider>
  )
}
