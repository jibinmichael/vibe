"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type SidebarContextValue = {
  expanded: boolean
  toggle: () => void
  setExpanded: (value: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

const STORAGE_KEY = "vibe:sidebar-expanded"

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpandedState] = useState<boolean>(true)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (stored !== null) {
          setExpandedState(stored === "true")
        }
      } catch {}
      setHydrated(true)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, String(expanded))
    } catch {}
  }, [expanded, hydrated])

  const value: SidebarContextValue = {
    expanded,
    toggle: () => setExpandedState((prev) => !prev),
    setExpanded: setExpandedState,
  }

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext)
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return ctx
}
